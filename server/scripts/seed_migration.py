import os
import asyncio
import json
from supabase import create_client, Client

# Hardcoded data from components

# Full activities data for the activities page
activities_page_data = {
    "activities": [
        {
            "title": "Arts & Culture",
            "description": "Nurture creativity and artistic expression through our comprehensive arts program. Students explore various art forms including classical and western music, traditional and contemporary dance, painting, and theatrical performances.",
            "image": "/activity-arts.jpg",
            "features": ["Music & Dance", "Art & Craft", "Drama & Theatre", "Bharatanatyam", "Hip-hop", "Folk Dance"]
        },
        {
            "title": "Sports & Fitness",
            "description": "Build physical strength, teamwork, and sportsmanship through our diverse sports program. From outdoor athletics to indoor games, we ensure every student finds their sporting passion.",
            "image": "/activity-sports.jpg",
            "features": ["Cricket", "Football", "Basketball", "Badminton", "Table Tennis", "Yoga & Meditation"]
        },
        {
            "title": "Academic Clubs",
            "description": "Extend learning beyond textbooks with hands-on exploration in science, mathematics, and technology. Our clubs foster innovation, critical thinking, and a love for discovery.",
            "image": "/activity-clubs.jpg",
            "features": ["Science Club", "Math Club", "Coding Club", "Robotics", "Quiz Team", "Tech Projects"]
        },
        {
            "title": "Life Skills",
            "description": "Develop essential skills for success in life through public speaking, leadership training, and community engagement. We prepare students to be confident, responsible citizens.",
            "image": "/activity-lifeskills.jpg",
            "features": ["Public Speaking", "Debates", "Model UN", "Student Council", "Community Service", "Eco Club"]
        }
    ],
    "events": [
        { "name": "Annual Day", "month": "December", "desc": "Grand celebration with performances and awards", "icon": "🎭" },
        { "name": "Sports Day", "month": "January", "desc": "Athletic events and inter-house competitions", "icon": "🏆" },
        { "name": "Science Fair", "month": "February", "desc": "Student projects and innovation showcase", "icon": "🔬" },
        { "name": "Cultural Fest", "month": "March", "desc": "Art, music, and dance performances", "icon": "🎨" }
    ]
}

# Legacy activities data (for backwards compatibility)
activities_data = [
    {
        "id": 1,
        "title": "Music & Dance",
        "description": "Classical and western music training, dance classes including Bharatanatyam, Hip-hop, and folk dances.",
        "icon": "🎵",
        "color": "#FFE4EC",
    },
    {
        "id": 2,
        "title": "Art & Craft",
        "description": "Painting, sketching, clay modeling, origami, and various creative craft activities.",
        "icon": "🎨",
        "color": "#E4F4FF",
    },
    {
        "id": 3,
        "title": "Sports & Games",
        "description": "Cricket, football, basketball, badminton, table tennis, chess, and carrom.",
        "icon": "🏆",
        "color": "#E4FFE4",
    },
    {
        "id": 4,
        "title": "Drama & Theatre",
        "description": "Stage performances, acting workshops, script writing, and annual plays.",
        "icon": "🎭",
        "color": "#FFF4E4",
    },
    {
        "id": 5,
        "title": "Debate & Public Speaking",
        "description": "Debates, elocution, Model UN, and personality development programs.",
        "icon": "🎤",
        "color": "#F4E4FF",
    },
    {
        "id": 6,
        "title": "Science Club",
        "description": "Science experiments, robotics, coding workshops, and science exhibitions.",
        "icon": "🔬",
        "color": "#E4FFF4",
    },
    {
        "id": 7,
        "title": "Yoga & Meditation",
        "description": "Daily yoga sessions, meditation practices, and wellness activities for mental health.",
        "icon": "🧘",
        "color": "#FFE4FF",
    },
    {
        "id": 8,
        "title": "Environmental Club",
        "description": "Tree plantation drives, recycling projects, and environmental awareness campaigns.",
        "icon": "🌱",
        "color": "#E4FFEC",
    },
]

