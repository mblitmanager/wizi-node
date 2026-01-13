const mysql = require('mysql2/promise');
async function test() {
  try {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'wizi',
        password: 'Test1234',
        database: 'wizi2'
    });
    
    // Get the EXACT data Laravel would see
    const [questions] = await connection.execute(`
      SELECT 
        q.id, 
        q.text,
        q.quiz_id,
        GROUP_CONCAT(r.id) as reponse_ids,
        GROUP_CONCAT(r.text) as reponse_texts
      FROM questions q
      LEFT JOIN reponses r ON r.question_id = q.id
      WHERE q.id = 2380
      GROUP BY q.id
    `);
    
    console.log('Question 2380 with aggregated reponses:');
    console.log(questions[0]);
    
    // Now get individual reponses
    const [reponses] = await connection.execute(`
      SELECT * FROM reponses WHERE question_id = 2380
    `);
    console.log('\nIndividual reponses for question 2380:');
    console.log(reponses);
    
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}
test();
