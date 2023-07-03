require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 2022;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('mongodb connected !!!');
  })
  .catch((err) => {
    console.log(err);
  });
app.get('/', function (req, res) {
  res.send('hello world')
  })
app.use('/auth', require('./src/router/auth'));
app.use('/user', require('./src/router/user'));
app.use('/product', require('./src/router/product'));
app.use('/order', require('./src/router/order'));
app.use('/cart', require('./src/router/cart'));
app.use("/checkout", require('./src/router/stripe'));


app.listen(PORT, () => console.log('your port has been started on ' + PORT));
