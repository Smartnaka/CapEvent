import { Platform, Pressable } from 'react-native';

export function HapticTab(props: React.ComponentProps<typeof Pressable>) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        { opacity: pressed && Platform.OS !== 'ios' ? 0.7 : 1 },
        typeof props.style === 'function' ? props.style({ pressed }) : props.style,
      ]}
    />
  );
}
