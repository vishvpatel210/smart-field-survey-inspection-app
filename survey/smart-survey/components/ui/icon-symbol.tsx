// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

type IconMapping = Record<string, MaterialIconName>;

type IconSymbolName = keyof typeof MAPPING;

const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'add.circle.fill': 'add-circle',
  'clock.fill': 'schedule',
  'person.fill': 'person',
  'camera.fill': 'camera-alt',
  'location.fill': 'location-on',
  'people.fill': 'people',
  'clipboard.fill': 'content-paste',
  'trash.fill': 'delete',
  'pencil.fill': 'edit',
  'checkmark.circle.fill': 'check-circle',
  'arrow.left': 'arrow-back',
  'star.fill': 'star',
  'bell.fill': 'notifications',
  'gearshape.fill': 'settings',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