courses_data = [
    {
        "id": 1,
        "title": "Biochemistry",
        "description": "When an unknown printer took a galley...",
        "image": "/course-biochemistry.jpg",
        "color": "#E8D4B8",
    },
    {
        "id": 2,
        "title": "History",
        "description": "All the Lorem Ipsum generators on the...",
        "image": "/course-history.jpg",
        "color": "#D4C4B0",
    },
    {
        "id": 3,
        "title": "Human Sciences",
        "description": "When an unknown printer took a galley...",
        "image": "/course-human-sciences.jpg",
        "color": "#C4B8A8",
    },
    {
        "id": 4,
        "title": "Earth Sciences",
        "description": "When an unknown printer took a galley...",
        "image": "/course-earth-sciences.jpg",
        "color": "#B8ACA0",
    },
]

footer_data = {
    "links": {
        "quickLinks": [
            { "name": "About Us", "href": "/about" },
            { "name": "Academics", "href": "/academics" },
            { "name": "Facilities", "href": "/facilities" },
            { "name": "Activities", "href": "/activities" },
            { "name": "Admissions", "href": "/admissions" },
        ],
        "academics": [
            { "name": "Primary (1-5)", "href": "/academics" },
            { "name": "Middle School (6-8)", "href": "/academics" },
            { "name": "High School (9-10)", "href": "/academics" },
            { "name": "Curriculum", "href": "/academics" },
            { "name": "Academic Calendar", "href": "/calendar" },
        ],
        "resources": [
            { "name": "Contact Us", "href": "/contact" },
            { "name": "Fee Structure", "href": "/admissions" },
            { "name": "Transport", "href": "/transport" },
            { "name": "Gallery", "href": "/gallery" },
        ],
    },
    "contact": {
        "phone": "+91 98765 43210",
        "email": "info@balayeasuschool.edu",
        "address": "123 Education Lane, City"
    },
    "socialLinks": [
        { "name": "Facebook", "href": "#" },
        { "name": "Twitter", "href": "#" },
        { "name": "Instagram", "href": "#" },
        { "name": "YouTube", "href": "#" }
    ]
}


# Admissions Data
admission_steps_data = [
    { "step": 1, "title": "Enquiry", "desc": "Visit school or fill online enquiry form" },
    { "step": 2, "title": "Application", "desc": "Submit application with required documents" },
    { "step": 3, "title": "Assessment", "desc": "Student assessment and interaction" },
    { "step": 4, "title": "Confirmation", "desc": "Admission confirmation and fee payment" },
]

documents_data = [
    "Birth Certificate",
    "Previous School Report Card",
    "Transfer Certificate (if applicable)",
    "4 Passport Size Photos",
    "Aadhar Card (Student & Parents)",
    "Address Proof",
]

fee_structure_data = [
    { "class": "Class 1-5", "admission": "₹15,000", "tuition": "₹3,500/month" },
    { "class": "Class 6-8", "admission": "₹18,000", "tuition": "₹4,000/month" },
    { "class": "Class 9-10", "admission": "₹20,000", "tuition": "₹4,500/month" },
]

# Application Form Data
application_form_data = {
    "pageTitle": "Apply Now",
    "pageSubtitle": "Complete the form below to start your admission journey.",
    "formFields": [
        { "id": 1, "name": "studentName", "label": "Student's Full Name", "type": "text", "placeholder": "Enter student's name", "required": True },
        { "id": 2, "name": "parentName", "label": "Parent/Guardian Name", "type": "text", "placeholder": "Enter parent's name", "required": True },
        { "id": 3, "name": "email", "label": "Email Address", "type": "email", "placeholder": "Enter email address", "required": True },
        { "id": 4, "name": "phone", "label": "Phone Number", "type": "phone", "placeholder": "Enter phone number", "required": True, "defaultDialCode": "+91" },
        { "id": 5, "name": "classApplying", "label": "Class Applying For", "type": "select", "placeholder": "Select Class", "required": True },
    ],
    "documents": [
        { "id": 1, "name": "Birth Certificate", "required": True },
        { "id": 2, "name": "Previous School Report Card", "required": True },
        { "id": 3, "name": "Transfer Certificate (if applicable)", "required": False },
        { "id": 4, "name": "4 Passport Size Photos", "required": True },
        { "id": 5, "name": "Aadhar Card (Student & Parents)", "required": True },
        { "id": 6, "name": "Address Proof", "required": True },
    ],
    "classOptions": [
        { "value": "1", "label": "Class 1" },
        { "value": "2", "label": "Class 2" },
        { "value": "3", "label": "Class 3" },
        { "value": "4", "label": "Class 4" },
        { "value": "5", "label": "Class 5" },
        { "value": "6", "label": "Class 6" },
        { "value": "7", "label": "Class 7" },
        { "value": "8", "label": "Class 8" },
        { "value": "9", "label": "Class 9" },
        { "value": "10", "label": "Class 10" },
    ],
    "submitButtonText": "Submit Application",
    "importantNote": "All documents should be submitted in original along with one photocopy during the admission process.",
    "successMessage": "Thank you for your application. Our admissions team will contact you within 2-3 business days."
}

