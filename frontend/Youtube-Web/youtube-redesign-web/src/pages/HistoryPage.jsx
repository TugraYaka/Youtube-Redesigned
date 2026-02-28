import React from 'react';
import './HistoryPage.css';
import { useLanguage } from '../i18n/LanguageContext';

const deterministicMillions = (seed, max, precision = 1) => {
    const boundedMax = Math.max(0.1, max);
    const normalized = ((seed * 9301 + 49297) % 233280) / 233280;
    const value = normalized * boundedMax;
    return value.toFixed(precision);
};

const HistoryPage = () => {
    const { t, locale } = useLanguage();

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const generateItems = (type, count, date, offset) => {
        const items = [];
        const dateText = date.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' });

        for (let i = 0; i < count; i++) {
            const id = offset + i;
            if (type === 'video') {
                items.push({
                    id: `v-${id}`,
                    title: t('history.videoTitle', { id, date: dateText }),
                    channel: t('history.channel', { id }),
                    views: `${deterministicMillions(id + offset, 5)}M ${t('common.views')}`,
                    desc: t('history.videoDescription', { id, date: dateText }),
                    date
                });
            } else {
                items.push({
                    id: `s-${id}`,
                    title: t('history.shortTitle', { id }),
                    views: `${deterministicMillions(id + offset + 100, 2)}M`,
                    date
                });
            }
        }
        return items;
    };

    const allVideos = [
        ...generateItems('video', 10, today, 0),
        ...generateItems('video', 10, yesterday, 10),
        ...generateItems('video', 10, twoDaysAgo, 20),
        ...generateItems('video', 10, threeDaysAgo, 30),
    ];

    const allShorts = [
        ...generateItems('short', 10, today, 100),
        ...generateItems('short', 10, yesterday, 110),
        ...generateItems('short', 10, twoDaysAgo, 120),
        ...generateItems('short', 10, threeDaysAgo, 130),
    ];

    const formatDateHeader = (dateObj) => {
        const now = new Date();
        const isToday = dateObj.toDateString() === now.toDateString();

        if (isToday) {
            return {
                bigText: t('common.today'),
                smallText: dateObj.toLocaleDateString(locale, { month: 'long', day: 'numeric' })
            };
        }

        return {
            bigText: dateObj.toLocaleDateString(locale, { weekday: 'long' }),
            smallText: dateObj.toLocaleDateString(locale, { month: 'long', day: 'numeric' })
        };
    };

    const groupedItems = {};

    const addToGroup = (item, type) => {
        const dateKey = item.date.toDateString();
        if (!groupedItems[dateKey]) {
            groupedItems[dateKey] = {
                dateObj: item.date,
                videos: [],
                shorts: []
            };
        }

        if (type === 'video') {
            groupedItems[dateKey].videos.push(item);
        } else {
            groupedItems[dateKey].shorts.push(item);
        }
    };

    allVideos.forEach(v => addToGroup(v, 'video'));
    allShorts.forEach(s => addToGroup(s, 'short'));

    const sortedGroups = Object.values(groupedItems).sort((a, b) => b.dateObj - a.dateObj);

    return (
        <div className="history-page-container">
            {sortedGroups.map((group, index) => {
                const { bigText, smallText } = formatDateHeader(group.dateObj);
                const hasVideos = group.videos.length > 0;
                const hasShorts = group.shorts.length > 0;

                return (
                    <div key={index} className="history-day-group">
                        {hasVideos && (
                            <div className="history-section-row">
                                <div className="history-left-panel">
                                    <h1 className="big-watermark-text">{bigText}</h1>
                                    <span className="current-date-text">{smallText}</span>
                                </div>

                                <div className="history-right-list">
                                    {group.videos.map(vid => (
                                        <div key={`vid-${vid.id}`} className="history-video-card">
                                            <div className="history-thumbnail">
                                                <img
                                                    src={`https://picsum.photos/seed/${vid.id}/320/180`}
                                                    alt={vid.title}
                                                    referrerPolicy="no-referrer"
                                                />
                                                <span className="duration-badge">12:34</span>
                                            </div>
                                            <div className="history-video-details">
                                                <div className="hv-header">
                                                    <h3 className="hv-title">{vid.title}</h3>
                                                    <button className="hv-menu-btn">⋮</button>
                                                </div>
                                                <div className="hv-meta">{vid.channel} • {vid.views}</div>
                                                <div className="hv-desc">{vid.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {hasShorts && (
                            <div className="history-section-row shorts-row">
                                <div className="history-left-panel shorts-header-panel">
                                    <div className="shorts-logo-title">
                                        <svg viewBox="0 0 24 24" className="shorts-icon-filled" fill="#0f0f0f" width="24" height="24" style={{ marginRight: '8px' }}>
                                            <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.26zM10 16.5l-6-3.18c-1.11-.59-1.6-1.95-1.1-3.07.5-1.12 1.84-1.66 3.02-1.11l2 .8v.16l-1.54.8c-.51.26-.75.76-.75 1.21 0 .61.41 1.07.82 1.22l.3.11 6.55 3.45c.81.42 1.34 1.3 1.34 2.18s-.54 1.76-1.34 2.18c-1.2.64-2.73.19-3.37-1.02.01-.01.07-.03.07.05zm5.09-2.58l-2 .8v.17l1.55-.83c.5-.27.75-.77.75-1.22 0-.61-.41-1.06-.83-1.21l-.29-.11-6.55-3.46c-.81-.43-1.34-1.31-1.34-2.19 0-.87.53-1.75 1.34-2.18 1.2-.63 2.73-.18 3.37 1.02l6.09 3.22c1.11.59 1.6 1.95 1.1 3.07-.5 1.12-1.84 1.66-3.02 1.11.01.01-.07.03-.07-.04z" />
                                        </svg>
                                        <h2 className="shorts-title-text">{t('common.shorts')}</h2>
                                    </div>
                                </div>

                                <div className="history-right-list shorts-list">
                                    {group.shorts.map(short => (
                                        <div key={`short-${short.id}`} className="history-shorts-card">
                                            <div className="history-shorts-thumbnail">
                                                <img
                                                    src={`https://picsum.photos/seed/short${short.id}/180/320`}
                                                    alt={short.title}
                                                    referrerPolicy="no-referrer"
                                                />
                                                <span className="shorts-views">{short.views} {t('common.views')}</span>
                                            </div>
                                            <div className="shorts-details">
                                                <h3 className="shorts-title">{short.title}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default HistoryPage;
