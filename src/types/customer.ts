export interface SelectedOption {
    optionId: string;
    name: string;
    price: number;
}

export interface OrderItem {
    menuId: string;
    menuName: string;
    price: number;
    quantity: number;
    selectedOptions: SelectedOption[];
    specialNote?: string | null;
}

export interface Order {
    id: string;
    userId: string;
    shopId: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    shop: { name: string };
    items: OrderItem[];
    note?: string | null;
}

export interface Shop {
    id: string;
    name: string;
    description: string | null;
    isOpen: boolean;
    queueCount: number;
    category?: string;
    imageUrl?: string;
}

export interface Transaction {
    id: string;
    userId: string;
    action: string;
    description: string;
    metadata: {
        amount?: number;
        totalPrice?: number;
        shopId?: string;
        shopName?: string;
        orderId?: string;
    };
    createdAt: string;
}

export interface WalletData {
    wallet: number;
    transactions: Transaction[];
}

export interface Menu {
    id: string;
    name: string;
    price: number;
    shopId: string;
    imageUrl?: string;
    isAvailable: boolean;
}


export interface MenuOption {
    id: string;
    name: string;
    price: number;
    menuId: string;
}

export interface MenuDetail extends Menu {
    options: MenuOption[];
    shop: { name: string };
}

