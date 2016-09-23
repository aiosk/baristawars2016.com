const isProd = window.location.hostname !== '192.168.2.50' && window.location.hostname !== 'localhost';
// const isProd = false;

let urlBase = '192.168.2.50:8080';
if (isProd) {
    urlBase = 'api.baristawars2016.com/public'
}
urlBase = `http://${urlBase}`;

const fullpageRebuild = ()=> {
    if ($.fn.fullpage.reBuild != null) {
        $.fn.fullpage.reBuild()
    }
}

const getRegistrationForm = () => {
    let isTime = false;
    const element = $(document).find('.form.mdl-card');
    let html;

    $.ajax({
        url: `${urlBase}/helper/time`,
        dataType: 'json',
        beforeSend(){
            element
                .find('.parsley-errors-list.filled, .parsley-success-list.filled').remove().end();
        },
        success(data){
            isTime = data.registrationOpen;
            if (!isTime) {
                html = `${data.registration.start.split(' ')[0]} - ${data.registration.end.split(' ')[0]}`;
                html = TemplateForm.notOpen(html);
            }
        },
        error(xhr){
            html = Template.flash(false, xhr.statusText);
        },
        complete(){
            element.find('.mdl-progress').hide();

            let $form = element.find('form');

            if (!isTime) {
                element.find('.mdl-card__supporting-text')
                    .empty()
                    .append(html);
                $form = element.find('#form_registration')
            }

            if ($form.length === 0) {
                element.find('.mdl-card__actions.mdl-card--border').remove()
            } else {
                $form.find("#register_dob").datepicker({
                    changeMonth: true,
                    changeYear: true,
                    minDate: '-80y',
                    maxDate: '-5y',
                    yearRange: "-100:-5",
                    dateFormat: 'yy-mm-dd',
                    onSelect(dateText, inst){
                        const $this = inst.input;
                        // console.log($this);
                        // $this.trigger('leave');
                        // $(this).valid()
                        $this.closest('.mdl-textfield')
                            .removeClass('is-invalid')
                            .addClass('is-dirty');
                    }
                });

                $form
                    .on('click tap touchstart', 'label[for=register_picture]', (e)=> {
                        const $this = $(e.target);
                        $('#register_picture').trigger('click tap touchstart')
                    })
                    .on('change', '#register_picture', (e)=> {
                        const $this = $(e.target);
                        const $imgEl = $this.closest('.mdl-card').find('.mdl-card__title');
                        const input = $this[0];
                        console.log($imgEl);

                        if (input.files && input.files[0]) {
                            var reader = new FileReader();

                            reader.onload = function (e) {
                                $imgEl.css('background-image', `url(${e.target.result})`);
                                $this.closest('label').find('.mdl-button')
                                    .text('picture taken')
                                    .addClass('mdl-button--raised');
                                fullpageRebuild();
                            };

                            reader.readAsDataURL(input.files[0]);
                        }
                    });

                element
                    .off('click', '.mdl-card__actions button')
                    .on('click', '.mdl-card__actions button', (e)=> {
                        $form.trigger('submit')
                    });

                $form
                    .off('submit')
                    .on('submit', (e)=> {
                        e.preventDefault();

                        const $this = $(e.target);
                        const formData = new FormData($this[0]);
                        const $buttonSubmit = element.find('button[type="submit"]');
                        let html2, dataAjax;

                        $.ajax({
                            url: `${urlBase}${$this.attr('action')}`,
                            dataType: 'json',
                            type: $this.attr('method'),
                            data: formData,
                            //async: false,
                            beforeSend(){
                                $buttonSubmit.attr('disabled', true);

                                element
                                    .find('.parsley-errors-list.filled, .parsley-success-list.filled').remove().end()
                                    .find('.mdl-progress').show();
                            },
                            success(data) {
                                html2 = Template.flash(data.status, data.message);
                                dataAjax = data;
                            },
                            error(xhr){
                                html2 = Template.flash(false, xhr.statusText);
                            },
                            complete(){
                                $buttonSubmit.attr('disabled', false);
                                if (dataAjax != null && dataAjax.element != '') {
                                    element.find(`[name=${dataAjax.element}]`)
                                        .closest('.mdl-textfield').addClass('is-invalid').end()
                                        .closest('.mdl-grid').append(html2).end();
                                } else {
                                    $buttonSubmit.before(html2);
                                }
                                element.find('.mdl-progress').hide();
                                fullpageRebuild();
                            },
                            cache: false,
                            contentType: false,
                            processData: false
                        });

                        return false;
                    });
                const scriptSrc = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBjhGHb81MIdRsBEJhhSSUe78JLGIRhHJA&libraries=places&callback=initAutocomplete';
                if ($('body').find(`script[src="${scriptSrc}"]`).length === 0) {
                    $('body').append(`<script src="${scriptSrc}"></script>`);
                }
                const f = ()=> {
                    $('#register_coffeeshop').removeAttr('placeholder');
                };
                delay(f, 700);
                fullpageRebuild();
            }
        }
    });
};

$(()=> {
    if (typeof FastClick != 'undefined') {
        FastClick.attach(document.body);
    }
    const afterLoad = (anchorLink, index) => {
        switch (anchorLink) {
            case 'registration':
                // getRegistrationForm();
                break;
        }
    };

    // $('.section').height($(window).height())

    $('#fullpage').fullpage({
        // anchors: ['main'],
        // css3: false,
        // menu: 'nav.menu ul',
        // scrollOverflow: true,
        // responsiveWidth: 500,
        // fitToSection: false,
        // autoScrolling:false,
        // scrollBar: true,
        // scrollOverflow: false,
        scrollOverflowOptions: {
            tap: true,
            // preventDefault: false,
            // preventDefaultException: {tagName: /^(TEXTAREA|BUTTON|SELECT)$/}
        },
        afterLoad
    });

    $('.section__button .mdl-button').on('click',(e)=>{
        getRegistrationForm();
        $.blockUI({
            message:$('.form.mdl-card'),
            // css:{
            //     width:'50%',
            //     top:'0',
                // left:'0'
            // },
        });
        $('.blockOverlay').attr('title','Click to unblock').on('click',$.unblockUI);
    })
});