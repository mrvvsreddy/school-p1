/**
 * Teacher Service - API communication for teacher management
 * 
 * Schema Design:
 * - Fixed columns: School-essential data (id, name, employee_id, subject, etc.)
 * - personal_info: Flexible JSONB for personal data (contact, bank details, etc.)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Personal info is flexible - admins can add any fields they need
export interface PersonalInfo {
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    dob?: string;
    gender?: string;
    bank_account?: string;
    salary?: string;
    emergency_contact?: string;
    // Allow any additional custom fields
    [key: string]: string | undefined;
}

export interface Teacher {
    id: string;
    // School-essential columns (fixed)
    name: string;
    employee_id: string;
    subject: string;
    department?: string;  // Optional - subject already identifies teaching area
    designation?: string;
    join_date?: string;
    photo_url?: string;
    status?: string;
    // Flexible personal info
    personal_info?: PersonalInfo;
    // System fields
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface TeacherListResponse {
    teachers: Teacher[];
    total: number;
    page: number;
    page_size: number;
}

export interface TeacherFilters {
    department?: string;
    search?: string;
    page?: number;
    page_size?: number;
}

/**
 * Get list of teachers with optional filtering
 */
export async function getTeachers(filters: TeacherFilters = {}): Promise<TeacherListResponse> {
    const params = new URLSearchParams();

    if (filters.department) params.append('department', filters.department);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.page_size) params.append('page_size', filters.page_size.toString());

    const url = `${API_BASE}/api/teachers${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to fetch teachers' }));
        throw new Error(error.detail || 'Failed to fetch teachers');
    }

    return response.json();
}

/**
 * Get a single teacher by ID
 */
export async function getTeacher(id: string): Promise<Teacher> {
    const response = await fetch(`${API_BASE}/api/teachers/${id}`);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Teacher not found' }));
        throw new Error(error.detail || 'Teacher not found');
    }

    return response.json();
}

/**
 * Create a new teacher
 */
export async function createTeacher(teacher: Partial<Teacher>): Promise<Teacher> {
    const response = await fetch(`${API_BASE}/api/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to create teacher' }));
        throw new Error(error.detail || 'Failed to create teacher');
    }

    return response.json();
}

/**
 * Update an existing teacher
 */
export async function updateTeacher(id: string, teacher: Partial<Teacher>): Promise<Teacher> {
    const response = await fetch(`${API_BASE}/api/teachers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to update teacher' }));
        throw new Error(error.detail || 'Failed to update teacher');
    }

    return response.json();
}

/**
 * Delete a teacher (soft delete by default)
 */
export async function deleteTeacher(id: string, hardDelete: boolean = false): Promise<void> {
    const url = `${API_BASE}/api/teachers/${id}${hardDelete ? '?hard_delete=true' : ''}`;

    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to delete teacher' }));
        throw new Error(error.detail || 'Failed to delete teacher');
    }
}

/**
 * Upload teacher photo
 */
export async function uploadTeacherPhoto(id: string, file: File): Promise<{ photo_url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/api/teachers/${id}/photo`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to upload photo' }));
        throw new Error(error.detail || 'Failed to upload photo');
    }

    return response.json();
}
