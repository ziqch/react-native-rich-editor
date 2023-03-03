export default "<!doctype html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1\"/><meta http-equiv=\"Content-Security-Policy\" content=\"default-src * 'unsafe-inline' 'unsafe-eval';img-src * data: blob:\"/><title>ReactNativeRichEditor</title></head><body><script defer=\"defer\">!function(t,e){if(\"object\"==typeof exports&&\"object\"==typeof module)module.exports=e();else if(\"function\"==typeof define&&define.amd)define([],e);else{var r=e();for(var n in r)(\"object\"==typeof exports?exports:t)[n]=r[n]}}(self,(()=>(()=>{\"use strict\";var t={r:t=>{\"undefined\"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:\"Module\"}),Object.defineProperty(t,\"__esModule\",{value:!0})}},e={};function r(t){return r=\"function\"==typeof Symbol&&\"symbol\"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&\"function\"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?\"symbol\":typeof t},r(t)}function n(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,i(n.key),n)}}function o(t,e,r){return(e=i(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function i(t){var e=function(t,e){if(\"object\"!==r(t)||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var o=n.call(t,e||\"default\");if(\"object\"!==r(o))return o;throw new TypeError(\"@@toPrimitive must return a primitive value.\")}return(\"string\"===e?String:Number)(t)}(t,\"string\");return\"symbol\"===r(e)?e:String(e)}t.r(e);var a,u=function(){function t(e,r){!function(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}(this,t),o(this,\"token\",void 0),o(this,\"resolver\",void 0),this.token=e,this.resolver=r}var e,r,i;return e=t,r=[{key:\"resolve\",value:function(){if(this.resolver){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return this.resolver.apply(this,e)}throw Error(\"Unregistered Resolver: \".concat(this.token))}}],r&&n(e.prototype,r),i&&n(e,i),Object.defineProperty(e,\"prototype\",{writable:!1}),t}();function c(t){return c=\"function\"==typeof Symbol&&\"symbol\"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&\"function\"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?\"symbol\":typeof t},c(t)}function l(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */l=function(){return t};var t={},e=Object.prototype,r=e.hasOwnProperty,n=Object.defineProperty||function(t,e,r){t[e]=r.value},o=\"function\"==typeof Symbol?Symbol:{},i=o.iterator||\"@@iterator\",a=o.asyncIterator||\"@@asyncIterator\",u=o.toStringTag||\"@@toStringTag\";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},\"\")}catch(t){s=function(t,e,r){return t[e]=r}}function f(t,e,r,o){var i=e&&e.prototype instanceof v?e:v,a=Object.create(i.prototype),u=new E(o||[]);return n(a,\"_invoke\",{value:O(t,r,u)}),a}function h(t,e,r){try{return{type:\"normal\",arg:t.call(e,r)}}catch(t){return{type:\"throw\",arg:t}}}t.wrap=f;var p={};function v(){}function y(){}function d(){}var g={};s(g,i,(function(){return this}));var b=Object.getPrototypeOf,m=b&&b(b(j([])));m&&m!==e&&r.call(m,i)&&(g=m);var w=d.prototype=v.prototype=Object.create(g);function L(t){[\"next\",\"throw\",\"return\"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function S(t,e){function o(n,i,a,u){var l=h(t[n],t,i);if(\"throw\"!==l.type){var s=l.arg,f=s.value;return f&&\"object\"==c(f)&&r.call(f,\"__await\")?e.resolve(f.__await).then((function(t){o(\"next\",t,a,u)}),(function(t){o(\"throw\",t,a,u)})):e.resolve(f).then((function(t){s.value=t,a(s)}),(function(t){return o(\"throw\",t,a,u)}))}u(l.arg)}var i;n(this,\"_invoke\",{value:function(t,r){function n(){return new e((function(e,n){o(t,r,e,n)}))}return i=i?i.then(n,n):n()}})}function O(t,e,r){var n=\"suspendedStart\";return function(o,i){if(\"executing\"===n)throw new Error(\"Generator is already running\");if(\"completed\"===n){if(\"throw\"===o)throw i;return C()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var u=x(a,r);if(u){if(u===p)continue;return u}}if(\"next\"===r.method)r.sent=r._sent=r.arg;else if(\"throw\"===r.method){if(\"suspendedStart\"===n)throw n=\"completed\",r.arg;r.dispatchException(r.arg)}else\"return\"===r.method&&r.abrupt(\"return\",r.arg);n=\"executing\";var c=h(t,e,r);if(\"normal\"===c.type){if(n=r.done?\"completed\":\"suspendedYield\",c.arg===p)continue;return{value:c.arg,done:r.done}}\"throw\"===c.type&&(n=\"completed\",r.method=\"throw\",r.arg=c.arg)}}}function x(t,e){var r=e.method,n=t.iterator[r];if(void 0===n)return e.delegate=null,\"throw\"===r&&t.iterator.return&&(e.method=\"return\",e.arg=void 0,x(t,e),\"throw\"===e.method)||\"return\"!==r&&(e.method=\"throw\",e.arg=new TypeError(\"The iterator does not provide a '\"+r+\"' method\")),p;var o=h(n,t.iterator,e.arg);if(\"throw\"===o.type)return e.method=\"throw\",e.arg=o.arg,e.delegate=null,p;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,\"return\"!==e.method&&(e.method=\"next\",e.arg=void 0),e.delegate=null,p):i:(e.method=\"throw\",e.arg=new TypeError(\"iterator result is not an object\"),e.delegate=null,p)}function _(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function k(t){var e=t.completion||{};e.type=\"normal\",delete e.arg,t.completion=e}function E(t){this.tryEntries=[{tryLoc:\"root\"}],t.forEach(_,this),this.reset(!0)}function j(t){if(t){var e=t[i];if(e)return e.call(t);if(\"function\"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,o=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:C}}function C(){return{value:void 0,done:!0}}return y.prototype=d,n(w,\"constructor\",{value:d,configurable:!0}),n(d,\"constructor\",{value:y,configurable:!0}),y.displayName=s(d,u,\"GeneratorFunction\"),t.isGeneratorFunction=function(t){var e=\"function\"==typeof t&&t.constructor;return!!e&&(e===y||\"GeneratorFunction\"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,d):(t.__proto__=d,s(t,u,\"GeneratorFunction\")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},L(S.prototype),s(S.prototype,a,(function(){return this})),t.AsyncIterator=S,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new S(f(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},L(w),s(w,u,\"Generator\"),s(w,i,(function(){return this})),s(w,\"toString\",(function(){return\"[object Generator]\"})),t.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},t.values=j,E.prototype={constructor:E,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method=\"next\",this.arg=void 0,this.tryEntries.forEach(k),!t)for(var e in this)\"t\"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if(\"throw\"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(r,n){return a.type=\"throw\",a.arg=t,e.next=r,n&&(e.method=\"next\",e.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if(\"root\"===i.tryLoc)return n(\"end\");if(i.tryLoc<=this.prev){var u=r.call(i,\"catchLoc\"),c=r.call(i,\"finallyLoc\");if(u&&c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!c)throw new Error(\"try statement without catch or finally\");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,\"finallyLoc\")&&this.prev<o.finallyLoc){var i=o;break}}i&&(\"break\"===t||\"continue\"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method=\"next\",this.next=i.finallyLoc,p):this.complete(a)},complete:function(t,e){if(\"throw\"===t.type)throw t.arg;return\"break\"===t.type||\"continue\"===t.type?this.next=t.arg:\"return\"===t.type?(this.rval=this.arg=t.arg,this.method=\"return\",this.next=\"end\"):\"normal\"===t.type&&e&&(this.next=e),p},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),k(r),p}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if(\"throw\"===n.type){var o=n.arg;k(r)}return o}}throw new Error(\"illegal catch attempt\")},delegateYield:function(t,e,r){return this.delegate={iterator:j(t),resultName:e,nextLoc:r},\"next\"===this.method&&(this.arg=void 0),p}},t}function s(t){return function(t){if(Array.isArray(t))return f(t)}(t)||function(t){if(\"undefined\"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t[\"@@iterator\"])return Array.from(t)}(t)||function(t,e){if(!t)return;if(\"string\"==typeof t)return f(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);\"Object\"===r&&t.constructor&&(r=t.constructor.name);if(\"Map\"===r||\"Set\"===r)return Array.from(t);if(\"Arguments\"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return f(t,e)}(t)||function(){throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\")}()}function f(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function h(t,e,r,n,o,i,a){try{var u=t[i](a),c=u.value}catch(t){return void r(t)}u.done?e(c):Promise.resolve(c).then(n,o)}function p(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){h(i,n,o,a,u,\"next\",t)}function u(t){h(i,n,o,a,u,\"throw\",t)}a(void 0)}))}}function v(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}function y(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,b(n.key),n)}}function d(t,e,r){return e&&y(t.prototype,e),r&&y(t,r),Object.defineProperty(t,\"prototype\",{writable:!1}),t}function g(t,e,r){return(e=b(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function b(t){var e=function(t,e){if(\"object\"!==c(t)||null===t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var n=r.call(t,e||\"default\");if(\"object\"!==c(n))return n;throw new TypeError(\"@@toPrimitive must return a primitive value.\")}return(\"string\"===e?String:Number)(t)}(t,\"string\");return\"symbol\"===c(e)?e:String(e)}!function(t){t[t.CALL=0]=\"CALL\",t[t.CALLBACK=1]=\"CALLBACK\"}(a||(a={}));var m=function(){},w=function(){for(var t=[],e=\"0123456789abcdef\",r=0;r<36;r++)t[r]=e.substr(Math.floor(16*Math.random()),1);return t[14]=\"4\",t[19]=e.substr(3&t[19]|8,1),t[8]=t[13]=t[18]=t[23]=\"-\",t.join(\"\")},L=function(){function t(){v(this,t),g(this,\"queue\",[]),g(this,\"callbackPool\",new Map),g(this,\"sender\",m)}var e,r,n,o;return d(t,[{key:\"setSender\",value:function(t){this.sender=t}},{key:\"isConnected\",value:function(){return this.sender!==m}},{key:\"callResolver\",value:(o=p(l().mark((function t(e,r,n){var o;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(o=r.get(e)){t.next=5;break}throw new Error(\"Unregistered Resolver: \".concat(String(e)));case 5:return t.abrupt(\"return\",o.resolve.apply(o,s(n)));case 6:case\"end\":return t.stop()}}),t)}))),function(t,e,r){return o.apply(this,arguments)})},{key:\"execute\",value:(n=p(l().mark((function t(e,r){var n;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Promise.resolve();case 2:for(;e--;)n=this.queue.shift(),this.consume(n,r);case 3:case\"end\":return t.stop()}}),t,this)}))),function(t,e){return n.apply(this,arguments)})},{key:\"consume\",value:(r=p(l().mark((function t(e,r){var n,o,i,u;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:t.t0=e.actionType,t.next=t.t0===a.CALLBACK?3:t.t0===a.CALL?6:12;break;case 3:return(n=this.callbackPool.get(e.id))&&(e.error?n.reject(JSON.parse(e.error)):n.resolve(e.payload?JSON.parse(e.payload):\"\"),this.callbackPool.delete(e.id)),t.abrupt(\"break\",12);case 6:return o=e.payload?JSON.parse(e.payload):[],t.next=9,this.callResolver(e.token,r,o);case 9:i=t.sent,u={actionType:a.CALLBACK,token:e.token,id:e.id,payload:JSON.stringify(i)},this.dispatch(u);case 12:case\"end\":return t.stop()}}),t,this)}))),function(t,e){return r.apply(this,arguments)})},{key:\"dispatch\",value:(e=p(l().mark((function t(e){var r=this;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:t.t0=e.actionType,t.next=t.t0===a.CALLBACK?3:t.t0===a.CALL?5:7;break;case 3:return this.sender(JSON.stringify(e)),t.abrupt(\"return\",Promise.resolve({}));case 5:return this.sender(JSON.stringify(e)),t.abrupt(\"return\",new Promise((function(t,n){r.callbackPool.set(e.id,{resolve:t,reject:n})})));case 7:return t.abrupt(\"return\",Promise.resolve({}));case 8:case\"end\":return t.stop()}}),t,this)}))),function(t){return e.apply(this,arguments)})},{key:\"on\",value:function(t,e){var r=JSON.parse(t);this.queue.push(r),this.execute(this.queue.length,e)}}],[{key:\"getInstance\",value:function(){return t.instance||(t.instance=new t),t.instance}}]),t}();g(L,\"instance\",void 0);var S,O,x,_=function(){function t(e){v(this,t),g(this,\"resolvers\",new Map),this.registerResolvers(e)}return d(t,[{key:\"registerResolvers\",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};Object.keys(e).forEach((function(r){var n;t.resolvers.set(r,new u(r,null!==(n=e[r])&&void 0!==n?n:m))}))}},{key:\"on\",value:function(e){t.transceiver.on(e,this.resolvers)}},{key:\"call\",value:function(e){for(var r=arguments.length,n=new Array(r>1?r-1:0),o=1;o<r;o++)n[o-1]=arguments[o];return t.transceiver.dispatch({actionType:a.CALL,token:e,payload:JSON.stringify(n),id:w()})}}],[{key:\"setSender\",value:function(e){t.transceiver.isConnected()||t.transceiver.setSender(e)}}]),t}();g(_,\"transceiver\",L.getInstance()),function(t){t.OnTextChange=\"@CALL[OnTextChange]__builtin\",t.UpdateFormat=\"@CALL[UpdateFormat]__builtin\",t.SetReactNativeState=\"@CALL[SetReactNativeState]__builtin\",t.ScrollWebView=\"@CALL[ScrollWebView]__builtin\",t.OnWebViewInit=\"@CALL[onWebViewInit]__builtin\",t.OnEditorReady=\"@CALL[OnEditorReady]__builtin\"}(S||(S={})),function(t){t[t.UP=0]=\"UP\",t[t.DOWN=1]=\"DOWN\"}(O||(O={})),function(t){t.AddImage=\"@CALL[AddImage]__builtin\",t.Initialize=\"@CALL[Initialize]__builtin\",t.Focus=\"@CALL[Focus]__builtin\",t.Blur=\"@CALL[Blur]__builtin\",t.Undo=\"@CALL[Undo]__builtin\",t.Redo=\"@CALL[Redo]__builtin\",t.GetContents=\"@CALL[GetContents]__builtin\",t.GetLength=\"@CALL[GetLength]__builtin\",t.GetText=\"@CALL[GetText]__builtin\",t.SetContents=\"@CALL[SetContents]__builtin\",t.SetText=\"@CALL[SetText]__builtin\",t.UpdateContents=\"@CALL[UpdateContents]__builtin\",t.QuillAPI=\"@CALL[QuillAPI]__builtin\"}(x||(x={}));function k(t){return k=\"function\"==typeof Symbol&&\"symbol\"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&\"function\"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?\"symbol\":typeof t},k(t)}function E(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function j(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,P(n.key),n)}}function C(t,e,r){return(e=P(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function P(t){var e=function(t,e){if(\"object\"!==k(t)||null===t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var n=r.call(t,e||\"default\");if(\"object\"!==k(n))return n;throw new TypeError(\"@@toPrimitive must return a primitive value.\")}return(\"string\"===e?String:Number)(t)}(t,\"string\");return\"symbol\"===k(e)?e:String(e)}function A(t,e){var r=window.Quill.import(\"delta\"),n=function(){function t(e,r){!function(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}(this,t),C(this,\"quill\",void 0),C(this,\"history\",void 0),C(this,\"bridge\",void 0),C(this,\"viewHeight\",0),C(this,\"previousContentLength\",0),C(this,\"previousSectionRange\",{index:0,length:0}),this.bridge=r,this.quill=e,this.history=this.quill.getModule(\"history\"),this.setEvents(),this.registerResolvers(),this.updateViewHeight()}var e,n,o;return e=t,n=[{key:\"setEvents\",value:function(){var t=this;this.quill.on(\"text-change\",(function(){t.updateViewHeight(),t.calculateScrollOffsetWhenTextChange(),t.bridge.call(S.OnTextChange,t.getContents())})),this.quill.on(\"selection-change\",(function(e){t.calculateScrollOffsetWhenSelect(e)}))}},{key:\"updateViewHeight\",value:function(){var t=this.quill.root.getBoundingClientRect();this.viewHeight!==t.height&&this.bridge.call(S.SetReactNativeState,\"webViewHeight\",JSON.stringify(t.height)),this.viewHeight=t.height}},{key:\"calculateScrollOffsetWhenTextChange\",value:function(){var e=this,r=this.previousContentLength,n=this.quill.getLength();setTimeout((function(){var o=e.quill.getSelection();if(o){var i=r<=n?O.DOWN:O.UP,a=e.quill.getBounds(o.index,o.length),u=i===O.DOWN?a.bottom:a.top-t.ScrollOffsetBuffer;-1!==u&&e.bridge.call(S.ScrollWebView,u,i),e.previousContentLength=n}}))}},{key:\"calculateScrollOffsetWhenSelect\",value:function(e){if(e){var r=this.quill.getBounds(e.index,e.length),n=-1,o=O.DOWN;if(e.length)if(this.previousSectionRange&&this.previousSectionRange.length){if(this.previousSectionRange.length){var i=this.quill.getBounds(this.previousSectionRange.index,this.previousSectionRange.length),a=i.bottom===r.bottom,u=i.top===r.top;u||a?a?u||(o=r.top>i.top?O.DOWN:O.UP,n=r.top+t.ScrollOffsetBuffer*(o===O.DOWN?1:-1)):(o=r.bottom>i.bottom?O.DOWN:O.UP,n=r.bottom+t.ScrollOffsetBuffer*(o===O.DOWN?1:-1)):n=r.bottom+t.ScrollOffsetBuffer}}else n=r.bottom+t.ScrollOffsetBuffer;else n=r.bottom+t.ScrollOffsetBuffer;this.previousSectionRange=function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?E(Object(r),!0).forEach((function(e){C(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):E(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},e),-1!==n&&this.bridge.call(S.ScrollWebView,n,o)}else this.previousSectionRange=null}},{key:\"undo\",value:function(){this.history.undo()}},{key:\"redo\",value:function(){this.history.redo()}},{key:\"blur\",value:function(){this.quill.blur()}},{key:\"focus\",value:function(){this.quill.focus(),this.quill.root.click(),this.quill.root.focus()}},{key:\"getContents\",value:function(t,e){return this.quill.getContents(t,e).ops}},{key:\"setContents\",value:function(t,e){return console.log(\"??? set\",t),this.quill.setContents(new r(t),e).ops}},{key:\"registerResolvers\",value:function(){var t;this.bridge.registerResolvers((C(t={},x.Focus,this.undo.bind(this)),C(t,x.Blur,this.blur.bind(this)),C(t,x.Undo,this.undo.bind(this)),C(t,x.Redo,this.redo.bind(this)),C(t,x.SetContents,this.setContents.bind(this)),C(t,x.GetContents,this.getContents.bind(this)),t))}}],n&&j(e.prototype,n),o&&j(e,o),Object.defineProperty(e,\"prototype\",{writable:!1}),t}();return C(n,\"ScrollOffsetBuffer\",20),new n(t,e)}function N(t){return N=\"function\"==typeof Symbol&&\"symbol\"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&\"function\"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?\"symbol\":typeof t},N(t)}function T(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */T=function(){return t};var t={},e=Object.prototype,r=e.hasOwnProperty,n=Object.defineProperty||function(t,e,r){t[e]=r.value},o=\"function\"==typeof Symbol?Symbol:{},i=o.iterator||\"@@iterator\",a=o.asyncIterator||\"@@asyncIterator\",u=o.toStringTag||\"@@toStringTag\";function c(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{c({},\"\")}catch(t){c=function(t,e,r){return t[e]=r}}function l(t,e,r,o){var i=e&&e.prototype instanceof h?e:h,a=Object.create(i.prototype),u=new _(o||[]);return n(a,\"_invoke\",{value:L(t,r,u)}),a}function s(t,e,r){try{return{type:\"normal\",arg:t.call(e,r)}}catch(t){return{type:\"throw\",arg:t}}}t.wrap=l;var f={};function h(){}function p(){}function v(){}var y={};c(y,i,(function(){return this}));var d=Object.getPrototypeOf,g=d&&d(d(k([])));g&&g!==e&&r.call(g,i)&&(y=g);var b=v.prototype=h.prototype=Object.create(y);function m(t){[\"next\",\"throw\",\"return\"].forEach((function(e){c(t,e,(function(t){return this._invoke(e,t)}))}))}function w(t,e){function o(n,i,a,u){var c=s(t[n],t,i);if(\"throw\"!==c.type){var l=c.arg,f=l.value;return f&&\"object\"==N(f)&&r.call(f,\"__await\")?e.resolve(f.__await).then((function(t){o(\"next\",t,a,u)}),(function(t){o(\"throw\",t,a,u)})):e.resolve(f).then((function(t){l.value=t,a(l)}),(function(t){return o(\"throw\",t,a,u)}))}u(c.arg)}var i;n(this,\"_invoke\",{value:function(t,r){function n(){return new e((function(e,n){o(t,r,e,n)}))}return i=i?i.then(n,n):n()}})}function L(t,e,r){var n=\"suspendedStart\";return function(o,i){if(\"executing\"===n)throw new Error(\"Generator is already running\");if(\"completed\"===n){if(\"throw\"===o)throw i;return E()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var u=S(a,r);if(u){if(u===f)continue;return u}}if(\"next\"===r.method)r.sent=r._sent=r.arg;else if(\"throw\"===r.method){if(\"suspendedStart\"===n)throw n=\"completed\",r.arg;r.dispatchException(r.arg)}else\"return\"===r.method&&r.abrupt(\"return\",r.arg);n=\"executing\";var c=s(t,e,r);if(\"normal\"===c.type){if(n=r.done?\"completed\":\"suspendedYield\",c.arg===f)continue;return{value:c.arg,done:r.done}}\"throw\"===c.type&&(n=\"completed\",r.method=\"throw\",r.arg=c.arg)}}}function S(t,e){var r=e.method,n=t.iterator[r];if(void 0===n)return e.delegate=null,\"throw\"===r&&t.iterator.return&&(e.method=\"return\",e.arg=void 0,S(t,e),\"throw\"===e.method)||\"return\"!==r&&(e.method=\"throw\",e.arg=new TypeError(\"The iterator does not provide a '\"+r+\"' method\")),f;var o=s(n,t.iterator,e.arg);if(\"throw\"===o.type)return e.method=\"throw\",e.arg=o.arg,e.delegate=null,f;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,\"return\"!==e.method&&(e.method=\"next\",e.arg=void 0),e.delegate=null,f):i:(e.method=\"throw\",e.arg=new TypeError(\"iterator result is not an object\"),e.delegate=null,f)}function O(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function x(t){var e=t.completion||{};e.type=\"normal\",delete e.arg,t.completion=e}function _(t){this.tryEntries=[{tryLoc:\"root\"}],t.forEach(O,this),this.reset(!0)}function k(t){if(t){var e=t[i];if(e)return e.call(t);if(\"function\"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,o=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:E}}function E(){return{value:void 0,done:!0}}return p.prototype=v,n(b,\"constructor\",{value:v,configurable:!0}),n(v,\"constructor\",{value:p,configurable:!0}),p.displayName=c(v,u,\"GeneratorFunction\"),t.isGeneratorFunction=function(t){var e=\"function\"==typeof t&&t.constructor;return!!e&&(e===p||\"GeneratorFunction\"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,v):(t.__proto__=v,c(t,u,\"GeneratorFunction\")),t.prototype=Object.create(b),t},t.awrap=function(t){return{__await:t}},m(w.prototype),c(w.prototype,a,(function(){return this})),t.AsyncIterator=w,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new w(l(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},m(b),c(b,u,\"Generator\"),c(b,i,(function(){return this})),c(b,\"toString\",(function(){return\"[object Generator]\"})),t.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},t.values=k,_.prototype={constructor:_,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method=\"next\",this.arg=void 0,this.tryEntries.forEach(x),!t)for(var e in this)\"t\"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if(\"throw\"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(r,n){return a.type=\"throw\",a.arg=t,e.next=r,n&&(e.method=\"next\",e.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if(\"root\"===i.tryLoc)return n(\"end\");if(i.tryLoc<=this.prev){var u=r.call(i,\"catchLoc\"),c=r.call(i,\"finallyLoc\");if(u&&c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!c)throw new Error(\"try statement without catch or finally\");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,\"finallyLoc\")&&this.prev<o.finallyLoc){var i=o;break}}i&&(\"break\"===t||\"continue\"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method=\"next\",this.next=i.finallyLoc,f):this.complete(a)},complete:function(t,e){if(\"throw\"===t.type)throw t.arg;return\"break\"===t.type||\"continue\"===t.type?this.next=t.arg:\"return\"===t.type?(this.rval=this.arg=t.arg,this.method=\"return\",this.next=\"end\"):\"normal\"===t.type&&e&&(this.next=e),f},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),x(r),f}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if(\"throw\"===n.type){var o=n.arg;x(r)}return o}}throw new Error(\"illegal catch attempt\")},delegateYield:function(t,e,r){return this.delegate={iterator:k(t),resultName:e,nextLoc:r},\"next\"===this.method&&(this.arg=void 0),f}},t}function R(t,e,r,n,o,i,a){try{var u=t[i](a),c=u.value}catch(t){return void r(t)}u.done?e(c):Promise.resolve(c).then(n,o)}function q(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){R(i,n,o,a,u,\"next\",t)}function u(t){R(i,n,o,a,u,\"throw\",t)}a(void 0)}))}}var G=function(){var t=q(T().mark((function t(){var e,r=arguments;return T().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=[],(r.length>0&&void 0!==r[0]?r[0]:[]).forEach((function(t){var r=document.createElement(\"script\");r.setAttribute(\"type\",\"text/javascript\"),r.setAttribute(\"src\",t),e.push(new Promise((function(t,e){r.onload=function(){return t()},r.onabort=function(){return e()}}))),document.body.append(r)})),t.next=5,Promise.allSettled(e);case 5:case\"end\":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),I=function(){var t=q(T().mark((function t(){var e,r=arguments;return T().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=[],(r.length>0&&void 0!==r[0]?r[0]:[]).forEach((function(t){var r=document.createElement(\"link\");r.setAttribute(\"rel\",\"stylesheet\"),r.setAttribute(\"href\",t),e.push(new Promise((function(t,e){r.onload=function(){return t()},r.onabort=function(){return e()}}))),document.body.append(r)})),t.next=5,Promise.allSettled(e);case 5:case\"end\":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),W=function(t){var e=document.createElement(\"div\");e.id=\"$editor\",window.document.body.append(e);var r=new(0,window.Quill)(e,t);return window.$QuillInstance=r,r};try{_.setSender((function(t){return window.ReactNativeWebView.postMessage(t)}));var B=new _;window.$ReactNativeBridge=B,B.call(S.OnWebViewInit).then(function(){var t=q(T().mark((function t(e){return T().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,G([e.quillScript]);case 2:return t.next=4,I(e.cssList);case 4:A(W(e.quillOptions),B),G(e.scriptsList),B.call(S.OnEditorReady);case 8:case\"end\":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}catch(t){var F=document.createElement(\"div\");F.innerText=t.message,document.body.append(F)}return e})()));</script></body><style>* { padding: 0; margin: 0; }</style></html>"