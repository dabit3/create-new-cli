#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const dashify = require('dashify');

const build = require('./build');
const pkg = require('../package.json');

let projectName;

let helpCalled = false;

program
  .version(pkg.version)
  .action(name => {
    projectName = name;
  })

program.on('--help', function() {
  help();
  helpCalled = true;
});

const isRepoPrompt = {
  type: 'list',
  name: 'isrepo',
  message: 'Would you like your project to be fetched from a git repo, or would you like to place your project from an existing folder?',
  choices: ['folder', 'repo'],
};

const commandPrompt = {
  type: 'string',
  name: 'command',
  message: 'Please enter desired command to generate your CLI (kebab-case):',
};

const namePrompt = {
  type: 'string',
  name: 'name',
  message: 'Name of your CLI? (CamelCase)',
};

const authorPrompt = {
  type: 'string',
  name: 'author',
  message: 'CLI author name:',
};

setImmediate(() => {
  console.log('helpCalled:', helpCalled);
  if (!helpCalled) {
    console.log('');
    console.log("Let's get started creating your new CLI.")
    console.log('');

    inquirer.prompt([
      commandPrompt,
      namePrompt,
      isRepoPrompt,
      authorPrompt,
    ]).then(answers => {
      const command = dashify(answers.command);
      const name = answers.name;
      const isRepo = answers.isrepo === 'repo';
      const author = answers.author;

      if (isRepo) {
        repoPrompt(name, author, command)
      } else (
        build(name, author, command)
      )
    })
  }
})

function help() {
  console.log('');
  console.log(`    No arguments are required.`);
  console.log('');
  console.log(`    If you have any issues or requests, please file an issue at ${chalk.cyan('https://github.com/dabit3/create-new-cli/issues')}`);
  console.log('');
}

function repoPrompt(name, author, command) {
  const gitPrompt = {
    type: 'string',
    name: 'repo',
    message: 'Base repo for your project (git url, use https):',
  };
  inquirer.prompt([
    gitPrompt
  ])
  .then(answers => {
    const repo = answers.repo
    inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmation',
        message: `CLI name: ${name}. Repo: ${answers.repo}. Author: ${author}.`
      }
    ])
    .then(answers => {
      if (answers.confirmation) {
        build(name, author, command, repo)
      } else {
        console.log('Please try again.')
      }
    })
  })
}

program.parse(process.argv);

