const fs = require('fs');
const https = require('https');

const init = async () => {
    // Request meme data from the API
    https.request("https://meme-api.com/gimme", function (res) {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
            rawData += chunk;
        });

        res.on('end', () => {
            try {
                const data = JSON.parse(rawData);
                console.log(data);

                // Get the current date and time in IST
                let currentTime = new Date();
                let currentOffset = currentTime.getTimezoneOffset();
                let ISTOffset = 330;   // IST offset UTC +5:30 
                let d = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
                d = d.toLocaleDateString("en-IN");

                // Prepare the new content for README.md
                const newContent = `
# Project Title

## Description

Project description goes here.

## Meme of the Day

### ${data.title}
![Meme Image](${data.url})

Updated on: [${d}]
                `;

                // Write the new content to README.md
                fs.writeFile("README.md", newContent.trim(), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });

            } catch (e) {
                console.error(e.message);
            }
        });
    }).end();
};

init();
