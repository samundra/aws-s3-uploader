## AWS S3 Uploader

Upload image easily in AWS S3.

### Usage

For sample code: please refer to `examples/` folder.

### How to use this Library

- Require the package `yarn add samundra/aws-s3-uploader`
- Require the package

```javascript
const AwsS3Uploader = require('aws-s3-uploader');
```

- Create instance with configuration

```javascript

// Configurations
const config = {
  accessKeyId: '',  // AWS Access Key
  secretAccessKey: '',  // AWS Secret Access Key
  bucketName: '', // AWS Bucket Name
  distributionId: '', // AWS Distribution ID
  cacheControl: 'no-cache, no-store, max-age=0, s-maxage=0',  // AWS cache Control
  acl: 'public-read'  // AWS ACL
}

// Create Instance
const uploader = new AwsS3Uploader(config);
```

- Upload and get the uploaded s3 location

```javascript
const imagePath = path.join(__dirname, 'demo.png');
const s3UploadPath = 'coingame2019/coin/demo.png';
const mimeType = 'image/jpeg';

// Create Body to Upload
const body = fs.createReadStream(imagePath);

// Initiate Upload Request
const uploadPromise = uploader.upload(body, s3UploadPath, mimeType);

// Wait for the promise to complete
uploadPromise
  .then(data => console.log(data))
  .catch(error => console.log(error));

// Sample Output: https://s3.ap-southeast-1.amazonaws.com/demo/demo.png'
```

### Troubleshoot

### Questions about this project?

Please feel free to report any bug found. Pull requests, issues, and project recommendations are more than welcome!

### Todo

- Unit Tests
- Improve Code Quality


