export class SafeStorage {
  static get<T>(key: string, fallback: T): T {
    try {
      if (typeof window === 'undefined') return fallback;
      const item = localStorage.getItem(key);
      if (item === null) return fallback;
      const parsed = JSON.parse(item) as unknown;
      return parsed as T;
    } catch (error) {
      console.error(`SafeStorage error reading ${key}:`, error);
      return fallback;
    }
  }
  
  static set(key: string, value: unknown): boolean {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`SafeStorage error writing ${key}:`, error);
      return false;
    }
  }
  
  static remove(key: string): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`SafeStorage error removing ${key}:`, error);
    }
  }
}
