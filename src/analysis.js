const { getTrips, getDriver } = require('./api/index');
/**
 * This function should return the trip data analysis
 * Don't forget to write tests
 *
 * @returns {any} Trip data analysis
 */
async function analysis() {
  const totalTrips = await getTrips();
  const uniqueDriverID = new Set();
  const drivers = new Map();

  // Get the total Number of cash Trips and also total cash billed
  let noOfCashTrips = 0;
  let cashBilledTotal = 0;
  totalTrips.forEach(trips => {
    if (trips.isCash) {
      noOfCashTrips++;
      cashBilledTotal += Number(String(trips.billedAmount).replace(/,/g, ''));
    }
    uniqueDriverID.add(trips.driverID);
    if (!drivers.has(trips.driverID)) {
      drivers.set(trips.driverID, {
        noOfTrips: 1,
        earnings: Number(String(trips.billedAmount).replace(/,/g, ''))
      });
    } else {
      let { noOfTrips, earnings } = drivers.get(trips.driverID);
      noOfTrips++;
      earnings += Number(String(trips.billedAmount).replace(/,/g, ''));
      drivers.set(trips.driverID, { noOfTrips, earnings });
    }
  });

  // get the total number of non cash trips by subtracting cash trips from total
  let noOfNonCashTrips = totalTrips.length - noOfCashTrips;

  // get the total billed trips
  let billedTotal = totalTrips.reduce((total, trip) => {
    return total + Number(String(trip["billedAmount"]).replace(/,/g, ''));
  }, 0);

  // get total non cash billed total
  let nonCashBilledTotal = Number(billedTotal.toFixed(2)) - cashBilledTotal;

  //get driver information
  const driverIDs = [...drivers.keys()];

  const driverPromises = driverIDs.map(async driverID => {
    try {
      const data = await getDriver(driverID);
      
      return {
        ...data,
        driverID
      };
    } catch {
      return;
    }
  });

  const driversData = await Promise.all(driverPromises);

  const noOfDriversWithMoreThanOneVehicle = driversData.filter(driver => {
    return driver && driver.vehicleID.length > 1;
  }).length;

  // get the most trips by a driver
  const driverArray = [...drivers];
  mostTripsDriver = driverArray.sort((a, b) => b[1].noOfTrips - a[1].noOfTrips);
  var { name, email, phone } = await getDriver(mostTripsDriver[0][0]);
  const mostTripsByDriver = {
    name: name,
    email: email,
    phone: phone,
    noOfTrips: mostTripsDriver[0][1].noOfTrips,
    totalAmountEarned: mostTripsDriver[0][1].earnings
  };

  // get the most paid driver
  mostPaidDriver = driverArray.sort((a, b) => b[1].earnings - a[1].earnings);
  var { name, email, phone } = await getDriver(mostPaidDriver[0][0]);
  const highestEarningDriver = {
    name: name,
    email: email,
    phone: phone,
    noOfTrips: mostPaidDriver[0][1].noOfTrips,
    totalAmountEarned: mostPaidDriver[0][1].earnings
  };

  return {
    noOfCashTrips: noOfCashTrips,
    noOfNonCashTrips: noOfNonCashTrips,
    billedTotal: Number(billedTotal.toFixed(2)),
    cashBilledTotal: cashBilledTotal,
    nonCashBilledTotal: nonCashBilledTotal,
    noOfDriversWithMoreThanOneVehicle: noOfDriversWithMoreThanOneVehicle,
    mostTripsByDriver: mostTripsByDriver,
    highestEarningDriver: highestEarningDriver
  };
}

module.exports = analysis;