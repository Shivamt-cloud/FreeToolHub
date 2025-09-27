/**
 * Study Timer & Pomodoro
 * Advanced study timer with Pomodoro technique, focus sessions, and analytics
 */
class StudyTimer {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        
        // Timer states
        this.isRunning = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.totalTime = 0;
        this.timerInterval = null;
        this.startTime = null;
        this.pauseTime = 0;
        
        // Session tracking
        this.currentSession = null;
        this.sessions = [];
        this.dailyStats = {
            totalStudyTime: 0,
            sessionsCompleted: 0,
            breaksTaken: 0,
            focusScore: 0
        };
        
        // Pomodoro settings
        this.pomodoroSettings = {
            workDuration: 25, // minutes
            shortBreak: 5,    // minutes
            longBreak: 15,    // minutes
            sessionsUntilLongBreak: 4
        };
        
        // Focus modes
        this.focusModes = {
            pomodoro: { name: 'Pomodoro', work: 25, shortBreak: 5, longBreak: 15 },
            deep: { name: 'Deep Focus', work: 45, shortBreak: 10, longBreak: 20 },
            sprint: { name: 'Study Sprint', work: 15, shortBreak: 3, longBreak: 10 },
            marathon: { name: 'Study Marathon', work: 60, shortBreak: 15, longBreak: 30 },
            custom: { name: 'Custom', work: 25, shortBreak: 5, longBreak: 15 }
        };
        
