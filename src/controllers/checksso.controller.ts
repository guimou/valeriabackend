// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import {get} from '@loopback/rest';

export class CheckssoController {
  constructor() {}
  @get('/checksso')
  hello(): string {
    return 'Hello world!';
  }
}
