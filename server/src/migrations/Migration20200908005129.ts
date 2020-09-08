import { Migration } from '@mikro-orm/migrations';

export class Migration20200908005129 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "post" cascade;');
  }

}
