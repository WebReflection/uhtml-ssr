const {Hole, render, html, svg} = require('../cjs/async.js');

render(String, () => html`<div>Hello <world /></div>`).then(console.log);
render(String, () => svg`<div>Hello <world /></div>`).then(console.log);
console.log(new Hole('hole').toString());
