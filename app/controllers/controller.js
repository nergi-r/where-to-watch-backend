var Movie = require('mongoose').model('Movie');

exports.get = function(req, res) {
  Movie.find({}, null, {sort: {title: 1}}, function(err, movies) {
    if(err) res.send(err);
    res.json(movies);
  });
};

exports.post = function(req, res) {
  Movie.create(req.body.movies, function(err) {
    if(err) res.send(err);
    res.json({ message: 'Movie successfully added!' });
  });
};

exports.refresh = function(req, res) {
  Movie.deleteMany({}, function(err) {
    var scraper = require('./../scrapers/scraper');
    scraper.then(function(data) {    
      Movie.create(data, function(err) {
        if(err) res.send(err);
        res.json({ message: 'Movie successfully added!' });
      });
    });
  });
}