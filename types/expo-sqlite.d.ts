declare module 'expo-sqlite' {
  import { ComponentType, ReactNode } from 'react';
  export interface SQLiteDatabase {
    getFirstAsync<T>(sql: string, ...params: (string | number)[]): Promise<T | null>;
    getFirstSync<T>(sql: string, ...params: (string | number)[]): T | null;
    getAllSync<T>(sql: string, ...params: (string | number)[]): T[];
  }
  export const SQLiteProvider: ComponentType<{
    databaseName: string;
    assetSource?: { assetId: number; forceImport?: boolean };
    children?: ReactNode;
    onInit?: (database: SQLiteDatabase) => Promise<void>;
    useSuspense?: boolean;
  }>;
}
