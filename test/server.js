const http = require('http');

const {render, html} = require('../cjs/');

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
    // just await what needs to be awaited in place
    render(res, html`
          <footer>
            ${await new Promise($ => {
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
