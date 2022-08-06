const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

fs.readdir("./data/reworked/", (err: any, filenames: string[]) => {
    filenames.forEach((filename) => {
        fs.readFile("./data/reworked/" + filename, "utf-8", (err: any, content: any) => {
            if (err) {
                console.log(err);
            }

            renderChart(filename, JSON.parse(content));

        });
    });
});

async function renderChart(filename: string, contents: any) {
    const labels: string[] = [];
    const data: number[] = [];

    const label: string = filename.includes("haus") ? "Anzahl Häuser" : "Anzahl Wohnungen";

    for (const element of contents) {
        labels.push(element[0]);
        data.push(element[1]);
    };

    const width = 1000; //px
    const height = 600; //px
    const backgroundColour = "white";
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

    (async () => {
        const configuration = {
            type: "line",
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: filename
                    }
                }
            },
            data: {
                labels: labels,
                datasets: [{
                    label: label, data: data,
                    fill: false,
                    borderColor: "#bae755",
                    borderDash: [5, 5],
                    backgroundColor: "#55bae7",
                    pointBackgroundColor: "#55bae7",
                    pointBorderColor: "#55bae7",
                    pointHoverBackgroundColor: "#55bae7",
                    pointHoverBorderColor: "#55bae7",
                }]
            }
        };

        // Create outputs
        const image = await chartJSNodeCanvas.renderToBuffer(configuration);
        fs.writeFile("./data/charts/" + filename + ".png", image, function (err: any, result: any) {
            if (err) console.log('error', err);
        });
    })();
}

