import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@consta/uikit/Button";
import { TextField } from "@consta/uikit/TextField";
import { Text } from '@consta/uikit/Text';
import { Tooltip } from '@consta/uikit/Tooltip';
import { RegisterAPI } from "../../app/API/api";
import { REGISTER_STATUS_CODES } from "../../app/constants";
import { Checkbox } from "@consta/uikit/Checkbox";

import styles from './RegisterForm.module.css';
import { Link } from "react-router-dom";

export const RegisterForm = ({ toggleState, linkClassname }) => {

  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);
  const [email, setEmail] = useState(null);
  const [pwd, setPwd] = useState(null);
  const [confirmPwd, setConfirmPwd] = useState(null);
  const [errors, setErrors] = useState({});
  const [isPersonalDataChecked, setIsPersonalDataChecked] = useState(false);
  const [isPrivacyPolicyChecked, setIsPrivacyPolicyChecked] = useState(false);
  const [inProcess, setInProcess] = useState(false);
  const pwdRef = useRef(null);
  const [isPwdTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleSubmit = async () => {
    setInProcess(true);

    try {
      const result = await RegisterAPI.register({
        name,
        surname,
        username,
        email,
        password: pwd,
        password_confirmation: confirmPwd
      });

      setInProcess(false);
      if (result.status === REGISTER_STATUS_CODES.success) {
        toggleState('login');
        toast.success('Регистрация прошла успешно!');
      }
    } catch (error) {
      setInProcess(false);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  }

  const pwdValidation = () => {
    const regexp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/g;
    return pwd === null || pwd === '' || regexp.test(pwd);
  }

  const isPwdsEqual = (
    pwdValidation() &&
    pwd === confirmPwd
  );

  const isPwdValid = pwdValidation();

  const isSubmitButtonEnabled = username &&
    email &&
    isPwdsEqual &&
    pwd &&
    confirmPwd &&
    isPersonalDataChecked &&
    isPrivacyPolicyChecked;

  return (
    <>
      <div className={styles.fields_row}>
        <TextField
          id="nameFeild"
          name="name"
          onChange={({ value }) => setName(value)}
          value={name}
          type="text"
          label="Имя"
          required
          autoComplete="new-name"
        />
        <TextField
          id="surnameFeild"
          onChange={({ value }) => setSurname(value)}
          value={surname}
          type="text"
          label="Фамилия"
        />
      </div>
      <div className={styles.fields_row}>
        <TextField
          id="usernameFeild"
          onChange={({ value }) => setUsername(value)}
          value={username}
          type="text"
          label="Логин"
          required
          status={errors.username && 'alert'}
          caption={errors.username && errors.username.join('\n')}
          autoComplete="new-username"
        />
        <TextField
          id="emailField"
          onChange={({ value }) => setEmail(value)}
          value={email}
          type="email"
          label="Email"
          required
          status={errors.email && 'alert'}
          caption={errors.email && errors.email.join('\n')}
          autoComplete="new-email"
        />
      </div>
      <div className={styles.fields_row}>
        <TextField
          id="pwdField"
          onChange={({ value }) => setPwd(value)}
          value={pwd}
          type="password"
          label="Пароль"
          required
          status={!pwd ? 'system' : isPwdValid ? 'success' : 'alert'}
          autoComplete="new-password"
          ref={pwdRef}
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
        />
        {isPwdTooltipVisible && !isPwdValid && (
          <Tooltip
            size="l"
            direction="downStartLeft"
            status="alert"
            anchorRef={pwdRef}
            equalAnchorWidth
          >
            <div className={styles.tooltip}>
              Пароль должен содержать:
              <ul className={styles.tooltip_list}>
                <li className={styles.tooltip_list_item}>не менее 8 символов</li>
                <li className={styles.tooltip_list_item}>1 цифру</li>
                <li className={styles.tooltip_list_item}>1 латинскую букву в нижнем регистре</li>
                <li className={styles.tooltip_list_item}>1 латинскую букву в верхнем регистре</li>
              </ul>
            </div>
          </Tooltip>
        )}
        <TextField
          id="confirmPwdField"
          onChange={({ value }) => setConfirmPwd(value)}
          value={confirmPwd}
          type="password"
          label="Повторите пароль"
          required
          status={!confirmPwd ? 'system' : isPwdsEqual ? 'success' : 'alert'}
          autoComplete="new-password-confirm"
        />
      </div>
      <Checkbox
        id="personalData"
        onChange={({ checked }) => setIsPersonalDataChecked(checked)}
        checked={isPersonalDataChecked}
        label={
          <Text
            view={!isPersonalDataChecked ? 'alert' : 'primary'}
          >
            <Link to="/personal-data" target="_blank">Согласие</Link> на обработку персональных данных
          </Text>
        }
        className={styles.checkbox}
      />
      <Checkbox
        id="privacyPolicy"
        onChange={({ checked }) => setIsPrivacyPolicyChecked(checked)}
        checked={isPrivacyPolicyChecked}
        label={
          <Text
            view={!isPrivacyPolicyChecked ? 'alert' : 'primary'}
          >
            Согласен с <Link to="/privacy-policy" target="_blank">политикой конфиденциальности</Link>
          </Text>
        }
        className={styles.checkbox}
      />
      <Text
        view="secondary"
        size="xs"
        align="center"
      >
        Уже зарегестрированы? Нажмите <span onClick={() => toggleState('login')} className={linkClassname}>войти</span>
      </Text>
      <Button
        label="Зарегистрироваться"
        onClick={handleSubmit}
        disabled={!isSubmitButtonEnabled}
        loading={inProcess}
        className={styles.submit_button}
      />
    </>
  )
}