const APIKey = 'AIzaSyDcWXnfXKLVvCd785O_mcnwStiL8K3D1JE';

const beerUrl = 'https://api.openbrewerydb.org/breweries?';

const mapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';

var map;

var markerArr = [];

var breweryArr = [];

//hides inquiry page and creates landing page
function showLanding() {
  $('.inquiry').hide();
  console.log('App loaded and waiting!');
}

//takes user to inquiry page 
function watchSearch() {
  $('form').submit(event => {
    event.preventDefault();
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

//fetches ALL the breweries in a city
function fetchAll(query) {
  const params = {
    by_city: query,
  }
  const queryString = formatQueryParams(params);
  const url = beerUrl + queryString;
  console.log(url);

  fetch(url)
  .then(response => response.json())
  .then(responseJson => displayMarkers(responseJson))
  .catch(error => {
    alert("Whoops, Sorry! There are no Breweries to show.");
    console.log(error)});  
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

    breweryArr = responseJson;

    if (!breweryArr || breweryArr.length === 0) {
        return alert("There are no breweries to show.");
      }

    filter('all');

    $('.landing').hide();
    $('.inquiry').show();
}

function filter(type) {

  markerArr = breweryArr.map(function(brewery, i) {
    const brewLat = +brewery.latitude
    const brewLng = +brewery.longitude
    if (brewery.brewery_type === type || type === 'all') {
      if(brewLat !== 0 || brewLng !== 0) {
        $('.list').append(
          `<li>
            <a href="${brewery.website_url}" target="${brewery.website_url}">${brewery.name}</a>
          </li>`
        );
        return new google.maps.Marker({
          position: new google.maps.LatLng(brewLat, brewLng),
          map: map,
          title: brewery.name
        });
      }
    }
  }).filter(function(data) {
    return data !== undefined;
  })
}

function watchAll() {
  $('button.all').on('click', event => {
    $('.list').empty();
    $('.list').prepend(`<h3>All Breweries</h3>`);
    clearMarkerArr();
    filter('all');
  })
}

function watchBrewpub() {
  $('button.pub').on('click', event => {
    $('.list').empty();
    $('.list').prepend(`<h3>Breweries/Pubs</h3>`);
    clearMarkerArr();
    filter('brewpub');
    console.log('pub clicked on');
  })
}

function watchMicro() {
  $('button.micro').on('click', event => {
    $('.list').empty();
    $('.list').prepend(`<h3>Micro Breweries</h3>`);
    clearMarkerArr();
    filter('micro');
    console.log('micro clicked on');
  })
}

function watchLarge() {
  $('button.large').on('click', event => {
    $('.list').empty();
    $('.list').prepend(`<h3>Large Breweries</h3>`);
    clearMarkerArr();
    filter('large');
    console.log('large clicked on');
  })
}

function watchRegional() {
  $('button.regional').on('click', event => {
    $('.list').empty();
    $('.list').prepend(`<h3>Regional Breweries</h3>`);
    clearMarkerArr();
    filter('regional');
    console.log('regional clicked on');
  })
}

function clearMarkerArr() {
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