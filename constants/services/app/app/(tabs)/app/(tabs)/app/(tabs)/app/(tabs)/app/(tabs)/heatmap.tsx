import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors } from '../../constants/Colors';
import { getCollection } from '../../services/supabase';

const USER = 'estebanveis';

export default function HeatmapScreen() {
  const [collection, setCollection] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const data = await getCollection(USER);
      setCollection(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }

  useEffect(() => { load(); }, []);

  const sorted = [...collection].sort((a, b) => (b.lowest_price || 0) - (a.lowest_price || 0));
  const topGainers = sorted.slice(0, 8);
  const undervalued = sorted.filter(r => r.lowest_price && r.lowest_price < 10).slice(0, 6);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator color={Colors.blue} size="large" />
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.blue} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>PULSE</Text>
        <Text style={styles.subtitle}>Collection heatmap</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{topGainers.length}</Text>
          <Text style={styles.statLabel}>TOP MOVERS</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: Colors.green }]}>
            {collection.filter(r => r.lowest_price).length}
          </Text>
          <Text style={styles.statLabel}>TRACKED</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{collection.length}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💎 MOST VALUABLE</Text>
        <View style={styles.grid}>
          {topGainers.map(r => (
            <View key={r.id} style={styles.card}>
              {r.cover_url && !r.cover_url.includes('spacer') ? (
                <Image source={{ uri: r.cover_url }} style={styles.cover} />
              ) : (
                <View style={[styles.cover, styles.coverPlaceholder]}>
                  <Text style={{ fontSize: 24 }}>🎵</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>{r.title}</Text>
                <Text style={styles.cardArtist} numberOfLines={1}>{r.artist}</Text>
                <View style={styles.cardFoot}>
                  <Text style={styles.cardPrice}>{r.lowest_price?.toFixed(2)}€</Text>
                  <Text style={[styles.cardChange, { color: Colors.green }]}>▲ TOP</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {undervalued.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 UNDER 10€</Text>
          <View style={styles.grid}>
            {undervalued.map(r => (
              <View key={r.id} style={styles.card}>
                {r.cover_url && !r.cover_url.includes('spacer') ? (
                  <Image source={{ uri: r.cover_url }} style={styles.cover} />
                ) : (
                  <View style={[styles.cover, styles.coverPlaceholder]}>
                    <Text style={{ fontSize: 24 }}>🎵</Text>
                  </View>
                )}
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{r.title}</Text>
                  <Text style={styles.cardArtist} numberOfLines={1}>{r.artist}</Text>
                  <View style={styles.cardFoot}>
                    <Text style={styles.cardPrice}>{r.lowest_price?.toFixed(2)}€</Text>
                    <Text style={[styles.cardChange, { color: Colors.red }]}>▼ LOW</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  header: { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16 },
  title: { fontSize: 22, color: Colors.text, letterSpacing: 4, fontWeight: '300' },
  subtitle: { fontSize: 11, color: Colors.muted2, letterSpacing: 1, marginTop: 4 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 0.5, borderColor: Colors.border2 },
  statVal: { fontSize: 22, color: Colors.blue2, fontWeight: '600' },
  statLabel: { fontSize: 8, color: Colors.muted, letterSpacing: 1.5, marginTop: 4 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 10, color: Colors.muted, letterSpacing: 2, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  card: { width: '48%', backgroundColor: Colors.surface, borderRadius: 8, overflow: 'hidden', borderWidth: 0.5, borderColor: Colors.border },
  cover: { width: '100%', aspectRatio: 1 },
  coverPlaceholder: { backgroundColor: Colors.surface3, alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 8 },
  cardTitle: { fontSize: 11, color: Colors.text, fontWeight: '600', marginBottom: 2 },
  cardArtist: { fontSize: 10, color: Colors.muted2, marginBottom: 6 },
  cardFoot: { flexDirection: 'row', justifyContent: 'space-between' },
  cardPrice: { fontSize: 13, color: Colors.blue2, fontWeight: '600' },
  cardChange: { fontSize: 10 },
});
