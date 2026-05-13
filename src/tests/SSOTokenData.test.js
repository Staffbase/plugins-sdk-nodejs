const SSOTokenData = require('../lib/SSOTokenData');
const fs = require('fs');
const path = require('path');

const curTime = Math.floor(Date.now() / 1000);
const expTime = Math.floor(Date.now() / 1000) + (60 * 60);
const notBeforeTime = curTime - (1000 * 60);

const secretPub = fs.readFileSync(path.join(__dirname, '../../testKeyFiles/jwtRS256.key')).toString();

const tokenDataVals = {
  CLAIM_BRANCH_ID: '5e3bfa789f436c5e2ee5141a',
  CLAIM_BRANCH_SLUG: 'staffbase',
  CLAIM_AUDIENCE: 'testPlugin',
  CLAIM_EXPIRE_AT: expTime,
  CLAIM_NOT_BEFORE: notBeforeTime,
  CLAIM_ISSUED_AT: curTime,
  CLAIM_ISSUER: 'api.staffbase.com',
  CLAIM_INSTANCE_ID: '55c79b6ee4b06c6fb19bd1e2',
  CLAIM_INSTANCE_NAME: 'Our locations',
  CLAIM_USER_ID: '541954c3e4b08bbdce1a340a',
  CLAIM_USER_EXTERNAL_ID: 'jdoe',
  CLAIM_USER_USERNAME: 'john.doe',
  CLAIM_USER_PRIMARY_EMAIL_ADDRESS: 'jdoe@email.com',
  CLAIM_USER_FULL_NAME: 'John Doe',
  CLAIM_USER_FIRST_NAME: 'John',
  CLAIM_USER_LAST_NAME: 'Doe',
  CLAIM_USER_ROLE: 'editor',
  CLAIM_ENTITY_TYPE: 'type',
  CLAIM_THEME_TEXT_COLOR: '#00ABAB',
  CLAIM_THEME_BACKGROUND_COLOR: '#FFAABB',
  CLAIM_USER_LOCALE: 'en-US',
  USER_ROLE_USER: 'user',
  USER_ROLE_EDITOR: 'editor',
};
const SSOTokenDataObj = new SSOTokenData(tokenDataVals);
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('Testing SSOTokenData Class', () => {
  describe('Testing SSOTokenData.getSigned', () => {
    describe('Sync mode', () => {
      test('Test secret to be non string', () => {
        expect( () => {
          SSOTokenDataObj.getSigned({});
        }).toThrow('Secret must be a string value');
      });
      test('Should throw error if no secret specified', () => {
        expect( () => {
          SSOTokenDataObj.getSigned();
        }).toThrow('No secret specified');
      });
      test('Should return signed value if secret specified', () => {
        expect( () => {
          const signed = SSOTokenDataObj.getSigned(secretPub);
          expect(signed).not.toBeFalsy();
        }).not.toThrow();
      });
    });
    describe('Async mode', () => {
      // test('Test secret to be non string', (done) => {
      //   SSOTokenDataObj.getSigned({}, (err, secret) => {
      //     console.log(err);
      //     expect(err).toEqual('Secret must be a string value');
      //   });
      // });
      test('Test secret to be non string with callback', (done) => {
        SSOTokenDataObj.getSigned({}, (err) => {
          expect(err).toBe('Secret must be a string value');
          done();
        });
      });
      test('Should throw if callback is not a function', () => {
        expect(() => {
          SSOTokenDataObj.getSigned(secretPub, 'notAFunction');
        }).toThrow('Callback must be a function');
      });
      test('Should return error if no secret specified', (done) => {
        SSOTokenDataObj.getSigned(null, (err, signed) => {
          expect(err).toBe('No secret specified');
          done();
        });
      });
      test('Should return signed value in callback if secret specified', (done) => {
        SSOTokenDataObj.getSigned(secretPub, (err, signed) => {
          expect(err).toBeFalsy();
          expect(signed).not.toBeFalsy();
          done();
        });
      });
    });
  });

  describe('Testing SSOTokenData._getSignedWrong', () => {
    describe('Sync mode', () => {
      test('Should throw if no secret specified', () => {
        expect(() => {
          SSOTokenDataObj._getSignedWrong();
        }).toThrow('No secret specified');
      });
      test('Should return signed value with any string secret (HS256 default)', () => {
        const signed = SSOTokenDataObj._getSignedWrong('simple-secret');
        expect(signed).toBeDefined();
      });
    });
    describe('Async mode', () => {
      test('Should call callback with "No secret specified" when null secret and cb provided', () => {
        const calls = [];
        SSOTokenDataObj._getSignedWrong(null, (err) => {
          calls.push(err);
        });
        expect(calls[0]).toBe('No secret specified');
      });
      test('Should call callback with signed value if secret specified', (done) => {
        SSOTokenDataObj._getSignedWrong('simple-secret', (err, signed) => {
          expect(err).toBeFalsy();
          expect(signed).toBeDefined();
          done();
        });
      });
    });
    describe('Catch block', () => {
      test('Should throw when jwt.sign throws internally', () => {
        const jwt = require('jsonwebtoken');
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
          throw new Error('mocked jwt error');
        });
        expect(() => {
          SSOTokenDataObj._getSignedWrong('some-secret');
        }).toThrow('mocked jwt error');
        jest.restoreAllMocks();
      });
    });
  });

  describe('Testing getSigned catch block', () => {
    test('getSigned returns undefined when jwt.sign throws with invalid RSA key', () => {
      const result = SSOTokenDataObj.getSigned('not-a-valid-rsa-key');
      expect(result).toBeUndefined();
    });
  });
});

