import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { getStats, getCollection } from '../../services/supabase';

const USER = 'estebanveis';

export default function DashboardScreen() {
  const [stats, setStats] = useState<any>(null);
  const [collection, setCollection] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const [s, c] = await Promise.all([getStats(), getCollection(USER)]);
      setStats(s);
      setCollection(c || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  const totalValue = stats?.total_value?.toFixed(2) || '0.00';
  const count = stats?.count || 0;
  const gainers = [...collection]
    .filter(r => r.lowest_price)
    .sort((a, b) => (b.lowest_price || 0) - (a.lowest_price || 0))
    .slice(0, 5);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.blue} size="large" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.blue} />}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>OSSATURE</Text>
        <Text style={styles.subtitle}>VAULT_01 · COLLECTION</Text>
      </View>

      <View style={styles.valueCard}>
        <Text style={styles.valueLabel}>TOTAL COLLECTION VALUE</Text>
        <View style={styles.valueRow}>
          <Text style={styles.valueAmount}>{totalValue} €</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>{count} RECORDS</Text>
          <Text style={styles.statText}>30 DAYS</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TOP GAINERS</Text>
          <Text style={styles.sectionSub}>30D ↑</Text>
        </View>
        {gainers.map((r, i) => (
          <View key={r.id} style={styles.gainerRow}>
            <View style={styles.gainerLeft}>
              <Text style={styles.gainerRank}>{String(i + 1).padStart(2, '0')}</Text>
              <View>
                <Text style={styles.gainerTitle} numberOfLines={1}>{r.title}</Text>
                <Text style={styles.gainerArtist}>{r.artist}</Text>
              </View>
            </View>
            <View style={styles.gainerRight}>
              <Text style={styles.gainerPrice}>{r.lowest_price?.toFixed(2)}€</Text>
              <Text style={styles.gainerChange}>▲ TOP</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statCardVal}>{count}</Text>
          <Text style={styles.statCardLabel}>RECORDS</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardVal}>
            {count > 0 ? (parseFloat(totalValue) / count).toFixed(0) : '0'}€
          </Text>
          <Text style={styles.statCardLabel}>AVG</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardVal}>{Math.round(parseFloat(totalValue))}€</Text>
          <Text style={styles.statCardLabel}>TOTAL</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: Colors.muted2, marginTop: 12, fontSize: 11 },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  logo: { fontSize: 22, color: Colors.text, letterSpacing: 6, fontWeight: '300' },
  subtitle: { fontSize: 10, color: Colors.muted2, letterSpacing: 2, marginTop: 2 },
  valueCard: { margin: 16, backgroundColor: Colors.surface, borderRadius: 12, padding: 20, borderWidth: 0.5, borderColor: Colors.border2 },
  valueLabel: { fontSize: 9, color: Colors.muted, letterSpacing: 2, marginBottom: 8 },
  valueRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  valueAmount: { fontSize: 42, color: Colors.text, fontWeight: '300', letterSpacing: -1 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.green },
  liveText: { fontSize: 9, color: Colors.green, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  statText: { fontSize: 10, color: Colors.muted2 },
  section: { margin: 16, marginTop: 0 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 10, color: Colors.muted, letterSpacing: 2 },
  sectionSub: { fontSize: 10, color: Colors.blue },
  gainerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  gainerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  gainerRank: { fontSize: 11, color: Colors.muted, width: 24 },
  gainerTitle: { fontSize: 13, color: Colors.text, fontWeight: '500', maxWidth: 180 },
  gainerArtist: { fontSize: 11, color: Colors.muted2, marginTop: 2 },
  gainerRight: { alignItems: 'flex-end' },
  gainerPrice: { fontSize: 15, color: Colors.text, fontWeight: '600' },
  gainerChange: { fontSize: 10, color: Colors.green, marginTop: 2 },
  statsGrid: { flexDirection: 'row', margin: 16, gap: 8 },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 8, padding: 14, alignItems: 'center', borderWidth: 0.5, borderColor: Colors.border2 },
  statCardVal: { fontSize: 20, color: Colors.blue2, fontWeight: '600' },
  statCardLabel: { fontSize: 8, color: Colors.muted, letterSpacing: 1.5, marginTop: 4 },
});
