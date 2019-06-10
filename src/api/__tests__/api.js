const { getTrips, getDriver, getVehicle } = require('../index');
const drivers = require('../data/drivers.json');
const vehicles = require('../data/vehicles.json');

describe('API', () => {
  test('getTrips return promise', async () => {
    expect(getTrips()).resolves.toBeInstanceOf(Array);
  });

  test('getTrips return data', async () => {
    const trips = await getTrips();

    expect(Array.isArray(trips)).toBe(true);
    expect(trips).toMatchSnapshot();
  });

  test('getDriver errors if ID is not provided or invalid', () => {
    expect(getDriver()).rejects.toBeInstanceOf(Error);
    expect(getDriver('wrong-id')).rejects.toBeInstanceOf(Error);
  });

  test('getVehicle errors if ID is not provided or invalid', () => {
    expect(getVehicle()).rejects.toBeInstanceOf(Error);
    expect(getVehicle('wrong-id')).rejects.toBeInstanceOf(Error);
  });

  test('getDriver returns valid data', async () => {
    const driverIDs = Object.keys(drivers);

    return Promise.all(
      driverIDs.map(driverID => {
        const driver = getDriver(driverID);

        return expect(driver).resolves.toMatchObject({
          vehicleID: expect.any(Array),
          name: expect.any(String),
          gender: expect.any(String),
          agent: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
          DOB: expect.any(String),
          address: expect.any(String)
        });
      })
    );
  });

  test('getVehicle returns valid data', async () => {
    const vehicleIDs = Object.keys(vehicles);

    return Promise.all(
      vehicleIDs.map(vehicleID => {
        const vehicle = getVehicle(vehicleID);

        return expect(vehicle).resolves.toMatchObject({
          manufacturer: expect.any(String),
          plate: expect.any(String),
          acquired: expect.any(String),
          acquiredNew: expect.any(Boolean)
        });
      })
    );
  });
});
