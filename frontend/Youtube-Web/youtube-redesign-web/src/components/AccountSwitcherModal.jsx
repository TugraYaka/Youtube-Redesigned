import React from 'react';
import './AccountSwitcherModal.css';
import { CloseIcon } from './SidebarIcons';
import { authService } from '../services/authService';
import { useLanguage } from '../i18n/LanguageContext';

const AccountSwitcherModal = ({ onClose }) => {
    const { t } = useLanguage();

    const accounts = [1, 2, 3].map((number) => ({
        id: number,
        name: t('accountSwitcher.account', { number }),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(t('accountSwitcher.account', { number }))}&background=random&size=150`
    }));

    return (
        <div className="account-switcher-overlay" onClick={onClose}>
            <div className="account-switcher-container" onClick={(e) => e.stopPropagation()}>
                <div className="switcher-header">
                    <h2>{t('accountSwitcher.whoWatching')}</h2>
                    <div className="close-btn-wrapper" onClick={onClose}>
                        <CloseIcon />
                    </div>
                </div>

                <div className="accounts-grid">
                    {accounts.map(account => (
                        <div key={account.id} className="account-card">
                            <div className="account-avatar-wrapper">
                                <img src={account.avatar} alt={account.name} className="account-avatar-large" />
                                <div className="avatar-overlay"></div>
                            </div>
                            <span className="account-name">{account.name}</span>
                        </div>
                    ))}
                </div>

                <div className="switcher-actions">
                    <div className="action-button-item">
                        <div className="action-circle-btn">
                            <svg viewBox="0 0 24 24" className="action-icon" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                        </div>
                        <span className="action-label">{t('accountSwitcher.addAccount')}</span>
                    </div>

                    <div className="action-button-item" onClick={async () => {
                        await authService.signOut();
                        onClose();
                    }}>
                        <div className="action-circle-btn">
                            <svg viewBox="0 0 24 24" className="action-icon" fill="currentColor"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /></svg>
                        </div>
                        <span className="action-label">{t('accountSwitcher.signOut')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSwitcherModal;
