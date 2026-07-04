import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ActivityIndicator, ScrollView, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/Colors';

const SCAN_API = 'https://vinyl-portfolio-eight.vercel.app/api/scan';

export default function ScannerScreen() {
  const [mode, setMode] = useState<'cover' | 'macaron'>('cover');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'OSSATURE a besoin de vos photos.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });
    if (!res.canceled && res.assets[0].base64) {
      setImage(res.assets[0].uri);
      await scanImage(res.assets[0].base64);
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'OSSATURE a besoin de votre caméra.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.7,
    });
    if (!res.canceled && res.assets[0].base64) {
      setImage(res.assets[0].uri);
      await scanImage(res.assets[0].base64);
    }
  }

  async function scanImage(base64: string) {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(SCAN_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mode }),
      });
      const data = await response.json();
      setResult(data);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'identifier ce vinyle.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setImage(null);
    setResult(null);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>IDENTIFY</Text>
        <Text style={styles.subtitle}>Scan cover or label</Text>
      </View>

      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'cover' && styles.modeBtnActive]}
          onPress={() => setMode('cover')}
        >
          <Text style={[styles.modeBtnText, mode === 'cover' && styles.modeBtnTextActive]}>🎵 POCHETTE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'macaron' && styles.modeBtnActive]}
          onPress={() => setMode('macaron')}
        >
          <Text style={[styles.modeBtnText, mode === 'macaron' && styles.modeBtnTextActive]}>⚫ MACARON</Text>
        </TouchableOpacity>
      </View>

      {image ? (
        <View style={styles.previewWrap}>
          <Image source={{ uri: image }} style={styles.preview} />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color={Colors.blue} size="large" />
              <Text style={styles.loadingText}>Identification en cours...</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.dropZone}>
          <Text style={styles.dropIcon}>{mode === 'cover' ? '🎵' : '⚫'}</Text>
          <Text style={styles.dropText}>Photographiez votre vinyle</Text>
          <Text style={styles.dropSub}>Claude identifie le pressage exact</Text>
        </View>
      )}

      {!result && (
        <View style={styles.btnsRow}>
          <TouchableOpacity style={styles.btn} onPress={takePhoto}>
            <Text style={styles.btnText}>📷 Caméra</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={pickImage}>
            <Text style={styles.btnSecondaryText}>🖼️ Galerie</Text>
          </TouchableOpacity>
        </View>
      )}

      {result && !loading && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>{result.title || 'Inconnu'}</Text>
          <Text style={styles.resultArtist}>{result.artist || result.label || ''}</Text>
          <View style={styles.tagsRow}>
            {result.year && <View style={styles.tag}><Text style={styles.tagText}>{result.year}</Text></View>}
            {result.genre && <View style={styles.tag}><Text style={styles.tagText}>{result.genre}</Text></View>}
            {result.country && <View style={styles.tag}><Text style={styles.tagText}>{result.country}</Text></View>}
            <View style={[styles.tag, { borderColor: result.confidence === 'high' ? Colors.green : Colors.muted }]}>
              <Text style={[styles.tagText, { color: result.confidence === 'high' ? Colors.green : Colors.muted2 }]}>
                {result.confidence === 'high' ? '✓ Certain' : '~ Probable'}
              </Text>
            </View>
          </View>
          {result.pressing_details && (
            <Text style={styles.pressingDetails}>{result.pressing_details}</Text>
          )}
          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Text style={styles.resetBtnText}>↩ Scanner un autre</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  header: { marginBottom: 24 },
  title: { fontSize: 22, color: Colors.text, letterSpacing: 4, fontWeight: '300' },
  subtitle: { fontSize: 11, color: Colors.muted2, letterSpacing: 1, marginTop: 4 },
  modeRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  modeBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 0.5, borderColor: Colors.border2, alignItems: 'center' },
  modeBtnActive: { borderColor: Colors.blue, backgroundColor: `${Colors.blue}20` },
  modeBtnText: { fontSize: 11, color: Colors.muted2, letterSpacing: 1 },
  modeBtnTextActive: { color: Colors.blue },
  dropZone: { backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border2, borderStyle: 'dashed', padding: 48, alignItems: 'center', marginBottom: 20 },
  dropIcon: { fontSize: 40, marginBottom: 12 },
  dropText: { fontSize: 14, color: Colors.text, marginBottom: 4 },
  dropSub: { fontSize: 11, color: Colors.muted2, textAlign: 'center' },
  previewWrap: { borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  preview: { width: '100%', aspectRatio: 1, borderRadius: 12 },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: Colors.text, fontSize: 13 },
  btnsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  btn: { flex: 1, backgroundColor: Colors.blue, borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  btnSecondary: { backgroundColor: 'transparent', borderWidth: 0.5, borderColor: Colors.border2 },
  btnSecondaryText: { color: Colors.text, fontSize: 13 },
  resultCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: 20, borderWidth: 0.5, borderColor: Colors.border2 },
  resultTitle: { fontSize: 22, color: Colors.text, fontWeight: '300', marginBottom: 4 },
  resultArtist: { fontSize: 13, color: Colors.muted2, marginBottom: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tag: { borderWidth: 0.5, borderColor: Colors.border2, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 10, color: Colors.muted2, letterSpacing: 0.5 },
  pressingDetails: { fontSize: 12, color: Colors.muted2, lineHeight: 18, marginBottom: 16 },
  resetBtn: { borderWidth: 0.5, borderColor: Colors.border2, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  resetBtnText: { fontSize: 12, color: Colors.muted2 },
});
