# Install Required Tools
## VScode
Download and install [Visual Studio Code](https://code.visualstudio.com/)

## Git
Download and install Git

Installing the CLI is required it will allow git integration from within vscode.
[Git CLI](https://git-scm.com/downloads)
verify git works by typing `git --version`


Github Desktop is not required but may be preferrable to the CLI
[Git Desktop](https://desktop.github.com/)

## Node js / npm
Install latest or LTS version of [Node JS](https://nodejs.org/en/)

Make sure it works with:
* `node -v`: should be greater than v10.19
* `npm -v`: should be greater than v6.14.4

## Yarn
Install yarn with:
```
npm install -g yarn
```
yarn should be greater than v1.22.5

## Docker
Install the stable version of [Docker Desktop](https://www.docker.com/products/docker-desktop)

# Setup Instructions (After everything is installed)
## 1. Clone The Repo
cd to a directory where you want the repo to be then run: 
```
git clone https://github.com/dmaahs2017/surveyit
```

Then open the repo folder in vscode
## 2. Setup Backend
open a terminal in VScode and run these commands in order
```bash
cd server
npm install
yarn install
docker-compose up
//open a new terminal
yarn create:migration
```
Then run `docker-compose up` - note if this doesn't work I'm not sure because I'm on linux. You may have to figure out how to run it with docker desktop. The file that is important is the `docker-compose.yml` file at `surveyIT/server/docker-compose.yml`. The [docker docs](https://docs.docker.com/compose/install/) may be useful here.

then to start the backend service run
```
// yarn dev compiles the ts to js and executes that, 
// whereas the latter interprets the ts code. 
// I use the latter because for some reason 
// yarn dev doesn't work on linux (I assume).

yarn dev
// or
yarn dev2
```

Verify the backend is working by going to [http://localhost:4000/graphql](http://localhost:4000/graphql)

Graphql is the interface for the frontend application. This page is where we can test the queries before implementing them on the FE.


## 3. Setup Frontend
```
cd surveyIT/web
npm install
yarn install
```
then run the FE with 
```
yarn gen // this will generate the graphql .tsx code from the .graphql files
yarn dev
```
Go to [http://localhost:3000](http://localhost:3000) to verify it is working.

