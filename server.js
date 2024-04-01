'use strict';

const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');

const app = require('./src/app');

dotenv.config();

mongoose.set('debug', true);
mongoose.set('debug', { color: true });

mongoose
  .connect(process.env.DATABASE_DEV)
  .then((_) => {
    console.log('Mongo connection successful!');
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
