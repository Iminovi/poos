const { Pool } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });
  
  try {
    const { rows } = await pool.query('SELECT * FROM events ORDER BY event_date DESC');
    // Akhiri koneksi
    await pool.end();
    
    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal mengambil data event.' }) };
  }
};
