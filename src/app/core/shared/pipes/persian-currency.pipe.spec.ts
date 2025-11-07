import { PersianCurrencyPipe } from './persian-currency.pipe';

describe('PersianCurrencyPipe', () => {
  let pipe: PersianCurrencyPipe;

  beforeEach(() => {
    pipe = new PersianCurrencyPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('Basic Currency Formatting', () => {
    it('should format numbers with default currency (تومان)', () => {
      expect(pipe.transform(1000)).toBe('۱,۰۰۰ تومان');
      expect(pipe.transform(500)).toBe('۵۰۰ تومان');
      expect(pipe.transform(1234567)).toBe('۱,۲۳۴,۵۶۷ تومان');
    });

    it('should format numbers with custom currency', () => {
      expect(pipe.transform(1000, 'ریال')).toBe('۱,۰۰۰ ریال');
      expect(pipe.transform(500, 'درهم')).toBe('۵۰۰ درهم');
    });

    it('should format numbers without currency when showCurrency is false', () => {
      expect(pipe.transform(1000, 'تومان', false)).toBe('۱,۰۰۰');
      expect(pipe.transform(500, '', false)).toBe('۵۰۰');
    });

    it('should format numbers without currency when currency is empty', () => {
      expect(pipe.transform(1000, '')).toBe('۱,۰۰۰');
      expect(pipe.transform(500, '', true)).toBe('۵۰۰');
    });
  });

  describe('Number Formatting', () => {
    it('should add thousand separators correctly', () => {
      expect(pipe.transform(1000)).toBe('۱,۰۰۰ تومان');
      expect(pipe.transform(10000)).toBe('۱۰,۰۰۰ تومان');
      expect(pipe.transform(100000)).toBe('۱۰۰,۰۰۰ تومان');
      expect(pipe.transform(1000000)).toBe('۱,۰۰۰,۰۰۰ تومان');
    });

    it('should convert to Persian numerals', () => {
      expect(pipe.transform(123456)).toBe('۱۲۳,۴۵۶ تومان');
      expect(pipe.transform(987654)).toBe('۹۸۷,۶۵۴ تومان');
    });

    it('should handle decimal numbers', () => {
      expect(pipe.transform(1234.56)).toBe('۱,۲۳۴.۵۶ تومان');
      expect(pipe.transform(999.99)).toBe('۹۹۹.۹۹ تومان');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', () => {
      expect(pipe.transform(0)).toBe('۰ تومان');
      expect(pipe.transform(0, 'ریال')).toBe('۰ ریال');
      expect(pipe.transform(0, '', false)).toBe('۰');
    });

    it('should handle null and undefined values', () => {
      expect(pipe.transform(null)).toBe('');
      expect(pipe.transform(undefined)).toBe('');
    });

    it('should handle NaN values', () => {
      expect(pipe.transform(NaN)).toBe('');
      expect(pipe.transform('invalid')).toBe('');
    });

    it('should handle string numbers', () => {
      expect(pipe.transform('1000')).toBe('۱,۰۰۰ تومان');
      expect(pipe.transform('500.50')).toBe('۵۰۰.۵ تومان');
    });

    it('should handle negative numbers', () => {
      expect(pipe.transform(-1000)).toBe('-۱,۰۰۰ تومان');
      expect(pipe.transform(-500)).toBe('-۵۰۰ تومان');
    });
  });

  describe('Pricing Context', () => {
    it('should format typical printing prices', () => {
      expect(pipe.transform(500)).toBe('۵۰۰ تومان');
      expect(pipe.transform(1000)).toBe('۱,۰۰۰ تومان');
      expect(pipe.transform(1500)).toBe('۱,۵۰۰ تومان');
      expect(pipe.transform(2000)).toBe('۲,۰۰۰ تومان');
    });

    it('should format breakpoint prices', () => {
      expect(pipe.transform(450)).toBe('۴۵۰ تومان');
      expect(pipe.transform(400)).toBe('۴۰۰ تومان');
      expect(pipe.transform(900)).toBe('۹۰۰ تومان');
    });

    it('should handle large order amounts', () => {
      expect(pipe.transform(50000)).toBe('۵۰,۰۰۰ تومان');
      expect(pipe.transform(100000)).toBe('۱۰۰,۰۰۰ تومان');
      expect(pipe.transform(1000000)).toBe('۱,۰۰۰,۰۰۰ تومان');
    });
  });

  describe('Different Currency Types', () => {
    it('should work with different Persian currencies', () => {
      expect(pipe.transform(1000, 'ریال')).toBe('۱,۰۰۰ ریال');
      expect(pipe.transform(1000, 'درهم')).toBe('۱,۰۰۰ درهم');
      expect(pipe.transform(1000, 'دینار')).toBe('۱,۰۰۰ دینار');
    });

    it('should work with English currency names', () => {
      expect(pipe.transform(1000, 'USD')).toBe('۱,۰۰۰ USD');
      expect(pipe.transform(1000, 'EUR')).toBe('۱,۰۰۰ EUR');
    });
  });
});