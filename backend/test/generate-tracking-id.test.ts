import generateCustomTrackingID from './generate-id';

function testGenerateCustomTrackingID() {
  const date = new Date('2026-05-09T00:00:00.000Z');
  const testUsers = [{ id: 46 }, { id: 12 }, { id: 99 }, { id: 5 }];

  testUsers.forEach((user, index) => {
    const trackingID = generateCustomTrackingID(user, index + 1, date);
    console.log(`Test Case ${index + 1}:`, { user, trackingID });
  });
}

testGenerateCustomTrackingID();
