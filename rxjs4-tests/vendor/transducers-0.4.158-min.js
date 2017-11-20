/* eslint-disable */
// transducers-js 0.4.158
// http://github.com/cognitect-labs/transducers-js
//
// Copyright 2014-2015 Cognitect. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License..
(function () {var d = this;
  function f(a) {var b = typeof a;if (b == 'object') {if (a) {if (a instanceof Array) {return 'array';} if (a instanceof Object) {return b;} var c = Object.prototype.toString.call(a);if (c == '[object Window]') {return 'object';} if (c == '[object Array]' || typeof a.length === 'number' && typeof a.splice !== 'undefined' && typeof a.propertyIsEnumerable !== 'undefined' && !a.propertyIsEnumerable('splice')) {return 'array';} if (c == '[object Function]' || typeof a.call !== 'undefined' && typeof a.propertyIsEnumerable !== 'undefined' && !a.propertyIsEnumerable('call')) {return 'function';}} else {return 'null';}} else if (b ==
'function' && typeof a.call === 'undefined') {return 'object';} return b;} function g(a,b) {var c = a.split('.'),e = d;c[0] in e || !e.execScript || e.execScript('var ' + c[0]);for (var k;c.length && (k = c.shift());) {c.length || void 0 === b ? e[k] ? e = e[k] : e = e[k] = {} : e[k] = b;}} var h = typeof Array.isArray !== 'undefined' ? function (a) {return Array.isArray(a);} : function (a) {return f(a) == 'array';};function l(a) {return function (b) {return !a.apply(null,Array.prototype.slice.call(arguments,0));};} function m(a) {this.a = a;}m.prototype['@@transducer/init'] = function () {throw Error('init not implemented');};m.prototype['@@transducer/result'] = function (a) {return a;};m.prototype['@@transducer/step'] = function (a,b) {return this.a(a,b);};function n(a) {return typeof a === 'function' ? new m(a) : a;}
  function p(a) {this['@@transducer/reduced'] = !0;this['@@transducer/value'] = a;} function q(a) {return new p(a);} function r(a) {return a instanceof p || a && a['@@transducer/reduced'];} function t(a) {return r(a) ? a : q(a);} function u(a) {return a['@@transducer/value'];} function v(a) {return r(a) ? u(a) : a;} function w(a) {return a;}
  function x(a) {var b = arguments.length;if (b == 2) {var c = arguments[0],e = arguments[1];return function (a) {return c(e.apply(null,Array.prototype.slice.call(arguments,0)));};} if (b > 2) {return y(x,arguments[0],Array.prototype.slice.call(arguments,1));}} function z(a,b) {this.b = a;this.a = b;}z.prototype['@@transducer/init'] = function () {return this.a['@@transducer/init']();};z.prototype['@@transducer/result'] = function (a) {return this.a['@@transducer/result'](a);};
  z.prototype['@@transducer/step'] = function (a,b) {return this.a['@@transducer/step'](a,this.b(b));};function A(a) {return function (b) {return new z(a,b);};} function B(a,b) {this.b = a;this.a = b;}B.prototype['@@transducer/init'] = function () {return this.a['@@transducer/init']();};B.prototype['@@transducer/result'] = function (a) {return this.a['@@transducer/result'](a);};B.prototype['@@transducer/step'] = function (a,b) {return this.b(b) ? this.a['@@transducer/step'](a,b) : a;};
  function C(a) {return function (b) {return new B(a,b);};} function D(a,b) {this.b = a;this.a = b;}D.prototype['@@transducer/init'] = function () {return this.a['@@transducer/init']();};D.prototype['@@transducer/result'] = function (a) {return this.a['@@transducer/result'](a);};D.prototype['@@transducer/step'] = function (a,b) {this.b > 0 ? a = this.a['@@transducer/step'](a,b) : a = t(a);this.b--;return a;};function E(a,b) {this.b = a;this.a = b;}E.prototype['@@transducer/init'] = function () {return this.a['@@transducer/init']();};
  E.prototype['@@transducer/result'] = function (a) {return this.a['@@transducer/result'](a);};E.prototype['@@transducer/step'] = function (a,b) {return this.b(b) ? this.a['@@transducer/step'](a,b) : q(a);};function F(a,b) {this.b = -1;this.c = a;this.a = b;}F.prototype['@@transducer/init'] = function () {return this.a['@@transducer/init']();};F.prototype['@@transducer/result'] = function (a) {return this.a['@@transducer/result'](a);};
  F.prototype['@@transducer/step'] = function (a,b) {this.b++;return this.b % this.c == 0 ? this.a['@@transducer/step'](a,b) : a;};function G(a,b) {this.b = a;this.a = b;}G.prototype['@@transducer/init'] = function () {return this.a['@@transducer/init']();};G.prototype['@@transducer/result'] = function (a) {return this.a['@@transducer/result'](a);};G.prototype['@@transducer/step'] = function (a,b) {return this.b > 0 ? (this.b--,a) : this.a['@@transducer/step'](a,b);};function H(a,b) {this.b = !0;this.c = a;this.a = b;}
  H.prototype['@@transducer/init'] = function () {return this.a['@@transducer/init']();};H.prototype['@@transducer/result'] = function (a) {return this.a['@@transducer/result'](a);};H.prototype['@@transducer/step'] = function (a,b) {if (this.b && this.c(b)) {return a;} this.b && (this.b = !1);return this.a['@@transducer/step'](a,b);};var I = {};function J(a,b) {this.d = a;this.b = b;this.a = [];this.c = I;}J.prototype['@@transducer/init'] = function () {return this.b['@@transducer/init']();};
  J.prototype['@@transducer/result'] = function (a) {this.a.length > 0 && (a = v(this.b['@@transducer/step'](a,this.a)),this.a = []);return this.b['@@transducer/result'](a);};J.prototype['@@transducer/step'] = function (a,b) {var c = this.c,e = this.d(b);this.c = e;if (c == I || c == e) {return this.a.push(b),a;}c = this.b['@@transducer/step'](a,this.a);this.a = [];r(c) || this.a.push(b);return c;};function K(a,b) {this.c = a;this.b = b;this.a = [];}K.prototype['@@transducer/init'] = function () {return this.b['@@transducer/init']();};
  K.prototype['@@transducer/result'] = function (a) {this.a.length > 0 && (a = v(this.b['@@transducer/step'](a,this.a)),this.a = []);return this.b['@@transducer/result'](a);};K.prototype['@@transducer/step'] = function (a,b) {this.a.push(b);if (this.c == this.a.length) {var c = this.a;this.a = [];return this.b['@@transducer/step'](a,c);} return a;};function L(a,b) {this.b = a;this.a = b;}L.prototype['@@transducer/init'] = function () {return this.a['@@transducer/init']();};L.prototype['@@transducer/result'] = function (a) {return this.a['@@transducer/result'](a);};
  L.prototype['@@transducer/step'] = function (a,b) {return this.b(b) == null ? a : this.a['@@transducer/step'](a,b);};function M(a,b) {this.b = -1;this.c = a;this.a = b;}M.prototype['@@transducer/init'] = function () {return this.a['@@transducer/init']();};M.prototype['@@transducer/result'] = function (a) {return this.a['@@transducer/result'](a);};M.prototype['@@transducer/step'] = function (a,b) {this.b++;return this.c(this.b,b) == null ? a : this.a['@@transducer/step'](a,b);};
  function N(a) {return {'@@transducer/init': function () {return a['@@transducer/init']();},'@@transducer/result': function (a) {return a;},'@@transducer/step': function (b,c) {var e = a['@@transducer/step'](b,c);return r(e) ? q(e) : e;}};} function O(a) {var b = N(a);return {'@@transducer/init': function () {return a['@@transducer/init']();},'@@transducer/result': function (b) {return a['@@transducer/result'](b);},'@@transducer/step': function (a,e) {return y(b,a,e);}};}
  function y(a,b,c) {if (c) {a = typeof a === 'function' ? n(a) : a;if (typeof c === 'string') {var e = a;for (a = 0;a < c.length;a++) {if (b = e['@@transducer/step'](b,c.charAt(a)),r(b)) {b = u(b);break;}} return e['@@transducer/result'](b);} if (h(c)) {e = a;for (a = 0;a < c.length;a++) {if (b = e['@@transducer/step'](b,c[a]),r(b)) {b = u(b);break;}} return e['@@transducer/result'](b);} if (c['@@iterator'] || c.next) {e = a;c['@@iterator'] && (c = c['@@iterator']());for (a = c.next();!a.done;) {b = e['@@transducer/step'](b,a.value);if (r(b)) {b = u(b);break;}a = c.next();} return e['@@transducer/result'](b);} if (f(c) ==
'object') {for (e in c) {if (c.hasOwnProperty(e) && (b = a['@@transducer/step'](b,[e,c[e]]),r(b))) {b = u(b);break;}} return a['@@transducer/result'](b);} throw Error('Cannot reduce instance of ' + c.constructor.name);}} function P(a,b,c,e) {b = typeof b === 'function' ? n(b) : b;a = a(b);return y(a,c,e);} function Q(a,b) {return a + b;} function R(a,b) {a.push(b);return a;} function S(a,b) {a[b[0]] = b[1];return a;} function T(a,b) {this.b = a;this.a = b;}T.prototype['@@transducer/init'] = function () {return this.a['@@transducer/init']();};
  T.prototype['@@transducer/result'] = function (a) {return this.b(a);};T.prototype['@@transducer/step'] = function (a,b) {return this.a['@@transducer/step'](a,b);};var U = n(function (a,b) {return q(b);});g('transducers.reduced',q);g('transducers.isReduced',r);g('transducers.comp',x);g('transducers.complement',l);g('transducers.transduce',P);g('transducers.reduce',y);g('transducers.map',A);g('transducers.Map',z);g('transducers.filter',C);g('transducers.Filter',B);g('transducers.remove',function (a) {return C(l(a));});
  g('transducers.Remove',{}.e);g('transducers.keep',function (a) {return function (b) {return new L(a,b);};});g('transducers.Keep',L);g('transducers.keepIndexed',function (a) {return function (b) {return new M(a,b);};});g('transducers.KeepIndexed',M);g('transducers.take',function (a) {return function (b) {return new D(a,b);};});g('transducers.Take',D);g('transducers.takeWhile',function (a) {return function (b) {return new E(a,b);};});g('transducers.TakeWhile',E);
  g('transducers.takeNth',function (a) {return function (b) {return new F(a,b);};});g('transducers.TakeNth',F);g('transducers.drop',function (a) {return function (b) {return new G(a,b);};});g('transducers.Drop',G);g('transducers.dropWhile',function (a) {return function (b) {return new H(a,b);};});g('transducers.DropWhile',H);g('transducers.partitionBy',function (a) {return function (b) {return new J(a,b);};});g('transducers.PartitionBy',J);g('transducers.partitionAll',function (a) {return function (b) {return new K(a,b);};});
  g('transducers.PartitionAll',K);g('transducers.completing',function (a,b) {a = typeof a === 'function' ? n(a) : a;b = b || w;return new T(b,a);});g('transducers.Completing',T);g('transducers.wrap',n);g('transducers.Wrap',m);g('transducers.cat',O);g('transducers.mapcat',function (a) {return x(A(a),O);});g('transducers.into',function (a,b,c) {if (typeof a === 'string') {return P(b,Q,a,c);} if (h(a)) {return P(b,R,a,c);} if (f(a) == 'object') {return P(b,S,a,c);}});
  g('transducers.toFn',function (a,b) {typeof b === 'function' && (b = n(b));var c = a(b);return c['@@transducer/step'].bind(c);});g('transducers.first',U);g('transducers.ensureReduced',t);g('transducers.unreduced',v);g('transducers.deref',u);})();