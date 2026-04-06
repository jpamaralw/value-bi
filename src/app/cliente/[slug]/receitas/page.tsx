import { getClienteData, getAllClienteSlugs } from "@/lib/clientes";
import { notFound } from "next/navigation";
import ReceitasClient from "./ReceitasClient";

export async function generateStaticParams() {
  return getAllClienteSlugs().map((slug) => ({ slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  const data = getClienteData(params.slug);
  if (!data) notFound();
  return <ReceitasClient clienteData={data} />;
}
