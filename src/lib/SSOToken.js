const TokenData = require('./SSOTokenData');
const jwt = require('jsonwebtoken');
/**
 * SSOToken Class. Used as an interface to decode the Staffbase SSO Token.
 */
class SSOToken {

  /**
   * Create an instance of SSOToken to parse signed token data received from StaffBase backend.
   * @param   {String} audience Audience param of jwt. This is the your plugin ID registered in StaffBase servers
   * @param {String} appSecret  App Secret used to decode the token data
   * @param {String} tokenData Signed Token Data to be decoded
   */
  constructor(audience, appSecret, tokenData) {
    // Check validity of audience
    if (audience === undefined || audience === null) {
      throw new Error('Audience null or not specified');
    }
    if (typeof audience !== 'string') {
      throw new Error('Audience must be a string value');
    }
    if (!audience.trim()) {
      throw new Error('Audience cannot be an empty string');
    }

    // Check Validity of appSecret
    if (appSecret === undefined || appSecret === null) {
      // App secret not specified
      throw new Error('App Secret null or not specified');
    }
    if (typeof appSecret !== 'string') {
      throw new Error('App Secret must be a string value');
    }
    if (!appSecret.trim()) {
      throw new Error('App Secret cannot be an empty string');
    }

    // Check Validity of tokenData
    if (tokenData === undefined || tokenData === null) {
      throw new Error('Token Data null or not specified');
    }
    if (typeof tokenData !== 'string') {
      throw new Error('Token Data must be a string value');
    }
    if (!tokenData.trim()) {
      throw new Error('Token Data cannot be an empty string');
    }
    let decoded = null;

    // Verify Token
    try {
      const jwtOpts = {
        algorithms: ['RS256'],
        audience: audience,
      };
      decoded = jwt.verify(tokenData, appSecret, jwtOpts);
      // console.log('Decoded Data:', decoded);
    } catch (err) {
      const message = err.message;

      switch (true) {
        case message === 'invalid algorithm':
          throw new Error('Token Algorithm in not encoded in a supported format');

        case message.indexOf('PEM routines:get_name:no start line') !== -1:
        case message.indexOf('PEM_read_bio_PUBKEY failed') !== -1:
        case message.indexOf('secretOrPublicKey must be an asymmetric key when using') !== -1:
          throw new Error('Unable to read public key');

        case message.indexOf('jwt audience invalid') !== -1:
          throw new Error('Incorrect audience value');

        default:
          // console.log('Unhandled jwt error', err);
          throw new Error(err);
      }
    }

    const tokenDataInst = new TokenData({
      CLAIM_AUDIENCE: decoded.aud || null,
      CLAIM_EXPIRE_AT: decoded.exp || null,
      CLAIM_NOT_BEFORE: decoded.nbf || null,
      CLAIM_ISSUED_AT: decoded.iat || null,
      CLAIM_ISSUER: decoded.iss || null,
      CLAIM_INSTANCE_ID: decoded.instance_id || null,
      CLAIM_INSTANCE_NAME: decoded.instance_name || null,
      CLAIM_USER_ID: decoded.sub || null,
      CLAIM_USER_EXTERNAL_ID: decoded.external_id || null,
      CLAIM_USER_USERNAME: decoded.username || null,
      CLAIM_USER_PRIMARY_EMAIL_ADDRESS: decoded.primary_email_address || null,
      CLAIM_USER_FULL_NAME: decoded.name || null,
      CLAIM_USER_FIRST_NAME: decoded.given_name || null,
      CLAIM_USER_LAST_NAME: decoded.family_name || null,
      CLAIM_USER_ROLE: decoded.role || null,
      CLAIM_ENTITY_TYPE: decoded.type || null,
      CLAIM_THEME_TEXT_COLOR: decoded.theming_text || null,
      CLAIM_THEME_BACKGROUND_COLOR: decoded.theming_bg || null,
      CLAIM_USER_LOCALE: decoded.locale || null,
      USER_TAGS: decoded.tags || null,
    });
    // Decode Token Data
    if (tokenDataInst instanceof TokenData === false) {
      throw new Error('Token Data is not an instance of TokenData class');
    }
    this.appSecret = appSecret;
    this.tokenData = tokenDataInst;
  }
  /**
   * Get  TokenData Object parsed by the SSOToken class.
   * @return {SSOTokenData} a TokenData object which can be used  to get SSO Token inforamtion.
   */
  getTokenData() {
    return this.tokenData;
  }

}
module.exports = SSOToken;
