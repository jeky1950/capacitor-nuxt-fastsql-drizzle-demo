import { SQLocalDrizzle } from 'sqlocal/drizzle';
import { drizzle } from 'drizzle-orm/sqlite-proxy';
import { Capacitor } from '@capacitor/core';
import { CapgoCapacitorFastSql } from '@capgo/capacitor-fast-sql';

let db;
const DATABASE_NAME = "database";
if(Capacitor.getPlatform() === "web") {
    const { driver, batchDriver } = new SQLocalDrizzle('database.sqlite3');
    db = drizzle(driver, batchDriver);
} else {
    try {
        await CapgoCapacitorFastSql.connect({ database: DATABASE_NAME });
        
        db = drizzle(async (sql, params, method) => {
            if(sql) {
                alert(sql)
                const result = await CapgoCapacitorFastSql.execute({
                    database: DATABASE_NAME,
                    statement: sql,
                    params
                });
                alert(JSON.stringify(result))
                
                return result
            }
            
            return { rows: [] }
        });
    } catch(error) {
        alert(error)
    }
}

export { db }