
FROM golang:1.22-alpine

WORKDIR /app

COPY go.mod ./ 

RUN go mod download

COPY . .

RUN go install github.com/cosmtrek/air@v1.29.0

EXPOSE 8080

CMD ["air", "-c", ".air.toml"]
