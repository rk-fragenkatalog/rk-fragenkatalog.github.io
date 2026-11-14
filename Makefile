# DEPENDENCIES
# - TypeScript compiler
# - bun

.PHONY: all compile server clean

all: build/index.js build/practice.js build/exam.js

compile:
	tsc

build/index.js: compile
	@mkdir -p $(dir $@)
	cp src/quiz/index.js $@

build/practice.js: compile
	@mkdir -p $(dir $@)
	bunx -y browserify src/quiz/practice.js -o $@

build/exam.js: compile
	@mkdir -p $(dir $@)
	bunx -y browserify src/quiz/exam.js -o $@

server:
	bunx -y live-server

clean:
	rm -f src/quiz/*.js
	rm -rf build/
