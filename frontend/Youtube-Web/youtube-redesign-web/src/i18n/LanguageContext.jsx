import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, LOCALE_MAP, SUPPORTED_LANGUAGES, translations } from './translations';

const STORAGE_KEY = 'siteLanguage';

const LanguageContext = createContext(null);

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, key) => {
        if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
            return acc[key];
        }
        return undefined;
    }, obj);
};

const interpolate = (text, vars = {}) => {
    return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
        const value = vars[key];
        return value === undefined || value === null ? '' : String(value);
    });
};

const resolveInitialLanguage = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
        return saved;
    }
    return DEFAULT_LANGUAGE;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState(resolveInitialLanguage);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, language);
        document.documentElement.lang = LOCALE_MAP[language] || LOCALE_MAP[DEFAULT_LANGUAGE];
    }, [language]);

    const setLanguage = useCallback((nextLanguage) => {
        if (SUPPORTED_LANGUAGES.includes(nextLanguage)) {
            setLanguageState(nextLanguage);
        }
    }, []);

    const t = useCallback((key, vars) => {
        let value = getNestedValue(translations[language], key);

        if (value === undefined) {
            value = getNestedValue(translations[DEFAULT_LANGUAGE], key);
        }

        if (typeof value === 'string') {
            return interpolate(value, vars);
        }

        if (value !== undefined) {
            return value;
        }

        return key;
    }, [language]);

    const value = useMemo(() => ({
        language,
        setLanguage,
        t,
        locale: LOCALE_MAP[language] || LOCALE_MAP[DEFAULT_LANGUAGE],
        supportedLanguages: SUPPORTED_LANGUAGES
    }), [language, setLanguage, t]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }

    return context;
};
