<template>
    <div>
      <h2>Unfulfilled Orders</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Confirmation Date</th>
            <th>Total Value</th>
            <th>Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in unfulfilledOrders" :key="order.id">
            <td>{{ order.confirmation_date }}</td>
            <td>{{ getTotalValue(order.orderItems) }} zł</td>
            <td>
              <ul>
                <li v-for="item in order.orderItems" :key="item.product_id">
                  {{ item.name }} ({{ item.quantity }} pcs)
                </li>
              </ul>
            </td>
            <td>
              <button class="btn btn-success" @click="updateOrderStatus(order.id, 'ZREALIZOWANE')">Zrealizowane</button>
              <button class="btn btn-danger" @click="updateOrderStatus(order.id, 'ANULOWANE')">Anulowane</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        unfulfilledOrders: [],
      };
    },
    async created() {
      const response = await fetch('/api/orders');
      const orders = await response.json();
      this.unfulfilledOrders = orders.filter(order => order.status_id === 'NIEZATWIERDZONE');
    },
    methods: {
      async updateOrderStatus(orderId, status) {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status_id: status }),
        });
  
        if (response.ok) {
          alert(`Order status updated to ${status}.`);
          this.unfulfilledOrders = this.unfulfilledOrders.filter(order => order.id !== orderId);
        } else {
          alert('Failed to update order status.');
        }
      },
      getTotalValue(orderItems) {
        return orderItems.reduce((total, item) => total + item.unit_price * item.quantity, 0).toFixed(2);
      },
    },
  };
  </script>
  