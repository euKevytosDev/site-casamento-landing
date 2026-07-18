# Landing — Site de Casamento (RK Sites)

Landing de venda do produto (checkout R$ 99 + demo).

## URL (GitHub Pages)

https://eukevytosdev.github.io/site-casamento-landing/

Depois você pode apontar um domínio próprio (ex.: `sites.seudominio.com`) em **Settings → Pages → Custom domain**.

## API

O checkout chama o backend no Render:

`https://site-casamento-backend-nrfb.onrender.com`

## O que configurar no Render (você)

No serviço do backend, defina:

```text
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_NOTIFICATION_URL=https://site-casamento-backend-nrfb.onrender.com/api/webhooks/mercadopago
MERCADOPAGO_BACK_URL_SUCCESS=https://eukevytosdev.github.io/site-casamento-landing/sucesso.html
MERCADOPAGO_BACK_URL_FAILURE=https://eukevytosdev.github.io/site-casamento-landing/
```

Sem o token do Mercado Pago, o formulário de checkout fica bloqueado na landing.
