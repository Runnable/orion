'use strict'

const isFunction = require('101/is-function')
const Promise = require('bluebird')
const Util = require('./util')

/**
 * Tags - Used for communication with intercomClient's tags objects
 * @class
 */
class Tags {
  /**
   * Constructor for Tags
   * @param {object} client Intercom client for tag related actions.
   */
  constructor (client) {
    this.client = client
  }

  /**
   * Helper method to wrap all the intercomClient.tags calls around
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
          throw new Error('Tags._wrap: invalid users client')
        }

        const clientMethod = this.client[method]
        if (!isFunction(clientMethod)) {
          throw new Error(`Tags._wrap: users has no method '${method}'`)
        }

        return clientMethod.apply(
          this.client,
          // NOTE: The first argument is the method name, so we skip it here
          Array.prototype.slice.call(arguments, 1)
        )
      })
  }

  /**
   * List tags.
   * @return {Promise} Resolves with list of tags of form:
   *   { "type": "tag", "id": "375750", "name": "bryantest" }
   */
  list () {
    return this._wrap('list')
  }
}

module.exports = Tags
