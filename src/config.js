import * as core from '@actions/core';
import * as github from '@actions/github';
import { platform } from 'os';

export const config = {
  github_token: process.env.GITHUB_TOKEN,
  npm_token: process.env.NPM_TOKEN,
  default_release_type: core.getInput('default_release_type'),
  init_version: core.getInput('init_version'),
  git_username: core.getInput('git_username'),
  git_email: core.getInput('git_email'),
  commit_message: (() => {
    if (platform() === 'win32') {
      return core.getInput('commit_message').replaceAll('$VERSION', '$env:VERSION' + '%VERSION%');
    } else {
      return core.getInput('commit_message');
    }
  })(),
  owner: core.getInput('owner') || github.context.repo.owner,
  repo: core.getInput('repo') || github.context.repo.repo,
  branch:
    core.getInput('branch') ||
    (github.context.eventName === 'pull_request'
      ? github.context.payload.pull_request.head.ref
      : github.context.ref.replace('refs/heads/', '')),
  npm: core.getBooleanInput('npm'),
  npm_args: core.getMultilineInput('npm_args'),
  jsr: core.getBooleanInput('jsr'),
  jsr_args: core.getMultilineInput('jsr_args'),
  changelog_file: core.getInput('changelog_file'),
  tag: core.getBooleanInput('tag'),
  major_tag: core.getBooleanInput('major_tag'),
  minor_tag: core.getBooleanInput('minor_tag'),
};
