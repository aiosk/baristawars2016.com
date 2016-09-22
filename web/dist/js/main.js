'use strict';

var isProd = window.location.hostname !== '192.168.2.50' && window.location.hostname !== 'localhost';
// const isProd = false;

var urlBase = '192.168.2.50:8080';
if (isProd) {
    urlBase = 'api.baristawars2016.com/public';
}
urlBase = 'http://' + urlBase;

var fullpageRebuild = function fullpageRebuild() {
    if ($.fn.fullpage.reBuild != null) {
        $.fn.fullpage.reBuild();
    }
};

var getRegistrationForm = function getRegistrationForm() {
    var isTime = false;
    var element = $('#section2');
    var html = void 0,
        html2 = void 0;

    $.ajax({
        url: urlBase + '/helper/time',
        dataType: 'json',
        beforeSend: function beforeSend() {
            element.find('.parsley-errors-list.filled').remove().end();
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
        complete: function complete() {
            element.find('.mdl-progress').hide();

            var $form = element.find('form');

            if (!isTime) {
                element.find('.mdl-card__supporting-text').empty().append(html);
                $form = element.find('#form_registration');
            }

            if ($form.length === 0) {
                element.find('.mdl-card__actions.mdl-card--border').remove();
            } else {
                $form.find("#register_dob").datepicker({
                    changeMonth: true,
                    changeYear: true,
                    minDate: '-80y',
                    maxDate: '-5y',
                    yearRange: "-100:-5",
                    dateFormat: 'yy-mm-dd',
                    onSelect: function onSelect(dateText, inst) {
                        var $this = inst.input;
                        // console.log($this);
                        // $this.trigger('leave');
                        // $(this).valid()
                        $this.closest('.mdl-textfield').removeClass('is-invalid').addClass('is-dirty');
                    }
                });

                $form.on('click tap touchstart', 'label[for=register_picture]', function (e) {
                    var $this = $(e.target);
                    $('#register_picture').trigger('click tap touchstart');
                }).on('change', '#register_picture', function (e) {
                    var $this = $(e.target);
                    var $imgEl = $this.closest('.mdl-card').find('.mdl-card__title');
                    var input = $this[0];
                    console.log($imgEl);

                    if (input.files && input.files[0]) {
                        var reader = new FileReader();

                        reader.onload = function (e) {
                            $imgEl.css('background-image', 'url(' + e.target.result + ')');
                            $this.closest('label').find('.mdl-button').text('picture taken');
                            fullpageRebuild();
                        };

                        reader.readAsDataURL(input.files[0]);
                    }
                });

                element.off('click', '.mdl-card__actions button').on('click', '.mdl-card__actions button', function (e) {
                    $form.trigger('submit');
                });

                $form.off('submit').on('submit', function (e) {
                    e.preventDefault();

                    var $this = $(e.target);

                    var formData = new FormData($this[0]);
                    var $buttonSubmit = element.find('button[type="submit"]');

                    $.ajax({
                        url: '' + urlBase + $this.attr('action'),
                        dataType: 'json',
                        type: $this.attr('method'),
                        data: formData,
                        //async: false,
                        beforeSend: function beforeSend() {
                            $buttonSubmit.attr('disabled', true);

                            element.find('.parsley-errors-list.filled').remove().end().find('.mdl-progress').show();
                        },
                        success: function success(data) {
                            html2 = Template.flash(data.status, data.message);
                            element.find('[name=' + data.element + ']').closest('.mdl-textfield').addClass('is-invalid');
                        },
                        error: function error(xhr) {
                            html2 = Template.flash(false, xhr.statusText);
                        },
                        complete: function complete() {
                            $buttonSubmit.attr('disabled', false).before(html2);
                            element.find('.mdl-progress').hide();
                            fullpageRebuild();
                        },

                        cache: false,
                        contentType: false,
                        processData: false
                    });

                    return false;
                });
                var scriptSrc = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBjhGHb81MIdRsBEJhhSSUe78JLGIRhHJA&libraries=places&callback=initAutocomplete';
                if ($('body').find('script[src="' + scriptSrc + '"]').length === 0) {
                    $('body').append('<script src="' + scriptSrc + '"></script>');
                }
                var f = function f() {
                    $('#register_coffeeshop').removeAttr('placeholder');
                };
                delay(f, 700);
                fullpageRebuild();
            }
        }
    });
};

$(function () {
    if (typeof FastClick != 'undefined') {
        FastClick.attach(document.body);
    }
    var afterLoad = function afterLoad(anchorLink, index) {
        switch (anchorLink) {
            case 'registration':
                getRegistrationForm();
                break;
        }
    };

    // getRegistrationForm();
    // $('.section').height($(window).height())

    $('#fullpage').fullpage({
        anchors: ['main', 'registration'],
        // css3: false,
        // menu: 'nav.menu ul',
        // scrollOverflow: true,
        responsiveWidth: 500,
        fitToSection: false,
        // autoScrolling:false,
        // scrollBar: true,
        // scrollOverflow: false,
        scrollOverflowOptions: {

            tap: true
        },
        afterLoad: afterLoad
    });
});