# Facilities Data
facilities_list_data = [
    {
        "title": "Spacious Playground",
        "description": "Our 2-acre playground provides ample space for outdoor games, physical education, and recreational activities. Features include running track, basketball court, football field, and modern play equipment.",
        "image": "/facility-playground.jpg",
        "features": ["2 Acre Area", "Running Track", "Basketball Court", "Football Field", "Play Equipment", "Safety Certified"],
    },
    {
        "title": "Sports Complex",
        "description": "Indoor sports facilities for all-weather activities including badminton courts, table tennis, yoga room, and a fully equipped gymnasium.",
        "image": "/facility-sports.jpg",
        "features": ["Badminton Courts", "Table Tennis", "Gymnasium", "Yoga Hall", "Indoor Games", "Swimming Pool"],
    },
    {
        "title": "Modern Classrooms",
        "description": "Air-conditioned smart classrooms equipped with digital boards, projectors, and comfortable seating to create the optimal learning environment.",
        "image": "/facility-classroom.jpg",
        "features": ["Smart Boards", "AC Rooms", "Projectors", "Comfortable Seating", "Natural Lighting", "Spacious"],
    },
    {
        "title": "Computer Lab",
        "description": "State-of-the-art computer laboratory with latest systems, high-speed internet, and coding programs to prepare students for the digital age.",
        "image": "/facility-computer.jpg",
        "features": ["Latest Computers", "High-Speed Internet", "Coding Classes", "Digital Learning", "Supervised Sessions"],
    },
]

additional_facilities_data = [
    { "name": "Library", "icon": "📚" },
    { "name": "Science Labs", "icon": "🔬" },
    { "name": "Music Room", "icon": "🎵" },
    { "name": "Art Studio", "icon": "🎨" },
    { "name": "Auditorium", "icon": "🎭" },
    { "name": "Cafeteria", "icon": "🍽️" },
    { "name": "Medical Room", "icon": "🏥" },
    { "name": "Transport", "icon": "🚌" },
]

# Academics Data (Full)
grades_data = [
      {
        "title": "Primary School",
        "classes": "Class 1 - 5",
        "age": "6-10 years",
        "description": "Building strong foundations with interactive learning, basic literacy, numeracy, and creative exploration. Our primary program focuses on developing curiosity, communication skills, and a love for learning through play-based and activity-oriented methods.",
        "image": "/academic-primary.jpg",
        "features": ["English", "Hindi", "Mathematics", "EVS", "Art & Craft", "Computer Basics"]
      },
      {
        "title": "Middle School",
        "classes": "Class 6 - 8",
        "age": "11-13 years",
        "description": "Developing critical thinking, scientific inquiry, and preparing students for advanced learning. Students explore deeper concepts in science and mathematics while building strong analytical and research skills.",
        "image": "/academic-middle.jpg",
        "features": ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Computer Science"]
      },
      {
        "title": "High School",
        "classes": "Class 9 - 10",
        "age": "14-16 years",
        "description": "Comprehensive board exam preparation with focus on academics, career guidance, and competitive exams. Our high school program prepares students for success in board examinations and future academic pursuits.",
        "image": "/academic-high.jpg",
        "features": ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer Applications"]
      }
]

