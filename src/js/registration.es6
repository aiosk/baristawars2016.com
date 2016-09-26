class Form {
    static removeFlash() {
        $('.parsley-errors-list.filled, .parsley-success-list.filled').remove();
    }
}

class Progress {
    static getElement() {
        return $('.progress')
    }

    static show() {
        Progress.getElement().show();
    }

    static hide() {
        Progress.getElement().hide();
    }
}

const getRegistrationForm = () => {
    let isTime = false;
    const element = $('#registration');
    let html;

    const getElementForm = ()=> {
        return element.find('#form_registration');
    };

    const complete = ()=> {
        Progress.hide();

        let $form = getElementForm();

        if (!isTime) {
            element.find('.card-content')
                .empty()
                .append(html);
            $form = getElementForm();
        }

        if ($form.length > 0) {

            $form
                // .find('button[type="submit"]').prop('disabled', false).end()
                
                .on('change', '#register_picture', (e)=> {
                    const $this = $(e.target);
                    const $imgTakenEl = $this.closest('.col').find('img');
                    const input = $this[0];

                    if (input.files && input.files[0]) {
                        var reader = new FileReader();

                        reader.onload = function (e) {
                            $imgTakenEl.attr('src', e.target.result);
                            $this.closest('.btn').find('span')
                                .text('taken');
                        };

                        reader.readAsDataURL(input.files[0]);
                    }
                });
            const submit = (e)=> {
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
                        Form.removeFlash();
                        Progress.show();
                        $buttonSubmit.attr('disabled', true);
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
                                .closest('.col').append(html2).end()
                                .trigger('focus');
                        } else {
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
            $form
                .off('submit')
                .on('submit', submit);

            const scriptSrc = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBjhGHb81MIdRsBEJhhSSUe78JLGIRhHJA&libraries=places&callback=initAutocomplete';
            if ($('body').find(`script[src="${scriptSrc}"]`).length === 0) {
                $('body').append(`<script src="${scriptSrc}"></script>`);
            }
            const f = ()=> {
                $('#register_coffeeshop').removeAttr('placeholder');
            };
            delay(f, 1700);
        }
    };

    $.ajax({
        url: `${urlBase}/helper/time`,
        dataType: 'json',
        beforeSend(){
            Progress.show();
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
        complete
    });

};
