/**
 * Managing the snippet dependency
 */
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

module.exports.process = function process(snippetContents, rootModulesPath){
  let modules = [];
  snippetContents.forEach(src => {
    modules = modules.concat(getRequiredModules(src));
  });
  installModules(modules, rootModulesPath);
  return modules;
}

function getRequiredModules(src){
  const commonRequirePatt = /require\(["'](.+?)["']\)/ig;
  const es6ImportPatt = /import\s+.*\s*(from)?\s*["'](.+?)["']/ig;
  const modules = [];
  let match;
  while((match = commonRequirePatt.exec(src)) !== null){
    if(match[1].indexOf('.') !== 0){
      modules.push(match[1]);
    }
  }

  while((match = es6ImportPatt.exec(src)) !== null){
    if(match[2].indexOf('.') !== 0){
      modules.push(match[2]);
    }
  }

  return modules;
}

function installModules(modules, cwd = path.join(__dirname, '../tmp')){
  // make sure the package.json exists with blank json. eg: {}
  try{
    fs.accessSync(path.join(cwd, 'package.json'), fs.constants.R_OK)
  } catch (ex) {
    fs.writeFileSync(path.join(cwd, 'package.json'), '{}', { encoding: 'UTF8' });
  }
  execSync(['npm install --save'].concat(modules).join(' '), {cwd});
}
