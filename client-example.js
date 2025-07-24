// Example MCP Client using Streamable HTTP Transport
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

async function testMCPClient() {
  console.log('🔌 Connecting to MCP Server...\n');

  // Create client
  const client = new Client({
    name: "example-mcp-client",
    version: "1.0.0"
  });

  // Create HTTP transport
  const transport = new StreamableHTTPClientTransport(
    new URL("http://localhost:3000/mcp")
  );

  try {
    // Connect to server
    await client.connect(transport);
    console.log('✅ Connected to MCP Server\n');

    // Test 1: List available tools
    console.log('📋 Listing available tools...');
    const tools = await client.listTools();
    console.log('Tools:', JSON.stringify(tools, null, 2));

    // Test 2: Call the sayHello tool
    console.log('\n🛠️ Calling sayHello tool...');
    const result = await client.callTool({
      name: "sayHello",
      arguments: {
        name: "from MCP Client"
      }
    });
    console.log('Result:', JSON.stringify(result, null, 2));

    // Test 3: List available resources
    console.log('\n📦 Listing available resources...');
    const resources = await client.listResources();
    console.log('Resources:', JSON.stringify(resources, null, 2));

    // Test 4: Read a resource
    if (resources.resources && resources.resources.length > 0) {
      console.log('\n📖 Reading first resource...');
      const resource = await client.readResource({
        uri: resources.resources[0].uri
      });
      console.log('Resource content:', JSON.stringify(resource, null, 2));
    }

    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Close connection
    await client.close();
    console.log('\n🔌 Disconnected from MCP Server');
  }
}

// Run the client
testMCPClient().catch(console.error); 