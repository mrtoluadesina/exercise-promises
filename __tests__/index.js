const { analysis, driverReport } = require('../src/index');

describe('analysis spec', () => {
  test('matches the required data format', async () => {
    const data = await analysis();

    expect(data).toEqual({
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

  test('analysis solution', async () => {
    const data = await analysis();

    expect(data).toMatchObject({
      noOfCashTrips: 26,
      noOfNonCashTrips: 24,
      billedTotal: 128224.69,
      cashBilledTotal: 69043.8,
      nonCashBilledTotal: 59180.89
    });
  });
});

describe('driver report array to have length of drivers Api with correct ID', () => {
  test('expects this to return 9', async () => {
    let result = await driverReport();
    expect(result).toHaveLength(9);
  });
});

describe('driver report to be defined', () => {
  test('expects driverReport to be defined', async () => {
    await expect(driverReport).toBeDefined();
  });
});

describe('driverReport spec', () => {
  test('matches the required data format', async () => {
    const data = await driverReport();

    expect(data).toContainEqual({
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

  test('driverReport solution', async () => {
    const data = await driverReport();
    expect(data).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fullName: 'Kate Carpenter',
        id: '3539a692-69b6-4b24-89fc-f8b505a1eecd',
        phone: '+234 809-435-9539',
        noOfTrips: 1,
        noOfVehicles: 2,
      })
    ]));
  });
});

describe('My own tests go here - I should update this description', () => {
  test('something', () => {
    expect(true).toEqual(true);
  });
});
