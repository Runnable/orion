'use strict'

const Companies = require('./companies')
const Intercom = require('intercom-client')
const Messages = require('./messages')
const Promise = require('bluebird')
const Tags = require('./tags')
const Users = require('./users')
const Util = require('./util')

/**
 * Orion, the huntsman, in charge of helping us hunt down those big customers.
 * Used for communication with intercom with very little mucking about
 * configuration.
 * @class
 * @author Ryan Kahn
 */
class Orion {
  /**
   * Creates a new Orion instance for reporting to intercom
   */
  constructor () {
    // Initialize intercom client
    if (Util.canUseIntercom()) {
      this.intercomClient = new Intercom.Client(
        process.env.INTERCOM_APP_ID,
        process.env.INTERCOM_API_KEY
      ).usePromises()
    }

    const classes = {
      companies: Companies,
      messages: Messages,
      tags: Tags,
      users: Users
    }

    Object.keys(classes).forEach((name) => {
      const ClassName = classes[name]
      this[name] = new ClassName(this.intercomClient, name)
    })
  }

  /**
   * To maintain compatibility with Intercom's client, this nextPage function
   * can be used for pagination on any type.
   * @see https://github.com/intercom/intercom-node#pagination
   * @return {Object} pageInfo Pagination information from a previous request.
   * @returns {Promise} Returns success if intercom is disabled, otherwise
   *   returns results of call to intercom client.
   */
  nextPage (pageInfo) {
    return Promise.try(() => {
      if (!Util.canUseIntercom()) { return }

      if (!this.intercomClient) {
        throw new Error('Orion.nextPage: invalid intercom client')
      }

      return this.intercomClient.nextPage(pageInfo).get('body')
    })
  }
}

module.exports = Orion
