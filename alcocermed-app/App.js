import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

export default function App() {
  const [themeColor, setThemeColor] = useState('#ffffff');
  // URL configurada para ver la versión en producción.
  const URL = 'https://alcocermed.com/juegos/';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColor }]}>
      <WebView 
        source={{ uri: URL }} 
        onMessage={(event) => {
          if (event.nativeEvent.data === 'dark') {
            setThemeColor('#131c2b');
          } else if (event.nativeEvent.data === 'light') {
            setThemeColor('#ffffff');
          }
        }}
        injectedJavaScript={`
          (function() {
            var style = document.createElement('style');
            style.innerHTML = \`
              /* =========================================
                 GLOBAL NATIVE RESET
                 ========================================= */
              * { -webkit-tap-highlight-color: transparent; }
              
              /* TOPBAR NATIVA - ENGROSADA */
              .topbar { 
                display: flex !important;
                height: 110px !important; /* Engrosada */
                padding-top: 45px !important; /* Espacio para la barra de estado/notch del celular */
                align-items: center !important;
                background: #FFFFFF !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                z-index: 1000 !important;
              }
              
              /* CONTENIDO PRINCIPAL */
              .main-content {
                margin-top: 0 !important;
                padding-top: 130px !important; /* Para que no se solape con el topbar fijo y grueso */
                padding-bottom: 140px !important; /* Espacio extra para que no se solape la tarjeta inferior con la barra de abajo */
              }

              /* BOTTOM NAV NATIVA - SUBIDA */
              .bottom-nav {
                height: 90px !important; /* Más alta */
                border-top-left-radius: 24px !important;
                border-top-right-radius: 24px !important;
                box-shadow: 0 -8px 30px rgba(0,0,0,0.08) !important;
                border-top: none !important;
                background: #FFFFFF !important;
                align-items: flex-start !important;
                padding-top: 14px !important;
                padding-bottom: 30px !important; /* Sube los íconos más arriba para evitar los botones de Android/iPhone */
                position: fixed !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                z-index: 1000 !important;
              }

              /* ═══ SOPORTE MODO OSCURO PARA BARRAS NATIVAS ═══ */
              [data-theme="dark"] .topbar,
              [data-theme="dark"] .bottom-nav {
                background: #1e2a3d !important;
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.38) !important;
                border-color: rgba(148, 163, 184, 0.16) !important;
              }
              [data-theme="dark"] .bottom-nav {
                box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.38) !important;
              }

              .bnav-item { gap: 4px !important; font-size: 0.65rem !important; }
              .bnav-item i { font-size: 24px !important; }

              /* =========================================
                 FIX TABLES ON MOBILE (Informes/Resultados)
                 ========================================= */
              table {
                display: block !important;
                width: 100% !important;
                overflow-x: auto !important;
                white-space: nowrap !important;
                -webkit-overflow-scrolling: touch !important;
              }
              th, td { padding: 12px 16px !important; font-size: 0.85rem !important; }
            \`;
            document.head.appendChild(style);
            
            // Forzar escalado correcto en iOS y Android
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
            document.getElementsByTagName('head')[0].appendChild(meta);

            // Observador para detectar cambios en el modo oscuro (data-theme en el body)
            var observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'data-theme') {
                  var theme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(theme);
                  }
                }
              });
            });
            
            // Iniciar observador de manera segura cuando el body exista
            var checkBody = setInterval(function() {
              if (document.body) {
                clearInterval(checkBody);
                observer.observe(document.body, { attributes: true });
                // Enviar estado inicial
                var initialTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(initialTheme);
                }
              }
            }, 100);

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
    paddingTop: Constants.statusBarHeight,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
