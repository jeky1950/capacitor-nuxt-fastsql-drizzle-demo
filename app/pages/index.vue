<template>
    <main>
        <h3>Input</h3>
        <form @submit.prevent="createGroceries">
            <div>
                <input v-model="name" placeholder="Enter the name" required />
            </div>
            <div>
                <input v-model="quantity" type="number" placeholder="Enter the quantity" validate required />
            </div>
            <button type="submit">Submit</button>
        </form>

        <h3>Groceries ({{ grocery_list.length }})</h3>
        <div>
            <input @input="search" v-model="search_query" placeholder="Search" validate required />
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

    const name = ref<string>("");
    const quantity = ref<number>(0);
    const search_query = ref<string>();
    const grocery_list = ref<typeof groceries.$inferInsert[]>([]);

    onMounted(async () => {
        alert('Working')
        grocery_list.value = await db.select().from(groceries)
    })

    const createGroceries = async () => {
        const result = await db.insert(groceries).values({
            name: name.value,
            quantity: quantity.value
        }).returning()

        grocery_list.value = await db.select().from(groceries)
        
        // Clear the form
        name.value = "";
        quantity.value = 0;
    }

    const search = async () => {
        if(search_query.value) {
            grocery_list.value = await db.select().from(groceries).where(like(groceries.name, `%${ search_query.value }%`))
        } else {
            grocery_list.value = await db.select().from(groceries)
        }
    }
</script>
