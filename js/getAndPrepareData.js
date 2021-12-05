export default function getAndPrepareData() {
    const dataURL='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

    return d3.json(dataURL).then(json => {
        // process json to obtain arrays of needed data

        const parseTime = d3.timeParse("%M:%S");
        const years = json.map(obj => obj.Year) // x values
        // (d3 deals with time scales using date objects) 
        const times = json.map(obj => new Date(parseTime(obj.Time))) // y values (date objects)
            .concat([new Date(parseTime('39:55')), new Date(parseTime('36:40'))]) // add some space at the start/end of y axis
        const names = json.map(obj => obj.Name)
        const doping = json.map(obj => obj.Doping)

        return {
            years,
            times,
            names,
            doping
        }
    })
}