import { getClientesList } from "@/lib/clientes";
import HomeClient from "./HomeClient";

export default function Page() {
  const clientes = getClientesList();
  return <HomeClient clientes={clientes} />;
}
