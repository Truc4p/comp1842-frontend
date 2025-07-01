<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';

const { t } = useI18n();
const router = useRouter();

const orders = ref([]);

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to login first");
    router.push("/login");
  }

  // Make the api request with axios with token in header
  const res = await axios.get(`${API_URL}/orders`, {
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
            <th class="py-2 px-4 border-b">Status</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id"  class="hover:bg-gray-50">

            <!-- Make the ID cell clickable -->
            <td class="py-2 px-4 border">
              <router-link :to="`/admin/orders/order/${order._id}`" class="block">
                {{ order._id }}
              </router-link>
            </td>

            <!-- Make the name cell clickable -->
            <td class="py-2 px-4 border">
              <router-link :to="`/admin/orders/order/${order._id}`" class="block">
                {{ order.status }}
              </router-link>
            </td>

            <td class="py-2 px-4 border-b">
              
              <router-link :to="`/admin/orders/order/edit/${order._id}`">
                <button class="btn-edit">
                  Edit
                </button>
              </router-link>    

              <router-link :to="`/admin/orders/delete/${order._id}`">
                <button class="btn-delete">
                  Delete
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
