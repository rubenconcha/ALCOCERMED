// Resultados de la clase: datos persistidos, avisos en vivo y actualización de respaldo.
var sentidosLiveTimer = null;
var sentidosLiveChannel = null;
var sentidosLiveBusy = false;
var sentidosLiveGeneration = 0;
var sentidosLiveRefresh = null;

function initSentidosLiveResults(menu) {
    [menu, document.getElementById('quiz-result')].forEach(function(parent) {
        var panel = document.createElement('section');
        panel.className = 'sentidos-live-results';
        panel.innerHTML = '<h2>Resultados en vivo</h2><p class="sentidos-live-status" role="status">Esperando resultados…</p><div class="sentidos-live-rounds"></div>';
        parent.appendChild(panel);
    });
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && sentidosLiveTimer) refreshSentidosLiveResults();
    });
}

function stopSentidosLiveResults() {
    sentidosLiveGeneration++;
    clearInterval(sentidosLiveTimer);
    clearTimeout(sentidosLiveRefresh);
    sentidosLiveTimer = null;
    if (sentidosLiveChannel) sb.removeChannel(sentidosLiveChannel);
    sentidosLiveChannel = null;
    document.querySelectorAll('.sentidos-live-rounds').forEach(function(el) { el.replaceChildren(); });
}

function startSentidosLiveResults() {
    if (sentidosLiveTimer) return;
    refreshSentidosLiveResults();
    // También funciona si las tablas aún no están en la publicación de Realtime.
    sentidosLiveTimer = setInterval(refreshSentidosLiveResults, 3000);
    sentidosLiveChannel = sb.channel('sentidos-resultados-' + currentUser.id)
        .on('postgres_changes', {event:'*',schema:'public',table:'evaluacion_resultados'}, function(payload) {
            var row = payload.new || payload.old;
            if (row && row.evaluacion_id && nervousClassIds.indexOf(row.evaluacion_id) === -1) return;
            clearTimeout(sentidosLiveRefresh);
            sentidosLiveRefresh = setTimeout(refreshSentidosLiveResults, 200);
        }).subscribe();
}

function buildSentidosLiveRows(results, participants) {
    var names = {};
    participants.forEach(function(p) {
        names[p.evaluacion_id + ':' + p.user_id] = parseParticipantAvatarName(p.nombre || '', 'Estudiante').nombre;
    });
    var latest = {};
    results.forEach(function(r) {
        var key = r.evaluacion_id + ':' + r.user_id;
        if (!latest[key] || r.created_at > latest[key].created_at) latest[key] = r;
    });
    return nervousClassIds.map(function(id) {
        return Object.keys(latest).map(function(key) {
            var r = latest[key];
            var answers = Array.isArray(r.respuestas) ? r.respuestas : [];
            return {evaluation:r.evaluacion_id,user:r.user_id,name:names[key] || 'Estudiante',points:Number(r.puntaje)||0,
                answered:answers.length,correct:answers.filter(function(a) { return a.correcta === true; }).length,total:Number(r.total)||20};
        }).filter(function(r) { return r.evaluation === id; }).sort(function(a,b) {
            return b.points-a.points || b.correct-a.correct || a.name.localeCompare(b.name,'es') || a.user.localeCompare(b.user);
        });
    });
}

async function refreshSentidosLiveResults() {
    if (!currentUser || sentidosLiveBusy || document.hidden) return;
    var generation = sentidosLiveGeneration;
    var userId = currentUser.id;
    sentidosLiveBusy = true;
    try {
        var today = getLocalTodayRange();
        var responses = await Promise.all([
            sb.from('evaluacion_resultados').select('evaluacion_id,user_id,puntaje,total,respuestas,created_at')
                .in('evaluacion_id',nervousClassIds).gte('created_at',today.start).lt('created_at',today.end)
                .order('created_at',{ascending:false}),
            sb.from('evaluacion_participantes').select('evaluacion_id,user_id,nombre').in('evaluacion_id',nervousClassIds)
        ]);
        if (generation !== sentidosLiveGeneration || !currentUser || currentUser.id !== userId) return;
        if (responses[0].error || responses[1].error) throw new Error('No se pudieron actualizar los resultados.');
        var rounds = buildSentidosLiveRows(responses[0].data || [],responses[1].data || []);
        var html = rounds.map(function(rows,i) {
            return '<section><h3>Ronda ' + (i+1) + '</h3>' + (!rows.length ? '<p>Aún no hay respuestas hoy.</p>' :
                '<div class="sentidos-live-scroll"><table><thead><tr><th>Estudiante</th><th>Puntos</th><th>Avance</th><th>Aciertos</th></tr></thead><tbody>' +
                rows.map(function(r,j) {
                    return '<tr' + (r.user === userId ? ' class="sentidos-live-own"' : '') + '><td>' + (j+1) + '. ' + escapeHtml(r.name) + '</td><td>' + r.points.toLocaleString('es') + '</td><td>' + r.answered + '/' + r.total + '</td><td>' + r.correct + '/' + r.total + '</td></tr>';
                }).join('') + '</tbody></table></div>') + '</section>';
        }).join('');
        document.querySelectorAll('.sentidos-live-rounds').forEach(function(el) { if (el.innerHTML !== html) el.innerHTML = html; });
        document.querySelectorAll('.sentidos-live-status').forEach(function(el) { el.textContent = 'Hoy · Se actualiza automáticamente mientras responden.'; });
    } catch (e) {
        if (generation === sentidosLiveGeneration) document.querySelectorAll('.sentidos-live-status').forEach(function(el) {
            el.textContent = 'Conexión interrumpida. Reintentando la actualización…';
        });
    } finally { sentidosLiveBusy = false; }
}
