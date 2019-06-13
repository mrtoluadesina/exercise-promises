const { getTrips, getDriver, getVehicle } = require('./api/index');
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

  const report = [...filteredMap.values()];

  return report;
}
module.exports = driverReport;