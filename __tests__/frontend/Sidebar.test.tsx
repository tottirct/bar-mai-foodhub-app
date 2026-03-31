import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '@/components/Sidebar';
import { SessionProvider } from 'next-auth/react';

// mock next/navigation
vi.mock('next/navigation', () => ({
    usePathname: vi.fn(() => '/customer'),
}));

// ข้อมูลจริงจาก customer layout
const mockItems = [
    { label: 'หน้าแรก', href: '/customer', icon: 'Home' },
    { label: 'เครดิต', href: '/customer/credit', icon: 'Wallet' },
    { label: 'ข้อมูล', href: '/customer/information', icon: 'Info' },
    { label: 'รถเข็น', href: '/customer/trolley', icon: 'ShoppingCart' },
];  

const mockSession = {
    user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'CUSTOMER',
    },
    expires: '2067-12-31',
};

function renderSidebar(session: any = mockSession, items = mockItems) {
    return render(
        <SessionProvider session={session}>
            <Sidebar items={items} />
        </SessionProvider>
    );
}

describe('Sidebar', () => {

    it('renders welcome text', () => { // test welcome text
        renderSidebar();
        expect(screen.getByText('ยินดีต้อนรับ')).toBeInTheDocument();
    });

    it('renders user name from session', () => { // test user name
        renderSidebar();
        expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('renders all menu items', () => { // test menu items
        renderSidebar();
        expect(screen.getByText('หน้าแรก')).toBeInTheDocument();
        expect(screen.getByText('เครดิต')).toBeInTheDocument();
        expect(screen.getByText('ข้อมูล')).toBeInTheDocument();
        expect(screen.getByText('รถเข็น')).toBeInTheDocument();
    });

    it('renders correct links for menu items', () => { // test links
        renderSidebar();
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(4);
        expect(links[0]).toHaveAttribute('href', '/customer');
        expect(links[1]).toHaveAttribute('href', '/customer/credit');
        expect(links[2]).toHaveAttribute('href', '/customer/information');
        expect(links[3]).toHaveAttribute('href', '/customer/trolley');
    });

    it('highlights the active menu item', () => { // test active state
        renderSidebar();
        const activeLink = screen.getByText('หน้าแรก').closest('a');
        expect(activeLink?.className).toContain('bg-green-100');
        expect(activeLink?.className).toContain('text-green-600');
    });

    it('does not highlight inactive menu items', () => { // test inactive state
        renderSidebar();
        const inactiveLink = screen.getByText('เครดิต').closest('a');
        expect(inactiveLink?.className).toContain('text-gray-500');
        expect(inactiveLink?.className).not.toContain('bg-green-100 text-green-600');
    });

    it('renders a button when item has onClick', () => { // test onClick item
        const onClickMock = vi.fn();
        const itemsWithClick = [
            ...mockItems,
            { label: 'ออกจากระบบ', href: '#', icon: 'LogOut', onClick: onClickMock },
        ];
        renderSidebar(mockSession, itemsWithClick);
        const logoutButton = screen.getByText('ออกจากระบบ');
        expect(logoutButton.closest('button')).toBeInTheDocument();
    });

    it('calls onClick when button item is clicked', () => { // test onClick callback
        const onClickMock = vi.fn();
        const itemsWithClick = [
            { label: 'ออกจากระบบ', href: '#', icon: 'LogOut', onClick: onClickMock },
        ];
        renderSidebar(mockSession, itemsWithClick);
        fireEvent.click(screen.getByText('ออกจากระบบ'));
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('renders nothing when session is loading', async () => { // test loading state
        const nextAuth = await import('next-auth/react');
        const useSessionSpy = vi.spyOn(nextAuth, 'useSession').mockReturnValue({
            data: null,
            status: 'loading',
            update: vi.fn(),
        });

        const { container } = render(
            <SessionProvider session={null}>
                <Sidebar items={mockItems} />
            </SessionProvider>
        );
        // when status is loading, component returns null
        expect(container.innerHTML).toBe('');

        useSessionSpy.mockRestore();
    });

});
