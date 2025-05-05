FROM oven/bun:latest AS frontend-builder

WORKDIR /frontend

COPY frontend/ .

RUN bun install
RUN bun run build

# Backend stage
FROM python:3.11-slim

WORKDIR /app


COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app/ ./app/

COPY --from=frontend-builder /frontend/dist/ ./static/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
