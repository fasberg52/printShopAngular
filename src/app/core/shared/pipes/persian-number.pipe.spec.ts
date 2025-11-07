import { PersianNumberPipe } from './persian-number.pipe';

describe('PersianNumberPipe', () => {
  let pipe: PersianNumberPipe;

  beforeEach(() => {
    pipe = new PersianNumberPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Basic Number Conversion', () => {
    it('should convert Latin numbers to Persian', () => {
      expect(pipe.transform('123456')).toBe('۱۲۳۴۵۶');
      expect(pipe.transform('0987654321')).toBe('۰۹۸۷۶۵۴۳۲۱');
      expect(pipe.transform('42')).toBe('۴۲');
    });

    it('should convert numeric values to Persian', () => {
      expect(pipe.transform(123)).toBe('۱۲۳');
      expect(pipe.transform(0)).toBe('۰');
      expect(pipe.transform(999)).toBe('۹۹۹');
    });

    it('should handle decimal numbers', () => {
      expect(pipe.transform('123.45')).toBe('۱۲۳.۴۵');
      expect(pipe.transform(456.789)).toBe('۴۵۶.۷۸۹');
    });

    it('should handle numbers with commas', () => {
      expect(pipe.transform('1,234,567')).toBe('۱,۲۳۴,۵۶۷');
      expect(pipe.transform('10,000')).toBe('۱۰,۰۰۰');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null and undefined values', () => {
      expect(pipe.transform(null)).toBe('');
      expect(pipe.transform(undefined)).toBe('');
    });

    it('should handle empty string', () => {
      expect(pipe.transform('')).toBe('');
    });

    it('should handle mixed content', () => {
      expect(pipe.transform('Price: 1500 Toman')).toBe('Price: ۱۵۰۰ Toman');
      expect(pipe.transform('Order #12345')).toBe('Order #۱۲۳۴۵');
    });

    it('should handle already Persian numbers', () => {
      expect(pipe.transform('۱۲۳۴۵۶')).toBe('۱۲۳۴۵۶');
      expect(pipe.transform('۰۹۱۲')).toBe('۰۹۱۲');
    });
  });

  describe('Pricing Context', () => {
    it('should format pricing quantities correctly', () => {
      expect(pipe.transform(1)).toBe('۱');
      expect(pipe.transform(10)).toBe('۱۰');
      expect(pipe.transform(50)).toBe('۵۰');
      expect(pipe.transform(100)).toBe('۱۰۰');
    });

    it('should handle large quantities', () => {
      expect(pipe.transform(1000)).toBe('۱۰۰۰');
      expect(pipe.transform(5000)).toBe('۵۰۰۰');
    });
  });
});