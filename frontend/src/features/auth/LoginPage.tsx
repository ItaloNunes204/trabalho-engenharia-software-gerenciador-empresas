import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TextField } from "../../shared/components/Form/Field";
import { PublicTemplate } from "../../shared/layouts/PublicTemplate";
import { useAuth } from "../../shared/auth/useAuth";
import { hasErrors, type FieldErrors } from "../../shared/utils/validation";
import { validateLogin, type LoginValues } from "./authValidation";

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
    const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setField = <K extends keyof LoginValues>(field: K, value: LoginValues[K]) => {
        setValues((current) => ({ ...current, [field]: value }));
        if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextErrors = validateLogin(values);
        if (hasErrors(nextErrors)) {
            setErrors(nextErrors);
            return;
        }
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await login(values.email.trim(), values.password);
            const redirectTo = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? "/";
            navigate(redirectTo, { replace: true });
        } catch {
            setSubmitError("E-mail ou senha inválidos.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PublicTemplate
            title="Entrar"
            description="Acesse o painel da sua empresa."
            footer={
                <p>
                    Ainda não tem uma conta? <Link to="/cadastro">Cadastre sua empresa</Link>
                </p>
            }
        >
            <form className="form-grid" noValidate onSubmit={handleSubmit}>
                <div className="form-grid__full">
                    <TextField
                        label="E-mail"
                        type="email"
                        required
                        value={values.email}
                        onValueChange={(value) => setField("email", value)}
                        error={errors.email}
                        autoComplete="email"
                        autoFocus
                    />
                </div>
                <div className="form-grid__full">
                    <TextField
                        label="Senha"
                        type="password"
                        required
                        value={values.password}
                        onValueChange={(value) => setField("password", value)}
                        error={errors.password}
                        autoComplete="current-password"
                    />
                </div>
                {submitError && (
                    <div className="form-grid__full">
                        <p className="field__error">{submitError}</p>
                    </div>
                )}
                <div className="form-grid__full">
                    <button type="submit" className="button button--primary" disabled={isSubmitting}>
                        {isSubmitting ? "Entrando…" : "Entrar"}
                    </button>
                </div>
            </form>
        </PublicTemplate>
    );
}