calendar_data = [
      { "term": "First Term", "dates": "April - September", "exams": "September" },
      { "term": "Second Term", "dates": "October - March", "exams": "March" }
]

methodologies_data = [
      { "name": "Interactive Learning", "icon": "📱" },
      { "name": "Project-Based", "icon": "🔬" },
      { "name": "Individual Attention", "icon": "👤" },
      { "name": "Regular Assessment", "icon": "📊" },
      { "name": "Smart Classrooms", "icon": "💻" },
      { "name": "Experiential Learning", "icon": "🎯" },
      { "name": "Collaborative Work", "icon": "🤝" },
      { "name": "Critical Thinking", "icon": "🧠" }
]

# Gallery Data
gallery_data = [
    { "src": "/hero-bg-1.jpg", "alt": "School Campus", "category": "Campus" },
    { "src": "/facility-playground.jpg", "alt": "Playground", "category": "Facilities" },
    { "src": "/facility-sports.jpg", "alt": "Sports Complex", "category": "Sports" },
    { "src": "/facility-classroom.jpg", "alt": "Classroom", "category": "Academics" },
    { "src": "/facility-computer.jpg", "alt": "Computer Lab", "category": "Facilities" },
    { "src": "/hero-bg-2.jpg", "alt": "Students Learning", "category": "Academics" },
    { "src": "/hero-bg-3.jpg", "alt": "Outdoor Activities", "category": "Activities" },
]

# Contact Data (Expanded)
contact_page_data = {
    "address": {
        "text": "123 Education Lane\nCity, State - 123456",
        "googleMapUrl": "#"
    },
    "phones": ["+91 98765 43210", "+91 12345 67890"],
    "emails": ["info@balayeasuschool.edu", "admissions@balayeasuschool.edu"],
    "officeHours": {
        "weekdays": "Monday - Friday: 8:00 AM - 4:00 PM",
        "weekend": "Saturday: 9:00 AM - 1:00 PM"
    }
}

async def migrate():
    # Load env vars manually or assume they are set
    from dotenv import load_dotenv
    load_dotenv()
    
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    
    if not url or not key:
        print("Error: Missing SUPABASE_URL or SUPABASE_KEY")
        return

    supabase: Client = create_client(url, key)
    table = "site_pages_content"

    items_to_seed = [
        # Activities page - full data with activities and events
        {"page_slug": "activities", "section_key": "activities", "content": activities_page_data},
        {"page_slug": "activities", "section_key": "list", "content": {"list": activities_data}},  # Legacy support
        {"page_slug": "academics", "section_key": "courses", "content": {"list": courses_data}},
        {"page_slug": "shared", "section_key": "footer", "content": footer_data},
        
        # New Items
        {"page_slug": "admissions", "section_key": "process", "content": {"steps": admission_steps_data}},
        {"page_slug": "admissions", "section_key": "requirements", "content": {"documents": documents_data}},
        {"page_slug": "admissions", "section_key": "fees", "content": {"structure": fee_structure_data}},
        {"page_slug": "admissions", "section_key": "application_form", "content": application_form_data},
        
        {"page_slug": "facilities", "section_key": "main_list", "content": {"list": facilities_list_data}},
        {"page_slug": "facilities", "section_key": "additional", "content": {"list": additional_facilities_data}},
        
        {"page_slug": "gallery", "section_key": "images", "content": {"list": gallery_data}},
        
        {"page_slug": "contact", "section_key": "info", "content": contact_page_data},
        
        # Academics Continued
        {"page_slug": "academics", "section_key": "grades", "content": {"list": grades_data}},
        {"page_slug": "academics", "section_key": "calendar", "content": {"list": calendar_data}},
        {"page_slug": "academics", "section_key": "methodologies", "content": {"list": methodologies_data}},
    ]

    print(f"Connecting to {url}...")
    
    for item in items_to_seed:
        print(f"Seeding {item['page_slug']} / {item['section_key']}...")
        try:
            supabase.table(table).upsert(item, on_conflict="page_slug, section_key").execute()
            print("  Success")
        except Exception as e:
            print(f"  Error: {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
