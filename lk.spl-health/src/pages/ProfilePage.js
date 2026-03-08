import React, { useRef } from "react";
import { Text } from "@consta/uikit/Text";
import { Card } from "@consta/uikit/Card";
import { ProfilePrograms } from "../components/Profile/Programs/ProfilePrograms";
import { IconFolders } from "@consta/icons/IconFolders";
import { IconUser } from "@consta/icons/IconUser";
import { Tabs } from '@consta/uikit/Tabs';
import { useAuth } from "../hooks/useAuth";
import { User } from '@consta/uikit/User';
import { UserGroups } from "../app/constants";
import { useNavigate, useParams } from "react-router-dom";
import { PersonalInfo } from "../components/Profile/PersonalInfo/PersonalInfo";

import styles from './ProfilePage.module.css';
import { Button } from "@consta/uikit/Button";

const menuItems = [
  {
    label: 'Мои курсы',
    href: '/profile/programs',
    page: 'programs',
    icon: IconFolders,
    component: ProfilePrograms
  },
  {
    label: 'Личный кабинет',
    href: '/profile/edit',
    page: 'edit',
    icon: IconUser,
    component: PersonalInfo
  },
];

export const ProfilePage = () => {
  const { user, isOrdinaryUser, isOrganizationUser } = useAuth();
  const navigate = useNavigate();
  const { page } = useParams();

  const permissionsFilteredMenuItems = menuItems.filter((item) => {
    if (isOrdinaryUser) {
      return !item.permissions || item.permissions.includes(UserGroups.user)
    } else {
      if (isOrganizationUser) {
        return !item.permissions || item.permissions.includes(UserGroups.organization)
      }
    }

    return item;
  });

  const handleMenuItemClick = (item) => {
    navigate(item.href);
  }

  const activeTabItem = permissionsFilteredMenuItems.find(item => item.page === page);
  const RightSideComponent = activeTabItem.component;
  const username = user.name ?
    `${user.name} ${user.surname}` :
    user.username;

  return (
    <div className={styles.wrapper}>
      <Text
        as="h1"
        size="3xl"
        weight="bold"
      >
        Личный кабинет
      </Text>
      <div className={styles.content}>
        <div>
          <Card
            verticalSpace="m"
            horizontalSpace="m"
            className={styles['profile-menu__card']}
          >
            <div className={styles['profile-menu__card-top']}>
              <User name={username} />
            </div>
            <Text size="l" weight="bold">Мой аккаунт</Text>
            <Tabs
              value={activeTabItem}
              items={menuItems}
              onChange={({ value }) => handleMenuItemClick(value)}
              linePosition="right"
            />
          </Card>
        </div>
        <div>
          <RightSideComponent/>
        </div>
      </div>
    </div>
  );
}
