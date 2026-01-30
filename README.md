# Inventory Management Tracker

A command-line inventory management system built with Node.js and PostgreSQL that allows store owners to manage products, suppliers, and stock levels.

## Features

- ✅ View all products with supplier information
- ✅ View low inventory items based on threshold
- ✅ View all suppliers
- ✅ Add new products and suppliers
- ✅ Restock products (increase quantity)
- ✅ Record sales (decrease quantity with validation)
- ✅ Update product details (price, category, supplier)
- ✅ Delete products
- ✅ Prevent selling more items than available
- ✅ Data validation and error handling

## Technologies Used

- **Node.js** - JavaScript runtime
- **PostgreSQL** - Relational database
- **Inquirer 8.2.4** - Interactive command-line prompts
- **pg** - PostgreSQL client for Node.js
- **dotenv** - Environment variable management

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd /Users/joeryanomalley/Desktop/fullstackforbeginners/12-SQL/02-Challenge/inventory-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database:**
   
   Make sure PostgreSQL is installed and running on your system.
   
   Create and seed the database:
   ```bash
   psql -U postgres -f db/schema.sql
   psql -U postgres -d inventory_db -f db/seeds.sql
   ```

4. **Configure environment variables:**
   
   Copy the example env file:
   ```bash
   cp .env.EXAMPLE .env
   ```
   
   Edit `.env` with your PostgreSQL credentials:
   ```
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=inventory_db
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```

## Usage

Start the application:
```bash
npm start
```

### Main Menu Options

1. **View all products** - Display all products with details
2. **View low inventory** - Show products below a specified threshold
3. **View all suppliers** - List all suppliers
4. **Add a product** - Create a new product entry
5. **Add a supplier** - Create a new supplier entry
6. **Restock a product** - Increase product quantity
7. **Record a sale** - Decrease product quantity (with stock validation)
8. **Update a product** - Modify product price, category, or supplier
9. **Delete a product** - Remove a product from inventory
10. **Exit** - Close the application

## Database Schema

### Suppliers Table
```sql
id          SERIAL PRIMARY KEY
name        VARCHAR(60) UNIQUE NOT NULL
email       VARCHAR(100)
phone       VARCHAR(30)
```

### Products Table
```sql
id          SERIAL PRIMARY KEY
name        VARCHAR(60) UNIQUE NOT NULL
category    VARCHAR(40) NOT NULL
price       DECIMAL(10,2) NOT NULL CHECK (price >= 0)
quantity    INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0)
supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL
```

## Project Structure

```
inventory-tracker/
├── db/
│   ├── schema.sql      # Database schema definition
│   └── seeds.sql       # Sample data
├── src/
│   ├── index.js        # Main application entry point
│   ├── db.js           # Database connection configuration
│   ├── queries.js      # Database query functions
│   └── ui.js           # Inquirer prompts and menu system
├── .env                # Environment variables (not committed)
├── .env.EXAMPLE        # Example environment file
├── .gitignore          # Git ignore rules
├── package.json        # Project dependencies
└── README.md           # This file
```

## Example Walkthrough

1. Start the application with `npm start`
2. Select "View all products" to see current inventory
3. Select "View low inventory" to identify items that need restocking
4. Select "Restock a product" to increase quantity of low-stock items
5. Select "Record a sale" to decrease quantity when items are sold
6. The system prevents overselling (quantity cannot go below 0)

## Business Rules

- Products cannot have negative quantities
- Products cannot have negative prices
- Sales are rejected if insufficient stock is available
- Products can be associated with a supplier (optional)
- Deleting a supplier sets product supplier_id to NULL

## License

MIT

## Author

Built as part of the SQL Challenge for Full Stack Development Course
