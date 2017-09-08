var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.handleRequest = function (req, res) {
  //res.end(archive.paths.list);
  console.log('request url: ', req.url)
  var headers = defaultCorsHeaders;
  var url = '';
  var style = '';
  if (req.url === '/') {
    url = '/Volumes/THAWSPACE/hratx29-web-historian/web/public/index.html';
    headers['Content-Type'] = 'text/html';
  }
  if (req.url === '/styles.css') {
    url = '/Volumes/THAWSPACE/hratx29-web-historian/web/public/styles.css';
    headers['Content-Type'] ='text/css';
  }
  if (req.url === '/loading.html') {
    url = '/Volumes/THAWSPACE/hratx29-web-historian/web/public/loading.html'
    headers['Content-Type'] = 'text/html';
  }
  fs.readFile(url, (err,data) => {
    console.log(process.cwd());
    console.log(err)
    res.writeHead(200, headers);
    res.end(data);
  })
  if (req.method === 'GET') {
    console.log('Get Received', req.body)
  }

};
