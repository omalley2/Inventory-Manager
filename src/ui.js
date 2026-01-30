const inquirer = require('inquirer');
const queries = require('./queries');

// Main menu
async function showMainMenu() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all products',
        'View low inventory',
        'View all suppliers',
        'Add a product',
        'Add a supplier',
        'Restock a product',
        'Record a sale',
        'Update a product',
        'Delete a product',
        'Exit',
      ],
    },
  ]);
  return answer.action;
}

// View all products
async function handleViewAllProducts() {
  const products = await queries.viewAllProducts();
  if (products.length === 0) {
    console.log('\nNo products found.\n');
  } else {
    console.log('\n=== All Products ===');
    console.table(products);
  }
}

// View low inventory
async function handleViewLowInventory() {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'threshold',
      message: 'Enter the low stock threshold:',
      default: '5',
      validate: (input) => {
        const num = parseInt(input);
        return !isNaN(num) && num >= 0 ? true : 'Please enter a valid number';
      },
    },
  ]);
  
  const products = await queries.viewLowInventory(parseInt(answer.threshold));
  if (products.length === 0) {
    console.log('\nNo low inventory items found.\n');
  } else {
    console.log('\n=== Low Inventory Products ===');
    console.table(products);
  }
}

// View all suppliers
async function handleViewAllSuppliers() {
  const suppliers = await queries.viewAllSuppliers();
  if (suppliers.length === 0) {
    console.log('\nNo suppliers found.\n');
  } else {
    console.log('\n=== All Suppliers ===');
    console.table(suppliers);
  }
}

// Add a supplier
async function handleAddSupplier() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter supplier name:',
      validate: (input) => input.trim() ? true : 'Name is required',
    },
    {
      type: 'input',
      name: 'email',
      message: 'Enter supplier email:',
    },
    {
      type: 'input',
      name: 'phone',
      message: 'Enter supplier phone:',
    },
  ]);
  
  try {
    const supplier = await queries.addSupplier(answers.name, answers.email, answers.phone);
    console.log(`\n✓ Supplier "${supplier.name}" added successfully! (ID: ${supplier.id})\n`);
  } catch (error) {
    console.log(`\n✗ Error adding supplier: ${error.message}\n`);
  }
}

// Add a product
async function handleAddProduct() {
  const suppliers = await queries.viewAllSuppliers();
  
  if (suppliers.length === 0) {
    console.log('\n⚠ No suppliers available. Please add a supplier first.\n');
    return;
  }
  
  const supplierChoices = suppliers.map(s => ({ name: s.name, value: s.id }));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter product name:',
      validate: (input) => input.trim() ? true : 'Name is required',
    },
    {
      type: 'input',
      name: 'category',
      message: 'Enter product category:',
      validate: (input) => input.trim() ? true : 'Category is required',
    },
    {
      type: 'input',
      name: 'price',
      message: 'Enter product price:',
      validate: (input) => {
        const num = parseFloat(input);
        return !isNaN(num) && num >= 0 ? true : 'Please enter a valid price';
      },
    },
    {
      type: 'input',
      name: 'quantity',
      message: 'Enter starting quantity:',
      default: '0',
      validate: (input) => {
        const num = parseInt(input);
        return !isNaN(num) && num >= 0 ? true : 'Please enter a valid quantity';
      },
    },
    {
      type: 'list',
      name: 'supplierId',
      message: 'Select a supplier:',
      choices: supplierChoices,
    },
  ]);
  
  try {
    const product = await queries.addProduct(
      answers.name,
      answers.category,
      parseFloat(answers.price),
      parseInt(answers.quantity),
      answers.supplierId
    );
    console.log(`\n✓ Product "${product.name}" added successfully! (ID: ${product.id})\n`);
  } catch (error) {
    console.log(`\n✗ Error adding product: ${error.message}\n`);
  }
}

