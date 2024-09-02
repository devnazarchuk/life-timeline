import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = async (req, res) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), 'public/uploads');
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const file = files.file;
      const filePath = `/uploads/${file.newFilename}`;

      res.status(200).json({ filePath });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default uploadHandler;