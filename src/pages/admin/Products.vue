<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const products = ref([]);

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to login first");
    router.push("/login");
  }

  // Make the api request with axios with token in header
  const res = await axios.get("http://localhost:3000/products", {
    headers: {
      "x-auth-token": `${token}`,
    },
  });

  console.log("Products response:", res.data);
  products.value = res.data;
});

const createProduct = () => {
  console.log("Create product");
};

const editProduct = (id) => {
  console.log("Edit product");
};

const deleteProduct = (id) => {
  console.log("Delete product");
};

const viewDetails = (id) => {
  console.log("View details");
};
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Create Product Button -->
    <div class="flex mb-4">
      <router-link to="/create-product">
        <button class="btn-primary" @click="createProduct">
          Create Product
        </button>
      </router-link>  
    </div>

    <!-- Products Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">ID</th>
            <th class="py-2 px-4 border-b">Name</th>
            <th class="py-2 px-4 border-b">Category</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td class="py-2 px-4 border-b">{{ product._id }}</td>
            <td class="py-2 px-4 border-b">{{ product.name }}</td>
            <td class="py-2 px-4 border-b">{{ product.category ? product.category.name : 'No Category' }}</td>
            <td class="py-2 px-4 border-b">
              
                <router-link :to="`/products/edit/${product._id}`">
                    <button class="btn-edit" @click="editProduct(product._id)">
                    Edit
                    </button>
                </router-link>    

                <router-link :to="`/products/delete/${product._id}`">
                    <button class="btn-delete" @click="deleteProduct(product._id)">
                        Delete
                    </button>
                </router-link>

                <router-link :to="`/products/${product._id}`">
                    <button class="btn-details" @click="viewDetails(product._id)">
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
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}
.btn-edit {
  @apply bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mx-1;
}
.btn-delete {
  @apply bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mx-1;
}
.btn-details {
  @apply bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mx-1;
}
</style>
