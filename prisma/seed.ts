import { PrismaClient as PrismaMysqlClient } from './generated/mysql';
import { PrismaClient as PrismaMongoClient } from './generated/mongo';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaMysqlClient();
const mongo = new PrismaMongoClient();

async function main() {
    console.log('Starting seed...');

    // Constants for seeding
    const TOTAL_USERS = 30;
    const TOTAL_SHOPS = 10;
    const MENUS_PER_SHOP = 10;
    const ACTIVITY_LOGS_COUNT = 100;

    const defaultPassword = await bcryptjs.hash('password123', 10);

    // 1. Array of realistic Thai menu names
    const thaiMenus = [
        { name: 'ผัดกะเพราหมูสับ', price: 50 },
        { name: 'ข้าวผัดหมู', price: 45 },
        { name: 'ไข่เจียวหมูสับ', price: 40 },
        { name: 'ผัดไทยกุ้งสด', price: 60 },
        { name: 'ต้มยำกุ้งน้ำข้น', price: 120 },
        { name: 'แกงเขียวหวานไก่', price: 80 },
        { name: 'ส้มตำไทย', price: 40 },
        { name: 'น้ำตกหมู', price: 60 },
        { name: 'ก๋วยเตี๋ยวเรือเนื้อเปื่อย', price: 50 },
        { name: 'ข้าวมันไก่', price: 45 },
        { name: 'ข้าวหมูแดง', price: 50 },
        { name: 'ยำวุ้นเส้นหมูสับ', price: 80 },
        { name: 'หมูปิ้งนมสด (3 ไม้)', price: 30 },
        { name: 'ไก่ทอดกระเทียม', price: 60 },
        { name: 'แกงส้มชะอมกุ้ง', price: 100 },
        { name: 'ข้าวไข่ข้นกุ้ง', price: 70 },
        { name: 'มักกะโรนีผัดซอสมะเขือเทศ', price: 60 },
        { name: 'ผัดมาม่าใส่ไข่', price: 40 },
        { name: 'ข้าวผัดต้มยำ', price: 65 },
        { name: 'กุยช่ายผัดตับ', price: 70 }
    ];

    const menuOptions = [
        { name: 'ไข่ดาว', price: 10 },
        { name: 'ไข่เจียว', price: 15 },
        { name: 'เพิ่มข้าว', price: 10 },
        { name: 'พิเศษเนื้อสัตว์', price: 20 },
        { name: 'ไม่ใส่ผงชูรส', price: 0 }
    ];

    const shopNames = [
        'ร้านกะเพราอาม่า',
        'ตำนัว ส้มตำรสเด็ด',
        'ตามสั่งเจ๊พร',
        'ก๋วยเตี๋ยวเรืออยุธยา (สูตรโบราณ)',
        'ข้าวมันไก่เฮียปุง',
        'ผัดไทยเส้นจันท์ ป้าแมว',
        'ข้าวแกง 100 หม้อ',
        'ยำตะกุย ปากซอย',
        'สเต็กริมทาง',
        'โจ๊กหม้อดิน บางรัก'
    ];

    // Clean up existing records (Optional, uncomment if you want clean state every time)
    // console.log('Cleaning up existing data...');
    // await prisma.menuOption.deleteMany();
    // await prisma.menu.deleteMany();
    // await prisma.shop.deleteMany();
    // await prisma.wallet.deleteMany();
    // await prisma.user.deleteMany();
    // await mongo.activityLog.deleteMany();
    // console.log('Clean up complete.');

    // 2. Generate Users
    const usersData = [];
    console.log(`Creating ${TOTAL_USERS} users...`);
    for (let i = 1; i <= TOTAL_USERS; i++) {
        // First 10 users will be SHOP OWNERs, the rest are CUSTOMERs
        const role = i <= TOTAL_SHOPS ? 'OWNER' : 'CUSTOMER';
        usersData.push({
            email: `user${i}@example.com`,
            name: `Mock User ${i}`,
            username: `user${i}`,
            password: defaultPassword,
            role: role as 'OWNER' | 'CUSTOMER',
        });
    }

    const createdUsers = [];
    for (const userData of usersData) {
        // Upsert to handle re-runs gracefully
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: userData,
        });

        // Initialize Wallet
        await prisma.wallet.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                balance: Math.floor(Math.random() * 1000) // Random initial balance 0 - 999
            }
        });
        createdUsers.push(user);
    }
    console.log('- Users created successfully.');

    // 3. Generate Shops
    const owners = createdUsers.filter(u => u.role === 'OWNER').slice(0, TOTAL_SHOPS);
    const createdShops = [];
    
    console.log(`Creating ${TOTAL_SHOPS} shops...`);
    for (let i = 0; i < owners.length; i++) {
        const owner = owners[i];
        const shopName = shopNames[i] || `Shop ของ ${owner.name}`;
        
        // Find existing shop or create new one
        let shop = await prisma.shop.findFirst({
            where: { ownerId: owner.id }
        });

        if (!shop) {
             shop = await prisma.shop.create({
                data: {
                    name: shopName,
                    description: `ร้านอร่อยเด็ดประจำซอย เมนูหลากหลาย สดสะอาด สั่งเลย! (${shopName})`,
                    ownerId: owner.id,
                    isOpen: Math.random() > 0.3, // 70% chance to be open
                    wallet: 0,
                    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=500&fit=crop'
                }
            });
        }
        createdShops.push(shop);
    }
    console.log('- Shops created successfully.');

    // 4. Generate Menus per Shop
    console.log(`Creating ${MENUS_PER_SHOP} menus per shop (${TOTAL_SHOPS * MENUS_PER_SHOP} total menus)...`);
    for (const shop of createdShops) {
        // Shuffle and pick top MENUS_PER_SHOP items
        const selectedMenus = [...thaiMenus].sort(() => 0.5 - Math.random()).slice(0, MENUS_PER_SHOP);

        for (const menuData of selectedMenus) {
             // Create Menu
             const createdMenu = await prisma.menu.create({
                 data: {
                     name: menuData.name,
                     price: menuData.price,
                     shopId: shop.id,
                     isAvailable: Math.random() > 0.1, // 90% chance to be available
                 }
             });

             // Pick 1-3 random options to attach to this menu
             const numOptions = Math.floor(Math.random() * 3) + 1;
             const selectedOptions = [...menuOptions].sort(() => 0.5 - Math.random()).slice(0, numOptions);

             for (const opt of selectedOptions) {
                 await prisma.menuOption.create({
                     data: {
                         name: opt.name,
                         price: opt.price,
                         menuId: createdMenu.id
                     }
                 });
             }
        }
    }
    console.log('- Menus and MenuOptions created successfully.');

    // 5. Generate Activity Logs (Mongo)
    console.log(`Generating ${ACTIVITY_LOGS_COUNT} activity logs...`);
    const actionTypes = ['WALLET_TOPUP', 'ORDER_PLACED', 'LOGIN', 'SHOP_INCOME', 'ORDER_COMPLETED', 'MENU_CREATED'];
    
    for (let i = 0; i < ACTIVITY_LOGS_COUNT; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomAction = actionTypes[Math.floor(Math.random() * actionTypes.length)];
        const randomShop = createdShops[Math.floor(Math.random() * createdShops.length)];
        
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days

        await mongo.activityLog.create({
            data: {
                userId: randomUser.id,
                shopId: randomAction === 'SHOP_INCOME' || randomAction === 'ORDER_PLACED' ? randomShop.id : null,
                userRole: randomUser.role,
                action: randomAction,
                description: `System generated log - ${randomAction} by ${randomUser.name}`,
                metadata: {
                    ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
                    userAgent: 'Seed-Script/1.0',
                    randomVal: Math.floor(Math.random() * 1000)
                },
                createdAt: timestamp
            }
        });
    }
    console.log('- Activity logs generated successfully.');

    console.log('\n✅ Seeding finished successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await mongo.$disconnect();
    });
