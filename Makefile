
VOWS=./node_modules/vows/bin/vows

TEST_SUITES=$(shell find tests/*.js)

test:
	 $(foreach F, ${TEST_SUITES}, $(VOWS) $(F);)

.PHONY: test

