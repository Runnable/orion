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

const Companies = require('../lib/companies')
const Util = require('../lib/util')

describe('Companies', function () {
  let company

  beforeEach((done) => {
    company = new Companies({
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
      company._wrap('create', '1', '2', '3')
        .then(() => {
          sinon.assert.calledOnce(Util.canUseIntercom)
          sinon.assert.notCalled(company.client.create)
        })
        .asCallback(done)
    })

    it('should reject if the client is invalid', (done) => {
      company.client = null
      company._wrap('create').asCallback((err) => {
        expect(err).to.exist()
        expect(err.message).to.match(/invalid.*client/i)
        done()
      })
    })

    it('should reject if the method does not exist', (done) => {
      company._wrap('not-a-thing').asCallback((err) => {
        expect(err).to.exist()
        expect(err.message).to.match(/has no method/i)
        done()
      })
    })

    it('should call method on client with supplied arguments', (done) => {
      company._wrap('create', '1', '2', '3')
        .then(() => {
          sinon.assert.calledOnce(Util.canUseIntercom)
          sinon.assert.calledOnce(company.client.create)
          sinon.assert.calledWith(company.client.create, '1', '2', '3')
        })
        .asCallback(done)
    })
  })

  describe('create', () => {
    const createParams = {
      company_id: 'Companies ID',
      name: 'Companies NAME!'
    }
    const returnedVal = {
      body: {
        foo: 'bar'
      }
    }

    beforeEach((done) => {
      sinon.stub(company, '_wrap').returns(Promise.resolve(returnedVal))
      done()
    })

    afterEach((done) => {
      company._wrap.restore()
      done()
    })

    it('should call _wrap with the proper parameters', (done) => {
      company.create(createParams)
        .then((results) => {
          sinon.assert.calledOnce(company._wrap)
          sinon.assert.calledWith(company._wrap, 'create', createParams)
          expect(results).to.equal(returnedVal)
        })
        .asCallback(done)
    })
  })

  describe('listBy', () => {
    const listByParams = {
      company_id: 'Companies ID'
    }
    const returnedVal = {
      body: {
        foo: 'bar'
      }
    }
    beforeEach((done) => {
      sinon.stub(company, '_wrap').returns(Promise.resolve(returnedVal))
      done()
    })

    afterEach((done) => {
      company._wrap.restore()
      done()
    })

    it('should call _wrap with the proper parameters', (done) => {
      company.listBy(listByParams)
        .then((results) => {
          sinon.assert.calledOnce(company._wrap)
          sinon.assert.calledWith(company._wrap, 'listBy', listByParams)
          expect(results).to.equal(returnedVal.body)
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
      sinon.stub(company, '_wrap').returns(Promise.resolve(returnedVal))
      done()
    })

    afterEach((done) => {
      company._wrap.restore()
      done()
    })

    it('should call _wrap with the proper parameters', (done) => {
      company.list()
        .then((results) => {
          sinon.assert.calledOnce(company._wrap)
          sinon.assert.calledWith(company._wrap, 'list')
          expect(results).to.equal(returnedVal.body)
        })
        .asCallback(done)
    })
  })

  describe('listUsers', () => {
    const companyId = 'Companies ID'
    const returnedVal = {
      body: {
        foo: 'bar'
      }
    }
    beforeEach((done) => {
      sinon.stub(company, '_wrap').returns(Promise.resolve(returnedVal))
      done()
    })

    afterEach((done) => {
      company._wrap.restore()
      done()
    })

    it('should call _wrap with the proper parameters', (done) => {
      company.listUsers(companyId)
        .then((results) => {
          sinon.assert.calledOnce(company._wrap)
          sinon.assert.calledWith(company._wrap, 'listUsers', {id: companyId})
          expect(results).to.equal(returnedVal.body)
        })
        .asCallback(done)
    })
  })
})
