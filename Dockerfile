# Build frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build backend
FROM golang:1.21-alpine as backend-builder
WORKDIR /app
COPY backend/ ./
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
RUN go mod download
# No need for CGO_ENABLED=1 with modernc.org/sqlite
RUN go build -o main .

# Final stage
FROM alpine:latest
# No need for sqlite-libs with modernc.org/sqlite
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY --from=backend-builder /app/main .
COPY --from=backend-builder /app/frontend/dist ./frontend/dist

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 8080

CMD ["./main"] 