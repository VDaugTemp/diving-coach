// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock framer-motion to avoid animation issues in tests
// Use forwardRef to properly handle refs and filter out animation props
jest.mock('framer-motion', () => {
  const React = require('react');
  const createMotionComponent = (Component) => {
    return React.forwardRef((props, ref) => {
      // Filter out all framer-motion specific props to avoid React warnings
      const {
        whileHover,
        whileTap,
        whileFocus,
        whileDrag,
        whileInView,
        initial,
        animate,
        exit,
        transition,
        variants,
        layout,
        layoutId,
        drag,
        dragConstraints,
        dragElastic,
        dragMomentum,
        onDrag,
        onDragStart,
        onDragEnd,
        ...restProps
      } = props;
      return React.createElement(Component, { ref, ...restProps });
    });
  };

  return {
    motion: {
      div: createMotionComponent('div'),
      button: createMotionComponent('button'),
      header: createMotionComponent('header'),
      span: createMotionComponent('span'),
      p: createMotionComponent('p'),
      h2: createMotionComponent('h2'),
      h3: createMotionComponent('h3'),
      h4: createMotionComponent('h4'),
    },
    AnimatePresence: ({ children }) => children,
  };
})

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock scrollIntoView for elements (used in ChatInterface)
Element.prototype.scrollIntoView = jest.fn()

// Mock crypto.randomUUID for session ID generation
global.crypto = {
  randomUUID: jest.fn(() => 'mock-uuid-' + Math.random().toString(36).substring(7)),
}

