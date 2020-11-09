// const fs = require('fs')
// const readline = require('readline');

// var rd = readline.createInterface({
// 	input: fs.createReadStream("balena.yml", {encoding: 'UTF-8'}),
// 	output: process.stdout,
// 	// console: true
// })

// rd.on("data", (data, err) => {
// 	// for (let line of data)
// 	for (let x in data) {
// 		console.log(x)
// 	}
// })

const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('balena.yml');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
	// line.replace(`/".*:\s.*"/gm`, )
	if (line==="applicationEnvironmentVariables:" || "applicationConfigVariables:")
		regex = new RegExp(/".*:\s.*"/gm)
		if (regex.test(line)) 
			line.replace("I HAVE BEEN CHANGED")
			
			
  }
}

processLineByLine();
