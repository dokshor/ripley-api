const City = require('../models/city');

test('findAll cities', () => {
  expect(City.findAll().length).toBe(6);
});

test('findNameByLatLng to find Santiago', () => {
    expect(City.findNameByLatLng(-33.448891, -70.669266)).toBe("Santiago");
});

test('findNameByLatLng to find Georgia', () => {
    expect(City.findNameByLatLng(32.165623, -82.900078)).toBe("Georgia");
});

test('findNameByLatLng to find a non existent city', () => {
    expect(City.findNameByLatLng(0, 0)).toBe(false);
});