/**
 * DMHUB Integration - Initialization Script
 * Script de inicialização para Foundry VTT v13
 */

Hooks.once('ready', () => {
    console.log('DMHUB Integration: Inicializando módulo...');

    // Verificar se o módulo está ativo
    if (game.modules.get('dmhub-integration')?.active) {
        console.log('DMHUB Integration: Módulo ativo, aguardando scripts carregarem...');
        
        // Aguardar um pouco para garantir que todos os scripts foram carregados
        setTimeout(() => {
            console.log('DMHUB Integration: Verificando se as classes estão disponíveis...');
            
            // Verificar se DMHUBAPI está disponível
            if (typeof DMHUBAPI !== 'undefined') {
                console.log('DMHUB Integration: Classe DMHUBAPI encontrada, inicializando...');
                window.dmhubAPI = new DMHUBAPI();
                console.log('DMHUB Integration: API inicializada com sucesso!');
            } else {
                console.error('DMHUB Integration: Classe DMHUBAPI ainda não está disponível!');
                console.log('DMHUB Integration: Tentando novamente em 2 segundos...');
                
                // Tentar novamente após mais tempo
                setTimeout(() => {
                    if (typeof DMHUBAPI !== 'undefined') {
                        console.log('DMHUB Integration: Classe DMHUBAPI encontrada na segunda tentativa!');
                        window.dmhubAPI = new DMHUBAPI();
                        console.log('DMHUB Integration: API inicializada com sucesso!');
                    } else {
                        console.error('DMHUB Integration: Falha ao carregar DMHUBAPI após múltiplas tentativas!');
                    }
                }, 2000);
            }
        }, 1000); // Aguardar 1 segundo
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
