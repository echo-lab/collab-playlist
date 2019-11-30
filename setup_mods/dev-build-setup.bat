
::echo check:
::echo "...\collab-playlist\"
::echo "$(pwd)"
echo %cd%
pause

::cp ".\dev-build.js" "..\client\node_modules\react-scripts\scripts\dev-build.js"
copy ".\dev-build-watch.js" "..\client\node_modules\react-scripts\scripts\dev-build-watch.js"
copy ".\react-scripts-edited.js" "..\client\node_modules\react-scripts\bin\react-scripts.js"
::cp ".\paths-edited.js" "..\client\node_modules\react-scripts\config\paths.js"
::cp ".\webpack.config-edited.js" "..\client\node_modules\react-scripts\config\webpack.config.js"

echo ""
echo "run 'npm run dev-build' to create development build"

:: to reset:
:: npm i --save react-scripts
echo "run 'npm run reset-mods' to reset"
