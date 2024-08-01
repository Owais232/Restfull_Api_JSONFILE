import React, { useState } from "react";
import { ScrollView, Text, View, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const fetchdata = () => {
  const [inputId, setInputId] = useState<string>('');
  const [data, setData] = useState<Post | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const apiCall = async (id: string) => {
    const url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    setLoading(true);
    setError(null); // Reset the error state
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result: Post = await response.json();
      setData(result);
    } catch (err) {
      setError(err as Error);
      setData(null);  // Reset data to null in case of error
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = () => {
    if (inputId.trim() !== '') {
      apiCall(inputId);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text>API Data from Browser</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter ID"
          value={inputId}
          onChangeText={setInputId}
          keyboardType="numeric"
        />
        <Button title="Fetch Data" onPress={handleFetchData} />
        
        {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}

        {error && <Text style={styles.errorText}>Error: {error.message}</Text>}

        {data && !loading ? (
          <View style={styles.postContainer}>
            <Text>User ID: {data.userId}</Text>
            <Text>ID: {data.id}</Text>
            <Text>Title: {data.title}</Text>
            <Text>Body: {data.body}</Text>
          </View>
        ) : (
          !loading && !error && <Text>Enter an ID to fetch data</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  postContainer: {
    padding: 10,
    borderBottomWidth: 1,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default fetchdata;
