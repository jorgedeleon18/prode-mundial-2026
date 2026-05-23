import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { flagUrl, fn } from '../data/paises';

const FLAG_EMOJI = {
  'mx':'🇲🇽','za':'🇿🇦','kr':'🇰🇷','cz':'🇨🇿','ca':'🇨🇦','ba':'🇧🇦',
  'qa':'🇶🇦','ch':'🇨🇭','br':'🇧🇷','ma':'🇲🇦','ht':'🇭🇹',
  'gb-sct':'🏴󠁧󠁢󠁳󠁣󠁴󠁿','us':'🇺🇸','py':'🇵🇾','au':'🇦🇺','tr':'🇹🇷',
  'de':'🇩🇪','cw':'🇨🇼','ci':'🇨🇮','ec':'🇪🇨','nl':'🇳🇱','jp':'🇯🇵',
  'se':'🇸🇪','tn':'🇹🇳','be':'🇧🇪','eg':'🇪🇬','ir':'🇮🇷','nz':'🇳🇿',
  'es':'🇪🇸','cv':'🇨🇻','sa':'🇸🇦','uy':'🇺🇾','fr':'🇫🇷','sn':'🇸🇳',
  'iq':'🇮🇶','no':'🇳🇴','ar':'🇦🇷','dz':'🇩🇿','at':'🇦🇹','jo':'🇯🇴',
  'pt':'🇵🇹','cd':'🇨🇩','uz':'🇺🇿','co':'🇨🇴','gb-eng':'🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'hr':'🇭🇷','gh':'🇬🇭','pa':'🇵🇦',
};

export default function Bandera({ pais, size = 40 }) {
  const url = flagUrl(pais, 80);
  const [error, setError] = useState(false);

  if (!url || error) {
    // Fallback emoji
    const { FCODE } = require('../data/paises');
    const code = FCODE[pais];
    const emoji = code ? (FLAG_EMOJI[code] || '🌍') : '🌍';
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: size * 0.75 }}>{emoji}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: url }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      onError={() => setError(true)}
      resizeMode="cover"
    />
  );
}
