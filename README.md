# collab-playlist

_A full stack app developed for research on Collaborative Playlists._

> Tip: pay careful attention to which directory to perform each of these tasks in.

## How to set up for development
1. In project root directory (`collab-playlist/`), run `npm ci`.
2. In the `client/` directory, run `npm ci`.
3. Create a `.env` file in the root directory formatted like `.env.example` with the values after the equal signs filled in. Use the comments to guide you.
4. Create a `.env` file in the `client/` directory formatted like `client/.env.example` with the values after the equal signs filled in. Use the comments to guide you.
5. Run `npm i -g nodemon` and `npm i -g typescript` if not installed already. (Use sudo if necessary).

## How to run / create development build
1. Open three terminals. In the following order:
3. In the first terminal, in the project root directory, run `npm run build-watch`.
2. In the second terminal, in the project root directory, run `npm run watch`.
4. In the third terminal, in the `client/` directory, run `npm start`. A browser will open with the app.

## How to set up for production
1. In project root directory (`collab-playlist/`), run `npm ci`.
2. In the `client/` directory, run `npm ci`.
3. Create a `.env` file in the root directory formatted like `.env.example` with the values after the equal signs filled in. Use the comments to guide you.
4. Run `npm i -g typescript` if not installed already. (Use sudo if necessary).

## How to create production build
1. In the root directory, run `npm run build`. The output will be in `build/`.
2. In the `client/` directory, run `npm run build`. The output will be in `client/build/`.
