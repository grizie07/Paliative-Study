import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import api from "../services/api";

const qlqEn = [
  "Do you have any trouble doing strenuous activities, like carrying a heavy shopping bag or a suitcase?",
  "Do you have any trouble taking a long walk?",
  "Do you have any trouble taking a short walk outside of the house?",
  "Do you need to stay in bed or a chair during the day?",
  "Do you need help with eating, dressing, washing yourself or using the toilet?",
  "Were you limited in doing either your work or other daily activities?",
  "Were you limited in pursuing your hobbies or other leisure time activities?",
  "Were you short of breath?",
  "Have you had pain?",
  "Did you need to rest?",
  "Have you had trouble sleeping?",
  "Have you felt weak?",
  "Have you lacked appetite?",
  "Have you felt nauseated?",
  "Have you vomited?",
  "Have you been constipated?",
  "Have you had diarrhea?",
  "Were you tired?",
  "Did pain interfere with your daily activities?",
  "Have you had difficulty in concentrating on things, like reading a newspaper or watching television?",
  "Did you feel tense?",
  "Did you worry?",
  "Did you feel irritable?",
  "Did you feel depressed?",
  "Have you had difficulty remembering things?",
  "Has your physical condition or medical treatment interfered with your family life?",
  "Has your physical condition or medical treatment interfered with your social activities?",
  "Has your physical condition or medical treatment caused you financial difficulties?",
  "How would you rate your overall health during the past week?",
  "How would you rate your overall quality of life during the past week?"
];

const qlqHi = [
  "क्या आपको कोई भारी काम करने की गतिविधियों में कोई कठिनाई होती है? जैसे कि भार उठाना या भारी खरीदारी का सामान उठाना?",
  "क्या आपको एक लम्बी दूरी तक चलने में कोई कठिनाई होती है?",
  "क्या आपको घर के बाहर थोड़ी दूरी चलने में कोई कठिनाई होती है?",
  "क्या आपको दिन में बिस्तर पर या कुर्सी पर रहने की आवश्यकता पड़ती है?",
  "क्या आपको खाने, कपड़े पहनने, स्नान करने या शौचालय जाने में मदद की जरूरत पड़ती है?",
  "क्या आपको अपने काम करने में या अन्य दैनिक कार्यों में पर्याप्त मुश्किल हुई?",
  "क्या आपको अपने शौक पूरे करने में या अन्य फुर्सत की गतिविधियों में पर्याप्त मुश्किल हुई?",
  "क्या आपको साँस लेने में तकलीफ़ हुई?",
  "क्या आपको दर्द हुआ?",
  "क्या आपको आराम करने की जरूरत पड़ी?",
  "क्या आपको सोने में कठिनाई हुई?",
  "क्या आपको कमजोरी महसूस हुई?",
  "क्या आपको भूख नहीं लगी?",
  "क्या आपको मितली महसूस हुई?",
  "क्या आपको उल्टी हुई?",
  "क्या आपको कब्ज रही?",
  "क्या आपको दस्त हुए?",
  "क्या आप थके हुए थे?",
  "क्या दर्द ने आपकी दैनिक गतिविधियों में बाधा डाली?",
  "क्या आपको किसी चीज़ पर ध्यान केंद्रित करने में कठिनाई हुई, जैसे अख़बार पढ़ना या टेलीविजन देखना?",
  "क्या आप तनाव महसूस करते थे?",
  "क्या आप चिंतित महसूस करते थे?",
  "क्या आपको चिड़चिड़ापन हुआ?",
  "क्या आप उदास रहे?",
  "क्या आपको चीज़ें याद रखने में कठिनाई हुई?",
  "क्या आपकी शारीरिक अवस्था या चल रहे इलाज के कारण आपके पारिवारिक जीवन में बाधा हुई?",
  "क्या आपकी शारीरिक अवस्था या चल रहे इलाज के कारण आपकी सामाजिक गतिविधियों में बाधा हुई?",
  "क्या आपकी शारीरिक अवस्था या चल रहे इलाज के कारण आपको आर्थिक कठिनाई हुई?",
  "पिछले सप्ताह के अपने पूरे स्वास्थ्य का मूल्यांकन आप कैसे करेंगे?",
  "पिछले सप्ताह के अपने पूरे जीवन स्तर का मूल्यांकन आप कैसे करेंगे?"
];

const qlqHiLatn = [
  "Kya aapko koi bhaari kaam karne ki gatividhiyon mein koi kathinaai hoti hai? Jaise ki bhaar uthana ya bhaari kharidari ka saaman uthana?",
  "Kya aapko ek lambi doori tak chalne mein koi kathinaai hoti hai?",
  "Kya aapko ghar ke baahar thodi doori chalne mein koi kathinaai hoti hai?",
  "Kya aapko din mein bistar par ya kursi par rehne ki aavashyakta padti hai?",
  "Kya aapko khaane, kapde pehenne, snaan karne ya shauchalay jaane mein madad ki zarurat padti hai?",
  "Kya aapko apne kaam karne mein ya anya dainik karyon mein paryapt mushkil hui?",
  "Kya aapko apne shauk poore karne mein ya anya fursat ki gatividhiyon mein paryapt mushkil hui?",
  "Kya aapko saans lene mein takleef hui?",
  "Kya aapko dard hua?",
  "Kya aapko aaraam karne ki zarurat padi?",
  "Kya aapko sone mein kathinaai hui?",
  "Kya aapko kamzori mehsoos hui?",
  "Kya aapko bhookh nahin lagi?",
  "Kya aapko mitli mehsoos hui?",
  "Kya aapko ulti hui?",
  "Kya aapko kabz rahi?",
  "Kya aapko dast hue?",
  "Kya aap thake hue the?",
  "Kya dard ne aapki dainik gatividhiyon mein baadha daali?",
  "Kya aapko kisi cheez par dhyaan kendrit karne mein kathinaai hui, jaise akhbaar padhna ya television dekhna?",
  "Kya aap tanaav mehsoos karte the?",
  "Kya aap chintit mehsoos karte the?",
  "Kya aapko chidchidapan hua?",
  "Kya aap udaas rahe?",
  "Kya aapko cheezen yaad rakhne mein kathinaai hui?",
  "Kya aapki sharirik avastha ya chal rahe ilaaj ke kaaran aapke paarivaarik jeevan mein baadha hui?",
  "Kya aapki sharirik avastha ya chal rahe ilaaj ke kaaran aapki samaajik gatividhiyon mein baadha hui?",
  "Kya aapki sharirik avastha ya chal rahe ilaaj ke kaaran aapko aarthik kathinaai hui?",
  "Pichhle saptah ke apne poore swasthya ka mulyankan aap kaise karenge?",
  "Pichhle saptah ke apne poore jeevan star ka mulyankan aap kaise karenge?"
];

