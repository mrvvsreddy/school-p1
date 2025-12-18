// Mock data for the school admin dashboard

export const dashboardStats = {
    students: 1260,
    teachers: 224,
    totalAttendance: 94,
    classesToday: 48,
};

export const attendanceData = {
    year: 2023,
    months: [
        { month: "Jan", male: 520, female: 410 },
        { month: "Feb", male: 535, female: 425 },
        { month: "Mar", male: 510, female: 400 },
        { month: "Apr", male: 545, female: 435 },
        { month: "May", male: 530, female: 420 },
        { month: "Jun", male: 550, female: 440 },
        { month: "Jul", male: 515, female: 405 },
        { month: "Aug", male: 560, female: 450 },
        { month: "Sep", male: 540, female: 430 },
        { month: "Oct", male: 525, female: 415 },
        { month: "Nov", male: 555, female: 445 },
        { month: "Dec", male: 570, female: 460 },
    ],
};

export const studentDistribution = {
    male: 55,
    female: 45,
};

export const notices = [
    {
        id: 1,
        title: "Inter-school competition",
        description: "(sports/singing/drawing/drama)",
        date: "10 Feb, 2023",
        image: "/notice-competition.jpg",
        views: 7000,
        isPinned: true,
    },
    {
        id: 2,
        title: "Disciplinary action if school",
        description: "discipline is not followed",
        date: "6 Feb, 2023",
        image: "/notice-discipline.jpg",
        views: 7000,
        isPinned: false,
    },
    {
        id: 3,
        title: "School Annual function",
        description: "celebration 2023-24",
        date: "2 Feb, 2023",
        image: "/notice-annual.jpg",
        views: 7000,
        isPinned: false,
    },
    {
        id: 4,
        title: "Returning library books timely",
        description: "(Usually pinned on notice...)",
        date: "31 Jan, 2023",
        image: "/notice-library.jpg",
        views: 7000,
        isPinned: false,
    },
];

export const calendarEvents = [
    { date: "2023-02-10", title: "Parent-Teacher Meeting" },
    { date: "2023-02-14", title: "Valentine's Day Celebration" },
    { date: "2023-02-16", title: "Science Exhibition" },
    { date: "2023-02-20", title: "Sports Day" },
    { date: "2023-02-25", title: "Annual Function Rehearsal" },
];

export const recentStudents = [
    {
        id: 1,
        name: "Rahul Sharma",
        class: "10-A",
        rollNo: "001",
        status: "Present",
        dob: "2008-05-12",
        address: "123, Gandhi Nagar, Delhi",
        contact: "+91 98765 43210",
        parents: {
            father: "Rajesh Sharma",
            mother: "Meena Sharma",
            phone: "+91 98765 43210"
        }
    },
    {
        id: 2,
        name: "Priya Patel",
        class: "10-B",
        rollNo: "002",
        status: "Present",
        dob: "2008-08-23",
        address: "456, Patel Nagar, Mumbai",
        contact: "+91 87654 32109",
        parents: {
            father: "Suresh Patel",
            mother: "Geeta Patel",
            phone: "+91 87654 32109"
        }
    },
    {
        id: 3,
        name: "Amit Kumar",
        class: "9-A",
        rollNo: "003",
        status: "Absent",
        dob: "2009-02-15",
        address: "789, Kumar Colony, Bangalore",
        contact: "+91 76543 21098",
        parents: {
            father: "Mahesh Kumar",
            mother: "Sunita Kumar",
            phone: "+91 76543 21098"
        }
    },
    {
        id: 4,
        name: "Sneha Gupta",
        class: "9-B",
        rollNo: "004",
        status: "Present",
        dob: "2009-11-30",
        address: "321, Gupta Enclave, Chennai",
        contact: "+91 65432 10987",
        parents: {
            father: "Deepak Gupta",
            mother: "Anju Gupta",
            phone: "+91 65432 10987"
        }
    },
    {
        id: 5,
        name: "Vikram Singh",
        class: "8-A",
        rollNo: "005",
        status: "Leave",
        dob: "2010-06-18",
        address: "654, Singh Heights, Jaipur",
        contact: "+91 54321 09876",
        parents: {
            father: "Ranjit Singh",
            mother: "Kiran Singh",
            phone: "+91 54321 09876"
        }
    },
    {
        id: 6,
        name: "Anjali Verma",
        class: "10-A",
        rollNo: "006",
        status: "Absent",
        dob: "2008-03-25",
        address: "987, Verma Villa, Lucknow",
        contact: "+91 43210 98765",
        parents: {
            father: "Sanjay Verma",
            mother: "Pooja Verma",
            phone: "+91 43210 98765"
        }
    },
    {
        id: 7,
        name: "Rohan Das",
        class: "8-B",
        rollNo: "007",
        status: "Leave",
        dob: "2010-09-10",
        address: "159, Das Residency, Kolkata",
        contact: "+91 32109 87654",
        parents: {
            father: "Alok Das",
            mother: "Rima Das",
            phone: "+91 32109 87654"
        }
    },
];

