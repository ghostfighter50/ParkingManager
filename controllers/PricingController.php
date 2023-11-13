<?php

/**
 * Class PricingController
 * @class
 * @classdesc Controller for handling pricing-related operations.
 */
class PricingController {
    /**
     * @var object $conn Database connection object.
     */
    private $conn;

    /**
     * Constructor for PricingController class.
     * @constructor
     * @param object $conn Database connection object.
     */
    public function __construct($conn) {
        $this->conn = $conn;
    }

    /**
     * Change pricing for a specific vehicle type.
     * @function
     * @param {string} $vehicleType - Type of the vehicle.
     * @param {float} $newPrice - New price per minute for the vehicle type.
     * @returns {object} Response message.
     */
    public function changePricing($vehicleType, $newPrice) {
        $response = [];
        $types = ["Bus", "Car", "Motorcycle"];

        if (empty($newPrice)) {
            $response['error'] = "Empty new price";
            echo json_encode($response);
            return;
        }

        if (!in_array($vehicleType, $types)) {
            $response['error'] = "Wrong vehicle type";
            echo json_encode($response);
            return;
        }

        if (!is_numeric($newPrice)) {
            $response['error'] = "Wrong price data type";
            echo json_encode($response);
            return;
        }

        $sql = "UPDATE pricing SET price_per_minute = ? WHERE vehicle_type = ?";
        $stmt = $this->conn->prepare($sql);

        if (!$stmt) {
            $response['error'] = "Prepare statement failed: " . $this->conn->error;
            echo json_encode($response);
            return;
        }

        $stmt->bind_param("ds", $newPrice, $vehicleType);

        if ($stmt->execute()) {
            $response['message'] = "Pricing updated successfully";
        } else {
            $response['error'] = "Error updating pricing: " . $stmt->error;
        }

        $stmt->close();
        echo json_encode($response);
    }

    /**
     * Get pricing information for all vehicle types.
     * @function
     * @returns {object} Pricing information.
     */
    public function getPricing() {
        $response = [];

        $sql = "SELECT * FROM pricing";
        $result = $this->conn->query($sql);

        if ($result) {
            $pricing = $result->fetch_all(MYSQLI_ASSOC);
            $response = $pricing;
        } else {
            $response['error'] = 'Error fetching pricing information: ' . $this->conn->error;
        }

        echo json_encode($response);
    }
}
?>
