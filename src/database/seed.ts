import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import dataSource from './data-source';
import { User, UserRole } from '../users/entities/user.entity';

async function seed() {
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const email = 'admin@tiaragroup.com';
  const plainPassword = 'password@2026';

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existingUser = await userRepository.findOne({
    where: { email },
  });

  if (existingUser) {
    existingUser.name = 'Admin';
    existingUser.password = hashedPassword;
    existingUser.role = UserRole.ADMIN;
    existingUser.isActive = true;

    await userRepository.save(existingUser);

    console.log('Admin user updated successfully');
  } else {
    const adminUser = userRepository.create({
      name: 'Admin',
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await userRepository.save(adminUser);

    console.log('Admin user created successfully');
  }

  console.log('Email:', email);
  console.log('Password:', plainPassword);

  await dataSource.destroy();
}

seed().catch(async (error) => {
  console.error(error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});