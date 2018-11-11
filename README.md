# Blockchain based monopoly game
By deodoro.filho@gmail.com. Please see LICENSE.txt attached.

# Introduction

This is work in progress, it is meant to used as an example project in a series of lectures about blockchain use cases. Right now it is basically a frontend connected to REST services which mock the API that will be provided by DApp.

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
```

In a Mac (with Homebrew):

```shell
# python 3
brew install python3 pip3
# node.js and npm (I use 8.x, I suggest sticking to the same)
brew install node@8
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

Then the UI will be available at http://localhost:4200, and both frontend and backends will autorefresh if you edit the code.
