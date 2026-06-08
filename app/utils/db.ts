import { SQLocalDrizzle } from 'sqlocal/drizzle';
import { type SqliteRemoteDatabase, drizzle } from 'drizzle-orm/sqlite-proxy';
import { Capacitor } from '@capacitor/core';
import { FastSQL } from '@capgo/capacitor-fast-sql';

let db: SqliteRemoteDatabase<Record<string, never>, any>;
const DATABASE_NAME = "database";
if(Capacitor.getPlatform() === "web") {
    const { driver, batchDriver } = new SQLocalDrizzle('database.sqlite3');
    db = drizzle(driver, batchDriver);
} else {
    try {
        const conn = await FastSQL.connect({ database: DATABASE_NAME });
        
        const driver = async (sql: string, params: (string | number)[], method: 'get' | 'all' | 'values' | 'run') => {
            try {
                sql = sql.trim().replace(/[\r\n\t]+/gm, " ");

                const result = await conn.execute(sql, params);

                if(method === 'get') {
                    return { rows: result.rows.flatMap(row => Object.values(row)) }
                } else {
                    return { rows: result.rows.map(row => Object.values(row)) }
                }
            } catch (e: any) {
                alert('Error from sqlite proxy server: ' + e.response.data)
                return { rows: [] };
            }
        }

        const batchDriver = async (queries: { sql: string, params: any[], method: 'all' | 'run' | 'get' | 'values'}[]) => {
            try {
                const result = await conn.executeBatch([
                    ...queries.map(({ sql, params }) => ({
                        statement: sql,
                        params
                    }))
                ]);

                return result
            } catch (e: any) {
                alert('Error from sqlite proxy server: ' + e);
                throw e;
            }
        }

        db = drizzle(driver, batchDriver);
    } catch(error) {
        alert(error)
    }
}

export { db }