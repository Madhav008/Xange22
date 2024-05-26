const express = require('express');
const app = express();
const authRoutes = require('./api/routes/auth');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require("cookie-parser"); // parse cookie header
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

require('./initDB')();
require('dotenv').config();


// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(morgan('dev'));

// parse cookies
app.use(cookieParser());


app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.1.65:5173", "http://localhost:3000", "http://localhost:5125", "http://192.168.1.124:5125", "https://admin.fanxange.live", "http://admin.fanxange.live", "https://fanxange.live", "http://fanxange.live"], // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

app.use('/auth', authRoutes);

const matches = require('./api/routes/matches')
app.use('/ipo', matches)


const player = require('./api/routes/player')
app.use('/player', player)


const order = require('./api/routes/order');
app.use("/order", order)


const wallet = require('./api/routes/wallet');
app.use("/wallet", wallet);

const fees = require('./api/routes/fees');
app.use('/fees', fees);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT + '...');
});
