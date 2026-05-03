import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/src/design/tokens';
import { useDailySummary } from '@/src/hooks/useDailySummary';
import { useMoments } from '@/src/hooks/useMoments';

export function ProfileScreen() {
  const { summary, isLoading, error } = useDailySummary();
  const { moments } = useMoments();
  const total = moments.length;
  const tags = Array.from(new Set(moments.flatMap((m) => m.tags))).slice(0, 4);

  return <SafeAreaView style={styles.container}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.topRow}><Feather name="chevron-left" size={22} color={Colors.textMuted} /><Text style={styles.title}>Event Insights</Text><Feather name="more-horizontal" size={20} color={Colors.textMuted} /></View><Text style={styles.eventTitle}>Marketing Summit 2025</Text><Text style={styles.eventMeta}>Live AI event recap</Text><View style={styles.recapCard}><Text style={styles.recapTitle}>AI Recap ✨</Text>{isLoading ? <ActivityIndicator color={Colors.accent} /> : null}{error ? <Text style={styles.error}>{error}</Text> : null}<Text style={styles.recapSub}>{summary?.summaryText ?? 'No summary available yet.'}</Text><View style={styles.statRow}><Feather name="camera" size={16} color="#8C69DE" /><Text style={styles.statLabel}>{total} memories captured</Text></View></View><Text style={styles.sectionTitle}>Key Themes</Text><Text style={styles.sectionSub}>What stood out the most</Text><View style={styles.themeRow}>{(tags.length ? tags : ['No themes yet']).map((theme) => (<View key={theme} style={styles.themePill}><Text style={styles.themeText}>{theme}</Text></View>))}</View></ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({container:{flex:1,backgroundColor:Colors.background},content:{padding:Spacing.md,paddingBottom:120},topRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8},title:{...Typography.heading,fontSize:24},eventTitle:{...Typography.heading,fontSize:38,marginBottom:2},eventMeta:{...Typography.subheadline,color:Colors.textMuted,marginBottom:14},recapCard:{backgroundColor:'#F3ECFF',borderRadius:Radius.xl,borderWidth:1,borderColor:'#E4D8FF',padding:14,gap:10,...Shadow.soft},recapTitle:{...Typography.heading,fontSize:32},recapSub:{...Typography.body,color:Colors.textMuted},statRow:{flexDirection:'row',alignItems:'center',gap:10},statLabel:{...Typography.caption,color:Colors.textMuted,fontSize:13},sectionTitle:{...Typography.heading,marginTop:14,fontSize:30},sectionSub:{...Typography.caption,color:Colors.textMuted,marginBottom:8},themeRow:{flexDirection:'row',gap:8,flexWrap:'wrap'},themePill:{backgroundColor:Colors.surfaceElevated,borderRadius:Radius.full,paddingHorizontal:12,paddingVertical:8},themeText:{...Typography.caption,color:Colors.textMuted,fontWeight:'700'},error:{color:Colors.danger}});
