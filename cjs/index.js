'use strict';
const umap = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('umap'));
const {Hole, parse} = require('./utils.js');

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

exports.Hole = Hole;

const html = uhtmlParity(false);
exports.html = html;
const svg = uhtmlParity(true);
exports.svg = svg;

const render = (where, what) => {
  const content = (typeof what === 'function' ? what() : what).toString();
  return typeof where === 'function' ?
          where(content) :
          (where.write(content), where);
};
exports.render = render;

function update(value, i) {
  return this[i](value);
}
