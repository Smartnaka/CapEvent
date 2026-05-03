import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Radius, Shadow, Spacing, Typography } from '@/src/design/tokens';
import { Button } from '@/src/components/Button';
import { useMoments } from '@/src/hooks/useMoments';

const TAGS = ['#sunset', '#team', '#memories'];

export function MomentCaptureScreen() {
  const { addMoment } = useMoments();
  const [caption, setCaption] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSave = async () => {
    setSuccess(null);
    if (!caption.trim()) {
      setError('Please add a caption before saving.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await addMoment({
        type: 'photo',
        content: caption.trim(),
        tags: TAGS.map((tag) => tag.replace('#', '')),
        createdAt: new Date().toISOString(),
      });
      setCaption('');
      setSuccess('Moment saved successfully.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save moment.');
    } finally {
      setIsSaving(false);
    }
  };

  return <SafeAreaView style={styles.container}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.topRow}><Feather name="x" size={22} color={Colors.textMuted} /><Text style={styles.screenTitle}>Capture Moment</Text><View style={{ width: 22 }} /></View><Text style={styles.headline}>What's the moment?</Text><Text style={styles.subline}>Capture it your way.</Text><View style={styles.previewCard}><View style={styles.sparkleBadge}><Text style={styles.sparkle}>✦</Text></View></View><View style={styles.captureButtonOuter}><View style={styles.captureButtonInner} /></View><TextInput value={caption} onChangeText={setCaption} style={styles.captionInput} placeholder="Add a caption..." placeholderTextColor={Colors.textFaint} maxLength={400} /><View style={styles.tagsRow}>{TAGS.map((tag) => (<View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>))}</View>{error ? <Text style={styles.error}>{error}</Text> : null}{success ? <Text style={styles.success}>{success}</Text> : null}{isSaving ? <ActivityIndicator color={Colors.accent} /> : null}<Button label="Save Moment ✨" onPress={onSave} disabled={isSaving} /></ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({container:{flex:1,backgroundColor:Colors.background},content:{padding:Spacing.md,gap:Spacing.sm,paddingBottom:120},topRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8},screenTitle:{...Typography.heading,fontSize:24},headline:{...Typography.heading,textAlign:'center',fontSize:36,marginTop:4},subline:{...Typography.body,textAlign:'center',color:Colors.textMuted,marginBottom:10},previewCard:{height:330,borderRadius:Radius.xl,backgroundColor:'#B69A84',...Shadow.card,marginBottom:8},sparkleBadge:{position:'absolute',top:10,left:10,width:30,height:30,borderRadius:Radius.full,backgroundColor:'rgba(32,32,32,0.42)',alignItems:'center',justifyContent:'center'},sparkle:{color:'#fff',fontSize:18},captureButtonOuter:{alignSelf:'center',width:78,height:78,borderRadius:Radius.full,borderWidth:4,borderColor:Colors.accent,alignItems:'center',justifyContent:'center',marginVertical:6},captureButtonInner:{width:60,height:60,borderRadius:Radius.full,backgroundColor:Colors.accent},captionInput:{backgroundColor:Colors.surface,borderWidth:1,borderColor:Colors.border,borderRadius:Radius.xl,paddingHorizontal:16,paddingVertical:14,...Typography.body},tagsRow:{flexDirection:'row',gap:8,marginBottom:8},tag:{backgroundColor:Colors.surfaceElevated,borderRadius:Radius.full,paddingHorizontal:12,paddingVertical:6},tagText:{...Typography.caption,color:Colors.textMuted,fontWeight:'600'},error:{color:Colors.danger},success:{color:Colors.success}});
