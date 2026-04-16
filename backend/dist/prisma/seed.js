"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const food_images_1 = require("./food-images");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.loyaltySettings.upsert({
        where: { id: 'default' },
        create: {
            id: 'default',
            pointsPerCurrencyUnit: 0.1,
            redeemPointsPerUnit: 100,
            minRedeemPoints: 100,
        },
        update: {},
    });
    const password = await bcrypt.hash('Demo123!', 10);
    const branchNorth = await prisma.branch.upsert({
        where: { id: 'seed-branch-north' },
        create: {
            id: 'seed-branch-north',
            name: 'فرع الشمال — مدينة نصر',
            address: '٨ شارع مصطفى النحاس، مدينة نصر، القاهرة',
            phone: '01000000001',
            isActive: true,
        },
        update: {},
    });
    const branchSouth = await prisma.branch.upsert({
        where: { id: 'seed-branch-south' },
        create: {
            id: 'seed-branch-south',
            name: 'فرع الجنوب — الهرم',
            address: '١٢ شارع الهرم الرئيسي، الجيزة',
            phone: '01000000002',
            isActive: true,
        },
        update: {},
    });
    const branchEast = await prisma.branch.upsert({
        where: { id: 'seed-branch-east' },
        create: {
            id: 'seed-branch-east',
            name: 'فرع الشرق — التجمع',
            address: 'التجمع الخامس، محور السادات',
            phone: '01000000003',
            isActive: true,
        },
        update: {},
    });
    const cats = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'dairy' },
            create: { nameAr: 'ألبان وأجبان', slug: 'dairy' },
            update: {},
        }),
        prisma.category.upsert({
            where: { slug: 'bakery' },
            create: { nameAr: 'مخبوزات', slug: 'bakery' },
            update: {},
        }),
        prisma.category.upsert({
            where: { slug: 'veg' },
            create: { nameAr: 'خضار وفواكه', slug: 'veg' },
            update: {},
        }),
        prisma.category.upsert({
            where: { slug: 'beverages' },
            create: { nameAr: 'مشروبات', slug: 'beverages' },
            update: {},
        }),
        prisma.category.upsert({
            where: { slug: 'meat' },
            create: { nameAr: 'لحوم ودواجن', slug: 'meat' },
            update: {},
        }),
        prisma.category.upsert({
            where: { slug: 'frozen' },
            create: { nameAr: 'مجمدات', slug: 'frozen' },
            update: {},
        }),
        prisma.category.upsert({
            where: { slug: 'pantry' },
            create: { nameAr: 'بقالة', slug: 'pantry' },
            update: {},
        }),
        prisma.category.upsert({
            where: { slug: 'snacks' },
            create: { nameAr: 'سناكس وحلويات', slug: 'snacks' },
            update: {},
        }),
    ]);
    const [catDairy, catBakery, catVeg, catBev, catMeat, catFrozen, catPantry, catSnacks] = cats;
    const productRows = [
        {
            branchId: branchNorth.id,
            categoryId: catDairy.id,
            nameAr: 'حليب كامل الدسم ١ لتر',
            descriptionAr: 'حليب طازج — غني بالكالسيوم',
            price: 45,
            stock: 80,
            imgSeed: 'milk-n',
        },
        {
            branchId: branchNorth.id,
            categoryId: catDairy.id,
            nameAr: 'زبادي يوناني ٤٠٠ غ',
            descriptionAr: 'كريمي ومنعش',
            price: 38,
            stock: 60,
            imgSeed: 'yog-n',
        },
        {
            branchId: branchNorth.id,
            categoryId: catBakery.id,
            nameAr: 'خبز بلدي طازج',
            descriptionAr: 'يومي من الفرن',
            price: 8,
            stock: 200,
            imgSeed: 'bread-n',
        },
        {
            branchId: branchNorth.id,
            categoryId: catBakery.id,
            nameAr: 'فينو فرنسي',
            descriptionAr: 'رغيف طري',
            price: 12,
            stock: 150,
            imgSeed: 'vino-n',
        },
        {
            branchId: branchNorth.id,
            categoryId: catVeg.id,
            nameAr: 'طماطم بلدي',
            descriptionAr: 'كيلو — طازجة',
            price: 22,
            stock: 100,
            imgSeed: 'tom-n',
        },
        {
            branchId: branchNorth.id,
            categoryId: catVeg.id,
            nameAr: 'خيار',
            descriptionAr: 'كيلو',
            price: 18,
            stock: 90,
            imgSeed: 'cuc-n',
        },
        {
            branchId: branchNorth.id,
            categoryId: catBev.id,
            nameAr: 'عصير برتقال طبيعي ١ لتر',
            descriptionAr: 'بدون مواد حافظة',
            price: 55,
            stock: 45,
            imgSeed: 'oj-n',
        },
        {
            branchId: branchNorth.id,
            categoryId: catMeat.id,
            nameAr: 'صدر دجاج منزوع جلد ١ كغ',
            descriptionAr: 'مبرد طازج',
            price: 185,
            stock: 40,
            imgSeed: 'chkn-n',
        },
        {
            branchId: branchNorth.id,
            categoryId: catFrozen.id,
            nameAr: 'بطاطس مقلية مجمدة ١ كغ',
            descriptionAr: 'جاهزة للقلي',
            price: 42,
            stock: 70,
            imgSeed: 'fries-n',
        },
        {
            branchId: branchNorth.id,
            categoryId: catPantry.id,
            nameAr: 'أرز مصري ١ كغ',
            descriptionAr: 'حبة متوسطة',
            price: 36,
            stock: 120,
            imgSeed: 'rice-n',
        },
        {
            branchId: branchNorth.id,
            categoryId: catSnacks.id,
            nameAr: 'شوكولاتة بالحليب',
            descriptionAr: '١٠٠ غ',
            price: 28,
            stock: 200,
            imgSeed: 'choc-n',
        },
        {
            branchId: branchSouth.id,
            categoryId: catDairy.id,
            nameAr: 'جبنة موتزاريلا مبشورة ٢٠٠ غ',
            descriptionAr: 'للبيتزا والمعكرونة',
            price: 62,
            stock: 55,
            imgSeed: 'moz-s',
        },
        {
            branchId: branchSouth.id,
            categoryId: catBakery.id,
            nameAr: 'كرواسون زبدة',
            descriptionAr: '٤ قطع',
            price: 35,
            stock: 40,
            imgSeed: 'cro-s',
        },
        {
            branchId: branchSouth.id,
            categoryId: catVeg.id,
            nameAr: 'بطاطس',
            descriptionAr: 'كيلو',
            price: 16,
            stock: 110,
            imgSeed: 'pot-s',
        },
        {
            branchId: branchSouth.id,
            categoryId: catVeg.id,
            nameAr: 'موز',
            descriptionAr: 'كيلو',
            price: 32,
            stock: 75,
            imgSeed: 'ban-s',
        },
        {
            branchId: branchSouth.id,
            categoryId: catBev.id,
            nameAr: 'مياه معدنية ١٫٥ لتر',
            descriptionAr: 'عبوة',
            price: 10,
            stock: 300,
            imgSeed: 'water-s',
        },
        {
            branchId: branchSouth.id,
            categoryId: catMeat.id,
            nameAr: 'لحم مفروم بقري ٥٠٠ غ',
            descriptionAr: 'طازج',
            price: 120,
            stock: 35,
            imgSeed: 'beef-s',
        },
        {
            branchId: branchSouth.id,
            categoryId: catFrozen.id,
            nameAr: 'سمبوسك جبن ٤٠ قطعة',
            descriptionAr: 'مجمد',
            price: 48,
            stock: 50,
            imgSeed: 'sam-s',
        },
        {
            branchId: branchSouth.id,
            categoryId: catPantry.id,
            nameAr: 'زيت دوار الشمس ١ لتر',
            descriptionAr: 'للطبخ',
            price: 95,
            stock: 85,
            imgSeed: 'oil-s',
        },
        {
            branchId: branchSouth.id,
            categoryId: catSnacks.id,
            nameAr: 'بسكويت بالشوفان',
            descriptionAr: 'علبة عائلية',
            price: 22,
            stock: 90,
            imgSeed: 'bis-s',
        },
        {
            branchId: branchEast.id,
            categoryId: catDairy.id,
            nameAr: 'قشطة طازجة ٢٥٠ غ',
            descriptionAr: 'للحلويات',
            price: 42,
            stock: 40,
            imgSeed: 'cream-e',
        },
        {
            branchId: branchEast.id,
            categoryId: catBakery.id,
            nameAr: 'كيك شوكولاتة',
            descriptionAr: 'قطعة كبيرة',
            price: 55,
            stock: 25,
            imgSeed: 'cake-e',
        },
        {
            branchId: branchEast.id,
            categoryId: catVeg.id,
            nameAr: 'جزر',
            descriptionAr: 'كيلو',
            price: 14,
            stock: 95,
            imgSeed: 'car-e',
        },
        {
            branchId: branchEast.id,
            categoryId: catBev.id,
            nameAr: 'شاي أخضر مع ليمون',
            descriptionAr: 'عبوة ٢٠ فتلة',
            price: 48,
            stock: 60,
            imgSeed: 'tea-e',
        },
        {
            branchId: branchEast.id,
            categoryId: catMeat.id,
            nameAr: 'كبدة دجاج طازجة ٥٠٠ غ',
            descriptionAr: 'مغسولة وجاهزة',
            price: 55,
            stock: 30,
            imgSeed: 'liv-e',
        },
        {
            branchId: branchEast.id,
            categoryId: catFrozen.id,
            nameAr: 'آيس كريم فانيليا ١ لتر',
            descriptionAr: 'مجمد',
            price: 75,
            stock: 40,
            imgSeed: 'ice-e',
        },
        {
            branchId: branchEast.id,
            categoryId: catPantry.id,
            nameAr: 'معكرونة سباغيتي ٥٠٠ غ',
            descriptionAr: 'إيطالية',
            price: 28,
            stock: 100,
            imgSeed: 'pas-e',
        },
        {
            branchId: branchEast.id,
            categoryId: catSnacks.id,
            nameAr: 'مكسرات مشكلة ٢٥٠ غ',
            descriptionAr: 'محمصة',
            price: 95,
            stock: 45,
            imgSeed: 'nuts-e',
        },
    ];
    const productIdByName = new Map();
    for (const p of productRows) {
        const imageUrl = food_images_1.FOOD_IMAGES[p.imgSeed] ?? '';
        const existing = await prisma.product.findFirst({
            where: { branchId: p.branchId, nameAr: p.nameAr },
        });
        if (existing) {
            await prisma.product.update({
                where: { id: existing.id },
                data: { imageUrl },
            });
            productIdByName.set(`${p.branchId}::${p.nameAr}`, existing.id);
            continue;
        }
        const created = await prisma.product.create({
            data: {
                branchId: p.branchId,
                categoryId: p.categoryId,
                nameAr: p.nameAr,
                descriptionAr: p.descriptionAr,
                price: new client_1.Prisma.Decimal(p.price),
                stock: p.stock,
                imageUrl,
                isActive: true,
            },
        });
        productIdByName.set(`${p.branchId}::${p.nameAr}`, created.id);
    }
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@demo.com' },
        create: {
            email: 'superadmin@demo.com',
            passwordHash: password,
            name: 'مدير عام',
            phone: '01001110001',
            role: client_1.Role.SUPER_ADMIN,
        },
        update: { passwordHash: password },
    });
    const admin = await prisma.user.upsert({
        where: { email: 'admin@demo.com' },
        create: {
            email: 'admin@demo.com',
            passwordHash: password,
            name: 'إدارة',
            phone: '01001110002',
            role: client_1.Role.ADMIN,
        },
        update: { passwordHash: password },
    });
    await prisma.user.upsert({
        where: { email: 'manager.north@demo.com' },
        create: {
            email: 'manager.north@demo.com',
            passwordHash: password,
            name: 'مدير فرع الشمال',
            phone: '01001110003',
            role: client_1.Role.BRANCH_MANAGER,
            branchId: branchNorth.id,
        },
        update: { passwordHash: password, branchId: branchNorth.id },
    });
    const driverUser = await prisma.user.upsert({
        where: { email: 'driver@demo.com' },
        create: {
            email: 'driver@demo.com',
            passwordHash: password,
            name: 'سائق توصيل',
            phone: '01002220001',
            role: client_1.Role.DRIVER,
        },
        update: { passwordHash: password },
    });
    const driver2 = await prisma.user.upsert({
        where: { email: 'driver2@demo.com' },
        create: {
            email: 'driver2@demo.com',
            passwordHash: password,
            name: 'سائق فرع الجنوب',
            phone: '01002220002',
            role: client_1.Role.DRIVER,
        },
        update: { passwordHash: password },
    });
    await prisma.driverProfile.upsert({
        where: { userId: driverUser.id },
        create: {
            userId: driverUser.id,
            vehicleInfo: 'موتوسيكل',
            branchId: branchNorth.id,
        },
        update: { branchId: branchNorth.id },
    });
    await prisma.driverProfile.upsert({
        where: { userId: driver2.id },
        create: {
            userId: driver2.id,
            vehicleInfo: 'فان صغيرة',
            branchId: branchSouth.id,
        },
        update: { branchId: branchSouth.id },
    });
    const customer = await prisma.user.upsert({
        where: { email: 'customer@demo.com' },
        create: {
            email: 'customer@demo.com',
            passwordHash: password,
            name: 'عميل تجريبي',
            phone: '01003330001',
            role: client_1.Role.CUSTOMER,
        },
        update: { passwordHash: password },
    });
    await prisma.ad.deleteMany({});
    await prisma.ad.createMany({
        data: [
            {
                titleAr: 'خصم ١٠٪ على الألبان هذا الأسبوع',
                imageUrl: food_images_1.AD_IMAGES.dairy,
                linkUrl: '/products',
                branchId: null,
                sortOrder: 0,
                isActive: true,
            },
            {
                titleAr: 'فواكه طازجة يوميًا',
                imageUrl: food_images_1.AD_IMAGES.fruit,
                linkUrl: '/products',
                branchId: branchNorth.id,
                sortOrder: 1,
                isActive: true,
            },
            {
                titleAr: 'توصيل سريع لباب بيتك',
                imageUrl: food_images_1.AD_IMAGES.delivery,
                linkUrl: '/checkout',
                branchId: null,
                sortOrder: 2,
                isActive: true,
            },
            {
                titleAr: 'مخبوزات الفرن الطازجة',
                imageUrl: food_images_1.AD_IMAGES.bakery,
                linkUrl: '/products',
                branchId: branchSouth.id,
                sortOrder: 3,
                isActive: true,
            },
        ],
    });
    const milkId = productIdByName.get(`${branchNorth.id}::حليب كامل الدسم ١ لتر`) ??
        (await prisma.product.findFirst({
            where: { branchId: branchNorth.id, nameAr: 'حليب كامل الدسم ١ لتر' },
        }))?.id;
    const breadId = productIdByName.get(`${branchNorth.id}::خبز بلدي طازج`) ??
        (await prisma.product.findFirst({
            where: { branchId: branchNorth.id, nameAr: 'خبز بلدي طازج' },
        }))?.id;
    const tomId = productIdByName.get(`${branchNorth.id}::طماطم بلدي`) ??
        (await prisma.product.findFirst({
            where: { branchId: branchNorth.id, nameAr: 'طماطم بلدي' },
        }))?.id;
    if (milkId && breadId && tomId) {
        await prisma.cartItem.deleteMany({ where: { userId: customer.id } });
        await prisma.cartItem.createMany({
            data: [
                { userId: customer.id, productId: milkId, quantity: 2 },
                { userId: customer.id, productId: breadId, quantity: 5 },
                { userId: customer.id, productId: tomId, quantity: 1 },
            ],
        });
    }
    const demoOrders = [
        {
            orderNumber: 'DEMO-ORDER-1',
            status: client_1.OrderStatus.DELIVERED,
            subtotal: 45,
            total: 60,
            driverId: driverUser.id,
            cod: true,
        },
        {
            orderNumber: 'DEMO-ORDER-2',
            status: client_1.OrderStatus.OUT_FOR_DELIVERY,
            subtotal: 120,
            total: 135,
            driverId: driverUser.id,
            cod: false,
        },
        {
            orderNumber: 'DEMO-ORDER-3',
            status: client_1.OrderStatus.READY,
            subtotal: 88,
            total: 103,
            driverId: null,
            cod: false,
        },
        {
            orderNumber: 'DEMO-ORDER-4',
            status: client_1.OrderStatus.PREPARING,
            subtotal: 55,
            total: 70,
            driverId: null,
            cod: false,
        },
        {
            orderNumber: 'DEMO-ORDER-5',
            status: client_1.OrderStatus.CONFIRMED,
            subtotal: 95,
            total: 110,
            driverId: null,
            cod: false,
        },
        {
            orderNumber: 'DEMO-ORDER-6',
            status: client_1.OrderStatus.PENDING,
            subtotal: 36,
            total: 51,
            driverId: null,
            cod: false,
        },
    ];
    for (const d of demoOrders) {
        const exists = await prisma.order.findFirst({
            where: { orderNumber: d.orderNumber },
        });
        if (exists)
            continue;
        const pMilk = await prisma.product.findFirst({
            where: { branchId: branchNorth.id, nameAr: 'حليب كامل الدسم ١ لتر' },
        });
        const pBread = await prisma.product.findFirst({
            where: { branchId: branchNorth.id, nameAr: 'خبز بلدي طازج' },
        });
        if (!pMilk || !pBread)
            continue;
        const sub = new client_1.Prisma.Decimal(d.subtotal);
        const fee = new client_1.Prisma.Decimal(15);
        const tot = new client_1.Prisma.Decimal(d.total);
        await prisma.order.create({
            data: {
                orderNumber: d.orderNumber,
                userId: customer.id,
                branchId: branchNorth.id,
                status: d.status,
                subtotal: sub,
                deliveryFee: fee,
                loyaltyDiscount: new client_1.Prisma.Decimal(0),
                total: tot,
                deliveryAddress: 'مدينة نصر — الحي السابع — عمارة ١٢',
                deliveryPhone: customer.phone ?? '01003330001',
                driverId: d.driverId,
                codCollected: d.cod,
                items: {
                    create: [
                        {
                            productId: pMilk.id,
                            quantity: 1,
                            unitPrice: pMilk.price,
                            nameSnapshot: pMilk.nameAr,
                        },
                        {
                            productId: pBread.id,
                            quantity: 2,
                            unitPrice: pBread.price,
                            nameSnapshot: pBread.nameAr,
                        },
                    ],
                },
            },
        });
    }
    const o1 = await prisma.order.findFirst({
        where: { orderNumber: 'DEMO-ORDER-1' },
    });
    if (o1) {
        const hasEarn = await prisma.loyaltyTransaction.findFirst({
            where: { orderId: o1.id, type: client_1.LoyaltyType.EARN },
        });
        if (!hasEarn) {
            await prisma.loyaltyTransaction.create({
                data: {
                    userId: customer.id,
                    type: client_1.LoyaltyType.EARN,
                    points: 6,
                    balanceAfter: 6,
                    description: 'نقاط من الطلب DEMO-ORDER-1',
                    orderId: o1.id,
                },
            });
        }
    }
    void superAdmin;
    void admin;
}
main()
    .then(() => {
    console.log('Seed OK — branches, products, ads, cart & demo orders');
})
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map