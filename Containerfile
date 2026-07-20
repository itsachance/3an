FROM golang AS builder
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /trean ./cmd/web/
RUN go install github.com/pressly/goose/v3/cmd/goose@v3.27.1
RUN echo "appuser:x:65534:65534:Appuser:/:" > /etc_passwd
FROM scratch
COPY --from=builder /trean /trean
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /etc_passwd /etc/passwd
COPY ui/ /ui/
WORKDIR /
USER appuser
VOLUME /data
EXPOSE 5500
ENTRYPOINT ["/trean"]
LABEL org.opencontainers.image.source=https://github.com/itsachance/3an
