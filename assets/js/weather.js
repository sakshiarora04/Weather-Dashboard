//api key
const api_key = "07c5e8b856efae69ae7aa9535bc97f0c";
var searchFormEl = $("#search-form");
var searchInputEl = $("#search-city");
var searchButtonEl = $("#search-button");
var listUlEl = $(".list-group");
var cities;

// display search city history
function displaySearchedCity(city) {
  var listEl = $("<li>" + city + "</li>");
  $(listEl).attr("class", "list-group-item");
  $(listEl).attr("data-value", city);
  listUlEl.append(listEl);
}
// handle search input
function handleSearchFormSubmit(event) {
  event.preventDefault();
  var city = searchInputEl.val().toLowerCase().trim();
  if (!city) {
    $("#no-input").modal("show");
    return;
  }
  searchInputEl.val("");
  findLatAndLong(city);
}
// find lat and long of city name searched
function findLatAndLong(city) {
  // check if city name is of 2 words then insert '+' between 2 words
  var cityName = city.toLowerCase().split(" ");
  var cName = cityName[0];
  if (cityName[1]) {
    cName = cityName[0] + "+" + cityName[1];
  }
  var cityQueryUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cName +
    "&limit=5&appid=" +
    api_key;
  fetch(cityQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (data) {
      // check if city name in database is of 2 words then insert '+' between 2 words to make it equal to searched city
      var dataCity = data[0].name.toLowerCase().split(" ");
      var dCity = dataCity[0];
      if (dataCity[1]) {
        dCity = dataCity[0] + "+" + dataCity[1];
      }      
      if (dCity === cName) {
        //check if it is already in local storage then remove it and add it on top
        checkLocalStorage(data[0].name);
        currentWeather(data[0].lat, data[0].lon);
        forecast(data[0].lat, data[0].lon);
      } else {
        $("#no-input").modal("show");
      }
    })
    .catch(function (error) {
      console.error(error);
      $("#no-input").modal("show");
    });
}
// fetch current weather with searched city's lat and long
function currentWeather(lat, lon) {
  var currentWeatherURL =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=Imperial&appid=" +
    api_key;
  fetch(currentWeatherURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }
      return response.json();
    })
    .then(function (data) {      
      if (data.cod != 200) {
        $("#no-input").modal("show");
      } else {
        printCurrentResults(data);
      }
    })
    .catch(function (error) {
      console.error(error);
      $("#no-input").modal("show");
    });
}
// fetch 5 day weather with searched city's lat and long
function forecast(lat, lon) {
  console.log(lat);
  var forecastURL =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=Imperial&appid=" +
    api_key;
  fetch(forecastURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {
      if (data.cod != 200) {
        $("#no-input").modal("show");
      } else {
        //printCurrentResults(data)
        printForecastResults(data);
      }
    })
    .catch(function (error) {
      console.error(error);
      $("#no-input").modal("show");
    });
}
// display data of current day weather
function printCurrentResults(result) {
  // convert unix timestamp
  var date = dayjs.unix(result.dt).format("MM/DD/YYYY");
  // weather icon
  var img =
    "https://openweathermap.org/img/wn/" + result.weather[0].icon + "@2x.png";
  var icon = $("<img src=" + img + ">");
  icon.addClass("image-size");

  $("#current-city").html(result.name + " (" + date + ") ");
  $("#current-city").append(icon);
  // if not used units=Imperial then covert temperature
  // $("#temperature").html(
  //   ((list.main.temp - 273.15) * 1.8 + 32).toFixed(2) + " &#8457"
  // );
  $("#temperature").html(result.main.temp.toFixed(2) + " &#8457");
  $("#wind-speed").html((result.wind.speed * 2.237).toFixed(2) + " MPH");
  $("#humidity").html(result.main.humidity + " %");
}
// display 5 day weather
function printForecastResults(result) {
  for (let i = 1; i <= result.list.length/8; i++) {
    //for same timestamp of 5 days at the time you check
    var list = result.list[i * 8 - 1];
    if(dayjs().format("YYYY-MM-DD") === dayjs.unix(list.dt).format("YYYY-MM-DD")) {
      $(".day1").html("Current day Weather");
    }
      // convert unix timestamp
    var date = dayjs.unix(list.dt).format("MM/DD/YYYY");
     // weather icon
    var img =
      "https://openweathermap.org/img/wn/" + list.weather[0].icon + "@2x.png";
    var icon = $("<img src=" + img + ">");
    icon.addClass("image-size");
    
    $("#future-day" + i).html(date);
    $("#icon-day" + i).html(icon);
     // if not used units=Imperial then covert temperature
    // $("#temp-day" + (i)).html(((list.main.temp - 273.15) * 1.8 + 32).toFixed(2) + " &#8457");
    $("#temp-day" + i).html(list.main.temp.toFixed(2) + " &#8457");
    $("#wind-day" + i).html((list.wind.speed * 2.237).toFixed(2) + " MPH");
    $("#humidity-day" + i).html(list.main.humidity + " %");
  }
}

