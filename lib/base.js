'use strict'

const isFunction = require('101/is-function')
const keypather = require('keypather')()
const Promise = require('bluebird')

const Util = require('./util')

/**
 * Base class to wrap intercom client.
 * @class
 */
class Base {
  /**
   * Constructor for Base
   * @param {Object} client Intercom client.
   */
  constructor (client, name) {
    this.baseClient = client
    this.client = keypather.get(client, name)
    this.name = name
  }

  /**
   * Helper method to wrap all client methods.
   * @param {String} method Name of the method to wrap.
   * @returns {Promise} Returns success if intercom is disabled, otherwise
   *   returns results of call to intercom client.
   * @private
   */
  _wrap (method) {
    return Promise.resolve()
      .then(() => {
        if (!Util.canUseIntercom()) { return }

        if (!this.client) {
          throw new Error(`Base._wrap: invalid ${this.name} client`)
        }

        const clientMethod = this.client[method]
        if (!isFunction(clientMethod)) {
          throw new Error(`
            Base._wrap: ${this.name} client has no method '${method}'`
          )
        }

        return clientMethod.apply(
          this.client,
          // NOTE: The first argument is the method name, so we skip it here
          Array.prototype.slice.call(arguments, 1)
        )
      })
  }

  /**
   * List Objects. This is pretty universal.
   * @return {Promise} Resolves with the body of the list call for the type.
   */
  list () {
    return this._wrap('list').get('body')
  }
}

module.exports = Base
