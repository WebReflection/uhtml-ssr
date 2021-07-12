import { createPragma } from 'jsx2tag';
import { html } from './index.js';

const createElement = createPragma(html);
globalThis.React = {
  createElement,
  Fragment: createElement
};

export * from 'jsx2tag';
export * from './index.js';
