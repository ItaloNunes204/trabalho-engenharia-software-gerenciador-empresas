import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { SelectField, TextField } from "../../shared/components/Form/Field";
import { Icon } from "../../shared/components/Icon/Icon";
import { Modal } from "../../shared/components/Modal/Modal";
import { RECORD_STATUSES, ROLES, USER_STATUS_LABELS } from "../../shared/demo/labels";
import type { Company, RecordStatus, RoleId, User, UserInput } from "../../shared/demo/types";
import { focusFirstInvalidField } from "../../shared/utils/focus";
import { hasErrors, type FieldErrors } from "../../shared/utils/validation";
import { validateUser } from "./userValidation";

interface UserFormDialogProps {
    user?: User;
    companies: Company[];
    onCancel: () => void;
    onSubmit: (input: UserInput) => void;
}

const ROLE_OPTIONS = ROLES.map((role) => ({ value: role.id, label: role.name }));
const STATUS_OPTIONS = RECORD_STATUSES.map((status) => ({ value: status, label: USER_STATUS_LABELS[status] }));

export function UserFormDialog({ user, companies, onCancel, onSubmit }: UserFormDialogProps) {
    const [values, setValues] = useState<UserInput>(() => ({
        name: user?.name ?? "",
        email: user?.email ?? "",
        companyId: user?.companyId ?? "",
        role: user?.role ?? "viewer",
        status: user?.status ?? "active",
    }));
    const [errors, setErrors] = useState<FieldErrors<UserInput>>({});
    const formRef = useRef<HTMLFormElement>(null);
    const isEditing = Boolean(user);
    const hasCompanies = companies.length > 0;

    const setField = <K extends keyof UserInput>(field: K, value: UserInput[K]) => {
        setValues((current) => ({ ...current, [field]: value }));
        if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextErrors = validateUser(values, companies);
        if (hasErrors(nextErrors)) {
            setErrors(nextErrors);
            focusFirstInvalidField(formRef.current);
            return;
        }
        onSubmit({ ...values, name: values.name.trim(), email: values.email.trim() });
    };

    const formId = "user-form";

    return (
        <Modal
            title={isEditing ? "Editar usuário" : "Novo usuário"}
            description="Nenhuma conta, senha ou convite real é criado. Os dados valem apenas nesta sessão."
            onClose={onCancel}
            footer={
                <>
                    <button type="button" className="button button--secondary" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button type="submit" form={formId} className="button button--primary" disabled={!hasCompanies}>
                        {isEditing ? "Salvar alterações" : "Cadastrar usuário"}
                    </button>
                </>
            }
        >
            {!hasCompanies && (
                <div className="notice notice--warning" role="note">
                    <Icon name="info" />
                    <p>
                        Para cadastrar um usuário, primeiro cadastre uma empresa.{" "}
                        <Link to="/empresas" onClick={onCancel}>
                            Ir para Empresas
                        </Link>
                    </p>
                </div>
            )}
            <form id={formId} ref={formRef} className="form-grid" noValidate onSubmit={handleSubmit}>
                <div className="form-grid__full">
                    <TextField
                        label="Nome completo"
                        required
                        value={values.name}
                        onValueChange={(value) => setField("name", value)}
                        error={errors.name}
                        autoComplete="off"
                        data-autofocus
                    />
                </div>
                <div className="form-grid__full">
                    <TextField
                        label="E-mail"
                        type="email"
                        required
                        value={values.email}
                        onValueChange={(value) => setField("email", value)}
                        error={errors.email}
                        autoComplete="off"
                    />
                </div>
                <div className="form-grid__full">
                    <SelectField
                        label="Empresa"
                        required
                        value={values.companyId}
                        onValueChange={(value) => setField("companyId", value)}
                        options={companies.map((company) => ({ value: company.id, label: company.name }))}
                        placeholder={hasCompanies ? "Selecione uma empresa" : "Nenhuma empresa cadastrada"}
                        error={errors.companyId}
                        disabled={!hasCompanies}
                    />
                </div>
                <SelectField
                    label="Perfil de acesso"
                    value={values.role}
                    onValueChange={(value) => setField("role", value as RoleId)}
                    options={ROLE_OPTIONS}
                    hint="Apenas exibido; não concede acesso real."
                />
                <SelectField
                    label="Situação"
                    value={values.status}
                    onValueChange={(value) => setField("status", value as RecordStatus)}
                    options={STATUS_OPTIONS}
                />
            </form>
        </Modal>
    );
}
