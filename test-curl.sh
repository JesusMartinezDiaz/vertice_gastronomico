#!/bin/bash
curl -s -X POST http://localhost:3001/api/process-instruction \
  -H "Content-Type: application/json" \
  -d '{"instruction":"que el agente 72 revise el expediente 512 y realice los escritos necesarios","agentId":1,"agentName":"CEO","agentTools":[],"documents":[]}'
