// src/lib/mockData.ts
// Mock Data ตาม Database Schema (Prisma MySQL + MongoDB)

// ============================================================
// 📌 TypeScript Types (ตาม Prisma Schema)
// ============================================================

export type Role = "CUSTOMER" | "OWNER" | "ADMIN";

export interface User {
    id: number;
    email: string;
    name: string;
    wallet: number;
    role: Role;
}

export interface Shop {
    id: number;
    name: string;
    description: string | null;
    ownerId: number;
    // UI-specific fields (ไม่ได้อยู่ใน DB แต่ Frontend ต้องใช้)
    imageUrl: string;
    category: string;
    isOpen: boolean;
}

export interface MenuOption {
    id: number;
    name: string;
    price: number;
    menuId: number;
}

export interface Menu {
    id: number;
    name: string;
    price: number;
    shopId: number;
    // UI-specific
    imageUrl: string;
    isAvailable: boolean;
    // Relations
    options: MenuOption[];
}

export interface Order {
    id: number;
    userId: number;
    shopId: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    mongoOrderId: string | null;
}

// --- MongoDB Models ---

export interface SelectedOption {
    optionId: number;
    name: string;
    price: number;
}

export interface Item {
    menuId: number;
    menuName: string;
    price: number;
    quantity: number;
    selectedOptions: SelectedOption[];
    specialNote: string | null;
}

export interface OrderDetail {
    id: string;
    mysqlOrderId: number;
    items: Item[];
    note: string | null;
    createdAt: string;
}

export interface ActivityLog {
    id: string;
    userId: number;
    userRole: string;
    action: string;
    description: string;
    metadata: Record<string, unknown> | null;
    createdAt: string;
}

// ============================================================
// 👤 Users
// ============================================================

export const mockUsers: User[] = [
    {
        id: 1,
        email: "nisit@ku.th",
        name: "นิสิต หิวข้าว",
        wallet: 250.0,
        role: "CUSTOMER",
    },
    {
        id: 2,
        email: "somchai@ku.th",
        name: "สมชาย ใจดี",
        wallet: 1200.0,
        role: "CUSTOMER",
    },
    {
        id: 3,
        email: "patim@barmai.com",
        name: "ป้าติ๋ม แซ่ลิ้ม",
        wallet: 8500.0,
        role: "OWNER",
    },
    {
        id: 4,
        email: "lungchai@barmai.com",
        name: "ลุงชัย อยุธยา",
        wallet: 6200.0,
        role: "OWNER",
    },
    {
        id: 5,
        email: "admin@barmai.com",
        name: "แอดมิน ผู้ดูแล",
        wallet: 0.0,
        role: "ADMIN",
    },
];

// ผู้ใช้ที่ล็อกอินอยู่ตอนนี้
export const mockCurrentUser: User = mockUsers[0];

// ============================================================
// 🏪 Shops
// ============================================================

export const mockShops: Shop[] = [
    {
        id: 1,
        name: "ร้านป้าติ๋ม อาหารตามสั่ง",
        description: "อาหารตามสั่งรสเด็ด ถูกปากนิสิต",
        ownerId: 3,
        imageUrl: "/images/default-menu.jpg",
        category: "อาหารจานเดียว",
        isOpen: true,
    },
    {
        id: 2,
        name: "เตี๋ยวเรือ อยุธยา (ลุงชัย)",
        description: "ก๋วยเตี๋ยวเรือรสต้นตำรับ น้ำซุปเข้มข้น",
        ownerId: 4,
        imageUrl: "/images/default-menu.jpg",
        category: "ก๋วยเตี๋ยว",
        isOpen: true,
    },
    {
        id: 3,
        name: "Freshy น้ำปั่น",
        description: "น้ำปั่นผลไม้สด สูตรเฉพาะ",
        ownerId: 3,
        imageUrl: "/images/default-menu.jpg",
        category: "เครื่องดื่ม",
        isOpen: false,
    },
    {
        id: 4,
        name: "ข้าวมันไก่ เจ๊กวง",
        description: "ข้าวมันไก่สูตรเด็ด หนังกรอบ น้ำจิ้มรสแซ่บ",
        ownerId: 4,
        imageUrl: "/images/default-menu.jpg",
        category: "อาหารจานเดียว",
        isOpen: true,
    },
];

