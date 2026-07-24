const API_BASE = window.SITE_CONFIG?.apiBase || "https://site-casamento-backend-nrfb.onrender.com";

const form = document.getElementById("form-checkout");
const msg = document.getElementById("msg-checkout");
const btn = document.getElementById("btn-checkout");
const slugInput = document.getElementById("slug");
const cpfInput = document.getElementById("cpf");
const planoInput = document.getElementById("plano");
const planoLabel = document.getElementById("plano-label");
const termos = document.getElementById("termos-checkout");

const TEXTOS = {
    trial: {
        label: "Teste grátis — 14 dias",
        termos: "No teste grátis, você cadastra o cartão agora e a 1ª cobrança de R$ 59,90 acontece no 15º dia. Cancele quando quiser.",
        botao: "Cadastrar cartão e começar"
    },
    mensal: {
        label: "Mensal — R$ 59,90",
        termos: "Assinatura mensal de R$ 59,90 no cartão. Sem fidelidade — cancele quando quiser.",
        botao: "Assinar com cartão"
    }
};

function setPlano(plano) {
    const p = plano === "mensal" ? "mensal" : "trial";
    if (planoInput) planoInput.value = p;
    document.querySelectorAll(".plano-chip").forEach((el) => {
        el.classList.toggle("is-active", el.dataset.plano === p);
    });
    document.querySelectorAll(".plano-card").forEach((el) => {
        el.classList.toggle("is-selected", el.dataset.plano === p);
    });
    const t = TEXTOS[p];
    if (planoLabel) planoLabel.textContent = t.label;
    if (termos) termos.textContent = t.termos;
    if (btn) btn.textContent = t.botao;
}

document.querySelectorAll("[data-escolher-plano]").forEach((el) => {
    el.addEventListener("click", () => setPlano(el.dataset.escolherPlano));
});
document.querySelectorAll(".plano-chip").forEach((el) => {
    el.addEventListener("click", () => setPlano(el.dataset.plano));
});

setPlano(planoInput?.value || "trial");

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

form?.addEventListener("submit", async (e) => {
    e.preventDefault();
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
        plano: planoInput?.value || "trial"
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
            msg.className = "msg erro";
            msg.textContent = "Checkout em configuração: falta a chave do Asaas no servidor.";
            btn.disabled = true;
        }
        if (plano.modoTeste === true) {
            const aviso = document.createElement("p");
            aviso.className = "msg";
            aviso.style.color = "#8a5a00";
            aviso.style.background = "#fff6e5";
            aviso.style.padding = "10px 12px";
            aviso.style.borderRadius = "8px";
            aviso.style.marginTop = "12px";
            aviso.textContent = "Modo sandbox Asaas ativo. Use cartão de teste — nenhum valor real será cobrado.";
            form?.prepend(aviso);
        }
    })
    .catch(() => {});
