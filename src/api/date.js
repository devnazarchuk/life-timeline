import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { date } = req.query;

  if (req.method === 'GET') {
    const dateEntry = await prisma.dateEntry.findUnique({
      where: { date },
    });
    if (dateEntry) {
      res.status(200).json(dateEntry);
    } else {
      res.status(404).json({ message: 'Date entry not found' });
    }
  } else if (req.method === 'POST') {
    const { textEntries, images, videos, musicLinks } = req.body;

    const dateEntry = await prisma.dateEntry.upsert({
      where: { date },
      update: { textEntries, images, videos, musicLinks },
      create: { date, textEntries, images, videos, musicLinks },
    });

    res.status(200).json(dateEntry);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