// ============================================================
// 🍽️ MenuOptions
// ============================================================

export const mockMenuOptions: MenuOption[] = [
    // Options สำหรับ ข้าวกะเพราหมูสับ (menuId: 1)
    { id: 1, name: "ไข่ดาว", price: 10, menuId: 1 },
    { id: 2, name: "ไข่เจียว", price: 12, menuId: 1 },
    { id: 3, name: "เพิ่มข้าว", price: 5, menuId: 1 },
    // Options สำหรับ ข้าวผัดหมู (menuId: 2)
    { id: 4, name: "ไข่ดาว", price: 10, menuId: 2 },
    { id: 5, name: "เพิ่มข้าว", price: 5, menuId: 2 },
    // Options สำหรับ ก๋วยเตี๋ยวเรือหมู (menuId: 3)
    { id: 6, name: "เพิ่มลูกชิ้น", price: 10, menuId: 3 },
    { id: 7, name: "เพิ่มหมูสับ", price: 15, menuId: 3 },
    { id: 8, name: "เส้นใหญ่", price: 0, menuId: 3 },
    { id: 9, name: "เส้นเล็ก", price: 0, menuId: 3 },
    // Options สำหรับ ต้มยำเรือ (menuId: 4)
    { id: 10, name: "เพิ่มลูกชิ้น", price: 10, menuId: 4 },
    // Options สำหรับ ชาไทยเย็น (menuId: 5)
    { id: 11, name: "เพิ่มวิปครีม", price: 10, menuId: 5 },
    { id: 12, name: "เพิ่มไข่มุก", price: 15, menuId: 5 },
    // Options สำหรับ ข้าวมันไก่ (menuId: 7)
    { id: 13, name: "เพิ่มไก่", price: 15, menuId: 7 },
    { id: 14, name: "น้ำซุป", price: 5, menuId: 7 },
    { id: 15, name: "ไข่ต้ม", price: 8, menuId: 7 },
];

// ============================================================
// 📋 Menus (พร้อม options ที่ embed ไว้เพื่อ Frontend ใช้งานง่าย)
// ============================================================

export const mockMenus: Menu[] = [
    // --- ร้านป้าติ๋ม (shopId: 1) ---
    {
        id: 1,
        name: "ข้าวกะเพราหมูสับ",
        price: 40,
        shopId: 1,
        imageUrl: "/images/default-menu.jpg",
        isAvailable: true,
        options: mockMenuOptions.filter((o) => o.menuId === 1),
    },
    {
        id: 2,
        name: "ข้าวผัดหมู",
        price: 45,
        shopId: 1,
        imageUrl: "/images/default-menu.jpg",
        isAvailable: true,
        options: mockMenuOptions.filter((o) => o.menuId === 2),
    },

    // --- เตี๋ยวเรือ อยุธยา (shopId: 2) ---
    {
        id: 3,
        name: "ก๋วยเตี๋ยวเรือหมู",
        price: 15,
        shopId: 2,
        imageUrl: "/images/default-menu.jpg",
        isAvailable: true,
        options: mockMenuOptions.filter((o) => o.menuId === 3),
    },
    {
        id: 4,
        name: "ต้มยำเรือ",
        price: 20,
        shopId: 2,
        imageUrl: "/images/default-menu.jpg",
        isAvailable: true,
        options: mockMenuOptions.filter((o) => o.menuId === 4),
    },

    // --- Freshy น้ำปั่น (shopId: 3) ---
    {
        id: 5,
        name: "ชาไทยเย็น",
        price: 25,
        shopId: 3,
        imageUrl: "/images/default-menu.jpg",
        isAvailable: true,
        options: mockMenuOptions.filter((o) => o.menuId === 5),
    },
    {
        id: 6,
        name: "โกโก้ปั่น",
        price: 35,
        shopId: 3,
        imageUrl: "/images/default-menu.jpg",
        isAvailable: true,
        options: [],
    },

    // --- ข้าวมันไก่ เจ๊กวง (shopId: 4) ---
    {
        id: 7,
        name: "ข้าวมันไก่",
        price: 45,
        shopId: 4,
        imageUrl: "/images/default-menu.jpg",
        isAvailable: true,
        options: mockMenuOptions.filter((o) => o.menuId === 7),
    },
    {
        id: 8,
        name: "ข้าวมันไก่ทอด",
        price: 50,
        shopId: 4,
        imageUrl: "/images/default-menu.jpg",
        isAvailable: true,
        options: [],
    },
];

