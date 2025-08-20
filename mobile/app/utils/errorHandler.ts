import { Alert } from 'react-native';

export function handleError(error: unknown) {
  console.error('[ERROR]', error);
  const message =
    error instanceof Error ? error.message : 'An unknown error occurred.';
  Alert.alert('Error', message);
}
