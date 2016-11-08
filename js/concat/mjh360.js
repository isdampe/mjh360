// Copyright 2009-2012 by contributors, MIT License
// vim: ts=4 sts=4 sw=4 expandtab

// Module systems magic dance
(function (definition) {
    // RequireJS
    if (typeof define == "function") {
        define(definition);
    // YUI3
    } else if (typeof YUI == "function") {
        YUI.add("es5", definition);
    // CommonJS and <script>
    } else {
        definition();
    }
})(function () {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * Annotated ES5: http://es5.github.com/ (specific links below)
 * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
 * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
 */

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

function Empty() {}

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (typeof target != "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = _Array_slice_.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var result = target.apply(
                    this,
                    args.concat(_Array_slice_.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(_Array_slice_.call(arguments))
                );

            }

        };
        if(target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
        }
        // XXX bound.length is never writable, so don't even try
        //
        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.
        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    };
}

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var _Array_slice_ = prototypeOfArray.slice;
// Having a toString local variable name breaks in Opera so use _toString.
var _toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}

//
// Array
// =====
//

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.12
// Default value for second param
// [bugfix, ielt9, old browsers]
// IE < 9 bug: [1,2].splice(0).join("") == "" but should be "12"
if ([1,2].splice(0).length != 2) {
    var array_splice = Array.prototype.splice;

    if(function() { // test IE < 9 to splice bug - see issue #138
        function makeArray(l) {
            var a = [];
            while (l--) {
                a.unshift(l)
            }
            return a
        }

        var array = []
            , lengthBefore
        ;

        array.splice.bind(array, 0, 0).apply(null, makeArray(20));
        array.splice.bind(array, 0, 0).apply(null, makeArray(26));

        lengthBefore = array.length; //20
        array.splice(5, 0, "XXX"); // add one element

        if(lengthBefore + 1 == array.length) {
            return true;// has right splice implementation without bugs
        }
        // else {
        //    IE8 bug
        // }
    }()) {//IE 6/7
        Array.prototype.splice = function(start, deleteCount) {
            if (!arguments.length) {
                return [];
            } else {
                return array_splice.apply(this, [
                    start === void 0 ? 0 : start,
                    deleteCount === void 0 ? (this.length - start) : deleteCount
                ].concat(_Array_slice_.call(arguments, 2)))
            }
        };
    }
    else {//IE8
        Array.prototype.splice = function(start, deleteCount) {
            var result
                , args = _Array_slice_.call(arguments, 2)
                , addElementsCount = args.length
            ;

            if(!arguments.length) {
                return [];
            }

            if(start === void 0) { // default
                start = 0;
            }
            if(deleteCount === void 0) { // default
                deleteCount = this.length - start;
            }

            if(addElementsCount > 0) {
                if(deleteCount <= 0) {
                    if(start == this.length) { // tiny optimisation #1
                        this.push.apply(this, args);
                        return [];
                    }

                    if(start == 0) { // tiny optimisation #2
                        this.unshift.apply(this, args);
                        return [];
                    }
                }

                // Array.prototype.splice implementation
                result = _Array_slice_.call(this, start, start + deleteCount);// delete part
                args.push.apply(args, _Array_slice_.call(this, start + deleteCount, this.length));// right part
                args.unshift.apply(args, _Array_slice_.call(this, 0, start));// left part

                // delete all items from this array and replace it to 'left part' + _Array_slice_.call(arguments, 2) + 'right part'
                args.unshift(0, this.length);

                array_splice.apply(this, args);

                return result;
            }

            return array_splice.call(this, start, deleteCount);
        }

    }
}

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.13
// Return len+argCount.
// [bugfix, ielt8]
// IE < 8 bug: [].unshift(0) == undefined but should be "1"
if ([].unshift(0) != 1) {
    var array_unshift = Array.prototype.unshift;
    Array.prototype.unshift = function() {
        array_unshift.apply(this, arguments);
        return this.length;
    };
}

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return _toString(obj) == "[object Array]";
    };
}

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// http://es5.github.com/#x15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

// Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)
var boxedString = Object("a"),
    splitString = boxedString[0] != "a" || !(0 in boxedString);

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object
                // context
                fun.call(thisp, self[i], i, object);
            }
        }
    };
}

// ES5 15.4.4.19
// http://es5.github.com/#x15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, object);
        }
        return result;
    };
}

// ES5 15.4.4.20
// http://es5.github.com/#x15.4.4.20
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                    object,
            length = self.length >>> 0,
            result = [],
            value,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                value = self[i];
                if (fun.call(thisp, value, i, object)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}

// ES5 15.4.4.16
// http://es5.github.com/#x15.4.4.16
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, object)) {
                return false;
            }
        }
        return true;
    };
}

// ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, object)) {
                return true;
            }
        }
        return false;
    };
}

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value and an empty array
        if (!length && arguments.length == 1) {
            throw new TypeError("reduce of empty array with no initial value");
        }

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length) {
                    throw new TypeError("reduce of empty array with no initial value");
                }
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        }

        return result;
    };
}

// ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value, empty array
        if (!length && arguments.length == 1) {
            throw new TypeError("reduceRight of empty array with no initial value");
        }

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0) {
                    throw new TypeError("reduceRight of empty array with no initial value");
                }
            } while (true);
        }

        if (i < 0) {
            return result;
        }

        do {
            if (i in this) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        } while (i--);

        return result;
    };
}

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf || ([0, 1].indexOf(1, 2) != -1)) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}

// ES5 15.4.4.15
// http://es5.github.com/#x15.4.4.15
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf || ([0, 1].lastIndexOf(0, -3) != -1)) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }
        var i = length - 1;
        if (arguments.length > 1) {
            i = Math.min(i, toInteger(arguments[1]));
        }
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i]) {
                return i;
            }
        }
        return -1;
    };
}

//
// Object
// ======
//

// ES5 15.2.3.14
// http://es5.github.com/#x15.2.3.14
if (!Object.keys) {
    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null}) {
        hasDontEnumBug = false;
    }

    Object.keys = function keys(object) {

        if (
            (typeof object != "object" && typeof object != "function") ||
            object === null
        ) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }
        return keys;
    };

}

//
// Date
// ====
//

// ES5 15.9.5.43
// http://es5.github.com/#x15.9.5.43
// This function returns a String value represent the instance in time
// represented by this Date object. The format of the String is the Date Time
// string format defined in 15.9.1.15. All fields are present in the String.
// The time zone is always UTC, denoted by the suffix Z. If the time value of
// this object is not a finite Number a RangeError exception is thrown.
var negativeDate = -62198755200000,
    negativeYearString = "-000001";
if (
    !Date.prototype.toISOString ||
    (new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1)
) {
    Date.prototype.toISOString = function toISOString() {
        var result, length, value, year, month;
        if (!isFinite(this)) {
            throw new RangeError("Date.prototype.toISOString called on non-finite value.");
        }

        year = this.getUTCFullYear();

        month = this.getUTCMonth();
        // see https://github.com/kriskowal/es5-shim/issues/111
        year += Math.floor(month / 12);
        month = (month % 12 + 12) % 12;

        // the date time string format is specified in 15.9.1.15.
        result = [month + 1, this.getUTCDate(),
            this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
        year = (
            (year < 0 ? "-" : (year > 9999 ? "+" : "")) +
            ("00000" + Math.abs(year))
            .slice(0 <= year && year <= 9999 ? -4 : -6)
        );

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two
            // digits.
            if (value < 10) {
                result[length] = "0" + value;
            }
        }
        // pad milliseconds to have three digits.
        return (
            year + "-" + result.slice(0, 2).join("-") +
            "T" + result.slice(2).join(":") + "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) + "Z"
        );
    };
}


// ES5 15.9.5.44
// http://es5.github.com/#x15.9.5.44
// This function provides a String representation of a Date object for use by
// JSON.stringify (15.12.3).
var dateToJSONIsSupported = false;
try {
    dateToJSONIsSupported = (
        Date.prototype.toJSON &&
        new Date(NaN).toJSON() === null &&
        new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 &&
        Date.prototype.toJSON.call({ // generic
            toISOString: function () {
                return true;
            }
        })
    );
} catch (e) {
}
if (!dateToJSONIsSupported) {
    Date.prototype.toJSON = function toJSON(key) {
        // When the toJSON method is called with argument key, the following
        // steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be toPrimitive(O, hint Number).
        var o = Object(this),
            tv = toPrimitive(o),
            toISO;
        // 3. If tv is a Number and is not finite, return null.
        if (typeof tv === "number" && !isFinite(tv)) {
            return null;
        }
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        toISO = o.toISOString;
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (typeof toISO != "function") {
            throw new TypeError("toISOString property is not callable");
        }
        // 6. Return the result of calling the [[Call]] internal method of
        //  toISO with O as the this value and an empty argument list.
        return toISO.call(o);

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// ES5 15.9.4.2
// http://es5.github.com/#x15.9.4.2
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (!Date.parse || "Date.parse is buggy") {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        function Date(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length == 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format.
        var isoDateExpression = new RegExp("^" +
            "(\\d{4}|[\+\-]\\d{6})" + // four-digit year capture or sign +
                                      // 6-digit extended year
            "(?:-(\\d{2})" + // optional month capture
            "(?:-(\\d{2})" + // optional day capture
            "(?:" + // capture hours:minutes:seconds.milliseconds
                "T(\\d{2})" + // hours capture
                ":(\\d{2})" + // minutes capture
                "(?:" + // optional :seconds.milliseconds
                    ":(\\d{2})" + // seconds capture
                    "(?:(\\.\\d{1,}))?" + // milliseconds capture
                ")?" +
            "(" + // capture UTC offset component
                "Z|" + // UTC capture
                "(?:" + // offset specifier +/-hours:minutes
                    "([-+])" + // sign capture
                    "(\\d{2})" + // hours offset capture
                    ":(\\d{2})" + // minutes offset capture
                ")" +
            ")?)?)?)?" +
        "$");

        var months = [
            0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365
        ];

        function dayFromMonth(year, month) {
            var t = month > 1 ? 1 : 0;
            return (
                months[month] +
                Math.floor((year - 1969 + t) / 4) -
                Math.floor((year - 1901 + t) / 100) +
                Math.floor((year - 1601 + t) / 400) +
                365 * (year - 1970)
            );
        }

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate) {
            Date[key] = NativeDate[key];
        }

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle simplified ISO 8601 strings
        Date.parse = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                // parse months, days, hours, minutes, seconds, and milliseconds
                // provide default values if necessary
                // parse the UTC offset component
                var year = Number(match[1]),
                    month = Number(match[2] || 1) - 1,
                    day = Number(match[3] || 1) - 1,
                    hour = Number(match[4] || 0),
                    minute = Number(match[5] || 0),
                    second = Number(match[6] || 0),
                    millisecond = Math.floor(Number(match[7] || 0) * 1000),
                    // When time zone is missed, local offset should be used
                    // (ES 5.1 bug)
                    // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                    offset = !match[4] || match[8] ?
                        0 : Number(new NativeDate(1970, 0)),
                    signOffset = match[9] === "-" ? 1 : -1,
                    hourOffset = Number(match[10] || 0),
                    minuteOffset = Number(match[11] || 0),
                    result;
                if (
                    hour < (
                        minute > 0 || second > 0 || millisecond > 0 ?
                        24 : 25
                    ) &&
                    minute < 60 && second < 60 && millisecond < 1000 &&
                    month > -1 && month < 12 && hourOffset < 24 &&
                    minuteOffset < 60 && // detect invalid offsets
                    day > -1 &&
                    day < (
                        dayFromMonth(year, month + 1) -
                        dayFromMonth(year, month)
                    )
                ) {
                    result = (
                        (dayFromMonth(year, month) + day) * 24 +
                        hour +
                        hourOffset * signOffset
                    ) * 60;
                    result = (
                        (result + minute + minuteOffset * signOffset) * 60 +
                        second
                    ) * 1000 + millisecond + offset;
                    if (-8.64e15 <= result && result <= 8.64e15) {
                        return result;
                    }
                }
                return NaN;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}


//
// Number
// ======
//

// ES5.1 15.7.4.5
// http://es5.github.com/#x15.7.4.5
if (!Number.prototype.toFixed || (0.00008).toFixed(3) !== '0.000' || (0.9).toFixed(0) === '0' || (1.255).toFixed(2) !== '1.25' || (1000000000000000128).toFixed(0) !== "1000000000000000128") {
    // Hide these variables and functions
    (function () {
        var base, size, data, i;

        base = 1e7;
        size = 6;
        data = [0, 0, 0, 0, 0, 0];

        function multiply(n, c) {
            var i = -1;
            while (++i < size) {
                c += n * data[i];
                data[i] = c % base;
                c = Math.floor(c / base);
            }
        }

        function divide(n) {
            var i = size, c = 0;
            while (--i >= 0) {
                c += data[i];
                data[i] = Math.floor(c / n);
                c = (c % n) * base;
            }
        }

        function toString() {
            var i = size;
            var s = '';
            while (--i >= 0) {
                if (s !== '' || i === 0 || data[i] !== 0) {
                    var t = String(data[i]);
                    if (s === '') {
                        s = t;
                    } else {
                        s += '0000000'.slice(0, 7 - t.length) + t;
                    }
                }
            }
            return s;
        }

        function pow(x, n, acc) {
            return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
        }

        function log(x) {
            var n = 0;
            while (x >= 4096) {
                n += 12;
                x /= 4096;
            }
            while (x >= 2) {
                n += 1;
                x /= 2;
            }
            return n;
        }

        Number.prototype.toFixed = function (fractionDigits) {
            var f, x, s, m, e, z, j, k;

            // Test for NaN and round fractionDigits down
            f = Number(fractionDigits);
            f = f !== f ? 0 : Math.floor(f);

            if (f < 0 || f > 20) {
                throw new RangeError("Number.toFixed called with invalid number of decimals");
            }

            x = Number(this);

            // Test for NaN
            if (x !== x) {
                return "NaN";
            }

            // If it is too big or small, return the string value of the number
            if (x <= -1e21 || x >= 1e21) {
                return String(x);
            }

            s = "";

            if (x < 0) {
                s = "-";
                x = -x;
            }

            m = "0";

            if (x > 1e-21) {
                // 1e-21 < x < 1e21
                // -70 < log2(x) < 70
                e = log(x * pow(2, 69, 1)) - 69;
                z = (e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1));
                z *= 0x10000000000000; // Math.pow(2, 52);
                e = 52 - e;

                // -18 < e < 122
                // x = z / 2 ^ e
                if (e > 0) {
                    multiply(0, z);
                    j = f;

                    while (j >= 7) {
                        multiply(1e7, 0);
                        j -= 7;
                    }

                    multiply(pow(10, j, 1), 0);
                    j = e - 1;

                    while (j >= 23) {
                        divide(1 << 23);
                        j -= 23;
                    }

                    divide(1 << j);
                    multiply(1, 1);
                    divide(2);
                    m = toString();
                } else {
                    multiply(0, z);
                    multiply(1 << (-e), 0);
                    m = toString() + '0.00000000000000000000'.slice(2, 2 + f);
                }
            }

            if (f > 0) {
                k = m.length;

                if (k <= f) {
                    m = s + '0.0000000000000000000'.slice(0, f - k + 2) + m;
                } else {
                    m = s + m.slice(0, k - f) + '.' + m.slice(k - f);
                }
            } else {
                m = s + m;
            }

            return m;
        }
    }());
}


//
// String
// ======
//


// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14

// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
// Many browsers do not split properly with regular expressions or they
// do not perform the split correctly under obscure conditions.
// See http://blog.stevenlevithan.com/archives/cross-browser-split
// I've tested in many browsers and this seems to cover the deviant ones:
//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
//       [undefined, "t", undefined, "e", ...]
//    ''.split(/.?/) should be [], not [""]
//    '.'.split(/()()/) should be ["."], not ["", "", "."]

var string_split = String.prototype.split;
if (
    'ab'.split(/(?:ab)*/).length !== 2 ||
    '.'.split(/(.?)(.?)/).length !== 4 ||
    'tesst'.split(/(s)*/)[1] === "t" ||
    ''.split(/.?/).length === 0 ||
    '.'.split(/()()/).length > 1
) {
    (function () {
        var compliantExecNpcg = /()??/.exec("")[1] === void 0; // NPCG: nonparticipating capturing group

        String.prototype.split = function (separator, limit) {
            var string = this;
            if (separator === void 0 && limit === 0)
                return [];

            // If `separator` is not a regex, use native split
            if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
                return string_split.apply(this, arguments);
            }

            var output = [],
                flags = (separator.ignoreCase ? "i" : "") +
                        (separator.multiline  ? "m" : "") +
                        (separator.extended   ? "x" : "") + // Proposed for ES6
                        (separator.sticky     ? "y" : ""), // Firefox 3+
                lastLastIndex = 0,
                // Make `global` and avoid `lastIndex` issues by working with a copy
                separator = new RegExp(separator.source, flags + "g"),
                separator2, match, lastIndex, lastLength;
            string += ""; // Type-convert
            if (!compliantExecNpcg) {
                // Doesn't need flags gy, but they don't hurt
                separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            limit = limit === void 0 ?
                -1 >>> 0 : // Math.pow(2, 32) - 1
                limit >>> 0; // ToUint32(limit)
            while (match = separator.exec(string)) {
                // `separator.lastIndex` is not reliable cross-browser
                lastIndex = match.index + match[0].length;
                if (lastIndex > lastLastIndex) {
                    output.push(string.slice(lastLastIndex, match.index));
                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
                    // nonparticipating capturing groups
                    if (!compliantExecNpcg && match.length > 1) {
                        match[0].replace(separator2, function () {
                            for (var i = 1; i < arguments.length - 2; i++) {
                                if (arguments[i] === void 0) {
                                    match[i] = void 0;
                                }
                            }
                        });
                    }
                    if (match.length > 1 && match.index < string.length) {
                        Array.prototype.push.apply(output, match.slice(1));
                    }
                    lastLength = match[0].length;
                    lastLastIndex = lastIndex;
                    if (output.length >= limit) {
                        break;
                    }
                }
                if (separator.lastIndex === match.index) {
                    separator.lastIndex++; // Avoid an infinite loop
                }
            }
            if (lastLastIndex === string.length) {
                if (lastLength || !separator.test("")) {
                    output.push("");
                }
            } else {
                output.push(string.slice(lastLastIndex));
            }
            return output.length > limit ? output.slice(0, limit) : output;
        };
    }());

// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String,
// which is the this value (converted to a String). If limit is not undefined,
// then the output array is truncated so that it contains no more than limit
// elements.
// "0".split(undefined, 0) -> []
} else if ("0".split(void 0, 0).length) {
    String.prototype.split = function(separator, limit) {
        if (separator === void 0 && limit === 0) return [];
        return string_split.apply(this, arguments);
    }
}


// ECMA-262, 3rd B.2.3
// Note an ECMAScript standart, although ECMAScript 3rd Edition has a
// non-normative section suggesting uniform semantics and it should be
// normalized across all browsers
// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
if("".substr && "0b".substr(-1) !== "b") {
    var string_substr = String.prototype.substr;
    /**
     *  Get the substring of a string
     *  @param  {integer}  start   where to start the substring
     *  @param  {integer}  length  how many characters to return
     *  @return {string}
     */
    String.prototype.substr = function(start, length) {
        return string_substr.call(
            this,
            start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
            length
        );
    }
}

// ES5 15.5.4.20
// http://es5.github.com/#x15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        if (this === void 0 || this === null) {
            throw new TypeError("can't convert "+this+" to object");
        }
        return String(this)
            .replace(trimBeginRegexp, "")
            .replace(trimEndRegexp, "");
    };
}

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer

function toInteger(n) {
    n = +n;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

function isPrimitive(input) {
    var type = typeof input;
    return (
        input === null ||
        type === "undefined" ||
        type === "boolean" ||
        type === "number" ||
        type === "string"
    );
}

function toPrimitive(input) {
    var val, valueOf, toString;
    if (isPrimitive(input)) {
        return input;
    }
    valueOf = input.valueOf;
    if (typeof valueOf === "function") {
        val = valueOf.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    toString = input.toString;
    if (typeof toString === "function") {
        val = toString.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    throw new TypeError();
}

// ES5 9.9
// http://es5.github.com/#x9.9
var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert "+o+" to object");
    }
    return Object(o);
};

});
;/* Copyright (c) 2012 Jeremy McPeak http://www.wdonline.com
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function() {

    function init() {

        // filter out unsupported browsers
        if (Element.prototype.addEventListener || !Object.defineProperty) {
            return {
                loadedForBrowser : false
            };
        }

        // create an MS event object and get prototype
        var proto = document.createEventObject().constructor.prototype;

        /**
     * Indicates whether an event propagates up from the target.
     * @returns Boolean
     */
        Object.defineProperty(proto, "bubbles", {
            get: function() {
                // not a complete list of DOM3 events; some of these IE8 doesn't support
                var bubbleEvents = ["select", "scroll", "click", "dblclick",
                    "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "wheel", "textinput",
                    "keydown", "keypress", "keyup"],
                    type = this.type;

                for (var i = 0, l = bubbleEvents.length; i < l; i++) {
                    if (type === bubbleEvents[i]) {
                        return true;
                    }
                }

                return false;
            }
        });


        /**
     * Indicates whether or not preventDefault() was called on the event.
     * @returns Boolean
     */
        Object.defineProperty(proto, "defaultPrevented", {
            get: function() {
                // if preventDefault() was never called, or returnValue not given a value
                // then returnValue is undefined
                var returnValue = this.returnValue,
                    undef;

                return !(returnValue === undef || returnValue);
            }
        });


        /**
     * Gets the secondary targets of mouseover and mouseout events (toElement and fromElement)
     * @returns EventTarget or {null}
     */
        Object.defineProperty(proto, "relatedTarget", {
            get: function() {
                var type = this.type;

                if (type === "mouseover" || type === "mouseout") {
                    return (type === "mouseover") ? this.fromElement : this.toElement;
                }

                return null;
            }
        });


        /**
     * Gets the target of the event (srcElement)
     * @returns EventTarget
     */
        Object.defineProperty(proto, "target", {
            get: function() { return this.srcElement; }
        });


        /**
     * Cancels the event if it is cancelable. (returnValue)
     * @returns {undefined}
     */
        proto.preventDefault = function() {
            this.returnValue = false;
        };

        /**
     * Prevents further propagation of the current event. (cancelBubble())
     * @returns {undefined}
     */
        proto.stopPropagation = function() {
            this.cancelBubble = true;
        };

        /***************************************
     *
     * Event Listener Setup
     *    Nothing complex here
     *
     ***************************************/

        /**
     * Determines if the provided object implements EventListener
     * @returns boolean
    */
        var implementsEventListener = function(obj) {
            return (typeof obj !== "function" && typeof obj["handleEvent"] === "function");
        };

        var customELKey = "__eventShim__";

        /**
     * Adds an event listener to the DOM object
     * @returns {undefined}
     */
        var addEventListenerFunc = function(type, handler, useCapture) {
            // useCapture isn't used; it's IE!

            var fn = handler;

            if (implementsEventListener(handler)) {

                if (typeof handler[customELKey] !== "function") {
                    handler[customELKey] = function(e) {
                        handler["handleEvent"](e);
                    };
                }

                fn = handler[customELKey];
            }

            this.attachEvent("on" + type, fn);
        };

        /**
     * Removes an event listener to the DOM object
     * @returns {undefined}
     */
        var removeEventListenerFunc = function(type, handler, useCapture) {
            // useCapture isn't used; it's IE!

            var fn = handler;

            if (implementsEventListener(handler)) {
                fn = handler[customELKey];
            }

            this.detachEvent("on" + type, fn);
        };

        // setup the DOM and window objects
        HTMLDocument.prototype.addEventListener = addEventListenerFunc;
        HTMLDocument.prototype.removeEventListener = removeEventListenerFunc;

        Element.prototype.addEventListener = addEventListenerFunc;
        Element.prototype.removeEventListener = removeEventListenerFunc;

        window.addEventListener = addEventListenerFunc;
        window.removeEventListener = removeEventListenerFunc;

        return {
            loadedForBrowser : true
        };
    }

    // check for AMD support
    if (typeof define === "function" && define["amd"]) {
        define(init);
    } else {
        return init();
    }
    
}());;// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());;// Marzipano - a 360° media viewer for the modern web (v0.5.0)
//
// Copyright 2016 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.Marzipano=t()}}(function(){var t;return function e(t,i,n){function r(s,a){if(!i[s]){if(!t[s]){var l="function"==typeof require&&require;if(!a&&l)return l(s,!0);if(o)return o(s,!0);var h=new Error("Cannot find module '"+s+"'");throw h.code="MODULE_NOT_FOUND",h}var u=i[s]={exports:{}};t[s][0].call(u.exports,function(e){var i=t[s][1][e];return r(i?i:e)},u,u.exports,e,t,i,n)}return i[s].exports}for(var o="function"==typeof require&&require,s=0;s<n.length;s++)r(n[s]);return r}({1:[function(e,i,n){!function(e,n){"undefined"!=typeof i&&i.exports?i.exports=n():"function"==typeof t&&t.amd?t(n):this[e]=n()}("bowser",function(){function t(t){function i(e){var i=t.match(e);return i&&i.length>1&&i[1]||""}function n(e){var i=t.match(e);return i&&i.length>1&&i[2]||""}var r,o=i(/(ipod|iphone|ipad)/i).toLowerCase(),s=/like android/i.test(t),a=!s&&/android/i.test(t),l=/CrOS/.test(t),h=i(/edge\/(\d+(\.\d+)?)/i),u=i(/version\/(\d+(\.\d+)?)/i),c=/tablet/i.test(t),p=!c&&/[^-]mobi/i.test(t);/opera|opr/i.test(t)?r={name:"Opera",opera:e,version:u||i(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)}:/yabrowser/i.test(t)?r={name:"Yandex Browser",yandexbrowser:e,version:u||i(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)}:/windows phone/i.test(t)?(r={name:"Windows Phone",windowsphone:e},h?(r.msedge=e,r.version=h):(r.msie=e,r.version=i(/iemobile\/(\d+(\.\d+)?)/i))):/msie|trident/i.test(t)?r={name:"Internet Explorer",msie:e,version:i(/(?:msie |rv:)(\d+(\.\d+)?)/i)}:l?r={name:"Chrome",chromeBook:e,chrome:e,version:i(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:/chrome.+? edge/i.test(t)?r={name:"Microsoft Edge",msedge:e,version:h}:/chrome|crios|crmo/i.test(t)?r={name:"Chrome",chrome:e,version:i(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:o?(r={name:"iphone"==o?"iPhone":"ipad"==o?"iPad":"iPod"},u&&(r.version=u)):/sailfish/i.test(t)?r={name:"Sailfish",sailfish:e,version:i(/sailfish\s?browser\/(\d+(\.\d+)?)/i)}:/seamonkey\//i.test(t)?r={name:"SeaMonkey",seamonkey:e,version:i(/seamonkey\/(\d+(\.\d+)?)/i)}:/firefox|iceweasel/i.test(t)?(r={name:"Firefox",firefox:e,version:i(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)},/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(t)&&(r.firefoxos=e)):/silk/i.test(t)?r={name:"Amazon Silk",silk:e,version:i(/silk\/(\d+(\.\d+)?)/i)}:a?r={name:"Android",version:u}:/phantom/i.test(t)?r={name:"PhantomJS",phantom:e,version:i(/phantomjs\/(\d+(\.\d+)?)/i)}:/blackberry|\bbb\d+/i.test(t)||/rim\stablet/i.test(t)?r={name:"BlackBerry",blackberry:e,version:u||i(/blackberry[\d]+\/(\d+(\.\d+)?)/i)}:/(web|hpw)os/i.test(t)?(r={name:"WebOS",webos:e,version:u||i(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)},/touchpad\//i.test(t)&&(r.touchpad=e)):r=/bada/i.test(t)?{name:"Bada",bada:e,version:i(/dolfin\/(\d+(\.\d+)?)/i)}:/tizen/i.test(t)?{name:"Tizen",tizen:e,version:i(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i)||u}:/safari/i.test(t)?{name:"Safari",safari:e,version:u}:{name:i(/^(.*)\/(.*) /),version:n(/^(.*)\/(.*) /)},!r.msedge&&/(apple)?webkit/i.test(t)?(r.name=r.name||"Webkit",r.webkit=e,!r.version&&u&&(r.version=u)):!r.opera&&/gecko\//i.test(t)&&(r.name=r.name||"Gecko",r.gecko=e,r.version=r.version||i(/gecko\/(\d+(\.\d+)?)/i)),r.msedge||!a&&!r.silk?o&&(r[o]=e,r.ios=e):r.android=e;var d="";r.windowsphone?d=i(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i):o?(d=i(/os (\d+([_\s]\d+)*) like mac os x/i),d=d.replace(/[_\s]/g,".")):a?d=i(/android[ \/-](\d+(\.\d+)*)/i):r.webos?d=i(/(?:web|hpw)os\/(\d+(\.\d+)*)/i):r.blackberry?d=i(/rim\stablet\sos\s(\d+(\.\d+)*)/i):r.bada?d=i(/bada\/(\d+(\.\d+)*)/i):r.tizen&&(d=i(/tizen[\/\s](\d+(\.\d+)*)/i)),d&&(r.osversion=d);var f=d.split(".")[0];return c||"ipad"==o||a&&(3==f||4==f&&!p)||r.silk?r.tablet=e:(p||"iphone"==o||"ipod"==o||a||r.blackberry||r.webos||r.bada)&&(r.mobile=e),r.msedge||r.msie&&r.version>=10||r.yandexbrowser&&r.version>=15||r.chrome&&r.version>=20||r.firefox&&r.version>=20||r.safari&&r.version>=6||r.opera&&r.version>=10||r.ios&&r.osversion&&r.osversion.split(".")[0]>=6||r.blackberry&&r.version>=10.1?r.a=e:r.msie&&r.version<10||r.chrome&&r.version<20||r.firefox&&r.version<20||r.safari&&r.version<6||r.opera&&r.version<10||r.ios&&r.osversion&&r.osversion.split(".")[0]<6?r.c=e:r.x=e,r}var e=!0,i=t("undefined"!=typeof navigator?navigator.userAgent:"");return i.test=function(t){for(var e=0;e<t.length;++e){var n=t[e];if("string"==typeof n&&n in i)return!0}return!1},i._detect=t,i})},{}],2:[function(t,e,i){i.glMatrix=t("./gl-matrix/common.js"),i.mat2=t("./gl-matrix/mat2.js"),i.mat2d=t("./gl-matrix/mat2d.js"),i.mat3=t("./gl-matrix/mat3.js"),i.mat4=t("./gl-matrix/mat4.js"),i.quat=t("./gl-matrix/quat.js"),i.vec2=t("./gl-matrix/vec2.js"),i.vec3=t("./gl-matrix/vec3.js"),i.vec4=t("./gl-matrix/vec4.js")},{"./gl-matrix/common.js":3,"./gl-matrix/mat2.js":4,"./gl-matrix/mat2d.js":5,"./gl-matrix/mat3.js":6,"./gl-matrix/mat4.js":7,"./gl-matrix/quat.js":8,"./gl-matrix/vec2.js":9,"./gl-matrix/vec3.js":10,"./gl-matrix/vec4.js":11}],3:[function(t,e,i){var n={};n.EPSILON=1e-6,n.ARRAY_TYPE="undefined"!=typeof Float32Array?Float32Array:Array,n.RANDOM=Math.random,n.ENABLE_SIMD=!1,n.SIMD_AVAILABLE=n.ARRAY_TYPE===Float32Array&&"SIMD"in this,n.USE_SIMD=n.ENABLE_SIMD&&n.SIMD_AVAILABLE,n.setMatrixArrayType=function(t){n.ARRAY_TYPE=t};var r=Math.PI/180;n.toRadian=function(t){return t*r},n.equals=function(t,e){return Math.abs(t-e)<=n.EPSILON*Math.max(1,Math.abs(t),Math.abs(e))},e.exports=n},{}],4:[function(t,e,i){var n=t("./common.js"),r={};r.create=function(){var t=new n.ARRAY_TYPE(4);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},r.clone=function(t){var e=new n.ARRAY_TYPE(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e},r.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t},r.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},r.fromValues=function(t,e,i,r){var o=new n.ARRAY_TYPE(4);return o[0]=t,o[1]=e,o[2]=i,o[3]=r,o},r.set=function(t,e,i,n,r){return t[0]=e,t[1]=i,t[2]=n,t[3]=r,t},r.transpose=function(t,e){if(t===e){var i=e[1];t[1]=e[2],t[2]=i}else t[0]=e[0],t[1]=e[2],t[2]=e[1],t[3]=e[3];return t},r.invert=function(t,e){var i=e[0],n=e[1],r=e[2],o=e[3],s=i*o-r*n;return s?(s=1/s,t[0]=o*s,t[1]=-n*s,t[2]=-r*s,t[3]=i*s,t):null},r.adjoint=function(t,e){var i=e[0];return t[0]=e[3],t[1]=-e[1],t[2]=-e[2],t[3]=i,t},r.determinant=function(t){return t[0]*t[3]-t[2]*t[1]},r.multiply=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3],a=i[0],l=i[1],h=i[2],u=i[3];return t[0]=n*a+o*l,t[1]=r*a+s*l,t[2]=n*h+o*u,t[3]=r*h+s*u,t},r.mul=r.multiply,r.rotate=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3],a=Math.sin(i),l=Math.cos(i);return t[0]=n*l+o*a,t[1]=r*l+s*a,t[2]=n*-a+o*l,t[3]=r*-a+s*l,t},r.scale=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3],a=i[0],l=i[1];return t[0]=n*a,t[1]=r*a,t[2]=o*l,t[3]=s*l,t},r.fromRotation=function(t,e){var i=Math.sin(e),n=Math.cos(e);return t[0]=n,t[1]=i,t[2]=-i,t[3]=n,t},r.fromScaling=function(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=e[1],t},r.str=function(t){return"mat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},r.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2))},r.LDU=function(t,e,i,n){return t[2]=n[2]/n[0],i[0]=n[0],i[1]=n[1],i[3]=n[3]-t[2]*i[1],[t,e,i]},r.add=function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t[2]=e[2]+i[2],t[3]=e[3]+i[3],t},r.subtract=function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t[2]=e[2]-i[2],t[3]=e[3]-i[3],t},r.sub=r.subtract,r.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]},r.equals=function(t,e){var i=t[0],r=t[1],o=t[2],s=t[3],a=e[0],l=e[1],h=e[2],u=e[3];return Math.abs(i-a)<=n.EPSILON*Math.max(1,Math.abs(i),Math.abs(a))&&Math.abs(r-l)<=n.EPSILON*Math.max(1,Math.abs(r),Math.abs(l))&&Math.abs(o-h)<=n.EPSILON*Math.max(1,Math.abs(o),Math.abs(h))&&Math.abs(s-u)<=n.EPSILON*Math.max(1,Math.abs(s),Math.abs(u))},r.multiplyScalar=function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t[3]=e[3]*i,t},r.multiplyScalarAndAdd=function(t,e,i,n){return t[0]=e[0]+i[0]*n,t[1]=e[1]+i[1]*n,t[2]=e[2]+i[2]*n,t[3]=e[3]+i[3]*n,t},e.exports=r},{"./common.js":3}],5:[function(t,e,i){var n=t("./common.js"),r={};r.create=function(){var t=new n.ARRAY_TYPE(6);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},r.clone=function(t){var e=new n.ARRAY_TYPE(6);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e},r.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t},r.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},r.fromValues=function(t,e,i,r,o,s){var a=new n.ARRAY_TYPE(6);return a[0]=t,a[1]=e,a[2]=i,a[3]=r,a[4]=o,a[5]=s,a},r.set=function(t,e,i,n,r,o,s){return t[0]=e,t[1]=i,t[2]=n,t[3]=r,t[4]=o,t[5]=s,t},r.invert=function(t,e){var i=e[0],n=e[1],r=e[2],o=e[3],s=e[4],a=e[5],l=i*o-n*r;return l?(l=1/l,t[0]=o*l,t[1]=-n*l,t[2]=-r*l,t[3]=i*l,t[4]=(r*a-o*s)*l,t[5]=(n*s-i*a)*l,t):null},r.determinant=function(t){return t[0]*t[3]-t[1]*t[2]},r.multiply=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3],a=e[4],l=e[5],h=i[0],u=i[1],c=i[2],p=i[3],d=i[4],f=i[5];return t[0]=n*h+o*u,t[1]=r*h+s*u,t[2]=n*c+o*p,t[3]=r*c+s*p,t[4]=n*d+o*f+a,t[5]=r*d+s*f+l,t},r.mul=r.multiply,r.rotate=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3],a=e[4],l=e[5],h=Math.sin(i),u=Math.cos(i);return t[0]=n*u+o*h,t[1]=r*u+s*h,t[2]=n*-h+o*u,t[3]=r*-h+s*u,t[4]=a,t[5]=l,t},r.scale=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3],a=e[4],l=e[5],h=i[0],u=i[1];return t[0]=n*h,t[1]=r*h,t[2]=o*u,t[3]=s*u,t[4]=a,t[5]=l,t},r.translate=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3],a=e[4],l=e[5],h=i[0],u=i[1];return t[0]=n,t[1]=r,t[2]=o,t[3]=s,t[4]=n*h+o*u+a,t[5]=r*h+s*u+l,t},r.fromRotation=function(t,e){var i=Math.sin(e),n=Math.cos(e);return t[0]=n,t[1]=i,t[2]=-i,t[3]=n,t[4]=0,t[5]=0,t},r.fromScaling=function(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=e[1],t[4]=0,t[5]=0,t},r.fromTranslation=function(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=e[0],t[5]=e[1],t},r.str=function(t){return"mat2d("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+")"},r.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+1)},r.add=function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t[2]=e[2]+i[2],t[3]=e[3]+i[3],t[4]=e[4]+i[4],t[5]=e[5]+i[5],t},r.subtract=function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t[2]=e[2]-i[2],t[3]=e[3]-i[3],t[4]=e[4]-i[4],t[5]=e[5]-i[5],t},r.sub=r.subtract,r.multiplyScalar=function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t[3]=e[3]*i,t[4]=e[4]*i,t[5]=e[5]*i,t},r.multiplyScalarAndAdd=function(t,e,i,n){return t[0]=e[0]+i[0]*n,t[1]=e[1]+i[1]*n,t[2]=e[2]+i[2]*n,t[3]=e[3]+i[3]*n,t[4]=e[4]+i[4]*n,t[5]=e[5]+i[5]*n,t},r.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]},r.equals=function(t,e){var i=t[0],r=t[1],o=t[2],s=t[3],a=t[4],l=t[5],h=e[0],u=e[1],c=e[2],p=e[3],d=e[4],f=e[5];return Math.abs(i-h)<=n.EPSILON*Math.max(1,Math.abs(i),Math.abs(h))&&Math.abs(r-u)<=n.EPSILON*Math.max(1,Math.abs(r),Math.abs(u))&&Math.abs(o-c)<=n.EPSILON*Math.max(1,Math.abs(o),Math.abs(c))&&Math.abs(s-p)<=n.EPSILON*Math.max(1,Math.abs(s),Math.abs(p))&&Math.abs(a-d)<=n.EPSILON*Math.max(1,Math.abs(a),Math.abs(d))&&Math.abs(l-f)<=n.EPSILON*Math.max(1,Math.abs(l),Math.abs(f))},e.exports=r},{"./common.js":3}],6:[function(t,e,i){var n=t("./common.js"),r={};r.create=function(){var t=new n.ARRAY_TYPE(9);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},r.fromMat4=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[4],t[4]=e[5],t[5]=e[6],t[6]=e[8],t[7]=e[9],t[8]=e[10],t},r.clone=function(t){var e=new n.ARRAY_TYPE(9);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e},r.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t},r.fromValues=function(t,e,i,r,o,s,a,l,h){var u=new n.ARRAY_TYPE(9);return u[0]=t,u[1]=e,u[2]=i,u[3]=r,u[4]=o,u[5]=s,u[6]=a,u[7]=l,u[8]=h,u},r.set=function(t,e,i,n,r,o,s,a,l,h){return t[0]=e,t[1]=i,t[2]=n,t[3]=r,t[4]=o,t[5]=s,t[6]=a,t[7]=l,t[8]=h,t},r.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},r.transpose=function(t,e){if(t===e){var i=e[1],n=e[2],r=e[5];t[1]=e[3],t[2]=e[6],t[3]=i,t[5]=e[7],t[6]=n,t[7]=r}else t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8];return t},r.invert=function(t,e){var i=e[0],n=e[1],r=e[2],o=e[3],s=e[4],a=e[5],l=e[6],h=e[7],u=e[8],c=u*s-a*h,p=-u*o+a*l,d=h*o-s*l,f=i*c+n*p+r*d;return f?(f=1/f,t[0]=c*f,t[1]=(-u*n+r*h)*f,t[2]=(a*n-r*s)*f,t[3]=p*f,t[4]=(u*i-r*l)*f,t[5]=(-a*i+r*o)*f,t[6]=d*f,t[7]=(-h*i+n*l)*f,t[8]=(s*i-n*o)*f,t):null},r.adjoint=function(t,e){var i=e[0],n=e[1],r=e[2],o=e[3],s=e[4],a=e[5],l=e[6],h=e[7],u=e[8];return t[0]=s*u-a*h,t[1]=r*h-n*u,t[2]=n*a-r*s,t[3]=a*l-o*u,t[4]=i*u-r*l,t[5]=r*o-i*a,t[6]=o*h-s*l,t[7]=n*l-i*h,t[8]=i*s-n*o,t},r.determinant=function(t){var e=t[0],i=t[1],n=t[2],r=t[3],o=t[4],s=t[5],a=t[6],l=t[7],h=t[8];return e*(h*o-s*l)+i*(-h*r+s*a)+n*(l*r-o*a)},r.multiply=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3],a=e[4],l=e[5],h=e[6],u=e[7],c=e[8],p=i[0],d=i[1],f=i[2],m=i[3],v=i[4],_=i[5],y=i[6],g=i[7],x=i[8];return t[0]=p*n+d*s+f*h,t[1]=p*r+d*a+f*u,t[2]=p*o+d*l+f*c,t[3]=m*n+v*s+_*h,t[4]=m*r+v*a+_*u,t[5]=m*o+v*l+_*c,t[6]=y*n+g*s+x*h,t[7]=y*r+g*a+x*u,t[8]=y*o+g*l+x*c,t},r.mul=r.multiply,r.translate=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3],a=e[4],l=e[5],h=e[6],u=e[7],c=e[8],p=i[0],d=i[1];return t[0]=n,t[1]=r,t[2]=o,t[3]=s,t[4]=a,t[5]=l,t[6]=p*n+d*s+h,t[7]=p*r+d*a+u,t[8]=p*o+d*l+c,t},r.rotate=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3],a=e[4],l=e[5],h=e[6],u=e[7],c=e[8],p=Math.sin(i),d=Math.cos(i);return t[0]=d*n+p*s,t[1]=d*r+p*a,t[2]=d*o+p*l,t[3]=d*s-p*n,t[4]=d*a-p*r,t[5]=d*l-p*o,t[6]=h,t[7]=u,t[8]=c,t},r.scale=function(t,e,i){var n=i[0],r=i[1];return t[0]=n*e[0],t[1]=n*e[1],t[2]=n*e[2],t[3]=r*e[3],t[4]=r*e[4],t[5]=r*e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t},r.fromTranslation=function(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=e[0],t[7]=e[1],t[8]=1,t},r.fromRotation=function(t,e){var i=Math.sin(e),n=Math.cos(e);return t[0]=n,t[1]=i,t[2]=0,t[3]=-i,t[4]=n,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},r.fromScaling=function(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=0,t[4]=e[1],t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},r.fromMat2d=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=0,t[3]=e[2],t[4]=e[3],t[5]=0,t[6]=e[4],t[7]=e[5],t[8]=1,t},r.fromQuat=function(t,e){var i=e[0],n=e[1],r=e[2],o=e[3],s=i+i,a=n+n,l=r+r,h=i*s,u=n*s,c=n*a,p=r*s,d=r*a,f=r*l,m=o*s,v=o*a,_=o*l;return t[0]=1-c-f,t[3]=u-_,t[6]=p+v,t[1]=u+_,t[4]=1-h-f,t[7]=d-m,t[2]=p-v,t[5]=d+m,t[8]=1-h-c,t},r.normalFromMat4=function(t,e){var i=e[0],n=e[1],r=e[2],o=e[3],s=e[4],a=e[5],l=e[6],h=e[7],u=e[8],c=e[9],p=e[10],d=e[11],f=e[12],m=e[13],v=e[14],_=e[15],y=i*a-n*s,g=i*l-r*s,x=i*h-o*s,M=n*l-r*a,w=n*h-o*a,b=r*h-o*l,S=u*m-c*f,I=u*v-p*f,E=u*_-d*f,D=c*v-p*m,T=c*_-d*m,F=p*_-d*v,L=y*F-g*T+x*D+M*E-w*I+b*S;return L?(L=1/L,t[0]=(a*F-l*T+h*D)*L,t[1]=(l*E-s*F-h*I)*L,t[2]=(s*T-a*E+h*S)*L,t[3]=(r*T-n*F-o*D)*L,t[4]=(i*F-r*E+o*I)*L,t[5]=(n*E-i*T-o*S)*L,t[6]=(m*b-v*w+_*M)*L,t[7]=(v*x-f*b-_*g)*L,t[8]=(f*w-m*x+_*y)*L,t):null},r.str=function(t){return"mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"},r.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2))},r.add=function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t[2]=e[2]+i[2],t[3]=e[3]+i[3],t[4]=e[4]+i[4],t[5]=e[5]+i[5],t[6]=e[6]+i[6],t[7]=e[7]+i[7],t[8]=e[8]+i[8],t},r.subtract=function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t[2]=e[2]-i[2],t[3]=e[3]-i[3],t[4]=e[4]-i[4],t[5]=e[5]-i[5],t[6]=e[6]-i[6],t[7]=e[7]-i[7],t[8]=e[8]-i[8],t},r.sub=r.subtract,r.multiplyScalar=function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t[3]=e[3]*i,t[4]=e[4]*i,t[5]=e[5]*i,t[6]=e[6]*i,t[7]=e[7]*i,t[8]=e[8]*i,t},r.multiplyScalarAndAdd=function(t,e,i,n){return t[0]=e[0]+i[0]*n,t[1]=e[1]+i[1]*n,t[2]=e[2]+i[2]*n,t[3]=e[3]+i[3]*n,t[4]=e[4]+i[4]*n,t[5]=e[5]+i[5]*n,t[6]=e[6]+i[6]*n,t[7]=e[7]+i[7]*n,t[8]=e[8]+i[8]*n,t},r.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]&&t[8]===e[8]},r.equals=function(t,e){var i=t[0],r=t[1],o=t[2],s=t[3],a=t[4],l=t[5],h=t[6],u=t[7],c=t[8],p=e[0],d=e[1],f=e[2],m=e[3],v=e[4],_=e[5],y=t[6],g=e[7],x=e[8];return Math.abs(i-p)<=n.EPSILON*Math.max(1,Math.abs(i),Math.abs(p))&&Math.abs(r-d)<=n.EPSILON*Math.max(1,Math.abs(r),Math.abs(d))&&Math.abs(o-f)<=n.EPSILON*Math.max(1,Math.abs(o),Math.abs(f))&&Math.abs(s-m)<=n.EPSILON*Math.max(1,Math.abs(s),Math.abs(m))&&Math.abs(a-v)<=n.EPSILON*Math.max(1,Math.abs(a),Math.abs(v))&&Math.abs(l-_)<=n.EPSILON*Math.max(1,Math.abs(l),Math.abs(_))&&Math.abs(h-y)<=n.EPSILON*Math.max(1,Math.abs(h),Math.abs(y))&&Math.abs(u-g)<=n.EPSILON*Math.max(1,Math.abs(u),Math.abs(g))&&Math.abs(c-x)<=n.EPSILON*Math.max(1,Math.abs(c),Math.abs(x))},e.exports=r},{"./common.js":3}],7:[function(t,e,i){var n=t("./common.js"),r={scalar:{},SIMD:{}};r.create=function(){var t=new n.ARRAY_TYPE(16);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},r.clone=function(t){var e=new n.ARRAY_TYPE(16);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e},r.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},r.fromValues=function(t,e,i,r,o,s,a,l,h,u,c,p,d,f,m,v){var _=new n.ARRAY_TYPE(16);return _[0]=t,_[1]=e,_[2]=i,_[3]=r,_[4]=o,_[5]=s,_[6]=a,_[7]=l,_[8]=h,_[9]=u,_[10]=c,_[11]=p,_[12]=d,_[13]=f,_[14]=m,_[15]=v,_},r.set=function(t,e,i,n,r,o,s,a,l,h,u,c,p,d,f,m,v){return t[0]=e,t[1]=i,t[2]=n,t[3]=r,t[4]=o,t[5]=s,t[6]=a,t[7]=l,t[8]=h,t[9]=u,t[10]=c,t[11]=p,t[12]=d,t[13]=f,t[14]=m,t[15]=v,t},r.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},r.scalar.transpose=function(t,e){if(t===e){var i=e[1],n=e[2],r=e[3],o=e[6],s=e[7],a=e[11];t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=i,t[6]=e[9],t[7]=e[13],t[8]=n,t[9]=o,t[11]=e[14],t[12]=r,t[13]=s,t[14]=a}else t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15];return t},r.SIMD.transpose=function(t,e){var i,n,r,o,s,a,l,h,u,c;return i=SIMD.Float32x4.load(e,0),n=SIMD.Float32x4.load(e,4),r=SIMD.Float32x4.load(e,8),o=SIMD.Float32x4.load(e,12),s=SIMD.Float32x4.shuffle(i,n,0,1,4,5),a=SIMD.Float32x4.shuffle(r,o,0,1,4,5),l=SIMD.Float32x4.shuffle(s,a,0,2,4,6),h=SIMD.Float32x4.shuffle(s,a,1,3,5,7),SIMD.Float32x4.store(t,0,l),SIMD.Float32x4.store(t,4,h),s=SIMD.Float32x4.shuffle(i,n,2,3,6,7),a=SIMD.Float32x4.shuffle(r,o,2,3,6,7),u=SIMD.Float32x4.shuffle(s,a,0,2,4,6),c=SIMD.Float32x4.shuffle(s,a,1,3,5,7),SIMD.Float32x4.store(t,8,u),SIMD.Float32x4.store(t,12,c),t},r.transpose=n.USE_SIMD?r.SIMD.transpose:r.scalar.transpose,r.scalar.invert=function(t,e){var i=e[0],n=e[1],r=e[2],o=e[3],s=e[4],a=e[5],l=e[6],h=e[7],u=e[8],c=e[9],p=e[10],d=e[11],f=e[12],m=e[13],v=e[14],_=e[15],y=i*a-n*s,g=i*l-r*s,x=i*h-o*s,M=n*l-r*a,w=n*h-o*a,b=r*h-o*l,S=u*m-c*f,I=u*v-p*f,E=u*_-d*f,D=c*v-p*m,T=c*_-d*m,F=p*_-d*v,L=y*F-g*T+x*D+M*E-w*I+b*S;return L?(L=1/L,t[0]=(a*F-l*T+h*D)*L,t[1]=(r*T-n*F-o*D)*L,t[2]=(m*b-v*w+_*M)*L,t[3]=(p*w-c*b-d*M)*L,t[4]=(l*E-s*F-h*I)*L,t[5]=(i*F-r*E+o*I)*L,t[6]=(v*x-f*b-_*g)*L,t[7]=(u*b-p*x+d*g)*L,t[8]=(s*T-a*E+h*S)*L,t[9]=(n*E-i*T-o*S)*L,t[10]=(f*w-m*x+_*y)*L,t[11]=(c*x-u*w-d*y)*L,t[12]=(a*I-s*D-l*S)*L,t[13]=(i*D-n*I+r*S)*L,t[14]=(m*g-f*M-v*y)*L,t[15]=(u*M-c*g+p*y)*L,t):null},r.SIMD.invert=function(t,e){var i,n,r,o,s,a,l,h,u,c,p=SIMD.Float32x4.load(e,0),d=SIMD.Float32x4.load(e,4),f=SIMD.Float32x4.load(e,8),m=SIMD.Float32x4.load(e,12);return s=SIMD.Float32x4.shuffle(p,d,0,1,4,5),n=SIMD.Float32x4.shuffle(f,m,0,1,4,5),i=SIMD.Float32x4.shuffle(s,n,0,2,4,6),n=SIMD.Float32x4.shuffle(n,s,1,3,5,7),s=SIMD.Float32x4.shuffle(p,d,2,3,6,7),o=SIMD.Float32x4.shuffle(f,m,2,3,6,7),r=SIMD.Float32x4.shuffle(s,o,0,2,4,6),o=SIMD.Float32x4.shuffle(o,s,1,3,5,7),s=SIMD.Float32x4.mul(r,o),s=SIMD.Float32x4.swizzle(s,1,0,3,2),a=SIMD.Float32x4.mul(n,s),l=SIMD.Float32x4.mul(i,s),s=SIMD.Float32x4.swizzle(s,2,3,0,1),a=SIMD.Float32x4.sub(SIMD.Float32x4.mul(n,s),a),l=SIMD.Float32x4.sub(SIMD.Float32x4.mul(i,s),l),l=SIMD.Float32x4.swizzle(l,2,3,0,1),s=SIMD.Float32x4.mul(n,r),s=SIMD.Float32x4.swizzle(s,1,0,3,2),a=SIMD.Float32x4.add(SIMD.Float32x4.mul(o,s),a),u=SIMD.Float32x4.mul(i,s),s=SIMD.Float32x4.swizzle(s,2,3,0,1),a=SIMD.Float32x4.sub(a,SIMD.Float32x4.mul(o,s)),u=SIMD.Float32x4.sub(SIMD.Float32x4.mul(i,s),u),u=SIMD.Float32x4.swizzle(u,2,3,0,1),s=SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(n,2,3,0,1),o),s=SIMD.Float32x4.swizzle(s,1,0,3,2),r=SIMD.Float32x4.swizzle(r,2,3,0,1),a=SIMD.Float32x4.add(SIMD.Float32x4.mul(r,s),a),h=SIMD.Float32x4.mul(i,s),s=SIMD.Float32x4.swizzle(s,2,3,0,1),a=SIMD.Float32x4.sub(a,SIMD.Float32x4.mul(r,s)),h=SIMD.Float32x4.sub(SIMD.Float32x4.mul(i,s),h),h=SIMD.Float32x4.swizzle(h,2,3,0,1),s=SIMD.Float32x4.mul(i,n),s=SIMD.Float32x4.swizzle(s,1,0,3,2),h=SIMD.Float32x4.add(SIMD.Float32x4.mul(o,s),h),u=SIMD.Float32x4.sub(SIMD.Float32x4.mul(r,s),u),s=SIMD.Float32x4.swizzle(s,2,3,0,1),h=SIMD.Float32x4.sub(SIMD.Float32x4.mul(o,s),h),u=SIMD.Float32x4.sub(u,SIMD.Float32x4.mul(r,s)),s=SIMD.Float32x4.mul(i,o),s=SIMD.Float32x4.swizzle(s,1,0,3,2),l=SIMD.Float32x4.sub(l,SIMD.Float32x4.mul(r,s)),h=SIMD.Float32x4.add(SIMD.Float32x4.mul(n,s),h),s=SIMD.Float32x4.swizzle(s,2,3,0,1),l=SIMD.Float32x4.add(SIMD.Float32x4.mul(r,s),l),h=SIMD.Float32x4.sub(h,SIMD.Float32x4.mul(n,s)),s=SIMD.Float32x4.mul(i,r),s=SIMD.Float32x4.swizzle(s,1,0,3,2),l=SIMD.Float32x4.add(SIMD.Float32x4.mul(o,s),l),u=SIMD.Float32x4.sub(u,SIMD.Float32x4.mul(n,s)),s=SIMD.Float32x4.swizzle(s,2,3,0,1),l=SIMD.Float32x4.sub(l,SIMD.Float32x4.mul(o,s)),u=SIMD.Float32x4.add(SIMD.Float32x4.mul(n,s),u),c=SIMD.Float32x4.mul(i,a),c=SIMD.Float32x4.add(SIMD.Float32x4.swizzle(c,2,3,0,1),c),c=SIMD.Float32x4.add(SIMD.Float32x4.swizzle(c,1,0,3,2),c),s=SIMD.Float32x4.reciprocalApproximation(c),c=SIMD.Float32x4.sub(SIMD.Float32x4.add(s,s),SIMD.Float32x4.mul(c,SIMD.Float32x4.mul(s,s))),(c=SIMD.Float32x4.swizzle(c,0,0,0,0))?(SIMD.Float32x4.store(t,0,SIMD.Float32x4.mul(c,a)),SIMD.Float32x4.store(t,4,SIMD.Float32x4.mul(c,l)),SIMD.Float32x4.store(t,8,SIMD.Float32x4.mul(c,h)),SIMD.Float32x4.store(t,12,SIMD.Float32x4.mul(c,u)),t):null},r.invert=n.USE_SIMD?r.SIMD.invert:r.scalar.invert,r.scalar.adjoint=function(t,e){var i=e[0],n=e[1],r=e[2],o=e[3],s=e[4],a=e[5],l=e[6],h=e[7],u=e[8],c=e[9],p=e[10],d=e[11],f=e[12],m=e[13],v=e[14],_=e[15];return t[0]=a*(p*_-d*v)-c*(l*_-h*v)+m*(l*d-h*p),t[1]=-(n*(p*_-d*v)-c*(r*_-o*v)+m*(r*d-o*p)),t[2]=n*(l*_-h*v)-a*(r*_-o*v)+m*(r*h-o*l),t[3]=-(n*(l*d-h*p)-a*(r*d-o*p)+c*(r*h-o*l)),t[4]=-(s*(p*_-d*v)-u*(l*_-h*v)+f*(l*d-h*p)),t[5]=i*(p*_-d*v)-u*(r*_-o*v)+f*(r*d-o*p),t[6]=-(i*(l*_-h*v)-s*(r*_-o*v)+f*(r*h-o*l)),t[7]=i*(l*d-h*p)-s*(r*d-o*p)+u*(r*h-o*l),t[8]=s*(c*_-d*m)-u*(a*_-h*m)+f*(a*d-h*c),t[9]=-(i*(c*_-d*m)-u*(n*_-o*m)+f*(n*d-o*c)),t[10]=i*(a*_-h*m)-s*(n*_-o*m)+f*(n*h-o*a),t[11]=-(i*(a*d-h*c)-s*(n*d-o*c)+u*(n*h-o*a)),t[12]=-(s*(c*v-p*m)-u*(a*v-l*m)+f*(a*p-l*c)),t[13]=i*(c*v-p*m)-u*(n*v-r*m)+f*(n*p-r*c),t[14]=-(i*(a*v-l*m)-s*(n*v-r*m)+f*(n*l-r*a)),t[15]=i*(a*p-l*c)-s*(n*p-r*c)+u*(n*l-r*a),t},r.SIMD.adjoint=function(t,e){var i,n,r,o,s,a,l,h,u,c,p,d,f,i=SIMD.Float32x4.load(e,0),n=SIMD.Float32x4.load(e,4),r=SIMD.Float32x4.load(e,8),o=SIMD.Float32x4.load(e,12);return u=SIMD.Float32x4.shuffle(i,n,0,1,4,5),a=SIMD.Float32x4.shuffle(r,o,0,1,4,5),s=SIMD.Float32x4.shuffle(u,a,0,2,4,6),a=SIMD.Float32x4.shuffle(a,u,1,3,5,7),u=SIMD.Float32x4.shuffle(i,n,2,3,6,7),h=SIMD.Float32x4.shuffle(r,o,2,3,6,7),l=SIMD.Float32x4.shuffle(u,h,0,2,4,6),h=SIMD.Float32x4.shuffle(h,u,1,3,5,7),u=SIMD.Float32x4.mul(l,h),u=SIMD.Float32x4.swizzle(u,1,0,3,2),c=SIMD.Float32x4.mul(a,u),p=SIMD.Float32x4.mul(s,u),u=SIMD.Float32x4.swizzle(u,2,3,0,1),c=SIMD.Float32x4.sub(SIMD.Float32x4.mul(a,u),c),p=SIMD.Float32x4.sub(SIMD.Float32x4.mul(s,u),p),p=SIMD.Float32x4.swizzle(p,2,3,0,1),u=SIMD.Float32x4.mul(a,l),u=SIMD.Float32x4.swizzle(u,1,0,3,2),c=SIMD.Float32x4.add(SIMD.Float32x4.mul(h,u),c),f=SIMD.Float32x4.mul(s,u),u=SIMD.Float32x4.swizzle(u,2,3,0,1),c=SIMD.Float32x4.sub(c,SIMD.Float32x4.mul(h,u)),f=SIMD.Float32x4.sub(SIMD.Float32x4.mul(s,u),f),f=SIMD.Float32x4.swizzle(f,2,3,0,1),u=SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(a,2,3,0,1),h),u=SIMD.Float32x4.swizzle(u,1,0,3,2),l=SIMD.Float32x4.swizzle(l,2,3,0,1),c=SIMD.Float32x4.add(SIMD.Float32x4.mul(l,u),c),d=SIMD.Float32x4.mul(s,u),u=SIMD.Float32x4.swizzle(u,2,3,0,1),c=SIMD.Float32x4.sub(c,SIMD.Float32x4.mul(l,u)),d=SIMD.Float32x4.sub(SIMD.Float32x4.mul(s,u),d),d=SIMD.Float32x4.swizzle(d,2,3,0,1),u=SIMD.Float32x4.mul(s,a),u=SIMD.Float32x4.swizzle(u,1,0,3,2),d=SIMD.Float32x4.add(SIMD.Float32x4.mul(h,u),d),f=SIMD.Float32x4.sub(SIMD.Float32x4.mul(l,u),f),u=SIMD.Float32x4.swizzle(u,2,3,0,1),d=SIMD.Float32x4.sub(SIMD.Float32x4.mul(h,u),d),f=SIMD.Float32x4.sub(f,SIMD.Float32x4.mul(l,u)),u=SIMD.Float32x4.mul(s,h),u=SIMD.Float32x4.swizzle(u,1,0,3,2),p=SIMD.Float32x4.sub(p,SIMD.Float32x4.mul(l,u)),d=SIMD.Float32x4.add(SIMD.Float32x4.mul(a,u),d),u=SIMD.Float32x4.swizzle(u,2,3,0,1),p=SIMD.Float32x4.add(SIMD.Float32x4.mul(l,u),p),d=SIMD.Float32x4.sub(d,SIMD.Float32x4.mul(a,u)),u=SIMD.Float32x4.mul(s,l),u=SIMD.Float32x4.swizzle(u,1,0,3,2),p=SIMD.Float32x4.add(SIMD.Float32x4.mul(h,u),p),f=SIMD.Float32x4.sub(f,SIMD.Float32x4.mul(a,u)),u=SIMD.Float32x4.swizzle(u,2,3,0,1),p=SIMD.Float32x4.sub(p,SIMD.Float32x4.mul(h,u)),f=SIMD.Float32x4.add(SIMD.Float32x4.mul(a,u),f),SIMD.Float32x4.store(t,0,c),SIMD.Float32x4.store(t,4,p),SIMD.Float32x4.store(t,8,d),SIMD.Float32x4.store(t,12,f),t},r.adjoint=n.USE_SIMD?r.SIMD.adjoint:r.scalar.adjoint,r.determinant=function(t){var e=t[0],i=t[1],n=t[2],r=t[3],o=t[4],s=t[5],a=t[6],l=t[7],h=t[8],u=t[9],c=t[10],p=t[11],d=t[12],f=t[13],m=t[14],v=t[15],_=e*s-i*o,y=e*a-n*o,g=e*l-r*o,x=i*a-n*s,M=i*l-r*s,w=n*l-r*a,b=h*f-u*d,S=h*m-c*d,I=h*v-p*d,E=u*m-c*f,D=u*v-p*f,T=c*v-p*m;return _*T-y*D+g*E+x*I-M*S+w*b},r.SIMD.multiply=function(t,e,i){var n=SIMD.Float32x4.load(e,0),r=SIMD.Float32x4.load(e,4),o=SIMD.Float32x4.load(e,8),s=SIMD.Float32x4.load(e,12),a=SIMD.Float32x4.load(i,0),l=SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(a,0,0,0,0),n),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(a,1,1,1,1),r),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(a,2,2,2,2),o),SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(a,3,3,3,3),s))));SIMD.Float32x4.store(t,0,l);var h=SIMD.Float32x4.load(i,4),u=SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h,0,0,0,0),n),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h,1,1,1,1),r),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h,2,2,2,2),o),SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h,3,3,3,3),s))));SIMD.Float32x4.store(t,4,u);var c=SIMD.Float32x4.load(i,8),p=SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c,0,0,0,0),n),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c,1,1,1,1),r),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c,2,2,2,2),o),SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c,3,3,3,3),s))));SIMD.Float32x4.store(t,8,p);var d=SIMD.Float32x4.load(i,12),f=SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d,0,0,0,0),n),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d,1,1,1,1),r),SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d,2,2,2,2),o),SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d,3,3,3,3),s))));return SIMD.Float32x4.store(t,12,f),t},r.scalar.multiply=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3],a=e[4],l=e[5],h=e[6],u=e[7],c=e[8],p=e[9],d=e[10],f=e[11],m=e[12],v=e[13],_=e[14],y=e[15],g=i[0],x=i[1],M=i[2],w=i[3];return t[0]=g*n+x*a+M*c+w*m,t[1]=g*r+x*l+M*p+w*v,t[2]=g*o+x*h+M*d+w*_,t[3]=g*s+x*u+M*f+w*y,g=i[4],x=i[5],M=i[6],w=i[7],t[4]=g*n+x*a+M*c+w*m,t[5]=g*r+x*l+M*p+w*v,t[6]=g*o+x*h+M*d+w*_,t[7]=g*s+x*u+M*f+w*y,g=i[8],x=i[9],M=i[10],w=i[11],t[8]=g*n+x*a+M*c+w*m,t[9]=g*r+x*l+M*p+w*v,t[10]=g*o+x*h+M*d+w*_,t[11]=g*s+x*u+M*f+w*y,g=i[12],x=i[13],M=i[14],w=i[15],t[12]=g*n+x*a+M*c+w*m,t[13]=g*r+x*l+M*p+w*v,t[14]=g*o+x*h+M*d+w*_,t[15]=g*s+x*u+M*f+w*y,t},r.multiply=n.USE_SIMD?r.SIMD.multiply:r.scalar.multiply,r.mul=r.multiply,r.scalar.translate=function(t,e,i){var n,r,o,s,a,l,h,u,c,p,d,f,m=i[0],v=i[1],_=i[2];return e===t?(t[12]=e[0]*m+e[4]*v+e[8]*_+e[12],t[13]=e[1]*m+e[5]*v+e[9]*_+e[13],t[14]=e[2]*m+e[6]*v+e[10]*_+e[14],t[15]=e[3]*m+e[7]*v+e[11]*_+e[15]):(n=e[0],r=e[1],o=e[2],s=e[3],a=e[4],l=e[5],h=e[6],u=e[7],c=e[8],p=e[9],d=e[10],f=e[11],t[0]=n,t[1]=r,t[2]=o,t[3]=s,t[4]=a,t[5]=l,t[6]=h,t[7]=u,t[8]=c,t[9]=p,t[10]=d,t[11]=f,t[12]=n*m+a*v+c*_+e[12],t[13]=r*m+l*v+p*_+e[13],t[14]=o*m+h*v+d*_+e[14],t[15]=s*m+u*v+f*_+e[15]),t},r.SIMD.translate=function(t,e,i){var n=SIMD.Float32x4.load(e,0),r=SIMD.Float32x4.load(e,4),o=SIMD.Float32x4.load(e,8),s=SIMD.Float32x4.load(e,12),a=SIMD.Float32x4(i[0],i[1],i[2],0);e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11]),n=SIMD.Float32x4.mul(n,SIMD.Float32x4.swizzle(a,0,0,0,0)),r=SIMD.Float32x4.mul(r,SIMD.Float32x4.swizzle(a,1,1,1,1)),o=SIMD.Float32x4.mul(o,SIMD.Float32x4.swizzle(a,2,2,2,2));var l=SIMD.Float32x4.add(n,SIMD.Float32x4.add(r,SIMD.Float32x4.add(o,s)));return SIMD.Float32x4.store(t,12,l),t},r.translate=n.USE_SIMD?r.SIMD.translate:r.scalar.translate,r.scalar.scale=function(t,e,i){var n=i[0],r=i[1],o=i[2];return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*r,t[5]=e[5]*r,t[6]=e[6]*r,t[7]=e[7]*r,t[8]=e[8]*o,t[9]=e[9]*o,t[10]=e[10]*o,t[11]=e[11]*o,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},r.SIMD.scale=function(t,e,i){var n,r,o,s=SIMD.Float32x4(i[0],i[1],i[2],0);return n=SIMD.Float32x4.load(e,0),SIMD.Float32x4.store(t,0,SIMD.Float32x4.mul(n,SIMD.Float32x4.swizzle(s,0,0,0,0))),r=SIMD.Float32x4.load(e,4),SIMD.Float32x4.store(t,4,SIMD.Float32x4.mul(r,SIMD.Float32x4.swizzle(s,1,1,1,1))),o=SIMD.Float32x4.load(e,8),SIMD.Float32x4.store(t,8,SIMD.Float32x4.mul(o,SIMD.Float32x4.swizzle(s,2,2,2,2))),t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},r.scale=n.USE_SIMD?r.SIMD.scale:r.scalar.scale,r.rotate=function(t,e,i,r){var o,s,a,l,h,u,c,p,d,f,m,v,_,y,g,x,M,w,b,S,I,E,D,T,F=r[0],L=r[1],C=r[2],z=Math.sqrt(F*F+L*L+C*C);return Math.abs(z)<n.EPSILON?null:(z=1/z,F*=z,L*=z,C*=z,o=Math.sin(i),s=Math.cos(i),a=1-s,l=e[0],h=e[1],u=e[2],c=e[3],p=e[4],d=e[5],f=e[6],m=e[7],v=e[8],_=e[9],y=e[10],g=e[11],x=F*F*a+s,M=L*F*a+C*o,w=C*F*a-L*o,b=F*L*a-C*o,S=L*L*a+s,I=C*L*a+F*o,E=F*C*a+L*o,D=L*C*a-F*o,T=C*C*a+s,t[0]=l*x+p*M+v*w,t[1]=h*x+d*M+_*w,t[2]=u*x+f*M+y*w,t[3]=c*x+m*M+g*w,t[4]=l*b+p*S+v*I,t[5]=h*b+d*S+_*I,t[6]=u*b+f*S+y*I,t[7]=c*b+m*S+g*I,t[8]=l*E+p*D+v*T,t[9]=h*E+d*D+_*T,t[10]=u*E+f*D+y*T,t[11]=c*E+m*D+g*T,e!==t&&(t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t)},r.scalar.rotateX=function(t,e,i){var n=Math.sin(i),r=Math.cos(i),o=e[4],s=e[5],a=e[6],l=e[7],h=e[8],u=e[9],c=e[10],p=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=o*r+h*n,t[5]=s*r+u*n,t[6]=a*r+c*n,t[7]=l*r+p*n,t[8]=h*r-o*n,t[9]=u*r-s*n,t[10]=c*r-a*n,t[11]=p*r-l*n,t},r.SIMD.rotateX=function(t,e,i){var n=SIMD.Float32x4.splat(Math.sin(i)),r=SIMD.Float32x4.splat(Math.cos(i));
e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]);var o=SIMD.Float32x4.load(e,4),s=SIMD.Float32x4.load(e,8);return SIMD.Float32x4.store(t,4,SIMD.Float32x4.add(SIMD.Float32x4.mul(o,r),SIMD.Float32x4.mul(s,n))),SIMD.Float32x4.store(t,8,SIMD.Float32x4.sub(SIMD.Float32x4.mul(s,r),SIMD.Float32x4.mul(o,n))),t},r.rotateX=n.USE_SIMD?r.SIMD.rotateX:r.scalar.rotateX,r.scalar.rotateY=function(t,e,i){var n=Math.sin(i),r=Math.cos(i),o=e[0],s=e[1],a=e[2],l=e[3],h=e[8],u=e[9],c=e[10],p=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=o*r-h*n,t[1]=s*r-u*n,t[2]=a*r-c*n,t[3]=l*r-p*n,t[8]=o*n+h*r,t[9]=s*n+u*r,t[10]=a*n+c*r,t[11]=l*n+p*r,t},r.SIMD.rotateY=function(t,e,i){var n=SIMD.Float32x4.splat(Math.sin(i)),r=SIMD.Float32x4.splat(Math.cos(i));e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]);var o=SIMD.Float32x4.load(e,0),s=SIMD.Float32x4.load(e,8);return SIMD.Float32x4.store(t,0,SIMD.Float32x4.sub(SIMD.Float32x4.mul(o,r),SIMD.Float32x4.mul(s,n))),SIMD.Float32x4.store(t,8,SIMD.Float32x4.add(SIMD.Float32x4.mul(o,n),SIMD.Float32x4.mul(s,r))),t},r.rotateY=n.USE_SIMD?r.SIMD.rotateY:r.scalar.rotateY,r.scalar.rotateZ=function(t,e,i){var n=Math.sin(i),r=Math.cos(i),o=e[0],s=e[1],a=e[2],l=e[3],h=e[4],u=e[5],c=e[6],p=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=o*r+h*n,t[1]=s*r+u*n,t[2]=a*r+c*n,t[3]=l*r+p*n,t[4]=h*r-o*n,t[5]=u*r-s*n,t[6]=c*r-a*n,t[7]=p*r-l*n,t},r.SIMD.rotateZ=function(t,e,i){var n=SIMD.Float32x4.splat(Math.sin(i)),r=SIMD.Float32x4.splat(Math.cos(i));e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]);var o=SIMD.Float32x4.load(e,0),s=SIMD.Float32x4.load(e,4);return SIMD.Float32x4.store(t,0,SIMD.Float32x4.add(SIMD.Float32x4.mul(o,r),SIMD.Float32x4.mul(s,n))),SIMD.Float32x4.store(t,4,SIMD.Float32x4.sub(SIMD.Float32x4.mul(s,r),SIMD.Float32x4.mul(o,n))),t},r.rotateZ=n.USE_SIMD?r.SIMD.rotateZ:r.scalar.rotateZ,r.fromTranslation=function(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=e[0],t[13]=e[1],t[14]=e[2],t[15]=1,t},r.fromScaling=function(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=e[1],t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=e[2],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},r.fromRotation=function(t,e,i){var r,o,s,a=i[0],l=i[1],h=i[2],u=Math.sqrt(a*a+l*l+h*h);return Math.abs(u)<n.EPSILON?null:(u=1/u,a*=u,l*=u,h*=u,r=Math.sin(e),o=Math.cos(e),s=1-o,t[0]=a*a*s+o,t[1]=l*a*s+h*r,t[2]=h*a*s-l*r,t[3]=0,t[4]=a*l*s-h*r,t[5]=l*l*s+o,t[6]=h*l*s+a*r,t[7]=0,t[8]=a*h*s+l*r,t[9]=l*h*s-a*r,t[10]=h*h*s+o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t)},r.fromXRotation=function(t,e){var i=Math.sin(e),n=Math.cos(e);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=n,t[6]=i,t[7]=0,t[8]=0,t[9]=-i,t[10]=n,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},r.fromYRotation=function(t,e){var i=Math.sin(e),n=Math.cos(e);return t[0]=n,t[1]=0,t[2]=-i,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=i,t[9]=0,t[10]=n,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},r.fromZRotation=function(t,e){var i=Math.sin(e),n=Math.cos(e);return t[0]=n,t[1]=i,t[2]=0,t[3]=0,t[4]=-i,t[5]=n,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},r.fromRotationTranslation=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3],a=n+n,l=r+r,h=o+o,u=n*a,c=n*l,p=n*h,d=r*l,f=r*h,m=o*h,v=s*a,_=s*l,y=s*h;return t[0]=1-(d+m),t[1]=c+y,t[2]=p-_,t[3]=0,t[4]=c-y,t[5]=1-(u+m),t[6]=f+v,t[7]=0,t[8]=p+_,t[9]=f-v,t[10]=1-(u+d),t[11]=0,t[12]=i[0],t[13]=i[1],t[14]=i[2],t[15]=1,t},r.getTranslation=function(t,e){return t[0]=e[12],t[1]=e[13],t[2]=e[14],t},r.getRotation=function(t,e){var i=e[0]+e[5]+e[10],n=0;return i>0?(n=2*Math.sqrt(i+1),t[3]=.25*n,t[0]=(e[6]-e[9])/n,t[1]=(e[8]-e[2])/n,t[2]=(e[1]-e[4])/n):e[0]>e[5]&e[0]>e[10]?(n=2*Math.sqrt(1+e[0]-e[5]-e[10]),t[3]=(e[6]-e[9])/n,t[0]=.25*n,t[1]=(e[1]+e[4])/n,t[2]=(e[8]+e[2])/n):e[5]>e[10]?(n=2*Math.sqrt(1+e[5]-e[0]-e[10]),t[3]=(e[8]-e[2])/n,t[0]=(e[1]+e[4])/n,t[1]=.25*n,t[2]=(e[6]+e[9])/n):(n=2*Math.sqrt(1+e[10]-e[0]-e[5]),t[3]=(e[1]-e[4])/n,t[0]=(e[8]+e[2])/n,t[1]=(e[6]+e[9])/n,t[2]=.25*n),t},r.fromRotationTranslationScale=function(t,e,i,n){var r=e[0],o=e[1],s=e[2],a=e[3],l=r+r,h=o+o,u=s+s,c=r*l,p=r*h,d=r*u,f=o*h,m=o*u,v=s*u,_=a*l,y=a*h,g=a*u,x=n[0],M=n[1],w=n[2];return t[0]=(1-(f+v))*x,t[1]=(p+g)*x,t[2]=(d-y)*x,t[3]=0,t[4]=(p-g)*M,t[5]=(1-(c+v))*M,t[6]=(m+_)*M,t[7]=0,t[8]=(d+y)*w,t[9]=(m-_)*w,t[10]=(1-(c+f))*w,t[11]=0,t[12]=i[0],t[13]=i[1],t[14]=i[2],t[15]=1,t},r.fromRotationTranslationScaleOrigin=function(t,e,i,n,r){var o=e[0],s=e[1],a=e[2],l=e[3],h=o+o,u=s+s,c=a+a,p=o*h,d=o*u,f=o*c,m=s*u,v=s*c,_=a*c,y=l*h,g=l*u,x=l*c,M=n[0],w=n[1],b=n[2],S=r[0],I=r[1],E=r[2];return t[0]=(1-(m+_))*M,t[1]=(d+x)*M,t[2]=(f-g)*M,t[3]=0,t[4]=(d-x)*w,t[5]=(1-(p+_))*w,t[6]=(v+y)*w,t[7]=0,t[8]=(f+g)*b,t[9]=(v-y)*b,t[10]=(1-(p+m))*b,t[11]=0,t[12]=i[0]+S-(t[0]*S+t[4]*I+t[8]*E),t[13]=i[1]+I-(t[1]*S+t[5]*I+t[9]*E),t[14]=i[2]+E-(t[2]*S+t[6]*I+t[10]*E),t[15]=1,t},r.fromQuat=function(t,e){var i=e[0],n=e[1],r=e[2],o=e[3],s=i+i,a=n+n,l=r+r,h=i*s,u=n*s,c=n*a,p=r*s,d=r*a,f=r*l,m=o*s,v=o*a,_=o*l;return t[0]=1-c-f,t[1]=u+_,t[2]=p-v,t[3]=0,t[4]=u-_,t[5]=1-h-f,t[6]=d+m,t[7]=0,t[8]=p+v,t[9]=d-m,t[10]=1-h-c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},r.frustum=function(t,e,i,n,r,o,s){var a=1/(i-e),l=1/(r-n),h=1/(o-s);return t[0]=2*o*a,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=2*o*l,t[6]=0,t[7]=0,t[8]=(i+e)*a,t[9]=(r+n)*l,t[10]=(s+o)*h,t[11]=-1,t[12]=0,t[13]=0,t[14]=s*o*2*h,t[15]=0,t},r.perspective=function(t,e,i,n,r){var o=1/Math.tan(e/2),s=1/(n-r);return t[0]=o/i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=o,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=(r+n)*s,t[11]=-1,t[12]=0,t[13]=0,t[14]=2*r*n*s,t[15]=0,t},r.perspectiveFromFieldOfView=function(t,e,i,n){var r=Math.tan(e.upDegrees*Math.PI/180),o=Math.tan(e.downDegrees*Math.PI/180),s=Math.tan(e.leftDegrees*Math.PI/180),a=Math.tan(e.rightDegrees*Math.PI/180),l=2/(s+a),h=2/(r+o);return t[0]=l,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=h,t[6]=0,t[7]=0,t[8]=-((s-a)*l*.5),t[9]=(r-o)*h*.5,t[10]=n/(i-n),t[11]=-1,t[12]=0,t[13]=0,t[14]=n*i/(i-n),t[15]=0,t},r.ortho=function(t,e,i,n,r,o,s){var a=1/(e-i),l=1/(n-r),h=1/(o-s);return t[0]=-2*a,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*l,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*h,t[11]=0,t[12]=(e+i)*a,t[13]=(r+n)*l,t[14]=(s+o)*h,t[15]=1,t},r.lookAt=function(t,e,i,o){var s,a,l,h,u,c,p,d,f,m,v=e[0],_=e[1],y=e[2],g=o[0],x=o[1],M=o[2],w=i[0],b=i[1],S=i[2];return Math.abs(v-w)<n.EPSILON&&Math.abs(_-b)<n.EPSILON&&Math.abs(y-S)<n.EPSILON?r.identity(t):(p=v-w,d=_-b,f=y-S,m=1/Math.sqrt(p*p+d*d+f*f),p*=m,d*=m,f*=m,s=x*f-M*d,a=M*p-g*f,l=g*d-x*p,m=Math.sqrt(s*s+a*a+l*l),m?(m=1/m,s*=m,a*=m,l*=m):(s=0,a=0,l=0),h=d*l-f*a,u=f*s-p*l,c=p*a-d*s,m=Math.sqrt(h*h+u*u+c*c),m?(m=1/m,h*=m,u*=m,c*=m):(h=0,u=0,c=0),t[0]=s,t[1]=h,t[2]=p,t[3]=0,t[4]=a,t[5]=u,t[6]=d,t[7]=0,t[8]=l,t[9]=c,t[10]=f,t[11]=0,t[12]=-(s*v+a*_+l*y),t[13]=-(h*v+u*_+c*y),t[14]=-(p*v+d*_+f*y),t[15]=1,t)},r.str=function(t){return"mat4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+", "+t[9]+", "+t[10]+", "+t[11]+", "+t[12]+", "+t[13]+", "+t[14]+", "+t[15]+")"},r.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2)+Math.pow(t[9],2)+Math.pow(t[10],2)+Math.pow(t[11],2)+Math.pow(t[12],2)+Math.pow(t[13],2)+Math.pow(t[14],2)+Math.pow(t[15],2))},r.add=function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t[2]=e[2]+i[2],t[3]=e[3]+i[3],t[4]=e[4]+i[4],t[5]=e[5]+i[5],t[6]=e[6]+i[6],t[7]=e[7]+i[7],t[8]=e[8]+i[8],t[9]=e[9]+i[9],t[10]=e[10]+i[10],t[11]=e[11]+i[11],t[12]=e[12]+i[12],t[13]=e[13]+i[13],t[14]=e[14]+i[14],t[15]=e[15]+i[15],t},r.subtract=function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t[2]=e[2]-i[2],t[3]=e[3]-i[3],t[4]=e[4]-i[4],t[5]=e[5]-i[5],t[6]=e[6]-i[6],t[7]=e[7]-i[7],t[8]=e[8]-i[8],t[9]=e[9]-i[9],t[10]=e[10]-i[10],t[11]=e[11]-i[11],t[12]=e[12]-i[12],t[13]=e[13]-i[13],t[14]=e[14]-i[14],t[15]=e[15]-i[15],t},r.sub=r.subtract,r.multiplyScalar=function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t[3]=e[3]*i,t[4]=e[4]*i,t[5]=e[5]*i,t[6]=e[6]*i,t[7]=e[7]*i,t[8]=e[8]*i,t[9]=e[9]*i,t[10]=e[10]*i,t[11]=e[11]*i,t[12]=e[12]*i,t[13]=e[13]*i,t[14]=e[14]*i,t[15]=e[15]*i,t},r.multiplyScalarAndAdd=function(t,e,i,n){return t[0]=e[0]+i[0]*n,t[1]=e[1]+i[1]*n,t[2]=e[2]+i[2]*n,t[3]=e[3]+i[3]*n,t[4]=e[4]+i[4]*n,t[5]=e[5]+i[5]*n,t[6]=e[6]+i[6]*n,t[7]=e[7]+i[7]*n,t[8]=e[8]+i[8]*n,t[9]=e[9]+i[9]*n,t[10]=e[10]+i[10]*n,t[11]=e[11]+i[11]*n,t[12]=e[12]+i[12]*n,t[13]=e[13]+i[13]*n,t[14]=e[14]+i[14]*n,t[15]=e[15]+i[15]*n,t},r.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]&&t[8]===e[8]&&t[9]===e[9]&&t[10]===e[10]&&t[11]===e[11]&&t[12]===e[12]&&t[13]===e[13]&&t[14]===e[14]&&t[15]===e[15]},r.equals=function(t,e){var i=t[0],r=t[1],o=t[2],s=t[3],a=t[4],l=t[5],h=t[6],u=t[7],c=t[8],p=t[9],d=t[10],f=t[11],m=t[12],v=t[13],_=t[14],y=t[15],g=e[0],x=e[1],M=e[2],w=e[3],b=e[4],S=e[5],I=e[6],E=e[7],D=e[8],T=e[9],F=e[10],L=e[11],C=e[12],z=e[13],R=e[14],A=e[15];return Math.abs(i-g)<=n.EPSILON*Math.max(1,Math.abs(i),Math.abs(g))&&Math.abs(r-x)<=n.EPSILON*Math.max(1,Math.abs(r),Math.abs(x))&&Math.abs(o-M)<=n.EPSILON*Math.max(1,Math.abs(o),Math.abs(M))&&Math.abs(s-w)<=n.EPSILON*Math.max(1,Math.abs(s),Math.abs(w))&&Math.abs(a-b)<=n.EPSILON*Math.max(1,Math.abs(a),Math.abs(b))&&Math.abs(l-S)<=n.EPSILON*Math.max(1,Math.abs(l),Math.abs(S))&&Math.abs(h-I)<=n.EPSILON*Math.max(1,Math.abs(h),Math.abs(I))&&Math.abs(u-E)<=n.EPSILON*Math.max(1,Math.abs(u),Math.abs(E))&&Math.abs(c-D)<=n.EPSILON*Math.max(1,Math.abs(c),Math.abs(D))&&Math.abs(p-T)<=n.EPSILON*Math.max(1,Math.abs(p),Math.abs(T))&&Math.abs(d-F)<=n.EPSILON*Math.max(1,Math.abs(d),Math.abs(F))&&Math.abs(f-L)<=n.EPSILON*Math.max(1,Math.abs(f),Math.abs(L))&&Math.abs(m-C)<=n.EPSILON*Math.max(1,Math.abs(m),Math.abs(C))&&Math.abs(v-z)<=n.EPSILON*Math.max(1,Math.abs(v),Math.abs(z))&&Math.abs(_-R)<=n.EPSILON*Math.max(1,Math.abs(_),Math.abs(R))&&Math.abs(y-A)<=n.EPSILON*Math.max(1,Math.abs(y),Math.abs(A))},e.exports=r},{"./common.js":3}],8:[function(t,e,i){var n=t("./common.js"),r=t("./mat3.js"),o=t("./vec3.js"),s=t("./vec4.js"),a={};a.create=function(){var t=new n.ARRAY_TYPE(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},a.rotationTo=function(){var t=o.create(),e=o.fromValues(1,0,0),i=o.fromValues(0,1,0);return function(n,r,s){var l=o.dot(r,s);return-.999999>l?(o.cross(t,e,r),o.length(t)<1e-6&&o.cross(t,i,r),o.normalize(t,t),a.setAxisAngle(n,t,Math.PI),n):l>.999999?(n[0]=0,n[1]=0,n[2]=0,n[3]=1,n):(o.cross(t,r,s),n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=1+l,a.normalize(n,n))}}(),a.setAxes=function(){var t=r.create();return function(e,i,n,r){return t[0]=n[0],t[3]=n[1],t[6]=n[2],t[1]=r[0],t[4]=r[1],t[7]=r[2],t[2]=-i[0],t[5]=-i[1],t[8]=-i[2],a.normalize(e,a.fromMat3(e,t))}}(),a.clone=s.clone,a.fromValues=s.fromValues,a.copy=s.copy,a.set=s.set,a.identity=function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},a.setAxisAngle=function(t,e,i){i=.5*i;var n=Math.sin(i);return t[0]=n*e[0],t[1]=n*e[1],t[2]=n*e[2],t[3]=Math.cos(i),t},a.getAxisAngle=function(t,e){var i=2*Math.acos(e[3]),n=Math.sin(i/2);return 0!=n?(t[0]=e[0]/n,t[1]=e[1]/n,t[2]=e[2]/n):(t[0]=1,t[1]=0,t[2]=0),i},a.add=s.add,a.multiply=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3],a=i[0],l=i[1],h=i[2],u=i[3];return t[0]=n*u+s*a+r*h-o*l,t[1]=r*u+s*l+o*a-n*h,t[2]=o*u+s*h+n*l-r*a,t[3]=s*u-n*a-r*l-o*h,t},a.mul=a.multiply,a.scale=s.scale,a.rotateX=function(t,e,i){i*=.5;var n=e[0],r=e[1],o=e[2],s=e[3],a=Math.sin(i),l=Math.cos(i);return t[0]=n*l+s*a,t[1]=r*l+o*a,t[2]=o*l-r*a,t[3]=s*l-n*a,t},a.rotateY=function(t,e,i){i*=.5;var n=e[0],r=e[1],o=e[2],s=e[3],a=Math.sin(i),l=Math.cos(i);return t[0]=n*l-o*a,t[1]=r*l+s*a,t[2]=o*l+n*a,t[3]=s*l-r*a,t},a.rotateZ=function(t,e,i){i*=.5;var n=e[0],r=e[1],o=e[2],s=e[3],a=Math.sin(i),l=Math.cos(i);return t[0]=n*l+r*a,t[1]=r*l-n*a,t[2]=o*l+s*a,t[3]=s*l-o*a,t},a.calculateW=function(t,e){var i=e[0],n=e[1],r=e[2];return t[0]=i,t[1]=n,t[2]=r,t[3]=Math.sqrt(Math.abs(1-i*i-n*n-r*r)),t},a.dot=s.dot,a.lerp=s.lerp,a.slerp=function(t,e,i,n){var r,o,s,a,l,h=e[0],u=e[1],c=e[2],p=e[3],d=i[0],f=i[1],m=i[2],v=i[3];return o=h*d+u*f+c*m+p*v,0>o&&(o=-o,d=-d,f=-f,m=-m,v=-v),1-o>1e-6?(r=Math.acos(o),s=Math.sin(r),a=Math.sin((1-n)*r)/s,l=Math.sin(n*r)/s):(a=1-n,l=n),t[0]=a*h+l*d,t[1]=a*u+l*f,t[2]=a*c+l*m,t[3]=a*p+l*v,t},a.sqlerp=function(){var t=a.create(),e=a.create();return function(i,n,r,o,s,l){return a.slerp(t,n,s,l),a.slerp(e,r,o,l),a.slerp(i,t,e,2*l*(1-l)),i}}(),a.invert=function(t,e){var i=e[0],n=e[1],r=e[2],o=e[3],s=i*i+n*n+r*r+o*o,a=s?1/s:0;return t[0]=-i*a,t[1]=-n*a,t[2]=-r*a,t[3]=o*a,t},a.conjugate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t},a.length=s.length,a.len=a.length,a.squaredLength=s.squaredLength,a.sqrLen=a.squaredLength,a.normalize=s.normalize,a.fromMat3=function(t,e){var i,n=e[0]+e[4]+e[8];if(n>0)i=Math.sqrt(n+1),t[3]=.5*i,i=.5/i,t[0]=(e[5]-e[7])*i,t[1]=(e[6]-e[2])*i,t[2]=(e[1]-e[3])*i;else{var r=0;e[4]>e[0]&&(r=1),e[8]>e[3*r+r]&&(r=2);var o=(r+1)%3,s=(r+2)%3;i=Math.sqrt(e[3*r+r]-e[3*o+o]-e[3*s+s]+1),t[r]=.5*i,i=.5/i,t[3]=(e[3*o+s]-e[3*s+o])*i,t[o]=(e[3*o+r]+e[3*r+o])*i,t[s]=(e[3*s+r]+e[3*r+s])*i}return t},a.str=function(t){return"quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},a.exactEquals=s.exactEquals,a.equals=s.equals,e.exports=a},{"./common.js":3,"./mat3.js":6,"./vec3.js":10,"./vec4.js":11}],9:[function(t,e,i){var n=t("./common.js"),r={};r.create=function(){var t=new n.ARRAY_TYPE(2);return t[0]=0,t[1]=0,t},r.clone=function(t){var e=new n.ARRAY_TYPE(2);return e[0]=t[0],e[1]=t[1],e},r.fromValues=function(t,e){var i=new n.ARRAY_TYPE(2);return i[0]=t,i[1]=e,i},r.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t},r.set=function(t,e,i){return t[0]=e,t[1]=i,t},r.add=function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t},r.subtract=function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t},r.sub=r.subtract,r.multiply=function(t,e,i){return t[0]=e[0]*i[0],t[1]=e[1]*i[1],t},r.mul=r.multiply,r.divide=function(t,e,i){return t[0]=e[0]/i[0],t[1]=e[1]/i[1],t},r.div=r.divide,r.ceil=function(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t},r.floor=function(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t},r.min=function(t,e,i){return t[0]=Math.min(e[0],i[0]),t[1]=Math.min(e[1],i[1]),t},r.max=function(t,e,i){return t[0]=Math.max(e[0],i[0]),t[1]=Math.max(e[1],i[1]),t},r.round=function(t,e){return t[0]=Math.round(e[0]),t[1]=Math.round(e[1]),t},r.scale=function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t},r.scaleAndAdd=function(t,e,i,n){return t[0]=e[0]+i[0]*n,t[1]=e[1]+i[1]*n,t},r.distance=function(t,e){var i=e[0]-t[0],n=e[1]-t[1];return Math.sqrt(i*i+n*n)},r.dist=r.distance,r.squaredDistance=function(t,e){var i=e[0]-t[0],n=e[1]-t[1];return i*i+n*n},r.sqrDist=r.squaredDistance,r.length=function(t){var e=t[0],i=t[1];return Math.sqrt(e*e+i*i)},r.len=r.length,r.squaredLength=function(t){var e=t[0],i=t[1];return e*e+i*i},r.sqrLen=r.squaredLength,r.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t},r.inverse=function(t,e){return t[0]=1/e[0],t[1]=1/e[1],t},r.normalize=function(t,e){var i=e[0],n=e[1],r=i*i+n*n;return r>0&&(r=1/Math.sqrt(r),t[0]=e[0]*r,t[1]=e[1]*r),t},r.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]},r.cross=function(t,e,i){var n=e[0]*i[1]-e[1]*i[0];return t[0]=t[1]=0,t[2]=n,t},r.lerp=function(t,e,i,n){var r=e[0],o=e[1];return t[0]=r+n*(i[0]-r),t[1]=o+n*(i[1]-o),t},r.random=function(t,e){e=e||1;var i=2*n.RANDOM()*Math.PI;return t[0]=Math.cos(i)*e,t[1]=Math.sin(i)*e,t},r.transformMat2=function(t,e,i){var n=e[0],r=e[1];return t[0]=i[0]*n+i[2]*r,t[1]=i[1]*n+i[3]*r,t},r.transformMat2d=function(t,e,i){var n=e[0],r=e[1];return t[0]=i[0]*n+i[2]*r+i[4],t[1]=i[1]*n+i[3]*r+i[5],t},r.transformMat3=function(t,e,i){var n=e[0],r=e[1];return t[0]=i[0]*n+i[3]*r+i[6],t[1]=i[1]*n+i[4]*r+i[7],t},r.transformMat4=function(t,e,i){var n=e[0],r=e[1];return t[0]=i[0]*n+i[4]*r+i[12],t[1]=i[1]*n+i[5]*r+i[13],t},r.forEach=function(){var t=r.create();return function(e,i,n,r,o,s){var a,l;for(i||(i=2),n||(n=0),l=r?Math.min(r*i+n,e.length):e.length,a=n;l>a;a+=i)t[0]=e[a],t[1]=e[a+1],o(t,t,s),e[a]=t[0],e[a+1]=t[1];return e}}(),r.str=function(t){return"vec2("+t[0]+", "+t[1]+")"},r.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]},r.equals=function(t,e){var i=t[0],r=t[1],o=e[0],s=e[1];return Math.abs(i-o)<=n.EPSILON*Math.max(1,Math.abs(i),Math.abs(o))&&Math.abs(r-s)<=n.EPSILON*Math.max(1,Math.abs(r),Math.abs(s))},e.exports=r},{"./common.js":3}],10:[function(t,e,i){var n=t("./common.js"),r={};r.create=function(){var t=new n.ARRAY_TYPE(3);return t[0]=0,t[1]=0,t[2]=0,t},r.clone=function(t){var e=new n.ARRAY_TYPE(3);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e},r.fromValues=function(t,e,i){var r=new n.ARRAY_TYPE(3);return r[0]=t,r[1]=e,r[2]=i,r},r.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t},r.set=function(t,e,i,n){return t[0]=e,t[1]=i,t[2]=n,t},r.add=function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t[2]=e[2]+i[2],t},r.subtract=function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t[2]=e[2]-i[2],t},r.sub=r.subtract,r.multiply=function(t,e,i){return t[0]=e[0]*i[0],t[1]=e[1]*i[1],t[2]=e[2]*i[2],t},r.mul=r.multiply,r.divide=function(t,e,i){return t[0]=e[0]/i[0],t[1]=e[1]/i[1],t[2]=e[2]/i[2],t},r.div=r.divide,r.ceil=function(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t[2]=Math.ceil(e[2]),t},r.floor=function(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t[2]=Math.floor(e[2]),t},r.min=function(t,e,i){return t[0]=Math.min(e[0],i[0]),t[1]=Math.min(e[1],i[1]),t[2]=Math.min(e[2],i[2]),t},r.max=function(t,e,i){return t[0]=Math.max(e[0],i[0]),t[1]=Math.max(e[1],i[1]),t[2]=Math.max(e[2],i[2]),t},r.round=function(t,e){return t[0]=Math.round(e[0]),t[1]=Math.round(e[1]),t[2]=Math.round(e[2]),t},r.scale=function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t},r.scaleAndAdd=function(t,e,i,n){return t[0]=e[0]+i[0]*n,t[1]=e[1]+i[1]*n,t[2]=e[2]+i[2]*n,t},r.distance=function(t,e){var i=e[0]-t[0],n=e[1]-t[1],r=e[2]-t[2];return Math.sqrt(i*i+n*n+r*r)},r.dist=r.distance,r.squaredDistance=function(t,e){var i=e[0]-t[0],n=e[1]-t[1],r=e[2]-t[2];return i*i+n*n+r*r},r.sqrDist=r.squaredDistance,r.length=function(t){var e=t[0],i=t[1],n=t[2];return Math.sqrt(e*e+i*i+n*n)},r.len=r.length,r.squaredLength=function(t){var e=t[0],i=t[1],n=t[2];return e*e+i*i+n*n},r.sqrLen=r.squaredLength,r.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t},r.inverse=function(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t},r.normalize=function(t,e){var i=e[0],n=e[1],r=e[2],o=i*i+n*n+r*r;return o>0&&(o=1/Math.sqrt(o),t[0]=e[0]*o,t[1]=e[1]*o,t[2]=e[2]*o),t},r.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]},r.cross=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=i[0],a=i[1],l=i[2];return t[0]=r*l-o*a,t[1]=o*s-n*l,t[2]=n*a-r*s,t},r.lerp=function(t,e,i,n){var r=e[0],o=e[1],s=e[2];return t[0]=r+n*(i[0]-r),t[1]=o+n*(i[1]-o),t[2]=s+n*(i[2]-s),t},r.hermite=function(t,e,i,n,r,o){var s=o*o,a=s*(2*o-3)+1,l=s*(o-2)+o,h=s*(o-1),u=s*(3-2*o);return t[0]=e[0]*a+i[0]*l+n[0]*h+r[0]*u,t[1]=e[1]*a+i[1]*l+n[1]*h+r[1]*u,t[2]=e[2]*a+i[2]*l+n[2]*h+r[2]*u,t},r.bezier=function(t,e,i,n,r,o){var s=1-o,a=s*s,l=o*o,h=a*s,u=3*o*a,c=3*l*s,p=l*o;return t[0]=e[0]*h+i[0]*u+n[0]*c+r[0]*p,t[1]=e[1]*h+i[1]*u+n[1]*c+r[1]*p,t[2]=e[2]*h+i[2]*u+n[2]*c+r[2]*p,t},r.random=function(t,e){e=e||1;var i=2*n.RANDOM()*Math.PI,r=2*n.RANDOM()-1,o=Math.sqrt(1-r*r)*e;return t[0]=Math.cos(i)*o,t[1]=Math.sin(i)*o,t[2]=r*e,t},r.transformMat4=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=i[3]*n+i[7]*r+i[11]*o+i[15];return s=s||1,t[0]=(i[0]*n+i[4]*r+i[8]*o+i[12])/s,t[1]=(i[1]*n+i[5]*r+i[9]*o+i[13])/s,t[2]=(i[2]*n+i[6]*r+i[10]*o+i[14])/s,t},r.transformMat3=function(t,e,i){var n=e[0],r=e[1],o=e[2];return t[0]=n*i[0]+r*i[3]+o*i[6],t[1]=n*i[1]+r*i[4]+o*i[7],t[2]=n*i[2]+r*i[5]+o*i[8],t},r.transformQuat=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=i[0],a=i[1],l=i[2],h=i[3],u=h*n+a*o-l*r,c=h*r+l*n-s*o,p=h*o+s*r-a*n,d=-s*n-a*r-l*o;return t[0]=u*h+d*-s+c*-l-p*-a,t[1]=c*h+d*-a+p*-s-u*-l,t[2]=p*h+d*-l+u*-a-c*-s,t},r.rotateX=function(t,e,i,n){var r=[],o=[];return r[0]=e[0]-i[0],r[1]=e[1]-i[1],r[2]=e[2]-i[2],o[0]=r[0],o[1]=r[1]*Math.cos(n)-r[2]*Math.sin(n),o[2]=r[1]*Math.sin(n)+r[2]*Math.cos(n),t[0]=o[0]+i[0],t[1]=o[1]+i[1],t[2]=o[2]+i[2],t},r.rotateY=function(t,e,i,n){var r=[],o=[];return r[0]=e[0]-i[0],r[1]=e[1]-i[1],r[2]=e[2]-i[2],o[0]=r[2]*Math.sin(n)+r[0]*Math.cos(n),o[1]=r[1],o[2]=r[2]*Math.cos(n)-r[0]*Math.sin(n),t[0]=o[0]+i[0],t[1]=o[1]+i[1],t[2]=o[2]+i[2],t},r.rotateZ=function(t,e,i,n){var r=[],o=[];return r[0]=e[0]-i[0],r[1]=e[1]-i[1],r[2]=e[2]-i[2],o[0]=r[0]*Math.cos(n)-r[1]*Math.sin(n),o[1]=r[0]*Math.sin(n)+r[1]*Math.cos(n),o[2]=r[2],t[0]=o[0]+i[0],t[1]=o[1]+i[1],t[2]=o[2]+i[2],t},r.forEach=function(){var t=r.create();return function(e,i,n,r,o,s){var a,l;for(i||(i=3),n||(n=0),l=r?Math.min(r*i+n,e.length):e.length,a=n;l>a;a+=i)t[0]=e[a],t[1]=e[a+1],t[2]=e[a+2],o(t,t,s),e[a]=t[0],e[a+1]=t[1],e[a+2]=t[2];return e}}(),r.angle=function(t,e){var i=r.fromValues(t[0],t[1],t[2]),n=r.fromValues(e[0],e[1],e[2]);r.normalize(i,i),r.normalize(n,n);var o=r.dot(i,n);return o>1?0:Math.acos(o)},r.str=function(t){return"vec3("+t[0]+", "+t[1]+", "+t[2]+")"},r.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]},r.equals=function(t,e){var i=t[0],r=t[1],o=t[2],s=e[0],a=e[1],l=e[2];return Math.abs(i-s)<=n.EPSILON*Math.max(1,Math.abs(i),Math.abs(s))&&Math.abs(r-a)<=n.EPSILON*Math.max(1,Math.abs(r),Math.abs(a))&&Math.abs(o-l)<=n.EPSILON*Math.max(1,Math.abs(o),Math.abs(l))},e.exports=r},{"./common.js":3}],11:[function(t,e,i){var n=t("./common.js"),r={};r.create=function(){var t=new n.ARRAY_TYPE(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t},r.clone=function(t){var e=new n.ARRAY_TYPE(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e},r.fromValues=function(t,e,i,r){var o=new n.ARRAY_TYPE(4);return o[0]=t,o[1]=e,o[2]=i,o[3]=r,o},r.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t},r.set=function(t,e,i,n,r){return t[0]=e,t[1]=i,t[2]=n,t[3]=r,t},r.add=function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t[2]=e[2]+i[2],t[3]=e[3]+i[3],t},r.subtract=function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t[2]=e[2]-i[2],t[3]=e[3]-i[3],t},r.sub=r.subtract,r.multiply=function(t,e,i){return t[0]=e[0]*i[0],t[1]=e[1]*i[1],t[2]=e[2]*i[2],t[3]=e[3]*i[3],t},r.mul=r.multiply,r.divide=function(t,e,i){return t[0]=e[0]/i[0],t[1]=e[1]/i[1],t[2]=e[2]/i[2],t[3]=e[3]/i[3],t},r.div=r.divide,r.ceil=function(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t[2]=Math.ceil(e[2]),t[3]=Math.ceil(e[3]),t},r.floor=function(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t[2]=Math.floor(e[2]),t[3]=Math.floor(e[3]),t},r.min=function(t,e,i){return t[0]=Math.min(e[0],i[0]),t[1]=Math.min(e[1],i[1]),t[2]=Math.min(e[2],i[2]),t[3]=Math.min(e[3],i[3]),t},r.max=function(t,e,i){return t[0]=Math.max(e[0],i[0]),t[1]=Math.max(e[1],i[1]),t[2]=Math.max(e[2],i[2]),t[3]=Math.max(e[3],i[3]),t},r.round=function(t,e){return t[0]=Math.round(e[0]),t[1]=Math.round(e[1]),t[2]=Math.round(e[2]),t[3]=Math.round(e[3]),t},r.scale=function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t[3]=e[3]*i,t},r.scaleAndAdd=function(t,e,i,n){return t[0]=e[0]+i[0]*n,t[1]=e[1]+i[1]*n,t[2]=e[2]+i[2]*n,t[3]=e[3]+i[3]*n,t},r.distance=function(t,e){var i=e[0]-t[0],n=e[1]-t[1],r=e[2]-t[2],o=e[3]-t[3];return Math.sqrt(i*i+n*n+r*r+o*o)},r.dist=r.distance,r.squaredDistance=function(t,e){var i=e[0]-t[0],n=e[1]-t[1],r=e[2]-t[2],o=e[3]-t[3];return i*i+n*n+r*r+o*o},r.sqrDist=r.squaredDistance,r.length=function(t){var e=t[0],i=t[1],n=t[2],r=t[3];return Math.sqrt(e*e+i*i+n*n+r*r)},r.len=r.length,r.squaredLength=function(t){var e=t[0],i=t[1],n=t[2],r=t[3];return e*e+i*i+n*n+r*r},r.sqrLen=r.squaredLength,r.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=-e[3],t},r.inverse=function(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t[3]=1/e[3],t},r.normalize=function(t,e){var i=e[0],n=e[1],r=e[2],o=e[3],s=i*i+n*n+r*r+o*o;return s>0&&(s=1/Math.sqrt(s),t[0]=i*s,t[1]=n*s,t[2]=r*s,t[3]=o*s),t},r.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]},r.lerp=function(t,e,i,n){var r=e[0],o=e[1],s=e[2],a=e[3];return t[0]=r+n*(i[0]-r),t[1]=o+n*(i[1]-o),t[2]=s+n*(i[2]-s),t[3]=a+n*(i[3]-a),t},r.random=function(t,e){return e=e||1,t[0]=n.RANDOM(),t[1]=n.RANDOM(),t[2]=n.RANDOM(),t[3]=n.RANDOM(),r.normalize(t,t),r.scale(t,t,e),t},r.transformMat4=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3];return t[0]=i[0]*n+i[4]*r+i[8]*o+i[12]*s,t[1]=i[1]*n+i[5]*r+i[9]*o+i[13]*s,t[2]=i[2]*n+i[6]*r+i[10]*o+i[14]*s,t[3]=i[3]*n+i[7]*r+i[11]*o+i[15]*s,t},r.transformQuat=function(t,e,i){var n=e[0],r=e[1],o=e[2],s=i[0],a=i[1],l=i[2],h=i[3],u=h*n+a*o-l*r,c=h*r+l*n-s*o,p=h*o+s*r-a*n,d=-s*n-a*r-l*o;return t[0]=u*h+d*-s+c*-l-p*-a,t[1]=c*h+d*-a+p*-s-u*-l,t[2]=p*h+d*-l+u*-a-c*-s,t[3]=e[3],t},r.forEach=function(){var t=r.create();return function(e,i,n,r,o,s){var a,l;for(i||(i=4),n||(n=0),l=r?Math.min(r*i+n,e.length):e.length,a=n;l>a;a+=i)t[0]=e[a],t[1]=e[a+1],t[2]=e[a+2],t[3]=e[a+3],o(t,t,s),e[a]=t[0],e[a+1]=t[1],e[a+2]=t[2],e[a+3]=t[3];return e}}(),r.str=function(t){return"vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},r.exactEquals=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]},r.equals=function(t,e){var i=t[0],r=t[1],o=t[2],s=t[3],a=e[0],l=e[1],h=e[2],u=e[3];return Math.abs(i-a)<=n.EPSILON*Math.max(1,Math.abs(i),Math.abs(a))&&Math.abs(r-l)<=n.EPSILON*Math.max(1,Math.abs(r),Math.abs(l))&&Math.abs(o-h)<=n.EPSILON*Math.max(1,Math.abs(o),Math.abs(h))&&Math.abs(s-u)<=n.EPSILON*Math.max(1,Math.abs(s),Math.abs(u))},e.exports=r},{"./common.js":3}],12:[function(e,i,n){!function(e,n,r,o){"use strict";function s(t,e,i){return setTimeout(d(t,i),e)}function a(t,e,i){return Array.isArray(t)?(l(t,i[e],i),!0):!1}function l(t,e,i){var n;if(t)if(t.forEach)t.forEach(e,i);else if(t.length!==o)for(n=0;n<t.length;)e.call(i,t[n],n,t),n++;else for(n in t)t.hasOwnProperty(n)&&e.call(i,t[n],n,t)}function h(t,e,i){for(var n=Object.keys(e),r=0;r<n.length;)(!i||i&&t[n[r]]===o)&&(t[n[r]]=e[n[r]]),r++;return t}function u(t,e){return h(t,e,!0)}function c(t){if(Object.create)return Object.create(t);var e=function(){};e.prototype=t;var i=new e;return e.prototype=null,i}function p(t,e,i){var n,r=e.prototype;n=t.prototype=c(r),n.constructor=t,n._super=r,i&&h(n,i)}function d(t,e){return function(){return t.apply(e,arguments)}}function f(t,e){return typeof t==dt?t.apply(e?e[0]||o:o,e):t}function m(t,e){return t===o?e:t}function v(t,e,i){l(x(e),function(e){t.addEventListener(e,i,!1)})}function _(t,e,i){l(x(e),function(e){t.removeEventListener(e,i,!1)})}function y(t,e){for(;t;){if(t==e)return!0;t=t.parentNode}return!1}function g(t,e){return t.indexOf(e)>-1}function x(t){return t.trim().split(/\s+/g)}function M(t,e,i){if(t.indexOf&&!i)return t.indexOf(e);for(var n=0;n<t.length;){if(i&&t[n][i]==e||!i&&t[n]===e)return n;n++}return-1}function w(t){return Array.prototype.slice.call(t,0)}function b(t,e,i){for(var n=[],r=[],o=0;o<t.length;){var s=e?t[o][e]:t[o];M(r,s)<0&&n.push(t[o]),r[o]=s,o++}return i&&(n=e?n.sort(function(t,i){return t[e]>i[e]}):n.sort()),n}function S(t,e){for(var i,n,r=e[0].toUpperCase()+e.slice(1),s=0;s<ct.length;){if(i=ct[s],n=i?i+r:e,n in t)return n;s++}return o}function I(){return _t++}function E(t){var i=t.ownerDocument||t;return i.defaultView||i.parentWindow||e}function D(t,e){var i=this;this.manager=t,this.callback=e,this.element=t.element,this.target=t.options.inputTarget,this.domHandler=function(e){f(t.options.enable,[t])&&i.handler(e)},this.init()}function T(t){var e,i=t.options.inputClass;return new(e=i?i:xt?W:Mt?j:gt?G:q)(t,F)}function F(t,e,i){var n=i.pointers.length,r=i.changedPointers.length,o=e&Dt&&n-r===0,s=e&(Ft|Lt)&&n-r===0;i.isFirst=!!o,i.isFinal=!!s,o&&(t.session={}),i.eventType=e,L(t,i),t.emit("hammer.input",i),t.recognize(i),t.session.prevInput=i}function L(t,e){var i=t.session,n=e.pointers,r=n.length;i.firstInput||(i.firstInput=R(e)),r>1&&!i.firstMultiple?i.firstMultiple=R(e):1===r&&(i.firstMultiple=!1);var o=i.firstInput,s=i.firstMultiple,a=s?s.center:o.center,l=e.center=A(n);e.timeStamp=vt(),e.deltaTime=e.timeStamp-o.timeStamp,e.angle=O(a,l),e.distance=H(a,l),C(i,e),e.offsetDirection=k(e.deltaX,e.deltaY),e.scale=s?Y(s.pointers,n):1,e.rotation=s?N(s.pointers,n):0,z(i,e);var h=t.element;y(e.srcEvent.target,h)&&(h=e.srcEvent.target),e.target=h}function C(t,e){var i=e.center,n=t.offsetDelta||{},r=t.prevDelta||{},o=t.prevInput||{};e.eventType!==Dt&&o.eventType!==Ft||(r=t.prevDelta={x:o.deltaX||0,y:o.deltaY||0},n=t.offsetDelta={x:i.x,y:i.y}),e.deltaX=r.x+(i.x-n.x),e.deltaY=r.y+(i.y-n.y)}function z(t,e){var i,n,r,s,a=t.lastInterval||e,l=e.timeStamp-a.timeStamp;if(e.eventType!=Lt&&(l>Et||a.velocity===o)){var h=a.deltaX-e.deltaX,u=a.deltaY-e.deltaY,c=P(l,h,u);n=c.x,r=c.y,i=mt(c.x)>mt(c.y)?c.x:c.y,s=k(h,u),t.lastInterval=e}else i=a.velocity,n=a.velocityX,r=a.velocityY,s=a.direction;e.velocity=i,e.velocityX=n,e.velocityY=r,e.direction=s}function R(t){for(var e=[],i=0;i<t.pointers.length;)e[i]={clientX:ft(t.pointers[i].clientX),clientY:ft(t.pointers[i].clientY)},i++;return{timeStamp:vt(),pointers:e,center:A(e),deltaX:t.deltaX,deltaY:t.deltaY}}function A(t){var e=t.length;if(1===e)return{x:ft(t[0].clientX),y:ft(t[0].clientY)};for(var i=0,n=0,r=0;e>r;)i+=t[r].clientX,n+=t[r].clientY,r++;return{x:ft(i/e),y:ft(n/e)}}function P(t,e,i){return{x:e/t||0,y:i/t||0}}function k(t,e){return t===e?Ct:mt(t)>=mt(e)?t>0?zt:Rt:e>0?At:Pt}function H(t,e,i){i||(i=Nt);var n=e[i[0]]-t[i[0]],r=e[i[1]]-t[i[1]];return Math.sqrt(n*n+r*r)}function O(t,e,i){i||(i=Nt);var n=e[i[0]]-t[i[0]],r=e[i[1]]-t[i[1]];return 180*Math.atan2(r,n)/Math.PI}function N(t,e){return O(e[1],e[0],Yt)-O(t[1],t[0],Yt)}function Y(t,e){return H(e[0],e[1],Yt)/H(t[0],t[1],Yt)}function q(){this.evEl=Wt,Bt?this.evDoc=Xt:this.evWin=Xt,this.allow=!0,this.pressed=!1,D.apply(this,arguments)}function W(){this.evEl=Gt,this.evWin=Ut,D.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function X(){this.evTarget=Kt,this.evWin=Qt,this.started=!1,D.apply(this,arguments)}function B(t,e){var i=w(t.touches),n=w(t.changedTouches);return e&(Ft|Lt)&&(i=b(i.concat(n),"identifier",!0)),[i,n]}function j(){this.evTarget=Jt,this.targetIds={},D.apply(this,arguments)}function V(t,e){var i=w(t.touches),n=this.targetIds;if(e&(Dt|Tt)&&1===i.length)return n[i[0].identifier]=!0,[i,i];var r,o,s=w(t.changedTouches),a=[],l=this.target;if(o=i.filter(function(t){return y(t.target,l)}),e===Dt)for(r=0;r<o.length;)n[o[r].identifier]=!0,r++;for(r=0;r<s.length;)n[s[r].identifier]&&a.push(s[r]),e&(Ft|Lt)&&delete n[s[r].identifier],r++;return a.length?[b(o.concat(a),"identifier",!0),a]:void 0}function G(){D.apply(this,arguments);var t=d(this.handler,this);this.touch=new j(this.manager,t),this.mouse=new q(this.manager,t)}function U(t,e){this.manager=t,this.set(e)}function Z(t){if(g(t,oe))return oe;var e=g(t,se),i=g(t,ae);return e&&i?se+" "+ae:e||i?e?se:ae:g(t,re)?re:ne}function K(t){this.id=I(),this.manager=null,this.options=u(t||{},this.defaults),this.options.enable=m(this.options.enable,!0),this.state=le,this.simultaneous={},this.requireFail=[]}function Q(t){return t&de?"cancel":t&ce?"end":t&ue?"move":t&he?"start":""}function $(t){return t==Pt?"down":t==At?"up":t==zt?"left":t==Rt?"right":""}function J(t,e){var i=e.manager;return i?i.get(t):t}function tt(){K.apply(this,arguments)}function et(){tt.apply(this,arguments),this.pX=null,this.pY=null}function it(){tt.apply(this,arguments)}function nt(){K.apply(this,arguments),this._timer=null,this._input=null}function rt(){tt.apply(this,arguments)}function ot(){tt.apply(this,arguments)}function st(){K.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function at(t,e){
return e=e||{},e.recognizers=m(e.recognizers,at.defaults.preset),new lt(t,e)}function lt(t,e){e=e||{},this.options=u(e,at.defaults),this.options.inputTarget=this.options.inputTarget||t,this.handlers={},this.session={},this.recognizers=[],this.element=t,this.input=T(this),this.touchAction=new U(this,this.options.touchAction),ht(this,!0),l(e.recognizers,function(t){var e=this.add(new t[0](t[1]));t[2]&&e.recognizeWith(t[2]),t[3]&&e.requireFailure(t[3])},this)}function ht(t,e){var i=t.element;i.style&&l(t.options.cssProps,function(t,n){i.style[S(i.style,n)]=e?t:""})}function ut(t,e){var i=n.createEvent("Event");i.initEvent(t,!0,!0),i.gesture=e,e.target.dispatchEvent(i)}var ct=["","webkit","moz","MS","ms","o"],pt=n.createElement("div"),dt="function",ft=Math.round,mt=Math.abs,vt=Date.now,_t=1,yt=/mobile|tablet|ip(ad|hone|od)|android/i,gt="ontouchstart"in e,xt=S(e,"PointerEvent")!==o,Mt=gt&&yt.test(navigator.userAgent),wt="touch",bt="pen",St="mouse",It="kinect",Et=25,Dt=1,Tt=2,Ft=4,Lt=8,Ct=1,zt=2,Rt=4,At=8,Pt=16,kt=zt|Rt,Ht=At|Pt,Ot=kt|Ht,Nt=["x","y"],Yt=["clientX","clientY"];D.prototype={handler:function(){},init:function(){this.evEl&&v(this.element,this.evEl,this.domHandler),this.evTarget&&v(this.target,this.evTarget,this.domHandler),this.evWin&&v(E(this.element),this.evWin,this.domHandler),this.evDoc&&v(n,this.evDoc,this.domHandler),this.evBody&&v(n.body,this.evBody,this.domHandler)},destroy:function(){this.evEl&&_(this.element,this.evEl,this.domHandler),this.evTarget&&_(this.target,this.evTarget,this.domHandler),this.evWin&&_(E(this.element),this.evWin,this.domHandler),this.evDoc&&_(n,this.evDoc,this.domHandler),this.evBody&&_(n.body,this.evBody,this.domHandler)}};var qt={mousedown:Dt,mousemove:Tt,mouseup:Ft},Wt="mousedown",Xt="mousemove mouseup",Bt=e.navigator.userAgent.indexOf("MSIE 8")>0;p(q,D,{handler:function(t){var e=qt[t.type],i=0;Bt&&(i=1),e&Dt&&t.button===i&&(this.pressed=!0),e&Tt&&t.button!==i&&(e=Ft),this.pressed&&this.allow&&(e&Ft&&(this.pressed=!1),this.callback(this.manager,e,{pointers:[t],changedPointers:[t],pointerType:St,srcEvent:t}))}});var jt={pointerdown:Dt,pointermove:Tt,pointerup:Ft,pointercancel:Lt,pointerout:Lt},Vt={2:wt,3:bt,4:St,5:It},Gt="pointerdown",Ut="pointermove pointerup pointercancel";e.MSPointerEvent&&(Gt="MSPointerDown",Ut="MSPointerMove MSPointerUp MSPointerCancel"),p(W,D,{handler:function(t){var e=this.store,i=!1,n=t.type.toLowerCase().replace("ms",""),r=jt[n],o=Vt[t.pointerType]||t.pointerType,s=o==wt,a=M(e,t.pointerId,"pointerId");r&Dt&&(0===t.button||s)?0>a&&(e.push(t),a=e.length-1):r&(Ft|Lt)&&(i=!0),0>a||(e[a]=t,this.callback(this.manager,r,{pointers:e,changedPointers:[t],pointerType:o,srcEvent:t}),i&&e.splice(a,1))}});var Zt={touchstart:Dt,touchmove:Tt,touchend:Ft,touchcancel:Lt},Kt="touchstart",Qt="touchstart touchmove touchend touchcancel";p(X,D,{handler:function(t){var e=Zt[t.type];if(e===Dt&&(this.started=!0),this.started){var i=B.call(this,t,e);e&(Ft|Lt)&&i[0].length-i[1].length===0&&(this.started=!1),this.callback(this.manager,e,{pointers:i[0],changedPointers:i[1],pointerType:wt,srcEvent:t})}}});var $t={touchstart:Dt,touchmove:Tt,touchend:Ft,touchcancel:Lt},Jt="touchstart touchmove touchend touchcancel";p(j,D,{handler:function(t){var e=$t[t.type],i=V.call(this,t,e);i&&this.callback(this.manager,e,{pointers:i[0],changedPointers:i[1],pointerType:wt,srcEvent:t})}}),p(G,D,{handler:function(t,e,i){var n=i.pointerType==wt,r=i.pointerType==St;if(n)this.mouse.allow=!1;else if(r&&!this.mouse.allow)return;e&(Ft|Lt)&&(this.mouse.allow=!0),this.callback(t,e,i)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var te=S(pt.style,"touchAction"),ee=te!==o,ie="compute",ne="auto",re="manipulation",oe="none",se="pan-x",ae="pan-y";U.prototype={set:function(t){t==ie&&(t=this.compute()),ee&&this.manager.element.style&&(this.manager.element.style[te]=t),this.actions=t.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var t=[];return l(this.manager.recognizers,function(e){f(e.options.enable,[e])&&(t=t.concat(e.getTouchAction()))}),Z(t.join(" "))},preventDefaults:function(t){if(!ee){var e=t.srcEvent,i=t.offsetDirection;if(this.manager.session.prevented)return void e.preventDefault();var n=this.actions,r=g(n,oe),o=g(n,ae),s=g(n,se);return r||o&&i&kt||s&&i&Ht?this.preventSrc(e):void 0}},preventSrc:function(t){this.manager.session.prevented=!0,t.preventDefault()}};var le=1,he=2,ue=4,ce=8,pe=ce,de=16,fe=32;K.prototype={defaults:{},set:function(t){return h(this.options,t),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(t){if(a(t,"recognizeWith",this))return this;var e=this.simultaneous;return t=J(t,this),e[t.id]||(e[t.id]=t,t.recognizeWith(this)),this},dropRecognizeWith:function(t){return a(t,"dropRecognizeWith",this)?this:(t=J(t,this),delete this.simultaneous[t.id],this)},requireFailure:function(t){if(a(t,"requireFailure",this))return this;var e=this.requireFail;return t=J(t,this),-1===M(e,t)&&(e.push(t),t.requireFailure(this)),this},dropRequireFailure:function(t){if(a(t,"dropRequireFailure",this))return this;t=J(t,this);var e=M(this.requireFail,t);return e>-1&&this.requireFail.splice(e,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(t){return!!this.simultaneous[t.id]},emit:function(t){function e(e){i.manager.emit(i.options.event+(e?Q(n):""),t)}var i=this,n=this.state;ce>n&&e(!0),e(),n>=ce&&e(!0)},tryEmit:function(t){return this.canEmit()?this.emit(t):void(this.state=fe)},canEmit:function(){for(var t=0;t<this.requireFail.length;){if(!(this.requireFail[t].state&(fe|le)))return!1;t++}return!0},recognize:function(t){var e=h({},t);return f(this.options.enable,[this,e])?(this.state&(pe|de|fe)&&(this.state=le),this.state=this.process(e),void(this.state&(he|ue|ce|de)&&this.tryEmit(e))):(this.reset(),void(this.state=fe))},process:function(t){},getTouchAction:function(){},reset:function(){}},p(tt,K,{defaults:{pointers:1},attrTest:function(t){var e=this.options.pointers;return 0===e||t.pointers.length===e},process:function(t){var e=this.state,i=t.eventType,n=e&(he|ue),r=this.attrTest(t);return n&&(i&Lt||!r)?e|de:n||r?i&Ft?e|ce:e&he?e|ue:he:fe}}),p(et,tt,{defaults:{event:"pan",threshold:10,pointers:1,direction:Ot},getTouchAction:function(){var t=this.options.direction,e=[];return t&kt&&e.push(ae),t&Ht&&e.push(se),e},directionTest:function(t){var e=this.options,i=!0,n=t.distance,r=t.direction,o=t.deltaX,s=t.deltaY;return r&e.direction||(e.direction&kt?(r=0===o?Ct:0>o?zt:Rt,i=o!=this.pX,n=Math.abs(t.deltaX)):(r=0===s?Ct:0>s?At:Pt,i=s!=this.pY,n=Math.abs(t.deltaY))),t.direction=r,i&&n>e.threshold&&r&e.direction},attrTest:function(t){return tt.prototype.attrTest.call(this,t)&&(this.state&he||!(this.state&he)&&this.directionTest(t))},emit:function(t){this.pX=t.deltaX,this.pY=t.deltaY;var e=$(t.direction);e&&this.manager.emit(this.options.event+e,t),this._super.emit.call(this,t)}}),p(it,tt,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[oe]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.scale-1)>this.options.threshold||this.state&he)},emit:function(t){if(this._super.emit.call(this,t),1!==t.scale){var e=t.scale<1?"in":"out";this.manager.emit(this.options.event+e,t)}}}),p(nt,K,{defaults:{event:"press",pointers:1,time:500,threshold:5},getTouchAction:function(){return[ne]},process:function(t){var e=this.options,i=t.pointers.length===e.pointers,n=t.distance<e.threshold,r=t.deltaTime>e.time;if(this._input=t,!n||!i||t.eventType&(Ft|Lt)&&!r)this.reset();else if(t.eventType&Dt)this.reset(),this._timer=s(function(){this.state=pe,this.tryEmit()},e.time,this);else if(t.eventType&Ft)return pe;return fe},reset:function(){clearTimeout(this._timer)},emit:function(t){this.state===pe&&(t&&t.eventType&Ft?this.manager.emit(this.options.event+"up",t):(this._input.timeStamp=vt(),this.manager.emit(this.options.event,this._input)))}}),p(rt,tt,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[oe]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.rotation)>this.options.threshold||this.state&he)}}),p(ot,tt,{defaults:{event:"swipe",threshold:10,velocity:.65,direction:kt|Ht,pointers:1},getTouchAction:function(){return et.prototype.getTouchAction.call(this)},attrTest:function(t){var e,i=this.options.direction;return i&(kt|Ht)?e=t.velocity:i&kt?e=t.velocityX:i&Ht&&(e=t.velocityY),this._super.attrTest.call(this,t)&&i&t.direction&&t.distance>this.options.threshold&&mt(e)>this.options.velocity&&t.eventType&Ft},emit:function(t){var e=$(t.direction);e&&this.manager.emit(this.options.event+e,t),this.manager.emit(this.options.event,t)}}),p(st,K,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:2,posThreshold:10},getTouchAction:function(){return[re]},process:function(t){var e=this.options,i=t.pointers.length===e.pointers,n=t.distance<e.threshold,r=t.deltaTime<e.time;if(this.reset(),t.eventType&Dt&&0===this.count)return this.failTimeout();if(n&&r&&i){if(t.eventType!=Ft)return this.failTimeout();var o=this.pTime?t.timeStamp-this.pTime<e.interval:!0,a=!this.pCenter||H(this.pCenter,t.center)<e.posThreshold;this.pTime=t.timeStamp,this.pCenter=t.center,a&&o?this.count+=1:this.count=1,this._input=t;var l=this.count%e.taps;if(0===l)return this.hasRequireFailures()?(this._timer=s(function(){this.state=pe,this.tryEmit()},e.interval,this),he):pe}return fe},failTimeout:function(){return this._timer=s(function(){this.state=fe},this.options.interval,this),fe},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==pe&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),at.VERSION="2.0.4",at.defaults={domEvents:!1,touchAction:ie,enable:!0,inputTarget:null,inputClass:null,preset:[[rt,{enable:!1}],[it,{enable:!1},["rotate"]],[ot,{direction:kt}],[et,{direction:kt},["swipe"]],[st],[st,{event:"doubletap",taps:2},["tap"]],[nt]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var me=1,ve=2;lt.prototype={set:function(t){return h(this.options,t),t.touchAction&&this.touchAction.update(),t.inputTarget&&(this.input.destroy(),this.input.target=t.inputTarget,this.input.init()),this},stop:function(t){this.session.stopped=t?ve:me},recognize:function(t){var e=this.session;if(!e.stopped){this.touchAction.preventDefaults(t);var i,n=this.recognizers,r=e.curRecognizer;(!r||r&&r.state&pe)&&(r=e.curRecognizer=null);for(var o=0;o<n.length;)i=n[o],e.stopped===ve||r&&i!=r&&!i.canRecognizeWith(r)?i.reset():i.recognize(t),!r&&i.state&(he|ue|ce)&&(r=e.curRecognizer=i),o++}},get:function(t){if(t instanceof K)return t;for(var e=this.recognizers,i=0;i<e.length;i++)if(e[i].options.event==t)return e[i];return null},add:function(t){if(a(t,"add",this))return this;var e=this.get(t.options.event);return e&&this.remove(e),this.recognizers.push(t),t.manager=this,this.touchAction.update(),t},remove:function(t){if(a(t,"remove",this))return this;var e=this.recognizers;return t=this.get(t),e.splice(M(e,t),1),this.touchAction.update(),this},on:function(t,e){var i=this.handlers;return l(x(t),function(t){i[t]=i[t]||[],i[t].push(e)}),this},off:function(t,e){var i=this.handlers;return l(x(t),function(t){e?i[t].splice(M(i[t],e),1):delete i[t]}),this},emit:function(t,e){this.options.domEvents&&ut(t,e);var i=this.handlers[t]&&this.handlers[t].slice();if(i&&i.length){e.type=t,e.preventDefault=function(){e.srcEvent.preventDefault()};for(var n=0;n<i.length;)i[n](e),n++}},destroy:function(){this.element&&ht(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},h(at,{INPUT_START:Dt,INPUT_MOVE:Tt,INPUT_END:Ft,INPUT_CANCEL:Lt,STATE_POSSIBLE:le,STATE_BEGAN:he,STATE_CHANGED:ue,STATE_ENDED:ce,STATE_RECOGNIZED:pe,STATE_CANCELLED:de,STATE_FAILED:fe,DIRECTION_NONE:Ct,DIRECTION_LEFT:zt,DIRECTION_RIGHT:Rt,DIRECTION_UP:At,DIRECTION_DOWN:Pt,DIRECTION_HORIZONTAL:kt,DIRECTION_VERTICAL:Ht,DIRECTION_ALL:Ot,Manager:lt,Input:D,TouchAction:U,TouchInput:j,MouseInput:q,PointerEventInput:W,TouchMouseInput:G,SingleTouchInput:X,Recognizer:K,AttrRecognizer:tt,Tap:st,Pan:et,Swipe:ot,Pinch:it,Rotate:rt,Press:nt,on:v,off:_,each:l,merge:u,extend:h,inherit:p,bindFn:d,prefixed:S}),typeof t==dt&&t.amd?t(function(){return at}):"undefined"!=typeof i&&i.exports?i.exports=at:e[r]=at}(window,document,"Hammer")},{}],13:[function(t,e,i){"use strict";function n(){}function r(t){for(var e in n.prototype)n.prototype.hasOwnProperty(e)&&(t.prototype[e]=n.prototype[e])}n.prototype.addEventListener=function(t,e){var i=this.__events=this.__events||{},n=i[t]=i[t]||[];n.push(e)},n.prototype.removeEventListener=function(t,e){var i=this.__events=this.__events||{},n=i[t];if(n){var r=n.indexOf(e);r>=0&&n.splice(r,1)}},n.prototype.emit=function(){var t=this.__events=this.__events||{},e=arguments[0],i=t[e];if(i)for(var n=0;n<i.length;n++){var r=i[n];r.apply(this,arguments)}},e.exports=r},{}],14:[function(t,e,i){"use strict";function n(t,e){this._equals=t,this._hash=e,this._queue=[],this._visited=new r(t,e),this._neighborsFun=null,this._exploreFun=null}var r=t("./collections/Set");n.prototype.start=function(t,e,i){if(this._neighborsFun||this._exploreFun)throw new Error("GraphFinder: search already in progress");this.reset(),this._neighborsFun=e,this._exploreFun=i,this._queue.push(t)},n.prototype.reset=function(){this._neighborsFun=null,this._exploreFun=null,this._queue.length=0,this._visited.clear()},n.prototype.next=function(){var t=this._queue,e=this._visited,i=this._neighborsFun,n=this._exploreFun;if(!i||!n)throw new Error("GraphFinder: no search in progress");for(;t.length>0;){var r=this._queue.shift();if(!e.has(r)&&n(r)){e.add(r);for(var o=i(r),s=0;s<o.length;s++)t.push(o[s]);return r}}return this.reset(),null},e.exports=n},{"./collections/Set":33}],15:[function(t,e,i){"use strict";function n(t,e,i,n,r){if(r=r||{},r.perspective=r.perspective||{},r.perspective.extraRotations=null!=r.perspective.extraRotations?r.perspective.extraRotations:"",r.perspective.radius&&!o())throw new Error("Hotspot cannot not be embedded in sphere for lack of browser support");this._domElement=t,this._parentDomElement=e,this._view=i,this._params={},this._perspective={},this.setPosition(n),this._parentDomElement.appendChild(this._domElement),this.setPerspective(r.perspective),this._visible=!0,this._position={x:0,y:0}}var r=t("minimal-event-emitter"),o=t("./support/Css"),s=t("./positionAbsolutely"),a=t("./util/dom").setTransform;r(n),n.prototype._destroy=function(){this._parentDomElement.removeChild(this._domElement),this._domElement=null,this._parentDomElement=null,this._params=null,this._view=null,this._position=null,this._visible=!1},n.prototype.domElement=function(){return this._domElement},n.prototype.position=function(){return this._params},n.prototype.setPosition=function(t){for(var e in t)this._params[e]=t[e];this._update()},n.prototype.perspective=function(){return this._perspective},n.prototype.setPerspective=function(t){for(var e in t)this._perspective[e]=t[e];this._update()},n.prototype.show=function(){this._visible||(this._visible=!0,this._update())},n.prototype.hide=function(){this._visible&&(this._visible=!1,this._update())},n.prototype._update=function(){var t,e,i=this._domElement,n=this._params,r=this._position,o=!1;if(this._visible){var s=this._view;this._perspective.radius?(o=!0,this._setEmbeddedPosition(s,n)):(s.coordinatesToScreen(n,r),t=r.x,e=r.y,null!=t&&null!=e&&(o=!0,this._setPosition(t,e)))}o?(i.style.display="block",i.style.position="absolute"):(i.style.display="none",i.style.position="")},n.prototype._setEmbeddedPosition=function(t,e){var i=t.coordinatesToPerspectiveTransform(e,this._perspective.radius,this._perspective.extraRotations);a(this._domElement,i)},n.prototype._setPosition=function(t,e){s(this._domElement,t,e)},e.exports=n},{"./positionAbsolutely":58,"./support/Css":80,"./util/dom":98,"minimal-event-emitter":13}],16:[function(t,e,i){"use strict";function n(t,e,i,n,r){r=r||{},this._parentDomElement=t,this._stage=e,this._view=i,this._renderLoop=n,this._rect=r.rect,this._hotspotContainerWrapper=document.createElement("div"),h(this._hotspotContainerWrapper),f(this._hotspotContainerWrapper,"none"),this._parentDomElement.appendChild(this._hotspotContainerWrapper),this._hotspotContainer=document.createElement("div"),h(this._hotspotContainer),f(this._hotspotContainer,"all"),this._hotspotContainerWrapper.appendChild(this._hotspotContainer),this._hotspots=[],this._visible=!0,this._supported=!0,this._isVisible=!0,this._positionAndSize={},this._hasRect=null,this._newPositionAndSize={},this._updateHandler=this._update.bind(this),this._renderLoop.addEventListener("afterRender",this._updateHandler)}var r=t("minimal-event-emitter"),o=t("./Hotspot"),s=t("./calcRect"),a=t("./positionAbsolutely"),l=t("./support/cssPointerEvents"),h=t("./util/dom").setAbsolute,u=t("./util/dom").setOverflowHidden,c=t("./util/dom").setOverflowVisible,p=t("./util/dom").setNullSize,d=t("./util/dom").setPixelSize,f=t("./util/dom").setWithVendorPrefix("pointer-events");r(n),n.prototype.destroy=function(){for(;this._hotspots.length;)this.destroyHotspot(this._hotspots[0]);this._parentDomElement.removeChild(this._hotspotContainerWrapper),this._renderLoop.removeEventListener("afterRender",this._updateHandler),this._parentDomElement=null,this._stage=null,this._view=null,this._renderLoop=null,this._rect=null},n.prototype.domElement=function(){return this._hotspotContainer},n.prototype.setRect=function(t){this._rect=t},n.prototype.rect=function(){return this._rect},n.prototype.createHotspot=function(t,e,i){e=e||{};var n=new o(t,this._hotspotContainer,this._view,e,i);return this._hotspots.push(n),n._update(),this.emit("hotspotsChange"),n},n.prototype.hasHotspot=function(t){return this._hotspots.indexOf(t)>=0},n.prototype.listHotspots=function(){return[].concat(this._hotspots)},n.prototype.destroyHotspot=function(t){var e=this._hotspots.indexOf(t);if(0>e)throw new Error("No such hotspot");this._hotspots.splice(e,1),t._destroy(),this.emit("hotspotsChange")},n.prototype.hide=function(){this._visible=!1,this._updateVisibility()},n.prototype.show=function(){this._visible=!0,this._updateVisibility()},n.prototype._updateVisibility=function(){var t=this._visible&&this._supported;t&&!this._isVisible?(this._hotspotContainerWrapper.style.display="block",this._isVisible=!0):!t&&this._isVisible&&(this._hotspotContainerWrapper.style.display="none",this._isVisible=!1)},n.prototype._update=function(){this._updatePositionAndSize();for(var t=0;t<this._hotspots.length;t++)this._hotspots[t]._update()},n.prototype._updatePositionAndSize=function(){this._rect?!l()&&this._hotspots.length>0?(console.warn("HotspotContainer: this browser does not support using effects.rect with hotspots. Hotspots will be hidden."),this._supported=!1):(s(this._stage.width(),this._stage.height(),this._rect,this._newPositionAndSize),this._setPositionAndSizeWithRect(this._newPositionAndSize),this._supported=!0):(this._setPositionAndSizeWithoutRect(),this._supported=!0),this._updateVisibility()},n.prototype._setPositionAndSizeWithRect=function(t){var e=this._hotspotContainerWrapper;this._hasRect!==!0&&u(e),this._hasRect===!0&&t.left===this._positionAndSize.left&&t.top===this._positionAndSize.top||a(e,t.left,t.top),this._hasRect===!0&&+t.width===this._positionAndSize.width&&t.height===this._positionAndSize.height||d(e,t.width,t.height),this._positionAndSize.left=t.left,this._positionAndSize.top=t.top,this._positionAndSize.width=t.width,this._positionAndSize.height=t.height,this._hasRect=!0},n.prototype._setPositionAndSizeWithoutRect=function(){this._hasRect!==!1&&(a(this._hotspotContainerWrapper,0,0),p(this._hotspotContainerWrapper),c(this._hotspotContainerWrapper),this._hasRect=!1)},e.exports=n},{"./Hotspot":15,"./calcRect":29,"./positionAbsolutely":58,"./support/cssPointerEvents":83,"./util/dom":98,"minimal-event-emitter":13}],17:[function(t,e,i){"use strict";function n(t,e,i,n,r,o){o=o||{};var s=this;this._stage=t,this._source=e,this._geometry=i,this._view=n,this._textureStore=r,this._effects=o.effects||{},this._fixedLevelIndex=null,this._viewChangeHandler=function(){s.emit("viewChange",s.view())},this._view.addEventListener("change",this._viewChangeHandler),this._textureStoreChangeHandler=function(){s.emit("textureStoreChange",s.textureStore())},this._textureStore.addEventListener("textureLoad",this._textureStoreChangeHandler),this._textureStore.addEventListener("textureError",this._textureStoreChangeHandler),this._textureStore.addEventListener("textureInvalid",this._textureStoreChangeHandler)}var r=t("minimal-event-emitter"),o=t("./util/extend");r(n),n.prototype.destroy=function(){this._view.removeEventListener("change",this._viewChangeHandler),this._textureStore.removeEventListener("textureLoad",this._textureStoreChangeHandler),this._textureStore.removeEventListener("textureError",this._textureStoreChangeHandler),this._textureStore.removeEventListener("textureInvalid",this._textureStoreChangeHandler),this._stage.removeEventListener("resize",this._handleStageResize),this._stage=null,this._source=null,this._geometry=null,this._view=null,this._textureStore=null,this._fixedLevelIndex=null,this._effects=null,this._viewChangeHandler=null,this._textureStoreChangeHandler=null},n.prototype.source=function(){return this._source},n.prototype.geometry=function(){return this._geometry},n.prototype.view=function(){return this._view},n.prototype.textureStore=function(){return this._textureStore},n.prototype.effects=function(){return this._effects},n.prototype.setView=function(t){this._view=t,this.emit("viewChange",this._view)},n.prototype.setEffects=function(t){this._effects=t,this.emit("effectsChange",this._effects)},n.prototype.mergeEffects=function(t){o(this._effects,t),this.emit("effectsChange",this._effects)},n.prototype.fixedLevel=function(){return this._fixedLevelIndex},n.prototype.setFixedLevel=function(t){if(t!==this._fixedLevelIndex){if(null!=t&&(t>=this._geometry.levelList.length||0>t))throw new Error("Level index out of range: "+t);this._fixedLevelIndex=t,this.emit("fixedLevelChange",this._fixedLevelIndex)}},n.prototype._selectLevel=function(){var t;return t=null!=this._fixedLevelIndex?this._geometry.levelList[this._fixedLevelIndex]:this._view.selectLevel(this._geometry.selectableLevelList)},n.prototype.visibleTiles=function(t){var e=this._selectLevel();return this._geometry.visibleTiles(this._view,e,t)},n.prototype.pinLevel=function(t){for(var e=this._geometry.levelList[t],i=this._geometry.levelTiles(e),n=0;n<i.length;n++)this._textureStore.pin(i[n])},n.prototype.unpinLevel=function(t){for(var e=this._geometry.levelList[t],i=this._geometry.levelTiles(e),n=0;n<i.length;n++)this._textureStore.unpin(i[n])},n.prototype.pinFirstLevel=function(){return this.pinLevel(0)},n.prototype.unpinFirstLevel=function(){return this.unpinLevel(0)},e.exports=n},{"./util/extend":99,"minimal-event-emitter":13}],18:[function(t,e,i){"use strict";function n(){this.constructor.super_.apply(this,arguments)}var r=t("./util/inherits");r(n,Error),e.exports=n},{"./util/inherits":101}],19:[function(t,e,i){"use strict";function n(t){var e=this;this._stage=t,this._running=!1,this._rendering=!1,this._requestHandle=null,this._boundLoop=this._loop.bind(this),this._renderInvalidHandler=function(){e._rendering||e.renderOnNextFrame()},this._stage.addEventListener("renderInvalid",this._renderInvalidHandler)}var r=t("minimal-event-emitter");r(n),n.prototype.destroy=function(){this.stop(),this._stage.removeEventListener("renderInvalid",this._renderInvalidHandler),this._stage=null,this._running=null,this._rendering=null,this._requestHandle=null,this._boundLoop=null},n.prototype.stage=function(){return this._stage},n.prototype.start=function(){this._running=!0,this.renderOnNextFrame()},n.prototype.stop=function(){this._requestHandle&&(window.cancelAnimationFrame(this._requestHandle),this._requestHandle=null),this._running=!1},n.prototype.renderOnNextFrame=function(){this._running&&!this._requestHandle&&(this._requestHandle=window.requestAnimationFrame(this._boundLoop))},n.prototype._loop=function(){if(!this._running)throw new Error("Render loop running while in stopped state");this._requestHandle=null,this._rendering=!0,this.emit("beforeRender"),this._rendering=!1,this._stage.render(),this.emit("afterRender")},e.exports=n},{"minimal-event-emitter":13}],20:[function(t,e,i){"use strict";function n(t,e){this._viewer=t,this._layer=e,this._view=e.view(),this._hotspotContainer=new o(t._controlContainer,t._stage,this._view,t._renderLoop,{rect:e.effects().rect}),this._movement=null,this._movementStartTime=null,this._movementStep=null,this._movementParams=null,this._movementCallback=null,this._updateMovementHandler=this._updateMovement.bind(this),this._updateHotspotContainerHandler=this._updateHotspotContainer.bind(this),this._viewer.addEventListener("sceneChange",this._updateHotspotContainerHandler),this._layer.addEventListener("effectsChange",this._updateHotspotContainerHandler),this._viewChangeHandler=this.emit.bind(this,"viewChange"),this._view.addEventListener("change",this._viewChangeHandler),this._updateHotspotContainer()}var r=t("minimal-event-emitter"),o=t("./HotspotContainer"),s=t("./util/clock"),a=t("./util/noop"),l=t("./util/type"),h=t("./util/defaults");r(n),n.prototype._destroy=function(){this._view.removeEventListener("change",this._viewChangeHandler),this._viewer.removeEventListener("sceneChange",this._updateHotspotContainerHandler),this._layer.removeEventListener("effectsChange",this._updateHotspotContainerHandler),this._movement&&this.stopMovement(),this._hotspotContainer.destroy(),this._movement=null,this._viewer=null,this._layer=null,this._view=null,this._hotspotContainer=null},n.prototype.hotspotContainer=function(){return this._hotspotContainer},n.prototype.layer=function(){return this._layer},n.prototype.view=function(){return this._view},n.prototype.viewer=function(){return this._viewer},n.prototype.visible=function(){return this._viewer.scene()===this},n.prototype.switchTo=function(t,e){return this._viewer.switchScene(this,t,e)},n.prototype.lookTo=function(t,e,i){if(e=e||{},i=i||a,"object"!==l(t))throw new Error("Target view parameters must be an object");var n=null!=e.transitionDuration?e.transitionDuration:1e3,r=null!=e.shortest?e.shortest:!0,o=this._view,s=o.parameters(),u={};h(u,t),h(u,s),r&&o.normalizeToClosest&&o.normalizeToClosest(u,u);var c=function(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)},p=function(){var t=!1;return function(e,i){if(i>=n&&t)return null;var r=Math.min(i/n,1);for(var o in e){var a=s[o],l=u[o];e[o]=a+c(r)*(l-a)}return t=i>=n,e}},d=this._viewer.controls().enabled();this._viewer.controls().disable(),this.startMovement(p,function(){d&&this._viewer.controls().enable(),i()})},n.prototype.startMovement=function(t,e){var i=this._viewer.renderLoop();this._movement&&this.stopMovement();var n=t();if("function"!=typeof n)throw new Error("Bad movement");this._movement=t,this._movementStep=n,this._movementStartTime=s(),this._movementParams={},this._movementCallback=e,i.addEventListener("beforeRender",this._updateMovementHandler),i.renderOnNextFrame()},n.prototype.stopMovement=function(){var t=this._viewer.renderLoop();this._movementCallback&&this._movementCallback(),t.removeEventListener("beforeRender",this._updateMovementHandler),this._movement=null,this._movementStep=null,this._movementStartTime=null,this._movementParams=null,this._movementCallback=null},n.prototype.movement=function(){return this._movement},n.prototype._updateMovement=function(){if(!this._movement)throw new Error("Should not call update");var t=this._viewer.renderLoop(),e=this._view,i=s()-this._movementStartTime,n=this._movementStep,r=this._movementParams;r=e.parameters(r),r=n(r,i),null==r?this.stopMovement():(e.setParameters(r),t.renderOnNextFrame())},n.prototype._updateHotspotContainer=function(){this._hotspotContainer.setRect(this._layer.effects().rect),this.visible()?this._hotspotContainer.show():this._hotspotContainer.hide()},e.exports=n},{"./HotspotContainer":16,"./util/clock":89,"./util/defaults":94,"./util/noop":103,"./util/type":111,"minimal-event-emitter":13}],21:[function(t,e,i){"use strict";function n(){}function r(t,e){var i=this;i._id=g++,i._store=t,i._tile=e,i._asset=null,i._texture=null,i._changeHandler=function(){t.emit("textureInvalid",e)};var r=t.source(),o=t.stage(),s=r.loadAsset.bind(r),a=o.createTexture.bind(o),l=p(c(s),a);f&&console.log("loading",i._id,i._tile),i._cancel=l(o,e,function(t,e,r,o){return i._cancel=null,t?(r&&r.destroy(),o&&o.destroy(),void(t instanceof n?(i._store.emit("textureCancel",i._tile),f&&console.log("cancel",i._id,i._tile)):(i._store.emit("textureError",i._tile,t),f&&console.log("error",i._id,i._tile)))):(i._texture=o,r.dynamic?(i._asset=r,r.addEventListener("change",i._changeHandler)):r.destroy(),i._store.emit("textureLoad",i._tile),void(f&&console.log("load",i._id,i._tile)))})}function o(t,e,i,n){n=u(n||{},y),this._source=e,this._stage=i;var r=t.TileClass;this._clientPhase=m,this._clientCounter=0,this._itemMap=new s(r.equals,r.hash),this._visible=new a(r.equals,r.hash),this._previouslyVisible=new l(r.equals,r.hash,n.previouslyVisibleCacheSize),this._pinMap=new s(r.equals,r.hash),this._newVisible=new a(r.equals,r.hash),this._noLongerVisible=[],this._visibleAgain=[],this._evicted=[]}var s=t("./collections/Map"),a=t("./collections/Set"),l=t("./collections/LruSet"),h=t("minimal-event-emitter"),u=t("./util/defaults"),c=t("./util/retry"),p=t("./util/chain"),d=t("./util/inherits"),f="undefined"!=typeof MARZIPANODEBUG&&MARZIPANODEBUG.textureStore,m="idle",v="start",_="end",y={previouslyVisibleCacheSize:32},g=0;d(n,Error),r.prototype.asset=function(){return this._asset},r.prototype.texture=function(){return this._texture},r.prototype.destroy=function(){var t=this,e=t._id,i=t._store,r=t._tile,o=t._asset,s=t._texture,a=t._cancel;return a?void a(new n("Texture load cancelled")):(o&&(o.removeEventListener("change",t._changeHandler),o.destroy()),s&&s.destroy(),i.emit("textureUnload",r),f&&console.log("unload",e,r),t._changeHandler=null,t._asset=null,t._texture=null,t._tile=null,t._store=null,void(t._id=null))},h(r),h(o),o.prototype.destroy=function(){this.clear(),this._source=null,this._stage=null,this._itemMap=null,this._visible=null,this._previouslyVisible=null,this._pinMap=null,this._newVisible=null,this._noLongerVisible=null,this._visibleAgain=null,this._evicted=null},o.prototype.stage=function(){return this._stage},o.prototype.source=function(){return this._source},o.prototype.clear=function(){var t=this;t._evicted.length=0,t._itemMap.each(function(e){t._evicted.push(e)}),t._evicted.forEach(function(e){t._unloadTile(e)}),t._itemMap.clear(),t._visible.clear(),t._previouslyVisible.clear(),t._pinMap.clear(),t._newVisible.clear(),t._noLongerVisible.length=0,t._visibleAgain.length=0,t._evicted.length=0},o.prototype.clearNotPinned=function(){var t=this;t._evicted.length=0,t._itemMap.each(function(e){t._pinMap.has(e)||t._evicted.push(e)}),t._evicted.forEach(function(e){t._unloadTile(e)}),t._visible.clear(),t._previouslyVisible.clear(),t._evicted.length=0},o.prototype.startFrame=function(){if(this._clientPhase!==m&&this._clientPhase!==v)throw new Error("TextureStore: startFrame called out of sequence");this._clientPhase=v,this._clientCounter++,this._newVisible.clear()},o.prototype.markTile=function(t){if(this._clientPhase!==v)throw new Error("TextureStore: markTile called out of sequence");var e=this._itemMap.get(t),i=e&&e.texture(),n=e&&e.asset();i&&n&&i.refresh(t,n),this._newVisible.add(t)},o.prototype.endFrame=function(){if(this._clientPhase!==v&&this._clientPhase!==_)throw new Error("TextureStore: endFrame called out of sequence");this._clientPhase=_,this._clientCounter--,this._clientCounter||(this._update(),this._clientPhase=m)},o.prototype._update=function(){var t=this;t._noLongerVisible.length=0,
t._visible.each(function(e){t._newVisible.has(e)||t._noLongerVisible.push(e)}),t._visibleAgain.length=0,t._newVisible.each(function(e){t._previouslyVisible.has(e)&&t._visibleAgain.push(e)}),t._visibleAgain.forEach(function(e){t._previouslyVisible.remove(e)}),t._evicted.length=0,t._noLongerVisible.forEach(function(e){var i=t._itemMap.get(e),n=i&&i.texture();if(n){var r=t._previouslyVisible.add(e);null!=r&&t._evicted.push(r)}else i&&t._unloadTile(e)}),t._evicted.forEach(function(e){t._pinMap.has(e)||t._unloadTile(e)}),t._newVisible.each(function(e){var i=t._itemMap.get(e);i||t._loadTile(e)});var e=t._visible;t._visible=t._newVisible,t._newVisible=e,t._noLongerVisible.length=0,t._visibleAgain.length=0,t._evicted.length=0},o.prototype._loadTile=function(t){if(this._itemMap.has(t))throw new Error("TextureStore: loading texture already in cache");var e=new r(this,t);this._itemMap.set(t,e)},o.prototype._unloadTile=function(t){var e=this._itemMap.del(t);if(!e)throw new Error("TextureStore: unloading texture not in cache");e.destroy()},o.prototype.asset=function(t){var e=this._itemMap.get(t);return e?e.asset():null},o.prototype.texture=function(t){var e=this._itemMap.get(t);return e?e.texture():null},o.prototype.pin=function(t){var e=(this._pinMap.get(t)||0)+1;return this._pinMap.set(t,e),this._itemMap.has(t)||this._loadTile(t),e},o.prototype.unpin=function(t){var e=this._pinMap.get(t);if(!e)throw new Error("TextureStore: unpin when not pinned");return e--,e>0?this._pinMap.set(t,e):(this._pinMap.del(t),this._visible.has(t)||this._previouslyVisible.has(t)||this._unloadTile(t)),e},o.prototype.query=function(t){var e=this._itemMap.get(t),i=this._pinMap.get(t)||0;return{visible:this._visible.has(t),previouslyVisible:this._previouslyVisible.has(t),hasAsset:null!=e&&null!=e.asset(),hasTexture:null!=e&&null!=e.texture(),pinned:0!==i,pinCount:i}},e.exports=o},{"./collections/LruSet":31,"./collections/Map":32,"./collections/Set":33,"./util/chain":87,"./util/defaults":94,"./util/inherits":101,"./util/retry":108,"minimal-event-emitter":13}],22:[function(t,e,i){"use strict";function n(t){t=o(t||{},a),this._duration=t.duration,this._startTime=null,this._handle=null,this._check=this._check.bind(this)}var r=t("minimal-event-emitter"),o=t("./util/defaults"),s=t("./util/clock"),a={duration:1/0};r(n),n.prototype.start=function(){this._startTime=s(),null==this._handle&&this._duration<1/0&&this._setup(this._duration)},n.prototype.started=function(){return null!=this._startTime},n.prototype.stop=function(){this._startTime=null,null!=this._handle&&(clearTimeout(this._handle),this._handle=null)},n.prototype.reset=function(){this.start()},n.prototype._setup=function(t){this._handle=setTimeout(this._check,t)},n.prototype._check=function(){var t=s(),e=t-this._startTime,i=this._duration-e;this._handle=null,0>=i?(this.emit("timeout"),this._startTime=null):1/0>i&&this._setup(i)},n.prototype.duration=function(){return this._duration},n.prototype.setDuration=function(t){this._duration=t,null!=this._startTime&&(null!=this._handle&&(clearTimeout(this._handle),this._handle=null),this._check())},e.exports=n},{"./util/clock":89,"./util/defaults":94,"minimal-event-emitter":13}],23:[function(t,e,i){"use strict";function n(t,e){e=e||{},this._domElement=t,_(t);var i;if(e.stageType){if(i=I[e.stageType],!i)throw new Error("Unknown stage type: "+e.stageType)}else{for(var n=0;n<E.length;n++)if(E[n].supported()){i=E[n];break}if(!i)throw new Error("None of the stage types are supported")}this._stage=new i(e.stage),v(this._stage),this._domElement.appendChild(this._stage.domElement()),this._controlContainer=document.createElement("div"),y(this._controlContainer),g(this._controlContainer);var r=document.createElement("div");y(r),g(r),x(r),this._controlContainer.appendChild(r),t.appendChild(this._controlContainer),this.updateSize(),this._updateSizeListener=this.updateSize.bind(this),window.addEventListener("resize",this._updateSizeListener),this._renderLoop=new s(this._stage),this._controls=new a,this._controlMethods=m(this._controls,this._controlContainer,e.controls),this._controls.attach(this._renderLoop),this._hammerManagerTouch=S.get(this._controlContainer,"touch"),this._hammerManagerMouse=S.get(this._controlContainer,"mouse"),e.cursors=e.cursors||{},this._dragCursor=new b(this._controls,"mouseViewDrag",t,e.cursors.drag),this._renderLoop.start(),this._scenes=[],this._scene=null,this._cancelCurrentTween=null,this._viewChangeHandler=this.emit.bind(this,"viewChange"),this._idleTimer=new c,this._idleTimer.start(),this._resetIdleTimerHandler=this._resetIdleTimer.bind(this),this.addEventListener("viewChange",this._resetIdleTimerHandler),this._enterIdleHandler=this._enterIdle.bind(this),this._idleTimer.addEventListener("timeout",this._enterIdleHandler),this._leaveIdleHandler=this._leaveIdle.bind(this),this._controls.addEventListener("active",this._leaveIdleHandler),this.addEventListener("sceneChange",this._leaveIdleHandler),this._idleMovement=null}function r(t,e,i){e.layer().mergeEffects({opacity:t}),e._hotspotContainer.domElement().style.opacity=t}var o=t("minimal-event-emitter"),s=t("./RenderLoop"),a=t("./controls/Controls"),l=t("./Layer"),h=t("./TextureStore"),u=t("./Scene"),c=t("./Timer"),p=t("./stages/WebGl"),d=t("./stages/Css"),f=t("./stages/Flash"),m=t("./controls/registerDefaultControls"),v=t("./renderers/registerDefaultRenderers"),_=t("./util/dom").setOverflowHidden,y=t("./util/dom").setAbsolute,g=t("./util/dom").setFullSize,x=t("./util/dom").setBlocking,M=t("./util/tween"),w=t("./util/noop"),b=t("./controls/DragCursor"),S=t("./controls/HammerGestures"),I={webgl:p,css:d,flash:f},E=[p,d,f];o(n),n.prototype.destroy=function(){window.removeEventListener("resize",this._updateSizeListener),this._updateSizeListener=null,this._scene&&this._scene.view().removeEventListener("change",this._viewChangeHandler),this._viewChangeHandler=null;for(var t in this._controlMethods)this._controlMethods[t].destroy();for(this._controlMethods=null;this._scenes.length;)this.destroyScene(this._scenes[0]);this._scenes=null,this._scene=null,this._domElement.removeChild(this._stage.domElement()),this._stage.destroy(),this._stage=null,this._renderLoop.destroy(),this._renderLoop=null,this._controls.destroy(),this._controls=null,this._cancelCurrentTween&&(this._cancelCurrentTween(),this._cancelCurrentTween=null),this._domElement=null,this._controlContainer=null},n.prototype.updateSize=function(){this._stage.updateSize()},n.prototype.stage=function(){return this._stage},n.prototype.renderLoop=function(){return this._renderLoop},n.prototype.controls=function(){return this._controls},n.prototype.domElement=function(){return this._domElement},n.prototype.createScene=function(t){t=t||{};var e=this._stage,i=t.source,n=t.geometry,r=t.view,o=new h(n,i,e,t.textureStore),s=new l(e,i,n,r,o,t.layerOpts);t.pinFirstLevel&&s.pinFirstLevel();var a=new u(this,s);return this._scenes.push(a),a},n.prototype._addLayer=function(t){t.pinFirstLevel(),this._stage.addLayer(t)},n.prototype._removeLayer=function(t){this._stage.hasLayer(t)&&(t.unpinFirstLevel(),this._stage.removeLayer(t)),t.textureStore().clearNotPinned()},n.prototype.destroyScene=function(t){var e=this._scenes.indexOf(t);if(0>e)throw new Error("No such scene in viewer");this._removeLayer(t._layer),this._scene===t&&(this._scene=null,this._cancelCurrentTween&&(this._cancelCurrentTween(),this._cancelCurrentTween=null)),this._scenes.splice(e,1);var i=t._layer,n=i.textureStore();t._destroy(),i.destroy(),n.destroy()},n.prototype.destroyAllScenes=function(){for(;this._scenes.length>0;)this.destroyScene(this._scenes[0])},n.prototype.hasScene=function(t){return this._scenes.indexOf(t)>=0},n.prototype.listScenes=function(){return[].concat(this._scenes)},n.prototype.scene=function(){return this._scene},n.prototype.view=function(){var t=this._scene;return t?t.layer().view():null},n.prototype.lookTo=function(t,e,i){var n=this._scene;n&&n.lookTo(t,e,i)},n.prototype.startMovement=function(t,e){var i=this._scene;i&&i.startMovement(t,e)},n.prototype.stopMovement=function(){var t=this._scene;t&&t.stopMovement()},n.prototype.setIdleMovement=function(t,e){this._idleTimer.setDuration(t),this._idleMovement=e},n.prototype.breakIdleMovement=function(){this._leaveIdle(),this._resetIdleTimer()},n.prototype._resetIdleTimer=function(){this._idleTimer.reset()},n.prototype._enterIdle=function(){var t=this._scene,e=this._idleMovement;t&&e&&t.startMovement(e)},n.prototype._leaveIdle=function(){var t=this._scene;t&&t.movement()===this._idleMovement&&t.stopMovement()};var D=1e3;n.prototype.switchScene=function(t,e,i){function n(e){u(e,t,a)}function o(){a&&c._removeLayer(a.layer()),c._cancelCurrentTween=null,i()}e=e||{},i=i||w;var s=this._stage,a=this._scene;if(a===t)return void i();if(this._scenes.indexOf(t)<0)throw new Error("No such scene in viewer");var l=s.listLayers();if(a&&a.layer()!==l[l.length-1])throw new Error("Stage not in sync with viewer");this._cancelCurrentTween&&(this._cancelCurrentTween(),this._cancelCurrentTween=null);var h=null!=e.transitionDuration?e.transitionDuration:D,u=null!=e.transitionUpdate?e.transitionUpdate:r,c=this;c._addLayer(t.layer()),this._cancelCurrentTween=M(h,n,o),this._scene=t,this.emit("sceneChange"),this.emit("viewChange"),a&&a.view().removeEventListener("change",this._viewChangeHandler),t.view().addEventListener("change",this._viewChangeHandler)},e.exports=n},{"./Layer":17,"./RenderLoop":19,"./Scene":20,"./TextureStore":21,"./Timer":22,"./controls/Controls":38,"./controls/DragCursor":40,"./controls/HammerGestures":43,"./controls/registerDefaultControls":50,"./renderers/registerDefaultRenderers":70,"./stages/Css":73,"./stages/Flash":74,"./stages/WebGl":77,"./util/dom":98,"./util/noop":103,"./util/tween":110,"minimal-event-emitter":13}],24:[function(t,e,i){"use strict";function n(t,e){e=e||{},this._opts=e,this._element=t,this._timestamp=1,this._lastUsedTime=null}var r=t("minimal-event-emitter");r(n),n.prototype.element=function(){return this._element},n.prototype.width=function(){return this._element.width},n.prototype.height=function(){return this._element.height},n.prototype.dynamic=!0,n.prototype.timestamp=function(){return this._timestamp},n.prototype.changed=function(){this._timestamp++,this.emit("change")},n.prototype.destroy=function(){this._opts.unload&&this._opts.unload()},e.exports=n},{"minimal-event-emitter":13}],25:[function(t,e,i){"use strict";function n(t,e){this._flashElement=t,this._imageId=e}n.prototype.element=function(){return this._imageId},n.prototype.timestamp=function(){return 0},n.prototype.dynamic=!1,n.prototype.destroy=function(){var t=this._flashElement,e=this._imageId;t.unloadImage(e),this._flashElement=null,this._imageId=null},e.exports=n},{}],26:[function(t,e,i){"use strict";function n(t){this._element=t}var r=t("../util/noop");n.prototype.element=function(){return this._element},n.prototype.width=function(){return this._element.width},n.prototype.height=function(){return this._element.height},n.prototype.timestamp=function(){return 0},n.prototype.dynamic=!1,n.prototype.destroy=r,e.exports=n},{"../util/noop":103}],27:[function(t,e,i){"use strict";function n(t){this._element=t}var r=t("../util/noop");n.prototype.element=function(){return this._element},n.prototype.width=function(){return this._element.naturalWidth},n.prototype.height=function(){return this._element.naturalHeight},n.prototype.timestamp=function(){return 0},n.prototype.dynamic=!1,n.prototype.destroy=r,e.exports=n},{"../util/noop":103}],28:[function(t,e,i){"use strict";function n(t){t=r(t||{},a);var e=t.yawSpeed,i=t.pitchSpeed,n=t.fovSpeed,o=t.yawAccel,s=t.pitchAccel,l=t.fovAccel,h=t.targetPitch,u=t.targetFov;return function(){var t,r,a,c,p=0,d=0,f=0,m=0,v=0,_=0,y=0;return function(g,x){if(t=(x-p)/1e3,v=Math.min(d+t*o,e),r=v*t,g.yaw=g.yaw+r,null!=h&&g.pitch!==h){var M=.5*f*f/s;_=Math.abs(h-g.pitch)>M?Math.min(f+t*s,i):Math.max(f-t*s,0),a=_*t,h<g.pitch&&(g.pitch=Math.max(h,g.pitch-a)),h>g.pitch&&(g.pitch=Math.min(h,g.pitch+a))}if(null!=u&&g.fov!==h){var w=.5*m*m/l;y=Math.abs(u-g.fov)>w?Math.min(m+t*l,n):Math.max(m-t*l,0),c=y*t,u<g.fov&&(g.fov=Math.max(u,g.fov-c)),u>g.fov&&(g.fov=Math.min(u,g.fov+c))}return p=x,d=v,f=_,m=y,g}}}var r=t("./util/defaults"),o=.1,s=.01,a={yawSpeed:o,pitchSpeed:o,fovSpeed:o,yawAccel:s,pitchAccel:s,fovAccel:s,targetPitch:0,targetFov:null};e.exports=n},{"./util/defaults":94}],29:[function(t,e,i){"use strict";function n(t,e,i,n){n=n||{};var r;r=null!=i&&null!=i.absoluteWidth?i.absoluteWidth:null!=i&&null!=i.relativeWidth?i.relativeWidth*t:t;var o;o=i&&null!=i.absoluteHeight?i.absoluteHeight:null!=i&&null!=i.relativeHeight?i.relativeHeight*e:e;var s;s=null!=i&&null!=i.absoluteX?i.absoluteX:null!=i&&null!=i.relativeX?i.relativeX*t:0;var a;return a=null!=i&&null!=i.absoluteY?i.absoluteY:null!=i&&null!=i.relativeY?i.relativeY*e:0,n.height=o,n.width=r,n.left=s,n.top=a,n.right=s+r,n.bottom=a+o,n.totalWidth=t,n.totalHeight=e,n}e.exports=n},{}],30:[function(t,e,i){"use strict";function n(t,e,i){if("function"!=typeof t)throw new Error("LruMap: bad equals function");if(this._equals=t,"function"!=typeof e)throw new Error("LruMap: bad hash function");if(this._hash=e,"number"!=typeof i||isNaN(i)||0>i)throw new Error("LruMap: bad maximum size");this._maxsize=i,this._keys=[],this._values=[],this._pivot=0}var r=t("../util/mod");n.prototype._modulus=function(){return this._maxsize>this._keys.length?this._keys.length+1:this._maxsize},n.prototype.get=function(t){for(var e=0;e<this._keys.length;e++){var i=this._keys[e];if(this._equals(t,i)){var n=this._values[e];return n}}return null},n.prototype.set=function(t,e){var i=null,n=!1;if(0===this._maxsize)return t;for(var o=0;o<this._keys.length;o++){var s=this._keys[o];if(this._equals(t,s)){for(var a=o,l=this._modulus();a!==this._pivot;){var h=r(a+1,l);this._keys[a]=this._keys[h],this._values[a]=this._values[h],a=h}n=!0;break}}return n||(i=this._pivot<this._keys.length?this._keys[this._pivot]:null),this._keys[this._pivot]=t,this._values[this._pivot]=e,this._pivot=r(this._pivot+1,this._modulus()),i},n.prototype.del=function(t){for(var e=0;e<this._keys.length;e++){var i=this._keys[e];if(this._equals(t,i)){for(var n=this._values[e],o=e;o<this._keys.length-1;o++)this._keys[o]=this._keys[o+1],this._values[o]=this._values[o+1];return this._keys.length=this._keys.length-1,this._values.length=this._values.length-1,e<this._pivot&&(this._pivot=r(this._pivot-1,this._modulus())),n}}return null},n.prototype.has=function(t){for(var e=0;e<this._keys.length;e++){var i=this._keys[e];if(this._equals(t,i))return!0}return!1},n.prototype.size=function(){return this._keys.length},n.prototype.clear=function(){this._keys.length=0,this._values.length=0,this._pivot=0},n.prototype.each=function(t){for(var e=0,i=0;i<this._keys.length;i++){var n=this._keys[i],r=this._values[i];t(n,r),e+=1}return e},e.exports=n},{"../util/mod":102}],31:[function(t,e,i){"use strict";function n(t,e,i){if("function"!=typeof t)throw new Error("LruSet: bad equals function");if(this._equals=t,"function"!=typeof e)throw new Error("LruSet: bad hash function");if(this._hash=e,"number"!=typeof i||isNaN(i)||0>i)throw new Error("LruSet: bad maximum size");this._maxsize=i,this._items=[],this._pivot=0}var r=t("../util/mod");n.prototype._modulus=function(){return this._maxsize>this._items.length?this._items.length+1:this._maxsize},n.prototype.add=function(t){var e=null,i=!1;if(0===this._maxsize)return t;for(var n=0;n<this._items.length;n++){var o=this._items[n];if(this._equals(t,o)){for(var s=n,a=this._modulus();s!==this._pivot;){var l=r(s+1,a);this._items[s]=this._items[l],s=l}i=!0;break}}return i||(e=this._pivot<this._items.length?this._items[this._pivot]:null),this._items[this._pivot]=t,this._pivot=r(this._pivot+1,this._modulus()),e},n.prototype.remove=function(t){for(var e=0;e<this._items.length;e++){var i=this._items[e];if(this._equals(t,i)){for(var n=e;n<this._items.length-1;n++)this._items[n]=this._items[n+1];return this._items.length=this._items.length-1,e<this._pivot&&(this._pivot=r(this._pivot-1,this._modulus())),i}}return null},n.prototype.has=function(t){for(var e=0;e<this._items.length;e++){var i=this._items[e];if(this._equals(t,i))return!0}return!1},n.prototype.size=function(){return this._items.length},n.prototype.clear=function(){this._items.length=0,this._pivot=0},n.prototype.each=function(t){for(var e=0,i=0;i<this._items.length;i++){var n=this._items[i];t(n),e+=1}return e},e.exports=n},{"../util/mod":102}],32:[function(t,e,i){"use strict";function n(t,e,i){if("function"!=typeof t)throw new Error("Map: bad equals function");if(this._equals=t,"function"!=typeof e)throw new Error("Map: bad hash function");if(this._hash=e,null!=i){if("number"!=typeof i||isNaN(i)||1>i)throw new Error("Map: bad number of buckets");this._nbuckets=i}else this._nbuckets=r;this._keyBuckets=[],this._valBuckets=[];for(var n=0;n<this._nbuckets;n++)this._keyBuckets.push([]),this._valBuckets.push([])}var r=32;n.prototype._hashmod=function(t){return this._hash(t)%this._nbuckets},n.prototype.get=function(t){for(var e=this._hashmod(t),i=this._keyBuckets[e],n=0;n<i.length;n++){var r=i[n];if(this._equals(t,r)){var o=this._valBuckets[e],s=o[n];return s}}return null},n.prototype.set=function(t,e){for(var i=this._hashmod(t),n=this._keyBuckets[i],r=this._valBuckets[i],o=0;o<n.length;o++){var s=n[o];if(this._equals(t,s)){var a=r[o];return n[o]=t,r[o]=e,a}}return n.push(t),r.push(e),null},n.prototype.del=function(t){for(var e=this._hashmod(t),i=this._keyBuckets[e],n=this._valBuckets[e],r=0;r<i.length;r++){var o=i[r];if(this._equals(t,o)){for(var s=n[r],a=r;a<i.length-1;a++)i[a]=i[a+1],n[a]=n[a+1];return i.length=i.length-1,n.length=n.length-1,s}}return null},n.prototype.has=function(t){for(var e=this._hashmod(t),i=this._keyBuckets[e],n=0;n<i.length;n++){var r=i[n];if(this._equals(t,r))return!0}return!1},n.prototype.size=function(){for(var t=0,e=0;e<this._nbuckets;e++){var i=this._keyBuckets[e];t+=i.length}return t},n.prototype.clear=function(){for(var t=0;t<this._nbuckets;t++){var e=this._keyBuckets[t],i=this._valBuckets[t];e.length=0,i.length=0}},n.prototype.each=function(t){for(var e=0,i=0;i<this._nbuckets;i++)for(var n=this._keyBuckets[i],r=this._valBuckets[i],o=0;o<n.length;o++){var s=n[o],a=r[o];t(s,a),e+=1}return e},e.exports=n},{}],33:[function(t,e,i){"use strict";function n(t,e,i){if("function"!=typeof t)throw new Error("Set: bad equals function");if(this._equals=t,"function"!=typeof e)throw new Error("Set: bad hash function");if(this._hash=e,null!=i){if("number"!=typeof i||isNaN(i)||1>i)throw new Error("Set: bad number of buckets");this._nbuckets=i}else this._nbuckets=r;this._buckets=[];for(var n=0;n<this._nbuckets;n++)this._buckets.push([])}var r=32;n.prototype._hashmod=function(t){return this._hash(t)%this._nbuckets},n.prototype.add=function(t){for(var e=this._hashmod(t),i=this._buckets[e],n=0;n<i.length;n++){var r=i[n];if(this._equals(t,r))return i[n]=t,r}return i.push(t),null},n.prototype.remove=function(t){for(var e=this._hashmod(t),i=this._buckets[e],n=0;n<i.length;n++){var r=i[n];if(this._equals(t,r)){for(var o=n;o<i.length-1;o++)i[o]=i[o+1];return i.length=i.length-1,r}}return null},n.prototype.has=function(t){for(var e=this._hashmod(t),i=this._buckets[e],n=0;n<i.length;n++){var r=i[n];if(this._equals(t,r))return!0}return!1},n.prototype.size=function(){for(var t=0,e=0;e<this._nbuckets;e++){var i=this._buckets[e];t+=i.length}return t},n.prototype.clear=function(){for(var t=0;t<this._nbuckets;t++){var e=this._buckets[t];e.length=0}},n.prototype.each=function(t){for(var e=0,i=0;i<this._nbuckets;i++)for(var n=this._buckets[i],r=0;r<n.length;r++){var o=n[r];t(o),e+=1}return e},e.exports=n},{}],34:[function(t,e,i){"use strict";function n(t){this._concurrency=t&&t.concurrency||1,this._paused=t&&!!t.paused||!1,this._pool=[];for(var e=0;e<this._concurrency;e++)this._pool.push(new r(t));this._next=0}var r=t("./WorkQueue"),o=t("../util/mod");n.prototype.length=function(){for(var t=0,e=0;e<this._pool.length;e++)t+=this._pool[e].length();return t},n.prototype.push=function(t,e){var i=this._next,n=this._pool[i].push(t,e);return this._next=o(this._next+1,this._concurrency),n},n.prototype.pause=function(){if(!this._paused){this._paused=!0;for(var t=0;t<this._concurrency;t++)this._pool[t].pause()}},n.prototype.resume=function(){if(this._paused){this._paused=!1;for(var t=0;t<this._concurrency;t++)this._pool[t].resume()}},e.exports=n},{"../util/mod":102,"./WorkQueue":35}],35:[function(t,e,i){"use strict";function n(t,e){this.fn=t,this.cb=e,this.cfn=null}function r(t){this._queue=[],this._delay=t&&t.delay||0,this._paused=t&&!!t.paused||!1,this._currentTask=null,this._lastFinished=null}var o=t("../util/clock");r.prototype.length=function(){return this._queue.length},r.prototype.push=function(t,e){var i=new n(t,e),r=this._cancel.bind(this,i);return this._queue.push(i),this._next(),r},r.prototype.pause=function(){this._paused||(this._paused=!0)},r.prototype.resume=function(){this._paused&&(this._paused=!1,this._next())},r.prototype._start=function(t){if(this._currentTask)throw new Error("WorkQueue: called start while running task");this._currentTask=t;var e=this._finish.bind(this,t);if(t.cfn=t.fn(e),"function"!=typeof t.cfn)throw new Error("WorkQueue: function is not cancellable")},r.prototype._finish=function(t){var e=Array.prototype.slice.call(arguments,1);if(this._currentTask!==t)throw new Error("WorkQueue: called finish on wrong task");t.cb.apply(null,e),this._currentTask=null,this._lastFinished=o(),this._next()},r.prototype._cancel=function(t){var e=Array.prototype.slice.call(arguments,1);if(this._currentTask===t)t.cfn.apply(null,e);else{var i=this._queue.indexOf(t);i>=0&&(this._queue.splice(i,1),t.cb.apply(null,e))}},r.prototype._next=function(){if(!this._paused&&this._queue.length&&!this._currentTask){if(null!=this._lastFinished){var t=o()-this._lastFinished,e=this._delay-t;if(e>0)return void setTimeout(this._next.bind(this),e)}var i=this._queue.shift();this._start(i)}},e.exports=r},{"../util/clock":89}],36:[function(t,e,i){"use strict";function n(t){var e=t||{};return e.colorOffset=e.colorOffset||a.create(),e.colorMatrix=e.colorMatrix||l.create(),e}function r(t,e,i){o(i,t,e.colorMatrix),a.add(i,i,e.colorOffset)}function o(t,e,i){var n=e[0],r=e[1],o=e[2],s=e[3];return t[0]=i[0]*n+i[1]*r+i[2]*o+i[3]*s,t[1]=i[4]*n+i[5]*r+i[6]*o+i[7]*s,t[2]=i[8]*n+i[9]*r+i[10]*o+i[11]*s,t[3]=i[12]*n+i[13]*r+i[14]*o+i[15]*s,t}function s(t,e){for(var i=t.width,n=t.height,o=t.data,s=0;i*n>s;s++)a.set(h,o[4*s+0]/255,o[4*s+1]/255,o[4*s+2]/255,o[4*s+3]/255),r(h,e,h),o[4*s+0]=255*h[0],o[4*s+1]=255*h[1],o[4*s+2]=255*h[2],o[4*s+3]=255*h[3]}var a=t("gl-matrix/src/gl-matrix/vec4"),l=t("gl-matrix/src/gl-matrix/mat4"),h=a.create();e.exports={identity:n,applyToPixel:r,applyToImageData:s}},{"gl-matrix/src/gl-matrix/mat4":7,"gl-matrix/src/gl-matrix/vec4":11}],37:[function(t,e,i){"use strict";function n(t){t=t||{},this._methods=[],this._parameters=["x","y","axisScaledX","axisScaledY","zoom","yaw","pitch","roll"],this._clock=t.clock||s,this._composedOffsets={},this._composeReturn={offsets:this._composedOffsets,changing:null}}var r=t("minimal-event-emitter"),o=t("./Dynamics"),s=t("../util/clock");r(n),n.prototype.add=function(t){if(!this.has(t)){var e={};this._parameters.forEach(function(t){e[t]={dynamics:new o,time:null}});var i=this._updateDynamics.bind(this,e),n={instance:t,dynamics:e,parameterDynamicsHandler:i};t.addEventListener("parameterDynamics",i),this._methods.push(n)}},n.prototype.remove=function(t){var e=this._indexOfInstance(t);if(e>=0){var i=this._methods.splice(e,1)[0];i.instance.removeEventListener("parameterDynamics",i.parameterDynamicsHandler)}},n.prototype.has=function(t){return this._indexOfInstance(t)>=0},n.prototype._indexOfInstance=function(t){for(var e=0;e<this._methods.length;e++)if(this._methods[e].instance===t)return e;return-1},n.prototype.list=function(){for(var t=[],e=0;e<this._methods.length;e++)t.push(this._methods[e].instance);return t},n.prototype._updateDynamics=function(t,e,i,n){var r=t[i];if(!r)throw new Error("Unknown control parameter "+i);var o=this._clock();r.dynamics.update(n,(o-r.time)/1e3),r.time=o,this.emit("change")},n.prototype._resetComposedOffsets=function(){for(var t=0;t<this._parameters.length;t++)this._composedOffsets[this._parameters[t]]=0},n.prototype.offsets=function(){var t,e=!1,i=this._clock();this._resetComposedOffsets();for(var n=0;n<this._methods.length;n++)for(var r=this._methods[n].dynamics,o=0;o<this._parameters.length;o++){t=this._parameters[o];var s=r[t],a=s.dynamics;null!=a.offset&&(this._composedOffsets[t]+=a.offset,a.offset=null);var l=(i-s.time)/1e3,h=a.offsetFromVelocity(l);h&&(this._composedOffsets[t]+=h);var u=a.velocityAfter(l);a.velocity=u,u&&(e=!0),s.time=i}return this._composeReturn.changing=e,this._composeReturn},n.prototype.destroy=function(){for(var t=this.list(),e=0;e<t.length;e++)this.remove(t[e]);this._methods=null},e.exports=n},{"../util/clock":89,"./Dynamics":41,"minimal-event-emitter":13}],38:[function(t,e,i){"use strict";function n(t){t=t||{},this._methods={},this._methodGroups={},this._composer=new r,this._enabled=t&&t.enabled?!!t.enabled:!0,this._activeCount=0,this._attachedRenderLoop=null}var r=t("./Composer"),o=t("minimal-event-emitter"),s="undefined"!=typeof MARZIPANODEBUG&&MARZIPANODEBUG.controls;o(n),n.prototype.methods=function(){var t={};for(var e in this._methods)t[e]=this._methods[e];return t},n.prototype.method=function(t){return this._methods[t]},n.prototype.registerMethod=function(t,e,i){if(this._methods[t])throw new Error("Control method already registered with id "+t);this._methods[t]={instance:e,enabled:!1,active:!1,activeHandler:this._handleActive.bind(this,t),inactiveHandler:this._handleInactive.bind(this,t)},i&&this.enableMethod(t,e)},n.prototype.unregisterMethod=function(t){var e=this._methods[t];if(!e)throw new Error("No control method registered with id "+t);e.enabled&&this.disableMethod(t),delete this._methods[t]},n.prototype.enableMethod=function(t){var e=this._methods[t];if(!e)throw new Error("No control method registered with id "+t);e.enabled||(e.enabled=!0,e.active&&this._incrementActiveCount(),this._listen(t),this._updateComposer(),this.emit("methodEnabled",t))},n.prototype.disableMethod=function(t){var e=this._methods[t];if(!e)throw new Error("No control method registered with id "+t);e.enabled&&(e.enabled=!1,e.active&&this._decrementActiveCount(),this._unlisten(t),this._updateComposer(),this.emit("methodDisabled",t))},n.prototype.addMethodGroup=function(t,e){this._methodGroups[t]=e},n.prototype.removeMethodGroup=function(t){delete this._methodGroups[t]},n.prototype.methodGroups=function(){var t={};for(var e in this._methodGroups)t[e]=this._methodGroups[e];return t},n.prototype.enableMethodGroup=function(t){var e=this;e._methodGroups[t].forEach(function(t){e.enableMethod(t)})},n.prototype.disableMethodGroup=function(t){var e=this;e._methodGroups[t].forEach(function(t){e.disableMethod(t)})},n.prototype.enabled=function(){return this._enabled},n.prototype.enable=function(){this._enabled=!0,this._activeCount>0&&this.emit("active"),this.emit("enabled"),this._updateComposer()},n.prototype.disable=function(){this._enabled=!1,this._activeCount>0&&this.emit("inactive"),this.emit("disabled"),this._updateComposer()},n.prototype.attach=function(t){this._attachedRenderLoop&&this.detach(),this._attachedRenderLoop=t,this._beforeRenderHandler=this._updateViewsWithControls.bind(this),this._changeHandler=t.renderOnNextFrame.bind(t),this._attachedRenderLoop.addEventListener("beforeRender",this._beforeRenderHandler),this._composer.addEventListener("change",this._changeHandler)},n.prototype.detach=function(){this._attachedRenderLoop&&(this._attachedRenderLoop.removeEventListener("beforeRender",this._beforeRenderHandler),this._composer.removeEventListener("change",this._changeHandler),this._beforeRenderHandler=null,this._changeHandler=null,this._attachedRenderLoop=null)},n.prototype.attached=function(){return null!=this._attachedRenderLoop},n.prototype._listen=function(t){var e=this._methods[t];if(!e)throw new Error("Bad method id");e.instance.addEventListener("active",e.activeHandler),e.instance.addEventListener("inactive",e.inactiveHandler)},n.prototype._unlisten=function(t){var e=this._methods[t];if(!e)throw new Error("Bad method id");e.instance.removeEventListener("active",e.activeHandler),e.instance.removeEventListener("inactive",e.inactiveHandler)},n.prototype._handleActive=function(t){var e=this._methods[t];if(!e)throw new Error("Bad method id");if(!e.enabled)throw new Error("Should not receive event from disabled control method");e.active||(e.active=!0,this._incrementActiveCount())},n.prototype._handleInactive=function(t){var e=this._methods[t];if(!e)throw new Error("Bad method id");if(!e.enabled)throw new Error("Should not receive event from disabled control method");e.active&&(e.active=!1,this._decrementActiveCount())},n.prototype._incrementActiveCount=function(){this._activeCount++,s&&this._checkActiveCount(),this._enabled&&1===this._activeCount&&this.emit("active")},n.prototype._decrementActiveCount=function(){this._activeCount--,s&&this._checkActiveCount(),this._enabled&&0===this._activeCount&&this.emit("inactive")},n.prototype._checkActiveCount=function(){var t=0;for(var e in this._methods){var i=this._methods[e];i.enabled&&i.active&&t++}if(t!=this._activeCount)throw new Error("Bad control state")},n.prototype._updateComposer=function(){var t=this._composer;for(var e in this._methods){var i=this._methods[e],n=this._enabled&&i.enabled;n&&!t.has(i.instance)&&t.add(i.instance),!n&&t.has(i.instance)&&t.remove(i.instance)}},n.prototype._updateViewsWithControls=function(){var t=this._composer.offsets();t.changing&&this._attachedRenderLoop.renderOnNextFrame();for(var e=this._attachedRenderLoop.stage().listLayers(),i=0;i<e.length;i++)e[i].view().updateWithControlParameters(t.offsets)},n.prototype.destroy=function(){this.detach(),this._composer.destroy(),this._methods=null},e.exports=n},{"./Composer":37,"minimal-event-emitter":13}],39:[function(t,e,i){"use strict";function n(t,e,i){this._element=t,this._opts=s(i||{},h),this._startEvent=null,this._lastEvent=null,this._active=!1,this._dynamics={x:new r,y:new r},this._hammer=o.get(t,e),this._hammer.on("hammer.input",this._handleHammerEvent.bind(this)),this._hammer.on("panstart",this._handleStart.bind(this)),this._hammer.on("panmove",this._handleMove.bind(this)),this._hammer.on("panend",this._handleEnd.bind(this)),this._hammer.on("pancancel",this._handleEnd.bind(this))}var r=t("./Dynamics"),o=t("./HammerGestures"),s=t("../util/defaults"),a=t("minimal-event-emitter"),l=t("./util").maxFriction,h={friction:6,maxFrictionTime:.3},u="undefined"!=typeof MARZIPANODEBUG&&MARZIPANODEBUG.controls;a(n),n.prototype.destroy=function(){this._hammer.release(),this._element=null,this._opts=null,this._startEvent=null,this._lastEvent=null,this._active=null,this._dynamics=null,this._hammer=null},n.prototype._handleHammerEvent=function(t){if(t.isFirst){if(u&&this._active)throw new Error("DragControlMethod active detected when already active");this._active=!0,this.emit("active")}if(t.isFinal){if(u&&!this._active)throw new Error("DragControlMethod inactive detected when already inactive");this._active=!1,this.emit("inactive")}},n.prototype._handleStart=function(t){t.preventDefault(),this._startEvent=t},n.prototype._handleMove=function(t){t.preventDefault(),this._startEvent&&(this._updateDynamicsMove(t),this.emit("parameterDynamics","axisScaledX",this._dynamics.x),this.emit("parameterDynamics","axisScaledY",this._dynamics.y))},n.prototype._handleEnd=function(t){t.preventDefault(),this._startEvent&&(this._updateDynamicsRelease(t),this.emit("parameterDynamics","axisScaledX",this._dynamics.x),this.emit("parameterDynamics","axisScaledY",this._dynamics.y)),this._startEvent=!1,this._lastEvent=!1},n.prototype._updateDynamicsMove=function(t){var e=t.deltaX,i=t.deltaY,n=this._lastEvent||this._startEvent;
n&&(e-=n.deltaX,i-=n.deltaY);var r=this._element.getBoundingClientRect(),o=r.right-r.left,s=r.bottom-r.top;e/=o,i/=s,this._dynamics.x.reset(),this._dynamics.y.reset(),this._dynamics.x.offset=-e,this._dynamics.y.offset=-i,this._lastEvent=t};var c=[null,null];n.prototype._updateDynamicsRelease=function(t){var e=this._element.getBoundingClientRect(),i=e.right-e.left,n=e.bottom-e.top,r=1e3*t.velocityX/i,o=1e3*t.velocityY/n;this._dynamics.x.reset(),this._dynamics.y.reset(),this._dynamics.x.velocity=r,this._dynamics.y.velocity=o,l(this._opts.friction,this._dynamics.x.velocity,this._dynamics.y.velocity,this._opts.maxFrictionTime,c),this._dynamics.x.friction=c[0],this._dynamics.y.friction=c[1]},e.exports=n},{"../util/defaults":94,"./Dynamics":41,"./HammerGestures":43,"./util":51,"minimal-event-emitter":13}],40:[function(t,e,i){"use strict";function n(t,e,i,n){n=n||{},n.active=["move"],n.inactive=["default"],n.disabled=[null],this._controls=t,this._id=e,this._attached=!1,this._setActiveCursor=r.bind(null,i,n.active),this._setInactiveCursor=r.bind(null,i,n.inactive),this._setDisabledCursor=r.bind(null,i,n.disabled),t.method(e).enabled&&this._attachCursor(t.method(e)),this._enableChangeHandler=this._updateAttach.bind(this),t.addEventListener("methodEnabled",this._enableChangeHandler),t.addEventListener("methodDisabled",this._enableChangeHandler),t.addEventListener("enabled",this._enableChangeHandler),t.addEventListener("disabled",this._enableChangeHandler)}function r(t,e){e.forEach(function(e){t.style.cursor=e})}n.prototype.destroy=function(){this._detachCursor(this._controls.method(this._id)),this._controls.removeEventListener("methodEnabled",this._enableChangeHandler),this._controls.removeEventListener("methodDisabled",this._enableChangeHandler),this._controls.removeEventListener("enabled",this._enableChangeHandler),this._controls.removeEventListener("disabled",this._enableChangeHandler)},n.prototype._updateAttach=function(){var t=this._controls,e=this._id;t.enabled()&&t.method(e).enabled?this._attachCursor(t.method(e)):this._detachCursor(t.method(e))},n.prototype._attachCursor=function(t){this._attached||(t.instance.addEventListener("active",this._setActiveCursor),t.instance.addEventListener("inactive",this._setInactiveCursor),t.active?this._setActiveCursor():this._setInactiveCursor(),this._attached=!0)},n.prototype._detachCursor=function(t){this._attached&&(t.instance.removeEventListener("active",this._setActiveCursor),t.instance.removeEventListener("inactive",this._setInactiveCursor),this._setDisabledCursor(),this._attached=!1)},e.exports=n},{}],41:[function(t,e,i){"use strict";function n(){this.velocity=null,this.friction=null,this.offset=null}function r(t,e){return 0>t?Math.min(0,t+e):t>0?Math.max(0,t-e):0}n.equals=function(t,e){return t.velocity===e.velocity&&t.friction===e.friction&&t.offset===e.offset},n.prototype.equals=function(t){return n.equals(this,t)},n.prototype.update=function(t,e){t.offset&&(this.offset=this.offset||0,this.offset+=t.offset);var i=this.offsetFromVelocity(e);i&&(this.offset=this.offset||0,this.offset+=i),this.velocity=t.velocity,this.friction=t.friction},n.prototype.reset=function(){this.velocity=null,this.friction=null,this.offset=null},n.prototype.velocityAfter=function(t){return this.velocity?this.friction?r(this.velocity,this.friction*t):this.velocity:null},n.prototype.offsetFromVelocity=function(t){t=Math.min(t,this.nullVelocityTime());var e=this.velocityAfter(t),i=(this.velocity+e)/2;return i*t},n.prototype.nullVelocityTime=function(){return null==this.velocity?0:this.velocity&&!this.friction?1/0:Math.abs(this.velocity/this.friction)},e.exports=n},{}],42:[function(t,e,i){"use strict";function n(t,e,i,n){if(!t)throw new Error("ElementPressControlMethod: element must be defined");if(!e)throw new Error("ElementPressControlMethod: parameter must be defined");if(!i)throw new Error("ElementPressControlMethod: velocity must be defined");if(!n)throw new Error("ElementPressControlMethod: friction must be defined");this._element=t,this._pressHandler=this._handlePress.bind(this),this._releaseHandler=this._handleRelease.bind(this),t.addEventListener("mousedown",this._pressHandler),t.addEventListener("mouseup",this._releaseHandler),t.addEventListener("mouseleave",this._releaseHandler),t.addEventListener("touchstart",this._pressHandler),t.addEventListener("touchmove",this._releaseHandler),t.addEventListener("touchend",this._releaseHandler),this._parameter=e,this._velocity=i,this._friction=n,this._dynamics=new r,this._pressing=!1}var r=t("./Dynamics"),o=t("minimal-event-emitter");o(n),n.prototype.destroy=function(){this._element.removeEventListener("mousedown",this._pressHandler),this._element.removeEventListener("mouseup",this._releaseHandler),this._element.removeEventListener("mouseleave",this._releaseHandler),this._element.removeEventListener("touchstart",this._pressHandler),this._element.removeEventListener("touchmove",this._releaseHandler),this._element.removeEventListener("touchend",this._releaseHandler)},n.prototype._handlePress=function(){this._pressing=!0,this._dynamics.velocity=this._velocity,this._dynamics.friction=0,this.emit("parameterDynamics",this._parameter,this._dynamics),this.emit("active")},n.prototype._handleRelease=function(){this._pressing&&(this._dynamics.friction=this._friction,this.emit("parameterDynamics",this._parameter,this._dynamics),this.emit("inactive")),this._pressing=!1},e.exports=n},{"./Dynamics":41,"minimal-event-emitter":13}],43:[function(t,e,i){"use strict";function n(){this._managers=new l(r,o)}function r(t,e){return t===e}function o(t){for(var e=t.id||t.toString();e.length<5;)e+="0";return h(e.charCodeAt(0),e.charCodeAt(1),e.charCodeAt(2),e.charCodeAt(3),e.charCodeAt(4))}function s(t,e,i,n){this._manager=e,this._element=i,this._type=n,this._hammerGestures=t,this._eventHandlers=[]}var a=t("hammerjs"),l=t("../collections/Map"),h=t("../util/hash"),u=t("bowser");n.prototype.get=function(t,e){this._managers.has(t)||this._managers.set(t,{});var i=this._managers.get(t);i[e]||(i[e]=this._createManager(t,e));var n=i[e];return n.refs+=1,new s(this,n.manager,t,e)},n.prototype._createManager=function(t,e){var i=new a.Manager(t);return"mouse"===e?i.add(new a.Pan({direction:a.DIRECTION_ALL,threshold:0})):"touch"!==e&&"pen"!==e&&"kinect"!==e||(i.add(new a.Pan({direction:a.DIRECTION_ALL,threshold:20,pointers:1})),u.msie&&parseFloat(u.version)<10||i.add(new a.Pinch)),{manager:i,refs:0}},n.prototype._releaseHandle=function(t,e){var i=this._managers.get(t)[e];i.refs-=1,i.refs<=0&&(i.manager.destroy(),this._managers.get(t)[e]=null)},s.prototype.on=function(t,e){var i=this._type,n=function(t){i===t.pointerType&&e(t)};this._eventHandlers.push({events:t,handler:n}),this._manager.on(t,n)},s.prototype.release=function(){for(var t=0;t<this._eventHandlers.length;t++){var e=this._eventHandlers[t];this._manager.off(e.events,e.handler)}this._hammerGestures._releaseHandle(this._element,this._type),this._manager=null,this._element=null,this._type=null,this._hammerGestures=null},s.prototype.manager=function(){return this._manager},e.exports=new n},{"../collections/Map":32,"../util/hash":100,bowser:1,hammerjs:12}],44:[function(t,e,i){"use strict";function n(t,e,i,n,o){if(!t)throw new Error("KeyControlMethod: keyCode must be defined");if(!e)throw new Error("KeyControlMethod: parameter must be defined");if(!i)throw new Error("KeyControlMethod: velocity must be defined");if(!n)throw new Error("KeyControlMethod: friction must be defined");o=o||document,this._keyCode=t,this._parameter=e,this._velocity=i,this._friction=n,this._element=o,this._keydownHandler=this._handlePress.bind(this),this._keyupHandler=this._handleRelease.bind(this),this._blurHandler=this._handleBlur.bind(this),this._element.addEventListener("keydown",this._keydownHandler),this._element.addEventListener("keyup",this._keyupHandler),window.addEventListener("blur",this._blurHandler),this._dynamics=new r,this._pressing=!1}var r=t("./Dynamics"),o=t("minimal-event-emitter");o(n),n.prototype.destroy=function(){this._element.addEventListener("keydown",this._keydownHandler),this._element.addEventListener("keyup",this._keyupHandler),window.addEventListener("blur",this._blurHandler)},n.prototype._handlePress=function(t){t.keyCode===this._keyCode&&(this._pressing=!0,this._dynamics.velocity=this._velocity,this._dynamics.friction=0,this.emit("parameterDynamics",this._parameter,this._dynamics),this.emit("active"))},n.prototype._handleRelease=function(t){t.keyCode===this._keyCode&&(this._pressing&&(this._dynamics.friction=this._friction,this.emit("parameterDynamics",this._parameter,this._dynamics),this.emit("inactive")),this._pressing=!1)},n.prototype._handleBlur=function(){this._dynamics.velocity=0,this.emit("parameterDynamics",this._parameter,this._dynamics),this.emit("inactive"),this._pressing=!1},e.exports=n},{"./Dynamics":41,"minimal-event-emitter":13}],45:[function(t,e,i){"use strict";function n(t,e,i){this._hammer=o.get(t,e),this._lastEvent=null,this._active=!1,this._dynamics=new r,this._hammer.on("pinchstart",this._handleStart.bind(this)),this._hammer.on("pinch",this._handleEvent.bind(this)),this._hammer.on("pinchend",this._handleEnd.bind(this)),this._hammer.on("pinchcancel",this._handleEnd.bind(this))}var r=t("./Dynamics"),o=t("./HammerGestures"),s=t("minimal-event-emitter");s(n),n.prototype.destroy=function(){this._hammer.release(),this._hammer=null,this._lastEvent=null,this._active=null,this._dynamics=null},n.prototype._handleStart=function(){this._active||(this._active=!0,this.emit("active"))},n.prototype._handleEnd=function(){this._lastEvent=null,this._active&&(this._active=!1,this.emit("inactive"))},n.prototype._handleEvent=function(t){var e=t.scale;this._lastEvent&&(e/=this._lastEvent.scale),this._dynamics.offset=-1*(e-1),this.emit("parameterDynamics","zoom",this._dynamics),this._lastEvent=t},e.exports=n},{"./Dynamics":41,"./HammerGestures":43,"minimal-event-emitter":13}],46:[function(t,e,i){"use strict";function n(t,e,i){this._element=t,this._opts=s(i||{},h),this._active=!1,this._hammer=o.get(t,e),this._dynamics={x:new r,y:new r},this._hammer.on("panstart",this._handleStart.bind(this)),this._hammer.on("panmove",this._handleMove.bind(this)),this._hammer.on("panend",this._handleRelease.bind(this)),this._hammer.on("pancancel",this._handleRelease.bind(this))}var r=t("./Dynamics"),o=t("./HammerGestures"),s=t("../util/defaults"),a=t("minimal-event-emitter"),l=t("./util").maxFriction,h={speed:8,friction:6,maxFrictionTime:.3};a(n),n.prototype.destroy=function(){this._hammer.release(),this._hammer=null,this._element=null,this._opts=null,this._active=null,this._dynamics=null},n.prototype._handleStart=function(t){t.preventDefault(),this._active||(this._active=!0,this.emit("active"))},n.prototype._handleMove=function(t){t.preventDefault(),this._updateDynamics(t,!1)},n.prototype._handleRelease=function(t){t.preventDefault(),this._updateDynamics(t,!0),this._active&&(this._active=!1,this.emit("inactive"))};var u=[null,null];n.prototype._updateDynamics=function(t,e){var i=this._element.getBoundingClientRect(),n=i.right-i.left,r=i.bottom-i.top,o=Math.max(n,r),s=t.deltaX/o*this._opts.speed,a=t.deltaY/o*this._opts.speed;this._dynamics.x.reset(),this._dynamics.y.reset(),this._dynamics.x.velocity=s,this._dynamics.y.velocity=a,e&&(l(this._opts.friction,this._dynamics.x.velocity,this._dynamics.y.velocity,this._opts.maxFrictionTime,u),this._dynamics.x.friction=u[0],this._dynamics.y.friction=u[1]),this.emit("parameterDynamics","x",this._dynamics.x),this.emit("parameterDynamics","y",this._dynamics.y)},e.exports=n},{"../util/defaults":94,"./Dynamics":41,"./HammerGestures":43,"./util":51,"minimal-event-emitter":13}],47:[function(t,e,i){"use strict";function n(t,e){this._opts=a(e||{},h),this._dynamics=new o,this._eventList=[];var i=this._opts.frictionTime?this.withSmoothing:this.withoutSmoothing;this._wheelListener=new s(t,i.bind(this))}function r(t){var e=1==t.deltaMode?20:1;return t.deltaY*e}var o=t("./Dynamics"),s=t("./WheelListener"),a=t("../util/defaults"),l=t("minimal-event-emitter"),h={frictionTime:.2,zoomDelta:.001};l(n),n.prototype.destroy=function(){this._wheelListener.remove(),this._opts=null,this._dynamics=null,this._eventList=null},n.prototype.withoutSmoothing=function(t){this._dynamics.offset=r(t)*this._opts.zoomDelta,this.emit("parameterDynamics","zoom",this._dynamics),t.preventDefault(),this.emit("active"),this.emit("inactive")},n.prototype.withSmoothing=function(t){var e=t.timeStamp;for(this._eventList.push(t);this._eventList[0].timeStamp<e-1e3*this._opts.frictionTime;)this._eventList.shift(0);for(var i=0,n=0;n<this._eventList.length;n++){var o=r(this._eventList[n])*this._opts.zoomDelta;i+=o/this._opts.frictionTime}this._dynamics.velocity=i,this._dynamics.friction=Math.abs(i)/this._opts.frictionTime,this.emit("parameterDynamics","zoom",this._dynamics),t.preventDefault(),this.emit("active"),this.emit("inactive")},e.exports=n},{"../util/defaults":94,"./Dynamics":41,"./WheelListener":49,"minimal-event-emitter":13}],48:[function(t,e,i){"use strict";function n(t){if(!t)throw new Error("VelocityControlMethod: parameter must be defined");this._parameter=t,this._dynamics=new r}var r=t("./Dynamics"),o=(t("../util/defaults"),t("minimal-event-emitter"));o(n),n.prototype.destroy=function(){},n.prototype.setVelocity=function(t){this._dynamics.velocity=t,this.emit("parameterDynamics",this._parameter,this._dynamics)},n.prototype.setFriction=function(t){this._dynamics.friction=t,this.emit("parameterDynamics",this._parameter,this._dynamics)},e.exports=n},{"../util/defaults":94,"./Dynamics":41,"minimal-event-emitter":13}],49:[function(t,e,i){"use strict";function n(){return"onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":null}function r(t,e,i){var r=n();if("wheel"===r)this._fun=e,this._elem=t,this._elem.addEventListener("wheel",this._fun,i);else{if("mousewheel"!==r)throw new Error("Browser does not support mouse wheel events");this._fun=o(e),this._elem=t,this._elem.addEventListener("mousewheel",this._fun,i)}}function o(t){return function(e){e||(e=window.event);var i={originalEvent:e,target:e.target||e.srcElement,type:"wheel",deltaMode:1,deltaX:0,deltaZ:0,timeStamp:e.timeStamp||Date.now(),preventDefault:e.preventDefault.bind(e)};return i.deltaY=-1/40*e.wheelDelta,e.wheelDeltaX&&(i.deltaX=-1/40*e.wheelDeltaX),t(i)}}r.prototype.remove=function(){var t=n();"wheel"===t?this._elem.removeEventListener("wheel",this._fun):"mousewheel"===t&&this._elem.removeEventListener("mousewheel",this._fun)},e.exports=r},{}],50:[function(t,e,i){"use strict";function n(t,e,i){i=r(i||{},u);var n={mouseViewDrag:new o(e,"mouse"),mouseViewQtvr:new s(e,"mouse"),touchView:new o(e,"touch"),pinch:new l(e,"touch"),leftArrowKey:new h(37,"x",-.7,3),rightArrowKey:new h(39,"x",.7,3),upArrowKey:new h(38,"y",-.7,3),downArrowKey:new h(40,"y",.7,3),plusKey:new h(107,"zoom",-.7,3),minusKey:new h(109,"zoom",.7,3),wKey:new h(87,"y",-.7,3),aKey:new h(65,"x",-.7,3),sKey:new h(83,"y",.7,3),dKey:new h(68,"x",.7,3),qKey:new h(81,"roll",.7,3),eKey:new h(69,"roll",-.7,3)};i.scrollZoom!==!1&&(n.scrollZoom=new a(e));var c={arrowKeys:["leftArrowKey","rightArrowKey","upArrowKey","downArrowKey"],plusMinusKeys:["plusKey","minusKey"],wasdKeys:["wKey","aKey","sKey","dKey"],qeKeys:["qKey","eKey"]},p=["scrollZoom","touchView","pinch"];switch(i.mouseViewMode){case"drag":p.push("mouseViewDrag");break;case"qtvr":p.push("mouseViewQtvr");break;default:throw new Error("Unknown mouse view mode: "+i.mouseViewMode)}for(var d in n){var f=n[d];t.registerMethod(d,f),p.indexOf(d)>=0&&t.enableMethod(d)}for(var m in c){var v=c[m];t.addMethodGroup(m,v)}return n}var r=t("../util/defaults"),o=t("./Drag"),s=t("./Qtvr"),a=t("./ScrollZoom"),l=t("./PinchZoom"),h=t("./Key"),u={mouseViewMode:"drag"};e.exports=n},{"../util/defaults":94,"./Drag":39,"./Key":44,"./PinchZoom":45,"./Qtvr":46,"./ScrollZoom":47}],51:[function(t,e,i){"use strict";function n(t,e,i,n,o){var s=Math.sqrt(Math.pow(e,2)+Math.pow(i,2));t=Math.max(t,s/n),r(e,i,t,o),o[0]=Math.abs(o[0]),o[1]=Math.abs(o[1])}function r(t,e,i,n){var r=Math.atan(e/t);n[0]=i*Math.cos(r),n[1]=i*Math.sin(r)}e.exports={maxFriction:n,changeVectorNorm:r}},{}],52:[function(t,e,i){"use strict";function n(t,e,i,n,r){this.face=t,this.x=e,this.y=i,this.z=n,this._geometry=r,this._level=r.levelList[n]}function r(t){if(this.constructor.super_.call(this,t),this._size=t.size,this._tileSize=t.tileSize,this._size%this._tileSize!==0)throw new Error("Level size is not multiple of tile size: "+this._size+" "+this._tileSize)}function o(t){if("array"!==v(t))throw new Error("Level list must be an array");this.levelList=c(t,r),this.selectableLevelList=p(this.levelList);for(var e=1;e<this.levelList.length;e++)this.levelList[e]._validateWithParentLevel(this.levelList[e-1]);this._graphFinder=new l(n.equals,n.hash),this._neighborsCache=new h(n.equals,n.hash,64),this._vec=_.create(),this._viewParams={},this._tileVertices=[_.create(),_.create(),_.create(),_.create()]}for(var s=t("../util/inherits"),a=t("../util/hash"),l=t("../GraphFinder"),h=t("../collections/LruMap"),u=t("./Level"),c=t("./common").makeLevelList,p=t("./common").makeSelectableLevelList,d=t("../util/rotateVector"),f=t("../util/clamp"),m=t("../util/cmp"),v=t("../util/type"),_=t("gl-matrix/src/gl-matrix/vec3"),y="fudlrb",g={f:{x:0,y:0},b:{x:0,y:Math.PI},l:{x:0,y:Math.PI/2},r:{x:0,y:-Math.PI/2},u:{x:Math.PI/2,y:0},d:{x:-Math.PI/2,y:0}},x={},M=0;M<y.length;M++){var w=y[M],b=g[w],S=_.fromValues(0,0,-1);d(S,S,b.y,b.x,0),x[w]=S}var I={f:["l","r","u","d"],b:["r","l","u","d"],l:["b","f","u","d"],r:["f","b","u","d"],u:["l","r","b","f"],d:["l","r","f","b"]},E=[[0,1],[1,0],[0,-1],[-1,0]];n.prototype.rotX=function(){return g[this.face].x},n.prototype.rotY=function(){return g[this.face].y},n.prototype.centerX=function(){return(this.x+.5)/this._level.numHorizontalTiles()-.5},n.prototype.centerY=function(){return.5-(this.y+.5)/this._level.numVerticalTiles()},n.prototype.scaleX=function(){return 1/this._level.numHorizontalTiles()},n.prototype.scaleY=function(){return 1/this._level.numVerticalTiles()},n.prototype.width=function(){return this._level.tileWidth()},n.prototype.height=function(){return this._level.tileHeight()},n.prototype.levelWidth=function(){return this._level.width()},n.prototype.levelHeight=function(){return this._level.height()},n.prototype.atTopLevel=function(){return 0===this.z},n.prototype.atBottomLevel=function(){return this.z===this._geometry.levelList.length-1},n.prototype.atTopEdge=function(){return 0===this.y},n.prototype.atBottomEdge=function(){return this.y===this._level.numVerticalTiles()-1},n.prototype.atLeftEdge=function(){return 0===this.x},n.prototype.atRightEdge=function(){return this.x===this._level.numHorizontalTiles()-1},n.prototype.padTop=function(){return this.atTopEdge()&&/[fu]/.test(this.face)},n.prototype.padBottom=function(){return!this.atBottomEdge()||/[fd]/.test(this.face)},n.prototype.padLeft=function(){return this.atLeftEdge()&&/[flud]/.test(this.face)},n.prototype.padRight=function(){return!this.atRightEdge()||/[frud]/.test(this.face)},n.prototype.vertices=function(t){function e(t,e,n){_.set(t,e,n,-.5),d(t,t,i.y,i.x,0)}var i=g[this.face],n=this.centerX()-this.scaleX()/2,r=this.centerX()+this.scaleX()/2,o=this.centerY()-this.scaleY()/2,s=this.centerY()+this.scaleY()/2;return e(t[0],n,s),e(t[1],r,s),e(t[2],r,o),e(t[3],n,o),t},n.prototype.parent=function(){if(this.atTopLevel())return null;var t=this.face,e=this.z,i=this.x,r=this.y,o=this._geometry,s=o.levelList[e],a=o.levelList[e-1],l=Math.floor(i/s.numHorizontalTiles()*a.numHorizontalTiles()),h=Math.floor(r/s.numVerticalTiles()*a.numVerticalTiles()),u=e-1;return new n(t,l,h,u,o)},n.prototype.children=function(t){if(this.atBottomLevel())return null;var e=this.face,i=this.z,r=this.x,o=this.y,s=this._geometry,a=s.levelList[i],l=s.levelList[i+1],h=l.numHorizontalTiles()/a.numHorizontalTiles(),u=l.numVerticalTiles()/a.numVerticalTiles();t=t||[];for(var c=0;h>c;c++)for(var p=0;u>p;p++){var d=h*r+c,f=u*o+p,m=i+1;t.push(new n(e,d,f,m,s))}return t},n.prototype.neighbors=function(){var t=this._geometry,e=t._neighborsCache,i=e.get(this);if(i)return i;for(var r=t._vec,o=this.face,s=this.x,a=this.y,l=this.z,h=this._level,u=h.numHorizontalTiles(),c=h.numVerticalTiles(),p=[],m=0;m<E.length;m++){var v=E[m][0],y=E[m][1],x=s+v,M=a+y,w=l,b=o;if(0>x||x>=u||0>M||M>=c){var S=this.centerX(),D=this.centerY();0>x?(_.set(r,-.5,D,-.5),b=I[o][0]):x>=u?(_.set(r,.5,D,-.5),b=I[o][1]):0>M?(_.set(r,S,.5,-.5),b=I[o][2]):M>=c&&(_.set(r,S,-.5,-.5),b=I[o][3]);var T;T=g[o],d(r,r,T.y,T.x,0),T=g[b],d(r,r,-T.y,-T.x,0),x=f(Math.floor((.5+r[0])*u),0,u-1),M=f(Math.floor((.5-r[1])*c),0,c-1)}p.push(new n(b,x,M,w,t))}return e.set(this,p),p},n.prototype.hash=function(){return n.hash(this)},n.prototype.equals=function(t){return n.equals(this,t)},n.prototype.cmp=function(t){return n.cmp(this,t)},n.prototype.str=function(){return n.str(this)},n.hash=function(t){return null!=t?a(t.face.charCodeAt(0),t.z,t.x,t.y):0},n.equals=function(t,e){return null!=t&&null!=e&&t.face===e.face&&t.z===e.z&&t.x===e.x&&t.y===e.y},n.cmp=function(t,e){var i=y.indexOf(t.face),n=y.indexOf(e.face);return m(t.z,e.z)||m(i,n)||m(t.y,e.y)||m(t.x,e.x)},n.str=function(t){return"CubeTile("+t.face+", "+t.x+", "+t.y+", "+t.z+")"},s(r,u),r.prototype.width=function(){return this._size},r.prototype.height=function(){return this._size},r.prototype.tileWidth=function(){return this._tileSize},r.prototype.tileHeight=function(){return this._tileSize},r.prototype._validateWithParentLevel=function(t){var e=this.width(),i=this.height(),n=this.tileWidth(),r=this.tileHeight(),o=this.numHorizontalTiles(),s=this.numVerticalTiles(),a=t.width(),l=t.height(),h=t.tileWidth(),u=t.tileHeight(),c=t.numHorizontalTiles(),p=t.numVerticalTiles();if(e%a!==0)throw new Error("Level width must be multiple of parent level: "+e+" vs. "+a);if(i%l!==0)throw new Error("Level height must be multiple of parent level: "+i+" vs. "+l);if(o%c!==0)throw new Error("Number of horizontal tiles must be multiple of parent level: "+o+" ("+e+"/"+n+") vs. "+c+" ("+a+"/"+h+")");if(s%p!==0)throw new Error("Number of vertical tiles must be multiple of parent level: "+s+" ("+i+"/"+r+") vs. "+p+" ("+l+"/"+u+")")},o.prototype.maxTileSize=function(){for(var t=0,e=0;e<this.levelList.length;e++){var i=this.levelList[e];t=Math.max(t,i.tileWidth,i.tileHeight)}return t},o.prototype.levelTiles=function(t,e){var i=this.levelList.indexOf(t),r=t.numHorizontalTiles()-1,o=t.numVerticalTiles()-1;e=e||[];for(var s=0;s<y.length;s++)for(var a=y[s],l=0;r>=l;l++)for(var h=0;o>=h;h++)e.push(new n(a,l,h,i,this));return e},o.prototype._closestTile=function(t,e){var i=this._vec,r=1/0,o=null;_.set(i,0,0,-1),d(i,i,-t.yaw,-t.pitch,-t.roll);for(var s in x){var a=x[s],l=1-_.dot(a,i);r>l&&(r=l,o=s)}for(var h=Math.max(Math.abs(i[0]),Math.abs(i[1]),Math.abs(i[2]))/.5,u=0;3>u;u++)i[u]=i[u]/h;var c=g[o];d(i,i,-c.y,-c.x,-c.z);var p=this.levelList.indexOf(e),m=e.numHorizontalTiles(),v=e.numVerticalTiles(),y=i[0],M=i[1],w=f(Math.floor((.5+y)*m),0,m-1),b=f(Math.floor((.5-M)*v),0,v-1);return new n(o,w,b,p,this)},o.prototype.visibleTiles=function(t,e,i){function n(t){return t.neighbors()}function r(e){return e.vertices(s),t.intersects(s)}var o=this._viewParams,s=this._tileVertices,a=this._graphFinder,l=this._closestTile(t.parameters(o),e);if(!r(l))throw new Error("Starting tile is not visible");i=i||[];var h;for(a.start(l,n,r);null!=(h=a.next());)i.push(h);return i},o.TileClass=o.prototype.TileClass=n,o.type=o.prototype.type="cube",n.type=n.prototype.type="cube",e.exports=o},{"../GraphFinder":14,"../collections/LruMap":30,"../util/clamp":88,"../util/cmp":90,"../util/hash":100,"../util/inherits":101,"../util/rotateVector":109,"../util/type":111,"./Level":55,"./common":56,"gl-matrix/src/gl-matrix/vec3":10}],53:[function(t,e,i){"use strict";function n(t,e){this.z=t,this._geometry=e,this._level=e.levelList[t]}function r(t){this.constructor.super_.call(this,t),this._width=t.width}function o(t){if("array"!==c(t))throw new Error("Level list must be an array");this.levelList=h.makeLevelList(t,r),this.selectableLevelList=h.makeSelectableLevelList(this.levelList)}var s=t("../util/inherits"),a=t("../util/hash"),l=t("../util/cmp"),h=t("./common"),u=t("./Level"),c=t("../util/type");n.prototype.rotX=function(){return 0},n.prototype.rotY=function(){return 0},n.prototype.centerX=function(){return.5},n.prototype.centerY=function(){return.5},n.prototype.scaleX=function(){return 1},n.prototype.scaleY=function(){return 1},n.prototype.width=function(){return this._level.tileWidth()},n.prototype.height=function(){return this._level.tileHeight()},n.prototype.levelWidth=function(){return this._level.width()},n.prototype.levelHeight=function(){return this._level.height()},n.prototype.atTopLevel=function(){return 0===this.z},n.prototype.atBottomLevel=function(){return this.z===this._geometry.levelList.length-1},n.prototype.atTopEdge=function(){return!0},n.prototype.atBottomEdge=function(){return!0},n.prototype.atLeftEdge=function(){return!0},n.prototype.atRightEdge=function(){return!0},n.prototype.padTop=function(){return!1},n.prototype.padBottom=function(){return!1},n.prototype.padLeft=function(){return!1},n.prototype.padRight=function(){return!1},n.prototype.parent=function(){return this.atTopLevel()?null:new n(this.z-1,this._geometry)},n.prototype.children=function(t){return this.atBottomLevel()?null:(t=t||[],t.push(new n(this.z+1,this._geometry)),t)},n.prototype.neighbors=function(){return[]},n.prototype.hash=function(){return n.hash(this)},n.prototype.equals=function(t){return n.equals(this,t)},n.prototype.cmp=function(t){return n.cmp(this,t)},n.prototype.str=function(){return n.str(this)},n.hash=function(t){return a(t.z)},n.equals=function(t,e){return t.z===e.z},n.cmp=function(t,e){return l(t.z,e.z)},n.str=function(t){return"EquirectTile("+t.z+")"},s(r,u),r.prototype.width=function(){return this._width},r.prototype.height=function(){return this._width/2},r.prototype.tileWidth=function(){return this._width},r.prototype.tileHeight=function(){return this._width/2},o.prototype.maxTileSize=function(){for(var t=0,e=0;e<this.levelList.length;e++){var i=this.levelList[e];t=Math.max(t,i.tileWidth,i.tileHeight)}return t},o.prototype.levelTiles=function(t,e){var i=this.levelList.indexOf(t);return e=e||[],e.push(new n(i,this)),e},o.prototype.visibleTiles=function(t,e,i){var r=new n(this.levelList.indexOf(e),this);i=i||[],i.length=0,i.push(r)},o.TileClass=o.prototype.TileClass=n,o.type=o.prototype.type="equirect",n.type=n.prototype.type="equirect",e.exports=o},{"../util/cmp":90,"../util/hash":100,"../util/inherits":101,"../util/type":111,"./Level":55,"./common":56}],54:[function(t,e,i){"use strict";function n(t,e,i,n){this.x=t,this.y=e,this.z=i,this._geometry=n,this._level=n.levelList[i]}function r(t){this.constructor.super_.call(this,t),this._width=t.width,this._height=t.height,this._tileWidth=t.tileWidth,this._tileHeight=t.tileHeight}function o(t){if("array"!==v(t))throw new Error("Level list must be an array");this.levelList=c(t,r),this.selectableLevelList=p(this.levelList);for(var e=1;e<this.levelList.length;e++)this.levelList[e]._validateWithParentLevel(this.levelList[e-1]);this._graphFinder=new l(n.equals,n.hash),this._neighborsCache=new h(n.equals,n.hash,64),this._viewParams={},this._tileVertices=[_.create(),_.create(),_.create(),_.create()]}var s=t("../util/inherits"),a=t("../util/hash"),l=t("../GraphFinder"),h=t("../collections/LruMap"),u=t("./Level"),c=t("./common").makeLevelList,p=t("./common").makeSelectableLevelList,d=t("../util/clamp"),f=t("../util/mod"),m=t("../util/cmp"),v=t("../util/type"),_=t("gl-matrix/src/gl-matrix/vec2"),y=[[0,1],[1,0],[0,-1],[-1,0]];n.prototype.rotX=function(){return 0},n.prototype.rotY=function(){return 0},n.prototype.centerX=function(){var t=this._level.width(),e=this._level.tileWidth();return(this.x*e+.5*this.width())/t-.5},n.prototype.centerY=function(){var t=this._level.height(),e=this._level.tileHeight();return.5-(this.y*e+.5*this.height())/t},n.prototype.scaleX=function(){var t=this._level.width();return this.width()/t},n.prototype.scaleY=function(){var t=this._level.height();return this.height()/t},n.prototype.width=function(){var t=this._level.width(),e=this._level.tileWidth();if(this.atRightEdge()){var i=f(t,e);return i||e}return e},n.prototype.height=function(){var t=this._level.height(),e=this._level.tileHeight();if(this.atBottomEdge()){var i=f(t,e);return i||e}return e},n.prototype.levelWidth=function(){return this._level.width()},n.prototype.levelHeight=function(){return this._level.height()},n.prototype.atTopLevel=function(){return 0===this.z},n.prototype.atBottomLevel=function(){return this.z===this._geometry.levelList.length-1},n.prototype.atTopEdge=function(){return 0===this.y},n.prototype.atBottomEdge=function(){return this.y===this._level.numVerticalTiles()-1},n.prototype.atLeftEdge=function(){return 0===this.x},n.prototype.atRightEdge=function(){return this.x===this._level.numHorizontalTiles()-1},n.prototype.padTop=function(){return!1},n.prototype.padBottom=function(){return!this.atBottomEdge()},n.prototype.padLeft=function(){return!1},n.prototype.padRight=function(){return!this.atRightEdge()},n.prototype.vertices=function(t){var e=this.centerX()-this.scaleX()/2,i=this.centerX()+this.scaleX()/2,n=this.centerY()-this.scaleY()/2,r=this.centerY()+this.scaleY()/2;return _.set(t[0],e,r),_.set(t[1],i,r),_.set(t[2],i,n),_.set(t[3],e,n),t},n.prototype.parent=function(){if(this.atTopLevel())return null;var t=this._geometry,e=this.z-1,i=Math.floor(this.x/2),r=Math.floor(this.y/2);return new n(i,r,e,t)},n.prototype.children=function(t){if(this.atBottomLevel())return null;var e=this._geometry,i=this.z+1;return t=t||[],t.push(new n(2*this.x,2*this.y,i,e)),t.push(new n(2*this.x,2*this.y+1,i,e)),t.push(new n(2*this.x+1,2*this.y,i,e)),t.push(new n(2*this.x+1,2*this.y+1,i,e)),t},n.prototype.neighbors=function(){var t=this._geometry,e=t._neighborsCache,i=e.get(this);if(i)return i;for(var r=this.x,o=this.y,s=this.z,a=this._level,l=a.numHorizontalTiles()-1,h=a.numVerticalTiles()-1,u=[],c=0;c<y.length;c++){var p=y[c][0],d=y[c][1],f=r+p,m=o+d,v=s;f>=0&&l>=f&&m>=0&&h>=m&&u.push(new n(f,m,v,t))}return e.set(this,u),u},n.prototype.hash=function(){return n.hash(this)},n.prototype.equals=function(t){return n.equals(this,t)},n.prototype.cmp=function(t){return n.cmp(this,t)},n.prototype.str=function(){return n.str(this)},n.hash=function(t){return null!=t?a(t.z,t.x,t.y):0},n.equals=function(t,e){return null!=t&&null!=e&&t.z===e.z&&t.x===e.x&&t.y===e.y},n.cmp=function(t,e){return m(t.z,e.z)||m(t.y,e.y)||m(t.x,e.x)},n.str=function(t){return"FlatTile("+t.x+", "+t.y+", "+t.z+")"},s(r,u),r.prototype.width=function(){return this._width},r.prototype.height=function(){return this._height},r.prototype.tileWidth=function(){return this._tileWidth},r.prototype.tileHeight=function(){return this._tileHeight},r.prototype._validateWithParentLevel=function(t){var e=this.width(),i=this.height(),n=this.tileWidth(),r=this.tileHeight(),o=t.width(),s=t.height(),a=t.tileWidth(),l=t.tileHeight();return e%o!==0?new Error("Level width must be multiple of parent level: "+e+" vs. "+o):i%s!==0?new Error("Level height must be multiple of parent level: "+i+" vs. "+s):n%a!==0?new Error("Level tile width must be multiple of parent level: "+n+" vs. "+a):r%l!==0?new Error("Level tile height must be multiple of parent level: "+r+" vs. "+l):void 0},o.prototype.maxTileSize=function(){for(var t=0,e=0;e<this.levelList.length;e++){var i=this.levelList[e];t=Math.max(t,i.tileWidth,i.tileHeight)}return t},o.prototype.levelTiles=function(t,e){var i=this.levelList.indexOf(t),r=t.numHorizontalTiles()-1,o=t.numVerticalTiles()-1;e||(e=[]);for(var s=0;r>=s;s++)for(var a=0;o>=a;a++)e.push(new n(s,a,i,this));return e},o.prototype._closestTile=function(t,e){var i=t.x,r=t.y,o=this.levelList.indexOf(e),s=e.width(),a=e.height(),l=e.tileWidth(),h=e.tileHeight(),u=e.numHorizontalTiles(),c=e.numVerticalTiles(),p=d(Math.floor(i*s/l),0,u-1),f=d(Math.floor(r*a/h),0,c-1);
return new n(p,f,o,this)},o.prototype.visibleTiles=function(t,e,i){function n(t){return t.neighbors()}function r(e){return e.vertices(s),t.intersects(s)}var o=this._viewParams,s=this._tileVertices,a=this._graphFinder,l=this._closestTile(t.parameters(o),e);if(!r(l))throw new Error("Starting tile is not visible");i=i||[];var h;for(a.start(l,n,r);null!=(h=a.next());)i.push(h);return i},o.TileClass=o.prototype.TileClass=n,o.type=o.prototype.type="flat",n.type=n.prototype.type="flat",e.exports=o},{"../GraphFinder":14,"../collections/LruMap":30,"../util/clamp":88,"../util/cmp":90,"../util/hash":100,"../util/inherits":101,"../util/mod":102,"../util/type":111,"./Level":55,"./common":56,"gl-matrix/src/gl-matrix/vec2":9}],55:[function(t,e,i){"use strict";function n(t){this._fallbackOnly=!!t.fallbackOnly}n.prototype.numHorizontalTiles=function(){return Math.ceil(this.width()/this.tileWidth())},n.prototype.numVerticalTiles=function(){return Math.ceil(this.height()/this.tileHeight())},n.prototype.fallbackOnly=function(){return this._fallbackOnly},e.exports=n},{}],56:[function(t,e,i){"use strict";function n(t,e){for(var i=[],n=0;n<t.length;n++)i.push(new e(t[n]));return i.sort(function(t,e){return o(t.width(),e.width())}),i}function r(t){for(var e=[],i=0;i<t.length;i++)t[i]._fallbackOnly||e.push(t[i]);if(!e.length)throw new Error("No selectable levels in list");return e}var o=t("../util/cmp");e.exports={makeLevelList:n,makeSelectableLevelList:r}},{"../util/cmp":90}],57:[function(t,e,i){e.exports={WebGlStage:t("./stages/WebGl"),CssStage:t("./stages/Css"),FlashStage:t("./stages/Flash"),WebGlCubeRenderer:t("./renderers/WebGlCube"),WebGlFlatRenderer:t("./renderers/WebGlFlat"),WebGlEquirectRenderer:t("./renderers/WebGlEquirect"),CssCubeRenderer:t("./renderers/CssCube"),CssFlatRenderer:t("./renderers/CssFlat"),FlashCubeRenderer:t("./renderers/FlashCube"),FlashFlatRenderer:t("./renderers/FlashFlat"),registerDefaultRenderers:t("./renderers/registerDefaultRenderers"),CubeGeometry:t("./geometries/Cube"),FlatGeometry:t("./geometries/Flat"),EquirectGeometry:t("./geometries/Equirect"),RectilinearView:t("./views/Rectilinear"),FlatView:t("./views/Flat"),ImageUrlSource:t("./sources/ImageUrl"),SingleAssetSource:t("./sources/SingleAsset"),DynamicCanvasAsset:t("./assets/DynamicCanvas"),StaticCanvasAsset:t("./assets/StaticCanvas"),TextureStore:t("./TextureStore"),Layer:t("./Layer"),RenderLoop:t("./RenderLoop"),KeyControlMethod:t("./controls/Key"),DragControlMethod:t("./controls/Drag"),QtvrControlMethod:t("./controls/Qtvr"),ScrollZoomControlMethod:t("./controls/ScrollZoom"),PinchZoomControlMethod:t("./controls/PinchZoom"),VelocityControlMethod:t("./controls/Velocity"),ElementPressControlMethod:t("./controls/ElementPress"),Controls:t("./controls/Controls"),Dynamics:t("./controls/Dynamics"),Viewer:t("./Viewer"),Scene:t("./Scene"),Hotspot:t("./Hotspot"),HotspotContainer:t("./HotspotContainer"),colorEffects:t("./colorEffects"),supported:t("./supported"),registerDefaultControls:t("./controls/registerDefaultControls"),autorotate:t("./autorotate"),util:{async:t("./util/async"),cancelize:t("./util/cancelize"),chain:t("./util/chain"),clamp:t("./util/clamp"),clock:t("./util/clock"),cmp:t("./util/cmp"),compose:t("./util/compose"),convertFov:t("./util/convertFov"),decimal:t("./util/decimal"),defaults:t("./util/defaults"),defer:t("./util/defer"),degToRad:t("./util/degToRad"),delay:t("./util/delay"),dom:t("./util/dom"),extend:t("./util/extend"),hash:t("./util/hash"),inherits:t("./util/inherits"),mod:t("./util/mod"),noop:t("./util/noop"),once:t("./util/once"),pixelRatio:t("./util/pixelRatio"),radToDeg:t("./util/radToDeg"),real:t("./util/real"),retry:t("./util/retry"),tween:t("./util/tween"),type:t("./util/type")},version:t("../tmp/version"),dependencies:{bowser:t("bowser"),glMatrix:t("gl-matrix"),eventEmitter:t("minimal-event-emitter"),hammerjs:t("hammerjs")}}},{"../tmp/version":115,"./Hotspot":15,"./HotspotContainer":16,"./Layer":17,"./RenderLoop":19,"./Scene":20,"./TextureStore":21,"./Viewer":23,"./assets/DynamicCanvas":24,"./assets/StaticCanvas":26,"./autorotate":28,"./colorEffects":36,"./controls/Controls":38,"./controls/Drag":39,"./controls/Dynamics":41,"./controls/ElementPress":42,"./controls/Key":44,"./controls/PinchZoom":45,"./controls/Qtvr":46,"./controls/ScrollZoom":47,"./controls/Velocity":48,"./controls/registerDefaultControls":50,"./geometries/Cube":52,"./geometries/Equirect":53,"./geometries/Flat":54,"./renderers/CssCube":60,"./renderers/CssFlat":61,"./renderers/FlashCube":63,"./renderers/FlashFlat":64,"./renderers/WebGlCube":67,"./renderers/WebGlEquirect":68,"./renderers/WebGlFlat":69,"./renderers/registerDefaultRenderers":70,"./sources/ImageUrl":71,"./sources/SingleAsset":72,"./stages/Css":73,"./stages/Flash":74,"./stages/WebGl":77,"./supported":84,"./util/async":85,"./util/cancelize":86,"./util/chain":87,"./util/clamp":88,"./util/clock":89,"./util/cmp":90,"./util/compose":91,"./util/convertFov":92,"./util/decimal":93,"./util/defaults":94,"./util/defer":95,"./util/degToRad":96,"./util/delay":97,"./util/dom":98,"./util/extend":99,"./util/hash":100,"./util/inherits":101,"./util/mod":102,"./util/noop":103,"./util/once":104,"./util/pixelRatio":105,"./util/radToDeg":106,"./util/real":107,"./util/retry":108,"./util/tween":110,"./util/type":111,"./views/Flat":112,"./views/Rectilinear":113,bowser:1,"gl-matrix":2,hammerjs:12,"minimal-event-emitter":13}],58:[function(t,e,i){"use strict";function n(t,e,i){if(r()){var n="translateX("+a(e)+"px) translateY("+a(i)+"px) translateZ(0)";o(t,n)}else s(t,e,i)}var r=t("./support/Css"),o=t("./util/dom").setTransform,s=t("./util/dom").setPixelPosition,a=t("./util/decimal");e.exports=n},{"./support/Css":80,"./util/decimal":93,"./util/dom":98}],59:[function(t,e,i){"use strict";function n(t,e){return t.cmp(e)}function r(t,e,i){this._root=t,this._browserQuirks=e;var n=document.createElement("div");t.appendChild(n),n.style.position="absolute",s(n),a(n),this._browserQuirks.useNullTransform&&l(n),this.domElement=n,this._oldTileList=[],this._newTileList=[],this._textureMap=new o(i.equals,i.hash)}var o=t("../collections/Map"),s=t("../util/dom").setOverflowHidden,a=t("../util/dom").setNoPointerEvents,l=t("../util/dom").setNullTransform,h=t("../util/dom").setTransform,u="undefined"!=typeof MARZIPANODEBUG&&MARZIPANODEBUG.css;r.prototype.destroy=function(){this._root.removeChild(this.domElement),this._textureMap=null,this.domElement=null},r.prototype.startLayer=function(t,e){var i=this.domElement;i.style.left=e.left+"px",i.style.top=e.top+"px",i.style.width=e.width+"px",i.style.height=e.height+"px";var n=1,r=t.effects();r&&null!=r.opacity&&(n=r.opacity),i.style.opacity=n,this._newTileList.length=0,this._textureMap.clear()},r.prototype.renderTile=function(t,e){this._newTileList.push(t),this._textureMap.set(t,e)},r.prototype.endLayer=function(t){var e,i,r,o,s,a,l,c,p=this.domElement,d=this._oldTileList,f=this._newTileList,m=this._textureMap,v=t.view();if(p.children.length!==d.length)throw new Error("DOM not in sync with tile list");for(f.sort(n),e=0,r=d[e],l=p.firstChild,i=0;i<f.length;i++){for(o=f[i];e<d.length&&!(r.cmp(o)>=0);)c=l.nextSibling,p.removeChild(l),l=c,r=d[++e];if(s=m.get(o),a=s?s._canvas:null,!a)throw new Error("Rendering tile with missing texture");if(r&&0===r.cmp(o)){if(a!=l)throw new Error("DOM not in sync with tile list");l=l.nextSibling,r=d[++e]}else p.insertBefore(a,l);h(a,this.calculateTransform(o,s,v)),u&&a.setAttribute("data-tile",o.str())}for(;l;)c=l.nextSibling,p.removeChild(l),l=c;if(p.children.length!==f.length)throw new Error("DOM not in sync with tile list");var _=this._oldTileList;this._oldTileList=this._newTileList,this._newTileList=_},e.exports=r},{"../collections/Map":32,"../util/dom":98}],60:[function(t,e,i){"use strict";function n(t,e){this.constructor.super_.call(this,t,e,r)}var r=t("../geometries/Cube").TileClass,o=t("./CssBase"),s=t("../util/decimal"),a=t("../util/inherits");a(n,o),n.prototype.calculateTransform=function(t,e,i){var n=this._browserQuirks.padSize,r=this._browserQuirks.reverseLevelDepth,o=this._browserQuirks.perspectiveNudge,a="",l=r?256-t.z:t.levelWidth(),h=i.size(),u=h.width,c=h.height;a+="translate3d("+s(u/2)+"px, "+s(c/2)+"px, 0px) ";var p=.5*c/Math.tan(i.fov()/2),d=p+o;a+="perspective("+s(p)+"px) translateZ("+s(d)+"px) ";var f=-i.roll(),m=-i.pitch(),v=i.yaw();a+="rotateZ("+s(f)+"rad) rotateX("+s(m)+"rad) rotateY("+s(v)+"rad) ";var _=-t.rotX(),y=t.rotY();a+="rotateX("+s(_)+"rad) rotateY("+s(y)+"rad) ";var g=t.centerX()-t.scaleX()/2,x=-(t.centerY()+t.scaleY()/2),M=g*l,w=x*l,b=-l/2;if(a+="translate3d("+s(M)+"px, "+s(w)+"px, "+s(b)+"px) ",r){var S=l*t.scaleX()/t.width(),I=l*t.scaleY()/t.height();a+="scale("+s(S)+", "+s(I)+") "}var E=t.padLeft()?n:0,D=t.padTop()?n:0;return 0===E&&0===D||(a+="translate3d("+s(-E)+"px, "+s(-D)+"px, 0) "),a},e.exports=n},{"../geometries/Cube":52,"../util/decimal":93,"../util/inherits":101,"./CssBase":59}],61:[function(t,e,i){"use strict";function n(t,e){this.constructor.super_.call(this,t,e,r)}var r=t("../geometries/Flat").TileClass,o=t("./CssBase"),s=t("../util/decimal"),a=t("../util/inherits");a(n,o),n.prototype.calculateTransform=function(t,e,i){var n=this._browserQuirks.padSize,r="",o=i.width(),a=i.height();r+="translateX("+s(o/2)+"px) translateY("+s(a/2)+"px) ";var l=o/i._zoomX(),h=a/i._zoomY(),u=t.centerX()-t.scaleX()/2+.5,c=.5-t.centerY()-t.scaleY()/2,p=u*l,d=c*h;r+="translateX("+s(p)+"px) translateY("+s(d)+"px) ";var f=-i.x()*l,m=-i.y()*h;r+="translateX("+s(f)+"px) translateY("+s(m)+"px) ";var v=t.padLeft()?n:0,_=t.padTop()?n:0;0===v&&0===_||(r+="translateX("+s(-v)+"px) translateY("+s(-_)+"px) ");var y=l/t.levelWidth(),g=h/t.levelHeight();return r+="scale("+s(y)+", "+s(g)+") "},e.exports=n},{"../geometries/Flat":54,"../util/decimal":93,"../util/inherits":101,"./CssBase":59}],62:[function(t,e,i){"use strict";function n(t,e){return t.cmp(e)}function r(t,e,i,n){this._flashElement=t,this._layerId=e,this._quirks=i,this._tileList=[],this._textureMap=new o(n.equals,n.hash),this._layerCreated=!1}var o=t("../collections/Map");r.prototype.destroy=function(){this._flashElement.destroyLayer(this._layerId),this._flashElement=null,this._layerId=null,this._layerCreated=null,this._tileList=null,this._padSize=null},r.prototype.startLayer=function(t,e){this._flashElement.isReady&&(this._layerCreated||(this._flashElement.createLayer(this._layerId),this._layerCreated=!0),this._tileList.length=0,this._textureMap.clear())},r.prototype.renderTile=function(t,e){this._tileList.push(t),this._textureMap.set(t,e)},r.prototype.endLayer=function(t,e){if(this._flashElement.isReady){var i=this._tileList;i.sort(n),this._renderOnFlash(t,e)}},e.exports=r},{"../collections/Map":32}],63:[function(t,e,i){"use strict";function n(t,e,i){this.constructor.super_.call(this,t,e,i,o),this._flashTileList=[]}var r=t("./FlashBase"),o=t("../geometries/Cube").TileClass,s=t("../util/inherits"),a=t("../util/radToDeg");s(n,r),n.prototype._renderOnFlash=function(t,e){var i=this._flashElement,n=this._layerId,r=this._quirks.padSize,o=this._tileList,s=this._textureMap,l=this._flashTileList;l.length=0;for(var h=0;h<o.length;h++){var u=o[h],c=s.get(u);if(!c)throw new Error("Rendering tile with missing texture");var p=u.padTop()?r:0,d=u.padBottom()?r:0,f=u.padLeft()?r:0,m=u.padRight()?r:0;l.push({textureId:c._textureId,face:u.face,width:u.width(),height:u.height(),centerX:u.centerX(),centerY:u.centerY(),rotX:a(u.rotX()),rotY:a(u.rotY()),levelSize:u.levelWidth(),padTop:p,padBottom:d,padLeft:f,padRight:m})}var v=1,_=t.effects();_&&null!=_.opacity&&(v=_.opacity);var y=t.view(),g=y.yaw(),x=y.pitch(),M=y.roll(),w=y.fov();i.drawCubeTiles(n,e.width,e.height,e.left,e.top,v,g,x,M,w,l)},e.exports=n},{"../geometries/Cube":52,"../util/inherits":101,"../util/radToDeg":106,"./FlashBase":62}],64:[function(t,e,i){"use strict";function n(t,e,i){this.constructor.super_.call(this,t,e,i,o),this._flashTileList=[]}var r=t("./FlashBase"),o=t("../geometries/Flat").TileClass,s=t("../util/inherits");s(n,r),n.prototype._renderOnFlash=function(t,e){var i=this._flashElement,n=this._layerId,r=this._quirks.padSize,o=this._tileList,s=this._textureMap,a=this._flashTileList;a.length=0;for(var l=0;l<o.length;l++){var h=o[l],u=s.get(h);if(!u)throw new Error("Rendering tile with missing texture");var c=h.padTop()?r:0,p=h.padBottom()?r:0,d=h.padLeft()?r:0,f=h.padRight()?r:0;a.push({textureId:u._textureId,width:h.width(),height:h.height(),centerX:h.centerX(),centerY:h.centerY(),scaleX:h.scaleX(),scaleY:h.scaleY(),levelWidth:h.levelWidth(),levelHeight:h.levelHeight(),padTop:c,padBottom:p,padLeft:d,padRight:f})}var m=1,v=t.effects();v&&null!=v.opacity&&(m=v.opacity);var _=t.view(),y=_.x(),g=_.y(),x=_._zoomX(),M=_._zoomY();i.drawFlatTiles(n,e.width,e.height,e.left,e.top,m,y,g,x,M,a)},e.exports=n},{"../geometries/Flat":54,"../util/inherits":101,"./FlashBase":62}],65:[function(t,e,i){"use strict";function n(t){this.gl=t,this.vtMatrix=x.create(),this.vccMatrix=x.create(),this.translateVector=M.create(),this.scaleVector=M.create(),this.constantBuffers=o(this.gl,m,v,_),this.shaderProgram=a(this.gl,d,f,y,g)}var r=t("./WebGlCommon"),o=r.createConstantBuffers,s=r.destroyConstantBuffers,a=r.createShaderProgram,l=r.destroyShaderProgram,h=r.setViewport,u=r.setupPixelEffectUniforms,c=r.setDepth,p=r.setTexture,d='#define GLSLIFY 1\n/*\n * Copyright 2016 Google Inc. All rights reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\nuniform float uDepth;\nuniform mat4 vtMatrix;\nuniform mat4 vccMatrix;\n\nvoid main(void) {\n  gl_Position = vccMatrix * vtMatrix * vec4(aVertexPosition.xy, 0.0, 1.0);\n  gl_Position.z = uDepth * gl_Position.w;\n  vTextureCoord = aTextureCoord;\n}\n',f='/*\n * Copyright 2016 Google Inc. All rights reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float uOpacity;\nuniform vec4 colorOffset;\nuniform mat4 colorMatrix;\n\nvoid main(void) {\n  vec4 color = texture2D(uSampler, vTextureCoord);\n  color = color * colorMatrix + colorOffset;\n  gl_FragColor = vec4(color.rgb * color.a * uOpacity, color.a * uOpacity);\n}\n',m=[0,1,2,0,2,3],v=[-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],_=[0,0,1,0,1,1,0,1],y=["aVertexPosition","aTextureCoord"],g=["vtMatrix","vccMatrix","uDepth","uSampler","uOpacity","colorOffset","colorMatrix"],x=t("gl-matrix/src/gl-matrix/mat4"),M=t("gl-matrix/src/gl-matrix/vec3");n.prototype.destroy=function(){this.vtMatrix=null,this.vccMatrix=null,this.translateVector=null,this.scaleVector=null,s(this.gl,this.constantBuffers),this.constantBuffers=null,l(this.gl,this.shaderProgram),this.shaderProgram=null,this.gl=null},n.prototype.startLayer=function(t,e){var i=this.gl,n=this.shaderProgram,r=this.constantBuffers;i.useProgram(n),h(i,t,e,this.vccMatrix),i.uniformMatrix4fv(n.vccMatrix,!1,this.vccMatrix),i.bindBuffer(i.ARRAY_BUFFER,r.vertexPositions),i.vertexAttribPointer(n.aVertexPosition,3,i.FLOAT,i.FALSE,0,0),i.bindBuffer(i.ARRAY_BUFFER,r.textureCoords),i.vertexAttribPointer(n.aTextureCoord,2,i.FLOAT,i.FALSE,0,0),u(i,t.effects(),{opacity:n.uOpacity,colorOffset:n.colorOffset,colorMatrix:n.colorMatrix})},n.prototype.endLayer=function(){},n.prototype.renderTile=function(t,e,i,n){var r=this.gl,o=this.shaderProgram,s=this.constantBuffers,a=this.vtMatrix,l=this.translateVector,h=this.scaleVector;l[0]=t.centerX(),l[1]=t.centerY(),l[2]=-.5,h[0]=t.scaleX(),h[1]=t.scaleY(),h[2]=1,x.copy(a,i.view().projection()),x.rotateX(a,a,t.rotX()),x.rotateY(a,a,t.rotY()),x.translate(a,a,l),x.scale(a,a,h),r.uniformMatrix4fv(o.vtMatrix,!1,a),c(r,o,n,t.z),p(r,o,e),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,s.vertexIndices),r.drawElements(r.TRIANGLES,m.length,r.UNSIGNED_SHORT,0)},e.exports=n},{"./WebGlCommon":66,"gl-matrix/src/gl-matrix/mat4":7,"gl-matrix/src/gl-matrix/vec3":10}],66:[function(t,e,i){"use strict";function n(t,e,i){var n=t.createShader(e);if(t.shaderSource(n,i),t.compileShader(n),!t.getShaderParameter(n,t.COMPILE_STATUS))throw t.getShaderInfoLog(n);return n}function r(t,e,i,r,o){var s=n(t,t.VERTEX_SHADER,e),a=n(t,t.FRAGMENT_SHADER,i),l=t.createProgram();if(t.attachShader(l,s),t.attachShader(l,a),t.linkProgram(l),!t.getProgramParameter(l,t.LINK_STATUS))throw t.getProgramInfoLog(l);for(var h=0;h<r.length;h++){var u=r[h];l[u]=t.getAttribLocation(l,u),t.enableVertexAttribArray(l[u])}for(var c=0;c<o.length;c++){var p=o[c];l[p]=t.getUniformLocation(l,p)}return l}function o(t,e){for(var i=t.getAttachedShaders(e),n=0;n<i.length;n++){var r=i[n];t.detachShader(e,r),t.deleteShader(r)}t.deleteProgram(e)}function s(t,e,i,n){var r=t.createBuffer();return t.bindBuffer(e,r),t.bufferData(e,n,i),r}function a(t,e,i,n){return{vertexIndices:s(t,t.ELEMENT_ARRAY_BUFFER,t.STATIC_DRAW,new Uint16Array(e)),vertexPositions:s(t,t.ARRAY_BUFFER,t.STATIC_DRAW,new Float32Array(i)),textureCoords:s(t,t.ARRAY_BUFFER,t.STATIC_DRAW,new Float32Array(n))}}function l(t,e){t.deleteBuffer(e.vertexIndices),t.deleteBuffer(e.vertexPositions),t.deleteBuffer(e.textureCoords)}function h(t,e,i){t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,i._texture),t.uniform1i(e.uSampler,0)}function u(t,e,i,n){var r=((i+1)*m-n)/(m*f);t.uniform1f(e.uDepth,r)}function c(t,e,i){var n=M;e&&null!=e.opacity&&(n=e.opacity),t.uniform1f(i.opacity,n);var r=w;e&&e.colorOffset&&(r=e.colorOffset),t.uniform4fv(i.colorOffset,r);var o=b;e&&e.colorMatrix&&(o=e.colorMatrix),t.uniformMatrix4fv(i.colorMatrix,!1,o)}function p(t,e,i,n){var r=v();d(i,S,n),t.viewport(r*S.offsetX,r*S.offsetY,r*S.width,r*S.height)}function d(t,e,i){var n=t.left,r=t.totalWidth,o=_(n,0,r),s=t.width-(o-n),a=r-o,l=_(s,0,a);e.offsetX=o,e.width=l;var h=t.totalHeight-t.bottom,u=t.totalHeight,c=_(h,0,u),p=t.height-(c-h),d=u-c,f=_(p,0,d);e.offsetY=c,e.height=f,E[0]=t.width/l,E[1]=t.height/f,E[2]=1;var m=o-n,v=n+t.width,y=o+l,g=v-y,M=c-h,w=h+t.height,b=c+f,S=w-b;I[0]=(g-m)/l,I[1]=(S-M)/f,I[2]=0;var D=i;x.identity(D),x.translate(D,D,I),x.scale(D,D,E)}var f=256,m=256,v=t("../util/pixelRatio"),_=t("../util/clamp"),y=t("gl-matrix/src/gl-matrix/vec4"),g=t("gl-matrix/src/gl-matrix/vec3"),x=t("gl-matrix/src/gl-matrix/mat4"),M=1,w=y.create(),b=x.create();x.identity(b);var S={},I=g.create(),E=g.create();e.exports={createShaderProgram:r,destroyShaderProgram:o,createConstantBuffers:a,destroyConstantBuffers:l,setTexture:h,setDepth:u,setViewport:p,setupPixelEffectUniforms:c}},{"../util/clamp":88,"../util/pixelRatio":105,"gl-matrix/src/gl-matrix/mat4":7,"gl-matrix/src/gl-matrix/vec3":10,"gl-matrix/src/gl-matrix/vec4":11}],67:[function(t,e,i){"use strict";var n=t("./WebGlBase");e.exports=n},{"./WebGlBase":65}],68:[function(t,e,i){"use strict";function n(t){this.gl=t,this.pMatrix=x.create(),this.vccMatrix=x.create(),this.constantBuffers=o(this.gl,m,v,_),this.shaderProgram=s(this.gl,d,f,y,g)}var r=t("./WebGlCommon"),o=r.createConstantBuffers,s=r.createShaderProgram,a=r.setViewport,l=r.destroyConstantBuffers,h=r.destroyShaderProgram,u=r.setupPixelEffectUniforms,c=r.setDepth,p=r.setTexture,d='#define GLSLIFY 1\n/*\n * Copyright 2016 Google Inc. All rights reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\nuniform float uDepth;\nuniform mat4 vccMatrix;\n\nvoid main(void) {\n  gl_Position = vccMatrix * vec4(aVertexPosition.xy, uDepth, 1.0);\n  vTextureCoord = aTextureCoord;\n}\n',f='/*\n * Copyright 2016 Google Inc. All rights reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *   http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform sampler2D uSampler;\nuniform mat4 uPInvMatrix;\nuniform float uWidth;\nuniform float uHeight;\nuniform float uOpacity;\nvarying vec2 vTextureCoord;\nuniform vec4 colorOffset;\nuniform mat4 colorMatrix;\n\nuniform float textureX;\nuniform float textureY;\nuniform float textureWidth;\nuniform float textureHeight;\n\nconst float PI = 3.14159265358979323846264;\n\nvoid main(void) {\n  float x = 2.0 * vTextureCoord.x - 1.0;\n  float y = 2.0 * vTextureCoord.y - 1.0;\n  vec4 pos = uPInvMatrix * vec4(x, y, 1.0, 1.0);\n  float r = inversesqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);\n  float phi  = acos(pos.y * r);\n  float theta = atan(pos.x, -1.0*pos.z);\n  float s = 0.5 + 0.5 * theta / PI;\n  float t = 1.0 - phi / PI;\n\n  s = s * textureWidth + textureX;\n  t = t * textureHeight + textureY;\n\n  vec4 color = texture2D(uSampler, vec2(s, t));\n  color = color * colorMatrix + colorOffset;\n  gl_FragColor = vec4(color.rgb * color.a * uOpacity, color.a * uOpacity);\n}\n',m=[0,1,2,0,2,3],v=[-1,-1,0,1,-1,0,1,1,0,-1,1,0],_=[0,0,1,0,1,1,0,1],y=["aVertexPosition","aTextureCoord"],g=["uPInvMatrix","uDepth","vccMatrix","uSampler","uOpacity","uWidth","uHeight","colorOffset","colorMatrix","textureX","textureY","textureWidth","textureHeight"],x=t("gl-matrix/src/gl-matrix/mat4");n.prototype.destroy=function(){this.pMatrix=null,l(this.gl,this.constantBuffers),this.constantBuffers=null,h(this.gl,this.shaderProgram),this.shaderProgram=null,this.gl=null},n.prototype.startLayer=function(t,e){var i=this.gl,n=this.shaderProgram,r=this.constantBuffers,o=this.pMatrix;i.useProgram(this.shaderProgram),a(i,t,e,this.vccMatrix),i.uniformMatrix4fv(n.vccMatrix,!1,this.vccMatrix),i.bindBuffer(i.ARRAY_BUFFER,r.vertexPositions),i.vertexAttribPointer(n.aVertexPosition,3,i.FLOAT,i.FALSE,0,0),i.bindBuffer(i.ARRAY_BUFFER,r.textureCoords),i.vertexAttribPointer(n.aTextureCoord,2,i.FLOAT,i.FALSE,0,0),x.copy(this.pMatrix,t.view().projection()),x.invert(o,o),i.uniformMatrix4fv(n.uPInvMatrix,!1,o),this.gl.uniform1f(this.shaderProgram.uWidth,e.width),this.gl.uniform1f(this.shaderProgram.uHeight,e.height);var s=t.effects().textureCrop||{},l=null!=s.x?s.x:0,h=null!=s.y?s.y:0,c=null!=s.width?s.width:1,p=null!=s.height?s.height:1;this.gl.uniform1f(this.shaderProgram.textureX,l),this.gl.uniform1f(this.shaderProgram.textureY,h),this.gl.uniform1f(this.shaderProgram.textureWidth,c),this.gl.uniform1f(this.shaderProgram.textureHeight,p),u(i,t.effects(),{opacity:n.uOpacity,colorOffset:n.colorOffset,colorMatrix:n.colorMatrix})},n.prototype.endLayer=function(){},n.prototype.renderTile=function(t,e,i,n){var r=this.gl,o=this.shaderProgram,s=this.constantBuffers;c(r,o,n,t.z),p(r,o,e),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,s.vertexIndices),r.drawElements(r.TRIANGLES,m.length,r.UNSIGNED_SHORT,0)},e.exports=n},{"./WebGlCommon":66,"gl-matrix/src/gl-matrix/mat4":7}],69:[function(t,e,i){arguments[4][67][0].apply(i,arguments)},{"./WebGlBase":65,dup:67}],70:[function(t,e,i){"use strict";function n(t){switch(t.type){case"webgl":t.registerRenderer("flat","flat",o),t.registerRenderer("cube","rectilinear",r),t.registerRenderer("equirect","rectilinear",s);break;case"css":t.registerRenderer("flat","flat",l),t.registerRenderer("cube","rectilinear",a);break;case"flash":t.registerRenderer("flat","flat",u),t.registerRenderer("cube","rectilinear",h);break;default:throw new Error("Unknown stage type: "+t.type)}}var r=t("./WebGlCube"),o=t("./WebGlFlat"),s=t("./WebGlEquirect"),a=t("./CssCube"),l=t("./CssFlat"),h=t("./FlashCube"),u=t("./FlashFlat");e.exports=n},{"./CssCube":60,"./CssFlat":61,"./FlashCube":63,"./FlashFlat":64,"./WebGlCube":67,"./WebGlEquirect":68,"./WebGlFlat":69}],71:[function(t,e,i){"use strict";function n(t,e){e=e?e:{},this._loadPool=new s({concurrency:e.concurrency||p}),this._retryDelay=e.retryDelay||d,this._retryMap={},this._sourceFromTile=t}function r(t){var e="\\{("+t+")\\}";return new RegExp(e,"g")}var o=t("../NetworkError"),s=t("../collections/WorkPool"),a=t("../util/chain"),l=t("../util/delay"),h=t("../util/clock"),u={x:"x",y:"y",z:"z",f:"face"},c="bdflru",p=4,d=1e4;n.prototype.loadAsset=function(t,e,i){var n,r=this,s=this._retryDelay,u=this._retryMap,c=this._sourceFromTile(e),p=c.url,d=c.rect,f=t.loadImage.bind(t,p,d),m=function(t){return r._loadPool.push(f,function(i,n){i?(i instanceof o&&(u[p]=h()),t(i,e)):(delete u[p],t(null,e,n))})},v=u[p];if(null!=v){var _=h(),y=_-v;s>y?n=s-y:(n=0,delete u[p])}var g=l.bind(null,n);return a(g,m)(i)},n.fromString=function(t,e){function i(e){var i=t;for(var n in u){var o=r(n),s=e[u[n]];i=i.replace(o,s)}return{url:i}}function o(t){return 0===t.z?s(t):i(t)}function s(t){var i=a.indexOf(t.face)/6;return{url:e.cubeMapPreviewUrl,rect:{x:0,y:i,width:1,height:1/6}}}e=e||{};var a=e&&e.cubeMapPreviewFaceOrder||c,l=e.cubeMapPreviewUrl?o:i;return new n(l)},n.stringHasFace=function(t){return n.stringHasProperty(t,"f")},n.stringHasX=function(t){return n.stringHasProperty(t,"x")},n.stringHasY=function(t){return n.stringHasProperty(t,"y")},n.stringHasLevel=function(t){return n.stringHasProperty(t,"z")},n.stringHasProperty=function(t,e){return!!t.match(r(e))},e.exports=n},{"../NetworkError":18,"../collections/WorkPool":34,"../util/chain":87,"../util/clock":89,"../util/delay":97}],72:[function(t,e,i){"use strict";function n(t){this._asset=t}n.prototype.asset=function(){return this._asset},n.prototype.loadAsset=function(t,e,i){function n(){clearTimeout(o),i.apply(null,arguments)}var r=this,o=setTimeout(function(){i(null,e,r._asset)},0);return n},e.exports=n},{}],73:[function(t,e,i){"use strict";function n(t){this.constructor.super_.call(this,t),this._domElement=document.createElement("div"),u(this._domElement),p(this._domElement)}function r(t,e,i){var n=document.createElement("canvas");u(n),d(n),this._canvas=n,this._timestamp=null,this.refresh(e,i)}var o=t("./Stage"),s=t("../support/Css"),a=t("bowser"),l=t("../util/inherits"),h=t("./loadImageHtml"),u=t("../util/dom").setAbsolute,c=t("../util/dom").setPixelSize,p=t("../util/dom").setFullSize,d=t("../util/dom").setNullTransformOrigin,f={padSize:a.ios?0:3,reverseLevelDepth:a.ios,useNullTransform:a.ios,perspectiveNudge:a.webkit||a.gecko?.001:0};l(n,o),n.prototype.destroy=function(){this.constructor.super_.prototype.destroy.call(this),this._domElement=null},n.supported=function(){return s()},n.prototype._updateSize=function(){var t=this._domElement,e=this._width,i=this._height;c(t,e,i)},n.prototype.loadImage=h,n.prototype._validateLayer=function(t){},n.prototype.createRenderer=function(t){return new t(this._domElement,f)},n.prototype.destroyRenderer=function(t){t.destroy()},n.prototype.startFrame=function(){},n.prototype.endFrame=function(){},n.type=n.prototype.type="css",r.prototype.refresh=function(t,e){var i=e.timestamp();if(i!==this._timestamp){this._timestamp=i;var n=this._canvas,r=n.getContext("2d"),o=e.element(),s=t.width(),a=t.height(),l=f.padSize,h=t.padTop()?l:0,u=t.padBottom()?l:0,c=t.padLeft()?l:0,p=t.padRight()?l:0;n.width=c+s+p,n.height=h+a+u,r.drawImage(o,c,h,s,a);var d;for(d=0;h>d;d++)r.drawImage(n,c,h,s,1,c,d,s,1);for(d=0;c>d;d++)r.drawImage(n,c,h,1,a,d,h,1,a);for(d=0;u>d;d++)r.drawImage(n,c,h+a-1,s,1,c,h+a+d,s,1);for(d=0;p>d;d++)r.drawImage(n,c+s-1,h,1,a,c+s+d,h,1,a)}},r.prototype.destroy=function(){this._canvas=null,this._timestamp=null},n.TextureClass=n.prototype.TextureClass=r,e.exports=n},{"../support/Css":80,"../util/dom":98,"../util/inherits":101,"./Stage":76,"./loadImageHtml":79,bowser:1}],74:[function(t,e,i){"use strict";function n(){return window[g].__next++}function r(t){if(this.constructor.super_.call(this,t),this._wmode=t&&t.wmode||_,this._swfPath=t&&t.swfPath||y,!y)throw new Error("Missing SWF path");this._flashStageId=n(),this._callbacksObj=window[g][this._flashStageId]={},this._stageCallbacksObjVarName=g+"["+this._flashStageId+"]",this._callbackListeners={};for(var e=0;e<x.length;e++)this._callbacksObj[x[e]]=this._callListeners(x[e]);this._loadImageQueue=new h,this._loadImageQueue.pause(),this._flashReady=!1,this._nextLayerId=0;var i=o(this._swfPath,this._flashStageId,this._stageCallbacksObjVarName);this._domElement=i.root,this._blockingElement=i.blocking,this._flashElement=i.flash,this._checkReadyTimer=setInterval(this._checkReady.bind(this),50)}function o(t,e,i){var n=document.createElement("div");p(n),f(n);var r="marzipano-flash-stage-"+e,o='<object id="'+r+'" name="'+r+'" type="application/x-shockwave-flash" data="'+t+'">',s="";s+='<param name="movie" value="'+t+'" />',s+='<param name="allowscriptaccess" value="always" />',s+='<param name="flashvars" value="callbacksObjName='+i+'" />',s+='<param name="wmode" value="transparent" />',o+=s,o+="</object>";var a=document.createElement("div");a.innerHTML=o;var l=a.firstChild;p(l),f(l),n.appendChild(l);var h=document.createElement("div");return p(h),f(h),m(h),n.appendChild(h),{root:n,flash:l,blocking:h}}function s(t,e,i){var n=i.element(),r=e.width(),o=e.height(),s=M.padSize,a=e.padTop()?s:0,l=e.padBottom()?s:0,h=e.padLeft()?s:0,u=e.padRight()?s:0,c=t._flashElement.createTexture(n,r,o,a,l,h,u);this._stage=t,this._textureId=c}var a=t("./Stage"),l=t("../support/Flash"),h=t("../collections/WorkQueue"),u=t("../util/inherits"),c=t("../util/defer"),p=t("../util/dom").setAbsolute,d=t("../util/dom").setPixelSize,f=t("../util/dom").setFullSize,m=t("../util/dom").setBlocking,v=t("./loadImageFlash"),_="transparent",y=function(){var t=document.currentScript;if(!t){var e=document.getElementsByTagName("script");t=e.length?e[e.length-1]:null}if(!t)return null;var i=t.src,n=i.lastIndexOf("/");return i=n>=0?i.slice(0,n+1):"",i+"marzipano.swf"}(),g="MarzipanoFlashCallbackMap";g in window||(window[g]={__next:0});var x=["imageLoaded"],M={padSize:3};u(r,a),r.prototype.destroy=function(){this.constructor.super_.prototype.destroy.call(this),this._domElement=null,this._blockingElement=null,this._flashElement=null,window[g][this._flashStageId]=null,this._callbacksObj=null,this._loadImageQueue=null,clearInterval(this._checkReadyTimer)},r.supported=function(){return l()},r.prototype._updateSize=function(){var t=this._domElement,e=this._width,i=this._height;
d(t,e,i)},r.prototype.loadImage=function(t,e,i){var n=v.bind(null,this,t,e);return this._loadImageQueue.push(n,i)},r.prototype._validateLayer=function(t){},r.prototype._onCallback=function(t,e){this._callbackListeners[t]=this._callbackListeners[t]||[],this._callbackListeners[t].push(e)},r.prototype._offCallback=function(t,e){var i=this._callbackListeners[t]||[],n=i.indexOf(e);n>=0&&i.splice(n,1)},r.prototype._callListeners=function(t){var e=this;return function(){for(var i=e._callbackListeners[t]||[],n=0;n<i.length;n++){var r=i[n];c(r,arguments)}}},r.prototype._checkReady=function(){var t=this._flashElement.isReady;return t&&t()?(this._flashReady=!0,clearTimeout(this._checkReadyTimer),this._loadImageQueue.resume(),this.emitRenderInvalid(),!0):!1},r.prototype.createRenderer=function(t){return new t(this._flashElement,++this._nextLayerId,M)},r.prototype.destroyRenderer=function(t){t.destroy()},r.prototype.startFrame=function(){},r.prototype.endFrame=function(){},r.type=r.prototype.type="flash",s.prototype.refresh=function(t,e){},s.prototype.destroy=function(){var t=this._textureId,e=this._stage;e._flashElement.destroyTexture(t),this._stage=null,this._textureId=null},r.TextureClass=r.prototype.TextureClass=s,e.exports=r},{"../collections/WorkQueue":35,"../support/Flash":81,"../util/defer":95,"../util/dom":98,"../util/inherits":101,"./Stage":76,"./loadImageFlash":78}],75:[function(t,e,i){"use strict";function n(){this._renderers={}}n.prototype.set=function(t,e,i){this._renderers[t]||(this._renderers[t]={}),this._renderers[t][e]=i},n.prototype.get=function(t,e){var i=this._renderers[t]&&this._renderers[t][e];return i||null},e.exports=n},{}],76:[function(t,e,i){"use strict";function n(t,e){return-t.cmp(e)}function r(t){this._domElement=null,this._layers=[],this._renderers=[],this._visibleTiles=[],this._fallbackTiles={children:[],parents:[]},this._tmpTiles=[],this._width=null,this._height=null,this._rect={},this._createTextureWorkQueue=new s({delay:c}),this.emitRenderInvalid=this.emitRenderInvalid.bind(this),this._rendererRegistry=new u}var o=t("minimal-event-emitter"),s=t("../collections/WorkQueue"),a=t("../calcRect"),l=t("../util/async"),h=t("../util/cancelize"),u=t("./RendererRegistry"),c=20;o(r),r.prototype.destroy=function(){this.removeAllLayers(),this._layers=null,this._renderers=null,this._visibleTiles=null,this._fallbackTiles=null,this._tmpTiles=null,this._width=null,this._height=null,this._createTextureWorkQueue=null,this.emitRenderInvalid=null,this._rendererRegistry=null},r.prototype.registerRenderer=function(t,e,i){return this._rendererRegistry.set(t,e,i)},r.prototype.domElement=function(){return this._domElement},r.prototype.width=function(){return this._width},r.prototype.height=function(){return this._height},r.prototype.size=function(t){return t=t||{},t.width=this._width,t.height=this._height,t},r.prototype.updateSize=function(){this._width=this._domElement.parentElement.clientWidth,this._height=this._domElement.parentElement.clientHeight,this._updateSize(),this.emit("resize"),this.emitRenderInvalid()},r.prototype.emitRenderInvalid=function(){this.emit("renderInvalid")},r.prototype.addLayer=function(t){if(this._layers.indexOf(t)>=0)throw new Error("Layer already in stage");this._validateLayer(t),this._layers.push(t),this._renderers.push(null),t.addEventListener("viewChange",this.emitRenderInvalid),t.addEventListener("effectsChange",this.emitRenderInvalid),t.addEventListener("fixedLevelChange",this.emitRenderInvalid),t.addEventListener("textureStoreChange",this.emitRenderInvalid),this.emitRenderInvalid()},r.prototype.removeLayer=function(t){var e=this._layers.indexOf(t);if(0>e)throw new Error("No such layer in stage");var i=this._layers.splice(e,1)[0],n=this._renderers.splice(e,1)[0];n&&this.destroyRenderer(n),i.removeEventListener("viewChange",this.emitRenderInvalid),i.removeEventListener("effectsChange",this.emitRenderInvalid),i.removeEventListener("fixedLevelChange",this.emitRenderInvalid),i.removeEventListener("textureStoreChange",this.emitRenderInvalid),this.emitRenderInvalid()},r.prototype.removeAllLayers=function(){for(;this._layers.length>0;)this.removeLayer(this._layers[0])},r.prototype.listLayers=function(){return[].concat(this._layers)},r.prototype.hasLayer=function(t){return this._layers.indexOf(t)>=0},r.prototype.moveLayer=function(t,e){if(0>e||e>=this._layers.length)throw new Error("Cannot move layer out of bounds");var i=this._layers.indexOf(t);if(0>i)throw new Error("No such layer in stage");t=this._layers.splice(i,1)[0];var n=this._renderers.splice(i,1)[0];this._layers.splice(e,0,t),this._renderers.splice(e,0,n),this.emitRenderInvalid()},r.prototype.render=function(){var t,e=this._visibleTiles,i=this._fallbackTiles,r=this._width,o=this._height,s=this._rect;if(!(0>=r||0>=o)){for(this.startFrame(),t=0;t<this._layers.length;t++)this._layers[t].textureStore().startFrame();for(t=0;t<this._layers.length;t++){var l=this._layers[t],h=l.effects(),u=l.view(),c=this._updateRenderer(t),p=this._layers.length-t,d=l.textureStore();if(a(r,o,h&&h.rect,s),!(s.width<=0||s.height<=0)){u.setSize(s),e.length=0,l.visibleTiles(e),c.startLayer(l,s);var f=i.parents,m=i.children;m.length=0,f.length=0,this._renderTiles(e,d,c,l,p,!0),this._renderTiles(m,d,c,l,p,!1),f.sort(n),this._renderTiles(f,d,c,l,p,!1),c.endLayer(l,s)}}for(t=0;t<this._layers.length;t++)this._layers[t].textureStore().endFrame();this.endFrame()}},r.prototype._updateRenderer=function(t){var e=this._layers[t],i=this.type,n=e.geometry().type,r=e.view().type,o=this._rendererRegistry.get(n,r);if(!o)throw new Error("No "+i+" renderer avaiable for "+n+" geometry and "+r+" view");var s=this._renderers[t];return s?s instanceof o||(this._renderers[t]=this.createRenderer(o),this.destroyRenderer(s)):this._renderers[t]=this.createRenderer(o),this._renderers[t]},r.prototype._renderTiles=function(t,e,i,n,r,o){for(var s=0;s<t.length;s++){var a=t[s];e.markTile(a);var l=e.texture(a);l?i.renderTile(a,l,n,r,s):o&&this._fallback(a,e)}},r.prototype._fallback=function(t,e){return this._childrenFallback(t,e)||this._parentFallback(t,e)},r.prototype._parentFallback=function(t,e){for(var i=this._fallbackTiles.parents;null!=(t=t.parent());)if(t&&e.texture(t)){for(var n=0;n<i.length;n++)if(t.equals(i[n]))return!0;return i.push(t),!0}return!1},r.prototype._childrenFallback=function(t,e){var i=this._fallbackTiles.children,n=this._tmpTiles;if(n.length=0,!t.children(n))return!1;if(1===n.length&&!e.texture(n[0]))return this._childrenFallback(n[0],e,i);for(var r=!1,o=0;o<n.length;o++)e.texture(n[o])?i.push(n[o]):r=!0;return!r},r.prototype.createTexture=function(t,e,i){function n(){return new r.TextureClass(r,t,e)}var r=this,o=h(l(n));return this._createTextureWorkQueue.push(o,function(n,r){i(n,t,e,r)})},e.exports=r},{"../calcRect":29,"../collections/WorkQueue":35,"../util/async":85,"../util/cancelize":86,"./RendererRegistry":75,"minimal-event-emitter":13}],77:[function(t,e,i){"use strict";function n(t,e){var i={alpha:!0,preserveDrawingBuffer:e&&e.preserveDrawingBuffer};_&&"undefined"!=typeof WebGLDebugUtils&&(console.log("Using WebGL lost context simulator"),t=WebGLDebugUtils.makeLostContextSimulatingCanvas(t));var n=t.getContext&&(t.getContext("webgl",i)||t.getContext("experimental-webgl",i));if(!n)throw new Error("Could not get WebGL context");return _&&"undefined"!=typeof WebGLDebugUtils&&(n=WebGLDebugUtils.makeDebugContext(n),console.log("Using WebGL debug context")),n}function r(t){function e(t,e){return t===e}function i(t){return d(t.toString())}t=t||{};var r=this;this.constructor.super_.call(this,t),this._generateMipmaps=null!=t.generateMipmaps?t.generateMipmaps:!1,this._useTexSubImage2D=null!=t.useTexSubImage2D?t.useTexSubImage2D:!0,this._domElement=document.createElement("canvas"),f(this._domElement),v(this._domElement),this._gl=n(this._domElement,t),this._blendFuncStrings=t.blendFunc||["ONE","ONE_MINUS_SRC_ALPHA"],this._handleContextLoss=function(){r.emit("webglcontextlost"),r._gl=null},this._domElement.addEventListener("webglcontextlost",this._handleContextLoss),this._rendererInstances=new l(e,i)}function o(t,e,i){this._stage=t,this._gl=t._gl,this._texture=null,this._timestamp=null,this._width=this._height=null,this.refresh(e,i)}var s=t("./Stage"),a=t("../support/WebGl"),l=t("../collections/Map"),h=t("./loadImageHtml"),u=t("../util/inherits"),c=t("../util/defer"),p=t("../util/pixelRatio"),d=t("../util/hash"),f=t("../util/dom").setAbsolute,m=t("../util/dom").setPixelSize,v=t("../util/dom").setFullSize,_="undefined"!=typeof MARZIPANODEBUG&&MARZIPANODEBUG.webGl;u(r,s),r.prototype.destroy=function(){this.constructor.super_.prototype.destroy.call(this),this._domElement.removeEventListener("webglcontextlost",this._handleContextLoss),this._domElement=null,this._rendererInstances=null,this._gl=null},r.supported=function(){return a()},r.prototype.webGlContext=function(){return this._gl},r.prototype._updateSize=function(){var t=this._domElement,e=this._width,i=this._height,n=p();this._domElement.width=n*e,this._domElement.height=n*i,c(m.bind(null,t,e,i))},r.prototype.loadImage=h,r.prototype.maxTextureSize=function(){return this._gl.getParameter(this._gl.MAX_TEXTURE_SIZE)},r.prototype._validateLayer=function(t){var e=t.geometry().maxTileSize(),i=this.maxTextureSize();if(e>i)throw new Error("Layer has level with tile size larger than maximum texture size ("+e+" vs. "+i+")")},r.prototype.createRenderer=function(t){if(this._rendererInstances.has(t))return this._rendererInstances.get(t);var e=new t(this._gl);return this._rendererInstances.set(t,e),e},r.prototype.destroyRenderer=function(t){this._renderers.indexOf(t)<0&&(t.destroy(),this._rendererInstances.del(t.constructor))},r.prototype.startFrame=function(){var t=this._gl;if(!t)throw new Error("Bad WebGL context - maybe context was lost?");var e=this._width,i=this._height,n=p();t.viewport(0,0,n*e,n*i),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.enable(t.DEPTH_TEST),t.enable(t.BLEND),t.blendFunc(t[this._blendFuncStrings[0]],t[this._blendFuncStrings[1]])},r.prototype.endFrame=function(){},r.type=r.prototype.type="webgl",o.prototype.refresh=function(t,e){var i,n=this._gl,r=this._stage,o=e.timestamp();if(o!==this._timestamp){var s=e.element(),a=e.width(),l=e.height();if(a!==this._width||l!==this._height){var h=r.maxTextureSize();if(a>h)throw new Error("Texture width larger than max size ("+a+" vs. "+h+")");if(l>h)throw new Error("Texture height larger than max size ("+l+" vs. "+h+")");this._texture&&n.deleteTexture(i),i=this._texture=n.createTexture(),n.bindTexture(n.TEXTURE_2D,i),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!0),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,s)}else i=this._texture,n.bindTexture(n.TEXTURE_2D,i),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!0),r._useTexSubImage2D?n.texSubImage2D(n.TEXTURE_2D,0,0,0,n.RGBA,n.UNSIGNED_BYTE,s):n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,s);r._generateMipmaps?(n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR_MIPMAP_LINEAR),n.generateMipmap(n.TEXTURE_2D)):(n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR)),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.bindTexture(n.TEXTURE_2D,null),this._timestamp=o,this._width=a,this._height=l}},o.prototype.destroy=function(){var t=this._texture,e=this._gl;t&&e.deleteTexture(t),this._stage=null,this._gl=null,this._texture=null,this._timestamp=null,this._width=this._height=null},r.TextureClass=r.prototype.TextureClass=o,e.exports=r},{"../collections/Map":32,"../support/WebGl":82,"../util/defer":95,"../util/dom":98,"../util/hash":100,"../util/inherits":101,"../util/pixelRatio":105,"./Stage":76,"./loadImageHtml":79}],78:[function(t,e,i){"use strict";function n(t,e,i,n){function a(i,o){o===f&&(t._offCallback("imageLoaded",a),i?n(new r("Network error: "+e)):n(null,new s(h,f)))}function l(){h.cancelImage(f),t._offCallback("imageLoaded",a),n.apply(null,arguments)}var h=t._flashElement,u=i&&i.x||0,c=i&&i.y||0,p=i&&i.width||1,d=i&&i.height||1,f=h.loadImage(e,p,d,u,c);return n=o(n),t._onCallback("imageLoaded",a),l}var r=t("../NetworkError"),o=t("../util/once"),s=t("../assets/FlashImage");e.exports=n},{"../NetworkError":18,"../assets/FlashImage":25,"../util/once":104}],79:[function(t,e,i){"use strict";function n(t,e,i){function n(){l.onload=l.onerror=null,l.src="",i.apply(null,arguments)}var l=new Image;l.crossOrigin="anonymous";var h=e&&e.x||0,u=e&&e.y||0,c=e&&e.width||1,p=e&&e.height||1;return i=o(i),l.onload=function(){if(0===h&&0===u&&1===c&&1===p)i(null,new s(l));else{h*=l.naturalWidth,u*=l.naturalHeight,c*=l.naturalWidth,p*=l.naturalHeight;var t=document.createElement("canvas");t.width=c,t.height=p;var e=t.getContext("2d");e.drawImage(l,h,u,c,p,0,0,c,p),i(null,new a(t))}},l.onerror=function(){i(new r("Network error: "+t))},l.src=t,n}var r=t("../NetworkError"),o=t("../util/once"),s=t("../assets/StaticImage"),a=t("../assets/StaticCanvas");e.exports=n},{"../NetworkError":18,"../assets/StaticCanvas":26,"../assets/StaticImage":27,"../util/once":104}],80:[function(t,e,i){"use strict";function n(){var t=s("perspective"),e=document.createElement("div"),i="undefined"!=typeof e.style[t];if(i&&"WebkitPerspective"===t){var n="__marzipano_test_css3d_support__",r=document.createElement("style");r.textContent="@media(-webkit-transform-3d){#"+n+"{height: 3px;})",document.getElementsByTagName("head")[0].appendChild(r),e.id=n,document.body.appendChild(e),i=e.offsetHeight>0,r.parentNode.removeChild(r),e.parentNode.removeChild(e)}return i}function r(){return void 0!==o?o:o=n()}var o,s=t("../util/dom").prefixProperty;e.exports=r},{"../util/dom":98}],81:[function(t,e,i){"use strict";function n(){var t=null,e=navigator.plugins,i=navigator.mimeTypes,n=null;if(e&&e["Shockwave Flash"]&&i&&i["application/x-shockwave-flash"]&&i["application/x-shockwave-flash"].enabledPlugin)n=e["Shockwave Flash"].description,n=n.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),t=[0,0,0],t[0]=parseInt(n.replace(/^(.*)\..*$/,"$1"),10),t[1]=parseInt(n.replace(/^.*\.(.*)\s.*$/,"$1"),10),t[2]=/[a-zA-Z]/.test(n)?parseInt(n.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0;else if(window.ActiveXObject)try{var r=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");r&&(n=r.GetVariable("$version"))&&(n=n.split(" ")[1].split(","),t=[parseInt(n[0],10),parseInt(n[1],10),parseInt(n[2],10)])}catch(o){}return t}function r(){var t=n();return t&&(t[0]>=11||10===t[0]&&t[1]>=1)}function o(){return void 0!==s?s:s=r()}var s;e.exports=o},{}],82:[function(t,e,i){"use strict";function n(){var t=document.createElement("canvas"),e=t.getContext&&(t.getContext("webgl")||t.getContext("experimental-webgl"));return!!e}function r(){return void 0!==o?o:o=n()}var o;e.exports=r},{}],83:[function(t,e,i){"use strict";function n(){var t=document.createElement("a").style;t.cssText="pointer-events:auto";var e="auto"===t.pointerEvents,i=s.msie&&parseFloat(s.version)<11;return e&&!i}function r(){return void 0!==o?o:o=n()}var o,s=t("bowser");e.exports=r},{bowser:1}],84:[function(t,e,i){"use strict";function n(){return!!chooseBestStage()}e.exports=n},{}],85:[function(t,e,i){"use strict";function n(t){return function(e){var i,n;try{n=t()}catch(r){i=r}finally{e(i||null,i?null:n)}}}e.exports=n},{}],86:[function(t,e,i){"use strict";function n(t){return function(){function e(){n.apply(null,arguments)}if(!arguments.length)throw new Error("cancelized: expected at least one argument");var i=Array.prototype.slice.call(arguments,0),n=i[i.length-1]=r(i[i.length-1]);return t.apply(null,i),e}}var r=t("./once");e.exports=n},{"./once":104}],87:[function(t,e,i){"use strict";function n(){var t=Array.prototype.slice.call(arguments,0);return function(){function e(){var t=arguments[0];if(t)return o=s=null,void l.apply(null,arguments);if(!n.length)return o=s=null,void l.apply(null,arguments);o=n.shift();var i=o,r=Array.prototype.slice.call(arguments,1);r.push(e);var a=o.apply(null,r);if(i===o){if("function"!=typeof a)throw new Error("chain: chaining on non-cancellable function");s=a}}function i(){s&&s.apply(null,arguments)}var n=t.slice(0),o=null,s=null,a=arguments.length?Array.prototype.slice.call(arguments,0,arguments.length-1):[],l=arguments.length?arguments[arguments.length-1]:r;return a.unshift(null),e.apply(null,a),i}}var r=t("./noop");e.exports=n},{"./noop":103}],88:[function(t,e,i){"use strict";function n(t,e,i){return Math.min(Math.max(t,e),i)}e.exports=n},{}],89:[function(t,e,i){"use strict";function n(){return window.performance&&window.performance.now?function(){return window.performance.now()}:null}function r(){return function(){return Date.now()}}var o=n()||r();e.exports=o},{}],90:[function(t,e,i){"use strict";function n(t,e){return e>t?-1:t>e?1:0}e.exports=n},{}],91:[function(t,e,i){"use strict";function n(){var t=arguments;return function(e){for(var i=e,n=0;n<t.length;n++){var r=t[n];i=r.call(null,i)}return i}}e.exports=n},{}],92:[function(t,e,i){"use strict";function n(t,e,i){return 2*Math.atan(i*Math.tan(t/2)/e)}function r(t,e,i){return n(t,e,i)}function o(t,e,i){return n(t,e,Math.sqrt(e*e+i*i))}function s(t,e,i){return n(t,i,e)}function a(t,e,i){return n(t,i,Math.sqrt(e*e+i*i))}function l(t,e,i){return n(t,Math.sqrt(e*e+i*i),e)}function h(t,e,i){return n(t,Math.sqrt(e*e+i*i),i)}e.exports={convert:n,htov:r,htod:o,vtoh:s,vtod:a,dtoh:l,dtov:h}},{}],93:[function(t,e,i){"use strict";function n(t){return t.toPrecision(15)}e.exports=n},{}],94:[function(t,e,i){"use strict";function n(t,e){for(var i in e)i in t||(t[i]=e[i]);return t}e.exports=n},{}],95:[function(t,e,i){"use strict";function n(t,e){function i(){e&&e.length>0?t.apply(null,e):t()}setTimeout(i,0)}e.exports=n},{}],96:[function(t,e,i){"use strict";function n(t){return t*Math.PI/180}e.exports=n},{}],97:[function(t,e,i){"use strict";function n(t,e){function i(){null!=r&&(r=null,e(null))}function n(){null!=r&&(clearTimeout(r),r=null,e.apply(null,arguments))}var r=null;return r=setTimeout(i,t),n}e.exports=n},{}],98:[function(t,e,i){"use strict";function n(t){for(var e=document.documentElement.style,i=["Moz","Webkit","Khtml","O","ms"],n=0;n<i.length;n++){var r=i[n],o=t[0].toUpperCase()+t.slice(1),s=r+o;if(s in e)return s}return t}function r(t){var e=n(t);return function(t){return t.style[e]}}function o(t){var e=n(t);return function(t,i){return t.style[e]=i}}function s(t){_(t,"translateZ(0)")}function a(t){y(t,"0 0 0")}function l(t){t.style.position="absolute"}function h(t,e,i){t.style.left=e+"px",t.style.top=i+"px"}function u(t,e,i){t.style.width=e+"px",t.style.height=i+"px"}function c(t){t.style.width=t.style.height=0}function p(t){t.style.width=t.style.height="100%"}function d(t){t.style.overflow="hidden"}function f(t){t.style.overflow="visible"}function m(t){t.style.pointerEvents="none"}function v(t){t.style.backgroundColor="#000",t.style.opacity="0",t.style.filter="alpha(opacity=0)"}var _=o("transform"),y=o("transformOrigin");e.exports={prefixProperty:n,getWithVendorPrefix:r,setWithVendorPrefix:o,setTransform:_,setTransformOrigin:y,setNullTransform:s,setNullTransformOrigin:a,setAbsolute:l,setPixelPosition:h,setPixelSize:u,setNullSize:c,setFullSize:p,setOverflowHidden:d,setOverflowVisible:f,setNoPointerEvents:m,setBlocking:v}},{}],99:[function(t,e,i){"use strict";function n(t,e){for(var i in e)t[i]=e[i];return t}e.exports=n},{}],100:[function(t,e,i){"use strict";function n(){for(var t=0,e=0;e<arguments.length;e++){var i=arguments[e];t+=i,t+=i<<10,t^=i>>6}return t+=t<<3,t^=t>>11,t+=t<<15,t>=0?t:-t}e.exports=n},{}],101:[function(t,e,i){"use strict";function n(t,e){t.super_=e;var i=function(){};i.prototype=e.prototype,t.prototype=new i,t.prototype.constructor=t}e.exports=n},{}],102:[function(t,e,i){"use strict";function n(t,e){return(+t%(e=+e)+e)%e}e.exports=n},{}],103:[function(t,e,i){"use strict";function n(){}e.exports=n},{}],104:[function(t,e,i){"use strict";function n(t){var e,i=!1;return function(){return i||(i=!0,e=t.apply(null,arguments)),e}}e.exports=n},{}],105:[function(t,e,i){"use strict";function n(){if("undefined"!=typeof window){if(window.devicePixelRatio)return window.devicePixelRatio;var t=window.screen;if(t&&t.deviceXDPI&&t.logicalXDPI)return t.deviceXDPI/t.logicalXDPI;if(t&&t.systemXDPI&&t.logicalXDPI)return t.systemXDPI/t.logicalXDPI}return r}var r=1;e.exports=n},{}],106:[function(t,e,i){"use strict";function n(t){return 180*t/Math.PI}e.exports=n},{}],107:[function(t,e,i){"use strict";function n(t){return"number"==typeof t&&isFinite(t)}e.exports=n},{}],108:[function(t,e,i){"use strict";function n(t){return function(){function e(){var e=arguments[0];!e||s?n.apply(null,arguments):o=t.apply(null,i)}var i=arguments.length?Array.prototype.slice.call(arguments,0,arguments.length-1):[],n=arguments.length?arguments[arguments.length-1]:r,o=null,s=!1;return i.push(e),e(!0),function(){s=!0,o.apply(null,arguments)}}}var r=t("./noop");e.exports=n},{"./noop":103}],109:[function(t,e,i){"use strict";function n(t,e,i,n,l){return o.copy(a,s),i&&o.rotateY(a,a,i),n&&o.rotateX(a,a,n),l&&o.rotateZ(a,a,l),r.transformMat4(t,e,a),t}var r=t("gl-matrix/src/gl-matrix/vec3"),o=t("gl-matrix/src/gl-matrix/mat4"),s=o.identity(o.create()),a=o.create();e.exports=n},{"gl-matrix/src/gl-matrix/mat4":7,"gl-matrix/src/gl-matrix/vec3":10}],110:[function(t,e,i){"use strict";function n(t,e,i){function n(){if(!o){var a=(r()-s)/t;1>a?(e(a),requestAnimationFrame(n)):(e(1),i())}}var o=!1,s=r();return e(0),requestAnimationFrame(n),function(){o=!0,i.apply(null,arguments)}}var r=t("./clock");e.exports=n},{"./clock":89}],111:[function(t,e,i){"use strict";function n(t){var e=typeof t;if("object"===e){if(null===t)return"null";if("[object Array]"===Object.prototype.toString.call(t))return"array";if("[object RegExp]"===Object.prototype.toString.call(t))return"regexp"}return e}e.exports=n},{}],112:[function(t,e,i){"use strict";function n(t,e){if(!t||null==t.mediaAspectRatio)throw new Error("mediaAspectRatio must be defined");this._x=t&&null!=t.x?t.x:p,this._y=t&&null!=t.y?t.y:d,this._zoom=t&&null!=t.zoom?t.zoom:f,this._mediaAspectRatio=t.mediaAspectRatio,this._width=t&&null!=t.width?t.width:u,this._height=t&&null!=t.height?t.height:c,this._limiter=e||null,this._viewFrustum=[0,0,0,0],this._projectionMatrix=l.create(),this._projectionChanged=!0,this._params={},this._vertex=h.create(),this._invProj=l.create(),this._update()}var r=t("minimal-event-emitter"),o=t("../util/pixelRatio"),s=t("../util/real"),a=t("../util/clamp"),l=t("gl-matrix/src/gl-matrix/mat4"),h=t("gl-matrix/src/gl-matrix/vec4"),u=0,c=0,p=.5,d=.5,f=1,m=[1,0,1,0],v=[-1,-1,1,1],_=1e-9;r(n),n.prototype.destroy=function(){this._x=null,this._y=null,this._zoom=null,this._mediaAspectRatio=null,this._width=null,this._height=null,this._limiter=null,this._viewFrustum=null,this._projectionMatrix=null,this._projectionChanged=null,this._params=null,this._vertex=null,this._invProj=null},n.prototype.x=function(){return this._x},n.prototype.y=function(){return this._y},n.prototype.zoom=function(){return this._zoom},n.prototype.mediaAspectRatio=function(){return this._mediaAspectRatio},n.prototype.width=function(){return this._width},n.prototype.height=function(){return this._height},n.prototype.size=function(t){return t=t||{},t.width=this._width,t.height=this._height,t},n.prototype.parameters=function(t){return t=t||{},t.x=this._x,t.y=this._y,t.zoom=this._zoom,t.mediaAspectRatio=this._mediaAspectRatio,t},n.prototype.limiter=function(){return this._limiter},n.prototype.setX=function(t){this._resetParams(),this._params.x=t,this._update(this._params)},n.prototype.setY=function(t){this._resetParams(),this._params.y=t,this._update(this._params)},n.prototype.setZoom=function(t){this._resetParams(),this._params.zoom=t,this._update(this._params)},n.prototype.offsetX=function(t){this.setX(this._x+t)},n.prototype.offsetY=function(t){this.setY(this._y+t)},n.prototype.offsetZoom=function(t){this.setZoom(this._zoom+t)},n.prototype.setMediaAspectRatio=function(t){this._resetParams(),this._params.mediaAspectRatio=t,this._update(this._params)},n.prototype.setSize=function(t){this._resetParams(),this._params.width=t.width,this._params.height=t.height,this._update(this._params)},n.prototype.setParameters=function(t){this._resetParams();var e=this._params;e.x=t.x,e.y=t.y,e.zoom=t.zoom,e.mediaAspectRatio=t.mediaAspectRatio,this._update(e)},n.prototype.setLimiter=function(t){this._limiter=t||null,this._update()},n.prototype._resetParams=function(){var t=this._params;t.x=null,t.y=null,t.zoom=null,t.mediaAspectRatio=null,t.width=null,t.height=null},n.prototype._update=function(t){null==t&&(this._resetParams(),t=this._params);var e=this._x,i=this._y,n=this._zoom,r=this._mediaAspectRatio,o=this._width,l=this._height;if(t.x=null!=t.x?t.x:e,t.y=null!=t.y?t.y:i,t.zoom=null!=t.zoom?t.zoom:n,t.mediaAspectRatio=null!=t.mediaAspectRatio?t.mediaAspectRatio:r,t.width=null!=t.width?t.width:o,t.height=null!=t.height?t.height:l,this._limiter&&(t=this._limiter(t),!t))throw new Error("Bad view limiter");var h=t.x,u=t.y,c=t.zoom,p=t.mediaAspectRatio,d=t.width,f=t.height;if(!(s(h)&&s(u)&&s(c)&&s(p)&&s(d)&&s(f)))throw new Error("Bad view - suspect a broken limiter");c=a(c,_,1/0),this._x=h,this._y=u,this._zoom=c,this._mediaAspectRatio=p,this._width=d,this._height=f,h===e&&u===i&&c===n&&p===r&&d===o&&f===l||(this._projectionChanged=!0,this.emit("change")),d===o&&f===l||this.emit("resize")},n.prototype._zoomX=function(){return this._zoom},n.prototype._zoomY=function(){var t=this._mediaAspectRatio,e=this._width/this._height,i=this._zoom,n=i*t/e;return isNaN(n)&&(n=i),n},n.prototype.updateWithControlParameters=function(t){var e=this.zoom(),i=this._zoomX(),n=this._zoomY();this.offsetX(t.axisScaledX*i+t.x*e),this.offsetY(t.axisScaledY*n+t.y*e),this.offsetZoom(t.zoom*e)},n.prototype.projection=function(){var t=this._projectionMatrix;if(this._projectionChanged){var e=this._x,i=this._y,n=this._zoomX(),r=this._zoomY(),o=this._viewFrustum,s=o[0]=.5-i+.5*r,a=o[1]=e-.5+.5*n,h=o[2]=.5-i-.5*r,u=o[3]=e-.5-.5*n;l.ortho(t,u,a,h,s,-1,1),this._projectionChanged=!1}return t},n.prototype.intersects=function(t){var e=this._viewFrustum;this.projection();for(var i=0;i<e.length;i++){for(var n=e[i],r=m[i],o=v[i],s=!1,a=0;a<t.length;a++){var l=t[a];if(0>o&&l[r]<n||o>0&&l[r]>n){s=!0;break}}if(!s)return!1}return!0},n.prototype.selectLevel=function(t){for(var e=o()*this.width(),i=this._zoom,n=0;n<t.length;n++){var r=t[n];if(i*r.width()>=e)return r}return t[t.length-1]},n.prototype.coordinatesToScreen=function(t,e){var i=this._vertex;e||(e={});var n=this._width,r=this._height;if(0>=n||0>=r)return e.x=null,e.y=null,null;var o=t&&null!=t.x?t.x:p,s=t&&null!=t.y?t.y:d;h.set(i,o-.5,.5-s,-1,1),h.transformMat4(i,i,this.projection());for(var a=0;3>a;a++)i[a]/=i[3];return e.x=n*(i[0]+1)/2,e.y=r*(1-i[1])/2,e},n.prototype.screenToCoordinates=function(t,e){var i=this._vertex,n=this._invProj;e||(e={});var r=this._width,o=this._height;l.invert(n,this.projection());var s=2*t.x/r-1,a=1-2*t.y/o;return h.set(i,s,a,1,1),h.transformMat4(i,i,n),e.x=.5+i[0],e.y=.5-i[1],e},n.limit={x:function(t,e){return function(i){return i.x=a(i.x,t,e),i}},y:function(t,e){return function(i){return i.y=a(i.y,t,e),i}},zoom:function(t,e){return function(i){return i.zoom=a(i.zoom,t,e),i}},resolution:function(t){return function(e){if(e.width<=0||e.height<=0)return e;var i=e.width,n=o()*i/t;return e.zoom=a(e.zoom,n,1/0),e}},visibleX:function(t,e){return function(i){var n=e-t;i.zoom>n&&(i.zoom=n);var r=t+.5*i.zoom,o=e-.5*i.zoom;return i.x=a(i.x,r,o),i}},visibleY:function(t,e){return function(i){if(i.width<=0||i.height<=0)return i;var n=i.width/i.height,r=n/i.mediaAspectRatio,o=(e-t)*r;i.zoom>o&&(i.zoom=o);var s=t+.5*i.zoom/r,l=e-.5*i.zoom/r;return i.y=a(i.y,s,l),i}},letterbox:function(){return function(t){if(t.width<=0||t.height<=0)return t;var e=t.width/t.height,i=1,n=e/t.mediaAspectRatio;t.mediaAspectRatio>=e&&(t.zoom=Math.min(t.zoom,i)),t.mediaAspectRatio<=e&&(t.zoom=Math.min(t.zoom,n));var r,o;t.zoom>i?r=o=.5:(r=0+.5*t.zoom/i,o=1-.5*t.zoom/i);var s,l;return t.zoom>n?s=l=.5:(s=0+.5*t.zoom/n,l=1-.5*t.zoom/n),t.x=a(t.x,r,o),t.y=a(t.y,s,l),t}}},n.type=n.prototype.type="flat",e.exports=n},{"../util/clamp":88,"../util/pixelRatio":105,"../util/real":107,"gl-matrix/src/gl-matrix/mat4":7,"gl-matrix/src/gl-matrix/vec4":11,"minimal-event-emitter":13}],113:[function(t,e,i){"use strict";function n(t,e){this._yaw=t&&null!=t.yaw?t.yaw:y,this._pitch=t&&null!=t.pitch?t.pitch:g,this._roll=t&&null!=t.roll?t.roll:x,this._fov=t&&null!=t.fov?t.fov:M,this._width=t&&null!=t.width?t.width:v,this._height=t&&null!=t.height?t.height:_,this._projectionCenterX=t&&null!=t.projectionCenterX?t.projectionCenterX:w,this._projectionCenterY=t&&null!=t.projectionCenterY?t.projectionCenterY:b,this._limiter=e||null,this._projectionMatrix=f.create(),this._projectionChanged=!0,this._viewFrustum=[m.create(),m.create(),m.create(),m.create(),m.create()],this._params={},this._vertex=m.create(),this._invProj=f.create(),this._update()}var r=t("minimal-event-emitter"),o=t("../util/pixelRatio"),s=t("../util/convertFov"),a=t("../util/rotateVector"),l=t("../util/mod"),h=t("../util/real"),u=t("../util/clamp"),c=t("../util/decimal"),p=t("../util/compose"),d=t("./projectionCenter"),f=t("gl-matrix/src/gl-matrix/mat4"),m=t("gl-matrix/src/gl-matrix/vec4"),v=0,_=0,y=0,g=0,x=0,M=Math.PI/4,w=0,b=0,S=1e-9;r(n),n.prototype.destroy=function(){this._yaw=null,this._pitch=null,this._roll=null,this._fov=null,this._width=null,this._height=null,this._limiter=null,this._projectionChanged=null,this._projectionMatrix=null,this._viewFrustum=null,this._params=null,this._vertex=null,this._invProj=null},n.prototype.yaw=function(){return this._yaw},n.prototype.pitch=function(){return this._pitch},n.prototype.roll=function(){return this._roll},n.prototype.projectionCenterX=function(){return this._projectionCenterX},n.prototype.projectionCenterY=function(){return this._projectionCenterY},n.prototype.fov=function(){return this._fov},n.prototype.width=function(){return this._width},n.prototype.height=function(){return this._height},n.prototype.size=function(t){return t||(t={}),t.width=this._width,t.height=this._height,t},n.prototype.parameters=function(t){return t||(t={}),t.yaw=this._yaw,t.pitch=this._pitch,t.roll=this._roll,t.fov=this._fov,t},n.prototype.limiter=function(){return this._limiter},n.prototype.setYaw=function(t){this._resetParams(),this._params.yaw=t,this._update(this._params)},n.prototype.setPitch=function(t){this._resetParams(),this._params.pitch=t,this._update(this._params)},n.prototype.setRoll=function(t){this._resetParams(),this._params.roll=t,this._update(this._params)},n.prototype.setFov=function(t){this._resetParams(),this._params.fov=t,this._update(this._params)},n.prototype.setProjectionCenterX=function(t){this._resetParams(),this._params.projectionCenterX=t,this._update(this._params)},n.prototype.setProjectionCenterY=function(t){this._resetParams(),this._params.projectionCenterY=t,this._update(this._params)},n.prototype.offsetYaw=function(t){this.setYaw(this._yaw+t)},n.prototype.offsetPitch=function(t){this.setPitch(this._pitch+t)},n.prototype.offsetRoll=function(t){this.setRoll(this._roll+t)},n.prototype.offsetFov=function(t){this.setFov(this._fov+t)},n.prototype.setSize=function(t){this._resetParams(),this._params.width=t.width,this._params.height=t.height,this._update(this._params)},n.prototype.setParameters=function(t){this._resetParams();var e=this._params;e.yaw=t.yaw,e.pitch=t.pitch,e.roll=t.roll,e.fov=t.fov,e.projectionCenterX=t.projectionCenterX,e.projectionCenterY=t.projectionCenterY,this._update(e)},n.prototype.setLimiter=function(t){this._limiter=t||null,this._update()},n.prototype._resetParams=function(){var t=this._params;t.yaw=null,t.pitch=null,t.roll=null,t.fov=null,t.width=null,t.height=null},n.prototype._update=function(t){null==t&&(this._resetParams(),t=this._params);var e=this._yaw,i=this._pitch,n=this._roll,r=this._fov,o=this._projectionCenterX,s=this._projectionCenterY,a=this._width,l=this._height;
if(t.yaw=null!=t.yaw?t.yaw:e,t.pitch=null!=t.pitch?t.pitch:i,t.roll=null!=t.roll?t.roll:n,t.fov=null!=t.fov?t.fov:r,t.width=null!=t.width?t.width:a,t.height=null!=t.height?t.height:l,t.projectionCenterX=null!=t.projectionCenterX?t.projectionCenterX:o,t.projectionCenterY=null!=t.projectionCenterY?t.projectionCenterY:s,this._limiter&&(t=this._limiter(t),!t))throw new Error("Bad view limiter");t=this._normalize(t);var u=t.yaw,c=t.pitch,p=t.roll,d=t.fov,f=t.width,m=t.height,v=t.projectionCenterX,_=t.projectionCenterY;if(!(h(u)&&h(c)&&h(p)&&h(d)&&h(f)&&h(m)&&h(v)&&h(_)))throw new Error("Bad view - suspect a broken limiter");this._yaw=u,this._pitch=c,this._roll=p,this._fov=d,this._width=f,this._height=m,this._projectionCenterX=v,this._projectionCenterY=_,u===e&&c===i&&p===n&&d===r&&f===a&&m===l&&v===o&&_===s||(this._projectionChanged=!0,this.emit("change")),f===a&&m===l||this.emit("resize")},n.prototype._normalize=function(t){this._normalizeCoordinates(t);var e=s.htov(Math.PI,t.width,t.height),i=isNaN(e)?Math.PI:Math.min(Math.PI,e);return t.fov=u(t.fov,S,i-S),t},n.prototype._normalizeCoordinates=function(t){return"yaw"in t&&(t.yaw=l(t.yaw-Math.PI,-2*Math.PI)+Math.PI),"pitch"in t&&(t.pitch=l(t.pitch-Math.PI,-2*Math.PI)+Math.PI),"roll"in t&&(t.roll=l(t.roll-Math.PI,-2*Math.PI)+Math.PI),t},n.prototype.normalizeToClosest=function(t,e){var i=this._yaw,n=this._pitch,r=t.yaw,o=t.pitch,s=r-2*Math.PI,a=r+2*Math.PI;Math.abs(s-i)<Math.abs(r-i)?r=s:Math.abs(a-i)<Math.abs(r-i)&&(r=a);var l=o-2*Math.PI,h=o+2*Math.PI;return Math.abs(l-n)<Math.abs(o-n)?o=l:Math.abs(l-n)<Math.abs(o-n)&&(o=h),e=e||{},e.yaw=r,e.pitch=o,e},n.prototype.updateWithControlParameters=function(t){var e=this._fov,i=s.vtoh(e,this._width,this._height);isNaN(i)&&(i=e),this.offsetYaw(t.axisScaledX*i+2*t.x*i+t.yaw),this.offsetPitch(t.axisScaledY*e+2*t.y*i+t.pitch),this.offsetRoll(-t.roll),this.offsetFov(t.zoom*e)},n.prototype.projection=function(){var t=this._projectionMatrix,e=this._viewFrustum;if(this._projectionChanged){var i=this._fov,n=s.vtoh(i,this._width,this._height);d.viewParamsToProjectionMatrix(this._projectionCenterX,this._projectionCenterY,i,n,-1,1,t),f.rotateZ(t,t,this._roll),f.rotateX(t,t,this._pitch),f.rotateY(t,t,this._yaw),m.set(e[0],t[3]+t[0],t[7]+t[4],t[11]+t[8],0),m.set(e[1],t[3]-t[0],t[7]-t[4],t[11]-t[8],0),m.set(e[2],t[3]+t[1],t[7]+t[5],t[11]+t[9],0),m.set(e[3],t[3]-t[1],t[7]-t[5],t[11]-t[9],0),m.set(e[4],t[3]+t[2],t[7]+t[6],t[11]+t[10],0),this._projectionChanged=!1}return t},n.prototype.intersects=function(t){var e=this._viewFrustum,i=this._vertex;this.projection();for(var n=0;n<e.length;n++){for(var r=e[n],o=!1,s=0;s<t.length;s++){var a=t[s];m.set(i,a[0],a[1],a[2],0),m.dot(r,i)>=0&&(o=!0)}if(!o)return!1}return!0},n.prototype.selectLevel=function(t){for(var e=o()*this._height,i=Math.tan(.5*this._fov),n=0;n<t.length;n++){var r=t[n];if(i*r.height()>=e)return r}return t[t.length-1]},n.prototype.coordinatesToScreen=function(t,e){var i=this._vertex;e||(e={});var n=this._width,r=this._height;if(0>=n||0>=r)return e.x=null,e.y=null,null;var o=t&&null!=t.yaw?t.yaw:y,s=t&&null!=t.pitch?t.pitch:g,l=t&&null!=t.roll?t.roll:x;m.set(i,0,0,-1,1),a(i,i,-o,-s,-l),m.transformMat4(i,i,this.projection());for(var h=0;3>h;h++)i[h]/=i[3];return i[2]>=0?(e.x=n*(i[0]+1)/2,e.y=r*(1-i[1])/2,e):(e.x=null,e.y=null,null)},n.prototype.screenToCoordinates=function(t,e){var i=this._vertex,n=this._invProj;e||(e={});var r=this._width,o=this._height;f.invert(n,this.projection());var s=2*t.x/r-1,a=1-2*t.y/o;m.set(i,s,a,1,1),m.transformMat4(i,i,n);var l=Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2]);return e.yaw=Math.atan2(i[0],-i[2]),e.pitch=Math.acos(i[1]/l)-Math.PI/2,this._normalizeCoordinates(e),e},n.prototype.coordinatesToPerspectiveTransform=function(t,e,i){i=i||"";var n=this._height,r=this._width,o=this._fov,s=.5*n/Math.tan(o/2),a="";return a+="translateX("+c(r/2)+"px) translateY("+c(n/2)+"px) ",a+="translateX(-50%) translateY(-50%) ",a+="perspective("+c(s)+"px) ",a+="translateZ("+c(s)+"px) ",a+="rotateZ("+c(-this._roll)+"rad) ",a+="rotateX("+c(-this._pitch)+"rad) ",a+="rotateY("+c(this._yaw)+"rad) ",a+="rotateY("+c(-t.yaw)+"rad) ",a+="rotateX("+c(t.pitch)+"rad) ",a+="translateZ("+c(-e)+"px) ",a+=i+" "},n.limit={yaw:function(t,e){return function(i){return i.yaw=u(i.yaw,t,e),i}},pitch:function(t,e){return function(i){return i.pitch=u(i.pitch,t,e),i}},roll:function(t,e){return function(i){return i.roll=u(i.roll,t,e),i}},hfov:function(t,e){return function(i){var n=i.width,r=i.height;if(n>0&&r>0){var o=s.htov(t,n,r),a=s.htov(e,n,r);i.fov=u(i.fov,o,a)}return i}},vfov:function(t,e){return function(i){return i.fov=u(i.fov,t,e),i}},resolution:function(t){return function(e){var i=e.height;if(i){var n=o()*i,r=2*Math.atan(n/t);e.fov=u(e.fov,r,1/0)}return e}},traditional:function(t,e,i){return i=null!=i?i:e,p(n.limit.resolution(t),n.limit.vfov(0,e),n.limit.hfov(0,i),n.limit.pitch(-Math.PI/2,Math.PI/2))}},n.projectionCenter=d,n.type=n.prototype.type="rectilinear",e.exports=n},{"../util/clamp":88,"../util/compose":91,"../util/convertFov":92,"../util/decimal":93,"../util/mod":102,"../util/pixelRatio":105,"../util/real":107,"../util/rotateVector":109,"./projectionCenter":114,"gl-matrix/src/gl-matrix/mat4":7,"gl-matrix/src/gl-matrix/vec4":11,"minimal-event-emitter":13}],114:[function(t,e,i){"use strict";function n(t,e,i,n,r){r=r||{};var o=Math.atan(2*e*Math.tan(i/2));r.up=i/2+o,r.down=i/2-o;var s=Math.atan(2*t*Math.tan(n/2));return r.left=n/2+s,r.right=n/2-s,r}function r(t,e,i,n,r){r=r||{};var o=t+e,s=t-o/2,a=Math.tan(s)/(2*Math.tan(o/2)),l=n+i,h=i-l/2,u=Math.tan(h)/(2*Math.tan(l/2));return r.vfov=o,r.hfov=l,r.projectionCenterX=u,r.projectionCenterY=a,r}function o(t,e,i,n,r,o,s){var a=Math.tan(t),l=Math.tan(e),h=Math.tan(i),u=Math.tan(n),c=2/(h+u),p=2/(a+l);s[0]=c,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=p,s[6]=0,s[7]=0,s[8]=-((h-u)*c*.5),s[9]=(a-l)*p*.5,s[10]=-(r+o)/(o-r),s[11]=-1,s[12]=0,s[13]=0,s[14]=-(2*o*r)/(o-r),s[15]=0}function s(t,e,i,r,s,l,h){n(t,e,i,r,a),o(a.up,a.down,a.left,a.right,s,l,h)}var a={};e.exports={viewParamsToVrFovs:n,vrFovsToViewParams:r,vrFovsToProjectionMatrix:o,viewParamsToProjectionMatrix:s}},{}],115:[function(t,e,i){e.exports="0.5.0"},{}]},{},[57])(57)});;'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Creates a 360 virtual gallery, with before and after support.
 */
var mjh360 = function () {

  /**
   * @param sceneList array An array of objects including name, thumb, before and after
   * @return mjh360 The new mjh360 class
   */
  function mjh360(element, sceneList) {
    var _this = this;

    _classCallCheck(this, mjh360);

    //Hook the viewport container.
    this.viewport = element.querySelector('.vr-viewport');

    //Hook the time travelling buttons.
    this.goBackwardsInTime = element.querySelector('.vr-before');
    this.goForwardsInTime = element.querySelector('.vr-after');
    this.navigation = element.querySelector('.vr-nav');

    this.goBackwardsInTime.addEventListener('click', function (e) {
      return _this.sceneGoToTime(e, 'before');
    });
    this.goForwardsInTime.addEventListener('click', function (e) {
      return _this.sceneGoToTime(e, 'after');
    });

    //Create our scene container.
    this.scenes = [];

    // Create viewer.
    this.viewer = new Marzipano.Viewer(this.viewport);

    // Create geometry.
    this.geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

    // Create view.
    this.limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180);
    this.view = new Marzipano.RectilinearView({ yaw: Math.PI }, this.limiter);

    //Build the scenes.

    var _loop = function _loop() {
      var sceneData = sceneList[i];

      sceneData.beforeSrc = Marzipano.ImageUrlSource.fromString(sceneData.before);
      sceneData.afterSrc = Marzipano.ImageUrlSource.fromString(sceneData.after);
      sceneData.beforeScene = _this.viewer.createScene({
        source: sceneData.beforeSrc,
        geometry: _this.geometry,
        view: _this.view,
        pinFirstLevel: true
      });

      if (sceneData.hasOwnProperty('after')) {

        sceneData.afterScene = _this.viewer.createScene({
          source: sceneData.afterSrc,
          geometry: _this.geometry,
          view: _this.view,
          pinFirstLevel: true
        });
      } else {
        sceneData.afterScene = false;
      }

      //Add nav item.
      sceneData.navButton = document.createElement('a');
      sceneData.navButton.className = 'nav-button';

      var img = document.createElement('img');
      img.src = sceneData.thumb;

      pr = _this;

      (function (i) {
        var dynamicOnHook = function dynamicOnHook(e) {
          e.preventDefault();
          pr.sceneActivate(false, i);
          this.classList.add('active');
        };

        sceneData.navButton.addEventListener('click', dynamicOnHook);
        sceneData.navButton.addEventListener('touchstart', dynamicOnHook);
      })(i);

      sceneData.navButton.appendChild(img);
      _this.navigation.appendChild(sceneData.navButton);

      _this.scenes.push(sceneData);

      _this.currentScene = 0;
      _this.currentTime = "before";
    };

    for (var i = 0; i < sceneList.length; i++) {
      var pr;

      _loop();
    }
  }

  /**
   * Renders the view
   * @return void
   */


  _createClass(mjh360, [{
    key: 'render',
    value: function render() {

      // Display scene.
      if (this.scenes.length < 1) {
        console.error('There are no scenes to view.');
        return false;
      }

      this.navigation.classList.add('vr-nav-active');
      this.scenes[0].navButton.classList.add('active');
      this.scenes[0].beforeScene.switchTo();
    }

    /**
     * Changes the current time of a scene to either before or after
     * @param e event The event emitter from a handler
     * @param time  string  Either "before" or "after"
     */

  }, {
    key: 'sceneGoToTime',
    value: function sceneGoToTime(e, time) {
      if (typeof e !== 'undefined' && e) e.preventDefault();

      if (this.currentTime === time) {
        console.warn('Already on ' + time + ', not changing.');
        return false;
      }

      var sceneSelector = this.sceneTimeToSelector(time);

      if (time === "after" && this.scenes[this.currentScene][sceneSelector] === false) {
        //Auto change to before.
        this.sceneGoToTime(false, 'before');
        return false;
      }

      if (time === "before") {
        this.goBackwardsInTime.classList.add('vr-button-inactive');
        this.goForwardsInTime.classList.remove('vr-button-inactive');
      } else if (time === "after") {
        this.goForwardsInTime.classList.add('vr-button-inactive');
        this.goBackwardsInTime.classList.remove('vr-button-inactive');
      }

      this.scenes[this.currentScene][sceneSelector].switchTo();
      this.currentTime = time;
    }

    /**
     * Calculates a scene selector from a requested time
     * @param time string Before or after
     * @return string beforeScene or afterScene
     */

  }, {
    key: 'sceneTimeToSelector',
    value: function sceneTimeToSelector(time) {

      var sceneSelector;
      if (time === "before") {
        sceneSelector = "beforeScene";
        this.goBackwardsInTime.classList.add('vr-button-inactive');
        this.goForwardsInTime.classList.remove('vr-button-inactive');
      } else if (time === "after") {
        sceneSelector = "afterScene";
        this.goForwardsInTime.classList.add('vr-button-inactive');
        this.goBackwardsInTime.classList.remove('vr-button-inactive');
      } else {
        sceneSelector = "before";
      }

      return sceneSelector;
    }

    /**
     * Activates a scene
     * @param e event The event emitter from a handler
     * @param scene int The scene number
     */

  }, {
    key: 'sceneActivate',
    value: function sceneActivate(e, scene) {
      if (typeof e !== 'undefined' && e) e.preventDefault();

      var goToTime = this.currentTime;

      if (!this.scenes[this.currentScene]) {
        console.warn('No scene found with this ID.');
        return false;
      }

      this.scenes[this.currentScene].navButton.classList.remove('active');
      this.currentScene = scene;
      this.currentTime = false;

      this.sceneGoToTime(false, goToTime);
    }
  }]);

  return mjh360;
}();

//# sourceMappingURL=mjh360.js.map