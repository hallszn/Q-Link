// Basic smoke test to verify testing infrastructure works
describe('Testing Infrastructure', () => {
  it('jest is configured correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('can use array methods', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr.includes(2)).toBe(true);
  });

  it('can use async/await', async () => {
    const result = await Promise.resolve('Q-Link');
    expect(result).toBe('Q-Link');
  });
});
