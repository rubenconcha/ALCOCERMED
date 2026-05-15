import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

export default function App() {
  // URL configurada para ver la versión en producción.
  const URL = 'https://alcocermed.com/juegos/';

  return (
    <SafeAreaView style={styles.container}>
      <WebView 
        source={{ uri: URL }} 
        injectedJavaScript={`
          (function() {
            var style = document.createElement('style');
            style.innerHTML = \`
              /* Topbar nativa: transparente y sin bordes */
              .topbar { 
                background: transparent !important; 
                border-bottom: none !important; 
                box-shadow: none !important; 
                position: absolute !important;
              }
              .topbar-brand { display: none !important; } 
              
              .main-content {
                margin-top: 0 !important;
                margin-left: 0 !important;
                padding: 100px 20px 100px !important;
                background: var(--bg) !important;
                min-height: 100vh !important;
              }

              /* --- MODO ESTUDIANTE --- */
              body.student-mode .quick-actions, 
              body.student-mode .recent-section, 
              body.student-mode .avatar-section { 
                display: none !important; 
              }
              body.student-mode #page-inicio {
                margin-top: 4vh !important;
              }
              body.student-mode .page-header {
                text-align: center !important;
                margin-bottom: 40px !important;
              }
              body.student-mode .page-header h1 {
                font-size: 2.2rem !important;
                justify-content: center !important;
              }
              body.student-mode .join-section {
                margin: 0 auto !important;
                width: 100% !important;
                max-width: 400px !important;
              }
              body.student-mode .join-card {
                border-radius: 32px !important;
                padding: 40px 24px !important;
                box-shadow: 0 24px 60px rgba(0,0,0,0.08) !important;
                border: none !important;
                background: var(--bg-card) !important;
              }
              body.student-mode .join-card-header {
                justify-content: center !important;
                margin-bottom: 12px !important;
              }
              body.student-mode .join-card-header h2 { font-size: 1.5rem !important; }
              body.student-mode .join-card p {
                text-align: center !important;
                margin-bottom: 24px !important;
                font-size: 0.95rem !important;
              }
              body.student-mode .join-input-row {
                flex-direction: column !important;
                gap: 16px !important;
              }
              body.student-mode .join-code-input {
                padding: 20px !important;
                font-size: 1.5rem !important;
                border-radius: 20px !important;
                background: rgba(0,0,0,0.03) !important;
                border: 2px solid transparent !important;
              }
              body.student-mode .join-code-input:focus {
                background: transparent !important;
                border-color: var(--blue) !important;
              }
              body.student-mode .join-code-btn {
                padding: 20px !important;
                font-size: 1.2rem !important;
                border-radius: 20px !important;
                justify-content: center !important;
              }

              /* --- MODO ADMIN --- */
              body.admin-mode .join-section { display: none !important; }
              body.admin-mode .avatar-section { display: none !important; }
              body.admin-mode .recent-section { display: none !important; }
              body.admin-mode .page-header { text-align: left !important; margin-bottom: 24px !important; }
              body.admin-mode .page-header h1 { font-size: 1.8rem !important; }
              
              /* Bottom Nav Nativo */
              .bottom-nav {
                height: 80px !important;
                border-top-left-radius: 30px !important;
                border-top-right-radius: 30px !important;
                box-shadow: 0 -10px 40px rgba(0,0,0,0.08) !important;
                border-top: none !important;
                padding-bottom: 10px !important;
              }
              .bnav-item { gap: 6px !important; font-size: 0.7rem !important; }
              .bnav-item i { font-size: 24px !important; }
            \`;
            document.head.appendChild(style);

            // Observador para detectar si es Admin o Estudiante
            var observer = new MutationObserver(function() {
              var roleEl = document.getElementById('topbar-role');
              if (roleEl) {
                if (roleEl.textContent.trim().toLowerCase() === 'administrador') {
                  document.body.classList.add('admin-mode');
                  document.body.classList.remove('student-mode');
                  
                  // Inyectar Dashboard de Admin
                  if (!document.getElementById('admin-dashboard-cards')) {
                    var quickActions = document.querySelector('.quick-actions');
                    if (quickActions) {
                      // Ocultar tarjetas originales
                      var existing = quickActions.querySelectorAll('.qa-card');
                      existing.forEach(function(e) { e.style.display = 'none'; });
                      
                      // Crear nuevo panel de control
                      var newCards = document.createElement('div');
                      newCards.id = 'admin-dashboard-cards';
                      newCards.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 10px;';
                      
                      newCards.innerHTML = \`
                        <div onclick="navigateTo('crear')" style="background: linear-gradient(135deg, #F59E0B, #D97706); border-radius: 28px; padding: 24px 16px; color: white; box-shadow: 0 12px 30px rgba(245,158,11,0.3); cursor: pointer; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 140px;">
                          <i class="fas fa-plus-circle" style="font-size: 38px; margin-bottom: 12px;"></i>
                          <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0;">Crear Exam</h3>
                        </div>
                        <div onclick="navigateTo('biblioteca')" style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); border-radius: 28px; padding: 24px 16px; color: white; box-shadow: 0 12px 30px rgba(59,130,246,0.3); cursor: pointer; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 140px;">
                          <i class="fas fa-folder-open" style="font-size: 38px; margin-bottom: 12px;"></i>
                          <h3 style="font-size: 1.1rem; font-weight: 800; margin: 0;">Biblioteca</h3>
                        </div>
                        <div onclick="navigateTo('informes')" style="grid-column: span 2; background: linear-gradient(135deg, #10B981, #047857); border-radius: 28px; padding: 24px; color: white; box-shadow: 0 12px 30px rgba(16,185,129,0.3); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 20px;">
                          <i class="fas fa-chart-pie" style="font-size: 42px;"></i>
                          <div style="text-align: left;">
                            <h3 style="font-size: 1.4rem; font-weight: 900; margin: 0;">Ver Informes</h3>
                            <p style="margin: 4px 0 0 0; font-size: 0.85rem; opacity: 0.9;">Rendimiento global</p>
                          </div>
                        </div>
                      \`;
                      quickActions.appendChild(newCards);
                    }
                  }
                } else {
                  document.body.classList.add('student-mode');
                  document.body.classList.remove('admin-mode');
                }
              }
            });
            observer.observe(document.body, { childList: true, subtree: true });
          })();
          true;
        `}
        style={styles.webview}
        // Permite la reproducción de media en línea (videos, audio)
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Evita el zoom accidental
        scalesPageToFit={false}
        bounces={false}
      />
      <StatusBar hidden={true} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
  webview: {
    flex: 1,
  },
});
