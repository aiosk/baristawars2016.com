const delay = (()=> {
    let timer = 0;
    return (callback, ms, clear = false)=> {
        if (clear) {
            clearTimeout(timer)
        }
        timer = setTimeout(callback, ms)
    }
})();
class TemplateParticipant {
    static get(args) {
        return `<div class="participant">
<div class="participant__picture"><div class="image"><img src="${args.picture}" class="img"/></div> </div>
<div class="participant__name">${args.name}</div>
<div class="participant__email">${args.email}</div>
</div>`;
    }
}
class Template {
    static flash(status, text) {
        const className = status ? 'parsley-success-list' : 'parsley-errors-list';
        return `<ul class="${className} filled">
    <li>${text}</li>
</ul>`
    }
}
class TemplateForm {
    static notOpen(date = '') {
        return `<p>registration will be open on ${date}</p>`
    }

    static open() {
        return ` <h4>Registration</h4> 
<form method="POST" action="/registration" id="form_registration" enctype="multipart/form-data"> 
    <div class="form__row">
      <div class="form__label form--required">
        <label for="register_name">name</label>
      </div>
      <div class="form__field">
        <input type="text" name="name" id="register_name">
      </div>
    </div>
    <div class="form__row">
      <div class="form__label form--required">
        <label for="register_email">email</label>
      </div>
      <div class="form__field">
        <input type="email" name="email" id="register_email" >
      </div>
    </div>
    <div class="form__row">
      <div class="form__label form--required">
        <label for="register_dob">dob</label>
      </div>
      <div class="form__field">
        <input type="text" name="dob" id="register_dob" >
      </div>
    </div>
    <div class="form__row">
      <div class="form__label form--required">
        <label>picture</label>
      </div>
      <div class="form__field">
        <label class="form__upload" for="register_picture"><span>upload</span>
          <input type="file" name="picture" id="register_picture" accept="image/*" >
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
        <div id="map"></div>
        <input type="text" name="" id="register_coffeeshop">
        <input type="hidden" name="coffeeshop_location" id="register_coffeeshop_maps">
      </div>
    </div>
    <div class="form__row">
      <div class="form__button">
        <input type="submit" value="submit"/>
      </div>
    </div>
</form>`
    }
}