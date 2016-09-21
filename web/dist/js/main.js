'use strict';

var isProd = window.location.hostname !== '192.168.2.50' && window.location.hostname !== 'localhost';
// const isProd = true;

var urlBase = 'localhost:8080';
if (isProd) {
    urlBase = 'api.baristawars2016.com/public';
}
urlBase = 'http://' + urlBase;

var getRegistrationForm = function getRegistrationForm() {
    var isTime = false;
    var element = $('#section2 .fp-tableCell');
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

                $form
                // .off('change', '#register_dob')
                // .on('change', '#register_dob', (e)=> {
                //     console.log($(this))
                // })
                .on('change', '#register_picture', function (e) {
                    var $this = $(e.target);
                    var $imgEl = $this.closest('.mdl-card').find('.mdl-card__title');
                    var input = $this[0];
                    console.log($imgEl);

                    if (input.files && input.files[0]) {
                        var reader = new FileReader();

                        reader.onload = function (e) {
                            $imgEl.css('background-image', 'url(' + e.target.result + ')');
                            $.fn.fullpage.reBuild();
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
                    var $buttonContainer = element.find('.mdl-card__supporting-text');
                    var $buttonSubmit = element.find('.mdl-card__actions button');

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
                            $buttonContainer.append(html2);
                            $buttonSubmit.attr('disabled', false);
                            element.find('.mdl-progress').hide();
                        },

                        cache: false,
                        contentType: false,
                        processData: false
                    });

                    return false;
                });

                $('body').append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBjhGHb81MIdRsBEJhhSSUe78JLGIRhHJA&libraries=places&callback=initAutocomplete"></script>');
                var f = function f() {
                    $('#register_coffeeshop').removeAttr('placeholder');
                };
                delay(f, 500);
                $.fn.fullpage.reBuild();
            }
        }
    });
};

$(function () {
    var afterLoad = function afterLoad(anchorLink, index) {
        switch (anchorLink) {
            case 'registration':
                getRegistrationForm();
                break;
        }
    };

    $('#fullpage').fullpage({
        anchors: ['main', 'registration'],
        // menu: 'nav.menu ul',
        scrollOverflow: true,
        // scrollOverflowOptions: {
        //     click: true
        // },
        afterLoad: afterLoad
    });
});