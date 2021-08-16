import { createRides, getAllRides, getRidesById, getRidesWithOffsetLimit } from '../services/rides.service';
import { InternalServerError } from '../utils/ErrorMessage';

export const createRidesHandler = async (req, res, next) => {
  try {
    const rows = await createRides(req);
    res.status(201).json(rows);
  } catch (err) {
    next(InternalServerError);
  }
};

export const getRidesHandler = async (req, res, next) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    if (page > 0 && limit > 0) {
      const rows = await getRidesWithOffsetLimit(limit, page);
      if (rows.length !== 0) {
        res.status(200).json(rows);
      } else {
        res.status(404).json({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }
    } else {
      const rows = await getAllRides();
      if (Object.keys(rows).length !== 0) {
        res.status(200).json(rows);
      } else {
        res.status(404).json({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }
    }
  } catch (err) {
    next(InternalServerError);
  }
};

export const getRidesByIdHandler = async (req, res, next) => {
  try {
    // @ts-ignore
    const { id } = req.params as number;
    const rows = await getRidesById(id);
    if (Object.keys(rows).length !== 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({
        error_code: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not find any rides',
      });
    }
  } catch (err) {
    next(InternalServerError);
  }
};
