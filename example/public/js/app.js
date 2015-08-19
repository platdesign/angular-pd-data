(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';



var app = angular.module('app', [
	require('../../../').name,
	require('../../../src/adapters/http.js').name
]);


app.run(['Data', '$rootScope', 'pdDataAdapterHttp', function(Data, $rootScope, $httpAdapter) {

	var backend = Data.createStore({

	});


	backend.connect('api', {
		adapter: $httpAdapter,
		options: {
			baseUrl: 'http://localhost:4000'
		}
	});



	var Video = backend.defineResource({
		name: 'Video',
		path: 'videos',

		model: {
			primary: 'id',

			relations: {
				hasMany: {
					Cue: {
						field: 'cues',
						identifier: 'videoId'
					}
				}
			},

			methods: {
				start: function() {
					console.log(this);
				}
			}
		},

		collection: {
			methods: {
				huhu: function() {
					console.log(this)
				}
			}
		}
	});

	var Cue = backend.defineResource({
		name: 'Cue',
		path: 'cues',

		model: {
			primary: 'id'
		}
	});




	$rootScope.videos = Video.find();
	$rootScope.videos2 = Video.find({ title: 'a' });

	$rootScope.videos.load();

	$rootScope.cues = Cue.find();

	$rootScope.cues.load();


	$rootScope.store = backend;
}]);

},{"../../../":2,"../../../src/adapters/http.js":25}],2:[function(require,module,exports){
'use strict';


module.exports = require('./src/pd-data/pd-data.js');

},{"./src/pd-data/pd-data.js":26}],3:[function(require,module,exports){
(function (global){
(function() {
  var Bacon, BufferingSource, Bus, CompositeUnsubscribe, ConsumingSource, Desc, Dispatcher, End, Error, Event, EventStream, Exception, Initial, Next, None, Observable, Property, PropertyDispatcher, Some, Source, UpdateBarrier, _, addPropertyInitValueToStream, argumentsToObservables, argumentsToObservablesAndFunction, assert, assertArray, assertEventStream, assertFunction, assertNoArguments, assertObservable, assertObservableIsProperty, assertString, cloneArray, constantToFunction, containsDuplicateDeps, convertArgsToFunction, describe, endEvent, eventIdCounter, eventMethods, findDeps, findHandlerMethods, flatMap_, former, idCounter, initialEvent, isArray, isFieldKey, isObservable, latter, liftCallback, makeFunction, makeFunctionArgs, makeFunction_, makeObservable, makeSpawner, nextEvent, nop, partiallyApplied, recursionDepth, ref, registerObs, spys, toCombinator, toEvent, toFieldExtractor, toFieldKey, toOption, toSimpleExtractor, valueAndEnd, withDesc, withMethodCallSupport,
    hasProp = {}.hasOwnProperty,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    slice = [].slice,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Bacon = {
    toString: function() {
      return "Bacon";
    }
  };

  Bacon.version = '0.7.71';

  Exception = (typeof global !== "undefined" && global !== null ? global : this).Error;

  nop = function() {};

  latter = function(_, x) {
    return x;
  };

  former = function(x, _) {
    return x;
  };

  cloneArray = function(xs) {
    return xs.slice(0);
  };

  assert = function(message, condition) {
    if (!condition) {
      throw new Exception(message);
    }
  };

  assertObservableIsProperty = function(x) {
    if (x instanceof Observable && !(x instanceof Property)) {
      throw new Exception("Observable is not a Property : " + x);
    }
  };

  assertEventStream = function(event) {
    if (!(event instanceof EventStream)) {
      throw new Exception("not an EventStream : " + event);
    }
  };

  assertObservable = function(event) {
    if (!(event instanceof Observable)) {
      throw new Exception("not an Observable : " + event);
    }
  };

  assertFunction = function(f) {
    return assert("not a function : " + f, _.isFunction(f));
  };

  isArray = function(xs) {
    return xs instanceof Array;
  };

  isObservable = function(x) {
    return x instanceof Observable;
  };

  assertArray = function(xs) {
    if (!isArray(xs)) {
      throw new Exception("not an array : " + xs);
    }
  };

  assertNoArguments = function(args) {
    return assert("no arguments supported", args.length === 0);
  };

  assertString = function(x) {
    if (typeof x !== "string") {
      throw new Exception("not a string : " + x);
    }
  };

  _ = {
    indexOf: Array.prototype.indexOf ? function(xs, x) {
      return xs.indexOf(x);
    } : function(xs, x) {
      var i, j, len1, y;
      for (i = j = 0, len1 = xs.length; j < len1; i = ++j) {
        y = xs[i];
        if (x === y) {
          return i;
        }
      }
      return -1;
    },
    indexWhere: function(xs, f) {
      var i, j, len1, y;
      for (i = j = 0, len1 = xs.length; j < len1; i = ++j) {
        y = xs[i];
        if (f(y)) {
          return i;
        }
      }
      return -1;
    },
    head: function(xs) {
      return xs[0];
    },
    always: function(x) {
      return function() {
        return x;
      };
    },
    negate: function(f) {
      return function(x) {
        return !f(x);
      };
    },
    empty: function(xs) {
      return xs.length === 0;
    },
    tail: function(xs) {
      return xs.slice(1, xs.length);
    },
    filter: function(f, xs) {
      var filtered, j, len1, x;
      filtered = [];
      for (j = 0, len1 = xs.length; j < len1; j++) {
        x = xs[j];
        if (f(x)) {
          filtered.push(x);
        }
      }
      return filtered;
    },
    map: function(f, xs) {
      var j, len1, results, x;
      results = [];
      for (j = 0, len1 = xs.length; j < len1; j++) {
        x = xs[j];
        results.push(f(x));
      }
      return results;
    },
    each: function(xs, f) {
      var key, value;
      for (key in xs) {
        if (!hasProp.call(xs, key)) continue;
        value = xs[key];
        f(key, value);
      }
      return void 0;
    },
    toArray: function(xs) {
      if (isArray(xs)) {
        return xs;
      } else {
        return [xs];
      }
    },
    contains: function(xs, x) {
      return _.indexOf(xs, x) !== -1;
    },
    id: function(x) {
      return x;
    },
    last: function(xs) {
      return xs[xs.length - 1];
    },
    all: function(xs, f) {
      var j, len1, x;
      if (f == null) {
        f = _.id;
      }
      for (j = 0, len1 = xs.length; j < len1; j++) {
        x = xs[j];
        if (!f(x)) {
          return false;
        }
      }
      return true;
    },
    any: function(xs, f) {
      var j, len1, x;
      if (f == null) {
        f = _.id;
      }
      for (j = 0, len1 = xs.length; j < len1; j++) {
        x = xs[j];
        if (f(x)) {
          return true;
        }
      }
      return false;
    },
    without: function(x, xs) {
      return _.filter((function(y) {
        return y !== x;
      }), xs);
    },
    remove: function(x, xs) {
      var i;
      i = _.indexOf(xs, x);
      if (i >= 0) {
        return xs.splice(i, 1);
      }
    },
    fold: function(xs, seed, f) {
      var j, len1, x;
      for (j = 0, len1 = xs.length; j < len1; j++) {
        x = xs[j];
        seed = f(seed, x);
      }
      return seed;
    },
    flatMap: function(f, xs) {
      return _.fold(xs, [], (function(ys, x) {
        return ys.concat(f(x));
      }));
    },
    cached: function(f) {
      var value;
      value = None;
      return function() {
        if (value === None) {
          value = f();
          f = void 0;
        }
        return value;
      };
    },
    isFunction: function(f) {
      return typeof f === "function";
    },
    toString: function(obj) {
      var ex, internals, key, value;
      try {
        recursionDepth++;
        if (obj == null) {
          return "undefined";
        } else if (_.isFunction(obj)) {
          return "function";
        } else if (isArray(obj)) {
          if (recursionDepth > 5) {
            return "[..]";
          }
          return "[" + _.map(_.toString, obj).toString() + "]";
        } else if (((obj != null ? obj.toString : void 0) != null) && obj.toString !== Object.prototype.toString) {
          return obj.toString();
        } else if (typeof obj === "object") {
          if (recursionDepth > 5) {
            return "{..}";
          }
          internals = (function() {
            var results;
            results = [];
            for (key in obj) {
              if (!hasProp.call(obj, key)) continue;
              value = (function() {
                try {
                  return obj[key];
                } catch (_error) {
                  ex = _error;
                  return ex;
                }
              })();
              results.push(_.toString(key) + ":" + _.toString(value));
            }
            return results;
          })();
          return "{" + internals + "}";
        } else {
          return obj;
        }
      } finally {
        recursionDepth--;
      }
    }
  };

  recursionDepth = 0;

  Bacon._ = _;

  UpdateBarrier = Bacon.UpdateBarrier = (function() {
    var afterTransaction, afters, aftersIndex, currentEventId, flush, flushDepsOf, flushWaiters, hasWaiters, inTransaction, rootEvent, waiterObs, waiters, whenDoneWith, wrappedSubscribe;
    rootEvent = void 0;
    waiterObs = [];
    waiters = {};
    afters = [];
    aftersIndex = 0;
    afterTransaction = function(f) {
      if (rootEvent) {
        return afters.push(f);
      } else {
        return f();
      }
    };
    whenDoneWith = function(obs, f) {
      var obsWaiters;
      if (rootEvent) {
        obsWaiters = waiters[obs.id];
        if (obsWaiters == null) {
          obsWaiters = waiters[obs.id] = [f];
          return waiterObs.push(obs);
        } else {
          return obsWaiters.push(f);
        }
      } else {
        return f();
      }
    };
    flush = function() {
      while (waiterObs.length > 0) {
        flushWaiters(0);
      }
      return void 0;
    };
    flushWaiters = function(index) {
      var f, j, len1, obs, obsId, obsWaiters;
      obs = waiterObs[index];
      obsId = obs.id;
      obsWaiters = waiters[obsId];
      waiterObs.splice(index, 1);
      delete waiters[obsId];
      flushDepsOf(obs);
      for (j = 0, len1 = obsWaiters.length; j < len1; j++) {
        f = obsWaiters[j];
        f();
      }
      return void 0;
    };
    flushDepsOf = function(obs) {
      var dep, deps, index, j, len1;
      deps = obs.internalDeps();
      for (j = 0, len1 = deps.length; j < len1; j++) {
        dep = deps[j];
        flushDepsOf(dep);
        if (waiters[dep.id]) {
          index = _.indexOf(waiterObs, dep);
          flushWaiters(index);
        }
      }
      return void 0;
    };
    inTransaction = function(event, context, f, args) {
      var after, result;
      if (rootEvent) {
        return f.apply(context, args);
      } else {
        rootEvent = event;
        try {
          result = f.apply(context, args);
          flush();
        } finally {
          rootEvent = void 0;
          while (aftersIndex < afters.length) {
            after = afters[aftersIndex];
            aftersIndex++;
            after();
          }
          aftersIndex = 0;
          afters = [];
        }
        return result;
      }
    };
    currentEventId = function() {
      if (rootEvent) {
        return rootEvent.id;
      } else {
        return void 0;
      }
    };
    wrappedSubscribe = function(obs, sink) {
      var doUnsub, shouldUnsub, unsub, unsubd;
      unsubd = false;
      shouldUnsub = false;
      doUnsub = function() {
        return shouldUnsub = true;
      };
      unsub = function() {
        unsubd = true;
        return doUnsub();
      };
      doUnsub = obs.dispatcher.subscribe(function(event) {
        return afterTransaction(function() {
          var reply;
          if (!unsubd) {
            reply = sink(event);
            if (reply === Bacon.noMore) {
              return unsub();
            }
          }
        });
      });
      if (shouldUnsub) {
        doUnsub();
      }
      return unsub;
    };
    hasWaiters = function() {
      return waiterObs.length > 0;
    };
    return {
      whenDoneWith: whenDoneWith,
      hasWaiters: hasWaiters,
      inTransaction: inTransaction,
      currentEventId: currentEventId,
      wrappedSubscribe: wrappedSubscribe,
      afterTransaction: afterTransaction
    };
  })();

  Source = (function() {
    function Source(obs1, sync, lazy1) {
      this.obs = obs1;
      this.sync = sync;
      this.lazy = lazy1 != null ? lazy1 : false;
      this.queue = [];
    }

    Source.prototype.subscribe = function(sink) {
      return this.obs.dispatcher.subscribe(sink);
    };

    Source.prototype.toString = function() {
      return this.obs.toString();
    };

    Source.prototype.markEnded = function() {
      return this.ended = true;
    };

    Source.prototype.consume = function() {
      if (this.lazy) {
        return {
          value: _.always(this.queue[0])
        };
      } else {
        return this.queue[0];
      }
    };

    Source.prototype.push = function(x) {
      return this.queue = [x];
    };

    Source.prototype.mayHave = function() {
      return true;
    };

    Source.prototype.hasAtLeast = function() {
      return this.queue.length;
    };

    Source.prototype.flatten = true;

    return Source;

  })();

  ConsumingSource = (function(superClass) {
    extend(ConsumingSource, superClass);

    function ConsumingSource() {
      return ConsumingSource.__super__.constructor.apply(this, arguments);
    }

    ConsumingSource.prototype.consume = function() {
      return this.queue.shift();
    };

    ConsumingSource.prototype.push = function(x) {
      return this.queue.push(x);
    };

    ConsumingSource.prototype.mayHave = function(c) {
      return !this.ended || this.queue.length >= c;
    };

    ConsumingSource.prototype.hasAtLeast = function(c) {
      return this.queue.length >= c;
    };

    ConsumingSource.prototype.flatten = false;

    return ConsumingSource;

  })(Source);

  BufferingSource = (function(superClass) {
    extend(BufferingSource, superClass);

    function BufferingSource(obs) {
      BufferingSource.__super__.constructor.call(this, obs, true);
    }

    BufferingSource.prototype.consume = function() {
      var values;
      values = this.queue;
      this.queue = [];
      return {
        value: function() {
          return values;
        }
      };
    };

    BufferingSource.prototype.push = function(x) {
      return this.queue.push(x.value());
    };

    BufferingSource.prototype.hasAtLeast = function() {
      return true;
    };

    return BufferingSource;

  })(Source);

  Source.isTrigger = function(s) {
    if (s instanceof Source) {
      return s.sync;
    } else {
      return s instanceof EventStream;
    }
  };

  Source.fromObservable = function(s) {
    if (s instanceof Source) {
      return s;
    } else if (s instanceof Property) {
      return new Source(s, false);
    } else {
      return new ConsumingSource(s, true);
    }
  };

  Desc = (function() {
    function Desc(context1, method1, args1) {
      this.context = context1;
      this.method = method1;
      this.args = args1;
    }

    Desc.prototype.deps = function() {
      return this.cached || (this.cached = findDeps([this.context].concat(this.args)));
    };

    Desc.prototype.toString = function() {
      return _.toString(this.context) + "." + _.toString(this.method) + "(" + _.map(_.toString, this.args) + ")";
    };

    return Desc;

  })();

  describe = function() {
    var args, context, method;
    context = arguments[0], method = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
    if ((context || method) instanceof Desc) {
      return context || method;
    } else {
      return new Desc(context, method, args);
    }
  };

  withDesc = function(desc, obs) {
    obs.desc = desc;
    return obs;
  };

  findDeps = function(x) {
    if (isArray(x)) {
      return _.flatMap(findDeps, x);
    } else if (isObservable(x)) {
      return [x];
    } else if (x instanceof Source) {
      return [x.obs];
    } else {
      return [];
    }
  };

  Bacon.Desc = Desc;

  Bacon.Desc.empty = new Bacon.Desc("", "", []);

  withMethodCallSupport = function(wrapped) {
    return function() {
      var args, context, f, methodName;
      f = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (typeof f === "object" && args.length) {
        context = f;
        methodName = args[0];
        f = function() {
          return context[methodName].apply(context, arguments);
        };
        args = args.slice(1);
      }
      return wrapped.apply(null, [f].concat(slice.call(args)));
    };
  };

  makeFunctionArgs = function(args) {
    args = Array.prototype.slice.call(args);
    return makeFunction_.apply(null, args);
  };

  partiallyApplied = function(f, applied) {
    return function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return f.apply(null, applied.concat(args));
    };
  };

  toSimpleExtractor = function(args) {
    return function(key) {
      return function(value) {
        var fieldValue;
        if (value == null) {
          return void 0;
        } else {
          fieldValue = value[key];
          if (_.isFunction(fieldValue)) {
            return fieldValue.apply(value, args);
          } else {
            return fieldValue;
          }
        }
      };
    };
  };

  toFieldExtractor = function(f, args) {
    var partFuncs, parts;
    parts = f.slice(1).split(".");
    partFuncs = _.map(toSimpleExtractor(args), parts);
    return function(value) {
      var j, len1;
      for (j = 0, len1 = partFuncs.length; j < len1; j++) {
        f = partFuncs[j];
        value = f(value);
      }
      return value;
    };
  };

  isFieldKey = function(f) {
    return (typeof f === "string") && f.length > 1 && f.charAt(0) === ".";
  };

  makeFunction_ = withMethodCallSupport(function() {
    var args, f;
    f = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (_.isFunction(f)) {
      if (args.length) {
        return partiallyApplied(f, args);
      } else {
        return f;
      }
    } else if (isFieldKey(f)) {
      return toFieldExtractor(f, args);
    } else {
      return _.always(f);
    }
  });

  makeFunction = function(f, args) {
    return makeFunction_.apply(null, [f].concat(slice.call(args)));
  };

  convertArgsToFunction = function(obs, f, args, method) {
    var sampled;
    if (f instanceof Property) {
      sampled = f.sampledBy(obs, function(p, s) {
        return [p, s];
      });
      return method.call(sampled, function(arg) {
        var p, s;
        p = arg[0], s = arg[1];
        return p;
      }).map(function(arg) {
        var p, s;
        p = arg[0], s = arg[1];
        return s;
      });
    } else {
      f = makeFunction(f, args);
      return method.call(obs, f);
    }
  };

  toCombinator = function(f) {
    var key;
    if (_.isFunction(f)) {
      return f;
    } else if (isFieldKey(f)) {
      key = toFieldKey(f);
      return function(left, right) {
        return left[key](right);
      };
    } else {
      throw new Exception("not a function or a field key: " + f);
    }
  };

  toFieldKey = function(f) {
    return f.slice(1);
  };

  Some = (function() {
    function Some(value1) {
      this.value = value1;
    }

    Some.prototype.getOrElse = function() {
      return this.value;
    };

    Some.prototype.get = function() {
      return this.value;
    };

    Some.prototype.filter = function(f) {
      if (f(this.value)) {
        return new Some(this.value);
      } else {
        return None;
      }
    };

    Some.prototype.map = function(f) {
      return new Some(f(this.value));
    };

    Some.prototype.forEach = function(f) {
      return f(this.value);
    };

    Some.prototype.isDefined = true;

    Some.prototype.toArray = function() {
      return [this.value];
    };

    Some.prototype.inspect = function() {
      return "Some(" + this.value + ")";
    };

    Some.prototype.toString = function() {
      return this.inspect();
    };

    return Some;

  })();

  None = {
    getOrElse: function(value) {
      return value;
    },
    filter: function() {
      return None;
    },
    map: function() {
      return None;
    },
    forEach: function() {},
    isDefined: false,
    toArray: function() {
      return [];
    },
    inspect: function() {
      return "None";
    },
    toString: function() {
      return this.inspect();
    }
  };

  toOption = function(v) {
    if (v instanceof Some || v === None) {
      return v;
    } else {
      return new Some(v);
    }
  };

  Bacon.noMore = ["<no-more>"];

  Bacon.more = ["<more>"];

  eventIdCounter = 0;

  Event = (function() {
    function Event() {
      this.id = ++eventIdCounter;
    }

    Event.prototype.isEvent = function() {
      return true;
    };

    Event.prototype.isEnd = function() {
      return false;
    };

    Event.prototype.isInitial = function() {
      return false;
    };

    Event.prototype.isNext = function() {
      return false;
    };

    Event.prototype.isError = function() {
      return false;
    };

    Event.prototype.hasValue = function() {
      return false;
    };

    Event.prototype.filter = function() {
      return true;
    };

    Event.prototype.inspect = function() {
      return this.toString();
    };

    Event.prototype.log = function() {
      return this.toString();
    };

    return Event;

  })();

  Next = (function(superClass) {
    extend(Next, superClass);

    function Next(valueF, eager) {
      Next.__super__.constructor.call(this);
      if (!eager && _.isFunction(valueF) || valueF instanceof Next) {
        this.valueF = valueF;
        this.valueInternal = void 0;
      } else {
        this.valueF = void 0;
        this.valueInternal = valueF;
      }
    }

    Next.prototype.isNext = function() {
      return true;
    };

    Next.prototype.hasValue = function() {
      return true;
    };

    Next.prototype.value = function() {
      if (this.valueF instanceof Next) {
        this.valueInternal = this.valueF.value();
        this.valueF = void 0;
      } else if (this.valueF) {
        this.valueInternal = this.valueF();
        this.valueF = void 0;
      }
      return this.valueInternal;
    };

    Next.prototype.fmap = function(f) {
      var event, value;
      if (this.valueInternal) {
        value = this.valueInternal;
        return this.apply(function() {
          return f(value);
        });
      } else {
        event = this;
        return this.apply(function() {
          return f(event.value());
        });
      }
    };

    Next.prototype.apply = function(value) {
      return new Next(value);
    };

    Next.prototype.filter = function(f) {
      return f(this.value());
    };

    Next.prototype.toString = function() {
      return _.toString(this.value());
    };

    Next.prototype.log = function() {
      return this.value();
    };

    return Next;

  })(Event);

  Initial = (function(superClass) {
    extend(Initial, superClass);

    function Initial() {
      return Initial.__super__.constructor.apply(this, arguments);
    }

    Initial.prototype.isInitial = function() {
      return true;
    };

    Initial.prototype.isNext = function() {
      return false;
    };

    Initial.prototype.apply = function(value) {
      return new Initial(value);
    };

    Initial.prototype.toNext = function() {
      return new Next(this);
    };

    return Initial;

  })(Next);

  End = (function(superClass) {
    extend(End, superClass);

    function End() {
      return End.__super__.constructor.apply(this, arguments);
    }

    End.prototype.isEnd = function() {
      return true;
    };

    End.prototype.fmap = function() {
      return this;
    };

    End.prototype.apply = function() {
      return this;
    };

    End.prototype.toString = function() {
      return "<end>";
    };

    return End;

  })(Event);

  Error = (function(superClass) {
    extend(Error, superClass);

    function Error(error1) {
      this.error = error1;
    }

    Error.prototype.isError = function() {
      return true;
    };

    Error.prototype.fmap = function() {
      return this;
    };

    Error.prototype.apply = function() {
      return this;
    };

    Error.prototype.toString = function() {
      return "<error> " + _.toString(this.error);
    };

    return Error;

  })(Event);

  Bacon.Event = Event;

  Bacon.Initial = Initial;

  Bacon.Next = Next;

  Bacon.End = End;

  Bacon.Error = Error;

  initialEvent = function(value) {
    return new Initial(value, true);
  };

  nextEvent = function(value) {
    return new Next(value, true);
  };

  endEvent = function() {
    return new End();
  };

  toEvent = function(x) {
    if (x instanceof Event) {
      return x;
    } else {
      return nextEvent(x);
    }
  };

  idCounter = 0;

  registerObs = function() {};

  Observable = (function() {
    function Observable(desc1) {
      this.desc = desc1;
      this.id = ++idCounter;
      this.initialDesc = this.desc;
    }

    Observable.prototype.subscribe = function(sink) {
      return UpdateBarrier.wrappedSubscribe(this, sink);
    };

    Observable.prototype.subscribeInternal = function(sink) {
      return this.dispatcher.subscribe(sink);
    };

    Observable.prototype.onValue = function() {
      var f;
      f = makeFunctionArgs(arguments);
      return this.subscribe(function(event) {
        if (event.hasValue()) {
          return f(event.value());
        }
      });
    };

    Observable.prototype.onValues = function(f) {
      return this.onValue(function(args) {
        return f.apply(null, args);
      });
    };

    Observable.prototype.onError = function() {
      var f;
      f = makeFunctionArgs(arguments);
      return this.subscribe(function(event) {
        if (event.isError()) {
          return f(event.error);
        }
      });
    };

    Observable.prototype.onEnd = function() {
      var f;
      f = makeFunctionArgs(arguments);
      return this.subscribe(function(event) {
        if (event.isEnd()) {
          return f();
        }
      });
    };

    Observable.prototype.name = function(name) {
      this._name = name;
      return this;
    };

    Observable.prototype.withDescription = function() {
      this.desc = describe.apply(null, arguments);
      return this;
    };

    Observable.prototype.toString = function() {
      if (this._name) {
        return this._name;
      } else {
        return this.desc.toString();
      }
    };

    Observable.prototype.internalDeps = function() {
      return this.initialDesc.deps();
    };

    return Observable;

  })();

  Observable.prototype.assign = Observable.prototype.onValue;

  Observable.prototype.forEach = Observable.prototype.onValue;

  Observable.prototype.inspect = Observable.prototype.toString;

  Bacon.Observable = Observable;

  CompositeUnsubscribe = (function() {
    function CompositeUnsubscribe(ss) {
      var j, len1, s;
      if (ss == null) {
        ss = [];
      }
      this.unsubscribe = bind(this.unsubscribe, this);
      this.unsubscribed = false;
      this.subscriptions = [];
      this.starting = [];
      for (j = 0, len1 = ss.length; j < len1; j++) {
        s = ss[j];
        this.add(s);
      }
    }

    CompositeUnsubscribe.prototype.add = function(subscription) {
      var ended, unsub, unsubMe;
      if (this.unsubscribed) {
        return;
      }
      ended = false;
      unsub = nop;
      this.starting.push(subscription);
      unsubMe = (function(_this) {
        return function() {
          if (_this.unsubscribed) {
            return;
          }
          ended = true;
          _this.remove(unsub);
          return _.remove(subscription, _this.starting);
        };
      })(this);
      unsub = subscription(this.unsubscribe, unsubMe);
      if (!(this.unsubscribed || ended)) {
        this.subscriptions.push(unsub);
      } else {
        unsub();
      }
      _.remove(subscription, this.starting);
      return unsub;
    };

    CompositeUnsubscribe.prototype.remove = function(unsub) {
      if (this.unsubscribed) {
        return;
      }
      if ((_.remove(unsub, this.subscriptions)) !== void 0) {
        return unsub();
      }
    };

    CompositeUnsubscribe.prototype.unsubscribe = function() {
      var j, len1, ref, s;
      if (this.unsubscribed) {
        return;
      }
      this.unsubscribed = true;
      ref = this.subscriptions;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        s = ref[j];
        s();
      }
      this.subscriptions = [];
      return this.starting = [];
    };

    CompositeUnsubscribe.prototype.count = function() {
      if (this.unsubscribed) {
        return 0;
      }
      return this.subscriptions.length + this.starting.length;
    };

    CompositeUnsubscribe.prototype.empty = function() {
      return this.count() === 0;
    };

    return CompositeUnsubscribe;

  })();

  Bacon.CompositeUnsubscribe = CompositeUnsubscribe;

  Dispatcher = (function() {
    Dispatcher.prototype.pushing = false;

    Dispatcher.prototype.ended = false;

    Dispatcher.prototype.prevError = void 0;

    Dispatcher.prototype.unsubSrc = void 0;

    function Dispatcher(_subscribe, _handleEvent) {
      this._subscribe = _subscribe;
      this._handleEvent = _handleEvent;
      this.subscribe = bind(this.subscribe, this);
      this.handleEvent = bind(this.handleEvent, this);
      this.subscriptions = [];
      this.queue = [];
    }

    Dispatcher.prototype.hasSubscribers = function() {
      return this.subscriptions.length > 0;
    };

    Dispatcher.prototype.removeSub = function(subscription) {
      return this.subscriptions = _.without(subscription, this.subscriptions);
    };

    Dispatcher.prototype.push = function(event) {
      if (event.isEnd()) {
        this.ended = true;
      }
      return UpdateBarrier.inTransaction(event, this, this.pushIt, [event]);
    };

    Dispatcher.prototype.pushToSubscriptions = function(event) {
      var e, j, len1, reply, sub, tmp;
      try {
        tmp = this.subscriptions;
        for (j = 0, len1 = tmp.length; j < len1; j++) {
          sub = tmp[j];
          reply = sub.sink(event);
          if (reply === Bacon.noMore || event.isEnd()) {
            this.removeSub(sub);
          }
        }
        return true;
      } catch (_error) {
        e = _error;
        this.pushing = false;
        this.queue = [];
        throw e;
      }
    };

    Dispatcher.prototype.pushIt = function(event) {
      if (!this.pushing) {
        if (event === this.prevError) {
          return;
        }
        if (event.isError()) {
          this.prevError = event;
        }
        this.pushing = true;
        this.pushToSubscriptions(event);
        this.pushing = false;
        while (this.queue.length) {
          event = this.queue.shift();
          this.push(event);
        }
        if (this.hasSubscribers()) {
          return Bacon.more;
        } else {
          this.unsubscribeFromSource();
          return Bacon.noMore;
        }
      } else {
        this.queue.push(event);
        return Bacon.more;
      }
    };

    Dispatcher.prototype.handleEvent = function(event) {
      if (this._handleEvent) {
        return this._handleEvent(event);
      } else {
        return this.push(event);
      }
    };

    Dispatcher.prototype.unsubscribeFromSource = function() {
      if (this.unsubSrc) {
        this.unsubSrc();
      }
      return this.unsubSrc = void 0;
    };

    Dispatcher.prototype.subscribe = function(sink) {
      var subscription;
      if (this.ended) {
        sink(endEvent());
        return nop;
      } else {
        assertFunction(sink);
        subscription = {
          sink: sink
        };
        this.subscriptions.push(subscription);
        if (this.subscriptions.length === 1) {
          this.unsubSrc = this._subscribe(this.handleEvent);
          assertFunction(this.unsubSrc);
        }
        return (function(_this) {
          return function() {
            _this.removeSub(subscription);
            if (!_this.hasSubscribers()) {
              return _this.unsubscribeFromSource();
            }
          };
        })(this);
      }
    };

    return Dispatcher;

  })();

  Bacon.Dispatcher = Dispatcher;

  EventStream = (function(superClass) {
    extend(EventStream, superClass);

    function EventStream(desc, subscribe, handler) {
      if (_.isFunction(desc)) {
        handler = subscribe;
        subscribe = desc;
        desc = Desc.empty;
      }
      EventStream.__super__.constructor.call(this, desc);
      assertFunction(subscribe);
      this.dispatcher = new Dispatcher(subscribe, handler);
      registerObs(this);
    }

    EventStream.prototype.toProperty = function(initValue_) {
      var disp, initValue;
      initValue = arguments.length === 0 ? None : toOption(function() {
        return initValue_;
      });
      disp = this.dispatcher;
      return new Property(new Bacon.Desc(this, "toProperty", [initValue_]), function(sink) {
        var initSent, reply, sendInit, unsub;
        initSent = false;
        unsub = nop;
        reply = Bacon.more;
        sendInit = function() {
          if (!initSent) {
            return initValue.forEach(function(value) {
              initSent = true;
              reply = sink(new Initial(value));
              if (reply === Bacon.noMore) {
                unsub();
                return unsub = nop;
              }
            });
          }
        };
        unsub = disp.subscribe(function(event) {
          if (event.hasValue()) {
            if (initSent && event.isInitial()) {
              return Bacon.more;
            } else {
              if (!event.isInitial()) {
                sendInit();
              }
              initSent = true;
              initValue = new Some(event);
              return sink(event);
            }
          } else {
            if (event.isEnd()) {
              reply = sendInit();
            }
            if (reply !== Bacon.noMore) {
              return sink(event);
            }
          }
        });
        sendInit();
        return unsub;
      });
    };

    EventStream.prototype.toEventStream = function() {
      return this;
    };

    EventStream.prototype.withHandler = function(handler) {
      return new EventStream(new Bacon.Desc(this, "withHandler", [handler]), this.dispatcher.subscribe, handler);
    };

    return EventStream;

  })(Observable);

  Bacon.EventStream = EventStream;

  Bacon.never = function() {
    return new EventStream(describe(Bacon, "never"), function(sink) {
      sink(endEvent());
      return nop;
    });
  };

  Bacon.when = function() {
    var f, i, index, ix, j, k, len, len1, len2, needsBarrier, pat, patSources, pats, patterns, ref, resultStream, s, sources, triggerFound, usage;
    if (arguments.length === 0) {
      return Bacon.never();
    }
    len = arguments.length;
    usage = "when: expecting arguments in the form (Observable+,function)+";
    assert(usage, len % 2 === 0);
    sources = [];
    pats = [];
    i = 0;
    patterns = [];
    while (i < len) {
      patterns[i] = arguments[i];
      patterns[i + 1] = arguments[i + 1];
      patSources = _.toArray(arguments[i]);
      f = constantToFunction(arguments[i + 1]);
      pat = {
        f: f,
        ixs: []
      };
      triggerFound = false;
      for (j = 0, len1 = patSources.length; j < len1; j++) {
        s = patSources[j];
        index = _.indexOf(sources, s);
        if (!triggerFound) {
          triggerFound = Source.isTrigger(s);
        }
        if (index < 0) {
          sources.push(s);
          index = sources.length - 1;
        }
        ref = pat.ixs;
        for (k = 0, len2 = ref.length; k < len2; k++) {
          ix = ref[k];
          if (ix.index === index) {
            ix.count++;
          }
        }
        pat.ixs.push({
          index: index,
          count: 1
        });
      }
      assert("At least one EventStream required", triggerFound || (!patSources.length));
      if (patSources.length > 0) {
        pats.push(pat);
      }
      i = i + 2;
    }
    if (!sources.length) {
      return Bacon.never();
    }
    sources = _.map(Source.fromObservable, sources);
    needsBarrier = (_.any(sources, function(s) {
      return s.flatten;
    })) && (containsDuplicateDeps(_.map((function(s) {
      return s.obs;
    }), sources)));
    return resultStream = new EventStream(new Bacon.Desc(Bacon, "when", patterns), function(sink) {
      var cannotMatch, cannotSync, ends, match, nonFlattened, part, triggers;
      triggers = [];
      ends = false;
      match = function(p) {
        var l, len3, ref1;
        ref1 = p.ixs;
        for (l = 0, len3 = ref1.length; l < len3; l++) {
          i = ref1[l];
          if (!sources[i.index].hasAtLeast(i.count)) {
            return false;
          }
        }
        return true;
      };
      cannotSync = function(source) {
        return !source.sync || source.ended;
      };
      cannotMatch = function(p) {
        var l, len3, ref1;
        ref1 = p.ixs;
        for (l = 0, len3 = ref1.length; l < len3; l++) {
          i = ref1[l];
          if (!sources[i.index].mayHave(i.count)) {
            return true;
          }
        }
      };
      nonFlattened = function(trigger) {
        return !trigger.source.flatten;
      };
      part = function(source) {
        return function(unsubAll) {
          var flush, flushLater, flushWhileTriggers;
          flushLater = function() {
            return UpdateBarrier.whenDoneWith(resultStream, flush);
          };
          flushWhileTriggers = function() {
            var events, l, len3, p, reply, trigger;
            if (triggers.length > 0) {
              reply = Bacon.more;
              trigger = triggers.pop();
              for (l = 0, len3 = pats.length; l < len3; l++) {
                p = pats[l];
                if (match(p)) {
                  events = (function() {
                    var len4, m, ref1, results;
                    ref1 = p.ixs;
                    results = [];
                    for (m = 0, len4 = ref1.length; m < len4; m++) {
                      i = ref1[m];
                      results.push(sources[i.index].consume());
                    }
                    return results;
                  })();
                  reply = sink(trigger.e.apply(function() {
                    var event, values;
                    values = (function() {
                      var len4, m, results;
                      results = [];
                      for (m = 0, len4 = events.length; m < len4; m++) {
                        event = events[m];
                        results.push(event.value());
                      }
                      return results;
                    })();
                    return p.f.apply(p, values);
                  }));
                  if (triggers.length) {
                    triggers = _.filter(nonFlattened, triggers);
                  }
                  if (reply === Bacon.noMore) {
                    return reply;
                  } else {
                    return flushWhileTriggers();
                  }
                }
              }
            } else {
              return Bacon.more;
            }
          };
          flush = function() {
            var reply;
            reply = flushWhileTriggers();
            if (ends) {
              if (_.all(sources, cannotSync) || _.all(pats, cannotMatch)) {
                reply = Bacon.noMore;
                sink(endEvent());
              }
            }
            if (reply === Bacon.noMore) {
              unsubAll();
            }
            return reply;
          };
          return source.subscribe(function(e) {
            var reply;
            if (e.isEnd()) {
              ends = true;
              source.markEnded();
              flushLater();
            } else if (e.isError()) {
              reply = sink(e);
            } else {
              source.push(e);
              if (source.sync) {
                triggers.push({
                  source: source,
                  e: e
                });
                if (needsBarrier || UpdateBarrier.hasWaiters()) {
                  flushLater();
                } else {
                  flush();
                }
              }
            }
            if (reply === Bacon.noMore) {
              unsubAll();
            }
            return reply || Bacon.more;
          });
        };
      };
      return new Bacon.CompositeUnsubscribe((function() {
        var l, len3, results;
        results = [];
        for (l = 0, len3 = sources.length; l < len3; l++) {
          s = sources[l];
          results.push(part(s));
        }
        return results;
      })()).unsubscribe;
    });
  };

  containsDuplicateDeps = function(observables, state) {
    var checkObservable;
    if (state == null) {
      state = [];
    }
    checkObservable = function(obs) {
      var deps;
      if (_.contains(state, obs)) {
        return true;
      } else {
        deps = obs.internalDeps();
        if (deps.length) {
          state.push(obs);
          return _.any(deps, checkObservable);
        } else {
          state.push(obs);
          return false;
        }
      }
    };
    return _.any(observables, checkObservable);
  };

  constantToFunction = function(f) {
    if (_.isFunction(f)) {
      return f;
    } else {
      return _.always(f);
    }
  };

  Bacon.groupSimultaneous = function() {
    var s, sources, streams;
    streams = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (streams.length === 1 && isArray(streams[0])) {
      streams = streams[0];
    }
    sources = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = streams.length; j < len1; j++) {
        s = streams[j];
        results.push(new BufferingSource(s));
      }
      return results;
    })();
    return withDesc(new Bacon.Desc(Bacon, "groupSimultaneous", streams), Bacon.when(sources, (function() {
      var xs;
      xs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return xs;
    })));
  };

  PropertyDispatcher = (function(superClass) {
    extend(PropertyDispatcher, superClass);

    function PropertyDispatcher(property1, subscribe, handleEvent) {
      this.property = property1;
      this.subscribe = bind(this.subscribe, this);
      PropertyDispatcher.__super__.constructor.call(this, subscribe, handleEvent);
      this.current = None;
      this.currentValueRootId = void 0;
      this.propertyEnded = false;
    }

    PropertyDispatcher.prototype.push = function(event) {
      if (event.isEnd()) {
        this.propertyEnded = true;
      }
      if (event.hasValue()) {
        this.current = new Some(event);
        this.currentValueRootId = UpdateBarrier.currentEventId();
      }
      return PropertyDispatcher.__super__.push.call(this, event);
    };

    PropertyDispatcher.prototype.maybeSubSource = function(sink, reply) {
      if (reply === Bacon.noMore) {
        return nop;
      } else if (this.propertyEnded) {
        sink(endEvent());
        return nop;
      } else {
        return Dispatcher.prototype.subscribe.call(this, sink);
      }
    };

    PropertyDispatcher.prototype.subscribe = function(sink) {
      var dispatchingId, initSent, reply, valId;
      initSent = false;
      reply = Bacon.more;
      if (this.current.isDefined && (this.hasSubscribers() || this.propertyEnded)) {
        dispatchingId = UpdateBarrier.currentEventId();
        valId = this.currentValueRootId;
        if (!this.propertyEnded && valId && dispatchingId && dispatchingId !== valId) {
          UpdateBarrier.whenDoneWith(this.property, (function(_this) {
            return function() {
              if (_this.currentValueRootId === valId) {
                return sink(initialEvent(_this.current.get().value()));
              }
            };
          })(this));
          return this.maybeSubSource(sink, reply);
        } else {
          UpdateBarrier.inTransaction(void 0, this, (function() {
            return reply = sink(initialEvent(this.current.get().value()));
          }), []);
          return this.maybeSubSource(sink, reply);
        }
      } else {
        return this.maybeSubSource(sink, reply);
      }
    };

    return PropertyDispatcher;

  })(Dispatcher);

  Property = (function(superClass) {
    extend(Property, superClass);

    function Property(desc, subscribe, handler) {
      Property.__super__.constructor.call(this, desc);
      assertFunction(subscribe);
      this.dispatcher = new PropertyDispatcher(this, subscribe, handler);
      registerObs(this);
    }

    Property.prototype.changes = function() {
      return new EventStream(new Bacon.Desc(this, "changes", []), (function(_this) {
        return function(sink) {
          return _this.dispatcher.subscribe(function(event) {
            if (!event.isInitial()) {
              return sink(event);
            }
          });
        };
      })(this));
    };

    Property.prototype.withHandler = function(handler) {
      return new Property(new Bacon.Desc(this, "withHandler", [handler]), this.dispatcher.subscribe, handler);
    };

    Property.prototype.toProperty = function() {
      assertNoArguments(arguments);
      return this;
    };

    Property.prototype.toEventStream = function() {
      return new EventStream(new Bacon.Desc(this, "toEventStream", []), (function(_this) {
        return function(sink) {
          return _this.dispatcher.subscribe(function(event) {
            if (event.isInitial()) {
              event = event.toNext();
            }
            return sink(event);
          });
        };
      })(this));
    };

    return Property;

  })(Observable);

  Bacon.Property = Property;

  Bacon.constant = function(value) {
    return new Property(new Bacon.Desc(Bacon, "constant", [value]), function(sink) {
      sink(initialEvent(value));
      sink(endEvent());
      return nop;
    });
  };

  Bacon.fromBinder = function(binder, eventTransformer) {
    if (eventTransformer == null) {
      eventTransformer = _.id;
    }
    return new EventStream(new Bacon.Desc(Bacon, "fromBinder", [binder, eventTransformer]), function(sink) {
      var shouldUnbind, unbind, unbinder, unbound;
      unbound = false;
      shouldUnbind = false;
      unbind = function() {
        if (!unbound) {
          if (typeof unbinder !== "undefined" && unbinder !== null) {
            unbinder();
            return unbound = true;
          } else {
            return shouldUnbind = true;
          }
        }
      };
      unbinder = binder(function() {
        var args, event, j, len1, reply, value;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        value = eventTransformer.apply(this, args);
        if (!(isArray(value) && _.last(value) instanceof Event)) {
          value = [value];
        }
        reply = Bacon.more;
        for (j = 0, len1 = value.length; j < len1; j++) {
          event = value[j];
          reply = sink(event = toEvent(event));
          if (reply === Bacon.noMore || event.isEnd()) {
            unbind();
            return reply;
          }
        }
        return reply;
      });
      if (shouldUnbind) {
        unbind();
      }
      return unbind;
    });
  };

  eventMethods = [["addEventListener", "removeEventListener"], ["addListener", "removeListener"], ["on", "off"], ["bind", "unbind"]];

  findHandlerMethods = function(target) {
    var j, len1, methodPair, pair;
    for (j = 0, len1 = eventMethods.length; j < len1; j++) {
      pair = eventMethods[j];
      methodPair = [target[pair[0]], target[pair[1]]];
      if (methodPair[0] && methodPair[1]) {
        return methodPair;
      }
    }
    throw new Error("No suitable event methods in " + target);
  };

  Bacon.fromEventTarget = function(target, eventName, eventTransformer) {
    var ref, sub, unsub;
    ref = findHandlerMethods(target), sub = ref[0], unsub = ref[1];
    return withDesc(new Bacon.Desc(Bacon, "fromEvent", [target, eventName]), Bacon.fromBinder(function(handler) {
      sub.call(target, eventName, handler);
      return function() {
        return unsub.call(target, eventName, handler);
      };
    }, eventTransformer));
  };

  Bacon.fromEvent = Bacon.fromEventTarget;

  Bacon.Observable.prototype.map = function() {
    var args, p;
    p = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return convertArgsToFunction(this, p, args, function(f) {
      return withDesc(new Bacon.Desc(this, "map", [f]), this.withHandler(function(event) {
        return this.push(event.fmap(f));
      }));
    });
  };

  argumentsToObservables = function(args) {
    if (isArray(args[0])) {
      return args[0];
    } else {
      return Array.prototype.slice.call(args);
    }
  };

  argumentsToObservablesAndFunction = function(args) {
    if (_.isFunction(args[0])) {
      return [argumentsToObservables(Array.prototype.slice.call(args, 1)), args[0]];
    } else {
      return [argumentsToObservables(Array.prototype.slice.call(args, 0, args.length - 1)), _.last(args)];
    }
  };

  Bacon.combineAsArray = function() {
    var index, j, len1, s, sources, stream, streams;
    streams = argumentsToObservables(arguments);
    for (index = j = 0, len1 = streams.length; j < len1; index = ++j) {
      stream = streams[index];
      if (!(isObservable(stream))) {
        streams[index] = Bacon.constant(stream);
      }
    }
    if (streams.length) {
      sources = (function() {
        var k, len2, results;
        results = [];
        for (k = 0, len2 = streams.length; k < len2; k++) {
          s = streams[k];
          results.push(new Source(s, true));
        }
        return results;
      })();
      return withDesc(new Bacon.Desc(Bacon, "combineAsArray", streams), Bacon.when(sources, (function() {
        var xs;
        xs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return xs;
      })).toProperty());
    } else {
      return Bacon.constant([]);
    }
  };

  Bacon.onValues = function() {
    var f, j, streams;
    streams = 2 <= arguments.length ? slice.call(arguments, 0, j = arguments.length - 1) : (j = 0, []), f = arguments[j++];
    return Bacon.combineAsArray(streams).onValues(f);
  };

  Bacon.combineWith = function() {
    var f, ref, streams;
    ref = argumentsToObservablesAndFunction(arguments), streams = ref[0], f = ref[1];
    return withDesc(new Bacon.Desc(Bacon, "combineWith", [f].concat(slice.call(streams))), Bacon.combineAsArray(streams).map(function(values) {
      return f.apply(null, values);
    }));
  };

  Bacon.Observable.prototype.combine = function(other, f) {
    var combinator;
    combinator = toCombinator(f);
    return withDesc(new Bacon.Desc(this, "combine", [other, f]), Bacon.combineAsArray(this, other).map(function(values) {
      return combinator(values[0], values[1]);
    }));
  };

  Bacon.Observable.prototype.withStateMachine = function(initState, f) {
    var state;
    state = initState;
    return withDesc(new Bacon.Desc(this, "withStateMachine", [initState, f]), this.withHandler(function(event) {
      var fromF, j, len1, newState, output, outputs, reply;
      fromF = f(state, event);
      newState = fromF[0], outputs = fromF[1];
      state = newState;
      reply = Bacon.more;
      for (j = 0, len1 = outputs.length; j < len1; j++) {
        output = outputs[j];
        reply = this.push(output);
        if (reply === Bacon.noMore) {
          return reply;
        }
      }
      return reply;
    }));
  };

  Bacon.Observable.prototype.skipDuplicates = function(isEqual) {
    if (isEqual == null) {
      isEqual = function(a, b) {
        return a === b;
      };
    }
    return withDesc(new Bacon.Desc(this, "skipDuplicates", []), this.withStateMachine(None, function(prev, event) {
      if (!event.hasValue()) {
        return [prev, [event]];
      } else if (event.isInitial() || prev === None || !isEqual(prev.get(), event.value())) {
        return [new Some(event.value()), [event]];
      } else {
        return [prev, []];
      }
    }));
  };

  Bacon.Observable.prototype.awaiting = function(other) {
    return withDesc(new Bacon.Desc(this, "awaiting", [other]), Bacon.groupSimultaneous(this, other).map(function(arg) {
      var myValues, otherValues;
      myValues = arg[0], otherValues = arg[1];
      return otherValues.length === 0;
    }).toProperty(false).skipDuplicates());
  };

  Bacon.Observable.prototype.not = function() {
    return withDesc(new Bacon.Desc(this, "not", []), this.map(function(x) {
      return !x;
    }));
  };

  Bacon.Property.prototype.and = function(other) {
    return withDesc(new Bacon.Desc(this, "and", [other]), this.combine(other, function(x, y) {
      return x && y;
    }));
  };

  Bacon.Property.prototype.or = function(other) {
    return withDesc(new Bacon.Desc(this, "or", [other]), this.combine(other, function(x, y) {
      return x || y;
    }));
  };

  Bacon.scheduler = {
    setTimeout: function(f, d) {
      return setTimeout(f, d);
    },
    setInterval: function(f, i) {
      return setInterval(f, i);
    },
    clearInterval: function(id) {
      return clearInterval(id);
    },
    clearTimeout: function(id) {
      return clearTimeout(id);
    },
    now: function() {
      return new Date().getTime();
    }
  };

  Bacon.EventStream.prototype.bufferWithTime = function(delay) {
    return withDesc(new Bacon.Desc(this, "bufferWithTime", [delay]), this.bufferWithTimeOrCount(delay, Number.MAX_VALUE));
  };

  Bacon.EventStream.prototype.bufferWithCount = function(count) {
    return withDesc(new Bacon.Desc(this, "bufferWithCount", [count]), this.bufferWithTimeOrCount(void 0, count));
  };

  Bacon.EventStream.prototype.bufferWithTimeOrCount = function(delay, count) {
    var flushOrSchedule;
    flushOrSchedule = function(buffer) {
      if (buffer.values.length === count) {
        return buffer.flush();
      } else if (delay !== void 0) {
        return buffer.schedule();
      }
    };
    return withDesc(new Bacon.Desc(this, "bufferWithTimeOrCount", [delay, count]), this.buffer(delay, flushOrSchedule, flushOrSchedule));
  };

  Bacon.EventStream.prototype.buffer = function(delay, onInput, onFlush) {
    var buffer, delayMs, reply;
    if (onInput == null) {
      onInput = nop;
    }
    if (onFlush == null) {
      onFlush = nop;
    }
    buffer = {
      scheduled: null,
      end: void 0,
      values: [],
      flush: function() {
        var reply, valuesToPush;
        if (this.scheduled) {
          Bacon.scheduler.clearTimeout(this.scheduled);
          this.scheduled = null;
        }
        if (this.values.length > 0) {
          valuesToPush = this.values;
          this.values = [];
          reply = this.push(nextEvent(valuesToPush));
          if (this.end != null) {
            return this.push(this.end);
          } else if (reply !== Bacon.noMore) {
            return onFlush(this);
          }
        } else {
          if (this.end != null) {
            return this.push(this.end);
          }
        }
      },
      schedule: function() {
        if (!this.scheduled) {
          return this.scheduled = delay((function(_this) {
            return function() {
              return _this.flush();
            };
          })(this));
        }
      }
    };
    reply = Bacon.more;
    if (!_.isFunction(delay)) {
      delayMs = delay;
      delay = function(f) {
        return Bacon.scheduler.setTimeout(f, delayMs);
      };
    }
    return withDesc(new Bacon.Desc(this, "buffer", []), this.withHandler(function(event) {
      buffer.push = (function(_this) {
        return function(event) {
          return _this.push(event);
        };
      })(this);
      if (event.isError()) {
        reply = this.push(event);
      } else if (event.isEnd()) {
        buffer.end = event;
        if (!buffer.scheduled) {
          buffer.flush();
        }
      } else {
        buffer.values.push(event.value());
        onInput(buffer);
      }
      return reply;
    }));
  };

  Bacon.Observable.prototype.filter = function() {
    var args, f;
    f = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    assertObservableIsProperty(f);
    return convertArgsToFunction(this, f, args, function(f) {
      return withDesc(new Bacon.Desc(this, "filter", [f]), this.withHandler(function(event) {
        if (event.filter(f)) {
          return this.push(event);
        } else {
          return Bacon.more;
        }
      }));
    });
  };

  Bacon.once = function(value) {
    return new EventStream(new Desc(Bacon, "once", [value]), function(sink) {
      sink(toEvent(value));
      sink(endEvent());
      return nop;
    });
  };

  Bacon.EventStream.prototype.concat = function(right) {
    var left;
    left = this;
    return new EventStream(new Bacon.Desc(left, "concat", [right]), function(sink) {
      var unsubLeft, unsubRight;
      unsubRight = nop;
      unsubLeft = left.dispatcher.subscribe(function(e) {
        if (e.isEnd()) {
          return unsubRight = right.dispatcher.subscribe(sink);
        } else {
          return sink(e);
        }
      });
      return function() {
        unsubLeft();
        return unsubRight();
      };
    });
  };

  Bacon.Observable.prototype.flatMap = function() {
    return flatMap_(this, makeSpawner(arguments));
  };

  Bacon.Observable.prototype.flatMapFirst = function() {
    return flatMap_(this, makeSpawner(arguments), true);
  };

  flatMap_ = function(root, f, firstOnly, limit) {
    var childDeps, result, rootDep;
    rootDep = [root];
    childDeps = [];
    result = new EventStream(new Bacon.Desc(root, "flatMap" + (firstOnly ? "First" : ""), [f]), function(sink) {
      var checkEnd, checkQueue, composite, queue, spawn;
      composite = new CompositeUnsubscribe();
      queue = [];
      spawn = function(event) {
        var child;
        child = makeObservable(f(event.value()));
        childDeps.push(child);
        return composite.add(function(unsubAll, unsubMe) {
          return child.dispatcher.subscribe(function(event) {
            var reply;
            if (event.isEnd()) {
              _.remove(child, childDeps);
              checkQueue();
              checkEnd(unsubMe);
              return Bacon.noMore;
            } else {
              if (event instanceof Initial) {
                event = event.toNext();
              }
              reply = sink(event);
              if (reply === Bacon.noMore) {
                unsubAll();
              }
              return reply;
            }
          });
        });
      };
      checkQueue = function() {
        var event;
        event = queue.shift();
        if (event) {
          return spawn(event);
        }
      };
      checkEnd = function(unsub) {
        unsub();
        if (composite.empty()) {
          return sink(endEvent());
        }
      };
      composite.add(function(__, unsubRoot) {
        return root.dispatcher.subscribe(function(event) {
          if (event.isEnd()) {
            return checkEnd(unsubRoot);
          } else if (event.isError()) {
            return sink(event);
          } else if (firstOnly && composite.count() > 1) {
            return Bacon.more;
          } else {
            if (composite.unsubscribed) {
              return Bacon.noMore;
            }
            if (limit && composite.count() > limit) {
              return queue.push(event);
            } else {
              return spawn(event);
            }
          }
        });
      });
      return composite.unsubscribe;
    });
    result.internalDeps = function() {
      if (childDeps.length) {
        return rootDep.concat(childDeps);
      } else {
        return rootDep;
      }
    };
    return result;
  };

  makeSpawner = function(args) {
    if (args.length === 1 && isObservable(args[0])) {
      return _.always(args[0]);
    } else {
      return makeFunctionArgs(args);
    }
  };

  makeObservable = function(x) {
    if (isObservable(x)) {
      return x;
    } else {
      return Bacon.once(x);
    }
  };

  Bacon.Observable.prototype.flatMapWithConcurrencyLimit = function() {
    var args, limit;
    limit = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return withDesc(new Bacon.Desc(this, "flatMapWithConcurrencyLimit", [limit].concat(slice.call(args))), flatMap_(this, makeSpawner(args), false, limit));
  };

  Bacon.Observable.prototype.flatMapConcat = function() {
    return withDesc(new Bacon.Desc(this, "flatMapConcat", Array.prototype.slice.call(arguments, 0)), this.flatMapWithConcurrencyLimit.apply(this, [1].concat(slice.call(arguments))));
  };

  Bacon.later = function(delay, value) {
    return withDesc(new Bacon.Desc(Bacon, "later", [delay, value]), Bacon.fromBinder(function(sink) {
      var id, sender;
      sender = function() {
        return sink([value, endEvent()]);
      };
      id = Bacon.scheduler.setTimeout(sender, delay);
      return function() {
        return Bacon.scheduler.clearTimeout(id);
      };
    }));
  };

  Bacon.Observable.prototype.bufferingThrottle = function(minimumInterval) {
    return withDesc(new Bacon.Desc(this, "bufferingThrottle", [minimumInterval]), this.flatMapConcat(function(x) {
      return Bacon.once(x).concat(Bacon.later(minimumInterval).filter(false));
    }));
  };

  Bacon.Property.prototype.bufferingThrottle = function() {
    return Bacon.Observable.prototype.bufferingThrottle.apply(this, arguments).toProperty();
  };

  Bus = (function(superClass) {
    extend(Bus, superClass);

    function Bus() {
      this.guardedSink = bind(this.guardedSink, this);
      this.subscribeAll = bind(this.subscribeAll, this);
      this.unsubAll = bind(this.unsubAll, this);
      this.sink = void 0;
      this.subscriptions = [];
      this.ended = false;
      Bus.__super__.constructor.call(this, new Bacon.Desc(Bacon, "Bus", []), this.subscribeAll);
    }

    Bus.prototype.unsubAll = function() {
      var j, len1, ref, sub;
      ref = this.subscriptions;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        sub = ref[j];
        if (typeof sub.unsub === "function") {
          sub.unsub();
        }
      }
      return void 0;
    };

    Bus.prototype.subscribeAll = function(newSink) {
      var j, len1, ref, subscription;
      if (this.ended) {
        newSink(endEvent());
      } else {
        this.sink = newSink;
        ref = cloneArray(this.subscriptions);
        for (j = 0, len1 = ref.length; j < len1; j++) {
          subscription = ref[j];
          this.subscribeInput(subscription);
        }
      }
      return this.unsubAll;
    };

    Bus.prototype.guardedSink = function(input) {
      return (function(_this) {
        return function(event) {
          if (event.isEnd()) {
            _this.unsubscribeInput(input);
            return Bacon.noMore;
          } else {
            return _this.sink(event);
          }
        };
      })(this);
    };

    Bus.prototype.subscribeInput = function(subscription) {
      return subscription.unsub = subscription.input.dispatcher.subscribe(this.guardedSink(subscription.input));
    };

    Bus.prototype.unsubscribeInput = function(input) {
      var i, j, len1, ref, sub;
      ref = this.subscriptions;
      for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
        sub = ref[i];
        if (sub.input === input) {
          if (typeof sub.unsub === "function") {
            sub.unsub();
          }
          this.subscriptions.splice(i, 1);
          return;
        }
      }
    };

    Bus.prototype.plug = function(input) {
      var sub;
      assertObservable(input);
      if (this.ended) {
        return;
      }
      sub = {
        input: input
      };
      this.subscriptions.push(sub);
      if ((this.sink != null)) {
        this.subscribeInput(sub);
      }
      return (function(_this) {
        return function() {
          return _this.unsubscribeInput(input);
        };
      })(this);
    };

    Bus.prototype.end = function() {
      this.ended = true;
      this.unsubAll();
      return typeof this.sink === "function" ? this.sink(endEvent()) : void 0;
    };

    Bus.prototype.push = function(value) {
      if (!this.ended) {
        return typeof this.sink === "function" ? this.sink(nextEvent(value)) : void 0;
      }
    };

    Bus.prototype.error = function(error) {
      return typeof this.sink === "function" ? this.sink(new Error(error)) : void 0;
    };

    return Bus;

  })(EventStream);

  Bacon.Bus = Bus;

  liftCallback = function(desc, wrapped) {
    return withMethodCallSupport(function() {
      var args, f, stream;
      f = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      stream = partiallyApplied(wrapped, [
        function(values, callback) {
          return f.apply(null, slice.call(values).concat([callback]));
        }
      ]);
      return withDesc(new Bacon.Desc(Bacon, desc, [f].concat(slice.call(args))), Bacon.combineAsArray(args).flatMap(stream));
    });
  };

  Bacon.fromCallback = liftCallback("fromCallback", function() {
    var args, f;
    f = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return Bacon.fromBinder(function(handler) {
      makeFunction(f, args)(handler);
      return nop;
    }, (function(value) {
      return [value, endEvent()];
    }));
  });

  Bacon.fromNodeCallback = liftCallback("fromNodeCallback", function() {
    var args, f;
    f = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return Bacon.fromBinder(function(handler) {
      makeFunction(f, args)(handler);
      return nop;
    }, function(error, value) {
      if (error) {
        return [new Error(error), endEvent()];
      }
      return [value, endEvent()];
    });
  });

  Bacon.combineTemplate = function(template) {
    var applyStreamValue, combinator, compile, compileTemplate, constantValue, current, funcs, mkContext, pushContext, setValue, streams;
    funcs = [];
    streams = [];
    current = function(ctxStack) {
      return ctxStack[ctxStack.length - 1];
    };
    setValue = function(ctxStack, key, value) {
      return current(ctxStack)[key] = value;
    };
    applyStreamValue = function(key, index) {
      return function(ctxStack, values) {
        return setValue(ctxStack, key, values[index]);
      };
    };
    constantValue = function(key, value) {
      return function(ctxStack) {
        return setValue(ctxStack, key, value);
      };
    };
    mkContext = function(template) {
      if (isArray(template)) {
        return [];
      } else {
        return {};
      }
    };
    pushContext = function(key, value) {
      return function(ctxStack) {
        var newContext;
        newContext = mkContext(value);
        setValue(ctxStack, key, newContext);
        return ctxStack.push(newContext);
      };
    };
    compile = function(key, value) {
      var popContext;
      if (isObservable(value)) {
        streams.push(value);
        return funcs.push(applyStreamValue(key, streams.length - 1));
      } else if (value === Object(value) && typeof value !== "function" && !(value instanceof RegExp) && !(value instanceof Date)) {
        popContext = function(ctxStack) {
          return ctxStack.pop();
        };
        funcs.push(pushContext(key, value));
        compileTemplate(value);
        return funcs.push(popContext);
      } else {
        return funcs.push(constantValue(key, value));
      }
    };
    compileTemplate = function(template) {
      return _.each(template, compile);
    };
    compileTemplate(template);
    combinator = function(values) {
      var ctxStack, f, j, len1, rootContext;
      rootContext = mkContext(template);
      ctxStack = [rootContext];
      for (j = 0, len1 = funcs.length; j < len1; j++) {
        f = funcs[j];
        f(ctxStack, values);
      }
      return rootContext;
    };
    return withDesc(new Bacon.Desc(Bacon, "combineTemplate", [template]), Bacon.combineAsArray(streams).map(combinator));
  };

  addPropertyInitValueToStream = function(property, stream) {
    var justInitValue;
    justInitValue = new EventStream(describe(property, "justInitValue"), function(sink) {
      var unsub, value;
      value = void 0;
      unsub = property.dispatcher.subscribe(function(event) {
        if (!event.isEnd()) {
          value = event;
        }
        return Bacon.noMore;
      });
      UpdateBarrier.whenDoneWith(justInitValue, function() {
        if (value != null) {
          sink(value);
        }
        return sink(endEvent());
      });
      return unsub;
    });
    return justInitValue.concat(stream).toProperty();
  };

  Bacon.Observable.prototype.mapEnd = function() {
    var f;
    f = makeFunctionArgs(arguments);
    return withDesc(new Bacon.Desc(this, "mapEnd", [f]), this.withHandler(function(event) {
      if (event.isEnd()) {
        this.push(nextEvent(f(event)));
        this.push(endEvent());
        return Bacon.noMore;
      } else {
        return this.push(event);
      }
    }));
  };

  Bacon.Observable.prototype.skipErrors = function() {
    return withDesc(new Bacon.Desc(this, "skipErrors", []), this.withHandler(function(event) {
      if (event.isError()) {
        return Bacon.more;
      } else {
        return this.push(event);
      }
    }));
  };

  Bacon.EventStream.prototype.takeUntil = function(stopper) {
    var endMarker;
    endMarker = {};
    return withDesc(new Bacon.Desc(this, "takeUntil", [stopper]), Bacon.groupSimultaneous(this.mapEnd(endMarker), stopper.skipErrors()).withHandler(function(event) {
      var data, j, len1, ref, reply, value;
      if (!event.hasValue()) {
        return this.push(event);
      } else {
        ref = event.value(), data = ref[0], stopper = ref[1];
        if (stopper.length) {
          return this.push(endEvent());
        } else {
          reply = Bacon.more;
          for (j = 0, len1 = data.length; j < len1; j++) {
            value = data[j];
            if (value === endMarker) {
              reply = this.push(endEvent());
            } else {
              reply = this.push(nextEvent(value));
            }
          }
          return reply;
        }
      }
    }));
  };

  Bacon.Property.prototype.takeUntil = function(stopper) {
    var changes;
    changes = this.changes().takeUntil(stopper);
    return withDesc(new Bacon.Desc(this, "takeUntil", [stopper]), addPropertyInitValueToStream(this, changes));
  };

  Bacon.Observable.prototype.flatMapLatest = function() {
    var f, stream;
    f = makeSpawner(arguments);
    stream = this.toEventStream();
    return withDesc(new Bacon.Desc(this, "flatMapLatest", [f]), stream.flatMap(function(value) {
      return makeObservable(f(value)).takeUntil(stream);
    }));
  };

  Bacon.Property.prototype.delayChanges = function(desc, f) {
    return withDesc(desc, addPropertyInitValueToStream(this, f(this.changes())));
  };

  Bacon.EventStream.prototype.delay = function(delay) {
    return withDesc(new Bacon.Desc(this, "delay", [delay]), this.flatMap(function(value) {
      return Bacon.later(delay, value);
    }));
  };

  Bacon.Property.prototype.delay = function(delay) {
    return this.delayChanges(new Bacon.Desc(this, "delay", [delay]), function(changes) {
      return changes.delay(delay);
    });
  };

  Bacon.EventStream.prototype.debounce = function(delay) {
    return withDesc(new Bacon.Desc(this, "debounce", [delay]), this.flatMapLatest(function(value) {
      return Bacon.later(delay, value);
    }));
  };

  Bacon.Property.prototype.debounce = function(delay) {
    return this.delayChanges(new Bacon.Desc(this, "debounce", [delay]), function(changes) {
      return changes.debounce(delay);
    });
  };

  Bacon.EventStream.prototype.debounceImmediate = function(delay) {
    return withDesc(new Bacon.Desc(this, "debounceImmediate", [delay]), this.flatMapFirst(function(value) {
      return Bacon.once(value).concat(Bacon.later(delay).filter(false));
    }));
  };

  Bacon.Observable.prototype.decode = function(cases) {
    return withDesc(new Bacon.Desc(this, "decode", [cases]), this.combine(Bacon.combineTemplate(cases), function(key, values) {
      return values[key];
    }));
  };

  Bacon.Observable.prototype.scan = function(seed, f) {
    var acc, initHandled, resultProperty, subscribe;
    f = toCombinator(f);
    acc = toOption(seed);
    initHandled = false;
    subscribe = (function(_this) {
      return function(sink) {
        var initSent, reply, sendInit, unsub;
        initSent = false;
        unsub = nop;
        reply = Bacon.more;
        sendInit = function() {
          if (!initSent) {
            return acc.forEach(function(value) {
              initSent = initHandled = true;
              reply = sink(new Initial(function() {
                return value;
              }));
              if (reply === Bacon.noMore) {
                unsub();
                return unsub = nop;
              }
            });
          }
        };
        unsub = _this.dispatcher.subscribe(function(event) {
          var next, prev;
          if (event.hasValue()) {
            if (initHandled && event.isInitial()) {
              return Bacon.more;
            } else {
              if (!event.isInitial()) {
                sendInit();
              }
              initSent = initHandled = true;
              prev = acc.getOrElse(void 0);
              next = f(prev, event.value());
              acc = new Some(next);
              return sink(event.apply(function() {
                return next;
              }));
            }
          } else {
            if (event.isEnd()) {
              reply = sendInit();
            }
            if (reply !== Bacon.noMore) {
              return sink(event);
            }
          }
        });
        UpdateBarrier.whenDoneWith(resultProperty, sendInit);
        return unsub;
      };
    })(this);
    return resultProperty = new Property(new Bacon.Desc(this, "scan", [seed, f]), subscribe);
  };

  Bacon.Observable.prototype.diff = function(start, f) {
    f = toCombinator(f);
    return withDesc(new Bacon.Desc(this, "diff", [start, f]), this.scan([start], function(prevTuple, next) {
      return [next, f(prevTuple[0], next)];
    }).filter(function(tuple) {
      return tuple.length === 2;
    }).map(function(tuple) {
      return tuple[1];
    }));
  };

  Bacon.Observable.prototype.doAction = function() {
    var f;
    f = makeFunctionArgs(arguments);
    return withDesc(new Bacon.Desc(this, "doAction", [f]), this.withHandler(function(event) {
      if (event.hasValue()) {
        f(event.value());
      }
      return this.push(event);
    }));
  };

  Bacon.Observable.prototype.doError = function() {
    var f;
    f = makeFunctionArgs(arguments);
    return withDesc(new Bacon.Desc(this, "doError", [f]), this.withHandler(function(event) {
      if (event.isError()) {
        f(event.error);
      }
      return this.push(event);
    }));
  };

  Bacon.Observable.prototype.doLog = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return withDesc(new Bacon.Desc(this, "doLog", args), this.withHandler(function(event) {
      if (typeof console !== "undefined" && console !== null) {
        if (typeof console.log === "function") {
          console.log.apply(console, slice.call(args).concat([event.log()]));
        }
      }
      return this.push(event);
    }));
  };

  Bacon.Observable.prototype.endOnError = function() {
    var args, f;
    f = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (f == null) {
      f = true;
    }
    return convertArgsToFunction(this, f, args, function(f) {
      return withDesc(new Bacon.Desc(this, "endOnError", []), this.withHandler(function(event) {
        if (event.isError() && f(event.error)) {
          this.push(event);
          return this.push(endEvent());
        } else {
          return this.push(event);
        }
      }));
    });
  };

  Observable.prototype.errors = function() {
    return withDesc(new Bacon.Desc(this, "errors", []), this.filter(function() {
      return false;
    }));
  };

  valueAndEnd = (function(value) {
    return [value, endEvent()];
  });

  Bacon.fromPromise = function(promise, abort, eventTransformer) {
    if (eventTransformer == null) {
      eventTransformer = valueAndEnd;
    }
    return withDesc(new Bacon.Desc(Bacon, "fromPromise", [promise]), Bacon.fromBinder(function(handler) {
      var ref;
      if ((ref = promise.then(handler, function(e) {
        return handler(new Error(e));
      })) != null) {
        if (typeof ref.done === "function") {
          ref.done();
        }
      }
      return function() {
        if (abort) {
          return typeof promise.abort === "function" ? promise.abort() : void 0;
        }
      };
    }, eventTransformer));
  };

  Bacon.Observable.prototype.mapError = function() {
    var f;
    f = makeFunctionArgs(arguments);
    return withDesc(new Bacon.Desc(this, "mapError", [f]), this.withHandler(function(event) {
      if (event.isError()) {
        return this.push(nextEvent(f(event.error)));
      } else {
        return this.push(event);
      }
    }));
  };

  Bacon.Observable.prototype.flatMapError = function(fn) {
    return withDesc(new Bacon.Desc(this, "flatMapError", [fn]), this.mapError(function(err) {
      return new Error(err);
    }).flatMap(function(x) {
      if (x instanceof Error) {
        return fn(x.error);
      } else {
        return Bacon.once(x);
      }
    }));
  };

  Bacon.EventStream.prototype.sampledBy = function(sampler, combinator) {
    return withDesc(new Bacon.Desc(this, "sampledBy", [sampler, combinator]), this.toProperty().sampledBy(sampler, combinator));
  };

  Bacon.Property.prototype.sampledBy = function(sampler, combinator) {
    var lazy, result, samplerSource, stream, thisSource;
    if (combinator != null) {
      combinator = toCombinator(combinator);
    } else {
      lazy = true;
      combinator = function(f) {
        return f.value();
      };
    }
    thisSource = new Source(this, false, lazy);
    samplerSource = new Source(sampler, true, lazy);
    stream = Bacon.when([thisSource, samplerSource], combinator);
    result = sampler instanceof Property ? stream.toProperty() : stream;
    return withDesc(new Bacon.Desc(this, "sampledBy", [sampler, combinator]), result);
  };

  Bacon.Property.prototype.sample = function(interval) {
    return withDesc(new Bacon.Desc(this, "sample", [interval]), this.sampledBy(Bacon.interval(interval, {})));
  };

  Bacon.Observable.prototype.map = function() {
    var args, p;
    p = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (p instanceof Property) {
      return p.sampledBy(this, former);
    } else {
      return convertArgsToFunction(this, p, args, function(f) {
        return withDesc(new Bacon.Desc(this, "map", [f]), this.withHandler(function(event) {
          return this.push(event.fmap(f));
        }));
      });
    }
  };

  Bacon.Observable.prototype.fold = function(seed, f) {
    return withDesc(new Bacon.Desc(this, "fold", [seed, f]), this.scan(seed, f).sampledBy(this.filter(false).mapEnd().toProperty()));
  };

  Observable.prototype.reduce = Observable.prototype.fold;

  Bacon.fromPoll = function(delay, poll) {
    return withDesc(new Bacon.Desc(Bacon, "fromPoll", [delay, poll]), Bacon.fromBinder((function(handler) {
      var id;
      id = Bacon.scheduler.setInterval(handler, delay);
      return function() {
        return Bacon.scheduler.clearInterval(id);
      };
    }), poll));
  };

  Bacon.Observable.prototype.groupBy = function(keyF, limitF) {
    var src, streams;
    if (limitF == null) {
      limitF = Bacon._.id;
    }
    streams = {};
    src = this;
    return src.filter(function(x) {
      return !streams[keyF(x)];
    }).map(function(x) {
      var data, key, limited, similar;
      key = keyF(x);
      similar = src.filter(function(x) {
        return keyF(x) === key;
      });
      data = Bacon.once(x).concat(similar);
      limited = limitF(data, x).withHandler(function(event) {
        this.push(event);
        if (event.isEnd()) {
          return delete streams[key];
        }
      });
      return streams[key] = limited;
    });
  };

  Bacon.fromArray = function(values) {
    var i;
    assertArray(values);
    if (!values.length) {
      return withDesc(new Bacon.Desc(Bacon, "fromArray", values), Bacon.never());
    } else {
      i = 0;
      return new EventStream(new Bacon.Desc(Bacon, "fromArray", [values]), function(sink) {
        var push, pushNeeded, pushing, reply, unsubd;
        unsubd = false;
        reply = Bacon.more;
        pushing = false;
        pushNeeded = false;
        push = function() {
          var value;
          pushNeeded = true;
          if (pushing) {
            return;
          }
          pushing = true;
          while (pushNeeded) {
            pushNeeded = false;
            if ((reply !== Bacon.noMore) && !unsubd) {
              value = values[i++];
              reply = sink(toEvent(value));
              if (reply !== Bacon.noMore) {
                if (i === values.length) {
                  sink(endEvent());
                } else {
                  UpdateBarrier.afterTransaction(push);
                }
              }
            }
          }
          return pushing = false;
        };
        push();
        return function() {
          return unsubd = true;
        };
      });
    }
  };

  Bacon.EventStream.prototype.holdWhen = function(valve) {
    var bufferedValues, onHold, src;
    onHold = false;
    bufferedValues = [];
    src = this;
    return new EventStream(new Bacon.Desc(this, "holdWhen", [valve]), function(sink) {
      var composite, endIfBothEnded, subscribed;
      composite = new CompositeUnsubscribe();
      subscribed = false;
      endIfBothEnded = function(unsub) {
        if (typeof unsub === "function") {
          unsub();
        }
        if (composite.empty() && subscribed) {
          return sink(endEvent());
        }
      };
      composite.add(function(unsubAll, unsubMe) {
        return valve.subscribeInternal(function(event) {
          var j, len1, results, toSend, value;
          if (event.hasValue()) {
            onHold = event.value();
            if (!onHold) {
              toSend = bufferedValues;
              bufferedValues = [];
              results = [];
              for (j = 0, len1 = toSend.length; j < len1; j++) {
                value = toSend[j];
                results.push(sink(nextEvent(value)));
              }
              return results;
            }
          } else if (event.isEnd()) {
            return endIfBothEnded(unsubMe);
          } else {
            return sink(event);
          }
        });
      });
      composite.add(function(unsubAll, unsubMe) {
        return src.subscribeInternal(function(event) {
          if (onHold && event.hasValue()) {
            return bufferedValues.push(event.value());
          } else if (event.isEnd() && bufferedValues.length) {
            return endIfBothEnded(unsubMe);
          } else {
            return sink(event);
          }
        });
      });
      subscribed = true;
      endIfBothEnded();
      return composite.unsubscribe;
    });
  };

  Bacon.interval = function(delay, value) {
    if (value == null) {
      value = {};
    }
    return withDesc(new Bacon.Desc(Bacon, "interval", [delay, value]), Bacon.fromPoll(delay, function() {
      return nextEvent(value);
    }));
  };

  Bacon.$ = {};

  Bacon.$.asEventStream = function(eventName, selector, eventTransformer) {
    var ref;
    if (_.isFunction(selector)) {
      ref = [selector, void 0], eventTransformer = ref[0], selector = ref[1];
    }
    return withDesc(new Bacon.Desc(this.selector || this, "asEventStream", [eventName]), Bacon.fromBinder((function(_this) {
      return function(handler) {
        _this.on(eventName, selector, handler);
        return function() {
          return _this.off(eventName, selector, handler);
        };
      };
    })(this), eventTransformer));
  };

  if ((ref = typeof jQuery !== "undefined" && jQuery !== null ? jQuery : typeof Zepto !== "undefined" && Zepto !== null ? Zepto : void 0) != null) {
    ref.fn.asEventStream = Bacon.$.asEventStream;
  }

  Bacon.Observable.prototype.log = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    this.subscribe(function(event) {
      return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log.apply(console, slice.call(args).concat([event.log()])) : void 0 : void 0;
    });
    return this;
  };

  Bacon.EventStream.prototype.merge = function(right) {
    var left;
    assertEventStream(right);
    left = this;
    return withDesc(new Bacon.Desc(left, "merge", [right]), Bacon.mergeAll(this, right));
  };

  Bacon.mergeAll = function() {
    var streams;
    streams = argumentsToObservables(arguments);
    if (streams.length) {
      return new EventStream(new Bacon.Desc(Bacon, "mergeAll", streams), function(sink) {
        var ends, sinks, smartSink;
        ends = 0;
        smartSink = function(obs) {
          return function(unsubBoth) {
            return obs.dispatcher.subscribe(function(event) {
              var reply;
              if (event.isEnd()) {
                ends++;
                if (ends === streams.length) {
                  return sink(endEvent());
                } else {
                  return Bacon.more;
                }
              } else {
                reply = sink(event);
                if (reply === Bacon.noMore) {
                  unsubBoth();
                }
                return reply;
              }
            });
          };
        };
        sinks = _.map(smartSink, streams);
        return new Bacon.CompositeUnsubscribe(sinks).unsubscribe;
      });
    } else {
      return Bacon.never();
    }
  };

  Bacon.repeatedly = function(delay, values) {
    var index;
    index = 0;
    return withDesc(new Bacon.Desc(Bacon, "repeatedly", [delay, values]), Bacon.fromPoll(delay, function() {
      return values[index++ % values.length];
    }));
  };

  Bacon.repeat = function(generator) {
    var index;
    index = 0;
    return Bacon.fromBinder(function(sink) {
      var flag, handleEvent, reply, subscribeNext, unsub;
      flag = false;
      reply = Bacon.more;
      unsub = function() {};
      handleEvent = function(event) {
        if (event.isEnd()) {
          if (!flag) {
            return flag = true;
          } else {
            return subscribeNext();
          }
        } else {
          return reply = sink(event);
        }
      };
      subscribeNext = function() {
        var next;
        flag = true;
        while (flag && reply !== Bacon.noMore) {
          next = generator(index++);
          flag = false;
          if (next) {
            unsub = next.subscribeInternal(handleEvent);
          } else {
            sink(endEvent());
          }
        }
        return flag = true;
      };
      subscribeNext();
      return function() {
        return unsub();
      };
    });
  };

  Bacon.retry = function(options) {
    var delay, error, finished, isRetryable, maxRetries, retries, source;
    if (!_.isFunction(options.source)) {
      throw new Exception("'source' option has to be a function");
    }
    source = options.source;
    retries = options.retries || 0;
    maxRetries = options.maxRetries || retries;
    delay = options.delay || function() {
      return 0;
    };
    isRetryable = options.isRetryable || function() {
      return true;
    };
    finished = false;
    error = null;
    return withDesc(new Bacon.Desc(Bacon, "retry", [options]), Bacon.repeat(function() {
      var context, pause, valueStream;
      if (finished) {
        return null;
      } else {
        valueStream = function() {
          return source().endOnError().withHandler(function(event) {
            if (event.isError()) {
              error = event;
              if (isRetryable(error.error) && retries > 0) {

              } else {
                finished = true;
                return this.push(event);
              }
            } else {
              if (event.hasValue()) {
                error = null;
                finished = true;
              }
              return this.push(event);
            }
          });
        };
        if (error) {
          context = {
            error: error.error,
            retriesDone: maxRetries - retries
          };
          pause = Bacon.later(delay(context)).filter(false);
          retries = retries - 1;
          return pause.concat(Bacon.once().flatMap(valueStream));
        } else {
          return valueStream();
        }
      }
    }));
  };

  Bacon.sequentially = function(delay, values) {
    var index;
    index = 0;
    return withDesc(new Bacon.Desc(Bacon, "sequentially", [delay, values]), Bacon.fromPoll(delay, function() {
      var value;
      value = values[index++];
      if (index < values.length) {
        return value;
      } else if (index === values.length) {
        return [value, endEvent()];
      } else {
        return endEvent();
      }
    }));
  };

  Bacon.Observable.prototype.skip = function(count) {
    return withDesc(new Bacon.Desc(this, "skip", [count]), this.withHandler(function(event) {
      if (!event.hasValue()) {
        return this.push(event);
      } else if (count > 0) {
        count--;
        return Bacon.more;
      } else {
        return this.push(event);
      }
    }));
  };

  Bacon.Observable.prototype.take = function(count) {
    if (count <= 0) {
      return Bacon.never();
    }
    return withDesc(new Bacon.Desc(this, "take", [count]), this.withHandler(function(event) {
      if (!event.hasValue()) {
        return this.push(event);
      } else {
        count--;
        if (count > 0) {
          return this.push(event);
        } else {
          if (count === 0) {
            this.push(event);
          }
          this.push(endEvent());
          return Bacon.noMore;
        }
      }
    }));
  };

  Bacon.EventStream.prototype.skipUntil = function(starter) {
    var started;
    started = starter.take(1).map(true).toProperty(false);
    return withDesc(new Bacon.Desc(this, "skipUntil", [starter]), this.filter(started));
  };

  Bacon.EventStream.prototype.skipWhile = function() {
    var args, f, ok;
    f = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    assertObservableIsProperty(f);
    ok = false;
    return convertArgsToFunction(this, f, args, function(f) {
      return withDesc(new Bacon.Desc(this, "skipWhile", [f]), this.withHandler(function(event) {
        if (ok || !event.hasValue() || !f(event.value())) {
          if (event.hasValue()) {
            ok = true;
          }
          return this.push(event);
        } else {
          return Bacon.more;
        }
      }));
    });
  };

  Bacon.Observable.prototype.slidingWindow = function(n, minValues) {
    if (minValues == null) {
      minValues = 0;
    }
    return withDesc(new Bacon.Desc(this, "slidingWindow", [n, minValues]), this.scan([], (function(window, value) {
      return window.concat([value]).slice(-n);
    })).filter((function(values) {
      return values.length >= minValues;
    })));
  };

  Bacon.spy = function(spy) {
    return spys.push(spy);
  };

  spys = [];

  registerObs = function(obs) {
    var j, len1, spy;
    if (spys.length) {
      if (!registerObs.running) {
        try {
          registerObs.running = true;
          for (j = 0, len1 = spys.length; j < len1; j++) {
            spy = spys[j];
            spy(obs);
          }
        } finally {
          delete registerObs.running;
        }
      }
    }
    return void 0;
  };

  Bacon.Property.prototype.startWith = function(seed) {
    return withDesc(new Bacon.Desc(this, "startWith", [seed]), this.scan(seed, function(prev, next) {
      return next;
    }));
  };

  Bacon.EventStream.prototype.startWith = function(seed) {
    return withDesc(new Bacon.Desc(this, "startWith", [seed]), Bacon.once(seed).concat(this));
  };

  Bacon.Observable.prototype.takeWhile = function() {
    var args, f;
    f = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    assertObservableIsProperty(f);
    return convertArgsToFunction(this, f, args, function(f) {
      return withDesc(new Bacon.Desc(this, "takeWhile", [f]), this.withHandler(function(event) {
        if (event.filter(f)) {
          return this.push(event);
        } else {
          this.push(endEvent());
          return Bacon.noMore;
        }
      }));
    });
  };

  Bacon.update = function() {
    var i, initial, lateBindFirst, patterns;
    initial = arguments[0], patterns = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    lateBindFirst = function(f) {
      return function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return function(i) {
          return f.apply(null, [i].concat(args));
        };
      };
    };
    i = patterns.length - 1;
    while (i > 0) {
      if (!(patterns[i] instanceof Function)) {
        patterns[i] = (function(x) {
          return function() {
            return x;
          };
        })(patterns[i]);
      }
      patterns[i] = lateBindFirst(patterns[i]);
      i = i - 2;
    }
    return withDesc(new Bacon.Desc(Bacon, "update", [initial].concat(slice.call(patterns))), Bacon.when.apply(Bacon, patterns).scan(initial, (function(x, f) {
      return f(x);
    })));
  };

  Bacon.zipAsArray = function() {
    var streams;
    streams = argumentsToObservables(arguments);
    return withDesc(new Bacon.Desc(Bacon, "zipAsArray", streams), Bacon.zipWith(streams, function() {
      var xs;
      xs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return xs;
    }));
  };

  Bacon.zipWith = function() {
    var f, ref1, streams;
    ref1 = argumentsToObservablesAndFunction(arguments), streams = ref1[0], f = ref1[1];
    streams = _.map((function(s) {
      return s.toEventStream();
    }), streams);
    return withDesc(new Bacon.Desc(Bacon, "zipWith", [f].concat(slice.call(streams))), Bacon.when(streams, f));
  };

  Bacon.Observable.prototype.zip = function(other, f) {
    if (f == null) {
      f = Array;
    }
    return withDesc(new Bacon.Desc(this, "zip", [other]), Bacon.zipWith([this, other], f));
  };

  

