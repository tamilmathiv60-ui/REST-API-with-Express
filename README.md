# REST API with Express

CRUD API over one resource (`books`), JSON in / JSON out, with proper status codes.

## Run

```bash
npm install
npm start
```

Server: http://localhost:3000 (demo page) — API under `/api/books`.

## Endpoints

| Method | Route            | Success | Errors                  |
|--------|------------------|---------|-------------------------|
| GET    | /api/books       | 200     |                         |
| GET    | /api/books/:id   | 200     | 404 not found           |
| POST   | /api/books       | 201     | 400 invalid body        |
| PUT    | /api/books/:id   | 200     | 400 invalid, 404 missing|
| DELETE | /api/books/:id   | 200     | 404 missing             |

## curl examples

```bash
curl http://localhost:3000/api/books
curl -X POST http://localhost:3000/api/books -H "Content-Type: application/json" \
  -d '{"title":"Refactoring","author":"Martin Fowler","year":1999}'
curl -X PUT http://localhost:3000/api/books/1 -H "Content-Type: application/json" \
  -d '{"title":"Clean Code","author":"Robert C. Martin","year":2009}'
curl -X DELETE http://localhost:3000/api/books/2
curl -i http://localhost:3000/api/books/999   # 404
```
