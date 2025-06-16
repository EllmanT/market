import {
    anthropic,
    createNetwork,
    getDefaultRoutingAgent,
} from "@inngest/agent-kit"
import {createServer} from "@inngest/agent-kit/server"
import { inngest } from "./client";
import { databaseAgent } from "./agents/databaseAgent";
import { docScanningAgent } from "./agents/docScanningAgent";
import Events from "@/constants/constants";

const agentNetwork = createNetwork({

    name:"Agent Team",
    agents:[databaseAgent, docScanningAgent],
    defaultModel: anthropic({
        model: "claude-3-5-sonnet-latest",
        defaultParameters:{
            max_tokens:1000,
        }
    }),
    defaultRouter:({network})=>{
        const savedToDatabase = network.state.kv.get("save-to-database");

        if(savedToDatabase !==undefined){
            // Terminate the agent process if the data has been saved to the database

            return undefined;
        }

        return getDefaultRoutingAgent()
    }
})

export const server = createServer({
    agents:[databaseAgent, docScanningAgent],
    networks:[agentNetwork]
});

export const extractAndSavePDF = inngest.createFunction(
    {id: "Extract PDF and Save in Database"},
    {event: Events.EXTRACT_DATA_AND_SAVE_TO_DB},


    async({event})=>{
        const result = await agentNetwork.run(
            `Extract the key data from this pdf: ${event.data.url}, Once the data is extracted , save it to the database using the docId: ${event.data.docId}.
             Once the document is successflly saved to the database you can terminate the agent process.`
        )
        return result.state.kv.get("doc")
    }

)