### Current weather for GTM
The script collects weather data for the current location of the visitor and sends it to the GTM data layer. 

#### settings
There are two variables you need to define:
* The API key that you get at [openweathermap.org](https://openweathermap.org/price). This service offers free access with a limit of 60 calls per minute.
* Time to store weather information in cookies. By saving information, you avoid unnecessary API calls.

#### minified script
```
var apikey = 'KEY'; // Your API key from https://openweathermap.org
var expire = 60;    // Time to store weather information in minutes

!function(t,e,a){function n(t,e,a){var n=new XMLHttpRequest;n.onreadystatechange=function(){n.readyState===XMLHttpRequest.DONE&&(200===n.status?e&&e(JSON.parse(n.responseText)):a&&a(n))},n.open('GET',t,!0),n.send()}function i(t,e,a,n){window.dataLayer=window.dataLayer||[],dataLayer.push({event:'weather',weather:{station:t,main:e,description:a,temperature:n}})}function o(o){n('https://api.openweathermap.org/data/2.5/find?lat='+o.ipgeo.latitude+'&lon='+o.ipgeo.longtitude+'&cnt=1&units='+e+'&appid='+t,function(t){!function(t){var e=t.list[0].name,n=t.list[0].weather[0].main,o=t.list[0].weather[0].description,r=Math.round(t.list[0].main.temp);i(e,n,o,r);var s=new Date;s.setTime(s.getTime()+6e4*a),document.cookie='gtm.weather.station='+e+'; expires='+s.toGMTString()+'; path=/',document.cookie='gtm.weather.main='+n+'; expires='+s.toGMTString()+'; path=/',document.cookie='gtm.weather.detail='+o+'; expires='+s.toGMTString()+'; path=/',document.cookie='gtm.weather.temperature='+r+'; expires='+s.toGMTString()+'; path=/'}(t)})}if(navigator.cookieEnabled){var r=(document.cookie.match(/^(?:.*;)?\s*gtm.weather.station=\s*([^;]+)(?:.*)?$/)||[,null])[1],s=(document.cookie.match(/^(?:.*;)?\s*gtm.weather.main=\s*([^;]+)(?:.*)?$/)||[,null])[1],m=(document.cookie.match(/^(?:.*;)?\s*gtm.weather.detail=\s*([^;]+)(?:.*)?$/)||[,null])[1],p=(document.cookie.match(/^(?:.*;)?\s*gtm.weather.temperature=\s*([^;]+)(?:.*)?$/)||[,null])[1];null!==r&&null!==s&&null!==m&&null!==p?i(r,s,m,p):n('https://apps.martinkaspar.net/api/geo/',function(t){o(t)})}}(apikey,'metric',expire);
```

#### dataLayer
The following information is sent to the data layer:

```
{
	event: 'weather',              // The name of the custom event
	weather: {
		station: 'Prague',           // The nearest place with weather information
		main: 'Clear',               // Grouped weather information (Clear, Cloudy, Rain, ...)
		description: 'Sky is clear', // Detailed weather information (Sky is clear, Light rain, Heavy rain, ...)
		temperature: 30              // Temperature in celsius
	}
}
```
