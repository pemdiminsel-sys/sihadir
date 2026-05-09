const { Client } = require('pg');
const connectionString = 'postgresql://postgres.nmosszhfxuwpkarwvlsk:OeoBFODd47vdQiDZ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require';

const client = new Client({
  connectionString: connectionString,
});

client.connect()
  .then(() => {
    console.log('Connected successfully');
    client.end();
  })
  .catch(err => {
    console.error('Connection error', err.stack);
    process.exit(1);
  });
