# collab-playlist



## How to setup
1. In project root directory, run `npm install`.
2. In the client/ directory, run `npm install`.
3. Copy scripts/setup_files/dev-build-watch.js to client/node_modules/react-scripts/scripts/dev-build-watch.js
4. Copy and rename scripts/setup_files/react-scripts-edited.js to replace client/node_modules/react-scripts/bin/react-scripts.js
5. Create a `.env` file in the root directory formatted like `.env.example` with the values filled in.
   - `HOST_NAME` should be formatted like `http://localhost` (no port number or slash).
   - Set `NODE_ENV` to `development` if using `npm run dev-build` or `production` if using `npm run build` in the client directory.
   - `API_TARGET` is optional for using a debugging server like posthere.io instead of sending to the actual Spotify server. Format it like `https://posthere.io/f7d3...` with no slash at the end. To use the spotify server, just don't include this line.
6. Run `npm i -g nodemon` if not installed already.
7. NOT all npm scripts work yet.

## How to run / create development build
1. Open two terminals.
2. In one terminal, in the project root directory, run `npm start`
3. In the other terminal, in the client/ directory, run `npm run dev-build-watch`. Open a new browser tab and navigate to `localhost:3000` or whatever port you set in `.env`.
4. `npm run dev-build` creates an unoptimized development build at `/client/dev_build`.

## How to create production build
1. In the client directory, run `npm run build`.
