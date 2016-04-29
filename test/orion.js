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
const Promise = require('bluebird')

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
    const oldIntercomAPIKey = process.env.INTERCOM_API_KEY
    const oldIntercomAppId = process.env.INTERCOM_APP_ID
    let existsStub
    let envIsStub
    let orion
    beforeEach((done) => {
      process.env.INTERCOM_API_KEY = 'fake api key'
      process.env.INTERCOM_APP_ID = 'fake app id'
      existsStub = sinon.stub().returns(false)
      envIsStub = sinon.stub().returns(true)
      const Orion = proxyquire('../lib/orion', {
        '101/exists': existsStub,
        '101/env-is': envIsStub
      })
      orion = new Orion()
      existsStub.reset()
      envIsStub.reset()
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
      sinon.assert.notCalled(envIsStub)
      sinon.assert.calledWith(existsStub, process.env.INTERCOM_API_KEY)
      done()
    })
    it('should return false if no INTERCOM_APP_ID', (done) => {
      delete process.env.INTERCOM_APP_ID
      existsStub.withArgs(process.env.INTERCOM_API_KEY).returns(true)
      existsStub.withArgs(process.env.INTERCOM_APP_ID).returns(false)
      expect(orion.canUseIntercom()).to.equal(false)
      sinon.assert.notCalled(envIsStub)
      sinon.assert.calledWith(existsStub, process.env.INTERCOM_APP_ID)
      done()
    })
    it('should return false if not the right env', (done) => {
      existsStub.withArgs(process.env.INTERCOM_API_KEY).returns(true)
      existsStub.withArgs(process.env.INTERCOM_APP_ID).returns(true)
      expect(orion.canUseIntercom()).to.equal(false)
      sinon.assert.calledOnce(envIsStub)
      sinon.assert.calledWith(envIsStub, 'test')
      sinon.assert.calledTwice(existsStub)
      sinon.assert.calledWith(existsStub, process.env.INTERCOM_API_KEY)
      sinon.assert.calledWith(existsStub, process.env.INTERCOM_APP_ID)
      done()
    })
    it('should return true if everything is set properly', (done) => {
      existsStub.withArgs(process.env.INTERCOM_API_KEY).returns(true)
      existsStub.withArgs(process.env.INTERCOM_APP_ID).returns(true)
      envIsStub.returns(false)
      expect(orion.canUseIntercom()).to.equal(true)
      sinon.assert.calledOnce(envIsStub)
      sinon.assert.calledWith(envIsStub, 'test')
      sinon.assert.calledTwice(existsStub)
      sinon.assert.calledWith(existsStub, process.env.INTERCOM_API_KEY)
      sinon.assert.calledWith(existsStub, process.env.INTERCOM_APP_ID)
      done()
    })
  })

  describe('upsertCompany', () => {
    const orion = new Orion()
    const upsertParams = {
      company_id: 'Company ID',
      name: 'Company NAME!'
    }
    beforeEach((done) => {
      sinon.stub(orion, 'canUseIntercom').returns(true)
      orion.intercomClient = {
        companies: {
          create: sinon.stub().returns(Promise.resolve())
        }
      }
      done()
    })
    afterEach((done) => {
      orion.canUseIntercom.restore()
      done()
    })

    it('should do nothing if we can\'t use intercom', (done) => {
      orion.canUseIntercom.returns(false)
      orion.upsertCompany(upsertParams)
        .then(() => {
          sinon.assert.calledOnce(orion.canUseIntercom)
          sinon.assert.notCalled(orion.intercomClient.companies.create)
        })
        .asCallback(done)
    })

    it('should create the company if one exists', (done) => {
      orion.canUseIntercom.returns(true)
      orion.upsertCompany(upsertParams)
        .then(() => {
          sinon.assert.calledOnce(orion.canUseIntercom)
          sinon.assert.calledOnce(orion.intercomClient.companies.create)
          sinon.assert.calledWith(orion.intercomClient.companies.create, upsertParams)
        })
        .asCallback(done)
    })
  })
})
