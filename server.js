const http = require('http');
const static = require('node-static');
const port = process.env.PORT || 3000;

const file = new static.Server('./public/', {
    cache: 0,
    indexFile: "index.html"
});

http.createServer(function (req, res) {
    file.serve(req, res);
}).listen(port);

console.log(`server listening on http://localhost:${port}, Ctrl+C to stop`);