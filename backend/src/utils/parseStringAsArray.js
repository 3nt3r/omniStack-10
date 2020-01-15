module.exports = function parseStringAAsArray(arrayAsString){
    return arrayAsString.split(',').map(tech => tech.trim());
}
