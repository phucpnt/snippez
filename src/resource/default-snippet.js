
module.exports = {
  'index.html': '<div id="snippet-content"></div>',
  'index.js': `console.log('hello snippet');
  document.getElementById('snippet-content').text = 'Hello Snippet';
  `,
  'index.spec.js': `
  describe('snippet test', () => {
    it('should run the test with jasmine support', () => {
      expect('snippet').toEqual('snippet');
    });
  });
  `,
}
