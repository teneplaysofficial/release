import * as core from '@actions/core';
import * as github from '@actions/github';
import { config } from './config.js';
import { writeFileSync } from 'fs';

class Github {
  auth() {
    if (!config.github_token)
      core.setFailed(
        [
          'Missing GitHub token for authentication',
          '**How to fix this:**',
          '- Ensure your workflow passes the `github_token` input, for example:',
          '  ```yaml',
          '  with:',
          '    github_token: ${{ secrets.GITHUB_TOKEN }}',
          '  ```',
          '- Or set a personal access token if you’re using this Action across repositories:',
          '  ```yaml',
          '  with:',
          '    github_token: ${{ secrets.PAT }}',
          '  ```',
        ].join('\n'),
      );

    github.getOctokit(config.github_token);
  }

  setVersion(version) {
    const gh_env = process.env.GITHUB_ENV;

    if (!gh_env) {
      core.warning('GITHUB_ENV is not defined, cannot set VERSION output');
      return;
    }

    writeFileSync(gh_env, `VERSION=${version}\n`, { flag: 'a' });
  }
}

export const gh = new Github();
