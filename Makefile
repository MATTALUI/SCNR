build: format build-ui
	go build .
run: build
	./scnr
run-dev: format
	go build .
	concurrently "./scnr" "bun build ./ts/main.ts --outfile ./static/js/main.js --watch"
format:
	go fmt .
build-ui: main.js
main.js:
	bun build --minify ./ts/main.ts --outfile ./static/js/main.js
install:
	bun install -g concurrently
clean:
	rm ./static/js/main.js 