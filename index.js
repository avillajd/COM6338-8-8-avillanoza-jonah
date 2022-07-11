// API CALL for https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

var weatherDiv = document.getElementById('weather-app')
var form = document.querySelector('form')
var input= document.querySelector('input')
var weatherSection = document.getElementById ('weather')


form.onsubmit = function(e){
    e.preventDefault()
    var userQuery = input.value
    var URL = 'https://api.openweathermap.org/data/2.5/weather?q=' + userQuery + '&APPID=d516de008d281295fa4ddf339f86b8a0'
    if (!userQuery) return
    form.search.value = ""

    fetch(URL)
    .then (function(res){
        return res.json()
    }) 
    
    .then(report)
    .catch (function(err) {
        var h2 = document.createElement('h2')
        h2.textContent = "Location Not Found"
        weatherSection.appendChild(h2)
    } )
   function report(report) {
    e.preventDefault()
    console.log(report)
    weatherSection.innerHTML = ""
    this.input.value = ""
    var br = document.createElement('br')
    var h2 = document.createElement('h2')
    h2.textContent = report.name + ', ' + report.sys.country
    weatherSection.appendChild(h2)

    var map = document.createElement('a') // link to google maps.
    var lat = report.coord.lat
    var long = report.coord.lon
    map.href = 'https://www.google.com/maps/search/?api=1&query=' + lat + "," + long
    map.target = "__BLANK"
    map.textContent = "Click to view map"
    map.classList.add('map')
    weatherSection.appendChild(map)

    //Icon
    var img = document.createElement('img')
    var weatherIcon = report.weather[0].icon
    img.src = 'https://openweathermap.org/img/wn/' + weatherIcon + '@2x.png'
    img.classList.add('weatherIcon')
    weatherSection.appendChild(img)
    
    // Description
    var descript = document.createElement('p')
    var weatherDescript = report.weather[0].description
   
    descript.textContent = "Currently: " + weatherDescript
    descript.style.textTransform = 'capitilize'
    descript.classList.add('descript')
    weatherSection.appendChild(descript)

    var br = document.createElement('br')
    weatherSection.appendChild(br)

    //actual Temp
    var actualTemp = document.createElement('p')
    var weatherActualTemp = report.main.temp
    var realTemp = Math.floor(weatherActualTemp - 273.15)* 1.8000+ 32.00
    actualTemp.textContent = "Current: " + realTemp + "\xB0F"
    actualTemp.classList.add('actual_Temp')
    weatherSection.appendChild(actualTemp)

// Feels Like Temp
    var fakeTemp = document.createElement('p')
    var weatherFeelsTemp = report.main.feels_like
    var feelsLike = Math.floor(weatherFeelsTemp - 273.15)* 1.8000+32.00
    fakeTemp.textContent = "Feels Like: " + feelsLike + "\xB0F"
    fakeTemp.classList.add('feels_like')
    weatherSection.appendChild(fakeTemp)

    // updated time
    var br = document.createElement('br')
    weatherSection.appendChild(br)

    var updateTime = document.createElement('p')
    var lastTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    updateTime.textContent = "Last Updated: " + lastTime
    updateTime.classList.add('lastUpdated')
    weatherSection.appendChild(updateTime)

   }
}



