#!/bin/bash
# DNS watchdog: auto-switch between Technitium DNS and systemd-resolved
# When technitium-dns runs  → disable resolved stub (port 53 free for Docker)
# When technitium-dns stops → enable resolved stub (machine keeps DNS)
#
# Runs as root via systemd timer (dns-watch.timer) every 1 minute.
# systemd-resolved is only restarted when the state changes.

CONTAINER="technitium-dns"
CONFIG_FILE="/etc/systemd/resolved.conf"
STATE_FILE="/var/run/dns-watch.state"

docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null | grep -q true && RUNNING=true || RUNNING=false

[ -f "$STATE_FILE" ] && PREV=$(cat "$STATE_FILE") || PREV="unknown"

if $RUNNING; then
    if [ "$PREV" != "technitium" ]; then
        grep -q "^DNSStubListener=no$" "$CONFIG_FILE" || echo "DNSStubListener=no" >> "$CONFIG_FILE"
        systemctl restart systemd-resolved
        echo "technitium" > "$STATE_FILE"
    fi
else
    if [ "$PREV" != "resolved" ]; then
        sed -i '/^DNSStubListener=no$/d' "$CONFIG_FILE"
        systemctl restart systemd-resolved
        echo "resolved" > "$STATE_FILE"
    fi
fi
