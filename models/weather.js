/*
    model: Weather
    persistence: Doesn't have
    author: Fabian Ramirez
*/
const City = require("./city");
const fetch = require("node-fetch");
const moment = require('moment-timezone');

const Weather = {
    
    API_URL: "https://api.darksky.net/forecast/" + CONFIG.darksky_api_key + "/{lat},{lng}",

    sincronize: (redis_client, callback) => {
        var forecasts = new Array();
        var urls = new Array();
        var _this = this;
        var seconds_cache_lives = 60*60*1;
    
        redis_client.get('api.cities', function(err, cities) {
            var cities = JSON.parse(cities);
            for(var i =0;i < cities.length; i++) {
                urls.push(Weather.API_URL.replace("{lat}", cities[i].coordinates.lat).replace("{lng}", cities[i].coordinates.lng));
            }

            Promise.all(urls.map(url=>fetch(url))).then(responses =>
                Promise.all(responses.map((res) => { 
                    return res.json(); 
                }))
            ).then(forecasts => {
                var results = new Array();
                for(var i in forecasts) {
                    results.push(Weather.formatForRedis(forecasts[i]));
                }
                if(results.length > 0) {
                    redis_client.set("api.forecasts", JSON.stringify(results), 'EX', seconds_cache_lives);
                }
                if(callback) {
                    return callback(results);
                } else {
                    return results;
                }
            });
        });
    },
    emit_to_socket: (redis_client, socket) => {
        redis_client.get('api.forecasts', (err, forecasts) => {
            if(forecasts) {
                socket.emit('forecast', JSON.stringify({ success: true, timestamp: moment().utc(), forecasts: JSON.parse(forecasts) }));
            } else {
                Weather.sincronize(redis_client, (forecasts) => {
                    socket.emit('forecast', JSON.stringify({ success: true, timestamp: moment().utc(), forecasts: forecasts }));
                });
            }
        });
    },
    formatForRedis: (forecast) => {
        var obj_formated = new Object();
        obj_formated = {
            name: City.findNameByLatLng(forecast.latitude, forecast.longitude),
            timezone: forecast.timezone,
            icon: forecast.currently.icon,
            temperature: {
                fahrenheit: forecast.currently.temperature,
                celcius: (forecast.currently.temperature - 32) * 5 / 9
            }
        }

        return obj_formated;
    }
};

module.exports = Weather;