// ============================================================
// 🧾 Orders (MySQL)
// ============================================================

export const mockOrders: Order[] = [
    {
        id: 1,
        userId: 1,
        shopId: 1,
        totalPrice: 62,
        status: "COMPLETED",
        createdAt: "2026-02-21T10:30:00.000Z",
        mongoOrderId: "65a1b2c3d4e5f6a7b8c9d0e1",
    },
    {
        id: 2,
        userId: 1,
        shopId: 2,
        totalPrice: 40,
        status: "COMPLETED",
        createdAt: "2026-02-21T11:15:00.000Z",
        mongoOrderId: "65a1b2c3d4e5f6a7b8c9d0e2",
    },
    {
        id: 3,
        userId: 2,
        shopId: 1,
        totalPrice: 45,
        status: "PREPARING",
        createdAt: "2026-02-21T12:00:00.000Z",
        mongoOrderId: "65a1b2c3d4e5f6a7b8c9d0e3",
    },
    {
        id: 4,
        userId: 1,
        shopId: 4,
        totalPrice: 68,
        status: "PENDING",
        createdAt: "2026-02-21T12:30:00.000Z",
        mongoOrderId: "65a1b2c3d4e5f6a7b8c9d0e4",
    },
];

// ============================================================
// 📦 OrderDetails (MongoDB)
// ============================================================

export const mockOrderDetails: OrderDetail[] = [
    {
        id: "65a1b2c3d4e5f6a7b8c9d0e1",
        mysqlOrderId: 1,
        items: [
            {
                menuId: 1,
                menuName: "ข้าวกะเพราหมูสับ",
                price: 40,
                quantity: 1,
                selectedOptions: [
                    { optionId: 1, name: "ไข่ดาว", price: 10 },
                    { optionId: 3, name: "เพิ่มข้าว", price: 5 },
                ],
                specialNote: "เผ็ดน้อย ไม่ใส่ผักชี",
            },
        ],
        note: null,
        createdAt: "2026-02-21T10:30:00.000Z",
    },
    {
        id: "65a1b2c3d4e5f6a7b8c9d0e2",
        mysqlOrderId: 2,
        items: [
            {
                menuId: 3,
                menuName: "ก๋วยเตี๋ยวเรือหมู",
                price: 15,
                quantity: 2,
                selectedOptions: [
                    { optionId: 6, name: "เพิ่มลูกชิ้น", price: 10 },
                ],
                specialNote: null,
            },
        ],
        note: "ขอช้อนส้อมด้วยครับ",
        createdAt: "2026-02-21T11:15:00.000Z",
    },
    {
        id: "65a1b2c3d4e5f6a7b8c9d0e3",
        mysqlOrderId: 3,
        items: [
            {
                menuId: 2,
                menuName: "ข้าวผัดหมู",
                price: 45,
                quantity: 1,
                selectedOptions: [],
                specialNote: "ไม่ใส่หอมใหญ่",
            },
        ],
        note: null,
        createdAt: "2026-02-21T12:00:00.000Z",
    },
    {
        id: "65a1b2c3d4e5f6a7b8c9d0e4",
        mysqlOrderId: 4,
        items: [
            {
                menuId: 7,
                menuName: "ข้าวมันไก่",
                price: 45,
                quantity: 1,
                selectedOptions: [
                    { optionId: 13, name: "เพิ่มไก่", price: 15 },
                    { optionId: 15, name: "ไข่ต้ม", price: 8 },
                ],
                specialNote: null,
            },
        ],
        note: null,
        createdAt: "2026-02-21T12:30:00.000Z",
    },
];

