/**
 * mopidy-mopify - v1.0.0 - 2014-12-30
 * 
 *
 * Copyright (c) 2014 Dirk Groenen
 * Licensed Apache License <http://www.apache.org/licenses/LICENSE-2.0.txt>
 */
/*! Mopidy.js v0.4.0 - built 2014-06-24
 * http://www.mopidy.com/
 * Copyright (c) 2014 Stein Magnus Jodal and contributors
 * Licensed under the Apache License, Version 2.0 */
!function(a){if("object"==typeof exports)module.exports=a();else if("function"==typeof define&&define.amd)define(a);else{var b;"undefined"!=typeof window?b=window:"undefined"!=typeof global?b=global:"undefined"!=typeof self&&(b=self),b.Mopidy=a()}}(function(){var a;return function b(a,c,d){function e(g,h){if(!c[g]){if(!a[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};a[g][0].call(j.exports,function(b){var c=a[g][1][b];return e(c?c:b)},j,j.exports,b,a,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){b.exports={Client:window.WebSocket}},{}],2:[function(b,c){("function"==typeof a&&a.amd&&function(b){a("bane",b)}||"object"==typeof c&&function(a){c.exports=a()}||function(a){this.bane=a()})(function(){"use strict";function a(a,b,c){var d,e=c.length;if(e>0)for(d=0;e>d;++d)c[d](a,b);else setTimeout(function(){throw b.message=a+" listener threw error: "+b.message,b},0)}function b(a){if("function"!=typeof a)throw new TypeError("Listener is not function");return a}function c(a){return a.supervisors||(a.supervisors=[]),a.supervisors}function d(a,b){return a.listeners||(a.listeners={}),b&&!a.listeners[b]&&(a.listeners[b]=[]),b?a.listeners[b]:a.listeners}function e(a){return a.errbacks||(a.errbacks=[]),a.errbacks}function f(f){function h(b,c,d){try{c.listener.apply(c.thisp||f,d)}catch(g){a(b,g,e(f))}}return f=f||{},f.on=function(a,e,f){return"function"==typeof a?c(this).push({listener:a,thisp:e}):void d(this,a).push({listener:b(e),thisp:f})},f.off=function(a,b){var f,g,h,i;if(!a){f=c(this),f.splice(0,f.length),g=d(this);for(h in g)g.hasOwnProperty(h)&&(f=d(this,h),f.splice(0,f.length));return f=e(this),void f.splice(0,f.length)}if("function"==typeof a?(f=c(this),b=a):f=d(this,a),!b)return void f.splice(0,f.length);for(h=0,i=f.length;i>h;++h)if(f[h].listener===b)return void f.splice(h,1)},f.once=function(a,b,c){var d=function(){f.off(a,d),b.apply(this,arguments)};f.on(a,d,c)},f.bind=function(a,b){var c,d,e;if(b)for(d=0,e=b.length;e>d;++d){if("function"!=typeof a[b[d]])throw new Error("No such method "+b[d]);this.on(b[d],a[b[d]],a)}else for(c in a)"function"==typeof a[c]&&this.on(c,a[c],a);return a},f.emit=function(a){var b,e,f=c(this),i=g.call(arguments);for(b=0,e=f.length;e>b;++b)h(a,f[b],i);for(f=d(this,a).slice(),i=g.call(arguments,1),b=0,e=f.length;e>b;++b)h(a,f[b],i)},f.errback=function(a){this.errbacks||(this.errbacks=[]),this.errbacks.push(b(a))},f}var g=Array.prototype.slice;return{createEventEmitter:f,aggregate:function(a){var b=f();return a.forEach(function(a){a.on(function(a,c){b.emit(a,c)})}),b}}})},{}],3:[function(a,b){function c(){}var d=b.exports={};d.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),d.title="browser",d.browser=!0,d.env={},d.argv=[],d.on=c,d.addListener=c,d.once=c,d.off=c,d.removeListener=c,d.removeAllListeners=c,d.emit=c,d.binding=function(){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(){throw new Error("process.chdir is not supported")}},{}],4:[function(b,c){!function(a){"use strict";a(function(a){var b=a("./makePromise"),c=a("./scheduler"),d=a("./async");return b({scheduler:new c(d)})})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})},{"./async":7,"./makePromise":17,"./scheduler":18}],5:[function(b,c){!function(a){"use strict";a(function(){function a(a){this.head=this.tail=this.length=0,this.buffer=new Array(1<<a)}return a.prototype.push=function(a){return this.length===this.buffer.length&&this._ensureCapacity(2*this.length),this.buffer[this.tail]=a,this.tail=this.tail+1&this.buffer.length-1,++this.length,this.length},a.prototype.shift=function(){var a=this.buffer[this.head];return this.buffer[this.head]=void 0,this.head=this.head+1&this.buffer.length-1,--this.length,a},a.prototype._ensureCapacity=function(a){var b,c=this.head,d=this.buffer,e=new Array(a),f=0;if(0===c)for(b=this.length;b>f;++f)e[f]=d[f];else{for(a=d.length,b=this.tail;a>c;++f,++c)e[f]=d[c];for(c=0;b>c;++f,++c)e[f]=d[c]}this.buffer=e,this.head=0,this.tail=this.length},a})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],6:[function(b,c){!function(a){"use strict";a(function(){function a(b){Error.call(this),this.message=b,this.name=a.name,"function"==typeof Error.captureStackTrace&&Error.captureStackTrace(this,a)}return a.prototype=Object.create(Error.prototype),a.prototype.constructor=a,a})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],7:[function(b,c){(function(d){!function(a){"use strict";a(function(a){var b,c;return b="undefined"!=typeof d&&null!==d&&"function"==typeof d.nextTick?function(a){d.nextTick(a)}:(c="function"==typeof MutationObserver&&MutationObserver||"function"==typeof WebKitMutationObserver&&WebKitMutationObserver)?function(a,b){function c(){var a=d;d=void 0,a()}var d,e=a.createElement("div"),f=new b(c);return f.observe(e,{attributes:!0}),function(a){d=a,e.setAttribute("class","x")}}(document,c):function(a){try{return a("vertx").runOnLoop||a("vertx").runOnContext}catch(b){}var c=setTimeout;return function(a){c(a,0)}}(a)})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})}).call(this,b("FWaASH"))},{FWaASH:3}],8:[function(b,c){!function(a){"use strict";a(function(){return function(a){function b(b){return new a(function(a,c){function d(a){f.push(a),0===--e&&c(f)}var e=0,f=[];k.call(b,function(b){++e,l(b).then(a,d)}),0===e&&a()})}function c(b,c){return new a(function(a,d,e){function f(b){i>0&&(--i,j.push(b),0===i&&a(j))}function g(a){h>0&&(--h,m.push(a),0===h&&d(m))}var h,i=0,j=[],m=[];return k.call(b,function(a){++i,l(a).then(f,g,e)}),c=Math.max(c,0),h=i-c+1,i=Math.min(c,i),0===i?void a(j):void 0})}function d(a,b,c){return m(h.call(a,function(a){return l(a).then(b,c)}))}function e(a){return m(h.call(a,function(a){function b(){return a.inspect()}return a=l(a),a.then(b,b)}))}function f(a,b){function c(a,c,d){return l(a).then(function(a){return l(c).then(function(c){return b(a,c,d)})})}return arguments.length>2?i.call(a,c,arguments[2]):i.call(a,c)}function g(a,b){function c(a,c,d){return l(a).then(function(a){return l(c).then(function(c){return b(a,c,d)})})}return arguments.length>2?j.call(a,c,arguments[2]):j.call(a,c)}var h=Array.prototype.map,i=Array.prototype.reduce,j=Array.prototype.reduceRight,k=Array.prototype.forEach,l=a.resolve,m=a.all;return a.any=b,a.some=c,a.settle=e,a.map=d,a.reduce=f,a.reduceRight=g,a.prototype.spread=function(a){return this.then(m).then(function(b){return a.apply(void 0,b)})},a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],9:[function(b,c){!function(a){"use strict";a(function(){function a(){throw new TypeError("catch predicate must be a function")}function b(a,b){return c(b)?a instanceof b:b(a)}function c(a){return a===Error||null!=a&&a.prototype instanceof Error}function d(a,b){return function(){return a.call(this),b}}function e(){}return function(c){function f(a,c){return function(d){return b(d,c)?a.call(this,d):g(d)}}var g=c.reject,h=c.prototype["catch"];return c.prototype.done=function(a,b){var c=this._handler;c.when({resolve:this._maybeFatal,notify:e,context:this,receiver:c.receiver,fulfilled:a,rejected:b,progress:void 0})},c.prototype["catch"]=c.prototype.otherwise=function(b){return 1===arguments.length?h.call(this,b):"function"!=typeof b?this.ensure(a):h.call(this,f(arguments[1],b))},c.prototype["finally"]=c.prototype.ensure=function(a){return"function"!=typeof a?this:(a=d(a,this),this.then(a,a))},c.prototype["else"]=c.prototype.orElse=function(a){return this.then(void 0,function(){return a})},c.prototype["yield"]=function(a){return this.then(function(){return a})},c.prototype.tap=function(a){return this.then(a)["yield"](this)},c}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],10:[function(b,c){!function(a){"use strict";a(function(){return function(a){return a.prototype.fold=function(a,b){var c=this._beget();return this._handler.fold(c._handler,a,b),c},a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],11:[function(b,c){!function(a){"use strict";a(function(){return function(a){return a.prototype.inspect=function(){return this._handler.inspect()},a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],12:[function(b,c){!function(a){"use strict";a(function(){return function(a){function b(a,b,d,e){return c(function(b){return[b,a(b)]},b,d,e)}function c(a,b,e,f){function g(f,g){return d(e(f)).then(function(){return c(a,b,e,g)})}return d(f).then(function(c){return d(b(c)).then(function(b){return b?c:d(a(c)).spread(g)})})}var d=a.resolve;return a.iterate=b,a.unfold=c,a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],13:[function(b,c){!function(a){"use strict";a(function(){return function(a){return a.prototype.progress=function(a){return this.then(void 0,void 0,a)},a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],14:[function(b,c){!function(a){"use strict";a(function(a){var b=a("../timer"),c=a("../TimeoutError");return function(a){return a.prototype.delay=function(a){var c=this._beget(),d=c._handler;return this._handler.map(function(c){b.set(function(){d.resolve(c)},a)},d),c},a.prototype.timeout=function(a,d){function e(){h.reject(f?d:new c("timed out after "+a+"ms"))}var f=arguments.length>1,g=this._beget(),h=g._handler,i=b.set(e,a);return this._handler.chain(h,function(a){b.clear(i),this.resolve(a)},function(a){b.clear(i),this.reject(a)},h.notify),g},a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})},{"../TimeoutError":6,"../timer":19}],15:[function(b,c){!function(a){"use strict";a(function(a){function b(a){var b="object"==typeof a&&a.stack?a.stack:c(a);return a instanceof Error?b:b+" (WARNING: non-Error used)"}function c(a){var b=String(a);return"[object Object]"===b&&"undefined"!=typeof JSON&&(b=d(a,b)),b}function d(a,b){try{return JSON.stringify(a)}catch(a){return b}}function e(a){throw a}function f(){}var g=a("../timer");return function(a){function d(a){a.handled||(n.push(a),k("Potentially unhandled rejection ["+a.id+"] "+b(a.value)))}function h(a){var b=n.indexOf(a);b>=0&&(n.splice(b,1),l("Handled previous rejection ["+a.id+"] "+c(a.value)))}function i(a,b){m.push(a,b),o||(o=!0,o=g.set(j,0))}function j(){for(o=!1;m.length>0;)m.shift()(m.shift())}var k=f,l=f;"undefined"!=typeof console&&(k="undefined"!=typeof console.error?function(a){console.error(a)}:function(a){console.log(a)},l="undefined"!=typeof console.info?function(a){console.info(a)}:function(a){console.log(a)}),a.onPotentiallyUnhandledRejection=function(a){i(d,a)},a.onPotentiallyUnhandledRejectionHandled=function(a){i(h,a)},a.onFatalRejection=function(a){i(e,a.value)};var m=[],n=[],o=!1;return a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})},{"../timer":19}],16:[function(b,c){!function(a){"use strict";a(function(){return function(a){return a.prototype["with"]=a.prototype.withThis=a.prototype._bindContext,a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],17:[function(b,c){!function(a){"use strict";a(function(){return function(a){function b(a,b){this._handler=a===m?b:c(a)}function c(a){function b(a){e.resolve(a)}function c(a){e.reject(a)}function d(a){e.notify(a)}var e=new n;try{a(b,c,d)}catch(f){c(f)}return e}function d(a){return k(a)?a:new b(m,new p(j(a)))}function e(a){return new b(m,new p(new t(a)))}function f(){return M}function g(){return new b(m,new n)}function h(a){function c(a,b,c,d){c.map(function(a){b[d]=a,0===--i&&this.become(new s(b))},a)}var d,e,f,g,h=new n,i=a.length>>>0,j=new Array(i);for(d=0;d<a.length;++d)if(f=a[d],void 0!==f||d in a)if(C(f))if(e=k(f)?f._handler.join():l(f),g=e.state(),0===g)c(h,j,e,d);else{if(!(g>0)){h.become(e);break}j[d]=e.value,--i}else j[d]=f,--i;else--i;return 0===i&&h.become(new s(j)),new b(m,h)}function i(a){if(Object(a)===a&&0===a.length)return f();var c,d,e=new n;for(c=0;c<a.length;++c)d=a[c],void 0!==d&&c in a&&j(d).chain(e,e.resolve,e.reject);return new b(m,e)}function j(a){return k(a)?a._handler.join():C(a)?l(a):new s(a)}function k(a){return a instanceof b}function l(a){try{var b=a.then;return"function"==typeof b?new r(b,a):new s(a)}catch(c){return new t(c)}}function m(){}function n(a,c){b.createContext(this,c),this.consumers=void 0,this.receiver=a,this.handler=void 0,this.resolved=!1}function o(a){this.handler=a}function p(a){o.call(this,a)}function q(a,b){o.call(this,a),this.receiver=b}function r(a,b){n.call(this),I.enqueue(new A(a,b,this))}function s(a){b.createContext(this),this.value=a}function t(a){b.createContext(this),this.id=++K,this.value=a,this.handled=!1,this.reported=!1,this._report()}function u(a,c){a.handled||(a.reported=!0,b.onPotentiallyUnhandledRejection(a,c))}function v(a){a.reported&&b.onPotentiallyUnhandledRejectionHandled(a)}function w(){t.call(this,new TypeError("Promise cycle"))}function x(){return{state:"pending"}}function y(a,b){this.continuation=a,this.handler=b}function z(a,b){this.handler=a,this.value=b}function A(a,b,c){this._then=a,this.thenable=b,this.resolver=c}function B(a,b,c,d,e){try{a.call(b,c,d,e)}catch(f){d(f)}}function C(a){return("object"==typeof a||"function"==typeof a)&&null!==a}function D(a,b,c){try{return a.call(c,b)}catch(d){return e(d)}}function E(a,b,c,d){try{return a.call(d,b,c)}catch(f){return e(f)}}function F(a,b,c){try{return a.call(c,b)}catch(d){return d}}function G(a,b){b.prototype=J(a.prototype),b.prototype.constructor=b}function H(){}var I=a.scheduler,J=Object.create||function(a){function b(){}return b.prototype=a,new b};b.resolve=d,b.reject=e,b.never=f,b._defer=g,b.prototype.then=function(a,c){var d=this._handler;if("function"!=typeof a&&d.join().state()>0)return new b(m,d);var e=this._beget(),f=e._handler;return d.when({resolve:f.resolve,notify:f.notify,context:f,receiver:d.receiver,fulfilled:a,rejected:c,progress:arguments.length>2?arguments[2]:void 0}),e},b.prototype["catch"]=function(a){return this.then(void 0,a)},b.prototype._bindContext=function(a){return new b(m,new q(this._handler,a))},b.prototype._beget=function(){var a=this._handler,b=new n(a.receiver,a.join().context);return new this.constructor(m,b)},b.prototype._maybeFatal=function(a){if(C(a)){var b=j(a),c=this._handler.context;b.catchError(function(){this._fatal(c)},b)}},b.all=h,b.race=i,m.prototype.when=m.prototype.resolve=m.prototype.reject=m.prototype.notify=m.prototype._fatal=m.prototype._unreport=m.prototype._report=H,m.prototype.inspect=x,m.prototype._state=0,m.prototype.state=function(){return this._state},m.prototype.join=function(){for(var a=this;void 0!==a.handler;)a=a.handler;return a},m.prototype.chain=function(a,b,c,d){this.when({resolve:H,notify:H,context:void 0,receiver:a,fulfilled:b,rejected:c,progress:d})},m.prototype.map=function(a,b){this.chain(b,a,b.reject,b.notify)},m.prototype.catchError=function(a,b){this.chain(b,b.resolve,a,b.notify)},m.prototype.fold=function(a,b,c){this.join().map(function(a){j(c).map(function(c){this.resolve(E(b,c,a,this.receiver))},this)},a)},G(m,n),n.prototype._state=0,n.prototype.inspect=function(){return this.resolved?this.join().inspect():x()},n.prototype.resolve=function(a){this.resolved||this.become(j(a))},n.prototype.reject=function(a){this.resolved||this.become(new t(a))},n.prototype.join=function(){if(this.resolved){for(var a=this;void 0!==a.handler;)if(a=a.handler,a===this)return this.handler=new w;return a}return this},n.prototype.run=function(){var a=this.consumers,b=this.join();this.consumers=void 0;for(var c=0;c<a.length;++c)b.when(a[c])},n.prototype.become=function(a){this.resolved=!0,this.handler=a,void 0!==this.consumers&&I.enqueue(this),void 0!==this.context&&a._report(this.context)},n.prototype.when=function(a){this.resolved?I.enqueue(new y(a,this.handler)):void 0===this.consumers?this.consumers=[a]:this.consumers.push(a)},n.prototype.notify=function(a){this.resolved||I.enqueue(new z(this,a))},n.prototype._report=function(a){this.resolved&&this.handler.join()._report(a)},n.prototype._unreport=function(){this.resolved&&this.handler.join()._unreport()},n.prototype._fatal=function(a){var b="undefined"==typeof a?this.context:a;this.resolved&&this.handler.join()._fatal(b)},G(m,o),o.prototype.inspect=function(){return this.join().inspect()},o.prototype._report=function(a){this.join()._report(a)},o.prototype._unreport=function(){this.join()._unreport()},G(o,p),p.prototype.when=function(a){I.enqueue(new y(a,this.join()))},G(o,q),q.prototype.when=function(a){void 0!==this.receiver&&(a.receiver=this.receiver),this.join().when(a)},G(n,r),G(m,s),s.prototype._state=1,s.prototype.inspect=function(){return{state:"fulfilled",value:this.value}},s.prototype.when=function(a){var c;"function"==typeof a.fulfilled?(b.enterContext(this),c=D(a.fulfilled,this.value,a.receiver),b.exitContext()):c=this.value,a.resolve.call(a.context,c)};var K=0;G(m,t),t.prototype._state=-1,t.prototype.inspect=function(){return{state:"rejected",reason:this.value}},t.prototype.when=function(a){var c;"function"==typeof a.rejected?(this._unreport(),b.enterContext(this),c=D(a.rejected,this.value,a.receiver),b.exitContext()):c=new b(m,this),a.resolve.call(a.context,c)},t.prototype._report=function(a){I.afterQueue(u,this,a)},t.prototype._unreport=function(){this.handled=!0,I.afterQueue(v,this)},t.prototype._fatal=function(a){b.onFatalRejection(this,a)},b.createContext=b.enterContext=b.exitContext=b.onPotentiallyUnhandledRejection=b.onPotentiallyUnhandledRejectionHandled=b.onFatalRejection=H;var L=new m,M=new b(m,L);return G(t,w),y.prototype.run=function(){this.handler.join().when(this.continuation)},z.prototype.run=function(){var a=this.handler.consumers;if(void 0!==a)for(var b=0;b<a.length;++b)this._notify(a[b])},z.prototype._notify=function(a){var b="function"==typeof a.progress?F(a.progress,this.value,a.receiver):this.value;a.notify.call(a.context,b)},A.prototype.run=function(){function a(a){d.resolve(a)}function b(a){d.reject(a)}function c(a){d.notify(a)}var d=this.resolver;B(this._then,this.thenable,a,b,c)},b}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],18:[function(b,c){!function(a){"use strict";a(function(a){function b(a){this._enqueue=a,this._handlerQueue=new c(15),this._afterQueue=new c(5),this._running=!1;var b=this;this.drain=function(){b._drain()}}var c=a("./Queue");return b.prototype.enqueue=function(a){this._handlerQueue.push(a),this._running||(this._running=!0,this._enqueue(this.drain))},b.prototype.afterQueue=function(a,b,c){this._afterQueue.push(a),this._afterQueue.push(b),this._afterQueue.push(c),this._running||(this._running=!0,this._enqueue(this.drain))},b.prototype._drain=function(){for(var a=this._handlerQueue;a.length>0;)a.shift().run();for(this._running=!1,a=this._afterQueue;a.length>0;)a.shift()(a.shift(),a.shift())},b})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})},{"./Queue":5}],19:[function(b,c){!function(a){"use strict";a(function(a){var b,c,d,e;b=a;try{c=b("vertx"),d=function(a,b){return c.setTimer(b,a)},e=c.cancelTimer}catch(f){d=function(a,b){return setTimeout(a,b)},e=function(a){return clearTimeout(a)}}return{set:d,clear:e}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})},{}],20:[function(b,c){!function(a){"use strict";a(function(a){function b(a,b,c){var d=z.resolve(a);return arguments.length<2?d:arguments.length>3?d.then(b,c,arguments[3]):d.then(b,c)}function c(a){return new z(a)}function d(a){return function(){return f(a,this,A.call(arguments))}}function e(a){return f(a,this,A.call(arguments,1))}function f(a,b,c){return z.all(c).then(function(c){return a.apply(b,c)})}function g(){return new h}function h(){function a(a){d._handler.resolve(a)}function b(a){d._handler.reject(a)}function c(a){d._handler.notify(a)}var d=z._defer();this.promise=d,this.resolve=a,this.reject=b,this.notify=c,this.resolver={resolve:a,reject:b,notify:c}}function i(a){return a&&"function"==typeof a.then}function j(){return z.all(arguments)}function k(a){return b(a,z.all)}function l(a){return b(a,z.settle)}function m(a,c){return b(a,function(a){return z.map(a,c)})}function n(a){var c=A.call(arguments,1);return b(a,function(a){return c.unshift(a),z.reduce.apply(z,c)})}function o(a){var c=A.call(arguments,1);return b(a,function(a){return c.unshift(a),z.reduceRight.apply(z,c)})}var p=a("./lib/decorators/timed"),q=a("./lib/decorators/array"),r=a("./lib/decorators/flow"),s=a("./lib/decorators/fold"),t=a("./lib/decorators/inspect"),u=a("./lib/decorators/iterate"),v=a("./lib/decorators/progress"),w=a("./lib/decorators/with"),x=a("./lib/decorators/unhandledRejection"),y=a("./lib/TimeoutError"),z=[q,r,s,u,v,t,w,p,x].reduce(function(a,b){return b(a)},a("./lib/Promise")),A=Array.prototype.slice;return b.promise=c,b.resolve=z.resolve,b.reject=z.reject,b.lift=d,b["try"]=e,b.attempt=e,b.iterate=z.iterate,b.unfold=z.unfold,b.join=j,b.all=k,b.settle=l,b.any=d(z.any),b.some=d(z.some),b.map=m,b.reduce=n,b.reduceRight=o,b.isPromiseLike=i,b.Promise=z,b.defer=g,b.TimeoutError=y,b})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})},{"./lib/Promise":4,"./lib/TimeoutError":6,"./lib/decorators/array":8,"./lib/decorators/flow":9,"./lib/decorators/fold":10,"./lib/decorators/inspect":11,"./lib/decorators/iterate":12,"./lib/decorators/progress":13,"./lib/decorators/timed":14,"./lib/decorators/unhandledRejection":15,"./lib/decorators/with":16}],21:[function(a,b){function c(a){return this instanceof c?(this._console=this._getConsole(a||{}),this._settings=this._configure(a||{}),this._backoffDelay=this._settings.backoffDelayMin,this._pendingRequests={},this._webSocket=null,d.createEventEmitter(this),this._delegateEvents(),void(this._settings.autoConnect&&this.connect())):new c(a)}var d=a("bane"),e=a("../lib/websocket/"),f=a("when");c.ConnectionError=function(a){this.name="ConnectionError",this.message=a},c.ConnectionError.prototype=new Error,c.ConnectionError.prototype.constructor=c.ConnectionError,c.ServerError=function(a){this.name="ServerError",this.message=a},c.ServerError.prototype=new Error,c.ServerError.prototype.constructor=c.ServerError,c.WebSocket=e.Client,c.prototype._getConsole=function(a){if("undefined"!=typeof a.console)return a.console;var b="undefined"!=typeof console&&console||{};return b.log=b.log||function(){},b.warn=b.warn||function(){},b.error=b.error||function(){},b},c.prototype._configure=function(a){var b="undefined"!=typeof document&&document.location.host||"localhost";return a.webSocketUrl=a.webSocketUrl||"ws://"+b+"/mopidy/ws",a.autoConnect!==!1&&(a.autoConnect=!0),a.backoffDelayMin=a.backoffDelayMin||1e3,a.backoffDelayMax=a.backoffDelayMax||64e3,"undefined"==typeof a.callingConvention&&this._console.warn("Mopidy.js is using the default calling convention. The default will change in the future. You should explicitly specify which calling convention you use."),a.callingConvention=a.callingConvention||"by-position-only",a},c.prototype._delegateEvents=function(){this.off("websocket:close"),this.off("websocket:error"),this.off("websocket:incomingMessage"),this.off("websocket:open"),this.off("state:offline"),this.on("websocket:close",this._cleanup),this.on("websocket:error",this._handleWebSocketError),this.on("websocket:incomingMessage",this._handleMessage),this.on("websocket:open",this._resetBackoffDelay),this.on("websocket:open",this._getApiSpec),this.on("state:offline",this._reconnect)},c.prototype.connect=function(){if(this._webSocket){if(this._webSocket.readyState===c.WebSocket.OPEN)return;this._webSocket.close()}this._webSocket=this._settings.webSocket||new c.WebSocket(this._settings.webSocketUrl),this._webSocket.onclose=function(a){this.emit("websocket:close",a)}.bind(this),this._webSocket.onerror=function(a){this.emit("websocket:error",a)}.bind(this),this._webSocket.onopen=function(){this.emit("websocket:open")}.bind(this),this._webSocket.onmessage=function(a){this.emit("websocket:incomingMessage",a)}.bind(this)},c.prototype._cleanup=function(a){Object.keys(this._pendingRequests).forEach(function(b){var d=this._pendingRequests[b];delete this._pendingRequests[b];var e=new c.ConnectionError("WebSocket closed");e.closeEvent=a,d.reject(e)}.bind(this)),this.emit("state:offline")},c.prototype._reconnect=function(){this.emit("reconnectionPending",{timeToAttempt:this._backoffDelay}),setTimeout(function(){this.emit("reconnecting"),this.connect()}.bind(this),this._backoffDelay),this._backoffDelay=2*this._backoffDelay,this._backoffDelay>this._settings.backoffDelayMax&&(this._backoffDelay=this._settings.backoffDelayMax)},c.prototype._resetBackoffDelay=function(){this._backoffDelay=this._settings.backoffDelayMin},c.prototype.close=function(){this.off("state:offline",this._reconnect),this._webSocket.close()},c.prototype._handleWebSocketError=function(a){this._console.warn("WebSocket error:",a.stack||a)},c.prototype._send=function(a){switch(this._webSocket.readyState){case c.WebSocket.CONNECTING:return f.reject(new c.ConnectionError("WebSocket is still connecting"));case c.WebSocket.CLOSING:return f.reject(new c.ConnectionError("WebSocket is closing"));case c.WebSocket.CLOSED:return f.reject(new c.ConnectionError("WebSocket is closed"));default:var b=f.defer();return a.jsonrpc="2.0",a.id=this._nextRequestId(),this._pendingRequests[a.id]=b.resolver,this._webSocket.send(JSON.stringify(a)),this.emit("websocket:outgoingMessage",a),b.promise}},c.prototype._nextRequestId=function(){var a=-1;return function(){return a+=1}}(),c.prototype._handleMessage=function(a){try{var b=JSON.parse(a.data);b.hasOwnProperty("id")?this._handleResponse(b):b.hasOwnProperty("event")?this._handleEvent(b):this._console.warn("Unknown message type received. Message was: "+a.data)}catch(c){if(!(c instanceof SyntaxError))throw c;this._console.warn("WebSocket message parsing failed. Message was: "+a.data)}},c.prototype._handleResponse=function(a){if(!this._pendingRequests.hasOwnProperty(a.id))return void this._console.warn("Unexpected response received. Message was:",a);var b,d=this._pendingRequests[a.id];delete this._pendingRequests[a.id],a.hasOwnProperty("result")?d.resolve(a.result):a.hasOwnProperty("error")?(b=new c.ServerError(a.error.message),b.code=a.error.code,b.data=a.error.data,d.reject(b),this._console.warn("Server returned error:",a.error)):(b=new Error("Response without 'result' or 'error' received"),b.data={response:a},d.reject(b),this._console.warn("Response without 'result' or 'error' received. Message was:",a))},c.prototype._handleEvent=function(a){var b=a.event,c=a;delete c.event,this.emit("event:"+this._snakeToCamel(b),c)},c.prototype._getApiSpec=function(){return this._send({method:"core.describe"}).then(this._createApi.bind(this)).catch(this._handleWebSocketError)},c.prototype._createApi=function(a){var b="by-position-or-by-name"===this._settings.callingConvention,c=function(a){return function(){var c={method:a};return 0===arguments.length?this._send(c):b?arguments.length>1?f.reject(new Error("Expected zero arguments, a single array, or a single object.")):Array.isArray(arguments[0])||arguments[0]===Object(arguments[0])?(c.params=arguments[0],this._send(c)):f.reject(new TypeError("Expected an array or an object.")):(c.params=Array.prototype.slice.call(arguments),this._send(c))}.bind(this)}.bind(this),d=function(a){var b=a.split(".");return b.length>=1&&"core"===b[0]&&(b=b.slice(1)),b},e=function(a){var b=this;return a.forEach(function(a){a=this._snakeToCamel(a),b[a]=b[a]||{},b=b[a]}.bind(this)),b}.bind(this),g=function(b){var f=d(b),g=this._snakeToCamel(f.slice(-1)[0]),h=e(f.slice(0,-1));h[g]=c(b),h[g].description=a[b].description,h[g].params=a[b].params}.bind(this);Object.keys(a).forEach(g),this.emit("state:online")},c.prototype._snakeToCamel=function(a){return a.replace(/(_[a-z])/g,function(a){return a.toUpperCase().replace("_","")})},b.exports=c},{"../lib/websocket/":1,bane:2,when:20}]},{},[21])(21)});;/**
 * angular-echonest module
 * https://github.com/kraku/angular-echonest
 *
 * Author: Maciej Podsiedlak - http://mpodsiedlak.com
 */

(function() {
    'use strict';

    angular.module('angular-echonest', []).provider('Echonest', function() {
        var apiUrl = 'http://developer.echonest.com/api/v4/';
        var apiKey = '';
        var Artist, Artists, Songs, Playlist, obj, http, q;

        var query = function(url, data) {
            var deferred = q.defer();

            data.api_key = apiKey;
            data.format = 'jsonp';
            data.callback = 'JSON_CALLBACK';

            http({
                method: 'JSONP',
                url: apiUrl + url,
                params: data
            }).success(function(result) {
                deferred.resolve(result.response);
            });

            return deferred.promise;
        };

        var artistGet = function(name, data) {
            var deferred = q.defer();
            var t = this;
            data = data || {};

            data.id = t.id;

            query('artist/' + name, data).then(function(result) {
                t[name] = result[name];

                deferred.resolve(t);
            });

            return deferred.promise;
        };

        var getParams = function(params) {
            var data = [];

            if (params instanceof Object) {
                for (var i in params) {
                    if (params.hasOwnProperty(i)) {
                        data[i] = params[i];
                    }
                }
            }

            return data;
        };

        var artistsGet = function(name, data) {
            return query('artist/' + name, data).then(function(result) {
                var artists = [];

                for (var i in result.artists) {
                    artists.push(new Artist(result.artists[i]));
                }

                return artists;
            });
        };

        this.setApiKey = function(value) {
            apiKey = value;
        };


        // Artist class
        Artist = function(props) {
            if (props instanceof Object) {
                for (var i in props) {
                    if (props.hasOwnProperty(i)) {
                        this[i] = props[i];
                    }
                }
            }

            return this;
        };

        Artist.prototype = {
            getBiographies: function(data) {
                return artistGet.call(this, 'biographies', data);
            },
            getBlogs: function(data) {
                return artistGet.call(this, 'blogs', data);
            },
            getImages: function(data) {
                return artistGet.call(this, 'images', data);
            },
            getNews: function(data) {
                return artistGet.call(this, 'news', data);
            },
            getReviews: function(data) {
                return artistGet.call(this, 'reviews', data);
            },
            getSongs: function(data) {
                return artistGet.call(this, 'songs', data);
            },
            getFamiliarity: function(data) {
                return artistGet.call(this, 'familiarity', data);
            },
            getHotnes: function(data) {
                return artistGet.call(this, 'hotttnesss', data);
            },
            getSimilar: function(data) {
                return artistGet.call(this, 'similar', data);
            },
            getTerms: function(data) {
                return artistGet.call(this, 'terms', data);
            },
            getTwitter: function(data) {
                return artistGet.call(this, 'twitter', data);
            },
            getUrls: function(data) {
                return artistGet.call(this, 'urls', data);
            }
        };


        // Artists class
        Artists = function() {
            return this;
        };

        Artists.prototype = {

            /*
             * Search artists
             *
             * doc: http://developer.echonest.com/docs/v4/artist.html#search
             */
            search: function(params) {
                var data = getParams(params);

                return artistsGet.call(this, 'search', data);
            },

            /*
             * Get artist
             *
             * doc: http://developer.echonest.com/docs/v4/artist.html#profile
             */
            get: function(data) {
                if (data instanceof Object) {
                    return query('artist/profile', data).then(function(data) {
                        return new Artist(data.artist);
                    });
                }
            },

            /*
             * Return a list of the top hottt artists.
             *
             * doc: http://developer.echonest.com/docs/v4/artist.html#top-hottt
             */
            topHot: function(params) {
                var data = getParams(params);

                return artistsGet.call(this, 'top_hottt', data);
            },

            /*
             * Suggest artists based upon partial names.
             *
             * doc: http://developer.echonest.com/docs/v4/artist.html#suggest-beta
             */
            suggest: function(params) {
                var data = getParams(params);

                return artistsGet.call(this, 'suggest', data);
            },

            /*
             * Extract artist names from text.
             *
             * doc: http://developer.echonest.com/docs/v4/artist.html#extract-beta
             */
            extract: function(params) {
                var data = getParams(params);

                return artistsGet.call(this, 'extract', data);
            }
        };

        // Songs class
        Songs = function() {
            return this;
        };

        Songs.prototype = {

            /*
             * Search for songs given different query types.
             *
             * doc: http://developer.echonest.com/docs/v4/song.html#search
             */
            search: function(params) {
                var data = getParams(params);

                return query('song/search', data).then(function(result) {
                    return result.songs;
                });
            },

            /*
             * Get info about songs given a list of ids.
             *
             * doc: http://developer.echonest.com/docs/v4/song.html#profile
             */
            get: function(data) {
                if (data instanceof Object) {
                    return query('song/profile', data).then(function(result) {
                        return result.songs[0];
                    });
                }
            },

            /*
             * Identifies a song given an Echoprint or Echo Nest Musical Fingerprint hash codes.
             *
             * doc: http://developer.echonest.com/docs/v4/song.html#identify
             */
            identify: function(params) {
                var data = getParams(params);

                return query('song/identify', data).then(function(result) {
                    return result.songs;
                });
            }
        };


        // Playlists class
        Playlist = function() {
            return this;
        };

        Playlist.prototype = {

            /*
             * Returns a static playlist created from the given parameters
             *
             * doc: http://developer.echonest.com/docs/v4/standard.html#static
             */
            static: function(params) {
                var data = getParams(params);

                return query('playlist/static', data).then(function(result) {
                    return result.songs;
                });
            }
        };


        this.$get = ['$http', '$q', function($http, $q) {
            http = $http;
            q = $q;

            obj = {
                artists: new Artists(),
                songs: new Songs(),
                playlist: new Playlist()
            };

            return obj;
        }];
    });
})();
;(function (window, angular, undefined) {
  'use strict';

  angular
    .module('spotify', [])
    .provider('Spotify', function () {

      // Module global settings.
      var settings = {};
      settings.clientId = null;
      settings.redirectUri = null;
      settings.scope = null;
      settings.accessToken = null;

      this.setClientId = function (clientId) {
        settings.clientId = clientId;
        return settings.clientId;
      };

      this.getClientId = function () {
        return settings.clientId;
      };

      this.setRedirectUri = function (redirectUri) {
        settings.redirectUri = redirectUri;
        return settings.redirectUri;
      };

      this.getRedirectUri = function () {
        return settings.redirectUri;
      };

      this.setScope = function (scope) {
        settings.scope = scope;
        return settings.scope;
      };

      var utils = {};
      utils.toQueryString = function (obj) {
        var parts = [];
        angular.forEach(obj, function (value, key) {
          this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }, parts);
        return parts.join('&');
      };

      /**
       * API Base URL
       */
      settings.apiBase = 'https://api.spotify.com/v1';

      this.$get = ['$q', '$http', '$window', function ($q, $http, $window) {

        function NgSpotify () {
          this.clientId = settings.clientId;
          this.redirectUri = settings.redirectUri;
          this.apiBase = settings.apiBase;
          this.scope = settings.scope;
          this.accessToken = null;
          this.toQueryString = utils.toQueryString;
        }

        NgSpotify.prototype.api = function (endpoint, method, params, data, headers) {
          var deferred = $q.defer();

          $http({
            url: this.apiBase + endpoint,
            method: method ? method : 'GET',
            params: params,
            data: data,
            headers: headers
          })
          .success(function (data) {
            deferred.resolve(data);
          })
          .error(function (data) {
            deferred.reject(data);
          });
          return deferred.promise;
        };

        /**
         * Search Spotify
         * q = search query
         * type = artist, album or track
         */
        NgSpotify.prototype.search = function (q, type, options) {
          options = options || {};
          options.q = q;
          options.type = type;

          return this.api('/search', 'GET', options);
        };

        /**
          ====================== Albums =====================
         */

        /**
         * Gets an album
         * Pass in album id or spotify uri
         */
        NgSpotify.prototype.getAlbum = function (album) {
          album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];

          return this.api('/albums/' + album);
        };

        /**
         * Gets an album
         * Pass in comma separated string or array of album ids
         */
        NgSpotify.prototype.getAlbums = function (albums) {
          albums = angular.isString(albums) ? albums.split(',') : albums;
          angular.forEach(albums, function (value, index) {
            albums[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/albums', 'GET', {
            ids: albums ? albums.toString() : ''
          });
        };

        /**
         * Get Album Tracks
         * Pass in album id or spotify uri
         */
        NgSpotify.prototype.getAlbumTracks = function (album, options) {
          album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];

          return this.api('/albums/' + album + '/tracks', 'GET', options);
        };

        /**
          ====================== Artists =====================
         */

        /**
         * Get an Artist
         */
        NgSpotify.prototype.getArtist = function (artist) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist);
        };

        /**
         * Get multiple artists
         */
        NgSpotify.prototype.getArtists = function (artists) {
          artists = angular.isString(artists) ? artists.split(',') : artists;
          angular.forEach(artists, function (value, index) {
            artists[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/artists/', 'GET', {
            ids: artists ? artists.toString() : ''
          });
        };

        //Artist Albums
        NgSpotify.prototype.getArtistAlbums = function (artist, options) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist + '/albums', 'GET', options);
        };

        /**
         * Get Artist Top Tracks
         * The country: an ISO 3166-1 alpha-2 country code.
         */
        NgSpotify.prototype.getArtistTopTracks = function (artist, country) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist + '/top-tracks', 'GET', {
            country: country
          });
        };

        NgSpotify.prototype.getRelatedArtists = function (artist) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist + '/related-artists');
        };


        /**
          ====================== Tracks =====================
         */
        NgSpotify.prototype.getTrack = function (track) {
          track = track.indexOf('spotify:') === -1 ? track : track.split(':')[2];

          return this.api('/tracks/' + track);
        };

        NgSpotify.prototype.getTracks = function (tracks) {
          tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/tracks/', 'GET', {
            ids: tracks ? tracks.toString() : ''
          });
        };


        /**
          ====================== Playlists =====================
         */
        NgSpotify.prototype.getUserPlaylists = function (userId, options) {
          return this.api('/users/' + userId + '/playlists', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.getPlaylist = function (userId, playlistId, options) {
          return this.api('/users/' + userId + '/playlists/' + playlistId, 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.getPlaylistTracks = function (userId, playlistId, options) {
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.createPlaylist = function (userId, options) {
          return this.api('/users/' + userId + '/playlists', 'POST', null, options, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.addPlaylistTracks = function (userId, playlistId, tracks, options) {
          tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
          });
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'POST', {
            uris: tracks.toString(),
            position: options ? options.position : null
          }, null, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.removePlaylistTracks = function (userId, playlistId, tracks) {
          tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
          var track;
          angular.forEach(tracks, function (value, index) {
            track = tracks[index];
            tracks[index] = {
              uri: track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track
            };
          });
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'DELETE', null, {
            tracks: tracks
          }, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.replacePlaylistTracks = function (userId, playlistId, tracks) {
          tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
          var track;
          angular.forEach(tracks, function (value, index) {
            track = tracks[index];
            tracks[index] = track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track;
          });
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'PUT', {
            uris: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.updatePlaylistDetails = function (userId, playlistId, options) {
          return this.api('/users/' + userId + '/playlists/' + playlistId, 'PUT', null, options, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        /**
          ====================== User =====================
         */

        NgSpotify.prototype.getUser = function (userId) {
          return this.api('/users/' + userId);
        };

        NgSpotify.prototype.getCurrentUser = function () {
          return this.api('/me', 'GET', null, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        /**
          ====================== User Library =====================
         */
        NgSpotify.prototype.getSavedUserTracks = function (options) {
          return this.api('/me/tracks', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.userTracksContains = function (tracks) {
          tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/me/tracks/contains', 'GET', {
            ids: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.saveUserTracks = function (tracks) {
          tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/me/tracks', 'PUT', {
            ids: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.removeUserTracks = function (tracks) {
          tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/me/tracks', 'DELETE', {
            ids: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        /**
          ====================== Browse =====================
         */
        NgSpotify.prototype.getFeaturedPlaylists = function (options) {
          return this.api('/browse/featured-playlists', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.getNewReleases = function (options) {
          return this.api('/browse/new-releases', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        /**
          ====================== Login =====================
         */
        NgSpotify.prototype.setAuthToken = function (authToken) {
          this.authToken = authToken;
          return this.authToken;
        };

        NgSpotify.prototype.login = function () {
          var deferred = $q.defer();
          var that = this;

          var w = 400,
              h = 500,
              left = (screen.width / 2) - (w / 2),
              top = (screen.height / 2) - (h / 2);

          var params = {
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: this.scope || '',
            response_type: 'token'
          };

          var authWindow = window.open(
            'https://accounts.spotify.com/authorize?' + this.toQueryString(params),
            'Spotify',
            'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left
          );

          function storageChanged (e) {
            if (e.key === 'spotify-token') {
              if (authWindow) {
                authWindow.close();
              }

              that.setAuthToken(e.newValue);
              $window.removeEventListener('storage', storageChanged, false);
              //localStorage.removeItem('spotify-token');

              deferred.resolve(e.newValue);
            }
          }

          $window.addEventListener('storage', storageChanged, false);

          return deferred.promise;
        };

        return new NgSpotify();
      }];

    });

}(window, angular));
;/* ng-infinite-scroll - v1.2.0 - 2014-12-02 */
var mod;mod=angular.module("infinite-scroll",[]),mod.value("THROTTLE_MILLISECONDS",null),mod.directive("infiniteScroll",["$rootScope","$window","$interval","THROTTLE_MILLISECONDS",function(a,b,c,d){return{scope:{infiniteScroll:"&",infiniteScrollContainer:"=",infiniteScrollDistance:"=",infiniteScrollDisabled:"=",infiniteScrollUseDocumentBottom:"="},link:function(e,f,g){var h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x;return x=angular.element(b),t=null,u=null,i=null,j=null,q=!0,w=!1,p=function(a){return a=a[0]||a,isNaN(a.offsetHeight)?a.document.documentElement.clientHeight:a.offsetHeight},r=function(a){return a[0].getBoundingClientRect&&!a.css("none")?a[0].getBoundingClientRect().top+s(a):void 0},s=function(a){return a=a[0]||a,isNaN(window.pageYOffset)?a.document.documentElement.scrollTop:a.ownerDocument.defaultView.pageYOffset},o=function(){var b,c,d,g,h;return j===x?(b=p(j)+s(j[0].document.documentElement),d=r(f)+p(f)):(b=p(j),c=0,void 0!==r(j)&&(c=r(j)),d=r(f)-c+p(f)),w&&(d=p((f[0].ownerDocument||f[0].document).documentElement)),g=d-b,h=g<=p(j)*t+1,h?(i=!0,u?e.$$phase||a.$$phase?e.infiniteScroll():e.$apply(e.infiniteScroll):void 0):i=!1},v=function(a,b){var d,e,f;return f=null,e=0,d=function(){var b;return e=(new Date).getTime(),c.cancel(f),f=null,a.call(),b=null},function(){var g,h;return g=(new Date).getTime(),h=b-(g-e),0>=h?(clearTimeout(f),c.cancel(f),f=null,e=g,a.call()):f?void 0:f=c(d,h,1)}},null!=d&&(o=v(o,d)),e.$on("$destroy",function(){return j.unbind("scroll",o)}),m=function(a){return t=parseFloat(a)||0},e.$watch("infiniteScrollDistance",m),m(e.infiniteScrollDistance),l=function(a){return u=!a,u&&i?(i=!1,o()):void 0},e.$watch("infiniteScrollDisabled",l),l(e.infiniteScrollDisabled),n=function(a){return w=a},e.$watch("infiniteScrollUseDocumentBottom",n),n(e.infiniteScrollUseDocumentBottom),h=function(a){return null!=j&&j.unbind("scroll",o),j=a,null!=a?j.bind("scroll",o):void 0},h(x),k=function(a){if(null!=a&&0!==a.length){if(a instanceof HTMLElement?a=angular.element(a):"function"==typeof a.append?a=angular.element(a[a.length-1]):"string"==typeof a&&(a=angular.element(document.querySelector(a))),null!=a)return h(a);throw new Exception("invalid infinite-scroll-container attribute.")}},e.$watch("infiniteScrollContainer",k),k(e.infiniteScrollContainer||[]),null!=g.infiniteScrollParent&&h(angular.element(f.parent())),null!=g.infiniteScrollImmediateCheck&&(q=e.$eval(g.infiniteScrollImmediateCheck)),c(function(){return q?o():void 0},0,1)}}}]);;angular.module('templates-app', ['account/menu.tmpl.html', 'account/services/facebook/menu.tmpl.html', 'account/services/services.menu.tmpl.html', 'account/services/services.tmpl.html', 'account/services/spotify/menu.tmpl.html', 'account/settings/settings.tmpl.html', 'dashboard/dashboard.tmpl.html', 'discover/browse/browse.tmpl.html', 'discover/featured/featured.tmpl.html', 'discover/menu.tmpl.html', 'discover/newreleases/newreleases.tmpl.html', 'music/artist/artist.tmpl.html', 'music/menu.tmpl.html', 'music/playlists/playlists.tmpl.html', 'music/stations/stations.tmpl.html', 'music/tracklist/tracklist.tmpl.html', 'player/controls/controls.left.tmpl.html', 'player/controls/controls.right.tmpl.html', 'player/player.tmpl.html', 'player/seekbar/seekbar.tmpl.html', 'search/menu.tmpl.html', 'search/search.tmpl.html', 'widgets/album.directive.tmpl.html', 'widgets/album.tmpl.html', 'widgets/artist.directive.tmpl.html', 'widgets/browse.directive.tmpl.html', 'widgets/playlist.directive.tmpl.html', 'widgets/service.directive.tmpl.html', 'widgets/station.directive.tmpl.html', 'widgets/track.directive.tmpl.html']);

angular.module("account/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/menu.tmpl.html",
    "<div class=\"block row\" id=\"yourmusic\">\n" +
    "    <div class=\"title\">Account</div>\n" +
    "    <div class=\"content\">\n" +
    "        <ul>\n" +
    "            <li><a href=\"#/account/settings\">Settings</a></li>\n" +
    "            <li><a href=\"#/account/services\">Services</a></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("account/services/facebook/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/services/facebook/menu.tmpl.html",
    "<section id=\"spotifyuser\" class=\"account\" ng-controller=\"FacebookMenuController\">\n" +
    "    <div class=\"profileimage\">\n" +
    "        <img ng-src=\"{{ userProfile.profile_image }}\" />\n" +
    "    </div>\n" +
    "    <div class=\"content\">\n" +
    "        <span class=\"username\" ng-show=\"authorized\">\n" +
    "            {{ userProfile.first_name }} {{ userProfile.last_name }}\n" +
    "        </span>\n" +
    "        <span class=\"username\" ng-hide=\"authorized\">\n" +
    "        Connecting...\n" +
    "        </span>\n" +
    "        <span class=\"status\">\n" +
    "            <div class=\"connection\" ng-class=\"authorized == true ? 'connected' : 'disconnected'\"></div> {{ authorized == true ? 'connected' : 'disconnected' }} - Facebook\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</section>");
}]);

angular.module("account/services/services.menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/services/services.menu.tmpl.html",
    "<div id=\"accounts\" ng-controller=\"AccountServicesMenuController\">\n" +
    "    <div class=\"title\"><a href=\"#/account/services\">Connected services</a></div>\n" +
    "\n" +
    "    <ng-include ng-if=\"connectedServices.spotify\" src=\"'account/services/spotify/menu.tmpl.html'\"></ng-include>\n" +
    "    <ng-include ng-if=\"connectedServices.facebook\" src=\"'account/services/facebook/menu.tmpl.html'\"></ng-include>\n" +
    "\n" +
    "    <!-- connect left button -->\n" +
    "    <section id=\"addnew\" class=\"account\" ng-hide=\"connectedCount == totalServices || connectedCount == 0\">\n" +
    "        <a href=\"#/account/services\">\n" +
    "            <div class=\"profileimage icon\">\n" +
    "                <i class=\"ss-icon ss-plus\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"content\">\n" +
    "                <span class=\"username\">\n" +
    "                    Connect another\n" +
    "                </span>\n" +
    "                <span class=\"status\">\n" +
    "                    {{ totalServices - connectedCount }} service<span ng-show=\"totalServices - connectedCount != 1\">s</span> not connected\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </a>\n" +
    "    </section>\n" +
    "\n" +
    "    <div ng-if=\"!hasServicesConnected\">\n" +
    "        <div class=\"notify\"><a href=\"#/account/services\">You have no connected services. Click here to connect a service.</a></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("account/services/services.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/services/services.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('./assets/images/services-header.jpg');\">\n" +
    "    <div class=\"col-md-10 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-merge\"></i>  Services</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            services </span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\">\n" +
    "            <div class=\"row\">\n" +
    "                <div ng-repeat=\"service in availableServices\"> \n" +
    "                    <mopify-service service=\"service\" class=\"col-md-2 single-tile service\"></mopify-service>\n" +
    "                    <div ng-if=\"($index + 1) % 6 == 0\" class=\"row\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("account/services/spotify/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/services/spotify/menu.tmpl.html",
    "<section id=\"spotifyuser\" class=\"account\" ng-controller=\"SpotifyMenuController\">\n" +
    "    <div class=\"profileimage\">\n" +
    "        <img ng-src=\"{{ userProfile.images[0].url }}\" />\n" +
    "    </div>\n" +
    "    <div class=\"content\">\n" +
    "        <span class=\"username\" ng-show=\"authorized\">\n" +
    "            {{ userProfile.display_name }}\n" +
    "        </span>\n" +
    "        <span class=\"username\" ng-hide=\"authorized\">\n" +
    "        Connecting...\n" +
    "        </span>\n" +
    "        <span class=\"status\">\n" +
    "            <div class=\"connection\" ng-class=\"authorized == true ? 'connected' : 'disconnected'\"></div> {{ authorized == true ? 'connected' : 'disconnected' }} - Spotify\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</section>");
}]);

angular.module("account/settings/settings.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("account/settings/settings.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('./assets/images/settings-header.jpg');\">\n" +
    "    <div class=\"col-md-10 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-settings\"></i>  Settings</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Settings <span class=\"sub\">Mopidy</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 col-md-offset-6 alignright\">\n" +
    "            <div class=\"button white\" ng-class=\"{ active: buttonactive }\">\n" +
    "                <span class=\"text\">Saved automatically</span>\n" +
    "                <i class=\"ss-icon ss-sync\"></i> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label for=\"mopidyip\">Mopidy IP address</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <input name=\"mopidyip\" placeholder=\"For example: 192.168.1.1 or localhost\" ng-model=\"settings.mopidyip\" ng-blur=\"highlightSaveButton()\" class=\"field\"/>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>Change this IP address if Mopidy is running on an other computer than Mopify. Normally you don't have to change this IP address</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label for=\"mopidyport\">Mopidy port</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <input name=\"mopidyport\" placeholder=\"For example: 6680\" ng-model=\"settings.mopidyport\" ng-blur=\"highlightSaveButton()\" class=\"field\"/>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>Change this port if Mopidy is running on an other port than 6680. Normally you don't have to change this port.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Settings <span class=\"sub\">Localization</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label for=\"mopidyip\">Language code</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <input name=\"locale\" placeholder=\"For example: nl_NL\" ng-model=\"settings.locale\" ng-blur=\"highlightSaveButton()\" class=\"field\"/>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>The desired language, consisting of a lowercase <a href=\"http://en.wikipedia.org/wiki/ISO_639\" target=\"_blank\">ISO 639</a> language code and an uppercase <a href=\"http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2\" target=\"_blank\">ISO 3166-1 alpha-2</a> country code, joined by an underscore. </p>\n" +
    "                <p>This language code is used for services like Spotify or Echonest to provide better content.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label for=\"mopidyip\">Country code</label>\n" +
    "            </div>\n" +
    "            <div class=\"input col-md-4\">\n" +
    "                <input name=\"locale\" placeholder=\"For example: NL\" ng-model=\"settings.country\" ng-blur=\"highlightSaveButton()\" class=\"field\"/>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4 col-md-offset-1\">\n" +
    "                <p>An <a href=\"http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2\" target=\"_blank\">ISO 3166-1 alpha-2</a> country code which is used to localize services like Spotify.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            About <span class=\"sub\">Mopify</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Author</label>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4\">\n" +
    "                <p><a href=\"https://github.com/dirkgroenen/mopidy-mopify\" target=\"_blank\">Mopify</a> is a project developed by <a href=\"http://github.com/dirkgroenen\" target=\"_blank\">Dirk Groenen</a>.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>License</label>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4\">\n" +
    "                <p>Licensed under the <a href=\"https://github.com/dirkgroenen/mopidy-mopify/blob/master/LICENSE.md\" target=\"_blank\">Apache 2 license</a>.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"settingwrap row\">\n" +
    "            <div class=\"label col-md-2\">\n" +
    "                <label>Version</label>\n" +
    "            </div>\n" +
    "            <div class=\"description col-md-4\">\n" +
    "                <p>Current version: {{ mopifyversion }}</p>\n" +
    "                <p ng-if=\"newversion\" style=\"font-weight: bold\">A new version of Mopify is available ({{ newversion }}). Read the <a href=\"https://github.com/dirkgroenen/mopidy-mopify/blob/master/README.md\" target=\"_blank\">Github readme</a> on how to update mopify.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("dashboard/dashboard.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dashboard/dashboard.tmpl.html",
    "");
}]);

angular.module("discover/browse/browse.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("discover/browse/browse.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('./assets/images/discover-header.jpg');\">\n" +
    "    <div class=\"col-md-4 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-list\"></i>  Browse</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Discover <span class=\"sub\">Browse</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"browsewrap\" infinite-scroll=\"buildblocks()\" infinite-scroll-distance=\"1\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-3\">\n" +
    "                     <div ng-repeat=\"item in blocks\" ng-if=\"$index % 4 == 0\">\n" +
    "                        <mopify-browse item=\"item\"></mopify-browse>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3\">\n" +
    "                    <div ng-repeat=\"item in blocks\" ng-if=\"$index % 4 == 1\">\n" +
    "                        <mopify-browse item=\"item\"></mopify-browse>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3\">\n" +
    "                    <div ng-repeat=\"item in blocks\" ng-if=\"$index % 4 == 2\">\n" +
    "                        <mopify-browse item=\"item\"></mopify-browse>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-3\">\n" +
    "                    <div ng-repeat=\"item in blocks\" ng-if=\"$index % 4 == 3\">\n" +
    "                        <mopify-browse item=\"item\"></mopify-browse>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("discover/featured/featured.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("discover/featured/featured.tmpl.html",
    "<div id=\"header\" class=\"big row\" style=\"background-image: url('./assets/images/discover-header.jpg');\">\n" +
    "    <div id=\"featured\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-8 col-md-offset-2\">\n" +
    "                <div class=\"title\">\n" +
    "                    {{ titletext }}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\" ng-show=\"headerplaylist.tracks !== undefined\">\n" +
    "            <div class=\"playlist col-md-4 col-md-offset-4\">\n" +
    "                <div class=\"cover\">\n" +
    "                    <img ng-src=\"{{ headerplaylist.images[0].url }}\" />\n" +
    "                </div>\n" +
    "                <div class=\"details\">\n" +
    "                    <div class=\"tracklist\">\n" +
    "                        <div class=\"row track\" ng-repeat=\"track in headerplaylist.tracks\" >\n" +
    "                            <div class=\"col-md-7 name\">\n" +
    "                                {{ track.name }}    \n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-5 artist\">\n" +
    "                                {{ track.artiststring }}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"hoverwrap\">\n" +
    "                    <div class=\"iconwrap row\">\n" +
    "                        <div class=\"icon small col-md-4\">\n" +
    "                            <a href=\"#/music/tracklist/{{ headerplaylist.uri }}\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "                        </div>\n" +
    "                        <div class=\"icon col-md-4\">\n" +
    "                            <i class=\"ss-icon ss-play\" ng-click=\"playHeaderPlaylist()\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"icon small col-md-4\">\n" +
    "                            <i class=\"ss-icon ss-wifi\" ng-click=\"startHeaderPlaylistStation()\"></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Discover <span class=\"sub\">Featured</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\">\n" +
    "            <div class=\"row\">\n" +
    "                <div ng-repeat=\"playlist in featuredplaylists\"> \n" +
    "                    <mopify-playlist playlist=\"playlist\" class=\"col-md-2 single-tile\"></mopify-playlist>\n" +
    "                    <div ng-if=\"($index + 1) % 6 == 0\" class=\"row\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("discover/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("discover/menu.tmpl.html",
    "<div class=\"block row\" id=\"discover\">\n" +
    "    <div class=\"title\">Discover</div>\n" +
    "    <div class=\"content\">\n" +
    "        <ul>\n" +
    "            <li><a href=\"#/discover/browse\">Browse</a></li>\n" +
    "            <li><a href=\"#/discover/featured\">Featured playlists</a></li>\n" +
    "            <li><a href=\"#/discover/newreleases\">New releases</a></li>\n" +
    "        </ul>   \n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("discover/newreleases/newreleases.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("discover/newreleases/newreleases.tmpl.html",
    "<div id=\"header\" class=\"big row\" style=\"background-image: url('https://d2c87l0yth4zbw.global.ssl.fastly.net/i/home/lifestyle-hero-lg.jpg');\">\n" +
    "    <div id=\"featured\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-8 col-md-offset-2\">\n" +
    "                <div class=\"title\">\n" +
    "                    {{ titletext }}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\" ng-show=\"headeralbum.tracks !== undefined\">\n" +
    "            <div class=\"playlist col-md-4 col-md-offset-4\">\n" +
    "                <div class=\"cover\">\n" +
    "                    <img ng-src=\"{{ headeralbum.images[0].url }}\" />\n" +
    "                </div>\n" +
    "                <div class=\"details\">\n" +
    "                    <div class=\"tracklist\">\n" +
    "                        <div class=\"row track\" ng-repeat=\"track in headeralbum.tracks\" >\n" +
    "                            <div class=\"col-md-7 name\">\n" +
    "                                {{ track.name }}    \n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-5 artist\">\n" +
    "                                {{ track.artiststring }}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"hoverwrap\">\n" +
    "                    <div class=\"iconwrap row\">\n" +
    "                        <div class=\"icon small col-md-4\">\n" +
    "                            <a href=\"#/music/tracklist/{{ headeralbum.uri }}\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "                        </div>\n" +
    "                        <div class=\"icon col-md-4\">\n" +
    "                            <i class=\"ss-icon ss-play\" ng-click=\"playHeaderAlbum()\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"icon small col-md-4\">\n" +
    "                            <i class=\"ss-icon ss-wifi\" ng-click=\"startHeaderAlbumStation()\"></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Discover <span class=\"sub\">New releases</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\">\n" +
    "            <div class=\"row\">\n" +
    "                <div ng-repeat=\"album in newreleases\"> \n" +
    "                    <mopify-album album=\"album\" class=\"col-md-2 single-tile\"></mopify-album>\n" +
    "                    <div ng-if=\"($index + 1) % 6 == 0\" class=\"row\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("music/artist/artist.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("music/artist/artist.tmpl.html",
    "<div id=\"header\" class=\"small row\" ng-class=\"(currentview.id == 'bio') ? 'big' : ''\" style=\"background-image: url('{{ artist.coverimage }}');\">\n" +
    "    <div class=\"col-md-4 lefttext\">\n" +
    "        <div class=\"inner\">{{ artist.name }}</div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-4 centertext\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-4 music\"><a href=\"#/music/artist/{{ artistId }}\" ng-class=\"{ 'active': currentview.id == 'music' }\" ng-click=\"setView('music')\">Music</a></div>\n" +
    "            <div class=\"col-md-4 biography\"><a href=\"#/music/artist/{{ artistId }}\" ng-class=\"{ 'active': currentview.id == 'bio' }\" ng-click=\"setView('bio')\">Biography</a></div>\n" +
    "            <div class=\"col-md-4 related\"><a href=\"#/music/artist/{{ artistId }}\" ng-class=\"{ 'active': currentview.id == 'related' }\" ng-click=\"setView('related')\">Related Artists</a></div>\n" +
    "        </div>  \n" +
    "    </div>\n" +
    "</div>\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\" ng-if=\"currentview.id == 'music'\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            {{ artist.name }} <span class=\"sub\">Top tracks</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\" >\n" +
    "            <div class=\"button white\" ng-click=\"startStation()\">\n" +
    "                <span class=\"text\">Start station</span>\n" +
    "                <i class=\"ss-icon ss-wifi\"></i> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\" ng-if=\"currentview.id == 'music'\">\n" +
    "        <div id=\"tracklist\">\n" +
    "            <div class=\"row\" ng-repeat=\"track in toptracks\" >\n" +
    "                <mopify-track track=\"track\" surrounding=\"toptracks\" currentplayingtrack=\"currentPlayingTrack\" type=\"type\"> </mopify-track>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            {{ artist.name }} <span class=\"sub\">{{ currentview.name }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\" ng-if=\"currentview.id != 'music'\">\n" +
    "            <div class=\"button white\" ng-click=\"startStation()\">\n" +
    "                <span class=\"text\">Start station</span>\n" +
    "                <i class=\"ss-icon ss-wifi\"></i> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\" ng-if=\"currentview.id == 'music'\">\n" +
    "            <div ng-repeat=\"album in albums\"> \n" +
    "                <mopify-album album=\"album\" class=\"single-tile col-md-2\"></mopify-album>\n" +
    "                <div ng-if=\"($index + 1) % 6 == 0\" class=\"row\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"textcontent\" ng-if=\"currentview.id == 'bio'\">\n" +
    "            {{ artist.bio.text }}\n" +
    "        </div>\n" +
    "\n" +
    "        <div id=\"tileview\" ng-if=\"currentview.id == 'related'\">\n" +
    "            <div ng-repeat=\"relatedartist in related\"> \n" +
    "                <mopify-artist artist=\"relatedartist\" class=\"single-tile col-md-2\"></mopify-artist>\n" +
    "                <div ng-if=\"($index + 1) % 6 == 0\" class=\"row\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("music/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("music/menu.tmpl.html",
    "<div class=\"block row\" id=\"yourmusic\">\n" +
    "    <div class=\"title\">Your music</div>\n" +
    "    <div class=\"content\">\n" +
    "        <ul>\n" +
    "            <li><a href=\"#/music/playlists\">Playlists</a></li>\n" +
    "            <li><a href=\"#/music/stations\">Stations</a></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("music/playlists/playlists.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("music/playlists/playlists.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('./assets/images/playlists-header.jpg');\">\n" +
    "    <div class=\"col-md-4 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-list\"></i>  Playlists</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Your Music <span class=\"sub\">Playlists</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\">\n" +
    "            <div class=\"row\">\n" +
    "                <div ng-repeat=\"playlist in playlists\"> \n" +
    "                    <mopify-playlist playlist=\"playlist\" class=\"col-md-2 single-tile\"></mopify-playlist>\n" +
    "                    <div ng-if=\"($index + 1) % 6 == 0\" class=\"row\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("music/stations/stations.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("music/stations/stations.tmpl.html",
    "<div id=\"header\" class=\"row\" ng-class=\"headerSize\" style=\"background-image: url('./assets/images/stations-header.jpg');\">\n" +
    "    <div class=\"col-md-4 lefttext\" ng-hide=\"creatingRadio\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-wifi\"></i>  Stations</div>\n" +
    "    </div>\n" +
    "    <div ng-show=\"creatingRadio\" id=\"radiosearch\" ng-class=\"wrapclass\">\n" +
    "        <div class=\"col-md-8 col-md-offset-2\">\n" +
    "            <div class=\"title\">\n" +
    "                Sit back, relax and enjoy\n" +
    "            </div>\n" +
    "            <div class=\"inputwrap\">\n" +
    "                <input type=\"text\" ng-model=\"searchQuery\" ng-keyup=\"search($event)\" placeholder=\"Search for an artist, album or song\"/>\n" +
    "            </div>\n" +
    "            <div class=\"resultswrap\">\n" +
    "                <ul>\n" +
    "                    <li class=\"divider\">Albums</li>\n" +
    "                    <li class=\"result\" ng-repeat=\"result in searchResults.albums.items\" ng-click=\"startFromNew('album', result)\">\n" +
    "                        <div class=\"thumb\">\n" +
    "                            <img ng-src=\"{{ result.images[0].url }}\" />\n" +
    "                        </div>\n" +
    "                        <div class=\"text\">\n" +
    "                            {{ result.name }}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"divider\">Artists</li>\n" +
    "                    <li class=\"result\" ng-repeat=\"result in searchResults.artists.items\" ng-click=\"startFromNew('artist', result)\">\n" +
    "                        <div class=\"thumb\">\n" +
    "                            <img ng-src=\"{{ result.images[0].url }}\" />\n" +
    "                        </div>\n" +
    "                        <div class=\"text\">\n" +
    "                            {{ result.name }}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"divider\">Tracks</li>\n" +
    "                    <li class=\"result\" ng-repeat=\"result in searchResults.tracks.items\" ng-click=\"startFromNew('track', result)\">\n" +
    "                        <div class=\"thumb\">\n" +
    "                            <img ng-src=\"{{ result.album.images[0].url }}\" />\n" +
    "                        </div>\n" +
    "                        <div class=\"text\">\n" +
    "                            {{ result.name }} - {{ buildArtistString(result.artists) }}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"divider\">Playlists</li>\n" +
    "                    <li class=\"result\" ng-if=\"spotifyConnected\" ng-repeat=\"result in searchResults.playlists.items\" ng-click=\"startFromNew('track', result)\">\n" +
    "                        <div class=\"text\">\n" +
    "                            {{ result.name }} - {{ result.owner.id }}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"result\" ng-if=\"!spotifyConnected\">\n" +
    "                        <div class=\"text\">\n" +
    "                            If you want to search through Spotify playlists you first have to connect with Spotify\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Stations <span class=\"sub\">Recently played</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 col-md-offset-6 alignright\">\n" +
    "            <div class=\"button white\" ng-click=\"create()\">\n" +
    "                <span class=\"text\">Create new</span>\n" +
    "                <i class=\"ss-icon ss-wifi\"></i> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tileview\">\n" +
    "            <div class=\"row\">\n" +
    "                <div ng-repeat=\"station in stations | reverse\">\n" +
    "                    <mopify-station station=\"station\" class=\"col-md-2 single-tile\"></mopify-station>\n" +
    "                    <div ng-if=\"($index + 1) % 6 == 0\" class=\"row\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("music/tracklist/tracklist.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("music/tracklist/tracklist.tmpl.html",
    "<div id=\"header\" class=\"small row\" style=\"background-image: url('{{ coverImage }}');\">\n" +
    "    <div class=\"col-md-10 lefttext\">\n" +
    "        <div class=\"inner\"><i class=\"ss-icon ss-list\"></i>  {{ name }}</div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    <div class=\"pagetitle row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            tracks <span class=\"sub\">{{ type }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6 col-md-offset-3 alignright\">\n" +
    "            <div class=\"button white\" ng-click=\"startStation()\">\n" +
    "                <span class=\"text\">Start station</span>\n" +
    "                <i class=\"ss-icon ss-wifi\"></i> \n" +
    "            </div>\n" +
    "            <div class=\"button white\" ng-click=\"shuffle()\" ng-if=\"type != 'tracklist'\">\n" +
    "                <span class=\"text\">Shuffle {{ type }}</span>\n" +
    "                <i class=\"ss-icon ss-shuffle\"></i> \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagecontent row\">\n" +
    "        <div id=\"tracklist\" infinite-scroll=\"getMoreTracks()\" infinite-scroll-distance=\"1\">\n" +
    "            <div class=\"row\" ng-repeat=\"track in tracks track by $index\" >\n" +
    "                <mopify-track track=\"track\" surrounding=\"tracks\" currentplayingtrack=\"currentPlayingTrack\" type=\"type\"> </mopify-track>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("player/controls/controls.left.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("player/controls/controls.left.tmpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"iconwrap\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <a href=\"#/music/tracklist/mopidy:current\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <i class=\"ss-icon ss-navigateleft\" ng-click=\"prev();\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <i class=\"ss-icon {{ stateIcon }}\" ng-click=\"playpause();\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <i class=\"ss-icon ss-navigateright\" ng-click=\"next();\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("player/controls/controls.right.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("player/controls/controls.right.tmpl.html",
    "<div class=\"row\">\n" +
    "    <div class=\"iconwrap\">\n" +
    "        <div class=\"col-md-2\">\n" +
    "            <i class=\"ss-icon ss-shuffle\" ng-class=\"{ 'active': isRandom }\" ng-click=\"toggleShuffle();\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2\">\n" +
    "            <i class=\"ss-icon ss-repeat\" ng-class=\"{ 'active': isRepeat }\" ng-click=\"toggleRepeat();\"></i>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-8\">\n" +
    "            <i class=\"ss-icon {{ volumeIcon }}\"></i>\n" +
    "            <div class=\"volumebar\" ng-click=\"volumebarMouseClick($event)\" ng-mousedown=\"volumebarMouseDown($event)\" ng-mouseup=\"volumebarMouseUp($event)\" ng-mousemove=\"volumebarMouseMove($event)\">\n" +
    "                <div class=\"outer\">\n" +
    "                    <div class=\"inner\" style=\"width: {{ volume }}%;\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("player/player.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("player/player.tmpl.html",
    "<div class=\"bgimage\">\n" +
    "    <img ng-src=\"{{ playerBackground }}\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-2 controlwrap left\" ng-controller=\"PlayerControlsController\">\n" +
    "        <ng-include src=\"'player/controls/controls.left.tmpl.html'\"></ng-include>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-8\" id=\"seekbar\">\n" +
    "        <div class=\"trackname\">\n" +
    "            <span class=\"title\">{{ trackTitle }}</span> <span class=\"delimiter\">-</span> <span class=\"artist\">{{ trackArtist }}</span>\n" +
    "        </div>\n" +
    "        <div ng-controller=\"PlayerSeekbarController\">\n" +
    "            <ng-include src=\"'player/seekbar/seekbar.tmpl.html'\"></ng-include>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-2 controlwrap right\" ng-controller=\"PlayerControlsController\">\n" +
    "        <ng-include src=\"'player/controls/controls.right.tmpl.html'\"></ng-include>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("player/seekbar/seekbar.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("player/seekbar/seekbar.tmpl.html",
    "<div class=\"barwrap\">\n" +
    "    <div class=\"time\" id=\"passed\">{{ timeCurrent }}</div>\n" +
    "    <div class=\"bar\" ng-mouseup=\"seekbarMouseUp()\" ng-mousedown=\"seekbarMouseDown()\" ng-mousemove=\"seekbarMouseMove($event)\" ng-click=\"seekbarMouseClick($event)\" >\n" +
    "        <div class=\"outer\">\n" +
    "            <div class=\"inner\" style=\"width: {{ seekbarWidth }}%;\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"time\" id=\"total\">{{ timeTotal }}</div>\n" +
    "</div>");
}]);

angular.module("search/menu.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search/menu.tmpl.html",
    "<div class=\"block row\" ng-controller=\"SearchMenuController\">\n" +
    "    <div class=\"content\" id=\"search\">\n" +
    "        <i class=\"ss-icon ss-search\"></i>\n" +
    "        <span class=\"inputwrap\" ng-class=\"{ 'focus': focused }\"><input type=\"text\" name=\"query\" ng-model=\"query\" ng-focus=\"focused = true\" ng-blur=\"focused = false\" placeholder=\"Search\" ng-keyup=\"typing($event)\" /></span>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("search/search.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("search/search.tmpl.html",
    "<div id=\"header\" ng-class=\"{ small: topresult.type == 'tracks', big: topresult.type != 'tracks' }\" style=\"background-image: url('./assets/images/discover-header.jpg');\">\n" +
    "    <div id=\"featured\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-8 col-md-offset-2\">\n" +
    "                <div class=\"title\" ng-hide=\"topresult.item.name === undefined\">\n" +
    "                    Top result: {{ topresult.item.name }}\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"playlist col-md-4 col-md-offset-4\">\n" +
    "                <div class=\"cover\" ng-hide=\"topresult.item.images === undefined\">\n" +
    "                    <img ng-src=\"{{ topresult.item.images[0].url }}\" />\n" +
    "                </div>\n" +
    "                <div class=\"details\" ng-class=\"{ 'fullwidth': topresult.item.images === undefined }\">\n" +
    "                    <div class=\"tracklist\">\n" +
    "                        <div class=\"row track\" ng-repeat=\"track in topresult.item.tracks\" ng-if=\"topresult.item.tracks\" >\n" +
    "                            <div class=\"col-md-7 name\">\n" +
    "                                {{ track.name }}    \n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-5 artist\">\n" +
    "                                {{ track.artiststring }}\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"hoverwrap\">\n" +
    "                    <div class=\"iconwrap row\">\n" +
    "                        <div class=\"icon small col-md-4\">\n" +
    "                            <a href=\"#/music/tracklist/{{ topresult.item.uri }}\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "                        </div>\n" +
    "                        <div class=\"icon col-md-4\">\n" +
    "                            <i class=\"ss-icon ss-play\" ng-click=\"playTopItem()\"></i>\n" +
    "                        </div>\n" +
    "                        <div class=\"icon small col-md-4\">\n" +
    "                            <i class=\"ss-icon ss-wifi\" ng-click=\"startTopItemStation()\"></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"overview\" class=\"row\">\n" +
    "    \n" +
    "    <div class=\"pagetitle row\" ng-show=\"results.artists.items.length > 0\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Artists <span class=\"sub\">{{ query }}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\" id=\"searchresults\" ng-show=\"results.artists.items.length > 0\">\n" +
    "        <div id=\"tileview\" class=\"row\">\n" +
    "            <div ng-repeat=\"artist in results.artists.items\">\n" +
    "                <mopify-artist artist=\"artist\" class=\"col-md-2 single-tile\"></mopify-artist>\n" +
    "                <div ng-if=\"($index + 1) % 6 == 0\" class=\"row\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\" ng-show=\"results.albums.items.length > 0\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Albums <span class=\"sub\">{{ query }}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\" id=\"searchresults\" ng-show=\"results.albums.items.length > 0\">\n" +
    "        <div id=\"tileview\" class=\"row\">\n" +
    "            <div ng-repeat=\"album in results.albums.items\">\n" +
    "                <mopify-album album=\"album\" class=\"col-md-2 single-tile\"></mopify-album>\n" +
    "                <div ng-if=\"($index + 1) % 6 == 0\" class=\"row\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\" ng-show=\"results.tracks.length > 0\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Tracks <span class=\"sub\">{{ query }}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\" id=\"searchresults\" ng-show=\"results.tracks.length > 0\">\n" +
    "        <div id=\"tracklist\" class=\"row\">\n" +
    "            <div ng-repeat=\"track in results.tracks\">\n" +
    "                <mopify-track track=\"track\" surrounding=\"results.tracks\"> </mopify-track>\n" +
    "                <div ng-if=\"($index + 1) % 6 == 0\" class=\"row\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"pagetitle row\" ng-show=\"results.playlists.items.length > 0\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            Playlists <span class=\"sub\">{{ query }}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"pagecontent row\" id=\"searchresults\" ng-show=\"results.playlists.items.length > 0\">\n" +
    "        <div id=\"tileview\" class=\"row\">\n" +
    "            <div ng-repeat=\"playlist in results.playlists.items\">\n" +
    "                <mopify-playlist playlist=\"playlist\" play=\"play(playlist)\" class=\"col-md-2 single-tile\"></mopify-playlist>\n" +
    "                <div ng-if=\"($index + 1) % 6 == 0\" class=\"row\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("widgets/album.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/album.directive.tmpl.html",
    "<div class=\"tileart\" context-menu\n" +
    "     data-target=\"menu-{{ album.uri }}\"\n" +
    "     ng-class=\"{ 'highlight': highlight, 'expanded' : expanded }\">\n" +
    "    <div class=\"hoverwrap\">\n" +
    "        <div class=\"iconwrap row\">\n" +
    "            <div class=\"icon small col-md-4\">\n" +
    "                <a href=\"{{ tracklistUrl }}\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "            </div>\n" +
    "            <div class=\"icon col-md-4\">\n" +
    "                <i class=\"ss-icon ss-play\" ng-click=\"play()\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"icon small col-md-4\">\n" +
    "                <i class=\"ss-icon ss-wifi\" ng-click=\"startStation()\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <img ng-src=\"{{ album.images[1].url }}\" />\n" +
    "</div>\n" +
    "<div class=\"tileinfo clickable\">\n" +
    "    <a href=\"{{ tracklistUrl }}\">\n" +
    "        <span class=\"name\">{{ album.name}}</span>\n" +
    "    </a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"contextmenu position-fixed\" id=\"menu-{{ album.uri }}\">\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "        <li ng-click=\"play()\">\n" +
    "            Play\n" +
    "        </li>\n" +
    "        <li ng-click=\"addToQueue()\">\n" +
    "            Add to queue\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"startStation()\">\n" +
    "            Start station\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("widgets/album.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/album.tmpl.html",
    "<div class=\"tileart\" context-menu\n" +
    "     data-target=\"menu-{{ album.uri }}\"\n" +
    "     ng-class=\"{ 'highlight': highlight, 'expanded' : expanded }\">\n" +
    "    <div class=\"hoverwrap\">\n" +
    "        <div class=\"iconwrap row\">\n" +
    "            <div class=\"icon small col-md-4\">\n" +
    "                <a href=\"{{ tracklistUrl }}\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "            </div>\n" +
    "            <div class=\"icon col-md-4\">\n" +
    "                <i class=\"ss-icon ss-play\" ng-click=\"play()\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"icon small col-md-4\">\n" +
    "                <i class=\"ss-icon ss-wifi\" ng-click=\"startStation()\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <img ng-src=\"{{ album.images[1].url }}\" />\n" +
    "</div>\n" +
    "<div class=\"tileinfo clickable\">\n" +
    "    <a href=\"{{ tracklistUrl }}\">\n" +
    "        <span class=\"name\">{{ album.name}}</span>\n" +
    "    </a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"contextmenu position-fixed\" id=\"menu-{{ album.uri }}\">\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "        <li ng-click=\"play()\">\n" +
    "            Play\n" +
    "        </li>\n" +
    "        <li ng-click=\"addToQueue()\">\n" +
    "            Add to queue\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"startStation()\">\n" +
    "            Start station\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("widgets/artist.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/artist.directive.tmpl.html",
    "<div class=\"tileart\" context-menu\n" +
    "     data-target=\"menu-{{ artist.uri }}\"\n" +
    "     ng-class=\"{ 'highlight': highlight, 'expanded' : expanded }\">\n" +
    "    <div class=\"hoverwrap\">\n" +
    "        <div class=\"iconwrap row\">\n" +
    "            <div class=\"icon small col-md-4\">\n" +
    "                <a href=\"#/music/artist/{{ artist.uri }}\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "            </div>\n" +
    "            <div class=\"icon col-md-4\">\n" +
    "                <i class=\"ss-icon ss-play\" ng-click=\"play()\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"icon small col-md-4\">\n" +
    "                <i class=\"ss-icon ss-wifi\" ng-click=\"startStation()\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <img ng-src=\"{{ artist.images[1].url }}\" />\n" +
    "</div>\n" +
    "<div class=\"tileinfo clickable\">\n" +
    "    <a href=\"#/music/artist/{{ artist.uri }}\">\n" +
    "        <span class=\"name\">{{ artist.name}}</span>\n" +
    "    </a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"contextmenu position-fixed\" id=\"menu-{{ artist.uri }}\">\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "        <li ng-click=\"play()\">\n" +
    "            Play\n" +
    "        </li>\n" +
    "        <li ng-click=\"addToQueue()\">\n" +
    "            Add to queue\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"startStation()\">\n" +
    "            Start station\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("widgets/browse.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/browse.directive.tmpl.html",
    "<div class=\"browseitem\">\n" +
    "    <div class=\"text\">\n" +
    "        <span ng-bind-html=\"titleslogan\"></span>\n" +
    "    </div>\n" +
    "    <div class=\"imagewrap\">\n" +
    "        <div class=\"hoverwrap\">\n" +
    "            <div class=\"iconwrap row\">\n" +
    "                <div class=\"icon small col-md-4\">\n" +
    "                    <a href=\"#/music/artist/{{ spotifyuri }}\" ng-if=\"item.type == 'artist'\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "                    <a href=\"#/music/tracklist/{{ spotifyuri }}\" ng-if=\"item.type == 'echonest'\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "                </div>\n" +
    "                <div class=\"icon col-md-4\">\n" +
    "                    <i class=\"ss-icon ss-play\" ng-click=\"play()\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"icon small col-md-4\">\n" +
    "                    <i class=\"ss-icon ss-wifi\" ng-click=\"startStation()\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <img ng-src=\"{{ image }}\"/>\n" +
    "    </div>  \n" +
    "    <div class=\"text\">\n" +
    "        <span class=\"title\">{{ suggestion.name }}</span><br>\n" +
    "        <span class=\"artist\" ng-if=\"suggestion.artist\">{{ suggestion.artist }}</span>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("widgets/playlist.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/playlist.directive.tmpl.html",
    "<div class=\"tileart\" context-menu\n" +
    "     data-target=\"menu-{{ playlist.uri }}\"\n" +
    "     ng-class=\"{ 'highlight': highlight, 'expanded' : expanded }\">\n" +
    "    <div class=\"hoverwrap\">\n" +
    "        <div class=\"iconwrap row\">\n" +
    "            <div class=\"icon small col-md-4\">\n" +
    "                <a href=\"{{ tracklistUrl }}\"><i class=\"ss-icon ss-list\"></i></a>\n" +
    "            </div>\n" +
    "            <div class=\"icon col-md-4\">\n" +
    "                <i class=\"ss-icon ss-play\" ng-click=\"play()\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"icon small col-md-4\">\n" +
    "                <i class=\"ss-icon ss-wifi\" ng-click=\"startStation()\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <img ng-src=\"{{ coverImage }}\" />\n" +
    "</div>\n" +
    "<div class=\"tileinfo clickable\">\n" +
    "    <a href=\"{{ tracklistUrl }}\">\n" +
    "        <span class=\"name\">{{ playlist.name}}</span>\n" +
    "        <span class=\"year\">{{ playlist.tracks.length || playlist.tracks.total }} tracks</span>\n" +
    "    </a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"contextmenu position-fixed\" id=\"menu-{{ playlist.uri }}\">\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "        <li ng-click=\"playTrack(track)\">\n" +
    "            Play\n" +
    "        </li>\n" +
    "        <li ng-click=\"addTrackToQueue(track)\">\n" +
    "            Add to queue\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"startStationFromTrack(track)\">\n" +
    "            Start station\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("widgets/service.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/service.directive.tmpl.html",
    "<div class=\"tileart\">\n" +
    "    <div class=\"hoverwrap\">\n" +
    "        <div class=\"iconwrap\">\n" +
    "            <div class=\"icon\">\n" +
    "                <i class=\"ss-icon \" ng-class=\"!service.connected ? 'ss-contract' : 'ss-expand'\" ng-click=\"!service.connected ? connectService() : disconnectService()\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <img ng-src=\"{{ service.image }}\"/>\n" +
    "</div>\n" +
    "<div class=\"tileinfo\">\n" +
    "    <span class=\"name\">{{ service.name }} <div class=\"status\"><div class=\"connection\" ng-class=\"service.connected ? 'connected' : 'disconnected'\"></div></div></span>\n" +
    "    <span class=\"year\">{{ service.description }}</span>\n" +
    "</div>");
}]);

angular.module("widgets/station.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/station.directive.tmpl.html",
    "<div class=\"tileart\">\n" +
    "    <div class=\"hoverwrap\">\n" +
    "        <div class=\"iconwrap\">\n" +
    "            <div class=\"icon\">\n" +
    "                <i class=\"ss-icon ss-wifi\" ng-click=\"startStation()\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <img ng-src=\"{{ station.coverImage }}\"/>\n" +
    "</div>\n" +
    "<div class=\"tileinfo\">\n" +
    "    <a href=\"{{ getStationUrl() }}\">\n" +
    "        <span class=\"name\">{{ station.name }}</span>\n" +
    "        <span class=\"year\">Radio type: {{ station.type }}</span>\n" +
    "    </a>\n" +
    "</div>");
}]);

angular.module("widgets/track.directive.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("widgets/track.directive.tmpl.html",
    "<div class=\"track\" context-menu\n" +
    "    data-target=\"{{ track.uri || track.tlid }}\"\n" +
    "    ng-class=\"{ 'highlight': highlight, 'expanded' : expanded, 'loading': track.loading }\"\n" +
    "    ng-dblclick=\"play()\"\n" +
    "    ng-show=\"visible\">\n" +
    "\n" +
    "    <div class=\"row\" ng-class=\"{'nowplaying': ($parent.currentPlayingTrack.uri == track.uri)}\">\n" +
    "        <div class=\"col-md-4 name\">\n" +
    "            {{ track.name }} \n" +
    "        </div>\n" +
    "        <div class=\"col-md-3 artists\">\n" +
    "            <span ng-bind-html=\"artistsString()\"></span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-4 album\">\n" +
    "            <a href=\"#/music/tracklist/{{ track.album.uri }}/{{ track.album.name }}\">{{ track.album.name }}</a>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-1 length\">\n" +
    "            {{ lengthHuman() }}\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"selectplaylist\" ng-show='showplaylists'>\n" +
    "    <div class=\"close\" ng-click=\"showplaylists = false\">\n" +
    "        Close\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <ul class=\"playlists\" role=\"menu\">\n" +
    "                <li ng-repeat=\"playlist in userplaylists\" ng-if=\"$index % 4 == 0\" ng-click=\"addToPlaylist(playlist.uri)\">\n" +
    "                    {{ playlist.name }}\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                <li ng-repeat=\"playlist in userplaylists\" ng-if=\"$index % 4 == 1\" ng-click=\"addToPlaylist(playlist.uri)\">\n" +
    "                    {{ playlist.name }}\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                <li ng-repeat=\"playlist in userplaylists\" ng-if=\"$index % 4 == 2\" ng-click=\"addToPlaylist(playlist.uri)\">\n" +
    "                    {{ playlist.name }}\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-3\">\n" +
    "            <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                <li ng-repeat=\"playlist in userplaylists\" ng-if=\"$index % 4 == 3\" ng-click=\"addToPlaylist(playlist.uri)\">\n" +
    "                    {{ playlist.name }}\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"contextmenu position-fixed\" id=\"{{ track.uri || track.tlid }}\">\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "        <li ng-click=\"play()\">\n" +
    "            Play\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"addToQueue()\">\n" +
    "            Add to queue\n" +
    "        </li>\n" +
    "        <li ng-show=\"$parent.type == 'tracklist'\" ng-click=\"removeFromQueue()\">\n" +
    "            Remove from queue\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"startStation()\">\n" +
    "            Start station\n" +
    "        </li>\n" +
    "        <li class=\"divider\"></li>\n" +
    "        <li ng-click=\"showPlaylists()\">\n" +
    "            Add to playlist\n" +
    "        </li>\n" +
    "        <li ng-if=\"$parent.isowner\" ng-click=\"removeFromPlaylist()\">\n" +
    "            Remove from playlist\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);
;'use strict';
angular.module('mopify.account.facebook', ['mopify.services.facebook']).controller('FacebookMenuController', [
  '$q',
  '$scope',
  'Facebook',
  function FacebookMenuController($q, $scope, Facebook) {
    // Set some scope vars
    $scope.userProfile = {};
    $scope.authorized = false;
    Facebook.getLoginStatus().then(function (data) {
      if (data.status == 'connected') {
        collectData();
      } else {
        Facebook.login().then(function () {
          collectData();
        });
      }
    });
    function collectData() {
      $scope.authorized = true;
      Facebook.api('/me', {}).then(function (response) {
        $scope.userProfile = response;
        Facebook.api('/me/picture', {}).then(function (resp) {
          $scope.userProfile.profile_image = resp.data.url;
        });
      });
    }
  }
]);;;'use strict';
angular.module('mopify.account.services', [
  'LocalStorageModule',
  'mopify.widgets.directive.service'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/account/services', {
      templateUrl: 'account/services/services.tmpl.html',
      controller: 'AccountServicesController'
    });
  }
]).controller('AccountServicesController', [
  '$rootScope',
  '$scope',
  'localStorageService',
  function AccountServicesController($rootScope, $scope, localStorageService) {
    // bind connectedServices with the $scope
    localStorageService.bind($scope, 'connectedServices');
    // Define the default connectedServices object and extend it with the connectedServices object from storage
    $scope.availableServices = [{
        name: 'Spotify',
        description: 'Search and manage playlists and get the latests charts',
        image: 'http://icons.iconarchive.com/icons/danleech/simple/256/spotify-icon.png',
        connected: $scope.connectedServices !== null ? $scope.connectedServices.spotify : false
      }];
    if ($scope.connectedServices === null) {
      $scope.connectedServices = {};
      for (var x = 0; x < $scope.availableServices.length; x++) {
        var service = $scope.availableServices[x];
        $scope.connectedServices[service.name.replace(' ', '').toLowerCase()] = false;
      }
    }
  }
]);;'use strict';
angular.module('mopify.account.services.menu', ['LocalStorageModule']).controller('AccountServicesMenuController', [
  '$scope',
  'localStorageService',
  function AccountServicesMenuController($scope, localStorageService) {
    function checkConnectedServices(event, service) {
      // Get from storage
      $scope.connectedServices = localStorageService.get('connectedServices') || {};
      // If service is defined we use that one's connected value to override the connectedService
      if (service !== undefined) {
        $scope.connectedServices[service.name.replace(' ', '').toLowerCase()] = service.connected;
      }
      $scope.totalServices = Object.keys($scope.connectedServices).length;
      // Count the number of connected services
      $scope.connectedCount = 0;
      for (var k in $scope.connectedServices) {
        if ($scope.connectedServices.hasOwnProperty(k) && $scope.connectedServices[k] === true) {
          $scope.connectedCount++;
        }
      }
      if ($scope.connectedCount === 0)
        $scope.hasServicesConnected = false;
      else
        $scope.hasServicesConnected = true;
    }
    // Run check function on load and received message
    checkConnectedServices();
    $scope.$on('mopify:services:connected', checkConnectedServices);
    $scope.$on('mopify:services:disconnected', checkConnectedServices);
  }
]);;'use strict';
angular.module('mopify.account.spotify', [
  'spotify',
  'mopify.services.spotifylogin'
]).controller('SpotifyMenuController', [
  '$q',
  '$scope',
  'Spotify',
  'SpotifyLogin',
  function SpotifyMenuController($q, $scope, Spotify, SpotifyLogin) {
    // Set some scope vars
    $scope.userProfile = {};
    $scope.authorized = false;
    // Check if we are logged in
    SpotifyLogin.getLoginStatus().then(function (data) {
      if (data.status == 'connected') {
        collectdata();
      } else {
        SpotifyLogin.login().then(function () {
          collectdata();
        });
      }
    });
    // Get the user porfile from Spotify
    function collectdata() {
      // Make the call
      Spotify.getCurrentUser().then(function (data) {
        $scope.authorized = true;
        $scope.userProfile = data;
      });
    }
    $scope.$on('mopify:services:disconnected', function (e, service) {
      if (service.name == 'Spotify') {
        SpotifyLogin.disconnect();
      }
    });
  }
]);;;'use strict';
angular.module('mopify.account.settings', [
  'ngRoute',
  'LocalStorageModule',
  'mopify.services.settings'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/account/settings', {
      templateUrl: 'account/settings/settings.tmpl.html',
      controller: 'SettingsController'
    });
  }
]).controller('SettingsController', [
  '$scope',
  '$rootScope',
  '$timeout',
  '$http',
  'localStorageService',
  'Settings',
  function SettingsController($scope, $rootScope, $timeout, $http, localStorageService, Settings) {
    // bind settings with the $scope
    Settings.bind($scope);
    $scope.buttonactive = false;
    /**
     * Temporarily highlight the save button
     * @return {[type]} [description]
     */
    $scope.highlightSaveButton = function () {
      $scope.buttonactive = true;
      $timeout(function () {
        $scope.buttonactive = false;
      }, 500);
    };
    /**
     * Check for a newer Mopify version by getting the Github releases
     */
    function checkMopifyVersion() {
      $scope.newversion = false;
      // Get releases from github
      $http.get('https://api.github.com/repos/dirkgroenen/mopidy-mopify/releases').success(function (data) {
        if (data[0] !== undefined) {
          var lastversion = data[0].tag_name;
          if ($rootScope.mopifyversion != lastversion) {
            $scope.newversion = lastversion;
          }
        }
      });
    }
    checkMopifyVersion();
  }
]);;;'use strict';
// Declare app level module which depends on views, and components
angular.module('mopify', [
  'LocalStorageModule',
  'angular-echonest',
  'angular-loading-bar',
  'mopify.services.mopidy',
  'spotify',
  'mopify.search',
  'mopify.music.artist',
  'mopify.music.playlists',
  'mopify.music.stations',
  'mopify.player',
  'mopify.player.controls',
  'mopify.player.seekbar',
  'mopify.account.settings',
  'mopify.account.services',
  'mopify.account.services.menu',
  'mopify.account.spotify',
  'mopify.account.facebook',
  'mopify.music.tracklist',
  'ng-context-menu',
  'mopify.discover.browse',
  'mopify.discover.featured',
  'mopify.discover.newreleases',
  'templates-app',
  'llNotifier'
]).config([
  '$routeProvider',
  'localStorageServiceProvider',
  'EchonestProvider',
  'SpotifyProvider',
  function ($routeProvider, localStorageServiceProvider, EchonestProvider, SpotifyProvider) {
    localStorageServiceProvider.setPrefix('mopify');
    EchonestProvider.setApiKey('UVUDDM7M0S5MWNQFV');
    SpotifyProvider.setClientId('b6b699a5595b406d9bfba11bee303aa4');
    SpotifyProvider.setRedirectUri('http://mopify.bitlabs.nl/auth/spotify/callback/');
    SpotifyProvider.setScope('user-read-private playlist-read-private playlist-modify-private playlist-modify-public');
    $routeProvider.otherwise({ redirectTo: '/discover/featured' });
  }
]).controller('AppController', [
  '$scope',
  '$rootScope',
  '$http',
  '$location',
  '$window',
  'mopidyservice',
  'notifier',
  function AppController($scope, $rootScope, $http, $location, $window, mopidyservice, notifier) {
    var connectionStates = {
        online: 'Online',
        offline: 'Offline'
      };
    var defaultPageTitle = 'Mopify';
    // Set version in the rootscope
    $rootScope.mopifyversion = '1.0.0';
    // Watch for track changes so we can update the title
    $scope.$on('mopidy:event:trackPlaybackStarted', function (event, data) {
      if (data.tl_track !== undefined)
        updateTitle(data.tl_track.track);
    });
    // Page title and connection state to $scope
    $scope.connectionState = connectionStates.offline;
    $scope.pageTitle = defaultPageTitle;
    // Listen for messages
    $scope.$on('mopidy:state:online', function () {
      $scope.connectionState = connectionStates.online;
      $scope.$apply();
      // Get the track for the page title
      mopidyservice.getCurrentTrack().then(function (track) {
        updateTitle(track);
      });
    });
    // Listen for messages
    $scope.$on('mopidy:state:offline', function () {
      $scope.connectionState = connectionStates.offline;
      $scope.$apply();
    });
    $scope.$on('$viewContentLoaded', function (event) {
      $window.ga('send', 'pageview', { page: $location.path() });
    });
    // Start the mopidy service
    mopidyservice.start();
    /**
     * Update the page title with the current playing track
     * @param object track
     */
    function updateTitle(track) {
      if (track !== null && track !== undefined)
        $scope.pageTitle = track.name + ' - ' + track.artists[0].name + ' | ' + defaultPageTitle;
    }
    /**
     * Check for a newer Mopify version by getting the Github releases
     */
    function checkMopifyVersion() {
      $scope.newversion = false;
      // Get releases from github
      $http.get('https://api.github.com/repos/dirkgroenen/mopidy-mopify/releases').success(function (data) {
        if (data[0] !== undefined) {
          var lastversion = data[0].tag_name;
          if ($rootScope.mopifyversion != lastversion) {
            notifier.notify({
              type: 'custom',
              template: 'A new version is available. Please read the <a href=\'https://github.com/dirkgroenen/mopidy-mopify/blob/master/README.md\' target=\'_blank\'>README</a> on how to update Mopify.',
              delay: 7500
            });
          }
        }
      });
    }
    checkMopifyVersion();
  }
]);;'use strict';
angular.module('mopify.dashboard', ['ngRoute']).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'dashboard/dashboard.tmpl.html',
      controller: 'DashboardController'
    });
  }
]).controller('DashboardController', [
  '$scope',
  function DashboardController($scope) {
  }
]);;;'use strict';
angular.module('mopify.discover.browse', [
  'mopify.services.mopidy',
  'mopify.services.history',
  'mopify.services.facebook',
  'mopify.widgets.directive.browse',
  'mopify.services.tasteprofile',
  'angular-echonest',
  'infinite-scroll'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/discover/browse', {
      templateUrl: 'discover/browse/browse.tmpl.html',
      controller: 'DiscoverBrowseController'
    });
  }
]).controller('DiscoverBrowseController', [
  '$scope',
  '$http',
  'mopidyservice',
  'History',
  'Facebook',
  'TasteProfile',
  'Echonest',
  function DiscoverBrowseController($scope, $http, mopidyservice, History, Facebook, TasteProfile, Echonest) {
    var history = History.getTracks().reverse().splice(0, 50);
    var echonest = [];
    var builtblocks = [];
    $scope.blocks = [];
    // Get a catalog radio based on the tasteprofile id 
    var parameters = {
        results: 50,
        type: 'catalog-radio',
        seed_catalog: TasteProfile.id,
        bucket: [
          'id:spotify',
          'tracks'
        ],
        limit: true
      };
    Echonest.playlist.static(parameters).then(function (songs) {
      echonest = songs;
      prebuildblocks();
      $scope.buildblocks();
    });
    function prebuildblocks() {
      _.forEach(echonest, function (item) {
        builtblocks.push({
          type: 'echonest',
          echonest: item
        });
      });
      _.forEach(history, function (item) {
        builtblocks.push({
          type: 'artist',
          artist: item.track.artists[0]
        });
      });
      // Shuffle the array
      builtblocks = _.shuffle(builtblocks);
    }
    $scope.buildblocks = function () {
      $scope.blocks = $scope.blocks.concat(builtblocks.splice(0, 12));
    };
  }
]);;;'use strict';
angular.module('mopify.discover.featured', [
  'mopify.services.mopidy',
  'mopify.services.spotifylogin',
  'mopify.services.settings',
  'spotify',
  'mopify.services.util',
  'mopify.services.station',
  'mopify.widgets.directive.album',
  'LocalStorageModule',
  'llNotifier'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/discover/featured', {
      templateUrl: 'discover/featured/featured.tmpl.html',
      controller: 'DiscoverFeaturedController'
    });
  }
]).controller('DiscoverFeaturedController', [
  '$rootScope',
  '$scope',
  '$timeout',
  'mopidyservice',
  'Spotify',
  'Settings',
  'SpotifyLogin',
  'util',
  'stationservice',
  'localStorageService',
  'notifier',
  function DiscoverFeaturedController($rootScope, $scope, $timeout, mopidyservice, Spotify, Settings, SpotifyLogin, util, stationservice, localStorageService, notifier) {
    $scope.featuredplaylists = [];
    $scope.titletext = 'Loading...';
    $scope.headerplaylist = {};
    // Load the feautured playlists when a connection with spotify has been established
    $scope.$on('mopify:spotify:connected', loadFeaturedPlaylists);
    if (SpotifyLogin.connected)
      loadFeaturedPlaylists();
    else
      notifier.notify({
        type: 'custom',
        template: 'Please connect with the Spotify service first.',
        delay: 3000
      });
    /**
     * Load all the data for the featured playlists page
     */
    function loadFeaturedPlaylists() {
      // Check if we are logged in to spotify 
      if (SpotifyLogin.connected) {
        var locale = Settings.get('locale', 'en_GB');
        var country = Settings.get('country', 'GB');
        // Get the featured playlists from spotify
        Spotify.getFeaturedPlaylists({
          locale: locale,
          country: country,
          limit: 12
        }).then(function (data) {
          // Set the message and items
          $scope.titletext = data.message;
          $scope.featuredplaylists = data.playlists.items;
          $scope.headerplaylist = data.playlists.items[Math.floor(Math.random() * data.playlists.items.length)];
          // Load the tracks for the featured header playlist
          loadHeaderPlaylistTracks();
        });
      } else {
        $scope.titletext = 'Please connect to Spotify';
      }
    }
    function loadHeaderPlaylistTracks() {
      // Get the tracks for the headerplaylist
      mopidyservice.lookup($scope.headerplaylist.uri).then(function (tracks) {
        var frontendtracks = angular.copy(tracks.splice(0, 7));
        var tracksloaded = true;
        // Create an artist string for every song
        _.each(frontendtracks, function (track) {
          track.artiststring = util.artistsToString(track.artists);
          if (track.name.indexOf('loading') > -1)
            tracksloaded = false;
        });
        if (tracksloaded)
          $scope.headerplaylist.tracks = frontendtracks;
        else
          $timeout(loadHeaderPlaylistTracks, 1000);
      });
    }
    $scope.playHeaderPlaylist = function () {
      mopidyservice.lookup($scope.headerplaylist.uri).then(function (tracks) {
        mopidyservice.playTrack(tracks[0], tracks);
      });
    };
    $scope.startHeaderPlaylistStation = function () {
      stationservice.startFromSpotifyUri($scope.headerplaylist.uri);
    };
  }
]);;;'use strict';
angular.module('mopify.discover.newreleases', [
  'mopify.services.mopidy',
  'mopify.services.spotifylogin',
  'spotify',
  'mopify.services.util',
  'mopify.services.station',
  'mopify.widgets.directive.playlist',
  'mopify.services.settings',
  'llNotifier'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/discover/newreleases', {
      templateUrl: 'discover/newreleases/newreleases.tmpl.html',
      controller: 'DiscoverNewReleasesController'
    });
  }
]).controller('DiscoverNewReleasesController', [
  '$rootScope',
  '$scope',
  '$timeout',
  'mopidyservice',
  'SpotifyLogin',
  'Spotify',
  'util',
  'stationservice',
  'Settings',
  'notifier',
  function DiscoverNewReleasesController($rootScope, $scope, $timeout, mopidyservice, SpotifyLogin, Spotify, util, stationservice, Settings, notifier) {
    $scope.newreleases = [];
    $scope.titletext = 'Get to know the latest releases';
    $scope.headeralbum = {};
    // Load the feautured playlists when a connection with spotify has been established
    $scope.$on('mopify:spotify:connected', loadNewReleases);
    if (SpotifyLogin.connected)
      loadNewReleases();
    else
      notifier.notify({
        type: 'custom',
        template: 'Please connect with the Spotify service first.',
        delay: 3000
      });
    /**
     * Load all the data for the new releases page
     */
    function loadNewReleases() {
      if (SpotifyLogin.connected) {
        var country = Settings.get('country', 'GB');
        // Get the new releases from Spotify
        Spotify.getNewReleases({
          country: country,
          limit: 18
        }).then(function (data) {
          // Set the message and items
          $scope.newreleases = data.albums.items;
          $scope.headeralbum = data.albums.items[Math.floor(Math.random() * (data.albums.items.length - 1))];
          $scope.titletext = $scope.headeralbum.name;
          // Load the tracks for the featured header album
          if (mopidyservice.isConnected)
            loadHeaderAlbumTracks();
        });
      } else {
        $scope.titletext = 'Please connect to Spotify';
      }
    }
    function loadHeaderAlbumTracks() {
      // Get the tracks for the headerplaylist
      mopidyservice.lookup($scope.headeralbum.uri).then(function (tracks) {
        var frontendtracks = angular.copy(tracks.splice(0, 7));
        var tracksloaded = true;
        // Create an artist string for every song
        _.each(frontendtracks, function (track) {
          track.artiststring = util.artistsToString(track.artists);
          if (track.name.indexOf('loading') > -1)
            tracksloaded = false;
        });
        if (tracksloaded)
          $scope.headeralbum.tracks = frontendtracks;
        else
          $timeout(loadHeaderAlbumTracks, 1000);
      });
    }
    $scope.playHeaderAlbum = function () {
      mopidyservice.lookup($scope.headeralbum.uri).then(function (tracks) {
        mopidyservice.playTrack(tracks[0], tracks);
      });
    };
    $scope.startHeaderAlbumStation = function () {
      stationservice.startFromSpotifyUri($scope.headeralbum.uri);
    };
  }
]);;;'use strict';
angular.module('mopify.music.artist', [
  'ngRoute',
  'spotify',
  'angular-echonest',
  'mopify.services.mopidy',
  'mopify.services.station',
  'mopify.widgets.directive.artist'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/music/artist/:artistId', {
      templateUrl: 'music/artist/artist.tmpl.html',
      controller: 'ArtistController'
    });
  }
]).controller('ArtistController', [
  '$scope',
  '$routeParams',
  'mopidyservice',
  'Echonest',
  'Spotify',
  'stationservice',
  function ArtistController($scope, $routeParams, mopidyservice, Echonest, Spotify, stationservice) {
    $scope.artistId = $routeParams.artistId;
    // Determine the currentview
    $scope.currentview = {
      id: 'music',
      name: 'Music'
    };
    // Define the view
    $scope.setView = function (name) {
      switch (name) {
      case 'music':
        $scope.currentview = {
          id: 'music',
          name: 'Music'
        };
        break;
      case 'related':
        $scope.currentview = {
          id: 'related',
          name: 'Related Artists'
        };
        break;
      case 'bio':
        $scope.currentview = {
          id: 'bio',
          name: 'Biography'
        };
        break;
      }
    };
    // Load artist data
    $scope.artist = {};
    // Get data from echonest
    Echonest.artists.get({ id: $routeParams.artistId }).then(function (artist) {
      $scope.artist = artist;
      artist.getBiographies();
      // Get images from artist
      artist.getImages().then(function (data) {
        // Search for an image that is bigger than 100
        var sortedImages = _.sortBy(data.images, function (image) {
            return image.width;
          });
        $scope.artist.coverimage = sortedImages[0].url;
      });
      artist.getBiographies().then(function (data) {
        var bios = data.biographies;
        for (var x = 0; x < bios.length; x++) {
          if (bios[x].truncated === false || bios[x].truncated === undefined) {
            $scope.artist.bio = bios[x];
            break;
          }
        }
      });
    });
    // Get related artists from spotify
    Spotify.getRelatedArtists($scope.artistId).then(function (data) {
      $scope.related = data.artists.splice(0, 18);
    });
    // Init an empty toptracks object
    $scope.toptracks = {};
    // Get the artist's top tracks
    Spotify.getArtistTopTracks($scope.artistId, 'NL').then(function (data) {
      $scope.toptracks = data.tracks;
    });
    // Get info from mopidy
    var options = {
        album_type: 'album,single',
        country: 'NL',
        limit: 50
      };
    Spotify.getArtistAlbums($scope.artistId, options).then(function (data) {
      $scope.albums = data.items;
    });
    /**
     * Start a station for the artist
     */
    $scope.startStation = function () {
      stationservice.startFromSpotifyUri($scope.artistId);
    };
  }
]);;;'use strict';
angular.module('mopify.music.playlists', [
  'ngRoute',
  'spotify',
  'mopify.services.mopidy',
  'angular-echonest',
  'mopify.widgets.directive.playlist'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/music/playlists', {
      templateUrl: 'music/playlists/playlists.tmpl.html',
      controller: 'PlaylistsController'
    });
  }
]).controller('PlaylistsController', [
  '$scope',
  'Spotify',
  'mopidyservice',
  'Echonest',
  function PlaylistsController($scope, Spotify, mopidyservice, Echonest) {
    var groupedLists = {}, splitList = [];
    $scope.playlists = [];
    $scope.$on('mopidy:state:online', loadPlaylists);
    $scope.$on('mopidy:event:playlistsLoaded', loadPlaylists);
    if (mopidyservice.isConnected)
      loadPlaylists();
    /**
     * Load all playlists
     */
    function loadPlaylists() {
      mopidyservice.getPlaylists().then(function (playlists) {
        $scope.playlists = playlists.sort(function (a, b) {
          if (a.name < b.name)
            return -1;
          if (a.name > b.name)
            return 1;
          return 0;
        });
      });
    }
  }
]);;;'use strict';
angular.module('mopify.music.stations', [
  'ngRoute',
  'spotify',
  'llNotifier',
  'mopify.services.station',
  'mopify.services.util',
  'mopify.services.spotifylogin',
  'mopify.widgets.directive.station'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/music/stations', {
      templateUrl: 'music/stations/stations.tmpl.html',
      controller: 'StationsController'
    });
  }
]).controller('StationsController', [
  '$scope',
  '$timeout',
  'localStorageService',
  'Spotify',
  'stationservice',
  'util',
  'SpotifyLogin',
  'notifier',
  function StationsController($scope, $timeout, localStorageService, Spotify, stationservice, util, SpotifyLogin, notifier) {
    // Bind the localstorage to the $scope so we always have the latest stations
    $scope.stations = localStorageService.get('stations');
    // Check if $scope.stations ain't null and show a notification to the user
    if ($scope.stations === null) {
      $scope.stations = [];
      notifier.notify({
        type: 'custom',
        template: 'Look\'s like you haven\'t started any Station yet. Click the \'Create new\' button to start a new station.',
        delay: 7500
      });
    }
    // Set some default scope vars
    $scope.creatingRadio = false;
    $scope.searchQuery = '';
    $scope.headerSize = 'small';
    $scope.wrapclass = '';
    $scope.searchResults = {};
    $scope.spotifyConnected = SpotifyLogin.connected;
    $scope.buildArtistString = function (artists) {
      return util.artistsToString(artists);
    };
    // Some local private vars
    var typingTimeout = null;
    /**
     * Create a new station
     */
    $scope.create = function () {
      $scope.creatingRadio = true;
      $scope.headerSize = 'big';
    };
    $scope.search = function (event) {
      $timeout.cancel(typingTimeout);
      // Check if user pressed esc
      if (event.keyCode == 27) {
        resetRadioCreater();
        return;
      }
      if ($scope.searchQuery.length > 1) {
        typingTimeout = $timeout(function () {
          $scope.wrapclass = 'dropdownvisible';
          var searchableItems = !SpotifyLogin.connected ? 'album,artist,track' : 'album,artist,track,playlist';
          Spotify.search($scope.searchQuery, searchableItems, {
            market: 'NL',
            limit: '3'
          }).then(function (data) {
            $scope.searchResults = data;
          });
        }, 300);
      } else {
        $scope.wrapclass = '';
      }
    };
    $scope.startFromNew = function (type, spotifyObject) {
      stationservice.startFromSpotifyUri(spotifyObject.uri).then(function () {
        $scope.stations = localStorageService.get('stations');
      });
      resetRadioCreater();
    };
    /**
     * Brings the radio creator back to it's original state
     */
    function resetRadioCreater() {
      // Remove the search view
      $scope.wrapclass = '';
      $scope.searchQuery = '';
      $scope.creatingRadio = false;
      $scope.headerSize = 'small';
    }
  }
]);;;'use strict';
angular.module('mopify.music.tracklist', [
  'ngRoute',
  'mopify.services.mopidy',
  'mopify.services.util',
  'mopify.services.station',
  'mopify.services.spotifylogin',
  'spotify',
  'ngSanitize',
  'mopify.widgets.directive.track',
  'infinite-scroll'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/music/tracklist/:uri/:name?', {
      templateUrl: 'music/tracklist/tracklist.tmpl.html',
      controller: 'TracklistController'
    });
  }
]).controller('TracklistController', [
  '$scope',
  '$timeout',
  '$routeParams',
  'mopidyservice',
  'stationservice',
  'util',
  'Spotify',
  'SpotifyLogin',
  function TracklistController($scope, $timeout, $routeParams, mopidyservice, stationservice, util, Spotify, SpotifyLogin) {
    // Grab params in var
    var uri = $routeParams.uri;
    // Set default coverimage
    $scope.coverImage = './assets/images/playlists-header.jpg';
    // Check mopidy state and call loadtracks function
    $scope.$on('mopidy:state:online', loadTracks);
    $scope.$on('mopidy:state:online', loadCurrentTrack);
    // Load tracks when connected
    if (mopidyservice.isConnected) {
      loadTracks();
      loadCurrentTrack();
    }
    // Define the type from the uri parameter
    if (uri.indexOf(':playlist:') > -1)
      $scope.type = 'Playlist';
    if (uri.indexOf(':album:') > -1)
      $scope.type = 'Album';
    if (uri.indexOf('mopidy:current') > -1) {
      $scope.type = 'tracklist';
      $scope.coverImage = './assets/images/tracklist-header.jpg';
    }
    // Check if this is a playlist from the loggedin Spotify user
    if ($scope.type == 'Playlist') {
      $scope.isowner = false;
      var ownerid = uri.split(':')[2];
      Spotify.getCurrentUser().then(function (data) {
        if (ownerid == data.id) {
          $scope.isowner = true;
        }
      });
    }
    // Check if a name has been defined
    $scope.name = $routeParams.name !== undefined ? $routeParams.name : uri.indexOf('mopidy:') > -1 ? 'Current tracklist' : '';
    $scope.tracks = [];
    $scope.currentPlayingTrack = {};
    var loadedTracks = [];
    if ($scope.type == 'Playlist') {
      loadSpotifyInfo();
    }
    /**
     * Load the tracks from the mopidy library
     */
    function loadTracks() {
      // Get curren tracklist from Mopidy
      if (uri.indexOf('mopidy:') > -1) {
        mopidyservice.getTracklist().then(function (tracks) {
          var mappedTracks = tracks.map(function (tltrack) {
              return tltrack.track;
            });
          $scope.tracks = angular.copy(mappedTracks);
        });
        $scope.$on('mopidy:event:tracklistChanged', loadTracks);
      }
      // Lookup the tracks for the given album or playlist
      if (uri.indexOf('spotify:') > -1) {
        mopidyservice.lookup(uri).then(function (tracks) {
          // Check if the $scope.tracks contains loading tracks
          var loadingTracks = false;
          _.each(tracks, function (track) {
            if (track.name.indexOf('[loading]') > -1)
              loadingTracks = true;
          });
          if (loadingTracks) {
            $timeout(loadTracks, 1000);
          } else {
            loadedTracks = angular.copy(tracks);
            var random = Math.floor(Math.random() * tracks.length + 0);
            if ($scope.type == 'Album')
              getCoverImage(tracks[random]);
            $scope.getMoreTracks();
          }
        });
      }
    }
    /**
     * Load information about the playlist from Spotify
     */
    function loadSpotifyInfo() {
      var splitteduri = uri.split(':');
      var userid = splitteduri[2];
      var playlistid = splitteduri[4];
      SpotifyLogin.getLoginStatus().then(function (resp) {
        if (resp.status == 'connected') {
          Spotify.getPlaylist(userid, playlistid).then(function (data) {
            $scope.name = data.name + ' from ' + data.owner.id;
          });
        } else {
          $scope.name = 'Playlist from ' + userid;
        }
      });
    }
    /**
     * Load the current playing track
     */
    function loadCurrentTrack() {
      mopidyservice.getCurrentTrack().then(function (track) {
        $scope.currentPlayingTrack = track;
      });
      // Update information on a new track 
      $scope.$on('mopidy:event:trackPlaybackEnded', function (event, data) {
        if (data.tl_track !== undefined)
          $scope.currentPlayingTrack = data.tl_track.track;
      });
      $scope.$on('mopidy:event:trackPlaybackStarted', function (event, data) {
        if (data.tl_track !== undefined)
          $scope.currentPlayingTrack = data.tl_track.track;
      });
    }
    /**
     * Get an album image from Spotify
     * @param  {track} track
     */
    function getCoverImage(track) {
      Spotify.getTrack(track.uri).then(function (data) {
        $scope.coverImage = data.album.images[0].url;
      });
    }
    /**
     * Add the current tracks to the tracklist, shuffle them and play
     */
    $scope.shuffle = function () {
      if (mopidyservice.isConnected) {
        mopidyservice.clearTracklist().then(function () {
          mopidyservice.addToTracklist({ uri: uri }).then(function () {
            mopidyservice.shuffleTracklist().then(function () {
              mopidyservice.play();
            });
          });
        });
      }
    };
    /**
     * Start a new station based on the tracks in the current view
     */
    $scope.startStation = function () {
      if (uri.indexOf('spotify:') > -1)
        stationservice.startFromSpotifyUri(uri);
      if (uri.indexOf('mopidy:') > -1)
        stationservice.startFromTracks($scope.tracks);
    };
    var tracksPerCall = 50;
    /*
     * Add {trackspercall} tracks to the scope
     * This function is used in combination with infinite scroll
     */
    $scope.getMoreTracks = function () {
      if (loadedTracks.length > 0) {
        var current = $scope.tracks;
        var toAdd = loadedTracks.splice(0, tracksPerCall);
        $scope.tracks = current.concat(toAdd);
      }
    };
  }
]);;;'use strict';
angular.module('mopify.player.controls', [
  'mopify.services.mopidy',
  'mopify.services.station'
]).controller('PlayerControlsController', [
  '$scope',
  'mopidyservice',
  'stationservice',
  function PlayerControlsController($scope, mopidyservice, stationservice) {
    $scope.volume = 0;
    $scope.isRandom = false;
    $scope.isPlaying = false;
    $scope.stateIcon = 'ss-play';
    $scope.volumeIcon = 'ss-volume';
    // Check for messages about the current playbackstate
    $scope.$on('mopidy:event:playbackStateChanged', function (event, data) {
      $scope.isPlaying = data.new_state === 'playing';
    });
    // If Mopidy is online we collect the init data about playback, volume and shuffle mode
    $scope.$on('mopidy:state:online', function () {
      // Get volume
      mopidyservice.getVolume().then(function (volume) {
        $scope.volume = volume;
        if (volume > 50)
          $scope.volumeIcon = 'ss-highvolume';
        else if (volume > 0)
          $scope.volumeIcon = 'ss-lowvolume';
        else
          $scope.volumeIcon = 'ss-volume';
      });
      // Get playback state
      mopidyservice.getState().then(function (state) {
        $scope.isPlaying = state === 'playing';
        $scope.stateIcon = 'ss-pause';
      });
      // Get shuffle
      mopidyservice.getRandom().then(function (random) {
        $scope.isRandom = random === true;
      });
      // Get repeat
      mopidyservice.getRepeat().then(function (repeat) {
        $scope.isRepeat = repeat === true;
      });
    });
    $scope.next = function () {
      mopidyservice.next();
    };
    $scope.prev = function () {
      mopidyservice.previous();
    };
    $scope.playpause = function () {
      mopidyservice.getState().then(function (state) {
        if (state === 'playing') {
          mopidyservice.pause();
          $scope.stateIcon = 'ss-play';
        } else {
          mopidyservice.play();
          $scope.stateIcon = 'ss-pause';
        }
      });
    };
    $scope.volumebarMouseClick = function (event) {
      var layerX = event.layerX;
      var volumebarWidth = event.srcElement.clientWidth;
      var volume = layerX / volumebarWidth * 100;
      // Set in scope and send to mopidy
      $scope.volume = volume;
      mopidyservice.setVolume(volume);
    };
    // Set mousestate for dragging
    var dragging = false;
    $scope.volumebarMouseDown = function (event) {
      dragging = true;
    };
    $scope.volumebarMouseUp = function (event) {
      dragging = false;
    };
    $scope.volumebarMouseMove = function (event) {
      if (dragging && event.layerY >= 0 && event.layerY <= event.srcElement.clientHeight) {
        var layerX = event.layerX;
        var volumebarWidth = event.srcElement.clientWidth;
        var volume = layerX / volumebarWidth * 100;
        // Set in scope and send to mopidy
        $scope.volume = volume;
        mopidyservice.setVolume(volume);
      }
    };
    $scope.toggleShuffle = function () {
      $scope.isRandom = !$scope.isRandom;
      mopidyservice.setRandom($scope.isRandom);
    };
    $scope.toggleRepeat = function () {
      $scope.isRepeat = !$scope.isRepeat;
      mopidyservice.setRepeat($scope.isRepeat);
    };
  }
]);;;'use strict';
angular.module('mopify.player', [
  'spotify',
  'mopify.services.mopidy',
  'mopify.services.history'
]).controller('PlayerController', [
  '$scope',
  '$timeout',
  'Spotify',
  'mopidyservice',
  'History',
  function PlayerController($scope, $timeout, Spotify, mopidyservice, History) {
    $scope.trackTitle = '';
    $scope.trackArtist = '';
    $scope.playerBackground = '';
    var historyaddtimeout = null;
    // If Mopidy is online we collect the init data about playback, volume and shuffle mode
    $scope.$on('mopidy:state:online', function () {
      // Get the current track
      mopidyservice.getCurrentTrack().then(function (track) {
        updatePlayerInformation(track);
      });
      // Get playback state
      mopidyservice.getState().then(function (state) {
        $scope.isPlaying = state === 'playing';
      });
      // Get schuffle
      mopidyservice.getRandom().then(function (random) {
        $scope.isRandom = random === true;
      });
      // Update information on a new track 
      $scope.$on('mopidy:event:trackPlaybackStarted', function (event, data) {
        if (data.tl_track !== undefined) {
          updatePlayerInformation(data.tl_track.track);
        }
      });
    });
    /**
     * Update the information which is displayed in the player
     * @param object track
     */
    function updatePlayerInformation(track) {
      if (track !== undefined && track !== null) {
        $scope.trackArtist = track.artists[0].name;
        $scope.trackTitle = track.name;
        // Get the background image from Spotify
        Spotify.getTrack(track.uri).then(function (data) {
          $scope.playerBackground = data.album.images[0].url;
          // Clear previous timeout and start new timer
          // When timeout clears the current track is added to the history
          $timeout.cancel(historyaddtimeout);
          historyaddtimeout = $timeout(function () {
            // Add to history
            addToHistory(track, data.album.images);
          }, 10000);
        });
      }
    }
    /**
     * Add a track to the history data
     * @param {tl_tracl} track
     * @param {array} images
     */
    function addToHistory(track, images) {
      if (track !== undefined && track !== null) {
        History.addTrack(track, { images: images });
      }
    }
  }
]);;;'use strict';
angular.module('mopify.player.seekbar', [
  'mopify.services.mopidy',
  'mopify.services.util'
]).controller('PlayerSeekbarController', [
  '$scope',
  '$interval',
  'mopidyservice',
  'util',
  function PlayerSeekbarController($scope, $interval, mopidyservice, util) {
    // Private vars
    var isSeeking = false;
    var checkPositionInterval;
    var trackLength = 0;
    $scope.seekbarWidth = 0;
    $scope.timeCurrent = '0:00';
    $scope.timeTotal = '0:00';
    $scope.$on('mopidy:state:online', function () {
      getTrackLength();
    });
    $scope.$on('mopidy:event:trackPlaybackStarted', function (event, data) {
      getTrackLength();
    });
    $scope.$on('mopidy:state:offline', function () {
      $interval.cancel(checkPositionInterval);
    });
    /**
     * Check the current playing track's time
     */
    function checkTimePosition() {
      if (!isSeeking) {
        mopidyservice.getTimePosition().then(function (timePosition) {
          $scope.seekbarWidth = timePosition / trackLength * 100;
          $scope.timeCurrent = util.timeFromMilliSeconds(timePosition);
        });
      }
    }
    function getTrackLength() {
      mopidyservice.getCurrentTrack().then(function (track) {
        if (track !== null) {
          trackLength = track.length;
          $scope.timeTotal = util.timeFromMilliSeconds(trackLength);
          mopidyservice.getState().then(function (state) {
            if (state === 'playing') {
              checkPositionInterval = $interval(function () {
                checkTimePosition();
              }, 1000);
            }
          });
        }
      });
    }
    $scope.seekbarMouseClick = function (event) {
      var layerX = event.layerX;
      var barwidth = event.srcElement.clientWidth;
      var seek = layerX / barwidth * 100;
      // Set in scope and send to mopidy
      $scope.seekbarWidth = seek;
      var ms = Math.round(trackLength * (seek / 100));
      isSeeking = true;
      mopidyservice.seek(ms).then(function () {
        isSeeking = false;
      });
    };
    $scope.seekbarMouseDown = function () {
      isSeeking = true;
    };
    $scope.seekbarMouseUp = function () {
      isSeeking = false;
    };
    $scope.seekbarMouseMove = function (event) {
      if (isSeeking) {
        var layerX = event.layerX;
        var barwidth = event.srcElement.clientWidth;
        var seek = layerX / barwidth * 100;
        // Set in scope and send to mopidy
        $scope.seekbarWidth = seek;
        var ms = Math.round(trackLength * (seek / 100));
        isSeeking = true;
        mopidyservice.seek(ms).then(function () {
          isSeeking = false;
        });
      }
    };
  }
]);;;'use strict';
// Declare app level module which depends on views, and components
angular.module('mopify.search', [
  'spotify',
  'ngRoute',
  'mopify.services.spotifylogin',
  'mopify.services.mopidy',
  'mopify.services.station',
  'mopify.services.util',
  'mopify.widgets.directive.playlist',
  'mopify.widgets.directive.album',
  'mopify.widgets.directive.artist',
  'mopify.widgets.directive.track'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/search/:query?', {
      templateUrl: 'search/search.tmpl.html',
      controller: 'SearchController'
    });
  }
]).controller('SearchController', [
  '$scope',
  '$routeParams',
  '$route',
  '$timeout',
  '$location',
  'Spotify',
  'SpotifyLogin',
  'mopidyservice',
  'stationservice',
  'util',
  function SearchController($scope, $routeParams, $route, $timeout, $location, Spotify, SpotifyLogin, mopidyservice, stationservice, util) {
    $scope.query = $routeParams.query;
    var typingTimeout = null;
    // Define empty result scope
    $scope.results = {
      artists: [],
      tracks: [],
      albums: [],
      playlists: []
    };
    $scope.topresult = {};
    /*
     * Perform a search with the current query
     */
    $scope.performSearch = function performSearch() {
      var searchableItems = !SpotifyLogin.connected ? 'album,artist' : 'album,artist,playlist';
      var resultsloaded = 0;
      Spotify.search($scope.query, searchableItems, {
        market: 'NL',
        limit: '12'
      }).then(function (data) {
        $scope.results.artists = data.artists;
        $scope.results.albums = data.albums;
        $scope.results.playlists = data.playlists;
        resultsloaded++;
        if (resultsloaded == 2)
          getTopMatchingResult($scope.query, $scope.results);
      });
      mopidyservice.search($scope.query).then(function (data) {
        if (data[0].tracks !== undefined) {
          $scope.results.tracks = data[0].tracks.splice(0, 10);
        }
        // Check if all data is loaded and if it is; calculate the topresult
        resultsloaded++;
        if (resultsloaded == 2)
          getTopMatchingResult($scope.query, $scope.results);
      });
    };
    // Run on load
    $scope.$on('mopidy:state:online', function () {
      $scope.performSearch();
    });
    if (mopidyservice.isConnected)
      $scope.performSearch();
    /**
     * Play the songs that are given in the topresult
     */
    $scope.playTopItem = function () {
      mopidyservice.lookup($scope.topresult.item.uri).then(function (tracks) {
        mopidyservice.playTrack(tracks[0], tracks.splice(0, 100));
      });
    };
    /**
     * Start a station from the top result
     */
    $scope.startTopItemStation = function () {
      stationservice.startFromSpotifyUri($scope.topresult.item.uri);
    };
    /**
     * Get the top matching resutls from the given batch
     * @param  {string} search  The search string to check against
     * @param  {object} results All the results from spotify and mopidy
     */
    function getTopMatchingResult(search, results) {
      var bestmatch = null;
      var resultitem = {};
      var items = [];
      // Override results with angular copy of results 
      results = angular.copy(results);
      // Loop through all results and create an array with all items
      _.each(results, function (result, key) {
        if (result !== undefined) {
          // Get correct items array
          if (result.items) {
            items.push({
              type: key,
              items: result.items
            });
          } else {
            items.push({
              type: key,
              items: result
            });
          }
        }
      });
      // Check each item with the query using the levenshtein algorithme
      _.each(items, function (collection) {
        _.each(collection.items, function (item) {
          var stringtocheck = item.name.toLowerCase();
          var distance = levenshteinDistance(search, stringtocheck);
          // Check with previous bestmatch and update if needed
          if (bestmatch === null || bestmatch > distance) {
            bestmatch = distance;
            resultitem = {
              item: item,
              type: collection.type
            };
          }
        });
      });
      mopidyservice.lookup(resultitem.item.uri).then(function (results) {
        var filtered = _.filter(_.shuffle(results), function (item) {
            return item.name.indexOf('unplayable') < 0;
          });
        resultitem.item.tracks = filtered.splice(0, 7);
        if (resultitem.type == 'tracks')
          resultitem.item.tracks[0].artiststring = util.artistsToString(resultitem.item.tracks[0].artists);
        // Set the resultitem as $scope.topresult
        $scope.topresult = resultitem;
      });
    }
    /**
     * Compute the edit distance between the two given strings
     * @param  {string} a 
     * @param  {string} b 
     * @return {int}   the number that represents the distance
     */
    function levenshteinDistance(a, b) {
      if (a.length === 0)
        return b.length;
      if (b.length === 0)
        return a.length;
      var matrix = [];
      // increment along the first column of each row
      var i;
      for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }
      // increment each column in the first row
      var j;
      for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }
      // Fill in the rest of the matrix
      for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) == a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));  // deletion
          }
        }
      }
      return matrix[b.length][a.length];
    }
  }
]).controller('SearchMenuController', [
  '$scope',
  '$routeParams',
  '$route',
  '$location',
  function SearchMenuController($scope, $routeParams, $route, $location) {
    $scope.query = $routeParams.query;
    $scope.typing = function (event) {
      // Parse as query to search page
      if (event.keyCode == 13) {
        $location.path('/search/' + $scope.query);
      }
    };
  }
]);;;angular.module('mopify.services.facebook', []).factory('Facebook', [
  '$q',
  '$timeout',
  '$document',
  function ($q, $timeout, $document) {
    'use strict';
    // Get body
    var body = $document.find('body').eq(0);
    // Create communication frame for Facebook
    function createFrame(service) {
      var frame = document.createElement('iframe');
      frame.setAttribute('src', 'http://mopify.bitlabs.nl/auth/' + service + '/frame/#' + window.location.host);
      frame.style.width = 1 + 'px';
      frame.style.height = 1 + 'px';
      // Add to body and register in frames object
      body.append(frame);
      return frame;
    }
    function Facebook() {
      this.accessToken = null;
      this.frame = createFrame('facebook');
      this.ready = false;
      this.waitingline = [];
      this.connected = false;
      this.callbackqueue = {};
    }
    Facebook.prototype.request = function (data) {
      if (!this.ready) {
        this.waitingline.push(data);
        this.tryToProcess();
      } else {
        // Add timestamp and unique number to data
        data.id = Date.now() + Math.floor(Date.now() * Math.random());
        data.finished = false;
        // Add data to queue
        this.callbackqueue[data.id] = data;
        // Convert data to string
        var dataString = JSON.stringify(data);
        // Post the message to the correct frame
        this.frame.contentWindow.postMessage(dataString, '*');
      }
    };
    Facebook.prototype.received = function (data) {
      if (data.method == 'ready')
        this.ready = true;
      if (data.method == 'connected')
        this.connected = true;
      if (this.callbackqueue[data.id] !== undefined) {
        if (this.callbackqueue[data.id].callback !== undefined) {
          this.callbackqueue[data.id].callback(data.callbackdata);
          this.callbackqueue[data.id].finished = false;
        }
      }
    };
    Facebook.prototype.tryToProcess = function () {
      var that = this;
      if (!this.ready) {
        $timeout(function () {
          that.tryToProcess();
        }, 500);
      } else {
        for (var x = 0; x < this.waitingline.length; x++) {
          that.request(that.waitingline[x]);
        }
      }
    };
    Facebook.prototype.login = function () {
      var deferred = $q.defer();
      this.request({
        method: 'login',
        callback: function (data) {
          if (data.status == 'connected')
            deferred.resolve(data);
          else
            deferred.reject(data);
        }
      });
      return deferred.promise;
    };
    Facebook.prototype.getLoginStatus = function () {
      var deferred = $q.defer();
      this.request({
        method: 'loginStatus',
        callback: function (data) {
          deferred.resolve(data);
        }
      });
      return deferred.promise;
    };
    Facebook.prototype.api = function (path, data) {
      var deferred = $q.defer();
      // Make request
      this.request({
        method: 'api',
        path: path,
        data: data,
        callback: function (data) {
          deferred.resolve(data);
        }
      });
      return deferred.promise;
    };
    var facebook = new Facebook();
    // Catch messages send to Mopify's page and send them to the correct class
    window.addEventListener('message', function (e) {
      // Check origin
      if (e.origin != 'http://mopify.bitlabs.nl') {
        return;
      }
      var response = e.data;
      switch (response.service) {
      case 'facebook':
        facebook.received(response);
        break;
      }
    });
    return facebook;
  }
]);;angular.module('mopify.services.history', [
  'LocalStorageModule',
  'mopify.services.tasteprofile'
]).factory('History', [
  'localStorageService',
  'TasteProfile',
  function (localStorageService, TasteProfile) {
    'use strict';
    var storagekey = 'history';
    function History() {
      this.historystorage = localStorageService.get(storagekey);
      // Check if historystorage exists, otherwist create empty object with tracks array
      if (this.historystorage === null) {
        this.historystorage = localStorageService.set(storagekey, { tracks: [] });
      }
    }
    History.prototype.addTrack = function (track, meta) {
      // Create trackobject with track and added time
      var trackobject = {
          track: track,
          meta: meta,
          created: Date.now()
        };
      // Add track
      this.historystorage.tracks.push(trackobject);
      // Create an unique version of the tracks based on the track uri
      var unique = _.uniq(this.historystorage.tracks, function (t) {
          return t.track.uri;
        });
      // Save the unique array
      this.historystorage.tracks = unique;
      // Save to storage
      localStorageService.set(storagekey, this.historystorage);
      // Add the track to the tasteprofile
      var itemblock = [{ 'item': { 'track_id': track.uri } }];
      TasteProfile.update(itemblock);
    };
    History.prototype.getTracks = function () {
      return localStorageService.get(storagekey).tracks;
    };
    return new History();
  }
]);;/*
 * Inspired and mostly coming from MartijnBoland's MopidyService.js
 * https://github.com/martijnboland/moped/blob/master/src/app/services/mopidyservice.js
 */
'use strict';
angular.module('mopify.services.mopidy', ['mopify.services.settings']).factory('mopidyservice', [
  '$q',
  '$rootScope',
  '$cacheFactory',
  'Settings',
  function ($q, $rootScope, $cacheFactory, Settings) {
    // Create consolelog object for Mopidy to log it's logs on
    var consoleError = console.error.bind(console);
    /*
     * Wrap calls to the Mopidy API and convert the promise to Angular $q's promise.
     * 
     * @param String functionNameToWrap
     * @param Object thisObj
     */
    function wrapMopidyFunc(functionNameToWrap, thisObj) {
      return function () {
        var deferred = $q.defer();
        var args = Array.prototype.slice.call(arguments);
        var self = thisObj || this;
        $rootScope.$broadcast('mopify:callingmopidy', {
          name: functionNameToWrap,
          args: args
        });
        if (self.isConnected) {
          executeFunctionByName(functionNameToWrap, self, args).then(function (data) {
            deferred.resolve(data);
            $rootScope.$broadcast('mopify:calledmopidy', {
              name: functionNameToWrap,
              args: args
            });
          }, function (err) {
            deferred.reject(err);
            $rootScope.$broadcast('mopify:errormopidy', {
              name: functionNameToWrap,
              args: args,
              err: err
            });
          });
        } else {
          executeFunctionByName(functionNameToWrap, self, args).then(function (data) {
            deferred.resolve(data);
            $rootScope.$broadcast('mopify:calledmopidy', {
              name: functionNameToWrap,
              args: args
            });
          }, function (err) {
            deferred.reject(err);
            $rootScope.$broadcast('mopify:errormopidy', {
              name: functionNameToWrap,
              args: args,
              err: err
            });
          });
        }
        return deferred.promise;
      };
    }
    /*
     * Execute the given function
     * 
     * @param String functionName
     * @param Object thisObj
	 * @param Array args
     */
    function executeFunctionByName(functionName, context, args) {
      var namespaces = functionName.split('.');
      var func = namespaces.pop();
      for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
      }
      return context[func].apply(context, args);
    }
    return {
      mopidy: {},
      isConnected: false,
      currentTlTracks: [],
      start: function () {
        var self = this;
        // Emit message that we're starting the Mopidy service
        $rootScope.$broadcast('mopify:startingmopidy');
        // Get mopidy ip and port from settigns
        var mopidyip = Settings.get('mopidyip', 'localhost');
        var mopidyport = Settings.get('mopidyport', '6680');
        // Initialize mopidy
        this.mopidy = new Mopidy({
          webSocketUrl: 'ws://' + mopidyip + ':' + mopidyport + '/mopidy/ws',
          callingConvention: 'by-position-or-by-name'
        });
        // Convert Mopidy events to Angular events
        this.mopidy.on(function (ev, args) {
          $rootScope.$broadcast('mopidy:' + ev, args);
          if (ev === 'state:online') {
            self.isConnected = true;
          }
          if (ev === 'state:offline') {
            self.isConnected = false;
          }
        });
        $rootScope.$broadcast('mopify:mopidystarted');
      },
      stop: function () {
        $rootScope.$broadcast('mopify:stoppingmopidy');
        this.mopidy.close();
        this.mopidy.off();
        this.mopidy = null;
        $rootScope.$broadcast('mopify:stoppedmopidy');
      },
      restart: function () {
        this.stop();
        this.start();
      },
      getPlaylists: function () {
        return wrapMopidyFunc('mopidy.playlists.getPlaylists', this)();
      },
      getPlaylist: function (uri) {
        return wrapMopidyFunc('mopidy.playlists.lookup', this)({ uri: uri });
      },
      refresh: function (uri) {
        return wrapMopidyFunc('mopidy.library.refresh', this)({ uri: uri });
      },
      getTrack: function (uri) {
        return wrapMopidyFunc('mopidy.library.lookup', this)({ uri: uri });
      },
      getAlbum: function (uri) {
        return wrapMopidyFunc('mopidy.library.lookup', this)({ uri: uri });
      },
      getArtist: function (uri) {
        return wrapMopidyFunc('mopidy.library.lookup', this)({ uri: uri });
      },
      search: function (query) {
        return wrapMopidyFunc('mopidy.library.search', this)({ any: [query] });
      },
      searchTrack: function (artist, title) {
        return wrapMopidyFunc('mopidy.library.findExact', this)({
          title: [title],
          artist: [artist]
        });
      },
      findExact: function (query) {
        return wrapMopidyFunc('mopidy.library.findExact', this)(query);
      },
      getCurrentTrack: function () {
        return wrapMopidyFunc('mopidy.playback.getCurrentTrack', this)();
      },
      getTimePosition: function () {
        return wrapMopidyFunc('mopidy.playback.getTimePosition', this)();
      },
      seek: function (timePosition) {
        return wrapMopidyFunc('mopidy.playback.seek', this)({ time_position: timePosition });
      },
      getVolume: function () {
        return wrapMopidyFunc('mopidy.playback.getVolume', this)();
      },
      setVolume: function (volume) {
        return wrapMopidyFunc('mopidy.playback.setVolume', this)({ volume: volume });
      },
      getState: function () {
        return wrapMopidyFunc('mopidy.playback.getState', this)();
      },
      lookup: function (uri) {
        return wrapMopidyFunc('mopidy.library.lookup', this)({ uri: uri });
      },
      playTrack: function (track, surroundingTracks) {
        var self = this;
        if (surroundingTracks === undefined)
          surroundingTracks = [track];
        // Check if a playlist change is required. If not cust change the track.
        if (self.currentTlTracks.length > 0) {
          var trackUris = _.pluck(surroundingTracks, 'uri');
          var currentTrackUris = _.map(self.currentTlTracks, function (tlTrack) {
              return tlTrack.track.uri;
            });
          if (_.difference(trackUris, currentTrackUris).length === 0) {
            // no playlist change required, just play a different track.
            self.mopidy.playback.stop({ clear_current_track: false }).then(function () {
              var tlTrackToPlay = _.find(self.currentTlTracks, function (tlTrack) {
                  return tlTrack.track.uri === track.uri;
                });
              self.mopidy.playback.changeTrack({ tl_track: tlTrackToPlay }).then(function () {
                self.mopidy.playback.play().then(function () {
                  $rootScope.$broadcast('mopidy:event:trackPlaybackStarted', tlTrackToPlay);
                });
              });
            });
            return;
          }
        }
        self.mopidy.playback.stop({ clear_current_track: true }).then(function () {
          self.mopidy.tracklist.clear();
        }, consoleError).then(function () {
          self.mopidy.tracklist.add({ tracks: surroundingTracks });
        }, consoleError).then(function () {
          self.mopidy.tracklist.getTlTracks().then(function (tlTracks) {
            self.currentTlTracks = tlTracks;
            var tlTrackToPlay = _.find(tlTracks, function (tlTrack) {
                return tlTrack.track.uri === track.uri;
              });
            self.mopidy.playback.changeTrack({ tl_track: tlTrackToPlay }).then(function () {
              self.mopidy.playback.play().then(function () {
                $rootScope.$broadcast('mopidy:event:trackPlaybackStarted', tlTrackToPlay);
              });
            });
          }, consoleError);
        }, consoleError);
      },
      playTrackAtIndex: function (index) {
        var self = this;
        self.mopidy.tracklist.getTlTracks().then(function (tlTracks) {
          index = index < tlTracks.length ? index : tlTracks.length - 1;
          var tlTrackToPlay = tlTracks[index];
          self.mopidy.playback.changeTrack({ tl_track: tlTrackToPlay }).then(function () {
            self.mopidy.playback.play().then(function () {
              $rootScope.$broadcast('mopidy:event:trackPlaybackStarted', tlTrackToPlay);
            });
          });
        }, consoleError);
      },
      clearTracklist: function () {
        return this.mopidy.tracklist.clear();
      },
      addToTracklist: function (obj) {
        return wrapMopidyFunc('mopidy.tracklist.add', this)(obj);
      },
      getTracklist: function () {
        return wrapMopidyFunc('mopidy.tracklist.getTlTracks', this)();
      },
      shuffleTracklist: function () {
        return wrapMopidyFunc('mopidy.tracklist.shuffle', this)();
      },
      play: function (tltrack) {
        if (tltrack !== undefined) {
          return wrapMopidyFunc('mopidy.playback.play', this)({ tl_track: tltrack });
        } else {
          return wrapMopidyFunc('mopidy.playback.play', this)();
        }
      },
      filterTracklist: function (query) {
        return wrapMopidyFunc('mopidy.tracklist.filter', this)({ criteria: query });
      },
      pause: function () {
        return wrapMopidyFunc('mopidy.playback.pause', this)();
      },
      stopPlayback: function (clearCurrentTrack) {
        return wrapMopidyFunc('mopidy.playback.stop', this)({ clear_current_track: clearCurrentTrack });
      },
      previous: function () {
        return wrapMopidyFunc('mopidy.playback.previous', this)();
      },
      next: function () {
        return wrapMopidyFunc('mopidy.playback.next', this)();
      },
      getRandom: function () {
        return wrapMopidyFunc('mopidy.tracklist.getRandom', this)();
      },
      setRandom: function (isRandom) {
        return wrapMopidyFunc('mopidy.tracklist.setRandom', this)([isRandom]);
      },
      getRepeat: function () {
        return wrapMopidyFunc('mopidy.tracklist.getRepeat', this)();
      },
      setRepeat: function (isRepeat) {
        return wrapMopidyFunc('mopidy.tracklist.setRepeat', this)([isRepeat]);
      },
      removeFromTracklist: function (dict) {
        return wrapMopidyFunc('mopidy.tracklist.remove', this)({ criteria: dict });
      }
    };
  }
]);;angular.module('mopify.services.settings', ['LocalStorageModule']).factory('Settings', [
  'localStorageService',
  function (localStorageService) {
    'use strict';
    var rootkey = 'settings';
    function Settings() {
    }
    /**
     * Bind a variable to the localStorageService
     * @param  {string} element the variable to bind
     */
    Settings.prototype.bind = function (element) {
      localStorageService.bind(element, rootkey);
    };
    /**
     * Get a value from the storage, or return the defaltvalue if it doesn't exist.
     * @param  {string} key          
     * @param  {string} defaultvalue 
     */
    Settings.prototype.get = function (key, defaultvalue) {
      return localStorageService.get(rootkey) !== null && localStorageService.get(rootkey)[key] !== undefined ? localStorageService.get(rootkey)[key] : defaultvalue;
    };
    /**
     * Save a (new) value
     * @param  {string} key   
     * @param  {string} value 
     */
    Settings.prototype.put = function (key, value) {
    };
    return new Settings();
  }
]);;angular.module('mopify.services.spotifylogin', ['spotify']).factory('SpotifyLogin', [
  '$q',
  '$rootScope',
  '$timeout',
  '$document',
  'Spotify',
  '$interval',
  function ($q, $rootScope, $timeout, $document, Spotify, $interval) {
    'use strict';
    // Get body
    var body = $document.find('body').eq(0);
    // Create empty frames object
    var frame;
    // Create the iframe in the document
    function createFrame(service) {
      frame = document.createElement('iframe');
      frame.setAttribute('src', 'http://mopify.bitlabs.nl/auth/' + service + '/frame/#' + window.location.host);
      frame.style.width = 1 + 'px';
      frame.style.height = 1 + 'px';
      // Add to body and register in frames object
      body.append(frame);
    }
    // Create communication frame for Spotify
    createFrame('spotify');
    function SpotifyLogin() {
      this.accessToken = null;
      this.frame = frame;
      this.waitingline = [];
      this.connected = false;
      this.lastPositiveLoginCheck = 0;
      // Run the login check on create and set the interval to check every two minutes
      this.getLoginStatus().then(function (resp) {
        $rootScope.$broadcast('mopify:spotify:' + resp.status.replace(' ', ''));
      });
      var that = this;
      $interval(function () {
        that.getLoginStatus().then(function (response) {
          // Login if disconnected
          if (response.status != 'connected')
            that.login();
        });
      }, 120000);
    }
    /**
     * Get the current login status from Spotify and return 
     * if we're connected or not
     * @return {$q.defer().promise}
     */
    SpotifyLogin.prototype.getLoginStatus = function () {
      var that = this;
      var deferred = $q.defer();
      // Check with last login check
      if (Date.now() - that.lastPositiveLoginCheck > 600000) {
        // Set the old token from the localstorage and check if that one still works
        var oldToken = localStorage.getItem('spotify-token');
        Spotify.setAuthToken(oldToken);
        // Make the call to spotify to see if we are logged in
        Spotify.getCurrentUser().then(function (data) {
          deferred.resolve({ status: 'connected' });
          that.connected = true;
          // Set last login check
          that.lastPositiveLoginCheck = Date.now();
        }, function (errData) {
          // If status equals 401 we have to reauthorize the user
          if (errData.error.status == 401) {
            that.connected = false;
            deferred.resolve({ status: 'not connected' });
          }
        });
      } else {
        deferred.resolve({ status: 'connected' });
      }
      return deferred.promise;
    };
    /**
     * Open the Spotify login screen and start asking for the key
     * The key will be saved on the bitlabs.nl localstorage which can be accessed
     * through the created iframe
     * @return {$q.defer().promise}
     */
    SpotifyLogin.prototype.login = function () {
      var that = this;
      var deferred = $q.defer();
      // Ask the spotify login window
      Spotify.login();
      // Start waiting for the spotify answer
      that.requestKey().then(function () {
        if (that.accessToken !== null) {
          // Set the auth token
          Spotify.setAuthToken(that.accessToken);
          that.connected = true;
          // Save token
          localStorage.setItem('spotify-token', that.accessToken);
          deferred.resolve(that.accessToken);
        } else {
          deferred.reject();
        }
      });
      return deferred.promise;
    };
    /**
     * Disconnect from Spotify
     */
    SpotifyLogin.prototype.disconnect = function () {
      // Remove storage token
      localStorage.removeItem('spotify-token');
      // Clear Spotify auth token
      Spotify.setAuthToken('');
      // Set connected to false
      this.connected = false;
    };
    /**
     * Request a key from spotify.
     * This is done by sending a request to the bitlabs server which will return the saved spotify key
     * @param  {$.defer} deferred 
     * @return {$.defer().promise}        
     */
    SpotifyLogin.prototype.requestKey = function (deferred) {
      var that = this;
      deferred = deferred || $q.defer();
      var postdata = { method: 'get' };
      // Ask for the key
      frame.contentWindow.postMessage(JSON.stringify(postdata), '*');
      // Check if key has landed
      if (that.accessToken !== null) {
        deferred.resolve();
      } else {
        $timeout(function () {
          that.requestKey(deferred);
        }, 1000);
      }
      return deferred.promise;
    };
    var spotifyLogin = new SpotifyLogin();
    // Handler on message
    window.addEventListener('message', function (e) {
      // Check origin
      if (e.origin != 'http://mopify.bitlabs.nl') {
        return;
      }
      var response = e.data;
      if (response.service == 'spotify') {
        if (response.key !== null)
          spotifyLogin.accessToken = response.key;
      }
    });
    return spotifyLogin;
  }
]);;/**
 * The station service will keep track of the current station (if started)
 * This means that it will enable/disable functions in the player and check when a new song has to be loaded
 */
angular.module('mopify.services.station', [
  'angular-echonest',
  'llNotifier',
  'mopify.services.mopidy',
  'mopify.services.util',
  'mopify.services.spotifylogin',
  'spotify'
]).factory('stationservice', [
  '$rootScope',
  '$q',
  '$timeout',
  'Echonest',
  'mopidyservice',
  'Spotify',
  'localStorageService',
  'util',
  'SpotifyLogin',
  'notifier',
  function ($rootScope, $q, $timeout, Echonest, mopidyservice, Spotify, localStorageService, util, SpotifyLogin, notifier) {
    'use strict';
    var stationPlaying = false;
    var echonestTracksQueue = [];
    /**
     * Process a number of tracks from the echonestTracksQue
     * @return {$q.defer} a promise 
     */
    function processMopidyTracklist() {
      var deferred = $q.defer();
      // The reponse from echonest only contains the artist name and track title. We need to look up the tracks in mopidy and add them
      // This is done in batches to prevent mopidy from overloading
      if (echonestTracksQueue.length > 0) {
        generateMopidyTracks().then(function (tracks) {
          console.log(tracks);
          mopidyservice.addToTracklist({ tracks: tracks }).then(function (response) {
            $timeout(processMopidyTracklist, 1000);
            deferred.resolve(response);
          });
        });
      }
      return deferred.promise;
    }
    /**
     * Generate Mopidy tracks from the echonestTracksQueue in batches
     * @return {$q.defer} a promise 
     */
    function generateMopidyTracks() {
      // Get tracks from array
      var batch = echonestTracksQueue.splice(0, 10);
      var deferred = $q.defer();
      // Map the uri from the echonest results
      var songuris = _.map(batch, function (song) {
          return song.tracks[0].foreign_id;
        });
      // Find all uris in mopidy
      mopidyservice.findExact({ uri: songuris }).then(function (result) {
        deferred.resolve(result[0].tracks);
      });
      return deferred.promise;
    }
    /**
     * Prepare the parameters that have to be send to Echonest
     * @param  {station} station - object from the stations controller containing the information for the new radio
     * @return {$q.defer} 
     */
    function prepareParameters(station) {
      var parameters = {
          results: 50,
          bucket: [
            'id:spotify',
            'tracks'
          ],
          limit: true
        };
      var deferred = $q.defer();
      if (station.type == 'artist') {
        parameters.artist = station.name;
        parameters.type = 'artist-radio';
        deferred.resolve(parameters);
      }
      if (station.type == 'track') {
        parameters.song_id = station.spotify.uri;
        parameters.type = 'song-radio';
        deferred.resolve(parameters);
      }
      if (station.type == 'album' || station.type == 'user') {
        parameters.type = 'song-radio';
        if (station.spotify.tracks === undefined) {
          Spotify.getAlbum(station.spotify.id).then(function (data) {
            parameters.song_id = createTrackIdsList(data.tracks);
            deferred.resolve(parameters);
          });
        } else {
          parameters.song_id = createTrackIdsList(station.spotify.tracks);
          deferred.resolve(parameters);
        }
      }
      if (station.type == 'tracks') {
        parameters.type = 'song-radio';
        parameters.song_id = createTrackIdsList(station.tracks);
        deferred.resolve(parameters);
      }
      return deferred.promise;
    }
    /**
     * Get 5 track ids from the given tracks (random)
     * @param  {array} tracks 
     * @return {array}        the spotify track ids
     */
    function createTrackIdsList(tracks) {
      // Get items and shuffle
      var items = tracks.items || tracks;
      items = util.shuffleArray(items);
      tracks = items.splice(0, 4);
      var trackids = [];
      for (var x = 0; x < tracks.length; x++) {
        if (tracks[x].uri === undefined)
          trackids.push(tracks[x].track.uri);
        else
          trackids.push(tracks[x].uri);
      }
      return trackids;
    }
    /**
     * Create the new station using Echonest
     * @param  {station} station - object from the stations controller containing the information for the new radio
     */
    function createStation(station) {
      // Get the songs from Echonest
      prepareParameters(station).then(function (parameters) {
        Echonest.playlist.static(parameters).then(function (songs) {
          echonestTracksQueue = songs;
          mopidyservice.clearTracklist().then(function () {
            processMopidyTracklist().then(function () {
              mopidyservice.playTrackAtIndex(0);
            });
          });
        });
      });
    }
    /**
     * Get the Spotify object from the given uri
     * @param  {string} uri
     * @return {object}     Spotify object
     */
    function getSpotifyObject(uri) {
      var urisplitted = uri.split(':');
      var deferred = $q.defer();
      switch (urisplitted[1]) {
      case 'artist':
        Spotify.getArtist(urisplitted[2]).then(function (data) {
          deferred.resolve(data);
        });
        break;
      case 'track':
        Spotify.getTrack(urisplitted[2]).then(function (data) {
          deferred.resolve(data);
        });
        break;
      case 'album':
        Spotify.getAlbum(urisplitted[2]).then(function (data) {
          deferred.resolve(data);
        });
        break;
      case 'user':
        if (SpotifyLogin.connected) {
          Spotify.getPlaylist(urisplitted[2], urisplitted[4]).then(function (data) {
            var image = '';
            if (data.images === undefined)
              image = data.album.images[1].url;
            else if (data.images[1] !== undefined)
              image = data.images[1].url;
            else if (data.images[0] !== undefined)
              image = data.images[0].url;
            data.images = [
              image,
              image
            ];
            deferred.resolve(data);
          });
        } else {
          notifier.notify({
            type: 'custom',
            template: 'Please connect your Spotify account to start a station from a Spotify user\'s playlist',
            delay: 7500
          });
        }
        break;
      }
      return deferred.promise;
    }
    return {
      init: function () {
      },
      start: function (station) {
        createStation(station);
      },
      startFromSpotifyUri: function (uri) {
        var urisplitted = uri.split(':');
        var deferred = $q.defer();
        getSpotifyObject(uri).then(function (data) {
          var image = '';
          if (data.images === undefined)
            image = data.album.images[1].url;
          else if (data.images[1] !== undefined)
            image = data.images[1].url;
          else if (data.images[0] !== undefined)
            image = data.images[0].url;
          var station = {
              type: urisplitted[1],
              spotify: data,
              name: data.name,
              coverImage: image,
              started_at: Date.now()
            };
          // Save the new station
          var allstations = localStorageService.get('stations') || [];
          allstations.push(station);
          localStorageService.set('stations', allstations);
          createStation(station);
          deferred.resolve(station);
        });
        return deferred.promise;
      },
      startFromTracks: function (tracks) {
        var station = {
            type: 'tracks',
            spotify: null,
            tracks: tracks,
            name: 'Tracklist',
            coverImage: './assets/images/tracklist-header.jpg',
            started_at: Date.now()
          };
        // Save the new station
        var allstations = localStorageService.get('stations');
        allstations.push(station);
        localStorageService.set('stations', allstations);
        createStation(station);
      }
    };
  }
]);;angular.module('mopify.services.tasteprofile', [
  'LocalStorageModule',
  'llNotifier'
]).factory('TasteProfile', [
  '$http',
  '$q',
  'localStorageService',
  'notifier',
  function ($http, $q, localStorageService, notifier) {
    'use strict';
    var apiUrl = 'http://developer.echonest.com/api/v4/';
    var apiKey = 'UVUDDM7M0S5MWNQFV';
    var post = function (url, data) {
      var deferred = $q.defer();
      data.api_key = apiKey;
      var postdata = {
          data: data,
          url: apiUrl + url,
          callback: 'JSON_CALLBACK'
        };
      $http({
        method: 'JSONP',
        url: 'http://mopify.bitlabs.nl/api/post/',
        params: postdata
      }).success(function (result) {
        deferred.resolve(result.response);
      });
      return deferred.promise;
    };
    var get = function (url, data) {
      var deferred = $q.defer();
      data.api_key = apiKey;
      data.format = 'jsonp';
      data.callback = 'JSON_CALLBACK';
      $http({
        method: 'JSONP',
        url: apiUrl + url,
        params: data
      }).success(function (result) {
        deferred.resolve(result.response);
      });
      return deferred.promise;
    };
    function TasteProfile() {
      var tasteprofile = localStorageService.get('tasteprofile');
      if (tasteprofile === null) {
        this.create().then(function (response) {
          tasteprofile = response;
          localStorageService.set('tasteprofile', response);
        });
      } else {
        this.id = tasteprofile.id;
        this.name = tasteprofile.name;
      }
    }
    TasteProfile.prototype.create = function () {
      var deferred = $q.defer();
      post('tasteprofile/create', { name: 'mopify:' + Date.now() + Math.round((Math.random() + 1) * 1000) }).then(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };
    TasteProfile.prototype.update = function (itemblock) {
      var deferred = $q.defer();
      post('tasteprofile/update', {
        id: this.id,
        data: JSON.stringify(itemblock)
      }).then(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };
    TasteProfile.prototype.status = function (ticket) {
      var deferred = $q.defer();
      get('tasteprofile/status', { ticket: ticket }).then(function (response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };
    return new TasteProfile();
  }
]);;/**
 * Some handy utils from Martijn Boland's moped
 */
'use strict';
angular.module(['mopify.services.util'], []).factory('util', [
  '$window',
  function ($window) {
    return {
      timeFromMilliSeconds: function (length) {
        if (length === undefined) {
          return '';
        }
        var d = Number(length / 1000);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        return (h > 0 ? h + ':' : '') + (m > 0 ? (h > 0 && m < 10 ? '0' : '') + m + ':' : '0:') + (s < 10 ? '0' : '') + s;
      },
      artistsToString: function (artists, link) {
        if (artists !== undefined) {
          var artistNames = artists.map(function (artist) {
              return link ? '<a href=\'#/music/artist/' + artist.uri + '\'>' + artist.name + '</a>' : artist.name;
            });
          return artistNames.join(', ');
        } else {
          return '';
        }
      },
      shuffleArray: function (o) {
        //v1.0
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
      }
    };
  }
]);
angular.module('mopify').filter('reverse', function () {
  return function (items) {
    if (items !== null)
      return items.slice().reverse();
  };
});;'use strict';
angular.module('mopify.widgets.directive.album', [
  'mopify.services.mopidy',
  'mopify.services.station'
]).directive('mopifyAlbum', [
  'mopidyservice',
  'stationservice',
  function (mopidyservice, stationservice) {
    return {
      restrict: 'E',
      scope: { album: '=' },
      templateUrl: 'widgets/album.directive.tmpl.html',
      link: function (scope, element, attrs) {
        var encodedname = encodeURIComponent(scope.album.name.replace(/\//g, '-'));
        scope.tracklistUrl = '#/music/tracklist/' + scope.album.uri + '/' + encodedname;
        /*
             * Play the album            
             */
        scope.play = function () {
          mopidyservice.getAlbum(scope.album.uri).then(function (tracks) {
            mopidyservice.playTrack(tracks[0], tracks);
          });
        };
        scope.startStation = function () {
          stationservice.startFromSpotifyUri(scope.album.uri);
        };
      }
    };
  }
]);;'use strict';
angular.module('mopify.widgets.directive.artist', [
  'mopify.services.mopidy',
  'mopify.services.station'
]).directive('mopifyArtist', [
  'mopidyservice',
  'stationservice',
  function (mopidyservice, stationservice) {
    return {
      restrict: 'E',
      scope: { artist: '=' },
      templateUrl: 'widgets/artist.directive.tmpl.html',
      link: function (scope, element, attrs) {
        /*
             * Play the first 50 tracks of the given artist
             */
        scope.play = function () {
          mopidyservice.getArtist(scope.artist.uri).then(function (tracks) {
            mopidyservice.playTrack(tracks[0], tracks.splice(0, 50));
          });
        };
        /**
             * Start a station from the given artist
             */
        scope.startStation = function () {
          stationservice.startFromSpotifyUri(scope.artist.uri);
        };
      }
    };
  }
]);;'use strict';
angular.module('mopify.widgets.directive.browse', [
  'mopify.services.mopidy',
  'mopify.services.station',
  'mopify.services.util',
  'spotify'
]).directive('mopifyBrowse', [
  '$sce',
  'mopidyservice',
  'stationservice',
  'util',
  'Spotify',
  function ($sce, mopidyservice, stationservice, util, Spotify) {
    return {
      restrict: 'E',
      scope: { item: '=' },
      templateUrl: 'widgets/browse.directive.tmpl.html',
      link: function (scope, element, attrs) {
        scope.spotifyuri = null;
        if (scope.item.type == 'echonest') {
          scope.titleslogan = Math.floor(Math.random() * 2) == 1 ? 'Here\'s something you might like:' : 'Recommended for you:';
          scope.spotifyuri = scope.item.echonest.tracks[0].foreign_id;
          Spotify.getTrack(scope.spotifyuri).then(function (response) {
            scope.image = response.album.images[0].url;
            scope.spotifyuri = response.album.uri;
          });
          scope.suggestion = {
            name: scope.item.echonest.title,
            artist: scope.item.echonest.artist_name
          };
        }
        if (scope.item.type == 'artist') {
          scope.titleslogan = 'You listened to ' + scope.item.artist.name + '. You might like this artist to:';
          scope.spotifyuri = scope.item.artist.uri;
          Spotify.getRelatedArtists(scope.spotifyuri).then(function (response) {
            var artist = response.artists[Math.floor(Math.random() * response.artists.length)];
            scope.image = artist.images[1].url;
            scope.suggestion = { name: artist.name };
          });
        }
        // Play the suggestion
        scope.play = function () {
          mopidyservice.lookup(scope.spotifyuri).then(function (tracks) {
            var playtracks = tracks.splice(0, 50);
            mopidyservice.playTrack(playtracks[0], playtracks);
          });
        };
        // Start a station
        scope.startStation = function () {
          stationservice.startFromSpotifyUri(scope.spotifyuri);
        };
      }
    };
  }
]);;'use strict';
var widgetModule = angular.module('mopify.widgets', [
    'spotify',
    'mopify.services.mopidy'
  ]);;'use strict';
angular.module('mopify.widgets.directive.playlist', []).directive('mopifyPlaylist', [
  'Spotify',
  'mopidyservice',
  'stationservice',
  function (Spotify, mopidyservice, stationservice) {
    var defaultAlbumImageUrl = '';
    return {
      restrict: 'E',
      scope: { playlist: '=' },
      templateUrl: 'widgets/playlist.directive.tmpl.html',
      link: function (scope, element, attrs) {
        scope.coverImage = defaultAlbumImageUrl;
        // Get image for the playlist
        if (scope.playlist.__model__ == 'Playlist') {
          Spotify.getTrack(scope.playlist.tracks[0].uri).then(function (data) {
            scope.coverImage = data.album.images[1].url;
          });
        }
        if (scope.playlist.__model__ === undefined) {
          Spotify.getPlaylist(scope.playlist.owner.id, scope.playlist.id).then(function (data) {
            scope.coverImage = data.images[0] !== undefined ? data.images[0].url : data.tracks.items[0].track.album.images[0].url;
          });
        }
        /**
             * Replace the current tracklist with the given playlist
             * @param  {Playlist} playlist
             */
        scope.play = function () {
          if (scope.playlist.__model__ == 'Playlist') {
            mopidyservice.playTrack(scope.playlist.tracks[0], scope.playlist.tracks);
          } else {
            mopidyservice.lookup(scope.playlist.uri).then(function (data) {
              mopidyservice.playTrack(data[0], data);
            });
          }
        };
        var encodedname = encodeURIComponent(scope.playlist.name.replace(/\//g, '-'));
        scope.tracklistUrl = '#/music/tracklist/' + scope.playlist.uri + '/' + encodedname;
        scope.startStation = function () {
          stationservice.startFromSpotifyUri(scope.playlist.uri);
        };
      }
    };
  }
]);;'use strict';
angular.module('mopify.widgets.directive.service', ['LocalStorageModule']).directive('mopifyService', [
  '$rootScope',
  'localStorageService',
  function ($rootScope, localStorageService) {
    return {
      restrict: 'E',
      scope: { service: '=' },
      templateUrl: 'widgets/service.directive.tmpl.html',
      link: function (scope, element, attrs) {
        var connectedServices = localStorageService.get('connectedServices');
        /**
             * Connect the service with mopify
             */
        scope.connectService = function () {
          var servicekey = scope.service.name.replace(' ', '').toLowerCase();
          scope.service.connected = true;
          connectedServices[servicekey] = true;
          // Broadcast the service change
          $rootScope.$broadcast('mopify:services:connected', scope.service);
          // Save to storage
          localStorageService.set('connectedServices', connectedServices);
        };
        /**
             * Disconnect the service from mopify
             */
        scope.disconnectService = function () {
          var servicekey = scope.service.name.replace(' ', '').toLowerCase();
          scope.service.connected = false;
          connectedServices[servicekey] = false;
          // Broadcast the service change
          $rootScope.$broadcast('mopify:services:disconnected', scope.service);
          // Save to storage
          localStorageService.set('connectedServices', connectedServices);
        };
      }
    };
  }
]);;'use strict';
angular.module('mopify.widgets.directive.station', ['mopify.services.station']).directive('mopifyStation', [
  'stationservice',
  function (stationservice) {
    return {
      restrict: 'E',
      scope: { station: '=' },
      templateUrl: 'widgets/station.directive.tmpl.html',
      link: function (scope, element, attrs) {
        /**
             * Start the provided station
             * @param {station} station - station object containing all the information to start the new station
             */
        scope.startStation = function () {
          stationservice.start(scope.station);
        };
        scope.getStationUrl = function () {
          switch (scope.station.type.toLowerCase()) {
          case 'album':
            return '#/music/tracklist/' + scope.station.spotify.uri + '/' + scope.station.name;
          case 'playlist':
            return '#/music/tracklist/' + scope.station.spotify.uri + '/' + scope.station.name;
          case 'artist':
            return '#/music/artist/' + scope.station.spotify.uri;
          case 'track':
            return '#/music/tracklist/' + scope.station.spotify.album.uri + '/' + scope.station.spotify.album.name;
          }
        };
      }
    };
  }
]);;'use strict';
angular.module('mopify.widgets.directive.track', [
  'mopify.services.mopidy',
  'mopify.services.station',
  'mopify.services.spotifylogin',
  'mopify.services.util',
  'spotify',
  'llNotifier'
]).directive('mopifyTrack', [
  '$routeParams',
  'mopidyservice',
  'stationservice',
  'util',
  'Spotify',
  'SpotifyLogin',
  'notifier',
  function ($routeParams, mopidyservice, stationservice, util, Spotify, SpotifyLogin, notifier) {
    return {
      restrict: 'E',
      scope: {
        track: '=',
        surrounding: '=',
        type: '=',
        currentPlayingTrack: '=currentplayingtrack'
      },
      transclude: true,
      templateUrl: 'widgets/track.directive.tmpl.html',
      link: function (scope, element, attrs) {
        var uri = $routeParams.uri;
        // Copy so we have raw tracks again (otherwise mopidy will crash)
        var track = angular.copy(scope.track);
        var surrounding = angular.copy(scope.surrounding);
        scope.visible = true;
        scope.showplaylists = false;
        scope.artistsString = function () {
          return util.artistsToString(scope.track.artists, true);
        };
        scope.lengthHuman = function () {
          return util.timeFromMilliSeconds(scope.track.length || scope.track.duration_ms);
        };
        /*
             * Play the album            
             */
        scope.play = function () {
          if (track.__model__ == 'Track') {
            mopidyservice.playTrack(track, surrounding);
          } else {
            var clickedindex = 0;
            _.each(surrounding, function (iTrack, index) {
              if (track.uri == iTrack.uri) {
                clickedindex = index;
                return;
              }
            });
            // Convert spotify tracks to mopidy tracks
            var surroundinguris = _.map(surrounding, function (track) {
                return track.uri;
              });
            // Get a list of all the urls and play it
            mopidyservice.findExact({ uri: surroundinguris }).then(function (data) {
              var tracks = data[0].tracks;
              mopidyservice.playTrack(tracks[clickedindex], tracks);
            });
          }
        };
        scope.startStation = function () {
          stationservice.startFromSpotifyUri(scope.track.uri);
        };
        scope.addToQueue = function () {
          mopidyservice.addToTracklist({ uri: scope.track.uri });
        };
        /**
             * Remove the track from the tracklist
             * @param  {track} track
             */
        scope.removeFromQueue = function () {
          // Remove from tracklist
          mopidyservice.removeFromTracklist({ 'uri': [track.uri] });
        };
        /*
             * Remove track from the playlist
             */
        scope.removeFromPlaylist = function () {
          var playlistid = uri.split(':')[4];
          var userid = uri.split(':')[2];
          Spotify.removePlaylistTracks(userid, playlistid, scope.track.uri).then(function (response) {
            scope.visible = false;
          });
        };
        /**
             * Load all user's playlists
             */
        scope.showPlaylists = function () {
          if (SpotifyLogin.connected) {
            scope.showplaylists = true;
            scope.userplaylists = [{ name: 'loading...' }];
            Spotify.getCurrentUser().then(function (user) {
              mopidyservice.getPlaylists().then(function (data) {
                var playlists = _.filter(data, function (playlist) {
                    return playlist.uri.indexOf(user.id) > 0;
                  });
                scope.userplaylists = playlists;
              });
            });
          } else {
            notifier.notify({
              type: 'custom',
              template: 'Please connect with the Spotify service first.',
              delay: 3000
            });
          }
        };
        /**
             * Add the track to the playlist
             * @param {string} uri playlist uri
             */
        scope.addToPlaylist = function (uri) {
          if (SpotifyLogin.connected) {
            scope.showplaylists = false;
            var splituri = uri.split(':');
            Spotify.addPlaylistTracks(splituri[2], splituri[4], scope.track.uri).then(function (data) {
              notifier.notify({
                type: 'custom',
                template: 'Track succesfully added to playlist.',
                delay: 3000
              });
            });
          } else {
            notifier.notify({
              type: 'custom',
              template: 'Please connect with the Spotify service first.',
              delay: 3000
            });
          }
        };
      }
    };
  }
]);;/**
 * angular-echonest module
 * https://github.com/kraku/angular-echonest
 *
 * Author: Maciej Podsiedlak - http://mpodsiedlak.com
 */

(function() {
    'use strict';

    angular.module('angular-echonest', []).provider('Echonest', function() {
        var apiUrl = 'http://developer.echonest.com/api/v4/';
        var apiKey = '';
        var Artist, Artists, Songs, Playlist, obj, http, q;

        var query = function(url, data) {
            var deferred = q.defer();

            data.api_key = apiKey;
            data.format = 'jsonp';
            data.callback = 'JSON_CALLBACK';

            http({
                method: 'JSONP',
                url: apiUrl + url,
                params: data
            }).success(function(result) {
                deferred.resolve(result.response);
            });

            return deferred.promise;
        };

        var artistGet = function(name, data) {
            var deferred = q.defer();
            var t = this;
            data = data || {};

            data.id = t.id;

            query('artist/' + name, data).then(function(result) {
                t[name] = result[name];

                deferred.resolve(t);
            });

            return deferred.promise;
        };

        var getParams = function(params) {
            var data = [];

            if (params instanceof Object) {
                for (var i in params) {
                    if (params.hasOwnProperty(i)) {
                        data[i] = params[i];
                    }
                }
            }

            return data;
        };

        var artistsGet = function(name, data) {
            return query('artist/' + name, data).then(function(result) {
                var artists = [];

                for (var i in result.artists) {
                    artists.push(new Artist(result.artists[i]));
                }

                return artists;
            });
        };

        this.setApiKey = function(value) {
            apiKey = value;
        };


        // Artist class
        Artist = function(props) {
            if (props instanceof Object) {
                for (var i in props) {
                    if (props.hasOwnProperty(i)) {
                        this[i] = props[i];
                    }
                }
            }

            return this;
        };

        Artist.prototype = {
            getBiographies: function(data) {
                return artistGet.call(this, 'biographies', data);
            },
            getBlogs: function(data) {
                return artistGet.call(this, 'blogs', data);
            },
            getImages: function(data) {
                return artistGet.call(this, 'images', data);
            },
            getNews: function(data) {
                return artistGet.call(this, 'news', data);
            },
            getReviews: function(data) {
                return artistGet.call(this, 'reviews', data);
            },
            getSongs: function(data) {
                return artistGet.call(this, 'songs', data);
            },
            getFamiliarity: function(data) {
                return artistGet.call(this, 'familiarity', data);
            },
            getHotnes: function(data) {
                return artistGet.call(this, 'hotttnesss', data);
            },
            getSimilar: function(data) {
                return artistGet.call(this, 'similar', data);
            },
            getTerms: function(data) {
                return artistGet.call(this, 'terms', data);
            },
            getTwitter: function(data) {
                return artistGet.call(this, 'twitter', data);
            },
            getUrls: function(data) {
                return artistGet.call(this, 'urls', data);
            }
        };


        // Artists class
        Artists = function() {
            return this;
        };

        Artists.prototype = {

            /*
             * Search artists
             *
             * doc: http://developer.echonest.com/docs/v4/artist.html#search
             */
            search: function(params) {
                var data = getParams(params);

                return artistsGet.call(this, 'search', data);
            },

            /*
             * Get artist
             *
             * doc: http://developer.echonest.com/docs/v4/artist.html#profile
             */
            get: function(data) {
                if (data instanceof Object) {
                    return query('artist/profile', data).then(function(data) {
                        return new Artist(data.artist);
                    });
                }
            },

            /*
             * Return a list of the top hottt artists.
             *
             * doc: http://developer.echonest.com/docs/v4/artist.html#top-hottt
             */
            topHot: function(params) {
                var data = getParams(params);

                return artistsGet.call(this, 'top_hottt', data);
            },

            /*
             * Suggest artists based upon partial names.
             *
             * doc: http://developer.echonest.com/docs/v4/artist.html#suggest-beta
             */
            suggest: function(params) {
                var data = getParams(params);

                return artistsGet.call(this, 'suggest', data);
            },

            /*
             * Extract artist names from text.
             *
             * doc: http://developer.echonest.com/docs/v4/artist.html#extract-beta
             */
            extract: function(params) {
                var data = getParams(params);

                return artistsGet.call(this, 'extract', data);
            }
        };

        // Songs class
        Songs = function() {
            return this;
        };

        Songs.prototype = {

            /*
             * Search for songs given different query types.
             *
             * doc: http://developer.echonest.com/docs/v4/song.html#search
             */
            search: function(params) {
                var data = getParams(params);

                return query('song/search', data).then(function(result) {
                    return result.songs;
                });
            },

            /*
             * Get info about songs given a list of ids.
             *
             * doc: http://developer.echonest.com/docs/v4/song.html#profile
             */
            get: function(data) {
                if (data instanceof Object) {
                    return query('song/profile', data).then(function(result) {
                        return result.songs[0];
                    });
                }
            },

            /*
             * Identifies a song given an Echoprint or Echo Nest Musical Fingerprint hash codes.
             *
             * doc: http://developer.echonest.com/docs/v4/song.html#identify
             */
            identify: function(params) {
                var data = getParams(params);

                return query('song/identify', data).then(function(result) {
                    return result.songs;
                });
            }
        };


        // Playlists class
        Playlist = function() {
            return this;
        };

        Playlist.prototype = {

            /*
             * Returns a static playlist created from the given parameters
             *
             * doc: http://developer.echonest.com/docs/v4/standard.html#static
             */
            static: function(params) {
                var data = getParams(params);

                return query('playlist/static', data).then(function(result) {
                    return result.songs;
                });
            }
        };


        this.$get = ['$http', '$q', function($http, $q) {
            http = $http;
            q = $q;

            obj = {
                artists: new Artists(),
                songs: new Songs(),
                playlist: new Playlist()
            };

            return obj;
        }];
    });
})();
;(function (window, angular, undefined) {
  'use strict';

  angular
    .module('spotify', [])
    .provider('Spotify', function () {

      // Module global settings.
      var settings = {};
      settings.clientId = null;
      settings.redirectUri = null;
      settings.scope = null;
      settings.accessToken = null;

      this.setClientId = function (clientId) {
        settings.clientId = clientId;
        return settings.clientId;
      };

      this.getClientId = function () {
        return settings.clientId;
      };

      this.setRedirectUri = function (redirectUri) {
        settings.redirectUri = redirectUri;
        return settings.redirectUri;
      };

      this.getRedirectUri = function () {
        return settings.redirectUri;
      };

      this.setScope = function (scope) {
        settings.scope = scope;
        return settings.scope;
      };

      var utils = {};
      utils.toQueryString = function (obj) {
        var parts = [];
        angular.forEach(obj, function (value, key) {
          this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }, parts);
        return parts.join('&');
      };

      /**
       * API Base URL
       */
      settings.apiBase = 'https://api.spotify.com/v1';

      this.$get = ['$q', '$http', '$window', function ($q, $http, $window) {

        function NgSpotify () {
          this.clientId = settings.clientId;
          this.redirectUri = settings.redirectUri;
          this.apiBase = settings.apiBase;
          this.scope = settings.scope;
          this.accessToken = null;
          this.toQueryString = utils.toQueryString;
        }

        NgSpotify.prototype.api = function (endpoint, method, params, data, headers) {
          var deferred = $q.defer();

          $http({
            url: this.apiBase + endpoint,
            method: method ? method : 'GET',
            params: params,
            data: data,
            headers: headers
          })
          .success(function (data) {
            deferred.resolve(data);
          })
          .error(function (data) {
            deferred.reject(data);
          });
          return deferred.promise;
        };

        /**
         * Search Spotify
         * q = search query
         * type = artist, album or track
         */
        NgSpotify.prototype.search = function (q, type, options) {
          options = options || {};
          options.q = q;
          options.type = type;

          return this.api('/search', 'GET', options);
        };

        /**
          ====================== Albums =====================
         */

        /**
         * Gets an album
         * Pass in album id or spotify uri
         */
        NgSpotify.prototype.getAlbum = function (album) {
          album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];

          return this.api('/albums/' + album);
        };

        /**
         * Gets an album
         * Pass in comma separated string or array of album ids
         */
        NgSpotify.prototype.getAlbums = function (albums) {
          albums = angular.isString(albums) ? albums.split(',') : albums;
          angular.forEach(albums, function (value, index) {
            albums[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/albums', 'GET', {
            ids: albums ? albums.toString() : ''
          });
        };

        /**
         * Get Album Tracks
         * Pass in album id or spotify uri
         */
        NgSpotify.prototype.getAlbumTracks = function (album, options) {
          album = album.indexOf('spotify:') === -1 ? album : album.split(':')[2];

          return this.api('/albums/' + album + '/tracks', 'GET', options);
        };

        /**
          ====================== Artists =====================
         */

        /**
         * Get an Artist
         */
        NgSpotify.prototype.getArtist = function (artist) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist);
        };

        /**
         * Get multiple artists
         */
        NgSpotify.prototype.getArtists = function (artists) {
          artists = angular.isString(artists) ? artists.split(',') : artists;
          angular.forEach(artists, function (value, index) {
            artists[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/artists/', 'GET', {
            ids: artists ? artists.toString() : ''
          });
        };

        //Artist Albums
        NgSpotify.prototype.getArtistAlbums = function (artist, options) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist + '/albums', 'GET', options);
        };

        /**
         * Get Artist Top Tracks
         * The country: an ISO 3166-1 alpha-2 country code.
         */
        NgSpotify.prototype.getArtistTopTracks = function (artist, country) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist + '/top-tracks', 'GET', {
            country: country
          });
        };

        NgSpotify.prototype.getRelatedArtists = function (artist) {
          artist = artist.indexOf('spotify:') === -1 ? artist : artist.split(':')[2];

          return this.api('/artists/' + artist + '/related-artists');
        };


        /**
          ====================== Tracks =====================
         */
        NgSpotify.prototype.getTrack = function (track) {
          track = track.indexOf('spotify:') === -1 ? track : track.split(':')[2];

          return this.api('/tracks/' + track);
        };

        NgSpotify.prototype.getTracks = function (tracks) {
          tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/tracks/', 'GET', {
            ids: tracks ? tracks.toString() : ''
          });
        };


        /**
          ====================== Playlists =====================
         */
        NgSpotify.prototype.getUserPlaylists = function (userId, options) {
          return this.api('/users/' + userId + '/playlists', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.getPlaylist = function (userId, playlistId, options) {
          return this.api('/users/' + userId + '/playlists/' + playlistId, 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.getPlaylistTracks = function (userId, playlistId, options) {
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.createPlaylist = function (userId, options) {
          return this.api('/users/' + userId + '/playlists', 'POST', null, options, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.addPlaylistTracks = function (userId, playlistId, tracks, options) {
          tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
          });
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'POST', {
            uris: tracks.toString(),
            position: options ? options.position : null
          }, null, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.removePlaylistTracks = function (userId, playlistId, tracks) {
          tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
          var track;
          angular.forEach(tracks, function (value, index) {
            track = tracks[index];
            tracks[index] = {
              uri: track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track
            };
          });
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'DELETE', null, {
            tracks: tracks
          }, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.replacePlaylistTracks = function (userId, playlistId, tracks) {
          tracks = angular.isArray(tracks) ? tracks : tracks.split(',');
          var track;
          angular.forEach(tracks, function (value, index) {
            track = tracks[index];
            tracks[index] = track.indexOf('spotify:') === -1 ? 'spotify:track:' + track : track;
          });
          return this.api('/users/' + userId + '/playlists/' + playlistId + '/tracks', 'PUT', {
            uris: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        NgSpotify.prototype.updatePlaylistDetails = function (userId, playlistId, options) {
          return this.api('/users/' + userId + '/playlists/' + playlistId, 'PUT', null, options, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        /**
          ====================== User =====================
         */

        NgSpotify.prototype.getUser = function (userId) {
          return this.api('/users/' + userId);
        };

        NgSpotify.prototype.getCurrentUser = function () {
          return this.api('/me', 'GET', null, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        /**
          ====================== User Library =====================
         */
        NgSpotify.prototype.getSavedUserTracks = function (options) {
          return this.api('/me/tracks', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.userTracksContains = function (tracks) {
          tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/me/tracks/contains', 'GET', {
            ids: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.saveUserTracks = function (tracks) {
          tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/me/tracks', 'PUT', {
            ids: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.removeUserTracks = function (tracks) {
          tracks = angular.isString(tracks) ? tracks.split(',') : tracks;
          angular.forEach(tracks, function (value, index) {
            tracks[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
          });
          return this.api('/me/tracks', 'DELETE', {
            ids: tracks.toString()
          }, null, {
            'Authorization': 'Bearer ' + this.authToken,
            'Content-Type': 'application/json'
          });
        };

        /**
          ====================== Browse =====================
         */
        NgSpotify.prototype.getFeaturedPlaylists = function (options) {
          return this.api('/browse/featured-playlists', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        NgSpotify.prototype.getNewReleases = function (options) {
          return this.api('/browse/new-releases', 'GET', options, null, {
            'Authorization': 'Bearer ' + this.authToken
          });
        };

        /**
          ====================== Login =====================
         */
        NgSpotify.prototype.setAuthToken = function (authToken) {
          this.authToken = authToken;
          return this.authToken;
        };

        NgSpotify.prototype.login = function () {
          var deferred = $q.defer();
          var that = this;

          var w = 400,
              h = 500,
              left = (screen.width / 2) - (w / 2),
              top = (screen.height / 2) - (h / 2);

          var params = {
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: this.scope || '',
            response_type: 'token'
          };

          var authWindow = window.open(
            'https://accounts.spotify.com/authorize?' + this.toQueryString(params),
            'Spotify',
            'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left
          );

          function storageChanged (e) {
            if (e.key === 'spotify-token') {
              if (authWindow) {
                authWindow.close();
              }

              that.setAuthToken(e.newValue);
              $window.removeEventListener('storage', storageChanged, false);
              //localStorage.removeItem('spotify-token');

              deferred.resolve(e.newValue);
            }
          }

          $window.addEventListener('storage', storageChanged, false);

          return deferred.promise;
        };

        return new NgSpotify();
      }];

    });

}(window, angular));
;/*! Mopidy.js v0.4.0 - built 2014-06-24
 * http://www.mopidy.com/
 * Copyright (c) 2014 Stein Magnus Jodal and contributors
 * Licensed under the Apache License, Version 2.0 */
!function(a){if("object"==typeof exports)module.exports=a();else if("function"==typeof define&&define.amd)define(a);else{var b;"undefined"!=typeof window?b=window:"undefined"!=typeof global?b=global:"undefined"!=typeof self&&(b=self),b.Mopidy=a()}}(function(){var a;return function b(a,c,d){function e(g,h){if(!c[g]){if(!a[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};a[g][0].call(j.exports,function(b){var c=a[g][1][b];return e(c?c:b)},j,j.exports,b,a,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){b.exports={Client:window.WebSocket}},{}],2:[function(b,c){("function"==typeof a&&a.amd&&function(b){a("bane",b)}||"object"==typeof c&&function(a){c.exports=a()}||function(a){this.bane=a()})(function(){"use strict";function a(a,b,c){var d,e=c.length;if(e>0)for(d=0;e>d;++d)c[d](a,b);else setTimeout(function(){throw b.message=a+" listener threw error: "+b.message,b},0)}function b(a){if("function"!=typeof a)throw new TypeError("Listener is not function");return a}function c(a){return a.supervisors||(a.supervisors=[]),a.supervisors}function d(a,b){return a.listeners||(a.listeners={}),b&&!a.listeners[b]&&(a.listeners[b]=[]),b?a.listeners[b]:a.listeners}function e(a){return a.errbacks||(a.errbacks=[]),a.errbacks}function f(f){function h(b,c,d){try{c.listener.apply(c.thisp||f,d)}catch(g){a(b,g,e(f))}}return f=f||{},f.on=function(a,e,f){return"function"==typeof a?c(this).push({listener:a,thisp:e}):void d(this,a).push({listener:b(e),thisp:f})},f.off=function(a,b){var f,g,h,i;if(!a){f=c(this),f.splice(0,f.length),g=d(this);for(h in g)g.hasOwnProperty(h)&&(f=d(this,h),f.splice(0,f.length));return f=e(this),void f.splice(0,f.length)}if("function"==typeof a?(f=c(this),b=a):f=d(this,a),!b)return void f.splice(0,f.length);for(h=0,i=f.length;i>h;++h)if(f[h].listener===b)return void f.splice(h,1)},f.once=function(a,b,c){var d=function(){f.off(a,d),b.apply(this,arguments)};f.on(a,d,c)},f.bind=function(a,b){var c,d,e;if(b)for(d=0,e=b.length;e>d;++d){if("function"!=typeof a[b[d]])throw new Error("No such method "+b[d]);this.on(b[d],a[b[d]],a)}else for(c in a)"function"==typeof a[c]&&this.on(c,a[c],a);return a},f.emit=function(a){var b,e,f=c(this),i=g.call(arguments);for(b=0,e=f.length;e>b;++b)h(a,f[b],i);for(f=d(this,a).slice(),i=g.call(arguments,1),b=0,e=f.length;e>b;++b)h(a,f[b],i)},f.errback=function(a){this.errbacks||(this.errbacks=[]),this.errbacks.push(b(a))},f}var g=Array.prototype.slice;return{createEventEmitter:f,aggregate:function(a){var b=f();return a.forEach(function(a){a.on(function(a,c){b.emit(a,c)})}),b}}})},{}],3:[function(a,b){function c(){}var d=b.exports={};d.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),d.title="browser",d.browser=!0,d.env={},d.argv=[],d.on=c,d.addListener=c,d.once=c,d.off=c,d.removeListener=c,d.removeAllListeners=c,d.emit=c,d.binding=function(){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(){throw new Error("process.chdir is not supported")}},{}],4:[function(b,c){!function(a){"use strict";a(function(a){var b=a("./makePromise"),c=a("./scheduler"),d=a("./async");return b({scheduler:new c(d)})})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})},{"./async":7,"./makePromise":17,"./scheduler":18}],5:[function(b,c){!function(a){"use strict";a(function(){function a(a){this.head=this.tail=this.length=0,this.buffer=new Array(1<<a)}return a.prototype.push=function(a){return this.length===this.buffer.length&&this._ensureCapacity(2*this.length),this.buffer[this.tail]=a,this.tail=this.tail+1&this.buffer.length-1,++this.length,this.length},a.prototype.shift=function(){var a=this.buffer[this.head];return this.buffer[this.head]=void 0,this.head=this.head+1&this.buffer.length-1,--this.length,a},a.prototype._ensureCapacity=function(a){var b,c=this.head,d=this.buffer,e=new Array(a),f=0;if(0===c)for(b=this.length;b>f;++f)e[f]=d[f];else{for(a=d.length,b=this.tail;a>c;++f,++c)e[f]=d[c];for(c=0;b>c;++f,++c)e[f]=d[c]}this.buffer=e,this.head=0,this.tail=this.length},a})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],6:[function(b,c){!function(a){"use strict";a(function(){function a(b){Error.call(this),this.message=b,this.name=a.name,"function"==typeof Error.captureStackTrace&&Error.captureStackTrace(this,a)}return a.prototype=Object.create(Error.prototype),a.prototype.constructor=a,a})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],7:[function(b,c){(function(d){!function(a){"use strict";a(function(a){var b,c;return b="undefined"!=typeof d&&null!==d&&"function"==typeof d.nextTick?function(a){d.nextTick(a)}:(c="function"==typeof MutationObserver&&MutationObserver||"function"==typeof WebKitMutationObserver&&WebKitMutationObserver)?function(a,b){function c(){var a=d;d=void 0,a()}var d,e=a.createElement("div"),f=new b(c);return f.observe(e,{attributes:!0}),function(a){d=a,e.setAttribute("class","x")}}(document,c):function(a){try{return a("vertx").runOnLoop||a("vertx").runOnContext}catch(b){}var c=setTimeout;return function(a){c(a,0)}}(a)})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})}).call(this,b("FWaASH"))},{FWaASH:3}],8:[function(b,c){!function(a){"use strict";a(function(){return function(a){function b(b){return new a(function(a,c){function d(a){f.push(a),0===--e&&c(f)}var e=0,f=[];k.call(b,function(b){++e,l(b).then(a,d)}),0===e&&a()})}function c(b,c){return new a(function(a,d,e){function f(b){i>0&&(--i,j.push(b),0===i&&a(j))}function g(a){h>0&&(--h,m.push(a),0===h&&d(m))}var h,i=0,j=[],m=[];return k.call(b,function(a){++i,l(a).then(f,g,e)}),c=Math.max(c,0),h=i-c+1,i=Math.min(c,i),0===i?void a(j):void 0})}function d(a,b,c){return m(h.call(a,function(a){return l(a).then(b,c)}))}function e(a){return m(h.call(a,function(a){function b(){return a.inspect()}return a=l(a),a.then(b,b)}))}function f(a,b){function c(a,c,d){return l(a).then(function(a){return l(c).then(function(c){return b(a,c,d)})})}return arguments.length>2?i.call(a,c,arguments[2]):i.call(a,c)}function g(a,b){function c(a,c,d){return l(a).then(function(a){return l(c).then(function(c){return b(a,c,d)})})}return arguments.length>2?j.call(a,c,arguments[2]):j.call(a,c)}var h=Array.prototype.map,i=Array.prototype.reduce,j=Array.prototype.reduceRight,k=Array.prototype.forEach,l=a.resolve,m=a.all;return a.any=b,a.some=c,a.settle=e,a.map=d,a.reduce=f,a.reduceRight=g,a.prototype.spread=function(a){return this.then(m).then(function(b){return a.apply(void 0,b)})},a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],9:[function(b,c){!function(a){"use strict";a(function(){function a(){throw new TypeError("catch predicate must be a function")}function b(a,b){return c(b)?a instanceof b:b(a)}function c(a){return a===Error||null!=a&&a.prototype instanceof Error}function d(a,b){return function(){return a.call(this),b}}function e(){}return function(c){function f(a,c){return function(d){return b(d,c)?a.call(this,d):g(d)}}var g=c.reject,h=c.prototype["catch"];return c.prototype.done=function(a,b){var c=this._handler;c.when({resolve:this._maybeFatal,notify:e,context:this,receiver:c.receiver,fulfilled:a,rejected:b,progress:void 0})},c.prototype["catch"]=c.prototype.otherwise=function(b){return 1===arguments.length?h.call(this,b):"function"!=typeof b?this.ensure(a):h.call(this,f(arguments[1],b))},c.prototype["finally"]=c.prototype.ensure=function(a){return"function"!=typeof a?this:(a=d(a,this),this.then(a,a))},c.prototype["else"]=c.prototype.orElse=function(a){return this.then(void 0,function(){return a})},c.prototype["yield"]=function(a){return this.then(function(){return a})},c.prototype.tap=function(a){return this.then(a)["yield"](this)},c}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],10:[function(b,c){!function(a){"use strict";a(function(){return function(a){return a.prototype.fold=function(a,b){var c=this._beget();return this._handler.fold(c._handler,a,b),c},a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],11:[function(b,c){!function(a){"use strict";a(function(){return function(a){return a.prototype.inspect=function(){return this._handler.inspect()},a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],12:[function(b,c){!function(a){"use strict";a(function(){return function(a){function b(a,b,d,e){return c(function(b){return[b,a(b)]},b,d,e)}function c(a,b,e,f){function g(f,g){return d(e(f)).then(function(){return c(a,b,e,g)})}return d(f).then(function(c){return d(b(c)).then(function(b){return b?c:d(a(c)).spread(g)})})}var d=a.resolve;return a.iterate=b,a.unfold=c,a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],13:[function(b,c){!function(a){"use strict";a(function(){return function(a){return a.prototype.progress=function(a){return this.then(void 0,void 0,a)},a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],14:[function(b,c){!function(a){"use strict";a(function(a){var b=a("../timer"),c=a("../TimeoutError");return function(a){return a.prototype.delay=function(a){var c=this._beget(),d=c._handler;return this._handler.map(function(c){b.set(function(){d.resolve(c)},a)},d),c},a.prototype.timeout=function(a,d){function e(){h.reject(f?d:new c("timed out after "+a+"ms"))}var f=arguments.length>1,g=this._beget(),h=g._handler,i=b.set(e,a);return this._handler.chain(h,function(a){b.clear(i),this.resolve(a)},function(a){b.clear(i),this.reject(a)},h.notify),g},a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})},{"../TimeoutError":6,"../timer":19}],15:[function(b,c){!function(a){"use strict";a(function(a){function b(a){var b="object"==typeof a&&a.stack?a.stack:c(a);return a instanceof Error?b:b+" (WARNING: non-Error used)"}function c(a){var b=String(a);return"[object Object]"===b&&"undefined"!=typeof JSON&&(b=d(a,b)),b}function d(a,b){try{return JSON.stringify(a)}catch(a){return b}}function e(a){throw a}function f(){}var g=a("../timer");return function(a){function d(a){a.handled||(n.push(a),k("Potentially unhandled rejection ["+a.id+"] "+b(a.value)))}function h(a){var b=n.indexOf(a);b>=0&&(n.splice(b,1),l("Handled previous rejection ["+a.id+"] "+c(a.value)))}function i(a,b){m.push(a,b),o||(o=!0,o=g.set(j,0))}function j(){for(o=!1;m.length>0;)m.shift()(m.shift())}var k=f,l=f;"undefined"!=typeof console&&(k="undefined"!=typeof console.error?function(a){console.error(a)}:function(a){console.log(a)},l="undefined"!=typeof console.info?function(a){console.info(a)}:function(a){console.log(a)}),a.onPotentiallyUnhandledRejection=function(a){i(d,a)},a.onPotentiallyUnhandledRejectionHandled=function(a){i(h,a)},a.onFatalRejection=function(a){i(e,a.value)};var m=[],n=[],o=!1;return a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})},{"../timer":19}],16:[function(b,c){!function(a){"use strict";a(function(){return function(a){return a.prototype["with"]=a.prototype.withThis=a.prototype._bindContext,a}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],17:[function(b,c){!function(a){"use strict";a(function(){return function(a){function b(a,b){this._handler=a===m?b:c(a)}function c(a){function b(a){e.resolve(a)}function c(a){e.reject(a)}function d(a){e.notify(a)}var e=new n;try{a(b,c,d)}catch(f){c(f)}return e}function d(a){return k(a)?a:new b(m,new p(j(a)))}function e(a){return new b(m,new p(new t(a)))}function f(){return M}function g(){return new b(m,new n)}function h(a){function c(a,b,c,d){c.map(function(a){b[d]=a,0===--i&&this.become(new s(b))},a)}var d,e,f,g,h=new n,i=a.length>>>0,j=new Array(i);for(d=0;d<a.length;++d)if(f=a[d],void 0!==f||d in a)if(C(f))if(e=k(f)?f._handler.join():l(f),g=e.state(),0===g)c(h,j,e,d);else{if(!(g>0)){h.become(e);break}j[d]=e.value,--i}else j[d]=f,--i;else--i;return 0===i&&h.become(new s(j)),new b(m,h)}function i(a){if(Object(a)===a&&0===a.length)return f();var c,d,e=new n;for(c=0;c<a.length;++c)d=a[c],void 0!==d&&c in a&&j(d).chain(e,e.resolve,e.reject);return new b(m,e)}function j(a){return k(a)?a._handler.join():C(a)?l(a):new s(a)}function k(a){return a instanceof b}function l(a){try{var b=a.then;return"function"==typeof b?new r(b,a):new s(a)}catch(c){return new t(c)}}function m(){}function n(a,c){b.createContext(this,c),this.consumers=void 0,this.receiver=a,this.handler=void 0,this.resolved=!1}function o(a){this.handler=a}function p(a){o.call(this,a)}function q(a,b){o.call(this,a),this.receiver=b}function r(a,b){n.call(this),I.enqueue(new A(a,b,this))}function s(a){b.createContext(this),this.value=a}function t(a){b.createContext(this),this.id=++K,this.value=a,this.handled=!1,this.reported=!1,this._report()}function u(a,c){a.handled||(a.reported=!0,b.onPotentiallyUnhandledRejection(a,c))}function v(a){a.reported&&b.onPotentiallyUnhandledRejectionHandled(a)}function w(){t.call(this,new TypeError("Promise cycle"))}function x(){return{state:"pending"}}function y(a,b){this.continuation=a,this.handler=b}function z(a,b){this.handler=a,this.value=b}function A(a,b,c){this._then=a,this.thenable=b,this.resolver=c}function B(a,b,c,d,e){try{a.call(b,c,d,e)}catch(f){d(f)}}function C(a){return("object"==typeof a||"function"==typeof a)&&null!==a}function D(a,b,c){try{return a.call(c,b)}catch(d){return e(d)}}function E(a,b,c,d){try{return a.call(d,b,c)}catch(f){return e(f)}}function F(a,b,c){try{return a.call(c,b)}catch(d){return d}}function G(a,b){b.prototype=J(a.prototype),b.prototype.constructor=b}function H(){}var I=a.scheduler,J=Object.create||function(a){function b(){}return b.prototype=a,new b};b.resolve=d,b.reject=e,b.never=f,b._defer=g,b.prototype.then=function(a,c){var d=this._handler;if("function"!=typeof a&&d.join().state()>0)return new b(m,d);var e=this._beget(),f=e._handler;return d.when({resolve:f.resolve,notify:f.notify,context:f,receiver:d.receiver,fulfilled:a,rejected:c,progress:arguments.length>2?arguments[2]:void 0}),e},b.prototype["catch"]=function(a){return this.then(void 0,a)},b.prototype._bindContext=function(a){return new b(m,new q(this._handler,a))},b.prototype._beget=function(){var a=this._handler,b=new n(a.receiver,a.join().context);return new this.constructor(m,b)},b.prototype._maybeFatal=function(a){if(C(a)){var b=j(a),c=this._handler.context;b.catchError(function(){this._fatal(c)},b)}},b.all=h,b.race=i,m.prototype.when=m.prototype.resolve=m.prototype.reject=m.prototype.notify=m.prototype._fatal=m.prototype._unreport=m.prototype._report=H,m.prototype.inspect=x,m.prototype._state=0,m.prototype.state=function(){return this._state},m.prototype.join=function(){for(var a=this;void 0!==a.handler;)a=a.handler;return a},m.prototype.chain=function(a,b,c,d){this.when({resolve:H,notify:H,context:void 0,receiver:a,fulfilled:b,rejected:c,progress:d})},m.prototype.map=function(a,b){this.chain(b,a,b.reject,b.notify)},m.prototype.catchError=function(a,b){this.chain(b,b.resolve,a,b.notify)},m.prototype.fold=function(a,b,c){this.join().map(function(a){j(c).map(function(c){this.resolve(E(b,c,a,this.receiver))},this)},a)},G(m,n),n.prototype._state=0,n.prototype.inspect=function(){return this.resolved?this.join().inspect():x()},n.prototype.resolve=function(a){this.resolved||this.become(j(a))},n.prototype.reject=function(a){this.resolved||this.become(new t(a))},n.prototype.join=function(){if(this.resolved){for(var a=this;void 0!==a.handler;)if(a=a.handler,a===this)return this.handler=new w;return a}return this},n.prototype.run=function(){var a=this.consumers,b=this.join();this.consumers=void 0;for(var c=0;c<a.length;++c)b.when(a[c])},n.prototype.become=function(a){this.resolved=!0,this.handler=a,void 0!==this.consumers&&I.enqueue(this),void 0!==this.context&&a._report(this.context)},n.prototype.when=function(a){this.resolved?I.enqueue(new y(a,this.handler)):void 0===this.consumers?this.consumers=[a]:this.consumers.push(a)},n.prototype.notify=function(a){this.resolved||I.enqueue(new z(this,a))},n.prototype._report=function(a){this.resolved&&this.handler.join()._report(a)},n.prototype._unreport=function(){this.resolved&&this.handler.join()._unreport()},n.prototype._fatal=function(a){var b="undefined"==typeof a?this.context:a;this.resolved&&this.handler.join()._fatal(b)},G(m,o),o.prototype.inspect=function(){return this.join().inspect()},o.prototype._report=function(a){this.join()._report(a)},o.prototype._unreport=function(){this.join()._unreport()},G(o,p),p.prototype.when=function(a){I.enqueue(new y(a,this.join()))},G(o,q),q.prototype.when=function(a){void 0!==this.receiver&&(a.receiver=this.receiver),this.join().when(a)},G(n,r),G(m,s),s.prototype._state=1,s.prototype.inspect=function(){return{state:"fulfilled",value:this.value}},s.prototype.when=function(a){var c;"function"==typeof a.fulfilled?(b.enterContext(this),c=D(a.fulfilled,this.value,a.receiver),b.exitContext()):c=this.value,a.resolve.call(a.context,c)};var K=0;G(m,t),t.prototype._state=-1,t.prototype.inspect=function(){return{state:"rejected",reason:this.value}},t.prototype.when=function(a){var c;"function"==typeof a.rejected?(this._unreport(),b.enterContext(this),c=D(a.rejected,this.value,a.receiver),b.exitContext()):c=new b(m,this),a.resolve.call(a.context,c)},t.prototype._report=function(a){I.afterQueue(u,this,a)},t.prototype._unreport=function(){this.handled=!0,I.afterQueue(v,this)},t.prototype._fatal=function(a){b.onFatalRejection(this,a)},b.createContext=b.enterContext=b.exitContext=b.onPotentiallyUnhandledRejection=b.onPotentiallyUnhandledRejectionHandled=b.onFatalRejection=H;var L=new m,M=new b(m,L);return G(t,w),y.prototype.run=function(){this.handler.join().when(this.continuation)},z.prototype.run=function(){var a=this.handler.consumers;if(void 0!==a)for(var b=0;b<a.length;++b)this._notify(a[b])},z.prototype._notify=function(a){var b="function"==typeof a.progress?F(a.progress,this.value,a.receiver):this.value;a.notify.call(a.context,b)},A.prototype.run=function(){function a(a){d.resolve(a)}function b(a){d.reject(a)}function c(a){d.notify(a)}var d=this.resolver;B(this._then,this.thenable,a,b,c)},b}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a()})},{}],18:[function(b,c){!function(a){"use strict";a(function(a){function b(a){this._enqueue=a,this._handlerQueue=new c(15),this._afterQueue=new c(5),this._running=!1;var b=this;this.drain=function(){b._drain()}}var c=a("./Queue");return b.prototype.enqueue=function(a){this._handlerQueue.push(a),this._running||(this._running=!0,this._enqueue(this.drain))},b.prototype.afterQueue=function(a,b,c){this._afterQueue.push(a),this._afterQueue.push(b),this._afterQueue.push(c),this._running||(this._running=!0,this._enqueue(this.drain))},b.prototype._drain=function(){for(var a=this._handlerQueue;a.length>0;)a.shift().run();for(this._running=!1,a=this._afterQueue;a.length>0;)a.shift()(a.shift(),a.shift())},b})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})},{"./Queue":5}],19:[function(b,c){!function(a){"use strict";a(function(a){var b,c,d,e;b=a;try{c=b("vertx"),d=function(a,b){return c.setTimer(b,a)},e=c.cancelTimer}catch(f){d=function(a,b){return setTimeout(a,b)},e=function(a){return clearTimeout(a)}}return{set:d,clear:e}})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})},{}],20:[function(b,c){!function(a){"use strict";a(function(a){function b(a,b,c){var d=z.resolve(a);return arguments.length<2?d:arguments.length>3?d.then(b,c,arguments[3]):d.then(b,c)}function c(a){return new z(a)}function d(a){return function(){return f(a,this,A.call(arguments))}}function e(a){return f(a,this,A.call(arguments,1))}function f(a,b,c){return z.all(c).then(function(c){return a.apply(b,c)})}function g(){return new h}function h(){function a(a){d._handler.resolve(a)}function b(a){d._handler.reject(a)}function c(a){d._handler.notify(a)}var d=z._defer();this.promise=d,this.resolve=a,this.reject=b,this.notify=c,this.resolver={resolve:a,reject:b,notify:c}}function i(a){return a&&"function"==typeof a.then}function j(){return z.all(arguments)}function k(a){return b(a,z.all)}function l(a){return b(a,z.settle)}function m(a,c){return b(a,function(a){return z.map(a,c)})}function n(a){var c=A.call(arguments,1);return b(a,function(a){return c.unshift(a),z.reduce.apply(z,c)})}function o(a){var c=A.call(arguments,1);return b(a,function(a){return c.unshift(a),z.reduceRight.apply(z,c)})}var p=a("./lib/decorators/timed"),q=a("./lib/decorators/array"),r=a("./lib/decorators/flow"),s=a("./lib/decorators/fold"),t=a("./lib/decorators/inspect"),u=a("./lib/decorators/iterate"),v=a("./lib/decorators/progress"),w=a("./lib/decorators/with"),x=a("./lib/decorators/unhandledRejection"),y=a("./lib/TimeoutError"),z=[q,r,s,u,v,t,w,p,x].reduce(function(a,b){return b(a)},a("./lib/Promise")),A=Array.prototype.slice;return b.promise=c,b.resolve=z.resolve,b.reject=z.reject,b.lift=d,b["try"]=e,b.attempt=e,b.iterate=z.iterate,b.unfold=z.unfold,b.join=j,b.all=k,b.settle=l,b.any=d(z.any),b.some=d(z.some),b.map=m,b.reduce=n,b.reduceRight=o,b.isPromiseLike=i,b.Promise=z,b.defer=g,b.TimeoutError=y,b})}("function"==typeof a&&a.amd?a:function(a){c.exports=a(b)})},{"./lib/Promise":4,"./lib/TimeoutError":6,"./lib/decorators/array":8,"./lib/decorators/flow":9,"./lib/decorators/fold":10,"./lib/decorators/inspect":11,"./lib/decorators/iterate":12,"./lib/decorators/progress":13,"./lib/decorators/timed":14,"./lib/decorators/unhandledRejection":15,"./lib/decorators/with":16}],21:[function(a,b){function c(a){return this instanceof c?(this._console=this._getConsole(a||{}),this._settings=this._configure(a||{}),this._backoffDelay=this._settings.backoffDelayMin,this._pendingRequests={},this._webSocket=null,d.createEventEmitter(this),this._delegateEvents(),void(this._settings.autoConnect&&this.connect())):new c(a)}var d=a("bane"),e=a("../lib/websocket/"),f=a("when");c.ConnectionError=function(a){this.name="ConnectionError",this.message=a},c.ConnectionError.prototype=new Error,c.ConnectionError.prototype.constructor=c.ConnectionError,c.ServerError=function(a){this.name="ServerError",this.message=a},c.ServerError.prototype=new Error,c.ServerError.prototype.constructor=c.ServerError,c.WebSocket=e.Client,c.prototype._getConsole=function(a){if("undefined"!=typeof a.console)return a.console;var b="undefined"!=typeof console&&console||{};return b.log=b.log||function(){},b.warn=b.warn||function(){},b.error=b.error||function(){},b},c.prototype._configure=function(a){var b="undefined"!=typeof document&&document.location.host||"localhost";return a.webSocketUrl=a.webSocketUrl||"ws://"+b+"/mopidy/ws",a.autoConnect!==!1&&(a.autoConnect=!0),a.backoffDelayMin=a.backoffDelayMin||1e3,a.backoffDelayMax=a.backoffDelayMax||64e3,"undefined"==typeof a.callingConvention&&this._console.warn("Mopidy.js is using the default calling convention. The default will change in the future. You should explicitly specify which calling convention you use."),a.callingConvention=a.callingConvention||"by-position-only",a},c.prototype._delegateEvents=function(){this.off("websocket:close"),this.off("websocket:error"),this.off("websocket:incomingMessage"),this.off("websocket:open"),this.off("state:offline"),this.on("websocket:close",this._cleanup),this.on("websocket:error",this._handleWebSocketError),this.on("websocket:incomingMessage",this._handleMessage),this.on("websocket:open",this._resetBackoffDelay),this.on("websocket:open",this._getApiSpec),this.on("state:offline",this._reconnect)},c.prototype.connect=function(){if(this._webSocket){if(this._webSocket.readyState===c.WebSocket.OPEN)return;this._webSocket.close()}this._webSocket=this._settings.webSocket||new c.WebSocket(this._settings.webSocketUrl),this._webSocket.onclose=function(a){this.emit("websocket:close",a)}.bind(this),this._webSocket.onerror=function(a){this.emit("websocket:error",a)}.bind(this),this._webSocket.onopen=function(){this.emit("websocket:open")}.bind(this),this._webSocket.onmessage=function(a){this.emit("websocket:incomingMessage",a)}.bind(this)},c.prototype._cleanup=function(a){Object.keys(this._pendingRequests).forEach(function(b){var d=this._pendingRequests[b];delete this._pendingRequests[b];var e=new c.ConnectionError("WebSocket closed");e.closeEvent=a,d.reject(e)}.bind(this)),this.emit("state:offline")},c.prototype._reconnect=function(){this.emit("reconnectionPending",{timeToAttempt:this._backoffDelay}),setTimeout(function(){this.emit("reconnecting"),this.connect()}.bind(this),this._backoffDelay),this._backoffDelay=2*this._backoffDelay,this._backoffDelay>this._settings.backoffDelayMax&&(this._backoffDelay=this._settings.backoffDelayMax)},c.prototype._resetBackoffDelay=function(){this._backoffDelay=this._settings.backoffDelayMin},c.prototype.close=function(){this.off("state:offline",this._reconnect),this._webSocket.close()},c.prototype._handleWebSocketError=function(a){this._console.warn("WebSocket error:",a.stack||a)},c.prototype._send=function(a){switch(this._webSocket.readyState){case c.WebSocket.CONNECTING:return f.reject(new c.ConnectionError("WebSocket is still connecting"));case c.WebSocket.CLOSING:return f.reject(new c.ConnectionError("WebSocket is closing"));case c.WebSocket.CLOSED:return f.reject(new c.ConnectionError("WebSocket is closed"));default:var b=f.defer();return a.jsonrpc="2.0",a.id=this._nextRequestId(),this._pendingRequests[a.id]=b.resolver,this._webSocket.send(JSON.stringify(a)),this.emit("websocket:outgoingMessage",a),b.promise}},c.prototype._nextRequestId=function(){var a=-1;return function(){return a+=1}}(),c.prototype._handleMessage=function(a){try{var b=JSON.parse(a.data);b.hasOwnProperty("id")?this._handleResponse(b):b.hasOwnProperty("event")?this._handleEvent(b):this._console.warn("Unknown message type received. Message was: "+a.data)}catch(c){if(!(c instanceof SyntaxError))throw c;this._console.warn("WebSocket message parsing failed. Message was: "+a.data)}},c.prototype._handleResponse=function(a){if(!this._pendingRequests.hasOwnProperty(a.id))return void this._console.warn("Unexpected response received. Message was:",a);var b,d=this._pendingRequests[a.id];delete this._pendingRequests[a.id],a.hasOwnProperty("result")?d.resolve(a.result):a.hasOwnProperty("error")?(b=new c.ServerError(a.error.message),b.code=a.error.code,b.data=a.error.data,d.reject(b),this._console.warn("Server returned error:",a.error)):(b=new Error("Response without 'result' or 'error' received"),b.data={response:a},d.reject(b),this._console.warn("Response without 'result' or 'error' received. Message was:",a))},c.prototype._handleEvent=function(a){var b=a.event,c=a;delete c.event,this.emit("event:"+this._snakeToCamel(b),c)},c.prototype._getApiSpec=function(){return this._send({method:"core.describe"}).then(this._createApi.bind(this)).catch(this._handleWebSocketError)},c.prototype._createApi=function(a){var b="by-position-or-by-name"===this._settings.callingConvention,c=function(a){return function(){var c={method:a};return 0===arguments.length?this._send(c):b?arguments.length>1?f.reject(new Error("Expected zero arguments, a single array, or a single object.")):Array.isArray(arguments[0])||arguments[0]===Object(arguments[0])?(c.params=arguments[0],this._send(c)):f.reject(new TypeError("Expected an array or an object.")):(c.params=Array.prototype.slice.call(arguments),this._send(c))}.bind(this)}.bind(this),d=function(a){var b=a.split(".");return b.length>=1&&"core"===b[0]&&(b=b.slice(1)),b},e=function(a){var b=this;return a.forEach(function(a){a=this._snakeToCamel(a),b[a]=b[a]||{},b=b[a]}.bind(this)),b}.bind(this),g=function(b){var f=d(b),g=this._snakeToCamel(f.slice(-1)[0]),h=e(f.slice(0,-1));h[g]=c(b),h[g].description=a[b].description,h[g].params=a[b].params}.bind(this);Object.keys(a).forEach(g),this.emit("state:online")},c.prototype._snakeToCamel=function(a){return a.replace(/(_[a-z])/g,function(a){return a.toUpperCase().replace("_","")})},b.exports=c},{"../lib/websocket/":1,bane:2,when:20}]},{},[21])(21)});;/* ng-infinite-scroll - v1.2.0 - 2014-12-02 */
var mod;mod=angular.module("infinite-scroll",[]),mod.value("THROTTLE_MILLISECONDS",null),mod.directive("infiniteScroll",["$rootScope","$window","$interval","THROTTLE_MILLISECONDS",function(a,b,c,d){return{scope:{infiniteScroll:"&",infiniteScrollContainer:"=",infiniteScrollDistance:"=",infiniteScrollDisabled:"=",infiniteScrollUseDocumentBottom:"="},link:function(e,f,g){var h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x;return x=angular.element(b),t=null,u=null,i=null,j=null,q=!0,w=!1,p=function(a){return a=a[0]||a,isNaN(a.offsetHeight)?a.document.documentElement.clientHeight:a.offsetHeight},r=function(a){return a[0].getBoundingClientRect&&!a.css("none")?a[0].getBoundingClientRect().top+s(a):void 0},s=function(a){return a=a[0]||a,isNaN(window.pageYOffset)?a.document.documentElement.scrollTop:a.ownerDocument.defaultView.pageYOffset},o=function(){var b,c,d,g,h;return j===x?(b=p(j)+s(j[0].document.documentElement),d=r(f)+p(f)):(b=p(j),c=0,void 0!==r(j)&&(c=r(j)),d=r(f)-c+p(f)),w&&(d=p((f[0].ownerDocument||f[0].document).documentElement)),g=d-b,h=g<=p(j)*t+1,h?(i=!0,u?e.$$phase||a.$$phase?e.infiniteScroll():e.$apply(e.infiniteScroll):void 0):i=!1},v=function(a,b){var d,e,f;return f=null,e=0,d=function(){var b;return e=(new Date).getTime(),c.cancel(f),f=null,a.call(),b=null},function(){var g,h;return g=(new Date).getTime(),h=b-(g-e),0>=h?(clearTimeout(f),c.cancel(f),f=null,e=g,a.call()):f?void 0:f=c(d,h,1)}},null!=d&&(o=v(o,d)),e.$on("$destroy",function(){return j.unbind("scroll",o)}),m=function(a){return t=parseFloat(a)||0},e.$watch("infiniteScrollDistance",m),m(e.infiniteScrollDistance),l=function(a){return u=!a,u&&i?(i=!1,o()):void 0},e.$watch("infiniteScrollDisabled",l),l(e.infiniteScrollDisabled),n=function(a){return w=a},e.$watch("infiniteScrollUseDocumentBottom",n),n(e.infiniteScrollUseDocumentBottom),h=function(a){return null!=j&&j.unbind("scroll",o),j=a,null!=a?j.bind("scroll",o):void 0},h(x),k=function(a){if(null!=a&&0!==a.length){if(a instanceof HTMLElement?a=angular.element(a):"function"==typeof a.append?a=angular.element(a[a.length-1]):"string"==typeof a&&(a=angular.element(document.querySelector(a))),null!=a)return h(a);throw new Exception("invalid infinite-scroll-container attribute.")}},e.$watch("infiniteScrollContainer",k),k(e.infiniteScrollContainer||[]),null!=g.infiniteScrollParent&&h(angular.element(f.parent())),null!=g.infiniteScrollImmediateCheck&&(q=e.$eval(g.infiniteScrollImmediateCheck)),c(function(){return q?o():void 0},0,1)}}}]);