const jsdoc2md = require('jsdoc-to-markdown');
const handlebars = require('handlebars');
const fs = require('fs');
const sections = require('./sections');
const path = require('path');

// Build Markdown file form src JSDoc
jsdoc2md.render({
  files: path.join(__dirname, '../src/**/*.js'),
  plugin: 'dmd-bitbucket',
})
    .then( (mdData) => {
      // Copy JSDoc file to docs folder
      fs.writeFile(path.join(__dirname, '../docs/API.MD'), mdData, (err) => {
        if (err) {
          return Promise.reject(err);
        }
        return Promise.resolve('File Written');
      });
    })
    .then( () => {
      // Generate Readme.MD from Template
      return sections.getTplPromise();
    })
    .then( (retArr) => {
      const OverviewText = retArr[0];
      const InstallationText = retArr[1];
      const ApiReferenceText = retArr[2];
      const usageText = retArr[3];
      const contributionText = retArr[4];
      const testText = retArr[5];
      const licenseText = retArr[6];
      const footerText = retArr[7];

      return new Promise( (resolve, reject) => {
        fs.readFile(path.join(__dirname, './mainFile.tpl'), (err, mainTpl) => {
          if (err) {
            reject(err);
          } else {
            const tpl = handlebars.compile(mainTpl.toString());
            const rendered = tpl({
              overview: OverviewText,
              installation: InstallationText,
              reference: ApiReferenceText,
              usage: usageText,
              contribution: contributionText,
              tests: testText,
              license: licenseText,
              footer: footerText,
            });
            // Copy generated markdown file to root folder
            fs.writeFile(path.join(__dirname, '../README.MD'), rendered, (err, done) => {
              if (err) {
                reject(err);
              } else {
                resolve('done');
              }
            });
          }
        });
      });
    })
    .then( () => {
      console.log('Completed Document Generation');
    });
