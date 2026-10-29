import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const PomodoroContext = createContext();

const DEFAULT_SETTINGS = {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
};

export const PomodoroProvider = ({ children }) => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [mode, setMode] = useState('work');
    const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.work * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    const timerRef = useRef(null);

    const switchMode = useCallback((newMode) => {
        setIsRunning(false);
        setMode(newMode);
        setTimeLeft((settings[newMode] || 25) * 60);
    }, [settings]);

    const handleTimerEnd = useCallback(() => {
        setIsRunning(false);

        try {
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play();
        } catch (e) {
            console.log('Audio error:', e);
        }

        if (mode === 'work') {
            setSessionsCompleted((prev) => prev + 1);
            switchMode('shortBreak');
        } else {
            switchMode('work');
        }
    }, [mode, switchMode]);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleTimerEnd();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning, handleTimerEnd]);

    const toggleTimer = () => setIsRunning((prev) => !prev);

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(settings[mode] * 60);
    };

    const updateSettings = (newSettings) => {
        setSettings(newSettings);
        setIsRunning(false);
        setTimeLeft(newSettings[mode] * 60);
    };

    return (
        <PomodoroContext.Provider
            value={{
                settings,
                mode,
                timeLeft,
                isRunning,
                sessionsCompleted,
                switchMode,
                toggleTimer,
                resetTimer,
                updateSettings,
                handleTimerEnd,
            }}
        >
            {children}
        </PomodoroContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePomodoro = () => useContext(PomodoroContext);