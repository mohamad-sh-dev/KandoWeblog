exports.truncate = (string , length) =>{
    if(string.length > length && string.length > 0) {
        let new_string = string + " " ;
        new_string = string.substr(0 , length) ; 
        // etc. 0 to 400
        new_string = string.substr(0 , new_string.lastIndexOf(" ")) ;
        new_string = new_string.length > 0 ? new_string : string.substr(0 , length) ;
        return new_string + "..." ;
    }
    return string
}