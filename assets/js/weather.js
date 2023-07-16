const api_key = "07c5e8b856efae69ae7aa9535bc97f0c";
var searchFormEl = $("#search-form");
var searchInputEl = $("#search-city");
var searchButtonEl = $("#search-button");
var listUlEl = $(".list-group");
var cities;

function handleSearchFormSubmit(event) {
  event.preventDefault();
 
  var city=searchInputEl.val().toLowerCase().trim(); 
  
  if (!city) {
    $("#no-input").modal("show");
    return;
  }
  searchInputEl.val("");
  findLatAndLong(city);  
  
}
function findLatAndLong(city) {
  var cityName= city.toLowerCase().split(' ');   
      
      var cName=cityName[0];
      if(cityName[1]){
        
        cName=cityName[0]+'+'+cityName[1];
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
      var dataCity=data[0].name.toLowerCase().split(' ');
      var dCity=dataCity[0];
      if(dataCity[1]){
        dCity=dataCity[0]+'+'+dataCity[1];
       
        }
        console.log(dCity,cName)
      if(dCity===cName){
        console.log(data[0].name)
      checkLocalStorage(data[0].name);
    
      //currentWeather(data[0].lat, data[0].lon);
      forecast(data[0].lat, data[0].lon);
      }
      else{
        $("#no-input").modal("show");
      }
      
    })
    .catch(function (error) {
      console.error(error);
      $("#no-input").modal("show");
    });
}

function forecast(lat,lon) {
  
  console.log(lat)
  var forecastURL ='https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=Imperial&appid=' + api_key;
  fetch(forecastURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {
      //displaySearchedCity(city);
      console.log(data);

      if (data.cod != 200) {
        $("#no-input").modal("show");
      } else {
       
        printCurrentResults(data)
        printForecastResults(data);
      }
    })
    .catch(function (error) {
      console.error(error);
      $("#no-input").modal("show");
    });
}
function displaySearchedCity(city) {
  var listEl = $("<li>" + city + "</li>");
  $(listEl).attr("class", "list-group-item");
  $(listEl).attr("data-value", city);
  listUlEl.append(listEl);
}
function printCurrentResults(result) {
  var list=result.list[0];
  //var date = new Date(list.dt * 1000).toLocaleDateString();
  var date=dayjs.unix(list.dt).format("MM/DD/YYYY");
  var img =
    "https://openweathermap.org/img/wn/" + list.weather[0].icon + "@2x.png";
  var icon = $("<img src=" + img + ">");
  icon.addClass("image-size");

  $("#current-city").html(result.city.name + " (" + date + ") ");
  $("#current-city").append(icon);

  // $("#temperature").html(
  //   ((list.main.temp - 273.15) * 1.8 + 32).toFixed(2) + " &#8457"
  // );
  $("#temperature").html((list.main.temp).toFixed(2) + " &#8457");

  $("#wind-speed").html((list.wind.speed * 2.237).toFixed(2) + " MPH");
  $("#humidity").html(list.main.humidity + " %");
}

function printForecastResults(result) {
  for (let i = 1; i <=5; i++) {
    var list=result.list[i*8-1];
    //var date = new Date((list.dt)* 1000).toLocaleDateString();
    var date=dayjs.unix(list.dt).format("MM/DD/YYYY");
    var img =
    "https://openweathermap.org/img/wn/" + list.weather[0].icon + "@2x.png";
  var icon = $("<img src=" + img + ">");
  icon.addClass("image-size");
//console.log(new Date((result.list[i].dt)* 1000).toLocaleDateString(),result.list[i].dt_txt)
    $("#future-day" + (i)).html(date);
    $("#icon-day" + (i)).html(icon);
   // $("#temp-day" + (i)).html(((list.main.temp - 273.15) * 1.8 + 32).toFixed(2) + " &#8457");
    $("#temp-day" + (i)).html((list.main.temp).toFixed(2) + " &#8457");
   
   $("#wind-day" + (i)).html((list.wind.speed * 2.237).toFixed(2) + " MPH");
    $("#humidity-day" + (i)).html(list.main.humidity + " %");

  }
}

function checkLocalStorage(city){ 

 if(cities===null){
  cities=[]; 
storeCities(city);
}
else{
for(var i=0;i<cities.length;i++){
  if(cities[i].toLowerCase()===city.toLowerCase()){
    return;
  }
}
storeCities(city);    

}
 
}
function storeCities(city){
  cities.unshift(city);  
  listUlEl.html("");
  localStorage.setItem('citiesLocal',JSON.stringify(cities));
  for (let i = 0; i < cities.length; i++) {
    displaySearchedCity(cities[i]);    
  }   
}
function runPastsearch(event){
  
var cityName= $(event.target).attr('data-value');

findLatAndLong(cityName);

}
searchFormEl.on("submit", handleSearchFormSubmit);
listUlEl.on('click','.list-group-item',runPastsearch)
function init(){
  cities= JSON.parse(localStorage.getItem('citiesLocal'));


  listUlEl.html("");
  if(cities!=null){
for (let i = 0; i < cities.length; i++) {
  displaySearchedCity(cities[i]);    
}   
  }
}
init();