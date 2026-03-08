import React, { useEffect, useState } from "react"
import { Card } from "@consta/uikit/Card"
import { Text } from "@consta/uikit/Text"
import { Attachment } from '@consta/uikit/Attachment';
import { DragNDropField } from '@consta/uikit/DragNDropField';
import { IconTrash } from "@consta/icons/IconTrash";
import { IconAttach } from "@consta/icons/IconAttach";
import { IconPhone } from "@consta/icons/IconPhone";
import { IconHome } from "@consta/icons/IconHome";
import { IconSave } from "@consta/icons/IconSave";
import { IconSendMessage } from "@consta/icons/IconSendMessage";
import { Button } from "@consta/uikit/Button";
import { TextField } from "@consta/uikit/TextField";
import { toast } from "react-toastify";
import { OrganizationAPI } from "../../../../app/API/api";
import { Loader } from "@consta/uikit/Loader";

import styles from '../PersonalInfo.module.css';

const CONTACTS_DEFAULT_STATE = {
  telegram: null
}

export const OrganizationPersonalInfo = () => {

  const [logoPath, setLogoPath] = useState();
  const [logo, setLogo] = useState();
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();
  const [description, setDescription] = useState();
  const [contacts, setContacts] = useState(CONTACTS_DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const getInfo = async () => {
    setIsLoading(true);

    try {
      const result = await OrganizationAPI.getOrganizationInfo();
      const {
        contacts,
        description,
        phone,
        address,
        logo_path,
      } = result;

      setLogoPath(logo_path);
      setPhone(phone);
      setAddress(address);
      setDescription(description);

      if (contacts) {
        setContacts(contacts);
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
      await OrganizationAPI.udpateOrganizationInfo({
        logo,
        phone,
        address,
        description,
        contacts,
      });

      toast.success('Информация обновлена');
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

  const handleDropFile = (files) => {
    setLogo(files[0]);
  }

  const handleDeleteLogo = () => {
    setLogo(null);
  }

  const handlePhoneChange = (phone) => {
    setPhone(phone);
  }

  const handleDescriptionChange = (description) => {
    setDescription(description);
  }

  const handleAddressChange = (address) => {
    setAddress(address);
  }

  const handleContactsChange = (field, value) => {
    setContacts({
      ...contacts,
      [field]: value
    });
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
        Информация об организации
      </Text>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.block_logo}>
            <Text
              view="secondary"
            >
              Логотип
            </Text>
            {logoPath && !logo && (
              <div className={styles.logo_wrapper}>
                <img
                  src={logoPath}
                  className={styles.logo}
                />
              </div>
            )}
            {!logo && (
              <DragNDropField
                accept="image/png, image/jpeg"
                maxSize={2 * 1024 * 1024}
                onDropFiles={handleDropFile}
              >
                {({ openFileDialog }) => (
                  <>
                    <Text
                      size="s"
                      view="secondary"
                    >
                      Перетащите сюда файл размером не более 2 Мб или загрузите по кнопке
                    </Text>
                    <br />
                    <Button
                      onClick={openFileDialog} label="Выбрать файл"
                      view="ghost"
                      iconLeft={IconAttach}
                      size="s"
                    />
                  </>
                )}
              </DragNDropField>
            )}
            {logo && (
              <div className={styles.file_preview}>
                <Attachment
                  fileName={logo.name}
                  fileExtension={logo.name.match(/\.(?!.*\.)(\w*)/)?.[1]}
                  fileDescription={logo.type}
                  buttonIcon={IconTrash}
                  buttonTitle="Удалить"
                  onButtonClick={handleDeleteLogo}
                />
                <div className={styles.logo_wrapper}>
                  <img
                    src={URL.createObjectURL(logo)}
                    alt={logo.name}
                    className={styles.logo}
                  />
                </div>
              </div>
            )}
          </div>
          <TextField
            label="Телефон"
            type="tel"
            name="phone"
            value={phone}
            leftSide={IconPhone}
            onChange={({ value }) => handlePhoneChange(value)}
          />
          <TextField
            label="Адрес"
            value={address}
            leftSide={IconHome}
            onChange={({ value }) => handleAddressChange(value)}
          />
          <TextField
            label="Описание"
            value={description}
            onChange={({ value }) => handleDescriptionChange(value)}
            type="textarea"
            rows={5}
            cols={58}
          />
          <Text
            size="l"
          >
            Контакты
          </Text>
          <TextField
            label="Телеграм"
            value={contacts.telegram}
            leftSide={IconSendMessage}
            onChange={({ value }) => handleContactsChange('telegram', value)}
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