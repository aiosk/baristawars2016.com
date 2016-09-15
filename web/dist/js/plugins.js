'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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