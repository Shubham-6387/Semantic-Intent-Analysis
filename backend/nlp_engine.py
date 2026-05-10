import json
import re

class NLPIntentEngine:
    def __init__(self):
        # Expanded keywords to support 8 QoS extraction parameters
        self.keywords = {
            "buffering": {"bandwidth": "high", "latency": "low", "packet_loss": "low", "jitter": "low", "throughput": "high", "congestion_level": "low", "traffic_priority": "high", "streaming_quality": "auto"},
            "lag": {"bandwidth": "high", "latency": "low", "packet_loss": "low", "jitter": "low", "throughput": "high", "congestion_level": "medium", "traffic_priority": "high", "streaming_quality": "auto"},
            "lagging": {"bandwidth": "high", "latency": "low", "packet_loss": "low", "jitter": "low", "throughput": "high", "congestion_level": "medium", "traffic_priority": "high", "streaming_quality": "auto"},
            "drop": {"bandwidth": "medium", "latency": "medium", "packet_loss": "low", "jitter": "low", "throughput": "medium", "congestion_level": "low", "traffic_priority": "medium", "streaming_quality": "auto"},
            "slow": {"bandwidth": "high", "latency": "low", "packet_loss": "medium", "jitter": "medium", "throughput": "high", "congestion_level": "low", "traffic_priority": "high", "streaming_quality": "auto"},
            "quality": {"bandwidth": "high", "latency": "medium", "packet_loss": "low", "jitter": "low", "throughput": "high", "congestion_level": "medium", "traffic_priority": "high", "streaming_quality": "1080p"},
            "freeze": {"bandwidth": "high", "latency": "low", "packet_loss": "low", "jitter": "low", "throughput": "high", "congestion_level": "low", "traffic_priority": "high", "streaming_quality": "auto"},
            "4k": {"bandwidth": "high", "latency": "low", "packet_loss": "low", "jitter": "low", "throughput": "high", "congestion_level": "low", "traffic_priority": "high", "streaming_quality": "4K"},
            "unstable": {"bandwidth": "medium", "latency": "low", "packet_loss": "low", "jitter": "low", "throughput": "medium", "congestion_level": "low", "traffic_priority": "high", "streaming_quality": "auto"}
        }
        
        self.service_types = ["netflix", "youtube", "streaming", "video", "call", "movie"]

    def extract_intent(self, text: str) -> dict:
        text_lower = text.lower()
        
        # Default QoS requirements
        intent = {
            "service": "general_web",
            "bandwidth": "medium",
            "latency": "medium",
            "packet_loss": "medium",
            "jitter": "medium",
            "throughput": "medium",
            "congestion_level": "medium",
            "traffic_priority": "normal",
            "streaming_quality": "720p"
        }
        
        # Extract Service
        for service in self.service_types:
            if service in text_lower:
                intent["service"] = "video_streaming" if service in ["netflix", "youtube", "streaming", "movie", "video"] else "voip"
                break
                
        # Extract QoS parameters based on problem description
        for keyword, qos_params in self.keywords.items():
            if keyword in text_lower:
                for param, value in qos_params.items():
                    intent[param] = value
                    
        # Add a mapped numerical representation for NS-3 parameters
        ns3_mapping = self._map_to_ns3(intent)
        intent["ns3_params"] = ns3_mapping
        
        return intent

    def _map_to_ns3(self, intent: dict) -> dict:
        mapping = {
            "DataRate": "10Mbps",
            "Delay": "15ms",
            "ErrorRate": "0.01",
            "QueueSize": "1000p",
            "Bitrate": "5Mbps",
            "TrafficClass": "0"
        }
        
        if intent["bandwidth"] == "high":
            mapping["DataRate"] = "25Mbps"
        
        if intent["latency"] == "low":
            mapping["Delay"] = "5ms"
            
        if intent["packet_loss"] == "low":
            mapping["ErrorRate"] = "0.0001"
            
        if intent["traffic_priority"] == "high":
            mapping["TrafficClass"] = "1"
            mapping["QueueSize"] = "5000p"
            
        if intent["streaming_quality"] == "4K":
            mapping["Bitrate"] = "20Mbps"
        elif intent["streaming_quality"] == "1080p":
            mapping["Bitrate"] = "10Mbps"
            
        return mapping

if __name__ == "__main__":
    engine = NLPIntentEngine()
    print(json.dumps(engine.extract_intent("4K videos lag badly"), indent=2))
