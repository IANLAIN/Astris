import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://oupbptgzfevkzzvscekj.supabase.co",
  "sb_publishable_Obya200r1UbgWVnMbuhhiw_Xto1ETSE"
);

async function seed() {
  console.log("Starting seed process...");

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

    const { error: vacErr1 } = await supabase.from("vacancies").insert({
      company_id: veritasId,
      title: "Analista de Datos Junior",
      description: "Análisis de bases de datos, generación de reportes y visualización de métricas clave.",
      status: "active"
    }).select();
    if (vacErr1) {
        const compInfo = await supabase.from("companies").select("id").eq("user_id", veritasId).single();
        if (compInfo.data) {
            const { error: vacRetry } = await supabase.from("vacancies").insert({
                company_id: compInfo.data.id,
                title: "Analista de Datos Junior",
                description: "Análisis de bases de datos, generación de reportes y visualización de métricas clave.",
                status: "active"
            });
            if (vacRetry) console.error("Error inserting vacancy 1 (retry):", vacRetry);
            else console.log("Vacancy 1 created via retry.");
        }
    } else {
        console.log("Vacancy 1 created.");
    }
  }
  
  await supabase.auth.signOut();

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
    else console.log("Forma company profile saved.");

    const compInfo = await supabase.from("companies").select("id").eq("user_id", formaId).single();
    if (compInfo.data) {
        const { error: vac2 } = await supabase.from("vacancies").insert({
            company_id: compInfo.data.id,
            title: "Diseñadora UX",
            description: "Diseño de experiencias digitales para clientes de salud y educación. 3 días remoto, 2 en oficina con escritorio individual.",
            status: "active"
        });
        if (vac2) console.error("Error inserting vacancy 2:", vac2);
        else console.log("Vacancy 2 created.");
    }
  }

  await supabase.auth.signOut();

  console.log("Seed process completed.");
}

seed();
