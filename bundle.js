(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
module.exports = require('./lib/email-validation');

},{"./lib/email-validation":3}],3:[function(require,module,exports){
var util = require('util');
var email = module.exports = function() {};

var strToObj = function(str) {
  var obj = {};
  for(var i = 0; i < str.length; i++) {
    obj[str[i]] = str.charCodeAt(i);
  }
  return obj;
};

var chars = strToObj("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+-/=?^_`{|}~.");
var specialchars = strToObj("\\\"(),:;<>@[\] ");
var escapers = strToObj('\\"');
var hostchars = strToObj("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-");

email.parse = function(address, dothrow, callback) {
  callback = (typeof callback == 'undefined' && typeof dothrow == 'function') ? dothrow : null;
  var userland = true;
  var quotation = false;
  var escaped = false;
  var _user = "", _domain = "";
  var hostisip = false;
  var hoststartpos = 0;
  try {
    if(address.length >= 254) throw util.format("[Error parsing email address: address is longer than 253, actual]", address.length);
    for(var i = 0; i < address.length; i++) {
      //console.log(i, address[i])
      if(userland) {
        if(address[i] == '"' && i == 0) { quotation = true; _user += address[i]; continue; }
        if(typeof chars[address[i]] != 'undefined') { //needed I'm sure.
          _user += address[i]; continue;
        } else if(typeof specialchars[address[i]] != 'undefined') {
          if(quotation) {
            if(!escaped && address[i] == "\\") { escaped = true; _user += address[i]; continue; }
            if(!escaped && address[i] == '"' && address[i+1] == "@") { userland = false; hoststartpos = i+2; _user += address[i]; i+=1; continue; }
            if(escaped && typeof escapers[address[i]] != 'undefined') { escaped = false; _user += address[i]; continue; }
            if(!escaped && typeof escapers[address[i]] != 'undefined') throw util.format("[Error parsing email address: invalid use of %s (pos: %s)]", address[i], i, address);
          } else if(address[i] == "@" && !quotation) {
            userland = false;
            hoststartpos = i+1;
            continue;
          } else {
            throw util.format("[Error parsing email address: special character '%s' (pos: %s) used without quotation marks]", address[i], i);
          }
        } else {
          throw util.format("[Error parsing email address: character '%s' (pos: %s) is not allowed in an email address user space.]", address[i], i, address);
        }
        _user += address[i];
      } else { //parsing hostname. Probably could be done with regex.
        if(i == hoststartpos && address[i] == '[') { hostisip = true; hostchars['['] = '['; hostchars[']'] = ']'; hostchars[':'] = ':'; _domain += address[i]; continue; }
        if(typeof hostchars[address[i]] == 'undefined') throw util.format("[Error parsing email address: character '%s' (pos: %s) is not allowed in the hostname section]", address[i], i);
        if(i >= hoststartpos && /[@\.]/.test(address[i - 1]) && !/[a-z0-9]/i.test(address[i])) throw util.format("[Error parsing email address: All domain segments must start with a letter or number, never a symbol like '%s'.")
        _domain += address[i];
      }
    }
    if(_domain === '') throw util.format("[Error parseing email address: no domain part]", address);
    if(hostisip && !require('net').isIP(address.substring(hoststartpos+1,address.length-1))) throw util.format("[Error parsing email address: invalid IP address]");
    if(hostisip && address[address.length-1] != "]") throw util.format("[Error parsing email address: IP address notation must end with a ']']");
    if(!hostisip && (/^.+@([a-z0-9]{64,}(|\.))/i).test(address)) throw util.format("[Error parsing email address: hostname has elements greater than 63 characters]");
    if(userland) throw util.format("[Error parsing email address: quotation mark not closed]" , address);
  } catch (err) {
    if(callback) callback(err);
    if(typeof dothrow != 'undefined' && typeof dothrow != 'function') throw err;
    return false; //redundant?
  }
  if(callback) callback(null, {user: _user, domain: _domain});
  else return {user: _user, domain: _domain};
}

email.valid = function(address, dothrow, callback) {
  return !!email.parse(address, dothrow, callback);
}

},{"net":1,"util":7}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],6:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],7:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":6,"_process":4,"inherits":5}],8:[function(require,module,exports){
module.exports = function(widget, pane) { 
    this.widget = widget;
    this.pane = pane;

    setupSelectSplitCheckbox();

    pane.dispatchEvent(new CustomEvent('ready', pane));

    return {
        submit: submitAmount,
        focus: focusAmount,
        widget: widget,
        pane: pane
    } 
}

function submitAmount() {
    var widget = this.widget;
    var pane = this.pane;

    var nxtBtn = pane.getElementsByClassName("btn")[0];
    nxtBtn.classList.add("loading");

    widget.donationAmount = parseInt(pane.getElementsByClassName("amount")[0].value);

    if (widget.donationAmount > 0) {
        if (widget.submitOnAmount) {
            widget.panes[2].classList.add("hidden");
            widget.postDonation({
                donor: {
                    name: widget.name,
                    email: widget.email
                },
                amount: widget.donationAmount
            }, nxtBtn);
        } else {
            widget.nextSlide();

            setTimeout(function() {
                nxtBtn.classList.remove("loading");
            }, 200);
        }
    }
    else {
        widget.error("Du må angi en sum");
        nxtBtn.classList.remove("loading");
    }
}

function focusAmount() {
    var widget = this.widget;
    var pane = this.pane;

    var input = pane.getElementsByClassName("amount")[0];

    widget.element.style.height = "";

    setTimeout(function () {
        input.focus();
    }, 200);
}

