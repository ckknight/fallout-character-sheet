(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ((function(modules) {
	// Check all modules for deduplicated modules
	for(var i in modules) {
		if(Object.prototype.hasOwnProperty.call(modules, i)) {
			switch(typeof modules[i]) {
			case "function": break;
			case "object":
				// Module can be created from a template
				modules[i] = (function(_m) {
					var args = _m.slice(1), fn = modules[_m[0]];
					return function (a,b,c) {
						fn.apply(this, [a,b,c].concat(args));
					};
				}(modules[i]));
				break;
			default:
				// Module is a copy of another module
				modules[i] = modules[modules[i]];
				break;
			}
		}
	}
	return modules;
}([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	var _cycleCore = __webpack_require__(2);
	
	var _cycleDom = __webpack_require__(6);
	
	var _componentsCharacterSheet = __webpack_require__(170);
	
	var _componentsCharacterSheet2 = _interopRequireDefault(_componentsCharacterSheet);
	
	var _drivers = __webpack_require__(176);
	
	(0, _cycleCore.run)(_componentsCharacterSheet2['default'], {
	    DOM: (0, _cycleDom.makeDOMDriver)('.character-sheet'),
	    localStorageSink: (0, _drivers.makeLocalStorageSinkDriver)('sheet'),
	    localStorageSource: (0, _drivers.makeLocalStorageSourceDriver)('sheet')
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};
	
	exports.__esModule = true;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Rx = __webpack_require__(95);
	
	function makeRequestProxies(drivers) {
	  var requestProxies = {};
	  for (var _name in drivers) {
	    if (drivers.hasOwnProperty(_name)) {
	      requestProxies[_name] = new Rx.ReplaySubject(1);
	    }
	  }
	  return requestProxies;
	}
	
	function callDrivers(drivers, requestProxies) {
	  var responses = {};
	  for (var _name2 in drivers) {
	    if (drivers.hasOwnProperty(_name2)) {
	      responses[_name2] = drivers[_name2](requestProxies[_name2], _name2);
	    }
	  }
	  return responses;
	}
	
	function attachDisposeToRequests(requests, replicationSubscription) {
	  Object.defineProperty(requests, "dispose", {
	    enumerable: false,
	    value: function value() {
	      replicationSubscription.dispose();
	    }
	  });
	  return requests;
	}
	
	function makeDisposeResponses(responses) {
	  return function dispose() {
	    for (var _name3 in responses) {
	      if (responses.hasOwnProperty(_name3) && typeof responses[_name3].dispose === "function") {
	        responses[_name3].dispose();
	      }
	    }
	  };
	}
	
	function attachDisposeToResponses(responses) {
	  Object.defineProperty(responses, "dispose", {
	    enumerable: false,
	    value: makeDisposeResponses(responses)
	  });
	  return responses;
	}
	
	function logToConsoleError(err) {
	  var target = err.stack || err;
	  if (console && console.error) {
	    console.error(target);
	  }
	}
	
	function replicateMany(observables, subjects) {
	  return Rx.Observable.create(function (observer) {
	    var subscription = new Rx.CompositeDisposable();
	    setTimeout(function () {
	      for (var _name4 in observables) {
	        if (observables.hasOwnProperty(_name4) && subjects.hasOwnProperty(_name4) && !subjects[_name4].isDisposed) {
	          subscription.add(observables[_name4].doOnError(logToConsoleError).subscribe(subjects[_name4].asObserver()));
	        }
	      }
	      observer.onNext(subscription);
	    }, 1);
	
	    return function dispose() {
	      subscription.dispose();
	      for (var x in subjects) {
	        if (subjects.hasOwnProperty(x)) {
	          subjects[x].dispose();
	        }
	      }
	    };
	  });
	}
	
	function isObjectEmpty(obj) {
	  for (var key in obj) {
	    if (obj.hasOwnProperty(key)) {
	      return false;
	    }
	  }
	  return true;
	}
	
	function run(main, drivers) {
	  if (typeof main !== "function") {
	    throw new Error("First argument given to Cycle.run() must be the 'main' " + "function.");
	  }
	  if (typeof drivers !== "object" || drivers === null) {
	    throw new Error("Second argument given to Cycle.run() must be an object " + "with driver functions as properties.");
	  }
	  if (isObjectEmpty(drivers)) {
	    throw new Error("Second argument given to Cycle.run() must be an object " + "with at least one driver function declared as a property.");
	  }
	
	  var requestProxies = makeRequestProxies(drivers);
	  var responses = callDrivers(drivers, requestProxies);
	  var requests = main(responses);
	  var subscription = replicateMany(requests, requestProxies).subscribe();
	  var requestsWithDispose = attachDisposeToRequests(requests, subscription);
	  var responsesWithDispose = attachDisposeToResponses(responses);
	  return [requestsWithDispose, responsesWithDispose];
	}
	
	var Cycle = {
	  /**
	   * Takes an `main` function and circularly connects it to the given collection
	   * of driver functions.
	   *
	   * The `main` function expects a collection of "driver response" Observables
	   * as input, and should return a collection of "driver request" Observables.
	   * A "collection of Observables" is a JavaScript object where
	   * keys match the driver names registered by the `drivers` object, and values
	   * are Observables or a collection of Observables.
	   *
	   * @param {Function} main a function that takes `responses` as input
	   * and outputs a collection of `requests` Observables.
	   * @param {Object} drivers an object where keys are driver names and values
	   * are driver functions.
	   * @return {Array} an array where the first object is the collection of driver
	   * requests, and the second object is the collection of driver responses, that
	   * can be used for debugging or testing.
	   * @function run
	   */
	  run: run,
	
	  /**
	   * A shortcut to the root object of
	   * [RxJS](https://github.com/Reactive-Extensions/RxJS).
	   * @name Rx
	   */
	  Rx: Rx
	};
	
	module.exports = Cycle;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(200), __esModule: true };

/***/ },
/* 4 */
/***/ function(module, exports) {

	var core = module.exports = {};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 *  Copyright (c) 2014-2015, Facebook, Inc.
	 *  All rights reserved.
	 *
	 *  This source code is licensed under the BSD-style license found in the
	 *  LICENSE file in the root directory of this source tree. An additional grant
	 *  of patent rights can be found in the PATENTS file in the same directory.
	 */
	(function (global, factory) {
	   true ? module.exports = factory() :
	  typeof define === 'function' && define.amd ? define(factory) :
	  global.Immutable = factory()
	}(this, function () { 'use strict';var SLICE$0 = Array.prototype.slice;
	
	  function createClass(ctor, superClass) {
	    if (superClass) {
	      ctor.prototype = Object.create(superClass.prototype);
	    }
	    ctor.prototype.constructor = ctor;
	  }
	
	  // Used for setting prototype methods that IE8 chokes on.
	  var DELETE = 'delete';
	
	  // Constants describing the size of trie nodes.
	  var SHIFT = 5; // Resulted in best performance after ______?
	  var SIZE = 1 << SHIFT;
	  var MASK = SIZE - 1;
	
	  // A consistent shared value representing "not set" which equals nothing other
	  // than itself, and nothing that could be provided externally.
	  var NOT_SET = {};
	
	  // Boolean references, Rough equivalent of `bool &`.
	  var CHANGE_LENGTH = { value: false };
	  var DID_ALTER = { value: false };
	
	  function MakeRef(ref) {
	    ref.value = false;
	    return ref;
	  }
	
	  function SetRef(ref) {
	    ref && (ref.value = true);
	  }
	
	  // A function which returns a value representing an "owner" for transient writes
	  // to tries. The return value will only ever equal itself, and will not equal
	  // the return of any subsequent call of this function.
	  function OwnerID() {}
	
	  // http://jsperf.com/copy-array-inline
	  function arrCopy(arr, offset) {
	    offset = offset || 0;
	    var len = Math.max(0, arr.length - offset);
	    var newArr = new Array(len);
	    for (var ii = 0; ii < len; ii++) {
	      newArr[ii] = arr[ii + offset];
	    }
	    return newArr;
	  }
	
	  function ensureSize(iter) {
	    if (iter.size === undefined) {
	      iter.size = iter.__iterate(returnTrue);
	    }
	    return iter.size;
	  }
	
	  function wrapIndex(iter, index) {
	    return index >= 0 ? (+index) : ensureSize(iter) + (+index);
	  }
	
	  function returnTrue() {
	    return true;
	  }
	
	  function wholeSlice(begin, end, size) {
	    return (begin === 0 || (size !== undefined && begin <= -size)) &&
	      (end === undefined || (size !== undefined && end >= size));
	  }
	
	  function resolveBegin(begin, size) {
	    return resolveIndex(begin, size, 0);
	  }
	
	  function resolveEnd(end, size) {
	    return resolveIndex(end, size, size);
	  }
	
	  function resolveIndex(index, size, defaultIndex) {
	    return index === undefined ?
	      defaultIndex :
	      index < 0 ?
	        Math.max(0, size + index) :
	        size === undefined ?
	          index :
	          Math.min(size, index);
	  }
	
	  function Iterable(value) {
	      return isIterable(value) ? value : Seq(value);
	    }
	
	
	  createClass(KeyedIterable, Iterable);
	    function KeyedIterable(value) {
	      return isKeyed(value) ? value : KeyedSeq(value);
	    }
	
	
	  createClass(IndexedIterable, Iterable);
	    function IndexedIterable(value) {
	      return isIndexed(value) ? value : IndexedSeq(value);
	    }
	
	
	  createClass(SetIterable, Iterable);
	    function SetIterable(value) {
	      return isIterable(value) && !isAssociative(value) ? value : SetSeq(value);
	    }
	
	
	
	  function isIterable(maybeIterable) {
	    return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);
	  }
	
	  function isKeyed(maybeKeyed) {
	    return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
	  }
	
	  function isIndexed(maybeIndexed) {
	    return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
	  }
	
	  function isAssociative(maybeAssociative) {
	    return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
	  }
	
	  function isOrdered(maybeOrdered) {
	    return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
	  }
	
	  Iterable.isIterable = isIterable;
	  Iterable.isKeyed = isKeyed;
	  Iterable.isIndexed = isIndexed;
	  Iterable.isAssociative = isAssociative;
	  Iterable.isOrdered = isOrdered;
	
	  Iterable.Keyed = KeyedIterable;
	  Iterable.Indexed = IndexedIterable;
	  Iterable.Set = SetIterable;
	
	
	  var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
	  var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
	  var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
	  var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
	
	  /* global Symbol */
	
	  var ITERATE_KEYS = 0;
	  var ITERATE_VALUES = 1;
	  var ITERATE_ENTRIES = 2;
	
	  var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator';
	
	  var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;
	
	
	  function src_Iterator__Iterator(next) {
	      this.next = next;
	    }
	
	    src_Iterator__Iterator.prototype.toString = function() {
	      return '[Iterator]';
	    };
	
	
	  src_Iterator__Iterator.KEYS = ITERATE_KEYS;
	  src_Iterator__Iterator.VALUES = ITERATE_VALUES;
	  src_Iterator__Iterator.ENTRIES = ITERATE_ENTRIES;
	
	  src_Iterator__Iterator.prototype.inspect =
	  src_Iterator__Iterator.prototype.toSource = function () { return this.toString(); }
	  src_Iterator__Iterator.prototype[ITERATOR_SYMBOL] = function () {
	    return this;
	  };
	
	
	  function iteratorValue(type, k, v, iteratorResult) {
	    var value = type === 0 ? k : type === 1 ? v : [k, v];
	    iteratorResult ? (iteratorResult.value = value) : (iteratorResult = {
	      value: value, done: false
	    });
	    return iteratorResult;
	  }
	
	  function iteratorDone() {
	    return { value: undefined, done: true };
	  }
	
	  function hasIterator(maybeIterable) {
	    return !!getIteratorFn(maybeIterable);
	  }
	
	  function isIterator(maybeIterator) {
	    return maybeIterator && typeof maybeIterator.next === 'function';
	  }
	
	  function getIterator(iterable) {
	    var iteratorFn = getIteratorFn(iterable);
	    return iteratorFn && iteratorFn.call(iterable);
	  }
	
	  function getIteratorFn(iterable) {
	    var iteratorFn = iterable && (
	      (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
	      iterable[FAUX_ITERATOR_SYMBOL]
	    );
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }
	
	  function isArrayLike(value) {
	    return value && typeof value.length === 'number';
	  }
	
	  createClass(Seq, Iterable);
	    function Seq(value) {
	      return value === null || value === undefined ? emptySequence() :
	        isIterable(value) ? value.toSeq() : seqFromValue(value);
	    }
	
	    Seq.of = function(/*...values*/) {
	      return Seq(arguments);
	    };
	
	    Seq.prototype.toSeq = function() {
	      return this;
	    };
	
	    Seq.prototype.toString = function() {
	      return this.__toString('Seq {', '}');
	    };
	
	    Seq.prototype.cacheResult = function() {
	      if (!this._cache && this.__iterateUncached) {
	        this._cache = this.entrySeq().toArray();
	        this.size = this._cache.length;
	      }
	      return this;
	    };
	
	    // abstract __iterateUncached(fn, reverse)
	
	    Seq.prototype.__iterate = function(fn, reverse) {
	      return seqIterate(this, fn, reverse, true);
	    };
	
	    // abstract __iteratorUncached(type, reverse)
	
	    Seq.prototype.__iterator = function(type, reverse) {
	      return seqIterator(this, type, reverse, true);
	    };
	
	
	
	  createClass(KeyedSeq, Seq);
	    function KeyedSeq(value) {
	      return value === null || value === undefined ?
	        emptySequence().toKeyedSeq() :
	        isIterable(value) ?
	          (isKeyed(value) ? value.toSeq() : value.fromEntrySeq()) :
	          keyedSeqFromValue(value);
	    }
	
	    KeyedSeq.prototype.toKeyedSeq = function() {
	      return this;
	    };
	
	
	
	  createClass(IndexedSeq, Seq);
	    function IndexedSeq(value) {
	      return value === null || value === undefined ? emptySequence() :
	        !isIterable(value) ? indexedSeqFromValue(value) :
	        isKeyed(value) ? value.entrySeq() : value.toIndexedSeq();
	    }
	
	    IndexedSeq.of = function(/*...values*/) {
	      return IndexedSeq(arguments);
	    };
	
	    IndexedSeq.prototype.toIndexedSeq = function() {
	      return this;
	    };
	
	    IndexedSeq.prototype.toString = function() {
	      return this.__toString('Seq [', ']');
	    };
	
	    IndexedSeq.prototype.__iterate = function(fn, reverse) {
	      return seqIterate(this, fn, reverse, false);
	    };
	
	    IndexedSeq.prototype.__iterator = function(type, reverse) {
	      return seqIterator(this, type, reverse, false);
	    };
	
	
	
	  createClass(SetSeq, Seq);
	    function SetSeq(value) {
	      return (
	        value === null || value === undefined ? emptySequence() :
	        !isIterable(value) ? indexedSeqFromValue(value) :
	        isKeyed(value) ? value.entrySeq() : value
	      ).toSetSeq();
	    }
	
	    SetSeq.of = function(/*...values*/) {
	      return SetSeq(arguments);
	    };
	
	    SetSeq.prototype.toSetSeq = function() {
	      return this;
	    };
	
	
	
	  Seq.isSeq = isSeq;
	  Seq.Keyed = KeyedSeq;
	  Seq.Set = SetSeq;
	  Seq.Indexed = IndexedSeq;
	
	  var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';
	
	  Seq.prototype[IS_SEQ_SENTINEL] = true;
	
	
	
	  // #pragma Root Sequences
	
	  createClass(ArraySeq, IndexedSeq);
	    function ArraySeq(array) {
	      this._array = array;
	      this.size = array.length;
	    }
	
	    ArraySeq.prototype.get = function(index, notSetValue) {
	      return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
	    };
	
	    ArraySeq.prototype.__iterate = function(fn, reverse) {
	      var array = this._array;
	      var maxIndex = array.length - 1;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        if (fn(array[reverse ? maxIndex - ii : ii], ii, this) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    };
	
	    ArraySeq.prototype.__iterator = function(type, reverse) {
	      var array = this._array;
	      var maxIndex = array.length - 1;
	      var ii = 0;
	      return new src_Iterator__Iterator(function() 
	        {return ii > maxIndex ?
	          iteratorDone() :
	          iteratorValue(type, ii, array[reverse ? maxIndex - ii++ : ii++])}
	      );
	    };
	
	
	
	  createClass(ObjectSeq, KeyedSeq);
	    function ObjectSeq(object) {
	      var keys = Object.keys(object);
	      this._object = object;
	      this._keys = keys;
	      this.size = keys.length;
	    }
	
	    ObjectSeq.prototype.get = function(key, notSetValue) {
	      if (notSetValue !== undefined && !this.has(key)) {
	        return notSetValue;
	      }
	      return this._object[key];
	    };
	
	    ObjectSeq.prototype.has = function(key) {
	      return this._object.hasOwnProperty(key);
	    };
	
	    ObjectSeq.prototype.__iterate = function(fn, reverse) {
	      var object = this._object;
	      var keys = this._keys;
	      var maxIndex = keys.length - 1;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        var key = keys[reverse ? maxIndex - ii : ii];
	        if (fn(object[key], key, this) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    };
	
	    ObjectSeq.prototype.__iterator = function(type, reverse) {
	      var object = this._object;
	      var keys = this._keys;
	      var maxIndex = keys.length - 1;
	      var ii = 0;
	      return new src_Iterator__Iterator(function()  {
	        var key = keys[reverse ? maxIndex - ii : ii];
	        return ii++ > maxIndex ?
	          iteratorDone() :
	          iteratorValue(type, key, object[key]);
	      });
	    };
	
	  ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;
	
	
	  createClass(IterableSeq, IndexedSeq);
	    function IterableSeq(iterable) {
	      this._iterable = iterable;
	      this.size = iterable.length || iterable.size;
	    }
	
	    IterableSeq.prototype.__iterateUncached = function(fn, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterable = this._iterable;
	      var iterator = getIterator(iterable);
	      var iterations = 0;
	      if (isIterator(iterator)) {
	        var step;
	        while (!(step = iterator.next()).done) {
	          if (fn(step.value, iterations++, this) === false) {
	            break;
	          }
	        }
	      }
	      return iterations;
	    };
	
	    IterableSeq.prototype.__iteratorUncached = function(type, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterable = this._iterable;
	      var iterator = getIterator(iterable);
	      if (!isIterator(iterator)) {
	        return new src_Iterator__Iterator(iteratorDone);
	      }
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step : iteratorValue(type, iterations++, step.value);
	      });
	    };
	
	
	
	  createClass(IteratorSeq, IndexedSeq);
	    function IteratorSeq(iterator) {
	      this._iterator = iterator;
	      this._iteratorCache = [];
	    }
	
	    IteratorSeq.prototype.__iterateUncached = function(fn, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterator = this._iterator;
	      var cache = this._iteratorCache;
	      var iterations = 0;
	      while (iterations < cache.length) {
	        if (fn(cache[iterations], iterations++, this) === false) {
	          return iterations;
	        }
	      }
	      var step;
	      while (!(step = iterator.next()).done) {
	        var val = step.value;
	        cache[iterations] = val;
	        if (fn(val, iterations++, this) === false) {
	          break;
	        }
	      }
	      return iterations;
	    };
	
	    IteratorSeq.prototype.__iteratorUncached = function(type, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = this._iterator;
	      var cache = this._iteratorCache;
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        if (iterations >= cache.length) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          cache[iterations] = step.value;
	        }
	        return iteratorValue(type, iterations, cache[iterations++]);
	      });
	    };
	
	
	
	
	  // # pragma Helper functions
	
	  function isSeq(maybeSeq) {
	    return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
	  }
	
	  var EMPTY_SEQ;
	
	  function emptySequence() {
	    return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
	  }
	
	  function keyedSeqFromValue(value) {
	    var seq =
	      Array.isArray(value) ? new ArraySeq(value).fromEntrySeq() :
	      isIterator(value) ? new IteratorSeq(value).fromEntrySeq() :
	      hasIterator(value) ? new IterableSeq(value).fromEntrySeq() :
	      typeof value === 'object' ? new ObjectSeq(value) :
	      undefined;
	    if (!seq) {
	      throw new TypeError(
	        'Expected Array or iterable object of [k, v] entries, '+
	        'or keyed object: ' + value
	      );
	    }
	    return seq;
	  }
	
	  function indexedSeqFromValue(value) {
	    var seq = maybeIndexedSeqFromValue(value);
	    if (!seq) {
	      throw new TypeError(
	        'Expected Array or iterable object of values: ' + value
	      );
	    }
	    return seq;
	  }
	
	  function seqFromValue(value) {
	    var seq = maybeIndexedSeqFromValue(value) ||
	      (typeof value === 'object' && new ObjectSeq(value));
	    if (!seq) {
	      throw new TypeError(
	        'Expected Array or iterable object of values, or keyed object: ' + value
	      );
	    }
	    return seq;
	  }
	
	  function maybeIndexedSeqFromValue(value) {
	    return (
	      isArrayLike(value) ? new ArraySeq(value) :
	      isIterator(value) ? new IteratorSeq(value) :
	      hasIterator(value) ? new IterableSeq(value) :
	      undefined
	    );
	  }
	
	  function seqIterate(seq, fn, reverse, useKeys) {
	    var cache = seq._cache;
	    if (cache) {
	      var maxIndex = cache.length - 1;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        var entry = cache[reverse ? maxIndex - ii : ii];
	        if (fn(entry[1], useKeys ? entry[0] : ii, seq) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    }
	    return seq.__iterateUncached(fn, reverse);
	  }
	
	  function seqIterator(seq, type, reverse, useKeys) {
	    var cache = seq._cache;
	    if (cache) {
	      var maxIndex = cache.length - 1;
	      var ii = 0;
	      return new src_Iterator__Iterator(function()  {
	        var entry = cache[reverse ? maxIndex - ii : ii];
	        return ii++ > maxIndex ?
	          iteratorDone() :
	          iteratorValue(type, useKeys ? entry[0] : ii - 1, entry[1]);
	      });
	    }
	    return seq.__iteratorUncached(type, reverse);
	  }
	
	  createClass(Collection, Iterable);
	    function Collection() {
	      throw TypeError('Abstract');
	    }
	
	
	  createClass(KeyedCollection, Collection);function KeyedCollection() {}
	
	  createClass(IndexedCollection, Collection);function IndexedCollection() {}
	
	  createClass(SetCollection, Collection);function SetCollection() {}
	
	
	  Collection.Keyed = KeyedCollection;
	  Collection.Indexed = IndexedCollection;
	  Collection.Set = SetCollection;
	
	  /**
	   * An extension of the "same-value" algorithm as [described for use by ES6 Map
	   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
	   *
	   * NaN is considered the same as NaN, however -0 and 0 are considered the same
	   * value, which is different from the algorithm described by
	   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
	   *
	   * This is extended further to allow Objects to describe the values they
	   * represent, by way of `valueOf` or `equals` (and `hashCode`).
	   *
	   * Note: because of this extension, the key equality of Immutable.Map and the
	   * value equality of Immutable.Set will differ from ES6 Map and Set.
	   *
	   * ### Defining custom values
	   *
	   * The easiest way to describe the value an object represents is by implementing
	   * `valueOf`. For example, `Date` represents a value by returning a unix
	   * timestamp for `valueOf`:
	   *
	   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
	   *     var date2 = new Date(1234567890000);
	   *     date1.valueOf(); // 1234567890000
	   *     assert( date1 !== date2 );
	   *     assert( Immutable.is( date1, date2 ) );
	   *
	   * Note: overriding `valueOf` may have other implications if you use this object
	   * where JavaScript expects a primitive, such as implicit string coercion.
	   *
	   * For more complex types, especially collections, implementing `valueOf` may
	   * not be performant. An alternative is to implement `equals` and `hashCode`.
	   *
	   * `equals` takes another object, presumably of similar type, and returns true
	   * if the it is equal. Equality is symmetrical, so the same result should be
	   * returned if this and the argument are flipped.
	   *
	   *     assert( a.equals(b) === b.equals(a) );
	   *
	   * `hashCode` returns a 32bit integer number representing the object which will
	   * be used to determine how to store the value object in a Map or Set. You must
	   * provide both or neither methods, one must not exist without the other.
	   *
	   * Also, an important relationship between these methods must be upheld: if two
	   * values are equal, they *must* return the same hashCode. If the values are not
	   * equal, they might have the same hashCode; this is called a hash collision,
	   * and while undesirable for performance reasons, it is acceptable.
	   *
	   *     if (a.equals(b)) {
	   *       assert( a.hashCode() === b.hashCode() );
	   *     }
	   *
	   * All Immutable collections implement `equals` and `hashCode`.
	   *
	   */
	  function is(valueA, valueB) {
	    if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
	      return true;
	    }
	    if (!valueA || !valueB) {
	      return false;
	    }
	    if (typeof valueA.valueOf === 'function' &&
	        typeof valueB.valueOf === 'function') {
	      valueA = valueA.valueOf();
	      valueB = valueB.valueOf();
	      if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
	        return true;
	      }
	      if (!valueA || !valueB) {
	        return false;
	      }
	    }
	    if (typeof valueA.equals === 'function' &&
	        typeof valueB.equals === 'function' &&
	        valueA.equals(valueB)) {
	      return true;
	    }
	    return false;
	  }
	
	  function fromJS(json, converter) {
	    return converter ?
	      fromJSWith(converter, json, '', {'': json}) :
	      fromJSDefault(json);
	  }
	
	  function fromJSWith(converter, json, key, parentJSON) {
	    if (Array.isArray(json)) {
	      return converter.call(parentJSON, key, IndexedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
	    }
	    if (isPlainObj(json)) {
	      return converter.call(parentJSON, key, KeyedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
	    }
	    return json;
	  }
	
	  function fromJSDefault(json) {
	    if (Array.isArray(json)) {
	      return IndexedSeq(json).map(fromJSDefault).toList();
	    }
	    if (isPlainObj(json)) {
	      return KeyedSeq(json).map(fromJSDefault).toMap();
	    }
	    return json;
	  }
	
	  function isPlainObj(value) {
	    return value && (value.constructor === Object || value.constructor === undefined);
	  }
	
	  var src_Math__imul =
	    typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ?
	    Math.imul :
	    function src_Math__imul(a, b) {
	      a = a | 0; // int
	      b = b | 0; // int
	      var c = a & 0xffff;
	      var d = b & 0xffff;
	      // Shift by 0 fixes the sign on the high part.
	      return (c * d) + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0) | 0; // int
	    };
	
	  // v8 has an optimization for storing 31-bit signed numbers.
	  // Values which have either 00 or 11 as the high order bits qualify.
	  // This function drops the highest order bit in a signed number, maintaining
	  // the sign bit.
	  function smi(i32) {
	    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xBFFFFFFF);
	  }
	
	  function hash(o) {
	    if (o === false || o === null || o === undefined) {
	      return 0;
	    }
	    if (typeof o.valueOf === 'function') {
	      o = o.valueOf();
	      if (o === false || o === null || o === undefined) {
	        return 0;
	      }
	    }
	    if (o === true) {
	      return 1;
	    }
	    var type = typeof o;
	    if (type === 'number') {
	      var h = o | 0;
	      if (h !== o) {
	        h ^= o * 0xFFFFFFFF;
	      }
	      while (o > 0xFFFFFFFF) {
	        o /= 0xFFFFFFFF;
	        h ^= o;
	      }
	      return smi(h);
	    }
	    if (type === 'string') {
	      return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
	    }
	    if (typeof o.hashCode === 'function') {
	      return o.hashCode();
	    }
	    return hashJSObj(o);
	  }
	
	  function cachedHashString(string) {
	    var hash = stringHashCache[string];
	    if (hash === undefined) {
	      hash = hashString(string);
	      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
	        STRING_HASH_CACHE_SIZE = 0;
	        stringHashCache = {};
	      }
	      STRING_HASH_CACHE_SIZE++;
	      stringHashCache[string] = hash;
	    }
	    return hash;
	  }
	
	  // http://jsperf.com/hashing-strings
	  function hashString(string) {
	    // This is the hash from JVM
	    // The hash code for a string is computed as
	    // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
	    // where s[i] is the ith character of the string and n is the length of
	    // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
	    // (exclusive) by dropping high bits.
	    var hash = 0;
	    for (var ii = 0; ii < string.length; ii++) {
	      hash = 31 * hash + string.charCodeAt(ii) | 0;
	    }
	    return smi(hash);
	  }
	
	  function hashJSObj(obj) {
	    var hash;
	    if (usingWeakMap) {
	      hash = weakMap.get(obj);
	      if (hash !== undefined) {
	        return hash;
	      }
	    }
	
	    hash = obj[UID_HASH_KEY];
	    if (hash !== undefined) {
	      return hash;
	    }
	
	    if (!canDefineProperty) {
	      hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
	      if (hash !== undefined) {
	        return hash;
	      }
	
	      hash = getIENodeHash(obj);
	      if (hash !== undefined) {
	        return hash;
	      }
	    }
	
	    hash = ++objHashUID;
	    if (objHashUID & 0x40000000) {
	      objHashUID = 0;
	    }
	
	    if (usingWeakMap) {
	      weakMap.set(obj, hash);
	    } else if (isExtensible !== undefined && isExtensible(obj) === false) {
	      throw new Error('Non-extensible objects are not allowed as keys.');
	    } else if (canDefineProperty) {
	      Object.defineProperty(obj, UID_HASH_KEY, {
	        'enumerable': false,
	        'configurable': false,
	        'writable': false,
	        'value': hash
	      });
	    } else if (obj.propertyIsEnumerable !== undefined &&
	               obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
	      // Since we can't define a non-enumerable property on the object
	      // we'll hijack one of the less-used non-enumerable properties to
	      // save our hash on it. Since this is a function it will not show up in
	      // `JSON.stringify` which is what we want.
	      obj.propertyIsEnumerable = function() {
	        return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
	      };
	      obj.propertyIsEnumerable[UID_HASH_KEY] = hash;
	    } else if (obj.nodeType !== undefined) {
	      // At this point we couldn't get the IE `uniqueID` to use as a hash
	      // and we couldn't use a non-enumerable property to exploit the
	      // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
	      // itself.
	      obj[UID_HASH_KEY] = hash;
	    } else {
	      throw new Error('Unable to set a non-enumerable property on object.');
	    }
	
	    return hash;
	  }
	
	  // Get references to ES5 object methods.
	  var isExtensible = Object.isExtensible;
	
	  // True if Object.defineProperty works as expected. IE8 fails this test.
	  var canDefineProperty = (function() {
	    try {
	      Object.defineProperty({}, '@', {});
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }());
	
	  // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
	  // and avoid memory leaks from the IE cloneNode bug.
	  function getIENodeHash(node) {
	    if (node && node.nodeType > 0) {
	      switch (node.nodeType) {
	        case 1: // Element
	          return node.uniqueID;
	        case 9: // Document
	          return node.documentElement && node.documentElement.uniqueID;
	      }
	    }
	  }
	
	  // If possible, use a WeakMap.
	  var usingWeakMap = typeof WeakMap === 'function';
	  var weakMap;
	  if (usingWeakMap) {
	    weakMap = new WeakMap();
	  }
	
	  var objHashUID = 0;
	
	  var UID_HASH_KEY = '__immutablehash__';
	  if (typeof Symbol === 'function') {
	    UID_HASH_KEY = Symbol(UID_HASH_KEY);
	  }
	
	  var STRING_HASH_CACHE_MIN_STRLEN = 16;
	  var STRING_HASH_CACHE_MAX_SIZE = 255;
	  var STRING_HASH_CACHE_SIZE = 0;
	  var stringHashCache = {};
	
	  function invariant(condition, error) {
	    if (!condition) throw new Error(error);
	  }
	
	  function assertNotInfinite(size) {
	    invariant(
	      size !== Infinity,
	      'Cannot perform this action with an infinite size.'
	    );
	  }
	
	  createClass(ToKeyedSequence, KeyedSeq);
	    function ToKeyedSequence(indexed, useKeys) {
	      this._iter = indexed;
	      this._useKeys = useKeys;
	      this.size = indexed.size;
	    }
	
	    ToKeyedSequence.prototype.get = function(key, notSetValue) {
	      return this._iter.get(key, notSetValue);
	    };
	
	    ToKeyedSequence.prototype.has = function(key) {
	      return this._iter.has(key);
	    };
	
	    ToKeyedSequence.prototype.valueSeq = function() {
	      return this._iter.valueSeq();
	    };
	
	    ToKeyedSequence.prototype.reverse = function() {var this$0 = this;
	      var reversedSequence = reverseFactory(this, true);
	      if (!this._useKeys) {
	        reversedSequence.valueSeq = function()  {return this$0._iter.toSeq().reverse()};
	      }
	      return reversedSequence;
	    };
	
	    ToKeyedSequence.prototype.map = function(mapper, context) {var this$0 = this;
	      var mappedSequence = mapFactory(this, mapper, context);
	      if (!this._useKeys) {
	        mappedSequence.valueSeq = function()  {return this$0._iter.toSeq().map(mapper, context)};
	      }
	      return mappedSequence;
	    };
	
	    ToKeyedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      var ii;
	      return this._iter.__iterate(
	        this._useKeys ?
	          function(v, k)  {return fn(v, k, this$0)} :
	          ((ii = reverse ? resolveSize(this) : 0),
	            function(v ) {return fn(v, reverse ? --ii : ii++, this$0)}),
	        reverse
	      );
	    };
	
	    ToKeyedSequence.prototype.__iterator = function(type, reverse) {
	      if (this._useKeys) {
	        return this._iter.__iterator(type, reverse);
	      }
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      var ii = reverse ? resolveSize(this) : 0;
	      return new src_Iterator__Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step :
	          iteratorValue(type, reverse ? --ii : ii++, step.value, step);
	      });
	    };
	
	  ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;
	
	
	  createClass(ToIndexedSequence, IndexedSeq);
	    function ToIndexedSequence(iter) {
	      this._iter = iter;
	      this.size = iter.size;
	    }
	
	    ToIndexedSequence.prototype.includes = function(value) {
	      return this._iter.includes(value);
	    };
	
	    ToIndexedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      return this._iter.__iterate(function(v ) {return fn(v, iterations++, this$0)}, reverse);
	    };
	
	    ToIndexedSequence.prototype.__iterator = function(type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step :
	          iteratorValue(type, iterations++, step.value, step)
	      });
	    };
	
	
	
	  createClass(ToSetSequence, SetSeq);
	    function ToSetSequence(iter) {
	      this._iter = iter;
	      this.size = iter.size;
	    }
	
	    ToSetSequence.prototype.has = function(key) {
	      return this._iter.includes(key);
	    };
	
	    ToSetSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._iter.__iterate(function(v ) {return fn(v, v, this$0)}, reverse);
	    };
	
	    ToSetSequence.prototype.__iterator = function(type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      return new src_Iterator__Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step :
	          iteratorValue(type, step.value, step.value, step);
	      });
	    };
	
	
	
	  createClass(FromEntriesSequence, KeyedSeq);
	    function FromEntriesSequence(entries) {
	      this._iter = entries;
	      this.size = entries.size;
	    }
	
	    FromEntriesSequence.prototype.entrySeq = function() {
	      return this._iter.toSeq();
	    };
	
	    FromEntriesSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._iter.__iterate(function(entry ) {
	        // Check if entry exists first so array access doesn't throw for holes
	        // in the parent iteration.
	        if (entry) {
	          validateEntry(entry);
	          var indexedIterable = isIterable(entry);
	          return fn(
	            indexedIterable ? entry.get(1) : entry[1],
	            indexedIterable ? entry.get(0) : entry[0],
	            this$0
	          );
	        }
	      }, reverse);
	    };
	
	    FromEntriesSequence.prototype.__iterator = function(type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      return new src_Iterator__Iterator(function()  {
	        while (true) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          var entry = step.value;
	          // Check if entry exists first so array access doesn't throw for holes
	          // in the parent iteration.
	          if (entry) {
	            validateEntry(entry);
	            var indexedIterable = isIterable(entry);
	            return iteratorValue(
	              type,
	              indexedIterable ? entry.get(0) : entry[0],
	              indexedIterable ? entry.get(1) : entry[1],
	              step
	            );
	          }
	        }
	      });
	    };
	
	
	  ToIndexedSequence.prototype.cacheResult =
	  ToKeyedSequence.prototype.cacheResult =
	  ToSetSequence.prototype.cacheResult =
	  FromEntriesSequence.prototype.cacheResult =
	    cacheResultThrough;
	
	
	  function flipFactory(iterable) {
	    var flipSequence = makeSequence(iterable);
	    flipSequence._iter = iterable;
	    flipSequence.size = iterable.size;
	    flipSequence.flip = function()  {return iterable};
	    flipSequence.reverse = function () {
	      var reversedSequence = iterable.reverse.apply(this); // super.reverse()
	      reversedSequence.flip = function()  {return iterable.reverse()};
	      return reversedSequence;
	    };
	    flipSequence.has = function(key ) {return iterable.includes(key)};
	    flipSequence.includes = function(key ) {return iterable.has(key)};
	    flipSequence.cacheResult = cacheResultThrough;
	    flipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      return iterable.__iterate(function(v, k)  {return fn(k, v, this$0) !== false}, reverse);
	    }
	    flipSequence.__iteratorUncached = function(type, reverse) {
	      if (type === ITERATE_ENTRIES) {
	        var iterator = iterable.__iterator(type, reverse);
	        return new src_Iterator__Iterator(function()  {
	          var step = iterator.next();
	          if (!step.done) {
	            var k = step.value[0];
	            step.value[0] = step.value[1];
	            step.value[1] = k;
	          }
	          return step;
	        });
	      }
	      return iterable.__iterator(
	        type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
	        reverse
	      );
	    }
	    return flipSequence;
	  }
	
	
	  function mapFactory(iterable, mapper, context) {
	    var mappedSequence = makeSequence(iterable);
	    mappedSequence.size = iterable.size;
	    mappedSequence.has = function(key ) {return iterable.has(key)};
	    mappedSequence.get = function(key, notSetValue)  {
	      var v = iterable.get(key, NOT_SET);
	      return v === NOT_SET ?
	        notSetValue :
	        mapper.call(context, v, key, iterable);
	    };
	    mappedSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      return iterable.__iterate(
	        function(v, k, c)  {return fn(mapper.call(context, v, k, c), k, this$0) !== false},
	        reverse
	      );
	    }
	    mappedSequence.__iteratorUncached = function (type, reverse) {
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      return new src_Iterator__Iterator(function()  {
	        var step = iterator.next();
	        if (step.done) {
	          return step;
	        }
	        var entry = step.value;
	        var key = entry[0];
	        return iteratorValue(
	          type,
	          key,
	          mapper.call(context, entry[1], key, iterable),
	          step
	        );
	      });
	    }
	    return mappedSequence;
	  }
	
	
	  function reverseFactory(iterable, useKeys) {
	    var reversedSequence = makeSequence(iterable);
	    reversedSequence._iter = iterable;
	    reversedSequence.size = iterable.size;
	    reversedSequence.reverse = function()  {return iterable};
	    if (iterable.flip) {
	      reversedSequence.flip = function () {
	        var flipSequence = flipFactory(iterable);
	        flipSequence.reverse = function()  {return iterable.flip()};
	        return flipSequence;
	      };
	    }
	    reversedSequence.get = function(key, notSetValue) 
	      {return iterable.get(useKeys ? key : -1 - key, notSetValue)};
	    reversedSequence.has = function(key )
	      {return iterable.has(useKeys ? key : -1 - key)};
	    reversedSequence.includes = function(value ) {return iterable.includes(value)};
	    reversedSequence.cacheResult = cacheResultThrough;
	    reversedSequence.__iterate = function (fn, reverse) {var this$0 = this;
	      return iterable.__iterate(function(v, k)  {return fn(v, k, this$0)}, !reverse);
	    };
	    reversedSequence.__iterator =
	      function(type, reverse)  {return iterable.__iterator(type, !reverse)};
	    return reversedSequence;
	  }
	
	
	  function filterFactory(iterable, predicate, context, useKeys) {
	    var filterSequence = makeSequence(iterable);
	    if (useKeys) {
	      filterSequence.has = function(key ) {
	        var v = iterable.get(key, NOT_SET);
	        return v !== NOT_SET && !!predicate.call(context, v, key, iterable);
	      };
	      filterSequence.get = function(key, notSetValue)  {
	        var v = iterable.get(key, NOT_SET);
	        return v !== NOT_SET && predicate.call(context, v, key, iterable) ?
	          v : notSetValue;
	      };
	    }
	    filterSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      iterable.__iterate(function(v, k, c)  {
	        if (predicate.call(context, v, k, c)) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$0);
	        }
	      }, reverse);
	      return iterations;
	    };
	    filterSequence.__iteratorUncached = function (type, reverse) {
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        while (true) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          var entry = step.value;
	          var key = entry[0];
	          var value = entry[1];
	          if (predicate.call(context, value, key, iterable)) {
	            return iteratorValue(type, useKeys ? key : iterations++, value, step);
	          }
	        }
	      });
	    }
	    return filterSequence;
	  }
	
	
	  function countByFactory(iterable, grouper, context) {
	    var groups = src_Map__Map().asMutable();
	    iterable.__iterate(function(v, k)  {
	      groups.update(
	        grouper.call(context, v, k, iterable),
	        0,
	        function(a ) {return a + 1}
	      );
	    });
	    return groups.asImmutable();
	  }
	
	
	  function groupByFactory(iterable, grouper, context) {
	    var isKeyedIter = isKeyed(iterable);
	    var groups = (isOrdered(iterable) ? OrderedMap() : src_Map__Map()).asMutable();
	    iterable.__iterate(function(v, k)  {
	      groups.update(
	        grouper.call(context, v, k, iterable),
	        function(a ) {return (a = a || [], a.push(isKeyedIter ? [k, v] : v), a)}
	      );
	    });
	    var coerce = iterableClass(iterable);
	    return groups.map(function(arr ) {return reify(iterable, coerce(arr))});
	  }
	
	
	  function sliceFactory(iterable, begin, end, useKeys) {
	    var originalSize = iterable.size;
	
	    if (wholeSlice(begin, end, originalSize)) {
	      return iterable;
	    }
	
	    var resolvedBegin = resolveBegin(begin, originalSize);
	    var resolvedEnd = resolveEnd(end, originalSize);
	
	    // begin or end will be NaN if they were provided as negative numbers and
	    // this iterable's size is unknown. In that case, cache first so there is
	    // a known size and these do not resolve to NaN.
	    if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
	      return sliceFactory(iterable.toSeq().cacheResult(), begin, end, useKeys);
	    }
	
	    // Note: resolvedEnd is undefined when the original sequence's length is
	    // unknown and this slice did not supply an end and should contain all
	    // elements after resolvedBegin.
	    // In that case, resolvedSize will be NaN and sliceSize will remain undefined.
	    var resolvedSize = resolvedEnd - resolvedBegin;
	    var sliceSize;
	    if (resolvedSize === resolvedSize) {
	      sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
	    }
	
	    var sliceSeq = makeSequence(iterable);
	
	    sliceSeq.size = sliceSize;
	
	    if (!useKeys && isSeq(iterable) && sliceSize >= 0) {
	      sliceSeq.get = function (index, notSetValue) {
	        index = wrapIndex(this, index);
	        return index >= 0 && index < sliceSize ?
	          iterable.get(index + resolvedBegin, notSetValue) :
	          notSetValue;
	      }
	    }
	
	    sliceSeq.__iterateUncached = function(fn, reverse) {var this$0 = this;
	      if (sliceSize === 0) {
	        return 0;
	      }
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var skipped = 0;
	      var isSkipping = true;
	      var iterations = 0;
	      iterable.__iterate(function(v, k)  {
	        if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$0) !== false &&
	                 iterations !== sliceSize;
	        }
	      });
	      return iterations;
	    };
	
	    sliceSeq.__iteratorUncached = function(type, reverse) {
	      if (sliceSize !== 0 && reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      // Don't bother instantiating parent iterator if taking 0.
	      var iterator = sliceSize !== 0 && iterable.__iterator(type, reverse);
	      var skipped = 0;
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        while (skipped++ < resolvedBegin) {
	          iterator.next();
	        }
	        if (++iterations > sliceSize) {
	          return iteratorDone();
	        }
	        var step = iterator.next();
	        if (useKeys || type === ITERATE_VALUES) {
	          return step;
	        } else if (type === ITERATE_KEYS) {
	          return iteratorValue(type, iterations - 1, undefined, step);
	        } else {
	          return iteratorValue(type, iterations - 1, step.value[1], step);
	        }
	      });
	    }
	
	    return sliceSeq;
	  }
	
	
	  function takeWhileFactory(iterable, predicate, context) {
	    var takeSequence = makeSequence(iterable);
	    takeSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterations = 0;
	      iterable.__iterate(function(v, k, c) 
	        {return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0)}
	      );
	      return iterations;
	    };
	    takeSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      var iterating = true;
	      return new src_Iterator__Iterator(function()  {
	        if (!iterating) {
	          return iteratorDone();
	        }
	        var step = iterator.next();
	        if (step.done) {
	          return step;
	        }
	        var entry = step.value;
	        var k = entry[0];
	        var v = entry[1];
	        if (!predicate.call(context, v, k, this$0)) {
	          iterating = false;
	          return iteratorDone();
	        }
	        return type === ITERATE_ENTRIES ? step :
	          iteratorValue(type, k, v, step);
	      });
	    };
	    return takeSequence;
	  }
	
	
	  function skipWhileFactory(iterable, predicate, context, useKeys) {
	    var skipSequence = makeSequence(iterable);
	    skipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var isSkipping = true;
	      var iterations = 0;
	      iterable.__iterate(function(v, k, c)  {
	        if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$0);
	        }
	      });
	      return iterations;
	    };
	    skipSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      var skipping = true;
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        var step, k, v;
	        do {
	          step = iterator.next();
	          if (step.done) {
	            if (useKeys || type === ITERATE_VALUES) {
	              return step;
	            } else if (type === ITERATE_KEYS) {
	              return iteratorValue(type, iterations++, undefined, step);
	            } else {
	              return iteratorValue(type, iterations++, step.value[1], step);
	            }
	          }
	          var entry = step.value;
	          k = entry[0];
	          v = entry[1];
	          skipping && (skipping = predicate.call(context, v, k, this$0));
	        } while (skipping);
	        return type === ITERATE_ENTRIES ? step :
	          iteratorValue(type, k, v, step);
	      });
	    };
	    return skipSequence;
	  }
	
	
	  function concatFactory(iterable, values) {
	    var isKeyedIterable = isKeyed(iterable);
	    var iters = [iterable].concat(values).map(function(v ) {
	      if (!isIterable(v)) {
	        v = isKeyedIterable ?
	          keyedSeqFromValue(v) :
	          indexedSeqFromValue(Array.isArray(v) ? v : [v]);
	      } else if (isKeyedIterable) {
	        v = KeyedIterable(v);
	      }
	      return v;
	    }).filter(function(v ) {return v.size !== 0});
	
	    if (iters.length === 0) {
	      return iterable;
	    }
	
	    if (iters.length === 1) {
	      var singleton = iters[0];
	      if (singleton === iterable ||
	          isKeyedIterable && isKeyed(singleton) ||
	          isIndexed(iterable) && isIndexed(singleton)) {
	        return singleton;
	      }
	    }
	
	    var concatSeq = new ArraySeq(iters);
	    if (isKeyedIterable) {
	      concatSeq = concatSeq.toKeyedSeq();
	    } else if (!isIndexed(iterable)) {
	      concatSeq = concatSeq.toSetSeq();
	    }
	    concatSeq = concatSeq.flatten(true);
	    concatSeq.size = iters.reduce(
	      function(sum, seq)  {
	        if (sum !== undefined) {
	          var size = seq.size;
	          if (size !== undefined) {
	            return sum + size;
	          }
	        }
	      },
	      0
	    );
	    return concatSeq;
	  }
	
	
	  function flattenFactory(iterable, depth, useKeys) {
	    var flatSequence = makeSequence(iterable);
	    flatSequence.__iterateUncached = function(fn, reverse) {
	      var iterations = 0;
	      var stopped = false;
	      function flatDeep(iter, currentDepth) {var this$0 = this;
	        iter.__iterate(function(v, k)  {
	          if ((!depth || currentDepth < depth) && isIterable(v)) {
	            flatDeep(v, currentDepth + 1);
	          } else if (fn(v, useKeys ? k : iterations++, this$0) === false) {
	            stopped = true;
	          }
	          return !stopped;
	        }, reverse);
	      }
	      flatDeep(iterable, 0);
	      return iterations;
	    }
	    flatSequence.__iteratorUncached = function(type, reverse) {
	      var iterator = iterable.__iterator(type, reverse);
	      var stack = [];
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        while (iterator) {
	          var step = iterator.next();
	          if (step.done !== false) {
	            iterator = stack.pop();
	            continue;
	          }
	          var v = step.value;
	          if (type === ITERATE_ENTRIES) {
	            v = v[1];
	          }
	          if ((!depth || stack.length < depth) && isIterable(v)) {
	            stack.push(iterator);
	            iterator = v.__iterator(type, reverse);
	          } else {
	            return useKeys ? step : iteratorValue(type, iterations++, v, step);
	          }
	        }
	        return iteratorDone();
	      });
	    }
	    return flatSequence;
	  }
	
	
	  function flatMapFactory(iterable, mapper, context) {
	    var coerce = iterableClass(iterable);
	    return iterable.toSeq().map(
	      function(v, k)  {return coerce(mapper.call(context, v, k, iterable))}
	    ).flatten(true);
	  }
	
	
	  function interposeFactory(iterable, separator) {
	    var interposedSequence = makeSequence(iterable);
	    interposedSequence.size = iterable.size && iterable.size * 2 -1;
	    interposedSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      iterable.__iterate(function(v, k) 
	        {return (!iterations || fn(separator, iterations++, this$0) !== false) &&
	        fn(v, iterations++, this$0) !== false},
	        reverse
	      );
	      return iterations;
	    };
	    interposedSequence.__iteratorUncached = function(type, reverse) {
	      var iterator = iterable.__iterator(ITERATE_VALUES, reverse);
	      var iterations = 0;
	      var step;
	      return new src_Iterator__Iterator(function()  {
	        if (!step || iterations % 2) {
	          step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	        }
	        return iterations % 2 ?
	          iteratorValue(type, iterations++, separator) :
	          iteratorValue(type, iterations++, step.value, step);
	      });
	    };
	    return interposedSequence;
	  }
	
	
	  function sortFactory(iterable, comparator, mapper) {
	    if (!comparator) {
	      comparator = defaultComparator;
	    }
	    var isKeyedIterable = isKeyed(iterable);
	    var index = 0;
	    var entries = iterable.toSeq().map(
	      function(v, k)  {return [k, v, index++, mapper ? mapper(v, k, iterable) : v]}
	    ).toArray();
	    entries.sort(function(a, b)  {return comparator(a[3], b[3]) || a[2] - b[2]}).forEach(
	      isKeyedIterable ?
	      function(v, i)  { entries[i].length = 2; } :
	      function(v, i)  { entries[i] = v[1]; }
	    );
	    return isKeyedIterable ? KeyedSeq(entries) :
	      isIndexed(iterable) ? IndexedSeq(entries) :
	      SetSeq(entries);
	  }
	
	
	  function maxFactory(iterable, comparator, mapper) {
	    if (!comparator) {
	      comparator = defaultComparator;
	    }
	    if (mapper) {
	      var entry = iterable.toSeq()
	        .map(function(v, k)  {return [v, mapper(v, k, iterable)]})
	        .reduce(function(a, b)  {return maxCompare(comparator, a[1], b[1]) ? b : a});
	      return entry && entry[0];
	    } else {
	      return iterable.reduce(function(a, b)  {return maxCompare(comparator, a, b) ? b : a});
	    }
	  }
	
	  function maxCompare(comparator, a, b) {
	    var comp = comparator(b, a);
	    // b is considered the new max if the comparator declares them equal, but
	    // they are not equal and b is in fact a nullish value.
	    return (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) || comp > 0;
	  }
	
	
	  function zipWithFactory(keyIter, zipper, iters) {
	    var zipSequence = makeSequence(keyIter);
	    zipSequence.size = new ArraySeq(iters).map(function(i ) {return i.size}).min();
	    // Note: this a generic base implementation of __iterate in terms of
	    // __iterator which may be more generically useful in the future.
	    zipSequence.__iterate = function(fn, reverse) {
	      /* generic:
	      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
	      var step;
	      var iterations = 0;
	      while (!(step = iterator.next()).done) {
	        iterations++;
	        if (fn(step.value[1], step.value[0], this) === false) {
	          break;
	        }
	      }
	      return iterations;
	      */
	      // indexed:
	      var iterator = this.__iterator(ITERATE_VALUES, reverse);
	      var step;
	      var iterations = 0;
	      while (!(step = iterator.next()).done) {
	        if (fn(step.value, iterations++, this) === false) {
	          break;
	        }
	      }
	      return iterations;
	    };
	    zipSequence.__iteratorUncached = function(type, reverse) {
	      var iterators = iters.map(function(i )
	        {return (i = Iterable(i), getIterator(reverse ? i.reverse() : i))}
	      );
	      var iterations = 0;
	      var isDone = false;
	      return new src_Iterator__Iterator(function()  {
	        var steps;
	        if (!isDone) {
	          steps = iterators.map(function(i ) {return i.next()});
	          isDone = steps.some(function(s ) {return s.done});
	        }
	        if (isDone) {
	          return iteratorDone();
	        }
	        return iteratorValue(
	          type,
	          iterations++,
	          zipper.apply(null, steps.map(function(s ) {return s.value}))
	        );
	      });
	    };
	    return zipSequence
	  }
	
	
	  // #pragma Helper Functions
	
	  function reify(iter, seq) {
	    return isSeq(iter) ? seq : iter.constructor(seq);
	  }
	
	  function validateEntry(entry) {
	    if (entry !== Object(entry)) {
	      throw new TypeError('Expected [K, V] tuple: ' + entry);
	    }
	  }
	
	  function resolveSize(iter) {
	    assertNotInfinite(iter.size);
	    return ensureSize(iter);
	  }
	
	  function iterableClass(iterable) {
	    return isKeyed(iterable) ? KeyedIterable :
	      isIndexed(iterable) ? IndexedIterable :
	      SetIterable;
	  }
	
	  function makeSequence(iterable) {
	    return Object.create(
	      (
	        isKeyed(iterable) ? KeyedSeq :
	        isIndexed(iterable) ? IndexedSeq :
	        SetSeq
	      ).prototype
	    );
	  }
	
	  function cacheResultThrough() {
	    if (this._iter.cacheResult) {
	      this._iter.cacheResult();
	      this.size = this._iter.size;
	      return this;
	    } else {
	      return Seq.prototype.cacheResult.call(this);
	    }
	  }
	
	  function defaultComparator(a, b) {
	    return a > b ? 1 : a < b ? -1 : 0;
	  }
	
	  function forceIterator(keyPath) {
	    var iter = getIterator(keyPath);
	    if (!iter) {
	      // Array might not be iterable in this environment, so we need a fallback
	      // to our wrapped type.
	      if (!isArrayLike(keyPath)) {
	        throw new TypeError('Expected iterable or array-like: ' + keyPath);
	      }
	      iter = getIterator(Iterable(keyPath));
	    }
	    return iter;
	  }
	
	  createClass(src_Map__Map, KeyedCollection);
	
	    // @pragma Construction
	
	    function src_Map__Map(value) {
	      return value === null || value === undefined ? emptyMap() :
	        isMap(value) ? value :
	        emptyMap().withMutations(function(map ) {
	          var iter = KeyedIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v, k)  {return map.set(k, v)});
	        });
	    }
	
	    src_Map__Map.prototype.toString = function() {
	      return this.__toString('Map {', '}');
	    };
	
	    // @pragma Access
	
	    src_Map__Map.prototype.get = function(k, notSetValue) {
	      return this._root ?
	        this._root.get(0, undefined, k, notSetValue) :
	        notSetValue;
	    };
	
	    // @pragma Modification
	
	    src_Map__Map.prototype.set = function(k, v) {
	      return updateMap(this, k, v);
	    };
	
	    src_Map__Map.prototype.setIn = function(keyPath, v) {
	      return this.updateIn(keyPath, NOT_SET, function()  {return v});
	    };
	
	    src_Map__Map.prototype.remove = function(k) {
	      return updateMap(this, k, NOT_SET);
	    };
	
	    src_Map__Map.prototype.deleteIn = function(keyPath) {
	      return this.updateIn(keyPath, function()  {return NOT_SET});
	    };
	
	    src_Map__Map.prototype.update = function(k, notSetValue, updater) {
	      return arguments.length === 1 ?
	        k(this) :
	        this.updateIn([k], notSetValue, updater);
	    };
	
	    src_Map__Map.prototype.updateIn = function(keyPath, notSetValue, updater) {
	      if (!updater) {
	        updater = notSetValue;
	        notSetValue = undefined;
	      }
	      var updatedValue = updateInDeepMap(
	        this,
	        forceIterator(keyPath),
	        notSetValue,
	        updater
	      );
	      return updatedValue === NOT_SET ? undefined : updatedValue;
	    };
	
	    src_Map__Map.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._root = null;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyMap();
	    };
	
	    // @pragma Composition
	
	    src_Map__Map.prototype.merge = function(/*...iters*/) {
	      return mergeIntoMapWith(this, undefined, arguments);
	    };
	
	    src_Map__Map.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoMapWith(this, merger, iters);
	    };
	
	    src_Map__Map.prototype.mergeIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
	      return this.updateIn(
	        keyPath,
	        emptyMap(),
	        function(m ) {return typeof m.merge === 'function' ?
	          m.merge.apply(m, iters) :
	          iters[iters.length - 1]}
	      );
	    };
	
	    src_Map__Map.prototype.mergeDeep = function(/*...iters*/) {
	      return mergeIntoMapWith(this, deepMerger(undefined), arguments);
	    };
	
	    src_Map__Map.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoMapWith(this, deepMerger(merger), iters);
	    };
	
	    src_Map__Map.prototype.mergeDeepIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
	      return this.updateIn(
	        keyPath,
	        emptyMap(),
	        function(m ) {return typeof m.mergeDeep === 'function' ?
	          m.mergeDeep.apply(m, iters) :
	          iters[iters.length - 1]}
	      );
	    };
	
	    src_Map__Map.prototype.sort = function(comparator) {
	      // Late binding
	      return OrderedMap(sortFactory(this, comparator));
	    };
	
	    src_Map__Map.prototype.sortBy = function(mapper, comparator) {
	      // Late binding
	      return OrderedMap(sortFactory(this, comparator, mapper));
	    };
	
	    // @pragma Mutability
	
	    src_Map__Map.prototype.withMutations = function(fn) {
	      var mutable = this.asMutable();
	      fn(mutable);
	      return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
	    };
	
	    src_Map__Map.prototype.asMutable = function() {
	      return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
	    };
	
	    src_Map__Map.prototype.asImmutable = function() {
	      return this.__ensureOwner();
	    };
	
	    src_Map__Map.prototype.wasAltered = function() {
	      return this.__altered;
	    };
	
	    src_Map__Map.prototype.__iterator = function(type, reverse) {
	      return new MapIterator(this, type, reverse);
	    };
	
	    src_Map__Map.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      this._root && this._root.iterate(function(entry ) {
	        iterations++;
	        return fn(entry[1], entry[0], this$0);
	      }, reverse);
	      return iterations;
	    };
	
	    src_Map__Map.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this.__altered = false;
	        return this;
	      }
	      return makeMap(this.size, this._root, ownerID, this.__hash);
	    };
	
	
	  function isMap(maybeMap) {
	    return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
	  }
	
	  src_Map__Map.isMap = isMap;
	
	  var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';
	
	  var MapPrototype = src_Map__Map.prototype;
	  MapPrototype[IS_MAP_SENTINEL] = true;
	  MapPrototype[DELETE] = MapPrototype.remove;
	  MapPrototype.removeIn = MapPrototype.deleteIn;
	
	
	  // #pragma Trie Nodes
	
	
	
	    function ArrayMapNode(ownerID, entries) {
	      this.ownerID = ownerID;
	      this.entries = entries;
	    }
	
	    ArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      var entries = this.entries;
	      for (var ii = 0, len = entries.length; ii < len; ii++) {
	        if (is(key, entries[ii][0])) {
	          return entries[ii][1];
	        }
	      }
	      return notSetValue;
	    };
	
	    ArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      var removed = value === NOT_SET;
	
	      var entries = this.entries;
	      var idx = 0;
	      for (var len = entries.length; idx < len; idx++) {
	        if (is(key, entries[idx][0])) {
	          break;
	        }
	      }
	      var exists = idx < len;
	
	      if (exists ? entries[idx][1] === value : removed) {
	        return this;
	      }
	
	      SetRef(didAlter);
	      (removed || !exists) && SetRef(didChangeSize);
	
	      if (removed && entries.length === 1) {
	        return; // undefined
	      }
	
	      if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
	        return createNodes(ownerID, entries, key, value);
	      }
	
	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newEntries = isEditable ? entries : arrCopy(entries);
	
	      if (exists) {
	        if (removed) {
	          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
	        } else {
	          newEntries[idx] = [key, value];
	        }
	      } else {
	        newEntries.push([key, value]);
	      }
	
	      if (isEditable) {
	        this.entries = newEntries;
	        return this;
	      }
	
	      return new ArrayMapNode(ownerID, newEntries);
	    };
	
	
	
	
	    function BitmapIndexedNode(ownerID, bitmap, nodes) {
	      this.ownerID = ownerID;
	      this.bitmap = bitmap;
	      this.nodes = nodes;
	    }
	
	    BitmapIndexedNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var bit = (1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK));
	      var bitmap = this.bitmap;
	      return (bitmap & bit) === 0 ? notSetValue :
	        this.nodes[popCount(bitmap & (bit - 1))].get(shift + SHIFT, keyHash, key, notSetValue);
	    };
	
	    BitmapIndexedNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	      var bit = 1 << keyHashFrag;
	      var bitmap = this.bitmap;
	      var exists = (bitmap & bit) !== 0;
	
	      if (!exists && value === NOT_SET) {
	        return this;
	      }
	
	      var idx = popCount(bitmap & (bit - 1));
	      var nodes = this.nodes;
	      var node = exists ? nodes[idx] : undefined;
	      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
	
	      if (newNode === node) {
	        return this;
	      }
	
	      if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
	        return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
	      }
	
	      if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
	        return nodes[idx ^ 1];
	      }
	
	      if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
	        return newNode;
	      }
	
	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
	      var newNodes = exists ? newNode ?
	        setIn(nodes, idx, newNode, isEditable) :
	        spliceOut(nodes, idx, isEditable) :
	        spliceIn(nodes, idx, newNode, isEditable);
	
	      if (isEditable) {
	        this.bitmap = newBitmap;
	        this.nodes = newNodes;
	        return this;
	      }
	
	      return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
	    };
	
	
	
	
	    function HashArrayMapNode(ownerID, count, nodes) {
	      this.ownerID = ownerID;
	      this.count = count;
	      this.nodes = nodes;
	    }
	
	    HashArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	      var node = this.nodes[idx];
	      return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
	    };
	
	    HashArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	      var removed = value === NOT_SET;
	      var nodes = this.nodes;
	      var node = nodes[idx];
	
	      if (removed && !node) {
	        return this;
	      }
	
	      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
	      if (newNode === node) {
	        return this;
	      }
	
	      var newCount = this.count;
	      if (!node) {
	        newCount++;
	      } else if (!newNode) {
	        newCount--;
	        if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
	          return packNodes(ownerID, nodes, newCount, idx);
	        }
	      }
	
	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newNodes = setIn(nodes, idx, newNode, isEditable);
	
	      if (isEditable) {
	        this.count = newCount;
	        this.nodes = newNodes;
	        return this;
	      }
	
	      return new HashArrayMapNode(ownerID, newCount, newNodes);
	    };
	
	
	
	
	    function HashCollisionNode(ownerID, keyHash, entries) {
	      this.ownerID = ownerID;
	      this.keyHash = keyHash;
	      this.entries = entries;
	    }
	
	    HashCollisionNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      var entries = this.entries;
	      for (var ii = 0, len = entries.length; ii < len; ii++) {
	        if (is(key, entries[ii][0])) {
	          return entries[ii][1];
	        }
	      }
	      return notSetValue;
	    };
	
	    HashCollisionNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	
	      var removed = value === NOT_SET;
	
	      if (keyHash !== this.keyHash) {
	        if (removed) {
	          return this;
	        }
	        SetRef(didAlter);
	        SetRef(didChangeSize);
	        return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
	      }
	
	      var entries = this.entries;
	      var idx = 0;
	      for (var len = entries.length; idx < len; idx++) {
	        if (is(key, entries[idx][0])) {
	          break;
	        }
	      }
	      var exists = idx < len;
	
	      if (exists ? entries[idx][1] === value : removed) {
	        return this;
	      }
	
	      SetRef(didAlter);
	      (removed || !exists) && SetRef(didChangeSize);
	
	      if (removed && len === 2) {
	        return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
	      }
	
	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newEntries = isEditable ? entries : arrCopy(entries);
	
	      if (exists) {
	        if (removed) {
	          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
	        } else {
	          newEntries[idx] = [key, value];
	        }
	      } else {
	        newEntries.push([key, value]);
	      }
	
	      if (isEditable) {
	        this.entries = newEntries;
	        return this;
	      }
	
	      return new HashCollisionNode(ownerID, this.keyHash, newEntries);
	    };
	
	
	
	
	    function ValueNode(ownerID, keyHash, entry) {
	      this.ownerID = ownerID;
	      this.keyHash = keyHash;
	      this.entry = entry;
	    }
	
	    ValueNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
	    };
	
	    ValueNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      var removed = value === NOT_SET;
	      var keyMatch = is(key, this.entry[0]);
	      if (keyMatch ? value === this.entry[1] : removed) {
	        return this;
	      }
	
	      SetRef(didAlter);
	
	      if (removed) {
	        SetRef(didChangeSize);
	        return; // undefined
	      }
	
	      if (keyMatch) {
	        if (ownerID && ownerID === this.ownerID) {
	          this.entry[1] = value;
	          return this;
	        }
	        return new ValueNode(ownerID, this.keyHash, [key, value]);
	      }
	
	      SetRef(didChangeSize);
	      return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
	    };
	
	
	
	  // #pragma Iterators
	
	  ArrayMapNode.prototype.iterate =
	  HashCollisionNode.prototype.iterate = function (fn, reverse) {
	    var entries = this.entries;
	    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
	      if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
	        return false;
	      }
	    }
	  }
	
	  BitmapIndexedNode.prototype.iterate =
	  HashArrayMapNode.prototype.iterate = function (fn, reverse) {
	    var nodes = this.nodes;
	    for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
	      var node = nodes[reverse ? maxIndex - ii : ii];
	      if (node && node.iterate(fn, reverse) === false) {
	        return false;
	      }
	    }
	  }
	
	  ValueNode.prototype.iterate = function (fn, reverse) {
	    return fn(this.entry);
	  }
	
	  createClass(MapIterator, src_Iterator__Iterator);
	
	    function MapIterator(map, type, reverse) {
	      this._type = type;
	      this._reverse = reverse;
	      this._stack = map._root && mapIteratorFrame(map._root);
	    }
	
	    MapIterator.prototype.next = function() {
	      var type = this._type;
	      var stack = this._stack;
	      while (stack) {
	        var node = stack.node;
	        var index = stack.index++;
	        var maxIndex;
	        if (node.entry) {
	          if (index === 0) {
	            return mapIteratorValue(type, node.entry);
	          }
	        } else if (node.entries) {
	          maxIndex = node.entries.length - 1;
	          if (index <= maxIndex) {
	            return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
	          }
	        } else {
	          maxIndex = node.nodes.length - 1;
	          if (index <= maxIndex) {
	            var subNode = node.nodes[this._reverse ? maxIndex - index : index];
	            if (subNode) {
	              if (subNode.entry) {
	                return mapIteratorValue(type, subNode.entry);
	              }
	              stack = this._stack = mapIteratorFrame(subNode, stack);
	            }
	            continue;
	          }
	        }
	        stack = this._stack = this._stack.__prev;
	      }
	      return iteratorDone();
	    };
	
	
	  function mapIteratorValue(type, entry) {
	    return iteratorValue(type, entry[0], entry[1]);
	  }
	
	  function mapIteratorFrame(node, prev) {
	    return {
	      node: node,
	      index: 0,
	      __prev: prev
	    };
	  }
	
	  function makeMap(size, root, ownerID, hash) {
	    var map = Object.create(MapPrototype);
	    map.size = size;
	    map._root = root;
	    map.__ownerID = ownerID;
	    map.__hash = hash;
	    map.__altered = false;
	    return map;
	  }
	
	  var EMPTY_MAP;
	  function emptyMap() {
	    return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
	  }
	
	  function updateMap(map, k, v) {
	    var newRoot;
	    var newSize;
	    if (!map._root) {
	      if (v === NOT_SET) {
	        return map;
	      }
	      newSize = 1;
	      newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
	    } else {
	      var didChangeSize = MakeRef(CHANGE_LENGTH);
	      var didAlter = MakeRef(DID_ALTER);
	      newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);
	      if (!didAlter.value) {
	        return map;
	      }
	      newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
	    }
	    if (map.__ownerID) {
	      map.size = newSize;
	      map._root = newRoot;
	      map.__hash = undefined;
	      map.__altered = true;
	      return map;
	    }
	    return newRoot ? makeMap(newSize, newRoot) : emptyMap();
	  }
	
	  function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	    if (!node) {
	      if (value === NOT_SET) {
	        return node;
	      }
	      SetRef(didAlter);
	      SetRef(didChangeSize);
	      return new ValueNode(ownerID, keyHash, [key, value]);
	    }
	    return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
	  }
	
	  function isLeafNode(node) {
	    return node.constructor === ValueNode || node.constructor === HashCollisionNode;
	  }
	
	  function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
	    if (node.keyHash === keyHash) {
	      return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
	    }
	
	    var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
	    var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	
	    var newNode;
	    var nodes = idx1 === idx2 ?
	      [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] :
	      ((newNode = new ValueNode(ownerID, keyHash, entry)), idx1 < idx2 ? [node, newNode] : [newNode, node]);
	
	    return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
	  }
	
	  function createNodes(ownerID, entries, key, value) {
	    if (!ownerID) {
	      ownerID = new OwnerID();
	    }
	    var node = new ValueNode(ownerID, hash(key), [key, value]);
	    for (var ii = 0; ii < entries.length; ii++) {
	      var entry = entries[ii];
	      node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
	    }
	    return node;
	  }
	
	  function packNodes(ownerID, nodes, count, excluding) {
	    var bitmap = 0;
	    var packedII = 0;
	    var packedNodes = new Array(count);
	    for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
	      var node = nodes[ii];
	      if (node !== undefined && ii !== excluding) {
	        bitmap |= bit;
	        packedNodes[packedII++] = node;
	      }
	    }
	    return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
	  }
	
	  function expandNodes(ownerID, nodes, bitmap, including, node) {
	    var count = 0;
	    var expandedNodes = new Array(SIZE);
	    for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
	      expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
	    }
	    expandedNodes[including] = node;
	    return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
	  }
	
	  function mergeIntoMapWith(map, merger, iterables) {
	    var iters = [];
	    for (var ii = 0; ii < iterables.length; ii++) {
	      var value = iterables[ii];
	      var iter = KeyedIterable(value);
	      if (!isIterable(value)) {
	        iter = iter.map(function(v ) {return fromJS(v)});
	      }
	      iters.push(iter);
	    }
	    return mergeIntoCollectionWith(map, merger, iters);
	  }
	
	  function deepMerger(merger) {
	    return function(existing, value, key) 
	      {return existing && existing.mergeDeepWith && isIterable(value) ?
	        existing.mergeDeepWith(merger, value) :
	        merger ? merger(existing, value, key) : value};
	  }
	
	  function mergeIntoCollectionWith(collection, merger, iters) {
	    iters = iters.filter(function(x ) {return x.size !== 0});
	    if (iters.length === 0) {
	      return collection;
	    }
	    if (collection.size === 0 && !collection.__ownerID && iters.length === 1) {
	      return collection.constructor(iters[0]);
	    }
	    return collection.withMutations(function(collection ) {
	      var mergeIntoMap = merger ?
	        function(value, key)  {
	          collection.update(key, NOT_SET, function(existing )
	            {return existing === NOT_SET ? value : merger(existing, value, key)}
	          );
	        } :
	        function(value, key)  {
	          collection.set(key, value);
	        }
	      for (var ii = 0; ii < iters.length; ii++) {
	        iters[ii].forEach(mergeIntoMap);
	      }
	    });
	  }
	
	  function updateInDeepMap(existing, keyPathIter, notSetValue, updater) {
	    var isNotSet = existing === NOT_SET;
	    var step = keyPathIter.next();
	    if (step.done) {
	      var existingValue = isNotSet ? notSetValue : existing;
	      var newValue = updater(existingValue);
	      return newValue === existingValue ? existing : newValue;
	    }
	    invariant(
	      isNotSet || (existing && existing.set),
	      'invalid keyPath'
	    );
	    var key = step.value;
	    var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
	    var nextUpdated = updateInDeepMap(
	      nextExisting,
	      keyPathIter,
	      notSetValue,
	      updater
	    );
	    return nextUpdated === nextExisting ? existing :
	      nextUpdated === NOT_SET ? existing.remove(key) :
	      (isNotSet ? emptyMap() : existing).set(key, nextUpdated);
	  }
	
	  function popCount(x) {
	    x = x - ((x >> 1) & 0x55555555);
	    x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
	    x = (x + (x >> 4)) & 0x0f0f0f0f;
	    x = x + (x >> 8);
	    x = x + (x >> 16);
	    return x & 0x7f;
	  }
	
	  function setIn(array, idx, val, canEdit) {
	    var newArray = canEdit ? array : arrCopy(array);
	    newArray[idx] = val;
	    return newArray;
	  }
	
	  function spliceIn(array, idx, val, canEdit) {
	    var newLen = array.length + 1;
	    if (canEdit && idx + 1 === newLen) {
	      array[idx] = val;
	      return array;
	    }
	    var newArray = new Array(newLen);
	    var after = 0;
	    for (var ii = 0; ii < newLen; ii++) {
	      if (ii === idx) {
	        newArray[ii] = val;
	        after = -1;
	      } else {
	        newArray[ii] = array[ii + after];
	      }
	    }
	    return newArray;
	  }
	
	  function spliceOut(array, idx, canEdit) {
	    var newLen = array.length - 1;
	    if (canEdit && idx === newLen) {
	      array.pop();
	      return array;
	    }
	    var newArray = new Array(newLen);
	    var after = 0;
	    for (var ii = 0; ii < newLen; ii++) {
	      if (ii === idx) {
	        after = 1;
	      }
	      newArray[ii] = array[ii + after];
	    }
	    return newArray;
	  }
	
	  var MAX_ARRAY_MAP_SIZE = SIZE / 4;
	  var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
	  var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;
	
	  createClass(List, IndexedCollection);
	
	    // @pragma Construction
	
	    function List(value) {
	      var empty = emptyList();
	      if (value === null || value === undefined) {
	        return empty;
	      }
	      if (isList(value)) {
	        return value;
	      }
	      var iter = IndexedIterable(value);
	      var size = iter.size;
	      if (size === 0) {
	        return empty;
	      }
	      assertNotInfinite(size);
	      if (size > 0 && size < SIZE) {
	        return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
	      }
	      return empty.withMutations(function(list ) {
	        list.setSize(size);
	        iter.forEach(function(v, i)  {return list.set(i, v)});
	      });
	    }
	
	    List.of = function(/*...values*/) {
	      return this(arguments);
	    };
	
	    List.prototype.toString = function() {
	      return this.__toString('List [', ']');
	    };
	
	    // @pragma Access
	
	    List.prototype.get = function(index, notSetValue) {
	      index = wrapIndex(this, index);
	      if (index < 0 || index >= this.size) {
	        return notSetValue;
	      }
	      index += this._origin;
	      var node = listNodeFor(this, index);
	      return node && node.array[index & MASK];
	    };
	
	    // @pragma Modification
	
	    List.prototype.set = function(index, value) {
	      return updateList(this, index, value);
	    };
	
	    List.prototype.remove = function(index) {
	      return !this.has(index) ? this :
	        index === 0 ? this.shift() :
	        index === this.size - 1 ? this.pop() :
	        this.splice(index, 1);
	    };
	
	    List.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = this._origin = this._capacity = 0;
	        this._level = SHIFT;
	        this._root = this._tail = null;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyList();
	    };
	
	    List.prototype.push = function(/*...values*/) {
	      var values = arguments;
	      var oldSize = this.size;
	      return this.withMutations(function(list ) {
	        setListBounds(list, 0, oldSize + values.length);
	        for (var ii = 0; ii < values.length; ii++) {
	          list.set(oldSize + ii, values[ii]);
	        }
	      });
	    };
	
	    List.prototype.pop = function() {
	      return setListBounds(this, 0, -1);
	    };
	
	    List.prototype.unshift = function(/*...values*/) {
	      var values = arguments;
	      return this.withMutations(function(list ) {
	        setListBounds(list, -values.length);
	        for (var ii = 0; ii < values.length; ii++) {
	          list.set(ii, values[ii]);
	        }
	      });
	    };
	
	    List.prototype.shift = function() {
	      return setListBounds(this, 1);
	    };
	
	    // @pragma Composition
	
	    List.prototype.merge = function(/*...iters*/) {
	      return mergeIntoListWith(this, undefined, arguments);
	    };
	
	    List.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoListWith(this, merger, iters);
	    };
	
	    List.prototype.mergeDeep = function(/*...iters*/) {
	      return mergeIntoListWith(this, deepMerger(undefined), arguments);
	    };
	
	    List.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoListWith(this, deepMerger(merger), iters);
	    };
	
	    List.prototype.setSize = function(size) {
	      return setListBounds(this, 0, size);
	    };
	
	    // @pragma Iteration
	
	    List.prototype.slice = function(begin, end) {
	      var size = this.size;
	      if (wholeSlice(begin, end, size)) {
	        return this;
	      }
	      return setListBounds(
	        this,
	        resolveBegin(begin, size),
	        resolveEnd(end, size)
	      );
	    };
	
	    List.prototype.__iterator = function(type, reverse) {
	      var index = 0;
	      var values = iterateList(this, reverse);
	      return new src_Iterator__Iterator(function()  {
	        var value = values();
	        return value === DONE ?
	          iteratorDone() :
	          iteratorValue(type, index++, value);
	      });
	    };
	
	    List.prototype.__iterate = function(fn, reverse) {
	      var index = 0;
	      var values = iterateList(this, reverse);
	      var value;
	      while ((value = values()) !== DONE) {
	        if (fn(value, index++, this) === false) {
	          break;
	        }
	      }
	      return index;
	    };
	
	    List.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        return this;
	      }
	      return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
	    };
	
	
	  function isList(maybeList) {
	    return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
	  }
	
	  List.isList = isList;
	
	  var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';
	
	  var ListPrototype = List.prototype;
	  ListPrototype[IS_LIST_SENTINEL] = true;
	  ListPrototype[DELETE] = ListPrototype.remove;
	  ListPrototype.setIn = MapPrototype.setIn;
	  ListPrototype.deleteIn =
	  ListPrototype.removeIn = MapPrototype.removeIn;
	  ListPrototype.update = MapPrototype.update;
	  ListPrototype.updateIn = MapPrototype.updateIn;
	  ListPrototype.mergeIn = MapPrototype.mergeIn;
	  ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
	  ListPrototype.withMutations = MapPrototype.withMutations;
	  ListPrototype.asMutable = MapPrototype.asMutable;
	  ListPrototype.asImmutable = MapPrototype.asImmutable;
	  ListPrototype.wasAltered = MapPrototype.wasAltered;
	
	
	
	    function VNode(array, ownerID) {
	      this.array = array;
	      this.ownerID = ownerID;
	    }
	
	    // TODO: seems like these methods are very similar
	
	    VNode.prototype.removeBefore = function(ownerID, level, index) {
	      if (index === level ? 1 << level : 0 || this.array.length === 0) {
	        return this;
	      }
	      var originIndex = (index >>> level) & MASK;
	      if (originIndex >= this.array.length) {
	        return new VNode([], ownerID);
	      }
	      var removingFirst = originIndex === 0;
	      var newChild;
	      if (level > 0) {
	        var oldChild = this.array[originIndex];
	        newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
	        if (newChild === oldChild && removingFirst) {
	          return this;
	        }
	      }
	      if (removingFirst && !newChild) {
	        return this;
	      }
	      var editable = editableVNode(this, ownerID);
	      if (!removingFirst) {
	        for (var ii = 0; ii < originIndex; ii++) {
	          editable.array[ii] = undefined;
	        }
	      }
	      if (newChild) {
	        editable.array[originIndex] = newChild;
	      }
	      return editable;
	    };
	
	    VNode.prototype.removeAfter = function(ownerID, level, index) {
	      if (index === level ? 1 << level : 0 || this.array.length === 0) {
	        return this;
	      }
	      var sizeIndex = ((index - 1) >>> level) & MASK;
	      if (sizeIndex >= this.array.length) {
	        return this;
	      }
	      var removingLast = sizeIndex === this.array.length - 1;
	      var newChild;
	      if (level > 0) {
	        var oldChild = this.array[sizeIndex];
	        newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
	        if (newChild === oldChild && removingLast) {
	          return this;
	        }
	      }
	      if (removingLast && !newChild) {
	        return this;
	      }
	      var editable = editableVNode(this, ownerID);
	      if (!removingLast) {
	        editable.array.pop();
	      }
	      if (newChild) {
	        editable.array[sizeIndex] = newChild;
	      }
	      return editable;
	    };
	
	
	
	  var DONE = {};
	
	  function iterateList(list, reverse) {
	    var left = list._origin;
	    var right = list._capacity;
	    var tailPos = getTailOffset(right);
	    var tail = list._tail;
	
	    return iterateNodeOrLeaf(list._root, list._level, 0);
	
	    function iterateNodeOrLeaf(node, level, offset) {
	      return level === 0 ?
	        iterateLeaf(node, offset) :
	        iterateNode(node, level, offset);
	    }
	
	    function iterateLeaf(node, offset) {
	      var array = offset === tailPos ? tail && tail.array : node && node.array;
	      var from = offset > left ? 0 : left - offset;
	      var to = right - offset;
	      if (to > SIZE) {
	        to = SIZE;
	      }
	      return function()  {
	        if (from === to) {
	          return DONE;
	        }
	        var idx = reverse ? --to : from++;
	        return array && array[idx];
	      };
	    }
	
	    function iterateNode(node, level, offset) {
	      var values;
	      var array = node && node.array;
	      var from = offset > left ? 0 : (left - offset) >> level;
	      var to = ((right - offset) >> level) + 1;
	      if (to > SIZE) {
	        to = SIZE;
	      }
	      return function()  {
	        do {
	          if (values) {
	            var value = values();
	            if (value !== DONE) {
	              return value;
	            }
	            values = null;
	          }
	          if (from === to) {
	            return DONE;
	          }
	          var idx = reverse ? --to : from++;
	          values = iterateNodeOrLeaf(
	            array && array[idx], level - SHIFT, offset + (idx << level)
	          );
	        } while (true);
	      };
	    }
	  }
	
	  function makeList(origin, capacity, level, root, tail, ownerID, hash) {
	    var list = Object.create(ListPrototype);
	    list.size = capacity - origin;
	    list._origin = origin;
	    list._capacity = capacity;
	    list._level = level;
	    list._root = root;
	    list._tail = tail;
	    list.__ownerID = ownerID;
	    list.__hash = hash;
	    list.__altered = false;
	    return list;
	  }
	
	  var EMPTY_LIST;
	  function emptyList() {
	    return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
	  }
	
	  function updateList(list, index, value) {
	    index = wrapIndex(list, index);
	
	    if (index >= list.size || index < 0) {
	      return list.withMutations(function(list ) {
	        index < 0 ?
	          setListBounds(list, index).set(0, value) :
	          setListBounds(list, 0, index + 1).set(index, value)
	      });
	    }
	
	    index += list._origin;
	
	    var newTail = list._tail;
	    var newRoot = list._root;
	    var didAlter = MakeRef(DID_ALTER);
	    if (index >= getTailOffset(list._capacity)) {
	      newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
	    } else {
	      newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
	    }
	
	    if (!didAlter.value) {
	      return list;
	    }
	
	    if (list.__ownerID) {
	      list._root = newRoot;
	      list._tail = newTail;
	      list.__hash = undefined;
	      list.__altered = true;
	      return list;
	    }
	    return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
	  }
	
	  function updateVNode(node, ownerID, level, index, value, didAlter) {
	    var idx = (index >>> level) & MASK;
	    var nodeHas = node && idx < node.array.length;
	    if (!nodeHas && value === undefined) {
	      return node;
	    }
	
	    var newNode;
	
	    if (level > 0) {
	      var lowerNode = node && node.array[idx];
	      var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);
	      if (newLowerNode === lowerNode) {
	        return node;
	      }
	      newNode = editableVNode(node, ownerID);
	      newNode.array[idx] = newLowerNode;
	      return newNode;
	    }
	
	    if (nodeHas && node.array[idx] === value) {
	      return node;
	    }
	
	    SetRef(didAlter);
	
	    newNode = editableVNode(node, ownerID);
	    if (value === undefined && idx === newNode.array.length - 1) {
	      newNode.array.pop();
	    } else {
	      newNode.array[idx] = value;
	    }
	    return newNode;
	  }
	
	  function editableVNode(node, ownerID) {
	    if (ownerID && node && ownerID === node.ownerID) {
	      return node;
	    }
	    return new VNode(node ? node.array.slice() : [], ownerID);
	  }
	
	  function listNodeFor(list, rawIndex) {
	    if (rawIndex >= getTailOffset(list._capacity)) {
	      return list._tail;
	    }
	    if (rawIndex < 1 << (list._level + SHIFT)) {
	      var node = list._root;
	      var level = list._level;
	      while (node && level > 0) {
	        node = node.array[(rawIndex >>> level) & MASK];
	        level -= SHIFT;
	      }
	      return node;
	    }
	  }
	
	  function setListBounds(list, begin, end) {
	    var owner = list.__ownerID || new OwnerID();
	    var oldOrigin = list._origin;
	    var oldCapacity = list._capacity;
	    var newOrigin = oldOrigin + begin;
	    var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;
	    if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
	      return list;
	    }
	
	    // If it's going to end after it starts, it's empty.
	    if (newOrigin >= newCapacity) {
	      return list.clear();
	    }
	
	    var newLevel = list._level;
	    var newRoot = list._root;
	
	    // New origin might need creating a higher root.
	    var offsetShift = 0;
	    while (newOrigin + offsetShift < 0) {
	      newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
	      newLevel += SHIFT;
	      offsetShift += 1 << newLevel;
	    }
	    if (offsetShift) {
	      newOrigin += offsetShift;
	      oldOrigin += offsetShift;
	      newCapacity += offsetShift;
	      oldCapacity += offsetShift;
	    }
	
	    var oldTailOffset = getTailOffset(oldCapacity);
	    var newTailOffset = getTailOffset(newCapacity);
	
	    // New size might need creating a higher root.
	    while (newTailOffset >= 1 << (newLevel + SHIFT)) {
	      newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
	      newLevel += SHIFT;
	    }
	
	    // Locate or create the new tail.
	    var oldTail = list._tail;
	    var newTail = newTailOffset < oldTailOffset ?
	      listNodeFor(list, newCapacity - 1) :
	      newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;
	
	    // Merge Tail into tree.
	    if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
	      newRoot = editableVNode(newRoot, owner);
	      var node = newRoot;
	      for (var level = newLevel; level > SHIFT; level -= SHIFT) {
	        var idx = (oldTailOffset >>> level) & MASK;
	        node = node.array[idx] = editableVNode(node.array[idx], owner);
	      }
	      node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
	    }
	
	    // If the size has been reduced, there's a chance the tail needs to be trimmed.
	    if (newCapacity < oldCapacity) {
	      newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
	    }
	
	    // If the new origin is within the tail, then we do not need a root.
	    if (newOrigin >= newTailOffset) {
	      newOrigin -= newTailOffset;
	      newCapacity -= newTailOffset;
	      newLevel = SHIFT;
	      newRoot = null;
	      newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);
	
	    // Otherwise, if the root has been trimmed, garbage collect.
	    } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
	      offsetShift = 0;
	
	      // Identify the new top root node of the subtree of the old root.
	      while (newRoot) {
	        var beginIndex = (newOrigin >>> newLevel) & MASK;
	        if (beginIndex !== (newTailOffset >>> newLevel) & MASK) {
	          break;
	        }
	        if (beginIndex) {
	          offsetShift += (1 << newLevel) * beginIndex;
	        }
	        newLevel -= SHIFT;
	        newRoot = newRoot.array[beginIndex];
	      }
	
	      // Trim the new sides of the new root.
	      if (newRoot && newOrigin > oldOrigin) {
	        newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
	      }
	      if (newRoot && newTailOffset < oldTailOffset) {
	        newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
	      }
	      if (offsetShift) {
	        newOrigin -= offsetShift;
	        newCapacity -= offsetShift;
	      }
	    }
	
	    if (list.__ownerID) {
	      list.size = newCapacity - newOrigin;
	      list._origin = newOrigin;
	      list._capacity = newCapacity;
	      list._level = newLevel;
	      list._root = newRoot;
	      list._tail = newTail;
	      list.__hash = undefined;
	      list.__altered = true;
	      return list;
	    }
	    return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
	  }
	
	  function mergeIntoListWith(list, merger, iterables) {
	    var iters = [];
	    var maxSize = 0;
	    for (var ii = 0; ii < iterables.length; ii++) {
	      var value = iterables[ii];
	      var iter = IndexedIterable(value);
	      if (iter.size > maxSize) {
	        maxSize = iter.size;
	      }
	      if (!isIterable(value)) {
	        iter = iter.map(function(v ) {return fromJS(v)});
	      }
	      iters.push(iter);
	    }
	    if (maxSize > list.size) {
	      list = list.setSize(maxSize);
	    }
	    return mergeIntoCollectionWith(list, merger, iters);
	  }
	
	  function getTailOffset(size) {
	    return size < SIZE ? 0 : (((size - 1) >>> SHIFT) << SHIFT);
	  }
	
	  createClass(OrderedMap, src_Map__Map);
	
	    // @pragma Construction
	
	    function OrderedMap(value) {
	      return value === null || value === undefined ? emptyOrderedMap() :
	        isOrderedMap(value) ? value :
	        emptyOrderedMap().withMutations(function(map ) {
	          var iter = KeyedIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v, k)  {return map.set(k, v)});
	        });
	    }
	
	    OrderedMap.of = function(/*...values*/) {
	      return this(arguments);
	    };
	
	    OrderedMap.prototype.toString = function() {
	      return this.__toString('OrderedMap {', '}');
	    };
	
	    // @pragma Access
	
	    OrderedMap.prototype.get = function(k, notSetValue) {
	      var index = this._map.get(k);
	      return index !== undefined ? this._list.get(index)[1] : notSetValue;
	    };
	
	    // @pragma Modification
	
	    OrderedMap.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._map.clear();
	        this._list.clear();
	        return this;
	      }
	      return emptyOrderedMap();
	    };
	
	    OrderedMap.prototype.set = function(k, v) {
	      return updateOrderedMap(this, k, v);
	    };
	
	    OrderedMap.prototype.remove = function(k) {
	      return updateOrderedMap(this, k, NOT_SET);
	    };
	
	    OrderedMap.prototype.wasAltered = function() {
	      return this._map.wasAltered() || this._list.wasAltered();
	    };
	
	    OrderedMap.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._list.__iterate(
	        function(entry ) {return entry && fn(entry[1], entry[0], this$0)},
	        reverse
	      );
	    };
	
	    OrderedMap.prototype.__iterator = function(type, reverse) {
	      return this._list.fromEntrySeq().__iterator(type, reverse);
	    };
	
	    OrderedMap.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map.__ensureOwner(ownerID);
	      var newList = this._list.__ensureOwner(ownerID);
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        this._list = newList;
	        return this;
	      }
	      return makeOrderedMap(newMap, newList, ownerID, this.__hash);
	    };
	
	
	  function isOrderedMap(maybeOrderedMap) {
	    return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
	  }
	
	  OrderedMap.isOrderedMap = isOrderedMap;
	
	  OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
	  OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;
	
	
	
	  function makeOrderedMap(map, list, ownerID, hash) {
	    var omap = Object.create(OrderedMap.prototype);
	    omap.size = map ? map.size : 0;
	    omap._map = map;
	    omap._list = list;
	    omap.__ownerID = ownerID;
	    omap.__hash = hash;
	    return omap;
	  }
	
	  var EMPTY_ORDERED_MAP;
	  function emptyOrderedMap() {
	    return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
	  }
	
	  function updateOrderedMap(omap, k, v) {
	    var map = omap._map;
	    var list = omap._list;
	    var i = map.get(k);
	    var has = i !== undefined;
	    var newMap;
	    var newList;
	    if (v === NOT_SET) { // removed
	      if (!has) {
	        return omap;
	      }
	      if (list.size >= SIZE && list.size >= map.size * 2) {
	        newList = list.filter(function(entry, idx)  {return entry !== undefined && i !== idx});
	        newMap = newList.toKeyedSeq().map(function(entry ) {return entry[0]}).flip().toMap();
	        if (omap.__ownerID) {
	          newMap.__ownerID = newList.__ownerID = omap.__ownerID;
	        }
	      } else {
	        newMap = map.remove(k);
	        newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
	      }
	    } else {
	      if (has) {
	        if (v === list.get(i)[1]) {
	          return omap;
	        }
	        newMap = map;
	        newList = list.set(i, [k, v]);
	      } else {
	        newMap = map.set(k, list.size);
	        newList = list.set(list.size, [k, v]);
	      }
	    }
	    if (omap.__ownerID) {
	      omap.size = newMap.size;
	      omap._map = newMap;
	      omap._list = newList;
	      omap.__hash = undefined;
	      return omap;
	    }
	    return makeOrderedMap(newMap, newList);
	  }
	
	  createClass(Stack, IndexedCollection);
	
	    // @pragma Construction
	
	    function Stack(value) {
	      return value === null || value === undefined ? emptyStack() :
	        isStack(value) ? value :
	        emptyStack().unshiftAll(value);
	    }
	
	    Stack.of = function(/*...values*/) {
	      return this(arguments);
	    };
	
	    Stack.prototype.toString = function() {
	      return this.__toString('Stack [', ']');
	    };
	
	    // @pragma Access
	
	    Stack.prototype.get = function(index, notSetValue) {
	      var head = this._head;
	      index = wrapIndex(this, index);
	      while (head && index--) {
	        head = head.next;
	      }
	      return head ? head.value : notSetValue;
	    };
	
	    Stack.prototype.peek = function() {
	      return this._head && this._head.value;
	    };
	
	    // @pragma Modification
	
	    Stack.prototype.push = function(/*...values*/) {
	      if (arguments.length === 0) {
	        return this;
	      }
	      var newSize = this.size + arguments.length;
	      var head = this._head;
	      for (var ii = arguments.length - 1; ii >= 0; ii--) {
	        head = {
	          value: arguments[ii],
	          next: head
	        };
	      }
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };
	
	    Stack.prototype.pushAll = function(iter) {
	      iter = IndexedIterable(iter);
	      if (iter.size === 0) {
	        return this;
	      }
	      assertNotInfinite(iter.size);
	      var newSize = this.size;
	      var head = this._head;
	      iter.reverse().forEach(function(value ) {
	        newSize++;
	        head = {
	          value: value,
	          next: head
	        };
	      });
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };
	
	    Stack.prototype.pop = function() {
	      return this.slice(1);
	    };
	
	    Stack.prototype.unshift = function(/*...values*/) {
	      return this.push.apply(this, arguments);
	    };
	
	    Stack.prototype.unshiftAll = function(iter) {
	      return this.pushAll(iter);
	    };
	
	    Stack.prototype.shift = function() {
	      return this.pop.apply(this, arguments);
	    };
	
	    Stack.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._head = undefined;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyStack();
	    };
	
	    Stack.prototype.slice = function(begin, end) {
	      if (wholeSlice(begin, end, this.size)) {
	        return this;
	      }
	      var resolvedBegin = resolveBegin(begin, this.size);
	      var resolvedEnd = resolveEnd(end, this.size);
	      if (resolvedEnd !== this.size) {
	        // super.slice(begin, end);
	        return IndexedCollection.prototype.slice.call(this, begin, end);
	      }
	      var newSize = this.size - resolvedBegin;
	      var head = this._head;
	      while (resolvedBegin--) {
	        head = head.next;
	      }
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };
	
	    // @pragma Mutability
	
	    Stack.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this.__altered = false;
	        return this;
	      }
	      return makeStack(this.size, this._head, ownerID, this.__hash);
	    };
	
	    // @pragma Iteration
	
	    Stack.prototype.__iterate = function(fn, reverse) {
	      if (reverse) {
	        return this.reverse().__iterate(fn);
	      }
	      var iterations = 0;
	      var node = this._head;
	      while (node) {
	        if (fn(node.value, iterations++, this) === false) {
	          break;
	        }
	        node = node.next;
	      }
	      return iterations;
	    };
	
	    Stack.prototype.__iterator = function(type, reverse) {
	      if (reverse) {
	        return this.reverse().__iterator(type);
	      }
	      var iterations = 0;
	      var node = this._head;
	      return new src_Iterator__Iterator(function()  {
	        if (node) {
	          var value = node.value;
	          node = node.next;
	          return iteratorValue(type, iterations++, value);
	        }
	        return iteratorDone();
	      });
	    };
	
	
	  function isStack(maybeStack) {
	    return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
	  }
	
	  Stack.isStack = isStack;
	
	  var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';
	
	  var StackPrototype = Stack.prototype;
	  StackPrototype[IS_STACK_SENTINEL] = true;
	  StackPrototype.withMutations = MapPrototype.withMutations;
	  StackPrototype.asMutable = MapPrototype.asMutable;
	  StackPrototype.asImmutable = MapPrototype.asImmutable;
	  StackPrototype.wasAltered = MapPrototype.wasAltered;
	
	
	  function makeStack(size, head, ownerID, hash) {
	    var map = Object.create(StackPrototype);
	    map.size = size;
	    map._head = head;
	    map.__ownerID = ownerID;
	    map.__hash = hash;
	    map.__altered = false;
	    return map;
	  }
	
	  var EMPTY_STACK;
	  function emptyStack() {
	    return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
	  }
	
	  createClass(src_Set__Set, SetCollection);
	
	    // @pragma Construction
	
	    function src_Set__Set(value) {
	      return value === null || value === undefined ? emptySet() :
	        isSet(value) ? value :
	        emptySet().withMutations(function(set ) {
	          var iter = SetIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v ) {return set.add(v)});
	        });
	    }
	
	    src_Set__Set.of = function(/*...values*/) {
	      return this(arguments);
	    };
	
	    src_Set__Set.fromKeys = function(value) {
	      return this(KeyedIterable(value).keySeq());
	    };
	
	    src_Set__Set.prototype.toString = function() {
	      return this.__toString('Set {', '}');
	    };
	
	    // @pragma Access
	
	    src_Set__Set.prototype.has = function(value) {
	      return this._map.has(value);
	    };
	
	    // @pragma Modification
	
	    src_Set__Set.prototype.add = function(value) {
	      return updateSet(this, this._map.set(value, true));
	    };
	
	    src_Set__Set.prototype.remove = function(value) {
	      return updateSet(this, this._map.remove(value));
	    };
	
	    src_Set__Set.prototype.clear = function() {
	      return updateSet(this, this._map.clear());
	    };
	
	    // @pragma Composition
	
	    src_Set__Set.prototype.union = function() {var iters = SLICE$0.call(arguments, 0);
	      iters = iters.filter(function(x ) {return x.size !== 0});
	      if (iters.length === 0) {
	        return this;
	      }
	      if (this.size === 0 && !this.__ownerID && iters.length === 1) {
	        return this.constructor(iters[0]);
	      }
	      return this.withMutations(function(set ) {
	        for (var ii = 0; ii < iters.length; ii++) {
	          SetIterable(iters[ii]).forEach(function(value ) {return set.add(value)});
	        }
	      });
	    };
	
	    src_Set__Set.prototype.intersect = function() {var iters = SLICE$0.call(arguments, 0);
	      if (iters.length === 0) {
	        return this;
	      }
	      iters = iters.map(function(iter ) {return SetIterable(iter)});
	      var originalSet = this;
	      return this.withMutations(function(set ) {
	        originalSet.forEach(function(value ) {
	          if (!iters.every(function(iter ) {return iter.includes(value)})) {
	            set.remove(value);
	          }
	        });
	      });
	    };
	
	    src_Set__Set.prototype.subtract = function() {var iters = SLICE$0.call(arguments, 0);
	      if (iters.length === 0) {
	        return this;
	      }
	      iters = iters.map(function(iter ) {return SetIterable(iter)});
	      var originalSet = this;
	      return this.withMutations(function(set ) {
	        originalSet.forEach(function(value ) {
	          if (iters.some(function(iter ) {return iter.includes(value)})) {
	            set.remove(value);
	          }
	        });
	      });
	    };
	
	    src_Set__Set.prototype.merge = function() {
	      return this.union.apply(this, arguments);
	    };
	
	    src_Set__Set.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return this.union.apply(this, iters);
	    };
	
	    src_Set__Set.prototype.sort = function(comparator) {
	      // Late binding
	      return OrderedSet(sortFactory(this, comparator));
	    };
	
	    src_Set__Set.prototype.sortBy = function(mapper, comparator) {
	      // Late binding
	      return OrderedSet(sortFactory(this, comparator, mapper));
	    };
	
	    src_Set__Set.prototype.wasAltered = function() {
	      return this._map.wasAltered();
	    };
	
	    src_Set__Set.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._map.__iterate(function(_, k)  {return fn(k, k, this$0)}, reverse);
	    };
	
	    src_Set__Set.prototype.__iterator = function(type, reverse) {
	      return this._map.map(function(_, k)  {return k}).__iterator(type, reverse);
	    };
	
	    src_Set__Set.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map.__ensureOwner(ownerID);
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        return this;
	      }
	      return this.__make(newMap, ownerID);
	    };
	
	
	  function isSet(maybeSet) {
	    return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
	  }
	
	  src_Set__Set.isSet = isSet;
	
	  var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';
	
	  var SetPrototype = src_Set__Set.prototype;
	  SetPrototype[IS_SET_SENTINEL] = true;
	  SetPrototype[DELETE] = SetPrototype.remove;
	  SetPrototype.mergeDeep = SetPrototype.merge;
	  SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
	  SetPrototype.withMutations = MapPrototype.withMutations;
	  SetPrototype.asMutable = MapPrototype.asMutable;
	  SetPrototype.asImmutable = MapPrototype.asImmutable;
	
	  SetPrototype.__empty = emptySet;
	  SetPrototype.__make = makeSet;
	
	  function updateSet(set, newMap) {
	    if (set.__ownerID) {
	      set.size = newMap.size;
	      set._map = newMap;
	      return set;
	    }
	    return newMap === set._map ? set :
	      newMap.size === 0 ? set.__empty() :
	      set.__make(newMap);
	  }
	
	  function makeSet(map, ownerID) {
	    var set = Object.create(SetPrototype);
	    set.size = map ? map.size : 0;
	    set._map = map;
	    set.__ownerID = ownerID;
	    return set;
	  }
	
	  var EMPTY_SET;
	  function emptySet() {
	    return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
	  }
	
	  createClass(OrderedSet, src_Set__Set);
	
	    // @pragma Construction
	
	    function OrderedSet(value) {
	      return value === null || value === undefined ? emptyOrderedSet() :
	        isOrderedSet(value) ? value :
	        emptyOrderedSet().withMutations(function(set ) {
	          var iter = SetIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v ) {return set.add(v)});
	        });
	    }
	
	    OrderedSet.of = function(/*...values*/) {
	      return this(arguments);
	    };
	
	    OrderedSet.fromKeys = function(value) {
	      return this(KeyedIterable(value).keySeq());
	    };
	
	    OrderedSet.prototype.toString = function() {
	      return this.__toString('OrderedSet {', '}');
	    };
	
	
	  function isOrderedSet(maybeOrderedSet) {
	    return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
	  }
	
	  OrderedSet.isOrderedSet = isOrderedSet;
	
	  var OrderedSetPrototype = OrderedSet.prototype;
	  OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;
	
	  OrderedSetPrototype.__empty = emptyOrderedSet;
	  OrderedSetPrototype.__make = makeOrderedSet;
	
	  function makeOrderedSet(map, ownerID) {
	    var set = Object.create(OrderedSetPrototype);
	    set.size = map ? map.size : 0;
	    set._map = map;
	    set.__ownerID = ownerID;
	    return set;
	  }
	
	  var EMPTY_ORDERED_SET;
	  function emptyOrderedSet() {
	    return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
	  }
	
	  createClass(Record, KeyedCollection);
	
	    function Record(defaultValues, name) {
	      var hasInitialized;
	
	      var RecordType = function Record(values) {
	        if (values instanceof RecordType) {
	          return values;
	        }
	        if (!(this instanceof RecordType)) {
	          return new RecordType(values);
	        }
	        if (!hasInitialized) {
	          hasInitialized = true;
	          var keys = Object.keys(defaultValues);
	          setProps(RecordTypePrototype, keys);
	          RecordTypePrototype.size = keys.length;
	          RecordTypePrototype._name = name;
	          RecordTypePrototype._keys = keys;
	          RecordTypePrototype._defaultValues = defaultValues;
	        }
	        this._map = src_Map__Map(values);
	      };
	
	      var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
	      RecordTypePrototype.constructor = RecordType;
	
	      return RecordType;
	    }
	
	    Record.prototype.toString = function() {
	      return this.__toString(recordName(this) + ' {', '}');
	    };
	
	    // @pragma Access
	
	    Record.prototype.has = function(k) {
	      return this._defaultValues.hasOwnProperty(k);
	    };
	
	    Record.prototype.get = function(k, notSetValue) {
	      if (!this.has(k)) {
	        return notSetValue;
	      }
	      var defaultVal = this._defaultValues[k];
	      return this._map ? this._map.get(k, defaultVal) : defaultVal;
	    };
	
	    // @pragma Modification
	
	    Record.prototype.clear = function() {
	      if (this.__ownerID) {
	        this._map && this._map.clear();
	        return this;
	      }
	      var RecordType = this.constructor;
	      return RecordType._empty || (RecordType._empty = makeRecord(this, emptyMap()));
	    };
	
	    Record.prototype.set = function(k, v) {
	      if (!this.has(k)) {
	        throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));
	      }
	      var newMap = this._map && this._map.set(k, v);
	      if (this.__ownerID || newMap === this._map) {
	        return this;
	      }
	      return makeRecord(this, newMap);
	    };
	
	    Record.prototype.remove = function(k) {
	      if (!this.has(k)) {
	        return this;
	      }
	      var newMap = this._map && this._map.remove(k);
	      if (this.__ownerID || newMap === this._map) {
	        return this;
	      }
	      return makeRecord(this, newMap);
	    };
	
	    Record.prototype.wasAltered = function() {
	      return this._map.wasAltered();
	    };
	
	    Record.prototype.__iterator = function(type, reverse) {var this$0 = this;
	      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterator(type, reverse);
	    };
	
	    Record.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterate(fn, reverse);
	    };
	
	    Record.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map && this._map.__ensureOwner(ownerID);
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        return this;
	      }
	      return makeRecord(this, newMap, ownerID);
	    };
	
	
	  var RecordPrototype = Record.prototype;
	  RecordPrototype[DELETE] = RecordPrototype.remove;
	  RecordPrototype.deleteIn =
	  RecordPrototype.removeIn = MapPrototype.removeIn;
	  RecordPrototype.merge = MapPrototype.merge;
	  RecordPrototype.mergeWith = MapPrototype.mergeWith;
	  RecordPrototype.mergeIn = MapPrototype.mergeIn;
	  RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
	  RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
	  RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
	  RecordPrototype.setIn = MapPrototype.setIn;
	  RecordPrototype.update = MapPrototype.update;
	  RecordPrototype.updateIn = MapPrototype.updateIn;
	  RecordPrototype.withMutations = MapPrototype.withMutations;
	  RecordPrototype.asMutable = MapPrototype.asMutable;
	  RecordPrototype.asImmutable = MapPrototype.asImmutable;
	
	
	  function makeRecord(likeRecord, map, ownerID) {
	    var record = Object.create(Object.getPrototypeOf(likeRecord));
	    record._map = map;
	    record.__ownerID = ownerID;
	    return record;
	  }
	
	  function recordName(record) {
	    return record._name || record.constructor.name || 'Record';
	  }
	
	  function setProps(prototype, names) {
	    try {
	      names.forEach(setProp.bind(undefined, prototype));
	    } catch (error) {
	      // Object.defineProperty failed. Probably IE8.
	    }
	  }
	
	  function setProp(prototype, name) {
	    Object.defineProperty(prototype, name, {
	      get: function() {
	        return this.get(name);
	      },
	      set: function(value) {
	        invariant(this.__ownerID, 'Cannot set on an immutable record.');
	        this.set(name, value);
	      }
	    });
	  }
	
	  function deepEqual(a, b) {
	    if (a === b) {
	      return true;
	    }
	
	    if (
	      !isIterable(b) ||
	      a.size !== undefined && b.size !== undefined && a.size !== b.size ||
	      a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash ||
	      isKeyed(a) !== isKeyed(b) ||
	      isIndexed(a) !== isIndexed(b) ||
	      isOrdered(a) !== isOrdered(b)
	    ) {
	      return false;
	    }
	
	    if (a.size === 0 && b.size === 0) {
	      return true;
	    }
	
	    var notAssociative = !isAssociative(a);
	
	    if (isOrdered(a)) {
	      var entries = a.entries();
	      return b.every(function(v, k)  {
	        var entry = entries.next().value;
	        return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
	      }) && entries.next().done;
	    }
	
	    var flipped = false;
	
	    if (a.size === undefined) {
	      if (b.size === undefined) {
	        if (typeof a.cacheResult === 'function') {
	          a.cacheResult();
	        }
	      } else {
	        flipped = true;
	        var _ = a;
	        a = b;
	        b = _;
	      }
	    }
	
	    var allEqual = true;
	    var bSize = b.__iterate(function(v, k)  {
	      if (notAssociative ? !a.has(v) :
	          flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
	        allEqual = false;
	        return false;
	      }
	    });
	
	    return allEqual && a.size === bSize;
	  }
	
	  createClass(Range, IndexedSeq);
	
	    function Range(start, end, step) {
	      if (!(this instanceof Range)) {
	        return new Range(start, end, step);
	      }
	      invariant(step !== 0, 'Cannot step a Range by 0');
	      start = start || 0;
	      if (end === undefined) {
	        end = Infinity;
	      }
	      step = step === undefined ? 1 : Math.abs(step);
	      if (end < start) {
	        step = -step;
	      }
	      this._start = start;
	      this._end = end;
	      this._step = step;
	      this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
	      if (this.size === 0) {
	        if (EMPTY_RANGE) {
	          return EMPTY_RANGE;
	        }
	        EMPTY_RANGE = this;
	      }
	    }
	
	    Range.prototype.toString = function() {
	      if (this.size === 0) {
	        return 'Range []';
	      }
	      return 'Range [ ' +
	        this._start + '...' + this._end +
	        (this._step > 1 ? ' by ' + this._step : '') +
	      ' ]';
	    };
	
	    Range.prototype.get = function(index, notSetValue) {
	      return this.has(index) ?
	        this._start + wrapIndex(this, index) * this._step :
	        notSetValue;
	    };
	
	    Range.prototype.includes = function(searchValue) {
	      var possibleIndex = (searchValue - this._start) / this._step;
	      return possibleIndex >= 0 &&
	        possibleIndex < this.size &&
	        possibleIndex === Math.floor(possibleIndex);
	    };
	
	    Range.prototype.slice = function(begin, end) {
	      if (wholeSlice(begin, end, this.size)) {
	        return this;
	      }
	      begin = resolveBegin(begin, this.size);
	      end = resolveEnd(end, this.size);
	      if (end <= begin) {
	        return new Range(0, 0);
	      }
	      return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
	    };
	
	    Range.prototype.indexOf = function(searchValue) {
	      var offsetValue = searchValue - this._start;
	      if (offsetValue % this._step === 0) {
	        var index = offsetValue / this._step;
	        if (index >= 0 && index < this.size) {
	          return index
	        }
	      }
	      return -1;
	    };
	
	    Range.prototype.lastIndexOf = function(searchValue) {
	      return this.indexOf(searchValue);
	    };
	
	    Range.prototype.__iterate = function(fn, reverse) {
	      var maxIndex = this.size - 1;
	      var step = this._step;
	      var value = reverse ? this._start + maxIndex * step : this._start;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        if (fn(value, ii, this) === false) {
	          return ii + 1;
	        }
	        value += reverse ? -step : step;
	      }
	      return ii;
	    };
	
	    Range.prototype.__iterator = function(type, reverse) {
	      var maxIndex = this.size - 1;
	      var step = this._step;
	      var value = reverse ? this._start + maxIndex * step : this._start;
	      var ii = 0;
	      return new src_Iterator__Iterator(function()  {
	        var v = value;
	        value += reverse ? -step : step;
	        return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii++, v);
	      });
	    };
	
	    Range.prototype.equals = function(other) {
	      return other instanceof Range ?
	        this._start === other._start &&
	        this._end === other._end &&
	        this._step === other._step :
	        deepEqual(this, other);
	    };
	
	
	  var EMPTY_RANGE;
	
	  createClass(Repeat, IndexedSeq);
	
	    function Repeat(value, times) {
	      if (!(this instanceof Repeat)) {
	        return new Repeat(value, times);
	      }
	      this._value = value;
	      this.size = times === undefined ? Infinity : Math.max(0, times);
	      if (this.size === 0) {
	        if (EMPTY_REPEAT) {
	          return EMPTY_REPEAT;
	        }
	        EMPTY_REPEAT = this;
	      }
	    }
	
	    Repeat.prototype.toString = function() {
	      if (this.size === 0) {
	        return 'Repeat []';
	      }
	      return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
	    };
	
	    Repeat.prototype.get = function(index, notSetValue) {
	      return this.has(index) ? this._value : notSetValue;
	    };
	
	    Repeat.prototype.includes = function(searchValue) {
	      return is(this._value, searchValue);
	    };
	
	    Repeat.prototype.slice = function(begin, end) {
	      var size = this.size;
	      return wholeSlice(begin, end, size) ? this :
	        new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
	    };
	
	    Repeat.prototype.reverse = function() {
	      return this;
	    };
	
	    Repeat.prototype.indexOf = function(searchValue) {
	      if (is(this._value, searchValue)) {
	        return 0;
	      }
	      return -1;
	    };
	
	    Repeat.prototype.lastIndexOf = function(searchValue) {
	      if (is(this._value, searchValue)) {
	        return this.size;
	      }
	      return -1;
	    };
	
	    Repeat.prototype.__iterate = function(fn, reverse) {
	      for (var ii = 0; ii < this.size; ii++) {
	        if (fn(this._value, ii, this) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    };
	
	    Repeat.prototype.__iterator = function(type, reverse) {var this$0 = this;
	      var ii = 0;
	      return new src_Iterator__Iterator(function() 
	        {return ii < this$0.size ? iteratorValue(type, ii++, this$0._value) : iteratorDone()}
	      );
	    };
	
	    Repeat.prototype.equals = function(other) {
	      return other instanceof Repeat ?
	        is(this._value, other._value) :
	        deepEqual(other);
	    };
	
	
	  var EMPTY_REPEAT;
	
	  /**
	   * Contributes additional methods to a constructor
	   */
	  function mixin(ctor, methods) {
	    var keyCopier = function(key ) { ctor.prototype[key] = methods[key]; };
	    Object.keys(methods).forEach(keyCopier);
	    Object.getOwnPropertySymbols &&
	      Object.getOwnPropertySymbols(methods).forEach(keyCopier);
	    return ctor;
	  }
	
	  Iterable.Iterator = src_Iterator__Iterator;
	
	  mixin(Iterable, {
	
	    // ### Conversion to other types
	
	    toArray: function() {
	      assertNotInfinite(this.size);
	      var array = new Array(this.size || 0);
	      this.valueSeq().__iterate(function(v, i)  { array[i] = v; });
	      return array;
	    },
	
	    toIndexedSeq: function() {
	      return new ToIndexedSequence(this);
	    },
	
	    toJS: function() {
	      return this.toSeq().map(
	        function(value ) {return value && typeof value.toJS === 'function' ? value.toJS() : value}
	      ).__toJS();
	    },
	
	    toJSON: function() {
	      return this.toSeq().map(
	        function(value ) {return value && typeof value.toJSON === 'function' ? value.toJSON() : value}
	      ).__toJS();
	    },
	
	    toKeyedSeq: function() {
	      return new ToKeyedSequence(this, true);
	    },
	
	    toMap: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return src_Map__Map(this.toKeyedSeq());
	    },
	
	    toObject: function() {
	      assertNotInfinite(this.size);
	      var object = {};
	      this.__iterate(function(v, k)  { object[k] = v; });
	      return object;
	    },
	
	    toOrderedMap: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return OrderedMap(this.toKeyedSeq());
	    },
	
	    toOrderedSet: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
	    },
	
	    toSet: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return src_Set__Set(isKeyed(this) ? this.valueSeq() : this);
	    },
	
	    toSetSeq: function() {
	      return new ToSetSequence(this);
	    },
	
	    toSeq: function() {
	      return isIndexed(this) ? this.toIndexedSeq() :
	        isKeyed(this) ? this.toKeyedSeq() :
	        this.toSetSeq();
	    },
	
	    toStack: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return Stack(isKeyed(this) ? this.valueSeq() : this);
	    },
	
	    toList: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return List(isKeyed(this) ? this.valueSeq() : this);
	    },
	
	
	    // ### Common JavaScript methods and properties
	
	    toString: function() {
	      return '[Iterable]';
	    },
	
	    __toString: function(head, tail) {
	      if (this.size === 0) {
	        return head + tail;
	      }
	      return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
	    },
	
	
	    // ### ES6 Collection methods (ES6 Array and Map)
	
	    concat: function() {var values = SLICE$0.call(arguments, 0);
	      return reify(this, concatFactory(this, values));
	    },
	
	    contains: function(searchValue) {
	      return this.includes(searchValue);
	    },
	
	    includes: function(searchValue) {
	      return this.some(function(value ) {return is(value, searchValue)});
	    },
	
	    entries: function() {
	      return this.__iterator(ITERATE_ENTRIES);
	    },
	
	    every: function(predicate, context) {
	      assertNotInfinite(this.size);
	      var returnValue = true;
	      this.__iterate(function(v, k, c)  {
	        if (!predicate.call(context, v, k, c)) {
	          returnValue = false;
	          return false;
	        }
	      });
	      return returnValue;
	    },
	
	    filter: function(predicate, context) {
	      return reify(this, filterFactory(this, predicate, context, true));
	    },
	
	    find: function(predicate, context, notSetValue) {
	      var entry = this.findEntry(predicate, context);
	      return entry ? entry[1] : notSetValue;
	    },
	
	    findEntry: function(predicate, context) {
	      var found;
	      this.__iterate(function(v, k, c)  {
	        if (predicate.call(context, v, k, c)) {
	          found = [k, v];
	          return false;
	        }
	      });
	      return found;
	    },
	
	    findLastEntry: function(predicate, context) {
	      return this.toSeq().reverse().findEntry(predicate, context);
	    },
	
	    forEach: function(sideEffect, context) {
	      assertNotInfinite(this.size);
	      return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
	    },
	
	    join: function(separator) {
	      assertNotInfinite(this.size);
	      separator = separator !== undefined ? '' + separator : ',';
	      var joined = '';
	      var isFirst = true;
	      this.__iterate(function(v ) {
	        isFirst ? (isFirst = false) : (joined += separator);
	        joined += v !== null && v !== undefined ? v.toString() : '';
	      });
	      return joined;
	    },
	
	    keys: function() {
	      return this.__iterator(ITERATE_KEYS);
	    },
	
	    map: function(mapper, context) {
	      return reify(this, mapFactory(this, mapper, context));
	    },
	
	    reduce: function(reducer, initialReduction, context) {
	      assertNotInfinite(this.size);
	      var reduction;
	      var useFirst;
	      if (arguments.length < 2) {
	        useFirst = true;
	      } else {
	        reduction = initialReduction;
	      }
	      this.__iterate(function(v, k, c)  {
	        if (useFirst) {
	          useFirst = false;
	          reduction = v;
	        } else {
	          reduction = reducer.call(context, reduction, v, k, c);
	        }
	      });
	      return reduction;
	    },
	
	    reduceRight: function(reducer, initialReduction, context) {
	      var reversed = this.toKeyedSeq().reverse();
	      return reversed.reduce.apply(reversed, arguments);
	    },
	
	    reverse: function() {
	      return reify(this, reverseFactory(this, true));
	    },
	
	    slice: function(begin, end) {
	      return reify(this, sliceFactory(this, begin, end, true));
	    },
	
	    some: function(predicate, context) {
	      return !this.every(not(predicate), context);
	    },
	
	    sort: function(comparator) {
	      return reify(this, sortFactory(this, comparator));
	    },
	
	    values: function() {
	      return this.__iterator(ITERATE_VALUES);
	    },
	
	
	    // ### More sequential methods
	
	    butLast: function() {
	      return this.slice(0, -1);
	    },
	
	    isEmpty: function() {
	      return this.size !== undefined ? this.size === 0 : !this.some(function()  {return true});
	    },
	
	    count: function(predicate, context) {
	      return ensureSize(
	        predicate ? this.toSeq().filter(predicate, context) : this
	      );
	    },
	
	    countBy: function(grouper, context) {
	      return countByFactory(this, grouper, context);
	    },
	
	    equals: function(other) {
	      return deepEqual(this, other);
	    },
	
	    entrySeq: function() {
	      var iterable = this;
	      if (iterable._cache) {
	        // We cache as an entries array, so we can just return the cache!
	        return new ArraySeq(iterable._cache);
	      }
	      var entriesSequence = iterable.toSeq().map(entryMapper).toIndexedSeq();
	      entriesSequence.fromEntrySeq = function()  {return iterable.toSeq()};
	      return entriesSequence;
	    },
	
	    filterNot: function(predicate, context) {
	      return this.filter(not(predicate), context);
	    },
	
	    findLast: function(predicate, context, notSetValue) {
	      return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
	    },
	
	    first: function() {
	      return this.find(returnTrue);
	    },
	
	    flatMap: function(mapper, context) {
	      return reify(this, flatMapFactory(this, mapper, context));
	    },
	
	    flatten: function(depth) {
	      return reify(this, flattenFactory(this, depth, true));
	    },
	
	    fromEntrySeq: function() {
	      return new FromEntriesSequence(this);
	    },
	
	    get: function(searchKey, notSetValue) {
	      return this.find(function(_, key)  {return is(key, searchKey)}, undefined, notSetValue);
	    },
	
	    getIn: function(searchKeyPath, notSetValue) {
	      var nested = this;
	      // Note: in an ES6 environment, we would prefer:
	      // for (var key of searchKeyPath) {
	      var iter = forceIterator(searchKeyPath);
	      var step;
	      while (!(step = iter.next()).done) {
	        var key = step.value;
	        nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
	        if (nested === NOT_SET) {
	          return notSetValue;
	        }
	      }
	      return nested;
	    },
	
	    groupBy: function(grouper, context) {
	      return groupByFactory(this, grouper, context);
	    },
	
	    has: function(searchKey) {
	      return this.get(searchKey, NOT_SET) !== NOT_SET;
	    },
	
	    hasIn: function(searchKeyPath) {
	      return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;
	    },
	
	    isSubset: function(iter) {
	      iter = typeof iter.includes === 'function' ? iter : Iterable(iter);
	      return this.every(function(value ) {return iter.includes(value)});
	    },
	
	    isSuperset: function(iter) {
	      iter = typeof iter.isSubset === 'function' ? iter : Iterable(iter);
	      return iter.isSubset(this);
	    },
	
	    keySeq: function() {
	      return this.toSeq().map(keyMapper).toIndexedSeq();
	    },
	
	    last: function() {
	      return this.toSeq().reverse().first();
	    },
	
	    max: function(comparator) {
	      return maxFactory(this, comparator);
	    },
	
	    maxBy: function(mapper, comparator) {
	      return maxFactory(this, comparator, mapper);
	    },
	
	    min: function(comparator) {
	      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
	    },
	
	    minBy: function(mapper, comparator) {
	      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
	    },
	
	    rest: function() {
	      return this.slice(1);
	    },
	
	    skip: function(amount) {
	      return this.slice(Math.max(0, amount));
	    },
	
	    skipLast: function(amount) {
	      return reify(this, this.toSeq().reverse().skip(amount).reverse());
	    },
	
	    skipWhile: function(predicate, context) {
	      return reify(this, skipWhileFactory(this, predicate, context, true));
	    },
	
	    skipUntil: function(predicate, context) {
	      return this.skipWhile(not(predicate), context);
	    },
	
	    sortBy: function(mapper, comparator) {
	      return reify(this, sortFactory(this, comparator, mapper));
	    },
	
	    take: function(amount) {
	      return this.slice(0, Math.max(0, amount));
	    },
	
	    takeLast: function(amount) {
	      return reify(this, this.toSeq().reverse().take(amount).reverse());
	    },
	
	    takeWhile: function(predicate, context) {
	      return reify(this, takeWhileFactory(this, predicate, context));
	    },
	
	    takeUntil: function(predicate, context) {
	      return this.takeWhile(not(predicate), context);
	    },
	
	    valueSeq: function() {
	      return this.toIndexedSeq();
	    },
	
	
	    // ### Hashable Object
	
	    hashCode: function() {
	      return this.__hash || (this.__hash = hashIterable(this));
	    },
	
	
	    // ### Internal
	
	    // abstract __iterate(fn, reverse)
	
	    // abstract __iterator(type, reverse)
	  });
	
	  // var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
	  // var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
	  // var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
	  // var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
	
	  var IterablePrototype = Iterable.prototype;
	  IterablePrototype[IS_ITERABLE_SENTINEL] = true;
	  IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;
	  IterablePrototype.__toJS = IterablePrototype.toArray;
	  IterablePrototype.__toStringMapper = quoteString;
	  IterablePrototype.inspect =
	  IterablePrototype.toSource = function() { return this.toString(); };
	  IterablePrototype.chain = IterablePrototype.flatMap;
	
	  // Temporary warning about using length
	  (function () {
	    try {
	      Object.defineProperty(IterablePrototype, 'length', {
	        get: function () {
	          if (!Iterable.noLengthWarning) {
	            var stack;
	            try {
	              throw new Error();
	            } catch (error) {
	              stack = error.stack;
	            }
	            if (stack.indexOf('_wrapObject') === -1) {
	              console && console.warn && console.warn(
	                'iterable.length has been deprecated, '+
	                'use iterable.size or iterable.count(). '+
	                'This warning will become a silent error in a future version. ' +
	                stack
	              );
	              return this.size;
	            }
	          }
	        }
	      });
	    } catch (e) {}
	  })();
	
	
	
	  mixin(KeyedIterable, {
	
	    // ### More sequential methods
	
	    flip: function() {
	      return reify(this, flipFactory(this));
	    },
	
	    findKey: function(predicate, context) {
	      var entry = this.findEntry(predicate, context);
	      return entry && entry[0];
	    },
	
	    findLastKey: function(predicate, context) {
	      return this.toSeq().reverse().findKey(predicate, context);
	    },
	
	    keyOf: function(searchValue) {
	      return this.findKey(function(value ) {return is(value, searchValue)});
	    },
	
	    lastKeyOf: function(searchValue) {
	      return this.findLastKey(function(value ) {return is(value, searchValue)});
	    },
	
	    mapEntries: function(mapper, context) {var this$0 = this;
	      var iterations = 0;
	      return reify(this,
	        this.toSeq().map(
	          function(v, k)  {return mapper.call(context, [k, v], iterations++, this$0)}
	        ).fromEntrySeq()
	      );
	    },
	
	    mapKeys: function(mapper, context) {var this$0 = this;
	      return reify(this,
	        this.toSeq().flip().map(
	          function(k, v)  {return mapper.call(context, k, v, this$0)}
	        ).flip()
	      );
	    },
	
	  });
	
	  var KeyedIterablePrototype = KeyedIterable.prototype;
	  KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;
	  KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;
	  KeyedIterablePrototype.__toJS = IterablePrototype.toObject;
	  KeyedIterablePrototype.__toStringMapper = function(v, k)  {return JSON.stringify(k) + ': ' + quoteString(v)};
	
	
	
	  mixin(IndexedIterable, {
	
	    // ### Conversion to other types
	
	    toKeyedSeq: function() {
	      return new ToKeyedSequence(this, false);
	    },
	
	
	    // ### ES6 Collection methods (ES6 Array and Map)
	
	    filter: function(predicate, context) {
	      return reify(this, filterFactory(this, predicate, context, false));
	    },
	
	    findIndex: function(predicate, context) {
	      var entry = this.findEntry(predicate, context);
	      return entry ? entry[0] : -1;
	    },
	
	    indexOf: function(searchValue) {
	      var key = this.toKeyedSeq().keyOf(searchValue);
	      return key === undefined ? -1 : key;
	    },
	
	    lastIndexOf: function(searchValue) {
	      return this.toSeq().reverse().indexOf(searchValue);
	    },
	
	    reverse: function() {
	      return reify(this, reverseFactory(this, false));
	    },
	
	    slice: function(begin, end) {
	      return reify(this, sliceFactory(this, begin, end, false));
	    },
	
	    splice: function(index, removeNum /*, ...values*/) {
	      var numArgs = arguments.length;
	      removeNum = Math.max(removeNum | 0, 0);
	      if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
	        return this;
	      }
	      index = resolveBegin(index, this.size);
	      var spliced = this.slice(0, index);
	      return reify(
	        this,
	        numArgs === 1 ?
	          spliced :
	          spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
	      );
	    },
	
	
	    // ### More collection methods
	
	    findLastIndex: function(predicate, context) {
	      var key = this.toKeyedSeq().findLastKey(predicate, context);
	      return key === undefined ? -1 : key;
	    },
	
	    first: function() {
	      return this.get(0);
	    },
	
	    flatten: function(depth) {
	      return reify(this, flattenFactory(this, depth, false));
	    },
	
	    get: function(index, notSetValue) {
	      index = wrapIndex(this, index);
	      return (index < 0 || (this.size === Infinity ||
	          (this.size !== undefined && index > this.size))) ?
	        notSetValue :
	        this.find(function(_, key)  {return key === index}, undefined, notSetValue);
	    },
	
	    has: function(index) {
	      index = wrapIndex(this, index);
	      return index >= 0 && (this.size !== undefined ?
	        this.size === Infinity || index < this.size :
	        this.indexOf(index) !== -1
	      );
	    },
	
	    interpose: function(separator) {
	      return reify(this, interposeFactory(this, separator));
	    },
	
	    interleave: function(/*...iterables*/) {
	      var iterables = [this].concat(arrCopy(arguments));
	      var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);
	      var interleaved = zipped.flatten(true);
	      if (zipped.size) {
	        interleaved.size = zipped.size * iterables.length;
	      }
	      return reify(this, interleaved);
	    },
	
	    last: function() {
	      return this.get(-1);
	    },
	
	    skipWhile: function(predicate, context) {
	      return reify(this, skipWhileFactory(this, predicate, context, false));
	    },
	
	    zip: function(/*, ...iterables */) {
	      var iterables = [this].concat(arrCopy(arguments));
	      return reify(this, zipWithFactory(this, defaultZipper, iterables));
	    },
	
	    zipWith: function(zipper/*, ...iterables */) {
	      var iterables = arrCopy(arguments);
	      iterables[0] = this;
	      return reify(this, zipWithFactory(this, zipper, iterables));
	    },
	
	  });
	
	  IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;
	  IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;
	
	
	
	  mixin(SetIterable, {
	
	    // ### ES6 Collection methods (ES6 Array and Map)
	
	    get: function(value, notSetValue) {
	      return this.has(value) ? value : notSetValue;
	    },
	
	    includes: function(value) {
	      return this.has(value);
	    },
	
	
	    // ### More sequential methods
	
	    keySeq: function() {
	      return this.valueSeq();
	    },
	
	  });
	
	  SetIterable.prototype.has = IterablePrototype.includes;
	
	
	  // Mixin subclasses
	
	  mixin(KeyedSeq, KeyedIterable.prototype);
	  mixin(IndexedSeq, IndexedIterable.prototype);
	  mixin(SetSeq, SetIterable.prototype);
	
	  mixin(KeyedCollection, KeyedIterable.prototype);
	  mixin(IndexedCollection, IndexedIterable.prototype);
	  mixin(SetCollection, SetIterable.prototype);
	
	
	  // #pragma Helper functions
	
	  function keyMapper(v, k) {
	    return k;
	  }
	
	  function entryMapper(v, k) {
	    return [k, v];
	  }
	
	  function not(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    }
	  }
	
	  function neg(predicate) {
	    return function() {
	      return -predicate.apply(this, arguments);
	    }
	  }
	
	  function quoteString(value) {
	    return typeof value === 'string' ? JSON.stringify(value) : value;
	  }
	
	  function defaultZipper() {
	    return arrCopy(arguments);
	  }
	
	  function defaultNegComparator(a, b) {
	    return a < b ? 1 : a > b ? -1 : 0;
	  }
	
	  function hashIterable(iterable) {
	    if (iterable.size === Infinity) {
	      return 0;
	    }
	    var ordered = isOrdered(iterable);
	    var keyed = isKeyed(iterable);
	    var h = ordered ? 1 : 0;
	    var size = iterable.__iterate(
	      keyed ?
	        ordered ?
	          function(v, k)  { h = 31 * h + hashMerge(hash(v), hash(k)) | 0; } :
	          function(v, k)  { h = h + hashMerge(hash(v), hash(k)) | 0; } :
	        ordered ?
	          function(v ) { h = 31 * h + hash(v) | 0; } :
	          function(v ) { h = h + hash(v) | 0; }
	    );
	    return murmurHashOfSize(size, h);
	  }
	
	  function murmurHashOfSize(size, h) {
	    h = src_Math__imul(h, 0xCC9E2D51);
	    h = src_Math__imul(h << 15 | h >>> -15, 0x1B873593);
	    h = src_Math__imul(h << 13 | h >>> -13, 5);
	    h = (h + 0xE6546B64 | 0) ^ size;
	    h = src_Math__imul(h ^ h >>> 16, 0x85EBCA6B);
	    h = src_Math__imul(h ^ h >>> 13, 0xC2B2AE35);
	    h = smi(h ^ h >>> 16);
	    return h;
	  }
	
	  function hashMerge(a, b) {
	    return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0; // int
	  }
	
	  var Immutable = {
	
	    Iterable: Iterable,
	
	    Seq: Seq,
	    Collection: Collection,
	    Map: src_Map__Map,
	    OrderedMap: OrderedMap,
	    List: List,
	    Stack: Stack,
	    Set: src_Set__Set,
	    OrderedSet: OrderedSet,
	
	    Record: Record,
	    Range: Range,
	    Repeat: Repeat,
	
	    is: is,
	    fromJS: fromJS,
	
	  };
	
	  return Immutable;
	
	}));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var svg = __webpack_require__(165);
	
	var _require = __webpack_require__(53);
	
	var makeDOMDriver = _require.makeDOMDriver;
	
	var _require2 = __webpack_require__(96);
	
	var makeHTMLDriver = _require2.makeHTMLDriver;
	
	var h = __webpack_require__(55);
	
	var CycleDOM = {
	  /**
	   * A factory for the DOM driver function. Takes a `container` to define the
	   * target on the existing DOM which this driver will operate on. All custom
	   * elements which this driver can detect should be given as the second
	   * parameter. The output of this driver is a collection of Observables queried
	   * with: `domDriverOutput.select(selector).events(eventType)` returns an
	   * Observable of events of `eventType` happening on the element determined by
	   * `selector`. Just `domDriverOutput.select(selector).observable` returns
	   * an Observable of the DOM element matched by the given selector. Also,
	   * `domDriverOutput.select(':root').observable` returns an Observable of
	   * DOM element corresponding to the root (or container) of the app on the DOM.
	   *
	   * @param {(String|HTMLElement)} container the DOM selector for the element
	   * (or the element itself) to contain the rendering of the VTrees.
	   * @param {Object} customElements a collection of custom element definitions.
	   * The key of each property should be the tag name of the custom element, and
	   * the value should be a function defining the implementation of the custom
	   * element. This function follows the same contract as the top-most `main`
	   * function: input are driver responses, output are requests to drivers.
	   * @return {Function} the DOM driver function. The function expects an
	   * Observable of VTree as input, and outputs the response object for this
	   * driver, containing functions `select()` and `dispose()` that can be used
	   * for debugging and testing.
	   * @function makeDOMDriver
	   */
	  makeDOMDriver: makeDOMDriver,
	
	  /**
	   * A factory for the HTML driver function. Takes the registry object of all
	   * custom elements as the only parameter. The HTML driver function will use
	   * the custom element registry to detect custom element on the VTree and apply
	   * their implementations.
	   *
	   * @param {Object} customElements a collection of custom element definitions.
	   * The key of each property should be the tag name of the custom element, and
	   * the value should be a function defining the implementation of the custom
	   * element. This function follows the same contract as the top-most `main`
	   * function: input are driver responses, output are requests to drivers.
	   * @return {Function} the HTML driver function. The function expects an
	   * Observable of Virtual DOM elements as input, and outputs an Observable of
	   * strings as the HTML renderization of the virtual DOM elements.
	   * @function makeHTMLDriver
	   */
	  makeHTMLDriver: makeHTMLDriver,
	
	  /**
	   * A shortcut to [virtual-hyperscript](
	   * https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript).
	   * This is a helper for creating VTrees in Views.
	   * @name h
	   */
	  h: h,
	
	  /**
	   * An adapter around virtual-hyperscript `h()` to allow JSX to be used easily
	   * with Babel. Place the [Babel configuration comment](
	   * http://babeljs.io/docs/advanced/transformers/other/react/) `@jsx hJSX` at
	   * the top of the ES6 file, make sure you import `hJSX` with
	   * `import {hJSX} from '@cycle/dom'`, and then you can use JSX to create
	   * VTrees.
	   * @name hJSX
	   */
	  hJSX: function hJSX(tag, attrs) {
	    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	      children[_key - 2] = arguments[_key];
	    }
	
	    return h(tag, attrs, children);
	  },
	
	  /**
	   * A shortcut to the svg hyperscript function.
	   * @name svg
	   */
	  svg: svg
	};
	
	module.exports = CycleDOM;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (value) {
		if (value == null) throw new TypeError("Cannot use null or undefined");
		return value;
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = isWidget
	
	function isWidget(w) {
	    return w && w.type === "Widget"
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = {
		"ATTACK_TYPES": {
			"acid": {
				"damagePerRound": {
					"$rand": 6
				},
				"meta": "Acid usually has to be washed off with either water or chemicals, depending. Some acids are aggravated by water."
			},
			"explosion": {},
			"fire": {
				"damagePerRound": {
					"$rand": 6
				},
				"meta": "Fire can be extinguished by spending one full combat round rolling on the ground, provided the ground isn’t on fire, too. The person or critter’s AC will be reduced to what they are wearing while on the ground, and the must spend the usual 4 AP to get up the next round. Note that the poor person still takes damage during the turn in which they are extinguishing themselves."
			},
			"laser": {},
			"normal": {},
			"plasma": {},
			"poisonTypeA": {
				"damagePerHour": 1,
				"durationHours": 18,
				"meta": "roll Endurance for no damage"
			},
			"poisonTypeB": {
				"damagePerHour": 2,
				"durationHours": 18,
				"meta": "roll Endurance for no damage"
			},
			"poisonTypeC": {
				"durationHours": 12,
				"effect": {
					"agility": {
						"$max": [
							"value",
							2
						]
					},
					"perception": {
						"$max": [
							"value",
							2
						]
					},
					"strength": {
						"$max": [
							"value",
							2
						]
					}
				}
			},
			"poisonTypeD": {
				"damagePerHour": 4,
				"durationHours": 24,
				"meta": "roll Endurance for half damage"
			},
			"poisonTypeE": {
				"damagePerHour": 6,
				"durationHours": 24,
				"meta": "roll Endurance for half damage"
			},
			"poisonTypeF": {
				"meta": "Go into shock 1 hour after contact, slip into a coma for 1d10 days. For each day the character spends in a coma and goes untreated by a doctor or an antidote, that character must successfully roll against Endurance or die."
			},
			"poisonTypeG": {
				"meta": "Causes death 5 minutes after exposure, unless Antidote is administered."
			},
			"radiation": {
				"effect": {
					"rads": {
						"$add": [
							"value",
							"input"
						]
					}
				}
			},
			"reduceActionPoints": {
				"effect": {
					"actionPoints": {
						"$sub": [
							"value",
							"input"
						]
					}
				}
			}
		},
		"BESTIARY": {
			"bloatfly": {
				"actionPoints": 6,
				"armorClass": 5,
				"attacks": {
					"spit": {
						"actionPoints": 3,
						"damage": {
							"$rand": 6
						},
						"poisonTypeA": 1,
						"skill": 65
					}
				},
				"criticalChance": 5,
				"experienceValue": 15,
				"health": 9,
				"resistContactGas": 10,
				"resistInhaledGas": 10,
				"resistPoison": 60,
				"resistRadiation": 20,
				"sequence": 7
			},
			"brahmin": {
				"actionPoints": 6,
				"armorClass": 5,
				"attacks": {
					"horn": {
						"actionPoints": 3,
						"damage": {
							"$add": [
								{
									"$rand": 8
								},
								{
									"$rand": 8
								}
							]
						},
						"skill": 75
					}
				},
				"criticalChance": 2,
				"experienceValue": 50,
				"health": 40,
				"resistContactGas": 10,
				"resistExplosion": 10,
				"resistExplosionThreshold": 2,
				"resistNormal": 10,
				"resistNormalThreshold": 2,
				"resistPoison": 20,
				"resistRadiation": 30,
				"sequence": 6
			},
			"centaur": {
				"actionPoints": 9,
				"armorClass": 25,
				"attacks": {
					"spit": {
						"actionPoints": 3,
						"damage": {
							"$rand": 6
						},
						"radiation": 50,
						"range": 5,
						"skill": 65
					},
					"swing": {
						"actionPoints": 3,
						"damage": {
							"$rand": 20
						},
						"skill": 90
					}
				},
				"criticalChance": 8,
				"experienceValue": 750,
				"health": 60,
				"resistContactGas": 70,
				"resistExplosion": 90,
				"resistExplosionThreshold": 10,
				"resistFire": 40,
				"resistFireThreshold": 5,
				"resistInhaledGas": 40,
				"resistLaser": 10,
				"resistLaserThreshold": 1,
				"resistNormal": 95,
				"resistNormalThreshold": 10,
				"resistPlasma": 10,
				"resistPlasmaThreshold": 1,
				"resistPoison": 50,
				"resistRadiation": 80,
				"sequence": 9
			},
			"coyote": {
				"actionPoints": 6,
				"armorClass": 3,
				"attacks": {
					"bite": {
						"actionPoints": 3,
						"damage": {
							"$rand": 8
						},
						"skill": 70
					}
				},
				"criticalChance": 5,
				"experienceValue": 100,
				"health": 20,
				"resistPoison": 20,
				"resistRadiation": 10,
				"sequence": 6
			},
			"deathclaw": {
				"actionPoints": 10,
				"armorClass": 25,
				"attacks": {
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$add": [
								{
									"$rand": 8
								},
								{
									"$rand": 8
								},
								{
									"$rand": 8
								}
							]
						},
						"skill": 90
					}
				},
				"criticalChance": 9,
				"experienceValue": 800,
				"health": 70,
				"resistContactGas": 40,
				"resistExplosion": 40,
				"resistExplosionThreshold": 4,
				"resistFire": 40,
				"resistFireThreshold": 4,
				"resistNormal": 40,
				"resistNormalThreshold": 4,
				"resistPoison": 80,
				"resistRadiation": 60,
				"sequence": 10
			},
			"direWolf": {
				"actionPoints": 9,
				"armorClass": 9,
				"attacks": {
					"bite": {
						"actionPoints": 3,
						"damage": {
							"$add": [
								{
									"$rand": 6
								},
								{
									"$rand": 6
								},
								{
									"$rand": 6
								}
							]
						},
						"skill": 90
					},
					"claw": {
						"actionPoints": 4,
						"damage": {
							"$add": [
								{
									"$rand": 8
								},
								{
									"$rand": 8
								}
							]
						},
						"meta": "roll against Endurance to avoid knockdown",
						"skill": 80
					}
				},
				"criticalChance": 7,
				"experienceValue": 700,
				"health": 60,
				"resistNormal": 40,
				"resistNormalThreshold": 5,
				"resistPoison": 40,
				"resistRadiation": 20,
				"sequence": 9
			},
			"dog": {
				"actionPoints": 6,
				"armorClass": 3,
				"attacks": {
					"bite": {
						"actionPoints": 3,
						"damage": {
							"$add": [
								{
									"$rand": 6
								},
								{
									"$rand": 6
								}
							]
						},
						"meta": "roll against Agility to avoid a knockdown",
						"skill": 80
					}
				},
				"criticalChance": 4,
				"experienceValue": 100,
				"health": 20,
				"resistPoison": 18,
				"resistRadiation": 8,
				"sequence": 6
			},
			"feralDog": {
				"actionPoints": 6,
				"armorClass": 3,
				"attacks": {
					"bite": {
						"actionPoints": 3,
						"damage": {
							"$rand": 8
						},
						"skill": 70
					}
				},
				"criticalChance": 4,
				"experienceValue": 100,
				"health": 20,
				"resistPoison": 20,
				"resistRadiation": 10,
				"sequence": 6
			},
			"feralGhoul": {
				"actionPoints": 8,
				"armorClass": 3,
				"attacks": {
					"bite": {
						"actionPoints": 5,
						"damage": {
							"$rand": 8
						},
						"skill": 70
					},
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$rand": 6
						},
						"skill": 60
					}
				},
				"criticalChance": 4,
				"experienceValue": 50,
				"health": 15,
				"resistPoison": 40,
				"resistRadiation": 100,
				"sequence": 8
			},
			"feralGhoulReaver": {
				"actionPoints": 10,
				"armorClass": 8,
				"attacks": {
					"bite": {
						"actionPoints": 5,
						"damage": {
							"$rand": 10
						},
						"skill": 70
					},
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$rand": 8
						},
						"skill": 75
					}
				},
				"criticalChance": 5,
				"experienceValue": 100,
				"health": 30,
				"resistExplosion": 1,
				"resistExplosionThreshold": 10,
				"resistNormal": 1,
				"resistNormalThreshold": 10,
				"resistPoison": 40,
				"resistRadiation": 100,
				"sequence": 10
			},
			"feralGhoulRoamer": {
				"actionPoints": 8,
				"armorClass": 4,
				"attacks": {
					"bite": {
						"actionPoints": 5,
						"damage": {
							"$rand": 8
						},
						"skill": 70
					},
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$rand": 6
						},
						"skill": 70
					}
				},
				"criticalChance": 4,
				"experienceValue": 60,
				"health": 15,
				"resistPoison": 40,
				"resistRadiation": 100,
				"sequence": 10
			},
			"feralGlowingOne": {
				"actionPoints": 10,
				"armorClass": 5,
				"attacks": {
					"bite": {
						"actionPoints": 5,
						"damage": {
							"$rand": 8
						},
						"radiation": 10,
						"skill": 70
					},
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$rand": 6
						},
						"radiation": 10,
						"skill": 70
					},
					"radiationBurst": {
						"actionPoints": 10,
						"areaOfEffect": true,
						"damage": {
							"$rand": 4
						},
						"meta": "Acts as explosive for resistance purposes. Sends small objects flying.",
						"radiation": 20,
						"skill": 90
					}
				},
				"criticalChance": 5,
				"experienceValue": 150,
				"health": 20,
				"resistPoison": 40,
				"resistRadiation": 120,
				"sequence": 8
			},
			"fireAnt": {
				"actionPoints": 6,
				"armorClass": 2,
				"attacks": {
					"fireBreath": {
						"actionPoints": 4,
						"damage": {
							"$rand": 6
						},
						"fire": 1,
						"skill": 60
					},
					"mandibles": {
						"actionPoints": 3,
						"damage": {
							"$rand": 6
						},
						"poisonTypeA": 1,
						"skill": 60
					}
				},
				"criticalChance": 3,
				"experienceValue": 60,
				"health": 15,
				"resistContactGas": 90,
				"resistExplosion": 10,
				"resistExplosionThreshold": 1,
				"resistFire": 40,
				"resistFireThreshold": 5,
				"resistInhaledGas": 60,
				"resistPoison": 100,
				"resistRadiation": 60,
				"sequence": 6
			},
			"fireGecko": {
				"actionPoints": 9,
				"armorClass": 8,
				"attacks": {
					"bite": {
						"actionPoints": 4,
						"damage": {
							"$add": [
								{
									"$rand": 6
								},
								{
									"$rand": 6
								}
							]
						},
						"skill": 70
					},
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$rand": 8
						},
						"skill": 75
					},
					"fireBreath": {
						"actionPoints": 4,
						"areaOfEffect": "cone",
						"areaOfEffectSize": 5,
						"damage": {
							"$rand": 4
						},
						"fire": 1,
						"rounds": 2,
						"skill": 70
					}
				},
				"criticalChance": 4,
				"experienceValue": 300,
				"health": 40,
				"resistContactGas": 20,
				"resistExplosion": 10,
				"resistExplosionThreshold": 2,
				"resistFire": 30,
				"resistFireThreshold": 3,
				"resistNormal": 30,
				"resistNormalThreshold": 3,
				"resistPoison": 80,
				"resistRadiation": 80,
				"sequence": 9
			},
			"flailer": {
				"actionPoints": 9,
				"armorClass": 25,
				"attacks": {
					"bite": {
						"actionPoints": 3,
						"damage": {
							"$add": [
								{
									"$rand": 8
								},
								{
									"$rand": 8
								}
							]
						},
						"poisonTypeD": 1,
						"skill": 90
					},
					"flail": {
						"actionPoints": 3,
						"damage": {
							"$add": [
								{
									"$rand": 8
								},
								{
									"$rand": 8
								}
							]
						},
						"skill": 90
					}
				},
				"criticalChance": 8,
				"experienceValue": 750,
				"health": 60,
				"resistContactGas": 100,
				"resistExplosion": 90,
				"resistExplosionThreshold": 10,
				"resistFire": 40,
				"resistFireThreshold": 5,
				"resistInhaledGas": 100,
				"resistLaser": 10,
				"resistLaserThreshold": 1,
				"resistNormal": 95,
				"resistNormalThreshold": 10,
				"resistPlasma": 10,
				"resistPlasmaThreshold": 1,
				"resistPoison": 95,
				"resistRadiation": 100,
				"sequence": 9
			},
			"floater": {
				"actionPoints": 9,
				"armorClass": 20,
				"attacks": {
					"stalk": {
						"actionPoints": 3,
						"damage": {
							"$add": [
								{
									"$rand": 4
								},
								{
									"$rand": 4
								},
								{
									"$rand": 4
								}
							]
						},
						"skill": 80
					}
				},
				"criticalChance": 8,
				"experienceValue": 500,
				"health": 60,
				"resistContactGas": 90,
				"resistExplosion": 90,
				"resistExplosionThreshold": 10,
				"resistFire": 40,
				"resistFireThreshold": 5,
				"resistInhaledGas": 100,
				"resistLaser": 10,
				"resistLaserThreshold": 1,
				"resistNormal": 95,
				"resistNormalThreshold": 10,
				"resistPlasma": 10,
				"resistPlasmaThreshold": 1,
				"resistPoison": 80,
				"resistRadiation": 80,
				"sequence": 9
			},
			"gecko": {
				"actionPoints": 7,
				"armorClass": 5,
				"attacks": {
					"bite": {
						"actionPoints": 4,
						"damage": {
							"$add": [
								{
									"$rand": 6
								},
								{
									"$rand": 6
								}
							]
						},
						"skill": 70
					},
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$rand": 8
						},
						"skill": 75
					}
				},
				"criticalChance": 2,
				"experienceValue": 150,
				"health": 30,
				"resistContactGas": 10,
				"resistNormal": 10,
				"resistNormalThreshold": 1,
				"resistPoison": 80,
				"resistRadiation": 75,
				"sequence": 7
			},
			"giantAnt": {
				"actionPoints": 6,
				"armorClass": 2,
				"attacks": {
					"mandibles": {
						"actionPoints": 3,
						"damage": {
							"$rand": 6
						},
						"poisonTypeA": 1,
						"skill": 60
					}
				},
				"criticalChance": 3,
				"experienceValue": 50,
				"health": 15,
				"resistContactGas": 90,
				"resistInhaledGas": 60,
				"resistPoison": 100,
				"resistRadiation": 60,
				"sequence": 6
			},
			"giantRat": {
				"actionPoints": 6,
				"armorClass": 5,
				"attacks": {
					"bite": {
						"actionPoints": 3,
						"damage": {
							"$rand": 4
						},
						"poisonTypeA": 1,
						"skill": 70
					},
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$rand": 4
						},
						"skill": 75
					}
				},
				"criticalChance": 3,
				"experienceValue": 25,
				"health": 10,
				"resistPoison": 50,
				"resistRadiation": 20,
				"sequence": 6
			},
			"goldenGecko": {
				"actionPoints": 9,
				"armorClass": 10,
				"attacks": {
					"bite": {
						"actionPoints": 4,
						"damage": {
							"$rand": 20
						},
						"radiation": 15,
						"skill": 85
					},
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$rand": 12
						},
						"skill": 90
					}
				},
				"criticalChance": 5,
				"experienceValue": 400,
				"health": 50,
				"resistContactGas": 50,
				"resistExplosion": 10,
				"resistExplosionThreshold": 2,
				"resistFire": 50,
				"resistFireThreshold": 5,
				"resistNormal": 50,
				"resistNormalThreshold": 5,
				"resistPoison": 100,
				"resistRadiation": 100,
				"sequence": 9
			},
			"greaterMolerat": {
				"actionPoints": 9,
				"armorClass": 12,
				"attacks": {
					"bite": {
						"actionPoints": 3,
						"damage": {
							"$rand": 10
						},
						"poisonTypeB": 1,
						"skill": 75
					},
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$rand": 10
						},
						"skill": 75
					}
				},
				"criticalChance": 5,
				"experienceValue": 400,
				"health": 30,
				"resistContactGas": 25,
				"resistExplosion": 20,
				"resistLaser": 15,
				"resistNormal": 20,
				"resistPoison": 60,
				"resistRadiation": 25,
				"sequence": 9
			},
			"greaterRadscorpion": {
				"actionPoints": 8,
				"armorClass": 10,
				"attacks": {
					"tail": {
						"actionPoints": 4,
						"damage": {
							"$rand": 12
						},
						"poisonTypeD": 1,
						"skill": 80
					}
				},
				"criticalChance": 5,
				"experienceValue": 400,
				"health": 35,
				"resistContactGas": 100,
				"resistExplosion": 5,
				"resistExplosionThreshold": 1,
				"resistFire": 20,
				"resistFireThreshold": 4,
				"resistInhaledGas": 50,
				"resistNormal": 5,
				"resistNormalThreshold": 1,
				"resistPoison": 100,
				"resistRadiation": 50,
				"sequence": 8
			},
			"lesserMolerat": {
				"actionPoints": 7,
				"armorClass": 9,
				"attacks": {
					"bite": {
						"actionPoints": 3,
						"damage": {
							"$rand": 8
						},
						"poisonTypeA": 1,
						"skill": 75
					},
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$rand": 8
						},
						"skill": 80
					}
				},
				"criticalChance": 3,
				"experienceValue": 100,
				"health": 15,
				"resistExplosion": 5,
				"resistExplosionThreshold": 1,
				"resistNormal": 5,
				"resistNormalThreshold": 1,
				"resistPoison": 50,
				"resistRadiation": 25,
				"sequence": 7
			},
			"lesserPigrat": {
				"actionPoints": 9,
				"armorClass": 14,
				"attacks": {
					"bite": {
						"actionPoints": 3,
						"damage": {
							"$add": [
								{
									"$rand": 6
								},
								{
									"$rand": 6
								}
							]
						},
						"poisonTypeB": 1,
						"skill": 75
					},
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$add": [
								{
									"$rand": 6
								},
								{
									"$rand": 6
								}
							]
						},
						"skill": 90
					}
				},
				"criticalChance": 6,
				"experienceValue": 450,
				"health": 30,
				"resistContactGas": 20,
				"resistExplosion": 25,
				"resistExplosionThreshold": 4,
				"resistFire": 10,
				"resistFireThreshold": 2,
				"resistNormal": 25,
				"resistNormalThreshold": 4,
				"resistPoison": 70,
				"resistRadiation": 45,
				"sequence": 9
			},
			"lesserRadscorpion": {
				"actionPoints": 8,
				"armorClass": 7,
				"attacks": {
					"tail": {
						"actionPoints": 4,
						"damage": {
							"$rand": 10
						},
						"poisonTypeD": 1,
						"skill": 70
					}
				},
				"criticalChance": 4,
				"experienceValue": 200,
				"health": 25,
				"resistContactGas": 100,
				"resistExplosion": 5,
				"resistExplosionThreshold": 1,
				"resistFire": 20,
				"resistFireThreshold": 4,
				"resistInhaledGas": 30,
				"resistNormal": 5,
				"resistNormalThreshold": 1,
				"resistPoison": 100,
				"resistRadiation": 25,
				"sequence": 8
			},
			"mantis": {
				"actionPoints": 7,
				"armorClass": 5,
				"attacks": {
					"claw": {
						"actionPoints": 4,
						"damage": {
							"$rand": 8
						},
						"skill": 75
					},
					"mandible": {
						"actionPoints": 3,
						"damage": {
							"$rand": 6
						},
						"poisonTypeB": 1,
						"skill": 70
					}
				},
				"criticalChance": 2,
				"experienceValue": 50,
				"health": 10,
				"resistContactGas": 90,
				"resistInhaledGas": 60,
				"resistPoison": 75,
				"resistRadiation": 80,
				"sequence": 7
			},
			"mirelurk": {
				"actionPoints": 6,
				"armorClass": 10,
				"attacks": {
					"claw": {
						"actionPoints": 4,
						"damage": {
							"$rand": 10
						},
						"skill": 70
					},
					"ram": {
						"actionPoints": 3,
						"damage": {
							"$rand": 8
						},
						"skill": 80
					}
				},
				"criticalChance": 4,
				"experienceValue": 100,
				"health": 30,
				"resistContactGas": 10,
				"resistExplosion": 40,
				"resistExplosionThreshold": 5,
				"resistFire": 20,
				"resistFireThreshold": 3,
				"resistLaser": 10,
				"resistLaserThreshold": 1,
				"resistNormal": 50,
				"resistNormalThreshold": 6,
				"resistPlasma": 10,
				"resistPlasmaThreshold": 1,
				"resistPoison": 10,
				"resistRadiation": 40,
				"sequence": 6
			},
			"mirelurkHunter": {
				"actionPoints": 7,
				"armorClass": 14,
				"attacks": {
					"claw": {
						"actionPoints": 4,
						"damage": {
							"$rand": 12
						},
						"skill": 70
					},
					"ram": {
						"actionPoints": 3,
						"damage": {
							"$rand": 8
						},
						"skill": 80
					}
				},
				"criticalChance": 4,
				"experienceValue": 200,
				"health": 40,
				"resistContactGas": 20,
				"resistExplosion": 40,
				"resistExplosionThreshold": 5,
				"resistFire": 30,
				"resistFireThreshold": 4,
				"resistLaser": 10,
				"resistLaserThreshold": 1,
				"resistNormal": 70,
				"resistNormalThreshold": 8,
				"resistPlasma": 10,
				"resistPlasmaThreshold": 1,
				"resistPoison": 10,
				"resistRadiation": 40,
				"sequence": 8
			},
			"mirelurkKing": {
				"actionPoints": 8,
				"armorClass": 6,
				"attacks": {
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$rand": 8
						},
						"skill": 80
					},
					"screech": {
						"actionPoints": 5,
						"damage": {
							"$rand": 6
						},
						"range": 2,
						"reduceActionPoints": 2,
						"skill": 85
					}
				},
				"criticalChance": 5,
				"experienceValue": 200,
				"health": 30,
				"resistContactGas": 10,
				"resistExplosion": 40,
				"resistExplosionThreshold": 3,
				"resistFire": 40,
				"resistFireThreshold": 5,
				"resistLaser": 10,
				"resistLaserThreshold": 2,
				"resistNormal": 30,
				"resistNormalThreshold": 4,
				"resistPlasma": 10,
				"resistPlasmaThreshold": 2,
				"resistPoison": 10,
				"resistRadiation": 40,
				"sequence": 10
			},
			"nukaLurk": {
				"actionPoints": 6,
				"armorClass": 10,
				"attacks": {
					"claw": {
						"actionPoints": 4,
						"damage": {
							"$rand": 10
						},
						"skill": 75
					},
					"ram": {
						"actionPoints": 3,
						"damage": {
							"$rand": 8
						},
						"skill": 80
					}
				},
				"criticalChance": 5,
				"experienceValue": 100,
				"health": 40,
				"resistContactGas": 20,
				"resistExplosion": 40,
				"resistExplosionThreshold": 5,
				"resistFire": 30,
				"resistFireThreshold": 4,
				"resistLaser": 30,
				"resistLaserThreshold": 4,
				"resistNormal": 40,
				"resistNormalThreshold": 5,
				"resistPlasma": 30,
				"resistPlasmaThreshold": 4,
				"resistPoison": 20,
				"resistRadiation": 50,
				"sequence": 8
			},
			"nukaLurkQuantum": {
				"actionPoints": 8,
				"armorClass": 10,
				"attacks": {
					"claw": {
						"actionPoints": 4,
						"damage": {
							"$rand": 12
						},
						"skill": 70
					},
					"ram": {
						"actionPoints": 3,
						"damage": {
							"$rand": 8
						},
						"skill": 80
					}
				},
				"criticalChance": 5,
				"experienceValue": 200,
				"health": 40,
				"resistContactGas": 20,
				"resistExplosion": 40,
				"resistExplosionThreshold": 5,
				"resistFire": 20,
				"resistFireThreshold": 3,
				"resistLaser": 50,
				"resistLaserThreshold": 6,
				"resistNormal": 50,
				"resistNormalThreshold": 6,
				"resistPlasma": 40,
				"resistPlasmaThreshold": 5,
				"resistPoison": 20,
				"resistRadiation": 60,
				"sequence": 8
			},
			"radRat": {
				"actionPoints": 6,
				"armorClass": 5,
				"attacks": {
					"bite": {
						"actionPoints": 3,
						"damage": {
							"$rand": 4
						},
						"radiation": 10,
						"skill": 70
					},
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$rand": 4
						},
						"radiation": 10,
						"skill": 75
					}
				},
				"criticalChance": 3,
				"experienceValue": 35,
				"health": 10,
				"resistContactGas": 50,
				"resistPoison": 60,
				"resistRadiation": 100,
				"sequence": 6
			},
			"radroach": {
				"actionPoints": 6,
				"armorClass": 5,
				"attacks": {
					"mandible": {
						"actionPoints": 3,
						"damage": {
							"$rand": 4
						},
						"poisonTypeB": 1,
						"skill": 60
					}
				},
				"criticalChance": 4,
				"experienceValue": 50,
				"health": 15,
				"resistContactGas": 100,
				"resistInhaledGas": 80,
				"resistNormal": 30,
				"resistNormalThreshold": 3,
				"resistPoison": 100,
				"resistRadiation": 95,
				"sequence": 6
			},
			"wolf": {
				"actionPoints": 6,
				"armorClass": 5,
				"attacks": {
					"bite": {
						"actionPoints": 3,
						"damage": {
							"$add": [
								{
									"$rand": 6
								},
								{
									"$rand": 6
								}
							]
						},
						"skill": 80
					},
					"claw": {
						"actionPoints": 4,
						"damage": {
							"$rand": 8
						},
						"skill": 70
					}
				},
				"criticalChance": 5,
				"experienceValue": 100,
				"health": 20,
				"resistPoison": 25,
				"resistRadiation": 15,
				"sequence": 6
			},
			"yaoGuai": {
				"actionPoints": 10,
				"armorClass": 25,
				"attacks": {
					"claw": {
						"actionPoints": 3,
						"damage": {
							"$add": [
								{
									"$rand": 8
								},
								{
									"$rand": 8
								},
								{
									"$rand": 8
								}
							]
						},
						"skill": 90
					}
				},
				"criticalChance": 9,
				"experienceValue": 850,
				"health": 100,
				"resistContactGas": 40,
				"resistExplosion": 40,
				"resistExplosionThreshold": 4,
				"resistFire": 30,
				"resistFireThreshold": 3,
				"resistNormal": 20,
				"resistNormalThreshold": 2,
				"resistPoison": 80,
				"resistRadiation": 60,
				"sequence": 10
			}
		},
		"BODY_PARTS": {
			"arm": {
				"count": 2,
				"crippleEffect": {
					"bigGuns": {
						"$sub": [
							"value",
							15
						]
					},
					"climb": {
						"$sub": [
							"value",
							15
						]
					},
					"doctor": {
						"$sub": [
							"value",
							15
						]
					},
					"firstAid": {
						"$sub": [
							"value",
							15
						]
					},
					"swim": {
						"$sub": [
							"value",
							15
						]
					}
				},
				"crippleHealth": {
					"$add": [
						"endurance",
						{
							"$floor": {
								"$div": [
									"health",
									10
								]
							}
						}
					]
				},
				"cripplePartCount": 2,
				"meta": "-45% penalty to all skills if both arms are crippled",
				"parts": {
					"elbow": {
						"crippleEffect": {
							"climb": {
								"$sub": [
									"value",
									8
								]
							},
							"strength": {
								"$dec": "value"
							},
							"swim": {
								"$sub": [
									"value",
									8
								]
							}
						},
						"crippleHealth": {
							"$add": [
								{
									"$ceil": {
										"$half": "endurance"
									}
								},
								{
									"$floor": {
										"$div": [
											"health",
											20
										]
									}
								}
							]
						},
						"targetPenalty": 17
					},
					"hand": {
						"crippleEffect": {
							"medicine": {
								"$sub": [
									10,
									"value"
								]
							},
							"technical": {
								"$sub": [
									10,
									"value"
								]
							}
						},
						"crippleHealth": {
							"$add": [
								{
									"$ceil": {
										"$half": "endurance"
									}
								},
								{
									"$floor": {
										"$div": [
											"health",
											40
										]
									}
								}
							]
						},
						"meta": "-15% penalty to all skills involving that hand",
						"targetPenalty": 25
					},
					"shoulder": {
						"crippleHealth": {
							"$add": [
								"endurance",
								{
									"$floor": {
										"$div": [
											"health",
											20
										]
									}
								}
							]
						},
						"meta": "-10% penalty to all attacks with that arm",
						"targetPenalty": 15
					}
				},
				"targetPenalty": 15
			},
			"head": {
				"crippleEffect": {
					"barter": {
						"$sub": [
							"value",
							15
						]
					},
					"gambling": {
						"$sub": [
							"value",
							15
						]
					},
					"intelligence": {
						"$dec": "value"
					},
					"perception": {
						"$dec": "value"
					},
					"speech": {
						"$sub": [
							"value",
							15
						]
					}
				},
				"crippleHealth": {
					"$add": [
						"endurance",
						{
							"$floor": {
								"$div": [
									"health",
									20
								]
							}
						}
					]
				},
				"cripplePartCount": 1,
				"damage": {
					"$add": [
						"value",
						2
					]
				},
				"parts": {
					"eyes": {
						"crippleEffect": {
							"doctor": {
								"$sub": [
									"value",
									25
								]
							},
							"energyWeapons": {
								"$sub": [
									"value",
									25
								]
							},
							"explosives": {
								"$sub": [
									"value",
									25
								]
							},
							"lockpick": {
								"$sub": [
									"value",
									25
								]
							},
							"perception": {
								"$dec": "value"
							},
							"pilot": {
								"$sub": [
									"value",
									25
								]
							},
							"repair": {
								"$sub": [
									"value",
									25
								]
							},
							"science": {
								"$sub": [
									"value",
									25
								]
							},
							"smallGuns": {
								"$sub": [
									"value",
									25
								]
							},
							"throwing": {
								"$sub": [
									"value",
									25
								]
							}
						},
						"crippleHealth": {
							"$add": [
								{
									"$ceil": {
										"$div": [
											"endurance",
											1.5
										]
									}
								},
								{
									"$floor": {
										"$div": [
											"health",
											40
										]
									}
								}
							]
						},
						"meta": "effect is permanent without cybernetic replacement or critical success during surgery",
						"targetPenalty": 20
					},
					"forehead": {
						"crippleEffect": {
							"intelligence": {
								"$sub": [
									"value",
									3
								]
							}
						},
						"crippleHealth": {
							"$add": [
								"endurance",
								{
									"$floor": {
										"$div": [
											"health",
											40
										]
									}
								}
							]
						},
						"meta": "a luck check must be rolled to see if they survive with permanent damage or simply die. Crits are always fatal.",
						"targetPenalty": 30
					},
					"neck": {
						"crippleEffect": {
							"damagePerTurn": {
								"$inc": "value"
							}
						},
						"crippleHealth": {
							"$add": [
								{
									"$ceil": {
										"$div": [
											"endurance",
											1.5
										]
									}
								},
								{
									"$floor": {
										"$div": [
											"health",
											40
										]
									}
								}
							]
						},
						"meta": "When the neck is crippled, a luck check is made by the player. A successful luck check means they have a damaged artery, and will lose 1 HP each turn until it is treated with Medicine or the player dies. A failed luck check means the spinal cord has been severed, and the subject is paralyzed. Critical hits that cripple the neck ALWAYS sever the spinal cord.",
						"targetPenalty": 20
					}
				},
				"targetPenalty": 25
			},
			"leg": {
				"count": 2,
				"crippleHealth": {
					"$add": [
						"endurance",
						{
							"$floor": {
								"$div": [
									"health",
									10
								]
							}
						}
					]
				},
				"cripplePartCount": 2,
				"meta": "Each leg is necessary to move properly, so having one crippled will make running and sprinting impossible. If both legs become crippled, the player will no longer be able to walk, and moving one hex will be treated as a ‘Run’ action (As they are crawling across the ground).",
				"parts": {
					"calf": {
						"crippleEffect": {
							"agility": {
								"$dec": "value"
							},
							"sneak": {
								"$sub": [
									"value",
									15
								]
							}
						},
						"crippleHealth": {
							"$add": [
								{
									"$ceil": {
										"$half": "endurance"
									}
								},
								{
									"$floor": {
										"$div": [
											"health",
											20
										]
									}
								}
							]
						},
						"targetPenalty": 20
					},
					"hip": {
						"crippleHealth": {
							"$add": [
								"endurance",
								{
									"$floor": {
										"$div": [
											"health",
											20
										]
									}
								}
							]
						},
						"meta": "When a hip is crippled, whenever the player turns in that direction all their skills take a -5% penalty for the turn",
						"targetPenalty": 15
					},
					"knee": {
						"crippleEffect": {
							"climb": {
								"$sub": [
									"value",
									15
								]
							},
							"swim": {
								"$sub": [
									"value",
									15
								]
							}
						},
						"crippleHealth": {
							"$add": [
								"endurance",
								{
									"$floor": {
										"$div": [
											"health",
											20
										]
									}
								}
							]
						},
						"meta": "Crippling a knee makes running impossible",
						"targetPenalty": 17
					}
				},
				"targetPenalty": 10
			},
			"torso": {
				"crippleEffect": {
					"carryWeight": {
						"$half": "value"
					},
					"skills": {
						"$sub": [
							"value",
							5
						]
					}
				},
				"crippleHealth": {
					"$add": [
						{
							"$double": "endurance"
						},
						{
							"$floor": {
								"$div": [
									"health",
									10
								]
							}
						}
					]
				},
				"cripplePartCount": 2,
				"damage": {
					"$sub": [
						"value",
						2
					]
				},
				"parts": {
					"chest": {
						"crippleEffect": {
							"damagePerTurn": {
								"$inc": "value"
							}
						},
						"crippleHealth": {
							"$add": [
								"endurance",
								{
									"$floor": {
										"$div": [
											"health",
											10
										]
									}
								}
							]
						},
						"targetPenalty": 25
					},
					"groin": {
						"crippleHealth": {
							"$add": [
								"endurance",
								{
									"$floor": {
										"$div": [
											"health",
											20
										]
									}
								}
							]
						},
						"damage": {
							"$add": [
								"value",
								2
							]
						},
						"meta": "player is rendered unable to jog, walk, or sprint",
						"targetPenalty": 35
					},
					"gut": {
						"crippleEffect": {
							"damagePerDay": {
								"$add": [
									"value",
									4
								]
							},
							"resistPoison": {
								"$sub": [
									"value",
									10
								]
							},
							"resistRadiation": {
								"$sub": [
									"value",
									10
								]
							}
						},
						"crippleHealth": {
							"$add": [
								"endurance",
								{
									"$floor": {
										"$div": [
											"health",
											10
										]
									}
								}
							]
						},
						"meta": "if the player goes for one week without treatment, they die",
						"targetPenalty": 20
					}
				},
				"targetPenalty": 0
			}
		},
		"LOCALIZATION": {
			"en-US": {
				"name": "Name",
				"age": "Age",
				"hair": "Hair",
				"eyes": "Eyes",
				"appearance": "Appearance",
				"sex": "Sex",
				"weight": "Weight",
				"height": "Height",
				"travel": "Travel",
				"experience": {
					"abbr": "XP",
					"name": "Experience"
				},
				"race": "Race",
				"actionChild": "Action Boy (or Girl)",
				"actionPointRegeneration": {
					"abbr": "APR",
					"name": "Action Point Regeneration"
				},
				"actionPoints": {
					"abbr": "AP",
					"name": "Action Points"
				},
				"adrenalineRush": "Adrenaline Rush",
				"agility": {
					"abbr": "Agi",
					"name": "Agility"
				},
				"alphaMutant": "Mutant (Alpha)",
				"animalFriend": "Animal Friend",
				"arm": "Arm",
				"armorClass": {
					"abbr": "AC",
					"name": "Armor Class"
				},
				"awareness": "Awareness",
				"barter": "Barter",
				"bendTheRules": "Bend The Rules",
				"betaMutant": "Mutant (Beta)",
				"betterCriticals": "Better Criticals",
				"bigGuns": {
					"abbr": "BG",
					"name": "Big Guns"
				},
				"bite": "Bite",
				"bloatfly": "Bloatfly",
				"bloodyMess": "Bloody Mess",
				"bluffMaster": "Bluff Master",
				"boneHead": "Bone-Head",
				"bonsai": "Bonsai",
				"bonusHandToHandAttacks": "Bonus Hand-to-Hand Attacks",
				"bonusHandToHandDamage": "Bonus Hand-to-Hand Damage",
				"bonusMove": "Bonus Move",
				"bonusRangedDamage": "Bonus Ranged Damage",
				"bonusRateOfFire": "Bonus Rate of Fire",
				"bracing": "Bracing",
				"brahmin": "Brahmin",
				"breakTheRules": "Break the Rules",
				"brownNoser": "Brown-Noser",
				"bruiser": "Bruiser",
				"brutishHulk": "Brutish Hulk",
				"calf": "Calf",
				"cancerousGrowth": "Cancerous Growth",
				"carryWeight": {
					"abbr": "CW",
					"name": "Carry Weight"
				},
				"cautiousNature": "Cautious Nature",
				"centaur": "Centaur",
				"charisma": {
					"abbr": "Cha",
					"name": "Charisma"
				},
				"chemReliant": "Chem Reliant",
				"chemResistant": "Chem Resistant",
				"chems": "Chems",
				"chest": "Chest",
				"claw": "Claw",
				"climb": "Climb",
				"comprehension": "Comprehension",
				"coyote": "Coyote",
				"crazyBomber": "Crazy Bomber",
				"criticalChance": {
					"abbr": "CC",
					"name": "Critical Chance"
				},
				"criticalFailure": {
					"abbr": "CF",
					"name": "Critical Failure"
				},
				"cultOfPersonality": "Cult of Personality",
				"damageThreshold": {
					"abbr": "DT",
					"name": "Damage Threshold"
				},
				"deathSense": "Death Sense",
				"deathclaw": "Deathclaw",
				"demolitionExpert": "Demolition Expert",
				"detectionClass": {
					"abbr": "DC",
					"name": "Detection Class"
				},
				"dieHard": "Die Hard",
				"direWolf": "Dire Wolf",
				"disguise": "Disguise",
				"divineFavor": "Divine Favor",
				"doctor": "Doctor",
				"dodger": "Dodger",
				"dog": "Dog",
				"dolphin": "Dolphin",
				"drivingCityStyle": "Driving City Style",
				"drunkenMaster": "Drunken Master",
				"earlierSequence": "Earlier Sequence",
				"educated": "Educated",
				"elbow": "Elbow",
				"empathy": "Empathy",
				"endurance": {
					"abbr": "End",
					"name": "Endurance"
				},
				"energyWeapons": "Energy Weapons",
				"explorer": "Explorer",
				"explosives": "Explosives",
				"fastMetabolism": "Fast Metabolism",
				"fastShot": "Fast Shot",
				"fasterHealing": "Faster Healing",
				"fearTheReaper": "Fear The Reaper",
				"feralDog": "Feral Dog",
				"feralGhoul": "Feral Ghoul",
				"feralGhoulReaver": "Feral Ghoul Reaver",
				"feralGhoulRoamer": "Feral Ghoul Roamer",
				"feralGlowingOne": "Feral Glowing One",
				"finesse": "Finesse",
				"fireAnt": "Fire Ant",
				"fireBreath": "Fire Breath",
				"fireGecko": "Fire Gecko",
				"firstAid": "First Aid",
				"flail": "Flail",
				"flailer": "Flailer",
				"flexible": "Flexible",
				"floater": "Floater",
				"flowerChild": "Flower Child",
				"forehead": "Forehead",
				"fortuneFinder": "Fortune Finder",
				"gainAgility": "Gain Agility",
				"gainCharisma": "Gain Charisma",
				"gainEndurance": "Gain Endurance",
				"gainIntelligence": "Gain Intelligence",
				"gainLuck": "Gain Luck",
				"gainPerception": "Gain Perception",
				"gainStrength": "Gain Strength",
				"gambler": "Gambler",
				"gambling": "Gambling",
				"gecko": "Gecko",
				"ghost": "Ghost",
				"ghoul": "Ghoul",
				"giantAnt": "Giant Ant",
				"giantRat": "Giant Rat",
				"gifted": "Gifted",
				"glowingOne": "Glowing One",
				"goldenGecko": "Golden Gecko",
				"goodNatured": "Good Natured",
				"greaterMolerat": "Greater Molerat",
				"greaterRadscorpion": "Greater Radscorption",
				"groin": "Groin",
				"gunner": "Gunner",
				"gut": "Gut",
				"hamFisted": "Ham-Fisted",
				"hand": "Hand",
				"handToHandEvade": "Hand-to-Hand Evade",
				"harmless": "Harmless",
				"head": "Head",
				"healer": "Healer",
				"healingRate": {
					"abbr": "HR",
					"name": "Healing Rate"
				},
				"health": {
					"abbr": "HP",
					"name": "Health"
				},
				"heaveHo": "Heave, Ho!",
				"hereAndNow": "Here and Now",
				"hideOfScars": "Hide of Scars",
				"hip": "Hip",
				"hitTheDeck": "Hit the Deck",
				"horn": "Horn",
				"human": "Human",
				"intelligence": {
					"abbr": "Int",
					"name": "Intelligence"
				},
				"jinxed": "Jinxed",
				"jollyRoger": "Jolly Roger",
				"judgementClass": {
					"abbr": "JC",
					"name": "Judgement Class"
				},
				"jump": "Jump",
				"kamaSutra": "Kama Sutra",
				"kamikaze": "Kamikaze",
				"karmaBeacon": "Karma Beacon",
				"knee": "Knee",
				"leader": "Leader",
				"leadfoot": "Leadfoot",
				"leg": "Leg",
				"lesserMolerat": "Lesser Molerat",
				"lesserPigrat": "Greater Pigrat",
				"lesserRadscorpion": "Lesser Radscorption",
				"level": "Level",
				"lifegiver": "Lifegiver",
				"lightStep": "Light Step",
				"livingAnatomy": "Living Anatomy",
				"lockpick": "Lockpick",
				"loner": "Loner",
				"luck": {
					"abbr": "Lck",
					"name": "Luck"
				},
				"mandible": "Mandible",
				"mandibles": "Mandibles",
				"mantis": "Mantis",
				"masterThief": "Master Thief",
				"masterTrader": "Master Trader",
				"medic": "Medic",
				"medicine": "Medicine",
				"melee": "Melee",
				"meleeDamage": {
					"abbr": "MD",
					"name": "Melee Damage"
				},
				"mentalBlock": "Mental Block",
				"mirelurk": "Mirelurk",
				"mirelurkHunter": "Mirelurk Hunter",
				"mirelurkKing": "Mirelurk King",
				"moreCriticals": "More Criticals",
				"mrFixit": "Mr. (or Ms.) Fixit",
				"mutate": "Mutate!",
				"mysteriousStranger": "Mysterious Stranger",
				"neck": "Neck",
				"negotiator": "Negotiator",
				"nightPerson": "Night Person",
				"nightVision": "Night Vision",
				"nukaLurk": "Nuka-Lurk",
				"nukaLurkQuantum": "Nuka-Lurk Quantum",
				"oneHander": "One-Hander",
				"outdoorsman": "Outdoorsman",
				"packRat": "Pack Rat",
				"pathfinder": "Pathfinder",
				"perception": {
					"abbr": "Per",
					"name": "Perception"
				},
				"pickpocket": "Pickpocket",
				"pilot": "Pilot",
				"presence": "Presence",
				"psychotic": "Psychotic",
				"pyromaniac": "Pyromaniac",
				"quickPockets": "Quick Pockets",
				"quickRecovery": "Quick Recovery",
				"radChild": "Rad Child",
				"radRat": "Rad Rat",
				"radResistance": "Rad Resistance",
				"radiationBurst": "Radiation Burst",
				"radroach": "Radroach",
				"ram": "Ram",
				"rangedWeapons": "Ranged Weapons",
				"ranger": "Ranger",
				"redBaron": "Red Baron",
				"repair": "Repair",
				"resistContactGas": {
					"abbr": "CGR",
					"name": "Contact Gas Resistance"
				},
				"resistElectricity": {
					"abbr": "ER",
					"name": "Electricity Resistance"
				},
				"resistExplosion": {
					"abbr": "ExR",
					"name": "Explosion Resistance"
				},
				"resistExplosionThreshold": {
					"abbr": "ExT",
					"name": "Explosion Threshold"
				},
				"resistFire": {
					"abbr": "FR",
					"name": "Fire Resistance"
				},
				"resistFireThreshold": {
					"abbr": "FT",
					"name": "Fire Threshold"
				},
				"resistInhaledGas": {
					"abbr": "IGR",
					"name": "Inhaled Gas Resistance"
				},
				"resistLaser": {
					"abbr": "LR",
					"name": "Laser Resistance"
				},
				"resistLaserThreshold": {
					"abbr": "LT",
					"name": "Laser Threshold"
				},
				"resistNormal": {
					"abbr": "NR",
					"name": "Normal Resistance"
				},
				"resistNormalThreshold": {
					"abbr": "NT",
					"name": "Normal Threshold"
				},
				"resistPlasma": {
					"abbr": "PlR",
					"name": "Plasma Resistance"
				},
				"resistPlasmaThreshold": {
					"abbr": "PlT",
					"name": "Plasma Threshold"
				},
				"resistPoison": {
					"abbr": "PR",
					"name": "Poison Resistance"
				},
				"resistRadiation": {
					"abbr": "RR",
					"name": "Radiation Resistance"
				},
				"roadWarrior": "Road Warrior",
				"salesman": "Salesman",
				"science": "Science",
				"scout": "Scout",
				"screech": "Screech",
				"scrounger": "Scrounger",
				"sequence": {
					"abbr": "Seq",
					"name": "Sequence"
				},
				"sexAppeal": "Sex Appeal",
				"sharpshooter": "Sharpshooter",
				"shoulder": "Shoulder",
				"silentDeath": "Silent Death",
				"silentRunning": "Silent Running",
				"simpleWeapons": "Simple Weapons",
				"skilled": "Skilled",
				"slayer": "Slayer",
				"smallFrame": "Small Frame",
				"smallGuns": {
					"abbr": "SG",
					"name": "Small Guns"
				},
				"smoothTalker": "Smooth Talker",
				"snakeEater": "Snake-Eater",
				"sneak": "Sneak",
				"sniper": "Sniper",
				"social": "Social",
				"speaker": "Speaker",
				"speech": "Speech",
				"spit": "Spit",
				"stalk": "Stalk",
				"stat": "Stat!",
				"steadyArm": "Steady Arm",
				"steal": "Steal",
				"stoneWall": "Stonewall",
				"strength": {
					"abbr": "Str",
					"name": "Strength"
				},
				"strongBack": "Strong Back",
				"stuntDevil": "Stunt Devil",
				"survival": "Survival",
				"survivalist": "Survivalist",
				"swiftLearner": "Swift Learner",
				"swim": "Swim",
				"swing": "Swing",
				"tag": "Tag!",
				"tail": "Tail",
				"talonOfFear": "Talon of Fear",
				"teamPlayer": "Team Player",
				"techWizard": "Tech Wizard",
				"technical": "Technical",
				"thief": "Thief",
				"thieving": "Thieving",
				"throwing": "Throwing",
				"torso": "Torso",
				"toughHide": "Tough Hide",
				"toughness": "Toughness",
				"tunnelRat": "Tunnel Rat",
				"unarmed": "Unarmed",
				"vatSkin": "Vat Skin",
				"wayOfTheFruit": "Way of the Fruit",
				"weaponHandling": "Weapon Handling",
				"webCrawler": "Web Crawler",
				"wolf": "Wolf",
				"yaoGuai": "Yao Guai"
			}
		},
		"MISCELLANEOUS": {
			"actionPointCost": {},
			"addictionChance": {},
			"addictionRecovery": {},
			"armorClassPerUnusedActionPoint": {},
			"burstAttackActionPointCost": {},
			"changeStanceCost": {},
			"chemDuration": {},
			"criticalDamage": {},
			"criticalFailureChance": {},
			"damage": {},
			"damagePerDay": {},
			"damagePerTurn": {},
			"doctorActionPointCost": {},
			"doctorHealing": {},
			"experience": {},
			"explosiveDamage": {},
			"fallDamage": {},
			"firstAidActionPointCost": {},
			"firstAidHealing": {},
			"freeMovement": {},
			"inventoryActionPointCost": {},
			"karma": {},
			"levelsPerPerk": {},
			"lightLevelPenality": {},
			"likability": {},
			"limbDamageChance": {},
			"movingVehicleDamagePenalty": {},
			"primaryTotal": {},
			"psychoAddictionChance": {},
			"psychoEffects": {},
			"radsPerHour": {},
			"rangedDamage": {},
			"receivedExplosiveDamage": {},
			"skillPoints": {},
			"skillPointsPerBook": {},
			"skillPointsPerLevel": {},
			"skills": {},
			"standUpActionPointCost": {},
			"travel": {},
			"travelTime": {},
			"vehicleMaximumSpeed": {},
			"vehicleWreckDamage": {},
			"withdrawalTime": {},
			"xpMultiplier": {}
		},
		"PERKS": {
			"actionChild": {
				"effect": {
					"actionPointRegeneration": {
						"$inc": "value"
					}
				},
				"ranks": 2,
				"requirements": {
					"agility": 5,
					"level": 12
				}
			},
			"adrenalineRush": {
				"effect": {
					"$when": {
						"halfHealth": {
							"strength": {
								"$inc": "value"
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 6,
					"strength": {
						"max": 9,
						"min": 1
					}
				}
			},
			"animalFriend": {
				"meta": "Your character spends a lot of time with animals. A LOT of time. Animals will not attack one of their friends, unless the animal is threatened or attacked first.",
				"ranks": 1,
				"requirements": {
					"intelligence": 5,
					"level": 9,
					"outdoorsman": 25
				}
			},
			"awareness": {
				"meta": "You know exactly what is going on in combat. This perk gives you more information when you examine a critter. You can see their exact number of hit points and the weapon they are armed with, if any.",
				"ranks": 1,
				"requirements": {
					"level": 3,
					"perception": 5
				}
			},
			"bendTheRules": {
				"meta": "With this perk, the next time your character gets to choose a perk, they can ignore all restrictions except for race. You rule!",
				"ranks": 1,
				"requirements": {
					"level": 16,
					"luck": 6
				}
			},
			"betterCriticals": {
				"effect": {
					"criticalDamage": {
						"$mul": [
							"value",
							1.5
						]
					},
					"limbDamageChance": {
						"$mul": [
							"value",
							1.5
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"agility": 4,
					"level": 9,
					"luck": 6,
					"perception": 6,
					"race": {
						"$not": [
							"alphaMutant",
							"betaMutant"
						]
					}
				}
			},
			"bluffMaster": {
				"meta": "You are the king or queen of smooth talking. Whenever you are caught stealing, your character can automatically talk his or her way out of the situation.",
				"ranks": 1,
				"requirements": {
					"charisma": 7,
					"level": 8,
					"speech": 70
				}
			},
			"boneHead": {
				"meta": "You have a very thick skull, just like your mother always told you. With the first rank of this perk, you get a 50% chance to avoid being knocked unconscious. With the second rank, that chance increases to 75%.",
				"ranks": 2,
				"requirements": {
					"level": 7,
					"strength": 7
				}
			},
			"bonsai": {
				"meta": "Through careful nurturing, you have a small fruit tree growing out of your head. Now you have a steady supply of fruit!",
				"ranks": 1,
				"requirements": {
					"level": 12,
					"outdoorsman": 50,
					"race": "ghoul",
					"science": 40
				}
			},
			"bonusHandToHandAttacks": {
				"effect": {
					"$when": {
						"melee": {
							"actionPointCost": {
								"$dec": "value"
							}
						},
						"unarmed": {
							"actionPointCost": {
								"$dec": "value"
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"agility": 6,
					"level": 15
				}
			},
			"bonusHandToHandDamage": {
				"effect": {
					"meleeDamage": {
						"$add": [
							"value",
							2
						]
					}
				},
				"ranks": 3,
				"requirements": {
					"agility": 6,
					"level": 3,
					"strength": 6
				}
			},
			"bonusMove": {
				"effect": {
					"freeMovement": {
						"$add": [
							"value",
							2
						]
					}
				},
				"ranks": 2,
				"requirements": {
					"agility": 5,
					"level": 6
				}
			},
			"bonusRangedDamage": {
				"effect": {
					"rangedDamage": {
						"$add": [
							"value",
							2
						]
					}
				},
				"ranks": 2,
				"requirements": {
					"agility": 6,
					"level": 6,
					"luck": 6,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					}
				}
			},
			"bonusRateOfFire": {
				"effect": {
					"$when": {
						"ranged": {
							"actionPointCost": {
								"$dec": "value"
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"agility": 7,
					"intelligence": 6,
					"level": 15,
					"perception": 6,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					}
				}
			},
			"bracing": {
				"meta": "You know how to brace large weapons while you are standing. When applicable, you get a bonus for using a tripod just by holding a weapon in your hands.",
				"ranks": 1,
				"requirements": {
					"bigGuns": 80,
					"level": 4,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					},
					"strength": 7
				}
			},
			"breakTheRules": {
				"meta": "When you choose this perk, you may choose any perk next time, regardless of requirements or race.",
				"ranks": 1,
				"requirements": {
					"level": 20,
					"luck": 6
				}
			},
			"brownNoser": {
				"effect": {
					"$when": {
						"talkingToAuthority": {
							"charisma": {
								"$inc": 1
							}
						}
					}
				},
				"ranks": 2,
				"requirements": {
					"charisma": 5,
					"intelligence": 6,
					"level": 2,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					}
				}
			},
			"brutishHulk": {
				"effect": {
					"health": {
						"$add": [
							"value",
							{
								"$mul": [
									"level",
									{
										"$floor": {
											"$add": [
												3,
												{
													"$half": "endurance"
												}
											]
										}
									}
								]
							}
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"endurance": 5,
					"level": 8,
					"race": "deathclaw",
					"strength": 7
				}
			},
			"cancerousGrowth": {
				"effect": {
					"healingRate": {
						"$add": [
							"value",
							2
						]
					}
				},
				"meta": "regenerate one crippled limb every 48 hours",
				"ranks": 1,
				"requirements": {
					"level": 6,
					"race": "ghoul",
					"strength": {
						"max": 7,
						"min": 1
					}
				}
			},
			"cautiousNature": {
				"effect": {
					"$when": {
						"initiatingEncounter": {
							"perception": {
								"$add": [
									"value",
									3
								]
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 3,
					"perception": 6
				}
			},
			"comprehension": {
				"effect": {
					"skillPointsPerBook": {
						"$mul": [
							"value",
							1.5
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"intelligence": 6,
					"level": 3,
					"race": {
						"$not": "dog"
					}
				}
			},
			"crazyBomber": {
				"meta": "Your luck with explosives is legendary. Characters with this perk who fail to set an explosive properly will know immediately, and that explosive will not go off or detonate – it will be reset, so the Bomber can try again.",
				"ranks": 1,
				"requirements": {
					"explosives": 60,
					"intelligence": 6,
					"level": 9,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					}
				}
			},
			"cultOfPersonality": {
				"effect": {
					"likability": {
						"$abs": "value"
					}
				},
				"ranks": 1,
				"requirements": {
					"charisma": 10,
					"level": 12
				}
			},
			"deathSense": {
				"effect": {
					"$when": {
						"dark": {
							"perception": {
								"$add": [
									"value",
									2
								]
							}
						}
					},
					"detectionClass": {
						"$add": [
							"value",
							25
						]
					},
					"lightLevelPenality": {
						"$half": "value"
					}
				},
				"ranks": 1,
				"requirements": {
					"intelligence": 5,
					"level": 4,
					"race": "deathclaw"
				}
			},
			"demolitionExpert": {
				"effect": {
					"explosiveDamage": {
						"$mul": [
							"value",
							1.5
						]
					}
				},
				"meta": "Explosives set by this character will always detonate on time.",
				"ranks": 1,
				"requirements": {
					"agility": 4,
					"explosives": 90,
					"level": 9,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					}
				}
			},
			"dieHard": {
				"effect": {
					"$when": {
						"fifthHealth": {
							"damageThreshold": {
								"$add": [
									"value",
									5
								]
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"endurance": 6,
					"firstAid": 40,
					"level": 2
				}
			},
			"divineFavor": {
				"meta": "A higher power has taken a liking to you. Anytime a roll fails, you have the option of re-rolling, but you must accept the results of the re-roll (you cannot re-roll a re-roll). You can only invoke your higher power once in a 24-hour period.",
				"ranks": 1,
				"requirements": {
					"charisma": 8,
					"level": 14
				}
			},
			"dodger": {
				"effect": {
					"armorClass": {
						"$add": [
							"value",
							5
						]
					}
				},
				"ranks": 2,
				"requirements": {
					"agility": 6,
					"level": 9
				}
			},
			"dolphin": {
				"effect": {
					"swim": {
						"$add": [
							"value",
							30
						]
					}
				},
				"ranks": 2,
				"requirements": {
					"endurance": 8,
					"level": 6,
					"strength": 6
				}
			},
			"drivingCityStyle": {
				"effect": {
					"pilot": {
						"$add": [
							"value",
							30
						]
					}
				},
				"meta": "any rolls against stats made while behind the wheel get a +2 bonus",
				"ranks": 1,
				"requirements": {
					"agility": 5,
					"level": 9,
					"perception": 6,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					}
				}
			},
			"drunkenMaster": {
				"effect": {
					"$when": {
						"drunk": {
							"unarmed": {
								"$add": [
									"value",
									20
								]
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 3,
					"unarmed": 60
				}
			},
			"earlierSequence": {
				"effect": {
					"sequence": {
						"$add": [
							"value",
							2
						]
					}
				},
				"ranks": 3,
				"requirements": {
					"level": 3,
					"perception": 6
				}
			},
			"educated": {
				"effect": {
					"skillPointsPerLevel": {
						"$add": [
							"value",
							2
						]
					}
				},
				"ranks": 3,
				"requirements": {
					"intelligence": 6,
					"level": 6
				}
			},
			"empathy": {
				"meta": "You get a better idea of what to say to an NPC with this perk. The GM must warn you when dialogue will be interpreted the wrong way.",
				"ranks": 1,
				"requirements": {
					"intelligence": 5,
					"level": 6,
					"perception": 7
				}
			},
			"explorer": {
				"meta": "This perk will make it more likely that your character will find those strange and interesting encounters and items. It is up to the GM to decide what those items and encounters are.",
				"ranks": 1,
				"requirements": {
					"level": 9
				}
			},
			"fasterHealing": {
				"effect": {
					"healingRate": {
						"$add": [
							"value",
							2
						]
					}
				},
				"ranks": 3,
				"requirements": {
					"endurance": 6,
					"level": 3
				}
			},
			"flexible": {
				"effect": {
					"changeStanceCost": 1
				},
				"ranks": 1,
				"requirements": {
					"agility": 6,
					"level": 4,
					"sneak": 60
				}
			},
			"flowerChild": {
				"effect": {
					"addictionChance": {
						"$half": "value"
					},
					"withdrawalTime": {
						"$half": "value"
					}
				},
				"ranks": 1,
				"requirements": {
					"endurance": 5,
					"level": 9
				}
			},
			"fortuneFinder": {
				"meta": "Random encounters yield more money. Of course, you have to take it off the cold, dead bodies of your opponents. How much money is up to the GM.",
				"ranks": 1,
				"requirements": {
					"level": 6,
					"luck": 8
				}
			},
			"gainAgility": {
				"effect": {
					"agility": {
						"$inc": "value"
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 12
				}
			},
			"gainCharisma": {
				"effect": {
					"charisma": {
						"$inc": "value"
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 12
				}
			},
			"gainEndurance": {
				"effect": {
					"endurance": {
						"$inc": "value"
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 12
				}
			},
			"gainIntelligence": {
				"effect": {
					"intelligence": {
						"$inc": "value"
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 12
				}
			},
			"gainLuck": {
				"effect": {
					"luck": {
						"$inc": "value"
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 12
				}
			},
			"gainPerception": {
				"effect": {
					"perception": {
						"$inc": "value"
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 12
				}
			},
			"gainStrength": {
				"effect": {
					"strength": {
						"$inc": "value"
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 12
				}
			},
			"gambler": {
				"effect": {
					"gambling": {
						"$add": [
							"value",
							20
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"gambling": 50,
					"level": 6
				}
			},
			"ghost": {
				"effect": {
					"$when": {
						"dark": {
							"sneak": {
								"$add": [
									"value",
									20
								]
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 6,
					"sneak": 60
				}
			},
			"gunner": {
				"effect": {
					"$when": {
						"inMovingVehicle": {
							"movingVehicleDamagePenalty": 0
						}
					}
				},
				"ranks": 3,
				"requirements": {
					"$some": [
						{
							"unarmed": 40
						},
						{
							"melee": 40
						},
						{
							"throwing": 40
						},
						{
							"smallGuns": 40
						},
						{
							"bigGuns": 40
						},
						{
							"energyWeapons": 40
						}
					],
					"agility": 6,
					"level": 3
				}
			},
			"handToHandEvade": {
				"effect": {
					"$when": {
						"unarmed": {
							"armorClassPerUnusedActionPoint": {
								"$add": [
									"value",
									2
								]
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 12,
					"unarmed": 75
				}
			},
			"harmless": {
				"effect": {
					"steal": {
						"$add": [
							"value",
							20
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"karma": 50,
					"level": 6,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					},
					"steal": 50
				}
			},
			"healer": {
				"effect": {
					"doctorHealing": {
						"$add": [
							"value",
							4,
							{
								"$rand": 6
							}
						]
					},
					"firstAidHealing": {
						"$add": [
							"value",
							4,
							{
								"$rand": [
									1,
									6
								]
							}
						]
					}
				},
				"ranks": 2,
				"requirements": {
					"agility": 6,
					"firstAid": 40,
					"intelligence": 5,
					"level": 3,
					"perception": 7
				}
			},
			"heaveHo": {
				"meta": "For purposes of determining the maximum range of thrown weapons only, this perk will increase Strength by +2 for each rank.",
				"ranks": 3,
				"requirements": {
					"level": 6
				}
			},
			"hereAndNow": {
				"meta": "With this perk, your character immediately gains enough experience points to go up to the next level.",
				"ranks": 1,
				"requirements": {
					"level": 9
				}
			},
			"hideOfScars": {
				"effect": {
					"damageThreshold": {
						"$add": [
							"value",
							3
						]
					}
				},
				"ranks": 2,
				"requirements": {
					"endurance": 6,
					"level": 10,
					"race": "deathclaw"
				}
			},
			"hitTheDeck": {
				"effect": {
					"receivedExplosiveDamage": {
						"$half": "value"
					}
				},
				"ranks": 1,
				"requirements": {
					"agility": 6,
					"level": 4
				}
			},
			"jollyRoger": {
				"effect": {
					"pilot": {
						"$add": [
							"value",
							30
						]
					}
				},
				"meta": "you do not suffer penalties from using weapons on the water",
				"ranks": 1,
				"requirements": {
					"endurance": 7,
					"level": 9,
					"pilot": 75
				}
			},
			"kamaSutra": {
				"effect": {
					"$when": {
						"doingTheDirty": {
							"agility": {
								"$add": [
									"value",
									1
								]
							},
							"charisma": {
								"$add": [
									"value",
									2
								]
							},
							"endurance": {
								"$add": [
									"value",
									2
								]
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"agility": 5,
					"endurance": 5,
					"level": 3
				}
			},
			"karmaBeacon": {
				"effect": {
					"karma": {
						"$double": "karma"
					}
				},
				"ranks": 1,
				"requirements": {
					"agility": 5,
					"endurance": 5,
					"level": 3
				}
			},
			"leader": {
				"effect": {
					"$nearby": {
						"agility": {
							"$inc": "value"
						},
						"armorClass": {
							"$add": [
								"value",
								5
							]
						}
					}
				},
				"requirements": {
					"charisma": 6,
					"level": 4
				}
			},
			"leadfoot": {
				"effect": {
					"$when": {
						"driving": {
							"vehicleMaximumSpeed": {
								"$mul": [
									"value",
									1.25
								]
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"agility": 6,
					"level": 3,
					"perception": 6,
					"pilot": 60
				}
			},
			"lifegiver": {
				"effect": {
					"health": {
						"$add": [
							"value",
							{
								"$mul": [
									4,
									"level"
								]
							}
						]
					}
				},
				"ranks": 2,
				"requirements": {
					"endurance": 4,
					"level": 12
				}
			},
			"lightStep": {
				"meta": "Characters with this perk are much less likely to set off traps. For purposes of triggering a trap, they gain a +4 bonus to Agility.",
				"ranks": 1,
				"requirements": {
					"agility": 5,
					"level": 9,
					"luck": 5
				}
			},
			"livingAnatomy": {
				"effect": {
					"$when": {
						"attackingBiological": {
							"damage": {
								"$add": [
									"value",
									5
								]
							}
						}
					},
					"doctor": {
						"$add": [
							"doctor",
							10
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"doctor": 60,
					"level": 12
				}
			},
			"loner": {
				"effect": {
					"$when": {
						"noNearbyParty": {
							"skills": {
								"$add": [
									"value",
									10
								]
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"charisma": {
						"max": 4,
						"min": 1
					},
					"level": 4,
					"outdoorsman": 50
				}
			},
			"masterThief": {
				"effect": {
					"lockpick": {
						"$add": [
							"value",
							15
						]
					},
					"steal": {
						"$add": [
							"value",
							15
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 12,
					"lockpick": 50,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					},
					"steal": 50
				}
			},
			"masterTrader": {
				"effect": {
					"barter": {
						"$add": [
							"value",
							30
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"barter": 60,
					"charisma": 7,
					"level": 9,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					}
				}
			},
			"medic": {
				"effect": {
					"doctor": {
						"$add": [
							"value",
							10
						]
					},
					"firstAid": {
						"$add": [
							"value",
							10
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"$some": [
						{
							"firstAid": 40
						},
						{
							"doctor": 40
						}
					],
					"level": 12
				}
			},
			"mentalBlock": {
				"meta": "For purposes of determining range in combat AND finding traps ONLY, your character’s Perception is raised by 1, up to the racial maximum.",
				"ranks": 1,
				"requirements": {
					"level": 15
				}
			},
			"moreCriticals": {
				"effect": {
					"criticalChance": {
						"$add": [
							"value",
							5
						]
					}
				},
				"ranks": 3,
				"requirements": {
					"level": 6,
					"luck": 6
				}
			},
			"mrFixit": {
				"effect": {
					"repair": {
						"$add": [
							"value",
							10
						]
					},
					"science": {
						"$add": [
							"value",
							10
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"$some": [
						{
							"repair": 40
						},
						{
							"science": 40
						}
					],
					"level": 12
				}
			},
			"mutate": {
				"meta": "Picking this perk will also make you select one of your current Traits to remove. You then get a chance to pick another Trait. Weird, eh?",
				"ranks": 1,
				"requirements": {
					"level": 9
				}
			},
			"mysteriousStranger": {
				"meta": "When you select this perk, there is a chance (30% + (2 X LK)) that your character will gain a temporary ally, but only in random encounters. The GM will choose that ally.",
				"ranks": 1,
				"requirements": {
					"level": 9,
					"luck": 4
				}
			},
			"negotiator": {
				"effect": {
					"barter": {
						"$add": [
							"value",
							10
						]
					},
					"speech": {
						"$add": [
							"value",
							10
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"barter": 50,
					"level": 6,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					},
					"speech": 50
				}
			},
			"nightVision": {
				"meta": "Negative modifiers for dark conditions are reduced by 50%.",
				"requirements": {
					"level": 3,
					"perception": 6
				}
			},
			"packRat": {
				"effect": {
					"carryWeight": {
						"$add": [
							"value",
							10
						]
					}
				},
				"ranks": 2,
				"requirements": {
					"level": 3,
					"perception": 6
				}
			},
			"pathfinder": {
				"effect": {
					"travelTime": {
						"$mul": [
							"value",
							0.75
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"endurance": 6,
					"level": 6,
					"outdoorsman": 60
				}
			},
			"pickpocket": {
				"effect": {
					"steal": {
						"$add": [
							"value",
							25
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"agility": 8,
					"level": 15,
					"steal": 80
				}
			},
			"presence": {
				"effect": {
					"$when": {
						"reactionRoll": {
							"charisma": {
								"$inc": "value"
							}
						}
					}
				},
				"ranks": 3
			},
			"psychotic": {
				"effect": {
					"psychoAddictionChance": {
						"$floor": {
							"$half": "value"
						}
					},
					"psychoEffects": {
						"$mul": [
							"value",
							2
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"endurance": 5,
					"level": 8,
					"race": [
						"alphaMutant",
						"betaMutant"
					]
				}
			},
			"pyromaniac": {
				"effect": {
					"$when": {
						"fireBasedWeapon": {
							"damage": {
								"$add": [
									"value",
									5
								]
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"bigGuns": 75,
					"level": 9
				}
			},
			"quickPockets": {
				"effect": {
					"inventoryActionPointCost": {
						"$ceil": {
							"$half": "value"
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"agility": 5,
					"level": 3
				}
			},
			"quickRecovery": {
				"effect": {
					"standUpActionPointCost": 1
				},
				"ranks": 1,
				"requirements": {
					"agility": 5,
					"level": 6
				}
			},
			"radChild": {
				"effect": {
					"$when": {
						"irradiated": {
							"healingRate": {
								"$add": [
									"value",
									5
								]
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"endurance": 6,
					"level": 3,
					"race": "ghoul"
				}
			},
			"radResistance": {
				"effect": {
					"resistRadiation": {
						"$add": [
							"value",
							15
						]
					}
				},
				"ranks": 2,
				"requirements": {
					"endurance": 6,
					"intelligence": 4,
					"level": 6
				}
			},
			"ranger": {
				"effect": {
					"outdoorsman": {
						"$add": [
							"value",
							15
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 6,
					"perception": 6
				}
			},
			"redBaron": {
				"effect": {
					"pilot": {
						"$add": [
							"value",
							25
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"agility": 6,
					"level": 9,
					"perception": 7
				}
			},
			"roadWarrior": {
				"meta": "You do not suffer any penalties when driving vehicles and making attacks at the same time.",
				"ranks": 1,
				"requirements": {
					"intelligence": 6,
					"level": 12,
					"pilot": 60,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					}
				}
			},
			"salesman": {
				"effect": {
					"barter": {
						"$add": [
							"value",
							20
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"barter": 50,
					"level": 6,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					}
				}
			},
			"scout": {
				"meta": "Your character can see further in the wilderness. Maps are easier to read. It is up to the GM to determine exactly how this works. Special encounters and items are a little easier to find with this skill as well.",
				"ranks": 1,
				"requirements": {
					"level": 3,
					"perception": 7
				}
			},
			"scrounger": {
				"meta": "You can find more ammo than the normal post-nuclear survivor. You always find double the normal ammunition in random encounters.",
				"ranks": 1,
				"requirements": {
					"level": 9,
					"luck": 8
				}
			},
			"sharpshooter": {
				"meta": "With each rank of this perk, Perception increases by +2 for the purposes of determining the modifiers for range in combat.",
				"ranks": 2,
				"requirements": {
					"intelligence": 6,
					"level": 9,
					"perception": 7
				}
			},
			"silentDeath": {
				"effect": {
					"$when": {
						"backstab": {
							"damage": {
								"$double": "value"
							}
						}
					}
				},
				"ranks": 1,
				"requirements": {
					"agility": 10,
					"level": 18,
					"sneak": 80,
					"unarmed": 80
				}
			},
			"silentRunning": {
				"meta": "This perk allows characters to run and sneak at the same time.",
				"ranks": 1,
				"requirements": {
					"agility": 6,
					"level": 6,
					"sneak": 50
				}
			},
			"slayer": {
				"meta": "The slayer walks the earth! In HtH or melee combat, characters with this Perk do a critical hit with a successful roll against Luck!",
				"ranks": 1,
				"requirements": {
					"agility": 8,
					"level": 24,
					"strength": 8,
					"unarmed": 80
				}
			},
			"smoothTalker": {
				"effect": {
					"$when": {
						"smoothtalking": {
							"intelligence": {
								"$inc": "value"
							}
						}
					}
				},
				"ranks": 3,
				"requirements": {
					"intelligence": 4,
					"level": 3,
					"race": {
						"$not": "dog"
					}
				}
			},
			"snakeEater": {
				"effect": {
					"resistPoison": {
						"$add": [
							"value",
							25
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"endurance": 3,
					"level": 6
				}
			},
			"sniper": {
				"meta": "When using a ranged weapon, your character will do a critical hit with successful roll against Luck and this perk. ",
				"ranks": 1,
				"requirements": {
					"agility": 8,
					"level": 24,
					"perception": 8,
					"smallGuns": 80
				}
			},
			"speaker": {
				"effect": {
					"speech": {
						"$add": [
							"value",
							20
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 9,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					},
					"speech": 50
				}
			},
			"stat": {
				"effect": {
					"doctorActionPointCost": 5,
					"firstAidActionPointCost": 5
				},
				"ranks": 1,
				"requirements": {
					"agility": 6,
					"doctor": 50,
					"firstAid": 75,
					"level": 3
				}
			},
			"steadyArm": {
				"effect": {
					"burstAttackActionPointCost": {
						"$dec": "value"
					}
				},
				"ranks": 1,
				"requirements": {
					"level": 4,
					"race": [
						"alphaMutant",
						"betaMutant"
					],
					"strength": 6
				}
			},
			"stoneWall": {
				"meta": "If your character is about to be knocked down in combat, he can roll a percentile dice and has a 50% chance to avoid that fate.",
				"ranks": 1,
				"requirements": {
					"level": 3,
					"strength": 6
				}
			},
			"strongBack": {
				"effect": {
					"carryWeight": {
						"$add": [
							"value",
							50
						]
					}
				},
				"ranks": 2,
				"requirements": {
					"endurance": 6,
					"level": 3,
					"strength": 6
				}
			},
			"stuntDevil": {
				"effect": {
					"fallDamage": {
						"$mul": [
							"value",
							0.75
						]
					},
					"pilot": {
						"$add": [
							"value",
							10
						]
					},
					"vehicleWreckDamage": {
						"$mul": [
							"value",
							0.75
						]
					}
				},
				"ranks": 1,
				"requirements": {
					"agility": 6,
					"endurance": 6,
					"level": 6,
					"race": {
						"$not": "dog"
					},
					"strength": 6
				}
			},
			"survivalist": {
				"effect": {
					"outdoorsman": {
						"$add": [
							"value",
							25
						]
					}
				},
				"ranks": 3,
				"requirements": {
					"endurance": 6,
					"intelligence": 6,
					"level": 3,
					"outdoorsman": 40
				}
			},
			"swiftLearner": {
				"effect": {
					"xpMultiplier": {
						"$add": [
							"value",
							5
						]
					}
				},
				"ranks": 3,
				"requirements": {
					"intelligence": 4,
					"level": 3
				}
			},
			"tag": {
				"meta": "Pick an additional tag skill",
				"ranks": 1,
				"requirements": {
					"level": 12
				}
			},
			"talonOfFear": {
				"meta": "Venom has seeped into your claws. All of your unarmed attacks carry a Type B poison.",
				"ranks": 1,
				"requirements": {
					"level": 12,
					"strength": 6,
					"unarmed": 60
				}
			},
			"teamPlayer": {
				"effect": {
					"$nearby": {
						"skills": {
							"$add": [
								"value",
								10
							]
						}
					}
				},
				"requirements": {
					"charisma": 4,
					"level": 12
				}
			},
			"thief": {
				"effect": {
					"explosives": {
						"$add": [
							"value",
							10
						]
					},
					"lockpick": {
						"$add": [
							"value",
							10
						]
					},
					"sneak": {
						"$add": [
							"value",
							10
						]
					},
					"steal": {
						"$add": [
							"value",
							10
						]
					}
				},
				"requirements": {
					"level": 3,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					}
				}
			},
			"toughHide": {
				"effect": {
					"armorClass": {
						"$add": [
							"value",
							15
						]
					},
					"damageThreshold": {
						"$add": [
							"value",
							5
						]
					}
				},
				"requirements": {
					"endurance": {
						"max": 8,
						"min": 1
					},
					"level": 12,
					"race": [
						"alphaMutant",
						"betaMutant"
					]
				}
			},
			"toughness": {
				"effect": {
					"damageThreshold": {
						"$add": [
							"value",
							3
						]
					}
				},
				"requirements": {
					"endurance": 6,
					"level": 3,
					"luck": 6
				}
			},
			"tunnelRat": {
				"meta": "You crawl like a baby. Well, you crawl like a very fast baby. You can move at your normal rate (1 AP per hex) while crouching or prone.",
				"requirements": {
					"agility": 6,
					"level": 4,
					"sneak": 60
				}
			},
			"wayOfTheFruit": {
				"meta": "You have learned about the mystical healing effects of eating fruit. For 24 hours after eating a piece of fruit, your character gains +1 to Perception and Agility.",
				"requirements": {
					"charisma": 6,
					"level": 6,
					"race": {
						"$not": [
							"deathclaw",
							"dog"
						]
					}
				}
			},
			"weaponHandling": {
				"meta": "This perk adds +3 Strength for the purposes of strength requirements for handling and firing weapons.",
				"requirements": {
					"agility": 5,
					"level": 12
				}
			},
			"webCrawler": {
				"effect": {
					"climb": {
						"$add": [
							"value",
							30
						]
					}
				},
				"requirements": {
					"endurance": 7,
					"level": 6,
					"strength": 6
				}
			}
		},
		"PRIMARY_STATISTICS": {
			"agility": {
				"order": 6
			},
			"charisma": {
				"order": 4
			},
			"endurance": {
				"order": 3
			},
			"intelligence": {
				"order": 5
			},
			"luck": {
				"order": 7
			},
			"perception": {
				"order": 2
			},
			"strength": {
				"order": 1
			}
		},
		"RACES": {
			"alphaMutant": {
				"agility": {
					"max": 8,
					"min": 1
				},
				"charisma": {
					"max": 8,
					"min": 1
				},
				"endurance": {
					"max": 12,
					"min": 3
				},
				"height": {
					"max": 3,
					"min": 2.8
				},
				"intelligence": {
					"max": 11,
					"min": 1
				},
				"levelsPerPerk": 4,
				"luck": {
					"max": 10,
					"min": 1
				},
				"perception": {
					"max": 10,
					"min": 1
				},
				"primaryTotal": 40,
				"resistContactGas": 35,
				"resistPoison": 20,
				"resistRadiation": 10,
				"strength": {
					"max": 13,
					"min": 4
				},
				"weight": {
					"max": 400,
					"min": 300
				}
			},
			"betaMutant": {
				"agility": {
					"max": 8,
					"min": 1
				},
				"charisma": {
					"max": 8,
					"min": 1
				},
				"endurance": {
					"max": 12,
					"min": 4
				},
				"height": {
					"max": 3,
					"min": 2.8
				},
				"intelligence": {
					"max": 8,
					"min": 1
				},
				"levelsPerPerk": 4,
				"luck": {
					"max": 10,
					"min": 1
				},
				"perception": {
					"max": 10,
					"min": 1
				},
				"primaryTotal": 40,
				"resistContactGas": 35,
				"resistPoison": 20,
				"resistRadiation": 10,
				"strength": {
					"max": 13,
					"min": 5
				},
				"weight": {
					"max": 400,
					"min": 300
				}
			},
			"deathclaw": {},
			"dog": {},
			"ghoul": {
				"agility": {
					"max": 8,
					"min": 1
				},
				"charisma": {
					"max": 9,
					"min": 1
				},
				"endurance": {
					"max": 10,
					"min": 1
				},
				"health": {
					"$sub": [
						"value",
						5
					]
				},
				"height": {
					"max": 2.5,
					"min": 1.5
				},
				"intelligence": {
					"max": 13,
					"min": 2
				},
				"levelsPerPerk": 4,
				"luck": {
					"max": 10,
					"min": 5
				},
				"perception": {
					"max": 14,
					"min": 4
				},
				"primaryTotal": 42,
				"resistPoison": 10,
				"resistRadiation": 40,
				"strength": {
					"max": 6,
					"min": 1
				},
				"weight": {
					"max": 160,
					"min": 80
				}
			},
			"human": {
				"agility": {
					"max": 10,
					"min": 1
				},
				"charisma": {
					"max": 10,
					"min": 1
				},
				"endurance": {
					"max": 10,
					"min": 1
				},
				"height": {
					"max": 2.5,
					"min": 1.5
				},
				"intelligence": {
					"max": 10,
					"min": 1
				},
				"levelsPerPerk": 3,
				"luck": {
					"max": 10,
					"min": 1
				},
				"perception": {
					"max": 10,
					"min": 1
				},
				"primaryTotal": 40,
				"resistElectricity": 10,
				"strength": {
					"max": 10,
					"min": 1
				},
				"weight": {
					"max": 280,
					"min": 110
				}
			}
		},
		"CONDITIONS": {
			"jogging": {},
			"running": {},
			"sprinting": {},
			"still": {},
			"walking": {}
		},
		"SECONDARY_STATISTICS": {
			"actionPointRegeneration": {
				"value": {
					"$when": {
						"jogging": {
							"$floor": {
								"$half": "agility"
							}
						},
						"running": 0,
						"sprinting": {
							"$mul": [
								-2,
								{
									"$sub": [
										"travel",
										5
									]
								}
							]
						},
						"walking": {
							"$add": [
								3,
								{
									"$floor": {
										"$half": "agility"
									}
								}
							]
						},
						"otherwise": {
							"$add": [
								3,
								"agility"
							]
						}
					}
				}
			},
			"actionPoints": {
				"value": {
					"$add": [
						5,
						{
							"$floor": {
								"$half": "agility"
							}
						},
						{
							"$floor": {
								"$half": "endurance"
							}
						}
					]
				}
			},
			"armorClass": {
				"percent": true,
				"value": "agility"
			},
			"carryWeight": {
				"value": {
					"$add": [
						25,
						{
							"$mul": [
								25,
								"strength"
							]
						}
					]
				}
			},
			"criticalChance": {
				"percent": true,
				"value": "luck"
			},
			"criticalFailure": {
				"percent": true,
				"value": {
					"$add": [
						89,
						"luck"
					]
				}
			},
			"damageThreshold": {
				"value": 0
			},
			"detectionClass": {
				"percent": true,
				"value": "perception"
			},
			"healingRate": {
				"value": {
					"$floor": {
						"$div": [
							"endurance",
							3
						]
					}
				}
			},
			"health": {
				"value": {
					"$add": [
						15,
						"strength",
						{
							"$double": "endurance"
						},
						{
							"$mul": [
								"level",
								{
									"$floor": {
										"$add": [
											3,
											{
												"$half": "endurance"
											}
										]
									}
								}
							]
						}
					]
				}
			},
			"judgementClass": {
				"percent": true,
				"value": "charisma"
			},
			"level": {
				"value": {
					"$floor": {
						"$add": [
							0.5,
							{
								"$div": [
									{
										"$sqrt": {
											"$add": [
												{
													"$div": [
														"experience",
														10
													]
												},
												25
											]
										}
									},
									10
								]
							}
						]
					}
				}
			},
			"meleeDamage": {
				"value": {
					"$max": [
						1,
						{
							"$sub": [
								"strength",
								5
							]
						}
					]
				}
			},
			"resistContactGas": {
				"percent": true,
				"value": 0
			},
			"resistElectricity": {
				"percent": true,
				"value": 0
			},
			"resistExplosion": {
				"percent": true,
				"value": 0
			},
			"resistExplosionThreshold": {
				"value": 0
			},
			"resistFire": {
				"percent": true,
				"value": 0
			},
			"resistFireThreshold": {
				"value": 0
			},
			"resistInhaledGas": {
				"percent": true,
				"value": 0
			},
			"resistLaser": {
				"percent": true,
				"value": 0
			},
			"resistLaserThreshold": {
				"value": 0
			},
			"resistNormal": {
				"percent": true,
				"value": 0
			},
			"resistNormalThreshold": {
				"value": 0
			},
			"resistPlasma": {
				"percent": true,
				"value": 0
			},
			"resistPlasmaThreshold": {
				"value": 0
			},
			"resistPoison": {
				"percent": true,
				"value": {
					"$mul": [
						5,
						"endurance"
					]
				}
			},
			"resistRadiation": {
				"percent": true,
				"value": {
					"$double": "endurance"
				}
			},
			"sequence": {
				"value": {
					"$double": "perception"
				}
			}
		},
		"SKILLS": {
			"medicine": {
				"chems": {
					"value": {
						"$add": [
							10,
							{
								"$double": "intelligence"
							}
						]
					}
				},
				"doctor": {
					"value": {
						"$add": [
							10,
							{
								"$double": "intelligence"
							}
						]
					}
				},
				"firstAid": {
					"value": {
						"$add": [
							10,
							{
								"$double": "intelligence"
							}
						]
					}
				}
			},
			"rangedWeapons": {
				"bigGuns": {
					"value": {
						"$add": [
							{
								"$double": "endurance"
							},
							"perception",
							"strength"
						]
					}
				},
				"energyWeapons": {
					"value": {
						"$add": [
							10,
							{
								"$double": "perception"
							}
						]
					}
				},
				"explosives": {
					"value": {
						"$add": [
							10,
							{
								"$double": "perception"
							}
						]
					}
				},
				"smallGuns": {
					"value": {
						"$add": [
							10,
							"agility",
							"perception"
						]
					}
				}
			},
			"simpleWeapons": {
				"melee": {
					"value": {
						"$add": [
							10,
							{
								"$double": "strength"
							}
						]
					}
				},
				"throwing": {
					"value": {
						"$mul": [
							4,
							"agility"
						]
					}
				},
				"unarmed": {
					"value": {
						"$add": [
							10,
							{
								"$double": "agility"
							},
							"strength"
						]
					}
				}
			},
			"social": {
				"barter": {
					"value": {
						"$add": [
							10,
							{
								"$double": "charisma"
							}
						]
					}
				},
				"gambling": {
					"value": {
						"$add": [
							10,
							"luck",
							"perception"
						]
					}
				},
				"speech": {
					"value": {
						"$add": [
							10,
							{
								"$double": "charisma"
							}
						]
					}
				}
			},
			"survival": {
				"climb": {
					"value": {
						"$add": [
							10,
							"endurance",
							"strength"
						]
					}
				},
				"jump": {
					"value": {
						"$add": [
							10,
							"agility",
							"strength"
						]
					}
				},
				"outdoorsman": {
					"value": {
						"$add": [
							10,
							"endurance"
						]
					}
				},
				"swim": {
					"value": {
						"$add": [
							10,
							"endurance",
							"strength"
						]
					}
				}
			},
			"technical": {
				"pilot": {
					"value": {
						"$add": [
							10,
							{
								"$double": "agility"
							}
						]
					}
				},
				"repair": {
					"value": {
						"$add": [
							10,
							{
								"$double": "intelligence"
							}
						]
					}
				},
				"science": {
					"value": {
						"$add": [
							10,
							{
								"$double": "intelligence"
							}
						]
					}
				}
			},
			"thieving": {
				"disguise": {
					"value": {
						"$add": [
							10,
							"charisma",
							"perception"
						]
					}
				},
				"lockpick": {
					"value": {
						"$add": [
							10,
							{
								"$double": "perception"
							}
						]
					}
				},
				"sneak": {
					"value": {
						"$add": [
							10,
							{
								"$double": "agility"
							}
						]
					}
				},
				"steal": {
					"value": {
						"$add": [
							10,
							"agility",
							"luck"
						]
					}
				}
			}
		},
		"TRAITS": {
			"bloodyMess": {},
			"bruiser": {
				"actionPoints": {
					"$sub": [
						"value",
						2
					]
				},
				"requirements": {
					"race": {
						"$not": "ghoul"
					}
				},
				"strength": {
					"$add": [
						"value",
						2
					]
				}
			},
			"chemReliant": {
				"addictionChance": {
					"$double": "value"
				},
				"addictionRecovery": {
					"$double": "value"
				}
			},
			"chemResistant": {
				"addictionChance": {
					"$half": "value"
				},
				"chemDuration": {
					"$half": "value"
				}
			},
			"fastMetabolism": {
				"healingRate": {
					"$double": "value"
				},
				"requirements": {
					"race": {
						"$not": "ghoul"
					}
				},
				"resistPoison": 0,
				"resistRadiation": 0
			},
			"fastShot": {
				"actionPointCost": {
					"$sub": [
						"value",
						1
					]
				},
				"meta": "Prevents action: Targeted Shot"
			},
			"fearTheReaper": {
				"levelsPerPerk": {
					"$sub": [
						"value",
						1
					]
				},
				"requirements": {
					"race": "ghoul"
				}
			},
			"finesse": {
				"criticalChance": {
					"$add": [
						"value",
						10
					]
				},
				"damage": {
					"$ceil": {
						"$mul": [
							"value",
							0.75
						]
					}
				}
			},
			"gifted": {
				"primaryTotal": {
					"$add": [
						"value",
						5
					]
				},
				"skillPoints": {
					"$add": [
						"value",
						-10,
						{
							"$mul": [
								"level",
								-5
							]
						}
					]
				}
			},
			"glowingOne": {
				"$nearby": {
					"radsPerHour": {
						"$add": [
							"value",
							10
						]
					}
				},
				"meta": "Light effects are prevented",
				"requirements": {
					"race": "ghoul"
				},
				"resistRadiation": {
					"$add": [
						"value",
						50
					]
				}
			},
			"goodNatured": {
				"barter": {
					"$add": [
						"value",
						20
					]
				},
				"bigGuns": {
					"$sub": [
						"value",
						10
					]
				},
				"doctor": {
					"$add": [
						"value",
						20
					]
				},
				"energyWeapons": {
					"$sub": [
						"value",
						10
					]
				},
				"explosives": {
					"$sub": [
						"value",
						10
					]
				},
				"firstAid": {
					"$add": [
						"value",
						20
					]
				},
				"melee": {
					"$sub": [
						"value",
						10
					]
				},
				"smallGuns": {
					"$sub": [
						"value",
						10
					]
				},
				"speech": {
					"$add": [
						"value",
						20
					]
				},
				"throwing": {
					"$sub": [
						"value",
						10
					]
				},
				"unarmed": {
					"$sub": [
						"value",
						10
					]
				}
			},
			"hamFisted": {
				"bigGuns": {
					"$sub": [
						"value",
						20
					]
				},
				"doctor": {
					"$sub": [
						"value",
						20
					]
				},
				"energyWeapons": {
					"$sub": [
						"value",
						20
					]
				},
				"firstAid": {
					"$sub": [
						"value",
						20
					]
				},
				"lockpick": {
					"$sub": [
						"value",
						20
					]
				},
				"meta": "Tag Unarmed skill",
				"repair": {
					"$sub": [
						"value",
						20
					]
				},
				"requirements": {
					"race": [
						"alphaMutant",
						"betaMutant"
					]
				},
				"science": {
					"$sub": [
						"value",
						20
					]
				},
				"smallGuns": {
					"$sub": [
						"value",
						20
					]
				}
			},
			"jinxed": {
				"$nearby": {
					"criticalFailureChance": {
						"$add": [
							"value",
							50
						]
					}
				},
				"criticalFailureChance": {
					"$add": [
						"value",
						50
					]
				}
			},
			"kamikaze": {
				"armorClass": 0,
				"sequence": {
					"$add": [
						"value",
						5
					]
				}
			},
			"nightPerson": {
				"$when": {
					"daytime": {
						"intelligence": {
							"$dec": "value"
						},
						"perception": {
							"$dec": "value"
						}
					},
					"nighttime": {
						"intelligence": {
							"$inc": "value"
						},
						"perception": {
							"$inc": "value"
						}
					}
				}
			},
			"oneHander": {
				"$when": {
					"holdingOneHandedWeapon": {
						"energyWeapons": {
							"$add": [
								"value",
								20
							]
						},
						"smallGuns": {
							"$add": [
								"value",
								20
							]
						},
						"throwing": {
							"$add": [
								"value",
								20
							]
						}
					},
					"holdingTwoHandedWeapon": {
						"bigGuns": {
							"$sub": [
								"value",
								40
							]
						},
						"energyWeapons": {
							"$sub": [
								"value",
								40
							]
						},
						"smallGuns": {
							"$sub": [
								"value",
								40
							]
						},
						"throwing": {
							"$sub": [
								"value",
								40
							]
						}
					}
				}
			},
			"sexAppeal": {
				"$when": {
					"talkingToAttractedSex": {
						"barter": {
							"$add": [
								"value",
								40
							]
						},
						"charisma": {
							"$inc": "value"
						},
						"speech": {
							"$add": [
								"value",
								40
							]
						}
					},
					"talkingToUnattractedSex": {
						"barter": {
							"$sub": [
								"value",
								40
							]
						},
						"charisma": {
							"$dec": "value"
						},
						"speech": {
							"$sub": [
								"value",
								40
							]
						}
					}
				},
				"requirements": {
					"race": "human"
				}
			},
			"skilled": {
				"levelsPerPerk": {
					"$inc": "value"
				},
				"skillPointsPerLevel": {
					"$add": [
						"value",
						5
					]
				}
			},
			"smallFrame": {
				"agility": {
					"$inc": "value"
				},
				"carryWeight": {
					"$add": [
						"value",
						-25,
						{
							"$mul": [
								-10,
								"level"
							]
						}
					]
				},
				"requirements": {
					"race": {
						"$not": [
							"alphaMutant",
							"betaMutant"
						]
					}
				}
			},
			"techWizard": {
				"lockpick": {
					"$add": [
						"value",
						15
					]
				},
				"perception": {
					"$dec": "value"
				},
				"repair": {
					"$add": [
						"value",
						15
					]
				},
				"requirements": {
					"race": {
						"$not": "betaMutant"
					}
				},
				"science": {
					"$add": [
						"value",
						15
					]
				}
			},
			"vatSkin": {
				"$nearby": {
					"perception": {
						"$dec": "value"
					}
				},
				"armorClass": {
					"$add": [
						"value",
						10
					]
				},
				"requirements": {
					"race": [
						"alphaMutant",
						"betaMutant"
					]
				}
			}
		}
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var assign        = __webpack_require__(38)
	  , normalizeOpts = __webpack_require__(120)
	  , isCallable    = __webpack_require__(57)
	  , contains      = __webpack_require__(60)
	
	  , d;
	
	d = module.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if ((arguments.length < 2) || (typeof dscr !== 'string')) {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (dscr == null) {
			c = w = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
			w = contains.call(dscr, 'w');
		}
	
		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};
	
	d.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== 'string') {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (get == null) {
			get = undefined;
		} else if (!isCallable(get)) {
			options = get;
			get = set = undefined;
		} else if (set == null) {
			set = undefined;
		} else if (!isCallable(set)) {
			options = set;
			set = undefined;
		}
		if (dscr == null) {
			c = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
		}
	
		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _getIterator = __webpack_require__(185)["default"];
	
	var _isIterable = __webpack_require__(186)["default"];
	
	exports["default"] = (function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;
	
	    try {
	      for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);
	
	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }
	
	    return _arr;
	  }
	
	  return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if (_isIterable(Object(arr))) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	})();
	
	exports.__esModule = true;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(215)('wks')
	  , Symbol = __webpack_require__(47).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || __webpack_require__(219))('Symbol.' + name));
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (fn) {
		if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
		return fn;
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(31)
	
	module.exports = isVirtualNode
	
	function isVirtualNode(x) {
	    return x && x.type === "VirtualNode" && x.version === version
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _get = __webpack_require__(27)['default'];
	
	var _inherits = __webpack_require__(28)['default'];
	
	var _createClass = __webpack_require__(26)['default'];
	
	var _classCallCheck = __webpack_require__(19)['default'];
	
	var _slicedToArray = __webpack_require__(12)['default'];
	
	var _Object$entries = __webpack_require__(18)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = withNiceToString;
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	function withNiceToString(Class) {
	    var fields = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    return (function (_Class) {
	        _inherits(SubClass, _Class);
	
	        function SubClass() {
	            _classCallCheck(this, SubClass);
	
	            _get(Object.getPrototypeOf(SubClass.prototype), 'constructor', this).apply(this, arguments);
	        }
	
	        _createClass(SubClass, [{
	            key: 'toString',
	            value: function toString() {
	                var _this = this;
	
	                return (this.name || this._name || 'unnamed') + ' {' + _Object$entries(fields).filter(function (_ref) {
	                    var _ref2 = _slicedToArray(_ref, 1);
	
	                    var key = _ref2[0];
	                    return key !== 'key';
	                }).map(function (_ref3) {
	                    var _ref32 = _slicedToArray(_ref3, 2);
	
	                    var key = _ref32[0];
	                    var value = _ref32[1];
	
	                    if (value === _this[key] || _immutable2['default'].is(value, _this[key])) {
	                        return '';
	                    }
	                    return ' ' + key + ': ' + _this[key];
	                }).filter(function (x) {
	                    return x;
	                }).join(',') + ' }';
	            }
	        }]);
	
	        return SubClass;
	    })(Class);
	}
	
	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(195), __esModule: true };

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(198), __esModule: true };

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(47)
	  , core      = __webpack_require__(4)
	  , PROTOTYPE = 'prototype';
	var ctx = function(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	};
	var $def = function(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , isProto  = type & $def.P
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {})[PROTOTYPE]
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    if(isGlobal && typeof target[key] != 'function')exp = source[key];
	    // bind timers to global for call from export context
	    else if(type & $def.B && own)exp = ctx(out, global);
	    // wrap global constructors for prevent change them in library
	    else if(type & $def.W && target[key] == out)!function(C){
	      exp = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      exp[PROTOTYPE] = C[PROTOTYPE];
	    }(out);
	    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export
	    exports[key] = exp;
	    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	module.exports = $def;

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = isThunk
	
	function isThunk(t) {
	    return t && t.type === "Thunk"
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(31)
	
	module.exports = isVirtualText
	
	function isVirtualText(x) {
	    return x && x.type === "VirtualText" && x.version === version
	}


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = combineLatestObject;
	
	var _cycleCore = __webpack_require__(2);
	
	function toObservable(value) {
	    if (value instanceof _cycleCore.Rx.Observable) {
	        return value;
	    } else if (value && value.constructor === Object) {
	        return combineLatestObject(value);
	    } else {
	        return _cycleCore.Rx.Observable['return'](value);
	    }
	}
	
	function combineLatestObject(object) {
	    var keys = _Object$keys(object);
	    return _cycleCore.Rx.Observable.combineLatest(keys.map(function (key) {
	        return toObservable(object[key]);
	    })).map(function (values) {
	        return keys.reduce(function (acc, key, i) {
	            acc[key] = values[i];
	            return acc;
	        }, {});
	    });
	}
	
	module.exports = exports['default'];

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _get = __webpack_require__(27)['default'];
	
	var _inherits = __webpack_require__(28)['default'];
	
	var _createClass = __webpack_require__(26)['default'];
	
	var _classCallCheck = __webpack_require__(19)['default'];
	
	var _interopRequireWildcard = __webpack_require__(191)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _localize = __webpack_require__(177);
	
	var localize = _interopRequireWildcard(_localize);
	
	exports['default'] = function (Record) {
	    return (function (_Record) {
	        _inherits(_class, _Record);
	
	        function _class() {
	            _classCallCheck(this, _class);
	
	            _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).apply(this, arguments);
	        }
	
	        _createClass(_class, [{
	            key: 'name',
	            get: function get() {
	                return localize.name(this.key);
	            }
	        }, {
	            key: 'plural',
	            get: function get() {
	                return localize.plural(this.key);
	            }
	        }, {
	            key: 'abbr',
	            get: function get() {
	                return localize.abbr(this.key);
	            }
	        }, {
	            key: 'description',
	            get: function get() {
	                return localize.description(this.key);
	            }
	        }]);
	
	        return _class;
	    })(Record);
	};
	
	module.exports = exports['default'];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _get = __webpack_require__(27)['default'];
	
	var _inherits = __webpack_require__(28)['default'];
	
	var _classCallCheck = __webpack_require__(19)['default'];
	
	var _slicedToArray = __webpack_require__(12)['default'];
	
	var _Object$defineProperty = __webpack_require__(44)['default'];
	
	var _Object$entries = __webpack_require__(18)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = withLookup;
	function memoize(fetcher) {
	    var cacheKey = Math.random().toString(36).slice(2);
	    return function () {
	        var cache = this[cacheKey];
	        if (!cache) {
	            _Object$defineProperty(this, cacheKey, {
	                value: cache = {}
	            });
	        }
	        var argsKey = Array.prototype.join.call(arguments, ';');
	        return cache[argsKey] || (cache[argsKey] = fetcher.apply(this, arguments));
	    };
	}
	
	function withLookup(Record, fetchers) {
	    var SubRecord = (function (_Record) {
	        _inherits(SubRecord, _Record);
	
	        function SubRecord() {
	            _classCallCheck(this, SubRecord);
	
	            _get(Object.getPrototypeOf(SubRecord.prototype), 'constructor', this).apply(this, arguments);
	        }
	
	        return SubRecord;
	    })(Record);
	
	    _Object$entries(fetchers).forEach(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 2);
	
	        var key = _ref2[0];
	        var value = _ref2[1];
	
	        _Object$defineProperty(SubRecord, key, {
	            value: memoize(value),
	            enumerable: true
	        });
	    });
	    return SubRecord;
	}
	
	module.exports = exports['default'];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperty = __webpack_require__(44)["default"];
	
	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	
	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();
	
	exports.__esModule = true;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$getOwnPropertyDescriptor = __webpack_require__(188)["default"];
	
	exports["default"] = function get(_x, _x2, _x3) {
	  var _again = true;
	
	  _function: while (_again) {
	    var object = _x,
	        property = _x2,
	        receiver = _x3;
	    desc = parent = getter = undefined;
	    _again = false;
	    if (object === null) object = Function.prototype;
	
	    var desc = _Object$getOwnPropertyDescriptor(object, property);
	
	    if (desc === undefined) {
	      var parent = Object.getPrototypeOf(object);
	
	      if (parent === null) {
	        return undefined;
	      } else {
	        _x = parent;
	        _x2 = property;
	        _x3 = receiver;
	        _again = true;
	        continue _function;
	      }
	    } else if ("value" in desc) {
	      return desc.value;
	    } else {
	      var getter = desc.get;
	
	      if (getter === undefined) {
	        return undefined;
	      }
	
	      return getter.call(receiver);
	    }
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$create = __webpack_require__(187)["default"];
	
	var _Object$setPrototypeOf = __webpack_require__(189)["default"];
	
	exports["default"] = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }
	
	  subClass.prototype = _Object$create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};
	
	exports.__esModule = true;

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = isHook
	
	function isHook(hook) {
	    return hook &&
	      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
	       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
	}


/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = "2"


/***/ },
/* 32 */
/***/ function(module, exports) {

	var nativeIsArray = Array.isArray
	var toString = Object.prototype.toString
	
	module.exports = nativeIsArray || isArray
	
	function isArray(obj) {
	    return toString.call(obj) === "[object Array]"
	}


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	var _Object$assign = __webpack_require__(17)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = input;
	
	var _cycleCore = __webpack_require__(2);
	
	var _cycleDom = __webpack_require__(6);
	
	var typeToEvents = {
	    text: {
	        keyup: 0,
	        input: 0,
	        change: 0
	    },
	    textarea: {
	        keyup: 0,
	        input: 0,
	        change: 0
	    },
	    number: {
	        keyup: 0,
	        input: 0,
	        change: 0
	    },
	    checkbox: {
	        change: 0
	    }
	};
	
	var typeToConverter = {
	    number: Number
	};
	
	function identity(x) {
	    return x;
	}
	
	function maybeDebounce(time) {
	    if (!time) {
	        return identity;
	    }
	    return function (event$) {
	        return event$.debounce(time);
	    };
	}
	
	function eventsByType(DOM, type) {
	    var events = typeToEvents[type];
	    return _cycleCore.Rx.Observable.from(_Object$keys(events)).flatMap(function (event) {
	        return DOM.events(event)['let'](maybeDebounce(events[event]));
	    });
	}
	
	function calculateProps(key, type, value, props) {
	    switch (type) {
	        case 'checkbox':
	            return _Object$assign({
	                key: key,
	                type: type,
	                value: key,
	                checked: value
	            }, props || {});
	        case 'textarea':
	            return _Object$assign({
	                key: key,
	                value: value
	            }, props || {});
	        default:
	            return _Object$assign({
	                key: key,
	                type: type,
	                value: value
	            }, props || {});
	    }
	}
	
	function getValueByType(type) {
	    if (type === 'checkbox') {
	        return function (ev) {
	            return ev.target.checked;
	        };
	    } else {
	        return function (ev) {
	            return ev.target.value;
	        };
	    }
	}
	
	function input(key, type, _ref) {
	    var DOM = _ref.DOM;
	    var inputValue$ = _ref.value$;
	    var _ref$props$ = _ref.props$;
	    var props$ = _ref$props$ === undefined ? _cycleCore.Rx.Observable['return'](null) : _ref$props$;
	
	    var tag = type === 'textarea' ? type : 'input';
	    var selector = tag + '.' + key;
	
	    var newValue$ = eventsByType(DOM.select(selector), type).map(getValueByType(type)).map(typeToConverter[type] || identity);
	
	    var value$ = inputValue$.merge(newValue$);
	
	    props$ = props$.shareReplay(1);
	    var boundValue$ = _cycleCore.Rx.Observable.combineLatest(value$, props$, function (value, props) {
	        if (!props) {
	            return value;
	        }
	        if ('min' in props && value < props.min) {
	            return props.min;
	        }
	        if ('max' in props && value > props.max) {
	            return props.max;
	        }
	        return value;
	    }).distinctUntilChanged().shareReplay(1);
	
	    var vtree$ = _cycleCore.Rx.Observable.combineLatest(boundValue$, props$, function (value, props) {
	        return (0, _cycleDom.h)(selector, calculateProps(key, type, value, props));
	    });
	
	    return {
	        DOM: vtree$,
	        value$: boundValue$
	    };
	}
	
	module.exports = exports['default'];

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(58)()
		? Object.setPrototypeOf
		: __webpack_require__(59);


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(31)
	var isVNode = __webpack_require__(15)
	var isWidget = __webpack_require__(8)
	var isThunk = __webpack_require__(21)
	var isVHook = __webpack_require__(30)
	
	module.exports = VirtualNode
	
	var noProperties = {}
	var noChildren = []
	
	function VirtualNode(tagName, properties, children, key, namespace) {
	    this.tagName = tagName
	    this.properties = properties || noProperties
	    this.children = children || noChildren
	    this.key = key != null ? String(key) : undefined
	    this.namespace = (typeof namespace === "string") ? namespace : null
	
	    var count = (children && children.length) || 0
	    var descendants = 0
	    var hasWidgets = false
	    var hasThunks = false
	    var descendantHooks = false
	    var hooks
	
	    for (var propName in properties) {
	        if (properties.hasOwnProperty(propName)) {
	            var property = properties[propName]
	            if (isVHook(property) && property.unhook) {
	                if (!hooks) {
	                    hooks = {}
	                }
	
	                hooks[propName] = property
	            }
	        }
	    }
	
	    for (var i = 0; i < count; i++) {
	        var child = children[i]
	        if (isVNode(child)) {
	            descendants += child.count || 0
	
	            if (!hasWidgets && child.hasWidgets) {
	                hasWidgets = true
	            }
	
	            if (!hasThunks && child.hasThunks) {
	                hasThunks = true
	            }
	
	            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
	                descendantHooks = true
	            }
	        } else if (!hasWidgets && isWidget(child)) {
	            if (typeof child.destroy === "function") {
	                hasWidgets = true
	            }
	        } else if (!hasThunks && isThunk(child)) {
	            hasThunks = true;
	        }
	    }
	
	    this.count = count + descendants
	    this.hasWidgets = hasWidgets
	    this.hasThunks = hasThunks
	    this.hooks = hooks
	    this.descendantHooks = descendantHooks
	}
	
	VirtualNode.prototype.version = version
	VirtualNode.prototype.type = "VirtualNode"


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _get = __webpack_require__(27)['default'];
	
	var _inherits = __webpack_require__(28)['default'];
	
	var _createClass = __webpack_require__(26)['default'];
	
	var _classCallCheck = __webpack_require__(19)['default'];
	
	var _slicedToArray = __webpack_require__(12)['default'];
	
	var _Object$entries = __webpack_require__(18)['default'];
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = _exports;
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _When = __webpack_require__(76);
	
	var _When2 = _interopRequireDefault(_When);
	
	var owns = Object.prototype.hasOwnProperty;
	
	var UnaryOperationRecord = _immutable2['default'].Record({
	    type: '',
	    value: 0
	}, 'UnaryOperation');
	
	var UnaryOperation = (function (_UnaryOperationRecord) {
	    _inherits(UnaryOperation, _UnaryOperationRecord);
	
	    function UnaryOperation() {
	        _classCallCheck(this, UnaryOperation);
	
	        _get(Object.getPrototypeOf(UnaryOperation.prototype), 'constructor', this).apply(this, arguments);
	    }
	
	    _createClass(UnaryOperation, [{
	        key: 'toString',
	        value: function toString() {
	            return this.type + '(' + this.value + ')';
	        }
	    }]);
	
	    return UnaryOperation;
	})(UnaryOperationRecord);
	
	var BinaryOperationRecord = _immutable2['default'].Record({
	    type: '',
	    left: 0,
	    right: 0
	}, 'BinaryOperation');
	
	var BinaryOperation = (function (_BinaryOperationRecord) {
	    _inherits(BinaryOperation, _BinaryOperationRecord);
	
	    function BinaryOperation() {
	        _classCallCheck(this, BinaryOperation);
	
	        _get(Object.getPrototypeOf(BinaryOperation.prototype), 'constructor', this).apply(this, arguments);
	    }
	
	    _createClass(BinaryOperation, [{
	        key: 'toString',
	        value: function toString() {
	            return '(' + this.left + ' ' + this.type + ' ' + this.right + ')';
	        }
	    }]);
	
	    return BinaryOperation;
	})(BinaryOperationRecord);
	
	var Addition = new BinaryOperation({
	    type: '+'
	});
	var Subtraction = new BinaryOperation({
	    type: '-'
	});
	var Multiplication = new BinaryOperation({
	    type: '*'
	});
	var Division = new BinaryOperation({
	    type: '/'
	});
	var Exponentiate = new BinaryOperation({
	    type: '^'
	});
	var Max = new BinaryOperation({
	    type: 'max'
	});
	var Min = new BinaryOperation({
	    type: 'min'
	});
	var Or = new BinaryOperation({
	    type: 'or'
	});
	var And = new BinaryOperation({
	    type: 'and'
	});
	var Equals = new BinaryOperation({
	    type: '='
	});
	var Floor = new UnaryOperation({
	    type: 'floor'
	});
	var Ceiling = new UnaryOperation({
	    type: 'ceil'
	});
	var Absolute = new UnaryOperation({
	    type: 'abs'
	});
	var Not = new UnaryOperation({
	    type: 'not'
	});
	var LessThanOrEqual = new BinaryOperation({
	    type: '<='
	});
	
	var RandomRecord = new _immutable2['default'].Record({
	    min: 1,
	    max: 1
	});
	
	var Random = (function (_RandomRecord) {
	    _inherits(Random, _RandomRecord);
	
	    function Random() {
	        _classCallCheck(this, Random);
	
	        _get(Object.getPrototypeOf(Random.prototype), 'constructor', this).apply(this, arguments);
	    }
	
	    _createClass(Random, [{
	        key: 'toString',
	        value: function toString() {
	            return 'rand(' + this.min + ', ' + this.max + ')';
	        }
	    }]);
	
	    return Random;
	})(RandomRecord);
	
	function $when(conditions, path, validKeys, type) {
	    if (!conditions || conditions.constructor !== Object) {
	        throw new Error('$when expects an object, got \'' + JSON.stringify(conditions) + '\' (in ' + path + ')');
	    }
	
	    return _Object$entries(conditions).filter(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 1);
	
	        var key = _ref2[0];
	        return key !== 'otherwise';
	    }).reduce(function (acc, _ref3) {
	        var _ref32 = _slicedToArray(_ref3, 2);
	
	        var key = _ref32[0];
	        var value = _ref32[1];
	
	        return acc.setIn(['conditions', key], toEquation(value, path + '.' + key, validKeys, type));
	    }, new _When2['default']({
	        otherwise: toEquation(conditions.otherwise || 0, path + '.otherwise', validKeys, type)
	    }));
	}
	
	var operations = {
	    number: {
	        $inc: function $inc(operand, path, validKeys) {
	            return this.$add([operand, 1], path, validKeys);
	        },
	        $dec: function $dec(operand, path, validKeys) {
	            return this.$sub([operand, 1], path, validKeys);
	        },
	        $add: function $add(operands, path, validKeys) {
	            if (!Array.isArray(operands)) {
	                throw new Error('$add expects an array, got \'' + JSON.stringify(operands) + '\' (in ' + path + ')');
	            }
	            return operands.map(function (o, index) {
	                return toEquation(o, path + '[' + index + ']', validKeys, 'number');
	            }).reduce(function (left, right) {
	                return Addition.merge({
	                    left: left,
	                    right: right
	                });
	            });
	        },
	        $sub: function $sub(operands, path, validKeys) {
	            if (!Array.isArray(operands)) {
	                throw new Error('$sub expects an array, got \'' + JSON.stringify(operands) + '\' (in ' + path + ')');
	            }
	            return operands.map(function (o, index) {
	                return toEquation(o, path + '[' + index + ']', validKeys, 'number');
	            }).reduce(function (left, right) {
	                return Subtraction.merge({
	                    left: left,
	                    right: right
	                });
	            });
	        },
	        $double: function $double(operand, path, validKeys) {
	            return this.$mul([2, operand], path, validKeys);
	        },
	        $mul: function $mul(operands, path, validKeys) {
	            if (!Array.isArray(operands)) {
	                throw new Error('$mul expects an array, got \'' + JSON.stringify(operands) + '\' (in ' + path + ')');
	            }
	            return operands.map(function (o, index) {
	                return toEquation(o, path + '[' + index + ']', validKeys, 'number');
	            }).reduce(function (left, right) {
	                return Multiplication.merge({
	                    left: left,
	                    right: right
	                });
	            });
	        },
	        $max: function $max(operands, path, validKeys) {
	            if (!Array.isArray(operands)) {
	                throw new Error('$max expects an array, got \'' + JSON.stringify(operands) + '\' (in ' + path + ')');
	            }
	            return operands.map(function (o, index) {
	                return toEquation(o, path + '[' + index + ']', validKeys, 'number');
	            }).reduce(function (left, right) {
	                return Max.merge({
	                    left: left,
	                    right: right
	                });
	            });
	        },
	        $min: function $min(operands, path, validKeys) {
	            if (!Array.isArray(operands)) {
	                throw new Error('$min expects an array, got \'' + JSON.stringify(operands) + '\' (in ' + path + ')');
	            }
	            return operands.map(function (o, index) {
	                return toEquation(o, path + '[' + index + ']', validKeys, 'number');
	            }).reduce(function (left, right) {
	                return Min.merge({
	                    left: left,
	                    right: right
	                });
	            });
	        },
	        $floor: function $floor(operand, path, validKeys) {
	            return Floor.set('value', toEquation(operand, path, validKeys, 'number'));
	        },
	        $ceil: function $ceil(operand, path, validKeys) {
	            return Ceiling.set('value', toEquation(operand, path, validKeys, 'number'));
	        },
	        $abs: function $abs(operand, path, validKeys) {
	            return Absolute.set('value', toEquation(operand, path, validKeys, 'number'));
	        },
	        $half: function $half(operand, path, validKeys) {
	            return this.$div([operand, 2], path, validKeys);
	        },
	        $sqrt: function $sqrt(operand, path, validKeys) {
	            return this.$pow([operand, 0.5], path, validKeys);
	        },
	        $pow: function $pow(operands, path, validKeys) {
	            if (!Array.isArray(operands)) {
	                throw new Error('$pow expects an array, got \'' + JSON.stringify(operands) + '\' (in ' + path + ')');
	            }
	            return operands.map(function (o, index) {
	                return toEquation(o, path + '[' + index + ']', validKeys, 'number');
	            }).reduceRight(function (right, left) {
	                return Exponentiate.merge({
	                    left: left,
	                    right: right
	                });
	            });
	        },
	        $div: function $div(operands, path, validKeys) {
	            if (!Array.isArray(operands)) {
	                throw new Error('$div expects an array, got \'' + JSON.stringify(operands) + '\' (in ' + path + ')');
	            }
	            return operands.map(function (o, index) {
	                return toEquation(o, path + '[' + index + ']', validKeys, 'number');
	            }).reduce(function (left, right) {
	                return Division.merge({
	                    left: left,
	                    right: right
	                });
	            });
	        },
	        $rand: function $rand(range, path, validKeys) {
	            if (Array.isArray(range)) {
	                if (range.length !== 2) {
	                    throw new Error('$rand expects an array of length 2, got \'' + range.length + '\' (in ' + path + ')');
	                }
	                return new Random({
	                    min: toEquation(range[0], path + '[0]', validKeys, 'number'),
	                    max: toEquation(range[1], path + '[1]', validKeys, 'number')
	                });
	            }
	
	            return new Random({
	                min: 1,
	                max: toEquation(range, path, validKeys, 'number')
	            });
	        }
	    },
	    boolean: {
	        $some: function $some(operands, path, validKeys) {
	            if (!Array.isArray(operands)) {
	                throw new Error('$some expects an array, got \'' + JSON.stringify(operands) + '\' (in ' + operands + ')');
	            }
	            return operands.map(function (o, index) {
	                return toEquation(o, path + '[index]', validKeys, 'boolean');
	            }).reduce(function (left, right) {
	                return Or.merge({
	                    left: left,
	                    right: right
	                });
	            });
	        }
	    },
	    string: {
	        // $not(values, path, validKeys) {
	        //     if (!Array.isArray(values)) {
	        //         values = [values];
	        //     }
	        //     return values
	        //         .map(value => Not.merge({
	        //             value: Equals.merge({
	        //                 left: left,
	        //                 right:
	        //             })
	        //         })
	        // }
	    },
	    any: {
	        $when: $when
	    }
	};
	
	function convertOperation(key, value, path, validKeys, type) {
	    if (!owns.call(operations, type)) {
	        throw new Error('Unknown operation: \'' + type + '\' (in ' + path + ')');
	    }
	    var typeOperations = operations[type];
	    var anyOperations = operations.any;
	    if (!owns.call(typeOperations, key) && !owns.call(anyOperations, key)) {
	        throw new Error('Unknown operation for ' + type + ': \'' + key + '\' (in ' + path + ')');
	    }
	    if (typeOperations[key]) {
	        return typeOperations[key](value, path, validKeys, type);
	    } else {
	        return anyOperations[key](value, path, validKeys, type);
	    }
	}
	
	function convertRange(key, range, path, validKeys) {
	    var ranges = [range.min != null ? LessThanOrEqual.merge({
	        left: toEquation(range.min, path + '.min', validKeys, 'number'),
	        right: key
	    }) : null, range.max != null ? LessThanOrEqual.merge({
	        left: key,
	        right: toEquation(range.max, path + '.max', validKeys, 'number')
	    }) : null].filter(function (x) {
	        return x;
	    });
	
	    if (ranges.length !== _Object$keys(range).length) {
	        throw new Error('Cannot have more than "min" and "max" on a range (at ' + path + ')');
	    }
	
	    return ranges.reduce(function (left, right) {
	        return And.merge({
	            left: left,
	            right: right
	        });
	    });
	}
	
	var convertCheckByType = {
	    number: function number(key, value, path, validKeys) {
	        if (value && value.constructor === Object && ('min' in value || 'max' in value)) {
	            // { "strength": { "min": 4, "max": 7 } }
	            return convertRange(key, value, path, validKeys);
	        }
	
	        return LessThanOrEqual.merge({
	            left: toEquation(value, path, validKeys, 'number'),
	            right: key
	        });
	    },
	    string: function string(key, value, path, validKeys) {
	        if (typeof value === 'string') {
	            return Equals.merge({
	                left: key,
	                right: value
	            });
	        }
	
	        if (Array.isArray(value)) {
	            return value.map(function (element, index) {
	                return Equals.merge({
	                    left: key,
	                    right: toEquation(element, path + '[' + index + ']', validKeys, 'string')
	                });
	            }).reduce(function (left, right) {
	                return Or.merge({
	                    left: left,
	                    right: right
	                });
	            });
	        }
	
	        if (value != null && value.constructor === Object) {
	            if (value.$not) {
	                if (_Object$keys(value).length !== 1) {
	                    throw new Error('Cannot use "$not" with other keys (at ' + path + ')');
	                }
	                return Not.merge({
	                    value: convertCheck(key, value.$not, path, validKeys)
	                });
	            }
	            return Equals.merge({
	                left: key,
	                right: toEquation(value, path, validKeys, 'string')
	            });
	        }
	        throw new Error('Unable to convert ' + JSON.stringify(value) + ' at ' + path);
	    }
	};
	
	function convertCheck(key, value, path, validKeys) {
	    if (!owns.call(validKeys, key)) {
	        throw new Error('Unknown key: \'' + key + '\' (at ' + path + ')');
	    }
	
	    var type = validKeys[key];
	    return convertCheckByType[type](key, value, path, validKeys);
	}
	
	function convertObject(object, path, validKeys, type) {
	    var keys = _Object$keys(object);
	    var len = keys.length;
	    if (!len) {
	        throw new Error('Expected an object with at least one property (in ' + path + ')');
	    }
	    var conversions = keys.map(function (key) {
	        if (key.charAt(0) === '$') {
	            return convertOperation(key, object[key], path + '.' + key, validKeys, type);
	        } else if (type === 'boolean') {
	            return convertCheck(key, object[key], path + '.' + key, validKeys);
	        } else {
	            throw new Error('Unexpected key \'' + key + '\' in ' + path);
	        }
	    });
	    if (conversions.length === 1) {
	        return conversions[0];
	    }
	    if (type !== 'boolean') {
	        throw new Error('Expected object to only have one property (in ' + path + ')');
	    }
	    return conversions.reduce(function (left, right) {
	        return And.merge({
	            left: left,
	            right: right
	        });
	    });
	}
	
	var VALID_TYPES = {
	    number: true,
	    boolean: true,
	    string: true,
	    any: true
	};
	
	function toEquation(value, path, validKeys, type) {
	    if (typeof path !== 'string') {
	        throw new TypeError('Expected ' + path + ' to be a string');
	    }
	    if (validKeys == null) {
	        throw new TypeError('Expected validKeys to be an object');
	    }
	    var valueType = typeof value;
	    if (valueType === 'string') {
	        if (!owns.call(validKeys, value)) {
	            throw new Error('Unknown value \'' + value + '\' at ' + path);
	        }
	        return value;
	    }
	    if (VALID_TYPES[valueType]) {
	        if (typeof value !== type) {
	            throw new TypeError('Expected ' + value + ' to be a ' + type + ', got ' + typeof value + ' (at ' + path + ')');
	        }
	        return value;
	    }
	    if (!VALID_TYPES[type]) {
	        throw new Error('Unknown type: \'' + type + '\'');
	    }
	    if (value && value.constructor === Object) {
	        return convertObject(value, path, validKeys, type);
	    }
	    if (type === 'boolean' && value == null) {
	        return true;
	    }
	    throw new Error('Unable to convert \'' + JSON.stringify(value) + '\' to an equation (in ' + path + ')');
	}
	
	function simplify(equation) {
	    if (Object(equation) !== equation) {
	        return equation;
	    }
	    if (typeof equation.simplify === 'function') {
	        return equation.simplify();
	    }
	    return equation;
	}
	
	function _exports(value, path, validKeys, type) {
	    return simplify(toEquation(value, path, validKeys, type));
	}
	
	_exports.Not = Not;
	_exports.Or = Or;
	_exports.Equals = Equals;
	_exports.LessThanOrEqual = LessThanOrEqual;
	_exports.BinaryOperation = BinaryOperation;
	_exports.UnaryOperation = UnaryOperation;
	
	function replace(value, from, to) {
	    if (value === from || _immutable2['default'].is(value, from)) {
	        return to;
	    } else if (value instanceof BinaryOperation) {
	        return value.merge({
	            left: replace(value.left, from, to),
	            right: replace(value.right, from, to)
	        });
	    } else if (value instanceof UnaryOperation) {
	        return value.set('value', replace(value.value, from, to));
	    } else {
	        return value;
	    }
	}
	_exports.replace = replace;
	module.exports = exports['default'];

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(9)
	  , createDesc = __webpack_require__(90);
	module.exports = __webpack_require__(217) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(110)()
		? Object.assign
		: __webpack_require__(111);


/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict';
	
	var toString = Object.prototype.toString
	
	  , id = toString.call('');
	
	module.exports = function (x) {
		return (typeof x === 'string') || (x && (typeof x === 'object') &&
			((x instanceof String) || (toString.call(x) === id))) || false;
	};


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var clear    = __webpack_require__(56)
	  , assign   = __webpack_require__(38)
	  , callable = __webpack_require__(14)
	  , value    = __webpack_require__(7)
	  , d        = __webpack_require__(11)
	  , autoBind = __webpack_require__(102)
	  , Symbol   = __webpack_require__(41)
	
	  , defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , Iterator;
	
	module.exports = Iterator = function (list, context) {
		if (!(this instanceof Iterator)) return new Iterator(list, context);
		defineProperties(this, {
			__list__: d('w', value(list)),
			__context__: d('w', context),
			__nextIndex__: d('w', 0)
		});
		if (!context) return;
		callable(context.on);
		context.on('_add', this._onAdd);
		context.on('_delete', this._onDelete);
		context.on('_clear', this._onClear);
	};
	
	defineProperties(Iterator.prototype, assign({
		constructor: d(Iterator),
		_next: d(function () {
			var i;
			if (!this.__list__) return;
			if (this.__redo__) {
				i = this.__redo__.shift();
				if (i !== undefined) return i;
			}
			if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
			this._unBind();
		}),
		next: d(function () { return this._createResult(this._next()); }),
		_createResult: d(function (i) {
			if (i === undefined) return { done: true, value: undefined };
			return { done: false, value: this._resolve(i) };
		}),
		_resolve: d(function (i) { return this.__list__[i]; }),
		_unBind: d(function () {
			this.__list__ = null;
			delete this.__redo__;
			if (!this.__context__) return;
			this.__context__.off('_add', this._onAdd);
			this.__context__.off('_delete', this._onDelete);
			this.__context__.off('_clear', this._onClear);
			this.__context__ = null;
		}),
		toString: d(function () { return '[object Iterator]'; })
	}, autoBind({
		_onAdd: d(function (index) {
			if (index >= this.__nextIndex__) return;
			++this.__nextIndex__;
			if (!this.__redo__) {
				defineProperty(this, '__redo__', d('c', [index]));
				return;
			}
			this.__redo__.forEach(function (redo, i) {
				if (redo >= index) this.__redo__[i] = ++redo;
			}, this);
			this.__redo__.push(index);
		}),
		_onDelete: d(function (index) {
			var i;
			if (index >= this.__nextIndex__) return;
			--this.__nextIndex__;
			if (!this.__redo__) return;
			i = this.__redo__.indexOf(index);
			if (i !== -1) this.__redo__.splice(i, 1);
			this.__redo__.forEach(function (redo, i) {
				if (redo > index) this.__redo__[i] = --redo;
			}, this);
		}),
		_onClear: d(function () {
			if (this.__redo__) clear.call(this.__redo__);
			this.__nextIndex__ = 0;
		})
	})));
	
	defineProperty(Iterator.prototype, Symbol.iterator, d(function () {
		return this;
	}));
	defineProperty(Iterator.prototype, Symbol.toStringTag, d('', 'Iterator'));


/***/ },
/* 41 */
[234, 128, 130],
/* 42 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = SoftSetHook;
	
	function SoftSetHook(value) {
	    if (!(this instanceof SoftSetHook)) {
	        return new SoftSetHook(value);
	    }
	
	    this.value = value;
	}
	
	SoftSetHook.prototype.hook = function (node, propertyName) {
	    if (node[propertyName] !== this.value) {
	        node[propertyName] = this.value;
	    }
	};


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(31)
	
	module.exports = VirtualText
	
	function VirtualText(text) {
	    this.text = String(text)
	}
	
	VirtualText.prototype.version = version
	VirtualText.prototype.type = "VirtualText"


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(197), __esModule: true };

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(86);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 47 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var UNDEFINED = 'undefined';
	var global = module.exports = typeof window != UNDEFINED && window.Math == Math
	  ? window : typeof self != UNDEFINED && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(85)
	  , defined = __webpack_require__(46);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(46);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(216)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(87)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var _require = __webpack_require__(2);
	
	var Rx = _require.Rx;
	
	var ALL_PROPS = "*";
	var PROPS_DRIVER_NAME = "props";
	var EVENTS_SINK_NAME = "events";
	
	function makeDispatchFunction(element, eventName) {
	  return function dispatchCustomEvent(evData) {
	    //console.log(`%cdispatchCustomEvent ` + eventName,
	    //  `background-color: #CCCCFF; color: black`);
	    var event = undefined;
	    try {
	      event = new Event(eventName);
	    } catch (err) {
	      event = document.createEvent("Event");
	      event.initEvent(eventName, true, true);
	    }
	    event.detail = evData;
	    element.dispatchEvent(event);
	  };
	}
	
	function subscribeDispatchers(element) {
	  var customEvents = element.cycleCustomElementMetadata.customEvents;
	
	  var disposables = new Rx.CompositeDisposable();
	  for (var _name in customEvents) {
	    if (customEvents.hasOwnProperty(_name) && typeof customEvents[_name].subscribe === "function") {
	      var disposable = customEvents[_name].subscribe(makeDispatchFunction(element, _name));
	      disposables.add(disposable);
	    }
	  }
	  return disposables;
	}
	
	function subscribeDispatchersWhenRootChanges(metadata) {
	  return metadata.rootElem$.distinctUntilChanged(Rx.helpers.identity, function (x, y) {
	    return x && y && x.isEqualNode && x.isEqualNode(y);
	  }).subscribe(function resubscribeDispatchers(rootElem) {
	    if (metadata.eventDispatchingSubscription) {
	      metadata.eventDispatchingSubscription.dispose();
	    }
	    metadata.eventDispatchingSubscription = subscribeDispatchers(rootElem);
	  });
	}
	
	function subscribeEventDispatchingSink(element, widget) {
	  element.cycleCustomElementMetadata.eventDispatchingSubscription = subscribeDispatchers(element);
	  widget.disposables.add(element.cycleCustomElementMetadata.eventDispatchingSubscription);
	  widget.disposables.add(subscribeDispatchersWhenRootChanges(element.cycleCustomElementMetadata));
	}
	
	function makePropertiesDriver() {
	  var propertiesDriver = {};
	  var defaultComparer = Rx.helpers.defaultComparer;
	  Object.defineProperty(propertiesDriver, "type", {
	    enumerable: false,
	    value: "PropertiesDriver"
	  });
	  Object.defineProperty(propertiesDriver, "get", {
	    enumerable: false,
	    value: function get(streamKey) {
	      var comparer = arguments.length <= 1 || arguments[1] === undefined ? defaultComparer : arguments[1];
	
	      if (typeof streamKey === "undefined") {
	        throw new Error("Custom element driver `props.get()` expects an " + "argument in the getter.");
	      }
	      if (typeof this[streamKey] === "undefined") {
	        this[streamKey] = new Rx.ReplaySubject(1);
	      }
	      return this[streamKey].distinctUntilChanged(Rx.helpers.identity, comparer);
	    }
	  });
	  Object.defineProperty(propertiesDriver, "getAll", {
	    enumerable: false,
	    value: function getAll() {
	      return this.get(ALL_PROPS);
	    }
	  });
	  return propertiesDriver;
	}
	
	function createContainerElement(tagName, vtreeProperties) {
	  var element = document.createElement("div");
	  element.id = vtreeProperties.id || "";
	  element.className = vtreeProperties.className || "";
	  element.className += " cycleCustomElement-" + tagName.toUpperCase();
	  element.className = element.className.trim();
	  element.cycleCustomElementMetadata = {
	    propertiesDriver: null,
	    rootElem$: null,
	    customEvents: null,
	    eventDispatchingSubscription: false
	  };
	  return element;
	}
	
	function throwIfVTreeHasPropertyChildren(vtree) {
	  if (typeof vtree.properties.children !== "undefined") {
	    throw new Error("Custom element should not have property `children`. " + "It is reserved for children elements nested into this custom element.");
	  }
	}
	
	function makeCustomElementInput(domOutput, propertiesDriver, domDriverName) {
	  var _ref;
	
	  return (_ref = {}, _defineProperty(_ref, domDriverName, domOutput), _defineProperty(_ref, PROPS_DRIVER_NAME, propertiesDriver), _ref);
	}
	
	function makeConstructor() {
	  return function customElementConstructor(vtree, CERegistry, driverName) {
	    //console.log(`%cnew (constructor) custom element ` + vtree.tagName,
	    //  `color: #880088`)
	    throwIfVTreeHasPropertyChildren(vtree);
	    this.type = "Widget";
	    this.properties = vtree.properties;
	    this.properties.children = vtree.children;
	    this.key = vtree.key;
	    this.isCustomElementWidget = true;
	    this.customElementsRegistry = CERegistry;
	    this.driverName = driverName;
	    this.firstRootElem$ = new Rx.ReplaySubject(1);
	    this.disposables = new Rx.CompositeDisposable();
	  };
	}
	
	function validateDefFnOutput(defFnOutput, domDriverName, tagName) {
	  if (typeof defFnOutput !== "object") {
	    throw new Error("Custom element definition function for `" + tagName + "` " + " should output an object.");
	  }
	  if (typeof defFnOutput[domDriverName] === "undefined") {
	    throw new Error("Custom element definition function for '" + tagName + "' " + ("should output an object containing `" + domDriverName + "`."));
	  }
	  if (typeof defFnOutput[domDriverName].subscribe !== "function") {
	    throw new Error("Custom element definition function for `" + tagName + "` " + "should output an object containing an Observable of VTree, named " + ("`" + domDriverName + "`."));
	  }
	  for (var _name2 in defFnOutput) {
	    if (defFnOutput.hasOwnProperty(_name2) && _name2 !== domDriverName && _name2 !== EVENTS_SINK_NAME) {
	      throw new Error("Unknown `" + _name2 + "` found on custom element " + ("`" + tagName + "`s definition function's output."));
	    }
	  }
	}
	
	function makeInit(tagName, definitionFn) {
	  var _require2 = __webpack_require__(53);
	
	  var makeDOMDriverWithRegistry = _require2.makeDOMDriverWithRegistry;
	
	  return function initCustomElement() {
	    //console.log(`%cInit() custom element ` + tagName, `color: #880088`)
	    var widget = this;
	    var driverName = widget.driverName;
	    var registry = widget.customElementsRegistry;
	    var element = createContainerElement(tagName, widget.properties);
	    var proxyVTree$ = new Rx.ReplaySubject(1);
	    var domDriver = makeDOMDriverWithRegistry(element, registry);
	    var propertiesDriver = makePropertiesDriver();
	    var domResponse = domDriver(proxyVTree$, driverName);
	    var rootElem$ = domResponse.select(":root").observable;
	    rootElem$.subscribe(function (rootElem) {
	      // This is expected to happen before initCustomElement() returns `element`
	      element = rootElem;
	    });
	    var defFnInput = makeCustomElementInput(domResponse, propertiesDriver, driverName);
	    var requests = definitionFn(defFnInput);
	    validateDefFnOutput(requests, driverName, tagName);
	    widget.disposables.add(requests[driverName].subscribe(proxyVTree$.asObserver()));
	    widget.disposables.add(rootElem$.subscribe(widget.firstRootElem$.asObserver()));
	    element.cycleCustomElementMetadata = {
	      propertiesDriver: propertiesDriver,
	      rootElem$: rootElem$,
	      customEvents: requests.events,
	      eventDispatchingSubscription: false
	    };
	    subscribeEventDispatchingSink(element, widget);
	    widget.disposables.add(widget.firstRootElem$);
	    widget.disposables.add(proxyVTree$);
	    widget.disposables.add(domResponse);
	    widget.update(null, element);
	    return element;
	  };
	}
	
	function validatePropertiesDriverInMetadata(element, fnName) {
	  if (!element) {
	    throw new Error("Missing DOM element when calling `" + fnName + "` on " + "custom element Widget.");
	  }
	  if (!element.cycleCustomElementMetadata) {
	    throw new Error("Missing custom element metadata on DOM element when " + ("calling `" + fnName + "` on custom element Widget."));
	  }
	  var metadata = element.cycleCustomElementMetadata;
	  if (metadata.propertiesDriver.type !== "PropertiesDriver") {
	    throw new Error("Custom element metadata's propertiesDriver type is " + ("invalid: `" + metadata.propertiesDriver.type + "`."));
	  }
	}
	
	function updateCustomElement(previous, element) {
	  if (previous) {
	    this.disposables = previous.disposables;
	    this.firstRootElem$.onNext(0);
	    this.firstRootElem$.onCompleted();
	  }
	  validatePropertiesDriverInMetadata(element, "update()");
	
	  //console.log(`%cupdate() ${element.className}`, `color: #880088`)
	  var propsDriver = element.cycleCustomElementMetadata.propertiesDriver;
	  if (propsDriver.hasOwnProperty(ALL_PROPS)) {
	    propsDriver[ALL_PROPS].onNext(this.properties);
	  }
	  for (var prop in propsDriver) {
	    if (propsDriver.hasOwnProperty(prop) && this.properties.hasOwnProperty(prop)) {
	      propsDriver[prop].onNext(this.properties[prop]);
	    }
	  }
	}
	
	function destroyCustomElement(element) {
	  //console.log(`%cdestroy() custom el ${element.className}`, `color: #808`)
	  // Dispose propertiesDriver
	  var propsDriver = element.cycleCustomElementMetadata.propertiesDriver;
	  for (var prop in propsDriver) {
	    if (propsDriver.hasOwnProperty(prop)) {
	      this.disposables.add(propsDriver[prop]);
	    }
	  }
	  if (element.cycleCustomElementMetadata.eventDispatchingSubscription) {
	    // This subscription has to be disposed.
	    // Because disposing subscribeDispatchersWhenRootChanges only
	    // is not enough.
	    this.disposables.add(element.cycleCustomElementMetadata.eventDispatchingSubscription);
	  }
	  this.disposables.dispose();
	}
	
	function makeWidgetClass(tagName, definitionFn) {
	  if (typeof definitionFn !== "function") {
	    throw new Error("A custom element definition given to the DOM driver " + "should be a function.");
	  }
	
	  var WidgetClass = makeConstructor();
	  WidgetClass.definitionFn = definitionFn; // needed by renderAsHTML
	  WidgetClass.prototype.init = makeInit(tagName, definitionFn);
	  WidgetClass.prototype.update = updateCustomElement;
	  WidgetClass.prototype.destroy = destroyCustomElement;
	  return WidgetClass;
	}
	
	module.exports = {
	  makeDispatchFunction: makeDispatchFunction,
	  subscribeDispatchers: subscribeDispatchers,
	  subscribeDispatchersWhenRootChanges: subscribeDispatchersWhenRootChanges,
	  makePropertiesDriver: makePropertiesDriver,
	  createContainerElement: createContainerElement,
	  throwIfVTreeHasPropertyChildren: throwIfVTreeHasPropertyChildren,
	  makeConstructor: makeConstructor,
	  makeInit: makeInit,
	  updateCustomElement: updateCustomElement,
	  destroyCustomElement: destroyCustomElement,
	
	  ALL_PROPS: ALL_PROPS,
	  makeCustomElementInput: makeCustomElementInput,
	  makeWidgetClass: makeWidgetClass
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _require = __webpack_require__(51);
	
	var makeWidgetClass = _require.makeWidgetClass;
	
	var Map = Map || __webpack_require__(97); // eslint-disable-line no-native-reassign
	
	function replaceCustomElementsWithSomething(vtree, registry, toSomethingFn) {
	  // Silently ignore corner cases
	  if (!vtree) {
	    return vtree;
	  }
	  var tagName = (vtree.tagName || "").toUpperCase();
	  // Replace vtree itself
	  if (tagName && registry.has(tagName)) {
	    var WidgetClass = registry.get(tagName);
	    return toSomethingFn(vtree, WidgetClass);
	  }
	  // Or replace children recursively
	  if (Array.isArray(vtree.children)) {
	    for (var i = vtree.children.length - 1; i >= 0; i--) {
	      vtree.children[i] = replaceCustomElementsWithSomething(vtree.children[i], registry, toSomethingFn);
	    }
	  }
	  return vtree;
	}
	
	function makeCustomElementsRegistry(definitions) {
	  var registry = new Map();
	  for (var tagName in definitions) {
	    if (definitions.hasOwnProperty(tagName)) {
	      registry.set(tagName.toUpperCase(), makeWidgetClass(tagName, definitions[tagName]));
	    }
	  }
	  return registry;
	}
	
	module.exports = {
	  replaceCustomElementsWithSomething: replaceCustomElementsWithSomething,
	  makeCustomElementsRegistry: makeCustomElementsRegistry
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();
	
	var _require = __webpack_require__(2);
	
	var Rx = _require.Rx;
	
	var VDOM = {
	  h: __webpack_require__(55),
	  diff: __webpack_require__(152),
	  patch: __webpack_require__(157),
	  parse: typeof window !== "undefined" ? __webpack_require__(138) : function () {}
	};
	
	var _require2 = __webpack_require__(52);
	
	var replaceCustomElementsWithSomething = _require2.replaceCustomElementsWithSomething;
	var makeCustomElementsRegistry = _require2.makeCustomElementsRegistry;
	
	var _require3 = __webpack_require__(54);
	
	var transposeVTree = _require3.transposeVTree;
	
	var matchesSelector = undefined;
	// Try-catch to prevent unnecessary import of DOM-specifics in Node.js env:
	try {
	  matchesSelector = __webpack_require__(137);
	} catch (err) {
	  matchesSelector = function () {};
	}
	
	function isElement(obj) {
	  return typeof HTMLElement === "object" ? obj instanceof HTMLElement || obj instanceof DocumentFragment : //DOM2
	  obj && typeof obj === "object" && obj !== null && (obj.nodeType === 1 || obj.nodeType === 11) && typeof obj.nodeName === "string";
	}
	
	function fixRootElem$(rawRootElem$, domContainer) {
	  // Create rootElem stream and automatic className correction
	  var originalClasses = (domContainer.className || "").trim().split(/\s+/);
	  var originalId = domContainer.id;
	  //console.log('%coriginalClasses: ' + originalClasses, 'color: lightgray')
	  return rawRootElem$.map(function fixRootElemClassNameAndId(rootElem) {
	    var previousClasses = rootElem.className.trim().split(/\s+/);
	    var missingClasses = originalClasses.filter(function (clss) {
	      return previousClasses.indexOf(clss) < 0;
	    });
	    var classes = previousClasses.length > 0 ? previousClasses.concat(missingClasses) : missingClasses;
	    //console.log('%cfixRootElemClassName(), missingClasses: ' +
	    //  missingClasses, 'color: lightgray')
	    rootElem.className = classes.join(" ").trim();
	    if (originalId) {
	      rootElem.id = originalId;
	    }
	    //console.log('%c  result: ' + rootElem.className, 'color: lightgray')
	    //console.log('%cEmit rootElem$ ' + rootElem.tagName + '.' +
	    //  rootElem.className, 'color: #009988')
	    return rootElem;
	  });
	}
	
	function isVTreeCustomElement(vtree) {
	  return vtree.type === "Widget" && vtree.isCustomElementWidget;
	}
	
	function makeReplaceCustomElementsWithWidgets(CERegistry, driverName) {
	  return function replaceCustomElementsWithWidgets(vtree) {
	    return replaceCustomElementsWithSomething(vtree, CERegistry, function (_vtree, WidgetClass) {
	      return new WidgetClass(_vtree, CERegistry, driverName);
	    });
	  };
	}
	
	function getArrayOfAllWidgetFirstRootElem$(vtree) {
	  if (vtree.type === "Widget" && vtree.firstRootElem$) {
	    return [vtree.firstRootElem$];
	  }
	  // Or replace children recursively
	  var array = [];
	  if (Array.isArray(vtree.children)) {
	    for (var i = vtree.children.length - 1; i >= 0; i--) {
	      array = array.concat(getArrayOfAllWidgetFirstRootElem$(vtree.children[i]));
	    }
	  }
	  return array;
	}
	
	function checkRootVTreeNotCustomElement(vtree) {
	  if (isVTreeCustomElement(vtree)) {
	    throw new Error("Illegal to use a Cycle custom element as the root of " + "a View.");
	  }
	}
	
	function isRootForCustomElement(rootElem) {
	  return !!rootElem.cycleCustomElementMetadata;
	}
	
	function wrapTopLevelVTree(vtree, rootElem) {
	  if (isRootForCustomElement(rootElem)) {
	    return vtree;
	  }
	
	  var _vtree$properties$id = vtree.properties.id;
	  var vtreeId = _vtree$properties$id === undefined ? "" : _vtree$properties$id;
	  var _vtree$properties$className = vtree.properties.className;
	  var vtreeClass = _vtree$properties$className === undefined ? "" : _vtree$properties$className;
	
	  var sameId = vtreeId === rootElem.id;
	  var sameClass = vtreeClass === rootElem.className;
	  var sameTagName = vtree.tagName.toUpperCase() === rootElem.tagName;
	  if (sameId && sameClass && sameTagName) {
	    return vtree;
	  }
	  var attrs = {};
	  if (rootElem.id) {
	    attrs.id = rootElem.id;
	  }
	  if (rootElem.className) {
	    attrs.className = rootElem.className;
	  }
	  return VDOM.h(rootElem.tagName, attrs, [vtree]);
	}
	
	function makeDiffAndPatchToElement$(rootElem) {
	  return function diffAndPatchToElement$(_ref) {
	    var _ref2 = _slicedToArray(_ref, 2);
	
	    var oldVTree = _ref2[0];
	    var newVTree = _ref2[1];
	
	    if (typeof newVTree === "undefined") {
	      return Rx.Observable.empty();
	    }
	
	    //let isCustomElement = isRootForCustomElement(rootElem)
	    //let k = isCustomElement ? ' is custom element ' : ' is top level'
	    var prevVTree = wrapTopLevelVTree(oldVTree, rootElem);
	    var nextVTree = wrapTopLevelVTree(newVTree, rootElem);
	    var waitForChildrenStreams = getArrayOfAllWidgetFirstRootElem$(nextVTree);
	    var rootElemAfterChildrenFirstRootElem$ = Rx.Observable.combineLatest(waitForChildrenStreams, function () {
	      //console.log('%crawRootElem$ emits. (1)' + k, 'color: #008800')
	      return rootElem;
	    });
	    var cycleCustomElementMetadata = rootElem.cycleCustomElementMetadata;
	    //console.log('%cVDOM diff and patch START' + k, 'color: #636300')
	    /* eslint-disable */
	    rootElem = VDOM.patch(rootElem, VDOM.diff(prevVTree, nextVTree));
	    /* eslint-enable */
	    //console.log('%cVDOM diff and patch END' + k, 'color: #636300')
	    if (cycleCustomElementMetadata) {
	      rootElem.cycleCustomElementMetadata = cycleCustomElementMetadata;
	    }
	    if (waitForChildrenStreams.length === 0) {
	      //console.log('%crawRootElem$ emits. (2)' + k, 'color: #008800')
	      return Rx.Observable.just(rootElem);
	    }
	    //console.log('%crawRootElem$ waiting children.' + k, 'color: #008800')
	    return rootElemAfterChildrenFirstRootElem$;
	  };
	}
	
	function renderRawRootElem$(vtree$, domContainer, _ref3) {
	  var CERegistry = _ref3.CERegistry;
	  var driverName = _ref3.driverName;
	
	  var diffAndPatchToElement$ = makeDiffAndPatchToElement$(domContainer);
	  return vtree$.flatMapLatest(transposeVTree).startWith(VDOM.parse(domContainer)).map(makeReplaceCustomElementsWithWidgets(CERegistry, driverName)).doOnNext(checkRootVTreeNotCustomElement).pairwise().flatMap(diffAndPatchToElement$);
	}
	
	function makeRootElemToEvent$(selector, eventName) {
	  return function rootElemToEvent$(rootElem) {
	    if (!rootElem) {
	      return Rx.Observable.empty();
	    }
	    var targetElements = matchesSelector(rootElem, selector) ? rootElem : rootElem.querySelectorAll(selector);
	    return Rx.Observable.fromEvent(targetElements, eventName);
	  };
	}
	
	function makeResponseGetter(rootElem$) {
	  return function get(selector, eventName) {
	    if (console && console.log) {
	      console.log("WARNING: the DOM Driver's get(selector, eventType) is " + "deprecated. Use select(selector).events(eventType) instead.");
	    }
	    if (typeof selector !== "string") {
	      throw new Error("DOM driver's get() expects first argument to be a " + "string as a CSS selector");
	    }
	    if (selector.trim() === ":root") {
	      return rootElem$;
	    }
	    if (typeof eventName !== "string") {
	      throw new Error("DOM driver's get() expects second argument to be a " + "string representing the event type to listen for.");
	    }
	
	    return rootElem$.flatMapLatest(makeRootElemToEvent$(selector, eventName)).share();
	  };
	}
	
	function makeEventsSelector(element$) {
	  return function events(eventName) {
	    if (typeof eventName !== "string") {
	      throw new Error("DOM driver's get() expects second argument to be a " + "string representing the event type to listen for.");
	    }
	    return element$.flatMapLatest(function (element) {
	      if (!element) {
	        return Rx.Observable.empty();
	      }
	      return Rx.Observable.fromEvent(element, eventName);
	    }).share();
	  };
	}
	
	function makeElementSelector(rootElem$) {
	  return function select(selector) {
	    if (typeof selector !== "string") {
	      throw new Error("DOM driver's select() expects first argument to be a " + "string as a CSS selector");
	    }
	    var element$ = selector.trim() === ":root" ? rootElem$ : rootElem$.map(function (rootElem) {
	      if (matchesSelector(rootElem, selector)) {
	        return rootElem;
	      } else {
	        return rootElem.querySelectorAll(selector);
	      }
	    });
	    return {
	      observable: element$,
	      events: makeEventsSelector(element$)
	    };
	  };
	}
	
	function validateDOMDriverInput(vtree$) {
	  if (!vtree$ || typeof vtree$.subscribe !== "function") {
	    throw new Error("The DOM driver function expects as input an " + "Observable of virtual DOM elements");
	  }
	}
	
	function makeDOMDriverWithRegistry(container, CERegistry) {
	  return function domDriver(vtree$, driverName) {
	    validateDOMDriverInput(vtree$);
	    var rawRootElem$ = renderRawRootElem$(vtree$, container, { CERegistry: CERegistry, driverName: driverName });
	    if (!isRootForCustomElement(container)) {
	      rawRootElem$ = rawRootElem$.startWith(container);
	    }
	    var rootElem$ = fixRootElem$(rawRootElem$, container).replay(null, 1);
	    var disposable = rootElem$.connect();
	    return {
	      get: makeResponseGetter(rootElem$),
	      select: makeElementSelector(rootElem$),
	      dispose: disposable.dispose.bind(disposable)
	    };
	  };
	}
	
	function makeDOMDriver(container) {
	  var customElementDefinitions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  // Find and prepare the container
	  var domContainer = typeof container === "string" ? document.querySelector(container) : container;
	  // Check pre-conditions
	  if (typeof container === "string" && domContainer === null) {
	    throw new Error("Cannot render into unknown element `" + container + "`");
	  } else if (!isElement(domContainer)) {
	    throw new Error("Given container is not a DOM element neither a selector " + "string.");
	  }
	
	  var registry = makeCustomElementsRegistry(customElementDefinitions);
	  return makeDOMDriverWithRegistry(domContainer, registry);
	}
	
	module.exports = {
	  isElement: isElement,
	  fixRootElem$: fixRootElem$,
	  isVTreeCustomElement: isVTreeCustomElement,
	  makeReplaceCustomElementsWithWidgets: makeReplaceCustomElementsWithWidgets,
	  getArrayOfAllWidgetFirstRootElem$: getArrayOfAllWidgetFirstRootElem$,
	  isRootForCustomElement: isRootForCustomElement,
	  wrapTopLevelVTree: wrapTopLevelVTree,
	  checkRootVTreeNotCustomElement: checkRootVTreeNotCustomElement,
	  makeDiffAndPatchToElement$: makeDiffAndPatchToElement$,
	  renderRawRootElem$: renderRawRootElem$,
	  makeResponseGetter: makeResponseGetter,
	  validateDOMDriverInput: validateDOMDriverInput,
	  makeDOMDriverWithRegistry: makeDOMDriverWithRegistry,
	
	  makeDOMDriver: makeDOMDriver
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _require = __webpack_require__(2);
	
	var Rx = _require.Rx;
	
	var VirtualNode = __webpack_require__(35);
	
	/**
	 * Converts a tree of VirtualNode|Observable<VirtualNode> into
	 * Observable<VirtualNode>.
	 */
	function transposeVTree(vtree) {
	  if (typeof vtree.subscribe === "function") {
	    return vtree.flatMap(transposeVTree);
	  } else if (vtree.type === "VirtualText") {
	    return Rx.Observable.just(vtree);
	  } else if (vtree.type === "VirtualNode" && Array.isArray(vtree.children) && vtree.children.length > 0) {
	    return Rx.Observable.combineLatest(vtree.children.map(transposeVTree), function () {
	      for (var _len = arguments.length, arr = Array(_len), _key = 0; _key < _len; _key++) {
	        arr[_key] = arguments[_key];
	      }
	
	      return new VirtualNode(vtree.tagName, vtree.properties, arr, vtree.key, vtree.namespace);
	    });
	  } else if (vtree.type === "VirtualNode" || vtree.type === "Widget") {
	    return Rx.Observable.just(vtree);
	  } else {
	    throw new Error("Unhandled case in transposeVTree()");
	  }
	}
	
	module.exports = {
	  transposeVTree: transposeVTree
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable */
	'use strict';
	
	var isArray = __webpack_require__(32);
	
	var VNode = __webpack_require__(35);
	var VText = __webpack_require__(43);
	var isVNode = __webpack_require__(15);
	var isVText = __webpack_require__(22);
	var isWidget = __webpack_require__(8);
	var isHook = __webpack_require__(30);
	var isVThunk = __webpack_require__(21);
	
	var parseTag = __webpack_require__(69);
	var softSetHook = __webpack_require__(42);
	var evHook = __webpack_require__(68);
	
	module.exports = h;
	
	function h(tagName, properties, children) {
	  var childNodes = [];
	  var tag, props, key, namespace;
	
	  if (!children && isChildren(properties)) {
	    children = properties;
	    props = {};
	  }
	
	  props = props || properties || {};
	  tag = parseTag(tagName, props);
	
	  // support keys
	  if (props.hasOwnProperty('key')) {
	    key = props.key;
	    props.key = undefined;
	  }
	
	  // support namespace
	  if (props.hasOwnProperty('namespace')) {
	    namespace = props.namespace;
	    props.namespace = undefined;
	  }
	
	  // fix cursor bug
	  if (tag === 'INPUT' && !namespace && props.hasOwnProperty('value') && props.value !== undefined && !isHook(props.value)) {
	    props.value = softSetHook(props.value);
	  }
	
	  transformProperties(props);
	
	  if (children !== undefined && children !== null) {
	    addChild(children, childNodes, tag, props);
	  }
	
	  return new VNode(tag, props, childNodes, key, namespace);
	}
	
	function addChild(c, childNodes, tag, props) {
	  if (typeof c === 'string') {
	    childNodes.push(new VText(c));
	  } else if (typeof c === 'number') {
	    childNodes.push(new VText(String(c)));
	  } else if (isChild(c)) {
	    childNodes.push(c);
	  } else if (isArray(c)) {
	    for (var i = 0; i < c.length; i++) {
	      addChild(c[i], childNodes, tag, props);
	    }
	  } else if (c === null || c === undefined) {
	    return;
	  } else {
	    throw UnexpectedVirtualElement({
	      foreignObject: c,
	      parentVnode: {
	        tagName: tag,
	        properties: props
	      }
	    });
	  }
	}
	
	function transformProperties(props) {
	  for (var propName in props) {
	    if (props.hasOwnProperty(propName)) {
	      var value = props[propName];
	
	      if (isHook(value)) {
	        continue;
	      }
	
	      if (propName.substr(0, 3) === 'ev-') {
	        // add ev-foo support
	        props[propName] = evHook(value);
	      }
	    }
	  }
	}
	
	// START Cycle.js-specific code >>>>>>>>
	function isObservable(x) {
	  return x && typeof x.subscribe === 'function';
	}
	
	function isChild(x) {
	  return isVNode(x) || isVText(x) || isObservable(x) || isWidget(x) || isVThunk(x);
	}
	// END Cycle.js-specific code <<<<<<<<<<
	
	function isChildren(x) {
	  return typeof x === 'string' || isArray(x) || isChild(x);
	}
	
	function UnexpectedVirtualElement(data) {
	  var err = new Error();
	
	  err.type = 'virtual-hyperscript.unexpected.virtual-element';
	  err.message = 'Unexpected virtual child passed to h().\n' + 'Expected a VNode / Vthunk / VWidget / string but:\n' + 'got:\n' + errorString(data.foreignObject) + '.\n' + 'The parent vnode is:\n' + errorString(data.parentVnode);
	  '\n' + 'Suggested fix: change your `h(..., [ ... ])` callsite.';
	  err.foreignObject = data.foreignObject;
	  err.parentVnode = data.parentVnode;
	
	  return err;
	}
	
	function errorString(obj) {
	  try {
	    return JSON.stringify(obj, null, '    ');
	  } catch (e) {
	    return String(obj);
	  }
	}
	/* eslint-enable */

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// Inspired by Google Closure:
	// http://closure-library.googlecode.com/svn/docs/
	// closure_goog_array_array.js.html#goog.array.clear
	
	'use strict';
	
	var value = __webpack_require__(7);
	
	module.exports = function () {
		value(this).length = 0;
		return this;
	};


/***/ },
/* 57 */
/***/ function(module, exports) {

	// Deprecated
	
	'use strict';
	
	module.exports = function (obj) { return typeof obj === 'function'; };


/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict';
	
	var create = Object.create, getPrototypeOf = Object.getPrototypeOf
	  , x = {};
	
	module.exports = function (/*customCreate*/) {
		var setPrototypeOf = Object.setPrototypeOf
		  , customCreate = arguments[0] || create;
		if (typeof setPrototypeOf !== 'function') return false;
		return getPrototypeOf(setPrototypeOf(customCreate(null), x)) === x;
	};


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// Big thanks to @WebReflection for sorting this out
	// https://gist.github.com/WebReflection/5593554
	
	'use strict';
	
	var isObject      = __webpack_require__(115)
	  , value         = __webpack_require__(7)
	
	  , isPrototypeOf = Object.prototype.isPrototypeOf
	  , defineProperty = Object.defineProperty
	  , nullDesc = { configurable: true, enumerable: false, writable: true,
			value: undefined }
	  , validate;
	
	validate = function (obj, prototype) {
		value(obj);
		if ((prototype === null) || isObject(prototype)) return obj;
		throw new TypeError('Prototype must be null or an object');
	};
	
	module.exports = (function (status) {
		var fn, set;
		if (!status) return null;
		if (status.level === 2) {
			if (status.set) {
				set = status.set;
				fn = function (obj, prototype) {
					set.call(validate(obj, prototype), prototype);
					return obj;
				};
			} else {
				fn = function (obj, prototype) {
					validate(obj, prototype).__proto__ = prototype;
					return obj;
				};
			}
		} else {
			fn = function self(obj, prototype) {
				var isNullBase;
				validate(obj, prototype);
				isNullBase = isPrototypeOf.call(self.nullPolyfill, obj);
				if (isNullBase) delete self.nullPolyfill.__proto__;
				if (prototype === null) prototype = self.nullPolyfill;
				obj.__proto__ = prototype;
				if (isNullBase) defineProperty(self.nullPolyfill, '__proto__', nullDesc);
				return obj;
			};
		}
		return Object.defineProperty(fn, 'level', { configurable: false,
			enumerable: false, writable: false, value: status.level });
	}((function () {
		var x = Object.create(null), y = {}, set
		  , desc = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');
	
		if (desc) {
			try {
				set = desc.set; // Opera crashes at this point
				set.call(x, y);
			} catch (ignore) { }
			if (Object.getPrototypeOf(x) === y) return { set: set, level: 2 };
		}
	
		x.__proto__ = y;
		if (Object.getPrototypeOf(x) === y) return { level: 2 };
	
		x = {};
		x.__proto__ = y;
		if (Object.getPrototypeOf(x) === y) return { level: 1 };
	
		return false;
	}())));
	
	__webpack_require__(113);


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(122)()
		? String.prototype.contains
		: __webpack_require__(123);


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isIterable = __webpack_require__(127);
	
	module.exports = function (value) {
		if (!isIterable(value)) throw new TypeError(value + " is not iterable");
		return value;
	};


/***/ },
/* 62 */
[234, 133, 134],
/* 63 */
/***/ function(module, exports) {

	/*!
	 * escape-html
	 * Copyright(c) 2012-2013 TJ Holowaychuk
	 * MIT Licensed
	 */
	
	/**
	 * Module exports.
	 * @public
	 */
	
	module.exports = escapeHtml;
	
	/**
	 * Escape special characters in the given string of html.
	 *
	 * @param  {string} str The string to escape for inserting into HTML
	 * @return {string}
	 * @public
	 */
	
	function escapeHtml(html) {
	  return String(html)
	    .replace(/&/g, '&amp;')
	    .replace(/"/g, '&quot;')
	    .replace(/'/g, '&#39;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;');
	}


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var topLevel = typeof global !== 'undefined' ? global :
	    typeof window !== 'undefined' ? window : {}
	var minDoc = __webpack_require__(233);
	
	if (typeof document !== 'undefined') {
	    module.exports = document;
	} else {
	    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];
	
	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }
	
	    module.exports = doccy;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 65 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function isObject(x) {
		return typeof x === "object" && x !== null;
	};


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(65)
	var isHook = __webpack_require__(30)
	
	module.exports = applyProperties
	
	function applyProperties(node, props, previous) {
	    for (var propName in props) {
	        var propValue = props[propName]
	
	        if (propValue === undefined) {
	            removeProperty(node, propName, propValue, previous);
	        } else if (isHook(propValue)) {
	            removeProperty(node, propName, propValue, previous)
	            if (propValue.hook) {
	                propValue.hook(node,
	                    propName,
	                    previous ? previous[propName] : undefined)
	            }
	        } else {
	            if (isObject(propValue)) {
	                patchObject(node, props, previous, propName, propValue);
	            } else {
	                node[propName] = propValue
	            }
	        }
	    }
	}
	
	function removeProperty(node, propName, propValue, previous) {
	    if (previous) {
	        var previousValue = previous[propName]
	
	        if (!isHook(previousValue)) {
	            if (propName === "attributes") {
	                for (var attrName in previousValue) {
	                    node.removeAttribute(attrName)
	                }
	            } else if (propName === "style") {
	                for (var i in previousValue) {
	                    node.style[i] = ""
	                }
	            } else if (typeof previousValue === "string") {
	                node[propName] = ""
	            } else {
	                node[propName] = null
	            }
	        } else if (previousValue.unhook) {
	            previousValue.unhook(node, propName, propValue)
	        }
	    }
	}
	
	function patchObject(node, props, previous, propName, propValue) {
	    var previousValue = previous ? previous[propName] : undefined
	
	    // Set attributes
	    if (propName === "attributes") {
	        for (var attrName in propValue) {
	            var attrValue = propValue[attrName]
	
	            if (attrValue === undefined) {
	                node.removeAttribute(attrName)
	            } else {
	                node.setAttribute(attrName, attrValue)
	            }
	        }
	
	        return
	    }
	
	    if(previousValue && isObject(previousValue) &&
	        getPrototype(previousValue) !== getPrototype(propValue)) {
	        node[propName] = propValue
	        return
	    }
	
	    if (!isObject(node[propName])) {
	        node[propName] = {}
	    }
	
	    var replacer = propName === "style" ? "" : undefined
	
	    for (var k in propValue) {
	        var value = propValue[k]
	        node[propName][k] = (value === undefined) ? replacer : value
	    }
	}
	
	function getPrototype(value) {
	    if (Object.getPrototypeOf) {
	        return Object.getPrototypeOf(value)
	    } else if (value.__proto__) {
	        return value.__proto__
	    } else if (value.constructor) {
	        return value.constructor.prototype
	    }
	}


/***/ },
/* 67 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = AttributeHook;
	
	function AttributeHook(namespace, value) {
	    if (!(this instanceof AttributeHook)) {
	        return new AttributeHook(namespace, value);
	    }
	
	    this.namespace = namespace;
	    this.value = value;
	}
	
	AttributeHook.prototype.hook = function (node, prop, prev) {
	    if (prev && prev.type === 'AttributeHook' &&
	        prev.value === this.value &&
	        prev.namespace === this.namespace) {
	        return;
	    }
	
	    node.setAttributeNS(this.namespace, prop, this.value);
	};
	
	AttributeHook.prototype.unhook = function (node, prop, next) {
	    if (next && next.type === 'AttributeHook' &&
	        next.namespace === this.namespace) {
	        return;
	    }
	
	    var colonPosition = prop.indexOf(':');
	    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
	    node.removeAttributeNS(this.namespace, localName);
	};
	
	AttributeHook.prototype.type = 'AttributeHook';


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var EvStore = __webpack_require__(154);
	
	module.exports = EvHook;
	
	function EvHook(value) {
	    if (!(this instanceof EvHook)) {
	        return new EvHook(value);
	    }
	
	    this.value = value;
	}
	
	EvHook.prototype.hook = function (node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);
	
	    es[propName] = this.value;
	};
	
	EvHook.prototype.unhook = function(node, propertyName) {
	    var es = EvStore(node);
	    var propName = propertyName.substr(3);
	
	    es[propName] = undefined;
	};


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var split = __webpack_require__(153);
	
	var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
	var notClassId = /^\.|#/;
	
	module.exports = parseTag;
	
	function parseTag(tag, props) {
	    if (!tag) {
	        return 'DIV';
	    }
	
	    var noId = !(props.hasOwnProperty('id'));
	
	    var tagParts = split(tag, classIdSplit);
	    var tagName = null;
	
	    if (notClassId.test(tagParts[1])) {
	        tagName = 'DIV';
	    }
	
	    var classes, part, type, i;
	
	    for (i = 0; i < tagParts.length; i++) {
	        part = tagParts[i];
	
	        if (!part) {
	            continue;
	        }
	
	        type = part.charAt(0);
	
	        if (!tagName) {
	            tagName = part;
	        } else if (type === '.') {
	            classes = classes || [];
	            classes.push(part.substring(1, part.length));
	        } else if (type === '#' && noId) {
	            props.id = part.substring(1, part.length);
	        }
	    }
	
	    if (classes) {
	        if (props.className) {
	            classes.push(props.className);
	        }
	
	        props.className = classes.join(' ');
	    }
	
	    return props.namespace ? tagName : tagName.toUpperCase();
	}


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var isVNode = __webpack_require__(15)
	var isVText = __webpack_require__(22)
	var isWidget = __webpack_require__(8)
	var isThunk = __webpack_require__(21)
	
	module.exports = handleThunk
	
	function handleThunk(a, b) {
	    var renderedA = a
	    var renderedB = b
	
	    if (isThunk(b)) {
	        renderedB = renderThunk(b, a)
	    }
	
	    if (isThunk(a)) {
	        renderedA = renderThunk(a, null)
	    }
	
	    return {
	        a: renderedA,
	        b: renderedB
	    }
	}
	
	function renderThunk(thunk, previous) {
	    var renderedThunk = thunk.vnode
	
	    if (!renderedThunk) {
	        renderedThunk = thunk.vnode = thunk.render(previous)
	    }
	
	    if (!(isVNode(renderedThunk) ||
	            isVText(renderedThunk) ||
	            isWidget(renderedThunk))) {
	        throw new Error("thunk did not return a valid node");
	    }
	
	    return renderedThunk
	}


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(31)
	
	VirtualPatch.NONE = 0
	VirtualPatch.VTEXT = 1
	VirtualPatch.VNODE = 2
	VirtualPatch.WIDGET = 3
	VirtualPatch.PROPS = 4
	VirtualPatch.ORDER = 5
	VirtualPatch.INSERT = 6
	VirtualPatch.REMOVE = 7
	VirtualPatch.THUNK = 8
	
	module.exports = VirtualPatch
	
	function VirtualPatch(type, vNode, patch) {
	    this.type = Number(type)
	    this.vNode = vNode
	    this.patch = patch
	}
	
	VirtualPatch.prototype.version = version
	VirtualPatch.prototype.type = "VirtualPatch"


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = __webpack_require__(191)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _cycleDom = __webpack_require__(6);
	
	var _localize = __webpack_require__(177);
	
	var localize = _interopRequireWildcard(_localize);
	
	var _combineLatestObject = __webpack_require__(23);
	
	var _combineLatestObject2 = _interopRequireDefault(_combineLatestObject);
	
	var _modelsWhen = __webpack_require__(76);
	
	var _modelsWhen2 = _interopRequireDefault(_modelsWhen);
	
	var _modelsEquation = __webpack_require__(36);
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var owns = Object.prototype.hasOwnProperty;
	
	function renderUnary(name, value, operator, operand, equation) {
	    return (0, _cycleDom.h)('span.' + name + '.unary', {
	        title: (equation || '').toString() + ' = ' + value
	    }, [(0, _cycleDom.h)('span.' + name + '--operator.unary--operator', [operator]), (0, _cycleDom.h)('span.' + name + '--operand.unary--operand', [operand])]);
	}
	function renderBinary(name, value, operator, left, right, equation) {
	    return (0, _cycleDom.h)('span.' + name + '.binary', {
	        title: (equation || '').toString() + ' = ' + value
	    }, [(0, _cycleDom.h)('span.' + name + '--left.binary--left.' + name + '--operand.binary--operand', [left]), (0, _cycleDom.h)('span.' + name + '--operator.binary--operator', [operator]), (0, _cycleDom.h)('span.' + name + '--right.binary--right.' + name + '--operand.binary--operand', [right])]);
	}
	
	var operatorToName = {
	    '+': 'add',
	    '-': 'sub',
	    '*': 'mul',
	    '/': 'div',
	    '=': 'eq',
	    '^': 'pow',
	    or: 'or',
	    and: 'and',
	    max: 'max',
	    min: 'min'
	};
	var operationsByOperator = {
	    '+': function _(x, y) {
	        return +x + +y;
	    },
	    '-': function _(x, y) {
	        return x - y;
	    },
	    '*': function _(x, y) {
	        return x * y;
	    },
	    '/': function _(x, y) {
	        return x / y;
	    },
	    '=': function _(x, y) {
	        return x === y;
	    },
	    '^': function _(x, y) {
	        return Math.pow(x, y);
	    },
	    or: function or(x, y) {
	        return x || y;
	    },
	    and: function and(x, y) {
	        return x && y;
	    },
	    max: function max(x, y) {
	        return y > x ? y : x;
	    },
	    min: function min(x, y) {
	        return y < x ? y : x;
	    }
	};
	var rightIdentity = {
	    '+': 0,
	    '-': 0,
	    '*': 1,
	    '/': 1,
	    '^': 1
	};
	var leftIdentity = {
	    '+': 0,
	    '*': 1
	};
	
	function calculateBinary(equation, calculations) {
	    var operator = equation.type;
	    if (!owns.call(operationsByOperator, operator)) {
	        throw new Error('Unknown operator: \'' + operator + '\'');
	    }
	    var name = operatorToName[operator];
	    var operation = operationsByOperator[operator];
	    var leftView = calculateAlgorithm(equation.left, calculations);
	    var rightView = calculateAlgorithm(equation.right, calculations);
	    var value$ = leftView.value$.combineLatest(rightView.value$, operation).distinctUntilChanged().shareReplay(1);
	    var equation$ = Rx.Observable.merge(leftView.equation$.map(function (eq) {
	        return function (acc) {
	            return acc.set('left', eq);
	        };
	    }), rightView.equation$.map(function (eq) {
	        return function (acc) {
	            return acc.set('right', eq);
	        };
	    })).startWith(equation).scan(function (equation, modifier) {
	        return modifier(equation);
	    }).distinctUntilChanged(undefined, _immutable2['default'].is).shareReplay(1);
	    return {
	        DOM: leftView.DOM.combineLatest(rightView.DOM, value$.startWith('(calculating)'), equation$, function (left, right, value, equation) {
	            if (operator === '^' && equation.right === 0.5) {
	                return renderUnary(name, value, '√', left, equation);
	            }
	            if (rightIdentity[operator] === equation.right) {
	                return left;
	            }
	            if (leftIdentity[operator] === equation.left) {
	                return right;
	            }
	            return renderBinary(name, value, operator, left, right, equation);
	        }),
	        value$: value$,
	        equation$: equation$
	    };
	}
	
	var unaryOperatorToName = {
	    not: 'not',
	    floor: 'floor',
	    ceil: 'ceil'
	};
	var unaryOperationsByOperator = {
	    not: function not(x) {
	        return !x;
	    },
	    floor: Math.floor,
	    ceil: Math.ceil
	};
	function calculateUnary(equation, calculations) {
	    var operator = equation.type;
	    if (!owns.call(unaryOperationsByOperator, operator)) {
	        throw new Error('Unknown operator: \'' + operator + '\'');
	    }
	    var name = unaryOperatorToName[operator];
	    var operation = unaryOperationsByOperator[operator];
	    var operandView = calculateAlgorithm(equation.value, calculations);
	    var value$ = operandView.value$.map(operation).distinctUntilChanged().shareReplay(1);
	    var equation$ = operandView.equation$.startWith(equation).scan(function (equation, operand) {
	        return equation.set('value', operand);
	    }).distinctUntilChanged(undefined, _immutable2['default'].is).shareReplay(1);
	    return {
	        DOM: operandView.DOM.combineLatest(value$.startWith('(calculating)'), equation$, function (operand, value, equation) {
	            return renderUnary(name, value, operator, operand, equation);
	        }),
	        value$: value$,
	        equation$: equation$
	    };
	}
	
	function calculateWhen(equation, calculations) {
	    var otherwiseView = calculateAlgorithm(equation.otherwise, calculations);
	    var possibilities = equation.conditions.toKeyedSeq().map(function (value, condition) {
	        var operandView = calculateAlgorithm(value, calculations);
	        return {
	            condition$: calculations.get(condition),
	            DOM: operandView.DOM,
	            value$: operandView.value$,
	            equation$: operandView.equation$
	        };
	    }).toArray().concat([{
	        condition$: Rx.Observable['return'](true),
	        DOM: otherwiseView.DOM,
	        value$: otherwiseView.value$,
	        equation$: otherwiseView.equation$
	    }]);
	
	    var result = Rx.Observable.combineLatest(possibilities.map(function (_ref) {
	        var condition$ = _ref.condition$;
	        var DOM = _ref.DOM;
	        var value$ = _ref.value$;
	        var equation$ = _ref.equation$;
	        return Rx.Observable.combineLatest(condition$, DOM, value$, equation$, function (condition, vTree, value, equation) {
	            if (!condition) {
	                return null;
	            }
	            return {
	                vTree: vTree,
	                value: value,
	                equation: equation
	            };
	        });
	    })).map(function (values) {
	        return values.find(function (x) {
	            return x;
	        });
	    }).share();
	    return {
	        DOM: result.pluck('vTree'),
	        value$: result.pluck('value').distinctUntilChanged().shareReplay(1),
	        equation$: result.pluck('equation').distinctUntilChanged(undefined, _immutable2['default'].is).shareReplay(1)
	    };
	}
	
	function calculateNumber(number) {
	    return {
	        DOM: Rx.Observable['return']((0, _cycleDom.h)('span.number', ['' + number])),
	        value$: Rx.Observable['return'](number),
	        equation$: Rx.Observable['return'](number)
	    };
	}
	
	function calculateBoolean(boolean) {
	    return {
	        DOM: Rx.Observable['return']((0, _cycleDom.h)('span.boolean.boolean-' + boolean, ['' + boolean])),
	        value$: Rx.Observable['return'](boolean),
	        equation$: Rx.Observable['return'](boolean)
	    };
	}
	
	function calculateString(key, calculations) {
	    return {
	        DOM: Rx.Observable['return'](null).map(function () {
	            var name = localize.name(key);
	            var abbr = localize.abbr(key);
	            var vTree = name === abbr ? (0, _cycleDom.h)('span.ref-' + key, [name]) : (0, _cycleDom.h)('abbr.ref-' + key, {
	                title: name
	            }, [abbr]);
	            return vTree;
	        }),
	        value$: calculations.get(key),
	        equation$: Rx.Observable['return'](key)
	    };
	}
	
	function calculateAlgorithm(equation, calculations) {
	    if (typeof equation === 'number') {
	        return calculateNumber(equation);
	    } else if (typeof equation === 'boolean') {
	        return calculateBoolean(equation);
	    } else if (typeof equation === 'string') {
	        return calculateString(equation, calculations);
	    } else if (equation instanceof _modelsEquation.BinaryOperation) {
	        return calculateBinary(equation, calculations);
	    } else if (equation instanceof _modelsEquation.UnaryOperation) {
	        return calculateUnary(equation, calculations);
	    } else if (equation instanceof _modelsWhen2['default']) {
	        return calculateWhen(equation, calculations);
	    } else {
	        throw new Error('Unknown equation: ' + equation);
	    }
	}
	
	exports['default'] = function (_ref2) {
	    var equation$ = _ref2.equation$;
	    var calculations = _ref2.calculations;
	
	    if (!calculations) {
	        throw new TypeError('Expected calculations to be non-null');
	    }
	    var result = equation$.map(function (equation) {
	        return calculateAlgorithm(equation, calculations);
	    }).shareReplay(1);
	    return {
	        DOM: result.flatMapLatest(function (x) {
	            return x.DOM;
	        }).distinctUntilChanged().startWith('(calculating)').map(function (vTree) {
	            return (0, _cycleDom.h)('div.algorithm', [vTree]);
	        }),
	        value$: result.flatMapLatest(function (x) {
	            return x.value$;
	        }).distinctUntilChanged().share()
	    };
	};
	
	module.exports = exports['default'];

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Array$from = __webpack_require__(77)['default'];
	
	var _Object$assign = __webpack_require__(17)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = select;
	
	var _cycleCore = __webpack_require__(2);
	
	var _cycleDom = __webpack_require__(6);
	
	var FALLBACK_KEY = 'SELECT_FALLBACK';
	
	function renderOptions(options, value, fallback) {
	    var hasSelected = false;
	    var optionsVTree = _Array$from(options).map(function (_ref) {
	        var optionValue = _ref.value;
	        var text = _ref.text;
	
	        var selected = value === optionValue;
	        hasSelected = hasSelected || selected;
	        return (0, _cycleDom.h)('option', {
	            key: optionValue,
	            value: optionValue,
	            selected: selected
	        }, [text]);
	    });
	    if (fallback && !hasSelected) {
	        optionsVTree.unshift((0, _cycleDom.h)('option', {
	            key: FALLBACK_KEY,
	            selected: true
	        }, [fallback]));
	    }
	    return optionsVTree;
	}
	
	function select(key, _ref2) {
	    var DOM = _ref2.DOM;
	    var inputValue$ = _ref2.value$;
	    var options$ = _ref2.options$;
	    var _ref2$props$ = _ref2.props$;
	    var props$ = _ref2$props$ === undefined ? _cycleCore.Rx.Observable['return'](null) : _ref2$props$;
	
	    inputValue$ = inputValue$.shareReplay(1);
	    var selector = 'select.' + key;
	
	    var newValue$ = DOM.select(selector).events('change').map(function (ev) {
	        return ev.target.value;
	    });
	
	    var value$ = inputValue$.first().concat(inputValue$.skip(1).merge(newValue$)).distinctUntilChanged().shareReplay(1);
	
	    var vtree$ = _cycleCore.Rx.Observable.combineLatest(options$, value$, props$, function (options, value, props) {
	        return (0, _cycleDom.h)(selector, _Object$assign({
	            key: key
	        }, props, {
	            fallback: undefined
	        }), renderOptions(options, value, props.fallback));
	    });
	
	    return {
	        DOM: vtree$,
	        value$: value$
	    };
	}
	
	module.exports = exports['default'];

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _withLocalization = __webpack_require__(24);
	
	var _withLocalization2 = _interopRequireDefault(_withLocalization);
	
	var _withLookup = __webpack_require__(25);
	
	var _withLookup2 = _interopRequireDefault(_withLookup);
	
	var _withNiceToString = __webpack_require__(16);
	
	var _withNiceToString2 = _interopRequireDefault(_withNiceToString);
	
	var _constantsJson = __webpack_require__(10);
	
	exports['default'] = (0, _withNiceToString2['default'])((0, _withLookup2['default'])((0, _withLocalization2['default'])(new _immutable2['default'].Record({
	    key: '',
	    order: 0
	}, 'PrimaryStatistic')), {
	    get: function get(key) {
	        var stats = _constantsJson.PRIMARY_STATISTICS[key];
	        if (!stats) {
	            return null;
	        }
	        return new this({
	            key: key
	        }).mergeDeep(stats);
	    },
	    all: function all() {
	        var _this = this;
	
	        return new _immutable2['default'].List(_Object$keys(_constantsJson.PRIMARY_STATISTICS).map(function (key) {
	            return _this.get(key);
	        }).sort(function (x, y) {
	            return x.order - y.order;
	        }));
	    }
	}));
	module.exports = exports['default'];

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = __webpack_require__(12)['default'];
	
	var _Object$entries = __webpack_require__(18)['default'];
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _Range = __webpack_require__(179);
	
	var _Range2 = _interopRequireDefault(_Range);
	
	var _withLocalization = __webpack_require__(24);
	
	var _withLocalization2 = _interopRequireDefault(_withLocalization);
	
	var _withLookup = __webpack_require__(25);
	
	var _withLookup2 = _interopRequireDefault(_withLookup);
	
	var _withNiceToString = __webpack_require__(16);
	
	var _withNiceToString2 = _interopRequireDefault(_withNiceToString);
	
	var _constantsJson = __webpack_require__(10);
	
	var fields = {
	    key: '',
	    height: new _Range2['default'](0.1, 20),
	    weight: new _Range2['default'](25, 500),
	    levelsPerPerk: 4,
	    primaryTotal: 40
	};
	_Object$entries(_constantsJson.PRIMARY_STATISTICS).sort().forEach(function (_ref) {
	    var _ref2 = _slicedToArray(_ref, 2);
	
	    var key = _ref2[0];
	    var value = _ref2[1];
	
	    fields[key] = new _Range2['default'](1, 10);
	});
	_Object$entries(_constantsJson.SECONDARY_STATISTICS).sort().forEach(function (_ref3) {
	    var _ref32 = _slicedToArray(_ref3, 2);
	
	    var key = _ref32[0];
	    var value = _ref32[1];
	
	    fields[key] = 0;
	});
	
	exports['default'] = (0, _withNiceToString2['default'])((0, _withLookup2['default'])((0, _withLocalization2['default'])(_immutable2['default'].Record(fields, 'Race')), {
	    get: function get(key) {
	        var stats = _constantsJson.RACES[key];
	        if (!stats) {
	            return null;
	        }
	        return new this({
	            key: key
	        }).mergeDeep(stats);
	    },
	    getOrDefault: function getOrDefault(key) {
	        return this.get(key) || new this();
	    },
	    all: function all() {
	        var _this = this;
	
	        return _immutable2['default'].Set(_Object$keys(_constantsJson.RACES).map(function (key) {
	            return _this.get(key);
	        }));
	    }
	}), fields);
	module.exports = exports['default'];

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _get = __webpack_require__(27)['default'];
	
	var _inherits = __webpack_require__(28)['default'];
	
	var _createClass = __webpack_require__(26)['default'];
	
	var _classCallCheck = __webpack_require__(19)['default'];
	
	var _slicedToArray = __webpack_require__(12)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var WhenRecord = new _immutable2['default'].Record({
	    conditions: new _immutable2['default'].Map(),
	    otherwise: 0
	});
	
	var When = (function (_WhenRecord) {
	    _inherits(When, _WhenRecord);
	
	    function When() {
	        _classCallCheck(this, When);
	
	        _get(Object.getPrototypeOf(When.prototype), 'constructor', this).apply(this, arguments);
	    }
	
	    _createClass(When, [{
	        key: 'toString',
	        value: function toString() {
	            return 'when(' + this.conditions.entrySeq().map(function (_ref) {
	                var _ref2 = _slicedToArray(_ref, 2);
	
	                var key = _ref2[0];
	                var value = _ref2[1];
	
	                return key + ' => ' + value;
	            }).concat(['otherwise => ' + this.otherwise]).join('; ') + ')';
	        }
	    }]);
	
	    return When;
	})(WhenRecord);
	
	exports['default'] = When;
	module.exports = exports['default'];

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(192), __esModule: true };

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(202), __esModule: true };

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Array$from = __webpack_require__(77)["default"];
	
	exports["default"] = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
	
	    return arr2;
	  } else {
	    return _Array$from(arr);
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(81)
	  , TAG = __webpack_require__(13)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 81 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(203);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  } return function(/* ...args */){
	      return fn.apply(that, arguments);
	    };
	};

/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 84 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	// indexed object, fallback for non-array-like ES3 strings
	var cof = __webpack_require__(81);
	module.exports = 0 in Object('z') ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 86 */
/***/ function(module, exports) {

	// http://jsperf.com/core-js-isobject
	module.exports = function(it){
	  return it !== null && (typeof it == 'object' || typeof it == 'function');
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY         = __webpack_require__(212)
	  , $def            = __webpack_require__(20)
	  , $redef          = __webpack_require__(213)
	  , hide            = __webpack_require__(37)
	  , has             = __webpack_require__(84)
	  , SYMBOL_ITERATOR = __webpack_require__(13)('iterator')
	  , Iterators       = __webpack_require__(29)
	  , FF_ITERATOR     = '@@iterator'
	  , KEYS            = 'keys'
	  , VALUES          = 'values';
	var returnThis = function(){ return this; };
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
	  __webpack_require__(209)(Constructor, NAME, next);
	  var createMethod = function(kind){
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG      = NAME + ' Iterator'
	    , proto    = Base.prototype
	    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , _default = _native || createMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if(_native){
	    var IteratorPrototype = __webpack_require__(9).getProto(_default.call(new Base));
	    // Set @@toStringTag to native iterators
	    __webpack_require__(91)(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
	  }
	  // Define iterator
	  if(!LIBRARY || FORCE)hide(proto, SYMBOL_ITERATOR, _default);
	  // Plug for library
	  Iterators[NAME] = _default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      keys:    IS_SET            ? _default : createMethod(KEYS),
	      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
	      entries: DEFAULT != VALUES ? _default : createMethod('entries')
	    };
	    if(FORCE)for(key in methods){
	      if(!(key in proto))$redef(proto, key, methods[key]);
	    } else $def($def.P + $def.F * __webpack_require__(207), NAME, methods);
	  }
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	module.exports = function(KEY, exec){
	  var $def = __webpack_require__(20)
	    , fn   = (__webpack_require__(4).Object || {})[KEY] || Object[KEY]
	    , exp  = {};
	  exp[KEY] = exec(fn);
	  $def($def.S + $def.F * __webpack_require__(83)(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var $         = __webpack_require__(9)
	  , toIObject = __webpack_require__(48);
	module.exports = function(isEntries){
	  return function(it){
	    var O      = toIObject(it)
	      , keys   = $.getKeys(O)
	      , length = keys.length
	      , i      = 0
	      , result = Array(length)
	      , key;
	    if(isEntries)while(length > i)result[i] = [key = keys[i++], O[key]];
	    else while(length > i)result[i] = O[keys[i++]];
	    return result;
	  };
	};

/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var has  = __webpack_require__(84)
	  , hide = __webpack_require__(37)
	  , TAG  = __webpack_require__(13)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))hide(it, TAG, tag);
	};

/***/ },
/* 92 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(80)
	  , ITERATOR  = __webpack_require__(13)('iterator')
	  , Iterators = __webpack_require__(29);
	module.exports = __webpack_require__(4).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
	};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(224);
	var Iterators = __webpack_require__(29);
	Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global, process) {// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.
	
	;(function (undefined) {
	
	  var objectTypes = {
	    'function': true,
	    'object': true
	  };
	
	  var
	    freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports,
	    freeSelf = objectTypes[typeof self] && self.Object && self,
	    freeWindow = objectTypes[typeof window] && window && window.Object && window,
	    freeModule = objectTypes[typeof module] && module && !module.nodeType && module,
	    moduleExports = freeModule && freeModule.exports === freeExports && freeExports,
	    freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;
	
	  var root = root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;
	
	  var Rx = {
	    internals: {},
	    config: {
	      Promise: root.Promise
	    },
	    helpers: { }
	  };
	
	  // Defaults
	  var noop = Rx.helpers.noop = function () { },
	    identity = Rx.helpers.identity = function (x) { return x; },
	    defaultNow = Rx.helpers.defaultNow = Date.now,
	    defaultComparer = Rx.helpers.defaultComparer = function (x, y) { return isEqual(x, y); },
	    defaultSubComparer = Rx.helpers.defaultSubComparer = function (x, y) { return x > y ? 1 : (x < y ? -1 : 0); },
	    defaultKeySerializer = Rx.helpers.defaultKeySerializer = function (x) { return x.toString(); },
	    defaultError = Rx.helpers.defaultError = function (err) { throw err; },
	    isPromise = Rx.helpers.isPromise = function (p) { return !!p && typeof p.subscribe !== 'function' && typeof p.then === 'function'; },
	    isFunction = Rx.helpers.isFunction = (function () {
	
	      var isFn = function (value) {
	        return typeof value == 'function' || false;
	      }
	
	      // fallback for older versions of Chrome and Safari
	      if (isFn(/x/)) {
	        isFn = function(value) {
	          return typeof value == 'function' && toString.call(value) == '[object Function]';
	        };
	      }
	
	      return isFn;
	    }());
	
	  function cloneArray(arr) { for(var a = [], i = 0, len = arr.length; i < len; i++) { a.push(arr[i]); } return a;}
	
	  var errorObj = {e: {}};
	  var tryCatchTarget;
	  function tryCatcher() {
	    try {
	      return tryCatchTarget.apply(this, arguments);
	    } catch (e) {
	      errorObj.e = e;
	      return errorObj;
	    }
	  }
	  function tryCatch(fn) {
	    if (!isFunction(fn)) { throw new TypeError('fn must be a function'); }
	    tryCatchTarget = fn;
	    return tryCatcher;
	  }
	  function thrower(e) {
	    throw e;
	  }
	
	  Rx.config.longStackSupport = false;
	  var hasStacks = false, stacks = tryCatch(function () { throw new Error(); })();
	  hasStacks = !!stacks.e && !!stacks.e.stack;
	
	  // All code after this point will be filtered from stack traces reported by RxJS
	  var rStartingLine = captureLine(), rFileName;
	
	  var STACK_JUMP_SEPARATOR = 'From previous event:';
	
	  function makeStackTraceLong(error, observable) {
	    // If possible, transform the error stack trace by removing Node and RxJS
	    // cruft, then concatenating with the stack trace of `observable`.
	    if (hasStacks &&
	        observable.stack &&
	        typeof error === 'object' &&
	        error !== null &&
	        error.stack &&
	        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
	    ) {
	      var stacks = [];
	      for (var o = observable; !!o; o = o.source) {
	        if (o.stack) {
	          stacks.unshift(o.stack);
	        }
	      }
	      stacks.unshift(error.stack);
	
	      var concatedStacks = stacks.join('\n' + STACK_JUMP_SEPARATOR + '\n');
	      error.stack = filterStackString(concatedStacks);
	    }
	  }
	
	  function filterStackString(stackString) {
	    var lines = stackString.split('\n'), desiredLines = [];
	    for (var i = 0, len = lines.length; i < len; i++) {
	      var line = lines[i];
	
	      if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
	        desiredLines.push(line);
	      }
	    }
	    return desiredLines.join('\n');
	  }
	
	  function isInternalFrame(stackLine) {
	    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
	    if (!fileNameAndLineNumber) {
	      return false;
	    }
	    var fileName = fileNameAndLineNumber[0], lineNumber = fileNameAndLineNumber[1];
	
	    return fileName === rFileName &&
	      lineNumber >= rStartingLine &&
	      lineNumber <= rEndingLine;
	  }
	
	  function isNodeFrame(stackLine) {
	    return stackLine.indexOf('(module.js:') !== -1 ||
	      stackLine.indexOf('(node.js:') !== -1;
	  }
	
	  function captureLine() {
	    if (!hasStacks) { return; }
	
	    try {
	      throw new Error();
	    } catch (e) {
	      var lines = e.stack.split('\n');
	      var firstLine = lines[0].indexOf('@') > 0 ? lines[1] : lines[2];
	      var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
	      if (!fileNameAndLineNumber) { return; }
	
	      rFileName = fileNameAndLineNumber[0];
	      return fileNameAndLineNumber[1];
	    }
	  }
	
	  function getFileNameAndLineNumber(stackLine) {
	    // Named functions: 'at functionName (filename:lineNumber:columnNumber)'
	    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
	    if (attempt1) { return [attempt1[1], Number(attempt1[2])]; }
	
	    // Anonymous functions: 'at filename:lineNumber:columnNumber'
	    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
	    if (attempt2) { return [attempt2[1], Number(attempt2[2])]; }
	
	    // Firefox style: 'function@filename:lineNumber or @filename:lineNumber'
	    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
	    if (attempt3) { return [attempt3[1], Number(attempt3[2])]; }
	  }
	
	  var EmptyError = Rx.EmptyError = function() {
	    this.message = 'Sequence contains no elements.';
	    this.name = 'EmptyError';
	    Error.call(this);
	  };
	  EmptyError.prototype = Error.prototype;
	
	  var ObjectDisposedError = Rx.ObjectDisposedError = function() {
	    this.message = 'Object has been disposed';
	    this.name = 'ObjectDisposedError';
	    Error.call(this);
	  };
	  ObjectDisposedError.prototype = Error.prototype;
	
	  var ArgumentOutOfRangeError = Rx.ArgumentOutOfRangeError = function () {
	    this.message = 'Argument out of range';
	    this.name = 'ArgumentOutOfRangeError';
	    Error.call(this);
	  };
	  ArgumentOutOfRangeError.prototype = Error.prototype;
	
	  var NotSupportedError = Rx.NotSupportedError = function (message) {
	    this.message = message || 'This operation is not supported';
	    this.name = 'NotSupportedError';
	    Error.call(this);
	  };
	  NotSupportedError.prototype = Error.prototype;
	
	  var NotImplementedError = Rx.NotImplementedError = function (message) {
	    this.message = message || 'This operation is not implemented';
	    this.name = 'NotImplementedError';
	    Error.call(this);
	  };
	  NotImplementedError.prototype = Error.prototype;
	
	  var notImplemented = Rx.helpers.notImplemented = function () {
	    throw new NotImplementedError();
	  };
	
	  var notSupported = Rx.helpers.notSupported = function () {
	    throw new NotSupportedError();
	  };
	
	  // Shim in iterator support
	  var $iterator$ = (typeof Symbol === 'function' && Symbol.iterator) ||
	    '_es6shim_iterator_';
	  // Bug for mozilla version
	  if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
	    $iterator$ = '@@iterator';
	  }
	
	  var doneEnumerator = Rx.doneEnumerator = { done: true, value: undefined };
	
	  var isIterable = Rx.helpers.isIterable = function (o) {
	    return o[$iterator$] !== undefined;
	  }
	
	  var isArrayLike = Rx.helpers.isArrayLike = function (o) {
	    return o && o.length !== undefined;
	  }
	
	  Rx.helpers.iterator = $iterator$;
	
	  var bindCallback = Rx.internals.bindCallback = function (func, thisArg, argCount) {
	    if (typeof thisArg === 'undefined') { return func; }
	    switch(argCount) {
	      case 0:
	        return function() {
	          return func.call(thisArg)
	        };
	      case 1:
	        return function(arg) {
	          return func.call(thisArg, arg);
	        }
	      case 2:
	        return function(value, index) {
	          return func.call(thisArg, value, index);
	        };
	      case 3:
	        return function(value, index, collection) {
	          return func.call(thisArg, value, index, collection);
	        };
	    }
	
	    return function() {
	      return func.apply(thisArg, arguments);
	    };
	  };
	
	  /** Used to determine if values are of the language type Object */
	  var dontEnums = ['toString',
	    'toLocaleString',
	    'valueOf',
	    'hasOwnProperty',
	    'isPrototypeOf',
	    'propertyIsEnumerable',
	    'constructor'],
	  dontEnumsLength = dontEnums.length;
	
	  /** `Object#toString` result shortcuts */
	  var argsClass = '[object Arguments]',
	    arrayClass = '[object Array]',
	    boolClass = '[object Boolean]',
	    dateClass = '[object Date]',
	    errorClass = '[object Error]',
	    funcClass = '[object Function]',
	    numberClass = '[object Number]',
	    objectClass = '[object Object]',
	    regexpClass = '[object RegExp]',
	    stringClass = '[object String]';
	
	  var toString = Object.prototype.toString,
	    hasOwnProperty = Object.prototype.hasOwnProperty,
	    supportsArgsClass = toString.call(arguments) == argsClass, // For less <IE9 && FF<4
	    supportNodeClass,
	    errorProto = Error.prototype,
	    objectProto = Object.prototype,
	    stringProto = String.prototype,
	    propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	  try {
	    supportNodeClass = !(toString.call(document) == objectClass && !({ 'toString': 0 } + ''));
	  } catch (e) {
	    supportNodeClass = true;
	  }
	
	  var nonEnumProps = {};
	  nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
	  nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
	  nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
	  nonEnumProps[objectClass] = { 'constructor': true };
	
	  var support = {};
	  (function () {
	    var ctor = function() { this.x = 1; },
	      props = [];
	
	    ctor.prototype = { 'valueOf': 1, 'y': 1 };
	    for (var key in new ctor) { props.push(key); }
	    for (key in arguments) { }
	
	    // Detect if `name` or `message` properties of `Error.prototype` are enumerable by default.
	    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');
	
	    // Detect if `prototype` properties are enumerable by default.
	    support.enumPrototypes = propertyIsEnumerable.call(ctor, 'prototype');
	
	    // Detect if `arguments` object indexes are non-enumerable
	    support.nonEnumArgs = key != 0;
	
	    // Detect if properties shadowing those on `Object.prototype` are non-enumerable.
	    support.nonEnumShadows = !/valueOf/.test(props);
	  }(1));
	
	  var isObject = Rx.internals.isObject = function(value) {
	    var type = typeof value;
	    return value && (type == 'function' || type == 'object') || false;
	  };
	
	  function keysIn(object) {
	    var result = [];
	    if (!isObject(object)) {
	      return result;
	    }
	    if (support.nonEnumArgs && object.length && isArguments(object)) {
	      object = slice.call(object);
	    }
	    var skipProto = support.enumPrototypes && typeof object == 'function',
	        skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error);
	
	    for (var key in object) {
	      if (!(skipProto && key == 'prototype') &&
	          !(skipErrorProps && (key == 'message' || key == 'name'))) {
	        result.push(key);
	      }
	    }
	
	    if (support.nonEnumShadows && object !== objectProto) {
	      var ctor = object.constructor,
	          index = -1,
	          length = dontEnumsLength;
	
	      if (object === (ctor && ctor.prototype)) {
	        var className = object === stringProto ? stringClass : object === errorProto ? errorClass : toString.call(object),
	            nonEnum = nonEnumProps[className];
	      }
	      while (++index < length) {
	        key = dontEnums[index];
	        if (!(nonEnum && nonEnum[key]) && hasOwnProperty.call(object, key)) {
	          result.push(key);
	        }
	      }
	    }
	    return result;
	  }
	
	  function internalFor(object, callback, keysFunc) {
	    var index = -1,
	      props = keysFunc(object),
	      length = props.length;
	
	    while (++index < length) {
	      var key = props[index];
	      if (callback(object[key], key, object) === false) {
	        break;
	      }
	    }
	    return object;
	  }
	
	  function internalForIn(object, callback) {
	    return internalFor(object, callback, keysIn);
	  }
	
	  function isNode(value) {
	    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
	    // methods that are `typeof` "string" and still can coerce nodes to strings
	    return typeof value.toString != 'function' && typeof (value + '') == 'string';
	  }
	
	  var isArguments = function(value) {
	    return (value && typeof value == 'object') ? toString.call(value) == argsClass : false;
	  }
	
	  // fallback for browsers that can't detect `arguments` objects by [[Class]]
	  if (!supportsArgsClass) {
	    isArguments = function(value) {
	      return (value && typeof value == 'object') ? hasOwnProperty.call(value, 'callee') : false;
	    };
	  }
	
	  var isEqual = Rx.internals.isEqual = function (x, y) {
	    return deepEquals(x, y, [], []);
	  };
	
	  /** @private
	   * Used for deep comparison
	   **/
	  function deepEquals(a, b, stackA, stackB) {
	    // exit early for identical values
	    if (a === b) {
	      // treat `+0` vs. `-0` as not equal
	      return a !== 0 || (1 / a == 1 / b);
	    }
	
	    var type = typeof a,
	        otherType = typeof b;
	
	    // exit early for unlike primitive values
	    if (a === a && (a == null || b == null ||
	        (type != 'function' && type != 'object' && otherType != 'function' && otherType != 'object'))) {
	      return false;
	    }
	
	    // compare [[Class]] names
	    var className = toString.call(a),
	        otherClass = toString.call(b);
	
	    if (className == argsClass) {
	      className = objectClass;
	    }
	    if (otherClass == argsClass) {
	      otherClass = objectClass;
	    }
	    if (className != otherClass) {
	      return false;
	    }
	    switch (className) {
	      case boolClass:
	      case dateClass:
	        // coerce dates and booleans to numbers, dates to milliseconds and booleans
	        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
	        return +a == +b;
	
	      case numberClass:
	        // treat `NaN` vs. `NaN` as equal
	        return (a != +a) ?
	          b != +b :
	          // but treat `-0` vs. `+0` as not equal
	          (a == 0 ? (1 / a == 1 / b) : a == +b);
	
	      case regexpClass:
	      case stringClass:
	        // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
	        // treat string primitives and their corresponding object instances as equal
	        return a == String(b);
	    }
	    var isArr = className == arrayClass;
	    if (!isArr) {
	
	      // exit for functions and DOM nodes
	      if (className != objectClass || (!support.nodeClass && (isNode(a) || isNode(b)))) {
	        return false;
	      }
	      // in older versions of Opera, `arguments` objects have `Array` constructors
	      var ctorA = !support.argsObject && isArguments(a) ? Object : a.constructor,
	          ctorB = !support.argsObject && isArguments(b) ? Object : b.constructor;
	
	      // non `Object` object instances with different constructors are not equal
	      if (ctorA != ctorB &&
	            !(hasOwnProperty.call(a, 'constructor') && hasOwnProperty.call(b, 'constructor')) &&
	            !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
	            ('constructor' in a && 'constructor' in b)
	          ) {
	        return false;
	      }
	    }
	    // assume cyclic structures are equal
	    // the algorithm for detecting cyclic structures is adapted from ES 5.1
	    // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
	    var initedStack = !stackA;
	    stackA || (stackA = []);
	    stackB || (stackB = []);
	
	    var length = stackA.length;
	    while (length--) {
	      if (stackA[length] == a) {
	        return stackB[length] == b;
	      }
	    }
	    var size = 0;
	    var result = true;
	
	    // add `a` and `b` to the stack of traversed objects
	    stackA.push(a);
	    stackB.push(b);
	
	    // recursively compare objects and arrays (susceptible to call stack limits)
	    if (isArr) {
	      // compare lengths to determine if a deep comparison is necessary
	      length = a.length;
	      size = b.length;
	      result = size == length;
	
	      if (result) {
	        // deep compare the contents, ignoring non-numeric properties
	        while (size--) {
	          var index = length,
	              value = b[size];
	
	          if (!(result = deepEquals(a[size], value, stackA, stackB))) {
	            break;
	          }
	        }
	      }
	    }
	    else {
	      // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
	      // which, in this case, is more costly
	      internalForIn(b, function(value, key, b) {
	        if (hasOwnProperty.call(b, key)) {
	          // count the number of properties.
	          size++;
	          // deep compare each property value.
	          return (result = hasOwnProperty.call(a, key) && deepEquals(a[key], value, stackA, stackB));
	        }
	      });
	
	      if (result) {
	        // ensure both objects have the same number of properties
	        internalForIn(a, function(value, key, a) {
	          if (hasOwnProperty.call(a, key)) {
	            // `size` will be `-1` if `a` has more properties than `b`
	            return (result = --size > -1);
	          }
	        });
	      }
	    }
	    stackA.pop();
	    stackB.pop();
	
	    return result;
	  }
	
	  var hasProp = {}.hasOwnProperty,
	      slice = Array.prototype.slice;
	
	  var inherits = Rx.internals.inherits = function (child, parent) {
	    function __() { this.constructor = child; }
	    __.prototype = parent.prototype;
	    child.prototype = new __();
	  };
	
	  var addProperties = Rx.internals.addProperties = function (obj) {
	    for(var sources = [], i = 1, len = arguments.length; i < len; i++) { sources.push(arguments[i]); }
	    for (var idx = 0, ln = sources.length; idx < ln; idx++) {
	      var source = sources[idx];
	      for (var prop in source) {
	        obj[prop] = source[prop];
	      }
	    }
	  };
	
	  // Rx Utils
	  var addRef = Rx.internals.addRef = function (xs, r) {
	    return new AnonymousObservable(function (observer) {
	      return new CompositeDisposable(r.getDisposable(), xs.subscribe(observer));
	    });
	  };
	
	  function arrayInitialize(count, factory) {
	    var a = new Array(count);
	    for (var i = 0; i < count; i++) {
	      a[i] = factory();
	    }
	    return a;
	  }
	
	  // Collections
	  function IndexedItem(id, value) {
	    this.id = id;
	    this.value = value;
	  }
	
	  IndexedItem.prototype.compareTo = function (other) {
	    var c = this.value.compareTo(other.value);
	    c === 0 && (c = this.id - other.id);
	    return c;
	  };
	
	  // Priority Queue for Scheduling
	  var PriorityQueue = Rx.internals.PriorityQueue = function (capacity) {
	    this.items = new Array(capacity);
	    this.length = 0;
	  };
	
	  var priorityProto = PriorityQueue.prototype;
	  priorityProto.isHigherPriority = function (left, right) {
	    return this.items[left].compareTo(this.items[right]) < 0;
	  };
	
	  priorityProto.percolate = function (index) {
	    if (index >= this.length || index < 0) { return; }
	    var parent = index - 1 >> 1;
	    if (parent < 0 || parent === index) { return; }
	    if (this.isHigherPriority(index, parent)) {
	      var temp = this.items[index];
	      this.items[index] = this.items[parent];
	      this.items[parent] = temp;
	      this.percolate(parent);
	    }
	  };
	
	  priorityProto.heapify = function (index) {
	    +index || (index = 0);
	    if (index >= this.length || index < 0) { return; }
	    var left = 2 * index + 1,
	        right = 2 * index + 2,
	        first = index;
	    if (left < this.length && this.isHigherPriority(left, first)) {
	      first = left;
	    }
	    if (right < this.length && this.isHigherPriority(right, first)) {
	      first = right;
	    }
	    if (first !== index) {
	      var temp = this.items[index];
	      this.items[index] = this.items[first];
	      this.items[first] = temp;
	      this.heapify(first);
	    }
	  };
	
	  priorityProto.peek = function () { return this.items[0].value; };
	
	  priorityProto.removeAt = function (index) {
	    this.items[index] = this.items[--this.length];
	    this.items[this.length] = undefined;
	    this.heapify();
	  };
	
	  priorityProto.dequeue = function () {
	    var result = this.peek();
	    this.removeAt(0);
	    return result;
	  };
	
	  priorityProto.enqueue = function (item) {
	    var index = this.length++;
	    this.items[index] = new IndexedItem(PriorityQueue.count++, item);
	    this.percolate(index);
	  };
	
	  priorityProto.remove = function (item) {
	    for (var i = 0; i < this.length; i++) {
	      if (this.items[i].value === item) {
	        this.removeAt(i);
	        return true;
	      }
	    }
	    return false;
	  };
	  PriorityQueue.count = 0;
	
	  /**
	   * Represents a group of disposable resources that are disposed together.
	   * @constructor
	   */
	  var CompositeDisposable = Rx.CompositeDisposable = function () {
	    var args = [], i, len;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	      len = args.length;
	    } else {
	      len = arguments.length;
	      args = new Array(len);
	      for(i = 0; i < len; i++) { args[i] = arguments[i]; }
	    }
	    for(i = 0; i < len; i++) {
	      if (!isDisposable(args[i])) { throw new TypeError('Not a disposable'); }
	    }
	    this.disposables = args;
	    this.isDisposed = false;
	    this.length = args.length;
	  };
	
	  var CompositeDisposablePrototype = CompositeDisposable.prototype;
	
	  /**
	   * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
	   * @param {Mixed} item Disposable to add.
	   */
	  CompositeDisposablePrototype.add = function (item) {
	    if (this.isDisposed) {
	      item.dispose();
	    } else {
	      this.disposables.push(item);
	      this.length++;
	    }
	  };
	
	  /**
	   * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
	   * @param {Mixed} item Disposable to remove.
	   * @returns {Boolean} true if found; false otherwise.
	   */
	  CompositeDisposablePrototype.remove = function (item) {
	    var shouldDispose = false;
	    if (!this.isDisposed) {
	      var idx = this.disposables.indexOf(item);
	      if (idx !== -1) {
	        shouldDispose = true;
	        this.disposables.splice(idx, 1);
	        this.length--;
	        item.dispose();
	      }
	    }
	    return shouldDispose;
	  };
	
	  /**
	   *  Disposes all disposables in the group and removes them from the group.
	   */
	  CompositeDisposablePrototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var len = this.disposables.length, currentDisposables = new Array(len);
	      for(var i = 0; i < len; i++) { currentDisposables[i] = this.disposables[i]; }
	      this.disposables = [];
	      this.length = 0;
	
	      for (i = 0; i < len; i++) {
	        currentDisposables[i].dispose();
	      }
	    }
	  };
	
	  /**
	   * Provides a set of static methods for creating Disposables.
	   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	   */
	  var Disposable = Rx.Disposable = function (action) {
	    this.isDisposed = false;
	    this.action = action || noop;
	  };
	
	  /** Performs the task of cleaning up resources. */
	  Disposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.action();
	      this.isDisposed = true;
	    }
	  };
	
	  /**
	   * Creates a disposable object that invokes the specified action when disposed.
	   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	   * @return {Disposable} The disposable object that runs the given action upon disposal.
	   */
	  var disposableCreate = Disposable.create = function (action) { return new Disposable(action); };
	
	  /**
	   * Gets the disposable that does nothing when disposed.
	   */
	  var disposableEmpty = Disposable.empty = { dispose: noop };
	
	  /**
	   * Validates whether the given object is a disposable
	   * @param {Object} Object to test whether it has a dispose method
	   * @returns {Boolean} true if a disposable object, else false.
	   */
	  var isDisposable = Disposable.isDisposable = function (d) {
	    return d && isFunction(d.dispose);
	  };
	
	  var checkDisposed = Disposable.checkDisposed = function (disposable) {
	    if (disposable.isDisposed) { throw new ObjectDisposedError(); }
	  };
	
	  // Single assignment
	  var SingleAssignmentDisposable = Rx.SingleAssignmentDisposable = function () {
	    this.isDisposed = false;
	    this.current = null;
	  };
	  SingleAssignmentDisposable.prototype.getDisposable = function () {
	    return this.current;
	  };
	  SingleAssignmentDisposable.prototype.setDisposable = function (value) {
	    if (this.current) { throw new Error('Disposable has already been assigned'); }
	    var shouldDispose = this.isDisposed;
	    !shouldDispose && (this.current = value);
	    shouldDispose && value && value.dispose();
	  };
	  SingleAssignmentDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var old = this.current;
	      this.current = null;
	    }
	    old && old.dispose();
	  };
	
	  // Multiple assignment disposable
	  var SerialDisposable = Rx.SerialDisposable = function () {
	    this.isDisposed = false;
	    this.current = null;
	  };
	  SerialDisposable.prototype.getDisposable = function () {
	    return this.current;
	  };
	  SerialDisposable.prototype.setDisposable = function (value) {
	    var shouldDispose = this.isDisposed;
	    if (!shouldDispose) {
	      var old = this.current;
	      this.current = value;
	    }
	    old && old.dispose();
	    shouldDispose && value && value.dispose();
	  };
	  SerialDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var old = this.current;
	      this.current = null;
	    }
	    old && old.dispose();
	  };
	
	  /**
	   * Represents a disposable resource that only disposes its underlying disposable resource when all dependent disposable objects have been disposed.
	   */
	  var RefCountDisposable = Rx.RefCountDisposable = (function () {
	
	    function InnerDisposable(disposable) {
	      this.disposable = disposable;
	      this.disposable.count++;
	      this.isInnerDisposed = false;
	    }
	
	    InnerDisposable.prototype.dispose = function () {
	      if (!this.disposable.isDisposed && !this.isInnerDisposed) {
	        this.isInnerDisposed = true;
	        this.disposable.count--;
	        if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
	          this.disposable.isDisposed = true;
	          this.disposable.underlyingDisposable.dispose();
	        }
	      }
	    };
	
	    /**
	     * Initializes a new instance of the RefCountDisposable with the specified disposable.
	     * @constructor
	     * @param {Disposable} disposable Underlying disposable.
	      */
	    function RefCountDisposable(disposable) {
	      this.underlyingDisposable = disposable;
	      this.isDisposed = false;
	      this.isPrimaryDisposed = false;
	      this.count = 0;
	    }
	
	    /**
	     * Disposes the underlying disposable only when all dependent disposables have been disposed
	     */
	    RefCountDisposable.prototype.dispose = function () {
	      if (!this.isDisposed && !this.isPrimaryDisposed) {
	        this.isPrimaryDisposed = true;
	        if (this.count === 0) {
	          this.isDisposed = true;
	          this.underlyingDisposable.dispose();
	        }
	      }
	    };
	
	    /**
	     * Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.
	     * @returns {Disposable} A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.
	     */
	    RefCountDisposable.prototype.getDisposable = function () {
	      return this.isDisposed ? disposableEmpty : new InnerDisposable(this);
	    };
	
	    return RefCountDisposable;
	  })();
	
	  function ScheduledDisposable(scheduler, disposable) {
	    this.scheduler = scheduler;
	    this.disposable = disposable;
	    this.isDisposed = false;
	  }
	
	  function scheduleItem(s, self) {
	    if (!self.isDisposed) {
	      self.isDisposed = true;
	      self.disposable.dispose();
	    }
	  }
	
	  ScheduledDisposable.prototype.dispose = function () {
	    this.scheduler.scheduleWithState(this, scheduleItem);
	  };
	
	  var ScheduledItem = Rx.internals.ScheduledItem = function (scheduler, state, action, dueTime, comparer) {
	    this.scheduler = scheduler;
	    this.state = state;
	    this.action = action;
	    this.dueTime = dueTime;
	    this.comparer = comparer || defaultSubComparer;
	    this.disposable = new SingleAssignmentDisposable();
	  }
	
	  ScheduledItem.prototype.invoke = function () {
	    this.disposable.setDisposable(this.invokeCore());
	  };
	
	  ScheduledItem.prototype.compareTo = function (other) {
	    return this.comparer(this.dueTime, other.dueTime);
	  };
	
	  ScheduledItem.prototype.isCancelled = function () {
	    return this.disposable.isDisposed;
	  };
	
	  ScheduledItem.prototype.invokeCore = function () {
	    return this.action(this.scheduler, this.state);
	  };
	
	  /** Provides a set of static properties to access commonly used schedulers. */
	  var Scheduler = Rx.Scheduler = (function () {
	
	    function Scheduler(now, schedule, scheduleRelative, scheduleAbsolute) {
	      this.now = now;
	      this._schedule = schedule;
	      this._scheduleRelative = scheduleRelative;
	      this._scheduleAbsolute = scheduleAbsolute;
	    }
	
	    /** Determines whether the given object is a scheduler */
	    Scheduler.isScheduler = function (s) {
	      return s instanceof Scheduler;
	    }
	
	    function invokeAction(scheduler, action) {
	      action();
	      return disposableEmpty;
	    }
	
	    var schedulerProto = Scheduler.prototype;
	
	    /**
	     * Schedules an action to be executed.
	     * @param {Function} action Action to execute.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.schedule = function (action) {
	      return this._schedule(action, invokeAction);
	    };
	
	    /**
	     * Schedules an action to be executed.
	     * @param state State passed to the action to be executed.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleWithState = function (state, action) {
	      return this._schedule(state, action);
	    };
	
	    /**
	     * Schedules an action to be executed after the specified relative due time.
	     * @param {Function} action Action to execute.
	     * @param {Number} dueTime Relative time after which to execute the action.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleWithRelative = function (dueTime, action) {
	      return this._scheduleRelative(action, dueTime, invokeAction);
	    };
	
	    /**
	     * Schedules an action to be executed after dueTime.
	     * @param state State passed to the action to be executed.
	     * @param {Function} action Action to be executed.
	     * @param {Number} dueTime Relative time after which to execute the action.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleWithRelativeAndState = function (state, dueTime, action) {
	      return this._scheduleRelative(state, dueTime, action);
	    };
	
	    /**
	     * Schedules an action to be executed at the specified absolute due time.
	     * @param {Function} action Action to execute.
	     * @param {Number} dueTime Absolute time at which to execute the action.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	      */
	    schedulerProto.scheduleWithAbsolute = function (dueTime, action) {
	      return this._scheduleAbsolute(action, dueTime, invokeAction);
	    };
	
	    /**
	     * Schedules an action to be executed at dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to be executed.
	     * @param {Number}dueTime Absolute time at which to execute the action.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleWithAbsoluteAndState = function (state, dueTime, action) {
	      return this._scheduleAbsolute(state, dueTime, action);
	    };
	
	    /** Gets the current time according to the local machine's system clock. */
	    Scheduler.now = defaultNow;
	
	    /**
	     * Normalizes the specified TimeSpan value to a positive value.
	     * @param {Number} timeSpan The time span value to normalize.
	     * @returns {Number} The specified TimeSpan value if it is zero or positive; otherwise, 0
	     */
	    Scheduler.normalize = function (timeSpan) {
	      timeSpan < 0 && (timeSpan = 0);
	      return timeSpan;
	    };
	
	    return Scheduler;
	  }());
	
	  var normalizeTime = Scheduler.normalize, isScheduler = Scheduler.isScheduler;
	
	  (function (schedulerProto) {
	
	    function invokeRecImmediate(scheduler, pair) {
	      var state = pair[0], action = pair[1], group = new CompositeDisposable();
	      action(state, innerAction);
	      return group;
	
	      function innerAction(state2) {
	        var isAdded = false, isDone = false;
	
	        var d = scheduler.scheduleWithState(state2, scheduleWork);
	        if (!isDone) {
	          group.add(d);
	          isAdded = true;
	        }
	
	        function scheduleWork(_, state3) {
	          if (isAdded) {
	            group.remove(d);
	          } else {
	            isDone = true;
	          }
	          action(state3, innerAction);
	          return disposableEmpty;
	        }
	      }
	    }
	
	    function invokeRecDate(scheduler, pair, method) {
	      var state = pair[0], action = pair[1], group = new CompositeDisposable();
	      action(state, innerAction);
	      return group;
	
	      function innerAction(state2, dueTime1) {
	        var isAdded = false, isDone = false;
	
	        var d = scheduler[method](state2, dueTime1, scheduleWork);
	        if (!isDone) {
	          group.add(d);
	          isAdded = true;
	        }
	
	        function scheduleWork(_, state3) {
	          if (isAdded) {
	            group.remove(d);
	          } else {
	            isDone = true;
	          }
	          action(state3, innerAction);
	          return disposableEmpty;
	        }
	      }
	    }
	
	    function invokeRecDateRelative(s, p) {
	      return invokeRecDate(s, p, 'scheduleWithRelativeAndState');
	    }
	
	    function invokeRecDateAbsolute(s, p) {
	      return invokeRecDate(s, p, 'scheduleWithAbsoluteAndState');
	    }
	
	    function scheduleInnerRecursive(action, self) {
	      action(function(dt) { self(action, dt); });
	    }
	
	    /**
	     * Schedules an action to be executed recursively.
	     * @param {Function} action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursive = function (action) {
	      return this.scheduleRecursiveWithState(action, scheduleInnerRecursive);
	    };
	
	    /**
	     * Schedules an action to be executed recursively.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursiveWithState = function (state, action) {
	      return this.scheduleWithState([state, action], invokeRecImmediate);
	    };
	
	    /**
	     * Schedules an action to be executed recursively after a specified relative due time.
	     * @param {Function} action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified relative time.
	     * @param {Number}dueTime Relative time after which to execute the action for the first time.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursiveWithRelative = function (dueTime, action) {
	      return this.scheduleRecursiveWithRelativeAndState(action, dueTime, scheduleInnerRecursive);
	    };
	
	    /**
	     * Schedules an action to be executed recursively after a specified relative due time.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
	     * @param {Number}dueTime Relative time after which to execute the action for the first time.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursiveWithRelativeAndState = function (state, dueTime, action) {
	      return this._scheduleRelative([state, action], dueTime, invokeRecDateRelative);
	    };
	
	    /**
	     * Schedules an action to be executed recursively at a specified absolute due time.
	     * @param {Function} action Action to execute recursively. The parameter passed to the action is used to trigger recursive scheduling of the action at the specified absolute time.
	     * @param {Number}dueTime Absolute time at which to execute the action for the first time.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursiveWithAbsolute = function (dueTime, action) {
	      return this.scheduleRecursiveWithAbsoluteAndState(action, dueTime, scheduleInnerRecursive);
	    };
	
	    /**
	     * Schedules an action to be executed recursively at a specified absolute due time.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
	     * @param {Number}dueTime Absolute time at which to execute the action for the first time.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursiveWithAbsoluteAndState = function (state, dueTime, action) {
	      return this._scheduleAbsolute([state, action], dueTime, invokeRecDateAbsolute);
	    };
	  }(Scheduler.prototype));
	
	  (function (schedulerProto) {
	
	    /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */
	    Scheduler.prototype.schedulePeriodic = function (period, action) {
	      return this.schedulePeriodicWithState(null, period, action);
	    };
	
	    /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
	     * @param {Mixed} state Initial state passed to the action upon the first iteration.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed, potentially updating the state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */
	    Scheduler.prototype.schedulePeriodicWithState = function(state, period, action) {
	      if (typeof root.setInterval === 'undefined') { throw new NotSupportedError(); }
	      period = normalizeTime(period);
	      var s = state, id = root.setInterval(function () { s = action(s); }, period);
	      return disposableCreate(function () { root.clearInterval(id); });
	    };
	
	  }(Scheduler.prototype));
	
	  (function (schedulerProto) {
	    /**
	     * Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.
	     * @param {Function} handler Handler that's run if an exception is caught. The exception will be rethrown if the handler returns false.
	     * @returns {Scheduler} Wrapper around the original scheduler, enforcing exception handling.
	     */
	    schedulerProto.catchError = schedulerProto['catch'] = function (handler) {
	      return new CatchScheduler(this, handler);
	    };
	  }(Scheduler.prototype));
	
	  var SchedulePeriodicRecursive = Rx.internals.SchedulePeriodicRecursive = (function () {
	    function tick(command, recurse) {
	      recurse(0, this._period);
	      try {
	        this._state = this._action(this._state);
	      } catch (e) {
	        this._cancel.dispose();
	        throw e;
	      }
	    }
	
	    function SchedulePeriodicRecursive(scheduler, state, period, action) {
	      this._scheduler = scheduler;
	      this._state = state;
	      this._period = period;
	      this._action = action;
	    }
	
	    SchedulePeriodicRecursive.prototype.start = function () {
	      var d = new SingleAssignmentDisposable();
	      this._cancel = d;
	      d.setDisposable(this._scheduler.scheduleRecursiveWithRelativeAndState(0, this._period, tick.bind(this)));
	
	      return d;
	    };
	
	    return SchedulePeriodicRecursive;
	  }());
	
	  /** Gets a scheduler that schedules work immediately on the current thread. */
	  var immediateScheduler = Scheduler.immediate = (function () {
	    function scheduleNow(state, action) { return action(this, state); }
	    return new Scheduler(defaultNow, scheduleNow, notSupported, notSupported);
	  }());
	
	  /**
	   * Gets a scheduler that schedules work as soon as possible on the current thread.
	   */
	  var currentThreadScheduler = Scheduler.currentThread = (function () {
	    var queue;
	
	    function runTrampoline () {
	      while (queue.length > 0) {
	        var item = queue.shift();
	        !item.isCancelled() && item.invoke();
	      }
	    }
	
	    function scheduleNow(state, action) {
	      var si = new ScheduledItem(this, state, action, this.now());
	
	      if (!queue) {
	        queue = [si];
	
	        var result = tryCatch(runTrampoline)();
	        queue = null;
	        if (result === errorObj) { return thrower(result.e); }
	      } else {
	        queue.push(si);
	      }
	      return si.disposable;
	    }
	
	    var currentScheduler = new Scheduler(defaultNow, scheduleNow, notSupported, notSupported);
	    currentScheduler.scheduleRequired = function () { return !queue; };
	
	    return currentScheduler;
	  }());
	
	  var scheduleMethod, clearMethod;
	
	  var localTimer = (function () {
	    var localSetTimeout, localClearTimeout = noop;
	    if (!!root.setTimeout) {
	      localSetTimeout = root.setTimeout;
	      localClearTimeout = root.clearTimeout;
	    } else if (!!root.WScript) {
	      localSetTimeout = function (fn, time) {
	        root.WScript.Sleep(time);
	        fn();
	      };
	    } else {
	      throw new NotSupportedError();
	    }
	
	    return {
	      setTimeout: localSetTimeout,
	      clearTimeout: localClearTimeout
	    };
	  }());
	  var localSetTimeout = localTimer.setTimeout,
	    localClearTimeout = localTimer.clearTimeout;
	
	  (function () {
	
	    var nextHandle = 1, tasksByHandle = {}, currentlyRunning = false;
	
	    clearMethod = function (handle) {
	      delete tasksByHandle[handle];
	    };
	
	    function runTask(handle) {
	      if (currentlyRunning) {
	        localSetTimeout(function () { runTask(handle) }, 0);
	      } else {
	        var task = tasksByHandle[handle];
	        if (task) {
	          currentlyRunning = true;
	          var result = tryCatch(task)();
	          clearMethod(handle);
	          currentlyRunning = false;
	          if (result === errorObj) { return thrower(result.e); }
	        }
	      }
	    }
	
	    var reNative = RegExp('^' +
	      String(toString)
	        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	        .replace(/toString| for [^\]]+/g, '.*?') + '$'
	    );
	
	    var setImmediate = typeof (setImmediate = freeGlobal && moduleExports && freeGlobal.setImmediate) == 'function' &&
	      !reNative.test(setImmediate) && setImmediate;
	
	    function postMessageSupported () {
	      // Ensure not in a worker
	      if (!root.postMessage || root.importScripts) { return false; }
	      var isAsync = false, oldHandler = root.onmessage;
	      // Test for async
	      root.onmessage = function () { isAsync = true; };
	      root.postMessage('', '*');
	      root.onmessage = oldHandler;
	
	      return isAsync;
	    }
	
	    // Use in order, setImmediate, nextTick, postMessage, MessageChannel, script readystatechanged, setTimeout
	    if (isFunction(setImmediate)) {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        setImmediate(function () { runTask(id); });
	
	        return id;
	      };
	    } else if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        process.nextTick(function () { runTask(id); });
	
	        return id;
	      };
	    } else if (postMessageSupported()) {
	      var MSG_PREFIX = 'ms.rx.schedule' + Math.random();
	
	      function onGlobalPostMessage(event) {
	        // Only if we're a match to avoid any other global events
	        if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
	          runTask(event.data.substring(MSG_PREFIX.length));
	        }
	      }
	
	      if (root.addEventListener) {
	        root.addEventListener('message', onGlobalPostMessage, false);
	      } else if (root.attachEvent) {
	        root.attachEvent('onmessage', onGlobalPostMessage);
	      } else {
	        root.onmessage = onGlobalPostMessage;
	      }
	
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        root.postMessage(MSG_PREFIX + currentId, '*');
	        return id;
	      };
	    } else if (!!root.MessageChannel) {
	      var channel = new root.MessageChannel();
	
	      channel.port1.onmessage = function (e) { runTask(e.data); };
	
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        channel.port2.postMessage(id);
	        return id;
	      };
	    } else if ('document' in root && 'onreadystatechange' in root.document.createElement('script')) {
	
	      scheduleMethod = function (action) {
	        var scriptElement = root.document.createElement('script');
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	
	        scriptElement.onreadystatechange = function () {
	          runTask(id);
	          scriptElement.onreadystatechange = null;
	          scriptElement.parentNode.removeChild(scriptElement);
	          scriptElement = null;
	        };
	        root.document.documentElement.appendChild(scriptElement);
	        return id;
	      };
	
	    } else {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        localSetTimeout(function () {
	          runTask(id);
	        }, 0);
	
	        return id;
	      };
	    }
	  }());
	
	  /**
	   * Gets a scheduler that schedules work via a timed callback based upon platform.
	   */
	  var timeoutScheduler = Scheduler.timeout = Scheduler['default'] = (function () {
	
	    function scheduleNow(state, action) {
	      var scheduler = this, disposable = new SingleAssignmentDisposable();
	      var id = scheduleMethod(function () {
	        !disposable.isDisposed && disposable.setDisposable(action(scheduler, state));
	      });
	      return new CompositeDisposable(disposable, disposableCreate(function () {
	        clearMethod(id);
	      }));
	    }
	
	    function scheduleRelative(state, dueTime, action) {
	      var scheduler = this, dt = Scheduler.normalize(dueTime), disposable = new SingleAssignmentDisposable();
	      if (dt === 0) { return scheduler.scheduleWithState(state, action); }
	      var id = localSetTimeout(function () {
	        !disposable.isDisposed && disposable.setDisposable(action(scheduler, state));
	      }, dt);
	      return new CompositeDisposable(disposable, disposableCreate(function () {
	        localClearTimeout(id);
	      }));
	    }
	
	    function scheduleAbsolute(state, dueTime, action) {
	      return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
	    }
	
	    return new Scheduler(defaultNow, scheduleNow, scheduleRelative, scheduleAbsolute);
	  })();
	
	  var CatchScheduler = (function (__super__) {
	
	    function scheduleNow(state, action) {
	      return this._scheduler.scheduleWithState(state, this._wrap(action));
	    }
	
	    function scheduleRelative(state, dueTime, action) {
	      return this._scheduler.scheduleWithRelativeAndState(state, dueTime, this._wrap(action));
	    }
	
	    function scheduleAbsolute(state, dueTime, action) {
	      return this._scheduler.scheduleWithAbsoluteAndState(state, dueTime, this._wrap(action));
	    }
	
	    inherits(CatchScheduler, __super__);
	
	    function CatchScheduler(scheduler, handler) {
	      this._scheduler = scheduler;
	      this._handler = handler;
	      this._recursiveOriginal = null;
	      this._recursiveWrapper = null;
	      __super__.call(this, this._scheduler.now.bind(this._scheduler), scheduleNow, scheduleRelative, scheduleAbsolute);
	    }
	
	    CatchScheduler.prototype._clone = function (scheduler) {
	        return new CatchScheduler(scheduler, this._handler);
	    };
	
	    CatchScheduler.prototype._wrap = function (action) {
	      var parent = this;
	      return function (self, state) {
	        try {
	          return action(parent._getRecursiveWrapper(self), state);
	        } catch (e) {
	          if (!parent._handler(e)) { throw e; }
	          return disposableEmpty;
	        }
	      };
	    };
	
	    CatchScheduler.prototype._getRecursiveWrapper = function (scheduler) {
	      if (this._recursiveOriginal !== scheduler) {
	        this._recursiveOriginal = scheduler;
	        var wrapper = this._clone(scheduler);
	        wrapper._recursiveOriginal = scheduler;
	        wrapper._recursiveWrapper = wrapper;
	        this._recursiveWrapper = wrapper;
	      }
	      return this._recursiveWrapper;
	    };
	
	    CatchScheduler.prototype.schedulePeriodicWithState = function (state, period, action) {
	      var self = this, failed = false, d = new SingleAssignmentDisposable();
	
	      d.setDisposable(this._scheduler.schedulePeriodicWithState(state, period, function (state1) {
	        if (failed) { return null; }
	        try {
	          return action(state1);
	        } catch (e) {
	          failed = true;
	          if (!self._handler(e)) { throw e; }
	          d.dispose();
	          return null;
	        }
	      }));
	
	      return d;
	    };
	
	    return CatchScheduler;
	  }(Scheduler));
	
	  /**
	   *  Represents a notification to an observer.
	   */
	  var Notification = Rx.Notification = (function () {
	    function Notification(kind, value, exception, accept, acceptObservable, toString) {
	      this.kind = kind;
	      this.value = value;
	      this.exception = exception;
	      this._accept = accept;
	      this._acceptObservable = acceptObservable;
	      this.toString = toString;
	    }
	
	    /**
	     * Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.
	     *
	     * @memberOf Notification
	     * @param {Any} observerOrOnNext Delegate to invoke for an OnNext notification or Observer to invoke the notification on..
	     * @param {Function} onError Delegate to invoke for an OnError notification.
	     * @param {Function} onCompleted Delegate to invoke for an OnCompleted notification.
	     * @returns {Any} Result produced by the observation.
	     */
	    Notification.prototype.accept = function (observerOrOnNext, onError, onCompleted) {
	      return observerOrOnNext && typeof observerOrOnNext === 'object' ?
	        this._acceptObservable(observerOrOnNext) :
	        this._accept(observerOrOnNext, onError, onCompleted);
	    };
	
	    /**
	     * Returns an observable sequence with a single notification.
	     *
	     * @memberOf Notifications
	     * @param {Scheduler} [scheduler] Scheduler to send out the notification calls on.
	     * @returns {Observable} The observable sequence that surfaces the behavior of the notification upon subscription.
	     */
	    Notification.prototype.toObservable = function (scheduler) {
	      var self = this;
	      isScheduler(scheduler) || (scheduler = immediateScheduler);
	      return new AnonymousObservable(function (observer) {
	        return scheduler.scheduleWithState(self, function (_, notification) {
	          notification._acceptObservable(observer);
	          notification.kind === 'N' && observer.onCompleted();
	        });
	      });
	    };
	
	    return Notification;
	  })();
	
	  /**
	   * Creates an object that represents an OnNext notification to an observer.
	   * @param {Any} value The value contained in the notification.
	   * @returns {Notification} The OnNext notification containing the value.
	   */
	  var notificationCreateOnNext = Notification.createOnNext = (function () {
	      function _accept(onNext) { return onNext(this.value); }
	      function _acceptObservable(observer) { return observer.onNext(this.value); }
	      function toString() { return 'OnNext(' + this.value + ')'; }
	
	      return function (value) {
	        return new Notification('N', value, null, _accept, _acceptObservable, toString);
	      };
	  }());
	
	  /**
	   * Creates an object that represents an OnError notification to an observer.
	   * @param {Any} error The exception contained in the notification.
	   * @returns {Notification} The OnError notification containing the exception.
	   */
	  var notificationCreateOnError = Notification.createOnError = (function () {
	    function _accept (onNext, onError) { return onError(this.exception); }
	    function _acceptObservable(observer) { return observer.onError(this.exception); }
	    function toString () { return 'OnError(' + this.exception + ')'; }
	
	    return function (e) {
	      return new Notification('E', null, e, _accept, _acceptObservable, toString);
	    };
	  }());
	
	  /**
	   * Creates an object that represents an OnCompleted notification to an observer.
	   * @returns {Notification} The OnCompleted notification.
	   */
	  var notificationCreateOnCompleted = Notification.createOnCompleted = (function () {
	    function _accept (onNext, onError, onCompleted) { return onCompleted(); }
	    function _acceptObservable(observer) { return observer.onCompleted(); }
	    function toString () { return 'OnCompleted()'; }
	
	    return function () {
	      return new Notification('C', null, null, _accept, _acceptObservable, toString);
	    };
	  }());
	
	  /**
	   * Supports push-style iteration over an observable sequence.
	   */
	  var Observer = Rx.Observer = function () { };
	
	  /**
	   *  Creates a notification callback from an observer.
	   * @returns The action that forwards its input notification to the underlying observer.
	   */
	  Observer.prototype.toNotifier = function () {
	    var observer = this;
	    return function (n) { return n.accept(observer); };
	  };
	
	  /**
	   *  Hides the identity of an observer.
	   * @returns An observer that hides the identity of the specified observer.
	   */
	  Observer.prototype.asObserver = function () {
	    var self = this;
	    return new AnonymousObserver(
	      function (x) { self.onNext(x); },
	      function (err) { self.onError(err); },
	      function () { self.onCompleted(); });
	  };
	
	  /**
	   *  Checks access to the observer for grammar violations. This includes checking for multiple OnError or OnCompleted calls, as well as reentrancy in any of the observer methods.
	   *  If a violation is detected, an Error is thrown from the offending observer method call.
	   * @returns An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.
	   */
	  Observer.prototype.checked = function () { return new CheckedObserver(this); };
	
	  /**
	   *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
	   * @param {Function} [onNext] Observer's OnNext action implementation.
	   * @param {Function} [onError] Observer's OnError action implementation.
	   * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
	   * @returns {Observer} The observer object implemented using the given actions.
	   */
	  var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
	    onNext || (onNext = noop);
	    onError || (onError = defaultError);
	    onCompleted || (onCompleted = noop);
	    return new AnonymousObserver(onNext, onError, onCompleted);
	  };
	
	  /**
	   *  Creates an observer from a notification callback.
	   *
	   * @static
	   * @memberOf Observer
	   * @param {Function} handler Action that handles a notification.
	   * @returns The observer object that invokes the specified handler using a notification corresponding to each message it receives.
	   */
	  Observer.fromNotifier = function (handler, thisArg) {
	    var cb = bindCallback(handler, thisArg, 1);
	    return new AnonymousObserver(function (x) {
	      return cb(notificationCreateOnNext(x));
	    }, function (e) {
	      return cb(notificationCreateOnError(e));
	    }, function () {
	      return cb(notificationCreateOnCompleted());
	    });
	  };
	
	  /**
	   * Schedules the invocation of observer methods on the given scheduler.
	   * @param {Scheduler} scheduler Scheduler to schedule observer messages on.
	   * @returns {Observer} Observer whose messages are scheduled on the given scheduler.
	   */
	  Observer.prototype.notifyOn = function (scheduler) {
	    return new ObserveOnObserver(scheduler, this);
	  };
	
	  Observer.prototype.makeSafe = function(disposable) {
	    return new AnonymousSafeObserver(this._onNext, this._onError, this._onCompleted, disposable);
	  };
	
	  /**
	   * Abstract base class for implementations of the Observer class.
	   * This base class enforces the grammar of observers where OnError and OnCompleted are terminal messages.
	   */
	  var AbstractObserver = Rx.internals.AbstractObserver = (function (__super__) {
	    inherits(AbstractObserver, __super__);
	
	    /**
	     * Creates a new observer in a non-stopped state.
	     */
	    function AbstractObserver() {
	      this.isStopped = false;
	    }
	
	    // Must be implemented by other observers
	    AbstractObserver.prototype.next = notImplemented;
	    AbstractObserver.prototype.error = notImplemented;
	    AbstractObserver.prototype.completed = notImplemented;
	
	    /**
	     * Notifies the observer of a new element in the sequence.
	     * @param {Any} value Next element in the sequence.
	     */
	    AbstractObserver.prototype.onNext = function (value) {
	      !this.isStopped && this.next(value);
	    };
	
	    /**
	     * Notifies the observer that an exception has occurred.
	     * @param {Any} error The error that has occurred.
	     */
	    AbstractObserver.prototype.onError = function (error) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.error(error);
	      }
	    };
	
	    /**
	     * Notifies the observer of the end of the sequence.
	     */
	    AbstractObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.completed();
	      }
	    };
	
	    /**
	     * Disposes the observer, causing it to transition to the stopped state.
	     */
	    AbstractObserver.prototype.dispose = function () { this.isStopped = true; };
	
	    AbstractObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.error(e);
	        return true;
	      }
	
	      return false;
	    };
	
	    return AbstractObserver;
	  }(Observer));
	
	  /**
	   * Class to create an Observer instance from delegate-based implementations of the on* methods.
	   */
	  var AnonymousObserver = Rx.AnonymousObserver = (function (__super__) {
	    inherits(AnonymousObserver, __super__);
	
	    /**
	     * Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
	     * @param {Any} onNext Observer's OnNext action implementation.
	     * @param {Any} onError Observer's OnError action implementation.
	     * @param {Any} onCompleted Observer's OnCompleted action implementation.
	     */
	    function AnonymousObserver(onNext, onError, onCompleted) {
	      __super__.call(this);
	      this._onNext = onNext;
	      this._onError = onError;
	      this._onCompleted = onCompleted;
	    }
	
	    /**
	     * Calls the onNext action.
	     * @param {Any} value Next element in the sequence.
	     */
	    AnonymousObserver.prototype.next = function (value) {
	      this._onNext(value);
	    };
	
	    /**
	     * Calls the onError action.
	     * @param {Any} error The error that has occurred.
	     */
	    AnonymousObserver.prototype.error = function (error) {
	      this._onError(error);
	    };
	
	    /**
	     *  Calls the onCompleted action.
	     */
	    AnonymousObserver.prototype.completed = function () {
	      this._onCompleted();
	    };
	
	    return AnonymousObserver;
	  }(AbstractObserver));
	
	  var CheckedObserver = (function (__super__) {
	    inherits(CheckedObserver, __super__);
	
	    function CheckedObserver(observer) {
	      __super__.call(this);
	      this._observer = observer;
	      this._state = 0; // 0 - idle, 1 - busy, 2 - done
	    }
	
	    var CheckedObserverPrototype = CheckedObserver.prototype;
	
	    CheckedObserverPrototype.onNext = function (value) {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onNext).call(this._observer, value);
	      this._state = 0;
	      res === errorObj && thrower(res.e);
	    };
	
	    CheckedObserverPrototype.onError = function (err) {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onError).call(this._observer, err);
	      this._state = 2;
	      res === errorObj && thrower(res.e);
	    };
	
	    CheckedObserverPrototype.onCompleted = function () {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onCompleted).call(this._observer);
	      this._state = 2;
	      res === errorObj && thrower(res.e);
	    };
	
	    CheckedObserverPrototype.checkAccess = function () {
	      if (this._state === 1) { throw new Error('Re-entrancy detected'); }
	      if (this._state === 2) { throw new Error('Observer completed'); }
	      if (this._state === 0) { this._state = 1; }
	    };
	
	    return CheckedObserver;
	  }(Observer));
	
	  var ScheduledObserver = Rx.internals.ScheduledObserver = (function (__super__) {
	    inherits(ScheduledObserver, __super__);
	
	    function ScheduledObserver(scheduler, observer) {
	      __super__.call(this);
	      this.scheduler = scheduler;
	      this.observer = observer;
	      this.isAcquired = false;
	      this.hasFaulted = false;
	      this.queue = [];
	      this.disposable = new SerialDisposable();
	    }
	
	    ScheduledObserver.prototype.next = function (value) {
	      var self = this;
	      this.queue.push(function () { self.observer.onNext(value); });
	    };
	
	    ScheduledObserver.prototype.error = function (e) {
	      var self = this;
	      this.queue.push(function () { self.observer.onError(e); });
	    };
	
	    ScheduledObserver.prototype.completed = function () {
	      var self = this;
	      this.queue.push(function () { self.observer.onCompleted(); });
	    };
	
	    ScheduledObserver.prototype.ensureActive = function () {
	      var isOwner = false;
	      if (!this.hasFaulted && this.queue.length > 0) {
	        isOwner = !this.isAcquired;
	        this.isAcquired = true;
	      }
	      if (isOwner) {
	        this.disposable.setDisposable(this.scheduler.scheduleRecursiveWithState(this, function (parent, self) {
	          var work;
	          if (parent.queue.length > 0) {
	            work = parent.queue.shift();
	          } else {
	            parent.isAcquired = false;
	            return;
	          }
	          var res = tryCatch(work)();
	          if (res === errorObj) {
	            parent.queue = [];
	            parent.hasFaulted = true;
	            return thrower(res.e);
	          }
	          self(parent);
	        }));
	      }
	    };
	
	    ScheduledObserver.prototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this.disposable.dispose();
	    };
	
	    return ScheduledObserver;
	  }(AbstractObserver));
	
	  var ObserveOnObserver = (function (__super__) {
	    inherits(ObserveOnObserver, __super__);
	
	    function ObserveOnObserver(scheduler, observer, cancel) {
	      __super__.call(this, scheduler, observer);
	      this._cancel = cancel;
	    }
	
	    ObserveOnObserver.prototype.next = function (value) {
	      __super__.prototype.next.call(this, value);
	      this.ensureActive();
	    };
	
	    ObserveOnObserver.prototype.error = function (e) {
	      __super__.prototype.error.call(this, e);
	      this.ensureActive();
	    };
	
	    ObserveOnObserver.prototype.completed = function () {
	      __super__.prototype.completed.call(this);
	      this.ensureActive();
	    };
	
	    ObserveOnObserver.prototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this._cancel && this._cancel.dispose();
	      this._cancel = null;
	    };
	
	    return ObserveOnObserver;
	  })(ScheduledObserver);
	
	  var observableProto;
	
	  /**
	   * Represents a push-style collection.
	   */
	  var Observable = Rx.Observable = (function () {
	
	    function makeSubscribe(self, subscribe) {
	      return function (o) {
	        var oldOnError = o.onError;
	        o.onError = function (e) {
	          makeStackTraceLong(e, self);
	          oldOnError.call(o, e);
	        };
	
	        return subscribe.call(self, o);
	      };
	    }
	
	    function Observable(subscribe) {
	      if (Rx.config.longStackSupport && hasStacks) {
	        var e = tryCatch(thrower)(new Error()).e;
	        this.stack = e.stack.substring(e.stack.indexOf('\n') + 1);
	        this._subscribe = makeSubscribe(this, subscribe);
	      } else {
	        this._subscribe = subscribe;
	      }
	    }
	
	    observableProto = Observable.prototype;
	
	    /**
	    * Determines whether the given object is an Observable
	    * @param {Any} An object to determine whether it is an Observable
	    * @returns {Boolean} true if an Observable, else false.
	    */
	    Observable.isObservable = function (o) {
	      return o && isFunction(o.subscribe);
	    }
	
	    /**
	     *  Subscribes an o to the observable sequence.
	     *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
	     *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
	     *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
	     *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribe = observableProto.forEach = function (oOrOnNext, onError, onCompleted) {
	      return this._subscribe(typeof oOrOnNext === 'object' ?
	        oOrOnNext :
	        observerCreate(oOrOnNext, onError, onCompleted));
	    };
	
	    /**
	     * Subscribes to the next value in the sequence with an optional "this" argument.
	     * @param {Function} onNext The function to invoke on each element in the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnNext = function (onNext, thisArg) {
	      return this._subscribe(observerCreate(typeof thisArg !== 'undefined' ? function(x) { onNext.call(thisArg, x); } : onNext));
	    };
	
	    /**
	     * Subscribes to an exceptional condition in the sequence with an optional "this" argument.
	     * @param {Function} onError The function to invoke upon exceptional termination of the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnError = function (onError, thisArg) {
	      return this._subscribe(observerCreate(null, typeof thisArg !== 'undefined' ? function(e) { onError.call(thisArg, e); } : onError));
	    };
	
	    /**
	     * Subscribes to the next value in the sequence with an optional "this" argument.
	     * @param {Function} onCompleted The function to invoke upon graceful termination of the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnCompleted = function (onCompleted, thisArg) {
	      return this._subscribe(observerCreate(null, null, typeof thisArg !== 'undefined' ? function() { onCompleted.call(thisArg); } : onCompleted));
	    };
	
	    return Observable;
	  })();
	
	  var ObservableBase = Rx.ObservableBase = (function (__super__) {
	    inherits(ObservableBase, __super__);
	
	    function fixSubscriber(subscriber) {
	      return subscriber && isFunction(subscriber.dispose) ? subscriber :
	        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
	    }
	
	    function setDisposable(s, state) {
	      var ado = state[0], self = state[1];
	      var sub = tryCatch(self.subscribeCore).call(self, ado);
	
	      if (sub === errorObj) {
	        if(!ado.fail(errorObj.e)) { return thrower(errorObj.e); }
	      }
	      ado.setDisposable(fixSubscriber(sub));
	    }
	
	    function subscribe(observer) {
	      var ado = new AutoDetachObserver(observer), state = [ado, this];
	
	      if (currentThreadScheduler.scheduleRequired()) {
	        currentThreadScheduler.scheduleWithState(state, setDisposable);
	      } else {
	        setDisposable(null, state);
	      }
	      return ado;
	    }
	
	    function ObservableBase() {
	      __super__.call(this, subscribe);
	    }
	
	    ObservableBase.prototype.subscribeCore = notImplemented;
	
	    return ObservableBase;
	  }(Observable));
	
	var FlatMapObservable = (function(__super__){
	
	    inherits(FlatMapObservable, __super__);
	
	    function FlatMapObservable(source, selector, resultSelector, thisArg) {
	        this.resultSelector = Rx.helpers.isFunction(resultSelector) ?
	            resultSelector : null;
	
	        this.selector = Rx.internals.bindCallback(Rx.helpers.isFunction(selector) ? selector : function() { return selector; }, thisArg, 3);
	        this.source = source;
	
	        __super__.call(this);
	
	    }
	
	    FlatMapObservable.prototype.subscribeCore = function(o) {
	        return this.source.subscribe(new InnerObserver(o, this.selector, this.resultSelector, this));
	    };
	
	    function InnerObserver(observer, selector, resultSelector, source) {
	        this.i = 0;
	        this.selector = selector;
	        this.resultSelector = resultSelector;
	        this.source = source;
	        this.isStopped = false;
	        this.o = observer;
	    }
	
	    InnerObserver.prototype._wrapResult = function(result, x, i) {
	        return this.resultSelector ?
	            result.map(function(y, i2) { return this.resultSelector(x, y, i, i2); }, this) :
	            result;
	    };
	
	    InnerObserver.prototype.onNext = function(x) {
	
	        if (this.isStopped) return;
	
	        var i = this.i++;
	        var result = tryCatch(this.selector)(x, i, this.source);
	
	        if (result === errorObj) {
	            return this.o.onError(result.e);
	        }
	
	        Rx.helpers.isPromise(result) && (result = Rx.Observable.fromPromise(result));
	        (Rx.helpers.isArrayLike(result) || Rx.helpers.isIterable(result)) && (result = Rx.Observable.from(result));
	
	        this.o.onNext(this._wrapResult(result, x, i));
	
	    };
	
	    InnerObserver.prototype.onError = function(e) {
	        if(!this.isStopped) { this.isStopped = true; this.o.onError(e); }
	    };
	
	    InnerObserver.prototype.onCompleted = function() {
	        if (!this.isStopped) {this.isStopped = true; this.o.onCompleted(); }
	    };
	
	    return FlatMapObservable;
	
	}(ObservableBase));
	
	  var Enumerable = Rx.internals.Enumerable = function () { };
	
	  var ConcatEnumerableObservable = (function(__super__) {
	    inherits(ConcatEnumerableObservable, __super__);
	    function ConcatEnumerableObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }
	    
	    ConcatEnumerableObservable.prototype.subscribeCore = function (o) {
	      var isDisposed, subscription = new SerialDisposable();
	      var cancelable = immediateScheduler.scheduleRecursiveWithState(this.sources[$iterator$](), function (e, self) {
	        if (isDisposed) { return; }
	        var currentItem = tryCatch(e.next).call(e);
	        if (currentItem === errorObj) { return o.onError(currentItem.e); }
	
	        if (currentItem.done) {
	          return o.onCompleted();
	        }
	
	        // Check if promise
	        var currentValue = currentItem.value;
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
	
	        var d = new SingleAssignmentDisposable();
	        subscription.setDisposable(d);
	        d.setDisposable(currentValue.subscribe(new InnerObserver(o, self, e)));
	      });
	
	      return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
	        isDisposed = true;
	      }));
	    };
	    
	    function InnerObserver(o, s, e) {
	      this.o = o;
	      this.s = s;
	      this.e = e;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) { if(!this.isStopped) { this.o.onNext(x); } };
	    InnerObserver.prototype.onError = function (err) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(err);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.s(this.e);
	      }
	    };
	    InnerObserver.prototype.dispose = function () { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (err) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(err);
	        return true;
	      }
	      return false;
	    };
	    
	    return ConcatEnumerableObservable;
	  }(ObservableBase));
	
	  Enumerable.prototype.concat = function () {
	    return new ConcatEnumerableObservable(this);
	  };
	  
	  var CatchErrorObservable = (function(__super__) {
	    inherits(CatchErrorObservable, __super__);
	    function CatchErrorObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }
	    
	    CatchErrorObservable.prototype.subscribeCore = function (o) {
	      var e = this.sources[$iterator$]();
	
	      var isDisposed, subscription = new SerialDisposable();
	      var cancelable = immediateScheduler.scheduleRecursiveWithState(null, function (lastException, self) {
	        if (isDisposed) { return; }
	        var currentItem = tryCatch(e.next).call(e);
	        if (currentItem === errorObj) { return o.onError(currentItem.e); }
	
	        if (currentItem.done) {
	          return lastException !== null ? o.onError(lastException) : o.onCompleted();
	        }
	
	        // Check if promise
	        var currentValue = currentItem.value;
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
	
	        var d = new SingleAssignmentDisposable();
	        subscription.setDisposable(d);
	        d.setDisposable(currentValue.subscribe(
	          function(x) { o.onNext(x); },
	          self,
	          function() { o.onCompleted(); }));
	      });
	      return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
	        isDisposed = true;
	      }));
	    };
	    
	    return CatchErrorObservable;
	  }(ObservableBase));
	
	  Enumerable.prototype.catchError = function () {
	    return new CatchErrorObservable(this);
	  };
	
	  Enumerable.prototype.catchErrorWhen = function (notificationHandler) {
	    var sources = this;
	    return new AnonymousObservable(function (o) {
	      var exceptions = new Subject(),
	        notifier = new Subject(),
	        handled = notificationHandler(exceptions),
	        notificationDisposable = handled.subscribe(notifier);
	
	      var e = sources[$iterator$]();
	
	      var isDisposed,
	        lastException,
	        subscription = new SerialDisposable();
	      var cancelable = immediateScheduler.scheduleRecursive(function (self) {
	        if (isDisposed) { return; }
	        var currentItem = tryCatch(e.next).call(e);
	        if (currentItem === errorObj) { return o.onError(currentItem.e); }
	
	        if (currentItem.done) {
	          if (lastException) {
	            o.onError(lastException);
	          } else {
	            o.onCompleted();
	          }
	          return;
	        }
	
	        // Check if promise
	        var currentValue = currentItem.value;
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
	
	        var outer = new SingleAssignmentDisposable();
	        var inner = new SingleAssignmentDisposable();
	        subscription.setDisposable(new CompositeDisposable(inner, outer));
	        outer.setDisposable(currentValue.subscribe(
	          function(x) { o.onNext(x); },
	          function (exn) {
	            inner.setDisposable(notifier.subscribe(self, function(ex) {
	              o.onError(ex);
	            }, function() {
	              o.onCompleted();
	            }));
	
	            exceptions.onNext(exn);
	          },
	          function() { o.onCompleted(); }));
	      });
	
	      return new CompositeDisposable(notificationDisposable, subscription, cancelable, disposableCreate(function () {
	        isDisposed = true;
	      }));
	    });
	  };
	  
	  var RepeatEnumerable = (function (__super__) {
	    inherits(RepeatEnumerable, __super__);
	    
	    function RepeatEnumerable(v, c) {
	      this.v = v;
	      this.c = c == null ? -1 : c;
	    }
	    RepeatEnumerable.prototype[$iterator$] = function () {
	      return new RepeatEnumerator(this); 
	    };
	    
	    function RepeatEnumerator(p) {
	      this.v = p.v;
	      this.l = p.c;
	    }
	    RepeatEnumerator.prototype.next = function () {
	      if (this.l === 0) { return doneEnumerator; }
	      if (this.l > 0) { this.l--; }
	      return { done: false, value: this.v }; 
	    };
	    
	    return RepeatEnumerable;
	  }(Enumerable));
	
	  var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
	    return new RepeatEnumerable(value, repeatCount);
	  };
	  
	  var OfEnumerable = (function(__super__) {
	    inherits(OfEnumerable, __super__);
	    function OfEnumerable(s, fn, thisArg) {
	      this.s = s;
	      this.fn = fn ? bindCallback(fn, thisArg, 3) : null;
	    }
	    OfEnumerable.prototype[$iterator$] = function () {
	      return new OfEnumerator(this);
	    };
	    
	    function OfEnumerator(p) {
	      this.i = -1;
	      this.s = p.s;
	      this.l = this.s.length;
	      this.fn = p.fn;
	    }
	    OfEnumerator.prototype.next = function () {
	     return ++this.i < this.l ?
	       { done: false, value: !this.fn ? this.s[this.i] : this.fn(this.s[this.i], this.i, this.s) } :
	       doneEnumerator; 
	    };
	    
	    return OfEnumerable;
	  }(Enumerable));
	
	  var enumerableOf = Enumerable.of = function (source, selector, thisArg) {
	    return new OfEnumerable(source, selector, thisArg);
	  };
	
	   /**
	   *  Wraps the source sequence in order to run its observer callbacks on the specified scheduler.
	   *
	   *  This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects
	   *  that require to be run on a scheduler, use subscribeOn.
	   *
	   *  @param {Scheduler} scheduler Scheduler to notify observers on.
	   *  @returns {Observable} The source sequence whose observations happen on the specified scheduler.
	   */
	  observableProto.observeOn = function (scheduler) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      return source.subscribe(new ObserveOnObserver(scheduler, observer));
	    }, source);
	  };
	
	   /**
	   *  Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler. This operation is not commonly used;
	   *  see the remarks section for more information on the distinction between subscribeOn and observeOn.
	
	   *  This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer
	   *  callbacks on a scheduler, use observeOn.
	
	   *  @param {Scheduler} scheduler Scheduler to perform subscription and unsubscription actions on.
	   *  @returns {Observable} The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.
	   */
	  observableProto.subscribeOn = function (scheduler) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var m = new SingleAssignmentDisposable(), d = new SerialDisposable();
	      d.setDisposable(m);
	      m.setDisposable(scheduler.schedule(function () {
	        d.setDisposable(new ScheduledDisposable(scheduler, source.subscribe(observer)));
	      }));
	      return d;
	    }, source);
	  };
	
	  var FromPromiseObservable = (function(__super__) {
	    inherits(FromPromiseObservable, __super__);
	    function FromPromiseObservable(p) {
	      this.p = p;
	      __super__.call(this);
	    }
	
	    FromPromiseObservable.prototype.subscribeCore = function(o) {
	      this.p.then(function (data) {
	        o.onNext(data);
	        o.onCompleted();
	      }, function (err) { o.onError(err); });
	      return disposableEmpty;
	    };
	
	    return FromPromiseObservable;
	  }(ObservableBase));
	
	  /**
	  * Converts a Promise to an Observable sequence
	  * @param {Promise} An ES6 Compliant promise.
	  * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
	  */
	  var observableFromPromise = Observable.fromPromise = function (promise) {
	    return new FromPromiseObservable(promise);
	  };
	  /*
	   * Converts an existing observable sequence to an ES6 Compatible Promise
	   * @example
	   * var promise = Rx.Observable.return(42).toPromise(RSVP.Promise);
	   *
	   * // With config
	   * Rx.config.Promise = RSVP.Promise;
	   * var promise = Rx.Observable.return(42).toPromise();
	   * @param {Function} [promiseCtor] The constructor of the promise. If not provided, it looks for it in Rx.config.Promise.
	   * @returns {Promise} An ES6 compatible promise with the last value from the observable sequence.
	   */
	  observableProto.toPromise = function (promiseCtor) {
	    promiseCtor || (promiseCtor = Rx.config.Promise);
	    if (!promiseCtor) { throw new NotSupportedError('Promise type not provided nor in Rx.config.Promise'); }
	    var source = this;
	    return new promiseCtor(function (resolve, reject) {
	      // No cancellation can be done
	      var value, hasValue = false;
	      source.subscribe(function (v) {
	        value = v;
	        hasValue = true;
	      }, reject, function () {
	        hasValue && resolve(value);
	      });
	    });
	  };
	
	  var ToArrayObservable = (function(__super__) {
	    inherits(ToArrayObservable, __super__);
	    function ToArrayObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }
	
	    ToArrayObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o));
	    };
	
	    function InnerObserver(o) {
	      this.o = o;
	      this.a = [];
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) { if(!this.isStopped) { this.a.push(x); } };
	    InnerObserver.prototype.onError = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onNext(this.a);
	        this.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function () { this.isStopped = true; }
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	 
	      return false;
	    };
	
	    return ToArrayObservable;
	  }(ObservableBase));
	
	  /**
	  * Creates an array from an observable sequence.
	  * @returns {Observable} An observable sequence containing a single element with a list containing all the elements of the source sequence.
	  */
	  observableProto.toArray = function () {
	    return new ToArrayObservable(this);
	  };
	
	  /**
	   *  Creates an observable sequence from a specified subscribe method implementation.
	   * @example
	   *  var res = Rx.Observable.create(function (observer) { return function () { } );
	   *  var res = Rx.Observable.create(function (observer) { return Rx.Disposable.empty; } );
	   *  var res = Rx.Observable.create(function (observer) { } );
	   * @param {Function} subscribe Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.
	   * @returns {Observable} The observable sequence with the specified implementation for the Subscribe method.
	   */
	  Observable.create = function (subscribe, parent) {
	    return new AnonymousObservable(subscribe, parent);
	  };
	
	  /**
	   *  Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
	   *
	   * @example
	   *  var res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });
	   * @param {Function} observableFactory Observable factory function to invoke for each observer that subscribes to the resulting sequence or Promise.
	   * @returns {Observable} An observable sequence whose observers trigger an invocation of the given observable factory function.
	   */
	  var observableDefer = Observable.defer = function (observableFactory) {
	    return new AnonymousObservable(function (observer) {
	      var result;
	      try {
	        result = observableFactory();
	      } catch (e) {
	        return observableThrow(e).subscribe(observer);
	      }
	      isPromise(result) && (result = observableFromPromise(result));
	      return result.subscribe(observer);
	    });
	  };
	
	  var EmptyObservable = (function(__super__) {
	    inherits(EmptyObservable, __super__);
	    function EmptyObservable(scheduler) {
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    EmptyObservable.prototype.subscribeCore = function (observer) {
	      var sink = new EmptySink(observer, this.scheduler);
	      return sink.run();
	    };
	
	    function EmptySink(observer, scheduler) {
	      this.observer = observer;
	      this.scheduler = scheduler;
	    }
	
	    function scheduleItem(s, state) {
	      state.onCompleted();
	      return disposableEmpty;
	    }
	
	    EmptySink.prototype.run = function () {
	      return this.scheduler.scheduleWithState(this.observer, scheduleItem);
	    };
	
	    return EmptyObservable;
	  }(ObservableBase));
	
	  var EMPTY_OBSERVABLE = new EmptyObservable(immediateScheduler);
	
	  /**
	   *  Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
	   *
	   * @example
	   *  var res = Rx.Observable.empty();
	   *  var res = Rx.Observable.empty(Rx.Scheduler.timeout);
	   * @param {Scheduler} [scheduler] Scheduler to send the termination call on.
	   * @returns {Observable} An observable sequence with no elements.
	   */
	  var observableEmpty = Observable.empty = function (scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return scheduler === immediateScheduler ? EMPTY_OBSERVABLE : new EmptyObservable(scheduler);
	  };
	
	  var FromObservable = (function(__super__) {
	    inherits(FromObservable, __super__);
	    function FromObservable(iterable, mapper, scheduler) {
	      this.iterable = iterable;
	      this.mapper = mapper;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    FromObservable.prototype.subscribeCore = function (o) {
	      var sink = new FromSink(o, this);
	      return sink.run();
	    };
	
	    return FromObservable;
	  }(ObservableBase));
	
	  var FromSink = (function () {
	    function FromSink(o, parent) {
	      this.o = o;
	      this.parent = parent;
	    }
	
	    FromSink.prototype.run = function () {
	      var list = Object(this.parent.iterable),
	          it = getIterable(list),
	          o = this.o,
	          mapper = this.parent.mapper;
	
	      function loopRecursive(i, recurse) {
	        var next = tryCatch(it.next).call(it);
	        if (next === errorObj) { return o.onError(next.e); }
	        if (next.done) { return o.onCompleted(); }
	
	        var result = next.value;
	
	        if (isFunction(mapper)) {
	          result = tryCatch(mapper)(result, i);
	          if (result === errorObj) { return o.onError(result.e); }
	        }
	
	        o.onNext(result);
	        recurse(i + 1);
	      }
	
	      return this.parent.scheduler.scheduleRecursiveWithState(0, loopRecursive);
	    };
	
	    return FromSink;
	  }());
	
	  var maxSafeInteger = Math.pow(2, 53) - 1;
	
	  function StringIterable(s) {
	    this._s = s;
	  }
	
	  StringIterable.prototype[$iterator$] = function () {
	    return new StringIterator(this._s);
	  };
	
	  function StringIterator(s) {
	    this._s = s;
	    this._l = s.length;
	    this._i = 0;
	  }
	
	  StringIterator.prototype[$iterator$] = function () {
	    return this;
	  };
	
	  StringIterator.prototype.next = function () {
	    return this._i < this._l ? { done: false, value: this._s.charAt(this._i++) } : doneEnumerator;
	  };
	
	  function ArrayIterable(a) {
	    this._a = a;
	  }
	
	  ArrayIterable.prototype[$iterator$] = function () {
	    return new ArrayIterator(this._a);
	  };
	
	  function ArrayIterator(a) {
	    this._a = a;
	    this._l = toLength(a);
	    this._i = 0;
	  }
	
	  ArrayIterator.prototype[$iterator$] = function () {
	    return this;
	  };
	
	  ArrayIterator.prototype.next = function () {
	    return this._i < this._l ? { done: false, value: this._a[this._i++] } : doneEnumerator;
	  };
	
	  function numberIsFinite(value) {
	    return typeof value === 'number' && root.isFinite(value);
	  }
	
	  function isNan(n) {
	    return n !== n;
	  }
	
	  function getIterable(o) {
	    var i = o[$iterator$], it;
	    if (!i && typeof o === 'string') {
	      it = new StringIterable(o);
	      return it[$iterator$]();
	    }
	    if (!i && o.length !== undefined) {
	      it = new ArrayIterable(o);
	      return it[$iterator$]();
	    }
	    if (!i) { throw new TypeError('Object is not iterable'); }
	    return o[$iterator$]();
	  }
	
	  function sign(value) {
	    var number = +value;
	    if (number === 0) { return number; }
	    if (isNaN(number)) { return number; }
	    return number < 0 ? -1 : 1;
	  }
	
	  function toLength(o) {
	    var len = +o.length;
	    if (isNaN(len)) { return 0; }
	    if (len === 0 || !numberIsFinite(len)) { return len; }
	    len = sign(len) * Math.floor(Math.abs(len));
	    if (len <= 0) { return 0; }
	    if (len > maxSafeInteger) { return maxSafeInteger; }
	    return len;
	  }
	
	  /**
	  * This method creates a new Observable sequence from an array-like or iterable object.
	  * @param {Any} arrayLike An array-like or iterable object to convert to an Observable sequence.
	  * @param {Function} [mapFn] Map function to call on every element of the array.
	  * @param {Any} [thisArg] The context to use calling the mapFn if provided.
	  * @param {Scheduler} [scheduler] Optional scheduler to use for scheduling.  If not provided, defaults to Scheduler.currentThread.
	  */
	  var observableFrom = Observable.from = function (iterable, mapFn, thisArg, scheduler) {
	    if (iterable == null) {
	      throw new Error('iterable cannot be null.')
	    }
	    if (mapFn && !isFunction(mapFn)) {
	      throw new Error('mapFn when provided must be a function');
	    }
	    if (mapFn) {
	      var mapper = bindCallback(mapFn, thisArg, 2);
	    }
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromObservable(iterable, mapper, scheduler);
	  }
	
	  var FromArrayObservable = (function(__super__) {
	    inherits(FromArrayObservable, __super__);
	    function FromArrayObservable(args, scheduler) {
	      this.args = args;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    FromArrayObservable.prototype.subscribeCore = function (observer) {
	      var sink = new FromArraySink(observer, this);
	      return sink.run();
	    };
	
	    return FromArrayObservable;
	  }(ObservableBase));
	
	  function FromArraySink(observer, parent) {
	    this.observer = observer;
	    this.parent = parent;
	  }
	
	  FromArraySink.prototype.run = function () {
	    var observer = this.observer, args = this.parent.args, len = args.length;
	    function loopRecursive(i, recurse) {
	      if (i < len) {
	        observer.onNext(args[i]);
	        recurse(i + 1);
	      } else {
	        observer.onCompleted();
	      }
	    }
	
	    return this.parent.scheduler.scheduleRecursiveWithState(0, loopRecursive);
	  };
	
	  /**
	  *  Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
	  * @deprecated use Observable.from or Observable.of
	  * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given enumerable sequence.
	  */
	  var observableFromArray = Observable.fromArray = function (array, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromArrayObservable(array, scheduler)
	  };
	
	  /**
	   *  Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.
	   *
	   * @example
	   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; });
	   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; }, Rx.Scheduler.timeout);
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Scheduler} [scheduler] Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new AnonymousObservable(function (o) {
	      var first = true;
	      return scheduler.scheduleRecursiveWithState(initialState, function (state, self) {
	        var hasResult, result;
	        try {
	          if (first) {
	            first = false;
	          } else {
	            state = iterate(state);
	          }
	          hasResult = condition(state);
	          hasResult && (result = resultSelector(state));
	        } catch (e) {
	          return o.onError(e);
	        }
	        if (hasResult) {
	          o.onNext(result);
	          self(state);
	        } else {
	          o.onCompleted();
	        }
	      });
	    });
	  };
	
	  function observableOf (scheduler, array) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromArrayObservable(array, scheduler);
	  }
	
	  /**
	  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
	  */
	  Observable.of = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return new FromArrayObservable(args, currentThreadScheduler);
	  };
	
	  /**
	  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
	  * @param {Scheduler} scheduler A scheduler to use for scheduling the arguments.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
	  */
	  Observable.ofWithScheduler = function (scheduler) {
	    var len = arguments.length, args = new Array(len - 1);
	    for(var i = 1; i < len; i++) { args[i - 1] = arguments[i]; }
	    return new FromArrayObservable(args, scheduler);
	  };
	
	  /**
	   * Creates an Observable sequence from changes to an array using Array.observe.
	   * @param {Array} array An array to observe changes.
	   * @returns {Observable} An observable sequence containing changes to an array from Array.observe.
	   */
	  Observable.ofArrayChanges = function(array) {
	    if (!Array.isArray(array)) { throw new TypeError('Array.observe only accepts arrays.'); }
	    if (typeof Array.observe !== 'function' && typeof Array.unobserve !== 'function') { throw new TypeError('Array.observe is not supported on your platform') }
	    return new AnonymousObservable(function(observer) {
	      function observerFn(changes) {
	        for(var i = 0, len = changes.length; i < len; i++) {
	          observer.onNext(changes[i]);
	        }
	      }
	      
	      Array.observe(array, observerFn);
	
	      return function () {
	        Array.unobserve(array, observerFn);
	      };
	    });
	  };
	
	  /**
	   * Creates an Observable sequence from changes to an object using Object.observe.
	   * @param {Object} obj An object to observe changes.
	   * @returns {Observable} An observable sequence containing changes to an object from Object.observe.
	   */
	  Observable.ofObjectChanges = function(obj) {
	    if (obj == null) { throw new TypeError('object must not be null or undefined.'); }
	    if (typeof Object.observe !== 'function' && typeof Object.unobserve !== 'function') { throw new TypeError('Object.observe is not supported on your platform') }
	    return new AnonymousObservable(function(observer) {
	      function observerFn(changes) {
	        for(var i = 0, len = changes.length; i < len; i++) {
	          observer.onNext(changes[i]);
	        }
	      }
	
	      Object.observe(obj, observerFn);
	
	      return function () {
	        Object.unobserve(obj, observerFn);
	      };
	    });
	  };
	
	  var NeverObservable = (function(__super__) {
	    inherits(NeverObservable, __super__);
	    function NeverObservable() {
	      __super__.call(this);
	    }
	
	    NeverObservable.prototype.subscribeCore = function (observer) {
	      return disposableEmpty;
	    };
	
	    return NeverObservable;
	  }(ObservableBase));
	
	  var NEVER_OBSERVABLE = new NeverObservable();
	
	  /**
	   * Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
	   * @returns {Observable} An observable sequence whose observers will never get called.
	   */
	  var observableNever = Observable.never = function () {
	    return NEVER_OBSERVABLE;
	  };
	
	  var PairsObservable = (function(__super__) {
	    inherits(PairsObservable, __super__);
	    function PairsObservable(obj, scheduler) {
	      this.obj = obj;
	      this.keys = Object.keys(obj);
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    PairsObservable.prototype.subscribeCore = function (observer) {
	      var sink = new PairsSink(observer, this);
	      return sink.run();
	    };
	
	    return PairsObservable;
	  }(ObservableBase));
	
	  function PairsSink(observer, parent) {
	    this.observer = observer;
	    this.parent = parent;
	  }
	
	  PairsSink.prototype.run = function () {
	    var observer = this.observer, obj = this.parent.obj, keys = this.parent.keys, len = keys.length;
	    function loopRecursive(i, recurse) {
	      if (i < len) {
	        var key = keys[i];
	        observer.onNext([key, obj[key]]);
	        recurse(i + 1);
	      } else {
	        observer.onCompleted();
	      }
	    }
	
	    return this.parent.scheduler.scheduleRecursiveWithState(0, loopRecursive);
	  };
	
	  /**
	   * Convert an object into an observable sequence of [key, value] pairs.
	   * @param {Object} obj The object to inspect.
	   * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
	   * @returns {Observable} An observable sequence of [key, value] pairs from the object.
	   */
	  Observable.pairs = function (obj, scheduler) {
	    scheduler || (scheduler = currentThreadScheduler);
	    return new PairsObservable(obj, scheduler);
	  };
	
	    var RangeObservable = (function(__super__) {
	    inherits(RangeObservable, __super__);
	    function RangeObservable(start, count, scheduler) {
	      this.start = start;
	      this.rangeCount = count;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    RangeObservable.prototype.subscribeCore = function (observer) {
	      var sink = new RangeSink(observer, this);
	      return sink.run();
	    };
	
	    return RangeObservable;
	  }(ObservableBase));
	
	  var RangeSink = (function () {
	    function RangeSink(observer, parent) {
	      this.observer = observer;
	      this.parent = parent;
	    }
	
	    RangeSink.prototype.run = function () {
	      var start = this.parent.start, count = this.parent.rangeCount, observer = this.observer;
	      function loopRecursive(i, recurse) {
	        if (i < count) {
	          observer.onNext(start + i);
	          recurse(i + 1);
	        } else {
	          observer.onCompleted();
	        }
	      }
	
	      return this.parent.scheduler.scheduleRecursiveWithState(0, loopRecursive);
	    };
	
	    return RangeSink;
	  }());
	
	  /**
	  *  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
	  * @param {Number} start The value of the first integer in the sequence.
	  * @param {Number} count The number of sequential integers to generate.
	  * @param {Scheduler} [scheduler] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.
	  * @returns {Observable} An observable sequence that contains a range of sequential integral numbers.
	  */
	  Observable.range = function (start, count, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new RangeObservable(start, count, scheduler);
	  };
	
	  var RepeatObservable = (function(__super__) {
	    inherits(RepeatObservable, __super__);
	    function RepeatObservable(value, repeatCount, scheduler) {
	      this.value = value;
	      this.repeatCount = repeatCount == null ? -1 : repeatCount;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    RepeatObservable.prototype.subscribeCore = function (observer) {
	      var sink = new RepeatSink(observer, this);
	      return sink.run();
	    };
	
	    return RepeatObservable;
	  }(ObservableBase));
	
	  function RepeatSink(observer, parent) {
	    this.observer = observer;
	    this.parent = parent;
	  }
	
	  RepeatSink.prototype.run = function () {
	    var observer = this.observer, value = this.parent.value;
	    function loopRecursive(i, recurse) {
	      if (i === -1 || i > 0) {
	        observer.onNext(value);
	        i > 0 && i--;
	      }
	      if (i === 0) { return observer.onCompleted(); }
	      recurse(i);
	    }
	
	    return this.parent.scheduler.scheduleRecursiveWithState(this.parent.repeatCount, loopRecursive);
	  };
	
	  /**
	   *  Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.
	   * @param {Mixed} value Element to repeat.
	   * @param {Number} repeatCount [Optiona] Number of times to repeat the element. If not specified, repeats indefinitely.
	   * @param {Scheduler} scheduler Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} An observable sequence that repeats the given element the specified number of times.
	   */
	  Observable.repeat = function (value, repeatCount, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new RepeatObservable(value, repeatCount, scheduler);
	  };
	
	  var JustObservable = (function(__super__) {
	    inherits(JustObservable, __super__);
	    function JustObservable(value, scheduler) {
	      this.value = value;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    JustObservable.prototype.subscribeCore = function (observer) {
	      var sink = new JustSink(observer, this.value, this.scheduler);
	      return sink.run();
	    };
	
	    function JustSink(observer, value, scheduler) {
	      this.observer = observer;
	      this.value = value;
	      this.scheduler = scheduler;
	    }
	
	    function scheduleItem(s, state) {
	      var value = state[0], observer = state[1];
	      observer.onNext(value);
	      observer.onCompleted();
	      return disposableEmpty;
	    }
	
	    JustSink.prototype.run = function () {
	      var state = [this.value, this.observer];
	      return this.scheduler === immediateScheduler ?
	        scheduleItem(null, state) :
	        this.scheduler.scheduleWithState(state, scheduleItem);
	    };
	
	    return JustObservable;
	  }(ObservableBase));
	
	  /**
	   *  Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.
	   *  There is an alias called 'just' or browsers <IE9.
	   * @param {Mixed} value Single element in the resulting observable sequence.
	   * @param {Scheduler} scheduler Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} An observable sequence containing the single specified element.
	   */
	  var observableReturn = Observable['return'] = Observable.just = function (value, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return new JustObservable(value, scheduler);
	  };
	
	  var ThrowObservable = (function(__super__) {
	    inherits(ThrowObservable, __super__);
	    function ThrowObservable(error, scheduler) {
	      this.error = error;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }
	
	    ThrowObservable.prototype.subscribeCore = function (o) {
	      var sink = new ThrowSink(o, this);
	      return sink.run();
	    };
	
	    function ThrowSink(o, p) {
	      this.o = o;
	      this.p = p;
	    }
	
	    function scheduleItem(s, state) {
	      var e = state[0], o = state[1];
	      o.onError(e);
	    }
	
	    ThrowSink.prototype.run = function () {
	      return this.p.scheduler.scheduleWithState([this.p.error, this.o], scheduleItem);
	    };
	
	    return ThrowObservable;
	  }(ObservableBase));
	
	  /**
	   *  Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single onError message.
	   *  There is an alias to this method called 'throwError' for browsers <IE9.
	   * @param {Mixed} error An object used for the sequence's termination.
	   * @param {Scheduler} scheduler Scheduler to send the exceptional termination call on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} The observable sequence that terminates exceptionally with the specified exception object.
	   */
	  var observableThrow = Observable['throw'] = function (error, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return new ThrowObservable(error, scheduler);
	  };
	
	  /**
	   * Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
	   * @param {Function} resourceFactory Factory function to obtain a resource object.
	   * @param {Function} observableFactory Factory function to obtain an observable sequence that depends on the obtained resource.
	   * @returns {Observable} An observable sequence whose lifetime controls the lifetime of the dependent resource object.
	   */
	  Observable.using = function (resourceFactory, observableFactory) {
	    return new AnonymousObservable(function (o) {
	      var disposable = disposableEmpty;
	      var resource = tryCatch(resourceFactory)();
	      if (resource === errorObj) {
	        return new CompositeDisposable(observableThrow(resource.e).subscribe(o), disposable);
	      }
	      resource && (disposable = resource);
	      var source = tryCatch(observableFactory)(resource);
	      if (source === errorObj) {
	        return new CompositeDisposable(observableThrow(source.e).subscribe(o), disposable);
	      }
	      return new CompositeDisposable(source.subscribe(o), disposable);
	    });
	  };
	
	  /**
	   * Propagates the observable sequence or Promise that reacts first.
	   * @param {Observable} rightSource Second observable sequence or Promise.
	   * @returns {Observable} {Observable} An observable sequence that surfaces either of the given sequences, whichever reacted first.
	   */
	  observableProto.amb = function (rightSource) {
	    var leftSource = this;
	    return new AnonymousObservable(function (observer) {
	      var choice,
	        leftChoice = 'L', rightChoice = 'R',
	        leftSubscription = new SingleAssignmentDisposable(),
	        rightSubscription = new SingleAssignmentDisposable();
	
	      isPromise(rightSource) && (rightSource = observableFromPromise(rightSource));
	
	      function choiceL() {
	        if (!choice) {
	          choice = leftChoice;
	          rightSubscription.dispose();
	        }
	      }
	
	      function choiceR() {
	        if (!choice) {
	          choice = rightChoice;
	          leftSubscription.dispose();
	        }
	      }
	
	      var leftSubscribe = observerCreate(
	        function (left) {
	          choiceL();
	          choice === leftChoice && observer.onNext(left);
	        },
	        function (e) {
	          choiceL();
	          choice === leftChoice && observer.onError(e);
	        },
	        function () {
	          choiceL();
	          choice === leftChoice && observer.onCompleted();
	        }
	      );
	      var rightSubscribe = observerCreate(
	        function (right) {
	          choiceR();
	          choice === rightChoice && observer.onNext(right);
	        },
	        function (e) {
	          choiceR();
	          choice === rightChoice && observer.onError(e);
	        },
	        function () {
	          choiceR();
	          choice === rightChoice && observer.onCompleted();
	        }
	      );
	
	      leftSubscription.setDisposable(leftSource.subscribe(leftSubscribe));
	      rightSubscription.setDisposable(rightSource.subscribe(rightSubscribe));
	
	      return new CompositeDisposable(leftSubscription, rightSubscription);
	    });
	  };
	
	  function amb(p, c) { return p.amb(c); }
	
	  /**
	   * Propagates the observable sequence or Promise that reacts first.
	   * @returns {Observable} An observable sequence that surfaces any of the given sequences, whichever reacted first.
	   */
	  Observable.amb = function () {
	    var acc = observableNever(), items;
	    if (Array.isArray(arguments[0])) {
	      items = arguments[0];
	    } else {
	      var len = arguments.length;
	      items = new Array(items);
	      for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
	    }
	    for (var i = 0, len = items.length; i < len; i++) {
	      acc = amb(acc, items[i]);
	    }
	    return acc;
	  };
	
	  var CatchObserver = (function(__super__) {
	    inherits(CatchObserver, __super__);
	    function CatchObserver(o, s, fn) {
	      this._o = o;
	      this._s = s;
	      this._fn = fn;
	      __super__.call(this);
	    }
	
	    CatchObserver.prototype.next = function (x) { this._o.onNext(x); };
	    CatchObserver.prototype.completed = function () { return this._o.onCompleted(); };
	    CatchObserver.prototype.error = function (e) {
	      var result = tryCatch(this._fn)(e);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      isPromise(result) && (result = observableFromPromise(result));
	
	      var d = new SingleAssignmentDisposable();
	      this._s.setDisposable(d);
	      d.setDisposable(result.subscribe(this._o));
	    };
	
	    return CatchObserver;
	  }(AbstractObserver));
	
	  function observableCatchHandler(source, handler) {
	    return new AnonymousObservable(function (o) {
	      var d1 = new SingleAssignmentDisposable(), subscription = new SerialDisposable();
	      subscription.setDisposable(d1);
	      d1.setDisposable(source.subscribe(new CatchObserver(o, subscription, handler)));
	      return subscription;
	    }, source);
	  }
	
	  /**
	   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
	   * @param {Mixed} handlerOrSecond Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.
	   * @returns {Observable} An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.
	   */
	  observableProto['catch'] = function (handlerOrSecond) {
	    return isFunction(handlerOrSecond) ? observableCatchHandler(this, handlerOrSecond) : observableCatch([this, handlerOrSecond]);
	  };
	
	  /**
	   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
	   * @param {Array | Arguments} args Arguments or an array to use as the next sequence if an error occurs.
	   * @returns {Observable} An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.
	   */
	  var observableCatch = Observable['catch'] = function () {
	    var items;
	    if (Array.isArray(arguments[0])) {
	      items = arguments[0];
	    } else {
	      var len = arguments.length;
	      items = new Array(len);
	      for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
	    }
	    return enumerableOf(items).catchError();
	  };
	
	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
	   * This can be in the form of an argument list of observables or an array.
	   *
	   * @example
	   * 1 - obs = observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
	   * 2 - obs = observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  observableProto.combineLatest = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    if (Array.isArray(args[0])) {
	      args[0].unshift(this);
	    } else {
	      args.unshift(this);
	    }
	    return combineLatest.apply(this, args);
	  };
	
	  function falseFactory() { return false; }
	  function argumentsToArray() {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return args;
	  }
	
	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
	   *
	   * @example
	   * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
	   * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  var combineLatest = Observable.combineLatest = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);
	
	    return new AnonymousObservable(function (o) {
	      var n = args.length,
	        hasValue = arrayInitialize(n, falseFactory),
	        hasValueAll = false,
	        isDone = arrayInitialize(n, falseFactory),
	        values = new Array(n);
	
	      function next(i) {
	        hasValue[i] = true;
	        if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
	          try {
	            var res = resultSelector.apply(null, values);
	          } catch (e) {
	            return o.onError(e);
	          }
	          o.onNext(res);
	        } else if (isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
	          o.onCompleted();
	        }
	      }
	
	      function done (i) {
	        isDone[i] = true;
	        isDone.every(identity) && o.onCompleted();
	      }
	
	      var subscriptions = new Array(n);
	      for (var idx = 0; idx < n; idx++) {
	        (function (i) {
	          var source = args[i], sad = new SingleAssignmentDisposable();
	          isPromise(source) && (source = observableFromPromise(source));
	          sad.setDisposable(source.subscribe(function (x) {
	              values[i] = x;
	              next(i);
	            },
	            function(e) { o.onError(e); },
	            function () { done(i); }
	          ));
	          subscriptions[i] = sad;
	        }(idx));
	      }
	
	      return new CompositeDisposable(subscriptions);
	    }, this);
	  };
	
	  /**
	   * Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.
	   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
	   */
	  observableProto.concat = function () {
	    for(var args = [], i = 0, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	    args.unshift(this);
	    return observableConcat.apply(null, args);
	  };
	
	  var ConcatObservable = (function(__super__) {
	    inherits(ConcatObservable, __super__);
	    function ConcatObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }
	
	    ConcatObservable.prototype.subscribeCore = function(o) {
	      var sink = new ConcatSink(this.sources, o);
	      return sink.run();
	    };
	
	    function ConcatSink(sources, o) {
	      this.sources = sources;
	      this.o = o;
	    }
	    ConcatSink.prototype.run = function () {
	      var isDisposed, subscription = new SerialDisposable(), sources = this.sources, length = sources.length, o = this.o;
	      var cancelable = immediateScheduler.scheduleRecursiveWithState(0, function (i, self) {
	        if (isDisposed) { return; }
	        if (i === length) {
	          return o.onCompleted();
	        }
	
	        // Check if promise
	        var currentValue = sources[i];
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));
	
	        var d = new SingleAssignmentDisposable();
	        subscription.setDisposable(d);
	        d.setDisposable(currentValue.subscribe(
	          function (x) { o.onNext(x); },
	          function (e) { o.onError(e); },
	          function () { self(i + 1); }
	        ));
	      });
	
	      return new CompositeDisposable(subscription, cancelable, disposableCreate(function () {
	        isDisposed = true;
	      }));
	    };
	
	
	    return ConcatObservable;
	  }(ObservableBase));
	
	  /**
	   * Concatenates all the observable sequences.
	   * @param {Array | Arguments} args Arguments or an array to concat to the observable sequence.
	   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
	   */
	  var observableConcat = Observable.concat = function () {
	    var args;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	    } else {
	      args = new Array(arguments.length);
	      for(var i = 0, len = arguments.length; i < len; i++) { args[i] = arguments[i]; }
	    }
	    return new ConcatObservable(args);
	  };
	
	  /**
	   * Concatenates an observable sequence of observable sequences.
	   * @returns {Observable} An observable sequence that contains the elements of each observed inner sequence, in sequential order.
	   */
	  observableProto.concatAll = function () {
	    return this.merge(1);
	  };
	
	  var MergeObservable = (function (__super__) {
	    inherits(MergeObservable, __super__);
	
	    function MergeObservable(source, maxConcurrent) {
	      this.source = source;
	      this.maxConcurrent = maxConcurrent;
	      __super__.call(this);
	    }
	
	    MergeObservable.prototype.subscribeCore = function(observer) {
	      var g = new CompositeDisposable();
	      g.add(this.source.subscribe(new MergeObserver(observer, this.maxConcurrent, g)));
	      return g;
	    };
	
	    return MergeObservable;
	
	  }(ObservableBase));
	
	  var MergeObserver = (function () {
	    function MergeObserver(o, max, g) {
	      this.o = o;
	      this.max = max;
	      this.g = g;
	      this.done = false;
	      this.q = [];
	      this.activeCount = 0;
	      this.isStopped = false;
	    }
	    MergeObserver.prototype.handleSubscribe = function (xs) {
	      var sad = new SingleAssignmentDisposable();
	      this.g.add(sad);
	      isPromise(xs) && (xs = observableFromPromise(xs));
	      sad.setDisposable(xs.subscribe(new InnerObserver(this, sad)));
	    };
	    MergeObserver.prototype.onNext = function (innerSource) {
	      if (this.isStopped) { return; }
	        if(this.activeCount < this.max) {
	          this.activeCount++;
	          this.handleSubscribe(innerSource);
	        } else {
	          this.q.push(innerSource);
	        }
	      };
	      MergeObserver.prototype.onError = function (e) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.o.onError(e);
	        }
	      };
	      MergeObserver.prototype.onCompleted = function () {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.done = true;
	          this.activeCount === 0 && this.o.onCompleted();
	        }
	      };
	      MergeObserver.prototype.dispose = function() { this.isStopped = true; };
	      MergeObserver.prototype.fail = function (e) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.o.onError(e);
	          return true;
	        }
	
	        return false;
	      };
	
	      function InnerObserver(parent, sad) {
	        this.parent = parent;
	        this.sad = sad;
	        this.isStopped = false;
	      }
	      InnerObserver.prototype.onNext = function (x) { if(!this.isStopped) { this.parent.o.onNext(x); } };
	      InnerObserver.prototype.onError = function (e) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.parent.o.onError(e);
	        }
	      };
	      InnerObserver.prototype.onCompleted = function () {
	        if(!this.isStopped) {
	          this.isStopped = true;
	          var parent = this.parent;
	          parent.g.remove(this.sad);
	          if (parent.q.length > 0) {
	            parent.handleSubscribe(parent.q.shift());
	          } else {
	            parent.activeCount--;
	            parent.done && parent.activeCount === 0 && parent.o.onCompleted();
	          }
	        }
	      };
	      InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	      InnerObserver.prototype.fail = function (e) {
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.parent.o.onError(e);
	          return true;
	        }
	
	        return false;
	      };
	
	      return MergeObserver;
	  }());
	
	
	
	
	
	  /**
	  * Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
	  * Or merges two observable sequences into a single observable sequence.
	  *
	  * @example
	  * 1 - merged = sources.merge(1);
	  * 2 - merged = source.merge(otherSource);
	  * @param {Mixed} [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
	  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	  */
	  observableProto.merge = function (maxConcurrentOrOther) {
	    return typeof maxConcurrentOrOther !== 'number' ?
	      observableMerge(this, maxConcurrentOrOther) :
	      new MergeObservable(this, maxConcurrentOrOther);
	  };
	
	  /**
	   * Merges all the observable sequences into a single observable sequence.
	   * The scheduler is optional and if not specified, the immediate scheduler is used.
	   * @returns {Observable} The observable sequence that merges the elements of the observable sequences.
	   */
	  var observableMerge = Observable.merge = function () {
	    var scheduler, sources = [], i, len = arguments.length;
	    if (!arguments[0]) {
	      scheduler = immediateScheduler;
	      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
	    } else if (isScheduler(arguments[0])) {
	      scheduler = arguments[0];
	      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
	    } else {
	      scheduler = immediateScheduler;
	      for(i = 0; i < len; i++) { sources.push(arguments[i]); }
	    }
	    if (Array.isArray(sources[0])) {
	      sources = sources[0];
	    }
	    return observableOf(scheduler, sources).mergeAll();
	  };
	
	  var MergeAllObservable = (function (__super__) {
	    inherits(MergeAllObservable, __super__);
	
	    function MergeAllObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }
	
	    MergeAllObservable.prototype.subscribeCore = function (observer) {
	      var g = new CompositeDisposable(), m = new SingleAssignmentDisposable();
	      g.add(m);
	      m.setDisposable(this.source.subscribe(new MergeAllObserver(observer, g)));
	      return g;
	    };
	
	    function MergeAllObserver(o, g) {
	      this.o = o;
	      this.g = g;
	      this.isStopped = false;
	      this.done = false;
	    }
	    MergeAllObserver.prototype.onNext = function(innerSource) {
	      if(this.isStopped) { return; }
	      var sad = new SingleAssignmentDisposable();
	      this.g.add(sad);
	
	      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
	
	      sad.setDisposable(innerSource.subscribe(new InnerObserver(this, sad)));
	    };
	    MergeAllObserver.prototype.onError = function (e) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	      }
	    };
	    MergeAllObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.done = true;
	        this.g.length === 1 && this.o.onCompleted();
	      }
	    };
	    MergeAllObserver.prototype.dispose = function() { this.isStopped = true; };
	    MergeAllObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	
	      return false;
	    };
	
	    function InnerObserver(parent, sad) {
	      this.parent = parent;
	      this.sad = sad;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) { if (!this.isStopped) { this.parent.o.onNext(x); } };
	    InnerObserver.prototype.onError = function (e) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.parent.o.onError(e);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) {
	        var parent = this.parent;
	        this.isStopped = true;
	        parent.g.remove(this.sad);
	        parent.done && parent.g.length === 1 && parent.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.parent.o.onError(e);
	        return true;
	      }
	
	      return false;
	    };
	
	    return MergeAllObservable;
	  }(ObservableBase));
	
	  /**
	  * Merges an observable sequence of observable sequences into an observable sequence.
	  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	  */
	  observableProto.mergeAll = function () {
	    return new MergeAllObservable(this);
	  };
	
	  var CompositeError = Rx.CompositeError = function(errors) {
	    this.name = "NotImplementedError";
	    this.innerErrors = errors;
	    this.message = 'This contains multiple errors. Check the innerErrors';
	    Error.call(this);
	  }
	  CompositeError.prototype = Error.prototype;
	
	  /**
	  * Flattens an Observable that emits Observables into one Observable, in a way that allows an Observer to
	  * receive all successfully emitted items from all of the source Observables without being interrupted by
	  * an error notification from one of them.
	  *
	  * This behaves like Observable.prototype.mergeAll except that if any of the merged Observables notify of an
	  * error via the Observer's onError, mergeDelayError will refrain from propagating that
	  * error notification until all of the merged Observables have finished emitting items.
	  * @param {Array | Arguments} args Arguments or an array to merge.
	  * @returns {Observable} an Observable that emits all of the items emitted by the Observables emitted by the Observable
	  */
	  Observable.mergeDelayError = function() {
	    var args;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	    } else {
	      var len = arguments.length;
	      args = new Array(len);
	      for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    }
	    var source = observableOf(null, args);
	
	    return new AnonymousObservable(function (o) {
	      var group = new CompositeDisposable(),
	        m = new SingleAssignmentDisposable(),
	        isStopped = false,
	        errors = [];
	
	      function setCompletion() {
	        if (errors.length === 0) {
	          o.onCompleted();
	        } else if (errors.length === 1) {
	          o.onError(errors[0]);
	        } else {
	          o.onError(new CompositeError(errors));
	        }
	      }
	
	      group.add(m);
	
	      m.setDisposable(source.subscribe(
	        function (innerSource) {
	          var innerSubscription = new SingleAssignmentDisposable();
	          group.add(innerSubscription);
	
	          // Check for promises support
	          isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
	
	          innerSubscription.setDisposable(innerSource.subscribe(
	            function (x) { o.onNext(x); },
	            function (e) {
	              errors.push(e);
	              group.remove(innerSubscription);
	              isStopped && group.length === 1 && setCompletion();
	            },
	            function () {
	              group.remove(innerSubscription);
	              isStopped && group.length === 1 && setCompletion();
	          }));
	        },
	        function (e) {
	          errors.push(e);
	          isStopped = true;
	          group.length === 1 && setCompletion();
	        },
	        function () {
	          isStopped = true;
	          group.length === 1 && setCompletion();
	        }));
	      return group;
	    });
	  };
	
	  /**
	   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
	   * @param {Observable} second Second observable sequence used to produce results after the first sequence terminates.
	   * @returns {Observable} An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.
	   */
	  observableProto.onErrorResumeNext = function (second) {
	    if (!second) { throw new Error('Second observable is required'); }
	    return onErrorResumeNext([this, second]);
	  };
	
	  /**
	   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
	   *
	   * @example
	   * 1 - res = Rx.Observable.onErrorResumeNext(xs, ys, zs);
	   * 1 - res = Rx.Observable.onErrorResumeNext([xs, ys, zs]);
	   * @returns {Observable} An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.
	   */
	  var onErrorResumeNext = Observable.onErrorResumeNext = function () {
	    var sources = [];
	    if (Array.isArray(arguments[0])) {
	      sources = arguments[0];
	    } else {
	      for(var i = 0, len = arguments.length; i < len; i++) { sources.push(arguments[i]); }
	    }
	    return new AnonymousObservable(function (observer) {
	      var pos = 0, subscription = new SerialDisposable(),
	      cancelable = immediateScheduler.scheduleRecursive(function (self) {
	        var current, d;
	        if (pos < sources.length) {
	          current = sources[pos++];
	          isPromise(current) && (current = observableFromPromise(current));
	          d = new SingleAssignmentDisposable();
	          subscription.setDisposable(d);
	          d.setDisposable(current.subscribe(observer.onNext.bind(observer), self, self));
	        } else {
	          observer.onCompleted();
	        }
	      });
	      return new CompositeDisposable(subscription, cancelable);
	    });
	  };
	
	  /**
	   * Returns the values from the source observable sequence only after the other observable sequence produces a value.
	   * @param {Observable | Promise} other The observable sequence or Promise that triggers propagation of elements of the source sequence.
	   * @returns {Observable} An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.
	   */
	  observableProto.skipUntil = function (other) {
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var isOpen = false;
	      var disposables = new CompositeDisposable(source.subscribe(function (left) {
	        isOpen && o.onNext(left);
	      }, function (e) { o.onError(e); }, function () {
	        isOpen && o.onCompleted();
	      }));
	
	      isPromise(other) && (other = observableFromPromise(other));
	
	      var rightSubscription = new SingleAssignmentDisposable();
	      disposables.add(rightSubscription);
	      rightSubscription.setDisposable(other.subscribe(function () {
	        isOpen = true;
	        rightSubscription.dispose();
	      }, function (e) { o.onError(e); }, function () {
	        rightSubscription.dispose();
	      }));
	
	      return disposables;
	    }, source);
	  };
	
	  var SwitchObservable = (function(__super__) {
	    inherits(SwitchObservable, __super__);
	    function SwitchObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }
	
	    SwitchObservable.prototype.subscribeCore = function (o) {
	      var inner = new SerialDisposable(), s = this.source.subscribe(new SwitchObserver(o, inner));
	      return new CompositeDisposable(s, inner);
	    };
	
	    function SwitchObserver(o, inner) {
	      this.o = o;
	      this.inner = inner;
	      this.stopped = false;
	      this.latest = 0;
	      this.hasLatest = false;
	      this.isStopped = false;
	    }
	    SwitchObserver.prototype.onNext = function (innerSource) {
	      if (this.isStopped) { return; }
	      var d = new SingleAssignmentDisposable(), id = ++this.latest;
	      this.hasLatest = true;
	      this.inner.setDisposable(d);
	      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
	      d.setDisposable(innerSource.subscribe(new InnerObserver(this, id)));
	    };
	    SwitchObserver.prototype.onError = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	      }
	    };
	    SwitchObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.stopped = true;
	        !this.hasLatest && this.o.onCompleted();
	      }
	    };
	    SwitchObserver.prototype.dispose = function () { this.isStopped = true; };
	    SwitchObserver.prototype.fail = function (e) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	
	    function InnerObserver(parent, id) {
	      this.parent = parent;
	      this.id = id;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) {
	      if (this.isStopped) { return; }
	      this.parent.latest === this.id && this.parent.o.onNext(x);
	    };
	    InnerObserver.prototype.onError = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.parent.latest === this.id && this.parent.o.onError(e);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        if (this.parent.latest === this.id) {
	          this.parent.hasLatest = false;
	          this.parent.isStopped && this.parent.o.onCompleted();
	        }
	      }
	    };
	    InnerObserver.prototype.dispose = function () { this.isStopped = true; }
	    InnerObserver.prototype.fail = function (e) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.parent.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	
	    return SwitchObservable;
	  }(ObservableBase));
	
	  /**
	  * Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
	  * @returns {Observable} The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.
	  */
	  observableProto['switch'] = observableProto.switchLatest = function () {
	    return new SwitchObservable(this);
	  };
	
	  var TakeUntilObservable = (function(__super__) {
	    inherits(TakeUntilObservable, __super__);
	
	    function TakeUntilObservable(source, other) {
	      this.source = source;
	      this.other = isPromise(other) ? observableFromPromise(other) : other;
	      __super__.call(this);
	    }
	
	    TakeUntilObservable.prototype.subscribeCore = function(o) {
	      return new CompositeDisposable(
	        this.source.subscribe(o),
	        this.other.subscribe(new InnerObserver(o))
	      );
	    };
	
	    function InnerObserver(o) {
	      this.o = o;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) {
	      if (this.isStopped) { return; }
	      this.o.onCompleted();
	    };
	    InnerObserver.prototype.onError = function (err) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(err);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      !this.isStopped && (this.isStopped = true);
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	
	    return TakeUntilObservable;
	  }(ObservableBase));
	
	  /**
	   * Returns the values from the source observable sequence until the other observable sequence produces a value.
	   * @param {Observable | Promise} other Observable sequence or Promise that terminates propagation of elements of the source sequence.
	   * @returns {Observable} An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.
	   */
	  observableProto.takeUntil = function (other) {
	    return new TakeUntilObservable(this, other);
	  };
	
	  function falseFactory() { return false; }
	
	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function only when the (first) source observable sequence produces an element.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  observableProto.withLatestFrom = function () {
	    var len = arguments.length, args = new Array(len)
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = args.pop(), source = this;
	    Array.isArray(args[0]) && (args = args[0]);
	
	    return new AnonymousObservable(function (observer) {
	      var n = args.length,
	        hasValue = arrayInitialize(n, falseFactory),
	        hasValueAll = false,
	        values = new Array(n);
	
	      var subscriptions = new Array(n + 1);
	      for (var idx = 0; idx < n; idx++) {
	        (function (i) {
	          var other = args[i], sad = new SingleAssignmentDisposable();
	          isPromise(other) && (other = observableFromPromise(other));
	          sad.setDisposable(other.subscribe(function (x) {
	            values[i] = x;
	            hasValue[i] = true;
	            hasValueAll = hasValue.every(identity);
	          }, function (e) { observer.onError(e); }, noop));
	          subscriptions[i] = sad;
	        }(idx));
	      }
	
	      var sad = new SingleAssignmentDisposable();
	      sad.setDisposable(source.subscribe(function (x) {
	        var allValues = [x].concat(values);
	        if (!hasValueAll) { return; }
	        var res = tryCatch(resultSelector).apply(null, allValues);
	        if (res === errorObj) { return observer.onError(res.e); }
	        observer.onNext(res);
	      }, function (e) { observer.onError(e); }, function () {
	        observer.onCompleted();
	      }));
	      subscriptions[n] = sad;
	
	      return new CompositeDisposable(subscriptions);
	    }, this);
	  };
	
	  function falseFactory() { return false; }
	  function emptyArrayFactory() { return []; }
	  function argumentsToArray() {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return args;
	  }
	
	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	   * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	   */
	  observableProto.zip = function () {
	    if (arguments.length === 0) { throw new Error('invalid arguments'); }
	
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);
	
	    var parent = this;
	    args.unshift(parent);
	    return new AnonymousObservable(function (o) {
	      var n = args.length,
	        queues = arrayInitialize(n, emptyArrayFactory),
	        isDone = arrayInitialize(n, falseFactory);
	
	      var subscriptions = new Array(n);
	      for (var idx = 0; idx < n; idx++) {
	        (function (i) {
	          var source = args[i], sad = new SingleAssignmentDisposable();
	
	          isPromise(source) && (source = observableFromPromise(source));
	
	          sad.setDisposable(source.subscribe(function (x) {
	            queues[i].push(x);
	            if (queues.every(function (x) { return x.length > 0; })) {
	              var queuedValues = queues.map(function (x) { return x.shift(); }),
	                  res = tryCatch(resultSelector).apply(parent, queuedValues);
	              if (res === errorObj) { return o.onError(res.e); }
	              o.onNext(res);
	            } else if (isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
	              o.onCompleted();
	            }
	          }, function (e) { o.onError(e); }, function () {
	            isDone[i] = true;
	            isDone.every(identity) && o.onCompleted();
	          }));
	          subscriptions[i] = sad;
	        })(idx);
	      }
	
	      return new CompositeDisposable(subscriptions);
	    }, parent);
	  };
	
	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
	   * @param arguments Observable sources.
	   * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  Observable.zip = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var first = args.shift();
	    return first.zip.apply(first, args);
	  };
	
	function falseFactory() { return false; }
	function emptyArrayFactory() { return []; }
	function argumentsToArray() {
	  var len = arguments.length, args = new Array(len);
	  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	  return args;
	}
	
	/**
	 * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	 * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	 * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	 */
	observableProto.zipIterable = function () {
	  if (arguments.length === 0) { throw new Error('invalid arguments'); }
	
	  var len = arguments.length, args = new Array(len);
	  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	
	  var parent = this;
	  args.unshift(parent);
	  return new AnonymousObservable(function (o) {
	    var n = args.length,
	      queues = arrayInitialize(n, emptyArrayFactory),
	      isDone = arrayInitialize(n, falseFactory);
	
	    var subscriptions = new Array(n);
	    for (var idx = 0; idx < n; idx++) {
	      (function (i) {
	        var source = args[i], sad = new SingleAssignmentDisposable();
	
	        (isArrayLike(source) || isIterable(source)) && (source = observableFrom(source));
	
	        sad.setDisposable(source.subscribe(function (x) {
	          queues[i].push(x);
	          if (queues.every(function (x) { return x.length > 0; })) {
	            var queuedValues = queues.map(function (x) { return x.shift(); }),
	                res = tryCatch(resultSelector).apply(parent, queuedValues);
	            if (res === errorObj) { return o.onError(res.e); }
	            o.onNext(res);
	          } else if (isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
	            o.onCompleted();
	          }
	        }, function (e) { o.onError(e); }, function () {
	          isDone[i] = true;
	          isDone.every(identity) && o.onCompleted();
	        }));
	        subscriptions[i] = sad;
	      })(idx);
	    }
	
	    return new CompositeDisposable(subscriptions);
	  }, parent);
	};
	
	  function asObservable(source) {
	    return function subscribe(o) { return source.subscribe(o); };
	  }
	
	  /**
	   *  Hides the identity of an observable sequence.
	   * @returns {Observable} An observable sequence that hides the identity of the source sequence.
	   */
	  observableProto.asObservable = function () {
	    return new AnonymousObservable(asObservable(this), this);
	  };
	
	  function toArray(x) { return x.toArray(); }
	  function notEmpty(x) { return x.length > 0; }
	
	  /**
	   *  Projects each element of an observable sequence into zero or more buffers which are produced based on element count information.
	   * @param {Number} count Length of each buffer.
	   * @param {Number} [skip] Number of elements to skip between creation of consecutive buffers. If not provided, defaults to the count.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithCount = function (count, skip) {
	    typeof skip !== 'number' && (skip = count);
	    return this.windowWithCount(count, skip)
	      .flatMap(toArray)
	      .filter(notEmpty);
	  };
	
	  /**
	   * Dematerializes the explicit notification values of an observable sequence as implicit notifications.
	   * @returns {Observable} An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.
	   */
	  observableProto.dematerialize = function () {
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(function (x) { return x.accept(o); }, function(e) { o.onError(e); }, function () { o.onCompleted(); });
	    }, this);
	  };
	
	  var DistinctUntilChangedObservable = (function(__super__) {
	    inherits(DistinctUntilChangedObservable, __super__);
	    function DistinctUntilChangedObservable(source, keyFn, comparer) {
	      this.source = source;
	      this.keyFn = keyFn;
	      this.comparer = comparer;
	      __super__.call(this);
	    }
	
	    DistinctUntilChangedObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new DistinctUntilChangedObserver(o, this.keyFn, this.comparer));
	    };
	
	    return DistinctUntilChangedObservable;
	  }(ObservableBase));
	
	  var DistinctUntilChangedObserver = (function(__super__) {
	    inherits(DistinctUntilChangedObserver, __super__);
	    function DistinctUntilChangedObserver(o, keyFn, comparer) {
	      this.o = o;
	      this.keyFn = keyFn;
	      this.comparer = comparer;
	      this.hasCurrentKey = false;
	      this.currentKey = null;
	      __super__.call(this);
	    }
	
	    DistinctUntilChangedObserver.prototype.next = function (x) {
	      var key = x, comparerEquals;
	      if (isFunction(this.keyFn)) {
	        key = tryCatch(this.keyFn)(x);
	        if (key === errorObj) { return this.o.onError(key.e); }
	      }
	      if (this.hasCurrentKey) {
	        comparerEquals = tryCatch(this.comparer)(this.currentKey, key);
	        if (comparerEquals === errorObj) { return this.o.onError(comparerEquals.e); }
	      }
	      if (!this.hasCurrentKey || !comparerEquals) {
	        this.hasCurrentKey = true;
	        this.currentKey = key;
	        this.o.onNext(x);
	      }
	    };
	    DistinctUntilChangedObserver.prototype.error = function(e) {
	      this.o.onError(e);
	    };
	    DistinctUntilChangedObserver.prototype.completed = function () {
	      this.o.onCompleted();
	    };
	
	    return DistinctUntilChangedObserver;
	  }(AbstractObserver));
	
	  /**
	  *  Returns an observable sequence that contains only distinct contiguous elements according to the keyFn and the comparer.
	  * @param {Function} [keyFn] A function to compute the comparison key for each element. If not provided, it projects the value.
	  * @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
	  * @returns {Observable} An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.
	  */
	  observableProto.distinctUntilChanged = function (keyFn, comparer) {
	    comparer || (comparer = defaultComparer);
	    return new DistinctUntilChangedObservable(this, keyFn, comparer);
	  };
	
	  var TapObservable = (function(__super__) {
	    inherits(TapObservable,__super__);
	    function TapObservable(source, observerOrOnNext, onError, onCompleted) {
	      this.source = source;
	      this._oN = observerOrOnNext;
	      this._oE = onError;
	      this._oC = onCompleted;
	      __super__.call(this);
	    }
	
	    TapObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o, this));
	    };
	
	    function InnerObserver(o, p) {
	      this.o = o;
	      this.t = !p._oN || isFunction(p._oN) ?
	        observerCreate(p._oN || noop, p._oE || noop, p._oC || noop) :
	        p._oN;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function(x) {
	      if (this.isStopped) { return; }
	      var res = tryCatch(this.t.onNext).call(this.t, x);
	      if (res === errorObj) { this.o.onError(res.e); }
	      this.o.onNext(x);
	    };
	    InnerObserver.prototype.onError = function(err) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        var res = tryCatch(this.t.onError).call(this.t, err);
	        if (res === errorObj) { return this.o.onError(res.e); }
	        this.o.onError(err);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function() {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        var res = tryCatch(this.t.onCompleted).call(this.t);
	        if (res === errorObj) { return this.o.onError(res.e); }
	        this.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	
	    return TapObservable;
	  }(ObservableBase));
	
	  /**
	  *  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function | Observer} observerOrOnNext Action to invoke for each element in the observable sequence or an o.
	  * @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	  * @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto['do'] = observableProto.tap = observableProto.doAction = function (observerOrOnNext, onError, onCompleted) {
	    return new TapObservable(this, observerOrOnNext, onError, onCompleted);
	  };
	
	  /**
	  *  Invokes an action for each element in the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onNext Action to invoke for each element in the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnNext = observableProto.tapOnNext = function (onNext, thisArg) {
	    return this.tap(typeof thisArg !== 'undefined' ? function (x) { onNext.call(thisArg, x); } : onNext);
	  };
	
	  /**
	  *  Invokes an action upon exceptional termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onError Action to invoke upon exceptional termination of the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnError = observableProto.tapOnError = function (onError, thisArg) {
	    return this.tap(noop, typeof thisArg !== 'undefined' ? function (e) { onError.call(thisArg, e); } : onError);
	  };
	
	  /**
	  *  Invokes an action upon graceful termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onCompleted Action to invoke upon graceful termination of the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnCompleted = observableProto.tapOnCompleted = function (onCompleted, thisArg) {
	    return this.tap(noop, null, typeof thisArg !== 'undefined' ? function () { onCompleted.call(thisArg); } : onCompleted);
	  };
	
	  /**
	   *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
	   * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
	   * @returns {Observable} Source sequence with the action-invoking termination behavior applied.
	   */
	  observableProto['finally'] = function (action) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var subscription = tryCatch(source.subscribe).call(source, observer);
	      if (subscription === errorObj) {
	        action();
	        return thrower(subscription.e);
	      }
	      return disposableCreate(function () {
	        var r = tryCatch(subscription.dispose).call(subscription);
	        action();
	        r === errorObj && thrower(r.e);
	      });
	    }, this);
	  };
	
	  var IgnoreElementsObservable = (function(__super__) {
	    inherits(IgnoreElementsObservable, __super__);
	
	    function IgnoreElementsObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }
	
	    IgnoreElementsObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o));
	    };
	
	    function InnerObserver(o) {
	      this.o = o;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = noop;
	    InnerObserver.prototype.onError = function (err) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(err);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.observer.onError(e);
	        return true;
	      }
	
	      return false;
	    };
	
	    return IgnoreElementsObservable;
	  }(ObservableBase));
	
	  /**
	   *  Ignores all elements in an observable sequence leaving only the termination messages.
	   * @returns {Observable} An empty observable sequence that signals termination, successful or exceptional, of the source sequence.
	   */
	  observableProto.ignoreElements = function () {
	    return new IgnoreElementsObservable(this);
	  };
	
	  /**
	   *  Materializes the implicit notifications of an observable sequence as explicit notification values.
	   * @returns {Observable} An observable sequence containing the materialized notification values from the source sequence.
	   */
	  observableProto.materialize = function () {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      return source.subscribe(function (value) {
	        observer.onNext(notificationCreateOnNext(value));
	      }, function (e) {
	        observer.onNext(notificationCreateOnError(e));
	        observer.onCompleted();
	      }, function () {
	        observer.onNext(notificationCreateOnCompleted());
	        observer.onCompleted();
	      });
	    }, source);
	  };
	
	  /**
	   *  Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
	   * @param {Number} [repeatCount]  Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.
	   * @returns {Observable} The observable sequence producing the elements of the given sequence repeatedly.
	   */
	  observableProto.repeat = function (repeatCount) {
	    return enumerableRepeat(this, repeatCount).concat();
	  };
	
	  /**
	   *  Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
	   *  Note if you encounter an error and want it to retry once, then you must use .retry(2);
	   *
	   * @example
	   *  var res = retried = retry.repeat();
	   *  var res = retried = retry.repeat(2);
	   * @param {Number} [retryCount]  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.
	   * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.
	   */
	  observableProto.retry = function (retryCount) {
	    return enumerableRepeat(this, retryCount).catchError();
	  };
	
	  /**
	   *  Repeats the source observable sequence upon error each time the notifier emits or until it successfully terminates. 
	   *  if the notifier completes, the observable sequence completes.
	   *
	   * @example
	   *  var timer = Observable.timer(500);
	   *  var source = observable.retryWhen(timer);
	   * @param {Observable} [notifier] An observable that triggers the retries or completes the observable with onNext or onCompleted respectively.
	   * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.
	   */
	  observableProto.retryWhen = function (notifier) {
	    return enumerableRepeat(this).catchErrorWhen(notifier);
	  };
	  var ScanObservable = (function(__super__) {
	    inherits(ScanObservable, __super__);
	    function ScanObservable(source, accumulator, hasSeed, seed) {
	      this.source = source;
	      this.accumulator = accumulator;
	      this.hasSeed = hasSeed;
	      this.seed = seed;
	      __super__.call(this);
	    }
	
	    ScanObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o,this));
	    };
	
	    return ScanObservable;
	  }(ObservableBase));
	
	  function InnerObserver(o, parent) {
	    this.o = o;
	    this.accumulator = parent.accumulator;
	    this.hasSeed = parent.hasSeed;
	    this.seed = parent.seed;
	    this.hasAccumulation = false;
	    this.accumulation = null;
	    this.hasValue = false;
	    this.isStopped = false;
	  }
	  InnerObserver.prototype = {
	    onNext: function (x) {
	      if (this.isStopped) { return; }
	      !this.hasValue && (this.hasValue = true);
	      if (this.hasAccumulation) {
	        this.accumulation = tryCatch(this.accumulator)(this.accumulation, x);
	      } else {
	        this.accumulation = this.hasSeed ? tryCatch(this.accumulator)(this.seed, x) : x;
	        this.hasAccumulation = true;
	      }
	      if (this.accumulation === errorObj) { return this.o.onError(this.accumulation.e); }
	      this.o.onNext(this.accumulation);
	    },
	    onError: function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	      }
	    },
	    onCompleted: function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        !this.hasValue && this.hasSeed && this.o.onNext(this.seed);
	        this.o.onCompleted();
	      }
	    },
	    dispose: function() { this.isStopped = true; },
	    fail: function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    }
	  };
	
	  /**
	  *  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
	  *  For aggregation behavior with no intermediate results, see Observable.aggregate.
	  * @param {Mixed} [seed] The initial accumulator value.
	  * @param {Function} accumulator An accumulator function to be invoked on each element.
	  * @returns {Observable} An observable sequence containing the accumulated values.
	  */
	  observableProto.scan = function () {
	    var hasSeed = false, seed, accumulator = arguments[0];
	    if (arguments.length === 2) {
	      hasSeed = true;
	      seed = arguments[1];
	    }
	    return new ScanObservable(this, accumulator, hasSeed, seed);
	  };
	
	  /**
	   *  Bypasses a specified number of elements at the end of an observable sequence.
	   * @description
	   *  This operator accumulates a queue with a length enough to store the first `count` elements. As more elements are
	   *  received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed.
	   * @param count Number of elements to bypass at the end of the source sequence.
	   * @returns {Observable} An observable sequence containing the source sequence elements except for the bypassed ones at the end.
	   */
	  observableProto.skipLast = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        q.push(x);
	        q.length > count && o.onNext(q.shift());
	      }, function (e) { o.onError(e); }, function () { o.onCompleted(); });
	    }, source);
	  };
	
	  /**
	   *  Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.
	   *  @example
	   *  var res = source.startWith(1, 2, 3);
	   *  var res = source.startWith(Rx.Scheduler.timeout, 1, 2, 3);
	   * @param {Arguments} args The specified values to prepend to the observable sequence
	   * @returns {Observable} The source sequence prepended with the specified values.
	   */
	  observableProto.startWith = function () {
	    var values, scheduler, start = 0;
	    if (!!arguments.length && isScheduler(arguments[0])) {
	      scheduler = arguments[0];
	      start = 1;
	    } else {
	      scheduler = immediateScheduler;
	    }
	    for(var args = [], i = start, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	    return enumerableOf([observableFromArray(args, scheduler), this]).concat();
	  };
	
	  /**
	   *  Returns a specified number of contiguous elements from the end of an observable sequence.
	   * @description
	   *  This operator accumulates a buffer with a length enough to store elements count elements. Upon completion of
	   *  the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
	   * @param {Number} count Number of elements to take from the end of the source sequence.
	   * @returns {Observable} An observable sequence containing the specified number of elements from the end of the source sequence.
	   */
	  observableProto.takeLast = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        q.push(x);
	        q.length > count && q.shift();
	      }, function (e) { o.onError(e); }, function () {
	        while (q.length > 0) { o.onNext(q.shift()); }
	        o.onCompleted();
	      });
	    }, source);
	  };
	
	  /**
	   *  Returns an array with the specified number of contiguous elements from the end of an observable sequence.
	   *
	   * @description
	   *  This operator accumulates a buffer with a length enough to store count elements. Upon completion of the
	   *  source sequence, this buffer is produced on the result sequence.
	   * @param {Number} count Number of elements to take from the end of the source sequence.
	   * @returns {Observable} An observable sequence containing a single array with the specified number of elements from the end of the source sequence.
	   */
	  observableProto.takeLastBuffer = function (count) {
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        q.push(x);
	        q.length > count && q.shift();
	      }, function (e) { o.onError(e); }, function () {
	        o.onNext(q);
	        o.onCompleted();
	      });
	    }, source);
	  };
	
	  /**
	   *  Projects each element of an observable sequence into zero or more windows which are produced based on element count information.
	   *
	   *  var res = xs.windowWithCount(10);
	   *  var res = xs.windowWithCount(10, 1);
	   * @param {Number} count Length of each window.
	   * @param {Number} [skip] Number of elements to skip between creation of consecutive windows. If not specified, defaults to the count.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithCount = function (count, skip) {
	    var source = this;
	    +count || (count = 0);
	    Math.abs(count) === Infinity && (count = 0);
	    if (count <= 0) { throw new ArgumentOutOfRangeError(); }
	    skip == null && (skip = count);
	    +skip || (skip = 0);
	    Math.abs(skip) === Infinity && (skip = 0);
	
	    if (skip <= 0) { throw new ArgumentOutOfRangeError(); }
	    return new AnonymousObservable(function (observer) {
	      var m = new SingleAssignmentDisposable(),
	        refCountDisposable = new RefCountDisposable(m),
	        n = 0,
	        q = [];
	
	      function createWindow () {
	        var s = new Subject();
	        q.push(s);
	        observer.onNext(addRef(s, refCountDisposable));
	      }
	
	      createWindow();
	
	      m.setDisposable(source.subscribe(
	        function (x) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onNext(x); }
	          var c = n - count + 1;
	          c >= 0 && c % skip === 0 && q.shift().onCompleted();
	          ++n % skip === 0 && createWindow();
	        },
	        function (e) {
	          while (q.length > 0) { q.shift().onError(e); }
	          observer.onError(e);
	        },
	        function () {
	          while (q.length > 0) { q.shift().onCompleted(); }
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };
	
	  function concatMap(source, selector, thisArg) {
	    var selectorFunc = bindCallback(selector, thisArg, 3);
	    return source.map(function (x, i) {
	      var result = selectorFunc(x, i, source);
	      isPromise(result) && (result = observableFromPromise(result));
	      (isArrayLike(result) || isIterable(result)) && (result = observableFrom(result));
	      return result;
	    }).concatAll();
	  }
	
	  /**
	   *  One of the Following:
	   *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
	   *
	   * @example
	   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); });
	   *  Or:
	   *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
	   *
	   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
	   *  Or:
	   *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
	   *
	   *  var res = source.concatMap(Rx.Observable.fromArray([1,2,3]));
	   * @param {Function} selector A transform function to apply to each element or an observable sequence to project each element from the
	   * source sequence onto which could be either an observable or Promise.
	   * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
	   */
	  observableProto.selectConcat = observableProto.concatMap = function (selector, resultSelector, thisArg) {
	    if (isFunction(selector) && isFunction(resultSelector)) {
	      return this.concatMap(function (x, i) {
	        var selectorResult = selector(x, i);
	        isPromise(selectorResult) && (selectorResult = observableFromPromise(selectorResult));
	        (isArrayLike(selectorResult) || isIterable(selectorResult)) && (selectorResult = observableFrom(selectorResult));
	
	        return selectorResult.map(function (y, i2) {
	          return resultSelector(x, y, i, i2);
	        });
	      });
	    }
	    return isFunction(selector) ?
	      concatMap(this, selector, thisArg) :
	      concatMap(this, function () { return selector; });
	  };
	
	  /**
	   * Projects each notification of an observable sequence to an observable sequence and concats the resulting observable sequences into one observable sequence.
	   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
	   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
	   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
	   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
	   */
	  observableProto.concatMapObserver = observableProto.selectConcatObserver = function(onNext, onError, onCompleted, thisArg) {
	    var source = this,
	        onNextFunc = bindCallback(onNext, thisArg, 2),
	        onErrorFunc = bindCallback(onError, thisArg, 1),
	        onCompletedFunc = bindCallback(onCompleted, thisArg, 0);
	    return new AnonymousObservable(function (observer) {
	      var index = 0;
	      return source.subscribe(
	        function (x) {
	          var result;
	          try {
	            result = onNextFunc(x, index++);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	        },
	        function (err) {
	          var result;
	          try {
	            result = onErrorFunc(err);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        },
	        function () {
	          var result;
	          try {
	            result = onCompletedFunc();
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        });
	    }, this).concatAll();
	  };
	
	    /**
	     *  Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.
	     *
	     *  var res = obs = xs.defaultIfEmpty();
	     *  2 - obs = xs.defaultIfEmpty(false);
	     *
	     * @memberOf Observable#
	     * @param defaultValue The value to return if the sequence is empty. If not provided, this defaults to null.
	     * @returns {Observable} An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself.
	     */
	    observableProto.defaultIfEmpty = function (defaultValue) {
	      var source = this;
	      defaultValue === undefined && (defaultValue = null);
	      return new AnonymousObservable(function (observer) {
	        var found = false;
	        return source.subscribe(function (x) {
	          found = true;
	          observer.onNext(x);
	        },
	        function (e) { observer.onError(e); }, 
	        function () {
	          !found && observer.onNext(defaultValue);
	          observer.onCompleted();
	        });
	      }, source);
	    };
	
	  // Swap out for Array.findIndex
	  function arrayIndexOfComparer(array, item, comparer) {
	    for (var i = 0, len = array.length; i < len; i++) {
	      if (comparer(array[i], item)) { return i; }
	    }
	    return -1;
	  }
	
	  function HashSet(comparer) {
	    this.comparer = comparer;
	    this.set = [];
	  }
	  HashSet.prototype.push = function(value) {
	    var retValue = arrayIndexOfComparer(this.set, value, this.comparer) === -1;
	    retValue && this.set.push(value);
	    return retValue;
	  };
	
	  /**
	   *  Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer.
	   *  Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large.
	   *
	   * @example
	   *  var res = obs = xs.distinct();
	   *  2 - obs = xs.distinct(function (x) { return x.id; });
	   *  2 - obs = xs.distinct(function (x) { return x.id; }, function (a,b) { return a === b; });
	   * @param {Function} [keySelector]  A function to compute the comparison key for each element.
	   * @param {Function} [comparer]  Used to compare items in the collection.
	   * @returns {Observable} An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.
	   */
	  observableProto.distinct = function (keySelector, comparer) {
	    var source = this;
	    comparer || (comparer = defaultComparer);
	    return new AnonymousObservable(function (o) {
	      var hashSet = new HashSet(comparer);
	      return source.subscribe(function (x) {
	        var key = x;
	
	        if (keySelector) {
	          try {
	            key = keySelector(x);
	          } catch (e) {
	            o.onError(e);
	            return;
	          }
	        }
	        hashSet.push(key) && o.onNext(x);
	      },
	      function (e) { o.onError(e); }, function () { o.onCompleted(); });
	    }, this);
	  };
	
	  /**
	   *  Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.
	   *
	   * @example
	   *  var res = observable.groupBy(function (x) { return x.id; });
	   *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; });
	   *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; }, function (x) { return x.toString(); });
	   * @param {Function} keySelector A function to extract the key for each element.
	   * @param {Function} [elementSelector]  A function to map each source element to an element in an observable group.
	   * @returns {Observable} A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
	   */
	  observableProto.groupBy = function (keySelector, elementSelector) {
	    return this.groupByUntil(keySelector, elementSelector, observableNever);
	  };
	
	    /**
	     *  Groups the elements of an observable sequence according to a specified key selector function.
	     *  A duration selector function is used to control the lifetime of groups. When a group expires, it receives an OnCompleted notification. When a new element with the same
	     *  key value as a reclaimed group occurs, the group will be reborn with a new lifetime request.
	     *
	     * @example
	     *  var res = observable.groupByUntil(function (x) { return x.id; }, null,  function () { return Rx.Observable.never(); });
	     *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); });
	     *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); }, function (x) { return x.toString(); });
	     * @param {Function} keySelector A function to extract the key for each element.
	     * @param {Function} durationSelector A function to signal the expiration of a group.
	     * @returns {Observable}
	     *  A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
	     *  If a group's lifetime expires, a new group with the same key value can be created once an element with such a key value is encoutered.
	     *
	     */
	    observableProto.groupByUntil = function (keySelector, elementSelector, durationSelector) {
	      var source = this;
	      return new AnonymousObservable(function (o) {
	        var map = new Map(),
	          groupDisposable = new CompositeDisposable(),
	          refCountDisposable = new RefCountDisposable(groupDisposable),
	          handleError = function (e) { return function (item) { item.onError(e); }; };
	
	        groupDisposable.add(
	          source.subscribe(function (x) {
	            var key = tryCatch(keySelector)(x);
	            if (key === errorObj) {
	              map.forEach(handleError(key.e));
	              return o.onError(key.e);
	            }
	
	            var fireNewMapEntry = false, writer = map.get(key);
	            if (writer === undefined) {
	              writer = new Subject();
	              map.set(key, writer);
	              fireNewMapEntry = true;
	            }
	
	            if (fireNewMapEntry) {
	              var group = new GroupedObservable(key, writer, refCountDisposable),
	                durationGroup = new GroupedObservable(key, writer);
	              var duration = tryCatch(durationSelector)(durationGroup);
	              if (duration === errorObj) {
	                map.forEach(handleError(duration.e));
	                return o.onError(duration.e);
	              }
	
	              o.onNext(group);
	
	              var md = new SingleAssignmentDisposable();
	              groupDisposable.add(md);
	
	              md.setDisposable(duration.take(1).subscribe(
	                noop,
	                function (e) {
	                  map.forEach(handleError(e));
	                  o.onError(e);
	                },
	                function () {
	                  if (map['delete'](key)) { writer.onCompleted(); }
	                  groupDisposable.remove(md);
	                }));
	            }
	
	            var element = x;
	            if (isFunction(elementSelector)) {
	              element = tryCatch(elementSelector)(x);
	              if (element === errorObj) {
	                map.forEach(handleError(element.e));
	                return o.onError(element.e);
	              }
	            }
	
	            writer.onNext(element);
	        }, function (e) {
	          map.forEach(handleError(e));
	          o.onError(e);
	        }, function () {
	          map.forEach(function (item) { item.onCompleted(); });
	          o.onCompleted();
	        }));
	
	      return refCountDisposable;
	    }, source);
	  };
	
	  var MapObservable = (function (__super__) {
	    inherits(MapObservable, __super__);
	
	    function MapObservable(source, selector, thisArg) {
	      this.source = source;
	      this.selector = bindCallback(selector, thisArg, 3);
	      __super__.call(this);
	    }
	
	    function innerMap(selector, self) {
	      return function (x, i, o) { return selector.call(this, self.selector(x, i, o), i, o); }
	    }
	
	    MapObservable.prototype.internalMap = function (selector, thisArg) {
	      return new MapObservable(this.source, innerMap(selector, this), thisArg);
	    };
	
	    MapObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.selector, this));
	    };
	
	    function InnerObserver(o, selector, source) {
	      this.o = o;
	      this.selector = selector;
	      this.source = source;
	      this.i = 0;
	      this.isStopped = false;
	    }
	
	    InnerObserver.prototype.onNext = function(x) {
	      if (this.isStopped) { return; }
	      var result = tryCatch(this.selector)(x, this.i++, this.source);
	      if (result === errorObj) { return this.o.onError(result.e); }
	      this.o.onNext(result);
	    };
	    InnerObserver.prototype.onError = function (e) {
	      if(!this.isStopped) { this.isStopped = true; this.o.onError(e); }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) { this.isStopped = true; this.o.onCompleted(); }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	
	      return false;
	    };
	
	    return MapObservable;
	
	  }(ObservableBase));
	
	  /**
	  * Projects each element of an observable sequence into a new form by incorporating the element's index.
	  * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source.
	  */
	  observableProto.map = observableProto.select = function (selector, thisArg) {
	    var selectorFn = typeof selector === 'function' ? selector : function () { return selector; };
	    return this instanceof MapObservable ?
	      this.internalMap(selectorFn, thisArg) :
	      new MapObservable(this, selectorFn, thisArg);
	  };
	
	  function plucker(args, len) {
	    return function mapper(x) {
	      var currentProp = x;
	      for (var i = 0; i < len; i++) {
	        var p = currentProp[args[i]];
	        if (typeof p !== 'undefined') {
	          currentProp = p;
	        } else {
	          return undefined;
	        }
	      }
	      return currentProp;
	    }
	  }
	
	  /**
	   * Retrieves the value of a specified nested property from all elements in
	   * the Observable sequence.
	   * @param {Arguments} arguments The nested properties to pluck.
	   * @returns {Observable} Returns a new Observable sequence of property values.
	   */
	  observableProto.pluck = function () {
	    var len = arguments.length, args = new Array(len);
	    if (len === 0) { throw new Error('List of properties cannot be empty.'); }
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return this.map(plucker(args, len));
	  };
	
	observableProto.flatMap = observableProto.selectMany = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).mergeAll();
	};
	
	
	//
	//Rx.Observable.prototype.flatMapWithMaxConcurrent = function(limit, selector, resultSelector, thisArg) {
	//    return new FlatMapObservable(this, selector, resultSelector, thisArg).merge(limit);
	//};
	//
	
	  /**
	   * Projects each notification of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
	   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
	   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
	   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
	   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
	   */
	  observableProto.flatMapObserver = observableProto.selectManyObserver = function (onNext, onError, onCompleted, thisArg) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var index = 0;
	
	      return source.subscribe(
	        function (x) {
	          var result;
	          try {
	            result = onNext.call(thisArg, x, index++);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	        },
	        function (err) {
	          var result;
	          try {
	            result = onError.call(thisArg, err);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        },
	        function () {
	          var result;
	          try {
	            result = onCompleted.call(thisArg);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        });
	    }, source).mergeAll();
	  };
	
	Rx.Observable.prototype.flatMapLatest = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchLatest();
	};
	  var SkipObservable = (function(__super__) {
	    inherits(SkipObservable, __super__);
	    function SkipObservable(source, count) {
	      this.source = source;
	      this.skipCount = count;
	      __super__.call(this);
	    }
	    
	    SkipObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.skipCount));
	    };
	    
	    function InnerObserver(o, c) {
	      this.c = c;
	      this.r = c;
	      this.o = o;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) {
	      if (this.isStopped) { return; }
	      if (this.r <= 0) { 
	        this.o.onNext(x);
	      } else {
	        this.r--;
	      }
	    };
	    InnerObserver.prototype.onError = function(e) {
	      if (!this.isStopped) { this.isStopped = true; this.o.onError(e); }
	    };
	    InnerObserver.prototype.onCompleted = function() {
	      if (!this.isStopped) { this.isStopped = true; this.o.onCompleted(); }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function(e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	    
	    return SkipObservable;
	  }(ObservableBase));  
	  
	  /**
	   * Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.
	   * @param {Number} count The number of elements to skip before returning the remaining elements.
	   * @returns {Observable} An observable sequence that contains the elements that occur after the specified index in the input sequence.
	   */
	  observableProto.skip = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    return new SkipObservable(this, count);
	  };
	  /**
	   *  Bypasses elements in an observable sequence as long as a specified condition is true and then returns the remaining elements.
	   *  The element's index is used in the logic of the predicate function.
	   *
	   *  var res = source.skipWhile(function (value) { return value < 10; });
	   *  var res = source.skipWhile(function (value, index) { return value < 10 || index < 10; });
	   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
	   */
	  observableProto.skipWhile = function (predicate, thisArg) {
	    var source = this,
	        callback = bindCallback(predicate, thisArg, 3);
	    return new AnonymousObservable(function (o) {
	      var i = 0, running = false;
	      return source.subscribe(function (x) {
	        if (!running) {
	          try {
	            running = !callback(x, i++, source);
	          } catch (e) {
	            o.onError(e);
	            return;
	          }
	        }
	        running && o.onNext(x);
	      }, function (e) { o.onError(e); }, function () { o.onCompleted(); });
	    }, source);
	  };
	
	  /**
	   *  Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
	   *
	   *  var res = source.take(5);
	   *  var res = source.take(0, Rx.Scheduler.timeout);
	   * @param {Number} count The number of elements to return.
	   * @param {Scheduler} [scheduler] Scheduler used to produce an OnCompleted message in case <paramref name="count count</paramref> is set to 0.
	   * @returns {Observable} An observable sequence that contains the specified number of elements from the start of the input sequence.
	   */
	  observableProto.take = function (count, scheduler) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    if (count === 0) { return observableEmpty(scheduler); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var remaining = count;
	      return source.subscribe(function (x) {
	        if (remaining-- > 0) {
	          o.onNext(x);
	          remaining <= 0 && o.onCompleted();
	        }
	      }, function (e) { o.onError(e); }, function () { o.onCompleted(); });
	    }, source);
	  };
	
	  /**
	   *  Returns elements from an observable sequence as long as a specified condition is true.
	   *  The element's index is used in the logic of the predicate function.
	   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.
	   */
	  observableProto.takeWhile = function (predicate, thisArg) {
	    var source = this,
	        callback = bindCallback(predicate, thisArg, 3);
	    return new AnonymousObservable(function (o) {
	      var i = 0, running = true;
	      return source.subscribe(function (x) {
	        if (running) {
	          try {
	            running = callback(x, i++, source);
	          } catch (e) {
	            o.onError(e);
	            return;
	          }
	          if (running) {
	            o.onNext(x);
	          } else {
	            o.onCompleted();
	          }
	        }
	      }, function (e) { o.onError(e); }, function () { o.onCompleted(); });
	    }, source);
	  };
	
	  var FilterObservable = (function (__super__) {
	    inherits(FilterObservable, __super__);
	
	    function FilterObservable(source, predicate, thisArg) {
	      this.source = source;
	      this.predicate = bindCallback(predicate, thisArg, 3);
	      __super__.call(this);
	    }
	
	    FilterObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.predicate, this));
	    };
	    
	    function innerPredicate(predicate, self) {
	      return function(x, i, o) { return self.predicate(x, i, o) && predicate.call(this, x, i, o); }
	    }
	
	    FilterObservable.prototype.internalFilter = function(predicate, thisArg) {
	      return new FilterObservable(this.source, innerPredicate(predicate, this), thisArg);
	    };
	    
	    function InnerObserver(o, predicate, source) {
	      this.o = o;
	      this.predicate = predicate;
	      this.source = source;
	      this.i = 0;
	      this.isStopped = false;
	    }
	  
	    InnerObserver.prototype.onNext = function(x) {
	      if (this.isStopped) { return; }
	      var shouldYield = tryCatch(this.predicate)(x, this.i++, this.source);
	      if (shouldYield === errorObj) {
	        return this.o.onError(shouldYield.e);
	      }
	      shouldYield && this.o.onNext(x);
	    };
	    InnerObserver.prototype.onError = function (e) {
	      if(!this.isStopped) { this.isStopped = true; this.o.onError(e); }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) { this.isStopped = true; this.o.onCompleted(); }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	
	    return FilterObservable;
	
	  }(ObservableBase));
	
	  /**
	  *  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
	  * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} An observable sequence that contains elements from the input sequence that satisfy the condition.
	  */
	  observableProto.filter = observableProto.where = function (predicate, thisArg) {
	    return this instanceof FilterObservable ? this.internalFilter(predicate, thisArg) :
	      new FilterObservable(this, predicate, thisArg);
	  };
	
	  function extremaBy(source, keySelector, comparer) {
	    return new AnonymousObservable(function (o) {
	      var hasValue = false, lastKey = null, list = [];
	      return source.subscribe(function (x) {
	        var comparison, key;
	        try {
	          key = keySelector(x);
	        } catch (ex) {
	          o.onError(ex);
	          return;
	        }
	        comparison = 0;
	        if (!hasValue) {
	          hasValue = true;
	          lastKey = key;
	        } else {
	          try {
	            comparison = comparer(key, lastKey);
	          } catch (ex1) {
	            o.onError(ex1);
	            return;
	          }
	        }
	        if (comparison > 0) {
	          lastKey = key;
	          list = [];
	        }
	        if (comparison >= 0) { list.push(x); }
	      }, function (e) { o.onError(e); }, function () {
	        o.onNext(list);
	        o.onCompleted();
	      });
	    }, source);
	  }
	
	  function firstOnly(x) {
	    if (x.length === 0) { throw new EmptyError(); }
	    return x[0];
	  }
	
	  var ReduceObservable = (function(__super__) {
	    inherits(ReduceObservable, __super__);
	    function ReduceObservable(source, acc, hasSeed, seed) {
	      this.source = source;
	      this.acc = acc;
	      this.hasSeed = hasSeed;
	      this.seed = seed;
	      __super__.call(this);
	    }
	
	    ReduceObservable.prototype.subscribeCore = function(observer) {
	      return this.source.subscribe(new InnerObserver(observer,this));
	    };
	
	    function InnerObserver(o, parent) {
	      this.o = o;
	      this.acc = parent.acc;
	      this.hasSeed = parent.hasSeed;
	      this.seed = parent.seed;
	      this.hasAccumulation = false;
	      this.result = null;
	      this.hasValue = false;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = function (x) {
	      if (this.isStopped) { return; }
	      !this.hasValue && (this.hasValue = true);
	      if (this.hasAccumulation) {
	        this.result = tryCatch(this.acc)(this.result, x);
	      } else {
	        this.result = this.hasSeed ? tryCatch(this.acc)(this.seed, x) : x;
	        this.hasAccumulation = true;
	      }
	      if (this.result === errorObj) { this.o.onError(this.result.e); }
	    };
	    InnerObserver.prototype.onError = function (e) { 
	      if (!this.isStopped) { this.isStopped = true; this.o.onError(e); } 
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.hasValue && this.o.onNext(this.result);
	        !this.hasValue && this.hasSeed && this.o.onNext(this.seed);
	        !this.hasValue && !this.hasSeed && this.o.onError(new EmptyError());
	        this.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function () { this.isStopped = true; };
	    InnerObserver.prototype.fail = function(e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(e);
	        return true;
	      }
	      return false;
	    };
	
	    return ReduceObservable;
	  }(ObservableBase));
	
	  /**
	  * Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
	  * For aggregation behavior with incremental intermediate results, see Observable.scan.
	  * @param {Function} accumulator An accumulator function to be invoked on each element.
	  * @param {Any} [seed] The initial accumulator value.
	  * @returns {Observable} An observable sequence containing a single element with the final accumulator value.
	  */
	  observableProto.reduce = function (accumulator) {
	    var hasSeed = false;
	    if (arguments.length === 2) {
	      hasSeed = true;
	      var seed = arguments[1];
	    }
	    return new ReduceObservable(this, accumulator, hasSeed, seed);
	  };
	
	  var SomeObserver = (function (__super__) {
	    inherits(SomeObserver, __super__);
	
	    function SomeObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }
	
	    SomeObserver.prototype.next = function (x) {
	      var result = tryCatch(this._fn)(x, this._i++, this._s);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      if (Boolean(result)) {
	        this._o.onNext(true);
	        this._o.onCompleted();
	      }
	    };
	    SomeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SomeObserver.prototype.completed = function () {
	      this._o.onNext(false);
	      this._o.onCompleted();
	    };
	
	    return SomeObserver;
	  }(AbstractObserver));
	
	  /**
	   * Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence.
	   * @param {Function} [predicate] A function to test each element for a condition.
	   * @returns {Observable} An observable sequence containing a single element determining whether any elements in the source sequence pass the test in the specified predicate if given, else if any items are in the sequence.
	   */
	  observableProto.some = function (predicate, thisArg) {
	    var source = this, fn = bindCallback(predicate, thisArg, 3);
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new SomeObserver(o, fn, source));
	    });
	  };
	
	  var IsEmptyObserver = (function(__super__) {
	    inherits(IsEmptyObserver, __super__);
	    function IsEmptyObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }
	
	    IsEmptyObserver.prototype.next = function () {
	      this._o.onNext(false);
	      this._o.onCompleted();
	    };
	    IsEmptyObserver.prototype.error = function (e) { this._o.onError(e); };
	    IsEmptyObserver.prototype.completed = function () {
	      this._o.onNext(true);
	      this._o.onCompleted();
	    };
	
	    return IsEmptyObserver;
	  }(AbstractObserver));
	
	  /**
	   * Determines whether an observable sequence is empty.
	   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence is empty.
	   */
	  observableProto.isEmpty = function () {
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new IsEmptyObserver(o));
	    }, source);
	  };
	
	  var EveryObserver = (function (__super__) {
	    inherits(EveryObserver, __super__);
	
	    function EveryObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }
	
	    EveryObserver.prototype.next = function (x) {
	      var result = tryCatch(this._fn)(x, this._i++, this._s);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      if (!Boolean(result)) {
	        this._o.onNext(false);
	        this._o.onCompleted();
	      }
	    };
	    EveryObserver.prototype.error = function (e) { this._o.onError(e); };
	    EveryObserver.prototype.completed = function () {
	      this._o.onNext(true);
	      this._o.onCompleted();
	    };
	
	    return EveryObserver;
	  }(AbstractObserver));
	
	  /**
	   * Determines whether all elements of an observable sequence satisfy a condition.
	   * @param {Function} [predicate] A function to test each element for a condition.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.
	   */
	  observableProto.every = function (predicate, thisArg) {
	    var source = this, fn = bindCallback(predicate, thisArg, 3);
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new EveryObserver(o, fn, source));
	    }, this);
	  };
	
	  /**
	   * Determines whether an observable sequence includes a specified element with an optional equality comparer.
	   * @param searchElement The value to locate in the source sequence.
	   * @param {Number} [fromIndex] An equality comparer to compare elements.
	   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence includes an element that has the specified value from the given index.
	   */
	  observableProto.includes = function (searchElement, fromIndex) {
	    var source = this;
	    function comparer(a, b) {
	      return (a === 0 && b === 0) || (a === b || (isNaN(a) && isNaN(b)));
	    }
	    return new AnonymousObservable(function (o) {
	      var i = 0, n = +fromIndex || 0;
	      Math.abs(n) === Infinity && (n = 0);
	      if (n < 0) {
	        o.onNext(false);
	        o.onCompleted();
	        return disposableEmpty;
	      }
	      return source.subscribe(
	        function (x) {
	          if (i++ >= n && comparer(x, searchElement)) {
	            o.onNext(true);
	            o.onCompleted();
	          }
	        },
	        function (e) { o.onError(e); },
	        function () {
	          o.onNext(false);
	          o.onCompleted();
	        });
	    }, this);
	  };
	
	  /**
	   * @deprecated use #includes instead.
	   */
	  observableProto.contains = function (searchElement, fromIndex) {
	    //deprecate('contains', 'includes');
	    observableProto.includes(searchElement, fromIndex);
	  };
	
	  /**
	   * Returns an observable sequence containing a value that represents how many elements in the specified observable sequence satisfy a condition if provided, else the count of items.
	   * @example
	   * res = source.count();
	   * res = source.count(function (x) { return x > 3; });
	   * @param {Function} [predicate]A function to test each element for a condition.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with a number that represents how many elements in the input sequence satisfy the condition in the predicate function if provided, else the count of items in the sequence.
	   */
	  observableProto.count = function (predicate, thisArg) {
	    return predicate ?
	      this.filter(predicate, thisArg).count() :
	      this.reduce(function (count) { return count + 1; }, 0);
	  };
	
	  /**
	   * Returns the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   * @param {Any} searchElement Element to locate in the array.
	   * @param {Number} [fromIndex] The index to start the search.  If not specified, defaults to 0.
	   * @returns {Observable} And observable sequence containing the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   */
	  observableProto.indexOf = function(searchElement, fromIndex) {
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var i = 0, n = +fromIndex || 0;
	      Math.abs(n) === Infinity && (n = 0);
	      if (n < 0) {
	        o.onNext(-1);
	        o.onCompleted();
	        return disposableEmpty;
	      }
	      return source.subscribe(
	        function (x) {
	          if (i >= n && x === searchElement) {
	            o.onNext(i);
	            o.onCompleted();
	          }
	          i++;
	        },
	        function (e) { o.onError(e); },
	        function () {
	          o.onNext(-1);
	          o.onCompleted();
	        });
	    }, source);
	  };
	
	  /**
	   * Computes the sum of a sequence of values that are obtained by invoking an optional transform function on each element of the input sequence, else if not specified computes the sum on each item in the sequence.
	   * @param {Function} [selector] A transform function to apply to each element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with the sum of the values in the source sequence.
	   */
	  observableProto.sum = function (keySelector, thisArg) {
	    return keySelector && isFunction(keySelector) ?
	      this.map(keySelector, thisArg).sum() :
	      this.reduce(function (prev, curr) { return prev + curr; }, 0);
	  };
	
	  /**
	   * Returns the elements in an observable sequence with the minimum key value according to the specified comparer.
	   * @example
	   * var res = source.minBy(function (x) { return x.value; });
	   * var res = source.minBy(function (x) { return x.value; }, function (x, y) { return x - y; });
	   * @param {Function} keySelector Key selector function.
	   * @param {Function} [comparer] Comparer used to compare key values.
	   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a minimum key value.
	   */
	  observableProto.minBy = function (keySelector, comparer) {
	    comparer || (comparer = defaultSubComparer);
	    return extremaBy(this, keySelector, function (x, y) { return comparer(x, y) * -1; });
	  };
	
	  /**
	   * Returns the minimum element in an observable sequence according to the optional comparer else a default greater than less than check.
	   * @example
	   * var res = source.min();
	   * var res = source.min(function (x, y) { return x.value - y.value; });
	   * @param {Function} [comparer] Comparer used to compare elements.
	   * @returns {Observable} An observable sequence containing a single element with the minimum element in the source sequence.
	   */
	  observableProto.min = function (comparer) {
	    return this.minBy(identity, comparer).map(function (x) { return firstOnly(x); });
	  };
	
	  /**
	   * Returns the elements in an observable sequence with the maximum  key value according to the specified comparer.
	   * @example
	   * var res = source.maxBy(function (x) { return x.value; });
	   * var res = source.maxBy(function (x) { return x.value; }, function (x, y) { return x - y;; });
	   * @param {Function} keySelector Key selector function.
	   * @param {Function} [comparer]  Comparer used to compare key values.
	   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a maximum key value.
	   */
	  observableProto.maxBy = function (keySelector, comparer) {
	    comparer || (comparer = defaultSubComparer);
	    return extremaBy(this, keySelector, comparer);
	  };
	
	  /**
	   * Returns the maximum value in an observable sequence according to the specified comparer.
	   * @example
	   * var res = source.max();
	   * var res = source.max(function (x, y) { return x.value - y.value; });
	   * @param {Function} [comparer] Comparer used to compare elements.
	   * @returns {Observable} An observable sequence containing a single element with the maximum element in the source sequence.
	   */
	  observableProto.max = function (comparer) {
	    return this.maxBy(identity, comparer).map(function (x) { return firstOnly(x); });
	  };
	
	  var AverageObserver = (function(__super__) {
	    inherits(AverageObserver, __super__);
	    function AverageObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._c = 0;
	      this._t = 0;
	      __super__.call(this);
	    }
	
	    AverageObserver.prototype.next = function (x) {
	      if(this._fn) {
	        var r = tryCatch(this._fn)(x, this._c++, this._s);
	        if (r === errorObj) { return this._o.onError(r.e); }
	        this._t += r;
	      } else {
	        this._c++;
	        this._t += x;
	      }
	    };
	    AverageObserver.prototype.error = function (e) { this._o.onError(e); };
	    AverageObserver.prototype.completed = function () {
	      if (this._c === 0) { return this._o.onError(new EmptyError()); }
	      this._o.onNext(this._t / this._c);
	      this._o.onCompleted();
	    };
	
	    return AverageObserver;
	  }(AbstractObserver));
	
	  /**
	   * Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.
	   * @param {Function} [selector] A transform function to apply to each element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with the average of the sequence of values.
	   */
	  observableProto.average = function (keySelector, thisArg) {
	    var source = this, fn;
	    if (isFunction(keySelector)) {
	      fn = bindCallback(keySelector, thisArg, 3);
	    }
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new AverageObserver(o, fn, source));
	    }, source);
	  };
	
	  /**
	   *  Determines whether two sequences are equal by comparing the elements pairwise using a specified equality comparer.
	   *
	   * @example
	   * var res = res = source.sequenceEqual([1,2,3]);
	   * var res = res = source.sequenceEqual([{ value: 42 }], function (x, y) { return x.value === y.value; });
	   * 3 - res = source.sequenceEqual(Rx.Observable.returnValue(42));
	   * 4 - res = source.sequenceEqual(Rx.Observable.returnValue({ value: 42 }), function (x, y) { return x.value === y.value; });
	   * @param {Observable} second Second observable sequence or array to compare.
	   * @param {Function} [comparer] Comparer used to compare elements of both sequences.
	   * @returns {Observable} An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.
	   */
	  observableProto.sequenceEqual = function (second, comparer) {
	    var first = this;
	    comparer || (comparer = defaultComparer);
	    return new AnonymousObservable(function (o) {
	      var donel = false, doner = false, ql = [], qr = [];
	      var subscription1 = first.subscribe(function (x) {
	        var equal, v;
	        if (qr.length > 0) {
	          v = qr.shift();
	          try {
	            equal = comparer(v, x);
	          } catch (e) {
	            o.onError(e);
	            return;
	          }
	          if (!equal) {
	            o.onNext(false);
	            o.onCompleted();
	          }
	        } else if (doner) {
	          o.onNext(false);
	          o.onCompleted();
	        } else {
	          ql.push(x);
	        }
	      }, function(e) { o.onError(e); }, function () {
	        donel = true;
	        if (ql.length === 0) {
	          if (qr.length > 0) {
	            o.onNext(false);
	            o.onCompleted();
	          } else if (doner) {
	            o.onNext(true);
	            o.onCompleted();
	          }
	        }
	      });
	
	      (isArrayLike(second) || isIterable(second)) && (second = observableFrom(second));
	      isPromise(second) && (second = observableFromPromise(second));
	      var subscription2 = second.subscribe(function (x) {
	        var equal;
	        if (ql.length > 0) {
	          var v = ql.shift();
	          try {
	            equal = comparer(v, x);
	          } catch (exception) {
	            o.onError(exception);
	            return;
	          }
	          if (!equal) {
	            o.onNext(false);
	            o.onCompleted();
	          }
	        } else if (donel) {
	          o.onNext(false);
	          o.onCompleted();
	        } else {
	          qr.push(x);
	        }
	      }, function(e) { o.onError(e); }, function () {
	        doner = true;
	        if (qr.length === 0) {
	          if (ql.length > 0) {
	            o.onNext(false);
	            o.onCompleted();
	          } else if (donel) {
	            o.onNext(true);
	            o.onCompleted();
	          }
	        }
	      });
	      return new CompositeDisposable(subscription1, subscription2);
	    }, first);
	  };
	
	  /**
	   * Returns the element at a specified index in a sequence or default value if not found.
	   * @param {Number} index The zero-based index of the element to retrieve.
	   * @param {Any} [defaultValue] The default value to use if elementAt does not find a value.
	   * @returns {Observable} An observable sequence that produces the element at the specified position in the source sequence.
	   */
	  observableProto.elementAt =  function (index, defaultValue) {
	    if (index < 0) { throw new ArgumentOutOfRangeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var i = index;
	      return source.subscribe(
	        function (x) {
	          if (i-- === 0) {
	            o.onNext(x);
	            o.onCompleted();
	          }
	        },
	        function (e) { o.onError(e); },
	        function () {
	          if (defaultValue === undefined) {
	            o.onError(new ArgumentOutOfRangeError());
	          } else {
	            o.onNext(defaultValue);
	            o.onCompleted();
	          }
	      });
	    }, source);
	  };
	
	  /**
	   * Returns the only element of an observable sequence that satisfies the condition in the optional predicate, and reports an exception if there is not exactly one element in the observable sequence.
	   * @param {Function} [predicate] A predicate function to evaluate for elements in the source sequence.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} Sequence containing the single element in the observable sequence that satisfies the condition in the predicate.
	   */
	  observableProto.single = function (predicate, thisArg) {
	    if (isFunction(predicate)) { return this.filter(predicate, thisArg).single(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var value, seenValue = false;
	      return source.subscribe(function (x) {
	        if (seenValue) {
	          o.onError(new Error('Sequence contains more than one element'));
	        } else {
	          value = x;
	          seenValue = true;
	        }
	      }, function (e) { o.onError(e); }, function () {
	        o.onNext(value);
	        o.onCompleted();
	      });
	    }, source);
	  };
	
	  var FirstObserver = (function(__super__) {
	    inherits(FirstObserver, __super__);
	    function FirstObserver(o, obj, s) {
	      this._o = o;
	      this._obj = obj;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }
	
	    FirstObserver.prototype.next = function (x) {
	      if (this._obj.predicate) {
	        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        if (Boolean(res)) {
	          this._o.onNext(x);
	          this._o.onCompleted();
	        }
	      } else if (!this._obj.predicate) {
	        this._o.onNext(x);
	        this._o.onCompleted();
	      }
	    };
	    FirstObserver.prototype.error = function (e) { this._o.onError(e); };
	    FirstObserver.prototype.completed = function () {
	      if (this._obj.defaultValue === undefined) {
	        this._o.onError(new EmptyError());
	      } else {
	        this._o.onNext(this._obj.defaultValue);
	        this._o.onCompleted();
	      }
	    };
	
	    return FirstObserver;
	  }(AbstractObserver));
	
	  /**
	   * Returns the first element of an observable sequence that satisfies the condition in the predicate if present else the first item in the sequence.
	   * @returns {Observable} Sequence containing the first element in the observable sequence that satisfies the condition in the predicate if provided, else the first item in the sequence.
	   */
	  observableProto.first = function () {
	    var obj = {}, source = this;
	    if (typeof arguments[0] === 'object') {
	      obj = arguments[0];
	    } else {
	      obj = {
	        predicate: arguments[0],
	        thisArg: arguments[1],
	        defaultValue: arguments[2]
	      };
	    }
	    if (isFunction (obj.predicate)) {
	      var fn = obj.predicate;
	      obj.predicate = bindCallback(fn, obj.thisArg, 3);
	    }
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new FirstObserver(o, obj, source));
	    }, source);
	  };
	
	  /**
	   * Returns the last element of an observable sequence that satisfies the condition in the predicate if specified, else the last element.
	   * @returns {Observable} Sequence containing the last element in the observable sequence that satisfies the condition in the predicate.
	   */
	  observableProto.last = function () {
	    var obj = {}, source = this;
	    if (typeof arguments[0] === 'object') {
	      obj = arguments[0];
	    } else {
	      obj = {
	        predicate: arguments[0],
	        thisArg: arguments[1],
	        defaultValue: arguments[2]
	      };
	    }
	    if (isFunction (obj.predicate)) {
	      var fn = obj.predicate;
	      obj.predicate = bindCallback(fn, obj.thisArg, 3);
	    }
	    return new AnonymousObservable(function (o) {
	      var value, seenValue = false, i = 0;
	      return source.subscribe(
	        function (x) {
	          if (obj.predicate) {
	            var res = tryCatch(obj.predicate)(x, i++, source);
	            if (res === errorObj) { return o.onError(res.e); }
	            if (res) {
	              seenValue = true;
	              value = x;
	            }
	          } else if (!obj.predicate) {
	            seenValue = true;
	            value = x;
	          }
	        },
	        function (e) { o.onError(e); },
	        function () {
	          if (seenValue) {
	            o.onNext(value);
	            o.onCompleted();
	          }
	          else if (obj.defaultValue === undefined) {
	            o.onError(new EmptyError());
	          } else {
	            o.onNext(obj.defaultValue);
	            o.onCompleted();
	          }
	        });
	    }, source);
	  };
	
	  function findValue (source, predicate, thisArg, yieldIndex) {
	    var callback = bindCallback(predicate, thisArg, 3);
	    return new AnonymousObservable(function (o) {
	      var i = 0;
	      return source.subscribe(function (x) {
	        var shouldRun;
	        try {
	          shouldRun = callback(x, i, source);
	        } catch (e) {
	          o.onError(e);
	          return;
	        }
	        if (shouldRun) {
	          o.onNext(yieldIndex ? i : x);
	          o.onCompleted();
	        } else {
	          i++;
	        }
	      }, function (e) { o.onError(e); }, function () {
	        o.onNext(yieldIndex ? -1 : undefined);
	        o.onCompleted();
	      });
	    }, source);
	  }
	
	  /**
	   * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire Observable sequence.
	   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} An Observable sequence with the first element that matches the conditions defined by the specified predicate, if found; otherwise, undefined.
	   */
	  observableProto.find = function (predicate, thisArg) {
	    return findValue(this, predicate, thisArg, false);
	  };
	
	  /**
	   * Searches for an element that matches the conditions defined by the specified predicate, and returns
	   * an Observable sequence with the zero-based index of the first occurrence within the entire Observable sequence.
	   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} An Observable sequence with the zero-based index of the first occurrence of an element that matches the conditions defined by match, if found; otherwise, –1.
	  */
	  observableProto.findIndex = function (predicate, thisArg) {
	    return findValue(this, predicate, thisArg, true);
	  };
	
	  /**
	   * Converts the observable sequence to a Set if it exists.
	   * @returns {Observable} An observable sequence with a single value of a Set containing the values from the observable sequence.
	   */
	  observableProto.toSet = function () {
	    if (typeof root.Set === 'undefined') { throw new TypeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var s = new root.Set();
	      return source.subscribe(
	        function (x) { s.add(x); },
	        function (e) { o.onError(e); },
	        function () {
	          o.onNext(s);
	          o.onCompleted();
	        });
	    }, source);
	  };
	
	  /**
	  * Converts the observable sequence to a Map if it exists.
	  * @param {Function} keySelector A function which produces the key for the Map.
	  * @param {Function} [elementSelector] An optional function which produces the element for the Map. If not present, defaults to the value from the observable sequence.
	  * @returns {Observable} An observable sequence with a single value of a Map containing the values from the observable sequence.
	  */
	  observableProto.toMap = function (keySelector, elementSelector) {
	    if (typeof root.Map === 'undefined') { throw new TypeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var m = new root.Map();
	      return source.subscribe(
	        function (x) {
	          var key;
	          try {
	            key = keySelector(x);
	          } catch (e) {
	            o.onError(e);
	            return;
	          }
	
	          var element = x;
	          if (elementSelector) {
	            try {
	              element = elementSelector(x);
	            } catch (e) {
	              o.onError(e);
	              return;
	            }
	          }
	
	          m.set(key, element);
	        },
	        function (e) { o.onError(e); },
	        function () {
	          o.onNext(m);
	          o.onCompleted();
	        });
	    }, source);
	  };
	
	  Observable.wrap = function (fn) {
	    createObservable.__generatorFunction__ = fn;
	    return createObservable;
	
	    function createObservable() {
	      return Observable.spawn.call(this, fn.apply(this, arguments));
	    }
	  };
	
	  var spawn = Observable.spawn = function () {
	    var gen = arguments[0], self = this, args = [];
	    for (var i = 1, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	
	    return new AnonymousObservable(function (o) {
	      var g = new CompositeDisposable();
	
	      if (isFunction(gen)) { gen = gen.apply(self, args); }
	      if (!gen || !isFunction(gen.next)) {
	        o.onNext(gen);
	        return o.onCompleted();
	      }
	
	      processGenerator();
	
	      function processGenerator(res) {
	        var ret = tryCatch(gen.next).call(gen, res);
	        if (ret === errorObj) { return o.onError(ret.e); }
	        next(ret);
	      }
	
	      function onError(err) {
	        var ret = tryCatch(gen.next).call(gen, err);
	        if (ret === errorObj) { return o.onError(ret.e); }
	        next(ret);
	      }
	
	      function next(ret) {
	        if (ret.done) {
	          o.onNext(ret.value);
	          o.onCompleted();
	          return;
	        }
	        var value = toObservable.call(self, ret.value);
	        if (Observable.isObservable(value)) {
	          g.add(value.subscribe(processGenerator, onError));
	        } else {
	          onError(new TypeError('type not supported'));
	        }
	      }
	
	      return g;
	    });
	  }
	
	function toObservable(obj) {
	  if (!obj) { return obj; }
	  if (Observable.isObservable(obj)) { return obj; }
	  if (isPromise(obj)) { return Observable.fromPromise(obj); }
	  if (isGeneratorFunction(obj) || isGenerator(obj)) { return spawn.call(this, obj); }
	  if (isFunction(obj)) { return thunkToObservable.call(this, obj); }
	  if (isArrayLike(obj) || isIterable(obj)) { return arrayToObservable.call(this, obj); }
	  if (isObject(obj)) {return objectToObservable.call(this, obj);}
	  return obj;
	}
	
	function arrayToObservable (obj) {
	  return Observable.from(obj)
	      .flatMap(toObservable)
	      .toArray();
	}
	
	function objectToObservable (obj) {
	  var results = new obj.constructor(), keys = Object.keys(obj), observables = [];
	  for (var i = 0, len = keys.length; i < len; i++) {
	    var key = keys[i];
	    var observable = toObservable.call(this, obj[key]);
	
	    if(observable && Observable.isObservable(observable)) {
	      defer(observable, key);
	    } else {
	      results[key] = obj[key];
	    }
	  }
	
	  return Observable.forkJoin.apply(Observable, observables).map(function() {
	    return results;
	  });
	
	
	  function defer (observable, key) {
	    results[key] = undefined;
	    observables.push(observable.map(function (next) {
	      results[key] = next;
	    }));
	  }
	}
	
	function thunkToObservable(fn) {
	  var self = this;
	  return new AnonymousObservable(function (o) {
	    fn.call(self, function () {
	      var err = arguments[0], res = arguments[1];
	      if (err) { return o.onError(err); }
	      if (arguments.length > 2) {
	        var args = [];
	        for (var i = 1, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	        res = args;
	      }
	      o.onNext(res);
	      o.onCompleted();
	    });
	  });
	}
	
	function isGenerator(obj) {
	  return isFunction (obj.next) && isFunction (obj.throw);
	}
	
	function isGeneratorFunction(obj) {
	  var ctor = obj.constructor;
	  if (!ctor) { return false; }
	  if (ctor.name === 'GeneratorFunction' || ctor.displayName === 'GeneratorFunction') { return true; }
	  return isGenerator(ctor.prototype);
	}
	
	  /**
	   * Invokes the specified function asynchronously on the specified scheduler, surfacing the result through an observable sequence.
	   *
	   * @example
	   * var res = Rx.Observable.start(function () { console.log('hello'); });
	   * var res = Rx.Observable.start(function () { console.log('hello'); }, Rx.Scheduler.timeout);
	   * var res = Rx.Observable.start(function () { this.log('hello'); }, Rx.Scheduler.timeout, console);
	   *
	   * @param {Function} func Function to run asynchronously.
	   * @param {Scheduler} [scheduler]  Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
	   * @param [context]  The context for the func parameter to be executed.  If not specified, defaults to undefined.
	   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
	   *
	   * Remarks
	   * * The function is called immediately, not during the subscription of the resulting sequence.
	   * * Multiple subscriptions to the resulting sequence can observe the function's result.
	   */
	  Observable.start = function (func, context, scheduler) {
	    return observableToAsync(func, context, scheduler)();
	  };
	
	  /**
	   * Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
	   * @param {Function} function Function to convert to an asynchronous function.
	   * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
	   * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	   * @returns {Function} Asynchronous function.
	   */
	  var observableToAsync = Observable.toAsync = function (func, context, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return function () {
	      var args = arguments,
	        subject = new AsyncSubject();
	
	      scheduler.schedule(function () {
	        var result;
	        try {
	          result = func.apply(context, args);
	        } catch (e) {
	          subject.onError(e);
	          return;
	        }
	        subject.onNext(result);
	        subject.onCompleted();
	      });
	      return subject.asObservable();
	    };
	  };
	
	function createCbObservable(fn, ctx, selector, args) {
	  var o = new AsyncSubject();
	
	  args.push(createCbHandler(o, ctx, selector));
	  fn.apply(ctx, args);
	
	  return o.asObservable();
	}
	
	function createCbHandler(o, ctx, selector) {
	  return function handler () {
	    var len = arguments.length, results = new Array(len);
	    for(var i = 0; i < len; i++) { results[i] = arguments[i]; }
	
	    if (isFunction(selector)) {
	      results = tryCatch(selector).apply(ctx, results);
	      if (results === errorObj) { return o.onError(results.e); }
	      o.onNext(results);
	    } else {
	      if (results.length <= 1) {
	        o.onNext(results[0]);
	      } else {
	        o.onNext(results);
	      }
	    }
	
	    o.onCompleted();
	  };
	}
	
	/**
	 * Converts a callback function to an observable sequence.
	 *
	 * @param {Function} fn Function with a callback as the last parameter to convert to an Observable sequence.
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
	 * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
	 */
	Observable.fromCallback = function (fn, ctx, selector) {
	  return function () {
	    typeof ctx === 'undefined' && (ctx = this); 
	
	    var len = arguments.length, args = new Array(len)
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return createCbObservable(fn, ctx, selector, args);
	  };
	};
	
	function createNodeObservable(fn, ctx, selector, args) {
	  var o = new AsyncSubject();
	
	  args.push(createNodeHandler(o, ctx, selector));
	  fn.apply(ctx, args);
	
	  return o.asObservable();
	}
	
	function createNodeHandler(o, ctx, selector) {
	  return function handler () {
	    var err = arguments[0];
	    if (err) { return o.onError(err); }
	
	    var len = arguments.length, results = [];
	    for(var i = 1; i < len; i++) { results[i - 1] = arguments[i]; }
	
	    if (isFunction(selector)) {
	      var results = tryCatch(selector).apply(ctx, results);
	      if (results === errorObj) { return o.onError(results.e); }
	      o.onNext(results);
	    } else {
	      if (results.length <= 1) {
	        o.onNext(results[0]);
	      } else {
	        o.onNext(results);
	      }
	    }
	
	    o.onCompleted();
	  };
	}
	
	/**
	 * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
	 * @param {Function} fn The function to call
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
	 * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
	 */
	Observable.fromNodeCallback = function (fn, ctx, selector) {
	  return function () {
	    typeof ctx === 'undefined' && (ctx = this); 
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return createNodeObservable(fn, ctx, selector, args);
	  };
	};
	
	  function ListenDisposable(e, n, fn) {
	    this._e = e;
	    this._n = n;
	    this._fn = fn;
	    this._e.addEventListener(this._n, this._fn, false);
	    this.isDisposed = false;
	  }
	  ListenDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this._e.removeEventListener(this._n, this._fn, false);
	      this.isDisposed = true;
	    }
	  };
	
	  function createEventListener (el, eventName, handler) {
	    var disposables = new CompositeDisposable();
	
	    // Asume NodeList or HTMLCollection
	    var elemToString = Object.prototype.toString.call(el);
	    if (elemToString === '[object NodeList]' || elemToString === '[object HTMLCollection]') {
	      for (var i = 0, len = el.length; i < len; i++) {
	        disposables.add(createEventListener(el.item(i), eventName, handler));
	      }
	    } else if (el) {
	      disposables.add(new ListenDisposable(el, eventName, handler));
	    }
	
	    return disposables;
	  }
	
	  /**
	   * Configuration option to determine whether to use native events only
	   */
	  Rx.config.useNativeEvents = false;
	
	  function eventHandler(o, selector) {
	    return function handler () {
	      var results = arguments[0];
	      if (isFunction(selector)) {
	        results = tryCatch(selector).apply(null, arguments);
	        if (results === errorObj) { return o.onError(results.e); }
	      }
	      o.onNext(results);
	    };
	  }
	
	  /**
	   * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
	   * @param {Object} element The DOMElement or NodeList to attach a listener.
	   * @param {String} eventName The event name to attach the observable sequence.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @returns {Observable} An observable sequence of events from the specified element and the specified event.
	   */
	  Observable.fromEvent = function (element, eventName, selector) {
	    // Node.js specific
	    if (element.addListener) {
	      return fromEventPattern(
	        function (h) { element.addListener(eventName, h); },
	        function (h) { element.removeListener(eventName, h); },
	        selector);
	    }
	
	    // Use only if non-native events are allowed
	    if (!Rx.config.useNativeEvents) {
	      // Handles jq, Angular.js, Zepto, Marionette, Ember.js
	      if (typeof element.on === 'function' && typeof element.off === 'function') {
	        return fromEventPattern(
	          function (h) { element.on(eventName, h); },
	          function (h) { element.off(eventName, h); },
	          selector);
	      }
	    }
	
	    return new AnonymousObservable(function (o) {
	      return createEventListener(
	        element,
	        eventName,
	        eventHandler(o, selector));
	    }).publish().refCount();
	  };
	
	  /**
	   * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
	   * @param {Function} addHandler The function to add a handler to the emitter.
	   * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @param {Scheduler} [scheduler] A scheduler used to schedule the remove handler.
	   * @returns {Observable} An observable sequence which wraps an event from an event emitter
	   */
	  var fromEventPattern = Observable.fromEventPattern = function (addHandler, removeHandler, selector, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return new AnonymousObservable(function (o) {
	      function innerHandler () {
	        var result = arguments[0];
	        if (isFunction(selector)) {
	          result = tryCatch(selector).apply(null, arguments);
	          if (result === errorObj) { return o.onError(result.e); }
	        }
	        o.onNext(result);
	      }
	
	      var returnValue = addHandler(innerHandler);
	      return disposableCreate(function () {
	        isFunction(removeHandler) && removeHandler(innerHandler, returnValue);
	      });
	    }).publish().refCount();
	  };
	
	  /**
	   * Invokes the asynchronous function, surfacing the result through an observable sequence.
	   * @param {Function} functionAsync Asynchronous function which returns a Promise to run.
	   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
	   */
	  Observable.startAsync = function (functionAsync) {
	    var promise;
	    try {
	      promise = functionAsync();
	    } catch (e) {
	      return observableThrow(e);
	    }
	    return observableFromPromise(promise);
	  }
	
	  var PausableObservable = (function (__super__) {
	
	    inherits(PausableObservable, __super__);
	
	    function subscribe(observer) {
	      var conn = this.source.publish(),
	        subscription = conn.subscribe(observer),
	        connection = disposableEmpty;
	
	      var pausable = this.pauser.distinctUntilChanged().subscribe(function (b) {
	        if (b) {
	          connection = conn.connect();
	        } else {
	          connection.dispose();
	          connection = disposableEmpty;
	        }
	      });
	
	      return new CompositeDisposable(subscription, connection, pausable);
	    }
	
	    function PausableObservable(source, pauser) {
	      this.source = source;
	      this.controller = new Subject();
	
	      if (pauser && pauser.subscribe) {
	        this.pauser = this.controller.merge(pauser);
	      } else {
	        this.pauser = this.controller;
	      }
	
	      __super__.call(this, subscribe, source);
	    }
	
	    PausableObservable.prototype.pause = function () {
	      this.controller.onNext(false);
	    };
	
	    PausableObservable.prototype.resume = function () {
	      this.controller.onNext(true);
	    };
	
	    return PausableObservable;
	
	  }(Observable));
	
	  /**
	   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false.
	   * @example
	   * var pauser = new Rx.Subject();
	   * var source = Rx.Observable.interval(100).pausable(pauser);
	   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
	   * @returns {Observable} The observable sequence which is paused based upon the pauser.
	   */
	  observableProto.pausable = function (pauser) {
	    return new PausableObservable(this, pauser);
	  };
	
	  function combineLatestSource(source, subject, resultSelector) {
	    return new AnonymousObservable(function (o) {
	      var hasValue = [false, false],
	        hasValueAll = false,
	        isDone = false,
	        values = new Array(2),
	        err;
	
	      function next(x, i) {
	        values[i] = x;
	        hasValue[i] = true;
	        if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
	          if (err) { return o.onError(err); }
	          var res = tryCatch(resultSelector).apply(null, values);
	          if (res === errorObj) { return o.onError(res.e); }
	          o.onNext(res);
	        }
	        isDone && values[1] && o.onCompleted();
	      }
	
	      return new CompositeDisposable(
	        source.subscribe(
	          function (x) {
	            next(x, 0);
	          },
	          function (e) {
	            if (values[1]) {
	              o.onError(e);
	            } else {
	              err = e;
	            }
	          },
	          function () {
	            isDone = true;
	            values[1] && o.onCompleted();
	          }),
	        subject.subscribe(
	          function (x) {
	            next(x, 1);
	          },
	          function (e) { o.onError(e); },
	          function () {
	            isDone = true;
	            next(true, 1);
	          })
	        );
	    }, source);
	  }
	
	  var PausableBufferedObservable = (function (__super__) {
	
	    inherits(PausableBufferedObservable, __super__);
	
	    function subscribe(o) {
	      var q = [], previousShouldFire;
	
	      function drainQueue() { while (q.length > 0) { o.onNext(q.shift()); } }
	
	      var subscription =
	        combineLatestSource(
	          this.source,
	          this.pauser.startWith(false).distinctUntilChanged(),
	          function (data, shouldFire) {
	            return { data: data, shouldFire: shouldFire };
	          })
	          .subscribe(
	            function (results) {
	              if (previousShouldFire !== undefined && results.shouldFire != previousShouldFire) {
	                previousShouldFire = results.shouldFire;
	                // change in shouldFire
	                if (results.shouldFire) { drainQueue(); }
	              } else {
	                previousShouldFire = results.shouldFire;
	                // new data
	                if (results.shouldFire) {
	                  o.onNext(results.data);
	                } else {
	                  q.push(results.data);
	                }
	              }
	            },
	            function (err) {
	              drainQueue();
	              o.onError(err);
	            },
	            function () {
	              drainQueue();
	              o.onCompleted();
	            }
	          );
	      return subscription;
	    }
	
	    function PausableBufferedObservable(source, pauser) {
	      this.source = source;
	      this.controller = new Subject();
	
	      if (pauser && pauser.subscribe) {
	        this.pauser = this.controller.merge(pauser);
	      } else {
	        this.pauser = this.controller;
	      }
	
	      __super__.call(this, subscribe, source);
	    }
	
	    PausableBufferedObservable.prototype.pause = function () {
	      this.controller.onNext(false);
	    };
	
	    PausableBufferedObservable.prototype.resume = function () {
	      this.controller.onNext(true);
	    };
	
	    return PausableBufferedObservable;
	
	  }(Observable));
	
	  /**
	   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false,
	   * and yields the values that were buffered while paused.
	   * @example
	   * var pauser = new Rx.Subject();
	   * var source = Rx.Observable.interval(100).pausableBuffered(pauser);
	   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
	   * @returns {Observable} The observable sequence which is paused based upon the pauser.
	   */
	  observableProto.pausableBuffered = function (subject) {
	    return new PausableBufferedObservable(this, subject);
	  };
	
	var ControlledObservable = (function (__super__) {
	
	  inherits(ControlledObservable, __super__);
	
	  function subscribe (observer) {
	    return this.source.subscribe(observer);
	  }
	
	  function ControlledObservable (source, enableQueue, scheduler) {
	    __super__.call(this, subscribe, source);
	    this.subject = new ControlledSubject(enableQueue, scheduler);
	    this.source = source.multicast(this.subject).refCount();
	  }
	
	  ControlledObservable.prototype.request = function (numberOfItems) {
	    return this.subject.request(numberOfItems == null ? -1 : numberOfItems);
	  };
	
	  return ControlledObservable;
	
	}(Observable));
	
	var ControlledSubject = (function (__super__) {
	
	  function subscribe (observer) {
	    return this.subject.subscribe(observer);
	  }
	
	  inherits(ControlledSubject, __super__);
	
	  function ControlledSubject(enableQueue, scheduler) {
	    enableQueue == null && (enableQueue = true);
	
	    __super__.call(this, subscribe);
	    this.subject = new Subject();
	    this.enableQueue = enableQueue;
	    this.queue = enableQueue ? [] : null;
	    this.requestedCount = 0;
	    this.requestedDisposable = null;
	    this.error = null;
	    this.hasFailed = false;
	    this.hasCompleted = false;
	    this.scheduler = scheduler || currentThreadScheduler;
	  }
	
	  addProperties(ControlledSubject.prototype, Observer, {
	    onCompleted: function () {
	      this.hasCompleted = true;
	      if (!this.enableQueue || this.queue.length === 0) {
	        this.subject.onCompleted();
	        this.disposeCurrentRequest()
	      } else {
	        this.queue.push(Notification.createOnCompleted());
	      }
	    },
	    onError: function (error) {
	      this.hasFailed = true;
	      this.error = error;
	      if (!this.enableQueue || this.queue.length === 0) {
	        this.subject.onError(error);
	        this.disposeCurrentRequest()
	      } else {
	        this.queue.push(Notification.createOnError(error));
	      }
	    },
	    onNext: function (value) {
	      if (this.requestedCount <= 0) {
	        this.enableQueue && this.queue.push(Notification.createOnNext(value));
	      } else {
	        (this.requestedCount-- === 0) && this.disposeCurrentRequest();
	        this.subject.onNext(value);
	      }
	    },
	    _processRequest: function (numberOfItems) {
	      if (this.enableQueue) {
	        while (this.queue.length > 0 && (numberOfItems > 0 || this.queue[0].kind !== 'N')) {
	          var first = this.queue.shift();
	          first.accept(this.subject);
	          if (first.kind === 'N') {
	            numberOfItems--;
	          } else {
	            this.disposeCurrentRequest();
	            this.queue = [];
	          }
	        }
	      }
	
	      return numberOfItems;
	    },
	    request: function (number) {
	      this.disposeCurrentRequest();
	      var self = this;
	
	      this.requestedDisposable = this.scheduler.scheduleWithState(number,
	      function(s, i) {
	        var remaining = self._processRequest(i);
	        var stopped = self.hasCompleted || self.hasFailed
	        if (!stopped && remaining > 0) {
	          self.requestedCount = remaining;
	
	          return disposableCreate(function () {
	            self.requestedCount = 0;
	          });
	            // Scheduled item is still in progress. Return a new
	            // disposable to allow the request to be interrupted
	            // via dispose.
	        }
	      });
	
	      return this.requestedDisposable;
	    },
	    disposeCurrentRequest: function () {
	      if (this.requestedDisposable) {
	        this.requestedDisposable.dispose();
	        this.requestedDisposable = null;
	      }
	    }
	  });
	
	  return ControlledSubject;
	}(Observable));
	
	/**
	 * Attaches a controller to the observable sequence with the ability to queue.
	 * @example
	 * var source = Rx.Observable.interval(100).controlled();
	 * source.request(3); // Reads 3 values
	 * @param {bool} enableQueue truthy value to determine if values should be queued pending the next request
	 * @param {Scheduler} scheduler determines how the requests will be scheduled
	 * @returns {Observable} The observable sequence which only propagates values on request.
	 */
	observableProto.controlled = function (enableQueue, scheduler) {
	
	  if (enableQueue && isScheduler(enableQueue)) {
	      scheduler = enableQueue;
	      enableQueue = true;
	  }
	
	  if (enableQueue == null) {  enableQueue = true; }
	  return new ControlledObservable(this, enableQueue, scheduler);
	};
	
	  var StopAndWaitObservable = (function (__super__) {
	
	    function subscribe (observer) {
	      this.subscription = this.source.subscribe(new StopAndWaitObserver(observer, this, this.subscription));
	
	      var self = this;
	      timeoutScheduler.schedule(function () { self.source.request(1); });
	
	      return this.subscription;
	    }
	
	    inherits(StopAndWaitObservable, __super__);
	
	    function StopAndWaitObservable (source) {
	      __super__.call(this, subscribe, source);
	      this.source = source;
	    }
	
	    var StopAndWaitObserver = (function (__sub__) {
	
	      inherits(StopAndWaitObserver, __sub__);
	
	      function StopAndWaitObserver (observer, observable, cancel) {
	        __sub__.call(this);
	        this.observer = observer;
	        this.observable = observable;
	        this.cancel = cancel;
	      }
	
	      var stopAndWaitObserverProto = StopAndWaitObserver.prototype;
	
	      stopAndWaitObserverProto.completed = function () {
	        this.observer.onCompleted();
	        this.dispose();
	      };
	
	      stopAndWaitObserverProto.error = function (error) {
	        this.observer.onError(error);
	        this.dispose();
	      }
	
	      stopAndWaitObserverProto.next = function (value) {
	        this.observer.onNext(value);
	
	        var self = this;
	        timeoutScheduler.schedule(function () {
	          self.observable.source.request(1);
	        });
	      };
	
	      stopAndWaitObserverProto.dispose = function () {
	        this.observer = null;
	        if (this.cancel) {
	          this.cancel.dispose();
	          this.cancel = null;
	        }
	        __sub__.prototype.dispose.call(this);
	      };
	
	      return StopAndWaitObserver;
	    }(AbstractObserver));
	
	    return StopAndWaitObservable;
	  }(Observable));
	
	
	  /**
	   * Attaches a stop and wait observable to the current observable.
	   * @returns {Observable} A stop and wait observable.
	   */
	  ControlledObservable.prototype.stopAndWait = function () {
	    return new StopAndWaitObservable(this);
	  };
	
	  var WindowedObservable = (function (__super__) {
	
	    function subscribe (observer) {
	      this.subscription = this.source.subscribe(new WindowedObserver(observer, this, this.subscription));
	
	      var self = this;
	      timeoutScheduler.schedule(function () {
	        self.source.request(self.windowSize);
	      });
	
	      return this.subscription;
	    }
	
	    inherits(WindowedObservable, __super__);
	
	    function WindowedObservable(source, windowSize) {
	      __super__.call(this, subscribe, source);
	      this.source = source;
	      this.windowSize = windowSize;
	    }
	
	    var WindowedObserver = (function (__sub__) {
	
	      inherits(WindowedObserver, __sub__);
	
	      function WindowedObserver(observer, observable, cancel) {
	        this.observer = observer;
	        this.observable = observable;
	        this.cancel = cancel;
	        this.received = 0;
	      }
	
	      var windowedObserverPrototype = WindowedObserver.prototype;
	
	      windowedObserverPrototype.completed = function () {
	        this.observer.onCompleted();
	        this.dispose();
	      };
	
	      windowedObserverPrototype.error = function (error) {
	        this.observer.onError(error);
	        this.dispose();
	      };
	
	      windowedObserverPrototype.next = function (value) {
	        this.observer.onNext(value);
	
	        this.received = ++this.received % this.observable.windowSize;
	        if (this.received === 0) {
	          var self = this;
	          timeoutScheduler.schedule(function () {
	            self.observable.source.request(self.observable.windowSize);
	          });
	        }
	      };
	
	      windowedObserverPrototype.dispose = function () {
	        this.observer = null;
	        if (this.cancel) {
	          this.cancel.dispose();
	          this.cancel = null;
	        }
	        __sub__.prototype.dispose.call(this);
	      };
	
	      return WindowedObserver;
	    }(AbstractObserver));
	
	    return WindowedObservable;
	  }(Observable));
	
	  /**
	   * Creates a sliding windowed observable based upon the window size.
	   * @param {Number} windowSize The number of items in the window
	   * @returns {Observable} A windowed observable based upon the window size.
	   */
	  ControlledObservable.prototype.windowed = function (windowSize) {
	    return new WindowedObservable(this, windowSize);
	  };
	
	  /**
	   * Pipes the existing Observable sequence into a Node.js Stream.
	   * @param {Stream} dest The destination Node.js stream.
	   * @returns {Stream} The destination stream.
	   */
	  observableProto.pipe = function (dest) {
	    var source = this.pausableBuffered();
	
	    function onDrain() {
	      source.resume();
	    }
	
	    dest.addListener('drain', onDrain);
	
	    source.subscribe(
	      function (x) {
	        !dest.write(String(x)) && source.pause();
	      },
	      function (err) {
	        dest.emit('error', err);
	      },
	      function () {
	        // Hack check because STDIO is not closable
	        !dest._isStdio && dest.end();
	        dest.removeListener('drain', onDrain);
	      });
	
	    source.resume();
	
	    return dest;
	  };
	
	  /**
	   * Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
	   * subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
	   * invocation. For specializations with fixed subject types, see Publish, PublishLast, and Replay.
	   *
	   * @example
	   * 1 - res = source.multicast(observable);
	   * 2 - res = source.multicast(function () { return new Subject(); }, function (x) { return x; });
	   *
	   * @param {Function|Subject} subjectOrSubjectSelector
	   * Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
	   * Or:
	   * Subject to push source elements into.
	   *
	   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if <paramref name="subjectOrSubjectSelector" is a factory function.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.multicast = function (subjectOrSubjectSelector, selector) {
	    var source = this;
	    return typeof subjectOrSubjectSelector === 'function' ?
	      new AnonymousObservable(function (observer) {
	        var connectable = source.multicast(subjectOrSubjectSelector());
	        return new CompositeDisposable(selector(connectable).subscribe(observer), connectable.connect());
	      }, source) :
	      new ConnectableObservable(source, subjectOrSubjectSelector);
	  };
	
	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.
	   * This operator is a specialization of Multicast using a regular Subject.
	   *
	   * @example
	   * var resres = source.publish();
	   * var res = source.publish(function (x) { return x; });
	   *
	   * @param {Function} [selector] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publish = function (selector) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new Subject(); }, selector) :
	      this.multicast(new Subject());
	  };
	
	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence.
	   * This operator is a specialization of publish which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.share = function () {
	    return this.publish().refCount();
	  };
	
	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence containing only the last notification.
	   * This operator is a specialization of Multicast using a AsyncSubject.
	   *
	   * @example
	   * var res = source.publishLast();
	   * var res = source.publishLast(function (x) { return x; });
	   *
	   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will only receive the last notification of the source.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publishLast = function (selector) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new AsyncSubject(); }, selector) :
	      this.multicast(new AsyncSubject());
	  };
	
	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
	   * This operator is a specialization of Multicast using a BehaviorSubject.
	   *
	   * @example
	   * var res = source.publishValue(42);
	   * var res = source.publishValue(function (x) { return x.select(function (y) { return y * y; }) }, 42);
	   *
	   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive immediately receive the initial value, followed by all notifications of the source from the time of the subscription on.
	   * @param {Mixed} initialValue Initial value received by observers upon subscription.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publishValue = function (initialValueOrSelector, initialValue) {
	    return arguments.length === 2 ?
	      this.multicast(function () {
	        return new BehaviorSubject(initialValue);
	      }, initialValueOrSelector) :
	      this.multicast(new BehaviorSubject(initialValueOrSelector));
	  };
	
	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence and starts with an initialValue.
	   * This operator is a specialization of publishValue which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   * @param {Mixed} initialValue Initial value received by observers upon subscription.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.shareValue = function (initialValue) {
	    return this.publishValue(initialValue).refCount();
	  };
	
	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
	   * This operator is a specialization of Multicast using a ReplaySubject.
	   *
	   * @example
	   * var res = source.replay(null, 3);
	   * var res = source.replay(null, 3, 500);
	   * var res = source.replay(null, 3, 500, scheduler);
	   * var res = source.replay(function (x) { return x.take(6).repeat(); }, 3, 500, scheduler);
	   *
	   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.
	   * @param bufferSize [Optional] Maximum element count of the replay buffer.
	   * @param windowSize [Optional] Maximum time length of the replay buffer.
	   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.replay = function (selector, bufferSize, windowSize, scheduler) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new ReplaySubject(bufferSize, windowSize, scheduler); }, selector) :
	      this.multicast(new ReplaySubject(bufferSize, windowSize, scheduler));
	  };
	
	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
	   * This operator is a specialization of replay which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   *
	   * @example
	   * var res = source.shareReplay(3);
	   * var res = source.shareReplay(3, 500);
	   * var res = source.shareReplay(3, 500, scheduler);
	   *
	
	   * @param bufferSize [Optional] Maximum element count of the replay buffer.
	   * @param window [Optional] Maximum time length of the replay buffer.
	   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.shareReplay = function (bufferSize, windowSize, scheduler) {
	    return this.replay(null, bufferSize, windowSize, scheduler).refCount();
	  };
	
	  var InnerSubscription = function (subject, observer) {
	    this.subject = subject;
	    this.observer = observer;
	  };
	
	  InnerSubscription.prototype.dispose = function () {
	    if (!this.subject.isDisposed && this.observer !== null) {
	      var idx = this.subject.observers.indexOf(this.observer);
	      this.subject.observers.splice(idx, 1);
	      this.observer = null;
	    }
	  };
	
	  /**
	   *  Represents a value that changes over time.
	   *  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications.
	   */
	  var BehaviorSubject = Rx.BehaviorSubject = (function (__super__) {
	    function subscribe(observer) {
	      checkDisposed(this);
	      if (!this.isStopped) {
	        this.observers.push(observer);
	        observer.onNext(this.value);
	        return new InnerSubscription(this, observer);
	      }
	      if (this.hasError) {
	        observer.onError(this.error);
	      } else {
	        observer.onCompleted();
	      }
	      return disposableEmpty;
	    }
	
	    inherits(BehaviorSubject, __super__);
	
	    /**
	     *  Initializes a new instance of the BehaviorSubject class which creates a subject that caches its last value and starts with the specified value.
	     *  @param {Mixed} value Initial value sent to observers when no other value has been received by the subject yet.
	     */
	    function BehaviorSubject(value) {
	      __super__.call(this, subscribe);
	      this.value = value,
	      this.observers = [],
	      this.isDisposed = false,
	      this.isStopped = false,
	      this.hasError = false;
	    }
	
	    addProperties(BehaviorSubject.prototype, Observer, {
	      /**
	       * Gets the current value or throws an exception.
	       * Value is frozen after onCompleted is called.
	       * After onError is called always throws the specified exception.
	       * An exception is always thrown after dispose is called.
	       * @returns {Mixed} The initial value passed to the constructor until onNext is called; after which, the last value passed to onNext.
	       */
	      getValue: function () {
	          checkDisposed(this);
	          if (this.hasError) {
	              throw this.error;
	          }
	          return this.value;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () { return this.observers.length > 0; },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onCompleted();
	        }
	
	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        this.hasError = true;
	        this.error = error;
	
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onError(error);
	        }
	
	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.value = value;
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onNext(value);
	        }
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	        this.value = null;
	        this.exception = null;
	      }
	    });
	
	    return BehaviorSubject;
	  }(Observable));
	
	  /**
	   * Represents an object that is both an observable sequence as well as an observer.
	   * Each notification is broadcasted to all subscribed and future observers, subject to buffer trimming policies.
	   */
	  var ReplaySubject = Rx.ReplaySubject = (function (__super__) {
	
	    var maxSafeInteger = Math.pow(2, 53) - 1;
	
	    function createRemovableDisposable(subject, observer) {
	      return disposableCreate(function () {
	        observer.dispose();
	        !subject.isDisposed && subject.observers.splice(subject.observers.indexOf(observer), 1);
	      });
	    }
	
	    function subscribe(observer) {
	      var so = new ScheduledObserver(this.scheduler, observer),
	        subscription = createRemovableDisposable(this, so);
	      checkDisposed(this);
	      this._trim(this.scheduler.now());
	      this.observers.push(so);
	
	      for (var i = 0, len = this.q.length; i < len; i++) {
	        so.onNext(this.q[i].value);
	      }
	
	      if (this.hasError) {
	        so.onError(this.error);
	      } else if (this.isStopped) {
	        so.onCompleted();
	      }
	
	      so.ensureActive();
	      return subscription;
	    }
	
	    inherits(ReplaySubject, __super__);
	
	    /**
	     *  Initializes a new instance of the ReplaySubject class with the specified buffer size, window size and scheduler.
	     *  @param {Number} [bufferSize] Maximum element count of the replay buffer.
	     *  @param {Number} [windowSize] Maximum time length of the replay buffer.
	     *  @param {Scheduler} [scheduler] Scheduler the observers are invoked on.
	     */
	    function ReplaySubject(bufferSize, windowSize, scheduler) {
	      this.bufferSize = bufferSize == null ? maxSafeInteger : bufferSize;
	      this.windowSize = windowSize == null ? maxSafeInteger : windowSize;
	      this.scheduler = scheduler || currentThreadScheduler;
	      this.q = [];
	      this.observers = [];
	      this.isStopped = false;
	      this.isDisposed = false;
	      this.hasError = false;
	      this.error = null;
	      __super__.call(this, subscribe);
	    }
	
	    addProperties(ReplaySubject.prototype, Observer.prototype, {
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () {
	        return this.observers.length > 0;
	      },
	      _trim: function (now) {
	        while (this.q.length > this.bufferSize) {
	          this.q.shift();
	        }
	        while (this.q.length > 0 && (now - this.q[0].interval) > this.windowSize) {
	          this.q.shift();
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        var now = this.scheduler.now();
	        this.q.push({ interval: now, value: value });
	        this._trim(now);
	
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onNext(value);
	          observer.ensureActive();
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        this.error = error;
	        this.hasError = true;
	        var now = this.scheduler.now();
	        this._trim(now);
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onError(error);
	          observer.ensureActive();
	        }
	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        var now = this.scheduler.now();
	        this._trim(now);
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onCompleted();
	          observer.ensureActive();
	        }
	        this.observers.length = 0;
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	      }
	    });
	
	    return ReplaySubject;
	  }(Observable));
	
	  var ConnectableObservable = Rx.ConnectableObservable = (function (__super__) {
	    inherits(ConnectableObservable, __super__);
	
	    function ConnectableObservable(source, subject) {
	      var hasSubscription = false,
	        subscription,
	        sourceObservable = source.asObservable();
	
	      this.connect = function () {
	        if (!hasSubscription) {
	          hasSubscription = true;
	          subscription = new CompositeDisposable(sourceObservable.subscribe(subject), disposableCreate(function () {
	            hasSubscription = false;
	          }));
	        }
	        return subscription;
	      };
	
	      __super__.call(this, function (o) { return subject.subscribe(o); });
	    }
	
	    ConnectableObservable.prototype.refCount = function () {
	      var connectableSubscription, count = 0, source = this;
	      return new AnonymousObservable(function (observer) {
	          var shouldConnect = ++count === 1,
	            subscription = source.subscribe(observer);
	          shouldConnect && (connectableSubscription = source.connect());
	          return function () {
	            subscription.dispose();
	            --count === 0 && connectableSubscription.dispose();
	          };
	      });
	    };
	
	    return ConnectableObservable;
	  }(Observable));
	
	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence. This observable sequence
	   * can be resubscribed to, even if all prior subscriptions have ended. (unlike `.publish().refCount()`)
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source.
	   */
	  observableProto.singleInstance = function() {
	    var source = this, hasObservable = false, observable;
	
	    function getObservable() {
	      if (!hasObservable) {
	        hasObservable = true;
	        observable = source.finally(function() { hasObservable = false; }).publish().refCount();
	      }
	      return observable;
	    };
	
	    return new AnonymousObservable(function(o) {
	      return getObservable().subscribe(o);
	    });
	  };
	
	  /**
	   *  Correlates the elements of two sequences based on overlapping durations.
	   *
	   *  @param {Observable} right The right observable sequence to join elements for.
	   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
	   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
	   *  @param {Function} resultSelector A function invoked to compute a result element for any two overlapping elements of the left and right observable sequences. The parameters passed to the function correspond with the elements from the left and right source sequences for which overlap occurs.
	   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
	   */
	  observableProto.join = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
	    var left = this;
	    return new AnonymousObservable(function (o) {
	      var group = new CompositeDisposable();
	      var leftDone = false, rightDone = false;
	      var leftId = 0, rightId = 0;
	      var leftMap = new Map(), rightMap = new Map();
	      var handleError = function (e) { o.onError(e); };
	
	      group.add(left.subscribe(
	        function (value) {
	          var id = leftId++, md = new SingleAssignmentDisposable();
	
	          leftMap.set(id, value);
	          group.add(md);
	
	          var duration = tryCatch(leftDurationSelector)(value);
	          if (duration === errorObj) { return o.onError(duration.e); }
	
	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            handleError,
	            function () {
	              leftMap['delete'](id) && leftMap.size === 0 && leftDone && o.onCompleted();
	              group.remove(md);
	            }));
	
	          rightMap.forEach(function (v) {
	            var result = tryCatch(resultSelector)(value, v);
	            if (result === errorObj) { return o.onError(result.e); }
	            o.onNext(result);
	          });
	        },
	        handleError,
	        function () {
	          leftDone = true;
	          (rightDone || leftMap.size === 0) && o.onCompleted();
	        })
	      );
	
	      group.add(right.subscribe(
	        function (value) {
	          var id = rightId++, md = new SingleAssignmentDisposable();
	
	          rightMap.set(id, value);
	          group.add(md);
	
	          var duration = tryCatch(rightDurationSelector)(value);
	          if (duration === errorObj) { return o.onError(duration.e); }
	
	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            handleError,
	            function () {
	              rightMap['delete'](id) && rightMap.size === 0 && rightDone && o.onCompleted();
	              group.remove(md);
	            }));
	
	          leftMap.forEach(function (v) {
	            var result = tryCatch(resultSelector)(v, value);
	            if (result === errorObj) { return o.onError(result.e); }
	            o.onNext(result);
	          });
	        },
	        handleError,
	        function () {
	          rightDone = true;
	          (leftDone || rightMap.size === 0) && o.onCompleted();
	        })
	      );
	      return group;
	    }, left);
	  };
	
	  /**
	   *  Correlates the elements of two sequences based on overlapping durations, and groups the results.
	   *
	   *  @param {Observable} right The right observable sequence to join elements for.
	   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
	   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
	   *  @param {Function} resultSelector A function invoked to compute a result element for any element of the left sequence with overlapping elements from the right observable sequence. The first parameter passed to the function is an element of the left sequence. The second parameter passed to the function is an observable sequence with elements from the right sequence that overlap with the left sequence's element.
	   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
	   */
	  observableProto.groupJoin = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
	    var left = this;
	    return new AnonymousObservable(function (o) {
	      var group = new CompositeDisposable();
	      var r = new RefCountDisposable(group);
	      var leftMap = new Map(), rightMap = new Map();
	      var leftId = 0, rightId = 0;
	      var handleError = function (e) { return function (v) { v.onError(e); }; };
	
	      function handleError(e) { };
	
	      group.add(left.subscribe(
	        function (value) {
	          var s = new Subject();
	          var id = leftId++;
	          leftMap.set(id, s);
	
	          var result = tryCatch(resultSelector)(value, addRef(s, r));
	          if (result === errorObj) {
	            leftMap.forEach(handleError(result.e));
	            return o.onError(result.e);
	          }
	          o.onNext(result);
	
	          rightMap.forEach(function (v) { s.onNext(v); });
	
	          var md = new SingleAssignmentDisposable();
	          group.add(md);
	
	          var duration = tryCatch(leftDurationSelector)(value);
	          if (duration === errorObj) {
	            leftMap.forEach(handleError(duration.e));
	            return o.onError(duration.e);
	          }
	
	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            function (e) {
	              leftMap.forEach(handleError(e));
	              o.onError(e);
	            },
	            function () {
	              leftMap['delete'](id) && s.onCompleted();
	              group.remove(md);
	            }));
	        },
	        function (e) {
	          leftMap.forEach(handleError(e));
	          o.onError(e);
	        },
	        function () { o.onCompleted(); })
	      );
	
	      group.add(right.subscribe(
	        function (value) {
	          var id = rightId++;
	          rightMap.set(id, value);
	
	          var md = new SingleAssignmentDisposable();
	          group.add(md);
	
	          var duration = tryCatch(rightDurationSelector)(value);
	          if (duration === errorObj) {
	            leftMap.forEach(handleError(duration.e));
	            return o.onError(duration.e);
	          }
	
	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            function (e) {
	              leftMap.forEach(handleError(e));
	              o.onError(e);
	            },
	            function () {
	              rightMap['delete'](id);
	              group.remove(md);
	            }));
	
	          leftMap.forEach(function (v) { v.onNext(value); });
	        },
	        function (e) {
	          leftMap.forEach(handleError(e));
	          o.onError(e);
	        })
	      );
	
	      return r;
	    }, left);
	  };
	
	  function toArray(x) { return x.toArray(); }
	
	  /**
	   *  Projects each element of an observable sequence into zero or more buffers.
	   *  @param {Mixed} bufferOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
	   *  @param {Function} [bufferClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
	   *  @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.buffer = function () {
	    return this.window.apply(this, arguments)
	      .flatMap(toArray);
	  };
	
	  /**
	   *  Projects each element of an observable sequence into zero or more windows.
	   *
	   *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
	   *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
	   *  @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.window = function (windowOpeningsOrClosingSelector, windowClosingSelector) {
	    if (arguments.length === 1 && typeof arguments[0] !== 'function') {
	      return observableWindowWithBoundaries.call(this, windowOpeningsOrClosingSelector);
	    }
	    return typeof windowOpeningsOrClosingSelector === 'function' ?
	      observableWindowWithClosingSelector.call(this, windowOpeningsOrClosingSelector) :
	      observableWindowWithOpenings.call(this, windowOpeningsOrClosingSelector, windowClosingSelector);
	  };
	
	  function observableWindowWithOpenings(windowOpenings, windowClosingSelector) {
	    return windowOpenings.groupJoin(this, windowClosingSelector, observableEmpty, function (_, win) {
	      return win;
	    });
	  }
	
	  function observableWindowWithBoundaries(windowBoundaries) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var win = new Subject(),
	        d = new CompositeDisposable(),
	        r = new RefCountDisposable(d);
	
	      observer.onNext(addRef(win, r));
	
	      d.add(source.subscribe(function (x) {
	        win.onNext(x);
	      }, function (err) {
	        win.onError(err);
	        observer.onError(err);
	      }, function () {
	        win.onCompleted();
	        observer.onCompleted();
	      }));
	
	      isPromise(windowBoundaries) && (windowBoundaries = observableFromPromise(windowBoundaries));
	
	      d.add(windowBoundaries.subscribe(function (w) {
	        win.onCompleted();
	        win = new Subject();
	        observer.onNext(addRef(win, r));
	      }, function (err) {
	        win.onError(err);
	        observer.onError(err);
	      }, function () {
	        win.onCompleted();
	        observer.onCompleted();
	      }));
	
	      return r;
	    }, source);
	  }
	
	  function observableWindowWithClosingSelector(windowClosingSelector) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var m = new SerialDisposable(),
	        d = new CompositeDisposable(m),
	        r = new RefCountDisposable(d),
	        win = new Subject();
	      observer.onNext(addRef(win, r));
	      d.add(source.subscribe(function (x) {
	          win.onNext(x);
	      }, function (err) {
	          win.onError(err);
	          observer.onError(err);
	      }, function () {
	          win.onCompleted();
	          observer.onCompleted();
	      }));
	
	      function createWindowClose () {
	        var windowClose;
	        try {
	          windowClose = windowClosingSelector();
	        } catch (e) {
	          observer.onError(e);
	          return;
	        }
	
	        isPromise(windowClose) && (windowClose = observableFromPromise(windowClose));
	
	        var m1 = new SingleAssignmentDisposable();
	        m.setDisposable(m1);
	        m1.setDisposable(windowClose.take(1).subscribe(noop, function (err) {
	          win.onError(err);
	          observer.onError(err);
	        }, function () {
	          win.onCompleted();
	          win = new Subject();
	          observer.onNext(addRef(win, r));
	          createWindowClose();
	        }));
	      }
	
	      createWindowClose();
	      return r;
	    }, source);
	  }
	
	  /**
	   * Returns a new observable that triggers on the second and subsequent triggerings of the input observable.
	   * The Nth triggering of the input observable passes the arguments from the N-1th and Nth triggering as a pair.
	   * The argument passed to the N-1th triggering is held in hidden internal state until the Nth triggering occurs.
	   * @returns {Observable} An observable that triggers on successive pairs of observations from the input observable as an array.
	   */
	  observableProto.pairwise = function () {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var previous, hasPrevious = false;
	      return source.subscribe(
	        function (x) {
	          if (hasPrevious) {
	            observer.onNext([previous, x]);
	          } else {
	            hasPrevious = true;
	          }
	          previous = x;
	        },
	        observer.onError.bind(observer),
	        observer.onCompleted.bind(observer));
	    }, source);
	  };
	
	  /**
	   * Returns two observables which partition the observations of the source by the given function.
	   * The first will trigger observations for those values for which the predicate returns true.
	   * The second will trigger observations for those values where the predicate returns false.
	   * The predicate is executed once for each subscribed observer.
	   * Both also propagate all error observations arising from the source and each completes
	   * when the source completes.
	   * @param {Function} predicate
	   *    The function to determine which output Observable will trigger a particular observation.
	   * @returns {Array}
	   *    An array of observables. The first triggers when the predicate returns true,
	   *    and the second triggers when the predicate returns false.
	  */
	  observableProto.partition = function(predicate, thisArg) {
	    return [
	      this.filter(predicate, thisArg),
	      this.filter(function (x, i, o) { return !predicate.call(thisArg, x, i, o); })
	    ];
	  };
	
	  var WhileEnumerable = (function(__super__) {
	    inherits(WhileEnumerable, __super__);
	    function WhileEnumerable(c, s) {
	      this.c = c;
	      this.s = s;
	    }
	    WhileEnumerable.prototype[$iterator$] = function () {
	      var self = this;
	      return {
	        next: function () {
	          return self.c() ?
	           { done: false, value: self.s } :
	           { done: true, value: void 0 };
	        }
	      };
	    };
	    return WhileEnumerable;
	  }(Enumerable));
	  
	  function enumerableWhile(condition, source) {
	    return new WhileEnumerable(condition, source);
	  }  
	
	   /**
	   *  Returns an observable sequence that is the result of invoking the selector on the source sequence, without sharing subscriptions.
	   *  This operator allows for a fluent style of writing queries that use the same sequence multiple times.
	   *
	   * @param {Function} selector Selector function which can use the source sequence as many times as needed, without sharing subscriptions to the source sequence.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.letBind = observableProto['let'] = function (func) {
	    return func(this);
	  };
	
	   /**
	   *  Determines whether an observable collection contains values. 
	   *
	   * @example
	   *  1 - res = Rx.Observable.if(condition, obs1);
	   *  2 - res = Rx.Observable.if(condition, obs1, obs2);
	   *  3 - res = Rx.Observable.if(condition, obs1, scheduler);
	   * @param {Function} condition The condition which determines if the thenSource or elseSource will be run.
	   * @param {Observable} thenSource The observable sequence or Promise that will be run if the condition function returns true.
	   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the condition function returns false. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.
	   * @returns {Observable} An observable sequence which is either the thenSource or elseSource.
	   */
	  Observable['if'] = function (condition, thenSource, elseSourceOrScheduler) {
	    return observableDefer(function () {
	      elseSourceOrScheduler || (elseSourceOrScheduler = observableEmpty());
	
	      isPromise(thenSource) && (thenSource = observableFromPromise(thenSource));
	      isPromise(elseSourceOrScheduler) && (elseSourceOrScheduler = observableFromPromise(elseSourceOrScheduler));
	
	      // Assume a scheduler for empty only
	      typeof elseSourceOrScheduler.now === 'function' && (elseSourceOrScheduler = observableEmpty(elseSourceOrScheduler));
	      return condition() ? thenSource : elseSourceOrScheduler;
	    });
	  };
	
	   /**
	   *  Concatenates the observable sequences obtained by running the specified result selector for each element in source.
	   * There is an alias for this method called 'forIn' for browsers <IE9
	   * @param {Array} sources An array of values to turn into an observable sequence.
	   * @param {Function} resultSelector A function to apply to each item in the sources array to turn it into an observable sequence.
	   * @returns {Observable} An observable sequence from the concatenated observable sequences.
	   */
	  Observable['for'] = Observable.forIn = function (sources, resultSelector, thisArg) {
	    return enumerableOf(sources, resultSelector, thisArg).concat();
	  };
	
	   /**
	   *  Repeats source as long as condition holds emulating a while loop.
	   * There is an alias for this method called 'whileDo' for browsers <IE9
	   *
	   * @param {Function} condition The condition which determines if the source will be repeated.
	   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
	   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
	   */
	  var observableWhileDo = Observable['while'] = Observable.whileDo = function (condition, source) {
	    isPromise(source) && (source = observableFromPromise(source));
	    return enumerableWhile(condition, source).concat();
	  };
	
	   /**
	   *  Repeats source as long as condition holds emulating a do while loop.
	   *
	   * @param {Function} condition The condition which determines if the source will be repeated.
	   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
	   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
	   */
	  observableProto.doWhile = function (condition) {
	    return observableConcat([this, observableWhileDo(condition, this)]);
	  };
	
	   /**
	   *  Uses selector to determine which source in sources to use.
	
	   * @param {Function} selector The function which extracts the value for to test in a case statement.
	   * @param {Array} sources A object which has keys which correspond to the case statement labels.
	   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the sources are not matched. If this is not provided, it defaults to Rx.Observabe.empty with the specified scheduler.
	   *
	   * @returns {Observable} An observable sequence which is determined by a case statement.
	   */
	  Observable['case'] = function (selector, sources, defaultSourceOrScheduler) {
	    return observableDefer(function () {
	      isPromise(defaultSourceOrScheduler) && (defaultSourceOrScheduler = observableFromPromise(defaultSourceOrScheduler));
	      defaultSourceOrScheduler || (defaultSourceOrScheduler = observableEmpty());
	
	      isScheduler(defaultSourceOrScheduler) && (defaultSourceOrScheduler = observableEmpty(defaultSourceOrScheduler));
	
	      var result = sources[selector()];
	      isPromise(result) && (result = observableFromPromise(result));
	
	      return result || defaultSourceOrScheduler;
	    });
	  };
	
	   /**
	   *  Expands an observable sequence by recursively invoking selector.
	   *
	   * @param {Function} selector Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again.
	   * @param {Scheduler} [scheduler] Scheduler on which to perform the expansion. If not provided, this defaults to the current thread scheduler.
	   * @returns {Observable} An observable sequence containing all the elements produced by the recursive expansion.
	   */
	  observableProto.expand = function (selector, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var q = [],
	        m = new SerialDisposable(),
	        d = new CompositeDisposable(m),
	        activeCount = 0,
	        isAcquired = false;
	
	      var ensureActive = function () {
	        var isOwner = false;
	        if (q.length > 0) {
	          isOwner = !isAcquired;
	          isAcquired = true;
	        }
	        if (isOwner) {
	          m.setDisposable(scheduler.scheduleRecursive(function (self) {
	            var work;
	            if (q.length > 0) {
	              work = q.shift();
	            } else {
	              isAcquired = false;
	              return;
	            }
	            var m1 = new SingleAssignmentDisposable();
	            d.add(m1);
	            m1.setDisposable(work.subscribe(function (x) {
	              observer.onNext(x);
	              var result = null;
	              try {
	                result = selector(x);
	              } catch (e) {
	                observer.onError(e);
	              }
	              q.push(result);
	              activeCount++;
	              ensureActive();
	            }, observer.onError.bind(observer), function () {
	              d.remove(m1);
	              activeCount--;
	              if (activeCount === 0) {
	                observer.onCompleted();
	              }
	            }));
	            self();
	          }));
	        }
	      };
	
	      q.push(source);
	      activeCount++;
	      ensureActive();
	      return d;
	    }, this);
	  };
	
	   /**
	   *  Runs all observable sequences in parallel and collect their last elements.
	   *
	   * @example
	   *  1 - res = Rx.Observable.forkJoin([obs1, obs2]);
	   *  1 - res = Rx.Observable.forkJoin(obs1, obs2, ...);
	   * @returns {Observable} An observable sequence with an array collecting the last elements of all the input sequences.
	   */
	  Observable.forkJoin = function () {
	    var allSources = [];
	    if (Array.isArray(arguments[0])) {
	      allSources = arguments[0];
	    } else {
	      for(var i = 0, len = arguments.length; i < len; i++) { allSources.push(arguments[i]); }
	    }
	    return new AnonymousObservable(function (subscriber) {
	      var count = allSources.length;
	      if (count === 0) {
	        subscriber.onCompleted();
	        return disposableEmpty;
	      }
	      var group = new CompositeDisposable(),
	        finished = false,
	        hasResults = new Array(count),
	        hasCompleted = new Array(count),
	        results = new Array(count);
	
	      for (var idx = 0; idx < count; idx++) {
	        (function (i) {
	          var source = allSources[i];
	          isPromise(source) && (source = observableFromPromise(source));
	          group.add(
	            source.subscribe(
	              function (value) {
	              if (!finished) {
	                hasResults[i] = true;
	                results[i] = value;
	              }
	            },
	            function (e) {
	              finished = true;
	              subscriber.onError(e);
	              group.dispose();
	            },
	            function () {
	              if (!finished) {
	                if (!hasResults[i]) {
	                    subscriber.onCompleted();
	                    return;
	                }
	                hasCompleted[i] = true;
	                for (var ix = 0; ix < count; ix++) {
	                  if (!hasCompleted[ix]) { return; }
	                }
	                finished = true;
	                subscriber.onNext(results);
	                subscriber.onCompleted();
	              }
	            }));
	        })(idx);
	      }
	
	      return group;
	    });
	  };
	
	   /**
	   *  Runs two observable sequences in parallel and combines their last elemenets.
	   *
	   * @param {Observable} second Second observable sequence.
	   * @param {Function} resultSelector Result selector function to invoke with the last elements of both sequences.
	   * @returns {Observable} An observable sequence with the result of calling the selector function with the last elements of both input sequences.
	   */
	  observableProto.forkJoin = function (second, resultSelector) {
	    var first = this;
	    return new AnonymousObservable(function (observer) {
	      var leftStopped = false, rightStopped = false,
	        hasLeft = false, hasRight = false,
	        lastLeft, lastRight,
	        leftSubscription = new SingleAssignmentDisposable(), rightSubscription = new SingleAssignmentDisposable();
	
	      isPromise(second) && (second = observableFromPromise(second));
	
	      leftSubscription.setDisposable(
	          first.subscribe(function (left) {
	            hasLeft = true;
	            lastLeft = left;
	          }, function (err) {
	            rightSubscription.dispose();
	            observer.onError(err);
	          }, function () {
	            leftStopped = true;
	            if (rightStopped) {
	              if (!hasLeft) {
	                  observer.onCompleted();
	              } else if (!hasRight) {
	                  observer.onCompleted();
	              } else {
	                var result;
	                try {
	                  result = resultSelector(lastLeft, lastRight);
	                } catch (e) {
	                  observer.onError(e);
	                  return;
	                }
	                observer.onNext(result);
	                observer.onCompleted();
	              }
	            }
	          })
	      );
	
	      rightSubscription.setDisposable(
	        second.subscribe(function (right) {
	          hasRight = true;
	          lastRight = right;
	        }, function (err) {
	          leftSubscription.dispose();
	          observer.onError(err);
	        }, function () {
	          rightStopped = true;
	          if (leftStopped) {
	            if (!hasLeft) {
	              observer.onCompleted();
	            } else if (!hasRight) {
	              observer.onCompleted();
	            } else {
	              var result;
	              try {
	                result = resultSelector(lastLeft, lastRight);
	              } catch (e) {
	                observer.onError(e);
	                return;
	              }
	              observer.onNext(result);
	              observer.onCompleted();
	            }
	          }
	        })
	      );
	
	      return new CompositeDisposable(leftSubscription, rightSubscription);
	    }, first);
	  };
	
	  /**
	   * Comonadic bind operator.
	   * @param {Function} selector A transform function to apply to each element.
	   * @param {Object} scheduler Scheduler used to execute the operation. If not specified, defaults to the ImmediateScheduler.
	   * @returns {Observable} An observable sequence which results from the comonadic bind operation.
	   */
	  observableProto.manySelect = observableProto.extend = function (selector, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    var source = this;
	    return observableDefer(function () {
	      var chain;
	
	      return source
	        .map(function (x) {
	          var curr = new ChainObservable(x);
	
	          chain && chain.onNext(x);
	          chain = curr;
	
	          return curr;
	        })
	        .tap(
	          noop,
	          function (e) { chain && chain.onError(e); },
	          function () { chain && chain.onCompleted(); }
	        )
	        .observeOn(scheduler)
	        .map(selector);
	    }, source);
	  };
	
	  var ChainObservable = (function (__super__) {
	
	    function subscribe (observer) {
	      var self = this, g = new CompositeDisposable();
	      g.add(currentThreadScheduler.schedule(function () {
	        observer.onNext(self.head);
	        g.add(self.tail.mergeAll().subscribe(observer));
	      }));
	
	      return g;
	    }
	
	    inherits(ChainObservable, __super__);
	
	    function ChainObservable(head) {
	      __super__.call(this, subscribe);
	      this.head = head;
	      this.tail = new AsyncSubject();
	    }
	
	    addProperties(ChainObservable.prototype, Observer, {
	      onCompleted: function () {
	        this.onNext(Observable.empty());
	      },
	      onError: function (e) {
	        this.onNext(Observable['throw'](e));
	      },
	      onNext: function (v) {
	        this.tail.onNext(v);
	        this.tail.onCompleted();
	      }
	    });
	
	    return ChainObservable;
	
	  }(Observable));
	
	  var Map = root.Map || (function () {
	    function Map() {
	      this.size = 0;
	      this._values = [];
	      this._keys = [];
	    }
	
	    Map.prototype['delete'] = function (key) {
	      var i = this._keys.indexOf(key);
	      if (i === -1) { return false }
	      this._values.splice(i, 1);
	      this._keys.splice(i, 1);
	      this.size--;
	      return true;
	    };
	
	    Map.prototype.get = function (key) {
	      var i = this._keys.indexOf(key);
	      return i === -1 ? undefined : this._values[i];
	    };
	
	    Map.prototype.set = function (key, value) {
	      var i = this._keys.indexOf(key);
	      if (i === -1) {
	        this._keys.push(key);
	        this._values.push(value);
	        this.size++;
	      } else {
	        this._values[i] = value;
	      }
	      return this;
	    };
	
	    Map.prototype.forEach = function (cb, thisArg) {
	      for (var i = 0; i < this.size; i++) {
	        cb.call(thisArg, this._values[i], this._keys[i]);
	      }
	    };
	
	    return Map;
	  }());
	
	  /**
	   * @constructor
	   * Represents a join pattern over observable sequences.
	   */
	  function Pattern(patterns) {
	    this.patterns = patterns;
	  }
	
	  /**
	   *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
	   *  @param other Observable sequence to match in addition to the current pattern.
	   *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
	   */
	  Pattern.prototype.and = function (other) {
	    return new Pattern(this.patterns.concat(other));
	  };
	
	  /**
	   *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
	   *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
	   *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
	   */
	  Pattern.prototype.thenDo = function (selector) {
	    return new Plan(this, selector);
	  };
	
	  function Plan(expression, selector) {
	      this.expression = expression;
	      this.selector = selector;
	  }
	
	  Plan.prototype.activate = function (externalSubscriptions, observer, deactivate) {
	    var self = this;
	    var joinObservers = [];
	    for (var i = 0, len = this.expression.patterns.length; i < len; i++) {
	      joinObservers.push(planCreateObserver(externalSubscriptions, this.expression.patterns[i], observer.onError.bind(observer)));
	    }
	    var activePlan = new ActivePlan(joinObservers, function () {
	      var result;
	      try {
	        result = self.selector.apply(self, arguments);
	      } catch (e) {
	        observer.onError(e);
	        return;
	      }
	      observer.onNext(result);
	    }, function () {
	      for (var j = 0, jlen = joinObservers.length; j < jlen; j++) {
	        joinObservers[j].removeActivePlan(activePlan);
	      }
	      deactivate(activePlan);
	    });
	    for (i = 0, len = joinObservers.length; i < len; i++) {
	      joinObservers[i].addActivePlan(activePlan);
	    }
	    return activePlan;
	  };
	
	  function planCreateObserver(externalSubscriptions, observable, onError) {
	    var entry = externalSubscriptions.get(observable);
	    if (!entry) {
	      var observer = new JoinObserver(observable, onError);
	      externalSubscriptions.set(observable, observer);
	      return observer;
	    }
	    return entry;
	  }
	
	  function ActivePlan(joinObserverArray, onNext, onCompleted) {
	    this.joinObserverArray = joinObserverArray;
	    this.onNext = onNext;
	    this.onCompleted = onCompleted;
	    this.joinObservers = new Map();
	    for (var i = 0, len = this.joinObserverArray.length; i < len; i++) {
	      var joinObserver = this.joinObserverArray[i];
	      this.joinObservers.set(joinObserver, joinObserver);
	    }
	  }
	
	  ActivePlan.prototype.dequeue = function () {
	    this.joinObservers.forEach(function (v) { v.queue.shift(); });
	  };
	
	  ActivePlan.prototype.match = function () {
	    var i, len, hasValues = true;
	    for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
	      if (this.joinObserverArray[i].queue.length === 0) {
	        hasValues = false;
	        break;
	      }
	    }
	    if (hasValues) {
	      var firstValues = [],
	          isCompleted = false;
	      for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
	        firstValues.push(this.joinObserverArray[i].queue[0]);
	        this.joinObserverArray[i].queue[0].kind === 'C' && (isCompleted = true);
	      }
	      if (isCompleted) {
	        this.onCompleted();
	      } else {
	        this.dequeue();
	        var values = [];
	        for (i = 0, len = firstValues.length; i < firstValues.length; i++) {
	          values.push(firstValues[i].value);
	        }
	        this.onNext.apply(this, values);
	      }
	    }
	  };
	
	  var JoinObserver = (function (__super__) {
	    inherits(JoinObserver, __super__);
	
	    function JoinObserver(source, onError) {
	      __super__.call(this);
	      this.source = source;
	      this.onError = onError;
	      this.queue = [];
	      this.activePlans = [];
	      this.subscription = new SingleAssignmentDisposable();
	      this.isDisposed = false;
	    }
	
	    var JoinObserverPrototype = JoinObserver.prototype;
	
	    JoinObserverPrototype.next = function (notification) {
	      if (!this.isDisposed) {
	        if (notification.kind === 'E') {
	          return this.onError(notification.exception);
	        }
	        this.queue.push(notification);
	        var activePlans = this.activePlans.slice(0);
	        for (var i = 0, len = activePlans.length; i < len; i++) {
	          activePlans[i].match();
	        }
	      }
	    };
	
	    JoinObserverPrototype.error = noop;
	    JoinObserverPrototype.completed = noop;
	
	    JoinObserverPrototype.addActivePlan = function (activePlan) {
	      this.activePlans.push(activePlan);
	    };
	
	    JoinObserverPrototype.subscribe = function () {
	      this.subscription.setDisposable(this.source.materialize().subscribe(this));
	    };
	
	    JoinObserverPrototype.removeActivePlan = function (activePlan) {
	      this.activePlans.splice(this.activePlans.indexOf(activePlan), 1);
	      this.activePlans.length === 0 && this.dispose();
	    };
	
	    JoinObserverPrototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        this.subscription.dispose();
	      }
	    };
	
	    return JoinObserver;
	  } (AbstractObserver));
	
	  /**
	   *  Creates a pattern that matches when both observable sequences have an available value.
	   *
	   *  @param right Observable sequence to match with the current sequence.
	   *  @return {Pattern} Pattern object that matches when both observable sequences have an available value.
	   */
	  observableProto.and = function (right) {
	    return new Pattern([this, right]);
	  };
	
	  /**
	   *  Matches when the observable sequence has an available value and projects the value.
	   *
	   *  @param {Function} selector Selector that will be invoked for values in the source sequence.
	   *  @returns {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
	   */
	  observableProto.thenDo = function (selector) {
	    return new Pattern([this]).thenDo(selector);
	  };
	
	  /**
	   *  Joins together the results from several patterns.
	   *
	   *  @param plans A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.
	   *  @returns {Observable} Observable sequence with the results form matching several patterns.
	   */
	  Observable.when = function () {
	    var len = arguments.length, plans;
	    if (Array.isArray(arguments[0])) {
	      plans = arguments[0];
	    } else {
	      plans = new Array(len);
	      for(var i = 0; i < len; i++) { plans[i] = arguments[i]; }
	    }
	    return new AnonymousObservable(function (o) {
	      var activePlans = [],
	          externalSubscriptions = new Map();
	      var outObserver = observerCreate(
	        function (x) { o.onNext(x); },
	        function (err) {
	          externalSubscriptions.forEach(function (v) { v.onError(err); });
	          o.onError(err);
	        },
	        function (x) { o.onCompleted(); }
	      );
	      try {
	        for (var i = 0, len = plans.length; i < len; i++) {
	          activePlans.push(plans[i].activate(externalSubscriptions, outObserver, function (activePlan) {
	            var idx = activePlans.indexOf(activePlan);
	            activePlans.splice(idx, 1);
	            activePlans.length === 0 && o.onCompleted();
	          }));
	        }
	      } catch (e) {
	        observableThrow(e).subscribe(o);
	      }
	      var group = new CompositeDisposable();
	      externalSubscriptions.forEach(function (joinObserver) {
	        joinObserver.subscribe();
	        group.add(joinObserver);
	      });
	
	      return group;
	    });
	  };
	
	  function observableTimerDate(dueTime, scheduler) {
	    return new AnonymousObservable(function (observer) {
	      return scheduler.scheduleWithAbsolute(dueTime, function () {
	        observer.onNext(0);
	        observer.onCompleted();
	      });
	    });
	  }
	
	  function observableTimerDateAndPeriod(dueTime, period, scheduler) {
	    return new AnonymousObservable(function (observer) {
	      var d = dueTime, p = normalizeTime(period);
	      return scheduler.scheduleRecursiveWithAbsoluteAndState(0, d, function (count, self) {
	        if (p > 0) {
	          var now = scheduler.now();
	          d = d + p;
	          d <= now && (d = now + p);
	        }
	        observer.onNext(count);
	        self(count + 1, d);
	      });
	    });
	  }
	
	  function observableTimerTimeSpan(dueTime, scheduler) {
	    return new AnonymousObservable(function (observer) {
	      return scheduler.scheduleWithRelative(normalizeTime(dueTime), function () {
	        observer.onNext(0);
	        observer.onCompleted();
	      });
	    });
	  }
	
	  function observableTimerTimeSpanAndPeriod(dueTime, period, scheduler) {
	    return dueTime === period ?
	      new AnonymousObservable(function (observer) {
	        return scheduler.schedulePeriodicWithState(0, period, function (count) {
	          observer.onNext(count);
	          return count + 1;
	        });
	      }) :
	      observableDefer(function () {
	        return observableTimerDateAndPeriod(scheduler.now() + dueTime, period, scheduler);
	      });
	  }
	
	  /**
	   *  Returns an observable sequence that produces a value after each period.
	   *
	   * @example
	   *  1 - res = Rx.Observable.interval(1000);
	   *  2 - res = Rx.Observable.interval(1000, Rx.Scheduler.timeout);
	   *
	   * @param {Number} period Period for producing the values in the resulting sequence (specified as an integer denoting milliseconds).
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, Rx.Scheduler.timeout is used.
	   * @returns {Observable} An observable sequence that produces a value after each period.
	   */
	  var observableinterval = Observable.interval = function (period, scheduler) {
	    return observableTimerTimeSpanAndPeriod(period, period, isScheduler(scheduler) ? scheduler : timeoutScheduler);
	  };
	
	  /**
	   *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
	   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
	   * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
	   */
	  var observableTimer = Observable.timer = function (dueTime, periodOrScheduler, scheduler) {
	    var period;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    if (periodOrScheduler != null && typeof periodOrScheduler === 'number') {
	      period = periodOrScheduler;
	    } else if (isScheduler(periodOrScheduler)) {
	      scheduler = periodOrScheduler;
	    }
	    if (dueTime instanceof Date && period === undefined) {
	      return observableTimerDate(dueTime.getTime(), scheduler);
	    }
	    if (dueTime instanceof Date && period !== undefined) {
	      return observableTimerDateAndPeriod(dueTime.getTime(), periodOrScheduler, scheduler);
	    }
	    return period === undefined ?
	      observableTimerTimeSpan(dueTime, scheduler) :
	      observableTimerTimeSpanAndPeriod(dueTime, period, scheduler);
	  };
	
	  function observableDelayTimeSpan(source, dueTime, scheduler) {
	    return new AnonymousObservable(function (observer) {
	      var active = false,
	        cancelable = new SerialDisposable(),
	        exception = null,
	        q = [],
	        running = false,
	        subscription;
	      subscription = source.materialize().timestamp(scheduler).subscribe(function (notification) {
	        var d, shouldRun;
	        if (notification.value.kind === 'E') {
	          q = [];
	          q.push(notification);
	          exception = notification.value.exception;
	          shouldRun = !running;
	        } else {
	          q.push({ value: notification.value, timestamp: notification.timestamp + dueTime });
	          shouldRun = !active;
	          active = true;
	        }
	        if (shouldRun) {
	          if (exception !== null) {
	            observer.onError(exception);
	          } else {
	            d = new SingleAssignmentDisposable();
	            cancelable.setDisposable(d);
	            d.setDisposable(scheduler.scheduleRecursiveWithRelative(dueTime, function (self) {
	              var e, recurseDueTime, result, shouldRecurse;
	              if (exception !== null) {
	                return;
	              }
	              running = true;
	              do {
	                result = null;
	                if (q.length > 0 && q[0].timestamp - scheduler.now() <= 0) {
	                  result = q.shift().value;
	                }
	                if (result !== null) {
	                  result.accept(observer);
	                }
	              } while (result !== null);
	              shouldRecurse = false;
	              recurseDueTime = 0;
	              if (q.length > 0) {
	                shouldRecurse = true;
	                recurseDueTime = Math.max(0, q[0].timestamp - scheduler.now());
	              } else {
	                active = false;
	              }
	              e = exception;
	              running = false;
	              if (e !== null) {
	                observer.onError(e);
	              } else if (shouldRecurse) {
	                self(recurseDueTime);
	              }
	            }));
	          }
	        }
	      });
	      return new CompositeDisposable(subscription, cancelable);
	    }, source);
	  }
	
	  function observableDelayDate(source, dueTime, scheduler) {
	    return observableDefer(function () {
	      return observableDelayTimeSpan(source, dueTime - scheduler.now(), scheduler);
	    });
	  }
	
	  /**
	   *  Time shifts the observable sequence by dueTime. The relative time intervals between the values are preserved.
	   *
	   * @example
	   *  1 - res = Rx.Observable.delay(new Date());
	   *  2 - res = Rx.Observable.delay(new Date(), Rx.Scheduler.timeout);
	   *
	   *  3 - res = Rx.Observable.delay(5000);
	   *  4 - res = Rx.Observable.delay(5000, 1000, Rx.Scheduler.timeout);
	   * @memberOf Observable#
	   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
	   * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Time-shifted sequence.
	   */
	  observableProto.delay = function (dueTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return dueTime instanceof Date ?
	      observableDelayDate(this, dueTime.getTime(), scheduler) :
	      observableDelayTimeSpan(this, dueTime, scheduler);
	  };
	
	  /**
	   *  Ignores values from an observable sequence which are followed by another value before dueTime.
	   * @param {Number} dueTime Duration of the debounce period for each value (specified as an integer denoting milliseconds).
	   * @param {Scheduler} [scheduler]  Scheduler to run the debounce timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The debounced sequence.
	   */
	  observableProto.debounce = function (dueTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var cancelable = new SerialDisposable(), hasvalue = false, value, id = 0;
	      var subscription = source.subscribe(
	        function (x) {
	          hasvalue = true;
	          value = x;
	          id++;
	          var currentId = id,
	            d = new SingleAssignmentDisposable();
	          cancelable.setDisposable(d);
	          d.setDisposable(scheduler.scheduleWithRelative(dueTime, function () {
	            hasvalue && id === currentId && observer.onNext(value);
	            hasvalue = false;
	          }));
	        },
	        function (e) {
	          cancelable.dispose();
	          observer.onError(e);
	          hasvalue = false;
	          id++;
	        },
	        function () {
	          cancelable.dispose();
	          hasvalue && observer.onNext(value);
	          observer.onCompleted();
	          hasvalue = false;
	          id++;
	        });
	      return new CompositeDisposable(subscription, cancelable);
	    }, this);
	  };
	
	  /**
	   * @deprecated use #debounce or #throttleWithTimeout instead.
	   */
	  observableProto.throttle = function(dueTime, scheduler) {
	    //deprecate('throttle', 'debounce or throttleWithTimeout');
	    return this.debounce(dueTime, scheduler);
	  };
	
	  /**
	   *  Projects each element of an observable sequence into zero or more windows which are produced based on timing information.
	   * @param {Number} timeSpan Length of each window (specified as an integer denoting milliseconds).
	   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive windows (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent windows.
	   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
	    var source = this, timeShift;
	    timeShiftOrScheduler == null && (timeShift = timeSpan);
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    if (typeof timeShiftOrScheduler === 'number') {
	      timeShift = timeShiftOrScheduler;
	    } else if (isScheduler(timeShiftOrScheduler)) {
	      timeShift = timeSpan;
	      scheduler = timeShiftOrScheduler;
	    }
	    return new AnonymousObservable(function (observer) {
	      var groupDisposable,
	        nextShift = timeShift,
	        nextSpan = timeSpan,
	        q = [],
	        refCountDisposable,
	        timerD = new SerialDisposable(),
	        totalTime = 0;
	        groupDisposable = new CompositeDisposable(timerD),
	        refCountDisposable = new RefCountDisposable(groupDisposable);
	
	       function createTimer () {
	        var m = new SingleAssignmentDisposable(),
	          isSpan = false,
	          isShift = false;
	        timerD.setDisposable(m);
	        if (nextSpan === nextShift) {
	          isSpan = true;
	          isShift = true;
	        } else if (nextSpan < nextShift) {
	            isSpan = true;
	        } else {
	          isShift = true;
	        }
	        var newTotalTime = isSpan ? nextSpan : nextShift,
	          ts = newTotalTime - totalTime;
	        totalTime = newTotalTime;
	        if (isSpan) {
	          nextSpan += timeShift;
	        }
	        if (isShift) {
	          nextShift += timeShift;
	        }
	        m.setDisposable(scheduler.scheduleWithRelative(ts, function () {
	          if (isShift) {
	            var s = new Subject();
	            q.push(s);
	            observer.onNext(addRef(s, refCountDisposable));
	          }
	          isSpan && q.shift().onCompleted();
	          createTimer();
	        }));
	      };
	      q.push(new Subject());
	      observer.onNext(addRef(q[0], refCountDisposable));
	      createTimer();
	      groupDisposable.add(source.subscribe(
	        function (x) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onNext(x); }
	        },
	        function (e) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onError(e); }
	          observer.onError(e);
	        },
	        function () {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onCompleted(); }
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };
	
	  /**
	   *  Projects each element of an observable sequence into a window that is completed when either it's full or a given amount of time has elapsed.
	   * @param {Number} timeSpan Maximum time length of a window.
	   * @param {Number} count Maximum element count of a window.
	   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithTimeOrCount = function (timeSpan, count, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (observer) {
	      var timerD = new SerialDisposable(),
	          groupDisposable = new CompositeDisposable(timerD),
	          refCountDisposable = new RefCountDisposable(groupDisposable),
	          n = 0,
	          windowId = 0,
	          s = new Subject();
	
	      function createTimer(id) {
	        var m = new SingleAssignmentDisposable();
	        timerD.setDisposable(m);
	        m.setDisposable(scheduler.scheduleWithRelative(timeSpan, function () {
	          if (id !== windowId) { return; }
	          n = 0;
	          var newId = ++windowId;
	          s.onCompleted();
	          s = new Subject();
	          observer.onNext(addRef(s, refCountDisposable));
	          createTimer(newId);
	        }));
	      }
	
	      observer.onNext(addRef(s, refCountDisposable));
	      createTimer(0);
	
	      groupDisposable.add(source.subscribe(
	        function (x) {
	          var newId = 0, newWindow = false;
	          s.onNext(x);
	          if (++n === count) {
	            newWindow = true;
	            n = 0;
	            newId = ++windowId;
	            s.onCompleted();
	            s = new Subject();
	            observer.onNext(addRef(s, refCountDisposable));
	          }
	          newWindow && createTimer(newId);
	        },
	        function (e) {
	          s.onError(e);
	          observer.onError(e);
	        }, function () {
	          s.onCompleted();
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };
	
	  function toArray(x) { return x.toArray(); }
	
	  /**
	   *  Projects each element of an observable sequence into zero or more buffers which are produced based on timing information.
	   * @param {Number} timeSpan Length of each buffer (specified as an integer denoting milliseconds).
	   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive buffers (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent buffers.
	   * @param {Scheduler} [scheduler]  Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
	    return this.windowWithTime(timeSpan, timeShiftOrScheduler, scheduler).flatMap(toArray);
	  };
	
	  function toArray(x) { return x.toArray(); }
	
	  /**
	   *  Projects each element of an observable sequence into a buffer that is completed when either it's full or a given amount of time has elapsed.
	   * @param {Number} timeSpan Maximum time length of a buffer.
	   * @param {Number} count Maximum element count of a buffer.
	   * @param {Scheduler} [scheduler]  Scheduler to run bufferin timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithTimeOrCount = function (timeSpan, count, scheduler) {
	    return this.windowWithTimeOrCount(timeSpan, count, scheduler).flatMap(toArray);
	  };
	
	  /**
	   *  Records the time interval between consecutive values in an observable sequence.
	   *
	   * @example
	   *  1 - res = source.timeInterval();
	   *  2 - res = source.timeInterval(Rx.Scheduler.timeout);
	   *
	   * @param [scheduler]  Scheduler used to compute time intervals. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence with time interval information on values.
	   */
	  observableProto.timeInterval = function (scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return observableDefer(function () {
	      var last = scheduler.now();
	      return source.map(function (x) {
	        var now = scheduler.now(), span = now - last;
	        last = now;
	        return { value: x, interval: span };
	      });
	    });
	  };
	
	  /**
	   *  Records the timestamp for each value in an observable sequence.
	   *
	   * @example
	   *  1 - res = source.timestamp(); // produces { value: x, timestamp: ts }
	   *  2 - res = source.timestamp(Rx.Scheduler.default);
	   *
	   * @param {Scheduler} [scheduler]  Scheduler used to compute timestamps. If not specified, the default scheduler is used.
	   * @returns {Observable} An observable sequence with timestamp information on values.
	   */
	  observableProto.timestamp = function (scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return this.map(function (x) {
	      return { value: x, timestamp: scheduler.now() };
	    });
	  };
	
	  function sampleObservable(source, sampler) {
	    return new AnonymousObservable(function (o) {
	      var atEnd = false, value, hasValue = false;
	
	      function sampleSubscribe() {
	        if (hasValue) {
	          hasValue = false;
	          o.onNext(value);
	        }
	        atEnd && o.onCompleted();
	      }
	
	      var sourceSubscription = new SingleAssignmentDisposable();
	      sourceSubscription.setDisposable(source.subscribe(
	        function (newValue) {
	          hasValue = true;
	          value = newValue;
	        },
	        function (e) { o.onError(e); },
	        function () {
	          atEnd = true;
	          sourceSubscription.dispose(); 
	        }
	      ));
	
	      return new CompositeDisposable(
	        sourceSubscription,
	        sampler.subscribe(sampleSubscribe, function (e) { o.onError(e); }, sampleSubscribe)
	      );
	    }, source);
	  }
	
	  /**
	   *  Samples the observable sequence at each interval.
	   *
	   * @example
	   *  1 - res = source.sample(sampleObservable); // Sampler tick sequence
	   *  2 - res = source.sample(5000); // 5 seconds
	   *  2 - res = source.sample(5000, Rx.Scheduler.timeout); // 5 seconds
	   *
	   * @param {Mixed} intervalOrSampler Interval at which to sample (specified as an integer denoting milliseconds) or Sampler Observable.
	   * @param {Scheduler} [scheduler]  Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Sampled observable sequence.
	   */
	  observableProto.sample = observableProto.throttleLatest = function (intervalOrSampler, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return typeof intervalOrSampler === 'number' ?
	      sampleObservable(this, observableinterval(intervalOrSampler, scheduler)) :
	      sampleObservable(this, intervalOrSampler);
	  };
	
	  /**
	   *  Returns the source observable sequence or the other observable sequence if dueTime elapses.
	   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) when a timeout occurs.
	   * @param {Observable} [other]  Sequence to return in case of a timeout. If not specified, a timeout error throwing sequence will be used.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timeout timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The source sequence switching to the other sequence in case of a timeout.
	   */
	  observableProto.timeout = function (dueTime, other, scheduler) {
	    (other == null || typeof other === 'string') && (other = observableThrow(new Error(other || 'Timeout')));
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	
	    var source = this, schedulerMethod = dueTime instanceof Date ?
	      'scheduleWithAbsolute' :
	      'scheduleWithRelative';
	
	    return new AnonymousObservable(function (observer) {
	      var id = 0,
	        original = new SingleAssignmentDisposable(),
	        subscription = new SerialDisposable(),
	        switched = false,
	        timer = new SerialDisposable();
	
	      subscription.setDisposable(original);
	
	      function createTimer() {
	        var myId = id;
	        timer.setDisposable(scheduler[schedulerMethod](dueTime, function () {
	          if (id === myId) {
	            isPromise(other) && (other = observableFromPromise(other));
	            subscription.setDisposable(other.subscribe(observer));
	          }
	        }));
	      }
	
	      createTimer();
	
	      original.setDisposable(source.subscribe(function (x) {
	        if (!switched) {
	          id++;
	          observer.onNext(x);
	          createTimer();
	        }
	      }, function (e) {
	        if (!switched) {
	          id++;
	          observer.onError(e);
	        }
	      }, function () {
	        if (!switched) {
	          id++;
	          observer.onCompleted();
	        }
	      }));
	      return new CompositeDisposable(subscription, timer);
	    }, source);
	  };
	
	  /**
	   *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
	   *
	   * @example
	   *  res = source.generateWithAbsoluteTime(0,
	   *      function (x) { return return true; },
	   *      function (x) { return x + 1; },
	   *      function (x) { return x; },
	   *      function (x) { return new Date(); }
	   *  });
	   *
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning Date values.
	   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generateWithAbsoluteTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (observer) {
	      var first = true,
	        hasResult = false;
	      return scheduler.scheduleRecursiveWithAbsoluteAndState(initialState, scheduler.now(), function (state, self) {
	        hasResult && observer.onNext(state);
	
	        try {
	          if (first) {
	            first = false;
	          } else {
	            state = iterate(state);
	          }
	          hasResult = condition(state);
	          if (hasResult) {
	            var result = resultSelector(state);
	            var time = timeSelector(state);
	          }
	        } catch (e) {
	          observer.onError(e);
	          return;
	        }
	        if (hasResult) {
	          self(result, time);
	        } else {
	          observer.onCompleted();
	        }
	      });
	    });
	  };
	
	  /**
	   *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
	   *
	   * @example
	   *  res = source.generateWithRelativeTime(0,
	   *      function (x) { return return true; },
	   *      function (x) { return x + 1; },
	   *      function (x) { return x; },
	   *      function (x) { return 500; }
	   *  );
	   *
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning integer values denoting milliseconds.
	   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generateWithRelativeTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (observer) {
	      var first = true,
	        hasResult = false;
	      return scheduler.scheduleRecursiveWithRelativeAndState(initialState, 0, function (state, self) {
	        hasResult && observer.onNext(state);
	
	        try {
	          if (first) {
	            first = false;
	          } else {
	            state = iterate(state);
	          }
	          hasResult = condition(state);
	          if (hasResult) {
	            var result = resultSelector(state);
	            var time = timeSelector(state);
	          }
	        } catch (e) {
	          observer.onError(e);
	          return;
	        }
	        if (hasResult) {
	          self(result, time);
	        } else {
	          observer.onCompleted();
	        }
	      });
	    });
	  };
	
	  /**
	   *  Time shifts the observable sequence by delaying the subscription with the specified relative time duration, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.delaySubscription(5000); // 5s
	   *  2 - res = source.delaySubscription(5000, Rx.Scheduler.default); // 5 seconds
	   *
	   * @param {Number} dueTime Relative or absolute time shift of the subscription.
	   * @param {Scheduler} [scheduler]  Scheduler to run the subscription delay timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Time-shifted sequence.
	   */
	  observableProto.delaySubscription = function (dueTime, scheduler) {
	    var scheduleMethod = dueTime instanceof Date ? 'scheduleWithAbsolute' : 'scheduleWithRelative';
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (o) {
	      var d = new SerialDisposable();
	
	      d.setDisposable(scheduler[scheduleMethod](dueTime, function() {
	        d.setDisposable(source.subscribe(o));
	      }));
	
	      return d;
	    }, this);
	  };
	
	  /**
	   *  Time shifts the observable sequence based on a subscription delay and a delay selector function for each element.
	   *
	   * @example
	   *  1 - res = source.delayWithSelector(function (x) { return Rx.Scheduler.timer(5000); }); // with selector only
	   *  1 - res = source.delayWithSelector(Rx.Observable.timer(2000), function (x) { return Rx.Observable.timer(x); }); // with delay and selector
	   *
	   * @param {Observable} [subscriptionDelay]  Sequence indicating the delay for the subscription to the source.
	   * @param {Function} delayDurationSelector Selector function to retrieve a sequence indicating the delay for each given element.
	   * @returns {Observable} Time-shifted sequence.
	   */
	  observableProto.delayWithSelector = function (subscriptionDelay, delayDurationSelector) {
	    var source = this, subDelay, selector;
	    if (isFunction(subscriptionDelay)) {
	      selector = subscriptionDelay;
	    } else {
	      subDelay = subscriptionDelay;
	      selector = delayDurationSelector;
	    }
	    return new AnonymousObservable(function (observer) {
	      var delays = new CompositeDisposable(), atEnd = false, subscription = new SerialDisposable();
	
	      function start() {
	        subscription.setDisposable(source.subscribe(
	          function (x) {
	            var delay = tryCatch(selector)(x);
	            if (delay === errorObj) { return observer.onError(delay.e); }
	            var d = new SingleAssignmentDisposable();
	            delays.add(d);
	            d.setDisposable(delay.subscribe(
	              function () {
	                observer.onNext(x);
	                delays.remove(d);
	                done();
	              },
	              function (e) { observer.onError(e); },
	              function () {
	                observer.onNext(x);
	                delays.remove(d);
	                done();
	              }
	            ))
	          },
	          function (e) { observer.onError(e); },
	          function () {
	            atEnd = true;
	            subscription.dispose();
	            done();
	          }
	        ))
	      }
	
	      function done () {
	        atEnd && delays.length === 0 && observer.onCompleted();
	      }
	
	      if (!subDelay) {
	        start();
	      } else {
	        subscription.setDisposable(subDelay.subscribe(start, function (e) { observer.onError(e); }, start));
	      }
	
	      return new CompositeDisposable(subscription, delays);
	    }, this);
	  };
	
	    /**
	     *  Returns the source observable sequence, switching to the other observable sequence if a timeout is signaled.
	     * @param {Observable} [firstTimeout]  Observable sequence that represents the timeout for the first element. If not provided, this defaults to Observable.never().
	     * @param {Function} timeoutDurationSelector Selector to retrieve an observable sequence that represents the timeout between the current element and the next element.
	     * @param {Observable} [other]  Sequence to return in case of a timeout. If not provided, this is set to Observable.throwException().
	     * @returns {Observable} The source sequence switching to the other sequence in case of a timeout.
	     */
	    observableProto.timeoutWithSelector = function (firstTimeout, timeoutdurationSelector, other) {
	      if (arguments.length === 1) {
	          timeoutdurationSelector = firstTimeout;
	          firstTimeout = observableNever();
	      }
	      other || (other = observableThrow(new Error('Timeout')));
	      var source = this;
	      return new AnonymousObservable(function (observer) {
	        var subscription = new SerialDisposable(), timer = new SerialDisposable(), original = new SingleAssignmentDisposable();
	
	        subscription.setDisposable(original);
	
	        var id = 0, switched = false;
	
	        function setTimer(timeout) {
	          var myId = id;
	
	          function timerWins () {
	            return id === myId;
	          }
	
	          var d = new SingleAssignmentDisposable();
	          timer.setDisposable(d);
	          d.setDisposable(timeout.subscribe(function () {
	            timerWins() && subscription.setDisposable(other.subscribe(observer));
	            d.dispose();
	          }, function (e) {
	            timerWins() && observer.onError(e);
	          }, function () {
	            timerWins() && subscription.setDisposable(other.subscribe(observer));
	          }));
	        };
	
	        setTimer(firstTimeout);
	
	        function observerWins() {
	          var res = !switched;
	          if (res) { id++; }
	          return res;
	        }
	
	        original.setDisposable(source.subscribe(function (x) {
	          if (observerWins()) {
	            observer.onNext(x);
	            var timeout;
	            try {
	              timeout = timeoutdurationSelector(x);
	            } catch (e) {
	              observer.onError(e);
	              return;
	            }
	            setTimer(isPromise(timeout) ? observableFromPromise(timeout) : timeout);
	          }
	        }, function (e) {
	          observerWins() && observer.onError(e);
	        }, function () {
	          observerWins() && observer.onCompleted();
	        }));
	        return new CompositeDisposable(subscription, timer);
	      }, source);
	    };
	
	  /**
	   * Ignores values from an observable sequence which are followed by another value within a computed throttle duration.
	   * @param {Function} durationSelector Selector function to retrieve a sequence indicating the throttle duration for each given element.
	   * @returns {Observable} The debounced sequence.
	   */
	  observableProto.debounceWithSelector = function (durationSelector) {
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var value, hasValue = false, cancelable = new SerialDisposable(), id = 0;
	      var subscription = source.subscribe(
	        function (x) {
	          var throttle = tryCatch(durationSelector)(x);
	          if (throttle === errorObj) { return o.onError(throttle.e); }
	
	          isPromise(throttle) && (throttle = observableFromPromise(throttle));
	
	          hasValue = true;
	          value = x;
	          id++;
	          var currentid = id, d = new SingleAssignmentDisposable();
	          cancelable.setDisposable(d);
	          d.setDisposable(throttle.subscribe(
	            function () {
	              hasValue && id === currentid && o.onNext(value);
	              hasValue = false;
	              d.dispose();
	            },
	            function (e) { o.onError(e); },
	            function () {
	              hasValue && id === currentid && o.onNext(value);
	              hasValue = false;
	              d.dispose();
	            }
	          ));
	        },
	        function (e) {
	          cancelable.dispose();
	          o.onError(e);
	          hasValue = false;
	          id++;
	        },
	        function () {
	          cancelable.dispose();
	          hasValue && o.onNext(value);
	          o.onCompleted();
	          hasValue = false;
	          id++;
	        }
	      );
	      return new CompositeDisposable(subscription, cancelable);
	    }, source);
	  };
	
	  /**
	   *  Skips elements for the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
	   *
	   *  1 - res = source.skipLastWithTime(5000);
	   *  2 - res = source.skipLastWithTime(5000, scheduler);
	   *
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for skipping elements from the end of the sequence.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout
	   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the end of the source sequence.
	   */
	  observableProto.skipLastWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        var now = scheduler.now();
	        q.push({ interval: now, value: x });
	        while (q.length > 0 && now - q[0].interval >= duration) {
	          o.onNext(q.shift().value);
	        }
	      }, function (e) { o.onError(e); }, function () {
	        var now = scheduler.now();
	        while (q.length > 0 && now - q[0].interval >= duration) {
	          o.onNext(q.shift().value);
	        }
	        o.onCompleted();
	      });
	    }, source);
	  };
	
	  /**
	   *  Returns elements within the specified duration from the end of the observable source sequence, using the specified schedulers to run timers and to drain the collected elements.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the end of the sequence.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the end of the source sequence.
	   */
	  observableProto.takeLastWithTime = function (duration, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        var now = scheduler.now();
	        q.push({ interval: now, value: x });
	        while (q.length > 0 && now - q[0].interval >= duration) {
	          q.shift();
	        }
	      }, function (e) { o.onError(e); }, function () {
	        var now = scheduler.now();
	        while (q.length > 0) {
	          var next = q.shift();
	          if (now - next.interval <= duration) { o.onNext(next.value); }
	        }
	        o.onCompleted();
	      });
	    }, source);
	  };
	
	  /**
	   *  Returns an array with the elements within the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the end of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence containing a single array with the elements taken during the specified duration from the end of the source sequence.
	   */
	  observableProto.takeLastBufferWithTime = function (duration, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        var now = scheduler.now();
	        q.push({ interval: now, value: x });
	        while (q.length > 0 && now - q[0].interval >= duration) {
	          q.shift();
	        }
	      }, function (e) { o.onError(e); }, function () {
	        var now = scheduler.now(), res = [];
	        while (q.length > 0) {
	          var next = q.shift();
	          now - next.interval <= duration && res.push(next.value);
	        }
	        o.onNext(res);
	        o.onCompleted();
	      });
	    }, source);
	  };
	
	  /**
	   *  Takes elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.takeWithTime(5000,  [optional scheduler]);
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the start of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the start of the source sequence.
	   */
	  observableProto.takeWithTime = function (duration, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (o) {
	      return new CompositeDisposable(scheduler.scheduleWithRelative(duration, function () { o.onCompleted(); }), source.subscribe(o));
	    }, source);
	  };
	
	  /**
	   *  Skips elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.skipWithTime(5000, [optional scheduler]);
	   *
	   * @description
	   *  Specifying a zero value for duration doesn't guarantee no elements will be dropped from the start of the source sequence.
	   *  This is a side-effect of the asynchrony introduced by the scheduler, where the action that causes callbacks from the source sequence to be forwarded
	   *  may not execute immediately, despite the zero due time.
	   *
	   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the duration.
	   * @param {Number} duration Duration for skipping elements from the start of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the start of the source sequence.
	   */
	  observableProto.skipWithTime = function (duration, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    return new AnonymousObservable(function (observer) {
	      var open = false;
	      return new CompositeDisposable(
	        scheduler.scheduleWithRelative(duration, function () { open = true; }),
	        source.subscribe(function (x) { open && observer.onNext(x); }, observer.onError.bind(observer), observer.onCompleted.bind(observer)));
	    }, source);
	  };
	
	  /**
	   *  Skips elements from the observable source sequence until the specified start time, using the specified scheduler to run timers.
	   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the start time.
	   *
	   * @examples
	   *  1 - res = source.skipUntilWithTime(new Date(), [scheduler]);
	   *  2 - res = source.skipUntilWithTime(5000, [scheduler]);
	   * @param {Date|Number} startTime Time to start taking elements from the source sequence. If this value is less than or equal to Date(), no elements will be skipped.
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements skipped until the specified start time.
	   */
	  observableProto.skipUntilWithTime = function (startTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    var source = this, schedulerMethod = startTime instanceof Date ?
	      'scheduleWithAbsolute' :
	      'scheduleWithRelative';
	    return new AnonymousObservable(function (o) {
	      var open = false;
	
	      return new CompositeDisposable(
	        scheduler[schedulerMethod](startTime, function () { open = true; }),
	        source.subscribe(
	          function (x) { open && o.onNext(x); },
	          function (e) { o.onError(e); }, function () { o.onCompleted(); }));
	    }, source);
	  };
	
	  /**
	   *  Takes elements for the specified duration until the specified end time, using the specified scheduler to run timers.
	   * @param {Number | Date} endTime Time to stop taking elements from the source sequence. If this value is less than or equal to new Date(), the result stream will complete immediately.
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on.
	   * @returns {Observable} An observable sequence with the elements taken until the specified end time.
	   */
	  observableProto.takeUntilWithTime = function (endTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    var source = this, schedulerMethod = endTime instanceof Date ?
	      'scheduleWithAbsolute' :
	      'scheduleWithRelative';
	    return new AnonymousObservable(function (o) {
	      return new CompositeDisposable(
	        scheduler[schedulerMethod](endTime, function () { o.onCompleted(); }),
	        source.subscribe(o));
	    }, source);
	  };
	
	  /**
	   * Returns an Observable that emits only the first item emitted by the source Observable during sequential time windows of a specified duration.
	   * @param {Number} windowDuration time to wait before emitting another item after emitting the last item
	   * @param {Scheduler} [scheduler] the Scheduler to use internally to manage the timers that handle timeout for each item. If not provided, defaults to Scheduler.timeout.
	   * @returns {Observable} An Observable that performs the throttle operation.
	   */
	  observableProto.throttleFirst = function (windowDuration, scheduler) {
	    isScheduler(scheduler) || (scheduler = timeoutScheduler);
	    var duration = +windowDuration || 0;
	    if (duration <= 0) { throw new RangeError('windowDuration cannot be less or equal zero.'); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var lastOnNext = 0;
	      return source.subscribe(
	        function (x) {
	          var now = scheduler.now();
	          if (lastOnNext === 0 || now - lastOnNext >= duration) {
	            lastOnNext = now;
	            o.onNext(x);
	          }
	        },function (e) { o.onError(e); }, function () { o.onCompleted(); }
	      );
	    }, source);
	  };
	
	  /**
	   * Executes a transducer to transform the observable sequence
	   * @param {Transducer} transducer A transducer to execute
	   * @returns {Observable} An Observable sequence containing the results from the transducer.
	   */
	  observableProto.transduce = function(transducer) {
	    var source = this;
	
	    function transformForObserver(o) {
	      return {
	        '@@transducer/init': function() {
	          return o;
	        },
	        '@@transducer/step': function(obs, input) {
	          return obs.onNext(input);
	        },
	        '@@transducer/result': function(obs) {
	          return obs.onCompleted();
	        }
	      };
	    }
	
	    return new AnonymousObservable(function(o) {
	      var xform = transducer(transformForObserver(o));
	      return source.subscribe(
	        function(v) {
	          var res = tryCatch(xform['@@transducer/step']).call(xform, o, v);
	          if (res === errorObj) { o.onError(res.e); }
	        },
	        function (e) { o.onError(e); },
	        function() { xform['@@transducer/result'](o); }
	      );
	    }, source);
	  };
	
	  /**
	   * Performs a exclusive waiting for the first to finish before subscribing to another observable.
	   * Observables that come in between subscriptions will be dropped on the floor.
	   * @returns {Observable} A exclusive observable with only the results that happen when subscribed.
	   */
	  observableProto.switchFirst = function () {
	    var sources = this;
	    return new AnonymousObservable(function (o) {
	      var hasCurrent = false,
	        isStopped = false,
	        m = new SingleAssignmentDisposable(),
	        g = new CompositeDisposable();
	
	      g.add(m);
	
	      m.setDisposable(sources.subscribe(
	        function (innerSource) {
	          if (!hasCurrent) {
	            hasCurrent = true;
	
	            isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
	
	            var innerSubscription = new SingleAssignmentDisposable();
	            g.add(innerSubscription);
	
	            innerSubscription.setDisposable(innerSource.subscribe(
	              function (x) { o.onNext(x); },
	              function (e) { o.onError(e); },
	              function () {
	                g.remove(innerSubscription);
	                hasCurrent = false;
	                isStopped && g.length === 1 && o.onCompleted();
	            }));
	          }
	        },
	        function (e) { o.onError(e); },
	        function () {
	          isStopped = true;
	          !hasCurrent && g.length === 1 && o.onCompleted();
	        }));
	
	      return g;
	    }, this);
	  };
	
	observableProto.flatMapFirst = observableProto.selectManyFirst = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchFirst();
	};
	
	Rx.Observable.prototype.flatMapWithMaxConcurrent = function(limit, selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).merge(limit);
	};
	  /** Provides a set of extension methods for virtual time scheduling. */
	  var VirtualTimeScheduler = Rx.VirtualTimeScheduler = (function (__super__) {
	
	    function localNow() {
	      return this.toDateTimeOffset(this.clock);
	    }
	
	    function scheduleNow(state, action) {
	      return this.scheduleAbsoluteWithState(state, this.clock, action);
	    }
	
	    function scheduleRelative(state, dueTime, action) {
	      return this.scheduleRelativeWithState(state, this.toRelative(dueTime), action);
	    }
	
	    function scheduleAbsolute(state, dueTime, action) {
	      return this.scheduleRelativeWithState(state, this.toRelative(dueTime - this.now()), action);
	    }
	
	    function invokeAction(scheduler, action) {
	      action();
	      return disposableEmpty;
	    }
	
	    inherits(VirtualTimeScheduler, __super__);
	
	    /**
	     * Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.
	     *
	     * @constructor
	     * @param {Number} initialClock Initial value for the clock.
	     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
	     */
	    function VirtualTimeScheduler(initialClock, comparer) {
	      this.clock = initialClock;
	      this.comparer = comparer;
	      this.isEnabled = false;
	      this.queue = new PriorityQueue(1024);
	      __super__.call(this, localNow, scheduleNow, scheduleRelative, scheduleAbsolute);
	    }
	
	    var VirtualTimeSchedulerPrototype = VirtualTimeScheduler.prototype;
	
	    /**
	     * Adds a relative time value to an absolute time value.
	     * @param {Number} absolute Absolute virtual time value.
	     * @param {Number} relative Relative virtual time value to add.
	     * @return {Number} Resulting absolute virtual time sum value.
	     */
	    VirtualTimeSchedulerPrototype.add = notImplemented;
	
	    /**
	     * Converts an absolute time to a number
	     * @param {Any} The absolute time.
	     * @returns {Number} The absolute time in ms
	     */
	    VirtualTimeSchedulerPrototype.toDateTimeOffset = notImplemented;
	
	    /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     * @param {Number} timeSpan TimeSpan value to convert.
	     * @return {Number} Corresponding relative virtual time value.
	     */
	    VirtualTimeSchedulerPrototype.toRelative = notImplemented;
	
	    /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be emulated using recursive scheduling.
	     * @param {Mixed} state Initial state passed to the action upon the first iteration.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed, potentially updating the state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.schedulePeriodicWithState = function (state, period, action) {
	      var s = new SchedulePeriodicRecursive(this, state, period, action);
	      return s.start();
	    };
	
	    /**
	     * Schedules an action to be executed after dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Number} dueTime Relative time after which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleRelativeWithState = function (state, dueTime, action) {
	      var runAt = this.add(this.clock, dueTime);
	      return this.scheduleAbsoluteWithState(state, runAt, action);
	    };
	
	    /**
	     * Schedules an action to be executed at dueTime.
	     * @param {Number} dueTime Relative time after which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleRelative = function (dueTime, action) {
	      return this.scheduleRelativeWithState(action, dueTime, invokeAction);
	    };
	
	    /**
	     * Starts the virtual time scheduler.
	     */
	    VirtualTimeSchedulerPrototype.start = function () {
	      if (!this.isEnabled) {
	        this.isEnabled = true;
	        do {
	          var next = this.getNext();
	          if (next !== null) {
	            this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
	            next.invoke();
	          } else {
	            this.isEnabled = false;
	          }
	        } while (this.isEnabled);
	      }
	    };
	
	    /**
	     * Stops the virtual time scheduler.
	     */
	    VirtualTimeSchedulerPrototype.stop = function () {
	      this.isEnabled = false;
	    };
	
	    /**
	     * Advances the scheduler's clock to the specified time, running all work till that point.
	     * @param {Number} time Absolute time to advance the scheduler's clock to.
	     */
	    VirtualTimeSchedulerPrototype.advanceTo = function (time) {
	      var dueToClock = this.comparer(this.clock, time);
	      if (this.comparer(this.clock, time) > 0) { throw new ArgumentOutOfRangeError(); }
	      if (dueToClock === 0) { return; }
	      if (!this.isEnabled) {
	        this.isEnabled = true;
	        do {
	          var next = this.getNext();
	          if (next !== null && this.comparer(next.dueTime, time) <= 0) {
	            this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
	            next.invoke();
	          } else {
	            this.isEnabled = false;
	          }
	        } while (this.isEnabled);
	        this.clock = time;
	      }
	    };
	
	    /**
	     * Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.
	     * @param {Number} time Relative time to advance the scheduler's clock by.
	     */
	    VirtualTimeSchedulerPrototype.advanceBy = function (time) {
	      var dt = this.add(this.clock, time),
	          dueToClock = this.comparer(this.clock, dt);
	      if (dueToClock > 0) { throw new ArgumentOutOfRangeError(); }
	      if (dueToClock === 0) {  return; }
	
	      this.advanceTo(dt);
	    };
	
	    /**
	     * Advances the scheduler's clock by the specified relative time.
	     * @param {Number} time Relative time to advance the scheduler's clock by.
	     */
	    VirtualTimeSchedulerPrototype.sleep = function (time) {
	      var dt = this.add(this.clock, time);
	      if (this.comparer(this.clock, dt) >= 0) { throw new ArgumentOutOfRangeError(); }
	
	      this.clock = dt;
	    };
	
	    /**
	     * Gets the next scheduled item to be executed.
	     * @returns {ScheduledItem} The next scheduled item.
	     */
	    VirtualTimeSchedulerPrototype.getNext = function () {
	      while (this.queue.length > 0) {
	        var next = this.queue.peek();
	        if (next.isCancelled()) {
	          this.queue.dequeue();
	        } else {
	          return next;
	        }
	      }
	      return null;
	    };
	
	    /**
	     * Schedules an action to be executed at dueTime.
	     * @param {Scheduler} scheduler Scheduler to execute the action on.
	     * @param {Number} dueTime Absolute time at which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleAbsolute = function (dueTime, action) {
	      return this.scheduleAbsoluteWithState(action, dueTime, invokeAction);
	    };
	
	    /**
	     * Schedules an action to be executed at dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Number} dueTime Absolute time at which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleAbsoluteWithState = function (state, dueTime, action) {
	      var self = this;
	
	      function run(scheduler, state1) {
	        self.queue.remove(si);
	        return action(scheduler, state1);
	      }
	
	      var si = new ScheduledItem(this, state, run, dueTime, this.comparer);
	      this.queue.enqueue(si);
	
	      return si.disposable;
	    };
	
	    return VirtualTimeScheduler;
	  }(Scheduler));
	
	  /** Provides a virtual time scheduler that uses Date for absolute time and number for relative time. */
	  Rx.HistoricalScheduler = (function (__super__) {
	    inherits(HistoricalScheduler, __super__);
	
	    /**
	     * Creates a new historical scheduler with the specified initial clock value.
	     * @constructor
	     * @param {Number} initialClock Initial value for the clock.
	     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
	     */
	    function HistoricalScheduler(initialClock, comparer) {
	      var clock = initialClock == null ? 0 : initialClock;
	      var cmp = comparer || defaultSubComparer;
	      __super__.call(this, clock, cmp);
	    }
	
	    var HistoricalSchedulerProto = HistoricalScheduler.prototype;
	
	    /**
	     * Adds a relative time value to an absolute time value.
	     * @param {Number} absolute Absolute virtual time value.
	     * @param {Number} relative Relative virtual time value to add.
	     * @return {Number} Resulting absolute virtual time sum value.
	     */
	    HistoricalSchedulerProto.add = function (absolute, relative) {
	      return absolute + relative;
	    };
	
	    HistoricalSchedulerProto.toDateTimeOffset = function (absolute) {
	      return new Date(absolute).getTime();
	    };
	
	    /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     * @memberOf HistoricalScheduler
	     * @param {Number} timeSpan TimeSpan value to convert.
	     * @return {Number} Corresponding relative virtual time value.
	     */
	    HistoricalSchedulerProto.toRelative = function (timeSpan) {
	      return timeSpan;
	    };
	
	    return HistoricalScheduler;
	  }(Rx.VirtualTimeScheduler));
	
	  var AnonymousObservable = Rx.AnonymousObservable = (function (__super__) {
	    inherits(AnonymousObservable, __super__);
	
	    // Fix subscriber to check for undefined or function returned to decorate as Disposable
	    function fixSubscriber(subscriber) {
	      return subscriber && isFunction(subscriber.dispose) ? subscriber :
	        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
	    }
	
	    function setDisposable(s, state) {
	      var ado = state[0], self = state[1];
	      var sub = tryCatch(self.__subscribe).call(self, ado);
	
	      if (sub === errorObj) {
	        if(!ado.fail(errorObj.e)) { return thrower(errorObj.e); }
	      }
	      ado.setDisposable(fixSubscriber(sub));
	    }
	
	    function innerSubscribe(observer) {
	      var ado = new AutoDetachObserver(observer), state = [ado, this];
	
	      if (currentThreadScheduler.scheduleRequired()) {
	        currentThreadScheduler.scheduleWithState(state, setDisposable);
	      } else {
	        setDisposable(null, state);
	      }
	      return ado;
	    }
	
	    function AnonymousObservable(subscribe, parent) {
	      this.source = parent;
	      this.__subscribe = subscribe;
	      __super__.call(this, innerSubscribe);
	    }
	
	    return AnonymousObservable;
	
	  }(Observable));
	
	  var AutoDetachObserver = (function (__super__) {
	    inherits(AutoDetachObserver, __super__);
	
	    function AutoDetachObserver(observer) {
	      __super__.call(this);
	      this.observer = observer;
	      this.m = new SingleAssignmentDisposable();
	    }
	
	    var AutoDetachObserverPrototype = AutoDetachObserver.prototype;
	
	    AutoDetachObserverPrototype.next = function (value) {
	      var result = tryCatch(this.observer.onNext).call(this.observer, value);
	      if (result === errorObj) {
	        this.dispose();
	        thrower(result.e);
	      }
	    };
	
	    AutoDetachObserverPrototype.error = function (err) {
	      var result = tryCatch(this.observer.onError).call(this.observer, err);
	      this.dispose();
	      result === errorObj && thrower(result.e);
	    };
	
	    AutoDetachObserverPrototype.completed = function () {
	      var result = tryCatch(this.observer.onCompleted).call(this.observer);
	      this.dispose();
	      result === errorObj && thrower(result.e);
	    };
	
	    AutoDetachObserverPrototype.setDisposable = function (value) { this.m.setDisposable(value); };
	    AutoDetachObserverPrototype.getDisposable = function () { return this.m.getDisposable(); };
	
	    AutoDetachObserverPrototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this.m.dispose();
	    };
	
	    return AutoDetachObserver;
	  }(AbstractObserver));
	
	  var GroupedObservable = (function (__super__) {
	    inherits(GroupedObservable, __super__);
	
	    function subscribe(observer) {
	      return this.underlyingObservable.subscribe(observer);
	    }
	
	    function GroupedObservable(key, underlyingObservable, mergedDisposable) {
	      __super__.call(this, subscribe);
	      this.key = key;
	      this.underlyingObservable = !mergedDisposable ?
	        underlyingObservable :
	        new AnonymousObservable(function (observer) {
	          return new CompositeDisposable(mergedDisposable.getDisposable(), underlyingObservable.subscribe(observer));
	        });
	    }
	
	    return GroupedObservable;
	  }(Observable));
	
	  /**
	   *  Represents an object that is both an observable sequence as well as an observer.
	   *  Each notification is broadcasted to all subscribed observers.
	   */
	  var Subject = Rx.Subject = (function (__super__) {
	    function subscribe(observer) {
	      checkDisposed(this);
	      if (!this.isStopped) {
	        this.observers.push(observer);
	        return new InnerSubscription(this, observer);
	      }
	      if (this.hasError) {
	        observer.onError(this.error);
	        return disposableEmpty;
	      }
	      observer.onCompleted();
	      return disposableEmpty;
	    }
	
	    inherits(Subject, __super__);
	
	    /**
	     * Creates a subject.
	     */
	    function Subject() {
	      __super__.call(this, subscribe);
	      this.isDisposed = false,
	      this.isStopped = false,
	      this.observers = [];
	      this.hasError = false;
	    }
	
	    addProperties(Subject.prototype, Observer.prototype, {
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () { return this.observers.length > 0; },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onCompleted();
	          }
	
	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.error = error;
	          this.hasError = true;
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onError(error);
	          }
	
	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onNext(value);
	          }
	        }
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	      }
	    });
	
	    /**
	     * Creates a subject from the specified observer and observable.
	     * @param {Observer} observer The observer used to send messages to the subject.
	     * @param {Observable} observable The observable used to subscribe to messages sent from the subject.
	     * @returns {Subject} Subject implemented using the given observer and observable.
	     */
	    Subject.create = function (observer, observable) {
	      return new AnonymousSubject(observer, observable);
	    };
	
	    return Subject;
	  }(Observable));
	
	  /**
	   *  Represents the result of an asynchronous operation.
	   *  The last value before the OnCompleted notification, or the error received through OnError, is sent to all subscribed observers.
	   */
	  var AsyncSubject = Rx.AsyncSubject = (function (__super__) {
	
	    function subscribe(observer) {
	      checkDisposed(this);
	
	      if (!this.isStopped) {
	        this.observers.push(observer);
	        return new InnerSubscription(this, observer);
	      }
	
	      if (this.hasError) {
	        observer.onError(this.error);
	      } else if (this.hasValue) {
	        observer.onNext(this.value);
	        observer.onCompleted();
	      } else {
	        observer.onCompleted();
	      }
	
	      return disposableEmpty;
	    }
	
	    inherits(AsyncSubject, __super__);
	
	    /**
	     * Creates a subject that can only receive one value and that value is cached for all future observations.
	     * @constructor
	     */
	    function AsyncSubject() {
	      __super__.call(this, subscribe);
	
	      this.isDisposed = false;
	      this.isStopped = false;
	      this.hasValue = false;
	      this.observers = [];
	      this.hasError = false;
	    }
	
	    addProperties(AsyncSubject.prototype, Observer, {
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () {
	        checkDisposed(this);
	        return this.observers.length > 0;
	      },
	      /**
	       * Notifies all subscribed observers about the end of the sequence, also causing the last received value to be sent out (if any).
	       */
	      onCompleted: function () {
	        var i, len;
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          var os = cloneArray(this.observers), len = os.length;
	
	          if (this.hasValue) {
	            for (i = 0; i < len; i++) {
	              var o = os[i];
	              o.onNext(this.value);
	              o.onCompleted();
	            }
	          } else {
	            for (i = 0; i < len; i++) {
	              os[i].onCompleted();
	            }
	          }
	
	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the error.
	       * @param {Mixed} error The Error to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.hasError = true;
	          this.error = error;
	
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onError(error);
	          }
	
	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Sends a value to the subject. The last value received before successful termination will be sent to all subscribed and future observers.
	       * @param {Mixed} value The value to store in the subject.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.value = value;
	        this.hasValue = true;
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	        this.exception = null;
	        this.value = null;
	      }
	    });
	
	    return AsyncSubject;
	  }(Observable));
	
	  var AnonymousSubject = Rx.AnonymousSubject = (function (__super__) {
	    inherits(AnonymousSubject, __super__);
	
	    function subscribe(observer) {
	      return this.observable.subscribe(observer);
	    }
	
	    function AnonymousSubject(observer, observable) {
	      this.observer = observer;
	      this.observable = observable;
	      __super__.call(this, subscribe);
	    }
	
	    addProperties(AnonymousSubject.prototype, Observer.prototype, {
	      onCompleted: function () {
	        this.observer.onCompleted();
	      },
	      onError: function (error) {
	        this.observer.onError(error);
	      },
	      onNext: function (value) {
	        this.observer.onNext(value);
	      }
	    });
	
	    return AnonymousSubject;
	  }(Observable));
	
	  /**
	  * Used to pause and resume streams.
	  */
	  Rx.Pauser = (function (__super__) {
	    inherits(Pauser, __super__);
	
	    function Pauser() {
	      __super__.call(this);
	    }
	
	    /**
	     * Pauses the underlying sequence.
	     */
	    Pauser.prototype.pause = function () { this.onNext(false); };
	
	    /**
	    * Resumes the underlying sequence.
	    */
	    Pauser.prototype.resume = function () { this.onNext(true); };
	
	    return Pauser;
	  }(Subject));
	
	  if (true) {
	    root.Rx = Rx;
	
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return Rx;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (freeExports && freeModule) {
	    // in Node.js or RingoJS
	    if (moduleExports) {
	      (freeModule.exports = Rx).Rx = Rx;
	    } else {
	      freeExports.Rx = Rx;
	    }
	  } else {
	    // in a browser or Rhino
	    root.Rx = Rx;
	  }
	
	  // All code before this point will be filtered from stack traces.
	  var rEndingLine = captureLine();
	
	}.call(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(231)(module), (function() { return this; }()), __webpack_require__(232)))

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _require = __webpack_require__(2);
	
	var Rx = _require.Rx;
	
	var toHTML = __webpack_require__(142);
	
	var _require2 = __webpack_require__(52);
	
	var replaceCustomElementsWithSomething = _require2.replaceCustomElementsWithSomething;
	var makeCustomElementsRegistry = _require2.makeCustomElementsRegistry;
	
	var _require3 = __webpack_require__(51);
	
	var makeCustomElementInput = _require3.makeCustomElementInput;
	var ALL_PROPS = _require3.ALL_PROPS;
	
	var _require4 = __webpack_require__(54);
	
	var transposeVTree = _require4.transposeVTree;
	
	function makePropertiesDriverFromVTree(vtree) {
	  return {
	    get: function get(propertyName) {
	      if (propertyName === ALL_PROPS) {
	        return Rx.Observable.just(vtree.properties);
	      } else {
	        return Rx.Observable.just(vtree.properties[propertyName]);
	      }
	    }
	  };
	}
	
	function makeReplaceCustomElementsWithVTree$(CERegistry, driverName) {
	  return function replaceCustomElementsWithVTree$(vtree) {
	    return replaceCustomElementsWithSomething(vtree, CERegistry, function toVTree$(_vtree, WidgetClass) {
	      var interactions = { get: function get() {
	          return Rx.Observable.empty();
	        } };
	      var props = makePropertiesDriverFromVTree(_vtree);
	      var input = makeCustomElementInput(interactions, props);
	      var output = WidgetClass.definitionFn(input);
	      var vtree$ = output[driverName].last();
	      /*eslint-disable no-use-before-define */
	      return convertCustomElementsToVTree(vtree$, CERegistry, driverName);
	      /*eslint-enable no-use-before-define */
	    });
	  };
	}
	
	function convertCustomElementsToVTree(vtree$, CERegistry, driverName) {
	  return vtree$.map(makeReplaceCustomElementsWithVTree$(CERegistry, driverName)).flatMap(transposeVTree);
	}
	
	function makeResponseGetter() {
	  return function get(selector) {
	    if (console && console.log) {
	      console.log("WARNING: HTML Driver's get(selector) is deprecated.");
	    }
	    if (selector === ":root") {
	      return this;
	    } else {
	      return Rx.Observable.empty();
	    }
	  };
	}
	
	function makeHTMLDriver() {
	  var customElementDefinitions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  var registry = makeCustomElementsRegistry(customElementDefinitions);
	  return function htmlDriver(vtree$, driverName) {
	    var vtreeLast$ = vtree$.last();
	    var output$ = convertCustomElementsToVTree(vtreeLast$, registry, driverName).map(function (vtree) {
	      return toHTML(vtree);
	    });
	    output$.get = makeResponseGetter();
	    return output$;
	  };
	}
	
	module.exports = {
	  makePropertiesDriverFromVTree: makePropertiesDriverFromVTree,
	  makeReplaceCustomElementsWithVTree$: makeReplaceCustomElementsWithVTree$,
	  convertCustomElementsToVTree: convertCustomElementsToVTree,
	
	  makeHTMLDriver: makeHTMLDriver
	};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(98)() ? Map : __webpack_require__(136);


/***/ },
/* 98 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function () {
		var map, iterator, result;
		if (typeof Map !== 'function') return false;
		try {
			// WebKit doesn't support arguments and crashes
			map = new Map([['raz', 'one'], ['dwa', 'two'], ['trzy', 'three']]);
		} catch (e) {
			return false;
		}
		if (map.size !== 3) return false;
		if (typeof map.clear !== 'function') return false;
		if (typeof map.delete !== 'function') return false;
		if (typeof map.entries !== 'function') return false;
		if (typeof map.forEach !== 'function') return false;
		if (typeof map.get !== 'function') return false;
		if (typeof map.has !== 'function') return false;
		if (typeof map.keys !== 'function') return false;
		if (typeof map.set !== 'function') return false;
		if (typeof map.values !== 'function') return false;
	
		iterator = map.entries();
		result = iterator.next();
		if (result.done !== false) return false;
		if (!result.value) return false;
		if (result.value[0] !== 'raz') return false;
		if (result.value[1] !== 'one') return false;
		return true;
	};


/***/ },
/* 99 */
/***/ function(module, exports) {

	// Exports true if environment provides native `Map` implementation,
	// whatever that is.
	
	'use strict';
	
	module.exports = (function () {
		if (typeof Map === 'undefined') return false;
		return (Object.prototype.toString.call(Map.prototype) === '[object Map]');
	}());


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(121)('key',
		'value', 'key+value');


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var setPrototypeOf    = __webpack_require__(34)
	  , d                 = __webpack_require__(11)
	  , Iterator          = __webpack_require__(40)
	  , toStringTagSymbol = __webpack_require__(62).toStringTag
	  , kinds             = __webpack_require__(100)
	
	  , defineProperties = Object.defineProperties
	  , unBind = Iterator.prototype._unBind
	  , MapIterator;
	
	MapIterator = module.exports = function (map, kind) {
		if (!(this instanceof MapIterator)) return new MapIterator(map, kind);
		Iterator.call(this, map.__mapKeysData__, map);
		if (!kind || !kinds[kind]) kind = 'key+value';
		defineProperties(this, {
			__kind__: d('', kind),
			__values__: d('w', map.__mapValuesData__)
		});
	};
	if (setPrototypeOf) setPrototypeOf(MapIterator, Iterator);
	
	MapIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(MapIterator),
		_resolve: d(function (i) {
			if (this.__kind__ === 'value') return this.__values__[i];
			if (this.__kind__ === 'key') return this.__list__[i];
			return [this.__list__[i], this.__values__[i]];
		}),
		_unBind: d(function () {
			this.__values__ = null;
			unBind.call(this);
		}),
		toString: d(function () { return '[object Map Iterator]'; })
	});
	Object.defineProperty(MapIterator.prototype, toStringTagSymbol,
		d('c', 'Map Iterator'));


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var copy       = __webpack_require__(112)
	  , map        = __webpack_require__(119)
	  , callable   = __webpack_require__(14)
	  , validValue = __webpack_require__(7)
	
	  , bind = Function.prototype.bind, defineProperty = Object.defineProperty
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , define;
	
	define = function (name, desc, bindTo) {
		var value = validValue(desc) && callable(desc.value), dgs;
		dgs = copy(desc);
		delete dgs.writable;
		delete dgs.value;
		dgs.get = function () {
			if (hasOwnProperty.call(this, name)) return value;
			desc.value = bind.call(value, (bindTo == null) ? this : this[bindTo]);
			defineProperty(this, name, desc);
			return this[name];
		};
		return dgs;
	};
	
	module.exports = function (props/*, bindTo*/) {
		var bindTo = arguments[1];
		return map(props, function (desc, name) {
			return define(name, desc, bindTo);
		});
	};


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var toPosInt = __webpack_require__(108)
	  , value    = __webpack_require__(7)
	
	  , indexOf = Array.prototype.indexOf
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , abs = Math.abs, floor = Math.floor;
	
	module.exports = function (searchElement/*, fromIndex*/) {
		var i, l, fromIndex, val;
		if (searchElement === searchElement) { //jslint: ignore
			return indexOf.apply(this, arguments);
		}
	
		l = toPosInt(value(this).length);
		fromIndex = arguments[1];
		if (isNaN(fromIndex)) fromIndex = 0;
		else if (fromIndex >= 0) fromIndex = floor(fromIndex);
		else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));
	
		for (i = fromIndex; i < l; ++i) {
			if (hasOwnProperty.call(this, i)) {
				val = this[i];
				if (val !== val) return i; //jslint: ignore
			}
		}
		return -1;
	};


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(105)()
		? Math.sign
		: __webpack_require__(106);


/***/ },
/* 105 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function () {
		var sign = Math.sign;
		if (typeof sign !== 'function') return false;
		return ((sign(10) === 1) && (sign(-20) === -1));
	};


/***/ },
/* 106 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (value) {
		value = Number(value);
		if (isNaN(value) || (value === 0)) return value;
		return (value > 0) ? 1 : -1;
	};


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var sign = __webpack_require__(104)
	
	  , abs = Math.abs, floor = Math.floor;
	
	module.exports = function (value) {
		if (isNaN(value)) return 0;
		value = Number(value);
		if ((value === 0) || !isFinite(value)) return value;
		return sign(value) * floor(abs(value));
	};


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var toInteger = __webpack_require__(107)
	
	  , max = Math.max;
	
	module.exports = function (value) { return max(0, toInteger(value)); };


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	// Internal method, used by iteration functions.
	// Calls a function for each key-value pair found in object
	// Optionally takes compareFn to iterate object in specific order
	
	'use strict';
	
	var isCallable = __webpack_require__(57)
	  , callable   = __webpack_require__(14)
	  , value      = __webpack_require__(7)
	
	  , call = Function.prototype.call, keys = Object.keys
	  , propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
	
	module.exports = function (method, defVal) {
		return function (obj, cb/*, thisArg, compareFn*/) {
			var list, thisArg = arguments[2], compareFn = arguments[3];
			obj = Object(value(obj));
			callable(cb);
	
			list = keys(obj);
			if (compareFn) {
				list.sort(isCallable(compareFn) ? compareFn.bind(obj) : undefined);
			}
			return list[method](function (key, index) {
				if (!propertyIsEnumerable.call(obj, key)) return defVal;
				return call.call(cb, thisArg, obj[key], key, obj, index);
			});
		};
	};


/***/ },
/* 110 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function () {
		var assign = Object.assign, obj;
		if (typeof assign !== 'function') return false;
		obj = { foo: 'raz' };
		assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
		return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
	};


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var keys  = __webpack_require__(116)
	  , value = __webpack_require__(7)
	
	  , max = Math.max;
	
	module.exports = function (dest, src/*, …srcn*/) {
		var error, i, l = max(arguments.length, 2), assign;
		dest = Object(value(dest));
		assign = function (key) {
			try { dest[key] = src[key]; } catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < l; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== undefined) throw error;
		return dest;
	};


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var assign = __webpack_require__(38)
	  , value  = __webpack_require__(7);
	
	module.exports = function (obj) {
		var copy = Object(value(obj));
		if (copy !== obj) return copy;
		return assign({}, obj);
	};


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	// Workaround for http://code.google.com/p/v8/issues/detail?id=2804
	
	'use strict';
	
	var create = Object.create, shim;
	
	if (!__webpack_require__(58)()) {
		shim = __webpack_require__(59);
	}
	
	module.exports = (function () {
		var nullObject, props, desc;
		if (!shim) return create;
		if (shim.level !== 1) return create;
	
		nullObject = {};
		props = {};
		desc = { configurable: false, enumerable: false, writable: true,
			value: undefined };
		Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
			if (name === '__proto__') {
				props[name] = { configurable: true, enumerable: false, writable: true,
					value: undefined };
				return;
			}
			props[name] = desc;
		});
		Object.defineProperties(nullObject, props);
	
		Object.defineProperty(shim, 'nullPolyfill', { configurable: false,
			enumerable: false, writable: false, value: nullObject });
	
		return function (prototype, props) {
			return create((prototype === null) ? nullObject : prototype, props);
		};
	}());


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(109)('forEach');


/***/ },
/* 115 */
/***/ function(module, exports) {

	'use strict';
	
	var map = { function: true, object: true };
	
	module.exports = function (x) {
		return ((x != null) && map[typeof x]) || false;
	};


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(117)()
		? Object.keys
		: __webpack_require__(118);


/***/ },
/* 117 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function () {
		try {
			Object.keys('primitive');
			return true;
		} catch (e) { return false; }
	};


/***/ },
/* 118 */
/***/ function(module, exports) {

	'use strict';
	
	var keys = Object.keys;
	
	module.exports = function (object) {
		return keys(object == null ? object : Object(object));
	};


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var callable = __webpack_require__(14)
	  , forEach  = __webpack_require__(114)
	
	  , call = Function.prototype.call;
	
	module.exports = function (obj, cb/*, thisArg*/) {
		var o = {}, thisArg = arguments[2];
		callable(cb);
		forEach(obj, function (value, key, obj, index) {
			o[key] = call.call(cb, thisArg, value, key, obj, index);
		});
		return o;
	};


/***/ },
/* 120 */
/***/ function(module, exports) {

	'use strict';
	
	var forEach = Array.prototype.forEach, create = Object.create;
	
	var process = function (src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};
	
	module.exports = function (options/*, …options*/) {
		var result = create(null);
		forEach.call(arguments, function (options) {
			if (options == null) return;
			process(Object(options), result);
		});
		return result;
	};


/***/ },
/* 121 */
/***/ function(module, exports) {

	'use strict';
	
	var forEach = Array.prototype.forEach, create = Object.create;
	
	module.exports = function (arg/*, …args*/) {
		var set = create(null);
		forEach.call(arguments, function (name) { set[name] = true; });
		return set;
	};


/***/ },
/* 122 */
/***/ function(module, exports) {

	'use strict';
	
	var str = 'razdwatrzy';
	
	module.exports = function () {
		if (typeof str.contains !== 'function') return false;
		return ((str.contains('dwa') === true) && (str.contains('foo') === false));
	};


/***/ },
/* 123 */
/***/ function(module, exports) {

	'use strict';
	
	var indexOf = String.prototype.indexOf;
	
	module.exports = function (searchString/*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var setPrototypeOf = __webpack_require__(34)
	  , contains       = __webpack_require__(60)
	  , d              = __webpack_require__(11)
	  , Iterator       = __webpack_require__(40)
	
	  , defineProperty = Object.defineProperty
	  , ArrayIterator;
	
	ArrayIterator = module.exports = function (arr, kind) {
		if (!(this instanceof ArrayIterator)) return new ArrayIterator(arr, kind);
		Iterator.call(this, arr);
		if (!kind) kind = 'value';
		else if (contains.call(kind, 'key+value')) kind = 'key+value';
		else if (contains.call(kind, 'key')) kind = 'key';
		else kind = 'value';
		defineProperty(this, '__kind__', d('', kind));
	};
	if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);
	
	ArrayIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(ArrayIterator),
		_resolve: d(function (i) {
			if (this.__kind__ === 'value') return this.__list__[i];
			if (this.__kind__ === 'key+value') return [i, this.__list__[i]];
			return i;
		}),
		toString: d(function () { return '[object Array Iterator]'; })
	});


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var callable = __webpack_require__(14)
	  , isString = __webpack_require__(39)
	  , get      = __webpack_require__(126)
	
	  , isArray = Array.isArray, call = Function.prototype.call;
	
	module.exports = function (iterable, cb/*, thisArg*/) {
		var mode, thisArg = arguments[2], result, doBreak, broken, i, l, char, code;
		if (isArray(iterable)) mode = 'array';
		else if (isString(iterable)) mode = 'string';
		else iterable = get(iterable);
	
		callable(cb);
		doBreak = function () { broken = true; };
		if (mode === 'array') {
			iterable.some(function (value) {
				call.call(cb, thisArg, value, doBreak);
				if (broken) return true;
			});
			return;
		}
		if (mode === 'string') {
			l = iterable.length;
			for (i = 0; i < l; ++i) {
				char = iterable[i];
				if ((i + 1) < l) {
					code = char.charCodeAt(0);
					if ((code >= 0xD800) && (code <= 0xDBFF)) char += iterable[++i];
				}
				call.call(cb, thisArg, char, doBreak);
				if (broken) break;
			}
			return;
		}
		result = iterable.next();
	
		while (!result.done) {
			call.call(cb, thisArg, result.value, doBreak);
			if (broken) return;
			result = iterable.next();
		}
	};


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isString = __webpack_require__(39)
	  , ArrayIterator  = __webpack_require__(124)
	  , StringIterator = __webpack_require__(132)
	  , iterable       = __webpack_require__(61)
	  , iteratorSymbol = __webpack_require__(41).iterator;
	
	module.exports = function (obj) {
		if (typeof iterable(obj)[iteratorSymbol] === 'function') return obj[iteratorSymbol]();
		if (isString(obj)) return new StringIterator(obj);
		return new ArrayIterator(obj);
	};


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isString       = __webpack_require__(39)
	  , iteratorSymbol = __webpack_require__(41).iterator
	
	  , isArray = Array.isArray;
	
	module.exports = function (value) {
		if (value == null) return false;
		if (isArray(value)) return true;
		if (isString(value)) return true;
		return (typeof value[iteratorSymbol] === 'function');
	};


/***/ },
/* 128 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function () {
		var symbol;
		if (typeof Symbol !== 'function') return false;
		symbol = Symbol('test symbol');
		try { String(symbol); } catch (e) { return false; }
		if (typeof Symbol.iterator === 'symbol') return true;
	
		// Return 'true' for polyfills
		if (typeof Symbol.isConcatSpreadable !== 'object') return false;
		if (typeof Symbol.iterator !== 'object') return false;
		if (typeof Symbol.toPrimitive !== 'object') return false;
		if (typeof Symbol.toStringTag !== 'object') return false;
		if (typeof Symbol.unscopables !== 'object') return false;
	
		return true;
	};


/***/ },
/* 129 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (x) {
		return (x && ((typeof x === 'symbol') || (x['@@toStringTag'] === 'Symbol'))) || false;
	};


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var d              = __webpack_require__(11)
	  , validateSymbol = __webpack_require__(131)
	
	  , create = Object.create, defineProperties = Object.defineProperties
	  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
	  , Symbol, HiddenSymbol, globalSymbols = create(null);
	
	var generateName = (function () {
		var created = create(null);
		return function (desc) {
			var postfix = 0, name;
			while (created[desc + (postfix || '')]) ++postfix;
			desc += (postfix || '');
			created[desc] = true;
			name = '@@' + desc;
			defineProperty(objPrototype, name, d.gs(null, function (value) {
				defineProperty(this, name, d(value));
			}));
			return name;
		};
	}());
	
	HiddenSymbol = function Symbol(description) {
		if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
		return Symbol(description);
	};
	module.exports = Symbol = function Symbol(description) {
		var symbol;
		if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
		symbol = create(HiddenSymbol.prototype);
		description = (description === undefined ? '' : String(description));
		return defineProperties(symbol, {
			__description__: d('', description),
			__name__: d('', generateName(description))
		});
	};
	defineProperties(Symbol, {
		for: d(function (key) {
			if (globalSymbols[key]) return globalSymbols[key];
			return (globalSymbols[key] = Symbol(String(key)));
		}),
		keyFor: d(function (s) {
			var key;
			validateSymbol(s);
			for (key in globalSymbols) if (globalSymbols[key] === s) return key;
		}),
		hasInstance: d('', Symbol('hasInstance')),
		isConcatSpreadable: d('', Symbol('isConcatSpreadable')),
		iterator: d('', Symbol('iterator')),
		match: d('', Symbol('match')),
		replace: d('', Symbol('replace')),
		search: d('', Symbol('search')),
		species: d('', Symbol('species')),
		split: d('', Symbol('split')),
		toPrimitive: d('', Symbol('toPrimitive')),
		toStringTag: d('', Symbol('toStringTag')),
		unscopables: d('', Symbol('unscopables'))
	});
	defineProperties(HiddenSymbol.prototype, {
		constructor: d(Symbol),
		toString: d('', function () { return this.__name__; })
	});
	
	defineProperties(Symbol.prototype, {
		toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
		valueOf: d(function () { return validateSymbol(this); })
	});
	defineProperty(Symbol.prototype, Symbol.toPrimitive, d('',
		function () { return validateSymbol(this); }));
	defineProperty(Symbol.prototype, Symbol.toStringTag, d('c', 'Symbol'));
	
	defineProperty(HiddenSymbol.prototype, Symbol.toPrimitive,
		d('c', Symbol.prototype[Symbol.toPrimitive]));
	defineProperty(HiddenSymbol.prototype, Symbol.toStringTag,
		d('c', Symbol.prototype[Symbol.toStringTag]));


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isSymbol = __webpack_require__(129);
	
	module.exports = function (value) {
		if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
		return value;
	};


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	// Thanks @mathiasbynens
	// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols
	
	'use strict';
	
	var setPrototypeOf = __webpack_require__(34)
	  , d              = __webpack_require__(11)
	  , Iterator       = __webpack_require__(40)
	
	  , defineProperty = Object.defineProperty
	  , StringIterator;
	
	StringIterator = module.exports = function (str) {
		if (!(this instanceof StringIterator)) return new StringIterator(str);
		str = String(str);
		Iterator.call(this, str);
		defineProperty(this, '__length__', d('', str.length));
	
	};
	if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);
	
	StringIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(StringIterator),
		_next: d(function () {
			if (!this.__list__) return;
			if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
			this._unBind();
		}),
		_resolve: d(function (i) {
			var char = this.__list__[i], code;
			if (this.__nextIndex__ === this.__length__) return char;
			code = char.charCodeAt(0);
			if ((code >= 0xD800) && (code <= 0xDBFF)) return char + this.__list__[this.__nextIndex__++];
			return char;
		}),
		toString: d(function () { return '[object String Iterator]'; })
	});


/***/ },
/* 133 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function () {
		var symbol;
		if (typeof Symbol !== 'function') return false;
		symbol = Symbol('test symbol');
		try { String(symbol); } catch (e) { return false; }
		if (typeof Symbol.iterator === 'symbol') return true;
	
		// Return 'true' for polyfills
		if (typeof Symbol.isConcatSpreadable !== 'object') return false;
		if (typeof Symbol.isRegExp !== 'object') return false;
		if (typeof Symbol.iterator !== 'object') return false;
		if (typeof Symbol.toPrimitive !== 'object') return false;
		if (typeof Symbol.toStringTag !== 'object') return false;
		if (typeof Symbol.unscopables !== 'object') return false;
	
		return true;
	};


/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var d = __webpack_require__(11)
	
	  , create = Object.create, defineProperties = Object.defineProperties
	  , generateName, Symbol;
	
	generateName = (function () {
		var created = create(null);
		return function (desc) {
			var postfix = 0;
			while (created[desc + (postfix || '')]) ++postfix;
			desc += (postfix || '');
			created[desc] = true;
			return '@@' + desc;
		};
	}());
	
	module.exports = Symbol = function (description) {
		var symbol;
		if (this instanceof Symbol) {
			throw new TypeError('TypeError: Symbol is not a constructor');
		}
		symbol = create(Symbol.prototype);
		description = (description === undefined ? '' : String(description));
		return defineProperties(symbol, {
			__description__: d('', description),
			__name__: d('', generateName(description))
		});
	};
	
	Object.defineProperties(Symbol, {
		create: d('', Symbol('create')),
		hasInstance: d('', Symbol('hasInstance')),
		isConcatSpreadable: d('', Symbol('isConcatSpreadable')),
		isRegExp: d('', Symbol('isRegExp')),
		iterator: d('', Symbol('iterator')),
		toPrimitive: d('', Symbol('toPrimitive')),
		toStringTag: d('', Symbol('toStringTag')),
		unscopables: d('', Symbol('unscopables'))
	});
	
	defineProperties(Symbol.prototype, {
		properToString: d(function () {
			return 'Symbol (' + this.__description__ + ')';
		}),
		toString: d('', function () { return this.__name__; })
	});
	Object.defineProperty(Symbol.prototype, Symbol.toPrimitive, d('',
		function (hint) {
			throw new TypeError("Conversion of symbol objects is not allowed");
		}));
	Object.defineProperty(Symbol.prototype, Symbol.toStringTag, d('c', 'Symbol'));


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var d        = __webpack_require__(11)
	  , callable = __webpack_require__(14)
	
	  , apply = Function.prototype.apply, call = Function.prototype.call
	  , create = Object.create, defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , descriptor = { configurable: true, enumerable: false, writable: true }
	
	  , on, once, off, emit, methods, descriptors, base;
	
	on = function (type, listener) {
		var data;
	
		callable(listener);
	
		if (!hasOwnProperty.call(this, '__ee__')) {
			data = descriptor.value = create(null);
			defineProperty(this, '__ee__', descriptor);
			descriptor.value = null;
		} else {
			data = this.__ee__;
		}
		if (!data[type]) data[type] = listener;
		else if (typeof data[type] === 'object') data[type].push(listener);
		else data[type] = [data[type], listener];
	
		return this;
	};
	
	once = function (type, listener) {
		var once, self;
	
		callable(listener);
		self = this;
		on.call(this, type, once = function () {
			off.call(self, type, once);
			apply.call(listener, this, arguments);
		});
	
		once.__eeOnceListener__ = listener;
		return this;
	};
	
	off = function (type, listener) {
		var data, listeners, candidate, i;
	
		callable(listener);
	
		if (!hasOwnProperty.call(this, '__ee__')) return this;
		data = this.__ee__;
		if (!data[type]) return this;
		listeners = data[type];
	
		if (typeof listeners === 'object') {
			for (i = 0; (candidate = listeners[i]); ++i) {
				if ((candidate === listener) ||
						(candidate.__eeOnceListener__ === listener)) {
					if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
					else listeners.splice(i, 1);
				}
			}
		} else {
			if ((listeners === listener) ||
					(listeners.__eeOnceListener__ === listener)) {
				delete data[type];
			}
		}
	
		return this;
	};
	
	emit = function (type) {
		var i, l, listener, listeners, args;
	
		if (!hasOwnProperty.call(this, '__ee__')) return;
		listeners = this.__ee__[type];
		if (!listeners) return;
	
		if (typeof listeners === 'object') {
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) args[i - 1] = arguments[i];
	
			listeners = listeners.slice();
			for (i = 0; (listener = listeners[i]); ++i) {
				apply.call(listener, this, args);
			}
		} else {
			switch (arguments.length) {
			case 1:
				call.call(listeners, this);
				break;
			case 2:
				call.call(listeners, this, arguments[1]);
				break;
			case 3:
				call.call(listeners, this, arguments[1], arguments[2]);
				break;
			default:
				l = arguments.length;
				args = new Array(l - 1);
				for (i = 1; i < l; ++i) {
					args[i - 1] = arguments[i];
				}
				apply.call(listeners, this, args);
			}
		}
	};
	
	methods = {
		on: on,
		once: once,
		off: off,
		emit: emit
	};
	
	descriptors = {
		on: d(on),
		once: d(once),
		off: d(off),
		emit: d(emit)
	};
	
	base = defineProperties({}, descriptors);
	
	module.exports = exports = function (o) {
		return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
	};
	exports.methods = methods;


/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var clear          = __webpack_require__(56)
	  , eIndexOf       = __webpack_require__(103)
	  , setPrototypeOf = __webpack_require__(34)
	  , callable       = __webpack_require__(14)
	  , validValue     = __webpack_require__(7)
	  , d              = __webpack_require__(11)
	  , ee             = __webpack_require__(135)
	  , Symbol         = __webpack_require__(62)
	  , iterator       = __webpack_require__(61)
	  , forOf          = __webpack_require__(125)
	  , Iterator       = __webpack_require__(101)
	  , isNative       = __webpack_require__(99)
	
	  , call = Function.prototype.call, defineProperties = Object.defineProperties
	  , MapPoly;
	
	module.exports = MapPoly = function (/*iterable*/) {
		var iterable = arguments[0], keys, values;
		if (!(this instanceof MapPoly)) return new MapPoly(iterable);
		if (this.__mapKeysData__ !== undefined) {
			throw new TypeError(this + " cannot be reinitialized");
		}
		if (iterable != null) iterator(iterable);
		defineProperties(this, {
			__mapKeysData__: d('c', keys = []),
			__mapValuesData__: d('c', values = [])
		});
		if (!iterable) return;
		forOf(iterable, function (value) {
			var key = validValue(value)[0];
			value = value[1];
			if (eIndexOf.call(keys, key) !== -1) return;
			keys.push(key);
			values.push(value);
		}, this);
	};
	
	if (isNative) {
		if (setPrototypeOf) setPrototypeOf(MapPoly, Map);
		MapPoly.prototype = Object.create(Map.prototype, {
			constructor: d(MapPoly)
		});
	}
	
	ee(defineProperties(MapPoly.prototype, {
		clear: d(function () {
			if (!this.__mapKeysData__.length) return;
			clear.call(this.__mapKeysData__);
			clear.call(this.__mapValuesData__);
			this.emit('_clear');
		}),
		delete: d(function (key) {
			var index = eIndexOf.call(this.__mapKeysData__, key);
			if (index === -1) return false;
			this.__mapKeysData__.splice(index, 1);
			this.__mapValuesData__.splice(index, 1);
			this.emit('_delete', index, key);
			return true;
		}),
		entries: d(function () { return new Iterator(this, 'key+value'); }),
		forEach: d(function (cb/*, thisArg*/) {
			var thisArg = arguments[1], iterator, result;
			callable(cb);
			iterator = this.entries();
			result = iterator._next();
			while (result !== undefined) {
				call.call(cb, thisArg, this.__mapValuesData__[result],
					this.__mapKeysData__[result], this);
				result = iterator._next();
			}
		}),
		get: d(function (key) {
			var index = eIndexOf.call(this.__mapKeysData__, key);
			if (index === -1) return;
			return this.__mapValuesData__[index];
		}),
		has: d(function (key) {
			return (eIndexOf.call(this.__mapKeysData__, key) !== -1);
		}),
		keys: d(function () { return new Iterator(this, 'key'); }),
		set: d(function (key, value) {
			var index = eIndexOf.call(this.__mapKeysData__, key), emit;
			if (index === -1) {
				index = this.__mapKeysData__.push(key) - 1;
				emit = true;
			}
			this.__mapValuesData__[index] = value;
			if (emit) this.emit('_add', index, key);
			return this;
		}),
		size: d.gs(function () { return this.__mapKeysData__.length; }),
		values: d(function () { return new Iterator(this, 'value'); }),
		toString: d(function () { return '[object Map]'; })
	}));
	Object.defineProperty(MapPoly.prototype, Symbol.iterator, d(function () {
		return this.entries();
	}));
	Object.defineProperty(MapPoly.prototype, Symbol.toStringTag, d('c', 'Map'));


/***/ },
/* 137 */
/***/ function(module, exports) {

	'use strict';
	
	var proto = Element.prototype;
	var vendor = proto.matches
	  || proto.matchesSelector
	  || proto.webkitMatchesSelector
	  || proto.mozMatchesSelector
	  || proto.msMatchesSelector
	  || proto.oMatchesSelector;
	
	module.exports = match;
	
	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */
	
	function match(el, selector) {
	  if (vendor) return vendor.call(el, selector);
	  var nodes = el.parentNode.querySelectorAll(selector);
	  for (var i = 0; i < nodes.length; i++) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * index.js
	 *
	 * A client-side DOM to vdom parser based on DOMParser API
	 */
	
	'use strict';
	
	var VNode = __webpack_require__(35);
	var VText = __webpack_require__(43);
	var domParser = new DOMParser();
	
	var propertyMap = __webpack_require__(140);
	var namespaceMap = __webpack_require__(139);
	
	var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
	
	module.exports = parser;
	
	/**
	 * DOM/html string to vdom parser
	 *
	 * @param   Mixed   el    DOM element or html string
	 * @param   String  attr  Attribute name that contains vdom key
	 * @return  Object        VNode or VText
	 */
	function parser(el, attr) {
		// empty input fallback to empty text node
		if (!el) {
			return createNode(document.createTextNode(''));
		}
	
		if (typeof el === 'string') {
			var doc = domParser.parseFromString(el, 'text/html');
	
			// most tags default to body
			if (doc.body.firstChild) {
				el = doc.body.firstChild;
	
			// some tags, like script and style, default to head
			} else if (doc.head.firstChild && (doc.head.firstChild.tagName !== 'TITLE' || doc.title)) {
				el = doc.head.firstChild;
	
			// special case for html comment, cdata, doctype
			} else if (doc.firstChild && doc.firstChild.tagName !== 'HTML') {
				el = doc.firstChild;
	
			// other element, such as whitespace, or html/body/head tag, fallback to empty text node
			} else {
				el = document.createTextNode('');
			}
		}
	
		if (typeof el !== 'object' || !el || !el.nodeType) { 
			throw new Error('invalid dom node', el);
		}
	
		return createNode(el, attr);
	}
	
	/**
	 * Create vdom from dom node
	 *
	 * @param   Object  el    DOM element
	 * @param   String  attr  Attribute name that contains vdom key
	 * @return  Object        VNode or VText
	 */
	function createNode(el, attr) {
		// html comment is not currently supported by virtual-dom
		if (el.nodeType === 3) {
			return createVirtualTextNode(el);
	
		// cdata or doctype is not currently supported by virtual-dom
		} else if (el.nodeType === 1 || el.nodeType === 9) {
			return createVirtualDomNode(el, attr);
		}
	
		// default to empty text node
		return new VText('');
	}
	
	/**
	 * Create vtext from dom node
	 *
	 * @param   Object  el  Text node
	 * @return  Object      VText
	 */
	function createVirtualTextNode(el) {
		return new VText(el.nodeValue);
	}
	
	/**
	 * Create vnode from dom node
	 *
	 * @param   Object  el    DOM element
	 * @param   String  attr  Attribute name that contains vdom key
	 * @return  Object        VNode
	 */
	function createVirtualDomNode(el, attr) {
		var ns = el.namespaceURI !== HTML_NAMESPACE ? el.namespaceURI : null;
		var key = attr && el.getAttribute(attr) ? el.getAttribute(attr) : null;
	
		return new VNode(
			el.tagName
			, createProperties(el)
			, createChildren(el, attr)
			, key
			, ns
		);
	}
	
	/**
	 * Recursively create vdom
	 *
	 * @param   Object  el    Parent element
	 * @param   String  attr  Attribute name that contains vdom key
	 * @return  Array         Child vnode or vtext
	 */
	function createChildren(el, attr) {
		var children = [];
		for (var i = 0; i < el.childNodes.length; i++) {
			children.push(createNode(el.childNodes[i], attr));
		};
	
		return children;
	}
	
	/**
	 * Create properties from dom node
	 *
	 * @param   Object  el  DOM element
	 * @return  Object      Node properties and attributes
	 */
	function createProperties(el) {
		var properties = {};
	
		if (!el.hasAttributes()) {
			return properties;
		}
	
		var ns;
		if (el.namespaceURI && el.namespaceURI !== HTML_NAMESPACE) {
			ns = el.namespaceURI;
		}
	
		var attr;
		for (var i = 0; i < el.attributes.length; i++) {
			if (ns) {
				attr = createPropertyNS(el.attributes[i]);
			} else {
				attr = createProperty(el.attributes[i]);
			}
	
			// special case, namespaced attribute, use properties.foobar
			if (attr.ns) {
				properties[attr.name] = {
					namespace: attr.ns
					, value: attr.value
				};
	
			// special case, use properties.attributes.foobar
			} else if (attr.isAttr) {
				// init attributes object only when necessary
				if (!properties.attributes) {
					properties.attributes = {}
				}
				properties.attributes[attr.name] = attr.value;
	
			// default case, use properties.foobar
			} else {
				properties[attr.name] = attr.value;
			}
		};
	
		return properties;
	}
	
	/**
	 * Create property from dom attribute 
	 *
	 * @param   Object  attr  DOM attribute
	 * @return  Object        Normalized attribute
	 */
	function createProperty(attr) {
		var name, value, isAttr;
	
		// using a map to find the correct case of property name
		if (propertyMap[attr.name]) {
			name = propertyMap[attr.name];
		} else {
			name = attr.name;
		}
	
		// special cases for style attribute, we default to properties.style
		if (name === 'style') {
			var style = {};
			attr.value.split(';').forEach(function (s) {
				var pos = s.indexOf(':');
				if (pos < 0) {
					return;
				}
				style[s.substr(0, pos).trim()] = s.substr(pos + 1).trim();
			});
			value = style;
		// special cases for data attribute, we default to properties.attributes.data
		} else if (name.indexOf('data-') === 0) {
			value = attr.value;
			isAttr = true;
		} else {
			value = attr.value;
		}
	
		return {
			name: name
			, value: value
			, isAttr: isAttr || false
		};
	}
	
	/**
	 * Create namespaced property from dom attribute 
	 *
	 * @param   Object  attr  DOM attribute
	 * @return  Object        Normalized attribute
	 */
	function createPropertyNS(attr) {
		var name, value;
	
		return {
			name: attr.name
			, value: attr.value
			, ns: namespaceMap[attr.name] || ''
		};
	}


/***/ },
/* 139 */
/***/ function(module, exports) {

	
	/**
	 * namespace-map.js
	 *
	 * Necessary to map svg attributes back to their namespace
	 */
	
	'use strict';
	
	// extracted from https://github.com/Matt-Esch/virtual-dom/blob/master/virtual-hyperscript/svg-attribute-namespace.js
	var DEFAULT_NAMESPACE = null;
	var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
	var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
	var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';
	
	var namespaces = {
		'about': DEFAULT_NAMESPACE
		, 'accent-height': DEFAULT_NAMESPACE
		, 'accumulate': DEFAULT_NAMESPACE
		, 'additive': DEFAULT_NAMESPACE
		, 'alignment-baseline': DEFAULT_NAMESPACE
		, 'alphabetic': DEFAULT_NAMESPACE
		, 'amplitude': DEFAULT_NAMESPACE
		, 'arabic-form': DEFAULT_NAMESPACE
		, 'ascent': DEFAULT_NAMESPACE
		, 'attributeName': DEFAULT_NAMESPACE
		, 'attributeType': DEFAULT_NAMESPACE
		, 'azimuth': DEFAULT_NAMESPACE
		, 'bandwidth': DEFAULT_NAMESPACE
		, 'baseFrequency': DEFAULT_NAMESPACE
		, 'baseProfile': DEFAULT_NAMESPACE
		, 'baseline-shift': DEFAULT_NAMESPACE
		, 'bbox': DEFAULT_NAMESPACE
		, 'begin': DEFAULT_NAMESPACE
		, 'bias': DEFAULT_NAMESPACE
		, 'by': DEFAULT_NAMESPACE
		, 'calcMode': DEFAULT_NAMESPACE
		, 'cap-height': DEFAULT_NAMESPACE
		, 'class': DEFAULT_NAMESPACE
		, 'clip': DEFAULT_NAMESPACE
		, 'clip-path': DEFAULT_NAMESPACE
		, 'clip-rule': DEFAULT_NAMESPACE
		, 'clipPathUnits': DEFAULT_NAMESPACE
		, 'color': DEFAULT_NAMESPACE
		, 'color-interpolation': DEFAULT_NAMESPACE
		, 'color-interpolation-filters': DEFAULT_NAMESPACE
		, 'color-profile': DEFAULT_NAMESPACE
		, 'color-rendering': DEFAULT_NAMESPACE
		, 'content': DEFAULT_NAMESPACE
		, 'contentScriptType': DEFAULT_NAMESPACE
		, 'contentStyleType': DEFAULT_NAMESPACE
		, 'cursor': DEFAULT_NAMESPACE
		, 'cx': DEFAULT_NAMESPACE
		, 'cy': DEFAULT_NAMESPACE
		, 'd': DEFAULT_NAMESPACE
		, 'datatype': DEFAULT_NAMESPACE
		, 'defaultAction': DEFAULT_NAMESPACE
		, 'descent': DEFAULT_NAMESPACE
		, 'diffuseConstant': DEFAULT_NAMESPACE
		, 'direction': DEFAULT_NAMESPACE
		, 'display': DEFAULT_NAMESPACE
		, 'divisor': DEFAULT_NAMESPACE
		, 'dominant-baseline': DEFAULT_NAMESPACE
		, 'dur': DEFAULT_NAMESPACE
		, 'dx': DEFAULT_NAMESPACE
		, 'dy': DEFAULT_NAMESPACE
		, 'edgeMode': DEFAULT_NAMESPACE
		, 'editable': DEFAULT_NAMESPACE
		, 'elevation': DEFAULT_NAMESPACE
		, 'enable-background': DEFAULT_NAMESPACE
		, 'end': DEFAULT_NAMESPACE
		, 'ev:event': EV_NAMESPACE
		, 'event': DEFAULT_NAMESPACE
		, 'exponent': DEFAULT_NAMESPACE
		, 'externalResourcesRequired': DEFAULT_NAMESPACE
		, 'fill': DEFAULT_NAMESPACE
		, 'fill-opacity': DEFAULT_NAMESPACE
		, 'fill-rule': DEFAULT_NAMESPACE
		, 'filter': DEFAULT_NAMESPACE
		, 'filterRes': DEFAULT_NAMESPACE
		, 'filterUnits': DEFAULT_NAMESPACE
		, 'flood-color': DEFAULT_NAMESPACE
		, 'flood-opacity': DEFAULT_NAMESPACE
		, 'focusHighlight': DEFAULT_NAMESPACE
		, 'focusable': DEFAULT_NAMESPACE
		, 'font-family': DEFAULT_NAMESPACE
		, 'font-size': DEFAULT_NAMESPACE
		, 'font-size-adjust': DEFAULT_NAMESPACE
		, 'font-stretch': DEFAULT_NAMESPACE
		, 'font-style': DEFAULT_NAMESPACE
		, 'font-variant': DEFAULT_NAMESPACE
		, 'font-weight': DEFAULT_NAMESPACE
		, 'format': DEFAULT_NAMESPACE
		, 'from': DEFAULT_NAMESPACE
		, 'fx': DEFAULT_NAMESPACE
		, 'fy': DEFAULT_NAMESPACE
		, 'g1': DEFAULT_NAMESPACE
		, 'g2': DEFAULT_NAMESPACE
		, 'glyph-name': DEFAULT_NAMESPACE
		, 'glyph-orientation-horizontal': DEFAULT_NAMESPACE
		, 'glyph-orientation-vertical': DEFAULT_NAMESPACE
		, 'glyphRef': DEFAULT_NAMESPACE
		, 'gradientTransform': DEFAULT_NAMESPACE
		, 'gradientUnits': DEFAULT_NAMESPACE
		, 'handler': DEFAULT_NAMESPACE
		, 'hanging': DEFAULT_NAMESPACE
		, 'height': DEFAULT_NAMESPACE
		, 'horiz-adv-x': DEFAULT_NAMESPACE
		, 'horiz-origin-x': DEFAULT_NAMESPACE
		, 'horiz-origin-y': DEFAULT_NAMESPACE
		, 'id': DEFAULT_NAMESPACE
		, 'ideographic': DEFAULT_NAMESPACE
		, 'image-rendering': DEFAULT_NAMESPACE
		, 'in': DEFAULT_NAMESPACE
		, 'in2': DEFAULT_NAMESPACE
		, 'initialVisibility': DEFAULT_NAMESPACE
		, 'intercept': DEFAULT_NAMESPACE
		, 'k': DEFAULT_NAMESPACE
		, 'k1': DEFAULT_NAMESPACE
		, 'k2': DEFAULT_NAMESPACE
		, 'k3': DEFAULT_NAMESPACE
		, 'k4': DEFAULT_NAMESPACE
		, 'kernelMatrix': DEFAULT_NAMESPACE
		, 'kernelUnitLength': DEFAULT_NAMESPACE
		, 'kerning': DEFAULT_NAMESPACE
		, 'keyPoints': DEFAULT_NAMESPACE
		, 'keySplines': DEFAULT_NAMESPACE
		, 'keyTimes': DEFAULT_NAMESPACE
		, 'lang': DEFAULT_NAMESPACE
		, 'lengthAdjust': DEFAULT_NAMESPACE
		, 'letter-spacing': DEFAULT_NAMESPACE
		, 'lighting-color': DEFAULT_NAMESPACE
		, 'limitingConeAngle': DEFAULT_NAMESPACE
		, 'local': DEFAULT_NAMESPACE
		, 'marker-end': DEFAULT_NAMESPACE
		, 'marker-mid': DEFAULT_NAMESPACE
		, 'marker-start': DEFAULT_NAMESPACE
		, 'markerHeight': DEFAULT_NAMESPACE
		, 'markerUnits': DEFAULT_NAMESPACE
		, 'markerWidth': DEFAULT_NAMESPACE
		, 'mask': DEFAULT_NAMESPACE
		, 'maskContentUnits': DEFAULT_NAMESPACE
		, 'maskUnits': DEFAULT_NAMESPACE
		, 'mathematical': DEFAULT_NAMESPACE
		, 'max': DEFAULT_NAMESPACE
		, 'media': DEFAULT_NAMESPACE
		, 'mediaCharacterEncoding': DEFAULT_NAMESPACE
		, 'mediaContentEncodings': DEFAULT_NAMESPACE
		, 'mediaSize': DEFAULT_NAMESPACE
		, 'mediaTime': DEFAULT_NAMESPACE
		, 'method': DEFAULT_NAMESPACE
		, 'min': DEFAULT_NAMESPACE
		, 'mode': DEFAULT_NAMESPACE
		, 'name': DEFAULT_NAMESPACE
		, 'nav-down': DEFAULT_NAMESPACE
		, 'nav-down-left': DEFAULT_NAMESPACE
		, 'nav-down-right': DEFAULT_NAMESPACE
		, 'nav-left': DEFAULT_NAMESPACE
		, 'nav-next': DEFAULT_NAMESPACE
		, 'nav-prev': DEFAULT_NAMESPACE
		, 'nav-right': DEFAULT_NAMESPACE
		, 'nav-up': DEFAULT_NAMESPACE
		, 'nav-up-left': DEFAULT_NAMESPACE
		, 'nav-up-right': DEFAULT_NAMESPACE
		, 'numOctaves': DEFAULT_NAMESPACE
		, 'observer': DEFAULT_NAMESPACE
		, 'offset': DEFAULT_NAMESPACE
		, 'opacity': DEFAULT_NAMESPACE
		, 'operator': DEFAULT_NAMESPACE
		, 'order': DEFAULT_NAMESPACE
		, 'orient': DEFAULT_NAMESPACE
		, 'orientation': DEFAULT_NAMESPACE
		, 'origin': DEFAULT_NAMESPACE
		, 'overflow': DEFAULT_NAMESPACE
		, 'overlay': DEFAULT_NAMESPACE
		, 'overline-position': DEFAULT_NAMESPACE
		, 'overline-thickness': DEFAULT_NAMESPACE
		, 'panose-1': DEFAULT_NAMESPACE
		, 'path': DEFAULT_NAMESPACE
		, 'pathLength': DEFAULT_NAMESPACE
		, 'patternContentUnits': DEFAULT_NAMESPACE
		, 'patternTransform': DEFAULT_NAMESPACE
		, 'patternUnits': DEFAULT_NAMESPACE
		, 'phase': DEFAULT_NAMESPACE
		, 'playbackOrder': DEFAULT_NAMESPACE
		, 'pointer-events': DEFAULT_NAMESPACE
		, 'points': DEFAULT_NAMESPACE
		, 'pointsAtX': DEFAULT_NAMESPACE
		, 'pointsAtY': DEFAULT_NAMESPACE
		, 'pointsAtZ': DEFAULT_NAMESPACE
		, 'preserveAlpha': DEFAULT_NAMESPACE
		, 'preserveAspectRatio': DEFAULT_NAMESPACE
		, 'primitiveUnits': DEFAULT_NAMESPACE
		, 'propagate': DEFAULT_NAMESPACE
		, 'property': DEFAULT_NAMESPACE
		, 'r': DEFAULT_NAMESPACE
		, 'radius': DEFAULT_NAMESPACE
		, 'refX': DEFAULT_NAMESPACE
		, 'refY': DEFAULT_NAMESPACE
		, 'rel': DEFAULT_NAMESPACE
		, 'rendering-intent': DEFAULT_NAMESPACE
		, 'repeatCount': DEFAULT_NAMESPACE
		, 'repeatDur': DEFAULT_NAMESPACE
		, 'requiredExtensions': DEFAULT_NAMESPACE
		, 'requiredFeatures': DEFAULT_NAMESPACE
		, 'requiredFonts': DEFAULT_NAMESPACE
		, 'requiredFormats': DEFAULT_NAMESPACE
		, 'resource': DEFAULT_NAMESPACE
		, 'restart': DEFAULT_NAMESPACE
		, 'result': DEFAULT_NAMESPACE
		, 'rev': DEFAULT_NAMESPACE
		, 'role': DEFAULT_NAMESPACE
		, 'rotate': DEFAULT_NAMESPACE
		, 'rx': DEFAULT_NAMESPACE
		, 'ry': DEFAULT_NAMESPACE
		, 'scale': DEFAULT_NAMESPACE
		, 'seed': DEFAULT_NAMESPACE
		, 'shape-rendering': DEFAULT_NAMESPACE
		, 'slope': DEFAULT_NAMESPACE
		, 'snapshotTime': DEFAULT_NAMESPACE
		, 'spacing': DEFAULT_NAMESPACE
		, 'specularConstant': DEFAULT_NAMESPACE
		, 'specularExponent': DEFAULT_NAMESPACE
		, 'spreadMethod': DEFAULT_NAMESPACE
		, 'startOffset': DEFAULT_NAMESPACE
		, 'stdDeviation': DEFAULT_NAMESPACE
		, 'stemh': DEFAULT_NAMESPACE
		, 'stemv': DEFAULT_NAMESPACE
		, 'stitchTiles': DEFAULT_NAMESPACE
		, 'stop-color': DEFAULT_NAMESPACE
		, 'stop-opacity': DEFAULT_NAMESPACE
		, 'strikethrough-position': DEFAULT_NAMESPACE
		, 'strikethrough-thickness': DEFAULT_NAMESPACE
		, 'string': DEFAULT_NAMESPACE
		, 'stroke': DEFAULT_NAMESPACE
		, 'stroke-dasharray': DEFAULT_NAMESPACE
		, 'stroke-dashoffset': DEFAULT_NAMESPACE
		, 'stroke-linecap': DEFAULT_NAMESPACE
		, 'stroke-linejoin': DEFAULT_NAMESPACE
		, 'stroke-miterlimit': DEFAULT_NAMESPACE
		, 'stroke-opacity': DEFAULT_NAMESPACE
		, 'stroke-width': DEFAULT_NAMESPACE
		, 'surfaceScale': DEFAULT_NAMESPACE
		, 'syncBehavior': DEFAULT_NAMESPACE
		, 'syncBehaviorDefault': DEFAULT_NAMESPACE
		, 'syncMaster': DEFAULT_NAMESPACE
		, 'syncTolerance': DEFAULT_NAMESPACE
		, 'syncToleranceDefault': DEFAULT_NAMESPACE
		, 'systemLanguage': DEFAULT_NAMESPACE
		, 'tableValues': DEFAULT_NAMESPACE
		, 'target': DEFAULT_NAMESPACE
		, 'targetX': DEFAULT_NAMESPACE
		, 'targetY': DEFAULT_NAMESPACE
		, 'text-anchor': DEFAULT_NAMESPACE
		, 'text-decoration': DEFAULT_NAMESPACE
		, 'text-rendering': DEFAULT_NAMESPACE
		, 'textLength': DEFAULT_NAMESPACE
		, 'timelineBegin': DEFAULT_NAMESPACE
		, 'title': DEFAULT_NAMESPACE
		, 'to': DEFAULT_NAMESPACE
		, 'transform': DEFAULT_NAMESPACE
		, 'transformBehavior': DEFAULT_NAMESPACE
		, 'type': DEFAULT_NAMESPACE
		, 'typeof': DEFAULT_NAMESPACE
		, 'u1': DEFAULT_NAMESPACE
		, 'u2': DEFAULT_NAMESPACE
		, 'underline-position': DEFAULT_NAMESPACE
		, 'underline-thickness': DEFAULT_NAMESPACE
		, 'unicode': DEFAULT_NAMESPACE
		, 'unicode-bidi': DEFAULT_NAMESPACE
		, 'unicode-range': DEFAULT_NAMESPACE
		, 'units-per-em': DEFAULT_NAMESPACE
		, 'v-alphabetic': DEFAULT_NAMESPACE
		, 'v-hanging': DEFAULT_NAMESPACE
		, 'v-ideographic': DEFAULT_NAMESPACE
		, 'v-mathematical': DEFAULT_NAMESPACE
		, 'values': DEFAULT_NAMESPACE
		, 'version': DEFAULT_NAMESPACE
		, 'vert-adv-y': DEFAULT_NAMESPACE
		, 'vert-origin-x': DEFAULT_NAMESPACE
		, 'vert-origin-y': DEFAULT_NAMESPACE
		, 'viewBox': DEFAULT_NAMESPACE
		, 'viewTarget': DEFAULT_NAMESPACE
		, 'visibility': DEFAULT_NAMESPACE
		, 'width': DEFAULT_NAMESPACE
		, 'widths': DEFAULT_NAMESPACE
		, 'word-spacing': DEFAULT_NAMESPACE
		, 'writing-mode': DEFAULT_NAMESPACE
		, 'x': DEFAULT_NAMESPACE
		, 'x-height': DEFAULT_NAMESPACE
		, 'x1': DEFAULT_NAMESPACE
		, 'x2': DEFAULT_NAMESPACE
		, 'xChannelSelector': DEFAULT_NAMESPACE
		, 'xlink:actuate': XLINK_NAMESPACE
		, 'xlink:arcrole': XLINK_NAMESPACE
		, 'xlink:href': XLINK_NAMESPACE
		, 'xlink:role': XLINK_NAMESPACE
		, 'xlink:show': XLINK_NAMESPACE
		, 'xlink:title': XLINK_NAMESPACE
		, 'xlink:type': XLINK_NAMESPACE
		, 'xml:base': XML_NAMESPACE
		, 'xml:id': XML_NAMESPACE
		, 'xml:lang': XML_NAMESPACE
		, 'xml:space': XML_NAMESPACE
		, 'y': DEFAULT_NAMESPACE
		, 'y1': DEFAULT_NAMESPACE
		, 'y2': DEFAULT_NAMESPACE
		, 'yChannelSelector': DEFAULT_NAMESPACE
		, 'z': DEFAULT_NAMESPACE
		, 'zoomAndPan': DEFAULT_NAMESPACE
	};
	
	module.exports = namespaces;


/***/ },
/* 140 */
/***/ function(module, exports) {

	
	/**
	 * property-map.js
	 *
	 * Necessary to map dom attributes back to vdom properties
	 */
	
	'use strict';
	
	// invert of https://www.npmjs.com/package/html-attributes
	var properties = {
		'abbr': 'abbr'
		, 'accept': 'accept'
		, 'accept-charset': 'acceptCharset'
		, 'accesskey': 'accessKey'
		, 'action': 'action'
		, 'allowfullscreen': 'allowFullScreen'
		, 'allowtransparency': 'allowTransparency'
		, 'alt': 'alt'
		, 'async': 'async'
		, 'autocomplete': 'autoComplete'
		, 'autofocus': 'autoFocus'
		, 'autoplay': 'autoPlay'
		, 'cellpadding': 'cellPadding'
		, 'cellspacing': 'cellSpacing'
		, 'challenge': 'challenge'
		, 'charset': 'charset'
		, 'checked': 'checked'
		, 'cite': 'cite'
		, 'class': 'className'
		, 'cols': 'cols'
		, 'colspan': 'colSpan'
		, 'command': 'command'
		, 'content': 'content'
		, 'contenteditable': 'contentEditable'
		, 'contextmenu': 'contextMenu'
		, 'controls': 'controls'
		, 'coords': 'coords'
		, 'crossorigin': 'crossOrigin'
		, 'data': 'data'
		, 'datetime': 'dateTime'
		, 'default': 'default'
		, 'defer': 'defer'
		, 'dir': 'dir'
		, 'disabled': 'disabled'
		, 'download': 'download'
		, 'draggable': 'draggable'
		, 'dropzone': 'dropzone'
		, 'enctype': 'encType'
		, 'for': 'htmlFor'
		, 'form': 'form'
		, 'formaction': 'formAction'
		, 'formenctype': 'formEncType'
		, 'formmethod': 'formMethod'
		, 'formnovalidate': 'formNoValidate'
		, 'formtarget': 'formTarget'
		, 'frameBorder': 'frameBorder'
		, 'headers': 'headers'
		, 'height': 'height'
		, 'hidden': 'hidden'
		, 'high': 'high'
		, 'href': 'href'
		, 'hreflang': 'hrefLang'
		, 'http-equiv': 'httpEquiv'
		, 'icon': 'icon'
		, 'id': 'id'
		, 'inputmode': 'inputMode'
		, 'ismap': 'isMap'
		, 'itemid': 'itemId'
		, 'itemprop': 'itemProp'
		, 'itemref': 'itemRef'
		, 'itemscope': 'itemScope'
		, 'itemtype': 'itemType'
		, 'kind': 'kind'
		, 'label': 'label'
		, 'lang': 'lang'
		, 'list': 'list'
		, 'loop': 'loop'
		, 'manifest': 'manifest'
		, 'max': 'max'
		, 'maxlength': 'maxLength'
		, 'media': 'media'
		, 'mediagroup': 'mediaGroup'
		, 'method': 'method'
		, 'min': 'min'
		, 'minlength': 'minLength'
		, 'multiple': 'multiple'
		, 'muted': 'muted'
		, 'name': 'name'
		, 'novalidate': 'noValidate'
		, 'open': 'open'
		, 'optimum': 'optimum'
		, 'pattern': 'pattern'
		, 'ping': 'ping'
		, 'placeholder': 'placeholder'
		, 'poster': 'poster'
		, 'preload': 'preload'
		, 'radiogroup': 'radioGroup'
		, 'readonly': 'readOnly'
		, 'rel': 'rel'
		, 'required': 'required'
		, 'role': 'role'
		, 'rows': 'rows'
		, 'rowspan': 'rowSpan'
		, 'sandbox': 'sandbox'
		, 'scope': 'scope'
		, 'scoped': 'scoped'
		, 'scrolling': 'scrolling'
		, 'seamless': 'seamless'
		, 'selected': 'selected'
		, 'shape': 'shape'
		, 'size': 'size'
		, 'sizes': 'sizes'
		, 'sortable': 'sortable'
		, 'span': 'span'
		, 'spellcheck': 'spellCheck'
		, 'src': 'src'
		, 'srcdoc': 'srcDoc'
		, 'srcset': 'srcSet'
		, 'start': 'start'
		, 'step': 'step'
		, 'style': 'style'
		, 'tabindex': 'tabIndex'
		, 'target': 'target'
		, 'title': 'title'
		, 'translate': 'translate'
		, 'type': 'type'
		, 'typemustmatch': 'typeMustMatch'
		, 'usemap': 'useMap'
		, 'value': 'value'
		, 'width': 'width'
		, 'wmode': 'wmode'
		, 'wrap': 'wrap'
	};
	
	module.exports = properties;


/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	var escape = __webpack_require__(63);
	var propConfig = __webpack_require__(150);
	var types = propConfig.attributeTypes;
	var properties = propConfig.properties;
	var attributeNames = propConfig.attributeNames;
	
	var prefixAttribute = memoizeString(function (name) {
	  return escape(name) + '="';
	});
	
	module.exports = createAttribute;
	
	/**
	 * Create attribute string.
	 *
	 * @param {String} name The name of the property or attribute
	 * @param {*} value The value
	 * @param {Boolean} [isAttribute] Denotes whether `name` is an attribute.
	 * @return {?String} Attribute string || null if not a valid property or custom attribute.
	 */
	
	function createAttribute(name, value, isAttribute) {
	  if (properties.hasOwnProperty(name)) {
	    if (shouldSkip(name, value)) return '';
	    name = (attributeNames[name] || name).toLowerCase();
	    var attrType = properties[name];
	    // for BOOLEAN `value` only has to be truthy
	    // for OVERLOADED_BOOLEAN `value` has to be === true
	    if ((attrType === types.BOOLEAN) ||
	        (attrType === types.OVERLOADED_BOOLEAN && value === true)) {
	      return escape(name);
	    }
	    return prefixAttribute(name) + escape(value) + '"';
	  } else if (isAttribute) {
	    if (value == null) return '';
	    return prefixAttribute(name) + escape(value) + '"';
	  }
	  // return null if `name` is neither a valid property nor an attribute
	  return null;
	}
	
	/**
	 * Should skip false boolean attributes.
	 */
	
	function shouldSkip(name, value) {
	  var attrType = properties[name];
	  return value == null ||
	    (attrType === types.BOOLEAN && !value) ||
	    (attrType === types.OVERLOADED_BOOLEAN && value === false);
	}
	
	/**
	 * Memoizes the return value of a function that accepts one string argument.
	 *
	 * @param {function} callback
	 * @return {function}
	 */
	
	function memoizeString(callback) {
	  var cache = {};
	  return function(string) {
	    if (cache.hasOwnProperty(string)) {
	      return cache[string];
	    } else {
	      return cache[string] = callback.call(this, string);
	    }
	  };
	}

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	var escape = __webpack_require__(63);
	var extend = __webpack_require__(149);
	var isVNode = __webpack_require__(15);
	var isVText = __webpack_require__(22);
	var isThunk = __webpack_require__(21);
	var isWidget = __webpack_require__(8);
	var softHook = __webpack_require__(42);
	var attrHook = __webpack_require__(67);
	var paramCase = __webpack_require__(148);
	var createAttribute = __webpack_require__(141);
	var voidElements = __webpack_require__(151);
	
	module.exports = toHTML;
	
	function toHTML(node, parent) {
	  if (!node) return '';
	
	  if (isThunk(node)) {
	    node = node.render();
	  }
	
	  if (isWidget(node) && node.render) {
	    node = node.render();
	  }
	
	  if (isVNode(node)) {
	    return openTag(node) + tagContent(node) + closeTag(node);
	  } else if (isVText(node)) {
	    if (parent && parent.tagName.toLowerCase() === 'script') return String(node.text);
	    return escape(String(node.text));
	  }
	
	  return '';
	}
	
	function openTag(node) {
	  var props = node.properties;
	  var ret = '<' + node.tagName.toLowerCase();
	
	  for (var name in props) {
	    var value = props[name];
	    if (value == null) continue;
	
	    if (name == 'attributes') {
	      value = extend({}, value);
	      for (var attrProp in value) {
	        ret += ' ' + createAttribute(attrProp, value[attrProp], true);
	      }
	      continue;
	    }
	
	    if (name == 'style') {
	      var css = '';
	      value = extend({}, value);
	      for (var styleProp in value) {
	        css += paramCase(styleProp) + ': ' + value[styleProp] + '; ';
	      }
	      value = css.trim();
	    }
	
	    if (value instanceof softHook || value instanceof attrHook) {
	      ret += ' ' + createAttribute(name, value.value, true);
	      continue;
	    }
	
	    var attr = createAttribute(name, value);
	    if (attr) ret += ' ' + attr;
	  }
	
	  return ret + '>';
	}
	
	function tagContent(node) {
	  var innerHTML = node.properties.innerHTML;
	  if (innerHTML != null) return innerHTML;
	  else {
	    var ret = '';
	    if (node.children && node.children.length) {
	      for (var i = 0, l = node.children.length; i<l; i++) {
	        var child = node.children[i];
	        ret += toHTML(child, node);
	      }
	    }
	    return ret;
	  }
	}
	
	function closeTag(node) {
	  var tag = node.tagName.toLowerCase();
	  return voidElements[tag] ? '' : '</' + tag + '>';
	}

/***/ },
/* 143 */
/***/ function(module, exports) {

	/**
	 * Special language-specific overrides.
	 *
	 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
	 *
	 * @type {Object}
	 */
	var LANGUAGES = {
	  tr: {
	    regexp: /\u0130|\u0049|\u0049\u0307/g,
	    map: {
	      '\u0130': '\u0069',
	      '\u0049': '\u0131',
	      '\u0049\u0307': '\u0069'
	    }
	  },
	  az: {
	    regexp: /[\u0130]/g,
	    map: {
	      '\u0130': '\u0069',
	      '\u0049': '\u0131',
	      '\u0049\u0307': '\u0069'
	    }
	  },
	  lt: {
	    regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
	    map: {
	      '\u0049': '\u0069\u0307',
	      '\u004A': '\u006A\u0307',
	      '\u012E': '\u012F\u0307',
	      '\u00CC': '\u0069\u0307\u0300',
	      '\u00CD': '\u0069\u0307\u0301',
	      '\u0128': '\u0069\u0307\u0303'
	    }
	  }
	}
	
	/**
	 * Lowercase a string.
	 *
	 * @param  {String} str
	 * @return {String}
	 */
	module.exports = function (str, locale) {
	  var lang = LANGUAGES[locale]
	
	  str = str == null ? '' : String(str)
	
	  if (lang) {
	    str = str.replace(lang.regexp, function (m) { return lang.map[m] })
	  }
	
	  return str.toLowerCase()
	}


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	var lowerCase = __webpack_require__(143)
	
	var NON_WORD_REGEXP = __webpack_require__(146)
	var CAMEL_CASE_REGEXP = __webpack_require__(145)
	var TRAILING_DIGIT_REGEXP = __webpack_require__(147)
	
	/**
	 * Sentence case a string.
	 *
	 * @param  {String} str
	 * @param  {String} locale
	 * @param  {String} replacement
	 * @return {String}
	 */
	module.exports = function (str, locale, replacement) {
	  if (str == null) {
	    return ''
	  }
	
	  replacement = replacement || ' '
	
	  function replace (match, index, string) {
	    if (index === 0 || index === (string.length - match.length)) {
	      return ''
	    }
	
	    return replacement
	  }
	
	  str = String(str)
	    // Support camel case ("camelCase" -> "camel Case").
	    .replace(CAMEL_CASE_REGEXP, '$1 $2')
	    // Support digit groups ("test2012" -> "test 2012").
	    .replace(TRAILING_DIGIT_REGEXP, '$1 $2')
	    // Remove all non-word characters and replace with a single space.
	    .replace(NON_WORD_REGEXP, replace)
	
	  // Lower case the entire string.
	  return lowerCase(str, locale)
	}


/***/ },
/* 145 */
/***/ function(module, exports) {

	module.exports = /([\u0061-\u007A\u00B5\u00DF-\u00F6\u00F8-\u00FF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])([\u0041-\u005A\u00C0-\u00D6\u00D8-\u00DE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g


/***/ },
/* 146 */
/***/ function(module, exports) {

	module.exports = /[^\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g


/***/ },
/* 147 */
/***/ function(module, exports) {

	module.exports = /([\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([^\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g


/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	var sentenceCase = __webpack_require__(144);
	
	/**
	 * Param case a string.
	 *
	 * @param  {String} string
	 * @param  {String} [locale]
	 * @return {String}
	 */
	module.exports = function (string, locale) {
	  return sentenceCase(string, locale, '-');
	};


/***/ },
/* 149 */
/***/ function(module, exports) {

	module.exports = extend
	
	function extend() {
	    var target = {}
	
	    for (var i = 0; i < arguments.length; i++) {
	        var source = arguments[i]
	
	        for (var key in source) {
	            if (source.hasOwnProperty(key)) {
	                target[key] = source[key]
	            }
	        }
	    }
	
	    return target
	}


/***/ },
/* 150 */
/***/ function(module, exports) {

	/**
	 * Attribute types.
	 */
	
	var types = {
	  BOOLEAN: 1,
	  OVERLOADED_BOOLEAN: 2
	};
	
	/**
	 * Properties.
	 *
	 * Taken from https://github.com/facebook/react/blob/847357e42e5267b04dd6e297219eaa125ab2f9f4/src/browser/ui/dom/HTMLDOMPropertyConfig.js
	 *
	 */
	
	var properties = {
	  /**
	   * Standard Properties
	   */
	  accept: true,
	  acceptCharset: true,
	  accessKey: true,
	  action: true,
	  allowFullScreen: types.BOOLEAN,
	  allowTransparency: true,
	  alt: true,
	  async: types.BOOLEAN,
	  autocomplete: true,
	  autofocus: types.BOOLEAN,
	  autoplay: types.BOOLEAN,
	  cellPadding: true,
	  cellSpacing: true,
	  charset: true,
	  checked: types.BOOLEAN,
	  classID: true,
	  className: true,
	  cols: true,
	  colSpan: true,
	  content: true,
	  contentEditable: true,
	  contextMenu: true,
	  controls: types.BOOLEAN,
	  coords: true,
	  crossOrigin: true,
	  data: true, // For `<object />` acts as `src`.
	  dateTime: true,
	  defer: types.BOOLEAN,
	  dir: true,
	  disabled: types.BOOLEAN,
	  download: types.OVERLOADED_BOOLEAN,
	  draggable: true,
	  enctype: true,
	  form: true,
	  formAction: true,
	  formEncType: true,
	  formMethod: true,
	  formNoValidate: types.BOOLEAN,
	  formTarget: true,
	  frameBorder: true,
	  headers: true,
	  height: true,
	  hidden: types.BOOLEAN,
	  href: true,
	  hreflang: true,
	  htmlFor: true,
	  httpEquiv: true,
	  icon: true,
	  id: true,
	  label: true,
	  lang: true,
	  list: true,
	  loop: types.BOOLEAN,
	  manifest: true,
	  marginHeight: true,
	  marginWidth: true,
	  max: true,
	  maxLength: true,
	  media: true,
	  mediaGroup: true,
	  method: true,
	  min: true,
	  multiple: types.BOOLEAN,
	  muted: types.BOOLEAN,
	  name: true,
	  noValidate: types.BOOLEAN,
	  open: true,
	  pattern: true,
	  placeholder: true,
	  poster: true,
	  preload: true,
	  radiogroup: true,
	  readOnly: types.BOOLEAN,
	  rel: true,
	  required: types.BOOLEAN,
	  role: true,
	  rows: true,
	  rowSpan: true,
	  sandbox: true,
	  scope: true,
	  scrolling: true,
	  seamless: types.BOOLEAN,
	  selected: types.BOOLEAN,
	  shape: true,
	  size: true,
	  sizes: true,
	  span: true,
	  spellcheck: true,
	  src: true,
	  srcdoc: true,
	  srcset: true,
	  start: true,
	  step: true,
	  style: true,
	  tabIndex: true,
	  target: true,
	  title: true,
	  type: true,
	  useMap: true,
	  value: true,
	  width: true,
	  wmode: true,
	
	  /**
	   * Non-standard Properties
	   */
	  // autoCapitalize and autoCorrect are supported in Mobile Safari for
	  // keyboard hints.
	  autocapitalize: true,
	  autocorrect: true,
	  // itemProp, itemScope, itemType are for Microdata support. See
	  // http://schema.org/docs/gs.html
	  itemProp: true,
	  itemScope: types.BOOLEAN,
	  itemType: true,
	  // property is supported for OpenGraph in meta tags.
	  property: true
	};
	
	/**
	 * Properties to attributes mapping.
	 *
	 * The ones not here are simply converted to lower case.
	 */
	
	var attributeNames = {
	  acceptCharset: 'accept-charset',
	  className: 'class',
	  htmlFor: 'for',
	  httpEquiv: 'http-equiv'
	};
	
	/**
	 * Exports.
	 */
	
	module.exports = {
	  attributeTypes: types,
	  properties: properties,
	  attributeNames: attributeNames
	};

/***/ },
/* 151 */
/***/ function(module, exports) {

	
	/**
	 * Void elements.
	 *
	 * https://github.com/facebook/react/blob/v0.12.0/src/browser/ui/ReactDOMComponent.js#L99
	 */
	
	module.exports = {
	  'area': true,
	  'base': true,
	  'br': true,
	  'col': true,
	  'embed': true,
	  'hr': true,
	  'img': true,
	  'input': true,
	  'keygen': true,
	  'link': true,
	  'meta': true,
	  'param': true,
	  'source': true,
	  'track': true,
	  'wbr': true
	};

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	var diff = __webpack_require__(167)
	
	module.exports = diff


/***/ },
/* 153 */
/***/ function(module, exports) {

	/*!
	 * Cross-Browser Split 1.1.1
	 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
	 * Available under the MIT License
	 * ECMAScript compliant, uniform cross-browser split method
	 */
	
	/**
	 * Splits a string into an array of strings using a regex or string separator. Matches of the
	 * separator are not included in the result array. However, if `separator` is a regex that contains
	 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
	 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
	 * cross-browser.
	 * @param {String} str String to split.
	 * @param {RegExp|String} separator Regex or string to use for separating the string.
	 * @param {Number} [limit] Maximum number of items to include in the result array.
	 * @returns {Array} Array of substrings.
	 * @example
	 *
	 * // Basic use
	 * split('a b c d', ' ');
	 * // -> ['a', 'b', 'c', 'd']
	 *
	 * // With limit
	 * split('a b c d', ' ', 2);
	 * // -> ['a', 'b']
	 *
	 * // Backreferences in result array
	 * split('..word1 word2..', /([a-z]+)(\d+)/i);
	 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
	 */
	module.exports = (function split(undef) {
	
	  var nativeSplit = String.prototype.split,
	    compliantExecNpcg = /()??/.exec("")[1] === undef,
	    // NPCG: nonparticipating capturing group
	    self;
	
	  self = function(str, separator, limit) {
	    // If `separator` is not a regex, use `nativeSplit`
	    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
	      return nativeSplit.call(str, separator, limit);
	    }
	    var output = [],
	      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
	      (separator.sticky ? "y" : ""),
	      // Firefox 3+
	      lastLastIndex = 0,
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      separator = new RegExp(separator.source, flags + "g"),
	      separator2, match, lastIndex, lastLength;
	    str += ""; // Type-convert
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
	    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
	    limit >>> 0; // ToUint32(limit)
	    while (match = separator.exec(str)) {
	      // `separator.lastIndex` is not reliable cross-browser
	      lastIndex = match.index + match[0].length;
	      if (lastIndex > lastLastIndex) {
	        output.push(str.slice(lastLastIndex, match.index));
	        // Fix browsers whose `exec` methods don't consistently return `undefined` for
	        // nonparticipating capturing groups
	        if (!compliantExecNpcg && match.length > 1) {
	          match[0].replace(separator2, function() {
	            for (var i = 1; i < arguments.length - 2; i++) {
	              if (arguments[i] === undef) {
	                match[i] = undef;
	              }
	            }
	          });
	        }
	        if (match.length > 1 && match.index < str.length) {
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
	    if (lastLastIndex === str.length) {
	      if (lastLength || !separator.test("")) {
	        output.push("");
	      }
	    } else {
	      output.push(str.slice(lastLastIndex));
	    }
	    return output.length > limit ? output.slice(0, limit) : output;
	  };
	
	  return self;
	})();


/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var OneVersionConstraint = __webpack_require__(156);
	
	var MY_VERSION = '7';
	OneVersionConstraint('ev-store', MY_VERSION);
	
	var hashKey = '__EV_STORE_KEY@' + MY_VERSION;
	
	module.exports = EvStore;
	
	function EvStore(elem) {
	    var hash = elem[hashKey];
	
	    if (!hash) {
	        hash = elem[hashKey] = {};
	    }
	
	    return hash;
	}


/***/ },
/* 155 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	/*global window, global*/
	
	var root = typeof window !== 'undefined' ?
	    window : typeof global !== 'undefined' ?
	    global : {};
	
	module.exports = Individual;
	
	function Individual(key, value) {
	    if (key in root) {
	        return root[key];
	    }
	
	    root[key] = value;
	
	    return value;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Individual = __webpack_require__(155);
	
	module.exports = OneVersion;
	
	function OneVersion(moduleName, version, defaultValue) {
	    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
	    var enforceKey = key + '_ENFORCE_SINGLETON';
	
	    var versionValue = Individual(enforceKey, version);
	
	    if (versionValue !== version) {
	        throw new Error('Can only have one copy of ' +
	            moduleName + '.\n' +
	            'You already have version ' + versionValue +
	            ' installed.\n' +
	            'This means you cannot install version ' + version);
	    }
	
	    return Individual(key, defaultValue);
	}


/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	var patch = __webpack_require__(161)
	
	module.exports = patch


/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	var document = __webpack_require__(64)
	
	var applyProperties = __webpack_require__(66)
	
	var isVNode = __webpack_require__(15)
	var isVText = __webpack_require__(22)
	var isWidget = __webpack_require__(8)
	var handleThunk = __webpack_require__(70)
	
	module.exports = createElement
	
	function createElement(vnode, opts) {
	    var doc = opts ? opts.document || document : document
	    var warn = opts ? opts.warn : null
	
	    vnode = handleThunk(vnode).a
	
	    if (isWidget(vnode)) {
	        return vnode.init()
	    } else if (isVText(vnode)) {
	        return doc.createTextNode(vnode.text)
	    } else if (!isVNode(vnode)) {
	        if (warn) {
	            warn("Item is not a valid virtual dom node", vnode)
	        }
	        return null
	    }
	
	    var node = (vnode.namespace === null) ?
	        doc.createElement(vnode.tagName) :
	        doc.createElementNS(vnode.namespace, vnode.tagName)
	
	    var props = vnode.properties
	    applyProperties(node, props)
	
	    var children = vnode.children
	
	    for (var i = 0; i < children.length; i++) {
	        var childNode = createElement(children[i], opts)
	        if (childNode) {
	            node.appendChild(childNode)
	        }
	    }
	
	    return node
	}


/***/ },
/* 159 */
/***/ function(module, exports) {

	// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
	// We don't want to read all of the DOM nodes in the tree so we use
	// the in-order tree indexing to eliminate recursion down certain branches.
	// We only recurse into a DOM node if we know that it contains a child of
	// interest.
	
	var noChild = {}
	
	module.exports = domIndex
	
	function domIndex(rootNode, tree, indices, nodes) {
	    if (!indices || indices.length === 0) {
	        return {}
	    } else {
	        indices.sort(ascending)
	        return recurse(rootNode, tree, indices, nodes, 0)
	    }
	}
	
	function recurse(rootNode, tree, indices, nodes, rootIndex) {
	    nodes = nodes || {}
	
	
	    if (rootNode) {
	        if (indexInRange(indices, rootIndex, rootIndex)) {
	            nodes[rootIndex] = rootNode
	        }
	
	        var vChildren = tree.children
	
	        if (vChildren) {
	
	            var childNodes = rootNode.childNodes
	
	            for (var i = 0; i < tree.children.length; i++) {
	                rootIndex += 1
	
	                var vChild = vChildren[i] || noChild
	                var nextIndex = rootIndex + (vChild.count || 0)
	
	                // skip recursion down the tree if there are no nodes down here
	                if (indexInRange(indices, rootIndex, nextIndex)) {
	                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
	                }
	
	                rootIndex = nextIndex
	            }
	        }
	    }
	
	    return nodes
	}
	
	// Binary search for an index in the interval [left, right]
	function indexInRange(indices, left, right) {
	    if (indices.length === 0) {
	        return false
	    }
	
	    var minIndex = 0
	    var maxIndex = indices.length - 1
	    var currentIndex
	    var currentItem
	
	    while (minIndex <= maxIndex) {
	        currentIndex = ((maxIndex + minIndex) / 2) >> 0
	        currentItem = indices[currentIndex]
	
	        if (minIndex === maxIndex) {
	            return currentItem >= left && currentItem <= right
	        } else if (currentItem < left) {
	            minIndex = currentIndex + 1
	        } else  if (currentItem > right) {
	            maxIndex = currentIndex - 1
	        } else {
	            return true
	        }
	    }
	
	    return false;
	}
	
	function ascending(a, b) {
	    return a > b ? 1 : -1
	}


/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	var applyProperties = __webpack_require__(66)
	
	var isWidget = __webpack_require__(8)
	var VPatch = __webpack_require__(71)
	
	var updateWidget = __webpack_require__(162)
	
	module.exports = applyPatch
	
	function applyPatch(vpatch, domNode, renderOptions) {
	    var type = vpatch.type
	    var vNode = vpatch.vNode
	    var patch = vpatch.patch
	
	    switch (type) {
	        case VPatch.REMOVE:
	            return removeNode(domNode, vNode)
	        case VPatch.INSERT:
	            return insertNode(domNode, patch, renderOptions)
	        case VPatch.VTEXT:
	            return stringPatch(domNode, vNode, patch, renderOptions)
	        case VPatch.WIDGET:
	            return widgetPatch(domNode, vNode, patch, renderOptions)
	        case VPatch.VNODE:
	            return vNodePatch(domNode, vNode, patch, renderOptions)
	        case VPatch.ORDER:
	            reorderChildren(domNode, patch)
	            return domNode
	        case VPatch.PROPS:
	            applyProperties(domNode, patch, vNode.properties)
	            return domNode
	        case VPatch.THUNK:
	            return replaceRoot(domNode,
	                renderOptions.patch(domNode, patch, renderOptions))
	        default:
	            return domNode
	    }
	}
	
	function removeNode(domNode, vNode) {
	    var parentNode = domNode.parentNode
	
	    if (parentNode) {
	        parentNode.removeChild(domNode)
	    }
	
	    destroyWidget(domNode, vNode);
	
	    return null
	}
	
	function insertNode(parentNode, vNode, renderOptions) {
	    var newNode = renderOptions.render(vNode, renderOptions)
	
	    if (parentNode) {
	        parentNode.appendChild(newNode)
	    }
	
	    return parentNode
	}
	
	function stringPatch(domNode, leftVNode, vText, renderOptions) {
	    var newNode
	
	    if (domNode.nodeType === 3) {
	        domNode.replaceData(0, domNode.length, vText.text)
	        newNode = domNode
	    } else {
	        var parentNode = domNode.parentNode
	        newNode = renderOptions.render(vText, renderOptions)
	
	        if (parentNode && newNode !== domNode) {
	            parentNode.replaceChild(newNode, domNode)
	        }
	    }
	
	    return newNode
	}
	
	function widgetPatch(domNode, leftVNode, widget, renderOptions) {
	    var updating = updateWidget(leftVNode, widget)
	    var newNode
	
	    if (updating) {
	        newNode = widget.update(leftVNode, domNode) || domNode
	    } else {
	        newNode = renderOptions.render(widget, renderOptions)
	    }
	
	    var parentNode = domNode.parentNode
	
	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode)
	    }
	
	    if (!updating) {
	        destroyWidget(domNode, leftVNode)
	    }
	
	    return newNode
	}
	
	function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
	    var parentNode = domNode.parentNode
	    var newNode = renderOptions.render(vNode, renderOptions)
	
	    if (parentNode && newNode !== domNode) {
	        parentNode.replaceChild(newNode, domNode)
	    }
	
	    return newNode
	}
	
	function destroyWidget(domNode, w) {
	    if (typeof w.destroy === "function" && isWidget(w)) {
	        w.destroy(domNode)
	    }
	}
	
	function reorderChildren(domNode, moves) {
	    var childNodes = domNode.childNodes
	    var keyMap = {}
	    var node
	    var remove
	    var insert
	
	    for (var i = 0; i < moves.removes.length; i++) {
	        remove = moves.removes[i]
	        node = childNodes[remove.from]
	        if (remove.key) {
	            keyMap[remove.key] = node
	        }
	        domNode.removeChild(node)
	    }
	
	    var length = childNodes.length
	    for (var j = 0; j < moves.inserts.length; j++) {
	        insert = moves.inserts[j]
	        node = keyMap[insert.key]
	        // this is the weirdest bug i've ever seen in webkit
	        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
	    }
	}
	
	function replaceRoot(oldRoot, newRoot) {
	    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
	        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
	    }
	
	    return newRoot;
	}


/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	var document = __webpack_require__(64)
	var isArray = __webpack_require__(32)
	
	var render = __webpack_require__(158)
	var domIndex = __webpack_require__(159)
	var patchOp = __webpack_require__(160)
	module.exports = patch
	
	function patch(rootNode, patches, renderOptions) {
	    renderOptions = renderOptions || {}
	    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
	        ? renderOptions.patch
	        : patchRecursive
	    renderOptions.render = renderOptions.render || render
	
	    return renderOptions.patch(rootNode, patches, renderOptions)
	}
	
	function patchRecursive(rootNode, patches, renderOptions) {
	    var indices = patchIndices(patches)
	
	    if (indices.length === 0) {
	        return rootNode
	    }
	
	    var index = domIndex(rootNode, patches.a, indices)
	    var ownerDocument = rootNode.ownerDocument
	
	    if (!renderOptions.document && ownerDocument !== document) {
	        renderOptions.document = ownerDocument
	    }
	
	    for (var i = 0; i < indices.length; i++) {
	        var nodeIndex = indices[i]
	        rootNode = applyPatch(rootNode,
	            index[nodeIndex],
	            patches[nodeIndex],
	            renderOptions)
	    }
	
	    return rootNode
	}
	
	function applyPatch(rootNode, domNode, patchList, renderOptions) {
	    if (!domNode) {
	        return rootNode
	    }
	
	    var newNode
	
	    if (isArray(patchList)) {
	        for (var i = 0; i < patchList.length; i++) {
	            newNode = patchOp(patchList[i], domNode, renderOptions)
	
	            if (domNode === rootNode) {
	                rootNode = newNode
	            }
	        }
	    } else {
	        newNode = patchOp(patchList, domNode, renderOptions)
	
	        if (domNode === rootNode) {
	            rootNode = newNode
	        }
	    }
	
	    return rootNode
	}
	
	function patchIndices(patches) {
	    var indices = []
	
	    for (var key in patches) {
	        if (key !== "a") {
	            indices.push(Number(key))
	        }
	    }
	
	    return indices
	}


/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	var isWidget = __webpack_require__(8)
	
	module.exports = updateWidget
	
	function updateWidget(a, b) {
	    if (isWidget(a) && isWidget(b)) {
	        if ("name" in a && "name" in b) {
	            return a.id === b.id
	        } else {
	            return a.init === b.init
	        }
	    }
	
	    return false
	}


/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isArray = __webpack_require__(32);
	
	var VNode = __webpack_require__(35);
	var VText = __webpack_require__(43);
	var isVNode = __webpack_require__(15);
	var isVText = __webpack_require__(22);
	var isWidget = __webpack_require__(8);
	var isHook = __webpack_require__(30);
	var isVThunk = __webpack_require__(21);
	
	var parseTag = __webpack_require__(69);
	var softSetHook = __webpack_require__(42);
	var evHook = __webpack_require__(68);
	
	module.exports = h;
	
	function h(tagName, properties, children) {
	    var childNodes = [];
	    var tag, props, key, namespace;
	
	    if (!children && isChildren(properties)) {
	        children = properties;
	        props = {};
	    }
	
	    props = props || properties || {};
	    tag = parseTag(tagName, props);
	
	    // support keys
	    if (props.hasOwnProperty('key')) {
	        key = props.key;
	        props.key = undefined;
	    }
	
	    // support namespace
	    if (props.hasOwnProperty('namespace')) {
	        namespace = props.namespace;
	        props.namespace = undefined;
	    }
	
	    // fix cursor bug
	    if (tag === 'INPUT' &&
	        !namespace &&
	        props.hasOwnProperty('value') &&
	        props.value !== undefined &&
	        !isHook(props.value)
	    ) {
	        props.value = softSetHook(props.value);
	    }
	
	    transformProperties(props);
	
	    if (children !== undefined && children !== null) {
	        addChild(children, childNodes, tag, props);
	    }
	
	
	    return new VNode(tag, props, childNodes, key, namespace);
	}
	
	function addChild(c, childNodes, tag, props) {
	    if (typeof c === 'string') {
	        childNodes.push(new VText(c));
	    } else if (typeof c === 'number') {
	        childNodes.push(new VText(String(c)));
	    } else if (isChild(c)) {
	        childNodes.push(c);
	    } else if (isArray(c)) {
	        for (var i = 0; i < c.length; i++) {
	            addChild(c[i], childNodes, tag, props);
	        }
	    } else if (c === null || c === undefined) {
	        return;
	    } else {
	        throw UnexpectedVirtualElement({
	            foreignObject: c,
	            parentVnode: {
	                tagName: tag,
	                properties: props
	            }
	        });
	    }
	}
	
	function transformProperties(props) {
	    for (var propName in props) {
	        if (props.hasOwnProperty(propName)) {
	            var value = props[propName];
	
	            if (isHook(value)) {
	                continue;
	            }
	
	            if (propName.substr(0, 3) === 'ev-') {
	                // add ev-foo support
	                props[propName] = evHook(value);
	            }
	        }
	    }
	}
	
	function isChild(x) {
	    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
	}
	
	function isChildren(x) {
	    return typeof x === 'string' || isArray(x) || isChild(x);
	}
	
	function UnexpectedVirtualElement(data) {
	    var err = new Error();
	
	    err.type = 'virtual-hyperscript.unexpected.virtual-element';
	    err.message = 'Unexpected virtual child passed to h().\n' +
	        'Expected a VNode / Vthunk / VWidget / string but:\n' +
	        'got:\n' +
	        errorString(data.foreignObject) +
	        '.\n' +
	        'The parent vnode is:\n' +
	        errorString(data.parentVnode)
	        '\n' +
	        'Suggested fix: change your `h(..., [ ... ])` callsite.';
	    err.foreignObject = data.foreignObject;
	    err.parentVnode = data.parentVnode;
	
	    return err;
	}
	
	function errorString(obj) {
	    try {
	        return JSON.stringify(obj, null, '    ');
	    } catch (e) {
	        return String(obj);
	    }
	}


/***/ },
/* 164 */
/***/ function(module, exports) {

	'use strict';
	
	var DEFAULT_NAMESPACE = null;
	var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
	var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
	var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';
	
	// http://www.w3.org/TR/SVGTiny12/attributeTable.html
	// http://www.w3.org/TR/SVG/attindex.html
	var SVG_PROPERTIES = {
	    'about': DEFAULT_NAMESPACE,
	    'accent-height': DEFAULT_NAMESPACE,
	    'accumulate': DEFAULT_NAMESPACE,
	    'additive': DEFAULT_NAMESPACE,
	    'alignment-baseline': DEFAULT_NAMESPACE,
	    'alphabetic': DEFAULT_NAMESPACE,
	    'amplitude': DEFAULT_NAMESPACE,
	    'arabic-form': DEFAULT_NAMESPACE,
	    'ascent': DEFAULT_NAMESPACE,
	    'attributeName': DEFAULT_NAMESPACE,
	    'attributeType': DEFAULT_NAMESPACE,
	    'azimuth': DEFAULT_NAMESPACE,
	    'bandwidth': DEFAULT_NAMESPACE,
	    'baseFrequency': DEFAULT_NAMESPACE,
	    'baseProfile': DEFAULT_NAMESPACE,
	    'baseline-shift': DEFAULT_NAMESPACE,
	    'bbox': DEFAULT_NAMESPACE,
	    'begin': DEFAULT_NAMESPACE,
	    'bias': DEFAULT_NAMESPACE,
	    'by': DEFAULT_NAMESPACE,
	    'calcMode': DEFAULT_NAMESPACE,
	    'cap-height': DEFAULT_NAMESPACE,
	    'class': DEFAULT_NAMESPACE,
	    'clip': DEFAULT_NAMESPACE,
	    'clip-path': DEFAULT_NAMESPACE,
	    'clip-rule': DEFAULT_NAMESPACE,
	    'clipPathUnits': DEFAULT_NAMESPACE,
	    'color': DEFAULT_NAMESPACE,
	    'color-interpolation': DEFAULT_NAMESPACE,
	    'color-interpolation-filters': DEFAULT_NAMESPACE,
	    'color-profile': DEFAULT_NAMESPACE,
	    'color-rendering': DEFAULT_NAMESPACE,
	    'content': DEFAULT_NAMESPACE,
	    'contentScriptType': DEFAULT_NAMESPACE,
	    'contentStyleType': DEFAULT_NAMESPACE,
	    'cursor': DEFAULT_NAMESPACE,
	    'cx': DEFAULT_NAMESPACE,
	    'cy': DEFAULT_NAMESPACE,
	    'd': DEFAULT_NAMESPACE,
	    'datatype': DEFAULT_NAMESPACE,
	    'defaultAction': DEFAULT_NAMESPACE,
	    'descent': DEFAULT_NAMESPACE,
	    'diffuseConstant': DEFAULT_NAMESPACE,
	    'direction': DEFAULT_NAMESPACE,
	    'display': DEFAULT_NAMESPACE,
	    'divisor': DEFAULT_NAMESPACE,
	    'dominant-baseline': DEFAULT_NAMESPACE,
	    'dur': DEFAULT_NAMESPACE,
	    'dx': DEFAULT_NAMESPACE,
	    'dy': DEFAULT_NAMESPACE,
	    'edgeMode': DEFAULT_NAMESPACE,
	    'editable': DEFAULT_NAMESPACE,
	    'elevation': DEFAULT_NAMESPACE,
	    'enable-background': DEFAULT_NAMESPACE,
	    'end': DEFAULT_NAMESPACE,
	    'ev:event': EV_NAMESPACE,
	    'event': DEFAULT_NAMESPACE,
	    'exponent': DEFAULT_NAMESPACE,
	    'externalResourcesRequired': DEFAULT_NAMESPACE,
	    'fill': DEFAULT_NAMESPACE,
	    'fill-opacity': DEFAULT_NAMESPACE,
	    'fill-rule': DEFAULT_NAMESPACE,
	    'filter': DEFAULT_NAMESPACE,
	    'filterRes': DEFAULT_NAMESPACE,
	    'filterUnits': DEFAULT_NAMESPACE,
	    'flood-color': DEFAULT_NAMESPACE,
	    'flood-opacity': DEFAULT_NAMESPACE,
	    'focusHighlight': DEFAULT_NAMESPACE,
	    'focusable': DEFAULT_NAMESPACE,
	    'font-family': DEFAULT_NAMESPACE,
	    'font-size': DEFAULT_NAMESPACE,
	    'font-size-adjust': DEFAULT_NAMESPACE,
	    'font-stretch': DEFAULT_NAMESPACE,
	    'font-style': DEFAULT_NAMESPACE,
	    'font-variant': DEFAULT_NAMESPACE,
	    'font-weight': DEFAULT_NAMESPACE,
	    'format': DEFAULT_NAMESPACE,
	    'from': DEFAULT_NAMESPACE,
	    'fx': DEFAULT_NAMESPACE,
	    'fy': DEFAULT_NAMESPACE,
	    'g1': DEFAULT_NAMESPACE,
	    'g2': DEFAULT_NAMESPACE,
	    'glyph-name': DEFAULT_NAMESPACE,
	    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
	    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
	    'glyphRef': DEFAULT_NAMESPACE,
	    'gradientTransform': DEFAULT_NAMESPACE,
	    'gradientUnits': DEFAULT_NAMESPACE,
	    'handler': DEFAULT_NAMESPACE,
	    'hanging': DEFAULT_NAMESPACE,
	    'height': DEFAULT_NAMESPACE,
	    'horiz-adv-x': DEFAULT_NAMESPACE,
	    'horiz-origin-x': DEFAULT_NAMESPACE,
	    'horiz-origin-y': DEFAULT_NAMESPACE,
	    'id': DEFAULT_NAMESPACE,
	    'ideographic': DEFAULT_NAMESPACE,
	    'image-rendering': DEFAULT_NAMESPACE,
	    'in': DEFAULT_NAMESPACE,
	    'in2': DEFAULT_NAMESPACE,
	    'initialVisibility': DEFAULT_NAMESPACE,
	    'intercept': DEFAULT_NAMESPACE,
	    'k': DEFAULT_NAMESPACE,
	    'k1': DEFAULT_NAMESPACE,
	    'k2': DEFAULT_NAMESPACE,
	    'k3': DEFAULT_NAMESPACE,
	    'k4': DEFAULT_NAMESPACE,
	    'kernelMatrix': DEFAULT_NAMESPACE,
	    'kernelUnitLength': DEFAULT_NAMESPACE,
	    'kerning': DEFAULT_NAMESPACE,
	    'keyPoints': DEFAULT_NAMESPACE,
	    'keySplines': DEFAULT_NAMESPACE,
	    'keyTimes': DEFAULT_NAMESPACE,
	    'lang': DEFAULT_NAMESPACE,
	    'lengthAdjust': DEFAULT_NAMESPACE,
	    'letter-spacing': DEFAULT_NAMESPACE,
	    'lighting-color': DEFAULT_NAMESPACE,
	    'limitingConeAngle': DEFAULT_NAMESPACE,
	    'local': DEFAULT_NAMESPACE,
	    'marker-end': DEFAULT_NAMESPACE,
	    'marker-mid': DEFAULT_NAMESPACE,
	    'marker-start': DEFAULT_NAMESPACE,
	    'markerHeight': DEFAULT_NAMESPACE,
	    'markerUnits': DEFAULT_NAMESPACE,
	    'markerWidth': DEFAULT_NAMESPACE,
	    'mask': DEFAULT_NAMESPACE,
	    'maskContentUnits': DEFAULT_NAMESPACE,
	    'maskUnits': DEFAULT_NAMESPACE,
	    'mathematical': DEFAULT_NAMESPACE,
	    'max': DEFAULT_NAMESPACE,
	    'media': DEFAULT_NAMESPACE,
	    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
	    'mediaContentEncodings': DEFAULT_NAMESPACE,
	    'mediaSize': DEFAULT_NAMESPACE,
	    'mediaTime': DEFAULT_NAMESPACE,
	    'method': DEFAULT_NAMESPACE,
	    'min': DEFAULT_NAMESPACE,
	    'mode': DEFAULT_NAMESPACE,
	    'name': DEFAULT_NAMESPACE,
	    'nav-down': DEFAULT_NAMESPACE,
	    'nav-down-left': DEFAULT_NAMESPACE,
	    'nav-down-right': DEFAULT_NAMESPACE,
	    'nav-left': DEFAULT_NAMESPACE,
	    'nav-next': DEFAULT_NAMESPACE,
	    'nav-prev': DEFAULT_NAMESPACE,
	    'nav-right': DEFAULT_NAMESPACE,
	    'nav-up': DEFAULT_NAMESPACE,
	    'nav-up-left': DEFAULT_NAMESPACE,
	    'nav-up-right': DEFAULT_NAMESPACE,
	    'numOctaves': DEFAULT_NAMESPACE,
	    'observer': DEFAULT_NAMESPACE,
	    'offset': DEFAULT_NAMESPACE,
	    'opacity': DEFAULT_NAMESPACE,
	    'operator': DEFAULT_NAMESPACE,
	    'order': DEFAULT_NAMESPACE,
	    'orient': DEFAULT_NAMESPACE,
	    'orientation': DEFAULT_NAMESPACE,
	    'origin': DEFAULT_NAMESPACE,
	    'overflow': DEFAULT_NAMESPACE,
	    'overlay': DEFAULT_NAMESPACE,
	    'overline-position': DEFAULT_NAMESPACE,
	    'overline-thickness': DEFAULT_NAMESPACE,
	    'panose-1': DEFAULT_NAMESPACE,
	    'path': DEFAULT_NAMESPACE,
	    'pathLength': DEFAULT_NAMESPACE,
	    'patternContentUnits': DEFAULT_NAMESPACE,
	    'patternTransform': DEFAULT_NAMESPACE,
	    'patternUnits': DEFAULT_NAMESPACE,
	    'phase': DEFAULT_NAMESPACE,
	    'playbackOrder': DEFAULT_NAMESPACE,
	    'pointer-events': DEFAULT_NAMESPACE,
	    'points': DEFAULT_NAMESPACE,
	    'pointsAtX': DEFAULT_NAMESPACE,
	    'pointsAtY': DEFAULT_NAMESPACE,
	    'pointsAtZ': DEFAULT_NAMESPACE,
	    'preserveAlpha': DEFAULT_NAMESPACE,
	    'preserveAspectRatio': DEFAULT_NAMESPACE,
	    'primitiveUnits': DEFAULT_NAMESPACE,
	    'propagate': DEFAULT_NAMESPACE,
	    'property': DEFAULT_NAMESPACE,
	    'r': DEFAULT_NAMESPACE,
	    'radius': DEFAULT_NAMESPACE,
	    'refX': DEFAULT_NAMESPACE,
	    'refY': DEFAULT_NAMESPACE,
	    'rel': DEFAULT_NAMESPACE,
	    'rendering-intent': DEFAULT_NAMESPACE,
	    'repeatCount': DEFAULT_NAMESPACE,
	    'repeatDur': DEFAULT_NAMESPACE,
	    'requiredExtensions': DEFAULT_NAMESPACE,
	    'requiredFeatures': DEFAULT_NAMESPACE,
	    'requiredFonts': DEFAULT_NAMESPACE,
	    'requiredFormats': DEFAULT_NAMESPACE,
	    'resource': DEFAULT_NAMESPACE,
	    'restart': DEFAULT_NAMESPACE,
	    'result': DEFAULT_NAMESPACE,
	    'rev': DEFAULT_NAMESPACE,
	    'role': DEFAULT_NAMESPACE,
	    'rotate': DEFAULT_NAMESPACE,
	    'rx': DEFAULT_NAMESPACE,
	    'ry': DEFAULT_NAMESPACE,
	    'scale': DEFAULT_NAMESPACE,
	    'seed': DEFAULT_NAMESPACE,
	    'shape-rendering': DEFAULT_NAMESPACE,
	    'slope': DEFAULT_NAMESPACE,
	    'snapshotTime': DEFAULT_NAMESPACE,
	    'spacing': DEFAULT_NAMESPACE,
	    'specularConstant': DEFAULT_NAMESPACE,
	    'specularExponent': DEFAULT_NAMESPACE,
	    'spreadMethod': DEFAULT_NAMESPACE,
	    'startOffset': DEFAULT_NAMESPACE,
	    'stdDeviation': DEFAULT_NAMESPACE,
	    'stemh': DEFAULT_NAMESPACE,
	    'stemv': DEFAULT_NAMESPACE,
	    'stitchTiles': DEFAULT_NAMESPACE,
	    'stop-color': DEFAULT_NAMESPACE,
	    'stop-opacity': DEFAULT_NAMESPACE,
	    'strikethrough-position': DEFAULT_NAMESPACE,
	    'strikethrough-thickness': DEFAULT_NAMESPACE,
	    'string': DEFAULT_NAMESPACE,
	    'stroke': DEFAULT_NAMESPACE,
	    'stroke-dasharray': DEFAULT_NAMESPACE,
	    'stroke-dashoffset': DEFAULT_NAMESPACE,
	    'stroke-linecap': DEFAULT_NAMESPACE,
	    'stroke-linejoin': DEFAULT_NAMESPACE,
	    'stroke-miterlimit': DEFAULT_NAMESPACE,
	    'stroke-opacity': DEFAULT_NAMESPACE,
	    'stroke-width': DEFAULT_NAMESPACE,
	    'surfaceScale': DEFAULT_NAMESPACE,
	    'syncBehavior': DEFAULT_NAMESPACE,
	    'syncBehaviorDefault': DEFAULT_NAMESPACE,
	    'syncMaster': DEFAULT_NAMESPACE,
	    'syncTolerance': DEFAULT_NAMESPACE,
	    'syncToleranceDefault': DEFAULT_NAMESPACE,
	    'systemLanguage': DEFAULT_NAMESPACE,
	    'tableValues': DEFAULT_NAMESPACE,
	    'target': DEFAULT_NAMESPACE,
	    'targetX': DEFAULT_NAMESPACE,
	    'targetY': DEFAULT_NAMESPACE,
	    'text-anchor': DEFAULT_NAMESPACE,
	    'text-decoration': DEFAULT_NAMESPACE,
	    'text-rendering': DEFAULT_NAMESPACE,
	    'textLength': DEFAULT_NAMESPACE,
	    'timelineBegin': DEFAULT_NAMESPACE,
	    'title': DEFAULT_NAMESPACE,
	    'to': DEFAULT_NAMESPACE,
	    'transform': DEFAULT_NAMESPACE,
	    'transformBehavior': DEFAULT_NAMESPACE,
	    'type': DEFAULT_NAMESPACE,
	    'typeof': DEFAULT_NAMESPACE,
	    'u1': DEFAULT_NAMESPACE,
	    'u2': DEFAULT_NAMESPACE,
	    'underline-position': DEFAULT_NAMESPACE,
	    'underline-thickness': DEFAULT_NAMESPACE,
	    'unicode': DEFAULT_NAMESPACE,
	    'unicode-bidi': DEFAULT_NAMESPACE,
	    'unicode-range': DEFAULT_NAMESPACE,
	    'units-per-em': DEFAULT_NAMESPACE,
	    'v-alphabetic': DEFAULT_NAMESPACE,
	    'v-hanging': DEFAULT_NAMESPACE,
	    'v-ideographic': DEFAULT_NAMESPACE,
	    'v-mathematical': DEFAULT_NAMESPACE,
	    'values': DEFAULT_NAMESPACE,
	    'version': DEFAULT_NAMESPACE,
	    'vert-adv-y': DEFAULT_NAMESPACE,
	    'vert-origin-x': DEFAULT_NAMESPACE,
	    'vert-origin-y': DEFAULT_NAMESPACE,
	    'viewBox': DEFAULT_NAMESPACE,
	    'viewTarget': DEFAULT_NAMESPACE,
	    'visibility': DEFAULT_NAMESPACE,
	    'width': DEFAULT_NAMESPACE,
	    'widths': DEFAULT_NAMESPACE,
	    'word-spacing': DEFAULT_NAMESPACE,
	    'writing-mode': DEFAULT_NAMESPACE,
	    'x': DEFAULT_NAMESPACE,
	    'x-height': DEFAULT_NAMESPACE,
	    'x1': DEFAULT_NAMESPACE,
	    'x2': DEFAULT_NAMESPACE,
	    'xChannelSelector': DEFAULT_NAMESPACE,
	    'xlink:actuate': XLINK_NAMESPACE,
	    'xlink:arcrole': XLINK_NAMESPACE,
	    'xlink:href': XLINK_NAMESPACE,
	    'xlink:role': XLINK_NAMESPACE,
	    'xlink:show': XLINK_NAMESPACE,
	    'xlink:title': XLINK_NAMESPACE,
	    'xlink:type': XLINK_NAMESPACE,
	    'xml:base': XML_NAMESPACE,
	    'xml:id': XML_NAMESPACE,
	    'xml:lang': XML_NAMESPACE,
	    'xml:space': XML_NAMESPACE,
	    'y': DEFAULT_NAMESPACE,
	    'y1': DEFAULT_NAMESPACE,
	    'y2': DEFAULT_NAMESPACE,
	    'yChannelSelector': DEFAULT_NAMESPACE,
	    'z': DEFAULT_NAMESPACE,
	    'zoomAndPan': DEFAULT_NAMESPACE
	};
	
	module.exports = SVGAttributeNamespace;
	
	function SVGAttributeNamespace(value) {
	  if (SVG_PROPERTIES.hasOwnProperty(value)) {
	    return SVG_PROPERTIES[value];
	  }
	}


/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isArray = __webpack_require__(32);
	
	var h = __webpack_require__(163);
	
	
	var SVGAttributeNamespace = __webpack_require__(164);
	var attributeHook = __webpack_require__(67);
	
	var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
	
	module.exports = svg;
	
	function svg(tagName, properties, children) {
	    if (!children && isChildren(properties)) {
	        children = properties;
	        properties = {};
	    }
	
	    properties = properties || {};
	
	    // set namespace for svg
	    properties.namespace = SVG_NAMESPACE;
	
	    var attributes = properties.attributes || (properties.attributes = {});
	
	    for (var key in properties) {
	        if (!properties.hasOwnProperty(key)) {
	            continue;
	        }
	
	        var namespace = SVGAttributeNamespace(key);
	
	        if (namespace === undefined) { // not a svg attribute
	            continue;
	        }
	
	        var value = properties[key];
	
	        if (typeof value !== 'string' &&
	            typeof value !== 'number' &&
	            typeof value !== 'boolean'
	        ) {
	            continue;
	        }
	
	        if (namespace !== null) { // namespaced attribute
	            properties[key] = attributeHook(namespace, value);
	            continue;
	        }
	
	        attributes[key] = value
	        properties[key] = undefined
	    }
	
	    return h(tagName, properties, children);
	}
	
	function isChildren(x) {
	    return typeof x === 'string' || isArray(x);
	}


/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(65)
	var isHook = __webpack_require__(30)
	
	module.exports = diffProps
	
	function diffProps(a, b) {
	    var diff
	
	    for (var aKey in a) {
	        if (!(aKey in b)) {
	            diff = diff || {}
	            diff[aKey] = undefined
	        }
	
	        var aValue = a[aKey]
	        var bValue = b[aKey]
	
	        if (aValue === bValue) {
	            continue
	        } else if (isObject(aValue) && isObject(bValue)) {
	            if (getPrototype(bValue) !== getPrototype(aValue)) {
	                diff = diff || {}
	                diff[aKey] = bValue
	            } else if (isHook(bValue)) {
	                 diff = diff || {}
	                 diff[aKey] = bValue
	            } else {
	                var objectDiff = diffProps(aValue, bValue)
	                if (objectDiff) {
	                    diff = diff || {}
	                    diff[aKey] = objectDiff
	                }
	            }
	        } else {
	            diff = diff || {}
	            diff[aKey] = bValue
	        }
	    }
	
	    for (var bKey in b) {
	        if (!(bKey in a)) {
	            diff = diff || {}
	            diff[bKey] = b[bKey]
	        }
	    }
	
	    return diff
	}
	
	function getPrototype(value) {
	  if (Object.getPrototypeOf) {
	    return Object.getPrototypeOf(value)
	  } else if (value.__proto__) {
	    return value.__proto__
	  } else if (value.constructor) {
	    return value.constructor.prototype
	  }
	}


/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(32)
	
	var VPatch = __webpack_require__(71)
	var isVNode = __webpack_require__(15)
	var isVText = __webpack_require__(22)
	var isWidget = __webpack_require__(8)
	var isThunk = __webpack_require__(21)
	var handleThunk = __webpack_require__(70)
	
	var diffProps = __webpack_require__(166)
	
	module.exports = diff
	
	function diff(a, b) {
	    var patch = { a: a }
	    walk(a, b, patch, 0)
	    return patch
	}
	
	function walk(a, b, patch, index) {
	    if (a === b) {
	        return
	    }
	
	    var apply = patch[index]
	    var applyClear = false
	
	    if (isThunk(a) || isThunk(b)) {
	        thunks(a, b, patch, index)
	    } else if (b == null) {
	
	        // If a is a widget we will add a remove patch for it
	        // Otherwise any child widgets/hooks must be destroyed.
	        // This prevents adding two remove patches for a widget.
	        if (!isWidget(a)) {
	            clearState(a, patch, index)
	            apply = patch[index]
	        }
	
	        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
	    } else if (isVNode(b)) {
	        if (isVNode(a)) {
	            if (a.tagName === b.tagName &&
	                a.namespace === b.namespace &&
	                a.key === b.key) {
	                var propsPatch = diffProps(a.properties, b.properties)
	                if (propsPatch) {
	                    apply = appendPatch(apply,
	                        new VPatch(VPatch.PROPS, a, propsPatch))
	                }
	                apply = diffChildren(a, b, patch, apply, index)
	            } else {
	                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
	                applyClear = true
	            }
	        } else {
	            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
	            applyClear = true
	        }
	    } else if (isVText(b)) {
	        if (!isVText(a)) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
	            applyClear = true
	        } else if (a.text !== b.text) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
	        }
	    } else if (isWidget(b)) {
	        if (!isWidget(a)) {
	            applyClear = true
	        }
	
	        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
	    }
	
	    if (apply) {
	        patch[index] = apply
	    }
	
	    if (applyClear) {
	        clearState(a, patch, index)
	    }
	}
	
	function diffChildren(a, b, patch, apply, index) {
	    var aChildren = a.children
	    var orderedSet = reorder(aChildren, b.children)
	    var bChildren = orderedSet.children
	
	    var aLen = aChildren.length
	    var bLen = bChildren.length
	    var len = aLen > bLen ? aLen : bLen
	
	    for (var i = 0; i < len; i++) {
	        var leftNode = aChildren[i]
	        var rightNode = bChildren[i]
	        index += 1
	
	        if (!leftNode) {
	            if (rightNode) {
	                // Excess nodes in b need to be added
	                apply = appendPatch(apply,
	                    new VPatch(VPatch.INSERT, null, rightNode))
	            }
	        } else {
	            walk(leftNode, rightNode, patch, index)
	        }
	
	        if (isVNode(leftNode) && leftNode.count) {
	            index += leftNode.count
	        }
	    }
	
	    if (orderedSet.moves) {
	        // Reorder nodes last
	        apply = appendPatch(apply, new VPatch(
	            VPatch.ORDER,
	            a,
	            orderedSet.moves
	        ))
	    }
	
	    return apply
	}
	
	function clearState(vNode, patch, index) {
	    // TODO: Make this a single walk, not two
	    unhook(vNode, patch, index)
	    destroyWidgets(vNode, patch, index)
	}
	
	// Patch records for all destroyed widgets must be added because we need
	// a DOM node reference for the destroy function
	function destroyWidgets(vNode, patch, index) {
	    if (isWidget(vNode)) {
	        if (typeof vNode.destroy === "function") {
	            patch[index] = appendPatch(
	                patch[index],
	                new VPatch(VPatch.REMOVE, vNode, null)
	            )
	        }
	    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
	        var children = vNode.children
	        var len = children.length
	        for (var i = 0; i < len; i++) {
	            var child = children[i]
	            index += 1
	
	            destroyWidgets(child, patch, index)
	
	            if (isVNode(child) && child.count) {
	                index += child.count
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index)
	    }
	}
	
	// Create a sub-patch for thunks
	function thunks(a, b, patch, index) {
	    var nodes = handleThunk(a, b)
	    var thunkPatch = diff(nodes.a, nodes.b)
	    if (hasPatches(thunkPatch)) {
	        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
	    }
	}
	
	function hasPatches(patch) {
	    for (var index in patch) {
	        if (index !== "a") {
	            return true
	        }
	    }
	
	    return false
	}
	
	// Execute hooks when two nodes are identical
	function unhook(vNode, patch, index) {
	    if (isVNode(vNode)) {
	        if (vNode.hooks) {
	            patch[index] = appendPatch(
	                patch[index],
	                new VPatch(
	                    VPatch.PROPS,
	                    vNode,
	                    undefinedKeys(vNode.hooks)
	                )
	            )
	        }
	
	        if (vNode.descendantHooks || vNode.hasThunks) {
	            var children = vNode.children
	            var len = children.length
	            for (var i = 0; i < len; i++) {
	                var child = children[i]
	                index += 1
	
	                unhook(child, patch, index)
	
	                if (isVNode(child) && child.count) {
	                    index += child.count
	                }
	            }
	        }
	    } else if (isThunk(vNode)) {
	        thunks(vNode, null, patch, index)
	    }
	}
	
	function undefinedKeys(obj) {
	    var result = {}
	
	    for (var key in obj) {
	        result[key] = undefined
	    }
	
	    return result
	}
	
	// List diff, naive left to right reordering
	function reorder(aChildren, bChildren) {
	    // O(M) time, O(M) memory
	    var bChildIndex = keyIndex(bChildren)
	    var bKeys = bChildIndex.keys
	    var bFree = bChildIndex.free
	
	    if (bFree.length === bChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        }
	    }
	
	    // O(N) time, O(N) memory
	    var aChildIndex = keyIndex(aChildren)
	    var aKeys = aChildIndex.keys
	    var aFree = aChildIndex.free
	
	    if (aFree.length === aChildren.length) {
	        return {
	            children: bChildren,
	            moves: null
	        }
	    }
	
	    // O(MAX(N, M)) memory
	    var newChildren = []
	
	    var freeIndex = 0
	    var freeCount = bFree.length
	    var deletedItems = 0
	
	    // Iterate through a and match a node in b
	    // O(N) time,
	    for (var i = 0 ; i < aChildren.length; i++) {
	        var aItem = aChildren[i]
	        var itemIndex
	
	        if (aItem.key) {
	            if (bKeys.hasOwnProperty(aItem.key)) {
	                // Match up the old keys
	                itemIndex = bKeys[aItem.key]
	                newChildren.push(bChildren[itemIndex])
	
	            } else {
	                // Remove old keyed items
	                itemIndex = i - deletedItems++
	                newChildren.push(null)
	            }
	        } else {
	            // Match the item in a with the next free item in b
	            if (freeIndex < freeCount) {
	                itemIndex = bFree[freeIndex++]
	                newChildren.push(bChildren[itemIndex])
	            } else {
	                // There are no free items in b to match with
	                // the free items in a, so the extra free nodes
	                // are deleted.
	                itemIndex = i - deletedItems++
	                newChildren.push(null)
	            }
	        }
	    }
	
	    var lastFreeIndex = freeIndex >= bFree.length ?
	        bChildren.length :
	        bFree[freeIndex]
	
	    // Iterate through b and append any new keys
	    // O(M) time
	    for (var j = 0; j < bChildren.length; j++) {
	        var newItem = bChildren[j]
	
	        if (newItem.key) {
	            if (!aKeys.hasOwnProperty(newItem.key)) {
	                // Add any new keyed items
	                // We are adding new items to the end and then sorting them
	                // in place. In future we should insert new items in place.
	                newChildren.push(newItem)
	            }
	        } else if (j >= lastFreeIndex) {
	            // Add any leftover non-keyed items
	            newChildren.push(newItem)
	        }
	    }
	
	    var simulate = newChildren.slice()
	    var simulateIndex = 0
	    var removes = []
	    var inserts = []
	    var simulateItem
	
	    for (var k = 0; k < bChildren.length;) {
	        var wantedItem = bChildren[k]
	        simulateItem = simulate[simulateIndex]
	
	        // remove items
	        while (simulateItem === null && simulate.length) {
	            removes.push(remove(simulate, simulateIndex, null))
	            simulateItem = simulate[simulateIndex]
	        }
	
	        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	            // if we need a key in this position...
	            if (wantedItem.key) {
	                if (simulateItem && simulateItem.key) {
	                    // if an insert doesn't put this key in place, it needs to move
	                    if (bKeys[simulateItem.key] !== k + 1) {
	                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
	                        simulateItem = simulate[simulateIndex]
	                        // if the remove didn't put the wanted item in place, we need to insert it
	                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
	                            inserts.push({key: wantedItem.key, to: k})
	                        }
	                        // items are matching, so skip ahead
	                        else {
	                            simulateIndex++
	                        }
	                    }
	                    else {
	                        inserts.push({key: wantedItem.key, to: k})
	                    }
	                }
	                else {
	                    inserts.push({key: wantedItem.key, to: k})
	                }
	                k++
	            }
	            // a key in simulate has no matching wanted key, remove it
	            else if (simulateItem && simulateItem.key) {
	                removes.push(remove(simulate, simulateIndex, simulateItem.key))
	            }
	        }
	        else {
	            simulateIndex++
	            k++
	        }
	    }
	
	    // remove all the remaining nodes from simulate
	    while(simulateIndex < simulate.length) {
	        simulateItem = simulate[simulateIndex]
	        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
	    }
	
	    // If the only moves we have are deletes then we can just
	    // let the delete patch remove these items.
	    if (removes.length === deletedItems && !inserts.length) {
	        return {
	            children: newChildren,
	            moves: null
	        }
	    }
	
	    return {
	        children: newChildren,
	        moves: {
	            removes: removes,
	            inserts: inserts
	        }
	    }
	}
	
	function remove(arr, index, key) {
	    arr.splice(index, 1)
	
	    return {
	        from: index,
	        key: key
	    }
	}
	
	function keyIndex(children) {
	    var keys = {}
	    var free = []
	    var length = children.length
	
	    for (var i = 0; i < length; i++) {
	        var child = children[i]
	
	        if (child.key) {
	            keys[child.key] = i
	        } else {
	            free.push(i)
	        }
	    }
	
	    return {
	        keys: keys,     // A hash of key name to index
	        free: free      // An array of unkeyed item indices
	    }
	}
	
	function appendPatch(apply, patch) {
	    if (apply) {
	        if (isArray(apply)) {
	            apply.push(patch)
	        } else {
	            apply = [apply, patch]
	        }
	
	        return apply
	    } else {
	        return patch
	    }
	}


/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = __webpack_require__(26)["default"];
	
	var _classCallCheck = __webpack_require__(19)["default"];
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var owns = Object.prototype.hasOwnProperty;
	
	var Calculations = (function () {
	    function Calculations() {
	        var values = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	        _classCallCheck(this, Calculations);
	
	        this.values = values;
	    }
	
	    _createClass(Calculations, [{
	        key: "set",
	        value: function set(key, value) {
	            if (owns.call(this.values, key)) {
	                throw new Error("Key already set: " + key);
	            }
	            return this.values[key] = value;
	        }
	    }, {
	        key: "get",
	        value: function get(key) {
	            if (!owns.call(this.values, key)) {
	                throw new Error("Unknown key: " + key);
	            }
	            return this.values[key];
	        }
	    }]);
	
	    return Calculations;
	})();
	
	exports["default"] = Calculations;
	module.exports = exports["default"];

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = __webpack_require__(12)['default'];
	
	var _Object$entries = __webpack_require__(18)['default'];
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	var _interopRequireWildcard = __webpack_require__(191)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = cosmetic;
	
	var _cycleCore = __webpack_require__(2);
	
	var _cycleDom = __webpack_require__(6);
	
	var _input = __webpack_require__(33);
	
	var _input2 = _interopRequireDefault(_input);
	
	var _select = __webpack_require__(73);
	
	var _select2 = _interopRequireDefault(_select);
	
	var _combineLatestObject = __webpack_require__(23);
	
	var _combineLatestObject2 = _interopRequireDefault(_combineLatestObject);
	
	var _constantsJson = __webpack_require__(10);
	
	var _localize = __webpack_require__(177);
	
	var localize = _interopRequireWildcard(_localize);
	
	function makeInput(key, type, defaultValue, DOM, value$, props$) {
	    return (0, _input2['default'])(key, type, {
	        DOM: DOM,
	        value$: value$.map(function (value) {
	            return value[key] || defaultValue;
	        }).startWith(defaultValue),
	        props$: props$ || _cycleCore.Rx.Observable['return']({
	            placeholder: key
	        })
	    });
	}
	
	function makeBox(selector, object, calculations) {
	    _Object$entries(object).filter(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 2);
	
	        var key = _ref2[0];
	        var value = _ref2[1];
	        return value.value$;
	    }).forEach(function (_ref3) {
	        var _ref32 = _slicedToArray(_ref3, 2);
	
	        var key = _ref32[0];
	        var value = _ref32[1];
	        return calculations.set(key, value.value$);
	    });
	    return {
	        DOM: _cycleCore.Rx.Observable.combineLatest(_Object$keys(object).map(function (key) {
	            return object[key].DOM.startWith(null).filter(function (x) {
	                return x;
	            }).map(function (vTree) {
	                return (0, _cycleDom.h)('label.' + key + '-label', {
	                    key: key
	                }, [localize.name(key), ' ', vTree]);
	            });
	        })).map(function (vTrees) {
	            return (0, _cycleDom.h)(selector, vTrees);
	        }),
	        value$: (0, _combineLatestObject2['default'])(_Object$keys(object).reduce(function (acc, key) {
	            var value$ = object[key].value$;
	            if (value$) {
	                acc[key] = value$;
	            }
	            return acc;
	        }, {})).share()
	    };
	}
	
	function cosmetic(_ref4) {
	    var DOM = _ref4.DOM;
	    var value$ = _ref4.value$;
	    var raceDOM = _ref4.raceDOM;
	    var calculations = _ref4.calculations;
	
	    return makeBox('section.cosmetic', {
	        name: makeInput('name', 'text', '', DOM, value$),
	        age: makeInput('age', 'number', 20, DOM, value$, _cycleCore.Rx.Observable['return']({
	            min: 0,
	            placeholder: 'Age'
	        })),
	        sex: makeInput('sex', 'text', '', DOM, value$),
	        race: {
	            DOM: raceDOM
	        },
	        weight: makeInput('weight', 'number', 150, DOM, value$, calculations.get('race').pluck('weight').map(function (_ref5) {
	            var min = _ref5.min;
	            var max = _ref5.max;
	            return {
	                min: min,
	                max: max,
	                placeholder: 'Weight'
	            };
	        })),
	        height: makeInput('height', 'number', 1.8, DOM, value$, calculations.get('race').pluck('height').map(function (_ref6) {
	            var min = _ref6.min;
	            var max = _ref6.max;
	            return {
	                min: min,
	                max: max,
	                step: 0.01,
	                placeholder: 'Height'
	            };
	        })),
	        eyes: makeInput('eyes', 'text', '', DOM, value$),
	        hair: makeInput('hair', 'text', '', DOM, value$),
	        appearance: makeInput('appearance', 'textarea', '', DOM, value$)
	    }, calculations);
	}
	
	module.exports = exports['default'];

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = characterSheet;
	
	var _cycleCore = __webpack_require__(2);
	
	var _cycleDom = __webpack_require__(6);
	
	var _race = __webpack_require__(172);
	
	var _race2 = _interopRequireDefault(_race);
	
	var _cosmetic = __webpack_require__(169);
	
	var _cosmetic2 = _interopRequireDefault(_cosmetic);
	
	var _primaryStatisticChart = __webpack_require__(171);
	
	var _primaryStatisticChart2 = _interopRequireDefault(_primaryStatisticChart);
	
	var _secondaryStatisticChart = __webpack_require__(173);
	
	var _secondaryStatisticChart2 = _interopRequireDefault(_secondaryStatisticChart);
	
	var _skills = __webpack_require__(174);
	
	var _skills2 = _interopRequireDefault(_skills);
	
	var _traits = __webpack_require__(175);
	
	var _traits2 = _interopRequireDefault(_traits);
	
	var _combineLatestObject = __webpack_require__(23);
	
	var _combineLatestObject2 = _interopRequireDefault(_combineLatestObject);
	
	var _modelsCondition = __webpack_require__(235);
	
	var _modelsCondition2 = _interopRequireDefault(_modelsCondition);
	
	var _Calculations = __webpack_require__(168);
	
	var _Calculations2 = _interopRequireDefault(_Calculations);
	
	var _requestAnimationFrameScheduler = __webpack_require__(184);
	
	var _requestAnimationFrameScheduler2 = _interopRequireDefault(_requestAnimationFrameScheduler);
	
	var _constantsJson = __webpack_require__(10);
	
	function safeParseJSON(value) {
	    try {
	        return JSON.parse(value) || {};
	    } catch (e) {
	        return {};
	    }
	}
	
	function coerceEmptyObject(obj) {
	    for (var key in obj) {
	        return obj;
	    }
	    return null;
	}
	
	function removeEmptyValues(obj) {
	    if (Array.isArray(obj)) {
	        return obj.length ? obj.map(removeEmptyValues) : null;
	    } else if (obj && obj.constructor === Object) {
	        return coerceEmptyObject(_Object$keys(obj).reduce(function (acc, key) {
	            var value = removeEmptyValues(obj[key]);
	            if (value) {
	                acc[key] = value;
	            }
	            return acc;
	        }, {}));
	    } else {
	        return obj || null;
	    }
	}
	
	function characterSheet(_ref) {
	    var DOM = _ref.DOM;
	    var localStorageSource = _ref.localStorageSource;
	
	    var calculations = new _Calculations2['default']();
	    _modelsCondition2['default'].all().forEach(function (condition) {
	        return calculations.set(condition.key, _cycleCore.Rx.Observable['return'](false));
	    });
	    _Object$keys(_constantsJson.MISCELLANEOUS).forEach(function (key) {
	        return calculations.set(key, _cycleCore.Rx.Observable['return'](0));
	    });
	    var deserializedSavedData$ = localStorageSource.map(safeParseJSON).shareReplay(1);
	    var raceView = (0, _race2['default'])({
	        DOM: DOM,
	        value$: deserializedSavedData$.map(function (x) {
	            return x.race || '';
	        }),
	        calculations: calculations
	    });
	    var cosmeticView = (0, _cosmetic2['default'])({
	        DOM: DOM,
	        value$: deserializedSavedData$.map(function (x) {
	            return x.cosmetic || {};
	        }),
	        raceDOM: raceView.DOM,
	        calculations: calculations
	    });
	    var primaryStatisticView = (0, _primaryStatisticChart2['default'])({
	        DOM: DOM,
	        value$: deserializedSavedData$.map(function (x) {
	            return x.primary || {};
	        }),
	        calculations: calculations
	    });
	    var secondaryStatisticView = (0, _secondaryStatisticChart2['default'])({
	        DOM: DOM,
	        value$: deserializedSavedData$.map(function (x) {
	            return x.secondary || {};
	        }),
	        calculations: calculations
	    });
	    var skillsView = (0, _skills2['default'])({
	        DOM: DOM,
	        value$: deserializedSavedData$.map(function (x) {
	            return x.skills || {};
	        }),
	        calculations: calculations
	    });
	    var traitsView = (0, _traits2['default'])({
	        DOM: DOM,
	        value$: deserializedSavedData$.map(function (x) {
	            return x.traits || {};
	        }),
	        calculations: calculations
	    });
	    return {
	        DOM: (0, _combineLatestObject2['default'])({
	            cosmetic: cosmeticView.DOM.startWith('-Cosmetic-'),
	            primary: primaryStatisticView.DOM.startWith('-Primary-'),
	            secondary: secondaryStatisticView.DOM.startWith('-Secondary-'),
	            skills: skillsView.DOM.startWith('-Skills-'),
	            traits: traitsView.DOM.startWith('-Traits-')
	        }).map(function (_ref2) {
	            var cosmetic = _ref2.cosmetic;
	            var primary = _ref2.primary;
	            var secondary = _ref2.secondary;
	            var skills = _ref2.skills;
	            var traits = _ref2.traits;
	            return (0, _cycleDom.h)('section.character-sheet-body', [cosmetic, primary, secondary, skills, traits]);
	        }).sample(0, _requestAnimationFrameScheduler2['default']),
	        localStorageSink: localStorageSource.first().concat((0, _combineLatestObject2['default'])({
	            race: raceView.value$,
	            cosmetic: cosmeticView.value$.startWith({}),
	            primary: primaryStatisticView.value$.startWith({}),
	            secondary: secondaryStatisticView.value$.startWith({}),
	            skills: skillsView.value$,
	            traits: traitsView.value$
	        }).throttle(200).map(removeEmptyValues).map(JSON.stringify.bind(JSON))).distinctUntilChanged().skip(1)
	    };
	}
	
	module.exports = exports['default'];

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = primaryStatisticChart;
	
	var _cycleCore = __webpack_require__(2);
	
	var _cycleDom = __webpack_require__(6);
	
	var _input = __webpack_require__(33);
	
	var _input2 = _interopRequireDefault(_input);
	
	var _combineLatestObject = __webpack_require__(23);
	
	var _combineLatestObject2 = _interopRequireDefault(_combineLatestObject);
	
	var _modelsPrimaryStatistic = __webpack_require__(74);
	
	var _modelsPrimaryStatistic2 = _interopRequireDefault(_modelsPrimaryStatistic);
	
	function toExtrema(range) {
	    return {
	        min: range.min,
	        max: range.max
	    };
	}
	
	function primaryStatisticEntry(stat, _ref) {
	    var DOM = _ref.DOM;
	    var value$ = _ref.value$;
	    var calculations = _ref.calculations;
	
	    var raceExtrema$ = calculations.get('race').pluck(stat.key);
	    var inputView = (0, _input2['default'])(stat.key, 'number', {
	        DOM: DOM,
	        value$: value$.map(function (value) {
	            return value[stat.key] || 5;
	        }).startWith(5),
	        props$: raceExtrema$.map(function (_ref2) {
	            var min = _ref2.min;
	            var max = _ref2.max;
	            return {
	                min: min,
	                max: max,
	                className: 'stat-input'
	            };
	        })
	    });
	    var extremaVTree$ = raceExtrema$.map(function (_ref3) {
	        var min = _ref3.min;
	        var max = _ref3.max;
	        return (0, _cycleDom.h)('span.stat-extrema', [min, '/', max]);
	    });
	    calculations.set(stat.key, inputView.value$);
	
	    return {
	        DOM: (0, _combineLatestObject2['default'])({
	            input: inputView.DOM,
	            extrema: extremaVTree$
	        }).map(function (_ref4) {
	            var input = _ref4.input;
	            var extrema = _ref4.extrema;
	            return (0, _cycleDom.h)('div.primary-statistic.primary-statistic-' + stat.key, [(0, _cycleDom.h)('abbr.stat-label', {
	                title: stat.name
	            }, [stat.abbr]), input, extrema]);
	        }),
	        value$: inputView.value$
	    };
	}
	
	function primaryStatisticChart(_ref5) {
	    var DOM = _ref5.DOM;
	    var value$ = _ref5.value$;
	    var calculations = _ref5.calculations;
	
	    var statistics = _modelsPrimaryStatistic2['default'].all().toArray();
	    var statisticEntries = statistics.map(function (stat) {
	        return primaryStatisticEntry(stat, {
	            DOM: DOM,
	            value$: value$,
	            calculations: calculations
	        });
	    });
	
	    var sum$ = _cycleCore.Rx.Observable.combineLatest(statisticEntries.map(function (a) {
	        return a.value$;
	    })).map(function (values) {
	        return values.reduce(function (x, y) {
	            return x + y;
	        }, 0);
	    });
	
	    var primaryTotal$ = calculations.get('race').pluck('primaryTotal');
	
	    var summaryVTree$ = _cycleCore.Rx.Observable.combineLatest(sum$, primaryTotal$, function (sum, primaryTotal) {
	        return (0, _cycleDom.h)('div', {
	            className: 'primary-total ' + (sum === primaryTotal ? 'primary-total--same' : '')
	        }, [sum, '/', primaryTotal]);
	    });
	
	    return {
	        DOM: _cycleCore.Rx.Observable.combineLatest(statisticEntries.map(function (a) {
	            return a.DOM;
	        }).concat([summaryVTree$])).map(function (inputVTrees) {
	            return (0, _cycleDom.h)('section.primary', inputVTrees);
	        }),
	        value$: (0, _combineLatestObject2['default'])(statistics.reduce(function (acc, stat, i) {
	            acc[stat.key] = statisticEntries[i].value$;
	            return acc;
	        }, {})).share()
	    };
	}
	
	module.exports = exports['default'];

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = race;
	
	var _cycleCore = __webpack_require__(2);
	
	var _cycleDom = __webpack_require__(6);
	
	var _select = __webpack_require__(73);
	
	var _select2 = _interopRequireDefault(_select);
	
	var _modelsRace = __webpack_require__(75);
	
	var _modelsRace2 = _interopRequireDefault(_modelsRace);
	
	function race(_ref) {
	    var DOM = _ref.DOM;
	    var value$ = _ref.value$;
	    var calculations = _ref.calculations;
	
	    var raceSelect = (0, _select2['default'])('race', {
	        DOM: DOM,
	        value$: value$,
	        options$: _cycleCore.Rx.Observable['return'](_modelsRace2['default'].all().map(function (race) {
	            return {
	                value: race.key,
	                text: race.name
	            };
	        })),
	        props$: _cycleCore.Rx.Observable['return']({
	            fallback: '— Race —'
	        })
	    });
	    var race$ = raceSelect.value$;
	    var model$ = race$.map(function (race) {
	        return _modelsRace2['default'].getOrDefault(race);
	    }).distinctUntilChanged().share();
	
	    calculations.set('race', model$);
	    _modelsRace2['default'].all().forEach(function (race) {
	        return calculations.set(race.key, _cycleCore.Rx.Observable['return'](race));
	    });
	
	    return {
	        DOM: raceSelect.DOM,
	        value$: race$
	    };
	}
	
	module.exports = exports['default'];

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = secondaryStatisticChart;
	
	var _cycleCore = __webpack_require__(2);
	
	var _cycleDom = __webpack_require__(6);
	
	var _input = __webpack_require__(33);
	
	var _input2 = _interopRequireDefault(_input);
	
	var _combineLatestObject = __webpack_require__(23);
	
	var _combineLatestObject2 = _interopRequireDefault(_combineLatestObject);
	
	var _modelsSecondaryStatistic = __webpack_require__(180);
	
	var _modelsSecondaryStatistic2 = _interopRequireDefault(_modelsSecondaryStatistic);
	
	var _algorithm = __webpack_require__(72);
	
	var _algorithm2 = _interopRequireDefault(_algorithm);
	
	var _renderRef = __webpack_require__(236);
	
	var _renderRef2 = _interopRequireDefault(_renderRef);
	
	function makeInput(key, type, defaultValue, DOM, value$, props$) {
	    return (0, _input2['default'])(key, type, {
	        DOM: DOM,
	        value$: value$.map(function (value) {
	            return value[key] || defaultValue;
	        }).startWith(defaultValue),
	        props$: props$
	    });
	}
	
	function toExtrema(range) {
	    return {
	        min: range.min,
	        max: range.max
	    };
	}
	
	function secondaryStatisticEntry(stat, _ref) {
	    var DOM = _ref.DOM;
	    var value$ = _ref.value$;
	    var calculations = _ref.calculations;
	
	    // const inputView = makeInput(stat.key, 'number', 5, DOM, value$, raceExtrema$.map(toExtrema));
	    // const extremaVTree$ = raceExtrema$
	    //     .map(({min, max}) => h('span', [min, '/', max]));
	    var valueView = (0, _algorithm2['default'])({
	        equation$: _cycleCore.Rx.Observable['return'](stat.value),
	        calculations: calculations
	    });
	    calculations.set(stat.key, valueView.value$);
	
	    return {
	        DOM: _cycleCore.Rx.Observable.combineLatest(valueView.DOM, valueView.value$.startWith('poo'), function (vTree, value) {
	            return (0, _cycleDom.h)('div.secondary-statistic.secondary-statistic-' + stat.key + (stat.percent ? '.secondary-statistic-percent' : ''), [(0, _renderRef2['default'])(stat.key, 'stat-label'), (0, _cycleDom.h)('span.stat-value', [value]), vTree]);
	        }),
	        value$: valueView.value$
	    };
	}
	
	function secondaryStatisticChart(_ref2) {
	    var DOM = _ref2.DOM;
	    var value$ = _ref2.value$;
	    var calculations = _ref2.calculations;
	
	    var statistics = _modelsSecondaryStatistic2['default'].all().toArray();
	    var statisticEntries = statistics.map(function (stat) {
	        return secondaryStatisticEntry(stat, {
	            DOM: DOM,
	            value$: value$,
	            calculations: calculations
	        });
	    });
	
	    return {
	        DOM: _cycleCore.Rx.Observable.combineLatest(statisticEntries.map(function (a) {
	            return a.DOM;
	        })).map(function (inputVTrees) {
	            return (0, _cycleDom.h)('section.secondary', inputVTrees);
	        }),
	        value$: (0, _combineLatestObject2['default'])(statistics.reduce(function (acc, stat, i) {
	            acc[stat.key] = statisticEntries[i].value$;
	            return acc;
	        }, {})).share()
	    };
	}
	
	module.exports = exports['default'];

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = skills;
	
	var _cycleCore = __webpack_require__(2);
	
	var _cycleDom = __webpack_require__(6);
	
	var _input = __webpack_require__(33);
	
	var _input2 = _interopRequireDefault(_input);
	
	var _combineLatestObject = __webpack_require__(23);
	
	var _combineLatestObject2 = _interopRequireDefault(_combineLatestObject);
	
	var _modelsPrimaryStatistic = __webpack_require__(74);
	
	var _modelsPrimaryStatistic2 = _interopRequireDefault(_modelsPrimaryStatistic);
	
	var _modelsSkillCategory = __webpack_require__(182);
	
	var _modelsSkillCategory2 = _interopRequireDefault(_modelsSkillCategory);
	
	var _algorithm = __webpack_require__(72);
	
	var _algorithm2 = _interopRequireDefault(_algorithm);
	
	var _modelsEquation = __webpack_require__(36);
	
	var _modelsWhen = __webpack_require__(76);
	
	var _modelsWhen2 = _interopRequireDefault(_modelsWhen);
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	function makeSkillView(skill, _ref) {
	    var DOM = _ref.DOM;
	    var inputTags$ = _ref.inputTags$;
	    var inputIncrease$ = _ref.inputIncrease$;
	    var calculations = _ref.calculations;
	
	    var tagInput = (0, _input2['default'])('skill-tag-' + skill.key, 'checkbox', {
	        DOM: DOM,
	        value$: inputTags$.map(function (tag) {
	            return tag.indexOf(skill.key) !== -1;
	        }),
	        props$: _cycleCore.Rx.Observable['return']({
	            className: 'skill-tag'
	        })
	    });
	    var tagEquation$ = tagInput.value$.map(function (isTagged) {
	        return new _modelsEquation.BinaryOperation({
	            type: '+',
	            left: skill.value,
	            right: isTagged ? 15 : 0
	        });
	    });
	    var increaseView = (0, _input2['default'])('skill-increase-' + skill.key, 'number', {
	        DOM: DOM,
	        value$: inputIncrease$.map(function (increase) {
	            return increase[skill.key] || 0;
	        }).startWith(0),
	        props$: _cycleCore.Rx.Observable['return']({
	            min: 0,
	            max: 999,
	            className: 'skill-increase'
	        })
	    });
	    var equation$ = tagEquation$.combineLatest(increaseView.value$, function (eq, value) {
	        return new _modelsEquation.BinaryOperation({
	            type: '+',
	            left: eq,
	            right: value
	        });
	    });
	
	    var algorithmView = (0, _algorithm2['default'])({
	        equation$: equation$,
	        calculations: calculations
	    });
	    return {
	        skill: skill,
	        DOM: _cycleCore.Rx.Observable.combineLatest(algorithmView.DOM, algorithmView.value$, increaseView.DOM, tagInput.DOM, tagInput.value$, function (algorithmDOM, algorithmValue, increase, tag, tagValue) {
	            return (0, _cycleDom.h)('div.skill.skill-' + skill.key, {
	                className: tagValue ? 'skill-tagged' : 'skill-untagged'
	            }, [tag, (0, _cycleDom.h)('span.skill-name', [skill.name]), (0, _cycleDom.h)('span.skill-value', [algorithmValue + '']), increase, algorithmDOM]);
	        }),
	        tagged$: tagInput.value$,
	        increase$: increaseView.value$
	    };
	}
	
	function makeSkillCategoryView(category, input) {
	    var skillViews = category.skills.valueSeq().map(function (skill) {
	        return makeSkillView(skill, input);
	    }).toArray();
	    return {
	        DOM: _cycleCore.Rx.Observable.combineLatest(skillViews.map(function (o) {
	            return o.DOM;
	        })).startWith([]).map(function (skillVTrees) {
	            return (0, _cycleDom.h)('section.skill-category.skill-category-' + category.key, [(0, _cycleDom.h)('span.skill-category-title', [category.name])].concat(skillVTrees));
	        }),
	        tagged$: _cycleCore.Rx.Observable.from(skillViews).flatMap(function (_ref2) {
	            var tagged$ = _ref2.tagged$;
	            var key = _ref2.skill.key;
	            return tagged$.map(function (value) {
	                return function (o) {
	                    return o.set(key, value);
	                };
	            });
	        }).startWith(_immutable2['default'].Map()).scan(function (acc, modifier) {
	            return modifier(acc);
	        }),
	        increase$: _cycleCore.Rx.Observable.from(skillViews).flatMap(function (_ref3) {
	            var increase$ = _ref3.increase$;
	            var key = _ref3.skill.key;
	            return increase$.map(function (value) {
	                return function (o) {
	                    return o.set(key, value);
	                };
	            });
	        }).startWith(_immutable2['default'].Map()).scan(function (acc, modifier) {
	            return modifier(acc);
	        })
	    };
	}
	
	function skills(_ref4) {
	    var DOM = _ref4.DOM;
	    var inputValue$ = _ref4.value$;
	    var calculations = _ref4.calculations;
	
	    var inputTags$ = inputValue$.map(function (value) {
	        return value.tag || [];
	    }).share();
	    var inputIncrease$ = inputValue$.map(function (value) {
	        return value.increase || {};
	    }).share();
	    var skillCategoryViews = _modelsSkillCategory2['default'].all().map(function (category) {
	        return makeSkillCategoryView(category, {
	            DOM: DOM,
	            inputTags$: inputTags$,
	            inputIncrease$: inputIncrease$,
	            calculations: calculations
	        });
	    }).toArray();
	    return {
	        DOM: _cycleCore.Rx.Observable.combineLatest(skillCategoryViews.map(function (o) {
	            return o.DOM;
	        })).map(function (vTrees) {
	            return (0, _cycleDom.h)('section.skills', vTrees);
	        }),
	        value$: _cycleCore.Rx.Observable.from(skillCategoryViews).flatMap(function (_ref5) {
	            var tagged$ = _ref5.tagged$;
	            var increase$ = _ref5.increase$;
	            return _cycleCore.Rx.Observable.merge(tagged$.map(function (tagged) {
	                return function (o) {
	                    return {
	                        tag: o.tag.merge(tagged),
	                        increase: o.increase
	                    };
	                };
	            }), increase$.map(function (increase) {
	                return function (o) {
	                    return {
	                        tag: o.tag,
	                        increase: o.increase.merge(increase)
	                    };
	                };
	            }));
	        }).startWith({
	            tag: _immutable2['default'].Map(),
	            increase: _immutable2['default'].Map()
	        }).scan(function (acc, modifier) {
	            return modifier(acc);
	        }).map(function (_ref6) {
	            var tag = _ref6.tag;
	            var increase = _ref6.increase;
	            return {
	                tag: tag.toKeyedSeq().filter(function (value) {
	                    return value;
	                }).map(function (value, key) {
	                    return key;
	                }).sort().toArray(),
	                increase: increase.toJS()
	            };
	        })
	    };
	}
	
	module.exports = exports['default'];

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _defineProperty = __webpack_require__(190)['default'];
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	var _Object$assign = __webpack_require__(17)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = traits;
	
	var _cycleCore = __webpack_require__(2);
	
	var _cycleDom = __webpack_require__(6);
	
	var _input = __webpack_require__(33);
	
	var _input2 = _interopRequireDefault(_input);
	
	var _combineLatestObject = __webpack_require__(23);
	
	var _combineLatestObject2 = _interopRequireDefault(_combineLatestObject);
	
	var _modelsTrait = __webpack_require__(183);
	
	var _modelsTrait2 = _interopRequireDefault(_modelsTrait);
	
	var _algorithm = __webpack_require__(72);
	
	var _algorithm2 = _interopRequireDefault(_algorithm);
	
	var _modelsRace = __webpack_require__(75);
	
	var _modelsRace2 = _interopRequireDefault(_modelsRace);
	
	// import { TRAITS, PRIMARY_ATTRIBUTES } from '../../constants.json';
	// import localize from '../../localization';
	
	function isTraitChoosable(trait, calculations) {
	    return (0, _algorithm2['default'])({
	        equation$: _cycleCore.Rx.Observable['return'](trait.requirements),
	        calculations: calculations
	    }).value$;
	}
	
	function makeTraitView(trait, value$, DOM, calculations) {
	    var isChoosable$ = isTraitChoosable(trait, calculations);
	    var chosenTraitInput = (0, _input2['default'])(trait.key, 'checkbox', {
	        DOM: DOM,
	        value$: value$.combineLatest(isChoosable$, function (data, enabled) {
	            return enabled && data[trait.key] || false;
	        }),
	        props$: isChoosable$.map(function (enabled) {
	            return {
	                disabled: !enabled
	            };
	        })
	    });
	    return {
	        key: trait.key,
	        DOM: chosenTraitInput.DOM.map(function (inputVTree) {
	            return (0, _cycleDom.h)('section.trait.trait-' + trait.key, [inputVTree, trait.key, ' - ', getTraitDescription(trait)]);
	        }),
	        value$: chosenTraitInput.value$
	    };
	}
	//
	// function gainLose(name, count) {
	//     if (count > 0) {
	//         return 'Gain ' + count + ' ' + name;
	//     } else if (count < 0) {
	//         return 'Lose ' + (-count) + ' ' + name;
	//     } else {
	//         return '';
	//     }
	// }
	//
	// const partKeyToDescriptor = {
	//     actionPoints(value) {
	//         return gainLose('Action Points', value);
	//     },
	//     raceWhitelist(value) {
	//         return 'Only ' + value.join(', ') + ' can choose this trait';
	//     },
	//     raceBlacklist(value) {
	//         return value.join(', ') + ' cannot choose this trait';
	//     },
	// };
	// PRIMARY_ATTRIBUTES.forEach(attribute => {
	//     partKeyToDescriptor[attribute] = (value) => gainLose(attribute, value);
	// });
	//
	// function getTraitDescriptionPart(key, value) {
	//     const descriptor = partKeyToDescriptor[key];
	//     if (descriptor) {
	//         return descriptor(value);
	//     } else {
	//         return JSON.stringify({
	//             [key]: value,
	//         });
	//     }
	// }
	//
	function getTraitDescription(trait) {
	    return trait.toString();
	    return _Object$keys(trait).map(function (key) {
	        return getTraitDescriptionPart(key, trait[key]);
	    }).filter(function (x) {
	        return x;
	    }).join(', ');
	}
	
	function traits(_ref2) {
	    var DOM = _ref2.DOM;
	    var inputValue$ = _ref2.value$;
	    var calculations = _ref2.calculations;
	
	    var allTraitViews = _modelsTrait2['default'].all().toArray().map(function (trait) {
	        return makeTraitView(trait, inputValue$, DOM, calculations);
	    });
	    var value$ = _cycleCore.Rx.Observable.from(allTraitViews).flatMap(function (traitView) {
	        return traitView.value$.map(function (value) {
	            return _defineProperty({}, traitView.key, !!value);
	        });
	    }).merge(inputValue$).scan(function (acc, modifier) {
	        return _Object$assign({}, acc, modifier);
	    }, {}).share();
	    return {
	        DOM: _cycleCore.Rx.Observable.combineLatest(allTraitViews.map(function (t) {
	            return t.DOM;
	        })).map(function (vTrees) {
	            return (0, _cycleDom.h)('div.traits', vTrees);
	        }),
	        value$: value$
	    };
	}
	
	module.exports = exports['default'];

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _cycleCore = __webpack_require__(2);
	
	function makeLocalStorageSourceDriver(keyName) {
	    return function () {
	        return _cycleCore.Rx.Observable['return'](localStorage.getItem(keyName));
	    };
	}
	
	function makeLocalStorageSinkDriver(keyName) {
	    return function (keyValue$) {
	        keyValue$.subscribe(function (keyValue) {
	            console.log('setting to ', keyValue);
	            localStorage.setItem(keyName, keyValue);
	        });
	    };
	}
	
	exports['default'] = {
	    makeLocalStorageSinkDriver: makeLocalStorageSinkDriver,
	    makeLocalStorageSourceDriver: makeLocalStorageSourceDriver
	};
	module.exports = exports['default'];

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.name = name;
	exports.plural = plural;
	exports.abbr = abbr;
	exports.description = description;
	
	var _constants = __webpack_require__(10);
	
	var LOCALE = _constants.LOCALIZATION['en-US'];
	
	function assertString(key) {
	    if (typeof key !== 'string') {
	        throw new TypeError('Expected ' + key + ' to be a string');
	    }
	}
	
	function getTranslationGroup(key) {
	    if (!key) {
	        return '';
	    }
	    assertString(key);
	    var value = LOCALE[key];
	    if (!value) {
	        throw new Error('Unknown localization: "' + key + '"');
	    }
	    return value;
	}
	
	function name(key) {
	    var translation = getTranslationGroup(key);
	    if (typeof translation === 'string') {
	        return translation;
	    }
	    return translation.name;
	}
	
	function plural(key) {
	    var translation = getTranslationGroup(key);
	    if (typeof translation === 'string') {
	        return translation;
	    }
	    return translation.plural || translation.name;
	}
	
	function abbr(key) {
	    var translation = getTranslationGroup(key);
	    if (typeof translation === 'string') {
	        return translation;
	    }
	    return translation.abbr || translation.name;
	}
	
	function description(key) {
	    var translation = getTranslationGroup(key);
	    if (typeof translation === 'string') {
	        return '';
	    }
	    return translation.description || '';
	}

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _toConsumableArray = __webpack_require__(79)['default'];
	
	var _slicedToArray = __webpack_require__(12)['default'];
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	var _Object$values = __webpack_require__(78)['default'];
	
	var _Object$entries = __webpack_require__(18)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _ref, _ref2;
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _withNiceToString = __webpack_require__(16);
	
	var _withNiceToString2 = _interopRequireDefault(_withNiceToString);
	
	var _constantsJson = __webpack_require__(10);
	
	var _When = __webpack_require__(76);
	
	var _When2 = _interopRequireDefault(_When);
	
	var _Equation = __webpack_require__(36);
	
	var _Equation2 = _interopRequireDefault(_Equation);
	
	var effectFields = {
	    $when: null,
	    $nearby: null
	};
	(_ref = ['poisonTypeA', 'poisonTypeB', 'poisonTypeD', 'rads', 'fire']).concat.apply(_ref, [_Object$keys(_constantsJson.PRIMARY_STATISTICS), _Object$keys(_constantsJson.SECONDARY_STATISTICS), _Object$keys(_constantsJson.SKILLS)].concat(_toConsumableArray(_Object$values(_constantsJson.SKILLS).map(function (skill) {
	    return _Object$keys(skill);
	})), [_Object$keys(_constantsJson.MISCELLANEOUS)])).forEach(function (key) {
	    effectFields[key] = 'value';
	});
	
	var VALID_KEYS = (_ref2 = []).concat.apply(_ref2, [_Object$keys(_constantsJson.PRIMARY_STATISTICS), _Object$keys(_constantsJson.SECONDARY_STATISTICS), _Object$keys(_constantsJson.SKILLS)].concat(_toConsumableArray(_Object$values(_constantsJson.SKILLS).map(function (skill) {
	    return _Object$keys(skill);
	})), [_Object$keys(_constantsJson.MISCELLANEOUS)])).reduce(function (acc, key) {
	    acc[key] = 'number';
	    return acc;
	}, {
	    race: 'string',
	    value: 'number'
	});
	
	function convertEffectValue(key, value, path) {
	    if (key === '$when') {
	        return new _When2['default']().mergeDeep({
	            conditions: _Object$entries(value).filter(function (_ref3) {
	                var _ref32 = _slicedToArray(_ref3, 1);
	
	                var conditionKey = _ref32[0];
	                return conditionKey !== 'otherwise';
	            }).reduce(function (acc, _ref4) {
	                var _ref42 = _slicedToArray(_ref4, 2);
	
	                var conditionKey = _ref42[0];
	                var conditionValue = _ref42[1];
	
	                acc[conditionKey] = Effect.from(conditionValue, path + '.' + conditionKey);
	                return acc;
	            }, {}),
	            otherwise: value.otherwise || new Effect()
	        });
	    }
	    if (key === '$nearby') {
	        return Effect.from(value, path);
	    }
	    if (!VALID_KEYS[key]) {
	        throw new Error('Unknown key: \'' + key + '\' at ' + path);
	    }
	    return (0, _Equation2['default'])(value, path, VALID_KEYS, VALID_KEYS[key]);
	}
	
	var Effect = (0, _withNiceToString2['default'])(_immutable2['default'].Record(effectFields, 'Effect'), effectFields);
	Effect.from = function (object, path) {
	    return new Effect().mergeDeep(_Object$entries(object || {}).reduce(function (acc, _ref5) {
	        var _ref52 = _slicedToArray(_ref5, 2);
	
	        var key = _ref52[0];
	        var value = _ref52[1];
	
	        acc[key] = convertEffectValue(key, value, path + '.' + key);
	        return acc;
	    }, {}));
	};
	exports['default'] = Effect;
	module.exports = exports['default'];

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _get = __webpack_require__(27)['default'];
	
	var _inherits = __webpack_require__(28)['default'];
	
	var _createClass = __webpack_require__(26)['default'];
	
	var _classCallCheck = __webpack_require__(19)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var RangeRecord = new _immutable2['default'].Record({
	    min: 0,
	    max: 0
	});
	
	var Range = (function (_RangeRecord) {
	    _inherits(Range, _RangeRecord);
	
	    function Range(min, max) {
	        _classCallCheck(this, Range);
	
	        _get(Object.getPrototypeOf(Range.prototype), 'constructor', this).call(this, {
	            min: min,
	            max: max
	        });
	    }
	
	    _createClass(Range, [{
	        key: 'toString',
	        value: function toString() {
	            return this.min + '..' + this.max;
	        }
	    }]);
	
	    return Range;
	})(RangeRecord);
	
	exports['default'] = Range;
	module.exports = exports['default'];

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	var _Object$assign = __webpack_require__(17)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _withLocalization = __webpack_require__(24);
	
	var _withLocalization2 = _interopRequireDefault(_withLocalization);
	
	var _withLookup = __webpack_require__(25);
	
	var _withLookup2 = _interopRequireDefault(_withLookup);
	
	var _withNiceToString = __webpack_require__(16);
	
	var _withNiceToString2 = _interopRequireDefault(_withNiceToString);
	
	var _Equation = __webpack_require__(36);
	
	var _Equation2 = _interopRequireDefault(_Equation);
	
	var _constantsJson = __webpack_require__(10);
	
	var fields = {
	    key: '',
	    value: 0,
	    percent: false
	};
	
	var VALID_KEYS = [].concat(_Object$keys(_constantsJson.PRIMARY_STATISTICS), _Object$keys(_constantsJson.SECONDARY_STATISTICS), _Object$keys(_constantsJson.MISCELLANEOUS)).reduce(function (acc, key) {
	    acc[key] = 'number';
	    return acc;
	}, {});
	
	exports['default'] = (0, _withNiceToString2['default'])((0, _withLookup2['default'])((0, _withLocalization2['default'])(_immutable2['default'].Record(fields, 'SecondaryStatistic')), {
	    get: function get(key) {
	        var stats = _constantsJson.SECONDARY_STATISTICS[key];
	        if (!stats) {
	            return null;
	        }
	        stats = _Object$assign({}, stats);
	        stats.value = (0, _Equation2['default'])(stats.value, 'SECONDARY_STATISTICS.' + key, VALID_KEYS, 'number');
	        return new this({
	            key: key
	        }).mergeDeep(stats);
	    },
	    all: function all() {
	        var _this = this;
	
	        return _immutable2['default'].Set(_Object$keys(_constantsJson.SECONDARY_STATISTICS).map(function (key) {
	            return _this.get(key);
	        }));
	    }
	}), fields);
	module.exports = exports['default'];

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _toConsumableArray = __webpack_require__(79)['default'];
	
	var _slicedToArray = __webpack_require__(12)['default'];
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	var _Object$values = __webpack_require__(78)['default'];
	
	var _Object$entries = __webpack_require__(18)['default'];
	
	var _Object$assign = __webpack_require__(17)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _withLocalization = __webpack_require__(24);
	
	var _withLocalization2 = _interopRequireDefault(_withLocalization);
	
	var _withLookup = __webpack_require__(25);
	
	var _withLookup2 = _interopRequireDefault(_withLookup);
	
	var _withNiceToString = __webpack_require__(16);
	
	var _withNiceToString2 = _interopRequireDefault(_withNiceToString);
	
	var _Equation = __webpack_require__(36);
	
	var _Equation2 = _interopRequireDefault(_Equation);
	
	var _constantsJson = __webpack_require__(10);
	
	var fields = {
	    key: '',
	    value: 0,
	    percent: false
	};
	
	var VALID_KEYS = [].concat(_Object$keys(_constantsJson.SKILLS), _Object$keys(_constantsJson.PRIMARY_STATISTICS)).reduce(function (acc, key) {
	    acc[key] = 'number';
	    return acc;
	}, {});
	
	exports['default'] = (0, _withNiceToString2['default'])((0, _withLookup2['default'])((0, _withLocalization2['default'])(_immutable2['default'].Record(fields, 'Skill')), {
	    get: function get(key) {
	        var _ref,
	            _this = this;
	
	        return (_ref = []).concat.apply(_ref, _toConsumableArray(_Object$values(_constantsJson.SKILLS).map(function (category) {
	            return _Object$entries(category);
	        }))).filter(function (_ref2) {
	            var _ref22 = _slicedToArray(_ref2, 1);
	
	            var skillName = _ref22[0];
	            return skillName === key;
	        }).map(function (_ref3) {
	            var _ref32 = _slicedToArray(_ref3, 2);
	
	            var skillName = _ref32[0];
	            var skill = _ref32[1];
	            return skill;
	        }).map(function (skill) {
	            skill = _Object$assign({}, skill);
	            skill.value = (0, _Equation2['default'])(skill.value, 'SKILLS.' + key + '.value', VALID_KEYS, 'number');
	            return new _this({
	                key: key
	            }).mergeDeep(skill);
	        })[0] || null;
	    },
	    all: function all() {
	        var _ref4,
	            _this2 = this;
	
	        return _immutable2['default'].Set((_ref4 = []).concat.apply(_ref4, _toConsumableArray(_Object$values(_constantsJson.SKILLS).map(function (category) {
	            return _Object$keys(category);
	        }))).map(function (key) {
	            return _this2.get(key);
	        }));
	    }
	}), fields);
	module.exports = exports['default'];

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _withLocalization = __webpack_require__(24);
	
	var _withLocalization2 = _interopRequireDefault(_withLocalization);
	
	var _withLookup = __webpack_require__(25);
	
	var _withLookup2 = _interopRequireDefault(_withLookup);
	
	var _withNiceToString = __webpack_require__(16);
	
	var _withNiceToString2 = _interopRequireDefault(_withNiceToString);
	
	var _Skill = __webpack_require__(181);
	
	var _Skill2 = _interopRequireDefault(_Skill);
	
	var _constantsJson = __webpack_require__(10);
	
	var fields = {
	    key: '',
	    skills: _immutable2['default'].Map()
	};
	exports['default'] = (0, _withNiceToString2['default'])((0, _withLookup2['default'])((0, _withLocalization2['default'])(_immutable2['default'].Record(fields, 'SkillCategory')), {
	    get: function get(key) {
	        var category = _constantsJson.SKILLS[key];
	        if (!category) {
	            return null;
	        }
	        return new this({
	            key: key
	        }).mergeDeep({
	            skills: _Object$keys(category).reduce(function (acc, key) {
	                acc[key] = _Skill2['default'].get(key);
	                return acc;
	            }, {})
	        });
	    },
	    all: function all() {
	        var _this = this;
	
	        return _immutable2['default'].Set(_Object$keys(_constantsJson.SKILLS).map(function (key) {
	            return _this.get(key);
	        }));
	    }
	}), fields);
	module.exports = exports['default'];

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	var _Object$assign = __webpack_require__(17)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _withLocalization = __webpack_require__(24);
	
	var _withLocalization2 = _interopRequireDefault(_withLocalization);
	
	var _withLookup = __webpack_require__(25);
	
	var _withLookup2 = _interopRequireDefault(_withLookup);
	
	var _withNiceToString = __webpack_require__(16);
	
	var _withNiceToString2 = _interopRequireDefault(_withNiceToString);
	
	var _Equation = __webpack_require__(36);
	
	var _Equation2 = _interopRequireDefault(_Equation);
	
	var _constantsJson = __webpack_require__(10);
	
	var _Effect = __webpack_require__(178);
	
	var _Effect2 = _interopRequireDefault(_Effect);
	
	var fields = {
	    key: '',
	    meta: '',
	    requirements: true,
	    effect: new _Effect2['default']()
	};
	
	var VALID_KEYS = [].concat().reduce(function (acc, key) {
	    acc[key] = 'number';
	    return acc;
	}, ['race'].concat(_Object$keys(_constantsJson.RACES)).reduce(function (acc, key) {
	    acc[key] = 'string';
	    return acc;
	}, {}));
	
	exports['default'] = (0, _withNiceToString2['default'])((0, _withLookup2['default'])((0, _withLocalization2['default'])(_immutable2['default'].Record(fields, 'Trait')), {
	    get: function get(key) {
	        var trait = _constantsJson.TRAITS[key];
	        if (!trait) {
	            return null;
	        }
	        trait = _Object$assign({}, trait);
	        var path = 'TRAITS.' + key;
	        var requirements = (0, _Equation2['default'])(trait.requirements, path + '.requirements', VALID_KEYS, 'boolean');
	        delete trait.requirements;
	        var meta = trait.meta || fields.meta;
	        delete trait.meta;
	        var effect = _Effect2['default'].from(trait, path);
	        return new this({
	            key: key
	        }).mergeDeep({
	            requirements: requirements,
	            effect: effect,
	            meta: meta
	        });
	    },
	    all: function all() {
	        var _this = this;
	
	        return _immutable2['default'].Set(_Object$keys(_constantsJson.TRAITS).map(function (key) {
	            return _this.get(key);
	        }));
	    }
	}), fields);
	module.exports = exports['default'];

/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _cycleCore = __webpack_require__(2);
	
	// Get the right animation frame method
	var requestAnimFrame = undefined;
	var cancelAnimFrame = undefined;
	var root = window;
	if (root.requestAnimationFrame) {
	    requestAnimFrame = root.requestAnimationFrame;
	    cancelAnimFrame = root.cancelAnimationFrame;
	} else if (root.mozRequestAnimationFrame) {
	    requestAnimFrame = root.mozRequestAnimationFrame;
	    cancelAnimFrame = root.mozCancelAnimationFrame;
	} else if (root.webkitRequestAnimationFrame) {
	    requestAnimFrame = root.webkitRequestAnimationFrame;
	    cancelAnimFrame = root.webkitCancelAnimationFrame;
	} else if (root.msRequestAnimationFrame) {
	    requestAnimFrame = root.msRequestAnimationFrame;
	    cancelAnimFrame = root.msCancelAnimationFrame;
	} else if (root.oRequestAnimationFrame) {
	    requestAnimFrame = root.oRequestAnimationFrame;
	    cancelAnimFrame = root.oCancelAnimationFrame;
	} else {
	    requestAnimFrame = function (cb) {
	        root.setTimeout(cb, 1000 / 60);
	    };
	    cancelAnimFrame = root.clearTimeout;
	}
	
	exports['default'] = (function () {
	
	    var currentTimer = null;
	    function scheduleNow(state, action) {
	        var scheduler = this;
	        var disposable = new _cycleCore.Rx.SingleAssignmentDisposable();
	        var id = requestAnimFrame(function () {
	            !disposable.isDisposed && disposable.setDisposable(action(scheduler, state));
	        });
	        return new _cycleCore.Rx.CompositeDisposable(disposable, _cycleCore.Rx.Disposable.create(function () {
	            cancelAnimFrame(id);
	        }));
	    }
	
	    function scheduleRelative(state, dueTime, action) {
	        var scheduler = this;
	        var dt = _cycleCore.Rx.Scheduler.normalize(dueTime);
	        if (dt === 0) {
	            return scheduler.scheduleWithState(state, action);
	        }
	        var disposable = new _cycleCore.Rx.SingleAssignmentDisposable();
	        var id = root.setTimeout(function () {
	            if (!disposable.isDisposed) {
	                disposable.setDisposable(action(scheduler, state));
	            }
	        }, dt);
	        return new _cycleCore.Rx.CompositeDisposable(disposable, _cycleCore.Rx.Disposable.create(function () {
	            root.clearTimeout(id);
	        }));
	    }
	
	    function scheduleAbsolute(state, dueTime, action) {
	        return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
	    }
	
	    return new _cycleCore.Rx.Scheduler(Date.now, scheduleNow, scheduleRelative, scheduleAbsolute);
	})();
	
	module.exports = exports['default'];

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(193), __esModule: true };

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(194), __esModule: true };

/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(196), __esModule: true };

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(199), __esModule: true };

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(201), __esModule: true };

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperty = __webpack_require__(44)["default"];
	
	exports["default"] = function (obj, key, value) {
	  if (key in obj) {
	    _Object$defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }
	
	  return obj;
	};
	
	exports.__esModule = true;

/***/ },
/* 191 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};
	
	    if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }
	
	    newObj["default"] = obj;
	    return newObj;
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(50);
	__webpack_require__(223);
	module.exports = __webpack_require__(4).Array.from;

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(94);
	__webpack_require__(50);
	module.exports = __webpack_require__(221);

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(94);
	__webpack_require__(50);
	module.exports = __webpack_require__(222);

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(225);
	module.exports = __webpack_require__(4).Object.assign;

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(9);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(9);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(229);
	module.exports = __webpack_require__(4).Object.entries;

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(9);
	__webpack_require__(226);
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $.getDesc(it, key);
	};

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(227);
	module.exports = __webpack_require__(4).Object.keys;

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(228);
	module.exports = __webpack_require__(4).Object.setPrototypeOf;

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(230);
	module.exports = __webpack_require__(4).Object.values;

/***/ },
/* 203 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var toObject = __webpack_require__(49)
	  , IObject  = __webpack_require__(85)
	  , enumKeys = __webpack_require__(205);
	/* eslint-disable no-unused-vars */
	module.exports = Object.assign || function assign(target, source){
	/* eslint-enable no-unused-vars */
	  var T = toObject(target)
	    , l = arguments.length
	    , i = 1;
	  while(l > i){
	    var S      = IObject(arguments[i++])
	      , keys   = enumKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)T[key = keys[j++]] = S[key];
	  }
	  return T;
	};

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var $ = __webpack_require__(9);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getSymbols = $.getSymbols;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = $.isEnum
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
	  }
	  return keys;
	};

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators = __webpack_require__(29)
	  , ITERATOR  = __webpack_require__(13)('iterator');
	module.exports = function(it){
	  return (Iterators.Array || Array.prototype[ITERATOR]) === it;
	};

/***/ },
/* 207 */
/***/ function(module, exports) {

	// Safari has buggy iterators w/o `next`
	module.exports = 'keys' in [] && !('next' in [].keys());

/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(45);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $ = __webpack_require__(9)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(37)(IteratorPrototype, __webpack_require__(13)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: __webpack_require__(90)(1,next)});
	  __webpack_require__(91)(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	var SYMBOL_ITERATOR = __webpack_require__(13)('iterator')
	  , SAFE_CLOSING    = false;
	try {
	  var riter = [7][SYMBOL_ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	module.exports = function(exec){
	  if(!SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[SYMBOL_ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[SYMBOL_ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 211 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 212 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(37);

/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc  = __webpack_require__(9).getDesc
	  , isObject = __webpack_require__(86)
	  , anObject = __webpack_require__(45);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
	    ? function(buggy, set){
	        try {
	          set = __webpack_require__(82)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	          set({}, []);
	        } catch(e){ buggy = true; }
	        return function setPrototypeOf(O, proto){
	          check(O, proto);
	          if(buggy)O.__proto__ = proto;
	          else set(O, proto);
	          return O;
	        };
	      }()
	    : undefined),
	  check: check
	};

/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(47)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	// true  -> String#at
	// false -> String#codePointAt
	var toInteger = __webpack_require__(92)
	  , defined   = __webpack_require__(46);
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l
	      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	        ? TO_STRING ? s.charAt(i) : a
	        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(83)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(92)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 219 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 220 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(45)
	  , get      = __webpack_require__(93);
	module.exports = __webpack_require__(4).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(80)
	  , ITERATOR  = __webpack_require__(13)('iterator')
	  , Iterators = __webpack_require__(29);
	module.exports = __webpack_require__(4).isIterable = function(it){
	  var O = Object(it);
	  return ITERATOR in O || '@@iterator' in O || Iterators.hasOwnProperty(classof(O));
	};

/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx         = __webpack_require__(82)
	  , $def        = __webpack_require__(20)
	  , toObject    = __webpack_require__(49)
	  , call        = __webpack_require__(208)
	  , isArrayIter = __webpack_require__(206)
	  , toLength    = __webpack_require__(218)
	  , getIterFn   = __webpack_require__(93);
	$def($def.S + $def.F * !__webpack_require__(210)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , mapfn   = arguments[1]
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, arguments[2], 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
	      }
	    } else {
	      for(result = new C(length = toLength(O.length)); length > index; index++){
	        result[index] = mapping ? mapfn(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});

/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var setUnscope = __webpack_require__(220)
	  , step       = __webpack_require__(211)
	  , Iterators  = __webpack_require__(29)
	  , toIObject  = __webpack_require__(48);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	__webpack_require__(87)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	setUnscope('keys');
	setUnscope('values');
	setUnscope('entries');

/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $def = __webpack_require__(20);
	$def($def.S, 'Object', {assign: __webpack_require__(204)});

/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(48);
	
	__webpack_require__(88)('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(49);
	
	__webpack_require__(88)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $def = __webpack_require__(20);
	$def($def.S, 'Object', {setPrototypeOf: __webpack_require__(214).set});

/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	// http://goo.gl/XkBrjD
	var $def     = __webpack_require__(20)
	  , $entries = __webpack_require__(89)(true);
	
	$def($def.S, 'Object', {
	  entries: function entries(it){
	    return $entries(it);
	  }
	});

/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	// http://goo.gl/XkBrjD
	var $def    = __webpack_require__(20)
	  , $values = __webpack_require__(89)(false);
	
	$def($def.S, 'Object', {
	  values: function values(it){
	    return $values(it);
	  }
	});

/***/ },
/* 231 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 232 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
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
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            currentQueue[queueIndex].run();
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
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
	        setTimeout(drainQueue, 0);
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
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 233 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {

	'use strict';
	
	module.exports = __webpack_require__(__webpack_module_template_argument_0__)() ? Symbol : __webpack_require__(__webpack_module_template_argument_1__);


/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Object$keys = __webpack_require__(3)['default'];
	
	var _interopRequireDefault = __webpack_require__(1)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _immutable = __webpack_require__(5);
	
	var _immutable2 = _interopRequireDefault(_immutable);
	
	var _Range = __webpack_require__(179);
	
	var _Range2 = _interopRequireDefault(_Range);
	
	var _withLocalization = __webpack_require__(24);
	
	var _withLocalization2 = _interopRequireDefault(_withLocalization);
	
	var _withLookup = __webpack_require__(25);
	
	var _withLookup2 = _interopRequireDefault(_withLookup);
	
	var _withNiceToString = __webpack_require__(16);
	
	var _withNiceToString2 = _interopRequireDefault(_withNiceToString);
	
	var _constantsJson = __webpack_require__(10);
	
	var _Equation = __webpack_require__(36);
	
	var _Equation2 = _interopRequireDefault(_Equation);
	
	var _Effect = __webpack_require__(178);
	
	var _Effect2 = _interopRequireDefault(_Effect);
	
	var fields = {
	    key: ''
	};
	exports['default'] = (0, _withLookup2['default'])((0, _withNiceToString2['default'])((0, _withLocalization2['default'])(_immutable2['default'].Record(fields, 'Condition')), fields), {
	    get: function get(key) {
	        var stats = _constantsJson.CONDITIONS[key];
	        if (!stats) {
	            return null;
	        }
	        return new this({
	            key: key
	        }).mergeDeep(stats);
	    },
	    getOrDefault: function getOrDefault(key) {
	        return this.get(key) || new this();
	    },
	    all: function all() {
	        var _this = this;
	
	        return _immutable2['default'].Set(_Object$keys(_constantsJson.CONDITIONS).map(function (key) {
	            return _this.get(key);
	        }));
	    }
	});
	module.exports = exports['default'];

/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = __webpack_require__(191)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _cycleDom = __webpack_require__(6);
	
	var _localize = __webpack_require__(177);
	
	var localize = _interopRequireWildcard(_localize);
	
	exports['default'] = function (key, className) {
	    var fullClassName = '.ref-' + key + (className ? '.' + className : '');
	    var name = localize.name(key);
	    var abbr = localize.abbr(key);
	    var vTree = name === abbr ? (0, _cycleDom.h)('span' + fullClassName, [name]) : (0, _cycleDom.h)('abbr' + fullClassName, {
	        title: name
	    }, [abbr]);
	    return vTree;
	};
	
	module.exports = exports['default'];

/***/ }
/******/ ])))
});
;
//# sourceMappingURL=app.js.map