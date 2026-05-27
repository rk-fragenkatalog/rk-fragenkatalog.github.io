# DEPENDENCIES
# - typescript compiler
# - bun

.PHONY: all compile server clean

all: compile files/index.js files/practice.js files/exam.js

compile:
	tsc

files/index.js: dev/dynamic/index.js
	cp $< $@

files/practice.js: dev/dynamic/practice.js
	bunx -y browserify $< -o $@

files/exam.js: dev/dynamic/exam.js
	bunx -y browserify $< -o $@

server:
	bunx -y live-server

clean:
	rm -f dev/dynamic/*.js
	rm -f files/*.js
