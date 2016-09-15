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

var TemplateParticipant = function () {
  function TemplateParticipant() {
    _classCallCheck(this, TemplateParticipant);
  }

  _createClass(TemplateParticipant, null, [{
    key: 'get',
    value: function get(args) {
      return '<div class="participant">\n<div class="participant__picture"><div class="image"><img src="' + args.picture + '" class="img"/></div> </div>\n<div class="participant__name">' + args.name + '</div>\n<div class="participant__email">' + args.email + '</div>\n</div>';
    }
  }]);

  return TemplateParticipant;
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

      return '<p>registration will be open on ' + date + '</p>';
    }
  }, {
    key: 'open',
    value: function open() {
      return ' <h4>Registration</h4> \n<form method="POST" action="/registration" id="form_registration" enctype="multipart/form-data"> \n    <div class="form__row">\n      <div class="form__label form--required">\n        <label for="register_name">name</label>\n      </div>\n      <div class="form__field">\n        <input type="text" name="name" id="register_name">\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label form--required">\n        <label for="register_email">email</label>\n      </div>\n      <div class="form__field">\n        <input type="email" name="email" id="register_email" >\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label form--required">\n        <label for="register_dob">dob</label>\n      </div>\n      <div class="form__field">\n        <input type="text" name="dob" id="register_dob" >\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label form--required">\n        <label>picture</label>\n      </div>\n      <div class="form__field">\n        <label class="form__upload" for="register_picture"><span>upload</span>\n          <input type="file" name="picture" id="register_picture" accept="image/*" >\n        </label>\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label">\n        <label for="register_address">address</label>\n      </div>\n      <div class="form__field">\n        <textarea name="address" id="register_address"></textarea>\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__label">\n        <label for="register_coffeeshop">coffeeshop</label>\n      </div>\n      <div class="form__field">\n        <div id="map"></div>\n        <input type="text" name="" id="register_coffeeshop">\n        <input type="hidden" name="coffeeshop_location" id="register_coffeeshop_maps">\n      </div>\n    </div>\n    <div class="form__row">\n      <div class="form__button">\n        <input type="submit" value="submit"/>\n      </div>\n    </div>\n</form>';
    }
  }]);

  return TemplateForm;
}();