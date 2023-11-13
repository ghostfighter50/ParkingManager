/**
 * Executes when the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', function () {
    /**
     * Extends the Date object to add hours.
     * @param {number} h - The number of hours to add.
     * @returns {Date} - The updated Date object.
     */
    Date.prototype.addHours = function (h) {
        this.setTime(this.getTime() + (h * 60 * 60 * 1000));
        return this;
    };

    /**
     * Displays parking spaces information.
     */
    function displayParkingSpaces() {
        const totalSpacesElement = document.getElementById('totalSpaces');
        const availableSpacesElement = document.getElementById('availableSpaces');

        // Fetch parking spaces information
        fetch('/api/spaces')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showAlert('danger', `Error: ${data.error}`);
                } else {
                    totalSpacesElement.innerText = data.TotalSpaces;
                    availableSpacesElement.innerText = data.AvailableSpaces;
                }
            });
    }

    /**
     * Displays pricing information for all vehicle types.
     */
    function displayPricing() {
        const pricingContainer = document.getElementById('allPricingContainer');
        pricingContainer.innerHTML = '<h4>Pricing for All Vehicle Types</h4>';

        // Fetch pricing data on page load
        fetch('/api/pricing')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showAlert('danger', `Error: ${data.error}`);
                } else {
                    data.forEach(pricing => {
                        const pricingInfo = `
                            <p><strong>${pricing.vehicle_type}</strong></p>
                            <p>Price per Minute: <strong><span class="detail">${pricing.price_per_minute} €</span></strong></p>
                            <hr>
                        `;
                        pricingContainer.innerHTML += pricingInfo;
                    });
                }
            });
    }

    /**
     * Fetches and populates user vehicle data.
     * @param {number} userVehicleID - The ID of the user's vehicle.
     */
    function fetchUserVehicleData(userVehicleID) {
        // Fetch vehicle data for the specific user
        fetch(`/api/vehicles/${userVehicleID}`)
            .then(response => response.json())
            .then(data => {
                const userVehicleInfo = document.getElementById('userVehicleInfo');
                userVehicleInfo.innerHTML = '';

                if (data.message) {
                    return userVehicleInfo.innerHTML = `<p>${data.message}</p>`;
                }

                if (data.error) {
                    showAlert('danger', `Error: ${data.error}`);
                } else {
                    const vehicle = data;

                    const vehicleInfo = `
                    <div class="details-container">
                    <p><strong>Vehicle ID:</strong> <span class="detail" id="vehicleID">${vehicle.id}</span></p>
                    <p><strong>Vehicle Type:</strong> <span class="detail" id="vehicleType">${vehicle.type}</span></p>
                    <p><strong>Arrival Time:</strong> <span class="detail" id="vehicleArrivalTime">${new Date(vehicle.arrival_time).addHours(1)}</span></p>
                    <button type="button" class="btn btn-danger leave-button" onclick="openLeaveModal(${vehicle.id})">
                        Leave Parking
                    </button>
                    </div>
                
                    `;
                    userVehicleInfo.innerHTML = vehicleInfo;
                }
            });
    }

    /**
     * Shows an alert message.
     * @param {string} type - The type of alert (e.g., 'info', 'danger').
     * @param {string} message - The alert message.
     */
    window.showAlert = function (type, message) {
        if(type === 'info'){
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
            alertDiv.innerHTML = `
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                ${message}
            `;
            document.getElementById('priceContainer').appendChild(alertDiv);
        } else {
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
    };

    /**
     * Opens the leave parking modal.
     */
    window.openLeaveModal = function () {
        // Fetch and display pricing information based on the user's vehicle type
        fetch('/api/pricing')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showAlert('danger', `Error: ${data.error}`);
                } else {
                    const ParkingTime = document.getElementById('vehicleArrivalTime').innerText
                    const userVehicleType = document.getElementById('vehicleType').innerText;
                    const pricingInfo = `
                        <p>Vehicle Type: <strong>${userVehicleType}</strong></p>
                        <p>Price per Minute: <span class="detail"><strong>${getPricingForVehicleType(data, userVehicleType)} €</strong></span></p>
                        <p>Vehicle Type: <strong>${ParkingTime}</strong></p>
                        <hr>
                    `;
                    document.getElementById('userVehiclePricingInfo').innerHTML = pricingInfo;
                    $('#leaveParkingModal').modal('show');
                }
            });
    };

    /**
     * Calculates and displays the price.
     */
    window.calculateAndDisplayPrice = function () {
        const arrivalTime = document.getElementById('vehicleArrivalTime').innerText;
        const userVehicleType = document.getElementById('vehicleType').innerText;

        const currentTime = new Date();
        const elapsedMinutes = Math.round((currentTime.getTime() - new Date(arrivalTime).getTime()) / 60000);

        // Fetch pricing data to get the price per minute for the user's vehicle type
        fetch('/api/pricing')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showAlert('danger', `Error: ${data.error}`);
                } else {
                    const pricePerMinute = getPricingForVehicleType(data, userVehicleType);
                    const totalPrice = elapsedMinutes * pricePerMinute;
                    showAlert('info', `Calculated Price: ${totalPrice.toString()} EUR`);

                    // Show proceed to payment button
                    document.getElementById('proceedToPaymentBtn').classList.remove('invisible');
                    document.getElementById('CalculateBtn').classList.add('invisible');
                }
            });
    };

    /**
     * Retrieves pricing for a specific vehicle type.
     * @param {Array} pricingData - The array of pricing data.
     * @param {string} vehicleType - The type of the vehicle.
     * @returns {number} - The price per minute for the specified vehicle type.
     */
    function getPricingForVehicleType(pricingData, vehicleType) {
        const vehiclePricing = pricingData.find(pricing => pricing.vehicle_type === vehicleType);
        return vehiclePricing ? vehiclePricing.price_per_minute : 0;
    }

    /**
     * Adds a new vehicle for the user.
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
                // Add any other necessary data like user ID or arrival time
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error ){
                    document.getElementById('AddVehicleBtn').classList.remove('invisible');
                    return showAlert('danger', `Error: ${data.error}`);}
                if (data.message) showAlert('success', data.message);
                fetchUserVehicleData(data.id); // Fetch and update the user's vehicle data
                displayParkingSpaces();
            });
    };

    // Initial setup
    document.getElementById('ConfirmAddVehicle').addEventListener('click', function () {
        $('#addVehicleModal').modal('hide');
        document.getElementById('AddVehicleBtn').classList.add('invisible');
    });

    // Event listener for the "Proceed to Payment" button
    document.getElementById('proceedToPaymentBtn').addEventListener('click', function () {
        const vehicleId = document.getElementById('vehicleID').innerText;
        // Remove the car when the payment is made
        fetch(`/api/vehicles/${vehicleId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(vehicle => {
                if (vehicle.error) {
                    return showAlert('danger', `Error: ${vehicle.error}`);
                }
                if (vehicle.message) {
                    return showAlert('success', `${vehicle.message}`);
                }
            })
        // Display "Follow instructions on the terminal" modal
        $('#instructionsModal').modal('show');
        // Redirect to home page
        setTimeout(() => {
            return window.location.href = '/'
        }, 10000);
    });

    // Call initial functions
    displayParkingSpaces();
    displayPricing();
});
