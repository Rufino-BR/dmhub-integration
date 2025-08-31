#!/bin/bash

# 🎮 DMHUB Integration - Script de Instalação
# Este script instala o módulo DMHUB Integration no Foundry VTT

echo "🎮 DMHUB Integration - Instalação"
echo "=================================="
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "module.json" ]; then
    echo "❌ Erro: Execute este script no diretório do módulo"
    echo "   cd foundry_modules/dmhub-integration"
    echo "   ./install.sh"
    exit 1
fi

# Verificar se o Foundry VTT está rodando
echo "🔍 Verificando se o Foundry VTT está rodando..."
if curl -s "http://localhost:30000" > /dev/null 2>&1; then
    echo "✅ Foundry VTT está rodando em localhost:30000"
    FOUNDRY_URL="http://localhost:30000"
elif curl -s "http://163.176.233.150:30000" > /dev/null 2>&1; then
    echo "✅ Foundry VTT está rodando em 163.176.233.150:30000"
    FOUNDRY_URL="http://163.176.233.150:30000"
else
    echo "❌ Foundry VTT não está rodando"
    echo "   Inicie o Foundry VTT primeiro"
    exit 1
fi

# Criar arquivo ZIP para instalação
echo "📦 Criando arquivo de instalação..."
if command -v zip > /dev/null 2>&1; then
    zip -r dmhub-integration.zip . -x "*.git*" "install.sh" "README.md"
    echo "✅ Arquivo dmhub-integration.zip criado"
else
    echo "⚠️  zip não encontrado, criando arquivo tar.gz..."
    tar -czf dmhub-integration.tar.gz --exclude='.git' --exclude='install.sh' --exclude='README.md' .
    echo "✅ Arquivo dmhub-integration.tar.gz criado"
fi

# Instruções de instalação
echo ""
echo "🚀 INSTRUÇÕES DE INSTALAÇÃO:"
echo "============================="
echo ""
echo "1. 📁 Copie o arquivo criado para o servidor Foundry VTT:"
if [ -f "dmhub-integration.zip" ]; then
    echo "   scp dmhub-integration.zip ubuntu@163.176.233.150:/tmp/"
    echo "   ssh ubuntu@163.176.233.150"
    echo "   sudo cp /tmp/dmhub-integration.zip /home/ubuntu/.local/share/FoundryVTT/Data/modules/"
    echo "   cd /home/ubuntu/.local/share/FoundryVTT/Data/modules/"
    echo "   sudo unzip dmhub-integration.zip"
    echo "   sudo chown -R ubuntu:ubuntu dmhub-integration/"
else
    echo "   scp dmhub-integration.tar.gz ubuntu@163.176.233.150:/tmp/"
    echo "   ssh ubuntu@163.176.233.150"
    echo "   sudo cp /tmp/dmhub-integration.tar.gz /home/ubuntu/.local/share/FoundryVTT/Data/modules/"
    echo "   cd /home/ubuntu/.local/share/FoundryVTT/Data/modules/"
    echo "   sudo tar -xzf dmhub-integration.tar.gz"
    echo "   sudo chown -R ubuntu:ubuntu dmhub-integration/"
fi

echo ""
echo "2. 🔄 Reinicie o Foundry VTT:"
echo "   pm2 restart foundry"
echo ""
echo "3. ⚙️ Configure o módulo:"
echo "   - Acesse: $FOUNDRY_URL"
echo "   - Vá em 'Add-on Modules'"
echo "   - Ative 'DMHUB Integration'"
echo "   - Configure as opções"
echo ""
echo "4. 🧪 Teste a API:"
echo "   curl -H 'Authorization: Bearer YOUR_API_KEY' $FOUNDRY_URL/api/dmhub/status"
echo ""

# Verificar se o módulo foi instalado
echo "🔍 Verificando instalação..."
sleep 5

if curl -s "$FOUNDRY_URL/api/dmhub/status" > /dev/null 2>&1; then
    echo "✅ Módulo instalado e funcionando!"
    echo "🎯 Endpoints disponíveis:"
    echo "   - $FOUNDRY_URL/api/dmhub/status"
    echo "   - $FOUNDRY_URL/api/dmhub/actors"
    echo "   - $FOUNDRY_URL/api/dmhub/worlds"
    echo "   - $FOUNDRY_URL/api/dmhub/config"
else
    echo "⚠️  Módulo não responde ainda"
    echo "   Aguarde alguns segundos e tente novamente"
fi

echo ""
echo "🎉 Instalação concluída!"
echo "📚 Consulte o README.md para mais informações"
echo "🆘 Para suporte: https://github.com/dmhub/foundry-integration/issues"