Bacon.Observable.prototype.first = function () {
  return withDesc(new Bacon.Desc(this, "first", []), this.take(1));
};

Bacon.Observable.prototype.last = function () {
  var lastEvent;

  return withDesc(new Bacon.Desc(this, "last", []), this.withHandler(function (event) {
    if (event.isEnd()) {
      if (lastEvent) {
        this.push(lastEvent);
      }
      this.push(endEvent());
      return Bacon.noMore;
    } else {
      lastEvent = event;
    }
  }));
};

Bacon.EventStream.prototype.throttle = function (delay) {
  return withDesc(new Bacon.Desc(this, "throttle", [delay]), this.bufferWithTime(delay).map(function (values) {
    return values[values.length - 1];
  }));
};

Bacon.Property.prototype.throttle = function (delay) {
  return this.delayChanges(new Bacon.Desc(this, "throttle", [delay]), function (changes) {
    return changes.throttle(delay);
  });
};

Observable.prototype.firstToPromise = function (PromiseCtr) {
  var _this = this;

  if (typeof PromiseCtr !== "function") {
    if (typeof Promise === "function") {
      PromiseCtr = Promise;
    } else {
      throw new Exception("There isn't default Promise, use shim or parameter");
    }
  }

  return new PromiseCtr(function (resolve, reject) {
    return _this.subscribe(function (event) {
      if (event.hasValue()) {
        resolve(event.value());
      }
      if (event.isError()) {
        reject(event.error);
      }

      return Bacon.noMore;
    });
  });
};

