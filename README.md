# 🎮 DMHUB Integration - Módulo para Foundry VTT

## 📋 Descrição

O **DMHUB Integration** é um módulo completo para Foundry VTT que fornece integração bidirecional com o sistema DMHUB, permitindo sincronização automática de personagens, mundos e dados de campanha.

## ✨ Funcionalidades

### 🔌 **API REST Completa**
- **`/api/dmhub/status`** - Status da integração
- **`/api/dmhub/actors`** - Lista de personagens
- **`/api/dmhub/actors/{id}`** - Dados de personagem específico
- **`/api/dmhub/worlds`** - Informações do mundo
- **`/api/dmhub/sync`** - Sincronização manual
- **`/api/dmhub/config`** - Configurações do módulo
- **`/api/dmhub/webhook`** - Handler de webhooks

### 🔄 **Sincronização Automática**
- Sincronização em tempo real de mudanças
- Configurável por tipo de dado (personagens, mundo, itens)
- Intervalo de sincronização personalizável
- Cache local para performance

### 🌐 **Webhooks Inteligentes**
- Notificações automáticas para o DMHUB
- Eventos configuráveis (criação, atualização, remoção)
- Autenticação via API key
- Retry automático em caso de falha

### ⚙️ **Interface de Configuração**
- Painel de configuração integrado
- Teste de conexão em tempo real
- Modo debug para troubleshooting
- Configurações por mundo

## 🚀 Instalação

### **Método 1: Instalação Manual**

1. **Baixar o módulo:**
   - Clone ou baixe este repositório
   - Extraia para a pasta `modules` do Foundry VTT

2. **Estrutura de pastas:**
   ```
   modules/
   └── dmhub-integration/
       ├── module.json
       ├── scripts/
       │   ├── dmhub-api.js
       │   ├── dmhub-config.js
       │   ├── dmhub-sync.js
       │   └── dmhub-webhook.js
       ├── styles/
       │   └── dmhub.css
       └── README.md
   ```

3. **Ativar o módulo:**
   - No Foundry VTT, vá em "Add-on Modules"
   - Ative "DMHUB Integration"
   - Configure as opções

### **Método 2: Instalação via Manifest**

1. **No Foundry VTT:**
   - Vá em "Add-on Modules"
   - Clique em "Install Module"
   - Cole a URL do manifest:
   ```
   https://raw.githubusercontent.com/dmhub/foundry-integration/main/module.json
   ```

2. **Instalar e ativar:**
   - Clique em "Install"
   - Ative o módulo na lista

## ⚙️ Configuração

### **1. Configurações Básicas**

- **Enable Integration**: Ativar/desativar o módulo
- **API Key**: Chave de autenticação do DMHUB
- **Webhook URL**: URL para notificações do DMHUB

### **2. Configurações de Sincronização**

- **Auto Sync**: Sincronização automática
- **Sync Interval**: Intervalo entre sincronizações
- **Sync Options**: Tipos de dados para sincronizar

### **3. Configurações Avançadas**

- **Debug Mode**: Logs detalhados para troubleshooting
- **Webhook Events**: Eventos específicos para notificar

## 🔧 Uso

### **Configuração Inicial**

1. **Instalar e ativar** o módulo
2. **Configurar** API key e webhook URL
3. **Testar conexão** com o DMHUB
4. **Ajustar** configurações de sincronização

### **Endpoints da API**

#### **Status da Integração**
```bash
GET /api/dmhub/status
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "module": "dmhub-integration",
    "version": "1.0.0",
    "status": "active",
    "world": "pandemonium",
    "system": "dnd5e",
    "actors_count": 15,
    "users_count": 3,
    "timestamp": 1640995200000
  }
}
```

#### **Lista de Personagens**
```bash
GET /api/dmhub/actors
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "actor-001",
      "name": "Gandalf",
      "type": "character",
      "system": "dnd5e",
      "img": "path/to/image.jpg",
      "folder": "PCs",
      "created": 1640995200000,
      "updated": 1640995200000
    }
  ],
  "count": 1
}
```

#### **Personagem Específico**
```bash
GET /api/dmhub/actors/{id}
```

