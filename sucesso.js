const API_BASE = window.SITE_CONFIG?.apiBase || "https://site-casamento-backend-nrfb.onrender.com";

const params = new URLSearchParams(window.location.search);
const paymentId = params.get("payment_id") || params.get("collection_id") || "";
const externalReference = params.get("external_reference") || "";
const status = (params.get("collection_status") || params.get("status") || "").toLowerCase();

const titulo = document.getElementById("titulo");
const texto = document.getElementById("texto");
const btnMensalidade = document.getElementById("btn-mensalidade");
const msg = document.getElementById("msg");

async function iniciarMensalidade() {
    if (!paymentId && !externalReference) {
        titulo.textContent = "Quase lá";
        texto.textContent = "Se o pagamento dos R$ 99 foi aprovado, entre no painel. A mensalidade pode ser autorizada em seguida.";
        return;
    }

    if (status && status !== "approved" && status !== "pending") {
        titulo.textContent = "Pagamento não concluído";
        texto.textContent = "Não encontramos um pagamento aprovado. Você pode tentar de novo na landing.";
        return;
    }

    msg.className = "msg";
    msg.textContent = "Gerando link da mensalidade…";

    try {
        const res = await fetch(`${API_BASE}/api/assinatura/mensalidade`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, externalReference })
        });
        const textoRes = await res.text();
        let data;
        try { data = JSON.parse(textoRes); } catch { data = textoRes; }

        if (!res.ok) {
            throw new Error(typeof data === "string" ? data : (data.message || "Erro ao gerar mensalidade"));
        }

        titulo.textContent = "Site liberado!";
        texto.textContent = data.mensagem
            || "Agora autorize a cobrança mensal de R$ 49,90. A primeira cobrança só no 2º mês.";

        if (data.mensalidadeCheckoutUrl) {
            btnMensalidade.hidden = false;
            btnMensalidade.href = data.mensalidadeCheckoutUrl;
            msg.className = "msg ok";
            msg.textContent = "Redirecionando para autorizar a mensalidade…";
            setTimeout(() => {
                window.location.href = data.mensalidadeCheckoutUrl;
            }, 1800);
        } else if (data.mensalidadeStatus === "authorized") {
            msg.className = "msg ok";
            msg.textContent = "Mensalidade já autorizada. Pode usar o painel.";
        } else {
            msg.className = "msg erro";
            msg.textContent = "Não veio o link da mensalidade. Verifique se a aplicação do MP tem o produto Assinaturas.";
        }
    } catch (err) {
        titulo.textContent = "Pagamento recebido";
        texto.textContent = "Se o Mercado Pago confirmou os R$ 99, seu site será liberado. A mensalidade pode precisar de um passo a mais.";
        msg.className = "msg erro";
        msg.textContent = err.message || "Falha ao gerar mensalidade.";
    }
}

iniciarMensalidade();
