### Project information
The goal of this project is to recommend trades for fantasy football. It downloads league/team data from ESPN Fantasy Football based on the leagueId you provide, and outputs trade recommendations for each team. 

### File structure
src/
  - contains the source code. Main file is ff.js.

api_playground/
  - contains output of various http calls to espn's api. I used this to piece together which api calls I needed to make to get the data I wanted (espn's doesn't have public documentation for their api).

lib/
  - contains the compiled source code after you run npm run build. Node doesn't support ES6 syntax, so I have to compile the src/ into lib/ before running the program.

node_modules/
  - contains node libraries that the code depends on after you run npm install.

### Building/running

Use `npm install` to install dependencies. They will be installed inside a new directory node_modules/.

Use `npm run build` to compile the src/ files (that use ES6 syntax) into the lib/ files (non ES6 syntax that node can understand)

Use `node lib/ff.js` to run the program.

Alternatively, use `npm run start` to build/run the program automatically after any file saves.

