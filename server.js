const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/send-trace', (req, res) => {
  // TODO: send trace data to Honeycomb
  
  res.send({ status: 'done' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
