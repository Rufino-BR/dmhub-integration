/**
 * DMHUB Integration - Configuration Module
 * Gerencia configurações e interface de usuário
 */

class DMHUBConfig {
    constructor() {
        this.config = null;
        this.form = null;
        this.init();
    }

    /**
     * Inicializar o módulo de configuração
     */
    init() {
        console.log('DMHUB Integration: Configuration module initialized');
        
        // Registrar configurações PRIMEIRO
        this.registerSettings();
        
        // Depois carregar as configurações
        this.loadConfig();
    }

    /**
     * Aguardar o Foundry VTT estar pronto
     */
    waitForReady() {
        return new Promise((resolve) => {
            if (game.ready) {
                resolve();
            } else {
                Hooks.once('ready', resolve);
            }
        });
    }

    /**
     * Carregar configurações
     */
    loadConfig() {
        this.config = {
            enabled: game.settings.get('dmhub-integration', 'enabled') ?? true,
            api_key: game.settings.get('dmhub-integration', 'api_key') ?? '',
            webhook_url: game.settings.get('dmhub-integration', 'webhook_url') ?? '',
            auto_sync: game.settings.get('dmhub-integration', 'auto_sync') ?? true,
            sync_interval: game.settings.get('dmhub-integration', 'sync_interval') ?? 300000, // 5 minutos
            debug_mode: game.settings.get('dmhub-integration', 'debug_mode') ?? false,
            sync_actors: game.settings.get('dmhub-integration', 'sync_actors') ?? true,
            sync_world: game.settings.get('dmhub-integration', 'sync_world') ?? true,
            sync_items: game.settings.get('dmhub-integration', 'sync_items') ?? false,
            webhook_events: game.settings.get('dmhub-integration', 'webhook_events') ?? ['actor_created', 'actor_updated', 'actor_deleted']
        };
    }

    /**
     * Registrar configurações no Foundry VTT
     */
    registerSettings() {
        // Configuração principal
        game.settings.register('dmhub-integration', 'enabled', {
            name: 'DMHUB Integration Enabled',
            hint: 'Enable or disable the DMHUB integration module',
            scope: 'world',
            config: true,
            type: Boolean,
            default: true,
            onChange: (value) => this.onSettingChange('enabled', value)
        });

        // Chave da API
        game.settings.register('dmhub-integration', 'api_key', {
            name: 'DMHUB API Key',
            hint: 'API key for authentication with DMHUB',
            scope: 'world',
            config: true,
            type: String,
            default: '',
            onChange: (value) => this.onSettingChange('api_key', value)
        });

        // URL do Webhook
        game.settings.register('dmhub-integration', 'webhook_url', {
            name: 'DMHUB Webhook URL',
            hint: 'URL for sending webhook notifications to DMHUB',
            scope: 'world',
            config: true,
            type: String,
            default: '',
            onChange: (value) => this.onSettingChange('webhook_url', value)
        });

        // Sincronização automática
        game.settings.register('dmhub-integration', 'auto_sync', {
            name: 'Auto Sync',
            hint: 'Automatically sync data with DMHUB',
            scope: 'world',
            config: true,
            type: Boolean,
            default: true,
            onChange: (value) => this.onSettingChange('auto_sync', value)
        });

        // Intervalo de sincronização
        game.settings.register('dmhub-integration', 'sync_interval', {
            name: 'Sync Interval (ms)',
            hint: 'Interval between automatic syncs in milliseconds',
            scope: 'world',
            config: true,
            type: Number,
            default: 300000,
            range: {
                min: 60000,   // 1 minuto
                max: 3600000,  // 1 hora
                step: 60000    // 1 minuto
            },
            onChange: (value) => this.onSettingChange('sync_interval', value)
        });

        // Modo debug
        game.settings.register('dmhub-integration', 'debug_mode', {
            name: 'Debug Mode',
            hint: 'Enable debug logging for troubleshooting',
            scope: 'world',
            config: true,
            type: Boolean,
            default: false,
            onChange: (value) => this.onSettingChange('debug_mode', value)
        });

        // Sincronizar personagens
        game.settings.register('dmhub-integration', 'sync_actors', {
            name: 'Sync Actors',
            hint: 'Synchronize actor/character data with DMHUB',
            scope: 'world',
            config: true,
            type: Boolean,
            default: true,
            onChange: (value) => this.onSettingChange('sync_actors', value)
        });

        // Sincronizar mundo
        game.settings.register('dmhub-integration', 'sync_world', {
            name: 'Sync World',
            hint: 'Synchronize world data with DMHUB',
            scope: 'world',
            config: true,
            type: Boolean,
            default: true,
            onChange: (value) => this.onSettingChange('sync_world', value)
        });

        // Sincronizar itens
        game.settings.register('dmhub-integration', 'sync_items', {
            name: 'Sync Items',
            hint: 'Synchronize item data with DMHUB',
            scope: 'world',
            config: true,
            type: Boolean,
            default: false,
            onChange: (value) => this.onSettingChange('sync_items', value)
        });

        // Eventos de webhook
        game.settings.register('dmhub-integration', 'webhook_events', {
            name: 'Webhook Events',
            hint: 'Select which events to send to DMHUB',
            scope: 'world',
            config: true,
            type: Array,
            default: ['actor_created', 'actor_updated', 'actor_deleted'],
            choices: {
                'actor_created': 'Actor Created',
                'actor_updated': 'Actor Updated',
                'actor_deleted': 'Actor Deleted',
                'world_updated': 'World Updated',
                'item_created': 'Item Created',
                'item_updated': 'Item Updated',
                'item_deleted': 'Item Deleted'
            },
            onChange: (value) => this.onSettingChange('webhook_events', value)
        });
    }

