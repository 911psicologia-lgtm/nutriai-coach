import { useState, useEffect, useRef } from "react";

// ─── DIET TYPES DATABASE ────────────────────────────────────────────────────
const DIETS = [
  {
    id: "mediterranea",
    name: "Mediterránea",
    emoji: "🫒",
    color: "#2D7D46",
    accent: "#E8F5E9",
    tagline: "Salud cardiometabólica y peso sostenido",
    desc: "Verduras, frutas, legumbres, granos integrales, aceite de oliva y pescado. Favorece la salud del corazón y pérdida de peso duradera.",
    tags: ["Corazón", "Sostenible", "Equilibrada"],
    ideal: "Pérdida gradual, salud general, colesterol",
  },
  {
    id: "dash",
    name: "DASH",
    emoji: "🫐",
    color: "#1565C0",
    accent: "#E3F2FD",
    tagline: "Control de presión arterial",
    desc: "Rica en frutas, verduras y lácteos bajos en grasa. Limita sodio y ultraprocesados. Diseñada para la hipertensión.",
    tags: ["Hipertensión", "Sodio bajo", "Corazón"],
    ideal: "Presión arterial, salud cardiovascular",
  },
  {
    id: "mind",
    name: "MIND",
    emoji: "🧠",
    color: "#6A1B9A",
    accent: "#F3E5F5",
    tagline: "Nutrición cerebral y cognitiva",
    desc: "Fusión Mediterránea + DASH con foco en el cerebro. Prioriza verduras de hoja, frutos rojos, nueces y aceite de oliva.",
    tags: ["Cerebro", "Cognitiva", "Antioxidante"],
    ideal: "Memoria, concentración, bienestar mental",
  },
  {
    id: "lowcarb",
    name: "Low-Carb",
    emoji: "🥩",
    color: "#E65100",
    accent: "#FFF3E0",
    tagline: "Menos carbohidratos, más control",
    desc: "Reduce pan, arroz, azúcar y harinas. Disminuye calorías y apetito de forma natural. Efectiva para bajar peso.",
    tags: ["Pérdida de peso", "Glucosa", "Apetito"],
    ideal: "Bajar peso, control glucémico",
  },
  {
    id: "keto",
    name: "Cetogénica (Keto)",
    emoji: "🥑",
    color: "#B71C1C",
    accent: "#FFEBEE",
    tagline: "Cetosis para pérdida rápida",
    desc: "Carbohidratos muy bajos, grasas altas. Induce cetosis. Puede bajar peso rápido, aunque es exigente y requiere seguimiento.",
    tags: ["Cetosis", "Grasas", "Intensiva"],
    ideal: "Pérdida rápida de peso, epilepsia",
  },
  {
    id: "ayuno",
    name: "Ayuno Intermitente",
    emoji: "⏰",
    color: "#00695C",
    accent: "#E0F2F1",
    tagline: "Ventanas de alimentación estratégicas",
    desc: 'Organiza "ventanas" de comida (ej. 16/8). No es un menú, es un horario. Funciona reduciendo la ingesta total calórica.',
    tags: ["Horario", "Flexible", "Metabólico"],
    ideal: "Control calórico, metabolismo",
  },
  {
    id: "vegetariana",
    name: "Vegetariana / Flexitariana",
    emoji: "🥗",
    color: "#388E3C",
    accent: "#F1F8E9",
    tagline: "Plantas en el centro, flexible",
    desc: "Prioriza plantas (y en flexitariana, algo de carne ocasional). Alta en fibra y saciedad, favorece control de peso.",
    tags: ["Plantas", "Fibra", "Flexible"],
    ideal: "Transición saludable, medio ambiente",
  },
  {
    id: "vegana",
    name: "Vegana",
    emoji: "🌱",
    color: "#1B5E20",
    accent: "#E8F5E9",
    tagline: "100% vegetal, bien planificada",
    desc: "Completamente vegetal. Saludable si está bien planificada (proteínas, hierro, B12, omega-3). Facilita bajar peso por alta fibra.",
    tags: ["100% Vegetal", "Ética", "Fibra alta"],
    ideal: "Ética animal, pérdida de peso, fibra",
  },
  {
    id: "paleo",
    name: "Paleolítica (Paleo)",
    emoji: "🍖",
    color: "#5D4037",
    accent: "#EFEBE9",
    tagline: "Comida real, sin procesar",
    desc: 'Carnes magras, pescado, frutas, verduras, nueces. Evita ultraprocesados, excluye lácteos y granos. Enfoque en "comida real".',
    tags: ["Sin procesar", "Proteína", "Natural"],
    ideal: "Eliminación de ultraprocesados, inflamación",
  },
  {
    id: "alcalina",
    name: "Dieta Alcalina",
    emoji: "🍋",
    color: "#F57F17",
    accent: "#FFFDE7",
    tagline: "Alimentos alcalinizantes naturales",
    desc: "Promueve frutas, verduras y legumbres; limita carnes procesadas y azúcares. El cuerpo regula el pH, pero los alimentos elegidos son saludables.",
    tags: ["Alcalina", "Desintoxicante", "Vegetal"],
    ideal: "Energía, salud digestiva, inflamación",
  },
];

const OBJETIVOS = [
  "Bajar de peso",
  "Subir de peso",
  "Ganar masa muscular",
  "Mejorar alimentación general",
  "Controlar glucosa (diabetes/prediabetes)",
  "Mejorar salud cardiovascular",
  "Dieta antiinflamatoria",
  "Mejorar salud digestiva",
  "Apoyo para condición médica específica",
  "Rendimiento deportivo / resistencia",
  "Transición a dieta vegetariana/vegana",
  "Manejo de alergias/intolerancias",
  "Mejorar energía y vitalidad",
  "Optimizar salud mental y bienestar",
];

const ACTIVIDAD = [
  "Sedentario (poco o nada de ejercicio)",
  "Ligeramente activo (1-3 días/semana)",
  "Moderadamente activo (3-5 días/semana)",
  "Muy activo (6-7 días/semana)",
  "Extremadamente activo (trabajo físico + ejercicio)",
];

