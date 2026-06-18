import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  const adminEmail = 'admin@example.com';
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
      },
    });
    console.log('Admin user created (admin@example.com / admin123)');
  } else {
    console.log('Admin user already exists');
  }

  const insideZone = await prisma.deliveryCharge.findUnique({
    where: { zone: 'INSIDE_DHAKA' },
  });
  if (!insideZone) {
    await prisma.deliveryCharge.create({
      data: { zone: 'INSIDE_DHAKA', charge: 60, minOrder: 500 },
    });
    console.log('Delivery charge for INSIDE_DHAKA created (৳60, free above ৳500)');
  }

  const outsideZone = await prisma.deliveryCharge.findUnique({
    where: { zone: 'OUTSIDE_DHAKA' },
  });
  if (!outsideZone) {
    await prisma.deliveryCharge.create({
      data: { zone: 'OUTSIDE_DHAKA', charge: 120, minOrder: 1000 },
    });
    console.log('Delivery charge for OUTSIDE_DHAKA created (৳120, free above ৳1000)');
  }

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
