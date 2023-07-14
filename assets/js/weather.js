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
var input=searchInputEl.val().trim();

findLatAndLong(input);
searchInputEl.val("");
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
     
      printCurrentResults(data);
      forecast(data.id);
       

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
function printCurrentResults(result){
  var date=new Date(result.dt*1000).toLocaleDateString();
  var img="https://openweathermap.org/img/wn/"+result.weather[0].icon+"@2x.png"
  var icon=$("<img src="+ img+ ">");
  icon.addClass('image-size');
 
  $('#current-city').html(result.name + " ("+date+") ");
  $('#current-city').append(icon);

  $('#temperature').html(((result.main.temp-273.15)*1.8+32).toFixed(2)+" &#8457");
  
  $('#wind-speed').html(((result.wind.speed)*2.237).toFixed(2)+" MPH");
  $('#humidity').html(result.main.humidity+" %");
   
}
function forecast(cityId){
  var forecastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&appid="+api_key;
  fetch(forecastURL)
  .then(function (response) {
    if (!response.ok) {
      throw response.json();
    }

    return response.json();
  })
  .then(function (data) {
    //displaySearchedCity(city);
    console.log(data)   
     

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
searchFormEl.on('submit', handleSearchFormSubmit);