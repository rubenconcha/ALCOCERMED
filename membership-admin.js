'use strict';

window.AdminSubscriptions = (() => {
  const activation = document.getElementById('membership-activation');
  const groupSelect = document.getElementById('membership-group');
  const groupLabels = Object.freeze({ presencial_1: 'Presencial 1', presencial_2: 'Presencial 2', virtual: 'Virtual' });
  const removal = document.getElementById('membership-removal');
  const videos = document.getElementById('membership-videos');
  const forms = [activation, removal, videos];
  const list = document.getElementById('section-suscripciones');
  const table = document.getElementById('subscriptions-rows');
  const listStatus = document.getElementById('subscriptions-status');
  const listFeedback = document.getElementById('subscriptions-feedback');
  const search = document.getElementById('subscriptions-search');
  const filter = document.getElementById('subscriptions-state');
  const listGroup = document.getElementById('subscriptions-group');
  const listGroupStatus = document.getElementById('subscriptions-group-status');
  const dialog = document.getElementById('subscription-confirm');
  const dialogTitle = document.getElementById('subscription-confirm-title');
  const dialogMessage = document.getElementById('subscription-confirm-message');
  const dialogButton = document.getElementById('subscription-confirm-button');
  const reactivate = document.getElementById('subscription-reactivate');
  const reactivateForm = reactivate.querySelector('form');
  const reactivateStudent = document.getElementById('subscription-reactivate-student');
  const reactivateBack = reactivateForm.querySelector('button[type="button"]');
  const reactivateSubmit = reactivateForm.querySelector('button[type="submit"]');
  const registered = document.getElementById('registered-students');
  const registeredList = document.getElementById('registered-students-list');
  const registeredStatus = document.getElementById('registered-status');
  const registeredCount = document.getElementById('registered-count');
  const emailSuggestions = document.getElementById('registered-emails');
  const statuses = {
    active: ['Vigente', 'tag-success'],
    staff: ['Personal con acceso', 'tag-info'],
    blocked: ['Sin acceso efectivo', 'tag-muted'],
    included: ['Incluido en acceso completo', 'tag-info'],
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
  let directory = [];
  let listRequest = 0;
  let countsRequest = 0;
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

  function normalizedEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim());
  }

  function closestRegisteredEmail(typed) {
    const value = normalizedEmail(typed);
    if (!value) return '';
    const local = value.split('@')[0];
    const known = directory.map(row => row.email).filter(Boolean);
    if (known.some(email => normalizedEmail(email) === value)) return '';
    return known.find(email => {
      const candidate = normalizedEmail(email);
      return candidate.split('@')[0] === local || candidate.startsWith(value) || value.startsWith(candidate);
    }) || '';
  }

  function emailValidated(form) {
    const email = form.elements.email.value.trim();
    if (validEmail(email)) return true;
    feedback(form.querySelector('.subscription-feedback'),
      'El correo parece incompleto. Debe incluir el dominio completo, por ejemplo nombre@gmail.com.', 'error');
    form.elements.email.focus();
    return false;
  }

  function fillActivationEmail(email) {
    if (!email) return;
    activation.elements.email.value = email;
    if (registered?.open) registered.open = false;
    feedback(activation.querySelector('.subscription-feedback'),
      'Correo elegido: ' + email + '. Revisa las fechas y pulsa «Activar acceso completo».', 'success');
    activation.elements.email.focus();
    activation.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function renderRegistered() {
    if (!registeredList || !emailSuggestions) return;
    const known = directory.filter(row => row.email);
    emailSuggestions.replaceChildren(...known.map(row => {
      const option = document.createElement('option');
      option.value = row.email;
      if (row.name) option.label = row.name;
      return option;
    }));
    registeredList.replaceChildren(...known.map(row => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = row.email;
      button.title = 'Usar este correo para activar';
      button.addEventListener('click', () => fillActivationEmail(row.email));
      item.append(button);
      if (row.name) {
        const name = document.createElement('small');
        name.textContent = row.name;
        item.append(name);
      }
      return item;
    }));
    if (registeredCount) registeredCount.textContent = String(known.length);
    feedback(registeredStatus, known.length ? ''
      : 'No pudimos cargar los correos registrados. Escribe el correo completo del estudiante.', known.length ? '' : 'error');
  }

  /* admin.js entrega la lista de estudiantes que ya cargó con admin_list_users. */
  function setRegisteredEmails(students) {
    directory = (Array.isArray(students) ? students : []).map(row => ({
      email: String(row?.email || '').trim(),
      name: String(row?.name || row?.display || '').trim(),
    })).filter(row => row.email);
    renderRegistered();
  }

  function cell(text) {
    const td = document.createElement('td');
    td.textContent = text;
    return td;
  }

  function renderAccessCounts(counts) {
    document.getElementById('dash-total-users').textContent = counts ? String(counts.active_students) : '—';
    document.getElementById('dash-users-delta').textContent = counts
      ? counts.registered + ' cuentas registradas en total (incluye personal)'
      : 'Cuentas registradas: —';
  }

  async function loadAccessCounts() {
    const admin = currentAdmin;
    if (!admin) return;
    const request = ++countsRequest;
    const isCurrent = () => request === countsRequest && admin === currentAdmin;
    try {
      const { data, error } = await getSupabase().rpc('campus_admin_access_counts');
      if (!isCurrent()) return;
      if (error || !Number.isSafeInteger(data?.active_students) || data.active_students < 0 ||
          !Number.isSafeInteger(data?.registered) || data.registered < data.active_students) {
        renderAccessCounts(null);
        return;
      }
      renderAccessCounts(data);
    } catch (_) {
      if (isCurrent()) renderAccessCounts(null);
    }
  }

  function render() {
    if (!rows) return;
    const query = search.value.trim().toLowerCase();
    const groupFilter = studentGroupsByEmail === null ? '' : listGroup.value;
    const groupFor = row => studentGroupsByEmail?.get(normalizedEmail(row.email));
    const shown = rows.filter(row => {
      const group = groupFor(row);
      return (!filter.value || row.status === filter.value) &&
        (!groupFilter || (groupFilter === 'unassigned' ? group === undefined : group === groupFilter)) &&
        (!query || [row.student_name, row.email].some(value => value?.toLowerCase().includes(query)));
    });
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
      if (row.email && ['active', 'staff', 'blocked', 'included', 'scheduled', 'cancelled'].includes(row.status)) {
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
      const group = groupFor(row);
      const groupCell = cell('');
      const groupTag = document.createElement('span');
      groupTag.className = 'tag ' + (group ? 'tag-group-' + group : 'tag-muted');
      groupTag.textContent = studentGroupsByEmail === null ? '—' : (groupLabels[group] || 'Sin grupo asignado');
      groupCell.append(groupTag);
      tr.append(student, groupCell, cell(access), cell(formatDate(row.starts_on)),
        cell(row.ends_on ? formatDate(row.ends_on) : 'Sin vencimiento'), status, actions);
      body.append(tr);
    }
    table.replaceChildren(body);
    const count = filter.value === 'active'
      ? (shown.length === 1 ? '1 estudiante vigente' : shown.length + ' estudiantes vigentes')
      : (shown.length === 1 ? '1 registro' : shown.length + ' registros');
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
      void loadAccessCounts();
      if (rpc === 'campus_admin_activate_ben_carson_group') void refreshStudentGroups();
    } catch (error) {
      if (!isCurrent()) return;
      if (error?.code === 'P0002') {
        const suggestion = closestRegisteredEmail(values?.p_email);
        if (suggestion && form) {
          form.elements.email.value = suggestion;
          feedback(status, 'Ese correo no está registrado o quedó incompleto. Colocamos el correo registrado más parecido: '
            + suggestion + '. Revisa las fechas y vuelve a intentar.', 'error');
        } else {
          feedback(status, 'Ese correo no está registrado. Elige el correo completo en «Ver estudiantes registrados» '
            + 'o escríbelo con su dominio completo (por ejemplo @gmail.com).', 'error');
        }
      } else {
        const missingGroupFeature = rpc === 'campus_admin_activate_ben_carson_group' &&
          ['PGRST202', '42883', '42P01'].includes(error?.code);
        feedback(status, missingGroupFeature ? 'Los grupos aún no están habilitados. No se activó el acceso ni se guardó el grupo.'
          : messageFor(error, 'No pudimos guardar el cambio. Vuelve a intentarlo.'), 'error');
      }
    } finally {
      if (pendingWrite === write) {
        pendingWrite = null;
        setSaving(false);
      }
    }
  }

  function saveSubscription(form, email, scope, start, end, group = '') {
    const attachingGroup = form === activation && scope === 'full' && Boolean(group);
    const values = attachingGroup ? { p_email: email, p_start: start, p_end: end, p_group: group }
      : { p_email: email, p_scope: scope, p_start: start, p_end: end };
    return save(form, attachingGroup ? 'campus_admin_activate_ben_carson_group' : 'campus_admin_save_subscription',
      values, result => (result?.status === 'scheduled' ? 'Acceso programado' :
      result?.status === 'expired' ? 'Período vencido guardado' : 'Acceso activado') +
      ' para ' + email + ' del ' + formatDate(start) + ' al ' + formatDate(end) + '.' +
      (attachingGroup ? ' Grupo Ben Carson: ' + groupLabels[group] + '.' : ''));
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
      if (!currentAdmin || pendingWrite || !datesInOrder(form) || !emailValidated(form)) return;
      const email = form.elements.email.value.trim();
      const start = form.elements.start.value;
      const end = form.elements.end.value;
      const access = scope === 'full' ? 'acceso completo' : 'acceso solo a videos';
      const dates = 'del ' + formatDate(start) + ' al ' + formatDate(end);
      const group = form === activation ? groupSelect.value : '';
      if (group && !Object.hasOwn(groupLabels, group)) {
        feedback(form.querySelector('.subscription-feedback'), 'Elige un grupo válido de Ben Carson.', 'error');
        return;
      }
      const groupNote = group ? ' Grupo Ben Carson: ' + groupLabels[group] + '.' : '';
      confirmChange('Confirmar activación', 'Guardar ' + access + ' para ' + email + ' ' + dates +
        '. Se reemplazarán las fechas anteriores de este acceso.' + groupNote, 'Confirmar activación',
        () => saveSubscription(form, email, scope, start, end, group));
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
    if (!emailValidated(removal)) return;
    const email = removal.elements.email.value.trim();
    const scope = removal.elements.scope.value;
    const label = removal.elements.scope.selectedOptions[0].textContent.toLowerCase();
    confirmRemoval(email, scope, label, removal);
  });

  function clear() {
    ++listRequest;
    ++countsRequest;
    renderAccessCounts(null);
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
    directory = [];
    if (registeredList) registeredList.replaceChildren();
    if (emailSuggestions) emailSuggestions.replaceChildren();
    if (registeredCount) registeredCount.textContent = '—';
    feedback(registeredStatus, '');
    feedback(listStatus, '');
    feedback(listFeedback, '');
    list.removeAttribute('aria-busy');
    search.value = listGroup.value = '';
    filter.value = 'active';
    listGroup.disabled = true;
    feedback(listGroupStatus, '');
    for (const form of forms) {
      form.reset();
      if (form !== removal) resetDates(form);
      feedback(form.querySelector('.subscription-feedback'), '');
    }
  }

  search.addEventListener('input', render);
  filter.addEventListener('change', render);
  listGroup.addEventListener('change', render);
  function refreshSubscriptionGroupFilter() {
    const unavailable = studentGroupsByEmail === null;
    listGroup.disabled = unavailable;
    if (unavailable) listGroup.value = '';
    feedback(listGroupStatus, unavailable
      ? 'No se pudieron cargar los grupos. Puedes buscar por nombre o correo y filtrar por estado.' : '');
    render();
  }
  document.addEventListener('admin-ben-carson-groups-change', refreshSubscriptionGroupFilter);
  if (studentGroupsByEmail !== null || document.getElementById('student-group-status')?.textContent) {
    refreshSubscriptionGroupFilter();
  }
  return { load, loadAccessCounts, clear, setRegisteredEmails };
})();
