-- Seeds for suppliers table
INSERT INTO suppliers (name, email, phone) VALUES
('Tech Supplies Inc', 'contact@techsupplies.com', '555-0100'),
('Office Essentials', 'sales@officeessentials.com', '555-0200'),
('Electronics World', 'info@electronicsworld.com', '555-0300'),
('Furniture Plus', 'orders@furnitureplus.com', '555-0400'),
('Stationery Express', 'help@stationeryexpress.com', '555-0500');

-- Seeds for products table
INSERT INTO products (name, category, price, quantity, supplier_id) VALUES
('Wireless Mouse', 'Electronics', 29.99, 45, 1),
('Mechanical Keyboard', 'Electronics', 89.99, 12, 1),
('USB-C Cable', 'Electronics', 12.99, 150, 3),
('Office Chair', 'Furniture', 249.99, 8, 4),
('Standing Desk', 'Furniture', 599.99, 3, 4),
('Notebook Set', 'Stationery', 9.99, 75, 5),
('Blue Pens (Pack of 10)', 'Stationery', 4.99, 200, 5),
('Laptop Stand', 'Electronics', 39.99, 25, 1),
('Monitor 27-inch', 'Electronics', 299.99, 2, 3),
('Desk Lamp', 'Furniture', 34.99, 18, 4),
('Stapler', 'Office Supplies', 7.99, 50, 2),
('Paper Ream (500 sheets)', 'Office Supplies', 5.99, 120, 2),
('Whiteboard Markers', 'Stationery', 8.99, 60, 5),
('File Folders (Pack of 25)', 'Office Supplies', 11.99, 40, 2),
('Wireless Headset', 'Electronics', 79.99, 15, 3);
