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
          throw new Error(
            `Base._wrap: ${this.name} client has no method '${method}'`
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
   * Helper method to get all objects from all pages
   * @param {Object} body Response body from Intercom
   * @param {Promise<Array>} objects Concatenated list of all objects
   */
  _getAllObjects (body, objects) {
    return Promise.try(() => {
      if (!body) {
        throw new Error(`Failed to find ${this.name} on Intercom.`)
      }
      if (!body[this.name.toLowerCase()]) {
        return
      }
      objects = objects.concat(body[this.name])
      if (body.pages.page < body.pages.total_pages) {
        return this.baseClient.nextPage(body.pages)
          .get('body')
          .then(body => this._getAllObjects(body, objects))
      }
      return objects
    })
  }

  /**
   * List objects by specific parameters
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
   * List Objects.
   * @return {Promise} Resolves with the body of the list call for the type.
   */
  list () {
    return this._wrap('list')
      .bind(this)
      .get('body')
  }

}

module.exports = Base
