const express = require('express');
const Libhoney = require('libhoney');

const { HONEYCOMB_API_KEY } = require('./secrets');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded()); // Parse URL-encoded bodies

const honeycomb = new Libhoney({
  writeKey: HONEYCOMB_API_KEY,
  dataset: 'profiling-demo',
  responseCallback: (responses) => {
    responses.forEach(resp => {
      console.log(resp);
    });
  }
});

app.post('/send-trace', (req, res) => {
  const {
    name,
    duration,
    startTime,
    endTime,
    parentSpanId,
    spanId,
    traceId,
  } = req.body;

  const event = honeycomb.newEvent();
  const payload = {
    name,
    startTime: startTime[0], // unix timestamp (seconds since epoch)
    endTime: endTime[0], // unix timestamp (seconds since epoch)
    duration_ms: duration[1] / 1000 / 1000, // convert from nanoseconds to milliseconds
    spanId,
    traceId,
    parentSpanId,
  };
  console.log('payload:', payload);

  event.add(payload);
  event.send();

  res.send({ status: 'done' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
