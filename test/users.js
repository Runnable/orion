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
        create: sinon.stub().returns(Promise.resolve('create'))
      }
    })
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
})
