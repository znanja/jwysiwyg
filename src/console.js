var console = (('console' in window) && @DEBUG) ? window.console : {
	log: $.noop,
	error: $.noop,
	warn: $.noop,
	info: $.noop,
	time: $.noop,
	timeEnd: $.noop,
	assert: $.noop
};

