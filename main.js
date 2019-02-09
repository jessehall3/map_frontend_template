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
    const not_found = "No Information Found"

    const address_p = document.querySelector("#address")
    address_p.innerText = myJson.address || not_found

    const owner_p = document.querySelector("#owner")
    owner_p.innerText = myJson.owner_name || not_found

    const contact_p = document.querySelector("#contact")
    contact_p.innerText = myJson.contact_name || not_found

    const years_p = document.querySelector("#landlord-license-year")
    years_p.innerText = myJson.landlord_license_year || not_found
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
        showLicenseInfo(myJson);
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
