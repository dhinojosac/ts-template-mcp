/**
 * MCP Client Example
 * Based on official TypeScript SDK documentation patterns
 * Demonstrates connecting to and using the MCP server
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

// Configuration
const SERVER_URL = "http://localhost:3000/mcp";

/**
 * Example demonstrating MCP client usage following official SDK patterns
 */
async function runClientExample() {
  console.log("🔌 MCP Client Example - Following Official SDK Patterns");
  console.log(`📡 Connecting to MCP server at: ${SERVER_URL}`);

  // Create client instance
  const client = new Client({
    name: "ts-template-mcp-client",
    version: "1.0.0"
  });

  try {
    // Create transport and connect
    const transport = new StreamableHTTPClientTransport(new URL(SERVER_URL));
    await client.connect(transport);
    
    console.log("✅ Connected to MCP server successfully!\n");

    // 1. List available tools
    console.log("🔧 Listing available tools:");
    const tools = await client.listTools();
    console.log(`Found ${tools.tools.length} tools:`);
    tools.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log();

    // 2. Call the sayHello tool
    console.log("👋 Calling sayHello tool:");
    const helloResult = await client.callTool({
      name: "sayHello",
      arguments: {
        name: "MCP Developer"
      }
    });
    
    if (helloResult.content && helloResult.content[0]?.type === "text") {
      console.log(`Response: ${helloResult.content[0].text}`);
    }
    console.log();

    // 3. Call the calculate tool
    console.log("🧮 Calling calculate tool:");
    const calcResult = await client.callTool({
      name: "calculate",
      arguments: {
        operation: "multiply",
        a: 15,
        b: 7
      }
    });
    
    if (calcResult.content && calcResult.content[0]?.type === "text") {
      console.log(`Calculation result: ${calcResult.content[0].text}`);
    }
    console.log();

    // 4. List available resources
    console.log("📚 Listing available resources:");
    const resources = await client.listResources();
    console.log(`Found ${resources.resources.length} resources:`);
    resources.resources.forEach(resource => {
      console.log(`  - ${resource.name} (${resource.uri}): ${resource.description}`);
    });
    console.log();

    // 5. Read server info resource
    console.log("📖 Reading server info resource:");
    const serverInfo = await client.readResource({
      uri: "mcp://server-info"
    });
    
    if (serverInfo.contents && serverInfo.contents[0]?.text) {
      console.log("Server Info:");
      console.log(serverInfo.contents[0].text);
    }
    console.log();

    // 6. Read hello message resource
    console.log("📖 Reading hello message resource:");
    const helloMessage = await client.readResource({
      uri: "mcp://hello-message"
    });
    
    if (helloMessage.contents && helloMessage.contents[0]?.text) {
      console.log("Hello Message:");
      console.log(helloMessage.contents[0].text);
    }
    console.log();

    // 7. List available prompts
    console.log("💭 Listing available prompts:");
    const prompts = await client.listPrompts();
    console.log(`Found ${prompts.prompts.length} prompts:`);
    prompts.prompts.forEach(prompt => {
      console.log(`  - ${prompt.name}: ${prompt.description}`);
    });
    console.log();

    // 8. Get a prompt
    console.log("💬 Getting greeting prompt:");
    const prompt = await client.getPrompt({
      name: "greeting-prompt",
      arguments: {
        name: "Alice",
        style: "enthusiastic"
      }
    });
    
    console.log(`Prompt: ${prompt.description}`);
    if (prompt.messages && prompt.messages[0]?.content?.text) {
      console.log(`Message: ${prompt.messages[0].content.text}`);
    }
    console.log();

  } catch (error) {
    console.error("❌ Error:", error.message);
    
    if (error.message.includes("ECONNREFUSED")) {
      console.error("💡 Make sure the MCP server is running on http://localhost:3000");
      console.error("   Run: npm run dev");
    }
  } finally {
    // Close the connection
    try {
      await client.close();
      console.log("🔌 Connection closed");
    } catch (closeError) {
      console.error("Warning: Error closing connection:", closeError.message);
    }
  }
}

/**
 * Error handling example
 */
async function demonstrateErrorHandling() {
  console.log("\n🚨 Demonstrating error handling:");
  
  const client = new Client({
    name: "error-demo-client",
    version: "1.0.0"
  });

  try {
    const transport = new StreamableHTTPClientTransport(new URL(SERVER_URL));
    await client.connect(transport);

    // Try to call a non-existent tool
    try {
      await client.callTool({
        name: "nonExistentTool",
        arguments: {}
      });
    } catch (toolError) {
      console.log(`✅ Caught expected tool error: ${toolError.message}`);
    }

    // Try to call a tool with invalid arguments
    try {
      await client.callTool({
        name: "calculate",
        arguments: {
          operation: "divide",
          a: 10,
          b: 0 // Division by zero
        }
      });
    } catch (divisionError) {
      console.log(`✅ Caught expected division error: ${divisionError.message}`);
    }

    await client.close();
  } catch (error) {
    console.error("❌ Connection error:", error.message);
  }
}

// Run the examples
console.log("Starting MCP Client Example...\n");

runClientExample()
  .then(() => demonstrateErrorHandling())
  .then(() => {
    console.log("\n🎉 MCP Client example completed!");
    console.log("📚 Learn more: https://github.com/modelcontextprotocol/typescript-sdk");
  })
  .catch(error => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  }); 