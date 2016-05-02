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

describe('Companies', function () {
  let orionStub
  let company
  beforeEach((done) => {
    orionStub = {
      canUseIntercom: sinon.stub().returns(true),
      intercomClient: {
        companies: {
          create: sinon.stub()
        }
      }
    }
    company = new Companies(orionStub)
    orionStub.canUseIntercom.reset()
    done()
  })

  describe('_wrap', () => {
    it('should do nothing if we can\'t use intercom', (done) => {
      orionStub.canUseIntercom.returns(false)
      company._wrap('create', '1', '2', '3')
        .then(() => {
          sinon.assert.calledOnce(orionStub.canUseIntercom)
          sinon.assert.notCalled(orionStub.intercomClient.companies.create)
        })
        .asCallback(done)
    })

    it('should call method on companies with all the supplied arguments', (done) => {
      orionStub.canUseIntercom.returns(true)
      orionStub.intercomClient.companies.create.returns(Promise.resolve('create'))
      company._wrap('create', '1', '2', '3')
        .then(() => {
          sinon.assert.calledOnce(orionStub.canUseIntercom)
          sinon.assert.calledOnce(orionStub.intercomClient.companies.create)
          sinon.assert.calledWith(orionStub.intercomClient.companies.create, '1', '2', '3')
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