// display particular timing of 5 day weather--12:00:00
// function printForecastResults(result) {
//   var arr=[];
//   for (let i = 0; i < result.list.length; i++) {
//     if(result.list[i].dt_txt.split(' ')[1]==='12:00:00'){
//       arr.push(i);
//     }
//   } 
//   for (let j = 0; j < arr.length; j++) {
//   var list=result.list[arr[j]];
//  var date=dayjs.unix(list.dt).format("MM/DD/YYYY");
//     var img =
//     "https://openweathermap.org/img/wn/" + list.weather[0].icon + "@2x.png";
//   var icon = $("<img src=" + img + ">");
//   icon.addClass("image-size");//
//     $("#future-day" + (j+1)).html(date);
//     $("#icon-day" + (j+1)).html(icon);
//    // $("#temp-day" + (i)).html(((list.main.temp - 273.15) * 1.8 + 32).toFixed(2) + " &#8457");
//     $("#temp-day" + (j+1)).html((list.main.temp).toFixed(2) + " &#8457");
//    $("#wind-day" + (j+1)).html((list.wind.speed * 2.237).toFixed(2) + " MPH");
//     $("#humidity-day" + (j+1)).html(list.main.humidity + " %");
//     }
// }

function checkLocalStorage(city) {
  if (cities === null) {
    cities = [];
    storeCities(city);
  } else {
    for (var i = 0; i < cities.length; i++) {
      if (cities[i].toLowerCase() === city.toLowerCase()) {
        cities.splice(i,1);        
      }
    }
    storeCities(city);
  }
}
//local storage
function storeCities(city) {
  cities.unshift(city);
  listUlEl.html("");
  localStorage.setItem("citiesLocal", JSON.stringify(cities));
  for (let i = 0; i < cities.length; i++) {
    displaySearchedCity(cities[i]);
  }
}
// if city clicked displayed in search history
function runPastsearch(event) {
  var cityName = $(event.target).attr("data-value");
  findLatAndLong(cityName);
}

$("#clear-history").on("click", function () {  
  localStorage.clear();
  listUlEl.html("");
  init();
});

searchFormEl.on("submit", handleSearchFormSubmit);
listUlEl.on("click", ".list-group-item", runPastsearch);

function init() {
  // get cities stored in local storage
  cities = JSON.parse(localStorage.getItem("citiesLocal"));
  listUlEl.html("");
  if (cities != null) {
    if (cities.length > 8) {
      cities.length = 8;
    }
    for (let i = 0; i < cities.length; i++) {
      displaySearchedCity(cities[i]);
    }
  }
}
// show local location weather
function successFunction(position) {
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  forecast(lat, long);
  currentWeather(lat, long);
}

$(document).ready(function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction);
  }
  init();
});
