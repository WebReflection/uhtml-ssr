const http = require('http');

const {render, html} = require('../cjs/');
const {render: asyncRender, html: asyncHTML} = require('../cjs/async.js');

http
  .createServer(async (_, res) => {
    res.writeHead(200, {'content-type': 'text/html;charset=utf-8'});
    render(res, html`
      <!doctype html>
      <html>
        <head>
          <title>${'sync title'}</title>
        </head>
        <body>
          ${'sync content'}
    `);
    await asyncRender(res, asyncHTML`
          <footer>
            ${new Promise($ => {
              setTimeout($, 500, 'async footer');
            })}
          </footer>
        </body>
      </html>
    `);
    res.end();
  })
  .listen(8080);

console.log('http://localhost:8080/');
