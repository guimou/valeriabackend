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
    const individualUsedStorage = ['']; //impossible d'initialiser l'array sans aucun élément, nous l'enlevons plus tard
    let userQuota = 0;
    let usedStorage = 0;
    let bucketArray;

    //Get every buckets from user
    await admin
      .getBucketInfo({uid: 'daber323'}) //this.req.kauth.grant.access_token.content.preferred_username
      .then(function(bucket: string) {
        bucketArray = bucket;
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
              individualUsedStorage.push(string);
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

    individualUsedStorage.splice(0, 1); //on enlève l'élément d'initialistion inutile

    const resp = {
      buckets: bucketArray,
      used_storage: usedStorage,
      user_quota: userQuota,
      individual_storage: individualUsedStorage,
    };

    return resp;
  }
}
