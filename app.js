// - - - - - - - - - - - - - - - - dependencies
 express = require("express");
 app = express();
 axios = require("axios"); 
 dtformat = "YYYY-MM-DD";
 require('dotenv').config();
 qs = require('qs');
 updateDotenv = require('update-dotenv');
 cors = require('cors');
 helmet = require('helmet');
 fs = require('fs');
 const path = require("path") 

var basicRouter = require('./routes/routes');
// var TokenCtrl = require('./controllers/token');
// var cron = require('./cron_sync_services');
// - - - - - - - - - - - - - - - - - middleware 
// app.use(cors())
app.use(helmet());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'uploads')))

/*app.use(cors({
  origin: function (origin, callback) {
  	//console.log('ORIGIN', origin)
    if ([
      null,
      'null',
    	undefined,
    'http://127.0.0.1:4000',
		'http://localhost:4000', 
		'http://localhost:4200', 
    ].indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))*/

app.use((req, res, next) => {
  //const origin = req.get('origin');

  // TODO Add origin validation
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

  // intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
});

// - - - - - - - - - - - - - - - - - routing

// app.use(function (req, res, next) {
//     TokenCtrl.fetchOrUpdateToken(next);
//     //next();
// });

app.use('/', basicRouter);

// - - - - - - - - - - - - - - - - - server

app.listen(50000, () => {
 console.log("ost Server running on port 50000");
 //fetchOrUpdateToken();
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
