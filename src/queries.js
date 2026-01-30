const pool = require('./db');

// View all products with supplier info
async function viewAllProducts() {
  const query = `
    SELECT 
      p.id, 
      p.name, 
      p.category, 
      p.price, 
      p.quantity, 
      s.name AS supplier
    FROM products p
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    ORDER BY p.id;
  `;
  const result = await pool.query(query);
  return result.rows;
}

// View low inventory products (quantity < 5)
async function viewLowInventory(threshold = 5) {
  const query = `
    SELECT 
      p.id, 
      p.name, 
      p.category, 
      p.price, 
      p.quantity, 
      s.name AS supplier
    FROM products p
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    WHERE p.quantity < $1
    ORDER BY p.quantity ASC;
  `;
  const result = await pool.query(query, [threshold]);
  return result.rows;
}

// View all suppliers
async function viewAllSuppliers() {
  const query = 'SELECT id, name, email, phone FROM suppliers ORDER BY id;';
  const result = await pool.query(query);
  return result.rows;
}

// Add a new supplier
async function addSupplier(name, email, phone) {
  const query = `
    INSERT INTO suppliers (name, email, phone)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [name, email, phone]);
  return result.rows[0];
}

// Add a new product
async function addProduct(name, category, price, quantity, supplierId) {
  const query = `
    INSERT INTO products (name, category, price, quantity, supplier_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const result = await pool.query(query, [name, category, price, quantity, supplierId]);
  return result.rows[0];
}

// Restock a product (increase quantity)
async function restockProduct(productId, amount) {
  const query = `
    UPDATE products
    SET quantity = quantity + $1
    WHERE id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [amount, productId]);
  return result.rows[0];
}

// Record a sale (decrease quantity)
async function recordSale(productId, amount) {
  // First check current quantity
  const checkQuery = 'SELECT quantity FROM products WHERE id = $1;';
  const checkResult = await pool.query(checkQuery, [productId]);
  
  if (checkResult.rows.length === 0) {
    throw new Error('Product not found');
  }
  
  const currentQuantity = checkResult.rows[0].quantity;
  
  if (currentQuantity < amount) {
    throw new Error(`Insufficient stock. Current quantity: ${currentQuantity}`);
  }
  
  const query = `
    UPDATE products
    SET quantity = quantity - $1
    WHERE id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [amount, productId]);
  return result.rows[0];
}

// Update product details
async function updateProduct(productId, updates) {
  const { price, category, supplierId } = updates;
  const query = `
    UPDATE products
    SET 
      price = COALESCE($1, price),
      category = COALESCE($2, category),
      supplier_id = COALESCE($3, supplier_id)
    WHERE id = $4
    RETURNING *;
  `;
  const result = await pool.query(query, [price, category, supplierId, productId]);
  return result.rows[0];
}

// Delete a product
async function deleteProduct(productId) {
  const query = 'DELETE FROM products WHERE id = $1 RETURNING *;';
  const result = await pool.query(query, [productId]);
  return result.rows[0];
}

// Get product by ID
async function getProductById(productId) {
  const query = 'SELECT * FROM products WHERE id = $1;';
  const result = await pool.query(query, [productId]);
  return result.rows[0];
}

// Get supplier by ID
async function getSupplierById(supplierId) {
  const query = 'SELECT * FROM suppliers WHERE id = $1;';
  const result = await pool.query(query, [supplierId]);
  return result.rows[0];
}

module.exports = {
  viewAllProducts,
  viewLowInventory,
  viewAllSuppliers,
  addSupplier,
  addProduct,
  restockProduct,
  recordSale,
  updateProduct,
  deleteProduct,
  getProductById,
  getSupplierById,
};
