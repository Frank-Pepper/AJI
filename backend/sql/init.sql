-- Create Categories table
CREATE TABLE IF NOT EXISTS Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create Products table
CREATE TABLE IF NOT EXISTS Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit_price DECIMAL(10, 2) NOT NULL,
    unit_weight DECIMAL(10, 3) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

-- Create OrderStatuses table
CREATE TABLE IF NOT EXISTS OrderStatuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    confirmation_date DATE,
    status_id INT NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    FOREIGN KEY (status_id) REFERENCES OrderStatuses(id)
);

-- Create OrderItems table (to store product quantities for each order)
CREATE TABLE IF NOT EXISTS OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Insert initial Categories data
INSERT INTO Categories (name) VALUES 
('Electronics'),
('Books'),
('Furniture');

-- Insert initial OrderStatuses data
INSERT INTO OrderStatuses (name) VALUES
('NIEZATWIERDZONE'), -- NOT CONFIRMED
('ZATWIERDZONE'),    -- CONFIRMED
('ANULOWANE'),       -- CANCELLED
('ZREALIZOWANE');     -- COMPLETED

-- Insert initial Products data
INSERT INTO Products (name, description, unit_price, unit_weight, category_id) VALUES 
('Laptop', 'High-end gaming laptop', 1500.00, 2.5, 1), 
('Book A', 'A great book', 25.99, 0.5, 2),
('Sofa', 'Comfortable leather sofa', 499.99, 50, 3);

-- Insert an example order
INSERT INTO Orders (confirmation_date, status_id, username, email, phone_number) VALUES
('2024-12-03', 2, 'john_doe', 'john.doe@example.com', '123-456-789');

-- Insert order items for the order (order ID is assumed to be 1 here)
INSERT INTO OrderItems (order_id, product_id, quantity) VALUES
(1, 1, 1), -- 1 Laptop
(1, 2, 2); -- 2 Books
