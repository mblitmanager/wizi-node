const fetch = require('node-fetch');
const fs = require('fs');

async function verifyQuizzes() {
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS53aXppLWxlYXJuLmNvbS9hcGkvbG9naW4iLCJpYXQiOjE3NjgyOTM4MzUsImV4cCI6MTc2ODM4MDIzNSwibmJmIjoxNzY4MjkzODM1LCJqdGkiOiJ2dVVUbmF0czBJQTJtcTBtIiwic3ViIjoiNyIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.m2dBPhG36L2b2CZCkPJXmwJLAT_EccBUBNZWEpLiCRA";
  
  const response = await fetch('http://localhost:3000/api/stagiaire/quizzes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    }
  });

  let log = `Testing GET /stagiaire/quizzes\n`;
  log += `Status: ${response.status}\n`;
  
  if (response.status === 200) {
    const data = await response.json();
    log += `Success: ${data.success}\n`;
    log += `Data Length: ${data.data ? data.data.length : 'undefined'}\n`;
    if (data.data && data.data.length > 0) {
        log += `Sample Quiz: ${JSON.stringify(data.data[0], null, 2)}\n`;
    }
  } else {
    const text = await response.text();
    log += `Error: ${text}\n`;
  }

  console.log(log);
  fs.writeFileSync('verify_quizzes_output.txt', log);
}

verifyQuizzes();
