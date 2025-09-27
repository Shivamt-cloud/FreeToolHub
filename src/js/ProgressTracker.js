/**
 * Progress Tracker & Analytics
 * Comprehensive academic progress tracking, performance analytics, and study insights
 */
class ProgressTracker {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        this.subjects = [];
        this.courses = [];
        this.assignments = [];
        this.exams = [];
        this.studySessions = [];
        this.goals = [];
        this.achievements = [];
        
        // Analytics data
        this.analytics = {
            overallGPA: 0,
            totalStudyTime: 0,
            totalAssignments: 0,
            totalExams: 0,
            averageScore: 0,
            studyStreak: 0,
            lastStudyDate: null,
            performanceTrend: 'stable',
            strengths: [],
            weaknesses: [],
            recommendations: []
        };
        
        // Performance categories
        this.performanceCategories = {
            'excellent': { min: 90, color: '#10B981', label: 'Excellent' },
            'good': { min: 80, color: '#3B82F6', label: 'Good' },
            'average': { min: 70, color: '#F59E0B', label: 'Average' },
            'needs_improvement': { min: 60, color: '#EF4444', label: 'Needs Improvement' },
            'failing': { min: 0, color: '#6B7280', label: 'Failing' }
        };
        
        // Study patterns
        this.studyPatterns = {
            mostProductiveTime: null,
            averageSessionLength: 0,
            preferredSubjects: [],
            studyFrequency: 0,
            breakPatterns: []
        };
        
