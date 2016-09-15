const isProd = window.location.hostname !== '192.168.2.50' && window.location.hostname !== 'localhost';
// const isProd = true;

let urlBase = 'localhost:8080';
if (isProd) {
    urlBase = 'api.baristawars2016.com/public'
}
urlBase = `http://${urlBase}`;


// init maps
const initAutocomplete = ()=> {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -6.187210, lng: 106.487706},
        zoom: 10,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('register_coffeeshop');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            console.log(place);
            $('#register_coffeeshop_maps').val(JSON.stringify({
                name: place.name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            }));

            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
};

const getRegistrationForm = () => {
    let isTime = false;
    const element = $('#section6 .fp-tableCell');
    let html;

    $.ajax({
        url: `${urlBase}/helper/time`,
        beforeSend(){
            element
                .find('.parsley-errors-list.filled').remove().end()
                .addClass('spinner');
        },
        success(data){
            data = JSON.parse(data);

            isTime = data.registrationOpen;
            if (isTime) {
                html = TemplateForm.open();
            } else {
                html = `${data.registration.start} - ${data.registration.end}`;
                html = TemplateForm.notOpen(html);
            }
        },
        error(xhr){
            html = Template.flash(false, xhr.statusText);
        },
        complete(){
            element.removeClass('spinner');

            let $form = element.find('#form_registration');
            console.log(!isTime, (isTime && $form.length == 0));
            if (!isTime || (isTime && $form.length == 0)) {
                element
                    .empty()
                    .append(html);
                $form = element.find('#form_registration');
                if ($form.length > 0) {
                    $form.find("#register_dob").datepicker({
                        changeMonth: true,
                        changeYear: true,
                        minDate: '-80y',
                        maxDate: '-5y',
                        yearRange: "-100:-5",
                        dateFormat: 'yy-mm-dd',
                        onClose(dateText, inst){
                            const $this = inst.input;
                            console.log($this);
                            $this.trigger('leave');
                        }
                    });

                    $form.on('change', '#register_picture', (e)=> {
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

                    $form.on('submit', (e)=> {
                        e.preventDefault();

                        const $this = $(e.target);

                        // $this.parsley().validate();
                        //
                        // if (!$this.parsley().isValid()) {
                        //     return false
                        // }
                        const formData = new FormData($this[0]);
                        const $buttonContainer = $this.find('.form__button');
                        const $buttonSubmit = $buttonContainer.find('[type="submit"]');
                        let html;

                        $.ajax({
                            url: `${urlBase}${$this.attr('action')}`,
                            type: $this.attr('method'),
                            data: formData,
                            //async: false,
                            beforeSend(){
                                $buttonSubmit.attr('disabled', true)
                                    .addClass('spinner');
                            },
                            success(data) {
                                data = JSON.parse(data);

                                html = Template.flash(data.status, data.message);
                            },
                            error(xhr){
                                html = Template.flash(false, xhr.statusText);
                            },
                            complete(){
                                $buttonContainer
                                    .find('.parsley-errors-list, .parsley-success-list').remove().end()
                                    .prepend(html);

                                $buttonSubmit.prop('disabled', false)
                                    .removeClass('spinner');
                            },
                            cache: false,
                            contentType: false,
                            processData: false
                        });

                        return false;
                    });

                    $('body').append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBjhGHb81MIdRsBEJhhSSUe78JLGIRhHJA&libraries=places&callback=initAutocomplete"></script>');
                    $.fn.fullpage.reBuild();
                }
            }
        }
    });
};

const getParticipants = ()=> {
    const element = $('#section2 .fp-tableCell');
    let html;
    $.ajax({
        url: `${urlBase}/participant`,
        beforeSend(){
            element
                .find('.parsley-errors-list.filled').remove().end()
                .addClass('spinner');
        },
        success(data){
            data = JSON.parse(data);
            html = data.items.map((v)=>{
                return `<li>${TemplateParticipant.get(v)}</li>`;
            }).join('');

            html = `<ul class="participants">${html}</ul>`;
        },
        error(xhr){
            html = Template.flash(false, xhr.statusText);
        },
        complete(){
            element.removeClass('spinner')
                .empty()
                .append(html)
                .find('.participant img').pictureOrientation();
            $.fn.fullpage.reBuild();
        }
    })
};

$(()=> {
    const afterLoad = (anchorLink, index) => {
        switch (anchorLink) {
            case 'registration':
                getRegistrationForm();
                break;
            case 'challengers':
                getParticipants();
                break;
        }
    };

    $('#fullpage').fullpage({
        anchors: ['sponsor', 'challengers', 'rules', 'schedule', 'venue', 'registration'],
        // menu: 'nav.menu ul',
        scrollOverflow: true,
        // scrollOverflowOptions: {
        //     click: true
        // },
        afterLoad
    });
});