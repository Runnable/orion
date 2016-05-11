'use strict'

const isFunction = require('101/is-function')
const Promise = require('bluebird')
const Util = require('./util')

/**
 * Users - Used for communication with intercomClient's user object
 * @class
 * @author Ryan Kahn
 */
class Users {
  /**
   * Constructor for Users
   * @param {object} client Intercom client for customer related actions.
   */
  constructor (client) {
    this.client = client
  }

  /**
   * Helper method to wrap all the intercomClient.users calls around
   * `canUseIntercom`
   * @param {String} method Name of the method to wrap for the intercom
   *   users client.
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
          throw new Error('Users._wrap: invalid users client')
        }

        const clientMethod = this.client[method]
        if (!isFunction(clientMethod)) {
          throw new Error(`Users._wrap: users has no method '${method}'`)
        }

        return clientMethod.apply(
          clientMethod,
          // NOTE: The first argument is the method name, so we skip it here
          Array.prototype.slice.call(arguments, 1)
        )
      })
  }

  /**
   * Upsert a user object, passes data through to intercom
   * @param {Object} userParams
   * @param {Object} userParams.user_id - User unique identifier
   * @param {Object} userParams.name - User name
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of create command in intercom
   * @see https://developers.intercom.io/reference#create-or-update-user
   */
  create (userParams) {
    return this._wrap('create', userParams)
  }
}

module.exports = Users
