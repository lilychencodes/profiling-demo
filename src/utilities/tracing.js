import api from '@opentelemetry/api';

function reportSpan(span) {

  const { _spanContext, _ended, duration, startTime, endTime, name, parentSpanId } = span;

  const payload = {
    ..._spanContext,
    _ended,
    duration,
    startTime,
    endTime,
    name,
    parentSpanId,
  };

  fetch('./send-trace', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });
}

export async function withTracing(name, cb) {
  const tracer = api.trace.getTracer('profiling-demo');
  const span = tracer.startSpan(name);

  await cb();

  span.end();

  reportSpan(span);
}
