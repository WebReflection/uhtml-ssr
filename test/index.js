const {Hole, render, html, svg} = require('../cjs');

const assert = (result, expected) => {
  console.assert(result === expected, result);
  if (result !== expected)
    throw new Error('invalid outcome');
};

class Response extends Hole {
  constructor() {
    super('');
  }
  write(_) {
    this._ = _;
  }
}

function special() {}
special.toString = function () {
  return 'alert("special")';
};

try {
  render(String, html`<this fails="${1} ${2}" />`);
  throw new Error('this should not happen');
}
catch (OK) {}

assert(
  render(String, html`<!doctype html><html />`),
  `<!doctype html><html></html>`
);

assert(
  render(String, html`<this>is a html test</this>`),
  `<this>is a html test</this>`
);

assert(
  render(String, html`<this onclick=${() => {}} nope=${null}>is a html test</this>`),
  `<this>is a html test</this>`
);

assert(
  render(String, html`<this onclick=${{handleEvent(){}, onclick(){}}}>is a html test</this>`),
  `<this>is a html test</this>`
);

assert(
  render(String, html`<this onclick=${{handleEvent(){}, onclick: 'nope'}}>is a html test</this>`),
  `<this>is a html test</this>`
);

assert(
  render(String, html`<this onclick=${{handleEvent(){}, click(){}}}>is a html test</this>`),
  `<this>is a html test</this>`
);

assert(
  render(String, html`<this onclick=${{handleEvent(){}, onclick: special}}>is a html test</this>`),
  `<this onclick="alert(&quot;special&quot;)">is a html test</this>`
);

assert(
  render(String, html`<this onclick=${'alert(123)'}>is a html test</this>`),
  `<this onclick="alert(123)">is a html test</this>`
);

assert(
  render(String, html`<this .disabled=${true} .null=${null} .random=${12345}>is a html test</this>`),
  `<this disabled random="12345">is a html test</this>`
);

assert(
  render(String, html`<this ref=${NULL => console.assert(NULL === null)}>is a html test</this>`),
  `<this>is a html test</this>`
);

assert(
  render(String, html`<this>is a html ${['test', 123, html`test`, true, {toString: () => 'OK'}, null]}</this>`),
  `<this>is a html test123testtrueOK</this>`
);

assert(
  render(String, html`<this attribute=${'"'}>is a html test</this>`),
  `<this attribute="&quot;">is a html test</this>`
);

assert(
  render(String, html`<this .dataset=${{any: 'value'}}>is a html test</this>`),
  `<this data-any="value">is a html test</this>`
);

assert(
  render(String, html`<this aria=${{role: 'section', label: 'any'}}>is a html test</this>`),
  `<this role="section" aria-label="any">is a html test</this>`
);

assert(
  render(new Response, () => html`<this>is a ${'html'} test with a <button /></this>`).toString(),
  `<this>is a html test with a <button></button></this>`
);

assert(
  render(String, svg`<this>is a svg test</this>`),
  `<this>is a svg test</this>`
);

assert(
  render(new Response, () => svg`<this>is a ${'svg'} test with a <rect /></this>`).toString(),
  `<this>is a svg test with a <rect /></this>`
);
