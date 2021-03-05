self.uhtml = (function (exports) {
  'use strict';

  var umap = _ => ({
    // About: get: _.get.bind(_)
    // It looks like WebKit/Safari didn't optimize bind at all,
    // so that using bind slows it down by 60%.
    // Firefox and Chrome are just fine in both cases,
    // so let's use the approach that works fast everywhere 👍
    get: key => _.get(key),
    set: (key, value) => (_.set(key, value), value)
  });

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

  const {replace} = '';
  const ca = /[&<>'"]/g;

  const esca = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  };
  const pe = m => esca[m];

  /**
   * Safely escape HTML entities such as `&`, `<`, `>`, `"`, and `'`.
   * @param {string} es the input to safely escape
   * @returns {string} the escaped input, and it **throws** an error if
   *  the input type is unexpected, except for boolean and numbers,
   *  converted as string.
   */
  const escape = es => replace.call(es, ca, pe);

  var uhyphen = camel => camel.replace(/(([A-Z0-9])([A-Z0-9][a-z]))|(([a-z])([A-Z]))/g, '$2$5-$3$6')
                               .toLowerCase();

  const attr = /([^\s\\>"'=]+)\s*=\s*(['"]?)$/;
  const empty = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
  const node = /<[a-z][^>]+$/i;
  const notNode = />[^<>]*$/;
  const selfClosing = /<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/>)/ig;
  const trimEnd = /\s+$/;

  const isNode = (template, i) => (
      0 < i-- && (
      node.test(template[i]) || (
        !notNode.test(template[i]) && isNode(template, i)
      )
    )
  );

  const regular = (original, name, extra) => empty.test(name) ?
                    original : `<${name}${extra.replace(trimEnd,'')}></${name}>`;

  var instrument = (template, prefix, svg) => {
    const text = [];
    const {length} = template;
    for (let i = 1; i < length; i++) {
      const chunk = template[i - 1];
      text.push(attr.test(chunk) && isNode(template, i) ?
        chunk.replace(
          attr,
          (_, $1, $2) => `${prefix}${i - 1}=${$2 || '"'}${$1}${$2 ? '' : '"'}`
        ) :
        `${chunk}<!--${prefix}${i - 1}-->`
      );
    }
    text.push(template[length - 1]);
    const output = text.join('').trim();
    return svg ? output : output.replace(selfClosing, regular);
  };

  const ref = node => {
    let oldValue;
    return value => {
      if (oldValue !== value) {
        oldValue = value;
        if (typeof value === 'function')
          value(node);
        else
          value.current = node;
      }
    };
  };

  const {isArray} = Array;
  const {toString} = Function;
  const {keys} = Object;

  const passRef = ref(null);
  const prefix = 'isµ' + Date.now();
  const interpolation = new RegExp(
    `(<!--${prefix}(\\d+)-->|\\s*${prefix}(\\d+)=('|")([^\\4]+?)\\4)`, 'g'
  );

  const attribute = (name, quote, value) =>
                      ` ${name}=${quote}${escape(value)}${quote}`;

  const getValue = value => {
    switch (typeof value) {
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
        break;
      case 'function':
        return getValue(value());
    }
    return value == null ? '' : escape(String(value));
  };

  class Hole extends String {}

  const parse = (template, expectedLength, svg) => {
    const html = instrument(template, prefix, svg);
    const updates = [];
    let i = 0;
    let match = null;
    while (match = interpolation.exec(html)) {
      const pre = html.slice(i, match.index);
      i = match.index + match[0].length;
      if (match[2])
        updates.push(value => (pre + getValue(value)));
      else {
        const name = match[5];
        const quote = match[4];
        switch (true) {
          case name === 'aria':
            updates.push(value => (pre + keys(value).map(aria, value).join('')));
            break;
          case name === 'ref':
            updates.push(value => {
              passRef(value);
              return pre;
            });
            break;
          // setters as boolean attributes (.disabled .contentEditable)
          case name[0] === '?':
            const boolean = name.slice(1).toLowerCase();
            updates.push(value => {
              let result = pre;
              if (value)
                result += ` ${boolean}`;
              return result;
            });
            break;
          case name[0] === '.':
            const lower = name.slice(1).toLowerCase();
            updates.push(lower === 'dataset' ?
              (value => (pre + keys(value).map(data, value).join(''))) :
              (value => {
                let result = pre;
                // null, undefined, and false are not shown at all
                if (value != null && value !== false) {
                  // true means boolean attribute, just show the name
                  if (value === true)
                    result += ` ${lower}`;
                  // in all other cases, just escape it in quotes
                  else
                    result += attribute(lower, quote, value);
                }
                return result;
              })
            );
            break;
          case name.slice(0, 2) === 'on':
            updates.push(value => {
              let result = pre;
              // allow handleEvent based objects that
              // follow the `onMethod` convention
              // allow listeners only if passed as string,
              // as functions with a special toString method,
              // as objects with handleEvents and a method
              switch (typeof value) {
                case 'object':
                  if (!(name in value))
                    break;
                  value = value[name];
                  if (typeof value !== 'function')
                    break;
                case 'function':
                  if (value.toString === toString)
                    break;
                case 'string':
                  result += attribute(name, quote, value);
                  break;
              }
              return result;
            });
            break;
          default:
            updates.push(value => {
              let result = pre;
              if (value != null)
                result += attribute(name, quote, value);
              return result;
            });
            break;
        }
      }
    }
    const {length} = updates;
    if (length !== expectedLength)
      throw new Error(`invalid template ${template}`);
    if (length) {
      const last = updates[length - 1];
      const chunk = html.slice(i);
      updates[length - 1] = value => (last(value) + chunk);
    }
    else
      updates.push(() => html);
    return updates;
  };

  // declarations
  function aria(key) {
    const value = escape(this[key]);
    return key === 'role' ?
            ` role="${value}"` :
            ` aria-${key.toLowerCase()}="${value}"`;
  }

  function data(key) {
    return ` data-${uhyphen(key)}="${escape(this[key])}"`;
  }

  const cache = umap(new WeakMap);

  const uhtmlParity = svg => {
    const fn = (template, ...values) => {
      const {length} = values;
      const updates = cache.get(template) ||
                      cache.set(template, parse(template, length, svg));
      return new Hole(
        length ?
          values.map(update, updates).join('') :
          updates[0]()
      );
    };
    // both `.node` and `.for` are for feature parity with uhtml
    // but don't do anything different from regular function call
    fn.node = fn;
    fn.for = () => fn;
    return fn;
  };

  const html = uhtmlParity(false);
  const svg = uhtmlParity(true);

  const render = (where, what) => {
    const content = (typeof what === 'function' ? what() : what).toString();
    return typeof where === 'function' ?
            where(content) :
            (where.write(content), where);
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
