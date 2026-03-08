import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card } from "@consta/uikit/Card";
import { Text } from "@consta/uikit/Text";
import { Select } from '@consta/uikit/Select';
import { Loader } from '@consta/uikit/Loader';
import { DatePicker } from '@consta/uikit/DatePicker';
import { TextField } from '@consta/uikit/TextField';
import { Button } from '@consta/uikit/Button';
import { IconCalendar } from '@consta/icons/IconCalendar';
import { IconPhone } from '@consta/icons/IconPhone';
import { IconSave } from '@consta/icons/IconSave';
import { IconHome } from '@consta/icons/IconHome';
import { IconFlagFilled } from '@consta/icons/IconFlagFilled';
import { UserAPI } from "../../../../app/API/api";

import styles from '../PersonalInfo.module.css';

const GENDERS_ITEMS = [
  {
    id: 1,
    key: 'male',
    label: 'Мужской'
  },
  {
    id: 2,
    key: 'female',
    label: 'Женский'
  },
];

export const OrdinaryUserPersonalInfo = () => {

  const [birthDate, setBirthDate] = useState();
  const [gender, setGender] = useState();
  const [phone, setPhone] = useState();
  const [country, setCountry] = useState();
  const [city, setCity] = useState();
  const [interests, setInterests] = useState();
  const [aboutMe, setAboutMe] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const getInfo = async () => {
    setIsLoading(true);

    try {
      const result = await UserAPI.getUserInfo();
      const {
        birth_date,
        gender,
        phone,
        country,
        city,
        interests,
        about_me,
      } = result;

      setGender(gender);
      setPhone(phone);
      setCountry(country);
      setCity(city);
      setInterests(interests);
      setAboutMe(about_me);

      if (birth_date) {
        const birthDateObj = new Date(birth_date);
        setBirthDate(birthDateObj);
      }
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsLoading(false);
  }

  const updateInfo = async () => {
    setIsSubmitLoading(true);

    try {
      const birthDateStr = birthDate.toISOString().substring(0, 10);

      await UserAPI.udpateUserInfo({
        birthDate: birthDateStr,
        gender,
        phone,
        country,
        city,
        interests,
        aboutMe,
      });

      toast.success('Данные обновлены');
    } catch (apiError) {
      const { response } = apiError;
      const { data } = response;

      toast.error(`${data.code}: ${data.message}`);
    }

    setIsSubmitLoading(false);
  }

  useEffect(() => {
    getInfo();
  }, []);

  const handleGenderChange = (genderItem) => {
    setGender(genderItem.key);
  }

  const handleBirthDataChange = (birthDate) => {
    setBirthDate(birthDate);
  }

  const handlePhoneChange = (phone) => {
    setPhone(phone);
  }

  const handleCountryChange = (country) => {
    setCountry(country);
  }

  const handleCityChange = (city) => {
    setCity(city);
  }

  const handleInterestsChange = (interests) => {
    setInterests(interests);
  }

  const handleAboutMeChange = (aboutMe) => {
    setAboutMe(aboutMe);
  }

  const handleSubmit = () => {
    updateInfo();
  }

  return (
    <Card
      verticalSpace="2xl"
      horizontalSpace="2xl"
      className={styles.card}
    >
      <Text
        as="h2"
        size="xl"
        weight="bold"
        className={styles.title}
      >
        Ваши данные
      </Text>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Select
            items={GENDERS_ITEMS}
            label="Пол"
            value={GENDERS_ITEMS.find((genderItem) => genderItem.key === gender)}
            onChange={({ value }) => handleGenderChange(value)}
            className={styles.select}
          />
          <DatePicker
            type="date"
            label="Дата рождения"
            value={birthDate}
            rightSide={IconCalendar}
            onChange={({ value }) => handleBirthDataChange(value)}
            maxDate={new Date()}
          />
          <TextField
            label="Номер телефона"
            value={phone}
            leftSide={IconPhone}
            onChange={({ value }) => handlePhoneChange(value)}
          />
          <TextField
            label="Страна проживания"
            value={country}
            leftSide={IconFlagFilled}
            onChange={({ value }) => handleCountryChange(value)}
          />
          <TextField
            label="Город"
            value={city}
            leftSide={IconHome}
            onChange={({ value }) => handleCityChange(value)}
          />
          <TextField
            label="Интересы"
            value={interests}
            onChange={({ value }) => handleInterestsChange(value)}
            type="textarea"
            rows={5}
            cols={58}
          />
          <TextField
            label="О себе"
            value={aboutMe}
            onChange={({ value }) => handleAboutMeChange(value)}
            type="textarea"
            rows={5}
            cols={58}
          />
          <Button
            label="Сохранить"
            onClick={handleSubmit}
            className={styles.submit_button}
            loading={isSubmitLoading}
            disabled={isSubmitLoading}
            iconLeft={IconSave}
          />
        </>
      )}
    </Card>
  );
}