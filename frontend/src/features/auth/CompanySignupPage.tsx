import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "../../shared/components/Form/Field";
import { PublicTemplate } from "../../shared/layouts/PublicTemplate";
import { useAuth } from "../../shared/auth/useAuth";
import { hasErrors, type FieldErrors } from "../../shared/utils/validation";
import { validateSignup, type SignupValues } from "./authValidation";

const INITIAL_VALUES: SignupValues = {
    companyName: "",
    cnpj: "",
    sector: "",
    city: "",
    companyEmail: "",
    phone: "",
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
};

export function CompanySignupPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [values, setValues] = useState<SignupValues>(INITIAL_VALUES);
    const [errors, setErrors] = useState<FieldErrors<SignupValues>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setField = <K extends keyof SignupValues>(
        field: K,
        value: SignupValues[K],
    ) => {
        setValues((current) => ({ ...current, [field]: value }));
        if (errors[field])
            setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextErrors = validateSignup(values);
        if (hasErrors(nextErrors)) {
            setErrors(nextErrors);
            return;
        }
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await register({
                companyName: values.companyName.trim(),
                cnpj: values.cnpj.trim(),
                sector: values.sector.trim(),
                city: values.city.trim(),
                companyEmail: values.companyEmail.trim(),
                phone: values.phone.trim() || undefined,
                adminName: values.adminName.trim(),
                adminEmail: values.adminEmail.trim(),
                password: values.password,
            });
            navigate("/", { replace: true });
        } catch (error) {
            const message =
                (error as { response?: { data?: { error?: string } } })
                    ?.response?.data?.error ??
                "Não foi possível concluir o cadastro. Tente novamente.";
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PublicTemplate
            title="Cadastre sua empresa"
            description="Crie o acesso administrador da sua empresa no painel."
            footer={
                <p>
                    Já tem uma conta? <Link to="/login">Entrar</Link>
                </p>
            }
        >
            <form className="form-grid" noValidate onSubmit={handleSubmit}>
                <div className="form-grid__full">
                    <TextField
                        label="Nome da empresa"
                        required
                        value={values.companyName}
                        onValueChange={(value) =>
                            setField("companyName", value)
                        }
                        error={errors.companyName}
                        autoComplete="organization"
                        autoFocus
                    />
                </div>
                <TextField
                    label="CNPJ"
                    required
                    value={values.cnpj}
                    onValueChange={(value) => setField("cnpj", value)}
                    error={errors.cnpj}
                    placeholder="00.000.000/0000-00"
                />
                <TextField
                    label="Segmento"
                    required
                    value={values.sector}
                    onValueChange={(value) => setField("sector", value)}
                    error={errors.sector}
                />
                <TextField
                    label="Cidade / UF"
                    required
                    value={values.city}
                    onValueChange={(value) => setField("city", value)}
                    error={errors.city}
                    placeholder="São Paulo / SP"
                />
                <TextField
                    label="Telefone"
                    type="tel"
                    value={values.phone}
                    onValueChange={(value) => setField("phone", value)}
                    placeholder="(00) 0000-0000"
                />
                <div className="form-grid__full">
                    <TextField
                        label="E-mail da empresa"
                        type="email"
                        required
                        value={values.companyEmail}
                        onValueChange={(value) =>
                            setField("companyEmail", value)
                        }
                        error={errors.companyEmail}
                    />
                </div>
                <TextField
                    label="Seu nome"
                    required
                    value={values.adminName}
                    onValueChange={(value) => setField("adminName", value)}
                    error={errors.adminName}
                    autoComplete="name"
                />
                <TextField
                    label="Seu e-mail de acesso"
                    type="email"
                    required
                    value={values.adminEmail}
                    onValueChange={(value) => setField("adminEmail", value)}
                    error={errors.adminEmail}
                    autoComplete="email"
                />
                <TextField
                    label="Senha"
                    type="password"
                    required
                    value={values.password}
                    onValueChange={(value) => setField("password", value)}
                    error={errors.password}
                    hint="Mínimo de 6 caracteres."
                    autoComplete="new-password"
                />
                <TextField
                    label="Confirmar senha"
                    type="password"
                    required
                    value={values.confirmPassword}
                    onValueChange={(value) =>
                        setField("confirmPassword", value)
                    }
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                />
                {submitError && (
                    <div className="form-grid__full">
                        <p className="field__error">{submitError}</p>
                    </div>
                )}
                <div className="form-grid__full">
                    <button
                        type="submit"
                        className="button button--primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Cadastrando…" : "Cadastrar empresa"}
                    </button>
                </div>
            </form>
        </PublicTemplate>
    );
}
