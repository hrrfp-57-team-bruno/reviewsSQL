import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');

export const options = {
  vus: 1000,
  duration: '60s',
}

const url = 'http://localhost:3001/reviews/?product_id=40344';
// const url = 'http://localhost:3001/reviews/meta?product_id=40344';
// const url = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/reviews/?product_id=40344';
// const url = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/reviews/meta?product_id=40344';

export default function() {
  const params = {
    headers: { 'Authorization': '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' }
  };
  const res = http.get(url, params);
  sleep(1);
  check(res, {
    'is status 200': r => r.status === 200,
    'transaction time < 200ms': r => r.timings.duration < 200,
    'transaction time < 500ms': r => r.timings.duration < 500,
    'transaction time < 1000ms': r => r.timings.duration < 1000,
    'transaction time < 2000ms': r => r.timings.duration < 2000,
  });
}