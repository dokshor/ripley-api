const City = require('../models/city');
var redis = require('redis'), redis_client = redis.createClient();


test('Storing cities', () => {
    // We create cities
    redis_client.set("api.cities", JSON.stringify(City.findAll()));    
    redis_client.quit();
});