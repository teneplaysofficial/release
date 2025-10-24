import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { config } from './config.js';

class Jsr {
  #command = 'npx jsr';

  async dryRun() {
    core.info('Performing jsr dry-run publish');

    const args = ['publish', '--dry-run'];

    if (config.jsr_args) args.push(config.jsr_args);

    await exec(this.#command, args);
  }

  async publish() {
    core.info('Publishing jsr package');

    const args = ['publish'];

    if (config.jsr_args) args.push(config.jsr_args);

    await exec(this.#command, args);
  }
}

export const jsr = new Proxy(new Jsr(), {
  get(target, props, receiver) {
    if (!config.jsr) {
      core.warning('JSR publishing is disabled');
      return typeof target[props] === 'function' ? async () => {} : undefined;
    }

    return Reflect.get(target, props, receiver);
  },
});
