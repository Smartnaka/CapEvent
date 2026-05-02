import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/src/design/tokens';
import { useMoments } from '@/src/hooks/useMoments';

export function DailySummaryScreen() {
  const { moments, isLoading, error } = useMoments();
  const grouped = moments.reduce<Record<string, number>>((acc, m) => { const day = m.createdAt.slice(0, 10); acc[day] = (acc[day] || 0) + 1; return acc; }, {});

  return <SafeAreaView style={styles.container}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.topRow}><Feather name="chevron-left" size={22} color={Colors.textMuted} /><Text style={styles.title}>Marketing Summit 2025</Text><Feather name="more-horizontal" size={20} color={Colors.textMuted} /></View><View style={styles.tabRow}><Text style={[styles.tab, styles.activeTab]}>Timeline</Text><Text style={styles.tab}>Gallery</Text></View>{isLoading ? <ActivityIndicator color={Colors.accent} /> : null}{error ? <Text style={styles.error}>{error}</Text> : null}{!isLoading && !error && moments.length === 0 ? <Text style={styles.empty}>No moments captured yet.</Text> : null}{Object.entries(grouped).slice(0,2).map(([day,count],index)=><View key={day}><View style={styles.dayHeader}><Text style={styles.dayTitle}>{new Date(day).toLocaleDateString()}</Text><Text style={styles.dayMeta}>Day {index+1}</Text></View><View style={styles.grid3}>{Array.from({length:3}).map((_,i)=><View key={i} style={[styles.tile,{opacity:Math.max(0.35,Math.min(1,count/3))}]} />)}</View></View>)}</ScrollView></SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:Colors.background},content:{padding:Spacing.md,paddingBottom:120},topRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10},title:{...Typography.heading,fontSize:24},tabRow:{flexDirection:'row',gap:32,borderBottomColor:Colors.border,borderBottomWidth:1,marginBottom:12},tab:{...Typography.subheadline,color:Colors.textMuted,paddingBottom:10},activeTab:{color:Colors.accent,borderBottomWidth:3,borderBottomColor:Colors.accent},dayHeader:{flexDirection:'row',justifyContent:'space-between',marginBottom:8,marginTop:4},dayTitle:{...Typography.subheadline,color:Colors.textMuted},dayMeta:{...Typography.subheadline,color:Colors.textFaint},grid3:{flexDirection:'row',gap:8,marginBottom:10},tile:{flex:1,aspectRatio:1,borderRadius:Radius.lg,...Shadow.soft,backgroundColor:'#2B5CAA'},empty:{color:Colors.textMuted},error:{color:Colors.danger}});
