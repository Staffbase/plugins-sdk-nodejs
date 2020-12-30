const jwt = require('jsonwebtoken');
const TokenDataConsts = require('../utils/tokenDataConsts');

/**
 * SSOTokenData Class used to host the token data values and provide getter functions to extract correspinding values.
 * @type {SSOTokenData}
 */
class SSOTokenData {

  /**
   * SSO Token Data
   * @param  {Object} tokenVals TokenVals object wit keys representing possible SSO token values.
   */
  constructor(tokenVals) {
    this.aud = tokenVals.CLAIM_AUDIENCE;
    this.exp = tokenVals.CLAIM_EXPIRE_AT;
    this.nbf = tokenVals.CLAIM_NOT_BEFORE;
    this.iat = tokenVals.CLAIM_ISSUED_AT;
    this.iss = tokenVals.CLAIM_ISSUER;
    this.instance_id = tokenVals.CLAIM_INSTANCE_ID;
    this.instance_name = tokenVals.CLAIM_INSTANCE_NAME;
    this.sub = tokenVals.CLAIM_USER_ID;
    this.external_id = tokenVals.CLAIM_USER_EXTERNAL_ID;
    this.username = tokenVals.CLAIM_USER_USERNAME;
    this.primary_email_address = tokenVals.CLAIM_USER_PRIMARY_EMAIL_ADDRESS;
    this.name = tokenVals.CLAIM_USER_FULL_NAME;
    this.given_name = tokenVals.CLAIM_USER_FIRST_NAME;
    this.family_name = tokenVals.CLAIM_USER_LAST_NAME;
    this.role = tokenVals.CLAIM_USER_ROLE;
    this.type = tokenVals.CLAIM_ENTITY_TYPE;
    this.theming_text = tokenVals.CLAIM_THEME_TEXT_COLOR;
    this.theming_bg = tokenVals.CLAIM_THEME_BACKGROUND_COLOR;
    this.locale = tokenVals.CLAIM_USER_LOCALE;
    this.tags = tokenVals.USER_TAGS;
  }

  /**
   * Get signed string representation of the token data
   * @param  {String}   secret The Secret to be used for signing the token.
   * The supported algorithm is RS256 so it is important that the secret is read
   * from a private key file.
   * @param  {Function} cb     Optional callback function to get the signed data
   * in a callback pattern.
   * @return {String}          Signed representation of the token data. Returns
   * if no callback is specified.
   */
  getSigned(secret, cb) {
    if (secret && typeof secret !== 'string') {
      if (!cb) {
        throw new Error('Secret must be a string value');
      }
      cb('Secret must be a string value');
      return;
    }
    if (cb && typeof cb !== 'function') {
      throw new Error('Callback must be a function');
    }
    // using callback pattern for legacy support. No Promises
    if (!secret) {
      if (!cb) {
        throw new Error('No secret specified');
      }
      cb('No secret specified');
      return;
    }
    try {
      if (!cb) {
        return jwt.sign(this.toJSObj(), secret, {algorithm: 'RS256'});
      }
      jwt.sign(this.toJSObj(), secret, {algorithm: 'RS256'}, cb);
    } catch (err) {
      console.log('error in signing jdk', err);
      // throw new Error(err);
    }
  }
  /**
   * Get a wrong signed string representation of the token data with a non supported
   * (by Staffbase) Algotirhm. (Private). Used for tests
   * @param  {String}   secret The Secret to be used for signing the token
   * @param  {Function} cb     Optional callback function to get the signed data
   * in a callback pattern.
   * @return {String}          Signed representation of the token data. Returns
   * if no callback is specified.
   */
  _getSignedWrong(secret, cb) {
    // using callback pattern for legacy support. No Promises
    if (!secret) {
      if (!cb) {
        throw new Error('No secret specified');
      }
      cb('No secret specified');
    }
    try {
      if (!cb) {
        return jwt.sign(this.toJSObj(), secret);
      }
      jwt.sign(this.toJSObj(), secret, cb);
    } catch (err) {
      console.log('error in signing jdk', err);
      throw new Error(err);
    }
  }
  /**
   * Convert Token Data to an internally used keys for Claims
   * @return {Object} With internally  represented values for the jwt
   */
  toJSObj() {
    return {
      aud: this.aud,
      exp: this.exp,
      nbf: this.nbf,
      iat: this.iat,
      iss: this.iss,
      instance_id: this.instance_id,
      instance_name: this.instance_name,
      sub: this.sub,
      external_id: this.external_id,
      username: this.username,
      primary_email_address: this.primary_email_address,
      name: this.name,
      given_name: this.given_name,
      family_name: this.family_name,
      role: this.role,
      type: this.type,
      theming_text: this.theming_text,
      theming_bg: this.theming_bg,
      locale: this.locale,
      tags: this.tags,
    };
  }
  /**
   * Convert Token  Data to a CLAIM Represented JS Object
   * @return {Object} with possible Claim Values.
   */
  toJSObjPretty() {
    return {
      CLAIM_AUDIENCE: this.aud,
      CLAIM_EXPIRE_AT: this.exp,
      CLAIM_NOT_BEFORE: this.nbf,
      CLAIM_ISSUED_AT: this.iat,
      CLAIM_ISSUER: this.iss,
      CLAIM_INSTANCE_ID: this.instance_id,
      CLAIM_INSTANCE_NAME: this.instance_name,
      CLAIM_USER_ID: this.sub,
      CLAIM_USER_EXTERNAL_ID: this.external_id,
      CLAIM_USER_USERNAME: this.username,
      CLAIM_USER_PRIMARY_EMAIL_ADDRESS: this.primary_email_address,
      CLAIM_USER_FULL_NAME: this.name,
      CLAIM_USER_FIRST_NAME: this.given_name,
      CLAIM_USER_LAST_NAME: this.family_name,
      CLAIM_USER_ROLE: this.role,
      CLAIM_ENTITY_TYPE: this.type,
      CLAIM_THEME_TEXT_COLOR: this.theming_text,
      CLAIM_THEME_BACKGROUND_COLOR: this.theming_bg,
      CLAIM_USER_LOCALE: this.locale,
      USER_TAGS: this.tags,
    };
  }
  /**
   * Internally used to get value against the client param string.
   * @param  {String} claimName The claim name as defined in the tokenDataConsts
   * @return {String|number|null}           The  correspinding value of the Specified claim name.
   */
  _getClaim(claimName) {
    if (!TokenDataConsts[claimName]) {
      throw new Error('Invalid Claim');
    }
    return this[TokenDataConsts[claimName]] || null;
  }
  /**
   * Get targeted audience of the token.
   *
   * @return {null|string}
   */
  getAudience() {
    return this._getClaim('CLAIM_AUDIENCE');
  }

