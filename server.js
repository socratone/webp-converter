const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const port = 4000;

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

app.use(cors());
app.use(bodyParser.json())

app.post('/format', async (req, res) => {
  const { quality, path } = req.body;
  const parentPath = path.substring(0, path.lastIndexOf('/'));

  try {
    await imagemin([path], {
      destination: parentPath,
      plugins: [
        imageminWebp({ quality }) // number
      ]
    });
  } catch (error) {
    console.log('error:', error)
    res.status(500).send('error');
  }
  res.send('Images optimized');
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})