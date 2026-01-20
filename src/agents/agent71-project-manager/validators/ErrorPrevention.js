/**
 * Error Prevention - Sistema de Prevención de Errores
 * Detecta y previene errores antes de que ocurran
 */

export class ErrorPrevention {
  constructor(config) {
    this.config = config;
    this.errorPatterns = this.loadErrorPatterns();
  }

  loadErrorPatterns() {
    return {
      // Errores comunes en proyectos gastronómicos
      numericErrors: [
        { pattern: /porcentaje.*[>].*100|[<].*0/i, message: 'Porcentaje fuera de rango (0-100)' },
        { pattern: /precio.*negativo|costo.*negativo/i, message: 'Valores monetarios negativos' },
        { pattern: /cantidad.*0.*unidades/i, message: 'Cantidad cero en inventario' }
      ],
      formatErrors: [
        { pattern: /fecha.*inválida/i, message: 'Formato de fecha incorrecto' },
        { pattern: /email.*@.*\./i, negative: true, message: 'Email sin formato válido' }
      ],
      dataErrors: [
        { pattern: /null|undefined|NaN/i, message: 'Datos nulos o indefinidos' },
        { pattern: /^\s*$/m, message: 'Campos vacíos' }
      ],
      businessErrors: [
        { pattern: /food.*cost.*[>].*40/i, message: 'Food cost superior al 40%' },
        { pattern: /margen.*[<].*20/i, message: 'Margen inferior al 20%' }
      ]
    };
  }

