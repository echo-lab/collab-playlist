

const path = require('path')
const fs = require('fs')


const fullPath = (...paths) => path.join(__dirname, ...paths)

console.log(fullPath('./scripts')) // should be valid
console.log(fullPath('./setup_files')) // should be invalid

// console.log(fullPath('./dev-build-watch.js'))

/*
const reactScriptsPath = './client/node_modules/react-scripts/'

const copyFile = ([...from], [...to]) => {
  fs.copyFile(
    fullPath(...from),
    fullPath(...to),
    (err) => {
      if (err) throw err
      console.log(`${path.join(...from)} was copied`)
    }
  )
}

copyFile(
  ['./scripts/setup_files/dev-build-watch.js'],
  [reactScriptsPath, './scripts/dev-build-watch.js']
)

copyFile(
  ['./scripts/setup_files/react-scripts-edited.js'],
  [reactScriptsPath, './bin/react-scripts.js']
)


*/

