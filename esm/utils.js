import instrument from '@webreflection/uparser';
import {escape} from 'html-escaper';
import uhyphen from 'uhyphen';
import {ref} from 'uhandlers';

const {isArray} = Array;
const {toString} = Function;
const {keys} = Object;

const passRef = ref(null);
const prefix = 'isµ' + Date.now();
const rename = /([^\s>]+)[\s\S]*$/;
const interpolation = new RegExp(
  `(<!--${prefix}(\\d+)-->|\\s*${prefix}(\\d+)=([^\\s>]))`, 'g'
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

// flag for foreign checks (slower path, fast by default)
let useForeign = false;

export class Foreign {
  constructor(handler, value) {
    this._ = (...args) => handler(...args, value);
  }
}

export const foreign = (handler, value) => {
  useForeign = true;
  return new Foreign(handler, value);
};

export class Hole extends String {}

export const parse = (template, expectedLength, svg) => {
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
      let name = '';
      let quote = match[4];
      switch (quote) {
        case '"':
        case "'":
          const next = html.indexOf(quote, i);
          name = html.slice(i, next);
          i = next + 1;
          break;
        default:
          name = html.slice(--i).replace(rename, '$1');
          i += name.length;
          quote = '"';
          break;
      }
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
            (value => (
              pre
              + keys(value)
                .filter(key => value[key] != null)
                .map(data, value)
                .join('')
            )) :
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
        case name[0] === '@':
          name = 'on' + name.slice(1);
        case name[0] === 'o' && name[1] === 'n':
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
            if (value != null) {
              if (useForeign && value instanceof Foreign) {
                value = value._(null, name);
                if (value == null)
                  return result;
              }
              result += attribute(name, quote, value);
            }
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
