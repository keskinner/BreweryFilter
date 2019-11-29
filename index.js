const APIKey = 'AIzaSyDcWXnfXKLVvCd785O_mcnwStiL8K3D1JE';

const beerUrl = 'https://api.openbrewerydb.org/breweries?';

const microUrl = 'https://api.openbrewerydb.org/breweries?by_type=micro&';

const pubUrl = 'https://api.openbrewerydb.org/breweries?by_type=brewpub&';

const largeUrl = 'https://api.openbrewerydb.org/breweries?by_type=large&';

const regUrl = 'https://api.openbrewerydb.org/breweries?by_type=regional&';

const mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';

var map;

var markerArr = [];

//hides inquiry page and creates landing page
function showLanding() {
  $('.inquiry').hide();
  console.log('App loaded and waiting!');
}

//takes user to inquiry page
function watchSearch() {
  $('button.search.button').on('click', event => {
    var searchInput = $('#city').val();
    fetchCity(searchInput);
    fetchAll(searchInput);
    $('.list').prepend(`<h3>All Breweries</h3>`);
    console.log('landing page hidden');
  });
}

//centers map over users input city
function fetchCity(query) {
  const params = {
    address: query,
    key: APIKey,
  }
  const queryString = formatQueryParams(params);
  const searchUrl = mapUrl + queryString;

  fetch(searchUrl)
  .then(response => response.json())
  .then(responseJson => displayMap(responseJson))
  .catch(error => {
    alert("Something went wrong. Try entering a city.");
    console.log(error)
    });
}

function fetchBrewpub(query) {
   const params = {
    by_city: query,
  }
  const queryString = formatingQueryParams(params);
  const pUrl = pubUrl + queryString;
  console.log(pUrl);

  fetch(pUrl)
  .then(response => response.json())
  .then(responseJson => displayMarkers(responseJson))
  .catch(error => {
    alert("There are no Brewerires/Pubs in this city.");
    console.log(error)
  })
}

function fetchMicro(query) {
  const params = {
    by_city: query,
  }
  const queryString = formatingQueryParams(params);
  const mUrl = microUrl + queryString;
  console.log(mUrl);

  fetch(mUrl)
  .then(response => response.json())
  .then(responseJson => displayMarkers(responseJson))
  .catch(error => {
    alert("There are no micro breweries in this city.");
    console.log(error)
  })
}

function fetchLarge(query) {
  const params = {
    by_city: query,
  }
  const queryString = formatingQueryParams(params);
  const lUrl = largeUrl + queryString;
  console.log(lUrl);

  fetch(lUrl)
  .then(response => response.json())
  .then(responseJson => displayMarkers(responseJson))
  .catch(error => {
    alert("There are no large breweries in this city.");
    console.log(error)
  })
}

function fetchRegional(query) {
  const params = {
    by_city: query,
  }
  const queryString = formatingQueryParams(params);
  const rUrl = regUrl + queryString;
  console.log(rUrl);

  fetch(rUrl)
  .then(response => response.json())
  .then(responseJson => displayMarkers(responseJson))
  .catch(error => {
    alert("There are no regional breweries in this city.");
    console.log(error)
  })
}

//fetches ALL the breweries in a city
function fetchAll(query) {
  const params = {
    by_city: query,
  }
  const queryString = formatingQueryParams(params);
  const url = beerUrl + queryString;
  console.log(url);

  fetch(url)
  .then(response => response.json())
  .then(responseJson => displayMarkers(responseJson))
  .catch(error => {
    alert("There are no Breweries in this city. Please enter a different city.");
    console.log(error)});
}

function formatingQueryParams(params) {
  console.log('Query params are formatted!');
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('+');
}


function formatQueryParams(params) {
  console.log('Query params are formatted!');
  const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//displays map and centers it according to the city that is searched
function displayMap(responseJson) {
    
  const lat= responseJson.results[0].geometry.location.lat;
  const lng = responseJson.results[0].geometry.location.lng;
  console.log(responseJson);
   
   map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lat, lng: lng},
    zoom: 10
    }); 

  console.log('map displayed');
}

//creates markers for breweries in picked city
function displayMarkers(responseJson) {

    if (!responseJson || responseJson.length === 0) {
        return alert("There are no breweries to show.");
      }

  for (let i = 0; i < responseJson.length; i++) {
  
  const brewLat = +responseJson[i].latitude
  const brewLng = +responseJson[i].longitude

  //creates a marker at a given point
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(brewLat, brewLng),
      map: map,
      title: responseJson[i].name
    });

    $('.list').append(
      `<li>
        <a href="${responseJson[i].website_url}" target="${responseJson[i].website_url}">${responseJson[i].name}</a>
      </li>`
    );

    markerArr.push(marker);
  }

  console.log('markers displayed');
  $('.landing').hide();
  $('.inquiry').show();
}

function watchAll() {
  $('button.all').on('click', event => {
    $('.list').empty();
    $('.list').prepend(`<h3>All Breweries</h3>`);
    makeMarkerArr();
    markerArr = [];
    let searchInput = $('#city').val();
    fetchAll(searchInput);
  })
}

function watchBrewpub() {
  $('button.pub').on('click', event => {
    $('.list').empty();
    $('.list').prepend(`<h3>Breweries/Pubs</h3>`);
    makeMarkerArr();
    markerArr = [];
    let searchInput = $('#city').val();
    fetchBrewpub(searchInput);
    console.log('pub clicked on');
  })
}

function watchMicro() {
  $('button.micro').on('click', event => {
    $('.list').empty();
    $('.list').prepend(`<h3>Micro Breweries</h3>`);
    makeMarkerArr();
    markerArr = [];
    let searchInput = $('#city').val();
    fetchMicro(searchInput);
    console.log('micro clicked on');
  })
}

function watchLarge() {
  $('button.large').on('click', event => {
    $('.list').empty();
    $('.list').prepend(`<h3>Large Breweries</h3>`);
    makeMarkerArr();
    markerArr = [];
    let searchInput = $('#city').val();
    fetchLarge(searchInput);
    console.log('large clicked on');
  })
}

function watchRegional() {
  $('button.regional').on('click', event => {
    $('.list').empty();
    $('.list').prepend(`<h3>Regional Breweries</h3>`);
    makeMarkerArr();
    markerArr = [];
    let searchInput = $('#city').val();
    fetchRegional(searchInput);
    console.log('regional clicked on');
  })
}

function makeMarkerArr() {
  markerArr.forEach(function(marker) {
    marker.setMap(null);
  })
}


function watchNewCitySearch() {
  $('button.new').on('click', event => {
    console.log('new city button clicked');
    $('.list').empty();
    $('.inquiry').hide();
    $('.landing').show();
  });
}

function runApp() {
showLanding();
watchSearch();
watchNewCitySearch();
watchAll();
watchBrewpub();
watchMicro();
watchLarge();
watchRegional();
}

$(runApp);