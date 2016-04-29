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
  beforeEach((done) => {
    sinon.stub(Intercom, 'Client').returns(mockIntercom)
    done()
  })
  afterEach((done) => {
    Intercom.Client.restore()
    done()
  })
  describe('constructor', () => {
    const fakeAppId = 'fake app id'
    const fakeAppKey = 'fake app key'
    beforeEach((done) => {
      process.env.INTERCOM_APP_ID = fakeAppId
      process.env.INTERCOM_API_KEY = fakeAppKey
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
      sinon.assert.calledOnce(mockIntercom.usePromises)
      sinon.assert.calledOnce(Intercom.Client)
      sinon.assert.calledWith(Intercom.Client, fakeAppId, fakeAppKey)
      expect(orion).to.be.instanceOf(Orion)
      done()
    })
  })

  describe('canUseIntercom', () => {
    const orion = new Orion()
    beforeEach((done) => {
      done()
    })

    it('should return false if no INTERCOM_APP_ID', function () {
      delete process.env.INTERCOM_API_KEY
      orion.canUseIntercom()
    })
    it('should return false if no INTERCOM_APP_ID', function () {
      delete process.env.INTERCOM_APP_ID
      orion.canUseIntercom()
    })
  })
})
