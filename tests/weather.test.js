const CONFIG = require('../config');
const Weather = require('../models/weather');
var redis = require('redis'), redis_client = redis.createClient();


test('Sincronize cities', () => {
    Weather.sincronize(redis_client, (results) => {
        redis_client.quit(); 
        expect(results.length).toBe(6);        
    })
});