#### **Sincronização Manual**
```bash
POST /api/dmhub/sync
Content-Type: application/json

{
  "type": "actors",
  "data": [
    {
      "id": "actor-001",
      "changes": {
        "system.attributes.hp.value": 25
      }
    }
  ]
}
```

### **Webhooks**

O módulo envia automaticamente webhooks para o DMHUB quando:

- **Personagens são criados/atualizados/removidos**
- **Mundo é atualizado**
- **Itens são modificados**

**Formato do Webhook:**
```json
{
  "event": "actor_updated",
  "data": {
    "actor": { ... },
    "changes": { ... },
    "userId": "user-001"
  },
  "timestamp": 1640995200000,
  "world_id": "pandemonium",
  "module_version": "1.0.0"
}
```

## 🛠️ Desenvolvimento

### **Estrutura do Código**

- **`dmhub-api.js`**: Endpoints da API REST
- **`dmhub-config.js`**: Configurações e interface
- **`dmhub-sync.js`**: Lógica de sincronização
- **`dmhub-webhook.js`**: Sistema de webhooks

### **Hooks do Foundry VTT**

O módulo usa os seguintes hooks:

```javascript
// Mudanças em personagens
Hooks.on('updateActor', callback);
Hooks.on('createActor', callback);
Hooks.on('deleteActor', callback);

// Mudanças no mundo
Hooks.on('updateWorld', callback);

// Mudanças em itens
Hooks.on('createItem', callback);
Hooks.on('updateItem', callback);
Hooks.on('deleteItem', callback);
```

### **Configurações do Foundry VTT**

```javascript
// Registrar configurações
game.settings.register('dmhub-integration', 'setting_name', {
  name: 'Setting Name',
  hint: 'Setting description',
  scope: 'world',
  config: true,
  type: String,
  default: 'default_value'
});
```

## 🔍 Troubleshooting

### **Problemas Comuns**

1. **Módulo não carrega:**
   - Verificar se está na pasta correta
   - Verificar erros no console do navegador
   - Verificar compatibilidade com versão do Foundry VTT

2. **API não responde:**
   - Verificar se o módulo está ativo
   - Verificar configurações de API key
   - Verificar logs de debug

3. **Webhooks não funcionam:**
   - Verificar URL do webhook
   - Verificar API key
   - Verificar conectividade de rede

### **Modo Debug**

Ative o modo debug nas configurações para obter logs detalhados:

```javascript
// Logs aparecerão no console
console.log('DMHUB Integration: Debug message');
```

## 📚 Documentação da API

### **Autenticação**

Todos os endpoints requerem autenticação via header:

```bash
Authorization: Bearer YOUR_API_KEY
```

### **Códigos de Status**

- **200**: Sucesso
- **400**: Erro de requisição
- **401**: Não autorizado
- **404**: Não encontrado
- **500**: Erro interno

### **Rate Limiting**

- **100 requests/minuto** por padrão
- **Configurável** nas configurações
- **Headers de rate limit** incluídos nas respostas

## 🤝 Contribuição

### **Como Contribuir**

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

### **Padrões de Código**

- **ES6+** para JavaScript
- **CSS** com prefixos apropriados
- **Documentação** em português e inglês
- **Testes** para funcionalidades críticas

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

### **Canais de Suporte**

- **Issues**: [GitHub Issues](https://github.com/Rufino-BR/dmhub-integration/issues)
- **Discord**: [DMHUB Community](https://discord.gg/dmhub)
- **Email**: support@dmhub.com

### **Versões Suportadas**

- **Foundry VTT**: v13+
- **Node.js**: 18+
- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+

## 🎯 Roadmap

### **v1.1.0** (Próxima versão)
- [ ] Suporte a múltiplos mundos
- [ ] Sincronização de cenas
- [ ] Sistema de templates
- [ ] API GraphQL

### **v1.2.0**
- [ ] Suporte a módulos de terceiros
- [ ] Sistema de plugins
- [ ] Interface de administração
- [ ] Métricas e analytics

### **v2.0.0**
- [ ] Reescrita completa em TypeScript
- [ ] Sistema de eventos em tempo real
- [ ] Suporte a WebSockets
- [ ] Interface de usuário avançada

---

**Desenvolvido com ❤️ pela equipe DMHUB**
