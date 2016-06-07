'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const beforeEach = lab.beforeEach
const afterEach = lab.afterEach

const expect = require('code').expect
const sinon = require('sinon')
const Promise = require('bluebird')

const Intercom = require('intercom-client')
const mockIntercom = require('./mocks/mockIntercom')

const Companies = require('../lib/companies')
const Orion = require('../lib/orion')
const Util = require('../lib/util')

describe('orion', () => {
  beforeEach((done) => {
    sinon.stub(Intercom, 'Client').returns(mockIntercom)
    sinon.stub(Util, 'canUseIntercom')
    done()
  })

  afterEach((done) => {
    Intercom.Client.restore()
    Util.canUseIntercom.restore()
    done()
  })

  describe('constructor', () => {
    describe('with intercom available', () => {
      beforeEach((done) => {
        Util.canUseIntercom.returns(true)
        done()
      })

      it('should create an intercom client', (done) => {
        const orion = new Orion()
        expect(orion.intercomClient).to.exist()
        done()
      })
    }) // end 'with intercom available'

    describe('without intercom available', () => {
      beforeEach((done) => {
        Util.canUseIntercom.returns(false)
        done()
      })

      it('should not create an intercom client', (done) => {
        const orion = new Orion()
        expect(orion.intercomClient).to.not.exist()
        done()
      })
    }) // end 'without intercom available'

    it('should expose the companies client', (done) => {
      const orion = new Orion()
      expect(orion.companies).to.be.an.instanceof(Companies)
      done()
    })
  }) // end 'constructor'

  describe('nextPage', () => {
    let orion
    const samplePageInfo = { page: 1 }

    beforeEach((done) => {
      orion = new Orion()
      orion.intercomClient = {
        nextPage: sinon.stub().returns(Promise.resolve({ body: { page: 2 } }))
      }
      Util.canUseIntercom.returns(true)
      done()
    })

    it('should do nothing if we cannot use intercom', (done) => {
      Util.canUseIntercom.reset()
      Util.canUseIntercom.returns(false)
      orion.nextPage(samplePageInfo)
        .then(() => {
          sinon.assert.calledOnce(Util.canUseIntercom)
          sinon.assert.notCalled(orion.intercomClient.nextPage)
        })
        .asCallback(done)
    })

    it('should reject if the client is invalid', (done) => {
      orion.intercomClient = null
      orion.nextPage(samplePageInfo).asCallback((err) => {
        expect(err).to.exist()
        expect(err.message).to.match(/invalid.*client/i)
        done()
      })
    })

    it('should call nextPage on the client', (done) => {
      orion.nextPage(samplePageInfo)
        .then(() => {
          sinon.assert.calledOnce(orion.intercomClient.nextPage)
          sinon.assert.calledWithExactly(
            orion.intercomClient.nextPage,
            samplePageInfo
          )
        })
        .asCallback(done)
    })

    it('should call nextPage on the client', (done) => {
      orion.nextPage(samplePageInfo)
        .then((body) => {
          expect(body).to.deep.equal({ page: 2 })
        })
        .asCallback(done)
    })
  })
}) // end 'orion'
