import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LogoutPage from '../LogoutPage/LogoutPage';  // Adjust the path accordingly

describe('LogoutPage component', () => {
  it('renders without crashing', () => {
    render(<LogoutPage />);
  });

  it('calls onLogout prop when the logout button is clicked', () => {
    // Mock the onLogout function
    const onLogoutMock = jest.fn();

    // Render the component with the mocked function
    const { getByText } = render(<LogoutPage onLogout={onLogoutMock} />);

    // Simulate a button click
    fireEvent.click(getByText('Logout'));

    // Check if the onLogout function was called
    expect(onLogoutMock).toHaveBeenCalledTimes(1);
  });
});
