<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const orders = ref([]);

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to login first");
    router.push("/login");
  }

  // Make the api request with axios with token in header
  const res = await axios.get("http://localhost:3000/orders", {
    headers: {
      "x-auth-token": `${token}`,
    },
  });

  console.log("Orders response:", res.data);
  orders.value = res.data;
});

</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Orders Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">ID</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td class="py-2 px-4 border-b">{{ order._id }}</td>
            <td class="py-2 px-4 border-b">{{ order.name }}</td>
            <td class="py-2 px-4 border-b">
              
              <router-link :to="`/admin/orders/edit/${order._id}`">
                <button class="btn-edit">
                  Edit
                </button>
              </router-link>    

              <router-link :to="`/admin/orders/delete/${order._id}`">
                <button class="btn-delete">
                  Delete
                </button>
              </router-link>

              <router-link :to="`/admin/orders/order/${order._id}`">
                <button class="btn-details">
                  Details
                </button>
              </router-link>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.btn-primary {
  @apply bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500;
}
.btn-edit {
  @apply bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 mx-1;
}
.btn-delete {
  @apply bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500 mx-1;
}
.btn-details {
  @apply bg-green-400 text-white px-2 py-1 rounded hover:bg-green-500 mx-1;
}
</style>
