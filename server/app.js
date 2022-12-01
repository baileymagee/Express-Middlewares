const express = require('express');
const app = express();
require('express-async-errors');
const dogsRouter = require('./routes/dogs.js')
const foodRouter = require('./routes/dog-foods.js')

app.use('/dogs', dogsRouter);
app.use('/dogs', foodRouter)
require('dotenv').config()

app.use('/static', express.static('assets'));

app.use(express.json())

app.use((req, res, next) => {
  console.log(req.url, req.method);
  res.on('finish', () => {
    // read and log the status code of the response
    console.log(res.statusCode);
  });
  next()
})

// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

app.use((req, res) => {
  res.status(404)
  throw new Error("The requested resource couldn't be found.")
})

app.use((err, req, res, next) => {
  console.error(err)
  if(!err.statusCode) res.statusCode = 500
  else res.statusCode = err.statusCode
  const obj = {
    message: err.message,
    statusCode: res.statusCode,
  }
  if(process.env.NODE_ENV === "development") obj.stack = err.stack
  res.json(obj)
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server is listening on port', port));
