'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const sinon = require('sinon')
const beforeEach = lab.beforeEach
const expect = require('code').expect
const Promise = require('bluebird')

const Base = require('../lib/base')
const Tags = require('../lib/tags')

describe('Tags', () => {
  let tag

  beforeEach((done) => {
    tag = new Tags({
      tags: {
        list: sinon.stub().returns(Promise.resolve('list'))
      }
    })
    done()
  })

  it('should extend base', (done) => {
    expect(tag).to.be.an.instanceOf(Base)
    done()
  })
})
