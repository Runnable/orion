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
const Users = require('../lib/users')

describe('Users', function () {
  let user

  beforeEach((done) => {
    user = new Users({
      users: {
        create: sinon.stub().returns(Promise.resolve('create')),
        find: sinon.stub().returns(Promise.resolve('find'))
      }
    }, 'user')
    done()
  })

  it('should extend base', (done) => {
    expect(user).to.be.an.instanceOf(Base)
    done()
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

  describe('find', () => {
    const findParams = {
      email: 'sohail@awesome.com'
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
      user.find(findParams)
        .then((results) => {
          sinon.assert.calledOnce(user._wrap)
          sinon.assert.calledWith(user._wrap, 'find', findParams)
          expect(results).to.equal(returnedVal)
        })
        .asCallback(done)
    })
  })

  describe('list', () => {
    const returnedVal = {
      body: {
        users: [{ 'foo': 'bar' }],
        pages: {
          page: 1,
          total_pages: 1
        }
      }
    }
    beforeEach((done) => {
      sinon.stub(user, '_wrap').returns(Promise.resolve(returnedVal))
      sinon.stub(user, '_getAllObjects').returns([{ 'foo': 'bar' }])
      done()
    })

    afterEach((done) => {
      user._wrap.restore()
      done()
    })

    it('should call _wrap with the proper parameters', (done) => {
      user.list()
        .then((results) => {
          sinon.assert.calledOnce(user._wrap)
          sinon.assert.calledWith(user._wrap, 'list')
          expect(results).to.equal(returnedVal.body.users)
          done()
        })
    })
  })
})