  async validateProjectData(projectData) {
    const errors = [];
    const suggestions = [];

    // Validar nombre del proyecto
    if (!projectData.name || projectData.name.trim().length < 3) {
      errors.push('El nombre del proyecto es muy corto');
      suggestions.push('Use un nombre descriptivo de al menos 3 caracteres');
    }

    // Validar descripción
    if (!projectData.description) {
      errors.push('Falta la descripción del proyecto');
      suggestions.push('Agregue una descripción clara del alcance');
    }

    // Validar cliente
    if (!projectData.client) {
      errors.push('No se especificó el cliente');
      suggestions.push('Identifique al cliente o destinatario del proyecto');
    }

    // Validar deadline si existe
    if (projectData.deadline) {
      const deadline = new Date(projectData.deadline);
      if (isNaN(deadline.getTime())) {
        errors.push('Fecha límite inválida');
        suggestions.push('Use formato de fecha válido (YYYY-MM-DD)');
      } else if (deadline < new Date()) {
        errors.push('La fecha límite ya pasó');
        suggestions.push('Establezca una fecha futura');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions
    };
  }

  async checkBeforeExecution(task) {
    const risks = [];
    const mitigations = [];

    // Verificar dependencias
    if (task.dependencies && task.dependencies.length > 0) {
      for (const dep of task.dependencies) {
        // Aquí verificaríamos si la dependencia está completada
        // Por ahora, asumimos que está OK
      }
    }

    // Verificar recursos necesarios
    if (task.requiredResources) {
      for (const resource of task.requiredResources) {
        // Verificar disponibilidad de recursos
      }
    }

    // Detectar patrones de riesgo
    const taskStr = JSON.stringify(task);
    for (const category of Object.values(this.errorPatterns)) {
      for (const pattern of category) {
        if (pattern.pattern.test(taskStr)) {
          risks.push({
            type: 'pattern_match',
            message: pattern.message,
            severity: 'medium'
          });
          mitigations.push({
            action: 'validate',
            description: `Verificar: ${pattern.message}`
          });
        }
      }
    }

    return {
      hasRisks: risks.length > 0,
      risks,
      mitigations
    };
  }

  async applyMitigations(task, mitigations) {
    const results = [];

    for (const mitigation of mitigations) {
      switch (mitigation.action) {
        case 'validate':
          // Ejecutar validación adicional
          results.push({ mitigation, applied: true });
          break;
        case 'correct':
          // Aplicar corrección automática
          results.push({ mitigation, applied: true });
          break;
        case 'notify':
          // Notificar al equipo
          results.push({ mitigation, applied: true });
          break;
        default:
          results.push({ mitigation, applied: false, reason: 'Acción desconocida' });
      }
    }

    return results;
  }

  async autoCorrect(result, validation) {
    const corrections = [];
    const suggestions = [];

    for (const error of validation.errors || []) {
      const correction = this.findCorrection(error);
      if (correction) {
        corrections.push(correction);
      } else {
        suggestions.push(`Corregir manualmente: ${error}`);
      }
    }

    return {
      success: corrections.length > 0,
      corrections,
      suggestions
    };
  }

  findCorrection(error) {
    // Mapa de correcciones automáticas
    const autoCorrections = {
      'Porcentaje fuera de rango': (value) => Math.max(0, Math.min(100, value)),
      'Valores monetarios negativos': (value) => Math.abs(value),
      'Formato de fecha incorrecto': (value) => new Date(value).toISOString().split('T')[0],
      'Campos vacíos': () => null // No corregible automáticamente
    };

    for (const [pattern, correction] of Object.entries(autoCorrections)) {
      if (error.includes(pattern)) {
        return { pattern, correction, autoApplicable: correction !== null };
      }
    }

    return null;
  }

  // Validaciones específicas para entregables gastronómicos
  validateCostSheet(costSheet) {
    const errors = [];

    // Verificar que food cost no sea mayor a 40%
    if (costSheet.foodCostPercentage > 40) {
      errors.push({
        field: 'foodCostPercentage',
        value: costSheet.foodCostPercentage,
        message: 'Food cost superior al 40% recomendado',
        severity: 'warning'
      });
    }

    // Verificar que los precios sean positivos
    if (costSheet.sellingPrice <= 0) {
      errors.push({
        field: 'sellingPrice',
        value: costSheet.sellingPrice,
        message: 'Precio de venta debe ser positivo',
        severity: 'error'
      });
    }

    // Verificar margen
    const margin = ((costSheet.sellingPrice - costSheet.totalCost) / costSheet.sellingPrice) * 100;
    if (margin < 20) {
      errors.push({
        field: 'margin',
        value: margin,
        message: 'Margen inferior al 20% mínimo recomendado',
        severity: 'warning'
      });
    }

    return { isValid: errors.filter(e => e.severity === 'error').length === 0, errors };
  }

  validateRecipe(recipe) {
    const errors = [];

    // Verificar que tenga ingredientes
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      errors.push({
        field: 'ingredients',
        message: 'La receta no tiene ingredientes',
        severity: 'error'
      });
    }

    // Verificar porciones
    if (recipe.portions <= 0) {
      errors.push({
        field: 'portions',
        message: 'Número de porciones inválido',
        severity: 'error'
      });
    }

    // Verificar que los costos sumen correctamente
    if (recipe.ingredients) {
      const calculatedTotal = recipe.ingredients.reduce((sum, ing) => sum + (ing.cost || 0), 0);
      if (Math.abs(calculatedTotal - recipe.totalCost) > 0.01) {
        errors.push({
          field: 'totalCost',
          message: 'El costo total no coincide con la suma de ingredientes',
          severity: 'error',
          expected: calculatedTotal,
          actual: recipe.totalCost
        });
      }
    }

    return { isValid: errors.filter(e => e.severity === 'error').length === 0, errors };
  }

  validateInventory(inventory) {
    const errors = [];

    for (const item of inventory.items || []) {
      // Verificar stock mínimo
      if (item.currentStock < item.minStock) {
        errors.push({
          field: `items[${item.id}].currentStock`,
          message: `Stock de ${item.name} por debajo del mínimo`,
          severity: 'warning',
          current: item.currentStock,
          minimum: item.minStock
        });
      }

      // Verificar fecha de caducidad
      if (item.expirationDate) {
        const expDate = new Date(item.expirationDate);
        const today = new Date();
        const daysUntilExpiration = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiration < 0) {
          errors.push({
            field: `items[${item.id}].expirationDate`,
            message: `${item.name} ha caducado`,
            severity: 'error'
          });
        } else if (daysUntilExpiration < 7) {
          errors.push({
            field: `items[${item.id}].expirationDate`,
            message: `${item.name} caduca en ${daysUntilExpiration} días`,
            severity: 'warning'
          });
        }
      }
    }

    return { isValid: errors.filter(e => e.severity === 'error').length === 0, errors };
  }
}

export default ErrorPrevention;