export const recentTeachers = [
    {
        id: 1,
        name: "Dr. Rajesh Kumar",
        subject: "Mathematics",
        department: "Science",
        status: "Active",
        dob: "1980-05-15",
        address: "45, Science Park, Delhi",
        contact: "+91 98765 43210",
        email: "rajesh.math@school.edu",
        joinDate: "2015-06-01",
        salary: "85,000",
        bankAccount: "XXXX-XXXX-1234",
        taxId: "PAN1234567A"
    },
    {
        id: 2,
        name: "Mrs. Anita Sharma",
        subject: "English",
        department: "Arts",
        status: "Active",
        dob: "1985-08-20",
        address: "12, Art Lane, Mumbai",
        contact: "+91 87654 32109",
        email: "anita.eng@school.edu",
        joinDate: "2018-04-10",
        salary: "72,000",
        bankAccount: "XXXX-XXXX-5678",
        taxId: "PAN7654321B"
    },
    {
        id: 3,
        name: "Mr. Suresh Patel",
        subject: "Physics",
        department: "Science",
        status: "On Leave",
        dob: "1990-02-10",
        address: "78, Physics Hub, Bangalore",
        contact: "+91 76543 21098",
        email: "suresh.phy@school.edu",
        joinDate: "2020-01-15",
        salary: "68,000",
        bankAccount: "XXXX-XXXX-9012",
        taxId: "PAN9876543C"
    },
    {
        id: 4,
        name: "Mrs. Kavita Singh",
        subject: "Hindi",
        department: "Arts",
        status: "Active",
        dob: "1988-11-25",
        address: "32, Language St, Chennai",
        contact: "+91 65432 10987",
        email: "kavita.hindi@school.edu",
        joinDate: "2016-07-20",
        salary: "70,000",
        bankAccount: "XXXX-XXXX-3456",
        taxId: "PAN4567890D"
    },
    {
        id: 5,
        name: "Mr. Deepak Verma",
        subject: "Chemistry",
        department: "Science",
        status: "Active",
        dob: "1992-06-15",
        address: "65, Chem Lab, Jaipur",
        contact: "+91 54321 09876",
        email: "deepak.chem@school.edu",
        joinDate: "2021-09-01",
        salary: "65,000",
        bankAccount: "XXXX-XXXX-7890",
        taxId: "PAN2345678E"
    },
];

