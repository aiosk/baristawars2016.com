$(()=> {
    if (typeof FastClick != 'undefined') {
        FastClick.attach(document.body);
    }

    const minDate = new Date();
    minDate.setYear(minDate.getFullYear() - 80);
    const maxDate = new Date();
    maxDate.setYear(maxDate.getFullYear() - 15);

    $('.datepicker').pickadate({
        selectMonths: true,
        selectYears: 65,
        min: minDate,
        max: maxDate,
        format: 'yyyy-mm-dd',
        today: '',
    });

    $('a.btn-floating').on('click', (e)=> {
        e.preventDefault();
        const $this = $(e.target);
        $('html, body').animate({
            scrollTop: $($this.attr('href')).offset().top
        }, 700);
    });

    // $('section').height($(window).height());
    getRegistrationForm();
    
    $('select').material_select()
});
