#### Settings
There are two variables you need to define:
* The API key ```apikey``` that you get at [openweathermap.org](https://openweathermap.org/price). This service offers free access with a limit of 60 calls per minute.
* Time to store ```expire``` weather information in cookies. By saving information, you avoid unnecessary API calls.

#### Minified Script
```
	var apikey = 'KEY';
	var expire = 60;
	
	!function(e,t,a){function n(e,t,a){var n=new XMLHttpRequest;n.onreadystatechange=function(){n.readyState===XMLHttpRequest.DONE&&(200===n.status?t&&t(JSON.parse(n.responseText)):a&&a(n))},n.open('GET',e,!0),n.send()}function i(e,t,a){window.dataLayer=window.dataLayer||[],dataLayer.push({event:'weather',station:e,weather:t,temperature:a})}function o(o){n('https://api.openweathermap.org/data/2.5/find?lat='+o.ipgeo.latitude+'&lon='+o.ipgeo.longtitude+'&cnt=1&units='+t+'&appid='+e,function(e){!function(e){var t=e.list[0].name,n=e.list[0].weather[0].description,o=Math.round(e.list[0].main.temp);i(t,n,o);var r=new Date;r.setTime(r.getTime()+6e4*a),document.cookie='weather_current='+n+'; expires='+r.toGMTString()+'; path=/',document.cookie='weather_station='+t+'; expires='+r.toGMTString()+'; path=/',document.cookie='weather_temperature='+o+'; expires='+r.toGMTString()+'; path=/'}(e)})}if(navigator.cookieEnabled){var r=(document.cookie.match(/^(?:.*;)?\s*weather_current=\s*([^;]+)(?:.*)?$/)||[,null])[1],u=(document.cookie.match(/^(?:.*;)?\s*weather_temperature=\s*([^;]+)(?:.*)?$/)||[,null])[1],p=(document.cookie.match(/^(?:.*;)?\s*weather_station=\s*([^;]+)(?:.*)?$/)||[,null])[1];null!==r&&null!==u&&null!==p?i(p,r,u):n('https://apps.martinkaspar.net/api/geo/',function(e){o(e)})}}(apikey,'metric',expire);
```

#### DataLayer
The following information is sent to the data layer:

```
{
	event: 'weather',        // The name of the custom event
	station: 'Prague',       // The nearest place with weather information
	weather: 'Sky is clear', // Current weather information
	temperature: 30          // Current temperature in celsius
}
```
