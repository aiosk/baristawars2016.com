'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var delay = function () {
    var timer = 0;
    return function (callback, ms) {
        var clear = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

        if (clear) {
            clearTimeout(timer);
        }
        timer = setTimeout(callback, ms);
    };
}();

var Template = function () {
    function Template() {
        _classCallCheck(this, Template);
    }

    _createClass(Template, null, [{
        key: 'flash',
        value: function flash(status, text) {
            var className = status ? 'parsley-success-list' : 'parsley-errors-list';
            return '<ul class="' + className + ' filled">\n    <li>' + text + '</li>\n</ul>';
        }
    }]);

    return Template;
}();

var TemplateForm = function () {
    function TemplateForm() {
        _classCallCheck(this, TemplateForm);
    }

    _createClass(TemplateForm, null, [{
        key: 'notOpen',
        value: function notOpen() {
            var date = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

            return '<p align="center">Open on <br/>' + date + '</p>';
        }
    }]);

    return TemplateForm;
}();

// init maps


var initAutocomplete = function initAutocomplete() {
    // var map = new google.maps.Map(document.getElementById('map'), {
    //     center: {lat: -6.187210, lng: 106.487706},
    //     zoom: 10,
    //     mapTypeId: 'roadmap'
    // });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('register_coffeeshop');
    var searchBox = new google.maps.places.SearchBox(input);

    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    // map.addListener('bounds_changed', function () {
    //     searchBox.setBounds(map.getBounds());
    // });

    // var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        // markers.forEach(function (marker) {
        //     marker.setMap(null);
        // });
        // markers = [];

        // For each place, get the icon, name and location.
        // var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            console.log(place);
            $('#register_coffeeshop_maps').val(JSON.stringify({
                name: place.name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            }));

            // markers.push(new google.maps.Marker({
            //     map: map,
            //     icon: icon,
            //     title: place.name,
            //     position: place.geometry.location
            // }));

            // if (place.geometry.viewport) {
            //     // Only geocodes have viewport.
            //     bounds.union(place.geometry.viewport);
            // } else {
            //     bounds.extend(place.geometry.location);
            // }
        });
        // map.fitBounds(bounds);
    });
};