/**
 * DMHUB Integration - API Module
 * Fornece endpoints REST para integração com DMHUB
 */

class DMHUBAPI {
    constructor() {
        this.endpoints = new Map();
        this.config = null; // Será configurado depois
        this.setupEndpoints();
        this.setupHooks();
        
        // Configurar configurações quando estiverem disponíveis
        this.loadConfig();
    }
    
    /**
     * Carregar configurações
     */
    loadConfig() {
        try {
            this.config = {
                enabled: game.settings.get('dmhub-integration', 'enabled') ?? true,
                api_key: game.settings.get('dmhub-integration', 'api_key') ?? '',
                webhook_url: game.settings.get('dmhub-integration', 'webhook_url') ?? '',
                auto_sync: game.settings.get('dmhub-integration', 'auto_sync') ?? true,
                debug_mode: game.settings.get('dmhub-integration', 'debug_mode') ?? false
            };
        } catch (error) {
            console.warn('DMHUB Integration: Configurações ainda não disponíveis, usando padrões');
            this.config = {
                enabled: true,
                api_key: '',
                webhook_url: '',
                auto_sync: true,
                debug_mode: false
            };
        }
    }

    /**
     * Configurar endpoints da API
     */
    setupEndpoints() {
        // Endpoint de status
        this.endpoints.set('/api/dmhub/status', {
            method: 'GET',
            handler: this.getStatus.bind(this)
        });

        // Endpoint de personagens
        this.endpoints.set('/api/dmhub/actors', {
            method: 'GET',
            handler: this.getActors.bind(this)
        });

        // Endpoint de personagem específico
        this.endpoints.set('/api/dmhub/actors/{id}', {
            method: 'GET',
            handler: this.getActor.bind(this)
        });

        // Endpoint de mundos
        this.endpoints.set('/api/dmhub/worlds', {
            method: 'GET',
            handler: this.getWorlds.bind(this)
        });

        // Endpoint de sincronização
        this.endpoints.set('/api/dmhub/sync', {
            method: 'POST',
            handler: this.syncData.bind(this)
        });

        // Endpoint de configuração
        this.endpoints.set('/api/dmhub/config', {
            method: 'GET',
            handler: this.getConfig.bind(this)
        });

        // Endpoint de webhook
        this.endpoints.set('/api/dmhub/webhook', {
            method: 'POST',
            handler: this.webhookHandler.bind(this)
        });
    }

    /**
     * Configurar hooks do Foundry VTT
     */
    setupHooks() {
        // Hook para mudanças em personagens
        Hooks.on('updateActor', (actor, changes, options, userId) => {
            this.notifyDMHUB('actor_updated', { actor, changes, userId });
        });

        // Hook para criação de personagens
        Hooks.on('createActor', (actor, options, userId) => {
            this.notifyDMHUB('actor_created', { actor, userId });
        });

        // Hook para remoção de personagens
        Hooks.on('deleteActor', (actor, options, userId) => {
            this.notifyDMHUB('actor_deleted', { actor, userId });
        });

        // Hook para mudanças no mundo
        Hooks.on('updateWorld', (changes, options, userId) => {
            this.notifyDMHUB('world_updated', { changes, userId });
        });
    }

    /**
     * Endpoint: Status da integração
     */
    getStatus(request) {
        return {
            success: true,
            data: {
                module: 'dmhub-integration',
                version: '1.0.0',
                status: 'active',
                world: game.world.id,
                system: game.system.id,
                actors_count: game.actors.size,
                users_count: game.users.size,
                timestamp: Date.now()
            }
        };
    }

    /**
     * Endpoint: Lista de personagens
     */
    getActors(request) {
        const actors = Array.from(game.actors.values()).map(actor => ({
            id: actor.id,
            name: actor.name,
            type: actor.type,
            system: actor.system.id,
            img: actor.img,
            folder: actor.folder?.name || null,
            flags: actor.flags,
            created: actor.created,
            updated: actor.updated
        }));

        return {
            success: true,
            data: actors,
            count: actors.length
        };
    }

