import { dbAllAsync } from '../db';
import { Logger } from '../utils/logger';
import { rides } from '../rides.model';

export const createRides = async (req) => {
  const values = [
    req.body.start_lat,
    req.body.start_long,
    req.body.end_lat,
    req.body.end_long,
    req.body.rider_name,
    req.body.driver_name,
    req.body.driver_vehicle,
  ];

  try {
    const insertQuery =
      'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await dbAllAsync(insertQuery, values);
    const query = rides.select(rides.star()).from(rides).order('rideID DESC').limit(1).toQuery().text;
    return await dbAllAsync(query);
  } catch (err) {
    Logger.error(err);
    throw err;
  }
};

export const getAllRides = async () => {
  try {
    const query = rides.select(rides.star()).from(rides).toQuery().text;
    return await dbAllAsync(query);
  } catch (err) {
    Logger.error(err);
    throw err;
  }
};

export const getRidesById = async (id: number) => {
  try {
    const query = rides.select(rides.star()).from(rides).where(`rideID='${id}'`).toQuery().text;
    return await dbAllAsync(query);
  } catch (err) {
    Logger.error(err);
    throw err;
  }
};

export const getRidesWithOffsetLimit = async (limit: number, page: number) => {
  try {
    const offset = limit * page - limit;
    const query = rides.select(rides.star()).from(rides).limit(limit).offset(offset).toQuery().text;
    return await dbAllAsync(query);
  } catch (err) {
    Logger.error(err);
    throw err;
  }
};
