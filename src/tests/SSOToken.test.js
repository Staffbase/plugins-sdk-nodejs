const fs = require('fs');
const path = require('path');

const SSOToken = require('../lib/SSOToken');
const SSOTokenData = require('../lib/SSOTokenData');

const testTokenSecret = 'asdasd';
const wrongTokenData = 'testData';

const keyTokenPriv = fs.readFileSync(path.join(__dirname, '../../testKeyFiles/jwtRS256.key')).toString();
const keyTokenPub = fs.readFileSync(path.join(__dirname, '../../testKeyFiles/jwtRS256.pub')).toString();

let curTime = Math.floor(Date.now() / 1000);
let expTime = Math.floor(Date.now() / 1000) + (60 * 60);
let notBeforeTime = curTime - (1000 * 60);
let correctAudience = 'testPlugin';
let wrongAudience = 'wrongIssuer';

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

let SSOExpTokenDataVals = Object.assign({}, tokenDataVals, {CLAIM_EXPIRE_AT: curTime});
let SSOExpTokenDataObj = new SSOTokenData(SSOExpTokenDataVals);

// let encodedToken = SSOTokenDataObj.getSigned(testTokenSecret);
let encodedTokenWrongAlgo = SSOTokenDataObj._getSignedWrong(testTokenSecret);
let encodedTokenExp = SSOExpTokenDataObj.getSigned(keyTokenPriv);

let encodedTokenWithKey = SSOTokenDataObj.getSigned(keyTokenPriv); // Get signed verison using private key

describe('Testing SSOToken Class', () => {
    describe('Testing SSOToken Constructor', () => {
        test('test token constructor with undefined params', () => {
            expect(() => {
                new SSOToken();
            }).toThrow('Audience null or not specified');
        });

        describe('Testing Token constructor App Secret cases', () => {
            test('test token constructor with App Secret as null', () => {
                expect(() => {
                    new SSOToken(null, wrongTokenData, correctAudience);
                }).toThrowError('Audience null or not specified');
            });
            test('test token constructor with non String value for App Secret', () => {
                expect(() => {
                    new SSOToken({test: 1}, wrongTokenData, correctAudience);
                }).toThrowError('Audience must be a string value');
            });
            test('test token constructor with App Secret as empty string value', () => {
                expect(() => {
                    new SSOToken('', wrongTokenData, correctAudience);
                }).toThrowError('Audience cannot be an empty string');
            });
        });

        describe('Testing Token Constructor TokenData cases', () => {
            test('test token constructor with token encoded by unsupported algorithm', () => {
                expect(() => {
                    new SSOToken(correctAudience, keyTokenPub, encodedTokenWrongAlgo);
                }).toThrowError('Token Algorithm in not encoded in a supported format');
            });
            test('test token constructor with TokenData as null', () => {
                expect(() => {
                    new SSOToken(correctAudience, keyTokenPub, null);
                }).toThrowError('Token Data null or not specified');
            });
            test('test token constructor with non String value for Token Data', () => {
                expect(() => {
                    new SSOToken(correctAudience, keyTokenPub, {nonString: true});
                }).toThrowError('Token Data must be a string value');
            });
            test('test token constructor with Token Data as empty string value', () => {
                expect(() => {
                    new SSOToken(correctAudience, keyTokenPub, '');
                }).toThrowError('Token Data cannot be an empty string');
            });
            test('test token constructor unable to decode token', () => {
                expect(() => {
                    new SSOToken(correctAudience, keyTokenPub, wrongTokenData);
                }).toThrow();
            });
            test('test token constructor with wrong jwt secret public key file', () => {
                expect(() => {
                    new SSOToken(correctAudience, 'bad secret', encodedTokenWithKey);
                }).toThrowError('Unable to read public key');
            });
            test('test token constructor with expired token', () => {
                expect(() => {
                    new SSOToken(correctAudience, testTokenSecret, encodedTokenExp);
                }).toThrow();
            });
        });
        describe('Testing Token Constructor Audience cases', () => {
            test('test token constructor with Audience as null', () => {
                expect(() => {
                    new SSOToken(null, keyTokenPub, encodedTokenWithKey);
                }).toThrowError('Audience null or not specified');
            });
            test('test token constructor with non String value for Audience', () => {
                expect(() => {
                    new SSOToken({nonStringAud: true}, keyTokenPub, encodedTokenWithKey);
                }).toThrowError('Audience must be a string value');
            });
            test('test token constructor with Audience as empty string value', () => {
                expect(() => {
                    new SSOToken('', keyTokenPub, encodedTokenWithKey);
                }).toThrowError('Audience cannot be an empty string');
            });
            test('test token constructor with wrong Audience valie', () => {
                expect(() => {
                    new SSOToken(wrongAudience, keyTokenPub, encodedTokenWithKey);
                }).toThrowError('Incorrect audience value');
            });
        });
        test('test token constructor with token data correctly decoded', () => {
            expect(() => {
                // use public key to verify key
                let newToken = new SSOToken(correctAudience, keyTokenPub, encodedTokenWithKey);
                return newToken;
            }).not.toThrow();
        });

        test('test token constructor with token data correctly decoded with all values', () => {
            let newToken = new SSOToken(correctAudience, keyTokenPub, encodedTokenWithKey);
            const expected = {
                aud: 'testPlugin',
                exp: expTime,
                instance_id: '55c79b6ee4b06c6fb19bd1e2',
                family_name: 'Doe',
                given_name: 'John',
                external_Id: 'jdoe',
                iat: curTime,
                instance_id: '55c79b6ee4b06c6fb19bd1e2',
                instance_name: 'Our locations',
                iss: 'api.staffbase.com',
                locale: 'en-US',
                name: 'John Doe',
                nbf: notBeforeTime,
                role: 'editor',
                sub: '541954c3e4b08bbdce1a340a',
                tags: null,
                theming_bg: '#FFAABB',
                theming_text: '#00ABAB',
                type: 'type',
            };

            expect(newToken.getTokenData()).toEqual(expected);
        });
    });
});
