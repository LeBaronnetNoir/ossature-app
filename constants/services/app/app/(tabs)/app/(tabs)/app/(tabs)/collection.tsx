import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Image, TextInput,
  RefreshControl, ActivityIndicator
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { getCollection } from '../../services/supabase';

const USER = 'estebanveis';

export default function CollectionScreen() {
  const [collection, setCollection] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const data = await getCollection(USER);
      setCollection(data || []);
      setFiltered(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(collection.filter(r =>
      !q || r.title?.toLowerCase().includes(q) || r.artist?.toLowerCase().includes(q)
    ));
  }, [search, collection]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.blue} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CRATE</Text>
        <Text style={styles.count}>{filtered.length} RECORDS</Text>
      </View>

      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search crate..."
          placeholderTextColor={Colors.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={item => String(item.id)}
        columnWrapperStyle={styles.row}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.blue} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            {item.cover_url && !item.cover_url.includes('spacer') ? (
              <Image source={{ uri: item.cover_url }} style={styles.cover} />
            ) : (
              <View style={[styles.cover, styles.coverPlaceholder]}>
                <Text style={styles.placeholderText}>🎵</Text>
              </View>
            )}
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.cardArtist} numberOfLines={1}>{item.artist}</Text>
              <View style={styles.cardFoot}>
                <Text style={styles.cardPrice}>
                  {item.lowest_price ? item.lowest_price.toFixed(2) + ' €' : '—'}
                </Text>
                <Text style={styles.cardYear}>{item.year || ''}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 12 },
  title: { fontSize: 18, color: Colors.text, letterSpacing: 4, fontWeight: '300' },
  count: { fontSize: 10, color: Colors.muted2, letterSpacing: 1 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', margin: 16, marginTop: 0, backgroundColor: Colors.surface, borderRadius: 8, paddingHorizontal: 12, borderWidth: 0.5, borderColor: Colors.border2 },
  searchIcon: { fontSize: 16, color: Colors.muted, marginRight: 8 },
  searchInput: { flex: 1, color: Colors.text, fontSize: 13, paddingVertical: 10 },
  grid: { paddingHorizontal: 12, paddingBottom: 100 },
  row: { gap: 8, marginBottom: 8 },
  card: { flex: 1, backgroundColor: Colors.surface, borderRadius: 8, overflow: 'hidden', borderWidth: 0.5, borderColor: Colors.border },
  cover: { width: '100%', aspectRatio: 1 },
  coverPlaceholder: { backgroundColor: Colors.surface3, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontSize: 32 },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 12, color: Colors.text, fontWeight: '600', marginBottom: 2 },
  cardArtist: { fontSize: 10, color: Colors.muted2, marginBottom: 8 },
  cardFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontSize: 14, color: Colors.blue2, fontWeight: '600' },
  cardYear: { fontSize: 9, color: Colors.muted },
});
