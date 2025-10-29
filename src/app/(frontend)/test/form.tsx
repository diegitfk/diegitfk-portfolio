"use client";
/*
Archivo que se sirve directamente en el cliente, por ende es necesario utilizarlo
cono use client, dado que es el cliente el que asume el coste de renderizado del componente.
y este archivo invoca directamente a la función del agente, para que se ejecute en el servidor.
*/
import { useState } from "react";
import { getWeatherInfo } from "./action";
 
export function Form() {
  const [result, setResult] = useState<string | null>(null);
 
  async function handleSubmit(formData: FormData) {
    const res = await getWeatherInfo(formData);
    setResult(res);
  }
 
  return (
    <>
      <form action={handleSubmit}>
        <input name="city" placeholder="Enter city" required />
        <button type="submit">Get Weather</button>
      </form>
      {result && <pre>{result}</pre>}
    </>
  );
}