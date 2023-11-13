<?php

/**
 * Class ParkingSpaceController
 * @class
 * @classdesc Controller for handling parking space-related operations.
 */
class ParkingSpaceController {
    /**
     * @var object $conn Database connection object.
     */
    private $conn;

    /**
     * Constructor for ParkingSpaceController class.
     * @constructor
     * @param object $conn Database connection object.
     */
    public function __construct($conn) {
        $this->conn = $conn;
    }

    /**
     * Get information about all parking spaces.
     * @function
     * @returns {object} Parking spaces information.
     */
    public function getAllParkingSpaces() {
        $totalSpaces = json_decode(file_get_contents("config/config.json"), true)["total_parking_spaces"];
        $sql = "SELECT COUNT(*) FROM vehicles";
        $result = $this->conn->query($sql);

        if ($result->num_rows > 0) {
            $availableSpaces = $totalSpaces -  $result->fetch_row()[0];
            echo json_encode(["AvailableSpaces" => $availableSpaces, "TotalSpaces" => $totalSpaces]);
        } else {
            echo json_encode(["error" => "Error fetching parking spaces: " . $this->conn->error]);
        }
    }
}
?>
