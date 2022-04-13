#! /usr/bin/env node
const { Command, Option, InvalidArgumentError, Argument } = require("commander");
const SteamWorkshopScraper = require("steam-workshop-scraper");
const fs = require("fs");
const path = require("path");

const program = new Command();

let sws = new SteamWorkshopScraper();

const resolvePath = function (_path) {
  if (path.isAbsolute(_path)) {
    return path.normalize(_path);
  } else {
    return path.normalize(path.resolve(process.cwd(), _path));
  }
};

function checkFileOutput(value, dummyPrevious) {
  if (value === undefined) {
    return resolvePath(`output.txt`);
  } else if (fs.existsSync(path.dirname(resolvePath(value)))) {
    return resolvePath(value);
  } else {
    throw new InvalidArgumentError("Not a valid path");
  }
}

function _parseInt(value, dummyPrevious) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError("Not a number.");
  }
  return parsedValue;
}

program
  .version("1.0.0", "Parses Steam Workshop collection and writes collection ids to file")
  .addArgument(
    new Argument("<appid>", "The Steam App ID of the mods")
      .argParser(_parseInt)
      .argRequired()
  )
  .addArgument(
    new Argument("<workshopid>", "The Workshop Collection ID")
      .argParser(_parseInt)
      .argRequired()
  )
  .addOption(
    new Option("-o, --output <filename>", "The file to output the command line params")
      .argParser(checkFileOutput)
      .makeOptionMandatory(false)
  )
  .addOption(
    new Option("-j, --json", "Output the data to a JSON file")
  )
  .action(parseCollection);

async function aParseCollection(workshopid) {
  try {
    return await sws
      .GetCollection(workshopid)
      .then(function (result) {
        return result;
      })
      .catch((e) => {
        if (e) {
          console.error("[FAIL] Failed to get collection id: " + workshopid, e);
          return null;
        }
      });
  } catch (e) {
    console.error("[FAIL] Failed to get collection id: " + workshopid, e);
    throw e; // let caller know the promise was rejected with this reason
  }
}

function steam_format(steam_collection, appid, options) {
  if (options.json) {
    return JSON.stringify(steam_collection);
  } else {
    let compile = "";
    for (var _id in steam_collection) {
      compile = compile + "+workshop_download_item " + appid + " " + steam_collection[_id] + " ";
    }
    return compile;
  }
}

function write_file(appid, options, data) {
  if (data == undefined) {
    console.warn("[WARN] Data is NULL");
    return false;
  }
  if (fs.existsSync(options.output)) {
    fs.unlinkSync(options.output);
  }
  fs.writeFileSync(options.output, steam_format(data, appid, options), { flag: "wx" }, (err) => {
    if (err) {
      console.error("[FAIL] Failed to write file at: " + options.output, err);
      throw err;
    }
    console.log("Data written to file.");
  });
  return true;
}

async function parseCollection(appid, workshopid, options) {
  var steam_collection = await aParseCollection(workshopid);
  if (options.output != undefined) {
    if (write_file(appid, options, steam_collection)) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } else {
    console.log(steam_format(steam_collection, appid, options));
    process.exit(0);
  }
}

program.parse(process.argsv);
