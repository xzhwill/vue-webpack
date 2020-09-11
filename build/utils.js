const fs = require('fs');
const path = require('path');
function deleteFile(delPath, direct) {
    delPath = direct ? delPath : path.join(__dirname, delPath)
    console.log("delPath================",delPath)
    try {
        /**
         * @des 判断文件或文件夹是否存在
         */
        if (fs.existsSync(delPath)) {
            fs.unlinkSync(delPath);
        } else {
            console.log('inexistence path：', delPath);
        }
    } catch (error) {
        console.log('del error', error);
    }
}

module.exports = {
    deleteFile:deleteFile
}