const IMC_RANGES = [
  { max: 18.5, label: "Bajo peso", color: "#64B5F6", bg: "#E3F2FD" },
  { max: 25.0, label: "Peso normal", color: "#66BB6A", bg: "#E8F5E9" },
  { max: 30.0, label: "Sobrepeso", color: "#FFA726", bg: "#FFF3E0" },
  { max: 35.0, label: "Obesidad I", color: "#EF5350", bg: "#FFEBEE" },
  { max: 40.0, label: "Obesidad II", color: "#C62828", bg: "#FFCDD2" },
  { max: 999, label: "Obesidad III", color: "#880E4F", bg: "#FCE4EC" },
];

function getIMCInfo(imc) {
  return IMC_RANGES.find((r) => imc < r.max) || IMC_RANGES[IMC_RANGES.length - 1];
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function NutriAICoach() {
  const [step, setStep] = useState(0); // 0=welcome, 1=personal, 2=medidas, 3=historial, 4=habitos, 5=dieta, 6=objetivos, 7=resultado
  const [form, setForm] = useState({
    nombre: "", edad: "", genero: "", profesion: "", email: "", telefono: "",
    estatura: "", peso: "", cintura: "", cadera: "", grasa: "", musculo: "",
    condiciones: "", medicamentos: "", alergias: "", historialFamiliar: "",
    tabaco: "No", alcohol: "Ocasionalmente",
    patronComidas: "3 comidas principales", horarios: "",
    recordatorio24h: "", actividadFisica: "Moderadamente activo (3-5 días/semana)",
    tipoEjercicio: "", sueño: "7", estres: "Moderado",
    preferencias: "", evitar: "", intolerancias: "", restriccionesCulturales: "",
    sintomas: "", motivacion: "",
    dietaSeleccionada: "",
    objetivos: [],
    notasExtra: "",
  });
  const [imc, setImc] = useState(null);
  const [planIA, setPlanIA] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("plan");
  const resultsRef = useRef(null);

  // Auto-calcular IMC
  useEffect(() => {
    const h = parseFloat(form.estatura);
    const w = parseFloat(form.peso);
    if (h > 0 && w > 0) {
      const hm = h / 100;
      setImc((w / (hm * hm)).toFixed(1));
    } else {
      setImc(null);
    }
  }, [form.estatura, form.peso]);

  const up = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const toggleObjetivo = (obj) => {
    setForm((f) => ({
      ...f,
      objetivos: f.objetivos.includes(obj)
        ? f.objetivos.filter((x) => x !== obj)
        : [...f.objetivos, obj],
    }));
  };

  // ─── GENERATE AI PLAN ───────────────────────────────────────────────────
  async function generarPlan() {
    setLoading(true);
    setError("");
    const dietaInfo = DIETS.find((d) => d.id === form.dietaSeleccionada);
    const imcVal = imc ? parseFloat(imc) : null;
    const imcInfo = imcVal ? getIMCInfo(imcVal) : null;

    const prompt = `Eres un nutricionista certificado y experto en dietas personalizadas. Genera un plan de nutrición completo y personalizado basado en los siguientes datos del usuario.

PERFIL DEL USUARIO:
- Nombre: ${form.nombre}
- Edad: ${form.edad} años, Género: ${form.genero}
- Profesión: ${form.profesion}
- Estatura: ${form.estatura} cm, Peso: ${form.peso} kg
- IMC: ${imc || "no calculado"} (${imcInfo ? imcInfo.label : "sin clasificar"})
- Cintura: ${form.cintura || "no indicado"} cm, Cadera: ${form.cadera || "no indicado"} cm
- % Grasa corporal: ${form.grasa || "no disponible"}

HISTORIAL CLÍNICO:
- Condiciones médicas: ${form.condiciones || "ninguna reportada"}
- Medicamentos/suplementos: ${form.medicamentos || "ninguno"}
- Alergias: ${form.alergias || "ninguna"}
- Antecedentes familiares: ${form.historialFamiliar || "sin antecedentes"}
- Tabaco: ${form.tabaco}, Alcohol: ${form.alcohol}

HÁBITOS Y ESTILO DE VIDA:
- Patrón de comidas: ${form.patronComidas}
- Nivel de actividad física: ${form.actividadFisica}
- Tipo de ejercicio: ${form.tipoEjercicio || "no especificado"}
- Horas de sueño: ${form.sueño}h/noche
- Estrés percibido: ${form.estres}
- Recordatorio alimentario 24h: ${form.recordatorio24h || "no proporcionado"}

PREFERENCIAS ALIMENTARIAS:
- Preferencias: ${form.preferencias || "sin preferencias específicas"}
- Alimentos a evitar: ${form.evitar || "ninguno"}
- Intolerancias: ${form.intolerancias || "ninguna"}
- Restricciones culturales/religiosas: ${form.restriccionesCulturales || "ninguna"}

DIETA SELECCIONADA: ${dietaInfo ? dietaInfo.name : "no seleccionada"}
${dietaInfo ? `Descripción: ${dietaInfo.desc}` : ""}

OBJETIVOS PRINCIPALES: ${form.objetivos.join(", ") || "no especificados"}

SÍNTOMAS: ${form.sintomas || "sin síntomas reportados"}
MOTIVACIÓN: ${form.motivacion || "no especificada"}
NOTAS ADICIONALES: ${form.notasExtra || "ninguna"}

INSTRUCCIONES:
Genera un plan detallado adaptando la dieta ${dietaInfo ? dietaInfo.name : "seleccionada"} a las condiciones específicas de este usuario. Responde EXCLUSIVAMENTE en JSON con este esquema exacto:

{
  "diagnostico_nutricional": {
    "estado_actual": "descripción del estado nutricional actual",
    "imc_interpretacion": "interpretación del IMC y composición corporal",
    "problemas_identificados": ["problema1", "problema2"],
    "fortalezas": ["fortaleza1", "fortaleza2"]
  },
  "plan_dieta": {
    "nombre": "nombre descriptivo del plan personalizado",
    "base_dietetica": "dieta base adaptada",
    "calorias_objetivo": 2000,
    "distribucion_macros": {
      "proteinas_pct": 25,
      "carbohidratos_pct": 45,
      "grasas_pct": 30
    },
    "principios_clave": ["principio1", "principio2", "principio3"],
    "alimentos_estrella": ["alimento1", "alimento2", "alimento3", "alimento4", "alimento5"],
    "alimentos_evitar": ["alimento1", "alimento2", "alimento3"]
  },
  "menu_semanal": [
    {
      "dia": "Lunes",
      "comidas": [
        {"tipo": "Desayuno", "descripcion": "descripción completa", "calorias": 400, "macros": "P:20g C:45g G:15g"},
        {"tipo": "Almuerzo", "descripcion": "descripción completa", "calorias": 600, "macros": "P:35g C:60g G:20g"},
        {"tipo": "Merienda", "descripcion": "descripción completa", "calorias": 200, "macros": "P:8g C:25g G:8g"},
        {"tipo": "Cena", "descripcion": "descripción completa", "calorias": 500, "macros": "P:30g C:45g G:18g"}
      ],
      "total_calorias": 1700
    }
  ],
  "recomendaciones": {
    "nutricionales": ["recomendacion1", "recomendacion2", "recomendacion3"],
    "habitos": ["habito1", "habito2", "habito3"],
    "ejercicio": ["ejercicio1", "ejercicio2"],
    "hidratacion": "recomendación de hidratación específica"
  },
  "proyeccion": {
    "meta_peso": "peso objetivo estimado",
    "tiempo_estimado": "tiempo para alcanzar meta",
    "perdida_semanal": "pérdida estimada por semana",
    "hitos": ["hito semana 2", "hito mes 1", "hito mes 3"]
  },
  "advertencias_medicas": ["advertencia1 si aplica"],
  "suplementos_sugeridos": ["suplemento1 si aplica"],
  "mensaje_motivacional": "mensaje personalizado y alentador para ${form.nombre}"
}

Genera el menú para los 7 días de la semana. El plan debe estar completamente adaptado al IMC, condiciones médicas, dieta seleccionada y objetivos del usuario. Si hay condiciones médicas, haz las adaptaciones necesarias.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map((c) => c.text || "").join("") || "";
      const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(clean);
      setPlanIA(parsed);
      setStep(7);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError("Error generando el plan. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const canNext = () => {
    if (step === 1) return form.nombre && form.edad && form.genero && form.email;
    if (step === 2) return form.estatura && form.peso;
    if (step === 5) return form.dietaSeleccionada;
    if (step === 6) return form.objetivos.length > 0;
    return true;
  };

  const STEPS = ["Inicio", "Personal", "Medidas", "Historial", "Hábitos", "Dieta", "Objetivos", "Plan"];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0A2518 0%, #0F3D24 40%, #1A5C3A 100%)", fontFamily: "'Georgia', serif", color: "#F5F0E8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Sans+3:wght@300;400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        .playfair { font-family: 'Playfair Display', Georgia, serif; }
        .source { font-family: 'Source Sans 3', sans-serif; }
        .card { background: rgba(255,255,255,0.06); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; }
        .card-light { background: rgba(255,255,255,0.95); color: #1A2E1A; border-radius: 16px; }
        .btn-primary { background: linear-gradient(135deg, #2ECC71, #27AE60); color: white; border: none; border-radius: 12px; padding: 14px 32px; font-family: 'Source Sans 3', sans-serif; font-weight: 600; font-size: 16px; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(46,204,113,0.4); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-sec { background: rgba(255,255,255,0.1); color: #F5F0E8; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 12px 28px; font-family: 'Source Sans 3', sans-serif; font-size: 15px; cursor: pointer; transition: all 0.2s; }
        .btn-sec:hover { background: rgba(255,255,255,0.2); }
        .input { width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; color: #F5F0E8; font-family: 'Source Sans 3', sans-serif; font-size: 15px; outline: none; transition: border 0.2s; }
        .input::placeholder { color: rgba(245,240,232,0.4); }
        .input:focus { border-color: #2ECC71; background: rgba(255,255,255,0.12); }
        .input option { background: #0F3D24; color: #F5F0E8; }
        .label { font-family: 'Source Sans 3', sans-serif; font-size: 13px; font-weight: 600; color: rgba(245,240,232,0.7); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
        .diet-card { cursor: pointer; border: 2px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 18px; transition: all 0.25s; }
        .diet-card:hover { transform: translateY(-3px); }
        .diet-card.selected { border-width: 2px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .obj-btn { cursor: pointer; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 999px; padding: 8px 18px; font-family: 'Source Sans 3', sans-serif; font-size: 14px; transition: all 0.2s; background: rgba(255,255,255,0.05); color: #F5F0E8; }
        .obj-btn.active { background: #2ECC71; border-color: #2ECC71; color: #0A2518; font-weight: 600; }
        .obj-btn:hover:not(.active) { background: rgba(255,255,255,0.12); }
        .progress-bar { height: 3px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #2ECC71, #1ABC9C); border-radius: 3px; transition: width 0.4s ease; }
        .tab-btn { padding: 10px 20px; border: none; border-radius: 8px; font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .tab-btn.active { background: #27AE60; color: white; }
        .tab-btn:not(.active) { background: rgba(255,255,255,0.08); color: rgba(245,240,232,0.7); }
        .day-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; }
        .meal-row { border-bottom: 1px solid rgba(255,255,255,0.08); padding: 10px 0; }
        .meal-row:last-child { border-bottom: none; }
        .imc-bar { height: 10px; border-radius: 999px; background: linear-gradient(90deg, #64B5F6 0%, #66BB6A 30%, #FFA726 55%, #EF5350 75%, #C62828 90%, #880E4F 100%); position: relative; }
        .imc-needle { width: 3px; height: 18px; background: white; border-radius: 2px; position: absolute; top: -4px; transform: translateX(-50%); box-shadow: 0 2px 8px rgba(0,0,0,0.5); transition: left 0.5s ease; }
        .pill { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-family: 'Source Sans 3', sans-serif; font-weight: 600; }
        .spinner { width: 48px; height: 48px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #2ECC71; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .leaf-decoration { position: absolute; opacity: 0.04; font-size: 200px; pointer-events: none; user-select: none; }
        .section-divider { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0; }
        .rec-item { display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .rec-item:last-child { border-bottom: none; }
      `}</style>

      {/* HEADER */}
      <div style={{ padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>🌿</span>
          <div>
            <div className="playfair" style={{ fontSize: 20, fontWeight: 700, color: "#2ECC71" }}>NutriAI Coach</div>
            <div className="source" style={{ fontSize: 11, color: "rgba(245,240,232,0.5)", letterSpacing: 1 }}>NUTRICIÓN PERSONALIZADA CON IA</div>
          </div>
        </div>
        {step > 0 && step < 7 && (
          <div style={{ textAlign: "right" }}>
            <div className="source" style={{ fontSize: 12, color: "rgba(245,240,232,0.5)", marginBottom: 6 }}>
              Paso {step} de 6 — {STEPS[step]}
            </div>
            <div className="progress-bar" style={{ width: 140 }}>
              <div className="progress-fill" style={{ width: `${(step / 6) * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px" }}>

        {/* ── STEP 0: WELCOME ─────────────────────────────────────────────── */}
        {step === 0 && (
          <div className="fade-in" style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ position: "relative", marginBottom: 40 }}>
              <div style={{ fontSize: 80, marginBottom: 16 }}>🥗</div>
              <h1 className="playfair" style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, marginBottom: 16 }}>
                Tu nutrición,<br /><em style={{ color: "#2ECC71" }}>inteligente</em>
              </h1>
              <p className="source" style={{ fontSize: 18, color: "rgba(245,240,232,0.7)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                Creamos tu plan de dieta personalizado con IA, adaptado a tu cuerpo, objetivos y estilo de vida. Elige entre 10 enfoques nutricionales basados en evidencia.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
              {[
                { icon: "📊", text: "Cálculo automático de IMC" },
                { icon: "🍽️", text: "10 tipos de dieta base" },
                { icon: "🤖", text: "Plan generado por IA" },
                { icon: "📅", text: "Menú semanal completo" },
              ].map((f, i) => (
                <div key={i} className="card" style={{ padding: "20px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{f.icon}</div>
                  <div className="source" style={{ fontSize: 13, color: "rgba(245,240,232,0.7)", fontWeight: 600 }}>{f.text}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ fontSize: 18, padding: "16px 48px" }} onClick={() => setStep(1)}>
              Comenzar mi plan →
            </button>
            <p className="source" style={{ marginTop: 16, fontSize: 12, color: "rgba(245,240,232,0.4)" }}>
              Tus datos se procesan de forma segura y privada
            </p>
          </div>
        )}

        {/* ── STEP 1: DATOS PERSONALES ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="fade-in">
            <div style={{ marginBottom: 32 }}>
              <h2 className="playfair" style={{ fontSize: 32, marginBottom: 8 }}>Datos personales</h2>
              <p className="source" style={{ color: "rgba(245,240,232,0.6)" }}>Cuéntanos quién eres para personalizar tu experiencia</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { label: "Nombre completo *", field: "nombre", placeholder: "Tu nombre completo" },
                { label: "Edad *", field: "edad", placeholder: "Años", type: "number" },
                { label: "Email *", field: "email", placeholder: "correo@ejemplo.com", type: "email" },
                { label: "Teléfono", field: "telefono", placeholder: "Número de contacto" },
                { label: "Profesión / Ocupación", field: "profesion", placeholder: "¿A qué te dedicas?" },
              ].map(({ label, field, placeholder, type = "text" }) => (
                <div key={field} style={field === "profesion" ? { gridColumn: "1 / -1" } : {}}>
                  <label className="label">{label}</label>
                  <input className="input" type={type} placeholder={placeholder} value={form[field]} onChange={(e) => up(field, e.target.value)} />
                </div>
              ))}
              <div>
                <label className="label">Género *</label>
                <select className="input" value={form.genero} onChange={(e) => up("genero", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  <option>Masculino</option>
                  <option>Femenino</option>
                  <option>No binario</option>
                  <option>Prefiero no indicar</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: MEDIDAS ANTROPOMÉTRICAS ──────────────────────────────── */}
        {step === 2 && (
          <div className="fade-in">
            <div style={{ marginBottom: 32 }}>
              <h2 className="playfair" style={{ fontSize: 32, marginBottom: 8 }}>Medidas corporales</h2>
              <p className="source" style={{ color: "rgba(245,240,232,0.6)" }}>Datos esenciales para calcular tu IMC y personalizar el plan</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
              {[
                { label: "Estatura (cm) *", field: "estatura", placeholder: "ej: 170" },
                { label: "Peso actual (kg) *", field: "peso", placeholder: "ej: 75.5" },
                { label: "Cintura (cm)", field: "cintura", placeholder: "ej: 85" },
                { label: "Cadera (cm)", field: "cadera", placeholder: "ej: 95" },
                { label: "% Grasa corporal", field: "grasa", placeholder: "Si lo conoces" },
                { label: "Masa muscular (kg)", field: "musculo", placeholder: "Si lo conoces" },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="label">{label}</label>
                  <input className="input" type="number" step="0.1" placeholder={placeholder} value={form[field]} onChange={(e) => up(field, e.target.value)} />
                </div>
              ))}
            </div>

            {/* IMC DISPLAY */}
            {imc && (
              <div className="card fade-in" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div className="source" style={{ fontSize: 12, color: "rgba(245,240,232,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>Tu IMC calculado</div>
                    <div className="playfair" style={{ fontSize: 56, fontWeight: 900, color: getIMCInfo(parseFloat(imc)).color, lineHeight: 1 }}>{imc}</div>
                    <div className="source" style={{ fontSize: 16, fontWeight: 600, color: getIMCInfo(parseFloat(imc)).color, marginTop: 4 }}>
                      {getIMCInfo(parseFloat(imc)).label}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="source" style={{ fontSize: 12, color: "rgba(245,240,232,0.5)" }}>Rango saludable</div>
                    <div className="source" style={{ fontSize: 18, fontWeight: 700, color: "#66BB6A" }}>18.5 – 24.9</div>
                    <div className="source" style={{ fontSize: 12, color: "rgba(245,240,232,0.4)", marginTop: 4 }}>
                      Peso ideal: {form.estatura ? `${(18.5 * (form.estatura/100)**2).toFixed(0)}–${(24.9 * (form.estatura/100)**2).toFixed(0)} kg` : "—"}
                    </div>
                  </div>
                </div>
                <div className="imc-bar" style={{ marginBottom: 16 }}>
                  <div className="imc-needle" style={{ left: `${Math.min(Math.max(((parseFloat(imc) - 15) / 25) * 100, 2), 98)}%` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {["Bajo peso", "Normal", "Sobrepeso", "Obesidad"].map((l, i) => (
                    <div key={i} className="source" style={{ fontSize: 11, color: "rgba(245,240,232,0.4)" }}>{l}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: HISTORIAL CLÍNICO ─────────────────────────────────────── */}
        {step === 3 && (
          <div className="fade-in">
            <div style={{ marginBottom: 32 }}>
              <h2 className="playfair" style={{ fontSize: 32, marginBottom: 8 }}>Historial clínico</h2>
              <p className="source" style={{ color: "rgba(245,240,232,0.6)" }}>Esta información permite adaptar el plan a tus condiciones de salud</p>
            </div>
            <div style={{ display: "grid", gap: 20 }}>
              {[
                { label: "Enfermedades diagnosticadas", field: "condiciones", placeholder: "ej: diabetes tipo 2, hipertensión, hipotiroidismo..." },
                { label: "Medicamentos y suplementos actuales", field: "medicamentos", placeholder: "ej: metformina 500mg, omega-3..." },
                { label: "Alergias (alimentarias o medicamentosas)", field: "alergias", placeholder: "ej: gluten, lactosa, mariscos, penicilina..." },
                { label: "Antecedentes familiares relevantes", field: "historialFamiliar", placeholder: "ej: diabetes en padre, enfermedad cardiovascular..." },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="label">{label}</label>
                  <textarea className="input" rows={2} placeholder={placeholder} value={form[field]} onChange={(e) => up(field, e.target.value)} style={{ resize: "vertical" }} />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label className="label">Consumo de tabaco</label>
                  <select className="input" value={form.tabaco} onChange={(e) => up("tabaco", e.target.value)}>
                    {["No", "Exfumador", "Ocasional", "Regular (menos de 10/día)", "Regular (más de 10/día)"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Consumo de alcohol</label>
                  <select className="input" value={form.alcohol} onChange={(e) => up("alcohol", e.target.value)}>
                    {["No consume", "Ocasionalmente", "Fines de semana", "Varios días a la semana", "Diario"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Síntomas digestivos u otros</label>
                <textarea className="input" rows={2} placeholder="ej: hinchazón, acidez frecuente, estreñimiento, fatiga crónica..." value={form.sintomas} onChange={(e) => up("sintomas", e.target.value)} style={{ resize: "vertical" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: HÁBITOS Y PREFERENCIAS ──────────────────────────────── */}
        {step === 4 && (
          <div className="fade-in">
            <div style={{ marginBottom: 32 }}>
              <h2 className="playfair" style={{ fontSize: 32, marginBottom: 8 }}>Hábitos y preferencias</h2>
              <p className="source" style={{ color: "rgba(245,240,232,0.6)" }}>Tu estilo de vida determina el enfoque nutricional más efectivo</p>
            </div>
            <div style={{ display: "grid", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label className="label">Patrón de comidas diario</label>
                  <select className="input" value={form.patronComidas} onChange={(e) => up("patronComidas", e.target.value)}>
                    {["2 comidas al día", "3 comidas principales", "3 comidas + 1 snack", "3 comidas + 2 snacks", "Picoteo constante"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Nivel de actividad física</label>
                  <select className="input" value={form.actividadFisica} onChange={(e) => up("actividadFisica", e.target.value)}>
                    {ACTIVIDAD.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Horas de sueño promedio</label>
                  <select className="input" value={form.sueño} onChange={(e) => up("sueño", e.target.value)}>
                    {["5", "6", "7", "8", "9", "más de 9"].map(h => <option key={h} value={h}>{h} horas</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Nivel de estrés percibido</label>
                  <select className="input" value={form.estres} onChange={(e) => up("estres", e.target.value)}>
                    {["Bajo", "Moderado", "Alto", "Muy alto"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Tipo de ejercicio que practicas</label>
                <input className="input" placeholder="ej: caminata, gym, natación, ciclismo, yoga..." value={form.tipoEjercicio} onChange={(e) => up("tipoEjercicio", e.target.value)} />
              </div>
              <div>
                <label className="label">Recordatorio alimentario — ¿Qué comiste ayer? (24h)</label>
                <textarea className="input" rows={3} placeholder="Desayuno: huevos con pan... Almuerzo: arroz con pollo... Cena: ensalada..." value={form.recordatorio24h} onChange={(e) => up("recordatorio24h", e.target.value)} style={{ resize: "vertical" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label className="label">Preferencias alimentarias</label>
                  <input className="input" placeholder="ej: me encantan las verduras, frutos secos..." value={form.preferencias} onChange={(e) => up("preferencias", e.target.value)} />
                </div>
                <div>
                  <label className="label">Alimentos que quiero evitar</label>
                  <input className="input" placeholder="ej: brócoli, hígado, mariscos..." value={form.evitar} onChange={(e) => up("evitar", e.target.value)} />
                </div>
                <div>
                  <label className="label">Intolerancias confirmadas</label>
                  <input className="input" placeholder="ej: intolerancia a la lactosa, celíaco..." value={form.intolerancias} onChange={(e) => up("intolerancias", e.target.value)} />
                </div>
                <div>
                  <label className="label">Restricciones culturales/religiosas</label>
                  <input className="input" placeholder="ej: halal, kosher, sin cerdo..." value={form.restriccionesCulturales} onChange={(e) => up("restriccionesCulturales", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Motivación principal</label>
                <textarea className="input" rows={2} placeholder="¿Por qué quieres mejorar tu alimentación? ¿Qué te impidió hacerlo antes?" value={form.motivacion} onChange={(e) => up("motivacion", e.target.value)} style={{ resize: "vertical" }} />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: SELECCIÓN DE DIETA ───────────────────────────────────── */}
        {step === 5 && (
          <div className="fade-in">
            <div style={{ marginBottom: 32 }}>
              <h2 className="playfair" style={{ fontSize: 32, marginBottom: 8 }}>Elige tu enfoque dietético</h2>
              <p className="source" style={{ color: "rgba(245,240,232,0.6)" }}>La IA adaptará tu dieta seleccionada a tus condiciones y objetivos específicos</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
              {DIETS.map((diet) => {
                const sel = form.dietaSeleccionada === diet.id;
                return (
                  <div
                    key={diet.id}
                    className="diet-card"
                    onClick={() => up("dietaSeleccionada", diet.id)}
                    style={{
                      background: sel ? `${diet.color}22` : "rgba(255,255,255,0.04)",
                      borderColor: sel ? diet.color : "rgba(255,255,255,0.1)",
                      boxShadow: sel ? `0 0 0 2px ${diet.color}44, 0 8px 24px rgba(0,0,0,0.3)` : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <span style={{ fontSize: 28 }}>{diet.emoji}</span>
                      {sel && <span style={{ fontSize: 18, color: diet.color }}>✓</span>}
                    </div>
                    <div className="playfair" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{diet.name}</div>
                    <div className="source" style={{ fontSize: 12, color: sel ? diet.color : "rgba(245,240,232,0.5)", fontWeight: 600, marginBottom: 8 }}>{diet.tagline}</div>
                    <div className="source" style={{ fontSize: 13, color: "rgba(245,240,232,0.65)", lineHeight: 1.5, marginBottom: 12 }}>{diet.desc}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {diet.tags.map((tag) => (
                        <span key={tag} className="pill source" style={{ background: sel ? `${diet.color}33` : "rgba(255,255,255,0.08)", color: sel ? diet.color : "rgba(245,240,232,0.6)", fontSize: 11 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="source" style={{ fontSize: 11, color: "rgba(245,240,232,0.4)", marginTop: 10, fontStyle: "italic" }}>Ideal para: {diet.ideal}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 6: OBJETIVOS ────────────────────────────────────────────── */}
        {step === 6 && (
          <div className="fade-in">
            <div style={{ marginBottom: 32 }}>
              <h2 className="playfair" style={{ fontSize: 32, marginBottom: 8 }}>¿Cuáles son tus objetivos?</h2>
              <p className="source" style={{ color: "rgba(245,240,232,0.6)" }}>Selecciona todos los que apliquen — la IA los priorizará según tu perfil</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
              {OBJETIVOS.map((obj) => (
                <button key={obj} className={`obj-btn ${form.objetivos.includes(obj) ? "active" : ""}`} onClick={() => toggleObjetivo(obj)}>
                  {form.objetivos.includes(obj) ? "✓ " : ""}{obj}
                </button>
              ))}
            </div>
            {form.objetivos.length > 0 && (
              <div className="card fade-in" style={{ padding: 20, marginBottom: 24, borderColor: "rgba(46,204,113,0.3)" }}>
                <div className="source" style={{ fontSize: 13, color: "#2ECC71", fontWeight: 600, marginBottom: 8 }}>
                  ✓ {form.objetivos.length} objetivo{form.objetivos.length > 1 ? "s" : ""} seleccionado{form.objetivos.length > 1 ? "s" : ""}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {form.objetivos.map((o) => (
                    <span key={o} className="pill source" style={{ background: "rgba(46,204,113,0.15)", color: "#2ECC71", fontSize: 12 }}>{o}</span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="label">Notas adicionales para la IA (opcional)</label>
              <textarea className="input" rows={3} placeholder="Cualquier información relevante que quieras que tenga en cuenta..." value={form.notasExtra} onChange={(e) => up("notasExtra", e.target.value)} style={{ resize: "vertical" }} />
            </div>

            {/* RESUMEN PREVIO */}
            <div className="card" style={{ padding: 24, marginTop: 24 }}>
              <div className="playfair" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#2ECC71" }}>📋 Resumen de tu perfil</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  ["Nombre", form.nombre], ["Edad", `${form.edad} años`],
                  ["Peso / Estatura", `${form.peso}kg / ${form.estatura}cm`],
                  ["IMC", imc ? `${imc} — ${getIMCInfo(parseFloat(imc)).label}` : "No calculado"],
                  ["Dieta base", DIETS.find(d => d.id === form.dietaSeleccionada)?.name || "—"],
                  ["Actividad", form.actividadFisica.split(" ")[0]],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                    <span className="source" style={{ fontSize: 12, color: "rgba(245,240,232,0.4)", minWidth: 80 }}>{k}:</span>
                    <span className="source" style={{ fontSize: 14, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── LOADING ──────────────────────────────────────────────────────── */}
        {loading && (
          <div className="fade-in" style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <div className="spinner" />
            </div>
            <h3 className="playfair" style={{ fontSize: 24, marginBottom: 12, color: "#2ECC71" }}>Creando tu plan personalizado...</h3>
            <p className="source" style={{ color: "rgba(245,240,232,0.6)", maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
              La IA está analizando tu perfil completo, condiciones de salud y selección de dieta para generar un plan nutricional adaptado a ti.
            </p>
            {[
              "Analizando tu IMC y composición corporal...",
              "Adaptando la dieta a tus condiciones de salud...",
              "Diseñando tu menú semanal personalizado...",
              "Calculando macronutrientes óptimos...",
            ].map((msg, i) => (
              <div key={i} className="source" style={{ fontSize: 13, color: "rgba(245,240,232,0.35)", marginTop: 8 }}>
                ✓ {msg}
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 7: RESULTS ──────────────────────────────────────────────── */}
        {step === 7 && planIA && !loading && (
          <div className="fade-in" ref={resultsRef}>
            {/* Header resultado */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <h2 className="playfair" style={{ fontSize: 32, marginBottom: 8 }}>Tu plan NutriAI está listo, {form.nombre.split(" ")[0]}</h2>
              <p className="source" style={{ color: "rgba(245,240,232,0.6)" }}>
                Plan basado en: <strong style={{ color: "#2ECC71" }}>{DIETS.find(d => d.id === form.dietaSeleccionada)?.name}</strong> · Adaptado a tu perfil completo
              </p>
            </div>

            {/* TABS */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {[
                { id: "plan", label: "📊 Mi Plan" },
                { id: "menu", label: "🍽️ Menú Semanal" },
                { id: "recomendaciones", label: "💡 Recomendaciones" },
                { id: "proyeccion", label: "📈 Proyección" },
              ].map(t => (
                <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB: PLAN */}
            {activeTab === "plan" && (
              <div className="fade-in">
                {/* Diagnóstico */}
                <div className="card" style={{ padding: 24, marginBottom: 20 }}>
                  <div className="playfair" style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#2ECC71" }}>🔍 Diagnóstico Nutricional</div>
                  <p className="source" style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(245,240,232,0.85)", marginBottom: 16 }}>
                    {planIA.diagnostico_nutricional?.estado_actual}
                  </p>
                  {imc && (
                    <div style={{ padding: "12px 16px", background: `${getIMCInfo(parseFloat(imc)).bg}22`, borderRadius: 10, marginBottom: 16, borderLeft: `3px solid ${getIMCInfo(parseFloat(imc)).color}` }}>
                      <span className="source" style={{ fontSize: 14, color: getIMCInfo(parseFloat(imc)).color }}>
                        IMC {imc} — {planIA.diagnostico_nutricional?.imc_interpretacion}
                      </span>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <div className="source" style={{ fontSize: 12, color: "#E74C3C", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>⚠ A trabajar</div>
                      {planIA.diagnostico_nutricional?.problemas_identificados?.map((p, i) => (
                        <div key={i} className="source" style={{ fontSize: 13, color: "rgba(245,240,232,0.7)", marginBottom: 6 }}>• {p}</div>
                      ))}
                    </div>
                    <div>
                      <div className="source" style={{ fontSize: 12, color: "#2ECC71", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>✓ Fortalezas</div>
                      {planIA.diagnostico_nutricional?.fortalezas?.map((f, i) => (
                        <div key={i} className="source" style={{ fontSize: 13, color: "rgba(245,240,232,0.7)", marginBottom: 6 }}>• {f}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Plan de dieta */}
                <div className="card" style={{ padding: 24, marginBottom: 20 }}>
                  <div className="playfair" style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#2ECC71" }}>🌿 {planIA.plan_dieta?.nombre}</div>
                  <div className="source" style={{ fontSize: 13, color: "rgba(245,240,232,0.5)", marginBottom: 20 }}>Base: {planIA.plan_dieta?.base_dietetica}</div>

                  {/* Macros */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                    {[
                      { label: "Calorías/día", val: `${planIA.plan_dieta?.calorias_objetivo || "—"} kcal`, color: "#F39C12" },
                      { label: "Proteínas", val: `${planIA.plan_dieta?.distribucion_macros?.proteinas_pct || "—"}%`, color: "#3498DB" },
                      { label: "Carbohidratos", val: `${planIA.plan_dieta?.distribucion_macros?.carbohidratos_pct || "—"}%`, color: "#2ECC71" },
                      { label: "Grasas", val: `${planIA.plan_dieta?.distribucion_macros?.grasas_pct || "—"}%`, color: "#E74C3C" },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="card" style={{ padding: 14, textAlign: "center", borderColor: `${color}33` }}>
                        <div className="playfair" style={{ fontSize: 22, fontWeight: 700, color }}>{val}</div>
                        <div className="source" style={{ fontSize: 11, color: "rgba(245,240,232,0.5)", marginTop: 4 }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <div>
                      <div className="source" style={{ fontSize: 12, color: "#2ECC71", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>⭐ Alimentos estrella</div>
                      {planIA.plan_dieta?.alimentos_estrella?.map((a, i) => (
                        <div key={i} className="source" style={{ fontSize: 13, color: "rgba(245,240,232,0.75)", marginBottom: 5 }}>✓ {a}</div>
                      ))}
                    </div>
                    <div>
                      <div className="source" style={{ fontSize: 12, color: "#E74C3C", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>🚫 Evitar</div>
                      {planIA.plan_dieta?.alimentos_evitar?.map((a, i) => (
                        <div key={i} className="source" style={{ fontSize: 13, color: "rgba(245,240,232,0.75)", marginBottom: 5 }}>✗ {a}</div>
                      ))}
                    </div>
                    <div>
                      <div className="source" style={{ fontSize: 12, color: "#3498DB", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>🔑 Principios</div>
                      {planIA.plan_dieta?.principios_clave?.map((p, i) => (
                        <div key={i} className="source" style={{ fontSize: 13, color: "rgba(245,240,232,0.75)", marginBottom: 5 }}>→ {p}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mensaje motivacional */}
                {planIA.mensaje_motivacional && (
                  <div style={{ padding: 24, background: "linear-gradient(135deg, rgba(46,204,113,0.15), rgba(26,188,156,0.1))", border: "1px solid rgba(46,204,113,0.3)", borderRadius: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>💚</div>
                    <p className="playfair" style={{ fontSize: 18, fontStyle: "italic", color: "rgba(245,240,232,0.9)", lineHeight: 1.6 }}>
                      "{planIA.mensaje_motivacional}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: MENÚ SEMANAL */}
            {activeTab === "menu" && (
              <div className="fade-in">
                <div style={{ display: "grid", gap: 16 }}>
                  {planIA.menu_semanal?.map((dia, i) => (
                    <div key={i} className="day-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div className="playfair" style={{ fontSize: 18, fontWeight: 700, color: "#2ECC71" }}>{dia.dia}</div>
                        <div className="pill source" style={{ background: "rgba(46,204,113,0.15)", color: "#2ECC71", fontSize: 13 }}>
                          {dia.total_calorias} kcal
                        </div>
                      </div>
                      {dia.comidas?.map((comida, j) => (
                        <div key={j} className="meal-row">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                              <span className="pill source" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(245,240,232,0.6)", fontSize: 11 }}>
                                {comida.tipo}
                              </span>
                              <span className="source" style={{ fontSize: 13, color: "rgba(245,240,232,0.4)" }}>{comida.calorias} kcal</span>
                            </div>
                            <span className="source" style={{ fontSize: 11, color: "rgba(245,240,232,0.35)" }}>{comida.macros}</span>
                          </div>
                          <div className="source" style={{ fontSize: 14, color: "rgba(245,240,232,0.8)", lineHeight: 1.5 }}>{comida.descripcion}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: RECOMENDACIONES */}
            {activeTab === "recomendaciones" && (
              <div className="fade-in">
                {[
                  { title: "🥦 Recomendaciones Nutricionales", items: planIA.recomendaciones?.nutricionales, color: "#2ECC71" },
                  { title: "🌟 Cambios de Hábitos", items: planIA.recomendaciones?.habitos, color: "#F39C12" },
                  { title: "🏃 Ejercicio y Movimiento", items: planIA.recomendaciones?.ejercicio, color: "#3498DB" },
                ].map(({ title, items, color }) => (
                  <div key={title} className="card" style={{ padding: 24, marginBottom: 16 }}>
                    <div className="playfair" style={{ fontSize: 18, fontWeight: 700, color, marginBottom: 16 }}>{title}</div>
                    {items?.map((r, i) => (
                      <div key={i} className="rec-item">
                        <span style={{ color, fontSize: 16 }}>→</span>
                        <span className="source" style={{ fontSize: 14, color: "rgba(245,240,232,0.8)", lineHeight: 1.6 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                ))}
                {planIA.recomendaciones?.hidratacion && (
                  <div style={{ padding: 20, background: "rgba(52,152,219,0.1)", border: "1px solid rgba(52,152,219,0.3)", borderRadius: 12 }}>
                    <div className="playfair" style={{ fontSize: 16, fontWeight: 700, color: "#3498DB", marginBottom: 8 }}>💧 Hidratación</div>
                    <p className="source" style={{ fontSize: 14, color: "rgba(245,240,232,0.8)", lineHeight: 1.6 }}>{planIA.recomendaciones?.hidratacion}</p>
                  </div>
                )}
                {planIA.suplementos_sugeridos?.length > 0 && (
                  <div className="card" style={{ padding: 24, marginTop: 16 }}>
                    <div className="playfair" style={{ fontSize: 18, fontWeight: 700, color: "#9B59B6", marginBottom: 16 }}>💊 Suplementos sugeridos</div>
                    {planIA.suplementos_sugeridos.map((s, i) => (
                      <div key={i} className="rec-item">
                        <span style={{ color: "#9B59B6", fontSize: 16 }}>→</span>
                        <span className="source" style={{ fontSize: 14, color: "rgba(245,240,232,0.8)" }}>{s}</span>
                      </div>
                    ))}
                    <p className="source" style={{ fontSize: 12, color: "rgba(245,240,232,0.4)", marginTop: 12, fontStyle: "italic" }}>
                      ⚕️ Consulta con tu médico antes de iniciar cualquier suplementación.
                    </p>
                  </div>
                )}
                {planIA.advertencias_medicas?.length > 0 && (
                  <div style={{ padding: 16, background: "rgba(231,76,60,0.1)", border: "1px solid rgba(231,76,60,0.3)", borderRadius: 12, marginTop: 16 }}>
                    <div className="playfair" style={{ fontSize: 16, fontWeight: 700, color: "#E74C3C", marginBottom: 8 }}>⚠️ Advertencias médicas</div>
                    {planIA.advertencias_medicas.map((a, i) => (
                      <div key={i} className="source" style={{ fontSize: 13, color: "rgba(245,240,232,0.75)", marginBottom: 4 }}>• {a}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROYECCIÓN */}
            {activeTab === "proyeccion" && (
              <div className="fade-in">
                <div className="card" style={{ padding: 28, marginBottom: 20, textAlign: "center" }}>
                  <div className="source" style={{ fontSize: 12, color: "rgba(245,240,232,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Meta estimada</div>
                  <div className="playfair" style={{ fontSize: 48, fontWeight: 900, color: "#2ECC71", marginBottom: 4 }}>
                    {planIA.proyeccion?.meta_peso}
                  </div>
                  <div className="source" style={{ fontSize: 16, color: "rgba(245,240,232,0.6)" }}>{planIA.proyeccion?.tiempo_estimado}</div>
                  <hr className="section-divider" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <div className="source" style={{ fontSize: 13, color: "rgba(245,240,232,0.4)" }}>Pérdida semanal estimada</div>
                      <div className="playfair" style={{ fontSize: 24, fontWeight: 700, color: "#F39C12", marginTop: 4 }}>{planIA.proyeccion?.perdida_semanal}</div>
                    </div>
                    <div>
                      <div className="source" style={{ fontSize: 13, color: "rgba(245,240,232,0.4)" }}>Dieta base</div>
                      <div className="playfair" style={{ fontSize: 20, fontWeight: 700, color: "#2ECC71", marginTop: 4 }}>
                        {DIETS.find(d => d.id === form.dietaSeleccionada)?.name}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card" style={{ padding: 24 }}>
                  <div className="playfair" style={{ fontSize: 18, fontWeight: 700, color: "#2ECC71", marginBottom: 20 }}>🏁 Hitos del camino</div>
                  {planIA.proyeccion?.hitos?.map((hito, i) => (
                    <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(46,204,113,0.2)", border: "2px solid #2ECC71", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span className="source" style={{ fontSize: 13, fontWeight: 700, color: "#2ECC71" }}>{i + 1}</span>
                      </div>
                      <div className="source" style={{ fontSize: 14, color: "rgba(245,240,232,0.8)", lineHeight: 1.6, paddingTop: 6 }}>{hito}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón nuevo plan */}
            <div style={{ textAlign: "center", marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <button className="btn-sec" onClick={() => { setStep(0); setPlanIA(null); setForm(f => ({ ...f, objetivos: [] })); }}>
                🔄 Crear un nuevo plan
              </button>
            </div>
          </div>
        )}

        {/* ── NAVIGATION BUTTONS ───────────────────────────────────────────── */}
        {step > 0 && step < 7 && !loading && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <button className="btn-sec" onClick={() => setStep(s => s - 1)}>
              ← Anterior
            </button>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[1, 2, 3, 4, 5, 6].map(s => (
                <div key={s} style={{ width: 8, height: 8, borderRadius: "50%", background: s === step ? "#2ECC71" : s < step ? "rgba(46,204,113,0.4)" : "rgba(255,255,255,0.15)", transition: "all 0.3s" }} />
              ))}
            </div>
            {step < 6 ? (
              <button className="btn-primary" disabled={!canNext()} onClick={() => setStep(s => s + 1)}>
                Siguiente →
              </button>
            ) : (
              <button className="btn-primary" disabled={!canNext() || loading} onClick={generarPlan}>
                {loading ? "Generando..." : "🤖 Generar mi plan con IA"}
              </button>
            )}
          </div>
        )}

        {error && (
          <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(231,76,60,0.15)", border: "1px solid rgba(231,76,60,0.4)", borderRadius: 10 }}>
            <span className="source" style={{ fontSize: 14, color: "#E74C3C" }}>{error}</span>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "24px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 40 }}>
        <p className="source" style={{ fontSize: 12, color: "rgba(245,240,232,0.3)", lineHeight: 1.6 }}>
          NutriAI Coach · Plan personalizado con IA · Este plan es orientativo y no reemplaza la consulta con un profesional de la salud
        </p>
      </div>
    </div>
  );
}
