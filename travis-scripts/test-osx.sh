#!/usr/bin/env bash

set -ev # return value 1 (error) if any command fails, and display each command before its run
if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
  yarn build:electron
  ls -la dist/electron-builds
fi
