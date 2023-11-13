<?php

require_once('controllers/ParkingSpaceController.php');

/**
 * Class ParkingSpaceRoutes
 * @class
 * @classdesc Handles routing for parking space-related requests.
 */
class ParkingSpaceRoutes {

    /**
     * @var object $parkingSpaceController ParkingSpaceController instance.
     */
    private $parkingSpaceController;

    /**
     * Constructor for ParkingSpaceRoutes class.
     * @constructor
     * @param object $conn Database connection object.
     */
    public function __construct($conn) {
        $this->parkingSpaceController = new ParkingSpaceController($conn);
    }

    /**
     * Handle incoming requests for parking space-related operations.
     * @function
     */
    public function handleRequest($uri, $method) {

        switch ($uri) {
            case '/api/spaces':
                if ($method === 'GET') {
                    $this->parkingSpaceController->getAllParkingSpaces();
                }
                break;
        }
    }
}

?>
