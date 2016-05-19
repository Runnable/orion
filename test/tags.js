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

const Tags = require('../lib/tags')
const Util = require('../lib/util')

describe('Tags', function () {
  let tag

  beforeEach((done) => {
    tag = new Tags({
      list: sinon.stub().returns(Promise.resolve('list'))
    })
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
      tag._wrap('list')
        .then(() => {
          sinon.assert.calledOnce(Util.canUseIntercom)
          sinon.assert.notCalled(tag.client.list)
        })
        .asCallback(done)
    })

    it('should reject if the client is invalid', (done) => {
      tag.client = null
      tag._wrap('list').asCallback((err) => {
        expect(err).to.exist()
        expect(err.message).to.match(/invalid.*client/i)
        done()
      })
    })

    it('should reject if the method does not exist', (done) => {
      tag._wrap('not-a-thing').asCallback((err) => {
        expect(err).to.exist()
        expect(err.message).to.match(/has no method/i)
        done()
      })
    })

    it('should call method on client with supplied arguments', (done) => {
      tag._wrap('list')
        .then(() => {
          sinon.assert.calledOnce(Util.canUseIntercom)
          sinon.assert.calledOnce(tag.client.list)
          sinon.assert.calledWithExactly(tag.client.list)
        })
        .asCallback(done)
    })
  })

  describe('list', () => {
    const returnedVal = {
      body: {
        foo: 'bar'
      }
    }

    beforeEach((done) => {
      sinon.stub(tag, '_wrap').returns(Promise.resolve(returnedVal))
      done()
    })

    afterEach((done) => {
      tag._wrap.restore()
      done()
    })

    it('should call _wrap with the proper parameters', (done) => {
      tag.list()
        .then((results) => {
          sinon.assert.calledOnce(tag._wrap)
          sinon.assert.calledWithExactly(tag._wrap, 'list')
          expect(results).to.equal(returnedVal.body)
        })
        .asCallback(done)
    })
  })
})
