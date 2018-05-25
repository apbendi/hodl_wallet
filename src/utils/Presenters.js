class Presenters {
    
    static presentDate(unixDate) {
	let date = new Date(1000*unixDate);
	return date.toString();
    }

    static presentBalance(weiBalance) {
	if (null === weiBalance) {
	    return '0 ETH';
	}

	let web3 = checkWeb3();
	if (null === web3) { 
	    return 'Unknown';
	}	

	let ethString = web3.fromWei(weiBalance, 'ether').toString();
	return ethString + ' ETH';
    }

    static presentAddress(fullAddress) {
	return fullAddress.substring(0, 6);
    }
}

function checkWeb3() {
    let web3 = window.web3;

    if (null === web3 || typeof web3 === 'undefined') {
	console.log("Failed to find Web3 in Presenters");
	return null;
    }

    return web3;
}

export default Presenters;
