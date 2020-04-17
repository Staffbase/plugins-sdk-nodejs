const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');

const pluginNpmUrl = 'http://npmjs.org/package/staffbase-plugins-nodejs';
const pluginNpmName = '@staffbase/staffbase-plugin-sdk';
const apiRefPath = 'docs/API.MD';
const createToolURL = 'https://github.com/Staffbase/create-staffbase-plugin-nodejs';
const createToolPkgName = 'create-staffbase-plugin';

const SBConsts = require('../../src/utils/tokenDataConsts.js');

module.exports = {
  getTplPromise: function() {
    const overviewPromise = new Promise( (resolve, reject) => {
      fs.readFile(path.join(__dirname, 'overview.tpl'), (err, overviewData) => {
        if (err) {
          reject(err);
        } else {
          resolve(overviewData.toString());
        }
      });
    });
    const installationPromise = new Promise( (resolve, reject) => {
      fs.readFile(path.join(__dirname, 'installation.tpl'), (err, installationTpl) => {
        if (err) {
          reject(err);
        } else {
          const tpl = handlebars.compile(installationTpl.toString());
          const rendered = tpl({
            pluginNpmUrl: pluginNpmUrl,
            pluginNpmName: pluginNpmName,
          });
          resolve(rendered);
        }
      });
    });
    const apiRefPromise = new Promise( (resolve, reject) => {
      fs.readFile(path.join(__dirname, 'reference.tpl'), (err, apiRefTpl) => {
        if (err) {
          reject(err);
        } else {
          const tpl = handlebars.compile(apiRefTpl.toString());
          const rendered = tpl({
            apiRefPath: apiRefPath,
          });
          resolve(rendered);
        }
      });
    });
    const usagePromise = new Promise( (resolve, reject) => {
      fs.readFile(path.join(__dirname, 'usage.tpl'), (err, usageTpl) => {
        if (err) {
          reject(err);
        } else {
          const tpl = handlebars.compile(usageTpl.toString());
          const rendered = tpl({
            pluginNpmName: pluginNpmName,
            secretKeyEnv: SBConsts.secretKeyEnv,
            pluginIDEnv: SBConsts.pluginIDEnv,
            createToolPkgName: createToolPkgName,
            createToolURL: createToolURL,
          });
          resolve(rendered);
        }
      });
    });
    const contributionPromise = new Promise( (resolve, reject) => {
      fs.readFile(path.join(__dirname, 'contribution.tpl'), (err, contribTpl) => {
        if (err) {
          reject(err);
        } else {
          const tpl = handlebars.compile(contribTpl.toString());
          const rendered = tpl({

          });
          resolve(rendered);
        }
      });
    });
    const testPromise = new Promise( (resolve, reject) => {
      fs.readFile(path.join(__dirname, 'tests.tpl'), (err, testsTpl) => {
        if (err) {
          reject(err);
        } else {
          const tpl = handlebars.compile(testsTpl.toString());
          const rendered = tpl({

          });
          resolve(rendered);
        }
      });
    });
    const licensePromise = new Promise( (resolve, reject) => {
      fs.readFile(path.join(__dirname, 'license.tpl'), (err, licenseTpl) => {
        if (err) {
          reject(err);
        } else {
          const tpl = handlebars.compile(licenseTpl.toString());
          const rendered = tpl({

          });
          resolve(rendered);
        }
      });
    });
    return Promise.all([
      overviewPromise,
      installationPromise,
      apiRefPromise,
      usagePromise,
      contributionPromise,
      testPromise,
      licensePromise,
    ]);
  },
};
