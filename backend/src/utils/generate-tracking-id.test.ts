import generateCustomTrackingID from './generate-id';

function testGenerateCustomTrackingID() {
  // Define some mock user objects for testing
  const testUsers = [
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
  testUsers.forEach((user, index) => {
    const trackingID = generateCustomTrackingID(user);
    console.log(`Test Case ${index + 1}:`, { user, trackingID });
  });
}

// Execute the test function
testGenerateCustomTrackingID();
