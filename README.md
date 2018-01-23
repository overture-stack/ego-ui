# Ego Authorization Service User Interface

UI for Authentication and Authorization services

## Setup

### Requirements

* [Node 8+](https://nodejs.org/en/download/current/)
* [yarnpkg](https://yarnpkg.com/en/docs/install)

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
