const Lab = require('lab')
const lab = exports.lab = Lab.script()
const afterEach = lab.afterEach
const beforeEach = lab.beforeEach
const describe = lab.describe
const it = lab.test
const expect = require('code').expect

const Util = require('../lib/util')

describe('util', () => {
  describe('canUseIntercom', () => {
    const oldIntercomAPIKey = process.env.INTERCOM_API_KEY
    const oldIntercomAppId = process.env.INTERCOM_APP_ID

    beforeEach((done) => {
      process.env.INTERCOM_API_KEY = 'fake api key'
      process.env.INTERCOM_APP_ID = 'fake app id'
      done()
    })

    afterEach((done) => {
      process.env.INTERCOM_API_KEY = oldIntercomAPIKey
      process.env.INTERCOM_APP_ID = oldIntercomAppId
      done()
    })

    it('should return false if no INTERCOM_APP_ID', (done) => {
      delete process.env.INTERCOM_API_KEY
      expect(Util.canUseIntercom()).to.be.false()
      done()
    })

    it('should return false if no INTERCOM_APP_ID', (done) => {
      delete process.env.INTERCOM_APP_ID
      expect(Util.canUseIntercom()).to.be.false()
      done()
    })

    it('should return true if everything is set properly', (done) => {
      expect(Util.canUseIntercom()).to.equal(true)
      done()
    })
  }) // end 'canUseIntercom'
}) // end 'util'
