
/**
 * (1) Parses the '.cache' file in the 'dist/icons' folder
 * (2) Sorts the 'cache.result.files' property
 * (3) Rewrites the file to ensure a deterministic build
 */

 
const fs = require('fs')
const path = require('path')
const klawSync = require('klaw-sync')

const DIST_PATH = path.resolve('./dist/')
const CACHE_FILE_REGEX = /.*icons-[a-z0-9]*\/\.cache$/

const findCacheFile = item => CACHE_FILE_REGEX.test(item.path)

console.log('postBuild start')

try {
  const cacheFilePaths = klawSync(DIST_PATH, { filter: findCacheFile })

  if (!cacheFilePaths.length) {
    throw new Error('Could not find .cache file')
  }

  if (cacheFilePaths.length > 1) {
    throw new Error('More than one possible .cache file detected')
  }

  const cacheFilePath = cacheFilePaths[0].path
  const rawCacheFile = fs.readFileSync(cacheFilePath, 'utf8')
  const cache = JSON.parse(rawCacheFile)

  cache.result.files = cache.result.files.sort()

  fs.writeFileSync(cacheFilePath, JSON.stringify(cache), 'utf8')

} catch(err) {
  console.log('postBuild fail', err)
  process.exit(1)
}

console.log('postBuild finish')


