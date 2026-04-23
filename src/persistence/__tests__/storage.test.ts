import {
  loadLastDifficulty,
  saveLastDifficulty,
  loadBestTimes,
  saveBestTimes,
  maybeUpdateBestTime,
  type BestTimes,
} from '../storage';

beforeEach(() => {
  localStorage.clear();
});

describe('loadLastDifficulty', () => {
  it('returns "beginner" when nothing stored', () => {
    expect(loadLastDifficulty()).toBe('beginner');
  });

  it('returns stored valid difficulty', () => {
    localStorage.setItem('pxl-sweeper:lastDifficulty', 'expert');
    expect(loadLastDifficulty()).toBe('expert');
  });

  it('returns "beginner" for corrupted value', () => {
    localStorage.setItem('pxl-sweeper:lastDifficulty', 'nightmare');
    expect(loadLastDifficulty()).toBe('beginner');
  });

  it('returns "beginner" when localStorage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    expect(loadLastDifficulty()).toBe('beginner');
    spy.mockRestore();
  });
});

describe('saveLastDifficulty', () => {
  it('persists the difficulty under the namespaced key', () => {
    saveLastDifficulty('intermediate');
    expect(localStorage.getItem('pxl-sweeper:lastDifficulty')).toBe('intermediate');
  });

  it('does not throw when localStorage is unavailable', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied');
    });
    expect(() => saveLastDifficulty('beginner')).not.toThrow();
    spy.mockRestore();
  });
});

describe('loadBestTimes', () => {
  it('returns empty object when nothing stored', () => {
    expect(loadBestTimes()).toEqual({});
  });

  it('returns valid best times', () => {
    localStorage.setItem(
      'pxl-sweeper:bestTimes',
      JSON.stringify({ beginner: 42, expert: 300 }),
    );
    expect(loadBestTimes()).toEqual({ beginner: 42, expert: 300 });
  });

  it('ignores non-numeric values', () => {
    localStorage.setItem(
      'pxl-sweeper:bestTimes',
      JSON.stringify({ beginner: 'fast', intermediate: 100 }),
    );
    expect(loadBestTimes()).toEqual({ intermediate: 100 });
  });

  it('ignores negative and zero values', () => {
    localStorage.setItem(
      'pxl-sweeper:bestTimes',
      JSON.stringify({ beginner: 0, intermediate: -5, expert: 10 }),
    );
    expect(loadBestTimes()).toEqual({ expert: 10 });
  });

  it('floors fractional values', () => {
    localStorage.setItem(
      'pxl-sweeper:bestTimes',
      JSON.stringify({ beginner: 42.7 }),
    );
    expect(loadBestTimes()).toEqual({ beginner: 42 });
  });

  it('returns empty object for corrupted JSON', () => {
    localStorage.setItem('pxl-sweeper:bestTimes', '{not valid json');
    expect(loadBestTimes()).toEqual({});
  });

  it('returns empty object for non-object JSON', () => {
    localStorage.setItem('pxl-sweeper:bestTimes', '"hello"');
    expect(loadBestTimes()).toEqual({});
  });

  it('returns empty object for array JSON', () => {
    localStorage.setItem('pxl-sweeper:bestTimes', '[1,2,3]');
    expect(loadBestTimes()).toEqual({});
  });

  it('returns empty object when localStorage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    expect(loadBestTimes()).toEqual({});
    spy.mockRestore();
  });

  it('ignores unknown difficulty keys', () => {
    localStorage.setItem(
      'pxl-sweeper:bestTimes',
      JSON.stringify({ beginner: 10, custom: 5 }),
    );
    expect(loadBestTimes()).toEqual({ beginner: 10 });
  });
});

describe('saveBestTimes', () => {
  it('writes JSON under the namespaced key', () => {
    saveBestTimes({ beginner: 42 });
    expect(JSON.parse(localStorage.getItem('pxl-sweeper:bestTimes')!)).toEqual({ beginner: 42 });
  });
});

describe('maybeUpdateBestTime', () => {
  it('adds a new best time when none exists', () => {
    const times: BestTimes = {};
    const result = maybeUpdateBestTime(times, 'beginner', 50);
    expect(result).toEqual({ beginner: 50 });
    expect(result).not.toBe(times);
  });

  it('updates when new time is strictly better', () => {
    const times: BestTimes = { beginner: 50 };
    const result = maybeUpdateBestTime(times, 'beginner', 30);
    expect(result).toEqual({ beginner: 30 });
  });

  it('returns same reference when new time is equal', () => {
    const times: BestTimes = { beginner: 50 };
    expect(maybeUpdateBestTime(times, 'beginner', 50)).toBe(times);
  });

  it('returns same reference when new time is worse', () => {
    const times: BestTimes = { beginner: 50 };
    expect(maybeUpdateBestTime(times, 'beginner', 60)).toBe(times);
  });

  it('preserves other difficulties', () => {
    const times: BestTimes = { beginner: 50, expert: 300 };
    const result = maybeUpdateBestTime(times, 'beginner', 30);
    expect(result).toEqual({ beginner: 30, expert: 300 });
  });
});
