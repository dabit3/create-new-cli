#!/usr/bin/env node

require('shelljs/global');
const paths = require('path');
const figlet = require('figlet');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const Git = require("nodegit");
const fs = require('fs');

const commands = require('./rewritefiles');

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

const installPackages = () => {
  console.log(chalk.white.bold('Installing Packages'));
  return new Promise((resolve, reject) => {
    let command;
    let args = ['install'];

    if (shouldUseYarn()) {
      command = 'yarn';
    } else {
      command = 'npm';
    }

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`
        });
        return;
      }
      resolve();
    })
  })
}

const build = (appName, author, command, repo = false) => {
  cp('-r', __dirname + '/../src/.', appName);
  if (repo) {
    Git.Clone(repo, `${appName}/src`)
      .then(repository => {
        doReWrites(appName, author, command)
      })
  } else {
    mkdir(`${appName}/src`)
    doReWrites(appName, author, command)
  }
}

function doReWrites(appName, author, command, repo) {
  commands.rewritePackageJson(`${appName}/package.json`, author, command)
    .then(() => {
      commands.rewriteBuild(`${appName}/bin/build.js`, appName)
        .then(() => {
          cd(appName);
          installPackages()
            .then(() => {
              console.log('installed all packages..')
              console.log('----------------------------------------------------------');
              figlet(`${appName}`, function(err, data) {
                if (err) {
                  console.log('error...', err)
                  return;
                }
                console.log(data)
              });
              console.log(chalk.green(`Congratulations, ${appName} has now been successfully generated...`))
            })
            .catch(error => {
              console.log(chalk.red('An unexpected error occurred'))
              console.log(chalk.red(error));
            });
        })
    })
}

module.exports = build