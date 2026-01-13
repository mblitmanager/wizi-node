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
    const [qCount] = await connection.execute('SELECT COUNT(*) as count FROM questions');
    console.log('Question count:', qCount[0].count);
    
    const [sampleQ] = await connection.execute('SELECT * FROM questions LIMIT 1');
    console.log('Sample question:', sampleQ[0]);
    
    const [sampleQuiz] = await connection.execute('SELECT * FROM quizzes LIMIT 1');
    console.log('Sample quiz:', sampleQuiz[0]);

    if (sampleQ[0]) {
        const quizId = sampleQ[0].quiz_id;
        console.log('Sample question quiz_id:', quizId, 'type:', typeof quizId);
    }
    
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}
test();
