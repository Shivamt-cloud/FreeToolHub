/**
 * Study Planner & Schedule
 * Advanced study planning, scheduling, and time management for students
 */
class StudyPlanner {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        this.schedules = [];
        this.currentSchedule = null;
        this.studySessions = [];
        this.subjects = [];
        this.tasks = [];
        this.goals = [];
        
        // Study session types
        this.sessionTypes = {
            'focused': {
                name: 'Focused Study',
                duration: 45,
                breakDuration: 15,
                color: '#3B82F6',
                description: 'Deep concentration on a single subject'
            },
            'review': {
                name: 'Review Session',
                duration: 30,
                breakDuration: 10,
                color: '#10B981',
                description: 'Review and consolidate previous learning'
            },
            'practice': {
                name: 'Practice Problems',
                duration: 60,
                breakDuration: 20,
                color: '#F59E0B',
                description: 'Solve problems and practice exercises'
            },
            'reading': {
                name: 'Reading Session',
                duration: 40,
                breakDuration: 15,
                color: '#8B5CF6',
                description: 'Read textbooks and study materials'
            },
            'group': {
                name: 'Group Study',
                duration: 90,
                breakDuration: 30,
                color: '#EF4444',
                description: 'Collaborative study with peers'
            },
            'exam_prep': {
                name: 'Exam Preparation',
                duration: 120,
                breakDuration: 30,
                color: '#F97316',
                description: 'Intensive exam preparation and revision'
            }
        };
        
        // Priority levels
        this.priorities = {
            'high': { name: 'High Priority', color: '#EF4444', weight: 3 },
            'medium': { name: 'Medium Priority', color: '#F59E0B', weight: 2 },
            'low': { name: 'Low Priority', color: '#10B981', weight: 1 }
        };
        
        // Study goals
        this.goalTypes = {
            'daily': { name: 'Daily Goal', duration: 1, unit: 'day' },
            'weekly': { name: 'Weekly Goal', duration: 7, unit: 'days' },
            'monthly': { name: 'Monthly Goal', duration: 30, unit: 'days' },
            'semester': { name: 'Semester Goal', duration: 120, unit: 'days' }
        };
        
        // Time slots
        this.timeSlots = [
            '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
            '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
            '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
            '22:00', '22:30', '23:00', '23:30'
        ];
        
