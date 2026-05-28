/**
 * Validadores para formulários de checkout
 */

export const validators = {
  /**
   * Valida CEP brasileiro (formato: XXXXX-XXX ou XXXXXXXX)
   */
  cep: (value: string): boolean => {
    const cepRegex = /^\d{5}-?\d{3}$/;
    return cepRegex.test(value.replace(/\D/g, ""));
  },

  /**
   * Valida email
   */
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  /**
   * Valida telefone brasileiro (formato: (XX) XXXXX-XXXX ou similar)
   */
  phone: (value: string): boolean => {
    const phoneRegex = /^(\+55)?[\s]?(\(?\d{2}\)?)?[\s]?9?\d{4}-?\d{4}$/;
    return phoneRegex.test(value.replace(/\D/g, ""));
  },

  /**
   * Valida nome (mínimo 3 caracteres, sem números)
   */
  name: (value: string): boolean => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,}$/;
    return nameRegex.test(value);
  },

  /**
   * Valida UF (estado) - 2 letras
   */
  state: (value: string): boolean => {
    const stateRegex = /^[A-Z]{2}$/;
    return stateRegex.test(value.toUpperCase());
  },

  /**
   * Valida endereço (mínimo 5 caracteres)
   */
  address: (value: string): boolean => {
    return value.trim().length >= 5;
  },

  /**
   * Valida cidade (mínimo 2 caracteres)
   */
  city: (value: string): boolean => {
    const cityRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
    return cityRegex.test(value);
  },
};

/**
 * Formata CEP: 12345678 -> 12345-678
 */
export const formatCEP = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
};

/**
 * Formata telefone: 11999999999 -> (11) 99999-9999
 */
export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

/**
 * Retorna mensagem de erro para validação
 */
export const getErrorMessage = (field: string, value: string): string | null => {
  switch (field) {
    case "fullName":
      if (!value) return "Nome completo é obrigatório";
      if (value.length < 3) return "Nome deve ter pelo menos 3 caracteres";
      if (!validators.name(value)) return "Nome inválido";
      return null;

    case "email":
      if (!value) return "E-mail é obrigatório";
      if (!validators.email(value)) return "E-mail inválido";
      return null;

    case "phone":
      if (!value) return "Telefone é obrigatório";
      if (!validators.phone(value)) return "Telefone inválido (use formato: (11) 99999-9999)";
      return null;

    case "address":
      if (!value) return "Endereço é obrigatório";
      if (!validators.address(value)) return "Endereço deve ter pelo menos 5 caracteres";
      return null;

    case "city":
      if (!value) return "Cidade é obrigatória";
      if (!validators.city(value)) return "Cidade inválida";
      return null;

    case "state":
      if (!value) return "Estado é obrigatório";
      if (!validators.state(value)) return "Estado deve ser 2 letras (ex: SP)";
      return null;

    case "zipCode":
      if (!value) return "CEP é obrigatório";
      if (!validators.cep(value)) return "CEP inválido (use formato: 12345-678)";
      return null;

    default:
      return null;
  }
};
