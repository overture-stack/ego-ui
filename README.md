<h1 align="center"> EGO Authorization Service UI </h1><br>

<p align="center">
UI for managing EGO Authentication and Authorization services
</p>

<p align="center">
  <a href="http://www.overture.bio/products/ego" target="_blank"><img alt="Release Candidate" title="Release Candidate" src=https://www.overture.bio/img/progress-horizontal-RC.svg width="320" /></a>
</p>

## Setup

### Requirements

- [Node 8+](https://nodejs.org/en/download/current/)
- [yarnpkg](https://yarnpkg.com/en/docs/install)

### Develop

1. create a `.env` file at the root of the repo, following the schema of the [.env.schema](.env.schema)
1. install dependencies (from repo root, run `yarn`)
1. start development server (from repo root, run `yarn start`)

### Build

1. create a `.env` file at the root of the repo, following the schema of the [.env.schema](.env.schema)
1. run `yarn build`.
1. deploy the resulting `build/` folder

### Configure

1. To change the brand image, replace the svg in [src/assets/brand-image.svg](src/assets/brand-image.svg) and [src/assets/brand-image-small.svg](src/assets/brand-image-small.svg) with your own brand image files

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
