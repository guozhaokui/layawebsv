﻿
function log(m){
	console.log(m);
}

var express = require('express');
var ejs = require('ejs');
var http = require('http');
var https = require('https');
var app = express();
var path = require('path');
var fs = require('fs');

var mainPath = '../Trunk';

if(process.argv && process.argv[3] )
	mainPath = process.argv[3];

//分析post数据用的。
var querystring = require('querystring');

app.use(function(req,res,next){
	var tm = new Date();
	log(""+tm.getMinutes()+":"+tm.getSeconds()+"."+tm.getMilliseconds()+"  "+req.method+' '+req.url);
    /*
	{
		var u = req.url;
		u = require('url').parse(u).pathname;
		log(u);
	}
    */
	next();
});

var bodyParser = require('body-parser');
app.use(express.compress());
app.use(bodyParser.urlencoded({ extended: false }));

var staticPath = path.isAbsolute(mainPath)?mainPath:path.resolve(process.cwd(), mainPath);
app.use('/',express.static(staticPath));
app.use('/payapp',function(req,res,next){
	log("mytext="+req.body.myText);
	var postdata='';
	req.addListener('data',function(chunk){postdata+=chunk;});
	req.addListener('end',function(){
		log(postdata);
		postdata = querystring.parse(postdata);
		log(JSON.stringify(postdata));
		//log("mytext="+postdata.myText);
		log("mytex="+req.body.myText);
	});

    res.writeHead(200, {"Content-Type": "text/html"});  
    res.write("{\"verify-result\":0,\"receipt-info\":\"" + 10 + "\"}");  
    res.end();  	
});

app.use(function(req,res,next){	//如果不存在
    res.status(404).send('找不到这个文件啊：<br>'+req.url);  
	log('错误：没有这个文件 '+req.url);
});

var port = 8889;
if( process.argv && process.argv[2])
	port = process.argv[2];
log('listen on: '+port);

if(port==443){
    var options = {
      key: fs.readFileSync(__dirname+'/key.pem'),
      cert: fs.readFileSync(__dirname+'/cert.pem')
    };    
    https.createServer(options, app).listen(443);    
}else{
    app.listen( port);
}

