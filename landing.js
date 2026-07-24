const API_BASE = window.SITE_CONFIG?.apiBase || "https://site-casamento-backend-nrfb.onrender.com";

const form = document.getElementById("form-checkout");
const msg = document.getElementById("msg-checkout");
const btn = document.getElementById("btn-checkout");
const btnNext = document.getElementById("btn-step-next");
const btnBack = document.getElementById("btn-step-back");
const slugInput = document.getElementById("slug");
const cpfInput = document.getElementById("cpf");
const step1 = form?.querySelector('[data-step="1"]');
const step2 = form?.querySelector('[data-step="2"]');
const progressSteps = form?.querySelectorAll("[data-progress]");

function setCheckoutStep(step) {
    const onFirst = step === 1;
    step1?.classList.toggle("is-active", onFirst);
    step2?.classList.toggle("is-active", !onFirst);
    if (step1) step1.hidden = !onFirst;
    if (step2) step2.hidden = onFirst;
    if (cpfInput) {
        cpfInput.disabled = onFirst;
        cpfInput.required = !onFirst;
    }
    progressSteps?.forEach((el) => {
        el.classList.toggle("is-active", Number(el.dataset.progress) === step);
    });
    if (onFirst && msg) {
        msg.className = "msg";
        msg.textContent = "";
    }
}

setCheckoutStep(1);

(() => {
    const els = document.querySelectorAll(".revelar");
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        els.forEach((el) => el.classList.add("is-visible"));
        return;
    }
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
})();

slugInput?.addEventListener("input", () => {
    slugInput.value = slugInput.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9-]/g, "");
});

cpfInput?.addEventListener("input", () => {
    const d = cpfInput.value.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 3) cpfInput.value = d;
    else if (d.length <= 6) cpfInput.value = `${d.slice(0, 3)}.${d.slice(3)}`;
    else if (d.length <= 9) cpfInput.value = `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    else cpfInput.value = `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
});

btnNext?.addEventListener("click", () => {
    const fields = step1?.querySelectorAll("input[required]");
    for (const field of fields || []) {
        if (!field.reportValidity()) return;
    }
    setCheckoutStep(2);
    cpfInput?.focus();
});

btnBack?.addEventListener("click", () => setCheckoutStep(1));

form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (step2?.hidden) {
        setCheckoutStep(2);
        return;
    }

    msg.className = "msg";
    msg.textContent = "Preparando checkout do cartão...";
    btn.disabled = true;

    const emailPainel = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf")?.value.replace(/\D/g, "") || "";
    if (cpf.length !== 11) {
        msg.className = "msg erro";
        msg.textContent = "Informe um CPF válido (11 dígitos).";
        btn.disabled = false;
        return;
    }

    const body = {
        nomeNoiva: document.getElementById("nomeNoiva").value.trim(),
        nomeNoivo: document.getElementById("nomeNoivo").value.trim(),
        slug: document.getElementById("slug").value.trim(),
        email: emailPainel,
        cpf,
        senha: document.getElementById("senha").value,
        plano: "trial"
    };

    try {
        const res = await fetch(`${API_BASE}/api/assinatura/checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const texto = await res.text();
        let data;
        try { data = JSON.parse(texto); } catch { data = texto; }

        if (!res.ok) {
            throw new Error(typeof data === "string" ? data : (data.message || "Erro no checkout"));
        }

        msg.className = "msg ok";
        msg.textContent = data.mensagem || "Redirecionando para cadastrar o cartão...";
        if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
        } else {
            throw new Error("Checkout sem URL. Verifique a configuração do Asaas.");
        }
    } catch (err) {
        msg.className = "msg erro";
        msg.textContent = err.message || "Falha ao iniciar o checkout.";
        btn.disabled = false;
    }
});

fetch(`${API_BASE}/api/assinatura/plano`)
    .then((r) => (r.ok ? r.json() : null))
    .then((plano) => {
        if (!plano) return;
        if (plano.asaasConfigurado === false || plano.mpConfigurado === false) {
            setCheckoutStep(2);
            msg.className = "msg erro";
            msg.textContent = "Checkout em configuração: falta a chave do Asaas no servidor.";
            if (btn) btn.disabled = true;
            if (btnNext) btnNext.disabled = true;
        }
        if (plano.modoTeste === true) {
            const aviso = document.createElement("p");
            aviso.className = "msg";
            aviso.style.color = "#8a5a00";
            aviso.style.background = "#fff6e5";
            aviso.style.padding = "10px 12px";
            aviso.style.borderRadius = "8px";
            aviso.style.marginBottom = "12px";
            aviso.textContent = "Modo sandbox Asaas ativo. Use cartão de teste — nenhum valor real será cobrado.";
            form?.prepend(aviso);
        }
    })
    .catch(() => {});
