import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', [
      'tLD4pBKcfAZfQ9jFTRFldg==',
      'DJrt3H0XncwGEYjSysI7QQ==',
      '8UjFTAV7RdI+jhzcJVFQ8Q==',
      'yHEFdqkZ6wwTBN2TPJ7+kA==',
    ]),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

export default config;
