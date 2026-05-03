import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors, Radius, Shadow, Typography } from '@/src/design/tokens';
import { useEvents } from '@/src/hooks/useEvents';

export function HomeDashboardScreen() {
  const router = useRouter();
  const { events, isLoading, error, refresh } = useEvents();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}><Text style={styles.logo}>🍋</Text><Text style={styles.brand}>CapEvent <Text style={styles.brandAccent}>AI</Text></Text><Feather name="bell" size={20} color={Colors.textMuted} /></View>
        <Text style={styles.greeting}>Good morning!</Text>
        <Text style={styles.subtext}>Ready to capture your{`\n`}next big memory?</Text>
        <View style={styles.sectionRow}><Text style={styles.sectionTitle}>Upcoming Events</Text><Pressable onPress={refresh}><Text style={styles.seeAll}>Refresh</Text></Pressable></View>

        {isLoading ? <ActivityIndicator color={Colors.accent} /> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!isLoading && !error && events.length === 0 ? <Text style={styles.emptyText}>No events yet. Add events from your backend feed or event creation flow.</Text> : null}

        {events.slice(0, 3).map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.thumb} />
            <View style={styles.eventMeta}>
              <Text style={styles.eventTitle}>{event.name}</Text>
              <Text style={styles.eventSub}>{new Date(event.createdAt).toLocaleDateString()}</Text>
              <Text style={styles.eventSub}>📍 {event.venue}</Text>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 6 }]}>Quick Access</Text>
        <View style={styles.quickGrid}>
          <Pressable style={[styles.quickCard, { backgroundColor: '#A67CE8' }]} onPress={() => router.push('/(tabs)/capture')}><Feather name="camera" color="#fff" size={19} /><Text style={styles.quickLabel}>Capture{`\n`}Moment</Text></Pressable>
          <Pressable style={[styles.quickCard, { backgroundColor: '#84C797' }]} onPress={refresh}><Feather name="calendar" color="#fff" size={19} /><Text style={styles.quickLabel}>My Events</Text></Pressable>
          <Pressable style={[styles.quickCard, { backgroundColor: '#F3A165' }]} onPress={() => router.push('/(tabs)/summary')}><Feather name="file-text" color="#fff" size={19} /><Text style={styles.quickLabel}>Timeline</Text></Pressable>
          <Pressable style={[styles.quickCard, { backgroundColor: '#74A9EA' }]} onPress={() => router.push('/(tabs)/profile')}><Feather name="bar-chart-2" color="#fff" size={19} /><Text style={styles.quickLabel}>Insights</Text></Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({container:{flex:1,backgroundColor:Colors.background},content:{paddingHorizontal:16,paddingTop:8,paddingBottom:120},brandRow:{flexDirection:'row',alignItems:'center',marginBottom:14},logo:{fontSize:30,marginRight:8},brand:{...Typography.heading,flex:1,fontSize:34,fontWeight:'800'},brandAccent:{color:Colors.accent},greeting:{...Typography.title,fontSize:38,marginBottom:6},subtext:{...Typography.body,color:Colors.textMuted,marginBottom:16,lineHeight:27},sectionRow:{flexDirection:'row',justifyContent:'space-between',marginBottom:8},sectionTitle:{...Typography.label,color:Colors.text,fontSize:18,marginBottom:10},seeAll:{...Typography.label,color:Colors.accent,fontSize:14},eventCard:{backgroundColor:Colors.surface,borderRadius:Radius.xl,borderColor:Colors.border,borderWidth:1,padding:10,flexDirection:'row',gap:10,marginBottom:10,...Shadow.soft},thumb:{width:62,height:62,borderRadius:Radius.lg,backgroundColor:'#C5D4EF'},eventMeta:{flex:1},eventTitle:{...Typography.subheadline,color:Colors.text,fontSize:17,marginBottom:2},eventSub:{...Typography.caption,color:Colors.textMuted,fontSize:13},quickGrid:{flexDirection:'row',gap:10,marginBottom:20},quickCard:{flex:1,borderRadius:Radius.xl,paddingVertical:15,paddingHorizontal:10,alignItems:'center',justifyContent:'center',minHeight:102},quickLabel:{color:'#fff',fontWeight:'700',fontSize:12,textAlign:'center',marginTop:8},errorText:{color:Colors.danger,marginBottom:10},emptyText:{color:Colors.textMuted,marginBottom:10}});
