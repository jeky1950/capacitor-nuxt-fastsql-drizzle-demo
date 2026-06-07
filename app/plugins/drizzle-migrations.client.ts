import { migrate } from '~~/db/migrator'

export default defineNuxtPlugin(async () => {
    await migrate()
})