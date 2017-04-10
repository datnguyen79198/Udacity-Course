
var Location = function(restaurant) {
    this.res = restaurant;
    this.address = restaurant.location.address1 + ', ' + restaurant.location.city + ', ' + restaurant.location.country;
    this.reviews = [];
};

var ViewModel = function() {
    var self = this;
    self.nowLocations = ko.observableArray([]);

    self.term = '';
    self.area = '';
    self.reviews = ko.observableArray([]);
    self.clickedId = ko.observable('');
    // import map
    var map = new google.maps.Map(document.getElementById('google-map'), {
          zoom: 2,
          center: new google.maps.LatLng(21.0350394, 105.7871198)
    });

    var markers = [];
    var nowMarkers = [];
    var bound;

    var createMarker = function(location) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(location.coordinates.latitude, location.coordinates.longitude),
            map: map,
            title: location.name
        });

        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            Index.marker().setAnimation(null);
        }, 750);

        return marker;
    };

    self.searchLocation = function() {
        var data = {
            term: this.term,
            location: this.area,
            limit: 10
        };
        //refresh all
        nowMarkers.forEach(function(index) {
            index.setMap(null);
        });
        nowMarkers.length = 0;
        self.nowLocations.removeAll();
        this.reviews([]);
        this.clickedId('');
        // get infomation about place you need
        bound = new google.maps.LatLngBounds();
        $.getJSON('http://localhost:3000/', data, function(data) {
            var index = -1;
            data.businesses.forEach(function(place) {
                index++;
                self.nowLocations.push(new Location(place));
                // set bound
                bound.extend(new google.maps.LatLng(place.coordinates.latitude, place.coordinates.longitude));
                nowMarkers.push(createMarker(place));
              //  console.log(place);
                var query = {
                    id: place.id
                };
                // get reviews of location you need
                $.getJSON('http://localhost:3000/', query, function(id) {
                    return function(res) {
                        self.nowLocations()[id].reviews = res.reviews;
                    };
                }(index));
            });
            map.fitBounds(bound);
        });
    };

    self.clickLocation = function(data, event) {
        nowMarkers.forEach(function(index) {
            index.setMap(null);
        });
        nowMarkers.length = 0;
        nowMarkers.push(createMarker(data.res));
        self.clickedId(data.res.id);
        var lat = data.res.coordinates.latitude;
        var lng = data.res.coordinates.longitude;
        map.setCenter({
            lat: lat,
            lng: lng
        });
        map.setZoom(20);
        self.reviews(data.reviews);
    };

    self.getRatingImg = function(rating) {
        var res = 'img/5_Star_Rating_System_' + Math.round(rating - 0.5);
        if (Math.round(rating) != rating)
            res += '_and_a_half';
        res += '_stars.png';
        return res;
    };

};

ko.applyBindings(new ViewModel());
