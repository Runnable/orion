'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const sinon = require('sinon')
const beforeEach = lab.beforeEach
const afterEach = lab.afterEach
const expect = require('code').expect
const Promise = require('bluebird')

const Base = require('../lib/base')
const Util = require('../lib/util')

describe('Base', function () {
  let base

  beforeEach((done) => {
    base = new Base({
      sample: {
        list: sinon.stub().returns(Promise.resolve(true))
      }
    }, 'sample')
    sinon.stub(Util, 'canUseIntercom').returns(true)
    done()
  })

  afterEach((done) => {
    Util.canUseIntercom.restore()
    done()
  })

  describe('_wrap', () => {
    it('should do nothing if we cannot use intercom', (done) => {
      Util.canUseIntercom.returns(false)
      base._wrap('list')
        .then(() => {
          sinon.assert.calledOnce(Util.canUseIntercom)
          sinon.assert.notCalled(base.client.list)
        })
        .asCallback(done)
    })

    it('should reject if the client is invalid', (done) => {
      base.client = null
      base._wrap('list').asCallback((err) => {
        expect(err).to.exist()
        expect(err.message).to.match(/invalid.*client/i)
        done()
      })
    })

    it('should reject if the method does not exist', (done) => {
      base._wrap('not-a-thing').asCallback((err) => {
        expect(err).to.exist()
        expect(err.message).to.match(/has no method/i)
        done()
      })
    })

    it('should call list method on client with supplied arguments', (done) => {
      base._wrap('list')
        .then(() => {
          sinon.assert.calledOnce(Util.canUseIntercom)
          sinon.assert.calledOnce(base.client.list)
          sinon.assert.calledWithExactly(base.client.list)
        })
        .asCallback(done)
    })
  })
})
