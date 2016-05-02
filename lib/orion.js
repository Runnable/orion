'use strict'

const Intercom = require('intercom-client')
const envIs = require('101/env-is')
const exists = require('101/exists')
const Company = require('./company')

/**
 * Orion, the huntsman, in charge of helping us hunt down those big customers.
 * Used for communication with intercom with very little mucking about configuration
 * @class
 * @author Ryan Kahn
 */
class Orion {
  /**
   * Creates a new Orion instance for reporting to intercom
   */
  constructor () {
    this.company = new Company(this)
    if (!this.canUseIntercom()) { return }
    this.intercomClient = new Intercom.Client(process.env.INTERCOM_APP_ID, process.env.INTERCOM_API_KEY).usePromises()
  }

  /**
   * Determines if we can use intercom
   * @returns {boolean}
   */
  canUseIntercom () {
    return exists(process.env.INTERCOM_APP_ID) &&
        exists(process.env.INTERCOM_API_KEY) &&
        !envIs('test')
  }
}

module.exports = Orion
