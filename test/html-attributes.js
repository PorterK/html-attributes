/*!
 * html-attributes
 * https://github.com/alexmingoia/html-attributes
 */

'use strict';

var expect = require('chai').expect;
var lib = process.env.JSCOV ? require('../lib-cov/html-attributes') : require('../lib/html-attributes');

describe('html-attributes module', function() {
  it('exports object', function() {
    expect(lib).to.be.an('object');
  });
});
