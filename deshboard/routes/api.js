const axios = require('axios');
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

let creator = 'Rahez Gemini'
log = {
  error: {
    status: false,
    code: 503,
    message: "service got error, try again in 10 seconds",
    creator: creator
  },
  noturl: {
    status: false,
    code: 503,
    message: "enter paramater url",
    creator: creator
  },
  nottext: {
    status: false,
    code: 503,
    message: "enter parameter text",
    creator: creator
  },
  notquery: {
    status: false,
    code: 503,
    message: "enter parameter query",
    creator: creator
  },
  notusername: {
    status: false,
    code: 503,
    message: "enter parameter username",
    creator: creator
  },
  filenotfoud: {
    status: false, 
    code: 503,
    message: "File Not Foud",
    creator: creator
  }
}

 const upload = multer({ dest: 'uploads/' })

function generateRandomFilename() {
  return uuidv4().slice(0, 5);
}

router.get('/paste', (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({
      status: false,
      code: 503,
      message: 'enter params code',
      creator: creator
    });
  }

  const randomFilename = generateRandomFilename();
  const filePath = path.join(__dirname, 'files', `${randomFilename}.txt`);

  fs.writeFile(filePath, code, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: false, 
        code: 502,
        message: 'failed saving files',
        creator: creator
      });
    }
    res.json({
      message: 'Successfully save the file',
      raw: `/paste/raw/${randomFilename}.txt`
    });
  });
});

router.post('/paste', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileExtension = path.extname(req.file.originalname).toLowerCase();
  if (!['.js', '.php', '.txy'].includes(fileExtension)) {
    return res.status(400).json({
      status: false, 
      code: 504,
      message: 'Invalid file extension. Only .js, .php, and .txt are allowed.',
      creator: creator
    });
  }

  const randomFilename = generateRandomFilename();
  const filePath = path.join(__dirname, 'files', `${randomFilename}.txt`);
  const targetFilePath = path.join(__dirname, 'files', `${randomFilename}${fileExtension}`);

  fs.renameSync(req.file.path, targetFilePath);

  res.json({
    message: `File saved as ${randomFilename}${fileExtension}`,
    raw: `/paste/raw/${randomFilename}${fileExtension}`
  });
});

router.get('/raw/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, './', 'files', `${filename}.txt`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: false,
      code: 404,
      message: 'file not foud',
      creator: creator
    });
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  res.send(fileContent);
});

router.get('/uptime', (req, res) => {
  res.json({
    status: true, 
    message: 'Server status OK'
  })
})

router.get('/test', (req, res) => {
  res.json({
    status: true,
    message: 'test sucesfully'
  })
})

module.exports = router;