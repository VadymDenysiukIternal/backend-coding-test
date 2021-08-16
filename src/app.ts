import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

import { pipesRidesBody } from './middlewares/rides.middleware';
import { createRidesHandler, getRidesByIdHandler, getRidesHandler } from './controllers/rides.controller';
import { errorController } from './controllers/error.controller';

export const app = express();
const options = {
  swaggerDefinition: {
    info: {
      title: 'REST API',
      version: '1.0.0',
      description: 'Xendit Coding Exercise',
    },
  },
  apis: ['swagger.yml'],
};

const specs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.send('Healthy'));
app.post('/rides', pipesRidesBody, createRidesHandler);
app.get('/rides', getRidesHandler);
app.get('/rides/:id', getRidesByIdHandler);
app.use((err, req, res) => {
  errorController(err, res);
});
