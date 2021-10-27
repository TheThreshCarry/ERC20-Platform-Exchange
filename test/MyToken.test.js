const MyToken = artifacts.require('MyToken');

contract('MyToken', (accounts) => {

    //let MyToken;
    before(async () => {
        myToken = await MyToken.new();
       
    })

    it('Balance is set up', async () => {

        // Send 100 wei to the contract.
        // `sendEth` is your payable method.
        let balance = await myToken.balanceOf(accounts[0]);
       assert.equal(balance.toString(), 100000);
    });
    describe("Buying", async () => {
            
        
        it('can buy with eth', async () => {
            await myToken.buyToken({from:accounts[1], value: web3.utils.toWei("1", "ether")})
            let balanceOfInvestor = await myToken.balanceOf(accounts[1]);
           assert.equal(balanceOfInvestor.toString(), 100, "has 100 tokens");
        })
        it("can transfer MyToken", async () => {
            await myToken.transfer(accounts[1], myToken.address, 100);
            balanceSender = await myToken.balanceOf(accounts[1]);
            balanceSwap = await myToken.balanceOf(myToken.address);
            assert.equal(balanceSender, 0);
        })
    })
  
});