
async function verify() {
  const baseUrl = 'http://localhost:3000/api';
  console.log('Testing GET /stagiaires/3/details...');
  try {
    const res = await fetch(`${baseUrl}/stagiaires/3/details`, {
      headers: {
        'Authorization': 'Bearer ' + process.env.JWT_TOKEN // We might need a token if guarded
      }
    }); 
    console.log('Status:', res.status);
    if (res.status === 200) {
      console.log('Success! Data retrieved.');
      const data = await res.json();
      console.log('Keys:', Object.keys(data));
    } else {
      const text = await res.text();
      console.log('Error Status:', res.status);
      console.log('Error Body:', text);
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
verify();
