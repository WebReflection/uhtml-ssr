import asyncTag from 'async-tag';

import {render as $render, html as $html, svg as $svg} from './index.js';

const tag = original => {
  const tag = asyncTag(original);
  tag.node = tag;
  tag.for = () => tag;
  return tag;
};

export const html = tag($html);
export const svg = tag($svg);

export const render = (where, what) => {
  const hole = typeof what === 'function' ? what() : what;
  return Promise.resolve(hole).then(what => $render(where, what));
};

export {Hole} from './utils.js';
