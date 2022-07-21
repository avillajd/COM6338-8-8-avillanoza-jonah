// // API CALL for https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

// var weatherDiv = document.getElementById('weather-app')
// var form = document.querySelector('form')
// var input= document.querySelector('input')
// var weatherSection = document.getElementById ('weather')


// form.onsubmit = function(e){
//     e.preventDefault()
//     var userQuery = input.value.trim()
//     var URL = 'https://api.openweathermap.org/data/2.5/weather?q=' + userQuery + '&APPID=d516de008d281295fa4ddf339f86b8a0'
//     if (!userQuery) return
//     form.search.value = ""

//     fetch(URL)
//     .then (function(res){
//         return res.json()
//     }) 
    
//     .then(report)
//     .catch (function(err) {
//         var h2 = document.createElement('h2')
//         h2.textContent = "Location Not Found"
//         weatherSection.appendChild(h2)
//     } )
    
//    function report(report) {
//     e.preventDefault()
//     console.log(report)
//     weatherSection.innerHTML = ""
//     this.input.value = ""
//     var br = document.createElement('br')
//     var h2 = document.createElement('h2')
//     h2.textContent = report.name + ', ' + report.sys.country
//     weatherSection.appendChild(h2)

//     var map = document.createElement('a') // link to google maps.
//     var lat = report.coord.lat
//     var long = report.coord.lon
//     map.href = 'https://www.google.com/maps/search/?api=1&query=' + lat + "," + long
//     map.target = "__BLANK"
//     map.textContent = "Click to view map"
//     map.classList.add('map')
//     weatherSection.appendChild(map)

//     //Icon
//     var img = document.createElement('img')
//     var weatherIcon = report.weather[0].icon
//     img.src = 'https://openweathermap.org/img/wn/' + weatherIcon + '@2x.png'
//     img.classList.add('weatherIcon')
//     weatherSection.appendChild(img)
    
//     // Description
//     var descript = document.createElement('p')
//     var weatherDescript = report.weather[0].description
   
//     descript.textContent = "Currently: " + weatherDescript
//     descript.style.textTransform = 'capitilize'
//     descript.classList.add('descript')
//     weatherSection.appendChild(descript)

//     var br = document.createElement('br')
//     weatherSection.appendChild(br)

//     //actual Temp
//     var actualTemp = document.createElement('p')
//     var weatherActualTemp = report.main.temp
//     var realTemp = Math.floor(weatherActualTemp - 273.15)* 1.8000+ 32.00
//     actualTemp.textContent = "Current: " + realTemp + "\xB0F"
//     actualTemp.classList.add('actual_Temp')
//     weatherSection.appendChild(actualTemp)

// // Feels Like Temp
//     var fakeTemp = document.createElement('p')
//     var weatherFeelsTemp = report.main.feels_like
//     var feelsLike = Math.floor(weatherFeelsTemp - 273.15)* 1.8000+32.00
//     fakeTemp.textContent = "Feels Like: " + feelsLike + "\xB0F"
//     fakeTemp.classList.add('feels_like')
//     weatherSection.appendChild(fakeTemp)

//     // updated time
//     var br = document.createElement('br')
//     weatherSection.appendChild(br)

//     var updateTime = document.createElement('p')
//     var lastTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

//     updateTime.textContent = "Last Updated: " + lastTime
//     updateTime.classList.add('lastUpdated')
//     weatherSection.appendChild(updateTime)

//    }
// }

//capture ref to important DOM elements
var weatherContainer = document.getElementById('weather')
var formEl = document.querySelector('form')
var inputEl = document.querySelector('input')

formEl.onsubmit = function (e) {
    // prevent the page from refreshing
    e.preventDefault()

    //Capture user's input from form field
    var userInput = inputEl.value.trim()

    //Abort API call if the user enters no value
    if(!userInput) return

    //call the API and then update page
    getWeather(userInput)
        .then(displayWeatherInfo)
        .catch(displayLocNotFound)

    // reset form field to a blank state
    inputEl.value = ""
}

//Calls the OpenWeather API and return object of wether info
function getWeather(query){
    //default for US
    if(!query.includes(",")) query += ',us'

    //return the fetch call which returns a promise
    //allows us to call .then on this function
    return fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&units=imperial&APPID=d516de008d281295fa4ddf339f86b8a0'
    )
    .then(function(res){
        return res.json()
    })
    .then (function(data){
        // location is not found, throw error/reject promise
        if(data.cod === "404")throw new Error('location not found')

        //create weather icon
        var iconUrl = 'https://openweathermap.org/img/wn/' + 
        data.weather[0].icon +
        '@2x.png'

        var description = data.weather[0].description
        var actualTemp = data.main.temp
        var feelsLikeTemp = data.main.feels_like
        var place = data.name + ", " + data.sys.country

        //create JS date object from unix timestamp
        var updatedAt = new Date(data.dt *1000)

        //this object is used by displayWeatherInfro to update the HTML
        return{
            coords: data.coord.lat + "," + data.coord.lon,
            description : description,
            iconUrl : iconUrl,
            actualTemp: actualTemp,
            feelsLikeTemp: feelsLikeTemp,
            place: place,
            updatedAt: updatedAt
        }

    })
}

// Show error message when location isnt found
function displayLocNotFound(){
    //clear any previous weather info
    weatherContainer.innerHTML = "";

    //create a H2, add error message, and add to page
    var errMsg = document.createElement('h2')
    errMsg.textContent = "Location not found"
    weatherContainer.appendChild(errMsg)
}

//update Html to display weather info
function displayWeatherInfo(weatherObj){
    //clears any previous weather info
    weatherContainer.innerHTML = "";

    //inserting line break to weather section tag
    function addBreak(){
        weatherContainer.appendChild(
            document.createElement('br')
        )
    }

    //Weather location element
    var placeName= document.createElement('h2')
    placeName.textContent = weatherObj.place
    weatherContainer.appendChild(placeName)

    //Link element for location
    var whereLink = document.createElement('a')
    whereLink.textContent = "Click to view map"
    whereLink.href = "https://www.google.com/maps/search/?api=1&query=" + weatherObj.coords
    whereLink.target = "_BLANK"
    weatherContainer.appendChild(whereLink)

    //weatherIcon image
    var icon = document.createElement('img')
    icon.src = weatherObj.iconUrl
    weatherContainer.appendChild(icon)

    //weather description
    var description = document.createElement('p')
    description.textContent = weatherObj.description
    description.style.textTransform = 'capitalize'
    weatherContainer.appendChild(description)

    addBreak()

    //currentTemp
    var temp = document.createElement('p')
    temp.textContent = "Current: " + 
    weatherObj.actualTemp +
    "℉"
    weatherContainer.appendChild(temp)

    //feels like temperature
    var feelsLikeTemp = document.createElement('p')
    feelsLikeTemp.textContent = "Feels Like: " + 
    weatherObj.feelsLikeTemp + 
    "℉"
    weatherContainer.appendChild(feelsLikeTemp)

    addBreak()

    // time updated
    var updatedAt = document.createElement('p')
    updatedAt.textContent = "Last updated: " +
    weatherObj.updatedAt.toLocaleTimeString (
        'en-US',
        {
            hour: 'numeric', 
            minute: '2-digit'
        }
    )
    weatherContainer.appendChild(updatedAt)
}

