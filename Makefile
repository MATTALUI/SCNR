build:
	go build .
run: format build
	./scnr
format:
	go fmt .