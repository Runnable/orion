'use strict'

const Promise = require('bluebird')

/**
 * Companies - Used for communication with intercomClient's company object
 * @class
 * @author Ryan Kahn
 */
class Companies {

  /**
   * Constructor for Companies
   * @param {Orion} orion - Instance of Orion which is used for the intercom client and canUseIntercom methods
   */
  constructor (orion) {
    this.orion = orion
  }

  /**
   * Helper method to wrap all the intercomClient.companies calls around canUseIntercom
   * @param {String} method
   * @returns {Promise} - Returns success if intercom is disabled,
   * otherwise returns results of call to intercom client
   * @private
   */
  _wrap (method) {
    if (!this.orion.canUseIntercom()) {
      return Promise.resolve()
    }
    var args = Array.prototype.slice.call(arguments)
    args.shift()
    return this.orion.intercomClient.companies[method].apply(this.orion.intercomClient.companies, args)
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
  create (companyParams) {
    return this._wrap('create', companyParams)
  }

  /**
   * List companies by a tag or segment
   * Possible parameters: https://developers.intercom.io/reference#list-by-tag-or-segment
   * @param {Object} query
   * @returns {Promise<Array>} - Returns success if intercom is disabled,
   * otherwise returns list of companies
   */
  listBy (query) {
    return this._wrap('listBy', query)
      .get('body')
  }

  /**
   * List all companies
   * @returns {Promise<Array>} - Returns success if intercom is disabled,
   * otherwise returns list of companies
   */
  list () {
    return this._wrap('list')
      .get('body')
  }

  /**
   * List all the users who belong to a particular company
   * @param {String} companyId - ID of the company we are listing users for
   * @returns {Promise<Array>} - Returns success if intercom is disabled,
   * otherwise returns list of users
   */
  listUsers (companyId) {
    return this._wrap('listUsers', {
      id: companyId
    })
      .get('body')
  }
}

module.exports = Companies
