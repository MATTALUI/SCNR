FROM    golang:1.18.4 AS basePhase
WORKDIR /scnr/
COPY    src .
COPY    go.mod .
COPY    go.sum .
COPY    Makefile .
RUN     go mod download
RUN     go install github.com/mitranim/gow@latest
RUN     go build .
EXPOSE  1337
CMD     gow run ./src/service