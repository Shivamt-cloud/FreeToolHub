/**
 * Grade Calculator
 * Advanced grade calculation, GPA tracking, and academic performance analysis
 */
class GradeCalculator {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
        this.courses = [];
        this.semesters = [];
        this.currentSemester = null;
        
        // Grade scales
        this.gradeScales = {
            '4.0': {
                name: '4.0 Scale',
                grades: {
                    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
                    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
                    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
                    'F': 0.0
                }
            },
            '100': {
                name: '100 Point Scale',
                grades: {
                    'A+': 97, 'A': 93, 'A-': 90,
                    'B+': 87, 'B': 83, 'B-': 80,
                    'C+': 77, 'C': 73, 'C-': 70,
                    'D+': 67, 'D': 63, 'D-': 60,
                    'F': 0
                }
            },
            'percentage': {
                name: 'Percentage Scale',
                grades: {
                    'A+': 97, 'A': 93, 'A-': 90,
                    'B+': 87, 'B': 83, 'B-': 80,
                    'C+': 77, 'C': 73, 'C-': 70,
                    'D+': 67, 'D': 63, 'D-': 60,
                    'F': 0
                }
            }
        };
        
        // Grade categories
        this.gradeCategories = {
            'homework': { name: 'Homework', weight: 0.2, color: '#3B82F6' },
            'quizzes': { name: 'Quizzes', weight: 0.2, color: '#10B981' },
            'exams': { name: 'Exams', weight: 0.4, color: '#F59E0B' },
            'projects': { name: 'Projects', weight: 0.2, color: '#EF4444' },
            'participation': { name: 'Participation', weight: 0.1, color: '#8B5CF6' }
        };
        
