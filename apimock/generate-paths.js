const fs = require('fs');
const YAML = require('yaml');

const distDir = 'generated';

const apimockConfig = fs.readFileSync('./apimock.yaml', 'utf8');
const endpoints = YAML.parse(apimockConfig).map(v => v.request.url);

const fileContent = `module.exports = [\n${endpoints.map(v => `  '${v}'`).join(',\n')}\n];`;

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

fs.writeFileSync(`${distDir}/paths.js`, fileContent);
