# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
This is an demonstration repo of how to implement [FastSQL](https://capgo.app/docs/plugins/fast-sql/) (high performance SQLite Database) with [Drizzle ORM](https://orm.drizzle.team/docs/get-started) inside [Capacitor 8](https://capacitorjs.com/docs/updating/8-0). We will be using [Nuxt 4](https://nuxt.com/) as the [Vite](https://vite.dev/) wrapper but any other Vite framework will also work.

### Step 1
Clone repo
```bash
git clone https://github.com/jeky1950/capacitor-nuxt-fastsql-drizzle-demo.git
```

### Step 2
Install node packages
```bash
npm install
```

### Step 3
Sync Capacitor configs
```bash
npx cap sync
```

### Step 4
Deploy App to Android Studio
```bash
npm run mobile:android
```

Or Xcode
```bash
npm run mobile:ios
```

### Step 5 (Android Studio)
Sync Gradle then Build your App

### Schema
The drizzle schema can be found on path `db/schema.ts`

### Migrations
Make sure to generate your migration files after you change the drizzle schema. This can be achieved by running the following code:

```bash
npm run drizzle:generate
```

The migrations are automatically made and tracked in the `_drizzle_migrations` table via `onMounted` lifecyle hook on the `app/pages/index.vue` page. This is done to ensure that your each user has the latest DB migrations applied. The migrator can be found on the path `db/migrator.ts`.