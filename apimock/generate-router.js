const fs = require('fs');
const YAML = require('yaml');

const apimockConfig = fs.readFileSync('./apimock.yaml', 'utf8');
const endpoints = YAML.parse(apimockConfig);

const outDir = 'generated-routers'

const makeMethodFunctionMap = (path) => {
  const targetEndpoints = endpoints
    .filter(v => v.request.url === path);

  const functionMapSrc = targetEndpoints
    .map(v => `  ['${v.request.method}', require('../${v.response.file}')]`)

  return `const methodMap = new Map([
${functionMapSrc.join(',\n')}  
]);\n`;
};

const routerPaths = endpoints
  .map(v => v.request.url)
  .filter((v,idx,arr) => {
    return arr.indexOf(v) === idx;
  });

const template = fs.readFileSync('./router-template.js', 'utf8');

if(fs.existsSync(outDir)) {
  fs.rmdirSync(outDir, {recursive: true});
}

fs.mkdirSync(outDir);

routerPaths.forEach(v => {
  const methodFunctionMap = makeMethodFunctionMap(v);
  const pathPattern = `const pathPattern = '${v}';\n`;
  const fileName = v.replace(/:/g,'').replace(/\//g,'__')
  fs.writeFileSync(`${outDir}/${fileName}.js`, `${pathPattern}${methodFunctionMap}${template}`)
});


