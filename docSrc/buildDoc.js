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
	fs.writeFile(path.join(__dirname, '../docs/API.MD'), mdData, (err, done) => {
		if (err) {
			return Promise.reject(err);
		}
		return Promise.resolve('File Written');
	});
})
.then( (out) => {
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

	return new Promise( (resolve, reject) => {
		fs.readFile(path.join(__dirname, './mainFile.tpl'), (err, mainTpl) => {
			if (err) {
				reject(err);
			} else {
				let tpl = handlebars.compile(mainTpl.toString());
				let rendered = tpl({
					overview: OverviewText,
					installation: InstallationText,
					reference: ApiReferenceText,
					usage: usageText,
					contribution: contributionText,
					tests: testText,
					license: licenseText,
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
.then( (res) => {
	console.log('Completed Document Generation');
});
