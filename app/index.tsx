import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { C } from '../lib/theme';
import { PYTHIEL_HTML } from './webview-payload';

// Pythiel は design/mockups の HTML アプリ一式（8画面 + engine + フォント + 画像）を
// ビルド時に単一 HTML へインライン化し（scripts/build-webview-payload.mjs →
// app/webview-payload.ts）、WebView 1枚で表示するシェル構成。
// 画面遷移は WebView 内蔵の location.hash ルーターが担当する。
//
// storage ブリッジ:
// WKWebView に HTML 文字列を直接ロードすると origin が無く、
// localStorage が永続しない（実機バグ 2026-07-18: 誕生日が毎回消え、
// デモ値 1992-03-15 = うお座の鑑定に化けた）。対策として WebView 内の
// localStorage / sessionStorage を polyfill で常時置換し、書き込みを
// postMessage で RN 側 AsyncStorage に永続化、起動時に注入し返す。

const PERSIST_KEY = 'pythiel.persist';

function buildInjection(persisted: Record<string, string>): string {
  return `
(function(){
  var seed = ${JSON.stringify(persisted)};
  function makeStore(mem, onWrite){
    return {
      getItem: function(k){ return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
      setItem: function(k, v){ mem[k] = String(v); if (onWrite) onWrite(mem); },
      removeItem: function(k){ delete mem[k]; if (onWrite) onWrite(mem); },
      clear: function(){ for (var k in mem) delete mem[k]; if (onWrite) onWrite(mem); },
      key: function(i){ return Object.keys(mem)[i] || null; },
      get length(){ return Object.keys(mem).length; }
    };
  }
  function persist(mem){
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'persist', data: mem }));
    } catch (e) {}
  }
  var localMem = {};
  for (var k in seed) localMem[k] = seed[k];
  try {
    Object.defineProperty(window, 'localStorage', { value: makeStore(localMem, persist), configurable: true });
    Object.defineProperty(window, 'sessionStorage', { value: makeStore({}, null), configurable: true });
  } catch (e) {}
})();
true;`;
}

export default function Index() {
  const [persisted, setPersisted] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(PERSIST_KEY)
      .then((raw) => setPersisted(raw ? JSON.parse(raw) : {}))
      .catch(() => setPersisted({}));
  }, []);

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg && msg.type === 'persist' && msg.data && typeof msg.data === 'object') {
        AsyncStorage.setItem(PERSIST_KEY, JSON.stringify(msg.data)).catch(() => {});
      }
    } catch {
      // ignore malformed messages
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      {persisted !== null && (
        <WebView
          source={{ html: PYTHIEL_HTML, baseUrl: '' }}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          bounces={false}
          injectedJavaScriptBeforeContentLoaded={buildInjection(persisted)}
          onMessage={onMessage}
        />
      )}
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