const esasFields = [
  { key: "pain", en: "Pain", hiLatn: "Dard", hi: "दर्द" },
  { key: "tiredness", en: "Tiredness", hiLatn: "Thakaan", hi: "थकान" },
  { key: "drowsiness", en: "Drowsiness", hiLatn: "Nind ya jhapki", hi: "नींद या झपकी" },
  { key: "nausea", en: "Nausea", hiLatn: "Matli", hi: "मतली" },
  { key: "appetite", en: "Lack of Appetite", hiLatn: "Bhukh ki kami", hi: "भूख की कमी" },
  { key: "shortnessOfBreath", en: "Shortness of Breath", hiLatn: "Saans ki takleef", hi: "साँस की तकलीफ़" },
  { key: "depression", en: "Depression", hiLatn: "Avsaad", hi: "अवसाद" },
  { key: "anxiety", en: "Anxiety", hiLatn: "Chinta / Ghabrahat", hi: "चिंता / घबराहट" },
  { key: "wellbeing", en: "Wellbeing", hiLatn: "Kul milaakar sthiti", hi: "कुल मिलाकर स्थिति" },
  { key: "otherProblem", en: "Other Problem", hiLatn: "Koi aur samasya", hi: "कोई और समस्या" }
];

const qlq4 = {
  en: ["Not at all", "A little", "Quite a bit", "Very much"],
  hiLatn: ["Bilkul nahin", "Thoda", "Kaafi had tak", "Bahut zyada"],
  hi: ["बिल्कुल नहीं", "थोड़ा", "काफ़ी हद तक", "बहुत ज़्यादा"]
};

const qlq7 = {
  en: ["Very poor", "Poor", "Fair", "Good", "Very good", "Excellent", "Excellent"],
  hiLatn: ["Bahut kharab", "Kharab", "Theek-thaak", "Achha", "Bahut achha", "Utkrisht", "Utkrisht"],
  hi: ["बहुत खराब", "खराब", "ठीक-ठाक", "अच्छा", "बहुत अच्छा", "उत्कृष्ट", "उत्कृष्ट"]
};

const defaultEsas = {
  pain: 0,
  tiredness: 0,
  drowsiness: 0,
  nausea: 0,
  appetite: 0,
  shortnessOfBreath: 0,
  depression: 0,
  anxiety: 0,
  wellbeing: 0,
  otherProblem: 0,
  patientName: "",
  date: "",
  time: "",
  completedBy: {
    patient: false,
    familyCaregiver: false,
    healthcareProfessionalCaregiver: false
  },
  bodyDiagramNotes: ""
};

const emptyConferenceRow = {
  modality: "",
  partRegion: "",
  yesNo: "",
  date: "",
  findings: ""
};

const defaultState = {
  language: "en",

  demographic: {
    name: "",
    age: "",
    gender: "",
    address: "",
    religion: "",
    date: "",
    uhid: "",
    informedConsent: ""
  },

  history: {
    oncologicalDiagnosis: "",
    chiefComplaints: "",
    comorbidities: "",
    medicalHistory: "",
    surgicalHistory: "",
    generalExamination: "",
    ecogPs: "",
    systemicExamination: "",
    treatmentIntent: "",
    bestSupportiveCare: "",
    documentedBy: "",
    documentedOn: ""
  },

  investigations: {
    investigationDate: "",
    haemoglobin: "",
    totalLeukocyteCount: "",
    platelets: "",
    ureaCreatinine: "",
    sodiumPotassiumCalcium: "",
    totalBilirubinDirectBilirubin: "",
    sgotSgptAlp: "",
    totalProteinAlbumin: "",
    others: "",
    conservativeManagement: "",
    interventionsNonSurgical: "",
    interventionsSurgical: "",
    indication: "",
    operationNotes: "",
    admission: "",
    readmission: "",
    reasonForDiscussionOfImaging: ""
  },

  preConference: {
    goalsOfCare: ""
  },

  qlqC30: Object.fromEntries(
    Array.from({ length: 30 }, (_, i) => [`q${i + 1}`, 1])
  ),

  esas: { ...defaultEsas },

  radiologyConference: {
  numberOfImagingSubmitted: "",
  rows: [{ ...emptyConferenceRow }],
  summaryOfFindings: "",
  implicationsForPatientCare: "",
  doubtsQueriesPutForth: "",
  imagingVsClinicalFindings: "",
  detailedDiscussion: "",
  artefactsNewFindingsPreviouslyMissed: "",
  newQueriesDoubtsDiscussed: "",
  furtherSuggestedImagingInvestigations: "",
  furtherSuggestionsForManagement: ""
},

  postDircQlqC30: Object.fromEntries(
    Array.from({ length: 30 }, (_, i) => [`q${i + 1}`, 1])
  ),

  postDircEsas: { ...defaultEsas },

  postConferenceOutcomes: {
    changesInPrimaryTreatment: "",
    changesInIntentOfTreatment: "",
    assistanceInPrognosticationSurvivalAssessment: "",
    psychosocialOrSpiritualImplications: "",
    goalsOfCarePostDIRC: "",
    changesInManagementYesNo: "",
    changesInManagementDescribe: "",
    furtherImagingAdvisedYesNo: "",
    furtherImagingAdvisedWhat: "",
    goalsOfCareRevisedYesNo: "",
    advanceCarePlanningDiscussions: ""
  },

  summary: {
    eortcQlqC30OverallPre: "",
    eortcQlqC30OverallPost: "",
    totalEsasScorePre: "",
    totalEsasScorePost: "",
    activeSymptomsPre: "",
    activeSymptomsPost: "",
    treatmentPlanModifiedPre: "",
    treatmentPlanModifiedPost: "",
    goalsOfCareAlteredPre: "",
    goalsOfCareAlteredPost: ""
  }
};

