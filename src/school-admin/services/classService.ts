/**
 * Class Service - API communication for class management
 * 
 * Classes are connected to students via class_id FK.
 * Student counts are computed dynamically from the relationship.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Class {
    id: string;
    class: string;      // e.g., "10", "9", "LKG"
    section: string;    // e.g., "A", "B"
    class_teacher_id?: string;
    class_teacher_name?: string;  // Computed from teachers table
    capacity: number;
    room?: string;
    academic_year?: string;
    is_active?: boolean;
    students_count?: number;  // Computed from students table
    created_at?: string;
    updated_at?: string;
}

export interface ClassListResponse {
    classes: Class[];
    total: number;
    page: number;
    page_size: number;
}

export interface ClassFilters {
    search?: string;
    page?: number;
    page_size?: number;
    active_only?: boolean;
}

/**
 * Get all classes with student counts
 */
export async function getClasses(filters: ClassFilters = {}): Promise<ClassListResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.page_size) params.append('page_size', filters.page_size.toString());
    if (filters.active_only !== undefined) params.append('active_only', filters.active_only.toString());

    const url = `${API_BASE}/api/classes${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url, { credentials: 'include' });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to fetch classes' }));
        throw new Error(error.detail || 'Failed to fetch classes');
    }

    return response.json();
}

/**
 * Get a single class by ID
 */
export async function getClass(id: string): Promise<Class> {
    const response = await fetch(`${API_BASE}/api/classes/${id}`, { credentials: 'include' });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Class not found' }));
        throw new Error(error.detail || 'Class not found');
    }

    return response.json();
}

/**
 * Get students in a class
 */
export async function getClassStudents(classId: string, page = 1, pageSize = 50) {
    const response = await fetch(`${API_BASE}/api/classes/${classId}/students?page=${page}&page_size=${pageSize}`, { credentials: 'include' });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to fetch students' }));
        throw new Error(error.detail || 'Failed to fetch students');
    }

    return response.json();
}

/**
 * Create a new class
 */
export async function createClass(classData: Partial<Class>): Promise<Class> {
    const response = await fetch(`${API_BASE}/api/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(classData),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to create class' }));
        throw new Error(error.detail || 'Failed to create class');
    }

    return response.json();
}

/**
 * Update a class
 */
export async function updateClass(id: string, classData: Partial<Class>): Promise<Class> {
    const response = await fetch(`${API_BASE}/api/classes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(classData),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to update class' }));
        throw new Error(error.detail || 'Failed to update class');
    }

    return response.json();
}

/**
 * Delete a class (soft delete by default)
 */
export async function deleteClass(id: string, hardDelete = false): Promise<void> {
    const url = `${API_BASE}/api/classes/${id}${hardDelete ? '?hard_delete=true' : ''}`;

    const response = await fetch(url, { method: 'DELETE', credentials: 'include' });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to delete class' }));
        throw new Error(error.detail || 'Failed to delete class');
    }
}
