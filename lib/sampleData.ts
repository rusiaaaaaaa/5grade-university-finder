import majorsJson from "@/data/majors.json";
import universitiesJson from "@/data/universities.json";
import type {
  GradeInput,
  Major,
  SemesterAverage,
  SubjectCategory,
  SubjectGrade,
  University
} from "./types";

export const sampleMajors = majorsJson as Major[];

export const sampleUniversities = universitiesJson as University[];

export const semesterTemplates: SemesterAverage[] = [
  { id: "g1-s1", label: "1학년 1학기", grade: "" },
  { id: "g1-s2", label: "1학년 2학기", grade: "" },
  { id: "g2-s1", label: "2학년 1학기", grade: "" },
  { id: "g2-s2", label: "2학년 2학기", grade: "" },
  { id: "g3-s1", label: "3학년 1학기", grade: "" }
];

export const subjectCategoryLabels: Record<SubjectCategory, string> = {
  Korean: "국어",
  Math: "수학",
  English: "영어",
  Science: "과학",
  "Social Studies": "사회",
  "Computer Science": "정보",
  History: "한국사",
  "Second Foreign Language": "제2외국어",
  "Classical Chinese": "한문",
  "Technology & Home Economics": "기술·가정",
  Elective: "선택 과목",
  Other: "기타"
};

export const subjectCategories = Object.keys(subjectCategoryLabels) as SubjectCategory[];

export const regions = ["서울", "경기", "인천", "충청", "강원", "전라", "경상", "제주"];

export const admissionTypes = ["학생부교과", "학생부종합"];

export const defaultSubjectRows: SubjectGrade[] = [
  {
    id: "sub-g1-s1-korean",
    semesterId: "g1-s1",
    semesterLabel: "1학년 1학기",
    subjectName: "국어",
    category: "Korean",
    grade: "",
    achievementLevel: "",
    credit: 4
  },
  {
    id: "sub-g1-s1-math",
    semesterId: "g1-s1",
    semesterLabel: "1학년 1학기",
    subjectName: "수학",
    category: "Math",
    grade: "",
    achievementLevel: "",
    credit: 4
  },
  {
    id: "sub-g1-s1-english",
    semesterId: "g1-s1",
    semesterLabel: "1학년 1학기",
    subjectName: "영어",
    category: "English",
    grade: "",
    achievementLevel: "",
    credit: 4
  },
  {
    id: "sub-g1-s1-social",
    semesterId: "g1-s1",
    semesterLabel: "1학년 1학기",
    subjectName: "사회",
    category: "Social Studies",
    grade: "",
    achievementLevel: "",
    credit: 3
  },
  {
    id: "sub-g1-s1-science",
    semesterId: "g1-s1",
    semesterLabel: "1학년 1학기",
    subjectName: "과학",
    category: "Science",
    grade: "",
    achievementLevel: "",
    credit: 3
  },
  {
    id: "sub-g1-s1-history",
    semesterId: "g1-s1",
    semesterLabel: "1학년 1학기",
    subjectName: "한국사",
    category: "History",
    grade: "",
    achievementLevel: "",
    credit: 2
  },
  {
    id: "sub-g1-s1-info",
    semesterId: "g1-s1",
    semesterLabel: "1학년 1학기",
    subjectName: "정보",
    category: "Computer Science",
    grade: "",
    achievementLevel: "",
    credit: 2
  }
];

export const exampleGradeInput: GradeInput = {
  mode: "semester",
  semesterAverages: [
    { id: "g1-s1", label: "1학년 1학기", grade: 2.8 },
    { id: "g1-s2", label: "1학년 2학기", grade: 2.6 },
    { id: "g2-s1", label: "2학년 1학기", grade: 2.3 },
    { id: "g2-s2", label: "2학년 2학기", grade: 2.1 },
    { id: "g3-s1", label: "3학년 1학기", grade: 2.0 }
  ],
  subjects: [
    {
      id: "example-math",
      semesterId: "g3-s1",
      semesterLabel: "3학년 1학기",
      subjectName: "미적분",
      category: "Math",
      grade: 1.8,
      achievementLevel: "A",
      credit: 4
    },
    {
      id: "example-info",
      semesterId: "g3-s1",
      semesterLabel: "3학년 1학기",
      subjectName: "정보",
      category: "Computer Science",
      grade: 1.5,
      achievementLevel: "A",
      credit: 3
    },
    {
      id: "example-english",
      semesterId: "g3-s1",
      semesterLabel: "3학년 1학기",
      subjectName: "영어",
      category: "English",
      grade: 2.4,
      achievementLevel: "B",
      credit: 4
    },
    {
      id: "example-science",
      semesterId: "g3-s1",
      semesterLabel: "3학년 1학기",
      subjectName: "물리학",
      category: "Science",
      grade: 2.0,
      achievementLevel: "A",
      credit: 3
    }
  ]
};

export const defaultGradeInput: GradeInput = {
  mode: "semester",
  semesterAverages: semesterTemplates,
  subjects: []
};
