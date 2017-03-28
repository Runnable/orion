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
const Tags = require('../lib/tags')
const Util = require('../lib/util')

describe('Tags', () => {
  let tag

  beforeEach((done) => {
    tag = new Tags({
      tags: {
        create: sinon.stub().returns(Promise.resolve('create')),
        delete: sinon.stub().returns(Promise.resolve('delete')),
        list: sinon.stub().returns(Promise.resolve('list')),
        tag: sinon.stub().returns(Promise.resolve('tag')),
        untag: sinon.stub().returns(Promise.resolve('untag'))
      }
    }, 'tags')
    sinon.stub(Util, 'canUseIntercom').returns(true)
    done()
  })

  afterEach((done) => {
    Util.canUseIntercom.restore()
    done()
  })

  describe('create', () => {
    const createParams = {
      tag_id: 'Tag ID',
      name: 'Tag name'
    }
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
      tag.create(createParams)
        .then((results) => {
          sinon.assert.calledOnce(tag._wrap)
          sinon.assert.calledWith(tag._wrap, 'create', createParams)
          expect(results).to.equal(returnedVal)
        })
        .asCallback(done)
    })
  })

  describe('delete', () => {
    const deleteParams = {
      tag_id: 'Tag ID'
    }
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
      tag.delete(deleteParams)
        .then((results) => {
          sinon.assert.calledOnce(tag._wrap)
          sinon.assert.calledWith(tag._wrap, 'delete', deleteParams)
          expect(results).to.equal(returnedVal)
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
          sinon.assert.calledWith(tag._wrap, 'list')
          expect(results).to.equal(returnedVal.body)
        })
        .asCallback(done)
    })
  })

  describe('tag', () => {
    const tagParams = {
      companies: [
        {
          id: 'softwareCompany'
        }
      ],
      name: 'Tag name'
    }
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
      tag.tag(tagParams)
        .then((results) => {
          sinon.assert.calledOnce(tag._wrap)
          sinon.assert.calledWith(tag._wrap, 'tag', tagParams)
          expect(results).to.equal(returnedVal)
        })
        .asCallback(done)
    })
  })

  describe('untag', () => {
    const untagParams = {
      companies: [
        {
          id: 'softwareCompany'
        }
      ],
      name: 'Tag name'
    }
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
      tag.untag(untagParams)
        .then((results) => {
          sinon.assert.calledOnce(tag._wrap)
          sinon.assert.calledWith(tag._wrap, 'untag', untagParams)
          expect(results).to.equal(returnedVal)
        })
        .asCallback(done)
    })
  })

  it('should extend base', (done) => {
    expect(tag).to.be.an.instanceOf(Base)
    done()
  })
})
