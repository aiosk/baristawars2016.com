'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isProd = window.location.hostname !== '192.168.2.50' && window.location.hostname !== 'localhost';
// const isProd = true;

var urlBase = 'localhost:8080';
if (isProd) {
    urlBase = 'api.baristawars2016.com';
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
            return '<form method="POST" action="/registration" id="form_registration" data-parsley-validate enctype="multipart/form-data"> \n    <div class="form__row">\n      <div class="form__label form--required">\n        <label for="register_name">name</label>\n      </div>\n      <div class="form__field">\n        <input type="text" name="name" id="register_name" required>\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label form--required">\n        <label for="register_email">email</label>\n      </div>\n      <div class="form__field">\n        <input type="email" name="email" id="register_email" required>\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label form--required">\n        <label for="register_dob">dob</label>\n      </div>\n      <div class="form__field">\n        <input type="text" name="dob" id="register_dob" required>\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label form--required">\n        <label>picture</label>\n      </div>\n      <div class="form__field">\n        <label class="form__upload" for="register_picture"><span>upload</span>\n          <input type="file" name="picture" id="register_picture" accept="image/*" required>\n        </label>\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label">\n        <label for="register_address">address</label>\n      </div>\n      <div class="form__field">\n        <textarea name="address" id="register_address"></textarea>\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label">\n        <label for="register_coffeeshop">coffeeshop</label>\n      </div>\n      <div class="form__field">\n        <input type="text" name="coffeeshop" id="register_coffeeshop">\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__button">\n        <button type="submit">submit</button>\n      </div>\n    </div>\n</form>';
        }
    }]);

    return FormTemplate;
}();

$(function () {
    var onLeave = function onLeave(index, nextIndex, direction) {
        switch (nextIndex) {
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

            element.append(html);

            $("#register_dob").datepicker({
                changeMonth: true,
                changeYear: true,
                minDate: '-80y',
                maxDate: '-5y',
                yearRange: "-100:-5",
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
                    };

                    reader.readAsDataURL(input.files[0]);
                }
            });

            $("#form_registration").on('submit', function (e) {
                e.preventDefault();
                var $this = $(e.target);
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

            element.removeClass('spinner').find('form').parsley();
        };

        $.ajax({
            url: urlBase + '/helper/time',
            beforeSend: function beforeSend() {
                element.addClass('spinner').find('form').remove();
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
        onLeave: onLeave
    });
});