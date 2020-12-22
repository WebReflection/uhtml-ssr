# <em>µ</em>html-ssr

[![Build Status](https://travis-ci.com/WebReflection/uhtml-ssr.svg?branch=main)](https://travis-ci.com/WebReflection/uhtml-ssr) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/uhtml-ssr/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/uhtml-ssr?branch=main)

<sup>**Social Media Photo by [Nathan Dumlao](https://unsplash.com/@nate_dumlao) on [Unsplash](https://unsplash.com/)**</sup>

**[µhtml](https://github.com/WebReflection/uhtml#readme)** for Service Worker, Web Worker, NodeJS, and other *SSR* cases, based on [µcontent](https://github.com/WebReflection/ucontent#readme) logic, but without 3rd party tools (no minification, etc.).

This module can be used as drop-in replacement for *µhtml* components, but rendered *SSR*, or where there is no *DOM*.

```js
import {render, html, svg} from 'uhtml-ssr';

// render accepts a callback instead of a DOM node
// or a response object with a `res.write(content)` method.
render(String, html`<h1>Hello µhtml-ssr 👋</h1>`);
//  "<h1>Hello µhtml-ssr 👋</h1>"
```

Exports have feature parity with *µhtml*, and pretty much everything else works the same, except:

  * inline *DOM* events are not rendered, these are simply removed
  * `ref=${...}` attributes receives `null` as there's no `node` or `element` to pass around


## Isomorphic <em>µ</em>html Components

If you are using *CommonJS* you *could* use [require-overrides](https://github.com/WebReflection/require-overrides/#readme) module to fake `uhtml` as `uhtml-ssr`.

```js
// component.js
const {html} = require('uhtml');
module.exports = (name) => {
  return html`Hello ${name}`;
};

// index.js
const overrides = require('require-overrides');
overrides.set('uhtml', 'uhtml-ssr');

const {render} = require('uhtml-ssr');

const Component = require('./component.js');

console.log(render(String, Component('World')));
// "Hello World"
```
