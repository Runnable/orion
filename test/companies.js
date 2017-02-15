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
      companies: {
        create: sinon.stub().returns(Promise.resolve('create'))
      }
    }, 'companies')
    sinon.stub(Util, 'canUseIntercom').returns(true)
    done()
  })

  afterEach((done) => {
    Util.canUseIntercom.restore()
    done()
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
        companies: [{ 'foo': 'bar' }],
        pages: {
          page: 1,
          total_pages: 1
        }
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
          expect(results).to.equal(returnedVal.body.companies)
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
