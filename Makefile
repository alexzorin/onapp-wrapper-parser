.PHONY: clean all generate deps

all: generate

clean:
	rm -rf generated _scratch 

generate: clean deps
	mkdir _scratch generated;
	git clone --depth 1 https://github.com/OnApp/OnApp-PHP-Wrapper-External.git _scratch/OnApp-PHP-Wrapper-External
	php code_to_ast.php
	node ast_to_structures.js
	rm -rf _scratch
	chown -R nobody:nobody generated/

deps:
	npm install
	composer install
