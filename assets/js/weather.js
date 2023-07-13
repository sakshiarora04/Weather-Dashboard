const api_key= "07c5e8b856efae69ae7aa9535bc97f0c";
var searchFormEl=$('#search-form')
var searchInputEl=$('#search-city');
var searchButtonEl= $('#search-button');
var listUlEl= $(".list-group");

function handleSearchFormSubmit(event){
event.preventDefault();
if(!searchInputEl.val().trim()){    
    $('#no-input').modal('show');   
    return;
}

findLatAndLong(searchInputEl.val().trim());
}
function findLatAndLong(city){
var cityQueryUrl="http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=5&appid="+api_key;
fetch(cityQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {
      //displaySearchedCity(city);
      currentWeather(data[0].lat,data[0].lon);
       

      if (!data.length) {        
       listUlEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        listUlEl.textContent = '';
        for (var i = 0; i < data.length; i++) {
          //printResults(data.results[i]);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}
function currentWeather(lat,lon){
    var currentWeatherURL= "https://api.openweathermap.org/data/2.5/weather?lat="+ lat+"&lon="+lon+"&appid="+api_key;
    fetch(currentWeatherURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {
      //displaySearchedCity(city);
      printResults(data);
       

      if (!data.length) {        
       listUlEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        listUlEl.textContent = '';
        for (var i = 0; i < data.length; i++) {
          //printResults(data.results[i]);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}
function displaySearchedCity(city){
    var listEl= $("<li>"+city.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",city.toUpperCase());
    listUlEl.append(listEl);
}
function printResults(result){
  var date=new Date(result.dt*1000).toLocaleDateString();
  console.log(result.name,result.main.temp,result.wind,result.main.humidity,date)
}
searchFormEl.on('submit', handleSearchFormSubmit);