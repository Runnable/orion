'use strict'

const Base = require('./base')

/**
 * Tags - Used for communication with intercomClient's tags objects
 * @class
 */
class Tags extends Base {

  /**
   * Create or update a tag on a company/user object, passes data through to intercom
   * @param {Object} tag
   * @param {Object} tag.id - Tag unique identifier
   * @param {Object} tag.name - Tag name
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of create command in intercom
   * @see https://developers.intercom.io/reference#create-and-update-tags
   */
  create (tag) {
    return this.wrap('create', tag)
  }

  /**
   * Create or update a tag on a company/user object, passes data through to intercom
   * @param {Object} tag
   * @param {Object} tag.id - Tag unique identifier [required]
   * @param {Object} tag.name - Tag name
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of tag command in intercom
   */
  tag (tag) {
    return this.wrap('tag', tag)
  }

  /**
   * Remove a tag from a company/user object, passes data through to intercom
   * @param {Object} tag
   * @param {Object} tag.users - Array of companies to untag (can use id, company_id)
   * @param {Object} tag.users - Array of users to untag ()
   * @param {Object} tag.name - Tag name [required]
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of untag command in intercom
   */
  untag (tag) {
    return this.wrap('untag', tag)
  }

  /**
   * Delete a tag
   * @param {Object} tag
   * @param {Object} tag.id - Array of companies to untag (can use id, company_id)
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of delete command in intercom
   */
  delete (tag) {
    return this.wrap('delete', tag)
  }

}

module.exports = Tags