function textByLanguage(en, hiLatn, hi, lang) {
  if (lang === "hi") return hi;
  if (lang === "hiLatn") return hiLatn;
  return en;
}

function WizardStep({ active, number, title }) {
  return <div className={`wizard-step ${active ? "active" : ""}`}>{number}. {title}</div>;
}

function SectionCard({ title, children }) {
  return (
    <div className="section-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default function AssessmentCreatePage() {
  const { id, assessmentId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState(defaultState);
  const [loadedPatientId, setLoadedPatientId] = useState("");

  useEffect(() => {
    const stepParam = Number(searchParams.get("step"));
    if (stepParam >= 1 && stepParam <= 7) {
      setStep(stepParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadAssessment = async () => {
      if (!assessmentId) return;

      setInitialLoading(true);
      setSubmitError("");

      try {
        const res = await api.get(`/assessments/${assessmentId}`);
        const a = res.data;

        const patientRef =
          typeof a.patientId === "object" ? a.patientId?._id : a.patientId;

        setLoadedPatientId(patientRef || "");

        setForm((prev) => ({
          ...prev,
          language: "en",
          demographic: { ...prev.demographic, ...(a.demographic || {}) },
          history: { ...prev.history, ...(a.history || {}) },
          investigations: { ...prev.investigations, ...(a.investigations || {}) },
          preConference: { ...prev.preConference, ...(a.preConference || {}) },
          qlqC30: { ...prev.qlqC30, ...(a.qlqC30 || {}) },
          esas: {
            ...prev.esas,
            ...(a.esas || {}),
            completedBy: {
              ...prev.esas.completedBy,
              ...(a.esas?.completedBy || {})
            }
          },
          radiologyConference: {
            ...prev.radiologyConference,
            ...(a.radiologyConference || {}),
            rows:
              Array.isArray(a.radiologyConference?.rows) && a.radiologyConference.rows.length > 0
                ? a.radiologyConference.rows
                : prev.radiologyConference.rows
          },
          postDircQlqC30: { ...prev.postDircQlqC30, ...(a.postDircQlqC30 || {}) },
          postDircEsas: {
            ...prev.postDircEsas,
            ...(a.postDircEsas || {}),
            completedBy: {
              ...prev.postDircEsas.completedBy,
              ...(a.postDircEsas?.completedBy || {})
            }
          },
          postConferenceOutcomes: {
            ...prev.postConferenceOutcomes,
            ...(a.postConferenceOutcomes || {})
          },
          summary: { ...prev.summary, ...(a.summary || {}) }
        }));
      } catch (err) {
        setSubmitError(
          err?.response?.data?.message || "Failed to load assessment."
        );
      } finally {
        setInitialLoading(false);
      }
    };

    loadAssessment();
  }, [assessmentId]);

  const esasTotal = useMemo(() => {
    const core = [
      form.esas.pain,
      form.esas.tiredness,
      form.esas.drowsiness,
      form.esas.nausea,
      form.esas.appetite,
      form.esas.shortnessOfBreath,
      form.esas.depression,
      form.esas.anxiety,
      form.esas.wellbeing
    ];
    return core.reduce((a, b) => a + Number(b || 0), 0);
  }, [form.esas]);

  const activeSymptoms = useMemo(() => {
    const core = [
      form.esas.pain,
      form.esas.tiredness,
      form.esas.drowsiness,
      form.esas.nausea,
      form.esas.appetite,
      form.esas.shortnessOfBreath,
      form.esas.depression,
      form.esas.anxiety,
      form.esas.wellbeing
    ];
    return core.filter((v) => Number(v) > 0).length;
  }, [form.esas]);

  const postDircEsasTotal = useMemo(() => {
    const core = [
      form.postDircEsas.pain,
      form.postDircEsas.tiredness,
      form.postDircEsas.drowsiness,
      form.postDircEsas.nausea,
      form.postDircEsas.appetite,
      form.postDircEsas.shortnessOfBreath,
      form.postDircEsas.depression,
      form.postDircEsas.anxiety,
      form.postDircEsas.wellbeing
    ];
    return core.reduce((a, b) => a + Number(b || 0), 0);
  }, [form.postDircEsas]);

  const postDircActiveSymptoms = useMemo(() => {
    const core = [
      form.postDircEsas.pain,
      form.postDircEsas.tiredness,
      form.postDircEsas.drowsiness,
      form.postDircEsas.nausea,
      form.postDircEsas.appetite,
      form.postDircEsas.shortnessOfBreath,
      form.postDircEsas.depression,
      form.postDircEsas.anxiety,
      form.postDircEsas.wellbeing
    ];
    return core.filter((v) => Number(v) > 0).length;
  }, [form.postDircEsas]);

  const updateNested = (group, key, value) => {
    setForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value
      }
    }));
  };

  const updateConferenceRow = (index, key, value) => {
    setForm((prev) => {
      const rows = [...(prev.radiologyConference.rows || [])];
      rows[index] = { ...rows[index], [key]: value };
      return {
        ...prev,
        radiologyConference: {
          ...prev.radiologyConference,
          rows
        }
      };
    });
  };

  const addConferenceRow = () => {
    setForm((prev) => ({
      ...prev,
      radiologyConference: {
        ...prev.radiologyConference,
        rows: [...(prev.radiologyConference.rows || []), { ...emptyConferenceRow }]
      }
    }));
  };

  const removeConferenceRow = (index) => {
    setForm((prev) => {
      const nextRows = (prev.radiologyConference.rows || []).filter((_, i) => i !== index);
      return {
        ...prev,
        radiologyConference: {
          ...prev.radiologyConference,
          rows: nextRows.length ? nextRows : [{ ...emptyConferenceRow }]
        }
      };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");

    try {
      let patientId = id || loadedPatientId;

      if (!patientId && !assessmentId) {
        const patientPayload = {
          uhid: form.demographic.uhid,
          patientName: form.demographic.name,
          age: form.demographic.age ? Number(form.demographic.age) : undefined,
          gender: form.demographic.gender || undefined,
          address: form.demographic.address || "",
          religion: form.demographic.religion || "",
          phoneNumber: "",
          primaryDiagnosis: form.history.oncologicalDiagnosis || "",
          diagnosisDate: form.demographic.date || "",
          cancerStage: "",
          consentGiven:
            String(form.demographic.informedConsent).toLowerCase() === "yes"
        };

        const patientRes = await api.post("/patients", patientPayload);
        patientId = patientRes.data._id;
      }

      const assessmentPayload = {
        patientId,
        assessmentType: "baseline",
        assessmentDate: form.demographic.date || new Date().toISOString(),

        demographic: form.demographic,
        history: form.history,
        investigations: form.investigations,
        preConference: form.preConference,
        qlqC30: form.qlqC30,
        esas: form.esas,

        radiologyConference: {
          ...form.radiologyConference,
          rows: (form.radiologyConference.rows || []).filter(
            (row) => row.modality || row.partRegion || row.yesNo || row.date || row.findings
          )
        },

        postDircQlqC30: form.postDircQlqC30,
        postDircEsas: form.postDircEsas,
        postConferenceOutcomes: form.postConferenceOutcomes,
        summary: form.summary,
        notes: ""
      };

      if (assessmentId) {
        await api.patch(`/assessments/${assessmentId}`, assessmentPayload);
        navigate(`/patients/${patientId}`);
      } else {
        await api.post("/assessments", assessmentPayload);
        navigate(`/patients/${patientId}`);
      }
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || "Failed to save assessment and patient."
      );
    } finally {
      setLoading(false);
    }
  };

  const qlqQuestions =
    form.language === "hi"
      ? qlqHi
      : form.language === "hiLatn"
      ? qlqHiLatn
      : qlqEn;

  if (initialLoading) {
    return <div className="page">Loading assessment...</div>;
  }

  return (
    <div className="page">
      <PageHeader
        title={assessmentId ? "Edit Assessment / Case Record" : "Assessment / Case Record Wizard"}
        subtitle={
          assessmentId
            ? `Editing assessment: ${assessmentId}`
            : `Patient route id: ${id || "new patient"}`
        }
        actions={
          step === 4 || step === 6 ? (
            <select
              className="lang-select"
              value={form.language}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, language: e.target.value }))
              }
            >
              <option value="en">English</option>
              <option value="hiLatn">Hindi Transliteration</option>
              <option value="hi">हिंदी</option>
            </select>
          ) : null
        }
      />

      <div className="panel wizard-panel">
        <div className="wizard-steps">
          <WizardStep number={1} title="Demographic Data" active={step === 1} />
          <WizardStep number={2} title="History & Examination" active={step === 2} />
          <WizardStep number={3} title="Investigations & Treatment" active={step === 3} />
          <WizardStep number={4} title="QLQ-C30 + ESAS + Body Map" active={step === 4} />
          <WizardStep number={5} title="Radiology Conference Discussion" active={step === 5} />
          <WizardStep number={6} title="Post-DIRC" active={step === 6} />
          <WizardStep number={7} title="Post Conference Outcomes + Summary" active={step === 7} />
        </div>

        {step === 1 && (
          <SectionCard title="SECTION 1 - DEMOGRAPHIC DATA">
            <div className="form-grid">
              <div className="form-field"><label>A. Name</label><input value={form.demographic.name} onChange={(e) => updateNested("demographic", "name", e.target.value)} /></div>
              <div className="form-field"><label>B. Age</label><input value={form.demographic.age} onChange={(e) => updateNested("demographic", "age", e.target.value)} /></div>
              <div className="form-field"><label>C. Gender</label><select value={form.demographic.gender} onChange={(e) => updateNested("demographic", "gender", e.target.value)}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select></div>
              <div className="form-field span-2"><label>D. Address</label><input value={form.demographic.address} onChange={(e) => updateNested("demographic", "address", e.target.value)} /></div>
              <div className="form-field"><label>E. Religion</label><input value={form.demographic.religion} onChange={(e) => updateNested("demographic", "religion", e.target.value)} /></div>
              <div className="form-field"><label>F. Date</label><input type="date" value={form.demographic.date} onChange={(e) => updateNested("demographic", "date", e.target.value)} /></div>
              <div className="form-field"><label>G. UHID number</label><input value={form.demographic.uhid} onChange={(e) => updateNested("demographic", "uhid", e.target.value)} /></div>
              <div className="form-field"><label>H. Informed consent</label><input value={form.demographic.informedConsent} onChange={(e) => updateNested("demographic", "informedConsent", e.target.value)} placeholder="Yes / No" /></div>
            </div>
          </SectionCard>
        )}

        {step === 2 && (
          <SectionCard title="SECTION 2 - HISTORY AND EXAMINATION">
            <div className="form-grid">
              <div className="form-field span-2"><label>I. Oncological diagnosis</label><textarea rows="3" value={form.history.oncologicalDiagnosis} onChange={(e) => updateNested("history", "oncologicalDiagnosis", e.target.value)} /></div>
              <div className="form-field span-2"><label>J. Chief complaints and brief history</label><textarea rows="3" value={form.history.chiefComplaints} onChange={(e) => updateNested("history", "chiefComplaints", e.target.value)} /></div>
              <div className="form-field span-2"><label>K. Comorbidities</label><textarea rows="3" value={form.history.comorbidities} onChange={(e) => updateNested("history", "comorbidities", e.target.value)} /></div>
              <div className="form-field span-2"><label>L. Medical history</label><textarea rows="3" value={form.history.medicalHistory} onChange={(e) => updateNested("history", "medicalHistory", e.target.value)} /></div>
              <div className="form-field span-2"><label>M. Surgical history</label><textarea rows="3" value={form.history.surgicalHistory} onChange={(e) => updateNested("history", "surgicalHistory", e.target.value)} /></div>
              <div className="form-field span-2"><label>N. Examination Findings - General examination</label><textarea rows="3" value={form.history.generalExamination} onChange={(e) => updateNested("history", "generalExamination", e.target.value)} /></div>
              <div className="form-field"><label>ECOG-PS</label><input value={form.history.ecogPs} onChange={(e) => updateNested("history", "ecogPs", e.target.value)} /></div>
              <div className="form-field span-2"><label>Systemic examination</label><textarea rows="3" value={form.history.systemicExamination} onChange={(e) => updateNested("history", "systemicExamination", e.target.value)} /></div>
              <div className="form-field"><label>O. Treatment intent</label><input value={form.history.treatmentIntent} onChange={(e) => updateNested("history", "treatmentIntent", e.target.value)} placeholder="Curative / Palliative" /></div>
              <div className="form-field"><label>Best supportive care</label><input value={form.history.bestSupportiveCare} onChange={(e) => updateNested("history", "bestSupportiveCare", e.target.value)} placeholder="Yes / No" /></div>
              <div className="form-field"><label>If yes, documented by</label><input value={form.history.documentedBy} onChange={(e) => updateNested("history", "documentedBy", e.target.value)} /></div>
              <div className="form-field"><label>On</label><input type="date" value={form.history.documentedOn} onChange={(e) => updateNested("history", "documentedOn", e.target.value)} /></div>
            </div>
          </SectionCard>
        )}

        {step === 3 && (
          <>
            <SectionCard title="SECTION 3 - INVESTIGATIONS AND TREATMENT">
              <div className="form-grid">
                <div className="form-field"><label>P. Date</label><input type="date" value={form.investigations.investigationDate} onChange={(e) => updateNested("investigations", "investigationDate", e.target.value)} /></div>
                <div className="form-field"><label>Haemoglobin</label><input value={form.investigations.haemoglobin} onChange={(e) => updateNested("investigations", "haemoglobin", e.target.value)} /></div>
                <div className="form-field"><label>Total leukocyte count</label><input value={form.investigations.totalLeukocyteCount} onChange={(e) => updateNested("investigations", "totalLeukocyteCount", e.target.value)} /></div>
                <div className="form-field"><label>Platelets</label><input value={form.investigations.platelets} onChange={(e) => updateNested("investigations", "platelets", e.target.value)} /></div>
                <div className="form-field"><label>Urea/Creatinine</label><input value={form.investigations.ureaCreatinine} onChange={(e) => updateNested("investigations", "ureaCreatinine", e.target.value)} /></div>
                <div className="form-field"><label>Na/K/Ca</label><input value={form.investigations.sodiumPotassiumCalcium} onChange={(e) => updateNested("investigations", "sodiumPotassiumCalcium", e.target.value)} /></div>
                <div className="form-field"><label>Total bilirubin / Direct bilirubin</label><input value={form.investigations.totalBilirubinDirectBilirubin} onChange={(e) => updateNested("investigations", "totalBilirubinDirectBilirubin", e.target.value)} /></div>
                <div className="form-field"><label>SGOT/SGPT/ALP</label><input value={form.investigations.sgotSgptAlp} onChange={(e) => updateNested("investigations", "sgotSgptAlp", e.target.value)} /></div>
                <div className="form-field"><label>Total protein/albumin</label><input value={form.investigations.totalProteinAlbumin} onChange={(e) => updateNested("investigations", "totalProteinAlbumin", e.target.value)} /></div>
                <div className="form-field span-2"><label>Others</label><textarea rows="3" value={form.investigations.others} onChange={(e) => updateNested("investigations", "others", e.target.value)} /></div>
                <div className="form-field span-2"><label>Q. Current treatment history - Conservative management</label><textarea rows="3" value={form.investigations.conservativeManagement} onChange={(e) => updateNested("investigations", "conservativeManagement", e.target.value)} /></div>
                <div className="form-field"><label>Interventions done - Non-surgical</label><textarea rows="3" value={form.investigations.interventionsNonSurgical} onChange={(e) => updateNested("investigations", "interventionsNonSurgical", e.target.value)} /></div>
                <div className="form-field"><label>Interventions done - Surgical</label><textarea rows="3" value={form.investigations.interventionsSurgical} onChange={(e) => updateNested("investigations", "interventionsSurgical", e.target.value)} /></div>
                <div className="form-field span-2"><label>Indication</label><textarea rows="3" value={form.investigations.indication} onChange={(e) => updateNested("investigations", "indication", e.target.value)} /></div>
                <div className="form-field span-2"><label>Operation notes and intraoperative findings</label><textarea rows="3" value={form.investigations.operationNotes} onChange={(e) => updateNested("investigations", "operationNotes", e.target.value)} /></div>
                <div className="form-field"><label>Admission</label><input value={form.investigations.admission} onChange={(e) => updateNested("investigations", "admission", e.target.value)} /></div>
                <div className="form-field"><label>Re-admission</label><input value={form.investigations.readmission} onChange={(e) => updateNested("investigations", "readmission", e.target.value)} /></div>
                <div className="form-field span-2"><label>R. Reason for discussion of imaging</label><textarea rows="3" value={form.investigations.reasonForDiscussionOfImaging} onChange={(e) => updateNested("investigations", "reasonForDiscussionOfImaging", e.target.value)} /></div>
              </div>
            </SectionCard>

            <SectionCard title="SECTION 4 - PRECONFERENCE ASSESSMENT">
              <div className="form-grid">
                <div className="form-field"><label>EORTC QLQ-C30 (version 3.0)</label><input value="Attached" readOnly /></div>
                <div className="form-field"><label>ESAS Scores</label><input value="Attached" readOnly /></div>
                <div className="form-field span-2"><label>Goals of care</label><textarea rows="3" value={form.preConference.goalsOfCare} onChange={(e) => updateNested("preConference", "goalsOfCare", e.target.value)} /></div>
              </div>
            </SectionCard>
          </>
        )}

        {step === 4 && (
          <>
            <SectionCard title="PRE-DIRC QLQ-C30">
              <div className="question-grid">
                {qlqQuestions.map((text, i) => {
                  const qNo = i + 1;
                  const options = qNo >= 29 ? qlq7[form.language] : qlq4[form.language];

                  return (
                    <div key={qNo} className="question-card">
                      <label>{qNo}. {text}</label>
                      <select
                        value={form.qlqC30[`q${qNo}`]}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            qlqC30: {
                              ...prev.qlqC30,
                              [`q${qNo}`]: Number(e.target.value)
                            }
                          }))
                        }
                      >
                        {options.map((opt, idx) => (
                          <option key={idx + 1} value={idx + 1}>
                            {idx + 1} - {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="PRE-DIRC ESAS-r">
              <div className="scale-note">
                <span>{textByLanguage("0 = No symptom", "0 = Bilkul nahin", "0 = बिल्कुल नहीं", form.language)}</span>
                <span>{textByLanguage("10 = Worst possible", "10 = Sabse zyada", "10 = सबसे ज़्यादा", form.language)}</span>
              </div>

              <div className="question-grid">
                {esasFields.map((f) => (
                  <div key={f.key} className="question-card">
                    <label>{textByLanguage(f.en, f.hiLatn, f.hi, form.language)}</label>
                    <select
                      value={form.esas[f.key]}
                      onChange={(e) => updateNested("esas", f.key, Number(e.target.value))}
                    >
                      {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="esas-summary-grid">
                <div className="summary-box">
                  <div className="summary-title">Total ESAS Score</div>
                  <div className="summary-value">{esasTotal}</div>
                </div>
                <div className="summary-box">
                  <div className="summary-title">Active Symptoms</div>
                  <div className="summary-value">{activeSymptoms}</div>
                </div>
              </div>

              <div className="form-grid" style={{ marginTop: 18 }}>
                <div className="form-field"><label>Patient Name</label><input value={form.esas.patientName} onChange={(e) => updateNested("esas", "patientName", e.target.value)} /></div>
                <div className="form-field"><label>Date</label><input type="date" value={form.esas.date} onChange={(e) => updateNested("esas", "date", e.target.value)} /></div>
                <div className="form-field"><label>Time</label><input value={form.esas.time} onChange={(e) => updateNested("esas", "time", e.target.value)} /></div>
              </div>

              <div className="checkbox-grid">
                <label className="checkbox-line"><input type="checkbox" checked={form.esas.completedBy.patient} onChange={(e) => setForm((prev) => ({ ...prev, esas: { ...prev.esas, completedBy: { ...prev.esas.completedBy, patient: e.target.checked } } }))} />Patient</label>
                <label className="checkbox-line"><input type="checkbox" checked={form.esas.completedBy.familyCaregiver} onChange={(e) => setForm((prev) => ({ ...prev, esas: { ...prev.esas, completedBy: { ...prev.esas.completedBy, familyCaregiver: e.target.checked } } }))} />Family Caregiver</label>
                <label className="checkbox-line"><input type="checkbox" checked={form.esas.completedBy.healthcareProfessionalCaregiver} onChange={(e) => setForm((prev) => ({ ...prev, esas: { ...prev.esas, completedBy: { ...prev.esas.completedBy, healthcareProfessionalCaregiver: e.target.checked } } }))} />Health Care Professional Caregiver</label>
              </div>
            </SectionCard>

            <SectionCard title="PRE-DIRC Body Diagram">
              <div className="body-map-grid">
                <div className="body-map-card">
                  <h4>Body Map</h4>
                  <img src="/body-map.png" alt="Body map" className="body-map-image" />
                </div>
                <div className="body-map-card">
                  <h4>Body Diagram Notes</h4>
                  <textarea
                    rows="10"
                    value={form.esas.bodyDiagramNotes}
                    onChange={(e) => updateNested("esas", "bodyDiagramNotes", e.target.value)}
                    placeholder="Describe marked pain locations exactly as shown on the body diagram."
                  />
                </div>
              </div>
            </SectionCard>
          </>
        )}

        {step === 5 && (
          <SectionCard title="SECTION 5 - RADIOLOGY CONFERENCE DISCUSSION">
            <div className="form-grid">
              <div className="form-field">
                <label>a. Number of imaging submitted for discussion</label>
                <input
                  value={form.radiologyConference.numberOfImagingSubmitted}
                  onChange={(e) => updateNested("radiologyConference", "numberOfImagingSubmitted", e.target.value)}
                />
              </div>
            </div>

            <div
              className="panel-head"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}
            >
              <h3>Radiology Imaging Rows</h3>
              <button type="button" className="secondary-btn" onClick={addConferenceRow}>
                Add Imaging Row
              </button>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>S.NO.</th>
                    <th>IMAGING MODALITY</th>
                    <th>PART/REGION</th>
                    <th>YES/NO</th>
                    <th>DATE</th>
                    <th>REPORTED FINDINGS SUMMARY</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {(form.radiologyConference.rows || []).map((row, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <select
                          value={row.modality}
                          onChange={(e) => updateConferenceRow(idx, "modality", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="X-RAY">X-RAY</option>
                          <option value="USG">USG</option>
                          <option value="CT">CT</option>
                          <option value="MRI">MRI</option>
                          <option value="PET-CT">PET-CT</option>
                          <option value="OTHER">OTHER</option>
                        </select>
                      </td>
                      <td>
                        <input
                          value={row.partRegion}
                          onChange={(e) => updateConferenceRow(idx, "partRegion", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          value={row.yesNo}
                          onChange={(e) => updateConferenceRow(idx, "yesNo", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={row.date}
                          onChange={(e) => updateConferenceRow(idx, "date", e.target.value)}
                        />
                      </td>
                      <td>
                        <textarea
                          rows="2"
                          value={row.findings}
                          onChange={(e) => updateConferenceRow(idx, "findings", e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="tiny-btn"
                          onClick={() => removeConferenceRow(idx)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="form-grid" style={{ marginTop: 18 }}>
              <div className="form-field span-2"><label>c. Summary of findings</label><textarea rows="3" value={form.radiologyConference.summaryOfFindings} onChange={(e) => updateNested("radiologyConference", "summaryOfFindings", e.target.value)} /></div>
              <div className="form-field span-2"><label>d. Implications for patient care</label><textarea rows="3" value={form.radiologyConference.implicationsForPatientCare} onChange={(e) => updateNested("radiologyConference", "implicationsForPatientCare", e.target.value)} /></div>
              <div className="form-field span-2"><label>e. Doubts and queries put forth</label><textarea rows="3" value={form.radiologyConference.doubtsQueriesPutForth} onChange={(e) => updateNested("radiologyConference", "doubtsQueriesPutForth", e.target.value)} /></div>
              <div className="form-field span-2"><label>f. Imaging vs clinical findings</label><textarea rows="3" value={form.radiologyConference.imagingVsClinicalFindings} onChange={(e) => updateNested("radiologyConference", "imagingVsClinicalFindings", e.target.value)} /></div>
              <div className="form-field span-2"><label>g. Detailed discussion</label><textarea rows="3" value={form.radiologyConference.detailedDiscussion} onChange={(e) => updateNested("radiologyConference", "detailedDiscussion", e.target.value)} /></div>
              <div className="form-field span-2"><label>h. Artefacts / new findings previously missed</label><textarea rows="3" value={form.radiologyConference.artefactsNewFindingsPreviouslyMissed} onChange={(e) => updateNested("radiologyConference", "artefactsNewFindingsPreviouslyMissed", e.target.value)} /></div>
              <div className="form-field span-2"><label>i. New queries and doubts discussed during conference</label><textarea rows="3" value={form.radiologyConference.newQueriesDoubtsDiscussed} onChange={(e) => updateNested("radiologyConference", "newQueriesDoubtsDiscussed", e.target.value)} /></div>
              <div className="form-field span-2"><label>j. Post conference suggestions - Further suggested imaging / investigations</label><textarea rows="3" value={form.radiologyConference.furtherSuggestedImagingInvestigations} onChange={(e) => updateNested("radiologyConference", "furtherSuggestedImagingInvestigations", e.target.value)} /></div>
              <div className="form-field span-2"><label>Further suggestions for management</label><textarea rows="3" value={form.radiologyConference.furtherSuggestionsForManagement} onChange={(e) => updateNested("radiologyConference", "furtherSuggestionsForManagement", e.target.value)} /></div>
            </div>
          </SectionCard>
        )}

        {step === 6 && (
          <>
            <SectionCard title="POST-DIRC QLQ-C30">
              <div className="question-grid">
                {qlqQuestions.map((text, i) => {
                  const qNo = i + 1;
                  const options = qNo >= 29 ? qlq7[form.language] : qlq4[form.language];

                  return (
                    <div key={qNo} className="question-card">
                      <label>{qNo}. {text}</label>
                      <select
                        value={form.postDircQlqC30[`q${qNo}`]}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            postDircQlqC30: {
                              ...prev.postDircQlqC30,
                              [`q${qNo}`]: Number(e.target.value)
                            }
                          }))
                        }
                      >
                        {options.map((opt, idx) => (
                          <option key={idx + 1} value={idx + 1}>
                            {idx + 1} - {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="POST-DIRC ESAS-r">
              <div className="scale-note">
                <span>{textByLanguage("0 = No symptom", "0 = Bilkul nahin", "0 = बिल्कुल नहीं", form.language)}</span>
                <span>{textByLanguage("10 = Worst possible", "10 = Sabse zyada", "10 = सबसे ज़्यादा", form.language)}</span>
              </div>

              <div className="question-grid">
                {esasFields.map((f) => (
                  <div key={f.key} className="question-card">
                    <label>{textByLanguage(f.en, f.hiLatn, f.hi, form.language)}</label>
                    <select
                      value={form.postDircEsas[f.key]}
                      onChange={(e) => updateNested("postDircEsas", f.key, Number(e.target.value))}
                    >
                      {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="esas-summary-grid">
                <div className="summary-box">
                  <div className="summary-title">Post-DIRC Total ESAS Score</div>
                  <div className="summary-value">{postDircEsasTotal}</div>
                </div>
                <div className="summary-box">
                  <div className="summary-title">Post-DIRC Active Symptoms</div>
                  <div className="summary-value">{postDircActiveSymptoms}</div>
                </div>
              </div>

              <div className="form-grid" style={{ marginTop: 18 }}>
                <div className="form-field"><label>Patient Name</label><input value={form.postDircEsas.patientName} onChange={(e) => updateNested("postDircEsas", "patientName", e.target.value)} /></div>
                <div className="form-field"><label>Date</label><input type="date" value={form.postDircEsas.date} onChange={(e) => updateNested("postDircEsas", "date", e.target.value)} /></div>
                <div className="form-field"><label>Time</label><input value={form.postDircEsas.time} onChange={(e) => updateNested("postDircEsas", "time", e.target.value)} /></div>
              </div>

              <div className="checkbox-grid">
                <label className="checkbox-line"><input type="checkbox" checked={form.postDircEsas.completedBy.patient} onChange={(e) => setForm((prev) => ({ ...prev, postDircEsas: { ...prev.postDircEsas, completedBy: { ...prev.postDircEsas.completedBy, patient: e.target.checked } } }))} />Patient</label>
                <label className="checkbox-line"><input type="checkbox" checked={form.postDircEsas.completedBy.familyCaregiver} onChange={(e) => setForm((prev) => ({ ...prev, postDircEsas: { ...prev.postDircEsas, completedBy: { ...prev.postDircEsas.completedBy, familyCaregiver: e.target.checked } } }))} />Family Caregiver</label>
                <label className="checkbox-line"><input type="checkbox" checked={form.postDircEsas.completedBy.healthcareProfessionalCaregiver} onChange={(e) => setForm((prev) => ({ ...prev, postDircEsas: { ...prev.postDircEsas, completedBy: { ...prev.postDircEsas.completedBy, healthcareProfessionalCaregiver: e.target.checked } } }))} />Health Care Professional Caregiver</label>
              </div>
            </SectionCard>

            <SectionCard title="POST-DIRC Body Diagram">
              <div className="body-map-grid">
                <div className="body-map-card">
                  <h4>Body Map</h4>
                  <img src="/body-map.png" alt="Body map" className="body-map-image" />
                </div>
                <div className="body-map-card">
                  <h4>Body Diagram Notes</h4>
                  <textarea
                    rows="10"
                    value={form.postDircEsas.bodyDiagramNotes}
                    onChange={(e) => updateNested("postDircEsas", "bodyDiagramNotes", e.target.value)}
                    placeholder="Describe marked pain locations exactly as shown on the body diagram."
                  />
                </div>
              </div>
            </SectionCard>
          </>
        )}

        {step === 7 && (
          <>
            <SectionCard title="SECTION 7 - POST CONFERENCE OUTCOMES">
              <div className="form-grid">
                <div className="form-field span-2"><label>A. Changes in primary treatment</label><textarea rows="3" value={form.postConferenceOutcomes.changesInPrimaryTreatment} onChange={(e) => updateNested("postConferenceOutcomes", "changesInPrimaryTreatment", e.target.value)} /></div>
                <div className="form-field span-2"><label>B. Changes in intent of treatment</label><textarea rows="3" value={form.postConferenceOutcomes.changesInIntentOfTreatment} onChange={(e) => updateNested("postConferenceOutcomes", "changesInIntentOfTreatment", e.target.value)} /></div>
                <div className="form-field span-2"><label>C. Assistance in prognostication / survival assessment</label><textarea rows="3" value={form.postConferenceOutcomes.assistanceInPrognosticationSurvivalAssessment} onChange={(e) => updateNested("postConferenceOutcomes", "assistanceInPrognosticationSurvivalAssessment", e.target.value)} /></div>
                <div className="form-field span-2"><label>D. Psychosocial or spiritual implications on suggested management (if any)</label><textarea rows="3" value={form.postConferenceOutcomes.psychosocialOrSpiritualImplications} onChange={(e) => updateNested("postConferenceOutcomes", "psychosocialOrSpiritualImplications", e.target.value)} /></div>
                <div className="form-field span-2"><label>Goals of care post DIRC</label><textarea rows="3" value={form.postConferenceOutcomes.goalsOfCarePostDIRC} onChange={(e) => updateNested("postConferenceOutcomes", "goalsOfCarePostDIRC", e.target.value)} /></div>

                <div className="form-field"><label>Changes in Management</label><input value={form.postConferenceOutcomes.changesInManagementYesNo} onChange={(e) => updateNested("postConferenceOutcomes", "changesInManagementYesNo", e.target.value)} placeholder="YES / NO" /></div>
                <div className="form-field span-2"><label>If yes, describe Change(s)</label><textarea rows="3" value={form.postConferenceOutcomes.changesInManagementDescribe} onChange={(e) => updateNested("postConferenceOutcomes", "changesInManagementDescribe", e.target.value)} /></div>

                <div className="form-field"><label>Further Imaging Advised</label><input value={form.postConferenceOutcomes.furtherImagingAdvisedYesNo} onChange={(e) => updateNested("postConferenceOutcomes", "furtherImagingAdvisedYesNo", e.target.value)} placeholder="YES / NO" /></div>
                <div className="form-field span-2"><label>If yes, what was advised</label><textarea rows="3" value={form.postConferenceOutcomes.furtherImagingAdvisedWhat} onChange={(e) => updateNested("postConferenceOutcomes", "furtherImagingAdvisedWhat", e.target.value)} /></div>

                <div className="form-field"><label>Goals of Care Revised</label><input value={form.postConferenceOutcomes.goalsOfCareRevisedYesNo} onChange={(e) => updateNested("postConferenceOutcomes", "goalsOfCareRevisedYesNo", e.target.value)} placeholder="YES / NO" /></div>
                <div className="form-field span-2"><label>Advance Care Planning Discussions</label><textarea rows="3" value={form.postConferenceOutcomes.advanceCarePlanningDiscussions} onChange={(e) => updateNested("postConferenceOutcomes", "advanceCarePlanningDiscussions", e.target.value)} /></div>
              </div>
            </SectionCard>

            <SectionCard title="SUMMARY">
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>PARAMETER</th>
                      <th>PRE-DIRC</th>
                      <th>POST-DIRC</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>EORTC QLQ C30 overall score</td>
                      <td><input value={form.summary.eortcQlqC30OverallPre} onChange={(e) => updateNested("summary", "eortcQlqC30OverallPre", e.target.value)} /></td>
                      <td><input value={form.summary.eortcQlqC30OverallPost} onChange={(e) => updateNested("summary", "eortcQlqC30OverallPost", e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td>Total ESAS Score</td>
                      <td><input value={form.summary.totalEsasScorePre} onChange={(e) => updateNested("summary", "totalEsasScorePre", e.target.value)} /></td>
                      <td><input value={form.summary.totalEsasScorePost} onChange={(e) => updateNested("summary", "totalEsasScorePost", e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td>Number of active symptoms</td>
                      <td><input value={form.summary.activeSymptomsPre} onChange={(e) => updateNested("summary", "activeSymptomsPre", e.target.value)} /></td>
                      <td><input value={form.summary.activeSymptomsPost} onChange={(e) => updateNested("summary", "activeSymptomsPost", e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td>Treatment plan modified (Yes/No)</td>
                      <td><input value={form.summary.treatmentPlanModifiedPre} onChange={(e) => updateNested("summary", "treatmentPlanModifiedPre", e.target.value)} /></td>
                      <td><input value={form.summary.treatmentPlanModifiedPost} onChange={(e) => updateNested("summary", "treatmentPlanModifiedPost", e.target.value)} /></td>
                    </tr>
                    <tr>
                      <td>Goals of care altered (Yes/No)</td>
                      <td><input value={form.summary.goalsOfCareAlteredPre} onChange={(e) => updateNested("summary", "goalsOfCareAlteredPre", e.target.value)} /></td>
                      <td><input value={form.summary.goalsOfCareAlteredPost} onChange={(e) => updateNested("summary", "goalsOfCareAlteredPost", e.target.value)} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </>
        )}

        {submitError && <div className="error-box">{submitError}</div>}

        <div className="footer-actions">
          <button
            type="button"
            className="secondary-btn"
            disabled={step === 1}
            onClick={() => setStep((s) => s - 1)}
          >
            Previous
          </button>

          {step < 7 ? (
            <button
              type="button"
              className="primary-btn"
              onClick={() => setStep((s) => s + 1)}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="primary-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : assessmentId ? "Update Case Record" : "Save Case Record"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}