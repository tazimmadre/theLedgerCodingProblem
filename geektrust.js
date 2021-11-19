import fs from "fs";
import readline from "readline";
const run = async () => {
  const filename = process.argv[2];
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let data = [];
  for await (const line of rl) {
    const commands = line.split(" ");
    if (commands[0] == "LOAN") {
      const bank_name = commands[1];
      const borrower_name = commands[2];
      const principal = parseInt(commands[3]);
      const no_of_years = parseInt(commands[4]);
      const rate_of_interest = parseInt(commands[5]);
      const interest = Math.ceil(
        (principal * no_of_years * rate_of_interest) / 100
      );
      const amount = principal + interest;
      const no_of_emis = 12 * no_of_years;
      const emi_per_month = Math.ceil(amount / no_of_emis);
      data.push({
        amount: amount,
        bank_name: bank_name,
        borrower_name: borrower_name,
        total_emis_remaining: no_of_emis,
        no_of_emis: no_of_emis,
        emi_per_month: emi_per_month,
        lump_sum: 0,
        roundedEMI: 0,
        payment_emi: 0,
      });
    } else if (commands[0] == "PAYMENT") {
      const filteredata = data.filter((x) => x.borrower_name == commands[2]);
      filteredata[0].total_emis_remaining += 1;
      filteredata[0].payment_emi = commands[4];
      filteredata[0].amount -=
        parseInt(commands[3]) +
        parseInt(commands[4]) * filteredata[0].emi_per_month;
      filteredata[0].lump_sum += parseInt(commands[3]);
      filteredata[0].no_of_emis -= parseInt(commands[4] + 1);
      filteredata[0].total_emis_remaining;
      const roundedEMI = Math.ceil(commands[3] / filteredata[0].emi_per_month);
      filteredata[0].roundedEMI = roundedEMI;
    } else if (commands[0] == "BALANCE") {
      const filteredata = data.filter((x) => x.borrower_name == commands[2]);
      let amount_paid = 0;
      if (parseInt(commands[3]) < filteredata[0].payment_emi) {
        amount_paid = parseInt(commands[3] * filteredata[0].emi_per_month);
        filteredata[0].no_of_emis =
          filteredata[0].total_emis_remaining - 1 - commands[3];
      } else {
        amount_paid = parseInt(
          commands[3] * filteredata[0].emi_per_month + filteredata[0].lump_sum
        );
        filteredata[0].no_of_emis =
          filteredata[0].total_emis_remaining -
          commands[3] -
          filteredata[0].roundedEMI;
      }
      console.log(
        filteredata[0].bank_name +
          " " +
          filteredata[0].borrower_name +
          " " +
          amount_paid +
          " " +
          filteredata[0].no_of_emis
      );
    }
  }
};

run();
