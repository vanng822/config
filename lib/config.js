var fs = require('fs'), fspath = require('path');

function isObject(testObj) {
	return typeof testObj == 'object';
}

function overrideProperty(obj, prop, value) {
	if(!obj.hasOwnProperty(prop)) {
		obj[prop] = value;
		return;
	}
	/* deep override only when matching type object */
	if(isObject(value) && isObject(obj[prop])) {
		overrideObject(obj[prop], value);
		return;
	}
	obj[prop] = value;
}

function overrideObject(obj) {
	var i, len, source, j, jlen, props;
	for( i = 1, len = arguments.length; i < len; i++) {
		source = arguments[i];
		props = Object.keys(source);
		for( j = 0, jlen = props.length; j < jlen; j++) {
			overrideProperty(obj, props[j], source[props[j]]);
		}
	}
}

function parseIni(data) {
	var root = new Config([]), lines, currentSection, lineNo = 0;
	var i, len, props, section, obj, line, jlen;
		
	lines = data.split("\n");

	for( j = 0, jlen = lines.length; j < jlen; j++) {
		line = lines[j];
		obj = (currentSection) ? root[currentSection] : root;
		lineNo++;
		line = line.trim();
		/* ; and # is comments */
		if(line && line[0] != ';' && line[0] != '#') {
			if(( section = line.match(/^\[(.+)\]$/))) {
				if(currentSection) {
					/* new section; reset obj to root */
					obj = root;
				}
				currentSection = section[1];
				obj[currentSection] = {};
				continue;
			}
			line = line.split('=');
			if(line.length < 2) {
				throw new Error('Error parsing config at line: ' + lineNo);
				return;
			}
			props = line[0].trim().split('.');
			value = line.slice(1).join('=').trim();
			for( i = 0, len = props.length - 1; i < len; i++) {
				if(!obj[props[i]]) {
					obj[props[i]] = {};
				}
				obj = obj[props[i]];
			}
			obj[props[i]] = unescapeIniValue(value);
		}
	}
	return root;
}

function ini2json(filename, callback) { 
	fs.readFile(filename, 'utf8', function(err, data) {
		if(err) {
			callback(err, null);
			return;
		}
		try {
			callback(null, parseIni(data));
		} catch(e) {
			callback(e, null);
		}
	});
}

function ini2jsonSync(filename) {
	return parseIni(fs.readFileSync(filename, 'utf8'));
}

function unescapeIniValue(value) {
	return String(value).replace(/\\t/g, "\t").replace(/\\n/g, "\n").replace(/\\r/g, "\r");
}

function escapeIniValue(value) {
	return String(value).replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
}

function json2ini(obj) {
	var kv = [];
	json2iniIterate('', '', obj, function(err, key, value) {
		if(err) {
			console.log(err);
			return;
		}
		kv.push(key + '=' + escapeIniValue(value));
	});
	return kv.join("\n");
}

function json2iniIterate(prekey, key, value, donecb) {
	var prekey = prekey ? prekey + '.' + key : key;
	var i, props, len;
	if(isObject(value)) {
		props = Object.keys(value);
		for( i = 0, len = props.length; i < len; i++) {
			json2iniIterate(prekey, props[i], value[props[i]], donecb);
		}
		return;
	}
	donecb(null, prekey, value);
}

function Config(files, path) {
	var i, len, filename;
	for( i = 0, len = files.length; i < len; i++) {
		filename = files[i];
		if(path) {
			filename = path + '/' + filename;
		}
		overrideObject(this, require(filename));
	}
}

function scandir(path) {
	var jsfiles = [], i, len, files;
	if(!fs.existsSync(path)) {
		throw new Error('Path does not exists');
	}
	files = fs.readdirSync(path);

	for( i = 0, len = files.length; i < len; i++) {
		if(fspath.extname(files[i]) == '.js') {
			jsfiles.push(files[i]);
		}
	}

	return new Config(jsfiles, path);
};

module.exports = {
	Config : Config,
	overrideObject : overrideObject,
	overrideProperty : overrideProperty,
	ini2json : ini2json,
	ini2jsonSync : ini2jsonSync,
	json2ini : json2ini,
	scandir : scandir
};
