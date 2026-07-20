const API_BASE = window.SITE_CONFIG?.apiBase || "https://site-casamento-backend-nrfb.onrender.com";

const form = document.getElementById("form-checkout");
const msg = document.getElementById("msg-checkout");
const btn = document.getElementById("btn-checkout");
const slugInput = document.getElementById("slug");

slugInput?.addEventListener("input", () => {
    slugInput.value = slugInput.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9-]/g, "");
});

form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "msg";
    msg.textContent = "Gerando checkout...";
    btn.disabled = true;

    const emailPainel = document.getElementById("email").value.trim();
    const emailPagador = document.getElementById("emailPagador")?.value.trim() || "";
    const body = {
        nomeNoiva: document.getElementById("nomeNoiva").value.trim(),
        nomeNoivo: document.getElementById("nomeNoivo").value.trim(),
        slug: document.getElementById("slug").value.trim(),
        email: emailPainel,
        emailPagador: emailPagador || emailPainel,
        senha: document.getElementById("senha").value
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
        msg.textContent = data.mensagem || "Redirecionando ao Mercado Pago...";
        if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
        } else {
            throw new Error("Checkout sem URL. Verifique a configuração do Mercado Pago.");
        }
    } catch (err) {
        msg.className = "msg erro";
        msg.textContent = err.message || "Falha ao iniciar o pagamento.";
        btn.disabled = false;
    }
});

// Carrega valores do plano (opcional)
fetch(`${API_BASE}/api/assinatura/plano`)
    .then(r => r.ok ? r.json() : null)
    .then(plano => {
        if (!plano) return;
        if (plano.mpConfigurado === false) {
            msg.className = "msg erro";
            msg.textContent = "Checkout em configuração: falta o token do Mercado Pago no servidor.";
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
            aviso.textContent = "Modo teste ativo (TOKEN TEST-). Use usuários e cartões de teste do Mercado Pago — nenhum valor real será cobrado.";
            form?.prepend(aviso);
        }
    })
    .catch(() => {});
