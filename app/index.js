import { Redirect } from "expo-router";
import { auth } from "../firebase/firebaseConfig";

export default function Index() {
  const user = auth.currentUser;

  if (user) {
    return <Redirect href="/(tabs)/index" />;
  }

  return <Redirect href="/auth/login" />;
}