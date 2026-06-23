import { supabase } from "./supabase";

async function seed() {
  console.log("Starting seed process...");

  // 1. Create Veritas Analytics
  console.log("Creating Veritas Analytics...");
  let { data: veritasAuth, error: err1 } = await supabase.auth.signUp({
    email: "veritas@astris.com",
    password: "Password123",
    options: { data: { role: "company", full_name: "Veritas Analytics" } }
  });
  
  if (err1 && err1.message.includes("already registered")) {
    console.log("Veritas already exists, logging in...");
    const res = await supabase.auth.signInWithPassword({ email: "veritas@astris.com", password: "Password123" });
    veritasAuth = res.data;
  } else if (err1) {
    console.error("Error creating Veritas Auth:", err1);
  }

  if (veritasAuth?.user) {
    const veritasId = veritasAuth.user.id;
    const { error: compErr } = await supabase.from("companies").upsert({
      user_id: veritasId,
      company_name: "Veritas Analytics",
      industry: "Tecnología",
      company_size: "6",
      country: "Global",
      city: "Remoto",
      philosophy: "Empresa de análisis de datos con 7 años en el mercado. Cultura de trabajo orientada a resultados, no a presencia.",
      work_environment: JSON.stringify({
        noise: "Ambiente de trabajo tranquilo",
        light: "Natural",
        layout: "Remoto",
        policies: ["Flexibilidad de horario", "Comunicación asíncrona"],
        company_size: "6",
        country: "Global",
        city: "Remoto"
      }),
      accommodations: ["100% remoto", "Comunicación asíncrona", "Horario flexible", "Instrucciones escritas"]
    });
    if (compErr) console.error("Error upserting Veritas company:", compErr);
    else console.log("Veritas Analytics company profile saved.");

    // Insert Vacancy 1
    const { error: vacErr1 } = await supabase.from("vacancies").insert({
      company_id: veritasId, // Assuming company_id is the user_id or linked. Wait, companies table usually has id as UUID. We'll find out!
      title: "Analista de Datos Junior",
      description: "Análisis de bases de datos, generación de reportes y visualización de métricas clave.",
      status: "active",
      // requirements/adjustments might not strictly match, but we will try.
    }).select();
    if (vacErr1) {
        // If it fails because company_id is not user_id, let's get the company.id
        const compInfo = await supabase.from("companies").select("id").eq("user_id", veritasId).single();
        if (compInfo.data) {
            const { error: vacRetry } = await supabase.from("vacancies").insert({
                company_id: compInfo.data.id,
                title: "Analista de Datos Junior",
                description: "Análisis de bases de datos, generación de reportes y visualización de métricas clave."
            });
            if (vacRetry) console.error("Error inserting vacancy 1 (retry):", vacRetry);
            else console.log("Vacancy 1 created via retry.");
        }
    } else {
        console.log("Vacancy 1 created.");
    }
  }
  
  await supabase.auth.signOut();

  // 2. Create Forma Studio
  console.log("Creating Forma Studio...");
  let { data: formaAuth, error: err2 } = await supabase.auth.signUp({
    email: "forma@astris.com",
    password: "Password123",
    options: { data: { role: "company", full_name: "Forma Studio" } }
  });
  
  if (err2 && err2.message.includes("already registered")) {
    const res = await supabase.auth.signInWithPassword({ email: "forma@astris.com", password: "Password123" });
    formaAuth = res.data;
  }

  if (formaAuth?.user) {
    const formaId = formaAuth.user.id;
    const { error: compErr2 } = await supabase.from("companies").upsert({
      user_id: formaId,
      company_name: "Forma Studio",
      industry: "Diseño",
      company_size: "45",
      philosophy: "Estudio de diseño boutique con enfoque en accesibilidad digital.",
      work_environment: JSON.stringify({
        company_size: "45",
        layout: "Escritorio individual",
      }),
      accommodations: ["Espacio de trabajo tranquilo", "Briefs escritos", "Evaluación por entregables"]
    });
    if (compErr2) console.error("Error upserting Forma company:", compErr2);

    const compInfo = await supabase.from("companies").select("id").eq("user_id", formaId).single();
    if (compInfo.data) {
        const { error: vac2 } = await supabase.from("vacancies").insert({
            company_id: compInfo.data.id,
            title: "Diseñadora UX",
            description: "Diseño de experiencias digitales para clientes de salud y educación. 3 días remoto, 2 en oficina con escritorio individual."
        });
        if (vac2) console.error("Error inserting vacancy 2:", vac2);
        else console.log("Vacancy 2 created.");
    }
  }

  await supabase.auth.signOut();

  // 3. Mentors
  console.log("Creating Mentor 1...");
  let { data: mentorAuth1, error: err3 } = await supabase.auth.signUp({
    email: "carmen.ruiz@astris.com",
    password: "Password123",
    options: { data: { role: "mentor", full_name: "Carmen Ruiz" } }
  });
  if (err3 && err3.message.includes("already registered")) {
    const res = await supabase.auth.signInWithPassword({ email: "carmen.ruiz@astris.com", password: "Password123" });
    mentorAuth1 = res.data;
  }

  if (mentorAuth1?.user) {
    const { error: mErr1 } = await supabase.from("mentors").upsert({
      user_id: mentorAuth1.user.id,
      full_name: "Carmen Ruiz",
      specialty: "Inclusión laboral y funciones ejecutivas",
      years_experience: 8,
      modality: "Virtual",
      bio: "Psicóloga organizacional especializada en estrategias de inserción laboral para perfiles con estilos cognitivos diversos. Certificada en acompañamiento de transiciones profesionales."
    });
    if (mErr1) console.error("Error upserting mentor 1:", mErr1);
    else console.log("Mentor 1 created.");
  }
  await supabase.auth.signOut();

  console.log("Creating Mentor 2...");
  let { data: mentorAuth2, error: err4 } = await supabase.auth.signUp({
    email: "david.morales@astris.com",
    password: "Password123",
    options: { data: { role: "mentor", full_name: "David Morales" } }
  });
  if (err4 && err4.message.includes("already registered")) {
    const res = await supabase.auth.signInWithPassword({ email: "david.morales@astris.com", password: "Password123" });
    mentorAuth2 = res.data;
  }
  if (mentorAuth2?.user) {
    const { error: mErr2 } = await supabase.from("mentors").upsert({
      user_id: mentorAuth2.user.id,
      full_name: "David Morales",
      specialty: "Aprendizaje adaptativo en entornos corporativos",
      years_experience: 5,
      modality: "Presencial y virtual",
      bio: "Consultor de inclusión con experiencia en mediación empresa-candidato. Ha acompañado más de 60 procesos de contratación adaptativa exitosos."
    });
    if (mErr2) console.error("Error upserting mentor 2:", mErr2);
    else console.log("Mentor 2 created.");
  }
  await supabase.auth.signOut();

  console.log("Seed process completed.");
}

seed();
