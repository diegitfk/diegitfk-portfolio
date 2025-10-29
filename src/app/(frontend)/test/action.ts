"use server"
/*
Hacer la invocación del agente directamente en el servidor, es por ello
que se hace uso de use server, para asegurar que las funciones definidas
directamente en este archivo se ejecutan directamente en el servidor.
*/
import { mastra } from "@/mastra/index";
 
export async function getWeatherInfo(formData: FormData) {
  const city = formData.get("city")?.toString();
  const agent = mastra.getAgent("weatherAgent");
  console.log(agent)
  const result = await agent.generate(`What's the weather like in ${city}?`);
 
  return result.text;
}