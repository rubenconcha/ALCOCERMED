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
              .topbar { display: none !important; }
              .main-content {
                margin-top: 0 !important;
                margin-left: 0 !important;
                padding: 60px 20px 100px !important;
              }
              .page-header {
                text-align: center !important;
                margin-bottom: 30px !important;
              }
              .page-header h1 {
                font-size: 2.2rem !important;
                justify-content: center !important;
              }
              .quick-actions {
                display: flex !important;
                flex-direction: column !important;
                gap: 16px !important;
              }
              .qa-card {
                display: flex !important;
                align-items: center !important;
                text-align: left !important;
                padding: 20px !important;
                border-radius: 24px !important;
              }
              .qa-icon {
                margin-bottom: 0 !important;
                margin-right: 16px !important;
                width: 60px !important;
                height: 60px !important;
                font-size: 28px !important;
                flex-shrink: 0 !important;
              }
              .qa-card h3 {
                font-size: 1.2rem !important;
                margin-bottom: 4px !important;
              }
              .bottom-nav {
                height: 80px !important;
                border-top-left-radius: 30px !important;
                border-top-right-radius: 30px !important;
                box-shadow: 0 -10px 40px rgba(0,0,0,0.1) !important;
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
