interface Location {
    name: string,
    shapeId: number
};

interface RealEstateType {
    name: string,
    prop: string
};

export const locations : Location[] = [
    {
        name: "Deutschland Gesamt",
        shapeId: 1276
    },
    {
        name: "Rhein-Neckar-Kreis",
        shapeId: 1276001034
    },
    {
        name: "Berlin",
        shapeId: 1276003001
    },
    {
        name: "Heidelberg",
        shapeId: 1276001014
    },
    {
        name: "Stuttgart",
        shapeId: 1276001039
    },
    {
        name: "München",
        shapeId: 1276002059
    },
    {
        name: "Dortmund",
        shapeId: 1276010009
    },
    {
        name: "Hamburg",
        shapeId: 1276006001
    },
    {
        name: "Karlsruhe",
        shapeId: 1276001019
    },
    {
        name: "Düsseldorf",
        shapeId: 1276010012
    },
    {
        name: "Köln",
        shapeId: 1276010028
    },
    {
        name: "Hannover",
        shapeId: 1276009017
    },
    {
        name: "Dresden",
        shapeId: 1276013007
    },
    {
        name: "Mainz",
        shapeId: 1276011021
    },
    {
        name: "Baden-Württemberg",
        shapeId: 1276001
    },
    {
        name: "Bayern",
        shapeId: 1276002
    },
    {
        name: "Brandenburg",
        shapeId: 1276004
    },
    {
        name: "Bremen",
        shapeId: 1276005
    },
    {
        name: "Hessen",
        shapeId: 1276007
    },
    {
        name: "Mecklenburg-Vorpommern",
        shapeId: 13000
    },
    {
        name: "Niedersachsen",
        shapeId: 1276009
    },
    {
        name: "Nordrhein-Westfalen",
        shapeId: 1276010
    },
    {
        name: "Rheinland-Pfalz",
        shapeId: 1276011
    },
    {
        name: "Saarland",
        shapeId: 1276012
    },
    {
        name: "Sachsen-Anhalt",
        shapeId: 1276014
    },
    {
        name: "Sachsen",
        shapeId: 1276013
    },
    {
        name: "Schleswig-Holstein",
        shapeId: 1276015
    },
    {
        name: "Thüringen",
        shapeId: 1276016
    }
];

const realEstateTypes: RealEstateType[] = [
    {
        name: "Haus Kaufen",
        prop: "HOUSE_BUY"
    },
    {
        name: "Wohnung Kaufen",
        prop: "APARTMENT_BUY"
    }
];

const results : [any] = [ [ "Ort", "Häuser", "Wohnungen" ] ];

for(const location of locations){
    const axios = require('axios');
    const fs = require('fs');

    const newEntry = [ location.name, 0, 0];

    const reqOne = 
    axios
        .post(
            'https://www.immobilienscout24.de/Suche/controller/oneStepSearch/resultCount.json?world=LIVING&location=xyz&gacId=&geoCodeId=&geographicalEntityType=&region=&district=&postcode=&city=&quarter=&street=&geoDataX=&geoDataY=&onlyNewHomeBuilder=false&shapeId='
            +location.shapeId
            +'&price=&noOfRooms=&area=&radius=NONE&realEstateType='
            +realEstateTypes[0].prop
            +'&source=ONE_STEP_SEARCH_HP',
            {
                headers: {
                    "Host": "http://www.immobilienscout24.de/",
                    "User-Agent": 'PostmanRuntime/7.29.0'
                }
            }
        );

    const reqTwo = 
    axios
        .post(
            'https://www.immobilienscout24.de/Suche/controller/oneStepSearch/resultCount.json?world=LIVING&location=xyz&gacId=&geoCodeId=&geographicalEntityType=&region=&district=&postcode=&city=&quarter=&street=&geoDataX=&geoDataY=&onlyNewHomeBuilder=false&shapeId='
            +location.shapeId
            +'&price=&noOfRooms=&area=&radius=NONE&realEstateType='
            +realEstateTypes[1].prop
            +'&source=ONE_STEP_SEARCH_HP',
            {
                headers: {
                    "Host": "http://www.immobilienscout24.de/",
                    "User-Agent": 'PostmanRuntime/7.29.0'
                }
            }
        );
    
    axios.all([reqOne, reqTwo]).then(axios.spread((...responses : any) => {
        newEntry[1] = responses[0].data?.count;
        newEntry[2] = responses[1].data?.count;

        results.push(newEntry);
        if(results.length === locations.length+1){
            fs.writeFile("./data/raw/"+new Date().toISOString().slice(0,10)+'.json', JSON.stringify(results), function (err: any) {
                if (err) return console.log(err);
            });
        }
    }));
}

