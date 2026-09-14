import type { Core } from '@strapi/strapi';

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      // @ts-ignore - plugin query
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });
      if (!publicRole) {
        strapi.log.warn('Public role not found, skipping permission bootstrap');
        return;
      }

      const actions = [
        'api::product.product.find',
        'api::product.product.findOne',
        'api::category.category.find',
        'api::category.category.findOne',
      ];

      for (const action of actions) {
        // Check if permission already exists
        // @ts-ignore
        let permission = await strapi.db.query('plugin::users-permissions.permission').findOne({
          where: { action },
        });
        if (!permission) {
          // @ts-ignore
          permission = await strapi.db.query('plugin::users-permissions.permission').create({
            data: { action, role: publicRole.id },
          });
          strapi.log.info(`Created permission ${action} for public`);
        } else {
          // Ensure linked to public role via join table (Strapi 5 uses relation)
          // @ts-ignore - check if already linked
          const linked = await strapi.db.connection.raw(
            `SELECT * FROM up_permissions_role_lnk WHERE permission_id = ? AND role_id = ?`,
            [permission.id, publicRole.id]
          );
          const rows = (linked as any)?.rows ?? linked;
          const exists = Array.isArray(rows) ? rows.length > 0 : false;
          if (!exists) {
            await strapi.db.connection.raw(
              `INSERT INTO up_permissions_role_lnk (permission_id, role_id, permission_ord) VALUES (?, ?, 1) ON CONFLICT DO NOTHING`,
              [permission.id, publicRole.id]
            );
            strapi.log.info(`Linked permission ${action} to public role`);
          }
        }
      }

      // Optional: seed sample data if empty
      // @ts-ignore
      const productCount = await strapi.db.query('api::product.product').count();
      if (productCount === 0) {
        // @ts-ignore
        const catCount = await strapi.db.query('api::category.category').count();
        let categoryId: any = null;
        if (catCount === 0) {
          // @ts-ignore
          const cat = await strapi.db.query('api::category.category').create({
            data: { name: 'Office', slug: 'office' },
          });
          categoryId = cat.id;
          strapi.log.info(`Seeded category Office: ${categoryId}`);
        } else {
          // @ts-ignore
          const cats = await strapi.db.query('api::category.category').findMany({ limit: 1 });
          categoryId = cats[0]?.id;
        }
        // create sample product
        // @ts-ignore
        await strapi.db.query('api::product.product').create({
          data: {
            name: 'Forma Oak Desk',
            slug: 'forma-oak-desk',
            price: 899,
            description: 'Solid FSC oak desk, made to order in 4 to 6 weeks. 10-year structural warranty.',
            material: 'Solid FSC oak, never veneer',
            dimensions: '140x70x75cm',
            stock: 10,
            category: categoryId,
          },
        });
        strapi.log.info('Seeded sample product Forma Oak Desk');
      }
    } catch (e) {
      strapi.log.error('Bootstrap permission seeding failed', e);
    }
  },
};
