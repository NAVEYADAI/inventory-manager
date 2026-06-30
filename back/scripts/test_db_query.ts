import { AppDataSource } from '../src/data-source';
import { Company } from '../src/company/company.entity';
import { User } from '../src/user/user.entity';
import { Subscription } from '../src/subscription/subscription.entity';

async function main() {
  console.log('Connecting to database...');
  await AppDataSource.initialize();
  console.log('Connected.');
  try {
    const users = await AppDataSource.getRepository(User).find();
    console.log('Users in DB:', users);
    
    const companies = await AppDataSource.getRepository(Company).find();
    console.log('Companies in DB:', companies);

    const subscriptions = await AppDataSource.getRepository(Subscription).find({
      relations: ['company', 'users'],
    });
    console.log('Subscriptions in DB:', subscriptions);
  } catch (error) {
    console.error('Query failed with error:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
