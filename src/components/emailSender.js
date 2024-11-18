/**
 * Simula o envio de um e-mail contendo informações do ticket.
 * @param {string} email - O e-mail do destinatário.
 * @param {string} token - O token do ticket.
 * @param {string} status - O status atual do ticket.
 * @returns {Promise} Promise simulando uma resposta do servidor.
 */
export const sendEmail = async (email, token, status) => {
    try {
      console.log(`Enviando e-mail para ${email} com token: ${token} e status: ${status}`);
      // Simulação de envio de e-mail (mock do backend)
      return Promise.resolve({ success: true, message: "E-mail enviado com sucesso!" });
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      return Promise.reject({ success: false, message: "Erro ao enviar e-mail." });
    }
  };  