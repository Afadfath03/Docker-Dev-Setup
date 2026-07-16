# QA Playground

QA test playground dengan form elements lengkap, dummy data generator via Faker.js, dan mock REST API via JSON Server.

## Services

| Container | Fungsi | Port |
|---|---|---|
| `qa-playground` | Form test page (nginx, static HTML) | `8088` |
| `qa-json-server` | Mock REST API (JSON Server) | `3003` |

## Setup

```bash
cp -n .env.example .env 2>/dev/null; true  # no secrets needed
docker compose up -d
```

## Akses

| Tujuan | URL |
|---|---|
| Form Test Page | `http://<ip>:8088` |
| JSON Server API | `http://<ip>:3003` |
| Users API | `http://<ip>:3003/users` |
| Products API | `http://<ip>:3003/products` |
| Orders API | `http://<ip>:3003/orders` |
| Posts API | `http://<ip>:3003/posts` |
| Categories API | `http://<ip>:3003/categories` |

## Fitur

### Form Test Page (`:8088`)
- Semua HTML5 input types: text, email, password, number, tel, url, search, date, time, color, range, file
- Checkboxes (single, group, indeterminate), radio buttons
- Select dropdown (single, multiple with optgroup), datalist
- Textarea (berbagai ukuran, readonly, disabled)
- Form validation: required, pattern, minlength, maxlength, min, max, step
- Progress bar, meter, details/summary
- **Dummy Data**: tombol generate per field type atau fill all dengan data realistis dari Faker.js
- **API Demo**: menampilkan data dari JSON Server di halaman yang sama

### JSON Server API (`:3003`)
Fake REST API dengan full CRUD support. Query parameters:
- Filter: `GET /users?role=admin`
- Pagination: `GET /products?_page=1&_per_page=5`
- Sort: `GET /products?_sort=price`
- Relasi: `GET /users?_embed=orders`
- CORS enabled (bisa dipanggil dari frontend mana pun)

## JSON Server Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/users` | List users |
| `GET` | `/users/:id` | User by ID |
| `POST` | `/users` | Create user |
| `PUT` | `/users/:id` | Update user |
| `PATCH` | `/users/:id` | Partial update |
| `DELETE` | `/users/:id` | Delete user |
| `GET` | `/products` | List products |
| `POST` | `/products` | Create product |
| — | ... | (sama untuk orders, posts, categories) |

## Resource limits

| Container | Memory |
|---|---|
| qa-playground | 32M |
| qa-json-server | 128M |
