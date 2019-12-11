# collab-playlist



## How to run / create development build
1. In project root directory, run `npm install` then `npm run setup-mods` to set up.
2. Create a `.env` file in the root directory formatted like `.env.sample` with the values filled in.
3. Run `npm start` to start the development server. Ignore the tab that opens at `localhost:8888`. Open a new tab and navigate to `localhost:3000` or whatever port you set in `.env`.
4. `npm start` and `npm run dev-build` both create an unoptimized development build at `/client/dev_build`.

## How to create production build
1. Follow steps 1 and 2 above if you have not done so.
2. In the project root directory, run `npm run build`.
