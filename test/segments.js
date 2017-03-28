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
const Segments = require('../lib/segments')

describe('Segments', () => {
  let segment

  beforeEach((done) => {
    segment = new Segments({
      segments: {
        list: sinon.stub().returns(Promise.resolve('list'))
      }
    })
    done()
  })

  it('should extend base', (done) => {
    expect(segment).to.be.an.instanceOf(Base)
    done()
  })
})