  /**
   * Get the time when the token expires.
   *
   * @return {number}
   */
  getExpireAtTime() {
    return this._getClaim('CLAIM_EXPIRE_AT');
  }

  /**
   * Get the time when the token starts to be valid.
   *
   * @return {number}
   */
  getNotBeforeTime() {
    return this._getClaim('CLAIM_NOT_BEFORE');
  }

  /**
   * Get the time when the token was issued.
   *
   * @return {number}
   */
  getIssuedAtTime() {
    return this._getClaim('CLAIM_ISSUED_AT');
  }

  /**
   * Get issuer of the token.
   *
   * @return {null|string}
   */
  getIssuer() {
    return this._getClaim('CLAIM_ISSUER');
  }

  /**
   * Get the (plugin) instance id for which the token was issued.
   *
   * The id will always be present.
   *
   * @return {string}
   */
  getInstanceId() {
    return this._getClaim('CLAIM_INSTANCE_ID');
  }

  /**
   * Get the (plugin) instance name for which the token was issued.
   *
   * @return {null|string}
   */
  getInstanceName() {
    return this._getClaim('CLAIM_INSTANCE_NAME');
  }

  /**
   * Get the id of the authenticated user.
   *
   * @return {null|string}
   */
  getUserId() {
    return this._getClaim('CLAIM_USER_ID');
  }

  /**
   * Get the id of the user in an external system.
   *
   * Example use case would be to map user from an external store
   * to the entry defined in the token.
   *
   * @return {null|string}
   */
  getUserExternalId() {
    return this._getClaim('CLAIM_USER_EXTERNAL_ID');
  }

  /**
   * Get the username of the user accessing.
   *
   * @return {null|string}
   */
  getUserUsername() {
    return this._getClaim('CLAIM_USER_USERNAME');
  }

  /**
   * Get the primary email address of the user accessing.
   *
   * @return {null|string}
   */
  getUserPrimaryEmailAddress() {
    return this._getClaim('CLAIM_USER_PRIMARY_EMAIL_ADDRESS');
  }

  /**
   * Get either the combined name of the user or the name of the token.
   *
   * @return {null|string}
   */
  getFullName() {
    return this._getClaim('CLAIM_USER_FULL_NAME');
  }

  /**
   * Get the first name of the user accessing.
   *
   * @return {null|string}
   */
  getFirstName() {
    return this._getClaim('CLAIM_USER_FIRST_NAME');
  }

  /**
   * Get the last name of the user accessing.
   *
   * @return {null|string}
   */
  getLastName() {
    return this._getClaim('CLAIM_USER_LAST_NAME');
  }

  /**
   * Get the role of the accessing user.
   *
   * If this is set to “editor”, the requesting user may manage the contents
   * of the plugin instance, i.e. she has administration rights.
   * The type of the accessing entity can be either a “user” or a “editor”.
   *
   * @return {null|string}
   */
  getRole() {
    return this._getClaim('CLAIM_USER_ROLE');
  }

  /**
   * Get the type of the token.
   *
   * The type of the accessing entity can be either a “user” or a “token”.
   *
   * @return {null|string}
   */
  getType() {
    return this._getClaim('CLAIM_ENTITY_TYPE');
  }

  /**
   * Get text color used in the overall theme for this audience.
   *
   * The color is represented as a CSS-HEX code.
   *
   * @return {null|string}
   */
  getThemeTextColor() {
    return this._getClaim('CLAIM_THEME_TEXT_COLOR');
  }

  /**
   * Get background color used in the overall theme for this audience.
   *
   * The color is represented as a CSS-HEX code.
   *
   * @return {null|string}
   */
  getThemeBackgroundColor() {
    return this._getClaim('CLAIM_THEME_BACKGROUND_COLOR');
  }

  /**
   * Get the locale of the requesting user in the format of language tags.
   *
   * @return {null|string}
   */
  getLocale() {
    return this._getClaim('CLAIM_USER_LOCALE');
  }

  /**
   * Check if the user is an editor.
   *
   * The user will always have a user role to prevent a bug class
   * on missing values. Only when the editor role is explicitly
   * provided the user will be marked as editor.
   *
   * @return {boolean}
   */
  isEditor() {
    return this._getClaim('CLAIM_USER_ROLE') === 'editor';
  }

  /**
   * Get User Tags
   * @return {String[]} A String array containing user tags.
   */
  getTags() {
    return this._getClaim('USER_TAGS');
  }

}

module.exports = SSOTokenData;
