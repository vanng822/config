## config
Load, create, merge configuration files in json format. Can read simple ini format file and convert it to json.

## Usage example
	var Config = require('config').Config;
	var c = new Config(['all.js', 'production.js'], __dirname + '/config');
	console.log(c.host);
	console.log(c.port);
	

## class
### Config(files, path)
* `files` array of configuration filenames
* `path` path to files given above
 

## methods
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
Async version of ini2json
* `filename`
* Return Config

### json2ini(obj)
Create a string in ini-format of the given obj
* `obj` object to create ini-formatted string
* Return ini-formatted string

### scandir(path)
Scan entire directory for configuration files with extension .js
* `path` path of the directory to scan for configurations
* Return Config
