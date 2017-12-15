var mongoose = require('mongoose');

module.exports = function(){
  var db = mongoose.connect(process.env.MONGOLAB_URI);

  require('./app/models/movies');

  return db;
}