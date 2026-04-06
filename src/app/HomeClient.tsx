"use client";

import { ClienteMeta } from "@/lib/types";
import Link from "next/link";
import { Building2, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function HomeClient({ clientes }: { clientes: ClienteMeta[] }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Cliente "${data.empresa}" importado com sucesso! Recarregue a página.`);
      } else {
        setMessage(`Erro: ${data.error}`);
      }
    } catch {
      setMessage("Erro ao enviar arquivo.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-value-bg flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-value-green rounded-2xl flex items-center justify-center font-bold text-white text-4xl mx-auto mb-6 shadow-lg shadow-value-green/30">
          V
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">VALUE BI</h1>
        <p className="text-muted-foreground text-lg">Selecione um cliente para acessar o painel</p>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
        {clientes.map((cliente) => (
          <Link
            key={cliente.slug}
            href={`/cliente/${cliente.slug}`}
            className="bg-value-card border border-value-border rounded-xl p-6 hover:border-value-green/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-value-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-value-green" />
              </div>
              <div>
                <p className="text-white font-medium group-hover:text-value-green transition-colors">
                  {cliente.empresa}
                </p>
                <p className="text-xs text-muted-foreground">/{cliente.slug}</p>
              </div>
            </div>
          </Link>
        ))}

        {/* Import card */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="bg-value-card border border-dashed border-value-border rounded-xl p-6 hover:border-value-green/50 transition-all group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-value-sidebar rounded-lg flex items-center justify-center flex-shrink-0">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-value-green border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-muted-foreground group-hover:text-value-green transition-colors" />
              )}
            </div>
            <div>
              <p className="text-muted-foreground font-medium group-hover:text-white transition-colors">
                {uploading ? "Importando..." : "Importar Planilha"}
              </p>
              <p className="text-xs text-muted-foreground">Upload .xlsx para novo cliente</p>
            </div>
          </div>
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleUpload}
        className="hidden"
      />

      {message && (
        <div className={`text-sm px-4 py-2 rounded-lg mb-4 ${message.includes("Erro") ? "bg-red-500/20 text-red-400" : "bg-value-green/20 text-value-green"}`}>
          {message}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        VALUE Gestão Empresarial — Business Intelligence Financeiro
      </p>
    </div>
  );
}
