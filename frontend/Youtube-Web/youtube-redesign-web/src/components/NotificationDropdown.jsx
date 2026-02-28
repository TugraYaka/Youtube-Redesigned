import React from 'react';
import './NotificationDropdown.css';
import { useLanguage } from '../i18n/LanguageContext';

const NotificationDropdown = () => {
    const { t } = useLanguage();

    const notifications = Array.from({ length: 20 }, (_, i) => {
        const types = ['video_subjector', 'comment_subjector', 'heart_subjector'];
        const type = types[i % 3];

        let content;
        let profilePic;

        if (type === 'video_subjector') {
            content = (
                <p className="notif-text">
                    <strong>{t('notifications.newVideoLabel')}</strong> {t('notifications.newVideoBody', { index: i + 1 })}
                </p>
            );
            profilePic = `https://ui-avatars.com/api/?name=User+${i}&background=random`;
        } else if (type === 'comment_subjector') {
            content = (
                <p className="notif-text">
                    <strong>{t('notifications.replyLabel')}</strong> {t('notifications.replyBody')}
                </p>
            );
            profilePic = `https://ui-avatars.com/api/?name=Replier+${i}&background=random`;
        } else {
            content = (
                <p className="notif-text">
                    <strong>{t('notifications.heartLabel')}</strong> {t('notifications.heartBody')}
                </p>
            );
            profilePic = null;
        }

        return {
            id: i,
            type,
            content,
            time: t('notifications.hoursAgo', { count: i + 2 }),
            thumbnail: `https://picsum.photos/seed/${i + 200}/64/36`,
            profilePic
        };
    });

    return (
        <div className="notification-dropdown">
            <div className="notification-header">
                <h3>{t('notifications.title')}</h3>
            </div>
            <div className="notification-list">
                {notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${notif.type}`}>
                        <div className="notification-icon-col">
                            {notif.type === 'heart_subjector' ? (
                                <span className="heart-icon">❤️</span>
                            ) : (
                                <div className="notification-dot"></div>
                            )}
                        </div>

                        <div className="notification-avatar-col">
                            {notif.profilePic && (
                                <img src={notif.profilePic} alt={t('profileDropdown.profileAlt')} className="notif-profile-pic" />
                            )}
                        </div>

                        <div className="notification-content">
                            {notif.content}
                            <span className="notif-time">{notif.time}</span>
                        </div>
                        <div className="notification-image">
                            <img src={notif.thumbnail} alt="" className="dummy-img" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationDropdown;
