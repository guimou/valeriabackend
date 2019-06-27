/* eslint-disable @typescript-eslint/no-explicit-any */
import {inject} from '@loopback/context';
import {Request, RestBindings, get} from '@loopback/rest';

const RGW = require('rgw-admin-client');
const rgw = new RGW({
  host: process.env.GATEWAY_URL,
  accessKey: process.env.AWS_ACCESS_KEY_ID,
  secretKey: process.env.AWS_SECRET_ACCESS_KEY,
  protocol: process.env.PROTOCOL,
  port: process.env.PORT,
});
const admin = rgw.admin;

export class ListBucketsController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @get('/listbuckets')
  async listBuckets(): Promise<string> {
    let value = '';
    await admin
      .getBucketInfo({uid: 'daber323'}) //this.req.kauth.grant.access_token.content.preferred_username
      .then(function(bucket: string) {
        value = JSON.stringify(bucket);
      })
      .catch(function(error: string) {
        console.log(JSON.stringify(error));
      });
    return value; //array of buckets
  }

  @get('/usedCapacity')
  async getDataUsed(): Promise<number> {
    let totalSize = 0;
    await admin
      .getBucketInfo({uid: 'daber323'}) //this.req.kauth.grant.access_token.content.preferred_username
      .then(async function(buckets: any) {
        for (const bucket in buckets) {
          await admin
            .getBucketInfo({bucket: buckets[bucket]})
            .then(function(b: any) {
              const string = JSON.stringify(b.usage['rgw.main'].size);
              const size = parseInt(string);
              totalSize += size;
            })
            .catch(function(error: any) {
              console.log(JSON.stringify(error));
            });
        }
      })
      .catch(function(error: any) {
        console.log(JSON.stringify(error));
      });
    return totalSize; //in bytes
  }

  @get('/userquota')
  async userQuota(): Promise<number> {
    let quota = 0;
    await admin
      .getUserQuota({uid: 'daber323'}) //this.req.kauth.grant.access_token.content.preferred_username
      .then(function(bucket: any) {
        quota = parseInt(JSON.stringify(bucket.max_size));
      })
      .catch(function(error: string) {
        console.log(JSON.stringify(error));
      });
    return quota; //in bytes
  }
}