/* Setup select split checkbox */
function setupSelectSplitCheckbox() {
    var widget = this.widget;

    var selectSplit = document.getElementById("check-select-split");
    var selectRecommended = document.getElementById("check-select-recommended");

    selectSplit.addEventListener("change", function(e) {
        widget.element.getElementsByClassName("shares")[0].classList.remove("hidden");
        widget.submitOnAmount = false;
        widget.activePanes++;
        widget.updateSliderProgress();
    });

    selectRecommended.addEventListener("change", function(e) {
        widget.element.getElementsByClassName("shares")[0].classList.add("hidden");
        widget.submitOnAmount = true;
        widget.activePanes--;
        widget.updateSliderProgress();
    })
}
},{}],9:[function(require,module,exports){
var emailvalidation = require('email-validation');

module.exports = function(widget, pane) {
    this.widget = widget;
    this.pane = pane;

    if (window.localStorage) {
        pane.getElementsByClassName("name")[0].value = window.localStorage.getItem("donation-name");
        pane.getElementsByClassName("email")[0].value = window.localStorage.getItem("donation-email");
    }

    pane.dispatchEvent(new CustomEvent('ready', pane));

    return {
        submit: submitUser,
        focus: focusUser,
        pane: pane,
        widget: widget
    }
}

function submitUser() {
    var pane = this.pane;
    var widget = this.widget;

    var nxtBtn = pane.getElementsByClassName("btn")[0];
    nxtBtn.classList.add("loading");

    var email = pane.getElementsByClassName("email")[0].value.trim();
    var name = pane.getElementsByClassName("name")[0].value.trim();

    //Validate input
    if (name.length < 2 || name.length > 32) { //Invalid name
        widget.error("Ikke et gyldig navn");
        return;
    } 

    if (!emailvalidation.valid(email)) { //Invalid email
        widget.error("Ikke en gyldig mail");
        return;
    }

    widget.name = name;
    widget.email = email;

    if (window.localStorage) {
        window.localStorage.setItem("donation-name", name);
        window.localStorage.setItem("donation-email", email);
    }

    widget.nextSlide();
    
    setTimeout(function() {
        nxtBtn.classList.remove("loading");
    }, 200);
}

function focusUser() {
    var input = this.pane.getElementsByClassName("name")[0];
    setTimeout(function () {
        input.focus();
    }, 200);
}

},{"email-validation":2}],10:[function(require,module,exports){
function DonationWidget() {
    var _self = undefined;

    this.setup = function (self, widgetElement) {
        _self = self;

        this.assetsUrl = "https://api.gieffektivt.no/static/";
        
        this.localStorage = window.localStorage; 
    
        this.element = widgetElement;
        this.wrapper = this.element.parentElement;
        this.activeError = false;
    
        this.submitOnAmount = true;
    
        this.width = this.element.clientWidth;
        this.currentSlide = 0;
    
        this.panes = [];
        var paneElements = this.element.getElementsByClassName("pane");
    
        this.slider.style.width = (this.paneElements.length * this.width) + "px";

        this.panes[0] = require('./panes/donor.js')(_self, paneElements[0]);
        this.panes[1] = require('./panes/amount.js')(_self, paneElements[1]);
    
        /*
        for (var i = 0; i < this.panes.length; i++) {
            var pane = this.panes[i];
            pane.style.width = this.width + "px";

            pane.addEventListener("ready", function(pane) {
                submitOnEnter(pane);
            }); 
    
            if (i == 0) {
                var donorPane = require('./panes/donor.js')(_self, _self.panes[0])

                pane.submit = function() {
                    donorPane.submit();
                };
                pane.focus = function() {
                    universalPaneFocus(self, donorPane.pane);
                    donorPane.focus();
                };
            } else if (i == 1) {
                var amountPane = require('./panes/amount.js')(_self, _self.panes[1])
                
                pane.submit = function() { 
                    amountPane.submit(_self, this);
                };
                pane.focus = function() { 
                    universalPaneFocus(self, amountPane.pane);
                    amountPane.focus(_self, this);
                };
            } else if (i == 2) {
                var donationPane = require('./panes/donation.js')(_self, _self.panes[2])

                pane.submit = function() { 
                    donationPane.submit(_self, this);
                };
                pane.focus = function() {
                    universalPaneFocus(self, donationPane.pane); 
                    donationPane.focus(_self, this);
                };
            }
            else if (i == 3) {
                var paymentMethodPane = require('./panes/paymentMethod.js')(_self, _self.panes[3])

                pane.submit = function() { 
                    paymentMethodPane.submit(_self, this);
                };
                pane.focus = function() {
                    universalPaneFocus(self, paymentMethodPane.pane); 
                    paymentMethodPane.focus(_self, this); 
                };
            }
            else if (i == this.panes.length-1) {
                //No submit function needed on last pane
            } else {
                throw new Error("No submit function specified for a pane");
            }
    
            if (i != this.panes.length-1) insertNextButton(pane, (i == 0)); //No next button on last pane
            if (i != 0 && i != this.panes.length-1) insertPrevButton(pane); //No prev button on first and last pane
        }

        */

        //General setup helpers
        setupCloseBtn();
        setupHasBtnClasses();
        setupSelectOnClick();
    }

    function universalPaneFocus(widget, pane) {
        var allInputs = widget.element.getElementsByTagName("input");
        for (var i = 0; i < allInputs.length; i++) {
            allInputs[i].setAttribute("tabindex", "-1");
        }

        var paneInputs = pane.getElementsByTagName("input");
        for (var i = 0; i < paneInputs.length; i++) {
            paneInputs[i].setAttribute("tabindex", i+1);
        }
    }

    /* Setup helpers */
    function setupCloseBtn() {
        _self.closeBtn.addEventListener("click", function() {
            _self.close();
        })
    }

    function setupHasBtnClasses() {
        for (var i = 0; i < _self.panes.length; i++) {
            var pane = _self.panes[i];

            if (pane.getElementsByClassName("btn").length > 0) pane.classList.add("has-buttons");
        }
    }

    function insertNextButton(pane, lonely) {
        var btn = document.createElement("div");

        btn.classList.add("btn");
        btn.classList.add("frwd");

        if (lonely) btn.classList.add("lonely");

        var nxtImg = document.createElement("img");
        nxtImg.classList.add("arrowImage");
        nxtImg.src = _self.assetsUrl + "next.svg";

        loadingImg = document.createElement("img");
        loadingImg.classList.add("loadingImage");
        loadingImg.src = _self.assetsUrl + "loading.svg";

        btn.appendChild(nxtImg);
        btn.appendChild(loadingImg);

        pane.appendChild(btn);

        btn.addEventListener("click", function(e) {
            pane.submit(_self, pane)
        })
    }

    function insertPrevButton(pane) {
        var btn = document.createElement("div");

        btn.classList.add("btn");
        btn.classList.add("back");

        var nxtImg = document.createElement("img");
        nxtImg.classList.add("arrowImage");
        nxtImg.src = _self.assetsUrl + "next.svg";

        loadingImg = document.createElement("img");
        loadingImg.classList.add("loadingImage");
        loadingImg.src = _self.assetsUrl + "loading.svg";

        btn.appendChild(nxtImg);
        btn.appendChild(loadingImg);

        pane.appendChild(btn);

        btn.addEventListener("click", function(e) {
            _self.prevSlide();
        })
    }

    function submitOnEnter(e) {
        var pane = e.target;

        var inputs = pane.querySelectorAll("input[type=text], input[type=tel]");
        if (inputs.length > 0) {
            for (var i = 0; i < inputs.length; i++) {
                if (i == inputs.length-1) {
                    inputs[i].addEventListener("input", function(e) {
                        var valid = true;
                        if (this.getAttribute("inputmode") == "numeric") {
                            valid = numberInputWhitelistCheck(e);
                        }

                        if (_self.activeError) _self.hideError();

                        if (e.keyCode == 13) {
                            this.blur();
                            pane.submit(_self, pane);
                        }
                        return valid;
                    });

                    inputs[i].addEventListener("keydown", function(e) {
                        if (_self.activeError) _self.hideError();
                        
                        if (e.keyCode == 13) {
                            this.blur();
                            pane.submit(_self, pane);
                        }
                    });
                } else {
                    (function() {
                        var next = inputs[i+1];
                        inputs[i].addEventListener("input", function(e) {
                            var valid = true;
                            if (this.getAttribute("inputmode") == "numeric") {
                                valid = numberInputWhitelistCheck(e);
                            }

                            return valid;
                        });

                        inputs[i].addEventListener("keydown", function(e) {
                            if (_self.activeError) _self.hideError();
                            
                            if (e.keyCode == 13) { //enter
                                next.focus();
                            }
                        });
                    }());
                }
            }

        }
    }

    function numberInputWhitelistCheck(e) {
        //e.preventDefault(); 

        var valid = true;

        var carrotPosition = e.target.selectionStart;
        var value = e.target.value.replace(new RegExp(",", "g"), ".");

        if (e.target.getAttribute("nocomma") == "true" && (value.indexOf(".") != -1)) valid = false;
        if (valid && value.indexOf(" ") != -1) valid = false;

        if (valid) {
            var numDecimals = value.split(".");
            numDecimals = (numDecimals.length  > 1 ? numDecimals[1].length : 0);
            valid = ((~~value > 0 && numDecimals < 3) || value == "0");
        }
 
        if (!valid) {
            e.target.value = e.target.value.slice(0,carrotPosition-1) + e.target.value.slice(carrotPosition);

            e.target.setSelectionRange(carrotPosition-1, carrotPosition-1);
            //timeout needed for mobile android
            setTimeout(function() {
                e.target.setSelectionRange(carrotPosition-1, carrotPosition-1);
            }, 0);
            
        } else {
            e.target.value = value;
        }

        return valid;
    }

    function postDonation(postData, nxtBtn) {
        _self.request("donations", "POST", postData, function(err, data) {
            if (err == 0 || err) {
                if (err == 0) _self.error("Når ikke server. Forsøk igjen senere.");
                else if (err == 500) _self.error("Det er noe feil med donasjonen");

                nxtBtn.classList.remove("loading");
                return;
            }
            nxtBtn.classList.remove("loading");

            var resultPane = _self.element.getElementsByClassName("result")[0];

            _self.KID = data.content.KID;

            resultPane.getElementsByClassName("amount")[0].innerHTML = _self.donationAmount + "kr";
            var KIDstring = data.content.KID.toString();
            KIDstring = KIDstring.slice(0,3) + " " + KIDstring.slice(3,5) + " " + KIDstring.slice(5);
            resultPane.getElementsByClassName("KID")[0].innerHTML = KIDstring;
            resultPane.getElementsByClassName("email")[0].innerHTML = _self.email;

            _self.nextSlide();
        });
    }
    this.postDonation = postDonation;

    /* Slider control */
    this.goToSlide = function(slidenum) {
        if (slidenum < 0 || slidenum > _self.panes.length - 1) throw Error("Slide under 0 or larger than set")

        var visiblePanesInFront = _self.panes.reduce(function(acc, pane) { 
            if (pane.visible) {
                return acc++;
            }
            else {
                return acc;
            }
        }, 0)

        _self.slider.style.transform = "translateX(-" + (visiblePanesInFront * _self.width) + "px)";

        var pane = _self.panes[slidenum];

        pane = _self.panes[slidenum];

        if (pane.getElementsByClassName("btn").length > 0) {
            //If pane has button, make room for those
            var padding = 90;
        } else {
            var padding = 50;
        }

        var height = pane.getElementsByClassName("inner")[0].clientHeight + padding;

        if (slidenum == _self.panes.length-1) _self.element.style.maxHeight = "3000px";

        if (height < 300) height = 300;
        _self.element.style.height = height + "px";
        console.log("Focus:" );
        console.log(pane); 
        if (_self.active) pane.focus(_self, pane);
 
        setTimeout(function() {
            _self.element.style.overflow = "hidden";
            _self.element.getElementsByClassName("inner")[0].style.position = "static";

            setTimeout(function() {
                _self.element.getElementsByClassName("inner")[0].style.position = "";
                _self.element.style.overflow = "";
            }, 5);
        }, 500);

        _self.currentSlide = slidenum;
        updateSliderProgress();
    }

    this.nextSlide = function() {
        this.goToSlide(_self.currentSlide + 1);
    }

    this.prevSlide = function() {
        this.goToSlide(_self.currentSlide -  1);
    }

    //Progress bar
    function updateSliderProgress() {
        _self.progress.style.width = (100 / (_self.activePanes)) * _self.currentSlide + "%";
    }
    this.updateSliderProgress = updateSliderProgress;

    /* Error element */
    this.error = function(msg) {
        _self.activeError = true;
        _self.errorElement.innerHTML = msg;
        _self.errorElement.classList.add("active");
        _self.panes[_self.currentSlide].getElementsByClassName("loading")[0].classList.remove("loading");

        setTimeout(function() {
            hideError();
        }, 5000);
    }

    function hideError() {
        _self.errorElement.classList.remove("active");
        _self.activeError = false;
    }
    this.hideError = hideError;

    function setNoApiError() {
        var noApiErrorElement = document.getElementById("no_api_error");

        noApiErrorElement.style.zIndex = 10;
        noApiErrorElement.classList.add("active");
    }

    /* Network helpers */
    var api_url = "https://api.gieffektivt.no/";
    //var api_url = "http://localhost:3000/";

    this.request = function(endpoint, type, data, cb) {
        var http = new XMLHttpRequest();
        var url = api_url + endpoint;

        http.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200 ) {
                    var response = JSON.parse(this.responseText);

                    if (response.status == 200) {
                        cb(null, response);
                    }
                    else if (response.status == 400) {
                        cb(response.content, null);
                    }
                } else {
                    cb(this.status, null);
                }
            }
        };

        if (type == "POST") {
            http.open("POST", url, true);
            http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            http.send("data=" + encodeURIComponent(JSON.stringify(data)));
        } else if (type == "GET") {
            http.open("GET", url, true);
            http.send(data);
        }
    }

    //UI snazzyness
    function setupSelectOnClick() {
        var elems = _self.panes[_self.panes.length - 1].getElementsByClassName("select-on-click");

        for (var i = 0; i < elems.length; i++) {
            elems[i].addEventListener("click", selectNodeText);
        }
    }

    function selectNodeText(e) {
        e.preventDefault();
        e.stopPropagation();

        var node = this;
 
        if ( document.selection ) {
            var range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } else if ( window.getSelection ) {
            var range = document.createRange();
            range.selectNodeContents(node);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    }

    //Activate UI
    this.show = function() {
        var widget = _self;

        document.body.classList.add("widget-active");
        _self.wrapper.style.zIndex = 100000;

        _self.element.classList.add("active");
        _self.wrapper.classList.add("active");
        var activePane = _self.panes[_self.currentSlide];
        activePane.focus(_self, activePane);

        _self.active = true;

        //User is engaged in form, activate "are you sure you want to leave" prompt on attempt to navigate away
        window.onbeforeunload = function() {
            return true;
        };
    }

    this.close = function() {
        document.body.classList.remove("widget-active");
        _self.element.classList.remove("active");
        _self.wrapper.classList.remove("active");
        _self.element.style.maxHeight = "";

        window.onbeforeunload = null;

        _self.active = false;

        setTimeout(function() {
            _self.wrapper.style.zIndex = -1;
            if (_self.currentSlide == _self.panes.length-1) { 
                _self.goToSlide(0);
                _self.panes[2].classList.remove("hidden");
                document.getElementById("check-select-recommended").click();
            }
        }, 500);
    }  

    /* Return */
    var properties = {
        element: this.element,
        panes: this.panes,
        goToSlide: this.goToSlide,
        nextSlide: this.nextSlide,
        slider: this.slider,
        setsplit: this.setSplitValues,
        show: this.show,
        close: this.close,
        error: this.error,
        request: this.request,
        updateSliderProgress: this.updateSliderProgress,
        postDonation: this.postDonation,
        prevSlide: this.prevSlide,
        hideError: this.hideError,
        setup: this.setup
    }
    return properties;
} 

