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
    
    // Find questions from quiz 81 that HAVE reponses
    const [questionsWithReponses] = await connection.execute(`
      SELECT q.id, q.text, COUNT(r.id) as reponse_count
      FROM questions q
      INNER JOIN reponses r ON r.question_id = q.id
      WHERE q.quiz_id = 81
      GROUP BY q.id
      LIMIT 5
    `);
    
    console.log('Questions from quiz 81 that have reponses:');
    console.log(questionsWithReponses);
    
    if (questionsWithReponses.length > 0) {
      const questionId = questionsWithReponses[0].id;
      const [reponses] = await connection.execute(`
        SELECT * FROM reponses WHERE question_id = ?
      `, [questionId]);
      
      console.log(`\nReponses for question ${questionId}:`);
      console.log(reponses);
    }
    
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}
test();
