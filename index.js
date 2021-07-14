const fs = require('fs');
const path = require('path');
const stringSimilarity = require('string-similarity');

module.exports.diff = (dirPath, list) => {

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

    differNameSearcher(dirPath, async (filePath) => {
        try {
            const splitNames = filePath.split('/');
            const fileNameToCheck = splitNames.pop();

            await fs.readFile(list, (err, data) => {
                const arrayOfFileNames = data.toString().split(',');

                if (err) {
                    throw new Error('error');
                }

                arrayOfFileNames.forEach(name => {
                    const similarity = stringSimilarity.compareTwoStrings(fileNameToCheck, name);

                    if (similarity >= 0.1) {
                        if (!resultFileNames.includes(fileNameToCheck)) {
                            if (filePath.includes(fileNameToCheck)) console.log(filePath);
                            console.log(fileNameToCheck);
                            console.log('*************');
                            resultFileNames.push(fileNameToCheck);
                        }
                    }
                })
            })

        } catch (e) {
            throw new Error('error');
        }
    });
}
