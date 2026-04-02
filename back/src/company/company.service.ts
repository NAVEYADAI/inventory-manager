import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Company } from './company.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create a company. if ownerId is provided we also create a subscription
   * linking the given user to the new company.
   */
async create(createCompanyDto: CreateCompanyDto): Promise<{ company: Company; subscription: Subscription | null }> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      
      // יצירת מופעי רפוזיטורי שמחוברים לטרנזקציה הנוכחית
      const txCompanyRepo = manager.withRepository(this.companyRepo);
      const txSubscriptionRepo = manager.withRepository(this.subscriptionRepo);
      const txUserRepo = manager.withRepository(this.userRepo);
      const { ownerId, ...companyData } = createCompanyDto;
      const company = txCompanyRepo.create(companyData);
      const savedCompany = await txCompanyRepo.save(company);
      let subscriptionResult = null;
      if (ownerId) {
        const user = await txUserRepo.findOne({ where: { id: ownerId } });
        
        if (!user) {
          throw new NotFoundException(`Owner user with ID ${ownerId} not found`);
        }
        const subscription = txSubscriptionRepo.create({
          company: savedCompany,
          users: [user],
        });
        subscriptionResult = await txSubscriptionRepo.save(subscription);
      }
      
      return { company: savedCompany, subscription: subscriptionResult };
    });
  }
  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
