<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import JsBarcode from "jsbarcode";

// Definindo as variáveis de estado para os inputs
const productType = ref("13"); // Vestido como default
const size = ref("3"); // Tamanho G como default
const color = ref("02"); // Azul como default
const ean13Code = ref("");
const codigo = ref("");

// Função para calcular o dígito verificador do EAN-13
function calcularDigitoVerificadorEAN13(ean12: string): number {
  if (ean12.length !== 12) {
    throw new Error("O EAN deve ter 12 dígitos.");
  }

  const soma = ean12
    .split("")
    .map(Number)
    .reduce((acc, num, idx) => {
      return idx % 2 === 0 ? acc + num : acc + num * 3;
    }, 0);

  const resto = soma % 10;
  return resto === 0 ? 0 : 10 - resto;
}

// Função para traduzir o código em uma descrição legível
function traduzirCodigo(): string {
  const tipos = {
    "11": "Camiseta",
    "12": "Calça",
    "13": "Vestido",
  };

  const tamanhos = {
    "1": "Pequeno (P)",
    "2": "Médio (M)",
    "3": "Grande (G)",
  };

  const cores = {
    "01": "Vermelho",
    "02": "Azul",
    "03": "Verde",
  };

  return `Produto: ${tipos[productType.value] || "Desconhecido"}, Tamanho: ${
    tamanhos[size.value] || "Desconhecido"
  }, Cor: ${cores[color.value] || "Desconhecida"}`;
}

// Função para gerar o código EAN-13
const generateBarcode = () => {
  const countryCode = "789"; // Brasil
  const companyCode = "0132"; // Seu CNPJ
  const baseCode = `${countryCode}${companyCode}${productType.value}${size.value}${color.value}`;

  // Verifica se o baseCode tem 12 dígitos
  if (baseCode.length !== 12) {
    console.error("O código base deve ter exatamente 12 dígitos.");
    return;
  }

  // Calculando o dígito verificador
  const digitoVerificador = calcularDigitoVerificadorEAN13(baseCode);

  // Código completo EAN-13
  ean13Code.value = `${baseCode}${digitoVerificador}`;
};

// Watch para atualizar o código de barras quando o EAN-13 mudar
watch(ean13Code, async (newCode) => {
  if (newCode) {
    await nextTick();
    JsBarcode("#barcode", newCode, {
      format: "ean13",
      lineColor: "#000",
      width: 2,
      height: 100,
      displayValue: true,
    });
  }
});
</script>
<template>
  <div class="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
      Gerar Código de Barras EAN-13
    </h1>

    <!-- Tipo de Produto -->
    <div class="mb-4">
      <label
        for="productType"
        class="block text-sm font-semibold text-gray-700 mb-2"
        >Tipo de Produto</label
      >
      <select
        v-model="productType"
        id="productType"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="13">Vestido</option>
        <option value="11">Camiseta</option>
        <option value="12">Calça</option>
      </select>
    </div>

    <!-- Tamanho -->
    <div class="mb-4">
      <label for="size" class="block text-sm font-semibold text-gray-700 mb-2"
        >Tamanho</label
      >
      <select
        v-model="size"
        id="size"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="1">Pequeno (P)</option>
        <option value="2">Médio (M)</option>
        <option value="3">Grande (G)</option>
      </select>
    </div>

    <!-- Cor -->
    <div class="mb-4">
      <label for="color" class="block text-sm font-semibold text-gray-700 mb-2"
        >Cor</label
      >
      <select
        v-model="color"
        id="color"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="01">Vermelho</option>
        <option value="02">Azul</option>
        <option value="03">Verde</option>
      </select>
    </div>

    <div>{{ traduzirCodigo(ean13Code) }}</div>

    <!-- Botão para gerar o código -->
    <div class="mb-6 text-center">
      <button
        @click="generateBarcode"
        class="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
      >
        Gerar Código de Barras
      </button>
    </div>

    <!-- Exibição do código EAN-13 -->
    <div v-if="ean13Code" class="p-4 bg-gray-100 rounded-lg text-center">
      <p class="font-bold text-gray-700">Código EAN-13 Gerado:</p>
      <p class="text-2xl text-blue-500 font-mono mt-2">{{ ean13Code }}</p>

      <!-- Imagem do código de barras -->
      <div class="mt-4 flex justify-center">
        <svg id="barcode"></svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionais, se necessário */
</style>
