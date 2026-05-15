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
              .topbar-brand { display: none !important; } /* Ocultar el texto del logo para dejarla más limpia */
              
              /* Ocultar tarjetas de acciones y otras secciones en inicio */
              .quick-actions, .recent-section, .avatar-section { 
                display: none !important; 
              }

              /* Ajuste de contenedor principal */
              .main-content {
                margin-top: 0 !important;
                margin-left: 0 !important;
                padding: 120px 20px 100px !important;
                background: var(--bg) !important;
                min-height: 100vh !important;
              }

              /* Centrar el saludo y el input de código */
              #page-inicio {
                margin-top: 4vh !important;
              }
              .page-header {
                text-align: center !important;
                margin-bottom: 40px !important;
              }
              .page-header h1 {
                font-size: 2.2rem !important;
                justify-content: center !important;
              }

              /* Tarjeta de unirse ultra premium (Estilo Kahoot/Quizizz) */
              .join-section {
                margin: 0 auto !important;
                width: 100% !important;
                max-width: 400px !important;
              }
              .join-card {
                border-radius: 32px !important;
                padding: 40px 24px !important;
                box-shadow: 0 24px 60px rgba(0,0,0,0.08) !important;
                border: none !important;
                background: var(--bg-card) !important;
              }
              .join-card-header {
                justify-content: center !important;
                margin-bottom: 12px !important;
              }
              .join-card-header h2 { font-size: 1.5rem !important; }
              .join-card p {
                text-align: center !important;
                margin-bottom: 24px !important;
                font-size: 0.95rem !important;
              }
              .join-input-row {
                flex-direction: column !important;
                gap: 16px !important;
              }
              .join-code-input {
                padding: 20px !important;
                font-size: 1.5rem !important;
                border-radius: 20px !important;
                background: rgba(0,0,0,0.03) !important;
                border: 2px solid transparent !important;
              }
              .join-code-input:focus {
                background: transparent !important;
                border-color: var(--blue) !important;
              }
              .join-code-btn {
                padding: 20px !important;
                font-size: 1.2rem !important;
                border-radius: 20px !important;
                justify-content: center !important;
              }

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
