import { useAzureMonitor } from "@azure/monitor-opentelemetry";

console.log("Initializing Azure Monitor...");
console.log("Using Connection String:", process.env.APPLICATIONINSIGHTS_CONNECTION_STRING);
console.log("Monitoring setup in progress...");
useAzureMonitor({
  azureMonitorExporterOptions: {
    connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
  }
});
