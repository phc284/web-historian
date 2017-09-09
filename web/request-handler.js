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
  var urlFinal = '';
  var style = '';
  var status;
  if (req.url === '/') {
    urlFinal = '/Volumes/THAWSPACE/hratx29-web-historian/web/public/index.html';
    headers['Content-Type'] = 'text/html';
    status = 302;
  }else if (req.url === '/styles.css') {
    urlFinal = '/Volumes/THAWSPACE/hratx29-web-historian/web/public/styles.css';
    headers['Content-Type'] ='text/css';
    status = 302;
  } else {
    archive.isUrlInList(req.url, (bool) => {
      if (bool) {
        console.log("in list");
        archive.isUrlArchived(req.url, (bool) => {
          console.log('is archive');
          if (bool) {
            //display
            urlFinal =  archive.paths.archivedSites + '/' + req.url;
            console.log('url final ', urlFinal)
            headers['Content-Type'] = 'text/html';
            status = 302;
          } else {
            //send loading
            urlFinal = '/Volumes/THAWSPACE/hratx29-web-historian/web/public/loading.html'
            headers['Content-Type'] = 'text/html';
            status = 200;
          }
        })
      } else {
        console.log("in else, not in list")
        archive.addUrlToList(req.url, () => {
          console.log("hey");
        });
        //send loading
          urlFinal = '/Volumes/THAWSPACE/hratx29-web-historian/web/public/loading.html'
          headers['Content-Type'] = 'text/html';
          status = 200;
      }
    })
  }

// is on list
//   no: add to list || yes: is it archived
//    send loading   || no: send loading  || yes: display


// display urlFinal
  fs.readFile(urlFinal, (err,data) => {
    console.log(process.cwd());
    console.log(err)
    res.writeHead(status, headers);
    res.end(data);
  })
  if (req.method === 'GET') {
    console.log('Get Received', req.body)
  }

};
