# media-center-utility
Media Server utility to manage downloading, naming and storing torrents. Use node.js, AngularJS and bootstrap.

## Prerequisites
To download and run media-center-utility, you need to install 4 things

- [Git](http://git-scm.com/downloads)
- [Node.js](http://nodejs.org/download/)
- Bower - can be installed after node.js by running `npm isntall bower -g`
- A text editor ([Notepad++](http://notepad-plus-plus.org/download/v6.7.4.html) or [SublimeText 2](http://www.sublimetext.com/2) or [3](http://www.sublimetext.com/3))

`node`, `npm` and `git` will also need to be in your path environment variable. 

**Note**: running `npm install` requires elevated privileges. On Windows, the command window should be "Run as Administrator". On Linux and Macs, `sudo` should be used, i.e. `sudo npm install ...`

## Cloning the Git repo

Once the prerequisites are installed, run 

    git clone --depth 1 https://github.com/YashdalfTheGray/media-center-utility.git

in a commmand window or terminal. This creates a shallow clone so that only the current changes (no history) is pulled down. If you would like all the history, omit the `--depth 1` part of the command. 

## Setting up uTorrent to play nice

### Enabling webui

In the uTorrent application, under Options > Preferences, expand the Advanced list item.

Clicking Web UI in the expanded list will allow enabling the Web UI, adding authentication (suggested), configuring a port and (on Windows) setting default download directories.

Once that is done, navigating to `localhost:your_port_number/gui` through a browser will first ask for authentication and then reveal the uTorrent Web UI. 

**Note**: On macs, this may fail saying that the webui is not installed. This can be fixed by following this [link](http://forum.utorrent.com/topic/69643-how-to-install-webui/). The file webui.zip can be found [here](http://forum.utorrent.com/topic/49588-%C2%B5torrent-webui/). 

**Note**: If this also happens on Windows, please use the link above to download a copy of the webui.zip file and place it in the uTorrent install folder. 

### ng-utorrent-ui

If you want a better looking and more updated interface, another option is the [ng-torrent-ui](https://github.com/psychowood/ng-torrent-ui). This version of the uTorrent Web UI is built using bootstrap and angularJS and the latest release can be downloaded [here](https://github.com/psychowood/ng-torrent-ui/releases). The installation instructions are similar to the webui.zip file install instructions. 

### Calling an app on torrent finish

Using the included finish-notify app, you can alert the media-center-utility when a torrent is done downloading.

Under Advanced > Run program > Run this program when a torrent finishes, add

`node /path/to/finish-notify %N %D`

This will send the name of the torrent and the directory that it's stored in to media-center-utility as well. 

## Running

### Downloading all the dependencies

Running `npm install` from the repository directory will install all the packages that this app is dependent on.

After `npm install` succeeds, running `gulp start` and navigating to `localhost:8080` will serve the application.  

## Testing

Run `gulp test:client` to run the client-side unit tests or `gulp test:server` to run the server-side unit tests. 

Run `gulp test` to run both tests at the same time. 

**Note**: Sometimes running the `gulp test[:xx]` commands will throw an `EADDRINUSE` exception. The tests still run and they still pass, scrolling up will show the test results. Rerunning the command will generally lead to success. 

## Linting

Run `gulp jshint` to run all the first-party .js files through jshint and report any warnings or errors. 