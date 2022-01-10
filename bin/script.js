'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const gracefulExit = () => {
    console.log('Exiting without error.');
    process.exit();
  };

const showError = e => {
    console.error('ERROR! An error occurred');
    console.error(e);
    process.exit(1);
};

process.on('SIGINT', gracefulExit);
process.on('uncaughtException', showError);

// check for app name or exit with warning
if (process.argv.length < 3) {
    console.log('Please provide app name');
    console.log('For example :');
    console.log('    npx amorphic-template my-app');
    process.exit(1);
}

// capture variables
const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const git_repo = "https://github.com/pogaku9/amorphic.git";

// verify app name validity
try {
    fs.mkdirSync(projectPath);
} catch (err) {
    if (err.code === 'EEXIST') {
      console.log(`The file ${projectName} already exist in the current directory, please try with a different name.`);
    } else {
      console.log(error);
    }
    process.exit(1);
}

// try cloning the project
async function main() {
    try {
      console.log('Downloading files...');
      cp.execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);

      process.chdir(projectPath);

      console.log('Installing dependencies...');
    //   execSync('npm install');

      console.log('Removing useless files');
      cp.execSync('npx rimraf ./.git');
      fs.rmdirSync(path.join(projectPath, 'bin'), { recursive: true});

      console.log('Successfully cloned Amorphic boilerplate');

    } catch (error) {
      console.log(error);
    }
}
main();