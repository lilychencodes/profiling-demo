const express = require('express');
const axios = require('axios')
const { HONEYCOMB_API_KEY } = require('./secrets');

/** NOTE: I couldn't figure out how to handle timestamp with Libhoney.
This manual sending of events makes sure the start of the trace displayed in Honeycomb
is the actual timestamp that trace started.

const Libhoney = require('libhoney');

const honeycomb = new Libhoney({
  writeKey: HONEYCOMB_API_KEY,
  dataset: 'profiling-demo',
  responseCallback: (responses) => {
    responses.forEach(resp => {
      console.log(resp);
    });
  }
});

const builder = honeycomb.newBuilder({ built: true });

*/

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded()); // Parse URL-encoded bodies

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

  const payload = {
    name,
    duration_ms: duration[1] / 1000 / 1000, // convert from nanoseconds to milliseconds
    endTime: endTime[0], // unix timestamp (seconds since epoch)
    traceId,
    id: spanId,
    parentId: parentSpanId,
    timestamp: startTime[0], // unix timestamp (seconds since epoch)
  };
  console.log('payload:', payload);

  axios
  .post('https://api.honeycomb.io/1/events/profiling-demo', payload, {
    headers: {
      'X-Honeycomb-Team': HONEYCOMB_API_KEY,
      'X-Honeycomb-Event-Time': startTime[0],
      'Content-Type': 'application/json',
    }
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`)
  })
  .catch(error => {
    console.error(error)
  })

  res.send({ status: 'done' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
