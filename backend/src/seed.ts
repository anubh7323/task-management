import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Create a Test User
    const email = 'demo@example.com';
    const password = await bcrypt.hash('password123', 10);

    // Upsert user (create if not exists)
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password,
        },
    });

    console.log(`👤 Created user: ${user.email} (Password: password123)`);

    // 2. Create Dummy Tasks
    const tasks = [
        {
            title: 'Complete the Project Integration',
            description: 'Connect frontend with backend and verify database connection.',
            status: 'COMPLETED',
            userId: user.id
        },
        {
            title: 'Review Design System',
            description: 'Ensure dark mode authentication pages look premium.',
            status: 'IN_PROGRESS',
            userId: user.id
        },
        {
            title: 'Plan Next Sprint',
            description: 'Outline features for the V2 release.',
            status: 'PENDING',
            userId: user.id
        },
        {
            title: 'Fix Navigation Bug',
            description: 'Sidebar links should highlight correctly on mobile.',
            status: 'PENDING',
            userId: user.id
        }
    ];

    for (const task of tasks) {
        // Check if task exists to avoid duplicates on re-run
        const existing = await prisma.task.findFirst({
            where: { title: task.title, userId: user.id }
        });

        if (!existing) {
            // @ts-ignore - Status enum handling might vary if we switched to sqlite/postgres back and forth, but currently on Postgres so Enum works.
            // Actually, if we are on Postgres, we need to make sure the enum string matches.
            await prisma.task.create({ data: task as any });
        }
    }

    console.log(`✅ Added ${tasks.length} tasks for testing.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
