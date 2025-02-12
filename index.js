import Cli from "./db/Cli.js";

const main = async () => {
    let running = true;
    while (running) {
        running = await Cli();
        console.log(running)
    }
}

main();