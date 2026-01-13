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
    
    // Check if ANY reponses have non-NULL question_id
    const [nonNullCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM reponses WHERE question_id IS NOT NULL
    `);
    console.log('Reponses with non-NULL question_id:', nonNullCount[0].count);
    
    // Get sample of non-NULL reponses
    const [nonNullReponses] = await connection.execute(`
      SELECT * FROM reponses WHERE question_id IS NOT NULL LIMIT 5
    `);
    console.log('\nSample non-NULL reponses:');
    console.log(nonNullReponses);
    
    // Check total count
    const [totalCount] = await connection.execute(`
      SELECT COUNT(*) as count FROM reponses
    `);
    console.log('\nTotal reponses:', totalCount[0].count);
    
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}
test();
