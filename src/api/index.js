const drivers = require('./data/drivers.json');
const trips = require('./data/trips.json');
const vehicles = require('./data/vehicles.json');

async function sleep(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}

const frozenTrips = Object.freeze(trips);

module.exports.getTrips = async function getTrips() {
  await sleep(Math.random());

  return frozenTrips;
};

module.exports.getDriver = async function getDriver(driverID) {
  await sleep(Math.random());

  const driver = drivers[driverID];

  if (!driver) {
    throw new Error('Driver not found');
  }

  return driver;
};

module.exports.getVehicle = async function getVehicle(vehicleID) {
  await sleep(Math.random());

  const vehicle = vehicles[vehicleID];

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  return vehicle;
};
