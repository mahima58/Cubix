import http from 'k6/http';
import { check, sleep } from 'k6';

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
    // Define the request headers with Bearer token if needed
    let params = {
        headers: {
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI3NzU2ODM2LCJqdGkiOiI1ZmUxNGEzOWEzYjk0MDU2ODNlMDIwZmE3ZmVlMDUxYyIsInVzZXJfaWQiOjIsImRvbWFpbl9uYW1lIjoidGVzdGFwaS5zb29yaXNvbHV0aW9ucy5jb20ubnAiLCJ1c2VyX25hbWUiOiJtYWhpbWEifQ.vWKBeoCrOJ0ClPlbGkaAMsFigzRZmiPV41G2LPCASpA`, // Replace with your actual token
        },
    };

    // Make the GET request
    let res = http.get('https://testapi.soorisolutions.com.np/api/v1/account-app/account-group?limit=10&offset=10', params);

    // Check the response
    check(res, {
        'is status 200': (r) => r.status === 200,
        'response body is present': (r) => r.body !== '',
    });

    sleep(1);
}
