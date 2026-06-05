<template>
    <main>
        <h2>Database Information</h2>
        <div>{{ db_info }}</div>

        <h3>Input</h3>
        <form @submit.prevent="createGroceries">
            <div>
                <input v-model="name" placeholder="Enter the name" required />
            </div>
            <div>
                <input v-model="quantity" type="number" placeholder="Enter the quantity" required validate />
            </div>
            <button type="submit">Submit</button>
        </form>

        <h3>Migrate</h3>
        <button @click="runMigration">Migrate</button>

        <h3>Groceries ({{ grocery_list.length }})</h3>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="{ id, name} of grocery_list">
                    <td>{{ id }}</td>
                    <td>{{ name }}</td>
                </tr>
            </tbody>
        </table>
    </main>
</template>

<script setup lang="ts">
    import { SQLocal } from 'sqlocal';
    
    const { getDatabaseInfo, reactiveQuery } = new SQLocal({
        databasePath: 'database.sqlite3',
        reactive: true
    });

    const db_info = ref();
    const name = ref<string>("");
    const quantity = ref<number>(0);
    const grocery_list = ref([]);

    onMounted(async () => {
        db_info.value = await getDatabaseInfo()
    })

    const subscription = reactiveQuery(
        db.selectFrom('groceries').select(['id', 'name', 'quantity']).compile()
    ).subscribe(data => grocery_list.value = data)

    onBeforeUnmount(() => subscription.unsubscribe())

    const createGroceries = async () => {
        const result = await db.insertInto('groceries').values({
            name: name.value,
            quantity: quantity.value
        }).execute()
        console.log(result)
    }

    const runMigration = async () => {
        await migrator.migrateToLatest()
    }
</script>
