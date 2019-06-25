import {inject} from '@loopback/context';
import {Request, RestBindings, get} from '@loopback/rest';

export class VanillaController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}
  @get('/vanilla')
  hello(): object {
    const username: string = this.req.kauth.grant.access_token.content
      .preferred_username;
    const roles: string[] = this.req.kauth.grant.access_token.content
      .realm_access.roles;
    const info = {
      username: username,
      roles: roles,
    };
    return info;
  }
}
