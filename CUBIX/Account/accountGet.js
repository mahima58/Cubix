import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    // stages: [
    //     { duration: '30s', target: 10 }, // Ramp-up to 10 users
    //     { duration: '1m', target: 10 },  // Hold at 10 users for 1 minute
    //     { duration: '30s', target: 0 },  // Ramp-down to 0 users
    // ],
    // thresholds: {
    //     'http_req_duration': ['p(95)<500'], // 95% of requests should complete within 500ms
    // },
    stages: [
        { duration: '2m', target: 500 },  // ramp-up to 100 users
        { duration: '3m', target: 500 },  // maintain 100 users for 3 minutes
        { duration: '2m', target: 700 },  // ramp-up to 200 users
        { duration: '3m', target: 700 },  // maintain 200 users for 3 minutes
        { duration: '2m', target: 800 },  // ramp-up to 300 users
        { duration: '3m', target: 800 },  // maintain 300 users for 3 minutes
        { duration: '2m', target: 0 },    // ramp-down to 0 users
      ],
      thresholds: {
        'http_req_duration': ['p(95)<1000'],  // 95% of requests should complete under 1000ms
        'http_req_failed': ['rate<0.01'],     // Less than 1% of requests should fail
      },//stress testing
};

export default function () {
    // Define the request headers with Bearer token if needed
    let params = {
        headers: {
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI5NTc2NDgzLCJqdGkiOiIzZGFhN2RhMGM5ZTA0ZDVmYTBjZjBiMDkwNDg2ZThjNyIsInVzZXJfaWQiOjIsImRvbWFpbl9uYW1lIjoidGVzdGFwaS5zb29yaXNvbHV0aW9ucy5jb20ubnAiLCJ1c2VyX25hbWUiOiJtYWhpbWEifQ.a0Lsa6xG5oPUew7CR4Qd7P0NB5jS7CLsFfOJvI_4rlk`, // Replace with your actual token
        },
    };

    // Make the GET request
    let res = http.get('https://testapi.soorisolutions.com.np/api/v1/account-app/account?limit=10&offset=10', params);

    // Check the response
    check(res, {
        'is status 200': (r) => r.status === 200,
        'response body is present': (r) => r.body !== '',
    });

    sleep(1);
}
