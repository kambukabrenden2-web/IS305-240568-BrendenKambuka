// DiningApp.js
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import Student from './Student.js';
import MealBooking from './MealBooking.js';

const bookingArray = [];

function displayBookingHistory(student, bookings) {
  const studentBookings = bookings.filter(b => b.student.studentId === student.studentId);

  console.log('\n========================================');
  console.log('            BOOKING HISTORY             ');
  console.log('========================================');
  student.displayInfo();
  console.log('');

  if (studentBookings.length === 0) {
    console.log('No bookings found for this student.');
  } else {
    let combinedCost = 0;
    studentBookings.forEach((booking, idx) => {
      console.log(booking.getSummary(idx + 1));
      console.log('');
      combinedCost += booking.calculateTotal();
    });

    console.log(`Total Bookings: ${studentBookings.length}`);
    console.log(`Combined Cost: K${combinedCost.toFixed(2)}`);
  }
  console.log('========================================');
}

async function runDiningApp() {
  const rl = readline.createInterface({ input, output });

  try {
    console.log('--- Dining Meal Booking Application (Lab 2) ---\n');

    // 1. Collect student info
    const studentId = await rl.question('Enter Student ID: ');
    const firstName = await rl.question('Enter First Name: ');
    const lastName = await rl.question('Enter Last Name: ');

    const student = new Student(studentId, firstName, lastName);

    // 2. Collect Booking 1
    console.log('\n--- Enter Booking 1 Details ---');
    const mealType1 = await rl.question('Enter Meal Type (Breakfast/Lunch/Dinner): ');
    const mealDate1 = await rl.question('Enter Meal Date (e.g., 12 August 2026): ');
    const quantity1 = await rl.question('Enter Quantity: ');
    const dietary1 = await rl.question('Enter Dietary Note (optional): ');

    const booking1 = new MealBooking(student, mealDate1, mealType1, quantity1, dietary1, 'Confirmed');
    bookingArray.push(booking1);

    // 3. Collect Booking 2
    console.log('\n--- Enter Booking 2 Details ---');
    const mealType2 = await rl.question('Enter Meal Type (Breakfast/Lunch/Dinner): ');
    const mealDate2 = await rl.question('Enter Meal Date (e.g., 13 August 2026): ');
    const quantity2 = await rl.question('Enter Quantity: ');
    const dietary2 = await rl.question('Enter Dietary Note (optional): ');

    const booking2 = new MealBooking(student, mealDate2, mealType2, quantity2, dietary2, 'Pending');
    bookingArray.push(booking2);

    // Display Booking History
    displayBookingHistory(student, bookingArray);

    // 4. Test Student Name Update Reference Sharing
    const updateChoice = await rl.question('\nWould you like to update the student last name to test reference sharing? (y/n): ');
    if (updateChoice.toLowerCase() === 'y') {
      const newLastName = await rl.question('Enter New Last Name: ');
      student.lastName = newLastName;

      console.log('\n--- Booking History After Student Name Update ---');
      displayBookingHistory(student, bookingArray);
    }

  } catch (error) {
    console.error(`\nError: ${error.message}`);
  } finally {
    rl.close();
  }
}

runDiningApp();