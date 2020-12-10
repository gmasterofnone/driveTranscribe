const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const credentials = require('./credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

async function authorize() {
    console.log('Authorizing Google Drive Client')
    const { web: { client_secret, client_id, redirect_uris } } = credentials;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
        const token = await fs.readFileSync(TOKEN_PATH, 'utf-8');
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } catch(e) {
        return await getAccessToken(oAuth2Client);
    }
  }

async function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the code from that page here: ')
    const it = rl[Symbol.asyncIterator]();
    const {value: code } = await it.next();
    rl.close()


    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        await fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        return oAuth2Client;

    } catch(e) {
        return console.error('Error retrieving access token', e);
    }
};

module.exports = authorize;