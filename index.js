const fs = require('fs');
const path = require('path');
const stringSimilarity = require('string-similarity');

const dirPathToSearch = path.join(__dirname, 'main');
const mainListPath = path.join(__dirname, 'main_list.txt');

function differNameSearcher(currentDirPath, callback) {
    try {
        fs.readdir(currentDirPath, (err, files) => {

            if (err) {
                throw new Error('error');
            }

            files.forEach(name => {
                const filePath = path.join(currentDirPath, name);
                const stat = fs.statSync(filePath);

                if (stat.isFile()) {
                    callback(filePath, stat);
                } else if (stat.isDirectory()) {
                    differNameSearcher(filePath, callback);
                }
            });
        });
    } catch (e) {
        throw new Error('error');
    }
}


let resultFileNames = [];

differNameSearcher(dirPathToSearch, async function (filePath) {
    try {
        const splitNames = filePath.split('\\');
        const fileNameToCheck = splitNames.pop();

        await fs.readFile(mainListPath, function (err, data)  {
            const arrayOfFileNames = data.toString().split(',');

            if (err) {
                throw new Error('error');
            }

            arrayOfFileNames.forEach(name => {
                const similarity = stringSimilarity.compareTwoStrings(fileNameToCheck, name);

                if (similarity >= 0.1) {
                    if (!resultFileNames.includes(fileNameToCheck)) {
                        resultFileNames.push(fileNameToCheck);
                    }
                }
            })
            console.log(resultFileNames)
        })

    } catch (e) {
        throw new Error('error');
    }
});
