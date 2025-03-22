require("./api.js")
__path = process.cwd()
const express = require('express');
const router = express.Router()

router.get('/', (req, res) => {
  res.sendFile(__path + '/view/paste.html')
})

module.exports = router