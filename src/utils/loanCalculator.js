export function calculateEMI(principal, annualRate, tenureYears) {
    const monthlyRate = annualRate / 12 / 100;
    const tenureMonths = tenureYears * 12;
    
    if (monthlyRate === 0) {
      return {
        monthlyEMI: (principal / tenureMonths).toFixed(2),
        totalPrincipal: principal.toFixed(2),
        totalInterest: "0.00",
        totalAmount: principal.toFixed(2),
      };
    }
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    const totalAmount = emi * tenureMonths;
    const totalInterest = totalAmount - principal;
    
    return {
      monthlyEMI: emi.toFixed(2),
      totalPrincipal: principal.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  }
  
  export function calculateLoanEligibility(monthlyIncome, existingEMI = 0) {
    const maxEMIRatio = 0.5; // 50% of income
    const maxAllowedEMI = monthlyIncome * maxEMIRatio;
    const availableEMI = maxAllowedEMI - existingEMI;
    
    return {
      maxAllowedEMI: maxAllowedEMI.toFixed(2),
      availableEMI: Math.max(0, availableEMI).toFixed(2),
      isEligible: availableEMI > 0
    };
  }
  