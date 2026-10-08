const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs/promises');
const path = require('path');

const User = require('../models/User');
const { ICTSupportRequest } = require('../models/ICTSupportRequest');
const UserFileRepository = require('../repositories/UserFileRepository');
const ServiceRequestFileRepository = require('../repositories/ServiceRequestFileRepository');

test('1. Valid user construction', () => {
  const u = new User('U1', 'John', 'Doe', 'john@dwu.ac.pg', 'Student');
  assert.strictEqual(u.userId, 'U1');
});

test('2. Invalid email throws error', () => {
  assert.throws(() => new User('U2', 'Jane', 'Doe', 'bademail', 'Student'), /Invalid email/);
});

test('3. Abstract base class cannot be instantiated directly', () => {
  const ServiceRequest = require('../models/ServiceRequest');
  const u = new User('U1', 'John', 'Doe', 'john@dwu.ac.pg', 'Student');
  assert.throws(() => new ServiceRequest('R1', u, 'T', 'D', 'Loc', 'ICT'), /Cannot instantiate abstract class/);
});

test('4. Specialised request priority score calculation', () => {
  const u = new User('U1', 'John', 'Doe', 'john@dwu.ac.pg', 'Student');
  const req = new ICTSupportRequest('R1', u, 'Wi-Fi', 'Down', 'Library', 'Urgent', 'PC', 'Net', 'HW', 'Critical');
  assert.strictEqual(req.calculatePriorityScore(), 60);
});

test('5. Polymorphic getRequestSummary method execution', () => {
  const u = new User('U1', 'John', 'Doe', 'john@dwu.ac.pg', 'Student');
  const req = new ICTSupportRequest('R1', u, 'Wi-Fi', 'Down', 'Library', 'High', 'PC', 'Net', 'HW', 'High');
  assert.match(req.getRequestSummary(), /\[ICT\]\[ID: R1\]/);
});

test('6. Controlled status transition workflow', () => {
  const u = new User('U1', 'John', 'Doe', 'john@dwu.ac.pg', 'Student');
  const req = new ICTSupportRequest('R1', u, 'Wi-Fi', 'Down', 'Library', 'High', 'PC', 'Net', 'HW', 'High');
  req.transitionStatus('Reviewed', 'OFF1', 'Review', 'Looks good');
  assert.strictEqual(req.status, 'Reviewed');
});

test('7. Illegal status transition throws error', () => {
  const u = new User('U1', 'John', 'Doe', 'john@dwu.ac.pg', 'Student');
  const req = new ICTSupportRequest('R1', u, 'Wi-Fi', 'Down', 'Library', 'High', 'PC', 'Net', 'HW', 'High');
  assert.throws(() => req.transitionStatus('Closed', 'OFF1', 'Close', 'Illegal'), /Illegal state transition/);
});

test('8. Repository saves and loads data successfully', async () => {
  const tempFile = path.join(__dirname, 'temp_users.json');
  const repo = new UserFileRepository(tempFile);
  const u = new User('U99', 'Test', 'User', 'test@dwu.ac.pg', 'Student');
  await repo.saveAll([u]);
  const loaded = await repo.loadAll();
  assert.strictEqual(loaded.length, 1);
  assert.strictEqual(loaded[0].userId, 'U99');
  await fs.unlink(tempFile).catch(() => {});
});

test('9. Repository handles missing files gracefully', async () => {
  const repo = new UserFileRepository(path.join(__dirname, 'nonexistent.json'));
  const data = await repo.loadAll();
  assert.deepStrictEqual(data, []);
});

test('10. Target resolution hours return correct value polymorphically', () => {
  const u = new User('U1', 'John', 'Doe', 'john@dwu.ac.pg', 'Student');
  const req = new ICTSupportRequest('R1', u, 'Wi-Fi', 'Down', 'Library', 'High', 'PC', 'Net', 'HW', 'High');
  assert.strictEqual(req.getTargetResolutionHours(), 24);
});