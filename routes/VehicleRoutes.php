<?php

require_once('controllers/VehicleController.php');
require_once('controllers/ParkingSpaceController.php');

/**
 * Class VehicleRoutes
 * @class
 * @classdesc Handles routing for vehicle-related requests.
 */
class VehicleRoutes {

    /**
     * @var object $vehicleController VehicleController instance.
     * @var object $parkingSpaceController ParkingSpaceController instance.
     */
    private $vehicleController;
    private $parkingSpaceController;

    /**
     * Constructor for VehicleRoutes class.
     * @constructor
     * @param object $conn Database connection object.
     */
    public function __construct($conn) {
        $this->parkingSpaceController = new ParkingSpaceController($conn);
        $this->vehicleController = new VehicleController($conn);
    }

    /**
     * Handle incoming requests for vehicle-related operations.
     * @function
     */
    public function handleRequest($uri, $method) {

        $vehicleId = null;
        if (strpos($uri, '/api/vehicles/') === 0) {
            $vehicleID = str_replace('/api/vehicles/', '', $uri);
        }

        switch ($uri) {
            case '/api/vehicles':
                if ($method === 'GET') {
                    return $this->vehicleController->getAllVehicles();
                } elseif ($method === 'POST') {
                    $data = json_decode(file_get_contents('php://input'), true);
                    return $this->vehicleController->addVehicle($data['vehicleType']);
                } elseif ($method === 'DELETE') {
                    $this->vehicleController->removeAllVehicles();
                }
                break;
            case '/api/vehicles/' + $vehicleId:
                if ($method === 'GET') {
                    return $this->vehicleController->getVehicleById($vehicleID);
                } elseif ($method === 'PUT') {
                    $data = json_decode(file_get_contents('php://input'), true);
                    return $this->vehicleController->changeVehicleType($vehicleId, $data['newVehicleType']);
                } elseif ($method === 'DELETE') {
                    return $this->vehicleController->removeVehicle($vehicleId);
                }
                break;
            case '/api/vehicles/search':
                if ($method === 'POST') {
                    $data = json_decode(file_get_contents('php://input'), true);
                    $this->vehicleController->getVehicleById($data['searchById']);
                }
                break;
        }
    }
}

?>