    /**
     * Criar formulário de configuração
     */
    createConfigForm() {
        // Criar botão na barra de ferramentas
        this.createToolbarButton();
        
        // Criar menu de configuração
        this.createConfigMenu();
    }

    /**
     * Criar botão na barra de ferramentas
     */
    createToolbarButton() {
        // Adicionar botão na barra de ferramentas do Foundry VTT
        const toolbar = document.querySelector('#toolbar');
        if (toolbar) {
            const button = document.createElement('button');
            button.innerHTML = '<i class="fas fa-cogs"></i>';
            button.title = 'DMHUB Integration Settings';
            button.className = 'dmhub-config-btn';
            button.onclick = () => this.showConfigDialog();
            
            toolbar.appendChild(button);
        }
    }

    /**
     * Criar menu de configuração
     */
    createConfigMenu() {
        // Adicionar item no menu de configurações
        const configMenu = game.settings.menus.get('dmhub-integration');
        if (configMenu) {
            configMenu.label = 'DMHUB Integration';
            configMenu.icon = 'fas fa-cogs';
        }
    }

    /**
     * Mostrar diálogo de configuração
     */
    showConfigDialog() {
        const dialog = new Dialog({
            title: 'DMHUB Integration Configuration',
            content: this.getConfigHTML(),
            buttons: {
                save: {
                    icon: '<i class="fas fa-save"></i>',
                    label: 'Save',
                    callback: () => this.saveConfig()
                },
                test: {
                    icon: '<i class="fas fa-vial"></i>',
                    label: 'Test Connection',
                    callback: () => this.testConnection()
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: 'Cancel'
                }
            },
            default: 'save',
            close: () => this.closeConfigDialog()
        });

        dialog.render(true);
    }

    /**
     * Gerar HTML do formulário de configuração
     */
    getConfigHTML() {
        return `
            <form id="dmhub-config-form">
                <div class="form-group">
                    <label for="enabled">Enable Integration</label>
                    <input type="checkbox" id="enabled" name="enabled" ${this.config.enabled ? 'checked' : ''}>
                </div>
                
                <div class="form-group">
                    <label for="api_key">API Key</label>
                    <input type="password" id="api_key" name="api_key" value="${this.config.api_key}" placeholder="Enter your DMHUB API key">
                </div>
                
                <div class="form-group">
                    <label for="webhook_url">Webhook URL</label>
                    <input type="url" id="webhook_url" name="webhook_url" value="${this.config.webhook_url}" placeholder="https://your-dmhub.com/webhook">
                </div>
                
                <div class="form-group">
                    <label for="auto_sync">Auto Sync</label>
                    <input type="checkbox" id="auto_sync" name="auto_sync" ${this.config.auto_sync ? 'checked' : ''}>
                </div>
                
                <div class="form-group">
                    <label for="sync_interval">Sync Interval (minutes)</label>
                    <input type="number" id="sync_interval" name="sync_interval" value="${Math.floor(this.config.sync_interval / 60000)}" min="1" max="60">
                </div>
                
                <div class="form-group">
                    <label for="debug_mode">Debug Mode</label>
                    <input type="checkbox" id="debug_mode" name="debug_mode" ${this.config.debug_mode ? 'checked' : ''}>
                </div>
                
                <div class="form-group">
                    <label>Sync Options</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" name="sync_actors" ${this.config.sync_actors ? 'checked' : ''}> Actors/Characters</label>
                        <label><input type="checkbox" name="sync_world" ${this.config.sync_world ? 'checked' : ''}> World Data</label>
                        <label><input type="checkbox" name="sync_items" ${this.config.sync_items ? 'checked' : ''}> Items</label>
                    </div>
                </div>
            </form>
        `;
    }

