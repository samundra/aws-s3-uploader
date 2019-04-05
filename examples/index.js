const fs = require('fs');
const path = require('path');
const AwsS3Uploader = require('aws-s3-uploader');

const config = {
  accessKeyId: '',  // AWS Access Key
  secretAccessKey: '',  // AWS Secret Access Key
  bucketName: '', // AWS Bucket Name
  distributionId: '', // AWS Distribution ID
  cacheControl: 'no-cache, no-store, max-age=0, s-maxage=0',  // AWS cache Control
  acl: 'public-read'  // AWS ACL
}

// Create Upload Object
const uploader = new AwsS3Uploader(config);

const imagePath = path.join(__dirname, 'demo.png');
const s3UploadPath = 'coin/demo.png';
const mimeType = 'image/jpeg';

// Create Body to Upload
const body = fs.createReadStream(imagePath);

// Initiate Upload Request
const uploadPromise = uploader.upload(body, s3UploadPath, mimeType);

// Wait for the promise to complete
uploadPromise
  .then(data => console.log(data))
  .catch(error => console.log(error));
