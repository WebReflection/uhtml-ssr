const {html} = require('uhtml');

module.exports = (name) => {
  return html`Hello ${name}`;
};
