"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthMap } from "@/utils/auth";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    const auth = getAuthMap();
    const clave = auth[email.trim().toLowerCase()];

    if (!clave) {
      toast.error("Correo no autorizado.");
      setLoading(false);
      return;
    }

    if (password !== clave) {
      toast.error("Contraseña incorrecta.");
      setLoading(false);
      return;
    }

    localStorage.setItem("userEmail", email.trim().toLowerCase());
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-950 px-4">
      <Card className="w-full max-w-md shadow-md border">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-blue-900">
            🔒 TRICOLOR
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              placeholder="admin@tricolor.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            Entrar
          </Button>
        </CardFooter>
      </Card>
      <Toaster richColors position="top-center" />
    </div>
  );
}
