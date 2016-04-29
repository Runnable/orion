'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const sinon = require('sinon')
const beforeEach = lab.beforeEach
const afterEach = lab.afterEach
const expect = require('code').expect
const Intercom = require('intercom-client')
const mockIntercom = require('./mocks/mockIntercom')

const Orion = require('../lib/orion')

describe('orion', () => {
  beforeEach(function (done) {
    sinon.stub(Intercom, 'Client').returns(mockIntercom)
    done()
  })
  afterEach(function (done) {
    Intercom.Client.restore()
    done()
  })
  describe('constructor', function () {
    beforeEach((done) => {
      sinon.stub(Orion.prototype, 'canUseIntercom').returns(true)
      done()
    })
    afterEach((done) => {
      Orion.prototype.canUseIntercom.restore()
      done()
    })
    it('should check if we can use intercom before creating an intercom client', (done) => {
      const orion = new Orion()
      sinon.assert.calledOnce(Orion.prototype.canUseIntercom)
      expect(orion).to.be.instanceOf(Orion)
      done()
    })
  })
})
