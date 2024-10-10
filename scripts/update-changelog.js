const fs = require('fs');
const path = require('path');
const semver = require('semver');

const packageJsonPath = path.join(__dirname, '../package.json');
const changelogPath = path.join(__dirname, '../CHANGELOG.md');

// Read the current version from package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Increment the patch version
const newVersion = semver.inc(currentVersion, 'patch');

// Update package.json with the new version
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Get the current date
const currentDate = new Date().toISOString().split('T')[0];

// Read the current changelog
let changelog = fs.readFileSync(changelogPath, 'utf8');

// Prepare the new changelog entry
const newEntry = `
## [${newVersion}] - ${currentDate}
### Added
- [Add your new features here]

### Changed
- [Add your changes here]

### Fixed
- [Add your bug fixes here]
`;

// Insert the new entry after the first line of the changelog
const changelogLines = changelog.split('\n');
changelogLines.splice(1, 0, newEntry);
changelog = changelogLines.join('\n');

// Write the updated changelog
fs.writeFileSync(changelogPath, changelog);

console.log(`Updated version to ${newVersion} and added new entry to CHANGELOG.md`);
