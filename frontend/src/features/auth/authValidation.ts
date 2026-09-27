import { isValidEmail, type FieldErrors } from "../../shared/utils/validation";

export interface LoginValues {
    email: string;
    password: string;
}

export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
    const errors: FieldErrors<LoginValues> = {};
    if (!values.email.trim()) errors.email = "Informe o e-mail.";
    else if (!isValidEmail(values.email))
        errors.email = "Informe um e-mail válido.";
    if (!values.password) errors.password = "Informe a senha.";
    return errors;
}

export interface SignupValues {
    companyName: string;
    cnpj: string;
    sector: string;
    city: string;
    companyEmail: string;
    phone: string;
    adminName: string;
    adminEmail: string;
    password: string;
    confirmPassword: string;
}

export function validateSignup(
    values: SignupValues,
): FieldErrors<SignupValues> {
    const errors: FieldErrors<SignupValues> = {};
    if (!values.companyName.trim())
        errors.companyName = "Informe o nome da empresa.";
    if (!values.cnpj.trim()) errors.cnpj = "Informe o CNPJ.";
    if (!values.sector.trim()) errors.sector = "Informe o segmento.";
    if (!values.city.trim()) errors.city = "Informe a cidade e a UF.";
    if (!values.companyEmail.trim())
        errors.companyEmail = "Informe o e-mail da empresa.";
    else if (!isValidEmail(values.companyEmail))
        errors.companyEmail = "Informe um e-mail válido.";
    if (!values.adminName.trim()) errors.adminName = "Informe seu nome.";
    if (!values.adminEmail.trim())
        errors.adminEmail = "Informe seu e-mail de acesso.";
    else if (!isValidEmail(values.adminEmail))
        errors.adminEmail = "Informe um e-mail válido.";
    if (!values.password) errors.password = "Crie uma senha.";
    else if (values.password.length < 6)
        errors.password = "A senha deve ter ao menos 6 caracteres.";
    if (values.confirmPassword !== values.password)
        errors.confirmPassword = "As senhas não coincidem.";
    return errors;
}
