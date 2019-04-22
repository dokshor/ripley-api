/*
    model: City
    persistence: Doesn't have
    author: Fabian Ramirez
*/
const City = {
    findNameByLatLng: (lat, lng) => {
        try {
            return City.findAll().find(function(city) {
                return city.coordinates.lat == lat & city.coordinates.lng == lng;
            }).name;
        } catch(e) {
            return false;
        }
    },
    findAll: () => {
        return [
            { 
                name: "Santiago",
                coordinates: {
                    lat: -33.448891,
                    lng: -70.669266
                }
            },
            {
                name: "Zurich",
                coordinates: {
                    lat: 47.376888,
                    lng: 8.541694
                }
            },
            {
                name: "Auckland",
                coordinates: {
                    lat: -36.848461,
                    lng: 174.763336
                }
            },
            {
                name: "Sydney",
                coordinates: {
                    lat: -33.868820,
                    lng: 151.209290
                }
            },
            {
                name: "Londres",
                coordinates: {
                    lat: 51.507351,
                    lng: -0.127758
                }
            },
            {
                name: "Georgia",
                coordinates: {
                    lat: 32.165623,
                    lng: -82.900078
                }
            }
        ];
    }
};

module.exports = City;