const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../juegos/game-access.js'), 'utf8');
const context = {window:{}, Date};
vm.runInNewContext(source,context);
const access = context.window.GameAccess;
const future = new Date(Date.now()+3600000).toISOString();
const past = new Date(Date.now()-3600000).toISOString();
test('full games require a current verified paid plan; trial remains demo', () => {
  assert.equal(access.isPaid({ready:true,premium:true,trial:false,expires_at:future}), true);
  assert.equal(access.isPaid({ready:true,premium:true,trial:true,expires_at:future}), false);
  assert.equal(access.isPaid({ready:true,premium:true,trial:false,expires_at:past}), false);
  assert.equal(access.isPaid({ready:false,premium:true,trial:false}), false);
  assert.equal(access.isPaid({ready:true,premium:false,trial:false}), false);
});
test('verification fails closed and grants only a paid entitlement', async () => {
  assert.equal(await access.verify({rpc:async () => ({data:{ready:true,premium:true,trial:false,expires_at:future},error:null})}),true);
  assert.equal(await access.verify({rpc:async () => ({data:{ready:true,premium:true,trial:true,expires_at:future},error:null})}),false);
  assert.equal(await access.verify({rpc:async () => {throw Error('network');}}),false);
});
