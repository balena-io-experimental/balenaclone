# balenaclone

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/balenaclone.svg)](https://npmjs.org/package/balenaclone)
[![License](https://img.shields.io/npm/l/balenaclone.svg)](https://github.com/balena-io-playground/balenaclone/blob/master/package.json)
![Maintenance](https://img.shields.io/maintenance/yes/2020?color=blueviolet)

Dead simple command line utility to clone balenaCloud applications so you don't have to. It's more of a balena.yml file creator for existing applications at this point. 

## Getting Started

Install & just straight up clone! We will prompt you for the information that's what the CLI is for. Some prerequisites you need to have:
1. Need to have Node & NPM installed in your system. 
2. Need to have balenaCLI authenticated with your current account from where you would like to clone applications. 

```
npx balenaclone
```

## What will this do?

The CLI uses the inputs you provided to build a balena.yml file that can be used to create clones of your existing balenaCloud applications. This is especially useful in multiple scenarios.

1. Having multiple replicable environments sharing the same variables and configuration. Such as production, testing, and development applications for your fleet of devices. 
2. Creating [Deploy with balena](https://www.balena.io/docs/learn/deploy/deploy-with-balena-button/) buttons definitely gets easier with this. No more manual work of writing a `balena.yml` file
3. Getting your applications up on [balenaHub](https://www.hub.balena.io) even faster!

## Thanks for the utility, what next!

- Head to dashboard.balena-cloud.com and click the `Create Application` button. 
- Toggle the `Advanced` button on there to upload the `balena.yml` file you just generated and voila we cloned your app! Now go create something awesome!
