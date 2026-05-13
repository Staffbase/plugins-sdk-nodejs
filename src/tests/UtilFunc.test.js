const helpers = require('../utils/helpers');
const path = require('path');

const invalidFilePath = path.resolve(__dirname, '../../testKeyFiles/missingfile.key');
const filePathInvKey = path.resolve(__dirname, '../../testKeyFiles/jwtRS256.key.pub');
const filePathValidKey = path.resolve(__dirname, '../../testKeyFiles/jwtRS256.pub');

const sampleBinaryKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApXd6RqV95G7+alU1PmA49n9IG8mCT27vpCpTJz3MGH+pqBEp6gLYDkP6lxK4ix5dy9NrOcKnaIWJ3xAc/JU+rVt6CiEyqJo4rchrNnRQsn4+P+efuVlsL959MqjzQC98qcVdf44C3wrxsOHE823zRACsJylOFkf7KkXd9c8L8vIj9x29q5K7NkGRKtOLKY7k4QPhlCVFDkMgAidHvi8HD7HDI6KYljguuhHUtRdrmC4i0NuwpSdqsavUJ9ASQu9Cr0QhpzOFJeZQ91ZkLoSDAkpSXAfBS+lvGtEnWLh7q3JczJOb3Tz8YolUTGfBlJ9iXiHDcY8PXdRTrvUVqeTe3wIDAQAB';
const samplePKCS8Key = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApXd6RqV95G7+alU1PmA4
9n9IG8mCT27vpCpTJz3MGH+pqBEp6gLYDkP6lxK4ix5dy9NrOcKnaIWJ3xAc/JU+
rVt6CiEyqJo4rchrNnRQsn4+P+efuVlsL959MqjzQC98qcVdf44C3wrxsOHE823z
RACsJylOFkf7KkXd9c8L8vIj9x29q5K7NkGRKtOLKY7k4QPhlCVFDkMgAidHvi8H
D7HDI6KYljguuhHUtRdrmC4i0NuwpSdqsavUJ9ASQu9Cr0QhpzOFJeZQ91ZkLoSD
AkpSXAfBS+lvGtEnWLh7q3JczJOb3Tz8YolUTGfBlJ9iXiHDcY8PXdRTrvUVqeTe
3wIDAQAB
-----END PUBLIC KEY-----`;
// This one contains newlines but no key headers
const sampleWrongKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApXd6RqV95G7+alU1PmA4
9n9IG8mCT27vpCpTJz3MGH+pqBEp6gLYDkP6lxK4ix5dy9NrOcKnaIWJ3xAc/JU+
rVt6CiEyqJo4rchrNnRQsn4+P+efuVlsL959MqjzQC98qcVdf44C3wrxsOHE823z
RACsJylOFkf7KkXd9c8L8vIj9x29q5K7NkGRKtOLKY7k4QPhlCVFDkMgAidHvi8H
D7HDI6KYljguuhHUtRdrmC4i0NuwpSdqsavUJ9ASQu9Cr0QhpzOFJeZQ91ZkLoSD
AkpSXAfBS+lvGtEnWLh7q3JczJOb3Tz8YolUTGfBlJ9iXiHDcY8PXdRTrvUVqeTe
3wIDAQAB`;

