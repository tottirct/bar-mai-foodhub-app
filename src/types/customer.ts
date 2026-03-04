export interface SelectedOption {
    optionId: number;
    name: string;
    price: number;
}

export interface OrderItem {
    menuId: number;
    menuName: string;
    price: number;
    quantity: number;
    selectedOptions: SelectedOption[];
    specialNote?: string | null;
}

export interface Order {
    id: number;
    userId: number;
    shopId: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    shop: { name: string };
    items: OrderItem[];
    note?: string | null;
}

export interface Shop {
    id: number;
    name: string;
    description: string | null;
    isOpen: boolean;
    queueCount: number;
    category?: string;
    imageUrl?: string;
}

export interface Transaction {
    id: string;
    userId: number;
    action: string;
    description: string;
    metadata: {
        amount?: number;
        totalPrice?: number;
        shopId?: number;
        shopName?: string;
        orderId?: number;
    };
    createdAt: string;
}

export interface WalletData {
    wallet: number;
    transactions: Transaction[];
}

export interface Menu {
    id: number;
    name: string;
    price: number;
    shopId: number;
    imageUrl?: string;
    isAvailable: boolean;
}


export interface MenuOption {
    id: number;
    name: string;
    price: number;
    menuId: number;
}

export interface MenuDetail extends Menu {
    options: MenuOption[];
    shop: { name: string };
}

