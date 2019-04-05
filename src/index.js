/* eslint-disable no-underscore-dangle */
const AWS = require('aws-sdk');

const s3debugger = require('debug')('s3:uploader');

/**
 * Amazon S3 Uploader
 * This library uploads file to the amazon s3 bucket.
 */
class AwsS3Uploader {
  /**
   * Creates Object
   *
   * @param {Object} awsConfig AWS S3 Config
   *
   * const awsConfig = {
   *   accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
   *   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
   *   bucketName: process.env.AWS_S3_BUCKET_NAME || '',
   *   distributionId: process.env.DISTRIBUTION_ID || '',
   *   cacheControl: process.env.AWS_S3_CACHE_CONTROL || 'no-cache, no-store, max-age=0, s-maxage=0',
   *   acl: process.env.AWS_S3_ACL || 'public-read'
   * }
   */
  constructor(awsConfig = {}) {
    const { accessKeyId, secretAccessKey } = awsConfig;

    if (accessKeyId === '' || secretAccessKey === '') {
      throw new Error('Please configure AWS access key, AWS secret access key.');
    }

    AWS.config.update({
      accessKeyId,
      secretAccessKey
    });

    this.s3Config = awsConfig;
    this.s3 = new AWS.S3();
  }

  /**
   * Sends asynchronous upload request to AWS S3
   *
   * @param {Object} params
   * const params = {
   *   ACL: 'public-read',
   *   Bucket: 's3-bucket-name',
   *   Body: fs.createReadStream(filePath);,
   *   Key: 'coingame2019/coin/myimage.jpeg',
   *   ContentType: 'image/jpeg',
   *   CacheControl: 'no-cache, no-store, max-age=0, s-maxage=0'
   * };
   */
  async _asyncUploadRequest(params) {
    s3debugger('sending async s3 upload request');

    // Promise based upload request
    return new Promise((resolve, reject) => {
      const uploadResult = this.s3.upload(params);
      const uploadPromise = uploadResult.promise();

      return uploadPromise.then((response) => {
        s3debugger('image uploaded', response);
        resolve(response.Location);
      }).catch(error => reject(error));
    });
  }

  /**
   * Sync Upload Request, blocks the calls
   *
   * @param {Object} params
   * const params = {
   *   ACL: 'public-read',
   *   Bucket: 's3-bucket-name',
   *   Body: fs.createReadStream(filePath);,
   *   Key: 'coingame2019/coin/myimage.jpeg',
   *   ContentType: 'image/jpeg',
   *   CacheControl: 'no-cache, no-store, max-age=0, s-maxage=0'
   * };
   */
  _syncUploadRequest(params) {
    /** Blocking upload Request */
    this.s3.upload(params, (err, data) => {
      if (err) {
        throw err;
      } else {
        const { Location } = data;
        s3debugger('uploaded successfully.');
        s3debugger(`upload Location: ${Location}`);
      }
    });
  }

  /**
   * Create the AWS parameter and sends the upload request. It's promise based.
   * On success, it returns Location to the S3 where image has been uploaded.
   * On error, the promise is rejected and error is thrown.
   *
   * @param {Stream} body Body stream
   * @param {string} s3UploadPath destination path in S3
   * @param {string} mime image mimetype e.g. image/jpeg
   *
   * @return Promise ManagedUpload Promise Object
   *
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html
   */
  async upload(body, s3UploadPath, mime) {
    // For S3 params https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
    const params = {
      ACL: this.s3Config.acl,
      Bucket: this.s3Config.bucketName,
      Body: body,
      Key: s3UploadPath,
      ContentType: mime,
      CacheControl: this.s3Config.cacheControl
    };

    const uploadLocation = await this._asyncUploadRequest(params);

    s3debugger('s3 upload Location:', uploadLocation);

    return uploadLocation;
  }

  // TODO: Implement delete as well.
}

module.exports = AwsS3Uploader;
