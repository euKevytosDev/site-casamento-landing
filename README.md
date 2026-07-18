# Landing — Site de Casamento (RK Sites)

Landing de venda do produto (checkout R$ 99 + demo).

## URL (GitHub Pages)

https://eukevytosdev.github.io/site-casamento-landing/

Depois você pode apontar um domínio próprio (ex.: `sites.seudominio.com`) em **Settings → Pages → Custom domain**.

## Fluxo de pagamento

1. Landing → Checkout Pro **R$ 99** (criação + 1º mês)
2. Página de sucesso → gera link de **Assinatura** R$ 49,90/mês (cobrança a partir do 2º mês)
3. Casal autoriza o cartão no Mercado Pago

## API

O checkout chama o backend no Render:

`https://site-casamento-backend-nrfb.onrender.com`

## O que configurar no Render

```text
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_NOTIFICATION_URL=https://site-casamento-backend-nrfb.onrender.com/api/webhooks/mercadopago
MERCADOPAGO_BACK_URL_SUCCESS=https://eukevytosdev.github.io/site-casamento-landing/sucesso.html
MERCADOPAGO_BACK_URL_FAILURE=https://eukevytosdev.github.io/site-casamento-landing/
```

No painel do Mercado Pago Developers, a aplicação precisa ter **Checkout Pro** e **Assinaturas**.
