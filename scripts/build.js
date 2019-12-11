


const { /* spawn, */ sync: spawnSync } = require('cross-spawn')



const clientBuild = spawnSync('npm', [
  'run', 'build'
], {
  cwd: './client/',
})




