(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


function addSafeAreaInsets(result) {
  if (result.safeArea) {
    var safeArea = result.safeArea;
    result.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: result.windowWidth - safeArea.right,
      bottom: result.windowHeight - safeArea.bottom };

  }
}
var protocols = {
  previewImage: previewImage,
  getSystemInfo: {
    returnValue: addSafeAreaInsets },

  getSystemInfoSync: {
    returnValue: addSafeAreaInsets } };


var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm && this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 110:
/*!******************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/common/testdata.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; //商家信息
var storeData = {
  //商家唯一标识
  storeId: '168',
  //商家名称
  storeName: '小太阳商店',
  //头像
  avatar: '/static/images/user.png',

  banner: '/static/face/banner.jpg',
  //商家住址
  address: '新疆阿克苏是他北路2号',
  //配送时间
  deliveryTime: '11:00~20:30',
  //联系电话
  telephone: '18299989916',
  //商家购物车
  shoppingCart: [],
  //配送费
  shippingDees: 4,
  //配送起步价
  startingPrice: 30 };


//评论数据
var commentData = [{
  header_img: "/static/face/face_2.jpg",
  user_name: "测试1",
  rate: 5,
  create_time: "2019.04.12",
  content: "好评",
  imgs: [
  '/static/face/face.jpg',
  '/static/face/p10.jpg',
  '/static/face/face_14.jpg',
  '/static/face/face.jpg',
  '/static/face/p10.jpg'] },


{
  content: "中评",
  create_time: "2019.04.12",
  header_img: "/static/face/face_12.jpg",
  user_name: "测试2",
  rate: 4
  // imgs:[]
},
{
  content: "",
  create_time: "2019.04.12",
  header_img: "/static/face/face_15.jpg",
  user_name: "测试3",
  rate: 2
  // imgs:[]
}, {
  content: "好评",
  create_time: "2019.04.12",
  header_img: "/static/face/face_2.jpg",
  user_name: "测试1",
  rate: 5,
  imgs: [
  '/static/face/face.jpg',
  '/static/face/p10.jpg',
  '/static/face/face_14.jpg',
  '/static/face/face.jpg',
  '/static/face/p10.jpg'] },


{
  content: "中评",
  create_time: "2019.04.12",
  header_img: "/static/face/face_12.jpg",
  user_name: "测试2",
  rate: 3.5
  // imgs:[]
},
{
  content: "",
  create_time: "2019.04.12",
  header_img: "/static/face/face_15.jpg",
  user_name: "测试3",
  rate: 2.3
  // imgs:[]
}];

//商品数据
var goodsData = [{
  id: 1,
  type_id: 1,
  name: '黄瓜',
  descripe: "脆糯营养，口感好，健康绿色",
  img: '/static/face/face_5.jpg',
  price: "9",
  oldprice: "100" },

{
  id: 2,
  type_id: 2,
  name: '精品秋葵600g',
  descripe: "脆糯营养，口感好，健康绿色",
  img: '/static/face/face_8.jpg',
  price: "8",
  oldprice: "100" },

{
  id: 3,
  type_id: 2,
  name: '西红柿',
  descripe: "脆糯营养，口感好，健康绿色",
  img: '/static/face/face.jpg',
  price: "4",
  oldprice: "" },

{
  id: 4,
  type_id: 3,
  name: '羊肉',
  descripe: "脆糯营养，口感好，健康绿色",
  img: '/static/face/face_1.jpg',
  price: "4",
  oldprice: "" },

{
  id: 5,
  type_id: 3,
  name: '玫瑰花',
  descripe: "脆糯营养，口感好，健康绿色",
  img: '/static/face/face_2.jpg',
  price: "4",
  oldprice: "" },

{
  id: 6,
  type_id: 4,
  name: '玫瑰花',
  descripe: "脆糯营养，口感好，健康绿色",
  img: '/static/face/face_3.jpg',
  price: "4",
  oldprice: "" },

{
  id: 7,
  type_id: 5,
  name: '玫瑰花',
  descripe: "脆糯营养，口感好，健康绿色",
  img: '/static/face/face_4.jpg',
  price: "4",
  oldprice: "" },

{
  id: 8,
  type_id: 5,
  name: '玫瑰花',
  descripe: "脆糯营养，口感好，健康绿色",
  img: '/static/face/face_12.jpg',
  price: "4",
  oldprice: "" },

{
  id: 9,
  type_id: 5,
  name: '玫瑰花',
  descripe: "脆糯营养，口感好，健康绿色",
  img: '/static/face/face_11.jpg',
  price: "4",
  oldprice: "" },

{
  id: 10,
  type_id: 6,
  name: '玫瑰花',
  descripe: "脆糯营养，口感好，健康绿色",
  img: '/static/face/face_13.jpg',
  price: "4",
  oldprice: "" }];


//商品种类数据
var categoryData = [
{ id: 1, name: 'taocan ' },
{ id: 2, name: '鲜花绿植' },
{ id: 3, name: '美食1' },
{ id: 4, name: '美食2' },
{ id: 5, name: '美食3' },
{ id: 6, name: '美食4' },
{ id: 7, name: '美食5' },
{ id: 8, name: '美食6' },
{ id: 9, name: '美食7' },
{ id: 10, name: '美食8' },
{ id: 11, name: '美食9' },
{ id: 12, name: '美食10' },
{ id: 13, name: '美食11' }];var _default =


{
  storeData: storeData,
  commentData: commentData,
  goodsData: goodsData,
  categoryData: categoryData };exports.default = _default;

/***/ }),

/***/ 120:
/*!***********************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/api/user.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.getUserInfo = getUserInfo;exports.getVipCard = getVipCard;var _fly = _interopRequireDefault(__webpack_require__(/*! ../utils/fly.js */ 15));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
var baseUrl = getApp().globalData.baseUrl;
/**
                                            * 获取当前登录的用户信息
                                            */
function getUserInfo() {
  return (0, _fly.default)({
    url: "".concat(baseUrl, "/getUserInfo"),
    method: 'get',
    needToken: true });

}

/**
   * 
   */
function getVipCard() {
  return (0, _fly.default)({
    url: "".concat(baseUrl, "/test/test"),
    method: 'get',
    needToken: true });

}

/***/ }),

/***/ 14:
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 140:
/*!*****************************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/components/uni-icons/icons.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  'contact': "\uE100",
  'person': "\uE101",
  'personadd': "\uE102",
  'contact-filled': "\uE130",
  'person-filled': "\uE131",
  'personadd-filled': "\uE132",
  'phone': "\uE200",
  'email': "\uE201",
  'chatbubble': "\uE202",
  'chatboxes': "\uE203",
  'phone-filled': "\uE230",
  'email-filled': "\uE231",
  'chatbubble-filled': "\uE232",
  'chatboxes-filled': "\uE233",
  'weibo': "\uE260",
  'weixin': "\uE261",
  'pengyouquan': "\uE262",
  'chat': "\uE263",
  'qq': "\uE264",
  'videocam': "\uE300",
  'camera': "\uE301",
  'mic': "\uE302",
  'location': "\uE303",
  'mic-filled': "\uE332",
  'speech': "\uE332",
  'location-filled': "\uE333",
  'micoff': "\uE360",
  'image': "\uE363",
  'map': "\uE364",
  'compose': "\uE400",
  'trash': "\uE401",
  'upload': "\uE402",
  'download': "\uE403",
  'close': "\uE404",
  'redo': "\uE405",
  'undo': "\uE406",
  'refresh': "\uE407",
  'star': "\uE408",
  'plus': "\uE409",
  'minus': "\uE410",
  'circle': "\uE411",
  'checkbox': "\uE411",
  'close-filled': "\uE434",
  'clear': "\uE434",
  'refresh-filled': "\uE437",
  'star-filled': "\uE438",
  'plus-filled': "\uE439",
  'minus-filled': "\uE440",
  'circle-filled': "\uE441",
  'checkbox-filled': "\uE442",
  'closeempty': "\uE460",
  'refreshempty': "\uE461",
  'reload': "\uE462",
  'starhalf': "\uE463",
  'spinner': "\uE464",
  'spinner-cycle': "\uE465",
  'search': "\uE466",
  'plusempty': "\uE468",
  'forward': "\uE470",
  'back': "\uE471",
  'left-nav': "\uE471",
  'checkmarkempty': "\uE472",
  'home': "\uE500",
  'navigate': "\uE501",
  'gear': "\uE502",
  'paperplane': "\uE503",
  'info': "\uE504",
  'help': "\uE505",
  'locked': "\uE506",
  'more': "\uE507",
  'flag': "\uE508",
  'home-filled': "\uE530",
  'gear-filled': "\uE532",
  'info-filled': "\uE534",
  'help-filled': "\uE535",
  'more-filled': "\uE537",
  'settings': "\uE560",
  'list': "\uE562",
  'bars': "\uE563",
  'loop': "\uE565",
  'paperclip': "\uE567",
  'eye': "\uE568",
  'arrowup': "\uE580",
  'arrowdown': "\uE581",
  'arrowleft': "\uE582",
  'arrowright': "\uE583",
  'arrowthinup': "\uE584",
  'arrowthindown': "\uE585",
  'arrowthinleft': "\uE586",
  'arrowthinright': "\uE587",
  'pulldown': "\uE588",
  'closefill': "\uE589",
  'sound': "\uE590",
  'scan': "\uE612" };exports.default = _default;

/***/ }),

/***/ 15:
/*!************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/utils/fly.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _wx = _interopRequireDefault(__webpack_require__(/*! flyio/dist/npm/wx */ 16));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
var fly = new _wx.default();
// const host = "http://localhost:3000"
// const host = "http://192.168.0.103:8889"
var token = wx.getStorageSync('token');
//添加请求拦截器
fly.interceptors.request.use(function (request) {
  wx.showLoading({
    title: "加载中",
    mask: true });

  console.log(request);
  request.headers = {
    "X-Tag": "flyio",
    'content-type': 'application/json',
    'Authorization': token };


  var authParams = {
    //公共参数
    // "categoryType": "SaleGoodsType@sim",
    // "streamNo": "wxapp153570682909641893",
    // "reqSource": "MALL_H5",
    // "appid": "122334566677",
    "author": "simba",
    "timestamp": new Date().getTime()
    // "sign": "string"
  };

  request.body && Object.keys(request.body).forEach(function (val) {
    if (request.body[val] === "") {
      delete request.body[val];
    };
  });
  request.body = _objectSpread({},
  request.body,
  authParams);

  return request;
});

//添加响应拦截器
fly.interceptors.response.use(
function (response) {
  wx.hideLoading();
  return response.data; //请求成功之后将返回值返回
},
function (err) {
  //请求出错，根据返回状态码判断出错原因
  wx.hideLoading();
  if (err) {
    return "请求失败";
  };
});


// fly.config.baseURL = host;
var _default =
fly;exports.default = _default;

/***/ }),

/***/ 16:
/*!*******************************************!*\
  !*** ./node_modules/flyio/dist/npm/wx.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else { var i, a; }
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
    type: function type(ob) {
        return Object.prototype.toString.call(ob).slice(8, -1).toLowerCase();
    },
    isObject: function isObject(ob, real) {
        if (real) {
            return this.type(ob) === "object";
        } else {
            return ob && (typeof ob === 'undefined' ? 'undefined' : _typeof(ob)) === 'object';
        }
    },
    isFormData: function isFormData(val) {
        return typeof FormData !== 'undefined' && val instanceof FormData;
    },
    trim: function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    encode: function encode(val) {
        return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
    },
    formatParams: function formatParams(data) {
        var str = "";
        var first = true;
        var that = this;
        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) != "object") {
            return data;
        }
        function _encode(sub, path) {
            var encode = that.encode;
            var type = that.type(sub);
            if (type == "array") {
                sub.forEach(function (e, i) {
                    _encode(e, path + "%5B%5D");
                });
            } else if (type == "object") {
                for (var key in sub) {
                    if (path) {
                        _encode(sub[key], path + "%5B" + encode(key) + "%5D");
                    } else {
                        _encode(sub[key], encode(key));
                    }
                }
            } else {
                if (!first) {
                    str += "&";
                }
                first = false;
                str += path + "=" + encode(sub);
            }
        }

        _encode(data, "");
        return str;
    },

    // Do not overwrite existing attributes
    merge: function merge(a, b) {
        for (var key in b) {
            if (!a.hasOwnProperty(key)) {
                a[key] = b[key];
            } else if (this.isObject(b[key], 1) && this.isObject(a[key], 1)) {
                this.merge(a[key], b[key]);
            }
        }
        return a;
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

function KEEP(_,cb){cb();}
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * author: wendu
 * email: 824783146@qq.com
 **/

var util = __webpack_require__(0);
var isBrowser = typeof document !== "undefined";

//EngineWrapper can help  generating  a  http engine quickly through a adapter
function EngineWrapper(adapter) {
    var AjaxEngine = function () {
        function AjaxEngine() {
            _classCallCheck(this, AjaxEngine);

            this.requestHeaders = {};
            this.readyState = 0;
            this.timeout = 0; // 0 stands for no timeout
            this.responseURL = "";
            this.responseHeaders = {};
        }

        _createClass(AjaxEngine, [{
            key: "_call",
            value: function _call(name) {
                this[name] && this[name].apply(this, [].splice.call(arguments, 1));
            }
        }, {
            key: "_changeReadyState",
            value: function _changeReadyState(state) {
                this.readyState = state;
                this._call("onreadystatechange");
            }
        }, {
            key: "open",
            value: function open(method, url) {
                this.method = method;
                if (!url) {
                    url = location.href;
                } else {
                    url = util.trim(url);
                    if (url.indexOf("http") !== 0) {
                        // Normalize the request url
                        if (isBrowser) {
                            var t = document.createElement("a");
                            t.href = url;
                            url = t.href;
                        }
                    }
                }
                this.responseURL = url;
                this._changeReadyState(1);
            }
        }, {
            key: "send",
            value: function send(arg) {
                var _this = this;

                arg = arg || null;
                var self = this;
                if (adapter) {
                    var request = {
                        method: self.method,
                        url: self.responseURL,
                        headers: self.requestHeaders || {},
                        body: arg
                    };
                    util.merge(request, self._options || {});
                    if (request.method === "GET") {
                        request.body = null;
                    }
                    self._changeReadyState(3);
                    var timer;
                    self.timeout = self.timeout || 0;
                    if (self.timeout > 0) {
                        timer = setTimeout(function () {
                            if (self.readyState === 3) {
                                _this._call("onloadend");
                                self._changeReadyState(0);
                                self._call("ontimeout");
                            }
                        }, self.timeout);
                    }
                    request.timeout = self.timeout;
                    adapter(request, function (response) {

                        function getAndDelete(key) {
                            var t = response[key];
                            delete response[key];
                            return t;
                        }

                        // If the request has already timeout, return
                        if (self.readyState !== 3) return;
                        clearTimeout(timer);

                        // Make sure the type of status is integer
                        self.status = getAndDelete("statusCode") - 0;

                        var responseText = getAndDelete("responseText");
                        var statusMessage = getAndDelete("statusMessage");

                        // Network error, set the status code 0
                        if (!self.status) {
                            self.statusText = responseText;
                            self._call("onerror", { msg: statusMessage });
                        } else {
                            // Parsing the response headers to array in a object,  because
                            // there may be multiple values with the same header name
                            var responseHeaders = getAndDelete("headers");
                            var headers = {};
                            for (var field in responseHeaders) {
                                var value = responseHeaders[field];
                                var key = field.toLowerCase();
                                // Is array
                                if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                                    headers[key] = value;
                                } else {
                                    headers[key] = headers[key] || [];
                                    headers[key].push(value);
                                }
                            }
                            var cookies = headers["set-cookie"];
                            if (isBrowser && cookies) {
                                cookies.forEach(function (e) {
                                    // Remove the http-Only property of the  cookie
                                    // so that JavaScript can operate it.
                                    document.cookie = e.replace(/;\s*httpOnly/ig, "");
                                });
                            }
                            self.responseHeaders = headers;
                            // Set the fields of engine from response
                            self.statusText = statusMessage || "";
                            self.response = self.responseText = responseText;
                            self._response = response;
                            self._changeReadyState(4);
                            self._call("onload");
                        }
                        self._call("onloadend");
                    });
                } else {
                    console.error("Ajax require adapter");
                }
            }
        }, {
            key: "setRequestHeader",
            value: function setRequestHeader(key, value) {
                this.requestHeaders[util.trim(key)] = value;
            }
        }, {
            key: "getResponseHeader",
            value: function getResponseHeader(key) {
                return (this.responseHeaders[key.toLowerCase()] || "").toString() || null;
            }
        }, {
            key: "getAllResponseHeaders",
            value: function getAllResponseHeaders() {
                var str = "";
                for (var key in this.responseHeaders) {
                    str += key + ":" + this.getResponseHeader(key) + "\r\n";
                }
                return str || null;
            }
        }, {
            key: "abort",
            value: function abort(msg) {
                this._changeReadyState(0);
                this._call("onerror", { msg: msg });
                this._call("onloadend");
            }
        }], [{
            key: "setAdapter",
            value: function setAdapter(requestAdapter) {
                adapter = requestAdapter;
            }
        }]);

        return AjaxEngine;
    }();

    return AjaxEngine;
}

// learn more about keep-loader: https://github.com/wendux/keep-loader
;
module.exports = EngineWrapper;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

function KEEP(_,cb){cb();}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = __webpack_require__(0);
var isBrowser = typeof document !== "undefined";

var Fly = function () {
    function Fly(engine) {
        _classCallCheck(this, Fly);

        this.engine = engine || XMLHttpRequest;

        this.default = this; //For typeScript

        /**
         * Add  lock/unlock API for interceptor.
         *
         * Once an request/response interceptor is locked, the incoming request/response
         * will be added to a queue before they enter the interceptor, they will not be
         * continued  until the interceptor is unlocked.
         *
         * @param [interceptor] either is interceptors.request or interceptors.response
         */
        function wrap(interceptor) {
            var resolve;
            var reject;

            function _clear() {
                interceptor.p = resolve = reject = null;
            }

            utils.merge(interceptor, {
                lock: function lock() {
                    if (!resolve) {
                        interceptor.p = new Promise(function (_resolve, _reject) {
                            resolve = _resolve;
                            reject = _reject;
                        });
                    }
                },
                unlock: function unlock() {
                    if (resolve) {
                        resolve();
                        _clear();
                    }
                },
                clear: function clear() {
                    if (reject) {
                        reject("cancel");
                        _clear();
                    }
                }
            });
        }

        var interceptors = this.interceptors = {
            response: {
                use: function use(handler, onerror) {
                    this.handler = handler;
                    this.onerror = onerror;
                }
            },
            request: {
                use: function use(handler) {
                    this.handler = handler;
                }
            }
        };

        var irq = interceptors.request;
        var irp = interceptors.response;
        wrap(irp);
        wrap(irq);

        this.config = {
            method: "GET",
            baseURL: "",
            headers: {},
            timeout: 0,
            params: {}, // Default Url params
            parseJson: true, // Convert response data to JSON object automatically.
            withCredentials: false
        };
    }

    _createClass(Fly, [{
        key: "request",
        value: function request(url, data, options) {
            var _this = this;

            var engine = new this.engine();
            var contentType = "Content-Type";
            var contentTypeLowerCase = contentType.toLowerCase();
            var interceptors = this.interceptors;
            var requestInterceptor = interceptors.request;
            var responseInterceptor = interceptors.response;
            var requestInterceptorHandler = requestInterceptor.handler;
            var promise = new Promise(function (resolve, reject) {
                if (utils.isObject(url)) {
                    options = url;
                    url = options.url;
                }
                options = options || {};
                options.headers = options.headers || {};

                function isPromise(p) {
                    // some  polyfill implementation of Promise may be not standard,
                    // so, we test by duck-typing
                    return p && p.then && p.catch;
                }

                /**
                 * If the request/response interceptor has been locked，
                 * the new request/response will enter a queue. otherwise, it will be performed directly.
                 * @param [promise] if the promise exist, means the interceptor is  locked.
                 * @param [callback]
                 */
                function enqueueIfLocked(promise, callback) {
                    if (promise) {
                        promise.then(function () {
                            callback();
                        });
                    } else {
                        callback();
                    }
                }

                // make the http request
                function makeRequest(options) {
                    data = options.body;
                    // Normalize the request url
                    url = utils.trim(options.url);
                    var baseUrl = utils.trim(options.baseURL || "");
                    if (!url && isBrowser && !baseUrl) url = location.href;
                    if (url.indexOf("http") !== 0) {
                        var isAbsolute = url[0] === "/";
                        if (!baseUrl && isBrowser) {
                            var arr = location.pathname.split("/");
                            arr.pop();
                            baseUrl = location.protocol + "//" + location.host + (isAbsolute ? "" : arr.join("/"));
                        }
                        if (baseUrl[baseUrl.length - 1] !== "/") {
                            baseUrl += "/";
                        }
                        url = baseUrl + (isAbsolute ? url.substr(1) : url);
                        if (isBrowser) {

                            // Normalize the url which contains the ".." or ".", such as
                            // "http://xx.com/aa/bb/../../xx" to "http://xx.com/xx" .
                            var t = document.createElement("a");
                            t.href = url;
                            url = t.href;
                        }
                    }

                    var responseType = utils.trim(options.responseType || "");
                    var isGet = options.method === "GET";
                    var dataType = utils.type(data);
                    var params = options.params || {};

                    // merge url params when the method is "GET" (data is object)
                    if (isGet && dataType === "object") {
                        params = utils.merge(data, params);
                    }
                    // encode params to String
                    params = utils.formatParams(params);

                    // save url params
                    var _params = [];
                    if (params) {
                        _params.push(params);
                    }
                    // Add data to url params when the method is "GET" (data is String)
                    if (isGet && data && dataType === "string") {
                        _params.push(data);
                    }

                    // make the final url
                    if (_params.length > 0) {
                        url += (url.indexOf("?") === -1 ? "?" : "&") + _params.join("&");
                    }

                    engine.open(options.method, url);

                    // try catch for ie >=9
                    try {
                        engine.withCredentials = !!options.withCredentials;
                        engine.timeout = options.timeout || 0;
                        if (responseType !== "stream") {
                            engine.responseType = responseType;
                        }
                    } catch (e) {}

                    var customContentType = options.headers[contentType] || options.headers[contentTypeLowerCase];

                    // default content type
                    var _contentType = "application/x-www-form-urlencoded";
                    // If the request data is json object, transforming it  to json string,
                    // and set request content-type to "json". In browser,  the data will
                    // be sent as RequestBody instead of FormData
                    if (utils.trim((customContentType || "").toLowerCase()) === _contentType) {
                        data = utils.formatParams(data);
                    } else if (!utils.isFormData(data) && ["object", "array"].indexOf(utils.type(data)) !== -1) {
                        _contentType = 'application/json;charset=utf-8';
                        data = JSON.stringify(data);
                    }
                    //If user doesn't set content-type, set default.
                    if (!(customContentType || isGet)) {
                        options.headers[contentType] = _contentType;
                    }

                    for (var k in options.headers) {
                        if (k === contentType && utils.isFormData(data)) {
                            // Delete the content-type, Let the browser set it
                            delete options.headers[k];
                        } else {
                            try {
                                // In browser environment, some header fields are readonly,
                                // write will cause the exception .
                                engine.setRequestHeader(k, options.headers[k]);
                            } catch (e) {}
                        }
                    }

                    function onresult(handler, data, type) {
                        enqueueIfLocked(responseInterceptor.p, function () {
                            if (handler) {
                                //如果失败，添加请求信息
                                if (type) {
                                    data.request = options;
                                }
                                var ret = handler.call(responseInterceptor, data, Promise);
                                data = ret === undefined ? data : ret;
                            }
                            if (!isPromise(data)) {
                                data = Promise[type === 0 ? "resolve" : "reject"](data);
                            }
                            data.then(function (d) {
                                resolve(d);
                            }).catch(function (e) {
                                reject(e);
                            });
                        });
                    }

                    function onerror(e) {
                        e.engine = engine;
                        onresult(responseInterceptor.onerror, e, -1);
                    }

                    function Err(msg, status) {
                        this.message = msg;
                        this.status = status;
                    }

                    engine.onload = function () {
                        // The xhr of IE9 has not response field
                        var response = engine.response || engine.responseText;
                        if (response && options.parseJson && (engine.getResponseHeader(contentType) || "").indexOf("json") !== -1
                        // Some third engine implementation may transform the response text to json object automatically,
                        // so we should test the type of response before transforming it
                        && !utils.isObject(response)) {
                            response = JSON.parse(response);
                        }

                        var headers = engine.responseHeaders;
                        // In browser
                        if (!headers) {
                            headers = {};
                            var items = (engine.getAllResponseHeaders() || "").split("\r\n");
                            items.pop();
                            items.forEach(function (e) {
                                if (!e) return;
                                var key = e.split(":")[0];
                                headers[key] = engine.getResponseHeader(key);
                            });
                        }
                        var status = engine.status;
                        var statusText = engine.statusText;
                        var data = { data: response, headers: headers, status: status, statusText: statusText };
                        // The _response filed of engine is set in  adapter which be called in engine-wrapper.js
                        utils.merge(data, engine._response);
                        if (status >= 200 && status < 300 || status === 304) {
                            data.engine = engine;
                            data.request = options;
                            onresult(responseInterceptor.handler, data, 0);
                        } else {
                            var e = new Err(statusText, status);
                            e.response = data;
                            onerror(e);
                        }
                    };

                    engine.onerror = function (e) {
                        onerror(new Err(e.msg || "Network Error", 0));
                    };

                    engine.ontimeout = function () {
                        onerror(new Err("timeout [ " + engine.timeout + "ms ]", 1));
                    };
                    engine._options = options;
                    setTimeout(function () {
                        engine.send(isGet ? null : data);
                    }, 0);
                }

                enqueueIfLocked(requestInterceptor.p, function () {
                    utils.merge(options, _this.config);
                    var headers = options.headers;
                    headers[contentType] = headers[contentType] || headers[contentTypeLowerCase] || "";
                    delete headers[contentTypeLowerCase];
                    options.body = data || options.body;
                    url = utils.trim(url || "");
                    options.method = options.method.toUpperCase();
                    options.url = url;
                    var ret = options;
                    if (requestInterceptorHandler) {
                        ret = requestInterceptorHandler.call(requestInterceptor, options, Promise) || options;
                    }
                    if (!isPromise(ret)) {
                        ret = Promise.resolve(ret);
                    }
                    ret.then(function (d) {
                        //if options continue
                        if (d === options) {
                            makeRequest(d);
                        } else {
                            resolve(d);
                        }
                    }, function (err) {
                        reject(err);
                    });
                });
            });
            promise.engine = engine;
            return promise;
        }
    }, {
        key: "all",
        value: function all(promises) {
            return Promise.all(promises);
        }
    }, {
        key: "spread",
        value: function spread(callback) {
            return function (arr) {
                return callback.apply(null, arr);
            };
        }
    }]);

    return Fly;
}();

//For typeScript


Fly.default = Fly;

["get", "post", "put", "patch", "head", "delete"].forEach(function (e) {
    Fly.prototype[e] = function (url, data, option) {
        return this.request(url, data, utils.merge({ method: e }, option));
    };
});
        ["lock", "unlock", "clear"].forEach(function (e) {
            Fly.prototype[e] = function () {
                this.interceptors.request[e]();
            };
        });
// Learn more about keep-loader: https://github.com/wendux/keep-loader
;
module.exports = Fly;

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//微信小程序适配器
module.exports = function (request, responseCallback) {
    var con = {
        method: request.method,
        url: request.url,
        dataType: request.dataType || undefined,
        header: request.headers,
        data: request.body || {},
        success: function success(res) {
            responseCallback({
                statusCode: res.statusCode,
                responseText: res.data,
                headers: res.header,
                statusMessage: res.errMsg
            });
        },
        fail: function fail(res) {
            responseCallback({
                statusCode: res.statusCode || 0,
                statusMessage: res.errMsg
            });
        }
    };
    wx.request(con);
};

/***/ }),
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//微信小程序入口
var Fly = __webpack_require__(2);
var EngineWrapper = __webpack_require__(1);
var adapter = __webpack_require__(6);
var wxEngine = EngineWrapper(adapter);
module.exports = function (engine) {
    return new Fly(engine || wxEngine);
};

/***/ })
/******/ ]);
});

/***/ }),

/***/ 17:
/*!**************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/store/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 18));
var _conversation = _interopRequireDefault(__webpack_require__(/*! ./modules/conversation.js */ 19));
var _group = _interopRequireDefault(__webpack_require__(/*! ./modules/group */ 25));
var _user = _interopRequireDefault(__webpack_require__(/*! ./modules/user */ 26));
var _global = _interopRequireDefault(__webpack_require__(/*! ./modules/global */ 27));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
_vue.default.use(_vuex.default);var _default =

new _vuex.default.Store({
  modules: {
    conversation: _conversation.default,
    group: _group.default,
    user: _user.default,
    global: _global.default } });exports.default = _default;

/***/ }),

/***/ 18:
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),

/***/ 19:
/*!*****************************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/store/modules/conversation.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _index = __webpack_require__(/*! ../../utils/index */ 20);
var _decodeElement = __webpack_require__(/*! ../../utils/decodeElement */ 22);
var _timWxSdk = _interopRequireDefault(__webpack_require__(/*! tim-wx-sdk */ 24));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var conversationModules = {
  state: {
    allConversation: [], // 所有的conversation
    currentConversationID: '', // 当前聊天对话ID
    currentConversation: {}, // 当前聊天对话信息
    currentMessageList: [], // 当前聊天消息列表
    nextReqMessageID: '', // 下一条消息标志
    isCompleted: false, // 当前会话消息是否已经请求完毕
    isLoading: false // 是否正在请求
  },
  getters: {
    allConversation: function allConversation(state) {return state.allConversation;},
    // 当前聊天对象的ID
    toAccount: function toAccount(state) {
      if (state.currentConversationID.indexOf('C2C') === 0) {
        return state.currentConversationID.substring(3);
      } else if (state.currentConversationID.indexOf('GROUP') === 0) {
        return state.currentConversationID.substring(5);
      }
    },
    // 当前聊天对象的昵称
    toName: function toName(state) {
      if (state.currentConversation.type === 'C2C') {
        return state.currentConversation.userProfile.userID;
      } else if (state.currentConversation.type === 'GROUP') {
        return state.currentConversation.groupProfile.name;
      }
    },
    // 当前聊天对话的Type
    currentConversationType: function currentConversationType(state) {
      if (state.currentConversationID.indexOf('C2C') === 0) {
        return 'C2C';
      }
      if (state.currentConversationID.indexOf('GROUP') === 0) {
        return 'GROUP';
      }
      return '';
    },
    currentConversation: function currentConversation(state) {return state.currentConversation;},
    currentMessageList: function currentMessageList(state) {return state.currentMessageList;},
    totalUnreadCount: function totalUnreadCount(state) {
      var result = state.allConversation.reduce(function (count, _ref) {var unreadCount = _ref.unreadCount;return count + unreadCount;}, 0);
      if (result === 0) {
        wx.removeTabBarBadge({ index: 0 });
      } else {
        wx.setTabBarBadge({ index: 0, text: result > 99 ? '99+' : String(result) });
      }
      return result;
    } },

  mutations: {
    // 历史头插消息列表
    unshiftMessageList: function unshiftMessageList(state, messageList) {
      var list = _toConsumableArray(messageList);
      for (var i = 0; i < list.length; i++) {
        var message = list[i];
        list[i].virtualDom = (0, _decodeElement.decodeElement)(message);
        var date = new Date(message.time * 1000);
        list[i].newtime = (0, _index.formatTime)(date);
      }
      state.currentMessageList = [].concat(_toConsumableArray(list), _toConsumableArray(state.currentMessageList));
    },
    // 收到
    receiveMessage: function receiveMessage(state, messageList) {
      var list = _toConsumableArray(messageList);
      for (var i = 0; i < list.length; i++) {
        var message = list[i];
        list[i].virtualDom = (0, _decodeElement.decodeElement)(message);
        var date = new Date(message.time * 1000);
        list[i].newtime = (0, _index.formatTime)(date);
      }
      state.currentMessageList = [].concat(_toConsumableArray(state.currentMessageList), _toConsumableArray(list));
    },
    sendMessage: function sendMessage(state, message) {
      message.virtualDom = (0, _decodeElement.decodeElement)(message);
      var date = new Date(message.time * 1000);
      message.newtime = (0, _index.formatTime)(date);
      state.currentMessageList.push(message);
      setTimeout(function () {
        wx.pageScrollTo({
          scrollTop: 99999 });

      }, 800);
    },
    // 更新当前的会话
    updateCurrentConversation: function updateCurrentConversation(state, conversation) {
      state.currentConversation = conversation;
      state.currentConversationID = conversation.conversationID;
    },
    // 更新当前所有会话列表
    updateAllConversation: function updateAllConversation(state, list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].lastMessage && typeof list[i].lastMessage.lastTime === 'number') {
          var date = new Date(list[i].lastMessage.lastTime * 1000);
          list[i].lastMessage._lastTime = (0, _index.formatTime)(date);
        }
      }
      state.allConversation = list;
    },
    // 重置当前会话
    resetCurrentConversation: function resetCurrentConversation(state) {
      state.currentConversationID = ''; // 当前聊天对话ID
      state.currentConversation = {}; // 当前聊天对话信息
      state.currentMessageList = []; // 当前聊天消息列表
      state.nextReqMessageID = ''; // 下一条消息标志
      state.isCompleted = false; // 当前会话消息是否已经请求完毕
      state.isLoading = false; // 是否正在请求
    },
    resetAllConversation: function resetAllConversation(state) {
      state.allConversation = [];
    },
    removeMessage: function removeMessage(state, message) {
      state.currentMessageList.splice(state.currentMessageList.findIndex(function (item) {return item.ID === message.ID;}), 1);
    },
    changeMessageStatus: function changeMessageStatus(state, index) {
      state.currentMessageList[index].status = 'fail';
    } },

  actions: {
    // 消息事件
    onMessageEvent: function onMessageEvent(context, event) {
      if (event.name === 'onMessageReceived') {
        var id = context.state.currentConversationID;
        if (!id) {
          return;
        }
        var list = [];
        event.data.forEach(function (item) {
          if (item.conversationID === id) {
            list.push(item);
          }
        });
        context.commit('receiveMessage', list);
      }
    },
    // 获取消息列表
    getMessageList: function getMessageList(context) {var _context$state =
      context.state,currentConversationID = _context$state.currentConversationID,nextReqMessageID = _context$state.nextReqMessageID;
      // 判断是否拉完了
      if (!context.state.isCompleted) {
        if (!context.state.isLoading) {
          context.state.isLoading = true;
          wx.$app.getMessageList({ conversationID: currentConversationID, nextReqMessageID: nextReqMessageID, count: 15 }).then(function (res) {
            context.state.nextReqMessageID = res.data.nextReqMessageID;
            context.commit('unshiftMessageList', res.data.messageList);
            if (res.data.isCompleted) {
              context.state.isCompleted = true;
            }
            context.state.isLoading = false;
          }).catch(function (err) {
            console.log(err);
          });
        } else {
          wx.showToast({
            title: '你拉的太快了',
            icon: 'none',
            duration: 500 });

        }
      } else {
        wx.showToast({
          title: '没有更多啦',
          icon: 'none',
          duration: 1500 });

      }
    },
    checkoutConversation: function checkoutConversation(context, conversationID) {
      context.commit('resetCurrentConversation');
      wx.$app.setMessageRead({ conversationID: conversationID });
      return wx.$app.getConversationProfile(conversationID).
      then(function (_ref2) {var conversation = _ref2.data.conversation;
        context.commit('updateCurrentConversation', conversation);
        context.dispatch('getMessageList');
        var name = '';
        switch (conversation.type) {
          case _timWxSdk.default.TYPES.CONV_C2C:
            name = conversation.userProfile.nick || conversation.userProfile.userID;
            break;
          case _timWxSdk.default.TYPES.CONV_GROUP:
            name = conversation.groupProfile.name || conversation.groupProfile.groupID;
            break;
          default:
            name = '系统通知';}

        wx.navigateTo({ url: "../chat/main?toAccount=".concat(name, "&type=").concat(conversation.type) });
        return Promise.resolve();
      });
    } } };var _default =



conversationModules;exports.default = _default;

/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 20:
/*!**************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/utils/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.formatTime = formatTime;exports.getDate = getDate;exports.getTime = getTime;exports.getFullDate = getFullDate;exports.isToday = isToday;exports.throttle = throttle;exports.formatDuration = formatDuration;exports.pinyin = pinyin;exports.isJSON = isJSON;exports.default = void 0;var _dict = _interopRequireDefault(__webpack_require__(/*! ./dict.js */ 21));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

function formatNumber(n) {
  var str = n.toString();
  return str[1] ? str : "0".concat(str);
}

function formatTime(date) {
  if (isToday(date)) {
    return wx.dayjs(date).format('A HH:mm').replace('PM', '下午').replace('AM', '上午');
  }
  return getDate(date);
}

function getDate(date) {var splitor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return "".concat(year).concat(splitor).concat(addZeroPrefix(month)).concat(splitor).concat(addZeroPrefix(day));
}

/**
   * 返回时分秒/时分
   * @export
   * @param {*} date
   * @param {boolean} [withSecond=false]
   * @returns
   */
function getTime(date) {var withSecond = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return withSecond ? "".concat(addZeroPrefix(hour), ":").concat(addZeroPrefix(minute), ":").concat(addZeroPrefix(second)) : "".concat(hour, ":").concat(addZeroPrefix(minute));
}

function getFullDate(date) {
  return "".concat(getDate(date), " ").concat(getTime(date));
}

function isToday(date) {
  return date.toDateString() === new Date().toDateString();
}

/**
   * 个位数，加0前缀
   * @param {*} number
   * @returns
   */
function addZeroPrefix(number) {
  return number < 10 ? "0".concat(number) : number;
}

function throttle(func, wait) {
  var timeout;
  return function () {
    var that = this;
    var args = arguments;

    if (!timeout) {
      timeout = setTimeout(function () {
        timeout = null;
        func.apply(that, args);
      }, wait);
    }
  };
}
function formatDuration(time) {
  var interval = time;
  var continued = '';
  if (interval > 3600) {
    var hour = Math.floor(interval / 3600);
    continued += hour + '小时';
    interval -= hour * 3600;
  }
  if (interval > 60 && interval < 3600) {
    var min = Math.floor(interval / 60);
    continued += min + '分';
    interval -= min * 60;
  }
  if (interval < 60) {
    continued += Math.floor(interval) + '秒';
  }
  return continued;
}

function pinyin(raw) {
  var str = "".concat(raw);
  if (!str || /^ +$/g.test(str)) {
    return '';
  }
  var result = [];
  for (var i = 0; i < str.length; i++) {
    var unicode = str.charCodeAt(i);
    var char = str.charAt(i);
    if (unicode >= 19968 && unicode <= 40869) {
      char = _dict.default.charAt(unicode - 19968);
    }
    result.push(char);
  }
  return result.join('');
}
function isJSON(str) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str);
      return !!(typeof obj === 'object' && obj);
    } catch (e) {
      return false;
    }
  }
}var _default =

{
  formatNumber: formatNumber,
  formatTime: formatTime,
  throttle: throttle,
  formatDuration: formatDuration,
  pinyin: pinyin,
  isJSON: isJSON };exports.default = _default;

/***/ }),

/***/ 21:
/*!*************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/utils/dict.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = 'YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY';exports.default = _default;

/***/ }),

/***/ 22:
/*!**********************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/utils/decodeElement.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.decodeElement = decodeElement;var _emojiMap = __webpack_require__(/*! ./emojiMap */ 23);
var _index = __webpack_require__(/*! ./index */ 20);
/** 传入message.element（群系统消息SystemMessage，群提示消息GroupTip除外）
                                  * content = {
                                  *  type: 'TIMTextElem',
                                  *  content: {
                                  *    text: 'AAA[龇牙]AAA[龇牙]AAA[龇牙AAA]'
                                  *  }
                                  *}
                                  **/

// 群提示消息的含义 (opType)
var GROUP_TIP_TYPE = {
  MEMBER_JOIN: 1,
  MEMBER_QUIT: 2,
  MEMBER_KICKED_OUT: 3,
  MEMBER_SET_ADMIN: 4, // 被设置为管理员
  MEMBER_CANCELED_ADMIN: 5, // 被取消管理员
  GROUP_INFO_MODIFIED: 6, // 修改群资料，转让群组为该类型，msgBody.msgGroupNewInfo.ownerAccount表示新群主的ID
  MEMBER_INFO_MODIFIED: 7 // 修改群成员信息
};

function parseText(message) {
  var renderDom = [];
  var temp = message.payload.text;
  var left = -1;
  var right = -1;
  while (temp !== '') {
    left = temp.indexOf('[');
    right = temp.indexOf(']');
    switch (left) {
      case 0:
        if (right === -1) {
          renderDom.push({
            name: 'span',
            text: temp });

          temp = '';
        } else {
          var _emoji = temp.slice(0, right + 1);
          if (_emojiMap.emojiMap[_emoji]) {
            renderDom.push({
              name: 'img',
              src: _emojiMap.emojiUrl + _emojiMap.emojiMap[_emoji] });

            temp = temp.substring(right + 1);
          } else {
            renderDom.push({
              name: 'span',
              text: '[' });

            temp = temp.slice(1);
          }
        }
        break;
      case -1:
        renderDom.push({
          name: 'span',
          text: temp });

        temp = '';
        break;
      default:
        renderDom.push({
          name: 'span',
          text: temp.slice(0, left) });

        temp = temp.substring(left);
        break;}

  }
  return renderDom;
}
function parseGroupSystemNotice(message) {
  var payload = message.payload;
  var groupName =
  payload.groupProfile.name || payload.groupProfile.groupID;
  var text;
  switch (payload.operationType) {
    case 1:
      text = "".concat(payload.operatorID, " \u7533\u8BF7\u52A0\u5165\u7FA4\u7EC4\uFF1A").concat(groupName);
      break;
    case 2:
      text = "\u6210\u529F\u52A0\u5165\u7FA4\u7EC4\uFF1A".concat(groupName);
      break;
    case 3:
      text = "\u7533\u8BF7\u52A0\u5165\u7FA4\u7EC4\uFF1A".concat(groupName, "\u88AB\u62D2\u7EDD");
      break;
    case 4:
      text = "\u88AB\u7BA1\u7406\u5458".concat(payload.operatorID, "\u8E22\u51FA\u7FA4\u7EC4\uFF1A").concat(groupName);
      break;
    case 5:
      text = "\u7FA4\uFF1A".concat(groupName, " \u5DF2\u88AB").concat(payload.operatorID, "\u89E3\u6563");
      break;
    case 6:
      text = "".concat(payload.operatorID, "\u521B\u5EFA\u7FA4\uFF1A").concat(groupName);
      break;
    case 7:
      text = "".concat(payload.operatorID, "\u9080\u8BF7\u4F60\u52A0\u7FA4\uFF1A").concat(groupName);
      break;
    case 8:
      text = "\u4F60\u9000\u51FA\u7FA4\u7EC4\uFF1A".concat(groupName);
      break;
    case 9:
      text = "\u4F60\u88AB".concat(payload.operatorID, "\u8BBE\u7F6E\u4E3A\u7FA4\uFF1A").concat(groupName, "\u7684\u7BA1\u7406\u5458");
      break;
    case 10:
      text = "\u4F60\u88AB".concat(payload.operatorID, "\u64A4\u9500\u7FA4\uFF1A").concat(groupName, "\u7684\u7BA1\u7406\u5458\u8EAB\u4EFD");
      break;
    case 255:
      text = '自定义群系统通知: ' + payload.userDefinedField;
      break;}

  return [{
    name: 'system',
    text: text }];

}
function parseGroupTip(message) {
  var payload = message.payload;
  var tip;
  switch (payload.operationType) {
    case GROUP_TIP_TYPE.MEMBER_JOIN:
      tip = "\u65B0\u6210\u5458\u52A0\u5165\uFF1A".concat(payload.userIDList.join(','));
      break;
    case GROUP_TIP_TYPE.MEMBER_QUIT:
      tip = "\u7FA4\u6210\u5458\u9000\u7FA4\uFF1A".concat(payload.userIDList.join(','));
      break;
    case GROUP_TIP_TYPE.MEMBER_KICKED_OUT:
      tip = "\u7FA4\u6210\u5458\u88AB\u8E22\uFF1A".concat(payload.userIDList.join(','));
      break;
    case GROUP_TIP_TYPE.MEMBER_SET_ADMIN:
      tip = "".concat(payload.operatorID, "\u5C06").concat(payload.userIDList.join(','), "\u8BBE\u7F6E\u4E3A\u7BA1\u7406\u5458");
      break;
    case GROUP_TIP_TYPE.MEMBER_CANCELED_ADMIN:
      tip = "".concat(payload.operatorID, "\u5C06").concat(payload.userIDList.join(','), "\u53D6\u6D88\u4F5C\u4E3A\u7BA1\u7406\u5458");
      break;
    case GROUP_TIP_TYPE.GROUP_INFO_MODIFIED:
      tip = '群资料修改';
      break;
    case GROUP_TIP_TYPE.MEMBER_INFO_MODIFIED:
      tip = '群成员资料修改';
      if (payload.msgMemberInfo[0].hasOwnProperty('shutupTime')) {
        var time = (payload.msgMemberInfo[0].shutupTime / 60).toFixed(0);
        tip = "".concat(payload.operatorID, "\u5C06").concat(payload.msgMemberInfo[0].userID, "\u7981\u8A00").concat(time, "\u5206\u949F");
      }
      break;}

  return [{
    name: 'groupTip',
    text: tip }];

}

function parseCustom(message) {
  var data = message.payload.data;
  if ((0, _index.isJSON)(data)) {
    data = JSON.parse(data);
    if (data.hasOwnProperty('version') && data.version === 3) {
      var tip;
      var time = (0, _index.formatDuration)(data.duration);
      switch (data.action) {
        case -2:
          tip = '异常挂断';
          break;
        case 0:
          tip = '请求通话';
          break;
        case 1:
          tip = '取消通话';
          break;
        case 2:
          tip = '拒绝通话';
          break;
        case 3:
          tip = '无应答';
          break;
        case 4:
          tip = '开始通话';
          break;
        case 5:
          if (data.duration === 0) {
            tip = '结束通话';
          } else {
            tip = "\u7ED3\u675F\u901A\u8BDD\uFF0C\u901A\u8BDD\u65F6\u957F".concat(time);
          }
          break;
        case 6:
          tip = '正在通话中';
          break;}

      return [{
        name: 'videoCall',
        text: tip }];

    }
  }
  return [{
    name: 'custom',
    text: data }];

}
function decodeElement(message) {
  // renderDom是最终渲染的
  switch (message.type) {
    case 'TIMTextElem':
      return parseText(message);
    case 'TIMGroupSystemNoticeElem':
      return parseGroupSystemNotice(message);
    case 'TIMGroupTipElem':
      return parseGroupTip(message);
    case 'TIMCustomElem':
      return parseCustom(message);
    default:
      return [];}

}

/***/ }),

/***/ 23:
/*!*****************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/utils/emojiMap.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.emojiName = exports.emojiMap = exports.emojiUrl = void 0;var emojiUrl = 'https://webim-1252463788.file.myqcloud.com/assets/emoji/';exports.emojiUrl = emojiUrl;
var emojiMap = {
  '[NO]': 'emoji_0@2x.png',
  '[OK]': 'emoji_1@2x.png',
  '[下雨]': 'emoji_2@2x.png',
  '[么么哒]': 'emoji_3@2x.png',
  '[乒乓]': 'emoji_4@2x.png',
  '[便便]': 'emoji_5@2x.png',
  '[信封]': 'emoji_6@2x.png',
  '[偷笑]': 'emoji_7@2x.png',
  '[傲慢]': 'emoji_8@2x.png',
  '[再见]': 'emoji_9@2x.png',
  '[冷汗]': 'emoji_10@2x.png',
  '[凋谢]': 'emoji_11@2x.png',
  '[刀]': 'emoji_12@2x.png',
  '[删除]': 'emoji_13@2x.png',
  '[勾引]': 'emoji_14@2x.png',
  '[发呆]': 'emoji_15@2x.png',
  '[发抖]': 'emoji_16@2x.png',
  '[可怜]': 'emoji_17@2x.png',
  '[可爱]': 'emoji_18@2x.png',
  '[右哼哼]': 'emoji_19@2x.png',
  '[右太极]': 'emoji_20@2x.png',
  '[右车头]': 'emoji_21@2x.png',
  '[吐]': 'emoji_22@2x.png',
  '[吓]': 'emoji_23@2x.png',
  '[咒骂]': 'emoji_24@2x.png',
  '[咖啡]': 'emoji_25@2x.png',
  '[啤酒]': 'emoji_26@2x.png',
  '[嘘]': 'emoji_27@2x.png',
  '[回头]': 'emoji_28@2x.png',
  '[困]': 'emoji_29@2x.png',
  '[坏笑]': 'emoji_30@2x.png',
  '[多云]': 'emoji_31@2x.png',
  '[大兵]': 'emoji_32@2x.png',
  '[大哭]': 'emoji_33@2x.png',
  '[太阳]': 'emoji_34@2x.png',
  '[奋斗]': 'emoji_35@2x.png',
  '[奶瓶]': 'emoji_36@2x.png',
  '[委屈]': 'emoji_37@2x.png',
  '[害羞]': 'emoji_38@2x.png',
  '[尴尬]': 'emoji_39@2x.png',
  '[左哼哼]': 'emoji_40@2x.png',
  '[左太极]': 'emoji_41@2x.png',
  '[左车头]': 'emoji_42@2x.png',
  '[差劲]': 'emoji_43@2x.png',
  '[弱]': 'emoji_44@2x.png',
  '[强]': 'emoji_45@2x.png',
  '[彩带]': 'emoji_46@2x.png',
  '[彩球]': 'emoji_47@2x.png',
  '[得意]': 'emoji_48@2x.png',
  '[微笑]': 'emoji_49@2x.png',
  '[心碎了]': 'emoji_50@2x.png',
  '[快哭了]': 'emoji_51@2x.png',
  '[怄火]': 'emoji_52@2x.png',
  '[怒]': 'emoji_53@2x.png',
  '[惊恐]': 'emoji_54@2x.png',
  '[惊讶]': 'emoji_55@2x.png',
  '[憨笑]': 'emoji_56@2x.png',
  '[手枪]': 'emoji_57@2x.png',
  '[打哈欠]': 'emoji_58@2x.png',
  '[抓狂]': 'emoji_59@2x.png',
  '[折磨]': 'emoji_60@2x.png',
  '[抠鼻]': 'emoji_61@2x.png',
  '[抱抱]': 'emoji_62@2x.png',
  '[抱拳]': 'emoji_63@2x.png',
  '[拳头]': 'emoji_64@2x.png',
  '[挥手]': 'emoji_65@2x.png',
  '[握手]': 'emoji_66@2x.png',
  '[撇嘴]': 'emoji_67@2x.png',
  '[擦汗]': 'emoji_68@2x.png',
  '[敲打]': 'emoji_69@2x.png',
  '[晕]': 'emoji_70@2x.png',
  '[月亮]': 'emoji_71@2x.png',
  '[棒棒糖]': 'emoji_72@2x.png',
  '[汽车]': 'emoji_73@2x.png',
  '[沙发]': 'emoji_74@2x.png',
  '[流汗]': 'emoji_75@2x.png',
  '[流泪]': 'emoji_76@2x.png',
  '[激动]': 'emoji_77@2x.png',
  '[灯泡]': 'emoji_78@2x.png',
  '[炸弹]': 'emoji_79@2x.png',
  '[熊猫]': 'emoji_80@2x.png',
  '[爆筋]': 'emoji_81@2x.png',
  '[爱你]': 'emoji_82@2x.png',
  '[爱心]': 'emoji_83@2x.png',
  '[爱情]': 'emoji_84@2x.png',
  '[猪头]': 'emoji_85@2x.png',
  '[猫咪]': 'emoji_86@2x.png',
  '[献吻]': 'emoji_87@2x.png',
  '[玫瑰]': 'emoji_88@2x.png',
  '[瓢虫]': 'emoji_89@2x.png',
  '[疑问]': 'emoji_90@2x.png',
  '[白眼]': 'emoji_91@2x.png',
  '[皮球]': 'emoji_92@2x.png',
  '[睡觉]': 'emoji_93@2x.png',
  '[磕头]': 'emoji_94@2x.png',
  '[示爱]': 'emoji_95@2x.png',
  '[礼品袋]': 'emoji_96@2x.png',
  '[礼物]': 'emoji_97@2x.png',
  '[篮球]': 'emoji_98@2x.png',
  '[米饭]': 'emoji_99@2x.png',
  '[糗大了]': 'emoji_100@2x.png',
  '[红双喜]': 'emoji_101@2x.png',
  '[红灯笼]': 'emoji_102@2x.png',
  '[纸巾]': 'emoji_103@2x.png',
  '[胜利]': 'emoji_104@2x.png',
  '[色]': 'emoji_105@2x.png',
  '[药]': 'emoji_106@2x.png',
  '[菜刀]': 'emoji_107@2x.png',
  '[蛋糕]': 'emoji_108@2x.png',
  '[蜡烛]': 'emoji_109@2x.png',
  '[街舞]': 'emoji_110@2x.png',
  '[衰]': 'emoji_111@2x.png',
  '[西瓜]': 'emoji_112@2x.png',
  '[调皮]': 'emoji_113@2x.png',
  '[象棋]': 'emoji_114@2x.png',
  '[跳绳]': 'emoji_115@2x.png',
  '[跳跳]': 'emoji_116@2x.png',
  '[车厢]': 'emoji_117@2x.png',
  '[转圈]': 'emoji_118@2x.png',
  '[鄙视]': 'emoji_119@2x.png',
  '[酷]': 'emoji_120@2x.png',
  '[钞票]': 'emoji_121@2x.png',
  '[钻戒]': 'emoji_122@2x.png',
  '[闪电]': 'emoji_123@2x.png',
  '[闭嘴]': 'emoji_124@2x.png',
  '[闹钟]': 'emoji_125@2x.png',
  '[阴险]': 'emoji_126@2x.png',
  '[难过]': 'emoji_127@2x.png',
  '[雨伞]': 'emoji_128@2x.png',
  '[青蛙]': 'emoji_129@2x.png',
  '[面条]': 'emoji_130@2x.png',
  '[鞭炮]': 'emoji_131@2x.png',
  '[风车]': 'emoji_132@2x.png',
  '[飞吻]': 'emoji_133@2x.png',
  '[飞机]': 'emoji_134@2x.png',
  '[饥饿]': 'emoji_135@2x.png',
  '[香蕉]': 'emoji_136@2x.png',
  '[骷髅]': 'emoji_137@2x.png',
  '[麦克风]': 'emoji_138@2x.png',
  '[麻将]': 'emoji_139@2x.png',
  '[鼓掌]': 'emoji_140@2x.png',
  '[龇牙]': 'emoji_141@2x.png' };exports.emojiMap = emojiMap;

var emojiName = [
'[龇牙]',
'[调皮]',
'[流汗]',
'[偷笑]',
'[再见]',
'[敲打]',
'[擦汗]',
'[猪头]',
'[玫瑰]',
'[流泪]',
'[大哭]',
'[嘘]',
'[酷]',
'[抓狂]',
'[委屈]',
'[便便]',
'[炸弹]',
'[菜刀]',
'[可爱]',
'[色]',
'[害羞]',
'[得意]',
'[吐]',
'[微笑]',
'[怒]',
'[尴尬]',
'[惊恐]',
'[冷汗]',
'[爱心]',
'[示爱]',
'[白眼]',
'[傲慢]',
'[难过]',
'[惊讶]',
'[疑问]',
'[困]',
'[么么哒]',
'[憨笑]',
'[爱情]',
'[衰]',
'[撇嘴]',
'[阴险]',
'[奋斗]',
'[发呆]',
'[右哼哼]',
'[抱抱]',
'[坏笑]',
'[飞吻]',
'[鄙视]',
'[晕]',
'[大兵]',
'[可怜]',
'[强]',
'[弱]',
'[握手]',
'[胜利]',
'[抱拳]',
'[凋谢]',
'[米饭]',
'[蛋糕]',
'[西瓜]',
'[啤酒]',
'[瓢虫]',
'[勾引]',
'[OK]',
'[爱你]',
'[咖啡]',
'[月亮]',
'[刀]',
'[发抖]',
'[差劲]',
'[拳头]',
'[心碎了]',
'[太阳]',
'[礼物]',
'[皮球]',
'[骷髅]',
'[挥手]',
'[闪电]',
'[饥饿]',
'[困]',
'[咒骂]',
'[折磨]',
'[抠鼻]',
'[鼓掌]',
'[糗大了]',
'[左哼哼]',
'[打哈欠]',
'[快哭了]',
'[吓]',
'[篮球]',
'[乒乓]',
'[NO]',
'[跳跳]',
'[怄火]',
'[转圈]',
'[磕头]',
'[回头]',
'[跳绳]',
'[激动]',
'[街舞]',
'[献吻]',
'[左太极]',
'[右太极]',
'[闭嘴]',
'[猫咪]',
'[红双喜]',
'[鞭炮]',
'[红灯笼]',
'[麻将]',
'[麦克风]',
'[礼品袋]',
'[信封]',
'[象棋]',
'[彩带]',
'[蜡烛]',
'[爆筋]',
'[棒棒糖]',
'[奶瓶]',
'[面条]',
'[香蕉]',
'[飞机]',
'[左车头]',
'[车厢]',
'[右车头]',
'[多云]',
'[下雨]',
'[钞票]',
'[熊猫]',
'[灯泡]',
'[风车]',
'[闹钟]',
'[雨伞]',
'[彩球]',
'[钻戒]',
'[沙发]',
'[纸巾]',
'[手枪]',
'[青蛙]'];exports.emojiName = emojiName;

/***/ }),

/***/ 24:
/*!*********************************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/node_modules/tim-wx-sdk/tim-wx.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {!function (e, t) { true ? module.exports = t() : undefined;}(void 0, function () {var e = { SDK_READY: "sdkStateReady", SDK_NOT_READY: "sdkStateNotReady", SDK_DESTROY: "sdkDestroy", MESSAGE_RECEIVED: "onMessageReceived", MESSAGE_REVOKED: "onMessageRevoked", CONVERSATION_LIST_UPDATED: "onConversationListUpdated", GROUP_LIST_UPDATED: "onGroupListUpdated", GROUP_SYSTEM_NOTICE_RECEIVED: "receiveGroupSystemNotice", PROFILE_UPDATED: "onProfileUpdated", BLACKLIST_UPDATED: "blacklistUpdated", KICKED_OUT: "kickedOut", ERROR: "error", NET_STATE_CHANGE: "netStateChange" },t = { MSG_TEXT: "TIMTextElem", MSG_IMAGE: "TIMImageElem", MSG_SOUND: "TIMSoundElem", MSG_AUDIO: "TIMSoundElem", MSG_FILE: "TIMFileElem", MSG_FACE: "TIMFaceElem", MSG_VIDEO: "TIMVideoFileElem", MSG_GEO: "TIMLocationElem", MSG_GRP_TIP: "TIMGroupTipElem", MSG_GRP_SYS_NOTICE: "TIMGroupSystemNoticeElem", MSG_CUSTOM: "TIMCustomElem", MSG_PRIORITY_HIGH: "High", MSG_PRIORITY_NORMAL: "Normal", MSG_PRIORITY_LOW: "Low", MSG_PRIORITY_LOWEST: "Lowest", CONV_C2C: "C2C", CONV_GROUP: "GROUP", CONV_SYSTEM: "@TIM#SYSTEM", GRP_PRIVATE: "Private", GRP_PUBLIC: "Public", GRP_CHATROOM: "ChatRoom", GRP_AVCHATROOM: "AVChatRoom", GRP_MBR_ROLE_OWNER: "Owner", GRP_MBR_ROLE_ADMIN: "Admin", GRP_MBR_ROLE_MEMBER: "Member", GRP_TIP_MBR_JOIN: 1, GRP_TIP_MBR_QUIT: 2, GRP_TIP_MBR_KICKED_OUT: 3, GRP_TIP_MBR_SET_ADMIN: 4, GRP_TIP_MBR_CANCELED_ADMIN: 5, GRP_TIP_GRP_PROFILE_UPDATED: 6, GRP_TIP_MBR_PROFILE_UPDATED: 7, MSG_REMIND_ACPT_AND_NOTE: "AcceptAndNotify", MSG_REMIND_ACPT_NOT_NOTE: "AcceptNotNotify", MSG_REMIND_DISCARD: "Discard", GENDER_UNKNOWN: "Gender_Type_Unknown", GENDER_FEMALE: "Gender_Type_Female", GENDER_MALE: "Gender_Type_Male", KICKED_OUT_MULT_ACCOUNT: "multipleAccount", KICKED_OUT_MULT_DEVICE: "multipleDevice", KICKED_OUT_USERSIG_EXPIRED: "userSigExpired", ALLOW_TYPE_ALLOW_ANY: "AllowType_Type_AllowAny", ALLOW_TYPE_NEED_CONFIRM: "AllowType_Type_NeedConfirm", ALLOW_TYPE_DENY_ANY: "AllowType_Type_DenyAny", FORBID_TYPE_NONE: "AdminForbid_Type_None", FORBID_TYPE_SEND_OUT: "AdminForbid_Type_SendOut", JOIN_OPTIONS_FREE_ACCESS: "FreeAccess", JOIN_OPTIONS_NEED_PERMISSION: "NeedPermission", JOIN_OPTIONS_DISABLE_APPLY: "DisableApply", JOIN_STATUS_SUCCESS: "JoinedSuccess", JOIN_STATUS_ALREADY_IN_GROUP: "AlreadyInGroup", JOIN_STATUS_WAIT_APPROVAL: "WaitAdminApproval", GRP_PROFILE_OWNER_ID: "ownerID", GRP_PROFILE_CREATE_TIME: "createTime", GRP_PROFILE_LAST_INFO_TIME: "lastInfoTime", GRP_PROFILE_MEMBER_NUM: "memberNum", GRP_PROFILE_MAX_MEMBER_NUM: "maxMemberNum", GRP_PROFILE_JOIN_OPTION: "joinOption", GRP_PROFILE_INTRODUCTION: "introduction", GRP_PROFILE_NOTIFICATION: "notification", NET_STATE_CONNECTED: "connected", NET_STATE_CONNECTING: "connecting", NET_STATE_DISCONNECTED: "disconnected" };function n(e) {return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {return typeof e;} : function (e) {return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;})(e);}function r(e, t) {if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");}function o(e, t) {for (var n = 0; n < t.length; n++) {var r = t[n];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);}}function i(e, t, n) {return t && o(e.prototype, t), n && o(e, n), e;}function s(e, t, n) {return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;}function a(e, t) {var n = Object.keys(e);if (Object.getOwnPropertySymbols) {var r = Object.getOwnPropertySymbols(e);t && (r = r.filter(function (t) {return Object.getOwnPropertyDescriptor(e, t).enumerable;})), n.push.apply(n, r);}return n;}function u(e) {for (var t = 1; t < arguments.length; t++) {var n = null != arguments[t] ? arguments[t] : {};t % 2 ? a(Object(n), !0).forEach(function (t) {s(e, t, n[t]);}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : a(Object(n)).forEach(function (t) {Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));});}return e;}function c(e, t) {if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");e.prototype = Object.create(t && t.prototype, { constructor: { value: e, writable: !0, configurable: !0 } }), t && p(e, t);}function l(e) {return (l = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {return e.__proto__ || Object.getPrototypeOf(e);})(e);}function p(e, t) {return (p = Object.setPrototypeOf || function (e, t) {return e.__proto__ = t, e;})(e, t);}function h() {if ("undefined" == typeof Reflect || !Reflect.construct) return !1;if (Reflect.construct.sham) return !1;if ("function" == typeof Proxy) return !0;try {return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;} catch (e) {return !1;}}function f(e, t, n) {return (f = h() ? Reflect.construct : function (e, t, n) {var r = [null];r.push.apply(r, t);var o = new (Function.bind.apply(e, r))();return n && p(o, n.prototype), o;}).apply(null, arguments);}function g(e) {var t = "function" == typeof Map ? new Map() : void 0;return (g = function g(e) {if (null === e || (n = e, -1 === Function.toString.call(n).indexOf("[native code]"))) return e;var n;if ("function" != typeof e) throw new TypeError("Super expression must either be null or a function");if (void 0 !== t) {if (t.has(e)) return t.get(e);t.set(e, r);}function r() {return f(e, arguments, l(this).constructor);}return r.prototype = Object.create(e.prototype, { constructor: { value: r, enumerable: !1, writable: !0, configurable: !0 } }), p(r, e);})(e);}function d(e) {if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e;}function m(e, t) {return !t || "object" != typeof t && "function" != typeof t ? d(e) : t;}function y(e, t) {return function (e) {if (Array.isArray(e)) return e;}(e) || function (e, t) {if (!(Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e))) return;var n = [],r = !0,o = !1,i = void 0;try {for (var s, a = e[Symbol.iterator](); !(r = (s = a.next()).done) && (n.push(s.value), !t || n.length !== t); r = !0) {;}} catch (u) {o = !0, i = u;} finally {try {r || null == a.return || a.return();} finally {if (o) throw i;}}return n;}(e, t) || function () {throw new TypeError("Invalid attempt to destructure non-iterable instance");}();}function v(e) {return function (e) {if (Array.isArray(e)) {for (var t = 0, n = new Array(e.length); t < e.length; t++) {n[t] = e[t];}return n;}}(e) || function (e) {if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e);}(e) || function () {throw new TypeError("Invalid attempt to spread non-iterable instance");}();}var _ = function () {function e() {r(this, e), this.cache = [], this.options = null;}return i(e, [{ key: "use", value: function value(e) {if ("function" != typeof e) throw "middleware must be a function";return this.cache.push(e), this;} }, { key: "next", value: function value(e) {if (this.middlewares && this.middlewares.length > 0) return this.middlewares.shift().call(this, this.options, this.next.bind(this));} }, { key: "run", value: function value(e) {return this.middlewares = this.cache.map(function (e) {return e;}), this.options = e, this.next();} }]), e;}(),C = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};function I(e, t) {return e(t = { exports: {} }, t.exports), t.exports;}var M,S,D,T = I(function (e, t) {var n, r, o, i, s, a, u, c, l, p, h, f, g, d, m, y, v, _;e.exports = (n = "function" == typeof Promise, r = "object" == typeof self ? self : C, o = "undefined" != typeof Symbol, i = "undefined" != typeof Map, s = "undefined" != typeof Set, a = "undefined" != typeof WeakMap, u = "undefined" != typeof WeakSet, c = "undefined" != typeof DataView, l = o && void 0 !== Symbol.iterator, p = o && void 0 !== Symbol.toStringTag, h = s && "function" == typeof Set.prototype.entries, f = i && "function" == typeof Map.prototype.entries, g = h && Object.getPrototypeOf(new Set().entries()), d = f && Object.getPrototypeOf(new Map().entries()), m = l && "function" == typeof Array.prototype[Symbol.iterator], y = m && Object.getPrototypeOf([][Symbol.iterator]()), v = l && "function" == typeof String.prototype[Symbol.iterator], _ = v && Object.getPrototypeOf(""[Symbol.iterator]()), function (e) {var t = typeof e;if ("object" !== t) return t;if (null === e) return "null";if (e === r) return "global";if (Array.isArray(e) && (!1 === p || !(Symbol.toStringTag in e))) return "Array";if ("object" == typeof window && null !== window) {if ("object" == typeof window.location && e === window.location) return "Location";if ("object" == typeof window.document && e === window.document) return "Document";if ("object" == typeof window.navigator) {if ("object" == typeof window.navigator.mimeTypes && e === window.navigator.mimeTypes) return "MimeTypeArray";if ("object" == typeof window.navigator.plugins && e === window.navigator.plugins) return "PluginArray";}if (("function" == typeof window.HTMLElement || "object" == typeof window.HTMLElement) && e instanceof window.HTMLElement) {if ("BLOCKQUOTE" === e.tagName) return "HTMLQuoteElement";if ("TD" === e.tagName) return "HTMLTableDataCellElement";if ("TH" === e.tagName) return "HTMLTableHeaderCellElement";}}var o = p && e[Symbol.toStringTag];if ("string" == typeof o) return o;var l = Object.getPrototypeOf(e);return l === RegExp.prototype ? "RegExp" : l === Date.prototype ? "Date" : n && l === Promise.prototype ? "Promise" : s && l === Set.prototype ? "Set" : i && l === Map.prototype ? "Map" : u && l === WeakSet.prototype ? "WeakSet" : a && l === WeakMap.prototype ? "WeakMap" : c && l === DataView.prototype ? "DataView" : i && l === d ? "Map Iterator" : s && l === g ? "Set Iterator" : m && l === y ? "Array Iterator" : v && l === _ ? "String Iterator" : null === l ? "Object" : Object.prototype.toString.call(e).slice(8, -1);});}),E = "undefined" != typeof window,k = "undefined" != typeof wx && "function" == typeof wx.getSystemInfoSync,w = E && window.navigator && window.navigator.userAgent || "",A = /AppleWebKit\/([\d.]+)/i.exec(w),R = (A && parseFloat(A.pop()), /iPad/i.test(w)),O = (/iPhone/i.test(w), /iPod/i.test(w), (M = w.match(/OS (\d+)_/i)) && M[1] && M[1], /Android/i.test(w)),L = function () {var e = w.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i);if (!e) return null;var t = e[1] && parseFloat(e[1]),n = e[2] && parseFloat(e[2]);return t && n ? parseFloat(e[1] + "." + e[2]) : t || null;}(),N = (O && /webkit/i.test(w), /Firefox/i.test(w), /Edge/i.test(w)),b = !N && /Chrome/i.test(w),P = (function () {var e = w.match(/Chrome\/(\d+)/);e && e[1] && parseFloat(e[1]);}(), /MSIE/.test(w)),G = (/MSIE\s8\.0/.test(w), function () {var e = /MSIE\s(\d+)\.\d/.exec(w),t = e && parseFloat(e[1]);return !t && /Trident\/7.0/i.test(w) && /rv:11.0/.test(w) && (t = 11), t;}()),q = (/Safari/i.test(w), /TBS\/\d+/i.test(w)),U = (function () {var e = w.match(/TBS\/(\d+)/i);if (e && e[1]) e[1];}(), !q && /MQQBrowser\/\d+/i.test(w), !q && / QQBrowser\/\d+/i.test(w), /(micromessenger|webbrowser)/i.test(w)),x = (/Windows/i.test(w), /MAC OS X/i.test(w), /MicroMessenger/i.test(w), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});S = "undefined" != typeof console ? console : void 0 !== x && x.console ? x.console : "undefined" != typeof window && window.console ? window.console : {};for (var F = function F() {}, H = ["assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "table", "time", "timeEnd", "timeStamp", "trace", "warn"], B = H.length; B--;) {D = H[B], console[D] || (S[D] = F);}S.methods = H;var K = S,V = 0,j = new Map();function $() {var e = new Date();return "TIM " + e.toLocaleTimeString("en-US", { hour12: !1 }) + "." + function (e) {var t;switch (e.toString().length) {case 1:t = "00" + e;break;case 2:t = "0" + e;break;default:t = e;}return t;}(e.getMilliseconds()) + ":";}var Y = { _data: [], _length: 0, _visible: !1, arguments2String: function arguments2String(e) {var t;if (1 === e.length) t = $() + e[0];else {t = $();for (var n = 0, r = e.length; n < r; n++) {te(e[n]) ? re(e[n]) ? t += ce(e[n]) : t += JSON.stringify(e[n]) : t += e[n], t += " ";}}return t;}, debug: function debug() {if (V <= -1) {var e = this.arguments2String(arguments);Y.record(e, "debug"), K.debug(e);}}, log: function log() {if (V <= 0) {var e = this.arguments2String(arguments);Y.record(e, "log"), K.log(e);}}, info: function info() {if (V <= 1) {var e = this.arguments2String(arguments);Y.record(e, "info"), K.info(e);}}, warn: function warn() {if (V <= 2) {var e = this.arguments2String(arguments);Y.record(e, "warn"), K.warn(e);}}, error: function error() {if (V <= 3) {var e = this.arguments2String(arguments);Y.record(e, "error"), K.error(e);}}, time: function time(e) {j.set(e, ae.now());}, timeEnd: function timeEnd(e) {if (j.has(e)) {var t = ae.now() - j.get(e);return j.delete(e), t;}return K.warn("未找到对应label: ".concat(e, ", 请在调用 logger.timeEnd 前，调用 logger.time")), 0;}, setLevel: function setLevel(e) {e < 4 && K.log($() + "set level from " + V + " to " + e), V = e;}, record: function record(e, t) {1100 === Y._length && (Y._data.splice(0, 100), Y._length = 1e3), Y._length++, Y._data.push("".concat(e, " [").concat(t, "] \n"));}, getLog: function getLog() {return Y._data;} },z = function z(e) {return "file" === oe(e);},W = function W(e) {return null !== e && ("number" == typeof e && !isNaN(e - 0) || "object" === n(e) && e.constructor === Number);},X = function X(e) {return "string" == typeof e;},J = function J(e) {return null !== e && "object" === n(e);},Q = function Q(e) {if ("object" !== n(e) || null === e) return !1;var t = Object.getPrototypeOf(e);if (null === t) return !0;for (var r = t; null !== Object.getPrototypeOf(r);) {r = Object.getPrototypeOf(r);}return t === r;},Z = function Z(e) {return "function" == typeof Array.isArray ? Array.isArray(e) : "array" === oe(e);},ee = function ee(e) {return void 0 === e;},te = function te(e) {return Z(e) || J(e);},ne = function ne(e) {return "function" == typeof e;},re = function re(e) {return e instanceof Error;},oe = function oe(e) {return Object.prototype.toString.call(e).match(/^\[object (.*)\]$/)[1].toLowerCase();},ie = function ie(e) {if ("string" != typeof e) return !1;var t = e[0];return !/[^a-zA-Z0-9]/.test(t);},se = 0;Date.now || (Date.now = function () {return new Date().getTime();});var ae = { now: function now() {0 === se && (se = Date.now() - 1);var e = Date.now() - se;return e > 4294967295 ? (se += 4294967295, Date.now() - se) : e;}, utc: function utc() {return Math.round(Date.now() / 1e3);} },ue = function e(t, n, r, o) {if (!te(t) || !te(n)) return 0;for (var i, s = 0, a = Object.keys(n), u = 0, c = a.length; u < c; u++) {if (i = a[u], !(ee(n[i]) || r && r.includes(i))) if (te(t[i]) && te(n[i])) s += e(t[i], n[i], r, o);else {if (o && o.includes(n[i])) continue;t[i] !== n[i] && (t[i] = n[i], s += 1);}}return s;},ce = function ce(e) {return JSON.stringify(e, ["message", "code"]);},le = function le() {var e = new Date(),t = e.toISOString(),n = e.getTimezoneOffset() / 60,r = "";return r = n < 0 ? n > -10 ? "+0" + Math.abs(100 * n) : "+" + Math.abs(100 * n) : n >= 10 ? "-" + 100 * n : "-0" + 100 * n, t.replace("Z", r);},pe = function pe(e) {if (0 === e.length) return 0;for (var t = 0, n = 0, r = "undefined" != typeof document && void 0 !== document.characterSet ? document.characterSet : "UTF-8"; void 0 !== e[t];) {n += e[t++].charCodeAt[t] <= 255 ? 1 : !1 === r ? 3 : 2;}return n;},he = function he(e) {var t = e || 99999999;return Math.round(Math.random() * t);},fe = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",ge = fe.length,de = function de(e, t) {for (var n in e) {if (e[n] === t) return !0;}return !1;},me = {},ye = function ye() {if (k) return "https:";var e = window.location.protocol;return ["http:", "https:"].indexOf(e) < 0 && (e = "http:"), e;},ve = function ve(e) {return -1 === e.indexOf("http://") || -1 === e.indexOf("https://") ? "https://" + e : e.replace(/https|http/, "https");};function _e(e, t) {Z(e) && Z(t) ? t.forEach(function (t) {var n = t.key,r = t.value,o = e.find(function (e) {return e.key === n;});o ? o.value = r : e.push({ key: n, value: r });}) : Y.warn("updateCustomField target 或 source 不是数组，忽略此次更新。");}var Ce = function Ce(e) {return e === t.GRP_PUBLIC;},Ie = function Ie(e) {return e === t.GRP_AVCHATROOM;},Me = function Me(e) {return X(e) && e === t.CONV_SYSTEM;};function Se(e, t) {var n = {};return Object.keys(e).forEach(function (r) {n[r] = t(e[r], r);}), n;}var De = Object.prototype.hasOwnProperty;function Te(e) {if (null == e) return !0;if ("boolean" == typeof e) return !1;if ("number" == typeof e) return 0 === e;if ("string" == typeof e) return 0 === e.length;if ("function" == typeof e) return 0 === e.length;if (Array.isArray(e)) return 0 === e.length;if (e instanceof Error) return "" === e.message;if (Q(e)) {for (var t in e) {if (De.call(e, t)) return !1;}return !0;}return !("map" !== oe(e) && !function (e) {return "set" === oe(e);}(e) && !z(e)) && 0 === e.size;}function Ee(e, t, n) {if (void 0 === t) return !0;var r = !0;if ("object" === T(t).toLowerCase()) Object.keys(t).forEach(function (o) {var i = 1 === e.length ? e[0][o] : void 0;r = !!ke(i, t[o], n, o) && r;});else if ("array" === T(t).toLowerCase()) for (var o = 0; o < t.length; o++) {r = !!ke(e[o], t[o], n, t[o].name) && r;}if (r) return r;throw new Error("Params validate failed.");}function ke(e, t, n, r) {if (void 0 === t) return !0;var o = !0;return t.required && Te(e) && (K.error("TIM [".concat(n, '] Missing required params: "').concat(r, '".')), o = !1), Te(e) || T(e).toLowerCase() === t.type.toLowerCase() || (K.error("TIM [".concat(n, '] Invalid params: type check failed for "').concat(r, '".Expected ').concat(t.type, ".")), o = !1), t.validator && !t.validator(e) && (K.error("TIM [".concat(n, "] Invalid params: custom validator check failed for params.")), o = !1), o;}var we = { SUCCESS: "JoinedSuccess", WAIT_APPROVAL: "WaitAdminApproval" },Ae = { SUCCESS: 0 },Re = { IS_LOGIN: 1, IS_NOT_LOGIN: 0 },Oe = { UNSEND: "unSend", SUCCESS: "success", FAIL: "fail" },Le = { NOT_START: "notStart", PENDING: "pengding", RESOLVED: "resolved", REJECTED: "rejected" },Ne = function () {function e(n) {r(this, e), this.type = t.MSG_TEXT, this.content = { text: n.text || "" };}return i(e, [{ key: "setText", value: function value(e) {this.content.text = e;} }, { key: "sendable", value: function value() {return 0 !== this.content.text.length;} }]), e;}(),be = { JSON: { TYPE: { C2C: { NOTICE: 1, COMMON: 9, EVENT: 10 }, GROUP: { COMMON: 3, TIP: 4, SYSTEM: 5, TIP2: 6 }, FRIEND: { NOTICE: 7 }, PROFILE: { NOTICE: 8 } }, SUBTYPE: { C2C: { COMMON: 0, READED: 92, KICKEDOUT: 96 }, GROUP: { COMMON: 0, LOVEMESSAGE: 1, TIP: 2, REDPACKET: 3 } }, OPTIONS: { GROUP: { JOIN: 1, QUIT: 2, KICK: 3, SET_ADMIN: 4, CANCEL_ADMIN: 5, MODIFY_GROUP_INFO: 6, MODIFY_MEMBER_INFO: 7 } } }, PROTOBUF: {}, IMAGE_TYPES: { ORIGIN: 1, LARGE: 2, SMALL: 3 }, IMAGE_FORMAT: { JPG: 1, JPEG: 1, GIF: 2, PNG: 3, BMP: 4, UNKNOWN: 255 } },Pe = 1,Ge = 2,qe = 3,Ue = 4,xe = 5,Fe = 7,He = 8,Be = 9,Ke = 10,Ve = 15,je = 255,$e = 2,Ye = 0,ze = 1,We = { NICK: "Tag_Profile_IM_Nick", GENDER: "Tag_Profile_IM_Gender", BIRTHDAY: "Tag_Profile_IM_BirthDay", LOCATION: "Tag_Profile_IM_Location", SELFSIGNATURE: "Tag_Profile_IM_SelfSignature", ALLOWTYPE: "Tag_Profile_IM_AllowType", LANGUAGE: "Tag_Profile_IM_Language", AVATAR: "Tag_Profile_IM_Image", MESSAGESETTINGS: "Tag_Profile_IM_MsgSettings", ADMINFORBIDTYPE: "Tag_Profile_IM_AdminForbidType", LEVEL: "Tag_Profile_IM_Level", ROLE: "Tag_Profile_IM_Role" },Xe = { UNKNOWN: "Gender_Type_Unknown", FEMALE: "Gender_Type_Female", MALE: "Gender_Type_Male" },Je = { NONE: "AdminForbid_Type_None", SEND_OUT: "AdminForbid_Type_SendOut" },Qe = { NEED_CONFIRM: "AllowType_Type_NeedConfirm", ALLOW_ANY: "AllowType_Type_AllowAny", DENY_ANY: "AllowType_Type_DenyAny" },Ze = function () {function e(n) {r(this, e), this._imageMemoryURL = "", this._file = n.file, k ? this.createImageDataASURLInWXMiniApp(n.file) : this.createImageDataASURLInWeb(n.file), this._initImageInfoModel(), this.type = t.MSG_IMAGE, this._percent = 0, this.content = { imageFormat: be.IMAGE_FORMAT[n.imageFormat] || be.IMAGE_FORMAT.UNKNOWN, uuid: n.uuid, imageInfoArray: [] }, this.initImageInfoArray(n.imageInfoArray), this._defaultImage = "http://imgcache.qq.com/open/qcloud/video/act/webim-images/default.jpg", this._autoFixUrl();}return i(e, [{ key: "_initImageInfoModel", value: function value() {var e = this;this._ImageInfoModel = function (t) {this.instanceID = he(9999999), this.sizeType = t.type || 0, this.size = t.size || 0, this.width = t.width || 0, this.height = t.height || 0, this.imageUrl = t.url || "", this.url = t.url || e._imageMemoryURL || e._defaultImage;}, this._ImageInfoModel.prototype = { setSizeType: function setSizeType(e) {this.sizeType = e;}, setImageUrl: function setImageUrl(e) {e && (this.imageUrl = e);}, getImageUrl: function getImageUrl() {return this.imageUrl;} };} }, { key: "initImageInfoArray", value: function value(e) {for (var t = 2, n = null, r = null; t >= 0;) {r = void 0 === e || void 0 === e[t] ? { type: 0, size: 0, width: 0, height: 0, url: "" } : e[t], (n = new this._ImageInfoModel(r)).setSizeType(t + 1), this.addImageInfo(n), t--;}} }, { key: "updateImageInfoArray", value: function value(e) {for (var t, n = this.content.imageInfoArray.length, r = 0; r < n; r++) {t = this.content.imageInfoArray[r], e.size && (t.size = e.size), e.url && t.setImageUrl(e.url), e.width && (t.width = e.width), e.height && (t.height = e.height);}} }, { key: "_autoFixUrl", value: function value() {for (var e = this.content.imageInfoArray.length, t = "", n = "", r = ["http", "https"], o = null, i = 0; i < e; i++) {this.content.imageInfoArray[i].url && "" !== (o = this.content.imageInfoArray[i]).imageUrl && (n = o.imageUrl.slice(0, o.imageUrl.indexOf("://") + 1), t = o.imageUrl.slice(o.imageUrl.indexOf("://") + 1), r.indexOf(n) < 0 && (n = "https:"), this.content.imageInfoArray[i].setImageUrl([n, t].join("")));}} }, { key: "updatePercent", value: function value(e) {this._percent = e, this._percent > 1 && (this._percent = 1);} }, { key: "updateImageFormat", value: function value(e) {this.content.imageFormat = e;} }, { key: "createImageDataASURLInWeb", value: function value(e) {void 0 !== e && e.files.length > 0 && (this._imageMemoryURL = window.URL.createObjectURL(e.files[0]));} }, { key: "createImageDataASURLInWXMiniApp", value: function value(e) {e && e.url && (this._imageMemoryURL = e.url);} }, { key: "replaceImageInfo", value: function value(e, t) {this.content.imageInfoArray[t] instanceof this._ImageInfoModel || (this.content.imageInfoArray[t] = e);} }, { key: "addImageInfo", value: function value(e) {this.content.imageInfoArray.length >= 3 || this.content.imageInfoArray.push(e);} }, { key: "sendable", value: function value() {return 0 !== this.content.imageInfoArray.length && "" !== this.content.imageInfoArray[0].imageUrl && 0 !== this.content.imageInfoArray[0].size;} }]), e;}(),et = function () {function e(n) {r(this, e), this.type = t.MSG_FACE, this.content = n || null;}return i(e, [{ key: "sendable", value: function value() {return null !== this.content;} }]), e;}(),tt = function () {function e(n) {r(this, e), this.type = t.MSG_AUDIO, this._percent = 0, this.content = { downloadFlag: 2, second: n.second, size: n.size, url: n.url, remoteAudioUrl: "", uuid: n.uuid };}return i(e, [{ key: "updatePercent", value: function value(e) {this._percent = e, this._percent > 1 && (this._percent = 1);} }, { key: "updateAudioUrl", value: function value(e) {this.content.remoteAudioUrl = e;} }, { key: "sendable", value: function value() {return "" !== this.content.remoteAudioUrl;} }]), e;}(),nt = { from: !0, groupID: !0, groupName: !0, to: !0 },rt = function () {function e(n) {r(this, e), this.type = t.MSG_GRP_TIP, this.content = {}, this._initContent(n);}return i(e, [{ key: "_initContent", value: function value(e) {var t = this;Object.keys(e).forEach(function (n) {switch (n) {case "remarkInfo":break;case "groupProfile":t.content.groupProfile = {}, t._initGroupProfile(e[n]);break;case "operatorInfo":case "memberInfoList":break;case "msgMemberInfo":t.content.memberList = e[n], Object.defineProperty(t.content, "msgMemberInfo", { get: function get() {return Y.warn("!!! 禁言的群提示消息中的 payload.msgMemberInfo 属性即将废弃，请使用 payload.memberList 属性替代。 \n", "msgMemberInfo 中的 shutupTime 属性对应更改为 memberList 中的 muteTime 属性，表示禁言时长。 \n", "参考：群提示消息 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/Message.html#.GroupTipPayload"), t.content.memberList.map(function (e) {return { userID: e.userID, shutupTime: e.muteTime };});} });break;default:t.content[n] = e[n];}}), this.content.userIDList || (this.content.userIDList = [this.content.operatorID]);} }, { key: "_initGroupProfile", value: function value(e) {for (var t = Object.keys(e), n = 0; n < t.length; n++) {var r = t[n];nt[r] && (this.content.groupProfile[r] = e[r]);}} }]), e;}(),ot = { from: !0, groupID: !0, name: !0, to: !0 },it = function () {function e(n) {r(this, e), this.type = t.MSG_GRP_SYS_NOTICE, this.content = {}, this._initContent(n);}return i(e, [{ key: "_initContent", value: function value(e) {var t = this;Object.keys(e).forEach(function (n) {switch (n) {case "memberInfoList":break;case "remarkInfo":t.content.handleMessage = e[n];break;case "groupProfile":t.content.groupProfile = {}, t._initGroupProfile(e[n]);break;default:t.content[n] = e[n];}});} }, { key: "_initGroupProfile", value: function value(e) {for (var t = Object.keys(e), n = 0; n < t.length; n++) {var r = t[n];ot[r] && (this.content.groupProfile[r] = e[r]);}} }]), e;}(),st = { 70001: "UserSig 已过期，请重新生成。建议 UserSig 有效期设置不小于24小时。", 70002: "UserSig 长度为0，请检查传入的 UserSig 是否正确。", 70003: "UserSig 非法，请使用官网提供的 API 重新生成 UserSig(https://cloud.tencent.com/document/product/269/32688)。", 70005: "UserSig 非法，请使用官网提供的 API 重新生成 UserSig(https://cloud.tencent.com/document/product/269/32688)。", 70009: "UserSig 验证失败，可能因为生成 UserSig 时混用了其他 SDKAppID 的私钥或密钥导致，请使用对应 SDKAppID 下的私钥或密钥重新生成 UserSig(https://cloud.tencent.com/document/product/269/32688)。", 70013: "请求中的 UserID 与生成 UserSig 时使用的 UserID 不匹配，您可以在即时通信 IM 控制台的【开发辅助工具(https://console.cloud.tencent.com/im-detail/tool-usersig)】页面校验 UserSig。", 70014: "请求中的 SDKAppID 与生成 UserSig 时使用的 SDKAppID 不匹配，您可以在即时通信 IM 控制台的【开发辅助工具(https://console.cloud.tencent.com/im-detail/tool-usersig)】页面校验 UserSig。", 70016: "密钥不存在，UserSig 验证失败，请在即时通信 IM 控制台获取密钥(https://cloud.tencent.com/document/product/269/32578#.E8.8E.B7.E5.8F.96.E5.AF.86.E9.92.A5)。", 70020: "SDKAppID 未找到，请在即时通信 IM 控制台确认应用信息。", 70050: "UserSig 验证次数过于频繁。请检查 UserSig 是否正确，并于1分钟后重新验证。您可以在即时通信 IM 控制台的【开发辅助工具(https://console.cloud.tencent.com/im-detail/tool-usersig)】页面校验 UserSig。", 70051: "帐号被拉入黑名单。", 70052: "UserSig 已经失效，请重新生成，再次尝试。", 70107: "因安全原因被限制登录，请不要频繁登录。", 70169: "请求的用户帐号不存在。", 70114: "服务端内部超时，请稍后重试。", 70202: "服务端内部超时，请稍后重试。", 70206: "请求中批量数量不合法。", 70402: "参数非法，请检查必填字段是否填充，或者字段的填充是否满足协议要求。", 70403: "请求失败，需要 App 管理员权限。", 70398: "帐号数超限。如需创建多于100个帐号，请将应用升级为专业版，具体操作指引请参见购买指引(https://cloud.tencent.com/document/product/269/32458)。", 70500: "服务端内部错误，请稍后重试。", 71e3: "删除帐号失败。仅支持删除体验版帐号，您当前应用为专业版，暂不支持帐号删除。", 20001: "请求包非法。", 20002: "UserSig 或 A2 失效。", 20003: "消息发送方或接收方 UserID 无效或不存在，请检查 UserID 是否已导入即时通信 IM。", 20004: "网络异常，请重试。", 20005: "服务端内部错误，请重试。", 20006: "触发发送单聊消息之前回调，App 后台返回禁止下发该消息。", 20007: "发送单聊消息，被对方拉黑，禁止发送。消息发送状态默认展示为失败，您可以登录控制台修改该场景下的消息发送状态展示结果，具体操作请参见消息保留设置(https://cloud.tencent.com/document/product/269/38656)。", 20009: "消息发送双方互相不是好友，禁止发送（配置单聊消息校验好友关系才会出现）。", 20010: "发送单聊消息，自己不是对方的好友（单向关系），禁止发送。", 20011: "发送单聊消息，对方不是自己的好友（单向关系），禁止发送。", 20012: "发送方被禁言，该条消息被禁止发送。", 20016: "消息撤回超过了时间限制（默认2分钟）。", 20018: "删除漫游内部错误。", 90001: "JSON 格式解析失败，请检查请求包是否符合 JSON 规范。", 90002: "JSON 格式请求包中 MsgBody 不符合消息格式描述，或者 MsgBody 不是 Array 类型，请参考 TIMMsgElement 对象的定义(https://cloud.tencent.com/document/product/269/2720#.E6.B6.88.E6.81.AF.E5.85.83.E7.B4.A0-timmsgelement)。", 90003: "JSON 格式请求包体中缺少 To_Account 字段或者 To_Account 帐号不存在。", 90005: "JSON 格式请求包体中缺少 MsgRandom 字段或者 MsgRandom 字段不是 Integer 类型。", 90006: "JSON 格式请求包体中缺少 MsgTimeStamp 字段或者 MsgTimeStamp 字段不是 Integer 类型。", 90007: "JSON 格式请求包体中 MsgBody 类型不是 Array 类型，请将其修改为 Array 类型。", 90008: "JSON 格式请求包体中缺少 From_Account 字段或者 From_Account 帐号不存在。", 90009: "请求需要 App 管理员权限。", 90010: "JSON 格式请求包不符合消息格式描述，请参考 TIMMsgElement 对象的定义(https://cloud.tencent.com/document/product/269/2720#.E6.B6.88.E6.81.AF.E5.85.83.E7.B4.A0-timmsgelement)。", 90011: "批量发消息目标帐号超过500，请减少 To_Account 中目标帐号数量。", 90012: "To_Account 没有注册或不存在，请确认 To_Account 是否导入即时通信 IM 或者是否拼写错误。", 90026: "消息离线存储时间错误（最多不能超过7天）。", 90031: "JSON 格式请求包体中 SyncOtherMachine 字段不是 Integer 类型。", 90044: "JSON 格式请求包体中 MsgLifeTime 字段不是 Integer 类型。", 90048: "请求的用户帐号不存在。", 90054: "撤回请求中的 MsgKey 不合法。", 90994: "服务内部错误，请重试。", 90995: "服务内部错误，请重试。", 91e3: "服务内部错误，请重试。", 90992: "服务内部错误，请重试；如果所有请求都返回该错误码，且 App 配置了第三方回调，请检查 App 服务端是否正常向即时通信 IM 后台服务端返回回调结果。", 93e3: "JSON 数据包超长，消息包体请不要超过8k。", 91101: "Web 端长轮询被踢（Web 端同时在线实例个数超出限制）。", 10002: "服务端内部错误，请重试。", 10003: "请求中的接口名称错误，请核对接口名称并重试。", 10004: "参数非法，请根据错误描述检查请求是否正确。", 10005: "请求包体中携带的帐号数量过多。", 10006: "操作频率限制，请尝试降低调用的频率。", 10007: "操作权限不足，例如 Public 群组中普通成员尝试执行踢人操作，但只有 App 管理员才有权限。", 10008: "请求非法，可能是请求中携带的签名信息验证不正确，请再次尝试。", 10009: "该群不允许群主主动退出。", 10010: "群组不存在，或者曾经存在过，但是目前已经被解散。", 10011: "解析 JSON 包体失败，请检查包体的格式是否符合 JSON 格式。", 10012: "发起操作的 UserID 非法，请检查发起操作的用户 UserID 是否填写正确。", 10013: "被邀请加入的用户已经是群成员。", 10014: "群已满员，无法将请求中的用户加入群组，如果是批量加人，可以尝试减少加入用户的数量。", 10015: "群组 ID 非法，请检查群组 ID 是否填写正确。", 10016: "App 后台通过第三方回调拒绝本次操作。", 10017: "因被禁言而不能发送消息，请检查发送者是否被设置禁言。", 10018: "应答包长度超过最大包长（1MB），请求的内容过多，请尝试减少单次请求的数据量。", 10019: "请求的用户帐号不存在。", 10021: "群组 ID 已被使用，请选择其他的群组 ID。", 10023: "发消息的频率超限，请延长两次发消息时间的间隔。", 10024: "此邀请或者申请请求已经被处理。", 10025: "群组 ID 已被使用，并且操作者为群主，可以直接使用。", 10026: "该 SDKAppID 请求的命令字已被禁用。", 10030: "请求撤回的消息不存在。", 10031: "消息撤回超过了时间限制（默认2分钟）。", 10032: "请求撤回的消息不支持撤回操作。", 10033: "群组类型不支持消息撤回操作。", 10034: "该消息类型不支持删除操作。", 10035: "音视频聊天室和在线成员广播大群不支持删除消息。", 10036: "音视频聊天室创建数量超过了限制，请参考价格说明(https://cloud.tencent.com/document/product/269/11673)购买预付费套餐“IM音视频聊天室”。", 10037: "单个用户可创建和加入的群组数量超过了限制，请参考价格说明(https://cloud.tencent.com/document/product/269/11673)购买或升级预付费套餐“单人可创建与加入群组数”。", 10038: "群成员数量超过限制，请参考价格说明(https://cloud.tencent.com/document/product/269/11673)购买或升级预付费套餐“扩展群人数上限”。", 10041: "该应用（SDKAppID）已配置不支持群消息撤回。" },at = function (e) {function t(e) {var n;return r(this, t), (n = m(this, l(t).call(this))).code = e.code, n.message = st[e.code] || e.message, n.data = e.data || {}, n;}return c(t, e), t;}(g(Error)),ut = 2e3,ct = 2001,lt = 2002,pt = 2003,ht = 2022,ft = 2023,gt = 2040,dt = 2100,mt = 2103,yt = 2105,vt = 2106,_t = 2108,Ct = 2109,It = 2110,Mt = 2251,St = 2252,Dt = 2253,Tt = 2300,Et = 2301,kt = 2350,wt = 2351,At = 2352,Rt = 2400,Ot = 2401,Lt = 2402,Nt = 2403,bt = 2500,Pt = 2501,Gt = 2502,qt = 2600,Ut = 2601,xt = 2620,Ft = 2621,Ht = 2622,Bt = 2660,Kt = 2661,Vt = 2662,jt = 2680,$t = 2681,Yt = 2682,zt = 2683,Wt = 2684,Xt = 2685,Jt = 2700,Qt = 2721,Zt = 2722,en = 2740,tn = 2741,nn = 2742,rn = 2800,on = 2801,sn = 2802,an = 2803,un = 2804,cn = 2805,ln = 2900,pn = 2901,hn = 2902,fn = 2903,gn = 2904,dn = 2999,mn = 91101,yn = 20002,vn = 70001,_n = "无 SDKAppID",Cn = "无 accountType",In = "无 userID",Mn = "无 userSig",Sn = "无 tinyID",Dn = "无 a2key",Tn = "未检测到 COS 上传插件",En = "消息发送失败",kn = "MessageController.constructor() 需要参数 options",wn = "需要 Message 的实例",An = 'Message.conversationType 只能为 "C2C" 或 "GROUP"',Rn = "无法发送空文件",On = "回调函数运行时遇到错误，请检查接入侧代码",Ln = "消息撤回失败",Nn = "请先选择一个图片",bn = "只允许上传 jpg png jpeg gif 格式的图片",Pn = "图片大小超过20M，无法发送",Gn = "语音上传失败",qn = "语音大小大于20M，无法发送",Un = "视频上传失败",xn = "视频大小超过20M，无法发送",Fn = "只允许上传 mp4 格式的视频",Hn = "文件上传失败",Bn = "请先选择一个文件",Kn = "文件大小超过100M，无法发送 ",Vn = "缺少必要的参数文件 URL",jn = "没有找到相应的会话，请检查传入参数",$n = "没有找到相应的用户或群组，请检查传入参数",Yn = "未记录的会话类型",zn = "非法的群类型，请检查传入参数",Wn = "不能加入 Private 类型的群组",Xn = "AVChatRoom 类型的群组不能转让群主",Jn = "不能把群主转让给自己",Qn = "不能解散 Private 类型的群组",Zn = "加群失败，请检查传入参数或重试",er = "AVChatRoom 类型的群不支持邀请群成员",tr = "非 AVChatRoom 类型的群组不允许匿名加群，请先登录后再加群",nr = "不能在 AVChatRoom 类型的群组踢人",rr = "你不是群主，只有群主才有权限操作",or = "不能在 Private / AVChatRoom 类型的群中设置群成员身份",ir = "不合法的群成员身份，请检查传入参数",sr = "不能设置自己的群成员身份，请检查传入参数",ar = "不能将自己禁言，请检查传入参数",ur = "传入 deleteFriend 接口的参数无效",cr = "传入 updateMyProfile 接口的参数无效",lr = "updateMyProfile 无标配资料字段或自定义资料字段",pr = "传入 addToBlacklist 接口的参数无效",hr = "传入 removeFromBlacklist 接口的参数无效",fr = "不能拉黑自己",gr = "网络层初始化错误，缺少 URL 参数",dr = "打包错误，未定义的 serverName",mr = "未定义的 packageConfig",yr = "未连接到网络",vr = "不规范的参数名称",_r = "意料外的通知条件",Cr = "_syncOffset 丢失",Ir = "获取 longpolling id 失败",Mr = "接口需要 SDK 处于 ready 状态后才能调用",Sr = ["jpg", "jpeg", "gif", "png"],Dr = ["mp4"],Tr = function () {function e(n) {r(this, e);var o = this._check(n);if (o instanceof at) throw o;this.type = t.MSG_FILE, this._percent = 0;var i = this._getFileInfo(n);this.content = { downloadFlag: 2, fileUrl: n.url || "", uuid: n.uuid, fileName: i.name || "", fileSize: i.size || 0 };}return i(e, [{ key: "_getFileInfo", value: function value(e) {if (e.fileName && e.fileSize) return { size: e.fileSize, name: e.fileName };if (k) return {};var t = e.file.files[0];return { size: t.size, name: t.name, type: t.type.slice(t.type.lastIndexOf("/") + 1).toLowerCase() };} }, { key: "updatePercent", value: function value(e) {this._percent = e, this._percent > 1 && (this._percent = 1);} }, { key: "updateFileUrl", value: function value(e) {this.content.fileUrl = e;} }, { key: "_check", value: function value(e) {if (e.size > 104857600) return new at({ code: Lt, message: "".concat(Kn, ": ").concat(104857600, " bytes") });} }, { key: "sendable", value: function value() {return "" !== this.content.fileUrl && "" !== this.content.fileName && 0 !== this.content.fileSize;} }]), e;}(),Er = function () {function e(n) {r(this, e), this.type = t.MSG_CUSTOM, this.content = { data: n.data || "", description: n.description || "", extension: n.extension || "" };}return i(e, [{ key: "setData", value: function value(e) {return this.content.data = e, this;} }, { key: "setDescription", value: function value(e) {return this.content.description = e, this;} }, { key: "setExtension", value: function value(e) {return this.content.extension = e, this;} }, { key: "sendable", value: function value() {return 0 !== this.content.data.length || 0 !== this.content.description.length || 0 !== this.content.extension.length;} }]), e;}(),kr = function () {function e(n) {r(this, e), this.type = t.MSG_VIDEO, this._percent = 0, this.content = { remoteVideoUrl: n.remoteVideoUrl, videoFormat: n.videoFormat, videoSecond: parseInt(n.videoSecond, 10), videoSize: n.videoSize, videoUrl: n.videoUrl, videoDownloadFlag: 2, videoUUID: n.videoUUID, thumbUUID: n.thumbUUID, thumbFormat: n.thumbFormat, thumbWidth: n.thumbWidth, thumbHeight: n.thumbHeight, thumbSize: n.thumbSize, thumbDownloadFlag: 2, thumbUrl: n.thumbUrl };}return i(e, [{ key: "updatePercent", value: function value(e) {this._percent = e, this._percent > 1 && (this._percent = 1);} }, { key: "updateVideoUrl", value: function value(e) {e && (this.content.remoteVideoUrl = e);} }, { key: "sendable", value: function value() {return "" !== this.content.remoteVideoUrl;} }]), e;}(),wr = function e(n) {r(this, e), this.type = t.MSG_GEO, this.content = n;},Ar = { 1: t.MSG_PRIORITY_HIGH, 2: t.MSG_PRIORITY_NORMAL, 3: t.MSG_PRIORITY_LOW, 4: t.MSG_PRIORITY_LOWEST },Rr = function () {function e(n) {r(this, e), this.ID = "", this.conversationID = n.conversationID || null, this.conversationType = n.conversationType || t.CONV_C2C, this.conversationSubType = n.conversationSubType, this.time = n.time || Math.ceil(Date.now() / 1e3), this.sequence = n.sequence || 0, this.clientSequence = n.clientSequence || n.sequence || 0, this.random = n.random || he(), this.priority = this._computePriority(n.priority), this._elements = [], this.isPlaceMessage = n.isPlaceMessage || 0, this.isRevoked = 2 === n.isPlaceMessage || 8 === n.msgFlagBits, this.geo = {}, this.from = n.from || null, this.to = n.to || null, this.flow = "", this.isSystemMessage = n.isSystemMessage || !1, this.protocol = n.protocol || "JSON", this.isResend = !1, this.isRead = !1, this.status = n.status || Oe.SUCCESS, this.reInitialize(n.currentUser), this.extractGroupInfo(n.groupProfile || null);}return i(e, [{ key: "getElements", value: function value() {return this._elements;} }, { key: "extractGroupInfo", value: function value(e) {if (null !== e) {var t = e.messageFromAccountExtraInformation;this.nick = "", "string" == typeof e.fromAccountNick && (this.nick = e.fromAccountNick), this.avatar = "", "string" == typeof e.fromAccountHeadurl && (this.avatar = e.fromAccountHeadurl), this.nameCard = "", "object" === n(t) && t.nameCard && (this.nameCard = t.nameCard);}} }, { key: "_initProxy", value: function value() {this.payload = this._elements[0].content, this.type = this._elements[0].type;} }, { key: "reInitialize", value: function value(e) {e && (this.status = this.from ? Oe.SUCCESS : Oe.UNSEND, !this.from && (this.from = e)), this._initFlow(e), this._initielizeSequence(e), this._concactConversationID(e), this.generateMessageID(e);} }, { key: "isSendable", value: function value() {return 0 !== this._elements.length && ("function" != typeof this._elements[0].sendable ? (Y.warn("".concat(this._elements[0].type, ' need "boolean : sendable()" method')), !1) : this._elements[0].sendable());} }, { key: "_initTo", value: function value(e) {this.conversationType === t.CONV_GROUP && (this.to = e.groupID);} }, { key: "_initielizeSequence", value: function value(e) {0 === this.clientSequence && e && (this.clientSequence = function (e) {if (!e) return Y.error("autoincrementIndex(string: key) need key parameter"), !1;if (void 0 === me[e]) {var t = new Date(),n = "3".concat(t.getHours()).slice(-2),r = "0".concat(t.getMinutes()).slice(-2),o = "0".concat(t.getSeconds()).slice(-2);me[e] = parseInt([n, r, o, "0001"].join("")), n = null, r = null, o = null, Y.warn("utils.autoincrementIndex() create new sequence : ".concat(e, " = ").concat(me[e]));}return me[e]++;}(e)), 0 === this.sequence && this.conversationType === t.CONV_C2C && (this.sequence = this.clientSequence);} }, { key: "generateMessageID", value: function value(e) {var t = e === this.from ? 1 : 0,n = this.sequence > 0 ? this.sequence : this.clientSequence;this.ID = "".concat(this.conversationID, "-").concat(n, "-").concat(this.random, "-").concat(t);} }, { key: "_initFlow", value: function value(e) {"" !== e && (e === this.from ? (this.flow = "out", this.isRead = !0) : this.flow = "in");} }, { key: "_concactConversationID", value: function value(e) {var n = this.to,r = "",o = this.conversationType;o !== t.CONV_SYSTEM ? (r = o === t.CONV_C2C ? e === this.from ? n : this.from : this.to, this.conversationID = "".concat(o).concat(r)) : this.conversationID = t.CONV_SYSTEM;} }, { key: "isElement", value: function value(e) {return e instanceof Ne || e instanceof Ze || e instanceof et || e instanceof tt || e instanceof Tr || e instanceof kr || e instanceof rt || e instanceof it || e instanceof Er || e instanceof wr;} }, { key: "setElement", value: function value(e) {var n = this;if (this.isElement(e)) return this._elements = [e], void this._initProxy();var r = function r(e) {switch (e.type) {case t.MSG_TEXT:n.setTextElement(e.content);break;case t.MSG_IMAGE:n.setImageElement(e.content);break;case t.MSG_AUDIO:n.setAudioElement(e.content);break;case t.MSG_FILE:n.setFileElement(e.content);break;case t.MSG_VIDEO:n.setVideoElement(e.content);break;case t.MSG_CUSTOM:n.setCustomElement(e.content);break;case t.MSG_GEO:n.setGEOElement(e.content);break;case t.MSG_GRP_TIP:n.setGroupTipElement(e.content);break;case t.MSG_GRP_SYS_NOTICE:n.setGroupSystemNoticeElement(e.content);break;case t.MSG_FACE:n.setFaceElement(e.content);break;default:Y.warn(e.type, e.content, "no operation......");}};if (Array.isArray(e)) for (var o = 0; o < e.length; o++) {r(e[o]);} else r(e);this._initProxy();} }, { key: "setTextElement", value: function value(e) {var t = "string" == typeof e ? e : e.text,n = new Ne({ text: t });this._elements.push(n);} }, { key: "setImageElement", value: function value(e) {var t = new Ze(e);this._elements.push(t);} }, { key: "setAudioElement", value: function value(e) {var t = new tt(e);this._elements.push(t);} }, { key: "setFileElement", value: function value(e) {var t = new Tr(e);this._elements.push(t);} }, { key: "setVideoElement", value: function value(e) {var t = new kr(e);this._elements.push(t);} }, { key: "setGEOElement", value: function value(e) {var t = new wr(e);this._elements.push(t);} }, { key: "setCustomElement", value: function value(e) {var t = new Er(e);this._elements.push(t);} }, { key: "setGroupTipElement", value: function value(e) {var t = new rt(e);this._elements.push(t);} }, { key: "setGroupSystemNoticeElement", value: function value(e) {var t = new it(e);this._elements.push(t);} }, { key: "setFaceElement", value: function value(e) {var t = new et(e);this._elements.push(t);} }, { key: "setIsRead", value: function value(e) {this.isRead = e;} }, { key: "_computePriority", value: function value(e) {if (ee(e)) return t.MSG_PRIORITY_NORMAL;if (X(e) && -1 !== Object.values(Ar).indexOf(e)) return e;if (W(e)) {var n = "" + e;if (-1 !== Object.keys(Ar).indexOf(n)) return Ar[n];}return t.MSG_PRIORITY_NORMAL;} }, { key: "elements", get: function get() {return Y.warn("！！！Message 实例的 elements 属性即将废弃，请尽快修改。使用 type 和 payload 属性处理单条消息，兼容组合消息使用 _elements 属性！！！"), this._elements;} }]), e;}(),Or = { login: { userID: { type: "String", required: !0 }, userSig: { type: "String", required: !0 } }, addToBlacklist: { userIDList: { type: "Array", required: !0 } }, mutilParam: [{ name: "paramName", type: "Number", required: !0 }, { name: "paramName", type: "String", required: !0 }], on: [{ name: "eventName", type: "String", validator: function validator(e) {return "string" == typeof e && 0 !== e.length || (console.warn("on 接口的 eventName 参数必须是 String 类型，且不能为空。"), !1);} }, { name: "handler", type: "Function", validator: function validator(e) {return "function" != typeof e ? (console.warn("on 接口的 handler 参数必须是 Function 类型。"), !1) : ("" === e.name && console.warn("on 接口的 handler 参数推荐使用具名函数。具名函数可以使用 off 接口取消订阅，匿名函数无法取消订阅。"), !0);} }], once: [{ name: "eventName", type: "String", validator: function validator(e) {return "string" == typeof e && 0 !== e.length || (console.warn("once 接口的 eventName 参数必须是 String 类型，且不能为空。"), !1);} }, { name: "handler", type: "Function", validator: function validator(e) {return "function" != typeof e ? (console.warn("once 接口的 handler 参数必须是 Function 类型。"), !1) : ("" === e.name && console.warn("once 接口的 handler 参数推荐使用具名函数。"), !0);} }], off: [{ name: "eventName", type: "String", validator: function validator(e) {return "string" == typeof e && 0 !== e.length || (console.warn("off 接口的 eventName 参数必须是 String 类型，且不能为空。"), !1);} }, { name: "handler", type: "Function", validator: function validator(e) {return "function" != typeof e ? (console.warn("off 接口的 handler 参数必须是 Function 类型。"), !1) : ("" === e.name && console.warn("off 接口的 handler 参数为匿名函数，无法取消订阅。"), !0);} }], sendMessage: [{ name: "message", type: "Object", required: !0 }], getMessageList: { conversationID: { type: "String", required: !0 }, nextReqMessageID: { type: "String" }, count: { type: "Number", validator: function validator(e) {return !(!ee(e) && !/^[1-9][0-9]*$/.test(e)) || (console.warn("getMessageList 接口的 count 参数必须为正整数"), !1);} } }, getConversationProfile: [{ name: "conversationID", type: "String", required: !0, validator: function validator(e) {return !!e && (!!(X(n = e) && n.slice(0, 3) === t.CONV_C2C || function (e) {return X(e) && e.slice(0, 5) === t.CONV_GROUP;}(e) || Me(e)) || (console.warn("非法的会话 ID:".concat(e, "。会话 ID 组成方式：\n      C2C + userID（单聊）\n      GROUP + groupID（群聊）\n      @TIM#SYSTEM（系统通知会话）")), !1));var n;} }], deleteConversation: [{ name: "conversationID", type: "String", required: !0 }], getGroupList: { groupProfileFilter: { type: "Array" } }, getGroupProfile: { groupID: { type: "String", required: !0 }, groupCustomFieldFilter: { type: "Array" }, memberCustomFieldFilter: { type: "Array" } }, getGroupProfileAdvance: { groupIDList: { type: "Array", required: !0 } }, createGroup: { name: { type: "String", required: !0 } }, joinGroup: { groupID: { type: "String", required: !0 }, type: { type: "String" }, applyMessage: { type: "String" } }, quitGroup: [{ name: "groupID", type: "String", required: !0 }], handleApplication: { message: { type: "Object", required: !0 }, handleAction: { type: "String", required: !0 }, handleMessage: { type: "String" } }, changeGroupOwner: { groupID: { type: "String", required: !0 }, newOwnerID: { type: "String", required: !0 } }, updateGroupProfile: { groupID: { type: "String", required: !0 } }, dismissGroup: [{ name: "groupID", type: "String", required: !0 }], searchGroupByID: [{ name: "groupID", type: "String", required: !0 }], getGroupMemberList: { groupID: { type: "String", required: !0 }, offset: { type: "Number" }, count: { type: "Number" } }, getGroupMemberProfile: { groupID: { type: "String", required: !0 }, userIDList: { type: "Array", required: !0 }, memberCustomFieldFilter: { type: "Array" } }, addGroupMemeber: { groupID: { type: "String", required: !0 }, userIDList: { type: "Array", required: !0 } }, setGroupMemberRole: { groupID: { type: "String", required: !0 }, userID: { type: "String", required: !0 }, role: { type: "String", required: !0 } }, setGroupMemberMuteTime: { groupID: { type: "String", required: !0 }, userID: { type: "String", required: !0 }, muteTime: { type: "Number", validator: function validator(e) {return e >= 0;} } }, setGroupMemberNameCard: { groupID: { type: "String", required: !0 }, userID: { type: "String" }, nameCard: { type: "String", required: !0, validator: function validator(e) {return !0 !== /^\s+$/.test(e);} } }, setMessageRemindType: { groupID: { type: "String", required: !0 }, messageRemindType: { type: "String", required: !0 } }, setGroupMemberCustomField: { groupID: { type: "String", required: !0 }, userID: { type: "String" }, memberCustomField: { type: "Array", required: !0 } }, deleteGroupMember: { groupID: { type: "String", required: !0 } }, createTextMessage: { to: { type: "String", required: !0 }, conversationType: { type: "String", required: !0 }, payload: { type: "Object", required: !0, validator: function validator(e) {return X(e.text) ? 0 !== e.text.length || (console.warn("createTextMessage 消息内容不能为空。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createTextMessage"), !1) : (console.warn("createTextMessage payload.text 类型必须为字符串。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createTextMessage"), !1);} } }, createCustomMessage: { to: { type: "String", required: !0 }, conversationType: { type: "String", required: !0 }, payload: { type: "Object", required: !0 } }, createImageMessage: { to: { type: "String", required: !0 }, conversationType: { type: "String", required: !0 }, payload: { type: "Object", required: !0, validator: function validator(e) {if (ee(e.file)) return console.warn("createImageMessage payload.file 不能为 undefined。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createImageMessage"), !1;if (E) {if (!(e.file instanceof HTMLInputElement || z(e.file))) return console.warn("createImageMessage payload.file 的类型必须是 HTMLInputElement 或 File。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createImageMessage"), !1;if (e.file instanceof HTMLInputElement && 0 === e.file.files.length) return console.warn("createImageMessage 您没有选择文件，无法发送。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createImageMessage"), !1;}return !0;}, onProgress: { type: "Function", required: !1, validator: function validator(e) {return ee(e) && console.warn("createImageMessage 没有 onProgress 回调，您将无法获取图片上传进度。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createImageMessage"), !0;} } } }, createAudioMessage: { to: { type: "String", required: !0 }, conversationType: { type: "String", required: !0 }, payload: { type: "Object", required: !0 }, onProgress: { type: "Function", required: !1, validator: function validator(e) {return ee(e) && console.warn("createAudioMessage 没有 onProgress 回调，您将无法获取音频上传进度。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createAudioMessage"), !0;} } }, createVideoMessage: { to: { type: "String", required: !0 }, conversationType: { type: "String", required: !0 }, payload: { type: "Object", required: !0 }, onProgress: { type: "Function", required: !1, validator: function validator(e) {return ee(e) && console.warn("createVideoMessage 没有 onProgress 回调，您将无法获取视频上传进度。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createVideoMessage"), !0;} } }, createFaceMessage: { to: { type: "String", required: !0 }, conversationType: { type: "String", required: !0 }, payload: { type: "Object", required: !0, validator: function validator(e) {return !!Q(e) && (W(e.index) ? !!X(e.data) || (console.warn("createFaceMessage payload.data 类型必须为 String！"), !1) : (console.warn("createFaceMessage payload.index 类型必须为 Number！"), !1));} } }, createFileMessage: { to: { type: "String", required: !0 }, conversationType: { type: "String", required: !0 }, payload: { type: "Object", required: !0, validator: function validator(e) {if (ee(e.file)) return console.warn("createFileMessage payload.file 不能为 undefined。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createFileMessage"), !1;if (E) {if (!(e.file instanceof HTMLInputElement || z(e.file))) return console.warn("createFileMessage payload.file 的类型必须是 HTMLInputElement 或 File。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createFileMessage"), !1;if (e.file instanceof HTMLInputElement && 0 === e.file.files.length) return console.warn("createFileMessage 您没有选择文件，无法发送。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createFileMessage"), !1;}return !0;} }, onProgress: { type: "Function", required: !1, validator: function validator(e) {return ee(e) && console.warn("createFileMessage 没有 onProgress 回调，您将无法获取文件上传进度。请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#createFileMessage"), !0;} } }, revokeMessage: [{ name: "message", type: "Object", required: !0, validator: function validator(e) {return e instanceof Rr ? e.conversationType === t.CONV_SYSTEM ? (console.warn("revokeMessage 不能撤回系统会话消息，只能撤回单聊消息或群消息"), !1) : !0 !== e.isRevoked || (console.warn("revokeMessage 消息已经被撤回，请勿重复操作"), !1) : (console.warn("revokeMessage 参数 message 必须为 Message(https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/Message.html) 实例。"), !1);} }], getUserProfile: { userIDList: { type: "Array", validator: function validator(e) {return Z(e) ? (0 === e.length && console.warn("getUserProfile userIDList 不能为空数组，请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#getUserProfile"), !0) : (console.warn("getUserProfile userIDList 必须为数组，请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#getUserProfile"), !1);} } }, updateMyProfile: { profileCustomField: { type: "Array", validator: function validator(e) {return !!ee(e) || !!Z(e) || (console.warn("updateMyProfile profileCustomField 必须为数组，请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#updateMyProfile"), !1);} } } },Lr = { login: "login", logout: "logout", on: "on", once: "once", off: "off", setLogLevel: "setLogLevel", downloadLog: "downloadLog", registerPlugin: "registerPlugin", destroy: "destroy", createTextMessage: "createTextMessage", createImageMessage: "createImageMessage", createAudioMessage: "createAudioMessage", createVideoMessage: "createVideoMessage", createCustomMessage: "createCustomMessage", createFaceMessage: "createFaceMessage", createFileMessage: "createFileMessage", sendMessage: "sendMessage", resendMessage: "resendMessage", getMessageList: "getMessageList", setMessageRead: "setMessageRead", revokeMessage: "revokeMessage", getConversationList: "getConversationList", getConversationProfile: "getConversationProfile", deleteConversation: "deleteConversation", getGroupList: "getGroupList", getGroupProfile: "getGroupProfile", createGroup: "createGroup", joinGroup: "joinGroup", updateGroupProfile: "updateGroupProfile", quitGroup: "quitGroup", dismissGroup: "dismissGroup", changeGroupOwner: "changeGroupOwner", searchGroupByID: "searchGroupByID", setMessageRemindType: "setMessageRemindType", handleGroupApplication: "handleGroupApplication", getGroupMemberProfile: "getGroupMemberProfile", getGroupMemberList: "getGroupMemberList", addGroupMember: "addGroupMember", deleteGroupMember: "deleteGroupMember", setGroupMemberNameCard: "setGroupMemberNameCard", setGroupMemberMuteTime: "setGroupMemberMuteTime", setGroupMemberRole: "setGroupMemberRole", setGroupMemberCustomField: "setGroupMemberCustomField", getMyProfile: "getMyProfile", getUserProfile: "getUserProfile", updateMyProfile: "updateMyProfile", getBlacklist: "getBlacklist", addToBlacklist: "addToBlacklist", removeFromBlacklist: "removeFromBlacklist", getFriendList: "getFriendList" },Nr = "1.7.3",br = "537048168",Pr = "10",Gr = "protobuf",qr = "json",Ur = { HOST: { TYPE: 3, ACCESS_LAYER_TYPES: { SANDBOX: 1, TEST: 2, PRODUCTION: 3 }, CURRENT: { COMMON: "https://webim.tim.qq.com", PIC: "https://pic.tim.qq.com", COS: "https://yun.tim.qq.com" }, PRODUCTION: { COMMON: "https://webim.tim.qq.com", PIC: "https://pic.tim.qq.com", COS: "https://yun.tim.qq.com" }, SANDBOX: { COMMON: "https://events.tim.qq.com", PIC: "https://pic.tim.qq.com", COS: "https://yun.tim.qq.com" }, TEST: { COMMON: "https://test.tim.qq.com", PIC: "https://pic.tim.qq.com", COS: "https://yun.tim.qq.com" }, setCurrent: function setCurrent() {var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 3;switch (e) {case this.ACCESS_LAYER_TYPES.SANDBOX:this.CURRENT = this.SANDBOX, this.TYPE = this.ACCESS_LAYER_TYPES.SANDBOX;break;case this.ACCESS_LAYER_TYPES.TEST:this.CURRENT = this.TEST, this.TYPE = this.ACCESS_LAYER_TYPES.TEST;break;default:this.CURRENT = this.PRODUCTION, this.TYPE = this.ACCESS_LAYER_TYPES.PRODUCTION;}} }, NAME: { OPEN_IM: "openim", GROUP: "group_open_http_svc", FRIEND: "sns", PROFILE: "profile", RECENT_CONTACT: "recentcontact", PIC: "openpic", BIG_GROUP_NO_AUTH: "group_open_http_noauth_svc", BIG_GROUP_LONG_POLLING_NO_AUTH: "group_open_long_polling_http_noauth_svc", IM_OPEN_STAT: "imopenstat", WEB_IM: "webim", IM_COS_SIGN: "im_cos_sign_svr" }, CMD: { ACCESS_LAYER: "accesslayer", LOGIN: "login", LOGOUT_LONG_POLL: "longpollinglogout", LOGOUT_ALL: "logout", PORTRAIT_GET: "portrait_get_all", PORTRAIT_SET: "portrait_set", GET_LONG_POLL_ID: "getlongpollingid", LONG_POLL: "longpolling", AVCHATROOM_LONG_POLL: "get_msg", FRIEND_ADD: "friend_add", FRIEND_GET_ALL: "friend_get_all", FRIEND_DELETE: "friend_delete", RESPONSE_PENDENCY: "friend_response", GET_PENDENCY: "pendency_get", DELETE_PENDENCY: "pendency_delete", GET_GROUP_PENDENCY: "get_pendency", GET_BLACKLIST: "black_list_get", ADD_BLACKLIST: "black_list_add", DELETE_BLACKLIST: "black_list_delete", CREATE_GROUP: "create_group", GET_JOINED_GROUPS: "get_joined_group_list", SEND_MESSAGE: "sendmsg", REVOKE_C2C_MESSAGE: "msgwithdraw", SEND_GROUP_MESSAGE: "send_group_msg", REVOKE_GROUP_MESSAGE: "group_msg_recall", GET_GROUP_INFO: "get_group_info", GET_GROUP_MEMBER_INFO: "get_specified_group_member_info", GET_GROUP_MEMBER_LIST: "get_group_member_info", QUIT_GROUP: "quit_group", CHANGE_GROUP_OWNER: "change_group_owner", DESTROY_GROUP: "destroy_group", ADD_GROUP_MEMBER: "add_group_member", DELETE_GROUP_MEMBER: "delete_group_member", SEARCH_GROUP_BY_ID: "get_group_public_info", APPLY_JOIN_GROUP: "apply_join_group", HANDLE_APPLY_JOIN_GROUP: "handle_apply_join_group", MODIFY_GROUP_INFO: "modify_group_base_info", MODIFY_GROUP_MEMBER_INFO: "modify_group_member_info", DELETE_GROUP_SYSTEM_MESSAGE: "deletemsg", GET_CONVERSATION_LIST: "get", PAGING_GET_CONVERSATION_LIST: "page_get", DELETE_CONVERSATION: "delete", GET_MESSAGES: "getmsg", GET_C2C_ROAM_MESSAGES: "getroammsg", GET_GROUP_ROAM_MESSAGES: "group_msg_get", SET_C2C_MESSAGE_READ: "msgreaded", SET_GROUP_MESSAGE_READ: "msg_read_report", FILE_READ_AND_WRITE_AUTHKEY: "authkey", FILE_UPLOAD: "pic_up", COS_SIGN: "cos", TIM_WEB_REPORT: "tim_web_report", BIG_DATA_HALLWAY_AUTH_KEY: "authkey" }, CHANNEL: { SOCKET: 1, XHR: 2, AUTO: 0 }, NAME_VERSION: { openim: "v4", group_open_http_svc: "v4", sns: "v4", profile: "v4", recentcontact: "v4", openpic: "v4", group_open_http_noauth_svc: "v1", group_open_long_polling_http_noauth_svc: "v1", imopenstat: "v4", im_cos_sign_svr: "v4", webim: "v4" } };Ur.HOST.setCurrent(Ur.HOST.ACCESS_LAYER_TYPES.PRODUCTION);var xr = { request: { toAccount: "To_Account", fromAccount: "From_Account", to: "To_Account", from: "From_Account", groupID: "GroupId", avatar: "FaceUrl" }, response: { GroupId: "groupID", Member_Account: "userID", MsgList: "messageList", SyncFlag: "syncFlag", To_Account: "to", From_Account: "from", MsgSeq: "sequence", MsgRandom: "random", MsgTimeStamp: "time", MsgContent: "content", MsgBody: "elements", GroupWithdrawInfoArray: "revokedInfos", WithdrawC2cMsgNotify: "c2cMessageRevokedNotify", C2cWithdrawInfoArray: "revokedInfos", MsgRand: "random", MsgType: "type", MsgShow: "messageShow", NextMsgSeq: "nextMessageSeq", FaceUrl: "avatar", ProfileDataMod: "profileModify", Profile_Account: "userID", ValueBytes: "value", ValueNum: "value", NoticeSeq: "noticeSequence", NotifySeq: "notifySequence", MsgFrom_AccountExtraInfo: "messageFromAccountExtraInformation", Operator_Account: "operatorID", OpType: "operationType", ReportType: "operationType", UserId: "userID", User_Account: "userID", List_Account: "userIDList", MsgOperatorMemberExtraInfo: "operatorInfo", MsgMemberExtraInfo: "memberInfoList", ImageUrl: "avatar", NickName: "nick", MsgGroupNewInfo: "newGroupProfile", Owner_Account: "ownerID", GroupName: "name", GroupFaceUrl: "avatar", GroupIntroduction: "introduction", GroupNotification: "notification", GroupApplyJoinOption: "joinOption", MsgKey: "messageKey", GroupInfo: "groupProfile", ShutupTime: "muteTime", Desc: "description", Ext: "extension" }, ignoreKeyWord: ["C2C", "ID", "USP"] },Fr = "_contextWasUpdated",Hr = "_contextWasReset",Br = "_a2KeyAndTinyIDUpdated",Kr = "_specifiedConfigUpdated",Vr = "_noticeIsSynchronizing",jr = "_noticeIsSynchronized",$r = "_messageSent",Yr = "_syncMessageProcessing",zr = "_syncMessageFinished",Wr = "_receiveInstantMessage",Xr = "_receiveGroupInstantMessage",Jr = "_receveGroupSystemNotice",Qr = "_messageRevoked",Zr = "_longPollGetIDFailed",eo = "_longPollRequestFailed",to = "_longPollResponseOK",no = "_longPollFastStart",ro = "_longPollSlowStart",oo = "_longPollKickedOut",io = "_longPollMitipuleDeviceKickedOut",so = "_longPollGetNewC2CNotice",ao = "_longPollGetNewGroupMessages",uo = "_longPollGetNewGroupTips",co = "_longPollGetNewGroupNotice",lo = "_longPollGetNewFriendMessages",po = "_longPollProfileModified",ho = "_longPollNoticeReceiveSystemOrders",fo = " _longpollGroupMessageRevoked",go = "_longpollC2CMessageRevoked",mo = "_avlongPollRequestFailed",yo = "_avlongPollResponseOK",vo = "_onGroupListUpdated",_o = "_loginSuccess",Co = "_signLogoutExcuting",Io = "_logoutSuccess",Mo = "_a2keyExpired",So = "_errorHasBeenDetected",Do = "_onConversationListUpdated",To = "_onConversationListProfileUpdated",Eo = "_conversationDeleted",ko = "onProfileUpdated",wo = "joinAVChatRoomSuccess",Ao = "_sdkStateReady";function Ro(e, t) {if ("string" != typeof e && !Array.isArray(e)) throw new TypeError("Expected the input to be `string | string[]`");t = Object.assign({ pascalCase: !1 }, t);var n;return 0 === (e = Array.isArray(e) ? e.map(function (e) {return e.trim();}).filter(function (e) {return e.length;}).join("-") : e.trim()).length ? "" : 1 === e.length ? t.pascalCase ? e.toUpperCase() : e.toLowerCase() : (e !== e.toLowerCase() && (e = Oo(e)), e = e.replace(/^[_.\- ]+/, "").toLowerCase().replace(/[_.\- ]+(\w|$)/g, function (e, t) {return t.toUpperCase();}).replace(/\d+(\w|$)/g, function (e) {return e.toUpperCase();}), n = e, t.pascalCase ? n.charAt(0).toUpperCase() + n.slice(1) : n);}var Oo = function Oo(e) {for (var t = !1, n = !1, r = !1, o = 0; o < e.length; o++) {var i = e[o];t && /[a-zA-Z]/.test(i) && i.toUpperCase() === i ? (e = e.slice(0, o) + "-" + e.slice(o), t = !1, r = n, n = !0, o++) : n && r && /[a-zA-Z]/.test(i) && i.toLowerCase() === i ? (e = e.slice(0, o - 1) + "-" + e.slice(o - 1), r = n, n = !1, t = !0) : (t = i.toLowerCase() === i && i.toUpperCase() !== i, r = n, n = i.toUpperCase() === i && i.toLowerCase() !== i);}return e;};function Lo(e, t, n) {var r = [],o = 0,i = function e(t, n) {if (++o > 10) return o--, t;if (Z(t)) {var i = t.map(function (t) {return J(t) ? e(t, n) : t;});return o--, i;}if (J(t)) {var s = (a = t, u = function u(e, t) {if (!ie(t)) return !1;if ((s = t) !== Ro(s)) {for (var o = !0, i = 0; i < xr.ignoreKeyWord.length; i++) {if (t.includes(xr.ignoreKeyWord[i])) {o = !1;break;}}o && r.push(t);}var s;return ee(n[t]) ? function (e) {return e[0].toUpperCase() + Ro(e).slice(1);}(t) : n[t];}, c = Object.create(null), Object.keys(a).forEach(function (e) {var t = u(a[e], e);t && (c[t] = a[e]);}), c);return s = Se(s, function (t, r) {return Z(t) || J(t) ? e(t, n) : t;}), o--, s;}var a, u, c;}(e, t = u({}, xr.request, {}, t));return r.length > 0 && n.innerEmitter.emit(So, { code: ln, message: vr }), i;}function No(e, t) {if (t = u({}, xr.response, {}, t), Z(e)) return e.map(function (e) {return J(e) ? No(e, t) : e;});if (J(e)) {var n = (r = e, o = function o(e, n) {return ee(t[n]) ? Ro(n) : t[n];}, i = {}, Object.keys(r).forEach(function (e) {i[o(r[e], e)] = r[e];}), i);return n = Se(n, function (e) {return Z(e) || J(e) ? No(e, t) : e;});}var r, o, i;}var bo = function () {function e(t) {var n = this;r(this, e), this.url = "", this.requestData = null, this.method = t.method || "POST", this.callback = function (e) {return No(e = t.decode(e), n._getResponseMap(t));}, this._initializeServerMap(), this._initializeURL(t), this._initializeRequestData(t);}return i(e, [{ key: "_initializeServerMap", value: function value() {this._serverMap = Object.create(null);var e = "";for (var t in Ur.NAME) {if (Object.prototype.hasOwnProperty.call(Ur.NAME, t)) switch (e = Ur.NAME[t]) {case Ur.NAME.PIC:this._serverMap[e] = Ur.HOST.CURRENT.PIC;break;case Ur.NAME.IM_COS_SIGN:this._serverMap[e] = Ur.HOST.CURRENT.COS;break;default:this._serverMap[e] = Ur.HOST.CURRENT.COMMON;}}} }, { key: "_getHost", value: function value(e) {if (void 0 !== this._serverMap[e]) return this._serverMap[e];throw new at({ code: an, message: dr });} }, { key: "_initializeURL", value: function value(e) {var t = e.serverName,n = e.cmd,r = this._getHost(t),o = "".concat(r, "/").concat(Ur.NAME_VERSION[t], "/").concat(t, "/").concat(n);o += "?".concat(this._getQueryString(e.queryString)), this.url = o;} }, { key: "getUrl", value: function value() {return this.url.replace(/&reqtime=(\d+)/, "&reqtime=".concat(Math.ceil(+new Date() / 1e3)));} }, { key: "_initializeRequestData", value: function value(e) {var t,n = e.requestData;t = this._requestDataCleaner(n), this.requestData = e.encode(t);} }, { key: "_requestDataCleaner", value: function value(e) {var t = Array.isArray(e) ? [] : Object.create(null);for (var r in e) {Object.prototype.hasOwnProperty.call(e, r) && ie(r) && null !== e[r] && ("object" !== n(e[r]) ? t[r] = e[r] : t[r] = this._requestDataCleaner.bind(this)(e[r]));}return t;} }, { key: "_getQueryString", value: function value(e) {var t = [];for (var n in e) {Object.prototype.hasOwnProperty.call(e, n) && ("function" != typeof e[n] ? t.push("".concat(n, "=").concat(e[n])) : t.push("".concat(n, "=").concat(e[n]())));}return t.join("&");} }, { key: "_getResponseMap", value: function value(e) {if (e.keyMaps && e.keyMaps.response && Object.keys(e.keyMaps.response).length > 0) return e.keyMaps.response;} }]), e;}();function Po(e) {this.mixin(e);}Po.mixin = function (e) {var t = e.prototype || e;t._isReady = !1, t.ready = function (e) {var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];if (e) return this._isReady ? void (t ? e.call(this) : setTimeout(e, 1)) : (this._readyQueue = this._readyQueue || [], void this._readyQueue.push(e));}, t.triggerReady = function () {var e = this;this._isReady = !0, setTimeout(function () {var t = e._readyQueue;e._readyQueue = [], t && t.length > 0 && t.forEach(function (e) {e.call(this);}, e);}, 1);}, t.resetReady = function () {this._isReady = !1, this._readyQueue = [];}, t.isReady = function () {return this._isReady;};};var Go = function () {function e(t) {r(this, e), Po.mixin(this), this.tim = t;}return i(e, [{ key: "isLoggedIn", value: function value() {return this.tim.context.login === Re.IS_LOGIN || !!this.tim.context.a2Key;} }, { key: "createTransportCapsule", value: function value(e) {var t = this.tim.packageConfig.get(e);return t ? new bo(t) : null;} }, { key: "request", value: function value(e) {var t = this.createTransportCapsule(e);return t || Y.error("unknown transport capsule, please check!", e), this.tim.connectionController.request(t);} }, { key: "emitInnerEvent", value: function value(e, t) {this.tim.innerEmitter.emit(e, t);} }, { key: "emitOuterEvent", value: function value(e, t) {this.tim.outerEmitter.emit(e, t);} }, { key: "reset", value: function value() {Y.warn(["method: IMController.reset() method must be implemented"].join());} }, { key: "probeNetwork", value: function value() {return this.tim.netMonitor.probe();} }, { key: "getNetworkType", value: function value() {return this.tim.netMonitor.getNetworkType();} }, { key: "getPlatform", value: function value() {var e = "web";return U ? e = "wechat" : k && (e = "wxmp"), e;} }]), e;}(),qo = function () {function e(t, n) {r(this, e), this.data = t, this._innerEmitter = n, this.defaultData = {}, Object.assign(this.defaultData, t), this.initGetterAndSetter();}return i(e, [{ key: "initGetterAndSetter", value: function value() {var e = this,t = function t(_t2) {Object.defineProperty(e, _t2, { enumerable: !0, configurable: !0, get: function get() {return e.data[_t2];}, set: function set(n) {e.data[_t2] !== n && (e.data[_t2] = n, e.onChange.bind(e)(_t2, n));} });};for (var n in e.data) {Object.prototype.hasOwnProperty.call(e.data, n) && t(n);}} }, { key: "onChange", value: function value(e, t) {this._innerEmitter.emit(Fr, { key: e, value: t });} }, { key: "reset", value: function value() {for (var e in Y.log("Context.reset"), this.data) {Object.prototype.hasOwnProperty.call(this.data, e) && (this.data[e] = this.defaultData.hasOwnProperty(e) ? this.defaultData[e] : null);}} }]), e;}(),Uo = function (e) {function t(e) {var n;r(this, t);var o = (n = m(this, l(t).call(this, e))).tim.loginInfo;return n._context = new qo({ login: Re.IS_NOT_LOGIN, SDKAppID: o.SDKAppID, appIDAt3rd: null, accountType: o.accountType, identifier: o.identifier, tinyID: null, identifierNick: o.identifierNick, userSig: o.userSig, a2Key: null, contentType: "json", apn: 1 }, n.tim.innerEmitter), n._initListener(), n;}return c(t, e), i(t, [{ key: "reset", value: function value() {this._context.reset(), this.emitInnerEvent(Hr);} }, { key: "_initListener", value: function value() {this.tim.innerEmitter.on(Fr, this._onContextMemberChange, this), this.tim.innerEmitter.on(_o, this._updateA2KeyAndTinyID, this);} }, { key: "_updateA2KeyAndTinyID", value: function value(e) {var t = e.data,n = t.a2Key,r = t.tinyID;this._context.a2Key = n, this._context.tinyID = r, this.emitInnerEvent(Br), this.triggerReady();} }, { key: "getContext", value: function value() {return this._context;} }, { key: "_onContextMemberChange", value: function value(e) {var t = e.data,n = t.key,r = t.value;("tinyID" === n || "a2Key" === n) && (r.length <= 0 ? this._context.login = Re.IS_NOT_LOGIN : this._context.login = null !== this._context.a2Key ? Re.IS_LOGIN : Re.IS_NOT_LOGIN);} }]), t;}(Go),xo = function e(t) {r(this, e), this.code = 0, this.data = t || {};},Fo = null,Ho = function Ho(e) {Fo = e;},Bo = function Bo(e) {return e instanceof xo ? (Y.warn("IMPromise.resolve 此函数会自动用options创建IMResponse实例，调用侧不需创建，建议修改！"), Promise.resolve(e)) : Promise.resolve(new xo(e));},Ko = function Ko(t) {var n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];if (t instanceof at) return n && null !== Fo && Fo.emit(e.ERROR, t), Promise.reject(t);if (t instanceof Error) {var r = new at({ code: fn, message: t.message });return n && null !== Fo && Fo.emit(e.ERROR, r), Promise.reject(r);}if (ee(t) || ee(t.code) || ee(t.message)) Y.error("IMPromise.reject 必须指定code(错误码)和message(错误信息)!!!");else {if (W(t.code) && X(t.message)) {var o = new at(t);return n && null !== Fo && Fo.emit(e.ERROR, o), Promise.reject(o);}Y.error("IMPromise.reject code(错误码)必须为数字，message(错误信息)必须为字符串!!!");}},Vo = "sdkReady",jo = "login",$o = "longpolling",Yo = "longpollingAV",zo = "sendMessage",Wo = "initConversationList",Xo = "initGroupList",Jo = "upload",Qo = function () {function e() {r(this, e), this.SDKAppID = "", this.version = "", this.tinyID = "", this.userID = "", this.platform = "", this.method = "", this.time = "", this.startts = 0, this.endts = 0, this.timespan = 0, this.codeint = 0, this.message = "", this.text = "", this.msgType = "", this.networkType = "", this.platform = "", this._sentFlag = !1;}return i(e, [{ key: "setCommonInfo", value: function value(e, t, n, r, o) {this.SDKAppID = "".concat(e), this.version = "".concat(t), this.tinyID = n, this.userID = r, this.platform = o, this.time = le(), this.startts && this.endts && !this.timespan && (this.timespan = Math.abs(this.endts - this.startts));} }, { key: "setMethod", value: function value(e) {return this.method = e, this;} }, { key: "setStart", value: function value() {this.startts = Date.now();} }, { key: "setEnd", value: function value() {var e = this,t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];this._sentFlag || (this.endts = Date.now(), t ? (this._sentFlag = !0, this._eventStatController.pushIn(this)) : setTimeout(function () {e._sentFlag = !0, e._eventStatController.pushIn(e);}, 0));} }, { key: "setError", value: function value(e, t, n) {return e instanceof Error ? (this._sentFlag || (this.setNetworkType(n), t ? (e.code && this.setCode(e.code), e.message && this.setMessage(e.message)) : (this.setCode(cn), this.setMessage(yr))), this) : (Y.warn("SSOLogData.setError value not instanceof Error, please check!"), this);} }, { key: "setCode", value: function value(e) {return ee(e) || this._sentFlag || (W(e) ? this.codeint = e : Y.warn("SSOLogData.setCode value not a number, please check!")), this;} }, { key: "setMessage", value: function value(e) {return ee(e) || this._sentFlag ? this : X(e) ? (this.message = e, this) : this;} }, { key: "setText", value: function value(e) {return W(e) ? this.text = e.toString() : X(e) && (this.text = e), this;} }, { key: "setMessageType", value: function value(e) {return this.msgType = e, this;} }, { key: "setNetworkType", value: function value(e) {return ee(e) ? Y.warn("SSOLogData.setNetworkType value is undefined, please check!") : this.networkType = e, this;} }], [{ key: "bindController", value: function value(t) {e.prototype._eventStatController = t;} }]), e;}(),Zo = "sdkConstruct",ei = "sdkReady",ti = "accessLayer",ni = "login",ri = "upload",oi = "sendMessage",ii = "getC2CRoamingMessages",si = "getGroupRoamingMessages",ai = "revokeMessage",ui = "setC2CMessageRead",ci = "setGroupMessageRead",li = "getConversationList",pi = "getConversationListInStorage",hi = "syncConversationList",fi = "createGroup",gi = "applyJoinGroup",di = "quitGroup",mi = "changeGroupOwner",yi = "dismissGroup",vi = "updateGroupProfile",_i = "getGroupList",Ci = "getGroupListInStorage",Ii = "getGroupLastSequence",Mi = "setGroupMemberMuteTime",Si = "setGroupMemberNameCard",Di = "setGroupMemberRole",Ti = "setGroupMemberCustomField",Ei = "getLongPollID",ki = "longPollingError",wi = "networkJitter",Ai = "fastStart",Ri = "slowStart",Oi = "getUserProfile",Li = "getBlacklist",Ni = "mpHideToShow",bi = function (n) {function o(e) {var t;return r(this, o), (t = m(this, l(o).call(this, e)))._initializeListener(), t;}return c(o, n), i(o, [{ key: "login", value: function value(e) {if (this.isLoggedIn()) {var t = "您已经登录账号".concat(e.identifier, "！如需切换账号登录，请先调用 logout 接口登出，再调用 login 接口登录。");return Y.warn(t), Bo({ actionStatus: "OK", errorCode: 0, errorInfo: t, repeatLogin: !0 });}Y.log("SignController.login userID=", e.identifier), Y.time(jo);var n = this._checkLoginInfo(e);return Te(n) ? (this.tim.context.identifier = e.identifier, this.tim.context.userSig = e.userSig, this.tim.context.SDKAppID = e.SDKAppID, this.tim.context.accountType = e.accountType, this.tim.context.identifier && this.tim.context.userSig ? this._accessLayer() : void 0) : Ko(n);} }, { key: "_isLoginCurrentUser", value: function value(e) {return this.tim.context.identifier === e;} }, { key: "_initializeListener", value: function value() {var e = this.tim.innerEmitter;e.on(oo, this._onKickedOut, this), e.on(io, this._onMultipleDeviceKickedOut, this), e.on(Mo, this._onUserSigExpired, this);} }, { key: "_accessLayer", value: function value() {var e = this,t = new Qo();return t.setMethod(ti).setStart(), Y.log("SignController._accessLayer."), this.request({ name: "accessLayer", action: "query" }).then(function (n) {return t.setCode(0).setNetworkType(e.getNetworkType()).setText(n.data.webImAccessLayer).setEnd(), Y.log("SignController._accessLayer ok. webImAccessLayer=".concat(n.data.webImAccessLayer)), 1 === n.data.webImAccessLayer && Ur.HOST.setCurrent(n.data.webImAccessLayer), e._login();}).catch(function (n) {return e.probeNetwork().then(function (r) {var o = y(r, 2),i = o[0],s = o[1];t.setError(n, i, s).setEnd(!0), e.tim.eventStatController.reportAtOnce();}), Y.error("SignController._accessLayer failed. error:".concat(n)), Ko(n);});} }, { key: "_login", value: function value() {var e = this,t = new Qo();return t.setMethod(ni).setStart(), this.request({ name: "login", action: "query" }).then(function (n) {var r = null;if (!n.data.tinyID) throw r = new at({ code: ht, message: Sn }), t.setError(r, !0, e.getNetworkType()).setEnd(), r;if (!n.data.a2Key) throw r = new at({ code: ft, message: Dn }), t.setError(r, !0, e.getNetworkType()).setEnd(), r;return t.setCode(0).setNetworkType(e.getNetworkType()).setText("".concat(e.tim.loginInfo.identifier)).setEnd(), Y.log("SignController.login ok. userID=".concat(e.tim.loginInfo.identifier, " loginCost=").concat(Y.timeEnd(jo), "ms")), e.emitInnerEvent(_o, { a2Key: n.data.a2Key, tinyID: n.data.tinyID }), Bo(n.data);}).catch(function (n) {return e.probeNetwork().then(function (e) {var r = y(e, 2),o = r[0],i = r[1];t.setError(n, o, i).setEnd(!0);}), Y.error("SignController.login failed. error:".concat(n)), Ko(n);});} }, { key: "logout", value: function value() {return Y.info("SignController.logout"), this.emitInnerEvent(Co), this._logout(ze).then(this._emitLogoutSuccess.bind(this)).catch(this._emitLogoutSuccess.bind(this));} }, { key: "_logout", value: function value(e) {var t = this.tim.notificationController,n = e === Ye ? "logout" : "longPollLogout",r = e === Ye ? { name: n, action: "query" } : { name: n, action: "query", param: { longPollID: t.getLongPollID() } };return this.request(r).catch(function (e) {return Y.error("SignController._logout error:", e), Ko(e);});} }, { key: "_checkLoginInfo", value: function value(e) {var t = 0,n = "";return null === e.SDKAppID ? (t = ut, n = _n) : null === e.accountType ? (t = ct, n = Cn) : null === e.identifier ? (t = lt, n = In) : null === e.userSig && (t = pt, n = Mn), Te(t) || Te(n) ? {} : { code: t, message: n };} }, { key: "_emitLogoutSuccess", value: function value() {return this.emitInnerEvent(Io), Bo({});} }, { key: "_onKickedOut", value: function value() {var n = this;Y.warn("SignController._onKickedOut kicked out. userID=".concat(this.tim.loginInfo.identifier)), this.tim.logout().then(function () {n.emitOuterEvent(e.KICKED_OUT, { type: t.KICKED_OUT_MULT_ACCOUNT });});} }, { key: "_onMultipleDeviceKickedOut", value: function value() {var n = this;Y.warn("SignController._onMultipleDeviceKickedOut kicked out. userID=".concat(this.tim.loginInfo.identifier)), this.tim.logout().then(function () {n.emitOuterEvent(e.KICKED_OUT, { type: t.KICKED_OUT_MULT_DEVICE });});} }, { key: "_onUserSigExpired", value: function value() {Y.warn("SignController._onUserSigExpired: userSig 签名过期被踢下线"), this.emitOuterEvent(e.KICKED_OUT, { type: t.KICKED_OUT_USERSIG_EXPIRED }), this.tim.resetSDK();} }, { key: "reset", value: function value() {Y.info("SignController.reset");} }]), o;}(Go),Pi = function Pi(e, t) {return function () {for (var n = new Array(arguments.length), r = 0; r < n.length; r++) {n[r] = arguments[r];}return e.apply(t, n);};},Gi = Object.prototype.toString;function qi(e) {return "[object Array]" === Gi.call(e);}function Ui(e) {return void 0 === e;}function xi(e) {return null !== e && "object" == typeof e;}function Fi(e) {return "[object Function]" === Gi.call(e);}function Hi(e, t) {if (null != e) if ("object" != typeof e && (e = [e]), qi(e)) for (var n = 0, r = e.length; n < r; n++) {t.call(null, e[n], n, e);} else for (var o in e) {Object.prototype.hasOwnProperty.call(e, o) && t.call(null, e[o], o, e);}}var Bi = { isArray: qi, isArrayBuffer: function isArrayBuffer(e) {return "[object ArrayBuffer]" === Gi.call(e);}, isBuffer: function isBuffer(e) {return null !== e && !Ui(e) && null !== e.constructor && !Ui(e.constructor) && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);}, isFormData: function isFormData(e) {return "undefined" != typeof FormData && e instanceof FormData;}, isArrayBufferView: function isArrayBufferView(e) {return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(e) : e && e.buffer && e.buffer instanceof ArrayBuffer;}, isString: function isString(e) {return "string" == typeof e;}, isNumber: function isNumber(e) {return "number" == typeof e;}, isObject: xi, isUndefined: Ui, isDate: function isDate(e) {return "[object Date]" === Gi.call(e);}, isFile: function isFile(e) {return "[object File]" === Gi.call(e);}, isBlob: function isBlob(e) {return "[object Blob]" === Gi.call(e);}, isFunction: Fi, isStream: function isStream(e) {return xi(e) && Fi(e.pipe);}, isURLSearchParams: function isURLSearchParams(e) {return "undefined" != typeof URLSearchParams && e instanceof URLSearchParams;}, isStandardBrowserEnv: function isStandardBrowserEnv() {return ("undefined" == typeof navigator || "ReactNative" !== navigator.product && "NativeScript" !== navigator.product && "NS" !== navigator.product) && "undefined" != typeof window && "undefined" != typeof document;}, forEach: Hi, merge: function e() {var t = {};function n(n, r) {"object" == typeof t[r] && "object" == typeof n ? t[r] = e(t[r], n) : t[r] = n;}for (var r = 0, o = arguments.length; r < o; r++) {Hi(arguments[r], n);}return t;}, deepMerge: function e() {var t = {};function n(n, r) {"object" == typeof t[r] && "object" == typeof n ? t[r] = e(t[r], n) : t[r] = "object" == typeof n ? e({}, n) : n;}for (var r = 0, o = arguments.length; r < o; r++) {Hi(arguments[r], n);}return t;}, extend: function extend(e, t, n) {return Hi(t, function (t, r) {e[r] = n && "function" == typeof t ? Pi(t, n) : t;}), e;}, trim: function trim(e) {return e.replace(/^\s*/, "").replace(/\s*$/, "");} };function Ki(e) {return encodeURIComponent(e).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");}var Vi = function Vi(e, t, n) {if (!t) return e;var r;if (n) r = n(t);else if (Bi.isURLSearchParams(t)) r = t.toString();else {var o = [];Bi.forEach(t, function (e, t) {null != e && (Bi.isArray(e) ? t += "[]" : e = [e], Bi.forEach(e, function (e) {Bi.isDate(e) ? e = e.toISOString() : Bi.isObject(e) && (e = JSON.stringify(e)), o.push(Ki(t) + "=" + Ki(e));}));}), r = o.join("&");}if (r) {var i = e.indexOf("#");-1 !== i && (e = e.slice(0, i)), e += (-1 === e.indexOf("?") ? "?" : "&") + r;}return e;};function ji() {this.handlers = [];}ji.prototype.use = function (e, t) {return this.handlers.push({ fulfilled: e, rejected: t }), this.handlers.length - 1;}, ji.prototype.eject = function (e) {this.handlers[e] && (this.handlers[e] = null);}, ji.prototype.forEach = function (e) {Bi.forEach(this.handlers, function (t) {null !== t && e(t);});};var $i = ji,Yi = function Yi(e, t, n) {return Bi.forEach(n, function (n) {e = n(e, t);}), e;},zi = function zi(e) {return !(!e || !e.__CANCEL__);};function Wi() {throw new Error("setTimeout has not been defined");}function Xi() {throw new Error("clearTimeout has not been defined");}var Ji = Wi,Qi = Xi;function Zi(e) {if (Ji === setTimeout) return setTimeout(e, 0);if ((Ji === Wi || !Ji) && setTimeout) return Ji = setTimeout, setTimeout(e, 0);try {return Ji(e, 0);} catch (t) {try {return Ji.call(null, e, 0);} catch (t) {return Ji.call(this, e, 0);}}}"function" == typeof x.setTimeout && (Ji = setTimeout), "function" == typeof x.clearTimeout && (Qi = clearTimeout);var es,ts = [],ns = !1,rs = -1;function os() {ns && es && (ns = !1, es.length ? ts = es.concat(ts) : rs = -1, ts.length && is());}function is() {if (!ns) {var e = Zi(os);ns = !0;for (var t = ts.length; t;) {for (es = ts, ts = []; ++rs < t;) {es && es[rs].run();}rs = -1, t = ts.length;}es = null, ns = !1, function (e) {if (Qi === clearTimeout) return clearTimeout(e);if ((Qi === Xi || !Qi) && clearTimeout) return Qi = clearTimeout, clearTimeout(e);try {Qi(e);} catch (t) {try {return Qi.call(null, e);} catch (t) {return Qi.call(this, e);}}}(e);}}function ss(e, t) {this.fun = e, this.array = t;}ss.prototype.run = function () {this.fun.apply(null, this.array);};function as() {}var us = as,cs = as,ls = as,ps = as,hs = as,fs = as,gs = as;var ds = x.performance || {},ms = ds.now || ds.mozNow || ds.msNow || ds.oNow || ds.webkitNow || function () {return new Date().getTime();};var ys = new Date();var vs = { nextTick: function nextTick(e) {var t = new Array(arguments.length - 1);if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) {t[n - 1] = arguments[n];}ts.push(new ss(e, t)), 1 !== ts.length || ns || Zi(is);}, title: "browser", browser: !0, env: {}, argv: [], version: "", versions: {}, on: us, addListener: cs, once: ls, off: ps, removeListener: hs, removeAllListeners: fs, emit: gs, binding: function binding(e) {throw new Error("process.binding is not supported");}, cwd: function cwd() {return "/";}, chdir: function chdir(e) {throw new Error("process.chdir is not supported");}, umask: function umask() {return 0;}, hrtime: function hrtime(e) {var t = .001 * ms.call(ds),n = Math.floor(t),r = Math.floor(t % 1 * 1e9);return e && (n -= e[0], (r -= e[1]) < 0 && (n--, r += 1e9)), [n, r];}, platform: "browser", release: {}, config: {}, uptime: function uptime() {return (new Date() - ys) / 1e3;} },_s = function _s(e, t) {Bi.forEach(e, function (n, r) {r !== t && r.toUpperCase() === t.toUpperCase() && (e[t] = n, delete e[r]);});},Cs = function Cs(e, t, n, r, o) {return function (e, t, n, r, o) {return e.config = t, n && (e.code = n), e.request = r, e.response = o, e.isAxiosError = !0, e.toJSON = function () {return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code };}, e;}(new Error(e), t, n, r, o);},Is = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"],Ms = Bi.isStandardBrowserEnv() ? function () {var e,t = /(msie|trident)/i.test(navigator.userAgent),n = document.createElement("a");function r(e) {var r = e;return t && (n.setAttribute("href", r), r = n.href), n.setAttribute("href", r), { href: n.href, protocol: n.protocol ? n.protocol.replace(/:$/, "") : "", host: n.host, search: n.search ? n.search.replace(/^\?/, "") : "", hash: n.hash ? n.hash.replace(/^#/, "") : "", hostname: n.hostname, port: n.port, pathname: "/" === n.pathname.charAt(0) ? n.pathname : "/" + n.pathname };}return e = r(window.location.href), function (t) {var n = Bi.isString(t) ? r(t) : t;return n.protocol === e.protocol && n.host === e.host;};}() : function () {return !0;},Ss = Bi.isStandardBrowserEnv() ? { write: function write(e, t, n, r, o, i) {var s = [];s.push(e + "=" + encodeURIComponent(t)), Bi.isNumber(n) && s.push("expires=" + new Date(n).toGMTString()), Bi.isString(r) && s.push("path=" + r), Bi.isString(o) && s.push("domain=" + o), !0 === i && s.push("secure"), document.cookie = s.join("; ");}, read: function read(e) {var t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));return t ? decodeURIComponent(t[3]) : null;}, remove: function remove(e) {this.write(e, "", Date.now() - 864e5);} } : { write: function write() {}, read: function read() {return null;}, remove: function remove() {} },Ds = function Ds(e) {return new Promise(function (t, n) {var r = e.data,o = e.headers;Bi.isFormData(r) && delete o["Content-Type"];var i = new XMLHttpRequest();if (e.auth) {var s = e.auth.username || "",a = e.auth.password || "";o.Authorization = "Basic " + btoa(s + ":" + a);}var u,c,l = (u = e.baseURL, c = e.url, u && !/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(c) ? function (e, t) {return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e;}(u, c) : c);if (i.open(e.method.toUpperCase(), Vi(l, e.params, e.paramsSerializer), !0), i.timeout = e.timeout, i.onreadystatechange = function () {if (i && 4 === i.readyState && (0 !== i.status || i.responseURL && 0 === i.responseURL.indexOf("file:"))) {var r,o,s,a,u,c = "getAllResponseHeaders" in i ? (r = i.getAllResponseHeaders(), u = {}, r ? (Bi.forEach(r.split("\n"), function (e) {if (a = e.indexOf(":"), o = Bi.trim(e.substr(0, a)).toLowerCase(), s = Bi.trim(e.substr(a + 1)), o) {if (u[o] && Is.indexOf(o) >= 0) return;u[o] = "set-cookie" === o ? (u[o] ? u[o] : []).concat([s]) : u[o] ? u[o] + ", " + s : s;}}), u) : u) : null,l = { data: e.responseType && "text" !== e.responseType ? i.response : i.responseText, status: i.status, statusText: i.statusText, headers: c, config: e, request: i };!function (e, t, n) {var r = n.config.validateStatus;!r || r(n.status) ? e(n) : t(Cs("Request failed with status code " + n.status, n.config, null, n.request, n));}(t, n, l), i = null;}}, i.onabort = function () {i && (n(Cs("Request aborted", e, "ECONNABORTED", i)), i = null);}, i.onerror = function () {n(Cs("Network Error", e, null, i)), i = null;}, i.ontimeout = function () {var t = "timeout of " + e.timeout + "ms exceeded";e.timeoutErrorMessage && (t = e.timeoutErrorMessage), n(Cs(t, e, "ECONNABORTED", i)), i = null;}, Bi.isStandardBrowserEnv()) {var p = Ss,h = (e.withCredentials || Ms(l)) && e.xsrfCookieName ? p.read(e.xsrfCookieName) : void 0;h && (o[e.xsrfHeaderName] = h);}if ("setRequestHeader" in i && Bi.forEach(o, function (e, t) {void 0 === r && "content-type" === t.toLowerCase() ? delete o[t] : i.setRequestHeader(t, e);}), Bi.isUndefined(e.withCredentials) || (i.withCredentials = !!e.withCredentials), e.responseType) try {i.responseType = e.responseType;} catch (f) {if ("json" !== e.responseType) throw f;}"function" == typeof e.onDownloadProgress && i.addEventListener("progress", e.onDownloadProgress), "function" == typeof e.onUploadProgress && i.upload && i.upload.addEventListener("progress", e.onUploadProgress), e.cancelToken && e.cancelToken.promise.then(function (e) {i && (i.abort(), n(e), i = null);}), void 0 === r && (r = null), i.send(r);});},Ts = { "Content-Type": "application/x-www-form-urlencoded" };function Es(e, t) {!Bi.isUndefined(e) && Bi.isUndefined(e["Content-Type"]) && (e["Content-Type"] = t);}var ks,ws = { adapter: (("undefined" != typeof XMLHttpRequest || void 0 !== vs && "[object process]" === Object.prototype.toString.call(vs)) && (ks = Ds), ks), transformRequest: [function (e, t) {return _s(t, "Accept"), _s(t, "Content-Type"), Bi.isFormData(e) || Bi.isArrayBuffer(e) || Bi.isBuffer(e) || Bi.isStream(e) || Bi.isFile(e) || Bi.isBlob(e) ? e : Bi.isArrayBufferView(e) ? e.buffer : Bi.isURLSearchParams(e) ? (Es(t, "application/x-www-form-urlencoded;charset=utf-8"), e.toString()) : Bi.isObject(e) ? (Es(t, "application/json;charset=utf-8"), JSON.stringify(e)) : e;}], transformResponse: [function (e) {if ("string" == typeof e) try {e = JSON.parse(e);} catch (t) {}return e;}], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, validateStatus: function validateStatus(e) {return e >= 200 && e < 300;} };ws.headers = { common: { Accept: "application/json, text/plain, */*" } }, Bi.forEach(["delete", "get", "head"], function (e) {ws.headers[e] = {};}), Bi.forEach(["post", "put", "patch"], function (e) {ws.headers[e] = Bi.merge(Ts);});var As = ws;function Rs(e) {e.cancelToken && e.cancelToken.throwIfRequested();}var Os = function Os(e) {return Rs(e), e.headers = e.headers || {}, e.data = Yi(e.data, e.headers, e.transformRequest), e.headers = Bi.merge(e.headers.common || {}, e.headers[e.method] || {}, e.headers), Bi.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function (t) {delete e.headers[t];}), (e.adapter || As.adapter)(e).then(function (t) {return Rs(e), t.data = Yi(t.data, t.headers, e.transformResponse), t;}, function (t) {return zi(t) || (Rs(e), t && t.response && (t.response.data = Yi(t.response.data, t.response.headers, e.transformResponse))), Promise.reject(t);});},Ls = function Ls(e, t) {t = t || {};var n = {},r = ["url", "method", "params", "data"],o = ["headers", "auth", "proxy"],i = ["baseURL", "url", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "maxContentLength", "validateStatus", "maxRedirects", "httpAgent", "httpsAgent", "cancelToken", "socketPath"];Bi.forEach(r, function (e) {void 0 !== t[e] && (n[e] = t[e]);}), Bi.forEach(o, function (r) {Bi.isObject(t[r]) ? n[r] = Bi.deepMerge(e[r], t[r]) : void 0 !== t[r] ? n[r] = t[r] : Bi.isObject(e[r]) ? n[r] = Bi.deepMerge(e[r]) : void 0 !== e[r] && (n[r] = e[r]);}), Bi.forEach(i, function (r) {void 0 !== t[r] ? n[r] = t[r] : void 0 !== e[r] && (n[r] = e[r]);});var s = r.concat(o).concat(i),a = Object.keys(t).filter(function (e) {return -1 === s.indexOf(e);});return Bi.forEach(a, function (r) {void 0 !== t[r] ? n[r] = t[r] : void 0 !== e[r] && (n[r] = e[r]);}), n;};function Ns(e) {this.defaults = e, this.interceptors = { request: new $i(), response: new $i() };}Ns.prototype.request = function (e) {"string" == typeof e ? (e = arguments[1] || {}).url = arguments[0] : e = e || {}, (e = Ls(this.defaults, e)).method ? e.method = e.method.toLowerCase() : this.defaults.method ? e.method = this.defaults.method.toLowerCase() : e.method = "get";var t = [Os, void 0],n = Promise.resolve(e);for (this.interceptors.request.forEach(function (e) {t.unshift(e.fulfilled, e.rejected);}), this.interceptors.response.forEach(function (e) {t.push(e.fulfilled, e.rejected);}); t.length;) {n = n.then(t.shift(), t.shift());}return n;}, Ns.prototype.getUri = function (e) {return e = Ls(this.defaults, e), Vi(e.url, e.params, e.paramsSerializer).replace(/^\?/, "");}, Bi.forEach(["delete", "get", "head", "options"], function (e) {Ns.prototype[e] = function (t, n) {return this.request(Bi.merge(n || {}, { method: e, url: t }));};}), Bi.forEach(["post", "put", "patch"], function (e) {Ns.prototype[e] = function (t, n, r) {return this.request(Bi.merge(r || {}, { method: e, url: t, data: n }));};});var bs = Ns;function Ps(e) {this.message = e;}Ps.prototype.toString = function () {return "Cancel" + (this.message ? ": " + this.message : "");}, Ps.prototype.__CANCEL__ = !0;var Gs = Ps;function qs(e) {if ("function" != typeof e) throw new TypeError("executor must be a function.");var t;this.promise = new Promise(function (e) {t = e;});var n = this;e(function (e) {n.reason || (n.reason = new Gs(e), t(n.reason));});}qs.prototype.throwIfRequested = function () {if (this.reason) throw this.reason;}, qs.source = function () {var e;return { token: new qs(function (t) {e = t;}), cancel: e };};var Us = qs;function xs(e) {var t = new bs(e),n = Pi(bs.prototype.request, t);return Bi.extend(n, bs.prototype, t), Bi.extend(n, t), n;}var Fs = xs(As);Fs.Axios = bs, Fs.create = function (e) {return xs(Ls(Fs.defaults, e));}, Fs.Cancel = Gs, Fs.CancelToken = Us, Fs.isCancel = zi, Fs.all = function (e) {return Promise.all(e);}, Fs.spread = function (e) {return function (t) {return e.apply(null, t);};};var Hs = Fs,Bs = Fs;Hs.default = Bs;var Ks = Hs,Vs = Ks.create({ timeout: 3e4, headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" } });Vs.interceptors.response.use(function (e) {var t = e.data,n = t.error_code,r = t.ErrorCode;return W(n) && (r = n), r !== Ae.SUCCESS && (e.data.ErrorCode = Number(r)), e;}, function (e) {return "Network Error" === e.message && (!0 === Vs.defaults.withCredentials && Y.warn("Network Error, try to close `IMAxios.defaults.withCredentials` to false. (IMAxios.js)"), Vs.defaults.withCredentials = !1), Promise.reject(e);});var js = function () {function e() {r(this, e);}return i(e, [{ key: "request", value: function value(e) {console.warn("请注意： ConnectionBase.request() 方法必须被派生类重写:"), console.log("参数如下：\n    * @param {String} options.url string 是 开发者服务器接口地址\n    * @param {*} options.data - string/object/ArrayBuffer 否 请求的参数\n    * @param {Object} options.header - Object 否 设置请求的 header，\n    * @param {String} options.method - string GET 否 HTTP 请求方法\n    * @param {String} options.dataType - string json 否 返回的数据格式\n    * @param {String} options.responseType - string text 否 响应的数据类型\n    * @param {Boolean} isRetry - string text false 是否为重试的请求\n   ");} }, { key: "_checkOptions", value: function value(e) {if (!1 == !!e.url) throw new at({ code: sn, message: gr });} }, { key: "_initOptions", value: function value(e) {e.method = ["POST", "GET", "PUT", "DELETE", "OPTION"].indexOf(e.method) >= 0 ? e.method : "POST", e.dataType = e.dataType || "json", e.responseType = e.responseType || "json";} }]), e;}(),$s = function (e) {function t() {var e;return r(this, t), (e = m(this, l(t).call(this))).retry = 2, e;}return c(t, e), i(t, [{ key: "request", value: function value(e) {return this._checkOptions(e), this._initOptions(e), this._requestWithRetry({ url: e.url, data: e.data, method: e.method });} }, { key: "_requestWithRetry", value: function value(e) {var t = this,n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;return Vs(e).catch(function (r) {return t.retry && n < t.retry ? t._requestWithRetry(e, ++n) : Ko(new at({ code: r.code || "", message: r.message || "" }));});} }]), t;}(js),Ys = [],zs = [],Ws = "undefined" != typeof Uint8Array ? Uint8Array : Array,Xs = !1;function Js() {Xs = !0;for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = 0, n = e.length; t < n; ++t) {Ys[t] = e[t], zs[e.charCodeAt(t)] = t;}zs["-".charCodeAt(0)] = 62, zs["_".charCodeAt(0)] = 63;}function Qs(e, t, n) {for (var r, o, i = [], s = t; s < n; s += 3) {r = (e[s] << 16) + (e[s + 1] << 8) + e[s + 2], i.push(Ys[(o = r) >> 18 & 63] + Ys[o >> 12 & 63] + Ys[o >> 6 & 63] + Ys[63 & o]);}return i.join("");}function Zs(e) {var t;Xs || Js();for (var n = e.length, r = n % 3, o = "", i = [], s = 0, a = n - r; s < a; s += 16383) {i.push(Qs(e, s, s + 16383 > a ? a : s + 16383));}return 1 === r ? (t = e[n - 1], o += Ys[t >> 2], o += Ys[t << 4 & 63], o += "==") : 2 === r && (t = (e[n - 2] << 8) + e[n - 1], o += Ys[t >> 10], o += Ys[t >> 4 & 63], o += Ys[t << 2 & 63], o += "="), i.push(o), i.join("");}function ea(e, t, n, r, o) {var i,s,a = 8 * o - r - 1,u = (1 << a) - 1,c = u >> 1,l = -7,p = n ? o - 1 : 0,h = n ? -1 : 1,f = e[t + p];for (p += h, i = f & (1 << -l) - 1, f >>= -l, l += a; l > 0; i = 256 * i + e[t + p], p += h, l -= 8) {;}for (s = i & (1 << -l) - 1, i >>= -l, l += r; l > 0; s = 256 * s + e[t + p], p += h, l -= 8) {;}if (0 === i) i = 1 - c;else {if (i === u) return s ? NaN : Infinity * (f ? -1 : 1);s += Math.pow(2, r), i -= c;}return (f ? -1 : 1) * s * Math.pow(2, i - r);}function ta(e, t, n, r, o, i) {var s,a,u,c = 8 * i - o - 1,l = (1 << c) - 1,p = l >> 1,h = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,f = r ? 0 : i - 1,g = r ? 1 : -1,d = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;for (t = Math.abs(t), isNaN(t) || Infinity === t ? (a = isNaN(t) ? 1 : 0, s = l) : (s = Math.floor(Math.log(t) / Math.LN2), t * (u = Math.pow(2, -s)) < 1 && (s--, u *= 2), (t += s + p >= 1 ? h / u : h * Math.pow(2, 1 - p)) * u >= 2 && (s++, u /= 2), s + p >= l ? (a = 0, s = l) : s + p >= 1 ? (a = (t * u - 1) * Math.pow(2, o), s += p) : (a = t * Math.pow(2, p - 1) * Math.pow(2, o), s = 0)); o >= 8; e[n + f] = 255 & a, f += g, a /= 256, o -= 8) {;}for (s = s << o | a, c += o; c > 0; e[n + f] = 255 & s, f += g, s /= 256, c -= 8) {;}e[n + f - g] |= 128 * d;}var na = {}.toString,ra = Array.isArray || function (e) {return "[object Array]" == na.call(e);};function oa() {return sa.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;}function ia(e, t) {if (oa() < t) throw new RangeError("Invalid typed array length");return sa.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = sa.prototype : (null === e && (e = new sa(t)), e.length = t), e;}function sa(e, t, n) {if (!(sa.TYPED_ARRAY_SUPPORT || this instanceof sa)) return new sa(e, t, n);if ("number" == typeof e) {if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");return ca(this, e);}return aa(this, e, t, n);}function aa(e, t, n, r) {if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function (e, t, n, r) {if (t.byteLength, n < 0 || t.byteLength < n) throw new RangeError("'offset' is out of bounds");if (t.byteLength < n + (r || 0)) throw new RangeError("'length' is out of bounds");t = void 0 === n && void 0 === r ? new Uint8Array(t) : void 0 === r ? new Uint8Array(t, n) : new Uint8Array(t, n, r);sa.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = sa.prototype : e = la(e, t);return e;}(e, t, n, r) : "string" == typeof t ? function (e, t, n) {"string" == typeof n && "" !== n || (n = "utf8");if (!sa.isEncoding(n)) throw new TypeError('"encoding" must be a valid string encoding');var r = 0 | fa(t, n),o = (e = ia(e, r)).write(t, n);o !== r && (e = e.slice(0, o));return e;}(e, t, n) : function (e, t) {if (ha(t)) {var n = 0 | pa(t.length);return 0 === (e = ia(e, n)).length || t.copy(e, 0, 0, n), e;}if (t) {if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || (r = t.length) != r ? ia(e, 0) : la(e, t);if ("Buffer" === t.type && ra(t.data)) return la(e, t.data);}var r;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");}(e, t);}function ua(e) {if ("number" != typeof e) throw new TypeError('"size" argument must be a number');if (e < 0) throw new RangeError('"size" argument must not be negative');}function ca(e, t) {if (ua(t), e = ia(e, t < 0 ? 0 : 0 | pa(t)), !sa.TYPED_ARRAY_SUPPORT) for (var n = 0; n < t; ++n) {e[n] = 0;}return e;}function la(e, t) {var n = t.length < 0 ? 0 : 0 | pa(t.length);e = ia(e, n);for (var r = 0; r < n; r += 1) {e[r] = 255 & t[r];}return e;}function pa(e) {if (e >= oa()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + oa().toString(16) + " bytes");return 0 | e;}function ha(e) {return !(null == e || !e._isBuffer);}function fa(e, t) {if (ha(e)) return e.length;if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;"string" != typeof e && (e = "" + e);var n = e.length;if (0 === n) return 0;for (var r = !1;;) {switch (t) {case "ascii":case "latin1":case "binary":return n;case "utf8":case "utf-8":case void 0:return xa(e).length;case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return 2 * n;case "hex":return n >>> 1;case "base64":return Fa(e).length;default:if (r) return xa(e).length;t = ("" + t).toLowerCase(), r = !0;}}}function ga(e, t, n) {var r = !1;if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";if ((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";if ((n >>>= 0) <= (t >>>= 0)) return "";for (e || (e = "utf8");;) {switch (e) {case "hex":return wa(this, t, n);case "utf8":case "utf-8":return Ta(this, t, n);case "ascii":return Ea(this, t, n);case "latin1":case "binary":return ka(this, t, n);case "base64":return Da(this, t, n);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return Aa(this, t, n);default:if (r) throw new TypeError("Unknown encoding: " + e);e = (e + "").toLowerCase(), r = !0;}}}function da(e, t, n) {var r = e[t];e[t] = e[n], e[n] = r;}function ma(e, t, n, r, o) {if (0 === e.length) return -1;if ("string" == typeof n ? (r = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, isNaN(n) && (n = o ? 0 : e.length - 1), n < 0 && (n = e.length + n), n >= e.length) {if (o) return -1;n = e.length - 1;} else if (n < 0) {if (!o) return -1;n = 0;}if ("string" == typeof t && (t = sa.from(t, r)), ha(t)) return 0 === t.length ? -1 : ya(e, t, n, r, o);if ("number" == typeof t) return t &= 255, sa.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(e, t, n) : Uint8Array.prototype.lastIndexOf.call(e, t, n) : ya(e, [t], n, r, o);throw new TypeError("val must be string, number or Buffer");}function ya(e, t, n, r, o) {var i,s = 1,a = e.length,u = t.length;if (void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {if (e.length < 2 || t.length < 2) return -1;s = 2, a /= 2, u /= 2, n /= 2;}function c(e, t) {return 1 === s ? e[t] : e.readUInt16BE(t * s);}if (o) {var l = -1;for (i = n; i < a; i++) {if (c(e, i) === c(t, -1 === l ? 0 : i - l)) {if (-1 === l && (l = i), i - l + 1 === u) return l * s;} else -1 !== l && (i -= i - l), l = -1;}} else for (n + u > a && (n = a - u), i = n; i >= 0; i--) {for (var p = !0, h = 0; h < u; h++) {if (c(e, i + h) !== c(t, h)) {p = !1;break;}}if (p) return i;}return -1;}function va(e, t, n, r) {n = Number(n) || 0;var o = e.length - n;r ? (r = Number(r)) > o && (r = o) : r = o;var i = t.length;if (i % 2 != 0) throw new TypeError("Invalid hex string");r > i / 2 && (r = i / 2);for (var s = 0; s < r; ++s) {var a = parseInt(t.substr(2 * s, 2), 16);if (isNaN(a)) return s;e[n + s] = a;}return s;}function _a(e, t, n, r) {return Ha(xa(t, e.length - n), e, n, r);}function Ca(e, t, n, r) {return Ha(function (e) {for (var t = [], n = 0; n < e.length; ++n) {t.push(255 & e.charCodeAt(n));}return t;}(t), e, n, r);}function Ia(e, t, n, r) {return Ca(e, t, n, r);}function Ma(e, t, n, r) {return Ha(Fa(t), e, n, r);}function Sa(e, t, n, r) {return Ha(function (e, t) {for (var n, r, o, i = [], s = 0; s < e.length && !((t -= 2) < 0); ++s) {n = e.charCodeAt(s), r = n >> 8, o = n % 256, i.push(o), i.push(r);}return i;}(t, e.length - n), e, n, r);}function Da(e, t, n) {return 0 === t && n === e.length ? Zs(e) : Zs(e.slice(t, n));}function Ta(e, t, n) {n = Math.min(e.length, n);for (var r = [], o = t; o < n;) {var i,s,a,u,c = e[o],l = null,p = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;if (o + p <= n) switch (p) {case 1:c < 128 && (l = c);break;case 2:128 == (192 & (i = e[o + 1])) && (u = (31 & c) << 6 | 63 & i) > 127 && (l = u);break;case 3:i = e[o + 1], s = e[o + 2], 128 == (192 & i) && 128 == (192 & s) && (u = (15 & c) << 12 | (63 & i) << 6 | 63 & s) > 2047 && (u < 55296 || u > 57343) && (l = u);break;case 4:i = e[o + 1], s = e[o + 2], a = e[o + 3], 128 == (192 & i) && 128 == (192 & s) && 128 == (192 & a) && (u = (15 & c) << 18 | (63 & i) << 12 | (63 & s) << 6 | 63 & a) > 65535 && u < 1114112 && (l = u);}null === l ? (l = 65533, p = 1) : l > 65535 && (l -= 65536, r.push(l >>> 10 & 1023 | 55296), l = 56320 | 1023 & l), r.push(l), o += p;}return function (e) {var t = e.length;if (t <= 4096) return String.fromCharCode.apply(String, e);var n = "",r = 0;for (; r < t;) {n += String.fromCharCode.apply(String, e.slice(r, r += 4096));}return n;}(r);}sa.TYPED_ARRAY_SUPPORT = void 0 === x.TYPED_ARRAY_SUPPORT || x.TYPED_ARRAY_SUPPORT, sa.poolSize = 8192, sa._augment = function (e) {return e.__proto__ = sa.prototype, e;}, sa.from = function (e, t, n) {return aa(null, e, t, n);}, sa.TYPED_ARRAY_SUPPORT && (sa.prototype.__proto__ = Uint8Array.prototype, sa.__proto__ = Uint8Array), sa.alloc = function (e, t, n) {return function (e, t, n, r) {return ua(t), t <= 0 ? ia(e, t) : void 0 !== n ? "string" == typeof r ? ia(e, t).fill(n, r) : ia(e, t).fill(n) : ia(e, t);}(null, e, t, n);}, sa.allocUnsafe = function (e) {return ca(null, e);}, sa.allocUnsafeSlow = function (e) {return ca(null, e);}, sa.isBuffer = function (e) {return null != e && (!!e._isBuffer || Ba(e) || function (e) {return "function" == typeof e.readFloatLE && "function" == typeof e.slice && Ba(e.slice(0, 0));}(e));}, sa.compare = function (e, t) {if (!ha(e) || !ha(t)) throw new TypeError("Arguments must be Buffers");if (e === t) return 0;for (var n = e.length, r = t.length, o = 0, i = Math.min(n, r); o < i; ++o) {if (e[o] !== t[o]) {n = e[o], r = t[o];break;}}return n < r ? -1 : r < n ? 1 : 0;}, sa.isEncoding = function (e) {switch (String(e).toLowerCase()) {case "hex":case "utf8":case "utf-8":case "ascii":case "latin1":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return !0;default:return !1;}}, sa.concat = function (e, t) {if (!ra(e)) throw new TypeError('"list" argument must be an Array of Buffers');if (0 === e.length) return sa.alloc(0);var n;if (void 0 === t) for (t = 0, n = 0; n < e.length; ++n) {t += e[n].length;}var r = sa.allocUnsafe(t),o = 0;for (n = 0; n < e.length; ++n) {var i = e[n];if (!ha(i)) throw new TypeError('"list" argument must be an Array of Buffers');i.copy(r, o), o += i.length;}return r;}, sa.byteLength = fa, sa.prototype._isBuffer = !0, sa.prototype.swap16 = function () {var e = this.length;if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");for (var t = 0; t < e; t += 2) {da(this, t, t + 1);}return this;}, sa.prototype.swap32 = function () {var e = this.length;if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");for (var t = 0; t < e; t += 4) {da(this, t, t + 3), da(this, t + 1, t + 2);}return this;}, sa.prototype.swap64 = function () {var e = this.length;if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");for (var t = 0; t < e; t += 8) {da(this, t, t + 7), da(this, t + 1, t + 6), da(this, t + 2, t + 5), da(this, t + 3, t + 4);}return this;}, sa.prototype.toString = function () {var e = 0 | this.length;return 0 === e ? "" : 0 === arguments.length ? Ta(this, 0, e) : ga.apply(this, arguments);}, sa.prototype.equals = function (e) {if (!ha(e)) throw new TypeError("Argument must be a Buffer");return this === e || 0 === sa.compare(this, e);}, sa.prototype.inspect = function () {var e = "";return this.length > 0 && (e = this.toString("hex", 0, 50).match(/.{2}/g).join(" "), this.length > 50 && (e += " ... ")), "<Buffer " + e + ">";}, sa.prototype.compare = function (e, t, n, r, o) {if (!ha(e)) throw new TypeError("Argument must be a Buffer");if (void 0 === t && (t = 0), void 0 === n && (n = e ? e.length : 0), void 0 === r && (r = 0), void 0 === o && (o = this.length), t < 0 || n > e.length || r < 0 || o > this.length) throw new RangeError("out of range index");if (r >= o && t >= n) return 0;if (r >= o) return -1;if (t >= n) return 1;if (this === e) return 0;for (var i = (o >>>= 0) - (r >>>= 0), s = (n >>>= 0) - (t >>>= 0), a = Math.min(i, s), u = this.slice(r, o), c = e.slice(t, n), l = 0; l < a; ++l) {if (u[l] !== c[l]) {i = u[l], s = c[l];break;}}return i < s ? -1 : s < i ? 1 : 0;}, sa.prototype.includes = function (e, t, n) {return -1 !== this.indexOf(e, t, n);}, sa.prototype.indexOf = function (e, t, n) {return ma(this, e, t, n, !0);}, sa.prototype.lastIndexOf = function (e, t, n) {return ma(this, e, t, n, !1);}, sa.prototype.write = function (e, t, n, r) {if (void 0 === t) r = "utf8", n = this.length, t = 0;else if (void 0 === n && "string" == typeof t) r = t, n = this.length, t = 0;else {if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t |= 0, isFinite(n) ? (n |= 0, void 0 === r && (r = "utf8")) : (r = n, n = void 0);}var o = this.length - t;if ((void 0 === n || n > o) && (n = o), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");r || (r = "utf8");for (var i = !1;;) {switch (r) {case "hex":return va(this, e, t, n);case "utf8":case "utf-8":return _a(this, e, t, n);case "ascii":return Ca(this, e, t, n);case "latin1":case "binary":return Ia(this, e, t, n);case "base64":return Ma(this, e, t, n);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return Sa(this, e, t, n);default:if (i) throw new TypeError("Unknown encoding: " + r);r = ("" + r).toLowerCase(), i = !0;}}}, sa.prototype.toJSON = function () {return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };};function Ea(e, t, n) {var r = "";n = Math.min(e.length, n);for (var o = t; o < n; ++o) {r += String.fromCharCode(127 & e[o]);}return r;}function ka(e, t, n) {var r = "";n = Math.min(e.length, n);for (var o = t; o < n; ++o) {r += String.fromCharCode(e[o]);}return r;}function wa(e, t, n) {var r = e.length;(!t || t < 0) && (t = 0), (!n || n < 0 || n > r) && (n = r);for (var o = "", i = t; i < n; ++i) {o += Ua(e[i]);}return o;}function Aa(e, t, n) {for (var r = e.slice(t, n), o = "", i = 0; i < r.length; i += 2) {o += String.fromCharCode(r[i] + 256 * r[i + 1]);}return o;}function Ra(e, t, n) {if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");if (e + t > n) throw new RangeError("Trying to access beyond buffer length");}function Oa(e, t, n, r, o, i) {if (!ha(e)) throw new TypeError('"buffer" argument must be a Buffer instance');if (t > o || t < i) throw new RangeError('"value" argument is out of bounds');if (n + r > e.length) throw new RangeError("Index out of range");}function La(e, t, n, r) {t < 0 && (t = 65535 + t + 1);for (var o = 0, i = Math.min(e.length - n, 2); o < i; ++o) {e[n + o] = (t & 255 << 8 * (r ? o : 1 - o)) >>> 8 * (r ? o : 1 - o);}}function Na(e, t, n, r) {t < 0 && (t = 4294967295 + t + 1);for (var o = 0, i = Math.min(e.length - n, 4); o < i; ++o) {e[n + o] = t >>> 8 * (r ? o : 3 - o) & 255;}}function ba(e, t, n, r, o, i) {if (n + r > e.length) throw new RangeError("Index out of range");if (n < 0) throw new RangeError("Index out of range");}function Pa(e, t, n, r, o) {return o || ba(e, 0, n, 4), ta(e, t, n, r, 23, 4), n + 4;}function Ga(e, t, n, r, o) {return o || ba(e, 0, n, 8), ta(e, t, n, r, 52, 8), n + 8;}sa.prototype.slice = function (e, t) {var n,r = this.length;if ((e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e), sa.TYPED_ARRAY_SUPPORT) (n = this.subarray(e, t)).__proto__ = sa.prototype;else {var o = t - e;n = new sa(o, void 0);for (var i = 0; i < o; ++i) {n[i] = this[i + e];}}return n;}, sa.prototype.readUIntLE = function (e, t, n) {e |= 0, t |= 0, n || Ra(e, t, this.length);for (var r = this[e], o = 1, i = 0; ++i < t && (o *= 256);) {r += this[e + i] * o;}return r;}, sa.prototype.readUIntBE = function (e, t, n) {e |= 0, t |= 0, n || Ra(e, t, this.length);for (var r = this[e + --t], o = 1; t > 0 && (o *= 256);) {r += this[e + --t] * o;}return r;}, sa.prototype.readUInt8 = function (e, t) {return t || Ra(e, 1, this.length), this[e];}, sa.prototype.readUInt16LE = function (e, t) {return t || Ra(e, 2, this.length), this[e] | this[e + 1] << 8;}, sa.prototype.readUInt16BE = function (e, t) {return t || Ra(e, 2, this.length), this[e] << 8 | this[e + 1];}, sa.prototype.readUInt32LE = function (e, t) {return t || Ra(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];}, sa.prototype.readUInt32BE = function (e, t) {return t || Ra(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);}, sa.prototype.readIntLE = function (e, t, n) {e |= 0, t |= 0, n || Ra(e, t, this.length);for (var r = this[e], o = 1, i = 0; ++i < t && (o *= 256);) {r += this[e + i] * o;}return r >= (o *= 128) && (r -= Math.pow(2, 8 * t)), r;}, sa.prototype.readIntBE = function (e, t, n) {e |= 0, t |= 0, n || Ra(e, t, this.length);for (var r = t, o = 1, i = this[e + --r]; r > 0 && (o *= 256);) {i += this[e + --r] * o;}return i >= (o *= 128) && (i -= Math.pow(2, 8 * t)), i;}, sa.prototype.readInt8 = function (e, t) {return t || Ra(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];}, sa.prototype.readInt16LE = function (e, t) {t || Ra(e, 2, this.length);var n = this[e] | this[e + 1] << 8;return 32768 & n ? 4294901760 | n : n;}, sa.prototype.readInt16BE = function (e, t) {t || Ra(e, 2, this.length);var n = this[e + 1] | this[e] << 8;return 32768 & n ? 4294901760 | n : n;}, sa.prototype.readInt32LE = function (e, t) {return t || Ra(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;}, sa.prototype.readInt32BE = function (e, t) {return t || Ra(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];}, sa.prototype.readFloatLE = function (e, t) {return t || Ra(e, 4, this.length), ea(this, e, !0, 23, 4);}, sa.prototype.readFloatBE = function (e, t) {return t || Ra(e, 4, this.length), ea(this, e, !1, 23, 4);}, sa.prototype.readDoubleLE = function (e, t) {return t || Ra(e, 8, this.length), ea(this, e, !0, 52, 8);}, sa.prototype.readDoubleBE = function (e, t) {return t || Ra(e, 8, this.length), ea(this, e, !1, 52, 8);}, sa.prototype.writeUIntLE = function (e, t, n, r) {(e = +e, t |= 0, n |= 0, r) || Oa(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);var o = 1,i = 0;for (this[t] = 255 & e; ++i < n && (o *= 256);) {this[t + i] = e / o & 255;}return t + n;}, sa.prototype.writeUIntBE = function (e, t, n, r) {(e = +e, t |= 0, n |= 0, r) || Oa(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);var o = n - 1,i = 1;for (this[t + o] = 255 & e; --o >= 0 && (i *= 256);) {this[t + o] = e / i & 255;}return t + n;}, sa.prototype.writeUInt8 = function (e, t, n) {return e = +e, t |= 0, n || Oa(this, e, t, 1, 255, 0), sa.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1;}, sa.prototype.writeUInt16LE = function (e, t, n) {return e = +e, t |= 0, n || Oa(this, e, t, 2, 65535, 0), sa.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : La(this, e, t, !0), t + 2;}, sa.prototype.writeUInt16BE = function (e, t, n) {return e = +e, t |= 0, n || Oa(this, e, t, 2, 65535, 0), sa.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : La(this, e, t, !1), t + 2;}, sa.prototype.writeUInt32LE = function (e, t, n) {return e = +e, t |= 0, n || Oa(this, e, t, 4, 4294967295, 0), sa.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : Na(this, e, t, !0), t + 4;}, sa.prototype.writeUInt32BE = function (e, t, n) {return e = +e, t |= 0, n || Oa(this, e, t, 4, 4294967295, 0), sa.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : Na(this, e, t, !1), t + 4;}, sa.prototype.writeIntLE = function (e, t, n, r) {if (e = +e, t |= 0, !r) {var o = Math.pow(2, 8 * n - 1);Oa(this, e, t, n, o - 1, -o);}var i = 0,s = 1,a = 0;for (this[t] = 255 & e; ++i < n && (s *= 256);) {e < 0 && 0 === a && 0 !== this[t + i - 1] && (a = 1), this[t + i] = (e / s >> 0) - a & 255;}return t + n;}, sa.prototype.writeIntBE = function (e, t, n, r) {if (e = +e, t |= 0, !r) {var o = Math.pow(2, 8 * n - 1);Oa(this, e, t, n, o - 1, -o);}var i = n - 1,s = 1,a = 0;for (this[t + i] = 255 & e; --i >= 0 && (s *= 256);) {e < 0 && 0 === a && 0 !== this[t + i + 1] && (a = 1), this[t + i] = (e / s >> 0) - a & 255;}return t + n;}, sa.prototype.writeInt8 = function (e, t, n) {return e = +e, t |= 0, n || Oa(this, e, t, 1, 127, -128), sa.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1;}, sa.prototype.writeInt16LE = function (e, t, n) {return e = +e, t |= 0, n || Oa(this, e, t, 2, 32767, -32768), sa.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : La(this, e, t, !0), t + 2;}, sa.prototype.writeInt16BE = function (e, t, n) {return e = +e, t |= 0, n || Oa(this, e, t, 2, 32767, -32768), sa.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : La(this, e, t, !1), t + 2;}, sa.prototype.writeInt32LE = function (e, t, n) {return e = +e, t |= 0, n || Oa(this, e, t, 4, 2147483647, -2147483648), sa.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : Na(this, e, t, !0), t + 4;}, sa.prototype.writeInt32BE = function (e, t, n) {return e = +e, t |= 0, n || Oa(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), sa.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : Na(this, e, t, !1), t + 4;}, sa.prototype.writeFloatLE = function (e, t, n) {return Pa(this, e, t, !0, n);}, sa.prototype.writeFloatBE = function (e, t, n) {return Pa(this, e, t, !1, n);}, sa.prototype.writeDoubleLE = function (e, t, n) {return Ga(this, e, t, !0, n);}, sa.prototype.writeDoubleBE = function (e, t, n) {return Ga(this, e, t, !1, n);}, sa.prototype.copy = function (e, t, n, r) {if (n || (n = 0), r || 0 === r || (r = this.length), t >= e.length && (t = e.length), t || (t = 0), r > 0 && r < n && (r = n), r === n) return 0;if (0 === e.length || 0 === this.length) return 0;if (t < 0) throw new RangeError("targetStart out of bounds");if (n < 0 || n >= this.length) throw new RangeError("sourceStart out of bounds");if (r < 0) throw new RangeError("sourceEnd out of bounds");r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);var o,i = r - n;if (this === e && n < t && t < r) for (o = i - 1; o >= 0; --o) {e[o + t] = this[o + n];} else if (i < 1e3 || !sa.TYPED_ARRAY_SUPPORT) for (o = 0; o < i; ++o) {e[o + t] = this[o + n];} else Uint8Array.prototype.set.call(e, this.subarray(n, n + i), t);return i;}, sa.prototype.fill = function (e, t, n, r) {if ("string" == typeof e) {if ("string" == typeof t ? (r = t, t = 0, n = this.length) : "string" == typeof n && (r = n, n = this.length), 1 === e.length) {var o = e.charCodeAt(0);o < 256 && (e = o);}if (void 0 !== r && "string" != typeof r) throw new TypeError("encoding must be a string");if ("string" == typeof r && !sa.isEncoding(r)) throw new TypeError("Unknown encoding: " + r);} else "number" == typeof e && (e &= 255);if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");if (n <= t) return this;var i;if (t >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0), "number" == typeof e) for (i = t; i < n; ++i) {this[i] = e;} else {var s = ha(e) ? e : xa(new sa(e, r).toString()),a = s.length;for (i = 0; i < n - t; ++i) {this[i + t] = s[i % a];}}return this;};var qa = /[^+\/0-9A-Za-z-_]/g;function Ua(e) {return e < 16 ? "0" + e.toString(16) : e.toString(16);}function xa(e, t) {var n;t = t || Infinity;for (var r = e.length, o = null, i = [], s = 0; s < r; ++s) {if ((n = e.charCodeAt(s)) > 55295 && n < 57344) {if (!o) {if (n > 56319) {(t -= 3) > -1 && i.push(239, 191, 189);continue;}if (s + 1 === r) {(t -= 3) > -1 && i.push(239, 191, 189);continue;}o = n;continue;}if (n < 56320) {(t -= 3) > -1 && i.push(239, 191, 189), o = n;continue;}n = 65536 + (o - 55296 << 10 | n - 56320);} else o && (t -= 3) > -1 && i.push(239, 191, 189);if (o = null, n < 128) {if ((t -= 1) < 0) break;i.push(n);} else if (n < 2048) {if ((t -= 2) < 0) break;i.push(n >> 6 | 192, 63 & n | 128);} else if (n < 65536) {if ((t -= 3) < 0) break;i.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128);} else {if (!(n < 1114112)) throw new Error("Invalid code point");if ((t -= 4) < 0) break;i.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128);}}return i;}function Fa(e) {return function (e) {var t, n, r, o, i, s;Xs || Js();var a = e.length;if (a % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");i = "=" === e[a - 2] ? 2 : "=" === e[a - 1] ? 1 : 0, s = new Ws(3 * a / 4 - i), r = i > 0 ? a - 4 : a;var u = 0;for (t = 0, n = 0; t < r; t += 4, n += 3) {o = zs[e.charCodeAt(t)] << 18 | zs[e.charCodeAt(t + 1)] << 12 | zs[e.charCodeAt(t + 2)] << 6 | zs[e.charCodeAt(t + 3)], s[u++] = o >> 16 & 255, s[u++] = o >> 8 & 255, s[u++] = 255 & o;}return 2 === i ? (o = zs[e.charCodeAt(t)] << 2 | zs[e.charCodeAt(t + 1)] >> 4, s[u++] = 255 & o) : 1 === i && (o = zs[e.charCodeAt(t)] << 10 | zs[e.charCodeAt(t + 1)] << 4 | zs[e.charCodeAt(t + 2)] >> 2, s[u++] = o >> 8 & 255, s[u++] = 255 & o), s;}(function (e) {if ((e = function (e) {return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");}(e).replace(qa, "")).length < 2) return "";for (; e.length % 4 != 0;) {e += "=";}return e;}(e));}function Ha(e, t, n, r) {for (var o = 0; o < r && !(o + n >= t.length || o >= e.length); ++o) {t[o + n] = e[o];}return o;}function Ba(e) {return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);}var Ka = function (e) {function t() {var e;return r(this, t), (e = m(this, l(t).call(this))).retry = 2, e._request = e.promisify(wx.request), e;}return c(t, e), i(t, [{ key: "request", value: function value(e) {return this._checkOptions(e), this._initOptions(e), e = u({}, e, { responseType: "text" }), this._requestWithRetry(e);} }, { key: "_requestWithRetry", value: function value(e) {var t = this,n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;return this._request(e).then(this._handleResolve).catch(function (r) {if (X(r.errMsg)) {if (r.errMsg.includes("abort")) return Bo({});if (r.errMsg.includes("timeout")) return t.retry > 0 && n < t.retry ? t._requestWithRetry(e, ++n) : Ko(new at({ code: on, message: r.errMsg }));if (r.errMsg.includes("fail")) return t.retry > 0 && n < t.retry ? t._requestWithRetry(e, ++n) : Ko(new at({ code: rn, message: r.errMsg }));}return Ko(new at(u({ code: fn, message: r.message }, r)));});} }, { key: "_handleResolve", value: function value(e) {var t = e.data,n = t.error_code,r = t.ErrorCode;return "number" == typeof n && (r = n), r !== Ae.SUCCESS && (e.data.ErrorCode = Number("".concat(r))), e;} }, { key: "promisify", value: function value(e) {return function (t) {return new Promise(function (n, r) {var o = e(Object.assign({}, t, { success: n, fail: r }));t.updateAbort && t.updateAbort(function () {o && ne(o.abort) && o.abort();});});};} }]), t;}(js),Va = function () {function e() {r(this, e), this.request = 0, this.success = 0, this.fail = 0, this.reportRate = 10, this.requestTimeCost = [];}return i(e, [{ key: "report", value: function value() {if (1 !== this.request) {if (this.request % this.reportRate != 0) return null;var e = this.avgRequestTime(),t = "runLoop reports: success=".concat(this.success, ",fail=").concat(this.fail, ",total=").concat(this.request, ",avg=").concat(e, ",cur=").concat(this.requestTimeCost[this.requestTimeCost.length - 1], ",max=").concat(Math.max.apply(null, this.requestTimeCost), ",min=").concat(Math.min.apply(null, this.requestTimeCost));Y.log(t);}} }, { key: "setRequestTime", value: function value(e, t) {var n = Math.abs(t - e);100 === this.requestTimeCost.length && this.requestTimeCost.shift(), this.requestTimeCost.push(n);} }, { key: "avgRequestTime", value: function value() {for (var e, t = this.requestTimeCost.length, n = 0, r = 0; r < t; r++) {n += this.requestTimeCost[r];}return e = n / t, Math.round(100 * e) / 100;} }]), e;}(),ja = Ks.create({ timeout: 6e3, headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" } });ja.interceptors.response.use(function (e) {var t = e.data,n = t.error_code,r = t.ErrorCode;return W(n) && (r = n), r !== Ae.SUCCESS && (e.data.ErrorCode = Number(r)), e;}, function (e) {return "Network Error" === e.message && (!0 === ja.defaults.withCredentials && Y.warn("Network Error, try to close `IMAxiosAVChatroom.defaults.withCredentials` to false. (IMAxiosAVChatroom.js)"), ja.defaults.withCredentials = !1), Promise.reject(e);});var $a = Ks.CancelToken,Ya = function () {function e(t) {r(this, e), this._initializeOptions(t), this._initializeMembers(), this.status = new Va();}return i(e, [{ key: "destructor", value: function value() {clearTimeout(this._seedID);var e = this._index();for (var t in this) {Object.prototype.hasOwnProperty.call(this, t) && (this[t] = null);}return e;} }, { key: "setIndex", value: function value(e) {this._index = e;} }, { key: "getIndex", value: function value() {return this._index;} }, { key: "isRunning", value: function value() {return !this._stoped;} }, { key: "_initializeOptions", value: function value(e) {this.options = e;} }, { key: "_initializeMembers", value: function value() {this._index = -1, this._seedID = 0, this._requestStatus = !1, this._stoped = !1, this._intervalTime = 0, this._intervalIncreaseStep = 1e3, this._intervalDecreaseStep = 1e3, this._intervalTimeMax = 5e3, this._protectTimeout = 3e3, this._getNoticeSeq = this.options.getNoticeSeq, this._retryCount = 0, this._responseTime = Date.now(), this._responseTimeThreshold = 2e3, this.options.isAVChatRoomLoop ? this.requestor = ja : this.requestor = Vs, Y.log("XHRRunLoop._initializeMembers isAVChatRoomLoop=".concat(!!this.options.isAVChatRoomLoop)), this.abort = null;} }, { key: "start", value: function value() {0 === this._seedID ? (this._stoped = !1, this._send()) : Y.log('XHRRunLoop.start(), XHRRunLoop is running now, if you want to restart runLoop , please run "stop()" first.');} }, { key: "_reset", value: function value() {Y.log("XHRRunLoop._reset(), reset long poll _intervalTime", this._intervalTime), this.stop(), this.start();} }, { key: "_intervalTimeIncrease", value: function value() {this._intervalTime !== this._responseTimeThreshold && (this._intervalTime < this._responseTimeThreshold && (this._intervalTime += this._intervalIncreaseStep), this._intervalTime > this._responseTimeThreshold && (this._intervalTime = this._responseTimeThreshold));} }, { key: "_intervalTimeDecrease", value: function value() {0 !== this._intervalTime && (this._intervalTime > 0 && (this._intervalTime -= this._intervalDecreaseStep), this._intervalTime < 0 && (this._intervalTime = 0));} }, { key: "_intervalTimeAdjustment", value: function value() {var e = Date.now();100 * Math.floor((e - this._responseTime) / 100) <= this._responseTimeThreshold ? this._intervalTimeIncrease() : this._intervalTimeDecrease(), this._responseTime = e;} }, { key: "_intervalTimeAdjustmentBaseOnResponseData", value: function value(e) {e.ErrorCode === Ae.SUCCESS ? this._intervalTimeDecrease() : this._intervalTimeIncrease();} }, { key: "_send", value: function value() {var e = this;if (!0 !== this._requestStatus) {this._requestStatus = !0, this.status.request++, "function" == typeof this.options.before && this.options.before(this.options.pack.requestData);var t = Date.now(),n = 0;this.requestor.request({ url: this.options.pack.getUrl(), data: this.options.pack.requestData, method: this.options.pack.method, cancelToken: new $a(function (t) {e.abort = t;}) }).then(function (r) {if (e._intervalTimeAdjustmentBaseOnResponseData.bind(e)(r.data), e._retryCount > 0 && (e._retryCount = 0), e.status.success++, n = Date.now(), e.status.setRequestTime(t, n), r.data.timecost = n - t, "function" == typeof e.options.success) try {e.options.success({ pack: e.options.pack, error: !1, data: e.options.pack.callback(r.data) });} catch (o) {Y.warn("XHRRunLoop._send(), error:", o);}e._requestStatus = !1, !1 === e._stoped && (e._seedID = setTimeout(e._send.bind(e), e._intervalTime)), e.status.report();}).catch(function (r) {if (e.status.fail++, e._retryCount++, e._intervalTimeAdjustment.bind(e)(), !1 === e._stoped && (e._seedID = setTimeout(e._send.bind(e), e._intervalTime)), e._requestStatus = !1, "function" == typeof e.options.fail && void 0 !== r.request) try {e.options.fail({ pack: e.options.pack, error: r, data: !1 });} catch (o) {Y.warn("XHRRunLoop._send(), fail callback error:"), Y.error(o);}n = Date.now(), e.status.setRequestTime(t, n), e.status.report();});}} }, { key: "stop", value: function value() {this._clearAllTimeOut(), this._stoped = !0;} }, { key: "_clearAllTimeOut", value: function value() {clearTimeout(this._seedID), this._seedID = 0;} }]), e;}(),za = function () {function e(t) {r(this, e), this._initializeOptions(t), this._initializeMembers(), this.status = new Va();}return i(e, [{ key: "destructor", value: function value() {clearTimeout(this._seedID);var e = this._index();for (var t in this) {Object.prototype.hasOwnProperty.call(this, t) && (this[t] = null);}return e;} }, { key: "setIndex", value: function value(e) {this._index = e;} }, { key: "isRunning", value: function value() {return !this._stoped;} }, { key: "getIndex", value: function value() {return this._index;} }, { key: "_initializeOptions", value: function value(e) {this.options = e;} }, { key: "_initializeMembers", value: function value() {this._index = -1, this._seedID = 0, this._requestStatus = !1, this._stoped = !1, this._intervalTime = 0, this._intervalIncreaseStep = 1e3, this._intervalDecreaseStep = 1e3, this._intervalTimeMax = 5e3, this._protectTimeout = 3e3, this._getNoticeSeq = this.options.getNoticeSeq, this._retryCount = 0, this._responseTime = Date.now(), this._responseTimeThreshold = 2e3, this.requestor = new Ka(), this.abort = null;} }, { key: "start", value: function value() {0 === this._seedID ? (this._stoped = !1, this._send()) : Y.log('WXRunLoop.start(): WXRunLoop is running now, if you want to restart runLoop , please run "stop()" first.');} }, { key: "_reset", value: function value() {Y.log("WXRunLoop.reset(), long poll _intervalMaxRate", this._intervalMaxRate), this.stop(), this.start();} }, { key: "_intervalTimeIncrease", value: function value() {this._intervalTime !== this._responseTimeThreshold && (this._intervalTime < this._responseTimeThreshold && (this._intervalTime += this._intervalIncreaseStep), this._intervalTime > this._responseTimeThreshold && (this._intervalTime = this._responseTimeThreshold));} }, { key: "_intervalTimeDecrease", value: function value() {0 !== this._intervalTime && (this._intervalTime > 0 && (this._intervalTime -= this._intervalDecreaseStep), this._intervalTime < 0 && (this._intervalTime = 0));} }, { key: "_intervalTimeAdjustment", value: function value() {var e = Date.now();100 * Math.floor((e - this._responseTime) / 100) <= this._responseTimeThreshold ? this._intervalTimeIncrease() : this._intervalTimeDecrease(), this._responseTime = e;} }, { key: "_intervalTimeAdjustmentBaseOnResponseData", value: function value(e) {e.ErrorCode === Ae.SUCCESS ? this._intervalTimeDecrease() : this._intervalTimeIncrease();} }, { key: "_send", value: function value() {var e = this;if (!0 !== this._requestStatus) {var t = this;this._requestStatus = !0, this.status.request++, "function" == typeof this.options.before && this.options.before(t.options.pack.requestData);var n = Date.now(),r = 0;this.requestor.request({ url: t.options.pack.getUrl(), data: t.options.pack.requestData, method: t.options.pack.method, updateAbort: function updateAbort(t) {e.abort = t;} }).then(function (o) {if (t._intervalTimeAdjustmentBaseOnResponseData.bind(e)(o.data), t._retryCount > 0 && (t._retryCount = 0), e.status.success++, r = Date.now(), e.status.setRequestTime(n, r), o.data.timecost = r - n, "function" == typeof t.options.success) try {e.options.success({ pack: e.options.pack, error: !1, data: e.options.pack.callback(o.data) });} catch (i) {Y.warn("WXRunLoop._send(), error:", i);}t._requestStatus = !1, !1 === t._stoped && (t._seedID = setTimeout(t._send.bind(t), t._intervalTime)), e.status.report();}).catch(function (o) {if (e.status.fail++, t._retryCount++, t._intervalTimeAdjustment.bind(e)(), !1 === t._stoped && (t._seedID = setTimeout(t._send.bind(t), t._intervalTime)), t._requestStatus = !1, "function" == typeof t.options.fail) try {e.options.fail({ pack: e.options.pack, error: o, data: !1 });} catch (i) {Y.warn("WXRunLoop._send(), fail callback error:"), Y.error(i);}r = Date.now(), e.status.setRequestTime(n, r), e.status.report();});}} }, { key: "stop", value: function value() {this._clearAllTimeOut(), this._stoped = !0;} }, { key: "_clearAllTimeOut", value: function value() {clearTimeout(this._seedID), this._seedID = 0;} }]), e;}(),Wa = function () {function e(t) {r(this, e), this.tim = t, this.httpConnection = k ? new Ka() : new $s(), this.keepAliveConnections = [];}return i(e, [{ key: "initializeListener", value: function value() {this.tim.innerEmitter.on(Co, this._stopAllRunLoop, this);} }, { key: "request", value: function value(e) {var t = { url: e.url, data: e.requestData, method: e.method, callback: e.callback };return this.httpConnection.request(t).then(function (t) {return t.data = e.callback(t.data), t.data.errorCode !== Ae.SUCCESS ? Ko(new at({ code: t.data.errorCode, message: t.data.errorInfo })) : t;});} }, { key: "createRunLoop", value: function value(e) {var t = this.createKeepAliveConnection(e);return t.setIndex(this.keepAliveConnections.push(t) - 1), t;} }, { key: "stopRunLoop", value: function value(e) {e.stop();} }, { key: "_stopAllRunLoop", value: function value() {for (var e = this.keepAliveConnections.length, t = 0; t < e; t++) {this.keepAliveConnections[t].stop();}} }, { key: "destroyRunLoop", value: function value(e) {e.stop();var t = e.destructor();this.keepAliveConnections.slice(t, 1);} }, { key: "startRunLoopExclusive", value: function value(e) {for (var t = e.getIndex(), n = 0; n < this.keepAliveConnections.length; n++) {n !== t && this.keepAliveConnections[n].stop();}e.start();} }, { key: "createKeepAliveConnection", value: function value(e) {return k ? new za(e) : (this.tim.options.runLoopNetType === $e || this.tim.options.runLoopNetType, new Ya(e));} }, { key: "clearAll", value: function value() {this.conn.cancelAll();} }, { key: "reset", value: function value() {this.keepAliveConnections = [];} }]), e;}(),Xa = function () {function t(e) {r(this, t), this.tim = e, this.tim.innerEmitter.on(So, this._onErrorDetected, this);}return i(t, [{ key: "_onErrorDetected", value: function value(t) {var n = t.data;n.code ? Y.warn("Oops! code:".concat(n.code, " message:").concat(n.message)) : Y.warn("Oops! message:".concat(n.message, " stack:").concat(n.stack)), this.tim.outerEmitter.emit(e.ERROR, n);} }]), t;}(),Ja = function () {function e(n) {var o = this;r(this, e), Te(n) || (this.userID = n.userID || "", this.nick = n.nick || "", this.gender = n.gender || "", this.birthday = n.birthday || 0, this.location = n.location || "", this.selfSignature = n.selfSignature || "", this.allowType = n.allowType || t.ALLOW_TYPE_ALLOW_ANY, this.language = n.language || 0, this.avatar = n.avatar || "", this.messageSettings = n.messageSettings || 0, this.adminForbidType = n.adminForbidType || t.FORBID_TYPE_NONE, this.level = n.level || 0, this.role = n.role || 0, this.lastUpdatedTime = 0, this.profileCustomField = [], Te(n.profileCustomField) || n.profileCustomField.forEach(function (e) {o.profileCustomField.push({ key: e.key, value: e.value });}));}return i(e, [{ key: "validate", value: function value(e) {var t = !0,n = "";if (Te(e)) return { valid: !1, tips: "empty options" };if (e.profileCustomField) for (var r = e.profileCustomField.length, o = null, i = 0; i < r; i++) {if (o = e.profileCustomField[i], !X(o.key) || -1 === o.key.indexOf("Tag_Profile_Custom")) return { valid: !1, tips: "自定义资料字段的前缀必须是 Tag_Profile_Custom" };if (!X(o.value)) return { valid: !1, tips: "自定义资料字段的 value 必须是字符串" };}for (var s in e) {if (Object.prototype.hasOwnProperty.call(e, s)) {if ("profileCustomField" === s) continue;if (Te(e[s]) && !X(e[s]) && !W(e[s])) {n = "key:" + s + ", invalid value:" + e[s], t = !1;continue;}switch (s) {case "nick":X(e[s]) || (n = "nick should be a string", t = !1), pe(e[s]) > 500 && (n = "nick name limited: must less than or equal to ".concat(500, " bytes, current size: ").concat(pe(e[s]), " bytes"), t = !1);break;case "gender":de(Xe, e.gender) || (n = "key:gender, invalid value:" + e.gender, t = !1);break;case "birthday":W(e.birthday) || (n = "birthday should be a number", t = !1);break;case "location":X(e.location) || (n = "location should be a string", t = !1);break;case "selfSignature":X(e.selfSignature) || (n = "selfSignature should be a string", t = !1);break;case "allowType":de(Qe, e.allowType) || (n = "key:allowType, invalid value:" + e.allowType, t = !1);break;case "language":W(e.language) || (n = "language should be a number", t = !1);break;case "avatar":X(e.avatar) || (n = "avatar should be a string", t = !1);break;case "messageSettings":0 !== e.messageSettings && 1 !== e.messageSettings && (n = "messageSettings should be 0 or 1", t = !1);break;case "adminForbidType":de(Je, e.adminForbidType) || (n = "key:adminForbidType, invalid value:" + e.adminForbidType, t = !1);break;case "level":W(e.level) || (n = "level should be a number", t = !1);break;case "role":W(e.role) || (n = "role should be a number", t = !1);break;default:n = "unknown key:" + s + "  " + e[s], t = !1;}}}return { valid: t, tips: n };} }]), e;}(),Qa = function () {function t(e) {r(this, t), this.userController = e, this.TAG = "profile", this.Actions = { Q: "query", U: "update" }, this.accountProfileMap = new Map(), this.expirationTime = 864e5;}return i(t, [{ key: "setExpirationTime", value: function value(e) {this.expirationTime = e;} }, { key: "getUserProfile", value: function value(e) {var t = this,n = e.userIDList;e.fromAccount = this.userController.getMyAccount(), n.length > 100 && (Y.warn("ProfileHandler.getUserProfile 获取用户资料人数不能超过100人"), n.length = 100);for (var r, o = [], i = [], s = 0, a = n.length; s < a; s++) {r = n[s], this.userController.isMyFriend(r) && this._containsAccount(r) ? i.push(this._getProfileFromMap(r)) : o.push(r);}if (0 === o.length) return Bo(i);e.toAccount = o;var u = e.bFromGetMyProfile || !1,c = [];e.toAccount.forEach(function (e) {c.push({ toAccount: e, standardSequence: 0, customSequence: 0 });}), e.userItem = c;var l = new Qo();l.setMethod(Oi).setStart();var p = this.userController.generateConfig(this.TAG, this.Actions.Q, e);return this.userController.request(p).then(function (e) {l.setCode(0).setNetworkType(t.userController.getNetworkType()).setText(e.data.userProfileItem.length).setEnd(), Y.info("ProfileHandler.getUserProfile ok");var n = t._handleResponse(e).concat(i);return u ? (t.userController.onGotMyProfile(), new xo(n[0])) : new xo(n);}).catch(function (e) {return t.userController.probeNetwork().then(function (t) {var n = y(t, 2),r = n[0],o = n[1];l.setError(e, r, o).setEnd();}), Y.error("ProfileHandler.getUserProfile error:", e), Ko(e);});} }, { key: "getMyProfile", value: function value() {var e = this.userController.getMyAccount();if (Y.log("ProfileHandler.getMyProfile myAccount=" + e), this._fillMap(), this._containsAccount(e)) {var t = this._getProfileFromMap(e);return Y.debug("ProfileHandler.getMyProfile from cache, myProfile:" + JSON.stringify(t)), this.userController.onGotMyProfile(), Bo(t);}return this.getUserProfile({ fromAccount: e, userIDList: [e], bFromGetMyProfile: !0 });} }, { key: "_handleResponse", value: function value(e) {for (var t, n, r = ae.now(), o = e.data.userProfileItem, i = [], s = 0, a = o.length; s < a; s++) {"@TLS#NOT_FOUND" !== o[s].to && "" !== o[s].to && (t = o[s].to, n = this._updateMap(t, this._getLatestProfileFromResponse(t, o[s].profileItem)), i.push(n));}return Y.log("ProfileHandler._handleResponse cost " + (ae.now() - r) + " ms"), i;} }, { key: "_getLatestProfileFromResponse", value: function value(e, t) {var n = {};if (n.userID = e, n.profileCustomField = [], !Te(t)) for (var r = 0, o = t.length; r < o; r++) {if (t[r].tag.indexOf("Tag_Profile_Custom") > -1) n.profileCustomField.push({ key: t[r].tag, value: t[r].value });else switch (t[r].tag) {case We.NICK:n.nick = t[r].value;break;case We.GENDER:n.gender = t[r].value;break;case We.BIRTHDAY:n.birthday = t[r].value;break;case We.LOCATION:n.location = t[r].value;break;case We.SELFSIGNATURE:n.selfSignature = t[r].value;break;case We.ALLOWTYPE:n.allowType = t[r].value;break;case We.LANGUAGE:n.language = t[r].value;break;case We.AVATAR:n.avatar = t[r].value;break;case We.MESSAGESETTINGS:n.messageSettings = t[r].value;break;case We.ADMINFORBIDTYPE:n.adminForbidType = t[r].value;break;case We.LEVEL:n.level = t[r].value;break;case We.ROLE:n.role = t[r].value;break;default:Y.warn("ProfileHandler._handleResponse unkown tag->", t[r].tag, t[r].value);}}return n;} }, { key: "updateMyProfile", value: function value(t) {var n = this,r = new Ja().validate(t);if (!r.valid) return Y.error("ProfileHandler.updateMyProfile info:".concat(r.tips, "，请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#updateMyProfile")), Ko({ code: Qt, message: cr });var o = [];for (var i in t) {Object.prototype.hasOwnProperty.call(t, i) && ("profileCustomField" === i ? t.profileCustomField.forEach(function (e) {o.push({ tag: e.key, value: e.value });}) : o.push({ tag: We[i.toUpperCase()], value: t[i] }));}if (0 === o.length) return Y.error("ProfileHandler.updateMyProfile info:".concat(lr, "，请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#updateMyProfile")), Ko({ code: Zt, message: lr });var s = this.userController.generateConfig(this.TAG, this.Actions.U, { fromAccount: this.userController.getMyAccount(), profileItem: o });return this.userController.request(s).then(function (r) {Y.info("ProfileHandler.updateMyProfile ok");var o = n._updateMap(n.userController.getMyAccount(), t);return n.userController.emitOuterEvent(e.PROFILE_UPDATED, [o]), Bo(o);}).catch(function (e) {return Y.error("ProfileHandler.updateMyProfile error:", e), Ko(e);});} }, { key: "onProfileModified", value: function value(t) {var n = t.data;if (!Te(n)) {var r,o,i = n.length;Y.info("ProfileHandler.onProfileModified length=" + i);for (var s = [], a = 0; a < i; a++) {r = n[a].userID, o = this._updateMap(r, this._getLatestProfileFromResponse(r, n[a].profileList)), s.push(o);}this.userController.emitInnerEvent(ko, s), this.userController.emitOuterEvent(e.PROFILE_UPDATED, s);}} }, { key: "_fillMap", value: function value() {if (0 === this.accountProfileMap.size) {for (var e = this._getCachedProfiles(), t = Date.now(), n = 0, r = e.length; n < r; n++) {t - e[n].lastUpdatedTime < this.expirationTime && this.accountProfileMap.set(e[n].userID, e[n]);}Y.log("ProfileHandler._fillMap from cache, map.size=" + this.accountProfileMap.size);}} }, { key: "_updateMap", value: function value(e, t) {var n,r = Date.now();return this._containsAccount(e) ? (n = this._getProfileFromMap(e), t.profileCustomField && _e(n.profileCustomField, t.profileCustomField), ue(n, t, ["profileCustomField"]), n.lastUpdatedTime = r) : (n = new Ja(t), (this.userController.isMyFriend(e) || e === this.userController.getMyAccount()) && (n.lastUpdatedTime = r, this.accountProfileMap.set(e, n))), this._flushMap(e === this.userController.getMyAccount()), n;} }, { key: "_flushMap", value: function value(e) {var t = v(this.accountProfileMap.values()),n = this.userController.tim.storage;Y.debug("ProfileHandler._flushMap length=".concat(t.length, " flushAtOnce=").concat(e)), n.setItem(this.TAG, t, e);} }, { key: "_containsAccount", value: function value(e) {return this.accountProfileMap.has(e);} }, { key: "_getProfileFromMap", value: function value(e) {return this.accountProfileMap.get(e);} }, { key: "_getCachedProfiles", value: function value() {var e = this.userController.tim.storage.getItem(this.TAG);return Te(e) ? [] : e;} }, { key: "onConversationsProfileUpdated", value: function value(e) {for (var t, n, r, o = [], i = 0, s = e.length; i < s; i++) {n = (t = e[i]).userID, this.userController.isMyFriend(n) && (this._containsAccount(n) ? (r = this._getProfileFromMap(n), ue(r, t) > 0 && o.push(n)) : o.push(t.userID));}0 !== o.length && (Y.info("ProfileHandler.onConversationsProfileUpdated toAccount:", o), this.getUserProfile({ userIDList: o }));} }, { key: "reset", value: function value() {this._flushMap(!0), this.accountProfileMap.clear();} }]), t;}(),Za = function () {function e(t) {r(this, e), this.options = t ? t.options : { enablePointer: !0 }, this.pointsList = {}, this.reportText = {}, this.maxNameLen = 0, this.gapChar = "-", this.log = console.log, this.currentTask = "";}return i(e, [{ key: "newTask", value: function value(e) {!1 !== this.options.enablePointer && (e || (e = ["task", this._timeFormat()].join("-")), this.pointsList[e] = [], this.currentTask = e, console.log("Pointer new Task : ".concat(this.currentTask)));} }, { key: "deleteTask", value: function value(e) {!1 !== this.options.enablePointer && (e || (e = this.currentTask), this.pointsList[e].length = 0, delete this.pointsList[e]);} }, { key: "dot", value: function value() {var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",t = arguments.length > 1 ? arguments[1] : void 0;if (!1 !== this.options.enablePointer) {t = t || this.currentTask;var n = +new Date();this.maxNameLen = this.maxNameLen < e.length ? e.length : this.maxNameLen, this.flen = this.maxNameLen + 10, this.pointsList[t].push({ pointerName: e, time: n });}} }, { key: "_analisys", value: function value(e) {if (!1 !== this.options.enablePointer) {e = e || this.currentTask;for (var t = this.pointsList[e], n = t.length, r = [], o = [], i = 0; i < n; i++) {0 !== i && (o = this._analisysTowPoints(t[i - 1], t[i]), r.push(o.join("")));}return o = this._analisysTowPoints(t[0], t[n - 1], !0), r.push(o.join("")), r.join("");}} }, { key: "_analisysTowPoints", value: function value(e, t) {var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];if (!1 !== this.options.enablePointer) {var r = this.flen,o = t.time - e.time,i = o.toString(),s = e.pointerName + this.gapChar.repeat(r - e.pointerName.length),a = t.pointerName + this.gapChar.repeat(r - t.pointerName.length),u = this.gapChar.repeat(4 - i.length) + i,c = n ? ["%c", s, a, u, "ms\n%c"] : [s, a, u, "ms\n"];return c;}} }, { key: "report", value: function value(e) {if (!1 !== this.options.enablePointer) {e = e || this.currentTask;var t = this._analisys(e);this.pointsList = [];var n = this._timeFormat(),r = "Pointer[".concat(e, "(").concat(n, ")]"),o = 4 * this.maxNameLen,i = (o - r.length) / 2;console.log(["-".repeat(i), r, "-".repeat(i)].join("")), console.log("%c" + t, "color:#66a", "color:red", "color:#66a"), console.log("-".repeat(o));}} }, { key: "_timeFormat", value: function value() {var e = new Date(),t = this.zeroFix(e.getMonth() + 1, 2),n = this.zeroFix(e.getDate(), 2);return "".concat(t, "-").concat(n, " ").concat(e.getHours(), ":").concat(e.getSeconds(), ":").concat(e.getMinutes(), "~").concat(e.getMilliseconds());} }, { key: "zeroFix", value: function value(e, t) {return ("000000000" + e).slice(-t);} }, { key: "reportAll", value: function value() {if (!1 !== this.options.enablePointer) for (var e in this.pointsList) {Object.prototype.hasOwnProperty.call(this.pointsList, e) && this.eport(e);}} }]), e;}(),eu = function e(t, n) {r(this, e), this.userID = t;var o = {};if (o.userID = t, !Te(n)) for (var i = 0, s = n.length; i < s; i++) {switch (n[i].tag) {case We.NICK:o.nick = n[i].value;break;case We.GENDER:o.gender = n[i].value;break;case We.BIRTHDAY:o.birthday = n[i].value;break;case We.LOCATION:o.location = n[i].value;break;case We.SELFSIGNATURE:o.selfSignature = n[i].value;break;case We.ALLOWTYPE:o.allowType = n[i].value;break;case We.LANGUAGE:o.language = n[i].value;break;case We.AVATAR:o.avatar = n[i].value;break;case We.MESSAGESETTINGS:o.messageSettings = n[i].value;break;case We.ADMINFORBIDTYPE:o.adminForbidType = n[i].value;break;case We.LEVEL:o.level = n[i].value;break;case We.ROLE:o.role = n[i].value;break;default:Y.debug("snsProfileItem unkown tag->", n[i].tag);}}this.profile = new Ja(o);},tu = function () {function e(t) {r(this, e), this.userController = t, this.TAG = "friend", this.Actions = { G: "get", D: "delete" }, this.friends = new Map(), this.pointer = new Za();}return i(e, [{ key: "isMyFriend", value: function value(e) {var t = this.friends.has(e);return t || Y.debug("FriendHandler.isMyFriend " + e + " is not my friend"), t;} }, { key: "_transformFriendList", value: function value(e) {if (!Te(e) && !Te(e.infoItem)) {Y.info("FriendHandler._transformFriendList friendNum=" + e.friendNum);for (var t, n, r = e.infoItem, o = 0, i = r.length; o < i; o++) {n = r[o].infoAccount, t = new eu(n, r[o].snsProfileItem), this.friends.set(n, t);}}} }, { key: "_friends2map", value: function value(e) {var t = new Map();for (var n in e) {Object.prototype.hasOwnProperty.call(e, n) && t.set(n, e[n]);}return t;} }, { key: "getFriendList", value: function value() {var e = this,t = {};t.fromAccount = this.userController.getMyAccount(), Y.info("FriendHandler.getFriendList myAccount=" + t.fromAccount);var n = this.userController.generateConfig(this.TAG, this.Actions.G, t);return this.userController.request(n).then(function (t) {Y.info("FriendHandler.getFriendList ok"), e._transformFriendList(t.data);var n = v(e.friends.values());return Bo(n);}).catch(function (e) {return Y.error("FriendHandler.getFriendList error:", JSON.stringify(e)), Ko(e);});} }, { key: "deleteFriend", value: function value(e) {if (!Array.isArray(e.toAccount)) return Y.error("FriendHandler.deleteFriend options.toAccount 必需是数组"), Ko({ code: Jt, message: ur });e.toAccount.length > 1e3 && (Y.warn("FriendHandler.deleteFriend 删除好友人数不能超过1000人"), e.toAccount.length = 1e3);var t = this.userController.generateConfig(this.TAG, this.Actions.D, e);return this.userController.request(t).then(function (e) {return Y.info("FriendHandler.deleteFriend ok"), Bo();}).catch(function (e) {return Y.error("FriendHandler.deleteFriend error:", e), Ko(e);});} }]), e;}(),nu = function e(t) {r(this, e), Te || (this.userID = t.userID || "", this.timeStamp = t.timeStamp || 0);},ru = function () {function t(e) {r(this, t), this.userController = e, this.TAG = "blacklist", this.Actions = { G: "get", C: "create", D: "delete" }, this.blacklistMap = new Map(), this.startIndex = 0, this.maxLimited = 100, this.curruentSequence = 0;}return i(t, [{ key: "getBlacklist", value: function value() {var e = this,t = {};t.fromAccount = this.userController.getMyAccount(), t.maxLimited = this.maxLimited, t.startIndex = 0, t.lastSequence = this.curruentSequence;var n = new Qo();n.setMethod(Li).setStart();var r = this.userController.generateConfig(this.TAG, this.Actions.G, t);return this.userController.request(r).then(function (t) {var r = Te(t.data.blackListItem) ? 0 : t.data.blackListItem.length;return n.setCode(0).setNetworkType(e.userController.getNetworkType()).setText(r).setEnd(), Y.info("BlacklistHandler.getBlacklist ok"), e.curruentSequence = t.data.curruentSequence, e._handleResponse(t.data.blackListItem, !0), e._onBlacklistUpdated();}).catch(function (t) {return e.userController.probeNetwork().then(function (e) {var r = y(e, 2),o = r[0],i = r[1];n.setError(t, o, i).setEnd();}), Y.error("BlacklistHandler.getBlacklist error:", t), Ko(t);});} }, { key: "addBlacklist", value: function value(e) {var t = this;if (!Z(e.userIDList)) return Y.error("BlacklistHandler.addBlacklist options.userIDList 必需是数组"), Ko({ code: en, message: pr });var n = this.userController.tim.loginInfo.identifier;if (1 === e.userIDList.length && e.userIDList[0] === n) return Y.error("BlacklistHandler.addBlacklist 不能把自己拉黑"), Ko({ code: nn, message: fr });e.userIDList.includes(n) && (e.userIDList = e.userIDList.filter(function (e) {return e !== n;}), Y.warn("BlacklistHandler.addBlacklist 不能把自己拉黑，已过滤")), e.fromAccount = this.userController.getMyAccount(), e.toAccount = e.userIDList;var r = this.userController.generateConfig(this.TAG, this.Actions.C, e);return this.userController.request(r).then(function (e) {return Y.info("BlacklistHandler.addBlacklist ok"), t._handleResponse(e.data.resultItem, !0), t._onBlacklistUpdated();}).catch(function (e) {return Y.error("BlacklistHandler.addBlacklist error:", e), Ko(e);});} }, { key: "_handleResponse", value: function value(e, t) {if (!Te(e)) for (var n, r, o, i = 0, s = e.length; i < s; i++) {r = e[i].to, o = e[i].resultCode, (ee(o) || 0 === o) && (t ? ((n = this.blacklistMap.has(r) ? this.blacklistMap.get(r) : new nu()).userID = r, !Te(e[i].addBlackTimeStamp) && (n.timeStamp = e[i].addBlackTimeStamp), this.blacklistMap.set(r, n)) : this.blacklistMap.has(r) && (n = this.blacklistMap.get(r), this.blacklistMap.delete(r)));}Y.log("BlacklistHandler._handleResponse total=" + this.blacklistMap.size + " bAdd=" + t);} }, { key: "deleteBlacklist", value: function value(e) {var t = this;if (!Z(e.userIDList)) return Y.error("BlacklistHandler.deleteBlacklist options.userIDList 必需是数组"), Ko({ code: tn, message: hr });e.fromAccount = this.userController.getMyAccount(), e.toAccount = e.userIDList;var n = this.userController.generateConfig(this.TAG, this.Actions.D, e);return this.userController.request(n).then(function (e) {return Y.info("BlacklistHandler.deleteBlacklist ok"), t._handleResponse(e.data.resultItem, !1), t._onBlacklistUpdated();}).catch(function (e) {return Y.error("BlacklistHandler.deleteBlacklist error:", e), Ko(e);});} }, { key: "_onBlacklistUpdated", value: function value() {var t = v(this.blacklistMap.keys());return this.userController.emitOuterEvent(e.BLACKLIST_UPDATED, t), Bo(t);} }, { key: "handleBlackListDelAccount", value: function value(t) {for (var n, r = [], o = 0, i = t.length; o < i; o++) {n = t[o], this.blacklistMap.has(n) && (this.blacklistMap.delete(n), r.push(n));}r.length > 0 && (Y.log("BlacklistHandler.handleBlackListDelAccount delCount=" + r.length + " : " + r.join(",")), this.userController.emitOuterEvent(e.BLACKLIST_UPDATED, v(this.blacklistMap.keys())));} }, { key: "handleBlackListAddAccount", value: function value(t) {for (var n, r = [], o = 0, i = t.length; o < i; o++) {n = t[o], this.blacklistMap.has(n) || (this.blacklistMap.set(n, new nu({ userID: n })), r.push(n));}r.length > 0 && (Y.log("BlacklistHandler.handleBlackListAddAccount addCount=" + r.length + " : " + r.join(",")), this.userController.emitOuterEvent(e.BLACKLIST_UPDATED, v(this.blacklistMap.keys())));} }, { key: "reset", value: function value() {this.blacklistMap.clear(), this.startIndex = 0, this.maxLimited = 100, this.curruentSequence = 0;} }]), t;}(),ou = function () {function e(t) {r(this, e), this.userController = t, this.TAG = "applyC2C", this.Actions = { C: "create", G: "get", D: "delete", U: "update" };}return i(e, [{ key: "applyAddFriend", value: function value(e) {var t = this,n = this.userController.generateConfig(this.TAG, this.Actions.C, e),r = this.userController.request(n);return r.then(function (e) {t.userController.isActionSuccessful("applyAddFriend", t.Actions.C, e);}).catch(function (e) {}), r;} }, { key: "getPendency", value: function value(e) {var t = this,n = this.userController.generateConfig(this.TAG, this.Actions.G, e),r = this.userController.request(n);return r.then(function (e) {t.userController.isActionSuccessful("getPendency", t.Actions.G, e);}).catch(function (e) {}), r;} }, { key: "deletePendency", value: function value(e) {var t = this,n = this.userController.generateConfig(this.TAG, this.Actions.D, e),r = this.userController.request(n);return r.then(function (e) {t.userController.isActionSuccessful("deletePendency", t.Actions.D, e);}).catch(function (e) {}), r;} }, { key: "replyPendency", value: function value() {var e = this,t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},n = this.userController.generateConfig(this.TAG, this.Actions.U, t),r = this.userController.request(n);return r.then(function (t) {e.userController.isActionSuccessful("replyPendency", e.Actions.U, t);}).catch(function (e) {}), r;} }]), e;}(),iu = function (e) {function t(e) {var n;return r(this, t), (n = m(this, l(t).call(this, e))).profileHandler = new Qa(d(n)), n.friendHandler = new tu(d(n)), n.blacklistHandler = new ru(d(n)), n.applyC2CHandler = new ou(d(n)), n._initializeListener(), n;}return c(t, e), i(t, [{ key: "_initializeListener", value: function value(e) {var t = this.tim.innerEmitter;t.on(Br, this.onContextUpdated, this), t.on(po, this.onProfileModified, this), t.on(lo, this.onNewFriendMessages, this), t.on(To, this.onConversationsProfileUpdated, this);} }, { key: "onContextUpdated", value: function value(e) {var t = this.tim.context;!1 != !!t.a2Key && !1 != !!t.tinyID && (this.profileHandler.getMyProfile(), this.friendHandler.getFriendList(), this.blacklistHandler.getBlacklist());} }, { key: "onGotMyProfile", value: function value() {this.triggerReady();} }, { key: "onProfileModified", value: function value(e) {this.profileHandler.onProfileModified(e);} }, { key: "onNewFriendMessages", value: function value(e) {Y.debug("onNewFriendMessages", JSON.stringify(e.data)), Te(e.data.blackListDelAccount) || this.blacklistHandler.handleBlackListDelAccount(e.data.blackListDelAccount), Te(e.data.blackListAddAccount) || this.blacklistHandler.handleBlackListAddAccount(e.data.blackListAddAccount);} }, { key: "onConversationsProfileUpdated", value: function value(e) {this.profileHandler.onConversationsProfileUpdated(e.data);} }, { key: "getMyAccount", value: function value() {return this.tim.context.identifier;} }, { key: "isMyFriend", value: function value(e) {return this.friendHandler.isMyFriend(e);} }, { key: "generateConfig", value: function value(e, t, n) {return { name: e, action: t, param: n };} }, { key: "getMyProfile", value: function value() {return this.profileHandler.getMyProfile();} }, { key: "getUserProfile", value: function value(e) {return this.profileHandler.getUserProfile(e);} }, { key: "updateMyProfile", value: function value(e) {return this.profileHandler.updateMyProfile(e);} }, { key: "getFriendList", value: function value() {return this.friendHandler.getFriendList();} }, { key: "deleteFriend", value: function value(e) {return this.friendHandler.deleteFriend(e);} }, { key: "getBlacklist", value: function value() {return this.blacklistHandler.getBlacklist();} }, { key: "addBlacklist", value: function value(e) {return this.blacklistHandler.addBlacklist(e);} }, { key: "deleteBlacklist", value: function value(e) {return this.blacklistHandler.deleteBlacklist(e);} }, { key: "applyAddFriend", value: function value(e) {return this.applyC2CHandler.applyAddFriend(e);} }, { key: "getPendency", value: function value(e) {return this.applyC2CHandler.getPendency(e);} }, { key: "deletePendency", value: function value(e) {return this.applyC2CHandler.deletePendency(e);} }, { key: "replyPendency", value: function value(e) {return this.applyC2CHandler.replyPendency(e);} }, { key: "reset", value: function value() {Y.info("UserController.reset"), this.resetReady(), this.profileHandler.reset(), this.blacklistHandler.reset(), this.checkTimes = 0;} }]), t;}(Go),su = ["groupID", "name", "avatar", "type", "introduction", "notification", "ownerID", "selfInfo", "createTime", "infoSequence", "lastInfoTime", "lastMessage", "nextMessageSeq", "memberNum", "maxMemberNum", "memberList", "joinOption", "groupCustomField"],au = function () {function e(t) {r(this, e), this.groupID = "", this.name = "", this.avatar = "", this.type = "", this.introduction = "", this.notification = "", this.ownerID = "", this.createTime = "", this.infoSequence = "", this.lastInfoTime = "", this.selfInfo = { messageRemindType: "", joinTime: "", nameCard: "", role: "" }, this.lastMessage = { lastTime: "", lastSequence: "", fromAccount: "", messageForShow: "" }, this.nextMessageSeq = "", this.memberNum = "", this.maxMemberNum = "", this.joinOption = "", this.groupCustomField = [], this._initGroup(t);}return i(e, [{ key: "_initGroup", value: function value(e) {for (var t in e) {su.indexOf(t) < 0 || ("selfInfo" !== t ? this[t] = e[t] : this.updateSelfInfo(e[t]));}} }, { key: "updateGroup", value: function value(e) {e.lastMsgTime && (this.lastMessage.lastTime = e.lastMsgTime), e.groupCustomField && _e(this.groupCustomField, e.groupCustomField), ue(this, e, ["members", "errorCode", "lastMsgTime", "groupCustomField"]);} }, { key: "updateSelfInfo", value: function value(e) {var t = e.nameCard,n = e.joinTime,r = e.role,o = e.messageRemindType;ue(this.selfInfo, { nameCard: t, joinTime: n, role: r, messageRemindType: o }, [], ["", null, void 0, 0, NaN]);} }, { key: "setSelfNameCard", value: function value(e) {this.selfInfo.nameCard = e;} }]), e;}(),uu = function uu(e, n) {if (ee(n)) return "";switch (e) {case t.MSG_TEXT:return n.text;case t.MSG_IMAGE:return "[图片]";case t.MSG_GEO:return "[位置]";case t.MSG_AUDIO:return "[语音]";case t.MSG_VIDEO:return "[视频]";case t.MSG_FILE:return "[文件]";case t.MSG_CUSTOM:return "[自定义消息]";case t.MSG_GRP_TIP:return "[群提示消息]";case t.MSG_GRP_SYS_NOTICE:return "[群系统通知]";case t.MSG_FACE:return "[动画表情]";default:return "";}},cu = function () {function e(t) {var n;r(this, e), this.conversationID = t.conversationID || "", this.unreadCount = t.unreadCount || 0, this.type = t.type || "", this.lastMessage = (n = t.lastMessage, ee(n) ? { lastTime: 0, lastSequence: 0, fromAccount: 0, messageForShow: "", payload: null, type: "", isRevoked: !1 } : n instanceof Rr ? { lastTime: n.time || 0, lastSequence: n.sequence || 0, fromAccount: n.from || "", messageForShow: uu(n.type, n.payload), payload: n.payload || null, type: n.type || null, isRevoked: !1 } : u({}, n, { isRevoked: !1, messageForShow: uu(n.type, n.payload) })), this._isInfoCompleted = !1, this._initProfile(t);}return i(e, [{ key: "_initProfile", value: function value(e) {var n = this;Object.keys(e).forEach(function (t) {switch (t) {case "userProfile":n.userProfile = e.userProfile;break;case "groupProfile":n.groupProfile = e.groupProfile;}}), ee(this.userProfile) && this.type === t.CONV_C2C ? this.userProfile = new Ja({ userID: e.conversationID.replace("C2C", "") }) : ee(this.groupProfile) && this.type === t.CONV_GROUP && (this.groupProfile = new au({ groupID: e.conversationID.replace("GROUP", "") }));} }, { key: "updateUnreadCount", value: function value(e, n) {ee(e) || (this.subType === t.GRP_CHATROOM || Ie(this.subType) ? this.unreadCount = 0 : n && this.type === t.CONV_GROUP ? this.unreadCount = e : this.unreadCount = this.unreadCount + e);} }, { key: "reduceUnreadCount", value: function value() {this.unreadCount >= 1 && (this.unreadCount -= 1);} }, { key: "isLastMessageRevoked", value: function value(e) {var n = e.sequence,r = e.time;return this.type === t.CONV_C2C && n === this.lastMessage.lastSequence && r === this.lastMessage.lastTime || this.type === t.CONV_GROUP && n === this.lastMessage.lastSequence;} }, { key: "setLastMessageRevoked", value: function value(e) {this.lastMessage.isRevoked = e;} }, { key: "toAccount", get: function get() {return this.conversationID.replace("C2C", "").replace("GROUP", "");} }, { key: "subType", get: function get() {return this.groupProfile ? this.groupProfile.type : "";} }]), e;}(),lu = function (n) {function o(e) {var t;return r(this, o), (t = m(this, l(o).call(this, e))).pagingStatus = Le.NOT_START, t.pagingTimeStamp = 0, t.conversationMap = new Map(), t.tempGroupList = [], t._initListeners(), t;}return c(o, n), i(o, [{ key: "hasLocalConversationMap", value: function value() {return this.conversationMap.size > 0;} }, { key: "createLocalConversation", value: function value(e) {return this.conversationMap.has(e) ? this.conversationMap.get(e) : new cu({ conversationID: e, type: e.slice(0, 3) === t.CONV_C2C ? t.CONV_C2C : t.CONV_GROUP });} }, { key: "hasLocalConversation", value: function value(e) {return this.conversationMap.has(e);} }, { key: "getConversationList", value: function value() {var e = this;Y.log("ConversationController.getConversationList."), this.pagingStatus === Le.REJECTED && (Y.log("ConversationController.getConversationList. continue to sync conversationList"), this._syncConversationList());var t = new Qo();return t.setMethod(li).setStart(), this.request({ name: "conversation", action: "query" }).then(function (n) {var r = n.data.conversations,o = void 0 === r ? [] : r,i = e._getConversationOptions(o);return e._updateLocalConversationList(i, !0), e._setStorageConversationList(), t.setCode(0).setText(o.length).setEnd(), Y.log("ConversationController.getConversationList ok."), Bo({ conversationList: e.getLocalConversationList() });}).catch(function (n) {return e.probeNetwork().then(function (e) {var r = y(e, 2),o = r[0],i = r[1];t.setError(n, o, i).setEnd();}), Y.error("ConversationController.getConversationList error:", n), Ko(n);});} }, { key: "_syncConversationList", value: function value() {var e = this,t = new Qo();return t.setMethod(hi).setStart(), this.pagingStatus === Le.NOT_START && this.conversationMap.clear(), this._autoPagingSyncConversationList().then(function (n) {return e.pagingStatus = Le.RESOLVED, e._setStorageConversationList(), t.setCode(0).setText("".concat(e.conversationMap.size)).setEnd(), n;}).catch(function (n) {return e.pagingStatus = Le.REJECTED, t.setText(e.pagingTimeStamp), e.probeNetwork().then(function (e) {var r = y(e, 2),o = r[0],i = r[1];t.setError(n, o, i).setEnd();}), Ko(n);});} }, { key: "_autoPagingSyncConversationList", value: function value() {var e = this;return this.pagingStatus = Le.PENDING, this.request({ name: "conversation", action: "pagingQuery", param: { fromAccount: this.tim.context.identifier, timeStamp: this.pagingTimeStamp, orderType: 1 } }).then(function (t) {var n = t.data,r = n.completeFlag,o = n.conversations,i = void 0 === o ? [] : o,s = n.timeStamp;if (Y.log("ConversationController._autoPagingSyncConversationList completeFlag=".concat(r, " nums=").concat(i.length)), i.length > 0) {var a = e._getConversationOptions(i);e._updateLocalConversationList(a, !0);}return e._isReady ? e._emitConversationUpdate() : e.triggerReady(), e.pagingTimeStamp = s, 1 !== r ? e._autoPagingSyncConversationList() : Bo();});} }, { key: "getConversationProfile", value: function value(e) {var n = this.conversationMap.has(e) ? this.conversationMap.get(e) : this.createLocalConversation(e);return n._isInfoCompleted || n.type === t.CONV_SYSTEM ? Bo({ conversation: n }) : (Y.log("ConversationController.getConversationProfile. conversationID:", e), this._updateUserOrGroupProfileCompletely(n).then(function (t) {return Y.log("ConversationController.getConversationProfile ok. conversationID:", e), t;}).catch(function (e) {return Y.error("ConversationController.getConversationProfile error:", e), Ko(e);}));} }, { key: "deleteConversation", value: function value(e) {var n = this,r = {};if (!this.conversationMap.has(e)) {var o = new at({ code: bt, message: jn });return Ko(o);}switch (this.conversationMap.get(e).type) {case t.CONV_C2C:r.type = 1, r.toAccount = e.slice(3);break;case t.CONV_GROUP:r.type = 2, r.toGroupID = e.slice(5);break;case t.CONV_SYSTEM:return this.tim.groupController.deleteGroupSystemNotice({ messageList: this.tim.messageController.getLocalMessageList(e) }), this.deleteLocalConversation(e), Bo({ conversationID: e });default:var i = new at({ code: Gt, message: Yn });return Ko(i);}return Y.log("ConversationController.deleteConversation. conversationID:", e), this.tim.setMessageRead({ conversationID: e }).then(function () {return n.request({ name: "conversation", action: "delete", param: r });}).then(function () {return Y.log("ConversationController.deleteConversation ok. conversationID:", e), n.deleteLocalConversation(e), Bo({ conversationID: e });}).catch(function (e) {return Y.error("ConversationController.deleteConversation error:", e), Ko(e);});} }, { key: "getLocalConversationList", value: function value() {return v(this.conversationMap.values());} }, { key: "getLocalConversation", value: function value(e) {return this.conversationMap.get(e);} }, { key: "_initLocalConversationList", value: function value() {var e = new Qo();e.setMethod(pi).setStart(), Y.time(Wo), Y.log("ConversationController._initLocalConversationList init");var t = this._getStorageConversationList();if (t) {for (var n = t.length, r = 0; r < n; r++) {this.conversationMap.set(t[r].conversationID, new cu(t[r]));}this._emitConversationUpdate(!0, !1), e.setCode(0).setNetworkType(this.getNetworkType()).setText(n).setEnd();} else e.setCode(0).setNetworkType(this.getNetworkType()).setText(0).setEnd();this._syncConversationList();} }, { key: "_getStorageConversationList", value: function value() {return this.tim.storage.getItem("conversationMap");} }, { key: "_setStorageConversationList", value: function value() {var e = this.getLocalConversationList().slice(0, 20).map(function (e) {return { conversationID: e.conversationID, type: e.type, subType: e.subType, lastMessage: e.lastMessage, groupProfile: e.groupProfile, userProfile: e.userProfile };});this.tim.storage.setItem("conversationMap", e);} }, { key: "_initListeners", value: function value() {var e = this;this.tim.innerEmitter.once(Br, this._initLocalConversationList, this), this.tim.innerEmitter.on($r, this._onSendOrReceiveMessage, this), this.tim.innerEmitter.on(Yr, this._handleSyncMessages, this), this.tim.innerEmitter.on(zr, this._handleSyncMessages, this), this.tim.innerEmitter.on(Wr, this._onSendOrReceiveMessage, this), this.tim.innerEmitter.on(Xr, this._onSendOrReceiveMessage, this), this.tim.innerEmitter.on(Jr, this._onSendOrReceiveMessage, this), this.tim.innerEmitter.on(vo, this._onGroupListUpdated, this), this.tim.innerEmitter.on(ko, this._updateConversationUserProfile, this), this.tim.innerEmitter.on(Qr, this._onMessageRevoked, this), this.ready(function () {e.tempGroupList.length > 0 && (e._updateConversationGroupProfile(e.tempGroupList), e.tempGroupList.length = 0);});} }, { key: "_onGroupListUpdated", value: function value(e) {this._updateConversationGroupProfile(e.data);} }, { key: "_updateConversationGroupProfile", value: function value(e) {var t = this;Z(e) && 0 === e.length || (this.hasLocalConversationMap() ? (e.forEach(function (e) {var n = "GROUP".concat(e.groupID);if (t.conversationMap.has(n)) {var r = t.conversationMap.get(n);r.groupProfile = e, r.lastMessage.lastSequence = e.nextMessageSeq - 1, r.subType || (r.subType = e.type);}}), this._emitConversationUpdate(!0, !1)) : this.tempGroupList = e);} }, { key: "_updateConversationUserProfile", value: function value(e) {var t = this;e.data.forEach(function (e) {var n = "C2C".concat(e.userID);t.conversationMap.has(n) && (t.conversationMap.get(n).userProfile = e);}), this._emitConversationUpdate(!0, !1);} }, { key: "_onMessageRevoked", value: function value(e) {var t = this,n = e.data;if (0 !== n.length) {var r = null,o = !1;n.forEach(function (e) {(r = t.conversationMap.get(e.conversationID)) && r.isLastMessageRevoked(e) && (o = !0, r.setLastMessageRevoked(!0));}), o && this._emitConversationUpdate(!0, !1);}} }, { key: "_handleSyncMessages", value: function value(e) {this._onSendOrReceiveMessage(e, !0);} }, { key: "_onSendOrReceiveMessage", value: function value(e) {var t = this,n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],r = e.data.eventDataList;this._isReady ? 0 !== r.length && (this._updateLocalConversationList(r, !1, n), this._setStorageConversationList(), this._emitConversationUpdate()) : this.ready(function () {t._onSendOrReceiveMessage(e, n);});} }, { key: "_updateLocalConversationList", value: function value(e, t, n) {var r;r = this._updateTempConversations(e, t, n), this.conversationMap = new Map(this._sortConversations([].concat(v(r.conversations), v(this.conversationMap)))), t || this._updateUserOrGroupProfile(r.newerConversations);} }, { key: "_updateTempConversations", value: function value(e, n, r) {for (var o = [], i = [], s = 0, a = e.length; s < a; s++) {var u = new cu(e[s]),c = this.conversationMap.get(u.conversationID);if (this.conversationMap.has(u.conversationID)) {var l = ["unreadCount", "allowType", "adminForbidType", "payload"];r && l.push("lastMessage"), ue(c, u, l, [null, void 0, "", 0, NaN]), c.updateUnreadCount(u.unreadCount, n), r || (c.lastMessage.payload = e[s].lastMessage.payload), this.conversationMap.delete(c.conversationID), o.push([c.conversationID, c]);} else {if (u.type === t.CONV_GROUP) {var p = u.groupProfile.groupID,h = this.tim.groupController.getLocalGroupProfile(p);h && (u.groupProfile = h, u.updateUnreadCount(0));}i.push(u), o.push([u.conversationID, u]);}}return { conversations: o, newerConversations: i };} }, { key: "_sortConversations", value: function value(e) {return e.sort(function (e, t) {return t[1].lastMessage.lastTime - e[1].lastMessage.lastTime;});} }, { key: "_updateUserOrGroupProfile", value: function value(e) {var n = this;if (0 !== e.length) {var r = [],o = [];e.forEach(function (e) {if (e.type === t.CONV_C2C) r.push(e.toAccount);else if (e.type === t.CONV_GROUP) {var i = e.toAccount;n.tim.groupController.hasLocalGroup(i) ? e.groupProfile = n.tim.groupController.getLocalGroupProfile(i) : o.push(i);}}), r.length > 0 && this.tim.getUserProfile({ userIDList: r }).then(function (e) {var t = e.data;Z(t) ? t.forEach(function (e) {n.conversationMap.get("C2C".concat(e.userID)).userProfile = e;}) : n.conversationMap.get("C2C".concat(t.userID)).userProfile = t;}), o.length > 0 && this.tim.groupController.getGroupProfileAdvance({ groupIDList: o, responseFilter: { groupBaseInfoFilter: ["Type", "Name", "FaceUrl"] } }).then(function (e) {e.data.successGroupList.forEach(function (e) {var t = "GROUP".concat(e.groupID);if (n.conversationMap.has(t)) {var r = n.conversationMap.get(t);ue(r.groupProfile, e, [], [null, void 0, "", 0, NaN]), !r.subType && e.type && (r.subType = e.type);}});});}} }, { key: "_updateUserOrGroupProfileCompletely", value: function value(e) {var n = this;return e.type === t.CONV_C2C ? this.tim.getUserProfile({ userIDList: [e.toAccount] }).then(function (t) {var r = t.data;return 0 === r.length ? Ko(new at({ code: Pt, message: $n })) : (e.userProfile = r[0], e._isInfoCompleted = !0, n._unshiftConversation(e), Bo({ conversation: e }));}) : this.tim.getGroupProfile({ groupID: e.toAccount }).then(function (t) {return e.groupProfile = t.data.group, e._isInfoCompleted = !0, n._unshiftConversation(e), Bo({ conversation: e });});} }, { key: "_unshiftConversation", value: function value(e) {e instanceof cu && !this.conversationMap.has(e.conversationID) && (this.conversationMap = new Map([[e.conversationID, e]].concat(v(this.conversationMap))), this._setStorageConversationList(), this._emitConversationUpdate(!0, !1));} }, { key: "deleteLocalConversation", value: function value(e) {return this.conversationMap.delete(e), this._setStorageConversationList(), this.emitInnerEvent(Eo, e), this._emitConversationUpdate(!0, !1), this.conversationMap.has(e);} }, { key: "_getConversationOptions", value: function value(e) {var t = [],n = e.filter(function (e) {var t = e.lastMsg;return Q(t);}).map(function (e) {if (1 === e.type) {var n = { userID: e.userID, nick: e.c2CNick, avatar: e.c2CImage };return t.push(n), { conversationID: "C2C".concat(e.userID), type: "C2C", lastMessage: { lastTime: e.time, lastSequence: e.sequence, fromAccount: e.lastC2CMsgFromAccount, messageForShow: e.messageShow, type: e.lastMsg.elements[0] ? e.lastMsg.elements[0].type : null, payload: e.lastMsg.elements[0] ? e.lastMsg.elements[0].content : null }, userProfile: new Ja(n) };}return { conversationID: "GROUP".concat(e.groupID), type: "GROUP", lastMessage: { lastTime: e.time, lastSequence: e.messageReadSeq + e.unreadCount, fromAccount: e.msgGroupFromAccount, messageForShow: e.messageShow, type: e.lastMsg.elements[0] ? e.lastMsg.elements[0].type : null, payload: e.lastMsg.elements[0] ? e.lastMsg.elements[0].content : null }, groupProfile: new au({ groupID: e.groupID, name: e.groupNick, avatar: e.groupImage }), unreadCount: e.unreadCount };});return t.length > 0 && this.emitInnerEvent(To, t), n;} }, { key: "_emitConversationUpdate", value: function value() {var t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0],n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],r = v(this.conversationMap.values());n && this.emitInnerEvent(Do, r), t && this.emitOuterEvent(e.CONVERSATION_LIST_UPDATED, r);} }, { key: "_conversationMapTreeShaking", value: function value(e) {var n = this,r = new Map(v(this.conversationMap));e.forEach(function (e) {return r.delete(e.conversationID);}), r.has(t.CONV_SYSTEM) && r.delete(t.CONV_SYSTEM);var o = this.tim.groupController.getJoinedAVChatRoom();o && r.delete("".concat(t.CONV_GROUP).concat(o.groupID)), v(r.keys()).forEach(function (e) {return n.conversationMap.delete(e);});} }, { key: "reset", value: function value() {this.pagingStatus = Le.NOT_START, this.pagingTimeStamp = 0, this.conversationMap.clear(), this.resetReady(), this.tim.innerEmitter.once(Br, this._initLocalConversationList, this);} }]), o;}(Go),pu = function () {function e(t) {if (r(this, e), void 0 === t) throw new at({ code: mt, message: kn });if (void 0 === t.tim) throw new at({ code: mt, message: "".concat(kn, ".tim") });this.list = new Map(), this.tim = t.tim, this._initializeOptions(t);}return i(e, [{ key: "getLocalOldestMessageByConversationID", value: function value(e) {if (!e) return null;if (!this.list.has(e)) return null;var t = this.list.get(e).values();return t ? t.next().value : null;} }, { key: "_initializeOptions", value: function value(e) {this.options = {};var t = { memory: { maxDatasPerKey: 100, maxBytesPerData: 256, maxKeys: 0 }, cache: { maxDatasPerKey: 10, maxBytesPerData: 256, maxKeys: 0 } };for (var n in t) {if (Object.prototype.hasOwnProperty.call(t, n)) {if (void 0 === e[n]) {this.options[n] = t[n];continue;}var r = t[n];for (var o in r) {if (Object.prototype.hasOwnProperty.call(r, o)) {if (void 0 === e[n][o]) {this.options[n][o] = r[o];continue;}this.options[n][o] = e[n][o];}}}}} }, { key: "pushIn", value: function value(e) {var t = e.conversationID,n = e.ID,r = !0;return this.list.has(t) || this.list.set(t, new Map()), this.list.has(t) && this.list.get(t).has(n) ? r = !1 : this.list.get(t).set(n, e), r;} }, { key: "unshift", value: function value(e) {Z(e) ? e.length > 0 && this._unshiftMultipleMessages(e) : this._unshiftSingleMessage(e);} }, { key: "_unshiftSingleMessage", value: function value(e) {var t = e.conversationID,n = e.ID;if (!this.list.has(t)) return this.list.set(t, new Map()), void this.list.get(t).set(n, e);var r = Array.from(this.list.get(t));r.unshift([n, e]), this.list.set(t, new Map(r));} }, { key: "_unshiftMultipleMessages", value: function value(e) {for (var t = e.length, n = [], r = e[0].conversationID, o = this.list.has(r) ? Array.from(this.list.get(r)) : [], i = 0; i < t; i++) {n.push([e[i].ID, e[i]]);}this.list.set(r, new Map(n.concat(o)));} }, { key: "remove", value: function value(e) {var t = e.conversationID,n = e.ID;this.list.has(t) && this.list.get(t).delete(n);} }, { key: "revoke", value: function value(e, t, n) {if (Y.debug("revoke message", e, t, n), this.list.has(e)) {var r = this.list.get(e),o = !0,i = !1,s = void 0;try {for (var a, u = r[Symbol.iterator](); !(o = (a = u.next()).done); o = !0) {var c = y(a.value, 2)[1];if (c.sequence === t && !c.isRevoked && (ee(n) || c.random === n)) return c.isRevoked = !0, c;}} catch (l) {i = !0, s = l;} finally {try {o || null == u.return || u.return();} finally {if (i) throw s;}}}return null;} }, { key: "removeByConversationID", value: function value(e) {this.list.has(e) && this.list.delete(e);} }, { key: "hasLocalMessageList", value: function value(e) {return this.list.has(e);} }, { key: "getLocalMessageList", value: function value(e) {return this.hasLocalMessageList(e) ? v(this.list.get(e).values()) : [];} }, { key: "hasLocalMessage", value: function value(e, t) {return !!this.hasLocalMessageList(e) && this.list.get(e).has(t);} }, { key: "getLocalMessage", value: function value(e, t) {return this.hasLocalMessage(e, t) ? this.list.get(e).get(t) : null;} }, { key: "reset", value: function value() {this.list.clear();} }]), e;}(),hu = function () {function e(t, n) {r(this, e), this.tim = t, this.messageController = n;}return i(e, [{ key: "setMessageRead", value: function value(e) {var n = e.conversationID,r = e.messageID,o = this.tim.conversationController.getLocalConversation(n);if (Y.log("ReadReportHandler.setMessageRead conversationID=".concat(n, " unreadCount=").concat(o ? o.unreadCount : 0)), !o || 0 === o.unreadCount) return Bo();var i = r ? this.tim.messageController.getLocalMessage(n, r) : null;switch (o.type) {case t.CONV_C2C:return this._setC2CMessageRead({ conversationID: n, lastMessageTime: i ? i.time : o.lastMessage.lastTime });case t.CONV_GROUP:return this._setGroupMessageRead({ conversationID: n, lastMessageSeq: i ? i.sequence : o.lastMessage.lastSequence });case t.CONV_SYSTEM:return o.unreadCount = 0, Bo();default:return Bo();}} }, { key: "_setC2CMessageRead", value: function value(e) {var t = this,n = e.conversationID,r = e.lastMessageTime;Y.log("ReadReportHandler._setC2CMessageRead conversationID=".concat(n, " lastMessageTime=").concat(r)), this._updateIsReadAfterReadReport({ conversationID: n, lastMessageTime: r }), this._updateUnreadCount(n);var o = new Qo();return o.setMethod(ui).setText("".concat(n, "-").concat(r)).setStart(), this.messageController.request({ name: "conversation", action: "setC2CMessageRead", param: { C2CMsgReaded: { cookie: "", C2CMsgReadedItem: [{ toAccount: n.replace("C2C", ""), lastMessageTime: r }] } } }).then(function () {return o.setCode(0).setNetworkType(t.tim.netMonitor.getNetworkType()).setEnd(), Y.log("ReadReportHandler._setC2CMessageRead ok."), new xo();}).catch(function (e) {return t.tim.netMonitor.probe().then(function (t) {var n = y(t, 2),r = n[0],i = n[1];o.setError(e, r, i).setEnd();}), Y.log("ReadReportHandler._setC2CMessageRead failed. ".concat(e)), Ko(e);});} }, { key: "_setGroupMessageRead", value: function value(e) {var t = this,n = e.conversationID,r = e.lastMessageSeq;Y.log("ReadReportHandler._setGroupMessageRead conversationID=".concat(n, " lastMessageSeq=").concat(r)), this._updateIsReadAfterReadReport({ conversationID: n, lastMessageSeq: r }), this._updateUnreadCount(n);var o = new Qo();return o.setMethod(ci).setText("".concat(n, "-").concat(r)).setStart(), this.messageController.request({ name: "conversation", action: "setGroupMessageRead", param: { groupID: n.replace("GROUP", ""), messageReadSeq: r } }).then(function () {return o.setCode(0).setNetworkType(t.tim.netMonitor.getNetworkType()).setEnd(), Y.log("ReadReportHandler._setGroupMessageRead ok."), new xo();}).catch(function (e) {return t.tim.netMonitor.probe().then(function (t) {var n = y(t, 2),r = n[0],i = n[1];o.setError(e, r, i).setEnd();}), Y.log("ReadReportHandler._setGroupMessageRead failed. ".concat(e)), Ko(e);});} }, { key: "_updateUnreadCount", value: function value(e) {var t = this.tim,n = t.conversationController,r = t.messageController,o = n.getLocalConversation(e),i = r.getLocalMessageList(e);o && (o.unreadCount = i.filter(function (e) {return !e.isRead;}).length);} }, { key: "_updateIsReadAfterReadReport", value: function value(e) {var t = e.conversationID,n = e.lastMessageSeq,r = e.lastMessageTime,o = this.tim.messageController.getLocalMessageList(t);if (0 !== o.length) for (var i = o.length - 1; i >= 0; i--) {var s = o[i];if (!(r && s.time > r || n && s.sequence > n)) {if ("in" === s.flow && s.isRead) break;s.setIsRead(!0);}}} }, { key: "updateIsRead", value: function value(e) {var n = this.tim,r = n.conversationController,o = n.messageController,i = r.getLocalConversation(e),s = o.getLocalMessageList(e);if (i && 0 !== s.length && !Me(i.type)) {for (var a = [], u = 0; u < s.length; u++) {"in" !== s[u].flow ? "out" !== s[u].flow || s[u].isRead || s[u].setIsRead(!0) : a.push(s[u]);}var c = 0;if (i.type === t.CONV_C2C) {var l = a.slice(-i.unreadCount).filter(function (e) {return e.isRevoked;}).length;c = a.length - i.unreadCount - l;} else c = a.length - i.unreadCount;for (var p = 0; p < c && !a[p].isRead; p++) {a[p].setIsRead(!0);}}} }]), e;}(),fu = function () {function e(t) {var n = t.tim,o = t.messageController;r(this, e), this.tim = n, this.messageController = o, this.completedMap = new Map(), this._initListener();}return i(e, [{ key: "getMessageList", value: function value(e) {var t = this,n = e.conversationID,r = e.nextReqMessageID,o = e.count;if (this.tim.groupController.checkJoinedAVChatRoomByID(n.replace("GROUP", ""))) return Y.log("GetMessageHandler.getMessageList not available in avchatroom. conversationID=".concat(n)), Bo({ messageList: [], nextReqMessageID: "", isCompleted: !0 });(ee(o) || o > 15) && (o = 15);var i = this._computeLeftCount({ conversationID: n, nextReqMessageID: r });return Y.log("GetMessageHandler.getMessageList. conversationID=".concat(n, " leftCount=").concat(i, " count=").concat(o, " nextReqMessageID=").concat(r)), this._needGetHistory({ conversationID: n, leftCount: i, count: o }) ? this.messageController.getHistoryMessages({ conversationID: n, count: 20 }).then(function () {return i = t._computeLeftCount({ conversationID: n, nextReqMessageID: r }), new xo(t._computeResult({ conversationID: n, nextReqMessageID: r, count: o, leftCount: i }));}) : (Y.log("GetMessageHandler.getMessageList. get messagelist from memory"), Bo(this._computeResult({ conversationID: n, nextReqMessageID: r, count: o, leftCount: i })));} }, { key: "setCompleted", value: function value(e) {Y.log("GetMessageHandler.setCompleted. conversationID=".concat(e)), this.completedMap.set(e, !0);} }, { key: "deleteCompletedItem", value: function value(e) {Y.log("GetMessageHandler.deleteCompletedItem. conversationID=".concat(e)), this.completedMap.delete(e);} }, { key: "_initListener", value: function value() {var e = this;this.tim.innerEmitter.on(Ao, function () {e.setCompleted(t.CONV_SYSTEM);}), this.tim.innerEmitter.on(wo, function (n) {var r = n.data;e.setCompleted("".concat(t.CONV_GROUP).concat(r));});} }, { key: "_getMessageListSize", value: function value(e) {return this.messageController.getLocalMessageList(e).length;} }, { key: "_needGetHistory", value: function value(e) {var n = e.conversationID,r = e.leftCount,o = e.count,i = this.tim.conversationController.getLocalConversation(n),s = !!i && i.type === t.CONV_SYSTEM,a = !!i && i.subType === t.GRP_AVCHATROOM;return !s && !a && r < o && !this.completedMap.has(n);} }, { key: "_computeResult", value: function value(e) {var t = e.conversationID,n = e.nextReqMessageID,r = e.count,o = e.leftCount,i = this._computeMessageList({ conversationID: t, nextReqMessageID: n, count: r }),s = this._computeIsCompleted({ conversationID: t, leftCount: o, count: r }),a = this._computeNextReqMessageID({ messageList: i, isCompleted: s, conversationID: t });return Y.log("GetMessageHandler._computeResult. conversationID=".concat(t, " leftCount=").concat(o, " count=").concat(r, " nextReqMessageID=").concat(a, " nums=").concat(i.length, " isCompleted=").concat(s)), { messageList: i, nextReqMessageID: a, isCompleted: s };} }, { key: "_computeNextReqMessageID", value: function value(e) {var t = e.messageList,n = e.isCompleted,r = e.conversationID;if (!n) return 0 === t.length ? "" : t[0].ID;var o = this.messageController.getLocalMessageList(r);return 0 === o.length ? "" : o[0].ID;} }, { key: "_computeMessageList", value: function value(e) {var t = e.conversationID,n = e.nextReqMessageID,r = e.count,o = this.messageController.getLocalMessageList(t),i = this._computeIndexEnd({ nextReqMessageID: n, messageList: o }),s = this._computeIndexStart({ indexEnd: i, count: r });return o.slice(s, i);} }, { key: "_computeIndexEnd", value: function value(e) {var t = e.messageList,n = void 0 === t ? [] : t,r = e.nextReqMessageID;return r ? n.findIndex(function (e) {return e.ID === r;}) : n.length;} }, { key: "_computeIndexStart", value: function value(e) {var t = e.indexEnd,n = e.count;return t > n ? t - n : 0;} }, { key: "_computeLeftCount", value: function value(e) {var t = e.conversationID,n = e.nextReqMessageID;return n ? this.messageController.getLocalMessageList(t).findIndex(function (e) {return e.ID === n;}) : this._getMessageListSize(t);} }, { key: "_computeIsCompleted", value: function value(e) {var t = e.conversationID;return !!(e.leftCount <= e.count && this.completedMap.has(t));} }, { key: "reset", value: function value() {Y.log("GetMessageHandler.reset"), this.completedMap.clear();} }]), e;}(),gu = function e(t) {r(this, e), this.value = t, this.next = null;},du = function () {function e(t) {r(this, e), this.MAX_LENGTH = t, this.pTail = null, this.pNodeToDel = null, this.map = new Map(), Y.log("SinglyLinkedList init MAX_LENGTH=".concat(this.MAX_LENGTH));}return i(e, [{ key: "pushIn", value: function value(e) {var t = new gu(e);if (this.map.size < this.MAX_LENGTH) null === this.pTail ? (this.pTail = t, this.pNodeToDel = t) : (this.pTail.next = t, this.pTail = t), this.map.set(e, 1);else {var n = this.pNodeToDel;this.pNodeToDel = this.pNodeToDel.next, this.map.delete(n.value), n.next = null, n = null, this.pTail.next = t, this.pTail = t, this.map.set(e, 1);}} }, { key: "has", value: function value(e) {return this.map.has(e);} }, { key: "reset", value: function value() {for (var e; null !== this.pNodeToDel;) {e = this.pNodeToDel, this.pNodeToDel = this.pNodeToDel.next, e.next = null, e = null;}this.pTail = null, this.map.clear();} }]), e;}(),mu = function () {function e(t) {r(this, e), this.tim = t;}return i(e, [{ key: "upload", value: function value(e) {switch (e.type) {case t.MSG_IMAGE:return this._uploadImage(e);case t.MSG_FILE:return this._uploadFile(e);case t.MSG_AUDIO:return this._uploadAudio(e);case t.MSG_VIDEO:return this._uploadVideo(e);default:return Promise.resolve();}} }, { key: "_uploadImage", value: function value(e) {var t = this.tim,n = t.uploadController,r = t.messageController,o = e.getElements()[0],i = r.getMessageOptionByID(e.messageID);return n.uploadImage({ file: i.payload.file, to: i.to, onProgress: function onProgress(e) {if (o.updatePercent(e), ne(i.onProgress)) try {i.onProgress(e);} catch (t) {return Ko(new at({ code: Ct, message: "".concat(On) }));}} }).then(function (e) {var t,n = e.location,r = e.fileType,i = e.fileSize,s = ve(n);return o.updateImageFormat(r), o.updateImageInfoArray({ size: i, url: s }), t = o._imageMemoryURL, k ? new Promise(function (e, n) {wx.getImageInfo({ src: t, success: function success(t) {e({ width: t.width, height: t.height });}, fail: function fail() {e({ width: 0, height: 0 });} });}) : P && 9 === G ? Promise.resolve({ width: 0, height: 0 }) : new Promise(function (e, n) {var r = new Image();r.onload = function () {e({ width: this.width, height: this.height }), r = null;}, r.onerror = function () {e({ width: 0, height: 0 }), r = null;}, r.src = t;});}).then(function (t) {var n = t.width,r = t.height;return o.updateImageInfoArray({ width: n, height: r }), e;});} }, { key: "_uploadFile", value: function value(e) {var t = this.tim,n = t.uploadController,r = t.messageController,o = e.getElements()[0],i = r.getMessageOptionByID(e.messageID);return n.uploadFile({ file: i.payload.file, to: i.to, onProgress: function onProgress(e) {if (o.updatePercent(e), ne(i.onProgress)) try {i.onProgress(e);} catch (t) {return Ko(new at({ code: Ct, message: "".concat(On) }));}} }).then(function (t) {var n = t.location,r = ve(n);return o.updateFileUrl(r), e;});} }, { key: "_uploadAudio", value: function value(e) {var t = this.tim,n = t.uploadController,r = t.messageController,o = e.getElements()[0],i = r.getMessageOptionByID(e.messageID);return n.uploadAudio({ file: i.payload.file, to: i.to, onProgress: function onProgress(e) {if (o.updatePercent(e), ne(i.onProgress)) try {i.onProgress(e);} catch (t) {return Ko(new at({ code: Ct, message: "".concat(On) }));}} }).then(function (t) {var n = t.location,r = ve(n);return o.updateAudioUrl(r), e;});} }, { key: "_uploadVideo", value: function value(e) {var t = this.tim,n = t.uploadController,r = t.messageController,o = e.getElements()[0],i = r.getMessageOptionByID(e.messageID);return n.uploadVideo({ file: i.payload.file, to: i.to, onProgress: function onProgress(e) {if (o.updatePercent(e), ne(i.onProgress)) try {i.onProgress(e);} catch (t) {return Ko(new at({ code: Ct, message: "".concat(On) }));}} }).then(function (t) {if (k) {var n = ve(t.location);return o.updateVideoUrl(n), e;}});} }]), e;}(),yu = function (n) {function o(e) {var t;return r(this, o), (t = m(this, l(o).call(this, e)))._initializeMembers(), t._initializeListener(), t._initialzeHandlers(), t.messageOptionMap = new Map(), t;}return c(o, n), i(o, [{ key: "_initializeMembers", value: function value() {this.messagesList = new pu({ tim: this.tim }), this.currentMessageKey = {}, this.singlyLinkedList = new du(100);} }, { key: "_initialzeHandlers", value: function value() {this.readReportHandler = new hu(this.tim, this), this.getMessageHandler = new fu({ messageController: this, tim: this.tim }), this.uploadFileHandler = new mu(this.tim);} }, { key: "reset", value: function value() {this.messagesList.reset(), this.currentMessageKey = {}, this.getMessageHandler.reset(), this.singlyLinkedList.reset(), this.messageOptionMap.clear();} }, { key: "_initializeListener", value: function value() {var e = this.tim.innerEmitter;e.on(so, this._onReceiveC2CMessage, this), e.on(Vr, this._onSyncMessagesProcessing, this), e.on(jr, this._onSyncMessagesFinished, this), e.on(ao, this._onReceiveGroupMessage, this), e.on(uo, this._onReceiveGroupTips, this), e.on(co, this._onReceiveSystemNotice, this), e.on(fo, this._onReceiveGroupMessageRevokedNotice, this), e.on(go, this._onReceiveC2CMessageRevokedNotice, this), e.on(Eo, this._clearConversationMessages, this);} }, { key: "sendMessageInstance", value: function value(e) {var n,r = this,o = this.tim.sumStatController,i = null;switch (e.conversationType) {case t.CONV_C2C:i = this._handleOnSendC2CMessageSuccess.bind(this);break;case t.CONV_GROUP:i = this._handleOnSendGroupMessageSuccess.bind(this);break;default:return Ko(new at({ code: vt, message: An }));}return this.singlyLinkedList.pushIn(e.random), this.uploadFileHandler.upload(e).then(function () {var i = null;return e.isSendable() ? (o.addTotalCount(zo), n = Date.now(), e.conversationType === t.CONV_C2C ? i = r._createC2CMessagePack(e) : e.conversationType === t.CONV_GROUP && (i = r._createGroupMessagePack(e)), r.request(i)) : Ko({ code: Nt, message: Vn });}).then(function (s) {return o.addSuccessCount(zo), o.addCost(zo, Math.abs(Date.now() - n)), e.conversationType === t.CONV_GROUP && (e.sequence = s.data.sequence, e.time = s.data.time, e.generateMessageID(r.tim.context.identifier)), r.messagesList.pushIn(e), i(e, s.data), r.messageOptionMap.delete(e.messageID), r.emitInnerEvent($r, { eventDataList: [{ conversationID: e.conversationID, unreadCount: 0, type: e.conversationType, subType: e.conversationSubType, lastMessage: e }] }), new xo({ message: e });}).catch(function (t) {e.status = Oe.FAIL;var n = new Qo();return n.setMethod(oi).setMessageType(e.type).setText("".concat(r._generateTjgID(e), "-").concat(e.type, "-").concat(e.from, "-").concat(e.to)).setStart(), r.probeNetwork().then(function (e) {var r = y(e, 2),o = r[0],i = r[1];n.setError(t, o, i).setEnd();}), Y.error("MessageController.sendMessageInstance error:", t), Ko(new at({ code: t && t.code ? t.code : dt, message: t && t.message ? t.message : En, data: { message: e } }));});} }, { key: "resendMessage", value: function value(e) {return e.isResend = !0, e.status = Oe.UNSEND, this.sendMessageInstance(e);} }, { key: "_isFileLikeMessage", value: function value(e) {return [t.MSG_IMAGE, t.MSG_FILE, t.MSG_AUDIO, t.MSG_VIDEO].indexOf(e.type) >= 0;} }, { key: "_resendBinaryTypeMessage", value: function value() {} }, { key: "_createC2CMessagePack", value: function value(e) {return { name: "c2cMessage", action: "create", tjgID: this._generateTjgID(e), param: { toAccount: e.to, msgBody: e.getElements(), msgSeq: e.sequence, msgRandom: e.random } };} }, { key: "_handleOnSendC2CMessageSuccess", value: function value(e, t) {e.status = Oe.SUCCESS, e.time = t.time;} }, { key: "_createGroupMessagePack", value: function value(e) {return { name: "groupMessage", action: "create", tjgID: this._generateTjgID(e), param: { groupID: e.to, msgBody: e.getElements(), random: e.random, priority: e.priority, clientSequence: e.clientSequence } };} }, { key: "_handleOnSendGroupMessageSuccess", value: function value(e, t) {e.sequence = t.sequence, e.time = t.time, e.status = Oe.SUCCESS;} }, { key: "_onReceiveC2CMessage", value: function value(n) {Y.debug("MessageController._onReceiveC2CMessage nums=".concat(n.data.length));var r = this._newC2CMessageStoredAndSummary({ notifiesList: n.data, type: t.CONV_C2C, C2CRemainingUnreadList: n.C2CRemainingUnreadList }),o = r.eventDataList,i = r.result;o.length > 0 && this.emitInnerEvent(Wr, { eventDataList: o, result: i }), i.length > 0 && this.emitOuterEvent(e.MESSAGE_RECEIVED, i);} }, { key: "_onReceiveGroupMessage", value: function value(t) {Y.debug("MessageController._onReceiveGroupMessage nums=".concat(t.data.length));var n = this.newGroupMessageStoredAndSummary(t.data),r = n.eventDataList,o = n.result;r.length > 0 && this.emitInnerEvent(Xr, { eventDataList: r, result: o, isGroupTip: !1 }), o.length > 0 && this.emitOuterEvent(e.MESSAGE_RECEIVED, o);} }, { key: "_onReceiveGroupTips", value: function value(t) {var n = t.data;Y.debug("MessageController._onReceiveGroupTips nums=".concat(n.length));var r = this.newGroupTipsStoredAndSummary(n),o = r.eventDataList,i = r.result;o.length > 0 && this.emitInnerEvent(Xr, { eventDataList: o, result: i, isGroupTip: !0 }), i.length > 0 && this.emitOuterEvent(e.MESSAGE_RECEIVED, i);} }, { key: "_onReceiveSystemNotice", value: function value(t) {var n = t.data,r = n.groupSystemNotices,o = n.type;Y.debug("MessageController._onReceiveSystemNotice nums=".concat(r.length));var i = this.newSystemNoticeStoredAndSummary({ notifiesList: r, type: o }),s = i.eventDataList,a = i.result;s.length > 0 && this.emitInnerEvent(Jr, { eventDataList: s, result: a, type: o }), a.length > 0 && "poll" === o && this.emitOuterEvent(e.MESSAGE_RECEIVED, a);} }, { key: "_onReceiveGroupMessageRevokedNotice", value: function value(t) {var n = this;Y.debug("MessageController._onReceiveGroupMessageRevokedNotice nums=".concat(t.data.length));var r = [],o = null;t.data.forEach(function (e) {e.elements.revokedInfos.forEach(function (e) {(o = n.messagesList.revoke("GROUP".concat(e.groupID), e.sequence)) && r.push(o);});}), 0 !== r.length && (this.emitInnerEvent(Qr, r), this.emitOuterEvent(e.MESSAGE_REVOKED, r));} }, { key: "_onReceiveC2CMessageRevokedNotice", value: function value(t) {var n = this;Y.debug("MessageController._onReceiveC2CMessageRevokedNotice nums=".concat(t.data.length));var r = [],o = null;t.data.forEach(function (e) {e.c2cMessageRevokedNotify.revokedInfos.forEach(function (e) {(o = n.messagesList.revoke("C2C".concat(e.from), e.sequence, e.random)) && r.push(o);});}), 0 !== r.length && (this.emitInnerEvent(Qr, r), this.emitOuterEvent(e.MESSAGE_REVOKED, r));} }, { key: "_clearConversationMessages", value: function value(e) {var t = e.data;this.messagesList.removeByConversationID(t), this.getMessageHandler.deleteCompletedItem(t);} }, { key: "_pushIntoNoticeResult", value: function value(e, t) {var n = this.messagesList.pushIn(t),r = this.singlyLinkedList.has(t.random);return !(!n || !1 !== r) && (e.push(t), !0);} }, { key: "_newC2CMessageStoredAndSummary", value: function value(e) {for (var n = e.notifiesList, r = e.type, o = e.C2CRemainingUnreadList, i = e.isFromSync, s = null, a = [], u = [], c = {}, l = this.tim.bigDataHallwayController, p = 0, h = n.length; p < h; p++) {var f = n[p];if (f.currentUser = this.tim.context.identifier, f.conversationType = r, f.isSystemMessage = !!f.isSystemMessage, s = new Rr(f), f.elements = l.parseElements(f.elements, f.from), s.setElement(f.elements), !i) if (!this._pushIntoNoticeResult(u, s)) continue;void 0 === c[s.conversationID] ? c[s.conversationID] = a.push({ conversationID: s.conversationID, unreadCount: "out" === s.flow ? 0 : 1, type: s.conversationType, subType: s.conversationSubType, lastMessage: s }) - 1 : (a[c[s.conversationID]].type = s.conversationType, a[c[s.conversationID]].subType = s.conversationSubType, a[c[s.conversationID]].lastMessage = s, "in" === s.flow && a[c[s.conversationID]].unreadCount++);}if (Z(o)) for (var g = function g(e, n) {var r = a.find(function (t) {return t.conversationID === "C2C".concat(o[e].from);});r ? r.unreadCount += o[e].count : a.push({ conversationID: "C2C".concat(o[e].from), unreadCount: o[e].count, type: t.CONV_C2C });}, d = 0, m = o.length; d < m; d++) {g(d);}return { eventDataList: a, result: u };} }, { key: "newGroupMessageStoredAndSummary", value: function value(e) {for (var n = null, r = [], o = {}, i = [], s = t.CONV_GROUP, a = this.tim.bigDataHallwayController, u = 0, c = e.length; u < c; u++) {var l = e[u];if (l.currentUser = this.tim.context.identifier, l.conversationType = s, l.isSystemMessage = !!l.isSystemMessage, n = new Rr(l), l.elements = a.parseElements(l.elements, l.from), n.setElement(l.elements), !this._isMessageFromAVChatroom(n)) this._pushIntoNoticeResult(i, n) && (void 0 === o[n.conversationID] ? o[n.conversationID] = r.push({ conversationID: n.conversationID, unreadCount: "out" === n.flow ? 0 : 1, type: n.conversationType, subType: n.conversationSubType, lastMessage: n }) - 1 : (r[o[n.conversationID]].type = n.conversationType, r[o[n.conversationID]].subType = n.conversationSubType, r[o[n.conversationID]].lastMessage = n, "in" === n.flow && r[o[n.conversationID]].unreadCount++));}return { eventDataList: r, result: i };} }, { key: "_isMessageFromAVChatroom", value: function value(e) {var t = e.conversationID.slice(5);return this.tim.groupController.checkJoinedAVChatRoomByID(t);} }, { key: "newGroupTipsStoredAndSummary", value: function value(e) {for (var n = null, r = [], o = [], i = {}, s = 0, a = e.length; s < a; s++) {var c = e[s];if (c.currentUser = this.tim.context.identifier, c.conversationType = t.CONV_GROUP, (n = new Rr(c)).setElement({ type: t.MSG_GRP_TIP, content: u({}, c.elements, { groupProfile: c.groupProfile }) }), n.isSystemMessage = !1, !this._isMessageFromAVChatroom(n)) this._pushIntoNoticeResult(o, n) && (void 0 === i[n.conversationID] ? i[n.conversationID] = r.push({ conversationID: n.conversationID, unreadCount: "out" === n.flow ? 0 : 1, type: n.conversationType, subType: n.conversationSubType, lastMessage: n }) - 1 : (r[i[n.conversationID]].type = n.conversationType, r[i[n.conversationID]].subType = n.conversationSubType, r[i[n.conversationID]].lastMessage = n, "in" === n.flow && r[i[n.conversationID]].unreadCount++));}return { eventDataList: r, result: o };} }, { key: "newSystemNoticeStoredAndSummary", value: function value(e) {var n = e.notifiesList,r = e.type,o = null,i = n.length,s = 0,a = [],c = { conversationID: t.CONV_SYSTEM, unreadCount: 0, type: t.CONV_SYSTEM, subType: null, lastMessage: null };for (s = 0; s < i; s++) {var l = n[s];if (l.elements.operationType !== Ve) l.currentUser = this.tim.context.identifier, l.conversationType = t.CONV_SYSTEM, l.conversationID = t.CONV_SYSTEM, (o = new Rr(l)).setElement({ type: t.MSG_GRP_SYS_NOTICE, content: u({}, l.elements, { groupProfile: l.groupProfile }) }), o.isSystemMessage = !0, (1 === o.sequence && 1 === o.random || 2 === o.sequence && 2 === o.random) && (o.sequence = he(), o.random = he(), o.generateMessageID(l.currentUser), Y.log("MessageController.newSystemNoticeStoredAndSummary sequence and random maybe duplicated, regenerate. ID=".concat(o.ID))), this._pushIntoNoticeResult(a, o) && ("poll" === r ? c.unreadCount++ : "sync" === r && o.setIsRead(!0), c.subType = o.conversationSubType);}return c.lastMessage = a[a.length - 1], { eventDataList: a.length > 0 ? [c] : [], result: a };} }, { key: "_onSyncMessagesProcessing", value: function value(e) {var n = this._newC2CMessageStoredAndSummary({ notifiesList: e.data, type: t.CONV_C2C, isFromSync: !0, C2CRemainingUnreadList: e.C2CRemainingUnreadList }),r = n.eventDataList,o = n.result;this.emitInnerEvent(Yr, { eventDataList: r, result: o });} }, { key: "_onSyncMessagesFinished", value: function value(e) {this.triggerReady();var n = this._newC2CMessageStoredAndSummary({ notifiesList: e.data.messageList, type: t.CONV_C2C, isFromSync: !0, C2CRemainingUnreadList: e.data.C2CRemainingUnreadList }),r = n.eventDataList,o = n.result;this.emitInnerEvent(zr, { eventDataList: r, result: o });} }, { key: "getHistoryMessages", value: function value(e) {if (e.conversationID === t.CONV_SYSTEM) return Bo();!e.count && (e.count = 15), e.count > 20 && (e.count = 20);var n = this.messagesList.getLocalOldestMessageByConversationID(e.conversationID);n || ((n = {}).time = 0, n.sequence = 0, 0 === e.conversationID.indexOf(t.CONV_C2C) ? (n.to = e.conversationID.replace(t.CONV_C2C, ""), n.conversationType = t.CONV_C2C) : 0 === e.conversationID.indexOf(t.CONV_GROUP) && (n.to = e.conversationID.replace(t.CONV_GROUP, ""), n.conversationType = t.CONV_GROUP));var r = "";switch (n.conversationType) {case t.CONV_C2C:return r = e.conversationID.replace(t.CONV_C2C, ""), this.getC2CRoamMessages({ conversationID: e.conversationID, peerAccount: r, count: e.count, lastMessageTime: void 0 === this.currentMessageKey[e.conversationID] ? 0 : n.time });case t.CONV_GROUP:return this.getGroupRoamMessages({ conversationID: e.conversationID, groupID: n.to, count: e.count, sequence: n.sequence - 1 });default:return Bo();}} }, { key: "getC2CRoamMessages", value: function value(e) {var n = this,r = void 0 !== this.currentMessageKey[e.conversationID] ? this.currentMessageKey[e.conversationID] : "";Y.log("MessageController.getC2CRoamMessages toAccount=".concat(e.peerAccount, " count=").concat(e.count || 15, " lastMessageTime=").concat(e.lastMessageTime || 0, " messageKey=").concat(r));var o = new Qo();return o.setMethod(ii).setStart(), this.request({ name: "c2cMessage", action: "query", param: { peerAccount: e.peerAccount, count: e.count || 15, lastMessageTime: e.lastMessageTime || 0, messageKey: r } }).then(function (i) {var s = i.data,a = s.complete,u = s.messageList;ee(u) ? Y.log("MessageController.getC2CRoamMessages ok. complete=".concat(a, " but messageList is undefined!")) : Y.log("MessageController.getC2CRoamMessages ok. complete=".concat(a, " nums=").concat(u.length)), o.setCode(0).setNetworkType(n.getNetworkType()).setText("".concat(e.peerAccount, "-").concat(e.count || 15, "-").concat(e.lastMessageTime || 0, "-").concat(r, "-").concat(a, "-").concat(u ? u.length : "undefined")).setEnd(), 1 === a && n.getMessageHandler.setCompleted(e.conversationID);var c = n._roamMessageStore(u, t.CONV_C2C, e.conversationID);return n.readReportHandler.updateIsRead(e.conversationID), n.currentMessageKey[e.conversationID] = i.data.messageKey, c;}).catch(function (t) {return n.probeNetwork().then(function (n) {var i = y(n, 2),s = i[0],a = i[1];o.setError(t, s, a).setText("".concat(e.peerAccount, "-").concat(e.count || 15, "-").concat(e.lastMessageTime || 0, "-").concat(r)).setEnd();}), Y.warn("MessageController.getC2CRoamMessages failed. ".concat(t)), Ko(t);});} }, { key: "_computeLastSequence", value: function value(e) {return e.sequence >= 0 ? Promise.resolve(e.sequence) : this.tim.groupController.getGroupLastSequence(e.groupID);} }, { key: "getGroupRoamMessages", value: function value(e) {var n = this,r = new Qo(),o = 0;return this._computeLastSequence(e).then(function (t) {return o = t, Y.log("MessageController.getGroupRoamMessages groupID=".concat(e.groupID, " lastSequence=").concat(o)), r.setMethod(si).setStart(), n.request({ name: "groupMessage", action: "query", param: { groupID: e.groupID, count: 21, sequence: o } });}).then(function (i) {var s = i.data,a = s.messageList,u = s.complete;ee(a) ? Y.log("MessageController.getGroupRoamMessages ok. complete=".concat(u, " but messageList is undefined!")) : Y.log("MessageController.getGroupRoamMessages ok. complete=".concat(u, " nums=").concat(a.length)), r.setCode(0).setNetworkType(n.getNetworkType()).setText("".concat(e.groupID, "-").concat(o, "-").concat(u, "-").concat(a ? a.length : "undefined")).setEnd();var c = "GROUP".concat(e.groupID);if (2 === u || Te(a)) return n.getMessageHandler.setCompleted(c), [];var l = n._roamMessageStore(a, t.CONV_GROUP, c);return n.readReportHandler.updateIsRead(c), l;}).catch(function (t) {return n.probeNetwork().then(function (n) {var i = y(n, 2),s = i[0],a = i[1];r.setError(t, s, a).setText("".concat(e.groupID, "-").concat(o)).setEnd();}), Y.warn("MessageController.getGroupRoamMessages failed. ".concat(t)), Ko(t);});} }, { key: "_roamMessageStore", value: function value() {var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],n = arguments.length > 1 ? arguments[1] : void 0,r = arguments.length > 2 ? arguments[2] : void 0,o = null,i = [],s = 0,a = e.length,c = null,l = n === t.CONV_GROUP,p = this.tim.bigDataHallwayController,h = function h() {s = l ? e.length - 1 : 0, a = l ? 0 : e.length;},f = function f() {l ? --s : ++s;},g = function g() {return l ? s >= a : s < a;};for (h(); g(); f()) {l && 1 === e[s].sequence && this.getMessageHandler.setCompleted(r), 1 !== e[s].isPlaceMessage && ((o = new Rr(e[s])).to = e[s].to, o.isSystemMessage = !!e[s].isSystemMessage, o.conversationType = n, e[s].event === be.JSON.TYPE.GROUP.TIP ? c = { type: t.MSG_GRP_TIP, content: u({}, e[s].elements, { groupProfile: e[s].groupProfile }) } : (e[s].elements = p.parseElements(e[s].elements, e[s].from), c = e[s].elements), o.setElement(c), o.reInitialize(this.tim.context.identifier), i.push(o));}return this.messagesList.unshift(i), h = f = g = null, i;} }, { key: "getLocalMessageList", value: function value(e) {return this.messagesList.getLocalMessageList(e);} }, { key: "getLocalMessage", value: function value(e, t) {return this.messagesList.getLocalMessage(e, t);} }, { key: "hasLocalMessage", value: function value(e, t) {return this.messagesList.hasLocalMessage(e, t);} }, { key: "deleteLocalMessage", value: function value(e) {e instanceof Rr && this.messagesList.remove(e);} }, { key: "revokeMessage", value: function value(e) {var n,r = this;e.conversationType === t.CONV_C2C ? n = { name: "c2cMessageWillBeRevoked", action: "create", param: { msgInfo: { fromAccount: e.from, toAccount: e.to, msgSeq: e.sequence, msgRandom: e.random, msgTimeStamp: e.time } } } : e.conversationType === t.CONV_GROUP && (n = { name: "groupMessageWillBeRevoked", action: "create", param: { to: e.to, msgSeqList: [{ msgSeq: e.sequence }] } });var o = new Qo();return o.setMethod(ai).setMessageType(e.type).setText("".concat(this._generateTjgID(e), "-").concat(e.type, "-").concat(e.from, "-").concat(e.to)).setStart(), this.request(n).then(function (t) {var n = t.data.recallRetList;if (!Te(n) && 0 !== n[0].retCode) {var i = new at({ code: n[0].retCode, message: st[n[0].retCode] || Ln, data: { message: e } });return o.setCode(i.code).setMessage(i.message).setEnd(), Ko(i);}return Y.info("MessageController.revokeMessage ok. ID=".concat(e.ID)), e.isRevoked = !0, o.setCode(0).setEnd(), r.emitInnerEvent(Qr, [e]), new xo({ message: e });}).catch(function (t) {r.probeNetwork().then(function (e) {var n = y(e, 2),r = n[0],i = n[1];o.setError(t, r, i).setEnd();});var n = new at({ code: t && t.code ? t.code : It, message: t && t.message ? t.message : Ln, data: { message: e } });return Y.warn("MessageController.revokeMessage failed. ID=".concat(e.ID, " code=").concat(n.code, " message=").concat(n.message)), Ko(n);});} }, { key: "setMessageRead", value: function value(e) {var t = this;return new Promise(function (n, r) {t.ready(function () {t.readReportHandler.setMessageRead(e).then(n).catch(r);});});} }, { key: "getMessageList", value: function value(e) {return this.getMessageHandler.getMessageList(e);} }, { key: "createTextMessage", value: function value(e) {e.currentUser = this.tim.context.identifier;var t = new Rr(e),n = "string" == typeof e.payload ? e.payload : e.payload.text,r = new Ne({ text: n });return t.setElement(r), t;} }, { key: "createCustomMessage", value: function value(e) {e.currentUser = this.tim.context.identifier;var t = new Rr(e),n = new Er({ data: e.payload.data, description: e.payload.description, extension: e.payload.extension });return t.setElement(n), t;} }, { key: "createImageMessage", value: function value(e) {e.currentUser = this.tim.context.identifier;var t = new Rr(e);if (k) {var n = e.payload.file;if (z(n)) return void Y.warn("微信小程序环境下调用 createImageMessage 接口时，payload.file 不支持传入 File 对象");var r = n.tempFilePaths[0],o = { url: r, name: r.slice(r.lastIndexOf("/") + 1), size: n.tempFiles[0].size, type: r.slice(r.lastIndexOf(".") + 1).toLowerCase() };e.payload.file = o;} else if (E && z(e.payload.file)) {var i = e.payload.file;e.payload.file = { files: [i] };}var s = new Ze({ imageFormat: "UNKNOWN", uuid: this._generateUUID(), file: e.payload.file });return t.setElement(s), this.messageOptionMap.set(t.messageID, e), t;} }, { key: "createFileMessage", value: function value(e) {if (!k) {if (E && z(e.payload.file)) {var t = e.payload.file;e.payload.file = { files: [t] };}e.currentUser = this.tim.context.identifier;var n = new Rr(e),r = new Tr({ uuid: this._generateUUID(), file: e.payload.file });return n.setElement(r), this.messageOptionMap.set(n.messageID, e), n;}Y.warn("微信小程序目前不支持选择文件， createFileMessage 接口不可用！");} }, { key: "createAudioMessage", value: function value(e) {if (k) {var t = e.payload.file;if (k) {var n = { url: t.tempFilePath, name: t.tempFilePath.slice(t.tempFilePath.lastIndexOf("/") + 1), size: t.fileSize, second: parseInt(t.duration) / 1e3, type: t.tempFilePath.slice(t.tempFilePath.lastIndexOf(".") + 1).toLowerCase() };e.payload.file = n;}e.currentUser = this.tim.context.identifier;var r = new Rr(e),o = new tt({ second: Math.floor(t.duration / 1e3), size: t.fileSize, url: t.tempFilePath, uuid: this._generateUUID() });return r.setElement(o), this.messageOptionMap.set(r.messageID, e), r;}Y.warn("createAudioMessage 目前只支持微信小程序发语音消息");} }, { key: "createVideoMessage", value: function value(e) {if (k) {if (e.currentUser = this.tim.context.identifier, k) {e.payload.file.thumbUrl = "https://webim-1252463788.cos.ap-shanghai.myqcloud.com/assets/images/transparent.png", e.payload.file.thumbSize = 1668;var t = e.payload.file,n = { url: t.tempFilePath, name: t.tempFilePath.slice(t.tempFilePath.lastIndexOf("/") + 1), size: t.size, second: t.duration, type: t.tempFilePath.slice(t.tempFilePath.lastIndexOf(".") + 1).toLowerCase() };e.payload.file.videoFile = n;var r = new Rr(e),o = new kr({ videoFormat: n.type, videoSecond: Number(n.second.toFixed(0)), videoSize: n.size, remoteVideoUrl: "", videoUrl: n.url, videoUUID: this._generateUUID(), thumbUUID: this._generateUUID(), thumbWidth: t.width, thumbHeight: t.height, thumbUrl: t.thumbUrl, thumbSize: t.thumbSize, thumbFormat: t.thumbUrl.slice(t.thumbUrl.lastIndexOf(".") + 1).toLowerCase() });return r.setElement(o), this.messageOptionMap.set(r.messageID, e), r;}} else {Y.warn("createVideoMessage 目前只支持微信小程序发视频消息");}} }, { key: "createFaceMessage", value: function value(e) {e.currentUser = this.tim.context.identifier;var t = new Rr(e),n = new et(e.payload);return t.setElement(n), t;} }, { key: "_generateUUID", value: function value() {var e = this.tim.context;return "".concat(e.SDKAppID, "-").concat(e.identifier, "-").concat(function () {for (var e = "", t = 32; t > 0; --t) {e += fe[Math.floor(Math.random() * ge)];}return e;}());} }, { key: "_generateTjgID", value: function value(e) {return this.tim.context.tinyID + "-" + e.random;} }, { key: "getMessageOptionByID", value: function value(e) {return this.messageOptionMap.get(e);} }]), o;}(Go),vu = function () {function e(t) {r(this, e), this.userID = "", this.avatar = "", this.nick = "", this.role = "", this.joinTime = "", this.lastSendMsgTime = "", this.nameCard = "", this.muteUntil = 0, this.memberCustomField = [], this._initMember(t);}return i(e, [{ key: "_initMember", value: function value(e) {this.updateMember(e);} }, { key: "updateMember", value: function value(e) {var t = [null, void 0, "", 0, NaN];e.memberCustomField && _e(this.memberCustomField, e.memberCustomField), ue(this, e, ["memberCustomField"], t);} }, { key: "updateRole", value: function value(e) {["Owner", "Admin", "Member"].indexOf(e) < 0 || (this.role = e);} }, { key: "updateMuteUntil", value: function value(e) {ee(e) || (this.muteUntil = Math.floor((Date.now() + 1e3 * e) / 1e3));} }, { key: "updateNameCard", value: function value(e) {ee(e) || (this.nameCard = e);} }, { key: "updateMemberCustomField", value: function value(e) {e && _e(this.memberCustomField, e);} }]), e;}(),_u = function () {function e(t) {r(this, e), this.tim = t.tim, this.groupController = t.groupController, this._initListeners();}return i(e, [{ key: "_initListeners", value: function value() {this.tim.innerEmitter.on(Xr, this._onReceivedGroupTips, this);} }, { key: "_onReceivedGroupTips", value: function value(e) {var t = this,n = e.data,r = n.result;n.isGroupTip && r.forEach(function (e) {switch (e.payload.operationType) {case 1:t._onNewMemberComeIn(e);break;case 2:t._onMemberQuit(e);break;case 3:t._onMemberKickedOut(e);break;case 4:t._onMemberSetAdmin(e);break;case 5:t._onMemberCancelledAdmin(e);break;case 6:t._onGroupProfileModified(e);break;case 7:t._onMemberInfoModified(e);break;default:Y.warn("GroupTipsHandler._onReceivedGroupTips Unhandled groupTips. operationType=", e.payload.operationType);}});} }, { key: "_onNewMemberComeIn", value: function value(e) {var t = e.payload,n = t.memberNum,r = t.groupProfile.groupID,o = this.groupController.getLocalGroupProfile(r);o && W(n) && (o.memberNum = n);} }, { key: "_onMemberQuit", value: function value(e) {var t = e.payload,n = t.memberNum,r = t.groupProfile.groupID,o = this.groupController.getLocalGroupProfile(r);o && W(n) && (o.memberNum = n), this.groupController.deleteLocalGroupMembers(r, e.payload.userIDList);} }, { key: "_onMemberKickedOut", value: function value(e) {var t = e.payload,n = t.memberNum,r = t.groupProfile.groupID,o = this.groupController.getLocalGroupProfile(r);o && W(n) && (o.memberNum = n), this.groupController.deleteLocalGroupMembers(r, e.payload.userIDList);} }, { key: "_onMemberSetAdmin", value: function value(e) {var n = this,r = e.payload.groupProfile.groupID;e.payload.userIDList.forEach(function (e) {var o = n.groupController.getLocalGroupMemberInfo(r, e);o && o.updateRole(t.GRP_MBR_ROLE_ADMIN);});} }, { key: "_onMemberCancelledAdmin", value: function value(e) {var n = this,r = e.payload.groupProfile.groupID;e.payload.userIDList.forEach(function (e) {var o = n.groupController.getLocalGroupMemberInfo(r, e);o && o.updateRole(t.GRP_MBR_ROLE_MEMBER);});} }, { key: "_onGroupProfileModified", value: function value(e) {var t = this,n = e.payload.newGroupProfile,r = e.payload.groupProfile.groupID,o = this.groupController.getLocalGroupProfile(r);Object.keys(n).forEach(function (e) {switch (e) {case "ownerID":t._ownerChaged(o, n);break;default:o[e] = n[e];}}), this.groupController.emitGroupListUpdate(!0, !0);} }, { key: "_ownerChaged", value: function value(e, n) {var r = e.groupID,o = this.groupController.getLocalGroupProfile(r),i = this.tim.context.identifier;if (i === n.ownerID) {o.updateGroup({ selfInfo: { role: t.GRP_MBR_ROLE_OWNER } });var s = this.groupController.getLocalGroupMemberInfo(r, i),a = this.groupController.getLocalGroupProfile(r).ownerID,u = this.groupController.getLocalGroupMemberInfo(r, a);s && s.updateRole(t.GRP_MBR_ROLE_OWNER), u && u.updateRole(t.GRP_MBR_ROLE_MEMBER);}} }, { key: "_onMemberInfoModified", value: function value(e) {var t = this,n = e.payload.groupProfile.groupID;e.payload.memberList.forEach(function (e) {var r = t.groupController.getLocalGroupMemberInfo(n, e.userID);r && e.muteTime && r.updateMuteUntil(e.muteTime);});} }]), e;}(),Cu = function () {function n(e) {r(this, n), this.groupController = e.groupController, this.tim = e.tim, this.pendencyMap = new Map(), this._initLiceners();}return i(n, [{ key: "_initLiceners", value: function value() {this.tim.innerEmitter.on(Jr, this._onReceivedGroupSystemNotice, this), this.tim.innerEmitter.on(jr, this._clearGroupSystemNotice, this);} }, { key: "_clearGroupSystemNotice", value: function value() {var e = this;this.getPendencyList().then(function (n) {n.forEach(function (t) {e.pendencyMap.set("".concat(t.from, "_").concat(t.groupID, "_").concat(t.to), t);});var r = e.tim.messageController.getLocalMessageList(t.CONV_SYSTEM),o = [];r.forEach(function (t) {var n = t.payload,r = n.operatorID,i = n.operationType,s = n.groupProfile;if (i === Pe) {var a = "".concat(r, "_").concat(s.groupID, "_").concat(s.to),u = e.pendencyMap.get(a);u && W(u.handled) && 0 !== u.handled && o.push(t);}}), e.groupController.deleteGroupSystemNotice({ messageList: o });});} }, { key: "getPendencyList", value: function value(e) {var t = this;return this.groupController.request({ name: "group", action: "getGroupPendency", param: { startTime: e && e.startTime ? e.startTime : 0, limit: e && e.limit ? e.limit : 10, handleAccount: this.tim.context.identifier } }).then(function (e) {var n = e.data,r = n.pendencyList;return 0 !== n.nextStartTime ? t.getPendencyList({ startTime: n.nextStartTime }).then(function (e) {return [].concat(v(r), v(e));}) : r;});} }, { key: "_onReceivedGroupSystemNotice", value: function value(t) {var n = this,r = t.data,o = r.result;"sync" !== r.type && o.forEach(function (t) {switch (t.payload.operationType) {case 1:n._onApplyGroupRequest(t);break;case 2:n._onApplyGroupRequestAgreed(t);break;case 3:n._onApplyGroupRequestRefused(t);break;case 4:n._onMemberKicked(t);break;case 5:n._onGroupDismissed(t);break;case 6:break;case 7:n._onInviteGroup(t);break;case 8:n._onQuitGroup(t);break;case 9:n._onSetManager(t);break;case 10:n._onDeleteManager(t);break;case 11:case 12:case 15:break;case 255:n.groupController.emitOuterEvent(e.GROUP_SYSTEM_NOTICE_RECEIVED, { message: t, type: je });}});} }, { key: "_onApplyGroupRequest", value: function value(t) {this.groupController.emitOuterEvent(e.GROUP_SYSTEM_NOTICE_RECEIVED, { message: t, type: Pe });} }, { key: "_onApplyGroupRequestAgreed", value: function value(t) {var n = this,r = t.payload.groupProfile.groupID;this.groupController.hasLocalGroup(r) || this.groupController.getGroupProfile({ groupID: r }).then(function (e) {var t = e.data.group;t && (n.groupController.updateGroupMap([t]), n.groupController.emitGroupListUpdate());}), this.groupController.emitOuterEvent(e.GROUP_SYSTEM_NOTICE_RECEIVED, { message: t, type: Ge });} }, { key: "_onApplyGroupRequestRefused", value: function value(t) {this.groupController.emitOuterEvent(e.GROUP_SYSTEM_NOTICE_RECEIVED, { message: t, type: qe });} }, { key: "_onMemberKicked", value: function value(t) {var n = t.payload.groupProfile.groupID;this.groupController.hasLocalGroup(n) && this.groupController.deleteLocalGroupAndConversation(n), this.groupController.emitOuterEvent(e.GROUP_SYSTEM_NOTICE_RECEIVED, { message: t, type: Ue });} }, { key: "_onGroupDismissed", value: function value(t) {var n = t.payload.groupProfile.groupID,r = this.groupController.hasLocalGroup(n),o = this.groupController.AVChatRoomHandler;r && this.groupController.deleteLocalGroupAndConversation(n), o.checkJoinedAVChatRoomByID(n) && o.reset(), this.groupController.emitOuterEvent(e.GROUP_SYSTEM_NOTICE_RECEIVED, { message: t, type: xe });} }, { key: "_onInviteGroup", value: function value(t) {var n = this,r = t.payload.groupProfile.groupID;this.groupController.hasLocalGroup(r) || this.groupController.getGroupProfile({ groupID: r }).then(function (e) {var t = e.data.group;t && (n.groupController.updateGroupMap([t]), n.groupController.emitGroupListUpdate());}), this.groupController.emitOuterEvent(e.GROUP_SYSTEM_NOTICE_RECEIVED, { message: t, type: Fe });} }, { key: "_onQuitGroup", value: function value(t) {var n = t.payload.groupProfile.groupID;this.groupController.hasLocalGroup(n) && this.groupController.deleteLocalGroupAndConversation(n), this.groupController.emitOuterEvent(e.GROUP_SYSTEM_NOTICE_RECEIVED, { message: t, type: He });} }, { key: "_onSetManager", value: function value(n) {var r = n.payload.groupProfile,o = r.to,i = r.groupID,s = this.groupController.getLocalGroupMemberInfo(i, o);s && s.updateRole(t.GRP_MBR_ROLE_ADMIN), this.groupController.emitOuterEvent(e.GROUP_SYSTEM_NOTICE_RECEIVED, { message: n, type: Be });} }, { key: "_onDeleteManager", value: function value(n) {var r = n.payload.groupProfile,o = r.to,i = r.groupID,s = this.groupController.getLocalGroupMemberInfo(i, o);s && s.updateRole(t.GRP_MBR_ROLE_MEMBER), this.groupController.emitOuterEvent(e.GROUP_SYSTEM_NOTICE_RECEIVED, { message: n, type: Ke });} }, { key: "reset", value: function value() {this.pendencyMap.clear();} }]), n;}(),Iu = { 3: !0, 4: !0, 5: !0, 6: !0 },Mu = function () {function n(e) {var t = e.tim,o = e.groupController;r(this, n), this.tim = t, this.groupController = o, this.AVChatRoomLoop = null, this.key = "", this.startSeq = 0, this.group = {};}return i(n, [{ key: "hasJoinedAVChatRoom", value: function value() {return !(!this.group || ee(this.group.groupID));} }, { key: "checkJoinedAVChatRoomByID", value: function value(e) {return !(!this.group && ee(this.group.groupID)) && e === this.group.groupID;} }, { key: "getJoinedAVChatRoom", value: function value() {return this.hasJoinedAVChatRoom() ? this.group : null;} }, { key: "_updateProperties", value: function value(e) {var t = this;Object.keys(e).forEach(function (n) {t[n] = e[n];});} }, { key: "start", value: function value() {var e = { key: this.key, startSeq: this.startSeq };if (null === this.AVChatRoomLoop) {var t = this.groupController.createTransportCapsule({ name: "AVChatRoom", action: "startLongPoll", param: e });this.AVChatRoomLoop = this.tim.connectionController.createRunLoop({ pack: t, before: this._updateRequestData.bind(this), success: this._handleSuccess.bind(this), fail: this._handleFailure.bind(this), isAVChatRoomLoop: !0 }), this.AVChatRoomLoop.start(), Y.log("AVChatRoomHandler.start message channel started");} else this.AVChatRoomLoop.isRunning() || this.AVChatRoomLoop.start();} }, { key: "stop", value: function value() {null !== this.AVChatRoomLoop && this.AVChatRoomLoop.isRunning() && (this.AVChatRoomLoop.abort(), this.AVChatRoomLoop.stop(), Y.log("AVChatRoomHandler.stop message channel stopped"));} }, { key: "startRunLoop", value: function value(e) {var t = this;return this._precheck().then(function () {var n = e.longPollingKey,r = e.group;return t._updateProperties({ key: n, startSeq: 0, group: r || {} }), t.groupController.updateGroupMap([r]), t.groupController.emitGroupListUpdate(!0, !1), t.start(), t.groupController.isLoggedIn() ? Bo({ status: we.SUCCESS, group: r }) : Bo({ status: we.SUCCESS });});} }, { key: "joinWithoutAuth", value: function value(e) {var t = this;return this.groupController.request({ name: "group", action: "applyJoinAVChatRoom", param: e }).then(function (n) {var r = n.data.longPollingKey;if (ee(r)) return Ko(new at({ code: Vt, message: tr }));Y.log("AVChatRoomHandler.joinWithoutAuth ok. groupID:", e.groupID), t.groupController.emitInnerEvent(wo, e.groupID);var o = new au({ groupID: e.groupID });return t.startRunLoop({ group: o, longPollingKey: r }), new xo({ status: we.SUCCESS });}).catch(function (t) {return Y.error("AVChatRoomHandler.joinWithoutAuth error:".concat(t.message, ". groupID:").concat(e.groupID)), Ko(t);});} }, { key: "_precheck", value: function value() {if (!this.hasJoinedAVChatRoom()) return Promise.resolve();if (this.groupController.isLoggedIn()) {if (!(this.group.selfInfo.role === t.GRP_MBR_ROLE_OWNER || this.group.ownerID === this.tim.loginInfo.identifier)) return this.groupController.quitGroup(this.group.groupID);this.groupController.deleteLocalGroupAndConversation(this.group.groupID);} else this.groupController.deleteLocalGroupAndConversation(this.group.groupID);return this.reset(), Promise.resolve();} }, { key: "_updateRequestData", value: function value(e) {e.StartSeq = this.startSeq, e.Key = this.key, this.tim.sumStatController.addTotalCount(Yo);} }, { key: "_handleSuccess", value: function value(e) {this.tim.sumStatController.addSuccessCount(Yo), this.tim.sumStatController.addCost(Yo, e.data.timecost), this.startSeq = e.data.nextSeq, this.key = e.data.key, Array.isArray(e.data.rspMsgList) && e.data.rspMsgList.forEach(function (e) {e.to = e.groupID;}), e.data.rspMsgList && e.data.rspMsgList.length > 0 && this._dispatchNotice(e.data.rspMsgList), this.groupController.emitInnerEvent(yo);} }, { key: "_handleFailure", value: function value(e) {if (e.error) if ("ECONNABORTED" === e.error.code || e.error.code === on) {if (e.error.config) {var t = e.error.config.url,n = e.error.config.data;Y.log("AVChatRoomHandler._handleFailure request timed out. url=".concat(t, " data=").concat(n));} else Y.log("AVChatRoomHandler._handleFailure request timed out");} else Y.log("AVChatRoomHandler._handleFailure request failed due to network error");this.groupController.emitInnerEvent(mo);} }, { key: "_dispatchNotice", value: function value(n) {if (Z(n) && 0 !== n.length) {for (var r = null, o = [], i = [], s = 0; s < n.length; s++) {Iu[n[s].event] ? (r = this.packMessage(n[s], n[s].event), this.tim.messageController.hasLocalMessage(r.conversationID, r.ID) || (r.conversationType === t.CONV_SYSTEM && i.push(r), o.push(r))) : Y.warn("AVChatRoomHandler._dispatchMessage 未处理的 event 类型：", n[s].event);}if (i.length > 0 && this.groupController.emitInnerEvent(Jr, { result: i, eventDataList: [], type: "poll" }), 0 !== o.length) {var a = this.packConversationOption(o);a.length > 0 && this.groupController.emitInnerEvent(Xr, { eventDataList: a, type: "poll" }), Y.debug("AVChatRoomHandler._dispatchNotice nums=".concat(o.length)), this.groupController.emitOuterEvent(e.MESSAGE_RECEIVED, o);}}} }, { key: "packMessage", value: function value(e, n) {e.currentUser = this.tim.context.identifier, e.conversationType = 5 === n ? t.CONV_SYSTEM : t.CONV_GROUP, e.isSystemMessage = !!e.isSystemMessage;var r = new Rr(e),o = this.packElements(e, n);return r.setElement(o), r;} }, { key: "packElements", value: function value(e, n) {return 4 === n || 6 === n ? { type: t.MSG_GRP_TIP, content: u({}, e.elements, { groupProfile: e.groupProfile }) } : 5 === n ? { type: t.MSG_GRP_SYS_NOTICE, content: u({}, e.elements, { groupProfile: e.groupProfile }) } : this.tim.bigDataHallwayController.parseElements(e.elements, e.from);} }, { key: "packConversationOption", value: function value(e) {for (var t = new Map(), n = 0; n < e.length; n++) {var r = e[n],o = r.conversationID;if (t.has(o)) {var i = t.get(o);i.lastMessage = r, "in" === r.flow && i.unreadCount++;} else t.set(o, { conversationID: r.conversationID, unreadCount: "out" === r.flow ? 0 : 1, type: r.conversationType, subType: r.conversationSubType, lastMessage: r });}return v(t.values());} }, { key: "reset", value: function value() {null !== this.AVChatRoomLoop && (Y.log("AVChatRoomHandler.reset"), this.stop(), this.AVChatRoomLoop = null, this.key = "", this.startSeq = 0, this.group = {});} }]), n;}(),Su = function (n) {function o(e) {var t;return r(this, o), (t = m(this, l(o).call(this, e))).groupMap = new Map(), t.groupMemberListMap = new Map(), t.groupNoticeHandler = new Cu({ tim: e, groupController: d(t) }), t.groupTipsHandler = new _u({ tim: e, groupController: d(t) }), t.AVChatRoomHandler = new Mu({ tim: e, groupController: d(t) }), t._initListeners(), t;}return c(o, n), i(o, [{ key: "createGroup", value: function value(e) {var n = this;if (!["Public", "Private", "ChatRoom", "AVChatRoom"].includes(e.type)) {var r = new at({ code: qt, message: zn });return Ko(r);}Ie(e.type) && !ee(e.memberList) && e.memberList.length > 0 && (Y.warn("GroupController.createGroup 创建AVChatRoom时不能添加群成员，自动忽略该字段"), e.memberList = void 0), Ce(e.type) || ee(e.joinOption) || (Y.warn("GroupController.createGroup 创建Private/ChatRoom/AVChatRoom群时不能设置字段：joinOption，自动忽略该字段"), e.joinOption = void 0);var o = new Qo();return o.setMethod(fi).setStart(), Y.log("GroupController.createGroup."), this.request({ name: "group", action: "create", param: e }).then(function (r) {if (o.setCode(0).setNetworkType(n.getNetworkType()).setText("groupType=".concat(e.type, " groupID=").concat(r.data.groupID)).setEnd(), Y.log("GroupController.createGroup ok. groupID:", r.data.groupID), e.type === t.GRP_AVCHATROOM) return n.getGroupProfile({ groupID: r.data.groupID });n.updateGroupMap([u({}, e, { groupID: r.data.groupID })]);var i = n.tim.createCustomMessage({ to: r.data.groupID, conversationType: t.CONV_GROUP, payload: { data: "group_create", extension: "".concat(n.tim.context.identifier, "创建群组") } });return n.tim.sendMessage(i), n.emitGroupListUpdate(), n.getGroupProfile({ groupID: r.data.groupID });}).then(function (e) {var n = e.data.group;return n.selfInfo.messageRemindType = t.MSG_REMIND_ACPT_AND_NOTE, n.selfInfo.role = t.GRP_MBR_ROLE_OWNER, e;}).catch(function (t) {return o.setText("groupType=".concat(e.type)), n.probeNetwork().then(function (e) {var n = y(e, 2),r = n[0],i = n[1];o.setError(t, r, i).setEnd();}), Y.error("GroupController.createGroup error:", t), Ko(t);});} }, { key: "joinGroup", value: function value(e) {if (this.hasLocalGroup(e.groupID)) {var n = { status: t.JOIN_STATUS_ALREADY_IN_GROUP };return Bo(n);}if (e.type === t.GRP_PRIVATE) {var r = new at({ code: Ut, message: Wn });return Ko(r);}return Y.log("GroupController.joinGroup. groupID:", e.groupID), this.isLoggedIn() ? this.applyJoinGroup(e) : this.AVChatRoomHandler.joinWithoutAuth(e);} }, { key: "quitGroup", value: function value(e) {var t = this;Y.log("GroupController.quitGroup. groupID:", e);var n = this.AVChatRoomHandler.checkJoinedAVChatRoomByID(e);if (n && !this.isLoggedIn()) return Y.log("GroupController.quitGroup anonymously ok. groupID:", e), this.deleteLocalGroupAndConversation(e), this.AVChatRoomHandler.reset(), Bo({ groupID: e });var r = new Qo();return r.setMethod(di).setStart(), this.request({ name: "group", action: "quitGroup", param: { groupID: e } }).then(function () {return r.setCode(0).setNetworkType(t.getNetworkType()).setText("groupID=".concat(e)).setEnd(), Y.log("GroupController.quitGroup ok. groupID:", e), n && t.AVChatRoomHandler.reset(), t.deleteLocalGroupAndConversation(e), new xo({ groupID: e });}).catch(function (n) {return r.setText("groupID=".concat(e)), t.probeNetwork().then(function (e) {var t = y(e, 2),o = t[0],i = t[1];r.setError(n, o, i).setEnd();}), Y.error("GroupController.quitGroup error.  error:".concat(n, ". groupID:").concat(e)), Ko(n);});} }, { key: "changeGroupOwner", value: function value(e) {var n = this;if (this.hasLocalGroup(e.groupID) && this.getLocalGroupProfile(e.groupID).type === t.GRP_AVCHATROOM) return Ko(new at({ code: xt, message: Xn }));if (e.newOwnerID === this.tim.loginInfo.identifier) return Ko(new at({ code: Ft, message: Jn }));var r = new Qo();return r.setMethod(mi).setStart(), Y.log("GroupController.changeGroupOwner. groupID:", e.groupID), this.request({ name: "group", action: "changeGroupOwner", param: e }).then(function () {r.setCode(0).setNetworkType(n.getNetworkType()).setText("groupID=".concat(e.groupID)).setEnd(), Y.log("GroupController.changeGroupOwner ok. groupID:", e.groupID);var t = e.groupID,o = e.newOwnerID;n.groupMap.get(t).ownerID = o;var i = n.groupMemberListMap.get(t);if (i instanceof Map) {var s = i.get(n.tim.loginInfo.identifier);ee(s) || (s.updateRole("Member"), n.groupMap.get(t).selfInfo.role = "Member");var a = i.get(o);ee(a) || a.updateRole("Owner");}return n.emitGroupListUpdate(!0, !1), new xo({ group: n.groupMap.get(t) });}).catch(function (t) {return r.setText("groupID=".concat(e.groupID)), n.probeNetwork().then(function (e) {var n = y(e, 2),o = n[0],i = n[1];r.setError(t, o, i).setEnd();}), Y.error("GroupController.changeGroupOwner error:".concat(t, ". groupID:").concat(e.groupID)), Ko(t);});} }, { key: "dismissGroup", value: function value(e) {var n = this;if (this.hasLocalGroup(e) && this.getLocalGroupProfile(e).type === t.GRP_PRIVATE) return Ko(new at({ code: Ht, message: Qn }));var r = new Qo();return r.setMethod(yi).setStart(), Y.log("GroupController.dismissGroup. groupID:".concat(e)), this.request({ name: "group", action: "destroyGroup", param: { groupID: e } }).then(function () {return r.setCode(0).setNetworkType(n.getNetworkType()).setText("groupID=".concat(e)).setEnd(), Y.log("GroupController.dismissGroup ok. groupID:".concat(e)), n.deleteLocalGroupAndConversation(e), n.checkJoinedAVChatRoomByID(e) && n.AVChatRoomHandler.reset(), new xo({ groupID: e });}).catch(function (t) {return r.setText("groupID=".concat(e)), n.probeNetwork().then(function (e) {var n = y(e, 2),o = n[0],i = n[1];r.setError(t, o, i).setEnd();}), Y.error("GroupController.dismissGroup error:".concat(t, ". groupID:").concat(e)), Ko(t);});} }, { key: "updateGroupProfile", value: function value(e) {var t = this;!this.hasLocalGroup(e.groupID) || Ce(this.getLocalGroupProfile(e.groupID).type) || ee(e.joinOption) || (Y.warn("GroupController.modifyGroup: Private/ChatRoom/AVChatRoom群不能设置字段：joinOption，自动忽略该字段"), e.joinOption = void 0);var n = new Qo();return n.setMethod(vi).setStart(), Y.log("GroupController.modifyGroup. groupID:", e.groupID), this.request({ name: "group", action: "updateGroupProfile", param: e }).then(function () {(n.setCode(0).setNetworkType(t.getNetworkType()).setText("groupID=".concat(e.groupID)).setEnd(), Y.log("GroupController.modifyGroup ok. groupID:", e.groupID), t.hasLocalGroup(e.groupID)) && (t.groupMap.get(e.groupID).updateGroup(e), t._setStorageGroupList());return new xo({ group: t.groupMap.get(e.groupID) });}).catch(function (r) {return n.setText("groupID=".concat(e.groupID)), t.probeNetwork().then(function (e) {var t = y(e, 2),o = t[0],i = t[1];n.setError(r, o, i).setEnd();}), Y.log("GroupController.modifyGroup error. error:".concat(r, " groupID:").concat(e.groupID)), Ko(r);});} }, { key: "setGroupMemberRole", value: function value(e) {var n = this,r = e.groupID,o = e.userID,i = e.role,s = this.groupMap.get(r);if (s.selfInfo.role !== t.GRP_MBR_ROLE_OWNER) return Ko(new at({ code: $t, message: rr }));if ([t.GRP_PRIVATE, t.GRP_AVCHATROOM].includes(s.type)) return Ko(new at({ code: Yt, message: or }));if ([t.GRP_MBR_ROLE_ADMIN, t.GRP_MBR_ROLE_MEMBER].indexOf(i) < 0) return Ko(new at({ code: zt, message: ir }));if (o === this.tim.loginInfo.identifier) return Ko(new at({ code: Wt, message: sr }));var a = new Qo();return a.setMethod(Di).setStart(), a.setText("groupID=".concat(r, " userID=").concat(o, " role=").concat(i)), Y.log("GroupController.setGroupMemberRole. groupID:".concat(r, ". userID: ").concat(o)), this._modifyGroupMemberInfo({ groupID: r, userID: o, role: i }).then(function (e) {return a.setCode(0).setNetworkType(n.getNetworkType()).setEnd(), Y.log("GroupController.setGroupMemberRole ok. groupID:".concat(r, ". userID: ").concat(o)), new xo({ group: s, member: e });}).catch(function (e) {return n.probeNetwork().then(function (t) {var n = y(t, 2),r = n[0],o = n[1];a.setError(e, r, o).setEnd();}), Y.error("GroupController.setGroupMemberRole error:".concat(e, ". groupID:").concat(r, ". userID:").concat(o)), Ko(e);});} }, { key: "setGroupMemberMuteTime", value: function value(e) {var t = this,n = e.groupID,r = e.userID,o = e.muteTime;if (r === this.tim.loginInfo.identifier) return Ko(new at({ code: Xt, message: ar }));Y.log("GroupController.setGroupMemberMuteTime. groupID:".concat(n, ". userID: ").concat(r));var i = new Qo();return i.setMethod(Mi).setStart(), i.setText("groupID=".concat(n, " userID=").concat(r, " muteTime=").concat(o)), this._modifyGroupMemberInfo({ groupID: n, userID: r, muteTime: o }).then(function (e) {return i.setCode(0).setNetworkType(t.getNetworkType()).setEnd(), Y.log("GroupController.setGroupMemberMuteTime ok. groupID:".concat(n, ". userID: ").concat(r)), new xo({ group: t.getLocalGroupProfile(n), member: e });}).catch(function (e) {return t.probeNetwork().then(function (t) {var n = y(t, 2),r = n[0],o = n[1];i.setError(e, r, o).setEnd();}), Y.error("GroupController.setGroupMemberMuteTime error:".concat(e, ". groupID:").concat(n, ". userID:").concat(r)), Ko(e);});} }, { key: "setMessageRemindType", value: function value(e) {var t = this;Y.log("GroupController.setMessageRemindType. groupID:".concat(e.groupID, ". userID: ").concat(e.userID || this.tim.loginInfo.identifier));var n = e.groupID,r = e.messageRemindType;return this._modifyGroupMemberInfo({ groupID: n, messageRemindType: r, userID: this.tim.loginInfo.identifier }).then(function () {Y.log("GroupController.setMessageRemindType ok. groupID:".concat(e.groupID, ". userID: ").concat(e.userID || t.tim.loginInfo.identifier));var n = t.getLocalGroupProfile(e.groupID);return n && (n.selfInfo.messageRemindType = r), new xo({ group: n });}).catch(function (n) {return Y.error("GroupController.setMessageRemindType error:".concat(n, ". groupID:").concat(e.groupID, ". userID:").concat(e.userID || t.tim.loginInfo.identifier)), Ko(n);});} }, { key: "setGroupMemberNameCard", value: function value(e) {var t = this,n = e.groupID,r = e.userID,o = void 0 === r ? this.tim.loginInfo.identifier : r,i = e.nameCard;Y.log("GroupController.setGroupMemberNameCard. groupID:".concat(n, ". userID: ").concat(o));var s = new Qo();return s.setMethod(Si).setStart(), s.setText("groupID=".concat(n, " userID=").concat(o, " nameCard=").concat(i)), this._modifyGroupMemberInfo({ groupID: n, userID: o, nameCard: i }).then(function (e) {Y.log("GroupController.setGroupMemberNameCard ok. groupID:".concat(n, ". userID: ").concat(o)), s.setCode(0).setNetworkType(t.getNetworkType()).setEnd();var r = t.getLocalGroupProfile(n);return o === t.tim.loginInfo.identifier && r && r.setSelfNameCard(i), new xo({ group: r, member: e });}).catch(function (e) {return t.probeNetwork().then(function (t) {var n = y(t, 2),r = n[0],o = n[1];s.setError(e, r, o).setEnd();}), Y.error("GroupController.setGroupMemberNameCard error:".concat(e, ". groupID:").concat(n, ". userID:").concat(o)), Ko(e);});} }, { key: "setGroupMemberCustomField", value: function value(e) {var t = this,n = e.groupID,r = e.userID,o = void 0 === r ? this.tim.loginInfo.identifier : r,i = e.memberCustomField;Y.log("GroupController.setGroupMemberCustomField. groupID:".concat(n, ". userID: ").concat(o));var s = new Qo();return s.setMethod(Ti).setStart(), s.setText("groupID=".concat(n, " userID=").concat(o, " memberCustomField=").concat(i)), this._modifyGroupMemberInfo({ groupID: n, userID: o, memberCustomField: i }).then(function (e) {return s.setCode(0).setNetworkType(t.getNetworkType()).setEnd(), Y.log("GroupController.setGroupMemberCustomField ok. groupID:".concat(n, ". userID: ").concat(o)), new xo({ group: t.groupMap.get(n), member: e });}).catch(function (e) {return t.probeNetwork().then(function (t) {var n = y(t, 2),r = n[0],o = n[1];s.setError(e, r, o).setEnd();}), Y.error("GroupController.setGroupMemberCustomField error:".concat(e, ". groupID:").concat(n, ". userID:").concat(o)), Ko(e);});} }, { key: "getGroupList", value: function value(e) {var t = this,n = new Qo();n.setMethod(_i).setStart(), Y.log("GroupController.getGroupList");var r = { introduction: "Introduction", notification: "Notification", createTime: "CreateTime", ownerID: "Owner_Account", lastInfoTime: "LastInfoTime", memberNum: "MemberNum", maxMemberNum: "MaxMemberNum", joinOption: "ApplyJoinOption" },o = ["Type", "Name", "FaceUrl", "NextMsgSeq", "LastMsgTime"];return e && e.groupProfileFilter && e.groupProfileFilter.forEach(function (e) {r[e] && o.push(r[e]);}), this.request({ name: "group", action: "list", param: { responseFilter: { groupBaseInfoFilter: o, selfInfoFilter: ["Role", "JoinTime", "MsgFlag"] } } }).then(function (e) {var r = e.data.groups;return n.setCode(0).setNetworkType(t.getNetworkType()).setText(r.length).setEnd(), Y.log("GroupController.getGroupList ok. nums=".concat(r.length)), t._groupListTreeShaking(r), t.updateGroupMap(r), t.tempConversationList && (t._handleUpdateGroupLastMessage(t.tempConversationList), t.tempConversationList = null), t.emitGroupListUpdate(), new xo({ groupList: t.getLocalGroups() });}).catch(function (e) {return t.probeNetwork().then(function (t) {var r = y(t, 2),o = r[0],i = r[1];n.setError(e, o, i).setEnd();}), Y.error("GroupController.getGroupList error: ", e), Ko(e);});} }, { key: "getGroupMemberList", value: function value(e) {var t = this,n = e.groupID,r = e.offset,o = void 0 === r ? 0 : r,i = e.count,s = void 0 === i ? 15 : i;Y.log("GroupController.getGroupMemberList groupID: ".concat(n, " offset: ").concat(o, " count: ").concat(s));var a = [];return this.request({ name: "group", action: "getGroupMemberList", param: { groupID: n, offset: o, limit: s > 100 ? 100 : s, memberInfoFilter: ["Role", "NameCard"] } }).then(function (e) {var r = e.data,o = r.members,i = r.memberNum;return Z(o) && 0 !== o.length ? (t.hasLocalGroup(n) && (t.getLocalGroupProfile(n).memberNum = i), a = t._updateLocalGroupMemberMap(n, o), t.tim.getUserProfile({ userIDList: o.map(function (e) {return e.userID;}), tagList: [We.NICK, We.AVATAR] })) : Promise.resolve([]);}).then(function (e) {var r = e.data;if (!Z(r) || 0 === r.length) return Bo({ memberList: [] });var o = r.map(function (e) {return { userID: e.userID, nick: e.nick, avatar: e.avatar };});return t._updateLocalGroupMemberMap(n, o), Y.log("GroupController.getGroupMemberList ok."), new xo({ memberList: a });}).catch(function (e) {return Y.error("GroupController.getGroupMemberList error: ", e), Ko(e);});} }, { key: "getLocalGroups", value: function value() {return v(this.groupMap.values());} }, { key: "getLocalGroupProfile", value: function value(e) {return this.groupMap.get(e);} }, { key: "hasLocalGroup", value: function value(e) {return this.groupMap.has(e);} }, { key: "getLocalGroupMemberInfo", value: function value(e, t) {return this.groupMemberListMap.has(e) ? this.groupMemberListMap.get(e).get(t) : null;} }, { key: "setLocalGroupMember", value: function value(e, t) {if (this.groupMemberListMap.has(e)) this.groupMemberListMap.get(e).set(t.userID, t);else {var n = new Map().set(t.userID, t);this.groupMemberListMap.set(e, n);}} }, { key: "hasLocalGroupMember", value: function value(e, t) {return this.groupMemberListMap.has(e) && this.groupMemberListMap.get(e).has(t);} }, { key: "hasLocalGroupMemberMap", value: function value(e) {return this.groupMemberListMap.has(e);} }, { key: "getGroupProfile", value: function value(e) {var t = this;Y.log("GroupController.getGroupProfile. groupID:", e.groupID);var n = e.groupID,r = e.groupCustomFieldFilter,o = { groupIDList: [n], responseFilter: { groupBaseInfoFilter: ["Type", "Name", "Introduction", "Notification", "FaceUrl", "Owner_Account", "CreateTime", "InfoSeq", "LastInfoTime", "LastMsgTime", "MemberNum", "MaxMemberNum", "ApplyJoinOption", "NextMsgSeq"], groupCustomFieldFilter: r } };return this.getGroupProfileAdvance(o).then(function (r) {var o,i = r.data,s = i.successGroupList,a = i.failureGroupList;return Y.log("GroupController.getGroupProfile ok. groupID:", e.groupID), a.length > 0 ? Ko(a[0]) : (Ie(s[0].type) && !t.hasLocalGroup(n) ? o = new au(s[0]) : (t.updateGroupMap(s), o = t.getLocalGroupProfile(n)), o && o.selfInfo && !o.selfInfo.nameCard ? t.updateSelfInfo(o).then(function (e) {return new xo({ group: e });}) : new xo({ group: o }));}).catch(function (t) {return Y.error("GroupController.getGroupProfile error:".concat(t, ". groupID:").concat(e.groupID)), Ko(t);});} }, { key: "getGroupMemberProfile", value: function value(e) {var t = this;Y.log("GroupController.getGroupMemberProfile groupID:".concat(e.groupID, " userIDList:").concat(e.userIDList.join(","))), e.userIDList.length > 50 && (e.userIDList = e.userIDList.slice(0, 50));var n = e.groupID,r = e.userIDList;return this._getGroupMemberProfileAdvance(u({}, e, { userIDList: r })).then(function (e) {var r = e.data.members;return Z(r) && 0 !== r.length ? (t._updateLocalGroupMemberMap(n, r), t.tim.getUserProfile({ userIDList: r.map(function (e) {return e.userID;}), tagList: [We.NICK, We.AVATAR] })) : Bo([]);}).then(function (e) {var o = e.data.map(function (e) {return { userID: e.userID, nick: e.nick, avatar: e.avatar };});t._updateLocalGroupMemberMap(n, o);var i = r.filter(function (e) {return t.hasLocalGroupMember(n, e);}).map(function (e) {return t.getLocalGroupMemberInfo(n, e);});return new xo({ memberList: i });});} }, { key: "_getGroupMemberProfileAdvance", value: function value(e) {return this.request({ name: "group", action: "getGroupMemberProfile", param: u({}, e, { memberInfoFilter: e.memberInfoFilter ? e.memberInfoFilter : ["Role", "JoinTime", "NameCard", "ShutUpUntil"] }) });} }, { key: "updateSelfInfo", value: function value(e) {var t = e.groupID;Y.log("GroupController.updateSelfInfo groupID:", t);var n = { groupID: t, userIDList: [this.tim.loginInfo.identifier] };return this.getGroupMemberProfile(n).then(function (n) {var r = n.data.memberList;return Y.log("GroupController.updateSelfInfo ok. groupID:", t), e && 0 !== r.length && e.updateSelfInfo(r[0]), e;});} }, { key: "addGroupMember", value: function value(e) {var t = this.getLocalGroupProfile(e.groupID);if (Ie(t.type)) {var n = new at({ code: Kt, message: er });return Ko(n);}return e.userIDList = e.userIDList.map(function (e) {return { userID: e };}), Y.log("GroupController.addGroupMember. groupID:", e.groupID), this.request({ name: "group", action: "addGroupMember", param: e }).then(function (n) {var r = n.data.members;Y.log("GroupController.addGroupMember ok. groupID:", e.groupID);var o = r.filter(function (e) {return 1 === e.result;}).map(function (e) {return e.userID;}),i = r.filter(function (e) {return 0 === e.result;}).map(function (e) {return e.userID;}),s = r.filter(function (e) {return 2 === e.result;}).map(function (e) {return e.userID;});return 0 === o.length ? new xo({ successUserIDList: o, failureUserIDList: i, existedUserIDList: s }) : (t.memberNum += o.length, new xo({ successUserIDList: o, failureUserIDList: i, existedUserIDList: s, group: t }));}).catch(function (t) {return Y.error("GroupController.addGroupMember error:".concat(t, ", groupID:").concat(e.groupID)), Ko(t);});} }, { key: "deleteGroupMember", value: function value(e) {var n = this;Y.log("GroupController.deleteGroupMember groupID:".concat(e.groupID, " userIDList:").concat(e.userIDList));var r = this.getLocalGroupProfile(e.groupID);return r.type === t.GRP_AVCHATROOM ? Ko(new at({ code: jt, message: nr })) : this.request({ name: "group", action: "deleteGroupMember", param: e }).then(function () {return Y.log("GroupController.deleteGroupMember ok"), r.memberNum--, n.deleteLocalGroupMembers(e.groupID, e.userIDList), new xo({ group: r, userIDList: e.userIDList });}).catch(function (t) {return Y.error("GroupController.deleteGroupMember error:".concat(t.code, ", groupID:").concat(e.groupID)), Ko(t);});} }, { key: "searchGroupByID", value: function value(e) {var t = { groupIDList: [e] };return Y.log("GroupController.searchGroupByID. groupID:".concat(e)), this.request({ name: "group", action: "searchGroupByID", param: t }).then(function (t) {var n = t.data.groupProfile;if (Y.log("GroupController.searchGroupByID ok. groupID:".concat(e)), n[0].errorCode !== Ae.SUCCESS) throw new at({ code: n[0].errorCode, message: n[0].errorInfo });return new xo({ group: new au(n[0]) });}).catch(function (t) {return Y.error("GroupController.searchGroupByID error:".concat(t, ", groupID:").concat(e)), Ko(t);});} }, { key: "applyJoinGroup", value: function value(e) {var t = this,n = new Qo();return n.setMethod(gi).setStart(), this.request({ name: "group", action: "applyJoinGroup", param: e }).then(function (r) {var o = r.data,i = o.joinedStatus,s = o.longPollingKey;switch (n.setCode(0).setNetworkType(t.getNetworkType()).setText("groupID=".concat(e.groupID, " joinedStatus=").concat(i)).setEnd(), Y.log("GroupController.joinGroup ok. groupID:", e.groupID), i) {case we.WAIT_APPROVAL:return new xo({ status: we.WAIT_APPROVAL });case we.SUCCESS:return t.getGroupProfile({ groupID: e.groupID }).then(function (n) {var r = n.data.group,o = { status: we.SUCCESS, group: r };return ee(s) ? new xo(o) : (t.emitInnerEvent(wo, e.groupID), t.AVChatRoomHandler.startRunLoop({ longPollingKey: s, group: r }));});default:var a = new at({ code: Bt, message: Zn });return Y.error("GroupController.joinGroup error:".concat(a, ". groupID:").concat(e.groupID)), Ko(a);}}).catch(function (r) {return n.setText("groupID=".concat(e.groupID)), t.probeNetwork().then(function (e) {var t = y(e, 2),o = t[0],i = t[1];n.setError(r, o, i).setEnd();}), Y.error("GroupController.joinGroup error:".concat(r, ". groupID:").concat(e.groupID)), Ko(r);});} }, { key: "applyJoinAVChatRoom", value: function value(e) {return this.AVChatRoomHandler.applyJoinAVChatRoom(e);} }, { key: "handleGroupApplication", value: function value(e) {var t = this,n = e.message.payload,r = n.groupProfile.groupID,o = n.authentication,i = n.messageKey,s = n.operatorID;return Y.log("GroupController.handleApplication. groupID:", r), this.request({ name: "group", action: "handleApplyJoinGroup", param: u({}, e, { applicant: s, groupID: r, authentication: o, messageKey: i }) }).then(function () {return Y.log("GroupController.handleApplication ok. groupID:", r), t.deleteGroupSystemNotice({ messageList: [e.message] }), new xo({ group: t.getLocalGroupProfile(r) });}).catch(function (e) {return Y.error("GroupController.handleApplication error.  error:".concat(e, ". groupID:").concat(r)), Ko(e);});} }, { key: "deleteGroupSystemNotice", value: function value(e) {var n = this;return Z(e.messageList) && 0 !== e.messageList.length ? (Y.log("GroupController.deleteGroupSystemNotice " + e.messageList.map(function (e) {return e.ID;})), this.request({ name: "group", action: "deleteGroupSystemNotice", param: { messageListToDelete: e.messageList.map(function (e) {return { from: t.CONV_SYSTEM, messageSeq: e.clientSequence, messageRandom: e.random };}) } }).then(function () {return Y.log("GroupController.deleteGroupSystemNotice ok"), e.messageList.forEach(function (e) {n.tim.messageController.deleteLocalMessage(e);}), new xo();}).catch(function (e) {return Y.error("GroupController.deleteGroupSystemNotice error:", e), Ko(e);})) : Bo();} }, { key: "getGroupProfileAdvance", value: function value(e) {return Z(e.groupIDList) && e.groupIDList.length > 50 && (Y.warn("GroupController.getGroupProfileAdvance 获取群资料的数量不能超过50个"), e.groupIDList.length = 50), Y.log("GroupController.getGroupProfileAdvance. groupIDList:", e.groupIDList), this.request({ name: "group", action: "query", param: e }).then(function (e) {Y.log("GroupController.getGroupProfileAdvance ok.");var t = e.data.groups,n = t.filter(function (e) {return ee(e.errorCode) || e.errorCode === Ae.SUCCESS;}),r = t.filter(function (e) {return e.errorCode && e.errorCode !== Ae.SUCCESS;}).map(function (e) {return new at({ code: Number("500".concat(e.errorCode)), message: e.errorInfo, data: { groupID: e.groupID } });});return new xo({ successGroupList: n, failureGroupList: r });}).catch(function (t) {return Y.error("GroupController.getGroupProfileAdvance error:".concat(t, ". groupID:").concat(e.groupID)), Ko(t);});} }, { key: "_deleteLocalGroup", value: function value(e) {return this.groupMap.delete(e), this.groupMemberListMap.delete(e), this._setStorageGroupList(), this.groupMap.has(e) && this.groupMemberListMap.has(e);} }, { key: "_initGroupList", value: function value() {var e = this,t = new Qo();t.setMethod(Ci).setStart(), Y.time(Xo), Y.log("GroupController._initGroupList");var n = this._getStorageGroupList();Z(n) && n.length > 0 ? (n.forEach(function (t) {e.groupMap.set(t.groupID, new au(t));}), this.emitGroupListUpdate(!0, !1), t.setCode(0).setNetworkType(this.getNetworkType()).setText(this.groupMap.size).setEnd()) : t.setCode(0).setNetworkType(this.getNetworkType()).setText(0).setEnd(), this.triggerReady(), Y.log("GroupController._initGroupList ok. initCost=".concat(Y.timeEnd(Xo), "ms")), this.getGroupList();} }, { key: "_initListeners", value: function value() {var e = this.tim.innerEmitter;e.once(Br, this._initGroupList, this), e.on(Do, this._handleUpdateGroupLastMessage, this), e.on(Xr, this._handleReceivedGroupMessage, this), e.on(ko, this._handleProfileUpdated, this);} }, { key: "emitGroupListUpdate", value: function value() {var t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0],n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],r = this.getLocalGroups();n && this.emitInnerEvent(vo, r), t && this.emitOuterEvent(e.GROUP_LIST_UPDATED, r);} }, { key: "_handleReceivedGroupMessage", value: function value(e) {var n = this,r = e.data.eventDataList;Array.isArray(r) && r.forEach(function (e) {var r = e.conversationID.replace(t.CONV_GROUP, "");n.groupMap.has(r) && (n.groupMap.get(r).nextMessageSeq = e.lastMessage.sequence + 1);});} }, { key: "_onReceivedGroupSystemNotice", value: function value(e) {var t = e.data;this.groupNoticeHandler._onReceivedGroupNotice(t);} }, { key: "_handleUpdateGroupLastMessage", value: function value(e) {var n = e.data;if (0 !== this.groupMap.size) {for (var r = !1, o = 0; o < n.length; o++) {var i = n[o],s = i.type === t.CONV_GROUP;if (i.conversationID && s) {var a = i.conversationID.split(/^GROUP/)[1],u = this.getLocalGroupProfile(a);u && (u.lastMessage = i.lastMessage, r = !0);}}r && (this.groupMap = this._sortLocalGroupList(this.groupMap), this.emitGroupListUpdate(!0, !1));} else this.tempConversationList = n;} }, { key: "_sortLocalGroupList", value: function value(e) {var t = v(e).filter(function (e) {var t = y(e, 2);t[0];return !Te(t[1].lastMessage);});return t.sort(function (e, t) {return t[1].lastMessage.lastTime - e[1].lastMessage.lastTime;}), new Map([].concat(v(t), v(e)));} }, { key: "_getStorageGroupList", value: function value() {return this.tim.storage.getItem("groupMap");} }, { key: "_setStorageGroupList", value: function value() {var e = this.getLocalGroups().filter(function (e) {var t = e.type;return !Ie(t);}).slice(0, 20).map(function (e) {return { groupID: e.groupID, name: e.name, avatar: e.avatar, type: e.type };});this.tim.storage.setItem("groupMap", e);} }, { key: "updateGroupMap", value: function value(e) {var t = this;e.forEach(function (e) {t.groupMap.has(e.groupID) ? t.groupMap.get(e.groupID).updateGroup(e) : t.groupMap.set(e.groupID, new au(e));}), this._setStorageGroupList();} }, { key: "_updateLocalGroupMemberMap", value: function value(e, t) {var n = this;return Z(t) && 0 !== t.length ? t.map(function (t) {return n.hasLocalGroupMember(e, t.userID) ? n.getLocalGroupMemberInfo(e, t.userID).updateMember(t) : n.setLocalGroupMember(e, new vu(t)), n.getLocalGroupMemberInfo(e, t.userID);}) : [];} }, { key: "deleteLocalGroupMembers", value: function value(e, t) {var n = this.groupMemberListMap.get(e);n && t.forEach(function (e) {n.delete(e);});} }, { key: "_modifyGroupMemberInfo", value: function value(e) {var t = this,n = e.groupID,r = e.userID;return this.request({ name: "group", action: "modifyGroupMemberInfo", param: e }).then(function () {if (t.hasLocalGroupMember(n, r)) {var o = t.getLocalGroupMemberInfo(n, r);return ee(e.muteTime) || o.updateMuteUntil(e.muteTime), ee(e.role) || o.updateRole(e.role), ee(e.nameCard) || o.updateNameCard(e.nameCard), ee(e.memberCustomField) || o.updateMemberCustomField(e.memberCustomField), o;}return t.getGroupMemberProfile({ groupID: n, userIDList: [r] }).then(function (e) {return y(e.data.memberList, 1)[0];});});} }, { key: "_groupListTreeShaking", value: function value(e) {for (var t = new Map(v(this.groupMap)), n = 0, r = e.length; n < r; n++) {t.delete(e[n].groupID);}this.AVChatRoomHandler.hasJoinedAVChatRoom() && t.delete(this.AVChatRoomHandler.group.groupID);for (var o = v(t.keys()), i = 0, s = o.length; i < s; i++) {this.groupMap.delete(o[i]);}} }, { key: "_handleProfileUpdated", value: function value(e) {for (var t = this, n = e.data, r = function r(e) {var r = n[e];t.groupMemberListMap.forEach(function (e) {e.has(r.userID) && e.get(r.userID).updateMember({ nick: r.nick, avatar: r.avatar });});}, o = 0; o < n.length; o++) {r(o);}} }, { key: "getJoinedAVChatRoom", value: function value() {return this.AVChatRoomHandler.getJoinedAVChatRoom();} }, { key: "deleteLocalGroupAndConversation", value: function value(e) {this._deleteLocalGroup(e), this.tim.conversationController.deleteLocalConversation("GROUP".concat(e)), this.emitGroupListUpdate(!0, !1);} }, { key: "checkJoinedAVChatRoomByID", value: function value(e) {return this.AVChatRoomHandler.checkJoinedAVChatRoomByID(e);} }, { key: "getGroupLastSequence", value: function value(e) {var t = this,n = new Qo();n.setMethod(Ii).setStart();var r = 0;if (this.hasLocalGroup(e)) {var o = this.getLocalGroupProfile(e);if (o.lastMessage.lastSequence > 0) return r = o.lastMessage.lastSequence, Y.log("GroupController.getGroupLastSequence got lastSequence=".concat(r, " from local group profile[lastMessage.lastSequence]. groupID=").concat(e)), n.setCode(0).setNetworkType(this.getNetworkType()).setText("got lastSequence=".concat(r, " from local group profile[lastMessage.lastSequence]. groupID=").concat(e)).setEnd(), Promise.resolve(r);if (o.nextMessageSeq > 1) return r = o.nextMessageSeq - 1, Y.log("GroupController.getGroupLastSequence got lastSequence=".concat(r, " from local group profile[nextMessageSeq]. groupID=").concat(e)), n.setCode(0).setNetworkType(this.getNetworkType()).setText("got lastSequence=".concat(r, " from local group profile[nextMessageSeq]. groupID=").concat(e)).setEnd(), Promise.resolve(r);}var i = "GROUP".concat(e),s = this.tim.conversationController.getLocalConversation(i);if (s && s.lastMessage.lastSequence) return r = s.lastMessage.lastSequence, Y.log("GroupController.getGroupLastSequence got lastSequence=".concat(r, " from local conversation profile[lastMessage.lastSequence]. groupID=").concat(e)), n.setCode(0).setNetworkType(this.getNetworkType()).setText("got lastSequence=".concat(r, " from local conversation profile[lastMessage.lastSequence]. groupID=").concat(e)).setEnd(), Promise.resolve(r);var a = { groupIDList: [e], responseFilter: { groupBaseInfoFilter: ["NextMsgSeq"] } };return this.getGroupProfileAdvance(a).then(function (o) {var i = o.data.successGroupList;return r = i[0].nextMessageSeq - 1, Y.log("GroupController.getGroupLastSequence got lastSequence=".concat(r, " from getGroupProfileAdvance. groupID=").concat(e)), n.setCode(0).setNetworkType(t.getNetworkType()).setText("got lastSequence=".concat(r, " from getGroupProfileAdvance. groupID=").concat(e)).setEnd(), r;}).catch(function (r) {return t.probeNetwork().then(function (t) {var o = y(t, 2),i = o[0],s = o[1];n.setError(r, i, s).setText("get lastSequence failed from getGroupProfileAdvance. groupID=".concat(e)).setEnd();}), Y.warn("GroupController.getGroupLastSequence failed. ".concat(r)), Ko(r);});} }, { key: "reset", value: function value() {this.groupMap.clear(), this.groupMemberListMap.clear(), this.resetReady(), this.groupNoticeHandler.reset(), this.AVChatRoomHandler.reset(), this.tim.innerEmitter.once(Br, this._initGroupList, this);} }]), o;}(Go),Du = function (n) {function o(e) {var n;r(this, o), (n = m(this, l(o).call(this, e))).REALTIME_MESSAGE_TIMEOUT = 11e4, n.LONGPOLLING_ID_TIMEOUT = 3e5, n._currentState = t.NET_STATE_CONNECTED, n._status = { OPENIM: { lastResponseReceivedTime: 0, jitterCount: 0, failedCount: 0 }, AVCHATROOM: { lastResponseReceivedTime: 0, jitterCount: 0, failedCount: 0 } };var i = n.tim.innerEmitter;return i.on(Zr, n._onGetLongPollIDFailed, d(n)), i.on(to, n._onOpenIMResponseOK, d(n)), i.on(eo, n._onOpenIMRequestFailed, d(n)), i.on(yo, n._onAVChatroomResponseOK, d(n)), i.on(mo, n._onAVChatroomRequestFailed, d(n)), n;}return c(o, n), i(o, [{ key: "_onGetLongPollIDFailed", value: function value() {this._currentState !== t.NET_STATE_DISCONNECTED && this._emitNetStateChangeEvent(t.NET_STATE_DISCONNECTED);} }, { key: "_onOpenIMResponseOK", value: function value() {this._onResponseOK("OPENIM");} }, { key: "_onOpenIMRequestFailed", value: function value() {this._onRequestFailed("OPENIM");} }, { key: "_onAVChatroomResponseOK", value: function value() {this.isLoggedIn() || this._onResponseOK("AVCHATROOM");} }, { key: "_onAVChatroomRequestFailed", value: function value() {this.isLoggedIn() || this._onRequestFailed("AVCHATROOM");} }, { key: "_onResponseOK", value: function value(e) {var n = this._status[e],r = Date.now();if (0 !== n.lastResponseReceivedTime) {var o = r - n.lastResponseReceivedTime;if (Y.debug("StatusController._onResponseOK key=".concat(e, " currentState=").concat(this._currentState, " interval=").concat(o, " failedCount=").concat(n.failedCount, " jitterCount=").concat(n.jitterCount)), n.failedCount > 0 && (n.failedCount = 0, n.jitterCount += 1, this._currentState !== t.NET_STATE_CONNECTED && this._emitNetStateChangeEvent(t.NET_STATE_CONNECTED)), o <= this.REALTIME_MESSAGE_TIMEOUT) {if (n.jitterCount >= 3) {var i = new Qo();i.setMethod(wi).setStart(), i.setCode(0).setText("".concat(e, "-").concat(o, "-").concat(n.jitterCount)).setNetworkType(this.getNetworkType()).setEnd(), n.jitterCount = 0;}} else if (o >= this.REALTIME_MESSAGE_TIMEOUT && o < this.LONGPOLLING_ID_TIMEOUT) {var s = new Qo();s.setMethod(Ai).setStart(), s.setCode(0).setText("".concat(e, "-").concat(o)).setNetworkType(this.getNetworkType()).setEnd(), Y.warn("StatusController._onResponseOK, fast start. key=".concat(e, " interval=").concat(o, " ms")), this.emitInnerEvent(no);} else if (o >= this.LONGPOLLING_ID_TIMEOUT) {var a = new Qo();a.setMethod(Ri).setStart(), a.setCode(0).setText("".concat(e, "-").concat(o)).setNetworkType(this.getNetworkType()).setEnd(), Y.warn("StatusController._onResponseOK, slow start. key=".concat(e, " interval=").concat(o, " ms")), this.emitInnerEvent(ro);}n.lastResponseReceivedTime = r;} else n.lastResponseReceivedTime = r;} }, { key: "_onRequestFailed", value: function value(e) {var n = this,r = this._status[e];Date.now() - r.lastResponseReceivedTime >= this.LONGPOLLING_ID_TIMEOUT ? this._currentState !== t.NET_STATE_DISCONNECTED && (Y.warn("StatusController._onRequestFailed, disconnected, longpolling unavailable more than 5min. key=".concat(e, " networkType=").concat(this.getNetworkType())), this._emitNetStateChangeEvent(t.NET_STATE_DISCONNECTED)) : (r.failedCount += 1, r.failedCount > 5 ? this.probeNetwork().then(function (o) {var i = y(o, 2),s = i[0],a = i[1];s ? (n._currentState !== t.NET_STATE_CONNECTING && n._emitNetStateChangeEvent(t.NET_STATE_CONNECTING), Y.warn("StatusController._onRequestFailed, connecting, network jitter. key=".concat(e, " networkType=").concat(a))) : (n._currentState !== t.NET_STATE_DISCONNECTED && n._emitNetStateChangeEvent(t.NET_STATE_DISCONNECTED), Y.warn("StatusController._onRequestFailed, disconnected, longpolling unavailable. key=".concat(e, " networkType=").concat(a))), r.failedCount = 0, r.jitterCount = 0;}) : this._currentState === t.NET_STATE_CONNECTED && this._emitNetStateChangeEvent(t.NET_STATE_CONNECTING));} }, { key: "_emitNetStateChangeEvent", value: function value(t) {Y.log("StatusController._emitNetStateChangeEvent net state changed from ".concat(this._currentState, " to ").concat(t)), this._currentState = t, this.emitOuterEvent(e.NET_STATE_CHANGE, { state: t });} }, { key: "reset", value: function value() {Y.log("StatusController.reset"), this._currentState = t.NET_STATE_CONNECTED, this._status = { OPENIM: { lastResponseReceivedTime: 0, jitterCount: 0, failedCount: 0 }, AVCHATROOM: { lastResponseReceivedTime: 0, jitterCount: 0, failedCount: 0 } };} }]), o;}(Go);function Tu() {return null;}var Eu = function () {function e(t) {r(this, e), this.tim = t, this.isWX = k, this.storageQueue = new Map(), this.checkTimes = 0, this.checkTimer = setInterval(this._onCheckTimer.bind(this), 1e3), this._errorTolerantHandle();}return i(e, [{ key: "_errorTolerantHandle", value: function value() {!this.isWX && ee(window.localStorage) && (this.getItem = Tu, this.setItem = Tu, this.removeItem = Tu, this.clear = Tu);} }, { key: "_onCheckTimer", value: function value() {if (this.checkTimes++, this.checkTimes % 20 == 0) {if (0 === this.storageQueue.size) return;this._doFlush();}} }, { key: "_doFlush", value: function value() {try {var e = !0,t = !1,n = void 0;try {for (var r, o = this.storageQueue[Symbol.iterator](); !(e = (r = o.next()).done); e = !0) {var i = y(r.value, 2),s = i[0],a = i[1];this.isWX ? wx.setStorageSync(this._getKey(s), a) : localStorage.setItem(this._getKey(s), JSON.stringify(a));}} catch (u) {t = !0, n = u;} finally {try {e || null == o.return || o.return();} finally {if (t) throw n;}}this.storageQueue.clear();} catch (c) {Y.warn("Storage._doFlush error", c);}} }, { key: "_getPrefix", value: function value() {var e = this.tim.loginInfo,t = e.SDKAppID,n = e.identifier;return "TIM_".concat(t, "_").concat(n, "_");} }, { key: "getItem", value: function value(e) {var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];try {var n = t ? this._getKey(e) : e;return this.isWX ? wx.getStorageSync(n) : JSON.parse(localStorage.getItem(n));} catch (r) {Y.warn("Storage.getItem error:", r);}} }, { key: "setItem", value: function value(e, t) {var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],r = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3];if (n) {var o = r ? this._getKey(e) : e;this.isWX ? wx.setStorageSync(o, t) : localStorage.setItem(o, JSON.stringify(t));} else this.storageQueue.set(e, t);} }, { key: "clear", value: function value() {try {this.isWX ? wx.clearStorageSync() : localStorage.clear();} catch (e) {Y.warn("Storage.clear error:", e);}} }, { key: "removeItem", value: function value(e) {var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];try {var n = t ? this._getKey(e) : e;this.isWX ? wx.removeStorageSync(n) : localStorage.removeItem(n);} catch (r) {Y.warn("Storage.removeItem error:", r);}} }, { key: "getSize", value: function value(e) {var t = this,n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "b";try {var r = { size: 0, limitSize: 5242880, unit: n };if (Object.defineProperty(r, "leftSize", { enumerable: !0, get: function get() {return r.limitSize - r.size;} }), this.isWX && (r.limitSize = 1024 * wx.getStorageInfoSync().limitSize), e) r.size = JSON.stringify(this.getItem(e)).length + this._getKey(e).length;else if (this.isWX) {var o = wx.getStorageInfoSync(),i = o.keys;i.forEach(function (e) {r.size += JSON.stringify(wx.getStorageSync(e)).length + t._getKey(e).length;});} else for (var s in localStorage) {localStorage.hasOwnProperty(s) && (r.size += localStorage.getItem(s).length + s.length);}return this._convertUnit(r);} catch (a) {Y.warn("Storage.getSize error:", a);}} }, { key: "_convertUnit", value: function value(e) {var t = {},n = e.unit;for (var r in t.unit = n, e) {"number" == typeof e[r] && ("kb" === n.toLowerCase() ? t[r] = Math.round(e[r] / 1024) : "mb" === n.toLowerCase() ? t[r] = Math.round(e[r] / 1024 / 1024) : t[r] = e[r]);}return t;} }, { key: "_getKey", value: function value(e) {return "".concat(this._getPrefix()).concat(e);} }, { key: "reset", value: function value() {this._doFlush(), this.checkTimes = 0;} }]), e;}(),ku = I(function (e) {var t = Object.prototype.hasOwnProperty,n = "~";function r() {}function o(e, t, n) {this.fn = e, this.context = t, this.once = n || !1;}function i(e, t, r, i, s) {if ("function" != typeof r) throw new TypeError("The listener must be a function");var a = new o(r, i || e, s),u = n ? n + t : t;return e._events[u] ? e._events[u].fn ? e._events[u] = [e._events[u], a] : e._events[u].push(a) : (e._events[u] = a, e._eventsCount++), e;}function s(e, t) {0 == --e._eventsCount ? e._events = new r() : delete e._events[t];}function a() {this._events = new r(), this._eventsCount = 0;}Object.create && (r.prototype = Object.create(null), new r().__proto__ || (n = !1)), a.prototype.eventNames = function () {var e,r,o = [];if (0 === this._eventsCount) return o;for (r in e = this._events) {t.call(e, r) && o.push(n ? r.slice(1) : r);}return Object.getOwnPropertySymbols ? o.concat(Object.getOwnPropertySymbols(e)) : o;}, a.prototype.listeners = function (e) {var t = n ? n + e : e,r = this._events[t];if (!r) return [];if (r.fn) return [r.fn];for (var o = 0, i = r.length, s = new Array(i); o < i; o++) {s[o] = r[o].fn;}return s;}, a.prototype.listenerCount = function (e) {var t = n ? n + e : e,r = this._events[t];return r ? r.fn ? 1 : r.length : 0;}, a.prototype.emit = function (e, t, r, o, i, s) {var a = n ? n + e : e;if (!this._events[a]) return !1;var u,c,l = this._events[a],p = arguments.length;if (l.fn) {switch (l.once && this.removeListener(e, l.fn, void 0, !0), p) {case 1:return l.fn.call(l.context), !0;case 2:return l.fn.call(l.context, t), !0;case 3:return l.fn.call(l.context, t, r), !0;case 4:return l.fn.call(l.context, t, r, o), !0;case 5:return l.fn.call(l.context, t, r, o, i), !0;case 6:return l.fn.call(l.context, t, r, o, i, s), !0;}for (c = 1, u = new Array(p - 1); c < p; c++) {u[c - 1] = arguments[c];}l.fn.apply(l.context, u);} else {var h,f = l.length;for (c = 0; c < f; c++) {switch (l[c].once && this.removeListener(e, l[c].fn, void 0, !0), p) {case 1:l[c].fn.call(l[c].context);break;case 2:l[c].fn.call(l[c].context, t);break;case 3:l[c].fn.call(l[c].context, t, r);break;case 4:l[c].fn.call(l[c].context, t, r, o);break;default:if (!u) for (h = 1, u = new Array(p - 1); h < p; h++) {u[h - 1] = arguments[h];}l[c].fn.apply(l[c].context, u);}}}return !0;}, a.prototype.on = function (e, t, n) {return i(this, e, t, n, !1);}, a.prototype.once = function (e, t, n) {return i(this, e, t, n, !0);}, a.prototype.removeListener = function (e, t, r, o) {var i = n ? n + e : e;if (!this._events[i]) return this;if (!t) return s(this, i), this;var a = this._events[i];if (a.fn) a.fn !== t || o && !a.once || r && a.context !== r || s(this, i);else {for (var u = 0, c = [], l = a.length; u < l; u++) {(a[u].fn !== t || o && !a[u].once || r && a[u].context !== r) && c.push(a[u]);}c.length ? this._events[i] = 1 === c.length ? c[0] : c : s(this, i);}return this;}, a.prototype.removeAllListeners = function (e) {var t;return e ? (t = n ? n + e : e, this._events[t] && s(this, t)) : (this._events = new r(), this._eventsCount = 0), this;}, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = n, a.EventEmitter = a, e.exports = a;}),wu = function wu(e) {var t, n, r, o, i;return Te(e.context) ? (t = "", n = 0, r = 0, o = 0, i = 1) : (t = e.context.a2Key, n = e.context.tinyID, r = e.context.SDKAppID, o = e.context.contentType, i = e.context.apn), { platform: Pr, websdkappid: br, v: Nr, a2: t, tinyid: n, sdkappid: r, contentType: o, apn: i, reqtime: function reqtime() {return +new Date();} };},Au = function () {function e(t) {r(this, e), this.tim = t, this.tim.innerEmitter.on(Fr, this._update, this), this.tim.innerEmitter.on(Hr, this._update, this), this.tim.innerEmitter.on(Kr, this._updateSpecifiedConfig, this), this._initConfig();}return i(e, [{ key: "_update", value: function value(e) {this._initConfig();} }, { key: "_updateSpecifiedConfig", value: function value(e) {var t = this;e.data.forEach(function (e) {t._set(e);});} }, { key: "get", value: function value(e) {var t = e.name,r = e.action,o = e.param,i = e.tjgID;if (ee(this.config[t]) || ee(this.config[t][r])) throw new at({ code: un, message: "".concat(mr, ": PackageConfig.").concat(t) });var s = function e(t) {if (0 === Object.getOwnPropertyNames(t).length) return Object.create(null);var r = Array.isArray(t) ? [] : Object.create(null),o = "";for (var i in t) {null !== t[i] ? void 0 !== t[i] ? (o = n(t[i]), ["string", "number", "function", "boolean"].indexOf(o) >= 0 ? r[i] = t[i] : r[i] = e(t[i])) : r[i] = void 0 : r[i] = null;}return r;}(this.config[t][r]);return s.requestData = this._initRequestData(o, s), s.encode = this._initEncoder(s), s.decode = this._initDecoder(s), i && (s.queryString.tjg_id = i), s;} }, { key: "_set", value: function value(e) {var t = e.key,r = e.value;if (!1 != !!t) {var o = t.split(".");if (!(o.length <= 0)) {!function e(t, r, o, i) {var s = r[o];"object" === n(t[s]) ? e(t[s], r, o + 1, i) : t[s] = i;}(this.config, o, 0, r);}}} }, { key: "_initConfig", value: function value() {var e;this.config = {}, this.config.accessLayer = (e = this.tim, { create: null, query: { serverName: Ur.NAME.WEB_IM, cmd: Ur.CMD.ACCESS_LAYER, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: { platform: Pr, identifier: e.context.identifier, usersig: e.context.userSig, contentType: e.context.contentType, apn: null !== e.context ? e.context.apn : 1, websdkappid: br, v: Nr }, requestData: {} }, update: null, delete: null }), this.config.login = function (e) {return { create: null, query: { serverName: Ur.NAME.OPEN_IM, cmd: Ur.CMD.LOGIN, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: { websdkappid: br, v: Nr, platform: Pr, identifier: e.loginInfo.identifier, usersig: e.loginInfo.userSig, sdkappid: e.loginInfo.SDKAppID, accounttype: e.loginInfo.accountType, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: +new Date() / 1e3 }, requestData: { state: "Online" }, keyMaps: { request: { tinyID: "tinyId" }, response: { TinyId: "tinyID" } } }, update: null, delete: null };}(this.tim), this.config.logout = function (e) {return { create: null, query: { serverName: Ur.NAME.OPEN_IM, cmd: Ur.CMD.LOGOUT_ALL, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: { websdkappid: br, v: Nr, platform: Pr, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : "", sdkappid: null !== e.loginInfo ? e.loginInfo.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : "", reqtime: +new Date() / 1e3 }, requestData: {} }, update: null, delete: null };}(this.tim), this.config.longPollLogout = function (e) {return { create: null, query: { serverName: Ur.NAME.OPEN_IM, cmd: Ur.CMD.LOGOUT_LONG_POLL, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: { websdkappid: br, v: Nr, platform: Pr, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return Date.now();} }, requestData: { longPollID: "" }, keyMaps: { request: { longPollID: "LongPollingId" } } }, update: null, delete: null };}(this.tim), this.config.profile = function (e) {var t = wu(e),n = Ur.NAME.PROFILE,r = Ur.CHANNEL.XHR,o = qr;return { query: { serverName: n, cmd: Ur.CMD.PORTRAIT_GET, channel: r, protocol: o, method: "POST", queryString: t, requestData: { fromAccount: "", userItem: [] }, keyMaps: { request: { toAccount: "To_Account", standardSequence: "StandardSequence", customSequence: "CustomSequence" } } }, update: { serverName: n, cmd: Ur.CMD.PORTRAIT_SET, channel: r, protocol: o, method: "POST", queryString: t, requestData: { fromAccount: "", profileItem: [{ tag: We.NICK, value: "" }, { tag: We.GENDER, value: "" }, { tag: We.ALLOWTYPE, value: "" }, { tag: We.AVATAR, value: "" }] } } };}(this.tim), this.config.group = function (e) {var n = { websdkappid: br, v: Nr, platform: Pr, a2: null !== e.context && e.context.a2Key ? e.context.a2Key : void 0, tinyid: null !== e.context && e.context.tinyID ? e.context.tinyID : void 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, accounttype: null !== e.context ? e.context.accountType : 0 },r = { request: { ownerID: "Owner_Account", userID: "Member_Account", newOwnerID: "NewOwner_Account", maxMemberNum: "MaxMemberCount", groupCustomField: "AppDefinedData", memberCustomField: "AppMemberDefinedData", groupCustomFieldFilter: "AppDefinedDataFilter_Group", memberCustomFieldFilter: "AppDefinedDataFilter_GroupMember", messageRemindType: "MsgFlag", userIDList: "MemberList", groupIDList: "GroupIdList", applyMessage: "ApplyMsg", muteTime: "ShutUpTime", joinOption: "ApplyJoinOption" }, response: { GroupIdList: "groups", MsgFlag: "messageRemindType", AppDefinedData: "groupCustomField", AppMemberDefinedData: "memberCustomField", AppDefinedDataFilter_Group: "groupCustomFieldFilter", AppDefinedDataFilter_GroupMember: "memberCustomFieldFilter", InfoSeq: "infoSequence", MemberList: "members", GroupInfo: "groups", ShutUpUntil: "muteUntil", ApplyJoinOption: "joinOption" } };return { create: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.CREATE_GROUP, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { type: t.GRP_PRIVATE, name: void 0, groupID: void 0, ownerID: e.loginInfo.identifier, introduction: void 0, notification: void 0, avatar: void 0, maxMemberNum: void 0, joinOption: void 0, memberList: void 0, groupCustomField: void 0 }, keyMaps: r }, list: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.GET_JOINED_GROUPS, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { userID: e.loginInfo.identifier, limit: void 0, offset: void 0, groupType: void 0, responseFilter: void 0 }, keyMaps: r }, query: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.GET_GROUP_INFO, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { groupIDList: void 0, responseFilter: void 0 }, keyMaps: r }, getGroupMemberProfile: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.GET_GROUP_MEMBER_INFO, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { groupID: void 0, userIDList: void 0, memberInfoFilter: void 0, memberCustomFieldFilter: void 0 }, keyMaps: { request: u({}, r.request, { userIDList: "Member_List_Account" }), response: r.response } }, getGroupMemberList: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.GET_GROUP_MEMBER_LIST, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { groupID: void 0, limit: 0, offset: 0, memberRoleFilter: void 0, memberInfoFilter: void 0 }, keyMaps: r }, quitGroup: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.QUIT_GROUP, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { groupID: void 0 } }, changeGroupOwner: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.CHANGE_GROUP_OWNER, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { groupID: void 0, newOwnerID: void 0 }, keyMaps: r }, destroyGroup: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.DESTROY_GROUP, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { groupID: void 0 } }, updateGroupProfile: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.MODIFY_GROUP_INFO, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { groupID: void 0, name: void 0, introduction: void 0, notification: void 0, avatar: void 0, maxMemberNum: void 0, joinOption: void 0, groupCustomField: void 0 }, keyMaps: { request: u({}, r.request, { groupCustomField: "AppDefinedData" }), response: r.response } }, modifyGroupMemberInfo: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.MODIFY_GROUP_MEMBER_INFO, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { groupID: void 0, userID: void 0, messageRemindType: void 0, nameCard: void 0, role: void 0, memberCustomField: void 0, muteTime: void 0 }, keyMaps: r }, addGroupMember: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.ADD_GROUP_MEMBER, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { groupID: void 0, silence: void 0, userIDList: void 0 }, keyMaps: r }, deleteGroupMember: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.DELETE_GROUP_MEMBER, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { groupID: void 0, userIDList: void 0, reason: void 0 }, keyMaps: { request: { userIDList: "MemberToDel_Account" } } }, searchGroupByID: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.SEARCH_GROUP_BY_ID, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { groupIDList: void 0, responseFilter: { groupBasePublicInfoFilter: ["Type", "Name", "Introduction", "Notification", "FaceUrl", "CreateTime", "Owner_Account", "LastInfoTime", "LastMsgTime", "NextMsgSeq", "MemberNum", "MaxMemberNum", "ApplyJoinOption"] } }, keyMaps: { request: { groupIDList: "GroupIdList" } } }, applyJoinGroup: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.APPLY_JOIN_GROUP, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { groupID: void 0, applyMessage: void 0, userDefinedField: void 0 }, keyMaps: r }, applyJoinAVChatRoom: { serverName: Ur.NAME.BIG_GROUP_NO_AUTH, cmd: Ur.CMD.APPLY_JOIN_GROUP, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: { websdkappid: br, v: Nr, platform: Pr, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, accounttype: null !== e.context ? e.context.accountType : 0 }, requestData: { groupID: void 0, applyMessage: void 0, userDefinedField: void 0 }, keyMaps: r }, handleApplyJoinGroup: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.HANDLE_APPLY_JOIN_GROUP, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { groupID: void 0, applicant: void 0, handleAction: void 0, handleMessage: void 0, authentication: void 0, messageKey: void 0, userDefinedField: void 0 }, keyMaps: { request: { applicant: "Applicant_Account", handleAction: "HandleMsg", handleMessage: "ApprovalMsg", messageKey: "MsgKey" }, response: { MsgKey: "messageKey" } } }, deleteGroupSystemNotice: { serverName: Ur.NAME.OPEN_IM, cmd: Ur.CMD.DELETE_GROUP_SYSTEM_MESSAGE, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { messageListToDelete: void 0 }, keyMaps: { request: { messageListToDelete: "DelMsgList", messageSeq: "MsgSeq", messageRandom: "MsgRandom" } } }, getGroupPendency: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.GET_GROUP_PENDENCY, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: n, requestData: { startTime: void 0, limit: void 0, handleAccount: void 0 }, keyMaps: { request: { handleAccount: "Handle_Account" } } } };}(this.tim), this.config.longPollID = function (e) {return { create: {}, query: { serverName: Ur.NAME.OPEN_IM, cmd: Ur.CMD.GET_LONG_POLL_ID, channel: Ur.CHANNEL.XHR, protocol: qr, queryString: { websdkappid: br, v: Nr, platform: Pr, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: +new Date() / 1e3 }, requestData: {}, keyMaps: { response: { LongPollingId: "longPollingID" } } }, update: {}, delete: {} };}(this.tim), this.config.longPoll = function (e) {var t = { websdkappid: br, v: Nr, platform: Pr, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, accounttype: null !== e.context ? e.loginInfo.accountType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: Math.ceil(+new Date() / 1e3) };return { create: {}, query: { serverName: Ur.NAME.OPEN_IM, cmd: Ur.CMD.LONG_POLL, channel: Ur.CHANNEL.AUTO, protocol: qr, queryString: t, requestData: { timeout: null, cookie: { notifySeq: 0, noticeSeq: 0, longPollingID: 0 } }, keyMaps: { response: { C2cMsgArray: "C2CMessageArray", GroupMsgArray: "groupMessageArray", GroupTips: "groupTips", C2cNotifyMsgArray: "C2CNotifyMessageArray", ClientSeq: "clientSequence", MsgPriority: "priority", NoticeSeq: "noticeSequence", MsgContent: "content", MsgType: "type", MsgBody: "elements", ToGroupId: "to", Desc: "description", Ext: "extension" } } }, update: {}, delete: {} };}(this.tim), this.config.applyC2C = function (e) {var t = wu(e),n = Ur.NAME.FRIEND,r = Ur.CHANNEL.XHR,o = qr;return { create: { serverName: n, cmd: Ur.CMD.FRIEND_ADD, channel: r, protocol: o, queryString: t, requestData: { fromAccount: "", addFriendItem: [] } }, get: { serverName: n, cmd: Ur.CMD.GET_PENDENCY, channel: r, protocol: o, queryString: t, requestData: { fromAccount: "", pendencyType: "Pendency_Type_ComeIn" } }, update: { serverName: n, cmd: Ur.CMD.RESPONSE_PENDENCY, channel: r, protocol: o, queryString: t, requestData: { fromAccount: "", responseFriendItem: [] } }, delete: { serverName: n, cmd: Ur.CMD.DELETE_PENDENCY, channel: r, protocol: o, queryString: t, requestData: { fromAccount: "", toAccount: [], pendencyType: "Pendency_Type_ComeIn" } } };}(this.tim), this.config.friend = function (e) {var t = wu(e),n = Ur.NAME.FRIEND,r = Ur.CHANNEL.XHR,o = qr;return { get: { serverName: n, cmd: Ur.CMD.FRIEND_GET_ALL, channel: r, protocol: o, method: "POST", queryString: t, requestData: { fromAccount: "", timeStamp: 0, startIndex: 0, getCount: 100, lastStandardSequence: 0, tagList: ["Tag_Profile_IM_Nick", "Tag_SNS_IM_Remark"] }, keyMaps: { request: {}, response: {} } }, delete: { serverName: n, cmd: Ur.CMD.FRIEND_DELETE, channel: r, protocol: o, method: "POST", queryString: t, requestData: { fromAccount: "", toAccount: [], deleteType: "Delete_Type_Single" } } };}(this.tim), this.config.blacklist = function (e) {var t = wu(e);return { create: { serverName: Ur.NAME.FRIEND, cmd: Ur.CMD.ADD_BLACKLIST, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { fromAccount: "", toAccount: [] } }, get: { serverName: Ur.NAME.FRIEND, cmd: Ur.CMD.GET_BLACKLIST, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { fromAccount: "", startIndex: 0, maxLimited: 30, lastSequence: 0 } }, delete: { serverName: Ur.NAME.FRIEND, cmd: Ur.CMD.DELETE_BLACKLIST, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { fromAccount: "", toAccount: [] } }, update: {} };}(this.tim), this.config.c2cMessage = function (e) {var t = { platform: Pr, websdkappid: br, v: Nr, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return +new Date();} },n = { request: { fromAccount: "From_Account", toAccount: "To_Account", msgTimeStamp: "MsgTimeStamp", msgSeq: "MsgSeq", msgRandom: "MsgRandom", msgBody: "MsgBody", count: "MaxCnt", lastMessageTime: "LastMsgTime", messageKey: "MsgKey", peerAccount: "Peer_Account", data: "Data", description: "Desc", extension: "Ext", type: "MsgType", content: "MsgContent", sizeType: "Type", uuid: "UUID", imageUrl: "URL", fileUrl: "Url", remoteAudioUrl: "Url", remoteVideoUrl: "VideoUrl", thumbUUID: "ThumbUUID", videoUUID: "VideoUUID", videoUrl: "", downloadFlag: "Download_Flag" }, response: { MsgContent: "content", MsgTime: "time", Data: "data", Desc: "description", Ext: "extension", MsgKey: "messageKey", MsgType: "type", MsgBody: "elements", Download_Flag: "downloadFlag" } };return { create: { serverName: Ur.NAME.OPEN_IM, cmd: Ur.CMD.SEND_MESSAGE, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { fromAccount: e.loginInfo.identifier, toAccount: "", msgTimeStamp: Math.ceil(+new Date() / 1e3), msgSeq: 0, msgRandom: 0, msgBody: [] }, keyMaps: n }, query: { serverName: Ur.NAME.OPEN_IM, cmd: Ur.CMD.GET_C2C_ROAM_MESSAGES, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { peerAccount: "", count: 15, lastMessageTime: 0, messageKey: "", withRecalledMsg: 1 }, keyMaps: n }, update: null, delete: null };}(this.tim), this.config.c2cMessageWillBeRevoked = function (e) {var t = { platform: Pr, websdkappid: br, v: Nr, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return +new Date();} };return { create: { serverName: Ur.NAME.OPEN_IM, cmd: Ur.CMD.REVOKE_C2C_MESSAGE, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { msgInfo: { fromAccount: "", toAccount: "", msgTimeStamp: Math.ceil(+new Date() / 1e3), msgSeq: 0, msgRandom: 0 } }, keyMaps: { request: { msgInfo: "MsgInfo", fromAccount: "From_Account", toAccount: "To_Account", msgTimeStamp: "MsgTimeStamp", msgSeq: "MsgSeq", msgRandom: "MsgRandom", msgBody: "MsgBody" } } } };}(this.tim), this.config.groupMessage = function (e) {var t = { platform: Pr, websdkappid: br, v: Nr, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return +new Date();} },n = { request: { to: "GroupId", extension: "Ext", data: "Data", description: "Desc", random: "Random", sequence: "ReqMsgSeq", count: "ReqMsgNumber", type: "MsgType", priority: "MsgPriority", content: "MsgContent", elements: "MsgBody", sizeType: "Type", uuid: "UUID", imageUrl: "URL", fileUrl: "Url", remoteAudioUrl: "Url", remoteVideoUrl: "VideoUrl", thumbUUID: "ThumbUUID", videoUUID: "VideoUUID", videoUrl: "", downloadFlag: "Download_Flag", clientSequence: "ClientSeq" }, response: { Random: "random", MsgTime: "time", MsgSeq: "sequence", ReqMsgSeq: "sequence", RspMsgList: "messageList", IsPlaceMsg: "isPlaceMessage", IsSystemMsg: "isSystemMessage", ToGroupId: "to", EnumFrom_AccountType: "fromAccountType", EnumTo_AccountType: "toAccountType", GroupCode: "groupCode", MsgPriority: "priority", MsgBody: "elements", MsgType: "type", MsgContent: "content", IsFinished: "complete", Download_Flag: "downloadFlag", ClientSeq: "clientSequence" } };return { create: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.SEND_GROUP_MESSAGE, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { groupID: "", fromAccount: e.loginInfo.identifier, random: 0, clientSequence: 0, priority: "", msgBody: [] }, keyMaps: n }, query: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.GET_GROUP_ROAM_MESSAGES, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { withRecalledMsg: 1, groupID: "", count: 15, sequence: "" }, keyMaps: n }, update: null, delete: null };}(this.tim), this.config.groupMessageWillBeRevoked = function (e) {var t = { platform: Pr, websdkappid: br, v: Nr, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return +new Date();} };return { create: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.REVOKE_GROUP_MESSAGE, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { to: "", msgSeqList: [] }, keyMaps: { request: { to: "GroupId", msgSeqList: "MsgSeqList", msgSeq: "MsgSeq" } } } };}(this.tim), this.config.conversation = function (e) {var t = { platform: Pr, websdkappid: br, v: Nr, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1 };return { query: { serverName: Ur.NAME.RECENT_CONTACT, cmd: Ur.CMD.GET_CONVERSATION_LIST, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { fromAccount: e.loginInfo.identifier, count: 0 }, keyMaps: { request: {}, response: { SessionItem: "conversations", ToAccount: "groupID", To_Account: "userID", UnreadMsgCount: "unreadCount", MsgGroupReadedSeq: "messageReadSeq" } } }, pagingQuery: { serverName: Ur.NAME.RECENT_CONTACT, cmd: Ur.CMD.PAGING_GET_CONVERSATION_LIST, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { fromAccount: void 0, timeStamp: void 0, orderType: void 0 }, keyMaps: { request: {}, response: { SessionItem: "conversations", ToAccount: "groupID", To_Account: "userID", UnreadMsgCount: "unreadCount", MsgGroupReadedSeq: "messageReadSeq" } } }, delete: { serverName: Ur.NAME.RECENT_CONTACT, cmd: Ur.CMD.DELETE_CONVERSATION, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { fromAccount: e.loginInfo.identifier, toAccount: void 0, type: 1, toGroupID: void 0 }, keyMaps: { request: { toGroupID: "ToGroupid" } } }, setC2CMessageRead: { serverName: Ur.NAME.OPEN_IM, cmd: Ur.CMD.SET_C2C_MESSAGE_READ, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { C2CMsgReaded: void 0 }, keyMaps: { request: { lastMessageTime: "LastedMsgTime" } } }, setGroupMessageRead: { serverName: Ur.NAME.GROUP, cmd: Ur.CMD.SET_GROUP_MESSAGE_READ, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { groupID: void 0, messageReadSeq: void 0 }, keyMaps: { request: { messageReadSeq: "MsgReadedSeq" } } } };}(this.tim), this.config.syncMessage = function (e) {var t = { platform: Pr, websdkappid: br, v: Nr, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return [Math.ceil(+new Date()), Math.random()].join("");} };return { create: null, query: { serverName: Ur.NAME.OPEN_IM, cmd: Ur.CMD.GET_MESSAGES, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { cookie: "", syncFlag: 0, needAbstract: 1 }, keyMaps: { request: { fromAccount: "From_Account", toAccount: "To_Account", from: "From_Account", to: "To_Account", time: "MsgTimeStamp", sequence: "MsgSeq", random: "MsgRandom", elements: "MsgBody" }, response: { MsgList: "messageList", SyncFlag: "syncFlag", To_Account: "to", From_Account: "from", ClientSeq: "clientSequence", MsgSeq: "sequence", NoticeSeq: "noticeSequence", NotifySeq: "notifySequence", MsgRandom: "random", MsgTimeStamp: "time", MsgContent: "content", ToGroupId: "groupID", MsgKey: "messageKey", GroupTips: "groupTips", MsgBody: "elements", MsgType: "type", C2CRemainingUnreadCount: "C2CRemainingUnreadList" } } }, update: null, delete: null };}(this.tim), this.config.AVChatRoom = function (e) {return { startLongPoll: { serverName: Ur.NAME.BIG_GROUP_LONG_POLLING_NO_AUTH, cmd: Ur.CMD.AVCHATROOM_LONG_POLL, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: { websdkappid: br, v: Nr, platform: Pr, sdkappid: e.loginInfo.SDKAppID, accounttype: "792", apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return +new Date();} }, requestData: { USP: 1, startSeq: 1, holdTime: 90, key: void 0 }, keyMaps: { request: { USP: "USP" }, response: { ToGroupId: "groupID", MsgPriority: "priority" } } } };}(this.tim), this.config.cosUpload = function (e) {var t = { platform: Pr, websdkappid: br, v: Nr, a2: null !== e.context ? e.context.a2Key : "", tinyid: null !== e.context ? e.context.tinyID : 0, sdkappid: null !== e.context ? e.context.SDKAppID : 0, contentType: null !== e.context ? e.context.contentType : 0, apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return Date.now();} };return { create: { serverName: Ur.NAME.OPEN_IM, cmd: Ur.CMD.FILE_UPLOAD, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { appVersion: "2.1", fromAccount: "", toAccount: "", sequence: 0, time: function time() {return Math.ceil(Date.now() / 1e3);}, random: function random() {return he();}, fileStrMd5: "", fileSize: "", serverVer: 1, authKey: "", busiId: 1, pkgFlag: 1, sliceOffset: 0, sliceSize: 0, sliceData: "", contentType: "application/x-www-form-urlencoded" }, keyMaps: { request: {}, response: {} } }, update: null, delete: null };}(this.tim), this.config.cosSig = function (e) {var t = { sdkappid: function sdkappid() {return e.loginInfo.SDKAppID;}, identifier: function identifier() {return e.loginInfo.identifier;}, userSig: function userSig() {return e.context.userSig;} };return { create: null, query: { serverName: Ur.NAME.IM_COS_SIGN, cmd: Ur.CMD.COS_SIGN, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: t, requestData: { cmd: "open_im_cos_svc", subCmd: "get_cos_token", duration: 300, version: 2 }, keyMaps: { request: { userSig: "usersig", subCmd: "sub_cmd", cmd: "cmd", duration: "duration", version: "version" }, response: { expired_time: "expiredTime", bucket_name: "bucketName", session_token: "sessionToken", tmp_secret_id: "secretId", tmp_secret_key: "secretKey" } } }, update: null, delete: null };}(this.tim), this.config.bigDataHallwayAuthKey = function (e) {return { create: null, query: { serverName: Ur.NAME.OPEN_IM, cmd: Ur.CMD.BIG_DATA_HALLWAY_AUTH_KEY, channel: Ur.CHANNEL.XHR, protocol: qr, method: "POST", queryString: { websdkappid: br, v: Nr, platform: Pr, sdkappid: e.loginInfo.SDKAppID, accounttype: "792", apn: null !== e.context ? e.context.apn : 1, reqtime: function reqtime() {return +new Date();} }, requestData: {} } };}(this.tim), this.config.ssoEventStat = function (e) {var t = { sdkappid: e.loginInfo.SDKAppID, reqtime: Math.ceil(+new Date() / 1e3) };return { create: { serverName: Ur.NAME.IM_OPEN_STAT, cmd: Ur.CMD.TIM_WEB_REPORT, channel: Ur.CHANNEL.AUTO, protocol: qr, queryString: t, requestData: { table: "", report: [] }, keyMaps: { request: { table: "table", report: "report", SDKAppID: "sdkappid", version: "version", tinyID: "tinyid", userID: "userid", platform: "platform", method: "method", time: "time", start: "start", end: "end", cost: "cost", status: "status", codeint: "codeint", message: "message", pointer: "pointer", text: "text", msgType: "msgtype", networkType: "networktype", startts: "startts", endts: "endts", timespan: "timespan" } } }, query: {}, update: {}, delete: {} };}(this.tim), this.config.ssoSumStat = function (e) {var t = null;null !== e.context && (t = { sdkappid: e.context.SDKAppID, reqtime: Math.ceil(+new Date() / 1e3) });return { create: { serverName: Ur.NAME.IM_OPEN_STAT, cmd: Ur.CMD.TIM_WEB_REPORT, channel: Ur.CHANNEL.AUTO, protocol: qr, queryString: t, requestData: { table: "", report: [] }, keyMaps: { request: { table: "table", report: "report", SDKAppID: "sdkappid", version: "version", tinyID: "tinyid", userID: "userid", item: "item", lpID: "lpid", platform: "platform", networkType: "networktype", total: "total", successRate: "successrate", avg: "avg", timespan: "timespan", time: "time" } } }, query: {}, update: {}, delete: {} };}(this.tim);} }, { key: "_initRequestData", value: function value(e, t) {if (void 0 === e) return Lo(t.requestData, this._getRequestMap(t), this.tim);var n = t.requestData,r = Object.create(null);for (var o in n) {if (Object.prototype.hasOwnProperty.call(n, o)) {if (r[o] = "function" == typeof n[o] ? n[o]() : n[o], void 0 === e[o]) continue;r[o] = e[o];}}return r = Lo(r, this._getRequestMap(t), this.tim);} }, { key: "_getRequestMap", value: function value(e) {if (e.keyMaps && e.keyMaps.request && Object.keys(e.keyMaps.request).length > 0) return e.keyMaps.request;} }, { key: "_initEncoder", value: function value(e) {switch (e.protocol) {case qr:return function (e) {if ("string" === n(e)) try {return JSON.parse(e);} catch (t) {return e;}return e;};case Gr:return function (e) {return e;};default:return function (e) {return Y.warn("PackageConfig._initEncoder(), unknow response type, data: ", JSON.stringify(e)), e;};}} }, { key: "_initDecoder", value: function value(e) {switch (e.protocol) {case qr:return function (e) {if ("string" === n(e)) try {return JSON.parse(e);} catch (t) {return e;}return e;};case Gr:return function (e) {return e;};default:return function (e) {return Y.warn("PackageConfig._initDecoder(), unknow response type, data: ", e), e;};}} }]), e;}(),Ru = function Ru() {for (var e = [], t = Ou(arguments), n = 0; n < arguments.length; n++) {Number.isInteger(arguments[n]) ? e.push(arguments[n]) : e.push(!0 == !!arguments[n] ? "1" : "0");}return e.join(t);},Ou = function Ou(e) {var t = e.length,n = e[t - 1];if ("string" != typeof n) return "";if (n.length > 1) return "";var r = e[t - 1];return delete e[t - 1], e.length -= t === e.length ? 1 : 0, r;},Lu = { C2CMessageArray: 1, groupMessageArray: 1, groupTips: 1, C2CNotifyMessageArray: 1, profileModify: 1, friendListMod: 1 },Nu = function (e) {function t(e) {var n;return r(this, t), (n = m(this, l(t).call(this, e)))._initialization(), n;}return c(t, e), i(t, [{ key: "_initialization", value: function value() {this._syncOffset = "", this._syncNoticeList = [], this._syncEventArray = [], this._syncMessagesIsRunning = !1, this._syncMessagesFinished = !1, this._isLongPoll = !1, this._longPollID = 0, this._noticeSequence = 0, this._initializeListener(), this._runLoop = null, this._initShuntChannels();} }, { key: "_initShuntChannels", value: function value() {this._shuntChannels = Object.create(null), this._shuntChannels.C2CMessageArray = this._C2CMessageArrayChannel.bind(this), this._shuntChannels.groupMessageArray = this._groupMessageArrayChannel.bind(this), this._shuntChannels.groupTips = this._groupTipsChannel.bind(this), this._shuntChannels.C2CNotifyMessageArray = this._C2CNotifyMessageArrayChannel.bind(this), this._shuntChannels.profileModify = this._profileModifyChannel.bind(this), this._shuntChannels.friendListMod = this._friendListModChannel.bind(this);} }, { key: "_C2CMessageArrayChannel", value: function value(e, t, n) {this.emitInnerEvent(so, t);} }, { key: "_groupMessageArrayChannel", value: function value(e, t, n) {this.emitInnerEvent(ao, t);} }, { key: "_groupTipsChannel", value: function value(e, t, n) {var r = this;switch (e) {case 4:this.emitInnerEvent(uo, t);break;case 5:t.forEach(function (e) {Z(e.elements.revokedInfos) ? r.emitInnerEvent(fo, t) : r.emitInnerEvent(co, { groupSystemNotices: t, type: n });});break;default:Y.log("NotificationController._groupTipsChannel unknown event=".concat(e, " type=").concat(n), t);}} }, { key: "_C2CNotifyMessageArrayChannel", value: function value(e, t, n) {this._isKickedoutNotice(t) ? this.emitInnerEvent(io) : this._isSysCmdMsgNotify(t) ? this.emitInnerEvent(ho) : this._isC2CMessageRevokedNotify(t) && this.emitInnerEvent(go, t);} }, { key: "_profileModifyChannel", value: function value(e, t, n) {this.emitInnerEvent(po, t);} }, { key: "_friendListModChannel", value: function value(e, t, n) {this.emitInnerEvent(lo, t);} }, { key: "_dispatchNotice", value: function value(e) {var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "poll";if (Z(e)) for (var n = null, r = null, o = "", i = "", s = "", a = 0, u = 0, c = e.length; u < c; u++) {a = (n = e[u]).event, o = Object.keys(n).find(function (e) {return void 0 !== Lu[e];}), ne(this._shuntChannels[o]) ? (r = n[o], "poll" === t && this._updatenoticeSequence(r), this._shuntChannels[o](a, r, t)) : ("poll" === t && this._updatenoticeSequence(), i = "".concat(pn), s = "".concat(_r, ": ").concat(a, ", ").concat(o), this.emitInnerEvent(So, new at({ code: i, message: s, data: { payloadName: o, event: a } })), i = "", s = "");}} }, { key: "getLongPollID", value: function value() {return this._longPollID;} }, { key: "_IAmReady", value: function value() {this.triggerReady();} }, { key: "reset", value: function value() {this._noticeSequence = 0, this._resetSync(), this.closeNoticeChannel();} }, { key: "_resetSync", value: function value() {this._syncOffset = "", this._syncNoticeList = [], this._syncEventArray = [], this._syncMessagesIsRunning = !1, this._syncMessagesFinished = !1;} }, { key: "_setNoticeSeqInRequestData", value: function value(e) {e.Cookie.NoticeSeq = this._noticeSequence, this.tim.sumStatController.addTotalCount($o);} }, { key: "_updatenoticeSequence", value: function value(e) {if (e) {var t = e[e.length - 1].noticeSequence;t && "number" == typeof t ? t <= this._noticeSequence || (this._noticeSequence = t) : this._noticeSequence++;} else this._noticeSequence++;} }, { key: "_initializeListener", value: function value() {var e = this.tim.innerEmitter;e.on(Br, this._startSyncMessages, this), e.on(Io, this.closeNoticeChannel, this), e.on(no, this._onFastStart, this);} }, { key: "openNoticeChannel", value: function value() {Y.log("NotificationController.openNoticeChannel"), this._getLongPollID();} }, { key: "closeNoticeChannel", value: function value() {Y.log("NotificationController.closeNoticeChannel"), (this._runLoop instanceof Ya || this._runLoop instanceof za) && (this._runLoop.abort(), this._runLoop.stop()), this._longPollID = 0, this._isLongPoll = !1;} }, { key: "_getLongPollID", value: function value() {var e = this;if (0 === this._longPollID) {var t = new Qo();t.setMethod(Ei).setStart(), this.request({ name: "longPollID", action: "query" }).then(function (n) {var r = n.data.longPollingID;e._onGetLongPollIDSuccess(r), t.setCode(0).setText("longPollingID=".concat(r)).setNetworkType(e.getNetworkType()).setEnd();}).catch(function (n) {var r = new at({ code: n.code || gn, message: n.message || Ir });e.emitInnerEvent(Zr), e.emitInnerEvent(So, r), e.probeNetwork().then(function (e) {var n = y(e, 2),o = n[0],i = n[1];t.setError(r, o, i).setEnd();});});} else this._onGetLongPollIDSuccess(this._longPollID);} }, { key: "_onGetLongPollIDSuccess", value: function value(e) {this.emitInnerEvent(Kr, [{ key: "long_poll_logout.query.requestData.longPollingID", value: e }, { key: "longPoll.query.requestData.cookie.longPollingID", value: e }]), this._longPollID = e, this._startLongPoll(), this._IAmReady(), this.tim.sumStatController.recordLongPollingID(this._longPollID);} }, { key: "_startLongPoll", value: function value() {if (!0 !== this._isLongPoll) {Y.log("NotificationController._startLongPoll...");var e = this.tim.connectionController,t = this.createTransportCapsule({ name: "longPoll", action: "query" });this._isLongPoll = !0, this._runLoop = e.createRunLoop({ pack: t, before: this._setNoticeSeqInRequestData.bind(this), success: this._onNoticeReceived.bind(this), fail: this._onNoticeFail.bind(this) }), this._runLoop.start();} else Y.log("NotificationController._startLongPoll is running...");} }, { key: "_onFastStart", value: function value() {this.closeNoticeChannel(), this.syncMessage();} }, { key: "_onNoticeReceived", value: function value(e) {var t = e.data;if (t.errorCode !== Ae.SUCCESS) {var n = new Qo();n.setMethod(ki).setStart(), n.setMessage(t.errorInfo).setCode(t.errorCode).setNetworkType(this.getNetworkType()).setEnd(), this._onResponseError(t);} else this.emitInnerEvent(to);this.tim.sumStatController.addSuccessCount($o), this.tim.sumStatController.addCost($o, t.timecost), e.data.eventArray && this._dispatchNotice(e.data.eventArray);} }, { key: "_onResponseError", value: function value(e) {switch (e.errorCode) {case mn:Y.warn("NotificationController._onResponseError, longPollingID=".concat(this._longPollID, " was kicked out")), this.emitInnerEvent(oo), this.closeNoticeChannel();break;case yn:case vn:this.emitInnerEvent(Mo);break;default:this.emitInnerEvent(So, new at({ code: e.errorCode, message: e.errorInfo }));}} }, { key: "_onNoticeFail", value: function value(e) {if (e.error) if ("ECONNABORTED" === e.error.code || e.error.code === on) {if (e.error.config) {var t = e.error.config.url,n = e.error.config.data;Y.log("NotificationController._onNoticeFail request timed out. url=".concat(t, " data=").concat(n));} else Y.log("NotificationController._onNoticeFail request timed out.");} else Y.log("NotificationController._onNoticeFail request failed due to network error");this.emitInnerEvent(eo);} }, { key: "_isKickedoutNotice", value: function value(e) {return !!e[0].hasOwnProperty("kickoutMsgNotify");} }, { key: "_isSysCmdMsgNotify", value: function value(e) {if (!e[0]) return !1;var t = e[0];return !!Object.prototype.hasOwnProperty.call(t, "sysCmdMsgNotify");} }, { key: "_isC2CMessageRevokedNotify", value: function value(e) {var t = e[0];return !!Object.prototype.hasOwnProperty.call(t, "c2cMessageRevokedNotify");} }, { key: "_startSyncMessages", value: function value(e) {!0 !== this._syncMessagesFinished && this.syncMessage();} }, { key: "syncMessage", value: function value() {var e = this,t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;this._syncMessagesIsRunning = !0, this.request({ name: "syncMessage", action: "query", param: { cookie: t, syncFlag: n } }).then(function (t) {var n = t.data;switch (Ru(n.cookie, n.syncFlag)) {case "00":case "01":e.emitInnerEvent(So, { code: hn, message: Cr });break;case "10":case "11":n.eventArray && e._dispatchNotice(n.eventArray, "sync"), e._syncNoticeList = e._syncNoticeList.concat(n.messageList), e.emitInnerEvent(Vr, { data: n.messageList, C2CRemainingUnreadList: n.C2CRemainingUnreadList }), e._syncOffset = n.cookie, e.syncMessage(n.cookie, n.syncFlag);break;case "12":n.eventArray && e._dispatchNotice(n.eventArray, "sync"), e.openNoticeChannel(), e._syncNoticeList = e._syncNoticeList.concat(n.messageList), e.emitInnerEvent(jr, { messageList: n.messageList, C2CRemainingUnreadList: n.C2CRemainingUnreadList }), e._syncOffset = n.cookie, e._syncNoticeList = [], e._syncMessagesIsRunning = !1, e._syncMessagesFinished = !0;}}).catch(function (t) {e._syncMessagesIsRunning = !1, Y.error("NotificationController.syncMessage failed. error:".concat(t));});} }]), t;}(Go),bu = function (e) {function t(e) {var n;return r(this, t), (n = m(this, l(t).call(this, e)))._initializeListener(), n;}return c(t, e), i(t, [{ key: "_initializeMembers", value: function value(e) {this.expiredTimeLimit = 300, this.appid = e.appid || "", this.bucketName = e.bucketName || "", this.ciUrl = e.ciUrl || "", this.directory = e.directory || "", this.downloadUrl = e.downloadUrl || "", this.uploadUrl = e.uploadUrl || "", this.expiredTimeOut = e.expiredTimeOut || this.expiredTimeLimit, this.region = "ap-shanghai", this.cos = null, this.cosOptions = { secretId: e.secretId, secretKey: e.secretKey, sessionToken: e.sessionToken, expiredTime: e.expiredTime }, this._initUploaderMethod();} }, { key: "_expiredTimer", value: function value() {var e = this,t = setInterval(function () {Math.ceil(Date.now() / 1e3) >= e.cosOptions.expiredTime - 20 && (e._isReady = !1, e._getAuthorizationKey(), clearInterval(t));}, 1e4);} }, { key: "_initializeListener", value: function value() {this.tim.innerEmitter.on(Br, this._initialization, this);} }, { key: "_initialization", value: function value() {this._initCOSSDKPlugin(), this.COSSDK ? (this._initializeMembers({}), this._getAuthorizationKey()) : Y.warn("UploadController._initialization 没有检测到上传插件，将无法发送图片、音频、视频、文件等类型的消息。详细请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#registerPlugin");} }, { key: "_getAuthorizationKey", value: function value() {var e = this,t = Math.ceil(Date.now() / 1e3);this.request({ name: "cosSig", action: "query", param: { duration: this.expiredTimeLimit } }).then(function (n) {var r = n.data.expiredTime - t;n.data.expiredTimeOut = r, Y.log("UploadController._getAuthorizationKey timeout=".concat(r, "s")), e._initializeMembers(n.data), e._expiredTimer(), e._initUploaderMethod();}).catch(function (e) {Y.warn("UploadController._getAuthorizationKey. error:", e);});} }, { key: "_initCOSSDKPlugin", value: function value() {var e = k ? "cos-wx-sdk" : "cos-js-sdk";this.COSSDK = this.tim.getPlugin(e);} }, { key: "_initUploaderMethod", value: function value() {var e = this;this.appid && (this.cos = k ? new this.COSSDK({ ForcePathStyle: !0, getAuthorization: this._getAuthorization.bind(this) }) : new this.COSSDK({ getAuthorization: this._getAuthorization.bind(this) }), this._cosUploadMethod = k ? function (t, n) {e.cos.postObject(t, n);} : function (t, n) {e.cos.uploadFiles(t, n);}, this.triggerReady());} }, { key: "_getAuthorization", value: function value(e, t) {t({ TmpSecretId: this.cosOptions.secretId, TmpSecretKey: this.cosOptions.secretKey, XCosSecurityToken: this.cosOptions.sessionToken, ExpiredTime: this.cosOptions.expiredTime });} }, { key: "uploadImage", value: function value(e) {if (!e.file) return Ko(new at({ code: Mt, message: Nn }));var t = this._checkImageType(e.file);if (!0 !== t) return t;var n = this._checkImageMime(e.file);if (!0 !== n) return n;var r = this._checkImageSize(e.file);return !0 !== r ? r : this.upload(e);} }, { key: "_checkImageType", value: function value(e) {var t = "";return t = k ? e.url.slice(e.url.lastIndexOf(".") + 1) : e.files[0].name.slice(e.files[0].name.lastIndexOf(".") + 1), Sr.indexOf(t.toLowerCase()) >= 0 || Ko(new at({ coe: St, message: bn }));} }, { key: "_checkImageMime", value: function value(e) {return !0;} }, { key: "_checkImageSize", value: function value(e) {var t = 0;return 0 === (t = k ? e.size : e.files[0].size) ? Ko(new at({ code: _t, message: "".concat(Rn) })) : t < 20971520 || Ko(new at({ coe: Dt, message: "".concat(Pn) }));} }, { key: "uploadFile", value: function value(e) {var t = null;return e.file ? e.file.files[0].size > 104857600 ? (t = new at({ code: Lt, message: Kn }), Ko(t)) : 0 === e.file.files[0].size ? (t = new at({ code: _t, message: "".concat(Rn) }), Ko(t)) : this.upload(e) : (t = new at({ code: Ot, message: Bn }), Ko(t));} }, { key: "uploadVideo", value: function value(e) {if (k) return e.file.videoFile.size > 20971520 ? Ko(new at({ code: wt, message: "".concat(xn) })) : 0 === e.file.videoFile.size ? Ko(new at({ code: _t, message: "".concat(Rn) })) : -1 === Dr.indexOf(e.file.videoFile.type) ? Ko(new at({ code: At, message: "".concat(Fn) })) : this.handleVideoUpload({ file: e.file.videoFile });} }, { key: "handleVideoUpload", value: function value(e) {var t = this;return new Promise(function (n, r) {t.upload(e).then(function (e) {n(e);}).catch(function () {t.upload(e).then(function (e) {n(e);}).catch(function () {r(new at({ code: kt, message: Un }));});});});} }, { key: "uploadAudio", value: function value(e) {return e.file ? e.file.size > 20971520 ? Ko(new at({ code: Et, message: "".concat(qn) })) : 0 === e.file.size ? Ko(new at({ code: _t, message: "".concat(Rn) })) : this.upload(e) : Ko(new at({ code: Tt, message: Gn }));} }, { key: "upload", value: function value(e) {var t = this;if (!ne(this._cosUploadMethod)) return Y.warn("UploadController.upload 没有检测到上传插件，将无法发送图片、音频、视频、文件等类型的消息。详细请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#registerPlugin"), Ko(new at({ code: gt, message: Tn }));var n = new Qo();n.setMethod(ri).setStart(), Y.time(Jo);var r = k ? e.file : e.file.files[0];return new Promise(function (o, i) {var s = k ? t._createCosOptionsWXMiniApp(e) : t._createCosOptionsWeb(e),a = t;t._cosUploadMethod(s, function (e, s) {var u = Object.create(null);if (s) {if (t._isUploadError(s, e)) return i(s.files[0].error), Y.warn("UploadController.upload failed, network error:".concat(s.files[0].error.error)), void n.setCode(Rt).setMessage(Hn).setEnd();u.fileName = r.name, u.fileSize = r.size, u.fileType = r.type.slice(r.type.indexOf("/") + 1).toLowerCase(), u.location = k ? s.Location : s.files[0].data.Location;var c = Y.timeEnd(Jo),l = a._formatFileSize(r.size),p = a._formatSpeed(1e3 * r.size / c),h = "size=".concat(l, ",time=").concat(c, "ms,speed=").concat(p);return Y.log("UploadController.upload success name=".concat(r.name, ",").concat(h)), o(u), void n.setCode(0).setNetworkType(t.getNetworkType()).setText(h).setEnd();}n.setCode(Rt).setMessage(Hn).setEnd(), Y.warn("UploadController.upload failed, error:".concat(e)), i(e);});});} }, { key: "_isUploadError", value: function value(e, t) {return k ? !!t : null !== e.files[0].error;} }, { key: "_formatFileSize", value: function value(e) {return e < 1024 ? e + "B" : e < 1048576 ? Math.floor(e / 1024) + "KB" : Math.floor(e / 1048576) + "MB";} }, { key: "_formatSpeed", value: function value(e) {return e <= 1048576 ? (e / 1024).toFixed(1) + "KB/s" : (e / 1048576).toFixed(1) + "MB/s";} }, { key: "_createCosOptionsWeb", value: function value(e) {var t = this.tim.context.identifier,n = this._genFileName(t, e.to, e.file.files[0].name);return { files: [{ Bucket: "".concat(this.bucketName, "-").concat(this.appid), Region: this.region, Key: "".concat(this.directory, "/").concat(n), Body: e.file.files[0] }], SliceSize: 1048576, onProgress: function onProgress(t) {if ("function" == typeof e.onProgress) try {e.onProgress(t.percent);} catch (n) {Y.warn("onProgress callback error:"), Y.error(n);}}, onFileFinish: function onFileFinish(e, t, n) {} };} }, { key: "_createCosOptionsWXMiniApp", value: function value(e) {var t = this.tim.context.identifier,n = this._genFileName(t, e.to, e.file.name),r = e.file.url;return { Bucket: "".concat(this.bucketName, "-").concat(this.appid), Region: this.region, Key: "".concat(this.directory, "/").concat(n), FilePath: r, onProgress: function onProgress(t) {if (Y.log(JSON.stringify(t)), "function" == typeof e.onProgress) try {e.onProgress(t.percent);} catch (n) {Y.warn("onProgress callback error:"), Y.error(n);}} };} }, { key: "_genFileName", value: function value(e, t, n) {return "".concat(e, "-").concat(t, "-").concat(he(99999), "-").concat(n);} }]), t;}(Go),Pu = function (e) {function n(e) {var t;return r(this, n), (t = m(this, l(n).call(this, e))).FILETYPE = { SOUND: 2106, FILE: 2107, VIDEO: 2113 }, t._bdh_download_server = "grouptalk.c2c.qq.com", t._BDHBizID = 10001, t._authKey = "", t._expireTime = 0, t.tim.innerEmitter.on(Br, t._getAuthKey, d(t)), t;}return c(n, e), i(n, [{ key: "_getAuthKey", value: function value() {var e = this;this.request({ name: "bigDataHallwayAuthKey", action: "query" }).then(function (t) {t.data.authKey && (e._authKey = t.data.authKey, e._expireTime = parseInt(t.data.expireTime));});} }, { key: "_isFromOlderVersion", value: function value(e) {return 2 !== e.content.downloadFlag;} }, { key: "parseElements", value: function value(e, t) {if (!Z(e) || !t) return [];for (var n = [], r = null, o = 0; o < e.length; o++) {r = e[o], this._needParse(r) ? n.push(this._parseElement(r, t)) : n.push(e[o]);}return n;} }, { key: "_needParse", value: function value(e) {return !(!this._isFromOlderVersion(e) || e.type !== t.MSG_AUDIO && e.type !== t.MSG_FILE && e.type !== t.MSG_VIDEO);} }, { key: "_parseElement", value: function value(e, n) {switch (e.type) {case t.MSG_AUDIO:return this._parseAudioElement(e, n);case t.MSG_FILE:return this._parseFileElement(e, n);case t.MSG_VIDEO:return this._parseVideoElement(e, n);}} }, { key: "_parseAudioElement", value: function value(e, t) {return e.content.url = this._genAudioUrl(e.content.uuid, t), e;} }, { key: "_parseFileElement", value: function value(e, t) {return e.content.url = this._genFileUrl(e.content.uuid, t, e.content.fileName), e;} }, { key: "_parseVideoElement", value: function value(e, t) {return e.content.url = this._genVideoUrl(e.content.uuid, t), e;} }, { key: "_genAudioUrl", value: function value(e, t) {return "" === this._authKey ? (Y.warn("BigDataHallwayController._genAudioUrl no authKey!"), "") : "https://".concat(this._bdh_download_server, "/asn.com/stddownload_common_file?authkey=").concat(this._authKey, "&bid=").concat(this._BDHBizID, "&subbid=").concat(this.tim.context.SDKAppID, "&fileid=").concat(e, "&filetype=").concat(this.FILETYPE.SOUND, "&openid=").concat(t, "&ver=0");} }, { key: "_genFileUrl", value: function value(e, t, n) {return "" === this._authKey ? (Y.warn("BigDataHallwayController._genFileUrl no authKey!"), "") : (n || (n = "".concat(Math.floor(1e5 * Math.random()), "-").concat(Date.now())), "https://".concat(this._bdh_download_server, "/asn.com/stddownload_common_file?authkey=").concat(this._authKey, "&bid=").concat(this._BDHBizID, "&subbid=").concat(this.tim.context.SDKAppID, "&fileid=").concat(e, "&filetype=").concat(this.FILETYPE.FILE, "&openid=").concat(t, "&ver=0&filename=").concat(encodeURIComponent(n)));} }, { key: "_genVideoUrl", value: function value(e, t) {return "" === this._authKey ? (Y.warn("BigDataHallwayController._genVideoUrl no authKey!"), "") : "https://".concat(this._bdh_download_server, "/asn.com/stddownload_common_file?authkey=").concat(this._authKey, "&bid=").concat(this._BDHBizID, "&subbid=").concat(this.tim.context.SDKAppID, "&fileid=").concat(e, "&filetype=").concat(this.FILETYPE.VIDEO, "&openid=").concat(t, "&ver=0");} }, { key: "reset", value: function value() {this._authKey = "", this.expireTime = 0;} }]), n;}(Go),Gu = { app_id: "", event_id: "", api_base: "https://pingtas.qq.com/pingd", prefix: "_mta_", version: "1.3.9", stat_share_app: !1, stat_pull_down_fresh: !1, stat_reach_bottom: !1, stat_param: !0 };function qu() {try {var e = "s" + Uu();return wx.setStorageSync(Gu.prefix + "ssid", e), e;} catch (t) {}}function Uu(e) {for (var t = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], n = 10; 1 < n; n--) {var r = Math.floor(10 * Math.random()),o = t[r];t[r] = t[n - 1], t[n - 1] = o;}for (n = r = 0; 5 > n; n++) {r = 10 * r + t[n];}return (e || "") + (r + "") + +new Date();}function xu() {try {var e = getCurrentPages(),t = "/";return 0 < e.length && (t = e.pop().__route__), t;} catch (n) {console.log("get current page path error:" + n);}}function Fu() {var e,t = { dm: "wechat.apps.xx", url: encodeURIComponent(xu() + Ku(Vu.Data.pageQuery)), pvi: "", si: "", ty: 0 };return t.pvi = ((e = function () {try {return wx.getStorageSync(Gu.prefix + "auid");} catch (t) {}}()) || (e = function () {try {var t = Uu();return wx.setStorageSync(Gu.prefix + "auid", t), t;} catch (e) {}}(), t.ty = 1), e), t.si = function () {var e = function () {try {return wx.getStorageSync(Gu.prefix + "ssid");} catch (e) {}}();return e || (e = qu()), e;}(), t;}function Hu() {var e = function () {var e = wx.getSystemInfoSync();return { adt: encodeURIComponent(e.model), scl: e.pixelRatio, scr: e.windowWidth + "x" + e.windowHeight, lg: e.language, fl: e.version, jv: encodeURIComponent(e.system), tz: encodeURIComponent(e.platform) };}();return function (e) {wx.getNetworkType({ success: function success(t) {e(t.networkType);} });}(function (e) {try {wx.setStorageSync(Gu.prefix + "ntdata", e);} catch (t) {}}), e.ct = wx.getStorageSync(Gu.prefix + "ntdata") || "4g", e;}function Bu() {var e,t = Vu.Data.userInfo,n = [];for (e in t) {t.hasOwnProperty(e) && n.push(e + "=" + t[e]);}return t = n.join(";"), { r2: Gu.app_id, r4: "wx", ext: "v=" + Gu.version + (null !== t && "" !== t ? ";ui=" + encodeURIComponent(t) : "") };}function Ku(e) {if (!Gu.stat_param || !e) return "";e = function (e) {if (1 > Gu.ignore_params.length) return e;var t,n = {};for (t in e) {0 <= Gu.ignore_params.indexOf(t) || (n[t] = e[t]);}return n;}(e);var t,n = [];for (t in e) {n.push(t + "=" + e[t]);}return 0 < n.length ? "?" + n.join("&") : "";}var Vu = { App: { init: function init(e) {"appID" in e && (Gu.app_id = e.appID), "eventID" in e && (Gu.event_id = e.eventID), "statShareApp" in e && (Gu.stat_share_app = e.statShareApp), "statPullDownFresh" in e && (Gu.stat_pull_down_fresh = e.statPullDownFresh), "statReachBottom" in e && (Gu.stat_reach_bottom = e.statReachBottom), "ignoreParams" in e && (Gu.ignore_params = e.ignoreParams), "statParam" in e && (Gu.stat_param = e.statParam), qu();try {"lauchOpts" in e && (Vu.Data.lanchInfo = e.lauchOpts, Vu.Data.lanchInfo.landing = 1);} catch (t) {}"autoReport" in e && e.autoReport && function () {var e = Page;Page = function Page(t) {var n = t.onLoad;t.onLoad = function (e) {n && n.call(this, e), Vu.Data.lastPageQuery = Vu.Data.pageQuery, Vu.Data.pageQuery = e, Vu.Data.lastPageUrl = Vu.Data.pageUrl, Vu.Data.pageUrl = xu(), Vu.Data.show = !1, Vu.Page.init();}, e(t);};}();} }, Page: { init: function init() {var e,t = getCurrentPages()[getCurrentPages().length - 1];t.onShow && (e = t.onShow, t.onShow = function () {if (!0 === Vu.Data.show) {var t = Vu.Data.lastPageQuery;Vu.Data.lastPageQuery = Vu.Data.pageQuery, Vu.Data.pageQuery = t, Vu.Data.lastPageUrl = Vu.Data.pageUrl, Vu.Data.pageUrl = xu();}Vu.Data.show = !0, Vu.Page.stat(), e.apply(this, arguments);}), Gu.stat_pull_down_fresh && t.onPullDownRefresh && function () {var e = t.onPullDownRefresh;t.onPullDownRefresh = function () {Vu.Event.stat(Gu.prefix + "pulldownfresh", { url: t.__route__ }), e.apply(this, arguments);};}(), Gu.stat_reach_bottom && t.onReachBottom && function () {var e = t.onReachBottom;t.onReachBottom = function () {Vu.Event.stat(Gu.prefix + "reachbottom", { url: t.__route__ }), e.apply(this, arguments);};}(), Gu.stat_share_app && t.onShareAppMessage && function () {var e = t.onShareAppMessage;t.onShareAppMessage = function () {return Vu.Event.stat(Gu.prefix + "shareapp", { url: t.__route__ }), e.apply(this, arguments);};}();}, multiStat: function multiStat(e, t) {if (1 == t) Vu.Page.stat(e);else {var n = getCurrentPages()[getCurrentPages().length - 1];n.onShow && function () {var t = n.onShow;n.onShow = function () {Vu.Page.stat(e), t.call(this, arguments);};}();}}, stat: function stat(e) {if ("" != Gu.app_id) {var t = [],n = Bu();if (e && (n.r2 = e), e = [Fu(), n, Hu()], Vu.Data.lanchInfo) {e.push({ ht: Vu.Data.lanchInfo.scene }), Vu.Data.pageQuery && Vu.Data.pageQuery._mta_ref_id && e.push({ rarg: Vu.Data.pageQuery._mta_ref_id });try {1 == Vu.Data.lanchInfo.landing && (n.ext += ";lp=1", Vu.Data.lanchInfo.landing = 0);} catch (i) {}}e.push({ rdm: "/", rurl: 0 >= Vu.Data.lastPageUrl.length ? Vu.Data.pageUrl + Ku(Vu.Data.lastPageQuery) : encodeURIComponent(Vu.Data.lastPageUrl + Ku(Vu.Data.lastPageQuery)) }), e.push({ rand: +new Date() }), n = 0;for (var r = e.length; n < r; n++) {for (var o in e[n]) {e[n].hasOwnProperty(o) && t.push(o + "=" + (void 0 === e[n][o] ? "" : e[n][o]));}}wx.request({ url: Gu.api_base + "?" + t.join("&").toLowerCase() });}} }, Event: { stat: function stat(e, t) {if ("" != Gu.event_id) {var n = [],r = Fu(),o = Bu();r.dm = "wxapps.click", r.url = e, o.r2 = Gu.event_id;var i,s = void 0 === t ? {} : t,a = [];for (i in s) {s.hasOwnProperty(i) && a.push(encodeURIComponent(i) + "=" + encodeURIComponent(s[i]));}for (s = a.join(";"), o.r5 = s, s = 0, o = (r = [r, o, Hu(), { rand: +new Date() }]).length; s < o; s++) {for (var u in r[s]) {r[s].hasOwnProperty(u) && n.push(u + "=" + (void 0 === r[s][u] ? "" : r[s][u]));}}wx.request({ url: Gu.api_base + "?" + n.join("&").toLowerCase() });}} }, Data: { userInfo: null, lanchInfo: null, pageQuery: null, lastPageQuery: null, pageUrl: "", lastPageUrl: "", show: !1 } },ju = Vu,$u = function () {function e() {r(this, e), this.cache = [], this.MtaWX = null, this._init();}return i(e, [{ key: "report", value: function value(e, t) {var n = this;try {E ? window.MtaH5 ? (window.MtaH5.clickStat(e, t), this.cache.forEach(function (e) {var t = e.name,r = e.param;window.MtaH5.clickStat(t, r), n.cache.shift();})) : this.cache.push({ name: e, param: t }) : k && (this.MtaWX ? (this.MtaWX.Event.stat(e, t), this.cache.forEach(function (e) {var t = e.name,r = e.param;n.MtaWX.stat(t, r), n.cache.shift();})) : this.cache.push({ name: e, param: t }));} catch (r) {}} }, { key: "stat", value: function value() {try {E && window.MtaH5 ? window.MtaH5.pgv() : k && this.MtaWX && this.MtaWX.Page.stat();} catch (e) {}} }, { key: "_init", value: function value() {try {if (E) {window._mtac = { autoReport: 0 };var e = document.createElement("script"),t = ye();e.src = "".concat(t, "//pingjs.qq.com/h5/stats.js?v2.0.4"), e.setAttribute("name", "MTAH5"), e.setAttribute("sid", "500690998"), e.setAttribute("cid", "500691017");var n = document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e, n);} else k && (this.MtaWX = ju, this.MtaWX.App.init({ appID: "500690995", eventID: "500691014", autoReport: !1, statParam: !0 }));} catch (r) {}} }]), e;}(),Yu = function (e) {function t(e) {var n;return r(this, t), (n = m(this, l(t).call(this, e))).tim = e, n.MTA = new $u(), n._initListener(), n;}return c(t, e), i(t, [{ key: "_initListener", value: function value() {var e = this;this.tim.innerEmitter.on(Ao, function () {e.MTA.report("sdkappid", { value: e.tim.context.SDKAppID }), e.MTA.report("version", { value: ac.VERSION }), e.MTA.stat();});} }]), t;}(Go),zu = function () {function e(t) {r(this, e), this._table = "timwebii", this._report = [];}return i(e, [{ key: "pushIn", value: function value(e) {Y.debug("SSOLogBody.pushIn", this._report.length, e), this._report.push(e);} }, { key: "backfill", value: function value(e) {var t;Z(e) && 0 !== e.length && (Y.debug("SSOLogBody.backfill", this._report.length, e.length), (t = this._report).unshift.apply(t, v(e)));} }, { key: "getLogsNumInMemory", value: function value() {return this._report.length;} }, { key: "isEmpty", value: function value() {return 0 === this._report.length;} }, { key: "_reset", value: function value() {this._report.length = 0, this._report = [];} }, { key: "getTable", value: function value() {return this._table;} }, { key: "getLogsInMemory", value: function value() {var e = this._report.slice();return this._reset(), e;} }]), e;}(),Wu = function (e) {function t(e) {var n;return r(this, t), (n = m(this, l(t).call(this, e))).TAG = "im-ssolog-event", n._reportBody = new zu(), n._version = "2.5.1", n.MIN_THRESHOLD = 20, n.MAX_THRESHOLD = 100, n.WAITING_TIME = 6e4, n.INTERVAL = 2e4, n._timerID = 0, n._resetLastReportTime(), n._startReportTimer(), n._retryCount = 0, n.MAX_RETRY_COUNT = 3, n.tim.innerEmitter.on(_o, n._onLoginSuccess, d(n)), n;}return c(t, e), i(t, [{ key: "reportAtOnce", value: function value() {Y.debug("EventStatController.reportAtOnce"), this._report();} }, { key: "_onLoginSuccess", value: function value() {var e = this,t = this.tim.storage,n = t.getItem(this.TAG, !1);Te(n) || (Y.log("EventStatController._onLoginSuccess get ssolog in storage, nums=" + n.length), n.forEach(function (t) {e._reportBody.pushIn(t);}), t.removeItem(this.TAG, !1));} }, { key: "pushIn", value: function value(e) {e instanceof Qo && (e.setCommonInfo(this.tim.context.SDKAppID, this._version, this.tim.context.tinyID, this.tim.loginInfo.identifier, this.getPlatform()), this._reportBody.pushIn(e), this._reportBody.getLogsNumInMemory() >= this.MIN_THRESHOLD && this._report());} }, { key: "_resetLastReportTime", value: function value() {this._lastReportTime = Date.now();} }, { key: "_startReportTimer", value: function value() {var e = this;this._timerID = setInterval(function () {Date.now() < e._lastReportTime + e.WAITING_TIME || e._reportBody.isEmpty() || e._report();}, this.INTERVAL);} }, { key: "_stopReportTimer", value: function value() {this._timerID > 0 && (clearInterval(this._timerID), this._timerID = 0);} }, { key: "_report", value: function value() {var e = this;if (!this._reportBody.isEmpty()) {var t = this._reportBody.getLogsInMemory();this.request({ name: "ssoEventStat", action: "create", param: { table: this._reportBody.getTable(), report: t } }).then(function () {e._resetLastReportTime(), e._retryCount > 0 && (Y.debug("EventStatController.report retry success"), e._retryCount = 0);}).catch(function (n) {if (Y.warn("EventStatController.report, online:".concat(e.getNetworkType(), " error:").concat(n)), e._reportBody.backfill(t), e._reportBody.getLogsNumInMemory() > e.MAX_THRESHOLD || e._retryCount === e.MAX_RETRY_COUNT || 0 === e._timerID) return e._retryCount = 0, void e._flushAtOnce();e._retryCount += 1;});}} }, { key: "_flushAtOnce", value: function value() {var e = this.tim.storage,t = e.getItem(this.TAG, !1),n = this._reportBody.getLogsInMemory();if (Te(t)) Y.log("EventStatController._flushAtOnce nums=" + n.length), e.setItem(this.TAG, n, !0, !1);else {var r = n.concat(t);r.length > this.MAX_THRESHOLD && (r = r.slice(0, this.MAX_THRESHOLD)), Y.log("EventStatController._flushAtOnce nums=" + r.length), e.setItem(this.TAG, r, !0, !1);}} }, { key: "reset", value: function value() {Y.log("EventStatController.reset"), this._stopReportTimer(), this._report();} }]), t;}(Go),Xu = "none",Ju = "online",Qu = function () {function e() {r(this, e), this._networkType = "", this.maxWaitTime = 3e3;}return i(e, [{ key: "start", value: function value() {var e = this;k ? (wx.getNetworkType({ success: function success(t) {e._networkType = t.networkType, t.networkType === Xu ? Y.warn("NetMonitor no network, please check!") : Y.info("NetMonitor networkType:".concat(t.networkType));} }), wx.onNetworkStatusChange(this._onWxNetworkStatusChange.bind(this))) : this._networkType = Ju;} }, { key: "_onWxNetworkStatusChange", value: function value(e) {this._networkType = e.networkType, e.isConnected ? Y.info("NetMonitor networkType:".concat(e.networkType)) : Y.warn("NetMonitor no network, please check!");} }, { key: "probe", value: function value() {var e = this;return new Promise(function (t, n) {if (k) wx.getNetworkType({ success: function success(n) {e._networkType = n.networkType, n.networkType === Xu ? (Y.warn("NetMonitor no network, please check!"), t([!1, n.networkType])) : (Y.info("NetMonitor networkType:".concat(n.networkType)), t([!0, n.networkType]));} });else if (window && window.fetch) fetch("".concat(ye(), "//webim-1252463788.file.myqcloud.com/assets/test/speed.xml?random=").concat(Math.random())).then(function (e) {e.ok ? t([!0, Ju]) : t([!1, Xu]);}).catch(function (e) {t([!1, Xu]);});else {var r = new XMLHttpRequest(),o = setTimeout(function () {Y.warn("NetMonitor fetch timeout. Probably no network, please check!"), r.abort(), e._networkType = Xu, t([!1, Xu]);}, e.maxWaitTime);r.onreadystatechange = function () {4 === r.readyState && (clearTimeout(o), 200 === r.status || 304 === r.status ? (this._networkType = Ju, t([!0, Ju])) : (Y.warn("NetMonitor fetch status:".concat(r.status, ". Probably no network, please check!")), this._networkType = Xu, t([!1, Xu])));}, r.open("GET", "".concat(ye(), "//webim-1252463788.file.myqcloud.com/assets/test/speed.xml?random=").concat(Math.random())), r.send();}});} }, { key: "getNetworkType", value: function value() {return this._networkType;} }, { key: "reset", value: function value() {this._networkType = "";} }]), e;}(),Zu = function () {function e(t) {var n = this;r(this, e), Z(t) ? (this._map = new Map(), t.forEach(function (e) {n._map.set(e, []);})) : Y.warn("AverageCalculator.constructor need keys");}return i(e, [{ key: "push", value: function value(e, t) {return !(ee(e) || !this._map.has(e) || !W(t)) && (this._map.get(e).push(t), !0);} }, { key: "getSize", value: function value(e) {return ee(e) || !this._map.has(e) ? -1 : this._map.get(e).length;} }, { key: "getAvg", value: function value(e) {if (ee(e) || !this._map.has(e)) return -1;var t = this._map.get(e),n = t.length;if (0 === n) return 0;var r = 0;return t.forEach(function (e) {r += e;}), t.length = 0, this._map.set(e, []), parseInt(r / n);} }, { key: "getMax", value: function value(e) {return ee(e) || !this._map.has(e) ? -1 : Math.max.apply(null, this._map.get(e));} }, { key: "getMin", value: function value(e) {return ee(e) || !this._map.has(e) ? -1 : Math.min.apply(null, this._map.get(e));} }, { key: "reset", value: function value() {this._map.forEach(function (e) {e.length = 0;});} }]), e;}(),ec = function () {function e(t) {var n = this;r(this, e), Z(t) ? (this._map = new Map(), t.forEach(function (e) {n._map.set(e, { totalCount: 0, successCount: 0 });})) : Y.warn("SuccessRateCalculator.constructor need keys");}return i(e, [{ key: "addTotalCount", value: function value(e) {return !(ee(e) || !this._map.has(e)) && (this._map.get(e).totalCount += 1, !0);} }, { key: "addSuccessCount", value: function value(e) {return !(ee(e) || !this._map.has(e)) && (this._map.get(e).successCount += 1, !0);} }, { key: "getSuccessRate", value: function value(e) {if (ee(e) || !this._map.has(e)) return -1;var t = this._map.get(e);if (0 === t.totalCount) return 1;var n = parseFloat((t.successCount / t.totalCount).toFixed(2));return t.totalCount = t.successCount = 0, n;} }, { key: "getTotalCount", value: function value(e) {return ee(e) || !this._map.has(e) ? -1 : this._map.get(e).totalCount;} }, { key: "reset", value: function value() {this._map.forEach(function (e) {e.totalCount = 0, e.successCount = 0;});} }]), e;}(),tc = function (e) {function t(e) {var n;return r(this, t), (n = m(this, l(t).call(this, e))).TABLE = "timwebsum", n.TAG = "im-ssolog-sumstat", n._items = [$o, Yo, zo], n._thresholdMap = new Map(), n._thresholdMap.set($o, 100), n._thresholdMap.set(Yo, 150), n._thresholdMap.set(zo, 15), n._lpID = "", n._platform = n.getPlatform(), n._lastReportTime = 0, n._statInfoArr = [], n._retryCount = 0, n._avgCalc = new Zu(n._items), n._successRateCalc = new ec(n._items), n.tim.innerEmitter.on(_o, n._onLoginSuccess, d(n)), n;}return c(t, e), i(t, [{ key: "_onLoginSuccess", value: function value() {var e = this,t = this.tim.storage,n = t.getItem(this.TAG, !1);Te(n) || (Y.log("SumStatController._onLoginSuccess get sumstatlog in storage, nums=" + n.length), n.forEach(function (t) {e._statInfoArr.pushIn(t);}), t.removeItem(this.TAG, !1));} }, { key: "recordLongPollingID", value: function value(e) {this._lpID = e;} }, { key: "addTotalCount", value: function value(e) {this._successRateCalc.addTotalCount(e) ? 1 === this._successRateCalc.getTotalCount(e) && (this._lastReportTime = Date.now()) : Y.warn("SumStatController.addTotalCount invalid key:", e);} }, { key: "addSuccessCount", value: function value(e) {this._successRateCalc.addSuccessCount(e) || Y.warn("SumStatController.addSuccessCount invalid key:", e);} }, { key: "addCost", value: function value(e, t) {this._avgCalc.push(e, t) ? (Y.debug("SumStatController.addCost", e, t, this._avgCalc.getSize(e)), this._avgCalc.getSize(e) >= this._thresholdMap.get(e) && this._report(e)) : Y.warn("SumStatController.addCost invalid key or cost:", e, t);} }, { key: "_getItemNum", value: function value(e) {switch (e) {case $o:return 1;case Yo:return 2;case zo:return 3;default:return 100;}} }, { key: "_getStatInfo", value: function value(e) {var t = null;return this._avgCalc.getSize(e) > 0 && (t = { SDKAppID: "".concat(this.tim.context.SDKAppID), version: "".concat("2.5.1"), tinyID: this.tim.context.tinyID, userID: this.tim.loginInfo.identifier, item: this._getItemNum(e), lpID: e === $o ? this._lpID : "", platform: this._platform, networkType: this.getNetworkType(), total: this._successRateCalc.getTotalCount(e), successRate: this._successRateCalc.getSuccessRate(e), avg: this._avgCalc.getAvg(e), timespan: Date.now() - this._lastReportTime, time: le() }), t;} }, { key: "_report", value: function value(e) {var t = this,n = [],r = null;ee(e) ? this._items.forEach(function (e) {null !== (r = t._getStatInfo(e)) && n.push(r);}) : null !== (r = this._getStatInfo(e)) && n.push(r), Y.debug("SumStatController._report", n), this._statInfoArr.length > 0 && (n = n.concat(this.statInfoArr), this._statInfoArr = []), this._doReport(n);} }, { key: "_doReport", value: function value(e) {var t = this;Te(e) ? Y.warn("SumStatController._doReport statInfoArr is empty, do nothing") : this.request({ name: "ssoSumStat", action: "create", param: { table: this.TABLE, report: e } }).then(function () {t._lastReportTime = Date.now(), t._retryCount > 0 && (Y.debug("SumStatController._doReport retry success"), t._retryCount = 0);}).catch(function (n) {Y.warn("SumStatController._doReport, online:".concat(t.getNetworkType(), " error:"), n, e), t._retryCount <= 1 ? setTimeout(function () {Y.info("SumStatController._doReport retry", e), t._retryCount += 1, t._doReport(e);}, 5e3) : (t._retryCount = 0, t._statInfoArr = t._statInfoArr.concat(e), t._flusgAtOnce());});} }, { key: "_flushAtOnce", value: function value() {var e = this.tim.storage,t = e.getItem(this.TAG, !1),n = this._statInfoArr;if (Te(t)) Y.log("SumStatController._flushAtOnce nums=" + n.length), e.setItem(this.TAG, n, !0, !1);else {var r = n.concat(t);r.length > 10 && (r = r.slice(0, 10)), Y.log("SumStatController._flushAtOnce nums=" + r.length), e.setItem(this.TAG, r, !0, !1);}this._statInfoArr = [];} }, { key: "reset", value: function value() {Y.info("SumStatController.reset"), this._report(), this._avgCalc.reset(), this._successRateCalc.reset();} }]), t;}(Go),nc = function () {function e() {r(this, e), this._funcMap = new Map();}return i(e, [{ key: "defense", value: function value(e, t) {var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0;if ("string" != typeof e) return null;if (0 === e.length) return null;if ("function" != typeof t) return null;if (this._funcMap.has(e) && this._funcMap.get(e).has(t)) return this._funcMap.get(e).get(t);this._funcMap.has(e) || this._funcMap.set(e, new Map());var r = null;return this._funcMap.get(e).has(t) ? r = this._funcMap.get(e).get(t) : (r = this._pack(t, n), this._funcMap.get(e).set(t, r)), r;} }, { key: "defenseOnce", value: function value(e) {var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : void 0;return "function" != typeof e ? null : this._pack(e, t);} }, { key: "find", value: function value(e, t) {return "string" != typeof e || 0 === e.length || "function" != typeof t ? null : this._funcMap.has(e) ? this._funcMap.get(e).has(t) ? this._funcMap.get(e).get(t) : (Y.log("SafetyCallback.find: 找不到 func —— ".concat(e, "/").concat("" !== t.name ? t.name : "[anonymous]")), null) : (Y.log("SafetyCallback.find: 找不到 eventName-".concat(e, " 对应的 func")), null);} }, { key: "delete", value: function value(e, t) {return "function" == typeof t && !!this._funcMap.has(e) && !!this._funcMap.get(e).has(t) && (this._funcMap.get(e).delete(t), 0 === this._funcMap.get(e).size && this._funcMap.delete(e), !0);} }, { key: "_pack", value: function value(e, t) {return function () {try {e.apply(t, Array.from(arguments));} catch (n) {console.error(n);}};} }]), e;}(),rc = function () {function t(e) {r(this, t);var n = new Qo();n.setMethod(Zo).setStart(), Po.mixin(this), this._initOptions(e), this._initMemberVariables(), this._initControllers(), this._initListener(), Qo.bindController(this.eventStatController), n.setCode(0).setText("mp=".concat(k, "-ua=").concat(w)).setEnd(), Y.info("SDK inWxMiniApp:".concat(k, ", SDKAppID:").concat(e.SDKAppID, ", UserAgent:").concat(w)), this._safetyCallbackFactory = new nc();}return i(t, [{ key: "login", value: function value(e) {return Y.time(Vo), this._ssoLog = new Qo(), this._ssoLog.setMethod(ei).setStart(), this.netMonitor.start(), this.loginInfo.identifier = e.identifier || e.userID, this.loginInfo.userSig = e.userSig, this.signController.login(this.loginInfo);} }, { key: "logout", value: function value() {var e = this.signController.logout();return this.resetSDK(), e;} }, { key: "on", value: function value(e, t, n) {Y.debug("on", "eventName:".concat(e)), this.outerEmitter.on(e, this._safetyCallbackFactory.defense(e, t, n), n);} }, { key: "once", value: function value(e, t, n) {Y.debug("once", "eventName:".concat(e)), this.outerEmitter.once(e, this._safetyCallbackFactory.defenseOnce(t, n), n || this);} }, { key: "off", value: function value(e, t, n, r) {Y.debug("off", "eventName:".concat(e));var o = this._safetyCallbackFactory.find(e, t);null !== o && (this.outerEmitter.off(e, o, n, r), this._safetyCallbackFactory.delete(e, t));} }, { key: "registerPlugin", value: function value(e) {var t = this;this.plugins || (this.plugins = {}), Object.keys(e).forEach(function (n) {t.plugins[n] = e[n];});} }, { key: "getPlugin", value: function value(e) {return this.plugins[e] || void 0;} }, { key: "setLogLevel", value: function value(e) {if (e <= 0) {console.log(["", " ________  ______  __       __  __       __  ________  _______", "|        \\|      \\|  \\     /  \\|  \\  _  |  \\|        \\|       \\", " \\$$$$$$$$ \\$$$$$$| $$\\   /  $$| $$ / \\ | $$| $$$$$$$$| $$$$$$$\\", "   | $$     | $$  | $$$\\ /  $$$| $$/  $\\| $$| $$__    | $$__/ $$", "   | $$     | $$  | $$$$\\  $$$$| $$  $$$\\ $$| $$  \\   | $$    $$", "   | $$     | $$  | $$\\$$ $$ $$| $$ $$\\$$\\$$| $$$$$   | $$$$$$$\\", "   | $$    _| $$_ | $$ \\$$$| $$| $$$$  \\$$$$| $$_____ | $$__/ $$", "   | $$   |   $$ \\| $$  \\$ | $$| $$$    \\$$$| $$     \\| $$    $$", "    \\$$    \\$$$$$$ \\$$      \\$$ \\$$      \\$$ \\$$$$$$$$ \\$$$$$$$", "", ""].join("\n")), console.log("%cIM 智能客服，随时随地解决您的问题 →_→ https://cloud.tencent.com/act/event/smarty-service?from=im-doc", "color:#ff0000");console.log(["", "参考以下文档，会更快解决问题哦！(#^.^#)\n", "SDK 更新日志: https://cloud.tencent.com/document/product/269/38492\n", "SDK 接口文档: https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html\n", "常见问题: https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/tutorial-01-faq.html\n", "反馈问题？戳我提 issue: https://github.com/tencentyun/TIMSDK/issues\n", "如果您需要在生产环境关闭上面的日志，请 tim.setLogLevel(1)\n"].join("\n"));}Y.setLevel(e);} }, { key: "downloadLog", value: function value() {var e = document.createElement("a"),t = new Date(),n = new Blob(this.getLog());e.download = "TIM-" + t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + "-" + this.loginInfo.SDKAppID + "-" + this.context.identifier + ".txt", e.href = URL.createObjectURL(n), e.click(), URL.revokeObjectURL(n);} }, { key: "destroy", value: function value() {this.logout(), this.outerEmitter.emit(e.SDK_DESTROY, { SDKAppID: this.loginInfo.SDKAppID });} }, { key: "createTextMessage", value: function value(e) {return this.messageController.createTextMessage(e);} }, { key: "createImageMessage", value: function value(e) {return this.messageController.createImageMessage(e);} }, { key: "createAudioMessage", value: function value(e) {return this.messageController.createAudioMessage(e);} }, { key: "createVideoMessage", value: function value(e) {return this.messageController.createVideoMessage(e);} }, { key: "createCustomMessage", value: function value(e) {return this.messageController.createCustomMessage(e);} }, { key: "createFaceMessage", value: function value(e) {return this.messageController.createFaceMessage(e);} }, { key: "createFileMessage", value: function value(e) {return this.messageController.createFileMessage(e);} }, { key: "sendMessage", value: function value(e) {return e instanceof Rr ? this.messageController.sendMessageInstance(e) : Ko(new at({ code: yt, message: wn }));} }, { key: "revokeMessage", value: function value(e) {return this.messageController.revokeMessage(e);} }, { key: "resendMessage", value: function value(e) {return this.messageController.resendMessage(e);} }, { key: "getMessageList", value: function value(e) {return this.messageController.getMessageList(e);} }, { key: "setMessageRead", value: function value(e) {return this.messageController.setMessageRead(e);} }, { key: "getConversationList", value: function value() {return this.conversationController.getConversationList();} }, { key: "getConversationProfile", value: function value(e) {return this.conversationController.getConversationProfile(e);} }, { key: "deleteConversation", value: function value(e) {return this.conversationController.deleteConversation(e);} }, { key: "getMyProfile", value: function value() {return this.userController.getMyProfile();} }, { key: "getUserProfile", value: function value(e) {return this.userController.getUserProfile(e);} }, { key: "updateMyProfile", value: function value(e) {return this.userController.updateMyProfile(e);} }, { key: "getFriendList", value: function value() {return this.userController.getFriendList();} }, { key: "deleteFriend", value: function value(e) {return this.userController.deleteFriend(e);} }, { key: "getBlacklist", value: function value() {return this.userController.getBlacklist();} }, { key: "addToBlacklist", value: function value(e) {return this.userController.addBlacklist(e);} }, { key: "removeFromBlacklist", value: function value(e) {return this.userController.deleteBlacklist(e);} }, { key: "getGroupList", value: function value(e) {return this.groupController.getGroupList(e);} }, { key: "getGroupProfile", value: function value(e) {return this.groupController.getGroupProfile(e);} }, { key: "createGroup", value: function value(e) {return this.groupController.createGroup(e);} }, { key: "dismissGroup", value: function value(e) {return this.groupController.dismissGroup(e);} }, { key: "updateGroupProfile", value: function value(e) {return this.groupController.updateGroupProfile(e);} }, { key: "joinGroup", value: function value(e) {return this.groupController.joinGroup(e);} }, { key: "quitGroup", value: function value(e) {return this.groupController.quitGroup(e);} }, { key: "searchGroupByID", value: function value(e) {return this.groupController.searchGroupByID(e);} }, { key: "changeGroupOwner", value: function value(e) {return this.groupController.changeGroupOwner(e);} }, { key: "handleGroupApplication", value: function value(e) {return this.groupController.handleGroupApplication(e);} }, { key: "setMessageRemindType", value: function value(e) {return this.groupController.setMessageRemindType(e);} }, { key: "getGroupMemberList", value: function value(e) {return this.groupController.getGroupMemberList(e);} }, { key: "getGroupMemberProfile", value: function value(e) {return this.groupController.getGroupMemberProfile(e);} }, { key: "addGroupMember", value: function value(e) {return this.groupController.addGroupMember(e);} }, { key: "deleteGroupMember", value: function value(e) {return this.groupController.deleteGroupMember(e);} }, { key: "setGroupMemberMuteTime", value: function value(e) {return this.groupController.setGroupMemberMuteTime(e);} }, { key: "setGroupMemberRole", value: function value(e) {return this.groupController.setGroupMemberRole(e);} }, { key: "setGroupMemberNameCard", value: function value(e) {return this.groupController.setGroupMemberNameCard(e);} }, { key: "setGroupMemberCustomField", value: function value(e) {return this.groupController.setGroupMemberCustomField(e);} }, { key: "_initOptions", value: function value(e) {this.plugins = {}, this.loginInfo = { SDKAppID: e.SDKAppID || null, accountType: he(), identifier: null, userSig: null }, this.options = { runLoopNetType: e.runLoopNetType || $e, enablePointer: e.enablePointer || !1 };} }, { key: "_initMemberVariables", value: function value() {this.context = {}, this.innerEmitter = new ku(), this.outerEmitter = new ku(), Ho(this.outerEmitter), this.packageConfig = new Au(this), this.storage = new Eu(this), this.netMonitor = new Qu(), this.outerEmitter._emit = this.outerEmitter.emit, this.outerEmitter.emit = function (e, t) {var n = arguments[0],r = [n, { name: arguments[0], data: arguments[1] }];Y.debug("emit outer event:".concat(n), r[1]), this.outerEmitter._emit.apply(this.outerEmitter, r);}.bind(this), this.innerEmitter._emit = this.innerEmitter.emit, this.innerEmitter.emit = function (e, t) {var n;Q(arguments[1]) && arguments[1].data ? (Y.warn("inner eventData has data property, please check!"), n = [e, { name: arguments[0], data: arguments[1].data }]) : n = [e, { name: arguments[0], data: arguments[1] }], Y.debug("emit inner event:".concat(e), n[1]), this.innerEmitter._emit.apply(this.innerEmitter, n);}.bind(this);} }, { key: "_initControllers", value: function value() {this.exceptionController = new Xa(this), this.connectionController = new Wa(this), this.contextController = new Uo(this), this.context = this.contextController.getContext(), this.signController = new bi(this), this.messageController = new yu(this), this.conversationController = new lu(this), this.userController = new iu(this), this.groupController = new Su(this), this.notificationController = new Nu(this), this.bigDataHallwayController = new Pu(this), this.statusController = new Du(this), this.uploadController = new bu(this), this.eventStatController = new Wu(this), this.sumStatController = new tc(this), this.mtaReportController = new Yu(this), this._initReadyListener();} }, { key: "_initListener", value: function value() {var e = this;if (this.innerEmitter.on(ro, this._onSlowStart, this), k && "function" == typeof wx.onAppShow && "function" == typeof wx.onAppHide) {var t = null;wx.onAppHide(function () {(t = new Qo()).setMethod(Ni).setStart();}), wx.onAppShow(function () {null !== t && t.setCode(0).setNetworkType(e.netMonitor.getNetworkType()).setEnd();});}} }, { key: "_initReadyListener", value: function value() {for (var e = this, t = this.readyList, n = 0, r = t.length; n < r; n++) {this[t[n]].ready(function () {return e._readyHandle();});}} }, { key: "_onSlowStart", value: function value() {Y.log("slow start longpolling..."), this.resetSDK(), this.login(this.loginInfo);} }, { key: "resetSDK", value: function value() {var t = this;this.initList.forEach(function (e) {t[e].reset && t[e].reset();}), this.netMonitor.reset(), this.storage.reset(), this.resetReady(), this._initReadyListener(), this.outerEmitter.emit(e.SDK_NOT_READY);} }, { key: "_readyHandle", value: function value() {for (var t = this.readyList, n = !0, r = 0, o = t.length; r < o; r++) {if (!this[t[r]].isReady()) {n = !1;break;}}if (n) {var i = Y.timeEnd(Vo);Y.warn("SDK is ready. cost=".concat(i, "ms")), this.triggerReady(), this.innerEmitter.emit(Ao), this.outerEmitter.emit(e.SDK_READY), this._ssoLog.setCode(0).setNetworkType(this.netMonitor.getNetworkType()).setText(i).setEnd();}} }]), t;}();rc.prototype.readyList = ["conversationController"], rc.prototype.initList = ["exceptionController", "connectionController", "signController", "contextController", "messageController", "conversationController", "userController", "groupController", "notificationController", "eventStatController", "sumStatController"];var oc = { login: "login", on: "on", off: "off", ready: "ready", setLogLevel: "setLogLevel", joinGroup: "joinGroup", quitGroup: "quitGroup", registerPlugin: "registerPlugin" };function ic(e, t) {return !(!e.isReady() && void 0 === oc[t]) || (e.innerEmitter.emit(So, new at({ code: dn, message: "".concat(t, " ").concat(Mr, "，请参考 https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/module-EVENT.html#.SDK_READY") })), !1);}var sc = {},ac = {};return ac.create = function (t) {if (t.SDKAppID && sc[t.SDKAppID]) return sc[t.SDKAppID];Y.log("TIM.create");var n = new rc(t);n.on(e.SDK_DESTROY, function (e) {sc[e.data.SDKAppID] = null, delete sc[e.data.SDKAppID];});var r = function (e) {var t = Object.create(null);return Object.keys(Lr).forEach(function (n) {if (e[n]) {var r = Lr[n],o = new _();t[r] = function () {var t = Array.from(arguments);return o.use(function (t, r) {if (ic(e, n)) return r();}).use(function (e, t) {if (!0 === Ee(e, Or[n], r)) return t();}).use(function (t, r) {return e[n].apply(e, t);}), o.run(t);};}}), t;}(n);return sc[t.SDKAppID] = r, Y.log("TIM.create ok"), r;}, ac.TYPES = t, ac.EVENT = e, ac.VERSION = "2.5.1", Y.log("TIM.VERSION: ".concat(ac.VERSION)), ac;});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! (webpack)/buildin/global.js */ 3)))

/***/ }),

/***/ 25:
/*!**********************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/store/modules/group.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}var groupModules = {
  state: {
    groupList: [],
    currentGroupMemberList: [],
    count: 15,
    isLoading: false },

  getters: {
    hasGroupList: function hasGroupList(state) {return state.groupList.length > 0;} },

  mutations: {
    updateGroupList: function updateGroupList(state, groupList) {
      state.groupList = groupList;
    },
    updateCurrentGroupMemberList: function updateCurrentGroupMemberList(state, groupMemberList) {
      state.currentGroupMemberList = [].concat(_toConsumableArray(state.currentGroupMemberList), _toConsumableArray(groupMemberList));
    },
    resetGroup: function resetGroup(state) {
      state.groupList = [];
      state.currentGroupProfile = {};
      state.currentGroupMemberList = [];
    },
    resetCurrentMemberList: function resetCurrentMemberList(state) {
      state.currentGroupMemberList = [];
    } },

  actions: {
    getGroupMemberList: function getGroupMemberList(context) {var _context$rootState$co =
      context.rootState.conversation.currentConversation.groupProfile,memberNum = _context$rootState$co.memberNum,groupID = _context$rootState$co.groupID;var _context$state =
      context.state,count = _context$state.count,isLoading = _context$state.isLoading;
      var offset = context.state.currentGroupMemberList.length;
      var notCompleted = offset < memberNum;
      if (notCompleted) {
        if (!isLoading) {
          context.state.isLoading = true;
          wx.$app.getGroupMemberList({ groupID: groupID, offset: offset, count: count }).then(function (res) {
            context.commit('updateCurrentGroupMemberList', res.data.memberList);
            context.state.isLoading = false;
          }).catch(function (err) {
            console.log(err);
          });
        } else {
          wx.showToast({
            title: '你拉的太快了',
            icon: 'none',
            duration: 500 });

        }
      } else {
        wx.showToast({
          title: '没有更多啦',
          icon: 'none',
          duration: 1500 });

      }
    } } };var _default =



groupModules;exports.default = _default;

/***/ }),

/***/ 26:
/*!*********************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/store/modules/user.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var userModules = {
  state: {
    myInfo: {},
    userProfile: {},
    blacklist: [] },

  getters: {
    myInfo: function myInfo(state) {return state.myInfo;},
    userProfile: function userProfile(state) {return state.userProfile;} },

  mutations: {
    updateMyInfo: function updateMyInfo(state, myInfo) {
      state.myInfo = myInfo;
    },
    updateUserProfile: function updateUserProfile(state, userProfile) {
      state.userProfile = userProfile;
    },
    setBlacklist: function setBlacklist(state, blacklist) {
      state.blacklist = blacklist;
    },
    updateBlacklist: function updateBlacklist(state, blacklist) {
      state.blacklist.push(blacklist);
    },
    resetUser: function resetUser(state) {
      state.blacklist = [];
      state.userProfile = {};
      state.myInfo = {};
    } } };var _default =



userModules;exports.default = _default;

/***/ }),

/***/ 27:
/*!***********************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/store/modules/global.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var globalModules = {
  state: {
    isSdkReady: false,
    isCalling: false },

  getters: {
    isSdkReady: function isSdkReady(state) {return state.isSdkReady;},
    isCalling: function isCalling(state) {return state.isCalling;} },

  mutations: {
    showToast: function showToast(state, payload) {
      wx.showToast({
        title: payload.title,
        icon: payload.icon || 'none',
        duration: payload.duration || 800 });

    },
    setSdkReady: function setSdkReady(state, payload) {
      state.isSdkReady = payload;
    },
    setCalling: function setCalling(state, payload) {
      state.isCalling = payload;
    } },

  actions: {
    resetStore: function resetStore(context) {
      context.commit('resetGroup');
      context.commit('resetUser');
      context.commit('resetCurrentConversation');
      context.commit('resetAllConversation');
    } } };var _default =



globalModules;exports.default = _default;

/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 4:
/*!**********************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/pages.json ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 42:
/*!***************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/libs/amap-wx.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function AMapWX(a) {this.key = a.key, this.requestConfig = { key: a.key, s: "rsx", platform: "WXJS", appname: a.key, sdkversion: "1.2.0", logversion: "2.0" };}AMapWX.prototype.getWxLocation = function (a, b) {wx.getLocation({ type: "gcj02", success: function success(a) {var c = a.longitude + "," + a.latitude;wx.setStorage({ key: "userLocation", data: c }), b(c);}, fail: function fail(c) {wx.getStorage({ key: "userLocation", success: function success(a) {a.data && b(a.data);} }), a.fail({ errCode: "0", errMsg: c.errMsg || "" });} });}, AMapWX.prototype.getRegeo = function (a) {function c(c) {var d = b.requestConfig;wx.request({ url: "https://restapi.amap.com/v3/geocode/regeo", data: { key: b.key, location: c, extensions: "all", s: d.s, platform: d.platform, appname: b.key, sdkversion: d.sdkversion, logversion: d.logversion }, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {var d, e, f, g, h, i, j, k, l;b.data.status && "1" == b.data.status ? (d = b.data.regeocode, e = d.addressComponent, f = [], g = "", d && d.roads[0] && d.roads[0].name && (g = d.roads[0].name + "附近"), h = c.split(",")[0], i = c.split(",")[1], d.pois && d.pois[0] && (g = d.pois[0].name + "附近", j = d.pois[0].location, j && (h = parseFloat(j.split(",")[0]), i = parseFloat(j.split(",")[1]))), e.provice && f.push(e.provice), e.city && f.push(e.city), e.district && f.push(e.district), e.streetNumber && e.streetNumber.street && e.streetNumber.number ? (f.push(e.streetNumber.street), f.push(e.streetNumber.number)) : (k = "", d && d.roads[0] && d.roads[0].name && (k = d.roads[0].name), f.push(k)), f = f.join(""), l = [{ iconPath: a.iconPath, width: a.iconWidth, height: a.iconHeight, name: f, desc: g, longitude: h, latitude: i, id: 0, regeocodeData: d }], a.success(l)) : a.fail({ errCode: b.data.infocode, errMsg: b.data.info });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}var b = this;a.location ? c(a.location) : b.getWxLocation(a, function (a) {c(a);});}, AMapWX.prototype.getWeather = function (a) {function d(d) {var e = "base";a.type && "forecast" == a.type && (e = "all"), wx.request({ url: "https://restapi.amap.com/v3/weather/weatherInfo", data: { key: b.key, city: d, extensions: e, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion }, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {function c(a) {var b = { city: { text: "城市", data: a.city }, weather: { text: "天气", data: a.weather }, temperature: { text: "温度", data: a.temperature }, winddirection: { text: "风向", data: a.winddirection + "风" }, windpower: { text: "风力", data: a.windpower + "级" }, humidity: { text: "湿度", data: a.humidity + "%" } };return b;}var d, e;b.data.status && "1" == b.data.status ? b.data.lives ? (d = b.data.lives, d && d.length > 0 && (d = d[0], e = c(d), e["liveData"] = d, a.success(e))) : b.data.forecasts && b.data.forecasts[0] && a.success({ forecast: b.data.forecasts[0] }) : a.fail({ errCode: b.data.infocode, errMsg: b.data.info });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}function e(e) {wx.request({ url: "https://restapi.amap.com/v3/geocode/regeo", data: { key: b.key, location: e, extensions: "all", s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion }, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {var c, e;b.data.status && "1" == b.data.status ? (e = b.data.regeocode, e.addressComponent ? c = e.addressComponent.adcode : e.aois && e.aois.length > 0 && (c = e.aois[0].adcode), d(c)) : a.fail({ errCode: b.data.infocode, errMsg: b.data.info });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}var b = this,c = b.requestConfig;a.city ? d(a.city) : b.getWxLocation(a, function (a) {e(a);});}, AMapWX.prototype.getPoiAround = function (a) {function d(d) {var e = { key: b.key, location: d, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion };a.querytypes && (e["types"] = a.querytypes), a.querykeywords && (e["keywords"] = a.querykeywords), wx.request({ url: "https://restapi.amap.com/v3/place/around", data: e, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {var c, d, e, f;if (b.data.status && "1" == b.data.status) {if (b = b.data, b && b.pois) {for (c = [], d = 0; d < b.pois.length; d++) {e = 0 == d ? a.iconPathSelected : a.iconPath, c.push({ latitude: parseFloat(b.pois[d].location.split(",")[1]), longitude: parseFloat(b.pois[d].location.split(",")[0]), iconPath: e, width: 22, height: 32, id: d, name: b.pois[d].name, address: b.pois[d].address });}f = { markers: c, poisData: b.pois }, a.success(f);}} else a.fail({ errCode: b.data.infocode, errMsg: b.data.info });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}var b = this,c = b.requestConfig;a.location ? d(a.location) : b.getWxLocation(a, function (a) {d(a);});}, AMapWX.prototype.getStaticmap = function (a) {function f(b) {c.push("location=" + b), a.zoom && c.push("zoom=" + a.zoom), a.size && c.push("size=" + a.size), a.scale && c.push("scale=" + a.scale), a.markers && c.push("markers=" + a.markers), a.labels && c.push("labels=" + a.labels), a.paths && c.push("paths=" + a.paths), a.traffic && c.push("traffic=" + a.traffic);var e = d + c.join("&");a.success({ url: e });}var e,b = this,c = [],d = "https://restapi.amap.com/v3/staticmap?";c.push("key=" + b.key), e = b.requestConfig, c.push("s=" + e.s), c.push("platform=" + e.platform), c.push("appname=" + e.appname), c.push("sdkversion=" + e.sdkversion), c.push("logversion=" + e.logversion), a.location ? f(a.location) : b.getWxLocation(a, function (a) {f(a);});}, AMapWX.prototype.getInputtips = function (a) {var b = this,c = b.requestConfig,d = { key: b.key, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion };a.location && (d["location"] = a.location), a.keywords && (d["keywords"] = a.keywords), a.type && (d["type"] = a.type), a.city && (d["city"] = a.city), a.citylimit && (d["citylimit"] = a.citylimit), wx.request({ url: "https://restapi.amap.com/v3/assistant/inputtips", data: d, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {b && b.data && b.data.tips && a.success({ tips: b.data.tips });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}, AMapWX.prototype.getDrivingRoute = function (a) {var b = this,c = b.requestConfig,d = { key: b.key, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion };a.origin && (d["origin"] = a.origin), a.destination && (d["destination"] = a.destination), a.strategy && (d["strategy"] = a.strategy), a.waypoints && (d["waypoints"] = a.waypoints), a.avoidpolygons && (d["avoidpolygons"] = a.avoidpolygons), a.avoidroad && (d["avoidroad"] = a.avoidroad), wx.request({ url: "https://restapi.amap.com/v3/direction/driving", data: d, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {b && b.data && b.data.route && a.success({ paths: b.data.route.paths, taxi_cost: b.data.route.taxi_cost || "" });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}, AMapWX.prototype.getWalkingRoute = function (a) {var b = this,c = b.requestConfig,d = { key: b.key, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion };a.origin && (d["origin"] = a.origin), a.destination && (d["destination"] = a.destination), wx.request({ url: "https://restapi.amap.com/v3/direction/walking", data: d, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {b && b.data && b.data.route && a.success({ paths: b.data.route.paths });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}, AMapWX.prototype.getTransitRoute = function (a) {var b = this,c = b.requestConfig,d = { key: b.key, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion };a.origin && (d["origin"] = a.origin), a.destination && (d["destination"] = a.destination), a.strategy && (d["strategy"] = a.strategy), a.city && (d["city"] = a.city), a.cityd && (d["cityd"] = a.cityd), wx.request({ url: "https://restapi.amap.com/v3/direction/transit/integrated", data: d, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {if (b && b.data && b.data.route) {var c = b.data.route;a.success({ distance: c.distance || "", taxi_cost: c.taxi_cost || "", transits: c.transits });}}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}, AMapWX.prototype.getRidingRoute = function (a) {var b = this,c = b.requestConfig,d = { key: b.key, s: c.s, platform: c.platform, appname: b.key, sdkversion: c.sdkversion, logversion: c.logversion };a.origin && (d["origin"] = a.origin), a.destination && (d["destination"] = a.destination), wx.request({ url: "https://restapi.amap.com/v4/direction/bicycling", data: d, method: "GET", header: { "content-type": "application/json" }, success: function success(b) {b && b.data && b.data.data && a.success({ paths: b.data.data.paths });}, fail: function fail(b) {a.fail({ errCode: "0", errMsg: b.errMsg || "" });} });}, module.exports.AMapWX = AMapWX;

/***/ }),

/***/ 43:
/*!**************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/libs/config.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var config = {
  key: '2816331be6c589a2c929931012a47536' };


module.exports.Config = config;

/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 52:
/*!***************************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/libs/GenerateTestUserSig.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.genTestUserSig = genTestUserSig;exports.SDKAPPID = void 0;
var _libGenerateTestUsersigEsMin = _interopRequireDefault(__webpack_require__(/*! ./lib-generate-test-usersig-es.min.js */ 53));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /*eslint-disable*/

var _SDKAPPID = 0;exports.SDKAPPID = _SDKAPPID;
var _SECRETKEY = '';
/*
                      * Module:   GenerateTestUserSig
                      *
                      * Function: 用于生成测试用的 UserSig，UserSig 是腾讯云为其云服务设计的一种安全保护签名。
                      *           其计算方法是对 SDKAppID、UserID 和 EXPIRETIME 进行加密，加密算法为 HMAC-SHA256。
                      *
                      * Attention: 请不要将如下代码发布到您的线上正式版本的 App 中，原因如下：
                      *
                      *            本文件中的代码虽然能够正确计算出 UserSig，但仅适合快速调通 SDK 的基本功能，不适合线上产品，
                      *            这是因为客户端代码中的 SECRETKEY 很容易被反编译逆向破解，尤其是 Web 端的代码被破解的难度几乎为零。
                      *            一旦您的密钥泄露，攻击者就可以计算出正确的 UserSig 来盗用您的腾讯云流量。
                      *
                      *            正确的做法是将 UserSig 的计算代码和加密密钥放在您的业务服务器上，然后由 App 按需向您的服务器获取实时算出的 UserSig。
                      *            由于破解服务器的成本要高于破解客户端 App，所以服务器计算的方案能够更好地保护您的加密密钥。
                      *
                      * Reference：https://cloud.tencent.com/document/product/647/17275#Server
                      */
function genTestUserSig(userID) {
  /**
                                  * 腾讯云 SDKAppId，需要替换为您自己账号下的 SDKAppId。
                                  *
                                  * 进入腾讯云实时音视频[控制台](https://console.cloud.tencent.com/rav ) 创建应用，即可看到 SDKAppId，
                                  * 它是腾讯云用于区分客户的唯一标识。
                                  */
  var SDKAPPID = _SDKAPPID;

  /**
                             * 签名过期时间，建议不要设置的过短
                             * <p>
                             * 时间单位：秒
                             * 默认时间：7 x 24 x 60 x 60 = 604800 = 7 天
                             */
  var EXPIRETIME = 604800;


  /**
                            * 计算签名用的加密密钥，获取步骤如下：
                            *
                            * step1. 进入腾讯云实时音视频[控制台](https://console.cloud.tencent.com/rav )，如果还没有应用就创建一个，
                            * step2. 单击“应用配置”进入基础配置页面，并进一步找到“帐号体系集成”部分。
                            * step3. 点击“查看密钥”按钮，就可以看到计算 UserSig 使用的加密的密钥了，请将其拷贝并复制到如下的变量中
                            *
                            * 注意：该方案仅适用于调试Demo，正式上线前请将 UserSig 计算代码和密钥迁移到您的后台服务器上，以避免加密密钥泄露导致的流量盗用。
                            * 文档：https://cloud.tencent.com/document/product/647/17275#Server
                            */
  var SECRETKEY = _SECRETKEY;

  var generator = new _libGenerateTestUsersigEsMin.default(SDKAPPID, SECRETKEY, EXPIRETIME);
  var userSig = generator.genTestUserSig(userID);
  return {
    sdkappid: SDKAPPID,
    userSig: userSig };

}

/***/ }),

/***/ 53:
/*!****************************************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/libs/lib-generate-test-usersig-es.min.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /*eslint-disable*/
var e = "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {},t = [],r = [],n = "undefined" != typeof Uint8Array ? Uint8Array : Array,i = !1;function o() {i = !0;for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = 0, o = e.length; n < o; ++n) {t[n] = e[n], r[e.charCodeAt(n)] = n;}r["-".charCodeAt(0)] = 62, r["_".charCodeAt(0)] = 63;}function a(e, r, n) {for (var i, o, a = [], s = r; s < n; s += 3) {i = (e[s] << 16) + (e[s + 1] << 8) + e[s + 2], a.push(t[(o = i) >> 18 & 63] + t[o >> 12 & 63] + t[o >> 6 & 63] + t[63 & o]);}return a.join("");}function s(e) {var r;i || o();for (var n = e.length, s = n % 3, h = "", l = [], f = 0, c = n - s; f < c; f += 16383) {l.push(a(e, f, f + 16383 > c ? c : f + 16383));}return 1 === s ? (r = e[n - 1], h += t[r >> 2], h += t[r << 4 & 63], h += "==") : 2 === s && (r = (e[n - 2] << 8) + e[n - 1], h += t[r >> 10], h += t[r >> 4 & 63], h += t[r << 2 & 63], h += "="), l.push(h), l.join("");}function h(e, t, r, n, i) {var o,a,s = 8 * i - n - 1,h = (1 << s) - 1,l = h >> 1,f = -7,c = r ? i - 1 : 0,u = r ? -1 : 1,d = e[t + c];for (c += u, o = d & (1 << -f) - 1, d >>= -f, f += s; f > 0; o = 256 * o + e[t + c], c += u, f -= 8) {;}for (a = o & (1 << -f) - 1, o >>= -f, f += n; f > 0; a = 256 * a + e[t + c], c += u, f -= 8) {;}if (0 === o) o = 1 - l;else {if (o === h) return a ? NaN : 1 / 0 * (d ? -1 : 1);a += Math.pow(2, n), o -= l;}return (d ? -1 : 1) * a * Math.pow(2, o - n);}function l(e, t, r, n, i, o) {var a,s,h,l = 8 * o - i - 1,f = (1 << l) - 1,c = f >> 1,u = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,d = n ? 0 : o - 1,p = n ? 1 : -1,_ = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, a = f) : (a = Math.floor(Math.log(t) / Math.LN2), t * (h = Math.pow(2, -a)) < 1 && (a--, h *= 2), (t += a + c >= 1 ? u / h : u * Math.pow(2, 1 - c)) * h >= 2 && (a++, h /= 2), a + c >= f ? (s = 0, a = f) : a + c >= 1 ? (s = (t * h - 1) * Math.pow(2, i), a += c) : (s = t * Math.pow(2, c - 1) * Math.pow(2, i), a = 0)); i >= 8; e[r + d] = 255 & s, d += p, s /= 256, i -= 8) {;}for (a = a << i | s, l += i; l > 0; e[r + d] = 255 & a, d += p, a /= 256, l -= 8) {;}e[r + d - p] |= 128 * _;}var f = {}.toString,c = Array.isArray || function (e) {return "[object Array]" == f.call(e);};function u() {return p.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;}function d(e, t) {if (u() < t) throw new RangeError("Invalid typed array length");return p.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = p.prototype : (null === e && (e = new p(t)), e.length = t), e;}function p(e, t, r) {if (!(p.TYPED_ARRAY_SUPPORT || this instanceof p)) return new p(e, t, r);if ("number" == typeof e) {if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");return v(this, e);}return _(this, e, t, r);}function _(e, t, r, n) {if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function (e, t, r, n) {if (t.byteLength, r < 0 || t.byteLength < r) throw new RangeError("'offset' is out of bounds");if (t.byteLength < r + (n || 0)) throw new RangeError("'length' is out of bounds");t = void 0 === r && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t, r) : new Uint8Array(t, r, n);p.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = p.prototype : e = w(e, t);return e;}(e, t, r, n) : "string" == typeof t ? function (e, t, r) {"string" == typeof r && "" !== r || (r = "utf8");if (!p.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');var n = 0 | m(t, r),i = (e = d(e, n)).write(t, r);i !== n && (e = e.slice(0, i));return e;}(e, t, r) : function (e, t) {if (y(t)) {var r = 0 | b(t.length);return 0 === (e = d(e, r)).length ? e : (t.copy(e, 0, 0, r), e);}if (t) {if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || (n = t.length) != n ? d(e, 0) : w(e, t);if ("Buffer" === t.type && c(t.data)) return w(e, t.data);}var n;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");}(e, t);}function g(e) {if ("number" != typeof e) throw new TypeError('"size" argument must be a number');if (e < 0) throw new RangeError('"size" argument must not be negative');}function v(e, t) {if (g(t), e = d(e, t < 0 ? 0 : 0 | b(t)), !p.TYPED_ARRAY_SUPPORT) for (var r = 0; r < t; ++r) {e[r] = 0;}return e;}function w(e, t) {var r = t.length < 0 ? 0 : 0 | b(t.length);e = d(e, r);for (var n = 0; n < r; n += 1) {e[n] = 255 & t[n];}return e;}function b(e) {if (e >= u()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + u().toString(16) + " bytes");return 0 | e;}function y(e) {return !(null == e || !e._isBuffer);}function m(e, t) {if (y(e)) return e.length;if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;"string" != typeof e && (e = "" + e);var r = e.length;if (0 === r) return 0;for (var n = !1;;) {switch (t) {case "ascii":case "latin1":case "binary":return r;case "utf8":case "utf-8":case void 0:return q(e).length;case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return 2 * r;case "hex":return r >>> 1;case "base64":return V(e).length;default:if (n) return q(e).length;t = ("" + t).toLowerCase(), n = !0;}}}function k(e, t, r) {var n = !1;if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";if ((r >>>= 0) <= (t >>>= 0)) return "";for (e || (e = "utf8");;) {switch (e) {case "hex":return O(this, t, r);case "utf8":case "utf-8":return C(this, t, r);case "ascii":return I(this, t, r);case "latin1":case "binary":return P(this, t, r);case "base64":return M(this, t, r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return U(this, t, r);default:if (n) throw new TypeError("Unknown encoding: " + e);e = (e + "").toLowerCase(), n = !0;}}}function E(e, t, r) {var n = e[t];e[t] = e[r], e[r] = n;}function S(e, t, r, n, i) {if (0 === e.length) return -1;if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, isNaN(r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {if (i) return -1;r = e.length - 1;} else if (r < 0) {if (!i) return -1;r = 0;}if ("string" == typeof t && (t = p.from(t, n)), y(t)) return 0 === t.length ? -1 : x(e, t, r, n, i);if ("number" == typeof t) return t &= 255, p.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : x(e, [t], r, n, i);throw new TypeError("val must be string, number or Buffer");}function x(e, t, r, n, i) {var o,a = 1,s = e.length,h = t.length;if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {if (e.length < 2 || t.length < 2) return -1;a = 2, s /= 2, h /= 2, r /= 2;}function l(e, t) {return 1 === a ? e[t] : e.readUInt16BE(t * a);}if (i) {var f = -1;for (o = r; o < s; o++) {if (l(e, o) === l(t, -1 === f ? 0 : o - f)) {if (-1 === f && (f = o), o - f + 1 === h) return f * a;} else -1 !== f && (o -= o - f), f = -1;}} else for (r + h > s && (r = s - h), o = r; o >= 0; o--) {for (var c = !0, u = 0; u < h; u++) {if (l(e, o + u) !== l(t, u)) {c = !1;break;}}if (c) return o;}return -1;}function R(e, t, r, n) {r = Number(r) || 0;var i = e.length - r;n ? (n = Number(n)) > i && (n = i) : n = i;var o = t.length;if (o % 2 != 0) throw new TypeError("Invalid hex string");n > o / 2 && (n = o / 2);for (var a = 0; a < n; ++a) {var s = parseInt(t.substr(2 * a, 2), 16);if (isNaN(s)) return a;e[r + a] = s;}return a;}function A(e, t, r, n) {return G(q(t, e.length - r), e, r, n);}function B(e, t, r, n) {return G(function (e) {for (var t = [], r = 0; r < e.length; ++r) {t.push(255 & e.charCodeAt(r));}return t;}(t), e, r, n);}function z(e, t, r, n) {return B(e, t, r, n);}function L(e, t, r, n) {return G(V(t), e, r, n);}function T(e, t, r, n) {return G(function (e, t) {for (var r, n, i, o = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) {r = e.charCodeAt(a), n = r >> 8, i = r % 256, o.push(i), o.push(n);}return o;}(t, e.length - r), e, r, n);}function M(e, t, r) {return 0 === t && r === e.length ? s(e) : s(e.slice(t, r));}function C(e, t, r) {r = Math.min(e.length, r);for (var n = [], i = t; i < r;) {var o,a,s,h,l = e[i],f = null,c = l > 239 ? 4 : l > 223 ? 3 : l > 191 ? 2 : 1;if (i + c <= r) switch (c) {case 1:l < 128 && (f = l);break;case 2:128 == (192 & (o = e[i + 1])) && (h = (31 & l) << 6 | 63 & o) > 127 && (f = h);break;case 3:o = e[i + 1], a = e[i + 2], 128 == (192 & o) && 128 == (192 & a) && (h = (15 & l) << 12 | (63 & o) << 6 | 63 & a) > 2047 && (h < 55296 || h > 57343) && (f = h);break;case 4:o = e[i + 1], a = e[i + 2], s = e[i + 3], 128 == (192 & o) && 128 == (192 & a) && 128 == (192 & s) && (h = (15 & l) << 18 | (63 & o) << 12 | (63 & a) << 6 | 63 & s) > 65535 && h < 1114112 && (f = h);}null === f ? (f = 65533, c = 1) : f > 65535 && (f -= 65536, n.push(f >>> 10 & 1023 | 55296), f = 56320 | 1023 & f), n.push(f), i += c;}return function (e) {var t = e.length;if (t <= D) return String.fromCharCode.apply(String, e);var r = "",n = 0;for (; n < t;) {r += String.fromCharCode.apply(String, e.slice(n, n += D));}return r;}(n);}p.TYPED_ARRAY_SUPPORT = void 0 === e.TYPED_ARRAY_SUPPORT || e.TYPED_ARRAY_SUPPORT, p.poolSize = 8192, p._augment = function (e) {return e.__proto__ = p.prototype, e;}, p.from = function (e, t, r) {return _(null, e, t, r);}, p.TYPED_ARRAY_SUPPORT && (p.prototype.__proto__ = Uint8Array.prototype, p.__proto__ = Uint8Array), p.alloc = function (e, t, r) {return function (e, t, r, n) {return g(t), t <= 0 ? d(e, t) : void 0 !== r ? "string" == typeof n ? d(e, t).fill(r, n) : d(e, t).fill(r) : d(e, t);}(null, e, t, r);}, p.allocUnsafe = function (e) {return v(null, e);}, p.allocUnsafeSlow = function (e) {return v(null, e);}, p.isBuffer = $, p.compare = function (e, t) {if (!y(e) || !y(t)) throw new TypeError("Arguments must be Buffers");if (e === t) return 0;for (var r = e.length, n = t.length, i = 0, o = Math.min(r, n); i < o; ++i) {if (e[i] !== t[i]) {r = e[i], n = t[i];break;}}return r < n ? -1 : n < r ? 1 : 0;}, p.isEncoding = function (e) {switch (String(e).toLowerCase()) {case "hex":case "utf8":case "utf-8":case "ascii":case "latin1":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return !0;default:return !1;}}, p.concat = function (e, t) {if (!c(e)) throw new TypeError('"list" argument must be an Array of Buffers');if (0 === e.length) return p.alloc(0);var r;if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r) {t += e[r].length;}var n = p.allocUnsafe(t),i = 0;for (r = 0; r < e.length; ++r) {var o = e[r];if (!y(o)) throw new TypeError('"list" argument must be an Array of Buffers');o.copy(n, i), i += o.length;}return n;}, p.byteLength = m, p.prototype._isBuffer = !0, p.prototype.swap16 = function () {var e = this.length;if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");for (var t = 0; t < e; t += 2) {E(this, t, t + 1);}return this;}, p.prototype.swap32 = function () {var e = this.length;if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");for (var t = 0; t < e; t += 4) {E(this, t, t + 3), E(this, t + 1, t + 2);}return this;}, p.prototype.swap64 = function () {var e = this.length;if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");for (var t = 0; t < e; t += 8) {E(this, t, t + 7), E(this, t + 1, t + 6), E(this, t + 2, t + 5), E(this, t + 3, t + 4);}return this;}, p.prototype.toString = function () {var e = 0 | this.length;return 0 === e ? "" : 0 === arguments.length ? C(this, 0, e) : k.apply(this, arguments);}, p.prototype.equals = function (e) {if (!y(e)) throw new TypeError("Argument must be a Buffer");return this === e || 0 === p.compare(this, e);}, p.prototype.inspect = function () {var e = "";return this.length > 0 && (e = this.toString("hex", 0, 50).match(/.{2}/g).join(" "), this.length > 50 && (e += " ... ")), "<Buffer " + e + ">";}, p.prototype.compare = function (e, t, r, n, i) {if (!y(e)) throw new TypeError("Argument must be a Buffer");if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), t < 0 || r > e.length || n < 0 || i > this.length) throw new RangeError("out of range index");if (n >= i && t >= r) return 0;if (n >= i) return -1;if (t >= r) return 1;if (this === e) return 0;for (var o = (i >>>= 0) - (n >>>= 0), a = (r >>>= 0) - (t >>>= 0), s = Math.min(o, a), h = this.slice(n, i), l = e.slice(t, r), f = 0; f < s; ++f) {if (h[f] !== l[f]) {o = h[f], a = l[f];break;}}return o < a ? -1 : a < o ? 1 : 0;}, p.prototype.includes = function (e, t, r) {return -1 !== this.indexOf(e, t, r);}, p.prototype.indexOf = function (e, t, r) {return S(this, e, t, r, !0);}, p.prototype.lastIndexOf = function (e, t, r) {return S(this, e, t, r, !1);}, p.prototype.write = function (e, t, r, n) {if (void 0 === t) n = "utf8", r = this.length, t = 0;else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;else {if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t |= 0, isFinite(r) ? (r |= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);}var i = this.length - t;if ((void 0 === r || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");n || (n = "utf8");for (var o = !1;;) {switch (n) {case "hex":return R(this, e, t, r);case "utf8":case "utf-8":return A(this, e, t, r);case "ascii":return B(this, e, t, r);case "latin1":case "binary":return z(this, e, t, r);case "base64":return L(this, e, t, r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return T(this, e, t, r);default:if (o) throw new TypeError("Unknown encoding: " + n);n = ("" + n).toLowerCase(), o = !0;}}}, p.prototype.toJSON = function () {return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };};var D = 4096;function I(e, t, r) {var n = "";r = Math.min(e.length, r);for (var i = t; i < r; ++i) {n += String.fromCharCode(127 & e[i]);}return n;}function P(e, t, r) {var n = "";r = Math.min(e.length, r);for (var i = t; i < r; ++i) {n += String.fromCharCode(e[i]);}return n;}function O(e, t, r) {var n = e.length;(!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);for (var i = "", o = t; o < r; ++o) {i += X(e[o]);}return i;}function U(e, t, r) {for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2) {i += String.fromCharCode(n[o] + 256 * n[o + 1]);}return i;}function H(e, t, r) {if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");if (e + t > r) throw new RangeError("Trying to access beyond buffer length");}function F(e, t, r, n, i, o) {if (!y(e)) throw new TypeError('"buffer" argument must be a Buffer instance');if (t > i || t < o) throw new RangeError('"value" argument is out of bounds');if (r + n > e.length) throw new RangeError("Index out of range");}function N(e, t, r, n) {t < 0 && (t = 65535 + t + 1);for (var i = 0, o = Math.min(e.length - r, 2); i < o; ++i) {e[r + i] = (t & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i);}}function Z(e, t, r, n) {t < 0 && (t = 4294967295 + t + 1);for (var i = 0, o = Math.min(e.length - r, 4); i < o; ++i) {e[r + i] = t >>> 8 * (n ? i : 3 - i) & 255;}}function j(e, t, r, n, i, o) {if (r + n > e.length) throw new RangeError("Index out of range");if (r < 0) throw new RangeError("Index out of range");}function W(e, t, r, n, i) {return i || j(e, 0, r, 4), l(e, t, r, n, 23, 4), r + 4;}function Y(e, t, r, n, i) {return i || j(e, 0, r, 8), l(e, t, r, n, 52, 8), r + 8;}p.prototype.slice = function (e, t) {var r,n = this.length;if ((e = ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n), (t = void 0 === t ? n : ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n), t < e && (t = e), p.TYPED_ARRAY_SUPPORT) (r = this.subarray(e, t)).__proto__ = p.prototype;else {var i = t - e;r = new p(i, void 0);for (var o = 0; o < i; ++o) {r[o] = this[o + e];}}return r;}, p.prototype.readUIntLE = function (e, t, r) {e |= 0, t |= 0, r || H(e, t, this.length);for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) {n += this[e + o] * i;}return n;}, p.prototype.readUIntBE = function (e, t, r) {e |= 0, t |= 0, r || H(e, t, this.length);for (var n = this[e + --t], i = 1; t > 0 && (i *= 256);) {n += this[e + --t] * i;}return n;}, p.prototype.readUInt8 = function (e, t) {return t || H(e, 1, this.length), this[e];}, p.prototype.readUInt16LE = function (e, t) {return t || H(e, 2, this.length), this[e] | this[e + 1] << 8;}, p.prototype.readUInt16BE = function (e, t) {return t || H(e, 2, this.length), this[e] << 8 | this[e + 1];}, p.prototype.readUInt32LE = function (e, t) {return t || H(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];}, p.prototype.readUInt32BE = function (e, t) {return t || H(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);}, p.prototype.readIntLE = function (e, t, r) {e |= 0, t |= 0, r || H(e, t, this.length);for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) {n += this[e + o] * i;}return n >= (i *= 128) && (n -= Math.pow(2, 8 * t)), n;}, p.prototype.readIntBE = function (e, t, r) {e |= 0, t |= 0, r || H(e, t, this.length);for (var n = t, i = 1, o = this[e + --n]; n > 0 && (i *= 256);) {o += this[e + --n] * i;}return o >= (i *= 128) && (o -= Math.pow(2, 8 * t)), o;}, p.prototype.readInt8 = function (e, t) {return t || H(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];}, p.prototype.readInt16LE = function (e, t) {t || H(e, 2, this.length);var r = this[e] | this[e + 1] << 8;return 32768 & r ? 4294901760 | r : r;}, p.prototype.readInt16BE = function (e, t) {t || H(e, 2, this.length);var r = this[e + 1] | this[e] << 8;return 32768 & r ? 4294901760 | r : r;}, p.prototype.readInt32LE = function (e, t) {return t || H(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;}, p.prototype.readInt32BE = function (e, t) {return t || H(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];}, p.prototype.readFloatLE = function (e, t) {return t || H(e, 4, this.length), h(this, e, !0, 23, 4);}, p.prototype.readFloatBE = function (e, t) {return t || H(e, 4, this.length), h(this, e, !1, 23, 4);}, p.prototype.readDoubleLE = function (e, t) {return t || H(e, 8, this.length), h(this, e, !0, 52, 8);}, p.prototype.readDoubleBE = function (e, t) {return t || H(e, 8, this.length), h(this, e, !1, 52, 8);}, p.prototype.writeUIntLE = function (e, t, r, n) {(e = +e, t |= 0, r |= 0, n) || F(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);var i = 1,o = 0;for (this[t] = 255 & e; ++o < r && (i *= 256);) {this[t + o] = e / i & 255;}return t + r;}, p.prototype.writeUIntBE = function (e, t, r, n) {(e = +e, t |= 0, r |= 0, n) || F(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);var i = r - 1,o = 1;for (this[t + i] = 255 & e; --i >= 0 && (o *= 256);) {this[t + i] = e / o & 255;}return t + r;}, p.prototype.writeUInt8 = function (e, t, r) {return e = +e, t |= 0, r || F(this, e, t, 1, 255, 0), p.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1;}, p.prototype.writeUInt16LE = function (e, t, r) {return e = +e, t |= 0, r || F(this, e, t, 2, 65535, 0), p.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : N(this, e, t, !0), t + 2;}, p.prototype.writeUInt16BE = function (e, t, r) {return e = +e, t |= 0, r || F(this, e, t, 2, 65535, 0), p.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : N(this, e, t, !1), t + 2;}, p.prototype.writeUInt32LE = function (e, t, r) {return e = +e, t |= 0, r || F(this, e, t, 4, 4294967295, 0), p.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : Z(this, e, t, !0), t + 4;}, p.prototype.writeUInt32BE = function (e, t, r) {return e = +e, t |= 0, r || F(this, e, t, 4, 4294967295, 0), p.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : Z(this, e, t, !1), t + 4;}, p.prototype.writeIntLE = function (e, t, r, n) {if (e = +e, t |= 0, !n) {var i = Math.pow(2, 8 * r - 1);F(this, e, t, r, i - 1, -i);}var o = 0,a = 1,s = 0;for (this[t] = 255 & e; ++o < r && (a *= 256);) {e < 0 && 0 === s && 0 !== this[t + o - 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;}return t + r;}, p.prototype.writeIntBE = function (e, t, r, n) {if (e = +e, t |= 0, !n) {var i = Math.pow(2, 8 * r - 1);F(this, e, t, r, i - 1, -i);}var o = r - 1,a = 1,s = 0;for (this[t + o] = 255 & e; --o >= 0 && (a *= 256);) {e < 0 && 0 === s && 0 !== this[t + o + 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;}return t + r;}, p.prototype.writeInt8 = function (e, t, r) {return e = +e, t |= 0, r || F(this, e, t, 1, 127, -128), p.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1;}, p.prototype.writeInt16LE = function (e, t, r) {return e = +e, t |= 0, r || F(this, e, t, 2, 32767, -32768), p.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : N(this, e, t, !0), t + 2;}, p.prototype.writeInt16BE = function (e, t, r) {return e = +e, t |= 0, r || F(this, e, t, 2, 32767, -32768), p.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : N(this, e, t, !1), t + 2;}, p.prototype.writeInt32LE = function (e, t, r) {return e = +e, t |= 0, r || F(this, e, t, 4, 2147483647, -2147483648), p.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : Z(this, e, t, !0), t + 4;}, p.prototype.writeInt32BE = function (e, t, r) {return e = +e, t |= 0, r || F(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), p.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : Z(this, e, t, !1), t + 4;}, p.prototype.writeFloatLE = function (e, t, r) {return W(this, e, t, !0, r);}, p.prototype.writeFloatBE = function (e, t, r) {return W(this, e, t, !1, r);}, p.prototype.writeDoubleLE = function (e, t, r) {return Y(this, e, t, !0, r);}, p.prototype.writeDoubleBE = function (e, t, r) {return Y(this, e, t, !1, r);}, p.prototype.copy = function (e, t, r, n) {if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r) return 0;if (0 === e.length || 0 === this.length) return 0;if (t < 0) throw new RangeError("targetStart out of bounds");if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");if (n < 0) throw new RangeError("sourceEnd out of bounds");n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);var i,o = n - r;if (this === e && r < t && t < n) for (i = o - 1; i >= 0; --i) {e[i + t] = this[i + r];} else if (o < 1e3 || !p.TYPED_ARRAY_SUPPORT) for (i = 0; i < o; ++i) {e[i + t] = this[i + r];} else Uint8Array.prototype.set.call(e, this.subarray(r, r + o), t);return o;}, p.prototype.fill = function (e, t, r, n) {if ("string" == typeof e) {if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), 1 === e.length) {var i = e.charCodeAt(0);i < 256 && (e = i);}if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");if ("string" == typeof n && !p.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);} else "number" == typeof e && (e &= 255);if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");if (r <= t) return this;var o;if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e) for (o = t; o < r; ++o) {this[o] = e;} else {var a = y(e) ? e : q(new p(e, n).toString()),s = a.length;for (o = 0; o < r - t; ++o) {this[o + t] = a[o % s];}}return this;};var K = /[^+\/0-9A-Za-z-_]/g;function X(e) {return e < 16 ? "0" + e.toString(16) : e.toString(16);}function q(e, t) {var r;t = t || 1 / 0;for (var n = e.length, i = null, o = [], a = 0; a < n; ++a) {if ((r = e.charCodeAt(a)) > 55295 && r < 57344) {if (!i) {if (r > 56319) {(t -= 3) > -1 && o.push(239, 191, 189);continue;}if (a + 1 === n) {(t -= 3) > -1 && o.push(239, 191, 189);continue;}i = r;continue;}if (r < 56320) {(t -= 3) > -1 && o.push(239, 191, 189), i = r;continue;}r = 65536 + (i - 55296 << 10 | r - 56320);} else i && (t -= 3) > -1 && o.push(239, 191, 189);if (i = null, r < 128) {if ((t -= 1) < 0) break;o.push(r);} else if (r < 2048) {if ((t -= 2) < 0) break;o.push(r >> 6 | 192, 63 & r | 128);} else if (r < 65536) {if ((t -= 3) < 0) break;o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);} else {if (!(r < 1114112)) throw new Error("Invalid code point");if ((t -= 4) < 0) break;o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);}}return o;}function V(e) {return function (e) {var t, a, s, h, l, f;i || o();var c = e.length;if (c % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");l = "=" === e[c - 2] ? 2 : "=" === e[c - 1] ? 1 : 0, f = new n(3 * c / 4 - l), s = l > 0 ? c - 4 : c;var u = 0;for (t = 0, a = 0; t < s; t += 4, a += 3) {h = r[e.charCodeAt(t)] << 18 | r[e.charCodeAt(t + 1)] << 12 | r[e.charCodeAt(t + 2)] << 6 | r[e.charCodeAt(t + 3)], f[u++] = h >> 16 & 255, f[u++] = h >> 8 & 255, f[u++] = 255 & h;}return 2 === l ? (h = r[e.charCodeAt(t)] << 2 | r[e.charCodeAt(t + 1)] >> 4, f[u++] = 255 & h) : 1 === l && (h = r[e.charCodeAt(t)] << 10 | r[e.charCodeAt(t + 1)] << 4 | r[e.charCodeAt(t + 2)] >> 2, f[u++] = h >> 8 & 255, f[u++] = 255 & h), f;}(function (e) {if ((e = function (e) {return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");}(e).replace(K, "")).length < 2) return "";for (; e.length % 4 != 0;) {e += "=";}return e;}(e));}function G(e, t, r, n) {for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) {t[i + r] = e[i];}return i;}function $(e) {return null != e && (!!e._isBuffer || J(e) || function (e) {return "function" == typeof e.readFloatLE && "function" == typeof e.slice && J(e.slice(0, 0));}(e));}function J(e) {return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);}"undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self && self;function Q(e, t) {return e(t = { exports: {} }, t.exports), t.exports;}var ee = Q(function (e, t) {var r;e.exports = (r = r || function (e, t) {var r = Object.create || function () {function e() {}return function (t) {var r;return e.prototype = t, r = new e(), e.prototype = null, r;};}(),n = {},i = n.lib = {},o = i.Base = { extend: function extend(e) {var t = r(this);return e && t.mixIn(e), t.hasOwnProperty("init") && this.init !== t.init || (t.init = function () {t.$super.init.apply(this, arguments);}), t.init.prototype = t, t.$super = this, t;}, create: function create() {var e = this.extend();return e.init.apply(e, arguments), e;}, init: function init() {}, mixIn: function mixIn(e) {for (var t in e) {e.hasOwnProperty(t) && (this[t] = e[t]);}e.hasOwnProperty("toString") && (this.toString = e.toString);}, clone: function clone() {return this.init.prototype.extend(this);} },a = i.WordArray = o.extend({ init: function init(e, t) {e = this.words = e || [], this.sigBytes = null != t ? t : 4 * e.length;}, toString: function toString(e) {return (e || h).stringify(this);}, concat: function concat(e) {var t = this.words,r = e.words,n = this.sigBytes,i = e.sigBytes;if (this.clamp(), n % 4) for (var o = 0; o < i; o++) {var a = r[o >>> 2] >>> 24 - o % 4 * 8 & 255;t[n + o >>> 2] |= a << 24 - (n + o) % 4 * 8;} else for (var o = 0; o < i; o += 4) {t[n + o >>> 2] = r[o >>> 2];}return this.sigBytes += i, this;}, clamp: function clamp() {var t = this.words,r = this.sigBytes;t[r >>> 2] &= 4294967295 << 32 - r % 4 * 8, t.length = e.ceil(r / 4);}, clone: function clone() {var e = o.clone.call(this);return e.words = this.words.slice(0), e;}, random: function random(t) {for (var r, n = [], i = function i(t) {var t = t,r = 987654321,n = 4294967295;return function () {var i = ((r = 36969 * (65535 & r) + (r >> 16) & n) << 16) + (t = 18e3 * (65535 & t) + (t >> 16) & n) & n;return i /= 4294967296, (i += .5) * (e.random() > .5 ? 1 : -1);};}, o = 0; o < t; o += 4) {var s = i(4294967296 * (r || e.random()));r = 987654071 * s(), n.push(4294967296 * s() | 0);}return new a.init(n, t);} }),s = n.enc = {},h = s.Hex = { stringify: function stringify(e) {for (var t = e.words, r = e.sigBytes, n = [], i = 0; i < r; i++) {var o = t[i >>> 2] >>> 24 - i % 4 * 8 & 255;n.push((o >>> 4).toString(16)), n.push((15 & o).toString(16));}return n.join("");}, parse: function parse(e) {for (var t = e.length, r = [], n = 0; n < t; n += 2) {r[n >>> 3] |= parseInt(e.substr(n, 2), 16) << 24 - n % 8 * 4;}return new a.init(r, t / 2);} },l = s.Latin1 = { stringify: function stringify(e) {for (var t = e.words, r = e.sigBytes, n = [], i = 0; i < r; i++) {var o = t[i >>> 2] >>> 24 - i % 4 * 8 & 255;n.push(String.fromCharCode(o));}return n.join("");}, parse: function parse(e) {for (var t = e.length, r = [], n = 0; n < t; n++) {r[n >>> 2] |= (255 & e.charCodeAt(n)) << 24 - n % 4 * 8;}return new a.init(r, t);} },f = s.Utf8 = { stringify: function stringify(e) {try {return decodeURIComponent(escape(l.stringify(e)));} catch (e) {throw new Error("Malformed UTF-8 data");}}, parse: function parse(e) {return l.parse(unescape(encodeURIComponent(e)));} },c = i.BufferedBlockAlgorithm = o.extend({ reset: function reset() {this._data = new a.init(), this._nDataBytes = 0;}, _append: function _append(e) {"string" == typeof e && (e = f.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes;}, _process: function _process(t) {var r = this._data,n = r.words,i = r.sigBytes,o = this.blockSize,s = 4 * o,h = i / s,l = (h = t ? e.ceil(h) : e.max((0 | h) - this._minBufferSize, 0)) * o,f = e.min(4 * l, i);if (l) {for (var c = 0; c < l; c += o) {this._doProcessBlock(n, c);}var u = n.splice(0, l);r.sigBytes -= f;}return new a.init(u, f);}, clone: function clone() {var e = o.clone.call(this);return e._data = this._data.clone(), e;}, _minBufferSize: 0 }),u = (i.Hasher = c.extend({ cfg: o.extend(), init: function init(e) {this.cfg = this.cfg.extend(e), this.reset();}, reset: function reset() {c.reset.call(this), this._doReset();}, update: function update(e) {return this._append(e), this._process(), this;}, finalize: function finalize(e) {e && this._append(e);var t = this._doFinalize();return t;}, blockSize: 16, _createHelper: function _createHelper(e) {return function (t, r) {return new e.init(r).finalize(t);};}, _createHmacHelper: function _createHmacHelper(e) {return function (t, r) {return new u.HMAC.init(e, r).finalize(t);};} }), n.algo = {});return n;}(Math), r);}),te = (Q(function (e, t) {var r, n, i, o, a, s;e.exports = (i = (n = r = ee).lib, o = i.Base, a = i.WordArray, (s = n.x64 = {}).Word = o.extend({ init: function init(e, t) {this.high = e, this.low = t;} }), s.WordArray = o.extend({ init: function init(e, t) {e = this.words = e || [], this.sigBytes = null != t ? t : 8 * e.length;}, toX32: function toX32() {for (var e = this.words, t = e.length, r = [], n = 0; n < t; n++) {var i = e[n];r.push(i.high), r.push(i.low);}return a.create(r, this.sigBytes);}, clone: function clone() {for (var e = o.clone.call(this), t = e.words = this.words.slice(0), r = t.length, n = 0; n < r; n++) {t[n] = t[n].clone();}return e;} }), r);}), Q(function (e, t) {var r;e.exports = (r = ee, function () {if ("function" == typeof ArrayBuffer) {var e = r.lib.WordArray,t = e.init;(e.init = function (e) {if (e instanceof ArrayBuffer && (e = new Uint8Array(e)), (e instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && e instanceof Uint8ClampedArray || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array) && (e = new Uint8Array(e.buffer, e.byteOffset, e.byteLength)), e instanceof Uint8Array) {for (var r = e.byteLength, n = [], i = 0; i < r; i++) {n[i >>> 2] |= e[i] << 24 - i % 4 * 8;}t.call(this, n, r);} else t.apply(this, arguments);}).prototype = e;}}(), r.lib.WordArray);}), Q(function (e, t) {var r;e.exports = (r = ee, function () {var e = r,t = e.lib.WordArray,n = e.enc;function i(e) {return e << 8 & 4278255360 | e >>> 8 & 16711935;}n.Utf16 = n.Utf16BE = { stringify: function stringify(e) {for (var t = e.words, r = e.sigBytes, n = [], i = 0; i < r; i += 2) {var o = t[i >>> 2] >>> 16 - i % 4 * 8 & 65535;n.push(String.fromCharCode(o));}return n.join("");}, parse: function parse(e) {for (var r = e.length, n = [], i = 0; i < r; i++) {n[i >>> 1] |= e.charCodeAt(i) << 16 - i % 2 * 16;}return t.create(n, 2 * r);} }, n.Utf16LE = { stringify: function stringify(e) {for (var t = e.words, r = e.sigBytes, n = [], o = 0; o < r; o += 2) {var a = i(t[o >>> 2] >>> 16 - o % 4 * 8 & 65535);n.push(String.fromCharCode(a));}return n.join("");}, parse: function parse(e) {for (var r = e.length, n = [], o = 0; o < r; o++) {n[o >>> 1] |= i(e.charCodeAt(o) << 16 - o % 2 * 16);}return t.create(n, 2 * r);} };}(), r.enc.Utf16);}), Q(function (e, t) {var r, n, i;e.exports = (i = (n = r = ee).lib.WordArray, n.enc.Base64 = { stringify: function stringify(e) {var t = e.words,r = e.sigBytes,n = this._map;e.clamp();for (var i = [], o = 0; o < r; o += 3) {for (var a = (t[o >>> 2] >>> 24 - o % 4 * 8 & 255) << 16 | (t[o + 1 >>> 2] >>> 24 - (o + 1) % 4 * 8 & 255) << 8 | t[o + 2 >>> 2] >>> 24 - (o + 2) % 4 * 8 & 255, s = 0; s < 4 && o + .75 * s < r; s++) {i.push(n.charAt(a >>> 6 * (3 - s) & 63));}}var h = n.charAt(64);if (h) for (; i.length % 4;) {i.push(h);}return i.join("");}, parse: function parse(e) {var t = e.length,r = this._map,n = this._reverseMap;if (!n) {n = this._reverseMap = [];for (var o = 0; o < r.length; o++) {n[r.charCodeAt(o)] = o;}}var a = r.charAt(64);if (a) {var s = e.indexOf(a);-1 !== s && (t = s);}return function (e, t, r) {for (var n = [], o = 0, a = 0; a < t; a++) {if (a % 4) {var s = r[e.charCodeAt(a - 1)] << a % 4 * 2,h = r[e.charCodeAt(a)] >>> 6 - a % 4 * 2;n[o >>> 2] |= (s | h) << 24 - o % 4 * 8, o++;}}return i.create(n, o);}(e, t, n);}, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" }, r.enc.Base64);}), Q(function (e, t) {var r;e.exports = (r = ee, function (e) {var t = r,n = t.lib,i = n.WordArray,o = n.Hasher,a = t.algo,s = [];!function () {for (var t = 0; t < 64; t++) {s[t] = 4294967296 * e.abs(e.sin(t + 1)) | 0;}}();var h = a.MD5 = o.extend({ _doReset: function _doReset() {this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878]);}, _doProcessBlock: function _doProcessBlock(e, t) {for (var r = 0; r < 16; r++) {var n = t + r,i = e[n];e[n] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);}var o = this._hash.words,a = e[t + 0],h = e[t + 1],d = e[t + 2],p = e[t + 3],_ = e[t + 4],g = e[t + 5],v = e[t + 6],w = e[t + 7],b = e[t + 8],y = e[t + 9],m = e[t + 10],k = e[t + 11],E = e[t + 12],S = e[t + 13],x = e[t + 14],R = e[t + 15],A = o[0],B = o[1],z = o[2],L = o[3];A = l(A, B, z, L, a, 7, s[0]), L = l(L, A, B, z, h, 12, s[1]), z = l(z, L, A, B, d, 17, s[2]), B = l(B, z, L, A, p, 22, s[3]), A = l(A, B, z, L, _, 7, s[4]), L = l(L, A, B, z, g, 12, s[5]), z = l(z, L, A, B, v, 17, s[6]), B = l(B, z, L, A, w, 22, s[7]), A = l(A, B, z, L, b, 7, s[8]), L = l(L, A, B, z, y, 12, s[9]), z = l(z, L, A, B, m, 17, s[10]), B = l(B, z, L, A, k, 22, s[11]), A = l(A, B, z, L, E, 7, s[12]), L = l(L, A, B, z, S, 12, s[13]), z = l(z, L, A, B, x, 17, s[14]), A = f(A, B = l(B, z, L, A, R, 22, s[15]), z, L, h, 5, s[16]), L = f(L, A, B, z, v, 9, s[17]), z = f(z, L, A, B, k, 14, s[18]), B = f(B, z, L, A, a, 20, s[19]), A = f(A, B, z, L, g, 5, s[20]), L = f(L, A, B, z, m, 9, s[21]), z = f(z, L, A, B, R, 14, s[22]), B = f(B, z, L, A, _, 20, s[23]), A = f(A, B, z, L, y, 5, s[24]), L = f(L, A, B, z, x, 9, s[25]), z = f(z, L, A, B, p, 14, s[26]), B = f(B, z, L, A, b, 20, s[27]), A = f(A, B, z, L, S, 5, s[28]), L = f(L, A, B, z, d, 9, s[29]), z = f(z, L, A, B, w, 14, s[30]), A = c(A, B = f(B, z, L, A, E, 20, s[31]), z, L, g, 4, s[32]), L = c(L, A, B, z, b, 11, s[33]), z = c(z, L, A, B, k, 16, s[34]), B = c(B, z, L, A, x, 23, s[35]), A = c(A, B, z, L, h, 4, s[36]), L = c(L, A, B, z, _, 11, s[37]), z = c(z, L, A, B, w, 16, s[38]), B = c(B, z, L, A, m, 23, s[39]), A = c(A, B, z, L, S, 4, s[40]), L = c(L, A, B, z, a, 11, s[41]), z = c(z, L, A, B, p, 16, s[42]), B = c(B, z, L, A, v, 23, s[43]), A = c(A, B, z, L, y, 4, s[44]), L = c(L, A, B, z, E, 11, s[45]), z = c(z, L, A, B, R, 16, s[46]), A = u(A, B = c(B, z, L, A, d, 23, s[47]), z, L, a, 6, s[48]), L = u(L, A, B, z, w, 10, s[49]), z = u(z, L, A, B, x, 15, s[50]), B = u(B, z, L, A, g, 21, s[51]), A = u(A, B, z, L, E, 6, s[52]), L = u(L, A, B, z, p, 10, s[53]), z = u(z, L, A, B, m, 15, s[54]), B = u(B, z, L, A, h, 21, s[55]), A = u(A, B, z, L, b, 6, s[56]), L = u(L, A, B, z, R, 10, s[57]), z = u(z, L, A, B, v, 15, s[58]), B = u(B, z, L, A, S, 21, s[59]), A = u(A, B, z, L, _, 6, s[60]), L = u(L, A, B, z, k, 10, s[61]), z = u(z, L, A, B, d, 15, s[62]), B = u(B, z, L, A, y, 21, s[63]), o[0] = o[0] + A | 0, o[1] = o[1] + B | 0, o[2] = o[2] + z | 0, o[3] = o[3] + L | 0;}, _doFinalize: function _doFinalize() {var t = this._data,r = t.words,n = 8 * this._nDataBytes,i = 8 * t.sigBytes;r[i >>> 5] |= 128 << 24 - i % 32;var o = e.floor(n / 4294967296),a = n;r[15 + (i + 64 >>> 9 << 4)] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8), r[14 + (i + 64 >>> 9 << 4)] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8), t.sigBytes = 4 * (r.length + 1), this._process();for (var s = this._hash, h = s.words, l = 0; l < 4; l++) {var f = h[l];h[l] = 16711935 & (f << 8 | f >>> 24) | 4278255360 & (f << 24 | f >>> 8);}return s;}, clone: function clone() {var e = o.clone.call(this);return e._hash = this._hash.clone(), e;} });function l(e, t, r, n, i, o, a) {var s = e + (t & r | ~t & n) + i + a;return (s << o | s >>> 32 - o) + t;}function f(e, t, r, n, i, o, a) {var s = e + (t & n | r & ~n) + i + a;return (s << o | s >>> 32 - o) + t;}function c(e, t, r, n, i, o, a) {var s = e + (t ^ r ^ n) + i + a;return (s << o | s >>> 32 - o) + t;}function u(e, t, r, n, i, o, a) {var s = e + (r ^ (t | ~n)) + i + a;return (s << o | s >>> 32 - o) + t;}t.MD5 = o._createHelper(h), t.HmacMD5 = o._createHmacHelper(h);}(Math), r.MD5);}), Q(function (e, t) {var r, n, i, o, a, s, h, l;e.exports = (i = (n = r = ee).lib, o = i.WordArray, a = i.Hasher, s = n.algo, h = [], l = s.SHA1 = a.extend({ _doReset: function _doReset() {this._hash = new o.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);}, _doProcessBlock: function _doProcessBlock(e, t) {for (var r = this._hash.words, n = r[0], i = r[1], o = r[2], a = r[3], s = r[4], l = 0; l < 80; l++) {if (l < 16) h[l] = 0 | e[t + l];else {var f = h[l - 3] ^ h[l - 8] ^ h[l - 14] ^ h[l - 16];h[l] = f << 1 | f >>> 31;}var c = (n << 5 | n >>> 27) + s + h[l];c += l < 20 ? 1518500249 + (i & o | ~i & a) : l < 40 ? 1859775393 + (i ^ o ^ a) : l < 60 ? (i & o | i & a | o & a) - 1894007588 : (i ^ o ^ a) - 899497514, s = a, a = o, o = i << 30 | i >>> 2, i = n, n = c;}r[0] = r[0] + n | 0, r[1] = r[1] + i | 0, r[2] = r[2] + o | 0, r[3] = r[3] + a | 0, r[4] = r[4] + s | 0;}, _doFinalize: function _doFinalize() {var e = this._data,t = e.words,r = 8 * this._nDataBytes,n = 8 * e.sigBytes;return t[n >>> 5] |= 128 << 24 - n % 32, t[14 + (n + 64 >>> 9 << 4)] = Math.floor(r / 4294967296), t[15 + (n + 64 >>> 9 << 4)] = r, e.sigBytes = 4 * t.length, this._process(), this._hash;}, clone: function clone() {var e = a.clone.call(this);return e._hash = this._hash.clone(), e;} }), n.SHA1 = a._createHelper(l), n.HmacSHA1 = a._createHmacHelper(l), r.SHA1);}), Q(function (e, t) {var r;e.exports = (r = ee, function (e) {var t = r,n = t.lib,i = n.WordArray,o = n.Hasher,a = t.algo,s = [],h = [];!function () {function t(t) {for (var r = e.sqrt(t), n = 2; n <= r; n++) {if (!(t % n)) return !1;}return !0;}function r(e) {return 4294967296 * (e - (0 | e)) | 0;}for (var n = 2, i = 0; i < 64;) {t(n) && (i < 8 && (s[i] = r(e.pow(n, .5))), h[i] = r(e.pow(n, 1 / 3)), i++), n++;}}();var l = [],f = a.SHA256 = o.extend({ _doReset: function _doReset() {this._hash = new i.init(s.slice(0));}, _doProcessBlock: function _doProcessBlock(e, t) {for (var r = this._hash.words, n = r[0], i = r[1], o = r[2], a = r[3], s = r[4], f = r[5], c = r[6], u = r[7], d = 0; d < 64; d++) {if (d < 16) l[d] = 0 | e[t + d];else {var p = l[d - 15],_ = (p << 25 | p >>> 7) ^ (p << 14 | p >>> 18) ^ p >>> 3,g = l[d - 2],v = (g << 15 | g >>> 17) ^ (g << 13 | g >>> 19) ^ g >>> 10;l[d] = _ + l[d - 7] + v + l[d - 16];}var w = n & i ^ n & o ^ i & o,b = (n << 30 | n >>> 2) ^ (n << 19 | n >>> 13) ^ (n << 10 | n >>> 22),y = u + ((s << 26 | s >>> 6) ^ (s << 21 | s >>> 11) ^ (s << 7 | s >>> 25)) + (s & f ^ ~s & c) + h[d] + l[d];u = c, c = f, f = s, s = a + y | 0, a = o, o = i, i = n, n = y + (b + w) | 0;}r[0] = r[0] + n | 0, r[1] = r[1] + i | 0, r[2] = r[2] + o | 0, r[3] = r[3] + a | 0, r[4] = r[4] + s | 0, r[5] = r[5] + f | 0, r[6] = r[6] + c | 0, r[7] = r[7] + u | 0;}, _doFinalize: function _doFinalize() {var t = this._data,r = t.words,n = 8 * this._nDataBytes,i = 8 * t.sigBytes;return r[i >>> 5] |= 128 << 24 - i % 32, r[14 + (i + 64 >>> 9 << 4)] = e.floor(n / 4294967296), r[15 + (i + 64 >>> 9 << 4)] = n, t.sigBytes = 4 * r.length, this._process(), this._hash;}, clone: function clone() {var e = o.clone.call(this);return e._hash = this._hash.clone(), e;} });t.SHA256 = o._createHelper(f), t.HmacSHA256 = o._createHmacHelper(f);}(Math), r.SHA256);}), Q(function (e, t) {var r, n, i, o, a, s;e.exports = (i = (n = r = ee).lib.WordArray, o = n.algo, a = o.SHA256, s = o.SHA224 = a.extend({ _doReset: function _doReset() {this._hash = new i.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]);}, _doFinalize: function _doFinalize() {var e = a._doFinalize.call(this);return e.sigBytes -= 4, e;} }), n.SHA224 = a._createHelper(s), n.HmacSHA224 = a._createHmacHelper(s), r.SHA224);}), Q(function (e, t) {var r;e.exports = (r = ee, function () {var e = r,t = e.lib.Hasher,n = e.x64,i = n.Word,o = n.WordArray,a = e.algo;function s() {return i.create.apply(i, arguments);}var h = [s(1116352408, 3609767458), s(1899447441, 602891725), s(3049323471, 3964484399), s(3921009573, 2173295548), s(961987163, 4081628472), s(1508970993, 3053834265), s(2453635748, 2937671579), s(2870763221, 3664609560), s(3624381080, 2734883394), s(310598401, 1164996542), s(607225278, 1323610764), s(1426881987, 3590304994), s(1925078388, 4068182383), s(2162078206, 991336113), s(2614888103, 633803317), s(3248222580, 3479774868), s(3835390401, 2666613458), s(4022224774, 944711139), s(264347078, 2341262773), s(604807628, 2007800933), s(770255983, 1495990901), s(1249150122, 1856431235), s(1555081692, 3175218132), s(1996064986, 2198950837), s(2554220882, 3999719339), s(2821834349, 766784016), s(2952996808, 2566594879), s(3210313671, 3203337956), s(3336571891, 1034457026), s(3584528711, 2466948901), s(113926993, 3758326383), s(338241895, 168717936), s(666307205, 1188179964), s(773529912, 1546045734), s(1294757372, 1522805485), s(1396182291, 2643833823), s(1695183700, 2343527390), s(1986661051, 1014477480), s(2177026350, 1206759142), s(2456956037, 344077627), s(2730485921, 1290863460), s(2820302411, 3158454273), s(3259730800, 3505952657), s(3345764771, 106217008), s(3516065817, 3606008344), s(3600352804, 1432725776), s(4094571909, 1467031594), s(275423344, 851169720), s(430227734, 3100823752), s(506948616, 1363258195), s(659060556, 3750685593), s(883997877, 3785050280), s(958139571, 3318307427), s(1322822218, 3812723403), s(1537002063, 2003034995), s(1747873779, 3602036899), s(1955562222, 1575990012), s(2024104815, 1125592928), s(2227730452, 2716904306), s(2361852424, 442776044), s(2428436474, 593698344), s(2756734187, 3733110249), s(3204031479, 2999351573), s(3329325298, 3815920427), s(3391569614, 3928383900), s(3515267271, 566280711), s(3940187606, 3454069534), s(4118630271, 4000239992), s(116418474, 1914138554), s(174292421, 2731055270), s(289380356, 3203993006), s(460393269, 320620315), s(685471733, 587496836), s(852142971, 1086792851), s(1017036298, 365543100), s(1126000580, 2618297676), s(1288033470, 3409855158), s(1501505948, 4234509866), s(1607167915, 987167468), s(1816402316, 1246189591)],l = [];!function () {for (var e = 0; e < 80; e++) {l[e] = s();}}();var f = a.SHA512 = t.extend({ _doReset: function _doReset() {this._hash = new o.init([new i.init(1779033703, 4089235720), new i.init(3144134277, 2227873595), new i.init(1013904242, 4271175723), new i.init(2773480762, 1595750129), new i.init(1359893119, 2917565137), new i.init(2600822924, 725511199), new i.init(528734635, 4215389547), new i.init(1541459225, 327033209)]);}, _doProcessBlock: function _doProcessBlock(e, t) {for (var r = this._hash.words, n = r[0], i = r[1], o = r[2], a = r[3], s = r[4], f = r[5], c = r[6], u = r[7], d = n.high, p = n.low, _ = i.high, g = i.low, v = o.high, w = o.low, b = a.high, y = a.low, m = s.high, k = s.low, E = f.high, S = f.low, x = c.high, R = c.low, A = u.high, B = u.low, z = d, L = p, T = _, M = g, C = v, D = w, I = b, P = y, O = m, U = k, H = E, F = S, N = x, Z = R, j = A, W = B, Y = 0; Y < 80; Y++) {var K = l[Y];if (Y < 16) var X = K.high = 0 | e[t + 2 * Y],q = K.low = 0 | e[t + 2 * Y + 1];else {var V = l[Y - 15],G = V.high,$ = V.low,J = (G >>> 1 | $ << 31) ^ (G >>> 8 | $ << 24) ^ G >>> 7,Q = ($ >>> 1 | G << 31) ^ ($ >>> 8 | G << 24) ^ ($ >>> 7 | G << 25),ee = l[Y - 2],te = ee.high,re = ee.low,ne = (te >>> 19 | re << 13) ^ (te << 3 | re >>> 29) ^ te >>> 6,ie = (re >>> 19 | te << 13) ^ (re << 3 | te >>> 29) ^ (re >>> 6 | te << 26),oe = l[Y - 7],ae = oe.high,se = oe.low,he = l[Y - 16],le = he.high,fe = he.low;X = (X = (X = J + ae + ((q = Q + se) >>> 0 < Q >>> 0 ? 1 : 0)) + ne + ((q += ie) >>> 0 < ie >>> 0 ? 1 : 0)) + le + ((q += fe) >>> 0 < fe >>> 0 ? 1 : 0), K.high = X, K.low = q;}var ce,ue = O & H ^ ~O & N,de = U & F ^ ~U & Z,pe = z & T ^ z & C ^ T & C,_e = L & M ^ L & D ^ M & D,ge = (z >>> 28 | L << 4) ^ (z << 30 | L >>> 2) ^ (z << 25 | L >>> 7),ve = (L >>> 28 | z << 4) ^ (L << 30 | z >>> 2) ^ (L << 25 | z >>> 7),we = (O >>> 14 | U << 18) ^ (O >>> 18 | U << 14) ^ (O << 23 | U >>> 9),be = (U >>> 14 | O << 18) ^ (U >>> 18 | O << 14) ^ (U << 23 | O >>> 9),ye = h[Y],me = ye.high,ke = ye.low,Ee = j + we + ((ce = W + be) >>> 0 < W >>> 0 ? 1 : 0),Se = ve + _e;j = N, W = Z, N = H, Z = F, H = O, F = U, O = I + (Ee = (Ee = (Ee = Ee + ue + ((ce += de) >>> 0 < de >>> 0 ? 1 : 0)) + me + ((ce += ke) >>> 0 < ke >>> 0 ? 1 : 0)) + X + ((ce += q) >>> 0 < q >>> 0 ? 1 : 0)) + ((U = P + ce | 0) >>> 0 < P >>> 0 ? 1 : 0) | 0, I = C, P = D, C = T, D = M, T = z, M = L, z = Ee + (ge + pe + (Se >>> 0 < ve >>> 0 ? 1 : 0)) + ((L = ce + Se | 0) >>> 0 < ce >>> 0 ? 1 : 0) | 0;}p = n.low = p + L, n.high = d + z + (p >>> 0 < L >>> 0 ? 1 : 0), g = i.low = g + M, i.high = _ + T + (g >>> 0 < M >>> 0 ? 1 : 0), w = o.low = w + D, o.high = v + C + (w >>> 0 < D >>> 0 ? 1 : 0), y = a.low = y + P, a.high = b + I + (y >>> 0 < P >>> 0 ? 1 : 0), k = s.low = k + U, s.high = m + O + (k >>> 0 < U >>> 0 ? 1 : 0), S = f.low = S + F, f.high = E + H + (S >>> 0 < F >>> 0 ? 1 : 0), R = c.low = R + Z, c.high = x + N + (R >>> 0 < Z >>> 0 ? 1 : 0), B = u.low = B + W, u.high = A + j + (B >>> 0 < W >>> 0 ? 1 : 0);}, _doFinalize: function _doFinalize() {var e = this._data,t = e.words,r = 8 * this._nDataBytes,n = 8 * e.sigBytes;return t[n >>> 5] |= 128 << 24 - n % 32, t[30 + (n + 128 >>> 10 << 5)] = Math.floor(r / 4294967296), t[31 + (n + 128 >>> 10 << 5)] = r, e.sigBytes = 4 * t.length, this._process(), this._hash.toX32();}, clone: function clone() {var e = t.clone.call(this);return e._hash = this._hash.clone(), e;}, blockSize: 32 });e.SHA512 = t._createHelper(f), e.HmacSHA512 = t._createHmacHelper(f);}(), r.SHA512);}), Q(function (e, t) {var r, n, i, o, a, s, h, l;e.exports = (i = (n = r = ee).x64, o = i.Word, a = i.WordArray, s = n.algo, h = s.SHA512, l = s.SHA384 = h.extend({ _doReset: function _doReset() {this._hash = new a.init([new o.init(3418070365, 3238371032), new o.init(1654270250, 914150663), new o.init(2438529370, 812702999), new o.init(355462360, 4144912697), new o.init(1731405415, 4290775857), new o.init(2394180231, 1750603025), new o.init(3675008525, 1694076839), new o.init(1203062813, 3204075428)]);}, _doFinalize: function _doFinalize() {var e = h._doFinalize.call(this);return e.sigBytes -= 16, e;} }), n.SHA384 = h._createHelper(l), n.HmacSHA384 = h._createHmacHelper(l), r.SHA384);}), Q(function (e, t) {var r;e.exports = (r = ee, function (e) {var t = r,n = t.lib,i = n.WordArray,o = n.Hasher,a = t.x64.Word,s = t.algo,h = [],l = [],f = [];!function () {for (var e = 1, t = 0, r = 0; r < 24; r++) {h[e + 5 * t] = (r + 1) * (r + 2) / 2 % 64;var n = (2 * e + 3 * t) % 5;e = t % 5, t = n;}for (e = 0; e < 5; e++) {for (t = 0; t < 5; t++) {l[e + 5 * t] = t + (2 * e + 3 * t) % 5 * 5;}}for (var i = 1, o = 0; o < 24; o++) {for (var s = 0, c = 0, u = 0; u < 7; u++) {if (1 & i) {var d = (1 << u) - 1;d < 32 ? c ^= 1 << d : s ^= 1 << d - 32;}128 & i ? i = i << 1 ^ 113 : i <<= 1;}f[o] = a.create(s, c);}}();var c = [];!function () {for (var e = 0; e < 25; e++) {c[e] = a.create();}}();var u = s.SHA3 = o.extend({ cfg: o.cfg.extend({ outputLength: 512 }), _doReset: function _doReset() {for (var e = this._state = [], t = 0; t < 25; t++) {e[t] = new a.init();}this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;}, _doProcessBlock: function _doProcessBlock(e, t) {for (var r = this._state, n = this.blockSize / 2, i = 0; i < n; i++) {var o = e[t + 2 * i],a = e[t + 2 * i + 1];o = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8), a = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8), (B = r[i]).high ^= a, B.low ^= o;}for (var s = 0; s < 24; s++) {for (var u = 0; u < 5; u++) {for (var d = 0, p = 0, _ = 0; _ < 5; _++) {d ^= (B = r[u + 5 * _]).high, p ^= B.low;}var g = c[u];g.high = d, g.low = p;}for (u = 0; u < 5; u++) {var v = c[(u + 4) % 5],w = c[(u + 1) % 5],b = w.high,y = w.low;for (d = v.high ^ (b << 1 | y >>> 31), p = v.low ^ (y << 1 | b >>> 31), _ = 0; _ < 5; _++) {(B = r[u + 5 * _]).high ^= d, B.low ^= p;}}for (var m = 1; m < 25; m++) {var k = (B = r[m]).high,E = B.low,S = h[m];S < 32 ? (d = k << S | E >>> 32 - S, p = E << S | k >>> 32 - S) : (d = E << S - 32 | k >>> 64 - S, p = k << S - 32 | E >>> 64 - S);var x = c[l[m]];x.high = d, x.low = p;}var R = c[0],A = r[0];for (R.high = A.high, R.low = A.low, u = 0; u < 5; u++) {for (_ = 0; _ < 5; _++) {var B = r[m = u + 5 * _],z = c[m],L = c[(u + 1) % 5 + 5 * _],T = c[(u + 2) % 5 + 5 * _];B.high = z.high ^ ~L.high & T.high, B.low = z.low ^ ~L.low & T.low;}}B = r[0];var M = f[s];B.high ^= M.high, B.low ^= M.low;}}, _doFinalize: function _doFinalize() {var t = this._data,r = t.words,n = (this._nDataBytes, 8 * t.sigBytes),o = 32 * this.blockSize;r[n >>> 5] |= 1 << 24 - n % 32, r[(e.ceil((n + 1) / o) * o >>> 5) - 1] |= 128, t.sigBytes = 4 * r.length, this._process();for (var a = this._state, s = this.cfg.outputLength / 8, h = s / 8, l = [], f = 0; f < h; f++) {var c = a[f],u = c.high,d = c.low;u = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8), d = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8), l.push(d), l.push(u);}return new i.init(l, s);}, clone: function clone() {for (var e = o.clone.call(this), t = e._state = this._state.slice(0), r = 0; r < 25; r++) {t[r] = t[r].clone();}return e;} });t.SHA3 = o._createHelper(u), t.HmacSHA3 = o._createHmacHelper(u);}(Math), r.SHA3);}), Q(function (e, t) {var r;e.exports = (r = ee, function (e) {var t = r,n = t.lib,i = n.WordArray,o = n.Hasher,a = t.algo,s = i.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]),h = i.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]),l = i.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]),f = i.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]),c = i.create([0, 1518500249, 1859775393, 2400959708, 2840853838]),u = i.create([1352829926, 1548603684, 1836072691, 2053994217, 0]),d = a.RIPEMD160 = o.extend({ _doReset: function _doReset() {this._hash = i.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);}, _doProcessBlock: function _doProcessBlock(e, t) {for (var r = 0; r < 16; r++) {var n = t + r,i = e[n];e[n] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);}var o,a,d,y,m,k,E,S,x,R,A,B = this._hash.words,z = c.words,L = u.words,T = s.words,M = h.words,C = l.words,D = f.words;for (k = o = B[0], E = a = B[1], S = d = B[2], x = y = B[3], R = m = B[4], r = 0; r < 80; r += 1) {A = o + e[t + T[r]] | 0, A += r < 16 ? p(a, d, y) + z[0] : r < 32 ? _(a, d, y) + z[1] : r < 48 ? g(a, d, y) + z[2] : r < 64 ? v(a, d, y) + z[3] : w(a, d, y) + z[4], A = (A = b(A |= 0, C[r])) + m | 0, o = m, m = y, y = b(d, 10), d = a, a = A, A = k + e[t + M[r]] | 0, A += r < 16 ? w(E, S, x) + L[0] : r < 32 ? v(E, S, x) + L[1] : r < 48 ? g(E, S, x) + L[2] : r < 64 ? _(E, S, x) + L[3] : p(E, S, x) + L[4], A = (A = b(A |= 0, D[r])) + R | 0, k = R, R = x, x = b(S, 10), S = E, E = A;}A = B[1] + d + x | 0, B[1] = B[2] + y + R | 0, B[2] = B[3] + m + k | 0, B[3] = B[4] + o + E | 0, B[4] = B[0] + a + S | 0, B[0] = A;}, _doFinalize: function _doFinalize() {var e = this._data,t = e.words,r = 8 * this._nDataBytes,n = 8 * e.sigBytes;t[n >>> 5] |= 128 << 24 - n % 32, t[14 + (n + 64 >>> 9 << 4)] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8), e.sigBytes = 4 * (t.length + 1), this._process();for (var i = this._hash, o = i.words, a = 0; a < 5; a++) {var s = o[a];o[a] = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8);}return i;}, clone: function clone() {var e = o.clone.call(this);return e._hash = this._hash.clone(), e;} });function p(e, t, r) {return e ^ t ^ r;}function _(e, t, r) {return e & t | ~e & r;}function g(e, t, r) {return (e | ~t) ^ r;}function v(e, t, r) {return e & r | t & ~r;}function w(e, t, r) {return e ^ (t | ~r);}function b(e, t) {return e << t | e >>> 32 - t;}t.RIPEMD160 = o._createHelper(d), t.HmacRIPEMD160 = o._createHmacHelper(d);}(), r.RIPEMD160);}), Q(function (e, t) {var r, n, i, o, a, s;e.exports = (n = (r = ee).lib, i = n.Base, o = r.enc, a = o.Utf8, s = r.algo, void (s.HMAC = i.extend({ init: function init(e, t) {e = this._hasher = new e.init(), "string" == typeof t && (t = a.parse(t));var r = e.blockSize,n = 4 * r;t.sigBytes > n && (t = e.finalize(t)), t.clamp();for (var i = this._oKey = t.clone(), o = this._iKey = t.clone(), s = i.words, h = o.words, l = 0; l < r; l++) {s[l] ^= 1549556828, h[l] ^= 909522486;}i.sigBytes = o.sigBytes = n, this.reset();}, reset: function reset() {var e = this._hasher;e.reset(), e.update(this._iKey);}, update: function update(e) {return this._hasher.update(e), this;}, finalize: function finalize(e) {var t = this._hasher,r = t.finalize(e);t.reset();var n = t.finalize(this._oKey.clone().concat(r));return n;} })));}), Q(function (e, t) {var r, n, i, o, a, s, h, l, f;e.exports = (i = (n = r = ee).lib, o = i.Base, a = i.WordArray, s = n.algo, h = s.SHA1, l = s.HMAC, f = s.PBKDF2 = o.extend({ cfg: o.extend({ keySize: 4, hasher: h, iterations: 1 }), init: function init(e) {this.cfg = this.cfg.extend(e);}, compute: function compute(e, t) {for (var r = this.cfg, n = l.create(r.hasher, e), i = a.create(), o = a.create([1]), s = i.words, h = o.words, f = r.keySize, c = r.iterations; s.length < f;) {var u = n.update(t).finalize(o);n.reset();for (var d = u.words, p = d.length, _ = u, g = 1; g < c; g++) {_ = n.finalize(_), n.reset();for (var v = _.words, w = 0; w < p; w++) {d[w] ^= v[w];}}i.concat(u), h[0]++;}return i.sigBytes = 4 * f, i;} }), n.PBKDF2 = function (e, t, r) {return f.create(r).compute(e, t);}, r.PBKDF2);}), Q(function (e, t) {var r, n, i, o, a, s, h, l;e.exports = (i = (n = r = ee).lib, o = i.Base, a = i.WordArray, s = n.algo, h = s.MD5, l = s.EvpKDF = o.extend({ cfg: o.extend({ keySize: 4, hasher: h, iterations: 1 }), init: function init(e) {this.cfg = this.cfg.extend(e);}, compute: function compute(e, t) {for (var r = this.cfg, n = r.hasher.create(), i = a.create(), o = i.words, s = r.keySize, h = r.iterations; o.length < s;) {l && n.update(l);var l = n.update(e).finalize(t);n.reset();for (var f = 1; f < h; f++) {l = n.finalize(l), n.reset();}i.concat(l);}return i.sigBytes = 4 * s, i;} }), n.EvpKDF = function (e, t, r) {return l.create(r).compute(e, t);}, r.EvpKDF);}), Q(function (e, t) {var r, n, i, o, a, s, h, l, f, c, u, d, p, _, g, v, w, b, y, m, k, E, S, x;e.exports = void ((r = ee).lib.Cipher || (i = r, o = i.lib, a = o.Base, s = o.WordArray, h = o.BufferedBlockAlgorithm, l = i.enc, l.Utf8, f = l.Base64, c = i.algo, u = c.EvpKDF, d = o.Cipher = h.extend({ cfg: a.extend(), createEncryptor: function createEncryptor(e, t) {return this.create(this._ENC_XFORM_MODE, e, t);}, createDecryptor: function createDecryptor(e, t) {return this.create(this._DEC_XFORM_MODE, e, t);}, init: function init(e, t, r) {this.cfg = this.cfg.extend(r), this._xformMode = e, this._key = t, this.reset();}, reset: function reset() {h.reset.call(this), this._doReset();}, process: function process(e) {return this._append(e), this._process();}, finalize: function finalize(e) {e && this._append(e);var t = this._doFinalize();return t;}, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function () {function e(e) {return "string" == typeof e ? x : k;}return function (t) {return { encrypt: function encrypt(r, n, i) {return e(n).encrypt(t, r, n, i);}, decrypt: function decrypt(r, n, i) {return e(n).decrypt(t, r, n, i);} };};}() }), o.StreamCipher = d.extend({ _doFinalize: function _doFinalize() {var e = this._process(!0);return e;}, blockSize: 1 }), p = i.mode = {}, _ = o.BlockCipherMode = a.extend({ createEncryptor: function createEncryptor(e, t) {return this.Encryptor.create(e, t);}, createDecryptor: function createDecryptor(e, t) {return this.Decryptor.create(e, t);}, init: function init(e, t) {this._cipher = e, this._iv = t;} }), g = p.CBC = function () {var e = _.extend();function t(e, t, r) {var i = this._iv;if (i) {var o = i;this._iv = n;} else var o = this._prevBlock;for (var a = 0; a < r; a++) {e[t + a] ^= o[a];}}return e.Encryptor = e.extend({ processBlock: function processBlock(e, r) {var n = this._cipher,i = n.blockSize;t.call(this, e, r, i), n.encryptBlock(e, r), this._prevBlock = e.slice(r, r + i);} }), e.Decryptor = e.extend({ processBlock: function processBlock(e, r) {var n = this._cipher,i = n.blockSize,o = e.slice(r, r + i);n.decryptBlock(e, r), t.call(this, e, r, i), this._prevBlock = o;} }), e;}(), v = i.pad = {}, w = v.Pkcs7 = { pad: function pad(e, t) {for (var r = 4 * t, n = r - e.sigBytes % r, i = n << 24 | n << 16 | n << 8 | n, o = [], a = 0; a < n; a += 4) {o.push(i);}var h = s.create(o, n);e.concat(h);}, unpad: function unpad(e) {var t = 255 & e.words[e.sigBytes - 1 >>> 2];e.sigBytes -= t;} }, o.BlockCipher = d.extend({ cfg: d.cfg.extend({ mode: g, padding: w }), reset: function reset() {d.reset.call(this);var e = this.cfg,t = e.iv,r = e.mode;if (this._xformMode == this._ENC_XFORM_MODE) var n = r.createEncryptor;else {var n = r.createDecryptor;this._minBufferSize = 1;}this._mode && this._mode.__creator == n ? this._mode.init(this, t && t.words) : (this._mode = n.call(r, this, t && t.words), this._mode.__creator = n);}, _doProcessBlock: function _doProcessBlock(e, t) {this._mode.processBlock(e, t);}, _doFinalize: function _doFinalize() {var e = this.cfg.padding;if (this._xformMode == this._ENC_XFORM_MODE) {e.pad(this._data, this.blockSize);var t = this._process(!0);} else {var t = this._process(!0);e.unpad(t);}return t;}, blockSize: 4 }), b = o.CipherParams = a.extend({ init: function init(e) {this.mixIn(e);}, toString: function toString(e) {return (e || this.formatter).stringify(this);} }), y = i.format = {}, m = y.OpenSSL = { stringify: function stringify(e) {var t = e.ciphertext,r = e.salt;if (r) var n = s.create([1398893684, 1701076831]).concat(r).concat(t);else var n = t;return n.toString(f);}, parse: function parse(e) {var t = f.parse(e),r = t.words;if (1398893684 == r[0] && 1701076831 == r[1]) {var n = s.create(r.slice(2, 4));r.splice(0, 4), t.sigBytes -= 16;}return b.create({ ciphertext: t, salt: n });} }, k = o.SerializableCipher = a.extend({ cfg: a.extend({ format: m }), encrypt: function encrypt(e, t, r, n) {n = this.cfg.extend(n);var i = e.createEncryptor(r, n),o = i.finalize(t),a = i.cfg;return b.create({ ciphertext: o, key: r, iv: a.iv, algorithm: e, mode: a.mode, padding: a.padding, blockSize: e.blockSize, formatter: n.format });}, decrypt: function decrypt(e, t, r, n) {n = this.cfg.extend(n), t = this._parse(t, n.format);var i = e.createDecryptor(r, n).finalize(t.ciphertext);return i;}, _parse: function _parse(e, t) {return "string" == typeof e ? t.parse(e, this) : e;} }), E = i.kdf = {}, S = E.OpenSSL = { execute: function execute(e, t, r, n) {n || (n = s.random(8));var i = u.create({ keySize: t + r }).compute(e, n),o = s.create(i.words.slice(t), 4 * r);return i.sigBytes = 4 * t, b.create({ key: i, iv: o, salt: n });} }, x = o.PasswordBasedCipher = k.extend({ cfg: k.cfg.extend({ kdf: S }), encrypt: function encrypt(e, t, r, n) {var i = (n = this.cfg.extend(n)).kdf.execute(r, e.keySize, e.ivSize);n.iv = i.iv;var o = k.encrypt.call(this, e, t, i.key, n);return o.mixIn(i), o;}, decrypt: function decrypt(e, t, r, n) {n = this.cfg.extend(n), t = this._parse(t, n.format);var i = n.kdf.execute(r, e.keySize, e.ivSize, t.salt);n.iv = i.iv;var o = k.decrypt.call(this, e, t, i.key, n);return o;} })));}), Q(function (e, t) {var r;e.exports = ((r = ee).mode.CFB = function () {var e = r.lib.BlockCipherMode.extend();function t(e, t, r, n) {var i = this._iv;if (i) {var o = i.slice(0);this._iv = void 0;} else o = this._prevBlock;n.encryptBlock(o, 0);for (var a = 0; a < r; a++) {e[t + a] ^= o[a];}}return e.Encryptor = e.extend({ processBlock: function processBlock(e, r) {var n = this._cipher,i = n.blockSize;t.call(this, e, r, i, n), this._prevBlock = e.slice(r, r + i);} }), e.Decryptor = e.extend({ processBlock: function processBlock(e, r) {var n = this._cipher,i = n.blockSize,o = e.slice(r, r + i);t.call(this, e, r, i, n), this._prevBlock = o;} }), e;}(), r.mode.CFB);}), Q(function (e, t) {var r, n, i;e.exports = ((r = ee).mode.CTR = (n = r.lib.BlockCipherMode.extend(), i = n.Encryptor = n.extend({ processBlock: function processBlock(e, t) {var r = this._cipher,n = r.blockSize,i = this._iv,o = this._counter;i && (o = this._counter = i.slice(0), this._iv = void 0);var a = o.slice(0);r.encryptBlock(a, 0), o[n - 1] = o[n - 1] + 1 | 0;for (var s = 0; s < n; s++) {e[t + s] ^= a[s];}} }), n.Decryptor = i, n), r.mode.CTR);}), Q(function (e, t) {var r;e.exports = ((r = ee).mode.CTRGladman = function () {var e = r.lib.BlockCipherMode.extend();function t(e) {if (255 == (e >> 24 & 255)) {var t = e >> 16 & 255,r = e >> 8 & 255,n = 255 & e;255 === t ? (t = 0, 255 === r ? (r = 0, 255 === n ? n = 0 : ++n) : ++r) : ++t, e = 0, e += t << 16, e += r << 8, e += n;} else e += 1 << 24;return e;}var n = e.Encryptor = e.extend({ processBlock: function processBlock(e, r) {var n = this._cipher,i = n.blockSize,o = this._iv,a = this._counter;o && (a = this._counter = o.slice(0), this._iv = void 0), function (e) {0 === (e[0] = t(e[0])) && (e[1] = t(e[1]));}(a);var s = a.slice(0);n.encryptBlock(s, 0);for (var h = 0; h < i; h++) {e[r + h] ^= s[h];}} });return e.Decryptor = n, e;}(), r.mode.CTRGladman);}), Q(function (e, t) {var r, n, i;e.exports = ((r = ee).mode.OFB = (n = r.lib.BlockCipherMode.extend(), i = n.Encryptor = n.extend({ processBlock: function processBlock(e, t) {var r = this._cipher,n = r.blockSize,i = this._iv,o = this._keystream;i && (o = this._keystream = i.slice(0), this._iv = void 0), r.encryptBlock(o, 0);for (var a = 0; a < n; a++) {e[t + a] ^= o[a];}} }), n.Decryptor = i, n), r.mode.OFB);}), Q(function (e, t) {var r, n;e.exports = ((r = ee).mode.ECB = ((n = r.lib.BlockCipherMode.extend()).Encryptor = n.extend({ processBlock: function processBlock(e, t) {this._cipher.encryptBlock(e, t);} }), n.Decryptor = n.extend({ processBlock: function processBlock(e, t) {this._cipher.decryptBlock(e, t);} }), n), r.mode.ECB);}), Q(function (e, t) {var r;e.exports = ((r = ee).pad.AnsiX923 = { pad: function pad(e, t) {var r = e.sigBytes,n = 4 * t,i = n - r % n,o = r + i - 1;e.clamp(), e.words[o >>> 2] |= i << 24 - o % 4 * 8, e.sigBytes += i;}, unpad: function unpad(e) {var t = 255 & e.words[e.sigBytes - 1 >>> 2];e.sigBytes -= t;} }, r.pad.Ansix923);}), Q(function (e, t) {var r;e.exports = ((r = ee).pad.Iso10126 = { pad: function pad(e, t) {var n = 4 * t,i = n - e.sigBytes % n;e.concat(r.lib.WordArray.random(i - 1)).concat(r.lib.WordArray.create([i << 24], 1));}, unpad: function unpad(e) {var t = 255 & e.words[e.sigBytes - 1 >>> 2];e.sigBytes -= t;} }, r.pad.Iso10126);}), Q(function (e, t) {var r;e.exports = ((r = ee).pad.Iso97971 = { pad: function pad(e, t) {e.concat(r.lib.WordArray.create([2147483648], 1)), r.pad.ZeroPadding.pad(e, t);}, unpad: function unpad(e) {r.pad.ZeroPadding.unpad(e), e.sigBytes--;} }, r.pad.Iso97971);}), Q(function (e, t) {var r;e.exports = ((r = ee).pad.ZeroPadding = { pad: function pad(e, t) {var r = 4 * t;e.clamp(), e.sigBytes += r - (e.sigBytes % r || r);}, unpad: function unpad(e) {for (var t = e.words, r = e.sigBytes - 1; !(t[r >>> 2] >>> 24 - r % 4 * 8 & 255);) {r--;}e.sigBytes = r + 1;} }, r.pad.ZeroPadding);}), Q(function (e, t) {var r;e.exports = ((r = ee).pad.NoPadding = { pad: function pad() {}, unpad: function unpad() {} }, r.pad.NoPadding);}), Q(function (e, t) {var r, n, i, o;e.exports = (i = (n = r = ee).lib.CipherParams, o = n.enc.Hex, n.format.Hex = { stringify: function stringify(e) {return e.ciphertext.toString(o);}, parse: function parse(e) {var t = o.parse(e);return i.create({ ciphertext: t });} }, r.format.Hex);}), Q(function (e, t) {var r;e.exports = (r = ee, function () {var e = r,t = e.lib.BlockCipher,n = e.algo,i = [],o = [],a = [],s = [],h = [],l = [],f = [],c = [],u = [],d = [];!function () {for (var e = [], t = 0; t < 256; t++) {e[t] = t < 128 ? t << 1 : t << 1 ^ 283;}var r = 0,n = 0;for (t = 0; t < 256; t++) {var p = n ^ n << 1 ^ n << 2 ^ n << 3 ^ n << 4;p = p >>> 8 ^ 255 & p ^ 99, i[r] = p, o[p] = r;var _ = e[r],g = e[_],v = e[g],w = 257 * e[p] ^ 16843008 * p;a[r] = w << 24 | w >>> 8, s[r] = w << 16 | w >>> 16, h[r] = w << 8 | w >>> 24, l[r] = w, w = 16843009 * v ^ 65537 * g ^ 257 * _ ^ 16843008 * r, f[p] = w << 24 | w >>> 8, c[p] = w << 16 | w >>> 16, u[p] = w << 8 | w >>> 24, d[p] = w, r ? (r = _ ^ e[e[e[v ^ _]]], n ^= e[e[n]]) : r = n = 1;}}();var p = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],_ = n.AES = t.extend({ _doReset: function _doReset() {if (!this._nRounds || this._keyPriorReset !== this._key) {for (var e = this._keyPriorReset = this._key, t = e.words, r = e.sigBytes / 4, n = 4 * ((this._nRounds = r + 6) + 1), o = this._keySchedule = [], a = 0; a < n; a++) {if (a < r) o[a] = t[a];else {var s = o[a - 1];a % r ? r > 6 && a % r == 4 && (s = i[s >>> 24] << 24 | i[s >>> 16 & 255] << 16 | i[s >>> 8 & 255] << 8 | i[255 & s]) : (s = i[(s = s << 8 | s >>> 24) >>> 24] << 24 | i[s >>> 16 & 255] << 16 | i[s >>> 8 & 255] << 8 | i[255 & s], s ^= p[a / r | 0] << 24), o[a] = o[a - r] ^ s;}}for (var h = this._invKeySchedule = [], l = 0; l < n; l++) {a = n - l, s = l % 4 ? o[a] : o[a - 4], h[l] = l < 4 || a <= 4 ? s : f[i[s >>> 24]] ^ c[i[s >>> 16 & 255]] ^ u[i[s >>> 8 & 255]] ^ d[i[255 & s]];}}}, encryptBlock: function encryptBlock(e, t) {this._doCryptBlock(e, t, this._keySchedule, a, s, h, l, i);}, decryptBlock: function decryptBlock(e, t) {var r = e[t + 1];e[t + 1] = e[t + 3], e[t + 3] = r, this._doCryptBlock(e, t, this._invKeySchedule, f, c, u, d, o), r = e[t + 1], e[t + 1] = e[t + 3], e[t + 3] = r;}, _doCryptBlock: function _doCryptBlock(e, t, r, n, i, o, a, s) {for (var h = this._nRounds, l = e[t] ^ r[0], f = e[t + 1] ^ r[1], c = e[t + 2] ^ r[2], u = e[t + 3] ^ r[3], d = 4, p = 1; p < h; p++) {var _ = n[l >>> 24] ^ i[f >>> 16 & 255] ^ o[c >>> 8 & 255] ^ a[255 & u] ^ r[d++],g = n[f >>> 24] ^ i[c >>> 16 & 255] ^ o[u >>> 8 & 255] ^ a[255 & l] ^ r[d++],v = n[c >>> 24] ^ i[u >>> 16 & 255] ^ o[l >>> 8 & 255] ^ a[255 & f] ^ r[d++],w = n[u >>> 24] ^ i[l >>> 16 & 255] ^ o[f >>> 8 & 255] ^ a[255 & c] ^ r[d++];l = _, f = g, c = v, u = w;}_ = (s[l >>> 24] << 24 | s[f >>> 16 & 255] << 16 | s[c >>> 8 & 255] << 8 | s[255 & u]) ^ r[d++], g = (s[f >>> 24] << 24 | s[c >>> 16 & 255] << 16 | s[u >>> 8 & 255] << 8 | s[255 & l]) ^ r[d++], v = (s[c >>> 24] << 24 | s[u >>> 16 & 255] << 16 | s[l >>> 8 & 255] << 8 | s[255 & f]) ^ r[d++], w = (s[u >>> 24] << 24 | s[l >>> 16 & 255] << 16 | s[f >>> 8 & 255] << 8 | s[255 & c]) ^ r[d++], e[t] = _, e[t + 1] = g, e[t + 2] = v, e[t + 3] = w;}, keySize: 8 });e.AES = t._createHelper(_);}(), r.AES);}), Q(function (e, t) {var r;e.exports = (r = ee, function () {var e = r,t = e.lib,n = t.WordArray,i = t.BlockCipher,o = e.algo,a = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4],s = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32],h = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28],l = [{ 0: 8421888, 268435456: 32768, 536870912: 8421378, 805306368: 2, 1073741824: 512, 1342177280: 8421890, 1610612736: 8389122, 1879048192: 8388608, 2147483648: 514, 2415919104: 8389120, 2684354560: 33280, 2952790016: 8421376, 3221225472: 32770, 3489660928: 8388610, 3758096384: 0, 4026531840: 33282, 134217728: 0, 402653184: 8421890, 671088640: 33282, 939524096: 32768, 1207959552: 8421888, 1476395008: 512, 1744830464: 8421378, 2013265920: 2, 2281701376: 8389120, 2550136832: 33280, 2818572288: 8421376, 3087007744: 8389122, 3355443200: 8388610, 3623878656: 32770, 3892314112: 514, 4160749568: 8388608, 1: 32768, 268435457: 2, 536870913: 8421888, 805306369: 8388608, 1073741825: 8421378, 1342177281: 33280, 1610612737: 512, 1879048193: 8389122, 2147483649: 8421890, 2415919105: 8421376, 2684354561: 8388610, 2952790017: 33282, 3221225473: 514, 3489660929: 8389120, 3758096385: 32770, 4026531841: 0, 134217729: 8421890, 402653185: 8421376, 671088641: 8388608, 939524097: 512, 1207959553: 32768, 1476395009: 8388610, 1744830465: 2, 2013265921: 33282, 2281701377: 32770, 2550136833: 8389122, 2818572289: 514, 3087007745: 8421888, 3355443201: 8389120, 3623878657: 0, 3892314113: 33280, 4160749569: 8421378 }, { 0: 1074282512, 16777216: 16384, 33554432: 524288, 50331648: 1074266128, 67108864: 1073741840, 83886080: 1074282496, 100663296: 1073758208, 117440512: 16, 134217728: 540672, 150994944: 1073758224, 167772160: 1073741824, 184549376: 540688, 201326592: 524304, 218103808: 0, 234881024: 16400, 251658240: 1074266112, 8388608: 1073758208, 25165824: 540688, 41943040: 16, 58720256: 1073758224, 75497472: 1074282512, 92274688: 1073741824, 109051904: 524288, 125829120: 1074266128, 142606336: 524304, 159383552: 0, 176160768: 16384, 192937984: 1074266112, 209715200: 1073741840, 226492416: 540672, 243269632: 1074282496, 260046848: 16400, 268435456: 0, 285212672: 1074266128, 301989888: 1073758224, 318767104: 1074282496, 335544320: 1074266112, 352321536: 16, 369098752: 540688, 385875968: 16384, 402653184: 16400, 419430400: 524288, 436207616: 524304, 452984832: 1073741840, 469762048: 540672, 486539264: 1073758208, 503316480: 1073741824, 520093696: 1074282512, 276824064: 540688, 293601280: 524288, 310378496: 1074266112, 327155712: 16384, 343932928: 1073758208, 360710144: 1074282512, 377487360: 16, 394264576: 1073741824, 411041792: 1074282496, 427819008: 1073741840, 444596224: 1073758224, 461373440: 524304, 478150656: 0, 494927872: 16400, 511705088: 1074266128, 528482304: 540672 }, { 0: 260, 1048576: 0, 2097152: 67109120, 3145728: 65796, 4194304: 65540, 5242880: 67108868, 6291456: 67174660, 7340032: 67174400, 8388608: 67108864, 9437184: 67174656, 10485760: 65792, 11534336: 67174404, 12582912: 67109124, 13631488: 65536, 14680064: 4, 15728640: 256, 524288: 67174656, 1572864: 67174404, 2621440: 0, 3670016: 67109120, 4718592: 67108868, 5767168: 65536, 6815744: 65540, 7864320: 260, 8912896: 4, 9961472: 256, 11010048: 67174400, 12058624: 65796, 13107200: 65792, 14155776: 67109124, 15204352: 67174660, 16252928: 67108864, 16777216: 67174656, 17825792: 65540, 18874368: 65536, 19922944: 67109120, 20971520: 256, 22020096: 67174660, 23068672: 67108868, 24117248: 0, 25165824: 67109124, 26214400: 67108864, 27262976: 4, 28311552: 65792, 29360128: 67174400, 30408704: 260, 31457280: 65796, 32505856: 67174404, 17301504: 67108864, 18350080: 260, 19398656: 67174656, 20447232: 0, 21495808: 65540, 22544384: 67109120, 23592960: 256, 24641536: 67174404, 25690112: 65536, 26738688: 67174660, 27787264: 65796, 28835840: 67108868, 29884416: 67109124, 30932992: 67174400, 31981568: 4, 33030144: 65792 }, { 0: 2151682048, 65536: 2147487808, 131072: 4198464, 196608: 2151677952, 262144: 0, 327680: 4198400, 393216: 2147483712, 458752: 4194368, 524288: 2147483648, 589824: 4194304, 655360: 64, 720896: 2147487744, 786432: 2151678016, 851968: 4160, 917504: 4096, 983040: 2151682112, 32768: 2147487808, 98304: 64, 163840: 2151678016, 229376: 2147487744, 294912: 4198400, 360448: 2151682112, 425984: 0, 491520: 2151677952, 557056: 4096, 622592: 2151682048, 688128: 4194304, 753664: 4160, 819200: 2147483648, 884736: 4194368, 950272: 4198464, 1015808: 2147483712, 1048576: 4194368, 1114112: 4198400, 1179648: 2147483712, 1245184: 0, 1310720: 4160, 1376256: 2151678016, 1441792: 2151682048, 1507328: 2147487808, 1572864: 2151682112, 1638400: 2147483648, 1703936: 2151677952, 1769472: 4198464, 1835008: 2147487744, 1900544: 4194304, 1966080: 64, 2031616: 4096, 1081344: 2151677952, 1146880: 2151682112, 1212416: 0, 1277952: 4198400, 1343488: 4194368, 1409024: 2147483648, 1474560: 2147487808, 1540096: 64, 1605632: 2147483712, 1671168: 4096, 1736704: 2147487744, 1802240: 2151678016, 1867776: 4160, 1933312: 2151682048, 1998848: 4194304, 2064384: 4198464 }, { 0: 128, 4096: 17039360, 8192: 262144, 12288: 536870912, 16384: 537133184, 20480: 16777344, 24576: 553648256, 28672: 262272, 32768: 16777216, 36864: 537133056, 40960: 536871040, 45056: 553910400, 49152: 553910272, 53248: 0, 57344: 17039488, 61440: 553648128, 2048: 17039488, 6144: 553648256, 10240: 128, 14336: 17039360, 18432: 262144, 22528: 537133184, 26624: 553910272, 30720: 536870912, 34816: 537133056, 38912: 0, 43008: 553910400, 47104: 16777344, 51200: 536871040, 55296: 553648128, 59392: 16777216, 63488: 262272, 65536: 262144, 69632: 128, 73728: 536870912, 77824: 553648256, 81920: 16777344, 86016: 553910272, 90112: 537133184, 94208: 16777216, 98304: 553910400, 102400: 553648128, 106496: 17039360, 110592: 537133056, 114688: 262272, 118784: 536871040, 122880: 0, 126976: 17039488, 67584: 553648256, 71680: 16777216, 75776: 17039360, 79872: 537133184, 83968: 536870912, 88064: 17039488, 92160: 128, 96256: 553910272, 100352: 262272, 104448: 553910400, 108544: 0, 112640: 553648128, 116736: 16777344, 120832: 262144, 124928: 537133056, 129024: 536871040 }, { 0: 268435464, 256: 8192, 512: 270532608, 768: 270540808, 1024: 268443648, 1280: 2097152, 1536: 2097160, 1792: 268435456, 2048: 0, 2304: 268443656, 2560: 2105344, 2816: 8, 3072: 270532616, 3328: 2105352, 3584: 8200, 3840: 270540800, 128: 270532608, 384: 270540808, 640: 8, 896: 2097152, 1152: 2105352, 1408: 268435464, 1664: 268443648, 1920: 8200, 2176: 2097160, 2432: 8192, 2688: 268443656, 2944: 270532616, 3200: 0, 3456: 270540800, 3712: 2105344, 3968: 268435456, 4096: 268443648, 4352: 270532616, 4608: 270540808, 4864: 8200, 5120: 2097152, 5376: 268435456, 5632: 268435464, 5888: 2105344, 6144: 2105352, 6400: 0, 6656: 8, 6912: 270532608, 7168: 8192, 7424: 268443656, 7680: 270540800, 7936: 2097160, 4224: 8, 4480: 2105344, 4736: 2097152, 4992: 268435464, 5248: 268443648, 5504: 8200, 5760: 270540808, 6016: 270532608, 6272: 270540800, 6528: 270532616, 6784: 8192, 7040: 2105352, 7296: 2097160, 7552: 0, 7808: 268435456, 8064: 268443656 }, { 0: 1048576, 16: 33555457, 32: 1024, 48: 1049601, 64: 34604033, 80: 0, 96: 1, 112: 34603009, 128: 33555456, 144: 1048577, 160: 33554433, 176: 34604032, 192: 34603008, 208: 1025, 224: 1049600, 240: 33554432, 8: 34603009, 24: 0, 40: 33555457, 56: 34604032, 72: 1048576, 88: 33554433, 104: 33554432, 120: 1025, 136: 1049601, 152: 33555456, 168: 34603008, 184: 1048577, 200: 1024, 216: 34604033, 232: 1, 248: 1049600, 256: 33554432, 272: 1048576, 288: 33555457, 304: 34603009, 320: 1048577, 336: 33555456, 352: 34604032, 368: 1049601, 384: 1025, 400: 34604033, 416: 1049600, 432: 1, 448: 0, 464: 34603008, 480: 33554433, 496: 1024, 264: 1049600, 280: 33555457, 296: 34603009, 312: 1, 328: 33554432, 344: 1048576, 360: 1025, 376: 34604032, 392: 33554433, 408: 34603008, 424: 0, 440: 34604033, 456: 1049601, 472: 1024, 488: 33555456, 504: 1048577 }, { 0: 134219808, 1: 131072, 2: 134217728, 3: 32, 4: 131104, 5: 134350880, 6: 134350848, 7: 2048, 8: 134348800, 9: 134219776, 10: 133120, 11: 134348832, 12: 2080, 13: 0, 14: 134217760, 15: 133152, 2147483648: 2048, 2147483649: 134350880, 2147483650: 134219808, 2147483651: 134217728, 2147483652: 134348800, 2147483653: 133120, 2147483654: 133152, 2147483655: 32, 2147483656: 134217760, 2147483657: 2080, 2147483658: 131104, 2147483659: 134350848, 2147483660: 0, 2147483661: 134348832, 2147483662: 134219776, 2147483663: 131072, 16: 133152, 17: 134350848, 18: 32, 19: 2048, 20: 134219776, 21: 134217760, 22: 134348832, 23: 131072, 24: 0, 25: 131104, 26: 134348800, 27: 134219808, 28: 134350880, 29: 133120, 30: 2080, 31: 134217728, 2147483664: 131072, 2147483665: 2048, 2147483666: 134348832, 2147483667: 133152, 2147483668: 32, 2147483669: 134348800, 2147483670: 134217728, 2147483671: 134219808, 2147483672: 134350880, 2147483673: 134217760, 2147483674: 134219776, 2147483675: 0, 2147483676: 133120, 2147483677: 2080, 2147483678: 131104, 2147483679: 134350848 }],f = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679],c = o.DES = i.extend({ _doReset: function _doReset() {for (var e = this._key.words, t = [], r = 0; r < 56; r++) {var n = a[r] - 1;t[r] = e[n >>> 5] >>> 31 - n % 32 & 1;}for (var i = this._subKeys = [], o = 0; o < 16; o++) {var l = i[o] = [],f = h[o];for (r = 0; r < 24; r++) {l[r / 6 | 0] |= t[(s[r] - 1 + f) % 28] << 31 - r % 6, l[4 + (r / 6 | 0)] |= t[28 + (s[r + 24] - 1 + f) % 28] << 31 - r % 6;}for (l[0] = l[0] << 1 | l[0] >>> 31, r = 1; r < 7; r++) {l[r] = l[r] >>> 4 * (r - 1) + 3;}l[7] = l[7] << 5 | l[7] >>> 27;}var c = this._invSubKeys = [];for (r = 0; r < 16; r++) {c[r] = i[15 - r];}}, encryptBlock: function encryptBlock(e, t) {this._doCryptBlock(e, t, this._subKeys);}, decryptBlock: function decryptBlock(e, t) {this._doCryptBlock(e, t, this._invSubKeys);}, _doCryptBlock: function _doCryptBlock(e, t, r) {this._lBlock = e[t], this._rBlock = e[t + 1], u.call(this, 4, 252645135), u.call(this, 16, 65535), d.call(this, 2, 858993459), d.call(this, 8, 16711935), u.call(this, 1, 1431655765);for (var n = 0; n < 16; n++) {for (var i = r[n], o = this._lBlock, a = this._rBlock, s = 0, h = 0; h < 8; h++) {s |= l[h][((a ^ i[h]) & f[h]) >>> 0];}this._lBlock = a, this._rBlock = o ^ s;}var c = this._lBlock;this._lBlock = this._rBlock, this._rBlock = c, u.call(this, 1, 1431655765), d.call(this, 8, 16711935), d.call(this, 2, 858993459), u.call(this, 16, 65535), u.call(this, 4, 252645135), e[t] = this._lBlock, e[t + 1] = this._rBlock;}, keySize: 2, ivSize: 2, blockSize: 2 });function u(e, t) {var r = (this._lBlock >>> e ^ this._rBlock) & t;this._rBlock ^= r, this._lBlock ^= r << e;}function d(e, t) {var r = (this._rBlock >>> e ^ this._lBlock) & t;this._lBlock ^= r, this._rBlock ^= r << e;}e.DES = i._createHelper(c);var p = o.TripleDES = i.extend({ _doReset: function _doReset() {var e = this._key.words;this._des1 = c.createEncryptor(n.create(e.slice(0, 2))), this._des2 = c.createEncryptor(n.create(e.slice(2, 4))), this._des3 = c.createEncryptor(n.create(e.slice(4, 6)));}, encryptBlock: function encryptBlock(e, t) {this._des1.encryptBlock(e, t), this._des2.decryptBlock(e, t), this._des3.encryptBlock(e, t);}, decryptBlock: function decryptBlock(e, t) {this._des3.decryptBlock(e, t), this._des2.encryptBlock(e, t), this._des1.decryptBlock(e, t);}, keySize: 6, ivSize: 2, blockSize: 2 });e.TripleDES = i._createHelper(p);}(), r.TripleDES);}), Q(function (e, t) {var r;e.exports = (r = ee, function () {var e = r,t = e.lib.StreamCipher,n = e.algo,i = n.RC4 = t.extend({ _doReset: function _doReset() {for (var e = this._key, t = e.words, r = e.sigBytes, n = this._S = [], i = 0; i < 256; i++) {n[i] = i;}i = 0;for (var o = 0; i < 256; i++) {var a = i % r,s = t[a >>> 2] >>> 24 - a % 4 * 8 & 255;o = (o + n[i] + s) % 256;var h = n[i];n[i] = n[o], n[o] = h;}this._i = this._j = 0;}, _doProcessBlock: function _doProcessBlock(e, t) {e[t] ^= o.call(this);}, keySize: 8, ivSize: 0 });function o() {for (var e = this._S, t = this._i, r = this._j, n = 0, i = 0; i < 4; i++) {r = (r + e[t = (t + 1) % 256]) % 256;var o = e[t];e[t] = e[r], e[r] = o, n |= e[(e[t] + e[r]) % 256] << 24 - 8 * i;}return this._i = t, this._j = r, n;}e.RC4 = t._createHelper(i);var a = n.RC4Drop = i.extend({ cfg: i.cfg.extend({ drop: 192 }), _doReset: function _doReset() {i._doReset.call(this);for (var e = this.cfg.drop; e > 0; e--) {o.call(this);}} });e.RC4Drop = t._createHelper(a);}(), r.RC4);}), Q(function (e, t) {var r;e.exports = (r = ee, function () {var e = r,t = e.lib.StreamCipher,n = e.algo,i = [],o = [],a = [],s = n.Rabbit = t.extend({ _doReset: function _doReset() {for (var e = this._key.words, t = this.cfg.iv, r = 0; r < 4; r++) {e[r] = 16711935 & (e[r] << 8 | e[r] >>> 24) | 4278255360 & (e[r] << 24 | e[r] >>> 8);}var n = this._X = [e[0], e[3] << 16 | e[2] >>> 16, e[1], e[0] << 16 | e[3] >>> 16, e[2], e[1] << 16 | e[0] >>> 16, e[3], e[2] << 16 | e[1] >>> 16],i = this._C = [e[2] << 16 | e[2] >>> 16, 4294901760 & e[0] | 65535 & e[1], e[3] << 16 | e[3] >>> 16, 4294901760 & e[1] | 65535 & e[2], e[0] << 16 | e[0] >>> 16, 4294901760 & e[2] | 65535 & e[3], e[1] << 16 | e[1] >>> 16, 4294901760 & e[3] | 65535 & e[0]];for (this._b = 0, r = 0; r < 4; r++) {h.call(this);}for (r = 0; r < 8; r++) {i[r] ^= n[r + 4 & 7];}if (t) {var o = t.words,a = o[0],s = o[1],l = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8),f = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),c = l >>> 16 | 4294901760 & f,u = f << 16 | 65535 & l;for (i[0] ^= l, i[1] ^= c, i[2] ^= f, i[3] ^= u, i[4] ^= l, i[5] ^= c, i[6] ^= f, i[7] ^= u, r = 0; r < 4; r++) {h.call(this);}}}, _doProcessBlock: function _doProcessBlock(e, t) {var r = this._X;h.call(this), i[0] = r[0] ^ r[5] >>> 16 ^ r[3] << 16, i[1] = r[2] ^ r[7] >>> 16 ^ r[5] << 16, i[2] = r[4] ^ r[1] >>> 16 ^ r[7] << 16, i[3] = r[6] ^ r[3] >>> 16 ^ r[1] << 16;for (var n = 0; n < 4; n++) {i[n] = 16711935 & (i[n] << 8 | i[n] >>> 24) | 4278255360 & (i[n] << 24 | i[n] >>> 8), e[t + n] ^= i[n];}}, blockSize: 4, ivSize: 2 });function h() {for (var e = this._X, t = this._C, r = 0; r < 8; r++) {o[r] = t[r];}for (t[0] = t[0] + 1295307597 + this._b | 0, t[1] = t[1] + 3545052371 + (t[0] >>> 0 < o[0] >>> 0 ? 1 : 0) | 0, t[2] = t[2] + 886263092 + (t[1] >>> 0 < o[1] >>> 0 ? 1 : 0) | 0, t[3] = t[3] + 1295307597 + (t[2] >>> 0 < o[2] >>> 0 ? 1 : 0) | 0, t[4] = t[4] + 3545052371 + (t[3] >>> 0 < o[3] >>> 0 ? 1 : 0) | 0, t[5] = t[5] + 886263092 + (t[4] >>> 0 < o[4] >>> 0 ? 1 : 0) | 0, t[6] = t[6] + 1295307597 + (t[5] >>> 0 < o[5] >>> 0 ? 1 : 0) | 0, t[7] = t[7] + 3545052371 + (t[6] >>> 0 < o[6] >>> 0 ? 1 : 0) | 0, this._b = t[7] >>> 0 < o[7] >>> 0 ? 1 : 0, r = 0; r < 8; r++) {var n = e[r] + t[r],i = 65535 & n,s = n >>> 16,h = ((i * i >>> 17) + i * s >>> 15) + s * s,l = ((4294901760 & n) * n | 0) + ((65535 & n) * n | 0);a[r] = h ^ l;}e[0] = a[0] + (a[7] << 16 | a[7] >>> 16) + (a[6] << 16 | a[6] >>> 16) | 0, e[1] = a[1] + (a[0] << 8 | a[0] >>> 24) + a[7] | 0, e[2] = a[2] + (a[1] << 16 | a[1] >>> 16) + (a[0] << 16 | a[0] >>> 16) | 0, e[3] = a[3] + (a[2] << 8 | a[2] >>> 24) + a[1] | 0, e[4] = a[4] + (a[3] << 16 | a[3] >>> 16) + (a[2] << 16 | a[2] >>> 16) | 0, e[5] = a[5] + (a[4] << 8 | a[4] >>> 24) + a[3] | 0, e[6] = a[6] + (a[5] << 16 | a[5] >>> 16) + (a[4] << 16 | a[4] >>> 16) | 0, e[7] = a[7] + (a[6] << 8 | a[6] >>> 24) + a[5] | 0;}e.Rabbit = t._createHelper(s);}(), r.Rabbit);}), Q(function (e, t) {var r;e.exports = (r = ee, function () {var e = r,t = e.lib.StreamCipher,n = e.algo,i = [],o = [],a = [],s = n.RabbitLegacy = t.extend({ _doReset: function _doReset() {var e = this._key.words,t = this.cfg.iv,r = this._X = [e[0], e[3] << 16 | e[2] >>> 16, e[1], e[0] << 16 | e[3] >>> 16, e[2], e[1] << 16 | e[0] >>> 16, e[3], e[2] << 16 | e[1] >>> 16],n = this._C = [e[2] << 16 | e[2] >>> 16, 4294901760 & e[0] | 65535 & e[1], e[3] << 16 | e[3] >>> 16, 4294901760 & e[1] | 65535 & e[2], e[0] << 16 | e[0] >>> 16, 4294901760 & e[2] | 65535 & e[3], e[1] << 16 | e[1] >>> 16, 4294901760 & e[3] | 65535 & e[0]];this._b = 0;for (var i = 0; i < 4; i++) {h.call(this);}for (i = 0; i < 8; i++) {n[i] ^= r[i + 4 & 7];}if (t) {var o = t.words,a = o[0],s = o[1],l = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8),f = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),c = l >>> 16 | 4294901760 & f,u = f << 16 | 65535 & l;for (n[0] ^= l, n[1] ^= c, n[2] ^= f, n[3] ^= u, n[4] ^= l, n[5] ^= c, n[6] ^= f, n[7] ^= u, i = 0; i < 4; i++) {h.call(this);}}}, _doProcessBlock: function _doProcessBlock(e, t) {var r = this._X;h.call(this), i[0] = r[0] ^ r[5] >>> 16 ^ r[3] << 16, i[1] = r[2] ^ r[7] >>> 16 ^ r[5] << 16, i[2] = r[4] ^ r[1] >>> 16 ^ r[7] << 16, i[3] = r[6] ^ r[3] >>> 16 ^ r[1] << 16;for (var n = 0; n < 4; n++) {i[n] = 16711935 & (i[n] << 8 | i[n] >>> 24) | 4278255360 & (i[n] << 24 | i[n] >>> 8), e[t + n] ^= i[n];}}, blockSize: 4, ivSize: 2 });function h() {for (var e = this._X, t = this._C, r = 0; r < 8; r++) {o[r] = t[r];}for (t[0] = t[0] + 1295307597 + this._b | 0, t[1] = t[1] + 3545052371 + (t[0] >>> 0 < o[0] >>> 0 ? 1 : 0) | 0, t[2] = t[2] + 886263092 + (t[1] >>> 0 < o[1] >>> 0 ? 1 : 0) | 0, t[3] = t[3] + 1295307597 + (t[2] >>> 0 < o[2] >>> 0 ? 1 : 0) | 0, t[4] = t[4] + 3545052371 + (t[3] >>> 0 < o[3] >>> 0 ? 1 : 0) | 0, t[5] = t[5] + 886263092 + (t[4] >>> 0 < o[4] >>> 0 ? 1 : 0) | 0, t[6] = t[6] + 1295307597 + (t[5] >>> 0 < o[5] >>> 0 ? 1 : 0) | 0, t[7] = t[7] + 3545052371 + (t[6] >>> 0 < o[6] >>> 0 ? 1 : 0) | 0, this._b = t[7] >>> 0 < o[7] >>> 0 ? 1 : 0, r = 0; r < 8; r++) {var n = e[r] + t[r],i = 65535 & n,s = n >>> 16,h = ((i * i >>> 17) + i * s >>> 15) + s * s,l = ((4294901760 & n) * n | 0) + ((65535 & n) * n | 0);a[r] = h ^ l;}e[0] = a[0] + (a[7] << 16 | a[7] >>> 16) + (a[6] << 16 | a[6] >>> 16) | 0, e[1] = a[1] + (a[0] << 8 | a[0] >>> 24) + a[7] | 0, e[2] = a[2] + (a[1] << 16 | a[1] >>> 16) + (a[0] << 16 | a[0] >>> 16) | 0, e[3] = a[3] + (a[2] << 8 | a[2] >>> 24) + a[1] | 0, e[4] = a[4] + (a[3] << 16 | a[3] >>> 16) + (a[2] << 16 | a[2] >>> 16) | 0, e[5] = a[5] + (a[4] << 8 | a[4] >>> 24) + a[3] | 0, e[6] = a[6] + (a[5] << 16 | a[5] >>> 16) + (a[4] << 16 | a[4] >>> 16) | 0, e[7] = a[7] + (a[6] << 8 | a[6] >>> 24) + a[5] | 0;}e.RabbitLegacy = t._createHelper(s);}(), r.RabbitLegacy);}), Q(function (e, t) {e.exports = ee;}));function re() {throw new Error("setTimeout has not been defined");}function ne() {throw new Error("clearTimeout has not been defined");}var ie = re,oe = ne;function ae(e) {if (ie === setTimeout) return setTimeout(e, 0);if ((ie === re || !ie) && setTimeout) return ie = setTimeout, setTimeout(e, 0);try {return ie(e, 0);} catch (t) {try {return ie.call(null, e, 0);} catch (t) {return ie.call(this, e, 0);}}}"function" == typeof e.setTimeout && (ie = setTimeout), "function" == typeof e.clearTimeout && (oe = clearTimeout);var se,he = [],le = !1,fe = -1;function ce() {le && se && (le = !1, se.length ? he = se.concat(he) : fe = -1, he.length && ue());}function ue() {if (!le) {var e = ae(ce);le = !0;for (var t = he.length; t;) {for (se = he, he = []; ++fe < t;) {se && se[fe].run();}fe = -1, t = he.length;}se = null, le = !1, function (e) {if (oe === clearTimeout) return clearTimeout(e);if ((oe === ne || !oe) && clearTimeout) return oe = clearTimeout, clearTimeout(e);try {oe(e);} catch (t) {try {return oe.call(null, e);} catch (t) {return oe.call(this, e);}}}(e);}}function de(e) {var t = new Array(arguments.length - 1);if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) {t[r - 1] = arguments[r];}he.push(new pe(e, t)), 1 !== he.length || le || ae(ue);}function pe(e, t) {this.fun = e, this.array = t;}pe.prototype.run = function () {this.fun.apply(null, this.array);};var _e = e.performance || {};_e.now || _e.mozNow || _e.msNow || _e.oNow || _e.webkitNow;function ge() {}function ve() {ve.init.call(this);}function we(e) {return void 0 === e._maxListeners ? ve.defaultMaxListeners : e._maxListeners;}function be(e, t, r) {if (t) e.call(r);else for (var n = e.length, i = Ae(e, n), o = 0; o < n; ++o) {i[o].call(r);}}function ye(e, t, r, n) {if (t) e.call(r, n);else for (var i = e.length, o = Ae(e, i), a = 0; a < i; ++a) {o[a].call(r, n);}}function me(e, t, r, n, i) {if (t) e.call(r, n, i);else for (var o = e.length, a = Ae(e, o), s = 0; s < o; ++s) {a[s].call(r, n, i);}}function ke(e, t, r, n, i, o) {if (t) e.call(r, n, i, o);else for (var a = e.length, s = Ae(e, a), h = 0; h < a; ++h) {s[h].call(r, n, i, o);}}function Ee(e, t, r, n) {if (t) e.apply(r, n);else for (var i = e.length, o = Ae(e, i), a = 0; a < i; ++a) {o[a].apply(r, n);}}function Se(e, t, r, n) {var i, o, a, s;if ("function" != typeof r) throw new TypeError('"listener" argument must be a function');if ((o = e._events) ? (o.newListener && (e.emit("newListener", t, r.listener ? r.listener : r), o = e._events), a = o[t]) : (o = e._events = new ge(), e._eventsCount = 0), a) {if ("function" == typeof a ? a = o[t] = n ? [r, a] : [a, r] : n ? a.unshift(r) : a.push(r), !a.warned && (i = we(e)) && i > 0 && a.length > i) {a.warned = !0;var h = new Error("Possible EventEmitter memory leak detected. " + a.length + " " + t + " listeners added. Use emitter.setMaxListeners() to increase limit");h.name = "MaxListenersExceededWarning", h.emitter = e, h.type = t, h.count = a.length, s = h, "function" == typeof console.warn ? console.warn(s) : console.log(s);}} else a = o[t] = r, ++e._eventsCount;return e;}function xe(e, t, r) {var n = !1;function i() {e.removeListener(t, i), n || (n = !0, r.apply(e, arguments));}return i.listener = r, i;}function Re(e) {var t = this._events;if (t) {var r = t[e];if ("function" == typeof r) return 1;if (r) return r.length;}return 0;}function Ae(e, t) {for (var r = new Array(t); t--;) {r[t] = e[t];}return r;}ge.prototype = Object.create(null), ve.EventEmitter = ve, ve.usingDomains = !1, ve.prototype.domain = void 0, ve.prototype._events = void 0, ve.prototype._maxListeners = void 0, ve.defaultMaxListeners = 10, ve.init = function () {this.domain = null, ve.usingDomains && (void 0).active && (void 0).Domain, this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = new ge(), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;}, ve.prototype.setMaxListeners = function (e) {if ("number" != typeof e || e < 0 || isNaN(e)) throw new TypeError('"n" argument must be a positive number');return this._maxListeners = e, this;}, ve.prototype.getMaxListeners = function () {return we(this);}, ve.prototype.emit = function (e) {var t,r,n,i,o,a,s,h = "error" === e;if (a = this._events) h = h && null == a.error;else if (!h) return !1;if (s = this.domain, h) {if (t = arguments[1], !s) {if (t instanceof Error) throw t;var l = new Error('Uncaught, unspecified "error" event. (' + t + ")");throw l.context = t, l;}return t || (t = new Error('Uncaught, unspecified "error" event')), t.domainEmitter = this, t.domain = s, t.domainThrown = !1, s.emit("error", t), !1;}if (!(r = a[e])) return !1;var f = "function" == typeof r;switch (n = arguments.length) {case 1:be(r, f, this);break;case 2:ye(r, f, this, arguments[1]);break;case 3:me(r, f, this, arguments[1], arguments[2]);break;case 4:ke(r, f, this, arguments[1], arguments[2], arguments[3]);break;default:for (i = new Array(n - 1), o = 1; o < n; o++) {i[o - 1] = arguments[o];}Ee(r, f, this, i);}return !0;}, ve.prototype.addListener = function (e, t) {return Se(this, e, t, !1);}, ve.prototype.on = ve.prototype.addListener, ve.prototype.prependListener = function (e, t) {return Se(this, e, t, !0);}, ve.prototype.once = function (e, t) {if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');return this.on(e, xe(this, e, t)), this;}, ve.prototype.prependOnceListener = function (e, t) {if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');return this.prependListener(e, xe(this, e, t)), this;}, ve.prototype.removeListener = function (e, t) {var r, n, i, o, a;if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');if (!(n = this._events)) return this;if (!(r = n[e])) return this;if (r === t || r.listener && r.listener === t) 0 == --this._eventsCount ? this._events = new ge() : (delete n[e], n.removeListener && this.emit("removeListener", e, r.listener || t));else if ("function" != typeof r) {for (i = -1, o = r.length; o-- > 0;) {if (r[o] === t || r[o].listener && r[o].listener === t) {a = r[o].listener, i = o;break;}}if (i < 0) return this;if (1 === r.length) {if (r[0] = void 0, 0 == --this._eventsCount) return this._events = new ge(), this;delete n[e];} else !function (e, t) {for (var r = t, n = r + 1, i = e.length; n < i; r += 1, n += 1) {e[r] = e[n];}e.pop();}(r, i);n.removeListener && this.emit("removeListener", e, a || t);}return this;}, ve.prototype.removeAllListeners = function (e) {var t, r;if (!(r = this._events)) return this;if (!r.removeListener) return 0 === arguments.length ? (this._events = new ge(), this._eventsCount = 0) : r[e] && (0 == --this._eventsCount ? this._events = new ge() : delete r[e]), this;if (0 === arguments.length) {for (var n, i = Object.keys(r), o = 0; o < i.length; ++o) {"removeListener" !== (n = i[o]) && this.removeAllListeners(n);}return this.removeAllListeners("removeListener"), this._events = new ge(), this._eventsCount = 0, this;}if ("function" == typeof (t = r[e])) this.removeListener(e, t);else if (t) do {this.removeListener(e, t[t.length - 1]);} while (t[0]);return this;}, ve.prototype.listeners = function (e) {var t,r = this._events;return r && (t = r[e]) ? "function" == typeof t ? [t.listener || t] : function (e) {for (var t = new Array(e.length), r = 0; r < t.length; ++r) {t[r] = e[r].listener || e[r];}return t;}(t) : [];}, ve.listenerCount = function (e, t) {return "function" == typeof e.listenerCount ? e.listenerCount(t) : Re.call(e, t);}, ve.prototype.listenerCount = Re, ve.prototype.eventNames = function () {return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];};var Be = "function" == typeof Object.create ? function (e, t) {e.super_ = t, e.prototype = Object.create(t.prototype, { constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 } });} : function (e, t) {e.super_ = t;var r = function r() {};r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e;},ze = /%[sdj%]/g;function Le(e) {if (!Ze(e)) {for (var t = [], r = 0; r < arguments.length; r++) {t.push(De(arguments[r]));}return t.join(" ");}r = 1;for (var n = arguments, i = n.length, o = String(e).replace(ze, function (e) {if ("%%" === e) return "%";if (r >= i) return e;switch (e) {case "%s":return String(n[r++]);case "%d":return Number(n[r++]);case "%j":try {return JSON.stringify(n[r++]);} catch (e) {return "[Circular]";}default:return e;}}), a = n[r]; r < i; a = n[++r]) {Ne(a) || !Ye(a) ? o += " " + a : o += " " + De(a);}return o;}function Te(t, r) {if (je(e.process)) return function () {return Te(t, r).apply(this, arguments);};var n = !1;return function () {return n || (console.error(r), n = !0), t.apply(this, arguments);};}var Me,Ce = {};function De(e, t) {var r = { seen: [], stylize: Pe };return arguments.length >= 3 && (r.depth = arguments[2]), arguments.length >= 4 && (r.colors = arguments[3]), Fe(t) ? r.showHidden = t : t && function (e, t) {if (!t || !Ye(t)) return e;var r = Object.keys(t),n = r.length;for (; n--;) {e[r[n]] = t[r[n]];}}(r, t), je(r.showHidden) && (r.showHidden = !1), je(r.depth) && (r.depth = 2), je(r.colors) && (r.colors = !1), je(r.customInspect) && (r.customInspect = !0), r.colors && (r.stylize = Ie), Oe(r, e, r.depth);}function Ie(e, t) {var r = De.styles[t];return r ? "[" + De.colors[r][0] + "m" + e + "[" + De.colors[r][1] + "m" : e;}function Pe(e, t) {return e;}function Oe(e, t, r) {if (e.customInspect && t && qe(t.inspect) && t.inspect !== De && (!t.constructor || t.constructor.prototype !== t)) {var n = t.inspect(r, e);return Ze(n) || (n = Oe(e, n, r)), n;}var i = function (e, t) {if (je(t)) return e.stylize("undefined", "undefined");if (Ze(t)) {var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";return e.stylize(r, "string");}if (n = t, "number" == typeof n) return e.stylize("" + t, "number");var n;if (Fe(t)) return e.stylize("" + t, "boolean");if (Ne(t)) return e.stylize("null", "null");}(e, t);if (i) return i;var o = Object.keys(t),a = function (e) {var t = {};return e.forEach(function (e, r) {t[e] = !0;}), t;}(o);if (e.showHidden && (o = Object.getOwnPropertyNames(t)), Xe(t) && (o.indexOf("message") >= 0 || o.indexOf("description") >= 0)) return Ue(t);if (0 === o.length) {if (qe(t)) {var s = t.name ? ": " + t.name : "";return e.stylize("[Function" + s + "]", "special");}if (We(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp");if (Ke(t)) return e.stylize(Date.prototype.toString.call(t), "date");if (Xe(t)) return Ue(t);}var h,l,f = "",c = !1,u = ["{", "}"];(h = t, Array.isArray(h) && (c = !0, u = ["[", "]"]), qe(t)) && (f = " [Function" + (t.name ? ": " + t.name : "") + "]");return We(t) && (f = " " + RegExp.prototype.toString.call(t)), Ke(t) && (f = " " + Date.prototype.toUTCString.call(t)), Xe(t) && (f = " " + Ue(t)), 0 !== o.length || c && 0 != t.length ? r < 0 ? We(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special") : (e.seen.push(t), l = c ? function (e, t, r, n, i) {for (var o = [], a = 0, s = t.length; a < s; ++a) {Ge(t, String(a)) ? o.push(He(e, t, r, n, String(a), !0)) : o.push("");}return i.forEach(function (i) {i.match(/^\d+$/) || o.push(He(e, t, r, n, i, !0));}), o;}(e, t, r, a, o) : o.map(function (n) {return He(e, t, r, a, n, c);}), e.seen.pop(), function (e, t, r) {if (e.reduce(function (e, t) {return t.indexOf("\n"), e + t.replace(/\u001b\[\d\d?m/g, "").length + 1;}, 0) > 60) return r[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + r[1];return r[0] + t + " " + e.join(", ") + " " + r[1];}(l, f, u)) : u[0] + f + u[1];}function Ue(e) {return "[" + Error.prototype.toString.call(e) + "]";}function He(e, t, r, n, i, o) {var a, s, h;if ((h = Object.getOwnPropertyDescriptor(t, i) || { value: t[i] }).get ? s = h.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : h.set && (s = e.stylize("[Setter]", "special")), Ge(n, i) || (a = "[" + i + "]"), s || (e.seen.indexOf(h.value) < 0 ? (s = Ne(r) ? Oe(e, h.value, null) : Oe(e, h.value, r - 1)).indexOf("\n") > -1 && (s = o ? s.split("\n").map(function (e) {return "  " + e;}).join("\n").substr(2) : "\n" + s.split("\n").map(function (e) {return "   " + e;}).join("\n")) : s = e.stylize("[Circular]", "special")), je(a)) {if (o && i.match(/^\d+$/)) return s;(a = JSON.stringify("" + i)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (a = a.substr(1, a.length - 2), a = e.stylize(a, "name")) : (a = a.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), a = e.stylize(a, "string"));}return a + ": " + s;}function Fe(e) {return "boolean" == typeof e;}function Ne(e) {return null === e;}function Ze(e) {return "string" == typeof e;}function je(e) {return void 0 === e;}function We(e) {return Ye(e) && "[object RegExp]" === Ve(e);}function Ye(e) {return "object" == typeof e && null !== e;}function Ke(e) {return Ye(e) && "[object Date]" === Ve(e);}function Xe(e) {return Ye(e) && ("[object Error]" === Ve(e) || e instanceof Error);}function qe(e) {return "function" == typeof e;}function Ve(e) {return Object.prototype.toString.call(e);}function Ge(e, t) {return Object.prototype.hasOwnProperty.call(e, t);}function $e() {this.head = null, this.tail = null, this.length = 0;}De.colors = { bold: [1, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], white: [37, 39], grey: [90, 39], black: [30, 39], blue: [34, 39], cyan: [36, 39], green: [32, 39], magenta: [35, 39], red: [31, 39], yellow: [33, 39] }, De.styles = { special: "cyan", number: "yellow", boolean: "yellow", undefined: "grey", null: "bold", string: "green", date: "magenta", regexp: "red" }, $e.prototype.push = function (e) {var t = { data: e, next: null };this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;}, $e.prototype.unshift = function (e) {var t = { data: e, next: this.head };0 === this.length && (this.tail = t), this.head = t, ++this.length;}, $e.prototype.shift = function () {if (0 !== this.length) {var e = this.head.data;return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;}}, $e.prototype.clear = function () {this.head = this.tail = null, this.length = 0;}, $e.prototype.join = function (e) {if (0 === this.length) return "";for (var t = this.head, r = "" + t.data; t = t.next;) {r += e + t.data;}return r;}, $e.prototype.concat = function (e) {if (0 === this.length) return p.alloc(0);if (1 === this.length) return this.head.data;for (var t = p.allocUnsafe(e >>> 0), r = this.head, n = 0; r;) {r.data.copy(t, n), n += r.data.length, r = r.next;}return t;};var Je = p.isEncoding || function (e) {switch (e && e.toLowerCase()) {case "hex":case "utf8":case "utf-8":case "ascii":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":case "raw":return !0;default:return !1;}};function Qe(e) {switch (this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, ""), function (e) {if (e && !Je(e)) throw new Error("Unknown encoding: " + e);}(e), this.encoding) {case "utf8":this.surrogateSize = 3;break;case "ucs2":case "utf16le":this.surrogateSize = 2, this.detectIncompleteChar = tt;break;case "base64":this.surrogateSize = 3, this.detectIncompleteChar = rt;break;default:return void (this.write = et);}this.charBuffer = new p(6), this.charReceived = 0, this.charLength = 0;}function et(e) {return e.toString(this.encoding);}function tt(e) {this.charReceived = e.length % 2, this.charLength = this.charReceived ? 2 : 0;}function rt(e) {this.charReceived = e.length % 3, this.charLength = this.charReceived ? 3 : 0;}Qe.prototype.write = function (e) {for (var t = ""; this.charLength;) {var r = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length;if (e.copy(this.charBuffer, this.charReceived, 0, r), this.charReceived += r, this.charReceived < this.charLength) return "";if (e = e.slice(r, e.length), !((i = (t = this.charBuffer.slice(0, this.charLength).toString(this.encoding)).charCodeAt(t.length - 1)) >= 55296 && i <= 56319)) {if (this.charReceived = this.charLength = 0, 0 === e.length) return t;break;}this.charLength += this.surrogateSize, t = "";}this.detectIncompleteChar(e);var n = e.length;this.charLength && (e.copy(this.charBuffer, 0, e.length - this.charReceived, n), n -= this.charReceived);var i;n = (t += e.toString(this.encoding, 0, n)).length - 1;if ((i = t.charCodeAt(n)) >= 55296 && i <= 56319) {var o = this.surrogateSize;return this.charLength += o, this.charReceived += o, this.charBuffer.copy(this.charBuffer, o, 0, o), e.copy(this.charBuffer, 0, 0, o), t.substring(0, n);}return t;}, Qe.prototype.detectIncompleteChar = function (e) {for (var t = e.length >= 3 ? 3 : e.length; t > 0; t--) {var r = e[e.length - t];if (1 == t && r >> 5 == 6) {this.charLength = 2;break;}if (t <= 2 && r >> 4 == 14) {this.charLength = 3;break;}if (t <= 3 && r >> 3 == 30) {this.charLength = 4;break;}}this.charReceived = t;}, Qe.prototype.end = function (e) {var t = "";if (e && e.length && (t = this.write(e)), this.charReceived) {var r = this.charReceived,n = this.charBuffer,i = this.encoding;t += n.slice(0, r).toString(i);}return t;}, ot.ReadableState = it;var nt = function (e) {je(Me) && (Me = ""), e = e.toUpperCase(), Ce[e] || (new RegExp("\\b" + e + "\\b", "i").test(Me) ? Ce[e] = function () {var t = Le.apply(null, arguments);console.error("%s %d: %s", e, 0, t);} : Ce[e] = function () {});return Ce[e];}("stream");function it(e, t) {e = e || {}, this.objectMode = !!e.objectMode, t instanceof Ct && (this.objectMode = this.objectMode || !!e.readableObjectMode);var r = e.highWaterMark,n = this.objectMode ? 16 : 16384;this.highWaterMark = r || 0 === r ? r : n, this.highWaterMark = ~~this.highWaterMark, this.buffer = new $e(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (this.decoder = new Qe(e.encoding), this.encoding = e.encoding);}function ot(e) {if (!(this instanceof ot)) return new ot(e);this._readableState = new it(e, this), this.readable = !0, e && "function" == typeof e.read && (this._read = e.read), ve.call(this);}function at(e, t, r, n, i) {var o = function (e, t) {var r = null;$(t) || "string" == typeof t || null == t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk"));return r;}(t, r);if (o) e.emit("error", o);else if (null === r) t.reading = !1, function (e, t) {if (t.ended) return;if (t.decoder) {var r = t.decoder.end();r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);}t.ended = !0, lt(e);}(e, t);else if (t.objectMode || r && r.length > 0) {if (t.ended && !i) {var a = new Error("stream.push() after EOF");e.emit("error", a);} else if (t.endEmitted && i) {var s = new Error("stream.unshift() after end event");e.emit("error", s);} else {var h;!t.decoder || i || n || (r = t.decoder.write(r), h = !t.objectMode && 0 === r.length), i || (t.reading = !1), h || (t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && lt(e))), function (e, t) {t.readingMore || (t.readingMore = !0, de(ct, e, t));}(e, t);}} else i || (t.reading = !1);return function (e) {return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length);}(t);}Be(ot, ve), ot.prototype.push = function (e, t) {var r = this._readableState;return r.objectMode || "string" != typeof e || (t = t || r.defaultEncoding) !== r.encoding && (e = p.from(e, t), t = ""), at(this, r, e, t, !1);}, ot.prototype.unshift = function (e) {return at(this, this._readableState, e, "", !0);}, ot.prototype.isPaused = function () {return !1 === this._readableState.flowing;}, ot.prototype.setEncoding = function (e) {return this._readableState.decoder = new Qe(e), this._readableState.encoding = e, this;};var st = 8388608;function ht(e, t) {return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function (e) {return e >= st ? e = st : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;}(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));}function lt(e) {var t = e._readableState;t.needReadable = !1, t.emittedReadable || (nt("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? de(ft, e) : ft(e));}function ft(e) {nt("emit readable"), e.emit("readable"), pt(e);}function ct(e, t) {for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (nt("maybeReadMore read 0"), e.read(0), r !== t.length);) {r = t.length;}t.readingMore = !1;}function ut(e) {nt("readable nexttick read 0"), e.read(0);}function dt(e, t) {t.reading || (nt("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), pt(e), t.flowing && !t.reading && e.read(0);}function pt(e) {var t = e._readableState;for (nt("flow", t.flowing); t.flowing && null !== e.read();) {;}}function _t(e, t) {return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : r = function (e, t, r) {var n;e < t.head.data.length ? (n = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : n = e === t.head.data.length ? t.shift() : r ? function (e, t) {var r = t.head,n = 1,i = r.data;e -= i.length;for (; r = r.next;) {var o = r.data,a = e > o.length ? o.length : e;if (a === o.length ? i += o : i += o.slice(0, e), 0 === (e -= a)) {a === o.length ? (++n, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = o.slice(a));break;}++n;}return t.length -= n, i;}(e, t) : function (e, t) {var r = p.allocUnsafe(e),n = t.head,i = 1;n.data.copy(r), e -= n.data.length;for (; n = n.next;) {var o = n.data,a = e > o.length ? o.length : e;if (o.copy(r, r.length - e, 0, a), 0 === (e -= a)) {a === o.length ? (++i, n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n, n.data = o.slice(a));break;}++i;}return t.length -= i, r;}(e, t);return n;}(e, t.buffer, t.decoder), r);var r;}function gt(e) {var t = e._readableState;if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');t.endEmitted || (t.ended = !0, de(vt, t, e));}function vt(e, t) {e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"));}function wt(e, t) {for (var r = 0, n = e.length; r < n; r++) {if (e[r] === t) return r;}return -1;}function bt() {}function yt(e, t, r) {this.chunk = e, this.encoding = t, this.callback = r, this.next = null;}function mt(e, t) {Object.defineProperty(this, "buffer", { get: Te(function () {return this.getBuffer();}, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.") }), e = e || {}, this.objectMode = !!e.objectMode, t instanceof Ct && (this.objectMode = this.objectMode || !!e.writableObjectMode);var r = e.highWaterMark,n = this.objectMode ? 16 : 16384;this.highWaterMark = r || 0 === r ? r : n, this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;var i = !1 === e.decodeStrings;this.decodeStrings = !i, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {!function (e, t) {var r = e._writableState,n = r.sync,i = r.writecb;if (function (e) {e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;}(r), t) !function (e, t, r, n, i) {--t.pendingcb, r ? de(i, n) : i(n);e._writableState.errorEmitted = !0, e.emit("error", n);}(e, r, n, t, i);else {var o = Rt(r);o || r.corked || r.bufferProcessing || !r.bufferedRequest || xt(e, r), n ? de(St, e, r, o, i) : St(e, r, o, i);}}(t, e);}, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new zt(this);}function kt(e) {if (!(this instanceof kt || this instanceof Ct)) return new kt(e);this._writableState = new mt(e, this), this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), "function" == typeof e.writev && (this._writev = e.writev)), ve.call(this);}function Et(e, t, r, n, i, o, a) {t.writelen = n, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), t.sync = !1;}function St(e, t, r, n) {r || function (e, t) {0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));}(e, t), t.pendingcb--, n(), Bt(e, t);}function xt(e, t) {t.bufferProcessing = !0;var r = t.bufferedRequest;if (e._writev && r && r.next) {var n = t.bufferedRequestCount,i = new Array(n),o = t.corkedRequestsFree;o.entry = r;for (var a = 0; r;) {i[a] = r, r = r.next, a += 1;}Et(e, t, !0, t.length, i, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree = o.next, o.next = null) : t.corkedRequestsFree = new zt(t);} else {for (; r;) {var s = r.chunk,h = r.encoding,l = r.callback;if (Et(e, t, !1, t.objectMode ? 1 : s.length, s, h, l), r = r.next, t.writing) break;}null === r && (t.lastBufferedRequest = null);}t.bufferedRequestCount = 0, t.bufferedRequest = r, t.bufferProcessing = !1;}function Rt(e) {return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;}function At(e, t) {t.prefinished || (t.prefinished = !0, e.emit("prefinish"));}function Bt(e, t) {var r = Rt(t);return r && (0 === t.pendingcb ? (At(e, t), t.finished = !0, e.emit("finish")) : At(e, t)), r;}function zt(e) {var t = this;this.next = null, this.entry = null, this.finish = function (r) {var n = t.entry;for (t.entry = null; n;) {var i = n.callback;e.pendingcb--, i(r), n = n.next;}e.corkedRequestsFree ? e.corkedRequestsFree.next = t : e.corkedRequestsFree = t;};}ot.prototype.read = function (e) {nt("read", e), e = parseInt(e, 10);var t = this._readableState,r = e;if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return nt("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? gt(this) : lt(this), null;if (0 === (e = ht(e, t)) && t.ended) return 0 === t.length && gt(this), null;var n,i = t.needReadable;return nt("need readable", i), (0 === t.length || t.length - e < t.highWaterMark) && nt("length less than watermark", i = !0), t.ended || t.reading ? nt("reading or ended", i = !1) : i && (nt("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = ht(r, t))), null === (n = e > 0 ? _t(e, t) : null) ? (t.needReadable = !0, e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && gt(this)), null !== n && this.emit("data", n), n;}, ot.prototype._read = function (e) {this.emit("error", new Error("not implemented"));}, ot.prototype.pipe = function (e, t) {var r = this,n = this._readableState;switch (n.pipesCount) {case 0:n.pipes = e;break;case 1:n.pipes = [n.pipes, e];break;default:n.pipes.push(e);}n.pipesCount += 1, nt("pipe count=%d opts=%j", n.pipesCount, t);var i = !t || !1 !== t.end ? a : l;function o(e) {nt("onunpipe"), e === r && l();}function a() {nt("onend"), e.end();}n.endEmitted ? de(i) : r.once("end", i), e.on("unpipe", o);var s = function (e) {return function () {var t = e._readableState;nt("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && e.listeners("data").length && (t.flowing = !0, pt(e));};}(r);e.on("drain", s);var h = !1;function l() {nt("cleanup"), e.removeListener("close", d), e.removeListener("finish", p), e.removeListener("drain", s), e.removeListener("error", u), e.removeListener("unpipe", o), r.removeListener("end", a), r.removeListener("end", l), r.removeListener("data", c), h = !0, !n.awaitDrain || e._writableState && !e._writableState.needDrain || s();}var f = !1;function c(t) {nt("ondata"), f = !1, !1 !== e.write(t) || f || ((1 === n.pipesCount && n.pipes === e || n.pipesCount > 1 && -1 !== wt(n.pipes, e)) && !h && (nt("false write response, pause", r._readableState.awaitDrain), r._readableState.awaitDrain++, f = !0), r.pause());}function u(t) {var r;nt("onerror", t), _(), e.removeListener("error", u), 0 === (r = "error", e.listeners(r).length) && e.emit("error", t);}function d() {e.removeListener("finish", p), _();}function p() {nt("onfinish"), e.removeListener("close", d), _();}function _() {nt("unpipe"), r.unpipe(e);}return r.on("data", c), function (e, t, r) {if ("function" == typeof e.prependListener) return e.prependListener(t, r);e._events && e._events[t] ? Array.isArray(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r);}(e, "error", u), e.once("close", d), e.once("finish", p), e.emit("pipe", r), n.flowing || (nt("pipe resume"), r.resume()), e;}, ot.prototype.unpipe = function (e) {var t = this._readableState;if (0 === t.pipesCount) return this;if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this), this);if (!e) {var r = t.pipes,n = t.pipesCount;t.pipes = null, t.pipesCount = 0, t.flowing = !1;for (var i = 0; i < n; i++) {r[i].emit("unpipe", this);}return this;}var o = wt(t.pipes, e);return -1 === o ? this : (t.pipes.splice(o, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this), this);}, ot.prototype.on = function (e, t) {var r = ve.prototype.on.call(this, e, t);if ("data" === e) !1 !== this._readableState.flowing && this.resume();else if ("readable" === e) {var n = this._readableState;n.endEmitted || n.readableListening || (n.readableListening = n.needReadable = !0, n.emittedReadable = !1, n.reading ? n.length && lt(this) : de(ut, this));}return r;}, ot.prototype.addListener = ot.prototype.on, ot.prototype.resume = function () {var e = this._readableState;return e.flowing || (nt("resume"), e.flowing = !0, function (e, t) {t.resumeScheduled || (t.resumeScheduled = !0, de(dt, e, t));}(this, e)), this;}, ot.prototype.pause = function () {return nt("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (nt("pause"), this._readableState.flowing = !1, this.emit("pause")), this;}, ot.prototype.wrap = function (e) {var t = this._readableState,r = !1,n = this;for (var i in e.on("end", function () {if (nt("wrapped end"), t.decoder && !t.ended) {var e = t.decoder.end();e && e.length && n.push(e);}n.push(null);}), e.on("data", function (i) {(nt("wrapped data"), t.decoder && (i = t.decoder.write(i)), t.objectMode && null == i) || (t.objectMode || i && i.length) && (n.push(i) || (r = !0, e.pause()));}), e) {void 0 === this[i] && "function" == typeof e[i] && (this[i] = function (t) {return function () {return e[t].apply(e, arguments);};}(i));}return function (e, t) {for (var r = 0, n = e.length; r < n; r++) {t(e[r], r);}}(["error", "close", "destroy", "pause", "resume"], function (t) {e.on(t, n.emit.bind(n, t));}), n._read = function (t) {nt("wrapped _read", t), r && (r = !1, e.resume());}, n;}, ot._fromList = _t, kt.WritableState = mt, Be(kt, ve), mt.prototype.getBuffer = function () {for (var e = this.bufferedRequest, t = []; e;) {t.push(e), e = e.next;}return t;}, kt.prototype.pipe = function () {this.emit("error", new Error("Cannot pipe, not readable"));}, kt.prototype.write = function (e, t, r) {var n = this._writableState,i = !1;return "function" == typeof t && (r = t, t = null), p.isBuffer(e) ? t = "buffer" : t || (t = n.defaultEncoding), "function" != typeof r && (r = bt), n.ended ? function (e, t) {var r = new Error("write after end");e.emit("error", r), de(t, r);}(this, r) : function (e, t, r, n) {var i = !0,o = !1;return null === r ? o = new TypeError("May not write null values to stream") : p.isBuffer(r) || "string" == typeof r || void 0 === r || t.objectMode || (o = new TypeError("Invalid non-string/buffer chunk")), o && (e.emit("error", o), de(n, o), i = !1), i;}(this, n, e, r) && (n.pendingcb++, i = function (e, t, r, n, i) {r = function (e, t, r) {return e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = p.from(t, r)), t;}(t, r, n), p.isBuffer(r) && (n = "buffer");var o = t.objectMode ? 1 : r.length;t.length += o;var a = t.length < t.highWaterMark;a || (t.needDrain = !0);if (t.writing || t.corked) {var s = t.lastBufferedRequest;t.lastBufferedRequest = new yt(r, n, i), s ? s.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;} else Et(e, t, !1, o, r, n, i);return a;}(this, n, e, t, r)), i;}, kt.prototype.cork = function () {this._writableState.corked++;}, kt.prototype.uncork = function () {var e = this._writableState;e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || xt(this, e));}, kt.prototype.setDefaultEncoding = function (e) {if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e);return this._writableState.defaultEncoding = e, this;}, kt.prototype._write = function (e, t, r) {r(new Error("not implemented"));}, kt.prototype._writev = null, kt.prototype.end = function (e, t, r) {var n = this._writableState;"function" == typeof e ? (r = e, e = null, t = null) : "function" == typeof t && (r = t, t = null), null != e && this.write(e, t), n.corked && (n.corked = 1, this.uncork()), n.ending || n.finished || function (e, t, r) {t.ending = !0, Bt(e, t), r && (t.finished ? de(r) : e.once("finish", r));t.ended = !0, e.writable = !1;}(this, n, r);}, Be(Ct, ot);for (var Lt = Object.keys(kt.prototype), Tt = 0; Tt < Lt.length; Tt++) {var Mt = Lt[Tt];Ct.prototype[Mt] || (Ct.prototype[Mt] = kt.prototype[Mt]);}function Ct(e) {if (!(this instanceof Ct)) return new Ct(e);ot.call(this, e), kt.call(this, e), e && !1 === e.readable && (this.readable = !1), e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", Dt);}function Dt() {this.allowHalfOpen || this._writableState.ended || de(It, this);}function It(e) {e.end();}function Pt(e) {this.afterTransform = function (t, r) {return function (e, t, r) {var n = e._transformState;n.transforming = !1;var i = n.writecb;if (!i) return e.emit("error", new Error("no writecb in Transform class"));n.writechunk = null, n.writecb = null, null != r && e.push(r);i(t);var o = e._readableState;o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && e._read(o.highWaterMark);}(e, t, r);}, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null, this.writeencoding = null;}function Ot(e) {if (!(this instanceof Ot)) return new Ot(e);Ct.call(this, e), this._transformState = new Pt(this);var t = this;this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.once("prefinish", function () {"function" == typeof this._flush ? this._flush(function (e) {Ut(t, e);}) : Ut(t);});}function Ut(e, t) {if (t) return e.emit("error", t);var r = e._writableState,n = e._transformState;if (r.length) throw new Error("Calling transform done when ws.length != 0");if (n.transforming) throw new Error("Calling transform done when still transforming");return e.push(null);}function Ht(e) {if (!(this instanceof Ht)) return new Ht(e);Ot.call(this, e);}function Ft() {ve.call(this);}Be(Ot, Ct), Ot.prototype.push = function (e, t) {return this._transformState.needTransform = !1, Ct.prototype.push.call(this, e, t);}, Ot.prototype._transform = function (e, t, r) {throw new Error("Not implemented");}, Ot.prototype._write = function (e, t, r) {var n = this._transformState;if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {var i = this._readableState;(n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);}}, Ot.prototype._read = function (e) {var t = this._transformState;null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0;}, Be(Ht, Ot), Ht.prototype._transform = function (e, t, r) {r(null, e);}, Be(Ft, ve), Ft.Readable = ot, Ft.Writable = kt, Ft.Duplex = Ct, Ft.Transform = Ot, Ft.PassThrough = Ht, Ft.Stream = Ft, Ft.prototype.pipe = function (e, t) {var r = this;function n(t) {e.writable && !1 === e.write(t) && r.pause && r.pause();}function i() {r.readable && r.resume && r.resume();}r.on("data", n), e.on("drain", i), e._isStdio || t && !1 === t.end || (r.on("end", a), r.on("close", s));var o = !1;function a() {o || (o = !0, e.end());}function s() {o || (o = !0, "function" == typeof e.destroy && e.destroy());}function h(e) {if (l(), 0 === ve.listenerCount(this, "error")) throw e;}function l() {r.removeListener("data", n), e.removeListener("drain", i), r.removeListener("end", a), r.removeListener("close", s), r.removeListener("error", h), e.removeListener("error", h), r.removeListener("end", l), r.removeListener("close", l), e.removeListener("close", l);}return r.on("error", h), e.on("error", h), r.on("end", l), r.on("close", l), e.on("close", l), e.emit("pipe", r), e;};var Nt = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };function Zt() {this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;}function jt(e, t, r, n, i) {if (t.subarray && e.subarray) e.set(t.subarray(r, r + n), i);else for (var o = 0; o < n; o++) {e[i + o] = t[r + o];}}var Wt = Uint8Array,Yt = Uint16Array,Kt = Int32Array,Xt = 4,qt = 0,Vt = 1,Gt = 2;function $t(e) {for (var t = e.length; --t >= 0;) {e[t] = 0;}}var Jt = 0,Qt = 1,er = 2,tr = 29,rr = 256,nr = rr + 1 + tr,ir = 30,or = 19,ar = 2 * nr + 1,sr = 15,hr = 16,lr = 7,fr = 256,cr = 16,ur = 17,dr = 18,pr = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],_r = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],gr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],vr = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],wr = new Array(2 * (nr + 2));$t(wr);var br = new Array(2 * ir);$t(br);var yr = new Array(512);$t(yr);var mr = new Array(256);$t(mr);var kr = new Array(tr);$t(kr);var Er,Sr,xr,Rr = new Array(ir);function Ar(e, t, r, n, i) {this.static_tree = e, this.extra_bits = t, this.extra_base = r, this.elems = n, this.max_length = i, this.has_stree = e && e.length;}function Br(e, t) {this.dyn_tree = e, this.max_code = 0, this.stat_desc = t;}function zr(e) {return e < 256 ? yr[e] : yr[256 + (e >>> 7)];}function Lr(e, t) {e.pending_buf[e.pending++] = 255 & t, e.pending_buf[e.pending++] = t >>> 8 & 255;}function Tr(e, t, r) {e.bi_valid > hr - r ? (e.bi_buf |= t << e.bi_valid & 65535, Lr(e, e.bi_buf), e.bi_buf = t >> hr - e.bi_valid, e.bi_valid += r - hr) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += r);}function Mr(e, t, r) {Tr(e, r[2 * t], r[2 * t + 1]);}function Cr(e, t) {var r = 0;do {r |= 1 & e, e >>>= 1, r <<= 1;} while (--t > 0);return r >>> 1;}function Dr(e, t, r) {var n,i,o = new Array(sr + 1),a = 0;for (n = 1; n <= sr; n++) {o[n] = a = a + r[n - 1] << 1;}for (i = 0; i <= t; i++) {var s = e[2 * i + 1];0 !== s && (e[2 * i] = Cr(o[s]++, s));}}function Ir(e) {var t;for (t = 0; t < nr; t++) {e.dyn_ltree[2 * t] = 0;}for (t = 0; t < ir; t++) {e.dyn_dtree[2 * t] = 0;}for (t = 0; t < or; t++) {e.bl_tree[2 * t] = 0;}e.dyn_ltree[2 * fr] = 1, e.opt_len = e.static_len = 0, e.last_lit = e.matches = 0;}function Pr(e) {e.bi_valid > 8 ? Lr(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;}function Or(e, t, r, n) {var i = 2 * t,o = 2 * r;return e[i] < e[o] || e[i] === e[o] && n[t] <= n[r];}function Ur(e, t, r) {for (var n = e.heap[r], i = r << 1; i <= e.heap_len && (i < e.heap_len && Or(t, e.heap[i + 1], e.heap[i], e.depth) && i++, !Or(t, n, e.heap[i], e.depth));) {e.heap[r] = e.heap[i], r = i, i <<= 1;}e.heap[r] = n;}function Hr(e, t, r) {var n,i,o,a,s = 0;if (0 !== e.last_lit) do {n = e.pending_buf[e.d_buf + 2 * s] << 8 | e.pending_buf[e.d_buf + 2 * s + 1], i = e.pending_buf[e.l_buf + s], s++, 0 === n ? Mr(e, i, t) : (Mr(e, (o = mr[i]) + rr + 1, t), 0 !== (a = pr[o]) && Tr(e, i -= kr[o], a), Mr(e, o = zr(--n), r), 0 !== (a = _r[o]) && Tr(e, n -= Rr[o], a));} while (s < e.last_lit);Mr(e, fr, t);}function Fr(e, t) {var r,n,i,o = t.dyn_tree,a = t.stat_desc.static_tree,s = t.stat_desc.has_stree,h = t.stat_desc.elems,l = -1;for (e.heap_len = 0, e.heap_max = ar, r = 0; r < h; r++) {0 !== o[2 * r] ? (e.heap[++e.heap_len] = l = r, e.depth[r] = 0) : o[2 * r + 1] = 0;}for (; e.heap_len < 2;) {o[2 * (i = e.heap[++e.heap_len] = l < 2 ? ++l : 0)] = 1, e.depth[i] = 0, e.opt_len--, s && (e.static_len -= a[2 * i + 1]);}for (t.max_code = l, r = e.heap_len >> 1; r >= 1; r--) {Ur(e, o, r);}i = h;do {r = e.heap[1], e.heap[1] = e.heap[e.heap_len--], Ur(e, o, 1), n = e.heap[1], e.heap[--e.heap_max] = r, e.heap[--e.heap_max] = n, o[2 * i] = o[2 * r] + o[2 * n], e.depth[i] = (e.depth[r] >= e.depth[n] ? e.depth[r] : e.depth[n]) + 1, o[2 * r + 1] = o[2 * n + 1] = i, e.heap[1] = i++, Ur(e, o, 1);} while (e.heap_len >= 2);e.heap[--e.heap_max] = e.heap[1], function (e, t) {var r,n,i,o,a,s,h = t.dyn_tree,l = t.max_code,f = t.stat_desc.static_tree,c = t.stat_desc.has_stree,u = t.stat_desc.extra_bits,d = t.stat_desc.extra_base,p = t.stat_desc.max_length,_ = 0;for (o = 0; o <= sr; o++) {e.bl_count[o] = 0;}for (h[2 * e.heap[e.heap_max] + 1] = 0, r = e.heap_max + 1; r < ar; r++) {(o = h[2 * h[2 * (n = e.heap[r]) + 1] + 1] + 1) > p && (o = p, _++), h[2 * n + 1] = o, n > l || (e.bl_count[o]++, a = 0, n >= d && (a = u[n - d]), s = h[2 * n], e.opt_len += s * (o + a), c && (e.static_len += s * (f[2 * n + 1] + a)));}if (0 !== _) {do {for (o = p - 1; 0 === e.bl_count[o];) {o--;}e.bl_count[o]--, e.bl_count[o + 1] += 2, e.bl_count[p]--, _ -= 2;} while (_ > 0);for (o = p; 0 !== o; o--) {for (n = e.bl_count[o]; 0 !== n;) {(i = e.heap[--r]) > l || (h[2 * i + 1] !== o && (e.opt_len += (o - h[2 * i + 1]) * h[2 * i], h[2 * i + 1] = o), n--);}}}}(e, t), Dr(o, l, e.bl_count);}function Nr(e, t, r) {var n,i,o = -1,a = t[1],s = 0,h = 7,l = 4;for (0 === a && (h = 138, l = 3), t[2 * (r + 1) + 1] = 65535, n = 0; n <= r; n++) {i = a, a = t[2 * (n + 1) + 1], ++s < h && i === a || (s < l ? e.bl_tree[2 * i] += s : 0 !== i ? (i !== o && e.bl_tree[2 * i]++, e.bl_tree[2 * cr]++) : s <= 10 ? e.bl_tree[2 * ur]++ : e.bl_tree[2 * dr]++, s = 0, o = i, 0 === a ? (h = 138, l = 3) : i === a ? (h = 6, l = 3) : (h = 7, l = 4));}}function Zr(e, t, r) {var n,i,o = -1,a = t[1],s = 0,h = 7,l = 4;for (0 === a && (h = 138, l = 3), n = 0; n <= r; n++) {if (i = a, a = t[2 * (n + 1) + 1], !(++s < h && i === a)) {if (s < l) do {Mr(e, i, e.bl_tree);} while (0 != --s);else 0 !== i ? (i !== o && (Mr(e, i, e.bl_tree), s--), Mr(e, cr, e.bl_tree), Tr(e, s - 3, 2)) : s <= 10 ? (Mr(e, ur, e.bl_tree), Tr(e, s - 3, 3)) : (Mr(e, dr, e.bl_tree), Tr(e, s - 11, 7));s = 0, o = i, 0 === a ? (h = 138, l = 3) : i === a ? (h = 6, l = 3) : (h = 7, l = 4);}}}$t(Rr);var jr = !1;function Wr(e) {jr || (!function () {var e,t,r,n,i,o = new Array(sr + 1);for (r = 0, n = 0; n < tr - 1; n++) {for (kr[n] = r, e = 0; e < 1 << pr[n]; e++) {mr[r++] = n;}}for (mr[r - 1] = n, i = 0, n = 0; n < 16; n++) {for (Rr[n] = i, e = 0; e < 1 << _r[n]; e++) {yr[i++] = n;}}for (i >>= 7; n < ir; n++) {for (Rr[n] = i << 7, e = 0; e < 1 << _r[n] - 7; e++) {yr[256 + i++] = n;}}for (t = 0; t <= sr; t++) {o[t] = 0;}for (e = 0; e <= 143;) {wr[2 * e + 1] = 8, e++, o[8]++;}for (; e <= 255;) {wr[2 * e + 1] = 9, e++, o[9]++;}for (; e <= 279;) {wr[2 * e + 1] = 7, e++, o[7]++;}for (; e <= 287;) {wr[2 * e + 1] = 8, e++, o[8]++;}for (Dr(wr, nr + 1, o), e = 0; e < ir; e++) {br[2 * e + 1] = 5, br[2 * e] = Cr(e, 5);}Er = new Ar(wr, pr, rr + 1, nr, sr), Sr = new Ar(br, _r, 0, ir, sr), xr = new Ar(new Array(0), gr, 0, or, lr);}(), jr = !0), e.l_desc = new Br(e.dyn_ltree, Er), e.d_desc = new Br(e.dyn_dtree, Sr), e.bl_desc = new Br(e.bl_tree, xr), e.bi_buf = 0, e.bi_valid = 0, Ir(e);}function Yr(e, t, r, n) {Tr(e, (Jt << 1) + (n ? 1 : 0), 3), function (e, t, r, n) {Pr(e), n && (Lr(e, r), Lr(e, ~r)), jt(e.pending_buf, e.window, t, r, e.pending), e.pending += r;}(e, t, r, !0);}function Kr(e) {Tr(e, Qt << 1, 3), Mr(e, fr, wr), function (e) {16 === e.bi_valid ? (Lr(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = 255 & e.bi_buf, e.bi_buf >>= 8, e.bi_valid -= 8);}(e);}function Xr(e, t, r, n) {var i,o,a = 0;e.level > 0 ? (e.strm.data_type === Gt && (e.strm.data_type = function (e) {var t,r = 4093624447;for (t = 0; t <= 31; t++, r >>>= 1) {if (1 & r && 0 !== e.dyn_ltree[2 * t]) return qt;}if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26]) return Vt;for (t = 32; t < rr; t++) {if (0 !== e.dyn_ltree[2 * t]) return Vt;}return qt;}(e)), Fr(e, e.l_desc), Fr(e, e.d_desc), a = function (e) {var t;for (Nr(e, e.dyn_ltree, e.l_desc.max_code), Nr(e, e.dyn_dtree, e.d_desc.max_code), Fr(e, e.bl_desc), t = or - 1; t >= 3 && 0 === e.bl_tree[2 * vr[t] + 1]; t--) {;}return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;}(e), i = e.opt_len + 3 + 7 >>> 3, (o = e.static_len + 3 + 7 >>> 3) <= i && (i = o)) : i = o = r + 5, r + 4 <= i && -1 !== t ? Yr(e, t, r, n) : e.strategy === Xt || o === i ? (Tr(e, (Qt << 1) + (n ? 1 : 0), 3), Hr(e, wr, br)) : (Tr(e, (er << 1) + (n ? 1 : 0), 3), function (e, t, r, n) {var i;for (Tr(e, t - 257, 5), Tr(e, r - 1, 5), Tr(e, n - 4, 4), i = 0; i < n; i++) {Tr(e, e.bl_tree[2 * vr[i] + 1], 3);}Zr(e, e.dyn_ltree, t - 1), Zr(e, e.dyn_dtree, r - 1);}(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, a + 1), Hr(e, e.dyn_ltree, e.dyn_dtree)), Ir(e), n && Pr(e);}function qr(e, t, r) {return e.pending_buf[e.d_buf + 2 * e.last_lit] = t >>> 8 & 255, e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t, e.pending_buf[e.l_buf + e.last_lit] = 255 & r, e.last_lit++, 0 === t ? e.dyn_ltree[2 * r]++ : (e.matches++, t--, e.dyn_ltree[2 * (mr[r] + rr + 1)]++, e.dyn_dtree[2 * zr(t)]++), e.last_lit === e.lit_bufsize - 1;}function Vr(e, t, r, n) {for (var i = 65535 & e | 0, o = e >>> 16 & 65535 | 0, a = 0; 0 !== r;) {r -= a = r > 2e3 ? 2e3 : r;do {o = o + (i = i + t[n++] | 0) | 0;} while (--a);i %= 65521, o %= 65521;}return i | o << 16 | 0;}var Gr = function () {for (var e, t = [], r = 0; r < 256; r++) {e = r;for (var n = 0; n < 8; n++) {e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;}t[r] = e;}return t;}();function $r(e, t, r, n) {var i = Gr,o = n + r;e ^= -1;for (var a = n; a < o; a++) {e = e >>> 8 ^ i[255 & (e ^ t[a])];}return -1 ^ e;}var Jr,Qr = 0,en = 1,tn = 3,rn = 4,nn = 5,on = 0,an = 1,sn = -2,hn = -3,ln = -5,fn = -1,cn = 1,un = 2,dn = 3,pn = 4,_n = 2,gn = 8,vn = 9,wn = 286,bn = 30,yn = 19,mn = 2 * wn + 1,kn = 15,En = 3,Sn = 258,xn = Sn + En + 1,Rn = 32,An = 42,Bn = 69,zn = 73,Ln = 91,Tn = 103,Mn = 113,Cn = 666,Dn = 1,In = 2,Pn = 3,On = 4,Un = 3;function Hn(e, t) {return e.msg = Nt[t], t;}function Fn(e) {return (e << 1) - (e > 4 ? 9 : 0);}function Nn(e) {for (var t = e.length; --t >= 0;) {e[t] = 0;}}function Zn(e) {var t = e.state,r = t.pending;r > e.avail_out && (r = e.avail_out), 0 !== r && (jt(e.output, t.pending_buf, t.pending_out, r, e.next_out), e.next_out += r, t.pending_out += r, e.total_out += r, e.avail_out -= r, t.pending -= r, 0 === t.pending && (t.pending_out = 0));}function jn(e, t) {Xr(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, Zn(e.strm);}function Wn(e, t) {e.pending_buf[e.pending++] = t;}function Yn(e, t) {e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = 255 & t;}function Kn(e, t) {var r,n,i = e.max_chain_length,o = e.strstart,a = e.prev_length,s = e.nice_match,h = e.strstart > e.w_size - xn ? e.strstart - (e.w_size - xn) : 0,l = e.window,f = e.w_mask,c = e.prev,u = e.strstart + Sn,d = l[o + a - 1],p = l[o + a];e.prev_length >= e.good_match && (i >>= 2), s > e.lookahead && (s = e.lookahead);do {if (l[(r = t) + a] === p && l[r + a - 1] === d && l[r] === l[o] && l[++r] === l[o + 1]) {o += 2, r++;do {} while (l[++o] === l[++r] && l[++o] === l[++r] && l[++o] === l[++r] && l[++o] === l[++r] && l[++o] === l[++r] && l[++o] === l[++r] && l[++o] === l[++r] && l[++o] === l[++r] && o < u);if (n = Sn - (u - o), o = u - Sn, n > a) {if (e.match_start = t, a = n, n >= s) break;d = l[o + a - 1], p = l[o + a];}}} while ((t = c[t & f]) > h && 0 != --i);return a <= e.lookahead ? a : e.lookahead;}function Xn(e) {var t,r,n,i,o,a,s,h,l,f,c = e.w_size;do {if (i = e.window_size - e.lookahead - e.strstart, e.strstart >= c + (c - xn)) {jt(e.window, e.window, c, c, 0), e.match_start -= c, e.strstart -= c, e.block_start -= c, t = r = e.hash_size;do {n = e.head[--t], e.head[t] = n >= c ? n - c : 0;} while (--r);t = r = c;do {n = e.prev[--t], e.prev[t] = n >= c ? n - c : 0;} while (--r);i += c;}if (0 === e.strm.avail_in) break;if (a = e.strm, s = e.window, h = e.strstart + e.lookahead, l = i, f = void 0, (f = a.avail_in) > l && (f = l), r = 0 === f ? 0 : (a.avail_in -= f, jt(s, a.input, a.next_in, f, h), 1 === a.state.wrap ? a.adler = Vr(a.adler, s, f, h) : 2 === a.state.wrap && (a.adler = $r(a.adler, s, f, h)), a.next_in += f, a.total_in += f, f), e.lookahead += r, e.lookahead + e.insert >= En) for (o = e.strstart - e.insert, e.ins_h = e.window[o], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[o + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[o + En - 1]) & e.hash_mask, e.prev[o & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = o, o++, e.insert--, !(e.lookahead + e.insert < En));) {;}} while (e.lookahead < xn && 0 !== e.strm.avail_in);}function qn(e, t) {for (var r, n;;) {if (e.lookahead < xn) {if (Xn(e), e.lookahead < xn && t === Qr) return Dn;if (0 === e.lookahead) break;}if (r = 0, e.lookahead >= En && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + En - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 !== r && e.strstart - r <= e.w_size - xn && (e.match_length = Kn(e, r)), e.match_length >= En) {if (n = qr(e, e.strstart - e.match_start, e.match_length - En), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= En) {e.match_length--;do {e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + En - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart;} while (0 != --e.match_length);e.strstart++;} else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;} else n = qr(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;if (n && (jn(e, !1), 0 === e.strm.avail_out)) return Dn;}return e.insert = e.strstart < En - 1 ? e.strstart : En - 1, t === rn ? (jn(e, !0), 0 === e.strm.avail_out ? Pn : On) : e.last_lit && (jn(e, !1), 0 === e.strm.avail_out) ? Dn : In;}function Vn(e, t) {for (var r, n, i;;) {if (e.lookahead < xn) {if (Xn(e), e.lookahead < xn && t === Qr) return Dn;if (0 === e.lookahead) break;}if (r = 0, e.lookahead >= En && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + En - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = En - 1, 0 !== r && e.prev_length < e.max_lazy_match && e.strstart - r <= e.w_size - xn && (e.match_length = Kn(e, r), e.match_length <= 5 && (e.strategy === cn || e.match_length === En && e.strstart - e.match_start > 4096) && (e.match_length = En - 1)), e.prev_length >= En && e.match_length <= e.prev_length) {i = e.strstart + e.lookahead - En, n = qr(e, e.strstart - 1 - e.prev_match, e.prev_length - En), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;do {++e.strstart <= i && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + En - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart);} while (0 != --e.prev_length);if (e.match_available = 0, e.match_length = En - 1, e.strstart++, n && (jn(e, !1), 0 === e.strm.avail_out)) return Dn;} else if (e.match_available) {if ((n = qr(e, 0, e.window[e.strstart - 1])) && jn(e, !1), e.strstart++, e.lookahead--, 0 === e.strm.avail_out) return Dn;} else e.match_available = 1, e.strstart++, e.lookahead--;}return e.match_available && (n = qr(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < En - 1 ? e.strstart : En - 1, t === rn ? (jn(e, !0), 0 === e.strm.avail_out ? Pn : On) : e.last_lit && (jn(e, !1), 0 === e.strm.avail_out) ? Dn : In;}function Gn(e, t, r, n, i) {this.good_length = e, this.max_lazy = t, this.nice_length = r, this.max_chain = n, this.func = i;}function $n() {this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = gn, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Yt(2 * mn), this.dyn_dtree = new Yt(2 * (2 * bn + 1)), this.bl_tree = new Yt(2 * (2 * yn + 1)), Nn(this.dyn_ltree), Nn(this.dyn_dtree), Nn(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Yt(kn + 1), this.heap = new Yt(2 * wn + 1), Nn(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Yt(2 * wn + 1), Nn(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;}function Jn(e) {var t,r = function (e) {var t;return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = _n, (t = e.state).pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap ? An : Mn, e.adler = 2 === t.wrap ? 0 : 1, t.last_flush = Qr, Wr(t), on) : Hn(e, sn);}(e);return r === on && ((t = e.state).window_size = 2 * t.w_size, Nn(t.head), t.max_lazy_match = Jr[t.level].max_lazy, t.good_match = Jr[t.level].good_length, t.nice_match = Jr[t.level].nice_length, t.max_chain_length = Jr[t.level].max_chain, t.strstart = 0, t.block_start = 0, t.lookahead = 0, t.insert = 0, t.match_length = t.prev_length = En - 1, t.match_available = 0, t.ins_h = 0), r;}function Qn(e, t) {var r, n, i, o;if (!e || !e.state || t > nn || t < 0) return e ? Hn(e, sn) : sn;if (n = e.state, !e.output || !e.input && 0 !== e.avail_in || n.status === Cn && t !== rn) return Hn(e, 0 === e.avail_out ? ln : sn);if (n.strm = e, r = n.last_flush, n.last_flush = t, n.status === An) if (2 === n.wrap) e.adler = 0, Wn(n, 31), Wn(n, 139), Wn(n, 8), n.gzhead ? (Wn(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)), Wn(n, 255 & n.gzhead.time), Wn(n, n.gzhead.time >> 8 & 255), Wn(n, n.gzhead.time >> 16 & 255), Wn(n, n.gzhead.time >> 24 & 255), Wn(n, 9 === n.level ? 2 : n.strategy >= un || n.level < 2 ? 4 : 0), Wn(n, 255 & n.gzhead.os), n.gzhead.extra && n.gzhead.extra.length && (Wn(n, 255 & n.gzhead.extra.length), Wn(n, n.gzhead.extra.length >> 8 & 255)), n.gzhead.hcrc && (e.adler = $r(e.adler, n.pending_buf, n.pending, 0)), n.gzindex = 0, n.status = Bn) : (Wn(n, 0), Wn(n, 0), Wn(n, 0), Wn(n, 0), Wn(n, 0), Wn(n, 9 === n.level ? 2 : n.strategy >= un || n.level < 2 ? 4 : 0), Wn(n, Un), n.status = Mn);else {var a = gn + (n.w_bits - 8 << 4) << 8;a |= (n.strategy >= un || n.level < 2 ? 0 : n.level < 6 ? 1 : 6 === n.level ? 2 : 3) << 6, 0 !== n.strstart && (a |= Rn), a += 31 - a % 31, n.status = Mn, Yn(n, a), 0 !== n.strstart && (Yn(n, e.adler >>> 16), Yn(n, 65535 & e.adler)), e.adler = 1;}if (n.status === Bn) if (n.gzhead.extra) {for (i = n.pending; n.gzindex < (65535 & n.gzhead.extra.length) && (n.pending !== n.pending_buf_size || (n.gzhead.hcrc && n.pending > i && (e.adler = $r(e.adler, n.pending_buf, n.pending - i, i)), Zn(e), i = n.pending, n.pending !== n.pending_buf_size));) {Wn(n, 255 & n.gzhead.extra[n.gzindex]), n.gzindex++;}n.gzhead.hcrc && n.pending > i && (e.adler = $r(e.adler, n.pending_buf, n.pending - i, i)), n.gzindex === n.gzhead.extra.length && (n.gzindex = 0, n.status = zn);} else n.status = zn;if (n.status === zn) if (n.gzhead.name) {i = n.pending;do {if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > i && (e.adler = $r(e.adler, n.pending_buf, n.pending - i, i)), Zn(e), i = n.pending, n.pending === n.pending_buf_size)) {o = 1;break;}o = n.gzindex < n.gzhead.name.length ? 255 & n.gzhead.name.charCodeAt(n.gzindex++) : 0, Wn(n, o);} while (0 !== o);n.gzhead.hcrc && n.pending > i && (e.adler = $r(e.adler, n.pending_buf, n.pending - i, i)), 0 === o && (n.gzindex = 0, n.status = Ln);} else n.status = Ln;if (n.status === Ln) if (n.gzhead.comment) {i = n.pending;do {if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > i && (e.adler = $r(e.adler, n.pending_buf, n.pending - i, i)), Zn(e), i = n.pending, n.pending === n.pending_buf_size)) {o = 1;break;}o = n.gzindex < n.gzhead.comment.length ? 255 & n.gzhead.comment.charCodeAt(n.gzindex++) : 0, Wn(n, o);} while (0 !== o);n.gzhead.hcrc && n.pending > i && (e.adler = $r(e.adler, n.pending_buf, n.pending - i, i)), 0 === o && (n.status = Tn);} else n.status = Tn;if (n.status === Tn && (n.gzhead.hcrc ? (n.pending + 2 > n.pending_buf_size && Zn(e), n.pending + 2 <= n.pending_buf_size && (Wn(n, 255 & e.adler), Wn(n, e.adler >> 8 & 255), e.adler = 0, n.status = Mn)) : n.status = Mn), 0 !== n.pending) {if (Zn(e), 0 === e.avail_out) return n.last_flush = -1, on;} else if (0 === e.avail_in && Fn(t) <= Fn(r) && t !== rn) return Hn(e, ln);if (n.status === Cn && 0 !== e.avail_in) return Hn(e, ln);if (0 !== e.avail_in || 0 !== n.lookahead || t !== Qr && n.status !== Cn) {var s = n.strategy === un ? function (e, t) {for (var r;;) {if (0 === e.lookahead && (Xn(e), 0 === e.lookahead)) {if (t === Qr) return Dn;break;}if (e.match_length = 0, r = qr(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, r && (jn(e, !1), 0 === e.strm.avail_out)) return Dn;}return e.insert = 0, t === rn ? (jn(e, !0), 0 === e.strm.avail_out ? Pn : On) : e.last_lit && (jn(e, !1), 0 === e.strm.avail_out) ? Dn : In;}(n, t) : n.strategy === dn ? function (e, t) {for (var r, n, i, o, a = e.window;;) {if (e.lookahead <= Sn) {if (Xn(e), e.lookahead <= Sn && t === Qr) return Dn;if (0 === e.lookahead) break;}if (e.match_length = 0, e.lookahead >= En && e.strstart > 0 && (n = a[i = e.strstart - 1]) === a[++i] && n === a[++i] && n === a[++i]) {o = e.strstart + Sn;do {} while (n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && i < o);e.match_length = Sn - (o - i), e.match_length > e.lookahead && (e.match_length = e.lookahead);}if (e.match_length >= En ? (r = qr(e, 1, e.match_length - En), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (r = qr(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), r && (jn(e, !1), 0 === e.strm.avail_out)) return Dn;}return e.insert = 0, t === rn ? (jn(e, !0), 0 === e.strm.avail_out ? Pn : On) : e.last_lit && (jn(e, !1), 0 === e.strm.avail_out) ? Dn : In;}(n, t) : Jr[n.level].func(n, t);if (s !== Pn && s !== On || (n.status = Cn), s === Dn || s === Pn) return 0 === e.avail_out && (n.last_flush = -1), on;if (s === In && (t === en ? Kr(n) : t !== nn && (Yr(n, 0, 0, !1), t === tn && (Nn(n.head), 0 === n.lookahead && (n.strstart = 0, n.block_start = 0, n.insert = 0))), Zn(e), 0 === e.avail_out)) return n.last_flush = -1, on;}return t !== rn ? on : n.wrap <= 0 ? an : (2 === n.wrap ? (Wn(n, 255 & e.adler), Wn(n, e.adler >> 8 & 255), Wn(n, e.adler >> 16 & 255), Wn(n, e.adler >> 24 & 255), Wn(n, 255 & e.total_in), Wn(n, e.total_in >> 8 & 255), Wn(n, e.total_in >> 16 & 255), Wn(n, e.total_in >> 24 & 255)) : (Yn(n, e.adler >>> 16), Yn(n, 65535 & e.adler)), Zn(e), n.wrap > 0 && (n.wrap = -n.wrap), 0 !== n.pending ? on : an);}Jr = [new Gn(0, 0, 0, 0, function (e, t) {var r = 65535;for (r > e.pending_buf_size - 5 && (r = e.pending_buf_size - 5);;) {if (e.lookahead <= 1) {if (Xn(e), 0 === e.lookahead && t === Qr) return Dn;if (0 === e.lookahead) break;}e.strstart += e.lookahead, e.lookahead = 0;var n = e.block_start + r;if ((0 === e.strstart || e.strstart >= n) && (e.lookahead = e.strstart - n, e.strstart = n, jn(e, !1), 0 === e.strm.avail_out)) return Dn;if (e.strstart - e.block_start >= e.w_size - xn && (jn(e, !1), 0 === e.strm.avail_out)) return Dn;}return e.insert = 0, t === rn ? (jn(e, !0), 0 === e.strm.avail_out ? Pn : On) : (e.strstart > e.block_start && (jn(e, !1), e.strm.avail_out), Dn);}), new Gn(4, 4, 8, 4, qn), new Gn(4, 5, 16, 8, qn), new Gn(4, 6, 32, 32, qn), new Gn(4, 4, 16, 16, Vn), new Gn(8, 16, 32, 32, Vn), new Gn(8, 16, 128, 128, Vn), new Gn(8, 32, 128, 256, Vn), new Gn(32, 128, 258, 1024, Vn), new Gn(32, 258, 258, 4096, Vn)];var ei = 30,ti = 12;function ri(e, t) {var r, n, i, o, a, s, h, l, f, c, u, d, p, _, g, v, w, b, y, m, k, E, S, x, R;r = e.state, n = e.next_in, x = e.input, i = n + (e.avail_in - 5), o = e.next_out, R = e.output, a = o - (t - e.avail_out), s = o + (e.avail_out - 257), h = r.dmax, l = r.wsize, f = r.whave, c = r.wnext, u = r.window, d = r.hold, p = r.bits, _ = r.lencode, g = r.distcode, v = (1 << r.lenbits) - 1, w = (1 << r.distbits) - 1;e: do {p < 15 && (d += x[n++] << p, p += 8, d += x[n++] << p, p += 8), b = _[d & v];t: for (;;) {if (d >>>= y = b >>> 24, p -= y, 0 === (y = b >>> 16 & 255)) R[o++] = 65535 & b;else {if (!(16 & y)) {if (0 == (64 & y)) {b = _[(65535 & b) + (d & (1 << y) - 1)];continue t;}if (32 & y) {r.mode = ti;break e;}e.msg = "invalid literal/length code", r.mode = ei;break e;}m = 65535 & b, (y &= 15) && (p < y && (d += x[n++] << p, p += 8), m += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += x[n++] << p, p += 8, d += x[n++] << p, p += 8), b = g[d & w];r: for (;;) {if (d >>>= y = b >>> 24, p -= y, !(16 & (y = b >>> 16 & 255))) {if (0 == (64 & y)) {b = g[(65535 & b) + (d & (1 << y) - 1)];continue r;}e.msg = "invalid distance code", r.mode = ei;break e;}if (k = 65535 & b, p < (y &= 15) && (d += x[n++] << p, (p += 8) < y && (d += x[n++] << p, p += 8)), (k += d & (1 << y) - 1) > h) {e.msg = "invalid distance too far back", r.mode = ei;break e;}if (d >>>= y, p -= y, k > (y = o - a)) {if ((y = k - y) > f && r.sane) {e.msg = "invalid distance too far back", r.mode = ei;break e;}if (E = 0, S = u, 0 === c) {if (E += l - y, y < m) {m -= y;do {R[o++] = u[E++];} while (--y);E = o - k, S = R;}} else if (c < y) {if (E += l + c - y, (y -= c) < m) {m -= y;do {R[o++] = u[E++];} while (--y);if (E = 0, c < m) {m -= y = c;do {R[o++] = u[E++];} while (--y);E = o - k, S = R;}}} else if (E += c - y, y < m) {m -= y;do {R[o++] = u[E++];} while (--y);E = o - k, S = R;}for (; m > 2;) {R[o++] = S[E++], R[o++] = S[E++], R[o++] = S[E++], m -= 3;}m && (R[o++] = S[E++], m > 1 && (R[o++] = S[E++]));} else {E = o - k;do {R[o++] = R[E++], R[o++] = R[E++], R[o++] = R[E++], m -= 3;} while (m > 2);m && (R[o++] = R[E++], m > 1 && (R[o++] = R[E++]));}break;}}break;}} while (n < i && o < s);n -= m = p >> 3, d &= (1 << (p -= m << 3)) - 1, e.next_in = n, e.next_out = o, e.avail_in = n < i ? i - n + 5 : 5 - (n - i), e.avail_out = o < s ? s - o + 257 : 257 - (o - s), r.hold = d, r.bits = p;}var ni = 15,ii = 852,oi = 592,ai = 0,si = 1,hi = 2,li = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],fi = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],ci = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],ui = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];function di(e, t, r, n, i, o, a, s) {var h,l,f,c,u,d,p,_,g,v = s.bits,w = 0,b = 0,y = 0,m = 0,k = 0,E = 0,S = 0,x = 0,R = 0,A = 0,B = null,z = 0,L = new Yt(ni + 1),T = new Yt(ni + 1),M = null,C = 0;for (w = 0; w <= ni; w++) {L[w] = 0;}for (b = 0; b < n; b++) {L[t[r + b]]++;}for (k = v, m = ni; m >= 1 && 0 === L[m]; m--) {;}if (k > m && (k = m), 0 === m) return i[o++] = 20971520, i[o++] = 20971520, s.bits = 1, 0;for (y = 1; y < m && 0 === L[y]; y++) {;}for (k < y && (k = y), x = 1, w = 1; w <= ni; w++) {if (x <<= 1, (x -= L[w]) < 0) return -1;}if (x > 0 && (e === ai || 1 !== m)) return -1;for (T[1] = 0, w = 1; w < ni; w++) {T[w + 1] = T[w] + L[w];}for (b = 0; b < n; b++) {0 !== t[r + b] && (a[T[t[r + b]]++] = b);}if (e === ai ? (B = M = a, d = 19) : e === si ? (B = li, z -= 257, M = fi, C -= 257, d = 256) : (B = ci, M = ui, d = -1), A = 0, b = 0, w = y, u = o, E = k, S = 0, f = -1, c = (R = 1 << k) - 1, e === si && R > ii || e === hi && R > oi) return 1;for (;;) {p = w - S, a[b] < d ? (_ = 0, g = a[b]) : a[b] > d ? (_ = M[C + a[b]], g = B[z + a[b]]) : (_ = 96, g = 0), h = 1 << w - S, y = l = 1 << E;do {i[u + (A >> S) + (l -= h)] = p << 24 | _ << 16 | g | 0;} while (0 !== l);for (h = 1 << w - 1; A & h;) {h >>= 1;}if (0 !== h ? (A &= h - 1, A += h) : A = 0, b++, 0 == --L[w]) {if (w === m) break;w = t[r + a[b]];}if (w > k && (A & c) !== f) {for (0 === S && (S = k), u += y, x = 1 << (E = w - S); E + S < m && !((x -= L[E + S]) <= 0);) {E++, x <<= 1;}if (R += 1 << E, e === si && R > ii || e === hi && R > oi) return 1;i[f = A & c] = k << 24 | E << 16 | u - o | 0;}}return 0 !== A && (i[u + A] = w - S << 24 | 64 << 16 | 0), s.bits = k, 0;}var pi = 0,_i = 1,gi = 2,vi = 4,wi = 5,bi = 6,yi = 0,mi = 1,ki = 2,Ei = -2,Si = -3,xi = -4,Ri = -5,Ai = 8,Bi = 1,zi = 2,Li = 3,Ti = 4,Mi = 5,Ci = 6,Di = 7,Ii = 8,Pi = 9,Oi = 10,Ui = 11,Hi = 12,Fi = 13,Ni = 14,Zi = 15,ji = 16,Wi = 17,Yi = 18,Ki = 19,Xi = 20,qi = 21,Vi = 22,Gi = 23,$i = 24,Ji = 25,Qi = 26,eo = 27,to = 28,ro = 29,no = 30,io = 31,oo = 32,ao = 852,so = 592;function ho(e) {return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24);}function lo() {this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Yt(320), this.work = new Yt(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;}function fo(e) {var t;return e && e.state ? ((t = e.state).wsize = 0, t.whave = 0, t.wnext = 0, function (e) {var t;return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = Bi, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new Kt(ao), t.distcode = t.distdyn = new Kt(so), t.sane = 1, t.back = -1, yi) : Ei;}(e)) : Ei;}function co(e, t) {var r, n;return e ? (n = new lo(), e.state = n, n.window = null, (r = function (e, t) {var r, n;return e && e.state ? (n = e.state, t < 0 ? (r = 0, t = -t) : (r = 1 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? Ei : (null !== n.window && n.wbits !== t && (n.window = null), n.wrap = r, n.wbits = t, fo(e))) : Ei;}(e, t)) !== yi && (e.state = null), r) : Ei;}var uo,po,_o = !0;function go(e) {if (_o) {var t;for (uo = new Kt(512), po = new Kt(32), t = 0; t < 144;) {e.lens[t++] = 8;}for (; t < 256;) {e.lens[t++] = 9;}for (; t < 280;) {e.lens[t++] = 7;}for (; t < 288;) {e.lens[t++] = 8;}for (di(_i, e.lens, 0, 288, uo, 0, e.work, { bits: 9 }), t = 0; t < 32;) {e.lens[t++] = 5;}di(gi, e.lens, 0, 32, po, 0, e.work, { bits: 5 }), _o = !1;}e.lencode = uo, e.lenbits = 9, e.distcode = po, e.distbits = 5;}function vo(e, t) {var r,n,i,o,a,s,h,l,f,c,u,d,p,_,g,v,w,b,y,m,k,E,S,x,R = 0,A = new Wt(4),B = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) return Ei;(r = e.state).mode === Hi && (r.mode = Fi), a = e.next_out, i = e.output, h = e.avail_out, o = e.next_in, n = e.input, s = e.avail_in, l = r.hold, f = r.bits, c = s, u = h, E = yi;e: for (;;) {switch (r.mode) {case Bi:if (0 === r.wrap) {r.mode = Fi;break;}for (; f < 16;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}if (2 & r.wrap && 35615 === l) {r.check = 0, A[0] = 255 & l, A[1] = l >>> 8 & 255, r.check = $r(r.check, A, 2, 0), l = 0, f = 0, r.mode = zi;break;}if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & l) << 8) + (l >> 8)) % 31) {e.msg = "incorrect header check", r.mode = no;break;}if ((15 & l) !== Ai) {e.msg = "unknown compression method", r.mode = no;break;}if (f -= 4, k = 8 + (15 & (l >>>= 4)), 0 === r.wbits) r.wbits = k;else if (k > r.wbits) {e.msg = "invalid window size", r.mode = no;break;}r.dmax = 1 << k, e.adler = r.check = 1, r.mode = 512 & l ? Oi : Hi, l = 0, f = 0;break;case zi:for (; f < 16;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}if (r.flags = l, (255 & r.flags) !== Ai) {e.msg = "unknown compression method", r.mode = no;break;}if (57344 & r.flags) {e.msg = "unknown header flags set", r.mode = no;break;}r.head && (r.head.text = l >> 8 & 1), 512 & r.flags && (A[0] = 255 & l, A[1] = l >>> 8 & 255, r.check = $r(r.check, A, 2, 0)), l = 0, f = 0, r.mode = Li;case Li:for (; f < 32;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}r.head && (r.head.time = l), 512 & r.flags && (A[0] = 255 & l, A[1] = l >>> 8 & 255, A[2] = l >>> 16 & 255, A[3] = l >>> 24 & 255, r.check = $r(r.check, A, 4, 0)), l = 0, f = 0, r.mode = Ti;case Ti:for (; f < 16;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}r.head && (r.head.xflags = 255 & l, r.head.os = l >> 8), 512 & r.flags && (A[0] = 255 & l, A[1] = l >>> 8 & 255, r.check = $r(r.check, A, 2, 0)), l = 0, f = 0, r.mode = Mi;case Mi:if (1024 & r.flags) {for (; f < 16;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}r.length = l, r.head && (r.head.extra_len = l), 512 & r.flags && (A[0] = 255 & l, A[1] = l >>> 8 & 255, r.check = $r(r.check, A, 2, 0)), l = 0, f = 0;} else r.head && (r.head.extra = null);r.mode = Ci;case Ci:if (1024 & r.flags && ((d = r.length) > s && (d = s), d && (r.head && (k = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), jt(r.head.extra, n, o, d, k)), 512 & r.flags && (r.check = $r(r.check, n, d, o)), s -= d, o += d, r.length -= d), r.length)) break e;r.length = 0, r.mode = Di;case Di:if (2048 & r.flags) {if (0 === s) break e;d = 0;do {k = n[o + d++], r.head && k && r.length < 65536 && (r.head.name += String.fromCharCode(k));} while (k && d < s);if (512 & r.flags && (r.check = $r(r.check, n, d, o)), s -= d, o += d, k) break e;} else r.head && (r.head.name = null);r.length = 0, r.mode = Ii;case Ii:if (4096 & r.flags) {if (0 === s) break e;d = 0;do {k = n[o + d++], r.head && k && r.length < 65536 && (r.head.comment += String.fromCharCode(k));} while (k && d < s);if (512 & r.flags && (r.check = $r(r.check, n, d, o)), s -= d, o += d, k) break e;} else r.head && (r.head.comment = null);r.mode = Pi;case Pi:if (512 & r.flags) {for (; f < 16;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}if (l !== (65535 & r.check)) {e.msg = "header crc mismatch", r.mode = no;break;}l = 0, f = 0;}r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = !0), e.adler = r.check = 0, r.mode = Hi;break;case Oi:for (; f < 32;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}e.adler = r.check = ho(l), l = 0, f = 0, r.mode = Ui;case Ui:if (0 === r.havedict) return e.next_out = a, e.avail_out = h, e.next_in = o, e.avail_in = s, r.hold = l, r.bits = f, ki;e.adler = r.check = 1, r.mode = Hi;case Hi:if (t === wi || t === bi) break e;case Fi:if (r.last) {l >>>= 7 & f, f -= 7 & f, r.mode = eo;break;}for (; f < 3;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}switch (r.last = 1 & l, f -= 1, 3 & (l >>>= 1)) {case 0:r.mode = Ni;break;case 1:if (go(r), r.mode = Xi, t === bi) {l >>>= 2, f -= 2;break e;}break;case 2:r.mode = Wi;break;case 3:e.msg = "invalid block type", r.mode = no;}l >>>= 2, f -= 2;break;case Ni:for (l >>>= 7 & f, f -= 7 & f; f < 32;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}if ((65535 & l) != (l >>> 16 ^ 65535)) {e.msg = "invalid stored block lengths", r.mode = no;break;}if (r.length = 65535 & l, l = 0, f = 0, r.mode = Zi, t === bi) break e;case Zi:r.mode = ji;case ji:if (d = r.length) {if (d > s && (d = s), d > h && (d = h), 0 === d) break e;jt(i, n, o, d, a), s -= d, o += d, h -= d, a += d, r.length -= d;break;}r.mode = Hi;break;case Wi:for (; f < 14;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}if (r.nlen = 257 + (31 & l), l >>>= 5, f -= 5, r.ndist = 1 + (31 & l), l >>>= 5, f -= 5, r.ncode = 4 + (15 & l), l >>>= 4, f -= 4, r.nlen > 286 || r.ndist > 30) {e.msg = "too many length or distance symbols", r.mode = no;break;}r.have = 0, r.mode = Yi;case Yi:for (; r.have < r.ncode;) {for (; f < 3;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}r.lens[B[r.have++]] = 7 & l, l >>>= 3, f -= 3;}for (; r.have < 19;) {r.lens[B[r.have++]] = 0;}if (r.lencode = r.lendyn, r.lenbits = 7, S = { bits: r.lenbits }, E = di(pi, r.lens, 0, 19, r.lencode, 0, r.work, S), r.lenbits = S.bits, E) {e.msg = "invalid code lengths set", r.mode = no;break;}r.have = 0, r.mode = Ki;case Ki:for (; r.have < r.nlen + r.ndist;) {for (; v = (R = r.lencode[l & (1 << r.lenbits) - 1]) >>> 16 & 255, w = 65535 & R, !((g = R >>> 24) <= f);) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}if (w < 16) l >>>= g, f -= g, r.lens[r.have++] = w;else {if (16 === w) {for (x = g + 2; f < x;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}if (l >>>= g, f -= g, 0 === r.have) {e.msg = "invalid bit length repeat", r.mode = no;break;}k = r.lens[r.have - 1], d = 3 + (3 & l), l >>>= 2, f -= 2;} else if (17 === w) {for (x = g + 3; f < x;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}f -= g, k = 0, d = 3 + (7 & (l >>>= g)), l >>>= 3, f -= 3;} else {for (x = g + 7; f < x;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}f -= g, k = 0, d = 11 + (127 & (l >>>= g)), l >>>= 7, f -= 7;}if (r.have + d > r.nlen + r.ndist) {e.msg = "invalid bit length repeat", r.mode = no;break;}for (; d--;) {r.lens[r.have++] = k;}}}if (r.mode === no) break;if (0 === r.lens[256]) {e.msg = "invalid code -- missing end-of-block", r.mode = no;break;}if (r.lenbits = 9, S = { bits: r.lenbits }, E = di(_i, r.lens, 0, r.nlen, r.lencode, 0, r.work, S), r.lenbits = S.bits, E) {e.msg = "invalid literal/lengths set", r.mode = no;break;}if (r.distbits = 6, r.distcode = r.distdyn, S = { bits: r.distbits }, E = di(gi, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, S), r.distbits = S.bits, E) {e.msg = "invalid distances set", r.mode = no;break;}if (r.mode = Xi, t === bi) break e;case Xi:r.mode = qi;case qi:if (s >= 6 && h >= 258) {e.next_out = a, e.avail_out = h, e.next_in = o, e.avail_in = s, r.hold = l, r.bits = f, ri(e, u), a = e.next_out, i = e.output, h = e.avail_out, o = e.next_in, n = e.input, s = e.avail_in, l = r.hold, f = r.bits, r.mode === Hi && (r.back = -1);break;}for (r.back = 0; v = (R = r.lencode[l & (1 << r.lenbits) - 1]) >>> 16 & 255, w = 65535 & R, !((g = R >>> 24) <= f);) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}if (v && 0 == (240 & v)) {for (b = g, y = v, m = w; v = (R = r.lencode[m + ((l & (1 << b + y) - 1) >> b)]) >>> 16 & 255, w = 65535 & R, !(b + (g = R >>> 24) <= f);) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}l >>>= b, f -= b, r.back += b;}if (l >>>= g, f -= g, r.back += g, r.length = w, 0 === v) {r.mode = Qi;break;}if (32 & v) {r.back = -1, r.mode = Hi;break;}if (64 & v) {e.msg = "invalid literal/length code", r.mode = no;break;}r.extra = 15 & v, r.mode = Vi;case Vi:if (r.extra) {for (x = r.extra; f < x;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}r.length += l & (1 << r.extra) - 1, l >>>= r.extra, f -= r.extra, r.back += r.extra;}r.was = r.length, r.mode = Gi;case Gi:for (; v = (R = r.distcode[l & (1 << r.distbits) - 1]) >>> 16 & 255, w = 65535 & R, !((g = R >>> 24) <= f);) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}if (0 == (240 & v)) {for (b = g, y = v, m = w; v = (R = r.distcode[m + ((l & (1 << b + y) - 1) >> b)]) >>> 16 & 255, w = 65535 & R, !(b + (g = R >>> 24) <= f);) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}l >>>= b, f -= b, r.back += b;}if (l >>>= g, f -= g, r.back += g, 64 & v) {e.msg = "invalid distance code", r.mode = no;break;}r.offset = w, r.extra = 15 & v, r.mode = $i;case $i:if (r.extra) {for (x = r.extra; f < x;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}r.offset += l & (1 << r.extra) - 1, l >>>= r.extra, f -= r.extra, r.back += r.extra;}if (r.offset > r.dmax) {e.msg = "invalid distance too far back", r.mode = no;break;}r.mode = Ji;case Ji:if (0 === h) break e;if (d = u - h, r.offset > d) {if ((d = r.offset - d) > r.whave && r.sane) {e.msg = "invalid distance too far back", r.mode = no;break;}d > r.wnext ? (d -= r.wnext, p = r.wsize - d) : p = r.wnext - d, d > r.length && (d = r.length), _ = r.window;} else _ = i, p = a - r.offset, d = r.length;d > h && (d = h), h -= d, r.length -= d;do {i[a++] = _[p++];} while (--d);0 === r.length && (r.mode = qi);break;case Qi:if (0 === h) break e;i[a++] = r.length, h--, r.mode = qi;break;case eo:if (r.wrap) {for (; f < 32;) {if (0 === s) break e;s--, l |= n[o++] << f, f += 8;}if (u -= h, e.total_out += u, r.total += u, u && (e.adler = r.check = r.flags ? $r(r.check, i, u, a - u) : Vr(r.check, i, u, a - u)), u = h, (r.flags ? l : ho(l)) !== r.check) {e.msg = "incorrect data check", r.mode = no;break;}l = 0, f = 0;}r.mode = to;case to:if (r.wrap && r.flags) {for (; f < 32;) {if (0 === s) break e;s--, l += n[o++] << f, f += 8;}if (l !== (4294967295 & r.total)) {e.msg = "incorrect length check", r.mode = no;break;}l = 0, f = 0;}r.mode = ro;case ro:E = mi;break e;case no:E = Si;break e;case io:return xi;case oo:default:return Ei;}}return e.next_out = a, e.avail_out = h, e.next_in = o, e.avail_in = s, r.hold = l, r.bits = f, (r.wsize || u !== e.avail_out && r.mode < no && (r.mode < eo || t !== vi)) && function (e, t, r, n) {var i,o = e.state;null === o.window && (o.wsize = 1 << o.wbits, o.wnext = 0, o.whave = 0, o.window = new Wt(o.wsize)), n >= o.wsize ? (jt(o.window, t, r - o.wsize, o.wsize, 0), o.wnext = 0, o.whave = o.wsize) : ((i = o.wsize - o.wnext) > n && (i = n), jt(o.window, t, r - n, i, o.wnext), (n -= i) ? (jt(o.window, t, r - n, n, 0), o.wnext = n, o.whave = o.wsize) : (o.wnext += i, o.wnext === o.wsize && (o.wnext = 0), o.whave < o.wsize && (o.whave += i)));}(e, e.output, e.next_out, u - e.avail_out), c -= e.avail_in, u -= e.avail_out, e.total_in += c, e.total_out += u, r.total += u, r.wrap && u && (e.adler = r.check = r.flags ? $r(r.check, i, u, e.next_out - u) : Vr(r.check, i, u, e.next_out - u)), e.data_type = r.bits + (r.last ? 64 : 0) + (r.mode === Hi ? 128 : 0) + (r.mode === Xi || r.mode === Zi ? 256 : 0), (0 === c && 0 === u || t === vi) && E === yi && (E = Ri), E;}var wo,bo = 1,yo = 7;function mo(e) {if (e < bo || e > yo) throw new TypeError("Bad argument");this.mode = e, this.init_done = !1, this.write_in_progress = !1, this.pending_close = !1, this.windowBits = 0, this.level = 0, this.memLevel = 0, this.strategy = 0, this.dictionary = null;}function ko(e, t) {for (var r = 0; r < e.length; r++) {this[t + r] = e[r];}}mo.prototype.init = function (e, t, r, n, i) {var o;switch (this.windowBits = e, this.level = t, this.memLevel = r, this.strategy = n, 3 !== this.mode && 4 !== this.mode || (this.windowBits += 16), this.mode === yo && (this.windowBits += 32), 5 !== this.mode && 6 !== this.mode || (this.windowBits = -this.windowBits), this.strm = new Zt(), this.mode) {case bo:case 3:case 5:o = function (e, t, r, n, i, o) {if (!e) return sn;var a = 1;if (t === fn && (t = 6), n < 0 ? (a = 0, n = -n) : n > 15 && (a = 2, n -= 16), i < 1 || i > vn || r !== gn || n < 8 || n > 15 || t < 0 || t > 9 || o < 0 || o > pn) return Hn(e, sn);8 === n && (n = 9);var s = new $n();return e.state = s, s.strm = e, s.wrap = a, s.gzhead = null, s.w_bits = n, s.w_size = 1 << s.w_bits, s.w_mask = s.w_size - 1, s.hash_bits = i + 7, s.hash_size = 1 << s.hash_bits, s.hash_mask = s.hash_size - 1, s.hash_shift = ~~((s.hash_bits + En - 1) / En), s.window = new Wt(2 * s.w_size), s.head = new Yt(s.hash_size), s.prev = new Yt(s.w_size), s.lit_bufsize = 1 << i + 6, s.pending_buf_size = 4 * s.lit_bufsize, s.pending_buf = new Wt(s.pending_buf_size), s.d_buf = 1 * s.lit_bufsize, s.l_buf = 3 * s.lit_bufsize, s.level = t, s.strategy = o, s.method = r, Jn(e);}(this.strm, this.level, 8, this.windowBits, this.memLevel, this.strategy);break;case 2:case 4:case 6:case yo:o = co(this.strm, this.windowBits);break;default:throw new Error("Unknown mode " + this.mode);}0 === o ? (this.write_in_progress = !1, this.init_done = !0) : this._error(o);}, mo.prototype.params = function () {throw new Error("deflateParams Not supported");}, mo.prototype._writeCheck = function () {if (!this.init_done) throw new Error("write before init");if (0 === this.mode) throw new Error("already finalized");if (this.write_in_progress) throw new Error("write already in progress");if (this.pending_close) throw new Error("close is pending");}, mo.prototype.write = function (e, t, r, n, i, o, a) {this._writeCheck(), this.write_in_progress = !0;var s = this;return de(function () {s.write_in_progress = !1;var h = s._write(e, t, r, n, i, o, a);s.callback(h[0], h[1]), s.pending_close && s.close();}), this;}, mo.prototype.writeSync = function (e, t, r, n, i, o, a) {return this._writeCheck(), this._write(e, t, r, n, i, o, a);}, mo.prototype._write = function (e, t, r, n, i, o, a) {if (this.write_in_progress = !0, 0 !== e && 1 !== e && 2 !== e && 3 !== e && 4 !== e && 5 !== e) throw new Error("Invalid flush value");null == t && (t = new p(0), n = 0, r = 0), i._set ? i.set = i._set : i.set = ko;var s,h = this.strm;switch (h.avail_in = n, h.input = t, h.next_in = r, h.avail_out = a, h.output = i, h.next_out = o, this.mode) {case bo:case 3:case 5:s = Qn(h, e);break;case yo:case 2:case 4:case 6:s = vo(h, e);break;default:throw new Error("Unknown mode " + this.mode);}return 1 !== s && 0 !== s && this._error(s), this.write_in_progress = !1, [h.avail_in, h.avail_out];}, mo.prototype.close = function () {this.write_in_progress ? this.pending_close = !0 : (this.pending_close = !1, this.mode === bo || 3 === this.mode || 5 === this.mode ? function (e) {var t;e && e.state && ((t = e.state.status) !== An && t !== Bn && t !== zn && t !== Ln && t !== Tn && t !== Mn && t !== Cn ? Hn(e, sn) : (e.state = null, t === Mn && Hn(e, hn)));}(this.strm) : function (e) {if (!e || !e.state) return Ei;var t = e.state;t.window && (t.window = null), e.state = null;}(this.strm), this.mode = 0);}, mo.prototype.reset = function () {switch (this.mode) {case bo:case 5:wo = Jn(this.strm);break;case 2:case 6:wo = fo(this.strm);}0 !== wo && this._error(wo);}, mo.prototype._error = function (e) {this.onerror(Nt[e] + ": " + this.strm.msg, e), this.write_in_progress = !1, this.pending_close && this.close();};var Eo = Object.freeze({ NONE: 0, DEFLATE: bo, INFLATE: 2, GZIP: 3, GUNZIP: 4, DEFLATERAW: 5, INFLATERAW: 6, UNZIP: yo, Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8, Zlib: mo });var So = {};Object.keys(Eo).forEach(function (e) {So[e] = Eo[e];}), So.Z_MIN_WINDOWBITS = 8, So.Z_MAX_WINDOWBITS = 15, So.Z_DEFAULT_WINDOWBITS = 15, So.Z_MIN_CHUNK = 64, So.Z_MAX_CHUNK = 1 / 0, So.Z_DEFAULT_CHUNK = 16384, So.Z_MIN_MEMLEVEL = 1, So.Z_MAX_MEMLEVEL = 9, So.Z_DEFAULT_MEMLEVEL = 8, So.Z_MIN_LEVEL = -1, So.Z_MAX_LEVEL = 9, So.Z_DEFAULT_LEVEL = So.Z_DEFAULT_COMPRESSION;var xo = { Z_OK: So.Z_OK, Z_STREAM_END: So.Z_STREAM_END, Z_NEED_DICT: So.Z_NEED_DICT, Z_ERRNO: So.Z_ERRNO, Z_STREAM_ERROR: So.Z_STREAM_ERROR, Z_DATA_ERROR: So.Z_DATA_ERROR, Z_MEM_ERROR: So.Z_MEM_ERROR, Z_BUF_ERROR: So.Z_BUF_ERROR, Z_VERSION_ERROR: So.Z_VERSION_ERROR };function Ro(e, t, r) {var n = [],i = 0;function o() {for (var t; null !== (t = e.read());) {n.push(t), i += t.length;}e.once("readable", o);}function a() {var t = p.concat(n, i);n = [], r(null, t), e.close();}e.on("error", function (t) {e.removeListener("end", a), e.removeListener("readable", o), r(t);}), e.on("end", a), e.end(t), o();}function Ao(e, t) {if ("string" == typeof t && (t = new p(t)), !$(t)) throw new TypeError("Not a string or buffer");var r = So.Z_FINISH;return e._processChunk(t, r);}function Bo(e) {if (!(this instanceof Bo)) return new Bo(e);Io.call(this, e, So.DEFLATE);}function zo(e) {if (!(this instanceof zo)) return new zo(e);Io.call(this, e, So.INFLATE);}function Lo(e) {if (!(this instanceof Lo)) return new Lo(e);Io.call(this, e, So.GZIP);}function To(e) {if (!(this instanceof To)) return new To(e);Io.call(this, e, So.GUNZIP);}function Mo(e) {if (!(this instanceof Mo)) return new Mo(e);Io.call(this, e, So.DEFLATERAW);}function Co(e) {if (!(this instanceof Co)) return new Co(e);Io.call(this, e, So.INFLATERAW);}function Do(e) {if (!(this instanceof Do)) return new Do(e);Io.call(this, e, So.UNZIP);}function Io(e, t) {if (this._opts = e = e || {}, this._chunkSize = e.chunkSize || So.Z_DEFAULT_CHUNK, Ot.call(this, e), e.flush && e.flush !== So.Z_NO_FLUSH && e.flush !== So.Z_PARTIAL_FLUSH && e.flush !== So.Z_SYNC_FLUSH && e.flush !== So.Z_FULL_FLUSH && e.flush !== So.Z_FINISH && e.flush !== So.Z_BLOCK) throw new Error("Invalid flush flag: " + e.flush);if (this._flushFlag = e.flush || So.Z_NO_FLUSH, e.chunkSize && (e.chunkSize < So.Z_MIN_CHUNK || e.chunkSize > So.Z_MAX_CHUNK)) throw new Error("Invalid chunk size: " + e.chunkSize);if (e.windowBits && (e.windowBits < So.Z_MIN_WINDOWBITS || e.windowBits > So.Z_MAX_WINDOWBITS)) throw new Error("Invalid windowBits: " + e.windowBits);if (e.level && (e.level < So.Z_MIN_LEVEL || e.level > So.Z_MAX_LEVEL)) throw new Error("Invalid compression level: " + e.level);if (e.memLevel && (e.memLevel < So.Z_MIN_MEMLEVEL || e.memLevel > So.Z_MAX_MEMLEVEL)) throw new Error("Invalid memLevel: " + e.memLevel);if (e.strategy && e.strategy != So.Z_FILTERED && e.strategy != So.Z_HUFFMAN_ONLY && e.strategy != So.Z_RLE && e.strategy != So.Z_FIXED && e.strategy != So.Z_DEFAULT_STRATEGY) throw new Error("Invalid strategy: " + e.strategy);if (e.dictionary && !$(e.dictionary)) throw new Error("Invalid dictionary: it should be a Buffer instance");this._binding = new So.Zlib(t);var r = this;this._hadError = !1, this._binding.onerror = function (e, t) {r._binding = null, r._hadError = !0;var n = new Error(e);n.errno = t, n.code = So.codes[t], r.emit("error", n);};var n = So.Z_DEFAULT_COMPRESSION;"number" == typeof e.level && (n = e.level);var i = So.Z_DEFAULT_STRATEGY;"number" == typeof e.strategy && (i = e.strategy), this._binding.init(e.windowBits || So.Z_DEFAULT_WINDOWBITS, n, e.memLevel || So.Z_DEFAULT_MEMLEVEL, i, e.dictionary), this._buffer = new p(this._chunkSize), this._offset = 0, this._closed = !1, this._level = n, this._strategy = i, this.once("end", this.close);}Object.keys(xo).forEach(function (e) {xo[xo[e]] = e;}), Be(Io, Ot), Io.prototype.params = function (e, t, r) {if (e < So.Z_MIN_LEVEL || e > So.Z_MAX_LEVEL) throw new RangeError("Invalid compression level: " + e);if (t != So.Z_FILTERED && t != So.Z_HUFFMAN_ONLY && t != So.Z_RLE && t != So.Z_FIXED && t != So.Z_DEFAULT_STRATEGY) throw new TypeError("Invalid strategy: " + t);if (this._level !== e || this._strategy !== t) {var n = this;this.flush(So.Z_SYNC_FLUSH, function () {n._binding.params(e, t), n._hadError || (n._level = e, n._strategy = t, r && r());});} else de(r);}, Io.prototype.reset = function () {return this._binding.reset();}, Io.prototype._flush = function (e) {this._transform(new p(0), "", e);}, Io.prototype.flush = function (e, t) {var r = this._writableState;if (("function" == typeof e || void 0 === e && !t) && (t = e, e = So.Z_FULL_FLUSH), r.ended) t && de(t);else if (r.ending) t && this.once("end", t);else if (r.needDrain) {var n = this;this.once("drain", function () {n.flush(t);});} else this._flushFlag = e, this.write(new p(0), "", t);}, Io.prototype.close = function (e) {if (e && de(e), !this._closed) {this._closed = !0, this._binding.close();var t = this;de(function () {t.emit("close");});}}, Io.prototype._transform = function (e, t, r) {var n,i = this._writableState,o = (i.ending || i.ended) && (!e || i.length === e.length);if (null === !e && !$(e)) return r(new Error("invalid input"));o ? n = So.Z_FINISH : (n = this._flushFlag, e.length >= i.length && (this._flushFlag = this._opts.flush || So.Z_NO_FLUSH)), this._processChunk(e, n, r);}, Io.prototype._processChunk = function (e, t, r) {var n = e && e.length,i = this._chunkSize - this._offset,o = 0,a = this,s = "function" == typeof r;if (!s) {var h,l = [],f = 0;this.on("error", function (e) {h = e;});do {var c = this._binding.writeSync(t, e, o, n, this._buffer, this._offset, i);} while (!this._hadError && _(c[0], c[1]));if (this._hadError) throw h;var u = p.concat(l, f);return this.close(), u;}var d = this._binding.write(t, e, o, n, this._buffer, this._offset, i);function _(h, c) {if (!a._hadError) {var u = i - c;if (function (e, t) {if (!e) throw new Error(t);}(u >= 0, "have should not go down"), u > 0) {var d = a._buffer.slice(a._offset, a._offset + u);a._offset += u, s ? a.push(d) : (l.push(d), f += d.length);}if ((0 === c || a._offset >= a._chunkSize) && (i = a._chunkSize, a._offset = 0, a._buffer = new p(a._chunkSize)), 0 === c) {if (o += n - h, n = h, !s) return !0;var g = a._binding.write(t, e, o, n, a._buffer, a._offset, a._chunkSize);return g.callback = _, void (g.buffer = e);}if (!s) return !1;r();}}d.buffer = e, d.callback = _;}, Be(Bo, Io), Be(zo, Io), Be(Lo, Io), Be(To, Io), Be(Mo, Io), Be(Co, Io), Be(Do, Io);var Po = { codes: xo, createDeflate: function createDeflate(e) {return new Bo(e);}, createInflate: function createInflate(e) {return new zo(e);}, createDeflateRaw: function createDeflateRaw(e) {return new Mo(e);}, createInflateRaw: function createInflateRaw(e) {return new Co(e);}, createGzip: function createGzip(e) {return new Lo(e);}, createGunzip: function createGunzip(e) {return new To(e);}, createUnzip: function createUnzip(e) {return new Do(e);}, deflate: function deflate(e, t, r) {return "function" == typeof t && (r = t, t = {}), Ro(new Bo(t), e, r);}, deflateSync: function deflateSync(e, t) {return Ao(new Bo(t), e);}, gzip: function gzip(e, t, r) {return "function" == typeof t && (r = t, t = {}), Ro(new Lo(t), e, r);}, gzipSync: function gzipSync(e, t) {return Ao(new Lo(t), e);}, deflateRaw: function deflateRaw(e, t, r) {return "function" == typeof t && (r = t, t = {}), Ro(new Mo(t), e, r);}, deflateRawSync: function deflateRawSync(e, t) {return Ao(new Mo(t), e);}, unzip: function unzip(e, t, r) {return "function" == typeof t && (r = t, t = {}), Ro(new Do(t), e, r);}, unzipSync: function unzipSync(e, t) {return Ao(new Do(t), e);}, inflate: function inflate(e, t, r) {return "function" == typeof t && (r = t, t = {}), Ro(new zo(t), e, r);}, inflateSync: function inflateSync(e, t) {return Ao(new zo(t), e);}, gunzip: function gunzip(e, t, r) {return "function" == typeof t && (r = t, t = {}), Ro(new To(t), e, r);}, gunzipSync: function gunzipSync(e, t) {return Ao(new To(t), e);}, inflateRaw: function inflateRaw(e, t, r) {return "function" == typeof t && (r = t, t = {}), Ro(new Co(t), e, r);}, inflateRawSync: function inflateRawSync(e, t) {return Ao(new Co(t), e);}, Deflate: Bo, Inflate: zo, Gzip: Lo, Gunzip: To, DeflateRaw: Mo, InflateRaw: Co, Unzip: Do, Zlib: Io };var _default = /*#__PURE__*/function () {function _default(e, t, r) {_classCallCheck(this, _default);this.SDKAPPID = e, this.EXPIRETIME = r, this.PRIVATEKEY = t;}_createClass(_default, [{ key: "genTestUserSig", value: function genTestUserSig(e) {return this._isNumber(this.SDKAPPID) ? this._isString(this.PRIVATEKEY) ? this._isString(e) ? this._isNumber(this.EXPIRETIME) ? (console.log("SDKAppID=" + this.SDKAPPID + " key=" + this.PRIVATEKEY + " userID=" + e + " expire=" + this.EXPIRETIME), this.genSigWithUserbuf(e, this.EXPIRETIME, null)) : (console.error("expireTime must be a number"), "") : (console.error("userID must be a string"), "") : (console.error("privateKey must be a string"), "") : (console.error("SDKAppID must be a number"), "");} }, { key: "newBuffer", value: function newBuffer(e, t) {return p.from ? p.from(e, t) : new p(e, t);} }, { key: "unescape", value: function unescape(e) {return e.replace(/_/g, "=").replace(/\-/g, "/").replace(/\*/g, "+");} }, { key: "escape", value: function escape(e) {return e.replace(/\+/g, "*").replace(/\//g, "-").replace(/=/g, "_");} }, { key: "encode", value: function encode(e) {return this.escape(this.newBuffer(e).toString("base64"));} }, { key: "decode", value: function decode(e) {return this.newBuffer(this.unescape(e), "base64");} }, { key: "base64encode", value: function base64encode(e) {return this.newBuffer(e).toString("base64");} }, { key: "base64decode", value: function base64decode(e) {return this.newBuffer(e, "base64").toString();} }, { key: "_hmacsha256", value: function _hmacsha256(e, t, r, n) {var i = "TLS.identifier:" + e + "\n";i += "TLS.sdkappid:" + this.SDKAPPID + "\n", i += "TLS.time:" + t + "\n", i += "TLS.expire:" + r + "\n", null != n && (i += "TLS.userbuf:" + n + "\n");var o = te.HmacSHA256(i, this.PRIVATEKEY);return te.enc.Base64.stringify(o);} }, { key: "_utc", value: function _utc() {return Math.round(Date.now() / 1e3);} }, { key: "_isNumber", value: function _isNumber(e) {return null !== e && ("number" == typeof e && !isNaN(e - 0) || "object" == typeof e && e.constructor === Number);} }, { key: "_isString", value: function _isString(e) {return "string" == typeof e;} }, { key: "genSigWithUserbuf", value: function genSigWithUserbuf(e, t, r) {var n = this._utc(),i = { "TLS.ver": "2.0", "TLS.identifier": e, "TLS.sdkappid": this.SDKAPPID, "TLS.time": n, "TLS.expire": t },o = "";if (null != r) {var _a = this.base64encode(r);i["TLS.userbuf"] = _a, o = this._hmacsha256(e, n, t, _a);} else o = this._hmacsha256(e, n, t, null);i["TLS.sig"] = o;var a = JSON.stringify(i),s = Po.deflateSync(this.newBuffer(a)).toString("base64"),h = this.escape(s);return console.log("ret=" + h), h;} }, { key: "validate", value: function validate(e) {var t = this.decode(e),r = Po.inflateSync(t);console.log("validate ret=" + r);} }]);return _default;}();exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! (webpack)/buildin/global.js */ 3)))

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25720200116005","_inBundle":false,"_integrity":"sha512-RZFw3WAaS/CZTzzv9JPaWvmoNitojD/06vPdHSzlqZi8GbuE222lFuyochEjrGkG8rPPrWHAnwfoPBuQVtkfdg==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25720200116005.tgz","_shasum":"08bb17aba91c84a981f33d74153aa3dd07b578ad","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"a129bde60de35f7ef497f43d5a45b4556231995c","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25720200116005"};

/***/ }),

/***/ 7:
/*!***************************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/pages.json?{"type":"style"} ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/cards/cards": {}, "pages/home/home": { "navigationBarTitleText": "首页" }, "pages/profile/profile": { "navigationBarTitleText": "个人中心" }, "pages/category/category": { "navigationBarTitleText": "分类" }, "pages/cart/cart": { "navigationBarTitleText": "购物车" }, "pages/index/index": { "navigationBarTitleText": "simba" }, "pages/shop/shop": { "navigationBarTitleText": "店铺详情" }, "components/shop/header/header": {}, "pages/cards/cardDetail": {} }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "uni-app", "navigationBarBackgroundColor": "#F8F8F8", "backgroundColor": "#F8F8F8", "navigationStyle": "custom" } };exports.default = _default;

/***/ }),

/***/ 8:
/*!**************************************************************************!*\
  !*** E:/workspace/小程序/uniapp/unidemo1/uniapp/pages.json?{"type":"stat"} ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "" };exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map