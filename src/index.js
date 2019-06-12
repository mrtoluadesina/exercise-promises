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
/**
 * This function should return the data for drivers in the specified format
 * Don't forget to write tests
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  const uniqueDriverID = new Set();
  const driverDetails = new Map();
  const allTrips = await getTrips();

  allTrips.forEach(trip => {
    uniqueDriverID.add(trip.driverID);
    
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
          totalCashAmount: Number(String(trip.billedAmount).replace(/,/g, '')),
          totalNonCashAmount: 0,
          trips: [obj]
        });
      } else {
        driverDetails.set(trip.driverID, {
          noOfCashTrips: 0,
          noOfNonCashTrips: 1,
          totalCashAmount: 0,
          totalNonCashAmount: Number(
            String(trip.billedAmount).replace(/,/g, '')
          ),
          trips: [obj]
        });
      }

    } else {
      let {
        noOfCashTrips,
        noOfNonCashTrips,
        totalCashAmount,
        totalNonCashAmount,
        trips
      } = driverDetails.get(trip.driverID);

      if (trip.isCash) {
        noOfCashTrips++;
        totalCashAmount += Number(String(trip.billedAmount).replace(/,/g, ''));

        trips.push(obj);
        
        driverDetails.set(trip.driverID, {
          noOfCashTrips,
          noOfNonCashTrips,
          totalCashAmount,
          totalNonCashAmount,
          trips
        });
      } else {
        noOfNonCashTrips++;
        totalNonCashAmount += Number(
          String(trip.billedAmount).replace(/,/g, '')
        );
        trips.push(obj);
        driverDetails.set(trip.driverID, {
          noOfCashTrips,
          noOfNonCashTrips,
          totalCashAmount,
          totalNonCashAmount,
          trips
        });
      }
    }
  });

  const driverArray = [...driverDetails]
  
  const driverPromises = driverArray.map(async key => {

    let index = key[0];
    let value = key[1];

    try {
      let { name, phone, vehicleID } = await getDriver(index);
      
      return {
        ...key[1],
        fullName: name,
        phone, 
        vehicleID,
        vehicles: [],
        noOfTrips: value.noOfCashTrips + value.noOfNonCashTrips,
        noOfVehicles: vehicleID.length,
        totalAmountEarned: Number(value.totalCashAmount.toFixed(2)) + Number(value.totalNonCashAmount.toFixed(2)),
        id: index
      }
    } catch (err) {
      return;
    }
  });

  const driverData = await Promise.all(driverPromises);

  const filteredDriver = driverData.filter(driver => driver !== undefined)

  const filteredMap = new Map();

  let arrayVehicle = []

  filteredDriver.map(driver => {
    filteredMap.set(driver.id, driver);
    return driver.vehicleID.map(vehicle => {
      arrayVehicle.push({vehicle, driverID: driver.id});
    })
  })

  const vehicleArrayPromises = arrayVehicle.map(async vehicle => {
    try {
      let { plate, manufacturer } = await getVehicle(vehicle.vehicle);

      return {
        plate,
        manufacturer,
        driverID: vehicle.driverID
      }
    } catch {}
  })

  const vehicleArrayResolved = await Promise.all(vehicleArrayPromises);

  vehicleArrayResolved.map(res => {
    const { vehicles } = filteredMap.get(res.driverID);
    delete filteredMap.get(res.driverID).vehicleID;
    vehicles.push({ plate: res.plate, manufacturer: res.manufacturer })
    filteredMap.set(res.driverID, {...filteredMap.get(res.driverID), vehicles}); 
  })



  return report;
}
module.exports = { analysis, driverReport };
