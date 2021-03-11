import { Migration } from '@mikro-orm/migrations';

export class Migration20210307144356 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "updated_at" to "last_login";');


    this.addSql('alter table "user" rename column "password" to "password_hash";');
  }

}
