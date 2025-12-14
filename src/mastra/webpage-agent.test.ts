#!/usr/bin/env node

/**
 * Simple test for the WebPage Agent
 * Tests basic functionality and response generation
 */

import 'dotenv/config';
import { mastra } from "./index";

async function testWebPageAgent() {
  console.log('🚀 Testing WebPage Agent...\n');
  const WebPageAgent = mastra.getAgent("WebPageAgent");

  try {
    // Test 1: Basic greeting
    console.log('Test 1: Basic greeting');
    console.log('Input: "Hola, ¿quién eres?"');
    const response1 = await WebPageAgent.generate('Hola, ¿quién eres?');
    console.log('Output:', response1.text);
    console.log('---\n');

    // Test 2: Technical question
    console.log('Test 2: Technical question');
    console.log('Input: "¿Qué tecnologías usas en tu portfolio?"');
    const response2 = await WebPageAgent.generate('¿Qué tecnologías usas en tu portfolio?');
    console.log('Output:', response2.text);
    console.log('---\n');

    // Test 3: Help with navigation
    console.log('Test 3: Help with navigation');
    console.log('Input: "¿Dónde puedo ver tus proyectos?"');
    const response3 = await WebPageAgent.generate('¿Dónde puedo ver tus proyectos?');
    console.log('Output:', response3.text);
    console.log('---\n');

    console.log('✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testWebPageAgent();
