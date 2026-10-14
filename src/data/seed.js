export const SCHOOLS = [
  { id: "kwena", name: "Kwena Primary School", type: "Primary", emis: "123456" },
  { id: "mpuma", name: "Mpumalanga Academy", type: "High", emis: "234567" },
  { id: "lydenburg", name: "Lydenburg High School", type: "High", emis: "345678" },
  { id: "thuto", name: "Thuto Chweu Primary", type: "Primary", emis: "456789" },
  { id: "mphahlele", name: "Mphahlele High School", type: "High", emis: "567890" },
  { id: "emalahleni", name: "Emalahleni Primary", type: "Primary", emis: "678901" },
];

export const GUARDIAN = {
  id: "g1",
  name: "Thandi Mokoena",
  phone: "+27 82 123 4567",
  email: "thandi.mokoena@example.com",
  password: "demo123",
};

export const SCHOOL_ADMINS = {
  mpuma: { name: "Mrs. Dlamini", email: "dlamini@mpuma.edu", password: "demo123" },
  lydenburg: { name: "Mr. Nkosi", email: "nkosi@lydenburg.edu", password: "demo123" },
  kwena: { name: "Mr. Sithole", email: "sithole@kwena.edu", password: "demo123" },
  thuto: { name: "Mrs. Van Wyk", email: "vanwyk@thuto.edu", password: "demo123" },
  mphahlele: { name: "Mr. Zulu", email: "zulu@mphahlele.edu", password: "demo123" },
  emalahleni: { name: "Ms. Khumalo", email: "khumalo@emalahleni.edu", password: "demo123" },
};

export const DISTRICT_ADMIN = {
  name: "Dr. Nomvete",
  email: "nomvete@edugateway.edu",
  password: "demo123",
  title: "District Admin · Mpumalanga East",
};

export const INITIAL_LEARNERS = [
  { id: "l1", guardianId: "g1", name: "Lindiwe Mokoena", dob: "2021-03-14", grade: "Grade 1", schoolId: "kwena" },
  { id: "l2", guardianId: "g1", name: "Karabo Mokoena", dob: "2010-11-12", grade: "Grade 9", schoolId: "mpuma" },
  { id: "l3", guardianId: "g1", name: "Thabo Dlamini", dob: "2016-08-20", grade: "Grade 6", schoolId: null },
];

export const INITIAL_APPLICATIONS = [
  {
    id: "APP-1004",
    learnerId: "l1",
    type: "NEW",
    schoolId: "kwena",
    grade: "Grade 1",
    year: 2027,
    status: "Enrolled",
    submitted: "10 Jan 2027",
    documents: [
      { name: "Birth Certificate", status: "Verified" },
      { name: "Proof of Residence", status: "Verified" },
    ],
    history: [
      { time: "10 Jan 2027, 08:41", actor: "Thandi Mokoena (Guardian)", action: "Application submitted" },
      { time: "13 Jan 2027, 09:02", actor: "Mr. Sithole (School Admin)", action: "Decision: Accepted" },
      { time: "13 Jan 2027, 09:05", actor: "Mr. Sithole (School Admin)", action: "Learner enrolled" },
    ],
  },
  {
    id: "APP-1007",
    learnerId: "l2",
    type: "TRANSFER",
    schoolId: "mpuma",
    sendingSchoolId: "lydenburg",
    grade: "Grade 9",
    year: 2027,
    status: "Under Review",
    submitted: "12 Jan 2027",
    documents: [
      { name: "Birth Certificate", status: "Verified" },
      { name: "Proof of Residence", status: "Verified" },
      { name: "Immunisation Record", status: "Rejected", reason: "Scan illegible, please re-upload." },
    ],
    history: [
      { time: "12 Jan 2027, 08:41", actor: "Thandi Mokoena (Guardian)", action: "Transfer application submitted" },
      { time: "15 Jan 2027, 09:12", actor: "Mr. Nkosi (Lydenburg Admin)", action: "Sending school notified" },
    ],
  },
  {
    id: "APP-1013",
    learnerId: "l3",
    type: "NEW",
    schoolId: "thuto",
    grade: "Grade 6",
    year: 2027,
    status: "Rejected",
    submitted: "08 Jan 2027",
    rejectionReason: "Incomplete documents. Proof of residence was not provided or is not valid.",
    documents: [
      { name: "Birth Certificate", status: "Verified" },
      { name: "Proof of Residence", status: "Rejected" },
    ],
    history: [
      { time: "08 Jan 2027, 09:56", actor: "Thandi Mokoena (Guardian)", action: "Application submitted" },
      { time: "12 Jan 2027, 10:17", actor: "S. Mthembu (School Admin)", action: "Application rejected" },
    ],
  },
  {
    id: "APP-1001",
    learnerId: "l1",
    type: "NEW",
    schoolId: "kwena",
    grade: "Grade 1",
    year: 2027,
    status: "Submitted",
    submitted: "15 Oct 2026",
    documents: [],
    history: [
      { time: "15 Oct 2026, 10:00", actor: "Thandi Mokoena (Guardian)", action: "Application submitted" },
    ],
  },
  {
    id: "APP-1005",
    learnerId: "l3",
    type: "NEW",
    schoolId: "lydenburg",
    grade: "Grade 8",
    year: 2027,
    status: "Waitlisted",
    submitted: "18 Nov 2026",
    documents: [],
    history: [
      { time: "18 Nov 2026, 11:30", actor: "Thandi Mokoena (Guardian)", action: "Application submitted" },
      { time: "22 Nov 2026, 09:00", actor: "School Admin", action: "Decision: Waitlisted" },
    ],
  },
];

