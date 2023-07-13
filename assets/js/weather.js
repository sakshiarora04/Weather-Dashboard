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
       console.log(data[0].lat);

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
    console.log(lat,lon)
}
function displaySearchedCity(city){
    var listEl= $("<li>"+city.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",city.toUpperCase());
    listUlEl.append(listEl);
}
searchFormEl.on('submit', handleSearchFormSubmit);