// Restock a product
async function handleRestockProduct() {
  const products = await queries.viewAllProducts();
  
  if (products.length === 0) {
    console.log('\n⚠ No products available.\n');
    return;
  }
  
  const productChoices = products.map(p => ({
    name: `${p.name} (Current: ${p.quantity})`,
    value: p.id,
  }));
  
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'productId',
      message: 'Select a product to restock:',
      choices: productChoices,
    },
    {
      type: 'input',
      name: 'amount',
      message: 'Enter amount to add:',
      validate: (input) => {
        const num = parseInt(input);
        return !isNaN(num) && num > 0 ? true : 'Please enter a positive number';
      },
    },
  ]);
  
  try {
    const product = await queries.restockProduct(answers.productId, parseInt(answers.amount));
    console.log(`\n✓ Restocked "${product.name}". New quantity: ${product.quantity}\n`);
  } catch (error) {
    console.log(`\n✗ Error restocking product: ${error.message}\n`);
  }
}

// Record a sale
async function handleRecordSale() {
  const products = await queries.viewAllProducts();
  
  if (products.length === 0) {
    console.log('\n⚠ No products available.\n');
    return;
  }
  
  const productChoices = products.map(p => ({
    name: `${p.name} (Available: ${p.quantity})`,
    value: p.id,
  }));
  
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'productId',
      message: 'Select a product to sell:',
      choices: productChoices,
    },
    {
      type: 'input',
      name: 'amount',
      message: 'Enter amount to sell:',
      validate: (input) => {
        const num = parseInt(input);
        return !isNaN(num) && num > 0 ? true : 'Please enter a positive number';
      },
    },
  ]);
  
  try {
    const product = await queries.recordSale(answers.productId, parseInt(answers.amount));
    console.log(`\n✓ Sold ${answers.amount} of "${product.name}". Remaining quantity: ${product.quantity}\n`);
  } catch (error) {
    console.log(`\n✗ Error recording sale: ${error.message}\n`);
  }
}

// Update a product
async function handleUpdateProduct() {
  const products = await queries.viewAllProducts();
  
  if (products.length === 0) {
    console.log('\n⚠ No products available.\n');
    return;
  }
  
  const productChoices = products.map(p => ({
    name: `${p.name} ($${p.price})`,
    value: p.id,
  }));
  
  const suppliers = await queries.viewAllSuppliers();
  const supplierChoices = suppliers.map(s => ({ name: s.name, value: s.id }));
  supplierChoices.unshift({ name: 'Keep current supplier', value: null });
  
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'productId',
      message: 'Select a product to update:',
      choices: productChoices,
    },
    {
      type: 'input',
      name: 'price',
      message: 'Enter new price (leave blank to keep current):',
      validate: (input) => {
        if (!input.trim()) return true;
        const num = parseFloat(input);
        return !isNaN(num) && num >= 0 ? true : 'Please enter a valid price';
      },
    },
    {
      type: 'input',
      name: 'category',
      message: 'Enter new category (leave blank to keep current):',
    },
    {
      type: 'list',
      name: 'supplierId',
      message: 'Select new supplier:',
      choices: supplierChoices,
    },
  ]);
  
  const updates = {
    price: answers.price.trim() ? parseFloat(answers.price) : null,
    category: answers.category.trim() || null,
    supplierId: answers.supplierId,
  };
  
  try {
    const product = await queries.updateProduct(answers.productId, updates);
    console.log(`\n✓ Product "${product.name}" updated successfully!\n`);
  } catch (error) {
    console.log(`\n✗ Error updating product: ${error.message}\n`);
  }
}

// Delete a product
async function handleDeleteProduct() {
  const products = await queries.viewAllProducts();
  
  if (products.length === 0) {
    console.log('\n⚠ No products available.\n');
    return;
  }
  
  const productChoices = products.map(p => ({
    name: `${p.name} (Qty: ${p.quantity})`,
    value: p.id,
  }));
  
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'productId',
      message: 'Select a product to delete:',
      choices: productChoices,
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to delete this product?',
      default: false,
    },
  ]);
  
  if (!answers.confirm) {
    console.log('\n✗ Deletion cancelled.\n');
    return;
  }
  
  try {
    const product = await queries.deleteProduct(answers.productId);
    console.log(`\n✓ Product "${product.name}" deleted successfully!\n`);
  } catch (error) {
    console.log(`\n✗ Error deleting product: ${error.message}\n`);
  }
}

module.exports = {
  showMainMenu,
  handleViewAllProducts,
  handleViewLowInventory,
  handleViewAllSuppliers,
  handleAddSupplier,
  handleAddProduct,
  handleRestockProduct,
  handleRecordSale,
  handleUpdateProduct,
  handleDeleteProduct,
};
