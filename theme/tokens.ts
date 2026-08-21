import { Platform } from 'react-native';

export const colors = { background: '#FFFFFF', surface: '#F7F7F5', ink: '#151515', muted: '#70706D', border: '#E8E7E2', gold: '#AE9360', black: '#111111', white: '#FFFFFF' } as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, huge: 48 } as const;
export const radius = { sm: 8, md: 14, lg: 22, pill: 999 } as const;
export const sizes = { contentMax: 680, tabBar: 68, icon: 22, touch: 48 } as const;
export const typography = { display: { fontSize: 34, lineHeight: 41, fontWeight: '600' as const }, title: { fontSize: 26, lineHeight: 32, fontWeight: '600' as const }, heading: { fontSize: 19, lineHeight: 25, fontWeight: '600' as const }, body: { fontSize: 16, lineHeight: 25, fontWeight: '400' as const }, caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const }, verse: { fontSize: 25, lineHeight: 37, fontWeight: '400' as const } };
export const shadows = { card: Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } }, android: { elevation: 2 }, default: {} }) };
