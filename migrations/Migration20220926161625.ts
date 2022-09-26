import { Migration } from '@mikro-orm/migrations';

export class Migration20220926161625 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "order" ("order_id" varchar(255) not null, "customer_id" varchar(255) not null, "company_id" varchar(255) not null, constraint "order_pkey" primary key ("order_id", "customer_id", "company_id"));');

    this.addSql('create table "order_event" ("order_event_id" varchar(255) not null, "order_order_id" varchar(255) not null, "order_customer_id" varchar(255) not null, "order_company_id" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, constraint "order_event_pkey" primary key ("order_event_id", "order_order_id", "order_customer_id", "order_company_id"));');

    this.addSql('alter table "order_event" add constraint "order_event_order_order_id_order_customer_id_orde_042c6_foreign" foreign key ("order_order_id", "order_customer_id", "order_company_id") references "order" ("order_id", "customer_id", "company_id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "order_event" drop constraint "order_event_order_order_id_order_customer_id_orde_042c6_foreign";');
  }

}
