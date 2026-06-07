import { sha256 } from "@noble/hashes/sha2.js";
import { Buffer } from "buffer";
import { sql } from "drizzle-orm";
import { db } from "../app/utils/db";
import migration_summary from "./migrations/migrations.js"

export const migrate = async () => {
    // Create the migration table to keep track of all the applied migrations
    const MIGRATIONS_TABLE_NAME = sql.identifier("_drizzle_migrations");

    await db.run(
		sql`
          CREATE TABLE IF NOT EXISTS ${ MIGRATIONS_TABLE_NAME } (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name TEXT NOT NULL,
            hash TEXT NOT NULL,
            created_at INTEGER NOT NULL
          );
        `,
	);

    const appliedMigrations = (await db.all(
		sql`SELECT * FROM ${ MIGRATIONS_TABLE_NAME };`,
	)) as unknown[][];

    await db.transaction(async (tx) => {
        for(let migration_name of Object.keys(migration_summary.migrations)) {
            // Get migration file a raw text
            const migration_sql = (await import(`./migrations/${ migration_name }/migration.sql?raw`)).default;

            // Generate a hash of the migration file
            const hash = Buffer.from(sha256(Buffer.from(migration_sql))).toString("hex")

            // Check if the migration file was applied to the SQLite DB
            if (appliedMigrations.some((applied_migration) => applied_migration[2] === hash)) continue;
            
            // Now run the migration on to the SQLite DB
            try {
                await tx.run(migration_sql)
            } catch(error) {
                console.error(error)
            }

            // Log this migration as applied onto the SQLite DB
            await tx.run(
				sql`
                    INSERT INTO ${ MIGRATIONS_TABLE_NAME } ("name", "hash", "created_at") VALUES (
                    ${ sql.raw(`'${ migration_name }'`) },
                    ${ sql.raw(`'${ hash }'`) },
                    ${ sql.raw(`${ Date.now() }`) }
                    );
                `,
			);

            console.log(`Applied Migration: ${ migration_name } \nHash: ${ hash } \nSQL: \n${ migration_sql }`)
        }
    });
}
