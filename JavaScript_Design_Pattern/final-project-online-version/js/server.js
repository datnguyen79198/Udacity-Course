var http = require("http");
var request = require('superagent');
var url = require('url');
var hostname = 'localhost';
var port = 3000;

var server = http.createServer(function (req, res) {

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(query);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (query.id) {
        request
            .get('https://api.yelp.com/v3/businesses/' + query.id + '/reviews')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', 'Bearer kKlu_JbbYWMT0q0HqU7LLWHeTeqAHOT5s2wHIoQL7eUWeEdJ8lND51V5wr2CEdorO9IHN7tdQQPGfYi8OIR1Lfu2VflE4cAk7oEhNUWOY2OMzzo9KHBVkkk5jEbqWHYx')
            .end(function (err, result) {
                if (err) res.end();
                else res = res.end(JSON.stringify(result.body));
            });
    }
    else {
        request
            .get('https://api.yelp.com/v3/businesses/search')
            .query(query)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', 'Bearer kKlu_JbbYWMT0q0HqU7LLWHeTeqAHOT5s2wHIoQL7eUWeEdJ8lND51V5wr2CEdorO9IHN7tdQQPGfYi8OIR1Lfu2VflE4cAk7oEhNUWOY2OMzzo9KHBVkkk5jEbqWHYx')
            .end(function (err, result) {
                if (err) res.end();
                else res = res.end(JSON.stringify(result.body));

            });
    }
})

server.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}/`);
});
