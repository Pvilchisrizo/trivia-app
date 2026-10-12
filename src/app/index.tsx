import { use, useState } from "react";
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
  const [trivia, setTrivia] = useState("");
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");

  async function getQuestion() {
    if (!apiKey || !category){
      setMessage("Enter a groq API key and a category")
      return
    }
    setMessage("")
    setTrivia("null")
    setAnswer("")

    try{
      const response = await.fetch("https://api.groq.com/openai/v1/chat/completions",{
        method: "POST",
        headers:{
          Authorization: `Bearer ${apiKey}`,
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          response_format: {type: "json_object"},
          messages: [
            {role:"system", content: "Create one medium difficulty trivia question about the category. Return JSON with two strings: 'question' and 'correct-answer'. Use a short, unambiguous answer. Do not include any additional text besides the JSONobject"},
            {role: "user", content: `Category: ${category}`}
          ]
        })
    
      })

    }
  }
}
