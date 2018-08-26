var apikey = 'KEY'; // Your API key from https://openweathermap.org
var expire = 60;    // Time to store weather information in minutes

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
	
	function pushWeather(st, gr, ds, tp) {
		window.dataLayer = window.dataLayer || [];
		dataLayer.push({
			event: 'weather',
			weather:{
				station: st,
				main: gr,
				decription: ds,
				temperature: tp
			}
		});
	}
	
	function setWeather(data) {
		var station = data.list[0].name;
		var main    = data.list[0].weather[0].main;
		var detail  = data.list[0].weather[0].description;
		var temp    = Math.round(data.list[0].main.temp);
		
		pushWeather(station, main, detail, temp);
		
		var date = new Date(); date.setTime(date.getTime() + (expire * 60000));
		document.cookie = 'gtm.weather.station=' + station + '; expires=' + date.toGMTString() + '; path=/';
		document.cookie = 'gtm.weather.main=' + main + '; expires=' + date.toGMTString() + '; path=/';
		document.cookie = 'gtm.weather.detail=' + detail + '; expires=' + date.toGMTString() + '; path=/';
		document.cookie = 'gtm.weather.temperature=' + temp + '; expires=' + date.toGMTString() + '; path=/';
	}
	
	function getWeather(lat, lon) {
		loadJSON('https://api.openweathermap.org/data/2.5/find?lat=' + lat + '&lon=' + lon + '&cnt=1&units=' + units + '&appid=' + api, function(data) { setWeather(data); });
	}
	
	function geoipPosition() {
		loadJSON('https://apps.martinkaspar.net/api/geo/', function(data) {
			getWeather(data.ipgeo.latitude, data.ipgeo.longtitude);
		});
	}
	
	function devicePosition() {
		navigator.geolocation.getCurrentPosition(function(position) {
			getWeather(position.coords.latitude, position.coords.longitude);
		}, function() {
			geoipPosition();
		});
	}
	
	function currentWeather() {
		if (navigator.geolocation) {
			devicePosition();
		} else {
			geoipPosition();
		}
	}
	
	if (navigator.cookieEnabled) {
		var station = (document.cookie.match(/^(?:.*;)?\s*gtm.weather.station=\s*([^;]+)(?:.*)?$/)||[,null])[1];
		var main    = (document.cookie.match(/^(?:.*;)?\s*gtm.weather.main=\s*([^;]+)(?:.*)?$/)||[,null])[1];
		var detail  = (document.cookie.match(/^(?:.*;)?\s*gtm.weather.detail=\s*([^;]+)(?:.*)?$/)||[,null])[1];
		var temp    = (document.cookie.match(/^(?:.*;)?\s*gtm.weather.temperature=\s*([^;]+)(?:.*)?$/)||[,null])[1];
		
		if (station !== null && main !== null && detail !== null && temp !== null) {
			pushWeather(station, main, detail, temp);
		} else {
			currentWeather();
		}
	}
	
})(apikey, 'metric', expire);
