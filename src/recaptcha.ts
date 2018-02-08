
const debug = require('debug')('artoficiu-web');
import fetch from 'node-fetch';

export default function validate(value: string, ip: string): Promise<boolean> {
    const params = ['secret=' + encodeURIComponent(process.env.RECAPTCHA_SECRET)];
    params.push('response=' + encodeURIComponent(value))
    params.push('remoteip=' + encodeURIComponent(ip))

    return fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        timeout: 1000 * 3,
        body: params.join('&'),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
        .then(response => response.json())
        .then((json: any) => {
            debug(`recaptcha response ${JSON.stringify(json)}`);
            return json.success as boolean
        });
}
