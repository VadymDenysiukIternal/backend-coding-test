import * as sql from 'sql';

sql.setDialect('sqlite');
export const rides = sql.define({
  name: 'Rides',
  // @ts-ignore
  columns: ['rideID', 'startLat', 'startLong', 'endLat', 'endLong', 'riderName', 'driverName', 'driverVehicle'],
});
