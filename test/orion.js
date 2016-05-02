'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const sinon = require('sinon')
const beforeEach = lab.beforeEach
const afterEach = lab.afterEach
const after = lab.after
const expect = require('code').expect
const Intercom = require('intercom-client')
const mockIntercom = require('./mocks/mockIntercom')
const proxyquire = require('proxyquire')

describe('orion', () => {
  let Orion
  beforeEach((done) => {
    sinon.stub(Intercom, 'Client').returns(mockIntercom)
    Orion = proxyquire('../lib/orion', {
      './companies': sinon.stub()
    })
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
    const oldIntercomAPIKey = process.env.INTERCOM_API_KEY
    const oldIntercomAppId = process.env.INTERCOM_APP_ID
    let existsStub
    let orion

    beforeEach((done) => {
      process.env.INTERCOM_API_KEY = 'fake api key'
      process.env.INTERCOM_APP_ID = 'fake app id'
      existsStub = sinon.stub().returns(false)
      const Orion = proxyquire('../lib/orion', {
        '101/exists': existsStub
      })
      orion = new Orion()
      existsStub.reset()
      done()
    })

    after((done) => {
      process.env.INTERCOM_API_KEY = oldIntercomAPIKey
      process.env.INTERCOM_APP_ID = oldIntercomAppId
      done()
    })

    it('should return false if no INTERCOM_APP_ID', (done) => {
      delete process.env.INTERCOM_API_KEY
      existsStub.withArgs(process.env.INTERCOM_API_KEY).returns(false)
      existsStub.withArgs(process.env.INTERCOM_APP_ID).returns(true)
      expect(orion.canUseIntercom()).to.equal(false)
      sinon.assert.calledWith(existsStub, process.env.INTERCOM_API_KEY)
      done()
    })

    it('should return false if no INTERCOM_APP_ID', (done) => {
      delete process.env.INTERCOM_APP_ID
      existsStub.withArgs(process.env.INTERCOM_API_KEY).returns(true)
      existsStub.withArgs(process.env.INTERCOM_APP_ID).returns(false)
      expect(orion.canUseIntercom()).to.equal(false)
      sinon.assert.calledWith(existsStub, process.env.INTERCOM_APP_ID)
      done()
    })

    it('should return true if everything is set properly', (done) => {
      existsStub.withArgs(process.env.INTERCOM_API_KEY).returns(true)
      existsStub.withArgs(process.env.INTERCOM_APP_ID).returns(true)
      expect(orion.canUseIntercom()).to.equal(true)
      sinon.assert.calledTwice(existsStub)
      sinon.assert.calledWith(existsStub, process.env.INTERCOM_API_KEY)
      sinon.assert.calledWith(existsStub, process.env.INTERCOM_APP_ID)
      done()
    })
  })
})
