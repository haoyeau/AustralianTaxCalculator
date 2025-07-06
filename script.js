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
    }

    calculateTax() {
        const formData = new FormData(this.form);
        const data = {
            taxableIncome: parseFloat(formData.get('taxableIncome')) || 0
        };

        const incomeTax = this.calculateIncomeTax(data.taxableIncome);
        const totalTax = incomeTax;
        const takeHomePay = data.taxableIncome - totalTax;
        const effectiveTaxRate = data.taxableIncome > 0 ? (totalTax / data.taxableIncome) * 100 : 0;

        this.displayResults({
            ...data,
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

    displayResults(results) {
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-AU', {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        };

        const formatPercentage = (percentage) => {
            return percentage.toFixed(1) + '%';
        };

        document.getElementById('taxableIncomeResult').textContent = formatCurrency(results.taxableIncome);
        document.getElementById('incomeTaxResult').textContent = formatCurrency(results.incomeTax);
        document.getElementById('totalTaxResult').textContent = formatCurrency(results.totalTax);
        document.getElementById('takeHomeResult').textContent = formatCurrency(results.takeHomePay);
        document.getElementById('effectiveTaxRateResult').textContent = formatPercentage(results.effectiveTaxRate);

        this.resultsDiv.classList.remove('hidden');
        
        this.resultsDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });

        this.resultsDiv.style.animation = 'fadeInUp 0.5s ease-out';
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