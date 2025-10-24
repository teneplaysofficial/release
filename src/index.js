import * as core from '@actions/core';
import ansi from 'ansilory';
import { gh } from './github.js';
import { npm } from './npm.js';
import { jsr } from './jsr.js';
import { git } from './git.js';
import { version } from './version.js';
import { config } from './config.js';
import { DefaultReleaseTypes, error } from './utils.js';
import { ConventionalChangelog } from 'conventional-changelog';
import { createWriteStream } from 'fs';

try {
  core.info('Starting your release process');

  core.startGroup('Authentication');

  gh.auth();
  await npm.auth();

  core.endGroup();

  core.startGroup('Running Pre-checks');

  await npm.dryRun();
  await jsr.dryRun();

  if (!DefaultReleaseTypes.includes(config.default_release_type)) {
    core.error(
      `Invalid default_release_type: ${config.default_release_type}, Must be one of: ${DefaultReleaseTypes.join(', ')}; using 'patch' instead.`,
    );

    config.default_release_type = 'patch';
  }

  core.endGroup();

  core.startGroup('Version Bumping');

  core.info(`Current version: ${ansi.green.apply(await version.currentVersion())}`);
  core.info(`Default release bump type: ${ansi.yellow.apply(config.default_release_type)}`);

  const currentVersion = await version.currentVersion();
  const releaseRecommandation = await version.recommendedBump();
  const newVersion = version.newVersion(
    currentVersion,
    releaseRecommandation || config.default_release_type,
  );

  gh.setVersion(newVersion);

  version.writeVersion(newVersion);

  core.endGroup();

  core.info('Generating Changelog');

  const generator = new ConventionalChangelog().readPackage().loadPreset('angular');
  const changelogStream = createWriteStream(config.changelog_file);

  generator.commits({ from: config.branch, to: config.branch }).writeStream().pipe(changelogStream);

  core.startGroup('Git Operations');

  await git.setupUser();
  await git.stage();
  await git.commit();
  await git.pushCommit();

  if (config.tag) await git.createTag(newVersion);
  if (config.major_tag && releaseRecommandation === 'major')
    await git.createTag(newVersion.split('.')[0]);
  if (config.minor_tag && releaseRecommandation === 'minor')
    await git.createTag(newVersion.split('.')[1]);

  await git.pushTag(
    (config.major_tag && releaseRecommandation === 'major') ||
      (config.minor_tag && releaseRecommandation === 'minor')
      ? true
      : false,
  );

  core.endGroup();

  core.startGroup('Executing Publish');

  await npm.publish();
  await jsr.publish();

  core.endGroup();

  core.setOutput('version', newVersion);
  core.setOutput('success', true);
  core.info('Process completed successfully!');
} catch (err) {
  core.setOutput('success', false);
  core.setFailed(`${error(err)}`);
}
