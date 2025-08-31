/**
 * DMHUB Integration - Initialization Script
 * Script de inicialização para Foundry VTT v13
 */

Hooks.once('ready', () => {
    console.log('DMHUB Integration: Inicializando módulo...');
    
    // Verificar se o módulo está ativo
    if (game.modules.get('dmhub-integration')?.active) {
        console.log('DMHUB Integration: Módulo ativo, configurando APIs...');
        
        // Inicializar a API
        if (typeof DMHUBAPI !== 'undefined') {
            window.dmhubAPI = new DMHUBAPI();
            console.log('DMHUB Integration: API inicializada com sucesso!');
        } else {
            console.error('DMHUB Integration: Classe DMHUBAPI não encontrada!');
        }
    } else {
        console.log('DMHUB Integration: Módulo não está ativo');
    }
});

// Hook para quando o módulo é ativado
Hooks.on('moduleManagement', (moduleId, active) => {
    if (moduleId === 'dmhub-integration' && active) {
        console.log('DMHUB Integration: Módulo ativado, reinicializando...');
        setTimeout(() => {
            if (typeof DMHUBAPI !== 'undefined') {
                window.dmhubAPI = new DMHUBAPI();
                console.log('DMHUB Integration: API reinicializada!');
            }
        }, 1000);
    }
});
