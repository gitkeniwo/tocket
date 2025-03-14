# backend/Dockerfile

# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
ENV CGO_ENABLED=0

# Copy Go modules and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code and build the binary
COPY . .
RUN go build -o tocket .

# Run stage
FROM alpine:latest
WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /app/tocket .

# Expose the backend port
EXPOSE 8080

# Run the binary
CMD ["./tocket"] 