export interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    mediaType?: 'image' | 'video';
}

export interface HeroData {
    slides: HeroSlide[];
}

export interface AcademicGrade {
    title: string;
    classes: string;
    age: string;
    description: string;
    image: string;
    features: string[];
}

export interface AcademicTerm {
    term: string;
    dates: string;
    exams: string;
}

export interface WelcomeStat {
    number: string;
    label: string;
}

export interface WelcomeData {
    title: string;
    intro1: string;
    intro2: string;
    stats: WelcomeStat[];
}

export interface Facility {
    id: number;
    title: string;
    description: string;
    image: string;
    features: string[];
}

export interface FacilitiesData {
    list: Facility[];
}

export interface Methodology {
    name: string;
    icon: string;
}

export interface AcademicsData {
    grades: AcademicGrade[];
    calendar: AcademicTerm[];
    methodologies: Methodology[];
}

export interface Milestone {
    year: string;
    event: string;
}

export interface Leader {
    name: string;
    role: string;
    exp: string;
}

export interface FoundationItem {
    title: string;
    icon: string;
    content: string;
}

export interface AboutData {
    storyTitle: string;
    storyIntro1: string;
    storyIntro2: string;
    storyIntro3: string;
    milestones: Milestone[];
    foundation: FoundationItem[];
    leadership: Leader[];
}

export interface SiteContent {
    hero: HeroData;
    welcome: WelcomeData;
    facilities: FacilitiesData;
    academics: AcademicsData;
    about: AboutData;
    examResults: unknown[];
    timetables: unknown[];
    // Add flexible key for other potential sections
    [key: string]: unknown;
}
