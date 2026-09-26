import assert from 'node:assert/strict';
import test from 'node:test';

import {
  hasCredentialErrors,
  isStonyBrookEmail,
  validateCredentials,
} from '../src/auth/authValidation.ts';

test('accepts Stony Brook email addresses regardless of case and padding', () => {
  assert.equal(isStonyBrookEmail('wolfie@stonybrook.edu'), true);
  assert.equal(isStonyBrookEmail('  Wolfie.Seawolf@StonyBrook.EDU '), true);
});

test('rejects non-Stony Brook and malformed email addresses', () => {
  assert.equal(isStonyBrookEmail('wolfie@gmail.com'), false);
  assert.equal(isStonyBrookEmail('wolfie@cs.stonybrook.edu.evil.com'), false);
  assert.equal(isStonyBrookEmail('@stonybrook.edu'), false);
  assert.equal(isStonyBrookEmail('wolfie@@stonybrook.edu'), false);
  assert.equal(isStonyBrookEmail('wolf ie@stonybrook.edu'), false);
});

test('requires an email and password to sign in', () => {
  const errors = validateCredentials('signIn', { email: '', password: '' });

  assert.equal(errors.email, 'Enter your Stony Brook email.');
  assert.equal(errors.password, 'Enter your password.');
  assert.equal(hasCredentialErrors(errors), true);
});

test('does not apply the password length rule when signing in', () => {
  const errors = validateCredentials('signIn', {
    email: 'wolfie@stonybrook.edu',
    password: 'short',
  });

  assert.equal(hasCredentialErrors(errors), false);
});

test('requires a password of at least eight characters to register', () => {
  const tooShort = validateCredentials('register', {
    email: 'wolfie@stonybrook.edu',
    password: 'short',
  });
  const valid = validateCredentials('register', {
    email: 'wolfie@stonybrook.edu',
    password: 'longenough',
  });

  assert.equal(tooShort.password, 'Use at least 8 characters.');
  assert.equal(hasCredentialErrors(valid), false);
});
