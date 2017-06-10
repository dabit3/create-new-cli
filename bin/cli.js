#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const dashify = require('dashify');

const build = require('./build');
const pkg = require('../package.json');

let projectName;

program
  .version(pkg.version)
  .arguments('<project-directory>')
  .action(name => {
    projectName = name;
  })

program.on('--help', function() {
  help();
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

function folderPrompt(name, author) {}

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

