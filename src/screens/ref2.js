function roundoff(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }
  
  var electricity_bill;
  var rate_of_electricity;
  var connection
  var roof_area
  var free_maint_years
  var debtTenure
  var sunhrs
  var Debt
  var roofAreaMessage
  
  var maintenance
  var maintenance_inflation;
  var insurance ;
  var insurance_inflation;
  var power_production_price ;
  var electricity_inflation;
  var capex;
  var equity;
  var plant_load_factor;
  var efficiency_reduction;
  var efficiency_reduction1;
  var energy_produced;
  var elec_price;
  var revenue;
  
  var debt_rate
  var depreciation_percent
  var depreciation_accl_percent1
  var depreciation_accl_percent2
  var depreciation_accl_percent3
  var depreciation_accl_percent4
  var tax_percent
  var subsidy_percent
  var subsidyCheck
  var acclDepCheck
  var extraTaxCheck
  var normalDepTaxBenefitCheck
  var taxBenefitInterestCheck
  
  var plantCapacity
  var insurance_temp
  var capex_subsidy
  
  export var initialize = (inputs) => {
    console.log(inputs)
    electricity_bill = inputs.elecBill
    rate_of_electricity = inputs.elecRate
    connection = inputs.elecType
    roof_area = inputs.roofArea
    free_maint_years = inputs.freeMaintYrs
    debtTenure = inputs.debtTenure
    sunhrs = inputs.sunhrs
    efficiency_reduction = inputs.effRed1
    efficiency_reduction1 = inputs.effRed
    electricity_inflation = inputs.elecInflation
    debt_rate = inputs.debtRate
    depreciation_percent = inputs.depPercent
    depreciation_accl_percent1 = inputs.depAcclPercent1
    depreciation_accl_percent2 = inputs.depAcclPercent2
    depreciation_accl_percent3 = inputs.depAcclPercent3
    depreciation_accl_percent4 = inputs.depAcclPercent4
    tax_percent = inputs.taxPercent
    subsidy_percent = inputs.subsidyPercent
    subsidyCheck = inputs.subsidyCheck
    acclDepCheck = inputs.acclDepCheck
    extraTaxCheck = inputs.extraTaxCheck
    normalDepTaxBenefitCheck = inputs.normalDepTaxBenefitCheck
    taxBenefitInterestCheck = inputs.taxBenefitInterestCheck
  
    return calculate()
  }
  
  var calculate = () => {
    plantCapacity = Math.round((electricity_bill / rate_of_electricity) / Math.round (30 * sunhrs))
    console.log("Plant Cap "+plantCapacity)
    var roofArearequired = Math.round(plantCapacity * 120)
    console.log("roofarearequired ",roofArearequired)
  
    if (roofArearequired < roof_area) {
      roofAreaMessage = "Complete required roof area is available"
    } else{
      var electricity_consumption = Math.round(roof_area / roofArearequired * 100)
      console.log("percentage consumption" ,electricity_consumption)
      roofAreaMessage = "100% of roof area used, "+electricity_consumption+"% of electricity consumption offset by solar power"
    }
  
    if (plantCapacity < 10 || (plantCapacity < 10 && connection === 'domestic')) {
        Debt  = '0';
        console.log(Debt);
        //$("#subcidy").bootstrapSwitch('state', false);
        //$("#subcidy").bootstrapSwitch('state', false);
      }
      else if(connection === 'domestic'){
        Debt = '0';
        console.log(Debt);
        //$("#subcidy").bootstrapSwitch('state', true);
      } else if(connection === "nondomestic"){
        Debt  = '70';
        console.log(Debt);
      } else{
        Debt = '70';
        console.log(Debt);
        //$("#acce").bootstrapSwitch('state', true);
      }
  
      if (plantCapacity <= 10){
       maintenance = 0.02;
       maintenance_inflation = 0.05;
       insurance = 0;
       insurance_inflation = 0.01;
       power_production_price = 72000;
  
      } else if(plantCapacity <= 20){
       maintenance = 0.015;
       maintenance_inflation = 0.05;
       insurance = 0;
       insurance_inflation = 0.01;
       power_production_price = 64000;
  
      } else if(plantCapacity <= 100){
       maintenance =0.015;
       maintenance_inflation = 0.05;
       insurance = 0.01;
       insurance_inflation = 0.01;
       power_production_price = 54000;
  
      } else {
       maintenance = 0.015;
       maintenance_inflation = 0.05;
       insurance = 0.01;
       insurance_inflation = 0.01;
       power_production_price = 49500;
      }
  
      console.log("maintenance",maintenance);
      console.log("maintenance_inflation",maintenance_inflation);
      console.log("insurance",insurance);
      console.log("insurance_inflation",insurance_inflation);
      console.log("power_production_price",power_production_price +" Rs/W");
  
      capex = plantCapacity * power_production_price;
      console.log("capex",capex);
  
      const debtCal = 1 - Debt / 100;
  
      equity = roundoff(capex * debtCal,0);
      console.log("equity",equity);
  
      var debt_amount = capex*Debt/100;
      console.log("debt amount",debt_amount);
  
      console.log("debt rate",debt_rate);
  
      const debtRateMonthly = debt_rate/12;
  
      console.log("debt tenure",debtTenure);
  
      plant_load_factor = parseFloat(sunhrs / 24);
      console.log("plant load factor",plant_load_factor);
  
      const efficiency_reduction1Cal = 1 - efficiency_reduction1;
      console.log("efficiency reduction calculation yoy",efficiency_reduction1Cal);
  
      const efficiency_reductionCal = 1 - efficiency_reduction;
      console.log("efficiency reduction calculation one",efficiency_reduction);
  
      var energy_produced_all = [];
  
      for (var i = 1; i <= 25; i++) {
        energy_produced = roundoff((plantCapacity * 365 * sunhrs * efficiency_reductionCal * Math.pow(efficiency_reduction1Cal, i-1)),2);
        energy_produced_all.push(energy_produced);
      }
  
      console.log("energy produced",energy_produced_all);
  
      const electricity_inflationCal = parseFloat(electricity_inflation) + 1;
      console.log("electricity_inflation",electricity_inflation)
      console.log("electricity_inflationCal",electricity_inflationCal)
  
      var elec_price_all = [];
  
           for (var i = 1; i <= 25; i++) {
            //elec_price = roundoff((rate_of_electricity * Math.pow(electricity_inflationCal,i-1)),2)
            elec_price = rate_of_electricity * Math.pow(electricity_inflationCal,i-1)
            elec_price_all.push(elec_price)
           }
  
           var revenue_all = []
  
           for (var i = 0; i <= 24; i++) {
            revenue = roundoff((energy_produced_all[i]*elec_price_all[i]),0)
            revenue_all.push(revenue)
           }
  
           console.log(elec_price_all)
           console.log(revenue_all)
  
           var full_loan_installment = [];
           var loan_installment = [];
           var interest_installment = [];
           var principle_installment = [];
           var installment_full;
           var installment;
           var interest;
           var principle_emi;
           var principle_full = capex;
           var principle = debt_amount;
  
           var var1 = Math.pow(1+debtRateMonthly,debtTenure*12);
           var var2;
           for (var i = 0; i < debtTenure; i++) {
  
              installment_full = roundoff((12*debtRateMonthly*principle_full*var1/(var1 - 1)),0);
              full_loan_installment.push(installment_full);
  
                installment = roundoff((12*debtRateMonthly*principle*var1/(var1 - 1)),0);
                loan_installment.push(installment);
  
                var2 = Math.pow(1+debtRateMonthly,(i*12)) * ( Math.pow(1+debtRateMonthly,12) - 1 );
                interest = (((principle*debtRateMonthly) - (installment/12))* var2 / debtRateMonthly) + installment;
                interest = roundoff(interest, 0);
                interest_installment.push(interest);
  
                principle_emi = installment - interest;
                principle_installment.push(principle_emi);
  
           }
  
           console.log("principle_installment",principle_installment)
           console.log("interest_installment",interest_installment)
  
           var maintenance_amount = [];
           var insurance_amount = [];
           var maint_temp;
  
           for (var i = 0; i <= 24; i++) {
  
            if(i < free_maint_years){
              maint_temp = 0
            } else {
              maint_temp = maintenance*Math.pow(1+maintenance_inflation,i)*capex
            }
  
            maintenance_amount.push(maint_temp)
  
            insurance_temp = insurance*Math.pow(1 - insurance_inflation,i)*capex;
            insurance_amount.push(insurance_temp);
  
           }
  
           console.log("maintenance", maintenance_amount)
           console.log("insurance", insurance_amount)
  
           var opening_asset_value = capex;
           var closing_asset_value;
           var depreciation_calc;
           var depreciation = [];
           var depreciation_accl = [];
           var depreciation_percent = 0.15;
           var depreciation_accl_percent1 = 0.4;
           var depreciation_accl_percent2 = 0.4;
           var depreciation_accl_percent3 = 0.4;
           var depreciation_accl_percent4 = 0.4;
           var tax_percent = 0.3;
           var tax_benefit_calc;
           var tax_benefit = [];
           var tax_benefit_accl = [];
  
           for (var i = 0; i <= 24; i++) {
  
            depreciation_calc = opening_asset_value*depreciation_percent;
            closing_asset_value = opening_asset_value - depreciation_calc;
  
            if (depreciation_calc < 1) {
  
            depreciation_calc = 0;
  
            }
  
            tax_benefit_calc = depreciation_calc*tax_percent;
            tax_benefit.push(tax_benefit_calc);
            depreciation.push(depreciation_calc);
  
            opening_asset_value = closing_asset_value;
  
           }
  
           opening_asset_value = capex;
           tax_benefit_calc = 0;
  
           for (var i = 0; i <= 24; i++) {
  
            if ( i === 0 ) {
              depreciation_calc = opening_asset_value*depreciation_accl_percent1;
            } else if ( i === 1 ) {
              depreciation_calc = opening_asset_value*depreciation_accl_percent2;
            } else if ( i === 2 ) {
              depreciation_calc = opening_asset_value*depreciation_accl_percent3;
            } else {
              depreciation_calc = opening_asset_value*depreciation_accl_percent4;
            }
  
            closing_asset_value = opening_asset_value - depreciation_calc;
  
            if (depreciation_calc < 1) {
  
            depreciation_calc = 0;
  
            }
  
            tax_benefit_calc = depreciation_calc*tax_percent;
            tax_benefit_accl.push(tax_benefit_calc);
            depreciation_accl.push(depreciation_calc);
  
            opening_asset_value = closing_asset_value;
  
           }
  
           console.log("depreciation_accl",depreciation_accl)
  
           //Subsidy Calculations
  
          capex = plantCapacity * power_production_price * subsidy_percent;
          capex_subsidy = capex;
  
          console.log("Subsidized capex",capex);
  
          equity = roundoff(capex * debtCal,0);
      console.log("Equity subsidised",equity);
  
      debt_amount = capex*Debt/100;
      console.log("Debt amount subsidised",debt_amount);
  
          var loan_installment_sub = [];
          var interest_installment_sub = [];
          var principle_installment_sub = [];
          var principle = debt_amount;
  
          var var1 = Math.pow(1+debtRateMonthly,debtTenure*12);
           var var2;
  
           for (var i = 0; i < debtTenure; i++) {
  
  
                installment = (12*debtRateMonthly*principle*var1/(var1 - 1));
                loan_installment_sub.push(installment);
  
                var2 = Math.pow(1+debtRateMonthly,(i*12)) * ( Math.pow(1+debtRateMonthly,12) - 1 );
                interest = (((principle*debtRateMonthly) - (installment/12))* var2 / debtRateMonthly) + installment;
                interest_installment_sub.push(interest);
  
                principle_emi = installment - interest;
                principle_installment_sub.push(principle_emi);
  
           }
  
           // End of subsidy calculations
  
  
           capex = plantCapacity * power_production_price;
  
           var extra_tax = [];
           var tax_benefit_interest = [];
           var extra_tax_calc;
           var tax_benefit_int_calc;
  
           for (var i = 0; i <= 24; i++) {
  
            extra_tax_calc = (revenue_all[i]-maintenance_amount[i]-insurance_amount[i])*tax_percent;
            extra_tax.push(extra_tax_calc);
  
            if( i < debtTenure ){
  
            if(subsidyCheck){
              tax_benefit_int_calc = interest_installment_sub[i]*tax_percent;
            } else {
              tax_benefit_int_calc = interest_installment[i]*tax_percent;
            }
  
            } else {
              tax_benefit_int_calc = 0;
            }
            tax_benefit_interest.push(tax_benefit_int_calc);
           }
  
           // Cashflow Calculations
  
           var cashflow_project = [];
           var cashflow_equity = [];
           let net_revenue = [];
           var cashflow_calc;
  
           for (var i = 0; i <= 24; i++) {
  
           cashflow_calc = 0;
  
           cashflow_calc = revenue_all[i] - maintenance_amount[i] - insurance_amount[i];
  
           net_revenue.push(cashflow_calc);
  
           if (extraTaxCheck) {
            cashflow_calc = cashflow_calc - extra_tax[i];
           }
  
           if (normalDepTaxBenefitCheck) {
            cashflow_calc = cashflow_calc + tax_benefit[i];
           }
  
           if (acclDepCheck) {
            cashflow_calc = cashflow_calc + tax_benefit_accl[i];
           }
  
           cashflow_project.push(roundoff(cashflow_calc,0));
  
           }
  
           for (var i = 0; i <= 24; i++) {
  
           cashflow_calc = 0;
  
           cashflow_calc = revenue_all[i] - maintenance_amount[i] - insurance_amount[i];
  
           if ( i < debtTenure ){
         if (subsidyCheck) {
              cashflow_calc = cashflow_calc - loan_installment_sub[i];
             } else {
              cashflow_calc = cashflow_calc - loan_installment[i];
             }
           }
  
  
           if (extraTaxCheck) {
            cashflow_calc = cashflow_calc - extra_tax[i];
           }
  
           if (normalDepTaxBenefitCheck) {
            cashflow_calc = cashflow_calc + tax_benefit[i];
           }
  
           if (acclDepCheck) {
            cashflow_calc = cashflow_calc + tax_benefit_accl[i];
           }
  
           if (taxBenefitInterestCheck) {
            cashflow_calc = cashflow_calc + tax_benefit_interest[i];
           }
  
           cashflow_equity.push(cashflow_calc);
  
           }
  
  console.log("Cashflow Project caluclations: "+cashflow_project)
  console.log("Cashflow Equity caluclations: "+cashflow_equity)
  
  var twentyyrsavings = net_revenue.reduce((a, b) => a + b, 0);
  
  return { plantCapacity, roofArearequired, roofAreaMessage, power_production_price, Debt, installment_full, tax_benefit_accl, cashflow_project, equity, cashflow_equity, twentyyrsavings}
  
  }
  