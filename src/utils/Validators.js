class Validators {

    static isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
    }   
}

export default Validators;
