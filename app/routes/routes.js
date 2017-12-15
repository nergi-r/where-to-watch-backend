module.exports = function(app){
  var controller = require('../controllers/controller');

  app.route('/api').get(function(req, res) {
    res.json({ message: 'API Initialized!'});
  });

  app.route('/api/movies').get(controller.get)

  app.route('/api/movies/refresh').get(controller.refresh);
}