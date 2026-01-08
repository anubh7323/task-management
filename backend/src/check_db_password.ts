import { Client } from 'pg';

const passwords = [
    'postgres',
    'password',
    '1234',
    '12345',
    '123456',
    'admin',
    'root',
    'master',
    'system',
    '' // empty string
];

async function checkPasswords() {
    console.log('Testing common passwords...');

    for (const password of passwords) {
        const client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'postgres', // connect to default db to check auth
            password: password,
            port: 5432,
        });

        try {
            await client.connect();
            console.log(`\nSUCCESS! The password is: "${password}"`);
            await client.end();
            process.exit(0);
        } catch (err: any) {
            // console.log(`Failed with "${password}"`); 
            // suppress output to keep it clean, or just ignore
        }
    }

    console.log('\nFailed to find password in common list.');
    process.exit(1);
}

checkPasswords();
