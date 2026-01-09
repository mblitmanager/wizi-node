const fs = require('fs');
const path = require('path');

const laravelEnvPath = 'c:/laragon/www/cursor/Wizi-learn-laravel/.env';
const nodeEnvPath = 'c:/laragon/www/cursor/Wizi-learn-node/.env';

function getSecret(envPath) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/JWT_SECRET=(.*)/);
    return match ? match[1].trim().replace(/^"(.*)"$/, '$1') : null;
}

const laravelSecret = getSecret(laravelEnvPath);
const nodeSecret = getSecret(nodeEnvPath);

console.log('Laravel Secret Len:', laravelSecret?.length);
console.log('Node Secret Len:', nodeSecret?.length);
console.log('Match:', laravelSecret === nodeSecret);

if (laravelSecret && nodeSecret && laravelSecret !== nodeSecret) {
    console.log('Laravel Secret:', laravelSecret);
}
