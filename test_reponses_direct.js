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
    
    // Direct count
    const [count] = await connection.execute(
      'SELECT COUNT(*) as count FROM reponses WHERE question_id = 2380'
    );
    console.log('Count of reponses for question_id 2380:', count[0].count);
    
    // Get all reponses for this question
    const [reponses] = await connection.execute(
      'SELECT * FROM reponses WHERE question_id = 2380'
    );
    console.log('\nAll reponses:', reponses);
    
    // Check if there are ANY reponses at all
    const [anyReponses] = await connection.execute(
      'SELECT * FROM reponses LIMIT 5'
    );
    console.log('\nFirst 5 reponses in table:', anyReponses);
    
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}
test();
