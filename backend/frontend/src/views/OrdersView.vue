<template>
    <div>
      <h2>Your Orders</h2>
      <select v-model="selectedStatus" @change="filterOrders" class="form-control">
        <option value="">All</option>
        <option value="NIEZATWIERDZONE">Niezatwierdzone</option>
        <option value="ZATWIERDZONE">Zatwierdzone</option>
        <option value="ANULOWANE">Anulowane</option>
        <option value="ZREALIZOWANE">Zrealizowane</option>
      </select>
      <table class="table mt-3">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Username</th>
            <th>Confirmation Date</th>
            <th>Status</th>
            <th>Total Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>
              <router-link :to="'/orders/' + order.id">{{ order.id }}</router-link>
            </td>
            <td>{{ order.username }}</td>
            <td>{{ order.confirmation_date }}</td>
            <td>{{ order.status_id }}</td>
            <td>{{ order.totalOrderPrice }} zł</td>
            <td>
              <button v-if="order.status_id === 'NIEZATWIERDZONE'" class="btn btn-success" @click="updateOrderStatus(order.id, 'ZREALIZOWANE')">Zrealizowane</button>
              <button v-if="order.status_id === 'NIEZATWIERDZONE'" class="btn btn-danger" @click="updateOrderStatus(order.id, 'ANULOWANE')">Anulowane</button>
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
        orders: [],
        filteredOrders: [],
        selectedStatus: '',
      };
    },
    async created() {
      const response = await fetch('/api/orders');
      const orders = await response.json();
      this.orders = orders.map(order => ({
        ...order,
        orderItems: order.orderItems || [],
      }));
  
      // Fetch total prices for all orders
      for (const order of this.orders) {
        await this.fetchOrderTotal(order.id);
      }
  
      this.filteredOrders = this.orders;
    },
    methods: {
      filterOrders() {
        if (this.selectedStatus) {
          this.filteredOrders = this.orders.filter(order => order.status_id === this.selectedStatus);
        } else {
          this.filteredOrders = this.orders;
        }
      },
      async fetchOrderTotal(orderId) {
        try {
          const response = await fetch(`/api/orders/${orderId}`);
          if (response.ok) {
            const order = await response.json();
            const total = order.orderItems.reduce((total, item) => total + item.unit_price * item.quantity, 0).toFixed(2);
            this.orders = this.orders.map(order =>
              order.id === orderId ? { ...order, totalOrderPrice: total } : order
            );
          } else {
            console.error(`Failed to fetch order details for order ID: ${orderId}`);
          }
        } catch (error) {
          console.error(`Error fetching order details for order ID: ${orderId}`, error);
        }
      },
      async updateOrderStatus(orderId, status) {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status_id: status }),
        });
  
        if (response.ok) {
          alert(`Order status updated to ${status}.`);
          this.orders = this.orders.map(order =>
            order.id === orderId ? { ...order, status_id: status } : order
          );
          this.filterOrders(); // Apply filter after status change
        } else {
          alert('Failed to update order status.');
        }
      },
    },
  };
  </script>
  