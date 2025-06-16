import { Pool } from '@neondatabase/serverless';

export const handler = async (event, context) => {
  // Hanya izinkan metode POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Sederhana: cek password rahasia dari body request
  const body = JSON.parse(event.body);
  const { title, event_date, location, description, secret_password } = body;

  if (secret_password !== process.env.ADMIN_SECRET) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });
  
  try {
    const query = 'INSERT INTO events(title, event_date, location, description) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [title, event_date, location, description];
    const { rows } = await pool.query(query, values);
    
    await pool.end();
    
    return {
      statusCode: 201,
      body: JSON.stringify(rows[0]),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal menambahkan event.' }) };
  }
};