describe('Testing Utilitiy functions', () => {
  describe('Testing readKeyFile', () => {
    describe('testing sync calls', () => {
      test('test empty filePath string', () => {
        expect( () => {
          helpers.readKeyFile('');
        }).toThrow('Path not specified or empty');
      });
      test('test null filePath string', () => {
        expect( () => {
          helpers.readKeyFile(null);
        }).toThrow('Path not specified or empty');
      });
      test('test invalid filepath', () => {
        expect( () => {
          helpers.readKeyFile(invalidFilePath);
        }).toThrow('Invalid file path');
      });
      test('test reading invalid public key file', () => {
        expect( () => {
          helpers.readKeyFile(filePathInvKey);
        }).toThrow('Invalid key file');
      });
      test('test reading valid public key file', () => {
        expect( () => {
          const key = helpers.readKeyFile(filePathValidKey);
          // @TODO find regexp for PKCS8 Key format
          // expect(key).toMatch(/-----BEGIN PUBLIC KEY-----*-----END PUBLIC KEY-----/)
          // console.log('GOT KEY:', key);
          expect(key).toBeDefined();
        }).not.toThrow();
      });
    });
    describe('testing cb pattern', () => {
      test('test emptry filePath string', (done) => {
        helpers.readKeyFile('', (err, res) => {
          expect(err).toMatch(/Path not specified or empty/);
          done();
        });
      });
      test('test null filePath string', (done) => {
        helpers.readKeyFile(null, (err, res) => {
          expect(err).toMatch(/Path not specified or empty/);
          done();
        });
      });
      test('test invalid filepath', (done) => {
        helpers.readKeyFile(invalidFilePath, (err, res) => {
          expect(err).toMatch(/Invalid file path/);
          done();
        });
      });
      test('test reading invalid public key file', (done) => {
        helpers.readKeyFile(filePathInvKey, (err, res) => {
          expect(err).toMatch(/Invalid key file/);
          done();
        });
      });
      test('test reading valid public key file', (done) => {
        helpers.readKeyFile(filePathValidKey, (err, key) => {
          // console.log('GOT KEY:', key);
          expect(err).toBeFalsy();
          expect(key).toBeDefined();
          done();
        });
      });
    });
  });
  describe('testing transformKeyToFormat', () => {
    test('test transforming null secret / key', () => {
      expect( () => {
        helpers.transformKeyToFormat();
      }).toThrow('No Secret Specified');
    });
    test('test transforming a non string secret / key', () => {
      expect( () => {
        helpers.transformKeyToFormat({key: 'asdasdasd'});
      }).toThrow('Key can only be a string value');
    });
    test('test transforming empty secret / key', () => {
      expect( () => {
        helpers.transformKeyToFormat('');
      }).toThrow('Secret cannot be empty string');
    });
    test('test transforming from Binary to PKCS8 format', () => {
      expect( () => {
        const formattedSecret = helpers.transformKeyToFormat(sampleBinaryKey);
        expect(formattedSecret.indexOf('-----BEGIN PUBLIC KEY-----')).not.toEqual(-1);
        expect(formattedSecret.indexOf('-----END PUBLIC KEY-----')).not.toEqual(-1);
      }).not.toThrow();
    });
    test('test tranforming key in PKCS8 format', () => {
      expect( () => {
        const formattedSecret = helpers.transformKeyToFormat(samplePKCS8Key);
        expect(formattedSecret).toEqual(samplePKCS8Key);
      }).not.toThrow();
    });
    test('test transforming a key in wrong format', () => {
      expect( () => {
        helpers.transformKeyToFormat(sampleWrongKey);
      }).toThrow('Secret in Unsupported Format');
    });
  });
});

describe('Testing readKeyFile error edge cases', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('sync: should rethrow unexpected errors (not ENOENT or encoding too long)', () => {
    const fs = require('node:fs');
    jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => Buffer.from(''));
    expect(() => helpers.readKeyFile('/mocked/path')).toThrow('Empty key given');
  });

  test('async: should pass non-ENOENT fs.readFile errors to callback', (done) => {
    const fs = require('node:fs');
    const permError = new Error('EPERM: operation not permitted, open \'/some/path\'');
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, cb) => cb(permError, null));
    helpers.readKeyFile('/mocked/path', (err) => {
      expect(err).toBe(permError);
      done();
    });
  });

  test('async: should pass unexpected NodeRSA errors to callback', (done) => {
    const fs = require('node:fs');
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, cb) => cb(null, Buffer.from('')));
    helpers.readKeyFile('/mocked/path', (err) => {
      expect(err.message).toBe('Empty key given');
      done();
    });
  });
});
