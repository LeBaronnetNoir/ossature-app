import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import { getStats, getCollection } from '../../services/supabase';

const USER = 'estebanveis';

export default function ProfileScreen() {
  const [stats, setStats] = useState<any>(null);
  const [collection, setCollection] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getCollection(USER)])
      .then(([s, c]) => { setStats(s); setCollection(c || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalValue = stats?.total_value?.toFixed(2) || '0.00';
  const count = stats?.count || 0;

  const genres: Record<string, number> = {};
  collection.forEach(r => {
    if (r.genre) r.genre.split(', ').forEach((g: string) => {
      genres[g] = (genres[g] || 0) + 1;
    });
  });
  const topGenres = Object.entries(genres).sort((a, b) => b[1] - a[1]).slice(0, 4);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator color={Colors.blue} size="large" />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>LB</Text>
        </View>
        <View>
          <Text style={styles.username}>LeBaronnetNoir</Text>
          <Text style={styles.badge}>🥈 Silver Collector</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{count}</Text>
          <Text style={styles.statLabel}>RECORDS</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{totalValue}€</Text>
          <Text style={styles.statLabel}>VALUE</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>
            {count > 0 ? (parseFloat(totalValue) / count).toFixed(0) : '0'}€
          </Text>
          <Text style={styles.statLabel}>AVG</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>COLLECTION DNA</Text>
        {topGenres.map(([genre, cnt]) => {
          const pct = Math.round(cnt / count * 100);
          return (
            <View key={genre} style={styles.genreRow}>
              <Text style={styles.genreName}>{genre}</Text>
              <View style={styles.genreBar}>
                <View style={[styles.genreFill, { width: `${pct}%` }]} />
              </View>
              <Text style={styles.genrePct}>{pct}%</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCÈS</Text>
        <TouchableOpacity style={styles.linkRow}>
          <Text style={styles.linkText}>🌐 App Web OSSATURE</Text>
          <Text
