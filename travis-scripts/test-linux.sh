#!/usr/bin/env bash

set -ev # return value 1 (error) if any command fails, and display each command before its run
if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  yarn prettier:diff
  yarn test:coverage -- --maxWorkers=2
  yarn report-coverage
  yarn tslint
  yarn tscheck
  yarn freezer
  yarn freezer:validate
fi
