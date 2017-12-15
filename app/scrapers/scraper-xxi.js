module.exports = new Promise(function(resolve, reject) {
  var url = 'https://m.21cineplex.com/gui.list_movie.php?order=1&p=pl';
  var list = [];
  var phRef;
  var phantom = require('phantom');

  function getImageURL(page, url, id) {
    page.open(url).then(function(status) {
      page.injectJs('jquery.min.js')
      .then(function(err) {
        page.evaluate(function() {
          return $('.img_preview').attr('src');
        })
        .then(function(data) {
          list[id].imgUrl = data;
          getDescription(page, url, id);
        })
      })
    })
  }

  function getDescription(page, url, id) {
    url = url.replace('schedule', 'movie_details');
    page.open(url).then(function(status) {
      page.injectJs('jquery.min.js')
      .then(function(err) {
        page.evaluate(function() {
          return $('pre').html();
        })
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
    getImageURL(page, list[id].url, id);
  }

  phantom.create().then(function(ph) {
    phRef = ph;
    ph.createPage().then(function(page) {

      page.open(url).then(function(status) {
        page.injectJs('jquery.min.js')
        .then(function(err) {
          page.evaluate(function() {
            var data = [];
            $('#menu_ol_arrow li').filter(function() {
              return ($(this).html().indexOf('order=1') > -1) && ($(this).html().indexOf('3D') == -1);
            }).each(function() {
              var element = $(this).find('a');
              var url = element.attr('href');
              var object = {
                'title': element.html(),
                'url': 'https://m.21cineplex.com/' + url
              };
              data.push(object);
            });
            return data;
          }).then(function(data){
            list = data;
            nextPage(page, 0);
          });
        })
      });

    });
  });
});