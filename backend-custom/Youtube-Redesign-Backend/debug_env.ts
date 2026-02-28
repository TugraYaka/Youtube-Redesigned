
import { keys } from './src/config/keys';

console.log('--- ENV CHECK ---');
console.log('Client ID loaded:', keys.googleClientID ? 'YES' : 'NO');
console.log('Client Secret loaded:', keys.googleClientSecret ? 'YES' : 'NO');
console.log('Client ID First 5 chars:', keys.googleClientID?.substring(0, 5));
console.log('Client Secret First 5 chars:', keys.googleClientSecret?.substring(0, 5));
console.log('--- END CHECK ---');
