const { defineConfig } = require('@vue/cli-service')
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Adres Twojego backendu
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
