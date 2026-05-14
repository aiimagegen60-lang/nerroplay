export interface ProfitEngineInput {
  currency_symbol: string;
  currency_code: string;
  selling_price: number;
  quantity: number | null;
  discount_percent: number | null;

  production_cost: {
    raw_material: number | null;
    labour: number | null;
    packaging: number | null;
    quality_control: number | null;
  };

  operational_cost: {
    rent_warehouse: number | null;
    electricity_utilities: number | null;
    equipment_depreciation: number | null;
    staff_salary: number | null;
  };

  logistics_cost: {
    shipping_courier: number | null;
    import_export_duty: number | null;
    returns_handling: number | null;
    inventory_holding: number | null;
  };

  marketing_cost: {
    advertising_spend: number | null;
    platform_fee_percent: number | null;
    sales_commission_percent: number | null;
    discounts_offers: number | null;
  };

  financial_cost: {
    payment_gateway_percent: number | null;
    gst_tax_percent: number | null;
    loan_interest: number | null;
    miscellaneous_buffer_percent: number | null;
  };
}

export function generateProfitAnalysis(input: ProfitEngineInput): any {
  // Safe extraction helper
  const getNum = (val: any) => {
    if (val === null || val === undefined || isNaN(val)) return null;
    return Number(val);
  };
  
  // Rule 1: selling_price MUST be > 0
  const sp = getNum(input.selling_price);
  if (sp === null || sp <= 0) {
    return {
      status: "error",
      error_message: "Selling price is required and must be greater than zero to calculate profit margin.",
      summary: {}, cost_breakdown: {}, what_if: {}, margin_classification: {}, health_score: {}, insights: [], display_fields: [],
      disclaimer: "All calculations are estimates based on inputs provided. Actual profit may vary. Consult a financial advisor for business-critical decisions. GST and tax calculations are indicative only."
    };
  }

  // Rule 2: discount_percent MUST be < 100
  const dp = getNum(input.discount_percent);
  if (dp !== null && dp >= 100) {
     return {
      status: "error",
      error_message: "Discount cannot be 100% or more.",
      summary: {}, cost_breakdown: {}, what_if: {}, margin_classification: {}, health_score: {}, insights: [], display_fields: [],
      disclaimer: "All calculations are estimates based on inputs provided. Actual profit may vary. Consult a financial advisor for business-critical decisions. GST and tax calculations are indicative only."
    };
  }

  // Check for negative inputs
  const allFields = [
    input.quantity, dp,
    input.production_cost.raw_material, input.production_cost.labour, input.production_cost.packaging, input.production_cost.quality_control,
    input.operational_cost.rent_warehouse, input.operational_cost.electricity_utilities, input.operational_cost.equipment_depreciation, input.operational_cost.staff_salary,
    input.logistics_cost.shipping_courier, input.logistics_cost.import_export_duty, input.logistics_cost.returns_handling, input.logistics_cost.inventory_holding,
    input.marketing_cost.advertising_spend, input.marketing_cost.platform_fee_percent, input.marketing_cost.sales_commission_percent, input.marketing_cost.discounts_offers,
    input.financial_cost.payment_gateway_percent, input.financial_cost.gst_tax_percent, input.financial_cost.loan_interest, input.financial_cost.miscellaneous_buffer_percent
  ];
  if (allFields.some(val => val !== null && val !== undefined && Number(val) < 0)) {
     return {
      status: "error",
      error_message: "Cost values cannot be negative. Please check your input.",
      summary: {}, cost_breakdown: {}, what_if: {}, margin_classification: {}, health_score: {}, insights: [], display_fields: [],
      disclaimer: "All calculations are estimates based on inputs provided. Actual profit may vary. Consult a financial advisor for business-critical decisions. GST and tax calculations are indicative only."
    };
  }

  // 1. Percentage cost resolution
  const effective_selling_price = dp ? sp * (1 - dp / 100) : sp;

  const platform_fee_amount = effective_selling_price * ((getNum(input.marketing_cost.platform_fee_percent) || 0) / 100);
  const sales_commission_amount = effective_selling_price * ((getNum(input.marketing_cost.sales_commission_percent) || 0) / 100);
  const payment_gateway_amount = effective_selling_price * ((getNum(input.financial_cost.payment_gateway_percent) || 0) / 100);
  const gst_amount = effective_selling_price * ((getNum(input.financial_cost.gst_tax_percent) || 0) / 100);
  const miscellaneous_amount = effective_selling_price * ((getNum(input.financial_cost.miscellaneous_buffer_percent) || 0) / 100);

  // 2. Category Subtotals
  const total_production_cost = (getNum(input.production_cost.raw_material) || 0) + (getNum(input.production_cost.labour) || 0) + (getNum(input.production_cost.packaging) || 0) + (getNum(input.production_cost.quality_control) || 0);
  const total_operational_cost = (getNum(input.operational_cost.rent_warehouse) || 0) + (getNum(input.operational_cost.electricity_utilities) || 0) + (getNum(input.operational_cost.equipment_depreciation) || 0) + (getNum(input.operational_cost.staff_salary) || 0);
  const total_logistics_cost = (getNum(input.logistics_cost.shipping_courier) || 0) + (getNum(input.logistics_cost.import_export_duty) || 0) + (getNum(input.logistics_cost.returns_handling) || 0) + (getNum(input.logistics_cost.inventory_holding) || 0);
  const total_marketing_cost = (getNum(input.marketing_cost.advertising_spend) || 0) + platform_fee_amount + sales_commission_amount + (getNum(input.marketing_cost.discounts_offers) || 0);
  const total_financial_cost = payment_gateway_amount + gst_amount + (getNum(input.financial_cost.loan_interest) || 0) + miscellaneous_amount;

  const total_cost = total_production_cost + total_operational_cost + total_logistics_cost + total_marketing_cost + total_financial_cost;

  // Rule 3: At least one cost field > 0
  if (total_cost === 0) {
      return {
      status: "error",
      error_message: "Please enter at least one cost value (material, labour, shipping, etc.) to calculate your profit.",
      summary: {}, cost_breakdown: {}, what_if: {}, margin_classification: {}, health_score: {}, insights: [], display_fields: [],
      disclaimer: "All calculations are estimates based on inputs provided. Actual profit may vary. Consult a financial advisor for business-critical decisions. GST and tax calculations are indicative only."
    };
  }

  // 3. Core Metrics
  const gross_profit = effective_selling_price - total_cost;
  const profit_margin_percent = (gross_profit / effective_selling_price) * 100;
  const markup_percent = (gross_profit / total_cost) * 100;
  const roi_percent = (gross_profit / total_cost) * 100;
  const cost_to_price_ratio_percent = (total_cost / effective_selling_price) * 100;
  const break_even_price = total_cost;

  // 4. Quantity Metrics
  const q = getNum(input.quantity);
  const total_revenue = q !== null ? effective_selling_price * q : null;
  const total_profit = q !== null ? gross_profit * q : null;
  const total_cost_all_units = q !== null ? total_cost * q : null;

  // 5. What-If Analysis
  const price_for_10_percent_margin = total_cost / 0.90;
  const price_for_20_percent_margin = total_cost / 0.80;
  const price_for_30_percent_margin = total_cost / 0.70;
  const price_for_40_percent_margin = total_cost / 0.60;
  const price_to_double_profit = total_cost + (gross_profit * 2);
  const units_to_break_even = q !== null ? Math.ceil(total_cost_all_units! / effective_selling_price) : null;

  // 6. Cost Share Analysis
  const safePercent = (val: number) => total_cost > 0 ? (val / total_cost) * 100 : 0;
  const production_cost_share_percent = safePercent(total_production_cost);
  const operational_cost_share_percent = safePercent(total_operational_cost);
  const logistics_cost_share_percent = safePercent(total_logistics_cost);
  const marketing_cost_share_percent = safePercent(total_marketing_cost);
  const financial_cost_share_percent = safePercent(total_financial_cost);

  const costsMap = [
    { name: "production", val: total_production_cost, share: production_cost_share_percent },
    { name: "operational", val: total_operational_cost, share: operational_cost_share_percent },
    { name: "logistics", val: total_logistics_cost, share: logistics_cost_share_percent },
    { name: "marketing", val: total_marketing_cost, share: marketing_cost_share_percent },
    { name: "financial", val: total_financial_cost, share: financial_cost_share_percent }
  ];
  
  costsMap.sort((a, b) => b.val - a.val);
  const highest_cost_category = costsMap[0].name;
  const highest_cost_value = costsMap[0].val;
  const highest_cost_share_percent = costsMap[0].share;

  // 7. Margin Classification
  let label = "";
  let rating: "poor" | "fair" | "good" | "great" | "excellent" = "fair";
  if (profit_margin_percent < 0) { label = "Loss Making"; rating = "poor"; }
  else if (profit_margin_percent <= 5) { label = "Break-even Zone"; rating = "poor"; } // 0-5
  else if (profit_margin_percent <= 10) { label = "Very Tight Margin"; rating = "fair"; } // 5-10
  else if (profit_margin_percent <= 20) { label = "Low Margin"; rating = "fair"; } // 10-20
  else if (profit_margin_percent <= 30) { label = "Moderate Margin"; rating = "good"; } // 20-30
  else if (profit_margin_percent <= 40) { label = "Healthy Margin"; rating = "great"; } // 30-40
  else if (profit_margin_percent <= 60) { label = "Strong Margin"; rating = "excellent"; } // 40-60
  else { label = "Exceptional Margin"; rating = "excellent"; }

  // 8. Health Score Engine
  let healthScore = 50;
  if (profit_margin_percent >= 40) healthScore += 30;
  else if (profit_margin_percent >= 30) healthScore += 20;
  else if (profit_margin_percent >= 20) healthScore += 10;
  else if (profit_margin_percent >= 10) healthScore += 5;

  if (profit_margin_percent < 0) healthScore -= 40;
  else if (profit_margin_percent < 5) healthScore -= 20;

  if (marketing_cost_share_percent > 40) healthScore -= 10;
  if (logistics_cost_share_percent > 30) healthScore -= 10;

  if (dp !== null && dp > 0 && profit_margin_percent < 10) healthScore -= 10;
  if (cost_to_price_ratio_percent < 50) healthScore += 10;

  healthScore = Math.max(0, Math.min(100, healthScore)); // clamp 0-100
  let healthRating: "poor" | "fair" | "good" | "great" | "excellent" = "poor";
  if (healthScore >= 85) healthRating = "excellent";
  else if (healthScore >= 66) healthRating = "great";
  else if (healthScore >= 46) healthRating = "good";
  else if (healthScore >= 26) healthRating = "fair";

  // Helpers
  const round2 = (num: number | null) => {
    if (num === null) return null;
    if (isNaN(num) || !isFinite(num)) return null;
    return Math.round(num * 100) / 100;
  };

  const formatMoney = (val: number | null) => {
    if (val === null) return "N/A";
    const v = round2(val) || 0;
    if (input.currency_code === "INR") {
      return input.currency_symbol + v.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return input.currency_symbol + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPct = (val: number | null) => {
    if (val === null) return "N/A";
    const v = round2(val) || 0;
    return v.toFixed(2) + "%";
  };

  // 9. Insights Engine
  const insights: Array<{ type: "warning" | "success" | "info" | "tip" | "alert", title: string, detail: string }> = [];

  if (gross_profit < 0) {
    insights.push({
      type: "warning",
      title: "Operating at a Loss",
      detail: `You are losing ${formatMoney(Math.abs(gross_profit))} on every unit sold.`
    });
  } else if (profit_margin_percent > 30) {
    insights.push({
      type: "success",
      title: "Strong Profitability",
      detail: `Your margin of ${formatPct(profit_margin_percent)} indicates a highly profitable product structure.`
    });
  }

  if (highest_cost_share_percent > 50) {
    insights.push({
      type: "warning",
      title: "Lopsided Cost Structure",
      detail: `${highest_cost_category.charAt(0).toUpperCase() + highest_cost_category.slice(1)} accounts for ${formatPct(highest_cost_share_percent)} of your total costs, making operations risky if these prices rise.`
    });
  } else {
     insights.push({
      type: "info",
      title: "Markup Observation",
      detail: `With a markup of ${formatPct(markup_percent)}, you are selling at ${(effective_selling_price / total_cost).toFixed(2)}x of your cost.`
    });
  }

  const platFee = getNum(input.marketing_cost.platform_fee_percent) || 0;
  const payFee = getNum(input.financial_cost.payment_gateway_percent) || 0;
  if (platFee + payFee > 15) {
     insights.push({
      type: "alert",
      title: "High Platform Fees",
      detail: `You are paying ${formatPct(platFee + payFee)} of your selling price to platforms and gateways. Negotiating or shifting channels could rapidly recover margin.`
    });
  }

  insights.push({
      type: "tip",
      title: "Improve Profit Margin",
      detail: `Reducing your ${highest_cost_category} cost by just 10% (${formatMoney(highest_cost_value * 0.1)}) would boost your profit to ${formatMoney(gross_profit + (highest_cost_value * 0.1))} per unit.`
  });

  // 10. Display Fields
  const display_fields = [
    { id: "gross_profit", label: "Gross Profit", value: round2(gross_profit), formatted: formatMoney(gross_profit), is_primary: true, color_hint: gross_profit > 0 ? "positive" : "negative" },
    { id: "profit_margin_percent", label: "Profit Margin", value: round2(profit_margin_percent), formatted: formatPct(profit_margin_percent), is_primary: true, color_hint: profit_margin_percent >= 20 ? "positive" : profit_margin_percent >= 0 ? "warning" : "negative" },
    { id: "markup_percent", label: "Markup", value: round2(markup_percent), formatted: formatPct(markup_percent), is_primary: true, color_hint: markup_percent > 0 ? "positive" : "negative" },
    { id: "total_cost", label: "Total Cost", value: round2(total_cost), formatted: formatMoney(total_cost), is_primary: false, color_hint: "neutral" },
    { id: "break_even_price", label: "Break-even Price", value: round2(break_even_price), formatted: formatMoney(break_even_price), is_primary: false, color_hint: "neutral" },
    { id: "roi_percent", label: "Return on Investment", value: round2(roi_percent), formatted: formatPct(roi_percent), is_primary: false, color_hint: roi_percent > 20 ? "positive" : roi_percent >= 0 ? "warning" : "negative" },
  ];

  if (q !== null) {
      display_fields.push({ id: "total_profit", label: "Total Profit", value: round2(total_profit), formatted: formatMoney(total_profit), is_primary: false, color_hint: "neutral" });
  }

  display_fields.push({ id: "cost_to_price_ratio", label: "Cost-to-Price Ratio", value: round2(cost_to_price_ratio_percent), formatted: formatPct(cost_to_price_ratio_percent), is_primary: false, color_hint: "neutral" });

  return {
    status: "success",
    error_message: null,
    summary: {
      selling_price: round2(sp),
      effective_selling_price: round2(effective_selling_price),
      total_cost: round2(total_cost),
      gross_profit: round2(gross_profit),
      profit_margin_percent: round2(profit_margin_percent),
      markup_percent: round2(markup_percent),
      roi_percent: round2(roi_percent),
      cost_to_price_ratio_percent: round2(cost_to_price_ratio_percent),
      break_even_price: round2(break_even_price),
      total_revenue: round2(total_revenue),
      total_profit: round2(total_profit),
      total_cost_all_units: round2(total_cost_all_units)
    },
    cost_breakdown: {
      production: { subtotal: round2(total_production_cost), share_percent: round2(production_cost_share_percent), items: input.production_cost },
      operational: { subtotal: round2(total_operational_cost), share_percent: round2(operational_cost_share_percent), items: input.operational_cost },
      logistics: { subtotal: round2(total_logistics_cost), share_percent: round2(logistics_cost_share_percent), items: input.logistics_cost },
      marketing: { subtotal: round2(total_marketing_cost), share_percent: round2(marketing_cost_share_percent), items: { ...input.marketing_cost, platform_fee_amount: round2(platform_fee_amount), sales_commission_amount: round2(sales_commission_amount) } },
      financial: { subtotal: round2(total_financial_cost), share_percent: round2(financial_cost_share_percent), items: { ...input.financial_cost, payment_gateway_amount: round2(payment_gateway_amount), gst_amount: round2(gst_amount), miscellaneous_amount: round2(miscellaneous_amount) } },
      highest_cost_category,
      highest_cost_value: round2(highest_cost_value),
      highest_cost_share_percent: round2(highest_cost_share_percent)
    },
    what_if: {
      price_for_10_percent_margin: round2(price_for_10_percent_margin),
      price_for_20_percent_margin: round2(price_for_20_percent_margin),
      price_for_30_percent_margin: round2(price_for_30_percent_margin),
      price_for_40_percent_margin: round2(price_for_40_percent_margin),
      price_to_double_profit: round2(price_to_double_profit),
      units_to_break_even: round2(units_to_break_even)
    },
    margin_classification: { label, rating, description: "" },
    health_score: { score: healthScore, out_of: 100, rating: healthRating, rationale: "Evaluated based on profit margins and cost distribution." },
    insights,
    display_fields,
    disclaimer: "All calculations are estimates based on inputs provided. Actual profit may vary. Consult a financial advisor for business-critical decisions. GST and tax calculations are indicative only."
  };
}