window.DonationWidget = DonationWidget;

},{"./panes/amount.js":8,"./panes/donor.js":9}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9saWIvX2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2VtYWlsLXZhbGlkYXRpb24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvZW1haWwtdmFsaWRhdGlvbi9saWIvZW1haWwtdmFsaWRhdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsInNjcmlwdC9wYW5lcy9hbW91bnQuanMiLCJzY3JpcHQvcGFuZXMvZG9ub3IuanMiLCJzY3JpcHQvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FDQUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvZW1haWwtdmFsaWRhdGlvbicpO1xyXG4iLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcclxudmFyIGVtYWlsID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHt9O1xyXG5cclxudmFyIHN0clRvT2JqID0gZnVuY3Rpb24oc3RyKSB7XHJcbiAgdmFyIG9iaiA9IHt9O1xyXG4gIGZvcih2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcclxuICAgIG9ialtzdHJbaV1dID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgfVxyXG4gIHJldHVybiBvYmo7XHJcbn07XHJcblxyXG52YXIgY2hhcnMgPSBzdHJUb09iaihcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5ISMkJSYnKistLz0/Xl9ge3x9fi5cIik7XHJcbnZhciBzcGVjaWFsY2hhcnMgPSBzdHJUb09iaihcIlxcXFxcXFwiKCksOjs8PkBbXFxdIFwiKTtcclxudmFyIGVzY2FwZXJzID0gc3RyVG9PYmooJ1xcXFxcIicpO1xyXG52YXIgaG9zdGNoYXJzID0gc3RyVG9PYmooXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OS4tXCIpO1xyXG5cclxuZW1haWwucGFyc2UgPSBmdW5jdGlvbihhZGRyZXNzLCBkb3Rocm93LCBjYWxsYmFjaykge1xyXG4gIGNhbGxiYWNrID0gKHR5cGVvZiBjYWxsYmFjayA9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZG90aHJvdyA9PSAnZnVuY3Rpb24nKSA/IGRvdGhyb3cgOiBudWxsO1xyXG4gIHZhciB1c2VybGFuZCA9IHRydWU7XHJcbiAgdmFyIHF1b3RhdGlvbiA9IGZhbHNlO1xyXG4gIHZhciBlc2NhcGVkID0gZmFsc2U7XHJcbiAgdmFyIF91c2VyID0gXCJcIiwgX2RvbWFpbiA9IFwiXCI7XHJcbiAgdmFyIGhvc3Rpc2lwID0gZmFsc2U7XHJcbiAgdmFyIGhvc3RzdGFydHBvcyA9IDA7XHJcbiAgdHJ5IHtcclxuICAgIGlmKGFkZHJlc3MubGVuZ3RoID49IDI1NCkgdGhyb3cgdXRpbC5mb3JtYXQoXCJbRXJyb3IgcGFyc2luZyBlbWFpbCBhZGRyZXNzOiBhZGRyZXNzIGlzIGxvbmdlciB0aGFuIDI1MywgYWN0dWFsXVwiLCBhZGRyZXNzLmxlbmd0aCk7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgYWRkcmVzcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGksIGFkZHJlc3NbaV0pXHJcbiAgICAgIGlmKHVzZXJsYW5kKSB7XHJcbiAgICAgICAgaWYoYWRkcmVzc1tpXSA9PSAnXCInICYmIGkgPT0gMCkgeyBxdW90YXRpb24gPSB0cnVlOyBfdXNlciArPSBhZGRyZXNzW2ldOyBjb250aW51ZTsgfVxyXG4gICAgICAgIGlmKHR5cGVvZiBjaGFyc1thZGRyZXNzW2ldXSAhPSAndW5kZWZpbmVkJykgeyAvL25lZWRlZCBJJ20gc3VyZS5cclxuICAgICAgICAgIF91c2VyICs9IGFkZHJlc3NbaV07IGNvbnRpbnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZih0eXBlb2Ygc3BlY2lhbGNoYXJzW2FkZHJlc3NbaV1dICE9ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBpZihxdW90YXRpb24pIHtcclxuICAgICAgICAgICAgaWYoIWVzY2FwZWQgJiYgYWRkcmVzc1tpXSA9PSBcIlxcXFxcIikgeyBlc2NhcGVkID0gdHJ1ZTsgX3VzZXIgKz0gYWRkcmVzc1tpXTsgY29udGludWU7IH1cclxuICAgICAgICAgICAgaWYoIWVzY2FwZWQgJiYgYWRkcmVzc1tpXSA9PSAnXCInICYmIGFkZHJlc3NbaSsxXSA9PSBcIkBcIikgeyB1c2VybGFuZCA9IGZhbHNlOyBob3N0c3RhcnRwb3MgPSBpKzI7IF91c2VyICs9IGFkZHJlc3NbaV07IGkrPTE7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgIGlmKGVzY2FwZWQgJiYgdHlwZW9mIGVzY2FwZXJzW2FkZHJlc3NbaV1dICE9ICd1bmRlZmluZWQnKSB7IGVzY2FwZWQgPSBmYWxzZTsgX3VzZXIgKz0gYWRkcmVzc1tpXTsgY29udGludWU7IH1cclxuICAgICAgICAgICAgaWYoIWVzY2FwZWQgJiYgdHlwZW9mIGVzY2FwZXJzW2FkZHJlc3NbaV1dICE9ICd1bmRlZmluZWQnKSB0aHJvdyB1dGlsLmZvcm1hdChcIltFcnJvciBwYXJzaW5nIGVtYWlsIGFkZHJlc3M6IGludmFsaWQgdXNlIG9mICVzIChwb3M6ICVzKV1cIiwgYWRkcmVzc1tpXSwgaSwgYWRkcmVzcyk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYoYWRkcmVzc1tpXSA9PSBcIkBcIiAmJiAhcXVvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHVzZXJsYW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGhvc3RzdGFydHBvcyA9IGkrMTtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyB1dGlsLmZvcm1hdChcIltFcnJvciBwYXJzaW5nIGVtYWlsIGFkZHJlc3M6IHNwZWNpYWwgY2hhcmFjdGVyICclcycgKHBvczogJXMpIHVzZWQgd2l0aG91dCBxdW90YXRpb24gbWFya3NdXCIsIGFkZHJlc3NbaV0sIGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aHJvdyB1dGlsLmZvcm1hdChcIltFcnJvciBwYXJzaW5nIGVtYWlsIGFkZHJlc3M6IGNoYXJhY3RlciAnJXMnIChwb3M6ICVzKSBpcyBub3QgYWxsb3dlZCBpbiBhbiBlbWFpbCBhZGRyZXNzIHVzZXIgc3BhY2UuXVwiLCBhZGRyZXNzW2ldLCBpLCBhZGRyZXNzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgX3VzZXIgKz0gYWRkcmVzc1tpXTtcclxuICAgICAgfSBlbHNlIHsgLy9wYXJzaW5nIGhvc3RuYW1lLiBQcm9iYWJseSBjb3VsZCBiZSBkb25lIHdpdGggcmVnZXguXHJcbiAgICAgICAgaWYoaSA9PSBob3N0c3RhcnRwb3MgJiYgYWRkcmVzc1tpXSA9PSAnWycpIHsgaG9zdGlzaXAgPSB0cnVlOyBob3N0Y2hhcnNbJ1snXSA9ICdbJzsgaG9zdGNoYXJzWyddJ10gPSAnXSc7IGhvc3RjaGFyc1snOiddID0gJzonOyBfZG9tYWluICs9IGFkZHJlc3NbaV07IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgaWYodHlwZW9mIGhvc3RjaGFyc1thZGRyZXNzW2ldXSA9PSAndW5kZWZpbmVkJykgdGhyb3cgdXRpbC5mb3JtYXQoXCJbRXJyb3IgcGFyc2luZyBlbWFpbCBhZGRyZXNzOiBjaGFyYWN0ZXIgJyVzJyAocG9zOiAlcykgaXMgbm90IGFsbG93ZWQgaW4gdGhlIGhvc3RuYW1lIHNlY3Rpb25dXCIsIGFkZHJlc3NbaV0sIGkpO1xyXG4gICAgICAgIGlmKGkgPj0gaG9zdHN0YXJ0cG9zICYmIC9bQFxcLl0vLnRlc3QoYWRkcmVzc1tpIC0gMV0pICYmICEvW2EtejAtOV0vaS50ZXN0KGFkZHJlc3NbaV0pKSB0aHJvdyB1dGlsLmZvcm1hdChcIltFcnJvciBwYXJzaW5nIGVtYWlsIGFkZHJlc3M6IEFsbCBkb21haW4gc2VnbWVudHMgbXVzdCBzdGFydCB3aXRoIGEgbGV0dGVyIG9yIG51bWJlciwgbmV2ZXIgYSBzeW1ib2wgbGlrZSAnJXMnLlwiKVxyXG4gICAgICAgIF9kb21haW4gKz0gYWRkcmVzc1tpXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYoX2RvbWFpbiA9PT0gJycpIHRocm93IHV0aWwuZm9ybWF0KFwiW0Vycm9yIHBhcnNlaW5nIGVtYWlsIGFkZHJlc3M6IG5vIGRvbWFpbiBwYXJ0XVwiLCBhZGRyZXNzKTtcclxuICAgIGlmKGhvc3Rpc2lwICYmICFyZXF1aXJlKCduZXQnKS5pc0lQKGFkZHJlc3Muc3Vic3RyaW5nKGhvc3RzdGFydHBvcysxLGFkZHJlc3MubGVuZ3RoLTEpKSkgdGhyb3cgdXRpbC5mb3JtYXQoXCJbRXJyb3IgcGFyc2luZyBlbWFpbCBhZGRyZXNzOiBpbnZhbGlkIElQIGFkZHJlc3NdXCIpO1xyXG4gICAgaWYoaG9zdGlzaXAgJiYgYWRkcmVzc1thZGRyZXNzLmxlbmd0aC0xXSAhPSBcIl1cIikgdGhyb3cgdXRpbC5mb3JtYXQoXCJbRXJyb3IgcGFyc2luZyBlbWFpbCBhZGRyZXNzOiBJUCBhZGRyZXNzIG5vdGF0aW9uIG11c3QgZW5kIHdpdGggYSAnXSddXCIpO1xyXG4gICAgaWYoIWhvc3Rpc2lwICYmICgvXi4rQChbYS16MC05XXs2NCx9KHxcXC4pKS9pKS50ZXN0KGFkZHJlc3MpKSB0aHJvdyB1dGlsLmZvcm1hdChcIltFcnJvciBwYXJzaW5nIGVtYWlsIGFkZHJlc3M6IGhvc3RuYW1lIGhhcyBlbGVtZW50cyBncmVhdGVyIHRoYW4gNjMgY2hhcmFjdGVyc11cIik7XHJcbiAgICBpZih1c2VybGFuZCkgdGhyb3cgdXRpbC5mb3JtYXQoXCJbRXJyb3IgcGFyc2luZyBlbWFpbCBhZGRyZXNzOiBxdW90YXRpb24gbWFyayBub3QgY2xvc2VkXVwiICwgYWRkcmVzcyk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBpZihjYWxsYmFjaykgY2FsbGJhY2soZXJyKTtcclxuICAgIGlmKHR5cGVvZiBkb3Rocm93ICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkb3Rocm93ICE9ICdmdW5jdGlvbicpIHRocm93IGVycjtcclxuICAgIHJldHVybiBmYWxzZTsgLy9yZWR1bmRhbnQ/XHJcbiAgfVxyXG4gIGlmKGNhbGxiYWNrKSBjYWxsYmFjayhudWxsLCB7dXNlcjogX3VzZXIsIGRvbWFpbjogX2RvbWFpbn0pO1xyXG4gIGVsc2UgcmV0dXJuIHt1c2VyOiBfdXNlciwgZG9tYWluOiBfZG9tYWlufTtcclxufVxyXG5cclxuZW1haWwudmFsaWQgPSBmdW5jdGlvbihhZGRyZXNzLCBkb3Rocm93LCBjYWxsYmFjaykge1xyXG4gIHJldHVybiAhIWVtYWlsLnBhcnNlKGFkZHJlc3MsIGRvdGhyb3csIGNhbGxiYWNrKTtcclxufVxyXG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih3aWRnZXQsIHBhbmUpIHsgXHJcbiAgICB0aGlzLndpZGdldCA9IHdpZGdldDtcclxuICAgIHRoaXMucGFuZSA9IHBhbmU7XHJcblxyXG4gICAgc2V0dXBTZWxlY3RTcGxpdENoZWNrYm94KCk7XHJcblxyXG4gICAgcGFuZS5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmVhZHknLCBwYW5lKSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBzdWJtaXQ6IHN1Ym1pdEFtb3VudCxcclxuICAgICAgICBmb2N1czogZm9jdXNBbW91bnQsXHJcbiAgICAgICAgd2lkZ2V0OiB3aWRnZXQsXHJcbiAgICAgICAgcGFuZTogcGFuZVxyXG4gICAgfSBcclxufVxyXG5cclxuZnVuY3Rpb24gc3VibWl0QW1vdW50KCkge1xyXG4gICAgdmFyIHdpZGdldCA9IHRoaXMud2lkZ2V0O1xyXG4gICAgdmFyIHBhbmUgPSB0aGlzLnBhbmU7XHJcblxyXG4gICAgdmFyIG54dEJ0biA9IHBhbmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0blwiKVswXTtcclxuICAgIG54dEJ0bi5jbGFzc0xpc3QuYWRkKFwibG9hZGluZ1wiKTtcclxuXHJcbiAgICB3aWRnZXQuZG9uYXRpb25BbW91bnQgPSBwYXJzZUludChwYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJhbW91bnRcIilbMF0udmFsdWUpO1xyXG5cclxuICAgIGlmICh3aWRnZXQuZG9uYXRpb25BbW91bnQgPiAwKSB7XHJcbiAgICAgICAgaWYgKHdpZGdldC5zdWJtaXRPbkFtb3VudCkge1xyXG4gICAgICAgICAgICB3aWRnZXQucGFuZXNbMl0uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgd2lkZ2V0LnBvc3REb25hdGlvbih7XHJcbiAgICAgICAgICAgICAgICBkb25vcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHdpZGdldC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiB3aWRnZXQuZW1haWxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhbW91bnQ6IHdpZGdldC5kb25hdGlvbkFtb3VudFxyXG4gICAgICAgICAgICB9LCBueHRCdG4pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdpZGdldC5uZXh0U2xpZGUoKTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBueHRCdG4uY2xhc3NMaXN0LnJlbW92ZShcImxvYWRpbmdcIik7XHJcbiAgICAgICAgICAgIH0sIDIwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgd2lkZ2V0LmVycm9yKFwiRHUgbcOlIGFuZ2kgZW4gc3VtXCIpO1xyXG4gICAgICAgIG54dEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwibG9hZGluZ1wiKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZm9jdXNBbW91bnQoKSB7XHJcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcy53aWRnZXQ7XHJcbiAgICB2YXIgcGFuZSA9IHRoaXMucGFuZTtcclxuXHJcbiAgICB2YXIgaW5wdXQgPSBwYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJhbW91bnRcIilbMF07XHJcblxyXG4gICAgd2lkZ2V0LmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCJcIjtcclxuXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgfSwgMjAwKTtcclxufVxyXG5cclxuLyogU2V0dXAgc2VsZWN0IHNwbGl0IGNoZWNrYm94ICovXHJcbmZ1bmN0aW9uIHNldHVwU2VsZWN0U3BsaXRDaGVja2JveCgpIHtcclxuICAgIHZhciB3aWRnZXQgPSB0aGlzLndpZGdldDtcclxuXHJcbiAgICB2YXIgc2VsZWN0U3BsaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoZWNrLXNlbGVjdC1zcGxpdFwiKTtcclxuICAgIHZhciBzZWxlY3RSZWNvbW1lbmRlZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hlY2stc2VsZWN0LXJlY29tbWVuZGVkXCIpO1xyXG5cclxuICAgIHNlbGVjdFNwbGl0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHdpZGdldC5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzaGFyZXNcIilbMF0uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICB3aWRnZXQuc3VibWl0T25BbW91bnQgPSBmYWxzZTtcclxuICAgICAgICB3aWRnZXQuYWN0aXZlUGFuZXMrKztcclxuICAgICAgICB3aWRnZXQudXBkYXRlU2xpZGVyUHJvZ3Jlc3MoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHNlbGVjdFJlY29tbWVuZGVkLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHdpZGdldC5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzaGFyZXNcIilbMF0uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcclxuICAgICAgICB3aWRnZXQuc3VibWl0T25BbW91bnQgPSB0cnVlO1xyXG4gICAgICAgIHdpZGdldC5hY3RpdmVQYW5lcy0tO1xyXG4gICAgICAgIHdpZGdldC51cGRhdGVTbGlkZXJQcm9ncmVzcygpO1xyXG4gICAgfSlcclxufSIsInZhciBlbWFpbHZhbGlkYXRpb24gPSByZXF1aXJlKCdlbWFpbC12YWxpZGF0aW9uJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHdpZGdldCwgcGFuZSkge1xyXG4gICAgdGhpcy53aWRnZXQgPSB3aWRnZXQ7XHJcbiAgICB0aGlzLnBhbmUgPSBwYW5lO1xyXG5cclxuICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlKSB7XHJcbiAgICAgICAgcGFuZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmFtZVwiKVswXS52YWx1ZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRvbmF0aW9uLW5hbWVcIik7XHJcbiAgICAgICAgcGFuZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZW1haWxcIilbMF0udmFsdWUgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkb25hdGlvbi1lbWFpbFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwYW5lLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyZWFkeScsIHBhbmUpKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHN1Ym1pdDogc3VibWl0VXNlcixcclxuICAgICAgICBmb2N1czogZm9jdXNVc2VyLFxyXG4gICAgICAgIHBhbmU6IHBhbmUsXHJcbiAgICAgICAgd2lkZ2V0OiB3aWRnZXRcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3VibWl0VXNlcigpIHtcclxuICAgIHZhciBwYW5lID0gdGhpcy5wYW5lO1xyXG4gICAgdmFyIHdpZGdldCA9IHRoaXMud2lkZ2V0O1xyXG5cclxuICAgIHZhciBueHRCdG4gPSBwYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG5cIilbMF07XHJcbiAgICBueHRCdG4uY2xhc3NMaXN0LmFkZChcImxvYWRpbmdcIik7XHJcblxyXG4gICAgdmFyIGVtYWlsID0gcGFuZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZW1haWxcIilbMF0udmFsdWUudHJpbSgpO1xyXG4gICAgdmFyIG5hbWUgPSBwYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJuYW1lXCIpWzBdLnZhbHVlLnRyaW0oKTtcclxuXHJcbiAgICAvL1ZhbGlkYXRlIGlucHV0XHJcbiAgICBpZiAobmFtZS5sZW5ndGggPCAyIHx8IG5hbWUubGVuZ3RoID4gMzIpIHsgLy9JbnZhbGlkIG5hbWVcclxuICAgICAgICB3aWRnZXQuZXJyb3IoXCJJa2tlIGV0IGd5bGRpZyBuYXZuXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gXHJcblxyXG4gICAgaWYgKCFlbWFpbHZhbGlkYXRpb24udmFsaWQoZW1haWwpKSB7IC8vSW52YWxpZCBlbWFpbFxyXG4gICAgICAgIHdpZGdldC5lcnJvcihcIklra2UgZW4gZ3lsZGlnIG1haWxcIik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHdpZGdldC5uYW1lID0gbmFtZTtcclxuICAgIHdpZGdldC5lbWFpbCA9IGVtYWlsO1xyXG5cclxuICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZG9uYXRpb24tbmFtZVwiLCBuYW1lKTtcclxuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkb25hdGlvbi1lbWFpbFwiLCBlbWFpbCk7XHJcbiAgICB9XHJcblxyXG4gICAgd2lkZ2V0Lm5leHRTbGlkZSgpO1xyXG4gICAgXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIG54dEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwibG9hZGluZ1wiKTtcclxuICAgIH0sIDIwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvY3VzVXNlcigpIHtcclxuICAgIHZhciBpbnB1dCA9IHRoaXMucGFuZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibmFtZVwiKVswXTtcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICB9LCAyMDApO1xyXG59XHJcbiIsImZ1bmN0aW9uIERvbmF0aW9uV2lkZ2V0KCkge1xyXG4gICAgdmFyIF9zZWxmID0gdW5kZWZpbmVkO1xyXG5cclxuICAgIHRoaXMuc2V0dXAgPSBmdW5jdGlvbiAoc2VsZiwgd2lkZ2V0RWxlbWVudCkge1xyXG4gICAgICAgIF9zZWxmID0gc2VsZjtcclxuXHJcbiAgICAgICAgdGhpcy5hc3NldHNVcmwgPSBcImh0dHBzOi8vYXBpLmdpZWZmZWt0aXZ0Lm5vL3N0YXRpYy9cIjtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7IFxyXG4gICAgXHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gd2lkZ2V0RWxlbWVudDtcclxuICAgICAgICB0aGlzLndyYXBwZXIgPSB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICB0aGlzLmFjdGl2ZUVycm9yID0gZmFsc2U7XHJcbiAgICBcclxuICAgICAgICB0aGlzLnN1Ym1pdE9uQW1vdW50ID0gdHJ1ZTtcclxuICAgIFxyXG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGg7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2xpZGUgPSAwO1xyXG4gICAgXHJcbiAgICAgICAgdGhpcy5wYW5lcyA9IFtdO1xyXG4gICAgICAgIHZhciBwYW5lRWxlbWVudHMgPSB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBhbmVcIik7XHJcbiAgICBcclxuICAgICAgICB0aGlzLnNsaWRlci5zdHlsZS53aWR0aCA9ICh0aGlzLnBhbmVFbGVtZW50cy5sZW5ndGggKiB0aGlzLndpZHRoKSArIFwicHhcIjtcclxuXHJcbiAgICAgICAgdGhpcy5wYW5lc1swXSA9IHJlcXVpcmUoJy4vcGFuZXMvZG9ub3IuanMnKShfc2VsZiwgcGFuZUVsZW1lbnRzWzBdKTtcclxuICAgICAgICB0aGlzLnBhbmVzWzFdID0gcmVxdWlyZSgnLi9wYW5lcy9hbW91bnQuanMnKShfc2VsZiwgcGFuZUVsZW1lbnRzWzFdKTtcclxuICAgIFxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwYW5lID0gdGhpcy5wYW5lc1tpXTtcclxuICAgICAgICAgICAgcGFuZS5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyBcInB4XCI7XHJcblxyXG4gICAgICAgICAgICBwYW5lLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeVwiLCBmdW5jdGlvbihwYW5lKSB7XHJcbiAgICAgICAgICAgICAgICBzdWJtaXRPbkVudGVyKHBhbmUpO1xyXG4gICAgICAgICAgICB9KTsgXHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKGkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvbm9yUGFuZSA9IHJlcXVpcmUoJy4vcGFuZXMvZG9ub3IuanMnKShfc2VsZiwgX3NlbGYucGFuZXNbMF0pXHJcblxyXG4gICAgICAgICAgICAgICAgcGFuZS5zdWJtaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb25vclBhbmUuc3VibWl0KCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcGFuZS5mb2N1cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVuaXZlcnNhbFBhbmVGb2N1cyhzZWxmLCBkb25vclBhbmUucGFuZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9ub3JQYW5lLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFtb3VudFBhbmUgPSByZXF1aXJlKCcuL3BhbmVzL2Ftb3VudC5qcycpKF9zZWxmLCBfc2VsZi5wYW5lc1sxXSlcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcGFuZS5zdWJtaXQgPSBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50UGFuZS5zdWJtaXQoX3NlbGYsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHBhbmUuZm9jdXMgPSBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgdW5pdmVyc2FsUGFuZUZvY3VzKHNlbGYsIGFtb3VudFBhbmUucGFuZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50UGFuZS5mb2N1cyhfc2VsZiwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gMikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRvbmF0aW9uUGFuZSA9IHJlcXVpcmUoJy4vcGFuZXMvZG9uYXRpb24uanMnKShfc2VsZiwgX3NlbGYucGFuZXNbMl0pXHJcblxyXG4gICAgICAgICAgICAgICAgcGFuZS5zdWJtaXQgPSBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgZG9uYXRpb25QYW5lLnN1Ym1pdChfc2VsZiwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcGFuZS5mb2N1cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVuaXZlcnNhbFBhbmVGb2N1cyhzZWxmLCBkb25hdGlvblBhbmUucGFuZSk7IFxyXG4gICAgICAgICAgICAgICAgICAgIGRvbmF0aW9uUGFuZS5mb2N1cyhfc2VsZiwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGkgPT0gMykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBheW1lbnRNZXRob2RQYW5lID0gcmVxdWlyZSgnLi9wYW5lcy9wYXltZW50TWV0aG9kLmpzJykoX3NlbGYsIF9zZWxmLnBhbmVzWzNdKVxyXG5cclxuICAgICAgICAgICAgICAgIHBhbmUuc3VibWl0ID0gZnVuY3Rpb24oKSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIHBheW1lbnRNZXRob2RQYW5lLnN1Ym1pdChfc2VsZiwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcGFuZS5mb2N1cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVuaXZlcnNhbFBhbmVGb2N1cyhzZWxmLCBwYXltZW50TWV0aG9kUGFuZS5wYW5lKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgcGF5bWVudE1ldGhvZFBhbmUuZm9jdXMoX3NlbGYsIHRoaXMpOyBcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaSA9PSB0aGlzLnBhbmVzLmxlbmd0aC0xKSB7XHJcbiAgICAgICAgICAgICAgICAvL05vIHN1Ym1pdCBmdW5jdGlvbiBuZWVkZWQgb24gbGFzdCBwYW5lXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBzdWJtaXQgZnVuY3Rpb24gc3BlY2lmaWVkIGZvciBhIHBhbmVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICBpZiAoaSAhPSB0aGlzLnBhbmVzLmxlbmd0aC0xKSBpbnNlcnROZXh0QnV0dG9uKHBhbmUsIChpID09IDApKTsgLy9ObyBuZXh0IGJ1dHRvbiBvbiBsYXN0IHBhbmVcclxuICAgICAgICAgICAgaWYgKGkgIT0gMCAmJiBpICE9IHRoaXMucGFuZXMubGVuZ3RoLTEpIGluc2VydFByZXZCdXR0b24ocGFuZSk7IC8vTm8gcHJldiBidXR0b24gb24gZmlyc3QgYW5kIGxhc3QgcGFuZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgLy9HZW5lcmFsIHNldHVwIGhlbHBlcnNcclxuICAgICAgICBzZXR1cENsb3NlQnRuKCk7XHJcbiAgICAgICAgc2V0dXBIYXNCdG5DbGFzc2VzKCk7XHJcbiAgICAgICAgc2V0dXBTZWxlY3RPbkNsaWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdW5pdmVyc2FsUGFuZUZvY3VzKHdpZGdldCwgcGFuZSkge1xyXG4gICAgICAgIHZhciBhbGxJbnB1dHMgPSB3aWRnZXQuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsSW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFsbElucHV0c1tpXS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHBhbmVJbnB1dHMgPSBwYW5lLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIik7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYW5lSW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHBhbmVJbnB1dHNbaV0uc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgaSsxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyogU2V0dXAgaGVscGVycyAqL1xyXG4gICAgZnVuY3Rpb24gc2V0dXBDbG9zZUJ0bigpIHtcclxuICAgICAgICBfc2VsZi5jbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIF9zZWxmLmNsb3NlKCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZXR1cEhhc0J0bkNsYXNzZXMoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfc2VsZi5wYW5lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcGFuZSA9IF9zZWxmLnBhbmVzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhbmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0blwiKS5sZW5ndGggPiAwKSBwYW5lLmNsYXNzTGlzdC5hZGQoXCJoYXMtYnV0dG9uc1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5zZXJ0TmV4dEJ1dHRvbihwYW5lLCBsb25lbHkpIHtcclxuICAgICAgICB2YXIgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoXCJidG5cIik7XHJcbiAgICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoXCJmcndkXCIpO1xyXG5cclxuICAgICAgICBpZiAobG9uZWx5KSBidG4uY2xhc3NMaXN0LmFkZChcImxvbmVseVwiKTtcclxuXHJcbiAgICAgICAgdmFyIG54dEltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbnh0SW1nLmNsYXNzTGlzdC5hZGQoXCJhcnJvd0ltYWdlXCIpO1xyXG4gICAgICAgIG54dEltZy5zcmMgPSBfc2VsZi5hc3NldHNVcmwgKyBcIm5leHQuc3ZnXCI7XHJcblxyXG4gICAgICAgIGxvYWRpbmdJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxvYWRpbmdJbWcuY2xhc3NMaXN0LmFkZChcImxvYWRpbmdJbWFnZVwiKTtcclxuICAgICAgICBsb2FkaW5nSW1nLnNyYyA9IF9zZWxmLmFzc2V0c1VybCArIFwibG9hZGluZy5zdmdcIjtcclxuXHJcbiAgICAgICAgYnRuLmFwcGVuZENoaWxkKG54dEltZyk7XHJcbiAgICAgICAgYnRuLmFwcGVuZENoaWxkKGxvYWRpbmdJbWcpO1xyXG5cclxuICAgICAgICBwYW5lLmFwcGVuZENoaWxkKGJ0bik7XHJcblxyXG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBwYW5lLnN1Ym1pdChfc2VsZiwgcGFuZSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGluc2VydFByZXZCdXR0b24ocGFuZSkge1xyXG4gICAgICAgIHZhciBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgICAgICBidG4uY2xhc3NMaXN0LmFkZChcImJ0blwiKTtcclxuICAgICAgICBidG4uY2xhc3NMaXN0LmFkZChcImJhY2tcIik7XHJcblxyXG4gICAgICAgIHZhciBueHRJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIG54dEltZy5jbGFzc0xpc3QuYWRkKFwiYXJyb3dJbWFnZVwiKTtcclxuICAgICAgICBueHRJbWcuc3JjID0gX3NlbGYuYXNzZXRzVXJsICsgXCJuZXh0LnN2Z1wiO1xyXG5cclxuICAgICAgICBsb2FkaW5nSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBsb2FkaW5nSW1nLmNsYXNzTGlzdC5hZGQoXCJsb2FkaW5nSW1hZ2VcIik7XHJcbiAgICAgICAgbG9hZGluZ0ltZy5zcmMgPSBfc2VsZi5hc3NldHNVcmwgKyBcImxvYWRpbmcuc3ZnXCI7XHJcblxyXG4gICAgICAgIGJ0bi5hcHBlbmRDaGlsZChueHRJbWcpO1xyXG4gICAgICAgIGJ0bi5hcHBlbmRDaGlsZChsb2FkaW5nSW1nKTtcclxuXHJcbiAgICAgICAgcGFuZS5hcHBlbmRDaGlsZChidG4pO1xyXG5cclxuICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgX3NlbGYucHJldlNsaWRlKCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzdWJtaXRPbkVudGVyKGUpIHtcclxuICAgICAgICB2YXIgcGFuZSA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICB2YXIgaW5wdXRzID0gcGFuZS5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbdHlwZT10ZXh0XSwgaW5wdXRbdHlwZT10ZWxdXCIpO1xyXG4gICAgICAgIGlmIChpbnB1dHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gaW5wdXRzLmxlbmd0aC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWxpZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldEF0dHJpYnV0ZShcImlucHV0bW9kZVwiKSA9PSBcIm51bWVyaWNcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBudW1iZXJJbnB1dFdoaXRlbGlzdENoZWNrKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3NlbGYuYWN0aXZlRXJyb3IpIF9zZWxmLmhpZGVFcnJvcigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ibHVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYW5lLnN1Ym1pdChfc2VsZiwgcGFuZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbnB1dHNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3NlbGYuYWN0aXZlRXJyb3IpIF9zZWxmLmhpZGVFcnJvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ibHVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYW5lLnN1Ym1pdChfc2VsZiwgcGFuZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dCA9IGlucHV0c1tpKzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWxpZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRBdHRyaWJ1dGUoXCJpbnB1dG1vZGVcIikgPT0gXCJudW1lcmljXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IG51bWJlcklucHV0V2hpdGVsaXN0Q2hlY2soZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0c1tpXS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoX3NlbGYuYWN0aXZlRXJyb3IpIF9zZWxmLmhpZGVFcnJvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7IC8vZW50ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0oKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG51bWJlcklucHV0V2hpdGVsaXN0Q2hlY2soZSkge1xyXG4gICAgICAgIC8vZS5wcmV2ZW50RGVmYXVsdCgpOyBcclxuXHJcbiAgICAgICAgdmFyIHZhbGlkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdmFyIGNhcnJvdFBvc2l0aW9uID0gZS50YXJnZXQuc2VsZWN0aW9uU3RhcnQ7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gZS50YXJnZXQudmFsdWUucmVwbGFjZShuZXcgUmVnRXhwKFwiLFwiLCBcImdcIiksIFwiLlwiKTtcclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LmdldEF0dHJpYnV0ZShcIm5vY29tbWFcIikgPT0gXCJ0cnVlXCIgJiYgKHZhbHVlLmluZGV4T2YoXCIuXCIpICE9IC0xKSkgdmFsaWQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodmFsaWQgJiYgdmFsdWUuaW5kZXhPZihcIiBcIikgIT0gLTEpIHZhbGlkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICh2YWxpZCkge1xyXG4gICAgICAgICAgICB2YXIgbnVtRGVjaW1hbHMgPSB2YWx1ZS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgIG51bURlY2ltYWxzID0gKG51bURlY2ltYWxzLmxlbmd0aCAgPiAxID8gbnVtRGVjaW1hbHNbMV0ubGVuZ3RoIDogMCk7XHJcbiAgICAgICAgICAgIHZhbGlkID0gKCh+fnZhbHVlID4gMCAmJiBudW1EZWNpbWFscyA8IDMpIHx8IHZhbHVlID09IFwiMFwiKTtcclxuICAgICAgICB9XHJcbiBcclxuICAgICAgICBpZiAoIXZhbGlkKSB7XHJcbiAgICAgICAgICAgIGUudGFyZ2V0LnZhbHVlID0gZS50YXJnZXQudmFsdWUuc2xpY2UoMCxjYXJyb3RQb3NpdGlvbi0xKSArIGUudGFyZ2V0LnZhbHVlLnNsaWNlKGNhcnJvdFBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgICAgIGUudGFyZ2V0LnNldFNlbGVjdGlvblJhbmdlKGNhcnJvdFBvc2l0aW9uLTEsIGNhcnJvdFBvc2l0aW9uLTEpO1xyXG4gICAgICAgICAgICAvL3RpbWVvdXQgbmVlZGVkIGZvciBtb2JpbGUgYW5kcm9pZFxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuc2V0U2VsZWN0aW9uUmFuZ2UoY2Fycm90UG9zaXRpb24tMSwgY2Fycm90UG9zaXRpb24tMSk7XHJcbiAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlLnRhcmdldC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbGlkO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBvc3REb25hdGlvbihwb3N0RGF0YSwgbnh0QnRuKSB7XHJcbiAgICAgICAgX3NlbGYucmVxdWVzdChcImRvbmF0aW9uc1wiLCBcIlBPU1RcIiwgcG9zdERhdGEsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZXJyID09IDAgfHwgZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyID09IDApIF9zZWxmLmVycm9yKFwiTsOlciBpa2tlIHNlcnZlci4gRm9yc8O4ayBpZ2plbiBzZW5lcmUuXCIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZXJyID09IDUwMCkgX3NlbGYuZXJyb3IoXCJEZXQgZXIgbm9lIGZlaWwgbWVkIGRvbmFzam9uZW5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgbnh0QnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJsb2FkaW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG54dEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwibG9hZGluZ1wiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZXN1bHRQYW5lID0gX3NlbGYuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicmVzdWx0XCIpWzBdO1xyXG5cclxuICAgICAgICAgICAgX3NlbGYuS0lEID0gZGF0YS5jb250ZW50LktJRDtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdFBhbmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImFtb3VudFwiKVswXS5pbm5lckhUTUwgPSBfc2VsZi5kb25hdGlvbkFtb3VudCArIFwia3JcIjtcclxuICAgICAgICAgICAgdmFyIEtJRHN0cmluZyA9IGRhdGEuY29udGVudC5LSUQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgS0lEc3RyaW5nID0gS0lEc3RyaW5nLnNsaWNlKDAsMykgKyBcIiBcIiArIEtJRHN0cmluZy5zbGljZSgzLDUpICsgXCIgXCIgKyBLSURzdHJpbmcuc2xpY2UoNSk7XHJcbiAgICAgICAgICAgIHJlc3VsdFBhbmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcIktJRFwiKVswXS5pbm5lckhUTUwgPSBLSURzdHJpbmc7XHJcbiAgICAgICAgICAgIHJlc3VsdFBhbmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImVtYWlsXCIpWzBdLmlubmVySFRNTCA9IF9zZWxmLmVtYWlsO1xyXG5cclxuICAgICAgICAgICAgX3NlbGYubmV4dFNsaWRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnBvc3REb25hdGlvbiA9IHBvc3REb25hdGlvbjtcclxuXHJcbiAgICAvKiBTbGlkZXIgY29udHJvbCAqL1xyXG4gICAgdGhpcy5nb1RvU2xpZGUgPSBmdW5jdGlvbihzbGlkZW51bSkge1xyXG4gICAgICAgIGlmIChzbGlkZW51bSA8IDAgfHwgc2xpZGVudW0gPiBfc2VsZi5wYW5lcy5sZW5ndGggLSAxKSB0aHJvdyBFcnJvcihcIlNsaWRlIHVuZGVyIDAgb3IgbGFyZ2VyIHRoYW4gc2V0XCIpXHJcblxyXG4gICAgICAgIHZhciB2aXNpYmxlUGFuZXNJbkZyb250ID0gX3NlbGYucGFuZXMucmVkdWNlKGZ1bmN0aW9uKGFjYywgcGFuZSkgeyBcclxuICAgICAgICAgICAgaWYgKHBhbmUudmlzaWJsZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDApXHJcblxyXG4gICAgICAgIF9zZWxmLnNsaWRlci5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZVgoLVwiICsgKHZpc2libGVQYW5lc0luRnJvbnQgKiBfc2VsZi53aWR0aCkgKyBcInB4KVwiO1xyXG5cclxuICAgICAgICB2YXIgcGFuZSA9IF9zZWxmLnBhbmVzW3NsaWRlbnVtXTtcclxuXHJcbiAgICAgICAgcGFuZSA9IF9zZWxmLnBhbmVzW3NsaWRlbnVtXTtcclxuXHJcbiAgICAgICAgaWYgKHBhbmUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0blwiKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIC8vSWYgcGFuZSBoYXMgYnV0dG9uLCBtYWtlIHJvb20gZm9yIHRob3NlXHJcbiAgICAgICAgICAgIHZhciBwYWRkaW5nID0gOTA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHBhZGRpbmcgPSA1MDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBoZWlnaHQgPSBwYW5lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJpbm5lclwiKVswXS5jbGllbnRIZWlnaHQgKyBwYWRkaW5nO1xyXG5cclxuICAgICAgICBpZiAoc2xpZGVudW0gPT0gX3NlbGYucGFuZXMubGVuZ3RoLTEpIF9zZWxmLmVsZW1lbnQuc3R5bGUubWF4SGVpZ2h0ID0gXCIzMDAwcHhcIjtcclxuXHJcbiAgICAgICAgaWYgKGhlaWdodCA8IDMwMCkgaGVpZ2h0ID0gMzAwO1xyXG4gICAgICAgIF9zZWxmLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRm9jdXM6XCIgKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhwYW5lKTsgXHJcbiAgICAgICAgaWYgKF9zZWxmLmFjdGl2ZSkgcGFuZS5mb2N1cyhfc2VsZiwgcGFuZSk7XHJcbiBcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBfc2VsZi5lbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcclxuICAgICAgICAgICAgX3NlbGYuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiaW5uZXJcIilbMF0uc3R5bGUucG9zaXRpb24gPSBcInN0YXRpY1wiO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIF9zZWxmLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImlubmVyXCIpWzBdLnN0eWxlLnBvc2l0aW9uID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIF9zZWxmLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBcIlwiO1xyXG4gICAgICAgICAgICB9LCA1KTtcclxuICAgICAgICB9LCA1MDApO1xyXG5cclxuICAgICAgICBfc2VsZi5jdXJyZW50U2xpZGUgPSBzbGlkZW51bTtcclxuICAgICAgICB1cGRhdGVTbGlkZXJQcm9ncmVzcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubmV4dFNsaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5nb1RvU2xpZGUoX3NlbGYuY3VycmVudFNsaWRlICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wcmV2U2xpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLmdvVG9TbGlkZShfc2VsZi5jdXJyZW50U2xpZGUgLSAgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9Qcm9ncmVzcyBiYXJcclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVNsaWRlclByb2dyZXNzKCkge1xyXG4gICAgICAgIF9zZWxmLnByb2dyZXNzLnN0eWxlLndpZHRoID0gKDEwMCAvIChfc2VsZi5hY3RpdmVQYW5lcykpICogX3NlbGYuY3VycmVudFNsaWRlICsgXCIlXCI7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZVNsaWRlclByb2dyZXNzID0gdXBkYXRlU2xpZGVyUHJvZ3Jlc3M7XHJcblxyXG4gICAgLyogRXJyb3IgZWxlbWVudCAqL1xyXG4gICAgdGhpcy5lcnJvciA9IGZ1bmN0aW9uKG1zZykge1xyXG4gICAgICAgIF9zZWxmLmFjdGl2ZUVycm9yID0gdHJ1ZTtcclxuICAgICAgICBfc2VsZi5lcnJvckVsZW1lbnQuaW5uZXJIVE1MID0gbXNnO1xyXG4gICAgICAgIF9zZWxmLmVycm9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIF9zZWxmLnBhbmVzW19zZWxmLmN1cnJlbnRTbGlkZV0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImxvYWRpbmdcIilbMF0uY2xhc3NMaXN0LnJlbW92ZShcImxvYWRpbmdcIik7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGhpZGVFcnJvcigpO1xyXG4gICAgICAgIH0sIDUwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhpZGVFcnJvcigpIHtcclxuICAgICAgICBfc2VsZi5lcnJvckVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICBfc2VsZi5hY3RpdmVFcnJvciA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5oaWRlRXJyb3IgPSBoaWRlRXJyb3I7XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0Tm9BcGlFcnJvcigpIHtcclxuICAgICAgICB2YXIgbm9BcGlFcnJvckVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5vX2FwaV9lcnJvclwiKTtcclxuXHJcbiAgICAgICAgbm9BcGlFcnJvckVsZW1lbnQuc3R5bGUuekluZGV4ID0gMTA7XHJcbiAgICAgICAgbm9BcGlFcnJvckVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBOZXR3b3JrIGhlbHBlcnMgKi9cclxuICAgIHZhciBhcGlfdXJsID0gXCJodHRwczovL2FwaS5naWVmZmVrdGl2dC5uby9cIjtcclxuICAgIC8vdmFyIGFwaV91cmwgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9cIjtcclxuXHJcbiAgICB0aGlzLnJlcXVlc3QgPSBmdW5jdGlvbihlbmRwb2ludCwgdHlwZSwgZGF0YSwgY2IpIHtcclxuICAgICAgICB2YXIgaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHZhciB1cmwgPSBhcGlfdXJsICsgZW5kcG9pbnQ7XHJcblxyXG4gICAgICAgIGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgwqDCoMKgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gNCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09IDIwMCApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2IobnVsbCwgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKHJlc3BvbnNlLmNvbnRlbnQsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2IodGhpcy5zdGF0dXMsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIMKgwqDCoCB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gXCJQT1NUXCIpIHtcclxuICAgICAgICAgICAgaHR0cC5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xyXG4gICAgICAgICAgICBodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIik7XHJcbiAgICAgICAgICAgIGh0dHAuc2VuZChcImRhdGE9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJHRVRcIikge1xyXG4gICAgICAgICAgICBodHRwLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcclxuICAgICAgICAgICAgaHR0cC5zZW5kKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL1VJIHNuYXp6eW5lc3NcclxuICAgIGZ1bmN0aW9uIHNldHVwU2VsZWN0T25DbGljaygpIHtcclxuICAgICAgICB2YXIgZWxlbXMgPSBfc2VsZi5wYW5lc1tfc2VsZi5wYW5lcy5sZW5ndGggLSAxXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2VsZWN0LW9uLWNsaWNrXCIpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGVsZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzZWxlY3ROb2RlVGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNlbGVjdE5vZGVUZXh0KGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzO1xyXG4gXHJcbiAgICAgICAgaWYgKCBkb2N1bWVudC5zZWxlY3Rpb24gKSB7XHJcbiAgICAgICAgICAgIHZhciByYW5nZSA9IGRvY3VtZW50LmJvZHkuY3JlYXRlVGV4dFJhbmdlKCk7XHJcbiAgICAgICAgICAgIHJhbmdlLm1vdmVUb0VsZW1lbnRUZXh0KG5vZGUpO1xyXG4gICAgICAgICAgICByYW5nZS5zZWxlY3QoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCB3aW5kb3cuZ2V0U2VsZWN0aW9uICkge1xyXG4gICAgICAgICAgICB2YXIgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xyXG4gICAgICAgICAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHMobm9kZSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcclxuICAgICAgICAgICAgd2luZG93LmdldFNlbGVjdGlvbigpLmFkZFJhbmdlKHJhbmdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9BY3RpdmF0ZSBVSVxyXG4gICAgdGhpcy5zaG93ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHdpZGdldCA9IF9zZWxmO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoXCJ3aWRnZXQtYWN0aXZlXCIpO1xyXG4gICAgICAgIF9zZWxmLndyYXBwZXIuc3R5bGUuekluZGV4ID0gMTAwMDAwO1xyXG5cclxuICAgICAgICBfc2VsZi5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgX3NlbGYud3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIHZhciBhY3RpdmVQYW5lID0gX3NlbGYucGFuZXNbX3NlbGYuY3VycmVudFNsaWRlXTtcclxuICAgICAgICBhY3RpdmVQYW5lLmZvY3VzKF9zZWxmLCBhY3RpdmVQYW5lKTtcclxuXHJcbiAgICAgICAgX3NlbGYuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy9Vc2VyIGlzIGVuZ2FnZWQgaW4gZm9ybSwgYWN0aXZhdGUgXCJhcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gbGVhdmVcIiBwcm9tcHQgb24gYXR0ZW1wdCB0byBuYXZpZ2F0ZSBhd2F5XHJcbiAgICAgICAgd2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShcIndpZGdldC1hY3RpdmVcIik7XHJcbiAgICAgICAgX3NlbGYuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIF9zZWxmLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcclxuICAgICAgICBfc2VsZi5lbGVtZW50LnN0eWxlLm1heEhlaWdodCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IG51bGw7XHJcblxyXG4gICAgICAgIF9zZWxmLmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBfc2VsZi53cmFwcGVyLnN0eWxlLnpJbmRleCA9IC0xO1xyXG4gICAgICAgICAgICBpZiAoX3NlbGYuY3VycmVudFNsaWRlID09IF9zZWxmLnBhbmVzLmxlbmd0aC0xKSB7IFxyXG4gICAgICAgICAgICAgICAgX3NlbGYuZ29Ub1NsaWRlKDApO1xyXG4gICAgICAgICAgICAgICAgX3NlbGYucGFuZXNbMl0uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hlY2stc2VsZWN0LXJlY29tbWVuZGVkXCIpLmNsaWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgfSAgXHJcblxyXG4gICAgLyogUmV0dXJuICovXHJcbiAgICB2YXIgcHJvcGVydGllcyA9IHtcclxuICAgICAgICBlbGVtZW50OiB0aGlzLmVsZW1lbnQsXHJcbiAgICAgICAgcGFuZXM6IHRoaXMucGFuZXMsXHJcbiAgICAgICAgZ29Ub1NsaWRlOiB0aGlzLmdvVG9TbGlkZSxcclxuICAgICAgICBuZXh0U2xpZGU6IHRoaXMubmV4dFNsaWRlLFxyXG4gICAgICAgIHNsaWRlcjogdGhpcy5zbGlkZXIsXHJcbiAgICAgICAgc2V0c3BsaXQ6IHRoaXMuc2V0U3BsaXRWYWx1ZXMsXHJcbiAgICAgICAgc2hvdzogdGhpcy5zaG93LFxyXG4gICAgICAgIGNsb3NlOiB0aGlzLmNsb3NlLFxyXG4gICAgICAgIGVycm9yOiB0aGlzLmVycm9yLFxyXG4gICAgICAgIHJlcXVlc3Q6IHRoaXMucmVxdWVzdCxcclxuICAgICAgICB1cGRhdGVTbGlkZXJQcm9ncmVzczogdGhpcy51cGRhdGVTbGlkZXJQcm9ncmVzcyxcclxuICAgICAgICBwb3N0RG9uYXRpb246IHRoaXMucG9zdERvbmF0aW9uLFxyXG4gICAgICAgIHByZXZTbGlkZTogdGhpcy5wcmV2U2xpZGUsXHJcbiAgICAgICAgaGlkZUVycm9yOiB0aGlzLmhpZGVFcnJvcixcclxuICAgICAgICBzZXR1cDogdGhpcy5zZXR1cFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbn0gXHJcblxyXG53aW5kb3cuRG9uYXRpb25XaWRnZXQgPSBEb25hdGlvbldpZGdldDtcclxuIl19
