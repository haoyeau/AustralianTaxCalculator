class AustralianTaxCalculator {
    constructor() {
        this.taxBrackets = [
            { min: 0, max: 18200, rate: 0, baseTax: 0 },
            { min: 18201, max: 45000, rate: 0.16, baseTax: 0 },
            { min: 45001, max: 135000, rate: 0.30, baseTax: 4288 },
            { min: 135001, max: 190000, rate: 0.37, baseTax: 31288 },
            { min: 190001, max: Infinity, rate: 0.45, baseTax: 51638 }
        ];

        this.init();
    }

    init() {
        this.form = document.getElementById('taxForm');
        this.resultsDiv = document.getElementById('results');
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateTax();
        });

        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                if (this.form.checkValidity()) {
                    this.calculateTax();
                }
            });
        });

        // Add event listeners for deduction inputs to update total in real-time
        const deductionIds = [
            'deductCars','deductTools','deductClothes','deductWFH','deductEducation','deductMemberships','deductMeals','deductPersonal','deductGifts','deductInvestments','deductTaxAffairs','deductOccupation'
        ];
        deductionIds.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => this.updateTotalDeductions());
            }
        });
        // Initialize display
        this.updateTotalDeductions();
    }

    calculateTax() {
        const formData = new FormData(this.form);
        const data = {
            grossIncome: parseFloat(formData.get('taxableIncome')) || 0,
            deductCars: parseFloat(formData.get('deductCars')) || 0,
            deductTools: parseFloat(formData.get('deductTools')) || 0,
            deductClothes: parseFloat(formData.get('deductClothes')) || 0,
            deductWFH: parseFloat(formData.get('deductWFH')) || 0,
            deductEducation: parseFloat(formData.get('deductEducation')) || 0,
            deductMemberships: parseFloat(formData.get('deductMemberships')) || 0,
            deductMeals: parseFloat(formData.get('deductMeals')) || 0,
            deductPersonal: parseFloat(formData.get('deductPersonal')) || 0,
            deductGifts: parseFloat(formData.get('deductGifts')) || 0,
            deductInvestments: parseFloat(formData.get('deductInvestments')) || 0,
            deductTaxAffairs: parseFloat(formData.get('deductTaxAffairs')) || 0,
            deductOccupation: parseFloat(formData.get('deductOccupation')) || 0
        };

        const totalDeductions = data.deductCars + data.deductTools + data.deductClothes + data.deductWFH + data.deductEducation + data.deductMemberships + data.deductMeals + data.deductPersonal + data.deductGifts + data.deductInvestments + data.deductTaxAffairs + data.deductOccupation;
        const taxableIncome = Math.max(0, data.grossIncome - totalDeductions);

        const incomeTax = this.calculateIncomeTax(taxableIncome);
        const totalTax = incomeTax;
        const takeHomePay = data.grossIncome - totalTax;
        const effectiveTaxRate = data.grossIncome > 0 ? (totalTax / data.grossIncome) * 100 : 0;

        this.displayResults({
            ...data,
            totalDeductions,
            taxableIncome,
            incomeTax,
            totalTax,
            takeHomePay,
            effectiveTaxRate
        });
    }

    calculateIncomeTax(taxableIncome) {
        const bracket = this.taxBrackets.find(b => 
            taxableIncome >= b.min && taxableIncome <= b.max
        );

        if (!bracket) return 0;

        const excessIncome = taxableIncome - bracket.min;
        const taxOnExcess = excessIncome * bracket.rate;
        
        return bracket.baseTax + taxOnExcess;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatPercentage(percentage) {
        return percentage.toFixed(1) + '%';
    }

    displayResults(results) {

        document.getElementById('taxableIncomeResult').textContent = this.formatCurrency(results.taxableIncome);
        document.getElementById('incomeTaxResult').textContent = this.formatCurrency(results.incomeTax);
        document.getElementById('totalTaxResult').textContent = this.formatCurrency(results.totalTax);
        document.getElementById('takeHomeResult').textContent = this.formatCurrency(results.takeHomePay);
        document.getElementById('effectiveTaxRateResult').textContent = this.formatPercentage(results.effectiveTaxRate);

        this.resultsDiv.classList.remove('hidden');
        
        this.resultsDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });

        this.resultsDiv.style.animation = 'fadeInUp 0.5s ease-out';
    }

    updateTotalDeductions() {
        const ids = [
            'deductCars','deductTools','deductClothes','deductWFH','deductEducation','deductMemberships','deductMeals','deductPersonal','deductGifts','deductInvestments','deductTaxAffairs','deductOccupation'
        ];
        let total = 0;
        ids.forEach(id => {
            const input = document.getElementById(id);
            if (input) total += parseFloat(input.value) || 0;
        });
        
        const display = document.getElementById('totalDeductionsDisplay');
        if (display) display.textContent = this.formatCurrency(total);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    new AustralianTaxCalculator();
});

function addCommasToNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

document.addEventListener('DOMContentLoaded', () => {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    
    numberInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value < 0) {
                e.target.value = 0;
            }
        });
    });
}); 