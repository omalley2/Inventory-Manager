const pool = require('./db');
const ui = require('./ui');

console.log(`
╔═══════════════════════════════════════════════╗
║   📦 INVENTORY MANAGEMENT SYSTEM 📦          ║
╚═══════════════════════════════════════════════╝
`);

async function main() {
  let exit = false;

  while (!exit) {
    try {
      const action = await ui.showMainMenu();

      switch (action) {
        case 'View all products':
          await ui.handleViewAllProducts();
          break;
        case 'View low inventory':
          await ui.handleViewLowInventory();
          break;
        case 'View all suppliers':
          await ui.handleViewAllSuppliers();
          break;
        case 'Add a product':
          await ui.handleAddProduct();
          break;
        case 'Add a supplier':
          await ui.handleAddSupplier();
          break;
        case 'Restock a product':
          await ui.handleRestockProduct();
          break;
        case 'Record a sale':
          await ui.handleRecordSale();
          break;
        case 'Update a product':
          await ui.handleUpdateProduct();
          break;
        case 'Delete a product':
          await ui.handleDeleteProduct();
          break;
        case 'Exit':
          console.log('\n👋 Thank you for using Inventory Management System!\n');
          exit = true;
          break;
      }
    } catch (error) {
      console.error('\n✗ An error occurred:', error.message);
      console.log('');
    }
  }

  await pool.end();
  process.exit(0);
}

main();
