const isProd = window.location.hostname !== '192.168.2.50' && window.location.hostname !== 'localhost';
// const isProd = true;

let urlBase = 'localhost:8080';
if (isProd) {
    urlBase = 'api.baristawars2016.com'
}
urlBase = `http://${urlBase}`;

class FormTemplate {
    static notOpen() {
        return `<p>registration will be open on ...</p>`
    }

    static open() {
        return `<form method="POST" action="/registration" id="form_registration" enctype="multipart/form-data"> 
    <div class="form__row">
      <div class="form__label form--required">
        <label for="register_name">name</label>
      </div>
      <div class="form__field">
        <input type="text" name="name" id="register_name" required>
      </div>
    </div>
    <div class="form__row">
      <div class="form__label form--required">
        <label for="register_email">email</label>
      </div>
      <div class="form__field">
        <input type="email" name="email" id="register_email" required>
      </div>
    </div>
    <div class="form__row">
      <div class="form__label form--required">
        <label for="register_dob">dob</label>
      </div>
      <div class="form__field">
        <input type="text" name="dob" id="register_dob" required>
      </div>
    </div>
    <div class="form__row">
      <div class="form__label form--required">
        <label>picture</label>
      </div>
      <div class="form__field">
        <label class="form__upload" for="register_picture"><span>upload</span>
          <input type="file" name="picture" id="register_picture" accept="image/*" required>
        </label>
      </div>
    </div>
    <div class="form__row">
      <div class="form__label">
        <label for="register_address">address</label>
      </div>
      <div class="form__field">
        <textarea name="address" id="register_address"></textarea>
      </div>
    </div>
    <div class="form__row">
      <div class="form__label">
        <label for="register_coffeeshop">coffeeshop</label>
      </div>
      <div class="form__field">
        <input type="text" name="coffeeshop" id="register_coffeeshop">
      </div>
    </div>
    <div class="form__row">
      <div class="form__button">
        <button type="submit">submit</button>
      </div>
    </div>
</form>`
    }
}


$(()=> {
    const afterLoad = (anchorLink, index) => {
        switch (index) {
            case 6:
                getRegForm();
                break;
        }
    };

    const getRegForm = () => {
        let isTime = false;
        const element = $('#section6 .fp-tableCell');
        let html;
        const complete = ()=> {
            if (!isTime) {
                return false;
            }
            if (element.find('form').length !== 0) {
                return false;
            }

            element.append(html);

            $("#register_dob").datepicker({
                changeMonth: true,
                changeYear: true,
                minDate: '-80y',
                maxDate: '-5y',
                yearRange: "-100:-5",
                dateFormat:'yy-mm-dd',
                onClose(dateText, inst){
                    const $this = inst.input;
                    console.log($this);
                    $this.trigger('leave');
                }
            });

            $('#register_picture').on('change', (e)=> {
                const $this = $(e.target);
                const $parent = $this.closest('.form__field');
                const input = $this[0];

                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        let $img = $parent.find('img.form__upload-image');
                        if ($img.length === 0) {
                            $parent.prepend('<img class="form__upload-image"/>');
                            $img = $parent.find('img')
                        }
                        $img.attr('src', e.target.result);
                        $.fn.fullpage.reBuild();
                    };

                    reader.readAsDataURL(input.files[0]);
                }
            });

            $("#form_registration")
                .on('submit', (e)=> {
                    e.preventDefault();
                    const $this = $(e.target);

                    // $this.parsley().validate();
                    //
                    // if (!$this.parsley().isValid()) {
                    //     return false
                    // }
                    const formData = new FormData($this[0]);

                    $.ajax({
                        url: `${urlBase}${$this.attr('action')}`,
                        type: $this.attr('method'),
                        data: formData,
                        //async: false,
                        success: function (data) {
                            if (data.status === false) {
                                alert(data.message)
                            }
                        },
                        cache: false,
                        contentType: false,
                        processData: false
                    });

                    return false;
                });

            element.removeClass('spinner');

        };

        $.ajax({
            url: `${urlBase}/helper/time`,
            beforeSend(){
                element.addClass('spinner');
            },
            success(data){
                data = JSON.parse(data);

                isTime = data.registrationOpen;
                if (isTime) {
                    html = FormTemplate.open();
                } else {
                    html = FormTemplate.notOpen()
                }
            },
            complete
        });
    };

    $('#fullpage').fullpage({
        anchors: ['sponsor', 'challengers', 'rules', 'schedule', 'venue', 'registration'],
        menu: 'nav.menu ul',
        scrollOverflow: true,
        // scrollOverflowOptions: {
        //     click: true
        // },
        afterLoad
    });
});