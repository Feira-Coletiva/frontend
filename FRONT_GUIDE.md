# 🌐 Estrutura de Pastas - Frontend

## 📁 Estrutura Recomendada

```bash
frontend/
│
├── index.html                      # Página inicial
├── login.html                      # Outras páginas principais...
│
├── assets/                         # Arquivos estáticos (CSS, JS, imagens)
│   ├── css/
│   │   ├── style.css               # Estilos globais
│   │   ├── reset.css               # Reset de estilos (opcional)
│   │   └── [tela].css              # Estilos específicos por tela
│   │
│   ├── js/
│   │   ├── main.js                 # JS principal / inicialização
│   │   ├── api.js                  # Comunicação com a API (fetch)
│   │   ├── utils.js                # Funções utilitárias
│   │   └── controllers/
│   │       ├── loginController.js
│   │       ├── cadastroController.js
│   │       └── ...                 # Um controller por tela ou funcionalidade
│   │
│   └── img/
│       ├── logo.png
│       └── ...                     # Imagens do sistema
│
├── pages/                          # Telas separadas (HTML)
│   ├── dashboard.html
│   ├── cadastroCliente.html
│   └── ...
│
└── README.md                       # Explicação da estrutura (este arquivo)
```