Observable.prototype.toPromise = function (PromiseCtr) {
  return this.last().firstToPromise(PromiseCtr);
};

if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
    define([], function() {
      return Bacon;
    });
    this.Bacon = Bacon;
  } else if ((typeof module !== "undefined" && module !== null) && (module.exports != null)) {
    module.exports = Bacon;
    Bacon.Bacon = Bacon;
  } else {
    this.Bacon = Bacon;
  }

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
var _arity = require('./internal/_arity');
var _curry2 = require('./internal/_curry2');


/**
 * Creates a function that is bound to a context.
 * Note: `R.bind` does not provide the additional argument-binding capabilities of
 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
 *
 * @func
 * @memberOf R
 * @category Function
 * @category Object
 * @see R.partial
 * @sig (* -> *) -> {*} -> (* -> *)
 * @param {Function} fn The function to bind to context
 * @param {Object} thisObj The context to bind `fn` to
 * @return {Function} A function that will execute in the context of `thisObj`.
 */
module.exports = _curry2(function bind(fn, thisObj) {
  return _arity(fn.length, function() {
    return fn.apply(thisObj, arguments);
  });
});

},{"./internal/_arity":8,"./internal/_curry2":11}],5:[function(require,module,exports){
var pipe = require('./pipe');
var reverse = require('./reverse');


/**
 * Performs right-to-left function composition. The rightmost function may have
 * any arity; the remaining functions must be unary.
 *
 * @func
 * @memberOf R
 * @category Function
 * @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> (a -> b -> ... -> n -> z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.pipe
 * @example
 *
 *      var f = R.compose(R.inc, R.negate, Math.pow);
 *
 *      f(3, 4); // -(3^4) + 1
 */
module.exports = function compose() {
  if (arguments.length === 0) {
    throw new Error('compose requires at least one argument');
  }
  return pipe.apply(this, reverse(arguments));
};

},{"./pipe":20,"./reverse":22}],6:[function(require,module,exports){
var _curry1 = require('./internal/_curry1');
var curryN = require('./curryN');


/**
 * Returns a curried equivalent of the provided function. The curried
 * function has two unusual capabilities. First, its arguments needn't
 * be provided one at a time. If `f` is a ternary function and `g` is
 * `R.curry(f)`, the following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value `R.__` may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is `R.__`,
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @category Function
 * @sig (* -> a) -> (* -> a)
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curryN
 * @example
 *
 *      var addFourNumbers = function(a, b, c, d) {
 *        return a + b + c + d;
 *      };
 *
 *      var curriedAddFourNumbers = R.curry(addFourNumbers);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
module.exports = _curry1(function curry(fn) {
  return curryN(fn.length, fn);
});

},{"./curryN":7,"./internal/_curry1":10}],7:[function(require,module,exports){
var _arity = require('./internal/_arity');
var _curry1 = require('./internal/_curry1');
var _curry2 = require('./internal/_curry2');
var _curryN = require('./internal/_curryN');


/**
 * Returns a curried equivalent of the provided function, with the
 * specified arity. The curried function has two unusual capabilities.
 * First, its arguments needn't be provided one at a time. If `g` is
 * `R.curryN(3, f)`, the following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value `R.__` may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is `R.__`,
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      var addFourNumbers = function() {
 *        return R.sum([].slice.call(arguments, 0, 4));
 *      };
 *
 *      var curriedAddFourNumbers = R.curryN(4, addFourNumbers);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
module.exports = _curry2(function curryN(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }
  return _arity(length, _curryN(length, [], fn));
});

},{"./internal/_arity":8,"./internal/_curry1":10,"./internal/_curry2":11,"./internal/_curryN":13}],8:[function(require,module,exports){
module.exports = function _arity(n, fn) {
  // jshint unused:vars
  switch (n) {
    case 0: return function() { return fn.apply(this, arguments); };
    case 1: return function(a0) { return fn.apply(this, arguments); };
    case 2: return function(a0, a1) { return fn.apply(this, arguments); };
    case 3: return function(a0, a1, a2) { return fn.apply(this, arguments); };
    case 4: return function(a0, a1, a2, a3) { return fn.apply(this, arguments); };
    case 5: return function(a0, a1, a2, a3, a4) { return fn.apply(this, arguments); };
    case 6: return function(a0, a1, a2, a3, a4, a5) { return fn.apply(this, arguments); };
    case 7: return function(a0, a1, a2, a3, a4, a5, a6) { return fn.apply(this, arguments); };
    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) { return fn.apply(this, arguments); };
    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) { return fn.apply(this, arguments); };
    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) { return fn.apply(this, arguments); };
    default: throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
};

},{}],9:[function(require,module,exports){
var _isArray = require('./_isArray');
var _slice = require('./_slice');


/**
 * Similar to hasMethod, this checks whether a function has a [methodname]
 * function. If it isn't an array it will execute that function otherwise it will
 * default to the ramda implementation.
 *
 * @private
 * @param {Function} fn ramda implemtation
 * @param {String} methodname property to check for a custom implementation
 * @return {Object} Whatever the return value of the method is.
 */
module.exports = function _checkForMethod(methodname, fn) {
  return function() {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    return (_isArray(obj) || typeof obj[methodname] !== 'function') ?
      fn.apply(this, arguments) :
      obj[methodname].apply(obj, _slice(arguments, 0, length - 1));
  };
};

},{"./_isArray":14,"./_slice":17}],10:[function(require,module,exports){
/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0) {
      return f1;
    } else if (a != null && a['@@functional/placeholder'] === true) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
};

},{}],11:[function(require,module,exports){
var _curry1 = require('./_curry1');


/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry2(fn) {
  return function f2(a, b) {
    var n = arguments.length;
    if (n === 0) {
      return f2;
    } else if (n === 1 && a != null && a['@@functional/placeholder'] === true) {
      return f2;
    } else if (n === 1) {
      return _curry1(function(b) { return fn(a, b); });
    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true &&
                          b != null && b['@@functional/placeholder'] === true) {
      return f2;
    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true) {
      return _curry1(function(a) { return fn(a, b); });
    } else if (n === 2 && b != null && b['@@functional/placeholder'] === true) {
      return _curry1(function(b) { return fn(a, b); });
    } else {
      return fn(a, b);
    }
  };
};

},{"./_curry1":10}],12:[function(require,module,exports){
var _curry1 = require('./_curry1');
var _curry2 = require('./_curry2');


/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry3(fn) {
  return function f3(a, b, c) {
    var n = arguments.length;
    if (n === 0) {
      return f3;
    } else if (n === 1 && a != null && a['@@functional/placeholder'] === true) {
      return f3;
    } else if (n === 1) {
      return _curry2(function(b, c) { return fn(a, b, c); });
    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true &&
                          b != null && b['@@functional/placeholder'] === true) {
      return f3;
    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true) {
      return _curry2(function(a, c) { return fn(a, b, c); });
    } else if (n === 2 && b != null && b['@@functional/placeholder'] === true) {
      return _curry2(function(b, c) { return fn(a, b, c); });
    } else if (n === 2) {
      return _curry1(function(c) { return fn(a, b, c); });
    } else if (n === 3 && a != null && a['@@functional/placeholder'] === true &&
                          b != null && b['@@functional/placeholder'] === true &&
                          c != null && c['@@functional/placeholder'] === true) {
      return f3;
    } else if (n === 3 && a != null && a['@@functional/placeholder'] === true &&
                          b != null && b['@@functional/placeholder'] === true) {
      return _curry2(function(a, b) { return fn(a, b, c); });
    } else if (n === 3 && a != null && a['@@functional/placeholder'] === true &&
                          c != null && c['@@functional/placeholder'] === true) {
      return _curry2(function(a, c) { return fn(a, b, c); });
    } else if (n === 3 && b != null && b['@@functional/placeholder'] === true &&
                          c != null && c['@@functional/placeholder'] === true) {
      return _curry2(function(b, c) { return fn(a, b, c); });
    } else if (n === 3 && a != null && a['@@functional/placeholder'] === true) {
      return _curry1(function(a) { return fn(a, b, c); });
    } else if (n === 3 && b != null && b['@@functional/placeholder'] === true) {
      return _curry1(function(b) { return fn(a, b, c); });
    } else if (n === 3 && c != null && c['@@functional/placeholder'] === true) {
      return _curry1(function(c) { return fn(a, b, c); });
    } else {
      return fn(a, b, c);
    }
  };
};

},{"./_curry1":10,"./_curry2":11}],13:[function(require,module,exports){
var _arity = require('./_arity');


/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @return {array} An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 */
module.exports = function _curryN(length, received, fn) {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length &&
          (received[combinedIdx] == null ||
           received[combinedIdx]['@@functional/placeholder'] !== true ||
           argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (result == null || result['@@functional/placeholder'] !== true) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
  };
};

},{"./_arity":8}],14:[function(require,module,exports){
/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
module.exports = Array.isArray || function _isArray(val) {
  return (val != null &&
          val.length >= 0 &&
          Object.prototype.toString.call(val) === '[object Array]');
};

},{}],15:[function(require,module,exports){
module.exports = function _pipe(f, g) {
  return function() {
    return g.call(this, f.apply(this, arguments));
  };
};

},{}],16:[function(require,module,exports){
var _xwrap = require('./_xwrap');
var bind = require('../bind');
var isArrayLike = require('../isArrayLike');


module.exports = (function() {
  function _arrayReduce(xf, acc, list) {
    var idx = 0, len = list.length;
    while (idx < len) {
      acc = xf['@@transducer/step'](acc, list[idx]);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      idx += 1;
    }
    return xf['@@transducer/result'](acc);
  }

  function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = xf['@@transducer/step'](acc, step.value);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      step = iter.next();
    }
    return xf['@@transducer/result'](acc);
  }

  function _methodReduce(xf, acc, obj) {
    return xf['@@transducer/result'](obj.reduce(bind(xf['@@transducer/step'], xf), acc));
  }

  var symIterator = (typeof Symbol !== 'undefined') ? Symbol.iterator : '@@iterator';
  return function _reduce(fn, acc, list) {
    if (typeof fn === 'function') {
      fn = _xwrap(fn);
    }
    if (isArrayLike(list)) {
      return _arrayReduce(fn, acc, list);
    }
    if (typeof list.reduce === 'function') {
      return _methodReduce(fn, acc, list);
    }
    if (list[symIterator] != null) {
      return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === 'function') {
      return _iterableReduce(fn, acc, list);
    }
    throw new TypeError('reduce: list must be array or iterable');
  };
})();

},{"../bind":4,"../isArrayLike":19,"./_xwrap":18}],17:[function(require,module,exports){
/**
 * An optimized, private array `slice` implementation.
 *
 * @private
 * @param {Arguments|Array} args The array or arguments object to consider.
 * @param {Number} [from=0] The array index to slice from, inclusive.
 * @param {Number} [to=args.length] The array index to slice to, exclusive.
 * @return {Array} A new, sliced array.
 * @example
 *
 *      _slice([1, 2, 3, 4, 5], 1, 3); //=> [2, 3]
 *
 *      var firstThreeArgs = function(a, b, c, d) {
 *        return _slice(arguments, 0, 3);
 *      };
 *      firstThreeArgs(1, 2, 3, 4); //=> [1, 2, 3]
 */
module.exports = function _slice(args, from, to) {
  switch (arguments.length) {
    case 1: return _slice(args, 0, args.length);
    case 2: return _slice(args, from, args.length);
    default:
      var list = [];
      var idx = 0;
      var len = Math.max(0, Math.min(args.length, to) - from);
      while (idx < len) {
        list[idx] = args[from + idx];
        idx += 1;
      }
      return list;
  }
};

},{}],18:[function(require,module,exports){
module.exports = (function() {
  function XWrap(fn) {
    this.f = fn;
  }
  XWrap.prototype['@@transducer/init'] = function() {
    throw new Error('init not implemented on XWrap');
  };
  XWrap.prototype['@@transducer/result'] = function(acc) { return acc; };
  XWrap.prototype['@@transducer/step'] = function(acc, x) {
    return this.f(acc, x);
  };

  return function _xwrap(fn) { return new XWrap(fn); };
}());

},{}],19:[function(require,module,exports){
var _curry1 = require('./internal/_curry1');
var _isArray = require('./internal/_isArray');


/**
 * Tests whether or not an object is similar to an array.
 *
 * @func
 * @memberOf R
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      R.isArrayLike([]); //=> true
 *      R.isArrayLike(true); //=> false
 *      R.isArrayLike({}); //=> false
 *      R.isArrayLike({length: 10}); //=> false
 *      R.isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 */
module.exports = _curry1(function isArrayLike(x) {
  if (_isArray(x)) { return true; }
  if (!x) { return false; }
  if (typeof x !== 'object') { return false; }
  if (x instanceof String) { return false; }
  if (x.nodeType === 1) { return !!x.length; }
  if (x.length === 0) { return true; }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});

},{"./internal/_curry1":10,"./internal/_isArray":14}],20:[function(require,module,exports){
var _pipe = require('./internal/_pipe');
var curryN = require('./curryN');
var reduce = require('./reduce');
var tail = require('./tail');


/**
 * Performs left-to-right function composition. The leftmost function may have
 * any arity; the remaining functions must be unary.
 *
 * In some libraries this function is named `sequence`.
 *
 * @func
 * @memberOf R
 * @category Function
 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> (a -> b -> ... -> n -> z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.compose
 * @example
 *
 *      var f = R.pipe(Math.pow, R.negate, R.inc);
 *
 *      f(3, 4); // -(3^4) + 1
 */
module.exports = function pipe() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }
  return curryN(arguments[0].length,
                reduce(_pipe, arguments[0], tail(arguments)));
};

},{"./curryN":7,"./internal/_pipe":15,"./reduce":21,"./tail":24}],21:[function(require,module,exports){
var _curry3 = require('./internal/_curry3');
var _reduce = require('./internal/_reduce');


/**
 * Returns a single item by iterating through the list, successively calling the iterator
 * function and passing it an accumulator value and the current value from the array, and
 * then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*.  It may use `R.reduced` to
 * shortcut the iteration.
 *
 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse arrays), unlike
 * the native `Array.prototype.reduce` method. For more details on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
 * @see R.reduced
 *
 * @func
 * @memberOf R
 * @category List
 * @sig (a,b -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @example
 *
 *      var numbers = [1, 2, 3];
 *      var add = function(a, b) {
 *        return a + b;
 *      };
 *
 *      R.reduce(add, 10, numbers); //=> 16
 */
module.exports = _curry3(_reduce);

},{"./internal/_curry3":12,"./internal/_reduce":16}],22:[function(require,module,exports){
var _curry1 = require('./internal/_curry1');
var _slice = require('./internal/_slice');


/**
 * Returns a new list with the same elements as the original list, just
 * in the reverse order.
 *
 * @func
 * @memberOf R
 * @category List
 * @sig [a] -> [a]
 * @param {Array} list The list to reverse.
 * @return {Array} A copy of the list in reverse order.
 * @example
 *
 *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
 *      R.reverse([1, 2]);     //=> [2, 1]
 *      R.reverse([1]);        //=> [1]
 *      R.reverse([]);         //=> []
 */
module.exports = _curry1(function reverse(list) {
  return _slice(list).reverse();
});

},{"./internal/_curry1":10,"./internal/_slice":17}],23:[function(require,module,exports){
var _checkForMethod = require('./internal/_checkForMethod');
var _curry3 = require('./internal/_curry3');


/**
 * Returns the elements of the given list or string (or object with a `slice`
 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
 *
 * @func
 * @memberOf R
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @sig Number -> Number -> String -> String
 * @param {Number} fromIndex The start index (inclusive).
 * @param {Number} toIndex The end index (exclusive).
 * @param {*} list
 * @return {*}
 * @example
 *
 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
 */
module.exports = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
  return Array.prototype.slice.call(list, fromIndex, toIndex);
}));

},{"./internal/_checkForMethod":9,"./internal/_curry3":12}],24:[function(require,module,exports){
var _checkForMethod = require('./internal/_checkForMethod');
var slice = require('./slice');


/**
 * Returns all but the first element of the given list or string (or object
 * with a `tail` method).
 *
 * @func
 * @memberOf R
 * @category List
 * @see R.head, R.init, R.last
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @example
 *
 *      R.tail([1, 2, 3]);  //=> [2, 3]
 *      R.tail([1, 2]);     //=> [2]
 *      R.tail([1]);        //=> []
 *      R.tail([]);         //=> []
 *
 *      R.tail('abc');  //=> 'bc'
 *      R.tail('ab');   //=> 'b'
 *      R.tail('a');    //=> ''
 *      R.tail('');     //=> ''
 */
module.exports = _checkForMethod('tail', slice(1, Infinity));

},{"./internal/_checkForMethod":9,"./slice":23}],25:[function(require,module,exports){
'use strict';




var mod = module.exports = angular.module('pd.data.adapter.http', ['pd.data']);



mod.factory('pdDataAdapterHttp', ['$http', function($http){
	return function httpAdapterService(options){

		var transformResult = function(res) {
			return res.data;
		};


		this.createModel = function(model, path) {
			return $http({
				method: 'POST',
				data: model,
				url: options.baseUrl +'/'+ path
			}).then(transformResult, transformResult);
		};



		this.updateModel = function(model, path) {
			return $http({
				method: 'PUT',
				data: model,
				url: options.baseUrl +'/'+ path
			}).then(transformResult, transformResult);
		};



		this.load = function(path) {
			return $http({
				method: 'GET',
				url: options.baseUrl +'/'+ path
			}).then(transformResult, transformResult);
		};



		this.destroyModel = function(model, path) {
			return $http({
				method: 'DELETE',
				data: model,
				url: options.baseUrl +'/'+ path
			}).then(transformResult, transformResult);
		}


	};
}]);

},{}],26:[function(require,module,exports){
'use strict';

/**
 * Angular-Module: pd.data
 * [Description]
 */
var mod = module.exports = angular.module('pd.data', []);

// Providers
mod.provider('Data', require('./providers/data'));


},{"./providers/data":27}],27:[function(require,module,exports){
'use strict';

// deps
var Store = require('./lib/Store.js');

/**
 * Provider: Data
 */
module.exports = [function() {



	this.$get = ['$q', function($q) {

		var Data = {};

		Data.createStore = function() {
			var store = new Store();



			return store;
		};

		return Data;

	}];

}];

},{"./lib/Store.js":32}],28:[function(require,module,exports){
'use strict';



module.exports = Adapter;



function Adapter(store, config) {

	config.adapter.call(this, config.options);

	this.status = function() {

		return {

		}
	}

}

},{}],29:[function(require,module,exports){
'use strict';


var _ = require('./_.js');
var e = require('./e.js');
var Model = require('./Model.js');
var utils = require('./utils.js');



function createCollection(config, resource) {

	var collection = [];




	var whereFilter = utils.where2filter(config.where);





	collection.config = config;

	// private
	var indexOfRaw = utils.indexOfRawInCollection(collection);


	function addOrMerge(raw) {
		var index = indexOfRaw(raw);
		index === -1 && collection.push( collection.newModel(raw) );
	}

	function remove(raw) {
		var index = indexOfRaw(raw);
		if(index > -1) {
			var model = collection[index];
			model._delete();
			collection.splice(index, 1);
		}

	}

	function equipOne(raw) {
		if(!whereFilter(raw)) {
			remove(raw);
		} else {
			addOrMerge(raw);
		}
	}


	// public
	collection.subscribe = function(down) {
		this.down = down.filter( e.filterByFunction( whereFilter ) );

		var on;

		on = e.onStreamValueCallMethod( down );
			on('remove', e.executeWith(remove, 'data'));
			on('equipOne', e.executeWith(equipOne, 'data'));


		on = e.onStreamValueCallMethod( this.down );
			on('add', e.executeWith(addOrMerge, 'data'));

		return this;
	};


	collection.add = function(raw) {
		raw = angular.copy(raw);
		angular.merge(raw, config.where);
		resource.add(raw);
	};

	collection.remove = function(model) {
		resource.remove(model.attr);
	};

	collection.create = function(raw) {
		angular.merge(raw, config.where);
		return resource.create(raw);
	};

	collection.newModel = function(raw, config) {
		var defaultConfig = {
			primary: 'id'
		};

		var _config = angular.merge({}, defaultConfig, resource.config.model, config);

		_config.parentModel = collection.config.parentModel;

		var model = new Model(raw, _config, resource);
		return model;
	}

	collection.load = function() {
		return resource.load();
	}

	utils.registerMethodsOnHost(collection, config.methods);


	return collection;
}

module.exports = createCollection;



},{"./Model.js":30,"./_.js":33,"./e.js":34,"./utils.js":35}],30:[function(require,module,exports){
'use strict';


// deps
var utils = require('./utils.js');



module.exports = Model;



function Model(raw, config, resource) {
	this.attr = raw;

	Object.defineProperty(this, 'id', {
		get: function() {
			return raw[config.primary];
		},
		set: function(val) {
			raw[config.primary] = val;
		}
	});

	this.endpointPath = function() {
		var path='';
		if(config.parentModel) {
			path = config.parentModel.endpointPath() + '/';
		}

		path += resource.config.path;

		if(this.id) {
			path += '/' + this.id;
		}
		return path;
	}

	this.remove = function() {
		resource.remove(this.attr);
	};

	this.save = function() {

		if(this.id) {
			return resource.update(this.attr, this.endpointPath());
		} else {
			return resource.create(this.attr, this.endpointPath());
		}
	};

	this.destroy = function() {
		return resource.destroy(this.attr, this.endpointPath());
	};

	this._delete = function() {
		console.log('TODO: Tidy up relations on delete');
	}

	utils.registerMethodsOnHost(this, config.methods);


	if(config.relations) {
		var model = this;

		if(config.relations.hasMany) {
			Object.keys(config.relations.hasMany).forEach(function(relationResourceName) {

				var relation = config.relations.hasMany[relationResourceName];

				var Resource = resource.store[relationResourceName];

				if(!Resource) {
					throw new Error('Relation resource not found '+relationResourceName);
				}

				if(!relation.field) {
					throw new Error('Relation needs field attribute '+relationResourceName);
				}

				Object.defineProperty(model, relation.field, {
					get: function() {

						var where = {};
						where[relation.identifier] = model.id;

						var config = {
							where: where,
							parentModel: model
						}

						var coll = Resource.collection(config);
						return coll;
					}
				});

			});
		}

	}


}

},{"./utils.js":35}],31:[function(require,module,exports){
'use strict';

// deps
var e = require('./e.js');
var Collection = require('./Collection.js');
var Bacon = require('baconjs');
var utils = require('./utils.js');


function Resource(config, store) {

	var resource = this;

	var defaultConfig = {
	};

	this.config = angular.merge({}, defaultConfig, config);
	this.store = store;

	this.sendDown = new Bacon.Bus();

	// EventSender
	var sendEvent 	= e.sendEvent(this.sendDown, this.config.name);
	var sendAdd 	= sendEvent('add');
	var sendRemove 	= sendEvent('remove');
	var sendEquip 	= sendEvent('equip');
	var sendEquipOne= sendEvent('equipOne');






	this.subscribe = function(down) {
		this.down = down.filter( e.filterByResource(config.name) ).merge(this.sendDown);

		return this;
	};


	var collectionCache = {};
	var itemStore = [];

	this.collection = function(config) {
		config = config || {};

		var name = utils.collectionNameFromConfig(config);

		if(collectionCache[name]) {
			return collectionCache[name];
		} else {
			var defaultConfig = {

			};

			var _config = angular.merge({}, defaultConfig, this.config.collection, config);

			if(config.parentModel) {
				_config.parentModel = config.parentModel;
			}

			var collection = Collection(_config, this).subscribe(this.down);

			collectionCache[name] = collection;
			return collection;
		}
	}

	this.status = function() {
		return {
			collections: Object.keys(collectionCache).length,
			items: itemStore.length
		}
	};


	this.find = function(where) {
		return this.collection({ where: where });
	}






	this.add = function(raw) {
		itemStore.push(raw);
		sendAdd(raw);
	}

	this.remove = function(raw) {
		var index = itemStore.indexOf(raw);
		index > -1 && itemStore.splice(index, 1);
		sendRemove(raw);
	}


	var getAdapter = function() {
		var adapterName = config.adapter || store.defaultAdapterName;

		if(!store.adapters[adapterName]) {
			throw new Error('Cant find adapter '+adapterName);
		}

		return store.adapters[adapterName];
	};


	this.create = function(raw, path) {
		return getAdapter().createModel(raw, path || this.config.path)
		.then(function(res) {
			angular.merge(raw, res);
			itemStore.push(raw);
			sendAdd(raw);
		});
	};

	this.update = function(raw, path) {
		return getAdapter().updateModel(raw, path)
		.then(function() {
			sendEquipOne(raw);
		})
	};

	this.destroy = function(raw, path) {
		return getAdapter().destroyModel(raw, path)
		.then(function() {
			resource.remove(raw);
		});
	};

	this.load = function(path, query) {
		return getAdapter().load(path || this.config.path)
		.then(function(items) {
			items.forEach(function(item) {
				resource.add(item);
			});
		})
	};

}

module.exports = Resource;

},{"./Collection.js":29,"./e.js":34,"./utils.js":35,"baconjs":3}],32:[function(require,module,exports){
'use strict';


// deps
var Bacon = require('baconjs');
var e = require('./e.js');
var Resource = require('./Resource.js');
var Adapter = require('./Adapter.js');

module.exports = Store;

function Store() {

	this.down = new Bacon.Bus();
	this.adapters = {};
	this.defaultAdapterName;

	var resources = {};

	this.defineResource = function(config) {

		if(!config.name) {
			throw new Error('Missing name on resource');
		}

		if(!config.path) {
			throw new Error('Missing path on resource '+config.name);
		}

		var defaultConfig = {

		};

		var _config = angular.merge({}, defaultConfig, config);
		var resource = new Resource(_config, this).subscribe(this.down);

		this[config.name] = resource;
		resources[config.name] = resource;
		return resource;
	}



	this.connect = function(name, config) {
		if(this.adapters[name]) {
			throw new Error('Adapter '+name+' already connected.');
		}

		if(!this.defaultAdapterName) {
			this.defaultAdapterName = name;
		}

		var adapter = new Adapter(this, config);
		this.adapters[name] = adapter;
		return adapter;
	}


	this.status = function() {
		var adapterNames = Object.keys(this.adapters);
		var resourcesNames = Object.keys(resources);
		var adapters = this.adapters;

		var status = {
			resources: {
				count: resourcesNames.length,
				status: {}
			},
			adapters: {
				count: adapterNames.length,
				status: {}
			}
		};


		angular.forEach(resources, function(value, key){
			status.resources.status[key] = value.status();
		});

		angular.forEach(adapters, function(value, key){
			status.adapters.status[key] = value.status();
		});




		return status;
	}

}


},{"./Adapter.js":28,"./Resource.js":31,"./e.js":34,"baconjs":3}],33:[function(require,module,exports){
'use strict';


var _ = module.exports = {};


// Borrow curry and compose from ramda
_.curry = require('ramda/src/curry.js');
_.compose = require('ramda/src/compose.js');

},{"ramda/src/compose.js":5,"ramda/src/curry.js":6}],34:[function(require,module,exports){
'use strict';

var _ = require('./_.js');
var e = module.exports = {};
var utils = require('./utils.js');





e.filterBy = _.curry(function(key, val, event){
	return event[key] === val;
});

e.get = _.curry(function(key, event) {
	return event[key];
});





e.filterByMethod 	= e.filterBy('method');
e.filterByResource 	= e.filterBy('resource');


e.filterByFunction	= _.curry(function(method) {
	return _.compose( method, e.getData());
});

e.filterByWhere		= _.curry(function(where) {
	return e.filterByFunction( utils.where2filter(where) );
});




e.getMethod 		= e.get('method');
e.getData 			= e.get('data');
e.getResource 		= e.get('resource');


e.execute = _.curry(function(handler, arg) {
	return handler(arg);
});


e.executeWith = _.curry(function(handler, getter) {
	return _.compose(e.execute(handler), e.get(getter));
});





e.onStreamValueCallMethod = _.curry(function(stream, method, handler) {
	stream
		.filter( e.filterByMethod(method) )
		.assign( handler );
});



e.sendEvent = _.curry(function(stream, resource, method, data){
	stream.push({
		method: method,
		resource: resource,
		data: data
	});
});

},{"./_.js":33,"./utils.js":35}],35:[function(require,module,exports){
'use strict';

var _ = require('./_.js');

var utils = module.exports = {};


utils.where2filter = _.curry(function(where, data) {

	if(!where) {
		return true;
	}

	return Object.keys(where).every(function(key) {
		return where[key] === data[key];
	});

});



utils.collection2rawArray = function(collection) {
	return collection.map(function(model) { return model.attr; });
}

utils.indexOfRawInCollection = _.curry(function(collection, raw) {
	var arr = utils.collection2rawArray(collection);
	return arr.indexOf(raw);
});



utils.registerMethodsOnHost = _.curry(function(host, methods) {
	if(methods) {
		Object.keys(methods).forEach(function(name) {
			host[name] = methods[name].bind(host);
		});
	}
});




utils.string2hash = function(string) {
	var hash = 0, i, chr, len;
	if (string.length == 0) return hash;
	for (i = 0, len = string.length; i < len; i++) {
		chr   = string.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return String(hash);
};


utils.collectionNameFromConfig = function(config) {

	return this.string2hash(JSON.stringify(config.where || {}));

};

},{"./_.js":33}]},{},[1]);
