var apikey = 'KEY'; // Your API key from https://openweathermap.org/
var expire = 60; // Time to store weather information in minutes

(function(api, units, expire) {
	
	function loadJSON(path, success, error) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					if (success) success(JSON.parse(xhr.responseText));
				} else {
					if (error) error(xhr);
				}
			}
		}
		
		xhr.open('GET', path, true);
		xhr.send();
	}
	
	function pushWeather(station, weather, temp) {
		window.dataLayer = window.dataLayer || [];
		dataLayer.push({
			event: 'weather',
			station: station,
			weather: weather,
			temperature: temp
		});
	}
	
	function setWeather(data) {
		var station = data.list[0].name;
		var weather = data.list[0].weather[0].description;
		var temp = Math.round(data.list[0].main.temp);
		
		pushWeather(station, weather, temp);
		
		var date = new Date();
		date.setTime(date.getTime() + (expire * 60000));
		document.cookie = 'weather_station=' + station + '; expires=' + date.toGMTString() + '; path=/';
		document.cookie = 'weather_current=' + weather + '; expires=' + date.toGMTString() + '; path=/';
		document.cookie = 'weather_temperature=' + temp + '; expires=' + date.toGMTString() + '; path=/';
	}
	
	function getWeather(data) {
		var lat = data.ipgeo.latitude;
		var lon = data.ipgeo.longtitude;
		
		loadJSON('https://api.openweathermap.org/data/2.5/find?lat=' + lat + '&lon=' + lon + '&cnt=1&units=' + units + '&appid=' + api, function(data) { setWeather(data); });
	}
	
	function currentWeather() {
		loadJSON('https://apps.martinkaspar.net/api/geo/', function(data) { getWeather(data); });
	}
	
	if (navigator.cookieEnabled) {
		var station = (document.cookie.match(/^(?:.*;)?\s*weather_station=\s*([^;]+)(?:.*)?$/)||[,null])[1];
		var weather = (document.cookie.match(/^(?:.*;)?\s*weather_current=\s*([^;]+)(?:.*)?$/)||[,null])[1];
		var temp    = (document.cookie.match(/^(?:.*;)?\s*weather_temperature=\s*([^;]+)(?:.*)?$/)||[,null])[1];
		
		if (weather !== null && temp !== null && station !== null) {
			pushWeather(station, weather, temp);
		} else {
			currentWeather();
		}
	}
	
})(apikey, 'metric', expire);
