const { getTrips, getDriver, getVehicle } = require("./api/index");
// console.log(getDriver("7ba0dce0-1de3-4971-82e0-a10acce52dd2"));
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
      cashBilledTotal += Number(String(trips.billedAmount).replace(/,/g, ""));
    }
    uniqueDriverID.add(trips.driverID);
    if (!drivers.has(trips.driverID)) {
      drivers.set(trips.driverID, {
        noOfTrips: 1,
        earnings: Number(String(trips.billedAmount).replace(/,/g, ""))
      });
    } else {
      let { noOfTrips, earnings } = drivers.get(trips.driverID);
      noOfTrips++;
      earnings += Number(String(trips.billedAmount).replace(/,/g, ""));
      drivers.set(trips.driverID, { noOfTrips, earnings });
    }
  });

  // get the total number of non cash trips by subtracting cash trips from total
  let noOfNonCashTrips = totalTrips.length - noOfCashTrips;

  // get the total billed trips
  let billedTotal = totalTrips.reduce((total, trip) => {
    return total + Number(String(trip["billedAmount"]).replace(/,/g, ""));
  }, 0);

  // get total non cash billed total
  let nonCashBilledTotal = Number(billedTotal.toFixed(2)) - cashBilledTotal;

  // get number of drivers with more than one vehicle
  let count = 0;
  try {
    for (let driver of uniqueDriverID.values()) {
      const driverData = await getDriver(driver);
      if (driverData.vehicleID.length > 1) count++;
    }
  } catch (error) {}

  let noOfDriversWithMoreThanOneVehicle = count;

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
/**
 * This function should return the data for drivers in the specified format
 * Don't forget to write tests
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  const report = [];
  const uniqueDriverID = new Set();
  const driverDetails = new Map();
  const allTrips = await getTrips();
  allTrips.forEach(trip => {
    uniqueDriverID.add(allTrips.driverID);
    const obj = {
      user: trip.user.name,
      created: trip.created,
      pickup: trip.pickup.address,
      destination: trip.destination.address,
      billed: trip.billedAmount,
      isCash: trip.isCash
    };
    if (!driverDetails.has(trip.driverID)) {
      if (trip.isCash) {
        driverDetails.set(trip.driverID, {
          noOfCashTrips: 1,
          noOfNonCashTrips: 0,
          cashAmountEarned: Number(String(trip.billedAmount).replace(/,/g, "")),
          nonCashAmountEarned: 0,
          trips: [obj]
        });
      } else {
        driverDetails.set(trip.driverID, {
          noOfCashTrips: 0,
          noOfNonCashTrips: 1,
          cashAmountEarned: 0,
          nonCashAmountEarned: Number(
            String(trip.billedAmount).replace(/,/g, "")
          ),
          trips: [obj]
        });
      }
    } else {
      let {
        noOfCashTrips,
        noOfNonCashTrips,
        cashAmountEarned,
        nonCashAmountEarned,
        trips
      } = driverDetails.get(trip.driverID);
      if (trip.isCash) {
        noOfCashTrips++;
        cashAmountEarned += Number(String(trip.billedAmount).replace(/,/g, ""));
        trips.push(obj);
        driverDetails.set(trip.driverID, {
          noOfCashTrips,
          noOfNonCashTrips,
          cashAmountEarned,
          nonCashAmountEarned,
          trips
        });
      } else {
        noOfNonCashTrips++;
        nonCashAmountEarned += Number(
          String(trip.billedAmount).replace(/,/g, "")
        );
        trips.push(obj);
        driverDetails.set(trip.driverID, {
          noOfCashTrips,
          noOfNonCashTrips,
          cashAmountEarned,
          nonCashAmountEarned,
          trips
        });
      }
    }
  });

  try {
    for (let [key, value] of driverDetails) {
      const { name, phone, vehicleID } = await getDriver(key);
      const vehicleDetails = [];
      for (let id of vehicleID) {
        const { plate, manufacturer } = await getVehicle(id);
        const details = {
          plate: plate,
          manufacturer: manufacturer
        };
        vehicleDetails.push(details);
      }

      //Structure Output
      const driver = {};
      driver.fullName = name;
      driver.id = key;
      driver.phone = phone;
      driver.noOfTrips = value.noOfCashTrips + value.noOfNonCashTrips;
      driver.noOfVehicles = vehicleID.length;
      driver.vehicles = vehicleDetails;
      driver.noOfCashTrips = value.noOfCashTrips;
      driver.noOfNonCashTrips = value.noOfNonCashTrips;
      driver.totalAmountEarned =
        Number(value.cashAmountEarned.toFixed(2)) +
        Number(value.nonCashAmountEarned.toFixed(2));
      driver.totalCashAmount = Number(value.cashAmountEarned.toFixed(2));
      driver.totalNonCashAmount = Number(value.nonCashAmountEarned.toFixed(2));
      driver.trips = value.trips;

      //push into report
      report.push(driver);
    }
  } catch (err) {}

  // console.log(report);
  return report;
}
driverReport();
module.exports = { analysis, driverReport };
