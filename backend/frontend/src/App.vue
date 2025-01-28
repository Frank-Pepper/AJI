<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Shop</a>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/products" class="nav-link">Products</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/orders" class="nav-link">Orders</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/cart" class="nav-link">Cart</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>
