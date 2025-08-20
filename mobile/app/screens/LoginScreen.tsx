import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      // Replace this alert with your real login logic
      Alert.alert('Login Successful', `Welcome, ${username}!`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={[styles.input, errors.username && styles.inputError]}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}

      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <Button title="Login" onPress={handleLogin} disabled={!username || !password} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff4d4f',
  },
  errorText: {
    color: '#ff4d4f',
    marginBottom: 8,
    marginLeft: 4,
  },
});
