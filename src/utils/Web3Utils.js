class Web3Utils {

    static etherToWei(etherAmount) {
	if (null === window.web3) {
	    console.log("No web3 found on window!");
	    return NaN;
	}

	return window.web3.toWei(etherAmount, 'ether');
    }
}

export default Web3Utils;
