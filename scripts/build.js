


// ! Do not use this script yet
process.exit(1)


const { /* spawn, */ sync: spawnSync } = require('cross-spawn')



const clientBuild = spawnSync('npm', [
  'run', 'build'
], {
  cwd: './client/',
})




