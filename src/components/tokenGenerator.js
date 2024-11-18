// tokenGenerator.js
/**
 * Gera um token único para um ticket.
 * O token é baseado na quantidade de formulários existentes.
 * @param {number} formCount - Quantidade de formulários já criados.
 * @returns {string} Token gerado.
 */
export const generateToken = (formCount) => {
    return `ticket#${formCount + 1}`;
  };  