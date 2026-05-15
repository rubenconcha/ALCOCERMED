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
              /* =========================================
                 GLOBAL NATIVE RESET
                 ========================================= */
              * { -webkit-tap-highlight-color: transparent; }
              body { background: #F8FAFC !important; }
              
              /* Ocultar barra superior web */
              .topbar { display: none !important; }

              /* =========================================
                 HOME SCREEN (STUDENT & ADMIN BASE)
                 ========================================= */
              #page-inicio {
                position: relative;
                padding-top: 60px !important;
                margin-top: 0 !important;
              }
              /* Fondo dinámico estilo Quizizz (mitad superior) */
              #page-inicio::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0;
                height: 380px; 
                background: linear-gradient(180deg, #1A0B2E 0%, #3A1C61 50%, #4A148C 100%);
                border-bottom-left-radius: 40px;
                border-bottom-right-radius: 40px;
                z-index: -1;
              }

              .page-header { margin-bottom: 24px !important; text-align: left !important; padding: 0 24px !important; }
              .page-header h1 { color: #FFFFFF !important; font-size: 1.8rem !important; display: block !important; }
              .page-subtitle { color: rgba(255,255,255,0.8) !important; font-size: 0.9rem !important; }

              /* =========================================
                 JOIN CARD (MODO ESTUDIANTE)
                 ========================================= */
              body.student-mode .join-section {
                margin: 0 24px 30px !important;
                position: relative;
                z-index: 10;
              }
              body.student-mode .join-card {
                background: #FFFFFF !important;
                border-radius: 20px !important;
                padding: 24px 20px !important;
                box-shadow: 0 16px 40px rgba(0,0,0,0.15) !important;
                border: none !important;
              }
              body.student-mode .join-card-header { display: none !important; } 
              body.student-mode .join-card p { display: none !important; }
              
              body.student-mode .join-input-row { flex-direction: column !important; gap: 12px !important; }
              body.student-mode .join-code-input {
                padding: 18px 20px !important;
                font-size: 1.1rem !important;
                border-radius: 12px !important;
                background: #FFFFFF !important;
                border: 2px solid #E2E8F0 !important;
                color: #1E293B !important;
                text-align: left !important;
              }
              body.student-mode .join-code-input::placeholder { color: #94A3B8 !important; font-weight: 600 !important; font-size: 1rem !important; }
              body.student-mode .join-code-input:focus { border-color: #4A148C !important; }
              
              body.student-mode .join-code-btn {
                padding: 16px !important;
                font-size: 1.1rem !important;
                border-radius: 12px !important;
                background: #461A42 !important; /* Color vino oscuro como la imagen */
                color: #FFFFFF !important;
                font-weight: 700 !important;
                justify-content: center !important;
              }

              body.student-mode .quick-actions, 
              body.student-mode .avatar-section { display: none !important; }

              /* =========================================
                 RECENT ACTIVITY (MODO ESTUDIANTE)
                 ========================================= */
              body.student-mode .recent-section {
                background: transparent !important;
                padding: 0 24px 100px !important;
                margin: 0 !important;
              }
              body.student-mode .recent-section h2 { 
                color: #1E293B !important; 
                font-size: 1.2rem !important; 
                margin-bottom: 16px !important; 
              }

              /* =========================================
                 ADMIN DASHBOARD
                 ========================================= */
              body.admin-mode .join-section, body.admin-mode .avatar-section, body.admin-mode .recent-section { display: none !important; }
              body.admin-mode .quick-actions { display: none !important; }
              
              #admin-dashboard-cards {
                padding: 0 24px !important;
                z-index: 10;
                position: relative;
              }
              .admin-card {
                border-radius: 20px !important;
                padding: 24px 16px !important;
                color: white !important;
                text-align: center !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                min-height: 120px !important;
              }

              /* =========================================
                 FIX TABLES & PAGES ON MOBILE
                 ========================================= */
              table {
                display: block !important;
                width: 100% !important;
                overflow-x: auto !important;
                white-space: nowrap !important;
                -webkit-overflow-scrolling: touch !important;
              }
              th, td { padding: 12px 16px !important; font-size: 0.85rem !important; }
              
              .main-content { padding: 0 0 100px 0 !important; }
              .page:not(#page-inicio) { padding: 40px 24px !important; }
              .page:not(#page-inicio) .page-header h1 { font-size: 1.6rem !important; color: #1E293B !important; }

              /* =========================================
                 BOTTOM NAV NATIVO
                 ========================================= */
              .bottom-nav {
                height: 80px !important;
                border-top-left-radius: 24px !important;
                border-top-right-radius: 24px !important;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.06) !important;
                border-top: none !important;
                background: #FFFFFF !important;
                align-items: flex-start !important;
                padding-top: 14px !important;
                padding-bottom: 20px !important; /* Fix solapamiento botones celulares Android/iPhone */
              }
              .bnav-item { gap: 4px !important; font-size: 0.65rem !important; color: #94A3B8 !important; }
              .bnav-item.active { color: #4A148C !important; }
              .bnav-item i { font-size: 24px !important; }
            \`;
            document.head.appendChild(style);

            // Observador de roles
            var observer = new MutationObserver(function() {
              var roleEl = document.getElementById('topbar-role');
              if (roleEl) {
                if (roleEl.textContent.trim().toLowerCase() === 'administrador') {
                  document.body.classList.add('admin-mode');
                  document.body.classList.remove('student-mode');
                  
                  if (!document.getElementById('admin-dashboard-cards')) {
                    var quickActions = document.querySelector('.quick-actions');
                    if (quickActions) {
                      var newCards = document.createElement('div');
                      newCards.id = 'admin-dashboard-cards';
                      newCards.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 10px;';
                      
                      newCards.innerHTML = \`
                        <div onclick="navigateTo('crear')" class="admin-card" style="background: linear-gradient(135deg, #F59E0B, #D97706); box-shadow: 0 10px 20px rgba(245,158,11,0.3);">
                          <i class="fas fa-plus-circle" style="font-size: 32px; margin-bottom: 8px;"></i>
                          <h3 style="font-size: 1rem; font-weight: 800; margin: 0;">Crear Exam</h3>
                        </div>
                        <div onclick="navigateTo('biblioteca')" class="admin-card" style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); box-shadow: 0 10px 20px rgba(59,130,246,0.3);">
                          <i class="fas fa-folder-open" style="font-size: 32px; margin-bottom: 8px;"></i>
                          <h3 style="font-size: 1rem; font-weight: 800; margin: 0;">Biblioteca</h3>
                        </div>
                        <div onclick="navigateTo('informes')" class="admin-card" style="grid-column: span 2; background: linear-gradient(135deg, #10B981, #047857); flex-direction: row !important; justify-content: flex-start !important; padding: 20px 24px !important; box-shadow: 0 10px 20px rgba(16,185,129,0.3);">
                          <i class="fas fa-chart-pie" style="font-size: 36px; margin-right: 16px;"></i>
                          <div style="text-align: left;">
                            <h3 style="font-size: 1.2rem; font-weight: 900; margin: 0;">Ver Informes</h3>
                            <p style="margin: 2px 0 0 0; font-size: 0.8rem; opacity: 0.9;">Rendimiento global</p>
                          </div>
                        </div>
                      \`;
                      quickActions.parentNode.insertBefore(newCards, quickActions.nextSibling);
                    }
                  }
                } else {
                  document.body.classList.add('student-mode');
                  document.body.classList.remove('admin-mode');
                }
              }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            
            // Forzar escalado correcto en iOS y Android
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
            document.getElementsByTagName('head')[0].appendChild(meta);
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
