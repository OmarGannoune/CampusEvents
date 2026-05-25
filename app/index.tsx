import { Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/context/DatabaseContext';

export default function Index() {
  const { user, isLoading } = useAuth();
  const { isReady } = useDatabase();

  if (isLoading || !isReady) {
    return (
      <View style={styles.splash}>
        <Text style={[Typography.logo, styles.logo]}>
          <Text style={styles.logoPrimary}>Campus</Text>
          <Text style={styles.logoAccent}>Events</Text>
        </Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  if (user.role === 'admin') {
    return <Redirect href="/(admin)/" />;
  }

  return <Redirect href="/(student)/events/" />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: Colors.textOnDark,
  },
  logoPrimary: {
    color: Colors.textOnDark,
  },
  logoAccent: {
    color: Colors.purpleMid,
  },
});
