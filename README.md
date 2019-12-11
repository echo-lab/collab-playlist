# collab-playlist



## How to setup
1. In project root directory, run `npm install`.
2. In the client/ directory, run `npm install`.
3. Copy scripts/setup_files/dev-build-watch.js to client/node_modules/react-scripts/scripts/dev-build-watch.js
4. Copy and rename scripts/setup_files/react-scripts-edited.js to replace client/node_modules/react-scripts/bin/react-scripts.js
5. Create a `.env` file in the root directory formatted like `.env.sample` with the values filled in.
6. Run `npm i -g nodemon` if not installed already.
7. Do NOT use any npm scripts yet.

## How to run / create development build
1. Open two terminals.
2. In one terminal, in the project root directory, set the environment variable NODE_ENV to DEVELOPMENT and run `nodemon server.js --watch server.js`
3. In the other terminal, in the client/ directory, run `npm run dev-build-watch`. Ignore the tab that opens at `localhost:8888`. Open a new tab and navigate to `localhost:3000` or whatever port you set in `.env`.
4. `npm run dev-build` creates an unoptimized development build at `/client/dev_build`.

## How to create production build
1. In the client directory, run `npm run build`.
