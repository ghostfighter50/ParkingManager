/**
 * Executes when the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
    /**
     * Fetches and populates vehicles data.
     */
    function fetchVehiclesData() {
        // Fetch vehicles data
        fetch('/api/vehicles')
            .then(response => response.json())
            .then(data => {
                const vehiclesTableBody = document.getElementById('vehiclesTableBody');
                vehiclesTableBody.innerHTML = '';

                if (data.message) {
                    return vehiclesTableBody.innerHTML = `<tr><td colspan="4">${data.message}</td></tr>`;
                }
                if (data.error) {
                    return showAlert('danger', `Error: ${data.error}`);
                }
                
                data.forEach(vehicle => {
                    const row = `
                        <tr>
                            <td><span class="detail">${vehicle.id}</span></td>
                            <td>${vehicle.type}</td>
                            <td>${vehicle.arrival_time}</td>
                            <td>
                                <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal"
                                    data-bs-target="#editVehicleModal" onclick="editVehicle(${vehicle.id}, '${vehicle.type}')">
                                    Edit
                                </button>
                                <p></p>
                                <button type="button" class="btn btn-danger btn-sm" onclick="removeVehicle(${vehicle.id})">
                                    Remove
                                </button>
                            </td>
                        </tr>`;
                    vehiclesTableBody.innerHTML += row;
                });
            });

        // Fetch spaces data
        fetch('/api/spaces')
            .then(response => response.json())
            .then(data => {
                const availableSpaces = document.getElementById('availableSpaces');
                const totalSpaces = document.getElementById('totalSpaces');
                const removeAllButton = document.getElementById('RemoveAllButton');

                availableSpaces.innerHTML = `<span class="detail">${data.AvailableSpaces}</span>`;
                totalSpaces.innerHTML = `<span class="detail">${data.TotalSpaces}</span>`;

                if (data.AvailableSpaces === data.TotalSpaces) {
                    removeAllButton.disabled = true;
                } else if (data.AvailableSpaces < data.TotalSpaces) {
                    removeAllButton.disabled = false;
                }
            });
    }

    /**
     * Searches for vehicles based on the given ID.
     */
    window.searchVehicles = function () {
        const searchById = document.getElementById('searchById').value;
        if (searchById === '') return fetchVehiclesData()
        fetch(`/api/vehicles/${searchById}`)
            .then(response => response.json())
            .then(vehicle => {
                if (vehicle.error) {
                    return showAlert('danger', `Error: ${vehicle.error}`);
                }
                if (vehicle.message) {
                    return showAlert('success', `${vehicle.message}`);
                }

                const row = `
                    <tr>
                        <td><span class="detail">${vehicle.id}</span></td>
                        <td>${vehicle.type}</td>
                        <td>${vehicle.arrival_time}</td>
                        <td>
                            <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal"
                                data-bs-target="#editVehicleModal" onclick="editVehicle(${vehicle.id}, '${vehicle.type}')">
                                Edit
                            </button>
                            <button type="button" class="btn btn-danger btn-sm" onclick="removeVehicle(${vehicle.id})">
                                Remove
                            </button>
                        </td>
                    </tr>`;
                vehiclesTableBody.innerHTML = row;
            });
    };

    /**
     * Adds a new vehicle.
     */
    window.addVehicle = function () {
        const vehicleType = document.getElementById('addVehicleType').value;

        fetch('/api/vehicles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                vehicleType: vehicleType,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    return showAlert('danger', `Error: ${data.error}`);
                }
                showAlert('success', 'Vehicle added successfully!');
                fetchVehiclesData();
                document.getElementById('addVehicleType').value = '';
                $('#addVehicleModal').modal('hide');
            });
    };

    /**
     * Updates the pricing information.
     */
    window.updatePricing = function () {
        const vehicleType = document.getElementById('managePricingVehicleType').value;
        const newPrice = document.getElementById('newPrice').value;

        fetch('/api/pricing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'change_pricing',
                vehicleType: vehicleType,
                newPrice: newPrice,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    return showAlert('danger', `Error: ${data.error}`);
                }
                $('#managePricingModal').modal('hide');
                document.getElementById('managePricingVehicleType').value = '';
                document.getElementById('newPrice').value = '';
                showAlert('success', 'Pricing updated successfully!');
            });
    };

    /**
     * Shows pricing information.
     */
    window.showPricings = function () {
        fetch('/api/pricing')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    return showAlert('danger', `Error: ${data.error}`);
                }

                const pricingData = document.getElementById('pricingData');
                pricingData.innerHTML = '';
                data.forEach(pricing => {
                    const pricingInfo = `
                        <p><span class="detail">${pricing.vehicle_type}</span></p>
                        <p>Price per Minute: <span class="detail">${pricing.price_per_minute} €</span></p>
                        <hr>
                    `;
                    pricingData.innerHTML += pricingInfo;
                });
                $('#showPricingsModal').modal('show');
            });
    };

    /**
     * Edits a vehicle based on its ID.
     */
    window.editVehicle = function (vehicleID, vehicleType) {
        // Populate the edit form with the current data
        document.getElementById('editVehicleID').value = vehicleID;
        document.getElementById('editVehicleType').value = vehicleType;
    };

    /**
     * Removes a vehicle based on its ID.
     */
    window.removeVehicle = function (vehicleID) {
        fetch(`/api/vehicles/${vehicleID}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    return showAlert('danger', `Error: ${data.error}`);
                }
                showAlert('success', 'Successfully removed the vehicle');
                fetchVehiclesData();
            });
    };

    /**
     * Confirms the removal of all vehicles.
     */
    window.confirmRemoveAllVehicles = function () {
        fetch('/api/vehicles', {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    return showAlert('danger', `Error: ${data.error}`);
                }
                showAlert('success', 'All vehicles removed successfully!');
                fetchVehiclesData();
            });

        $('#removeAllConfirmationModal').modal('hide');
    };

    /**
     * Updates the vehicle type.
     */
    window.updateVehicleType = function () {
        const vehicleID = document.getElementById('editVehicleID').value;
        const newVehicleType = document.getElementById('editVehicleType').value;

        fetch(`/api/vehicles/${vehicleID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newVehicleType: newVehicleType,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    return showAlert('danger', `Error: ${data.error}`);
                }
                showAlert('success', 'Vehicle type updated successfully!');
                fetchVehiclesData();
                $('#editVehicleModal').modal('hide');
            });
    };

    /**
     * Shows an alert message.
     * @param {string} type - The type of the alert (e.g., 'success', 'danger').
     * @param {string} message - The message to display in the alert.
     */
    function showAlert(type, message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertDiv.innerHTML = `
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            ${message}
        `;
        document.getElementById('alertsContainer').appendChild(alertDiv);

        // Automatically remove the alert after 3 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Fetch and populate vehicles data on page load
    fetchVehiclesData();
});
