<template>
    <div class="container mt-4">
      <h2>Order Approval</h2>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Unit Price</th>
            <th scope="col">Total Price</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orderItems" :key="item.product_id">
            <td>{{ item.name }}</td>
            <td>
              <div class="input-group">
                <button class="btn btn-outline-secondary" @click="decreaseQuantity(item)">-</button>
                <input type="number" class="form-control text-center" v-model.number="item.quantity" />
                <button class="btn btn-outline-secondary" @click="increaseQuantity(item)">+</button>
              </div>
            </td>
            <td>{{ item.unit_price }} zł</td>
            <td>{{ item.quantity * item.unit_price }} zł</td>
            <td>
              <button class="btn btn-danger" @click="removeItem(item)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <h3>Total Order Price: {{ totalOrderPrice }} zł</h3>
  
      <div class="mt-4">
        <h4>Contact Information</h4>
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input type="text" id="username" class="form-control" v-model="contactInfo.username" />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" class="form-control" v-model="contactInfo.email" />
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Phone Number</label>
          <input type="text" id="phone" class="form-control" v-model="contactInfo.phone" @blur="validatePhone" />
          <div v-if="phoneError" class="text-danger">Invalid phone number. It must have 9 digits.</div>
        </div>
      </div>
  
      <div class="mt-3">
        <button class="btn btn-primary" @click="approveOrder" :disabled="phoneError">Approve Order</button>
        <button class="btn btn-danger ms-2" @click="cancelOrder">Cancel Order</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        orderItems: [],
        contactInfo: {
          username: '',
          email: '',
          phone: '',
        },
        phoneError: false,
      };
    },
    computed: {
      totalOrderPrice() {
        return this.orderItems.reduce((total, item) => total + item.unit_price * item.quantity, 0).toFixed(2);
      },
    },
    methods: {
      increaseQuantity(item) {
        item.quantity++;
      },
      decreaseQuantity(item) {
        if (item.quantity > 1) {
          item.quantity--;
        }
      },
      removeItem(item) {
        this.orderItems = this.orderItems.filter(orderItem => orderItem.product_id !== item.product_id);
      },
      validatePhone() {
        const phoneRegex = /^[0-9]{9}$/;
        this.phoneError = !phoneRegex.test(this.contactInfo.phone);
      },
      async approveOrder() {
        await this.updateOrderStatus("ZATWIERDZONE");
      },
      async cancelOrder() {
        await this.updateOrderStatus("ANULOWANE");
      },
      async updateOrderStatus(status) {
        const orderData = {
          ...this.contactInfo,
          orderItems: this.orderItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
          status_id: status,
        };
  
        const orderId = this.$route.params.id;
  
        try {
          const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          });
  
          if (response.ok) {
            alert(`Order ${status === "ZATWIERDZONE" ? "approved" : "canceled"} successfully.`);
            this.$router.push('/orders');
          } else {
            const error = await response.json();
            alert(`Error updating order status: ${error.message}`);
          }
        } catch (error) {
          alert(`Server connection error: ${error.message}`);
        }
      },
    },
    async created() {
      const orderId = this.$route.params.id;
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          this.orderItems = data.orderItems || [];
          this.contactInfo.username = data.username;
          this.contactInfo.email = data.email;
          this.contactInfo.phone = data.phone_number;
        } else {
          console.error(`Failed to fetch order details for order ID: ${orderId}`);
        }
      } catch (error) {
        console.error(`Error fetching order details for order ID: ${orderId}`, error);
      }
    },
  };
  </script>
  
  <style>
  .container {
    max-width: 1200px;
  }
  </style>
  