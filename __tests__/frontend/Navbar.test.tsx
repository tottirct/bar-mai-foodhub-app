import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from '@/components/Navbar';
import { SessionProvider } from 'next-auth/react';

describe('Navbar', () => {
    it('renders the navbar', () => { // test render navbar
        render(
            <SessionProvider session={null}>
                <Navbar />
            </SessionProvider>
        );
        expect(screen.getByText('บาร์ใหม่')).toBeInTheDocument();
    });

    it('renders register button when not logged in', () => { // test register buttons
        render(
            <SessionProvider session={null}>
                <Navbar />
            </SessionProvider>
        );
        expect(screen.getByText('ลงทะเบียน')).toBeInTheDocument();
    });

    it('renders login button when not logged in', () => { // test login button
        render(
            <SessionProvider session={null}>
                <Navbar />
            </SessionProvider>
        );
        expect(screen.getByText('เข้าสู่ระบบ')).toBeInTheDocument();
    });

    it('renders logout button when logged in', () => { // test logout button
        const session = {
            user: {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                role: 'CUSTOMER',
            },
            expires: '2067-12-31',
        };
        render(
            <SessionProvider session={session}>
                <Navbar />
            </SessionProvider>
        );
        expect(screen.getByText('ออกจากระบบ')).toBeInTheDocument();
    });
});