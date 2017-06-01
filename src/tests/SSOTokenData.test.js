const SSOTokenData = require('../lib/SSOTokenData');
const fs = require('fs');
const path = require('path');

let curTime = Math.floor(Date.now() / 1000);
let expTime = Math.floor(Date.now() / 1000) + (60 * 60);
let notBeforeTime = curTime - (1000 * 60);

const secretPub = fs.readFileSync(path.join(__dirname, '../../testKeyFiles/jwtRS256.key')).toString();

let tokenDataVals = {
    CLAIM_AUDIENCE: 'testPlugin',
    CLAIM_EXPIRE_AT: expTime,
    CLAIM_NOT_BEFORE: notBeforeTime,
    CLAIM_ISSUED_AT: curTime,
    CLAIM_ISSUER: 'api.staffbase.com',
    CLAIM_INSTANCE_ID: '55c79b6ee4b06c6fb19bd1e2',
    CLAIM_INSTANCE_NAME: 'Our locations',
    CLAIM_USER_ID: '541954c3e4b08bbdce1a340a',
    CLAIM_USER_EXTERNAL_ID: 'jdoe',
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
let SSOTokenDataObj = new SSOTokenData(tokenDataVals);
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('Testing SSOTokenData Class', () => {
	describe('Testing SSOTokenData.getSigned', () => {
		describe('Sync mode', () => {
      test('Test secret to be non string', () => {
        expect( () => {
          SSOTokenDataObj.getSigned({});
        }).toThrowError('Secret must be a string value');
      });
			test('Should throw error if no secret specified', () => {
				expect( () => {
					SSOTokenDataObj.getSigned();
				}).toThrowError('No secret specified');
			});
      test('Should return signed value if secret specified', () => {
        expect( () => {
          let signed = SSOTokenDataObj.getSigned(secretPub);
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
});
