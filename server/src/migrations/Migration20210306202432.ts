import { Migration } from '@mikro-orm/migrations';

export class Migration20210306202432 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "position" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "job_title" varchar(255) not null);');
  }

}
