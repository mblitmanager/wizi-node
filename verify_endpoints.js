
async function testEndpoints() {
  const baseUrl = 'http://localhost:3000/api';

  try {
    console.log('Testing GET /test-notif...');
    const notifRes = await fetch(`${baseUrl}/test-notif`);
    console.log('GET /test-notif STATUS:', notifRes.status);
    const notifText = await notifRes.text();
    console.log('GET /test-notif DATA:', notifText);
  } catch (error) {
    console.error('GET /test-notif FAILED:', error.message);
  }

  console.log('-----------------------------------');

  try {
    console.log('Testing POST /test-fcm...');
    const fcmRes = await fetch(`${baseUrl}/test-fcm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Test Title',
        body: 'Test Body'
      })
    });
    console.log('POST /test-fcm STATUS:', fcmRes.status);
    const fcmJson = await fcmRes.json();
    console.log('POST /test-fcm DATA:', fcmJson);
  } catch (error) {
    console.error('POST /test-fcm FAILED:', error.message);
  }
}

testEndpoints();