describe('Testing SSOTokenData getter methods', () => {
  test('getBranchId returns correct value', () => {
    expect(SSOTokenDataObj.getBranchId()).toBe('5e3bfa789f436c5e2ee5141a');
  });
  test('getBranchSlug returns correct value', () => {
    expect(SSOTokenDataObj.getBranchSlug()).toBe('staffbase');
  });
  test('getAudience returns correct value', () => {
    expect(SSOTokenDataObj.getAudience()).toBe('testPlugin');
  });
  test('getExpireAtTime returns correct value', () => {
    expect(SSOTokenDataObj.getExpireAtTime()).toBe(tokenDataVals.CLAIM_EXPIRE_AT);
  });
  test('getNotBeforeTime returns correct value', () => {
    expect(SSOTokenDataObj.getNotBeforeTime()).toBe(tokenDataVals.CLAIM_NOT_BEFORE);
  });
  test('getIssuedAtTime returns correct value', () => {
    expect(SSOTokenDataObj.getIssuedAtTime()).toBe(tokenDataVals.CLAIM_ISSUED_AT);
  });
  test('getIssuer returns correct value', () => {
    expect(SSOTokenDataObj.getIssuer()).toBe('api.staffbase.com');
  });
  test('getInstanceId returns correct value', () => {
    expect(SSOTokenDataObj.getInstanceId()).toBe('55c79b6ee4b06c6fb19bd1e2');
  });
  test('getInstanceName returns correct value', () => {
    expect(SSOTokenDataObj.getInstanceName()).toBe('Our locations');
  });
  test('getUserId returns correct value', () => {
    expect(SSOTokenDataObj.getUserId()).toBe('541954c3e4b08bbdce1a340a');
  });
  test('getUserExternalId returns correct value', () => {
    expect(SSOTokenDataObj.getUserExternalId()).toBe('jdoe');
  });
  test('getUserUsername returns correct value', () => {
    expect(SSOTokenDataObj.getUserUsername()).toBe('john.doe');
  });
  test('getUserPrimaryEmailAddress returns correct value', () => {
    expect(SSOTokenDataObj.getUserPrimaryEmailAddress()).toBe('jdoe@email.com');
  });
  test('getFullName returns correct value', () => {
    expect(SSOTokenDataObj.getFullName()).toBe('John Doe');
  });
  test('getFirstName returns correct value', () => {
    expect(SSOTokenDataObj.getFirstName()).toBe('John');
  });
  test('getLastName returns correct value', () => {
    expect(SSOTokenDataObj.getLastName()).toBe('Doe');
  });
  test('getRole returns correct value', () => {
    expect(SSOTokenDataObj.getRole()).toBe('editor');
  });
  test('getType returns correct value', () => {
    expect(SSOTokenDataObj.getType()).toBe('type');
  });
  test('getThemeTextColor returns correct value', () => {
    expect(SSOTokenDataObj.getThemeTextColor()).toBe('#00ABAB');
  });
  test('getThemeBackgroundColor returns correct value', () => {
    expect(SSOTokenDataObj.getThemeBackgroundColor()).toBe('#FFAABB');
  });
  test('getLocale returns correct value', () => {
    expect(SSOTokenDataObj.getLocale()).toBe('en-US');
  });
  test('isEditor returns true for editor role', () => {
    expect(SSOTokenDataObj.isEditor()).toBe(true);
  });
  test('isEditor returns false for non-editor role', () => {
    const userTokenData = new SSOTokenData({...tokenDataVals, CLAIM_USER_ROLE: 'user'});
    expect(userTokenData.isEditor()).toBe(false);
  });
  test('getTags returns null when no tags', () => {
    expect(SSOTokenDataObj.getTags()).toBeNull();
  });
  test('_getClaim throws for invalid claim name', () => {
    expect(() => {
      SSOTokenDataObj._getClaim('INVALID_CLAIM');
    }).toThrow('Invalid Claim');
  });
  test('toJSObj returns correct structure', () => {
    const obj = SSOTokenDataObj.toJSObj();
    expect(obj.aud).toBe('testPlugin');
    expect(obj.sub).toBe('541954c3e4b08bbdce1a340a');
  });
  test('toJSObjPretty returns correct structure', () => {
    const obj = SSOTokenDataObj.toJSObjPretty();
    expect(obj.CLAIM_AUDIENCE).toBe('testPlugin');
    expect(obj.CLAIM_USER_ID).toBe('541954c3e4b08bbdce1a340a');
  });
});
