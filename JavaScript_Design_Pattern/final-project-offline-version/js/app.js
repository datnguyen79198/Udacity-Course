var map;

var infoWindow = new google.maps.InfoWindow({
    content: ' <div> ' +
      '<h4 id = "restaurant-name" > </h4>' +
      '<p id = "restaurant-address" > </p>' +
      '<p id = "yelp" > </p>' +
      '</div>'
});

//MVVM
var ViewModel = function() {
    'use strict';

    var self = this;
    self.restaurantList = ko.observableArray([]);
    self.filterRestaurantList = ko.observableArray([]);

    // Create map zoom on Washington
    self.init = function() {
        var mapCanvas = document.getElementById('google-map');
        map = new google.maps.Map(mapCanvas, {
            center: {
                lat: 38.9071923,
                lng: -77.0368707
            },
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    };

    self.buildRestaurantLocation = function() {
        restaurantLocations.forEach(function(Index) {
            self.restaurantList.push(new Restaurant(Index));
        });
    };

    self.setClickFunction = function() {
        self.restaurantList().forEach(function(Index) {
            google.maps.event.addListener(Index.marker(), 'click', function() {
                self.restaurantClick(Index);
            });
        });
    };

    self.restaurantClick = function(Index) {
        var infoContent = '<div><h4 id="restaurant-name">' + Index.name() + '</h4>' +
            '<h5 id="restaurant-address">' + Index.address() + '</h5>' +
            '<p id="text">Rating on <a id="yelp-url">yelp</a>: ' +
            '<img id="yelp"></p></div>';
        infoWindow.setContent(infoContent);
        self.getYelpData(Index);

        // Make the clicked on restaurant the center of the map
        map.panTo(new google.maps.LatLng(Index.lat(), Index.lng()));

        //open info window at the marker location
        infoWindow.open(map, Index.marker());

        // setting animation when click
        self.setMarkerAnimation(Index);
    };

    self.setMarkerAnimation = function(Index) {
        Index.marker().setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            Index.marker().setAnimation(null);
        }, 750);
    };
    // filter restaurant
    self.filterRestaurant = function() {
        self.filterRestaurantList([]);

        var searchString = $('#search-str').val().toLowerCase();
        var le = self.restaurantList().length;

        for (var i = 0; i < le; i++) {
            var Name = self.restaurantList()[i].name().toLowerCase();

            if (Name.indexOf(searchString) > -1) {
                self.filterRestaurantList().push(self.restaurantList()[i]);
                self.restaurantList()[i].marker().setMap(map);
            } else {
                self.restaurantList()[i].marker().setMap(null);
            }
        }
    };

    self.getYelpData = function(Index) {
    //https://github.com/bettiolo/oauth-signature-js

    var httpMethod = 'GET';
    var yelpURL = 'http://api.yelp.com/v2/search/';

    // nonce generator
    // function credit of: https://blog.nraboy.com/2015/03/create-a-random-nonce-string-using-javascript/
    var nonce = function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    // Set required parameters for authentication & search
    var parameters = {
      oauth_consumer_key: 'S46AQ1iwQtvxw_D1wQLHZA',
      oauth_token: 'TO9rPx1abdPe3lllR5Wo3WFrvz8CV9vw',
      oauth_nonce: nonce(20),
      oauth_timestamp: Math.floor(Date.now() / 1000),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version: '1.0',
      callback: 'cb',
      term: Index.name(),
      location: 'Washington, DC',
      limit: 1
    };

    // Set other API parameters
    var consumerSecret = '8hqIHpplfRBLzs6YOqLZFfkx7jg';
    var tokenSecret = 'evb3bjTox8RNlfZ5Ma74hqJjZWo';

    // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
    var signature = oauthSignature.generate(httpMethod, yelpURL, parameters, consumerSecret, tokenSecret);

    // Add signature to list of parameters
    parameters.oauth_signature = signature;

    // Set up the ajax settings
    var ajaxSettings = {
      url: yelpURL,
      data: parameters,
      cache: true,
      dataType: 'jsonp',
      success: function(response) {
        $('#yelp').attr("src", response.businesses[0].rating_img_url);
        $('#yelp-url').attr("href", response.businesses[0].url);
      },
      error: function() {
        $('#text').html('Data could not be retrieved from yelp.');
      }
    };
    $.ajax(ajaxSettings);
  };

    google.maps.event.addDomListener(window, 'load', function() {
        self.init();
        self.buildRestaurantLocation();
        self.setClickFunction();
        self.filterRestaurantList(self.restaurantList());
    });
};

var Restaurant = function(Index) {
    'use strict';
    var marker;
    this.name = ko.observable(Index.name);
    this.lat = ko.observable(Index.lat);
    this.lng = ko.observable(Index.lng);
    this.address = ko.observable(Index.address);

    // google maps marker

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat(), this.lng()),
        map: map,
        title: this.name()
    });

    // Set the marker as a knockout observable
    this.marker = ko.observable(marker);

};

ko.applyBindings(new ViewModel());
