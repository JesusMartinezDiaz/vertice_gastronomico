#!/bin/bash
curl -s -X POST http://localhost:3001/api/process-instruction \
  -H "Content-Type: application/json" \
  -d '{"instruction":"genera un escrito para solicitar custodia provisional de mi hija Constanza en el expediente 512/2025","agentId":72,"agentName":"Abogado Familiar","agentTools":[],"documents":[]}'