export const classes = [
    {
        id: 1,
        name: "10-A",
        grade: "10th",
        section: "A",
        classTeacher: "Dr. Rajesh Kumar",
        studentsCount: 32,
        capacity: 40,
        room: "101",
        attendance: {
            today: 92,
            history: [90, 88, 92, 95, 91, 89, 92] // Last 7 days
        },
        subjects: [
            { name: "Mathematics", teacher: "Dr. Rajesh Kumar" },
            { name: "Physics", teacher: "Mr. Suresh Patel" },
            { name: "Chemistry", teacher: "Mr. Deepak Verma" },
        ],
        schedule: [
            { time: "09:00 - 10:00", subject: "Maths" },
            { time: "10:00 - 11:00", subject: "Physics" },
            { time: "11:00 - 11:30", subject: "Break" },
            { time: "11:30 - 12:30", subject: "Chemistry" },
        ]
    },
    {
        id: 2,
        name: "10-B",
        grade: "10th",
        section: "B",
        classTeacher: "Mrs. Anita Sharma",
        studentsCount: 30,
        capacity: 40,
        room: "102",
        attendance: {
            today: 85,
            history: [82, 85, 80, 88, 85, 84, 85]
        },
        subjects: [
            { name: "English", teacher: "Mrs. Anita Sharma" },
            { name: "History", teacher: "Mrs. Sunita Rao" },
            { name: "Biology", teacher: "Ms. Priya Singh" },
        ],
        schedule: [
            { time: "09:00 - 10:00", subject: "English" },
            { time: "10:00 - 11:00", subject: "History" },
            { time: "11:00 - 11:30", subject: "Break" },
            { time: "11:30 - 12:30", subject: "Biology" },
        ]
    },
    {
        id: 3,
        name: "9-A",
        grade: "9th",
        section: "A",
        classTeacher: "Mr. Suresh Patel",
        studentsCount: 28,
        capacity: 35,
        room: "201",
        attendance: {
            today: 96,
            history: [95, 94, 96, 98, 95, 96, 96]
        },
        subjects: [
            { name: "Physics", teacher: "Mr. Suresh Patel" },
            { name: "Maths", teacher: "Mr. Rahul Verma" },
        ],
        schedule: [
            { time: "09:00 - 10:00", subject: "Physics" },
            { time: "10:00 - 11:00", subject: "Maths" },
            { time: "11:00 - 11:30", subject: "Break" },
            { time: "11:30 - 12:30", subject: "Sports" },
        ]
    }
];

export const upcomingExams = [
    {
        id: 1,
        subject: "Mathematics",
        grade: "Grade 10-A",
        academicYear: "2024-2025",
        date: "Oct 24, 2024",
        startTime: "09:00 AM",
        endTime: "11:00 AM",
        duration: "2 hrs",
        location: "Main Hall B",
        status: "Upcoming",
        participants: 28,
        color: "#3B82F6" // blue
    },
    {
        id: 2,
        subject: "Physics Mid-Term",
        grade: "Grade 11-B",
        academicYear: "2024-2025",
        date: "Oct 20, 2024",
        startTime: "10:30 AM",
        endTime: "12:30 PM",
        duration: "2 hrs",
        location: "Lab 304",
        status: "Grading in Progress",
        participants: 32,
        color: "#14B8A6" // teal
    },
    {
        id: 3,
        subject: "English Lit.",
        grade: "Grade 9-C",
        academicYear: "2024-2025",
        date: "Nov 02, 2024",
        startTime: "08:30 AM",
        endTime: "10:00 AM",
        duration: "1.5 hrs",
        location: "Room 101",
        status: "Draft",
        participants: 0,
        color: "#8B5CF6" // purple
    },
    {
        id: 4,
        subject: "History Final",
        grade: "Grade 10-A",
        academicYear: "2023-2024",
        date: "Oct 15, 2024",
        startTime: "1:00 PM",
        endTime: "3:00 PM",
        duration: "2 hrs",
        location: "",
        status: "Completed",
        participants: 30,
        color: "#EF4444" // red
    },
    {
        id: 5,
        subject: "Biology Quiz",
        grade: "Grade 11-A",
        academicYear: "2024-2025",
        date: "Oct 26, 2024",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        duration: "1 hr",
        location: "Classroom 4B",
        status: "Upcoming",
        participants: 32,
        color: "#22C55E" // green
    },
];

export const transportRoutes = [
    { id: 1, routeNo: "R-001", driver: "Ramesh Kumar", vehicle: "Bus-01", students: 45, status: "Active" },
    { id: 2, routeNo: "R-002", driver: "Sunil Yadav", vehicle: "Bus-02", students: 38, status: "Active" },
    { id: 3, routeNo: "R-003", driver: "Mohan Lal", vehicle: "Bus-03", students: 42, status: "Maintenance" },
    { id: 4, routeNo: "R-004", driver: "Vijay Singh", vehicle: "Van-01", students: 15, status: "Active" },
];

export const adminUser = {
    name: "Steven Jhon",
    role: "Admin",
    avatar: "/admin-avatar.jpg",
    email: "steven@school.edu",
};
