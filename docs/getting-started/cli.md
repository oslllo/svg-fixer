# CLI

## Installation

- [`global`](#svgfixer-cli-install-global)
- [`local`](#svgfixer-cli-install-local)

<a id="svgfixer-cli-install-global"></a>

### Global Installation

1. Install the package `globally`.

    ```shell
    npm i oslllo-svg-fixer -g
    ```

2. When it is done installing you will be able to call the package from anywhere in the CLI.

    ```shell
    user@ubuntu:~$ oslllo-svg-fixer --help
    ```

    > will output usage and help information.

<a id="svgfixer-cli-install-local"></a>

### Local Installation

1. Install the package inside your `package`.

    ```shell
    npm i oslllo-svg-fixer --save
    ```

2. When it is done installing go into your `package.json` file and add the following line to the `scripts` object.

    ```json
    {
        "scripts": {
            "oslllo-svg-fixer": "node node_modules/oslllo-svg-fixer/src/cli.js"
        }
    }
    ```

3. When you are done you should be able to call the package from within your `package`'s workspace.

    ```shell
    user@ubuntu:/my/npm/package$ npm run oslllo-svg-fixer -- --help
    ```

    > will output usage and help information.

    > do not forget the extra `--` when passing arguments to `npm run`.

<a id="svgfixer-cli-usage"></a>

## Usage

```shell
Usage: oslllo-svg-fixer [source] [destination] [options]

Options:
  --version                   Show version number                      [boolean]
  --source, -s                path containing SVG(s).        [string] [required]
  --destination, -d           path to store fixed SVG(s).    [string] [required]
  --strict-destination, --sd  throw if destination path does not exist.
                                                       [boolean] [default: true]
  --show-progress, --sp       show progress bar in CLI.[boolean] [default: true]
  --help                      Show help                                [boolean]
```

<a id="svgfixer-cli-exit-codes"></a>

## Exist Codes

- 0 -> Success!
- 1 -> Something went wrong.
