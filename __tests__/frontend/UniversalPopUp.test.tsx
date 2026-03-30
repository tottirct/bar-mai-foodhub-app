import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UniversalPopUp from '@/components/UniversalPopUp';

describe('UniversalPopUp', () => {

    it('should not render anything when isOpen is false', () => { //test not open

        const { container } = render(
            <UniversalPopUp
                isOpen={false}           
                onClose={() => {}}       
                title="Test Popup"       
            >
                <p>Test123</p>
            </UniversalPopUp>
        );

        expect(container.innerHTML).toBe('');
    });

    it('should render content when isOpen is true', () => { // test open
        const { container } = render(
            <UniversalPopUp
                isOpen={true}
                onClose={() => { }}
                title="Test Popup"
            >
                <p>Test123</p>
            </UniversalPopUp>
        );
        expect(container.innerHTML).not.toBe('');
    });

    it('should display the title correctly', () => { // test display title
        const { getByText } = render(
            <UniversalPopUp
                isOpen={true}
                onClose={() => { }}
                title="Test Popup"
            >
                <p>Test123</p>
            </UniversalPopUp>
        );
        expect(getByText('Test Popup')).toBeInTheDocument();
    });

    it('should display children content', () => { // test display children content
        const { getByText } = render(
            <UniversalPopUp
                isOpen={true}
                onClose={() => { }}
                title="Test Popup"
            >
                <p>Test123</p>
            </UniversalPopUp>
        );
        expect(getByText('Test123')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => { // test close button
        const onCloseMock = vi.fn();
        const { getByText } = render(
            <UniversalPopUp
                isOpen={true}
                onClose={onCloseMock}
                title="Test Popup"
            >
                <p>Test123</p>
            </UniversalPopUp>
        );
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

});