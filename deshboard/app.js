const express = require('express'),
	cors = require('cors'),
	secure = require('ssl-express-www');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const PORT = global.Akari.serverPort || process.PORT || 3000;

const apirouter = require('./routes/api.js')
const mainrouter = require('./routes/mainrouter.js')

app.enable('trust proxy');
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', mainrouter);
app.use('/api', apirouter);

app.use((req, res) => {
  res.json({
    status: false, 
    code: 404,
    message: 'page not foud',
    creator: 'Rahez'
  })
})

app.listen(PORT, (error) => {
	if (!error)
		console.log("APP LISTEN TO PORT " + PORT)
	else
		console.log("ERROR OCCUIRED")
});

module.exports = app
