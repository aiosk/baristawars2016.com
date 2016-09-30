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

$(function () {
    if (typeof FastClick != 'undefined') {
        FastClick.attach(document.body);
    }

    var minDate = new Date();
    minDate.setYear(minDate.getFullYear() - 80);
    var maxDate = new Date();
    maxDate.setYear(maxDate.getFullYear() - 15);

    $('.datepicker').pickadate({
        selectMonths: true,
        selectYears: 65,
        min: minDate,
        max: maxDate,
        format: 'yyyy-mm-dd',
        today: ''
    });

    $('a.btn-floating').on('click', function (e) {
        e.preventDefault();
        var $this = $(e.target);
        $('html, body').animate({
            scrollTop: $($this.attr('href')).offset().top
        }, 700);
    });

    // $('section').height($(window).height());
    getRegistrationForm();

    $('select').material_select();
});

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
                geometry: JSON.stringify({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                }),
                vicinity: place.vicinity,
                location: JSON.stringify(place.address_components),
                place_id: place.place_id
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

(function ($) {
    var Main = function () {
        function Main(args) {
            _classCallCheck(this, Main);

            for (var v in args) {
                this[v] = args[v];
            }

            var $this = this.element;
            this.dimention = {
                image: Main.getDimension($this),
                parent: Main.getDimension($this.closest('div'))
            };
        }

        _createClass(Main, [{
            key: 'getOrientation',
            value: function getOrientation() {
                var imgRatio = Main.getRatio(this.dimention.image);
                var parentRatio = Main.getRatio(this.dimention.parent);

                var orientation = 'portrait';
                if (imgRatio > 1 && imgRatio > parentRatio && !this.revert) {
                    orientation = 'landscape';
                }

                return orientation;
            }
        }], [{
            key: 'getDimension',
            value: function getDimension($el) {
                return {
                    width: $el.width(),
                    height: $el.height()
                };
            }
        }, {
            key: 'getRatio',
            value: function getRatio(args) {
                return args.width / args.height;
            }
        }]);

        return Main;
    }();

    $.widget('pls.pictureOrientation', {
        options: {
            revert: false
        },

        _create: function _create() {
            var _this = this;

            this._destroy();
            var $this = this.element;

            if (this.complete || $this.height() > 0) {
                this._calcClass($this);
            } else {
                $this.on('load', function () {
                    _this._calcClass($this);
                });
            }
        },
        reflow: function reflow() {
            this._create();
        },
        _calcClass: function _calcClass(el) {
            var data = {
                element: this.element,
                revert: this.options.revert
            };
            var orientation = new Main(data).getOrientation();
            el.addClass('img--' + orientation);
        },
        _destroy: function _destroy() {
            this.element.removeClass('img--portrait img--landscape');
        }
    });
})(jQuery);

var Form = function () {
    function Form() {
        _classCallCheck(this, Form);
    }

    _createClass(Form, null, [{
        key: 'removeFlash',
        value: function removeFlash() {
            $('.parsley-errors-list.filled, .parsley-success-list.filled').remove();
        }
    }]);

    return Form;
}();

var Progress = function () {
    function Progress() {
        _classCallCheck(this, Progress);
    }

    _createClass(Progress, null, [{
        key: 'getElement',
        value: function getElement() {
            return $('.progress');
        }
    }, {
        key: 'show',
        value: function show() {
            Progress.getElement().show();
        }
    }, {
        key: 'hide',
        value: function hide() {
            Progress.getElement().hide();
        }
    }]);

    return Progress;
}();

var getRegistrationForm = function getRegistrationForm() {
    var isTime = false;
    var element = $('#registration');
    var html = void 0;

    var getElementForm = function getElementForm() {
        return element.find('#form_registration');
    };

    var complete = function complete() {
        Progress.hide();

        var $form = getElementForm();

        if (!isTime) {
            element.find('.card-content').empty().append(html);
            $form = getElementForm();
        }

        if ($form.length > 0) {

            $form
            // .find('button[type="submit"]').prop('disabled', false).end()

            .on('change', '#register_picture', function (e) {
                var $this = $(e.target);
                var $imgTakenEl = $this.closest('.col').find('img');
                var input = $this[0];

                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        $imgTakenEl.attr('src', e.target.result);
                        $this.closest('.btn').find('span').text('taken');
                    };

                    reader.readAsDataURL(input.files[0]);
                }
            });
            var submit = function submit(e) {
                e.preventDefault();

                var $this = $(e.target);
                var formData = new FormData($this[0]);
                var $buttonSubmit = element.find('button[type="submit"]');
                var html2 = void 0,
                    dataAjax = void 0;

                $.ajax({
                    url: '' + urlBase + $this.attr('action'),
                    dataType: 'json',
                    type: $this.attr('method'),
                    data: formData,
                    //async: false,
                    beforeSend: function beforeSend() {
                        Form.removeFlash();
                        Progress.show();
                        $buttonSubmit.attr('disabled', true);
                    },
                    success: function success(data) {
                        // html2 = Template.flash(data.status, data.message);
                        html2 = data.message;
                        dataAjax = data;
                    },
                    error: function error(xhr) {
                        html2 = Template.flash(false, xhr.statusText);
                    },
                    complete: function complete() {
                        $buttonSubmit.attr('disabled', false);
                        if (dataAjax != null && dataAjax.element != '' && ['dob', 'gender', 'position'].indexOf(dataAjax.element) === -1) {
                            element.find('[name=' + dataAjax.element + ']').trigger('focus').closest('.col').find('label').attr('data-error', html2).end().end().closest('.col').find('.validate').removeClass('valid invalid').addClass('invalid');
                        } else {
                            html2 = Template.flash(dataAjax.status, html2);
                            $buttonSubmit.before(html2);
                        }
                        Progress.hide();
                    },

                    cache: false,
                    contentType: false,
                    processData: false
                });

                return false;
            };
            $form.off('submit').on('submit', submit);

            var scriptSrc = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBjhGHb81MIdRsBEJhhSSUe78JLGIRhHJA&libraries=places&callback=initAutocomplete';
            if ($('body').find('script[src="' + scriptSrc + '"]').length === 0) {
                $('body').append('<script src="' + scriptSrc + '"></script>');
            }
            var f = function f() {
                $('#register_coffeeshop').removeAttr('placeholder');
            };
            delay(f, 1700);
        }
    };

    $.ajax({
        url: urlBase + '/helper/time',
        dataType: 'json',
        beforeSend: function beforeSend() {
            Progress.show();
        },
        success: function success(data) {
            isTime = data.registrationOpen;
            if (!isTime) {
                html = data.registration.start.split(' ')[0] + ' - ' + data.registration.end.split(' ')[0];
                html = TemplateForm.notOpen(html);
            }
        },
        error: function error(xhr) {
            html = Template.flash(false, xhr.statusText);
        },

        complete: complete
    });
};

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

// const isProd = window.location.hostname !== '192.168.2.50' && window.location.hostname !== 'localhost';


var isProd = true;

var urlBase = '192.168.2.50:8080';
if (isProd) {
    urlBase = 'api.baristawars2016.com/public';
}
urlBase = 'http://' + urlBase;