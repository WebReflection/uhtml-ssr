import umap from 'umap';
import {Hole, foreign, parse} from './utils.js';

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

export {Hole, foreign};

export const html = uhtmlParity(false);
export const svg = uhtmlParity(true);

export const render = (where, what) => {
  const content = (typeof what === 'function' ? what() : what).toString();
  return typeof where === 'function' ?
          where(content) :
          (where.write(content), where);
};

function update(value, i) {
  return this[i](value);
}
