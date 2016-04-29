'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const expect = require('code').expect

const index = require('../lib/index')
const Orion = require('../lib/orion')

describe('index', () => {
  it('should expose orion instance', (done) => {
    expect(index).to.be.an.instanceof(Orion)
    done()
  })
})
