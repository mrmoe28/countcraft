import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a demo performance
  const performance = await prisma.performance.create({
    data: {
      name: 'Demo Routine',
      team: 'Sample Squad',
      eventDate: new Date('2024-12-01'),
    },
  });

  console.log(`Created performance: ${performance.name}`);

  // Create track (16 measures at 120 BPM = 32 seconds)
  const bpm = 120;
  const durationSec = 32;
  const offsetSec = 0;

  const track = await prisma.track.create({
    data: {
      performanceId: performance.id,
      fileName: 'demo-track.mp3',
      durationSec,
      bpm,
      offsetSec,
    },
  });

  console.log(`Created track: ${track.fileName}`);

  // Generate 8-count grid for 16 measures
  const measures = 16;
  const countsPerMeasure = 8;
  const beatDuration = 60 / bpm;

  const notes = [];
  for (let m = 0; m < measures; m++) {
    for (let c = 1; c <= countsPerMeasure; c++) {
      const atSec = offsetSec + m * countsPerMeasure * beatDuration + (c - 1) * beatDuration;
      notes.push({
        performanceId: performance.id,
        measureIndex: m,
        countInMeasure: c,
        atSec,
        text: '', // Empty by default
      });
    }
  }

  await prisma.countNote.createMany({
    data: notes,
  });

  console.log(`Created ${notes.length} count notes (${measures} measures × ${countsPerMeasure} counts)`);
  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
