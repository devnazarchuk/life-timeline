import db from '../../db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await db.query('SELECT * FROM users');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
