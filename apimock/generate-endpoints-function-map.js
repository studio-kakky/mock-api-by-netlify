const fs = require('fs');
const YAML = require('yaml');

const distDir = 'generated';

const apimockConfig = fs.readFileSync('./apimock.yaml', 'utf8');
const endpoints = YAML.parse(apimockConfig);

const endpointsMapSrc = endpoints
  .filter(v => v.response.type === 'js')
  .map(v => {
    return `  ['${v.request.method}_${v.request.url}', require.ensure([], ()=> require('../${v.response.file}'))]`
  });

const fileContent = `module.exports = new Map([
${endpointsMapSrc.join(',\n')}
]);`;

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

fs.writeFileSync(`${distDir}/endpoints-map.js`, fileContent);
