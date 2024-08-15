import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { frontenSecrets } from '../../api';
import { Secret } from '../../app-types/secret.type';

// Mock the frontenSecrets function
jest.mock('../../api', () => ({
  frontenSecrets: jest.fn(),
}));

describe("LoginPage", () => {
  describe("when secret is not available", () => {
    it("should display LoadingSpinner and login-screen on first render", () => {
      (frontenSecrets as jest.Mock).mockResolvedValue(null);

      render(
        <MemoryRouter initialEntries={["/login"]}>
          <LoginPage />
        </MemoryRouter>
      );

      expect(screen.getByTestId("login-screen-loading")).toBeInTheDocument();
    });
  });

  describe("when secret is available", () => {
    it("should display login button", async () => {
      const mockSecret: Secret = {
        APP_FE_AUTHORITY: "",
        APP_FE_REDIRECTURI: "",
        APP_FE_TANENTID: "",
        APP_FE_CLIENTID: ""
      };
      (frontenSecrets as jest.Mock).mockResolvedValue(mockSecret);

      render(
        <MemoryRouter initialEntries={["/login"]}>
          <LoginPage />
        </MemoryRouter>
      );

      await waitFor(() => {
        const elements = screen.getAllByText('PTT Public Company Limited');
        expect(elements.length).toBeGreaterThan(0); // Check that we found the elements
      });
    });
  });
});