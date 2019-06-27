import {inject} from '@loopback/context';
import {Request, RestBindings, get} from '@loopback/rest';

export class ListbucketsController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}
  @get('/listbuckets')
  async listBuckets(): Promise<any> {
    const RGW = require('rgw-admin-client');
    const rgw = new RGW({
      host: process.env.GATEWAY_URL,
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_SECRET_ACCESS_KEY,
      protocol: process.env.PROTOCOL,
      port: process.env.PORT,
    });
    const admin = rgw.admin;
    let value;
    await admin
      .getBucketInfo({uid: 'daber323'})
      .then(function(bucket: any) {
        value = JSON.stringify(bucket);
      })
      .catch(function(error: any) {
        value = JSON.stringify(error);
      });
    return value;
  }
}
