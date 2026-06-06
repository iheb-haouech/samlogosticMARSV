"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generate_id_1 = require("./generate-id");
function testGenerateCustomTrackingID() {
    // Define some mock user objects for testing
    var testUsers = [
        {
            id: 46,
            companyName: 'Example', // Company name starts with 'E'
        },
        {
            id: 12,
            companyName: 'TechCorp', // Company name starts with 'T'
        },
        {
            id: 99,
            companyName: '', // No company name provided
        },
        {
            id: 5,
            companyName: null, // Null company name
        },
    ];
    // Execute the function for each user and log the result
    testUsers.forEach(function (user, index) {
        var trackingID = (0, generate_id_1.default)(user);
        console.log("Test Case ".concat(index + 1, ":"), { user: user, trackingID: trackingID });
    });
}
// Execute the test function
testGenerateCustomTrackingID();
