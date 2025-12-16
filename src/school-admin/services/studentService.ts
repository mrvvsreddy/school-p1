/**
 * Student Service - API communication for student management
 * 
 * Schema Design:
 * - Fixed columns: School-essential data (id, name, roll_no, class, admission, photo)
 * - personal_info: Flexible JSONB for personal data (teachers can add custom fields)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Personal info is flexible - teachers can add any fields they need
export interface PersonalInfo {
    // Standard fields (optional)
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    dob?: string;
    gender?: string;
    blood_group?: string;
    father_name?: string;
    mother_name?: string;
    guardian_name?: string;
    guardian_phone?: string;
    guardian_email?: string;
    previous_school?: string;
    // Allow any additional custom fields
    [key: string]: string | undefined;
}

export interface Student {
    id: string;
    // School-essential columns (fixed)
    name: string;
    roll_no: string;
    class: string;
    section?: string;
    admission_no?: string;
    admission_date?: string;
    photo_url?: string;
    // Flexible personal info
    personal_info?: PersonalInfo;
    // System fields
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface StudentListResponse {
    students: Student[];
    total: number;
    page: number;
    page_size: number;
}

export interface StudentFilters {
    page?: number;
    page_size?: number;
    class?: string;
    search?: string;
    active_only?: boolean;
}

/**
 * Get all students with optional filtering
 */
export async function getStudents(filters: StudentFilters = {}): Promise<StudentListResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.page_size) params.append('page_size', filters.page_size.toString());
    if (filters.class) params.append('class', filters.class);
    if (filters.search) params.append('search', filters.search);
    if (filters.active_only !== undefined) params.append('active_only', filters.active_only.toString());

    const queryString = params.toString();
    const url = `${API_BASE}/api/students${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || 'Failed to fetch students');
    }

    return response.json();
}

/**
 * Get a single student by ID
 */
export async function getStudent(id: string): Promise<Student> {
    const response = await fetch(`${API_BASE}/api/students/${id}`);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || 'Failed to fetch student');
    }

    return response.json();
}

/**
 * Create a new student
 */
export async function createStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    const response = await fetch(`${API_BASE}/api/students`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || 'Failed to create student');
    }

    return response.json();
}

/**
 * Update an existing student
 */
export async function updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    const response = await fetch(`${API_BASE}/api/students/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || 'Failed to update student');
    }

    return response.json();
}

/**
 * Delete a student (soft delete by default)
 */
export async function deleteStudent(id: string, hardDelete = false): Promise<void> {
    const params = hardDelete ? '?hard_delete=true' : '';
    const response = await fetch(`${API_BASE}/api/students/${id}${params}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || 'Failed to delete student');
    }
}

/**
 * Upload a photo for a student
 */
export async function uploadStudentPhoto(id: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/api/students/${id}/photo`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || 'Failed to upload photo');
    }

    const result = await response.json();
    return result.photo_url;
}
