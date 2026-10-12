import { useState } from "react";
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabInset } from "@/constants/theme";

export default function HomeScreen() {
  const [apiKey, setApiKey] = useState("");
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");

  async function getQuestion() {
    console.log(apiKey);
    console.log(category);

    if (!apiKey || !category) {
      setMessage("Enter a groq API key and a category");
      return;
    }
    setMessage("");
    setAnswer("");

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
                  "Create one medium difficulty trivia question about the category. Return JSON with two strings: 'question' and 'correct-answer'. Use a short, unambiguous answer. Do not include any additional text besides the JSONobject",
              },
              { role: "user", content: `Category: ${category}` },
            ],
          }),
        }
      );
      const responseData = await response.json();
      console.log("Response recceived");
      console.log(responseData);
      const data = JSON.parse(responseData.choices[0].message.content);
      console.log(data.question);
      console.log(data.correct_answer);
      setQuestion(data.question);
      setCorrectAnswer(data.correct_answer);
    } catch (error) {
      setMessage(`There was an error: ${error.message}`);
    }
  }
  function checkAnswer() {
    if (answer === correctAnswer) {
      setMessage("Thats Correct");
    } else {
      setMessage("Thats not correct!");
    }
  }
  return (
    <div>
      <br />
      <br />
      <h4>API Key:</h4>
      <TextInput value={apiKey} onChangeText={setApiKey} />
      <h4>Category:</h4>
      <TextInput value={category} onChangeText={setCategory} />
      <h2>{message}</h2>
      <Button title="Get question" onPress={getQuestion} />
      <div>
        <h3>Question:</h3>
        <p>{question}</p>
      </div>
    </div>
  );
}