        // Days of the week
        this.daysOfWeek = [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ];
    }

    /**
     * Create a new study schedule
     */
    createSchedule(scheduleData) {
        try {
            const schedule = {
                id: Date.now(),
                name: scheduleData.name || 'New Schedule',
                description: scheduleData.description || '',
                startDate: scheduleData.startDate || new Date().toISOString().split('T')[0],
                endDate: scheduleData.endDate || '',
                subjects: scheduleData.subjects || [],
                sessions: scheduleData.sessions || [],
                goals: scheduleData.goals || [],
                createdAt: new Date().toISOString(),
                isActive: scheduleData.isActive || false
            };

            this.schedules.push(schedule);
            this.addToHistory('create_schedule', scheduleData, schedule);
            
            return {
                success: true,
                schedule: schedule,
                message: 'Schedule created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Add a study session
     */
    addStudySession(sessionData) {
        try {
            const session = {
                id: Date.now(),
                title: sessionData.title || 'Study Session',
                subject: sessionData.subject || '',
                type: sessionData.type || 'focused',
                duration: parseInt(sessionData.duration) || 45,
                startTime: sessionData.startTime || '',
                endTime: sessionData.endTime || '',
                date: sessionData.date || new Date().toISOString().split('T')[0],
                priority: sessionData.priority || 'medium',
                description: sessionData.description || '',
                location: sessionData.location || '',
                materials: sessionData.materials || [],
                goals: sessionData.goals || [],
                isCompleted: false,
                createdAt: new Date().toISOString()
            };

            // Calculate end time if not provided
            if (session.startTime && !session.endTime) {
                session.endTime = this.calculateEndTime(session.startTime, session.duration);
            }

            this.studySessions.push(session);
            this.addToHistory('add_study_session', sessionData, session);
            
            return {
                success: true,
                session: session,
                message: 'Study session added successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Add a subject
     */
    addSubject(subjectData) {
        try {
            const subject = {
                id: Date.now(),
                name: subjectData.name || 'New Subject',
                code: subjectData.code || '',
                color: subjectData.color || '#3B82F6',
                description: subjectData.description || '',
                instructor: subjectData.instructor || '',
                credits: subjectData.credits || 3,
                schedule: subjectData.schedule || {},
                goals: subjectData.goals || [],
                materials: subjectData.materials || [],
                createdAt: new Date().toISOString()
            };

            this.subjects.push(subject);
            this.addToHistory('add_subject', subjectData, subject);
            
            return {
                success: true,
                subject: subject,
                message: 'Subject added successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Add a study task
     */
    addTask(taskData) {
        try {
            const task = {
                id: Date.now(),
                title: taskData.title || 'New Task',
                description: taskData.description || '',
                subject: taskData.subject || '',
                priority: taskData.priority || 'medium',
                dueDate: taskData.dueDate || '',
                estimatedTime: taskData.estimatedTime || 60,
                status: taskData.status || 'pending',
                tags: taskData.tags || [],
                notes: taskData.notes || '',
                createdAt: new Date().toISOString()
            };

            this.tasks.push(task);
            this.addToHistory('add_task', taskData, task);
            
            return {
                success: true,
                task: task,
                message: 'Task added successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Add a study goal
     */
    addGoal(goalData) {
        try {
            const goal = {
                id: Date.now(),
                title: goalData.title || 'New Goal',
                description: goalData.description || '',
                type: goalData.type || 'daily',
                target: goalData.target || 1,
                unit: goalData.unit || 'hours',
                deadline: goalData.deadline || '',
                subject: goalData.subject || '',
                progress: 0,
                isCompleted: false,
                createdAt: new Date().toISOString()
            };

            this.goals.push(goal);
            this.addToHistory('add_goal', goalData, goal);
            
            return {
                success: true,
                goal: goal,
                message: 'Goal added successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate study schedule
     */
    generateSchedule(scheduleData) {
        try {
            const { subjects, startDate, endDate, studyHours, preferences } = scheduleData;
            
            if (!subjects || subjects.length === 0) {
                throw new Error('No subjects provided');
            }

            const schedule = [];
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            const hoursPerDay = studyHours / days;
            
            // Generate sessions for each day
            for (let i = 0; i < days; i++) {
                const currentDate = new Date(start);
                currentDate.setDate(start.getDate() + i);
                const dayOfWeek = currentDate.getDay();
                
                // Skip weekends if specified
                if (preferences.skipWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
                    continue;
                }
                
                const daySessions = this.generateDaySchedule(subjects, hoursPerDay, preferences);
                schedule.push({
                    date: currentDate.toISOString().split('T')[0],
                    dayOfWeek: this.daysOfWeek[dayOfWeek],
                    sessions: daySessions
                });
            }

            const result = {
                success: true,
                schedule: schedule,
                totalDays: days,
                totalHours: studyHours,
                message: `Study schedule generated for ${days} days`
            };

            this.addToHistory('generate_schedule', scheduleData, result);
            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generate day schedule
     */
    generateDaySchedule(subjects, hoursPerDay, preferences) {
        const sessions = [];
        const sessionTypes = Object.keys(this.sessionTypes);
        let remainingHours = hoursPerDay;
        
        while (remainingHours > 0) {
            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
            const sessionInfo = this.sessionTypes[sessionType];
            
            const duration = Math.min(sessionInfo.duration, remainingHours * 60);
            const startTime = this.getRandomTimeSlot();
            const endTime = this.calculateEndTime(startTime, duration);
            
            sessions.push({
                subject: subject,
                type: sessionType,
                duration: duration,
                startTime: startTime,
                endTime: endTime,
                priority: this.getRandomPriority(),
                description: sessionInfo.description
            });
            
            remainingHours -= duration / 60;
        }
        
        return sessions.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    /**
     * Get random time slot
     */
    getRandomTimeSlot() {
        const startIndex = Math.floor(Math.random() * (this.timeSlots.length - 8));
        return this.timeSlots[startIndex];
    }

    /**
     * Get random priority
     */
    getRandomPriority() {
        const priorities = Object.keys(this.priorities);
        return priorities[Math.floor(Math.random() * priorities.length)];
    }

    /**
     * Calculate end time
     */
    calculateEndTime(startTime, duration) {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startMinutes = hours * 60 + minutes;
        const endMinutes = startMinutes + duration;
        const endHours = Math.floor(endMinutes / 60);
        const endMins = endMinutes % 60;
        return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
    }

    /**
     * Get study statistics
     */
    getStudyStatistics(period = 'week') {
        try {
            const now = new Date();
            let startDate, endDate;
            
            switch (period) {
                case 'day':
                    startDate = new Date(now);
                    endDate = new Date(now);
                    break;
                case 'week':
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - now.getDay());
                    endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 6);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    break;
                default:
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 7);
                    endDate = new Date(now);
            }
            
            const sessions = this.studySessions.filter(session => {
                const sessionDate = new Date(session.date);
                return sessionDate >= startDate && sessionDate <= endDate;
            });
            
            const completedSessions = sessions.filter(session => session.isCompleted);
            const totalHours = sessions.reduce((sum, session) => sum + session.duration, 0) / 60;
            const completedHours = completedSessions.reduce((sum, session) => sum + session.duration, 0) / 60;
            
            const subjectStats = {};
            sessions.forEach(session => {
                if (!subjectStats[session.subject]) {
                    subjectStats[session.subject] = { hours: 0, sessions: 0 };
                }
                subjectStats[session.subject].hours += session.duration / 60;
                subjectStats[session.subject].sessions += 1;
            });
            
            const statistics = {
                period: period,
                totalSessions: sessions.length,
                completedSessions: completedSessions.length,
                completionRate: sessions.length > 0 ? (completedSessions.length / sessions.length) * 100 : 0,
                totalHours: Math.round(totalHours * 100) / 100,
                completedHours: Math.round(completedHours * 100) / 100,
                averageSessionDuration: sessions.length > 0 ? Math.round((totalHours / sessions.length) * 60) : 0,
                subjectStats: subjectStats,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            };
            
            return {
                success: true,
                statistics: statistics,
                message: `Study statistics calculated for ${period}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get upcoming sessions
     */
    getUpcomingSessions(days = 7) {
        const now = new Date();
        const futureDate = new Date(now);
        futureDate.setDate(now.getDate() + days);
        
        const upcomingSessions = this.studySessions.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate >= now && sessionDate <= futureDate && !session.isCompleted;
        });
        
        return upcomingSessions.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    /**
     * Mark session as completed
     */
    markSessionCompleted(sessionId) {
        const session = this.studySessions.find(s => s.id === sessionId);
        if (session) {
            session.isCompleted = true;
            session.completedAt = new Date().toISOString();
            this.addToHistory('mark_session_completed', { sessionId }, session);
            return { success: true, session: session };
        }
        return { success: false, error: 'Session not found' };
    }

    /**
     * Update goal progress
     */
    updateGoalProgress(goalId, progress) {
        const goal = this.goals.find(g => g.id === goalId);
        if (goal) {
            goal.progress = Math.min(progress, goal.target);
            goal.isCompleted = goal.progress >= goal.target;
            this.addToHistory('update_goal_progress', { goalId, progress }, goal);
            return { success: true, goal: goal };
        }
        return { success: false, error: 'Goal not found' };
    }

    /**
     * Get study recommendations
     */
    getStudyRecommendations() {
        const recommendations = [];
        
        // Check for overdue tasks
        const overdueTasks = this.tasks.filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate < new Date() && task.status !== 'completed';
        });
        
        if (overdueTasks.length > 0) {
            recommendations.push({
                type: 'urgent',
                title: 'Overdue Tasks',
                message: `You have ${overdueTasks.length} overdue tasks that need immediate attention.`,
                action: 'Review and prioritize these tasks.'
            });
        }
        
        // Check for upcoming deadlines
        const upcomingDeadlines = this.tasks.filter(task => {
            const dueDate = new Date(task.dueDate);
            const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
            return daysUntilDue <= 3 && daysUntilDue > 0 && task.status !== 'completed';
        });
        
        if (upcomingDeadlines.length > 0) {
            recommendations.push({
                type: 'warning',
                title: 'Upcoming Deadlines',
                message: `You have ${upcomingDeadlines.length} tasks due within 3 days.`,
                action: 'Plan study sessions to complete these tasks.'
            });
        }
        
        // Check study consistency
        const stats = this.getStudyStatistics('week');
        if (stats.success && stats.statistics.completionRate < 70) {
            recommendations.push({
                type: 'info',
                title: 'Study Consistency',
                message: `Your study completion rate is ${stats.statistics.completionRate.toFixed(1)}%.`,
                action: 'Try to maintain a more consistent study schedule.'
            });
        }
        
        return recommendations;
    }

    /**
     * Export schedule
     */
    exportSchedule(format = 'json') {
        const data = {
            schedules: this.schedules,
            sessions: this.studySessions,
            subjects: this.subjects,
            tasks: this.tasks,
            goals: this.goals,
            exportDate: new Date().toISOString()
        };

        if (format === 'csv') {
            return this.exportToCSV(data);
        } else {
            return {
                success: true,
                data: data,
                format: format
            };
        }
    }

    /**
     * Export to CSV
     */
    exportToCSV(data) {
        const headers = ['Type', 'Title', 'Subject', 'Date', 'Start Time', 'Duration', 'Status'];
        const rows = [];
        
        // Add sessions
        data.sessions.forEach(session => {
            rows.push([
                'Session',
                session.title,
                session.subject,
                session.date,
                session.startTime,
                session.duration,
                session.isCompleted ? 'Completed' : 'Pending'
            ]);
        });
        
        // Add tasks
        data.tasks.forEach(task => {
            rows.push([
                'Task',
                task.title,
                task.subject,
                task.dueDate,
                '',
                task.estimatedTime,
                task.status
            ]);
        });
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        return {
            success: true,
            content: csvContent,
            format: 'csv'
        };
    }

    /**
     * Get session types
     */
    getSessionTypes() {
        return this.sessionTypes;
    }

    /**
     * Get priorities
     */
    getPriorities() {
        return this.priorities;
    }

    /**
     * Get goal types
     */
    getGoalTypes() {
        return this.goalTypes;
    }

    /**
     * Get time slots
     */
    getTimeSlots() {
        return this.timeSlots;
    }

    /**
     * Get days of week
     */
    getDaysOfWeek() {
        return this.daysOfWeek;
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
            this.history.shift();
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
        this.schedules = [];
        this.studySessions = [];
        this.subjects = [];
        this.tasks = [];
        this.goals = [];
    }
}
