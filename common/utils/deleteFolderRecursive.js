const fs = require('fs');

// Can't delete a directory if it's full.
// Recurse through folder, delete files, delete dir.
// https://stackoverflow.com/a/32197381/231730
const deleteFolderRecursive = function(path) {
  if(fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + '/' + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        this.deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports = deleteFolderRecursive;