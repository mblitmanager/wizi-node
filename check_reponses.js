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
    
    // Check a specific question's responses
    const [responses] = await connection.execute(
      'SELECT * FROM reponses WHERE question_id = 2380'
    );
    console.log('Responses for question 2380:', responses.length);
    if (responses.length > 0) {
      console.log('Sample response:', responses[0]);
    }
    
    // Check column names in reponses table
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM reponses"
    );
    console.log('\nReponses table columns:');
    columns.forEach(col => console.log(`  - ${col.Field} (${col.Type})`));
    
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}
test();
