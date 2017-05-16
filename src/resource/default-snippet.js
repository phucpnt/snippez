
module.exports = {
  'index.html': '<div id="snippet-content"></div>',
  'index.js': `
console.log('hello snippet');
document.getElementById('snippet-content').textContent = 'Hello Snippet';
  `,
  'index.spec.js': `
require('imports-loader?module=>undefined,this=>window!jasmine-core/lib/jasmine-core/jasmine');
require('imports-loader?module=>undefined!jasmine-core/lib/jasmine-core/jasmine-html');
require('imports-loader?module=>undefined!jasmine-core/lib/jasmine-core/boot');
require('jasmine-core/lib/jasmine-core/jasmine.css');

describe('snippet test', () => {
  it('should run the test with jasmine support', () => {
    expect('snippet').toEqual('snippet');
  });
});
  `,
}
