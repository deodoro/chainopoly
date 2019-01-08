# Introduction

I always clone my projects inside a dev directory for organization's sake:

```shell
mkdir ~/dev
cd ~/dev
clone https://gitlab.com/deodoro/chainopoly.git
```

Thus, from here on, in doubt, always `cd` into the the project root:

```shell
cd ~/dev/chainopoly
```

# What you need to build

In a Linux box:

```shell
# python 3
apt-get install python3 pip3
# node.js and npm
apt-get install nodejs
# Truffle and Ganache-CLI
npm install -g truffle ganache-cli
```

In a Mac (with Homebrew):

```shell
# python 3
brew install python3 pip3
# node.js and npm (I use 8.x, I suggest sticking to the same)
brew install node@8
# Truffle and Ganache-CLI
npm install -g truffle ganache-cli
```

In a Windows box:

Life is too short: download VirtualBox, build a Ubuntu VM and go to the linux instructions.

Then install prerequisites:

```shell
cd ~/dev/chainopoly/client
npm install
# Go make coffe or something, this usually takes long
cd ~/dev/chainopoly/server
pip3 install -r requirements.txt
```

# Docker container

To build a docker image, start with the angular client:

```shell
cd ~/dev/chainopoly/client
npx ng build --configuration production --base-href /chainopoly/
```

Then build the image from the project root:

```shell
cd ~/dev/chainopoly/
docker build -t chainopoly -f docker/Dockerfile .
```

*(these commands are in the `build_container.sh` script)*

I run it like this to avoid "leaking" the 8080 port:

```shell
docker run -d --rm -p 127.0.0.1:8080:8080 --name chainopoly chainopoly
```

The UI will be available at http://localhost:8080

*(and this is in `run_container.sh`)*

# This is how I develop

I start an Angular dev server in a terminal tab:

```shell
cd ~/dev/chainopoly/
sh start_angular.sh
```

Then a Tornado server in another tab:

```shell
cd ~/dev/chainopoly/
sh start_server.sh
```

Then the UI will be available at http://localhost:4200, and both frontend and backends will autorefresh whenever you edit code.

# To switch to the Web3 version

You may run an ethereum dev network using ganache:

```shell
ganache-cli
```
*(this terminal will be unusable, so I advise you to open it in a secondary terminal tab)*

Then deploy the smart contracts:

```shell
cd ~/dev/chainopoly/dapp
truffle compile
```

By editing client/src/components/services/services.module.ts and changing web3_enabled to true, the UI will start calling smartcontracts instead of REST services.

Please notice that to run the Web3 version, the UI will need a Web3 enabled browser (such as Brave) or an ethereum wallet plugin (such as Metamask). The wallet configuration tells the UI which wallet to use (the first wallet configured) and which network (e.g. a local ganache-cli network).
