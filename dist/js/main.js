'use strict';

var isProd = window.location.hostname !== '192.168.2.50' && window.location.hostname !== 'localhost';

var urlBase = 'localhost:3500';
if (isProd) {
    urlBase = '';
}
var formImagePreviewOnChange = function formImagePreviewOnChange(e) {
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
};