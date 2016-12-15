'use strict'

const Base = require('./base')

/**
 * Messages - Used for admin initiated conversations
 * @class
 * @author Sohail Ahmed
 */
class Messages extends Base {
  /**
   * Initiate a conversation given necessary parameters
   * @param {Object} messageData
   * @param {Object} messageData.message_type - Email or Message
   * @param {Object} messageData.subject - Email subject line
   * @param {Object} messageData.body - Message body
   * @param {Object} messageData.template - Email template
   * @param {Object} messageData.from - from object with type and id keys required
   * @param {Object} messageData.to - to object with type and id keys required
   *
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of create command in intercom
   * @see https://developers.intercom.com/reference#admin-initiated-conversation
   */
  create (messageData) {
    return this._wrap('create', messageData)
  }

}

module.exports = Messages
