#!/usr/bin/env bash

set -ev # return value 1 (error) if any command fails, and display each command before its run
if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
  yarn tslint
  yarn tscheck
  yarn freezer
  yarn freezer:validate
  yarn test:coverage -- --maxWorkers=2
  yarn report-coverage
  yarn build:electron
  ls -la dist/electron-builds
fi