export const TRANSFER_RECORDS = {
  "APP-1007": {
    sendingSchoolId: "lydenburg",
    receivingSchoolId: "mpuma",
    releaseStatus: "Pending",
    records: [
      { name: "Transfer Letter", file: "PDF · 245 KB", status: "Completed" },
      { name: "Report Card (Last 3 Years)", file: "PDF · 1.2 MB", status: "Completed" },
      { name: "Attendance History", file: "PDF · 320 KB", status: "Pending" },
    ],
    timeline: [
      { step: "Submitted", date: "12 Jan 2027", state: "done" },
      { step: "Under Review", date: "15 Jan 2027", state: "done" },
      { step: "Approved", date: "16 Jan 2027", state: "done" },
      { step: "Record Release", date: "Pending", state: "current" },
      { step: "Enrolled", date: "", state: "upcoming" },
    ],
  },
};

export const INITIAL_INTAKES = [
  {
    id: "in1",
    schoolId: "kwena",
    grade: "Grade 1",
    year: 2027,
    openDate: "2027-01-01",
    closeDate: "2027-03-31",
    capacity: 60,
    requiredDocs: ["Birth Certificate", "Proof of Residence", "Immunisation Record"],
  },
  {
    id: "in2",
    schoolId: "mpuma",
    grade: "Grade 9",
    year: 2027,
    openDate: "2026-11-01",
    closeDate: "2027-01-31",
    capacity: 90,
    requiredDocs: ["Birth Certificate", "Proof of Residence", "Transfer Letter", "Report Card"],
  },
];

export const INITIAL_NOTIFICATIONS = {
  guardian: [
    { title: "Transfer record released", body: "Karabo Mokoena's academic records have been released by Lydenburg High School.", time: "Today, 09:22" },
    { title: "Application accepted", body: "Lindiwe Mokoena's application has been accepted.", time: "Yesterday, 16:40" },
    { title: "Enrolment confirmed", body: "Lindiwe Mokoena has been enrolled at Kwena Primary School.", time: "10 Jan 2027" },
  ],
  schoolAdmin: [
    { title: "New transfer request", body: "A transfer request for Karabo Mokoena is awaiting your review.", time: "Today, 08:15" },
    { title: "Document uploaded", body: "Proof of residence uploaded for APP-1013.", time: "Yesterday, 14:02" },
  ],
  districtAdmin: [
    { title: "New school onboarded", body: "Emalahleni Primary joined the network.", time: "2 days ago" },
    { title: "Audit flag", body: "Unusual export volume detected at Mpumalanga Academy.", time: "3 days ago" },
  ],
};

export const AUDIT_LOG = [
  { time: "12:42", user: "Dr. Nomvete", entity: "System", action: "Config Update" },
  { time: "11:23", user: "Mrs. Dlamini", entity: "APP-1007", action: "Transfer Approved" },
  { time: "10:17", user: "S. Mthembu", entity: "APP-1013", action: "Application Rejected" },
  { time: "09:56", user: "T. Nkosi", entity: "APP-1007", action: "Records Released" },
  { time: "09:32", user: "L. Khumalo", entity: "APP-1004", action: "Document Verified" },
  { time: "08:15", user: "A. Jacobs", entity: "APP-1004", action: "User Login" },
];

export const CHART_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const CHART_DATA = [18,22,26,30,24,20,16,19,25,29,21,17];
export const ALL_DOCS = [
  "Birth Certificate",
  "Proof of Residence",
  "Immunisation Record",
  "Parent/Guardian ID",
  "Transfer Letter",
  "Report Card",
];