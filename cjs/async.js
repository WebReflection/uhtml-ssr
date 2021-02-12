'use strict';
const asyncTag = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('async-tag'));

const {render: $render, html: $html, svg: $svg} = require('./index.js');

const tag = original => {
  const tag = asyncTag(original);
  tag.node = tag;
  tag.for = () => tag;
  return tag;
};

const html = tag($html);
exports.html = html;
const svg = tag($svg);
exports.svg = svg;

const render = (where, what) => {
  const hole = typeof what === 'function' ? what() : what;
  return Promise.resolve(hole).then(what => $render(where, what));
};
exports.render = render;

(m => {
  exports.Hole = m.Hole;
})(require('./utils.js'));
