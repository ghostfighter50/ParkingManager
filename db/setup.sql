-- Create "vehicles" table
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    arrival_time DATETIME NOT NULL
);

-- Create "pricing" table
CREATE TABLE IF NOT EXISTS pricing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type VARCHAR(255) NOT NULL,
    price_per_minute DECIMAL(10, 2) NOT NULL
);

-- Insert sample vehicles
INSERT INTO vehicles (type) VALUES
    ("Car"),
    ("Bus"),
    ("Motorcycle");

-- Insert sample pricing
INSERT INTO pricing (vehicle_type, price_per_minute) VALUES
    ("Car", 0.10),
    ("Bus", 0.20),
    ("Motorcycle", 0.05);
