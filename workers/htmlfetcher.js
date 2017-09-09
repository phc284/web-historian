// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var helper = require('../helpers/archive-helpers')

helper.readListOfUrls(helper.downloadUrls)
