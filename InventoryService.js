// Inventory API service
class InventoryService {
  constructor() {
    this.baseUrl = 'http://localhost:3001';
  }

  async getProducts(storeId) {
    const response = await fetch(`${this.baseUrl}/products`);
    const products = await response.json();
    return storeId ? products.filter(p => p.storeId === storeId) : products;
  }

  async getProductsByCategory(category) {
    const response = await fetch(`${this.baseUrl}/products?category=${category}`);
    return await response.json();
  }

  async searchProducts(query) {
    const response = await fetch(`${this.baseUrl}/products?name_like=${query}`);
    return await response.json();
  }

  async updateStock(productId, newStock) {
    const response = await fetch(`${this.baseUrl}/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        stock: newStock, 
        inStock: newStock > 0,
        lastUpdated: new Date().toISOString()
      })
    });
    return await response.json();
  }

  simulateStockChanges() {
    setInterval(async () => {
      const products = await this.getProducts();
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const newStock = Math.max(0, randomProduct.stock + Math.floor(Math.random() * 10) - 5);
      await this.updateStock(randomProduct.id, newStock);
    }, 30000);
  }
}

export const inventoryService = new InventoryService();