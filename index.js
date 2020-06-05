var AWS = require("aws-sdk");
var path = require("path");
var fs = require('fs');

require('dotenv').config()

AWS.config.update({
    // accessKeyId: process.env['accessKeyId'],
    // secretAccessKey: process.env['secretAccessKey'],
    region: process.env['region']
});




const uploadDir = function(s3Path, bucketName) {

    let s3 = new AWS.S3();

    function walkSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach(function (name) {
            var filePath = path.join(currentDirPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                callback(filePath, stat);
            } else if (stat.isDirectory()) {
                walkSync(filePath, callback);
            }
        });
    }

    walkSync(s3Path, function(filePath, stat) {
        let bucketPath = filePath.substring(s3Path.length+1);
        let params = {Bucket: bucketName, Key: bucketPath, Body: fs.readFileSync(filePath) };        
        
        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log('Successfully uploaded '+ bucketPath +' to ' + bucketName);
            }
        });

    });
};

// uploadDir('upload directory', "BUCKET_NAME");
uploadDir('/Users/obaydaba/Desktop/test s3', "obay/react");
