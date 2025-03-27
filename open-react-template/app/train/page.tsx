import {AuthProvider} from "@/utils/AuthContext";
import Train from "@/components/train";
export default function Home() {
  return (
    <AuthProvider>
      <Train />
    </AuthProvider>
  );
}