    /**
     * Salvar configurações
     */
    saveConfig() {
        const form = document.getElementById('dmhub-config-form');
        const formData = new FormData(form);
        
        // Atualizar configurações
        this.config.enabled = formData.get('enabled') === 'on';
        this.config.api_key = formData.get('api_key');
        this.config.webhook_url = formData.get('webhook_url');
        this.config.auto_sync = formData.get('auto_sync') === 'on';
        this.config.sync_interval = parseInt(formData.get('sync_interval')) * 60000;
        this.config.debug_mode = formData.get('debug_mode') === 'on';
        this.config.sync_actors = formData.get('sync_actors') === 'on';
        this.config.sync_world = formData.get('sync_world') === 'on';
        this.config.sync_items = formData.get('sync_items') === 'on';
        
        // Salvar no Foundry VTT
        game.settings.set('dmhub-integration', 'enabled', this.config.enabled);
        game.settings.set('dmhub-integration', 'api_key', this.config.api_key);
        game.settings.set('dmhub-integration', 'webhook_url', this.config.webhook_url);
        game.settings.set('dmhub-integration', 'auto_sync', this.config.auto_sync);
        game.settings.set('dmhub-integration', 'sync_interval', this.config.sync_interval);
        game.settings.set('dmhub-integration', 'debug_mode', this.config.debug_mode);
        game.settings.set('dmhub-integration', 'sync_actors', this.config.sync_actors);
        game.settings.set('dmhub-integration', 'sync_world', this.config.sync_world);
        game.settings.set('dmhub-integration', 'sync_items', this.config.sync_items);
        
        // Fechar diálogo
        this.closeConfigDialog();
        
        // Mostrar mensagem de sucesso
        ui.notifications.info('DMHUB Integration settings saved successfully!');
    }

    /**
     * Testar conexão
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.config.webhook_url}/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.api_key}`
                },
                body: JSON.stringify({
                    test: true,
                    timestamp: Date.now()
                })
            });
            
            if (response.ok) {
                ui.notifications.info('Connection test successful!');
            } else {
                ui.notifications.error('Connection test failed!');
            }
        } catch (error) {
            ui.notifications.error(`Connection test error: ${error.message}`);
        }
    }

    /**
     * Fechar diálogo de configuração
     */
    closeConfigDialog() {
        // Limpar referências
        this.form = null;
    }

    /**
     * Manipular mudanças de configuração
     */
    onSettingChange(key, value) {
        this.config[key] = value;
        
        if (this.config.debug_mode) {
            console.log(`DMHUB Integration: Setting ${key} changed to ${value}`);
        }
        
        // Notificar outros módulos sobre a mudança
        Hooks.call('dmhub-integration:settingChanged', key, value);
    }

    /**
     * Obter configuração
     */
    getConfig() {
        return this.config;
    }

    /**
     * Verificar se a integração está habilitada
     */
    isEnabled() {
        return this.config.enabled;
    }

    /**
     * Verificar se o modo debug está ativo
     */
    isDebugMode() {
        return this.config.debug_mode;
    }
}

// Registrar o módulo de configuração quando o Foundry VTT estiver pronto
Hooks.once('ready', () => {
    // Verificar se o módulo está ativo
    if (game.modules.get('dmhub-integration')?.active) {
        window.dmhubConfig = new DMHUBConfig();
        console.log('DMHUB Integration: Configuration module initialized');
    }
});
