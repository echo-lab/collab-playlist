



const { spawn, sync: spawnSync } = require('cross-spawn')

const rimraf = require('rimraf')

// ./ is the root of the project, not scripts/, from rimraf's perspective
// rimraf('./test', err => console.log(`error: ${err}`))

// synchronous because we need to wait for the folder to be deleted before installing
// rimraf.sync('./client/node_modules/react-scripts/')

// const clientBuild = spawnSync('npm', [
//   'i', 'react-scripts'
// ], {
//   cwd: './client/',
// })



const listen = (process, name) => {
  process.stdout.on('data', (data) => {
    console.log(`${name}: ${data}`)
  });
  
  process.stderr.on('data', (data) => {
    console.error(`${name}: ${data}`)
  });
  
  process.on('close', (code) => {
    console.log(`child process ${name} close all stdio with code ${code}`)
  });
  
  process.on('exit', (code) => {
    console.log(`child process ${name} exited with code ${code}`)
  });
}

listen(spawn('ls', { cwd: './client/' }), '1')
// listen(spawn('ls', { cwd: '../client/' }), '2')

// listen(spawn('ls', { cwd: '../client/' }))

// listen(spawn('ls', { cwd: './client/' }), 'name')

