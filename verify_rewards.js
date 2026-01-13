
const fs = require('fs');

async function verify() {
  const baseUrl = 'http://localhost:3000/api';
  let log = 'Testing GET /stagiaire/rewards...\n';
  
  try {
    const res = await fetch(`${baseUrl}/stagiaire/rewards`, {
      headers: {
        'Authorization': 'Bearer ' + process.env.JWT_TOKEN 
      }
    }); 
    log += `Status: ${res.status}\n`;
    
    if (res.status === 200 || res.status === 201) {
      const data = await res.json();
      log += `Success: ${data.success}\n`;
      log += `Points: ${data.data?.points}\n`;
      log += `Completed Quizzes: ${data.data?.completed_quizzes}\n`;
      log += `Payload: ${JSON.stringify(data.data, null, 2)}\n`;
    } else {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        log += `Error Message: ${json.message}\n`;
        log += `Error Stack: ${json.stack || 'No stack'}\n`;
      } catch (e) {
        log += `Error Body (Text): ${text}\n`;
      }
    }
  } catch (err) {
    log += `Fetch error: ${err.message}\n`;
  }
  
  console.log(log);
  fs.writeFileSync('verify_rewards_output.txt', log);
}
verify();
