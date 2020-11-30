import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'
import buildConfigYaml = require("./buildyaml")


class Balenaclone extends Command {
	async run() {
		const appName = await cli.prompt('Name of application you want to clone')
		const repository = await cli.prompt('Got a GitHub repo. Drop the link', { required: false })
		const repobranch = await cli.prompt('Got a branch to deploy? We will deploy a release while you grab some coffee', { required: false })
		let branch = repository + "/archive/" + `${repobranch}.tar.gz`
		const device = await cli.prompt("What device type you working with? Make sure its the right name", { required: false })
		const description = await cli.prompt("(Optional) Got a description for us?", { required: false })

		const yamlData = { appName, repository, device, branch, description }

		await buildConfigYaml(yamlData)
	}
}

export = Balenaclone
