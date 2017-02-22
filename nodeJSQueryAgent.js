// This program responds to a call from a browser-based client, accepting data
// to be used in a search of the Couchbase Server beer-sample bucket. The data 
// consists of a beer ID, which is used to retrieve a JSON document featuring 
// information on the brewery.

var http = require('http');
var url = require('url');

http.createServer(function (request, response) 
{
    console.log('New connection');
    
    // Get the country-value, which has been passed by
    // the client.
    //
    var queryObject = url.parse(request.url, true).query
    var countryValueString = queryObject.myCountryValue;
    console.log("Country value is " + countryValueString);
    
    // Contact Couchbase and open the travel-sample bucket.
    //
    var couchbase = require("couchbase");
    var myCluster = new couchbase.Cluster('couchbase://localhost');
    var myBucket = myCluster.openBucket('travel-sample');

    // Set up a parameterised N1QL query, whereby a placeholder is specified for the value
    // of "country". This is the value that has been provided by the client.
    //
    var queryTemplate = couchbase.N1qlQuery.fromString('SELECT * FROM `travel-sample` WHERE country=$1');
    
    // Make the N1QL query, specifying the value provided by the client.
    //
    myBucket.query(queryTemplate, [countryValueString], 
        function (err, rows) 
        {
            console.log("Got rows: %j", rows);	
    				
            response.writeHead(200, {"Content-Type": "application/json", 
                        "Access-Control-Allow-Origin": "*"});
            console.log("Returning...");
            response.end(JSON.stringify(rows));
    });							    
}).listen(8082);

// Notify that the server is running and listening.
//
console.log('Server started');
