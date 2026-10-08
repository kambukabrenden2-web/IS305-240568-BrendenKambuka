import DiningAccount from "./DiningAccount.js";

class RewardsDiningAccount extends DiningAccount {
    #rewardRate;

    constructor(accountNumber, openingBalance = 0, rewardRate = 0) {
        super(accountNumber, openingBalance);
        if (rewardRate < 0) {
            throw new Error("Reward rate cannot be negative.");
        }
        this.#rewardRate = rewardRate;
    }

    get rewardRate() {
        return this.#rewardRate;
    }

    set rewardRate(rate) {
        if (rate < 0) throw new Error("Reward rate cannot be negative.");
        this.#rewardRate = rate;
    }

    calculateReward() {
        return (this.getBalance() * this.#rewardRate) / 100;
    }

    applyReward() {
        const rewardAmount = this.calculateReward();
        if (rewardAmount > 0) {
            this.deposit(rewardAmount, `Reward Bonus (${this.#rewardRate}%)`);
        }
        return rewardAmount;
    }

    displayAccountSummary() {
        console.log("========================================");
        console.log("        REWARDS DINING ACCOUNT          ");
        console.log("========================================");
        console.log(`Account Number: ${this.accountNumber}`);
        console.log(`Account Type: RewardsDiningAccount`);
        console.log(`Reward Rate: ${this.#rewardRate}%`);
        console.log(`Current Balance: K${this.getBalance().toFixed(2)}`);
    }
}

export default RewardsDiningAccount;