<?php

/**
 * Class VehicleController
 * @class
 * @classdesc Controller for handling vehicle-related operations.
 */
class VehicleController {

    /**
     * @var object $conn Database connection object.
     */
    private $conn;

    /**
     * Constructor for VehicleController class.
     * @constructor
     * @param object $conn Database connection object.
     */
    public function __construct($conn) {
        $this->conn = $conn;
    }

    /**
     * Get all vehicles from the database.
     * @function
     * @returns {array} Array of vehicles.
     */
    public function getAllVehicles() {
        $sql = "SELECT * FROM vehicles";
        $result = $this->conn->query($sql);

        if ($result->num_rows > 0) {
            $vehicles = array();
            while ($row = $result->fetch_assoc()) {
                $vehicles[] = $row;
            }
            echo json_encode($vehicles);
            return $vehicles;
        } else {
            echo json_encode(['message' => 'No vehicles found']);
        }
    }

    /**
     * Get a specific vehicle by ID.
     * @function
     * @param {number} $vehicleID - The ID of the vehicle.
     * @returns {object} Vehicle details.
     */
    public function getVehicleById($vehicleID) {
        $sql = "SELECT * FROM vehicles WHERE id = $vehicleID";
        $result = $this->conn->query($sql);

        if ($result->num_rows > 0) {
            $vehicle = $result->fetch_assoc();
            echo json_encode($vehicle);
        } else {
            echo json_encode(['error' => 'Vehicle not found']);
        }
    }

    /**
     * Add a new vehicle to the database.
     * @function
     * @param {string} $vehicleType - Type of the vehicle.
     * @returns {object} Response message and the ID of the added vehicle.
     */
    public function addVehicle($vehicleType) {
        $arrivalTime = date("Y-m-d H:i:s"); // Get the current date and time

        if (empty($vehicleType)) {
            echo json_encode(["error" => "Empty vehicle type"]);
            return;
        }

        $sql = "INSERT INTO vehicles (type, arrival_time) VALUES (?, ?)";
        $stmt = $this->conn->prepare($sql);

        if ($stmt === false) {
            echo json_encode(["error" => "Prepare statement failed: " . $this->conn->error]);
            return;
        }

        $stmt->bind_param("ss", $vehicleType, $arrivalTime);

        if ($stmt->execute()) {
            // Fetch the last inserted ID
            $lastInsertId = $this->conn->insert_id;

            echo json_encode(["id" => $lastInsertId, "message" => "Vehicle added successfully"]);
        } else {
            echo json_encode(["error" => "Error executing statement: " . $stmt->error]);
        }

        $stmt->close();
    }

    /**
     * Remove a vehicle by ID from the database.
     * @function
     * @param {number} $vehicleID - The ID of the vehicle to be removed.
     * @returns {object} Response message.
     */
    public function removeVehicle($vehicleID) {
        $sql = "DELETE FROM vehicles WHERE id = $vehicleID";

        if ($this->conn->query($sql) === TRUE) {
            echo json_encode(['message' => 'Vehicle removed successfully']);
        } else {
            echo json_encode(['error' => 'Error removing vehicle: ' . $this->conn->error]);
        }
    }

    /**
     * Remove all vehicles from the database.
     * @function
     * @returns {object} Response message.
     */
    public function removeAllVehicles() {
        $sql = "DELETE FROM vehicles";

        if ($this->conn->query($sql) === TRUE) {
            echo json_encode(['message' => 'All vehicles removed successfully']);
        } else {
            echo json_encode(['error' => 'Error removing all vehicles: ' . $this->conn->error]);
        }
    }

    /**
     * Change the type of a vehicle by ID.
     * @function
     * @param {number} $vehicleID - The ID of the vehicle.
     * @param {string} $newType - The new type of the vehicle.
     * @returns {object} Response message.
     */
    public function changeVehicleType($vehicleID, $newType) {
        if (empty($newType)) {
            echo json_encode(["error" => "Empty new vehicle type"]);
            return;
        }

        $sql = "UPDATE vehicles SET type = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);

        if ($stmt === false) {
            echo json_encode(["error" => "Prepare statement failed: " . $this->conn->error]);
            return;
        }

        $stmt->bind_param("si", $newType, $vehicleID);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Vehicle type updated successfully']);
        } else {
            echo json_encode(['error' => 'Error updating vehicle type: ' . $stmt->error]);
        }

        $stmt->close();
    }
}

?>
