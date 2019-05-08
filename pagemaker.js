var http = require('http');
var querystring = require('querystring');
var util = require('util');
var jade = require('jade');
var fs = require('fs');


var server = http.createServer(function (req, res) {

	// switch between url routes
	switch(req.url) {

	    case '/':

		    // show the user a simple form
			//console.log("[200] " + req.method + " to " + req.url);

			res.writeHead(200, "OK", {'Content-Type': 'text/html'});
			var html = jade.renderFile('./index.jade');
			res.write(html);
			res.end();
			break;

	    case '/formhandler':
	    	if (req.method == 'POST') {
			    //console.log("[200] " + req.method + " to " + req.url);
			    var fullBody = '';
			    
			    req.on('data', function(chunk) {
			    	// append the current chunk of data to the fullBody variable
			    	fullBody += chunk.toString();
			    });
			    
			    req.on('end', function() {
			    
			    	// request ended -> do something with the data
			    	res.writeHead(200, "OK", {'Content-Type': 'text/html'});
			      
			    	// parse the received body data
			    	var decodedBody = querystring.parse(fullBody);
			    	decodedBody.self = true;

			    	decodedBody.content = decodedBody.content.replace(/\r\n/g, '<br />');
			    	//decodedBody.content = decodedBody.content.replace('\r\n', '<br />');

			    	var html = jade.renderFile('template/index.jade', decodedBody);

			    	//console.log(decodedBody.title);
			    	//console.log(decodedBody.content);

			    	// output the decoded data to the HTTP response          
			    	res.write(html);
			      
			     	res.end();
			    });
	    
	  		} else {
	    		//console.log("[405] " + req.method + " to " + req.url);
	    		res.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
	    		res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
	  		}
		  
			break;

	    default:

	    	if(req.url.indexOf('.css') != -1) {
	    		var style = fs.readFile('.' + req.url, (err, data) => {
				if (err) { console.error(err); return; }
					res.writeHead(200, "OK", {'Content-Type': 'text/css'});
					res.write(data.toString());
					res.end();
				});
				break;
	    	}

	    	if(req.url.indexOf('.jpg') != -1) {
	    		var style = fs.readFile('.' + req.url, (err, data) => {
				if (err) { console.error(err); return; }
					res.writeHead(200, "OK", {'Content-Type': 'image/jpg'});
					res.write(data, 'binary');
					res.end();
				});
				break;
	    	}

	    	res.writeHead(404, "Not found", {'Content-Type': 'text/html'});
	    	res.end('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
	    	console.log("[404] " + req.method + " to " + req.url.slice(1));

	};
});
server.listen(742); // listen on tcp port 8080 (all interfaces)

console.log('Server is running ...');