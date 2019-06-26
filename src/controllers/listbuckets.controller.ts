import {inject} from '@loopback/context';
import {Request, RestBindings, get} from '@loopback/rest';

export class ListbucketsController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}
  @get('/listbuckets')
  listBuckets(): string[] {
    const RGW = require('rgw-admin-client');
    const rgw = new RGW({
      accessKey: '###',
      secretKey: '#####',
      host: '####',
      protocol: 'http',
      port: 80,
    });
    const admin = rgw.admin;
    let value: string[];
    const that = this;
    value = [''];
    admin
      .getBucketInfo({uid: 'daber323'})
      .then(function(bucket: any) {
        console.log(bucket);
        that.value = bucket;
        console.log('ok');
      })
      .catch(function(error: any) {
        //value = JSON.stringify(error);
        console.log('erreur');
      });
    return value;
  }
}
