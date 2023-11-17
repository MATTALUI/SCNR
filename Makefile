build: format build-ui
	go build .
run: build
	./scnr
run-dev: format
	go build .
	concurrently "./scnr" "bun build ./ui/targets/*.ts --outdir ./static/js/ --minify --watch"
format:
	go fmt .
build-ui:
	bun build ./ui/targets/*.ts --outdir ./static/js/ --minify
install:
	bun install -g concurrently
	go mod download
clean:
	rm ./static/js/main.js 