-- Drop database if it exists and create fresh
DROP DATABASE IF EXISTS inventory_db;
CREATE DATABASE inventory_db;

-- Connect to the database
\c inventory_db;

-- Create suppliers table
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) UNIQUE NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(30)
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) UNIQUE NOT NULL,
    category VARCHAR(40) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL
);
