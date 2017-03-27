'use strict'

const Base = require('./base')

/**
 * Users - Used for communication with intercomClient's user object
 * @class
 * @author Ryan Kahn
 */
class Users extends Base {
  /**
   * Upsert a user object, passes data through to intercom
   * @param {Object} userParams
   * @param {Object} userParams.user_id - User unique identifier
   * @param {Object} userParams.name - User name
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of create command in intercom
   *   Example Response:
   *      { type: 'user',
   *        id: '561409dbd64903a13a001627',
   *        user_id: null,
   *        anonymous: false,
   *        email: 'cneill@gmail.com',
   *        name: 'und1sk0',
   *        pseudonym: null,
   *        avatar:
   *         { type: 'avatar',
   *           image_url: 'https://graph.facebook.com/658743372/picture?width=24&height=24' },
   *        app_id: 'wqzm3rju',
   *        companies: { type: 'company.list', companies: [Object] },
   *        location_data:
   *         { type: 'location_data',
   *           city_name: 'San Francisco',
   *           continent_code: 'NA',
   *           country_name: 'United States',
   *           latitude: 37.7484,
   *           longitude: -122.4156,
   *           postal_code: '94110',
   *           region_name: 'California',
   *           timezone: 'America/Los_Angeles',
   *           country_code: 'USA' },
   *        last_request_at: 1462927661,
   *        last_seen_ip: '98.210.192.155',
   *        created_at: 1444153819,
   *        remote_created_at: 1445019573,
   *        signed_up_at: 1445019573,
   *        updated_at: 1463003043,
   *        session_count: 352,
   *        social_profiles: { type: 'social_profile.list', social_profiles: [Object] },
   *        unsubscribed_from_emails: false,
   *        user_agent_data: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36',
   *        tags: { type: 'tag.list', tags: [Object] },
   *        segments: { type: 'segment.list', segments: [Object] },
   *        custom_attributes: { total_unread_count: 0 } }
   *
   * @see https://developers.intercom.io/reference#create-or-update-user
   */
  create (userParams) {
    return this._wrap('create', userParams)
  }

  /**
   * Find a user in Intercom by id, user_id, or email
   * @param {Object} userParams
   * @param {Object} userParams.id - User intercom id
   * @param {Object} userParams.user_id - User unique identifier
   * @param {Object} userParams.email - Users email
   * @returns {Promise} - Returns success if intercom is disabled, otherwise
   *   returns results of create command in intercom
   *
   * @see https://developers.intercom.io/reference#create-or-update-user
   */
  find (userParams) {
    return this._wrap('find', userParams)
  }


  /**
   * List all Users. With pagination
   * @return {Promise} Resolves with the body of the list call for the type.
   */
  list () {
    return this._wrap('list')
      .bind(this)
      .get('body')
      .then(body => this._getAllObjects(body,[]))
  }
}

module.exports = Users
