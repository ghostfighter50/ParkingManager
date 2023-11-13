<?php
// Database connection parameters
$servername = json_decode(file_get_contents('config/config.json'), true)['db']['host'];
$username = json_decode(file_get_contents('config/config.json'), true)['db']['username'];
$password = json_decode(file_get_contents('config/config.json'), true)['db']['password'];
$dbname = json_decode(file_get_contents('config/config.json'), true)['db']['dbname'];

// Establishing a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for connection errors
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Require necessary route files
require_once('routes/VehicleRoutes.php');
require_once('routes/PricingRoutes.php');
require_once('routes/ParkingSpaceRoutes.php');

// Creating instances of route handlers with the database connection
$vehicleRoutes = new VehicleRoutes($conn);
$pricingRoutes = new PricingRoutes($conn);
$parkingSpaceRoutes = new ParkingSpaceRoutes($conn);

// Retrieve the HTTP method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Routing logic based on the URI
switch ($uri) {
    case '/':
        // Home page
        require_once('public/html/home.html');
        break;
    case '/dashboard':
        // User dashboard page
        require_once('public/html/user_dashboard.html');
        break;
    case '/admin':
        // Admin dashboard page
        require_once('public/html/admin_dashboard.html');
        break;
    default:
        // Delegate to appropriate route handler for API routes
        if ($uri === '/api/vehicles') {
            $vehicleRoutes->handleRequest($uri, $method);
        } elseif ($uri === '/api/pricing') {
            $pricingRoutes->handleRequest($uri, $method);
        } elseif ($uri === '/api/spaces') {
            $parkingSpaceRoutes->handleRequest($uri, $method);
        } else {
            // Redirect to the home page for unknown routes
            echo http_response_code(301);
            echo header('Location: /');
            break;
        }
        break;
}

// Close the database connection
$conn->close();
?>
