const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;

app.use(cors());

app.post('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})