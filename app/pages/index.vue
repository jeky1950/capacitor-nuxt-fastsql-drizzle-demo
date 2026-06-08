<template>
    <main>
        <h2>Create Groceries</h2>
        <form @submit.prevent="createGroceries">
            <div>
                <input v-model="name" placeholder="Enter the name" required />
            </div>
            <div>
                <input v-model="quantity" type="number" placeholder="Enter the quantity" validate required />
            </div>
            <button type="submit">Submit</button>
        </form>

        <h2>Grocery List ({{ grocery_list.length }})</h2>
        <div>
            <input v-model="search_query" placeholder="Search" validate required />
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="{ id, name, quantity} of grocery_list">
                    <td>{{ id }}</td>
                    <td>{{ name }}</td>
                    <td>{{ quantity }}</td>
                </tr>
            </tbody>
        </table>
    </main>
</template>

<script setup lang="ts">
    import { like } from 'drizzle-orm';
    import { groceries } from "~~/db/schema";
    import { migrate } from '~~/db/migrator'

    const name = ref<string>("");
    const quantity = ref<number>(0);
    const search_query = ref<string>();
    const grocery_list = ref<typeof groceries.$inferInsert[]>([]);

    watch(search_query, (value) => search(value))

    onMounted(async () => {
        await migrate()
        grocery_list.value = await db.select().from(groceries)
    })

    const createGroceries = async () => {
        try {
            await db.insert(groceries).values({
                name: name.value,
                quantity: quantity.value
            })

            grocery_list.value = await db.select({
                id: groceries.id,
                name: groceries.name,
                quantity: groceries.quantity
            })
            .from(groceries)
            
            // Clear the form
            name.value = "";
            quantity.value = 0;
        } catch (error) {
            alert(error)
        }
    }

    const search = async (query: string | undefined) => {
        if(search_query.value) {
            grocery_list.value = await db.select()
                .from(groceries)
                .where(like(groceries.name, `%${ query }%`))
        } else {
            grocery_list.value = await db.select().from(groceries)
        }
    }
</script>
