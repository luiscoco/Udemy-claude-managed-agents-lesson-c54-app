import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 54,
  title: "Monitoring Multi-agent Telemetry",
  description: "A coordinator’s final message cannot explain everything that happened across its workers. We need to connect session identities, thread activity, model usage, and observation failures to the originating workflow.",
  concepts: ["Authorize each telemetry source", "Deduplicate per source and event", "Primary and child coverage differ"],
  scope: "Aggregates authored worker telemetry without mixing cumulative snapshots into request totals. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Deduplicate worker spans", "input": {"workers": 2, "duplicateSpans": true, "includeSessionSnapshot": true}, "expected": "passed", "checks": {"requestTokens": 200}}, {"id": "1", "label": "A single worker window", "input": {"workers": 1, "duplicateSpans": false, "includeSessionSnapshot": false}, "expected": "passed", "checks": {"requestTokens": 100}}],
  async run(input) {

const workers=number(input,"workers");if(!Number.isInteger(workers)||workers<1||workers>8)throw new Error("Use one to eight worker tracks");
const seen=new Set<string>(),tracks:Input[]=[];let total=0;
for(let w=0;w<workers;w++){const key=`session-${w}:thread-${w}:span-1`;const deliveries=flag(input,"duplicateSpans")?2:1;for(let i=0;i<deliveries;i++){if(seen.has(key))continue;seen.add(key);total+=100;tracks.push({sessionId:`session-${w}`,threadId:`thread-${w}`,tokens:100});}}
return report("passed","Aggregated the authorized authored request tracks",{requestTokens:total,tracks,sessionSnapshot:flag(input,"includeSessionSnapshot")?{tokens:total}:null,snapshotAddedToTotal:false,coverage:"authored tracks only"},["Authorize every session and thread","Deduplicate using the full source key","Sum distinct request spans","Keep session snapshots outside the sum"]);

  }
};
