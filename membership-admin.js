'use strict';

window.AdminSubscriptions = (() => {
  const activation = document.getElementById('membership-activation');
  const removal = document.getElementById('membership-removal');
  const videos = document.getElementById('membership-videos');
  const forms = [activation, removal, videos];
  const list = document.getElementById('section-suscripciones');
  const table = document.getElementById('subscriptions-rows');
  const listStatus = document.getElementById('subscriptions-status');
  const listFeedback = document.getElementById('subscriptions-feedback');
  const search = document.getElementById('subscriptions-search');
  const filter = document.getElementById('subscriptions-state');
  const dialog = document.getElementById('subscription-confirm');
  const dialogTitle = document.getElementById('subscription-confirm-title');
  const dialogMessage = document.getElementById('subscription-confirm-message');
  const dialogButton = document.getElementById('subscription-confirm-button');
  const reactivate = document.getElementById('subscription-reactivate');
  const reactivateForm = reactivate.querySelector('form');
  const reactivateStudent = document.getElementById('subscription-reactivate-student');
  const reactivateBack = reactivateForm.querySelector('button[type="button"]');
  const reactivateSubmit = reactivateForm.querySelector('button[type="submit"]');
  const statuses = {
    active: ['Vigente', 'tag-success'],
    scheduled: ['Programada', 'tag-info'],
    expired: ['Vencida', 'tag-muted'],
    cancelled: ['Quitada', 'tag-danger'],
  };
  const planLabels = {
    monthly: 'Mensual',
    semester: 'Semestral',
    annual: 'Anual',
    lifetime: 'De por vida',
  };
  let rows = null;
  let listRequest = 0;
  let pendingWrite = null;
  let confirmedAction = null;
  let reactivationTarget = null;

  function todayInBolivia() {
    const date = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/La_Paz', year: 'numeric', month: '2-digit', day: '2-digit',
    });
    const parts = Object.fromEntries(date.formatToParts(new Date()).map(part => [part.type, part.value]));
    return [parts.year, parts.month, parts.day].join('-');
  }

  function formatDate(value) {
    return value.slice(0, 10).split('-').reverse().join('/');
  }

  function feedback(element, message, tone = '') {
    element.textContent = message;
    element.dataset.tone = tone;
  }

  function resetDates(form) {
    form.elements.start.value = todayInBolivia();
  }

  function datesInOrder(form) {
    if (form.elements.end.value >= form.elements.start.value) return true;
    feedback(form.querySelector('.subscription-feedback'), 'La fecha de fin debe ser igual o posterior a la de inicio.', 'error');
    form.elements.end.focus();
    return false;
  }

  function messageFor(error, fallback) {
    if (error?.code === '42501') return 'Esta cuenta no tiene permiso para gestionar suscripciones.';
    if (error?.code === 'P0002' || error?.code === '22023') return error.message;
    return fallback;
  }

  function cell(text) {
    const td = document.createElement('td');
    td.textContent = text;
    return td;
  }

  function render() {
    if (!rows) return;
    const query = search.value.trim().toLowerCase();
    const shown = rows.filter(row =>
      (!filter.value || row.status === filter.value) &&
      (!query || [row.student_name, row.email].some(value => value?.toLowerCase().includes(query)))
    );
    const body = document.createDocumentFragment();
    for (const row of shown) {
      const tr = document.createElement('tr');
      const student = cell(row.student_name || row.email || 'Sin correo registrado');
      if (row.student_name && row.email) {
        const email = document.createElement('div');
        email.className = 'user-cell-email';
        email.textContent = row.email;
        student.append(email);
      }
      const access = row.scope === 'videos' ? 'Solo videos'
        : (planLabels[row.plan] ? 'Completo · ' + planLabels[row.plan] : 'Completo');
      const status = cell('');
      const badge = document.createElement('span');
      const [label, style] = statuses[row.status] || ['—', 'tag-muted'];
      badge.textContent = label;
      badge.className = 'tag ' + style;
      status.append(badge);
      const actions = cell('');
      actions.className = 'subscription-actions';
      if (row.email && ['active', 'scheduled', 'cancelled'].includes(row.status)) {
        const label = row.scope === 'videos' ? 'solo videos' : 'suscripción completa';
        const adding = row.status === 'cancelled';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-sm ' + (adding ? 'subscription-row-add' : 'subscription-row-remove');
        button.textContent = adding ? 'Agregar' : 'Quitar';
        button.setAttribute('aria-label', button.textContent + ' ' + label + ' de ' + row.email);
        button.disabled = Boolean(pendingWrite);
        button.addEventListener('click', () => {
          if (adding) openReactivation(row, label);
          else confirmRemoval(row.email, row.scope, label);
        });
        actions.append(button);
      }
      tr.append(student, cell(access), cell(formatDate(row.starts_on)),
        cell(row.ends_on ? formatDate(row.ends_on) : 'Sin vencimiento'), status, actions);
      body.append(tr);
    }
    table.replaceChildren(body);
    const count = shown.length === 1 ? '1 registro' : shown.length + ' registros';
    feedback(listStatus, shown.length ? count : rows.length
      ? 'No hay suscripciones que coincidan con la búsqueda.'
      : 'Todavía no hay suscripciones registradas.');
  }

  async function load() {
    const admin = currentAdmin;
    if (!admin) return;
    const request = ++listRequest;
    rows = null;
    table.replaceChildren();
    feedback(listStatus, 'Cargando suscripciones…');
    list.setAttribute('aria-busy', 'true');
    const isCurrent = () => request === listRequest && admin === currentAdmin;
    try {
      const pageSize = 250;
      const subscriptions = [];
      for (let offset = 0; ; offset += pageSize) {
        const { data, error } = await getSupabase().rpc('campus_admin_list_subscriptions')
          .range(offset, offset + pageSize - 1);
        if (!isCurrent()) return;
        if (error) throw error;
        const page = data || [];
        subscriptions.push(...page);
        if (page.length < pageSize) break;
      }
      rows = subscriptions;
      render();
    } catch (error) {
      if (isCurrent()) feedback(listStatus, messageFor(error, 'No se pudo cargar la lista. Pulsa Actualizar para volver a intentar.'), 'error');
    } finally {
      if (isCurrent()) list.removeAttribute('aria-busy');
    }
  }

  function setSaving(saving) {
    for (const form of forms) {
      form.querySelector('button[type="submit"]').disabled = saving;
    }
    for (const button of table.querySelectorAll('.subscription-actions button')) {
      button.disabled = saving;
    }
    reactivateBack.disabled = saving;
    reactivateSubmit.disabled = saving;
  }

  function confirmChange(title, message, label, action, removing = false) {
    if (!currentAdmin || pendingWrite || dialog.open) return;
    const admin = currentAdmin;
    confirmedAction = () => { if (currentAdmin === admin) action(); };
    dialog.returnValue = '';
    dialogTitle.textContent = title;
    dialogMessage.textContent = message;
    dialogButton.textContent = label;
    dialogButton.classList.toggle('subscription-remove', removing);
    dialogButton.classList.toggle('subscription-activate', !removing);
    dialog.showModal();
  }

  dialog.addEventListener('close', () => {
    const action = confirmedAction;
    confirmedAction = null;
    if (dialog.returnValue === 'confirm') action?.();
  });

  async function save(form, rpc, values, successMessage) {
    if (!currentAdmin || pendingWrite) return;
    const write = { admin: currentAdmin };
    pendingWrite = write;
    const status = form ? form.querySelector('.subscription-feedback') : listFeedback;
    setSaving(true);
    feedback(status, 'Guardando…');
    const isCurrent = () => pendingWrite === write && write.admin === currentAdmin;
    try {
      const { data, error } = await getSupabase().rpc(rpc, values);
      if (!isCurrent()) return;
      if (error) throw error;
      if (form) {
        form.reset();
        if (form === activation || form === videos) resetDates(form);
      }
      const adding = form === reactivateForm;
      if (adding) reactivate.close();
      feedback(adding ? listFeedback : status, successMessage(data), 'success');
      if (list.classList.contains('active')) load();
    } catch (error) {
      if (isCurrent()) feedback(status, messageFor(error, 'No pudimos guardar el cambio. Vuelve a intentarlo.'), 'error');
    } finally {
      if (pendingWrite === write) {
        pendingWrite = null;
        setSaving(false);
      }
    }
  }

  function saveSubscription(form, email, scope, start, end) {
    save(form, 'campus_admin_save_subscription', {
      p_email: email, p_scope: scope, p_start: start, p_end: end,
    }, result => (result?.status === 'scheduled' ? 'Acceso programado' :
      result?.status === 'expired' ? 'Período vencido guardado' : 'Acceso activado') +
      ' para ' + email + ' del ' + formatDate(start) + ' al ' + formatDate(end) + '.');
  }

  function openReactivation(row, label) {
    if (!currentAdmin || pendingWrite || reactivate.open) return;
    const today = todayInBolivia();
    const previousEnd = row.ends_on?.slice(0, 10) || '';
    reactivationTarget = { email: row.email, scope: row.scope, admin: currentAdmin };
    reactivateStudent.textContent = row.email + ' · ' + label;
    reactivateForm.elements.start.value = today;
    reactivateForm.elements.end.min = today;
    reactivateForm.elements.end.value = previousEnd >= today ? previousEnd : '';
    feedback(reactivateForm.querySelector('.subscription-feedback'), '');
    reactivate.showModal();
  }

  reactivateBack.addEventListener('click', () => reactivate.close());
  reactivate.addEventListener('cancel', event => {
    if (pendingWrite) event.preventDefault();
  });
  reactivate.addEventListener('close', () => {
    reactivationTarget = null;
    reactivateStudent.textContent = '';
  });
  reactivateForm.addEventListener('submit', event => {
    event.preventDefault();
    const target = reactivationTarget;
    if (!target || target.admin !== currentAdmin || pendingWrite || !datesInOrder(reactivateForm)) return;
    const start = reactivateForm.elements.start.value;
    const end = reactivateForm.elements.end.value;
    saveSubscription(reactivateForm, target.email, target.scope, start, end);
  });

  for (const [form, scope] of [[activation, 'full'], [videos, 'videos']]) {
    resetDates(form);
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!currentAdmin || pendingWrite || !datesInOrder(form)) return;
      const email = form.elements.email.value.trim();
      const start = form.elements.start.value;
      const end = form.elements.end.value;
      const access = scope === 'full' ? 'acceso completo' : 'acceso solo a videos';
      const dates = 'del ' + formatDate(start) + ' al ' + formatDate(end);
      confirmChange('Confirmar activación', 'Guardar ' + access + ' para ' + email + ' ' + dates +
        '. Se reemplazarán las fechas anteriores de este acceso.', 'Confirmar activación',
        () => saveSubscription(form, email, scope, start, end));
    });
  }

  function confirmRemoval(email, scope, label, form = null) {
    const note = scope === 'videos' ? ' Un plan completo vigente seguirá incluyendo videoclases.' : '';
    confirmChange('Confirmar baja', 'Quitar ' + label + ' de ' + email + '. El cambio se aplica de inmediato.' + note,
      'Quitar acceso', () => save(form, 'campus_admin_remove_subscription', { p_email: email, p_scope: scope }, result =>
        result?.full || result?.videos ? 'Acceso quitado para ' + email + '.'
          : email + ' no tiene ese acceso vigente ni programado.'), true);
  }

  removal.addEventListener('submit', event => {
    event.preventDefault();
    const email = removal.elements.email.value.trim();
    const scope = removal.elements.scope.value;
    const label = removal.elements.scope.selectedOptions[0].textContent.toLowerCase();
    confirmRemoval(email, scope, label, removal);
  });

  function clear() {
    ++listRequest;
    pendingWrite = null;
    confirmedAction = null;
    if (dialog.open) dialog.close();
    reactivationTarget = null;
    if (reactivate.open) reactivate.close();
    reactivateStudent.textContent = '';
    reactivateForm.reset();
    setSaving(false);
    rows = null;
    table.replaceChildren();
    feedback(listStatus, '');
    feedback(listFeedback, '');
    list.removeAttribute('aria-busy');
    search.value = filter.value = '';
    for (const form of forms) {
      form.reset();
      if (form !== removal) resetDates(form);
      feedback(form.querySelector('.subscription-feedback'), '');
    }
  }

  search.addEventListener('input', render);
  filter.addEventListener('change', render);
  return { load, clear };
})();
