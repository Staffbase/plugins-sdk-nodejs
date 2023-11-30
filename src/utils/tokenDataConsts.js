const constants = {
  CLAIM_BRANCH_ID: 'branch_id',
  CLAIM_BRANCH_SLUG: 'branch_slug',
  CLAIM_AUDIENCE: 'aud',
  CLAIM_EXPIRE_AT: 'exp',
  CLAIM_NOT_BEFORE: 'nbf',
  CLAIM_ISSUED_AT: 'iat',
  CLAIM_ISSUER: 'iss',
  CLAIM_INSTANCE_ID: 'instance_id',
  CLAIM_INSTANCE_NAME: 'instance_name',
  CLAIM_USER_ID: 'sub',
  CLAIM_USER_EXTERNAL_ID: 'external_id',
  CLAIM_USER_USERNAME: 'username',
  CLAIM_USER_PRIMARY_EMAIL_ADDRESS: 'primary_email_address',
  CLAIM_USER_FULL_NAME: 'name',
  CLAIM_USER_FIRST_NAME: 'given_name',
  CLAIM_USER_LAST_NAME: 'family_name',
  CLAIM_USER_ROLE: 'role',
  CLAIM_ENTITY_TYPE: 'type',
  CLAIM_THEME_TEXT_COLOR: 'theming_text',
  CLAIM_THEME_BACKGROUND_COLOR: 'theming_bg',
  CLAIM_USER_LOCALE: 'locale',
  USER_TAGS: 'tags',
  // Default ENV Vars
  secretKeyEnv: 'STAFFBASE_SSO_SECRET',
  pluginIDEnv: 'STAFFBASE_SSO_AUDIENCE',
};

module.exports = constants;
