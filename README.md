# Release Hub

Automate and streamline your GitHub release workflow. Build, tag, and publish releases with effortlessly.

## Features

- **Automated Builds** - Trigger builds and version bumps directly from your workflows, no extra config needed.
- **Smart Tagging** - Automatically generate and apply semantic version tags.
- **Effortless Publishing** - Create releases and upload assets with zero manual steps.
- **Seamless Integration** - Works with your existing GitHub workflows and pipelines.

> [!NOTE]
>
> - Fully supports **Semantic Versioning**.
> - Compatible with **npm**, **pnpm**, **yarn**, **bun**, and **deno**.
> - Works with **single-package repositories**, and **monorepo support** is planned for a future release.

## Options

### Inputs

#### `github_token`

- **Required:** `Yes`
- **Type:** `string`
- **Default:** `None`
- **Description:** GitHub token used to authenticate API requests

#### `npm_token`

- **Required:** `No` (Required if publishing to NPM)
- **Type:** `string`
- **Default:** `None`
- **Description:** NPM token used to authenticate the NPM registry

#### `default_release_type`

- **Required:** `No`
- **Type:** `string`
- **Default:** `patch`
- **Options:**
  - `patch` - Apply a patch version bump (e.g., `1.0.0` → `1.0.1`)
  - `minor` - Apply a minor version bump (e.g., `1.0.0` → `1.1.0`)
  - `major` - Apply a major version bump (e.g., `1.0.0` → `2.0.0`)
  - `prerelease` - Apply a pre-release bump (e.g., 1.0.0 → 1.0.1-0)
  - `premajor` - Apply a pre-release major bump (e.g., 1.0.0 → 2.0.0-0)
  - `preminor` - Apply a pre-release minor bump (e.g., 1.0.0 → 1.1.0-0)
  - `prepatch` - Apply a pre-release patch bump (e.g., 1.0.0 → 1.0.1-0)
- **Description:** Default type of version bump for the release

#### `init_version`

- **Required:** `No`
- **Type:** `string`
- **Default:** `0.0.0`
- **Description:** Initial version to use if no tags exist in the repository

#### `owner`

- **Required:** `No`
- **Type:** `string`
- **Default:** Current repository owner from workflow-derived
- **Description:** GitHub repository owner

#### `repo`

- **Required:** `No`
- **Type:** `string`
- **Default:** Current repository name from workflow-derived
- **Description:** GitHub repository name

#### `branch`

- **Required:** `No`
- **Type:** `string`
- **Default:** Current branch (or PR source branch) from workflow-derived
- **Description:** Branch to target for commits and tags

### Outputs

#### `version`

- **Description:** Release version (e.g., `1.2.3`)
- **Type:** `string`

#### `success`

- **Description:** Whether the release succeeded (`true`/`false`)
- **Type:** `boolean`

### Environment Variables

#### `GITHUB_TOKEN`

- **Description:** Required for authentication with GitHub API
- **Type:** `string`

#### `NPM_TOKEN`

- **Description:** Required for authentication with the NPM registry
- **Type:** `string`

## Example Usage

```yml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Run Release Hub
        uses: teneplaysofficial/release@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## Contributing

Contributions, issues, and feature requests are welcome!

Feel free to open an [issue](https://github.com/teneplaysofficial/release-hub/issues) or submit a pull request.

## License

Licensed under the [Apache License 2.0](./LICENSE)
