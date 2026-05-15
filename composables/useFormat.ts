export const useFormat = () => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDateShort = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const discountPercent = (original: number, sale: number) => {
    if (!original || original <= sale) return 0;
    return Math.round(((original - sale) / original) * 100);
  };
  const formatNum = (val: number): string => {
    if (val >= 1_000_000) {
      return (val / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
    }
    if (val >= 1_000) {
      return (val / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return val.toString();
  };
  return {
    formatCurrency,
    formatDate,
    formatDateShort,
    discountPercent,
    formatNum,
  };
};
