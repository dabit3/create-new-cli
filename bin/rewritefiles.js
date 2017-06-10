const fs = require('fs');

const commands = {};

const rewritePackageJson = (file, author, name) => {
  return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      let result1 = data.replace(/"name": "",/g, `"name": "${name}",`);
      const result2 = result1.replace(/"author": "",/g, `"author": "${author}",`);

      fs.writeFile(file, result2, 'utf8', function (err) {
        if (err) return console.log(err);
        resolve();
      });
    });
  })
}

const rewriteBuild = (file, name) => {
  return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      let result = data.replace(/PROJECTNAME/g, `${name}`);

      fs.writeFile(file, result, 'utf8', function (err) {
        if (err) return console.log(err);
        resolve();
      });
    });
  })
}

commands.rewritePackageJson = rewritePackageJson;
commands.rewriteBuild = rewriteBuild;

module.exports = commands;
