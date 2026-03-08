import React, { useState } from 'react';
import { toast } from "react-toastify";
import { TextField } from '@consta/uikit/TextField';
import { Button } from '@consta/uikit/Button';
import { Text } from "@consta/uikit/Text";
import { useAuth } from "../../hooks/useAuth";
import { LoginAPI } from "../../app/API/api";
import { LOGIN_STATUS_CODES } from "../../app/constants";

export const LoginForm = ({ toggleState, linkClassname }) => {

  const [email, setEmail] = useState(null);
  const [pwd, setPwd] = useState(null);
  const [errors, setErrors] = useState({});
  const [inProcess, setInProcess] = useState(false);
  const { login } = useAuth();

  const loginUser = async () => {
    setInProcess(true);

    try {
      const result = await LoginAPI.login({
        login: email,
        password: pwd,
      });

      setErrors({});

      if (result.status === LOGIN_STATUS_CODES.success) {
        const callback = await login(result.data);
        callback();
      }
      setInProcess(false);
    } catch (apiError) {
      setInProcess(false);
      const { response } = apiError;

      if (response) {
        const { data } = response;

        if (data) {
          if (data.error) {
            handleLoginError(data.error);
          } else if (data.errors) {
            setErrors(prepareFieldsErrors(data.errors));
          } else {
            toast.error(`${data.code}: ${data.message}`);
          }
        } else {
          toast.error(`Произошла непредвиденная ошибка`);
        }
      }
    }
  }

  const handleLoginError = (error) => {
    if (error === 'invalid_credentials') {
      setErrors({
        login: true,
        password: true,
        form: 'Неверный email или пароль'
      });
    }
  }

  const prepareFieldsErrors = (errors) => {
    const errorsWithCaptions = Object.keys(errors).map((key) => ({
      [key]: true,
      [`${key}Caption`]: errors[key]
    }));

    return errorsWithCaptions;
  }

  const handleSubmit = () => {
    loginUser();
  }

  return (
    <>
      <TextField
        id="emailField"
        name="email"
        onChange={({ value }) => setEmail(value)}
        label="Email"
        value={email}
        type="email"
        status={errors.login && 'alert'}
        caption={errors.loginCaption && errors.loginCaption.join('\n')}
      />
      <TextField
        id="passwordField"
        name="password"
        onChange={({ value }) => setPwd(value)}
        value={pwd}
        type="password"
        label="Пароль"
        status={errors.password && 'alert'}
        caption={errors.passwordCaption && errors.passwordCaption.join('\n')}
      />
      {errors.form && (
        <Text
          view="alert"
          size="xs"
          align="center"
        >
          {errors.form}
        </Text>
      )}
      <Text
        view="secondary"
        size="xs"
        align="center"
      >
        Еще нет аккаунта? Перейдите к <span onClick={() => toggleState('register')} className={linkClassname}>регистрации</span>
      </Text>
      <Button
        label="Войти"
        onClick={handleSubmit}
        loading={inProcess}
      />
    </>
  );
}
