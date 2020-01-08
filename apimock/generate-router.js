const fs = require('fs');
const YAML = require('yaml');

const apimockConfig = fs.readFileSync('./apimock.yaml', 'utf8');
const endpoints = YAML.parse(apimockConfig);

const makePathList = (path) => {
  const targetEndpoints = endpoints
    .filter(v => {
      const pattern = new RegExp(`^\/v1\/${path}`);
      return pattern.test(v.request.url);
    })
    .filter((v,idx,arr) => {
      return arr.indexOf(v) === idx;
    })
    .map(v => `'${v.request.url}'`);

  return `const pathList = [${targetEndpoints.join(',')}];\n`
};

const makeFunctionMap = (path) => {
  const targetEndpoints = endpoints
    .filter(v => {
      const pattern = new RegExp(`^\/v1\/${path}`);
      return pattern.test(v.request.url);
    });

  const functionMapSrc = targetEndpoints
    .map(v => `  ['${v.request.method}_${v.request.url}', require('../${v.response.file}')]`)

  return `const endpointsMap = new Map([
${functionMapSrc.join(',\n')}  
]);\n`;
};

const routerPaths = endpoints
  .filter(v => /^\/v1/.test(v.request.url))
  .map(v => v.request.url.replace(/^\/v1\/([^\/]*).*/,'$1'))
  .filter((v,idx,arr) => {
    return arr.indexOf(v) === idx;
  });

const template = fs.readFileSync('./router-template.js', 'utf8');

if(!fs.existsSync('./generated')) {
  fs.mkdirSync('./generated');
}

routerPaths.forEach(v => {
  const pathList = makePathList(v);
  const functionMap = makeFunctionMap(v);
  fs.writeFileSync(`./generated/${v}.js`, `${pathList}${functionMap}${template}`)
});


