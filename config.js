/*
	Configuration File
	Please do not touch if you don't understand
*/	

// Version of the API
VERSION = "1.0.0";

// In which port should run the API 
PORT_API = process.env.PORT_API || 3030;

// Variable that returns if the system is in production or not
ENVIRONMENT = process.env.ENVIRONMENT || "development";

// Configuration object
CONFIG = {
	darksky_api_key: process.env.DARKSKY_API_KEY || "8c4bfd5ec1f505310c46f7402009614e"
}
