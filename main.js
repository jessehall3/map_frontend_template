function initMap(){
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 29.651923,
      lng: -82.325008
    },
    zoom: 13
  });

  const input = document.getElementById('pac-input');

  const autocomplete = new google.maps.places.Autocomplete(input);

  const infoWindow = new google.maps.InfoWindow();
  const infoWindowContent = document.getElementById('infoWindow');
  infoWindow.setContent(infoWindowContent);
  const marker = new google.maps.Marker({
    map: map
  });
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });

  const showLicenseInfo = (myJson) => {
    let p;
    if (myJson.address){
      p = document.querySelector("#address");
      p.innerText = myJson.address;
    }
    if (myJson.owner_name){
      p = document.querySelector("#owner");
      p.innerText = myJson.owner_name;
    }
    if (myJson.contact_name){
      p = document.querySelector("#contact");
      p.innerText = myJson.contact_name;
    }
    if (myJson.landlord_license_year){
      p = document.querySelector("#landlord-license-year");
      p.innerText = myJson.landlord_license_year;
    }
  };

  autocomplete.addListener('place_changed', function() {
    infoWindow.close();
    var place = autocomplete.getPlace();
    (async function() {
      let url = _config.db_url;
      try{
        let place = await autocomplete.getPlace();
        let placeId = place.place_id
        let response = await fetch(url + placeId)
        let myJson = await response.json();
        if (Object.keys(myJson).length) {
          showLicenseInfo(myJson);
          console.log(myJson);
        }
      }
      catch(e) {
        console.log(e);
      }
    })();

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    }
    else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker.setVisible(true);
  });
}

const jsElem = window.document.createElement('script');
jsElem.src = `https://maps.googleapis.com/maps/api/js?key=${_config.map_key}&libraries=places&callback=initMap`;
jsElem.type = 'text/javascript';
document.body.append(jsElem);
