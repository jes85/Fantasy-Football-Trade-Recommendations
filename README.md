# Fantasy Football Trade Recommendations

## Project information

The goal of this project is to recommend trades for fantasy football. It downloads league/team data from ESPN Fantasy Football based on the leagueId you provide, and outputs trade recommendations for each team.

## Supporting a new espn league

Public leagues:
  - You'll need the leagueId. Navigate to your league on espn and find the leagueID in the URL. i.e. https://fantasy.espn.com/football/team?leagueId=1066964&teamId=5&seasonId=2019

Private leagues:
  - You'll need the leagueId (see above), as well as two cookies from ESPN: espn_s2 and SWID. These are found at "Application > Cookies > espn.com" in the Chrome DevTools when on espn.com and signed in. Full instructions: sign in to your account on espn.com on Chrome and open Chrome DevTools by clicking View -> Developer -> Developer Tools. In the DevTools window, click the Application tab at the top, find Cookies on the left, and click https://www.espn.com. In the table that appears, find the values for SWID and espn_s2.

## File structure

src/

- contains the source code. Main file is ff.js.

tst/

- contains the unit tests. Should follow same folder structure as src/.

api_playground/

- contains output of various http calls to espn's api. I used this to piece together which api calls I needed to make to get the data I wanted (espn's doesn't have public documentation for their api).

lib/

- contains the compiled source code after you run npm run build. Node doesn't support ES6 syntax, so I have to compile the src/ into lib/ before running the program.

node_modules/

- contains node libraries that the code depends on after you run npm install.

## Style guide + Naming conventions

Files

- UpperCamelCase for files containing js classes (i.e. ConsoleTradeInputStorer.js)
- camelCase for other js files (i.e. constants.js)
- hyphens for files containing scripts (i.e. hello-world-node.js)
- consider adding versioning to the script filenames later if necessary

Folders

- all lowercase
- use underscores as the separator

## Installing

Prerequisites: Makes use you have node/npm installed.

Use `npm install` to install dependencies. They will be installed inside a new directory node_modules/.

## Building and Running the program

Build: Use `npm run build` to compile the src/ files (that use ES6 syntax) into the lib/ files (non ES6 syntax that node can understand)

Run: Use `node lib/ff.js` to run the program.

Build and run: Alternatively, use `npm run start` to build/run the program automatically after any file saves.

## TODOs

### ~~MVP (v0)~~ (DONE)

End result: I can run this script on a weekly basis for one league at a time, and it prints the trades in a human-readable format that I can send to members of my league.

- ~~Implement 3v3 and nvm trade algorithms~~
- Implement TradeOutputDAO that outputs in a nice format for league members to read
  - ~~Implement FileBasedTradeOutputDAO that outputs json to a file~~
  - ~~Write simple ReactJS frontend that loads json file and displays data nicely~~
  - ~~Host ReactJS frontend on heroku so friends can view it~~
- Optimize trade algorithm for accuracy: produce best trades
  - ~~Retrieve rest-of-season projections from other sites~~
  - ~~Play with statistic scoring metrics to determine how to rank "best" trades~~
  - Consider giving the option of sorting by multiple intuitive versions of "best"

### Backlog ideas

- ~~Implement FileBasedTradeInputDAO so I can store results without calling espn api each time~~
- Make the input data more configurable
  - league settings
- Make the output data more configurable
  - multiple views for "best" trades. This can also be implemented as configurable input instead, depending on performance
- Write script to run this automatically on a given day of the week
- Write script to run this automatically on every roster change
- Write website to run this via configurable params + button press
- Write Chrome extension to hook this into whatever espn league you're viewing
  - have best trades show up as a pop-up on a given team's roster
- Optimize trade algorithm for efficiency: make it run faster
- Extend to other leagues besides ESPN
- Extend trade algorithm to use specific league scoring rules
  - instead of using points projections, we will use stat projections and convert that to points projections depending on given league's scoring rules

### Testing

- ~~Test code on real public and real private league after the draft~~
- Create accuracy benchmarks using synthetic data
- Add unit tests

### Cleanup

- ~~Remove secrets from git~~ and delete/recreate github repo
- ~~Rename files to follow same naming convention (I chose convention based off combination of google searches for js conventions)~~
  - ~~see above for the convention I decided on~~
- Add descriptive comments everywhere
- Combine/cleanup constants maps
- ~~Remove dependency on espn client package~~
- Dependency Injection
- Factories

### Dev setup

- VSCode plugins
- ESLint configuration
- Typescript
- TODO others

## Acknowledgements

Thanks to the [mkreiser/ESPN-Fantasy-Football-API](https://github.com/mkreiser/ESPN-Fantasy-Football-API) for documentation of the ESPN v2 API and cookies setup that helped me as I extended it to the v3 api for my use case.