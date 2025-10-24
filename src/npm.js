import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { config } from './config.js';
import { error } from './utils.js';

class Npm {
  #command = 'npm';

  async dryRun() {
    core.info('Performing npm dry-run publish');

    const args = ['publish', '--dry-run'];

    if (config.npm_args) args.push(config.npm_args);

    await exec(this.#command, args);
  }

  async publish() {
    core.info('Publishing npm publish');

    const args = ['publish'];

    if (config.npm_args) args.push(config.npm_args);

    await exec(this.#command, args);
  }

  async auth() {
    if (!config.npm_token) {
      core.setFailed('NPM_TOKEN is not set. Cannot publish to npm registry');
    }

    try {
      await exec(this.#command, ['whoami'], {
        env: {
          ...process.env,
        },
      });
    } catch (err) {
      core.setFailed(`Failed to authenticate with npm registry: ${error(err)}`);
    }
  }
}

export const npm = new Proxy(new Npm(), {
  get(target, props, receiver) {
    if (!config.npm) {
      core.warning('NPM publishing is disabled');
      return typeof target[props] === 'function' ? async () => {} : undefined;
    }

    return Reflect.get(target, props, receiver);
  },
});
