import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// Configuration options
export const options = {
    stages: [
        { duration: '30s', target: 10 }, // Ramp-up to 10 users
        { duration: '1m', target: 10 },  // Hold at 10 users for 1 minute
        { duration: '30s', target: 0 },  // Ramp-down to 0 users
    ],
    thresholds: {
        'http_req_duration': ['p(95)<500'], // 95% of requests should complete within 500ms
    },
    // stages: [
    //     { duration: '2m', target: 100 },  // ramp-up to 100 users
    //     { duration: '3m', target: 100 },  // maintain 100 users for 3 minutes
    //     { duration: '2m', target: 200 },  // ramp-up to 200 users
    //     { duration: '3m', target: 200 },  // maintain 200 users for 3 minutes
    //     { duration: '2m', target: 300 },  // ramp-up to 300 users
    //     { duration: '3m', target: 300 },  // maintain 300 users for 3 minutes
    //     { duration: '2m', target: 0 },    // ramp-down to 0 users
    //   ],
    //   thresholds: {
    //     'http_req_duration': ['p(95)<1000'],  // 95% of requests should complete under 1000ms
    //     'http_req_failed': ['rate<0.01'],     // Less than 1% of requests should fail
    //   },//stress testing
};

export default function () {
    // Define the payload for the POST request
    let payload = JSON.stringify({
        name: 'Test Account',
        group: 1,
        remarks: 'This is a test account',
        openingBalance: '1000.00',
    });

    // Define the request headers, including the Bearer token
    let params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3NzU2ODM2LCJqdGkiOiI1ZmUxNGEzOWEzYjk0MDU2ODNlMDIwZmE3ZmVlMDUxYyIsInVzZXJfaWQiOjIsImRvbWFpbl9uYW1lIjoidGVzdGFwaS5zb29yaXNvbHV0aW9ucy5jb20ubnAiLCJ1c2VyX25hbWUiOiJtYWhpbWEifQ.vWKBeoCrOJ0ClPlbGkaAMsFigzRZmiPV41G2LPCASpA`, // Replace with your actual Bearer token
        },
    };

    // Make the POST request
    let res = http.post('https://testapi.soorisolutions.com.np/api/v1/account-app/account', payload, params);
    
    // Check response status
    check(res, {
        'is status 201': (r) => r.status === 201, // 201 Created
        'response body is present': (r) => r.body !== '',
    });

    // Record custom metrics
    // postTrend.add(res.timings.duration);

    // Simulate user think time
    sleep(1);
}
