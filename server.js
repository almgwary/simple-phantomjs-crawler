var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
const phantom = require('phantom');


var app     = express();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/scrape', function(req, res){


  console.log('req',req.body)
  url = req.body.url ; 

  console.log('Starting');


   (async function() {
    const instance = await phantom.create();
    const page = await instance.createPage();
   
   page.on("onResourceRequested", function(requestData,networkRequest ) {
        console.info('Requesting', requestData.url, networkRequest)
        
    });

    const status = await page.open(url);
    console.log(status);

    const content = await page.property('content');
      
      // console.log(content);
      var $ = cheerio.load(content);

      var title, price, image;
      var json = { title : "", price : "", rating : "", image:"", url:url};

      $('#productTitle').filter(function(){
        var data = $(this);
        title = data.text().trim();
        json.title = title;
      })

      $('#priceblock_ourprice').filter(function(){
        var data = $(this);
        price = data.text().trim();
        json.price = price;
      })


      $('#imgTagWrapperId > img').filter(function(){
        var data = $(this);
        image = data.attr('src');
        json.image = image;
      })
      res.send(json)

    await instance.exit();
   }());

 
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
