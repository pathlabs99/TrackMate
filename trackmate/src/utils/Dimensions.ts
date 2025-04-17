// Use browser window dimensions instead of react-native
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

// Add event listener to update dimensions on resize
window.addEventListener('resize', () => {
  // This is a simple approach - in a real app you might want to use
  // a more sophisticated approach with React state/context
  console.log('Window resized');
});

export const width = {
  sm: windowWidth * 0.4,    // 40% of screen width
  md: windowWidth * 0.6,    // 60% of screen width
  lg: windowWidth * 0.8,    // 80% of screen width
  xl: windowWidth * 0.9,    // 90% of screen width
  full: windowWidth,        // full screen width
};

export const height = {
  sm: windowHeight * 0.3,   // 30% of screen height
  md: windowHeight * 0.5,   // 50% of screen height
  lg: windowHeight * 0.7,   // 70% of screen height
  xl: windowHeight * 0.9,   // 90% of screen height
  full: windowHeight,       // full screen height
};

// Font sizes that scale with screen size
export const fontSize = {
  xs: Math.max(12, windowWidth * 0.02),      // minimum 12px
  sm: Math.max(14, windowWidth * 0.025),     // minimum 14px
  md: Math.max(16, windowWidth * 0.03),      // minimum 16px
  lg: Math.max(20, windowWidth * 0.035),     // minimum 20px
  xl: Math.max(24, windowWidth * 0.04),      // minimum 24px
  xxl: Math.max(32, windowWidth * 0.05),     // minimum 32px
};

// Spacing values that scale with screen size
export const spacing = {
  xs: Math.max(4, windowWidth * 0.01),       // minimum 4px
  sm: Math.max(8, windowWidth * 0.015),      // minimum 8px
  md: Math.max(16, windowWidth * 0.02),      // minimum 16px
  lg: Math.max(24, windowWidth * 0.03),      // minimum 24px
  xl: Math.max(32, windowWidth * 0.04),      // minimum 32px
  xxl: Math.max(48, windowWidth * 0.05),     // minimum 48px
};

// Breakpoints for responsive design
export const breakpoints = {
  sm: 640,    // Small devices
  md: 768,    // Medium devices
  lg: 1024,   // Large devices
  xl: 1280,   // Extra large devices
  xxl: 1536,  // 2XL devices
};
