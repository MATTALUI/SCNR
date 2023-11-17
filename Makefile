export GOMOD=./src/go.mod

build: format
	go build -o ./scnr ./src/service
run: build
	./scnr
run-dev: build
	concurrently "./scnr" "bun build ./src/ui/targets/*.ts --outdir ./src/static/js/ --minify --watch"
format:
	go fmt ./src/service
build-ui:
	bun build ./src/ui/targets/*.ts --outdir ./src/static/js/ --minify
install:
	bun install -g concurrently
	go mod download
clean:
	rm -f ./scnr
	rm -f ./src/static/js/*.js