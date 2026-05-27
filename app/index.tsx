import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useDatabase } from '@/context/DatabaseContext';

export default function Index() {
  const { user, isLoading } = useAuth();
  const { isReady } = useDatabase();

  if (isLoading || !isReady) {
    return (
      <View style={styles.splash}>
        <Text variant="logo" color={Colors.textOnDark}>
          <Text variant="logo" color={Colors.textOnDark}>
            Campus
          </Text>
          <Text variant="logo" color={Colors.purpleMid}>
            Events
          </Text>
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
});
