'use strict'

const Promise = require('bluebird')
const Intercom = require('intercom-client')
const envIs = require('101/env-is')
const exists = require('101/exists')

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

  /**
   * Upsert a company object, passes data through to intercom
   * Possible parameters: https://developers.intercom.io/reference#create-or-update-company
   * @param {Object} companyParams
   * @param {Object} companyParams.company_id - Company unique identifier
   * @param {Object} companyParams.name - Company name
   * @returns {Promise} - Returns success if intercom is disabled,
   * otherwise returns results of create command in intercom
   */
  upsertCompany (companyParams) {
    if (!this.canUseIntercom()) {
      return Promise.resolve()
    }
    return this.intercomClient.companies.create(companyParams)
  }
}

module.exports = Orion
