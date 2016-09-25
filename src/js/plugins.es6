(($)=> {
    class Main {
        constructor(args) {
            for (const v in args) {
                this[v] = args[v]
            }

            const $this = this.element;
            this.dimention = {
                image: Main.getDimension($this),
                parent: Main.getDimension($this.closest('div')) 
            };
        }

        getOrientation() {
            const imgRatio = Main.getRatio(this.dimention.image);
            const parentRatio = Main.getRatio(this.dimention.parent);

            let orientation = 'portrait';
            if ((imgRatio > 1 && imgRatio > parentRatio) && !this.revert) {
                orientation = 'landscape';
            }

            return orientation
        }

        static getDimension($el) {
            return {
                width: $el.width(),
                height: $el.height()
            }
        }

        static getRatio(args) {
            return args.width / args.height;
        }
    }

    $.widget('pls.pictureOrientation', {
        options: {
            revert: false
        },

        _create() {
            this._destroy();
            const $this = this.element;

            if (this.complete || $this.height() > 0) {
                this._calcClass($this);
            } else {
                $this.on('load', () => {
                    this._calcClass($this);
                });
            }
        },

        reflow() {
            this._create();
        },

        _calcClass(el){
            const data = {
                element: this.element,
                revert: this.options.revert
            };
            const orientation = (new Main(data)).getOrientation();
            el.addClass(`img--${orientation}`);
        },

        _destroy() {
            this.element.removeClass('img--portrait img--landscape');
        }
    })
})(jQuery);

