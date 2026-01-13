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
    
    // Check the actual data types and values
    const [questions] = await connection.execute(
      'SELECT id, quiz_id, text FROM questions WHERE id = 2380'
    );
    console.log('Question 2380:', questions[0]);
    console.log('question_id type:', typeof questions[0].id);
    
    const [reponses] = await connection.execute(
      'SELECT id, question_id, text, is_correct FROM reponses WHERE question_id = 2380'
    );
    console.log('\nReponses for question_id 2380:', reponses.length);
    if (reponses.length > 0) {
      console.log('First reponse:', reponses[0]);
      console.log('reponse.question_id type:', typeof reponses[0].question_id);
    }
    
    // Try the join with explicit type casting
    const [joinResult] = await connection.execute(`
      SELECT q.id as q_id, r.id as r_id, r.text as r_text
      FROM questions q
      LEFT JOIN reponses r ON CAST(r.question_id AS UNSIGNED) = CAST(q.id AS UNSIGNED)
      WHERE q.id = 2380
    `);
    console.log('\nJoin with type casting:', joinResult);
    
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}
test();