        // Academic levels
        this.academicLevels = {
            'high_school': { name: 'High School', maxGPA: 4.0 },
            'college': { name: 'College', maxGPA: 4.0 },
            'graduate': { name: 'Graduate School', maxGPA: 4.0 },
            'international': { name: 'International', maxGPA: 4.0 }
        };
    }

    /**
     * Add a course
     */
    addCourse(courseData) {
        try {
            const course = {
                id: Date.now(),
                name: courseData.name,
                code: courseData.code || '',
                credits: parseFloat(courseData.credits) || 3,
                grade: courseData.grade || '',
                points: courseData.points || 0,
                semester: courseData.semester || this.currentSemester,
                category: courseData.category || 'general',
                createdAt: new Date().toISOString(),
                assignments: courseData.assignments || []
            };

            this.courses.push(course);
            this.addToHistory('add_course', courseData, course);
            
            return {
                success: true,
                course: course,
                message: 'Course added successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Calculate GPA
     */
    calculateGPA(semester = null, scale = '4.0') {
        try {
            const courses = semester ? 
                this.courses.filter(course => course.semester === semester) : 
                this.courses;

            if (courses.length === 0) {
                return {
                    success: false,
                    error: 'No courses found for GPA calculation'
                };
            }

            const gradeScale = this.gradeScales[scale];
            let totalPoints = 0;
            let totalCredits = 0;
            let validCourses = 0;

            const courseDetails = courses.map(course => {
                const gradeValue = this.getGradeValue(course.grade, scale);
                const points = gradeValue * course.credits;
                
                totalPoints += points;
                totalCredits += course.credits;
                if (gradeValue > 0) validCourses++;

                return {
                    course: course,
                    gradeValue: gradeValue,
                    points: points,
                    credits: course.credits
                };
            });

            const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
            const letterGrade = this.getLetterGrade(gpa, scale);

            const result = {
                success: true,
                gpa: Math.round(gpa * 1000) / 1000,
                letterGrade: letterGrade,
                totalPoints: totalPoints,
                totalCredits: totalCredits,
                validCourses: validCourses,
                totalCourses: courses.length,
                scale: scale,
                semester: semester,
                courseDetails: courseDetails,
                message: `GPA calculated: ${gpa.toFixed(3)} (${letterGrade})`
            };

            this.addToHistory('calculate_gpa', { semester, scale }, result);
            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Calculate weighted grade
     */
    calculateWeightedGrade(assignments, weights = null) {
        try {
            if (!assignments || assignments.length === 0) {
                throw new Error('No assignments provided');
            }

            const defaultWeights = weights || this.gradeCategories;
            let totalWeightedPoints = 0;
            let totalWeight = 0;

            const assignmentDetails = assignments.map(assignment => {
                const category = assignment.category || 'homework';
                const weight = defaultWeights[category]?.weight || 0.2;
                const points = parseFloat(assignment.points) || 0;
                const maxPoints = parseFloat(assignment.maxPoints) || 100;
                const percentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
                const weightedPoints = percentage * weight;

                totalWeightedPoints += weightedPoints;
                totalWeight += weight;

                return {
                    ...assignment,
                    percentage: Math.round(percentage * 100) / 100,
                    weight: weight,
                    weightedPoints: Math.round(weightedPoints * 100) / 100
                };
            });

            const finalGrade = totalWeight > 0 ? totalWeightedPoints / totalWeight : 0;
            const letterGrade = this.getLetterGrade(finalGrade, 'percentage');

            const result = {
                success: true,
                finalGrade: Math.round(finalGrade * 100) / 100,
                letterGrade: letterGrade,
                totalWeightedPoints: Math.round(totalWeightedPoints * 100) / 100,
                totalWeight: totalWeight,
                assignmentDetails: assignmentDetails,
                message: `Final grade: ${finalGrade.toFixed(1)}% (${letterGrade})`
            };

            this.addToHistory('calculate_weighted_grade', { assignments, weights }, result);
            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Calculate semester GPA
     */
    calculateSemesterGPA(semester, scale = '4.0') {
        return this.calculateGPA(semester, scale);
    }

    /**
     * Calculate cumulative GPA
     */
    calculateCumulativeGPA(scale = '4.0') {
        return this.calculateGPA(null, scale);
    }

    /**
     * Get grade value
     */
    getGradeValue(grade, scale = '4.0') {
        const gradeScale = this.gradeScales[scale];
        if (!gradeScale) return 0;

        // Handle numeric grades
        if (!isNaN(grade)) {
            const numGrade = parseFloat(grade);
            if (scale === '4.0') {
                return this.convertPercentageToGPA(numGrade);
            } else {
                return numGrade;
            }
        }

        // Handle letter grades
        return gradeScale.grades[grade.toUpperCase()] || 0;
    }

    /**
     * Convert percentage to GPA
     */
    convertPercentageToGPA(percentage) {
        if (percentage >= 97) return 4.0;
        if (percentage >= 93) return 4.0;
        if (percentage >= 90) return 3.7;
        if (percentage >= 87) return 3.3;
        if (percentage >= 83) return 3.0;
        if (percentage >= 80) return 2.7;
        if (percentage >= 77) return 2.3;
        if (percentage >= 73) return 2.0;
        if (percentage >= 70) return 1.7;
        if (percentage >= 67) return 1.3;
        if (percentage >= 63) return 1.0;
        if (percentage >= 60) return 0.7;
        return 0.0;
    }

    /**
     * Get letter grade
     */
    getLetterGrade(grade, scale = '4.0') {
        if (scale === '4.0') {
            if (grade >= 4.0) return 'A+';
            if (grade >= 3.7) return 'A';
            if (grade >= 3.3) return 'A-';
            if (grade >= 3.0) return 'B+';
            if (grade >= 2.7) return 'B';
            if (grade >= 2.3) return 'B-';
            if (grade >= 2.0) return 'C+';
            if (grade >= 1.7) return 'C';
            if (grade >= 1.3) return 'C-';
            if (grade >= 1.0) return 'D+';
            if (grade >= 0.7) return 'D';
            if (grade >= 0.3) return 'D-';
            return 'F';
        } else {
            if (grade >= 97) return 'A+';
            if (grade >= 93) return 'A';
            if (grade >= 90) return 'A-';
            if (grade >= 87) return 'B+';
            if (grade >= 83) return 'B';
            if (grade >= 80) return 'B-';
            if (grade >= 77) return 'C+';
            if (grade >= 73) return 'C';
            if (grade >= 70) return 'C-';
            if (grade >= 67) return 'D+';
            if (grade >= 63) return 'D';
            if (grade >= 60) return 'D-';
            return 'F';
        }
    }

    /**
     * Calculate grade needed
     */
    calculateGradeNeeded(currentGrade, targetGrade, remainingWeight) {
        try {
            const current = parseFloat(currentGrade) || 0;
            const target = parseFloat(targetGrade) || 0;
            const weight = parseFloat(remainingWeight) || 0;

            if (weight <= 0 || weight > 1) {
                throw new Error('Remaining weight must be between 0 and 1');
            }

            const needed = (target - (current * (1 - weight))) / weight;
            const letterGrade = this.getLetterGrade(needed, 'percentage');

            const result = {
                success: true,
                neededGrade: Math.round(needed * 100) / 100,
                letterGrade: letterGrade,
                currentGrade: current,
                targetGrade: target,
                remainingWeight: weight,
                message: `You need ${needed.toFixed(1)}% (${letterGrade}) to achieve ${target}%`
            };

            this.addToHistory('calculate_grade_needed', { currentGrade, targetGrade, remainingWeight }, result);
            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get academic standing
     */
    getAcademicStanding(gpa, level = 'college') {
        const academicLevel = this.academicLevels[level];
        if (!academicLevel) return 'Unknown';

        if (gpa >= 3.5) return 'Dean\'s List';
        if (gpa >= 3.0) return 'Good Standing';
        if (gpa >= 2.0) return 'Academic Probation';
        return 'Academic Suspension';
    }

    /**
     * Get courses by semester
     */
    getCoursesBySemester(semester) {
        return this.courses.filter(course => course.semester === semester);
    }

    /**
     * Get all semesters
     */
    getSemesters() {
        const semesters = [...new Set(this.courses.map(course => course.semester))];
        return semesters.sort();
    }

    /**
     * Get course by ID
     */
    getCourseById(id) {
        return this.courses.find(course => course.id === id);
    }

    /**
     * Update course
     */
    updateCourse(id, updates) {
        const index = this.courses.findIndex(course => course.id === id);
        if (index === -1) {
            return { success: false, error: 'Course not found' };
        }

        this.courses[index] = { ...this.courses[index], ...updates };
        this.addToHistory('update_course', { id, updates }, this.courses[index]);
        
        return {
            success: true,
            course: this.courses[index],
            message: 'Course updated successfully'
        };
    }

    /**
     * Delete course
     */
    deleteCourse(id) {
        const index = this.courses.findIndex(course => course.id === id);
        if (index === -1) {
            return { success: false, error: 'Course not found' };
        }

        const deletedCourse = this.courses.splice(index, 1)[0];
        this.addToHistory('delete_course', { id }, deletedCourse);
        
        return {
            success: true,
            course: deletedCourse,
            message: 'Course deleted successfully'
        };
    }

    /**
     * Get grade statistics
     */
    getGradeStatistics(semester = null) {
        const courses = semester ? 
            this.courses.filter(course => course.semester === semester) : 
            this.courses;

        if (courses.length === 0) {
            return {
                success: false,
                error: 'No courses found for statistics'
            };
        }

        const grades = courses.map(course => this.getGradeValue(course.grade, '4.0'));
        const validGrades = grades.filter(grade => grade > 0);

        const statistics = {
            totalCourses: courses.length,
            validCourses: validGrades.length,
            averageGPA: validGrades.length > 0 ? 
                validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length : 0,
            highestGPA: validGrades.length > 0 ? Math.max(...validGrades) : 0,
            lowestGPA: validGrades.length > 0 ? Math.min(...validGrades) : 0,
            gradeDistribution: this.getGradeDistribution(validGrades),
            semester: semester
        };

        return {
            success: true,
            statistics: statistics,
            message: `Grade statistics calculated for ${courses.length} courses`
        };
    }

    /**
     * Get grade distribution
     */
    getGradeDistribution(grades) {
        const distribution = {
            'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0
        };

        grades.forEach(grade => {
            if (grade >= 3.7) distribution['A']++;
            else if (grade >= 2.7) distribution['B']++;
            else if (grade >= 1.7) distribution['C']++;
            else if (grade >= 0.7) distribution['D']++;
            else distribution['F']++;
        });

        return distribution;
    }

    /**
     * Export data
     */
    exportData(format = 'json') {
        const data = {
            courses: this.courses,
            semesters: this.getSemesters(),
            history: this.history,
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
        const headers = ['Course Name', 'Code', 'Credits', 'Grade', 'Points', 'Semester'];
        const rows = data.courses.map(course => [
            course.name,
            course.code,
            course.credits,
            course.grade,
            course.points,
            course.semester
        ]);

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
        this.courses = [];
        this.semesters = [];
        this.currentSemester = null;
    }
}
