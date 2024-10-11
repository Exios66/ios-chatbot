const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { inc } = require('semver');

const packageJsonPath = join(__dirname, '../package.json');
const changelogPath = join(__dirname, '../CHANGELOG.md');

// Read the current version from package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Increment the patch version
const newVersion = inc(currentVersion, 'patch');

// Update package.json with the new version
packageJson.version = newVersion;
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Get the current date
const currentDate = new Date().toISOString().split('T')[0];

// Read the current changelog
let changelog = readFileSync(changelogPath, 'utf8');

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
writeFileSync(changelogPath, changelog);

console.log(`Updated version to ${newVersion} and added new entry to CHANGELOG.md`);