        // Goal types
        this.goalTypes = {
            'gpa': { name: 'GPA Goal', unit: 'GPA', target: 3.5 },
            'study_time': { name: 'Study Time Goal', unit: 'hours', target: 20 },
            'assignments': { name: 'Assignment Goal', unit: 'assignments', target: 10 },
            'exams': { name: 'Exam Goal', unit: 'exams', target: 5 },
            'attendance': { name: 'Attendance Goal', unit: '%', target: 95 }
        };
    }

    /**
     * Add a subject
     */
    addSubject(subjectData) {
        try {
            const subject = {
                id: Date.now(),
                name: subjectData.name || '',
                code: subjectData.code || '',
                credits: subjectData.credits || 3,
                instructor: subjectData.instructor || '',
                semester: subjectData.semester || '',
                year: subjectData.year || new Date().getFullYear(),
                color: subjectData.color || '#3B82F6',
                createdAt: new Date().toISOString(),
                totalAssignments: 0,
                totalExams: 0,
                averageScore: 0,
                currentGrade: 'N/A'
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
     * Add an assignment
     */
    addAssignment(assignmentData) {
        try {
            const assignment = {
                id: Date.now(),
                subjectId: assignmentData.subjectId,
                title: assignmentData.title || '',
                description: assignmentData.description || '',
                type: assignmentData.type || 'homework',
                dueDate: assignmentData.dueDate || '',
                points: assignmentData.points || 100,
                earnedPoints: assignmentData.earnedPoints || 0,
                grade: assignmentData.grade || 0,
                status: assignmentData.status || 'pending',
                priority: assignmentData.priority || 'medium',
                createdAt: new Date().toISOString(),
                submittedAt: assignmentData.submittedAt || null,
                feedback: assignmentData.feedback || ''
            };

            this.assignments.push(assignment);
            this.updateSubjectStats(assignment.subjectId);
            this.addToHistory('add_assignment', assignmentData, assignment);
            
            return {
                success: true,
                assignment: assignment,
                message: 'Assignment added successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Add an exam
     */
    addExam(examData) {
        try {
            const exam = {
                id: Date.now(),
                subjectId: examData.subjectId,
                title: examData.title || '',
                type: examData.type || 'midterm',
                date: examData.date || '',
                duration: examData.duration || 120,
                totalMarks: examData.totalMarks || 100,
                obtainedMarks: examData.obtainedMarks || 0,
                grade: examData.grade || 0,
                status: examData.status || 'scheduled',
                location: examData.location || '',
                notes: examData.notes || '',
                createdAt: new Date().toISOString(),
                completedAt: examData.completedAt || null
            };

            this.exams.push(exam);
            this.updateSubjectStats(exam.subjectId);
            this.addToHistory('add_exam', examData, exam);
            
            return {
                success: true,
                exam: exam,
                message: 'Exam added successfully'
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
                subjectId: sessionData.subjectId,
                title: sessionData.title || '',
                description: sessionData.description || '',
                startTime: sessionData.startTime || new Date().toISOString(),
                endTime: sessionData.endTime || null,
                duration: sessionData.duration || 0,
                type: sessionData.type || 'study',
                productivity: sessionData.productivity || 5,
                notes: sessionData.notes || '',
                resources: sessionData.resources || [],
                goals: sessionData.goals || [],
                achievements: sessionData.achievements || [],
                createdAt: new Date().toISOString()
            };

            this.studySessions.push(session);
            this.updateStudyPatterns(session);
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
     * Add a goal
     */
    addGoal(goalData) {
        try {
            const goal = {
                id: Date.now(),
                type: goalData.type || 'gpa',
                title: goalData.title || '',
                description: goalData.description || '',
                target: goalData.target || 0,
                current: goalData.current || 0,
                unit: goalData.unit || '',
                deadline: goalData.deadline || '',
                status: goalData.status || 'active',
                priority: goalData.priority || 'medium',
                createdAt: new Date().toISOString(),
                achievedAt: goalData.achievedAt || null
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
     * Update assignment grade
     */
    updateAssignmentGrade(assignmentId, grade, feedback = '') {
        try {
            const assignment = this.assignments.find(a => a.id === assignmentId);
            if (!assignment) {
                throw new Error('Assignment not found');
            }

            assignment.grade = grade;
            assignment.earnedPoints = (grade / 100) * assignment.points;
            assignment.status = 'completed';
            assignment.feedback = feedback;
            assignment.submittedAt = new Date().toISOString();

            this.updateSubjectStats(assignment.subjectId);
            this.addToHistory('update_assignment_grade', { assignmentId, grade }, assignment);
            
            return {
                success: true,
                assignment: assignment,
                message: 'Assignment grade updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update exam grade
     */
    updateExamGrade(examId, grade, notes = '') {
        try {
            const exam = this.exams.find(e => e.id === examId);
            if (!exam) {
                throw new Error('Exam not found');
            }

            exam.grade = grade;
            exam.obtainedMarks = (grade / 100) * exam.totalMarks;
            exam.status = 'completed';
            exam.notes = notes;
            exam.completedAt = new Date().toISOString();

            this.updateSubjectStats(exam.subjectId);
            this.addToHistory('update_exam_grade', { examId, grade }, exam);
            
            return {
                success: true,
                exam: exam,
                message: 'Exam grade updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update subject statistics
     */
    updateSubjectStats(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return;

        const subjectAssignments = this.assignments.filter(a => a.subjectId === subjectId && a.status === 'completed');
        const subjectExams = this.exams.filter(e => e.subjectId === subjectId && e.status === 'completed');

        subject.totalAssignments = subjectAssignments.length;
        subject.totalExams = subjectExams.length;

        const allGrades = [...subjectAssignments.map(a => a.grade), ...subjectExams.map(e => e.grade)];
        subject.averageScore = allGrades.length > 0 ? allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length : 0;

        // Calculate current grade based on assignments and exams
        if (allGrades.length > 0) {
            subject.currentGrade = this.calculateLetterGrade(subject.averageScore);
        }
    }

    /**
     * Calculate letter grade
     */
    calculateLetterGrade(percentage) {
        if (percentage >= 97) return 'A+';
        if (percentage >= 93) return 'A';
        if (percentage >= 90) return 'A-';
        if (percentage >= 87) return 'B+';
        if (percentage >= 83) return 'B';
        if (percentage >= 80) return 'B-';
        if (percentage >= 77) return 'C+';
        if (percentage >= 73) return 'C';
        if (percentage >= 70) return 'C-';
        if (percentage >= 67) return 'D+';
        if (percentage >= 63) return 'D';
        if (percentage >= 60) return 'D-';
        return 'F';
    }

    /**
     * Update study patterns
     */
    updateStudyPatterns(session) {
        // Update most productive time
        const hour = new Date(session.startTime).getHours();
        if (!this.studyPatterns.mostProductiveTime) {
            this.studyPatterns.mostProductiveTime = hour;
        } else {
            // Simple average for now
            this.studyPatterns.mostProductiveTime = Math.round((this.studyPatterns.mostProductiveTime + hour) / 2);
        }

        // Update average session length
        const totalSessions = this.studySessions.length;
        this.studyPatterns.averageSessionLength = totalSessions > 0 ? 
            this.studySessions.reduce((sum, s) => sum + s.duration, 0) / totalSessions : 0;

        // Update study frequency
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const recentSessions = this.studySessions.filter(s => new Date(s.startTime) >= lastWeek);
        this.studyPatterns.studyFrequency = recentSessions.length;
    }

    /**
     * Get overall analytics
     */
    getOverallAnalytics() {
        this.calculateOverallGPA();
        this.calculatePerformanceTrend();
        this.identifyStrengthsAndWeaknesses();
        this.generateRecommendations();

        return {
            gpa: this.analytics.overallGPA,
            totalStudyTime: this.analytics.totalStudyTime,
            totalAssignments: this.analytics.totalAssignments,
            totalExams: this.analytics.totalExams,
            averageScore: this.analytics.averageScore,
            studyStreak: this.analytics.studyStreak,
            lastStudyDate: this.analytics.lastStudyDate,
            performanceTrend: this.analytics.performanceTrend,
            strengths: this.analytics.strengths,
            weaknesses: this.analytics.weaknesses,
            recommendations: this.analytics.recommendations,
            studyPatterns: this.studyPatterns
        };
    }

    /**
     * Calculate overall GPA
     */
    calculateOverallGPA() {
        const completedSubjects = this.subjects.filter(s => s.averageScore > 0);
        if (completedSubjects.length === 0) {
            this.analytics.overallGPA = 0;
            return;
        }

        const totalCredits = completedSubjects.reduce((sum, s) => sum + s.credits, 0);
        const weightedGPA = completedSubjects.reduce((sum, s) => {
            const gpa = this.percentageToGPA(s.averageScore);
            return sum + (gpa * s.credits);
        }, 0);

        this.analytics.overallGPA = totalCredits > 0 ? weightedGPA / totalCredits : 0;
    }

    /**
     * Convert percentage to GPA
     */
    percentageToGPA(percentage) {
        if (percentage >= 97) return 4.0;
        if (percentage >= 93) return 3.7;
        if (percentage >= 90) return 3.3;
        if (percentage >= 87) return 3.0;
        if (percentage >= 83) return 2.7;
        if (percentage >= 80) return 2.3;
        if (percentage >= 77) return 2.0;
        if (percentage >= 73) return 1.7;
        if (percentage >= 70) return 1.3;
        if (percentage >= 67) return 1.0;
        if (percentage >= 63) return 0.7;
        if (percentage >= 60) return 0.3;
        return 0.0;
    }

    /**
     * Calculate performance trend
     */
    calculatePerformanceTrend() {
        const recentAssignments = this.assignments
            .filter(a => a.status === 'completed')
            .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
            .slice(-10);

        if (recentAssignments.length < 2) {
            this.analytics.performanceTrend = 'stable';
            return;
        }

        const firstHalf = recentAssignments.slice(0, Math.floor(recentAssignments.length / 2));
        const secondHalf = recentAssignments.slice(Math.floor(recentAssignments.length / 2));

        const firstAvg = firstHalf.reduce((sum, a) => sum + a.grade, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, a) => sum + a.grade, 0) / secondHalf.length;

        if (secondAvg > firstAvg + 5) {
            this.analytics.performanceTrend = 'improving';
        } else if (secondAvg < firstAvg - 5) {
            this.analytics.performanceTrend = 'declining';
        } else {
            this.analytics.performanceTrend = 'stable';
        }
    }

    /**
     * Identify strengths and weaknesses
     */
    identifyStrengthsAndWeaknesses() {
        const subjectPerformance = this.subjects.map(subject => ({
            name: subject.name,
            averageScore: subject.averageScore,
            totalAssignments: subject.totalAssignments,
            totalExams: subject.totalExams
        })).filter(s => s.averageScore > 0);

        if (subjectPerformance.length === 0) {
            this.analytics.strengths = [];
            this.analytics.weaknesses = [];
            return;
        }

        const averageScore = subjectPerformance.reduce((sum, s) => sum + s.averageScore, 0) / subjectPerformance.length;

        this.analytics.strengths = subjectPerformance
            .filter(s => s.averageScore > averageScore + 10)
            .map(s => s.name);

        this.analytics.weaknesses = subjectPerformance
            .filter(s => s.averageScore < averageScore - 10)
            .map(s => s.name);
    }

    /**
     * Generate recommendations
     */
    generateRecommendations() {
        this.analytics.recommendations = [];

        // GPA recommendations
        if (this.analytics.overallGPA < 3.0) {
            this.analytics.recommendations.push('Focus on improving your GPA. Consider seeking help from tutors or study groups.');
        }

        // Study time recommendations
        if (this.analytics.totalStudyTime < 20) {
            this.analytics.recommendations.push('Increase your study time. Aim for at least 20 hours per week.');
        }

        // Performance trend recommendations
        if (this.analytics.performanceTrend === 'declining') {
            this.analytics.recommendations.push('Your performance is declining. Review your study methods and seek help if needed.');
        }

        // Weakness recommendations
        if (this.analytics.weaknesses.length > 0) {
            this.analytics.recommendations.push(`Focus on improving your performance in: ${this.analytics.weaknesses.join(', ')}`);
        }

        // Study pattern recommendations
        if (this.studyPatterns.studyFrequency < 3) {
            this.analytics.recommendations.push('Increase your study frequency. Try to study at least 3 times per week.');
        }
    }

    /**
     * Get subject analytics
     */
    getSubjectAnalytics(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return null;

        const subjectAssignments = this.assignments.filter(a => a.subjectId === subjectId);
        const subjectExams = this.exams.filter(e => e.subjectId === subjectId);
        const subjectSessions = this.studySessions.filter(s => s.subjectId === subjectId);

        return {
            subject: subject,
            assignments: subjectAssignments,
            exams: subjectExams,
            studySessions: subjectSessions,
            totalStudyTime: subjectSessions.reduce((sum, s) => sum + s.duration, 0),
            averageProductivity: subjectSessions.length > 0 ? 
                subjectSessions.reduce((sum, s) => sum + s.productivity, 0) / subjectSessions.length : 0,
            gradeDistribution: this.getGradeDistribution(subjectAssignments, subjectExams),
            performanceTrend: this.getSubjectPerformanceTrend(subjectAssignments, subjectExams)
        };
    }

    /**
     * Get grade distribution
     */
    getGradeDistribution(assignments, exams) {
        const allGrades = [...assignments.map(a => a.grade), ...exams.map(e => e.grade)];
        const distribution = {};

        Object.keys(this.performanceCategories).forEach(category => {
            const categoryData = this.performanceCategories[category];
            distribution[category] = allGrades.filter(grade => 
                grade >= categoryData.min && grade < (categoryData.min + 10)
            ).length;
        });

        return distribution;
    }

    /**
     * Get subject performance trend
     */
    getSubjectPerformanceTrend(assignments, exams) {
        const allItems = [...assignments, ...exams]
            .filter(item => item.status === 'completed')
            .sort((a, b) => new Date(a.submittedAt || a.completedAt) - new Date(b.submittedAt || b.completedAt));

        if (allItems.length < 3) return 'insufficient_data';

        const recent = allItems.slice(-3);
        const older = allItems.slice(0, -3);

        if (older.length === 0) return 'insufficient_data';

        const recentAvg = recent.reduce((sum, item) => sum + item.grade, 0) / recent.length;
        const olderAvg = older.reduce((sum, item) => sum + item.grade, 0) / older.length;

        if (recentAvg > olderAvg + 5) return 'improving';
        if (recentAvg < olderAvg - 5) return 'declining';
        return 'stable';
    }

    /**
     * Get study insights
     */
    getStudyInsights() {
        const insights = {
            mostProductiveTime: this.studyPatterns.mostProductiveTime,
            averageSessionLength: this.studyPatterns.averageSessionLength,
            studyFrequency: this.studyPatterns.studyFrequency,
            totalStudyTime: this.studySessions.reduce((sum, s) => sum + s.duration, 0),
            averageProductivity: this.studySessions.length > 0 ? 
                this.studySessions.reduce((sum, s) => sum + s.productivity, 0) / this.studySessions.length : 0,
            studyStreak: this.calculateStudyStreak(),
            preferredSubjects: this.getPreferredSubjects(),
            studyGoals: this.getStudyGoals()
        };

        return insights;
    }

    /**
     * Calculate study streak
     */
    calculateStudyStreak() {
        const today = new Date();
        let streak = 0;
        let currentDate = new Date(today);

        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const hasStudySession = this.studySessions.some(session => 
                session.startTime.split('T')[0] === dateStr
            );

            if (hasStudySession) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }

    /**
     * Get preferred subjects
     */
    getPreferredSubjects() {
        const subjectStudyTime = {};
        
        this.studySessions.forEach(session => {
            if (session.subjectId) {
                subjectStudyTime[session.subjectId] = (subjectStudyTime[session.subjectId] || 0) + session.duration;
            }
        });

        return Object.entries(subjectStudyTime)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([subjectId, time]) => {
                const subject = this.subjects.find(s => s.id === parseInt(subjectId));
                return {
                    name: subject ? subject.name : 'Unknown',
                    studyTime: time
                };
            });
    }

    /**
     * Get study goals
     */
    getStudyGoals() {
        return this.goals.filter(goal => goal.status === 'active');
    }

    /**
     * Export data
     */
    exportData(format = 'json') {
        try {
            const data = {
                subjects: this.subjects,
                assignments: this.assignments,
                exams: this.exams,
                studySessions: this.studySessions,
                goals: this.goals,
                analytics: this.getOverallAnalytics(),
                insights: this.getStudyInsights(),
                exportDate: new Date().toISOString(),
                version: '1.0'
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
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Export to CSV
     */
    exportToCSV(data) {
        const csvContent = [
            'Subject,Assignments,Exams,Average Score,Study Time,Current Grade',
            ...data.subjects.map(subject => [
                subject.name,
                subject.totalAssignments,
                subject.totalExams,
                subject.averageScore.toFixed(1),
                data.studySessions.filter(s => s.subjectId === subject.id).reduce((sum, s) => sum + s.duration, 0),
                subject.currentGrade
            ].join(','))
        ].join('\n');

        return {
            success: true,
            content: csvContent,
            format: 'csv'
        };
    }

    /**
     * Get subjects
     */
    getSubjects() {
        return this.subjects;
    }

    /**
     * Get assignments
     */
    getAssignments(subjectId = null) {
        if (subjectId) {
            return this.assignments.filter(a => a.subjectId === subjectId);
        }
        return this.assignments;
    }

    /**
     * Get exams
     */
    getExams(subjectId = null) {
        if (subjectId) {
            return this.exams.filter(e => e.subjectId === subjectId);
        }
        return this.exams;
    }

    /**
     * Get study sessions
     */
    getStudySessions(subjectId = null) {
        if (subjectId) {
            return this.studySessions.filter(s => s.subjectId === subjectId);
        }
        return this.studySessions;
    }

    /**
     * Get goals
     */
    getGoals() {
        return this.goals;
    }

    /**
     * Delete subject
     */
    deleteSubject(subjectId) {
        const subjectIndex = this.subjects.findIndex(s => s.id === subjectId);
        if (subjectIndex === -1) {
            return { success: false, error: 'Subject not found' };
        }

        // Delete related assignments, exams, and study sessions
        this.assignments = this.assignments.filter(a => a.subjectId !== subjectId);
        this.exams = this.exams.filter(e => e.subjectId !== subjectId);
        this.studySessions = this.studySessions.filter(s => s.subjectId !== subjectId);

        const deletedSubject = this.subjects.splice(subjectIndex, 1)[0];
        this.addToHistory('delete_subject', { subjectId }, deletedSubject);
        
        return {
            success: true,
            subject: deletedSubject,
            message: 'Subject deleted successfully'
        };
    }

    /**
     * Delete assignment
     */
    deleteAssignment(assignmentId) {
        const assignmentIndex = this.assignments.findIndex(a => a.id === assignmentId);
        if (assignmentIndex === -1) {
            return { success: false, error: 'Assignment not found' };
        }

        const deletedAssignment = this.assignments.splice(assignmentIndex, 1)[0];
        this.updateSubjectStats(deletedAssignment.subjectId);
        this.addToHistory('delete_assignment', { assignmentId }, deletedAssignment);
        
        return {
            success: true,
            assignment: deletedAssignment,
            message: 'Assignment deleted successfully'
        };
    }

    /**
     * Delete exam
     */
    deleteExam(examId) {
        const examIndex = this.exams.findIndex(e => e.id === examId);
        if (examIndex === -1) {
            return { success: false, error: 'Exam not found' };
        }

        const deletedExam = this.exams.splice(examIndex, 1)[0];
        this.updateSubjectStats(deletedExam.subjectId);
        this.addToHistory('delete_exam', { examId }, deletedExam);
        
        return {
            success: true,
            exam: deletedExam,
            message: 'Exam deleted successfully'
        };
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
        this.subjects = [];
        this.assignments = [];
        this.exams = [];
        this.studySessions = [];
        this.goals = [];
        this.analytics = {
            overallGPA: 0,
            totalStudyTime: 0,
            totalAssignments: 0,
            totalExams: 0,
            averageScore: 0,
            studyStreak: 0,
            lastStudyDate: null,
            performanceTrend: 'stable',
            strengths: [],
            weaknesses: [],
            recommendations: []
        };
    }
}
