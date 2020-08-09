import React from 'react';

function createFormState(form) {
    return Object.keys(form).reduce((formControls, controlName) => {
        formControls[controlName] = {
            value: form[controlName] || "",
            validity: {},
            validationMessage: "",
            dirty: false
        };

        return formControls;
    }, {});
}

const styles = {
    form: {
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center"
    },
    formSubmit: {
        textAlign: "center"
    }
}

export function LoginForm() {
    const [form, setForm] = React.useState(createFormState({ username: "", password: "" }));

    const handleFormInput = event => {
        event.preventDefault();

        const {
            name,
            value,
            validity } = event.target;

        setForm({
            ...form,
            [name]: {
                value,
                validity,
                validationMessage: getValidationMessage(event),
                dirty: true
            }
        });
    }

    const getValidationMessage = event => {
        const {
            name,
            value,
            placeholder,
            valueAsNumber,
            required,
            minLength, maxLength,
            min, max,
            validity,
            validationMessage } = event.target;

        let message = "";

        if (validity.valid) {
            message = "";
        } else if (validity.valueMissing) {
            message = placeholder + " is required"
        } else if (validity.tooShort || validity.tooLong) {
            message = placeholder + " must be " + minLength + " to " + maxLength
        } else if (validity.patternMismatch) {
            message = placeholder + " is not valid"
        }

        /* event.target.setValidationMessage(message); */

        return message;
    }

    const handleFormInputBlur = event => {
        const { name } = event.target;

        if (form[name].dirty) { return; }

        setForm({
            ...form,
            [name]: {
                ...form[name],
                validationMessage: getValidationMessage(event),
                dirty: true
            }
        });
    }

    const handleFormSubmit = event => {
        event.preventDefault();

        console.log(
            event.target.checkValidity() ?
                "Form submitted!" : "Form is not valid.");

        if (event.target.checkValidity())
            (async () => {
                const response = await fetch("http://localhost:8080" + "/auth/login", {
                    mode: "cors",
                    method: "POST",
                    body: JSON.stringify({ username: form.username.value, password: form.password.value }),
                    headers: { "Content-Type": "application/json" }
                });

                const { authToken } = await response.json();
                
                authToken && authToken.length && localStorage.setItem("AUTH_TOKEN", authToken);
                window.location.reload()
            })();
    }

    return (
        <div className="form" style={styles.form}>
            <form name="example" noValidate onSubmit={handleFormSubmit}>
                <div className="form-control">
                    <input type="text" name="username"
                        value={form.username.value}
                        placeholder="Name" minLength={5} maxLength={30} required
                        onChange={handleFormInput}
                        onBlur={handleFormInputBlur}></input>
                    <div className="error-message">
                        {form.username.validationMessage}
                    </div>
                </div>
                <div className="form-control">
                    <input type="password" name="password"
                        value={form.password.value}
                        placeholder="Password"
                        minLength={6} maxLength={12} required
                        onChange={handleFormInput}
                        onBlur={handleFormInputBlur}></input>
                    <div className="error-message">
                        {form.password.validationMessage}
                    </div>
                </div>
                <div className="form-submit" style={styles.formSubmit}>
                <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}