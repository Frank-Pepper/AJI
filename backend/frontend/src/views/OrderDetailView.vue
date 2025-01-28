<template>
  <div>
    <h1>Order Details</h1>
    <div v-if="order">
      <p><strong>Order ID:</strong> {{ order.id }}</p>
      <p><strong>Username:</strong> {{ order.username }}</p>
      <p><strong>Email:</strong> {{ order.email }}</p>
      <p><strong>Phone Number:</strong> {{ order.phone_number }}</p>
      <p><strong>Confirmation Date:</strong> {{ order.confirmation_date }}</p>
      <p><strong>Status:</strong> {{ order.status_id }}</p>

      <h2>Order Items</h2>
      <table class="table mt-3">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.orderItems" :key="item.product_id">
            <td>
              <router-link :to="'/products/' + item.product_id">{{ item.product_id }}</router-link>
            </td>
            <td>{{ item.unit_price }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.quantity * item.unit_price }}</td>
          </tr>
        </tbody>
      </table>
      <h3>Total Order Price: {{ totalOrderPrice }} zł</h3>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: null,
    };
  },
  async created() {
    const orderId = this.$route.params.id;
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched Order:', data);  // Logging the fetched order details
      this.order = data;
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  },
  computed: {
    totalOrderPrice() {
      if (this.order && this.order.orderItems) {
        return this.order.orderItems.reduce((total, item) => total + item.unit_price * item.quantity, 0).toFixed(2);
      }
      return 0;
    },
  },
};
</script>