        this.currentMode = 'pomodoro';
        this.sessionCount = 0;
        this.isBreak = false;
        this.isLongBreak = false;
    }

    /**
     * Start timer
     */
    startTimer(duration = null, type = 'work') {
        try {
            if (this.isRunning) {
                throw new Error('Timer is already running');
            }

            // Set duration based on type and current mode
            if (!duration) {
                if (type === 'work') {
                    duration = this.focusModes[this.currentMode].work;
                } else if (type === 'shortBreak') {
                    duration = this.focusModes[this.currentMode].shortBreak;
                } else if (type === 'longBreak') {
                    duration = this.focusModes[this.currentMode].longBreak;
                }
            }

            this.totalTime = duration * 60; // Convert to seconds
            this.currentTime = this.totalTime;
            this.isRunning = true;
            this.isPaused = false;
            this.startTime = Date.now();
            this.pauseTime = 0;

            // Create new session
            this.currentSession = {
                id: Date.now(),
                type: type,
                duration: duration,
                startTime: this.startTime,
                endTime: null,
                completed: false,
                paused: false,
                pauseTime: 0,
                focusScore: 0
            };

            // Start the timer interval
            this.timerInterval = setInterval(() => {
                this.updateTimer();
            }, 1000);

            return {
                success: true,
                message: `Started ${type} session for ${duration} minutes`,
                session: this.currentSession
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Pause timer
     */
    pauseTimer() {
        try {
            if (!this.isRunning) {
                throw new Error('Timer is not running');
            }

            if (this.isPaused) {
                throw new Error('Timer is already paused');
            }

            this.isPaused = true;
            this.pauseTime = Date.now();
            this.currentSession.paused = true;
            this.currentSession.pauseTime = this.pauseTime;

            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }

            return {
                success: true,
                message: 'Timer paused',
                session: this.currentSession
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Resume timer
     */
    resumeTimer() {
        try {
            if (!this.isRunning) {
                throw new Error('Timer is not running');
            }

            if (!this.isPaused) {
                throw new Error('Timer is not paused');
            }

            this.isPaused = false;
            const pauseDuration = Date.now() - this.pauseTime;
            this.startTime += pauseDuration;
            this.currentSession.paused = false;
            this.currentSession.pauseTime = 0;

            this.timerInterval = setInterval(() => {
                this.updateTimer();
            }, 1000);

            return {
                success: true,
                message: 'Timer resumed',
                session: this.currentSession
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Stop timer
     */
    stopTimer() {
        try {
            if (!this.isRunning) {
                throw new Error('Timer is not running');
            }

            this.isRunning = false;
            this.isPaused = false;
            this.currentTime = 0;

            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }

            // Complete the session
            if (this.currentSession) {
                this.currentSession.endTime = Date.now();
                this.currentSession.completed = true;
                this.currentSession.duration = Math.round((this.currentSession.endTime - this.currentSession.startTime) / 1000 / 60);
                this.sessions.push(this.currentSession);
                this.updateDailyStats();
            }

            const completedSession = this.currentSession;
            this.currentSession = null;

            return {
                success: true,
                message: 'Timer stopped',
                session: completedSession
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Reset timer
     */
    resetTimer() {
        try {
            this.isRunning = false;
            this.isPaused = false;
            this.currentTime = 0;
            this.totalTime = 0;
            this.startTime = null;
            this.pauseTime = 0;

            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }

            this.currentSession = null;

            return {
                success: true,
                message: 'Timer reset'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update timer
     */
    updateTimer() {
        if (!this.isRunning || this.isPaused) return;

        const now = Date.now();
        const elapsed = Math.floor((now - this.startTime) / 1000);
        this.currentTime = Math.max(0, this.totalTime - elapsed);

        if (this.currentTime <= 0) {
            this.completeSession();
        }
    }

    /**
     * Complete session
     */
    completeSession() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentTime = 0;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        if (this.currentSession) {
            this.currentSession.endTime = Date.now();
            this.currentSession.completed = true;
            this.currentSession.duration = Math.round((this.currentSession.endTime - this.currentSession.startTime) / 1000 / 60);
            this.sessions.push(this.currentSession);
            this.updateDailyStats();
        }

        // Auto-start break if in Pomodoro mode
        if (this.currentMode === 'pomodoro' && this.currentSession && this.currentSession.type === 'work') {
            this.sessionCount++;
            this.scheduleNextSession();
        }
    }

    /**
     * Schedule next session
     */
    scheduleNextSession() {
        const settings = this.pomodoroSettings;
        
        if (this.sessionCount % settings.sessionsUntilLongBreak === 0) {
            // Long break
            this.isLongBreak = true;
            this.isBreak = true;
            return {
                type: 'longBreak',
                duration: settings.longBreak,
                message: 'Time for a long break!'
            };
        } else {
            // Short break
            this.isLongBreak = false;
            this.isBreak = true;
            return {
                type: 'shortBreak',
                duration: settings.shortBreak,
                message: 'Time for a short break!'
            };
        }
    }

    /**
     * Set focus mode
     */
    setFocusMode(mode) {
        if (!this.focusModes[mode]) {
            throw new Error('Invalid focus mode');
        }

        this.currentMode = mode;
        
        if (mode === 'custom') {
            // Allow custom settings
            return {
                success: true,
                message: 'Custom mode selected. Configure your own settings.',
                mode: this.focusModes[mode]
            };
        }

        return {
            success: true,
            message: `Focus mode set to ${this.focusModes[mode].name}`,
            mode: this.focusModes[mode]
        };
    }

    /**
     * Update custom settings
     */
    updateCustomSettings(work, shortBreak, longBreak) {
        this.focusModes.custom.work = work;
        this.focusModes.custom.shortBreak = shortBreak;
        this.focusModes.custom.longBreak = longBreak;

        return {
            success: true,
            message: 'Custom settings updated',
            settings: this.focusModes.custom
        };
    }

    /**
     * Get timer status
     */
    getTimerStatus() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        const progress = this.totalTime > 0 ? ((this.totalTime - this.currentTime) / this.totalTime) * 100 : 0;

        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            currentTime: this.currentTime,
            totalTime: this.totalTime,
            timeRemaining: {
                minutes: minutes,
                seconds: seconds,
                formatted: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            },
            progress: Math.round(progress),
            currentSession: this.currentSession,
            focusMode: this.currentMode,
            sessionCount: this.sessionCount
        };
    }

    /**
     * Get daily statistics
     */
    getDailyStats() {
        const today = new Date().toDateString();
        const todaySessions = this.sessions.filter(session => 
            new Date(session.startTime).toDateString() === today
        );

        const totalStudyTime = todaySessions
            .filter(s => s.type === 'work')
            .reduce((total, session) => total + session.duration, 0);

        const sessionsCompleted = todaySessions.filter(s => s.completed).length;
        const breaksTaken = todaySessions.filter(s => s.type === 'shortBreak' || s.type === 'longBreak').length;

        return {
            date: today,
            totalStudyTime: totalStudyTime,
            sessionsCompleted: sessionsCompleted,
            breaksTaken: breaksTaken,
            averageSessionLength: sessionsCompleted > 0 ? Math.round(totalStudyTime / sessionsCompleted) : 0,
            focusScore: this.calculateFocusScore(todaySessions),
            sessions: todaySessions
        };
    }

    /**
     * Calculate focus score
     */
    calculateFocusScore(sessions) {
        if (sessions.length === 0) return 0;

        const completedSessions = sessions.filter(s => s.completed);
        const totalSessions = sessions.length;
        const completionRate = completedSessions.length / totalSessions;
        
        const averageSessionLength = completedSessions.length > 0 
            ? completedSessions.reduce((sum, s) => sum + s.duration, 0) / completedSessions.length 
            : 0;

        // Focus score based on completion rate and session length
        const focusScore = Math.round((completionRate * 50) + (Math.min(averageSessionLength / 30, 1) * 50));
        return Math.min(focusScore, 100);
    }

    /**
     * Update daily stats
     */
    updateDailyStats() {
        const stats = this.getDailyStats();
        this.dailyStats = stats;
    }

    /**
     * Get session history
     */
    getSessionHistory(limit = 50) {
        return this.sessions
            .sort((a, b) => b.startTime - a.startTime)
            .slice(0, limit);
    }

    /**
     * Get weekly statistics
     */
    getWeeklyStats() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklySessions = this.sessions.filter(session => 
            new Date(session.startTime) >= oneWeekAgo
        );

        const totalStudyTime = weeklySessions
            .filter(s => s.type === 'work')
            .reduce((total, session) => total + session.duration, 0);

        const sessionsCompleted = weeklySessions.filter(s => s.completed).length;
        const averageDailyTime = Math.round(totalStudyTime / 7);

        return {
            weekStart: oneWeekAgo.toDateString(),
            totalStudyTime: totalStudyTime,
            sessionsCompleted: sessionsCompleted,
            averageDailyTime: averageDailyTime,
            mostProductiveDay: this.getMostProductiveDay(weeklySessions),
            focusTrend: this.calculateFocusTrend(weeklySessions)
        };
    }

    /**
     * Get most productive day
     */
    getMostProductiveDay(sessions) {
        const dayStats = {};
        
        sessions.forEach(session => {
            const day = new Date(session.startTime).toDateString();
            if (!dayStats[day]) {
                dayStats[day] = { studyTime: 0, sessions: 0 };
            }
            if (session.type === 'work') {
                dayStats[day].studyTime += session.duration;
            }
            dayStats[day].sessions++;
        });

        let mostProductive = null;
        let maxTime = 0;

        Object.entries(dayStats).forEach(([day, stats]) => {
            if (stats.studyTime > maxTime) {
                maxTime = stats.studyTime;
                mostProductive = { day, ...stats };
            }
        });

        return mostProductive;
    }

    /**
     * Calculate focus trend
     */
    calculateFocusTrend(sessions) {
        const dailyStats = {};
        
        sessions.forEach(session => {
            const day = new Date(session.startTime).toDateString();
            if (!dailyStats[day]) {
                dailyStats[day] = { studyTime: 0, sessions: 0 };
            }
            if (session.type === 'work') {
                dailyStats[day].studyTime += session.duration;
            }
            dailyStats[day].sessions++;
        });

        const days = Object.keys(dailyStats).sort();
        if (days.length < 2) return 'insufficient_data';

        const firstDay = dailyStats[days[0]].studyTime;
        const lastDay = dailyStats[days[days.length - 1]].studyTime;

        if (lastDay > firstDay) return 'improving';
        if (lastDay < firstDay) return 'declining';
        return 'stable';
    }

    /**
     * Add to history
     */
    addToHistory(operation, input, output) {
        this.history.push({
            timestamp: new Date().toISOString(),
            operation: operation,
            input: input,
            output: output
        });

        if (this.history.length > this.maxHistorySize) {
            this.history.pop();
        }
    }

    /**
     * Get history
     */
    getHistory() {
        return this.history;
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
        this.sessions = [];
        this.dailyStats = {
            totalStudyTime: 0,
            sessionsCompleted: 0,
            breaksTaken: 0,
            focusScore: 0
        };
    }
}
