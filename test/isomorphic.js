const overrides = require('require-overrides');
overrides.set('uhtml', '../cjs');

const {render} = require('../cjs');

const Component = require('./component.js');

console.log(
  render(String, Component('World'))
);
