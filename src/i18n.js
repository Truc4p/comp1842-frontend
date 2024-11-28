// src/i18n.js
import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    welcomeMessage: 'Welcome to our website!',
    details: 'Details',
    addToCart: 'Add to Cart',
    login: 'Login',
    register: 'Register',
    products: 'Products',
    categories: 'Categories',
    orders: 'Orders',
    users: 'Users',
    logout: 'Logout',
    profile: 'Profile',
    username: 'Username',
    password: 'Password',
    role: 'Role',
    adminKey: 'Admin Key',
    registerSuccess: 'Registration successful!',
    registerFail: 'Registration failed: ',
    admin: 'Admin',
    customer: 'Customer',
    customerPage: 'Customer Page',
    cart: 'Cart',
    createProduct: 'Create Product',
    productName: 'Product Name',
    productCategory: 'Product Category',
    selectCategory: 'Select a category',
    productPrice: 'Product Price',
    stockQuantity: 'Stock Quantity',
    productDescription: 'Product Description',
    productImage: 'Product Image',
    editProduct: 'Edit Product',
  },
  vi: {
    welcomeMessage: 'Chào mừng bạn đến với trang web của chúng tôi!',
    details: 'Chi tiết',
    addToCart: 'Thêm vào giỏ hàng',
    login: 'Đăng nhập',
    register: 'Đăng ký',
    products: 'Sản phẩm',
    categories: 'Danh mục',
    orders: 'Đơn hàng',
    users: 'Người dùng',
    logout: 'Đăng xuất',
    profile: 'Hồ sơ',
    username: 'Tên đăng nhập',
    password: 'Mật khẩu',
    role: 'Vai trò',
    adminKey: 'Khóa quản trị',
    registerSuccess: 'Đăng ký thành công!',
    registerFail: 'Đăng ký thất bại: ',
    admin: 'Quản trị viên',
    customer: 'Khách hàng',
    customerPage: 'Trang khách hàng',
    cart: 'Giỏ hàng',
    createProduct: 'Tạo sản phẩm',
    productName: 'Tên sản phẩm',
    productCategory: 'Danh mục sản phẩm',
    selectCategory: 'Chọn danh mục',
    productPrice: 'Giá sản phẩm',
    stockQuantity: 'Số lượng tồn kho',
    productDescription: 'Mô tả sản phẩm',
    productImage: 'Hình ảnh sản phẩm',
    editProduct: 'Chỉnh sửa sản phẩm',
  }
};

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
});

export default i18n;