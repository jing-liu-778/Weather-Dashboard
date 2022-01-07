

var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");
var cities = [];

var formSumbitHandler = function(event){
    event.preventDefault();
    var city = cityInputEl.value.trim();
    
    if(city){
        getCityWeather(city);
        get5Day(city);
        // add city to the first of the array use cities.unshift(city); if add city to last element, use .push
        cities.push(city);
        // clear search 
        cityInputEl.value = "";
    } else{
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch(city);
    
}

// localStorage to save searched city name 
var saveSearch = function(){
    console.log(cities)
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city){
    
    var apiKey = "e36addb095cd1a4226fd1b654c7cadeb"
    // units=imperial set temperature in Fahrenheit and wind speed in miles/hour
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            console.log(data)
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather, searchCity){
   //clear old content
   weatherContainerEl.textContent= "";  
   citySearchInputEl.textContent=searchCity;

   console.log(weather);

   //create date element
   var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment().format("M/D/YYYY") + ") ";
   citySearchInputEl.appendChild(currentDate);

   //create an image element
   var weatherIcon = document.createElement("img")
   // get icon url 
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchInputEl.appendChild(weatherIcon);

   //create a span element to hold temperature data
   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   temperatureEl.classList = "list-group-item"
  
   //create a span element to hold Humidity data
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"

   //create a span element to hold Wind data
   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"

   //append to container
   weatherContainerEl.appendChild(temperatureEl);
   weatherContainerEl.appendChild(humidityEl);
   weatherContainerEl.appendChild(windSpeedEl);

   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
   getUvIndex(lat,lon)
}

// get uv index
var getUvIndex = function(lat,lon){
    
    var apiKey = "e36addb095cd1a4226fd1b654c7cadeb"
    // var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    var apiURL = `https://api.openweathermap.org/data/2.5/onecall?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
           console.log(data)
        });
    });
    
}
 
var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.current.uvi

    if(index.current.uvi <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.current.uvi >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.current.uvi >8){
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    //append index to current weather
    weatherContainerEl.appendChild(uvIndexEl);
}

var get5Day = function(cityName){
    
    var apiKey = "e36addb095cd1a4226fd1b654c7cadeb"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
           console.log(data)
        });
    });
};

var display5Day = function(weather){
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        //pick same time of each day 
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       console.log(dailyForecast)

       //create date element
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("M/D/YYYY");
       forecastDate.classList = "card-header text-right"
       forecastEl.appendChild(forecastDate);

       
       //create an image element
       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-right";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       //append to forecast card
       forecastEl.appendChild(weatherIcon);
       
       //create temperature span
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-right";
       forecastTempEl.textContent = "Temp: "+ dailyForecast.main.temp + " °F";

        //append to forecast card
        forecastEl.appendChild(forecastTempEl);

        // create windspead span 

        var forecastWindEl=document.createElement("span");
        forecastWindEl.classList = "card-body text-right";
        forecastWindEl.textContent = "Wind Speed: "+ dailyForecast.wind.speed + " MPH ";
 
         //append to forecast card
         forecastEl.appendChild(forecastWindEl);

         // create humidity span 
       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-right";
       forecastHumEl.textContent = "Humidity: " + dailyForecast.main.humidity + "  %";

       //append to forecast card
       forecastEl.appendChild(forecastHumEl);

        // console.log(forecastEl);
       //append to five day container
        forecastContainerEl.appendChild(forecastEl);
    }

}

var pastSearch = function(pastSearch){
 
    // console.log(pastSearch)
    var pastCities = JSON.parse(localStorage.getItem("cities"));
    console.log(pastCities)
    //clear search history 
    pastSearchButtonEl.innerHTML = "";
    for (i=0; i<pastCities.length; i++){

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastCities[i];
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastCities[i])
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearchEl);
    }
}


var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

// This function is being called below and will run when the page loads.
function init() {
  
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    
  
    
    if (storedCities !== null) {
        // set cities = storedCities, so when reload page, cities is not [], it will have data before reload. 
      cities = storedCities;
      
    }
     pastSearch()
     //getCityWeather();
     //get5Day();
 
  }

init()

cityFormEl.addEventListener("submit", formSumbitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);