// src/components/NavbarSegmented.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFileAnalytics,
  IconFingerprint,
  IconKey,
  IconLicense,
  IconLogout,
  IconMessage2,
  IconMessages,
  IconReceipt2,
  IconReceiptRefund,
  IconSettings,
  IconShoppingCart,
  IconSwitchHorizontal,
  IconUsers,
  IconSun,
  IconMoon,
} from '@tabler/icons-react';
import { SegmentedControl, Text, ActionIcon } from '@mantine/core';
import classes from './NavbarSegmented.module.css';

// 🔧 Настройки названий секций в одном месте
const SECTION_CONFIG = {
  profile: {
    value: 'profile',
    label: 'Профиль',
    title: 'Профиль пользователя'
  },
  system: {
    value: 'system',
    label: 'Система',
    title: 'Системные настройки'
  }
} as const;

// Типы для props
interface NavbarSegmentedProps {
  toggleColorScheme: (value?: 'light' | 'dark') => void;
  colorScheme: 'light' | 'dark';
}

// Тип для секций
type SectionKey = keyof typeof SECTION_CONFIG;

const tabs = {
  [SECTION_CONFIG.profile.value]: [
    { link: '/', label: 'Дашборт', icon: IconBellRinging },
    { link: '/training', label: 'Тренировки', icon: IconReceipt2 },
    { link: '/security', label: 'Security', icon: IconFingerprint },
    { link: '/ssh-keys', label: 'SSH Keys', icon: IconKey },
    { link: '/databases', label: 'Databases', icon: IconDatabaseImport },
    { link: '/authentication', label: 'Authentication', icon: Icon2fa },
    { link: '/settings', label: 'Other Settings', icon: IconSettings },
  ],
  [SECTION_CONFIG.system.value]: [
    { link: '/orders', label: 'Orders', icon: IconShoppingCart },
    { link: '/receipts', label: 'Receipts', icon: IconLicense },
    { link: '/reviews', label: 'Reviews', icon: IconMessage2 },
    { link: '/messages', label: 'Messages', icon: IconMessages },
    { link: '/customers', label: 'Customers', icon: IconUsers },
    { link: '/refunds', label: 'Refunds', icon: IconReceiptRefund },
    { link: '/files', label: 'Files', icon: IconFileAnalytics },
  ],
};

export function NavbarSegmented({ toggleColorScheme, colorScheme }: NavbarSegmentedProps) {
  const [section, setSection] = useState<SectionKey>(SECTION_CONFIG.profile.value);
  const [active, setActive] = useState('Дашборт');

  const links = tabs[section].map((item) => (
    <Link
      to={item.link}
      className={classes.link}
      data-active={item.label === active || undefined}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <Text fw={500} size="sm" className={classes.title} c="dimmed">
            {SECTION_CONFIG[section].title}
          </Text>
          
          {/* Кнопка смены темы */}
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => toggleColorScheme()}
            title={`Переключить на ${colorScheme === 'dark' ? 'светлую' : 'темную'} тему`}
            aria-label="Переключить тему"
          >
            {colorScheme === 'dark' ? (
              <IconSun size="1.2rem" stroke={1.5} />
            ) : (
              <IconMoon size="1.2rem" stroke={1.5} />
            )}
          </ActionIcon>
        </div>

        <SegmentedControl
          value={section}
          onChange={(value: string) => setSection(value as SectionKey)}
          transitionTimingFunction="ease"
          fullWidth
          data={[
            { 
              label: SECTION_CONFIG.profile.label, 
              value: SECTION_CONFIG.profile.value 
            },
            { 
              label: SECTION_CONFIG.system.label, 
              value: SECTION_CONFIG.system.value 
            },
          ]}
        />
      </div>

      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(e) => e.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Сменить профиль</span>
        </a>

        <a href="#" className={classes.link} onClick={(e) => e.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Выйти</span>
        </a>
      </div>
    </nav>
  );
}