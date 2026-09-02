const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const root = path.resolve(__dirname, '..')
const pkg = require('../package.json')
const peerDependencies = Object.keys(pkg.peerDependencies)

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const config = getDefaultConfig(__dirname)

// The library is linked from the parent directory, so Metro has to watch it
// for changes and resolve modules from both node_modules trees.
config.watchFolders = [root]
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(root, 'node_modules'),
]

// The library's own node_modules contains its dev copies of react and
// react-native, which sit closer to ../src than the example's do. Without
// blocking them Metro loads two copies of React and the app dies with
// "invalid hook call". Blocking forces resolution to fall through to the
// example's single copy, which is the one Expo pins for this SDK.
config.resolver.blockList = peerDependencies.map(
  (name) =>
    new RegExp(`^${escape(path.join(root, 'node_modules', name))}\\/.*$`),
)

config.resolver.extraNodeModules = Object.fromEntries(
  peerDependencies.map((name) => [
    name,
    path.resolve(__dirname, 'node_modules', name),
  ]),
)

// The published package no longer ships `src`, so its `exports` map points only
// at the compiled output in `lib`. That is what consumers should get, but it
// would mean rebuilding the library after every edit to see a change here, so
// the example resolves the package to its TypeScript source directly.
const librarySource = path.resolve(root, 'src', 'index.tsx')
const { resolveRequest } = config.resolver

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === pkg.name) {
    return { type: 'sourceFile', filePath: librarySource }
  }
  return (resolveRequest ?? context.resolveRequest)(
    context,
    moduleName,
    platform,
  )
}

module.exports = config
