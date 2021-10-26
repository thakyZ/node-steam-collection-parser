# node-steam-collection-parser

A command-line utility to parse through Steam Workshop collection and gives text to be used in Steam CMD

## Usage

```md
steam-collection-parser <appid> <workshopid> (-o, --output) <output file>

appid: The Steam game's Steam App ID.
workshopid: The Steam Workshop ID. Must be a collection.
output file: The file to output to.
```

All parameters and options are required.   
**Example:**

```md
steam-collection-parser 123456 12345678 -o "/tmp/temp.txt"
```

## Installation

**Must have NodeJS 12.x+ installed**
run `npm install --global https://github.com/thakyZ/node-steam-collection-parser`

Author: Neko Boi Nick (thakyZ)   
License: [MIT](https://github.com/thakyZ/node-nbt-to-json/LICENSE)

Thanks to [axi92](https://github.com/axi92) for [steam-workshop-scraper](https://www.npmjs.com/package/steam-workshop-scraper)
