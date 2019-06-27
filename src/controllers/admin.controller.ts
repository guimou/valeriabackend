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

export class AdminController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}
  @get('/admin')
  async loadData(): Promise<any> {
    let bucketList = '';
    let userQuota = 0;
    let usedStorage = 0;

    //Get every buckets from user
    await admin
      .getBucketInfo({uid: 'daber323'}) //this.req.kauth.grant.access_token.content.preferred_username
      .then(function(bucket: string) {
        console.log(bucket);
        bucketList = JSON.stringify(bucket);
      })
      .catch(function(error: string) {
        console.log(JSON.stringify(error));
      });

    //Get user quota (maximum storage)
    await admin
      .getUserQuota({uid: 'daber323'}) //this.req.kauth.grant.access_token.content.preferred_username
      .then(function(bucket: any) {
        userQuota = parseInt(JSON.stringify(bucket.max_size));
      })
      .catch(function(error: string) {
        console.log(JSON.stringify(error));
      });

    //Get space currently used by user
    await admin
      .getBucketInfo({uid: 'daber323'}) //this.req.kauth.grant.access_token.content.preferred_username
      .then(async function(buckets: any) {
        for (const bucket in buckets) {
          await admin
            .getBucketInfo({bucket: buckets[bucket]})
            .then(function(b: any) {
              const string = JSON.stringify(b.usage['rgw.main'].size);
              const size = parseInt(string);
              usedStorage += size;
            })
            .catch(function(error: any) {
              console.log(JSON.stringify(error));
            });
        }
      })
      .catch(function(error: any) {
        console.log(JSON.stringify(error));
      });

    const resp = {
      buckets: bucketList,
      used_storage: usedStorage,
      user_quota: userQuota,
    };

    return resp; //array of buckets
  }
}
