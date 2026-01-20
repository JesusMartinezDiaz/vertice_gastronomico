#!/bin/bash
# Auto-sync script for Vértice Gastronómico
# Detecta cambios y hace commit/push automático cada 5 minutos

REPO_DIR="/Users/gustavovanegas/vertice-gastronomico"
INTERVAL=120  # 2 minutos en segundos

cd "$REPO_DIR"

echo "🔄 Auto-sync iniciado para Vértice Gastronómico"
echo "📁 Directorio: $REPO_DIR"
echo "⏱️  Intervalo: ${INTERVAL}s (2 minutos)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

while true; do
    # Verificar si hay cambios
    if [[ -n $(git status --porcelain) ]]; then
        TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

        # Contar archivos modificados
        CHANGED=$(git status --porcelain | wc -l | tr -d ' ')

        echo ""
        echo "[$TIMESTAMP] 📝 Detectados $CHANGED archivo(s) modificado(s)"

        # Añadir todos los cambios
        git add -A

        # Crear mensaje de commit descriptivo
        MODIFIED=$(git diff --cached --name-only | head -5 | tr '\n' ', ' | sed 's/,$//')

        # Commit
        git commit -m "Auto-sync: $CHANGED archivo(s) modificado(s) - $TIMESTAMP

Archivos: $MODIFIED

🤖 Auto-commit by sync script"

        # Push
        if git push origin main 2>&1; then
            echo "[$TIMESTAMP] ✅ Push exitoso a GitHub"
        else
            echo "[$TIMESTAMP] ❌ Error en push - se reintentará"
        fi
    else
        echo "[$(date "+%H:%M:%S")] ✓ Sin cambios"
    fi

    sleep $INTERVAL
done
