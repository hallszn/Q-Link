/**
 * Q-Link Navigation Tests
 * 
 * Tests for tab navigation structure and configuration.
 * Due to Expo SDK 54+ runtime changes, these tests verify
 * module structure and configuration rather than full rendering.
 */

const fs = require('fs');
const path = require('path');

describe('TabNavigator Structure', () => {
  const navPath = path.resolve(__dirname, '../navigation/TabNavigator.js');
  let navContent;

  beforeAll(() => {
    navContent = fs.readFileSync(navPath, 'utf-8');
  });

  it('imports createBottomTabNavigator', () => {
    expect(navContent).toContain('createBottomTabNavigator');
  });

  it('defines all five tab screens', () => {
    const expectedTabs = ['Home', 'Professional', 'Social', 'Business', 'Verify'];
    expectedTabs.forEach((tab) => {
      expect(navContent).toContain(`name="${tab}"`);
    });
  });

  it('imports all screen components', () => {
    const expectedScreens = [
      'HomeScreen',
      'ProfessionalScreen',
      'SocialScreen',
      'BusinessScreen',
      'VerifyScreen',
    ];
    expectedScreens.forEach((screen) => {
      expect(navContent).toContain(screen);
    });
  });

  it('uses proper navigation styling', () => {
    expect(navContent).toContain('tabBarStyle');
    expect(navContent).toContain('tabBarActiveTintColor');
    expect(navContent).toContain('tabBarInactiveTintColor');
  });

  it('hides headers in tab screens', () => {
    expect(navContent).toContain('headerShown: false');
  });
});

describe('Screen Files Exist', () => {
  const screensDir = path.resolve(__dirname, '../screens');

  it('HomeScreen.js exists', () => {
    expect(fs.existsSync(path.join(screensDir, 'HomeScreen.js'))).toBe(true);
  });

  it('ProfessionalScreen.js exists', () => {
    expect(fs.existsSync(path.join(screensDir, 'ProfessionalScreen.js'))).toBe(true);
  });

  it('SocialScreen.js exists', () => {
    expect(fs.existsSync(path.join(screensDir, 'SocialScreen.js'))).toBe(true);
  });

  it('BusinessScreen.js exists', () => {
    expect(fs.existsSync(path.join(screensDir, 'BusinessScreen.js'))).toBe(true);
  });

  it('VerifyScreen.js exists', () => {
    expect(fs.existsSync(path.join(screensDir, 'VerifyScreen.js'))).toBe(true);
  });

  it('AuthScreen.js exists', () => {
    expect(fs.existsSync(path.join(screensDir, 'AuthScreen.js'))).toBe(true);
  });
});

describe('Tab Configuration', () => {
  it('tabs are configured with correct Q-Link theme colors', () => {
    const navPath = path.resolve(__dirname, '../navigation/TabNavigator.js');
    const navContent = fs.readFileSync(navPath, 'utf-8');
    
    // Q-Link uses cyan accent color
    expect(navContent).toMatch(/#00f5ff|cyan/i);
    // Dark background
    expect(navContent).toMatch(/#0a0a0f|#1a1a2e/);
  });
});
