import { SQLocalKysely } from 'sqlocal/kysely';
import { Kysely } from 'kysely';

// Instantiate Kysely
const { dialect } = new SQLocalKysely('database.sqlite3');
export const db = new Kysely<Database>({ dialect });