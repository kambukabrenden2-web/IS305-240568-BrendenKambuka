const readline = require("readline");
const MealBooking = require("./MealBooking");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let bookings = [];

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}

async function main() {
  try {
    const studentId = await askQuestion("Student ID: ");
    const studentName = await askQuestion("Student name: ");
    const mealDate = await askQuestion("Meal date (YYYY-MM-DD): ");
    const mealType = await askQuestion("Meal type (Breakfast/Lunch/Dinner): ");
    const quantity = parseInt(await askQuestion("Quantity: "), 10);
    const dietaryNote = await askQuestion("Dietary note: ");

    const booking = new MealBooking(studentId, studentName, mealDate, mealType, quantity, dietaryNote);

    booking.validate();

    const duplicate = bookings.find(b =>
      b.studentId === booking.studentId &&
      b.mealDate === booking.mealDate &&
      b.mealType === booking.mealType
    );
    if (duplicate) {
      throw new Error("Duplicate booking detected.");
    }

    bookings.push(booking);

    console.log(booking.getSummary());

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    rl.close();
  }
}
main();
