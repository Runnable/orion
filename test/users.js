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

const Users = require('../lib/users')
const Util = require('../lib/util')

describe('Users', function () {
  let user

  beforeEach((done) => {
    user = new Users({
      create: sinon.stub().returns(Promise.resolve('create'))
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
      user._wrap('create', '1', '2', '3')
        .then(() => {
          sinon.assert.calledOnce(Util.canUseIntercom)
          sinon.assert.notCalled(user.client.create)
        })
        .asCallback(done)
    })

    it('should reject if the client is invalid', (done) => {
      user.client = null
      user._wrap('create').asCallback((err) => {
        expect(err).to.exist()
        expect(err.message).to.match(/invalid.*client/i)
        done()
      })
    })

    it('should reject if the method does not exist', (done) => {
      user._wrap('not-a-thing').asCallback((err) => {
        expect(err).to.exist()
        expect(err.message).to.match(/has no method/i)
        done()
      })
    })

    it('should call method on client with supplied arguments', (done) => {
      user._wrap('create', '1', '2', '3')
        .then(() => {
          sinon.assert.calledOnce(Util.canUseIntercom)
          sinon.assert.calledOnce(user.client.create)
          sinon.assert.calledWith(user.client.create, '1', '2', '3')
        })
        .asCallback(done)
    })
  })

  describe('create', () => {
    const createParams = {
      user_id: 'Users ID',
      name: 'Users NAME!'
    }
    const returnedVal = {
      body: {
        foo: 'bar'
      }
    }

    beforeEach((done) => {
      sinon.stub(user, '_wrap').returns(Promise.resolve(returnedVal))
      done()
    })

    afterEach((done) => {
      user._wrap.restore()
      done()
    })

    it('should call _wrap with the proper parameters', (done) => {
      user.create(createParams)
        .then((results) => {
          sinon.assert.calledOnce(user._wrap)
          sinon.assert.calledWith(user._wrap, 'create', createParams)
          expect(results).to.equal(returnedVal)
        })
        .asCallback(done)
    })
  })
})
