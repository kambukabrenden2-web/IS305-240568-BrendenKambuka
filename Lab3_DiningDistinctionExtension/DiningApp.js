import DiningAccount from "./DiningAccount.js";
import RewardsDiningAccount from "./RewardsDiningAccount.js";
import CreditDiningAccount from "./CreditDiningAccount.js";
import Student from "./Student.js";
import MealBooking from "./MealBooking.js";

function runLab3App() {
    console.log("========================================");
    console.log("    DWU DINING ACCOUNT DISTINCTION APP  ");
    console.log("========================================");

    // 1. Part 1 Demonstration: Standard & Rewards Accounts
    console.log("\n[DEMO 1] Standard & Rewards Accounts");
    const standardAcc = new DiningAccount("DA001", 1000.00);
    standardAcc.deposit(500.00, "Weekly meal allowance");
    standardAcc.payForMeal(200.00, "Lunch at cafeteria");
    console.log(`Standard Final Balance: K${standardAcc.getBalance().toFixed(2)}`);

    const rewardsAcc = new RewardsDiningAccount("RA001", 2000.00, 2.5);
    const rewardEarned = rewardsAcc.calculateReward();
    rewardsAcc.applyReward();
    console.log(`Rewards Account Final Balance: K${rewardsAcc.getBalance().toFixed(2)} (Reward Earned: K${rewardEarned.toFixed(2)})`);

    // 2. Part 2 Demonstration: Credit Account & Method Overriding
    console.log("\n[DEMO 2] Credit Account & Overriding");
    const creditAcc = new CreditDiningAccount("CA001", 1000.00, 500.00);
    console.log("Attempting payment within credit limit (K1500.00):");
    creditAcc.payForMeal(1500.00, "Large catering order");
    console.log(`Credit Account Balance: K${creditAcc.getBalance().toFixed(2)}`);

    console.log("Attempting payment exceeding credit limit:");
    creditAcc.payForMeal(200.00, "Extra snacks");

    // 3. Polymorphism Demonstration across an array of accounts
    console.log("\n[DEMO 3] Polymorphic Account Array Processing");
    const accounts = [
        new DiningAccount("DA002", 300.00),
        new RewardsDiningAccount("RA002", 800.00, 3.0),
        new CreditDiningAccount("CA002", 100.00, 300.00)
    ];

    for (const acc of accounts) {
        acc.displayAccountSummary();
        console.log("----------------------------------------");
    }

    // 4. Student & Booking Integration Workflow
    console.log("\n[DEMO 4] Student & MealBooking Integration");
    const student = new Student("DWU2026001", "Maria Kila");
    const studentAccount = new RewardsDiningAccount("RA999", 100.00, 2.0);
    student.assignDiningAccount(studentAccount);

    console.log(`Student: ${student.name} (ID: ${student.studentId})`);
    console.log(`Assigned Account Type: ${student.diningAccount.constructor.name}`);

    const booking = new MealBooking("Dinner", 2, 20.00); // Total K40.00
    booking.processPayment(student.diningAccount);

    // Test Duplicate Payment Prevention
    console.log("\nTesting Duplicate Payment Prevention:");
    booking.processPayment(student.diningAccount);

    // 5. Transaction History Report
    console.log("\n========================================");
    console.log("          TRANSACTION HISTORY           ");
    console.log("========================================");
    const txs = student.diningAccount.getTransactions();
    txs.forEach((tx, idx) => {
        console.log(`${idx + 1}. ${tx.type} - K${tx.amount.toFixed(2)}`);
        console.log(`   Description: ${tx.description}`);
        console.log(`   Balance After: K${tx.balanceAfter.toFixed(2)}`);
    });
    console.log(`\nTotal Transactions: ${txs.length}`);
    console.log("========================================");
}

runLab3App();