// ============================================================
// 📊 ActivityLogs (MongoDB)
// ============================================================

export const mockActivityLogs: ActivityLog[] = [
    {
        id: "log_001",
        userId: 1,
        userRole: "CUSTOMER",
        action: "WALLET_TOPUP",
        description: "เติมเงินเข้าวอลเล็ต 500 บาท",
        metadata: { amount: 500, method: "PromptPay", beforeBalance: 0, afterBalance: 500 },
        createdAt: "2026-02-20T09:00:00.000Z",
    },
    {
        id: "log_002",
        userId: 1,
        userRole: "CUSTOMER",
        action: "ORDER_PLACED",
        description: "สั่งอาหารจากร้านป้าติ๋ม ข้าวกะเพราหมูสับ 62 บาท",
        metadata: { orderId: 1, shopId: 1, totalPrice: 62 },
        createdAt: "2026-02-21T10:30:00.000Z",
    },
    {
        id: "log_003",
        userId: 3,
        userRole: "OWNER",
        action: "ORDER_ACCEPTED",
        description: "ป้าติ๋มรับออเดอร์ #1",
        metadata: { orderId: 1 },
        createdAt: "2026-02-21T10:31:00.000Z",
    },
    {
        id: "log_004",
        userId: 3,
        userRole: "OWNER",
        action: "SHOP_INCOME",
        description: "ร้านป้าติ๋มได้รับเงิน 62 บาท จากออเดอร์ #1",
        metadata: { orderId: 1, amount: 62, shopId: 1 },
        createdAt: "2026-02-21T10:35:00.000Z",
    },
    {
        id: "log_005",
        userId: 5,
        userRole: "ADMIN",
        action: "LOGIN",
        description: "แอดมินเข้าสู่ระบบ",
        metadata: { ip: "192.168.1.100" },
        createdAt: "2026-02-21T08:00:00.000Z",
    },
    {
        id: "log_006",
        userId: 1,
        userRole: "CUSTOMER",
        action: "ORDER_PLACED",
        description: "สั่งก๋วยเตี๋ยวเรือจากร้านลุงชัย 40 บาท",
        metadata: { orderId: 2, shopId: 2, totalPrice: 40 },
        createdAt: "2026-02-21T11:15:00.000Z",
    },
];

// ============================================================
// 🔧 Helper Functions
// ============================================================

/** ดึงเมนูทั้งหมดของร้านค้า */
export const getMenusByShopId = (shopId: number): Menu[] =>
    mockMenus.filter((menu) => menu.shopId === shopId);

/** ดึงออเดอร์ทั้งหมดของผู้ใช้ */
export const getOrdersByUserId = (userId: number): Order[] =>
    mockOrders.filter((order) => order.userId === userId);

/** ดึงออเดอร์ทั้งหมดของร้านค้า */
export const getOrdersByShopId = (shopId: number): Order[] =>
    mockOrders.filter((order) => order.shopId === shopId);

/** ดึงรายละเอียดออเดอร์จาก Order ID (MySQL → MongoDB) */
export const getOrderDetail = (orderId: number): OrderDetail | undefined =>
    mockOrderDetails.find((detail) => detail.mysqlOrderId === orderId);

/** ดึงร้านค้าของเจ้าของ */
export const getShopsByOwnerId = (ownerId: number): Shop[] =>
    mockShops.filter((shop) => shop.ownerId === ownerId);

/** ดึง Activity Logs ของผู้ใช้ */
export const getLogsByUserId = (userId: number): ActivityLog[] =>
    mockActivityLogs.filter((log) => log.userId === userId);