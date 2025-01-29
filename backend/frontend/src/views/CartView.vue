<template>
    <div class="container mt-4">
      <h2>Shopping Cart</h2>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price</th>
            <th scope="col">Weight</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item.id">
            <td>{{ item.name }}</td>
            <td>
              <div class="input-group">
                <button class="btn btn-outline-secondary" @click="decreaseQuantity(item)">-</button>
                <input
                  type="text"
                  class="form-control text-center"
                  v-model="item.quantity"
                  readonly
                />
                <button class="btn btn-outline-secondary" @click="increaseQuantity(item)">+</button>
              </div>
            </td>
            <td>{{ item.unit_price }} zł</td>
            <td>{{ item.unit_weight }} kg</td>
            <td>
              <button class="btn btn-danger" @click="removeFromCart(item)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <h3>Summary</h3>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">Total Price</th>
            <th scope="col">Total Weight</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ totalPrice }} zł</td>
            <td>{{ totalWeight }} kg</td>
          </tr>
        </tbody>
      </table>
  
      <div class="mt-4">
        <h4>Contact Information</h4>
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" id="name" class="form-control" v-model="contactInfo.name" />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" class="form-control" v-model="contactInfo.email" />
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Phone Number</label>
          <input
            type="text"
            id="phone"
            class="form-control"
            v-model="contactInfo.phone"
            @blur="validatePhone"
          />
          <div v-if="phoneError" class="text-danger">Invalid phone number. It must have 9 digits.</div>
        </div>
      </div>
  
      <button
        class="btn btn-primary mt-3"
        @click="placeOrder"
        :disabled="phoneError"
      >
        Zamów
      </button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        cart: [],
        contactInfo: {
          name: '',
          email: '',
          phone: '',
        },
        phoneError: false,
      };
    },
    computed: {
      totalPrice() {
        return this.cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
      },
      totalWeight() {
        return this.cart.reduce((sum, item) => sum + item.unit_weight * item.quantity, 0);
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
      removeFromCart(item) {
        this.cart = this.cart.filter(cartItem => cartItem.id !== item.id);
      },
      validatePhone() {
        const phoneRegex = /^[0-9]{9}$/;
        this.phoneError = !phoneRegex.test(this.contactInfo.phone);
      },
      async placeOrder() {
        const orderData = {
          username: this.contactInfo.name,
          email: this.contactInfo.email,
          phone_number: this.contactInfo.phone,
          orderItems: this.cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        };
  
        try {
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
          });
  
          if (response.ok) {
            alert('Zamówienie zostało pomyślnie złożone.');
            this.cart = []; // Clear the cart
          } else {
            const error = await response.json();
            alert(`Błąd zamówienia: ${error.message}`);
          }
        } catch (error) {
          alert(`Błąd połączenia z serwerem: ${error.message}`);
        }
      },
    },
    async created() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    this.cart = products.map(product => ({
      id: product.id,
      name: product.name,
      unit_price: product.unit_price,
      unit_weight: product.unit_weight,
      quantity: 1, // Set default quantity to 1
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

  };
  </script>
  
  <style>
  .container {
    max-width: 1200px;
  }
  .form-section {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  </style>
  