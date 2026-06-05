import { promises as fs } from 'node:fs'
import path from 'node:path'
import { FileMigrationProvider, Migrator } from 'kysely/migration'
import { db } from './app/utils/db'

export const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    // Path to the folder that contains all your migrations.
    migrationFolder: './kysely/migrations',
    path,
  })
})

