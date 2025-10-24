import { describe, it } from 'node:test';
import assert from 'assert';
import { version } from './version.js';

describe('version', () => {
  it('should return the version instance', () => {
    assert.ok(version);
  });

  describe('version.validate()', () => {
    it('should validate valid semantic versions', () => {
      const valid = ['1.2.3', '1.2.3-beta', '1.2.3-beta.1', '1.2.3-rc.1', '2.0.0-alpha.0'];

      for (const v of valid) {
        assert.equal(version.validate(v), v);
      }
    });

    it('should validate invalid semantic versions', () => {
      const invalid = ['invalid', '1.2.3.beta', '1.2-beta', '1.2-beta.1', '1.2'];

      for (const v of invalid) {
        assert.strictEqual(version.validate(v), null);
      }
    });
  });
});