    /**
     * Endpoint: Personagem específico
     */
    getActor(request) {
        const actorId = request.params.id;
        const actor = game.actors.get(actorId);

        if (!actor) {
            return {
                success: false,
                error: 'Actor not found',
                code: 404
            };
        }

        return {
            success: true,
            data: {
                id: actor.id,
                name: actor.name,
                type: actor.type,
                system: actor.system.id,
                img: actor.img,
                folder: actor.folder?.name || null,
                flags: actor.flags,
                created: actor.created,
                updated: actor.updated,
                data: actor.system,
                items: actor.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    img: item.img
                }))
            }
        };
    }

    /**
     * Endpoint: Informações do mundo
     */
    getWorlds(request) {
        return {
            success: true,
            data: {
                id: game.world.id,
                name: game.world.name,
                title: game.world.title,
                description: game.world.description,
                system: game.system.id,
                version: game.system.version,
                active: true,
                users: Array.from(game.users.values()).map(user => ({
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    active: user.active
                }))
            }
        };
    }

    /**
     * Endpoint: Sincronização de dados
     */
    async syncData(request) {
        try {
            const { type, data } = request.body;
            
            switch (type) {
                case 'actors':
                    return this.syncActors(data);
                case 'world':
                    return this.syncWorld(data);
                default:
                    return {
                        success: false,
                        error: 'Invalid sync type',
                        code: 400
                    };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message,
                code: 500
            };
        }
    }

    /**
     * Endpoint: Configuração do módulo
     */
    getConfig(request) {
        return {
            success: true,
            data: this.config
        };
    }

    /**
     * Endpoint: Webhook handler
     */
    async webhookHandler(request) {
        try {
            const { event, data } = request.body;
            
            // Processar evento do webhook
            this.processWebhookEvent(event, data);
            
            return {
                success: true,
                message: 'Webhook processed successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                code: 500
            };
        }
    }

    /**
     * Sincronizar personagens
     */
    async syncActors(data) {
        const results = [];
        
        for (const actorData of data) {
            try {
                const actor = game.actors.get(actorData.id);
                if (actor) {
                    // Atualizar dados do personagem
                    await actor.update(actorData.changes);
                    results.push({
                        id: actor.id,
                        status: 'updated',
                        success: true
                    });
                }
            } catch (error) {
                results.push({
                    id: actorData.id,
                    status: 'error',
                    success: false,
                    error: error.message
                });
            }
        }

        return {
            success: true,
            data: results
        };
    }

    /**
     * Sincronizar mundo
     */
    async syncWorld(data) {
        try {
            // Atualizar configurações do mundo
            game.settings.set('dmhub-integration', 'world_config', data);
            
            return {
                success: true,
                message: 'World configuration updated'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                code: 500
            };
        }
    }

    /**
     * Notificar DMHUB sobre mudanças
     */
    async notifyDMHUB(event, data) {
        if (!this.config.webhook_url) return;

        try {
            const payload = {
                event,
                data,
                timestamp: Date.now(),
                world_id: game.world.id,
                module_version: '1.0.0'
            };

            await fetch(this.config.webhook_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.api_key}`
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('DMHUB Integration: Failed to notify webhook', error);
        }
    }

    /**
     * Processar eventos de webhook
     */
    processWebhookEvent(event, data) {
        switch (event) {
            case 'sync_request':
                this.handleSyncRequest(data);
                break;
            case 'config_update':
                this.handleConfigUpdate(data);
                break;
            default:
                console.log('DMHUB Integration: Unknown webhook event', event);
        }
    }

    /**
     * Manipular solicitação de sincronização
     */
    handleSyncRequest(data) {
        // Implementar lógica de sincronização baseada na solicitação
        console.log('DMHUB Integration: Sync request received', data);
    }

    /**
     * Manipular atualização de configuração
     */
    handleConfigUpdate(data) {
        // Atualizar configuração local
        this.config = { ...this.config, ...data };
        game.settings.set('dmhub-integration', 'config', this.config);
        console.log('DMHUB Integration: Configuration updated', data);
    }

    /**
     * Método para verificar se a API está ativa
     */
    isActive() {
        return this.config && this.config.enabled;
    }

    /**
     * Aliases para facilitar o uso da API
     */
    get status() {
        return this.getStatus();
    }

    get actors() {
        return this.getActors();
    }

    get worlds() {
        return this.getWorlds();
    }

    get config() {
        return this.getConfig();
    }
}

// Registrar o módulo quando o Foundry VTT estiver pronto
Hooks.once('ready', () => {
    // Verificar se o módulo está ativo
    if (game.modules.get('dmhub-integration')?.active) {
        // Expor a classe globalmente para que outros scripts possam acessá-la
        window.DMHUBAPI = DMHUBAPI;

        // Instanciar a API quando o script carregar
        const dmhubAPI = new DMHUBAPI();
        console.log('DMHUB Integration: API initialized successfully');
    }
});
