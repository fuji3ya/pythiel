import { Stack } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { C } from '../lib/theme';
import { PYTHIEL_HTML } from './webview-payload';

// Pythiel は design/mockups の HTML アプリ一式（8画面 + engine + フォント + 画像）を
// ビルド時に単一 HTML へインライン化し（scripts/build-webview-payload.mjs →
// app/webview-payload.ts）、WebView 1枚で表示するシェル構成。
// 画面遷移は WebView 内蔵の location.hash ルーターが担当するため、
// expo-router 側のルートは事実上このスクリーンのみになる
// （onboarding.tsx / paywall.tsx / reading.tsx は当面未使用。ファイルは残置）。
export default function Index() {
  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <WebView
        source={{ html: PYTHIEL_HTML, baseUrl: '' }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        bounces={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.navyDeep,
  },
  webview: {
    flex: 1,
    backgroundColor: C.navyDeep,
  },
});
