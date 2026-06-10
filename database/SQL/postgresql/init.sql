CREATE TABLE IF NOT EXISTS dummy (
    id SERIAL PRIMARY KEY,
    description VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO dummy (description) VALUES ('test entry');