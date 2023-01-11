import { locations } from "./mine";

const fs = require('fs');

fs.readdir("./data/raw/", (err: any, filenames: string[]) => {
    const contents : any[] = [];
    filenames = filenames.filter(x => x.includes(".json"));
    filenames.forEach((filename) => {
        fs.readFile("./data/raw/"+filename, "utf-8", (err: any, content: any) => {
            if(err){
                console.log(err);
            }else{
                contents.push([filename.substring(0,10), JSON.parse(content)]);
            }

            if(contents.length === filenames.length){
                excelize(contents);
            }
            
        });
    });
});

function excelize(contents: any[]) {

    for(const ort of locations){
        const outHaus = [];
        const outWohnung = [];

        for(const day of contents){
            if(JSON.stringify(day).includes(ort.name)){
                outHaus.push([day[0], day[1].find((x : any) => x[0] === ort.name)[1]]);
                outWohnung.push([day[0], day[1].find((x : any) => x[0] === ort.name)[2]]);
            }
        }
        outHaus.sort((a,b)  => a[0].split("-").join("") - b[0].split("-").join(""));
        outWohnung.sort((a,b)  => a[0].split("-").join("") - b[0].split("-").join(""));
        write(ort.name+"-haus", outHaus);
        write(ort.name+"-wohnung", outWohnung);
    }
}

function write(fname: string, content: any){
    fs.writeFile("./data/reworked/"+fname+'.json', JSON.stringify(content), function (err: any) {
        if (err) return console.log(err);
    });
}