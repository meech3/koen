# koen

Zero-dependency, minimal replacement for common nodemon use cases.

Installing a package with tons of dependencies just to run a command or restart a server on file change is oftentimes overkill. Koen aims to offer a solution to this problem with the caveat that it uses Node's [`fs.watch`](https://nodejs.org/docs/latest/api/fs.html#fswatchfilename-options-listener) module; so any issues with [`fs.watch`](https://nodejs.org/docs/latest/api/fs.html#fswatchfilename-options-listener) that apply to your operating system will also apply with this module.

### Installation

```
npm install -g koen
```

### Usage

#### Arguments

`[dir]`: Directory to be monitored. Defaults to the current working directory.

#### Options

`[include]`: Regex expression defining which files should be included.

`[exclude]`: Regex expression defining which files should be excluded. Overwrites include.

`[exec]`: Command to be executed on file change. Defaults to your start script.

#### Examples

Restart a server when any file in the working directory changes:

```
koen
```

Run a build command when src files change, ignoring the dist folder:

```
koen src --exclude "^dist" --exec "npm run build"
```
