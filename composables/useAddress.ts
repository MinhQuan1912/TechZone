export const useAddress = () => {
  const provinces = ref<{ code: number; name: string }[]>([]);
  const wards = ref<{ code: number; name: string }[]>([]);
  const loadingProvinces = ref(false);
  const loadingWards = ref(false);

  async function fetchProvinces() {
    if (provinces.value.length) return;
    loadingProvinces.value = true;
    try {
      const data = await $fetch<any[]>("https://provinces.open-api.vn/api/v2/");
      provinces.value = data.map((p: any) => ({ code: p.code, name: p.name }));
    } catch {
      provinces.value = [];
    } finally {
      loadingProvinces.value = false;
    }
  }

  async function fetchWards(provinceCode: number) {
    loadingWards.value = true;
    wards.value = [];
    try {
      const data = await $fetch<any>(
        `https://provinces.open-api.vn/api/v2/p/${provinceCode}/?depth=2`,
      );
      wards.value = (data.wards || []).map((w: any) => ({
        code: w.code,
        name: w.name,
      }));
    } catch {
      wards.value = [];
    } finally {
      loadingWards.value = false;
    }
  }

  function buildAddressString(
    street: string,
    wardName: string,
    provinceName: string,
  ): string {
    return [street.trim(), wardName, provinceName].filter(Boolean).join(", ");
  }

  function parseAddressString(address: string) {
    const parts = address.split(", ");
    if (parts.length >= 3) {
      return {
        street: parts.slice(0, parts.length - 2).join(", "),
        wardName: parts[parts.length - 2],
        provinceName: parts[parts.length - 1],
      };
    }
    return { street: address, wardName: "", provinceName: "" };
  }

  return {
    provinces,
    wards,
    loadingProvinces,
    loadingWards,
    fetchProvinces,
    fetchWards,
    buildAddressString,
    parseAddressString,
  };
};
