const StaffBaseSSO = require('../lib/SSOToken');
const helpers = require('./helpers');
const TOKEN_QUERY_PARAM = 'jwt';

const constants = require('./tokenDataConsts');
const SECRET_ENV_VAR = constants.secretKeyEnv;
const AUD_ENV_VAR = constants.pluginIDEnv;
/**
 * Mountable express middleware functions
 * @param  {string} secret The secret public provided by StaffBase
 * @param  {String} audience Audience parma of jwt. This is the your plugin ID registered in StaffBase servers
 * @return {function}        Calls the next() handler in the roule handlers chain
 */
function ssoMiddleWare(secret, audience) {
  // Get default values from ENV Vars
  secret = secret || process.env[SECRET_ENV_VAR];
  audience = audience || process.env[AUD_ENV_VAR];
  // Convert key under the hood
  let formattedSecret;
  try {
    formattedSecret = helpers.transformKeyToFormat(secret);
  } catch (err) {
    console.log('Unable to transform key to right format.', err.message);
    console.log(`
There was an error in initializing the middleware handler.\
You might notbe able to decode the token data`);
    formattedSecret = null;
  }
  return function(req, res, next) {
    if (!formattedSecret) {
      console.log('Unsupported secret.');
      return next();
    }
    if (req.query[TOKEN_QUERY_PARAM]) {
      const token = req.query[TOKEN_QUERY_PARAM];
      try {
        const SSOContents = new StaffBaseSSO(audience, formattedSecret, token);
        req.sbSSO = SSOContents.getTokenData();
        return next();
      } catch (tokenErr) {
        console.log('Error decoding token:', tokenErr);
        return next();
      }
    }
    next();
  };
}

module.exports = ssoMiddleWare;
