'use strict'

const exists = require('101/exists')

/**
 * Utility methods used by the orion intercom module.
 * @class
 * @author Ryan Sandor Richards
 */
class Util {
  /**
   * Determines if we can use intercom
   * @returns {boolean}
   */
  static canUseIntercom () {
    return (
      exists(process.env.INTERCOM_APP_ID) &&
      exists(process.env.INTERCOM_API_KEY)
    )
  }
}

module.exports = Util
