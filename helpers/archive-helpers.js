var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var scrape = require('website-scraper');
var http = require('http');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function (err, data) {
    if(err) {
      console.log(err)
    }
    // console.log('data', data.toString().split('\n'))
    // console.log('type of data is: ', typeof data)
    var dataArray = data.toString().split('\n');
    callback(dataArray);
  })

};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, function (err, data) {
    if (err) {
      console.log(err);
    }
    if (data.indexOf(url) >= 0){
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.addUrlToList = function(url, callback) {
  console.log('Add url ****' + url);
  fs.appendFile(exports.paths.list, url + '\n', (err) => {
    callback()
  })
};

exports.isUrlArchived = function(url, callback) {
  if(fs.existsSync(exports.paths.archivedSites + '/'+ url)) {
    callback(true)
  } else {
    callback(false);
  }
};

exports.downloadUrls = function(urls) {
  var path = exports.paths.archivedSites + '/';


  urls.forEach(function(url) {
    var rawData ='';
    var file = fs.createWriteStream(path + url);
    var temp = 'http://' + url;
    var request = http.get(temp, function(res) {
      var webpage = '';
      res.on('data', function(data) {
        webpage = data.toString();
      })
      res.on('end', () => {
        fs.appendFile(path + url, webpage);
      })
    });
  })

  // var download = function(url, dest, cb) {
  // var file = fs.createWriteStream(dest);
  // var request = http.get(url, function(response) {
  //   response.pipe(file);
  //   file.on('finish', function() {
  //     file.close(cb);
  //   });
  // });
// }
};
