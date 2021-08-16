import * as request from 'supertest';
import * as faker from 'faker';

import buildSchemas from '../src/schemas';
import { app } from '../src/app';
import { db } from '../src/db';
import { expect } from 'chai';

const rideFactory = (overrides = {}) => {
  return {
    driver_name: faker.name.firstName(),
    driver_vehicle: faker.vehicle.vehicle(),
    end_lat: 10,
    end_long: 10,
    rider_name: faker.name.firstName(),
    start_lat: 0,
    start_long: 0,
    ...overrides,
  };
};

describe('API tests', () => {
  before((done) => {
    // @ts-ignore
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  describe('GET /health', () => {
    it('SUCCESS should return health', (done) => {
      request(app).get('/health').expect('Content-Type', /text/u).expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('ERROR should return 404 not found', (done) => {
      request(app).get('/rides').expect(404, done);
    });
  });

  describe('POST /rides', () => {
    it('ERROR should return 400 Bad Request (Invalid Start Latitude)', (done) => {
      const invalidRide = rideFactory({ start_lat: 1000 });
      request(app).post('/rides').set('Content-type', 'application/json').send(invalidRide).expect(400, done);
    });
    it('ERROR should return 400 Bad Request (Invalid Start Longitude)', (done) => {
      const invalidRide = rideFactory({ start_long: 1000 });
      request(app).post('/rides').set('Content-type', 'application/json').send(invalidRide).expect(400, done);
    });
    it('ERROR should return 400 Bad Request (Invalid End Latitude)', (done) => {
      const data = rideFactory();
      data.end_lat = 1000;

      request(app).post('/rides').set('Content-type', 'application/json').send(data).expect(400, done);
    });
    it('ERROR should return 400 Bad Request (Invalid End Longitude)', (done) => {
      const invalidRide = rideFactory({ end_long: 1000 });
      request(app).post('/rides').set('Content-type', 'application/json').send(invalidRide).expect(400, done);
    });
    it('ERROR should return 400 Bad Request (Invalid Rider Name)', (done) => {
      const invalidRide = rideFactory({ rider_name: 1000 });
      request(app).post('/rides').set('Content-type', 'application/json').send(invalidRide).expect(400, done);
    });
    it('ERROR should return 400 Bad Request (Invalid Driver Name)', (done) => {
      const invalidRide = rideFactory({ driver_name: 1000 });
      request(app).post('/rides').set('Content-type', 'application/json').send(invalidRide).expect(400, done);
    });
    it('ERROR should return 400 Bad Request (Invalid Driver Vehicle)', (done) => {
      const invalidRide = rideFactory({ driver_vehicle: 15 });
      request(app).post('/rides').set('Content-type', 'application/json').send(invalidRide).expect(400, done);
    });
    it('SUCCESS should insert rides successfully', (done) => {
      const validRide = rideFactory();
      request(app).post('/rides').set('Content-type', 'application/json').send(validRide).expect(201, done);
    });
  });

  describe('GET /rides/:id', () => {
    it('ERROR should return 404 not found', (done) => {
      request(app).get('/rides/9999').expect(404, done);
    });

    it('SUCCESS should return a ride', (done) => {
      const validRide = rideFactory();
      request(app)
        .post('/rides')
        .set('Content-type', 'application/json')
        .send(validRide)
        .expect(201, (error: Error, res) => {
          expect(res.body[0]).to.have.property('rideID');
        });

      request(app).get('/rides/1').expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('ERROR should return rides with default pagination settings (page: -1, limit: -1)', (done) => {
      request(app).get('/rides').expect(400);

      done();
    });

    it('SUCCESS should return rides with custom pagination settings (page: 1, limit: 5)', (done) => {
      request(app)
        .get('/rides?page=1&limit=5')
        .expect(200)
        .then((resp) => resp.body.length === 1);
      done();
    });
  });
});
