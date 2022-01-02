const express = require('express');
const multer = require('multer');
const path = require('path');

const UPLOAD_FOLDER = './uploads/';

const app = express();

//** Define Disk Storage */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    const extName = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(extName, '')
        .toLowerCase()
        .split(' ')
        .join('-') +
      '-' +
      Date.now();

    cb(null, fileName + extName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Try to upload jpg, png or jpeg format'));
      }
    } else if (file.fieldname === 'doc') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only pdf format support'));
      }
    }
  },
});

app.post(
  '/',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'doc', maxCount: 1 },
  ]),
  (req, res) => {
    console.log(req.files);
    res.send('Welcome to server');
  }
);

//** Error Middleware */

app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.send('There was a upload error');
    } else {
      res.send(err.message);
    }
  } else {
    res.send('success');
  }
});

const port = 5000;
app.listen(port, () => console.log(`Server up and running on ${port}`));
