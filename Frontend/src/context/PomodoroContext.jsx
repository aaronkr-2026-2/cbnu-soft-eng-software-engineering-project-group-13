import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';


import rainSound from '../assets/audio/rain-sounds.mp3';
import cafeSound from '../assets/audio/Cafe.mp3';
import forestSound from '../assets/audio/forest.mp3';
import wavesSound from '../assets/audio/ocean waves.mp3';
import whiteNoiseSound from '../assets/audio/white noise.mp3';

const DEFAULT_TIMES = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

const SOUND_OPTIONS = {
    rain: rainSound,
    cafe: cafeSound,
    forest: forestSound,
    waves: wavesSound,
    whitenoise: whiteNoiseSound,
};

const PomodoroContext = createContext();

export const PomodoroProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        work: 25,
        shortBreak: 5,
        longBreak: 15,
    });

    const [mode, setMode] = useState('work');
    const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES.work);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    // Ambient Sound States
    const [activeSound, setActiveSound] = useState(null);
    const audioRef = useRef(null);

    const timerRef = useRef(null);

    const switchMode = useCallback((newMode) => {
        setIsRunning(false);
        setMode(newMode);
        setTimeLeft(settings[newMode] * 60);
    }, [settings]);

    const handleTimerEnd = useCallback(() => {
        setIsRunning(false);

        try {
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play();
        } catch (e) {
            console.log('Audio playback error:', e);
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
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        handleTimerEnd();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning, handleTimerEnd]);

    // Updated Ambient Sound Logic: Plays ONLY when a sound is selected AND the timer is running
    useEffect(() => {
        if (activeSound && isRunning) {
            if (!audioRef.current) {
                audioRef.current = new Audio(SOUND_OPTIONS[activeSound]);
                audioRef.current.loop = true;
            } else {
                audioRef.current.src = SOUND_OPTIONS[activeSound];
            }
            audioRef.current.play().catch((err) => console.log('Audio play error:', err));
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [activeSound, isRunning]);

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

    const setAmbientSound = (soundKey) => {
        if (activeSound === soundKey) {
            setActiveSound(null); // Turn off if clicked again
        } else {
            setActiveSound(soundKey);
        }
    };

    return (
        <PomodoroContext.Provider value={{
            settings,
            mode,
            timeLeft,
            isRunning,
            sessionsCompleted,
            activeSound,
            switchMode,
            toggleTimer,
            resetTimer,
            updateSettings,
            handleTimerEnd,
            setAmbientSound
        }}>
            {children}
        </PomodoroContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePomodoro = () => useContext(PomodoroContext);