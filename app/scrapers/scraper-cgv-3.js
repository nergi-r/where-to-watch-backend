module.exports = new Promise(function(resolve, reject) {
  // Slipi Jaya
  var url = 'https://www.cgv.id/en/schedule/cinema/2000';
  var list = [];
  var phRef;
  var phantom = require('phantom');

  function getDescription(page, url, id) {
    page.open(url).then(function(status) {
      page.injectJs('jquery.min.js')
      .then(function(err) {
        page.evaluate(function() { return $('.movie-synopsis').html(); })
        .then(function(data) {
          list[id].description = data;
          nextPage(page, id+1);
        })
      })
    })
  }

  function nextPage(page, id) {
    console.log("Movies scraped: " + id);
    if(id === list.length) {
      phRef.exit();
      resolve(list);
      return;
    }
    getDescription(page, list[id].url, id);
  }

  phantom.create().then(function(ph) {
    phRef = ph;
    ph.createPage().then(function(page) {

      page.open(url).then(function(status) {
        page.injectJs('jquery.min.js')
        .then(function(err) {
          page.evaluate(function() {
            var list = [];
            $('.schedule-title').each(function() {
              var element = $(this).find('a');
              var url = 'https://www.cgv.id' + element.attr('href');
              list.push({
                'title': element.html(),
                'url': url,
                'imgUrl': url.replace('/en/movies/detail', '/uploads/movie/compressed') + '.jpg'
              });
            });
            return list;
          }).then(function(data){
            list = data;
            nextPage(page, 0);
          });
        })
      });

    });
  });
});