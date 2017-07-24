function sortByRam(sortingInfo, cursor){
    var ram = 1;
    for(var i = 0; i < sortingInfo.length; i++) {
        if (sortingInfo[i].operator === "+")
            ram = -1;
    }
    return cursor.sort({ram: ram})
}

function sortBy(params, cursor){

}

var findBy = {
    cursor: null,
    sortingInfo: [],
    methode:function(tech, operator, value, type, collection){
        var ii = 0,
            valueI = 0;
        var query = null;
        console.log(tech[0]);
        for(var i = 0; i < tech.length; i++){
            if(operator[i] === "+" || operator[i] === "-") {
                this.sortingInfo[ii++] = {
                    tech: tech,
                    operator: operator
                }
            }
            if(operator[i] === "<" || operator[i] === ">" || operator[i] === "="){
                var and = true;
                if(!query)
                    and = null;
                if(and){
                    if(operator[i] === "=")
                        query = query + "&& tech["+i+"] == value["+valueI+"]";
                    else
                        query = query + " && tech["+i+"] " + operator[i] + " value["+valueI+"]";
                }
                else{
                    if(operator[i] === "=")
                        query = "tech["+i+"] == value["+valueI+"]";
                    else
                        query = "tech["+i+"] " + operator[i] + " value["+valueI+"]";
                }
                valueI++;
            }
        }
        console.log("query: " + query);
        if(this.sortingInfo)

        if(type)
            this.cursor = collection.find({type: type})
        else {
            this.cursor = collection.find(query)
        }
    }
}

exports.pcSearch = function(params, collection, speech, reply){
    findBy.methode(params.tech, params.operator, params.number, params.type_pc, collection);
    if(!findBy.cursor){
        console.log("cursor empty");
        this.speech(reply, "Désolé, aucun ordinateur correspondant à ta recherche dans mes connaissances");
    }
    else {
        findBy.cursor = sortByRam(params, findBy.cursor);
        findBy.cursor.toArray().then(arr => {
            if (arr[0].name){
                var text = speech + ' ' + arr[0].name
                    + ' avec une memoire vive de ' + arr[0].ram + ' Go, un disque dur de '
                    + arr[0].memoire + ' Go et pour un prix de '
                    + arr[0].prix + ' euros.';
                console.log("responding: " + text);
                this.speech(reply, text);
            }
            else{
                console.log("cursor empty");
                this.speech(reply, "Désolé, aucun ordinateur correspondant à ta recherche dans mes connaissances");
            }
        });
    }
}

exports.speech = function Speech(reply, speech){
    reply({text: speech}, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log(info);
    })
}