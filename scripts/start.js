


// ! Do not use this script yet
process.exit(1)

const { spawn, /* sync: spawnSync */ } = require('cross-spawn')

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


const clientBuild = spawn('npm', [
  'run', 'dev-build-watch'
], {
  cwd: './client/',
})

const server = spawn('nodemon', [
  'server.js', '--watch', 'server.js'
], {
  env: { NODE_ENV: 'DEVELOPMENT' },
})

console.log(`pids: ${clientBuild.pid}, ${server.pid}`)

listen(clientBuild, 'client dev watch')
listen(server, 'server watch')

// kill not needed? I think the processes are killed when you ctrl C
// clientBuild.kill()
// server.kill()


