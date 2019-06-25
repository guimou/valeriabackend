// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/context';

import {Request, RestBindings, get} from '@loopback/rest';

export class CheckssoController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}
  @get('/checksso')
  hello(): string {
    return this.req.kauth.grant.access_token.content.preferred_username;
  }
}
