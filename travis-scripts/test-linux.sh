#!/usr/bin/env bash

set -ev # return value 1 (error) if any command fails, and display each command before its run
if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  # yarn prettier:diff - not sure if we need this for build
  # move linting before tests as it finnishes earlier
  yarn tslint
  yarn tscheck
  yarn freezer
  yarn freezer:validate
  yarn test:coverage -- --maxWorkers=2
  yarn report-coverage
fi
