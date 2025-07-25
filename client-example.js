/**
 * MCP Client Example
 * Demonstrates connecting to and using the MCP server with current SDK version
 * Tests tools and resources available in our TypeScript MCP server
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

// Configuration
const SERVER_URL = "http://localhost:3000/mcp";

/**
 * Example demonstrating MCP client usage with our current server implementation
 */
async function runClientExample() {
  console.log("🔌 MCP Client Example - TypeScript Server Template");
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
    console.log("Calling sayHello tool:");
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

    // 3. Call the calculate tool with different operations
    console.log("🧮 Testing calculate tool:");
    
    const operations = [
      { operation: "add", a: 15, b: 7 },
      { operation: "multiply", a: 8, b: 9 },
      { operation: "divide", a: 100, b: 4 },
      { operation: "subtract", a: 50, b: 23 }
    ];

    for (const calc of operations) {
      const calcResult = await client.callTool({
        name: "calculate",
        arguments: calc
      });
      
      if (calcResult.content && calcResult.content[0]?.type === "text") {
        console.log(`  ${calcResult.content[0].text}`);
      }
    }
    console.log();

    // 4. Test the new weather tools
    console.log("🌤️ Testing weather tools:");
    
    // Test weather forecast
    try {
      const forecastResult = await client.callTool({
        name: "getWeatherForecast",
        arguments: {
          latitude: 40.7128,
          longitude: -74.0060
        }
      });
      
      if (forecastResult.content && forecastResult.content[0]?.type === "text") {
        console.log(`  Forecast: ${forecastResult.content[0].text}`);
      }
    } catch (error) {
      console.log(`  Forecast error: ${error.message}`);
    }

    // Test weather alerts
    try {
      const alertsResult = await client.callTool({
        name: "getWeatherAlerts",
        arguments: {
          state: "CA"
        }
      });
      
      if (alertsResult.content && alertsResult.content[0]?.type === "text") {
        console.log(`  Alerts: ${alertsResult.content[0].text}`);
      }
    } catch (error) {
      console.log(`  Alerts error: ${error.message}`);
    }
    console.log();

    // 5. List available resources
    console.log("📚 Listing available resources:");
    const resources = await client.listResources();
    console.log(`Found ${resources.resources.length} resources:`);
    resources.resources.forEach(resource => {
      console.log(`  - ${resource.name} (${resource.uri}): ${resource.description}`);
    });
    console.log();

    // 6. Read server info resource
    console.log("📖 Reading server info resource:");
    const serverInfo = await client.readResource({
      uri: "mcp://server-info"
    });
    
    if (serverInfo.contents && serverInfo.contents[0]?.text) {
      console.log("Server Info:");
      const info = JSON.parse(serverInfo.contents[0].text);
      console.log(`  Name: ${info.name}`);
      console.log(`  Version: ${info.version}`);
      console.log(`  Description: ${info.description}`);
      console.log(`  Transport: ${info.transport}`);
      console.log(`  Tools: ${info.tools.length}`);
      info.tools.forEach(tool => {
        console.log(`    - ${tool.name}: ${tool.parameters}`);
      });
    }
    console.log();

    // 7. Read hello message resource
    console.log("📖 Reading hello message resource:");
    const helloMessage = await client.readResource({
      uri: "mcp://hello-message"
    });
    
    if (helloMessage.contents && helloMessage.contents[0]?.text) {
      console.log("Hello Message:");
      console.log(helloMessage.contents[0].text);
    }
    console.log();

  } catch (error) {
    console.error("Error:", error.message);
    
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
 * Error handling and edge cases demonstration
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

    // Try to call calculate with invalid arguments
    try {
      await client.callTool({
        name: "calculate",
        arguments: {
          operation: "invalidOp",
          a: 10,
          b: 5
        }
      });
    } catch (calcError) {
      console.log(`✅ Caught expected calculation error: ${calcError.message}`);
    }

    // Try to call calculate with division by zero
    try {
      await client.callTool({
        name: "calculate",
        arguments: {
          operation: "divide",
          a: 10,
          b: 0
        }
      });
    } catch (divisionError) {
      console.log(`✅ Caught expected division error: ${divisionError.message}`);
    }

    // Try to read a non-existent resource
    try {
      await client.readResource({
        uri: "mcp://non-existent"
      });
    } catch (resourceError) {
      console.log(`✅ Caught expected resource error: ${resourceError.message}`);
    }

    await client.close();
  } catch (error) {
    console.error("Connection error:", error.message);
  }
}

// Run the examples
console.log("Starting MCP Client Example...\n");

runClientExample()
  .then(() => demonstrateErrorHandling())
  .then(() => {
    console.log("\nMCP Client example completed!");
    console.log("📚 Learn more: https://github.com/modelcontextprotocol/typescript-sdk");
    console.log("🔗 Your server: https://github.com/dhinojosac/ts-template-mcp");
  })
  .catch(error => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  }); 