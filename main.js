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


  const showLicenseInfo = async function(place) {
    let myJson
    const placeId = place.place_id

    try{
      let response = await fetch(_config.db_url+ placeId)
      myJson = await response.json();
    }
    catch(e) {
      console.log(e);
    }

    const key2id = {
      address: "address",
      owner_name: "owner-name",
      contact_name: "contact-name",
      landlord_license_year: "landlord-license-year",
    }

    const not_found = "No Information Found"

    Object.keys(key2id).forEach((key) => {
      const id = key2id[key]
      const p = document.querySelector("#" + id)
      p.innerText = myJson[key] || not_found
    })
  };

  autocomplete.addListener('place_changed', function() {
    infoWindow.close();

    const place = autocomplete.getPlace();
    showLicenseInfo(place);

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
