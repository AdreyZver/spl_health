import React, { useState } from 'react';
import { Card } from '@consta/uikit/Card';
import { Logo } from "../components/Logo/Logo";
import { LoginForm } from "../components/LoginForm/LoginForm";
import { RegisterForm } from "../components/RegisterForm/RegisterForm";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

import styles from './LoginPage.module.css';

const formStateToComponent = {
  login: LoginForm,
  register: RegisterForm
}

export const LoginPage = () => {

  const { user } = useAuth();
  const [formState, setFormState] = useState('login');
  const FormComponent = formStateToComponent[formState];

  if (user) {
    return <Navigate to="/profile" />
  }

  return (
    <div className={styles.wrapper}>
      <Card
        verticalSpace="m"
        horizontalSpace="m"
        className={styles.card}
      >
        <Logo
          width={173}
          height={65}
        />
        <FormComponent
          toggleState={setFormState}
          linkClassname={styles.link}
        />
      </Card>
    </div>
  );
}
