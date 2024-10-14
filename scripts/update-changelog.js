"use strict";

var fs = require('fs');
var path = require('path');
var semver = require('semver');
var _require = require('child_process'),
  execSync = _require.execSync;
var packageJsonPath = path.join(__dirname, '../package.json');
var changelogPath = path.join(__dirname, '../CHANGELOG.md');

// Read the current version from package.json
var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
var currentVersion = packageJson.version;

// Increment the patch version
var newVersion = semver.inc(currentVersion, 'patch');

// Update package.json with the new version
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Get the current date and time
var currentDateTime = new Date().toISOString().replace('T', ' ').substr(0, 19);

// Get the last changelog update date
var lastChangelogUpdate = execSync('git log -1 --format=%ai CHANGELOG.md').toString().trim();

// Get all commit messages since the last changelog update
var commitMessages = execSync("git log --pretty=format:\"- %s\" --since=\"".concat(lastChangelogUpdate, "\" --no-merges")).toString().trim();

// Prepare the new changelog entry
var newEntry = "\n## [".concat(newVersion, "] - ").concat(currentDateTime, "\n\n").concat(commitMessages, "\n");

// Read the current changelog
var changelog = fs.readFileSync(changelogPath, 'utf8');

// Insert the new entry after the first line of the changelog
var changelogLines = changelog.split('\n');
changelogLines.splice(1, 0, newEntry);
changelog = changelogLines.join('\n');

// Write the updated changelog
fs.writeFileSync(changelogPath, changelog);
console.log("Updated version to ".concat(newVersion, " and added new entry to CHANGELOG.md with recent commits"));