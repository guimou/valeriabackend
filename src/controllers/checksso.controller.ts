import {inject} from '@loopback/context';
import {Request, RestBindings, get} from '@loopback/rest';

export class CheckssoController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}
  @get('/checksso')
  hello(): string {
    return (
      this.req.kauth.grant.access_token.content.preferred_username +
      '\n' +
      this.req.kauth.grant.access_token.content.realm_access.roles
    );
  }
}
