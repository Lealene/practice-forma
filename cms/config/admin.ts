import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'UZzHESUPyOvQjT75lJFYMw=='),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'lZZAKQFoFF6T2VC6gbdk+w=='),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'WZC3rGqzWJarL7xbgZwx9A=='),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY', 'ZMbZScDzAiayVDML6YamXw=='),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    docLinks: env.bool('FLAG_DOC_LINKS', true),
  },
});

export default config;
