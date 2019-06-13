const { analysis, driverReport } = require('../src/index');

describe('analysis spec', () => {
  test('matches the required data format', () => {
    return expect(analysis()).resolves.toEqual({
      noOfCashTrips: expect.any(Number),
      noOfNonCashTrips: expect.any(Number),
      billedTotal: expect.any(Number),
      cashBilledTotal: expect.any(Number),
      nonCashBilledTotal: expect.any(Number),
      noOfDriversWithMoreThanOneVehicle: expect.any(Number),
      mostTripsByDriver: {
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        noOfTrips: expect.any(Number),
        totalAmountEarned: expect.any(Number)
      },
      highestEarningDriver: {
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        noOfTrips: expect.any(Number),
        totalAmountEarned: expect.any(Number)
      }
    });
  });

  test('analysis solution', () => {
    return expect(analysis()).resolves.toEqual({
      noOfCashTrips: 26,
      noOfNonCashTrips: 24,
      billedTotal: 128224.69,
      cashBilledTotal: 69043.8,
      nonCashBilledTotal: 59180.89,
      noOfDriversWithMoreThanOneVehicle: 3,
      mostTripsByDriver: {
        name: 'Bush Gibbs',
        email: 'bushgibbs@example.com',
        phone: '+234 808-204-2520',
        noOfTrips: 7,
        totalAmountEarned: 17656.46
      },
      highestEarningDriver: {
        name: 'Hughes Strickland',
        email: 'hughesstrickland@example.com',
        phone: '+234 808-084-4833',
        noOfTrips: 7,
        totalAmountEarned: 24508.77
      }
    });
  });
});


describe('driver report array to have length of drivers Api with correct ID', () => {
  test('expects this to return 9', () => {
    return expect(driverReport()).resolves.toHaveLength(9);
  });
});

describe('driver report to be defined', () => {
  test('expects driverReport to be defined', () => {
    return expect(driverReport()).resolves.toBeDefined();
  });
});

describe('driverReport spec', () => {
  test('matches the required data format', () => {
    return expect(driverReport()).resolves.toContainEqual({
      fullName: expect.any(String),
      id: expect.any(String),
      phone: expect.any(String),
      noOfTrips: expect.any(Number),
      noOfVehicles: expect.any(Number),
      vehicles: expect.any(Array),
      noOfCashTrips: expect.any(Number),
      noOfNonCashTrips: expect.any(Number),
      totalAmountEarned: expect.any(Number),
      totalCashAmount: expect.any(Number),
      totalNonCashAmount: expect.any(Number),
      trips: expect.any(Array)
    });
  });

  test('driverReport solution', () => {
    return expect(driverReport()).resolves.toEqual(expect.arrayContaining([
      expect.objectContaining({
        fullName: 'Kate Carpenter',
        id: '3539a692-69b6-4b24-89fc-f8b505a1eecd',
        phone: '+234 809-435-9539',
        noOfTrips: 1,
        noOfVehicles: 2,
        noOfCashTrips: 0,
        noOfNonCashTrips: 1,
        totalAmountEarned: 4516.75,
        totalCashAmount: 0,
        totalNonCashAmount: 4516.75,
      })
    ]));
  });
});

describe('My own tests go here - I should update this description', () => {
  test('something', () => {
    expect(true).toEqual(true);
  });
});
