var express = require("express");
var pos = require('pos');
var request = require('request');

var app = express();
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());

var home = function(req, res) {
    //request({url:"https://archive.org/stream/houseofmirth00284gut/284.txt"}, 
    request({url:"http://paulyhart.blogspot.com/2011/10/hitchhikers-guide-to-galaxy-text_28.html"},
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var result = tagData(body);
          
          NN = Object.keys(result["NN"]);
          noun = NN[randomIndex(NN.length)];
          
          VBP = Object.keys(result["VBP"]);
          verb = VBP[randomIndex(VBP.length)];
          
          JJ = Object.keys(result["JJ"]);
          adj = JJ[randomIndex(JJ.length)];

          verb2 = VBP[randomIndex(VBP.length)];
    
          noun2 = NN[randomIndex(NN.length)];
          
          res.render('index.ejs', {noun:noun, verb:verb, verb2:verb2, noun2:noun2, adj:adj});
          
          NNP = result["NNP"];
        }
    });
}

var randomIndex = function(range) {
    return Math.floor(Math.random()*range)

}

var tagData = function(data) {
	var words = new pos.Lexer().lex(data);
	var taggedWords = new pos.Tagger().tag(words);
	var result = {};
	for (i in taggedWords) {
		var taggedWord = taggedWords[i];
		var word = taggedWord[0];
		var tag = taggedWord[1];
		if (tag in result) {
		    var patt = /^[a-z]{3,}/;
		    var word = patt.exec(word);
		    if (word != null && !(result[tag][word[0]])) {
		        result[tag][word[0]] = true;
		    }
		} else {
		    result[tag] = {word: true};
		}
	}   
    return result;
}

/*var home2 = function(req, res) {
    res.render('index.ejs', {user_input:req.body.box1});
}

var first = function(req, res) {
    res.send("Hi" + req.params.first);
}*/

app.get("/", home);
/*app.get("/:first", first);
app.post("/", home2);*/

app.listen(80);
