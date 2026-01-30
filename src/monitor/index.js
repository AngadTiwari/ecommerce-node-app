import { useAzureMonitor } from "@azure/monitor-opentelemetry";

console.log("Initializing Azure Monitor...");
console.log("Using Connection String:", process.env.APPLICATIONINSIGHTS_CONNECTION_STRING);
useAzureMonitor({
  azureMonitorExporterOptions: {
    connectionString: "InstrumentationKey=bd104e2f-fada-4bb7-9628-7d3a234f848f;IngestionEndpoint=https://centralindia-0.in.applicationinsights.azure.com/;LiveEndpoint=https://centralindia.livediagnostics.monitor.azure.com/;ApplicationId=c3cf30ef-c36a-4790-a3bf-a40259582d4b"
  }
});
