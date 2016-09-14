'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isProd = window.location.hostname !== '192.168.2.50' && window.location.hostname !== 'localhost';
// const isProd = true;

var urlBase = 'localhost:8080';
if (isProd) {
    urlBase = 'api.baristawars2016.com/public';
}
urlBase = 'http://' + urlBase;

var FormTemplate = function () {
    function FormTemplate() {
        _classCallCheck(this, FormTemplate);
    }

    _createClass(FormTemplate, null, [{
        key: 'notOpen',
        value: function notOpen() {
            return '<p>registration will be open on ...</p>';
        }
    }, {
        key: 'open',
        value: function open() {
            return '<form method="POST" action="/registration" id="form_registration" enctype="multipart/form-data"> \n    <div class="form__row">\n      <div class="form__label form--required">\n        <label for="register_name">name</label>\n      </div>\n      <div class="form__field">\n        <input type="text" name="name" id="register_name" required>\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label form--required">\n        <label for="register_email">email</label>\n      </div>\n      <div class="form__field">\n        <input type="email" name="email" id="register_email" required>\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label form--required">\n        <label for="register_dob">dob</label>\n      </div>\n      <div class="form__field">\n        <input type="text" name="dob" id="register_dob" required>\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label form--required">\n        <label>picture</label>\n      </div>\n      <div class="form__field">\n        <label class="form__upload" for="register_picture"><span>upload</span>\n          <input type="file" name="picture" id="register_picture" accept="image/*" required>\n        </label>\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label">\n        <label for="register_address">address</label>\n      </div>\n      <div class="form__field">\n        <textarea name="address" id="register_address"></textarea>\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label">\n        <label for="register_coffeeshop">coffeeshop</label>\n      </div>\n      <div class="form__field">\n        <div id="map"></div>\n        <input type="text" name="coffeeshop" id="register_coffeeshop">\n        <input type="hidden" name="coffeeshop_location" id="register_coffeeshop_location">\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__button">\n        <button type="submit">submit</button>\n      </div>\n    </div>\n</form>';
        }
    }]);

    return FormTemplate;
}();

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

// init maps
var initAutocomplete = function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -6.187210, lng: 106.487706 },
        zoom: 10,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('register_coffeeshop');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
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
            $('#register_coffeeshop_location').val(JSON.stringify({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            }));
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
};

$(function () {
    var afterLoad = function afterLoad(anchorLink, index) {
        switch (index) {
            case 6:
                getRegForm();
                break;
        }
    };

    var getRegForm = function getRegForm() {
        var isTime = false;
        var element = $('#section6 .fp-tableCell');
        var html = void 0;

        var complete = function complete() {
            if (!isTime) {
                return false;
            }
            if (element.find('form').length !== 0) {
                return false;
            }

            element.append(html);

            $("#register_dob").datepicker({
                changeMonth: true,
                changeYear: true,
                minDate: '-80y',
                maxDate: '-5y',
                yearRange: "-100:-5",
                dateFormat: 'yy-mm-dd',
                onClose: function onClose(dateText, inst) {
                    var $this = inst.input;
                    console.log($this);
                    $this.trigger('leave');
                }
            });

            $('#register_picture').on('change', function (e) {
                var $this = $(e.target);
                var $parent = $this.closest('.form__field');
                var input = $this[0];

                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        var $img = $parent.find('img.form__upload-image');
                        if ($img.length === 0) {
                            $parent.prepend('<img class="form__upload-image"/>');
                            $img = $parent.find('img');
                        }
                        $img.attr('src', e.target.result);
                        $.fn.fullpage.reBuild();
                    };

                    reader.readAsDataURL(input.files[0]);
                }
            });

            $('body').append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBjhGHb81MIdRsBEJhhSSUe78JLGIRhHJA&libraries=places&callback=initAutocomplete"></script>');
            $.fn.fullpage.reBuild();

            // $('#register_coffeeshop').on('keyup', (e)=> {
            //     const $this = $(e.target);
            //     const f = ()=> {
            //         console.log($this.val());
            //     };
            //     delay(f, 400, true)
            // });

            $("#form_registration").on('submit', function (e) {
                e.preventDefault();
                var $this = $(e.target);

                // $this.parsley().validate();
                //
                // if (!$this.parsley().isValid()) {
                //     return false
                // }
                var formData = new FormData($this[0]);

                $.ajax({
                    url: '' + urlBase + $this.attr('action'),
                    type: $this.attr('method'),
                    data: formData,
                    //async: false,
                    success: function success(data) {
                        if (data.status === false) {
                            alert(data.message);
                        }
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });

                return false;
            });

            element.removeClass('spinner');
        };

        $.ajax({
            url: urlBase + '/helper/time',
            beforeSend: function beforeSend() {
                element.addClass('spinner');
            },
            success: function success(data) {
                data = JSON.parse(data);

                isTime = data.registrationOpen;
                if (isTime) {
                    html = FormTemplate.open();
                } else {
                    html = FormTemplate.notOpen();
                }
            },

            complete: complete
        });
    };

    $('#fullpage').fullpage({
        anchors: ['sponsor', 'challengers', 'rules', 'schedule', 'venue', 'registration'],
        menu: 'nav.menu ul',
        scrollOverflow: true,
        // scrollOverflowOptions: {
        //     click: true
        // },
        afterLoad: afterLoad
    });
});