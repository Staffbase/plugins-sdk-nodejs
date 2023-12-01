After installation you just need to include the module in your own Javascript Program.
The module can be included using the following syntax:

```javascript
const StaffBaseSSO = require('{{pluginNpmName}}').sso;
```
## About secret token
Staffbase backend support only RS256 algorithm of JWT which means that the secret
you should provide must be the content of public key in the `PKCS8` format.
This means your public key should start and end with tags:

```
-----BEGIN PUBLIC KEY-----
BASE64 ENCODED DATA
-----END PUBLIC KEY-----
```

You can use the helper function to read and verify if your public key is in the supported format.
```javascript
const helpers = require(`{{pluginNpmName}}`).helpers;
const publicKeyPath = '[[Your File Path]]';
let keySecret;
try {
	keySecret = helpers.readKeyFile(publicKeyPath);
} catch (err) {
	console.log('Error Reading Key file', err);
}
```

You can then use keySecret to get an instance of StaffBaseSSO class.

## Getting the SSOTokenData instance
You should have got your plugin id and Public Key file from Staffbase. After receiving the jwt token
from the Staffbase backend, you can use the module to get the contents of the token.

```javascript
const pluginId = '[As received from Staffbase]';
const publicKey = '[As received from Staffbase]';
const jwtToken = '[As received in current request via jwt query parameter]';
let tokenData = null;
try {
	let SSOContents = new StaffBaseSSO(pluginId, publicKey, jwtToken);
	tokenData = SSOContents.getTokenData();
	console.log('Received token data:', tokenData);
} catch(tokenErr) {
 	console.error('Error decoding token:', tokenErr);
}
```

If no exception is thrown, you would get a SSOTokenData instance in the tokenData
variable which you can use to get contents of the SSO Token.

The following data can be retrieved from the token:

|Helper Name|Token Key| Fetch Function| Description|
| --- | --- | --- | --- |
|CLAIM_BRANCH_ID|branch_id|getBranchId()|Get the branch ID for which the token was issued.|
|CLAIM_BRANCH_SLUG|branch_slug|getBranchSlug()|Get the branch slug for which the token was issued.|
|CLAIM_AUDIENCE|aud|getAudience()|Get targeted audience of the token.|
|CLAIM_EXPIRE_AT|exp|getExpireAtTime()|Get the time when the token expires.|
|CLAIM_NOT_BEFORE|nbf|getNotBeforeTime()|Get the time when the token starts to be valid.|
|CLAIM_ISSUED_AT|iat|getIssuedAtTime()|Get the time when the token was issued.|
|CLAIM_ISSUER|iss|getIssuer()|Get issuer of the token.|
|CLAIM_INSTANCE_ID|instance_id|getInstanceId()|Get the (plugin) instance id for which the token was issued.|
|CLAIM_INSTANCE_NAME|instance_name|getInstanceName()|Get the (plugin) instance name for which the token was issued.|
|CLAIM_USER_ID|sub|getUserId()|Get the id of the authenticated user.|
|CLAIM_USER_EXTERNAL_ID|external_id|getUserExternalId()|Get the id of the user in an external system.|
|CLAIM_USER_USERNAME|username|getUserUsername()|Get the username of the user accessing.|
|CLAIM_USER_PRIMARY_EMAIL_ADDRESS|primary_email_address|getUserPrimaryEmailAddress()|Get the primary email address of the user accessing.|
|CLAIM_USER_FULL_NAME|name|getFullName()|Get either the combined name of the user or the name of the token.|
|CLAIM_USER_FIRST_NAME|given_name|getFirstName()|Get the first name of the user accessing.|
|CLAIM_USER_LAST_NAME|family_name|getLastName()|Get the last name of the user accessing.|
|CLAIM_USER_ROLE|role|getRole()|Get the role of the accessing user.|
|CLAIM_ENTITY_TYPE|type|getType()|Get the type of the token.|
|CLAIM_THEME_TEXT_COLOR|theming_text|getThemeTextColor()|Get text color used in the overall theme for this audience.|
|CLAIM_THEME_BACKGROUND_COLOR|theming_bg|getThemeBackgroundColor()|Get background color used in the overall theme for this audience.|
|CLAIM_USER_LOCALE|locale|getLocale()|Get the locale of the requesting user in the format of language tags.|

It is not guaranteed that the token would contain information of all the keys.
If there is no value for the corresponding field, the SDK would return a `null` value.

## Using with Express
You can use the provided helper middleware to simply mount it to your express
server and get an instance of SSOTokenData class in your Express request object.

You need to provide your *Secret Key* and *Plugin ID* to the middleware so it can decode the data.
The key can be provided in the constructor or by setting an Environment variables `{{secretKeyEnv}}` and `{{pluginIDEnv}}` respectively.

To provide the key using constructor:
```javascript
const ssoSecret = [[YOUR_PUBLIC_KEY_HERE]];
const SSOMiddleware = require('{{pluginNpmName}}').middleware;
let ssoMiddleWare = ssoMiddleWare(ssoSecret);
```

After getting an instance of the middleware function, you can simply mount it to your
SSO URL of the plugin. If the secret is fine and the middleware is able to decode the token,
an instance of `SSOTokenData` can be used in `req.sbSSO`.

```javascript
const ssoSecret = [[YOUR_PUBLIC_KEY_HERE]];
const SSOMiddleware = require('{{pluginNpmName}}').middleware;
let ssoMiddleWare = SSOMiddleware(ssoSecret);

const redirectURL = '/staffbase/sso/backoffice';
let express = require('express');
let app = express();

// Request Handler for client side of plugin
app.use('/frontEnd', ssoMiddleWare);
app.get('/frontEnd', function(req, res) {
  if (req.sbSSO) {
    // Render the decoded object using Express templating engine
    return res.render('plugin', req.sbSSO);
  }
  return res.end("Unable to decode token data");
});

// Apply middleware on the SSO URL
app.use(redirectURL, ssoMiddleWare);
// Your request handler for admin side of plugin below
app.get(redirectURL, function(req, res) {
  // Middleware was able to decode the token
  // console.log('Got SSO Request from backend', req.query);
  if (req.sbSSO) {
    let ssoTokenData = req.sbSSO;
    // Send back the token data back.
    res.json(ssoTokenData);
    return res.end();
  }
  res.json({
    error: {
      msg: "Unable to get token information."
    }
  });
  return res.end();
});
```

### Generating Express Template
You can also use the `{{createToolPkgName}}` CLI tool to start a template for a basic
express server configured with the SDK. For more detail please check out the
[Project Repo]({{createToolURL}}).
