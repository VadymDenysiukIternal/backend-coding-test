import { Logger } from './utils/logger';
import buildSchemas from './schemas';
import { db } from './db';
import { app } from './app';

const port = 8010;

export const bootsrap = async () => {
  try {
    buildSchemas(db);
    app.listen(port, () => Logger.info(`App started and listening on port ${port}`));
  } catch (error) {
    Logger.error(error);
  }
};

bootsrap();
