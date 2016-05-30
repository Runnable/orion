'use strict'

const Companies = require('./companies')
const Intercom = require('intercom-client')
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
      tags: Tags,
      users: Users
    }

    Object.keys(classes).forEach((name) => {
      const ClassName = classes[name]
      this[name] = new ClassName(this.intercomClient, name)
    })
  }
}

module.exports = Orion
