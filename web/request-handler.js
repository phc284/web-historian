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
  console.log('req url in handleRequest', req.url)
  var headers = defaultCorsHeaders;
  var urlFinal = '';
  var style = '';
  var status;
  var inputUrl = '';


    res.writeHead(302, headers)
    //console.log('in post');
  if(req.method === 'GET') {
    if (req.url === '/') {
      console.log("in index");
      urlFinal = '/Volumes/THAWSPACE/hratx29-web-historian/web/public/index.html';
      headers['Content-Type'] = 'text/html';
      status = 200;
      fs.readFile(urlFinal, (err,data) => {
        // console.log('process: ', process.cwd());
        // console.log(err)
        res.writeHead(status, headers);
        res.end(data);
      });

    } else if (req.url === '/styles.css') {
      urlFinal = '/Volumes/THAWSPACE/hratx29-web-historian/web/public/styles.css';
      headers['Content-Type'] ='text/css';
      status = 302;
      fs.readFile(urlFinal, (err,data) => {
        // console.log('process: ', process.cwd());
        // console.log(err)
        res.writeHead(status, headers);
        res.end(data);
      })
    } else if (req.url === '/favicon.ico') {
        console.log("in favicon");
        res.end();
    }
  }
  if(req.method === 'POST') {
    console.log('not index or css');
    req.on('data', function(chunk) {
      inputUrl += chunk;
    //inputUrl = chunk.toString();
    })
    req.on('end', function() {
      console.log('********** ',inputUrl)
      inputUrl = inputUrl.slice(4);
      fs.readFile(inputUrl, (err,data) => {
        // console.log('process: ', process.cwd());
        // console.log(err)
        archive.isUrlInList(inputUrl, (bool) => {
          console.log('bool is ', bool)
          if (bool) {
            console.log("in list");
            archive.isUrlArchived(inputUrl, (bool) => {
            // console.log('is archive');
            if (bool) {
              //display
              urlFinal =  archive.paths.archivedSites + '/' + inputUrl;
              // console.log('url final ', urlFinal)
              headers['Content-Type'] = 'text/html';
              status = 302;
              fs.readFile(urlFinal, (err,data) => {
                // console.log('process: ', process.cwd());
                // console.log(err)
                res.writeHead(302, headers);
                res.end(data);
              })
            } else {
            //send loading
              urlFinal = '/Volumes/THAWSPACE/hratx29-web-historian/web/public/loading.html'
              headers['Content-Type'] = 'text/html';
              status = 200;
              fs.readFile(urlFinal, (err,data) => {
                // console.log('process: ', process.cwd());
                // console.log(err)
                res.writeHead(302, headers);
                res.end(data);
              })
            }
      })
    } else {
      // console.log("in else, not in list")
      // archive.addUrlToList(inputUrl, () => {
      //   console.log("hey");
      // });
      //send loading
      urlFinal = '/Volumes/THAWSPACE/hratx29-web-historian/web/public/loading.html'
      headers['Content-Type'] = 'text/html';
      status = 200;
      archive.addUrlToList(inputUrl, function() {
        fs.readFile(urlFinal, (err,data) => {
          // console.log('process: ', process.cwd());
          // console.log(err)
          res.writeHead(302, headers);
          res.end(data);
        })
      })
          }
        })
      })
    })
  }
// is on list
//   no: add to list || yes: is it archived
//    send loading   || no: send loading  || yes: display


// display urlFinal
// fs.readFile(urlFinal, (err,data) => {
//   console.log('process: ', process.cwd());
//   console.log(err)
//   res.writeHead(status, headers);
//   res.end(data);
// })
  if (req.method === 'GET') {
    // console.log('Get Received', req.body)
  }

};
