from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nlp_engine import NLPIntentEngine
from ns3_orchestrator import NS3Orchestrator

app = FastAPI(title="N-FLOW AI Intent API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

nlp_engine = NLPIntentEngine()
ns3_orchestrator = NS3Orchestrator()

class ComplaintRequest(BaseModel):
    text: str

@app.post("/api/optimize")
async def optimize_network(request: ComplaintRequest):
    try:
        # 1. NLP Intent Understanding
        intent = nlp_engine.extract_intent(request.text)
        
        # 2. Extract NS-3 Parameters
        ns3_params = intent.get("ns3_params", {})
        
        # 3. Execute NS-3 Simulation & Collect Metrics
        metrics = ns3_orchestrator.run_simulation(ns3_params)
        
        # Generate a confidence score based on keyword match depth (mocked as 94% for prototype)
        confidence_score = 94.5
        
        return {
            "status": "success",
            "intent_parsed": intent,
            "ns3_parameters_applied": ns3_params,
            "metrics": metrics,
            "confidence_score": confidence_score
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
