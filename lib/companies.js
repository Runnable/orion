'use strict'

const Base = require('./base')
const Users = require('./users')

/**
 * Companies - Used for communication with intercomClient's company object
 * @class
 * @author Ryan Kahn
 */
class Companies extends Base {
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
   * List all the users who belong to a particular company
   * @param {String} companyId - ID of the company we are listing users for
   * @returns {Promise<Array>} - Returns success if intercom is disabled,
   *   otherwise returns list of users
   */
  listUsers (companyId) {
    const users = new Users(this.client, 'users')
    return this._wrap('listUsers', { id: companyId })
      .get('body')
      .then(body => users._getPages(body))
  }
}

module.exports = Companies
