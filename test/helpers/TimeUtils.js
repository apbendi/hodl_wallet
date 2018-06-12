class TimeUtils {

    static async latestTime() {
	let latestBlock = await web3.eth.getBlock('latest');
	return latestBlock.timestamp;
    }

    static async latestTimeWithOffset(seconds) {
	let latestTime = await this.latestTime();
	return latestTime + seconds;
    }

    static async increaseTime(seconds) {
	await web3.currentProvider.send({
	    jsonrpc: "2.0",
	    method: "evm_increaseTime",
	    params: [seconds], 
	    id: 0
	});
    }
}

module.exports = TimeUtils;
