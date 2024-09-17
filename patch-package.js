import fs from "node:fs"
import path from "node:path"

const muffonDir = './muffon';
const packageJsonPath = path.join(muffonDir, 'package.json');

const argv = process.argv.slice(2);
let version;

// Parse command-line arguments
for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '-v' && i + 1 < argv.length) {
        version = argv[i + 1];
    } else if (argv[i].startsWith('-')) {
        throw new Error(`Unrecognized argument: ${argv[i]}`);
    }
}

// Check for required version argument
if (!version) {
    throw new Error('Version argument (-v) is required');
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Patch package.json
packageJson.name = 'mufbeta';
packageJson.version = version;
packageJson.repository = 'https://github.com/muffonlabs/mufbeta';
packageJson.author = {
    email: "staniel359@gmail.com",
    name: 'muffonlabs',
    url: 'https://github.com/muffonlabs',
};

// Write patched package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('package.json patched successfully');