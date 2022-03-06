import opentelemetry from '@opentelemetry/api';

export function reportSpan(span) {

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

  console.log('report span:', payload);

  fetch('./send-trace', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });
}

export async function withTracing(name, cb, parentSpan, report) {
  const tracer = opentelemetry.trace.getTracer('profiling-demo');
  let span;

  if (parentSpan) {
    const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
    span = tracer.startSpan(name, undefined, ctx);
  } else {
    span = tracer.startSpan(name);
  }

  await cb();

  span.end();

  reportSpan(span);
}
