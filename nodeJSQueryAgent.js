// This program responds to a call from a browser-based client, accepting data
// to be used in a search of the Couchbase Server beer-sample bucket. The data 
// consists of a beer ID, which is used to retrieve a JSON document featuring 
// information on the brewery.

var http = require('http');
var url = require('url');

http.createServer(function (request, response) 
{
    console.log('New connection');
    
    var queryObject = url.parse(request.url, true).query
	
	var theQueryString = queryObject.myQuery;
	console.log("Query string is " + theQueryString);
    
    // Contact Couchbase and open the travel-sample bucket.
    //
    var couchbase = require("couchbase");
    var myCluster = new couchbase.Cluster('couchbase://localhost');
    var myBucket = myCluster.openBucket('travel-sample');

    myBucket.get(theQueryString, function(err, res)  
    {
    	myBucket.manager().createPrimaryIndex(function()
    	{
    		myBucket.query(
    			couchbase.N1qlQuery.fromString(theQueryString),
    			function (err, rows) 
    			{
    				console.log("Got rows: %j", rows);	
    				
    				response.writeHead(200, {"Content-Type": "application/json", 
    											"Access-Control-Allow-Origin": "*"});
    				console.log("Returning...");
    				response.end(JSON.stringify(rows));
    		});
    	});
	});		
									    
}).listen(8082);

// Notify that the server is running and listening.
//
console.log('Server started');