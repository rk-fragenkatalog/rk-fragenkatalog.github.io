.PHONY: all compile clean

all: compile files/index.js files/practice.js files/exam.js

compile:
	tsc

files/index.js: dev/dynamic/index.js
	cp $< $@

files/practice.js: dev/dynamic/practice.js
	browserify $< -o $@

files/exam.js: dev/dynamic/exam.js
	browserify $< -o $@

clean:
	rm -f dev/dynamic/*.js
	rm -f files/*.js
