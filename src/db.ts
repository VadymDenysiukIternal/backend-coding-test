import { promisify } from 'util';
import { verbose } from 'sqlite3';

const sqlite3 = verbose();

export const db = new sqlite3.Database(':memory:');
export const dbRunAsync = promisify(db.run.bind(db));
export const dbAllAsync = promisify(db.all.bind(db));
export const dbGetAsync = promisify(db.get.bind(db));
