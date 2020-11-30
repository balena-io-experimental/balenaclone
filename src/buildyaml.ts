const { getSdk } = require('balena-sdk');
const fs = require('fs');
const YAML = require('json-to-pretty-yaml');
const os = require('os')
var path = require("path");

const balena = getSdk({
    apiUrl: "https://api.balena-cloud.com/",
    dataDirectory: os.userInfo().homedir + "/.balena"
});

interface yamlObject {
	appName: string,
	repository: string,
	device: string,
	branch: string,
	description:string
}

function buildConfigYaml(yamlData: yamlObject) {
	let raw = {
		"version": "2",
		"slug": "null-app",
		"name": "null-App",
		"type": "sw.application",
		"assets": [
			{
				"url": "https://github.com/vipulgupta2048/null",
				"name": "repository"
			},
			{
				"url": "https://raw.githubusercontent.com/vipulgupta2048/null/main/logo.png",
				"name": "logo"
			}
		],
		"data": {
			"description": "balenaHub description for myApp goes here!",
			"defaultDeviceType": "raspberrypi4-64"
		}
	}

	if (yamlData.appName) {
		balena.models.application.get(yamlData.appName, function(error: any, application: any) {
			if (error) throw error;
			console.log(`\nWe cloning from ${yamlData.appName}, hang tight!`)
		});
		raw["slug"] = raw["name"] = yamlData.appName + "-" + Date.now().toString().slice(8)
		raw["data"]["description"] = (yamlData.description === "") ? raw["data"]["description"] : yamlData.description
		raw["data"]["defaultDeviceType"] = (yamlData.device === "") ? raw["data"]["defaultDeviceType"] :  yamlData.device
		if (raw["assets"][0]["name"] === "repository" && yamlData.repository) {
			raw["assets"][0]["url"] = yamlData.repository
		}
		if (yamlData.branch !== "/archive/.tar.gz") {
			raw["assets"].push({
				"url": yamlData.branch,
				"name": "tarball"
			})
		}
		buildBalenaYaml(raw, yamlData.appName)
	} else {
		throw("\nNeed an application to clone, we were provided with None!")
	}
}

async function buildBalenaYaml(raw: any, appName: string){
	let temp: any = {}
	let temp1: any = {}
	const envVar = await balena.models.application.envVar.getAllByApplication(appName)
	for (let n in envVar) {
		temp["- " + envVar[n].name] = envVar[n].value
	}
	raw["data"]["applicationEnvironmentVariables"] = temp

	const configVar = await balena.models.application.configVar.getAllByApplication(appName)
	for (let m in configVar) {
		temp1["- " + configVar[m].name] = configVar[m].value
	}
	raw["data"]["applicationConfigVariables"] = temp1

	// if the server isn't working then create a local file
	fs.writeFile('balena.yml', YAML.stringify(raw), function(err: any){
		if (err){
			throw err
		}
		console.log(`balena.yml file created at ${path.resolve("balena.yml")}`);
		console.log(`\nInstructions!\nOnly balena Team Members can use these instructions till we release this to the world.
Head to dashboard.balena-cloud.com and click the Create Application button. Toggle the "Advanced" button, to upload the balena.yml file you just generated and voila we cloned your app! We are working on using DWB for that, to make this procedure one click!
		`)
	})
};

export = buildConfigYaml
