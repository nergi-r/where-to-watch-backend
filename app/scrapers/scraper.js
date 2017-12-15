module.exports = new Promise(function(resolve, reject) {
  var completedRequests = 0;
  var movieList = [];

  function isSimilar(str1, str2) {
    // Longest Common Subsequence
    // var dp = new Array(str1.length+1);
    // for(var i = 0; i <= str1.length; i++) {
    //   dp[i] = new Array(str2.length+1);
    //   for(var j = 0; j <= str2.length; j++) {
    //     dp[i][j] = 0;
    //   }
    // }

    // for(var i = 1; i <= str1.length; i++) {
    //   for(var j = 1; j <= str2.length; j++) {
    //     dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    //     if(str1[i-1] === str2[j-1]) dp[i][j] = Math.max(dp[i][j], dp[i-1][j-1] + 1);
    //   }
    // }

    // var lcs = dp[str1.length][str2.length];
    // var maxDiff = 3;
    // if(lcs + maxDiff >= str1.length && lcs + maxDiff >= str2.length) return true;
    var cleanedStr1 = str1.replace(/[^a-zA-Z0-9]/g, '');
    var cleanedStr2 = str2.replace(/[^a-zA-Z0-9]/g, '');
    return cleanedStr1 === cleanedStr2;
  }

  function clean(str) {
    // STAR WARS: THE LAST JEDI - ADVANCE TICKET SALES
    var idx = str.indexOf(' - ADVANCE TICKET SALES');
    if(idx !== -1) str = str.substring(0, idx);
    // DADDY\'S HOME 2
    str = str.replace('\\', '');
    return str;
  }

  function mergeAndSort(list) {
    var mergedList = [];
    for(var i = 0; i < list.length; i++) {
      for(var j = 0; j < list[i].length; j++) {
        var cleanedTitle = clean(list[i][j].title);
        var indexSeen = -1;
        for(var k = 0; k < mergedList.length; k++) {
          if(isSimilar(mergedList[k].title, cleanedTitle)) {
            indexSeen = k;
            break;
          }
        }
        var xxi = null, cgv = null;
        if(i === 0) xxi = list[i][j].url;
        else cgv = list[i][j].url;

        if(list[i][j].description !== null)
          list[i][j].description = list[i][j].description.replace('<p>', '');
        
        if(indexSeen !== -1) {
          if(mergedList[indexSeen].imgUrl === null)
            mergedList[indexSeen].imgUrl = list[i][j].imgUrl;
          if(mergedList[indexSeen].description === null)
            mergedList[indexSeen].description = list[i][j].description;

          if(xxi !== null) mergedList[indexSeen].xxi = xxi;
          if(cgv !== null) mergedList[indexSeen].cgv = cgv;
        }
        else {
          mergedList.push({
            title: cleanedTitle,
            imgUrl: list[i][j].imgUrl,
            description: list[i][j].description,
            xxi: xxi,
            cgv: cgv
          });
        }
      }
    }
    console.log("Scrap completed.");
    resolve(mergedList);
  }

  console.log("Start scraping xxi");
  var xxiScraper = require('./scraper-xxi');
  xxiScraper.then(function(list) {
    movieList.push(list);
    console.log("Finished scraping xxi");

    console.log("Start scraping cgv-1");
    var cgvScraper = require('./scraper-cgv-1');
    cgvScraper.then(function(list) {
      console.log("Finished scraping cgv-1");
      movieList.push(list);
      
      console.log("Start scraping cgv-2");
      var cgvScraper = require('./scraper-cgv-2');
      cgvScraper.then(function(list) {
        console.log("Finished scraping cgv-2");
        movieList.push(list);
        
        console.log("Start scraping cgv-3");
        var cgvScraper = require('./scraper-cgv-3');
        cgvScraper.then(function(list) {
          console.log("Finished scraping cgv-3");
          movieList.push(list);
          mergeAndSort(movieList);
        });
      });
    });
  });


});