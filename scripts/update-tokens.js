const https = require('https');
const fs = require('fs');
const path = require('path');

function httpsGet(opts) {
  return new Promise(resolve => {
    https.get(opts, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', data => body += data);
      res.on('end', () => {
        resolve(body);
      });
    })
  });
}

function githubApi(path) {
  return httpsGet({
    hostname: 'api.github.com',
    path: `/repos/ethereum-lists/tokens${path}`,
    headers: {
      'user-agent': 'node',
      'content-type': 'application/json; charset=utf-8'
    }
  })
  .then(body => JSON.parse(body));
}

async function run() {
  // First we fetch the latest commit from ethereum-lists/tokens
  console.log('Fetching ethereum-lists/tokens commits...');
  const commits = await githubApi('/commits');
  const commit = commits[0];

  // Then we fetch its build status
  console.log('Fetching commits statuses...');
  const statuses = await githubApi(`/statuses/${commit.sha}`);

  // Fetch the IPFS link, which is a page of links to other IPFS links
  console.log('Fetching IPFS output HTML...');
  const ipfsUrl = statuses.find((status) => status.target_url.includes('ipfs')).target_url;
  const ipfsHtml = await httpsGet(ipfsUrl);

  // Get the IPFS url for the eth tokens json. Regexxing HTML hurts, but w/e
  console.log('Fetching IPFS ETH Tokens JSON...');
  const tokensUrl = ipfsHtml.match(/<a href='([^']+)'>output\/minified\/eth\.json<\/a>/)[1];
  const tokensJson = JSON.parse(await httpsGet(tokensUrl));

  // Format the json to match our format in common/config/tokens/eth.json
  const tokens = tokensJson.map(t => ({
    address: t.address,
    symbol: t.symbol,
    decimal: t.decimals
  }));

  // Write to the file
  console.log('Writing Tokens JSON to common/config/tokens/eth.json...');
  const filePath = path.resolve(__dirname, '../common/config/tokens/eth.json');
  fs.writeFile(filePath, JSON.stringify(tokens, null, 2), 'utf8', err => {
    if (err) {
      console.error(err);
      throw new Error('Failed to write tokens json to file, see above error');
    }

    console.log('Succesfully imported', tokens.length, 'tokens!');
  });
}

run();
