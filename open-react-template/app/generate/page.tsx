import {AuthProvider} from "@/utils/AuthContext";
import {Generate} from "@/components/generate";
export default function Home() {
  return (
    <AuthProvider>
      < Generate/>
    </AuthProvider>
  );
}