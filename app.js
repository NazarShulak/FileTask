const path = require("path");
const {diff} = require('./index');

const dirPathToSearch = path.join(process.cwd(), 'main');
const mainListPath = path.join(process.cwd(), 'main_list.txt');

diff(dirPathToSearch, mainListPath);
