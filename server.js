//The code begins
var express = require('express');
var path = require('path');
var app = express();
var Mongoclient = require('mongodb').MongoClient;

var appUrl = "https://urlshortner-nahil.glitch.me/";

Mongoclient.connect("mongodb://nahilahmed:nahil757@ds251988.mlab.com:51988/urlshort",function(err,db){
console.log("created database");
var dbo = db.db("urlshort");
dbo.createCollection("shorturl",function(err,res){
   console.log("collection created");
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/new/:longurl(*)',function(req,res){
  var longUrl = req.params.longurl;
  var uniqueid = new Date().getTime();
  uniqueid = uniqueid.toString().slice(0,-2);
  var shorturl = appUrl + uniqueid;

  dbo.collection("shorturl").insert({
     "longurl":longUrl,
     "shorturl":shorturl,
     "id":uniqueid
  },function(err,data){
    if(err)console.log("error in entering database");
    //console.log(data);
    var l = data.ops[0].longurl;
    var s = data.ops[0].shorturl;
    var obj = {"longurl":l,"shorturl":s};
    res.send(obj);
  })

})

app.get('/:uniqueid',function(req,res){
   var uniqueid = req.params.uniqueid;
   dbo.collection("shorturl").find({
      "id":uniqueid
   }).toArray(function(err,data){
     var finalurl= data[0].longurl;
     console.log(finalurl);
     if(finalurl.indexOf("http")==-1){finalurl = "http://"+finalurl;}
     res.redirect(finalurl);
   })
})

})//database connection


app.listen(3000,console.log('app running on port 3000'));
