import React, { useReducer, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cn from "classnames";
import { useAuth } from "../../hooks/useAuth";
import {
  Header,
  HeaderModule,
  HeaderLogo,
  HeaderMenu,
  HeaderLogin
} from '@consta/uikit/Header';
import { ContextMenu } from '@consta/uikit/ContextMenu';
import { Logo } from "../Logo/Logo";

import styles from './Header.module.css';
import { UserGroups } from "../../app/constants";

const menuItems = [
  {
    label: 'Категории программ',
    key: 1,
    permissions: [UserGroups.user],
    href: '/categories',
  },
];

export const HeaderComponent = () => {
  const [isPersonMenuOpen, setIsPersonMenuOpen] = useState();
  const personMenuRef = useRef(null);
  const { user, logout, isOrdinaryUser, isOrganizationUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const personMenuItems = [
    {
      label: 'Личный кабинет',
      key: 1,
      onClick: () => navigate('/profile')
    },
    {
      label: 'Выйти',
      key: 2,
      onClick: () => logout(),
    },
  ];

  const permissionsFilteredMenuItems = menuItems.filter((item) => {
    if (isOrdinaryUser) {
      return !item.permissions || item.permissions.includes(UserGroups.user)
    } else if (isOrganizationUser) {
      return !item.permissions || item.permissions.includes(UserGroups.organization)
    }
  }).map((item) => ({
    ...item,
    active: location.pathname === item.href
  }));

  const username = user.name ?
    `${user.name} ${user.surname}` :
    user.username;

  return (
    <div className={cn(styles.wrapper)}>
      <Header
        className={cn(styles.container)}
        leftSide={
          <>
            <HeaderModule>
              <HeaderLogo>
                <Logo width={120} link="/"/>
              </HeaderLogo>
            </HeaderModule>
            <HeaderModule indent="l">
              <HeaderMenu items={permissionsFilteredMenuItems} />
            </HeaderModule>
          </>
        }
        rightSide={
          <>
            <HeaderModule>
              <HeaderLogin
                isLogged={!!user}
                personName={username}
                onClick={() => setIsPersonMenuOpen(!isPersonMenuOpen)}
                ref={personMenuRef}
              />
              <ContextMenu
                isOpen={isPersonMenuOpen}
                items={personMenuItems}
                getItemLabel={(item) => item.label}
                getItemKey={(item) => item.key}
                anchorRef={personMenuRef}
                size="s"
                direction="downStartRight"
                onClickOutside={() => setIsPersonMenuOpen(false)}
              />
            </HeaderModule>
          </>
        }
      />
    </div>
  )
}