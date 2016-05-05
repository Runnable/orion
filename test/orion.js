'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const beforeEach = lab.beforeEach
const afterEach = lab.afterEach

const expect = require('code').expect
const sinon = require('sinon')

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
}) // end 'orion'
