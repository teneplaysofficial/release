import { join } from 'path';
import { readFileSync, statSync, writeFileSync } from 'fs';
import { isFile, ReleaseJsonFiles } from './utils.js';
import semver from 'semver';
import { git } from './git.js';
import * as core from '@actions/core';
import { Bumper } from 'conventional-recommended-bump';

class Version {
  currentVersion() {
    return this.fileVersion() || git.latestTag();
  }

  fileVersion() {
    for (const file of ReleaseJsonFiles) {
      const filePath = join(process.cwd(), file);

      if (!isFile(filePath)) continue;

      const content = JSON.parse(readFileSync(filePath, 'utf-8'));

      if (!content.version) continue;

      return content.version;
    }
    return undefined;
  }

  writeVersion(v) {
    for (const file of ReleaseJsonFiles) {
      const filePath = join(process.cwd(), file);
      if (!statSync(filePath).isFile()) continue;

      const content = JSON.parse(readFileSync(filePath, 'utf-8'));

      if (!content.version) continue;

      content.version = v;

      writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
    }
  }

  validate(v) {
    return semver.valid(v);
  }

  newVersion(currentVersion, releaseType) {
    if (!this.validate(currentVersion)) {
      core.setFailed(`Current version "${currentVersion}" is not a valid semver version.`);
    }

    core.info('Calculating new version');

    const newVersion = semver.inc(currentVersion, releaseType);

    return newVersion;
  }

  async recommendedBump() {
    const bumper = new Bumper().loadPreset('angular');
    const recommendation = await bumper.bump();

    return recommendation.releaseType;
  }
}

export const version = new Version();
