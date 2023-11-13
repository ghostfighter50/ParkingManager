<?php

require_once("controllers/PricingController.php");

/**
 * Class PricingRoutes
 * @class
 * @classdesc Handles routing for pricing-related requests.
 */
class PricingRoutes {

    /**
     * @var object $pricingController PricingController instance.
     */
    private $pricingController;

    /**
     * Constructor for PricingRoutes class.
     * @constructor
     * @param object $conn Database connection object.
     */
    public function __construct($conn) {
        $this->pricingController = new PricingController($conn);
    }

    /**
     * Handle incoming requests for pricing-related operations.
     * @function
     */
    public function handleRequest($uri, $method) {
        switch ($uri) {
            case "/api/pricing":
                if ($method === "POST") {
                    // Handle POST request to change pricing
                    $data = json_decode(file_get_contents("php://input"), true);
                    $this->pricingController->changePricing($data["vehicleType"], $data["newPrice"]);
                } elseif ($method === "GET") {
                    // Handle GET request to fetch pricing information
                    $this->pricingController->getPricing();
                }
                break;
        }
    }
}

?>
