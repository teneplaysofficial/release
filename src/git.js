import * as core from '@actions/core';
import { exec, getExecOutput } from '@actions/exec';
import { config } from './config.js';

class Git {
  async latestTag() {
    try {
      const res = (await getExecOutput('git', ['describe', '--tags', '--abbrev=0'])).stdout.trim();

      return res.startsWith('v') ? res.slice(1) : res;
    } catch {
      return undefined;
    }
  }

  async stage(files = '-A') {
    core.info('Staging files');

    await exec('git', ['add', files].filter(Boolean));
  }

  async commit() {
    const message = '';

    (await getExecOutput('git', ['diff', '--cached', '--name-only'])).stdout
      .trim()
      .then((result) => {
        if (!result) {
          core.warning('No staged changes to commit');
          return;
        }
      });

    core.info(`Committing: ${message}`);

    await exec('git', ['commit', '-m', message]);
  }

  async pushCommit(branch = config.branch) {
    const args = ['push'];

    if (branch) args.push('--set-upstream', 'origin', branch);

    core.info(`Pushing commits ${branch ? `to ${branch}` : ''}`);

    await exec('git', args);
  }

  async createTag(tagName = '') {
    tagName = tagName.startsWith('v') ? tagName : `v${tagName}`;

    const message = '';

    core.info(`Creating tag: ${tagName}`);

    const args = ['tag', tagName];

    if (message) args.push('-m', message);

    await exec('git', args);
  }

  async pushTag(force = false) {
    const args = ['push', '--tags'];

    if (force) args.push('-f');

    core.info(`Pushing tags ${force ? '(force)' : ''}`);

    await exec('git', args);
  }

  async setupUser() {
    core.info(`Setting up git user: ${config.git_username} <${config.git_email}>`);

    await exec('git', ['config', 'user.name', config.git_username]);
    await exec('git', ['config', 'user.email', config.git_email]);
  }
}

export const git = new Git();
