// life-calendar-app/jest.setup.js
import '@testing-library/jest-dom';
import 'jest-localstorage-mock'; // For mocking localStorage in store tests

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/', // Or whatever default pathname makes sense
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));
