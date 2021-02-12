self.uhtml = (function (exports) {
  'use strict';

  var umap = (function (_) {
    return {
      // About: get: _.get.bind(_)
      // It looks like WebKit/Safari didn't optimize bind at all,
      // so that using bind slows it down by 60%.
      // Firefox and Chrome are just fine in both cases,
      // so let's use the approach that works fast everywhere 👍
      get: function get(key) {
        return _.get(key);
      },
      set: function set(key, value) {
        return _.set(key, value), value;
      }
    };
  });

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  /**
   * Copyright (C) 2017-present by Andrea Giammarchi - @WebReflection
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in
   * all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   * THE SOFTWARE.
   */
  var _ref = '',
      replace = _ref.replace; // escape
  var ca = /[&<>'"]/g;
  var esca = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  };

  var pe = function pe(m) {
    return esca[m];
  };

  var escape = function escape(es) {
    return replace.call(es, ca, pe);
  }; // unescape

  var uhyphen = (function (camel) {
    return camel.replace(/(([A-Z0-9])([A-Z0-9][a-z]))|(([a-z])([A-Z]))/g, '$2$5-$3$6').toLowerCase();
  });

  var attr = /([^\s\\>"'=]+)\s*=\s*(['"]?)$/;
  var empty = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
  var node = /<[a-z][^>]+$/i;
  var notNode = />[^<>]*$/;
  var selfClosing = /<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/>)/ig;
  var trimEnd = /\s+$/;

  var isNode = function isNode(template, i) {
    return 0 < i-- && (node.test(template[i]) || !notNode.test(template[i]) && isNode(template, i));
  };

  var regular = function regular(original, name, extra) {
    return empty.test(name) ? original : "<".concat(name).concat(extra.replace(trimEnd, ''), "></").concat(name, ">");
  };

  var instrument = (function (template, prefix, svg) {
    var text = [];
    var length = template.length;

    var _loop = function _loop(i) {
      var chunk = template[i - 1];
      text.push(attr.test(chunk) && isNode(template, i) ? chunk.replace(attr, function (_, $1, $2) {
        return "".concat(prefix).concat(i - 1, "=").concat($2 || '"').concat($1).concat($2 ? '' : '"');
      }) : "".concat(chunk, "<!--").concat(prefix).concat(i - 1, "-->"));
    };

    for (var i = 1; i < length; i++) {
      _loop(i);
    }

    text.push(template[length - 1]);
    var output = text.join('').trim();
    return svg ? output : output.replace(selfClosing, regular);
  });

  var ref = function ref(node) {
    return function (value) {
      if (typeof value === 'function') value(node);else value.current = node;
    };
  };

  var isArray = Array.isArray;
  var toString = Function.toString;
  var keys = Object.keys;
  var passRef = ref(null);
  var prefix = 'isµ' + Date.now();
  var interpolation = new RegExp("(<!--".concat(prefix, "(\\d+)-->|\\s*").concat(prefix, "(\\d+)=('|\")([^\\4]+?)\\4)"), 'g');

  var attribute = function attribute(name, quote, value) {
    return " ".concat(name, "=").concat(quote).concat(escape(value)).concat(quote);
  };

  var getValue = function getValue(value) {
    switch (_typeof(value)) {
      case 'string':
        return escape(value);

      case 'boolean':
      case 'number':
        return String(value);

      case 'object':
        switch (true) {
          case isArray(value):
            return value.map(getValue).join('');

          case value instanceof Hole:
            return value.toString();
        }

    }

    return value == null ? '' : escape(String(value));
  };

  var Hole = /*#__PURE__*/function (_String) {
    _inherits(Hole, _String);

    var _super = _createSuper(Hole);

    function Hole() {
      _classCallCheck(this, Hole);

      return _super.apply(this, arguments);
    }

    return Hole;
  }( /*#__PURE__*/_wrapNativeSuper(String));
  var parse = function parse(template, expectedLength, svg) {
    var html = instrument(template, prefix, svg);
    var updates = [];
    var i = 0;
    var match = null;

    var _loop = function _loop() {
      var pre = html.slice(i, match.index);
      i = match.index + match[0].length;
      if (match[2]) updates.push(function (value) {
        return pre + getValue(value);
      });else {
        var name = match[5];
        var quote = match[4];

        switch (true) {
          case name === 'aria':
            updates.push(function (value) {
              return pre + keys(value).map(aria, value).join('');
            });
            break;

          case name === 'ref':
            updates.push(function (value) {
              passRef(value);
              return pre;
            });
            break;
          // setters as boolean attributes (.disabled .contentEditable)

          case name[0] === '?':
            var _boolean = name.slice(1).toLowerCase();

            updates.push(function (value) {
              var result = pre;
              if (value) result += " ".concat(_boolean);
              return result;
            });
            break;

          case name[0] === '.':
            var lower = name.slice(1).toLowerCase();
            updates.push(lower === 'dataset' ? function (value) {
              return pre + keys(value).map(data, value).join('');
            } : function (value) {
              var result = pre; // null, undefined, and false are not shown at all

              if (value != null && value !== false) {
                // true means boolean attribute, just show the name
                if (value === true) result += " ".concat(lower); // in all other cases, just escape it in quotes
                else result += attribute(lower, quote, value);
              }

              return result;
            });
            break;

          case name.slice(0, 2) === 'on':
            updates.push(function (value) {
              var result = pre; // allow handleEvent based objects that
              // follow the `onMethod` convention
              // allow listeners only if passed as string,
              // as functions with a special toString method,
              // as objects with handleEvents and a method

              switch (_typeof(value)) {
                case 'object':
                  if (!(name in value)) break;
                  value = value[name];
                  if (typeof value !== 'function') break;

                case 'function':
                  if (value.toString === toString) break;

                case 'string':
                  result += attribute(name, quote, value);
                  break;
              }

              return result;
            });
            break;

          default:
            updates.push(function (value) {
              var result = pre;
              if (value != null) result += attribute(name, quote, value);
              return result;
            });
            break;
        }
      }
    };

    while (match = interpolation.exec(html)) {
      _loop();
    }

    var length = updates.length;
    if (length !== expectedLength) throw new Error("invalid template ".concat(template));

    if (length) {
      var last = updates[length - 1];
      var chunk = html.slice(i);

      updates[length - 1] = function (value) {
        return last(value) + chunk;
      };
    } else updates.push(function () {
      return html;
    });

    return updates;
  }; // declarations

  function aria(key) {
    var value = escape(this[key]);
    return key === 'role' ? " role=\"".concat(value, "\"") : " aria-".concat(key.toLowerCase(), "=\"").concat(value, "\"");
  }

  function data(key) {
    return " data-".concat(uhyphen(key), "=\"").concat(escape(this[key]), "\"");
  }

  var cache = umap(new WeakMap());

  var uhtmlParity = function uhtmlParity(svg) {
    var fn = function fn(template) {
      for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        values[_key - 1] = arguments[_key];
      }

      var length = values.length;
      var updates = cache.get(template) || cache.set(template, parse(template, length, svg));
      return new Hole(length ? values.map(update, updates).join('') : updates[0]());
    }; // both `.node` and `.for` are for feature parity with uhtml
    // but don't do anything different from regular function call


    fn.node = fn;

    fn["for"] = function () {
      return fn;
    };

    return fn;
  };
  var html = uhtmlParity(false);
  var svg = uhtmlParity(true);
  var render = function render(where, what) {
    var content = (typeof what === 'function' ? what() : what).toString();
    return typeof where === 'function' ? where(content) : (where.write(content), where);
  };

  function update(value, i) {
    return this[i](value);
  }

  exports.Hole = Hole;
  exports.html = html;
  exports.render = render;
  exports.svg = svg;

  return exports;

}({}));
