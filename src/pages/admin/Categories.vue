<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const categories = ref([]);

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to login first");
    router.push("/login");
  }

  // Make the api request with axios with token in header
  const res = await axios.get("http://localhost:3000/categories", {
    headers: {
      "x-auth-token": `${token}`,
    },
  });

  console.log("Categories response:", res.data);
  categories.value = res.data;
});

</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Create Category Button -->
    <div class="flex mb-4">
      <router-link to="/admin/create-category">
        <button class="btn-primary">
          Create Category
        </button>
      </router-link>
    </div>

    <!-- Categories Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr class="bg-gray-100 text-left text-gray-700">
            <th class="py-2 px-4 border">ID</th>
            <th class="py-2 px-4 border">Name</th>
            <th class="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category._id" class="hover:bg-gray-50">
            <!-- Make the ID cell clickable -->
            <td class="py-2 px-4 border">
              <router-link :to="`/admin/categories/${category._id}`" class="block">
                {{ category._id }}
              </router-link>
            </td>
            <!-- Make the Name cell clickable -->
            <td class="py-2 px-4 border">
              <router-link :to="`/admin/categories/${category._id}`" class="block">
                {{ category.name }}
              </router-link>
            </td>
            <!-- Actions stay as separate buttons -->
            <td class="py-2 px-4 border">
              <router-link :to="`/admin/categories/edit/${category._id}`">
                <button class="btn-edit text-white bg-green-500 px-4 py-2 rounded hover:bg-green-600">
                  Edit
                </button>
              </router-link>
              <router-link :to="`/admin/categories/delete/${category._id}`">
                <button class="btn-delete text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600">
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
