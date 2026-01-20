#!/bin/bash
curl -s -X POST http://localhost:3001/api/process-instruction \
  -H "Content-Type: application/json" \
  -d '{"instruction":"redacta un escrito de pension alimenticia","agentId":1,"agentName":"CEO","agentTools":[],"documents":[]}'
