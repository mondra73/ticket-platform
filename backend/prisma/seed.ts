import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes
  await prisma.ticket.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.sector.deleteMany();
  await prisma.event.deleteMany();
  await prisma.location.deleteMany();

  // Locaciones
  const river = await prisma.location.create({
    data: {
      name: 'Estadio Monumental',
      address: 'Av. Figueroa Alcorta 7597, Buenos Aires',
      maxCapacity: 84000
    }
  });

  const luna = await prisma.location.create({
    data: {
      name: 'Luna Park',
      address: 'Av. Madero 420, Buenos Aires',
      maxCapacity: 8500
    }
  });

  const movistar = await prisma.location.create({
    data: {
      name: 'Movistar Arena',
      address: 'Humboldt 450, Buenos Aires',
      maxCapacity: 15000
    }
  });

  // Eventos
  const acdc = await prisma.event.create({
    data: {
      name: 'AC/DC - Power Up Tour',
      startDate: new Date('2026-12-15T21:00:00Z'),
      locationId: river.id
    }
  });

  const coldplay = await prisma.event.create({
    data: {
      name: 'Coldplay - Music of the Spheres',
      startDate: new Date('2026-11-08T20:00:00Z'),
      locationId: river.id
    }
  });

  const calle13 = await prisma.event.create({
    data: {
      name: 'Residente - En Vivo',
      startDate: new Date('2026-10-22T21:30:00Z'),
      locationId: movistar.id
    }
  });

  const jazz = await prisma.event.create({
    data: {
      name: 'Buenos Aires Jazz Festival',
      startDate: new Date('2026-09-18T19:00:00Z'),
      locationId: luna.id
    }
  });

  // Sectores para AC/DC
  await prisma.sector.createMany({
    data: [
      { name: 'Campo', price: 150, totalStock: 5000, eventId: acdc.id },
      { name: 'Tribuna Platea', price: 120, totalStock: 8000, eventId: acdc.id },
      { name: 'Tribuna Alta', price: 80, totalStock: 10000, eventId: acdc.id },
      { name: 'VIP', price: 350, totalStock: 500, eventId: acdc.id }
    ]
  });

  // Sectores para Coldplay
  await prisma.sector.createMany({
    data: [
      { name: 'Campo', price: 200, totalStock: 5000, eventId: coldplay.id },
      { name: 'Platea', price: 180, totalStock: 8000, eventId: coldplay.id },
      { name: 'Alta', price: 100, totalStock: 10000, eventId: coldplay.id },
      { name: 'VIP', price: 500, totalStock: 300, eventId: coldplay.id }
    ]
  });

  // Sectores para Residente
  await prisma.sector.createMany({
    data: [
      { name: 'Platea', price: 90, totalStock: 8000, eventId: calle13.id },
      { name: 'Campo', price: 70, totalStock: 5000, eventId: calle13.id },
      { name: 'VIP', price: 200, totalStock: 200, eventId: calle13.id }
    ]
  });

  // Sectores para Jazz
  await prisma.sector.createMany({
    data: [
      { name: 'General', price: 60, totalStock: 6000, eventId: jazz.id },
      { name: 'Preferencial', price: 100, totalStock: 2000, eventId: jazz.id }
    ]
  });

  console.log('✅ Seed completado:');
  console.log(`   - ${await prisma.location.count()} locaciones`);
  console.log(`   - ${await prisma.event.count()} eventos`);
  console.log(`   - ${await prisma.sector.count()} sectores`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });