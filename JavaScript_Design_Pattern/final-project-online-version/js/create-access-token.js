'use strict';

const yelp = require('yelp-fusion');

// Place holders for Yelp Fusion's OAuth 2.0 credentials. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const clientId = '1kmOnXbIZ7Hb71XDRbzShg';
const clientSecret = 'uM5YelKQ5vLHPEnkGEey5o7cTb6322VpnkJuJ0YCxfA6yWJcqx7twqCrITDqZJQ6';

const searchRequest = {
  term:'restaurant',
  location: 'san francisco, ca'
};

yelp.accessToken(clientId, clientSecret).then(response => {
  const client = yelp.client(response.jsonBody.access_token);
  console.log(response.jsonBody.access_token);
  client.search(searchRequest).then(response => {
    const firstResult = response.jsonBody.businesses[0];
    const prettyJson = JSON.stringify(firstResult, null, 4);
    console.log(prettyJson);
  });
}).catch(e => {
  console.log(e);
});
