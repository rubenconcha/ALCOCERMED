const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('password-recovery.js', 'utf8');
const tick = () => new Promise(resolve => setImmediate(resolve));

async function setup(options = {}) {
    const elements = new Map();
    const el = id => {
        if (!elements.has(id)) elements.set(id, {
            value: '', hidden: id === 'recovery-reset', disabled: false, dataset: {},
            addEventListener(event, handler) { this[event] = handler; },
            reset() { el('recovery-password').value = ''; el('recovery-confirm').value = ''; }
        });
        return elements.get(id);
    };
    const calls = [];
    let listener;
    const auth = {
        onAuthStateChange(fn) { listener = fn; },
        async getSession() {
            if (options.recoveryEvent) listener('PASSWORD_RECOVERY', {user: {id: 'student'}});
            return {data: {session: options.session || null}, error: null};
        },
        async resetPasswordForEmail(email, settings) {
            calls.push({type: 'request', email, settings});
            if (options.networkError) throw new Error('offline');
            return {error: options.requestError || null};
        },
        async updateUser(data) { calls.push({type: 'update', data}); return {error: options.updateError || null}; },
        async signOut(settings) { calls.push({type: 'signout', settings}); return {error: null}; }
    };
    const window = {
        location: {origin: 'https://campus.example', pathname: '/recuperar.html', hash: options.hash || '', search: options.search || ''},
        history: {replaceState() { calls.push({type: 'clean-url'}); }},
        ALCOCER_CONFIG: {SUPABASE_URL: 'https://auth.example', SUPABASE_KEY: 'public'},
        supabase: options.noSdk ? undefined : {createClient() { return {auth}; }}
    };
    vm.runInNewContext(source, {window, document: {getElementById: el}, URL, URLSearchParams});
    await tick();
    const submit = async id => { await el(id).submit({preventDefault() {}}); };
    return {el, calls, submit};
}

test('email request uses the recovery page and does not disclose account existence', async () => {
    const t = await setup();
    t.el('recovery-email').value = ' student@example.com ';
    await t.submit('recovery-request');
    assert.equal(t.calls[0].email, 'student@example.com');
    assert.equal(t.calls[0].settings.redirectTo, 'https://campus.example/recuperar.html?restablecer=1');
    assert.match(t.el('recovery-status').textContent, /Si hay una cuenta/);
    assert.equal(t.el('recovery-send').disabled, false);
});

test('invalid email does not call the service', async () => {
    const t = await setup();
    t.el('recovery-email').value = 'incorrecto';
    await t.submit('recovery-request');
    assert.equal(t.calls.length, 0);
    assert.equal(t.el('recovery-status').dataset.error, 'true');
});

test('valid recovery link opens password form and saves before signing out', async () => {
    const t = await setup({hash: '#type=recovery&access_token=example', session: {user: {id: 'student'}}});
    assert.equal(t.el('recovery-reset').hidden, false);
    t.el('recovery-password').value = t.el('recovery-confirm').value = 'ClaveNueva123';
    await t.submit('recovery-reset');
    assert.equal(t.calls.find(c => c.type === 'update').data.password, 'ClaveNueva123');
    assert.equal(t.calls.at(-1).type, 'signout');
    assert.equal(t.el('recovery-reset').hidden, true);
    assert.match(t.el('recovery-title').textContent, /actualizada/);
});

test('PASSWORD_RECOVERY event enables form even after SDK consumes the fragment', async () => {
    const t = await setup({search: '?restablecer=1', recoveryEvent: true, session: {user: {id: 'student'}}});
    assert.equal(t.el('recovery-reset').hidden, false);
});

test('existing ordinary session cannot be mistaken for a recovery link', async () => {
    const t = await setup({search: '?restablecer=1', session: {user: {id: 'student'}}});
    await t.submit('recovery-reset');
    assert.equal(t.el('recovery-reset').hidden, true);
    assert.equal(t.calls.some(c => c.type === 'update'), false);
});

test('expired links allow requesting a new email instead of updating a password', async () => {
    const t = await setup({hash: '#error=access_denied&error_code=otp_expired'});
    assert.equal(t.el('recovery-reset').hidden, true);
    assert.equal(t.el('recovery-request').hidden, false);
    assert.match(t.el('recovery-status').textContent, /venció/);
});

test('short or mismatched passwords are not submitted', async () => {
    const t = await setup({hash: '#type=recovery', session: {user: {id: 'student'}}});
    t.el('recovery-password').value = 'corta';
    await t.submit('recovery-reset');
    assert.match(t.el('recovery-status').textContent, /8 caracteres/);
    t.el('recovery-password').value = 'ClaveNueva123';
    t.el('recovery-confirm').value = 'Diferente123';
    await t.submit('recovery-reset');
    assert.match(t.el('recovery-status').textContent, /no coinciden/);
    assert.equal(t.calls.some(c => c.type === 'update'), false);
});

test('request failures restore the button and provide a useful error', async () => {
    for (const options of [{requestError: {status: 429}}, {networkError: true}, {noSdk: true}]) {
        const t = await setup(options);
        t.el('recovery-email').value = 'student@example.com';
        await t.submit('recovery-request');
        assert.equal(t.el('recovery-status').dataset.error, 'true');
        assert.equal(t.el('recovery-send').disabled, false);
    }
});

test('a rejected update leaves the form available and never claims success', async () => {
    const t = await setup({hash: '#type=recovery', session: {user: {id: 'student'}}, updateError: {code: 'same_password'}});
    t.el('recovery-password').value = t.el('recovery-confirm').value = 'ClaveNueva123';
    await t.submit('recovery-reset');
    assert.equal(t.el('recovery-reset').hidden, false);
    assert.equal(t.el('recovery-save').disabled, false);
    assert.match(t.el('recovery-status').textContent, /diferente/);
    assert.equal(t.calls.some(c => c.type === 'signout'), false);
});
