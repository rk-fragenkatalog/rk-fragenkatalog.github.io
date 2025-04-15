TYPSCRIPT_FILES := $(wildcard dev/dynamic/*.ts)

.PHONY: all

all: files/bundle.js

files/bundle.js: $(TYPSCRIPT_FILES:.ts=.js)
	browserify dev/dynamic/main.js -o $@

%.js: %.ts
	tsc
