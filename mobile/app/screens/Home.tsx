import React from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useUsers } from '../hooks/useUsers';

export default function Home() {
  const { users, loading } = useUsers();

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 100 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <Text style={styles.text}>{item.name} ({item.email})</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  text: { fontSize: 18, marginVertical: 5 },
});
