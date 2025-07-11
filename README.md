# List all categories

Update the `PublicLayout.vue` again to make the app really full screen

```vue
<!-- src/layout/PublicLayout.vue -->
<template>
  <div class="min-h-screen h-screen flex flex-col bg-gray-100">
    <Navbar />
    <div class="flex-grow flex items-center justify-center">
      <!-- Make content full screen by removing max width constraint -->
      <div class="w-full h-full">
        <!-- Main Content -->
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 h-full">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "./Navbar.vue";
</script>
```

Create Categories page with dummy data

```vue
<script setup>
import { ref } from "vue";
const categories = ref([
  { _id: "66b1c0a1120562945addd2b2", name: "phone" },
  { _id: "66b1c0aa120562945addd2b4", name: "phone" },
  { _id: "66b23854841a9dca7bfb64ac", name: "tablet" },
]);
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Create Category Button -->
    <div class="flex mb-4">
      <button class="btn-primary" @click="createCategory">
        Create Category
      </button>
    </div>

    <!-- Categories Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">ID</th>
            <th class="py-2 px-4 border-b">Name</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category._id">
            <td class="py-2 px-4 border-b">{{ category._id }}</td>
            <td class="py-2 px-4 border-b">{{ category.name }}</td>
            <td class="py-2 px-4 border-b">
              <button class="btn-edit">
                Edit
              </button>
              <button class="btn-delete">
                Delete
              </button>
              <button class="btn-details">
                Details
              </button>
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
```

We want to use `token` after login. So that, we have to store the `token` to the `localStorage`

```vue
<!-- src/pages/Login.vue -->

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const router = useRouter(); // Vue router instance to redirect to /categories

const handleLogin = async () => {
  const data = {
    username: username.value,
    password: password.value,
  };

  try {
    const res = await axios.post("http://localhost:3000/auth/login", data);
    console.log("Login successful:", res.data.token);
    localStorage.setItem("token", res.data.token); // Save token to local storage for future requests
    localStorage.setItem("username", username.value); // Save username to local storage for future requests

    // Redirect to /Categories page with vue-router
    router.push("/categories");
  } catch (error) {
    console.error("Error during login:", error);
    alert("Login failed. Please try again.");
  }
};
</script>
```

Now in the `Categories.vue`, we can make api request with token in headers

```vue
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

const createCategory = () => {
  console.log("Create category");
};

const editCategory = (id) => {
  console.log("Edit category");
};

const deleteCategory = (id) => {
  console.log("Delete category");
};

const viewDetails = (id) => {
  console.log("View details");
};
</script>
```

# COMP1842 Frontend

This is a Vue.js frontend application for the COMP1842 course project.

## Features

- User authentication (login/register)
- Role-based access (Customer/Admin)
- Product management
- Category management
- Shopping cart functionality
- Order management
- Multi-language support (English/Vietnamese)

## Page Background Styling

To maintain consistency across all pages, we've created reusable CSS utility classes for page backgrounds:

### Available Classes

- `.page-background` - Standard padding (4rem top/bottom) with gradient background
- `.page-background-lg` - Large padding (6rem top/bottom) with gradient background  
- `.page-background-sm` - Small padding (2rem top/bottom) with gradient background

### Usage Examples

```html
<!-- Standard page background -->
<div class="page-background">
  <div class="container mx-auto px-6">
    <!-- Your page content here -->
  </div>
</div>

<!-- For pages needing more space -->
<div class="page-background-lg">
  <div class="container mx-auto px-6">
    <!-- Your page content here -->
  </div>
</div>

<!-- For compact pages -->
<div class="page-background-sm">
  <div class="container mx-auto px-6">
    <!-- Your page content here -->
  </div>
</div>
```

### Before (duplicated code in each page)
```html
<div class="w-full py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
  <!-- content -->
</div>
```

### After (using utility class)
```html
<div class="page-background">
  <!-- content -->
</div>
```

This approach:
- ✅ Eliminates code duplication
- ✅ Ensures consistent styling across all pages
- ✅ Makes it easy to update the gradient/padding globally
- ✅ Provides different padding options for various page types
