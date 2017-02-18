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
   * @param {String} tag.id - Tag unique identifier
   * @param {String} tag.name - Tag name
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of create command in intercom
   * @see https://developers.intercom.io/reference#create-and-update-tags
   */
  create (tag) {
    return this._wrap('create', tag)
  }

  /**
   * Delete a tag
   * @param {Object} tag
   * @param {String} tag.id - Array of companies to untag (can use id, company_id)
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of delete command in intercom
   */
  delete (tag) {
    return this._wrap('delete', tag)
  }

  /**
   * List Tags.
   * @return {Promise} Resolves with the body of the list call for the type.
   */
  list () {
    return this._wrap('list')
      .bind(this)
      .get('body')
  }

  /**
   * Create or update a tag on a company/user object, passes data through to intercom
   * @param {Object} tag
   * @param {Array} tag.companies - Array of companies to tag (can use id, company_id)
   * @param {Array} tag.users - Array of users to tag (can use id, user_id)
   * @param {String} tag.name - Tag name [Required]
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of tag command in intercom
   */
  tag (tag) {
    return this._wrap('tag', tag)
  }

  /**
   * Remove a tag from a company/user object, passes data through to intercom
   * @param {Object} tag
   * @param {Array} tag.companies - Array of companies to untag (can use id, company_id)
   * @param {Array} tag.users - Array of users to untag (can use id, user_id)
   * @param {String} tag.name - Tag name [required]
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of untag command in intercom
   */
  untag (tag) {
    return this._wrap('untag', tag)
  }


}

module.exports = Tags
