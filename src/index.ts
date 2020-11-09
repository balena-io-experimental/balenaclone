import { getSdk } from 'balena-sdk';
const { ArgumentParser } = require('argparse');
const fs = require('fs');
const YAML = require('json-to-pretty-yaml');


const balena = getSdk({
    apiUrl: "https://api.balena-cloud.com/",
    dataDirectory: "/home/vipulgupta2048/.balena/"
});

const parser = new ArgumentParser({
  description: 'Dead simple cloning utility of balenaCloud applications'
});

// https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/vipulgupta2048/null&configUrl=https://vipulgupta.me/balena.yml

// make sure URL is repoUrl, configUrl
// https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/balena-io-examples/balena-python-hello-world

// request for fleet configuration, find balena-SDK implementation
// curl -X GET \
// "https://api.balena-cloud.com/v5/application_config_variable?\$filter=application%20eq%201759414" \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer " | jq .
 
parser.add_argument('-s', '--source', { help: 'Name of application that needs to be cloned' });
parser.add_argument('--repo', { help: 'Name of GitHub repository to build release (defaults to null)' });
parser.add_argument('--device', { help: 'Set new default deviceType (defaults to raspberrypi4-64)' });
// parser.add_argument('--branch', { help: 'Set branch to build inital release on (master, by default)' });

// console.dir(parser.parse_args().source);

function main() {
	let raw: any = {
		repoUrl: "https://github.com/vipulgupta2048/null",
		tarballUrl: "https://github.com/vipulgupta2048/null/archive/master.tar.gz",
		defaultDeviceType: "raspberrypi4-64"
	}
	// Refactor if statements and console.logs
	if (parser.parse_args().source) {
		if (parser.parse_args().repo) {
			raw["repoUrl"] = parser.parse_args().repo
			raw["tarballUrl"] = parser.parse_args().repo + "/archive/master.tar.gz"
			console.log(`Adding repository ${raw["repoUrl"]}`)
		} else {
			console.log(`No --repo flag provided, defaulting to empty repository`)
		}
		if (parser.parse_args().device) {
			raw["defaultDeviceType"] = parser.parse_args().device
			console.log(`Adding DeviceType ${raw["defaultDeviceType"]}`)
		}
		else {
			console.log(`No --device flag provided, defaulting to raspberrypi4-64 as deviceType`)
		}
		const appName = parser.parse_args().source
		buildBalenaYaml(raw, appName)
		console.log(`Cloning ${appName} \n`)
	}
	else{
		throw Error("Please specify --source flag")
	}
}

async function buildBalenaYaml(raw: any, appName: string){
	let temp: any = []
	let temp1: any = []
	const envVar = await balena.models.application.envVar.getAllByApplication(appName)
	for (let n in envVar) {
		temp.push(`${envVar[n].name}: ${envVar[n].value}`)
	}
	raw["applicationEnvironmentVariables"] = temp
	const configVar = await balena.models.application.configVar.getAllByApplication(appName)
	for (let m in configVar) {
		temp1.push(`${configVar[m].name}: ${configVar[m].value}`)
	}
	// temp1 = JSON.stringify(temp1).replace(/"/g,'')
	raw["applicationConfigVariables"] = temp1
	
	// console.log(raw)
	const data = YAML.stringify(raw);
	fs.writeFile('balena.yml', data, function(err: any){
		if (err){
			throw err
		}
		console.log("File created")
	});
};

// function processYaml() {
	// const regex = /".*:\s.*"/gm;
// }


main()


// async function otherVariables(appName: string) {
	// For service variables 
	// GET balena.models.device.serviceVar.getAllByApplication('MyApp')
	// Modify serviceVar.set(uuidOrId, id, key, value  --> balena.models.device.serviceVar.set('7cf02a6', 123, 'VAR', 'override')
	
	// For build variables 
	// const buildVar = await balena.models.application.buildVar.getAllByApplication(appName)
	// console.log(buildVar)
