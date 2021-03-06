var results = [];
var casper = require('casper').create();
var fs = require('fs');

var url = 'http://store.steampowered.com/tag/en/Action/#os%5B%5D=mac&p=0&tab=NewReleases';
var allGames;
var terminate = function() {
    this.echo("Exiting..").exit();
};

function getGames() {
    var list = document.querySelectorAll('div.tab_item_name');
    var test = document.querySelectorAll('img.tab_item_cap_img');
    var images = [];
    for(var j = 0; j < test.length; j++) {
      var imageLink = test[j].getAttribute('src')
      var testCut = imageLink.indexOf("capsule")
      images.push(imageLink.slice(0, testCut) + "header.jpg");
    }

    var prices = document.getElementsByClassName('tab_item')
    var result = [];
    for(var i = 0; i < prices.length; i++) {
      var price = prices[i].querySelector('div.discount_final_price') || " ";;
      console.log(price)
      result.push(price);
    }
    var link = document.querySelectorAll('a.tab_item_overlay');
    var tags = document.querySelectorAll('div.tab_item_top_tags');
    var types = [];
    for(var x = 0; x < tags.length; x++) {
      var tag = tags[x].children;
      var tempType = "";
      for(var y = 0; y < tag.length; y++) {
        tempType += tag[y].innerHTML;
      }
      types.push(tempType);
      // if(tag[0] === ",") {
      //   tag.slice(2, tag.length)
      // }
    }

    var games = [];
    for(var k = 0; k < list.length; k++) {
      games.push({
        'title' : list[k].innerHTML,
        'image' : test[k].getAttribute('src'),
        'largeImage' : images[k],
        'price' : result[k].innerHTML,
        'link'  : link[k].getAttribute('href'),
        'type'  : types[k]
      });
    }
    return games;
}

var processPage = function() {
    allGames = this.evaluate(getGames);
    // require('utils').dump(JSON.stringify(games));
    require('utils').dump(allGames);

};
casper.start(url);
casper.waitForSelector('div.tab_item', processPage, terminate, 10000);
casper.then(function() {
  fs.write("public/assets/dataFile.json", JSON.stringify(allGames), 'w');
});
casper.run();

