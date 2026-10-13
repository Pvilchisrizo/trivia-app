import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Result = "correct" | "wrong" | "error" | null;

export default function HomeScreen() {
  const [apiKey, setApiKey] = useState("");
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function getQuestion() {
    if (!apiKey || !category) {
      setMessage("Enter a Groq API key and a category");
      setResult("error");
      return;
    }
    setMessage("");
    setResult(null);
    setAnswer("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content:
                  "Create one medium difficulty trivia question about the category. Return JSON with two strings: 'question' and 'correct_answer'. Use a short, unambiguous answer. Do not include any additional text besides the JSON object",
              },
              { role: "user", content: `Category: ${category}` },
            ],
          }),
        }
      );
      const responseData = await response.json();
      const data = JSON.parse(responseData.choices[0].message.content);
      setQuestion(data.question);
      setCorrectAnswer(data.correct_answer);
    } catch (error) {
      setMessage(`There was an error: ${(error as Error).message}`);
      setResult("error");
    } finally {
      setLoading(false);
    }
  }

  function checkAnswer() {
    if (answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      setMessage("That's correct! 🎉");
      setResult("correct");
    } else {
      setMessage(`Not quite! The answer was: ${correctAnswer}`);
      setResult("wrong");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>🎯 Trivia Time</Text>
        <Text style={styles.subtitle}>Pick a category and test yourself</Text>

        <View style={styles.card}>
          <Text style={styles.label}>API key</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="gsk_..."
            placeholderTextColor="#A99BD6"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="e.g. History, Movies, Science"
            placeholderTextColor="#A99BD6"
          />
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
            onPress={getQuestion}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Get question</Text>
            )}
          </Pressable>
        </View>

        {question !== "" && (
          <View style={styles.card}>
            <Text style={styles.questionTag}>QUESTION</Text>
            <Text style={styles.question}>{question}</Text>
            <TextInput
              style={styles.input}
              value={answer}
              onChangeText={setAnswer}
              placeholder="Your answer"
              placeholderTextColor="#A99BD6"
              onSubmitEditing={checkAnswer}
            />
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
              onPress={checkAnswer}
            >
              <Text style={styles.buttonText}>Check answer</Text>
            </Pressable>
          </View>
        )}

        {message !== "" && (
          <View
            style={[
              styles.banner,
              result === "correct" && styles.bannerCorrect,
              result === "wrong" && styles.bannerWrong,
              result === "error" && styles.bannerError,
            ]}
          >
            <Text style={styles.bannerText}>{message}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#5B3FD9",
  },
  container: {
    padding: 20,
    gap: 16,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#DCD3FF",
    textAlign: "center",
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    gap: 10,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3B2A8F",
  },
  input: {
    backgroundColor: "#F3EFFF",
    borderWidth: 2,
    borderColor: "#E2D9FF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1E1450",
  },
  button: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: "#FF6B6B",
  },
  secondaryButton: {
    backgroundColor: "#FFB020",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  questionTag: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#8A75E8",
  },
  question: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E1450",
    lineHeight: 30,
    marginBottom: 4,
  },
  banner: {
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  bannerCorrect: {
    backgroundColor: "#2BC48A",
  },
  bannerWrong: {
    backgroundColor: "#FF5A5F",
  },
  bannerError: {
    backgroundColor: "#3B2A8F",
  },
  bannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
