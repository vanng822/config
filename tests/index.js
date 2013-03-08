var config = require('../lib/config.js');

var vows = require('vows');
var assert = require('assert');

vows.describe('Configuration test suite').addBatch({
	'testOverrideProperty' : function() {
		var obj = {
			http : {
				'host' : '127.0.0.1',
				'port' : 8000
			},
			stat : 0
		};
		config.overrideProperty(obj, 'stat', 1);
		assert.deepEqual(obj, {
			http : {
				'host' : '127.0.0.1',
				'port' : 8000
			},
			stat : 1
		});
	},
	'testOverrideObject' : function() {
		var obj = {
			http : {
				host : '127.0.0.1',
				port : 8000
			},
			stat : 0
		};
		config.overrideObject(obj, {
			http : {
				port : 3000
			}
		});
		assert.deepEqual(obj, {
			http : {
				'host' : '127.0.0.1',
				'port' : 3000
			},
			stat : 0
		});
	},
	'testConfig' : function() {
		var c = new config.Config(['all.js', 'production.js'], __dirname + '/data');
		assert.deepEqual(c, {
			'host' : '127.0.0.1',
			'port' : 8000
		});
	}
}).addBatch({
	'ini2json' : {
		topic : function() {
			config.ini2json(__dirname + '/data/config.ini', this.callback);
		},
		'should return an object of' : function(err, obj) {
			assert.ok(!err);

			assert.deepEqual(obj, {
				http : {
					host : '127.0.0.1',
					port : '3000'
				},
				db : {
					host : 'localhost',
					port : '3069'
				},
				translation : {
					NEXT : 'next',
					NEWLINE : "test\ntesting"
				}
			});
		}
	},
	'ini2jsonSync' : function() {
		assert.deepEqual(config.ini2jsonSync(__dirname + '/data/config.ini'), {
			http : {
				host : '127.0.0.1',
				port : '3000'
			},
			db : {
				host : 'localhost',
				port : '3069'
			},
			translation : {
				NEXT : 'next',
				NEWLINE : "test\ntesting"
			}
		});
	},
	'json2ini' : function() {
		assert.equal(config.json2ini({
			test : {
				t : 1,
				t2 : 2,
				t3 : {
					s : 2,
					s2 : "testing\ntsting\ntesting"
				}
			},
			test2 : 2
		}), "test.t=1\ntest.t2=2\ntest.t3.s=2\ntest.t3.s2=testing\\ntsting\\ntesting\ntest2=2");
	},
	'jsonArray2ini' : function() {
		assert.equal(config.json2ini({
			test : [10, 20, 40, 80, 160],
			test2 : ['testing', 'test']
		}), "test.0=10\ntest.1=20\ntest.2=40\ntest.3=80\ntest.4=160\ntest2.0=testing\ntest2.1=test");
	}
}).addBatch({
	'scandirBoth' : function() {
		var c = config.scandir(__dirname + '/data');
		assert.deepEqual(c, {
			db : {
				host : 'localhost',
				port : '3069'
			},
			http : {
				host : '127.0.0.1',
				port : '3000'
			},
			host : '127.0.0.1',
			cssMaxAge : 31557600000,
			jsMaxAge : 31557600000,
			translation : {
				NEXT : 'next',
				NEWLINE : 'test\ntesting'
			},
			extra : {
				ini : {
					file : 'true'
				}
			},
			port : 8000
		});
	},
	'scandirIni' : function() {
		var c = config.scandir(__dirname + '/data', 'ini');
		assert.deepEqual(c, {
			db : {
				host : 'localhost',
				port : '3069'
			},
			http : {
				host : '127.0.0.1',
				port : '3000'
			},
			translation : {
				NEXT : 'next',
				NEWLINE : 'test\ntesting'
			},
			extra : {
				ini : {
					file : 'true'
				}
			}
		});
	},
	'scandirJs' : function() {
		var c = config.scandir(__dirname + '/data', 'js');
		assert.deepEqual(c, {
			host : '127.0.0.1',
			cssMaxAge : 31557600000,
			jsMaxAge : 31557600000,
			port : 8000
		});
	},
}).export(module);
