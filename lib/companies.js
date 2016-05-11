'use strict'

const isFunction = require('101/is-function')
const Promise = require('bluebird')
const Util = require('./util')

/**
 * Companies - Used for communication with intercomClient's company object
 * @class
 * @author Ryan Kahn
 */
class Companies {
  /**
   * Constructor for Companies
   * @param {object} client Intercom client for customer related actions.
   */
  constructor (client) {
    this.client = client
  }

  /**
   * Helper method to wrap all the intercomClient.companies calls around
   * `canUseIntercom`
   * @param {String} method Name of the method to wrap for the intercom
   *   companies client.
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of call to intercom client
   * @private
   */
  _wrap (method) {
    return Promise.resolve()
      .then(() => {
        if (!Util.canUseIntercom()) {
          return
        }

        if (!this.client) {
          throw new Error('Companies._wrap: invalid companies client')
        }

        const clientMethod = this.client[method]
        if (!isFunction(clientMethod)) {
          throw new Error(`Companies._wrap: companies has no method '${method}'`)
        }

        return clientMethod.apply(
          this.client,
          // NOTE: The first argument is the method name, so we skip it here
          Array.prototype.slice.call(arguments, 1)
        )
      })
  }

  /**
   * Upsert a company object, passes data through to intercom
   * @param {Object} companyParams
   * @param {Object} companyParams.company_id - Company unique identifier
   * @param {Object} companyParams.name - Company name
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of create command in intercom
   * @see https://developers.intercom.io/reference#create-or-update-company
   */
  create (companyParams) {
    return this._wrap('create', companyParams)
  }

  /**
   * List companies by a tag or segment
   * @param {Object} query
   * @returns {Promise<Array>} - Returns success if intercom is disabled,
   *   otherwise returns list of companies
   * @see https://developers.intercom.io/reference#list-by-tag-or-segment
   */
  listBy (query) {
    return this._wrap('listBy', query)
      .get('body')
  }

  /**
   * List all companies
   * @returns {Promise<Array>} - Returns success if intercom is disabled,
   *   otherwise returns list of companies
   */
  list () {
    return this._wrap('list')
      .get('body')
  }

  /**
   * List all the users who belong to a particular company
   * @param {String} companyId - ID of the company we are listing users for
   * @returns {Promise<Array>} - Returns success if intercom is disabled,
   *   otherwise returns list of users
   */
  listUsers (companyId) {
    return this._wrap('listUsers', { id: companyId })
      .get('body')
  }
}

module.exports = Companies
