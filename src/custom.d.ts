declare namespace Express {
  export interface KcContent {
    scope: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
  }
  export interface KcAccessToken {
    token: string;
    content: KcContent;
  }
  export interface KcGrant {
    grant: {
      access_token: KcAccessToken;
    };
  }
  export interface Request {
    kauth: KcGrant;
  }
}
