## config
Load and merge configuration files in js (need to export using module.exports). Can read simple ini format file and convert it to object.

[![build status](https://secure.travis-ci.org/vanng822/config.png)](http://travis-ci.org/vanng822/config)


## Usage example
	var Config = require('vnfconfig').Config;
	var c = new Config(['all.js', 'production.js'], __dirname + '/config');
	console.log(c.host); // output 127.0.0.1
	console.log(c.port); // output 8000

all.js
	
	module.exports = {
		'host' : '127.0.0.1',
		'port' : 3000
	};
	
production.js
	
	module.exports = {
		'port': 8000
	};

## Classes
### Config(files, path)
* `files` array of configuration filenames
* `path` path to files given above
 

## Functions
### overrideObject(obj, source1, source2, ...)
Override `obj` with properties in source1, source2 and so on

### overrideProperty(obj, prop, value)
Override a property in `obj`. Adding property if it does not exist

* `obj` object to override
* `prop` name of property to override
* `value` value of the property

### ini2json(filename, callback)

* `filename`
* `callback(Error, Config)` passing Config if success 

### ini2jsonSync(filename)
Sync version of ini2json

* `filename`
* `Return` Config

### json2ini(obj)
Create a string in ini-format of the given obj

* `obj` object to create ini-formatted string
* `Return` ini-formatted string

### scandir(path)
Scan entire directory for configuration files with extension .js
Those files need to export an object of configurations

* `path` path of the directory to scan for configurations
* `Return` Config
