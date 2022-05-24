const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'js', 'count.js'),
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: "count.min.js"
  }
}
