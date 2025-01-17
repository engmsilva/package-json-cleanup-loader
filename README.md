## Description

> This package is a fork of Christoph von Gellhorn's [package-json-cleanup-loader][1] project. The `exception` option was added, allowing to pass to the package an array of keys that can be removed from the JSON file.

Did you know that when [webpack][2] includes `package.json` file in bundle this bundle can contain private information like installed module path?
For example, lets install [browserify][3]:

```json
$ npm install browserify
...
$ cat ./node_modules/browserify/package.json  | grep _
  {
    "_from": "browserify",
    "_id": "browserify@16.1.1",
    "_inBundle": false,
    "_integrity": "sha512-iSH21jK0+IApV8YHOfmGt1qsGd74oflQ1Ko/28JOkWLFNBngAQfKb6WYIJ9CufH8vycqKX1sYU3y7ZrVhwevAg==",
    "_location": "/browserify",
    "_phantomChildren": {},
    "_requested": {
      "type": "tag",
      "registry": true,
      "raw": "browserify",
      "name": "browserify",
      "escapedName": "browserify",
      "rawSpec": "",
      "saveSpec": null,
      "fetchSpec": "latest"
    },
    "_requiredBy": [
      "#USER",
      "/"
    ],
    "_resolved": "https://registry.npmjs.org/browserify/-/browserify-16.1.1.tgz",
    "_shasum": "7905ec07e0147c4d90f92001944050a6e1c2844e",
    "_spec": "browserify",
    "_where": "C:\\work\\json-cleanup-loader",
  }
```

This package by default removes all values for which keys start with `_` or the values passed in options.

- options
  - `only`: removes all values and keeps only the keys declared within the array of this option.
  - `except`: keeps all values except the keys declared within the array of this option.

**Please note:** Options are not concurrent. The predominate option is defined in this order: `only`, `exception`, and `default`.

## How I can use this package?

### Installation

`npm install --save-dev package-json-remove-key`

### Usage

#### CLI

`webpack --module-bind 'path/to/package.json=package-json-remove-key'`

#### Change webpack config

`default` option:

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /package\.json$/,
        use: {
          loader: "package-json-remove-key"
        }
      }
    ]
  }
};
```

`only` option:

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /package\.json$/,
        use: {
          loader: "package-json-remove-key",
          options: {
            only: ["version", "name", "otherParam"]
          }
        }
      }
    ]
  }
};
```

`except` option:

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /package\.json$/,
        use: {
          loader: "package-json-remove-key",
          options: {
            except: ["_where", "_resolved", "otherParam"]
          }
        }
      }
    ]
  }
};
```

**Warning:** If the error message `"You may need an appropriate loader to handle this file type"` occurs during the bundle build process, it will be necessary to define in the webpack rules the package that will load the JSON files. Install the [json-loader][4] package and use the loading rule to the webpack configuration file:

`npm install --save-dev json-loader`

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: {
          loader: "json-loader",
        },
      },
    ],
  },
};
```

## License

MIT

[1]: https://github.com/headfire94/package-json-cleanup-loader
[2]: https://github.com/webpack/webpack
[3]: https://github.com/browserify/browserify
[4]: https://github.com/webpack-contrib/json-loader
